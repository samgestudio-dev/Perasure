#!/usr/bin/env node
/* PeraSure Dev Mode — the local MCP server (stdio), for use inside a clone of the repo. Developers normally connect to the hosted
   server instead (https://samge.studio/perasure/devmode/mcp — see devmode/mcp/README.md): same tools, nothing to install. This one
   reads the clone's files and adds what needs a browser — screenshots, design QA and live measurements — when Playwright is installed.

   One file plus core.mjs (the tools both servers share), no dependencies, Node 18+. Talks MCP over stdio (newline-delimited JSON-RPC).
     node devmode/mcp/server.mjs            run as an MCP server (an AI tool starts it)
     node devmode/mcp/server.mjs --check    test it and print what it can read
     node devmode/mcp/server.mjs --help     how to add it to Claude Code / Cursor / Codex
   PERASURE_ROOT=<repo folder> reads another clone. Keep in step with devmode/data/*.js and devmode/js/inspector.js. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createDevmode, screenOf, screenUrl, VERSION, NAME, HOSTED } from './core.mjs';
import { localData } from './local.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LOCAL = (() => {
  for (const r of [process.env.PERASURE_ROOT, path.resolve(HERE, '..', '..')]) if (r && fs.existsSync(path.join(r, 'devmode', 'data', 'index.js'))) return path.resolve(r);
  return null;
})();
const log = (...a) => process.stderr.write('[' + NAME + '] ' + a.join(' ') + '\n');
if (!LOCAL) { log(`not inside a clone of the repo (set PERASURE_ROOT). Without a clone, connect to the hosted server: ${HOSTED}devmode/mcp`); process.exit(1); }

const readLocal = rel => fs.promises.readFile(path.join(LOCAL, rel), 'utf8');
const DM = createDevmode({
  site: HOSTED,
  label: 'local clone ' + LOCAL,
  browser: true,
  read: readLocal,
  /* a file as it was in an older version: its git tag devmode-<id> (exact), else core reads the version's snapshot copy */
  readTag: async (ver, rel) => { try { return execFileSync('git', ['show', `devmode-${ver}:${rel}`], { cwd: LOCAL, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32e6 }); } catch { return null; } },
  loadData: () => localData(readLocal),
  readBytes: async (rel, ver) => {
    if (!ver) return new Uint8Array(await fs.promises.readFile(path.join(LOCAL, rel)));
    try { return new Uint8Array(execFileSync('git', ['show', `devmode-${ver}:${rel}`], { cwd: LOCAL, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64e6 })); }
    catch { return new Uint8Array(await fs.promises.readFile(path.join(LOCAL, 'devmode', 'snapshots', ver, rel))); }
  },
  /* every file: the working copy now (so new files count), or the git tag devmode-<ver> */
  tree: async ver => {
    if (ver) return execFileSync('git', ['ls-tree', '-r', '-l', `devmode-${ver}`], { cwd: LOCAL, encoding: 'utf8', maxBuffer: 64e6 }).split('\n').filter(Boolean)
      .map(l => { const m = /^\S+ blob \S+\s+(\d+|-)\t(.*)$/.exec(l); return m && { path: m[2], size: +m[1] || 0 }; }).filter(Boolean);
    const out = [], walk = d => { for (const e of fs.readdirSync(path.join(LOCAL, d), { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'devmode-visual-out') continue;
      const rel = d ? d + '/' + e.name : e.name;
      if (e.isDirectory()) walk(rel); else if (e.isFile()) out.push({ path: rel, size: fs.statSync(path.join(LOCAL, rel)).size });
    } };
    walk(''); return out;
  },
  visual: async () => {
    const local = path.join(LOCAL, 'devmode-visual-out', 'report.json');
    if (fs.existsSync(local)) return { report: JSON.parse(fs.readFileSync(local, 'utf8')), base: '', source: 'local run (devmode-visual-out/)' };
    try { const report = JSON.parse(execFileSync('git', ['show', 'origin/devmode-visual:report.json'], { cwd: LOCAL, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32e6 }));
      return { report, base: HOSTED + '_visual/', source: 'branch devmode-visual (git fetch origin devmode-visual for the newest)' }; } catch { return null; }
  },
  extraNote: async () => (await playwright()) ? '' : '(With Playwright installed, get_live_specs gives the selected layer\'s measured size, padding and gaps.)',
  extraTools: api => browserTools(api)
});

/* ---------------------------------------------------------------- the browser (optional: Playwright) */
/* ---------------------------------------------------------------- the browser (optional: Playwright) */
let pwP = null, browserP = null, serverP = null;
function npmGlobalRoot() { try { return execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['root', '-g'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 8000 }).trim(); } catch { return null; } }
async function playwright() {
  if (!pwP) pwP = (async () => {
    for (const m of ['playwright', 'playwright-core']) { try { const x = await import(m); return x.chromium ? x : x.default; } catch {} }
    const g = npmGlobalRoot();
    for (const base of [process.cwd(), HERE, g && path.dirname(g)].filter(Boolean)) {
      for (const m of ['playwright', 'playwright-core']) { try { return createRequire(path.join(base, 'noop.js'))(m); } catch {} }
    }
    return null;
  })();
  return pwP;
}
const NO_BROWSER = 'Screenshots and live measurements need Playwright on this computer. Install it once:\n  npm install -g playwright\n  npx playwright install chromium\nthen restart the MCP server. Everything else (code, CSS, tokens, specs as written) works without it.';
async function browser() {
  const pw = await playwright(); if (!pw) throw new Error(NO_BROWSER);
  if (!browserP) browserP = pw.chromium.launch().catch(e => { browserP = null; throw new Error('Playwright is installed but Chromium could not start: ' + e.message.split('\n')[0] + '\nRun: npx playwright install chromium'); });
  return browserP;
}
/* in a local clone the pages are served from here (file:// can't load the animations) */
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf', '.lottie': 'application/zip' };
async function base() {
  if (!serverP) serverP = new Promise((res, rej) => {
    const srv = http.createServer((q, r) => {
      const rel = decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, ''), f = path.join(LOCAL, rel);
      if (!f.startsWith(LOCAL)) { r.writeHead(403); return r.end(); }
      fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
    });
    srv.listen(0, '127.0.0.1', () => res(`http://127.0.0.1:${srv.address().port}/`)); srv.on('error', rej); srv.unref();
  });
  return serverP;
}
function browserTools(api) {
  const { data, indexAt, findComp, findPage, read, S, verP, devP, fitP, textP } = api;
  async function openTarget(a) {
    const D = await data(), ver = a.version && a.version !== D.latest.id ? a.version : null, ix = await indexAt(ver);
    const scr = screenOf(a.device, a.fit, a.text), root = (await base()) + (ver ? `devmode/snapshots/${ver}/` : '');
    let url, js = null, app = true, label;
    if (a.component && !a.page) {
      const c = findComp(ix, a.component); if (!c) throw new Error(`no component "${a.component}"`);
      if (!c.gallery) throw new Error(`PS.${c.name} has no gallery states; give a page that uses it: ${(c.pages || []).join(', ') || '—'}`);
      url = root + `shared/stage.html?entry=${encodeURIComponent(c.gallery)}&state=${+a.componentState || 0}`; app = false; label = `PS.${c.name} · ${c.states[+a.componentState || 0] || ''}`;
    } else {
      const p = findPage(D, a.page || 'home'); if (!p) throw new Error(`no page "${a.page}"`);
      const st = p.states ? p.states[+a.state || 0] : null;
      url = D.pages.url(p, st, root); js = D.pages.js(p, st) || null; label = `${p.en}${st ? ' · ' + (st.en || st.name) : ''}`;
    }
    url = screenUrl(url, app, scr);
    /* the page is laid out W CSS px wide and drawn k times bigger, so a screenshot is the phone's width × 2 (as a 2× phone screenshot) */
    const b = await browser(), page = await b.newPage({ viewport: { width: scr.W, height: Math.round(scr.H) }, deviceScaleFactor: (a.scale || 2) * scr.k });
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForFunction(app ? () => !!(window.APP && window.APP.S && window.PS) : () => !!(window.PS && document.getElementById('root').children.length), null, { timeout: 20000 });
    if (app) await page.waitForFunction(() => !window.APP.S.stack.some(e => e.name === 'opening'), null, { timeout: 8000 }).catch(() => {});
    if (js) {
      if (/APP\.borrow/.test(js)) await page.waitForFunction(() => { try { const s = window.APP.wd && window.APP.wd.sheet(); return !!(s && s.ready && s.ready()); } catch (e) { return false; } }, null, { timeout: 10000 }).catch(() => {});
      await page.evaluate(js);
    }
    await page.waitForTimeout(a.wait == null ? 1500 : Math.min(+a.wait, 15000));
    /* entrances still running (rises, fades) would be measured mid-way: let them finish (at most 3 s; looping ones are skipped) */
    await page.evaluate(() => Promise.race([Promise.all(document.getAnimations().filter(x => { const t = x.effect && x.effect.getTiming(); return t && t.iterations !== Infinity; }).map(x => x.finished.catch(() => {}))), new Promise(r => setTimeout(r, 3000))])).catch(() => {});
    /* Dev Mode's own inspector, to find the components and measure them as Dev Mode does */
    const insp = await read('devmode/js/inspector.js');
    await page.addScriptTag({ content: 'window.DM = { IDX: function () { return window.__DMIDX; } }; window.__DMIDX = ' + JSON.stringify({ components: Object.fromEntries(Object.keys(ix.components).map(n => [n, 1])) }) + ';' });
    await page.addScriptTag({ content: insp });
    return { page, url, label, ver, screen: scr };
  }
  async function findTargets(page, target, all) {
    return page.evaluate(([target, all]) => {
      const I = window.DM.inspect, T = I.tree(window);
      let nodes = [];
      if (!target) return { nodes: [], names: [...new Set(T.list.filter(n => n.kind === 'component').map(n => n.name))] };
      if (/[>|]/.test(target)) { const n = I.resolve(T, target); if (n) nodes = [n]; }
      else { const k = target.replace(/^PS\./, '').toLowerCase(); nodes = T.list.filter(n => n.kind === 'component' && n.name.toLowerCase() === k); }
      nodes = nodes.filter(n => I.rect(n)).slice(0, all ? 6 : 3);
      window.__dmNodes = nodes;
      return { paths: nodes.map(n => n.path), names: [...new Set(T.list.filter(n => n.kind === 'component').map(n => n.name))] };
    }, [target || '', !!all]);
  }
  return [
      { name: 'get_screenshot', title: 'Screenshot (needs Playwright)',
        description: 'A PNG of an app page (and state) or of a component\'s gallery state, as it really renders, at phone width; optionally outlining a component on it. Needs Playwright on this computer (otherwise it says how to install it).',
        inputSchema: S({ page: { type: 'string', description: 'Page id (list_pages)' }, state: { type: 'integer' }, component: { type: 'string', description: 'Alone: screenshot this component\'s gallery state. With page: outline it on the page.' },
          componentState: { type: 'integer', description: 'Gallery state index (get_component → States)' }, device: devP, fit: fitP, text: textP, version: verP, fullPage: { type: 'boolean' }, wait: { type: 'integer', description: 'Extra ms to wait before the shot (default 1500)' } }),
        run: async a => {
          const t = await openTarget(a);
          try {
            let note = '';
            if (a.component && a.page) {
              const f = await findTargets(t.page, a.component);
              if (f.paths.length) await t.page.evaluate(() => window.__dmNodes.forEach(n => { const r = window.DM.inspect.rect(n), d = document.createElement('div'); d.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;outline:2px solid #9747ff;outline-offset:0;z-index:2147483647;pointer-events:none`; document.body.appendChild(d); }));
              else note = `\nPS.${a.component} is not on this page/state. Components here: ${f.names.join(', ')}`;
            }
            const png = await t.page.screenshot({ fullPage: !!a.fullPage });
            return [{ type: 'image', data: png.toString('base64'), mimeType: 'image/png' }, { type: 'text', text: `${t.label} · ${t.screen.desc} · ${t.url}${note}` }];
          } finally { await t.page.close(); }
        } },
      { name: 'qa_compare', title: 'Design QA: implementation vs demo (needs Playwright)',
        description: 'Design QA for developers: compares a screenshot of your implementation (an image file on this computer, or a web URL Playwright can open) with the PeraSure demo of the same page / state or component state. Returns demo | implementation | difference pictures, how much differs, the regions that differ (CSS px) and the demo components there. The screenshot is scaled to the demo width; offsetY moves it (negative to skip a status bar). Needs Playwright.',
        inputSchema: S({ page: { type: 'string', description: 'Demo page id (list_pages)' }, state: { type: 'integer' }, component: { type: 'string', description: 'Or a component: its gallery state is the reference' }, componentState: { type: 'integer' },
          image: { type: 'string', description: 'Path to a PNG / JPG screenshot of the implementation (any scale; full width of the screen)' }, url: { type: 'string', description: 'Or the implementation\'s URL (web), shot at the same width' },
          offsetX: { type: 'number' }, offsetY: { type: 'number', description: 'CSS px to move the implementation by (e.g. -24 to cut a 24 px status bar)' }, device: devP, fit: fitP, text: textP, version: verP,
          tolerance: { type: 'integer', description: 'How far a colour channel may differ before a pixel counts (default 40)' } }),
        run: async a => {
          if (!a.image && !a.url) throw new Error('give image (a screenshot file of the implementation) or url');
          const t = await openTarget({ ...a, page: a.component && !a.page ? undefined : (a.page || 'home'), component: a.page ? undefined : a.component, scale: 2 });
          let implB64, implNote = '';
          try {
            const demo = await t.page.screenshot({ animations: 'disabled', caret: 'hide' });
            const comps = await t.page.evaluate(() => { const I = window.DM.inspect, T = I.tree(window); return T.list.filter(n => n.kind === 'component').map(n => { const r = I.rect(n); return r && { name: n.name, r: [r.left, r.top, r.width, r.height] }; }).filter(Boolean); });
            if (a.image) {
              const f = a.image.replace(/^~(?=\/|\\|$)/, process.env.HOME || process.env.USERPROFILE || '~');
              implB64 = (await fs.promises.readFile(path.resolve(f))).toString('base64'); implNote = path.basename(f);
            } else {
              const vp = t.page.viewportSize(), b = await browser(), ip = await b.newPage({ viewport: vp, deviceScaleFactor: 2 });
              try { await ip.goto(a.url, { waitUntil: 'load', timeout: 30000 }); await ip.waitForTimeout(2000); implB64 = (await ip.screenshot({ animations: 'disabled', caret: 'hide' })).toString('base64'); implNote = a.url; } finally { await ip.close(); }
            }
            const r = await t.page.evaluate(async ([d, im, dx, dy, tol]) => {
              const bmp = async (b64) => createImageBitmap(await (await fetch('data:image/*;base64,' + b64)).blob());
              const D = await bmp(d), M = await bmp(im), W = D.width, H = D.height, k = W / M.width, S2 = W / window.innerWidth;
              const cd = new OffscreenCanvas(W, H), cm = new OffscreenCanvas(W, H), xd = cd.getContext('2d'), xm = cm.getContext('2d');
              xd.drawImage(D, 0, 0); xm.fillStyle = '#fff'; xm.fillRect(0, 0, W, H); xm.drawImage(M, dx * S2, dy * S2, W, M.height * k);
              const pd = xd.getImageData(0, 0, W, H).data, pm = xm.getImageData(0, 0, W, H).data, mask = new Uint8Array(W * H);
              let n = 0;
              for (let i = 0, p = 0; i < pd.length; i += 4, p++) if (Math.abs(pd[i] - pm[i]) > tol || Math.abs(pd[i + 1] - pm[i + 1]) > tol || Math.abs(pd[i + 2] - pm[i + 2]) > tol) { mask[p] = 1; n++; }
              /* regions: 8 px cells that differ, joined with their neighbours */
              const C = 8 * S2, gw = Math.ceil(W / C), gh = Math.ceil(H / C), cell = new Uint16Array(gw * gh);
              for (let p = 0; p < mask.length; p++) if (mask[p]) cell[Math.floor((p / W | 0) / C) * gw + Math.floor((p % W) / C)]++;
              const on = c => cell[c] > C * C * 0.04, seen = new Uint8Array(gw * gh), regions = [];
              for (let c = 0; c < cell.length; c++) {
                if (!on(c) || seen[c]) continue;
                let x0 = gw, y0 = gh, x1 = 0, y1 = 0, px = 0; const st = [c]; seen[c] = 1;
                while (st.length) { const q = st.pop(), x = q % gw, y = q / gw | 0; px += cell[q]; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
                  [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ax, ay]) => { const X = x + ax, Y = y + ay, nq = Y * gw + X; if (X >= 0 && Y >= 0 && X < gw && Y < gh && !seen[nq] && on(nq)) { seen[nq] = 1; st.push(nq); } }); }
                regions.push({ box: [x0 * 8, y0 * 8, (x1 - x0 + 1) * 8, (y1 - y0 + 1) * 8], px });
              }
              regions.sort((p, q) => q.px - p.px);
              const out = new OffscreenCanvas(W * 3 + 32, H), xo = out.getContext('2d');
              xo.fillStyle = '#e6e6e6'; xo.fillRect(0, 0, out.width, H); xo.drawImage(cd, 0, 0); xo.drawImage(cm, W + 16, 0);
              xo.globalAlpha = 0.3; xo.drawImage(cd, 2 * W + 32, 0); xo.globalAlpha = 1;
              const di = xo.getImageData(2 * W + 32, 0, W, H);
              for (let p = 0; p < mask.length; p++) if (mask[p]) { di.data[p * 4] = 242; di.data[p * 4 + 1] = 72; di.data[p * 4 + 2] = 34; di.data[p * 4 + 3] = 255; }
              xo.putImageData(di, 2 * W + 32, 0);
              xo.strokeStyle = '#9747ff'; xo.lineWidth = 2 * S2; xo.font = `${12 * S2}px sans-serif`; xo.fillStyle = '#9747ff';
              regions.slice(0, 8).forEach((g, i) => { const [x, y, w, h] = g.box.map(v => v * S2); xo.strokeRect(2 * W + 32 + x, y, w, h); xo.fillText(String(i + 1), 2 * W + 32 + x + 3 * S2, y + 13 * S2); });
              const blob = await out.convertToBlob({ type: 'image/png' }), buf = new Uint8Array(await blob.arrayBuffer());
              let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
              return { ratio: n / (W * H), regions: regions.slice(0, 8), image: btoa(s), implW: M.width, implH: M.height };
            }, [demo.toString('base64'), implB64, a.offsetX || 0, a.offsetY || 0, a.tolerance || 40]);
            const where = box => { const [x, y, w, h] = box, cx = x + w / 2, cy = y + h / 2; const hit = comps.filter(c => cx >= c.r[0] && cx <= c.r[0] + c.r[2] && cy >= c.r[1] && cy <= c.r[1] + c.r[3]).sort((p, q) => p.r[2] * p.r[3] - q.r[2] * q.r[3]); return [...new Set(hit.map(c => c.name))].slice(0, 3); };
            const text = [`# Design QA — ${t.label}`, `Demo: ${t.url} (${t.screen.desc})`, `Implementation: ${implNote} (${r.implW}×${r.implH}, scaled to the demo width${a.offsetY || a.offsetX ? `, moved ${a.offsetX || 0}, ${a.offsetY || 0} px` : ''})`,
              `${(r.ratio * 100).toFixed(2)}% of pixels differ (tolerance ${a.tolerance || 40}). Picture: demo | implementation | difference (numbered regions).`,
              r.regions.length ? '\n## Regions that differ (CSS px: x, y, w, h)\n' + r.regions.map((g, i) => `${i + 1}. ${g.box.join(', ')} — demo components there: ${where(g.box).map(n => (/^APP\./.test(n) ? n : 'PS.' + n)).join(', ') || '—'}`).join('\n') : '\nNo differing regions: it matches the demo.',
              '\nIf everything is off by the same few pixels, the screenshot is shifted (a status bar): try offsetY. For exact values of a component, use get_live_specs or get_component.'].join('\n');
            return [{ type: 'image', data: r.image, mimeType: 'image/png' }, { type: 'text', text }];
          } finally { await t.page.close(); }
        } },
      { name: 'get_live_specs', title: 'Live measurements (needs Playwright)',
        description: 'Measures a component as it renders on a page (or in its gallery state), the way Dev Mode\'s Inspect does: size, padding and gaps with the token the CSS uses, radius, fill, stroke, shadow, text style, and the CSS rules it matches. Give a component name or a Dev Mode layer path (sel=…). Needs Playwright.',
        inputSchema: S({ page: { type: 'string' }, state: { type: 'integer' }, component: { type: 'string', description: 'Component name, or a layer path from a Dev Mode link (sel=…)' }, componentState: { type: 'integer' }, device: devP, fit: fitP, text: textP, version: verP, all: { type: 'boolean', description: 'Up to 6 instances instead of 3' } }, ['component']),
        run: async a => {
          const onPage = a.page || /[>|]/.test(a.component);
          const t = await openTarget({ ...a, page: onPage ? (a.page || 'home') : undefined, component: onPage ? undefined : a.component });
          try {
            const f = await findTargets(t.page, a.component, a.all);
            if (!f.paths.length) return `PS.${a.component} is not drawn on ${t.label}. Components here: ${f.names.join(', ')}`;
            const res = await t.page.evaluate(() => {
              const I = window.DM.inspect, root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
              return window.__dmNodes.map(n => {
                const sp = I.specs(window, n), L = I.layout(window, n), el = I.hosts(n)[0];
                /* the layers right inside it (the visible card is often one level down) */
                const kids = el ? Array.from(el.children).slice(0, 6).map(c => { const k = { el: c }, s2 = I.specs(window, k), L2 = I.layout(window, k);
                  return { cls: Array.from(c.classList).filter(x => !/^ps-[tc]-/.test(x)).join(' ') || c.tagName.toLowerCase(), rows: s2 ? s2.rows.filter(x => x.group !== 'text') : [],
                    padding: L2 ? L2.padding : null, gaps: L2 ? L2.gaps.map(g => ({ px: g.px, decl: g.decl, auto: g.auto })) : [] }; }) : [];
                return { path: n.path, rows: sp ? sp.rows : [], classes: sp ? sp.classes : [], root, kids,
                  padding: L ? L.padding : null, gaps: L ? L.gaps.map(g => ({ px: g.px, decl: g.decl, auto: g.auto })) : [], dir: L && L.dir,
                  rules: I.matchedRules(window, el).map(r => ({ file: r.file, sel: r.sel, decl: r.decl })) };
              });
            });
            const f2 = (v, px, root) => (px && typeof v === 'number' ? `${Math.round(v * 100) / 100}px (${Math.round(v / root * 1000) / 1000}rem)` : String(v));
            return `${t.label} · ${t.screen.desc} · ${t.url}\nSizes are the page's CSS px (what the code writes)${t.screen.k > 1.001 ? `; the phone draws them ×${Math.round(t.screen.k * 1000) / 1000}` : ''}.\n` + res.map(r => [
              `\n## ${r.path}`, r.classes.length ? 'Classes: ' + r.classes.map(c => '.' + c).join(' ') : '',
              ...r.rows.map(x => `- ${x.group} · ${x.label}: ${f2(x.value, x.px, r.root)}${x.token ? ' · `' + x.token + '`' : ''}${x.expr ? ' · ' + x.expr : ''}`),
              r.padding ? '- padding as written: ' + ['top', 'right', 'bottom', 'left'].map(s => `${s} ${Math.round(r.padding[s].px * 100) / 100}px${r.padding[s].decl ? ' = ' + r.padding[s].decl : ''}`).join(', ') : '',
              r.gaps.length ? `- gaps (${r.dir}): ` + r.gaps.map(g => `${Math.round(g.px * 100) / 100}px${g.auto ? ' (space-between)' : g.decl ? ' = ' + g.decl : ''}`).join(', ') : '',
              r.kids.length ? '\nInside it:\n' + r.kids.map(k => `- \`.${k.cls.replace(/ /g, ' .')}\` ` + k.rows.filter(x => x.label !== 'dir').map(x => `${x.label} ${f2(x.value, x.px, r.root).replace(/ \(.*rem\)/, '')}${x.token ? ' `' + x.token + '`' : ''}${x.expr ? ' ' + x.expr : ''}`).join(' · ')).join('\n') : '',
              '\nCSS rules it matches:\n' + fence(r.rules.map(x => `/* ${x.file} */\n${x.sel} {\n  ${x.decl.join('\n  ')}\n}`).join('\n\n'), 'css')
            ].filter(Boolean).join('\n')).join('\n');
          } finally { await t.page.close(); }
        } }
  ];
}

/* ---------------------------------------------------------------- MCP over stdio */
function send(o) { process.stdout.write(JSON.stringify(o) + '\n'); }
function serve() {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', d => {
    buf += d; let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let msg; try { msg = JSON.parse(line); } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }); continue; }
      (Array.isArray(msg) ? msg : [msg]).forEach(x => DM.handle(x).then(r => { if (r) send(r); }));
    }
  });
  const quit = async () => { try { if (browserP) (await browserP).close(); } catch {} process.exit(0); };
  process.stdin.on('end', quit); process.on('SIGINT', quit); process.on('SIGTERM', quit);
  log(`ready · local clone ${LOCAL}`);
}

const ME = fileURLToPath(import.meta.url);
const HELP = `PeraSure Dev Mode MCP server ${VERSION} (local)

Most people connect to the hosted server instead — nothing to install (see Connect AI in Dev Mode, or devmode/mcp/README.md):
  claude mcp add --transport http ${NAME} ${HOSTED}devmode/mcp --header "Authorization: Bearer <token>"

This local one, inside a clone of the repo:
  Claude Code   claude mcp add ${NAME}-local -s user -- node ${ME}
  Codex         codex mcp add ${NAME}-local -- node ${ME}
  Others        { "command": "node", "args": ["${ME}"] }
Optional, for screenshots, design QA and live measurements (about 150 MB):
  npm install -g playwright && npx playwright install chromium
Check it:  node ${ME} --check`;

if (process.argv.includes('--help') || process.argv.includes('-h')) { console.log(HELP); process.exit(0); }
if (process.argv.includes('--check')) {
  (async () => {
    try {
      const D = await DM.data();
      console.log(`PeraSure Dev Mode MCP ${VERSION} · local clone ${LOCAL}`);
      console.log(`latest version ${D.latest.id} · ${Object.keys(D.pages.byId).length} pages · ${Object.keys(D.index.components).length} components · ${D.iterations.length} iteration(s)`);
      const T = await DM.tokens(); console.log(`${T.map.size} tokens`);
      const pw = await playwright(); console.log(pw ? 'Playwright found: screenshots and live measurements are on' : 'Playwright not found: screenshots and live measurements are off (optional)');
      console.log(`${DM.TOOLS.length} tools: ${DM.TOOLS.map(t => t.name).join(', ')}`);
      process.exit(0);
    } catch (e) { console.error('Failed: ' + e.message); process.exit(1); }
  })();
} else serve();
