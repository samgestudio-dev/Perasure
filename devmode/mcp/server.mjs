#!/usr/bin/env node
/* PeraSure Dev Mode — MCP server: lets a developer's AI (Claude Code, Cursor, Codex …) read what PeraSure Dev Mode shows — every app
   page and shared component (PS.*) with its source, CSS as written, tokens, motion values, usage examples, Figma nodes, statuses and
   iteration history, the design tokens, and what changed between versions. Optional: screenshots and live measurements, when
   Playwright is installed on the computer.

   One file, no dependencies, Node 18+. Talks MCP over stdio (newline-delimited JSON-RPC).
     node devmode-mcp.mjs            run as an MCP server (an AI tool starts it)
     node devmode-mcp.mjs --check    test the connection and print what it can read
     node devmode-mcp.mjs --help     how to add it to Claude Code / Cursor / Codex
   Data: the live Dev Mode (https://samgestudio-dev.github.io/Perasure/devmode/); inside a clone of the repo it reads the files there
   instead. PERASURE_SOURCE=remote forces the live site, PERASURE_ROOT=<repo folder> a local clone, PERASURE_DEVMODE_URL another site.
   Guide: devmode/mcp/README.md. Keep in step with devmode/data/*.js and devmode/js/inspector.js when their formats change. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const VERSION = '1.2.0';
const NAME = 'perasure-devmode';
const SITE = (process.env.PERASURE_DEVMODE_URL || 'https://samgestudio-dev.github.io/Perasure/').replace(/\/?$/, '/');
const REPO = 'samgestudio-dev/Perasure';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const LOCAL = (() => {
  if (process.env.PERASURE_SOURCE === 'remote') return null;
  for (const r of [process.env.PERASURE_ROOT, path.resolve(HERE, '..', '..')]) if (r && fs.existsSync(path.join(r, 'devmode', 'data', 'index.js'))) return path.resolve(r);
  return null;
})();
const DEVICES = { 360: [360, 780], 390: [390, 844], 430: [430, 932] };
/* Screen fit and Text size, as on the phone and in Dev Mode (devmode/js/canvas.js DM.screenOf; shared/ps-ui/phone-fit.js): the browser
   lays the page out W CSS px wide and enlarges it k times to the screen. Default: capped zoom (at most 1.15×), text 100 %. */
const FITS = ['cap', 'rem', 'fit', 'scale'], TEXTS = [85, 100, 115, 130, 150, 200], ZMAX = 1.15;
const FIT_NAMES = { cap: 'capped zoom (up to 1.15×)', rem: 'capped zoom · rem', fit: '1:1', scale: 'full zoom' };
function screenOf(device, fit, text) {
  const [w, h] = DEVICES[device] || DEVICES[360], f = FITS.includes(fit) ? fit : 'cap', tx = TEXTS.includes(+text) ? +text : 100;
  const W = f === 'fit' || f === 'rem' ? w : f === 'scale' ? Math.max(360, Math.ceil(600 * w / h)) : Math.round(w / Math.max(1, Math.min(ZMAX, w / 360)));
  const k = w / W, fz = f === 'rem' ? Math.max(1, Math.min(ZMAX, w / 360)) : 1, r2 = v => Math.round(v * 1000) / 1000;
  const desc = `${w} px phone · ${FIT_NAMES[f]}: laid out ${W} CSS px wide${k > 1.001 ? `, drawn ×${r2(k)}` : ''}${fz > 1.001 ? `, rem ×${r2(fz)}` : ''} · text ${tx}%`;
  return { device: String(w), w, h, fit: f, text: tx, W, H: h / k, k, fz, desc };
}
/* the app always gets fit and text (a value saved in its Tune must not leak in); a component stage only when they change what it draws */
function screenUrl(url, app, s) {
  const q = app ? [`fit=${s.fit}`, `text=${s.text}`] : [s.fit === 'rem' ? 'fit=rem' : '', s.text !== 100 ? `text=${s.text}` : ''].filter(Boolean);
  return q.length ? url + (url.includes('?') ? '&' : '?') + q.join('&') : url;
}
const RAW_VISUAL = `https://raw.githubusercontent.com/${'samgestudio-dev/Perasure'}/devmode-visual/`;
const log = (...a) => process.stderr.write('[' + NAME + '] ' + a.join(' ') + '\n');

/* ---------------------------------------------------------------- reading files (local clone, or the live site) */
const cache = new Map();
async function read(rel) {
  if (LOCAL) return fs.promises.readFile(path.join(LOCAL, rel), 'utf8');
  const hit = cache.get(rel);
  if (hit && Date.now() - hit.t < 60000) return hit.v;
  const url = SITE + rel.split('/').map(encodeURIComponent).join('/') + '?t=' + Math.floor(Date.now() / 60000);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`could not read ${SITE + rel} (HTTP ${r.status})`);
  const v = await r.text();
  cache.set(rel, { t: Date.now(), v });
  return v;
}
/* a file as it was in an older version: its git tag devmode-<id> (exact), else the version's snapshot copy */
async function readAt(rel, ver) {
  const D = await data();
  if (!ver || ver === D.latest.id) return read(rel);
  if (LOCAL) {
    try { return execFileSync('git', ['show', `devmode-${ver}:${rel}`], { cwd: LOCAL, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32e6 }); } catch {}
    return read(`devmode/snapshots/${ver}/${rel}`);
  }
  const key = 'tag:' + ver + ':' + rel;
  if (cache.has(key)) return cache.get(key).v;
  try {
    const r = await fetch(`https://raw.githubusercontent.com/${REPO}/devmode-${ver}/${rel}`);
    if (r.ok) { const v = await r.text(); cache.set(key, { t: Date.now(), v }); return v; }
  } catch {}
  return read(`devmode/snapshots/${ver}/${rel}`);
}
function runScript(code) {
  const ctx = { window: {}, document: { querySelector: () => null, currentScript: null }, console, URLSearchParams };
  vm.runInNewContext(code, ctx, { timeout: 3000 });
  return ctx.window;
}
function parseIndex(text) { return JSON.parse(text.slice(text.indexOf('=') + 1).trim().replace(/;\s*$/, '')); }

let dataP = null, dataT = 0;
async function data() {
  if (dataP && Date.now() - dataT < 60000) return dataP;
  dataT = Date.now();
  dataP = (async () => {
    const [ix, pg, it, st] = await Promise.all(['index', 'pages', 'iterations', 'status'].map(f => read(`devmode/data/${f}.js`)));
    const index = parseIndex(ix), pages = runScript(pg).DM_PAGES, iterations = runScript(it).DM_ITERATIONS, status = runScript(st).DM_STATUS;
    return { index, pages, iterations, status, latest: iterations[0] };
  })().catch(e => { dataP = null; throw e; });
  return dataP;
}
async function indexAt(ver) {
  const D = await data();
  if (!ver || ver === D.latest.id) return D.index;
  if (!D.iterations.some(i => i.id === ver)) throw new Error(`no version "${ver}". Versions: ${D.iterations.map(i => i.id).join(', ')}`);
  return parseIndex(await read(`devmode/snapshots/${ver}/devmode-index.js`));
}

/* ---------------------------------------------------------------- lookups and links */
const lc = s => String(s || '').toLowerCase();
const ref = (D, ver) => (!ver || ver === D.latest.id ? 'main' : 'devmode-' + ver);
const gh = (D, file, a, b, ver) => `https://github.com/${REPO}/blob/${ref(D, ver)}/${file}${a ? '#L' + a + (b && b !== a ? '-L' + b : '') : ''}`;
const dm = hash => SITE + 'devmode/index.html#' + hash;
const tx = v => (v == null ? '' : typeof v === 'string' ? v : [v.zh, v.en].filter(Boolean).join(' / '));
const allPages = D => Object.values(D.pages.byId);
function findPage(D, q) {
  if (!q) return null;
  const k = lc(q);
  return D.pages.byId[q] || allPages(D).find(p => lc(p.id) === k || lc(p.code) === k || lc(p.page) === k || lc(p.name) === k || lc(p.en) === k) || null;
}
function findComp(ix, q) {
  const k = lc(String(q || '').replace(/^PS\./i, '').replace(/^<|\s*\/?>$/g, ''));
  const names = Object.keys(ix.components);
  return ix.components[names.find(n => lc(n) === k)] || null;
}
function suggest(list, q, n = 6) { const k = lc(q); return list.filter(x => lc(x).includes(k) || k.includes(lc(x))).slice(0, n); }
function statusOf(D, kind, id) { const S = D.status || {}; return ((kind === 'pages' ? S.pages : S.components) || {})[id] || S.default || { status: 'ready', since: 'v1.0' }; }
const STATUS = { ready: 'Ready for dev', changed: 'Changed', completed: 'Completed' };
function historyOf(D, kind, id) { return D.iterations.filter(it => it.baseline || (it.changes || []).some(c => (c[kind] || []).includes(id))); }
function histLines(D, kind, id) {
  return historyOf(D, kind, id).map(it => {
    const ch = (it.changes || []).filter(c => (c[kind] || []).includes(id));
    return `- **${it.label}** (${it.date})${it.jira ? ` · ${it.jira.key}${it.jira.title ? ' ' + it.jira.title : ''}` : it.baseline ? ' · baseline' : ' · 无 Jira 单号'} — ${tx(it.title)}`
      + ch.map(c => `\n  - ${c.type.toUpperCase()} · ${c.action}: ${tx(c.title)}${c.detail ? ' — ' + tx(c.detail) : ''}`).join('');
  }).join('\n');
}
function firstLine(doc) { return String(doc || '').split('\n')[0].replace(/^\w+:\s*/, '').slice(0, 140); }
function tidy(doc) {
  return String(doc || '').split('\n').map(l => l.trim()).reduce((a, l) => { if (a.length && /^[a-z(·—\-+"'“]/.test(l)) a[a.length - 1] += ' ' + l; else a.push(l); return a; }, []).join('\n');
}
function lines(text, a, b) { return text.split('\n').slice(a - 1, b).join('\n'); }
function fence(code, lang = '') { const f = /```/.test(code) ? '~~~~' : '```'; return f + lang + '\n' + code.replace(/\s+$/, '') + '\n' + f; }

/* ---------------------------------------------------------------- tokens (tokens/tokens.css + ps-ui.css :root), parsed here */
const tokCache = new Map();
async function tokens(ver) {
  const D = await data(), key = ver || D.latest.id;
  if (tokCache.has(key)) return tokCache.get(key);
  const p = (async () => {
    const [t, ui] = await Promise.all([readAt('tokens/tokens.css', ver), readAt('shared/ps-ui/ps-ui.css', ver).catch(() => '')]);
    const map = new Map(), from = new Map(), rx = /(--[\w-]+)\s*:\s*([^;]+);/g;
    for (const [src, css] of [['tokens/tokens.css', t], ['shared/ps-ui/ps-ui.css', (ui.match(/:root\s*\{[\s\S]*?\}/g) || []).join('\n')]]) {
      const body = css.replace(/\/\*[\s\S]*?\*\//g, ''); let m;
      while ((m = rx.exec(body))) if (!map.has(m[1])) { map.set(m[1], m[2].trim()); from.set(m[1], src); }
    }
    const resolve = (v, d = 0) => (d > 8 ? v : v.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, (all, n, fb) => (map.has(n) ? resolve(map.get(n), d + 1) : fb || all)));
    return { map, from, resolve };
  })();
  tokCache.set(key, p);
  return p;
}
function category(n) { return /^--(color|gradient)-/.test(n) ? 'color' : /^--spacing-/.test(n) ? 'spacing' : /^--radius-/.test(n) ? 'radius' : /^--font-/.test(n) ? 'type' : /^--(shadow|blur)-/.test(n) ? 'shadow' : /^--ps-/.test(n) ? 'ps' : 'other'; }
function remOf(v) { const m = /^(-?\d*\.?\d+)px$/.exec(String(v).trim()); return m ? ` (${+(parseFloat(m[1]) / 16).toFixed(4)}rem)` : ''; }

/* ---------------------------------------------------------------- source helpers */
function blockEnd(src, i) {
  let depth = 0;
  for (let n = src.length; i < n; i++) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i < 0) return n; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i + 2) + 1; if (i <= 0) return n; continue; }
    if (c === '"' || c === "'" || c === '`') { const q = c; for (i++; i < n && src[i] !== q; i++) if (src[i] === '\\') i++; continue; }
    if (c === '{' || c === '[' || c === '(') depth++;
    if (c === '}' || c === ']' || c === ')') { depth--; if (!depth) return i + 1; }
  }
  return src.length;
}
/* the gallery entry of a component: how it is used, state by state (shared/gallery.js / gallery-app.js) */
async function galleryEntry(entry, ver) {
  if (!entry) return null;
  for (const file of ['shared/gallery.js', 'shared/gallery-app.js']) {
    const src = await readAt(file, ver).catch(() => '');
    const esc = entry.replace(/'/g, "\\'"), at = src.indexOf(`{ name: '${esc}'`);
    if (at < 0) continue;
    const end = blockEnd(src, at), line = src.slice(0, at).split('\n').length;
    let code = src.slice(at, end);
    const ls = code.split('\n');
    if (ls.length > 140) code = ls.slice(0, 140).join('\n') + `\n/* … ${ls.length - 140} more lines: see the file */`;
    return { file, line, end: line + ls.length - 1, code };
  }
  return null;
}
/* motion values (PS.MT in shared/ps-ui/core.js): the whole block, or the lines of some keys */
async function motionBlock(ver) {
  const src = await readAt('shared/ps-ui/core.js', ver), at = src.indexOf('var MT = PS.MT = {');
  if (at < 0) return null;
  const start = src.lastIndexOf('/* ---- motion', at), s0 = start >= 0 ? start : at, end = blockEnd(src, src.indexOf('{', at)) + 1;
  return { line: src.slice(0, s0).split('\n').length, code: src.slice(s0, end) };
}
function motionLines(block, keys) {
  if (!block || !keys.length) return '';
  const ls = block.code.split('\n');
  return keys.map(k => { const i = ls.findIndex(l => new RegExp('(^|[\\s{,])' + k + '\\s*:').test(l)); return i < 0 ? `${k}: (not found)` : (ls[i - 1] && /^\s*\/\*/.test(ls[i - 1]) ? ls[i - 1].trim() + '\n' : '') + ls[i].trim(); }).join('\n');
}

/* ---------------------------------------------------------------- formatting a component / a page */
async function componentText(name, opts = {}) {
  const D = await data(), ver = opts.version || null, ix = await indexAt(ver), c = findComp(ix, name);
  if (!c) throw new Error(`no component "${name}". Close matches: ${suggest(Object.keys(ix.components), String(name).replace(/^PS\./, '')).join(', ') || '— use list_components or search'}`);
  const want = s => !opts.sections || opts.sections.includes(s);
  const st = statusOf(D, 'components', c.name), out = [];
  out.push(`# PS.${c.name}`);
  out.push(`Version ${ver || D.latest.id}${ver && ver !== D.latest.id ? '' : ' (latest)'} · status **${STATUS[st.status] || st.status}** (since ${st.since})${st.note ? ' — ' + st.note : ''}`);
  out.push(`Source: \`${c.file}\` lines ${c.line}–${c.end} · ${gh(D, c.file, c.line, c.end, ver)}`);
  out.push(`Dev Mode: ${dm('v=components&c=' + c.name + (ver && ver !== D.latest.id ? '&ver=' + ver : ''))}`);
  if (c.figma && c.figma.length) out.push('Figma: ' + c.figma.map(f => `${f.id} (${f.file === ix.figmaFiles?.ds ? 'design system' : 'app'}) ${f.url}`).join(' · '));
  if (want('doc') && c.doc) out.push('\n## Description\n' + tidy(c.doc));
  if (want('props') && c.galleryProps) out.push('\n## Props\n' + c.galleryProps);
  if (want('states') && c.states && c.states.length) out.push(`\n## States (gallery entry "${c.gallery}")\n` + c.states.map((s, i) => `${i}. ${s}`).join('\n'));
  if (want('usage')) {
    const g = await galleryEntry(c.gallery, ver);
    if (g) out.push(`\n## Usage examples (the gallery entry, \`${g.file}\` lines ${g.line}–${g.end})\nEach state is a function returning the component as the app uses it (React without JSX: h = React.createElement).\n` + fence(g.code, 'js'));
  }
  if (want('code')) {
    const src = await readAt(c.file, ver);
    out.push(`\n## Source (\`${c.file}\` ${c.line}–${c.end})\n` + fence(lines(src, c.line, c.end), 'js'));
  }
  if (want('css') && c.css && c.css.length) {
    out.push('\n## CSS as written (`shared/ps-ui/ps-ui.css`)\n' + fence(c.css.map(r => `/* L${r.line}${r.end !== r.line ? '–' + r.end : ''}${r.note ? ' · ' + r.note : ''} */\n${r.sel} {\n  ${r.body.split(/;\s*\n?\s*/).filter(Boolean).join(';\n  ')};\n}`).join('\n\n'), 'css'));
  }
  if (want('tokens') && c.tokens && c.tokens.length) {
    const T = await tokens(ver);
    out.push('\n## Tokens used\n' + c.tokens.map(n => { const raw = T.map.get(n); if (raw == null) return `- \`${n}\` (not defined in tokens.css / ps-ui.css)`; const v = T.resolve(raw); return `- \`${n}\`: ${raw}${v !== raw ? ' → ' + v : ''}${remOf(v)}`; }).join('\n'));
  }
  if (want('motion') && c.motion && c.motion.length) {
    const mb = await motionBlock(ver);
    out.push('\n## Motion (PS.MT, `shared/ps-ui/core.js`)\n' + fence(motionLines(mb, c.motion), 'js'));
  }
  if (want('assets') && (c.icons.length || c.art.length || c.anims.length)) {
    const base = SITE + (ver && ver !== D.latest.id ? `devmode/snapshots/${ver}/` : '') + 'shared/ps-ui/assets/';
    out.push('\n## Assets\n' + [...c.icons.map(n => `- icon \`${n}\`: ${base}icons/${n}.svg (drawn as a mask; colour from a token)`),
      ...c.art.map(n => `- picture: ${base}${n}`), ...c.anims.map(n => `- animation \`${n}\`: ${SITE}animations/${n}/${n}.json (Lottie)`)].join('\n'));
  }
  if (want('classes') && c.classes.length) out.push('\n## Classes it renders\n' + c.classes.map(x => '`.' + x + '`').join(' '));
  if (want('uses') && c.uses.length) out.push('\n## Uses\n' + c.uses.map(x => 'PS.' + x).join(', '));
  if (want('pages')) {
    const pg = (c.pages || []).map(code => { const p = findPage(D, code); return p ? `- ${p.en} (${p.name}) — \`${p.id}\`` : `- \`${code}\``; });
    out.push('\n## Used on pages\n' + (pg.length ? pg.join('\n') : '- Not used on an app page directly (other components use it)'));
  }
  if (want('history')) out.push('\n## Iterations that changed it\n' + histLines(D, 'components', c.name));
  return out.join('\n');
}

async function pageText(q, opts = {}) {
  const D = await data(), ver = opts.version || null, ix = await indexAt(ver), p = findPage(D, q);
  if (!p) throw new Error(`no page "${q}". Close matches: ${suggest(allPages(D).map(x => x.id), q).join(', ') || '— use list_pages'}`);
  const info = ix.pages[p.code] || null, st = statusOf(D, 'pages', p.id), out = [];
  const states = p.states || [], sIdx = Math.max(0, Math.min(states.length - 1, +opts.state || 0)), state = states.length ? states[sIdx] : null;
  const root = ver && ver !== D.latest.id ? SITE + `devmode/snapshots/${ver}/` : SITE, url = D.pages.url(p, state, root), js = D.pages.js(p, state);
  out.push(`# ${p.en} (${p.name}) — page \`${p.id}\``);
  out.push(`Kind: ${p.kind} · section: ${p.section} · version ${ver || D.latest.id} · status **${STATUS[st.status] || st.status}** (since ${st.since})`);
  if (p.noteEn || p.note) out.push(`Note: ${p.noteEn || p.note}`);
  out.push(`Dev Mode: ${dm('p=' + p.id + (sIdx ? '&s=' + sIdx : '') + (ver && ver !== D.latest.id ? '&ver=' + ver : ''))}`);
  out.push(`Open it (phone or browser): ${url}${js ? `\nthen run in the page: \`${js}\`` : ''}`);
  if (states.length > 1) out.push('\n## States\n' + states.map((s, i) => `${i}. ${s.en || s.name} (${s.name})${i === sIdx ? ' ← shown' : ''} — Tune: \`${s.q || p.q}\``).join('\n'));
  if (info) {
    out.push(`\n## Source\n\`${info.file}\` lines ${info.line}–${info.end} · ${gh(D, info.file, info.line, info.end, ver)}`);
    if (info.figma && info.figma.length) out.push('Figma: ' + info.figma.map(f => `${f.id} ${f.url}`).join(' · '));
    if (opts.code !== false) { const src = await readAt(info.file, ver); out.push(fence(lines(src, info.line, info.end), 'js')); }
    out.push('\n## Components on this page\n' + info.components.map(n => { const c = ix.components[n]; return `- PS.${n}${c ? ' — ' + firstLine(c.doc) : ''}`; }).join('\n'));
  }
  out.push('\n## Iterations that changed it\n' + histLines(D, 'pages', p.id));
  return out.join('\n');
}

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
  if (!LOCAL) return SITE;
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

/* ---------------------------------------------------------------- tools */
const S = (props, req = []) => ({ type: 'object', properties: props, required: req, additionalProperties: false });
const verP = { type: 'string', description: 'An iteration id (see list_iterations). Default: the latest version.' };
const devP = { type: 'string', enum: ['360', '390', '430'], description: 'Phone width in points (default 360)' };
const fitP = { type: 'string', enum: FITS, description: 'Screen fit, as the app\'s Tune: cap = capped zoom, the default (a 390 phone lays out 360 CSS px and draws them ×1.083; 430 → 374 ×1.15); rem = the same factor through the root font size; fit = 1:1; scale = full zoom' };
const textP = { type: 'integer', enum: TEXTS, description: 'Text size in % (default 100). Up to 130 the whole layout grows; above it only text' };
const TOOLS = [
  { name: 'get_overview', title: 'Overview',
    description: 'What PeraSure Dev Mode holds and how to use these tools: versions, page sections, component files, statuses. Call this first if unsure.',
    inputSchema: S({}),
    run: async () => {
      const D = await data(), comps = Object.values(D.index.components), files = {};
      comps.forEach(c => { const f = c.file.split('/').pop(); files[f] = (files[f] || 0) + 1; });
      const changed = Object.entries({ ...(D.status.pages || {}), ...(D.status.components || {}) }).filter(([, v]) => v.status === 'changed').length;
      const upd = await updateNote();
      return [
        '# PeraSure Dev Mode', `${SITE}devmode/index.html · data: ${LOCAL ? 'local clone ' + LOCAL : 'live site'} · server ${VERSION}${upd}`,
        '', 'The PeraSure app (a Philippine lending app) as a working prototype: every page, and the shared React components (PS.*, `shared/ps-ui/`) it is built from, styled only with design tokens (CSS custom properties from Figma, `tokens/tokens.css`; sizes in rem, 1rem = 16px).',
        '', `## Versions (newest first)\n${D.iterations.map((i, k) => `- \`${i.id}\` ${i.label} (${i.date})${k === 0 ? ' ← latest' : ''} — ${tx(i.title)} · ${(i.changes || []).length} changes`).join('\n')}`,
        '', `## Pages (${allPages(D).length})\n${D.pages.sections.map(s => `- ${s.en}: ${s.pages.map(p => '`' + p.id + '`').join(', ')}`).join('\n')}`,
        '', `## Components (${comps.length}) by file\n${Object.entries(files).map(([f, n]) => `- shared/ps-ui/${f}: ${n}`).join('\n')}`,
        '', `## Statuses\nDefault: ${STATUS[D.status.default?.status] || 'Ready for dev'}; ${changed} marked Changed (see get_status).`,
        '', '## How to use',
        '- A Dev Mode link pasted by the user → resolve_devmode_link; a Figma link → find_by_figma.',
        '- Build or update a component → get_component (description, props, usage examples, source, CSS as written, tokens with values, motion, assets, history).',
        '- A screen → get_page (how to open it, its source, its components).',
        '- What changed → get_changes / get_iteration (recorded) and get_visual_changes (found by the visual check, not recorded yet); what to build → get_status.',
        '- Token values → get_tokens; motion values → get_motion.',
        '- Seeing it → get_screenshot; exact measured sizes and spacing → get_live_specs; checking an implementation against the demo → qa_compare (these need Playwright).',
        '- The code is React 18 without JSX (h = React.createElement) and Motion (Framer Motion); keep the token names when porting to another stack.'
      ].join('\n');
    } },
  { name: 'resolve_devmode_link', title: 'Open a Dev Mode link',
    description: 'Read what a PeraSure Dev Mode link points at (a page, a component, a selected layer, a version, a comparison) and return its full details — use it whenever the user pastes a Dev Mode link (…/devmode/index.html#…).',
    inputSchema: S({ url: { type: 'string', description: 'The Dev Mode link, or just its #… part' } }, ['url']),
    run: async ({ url }) => {
      const D = await data(), hash = String(url).split('#')[1] || String(url), H = {};
      hash.split('&').forEach(kv => { if (!kv) return; const i = kv.indexOf('='); H[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1)); });
      const ver = H.ver || null, out = [];
      /* the device, Screen fit and Text size the link was made with */
      const scrLine = H.dev || H.fit || H.tx ? (() => { const sc = screenOf(H.dev, H.fit, H.tx); return `Screen: ${sc.desc}. Pass device "${sc.device}", fit "${sc.fit}", text ${sc.text} to get_screenshot / get_live_specs / qa_compare to see the same layout.`; })() : '';
      /* notes made in Dev Mode's Annotate mode travel in the link: a task list, one item per pin */
      if (H.notes) {
        let o = null; try { o = JSON.parse(Buffer.from(H.notes.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')); } catch {}
        if (o && Array.isArray(o.n)) {
          const ix = await indexAt(ver), m = /^([pc]):(.+):(\d+)$/.exec(o.w || ''), TYPES = { ui: 'UI', motion: 'Motion', copy: 'Copy', bug: 'Bug' };
          let where = o.w;
          if (m && m[1] === 'p') { const p = findPage(D, m[2]); const st = p && p.states ? p.states[+m[3]] : null; where = p ? `page ${p.en} (${p.name}) \`${p.id}\`${st ? ', state ' + m[3] + ' ' + (st.en || st.name) : ''}` : o.w; }
          else if (m) where = `component PS.${m[2]}, gallery state ${m[3]}`;
          out.push(`# Notes from Dev Mode — ${o.n.length} on ${where}`, 'Each note points at a layer (component path; after "|" the child-index path of an element inside it). Work through them in order.', '');
          o.n.forEach((n, i) => {
            const cut = n.p.indexOf('|'), comp = (cut < 0 ? n.p : n.p.slice(0, cut)).split('>').pop().replace(/#\d+$/, ''), c = ix.components[comp];
            out.push(`${i + 1}. **[${TYPES[n.k] || 'UI'}]** ${n.t}`, `   Layer: \`${n.p}\` — ${c ? `PS.${comp} (\`${c.file}\`:${c.line}; get_component "${comp}")` : comp}${cut >= 0 ? ', an element inside it' : ''}`);
          });
          out.push('', m && m[1] === 'p' ? `Page details: get_page("${m[2]}"${+m[3] ? ', state ' + m[3] : ''}). Measured specs of a noted layer: get_live_specs with page and the layer path (needs Playwright).` : '', scrLine);
          return out.join('\n');
        }
      }
      if (H.cmp) { const [a, b] = H.cmp.split('..'); out.push(`The link opens a comparison ${a} → ${b}.\n`); out.push(await changesText(a, b)); }
      if (H.v === 'iterations') return out.concat(await iterationText(H.it)).join('\n');
      if (H.v === 'tokens') return out.concat(`The link opens the Tokens view${H.cat ? ' (' + H.cat + ')' : ''}. Use get_tokens to read them.`).join('\n');
      let comp = null, el = null;
      if (H.sel) {
        const seg = H.sel.split('>').pop(), cut = seg.indexOf('|');
        comp = (cut < 0 ? seg : seg.slice(0, cut)).replace(/#\d+$/, '');
        if (H.sel.includes('|')) el = H.sel.slice(H.sel.indexOf('|') + 1);
        out.push(`Selected layer: \`${H.sel}\`${el ? ' (an element inside the component; child-index path ' + el + ')' : ''}`);
      } else if (H.v === 'components' && H.c) comp = H.c;
      if (H.v !== 'components') {
        const p = findPage(D, H.p || 'home');
        if (p) out.push(`Page: ${p.en} (${p.name}) — \`${p.id}\`${H.s ? ', state ' + H.s : ''}. Details: get_page("${p.id}"${H.s ? ', state ' + H.s : ''}).`);
      }
      if (scrLine) out.push(scrLine);
      if (comp && /^APP\./.test(comp)) out.push(`\n${comp} is the app's own piece, not a shared component: its code is in prototypes/app/ (see the page source in get_page).`);
      else if (comp && /^[A-Z]/.test(comp) && !['tabs'].includes(comp)) out.push('\n' + await componentText(comp, { version: ver }));
      else if (!comp && H.v !== 'components') { const p = findPage(D, H.p || 'home'); if (p) out.push('\n' + await pageText(p.id, { version: ver, state: H.s })); }
      if (H.sel && LOCAL === null && !(await playwright())) out.push('\n(With Playwright installed, get_live_specs gives the selected layer\'s measured size, padding and gaps.)');
      return out.join('\n');
    } },
  { name: 'list_pages', title: 'List pages',
    description: 'Every page and sheet of the PeraSure app, by section, with its id (use it with get_page / get_screenshot), kind and status.',
    inputSchema: S({ query: { type: 'string', description: 'Filter by name or id' }, section: { type: 'string', description: 'Section id, e.g. home, loan, repay, apply, account, help' } }),
    run: async ({ query, section }) => {
      const D = await data(), k = lc(query);
      return D.pages.sections.filter(s => !section || s.id === section).map(s => {
        const ps = s.pages.filter(p => !k || [p.id, p.name, p.en, p.code].some(x => lc(x).includes(k)));
        return ps.length ? `## ${s.en} (${s.name}) \`${s.id}\`\n` + ps.map(p => `- \`${p.id}\` ${p.en} (${p.name}) · ${p.kind}${p.states ? ' · ' + p.states.length + ' states' : ''} · ${STATUS[statusOf(D, 'pages', p.id).status]}`).join('\n') : '';
      }).filter(Boolean).join('\n\n') || 'No page matches.';
    } },
  { name: 'get_page', title: 'Get a page',
    description: 'One app page or sheet: how to open it (link + script), its states, its source file and code, the shared components on it, Figma nodes, status and the iterations that changed it.',
    inputSchema: S({ page: { type: 'string', description: 'Page id (list_pages), screen name or name' }, state: { type: 'integer', description: 'State index (see the page\'s states)' }, version: verP, code: { type: 'boolean', description: 'Include the page source (default true)' } }, ['page']),
    run: a => pageText(a.page, a) },
  { name: 'list_components', title: 'List components',
    description: 'The shared components (PS.*) with their file and a one-line description. Filter by a word or a file (core.js, layout.js, coupon.js, loan.js, pay.js, apply.js …).',
    inputSchema: S({ query: { type: 'string' }, file: { type: 'string' }, version: verP }),
    run: async ({ query, file, version }) => {
      const D = await data(), ix = await indexAt(version), k = lc(query), by = {};
      Object.values(ix.components).filter(c => (!k || lc(c.name).includes(k) || lc(c.doc).includes(k)) && (!file || c.file.endsWith(file))).forEach(c => { (by[c.file] = by[c.file] || []).push(c); });
      return Object.entries(by).map(([f, cs]) => `## ${f}\n` + cs.map(c => `- PS.${c.name} — ${firstLine(c.doc)}${c.states?.length ? ` · ${c.states.length} states` : ''}${statusOf(D, 'components', c.name).status !== 'ready' ? ' · ' + STATUS[statusOf(D, 'components', c.name).status] : ''}`).join('\n')).join('\n\n') || 'No component matches.';
    } },
  { name: 'get_component', title: 'Get a component',
    description: 'Everything about one shared component (PS.<Name>): description, props, states, usage examples, source code, CSS exactly as written, tokens with their values, motion values, icons and pictures, Figma nodes, pages that use it, status and history. Use sections to ask for less.',
    inputSchema: S({ name: { type: 'string', description: 'Component name, e.g. CouponOption or PS.CouponOption' }, version: verP,
      sections: { type: 'array', items: { type: 'string', enum: ['doc', 'props', 'states', 'usage', 'code', 'css', 'tokens', 'motion', 'assets', 'classes', 'uses', 'pages', 'history'] }, description: 'Only these parts (default: all)' } }, ['name']),
    run: a => componentText(a.name, a) },
  { name: 'get_component_code', title: 'Get component code',
    description: 'Just the code of a shared component: its JS source and its CSS rules as written, at a version.',
    inputSchema: S({ name: { type: 'string' }, version: verP }, ['name']),
    run: a => componentText(a.name, { version: a.version, sections: ['code', 'css'] }) },
  { name: 'get_tokens', title: 'Get design tokens',
    description: 'PeraSure design tokens (CSS custom properties, tokens/tokens.css; app-only --ps-* from ps-ui.css) with raw and resolved values and rem. Filter by words, a category, or exact names.',
    inputSchema: S({ query: { type: 'string', description: 'Words in the name or value, e.g. "gap", "brand", "#2f80ed"' }, category: { type: 'string', enum: ['color', 'spacing', 'radius', 'type', 'shadow', 'ps', 'other'] }, names: { type: 'array', items: { type: 'string' } }, version: verP, limit: { type: 'integer', description: 'Default 150' } }),
    run: async ({ query, category: cat, names, version, limit }) => {
      const T = await tokens(version), k = lc(query), want = names && names.map(n => (n.startsWith('--') ? n : '--' + n).replace(/^var\((.*)\)$/, '$1'));
      const rows = [...T.map.entries()].filter(([n, v]) => (!want || want.includes(n)) && (!cat || category(n) === cat) && (!k || lc(n).includes(k) || lc(v).includes(k) || lc(T.resolve(v)).includes(k)));
      const max = limit || 150;
      return `${rows.length} token(s)${rows.length > max ? `, first ${max}` : ''} · source: tokens/tokens.css (made from Figma; never edit by hand)\n` + rows.slice(0, max).map(([n, v]) => { const r = T.resolve(v); return `- \`${n}\`: ${v}${r !== v ? ' → ' + r : ''}${remOf(r)}${T.from.get(n) !== 'tokens/tokens.css' ? ' · ' + T.from.get(n) : ''}`; }).join('\n');
    } },
  { name: 'get_motion', title: 'Get motion values',
    description: 'PeraSure motion values (PS.MT in shared/ps-ui/core.js): the spring, enter / leave tweens, press, rises, blur, menu springs — with the rules written next to them.',
    inputSchema: S({ version: verP }),
    run: async ({ version }) => { const m = await motionBlock(version); if (!m) throw new Error('PS.MT not found'); const D = await data(); return `PS.MT · shared/ps-ui/core.js line ${m.line} · ${gh(D, 'shared/ps-ui/core.js', m.line, null, version)}\n` + fence(m.code, 'js'); } },
  { name: 'list_iterations', title: 'List iterations',
    description: 'The iteration record, newest first: each version\'s label (v1 · date · Jira key), title and number of UI / motion changes.',
    inputSchema: S({}),
    run: async () => { const D = await data(); return D.iterations.map((i, k) => `- \`${i.id}\` **${i.label}** (${i.date})${k === 0 ? ' ← latest' : ''}${i.jira ? ' · ' + i.jira.key : i.baseline ? ' · baseline' : ' · 无 Jira 单号'} — ${tx(i.title)} · UI ${(i.changes || []).filter(c => c.type === 'ui').length}, motion ${(i.changes || []).filter(c => c.type === 'motion').length}`).join('\n'); } },
  { name: 'get_iteration', title: 'Get an iteration',
    description: 'One iteration in full: Jira ticket, summary, and every change (UI or motion; added / edited / removed; pages and components; before → after; Figma nodes).',
    inputSchema: S({ id: { type: 'string', description: 'Iteration id; default the latest' } }),
    run: a => iterationText(a.id) },
  { name: 'get_changes', title: 'Get changes between versions',
    description: 'What changed from one version to another (default: from the previous version to the latest), grouped by component and page — use it to update an implementation to the newest design.',
    inputSchema: S({ since: { type: 'string', description: 'Older iteration id (exclusive)' }, until: { type: 'string', description: 'Newer iteration id (inclusive); default latest' } }),
    run: a => changesText(a.since, a.until) },
  { name: 'get_status', title: 'Get dev statuses',
    description: 'Dev statuses as in Figma Dev Mode — Ready for dev, Changed (since an iteration), Completed — for pages and components.',
    inputSchema: S({ status: { type: 'string', enum: ['ready', 'changed', 'completed'] } }),
    run: async ({ status }) => {
      const D = await data(), S2 = D.status, out = [`Default for anything not listed: ${STATUS[S2.default.status]} (since ${S2.default.since}).`];
      for (const kind of ['pages', 'components']) {
        const rows = Object.entries(S2[kind] || {}).filter(([, v]) => !status || v.status === status);
        out.push(`\n## ${kind}\n` + (rows.length ? rows.map(([id, v]) => `- ${kind === 'components' ? 'PS.' : ''}${id}: ${STATUS[v.status]} since ${v.since}${v.note ? ' — ' + v.note : ''}`).join('\n') : '- none listed'));
      }
      return out.join('\n');
    } },
  { name: 'find_by_figma', title: 'Find the code of a Figma node',
    description: 'Given a Figma link (or node id) from a design or a ticket, the shared components (PS.*) and app pages built from that node — from the Figma nodes named in the components\' comments and the design-system components matched in devmode/data/figma-links.js.',
    inputSchema: S({ url: { type: 'string', description: 'A figma.com link with node-id, or a node id like 3152:1405' }, version: verP }, ['url']),
    run: async ({ url, version }) => {
      const m = /node-id=([0-9]+)(?:-|%3A|:)([0-9]+)/i.exec(url) || /^\s*([0-9]+)[:-]([0-9]+)\s*$/.exec(url);
      if (!m) throw new Error('no node id in that link (it needs ?node-id=…)');
      const id = m[1] + ':' + m[2], fm = /figma\.com\/(?:design|file|proto)\/([0-9a-zA-Z]{10,})/.exec(url), file = fm ? fm[1] : null;
      const D = await data(), ix = await indexAt(version), hit = f => f.id === id && (!file || f.file === file);
      const comps = Object.values(ix.components).filter(c => (c.figma || []).some(hit)), pgs = Object.values(ix.pages || {}).filter(pg => (pg.figma || []).some(hit));
      if (!comps.length && !pgs.length) return `Nothing in the code is linked to Figma node ${id}${file ? ' in ' + file : ''} yet. Try search with the layer's name, or list_components.`;
      return [`# Figma node ${id} is built as`, ...comps.map(c => `- PS.${c.name} — \`${c.file}\`:${c.line} — ${firstLine(c.doc)} (get_component "${c.name}")`),
        ...pgs.map(pg => { const p = findPage(D, pg.id); return `- page ${p ? p.en + ' (' + p.name + ') `' + p.id + '`' : pg.id} — \`${pg.file}\`:${pg.line} (get_page "${p ? p.id : pg.id}")`; })].join('\n');
    } },
  { name: 'get_visual_changes', title: 'Unrecorded visual changes',
    description: 'The latest visual check: every page state and component state of the code now, compared pixel by pixel with the latest recorded iteration — what changed but is not recorded yet, where it starts (components) and a before | after | difference picture link. Use it to see what a recent push changed.',
    inputSchema: S({}),
    run: async () => {
      let r = null, src = RAW_VISUAL;
      const local = LOCAL && path.join(LOCAL, 'devmode-visual-out', 'report.json');
      if (local && fs.existsSync(local)) { r = JSON.parse(fs.readFileSync(local, 'utf8')); src = 'local run (devmode-visual-out/)'; }
      else { const x = await fetch(RAW_VISUAL + 'report.json?t=' + Math.floor(Date.now() / 60000)); if (!x.ok) return 'No visual check report yet: the "Dev Mode visual check" workflow makes one after a push (tools/devmode-visual.mjs).'; r = await x.json(); }
      const n = r.changed.length + r.added.length;
      return [`# Unrecorded changes — against ${r.against}`, `Checked ${r.at}${r.commit ? ' at commit ' + r.commit.slice(0, 7) : ''} · ${r.items} renders · source: ${src}`, `Dev Mode: ${dm('v=iterations&it=pending')}`,
        n ? `${r.changed.length} changed, ${r.added.length} new, ${r.failed.length} could not render.` : 'Nothing changed since the latest iteration.',
        r.summary && r.summary.components.length ? `Components involved: ${r.summary.components.map(c => (/^APP\./.test(c) ? c : 'PS.' + c)).join(', ')}` : '',
        ...r.changed.map(c => `- ${c.kind} **${c.label}** — ${(c.ratio * 100).toFixed(2)}% of pixels; starts at: ${(c.components || []).join(', ') || '—'}; box ${c.box.join('×')}${c.unsteady ? ' (moving parts left out)' : ''}\n  picture (before | after | difference): ${src === RAW_VISUAL ? RAW_VISUAL + c.image : c.image}`),
        ...r.added.map(c => `- new ${c.kind}: ${c.label}`), ...r.failed.map(c => `- could not render ${c.label}: ${c.error}`)].filter(Boolean).join('\n');
    } },
  { name: 'search', title: 'Search',
    description: 'Search pages, components, tokens and iterations at once.',
    inputSchema: S({ query: { type: 'string' } }, ['query']),
    run: async ({ query }) => {
      const D = await data(), k = lc(query), T = await tokens(), out = [];
      const pg = allPages(D).filter(p => [p.id, p.name, p.en, p.code, p.note, p.noteEn].some(x => lc(x).includes(k))).slice(0, 12);
      const cs = Object.values(D.index.components).filter(c => lc(c.name).includes(k) || lc(c.doc).includes(k) || c.classes.some(x => lc(x).includes(k))).slice(0, 15);
      const tk = [...T.map.entries()].filter(([n, v]) => lc(n).includes(k) || lc(v).includes(k)).slice(0, 15);
      const it = D.iterations.filter(i => lc(JSON.stringify(i)).includes(k)).slice(0, 8);
      if (pg.length) out.push('## Pages\n' + pg.map(p => `- \`${p.id}\` ${p.en} (${p.name})`).join('\n'));
      if (cs.length) out.push('## Components\n' + cs.map(c => `- PS.${c.name} (${c.file.split('/').pop()}) — ${firstLine(c.doc)}`).join('\n'));
      if (tk.length) out.push('## Tokens\n' + tk.map(([n, v]) => `- \`${n}\`: ${v}`).join('\n'));
      if (it.length) out.push('## Iterations\n' + it.map(i => `- \`${i.id}\` ${i.label} — ${tx(i.title)}`).join('\n'));
      return out.join('\n\n') || 'Nothing found.';
    } },
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

async function iterationText(id) {
  const D = await data(), it = id ? D.iterations.find(i => i.id === id || i.label === id) : D.latest;
  if (!it) throw new Error(`no iteration "${id}". Ids: ${D.iterations.map(i => i.id).join(', ')}`);
  const out = [`# ${it.label} — ${tx(it.title)}`, `Id \`${it.id}\` · ${it.date} · major v${it.major}${it.jira ? ` · Jira ${it.jira.key}${it.jira.title ? ' ' + it.jira.title : ''} ${it.jira.url || 'https://kylith.atlassian.net/browse/' + it.jira.key}` : it.baseline ? ' · baseline' : ' · 无 Jira 单号'}`,
    `Dev Mode: ${dm('v=iterations&it=' + it.id)}`, '', '## Summary', tx(it.summary)];
  if (!(it.changes || []).length) out.push('', it.baseline ? 'Baseline: every later change is recorded from here.' : 'No changes recorded.');
  else out.push('', '## Changes', ...it.changes.map(c => `- **${c.type.toUpperCase()} · ${c.action}** ${tx(c.title)}${c.detail ? '\n  ' + tx(c.detail) : ''}${(c.components || []).length ? '\n  Components: ' + c.components.map(n => 'PS.' + n).join(', ') : ''}${(c.pages || []).length ? '\n  Pages: ' + c.pages.join(', ') : ''}${(c.figma || []).length ? '\n  Figma: ' + c.figma.join(', ') : ''}`));
  return out.join('\n');
}
async function changesText(since, until) {
  const D = await data(), ids = D.iterations.map(i => i.id);
  const hi = until ? ids.indexOf(until) : 0, lo = since ? ids.indexOf(since) : Math.min(hi + 1, ids.length - 1);
  if (hi < 0 || lo < 0) throw new Error(`unknown version. Ids: ${ids.join(', ')}`);
  const list = D.iterations.slice(Math.min(hi, lo), Math.max(hi, lo)).filter(i => !i.baseline);
  const a = D.iterations[Math.max(hi, lo)], b = D.iterations[Math.min(hi, lo)];
  if (!list.length) return `No recorded changes from ${a.id} to ${b.id}.`;
  const comps = {}, pages = {};
  list.forEach(it => (it.changes || []).forEach(c => { (c.components || []).forEach(n => (comps[n] = comps[n] || []).push([it, c])); (c.pages || []).forEach(n => (pages[n] = pages[n] || []).push([it, c])); }));
  const fmt = arr => arr.map(([it, c]) => `  - ${it.label}: ${c.type} · ${c.action} — ${tx(c.title)}${c.detail ? ' (' + tx(c.detail) + ')' : ''}`).join('\n');
  return [`# Changes ${a.id} → ${b.id} (${list.length} iteration${list.length > 1 ? 's' : ''})`, `Compare in Dev Mode: ${dm('cmp=' + a.id + '..' + b.id)}`,
    '', '## By component', ...Object.entries(comps).map(([n, arr]) => `- PS.${n} (get_component "${n}")\n${fmt(arr)}`),
    '', '## By page', ...Object.entries(pages).map(([n, arr]) => `- ${n}\n${fmt(arr)}`),
    '', '## Iterations', ...list.map(it => `- ${it.label} — ${tx(it.title)}`)].join('\n');
}

/* a newer server published on the site? (shown in get_overview and --check) */
async function updateNote() {
  try {
    const r = await fetch(SITE + 'devmode/mcp/server.mjs?t=' + Math.floor(Date.now() / 3600000)); if (!r.ok) return '';
    const m = /const VERSION = '([^']+)'/.exec(await r.text());
    const newer = (x, y) => { const p = x.split('.').map(Number), q = y.split('.').map(Number); for (let i = 0; i < 3; i++) if ((p[i] || 0) !== (q[i] || 0)) return (p[i] || 0) > (q[i] || 0); return false; };
    return m && newer(m[1], VERSION) ? ` · a newer server (${m[1]}) is published: download it again (devmode/mcp/README.md)` : '';
  } catch { return ''; }
}

/* ---------------------------------------------------------------- MCP over stdio */
const INSTRUCTIONS = 'PeraSure Dev Mode: the PeraSure app\'s pages and shared React components (PS.*) with code, CSS as written, design tokens, motion values, Figma nodes, statuses and iteration history. '
  + 'When the user pastes a Dev Mode link (…/devmode/index.html#…), call resolve_devmode_link; for a Figma link, find_by_figma. For a component call get_component; for a screen get_page; for what changed get_changes. '
  + 'Values come from design tokens (CSS custom properties); keep the token names when implementing. get_screenshot and get_live_specs need Playwright on the computer.';
const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];
function send(o) { process.stdout.write(JSON.stringify(o) + '\n'); }
async function handle(m) {
  if (!m || typeof m !== 'object') return;
  const isReq = m.id !== undefined && m.id !== null && typeof m.method === 'string';
  if (!m.method) return;   /* a response to something we never send */
  try {
    let result;
    switch (m.method) {
      case 'initialize':
        result = { protocolVersion: PROTOCOLS.includes(m.params?.protocolVersion) ? m.params.protocolVersion : PROTOCOLS[0], capabilities: { tools: { listChanged: false } },
          serverInfo: { name: NAME, title: 'PeraSure Dev Mode', version: VERSION }, instructions: INSTRUCTIONS };
        break;
      case 'ping': result = {}; break;
      case 'tools/list': result = { tools: TOOLS.map(t => ({ name: t.name, title: t.title, description: t.description, inputSchema: t.inputSchema, annotations: { title: t.title, readOnlyHint: true, destructiveHint: false, openWorldHint: true } })) }; break;
      case 'tools/call': {
        const t = TOOLS.find(x => x.name === m.params?.name);
        if (!t) throw Object.assign(new Error('Unknown tool: ' + m.params?.name), { code: -32602 });
        try {
          const c = await t.run(m.params.arguments || {});
          result = { content: Array.isArray(c) ? c : [{ type: 'text', text: String(c) }] };
        } catch (e) { result = { content: [{ type: 'text', text: 'Error: ' + e.message }], isError: true }; }
        break;
      }
      case 'resources/list': result = { resources: [] }; break;
      case 'resources/templates/list': result = { resourceTemplates: [] }; break;
      case 'prompts/list': result = { prompts: [] }; break;
      default:
        if (!isReq) return;   /* notifications (initialized, cancelled …) need no answer */
        throw Object.assign(new Error('Method not found: ' + m.method), { code: -32601 });
    }
    if (isReq) send({ jsonrpc: '2.0', id: m.id, result });
  } catch (e) { if (isReq) send({ jsonrpc: '2.0', id: m.id, error: { code: e.code || -32603, message: e.message } }); }
}
function serve() {
  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', d => {
    buf += d; let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
      if (!line) continue;
      let msg; try { msg = JSON.parse(line); } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }); continue; }
      (Array.isArray(msg) ? msg : [msg]).forEach(x => handle(x));
    }
  });
  const quit = async () => { try { if (browserP) (await browserP).close(); } catch {} process.exit(0); };
  process.stdin.on('end', quit); process.on('SIGINT', quit); process.on('SIGTERM', quit);
  log(`ready · ${LOCAL ? 'local clone ' + LOCAL : SITE}`);
}

const HELP = `PeraSure Dev Mode MCP server ${VERSION}

Add it to your AI tool (the path is where you saved this file):
  Claude Code   claude mcp add ${NAME} -s user -- node ${path.join(HERE, path.basename(fileURLToPath(import.meta.url)))}
  Codex         codex mcp add ${NAME} -- node <path>      (or ~/.codex/config.toml: [mcp_servers.${NAME}] command = "node", args = ["<path>"])
  Cursor        ~/.cursor/mcp.json: { "mcpServers": { "${NAME}": { "command": "node", "args": ["<path>"] } } }
Optional, for screenshots and live measurements:
  npm install -g playwright && npx playwright install chromium
Check it:  node <path> --check
Guide: ${SITE}devmode/mcp/README.md`;

if (process.argv.includes('--help') || process.argv.includes('-h')) { console.log(HELP); process.exit(0); }
if (process.argv.includes('--check')) {
  (async () => {
    try {
      const D = await data();
      console.log(`PeraSure Dev Mode MCP ${VERSION} · data from ${LOCAL ? 'local clone ' + LOCAL : SITE}`);
      console.log(`latest version ${D.latest.id} · ${Object.keys(D.pages.byId).length} pages · ${Object.keys(D.index.components).length} components · ${D.iterations.length} iteration(s)`);
      const T = await tokens(); console.log(`${T.map.size} tokens`);
      const pw = await playwright(); console.log(pw ? 'Playwright found: screenshots and live measurements are on' : 'Playwright not found: screenshots and live measurements are off (optional)');
      const u = await updateNote(); if (u) console.log(u.replace(/^ · /, ''));
      console.log(`${TOOLS.length} tools: ${TOOLS.map(t => t.name).join(', ')}`);
      process.exit(0);
    } catch (e) { console.error('Failed: ' + e.message); process.exit(1); }
  })();
} else serve();
