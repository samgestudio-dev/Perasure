#!/usr/bin/env node
/* PeraSure Dev Mode — visual check (after Chromatic): renders every app page state and every component state twice, from the latest
   iteration's runnable snapshot (devmode/snapshots/<id>/) and from the code as it is now, on the same machine, and compares the pixels.
   Whatever differs is a change no iteration has recorded yet: the report lists it with before | after | difference pictures and the
   components drawn where it changed.

     node tools/devmode-visual.mjs diff [--against <iteration id>] [--out <folder>] [--only pages|components] [--filter <text>] [--jobs 4]
     node tools/devmode-visual.mjs list            what would be shot

   Writes <out>/report.json and <out>/images/<item>.webp (default out: devmode-visual-out/, not committed). The Dev Mode visual check
   workflow (.github/workflows/devmode-visual.yml) runs it on every push and publishes <out> to the branch devmode-visual, which Dev Mode
   (Iterations → Unrecorded changes) and the MCP server (get_visual_changes) read. Needs Playwright (npm i -g playwright; npx playwright
   install chromium). Renders are made steady: fixed clock and random numbers, finished entrances, Lottie on a fixed frame, no caret. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2), cmd = args[0] || 'diff';
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('out', path.join(ROOT, 'devmode-visual-out')));
const JOBS = +opt('jobs', 4), ONLY = opt('only', ''), FILTER = opt('filter', ''), W = 360, H = 780;
const TOLERANCE = 28, MIN_PIXELS = 24;   /* a channel has to move more than this; fewer changed pixels than this is noise (anti-aliasing) */

function load(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function run(code) { const ctx = { window: {}, document: { querySelector: () => null }, URLSearchParams, console }; vm.runInNewContext(code, ctx); return ctx.window; }
const parseIndex = t => JSON.parse(t.slice(t.indexOf('=') + 1).trim().replace(/;\s*$/, ''));
const PAGES = run(load('devmode/data/pages.js')).DM_PAGES, ITS = run(load('devmode/data/iterations.js')).DM_ITERATIONS;
const INDEX = parseIndex(load('devmode/data/index.js'));
const against = opt('against', ITS[0].id);
const snapDir = `devmode/snapshots/${against}/`;
if (cmd === 'diff' && !fs.existsSync(path.join(ROOT, snapDir, 'meta.json'))) { console.error(`no snapshot ${snapDir} — make it with tools/devmode-snapshot.py`); process.exit(1); }
const OLD_INDEX = fs.existsSync(path.join(ROOT, snapDir, 'devmode-index.js')) ? parseIndex(load(snapDir + 'devmode-index.js')) : INDEX;

/* ---- what is shot: every page state, every gallery entry state ---- */
function items() {
  const out = [];
  if (ONLY !== 'components') for (const p of Object.values(PAGES.byId)) {
    const sts = p.states && p.states.length ? p.states : [null];
    sts.forEach((st, i) => out.push({ id: `page-${p.id}-${i}`, kind: 'page', page: p.id, state: i, label: `${p.en}${st ? ' · ' + (st.en || st.name) : ''}`, labelZh: `${p.name}${st ? ' · ' + st.name : ''}`, p, st }));
  }
  if (ONLY !== 'pages') {
    const entries = new Map();
    for (const c of Object.values(INDEX.components)) if (c.gallery) { const e = entries.get(c.gallery) || { states: c.states, comps: [] }; e.comps.push(c.name); entries.set(c.gallery, e); }
    for (const [entry, e] of entries) e.states.forEach((s, i) => out.push({ id: `comp-${entry.replace(/[^\w]+/g, '_')}-${i}`, kind: 'component', entry, state: i, comps: e.comps, label: `${entry} · ${s}`, labelZh: `${entry} · ${s}` }));
  }
  const rx = FILTER ? new RegExp(FILTER, 'i') : null;   /* a regular expression: 'home|PaymentCard' */
  return rx ? out.filter(x => rx.test(x.id + ' ' + x.label)) : out;
}
function urlOf(it, root) {
  if (it.kind === 'page') return PAGES.url(it.p, it.st, root);
  return `${root}shared/stage.html?entry=${encodeURIComponent(it.entry)}&state=${it.state}`;
}

/* ---- the browser ---- */
function playwright() {
  const bases = [process.cwd(), ROOT];
  try { const g = execFileSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['root', '-g'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); bases.push(path.dirname(g)); } catch {}
  for (const b of bases) for (const m of ['playwright', 'playwright-core']) { try { return createRequire(path.join(b, 'noop.js'))(m); } catch {} }
  console.error('Playwright is needed: npm install -g playwright && npx playwright install chromium'); process.exit(1);
}
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, ''));
      if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
      fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); r.end(b); });
    });
    srv.listen(0, '127.0.0.1', () => res({ base: `http://127.0.0.1:${srv.address().port}/`, close: () => srv.close() }));
  });
}
/* a steady page: the same clock and random numbers on every run */
const STEADY = `(() => {
  const FIXED = Date.UTC(2026, 10, 13, 2, 0, 0), R = Date;
  function D(...a) { if (!new.target) return new R(FIXED).toString(); return a.length ? new R(...a) : new R(FIXED); }
  D.prototype = R.prototype; D.now = () => FIXED; D.parse = R.parse; D.UTC = R.UTC; window.Date = D;
  let s = 20261113; Math.random = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
})();`;
async function shoot(ctx, it, root) {
  const page = await ctx.newPage();
  try {
    await page.goto(urlOf(it, root), { waitUntil: 'load', timeout: 30000 });
    const app = it.kind === 'page';
    await page.waitForFunction(app ? () => !!(window.APP && window.APP.S && window.PS) : () => !!(window.PS && document.getElementById('root') && document.getElementById('root').children.length), null, { timeout: 20000 });
    const js = app ? PAGES.js(it.p, it.st) : '';
    /* the opening screen hands over with APP.home(), which closes a sheet opened before it: wait for it to be gone */
    if (app) await page.waitForFunction(() => !window.APP.S.stack.some(e => e.name === 'opening'), null, { timeout: 8000 }).catch(() => {});
    if (js) {
      if (/APP\.borrow/.test(js)) await page.waitForFunction(() => { try { const s = window.APP.wd && window.APP.wd.sheet(); return !!(s && s.ready && s.ready()); } catch (e) { return false; } }, null, { timeout: 10000 }).catch(() => {});
      await page.evaluate(js);
    }
    await page.waitForTimeout(1300);
    await page.evaluate(() => Promise.race([Promise.all(document.getAnimations().filter(a => { const t = a.effect && a.effect.getTiming(); return t && t.iterations !== Infinity; }).map(a => a.finished.catch(() => {}))), new Promise(r => setTimeout(r, 3000))])).catch(() => {});
    await page.evaluate(() => {   /* Lottie on a fixed frame */
      const L = window.lottie || window.bodymovin;
      if (L && L.getRegisteredAnimations) L.getRegisteredAnimations().forEach(a => { try { a.goToAndStop(Math.max(0, Math.floor(a.totalFrames) - 1), true); } catch (e) {} });
    });
    await page.waitForTimeout(250);
    /* a component state is cut to its content (the stage is a whole phone height) */
    const clipH = app ? H : await page.evaluate(([H]) => { const st = document.querySelector('.st') || document.getElementById('root'); return Math.min(H, Math.max(120, Math.ceil(st.getBoundingClientRect().bottom + 8))); }, [H]);
    const png = await page.screenshot({ animations: 'disabled', caret: 'hide', clip: { x: 0, y: 0, width: W, height: clipH } });
    let comps = [];
    if (app) {
      /* where each component is drawn (for "what changed here") — Dev Mode's own inspector */
      try {
        await page.addScriptTag({ content: 'window.DM = { NS: "PS", A: { textClass: "ps-t-", srcVar: "--ps-src" }, IDX: function () { return window.__DMIDX; } }; window.__DMIDX = ' + JSON.stringify({ components: Object.fromEntries(Object.keys(INDEX.components).map(n => [n, 1])) }) + ';' });
        await page.addScriptTag({ path: path.join(ROOT, 'devmode/inspector.js') });
        comps = await page.evaluate(() => { const I = window.DM.inspect, T = I.tree(window); return T.list.filter(n => n.kind === 'component').map(n => { const r = I.rect(n); return r && { name: n.name, path: n.path, r: [r.left, r.top, r.width, r.height].map(Math.round) }; }).filter(Boolean).slice(0, 400); });
      } catch {}
    }
    return { png, comps };
  } catch (e) {
    return { error: e.message.split('\n')[0] };
  } finally { await page.close(); }
}

/* ---- comparing two pictures, in the browser (no other tools needed) ---- */
async function compare(cmpPage, a, b, b2) {
  return cmpPage.evaluate(async ([a, b, b2, TOL, MIN]) => {
    const img = async b64 => { const bl = await (await fetch('data:image/png;base64,' + b64)).blob(); return createImageBitmap(bl); };
    const A = await img(a), B = await img(b), w = Math.max(A.width, B.width), h = Math.max(A.height, B.height);
    const ca = new OffscreenCanvas(w, h), cb = new OffscreenCanvas(w, h), xa = ca.getContext('2d'), xb = cb.getContext('2d');
    xa.fillStyle = xb.fillStyle = '#fff'; xa.fillRect(0, 0, w, h); xb.fillRect(0, 0, w, h); xa.drawImage(A, 0, 0); xb.drawImage(B, 0, 0);
    const da = xa.getImageData(0, 0, w, h).data, db = xb.getImageData(0, 0, w, h).data;
    const off = (x, y, i) => Math.abs(x[i] - y[i]) > TOL || Math.abs(x[i + 1] - y[i + 1]) > TOL || Math.abs(x[i + 2] - y[i + 2]) > TOL;
    /* noise: what differs between two renders of the same code (a loader turning, sparkles), widened by 3 px */
    let noise = null, unsteady = 0;
    if (b2) {
      const B2 = await img(b2), c2 = new OffscreenCanvas(w, h), x2 = c2.getContext('2d'); x2.fillStyle = '#fff'; x2.fillRect(0, 0, w, h); x2.drawImage(B2, 0, 0);
      const d2 = x2.getImageData(0, 0, w, h).data, raw = new Uint8Array(w * h); noise = new Uint8Array(w * h);
      for (let i = 0, p = 0; i < db.length; i += 4, p++) if (off(db, d2, i)) { raw[p] = 1; unsteady++; }
      if (unsteady) for (let p = 0; p < raw.length; p++) if (raw[p]) { const x = p % w, y = (p / w) | 0; for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < w && Y < h) noise[Y * w + X] = 1; } }
    }
    let n = 0, x0 = w, y0 = h, x1 = -1, y1 = -1, first = null; const mask = new Uint8Array(w * h);
    for (let i = 0, p = 0; i < da.length; i += 4, p++) {
      if (off(da, db, i) && !(noise && noise[p])) {
        n++; mask[p] = 1; const x = p % w, y = (p / w) | 0; if (!first) first = [x, y]; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
      }
    }
    if (n < MIN) return { changed: false, pixels: n, unsteady };
    /* before | after | difference (after, faded, with the changed pixels in red and their box) */
    const out = new OffscreenCanvas(w * 3 + 16, h), xo = out.getContext('2d');
    xo.fillStyle = '#e6e6e6'; xo.fillRect(0, 0, out.width, h);
    xo.drawImage(ca, 0, 0); xo.drawImage(cb, w + 8, 0);
    xo.globalAlpha = 0.35; xo.drawImage(cb, 2 * w + 16, 0); xo.globalAlpha = 1;
    const di = xo.getImageData(2 * w + 16, 0, w, h);
    for (let p = 0; p < mask.length; p++) if (mask[p]) { di.data[p * 4] = 242; di.data[p * 4 + 1] = 72; di.data[p * 4 + 2] = 34; di.data[p * 4 + 3] = 255; }
    xo.putImageData(di, 2 * w + 16, 0);
    xo.strokeStyle = '#f24822'; xo.lineWidth = 2; xo.strokeRect(2 * w + 16 + x0 - 2, y0 - 2, x1 - x0 + 5, y1 - y0 + 5);
    const blob = await out.convertToBlob({ type: 'image/webp', quality: 0.82 });
    const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return { changed: true, pixels: n, ratio: n / (w * h), box: [x0, y0, x1 - x0 + 1, y1 - y0 + 1], first, unsteady, image: btoa(s) };
  }, [a.toString('base64'), b.toString('base64'), b2 ? b2.toString('base64') : null, TOLERANCE, MIN_PIXELS]);
}
/* where the change starts (its first changed pixel, top to bottom): the components drawn there, smallest first. What only moved
   because something above it grew is left out — that is where a designer would look */
function under(first, comps) {
  if (!first) return [];
  const [fx, fy] = first, hits = comps.filter(c => fx >= c.r[0] - 1 && fx <= c.r[0] + c.r[2] + 1 && fy >= c.r[1] - 1 && fy <= c.r[1] + c.r[3] + 1 && c.r[2] * c.r[3] < W * H * 0.9);
  hits.sort((a, b) => a.r[2] * a.r[3] - b.r[2] * b.r[3]);
  const names = []; for (const c of hits) if (!names.includes(c.name)) names.push(c.name);
  return names.slice(0, 4);
}

async function main() {
  const list = items();
  if (cmd === 'list') { list.forEach(x => console.log(x.id, '·', x.label)); console.log(list.length, 'items'); return; }
  const pw = playwright(), srv = await serve(), browser = await pw.chromium.launch();
  const t0 = Date.now(), report = { against, at: new Date().toISOString(), commit: (() => { try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return null; } })(), items: list.length, changed: [], added: [], failed: [] };
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(path.join(OUT, 'images'), { recursive: true });
  const cmpCtx = await browser.newContext(), cmpPage = await cmpCtx.newPage(); await cmpPage.goto(srv.base + 'index.html').catch(() => {});
  let done = 0;
  async function worker(queue) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await ctx.addInitScript(STEADY);
    for (let it; (it = queue.shift());) {
      const isNew = it.kind === 'page' ? false : !Object.values(OLD_INDEX.components).some(c => c.gallery === it.entry && (c.states || []).length > it.state);
      const after = await shoot(ctx, it, srv.base);
      const before = isNew ? null : await shoot(ctx, it, srv.base + snapDir);
      const base = { id: it.id, kind: it.kind, label: it.label, labelZh: it.labelZh, page: it.page, entry: it.entry, state: it.state, components: it.comps };
      if (after.error || (before && before.error)) report.failed.push({ ...base, error: after.error || ('before: ' + before.error) });
      else if (!before) report.added.push(base);
      else {
        let d = await compare(cmpPage, before.png, after.png);
        if (d.changed) {   /* render the new code once more: what moves by itself is not a change */
          const again = await shoot(ctx, it, srv.base);
          if (!again.error) d = await compare(cmpPage, before.png, after.png, again.png);
        }
        if (d.changed) {
          fs.writeFileSync(path.join(OUT, 'images', it.id + '.webp'), Buffer.from(d.image, 'base64'));
          report.changed.push({ ...base, pixels: d.pixels, ratio: +d.ratio.toFixed(5), box: d.box, image: 'images/' + it.id + '.webp', first: d.first, unsteady: d.unsteady || 0, components: it.kind === 'page' ? under(d.first, after.comps) : it.comps });
        }
      }
      done++; if (done % 25 === 0 || done === list.length) process.stderr.write(`  ${done}/${list.length} · ${report.changed.length} changed · ${Math.round((Date.now() - t0) / 1000)} s\n`);
    }
    await ctx.close();
  }
  const queue = list.slice();
  await Promise.all(Array.from({ length: Math.max(1, JOBS) }, () => worker(queue)));
  /* in short: which components and pages changed */
  const comps = new Set(), pages = new Set();
  report.changed.forEach(c => { (c.components || []).forEach(n => comps.add(n)); if (c.page) pages.add(c.page); });
  report.summary = { components: [...comps], pages: [...pages], seconds: Math.round((Date.now() - t0) / 1000) };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  await browser.close(); srv.close();
  console.log(`visual check against ${against}: ${list.length} renders, ${report.changed.length} changed, ${report.added.length} new, ${report.failed.length} failed (${report.summary.seconds} s) → ${path.relative(process.cwd(), OUT) || '.'}/report.json`);
  report.changed.forEach(c => console.log(`  changed  ${c.id}  ${(c.ratio * 100).toFixed(2)}%  ${(c.components || []).join(', ')}`));
  report.added.forEach(c => console.log(`  new      ${c.id}`));
  report.failed.forEach(c => console.log(`  failed   ${c.id}  ${c.error}`));
}
main().catch(e => { console.error(e); process.exit(1); });
