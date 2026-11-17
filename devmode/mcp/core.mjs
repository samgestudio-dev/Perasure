/* PeraSure Dev Mode — MCP core: every tool that only reads files (pages, components, code, CSS, tokens, motion, iterations, statuses,
   Figma, visual check) and the JSON-RPC handling, with no Node or Cloudflare APIs, so the same code runs in two places:
     worker/index.js        the hosted MCP server (https://samge.studio/perasure/devmode/mcp) — what developers connect to
     devmode/mcp/server.mjs the local one (stdio, inside a clone of the repo), which adds screenshots and live measurements (Playwright)
   Each of them passes a source: how to read a file now and at an older version, the data of devmode/data/*.js as JSON, the visual check.
   Keep in step with devmode/data/*.js and devmode/js/inspector.js when their formats change, and raise VERSION. */

export const VERSION = '2.3.0';
export const NAME = 'perasure-devmode';
export const REPO = 'samgestudio-dev/Perasure';
export const HOSTED = 'https://samge.studio/perasure/';
export const DEVICES = { 360: [360, 780], 390: [390, 844], 430: [430, 932] };
export const FITS = ['cap', 'rem', 'fit', 'scale'], TEXTS = [85, 100, 115, 130, 150, 200];
const ZMAX = 1.15;
const FIT_NAMES = { cap: 'capped zoom (up to 1.15×)', rem: 'capped zoom · rem', fit: '1:1', scale: 'full zoom' };
/* Screen fit and Text size, as on the phone and in Dev Mode (devmode/js/canvas.js DM.screenOf; shared/ps-ui/phone-fit.js): the browser
   lays the page out W CSS px wide and enlarges it k times to the screen. Default: capped zoom (at most 1.15×), text 100 %. */
export function screenOf(device, fit, text) {
  const [w, h] = DEVICES[device] || DEVICES[360], f = FITS.includes(fit) ? fit : 'cap', tx = TEXTS.includes(+text) ? +text : 100;
  const W = f === 'fit' || f === 'rem' ? w : f === 'scale' ? Math.max(360, Math.ceil(600 * w / h)) : Math.round(w / Math.max(1, Math.min(ZMAX, w / 360)));
  const k = w / W, fz = f === 'rem' ? Math.max(1, Math.min(ZMAX, w / 360)) : 1, r2 = v => Math.round(v * 1000) / 1000;
  const desc = `${w} px phone · ${FIT_NAMES[f]}: laid out ${W} CSS px wide${k > 1.001 ? `, drawn ×${r2(k)}` : ''}${fz > 1.001 ? `, rem ×${r2(fz)}` : ''} · text ${tx}%`;
  return { device: String(w), w, h, fit: f, text: tx, W, H: h / k, k, fz, desc };
}
/* the app always gets fit and text (a value saved in its Tune must not leak in); a component stage only when they change what it draws */
export function screenUrl(url, app, s) {
  const q = app ? [`fit=${s.fit}`, `text=${s.text}`] : [s.fit === 'rem' ? 'fit=rem' : '', s.text !== 100 ? `text=${s.text}` : ''].filter(Boolean);
  return q.length ? url + (url.includes('?') ? '&' : '?') + q.join('&') : url;
}

/* devmode/data/pages.js as data ({ BASE, sections }) → the same helpers the page list gives Dev Mode (byId, url, js).
   url() mirrors url() in devmode/data/pages.js: change them together. */
export function pagesFrom(raw) {
  const BY = {};
  raw.sections.forEach(s => s.pages.forEach(p => { p.section = s.id; p.kind = p.kind || (p.tab && !p.js ? 'tab' : 'screen'); p.code = p.code || (p.tab && !p.js ? p.tab : p.id); BY[p.id] = p; }));
  const url = (p, st, root) => {
    const q = new URLSearchParams(raw.BASE);
    new URLSearchParams((st && st.q) || p.q || '').forEach((v, k) => q.set(k, v));
    if (p.page) q.set('page', p.page); else if (p.tab && p.tab !== 'home') q.set('page', p.tab);
    return (root || '../') + 'prototypes/app/index.html?' + q.toString();
  };
  return { BASE: raw.BASE, sections: raw.sections, byId: BY, url, js: (p, st) => (st && st.js) || p.js || '' };
}
export function parseIndex(text) { return JSON.parse(text.slice(text.indexOf('=') + 1).trim().replace(/;\s*$/, '')); }
const b64json = s => { const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/')); return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)))); };

/* src: {
     site      where Dev Mode is opened, ending in / (links in the answers)
     label     where the data comes from, for get_overview
     read(rel)            a file of the repo as it is now (text)
     readTag(ver, rel)    the file at the git tag devmode-<ver>, or null (then the version's snapshot copy is read)
     loadData()           { BASE, sections, iterations, status } — devmode/data/pages.js, iterations.js, status.js as data
     readBytes(rel, ver)  a file as bytes (Uint8Array), now (ver null) or at the version — images and other binary files for read_file
     tree(ver)            every file of the repo, [{ path, size }], now (ver null) or at the git tag devmode-<ver> (read_file,
                          list_files, search_code)
     visual()             { report, base, source } of the latest visual check, or null
     extraNote            optional text added to resolve_devmode_link answers that select a layer
   } */
export function createDevmode(src) {
  const SITE = src.site;
  const read = rel => src.read(rel);
  async function readAt(rel, ver) {
    const D = await data();
    if (!ver || ver === D.latest.id) return read(rel);
    const t = await src.readTag(ver, rel).catch(() => null);
    return t != null ? t : read(`devmode/snapshots/${ver}/${rel}`);
  }
  let dataP = null, dataT = 0;
  async function data() {
    if (dataP && Date.now() - dataT < 30000) return dataP;
    dataT = Date.now();
    dataP = (async () => {
      const [ix, raw] = await Promise.all([read('devmode/data/index.js'), src.loadData()]);
      return { index: parseIndex(ix), pages: pagesFrom(raw), iterations: raw.iterations, status: raw.status, latest: raw.iterations[0] };
    })().catch(e => { dataP = null; throw e; });
    return dataP;
  }
  async function indexAt(ver) {
    const D = await data();
    if (!ver || ver === D.latest.id) return D.index;
    if (!D.iterations.some(i => i.id === ver)) throw new Error(`no version "${ver}". Versions: ${D.iterations.map(i => i.id).join(', ')}`);
    return parseIndex(await read(`devmode/snapshots/${ver}/devmode-index.js`));
  }


  const BROWSER = src.browser ? '(needs Playwright)' : '(local server only: devmode/mcp/README.md)';

  /* ---------------------------------------------------------------- lookups and links */
  const lc = s => String(s || '').toLowerCase();
  const ref = (D, ver) => (!ver || ver === D.latest.id ? 'main' : 'devmode-' + ver);
  /* a file's source on samge.studio (worker/index.js /_source/, signed in): no GitHub needed. The name is from when it linked to GitHub. */
  const gh = (D, file, a, b, ver) => `${SITE}_source/${file}${ver && ver !== D.latest.id ? '?v=' + ver : ''}${a ? '#L' + a + (b && b !== a ? '-L' + b : '') : ''}`;
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
      /* pages that render it, and pages that render a component using it (index: via) */
      const via = c.via || {}, line = code => { const p = findPage(D, code), v = via[code] ? ` · inside ${via[code].map(x => 'PS.' + x).join(', ')}` : ''; return (p ? `- ${p.en} (${p.name}) — \`${p.id}\`` : `- \`${code}\``) + v; };
      const direct = (c.pages || []).filter(x => !via[x]), inner = (c.pages || []).filter(x => via[x]);
      out.push('\n## Used on pages\n' + (direct.length || inner.length ? [...direct.map(line), ...inner.map(line)].join('\n') : '- Not on an app page yet'));
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

  /* ---------------------------------------------------------------- tools */
  const S = (props, req = []) => ({ type: 'object', properties: props, required: req, additionalProperties: false });
  const verP = { type: 'string', description: 'An iteration id (see list_iterations). Default: the latest version.' };
  const devP = { type: 'string', enum: ['360', '390', '430'], description: 'Phone width in points (default 360)' };
  const fitP = { type: 'string', enum: FITS, description: 'Screen fit, as the app\'s Tune: cap = capped zoom, the default (a 390 phone lays out 360 CSS px and draws them ×1.083; 430 → 374 ×1.15); rem = the same factor through the root font size; fit = 1:1; scale = full zoom' };
  const textP = { type: 'integer', enum: TEXTS, description: 'Text size in % (default 100). Up to 130 the whole layout grows; above it only text' };
  /* ---------------------------------------------------------------- any file of the repo (read_file, list_files, search_code) */
  const TEXT = /\.(js|mjs|cjs|css|html?|json|md|txt|svg|py|toml|ya?ml|csv)$/i;
  const MAX_LINES = 1500;
  /* not readable: dot folders and files (.git, .github, .claude …) and the Worker's own code — the same rule as the site */
  const denied = p => { const s = p.split('/'); return s.some(x => x === '' || x === '..' || x.startsWith('.')) || s[0] === 'worker'; };
  /* a repo path from a path, a samge.studio link or a GitHub link */
  function repoPath(input) {
    let p = String(input || '').trim();
    p = p.replace(/^https?:\/\/[^/]+\/perasure\/(playground\/)?/i, '')
      .replace(/^https?:\/\/github\.com\/[^/]+\/[^/]+\/(blob|tree)\/[^/]+\//i, '')
      .replace(/[?#].*$/, '').replace(/^\.?\/+/, '').replace(/\/+$/, '');
    try { p = decodeURIComponent(p); } catch {}
    if (p && denied(p)) throw new Error(`"${p}" can't be read here (dot folders and worker/ are left out).`);
    return p;
  }
  let treeC = {};
  async function treeAt(ver) {
    if (!src.tree) throw new Error('this server cannot list the repo\'s files');
    const D = await data(), v = ver && ver !== D.latest.id ? ver : '';
    if (v && !D.iterations.some(i => i.id === v)) throw new Error(`no version "${v}". Versions: ${D.iterations.map(i => i.id).join(', ')}`);
    if (!treeC[v] || Date.now() - treeC[v].t > 30000) treeC[v] = { t: Date.now(), p: Promise.resolve(src.tree(v || null)).then(l => l.filter(f => !denied(f.path))) };
    return treeC[v].p.catch(e => { delete treeC[v]; throw e; });
  }
  const SKIP = /^(vendor\/|devmode\/snapshots\/|tokens\/|tokens-rem\/|animations\/.*\.(json|lottie)$)|\.min\.(js|css)$|\.svg$/;
  async function searchCode({ query, path, regex, caseSensitive, version, limit }) {
    if (!query) throw new Error('query is required');
    const root = repoPath(path || ''), max = Math.min(Math.max(+limit || 80, 1), 300);
    let re; try { re = new RegExp(regex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? '' : 'i'); } catch (e) { throw new Error('bad regex: ' + e.message); }
    const all = (await treeAt(version)).filter(f => (!root || f.path === root || f.path.startsWith(root + '/')) && TEXT.test(f.path) && f.size < 400000 && (root ? true : !SKIP.test(f.path)));
    const files = all.slice(0, 320), hits = [];
    for (let i = 0; i < files.length && hits.length < max; i += 12) {
      const texts = await Promise.all(files.slice(i, i + 12).map(f => readAt(f.path, version).then(t => [f.path, t]).catch(() => [f.path, ''])));
      for (const [f, t] of texts) { const ls = t.split('\n'); for (let n = 0; n < ls.length && hits.length < max; n++) if (re.test(ls[n])) hits.push([f, n + 1, ls[n]]); }
    }
    return { hits, scanned: files.length, total: all.length, root, max };
  }
  /* an app piece (APP.WdHero) or another named function that isn't a shared PS component: where it is defined */
  async function findDefinition(name, version) {
    const n = String(name).replace(/^(PS|APP)\./, '').replace(/[^\w$]/g, '');
    if (!n) return null;
    for (const root of ['prototypes/app', 'shared', 'prototypes']) {
      const r = await searchCode({ query: `(APP|PS|window)\\.${n}\\s*=|function\\s+${n}\\s*\\(|(var|let|const)\\s+${n}\\s*=`, regex: true, caseSensitive: true, path: root, version, limit: 5 });
      if (r.hits.length) return r.hits;
    }
    return null;
  }
  async function definitionText(name, version) {
    const hits = await findDefinition(name, version).catch(() => null);
    if (!hits) return null;
    const [f, line] = hits[0], text = await readAt(f, version), total = text.split('\n').length, end = Math.min(total, line + 159);
    return [`# ${String(name).replace(/^(PS|APP)\./, '')} — not a shared component (PS.*), defined in the code below`,
      `Defined at \`${f}\` line ${line}${hits.length > 1 ? ' (also: ' + hits.slice(1).map(h => `${h[0]}:${h[1]}`).join(', ') + ')' : ''}. Lines ${line}–${end} of ${total}; read more with read_file (path "${f}", start ${end + 1}).`,
      'It may draw a demo\'s own code: follow the files it loads (search_code, read_file) rather than rebuilding it from a similar shared component.',
      fence(numbered(text.split('\n'), line, end), 'js')].join('\n');
  }
  /* images come back as images, other binary files (fonts, .lottie, zip …) as an embedded file — all through the MCP, no web sign-in */
  const BIN = /\.(png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|lottie|zip|mp4|webm|mp3|wasm|pdf)$/i;
  const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', ico: 'image/x-icon', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf', lottie: 'application/zip', zip: 'application/zip', mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wasm: 'application/wasm', pdf: 'application/pdf' };
  function b64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
  async function binaryFile(p, ver) {
    if (!src.readBytes) throw new Error(`"${p}" is a binary file and this server can only read text`);
    let bytes; try { bytes = await src.readBytes(p, ver || null); } catch { throw new Error(`no file "${p}"${ver ? ' at ' + ver : ''}. Use list_files or search_code to find it.`); }
    const ext = p.split('.').pop().toLowerCase(), mime = MIME[ext] || 'application/octet-stream', kb = (bytes.length / 1024).toFixed(1);
    if (bytes.length > 5 * 1024 * 1024) return `\`${p}\` is ${kb} KB, too big to send through the MCP (5 MB at most).`;
    const note = { type: 'text', text: `# ${p}\n${ver ? 'Version ' + ver : 'Latest (main)'} · ${mime} · ${kb} KB — the file itself, below.` };
    if (mime.startsWith('image/') && mime !== 'image/x-icon') return [note, { type: 'image', data: b64(bytes), mimeType: mime }];
    return [note, { type: 'resource', resource: { uri: `${SITE}${p}`, mimeType: mime, blob: b64(bytes) } }];
  }
  function numbered(ls, a, b) { const w = String(b).length; return ls.slice(a - 1, b).map((l, i) => String(a + i).padStart(w) + '  ' + l).join('\n'); }

  const TOOLS = [
    { name: 'get_overview', title: 'Overview',
      description: 'What PeraSure Dev Mode holds and how to use these tools: versions, page sections, component files, statuses. Call this first if unsure.',
      inputSchema: S({}),
      run: async () => {
        const D = await data(), comps = Object.values(D.index.components), files = {};
        comps.forEach(c => { const f = c.file.split('/').pop(); files[f] = (files[f] || 0) + 1; });
        const changed = Object.entries({ ...(D.status.pages || {}), ...(D.status.components || {}) }).filter(([, v]) => v.status === 'changed').length;
        return [
          '# PeraSure Dev Mode', `${SITE}devmode/index.html · data: ${src.label} · server ${VERSION}`,
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
          '- Any source file itself → read_file (find it with search_code or list_files); every file of the repo can be read, so nothing needs GitHub.',
          '- Seeing it → get_screenshot; exact measured sizes and spacing → get_live_specs; checking an implementation against the demo → qa_compare' + (src.browser ? ' (these need Playwright).' : ': these three run only in the local server, inside a clone of the repo (devmode/mcp/README.md).'),
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
          let o = null; try { o = b64json(H.notes); } catch {}
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
            out.push('', m && m[1] === 'p' ? `Page details: get_page("${m[2]}"${+m[3] ? ', state ' + m[3] : ''}). Measured specs of a noted layer: get_live_specs with page and the layer path ${BROWSER}.` : '', scrLine);
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
        if (H.sel && src.extraNote) { const note = typeof src.extraNote === 'function' ? await src.extraNote() : src.extraNote; if (note) out.push('\n' + note); }
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
      description: 'Everything about one shared component (PS.<Name>); for an app piece that is not shared (APP.WdHero …) it returns where it is defined and its code: description, props, states, usage examples, source code, CSS exactly as written, tokens with their values, motion values, icons and pictures, Figma nodes, pages that use it, status and history. Use sections to ask for less.',
      inputSchema: S({ name: { type: 'string', description: 'Component name, e.g. CouponOption or PS.CouponOption' }, version: verP,
        sections: { type: 'array', items: { type: 'string', enum: ['doc', 'props', 'states', 'usage', 'code', 'css', 'tokens', 'motion', 'assets', 'classes', 'uses', 'pages', 'history'] }, description: 'Only these parts (default: all)' } }, ['name']),
      run: a => componentText(a.name, a).catch(async e => (await definitionText(a.name, a.version)) || Promise.reject(e)) },
    { name: 'get_component_code', title: 'Get component code',
      description: 'Just the code of a shared component: its JS source and its CSS rules as written, at a version.',
      inputSchema: S({ name: { type: 'string' }, version: verP }, ['name']),
      run: a => componentText(a.name, { version: a.version, sections: ['code', 'css'] }).catch(async e => (await definitionText(a.name, a.version)) || Promise.reject(e)) },
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
        const v = await src.visual().catch(() => null);
        if (!v) return 'No visual check report yet: the "Dev Mode visual check" workflow makes one after a push (tools/devmode-visual.mjs).';
        const r = v.report, pic = f => (/^https?:/.test(f) ? f : v.base + f);
        const n = r.changed.length + r.added.length;
        return [`# Unrecorded changes — against ${r.against}`, `Checked ${r.at}${r.commit ? ' at commit ' + r.commit.slice(0, 7) : ''} · ${r.items} renders · source: ${v.source}`, `Dev Mode: ${dm('v=iterations&it=pending')}`,
          n ? `${r.changed.length} changed, ${r.added.length} new, ${r.failed.length} could not render.` : 'Nothing changed since the latest iteration.',
          r.summary && r.summary.components.length ? `Components involved: ${r.summary.components.map(c => (/^APP\./.test(c) ? c : 'PS.' + c)).join(', ')}` : '',
          ...r.changed.map(c => `- ${c.kind} **${c.label}** — ${(c.ratio * 100).toFixed(2)}% of pixels; starts at: ${(c.components || []).join(', ') || '—'}; box ${c.box.join('×')}${c.unsteady ? ' (moving parts left out)' : ''}\n  picture (before | after | difference): ${pic(c.image)}`),
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
    { name: 'read_file', title: 'Read a file',
      description: 'Any file of the PeraSure repo — text with line numbers; images (png, jpg, webp …) as the image; fonts, .lottie and other binary files as an embedded file. Text files — the source itself, e.g. the file Dev Mode or another tool points to (prototypes/withdraw-fund-flow/withdraw.js, prototypes/app/screens-home.js, shared/ps-ui/home.js …). Takes a repo path, a samge.studio link or a GitHub link. Up to 1500 lines per call: give start / end for a range, and call again for the rest. version = an iteration id for the file as it was then.',
      inputSchema: S({ path: { type: 'string', description: 'Repo path or link, e.g. prototypes/withdraw-fund-flow/withdraw.js' }, start: { type: 'integer', minimum: 1, description: 'First line (default 1)' }, end: { type: 'integer', minimum: 1, description: 'Last line (default start + 1499)' }, version: verP }, ['path']),
      run: async a => {
        const p = repoPath(a.path);
        if (!p) throw new Error('give a file path (list_files shows the folders)');
        const D = await data();
        if (BIN.test(p)) return binaryFile(p, a.version);
        let text;
        try { text = await readAt(p, a.version); } catch {
          const t = await treeAt(a.version).catch(() => []), near = t.filter(f => f.path.startsWith(p + '/')).length;
          const paths = t.map(f => f.path).filter(x => !/^devmode\/snapshots\//.test(x));
          throw new Error(near ? `"${p}" is a folder: use list_files` : `no file "${p}"${a.version ? ' at ' + a.version : ''}. ${suggest(paths, p.split('/').pop()).slice(0, 5).map(x => 'did you mean ' + x).join(' · ') || 'Use list_files or search_code to find it.'}`);
        }
        if (!TEXT.test(p) && /[\x00-\x08\x0e-\x1f]/.test(text.slice(0, 4000))) return binaryFile(p, a.version);
        const ls = text.split('\n'), total = ls.length, s = Math.min(Math.max(1, a.start || 1), total), e = Math.min(total, a.end || s + MAX_LINES - 1, s + MAX_LINES - 1);
        const ext = (p.split('.').pop() || '').toLowerCase(), lang = { mjs: 'js', cjs: 'js', htm: 'html', yml: 'yaml' }[ext] || ext;
        return [`# ${p}`, `${a.version ? 'Version ' + a.version : 'Latest (main)'} · lines ${s}–${e} of ${total} · ${gh(D, p, s, e, a.version)}`,
          fence(numbered(ls, s, e), lang), e < total ? `More: read_file with path "${p}", start ${e + 1}.` : ''].filter(Boolean).join('\n');
      } },
    { name: 'list_files', title: 'List files',
      description: 'What is in a folder of the PeraSure repo: sub-folders (with how many files) and files (with sizes). Start with no path for the top level; then read_file.',
      inputSchema: S({ path: { type: 'string', description: 'Folder, e.g. prototypes/withdraw-fund-flow (default: the top level)' }, version: verP }),
      run: async a => {
        const root = repoPath(a.path || ''), pre = root ? root + '/' : '', dirs = {}, files = [];
        for (const f of await treeAt(a.version)) {
          if (pre && !f.path.startsWith(pre)) continue;
          const rest = f.path.slice(pre.length), i = rest.indexOf('/');
          if (i < 0) files.push(f); else { const d = rest.slice(0, i); dirs[d] = (dirs[d] || 0) + 1; }
        }
        if (!files.length && !Object.keys(dirs).length) throw new Error(`no folder "${root}"`);
        const kb = n => n < 1024 ? n + ' B' : (n / 1024).toFixed(n < 10240 ? 1 : 0) + ' KB';
        return [`# ${root || '(top level)'}${a.version ? ' · ' + a.version : ''}`,
          ...Object.entries(dirs).sort().map(([d, n]) => `- ${pre}${d}/ (${n} file${n > 1 ? 's' : ''})`),
          ...files.sort((x, y) => x.path.localeCompare(y.path)).map(f => `- ${f.path} · ${kb(f.size || 0)}`)].join('\n');
      } },
    { name: 'search_code', title: 'Search the code',
      description: 'Find text in the repo\'s files (like grep): every matching line with its file and line number, e.g. where APP.WdHero is defined or which files use a class, token or picture. Narrow with path (a folder or file). Without path, vendor/, snapshots, tokens, SVGs and animation data are skipped. Then read_file around a hit.',
      inputSchema: S({ query: { type: 'string', description: 'Text to find (or a regular expression with regex: true)' }, path: { type: 'string', description: 'Folder or file to search in, e.g. prototypes/app' }, regex: { type: 'boolean' }, caseSensitive: { type: 'boolean' }, limit: { type: 'integer', minimum: 1, maximum: 300, description: 'Most matching lines (default 80)' }, version: verP }, ['query']),
      run: async a => {
        const r = await searchCode(a), by = {};
        r.hits.forEach(([f, n, l]) => { (by[f] = by[f] || []).push(`  ${n}: ${l.trim().slice(0, 220)}`); });
        const head = `${r.hits.length}${r.hits.length >= r.max ? '+' : ''} matching line(s) in ${Object.keys(by).length} file(s) · searched ${r.scanned}${r.total > r.scanned ? ' of ' + r.total + ' (narrow with path for the rest)' : ''} file(s)${r.root ? ' under ' + r.root : ''}`;
        return [head, ...Object.entries(by).map(([f, ls]) => `${f}\n${ls.join('\n')}`)].join('\n\n');
      } },

  ];

  async function iterationText(id) {
    const D = await data(), it = id ? D.iterations.find(i => i.id === id || i.label === id) : D.latest;
    if (!it) throw new Error(`no iteration "${id}". Ids: ${D.iterations.map(i => i.id).join(', ')}`);
    const out = [`# ${it.label} — ${tx(it.title)}`, `Id \`${it.id}\` · ${it.date} · major v${it.major}${it.jira ? ` · Jira ${it.jira.key}${it.jira.title ? ' ' + it.jira.title : ''} ${it.jira.url || 'https://kylith.atlassian.net/browse/' + it.jira.key}` : it.baseline ? ' · baseline' : ' · 无 Jira 单号'}`,
      `Dev Mode: ${dm('v=iterations&it=' + it.id)}`, '', '## Summary', tx(it.summary)];
    if (!(it.changes || []).length) out.push('', it.baseline ? 'Baseline: every later change is recorded from here.' : 'No changes recorded.');
    else out.push('', '## Changes', ...it.changes.map(c => `- **${c.type.toUpperCase()} · ${c.action}** ${tx(c.title)}${c.detail ? '\n  ' + tx(c.detail) : ''}${(c.components || []).length ? '\n  Components: ' + c.components.map(n => 'PS.' + n).join(', ') : ''}${(c.pages || []).length ? '\n  Pages: ' + c.pages.join(', ') : ''}${(c.figma || []).length ? '\n  Figma: ' + c.figma.join(', ') : ''}`));
    /* a global iteration's brief for developers' AI (owner, 2026-11-17): devmode/iterations/<id>/README.md */
    if (it.doc) { try { const md = await readAt(it.doc, it.id); out.push('', '---', '', typeof md === 'string' ? md : (md && md.text) || ''); } catch (e) { out.push('', `Developer brief: ${it.doc} (read_file)`); } }
    if (it.overview) out.push('', `Before | after | difference pictures of every changed page and component: Dev Mode ${dm('v=iterations&it=' + it.id)} (files in devmode/${it.overview}visual/).`);
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
  const INSTRUCTIONS = 'PeraSure Dev Mode: the PeraSure app\'s pages and shared React components (PS.*) with code, CSS as written, design tokens, motion values, Figma nodes, statuses and iteration history. '
    + 'When the user pastes a Dev Mode link (…/devmode/index.html#…), call resolve_devmode_link; for a Figma link, find_by_figma. For a component call get_component; for a screen get_page; for what changed get_changes. '
    + 'For any source file itself use read_file (and list_files, search_code): when a tool says code lives in a file, read that file rather than rebuilding it from something similar. '
    + 'Values come from design tokens (CSS custom properties); keep the token names when implementing.';
  const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];
  /* one JSON-RPC message → its answer (null for notifications and responses) */
  async function handle(m) {
    if (!m || typeof m !== 'object' || !m.method) return null;
    const isReq = m.id !== undefined && m.id !== null && typeof m.method === 'string';
    try {
      let result;
      switch (m.method) {
        case 'initialize':
          result = { protocolVersion: PROTOCOLS.includes(m.params?.protocolVersion) ? m.params.protocolVersion : PROTOCOLS[0], capabilities: { tools: { listChanged: false } },
            serverInfo: { name: NAME, title: 'PeraSure Dev Mode', version: VERSION }, instructions: INSTRUCTIONS + (src.instructions ? ' ' + src.instructions : '') };
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
          if (!isReq) return null;   /* notifications (initialized, cancelled …) need no answer */
          throw Object.assign(new Error('Method not found: ' + m.method), { code: -32601 });
      }
      return isReq ? { jsonrpc: '2.0', id: m.id, result } : null;
    } catch (e) { return isReq ? { jsonrpc: '2.0', id: m.id, error: { code: e.code || -32603, message: e.message } } : null; }
  }

  const api = { SITE, TOOLS, S, verP, devP, fitP, textP, handle, data, indexAt, read, readAt, tokens, findComp, findPage, componentText, pageText };
  /* screenshots, design QA and live measurements need a browser: the local server adds them (Playwright); without one they explain */
  if (src.extraTools) TOOLS.push(...src.extraTools(api));
  else for (const [name, title] of [['get_screenshot', 'Screenshot'], ['qa_compare', 'Design QA: implementation vs demo'], ['get_live_specs', 'Live measurements']])
    TOOLS.push({ name, title: title + ' (local server only)', inputSchema: S({}, []),
      description: `${title}: needs a browser, so it runs only in the local MCP server inside a clone of the repo (devmode/mcp/README.md). Here use get_component / get_page for the code, CSS and token values as written.`,
      run: async () => `${name} needs a browser, so it is not available on the hosted server. Use get_component (CSS as written, tokens with values) or get_page instead, or run the local server inside a clone of the repo with Playwright (devmode/mcp/README.md).` });
  return api;
}
