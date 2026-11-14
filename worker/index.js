/* PeraSure Playground on samge.studio — a Cloudflare Worker that serves this private repo at https://samge.studio/perasure/ behind a
   password, straight from GitHub (nothing is copied or built: a push to main is live within about 20 seconds), plus the hosted MCP
   server for developers' AI tools at /perasure/devmode/mcp.

     /perasure/playground/     the Playground picker (/perasure/ forwards here); /perasure/playground/<path> is the repo's file
     /perasure/<path>          the repo's file at the newest commit of main (Dev Mode: /perasure/devmode/)
     /perasure/_visual/<path>  the Dev Mode visual check (branch devmode-visual)
     /perasure/_source/<path>  a file's source with line numbers (?v=<iteration id> for an older version, #L10-L20 marks lines,
                               ?raw for plain text) — what Dev Mode and the MCP link to, so nobody needs GitHub
     /perasure/_login, _logout the password page (account and password are Cloudflare secrets, never in the page)
     /perasure/_mcp            for signed-in Dev Mode: the MCP address and access token (Connect AI shows them)
     /perasure/devmode/mcp     the MCP server (Streamable HTTP, JSON answers). Signs in with the same account and password as the site:
                               headers X-PeraSure-Account + X-PeraSure-Password (or Authorization: Basic …; Bearer <MCP_TOKEN> also works)
     anything else             a blank samge.studio page

   Secrets (Cloudflare → Workers & Pages → perasure-devmode → Settings → Variables and Secrets):
     GITHUB_TOKEN    fine-grained token, this repo only, Contents: read-only
     DEVMODE_USER    the account (compared without case)       DEVMODE_PASS   the password (case matters)
     SESSION_SECRET  signs the sign-in cookie (changing it signs everyone out)
     MCP_TOKEN       developers' MCP access token (changing it disconnects their AI tools until they update it)
     TURNSTILE_SECRET  the secret of the Turnstile widget "perasure-devmode-login" (its public site key: TURNSTILE_SITEKEY in wrangler.toml)
   Switches (Cloudflare → … → Variables and Secrets, type Text; missing = on):
     SITE_LOGIN      on / off — whether the site (Playground, Dev Mode, source) asks for the account and password
     MCP_LOGIN       on / off — whether the MCP server asks for them
   Deployed by .github/workflows/devmode-live.yml (when CLOUDFLARE_API_TOKEN is set in the repo's Actions secrets). Guide: worker/README.md */
import { createDevmode } from '../devmode/mcp/core.mjs';

const REPO = 'samgestudio-dev/Perasure';
const BASE = '/perasure';
const PLAY = BASE + '/playground';   /* the Playground picker's address; the same repo files as BASE */
const COOKIE = 'ps_devmode';
const SESSION_DAYS = 30;
const HEAD_TTL = 20;            /* seconds a data centre keeps the newest commit id before asking GitHub again */
const CHECK_AFTER = 3;          /* after this many wrong passwords, the sign-in page asks for Cloudflare Turnstile (are you human?) */
const MAX_TRIES = 20;           /* wrong passwords per address in 15 minutes before it is locked */
const CACHE = 'https://samge.studio/__cache/';   /* Cache API keys (never served) */
const TYPES = {
  html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8', json: 'application/json; charset=utf-8', md: 'text/markdown; charset=utf-8', txt: 'text/plain; charset=utf-8',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', ico: 'image/x-icon',
  woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf', lottie: 'application/zip', zip: 'application/zip',
  mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wasm: 'application/wasm', map: 'application/json; charset=utf-8'
};
const isOn = v => !/^(off|false|0|no)$/i.test(String(v == null ? 'on' : v).trim());
const SAFE = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Robots-Tag': 'noindex, nofollow', 'X-Frame-Options': 'SAMEORIGIN' };

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname;
    try {
      if (p === '/robots.txt') return text('User-agent: *\nDisallow: /\n');
      if (p !== BASE && !p.startsWith(BASE + '/')) return blank(p === '/' ? 200 : 404);
      if (p === BASE || p === BASE + '/' || p === BASE + '/index.html') return redirect(PLAY + '/' + url.search, 302);
      if (p === PLAY) return redirect(PLAY + '/' + url.search);
      /* one Dev Mode: the picker's link to it goes to /perasure/devmode/ */
      if (p.startsWith(PLAY + '/devmode/')) return redirect(BASE + p.slice(PLAY.length) + url.search, 302);
      if (p === BASE + '/devmode/mcp') return await mcp(req, env, ctx);
      if (p === BASE + '/_login') return isOn(env.SITE_LOGIN) ? await login(req, env, url) : redirect(PLAY + '/', 302);
      if (p === BASE + '/_logout') return new Response(null, { status: 303, headers: { Location: BASE + '/', 'Set-Cookie': `${COOKIE}=; Path=${BASE}; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
      if ((p.startsWith(BASE + '/assets/fonts/') || p === BASE + LOGO) && req.method === 'GET') return await file(req, env, ctx, 'main', p.slice(BASE.length + 1));
      if (isOn(env.SITE_LOGIN) && !(await signedIn(req, env))) return loginPage(url.pathname + url.search, '', 200, await triesOf(req.headers.get('CF-Connecting-IP') || 'unknown'), env);
      if (p === BASE + '/_mcp') return json({ url: url.origin + BASE + '/devmode/mcp', login: isOn(env.MCP_LOGIN) }, 200, { 'Cache-Control': 'no-store' });
      if (req.method !== 'GET' && req.method !== 'HEAD') return text('Method not allowed', 405);
      if (p.startsWith(BASE + '/_visual/')) return await file(req, env, ctx, 'devmode-visual', p.slice((BASE + '/_visual/').length));
      if (p.startsWith(BASE + '/_source/')) return await source(req, env, ctx, url);
      if (p.startsWith(PLAY + '/')) return await file(req, env, ctx, 'main', p.slice(PLAY.length + 1));
      return await file(req, env, ctx, 'main', p.slice(BASE.length + 1));
    } catch (e) {
      return text('Something went wrong on our side: ' + (e && e.message || e), 502);
    }
  }
};

/* ---------------------------------------------------------------- files from GitHub */
async function file(req, env, ctx, branch, rel) {
  rel = decodeURIComponent(rel);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const segs = rel.split('/');
  /* no dot folders or files (.github, .claude, .env …), no way out of the repo, and not this Worker's own code */
  if (segs.some(s => s === '' || s === '..' || s.startsWith('.')) || segs[0] === 'worker') return notFound();
  const last = segs[segs.length - 1];
  /* a folder without its slash: relative links inside it need the slash */
  if (!last.includes('.')) return redirect(new URL(req.url).pathname + '/' + new URL(req.url).search, 302);
  const sha = await head(env, ctx, branch).catch(e => { if (branch === 'main') throw e; return null; });   /* devmode-visual may not exist yet */
  if (!sha) return notFound();
  const etag = `"${sha.slice(0, 16)}"`;
  if (req.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers: { ETag: etag, 'Cache-Control': 'private, no-cache' } });
  const res = await blob(env, ctx, sha, rel);
  if (!res) return notFound();
  const ext = last.split('.').pop().toLowerCase();
  return new Response(req.method === 'HEAD' ? null : res.body, { headers: { 'Content-Type': TYPES[ext] || 'application/octet-stream', ETag: etag, 'Cache-Control': 'private, no-cache', ...SAFE } });
}
function gh(env, path, accept) {
  return fetch('https://api.github.com/repos/' + REPO + path, { headers: {
    Authorization: 'Bearer ' + env.GITHUB_TOKEN, Accept: accept, 'User-Agent': 'perasure-devmode-worker', 'X-GitHub-Api-Version': '2022-11-28' } });
}
/* the newest commit id of a branch, kept a few seconds per data centre — so a push shows within HEAD_TTL seconds */
async function head(env, ctx, branch) {
  const key = new Request(CACHE + 'head/' + branch), hit = await caches.default.match(key);
  if (hit) return hit.text();
  const r = await gh(env, '/commits/' + encodeURIComponent(branch), 'application/vnd.github.sha');
  if (!r.ok) throw new Error(`GitHub said ${r.status} for the branch ${branch}` + (r.status === 401 || r.status === 404 ? ' (check GITHUB_TOKEN)' : ''));
  const sha = (await r.text()).trim();
  ctx.waitUntil(caches.default.put(key, new Response(sha, { headers: { 'Cache-Control': 'max-age=' + HEAD_TTL } })));
  return sha;
}
/* a file at a commit (or a tag): fetched once, then kept, since it never changes */
async function blob(env, ctx, ref, rel) {
  const key = new Request(CACHE + 'blob/' + encodeURIComponent(ref) + '/' + rel.split('/').map(encodeURIComponent).join('/'));
  const hit = await caches.default.match(key);
  if (hit) return hit;
  const r = await gh(env, '/contents/' + rel.split('/').map(encodeURIComponent).join('/') + '?ref=' + encodeURIComponent(ref), 'application/vnd.github.raw');
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub said ${r.status} for ${rel}`);
  const ct = r.headers.get('content-type') || '';
  if (ct.includes('application/json') && !rel.endsWith('.json')) return null;   /* a folder listing, not a file */
  const buf = await r.arrayBuffer();
  ctx.waitUntil(caches.default.put(key, new Response(buf, { headers: { 'Cache-Control': 'max-age=2592000' } })));
  return new Response(buf);
}
async function readText(env, ctx, ref, rel) {
  const r = await blob(env, ctx, ref, rel);
  if (!r) throw new Error(`could not read ${rel}${ref.length === 40 ? '' : ' at ' + ref}`);
  return r.text();
}

/* every file of the repo at a commit or tag: [{ path, size }] (GitHub's tree), kept like a file */
async function tree(env, ctx, ref) {
  const key = new Request(CACHE + 'tree/' + encodeURIComponent(ref)), hit = await caches.default.match(key);
  if (hit) return hit.json();
  const r = await gh(env, '/git/trees/' + encodeURIComponent(ref) + '?recursive=1', 'application/vnd.github+json');
  if (!r.ok) throw new Error(`GitHub said ${r.status} for the file list at ${ref}`);
  const list = (await r.json()).tree.filter(t => t.type === 'blob').map(t => ({ path: t.path, size: t.size || 0 }));
  ctx.waitUntil(caches.default.put(key, new Response(JSON.stringify(list), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=' + (ref.length === 40 ? 2592000 : 300) } })));
  return list;
}

/* ---------------------------------------------------------------- source viewer */
async function source(req, env, ctx, url) {
  let rel; try { rel = decodeURIComponent(url.pathname.slice((BASE + '/_source/').length)); } catch { return notFound(); }
  const segs = rel.split('/'), v = url.searchParams.get('v') || '';
  if (!rel || segs.some(x => x === '' || x === '..' || x.startsWith('.')) || segs[0] === 'worker' || (v && !/^[\w.-]{1,80}$/.test(v))) return notFound();
  const ref = v ? 'devmode-' + v : await head(env, ctx, 'main');
  let res = await blob(env, ctx, ref, rel);
  if (!res && v) res = await blob(env, ctx, await head(env, ctx, 'main'), `devmode/snapshots/${v}/${rel}`);   /* versions before their tag */
  if (!res) return notFound();
  const textBody = await res.text();
  if (url.searchParams.has('raw')) return new Response(textBody, { headers: { 'Content-Type': TYPES.txt, 'Cache-Control': 'private, no-cache', ...SAFE } });
  const esc = x => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = textBody.replace(/\n$/, '').split('\n'), w = String(lines.length).length;
  const rows = lines.map((l, i) => `<tr id="L${i + 1}"><td class="n" data-n="${i + 1}"></td><td class="c">${esc(l) || ' '}</td></tr>`).join('');
  const live = /\.(html?)$/i.test(rel) && !v ? ` · <a href="${BASE}/${rel.split('/').map(encodeURIComponent).join('/')}">Open the page</a>` : '';
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(rel.split('/').pop())} · PeraSure source</title><style>
:root{color-scheme:light dark;--bg:#fff;--fg:#1d2329;--mute:#77818a;--line:#eceff2;--hl:#fff6c8;--bar:#f7f8f9}
@media(prefers-color-scheme:dark){:root{--bg:#14171b;--fg:#dfe3e7;--mute:#7c8792;--line:#23282e;--hl:#3a3415;--bar:#1b1f24}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:1;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;padding:12px 20px;background:var(--bar);border-bottom:1px solid var(--line)}
header b{font:600 14px ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all}header span,header a{color:var(--mute);font-size:13px}header a{color:inherit}
table{border-collapse:collapse;width:100%;font:12.5px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;tab-size:2}
td.n{width:${w + 3}ch;padding:0 12px 0 16px;text-align:right;color:var(--mute);user-select:none;cursor:pointer;vertical-align:top}td.n::before{content:attr(data-n)}
td.c{padding:0 20px 0 8px;white-space:pre-wrap;word-break:break-word}tr.on td{background:var(--hl)}
</style></head><body><header><b>${esc(rel)}</b><span>${v ? 'Version ' + esc(v) : 'Latest'} · ${lines.length} lines · <a href="?${v ? 'v=' + encodeURIComponent(v) + '&' : ''}raw">Plain text</a>${live}</span></header>
<table>${rows}</table><script>
function mark(){document.querySelectorAll('tr.on').forEach(function(r){r.classList.remove('on')});var m=/^#L(\d+)(?:-L?(\d+))?$/.exec(location.hash);if(!m)return;var a=+m[1],b=+(m[2]||a);for(var i=Math.min(a,b);i<=Math.max(a,b);i++){var r=document.getElementById('L'+i);r&&r.classList.add('on')}var f=document.getElementById('L'+Math.min(a,b));f&&f.scrollIntoView({block:'center'})}
var last=0;document.addEventListener('click',function(e){var n=e.target.closest('td.n');if(!n)return;var k=+n.dataset.n;history.replaceState(null,'',e.shiftKey&&last?'#L'+Math.min(last,k)+'-L'+Math.max(last,k):'#L'+k);last=e.shiftKey?last:k;mark()});
window.addEventListener('hashchange',mark);mark();</script></body></html>`, { headers: { 'Content-Type': TYPES.html, 'Cache-Control': 'private, no-cache', ...SAFE } });
}

/* ---------------------------------------------------------------- the MCP server */
let dm = null, dmSha = '';
async function mcp(req, env, ctx) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  const auth = await mcpAuth(req, env);
  if (auth !== 'ok') return json({ jsonrpc: '2.0', id: null, error: { code: -32001, message:
    auth === 'locked' ? 'Too many wrong passwords from this address. Please wait 15 minutes, then try again.'
    : auth === 'wrong' ? 'That account or password doesn’t match. Check the X-PeraSure-Account and X-PeraSure-Password headers.'
    : 'Sign in first: add the headers X-PeraSure-Account and X-PeraSure-Password (the PeraSure account and password). Dev Mode → Connect AI shows the setup.' } }, auth === 'locked' ? 429 : 401, cors());
  if (req.method !== 'POST') return new Response('POST JSON-RPC messages here (MCP Streamable HTTP).', { status: 405, headers: { Allow: 'POST, OPTIONS', ...cors() } });
  let body;
  try { body = await req.json(); } catch { return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400, cors()); }
  const sha = await head(env, ctx, 'main');
  /* one Devmode per commit: a push gives a fresh one (its data is cached by core for 30 s) */
  if (!dm || dmSha !== sha) {
    dmSha = sha;
    const at = ref => rel => readText(env, ctx, ref, rel);
    dm = createDevmode({
      site: new URL(req.url).origin + BASE + '/',
      label: `samge.studio (main at ${sha.slice(0, 7)})`,
      read: at(sha),
      readTag: (ver, rel) => readText(env, ctx, 'devmode-' + ver, rel),
      tree: ver => tree(env, ctx, ver ? 'devmode-' + ver : sha),
      readBytes: async (rel, ver) => {
        let r = await blob(env, ctx, ver ? 'devmode-' + ver : sha, rel);
        if (!r && ver) r = await blob(env, ctx, sha, `devmode/snapshots/${ver}/${rel}`);
        if (!r) throw new Error('not found');
        return new Uint8Array(await r.arrayBuffer());
      },
      loadData: async () => {
        const at = await head(env, ctx, 'devmode-mcp').catch(() => null);
        if (!at) throw new Error('the Dev Mode data for the MCP server is not published yet: the "Dev Mode live" workflow makes it on the next push to main (branch devmode-mcp)');
        return JSON.parse(await readText(env, ctx, at, 'data.json'));
      },
      visual: async () => ({ report: JSON.parse(await readText(env, ctx, await head(env, ctx, 'devmode-visual'), 'report.json')), base: new URL(req.url).origin + BASE + '/_visual/', source: 'branch devmode-visual' }),
      instructions: 'Links to the site need the Dev Mode password in a browser; the code itself comes through these tools.'
    });
  }
  const list = Array.isArray(body) ? body : [body];
  const out = (await Promise.all(list.map(m => dm.handle(m)))).filter(Boolean);
  if (!out.length) return new Response(null, { status: 202, headers: cors() });
  return json(Array.isArray(body) ? out : out[0], 200, cors());
}
/* the MCP signs in with the site's account and password (headers, or HTTP Basic); the older MCP_TOKEN still works.
   Wrong passwords count per address like on the sign-in page: MAX_TRIES in 15 minutes locks it. */
async function mcpAuth(req, env) {
  if (!isOn(env.MCP_LOGIN)) return 'ok';
  const h = req.headers.get('Authorization') || '';
  if (/^Bearer\s/i.test(h) && env.MCP_TOKEN && await same(h.replace(/^Bearer\s+/i, '').trim(), env.MCP_TOKEN, env)) return 'ok';
  let user = req.headers.get('X-PeraSure-Account'), pass = req.headers.get('X-PeraSure-Password');
  if (/^Basic\s/i.test(h)) { try { const d = new TextDecoder().decode(Uint8Array.from(atob(h.replace(/^Basic\s+/i, '').trim()), c => c.charCodeAt(0))), i = d.indexOf(':'); if (i > 0) { user = d.slice(0, i); pass = d.slice(i + 1); } } catch {} }
  if (user == null && pass == null) return 'none';
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown', key = new Request(CACHE + 'mcp-tries/' + encodeURIComponent(ip));
  const tries = +(await (await caches.default.match(key))?.text() || 0);
  if (tries >= MAX_TRIES) return 'locked';
  const ok = env.DEVMODE_USER && env.DEVMODE_PASS && String(user || '').trim().toLowerCase() === String(env.DEVMODE_USER).trim().toLowerCase() && await same(String(pass || ''), String(env.DEVMODE_PASS), env);
  if (ok) return 'ok';
  await caches.default.put(key, new Response(String(tries + 1), { headers: { 'Cache-Control': 'max-age=900' } }));
  return 'wrong';
}
function cors() { return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, X-PeraSure-Account, X-PeraSure-Password', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }; }

/* ---------------------------------------------------------------- signing in */
async function login(req, env, url) {
  if (req.method !== 'POST') return redirect(BASE + '/');
  const f = await req.formData(), next = safeNext(String(f.get('next') || ''));
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown', tries = await triesOf(ip);
  if (tries >= MAX_TRIES) return loginPage(next, 'locked', 429, tries, env);
  /* after a few wrong passwords: Turnstile first, checked with Cloudflare before the password is even looked at */
  if (tries >= CHECK_AFTER && !(await human(f.get('cf-turnstile-response'), ip, env))) return loginPage(next, 'human', 403, tries, env);
  const okUser = String(f.get('user') || '').trim().toLowerCase() === String(env.DEVMODE_USER || '').trim().toLowerCase();
  const okPass = await same(String(f.get('pass') || ''), String(env.DEVMODE_PASS || ''), env);
  if (!env.DEVMODE_USER || !env.DEVMODE_PASS || !okUser || !okPass) {
    await caches.default.put(triesKey(ip), new Response(String(tries + 1), { headers: { 'Cache-Control': 'max-age=900' } }));
    await new Promise(r => setTimeout(r, 400));
    return loginPage(next, 'wrong', 401, tries + 1, env);
  }
  await caches.default.delete(triesKey(ip));
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  return new Response(null, { status: 303, headers: { Location: next, 'Set-Cookie': `${COOKIE}=${exp}.${await sign('session.' + exp, env)}; Path=${BASE}; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax` } });
}
const triesKey = ip => new Request(CACHE + 'tries-v2/' + encodeURIComponent(ip));
async function triesOf(ip) { return +(await (await caches.default.match(triesKey(ip)))?.text() || 0); }
/* Cloudflare Turnstile siteverify: one-time token, this widget's action, this site's hostname; anything else (or no answer) fails */
async function human(token, ip, env) {
  if (typeof token !== 'string' || !token || token.length > 2048 || !env.TURNSTILE_SECRET) return false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }) });
    if (!r.ok) return false;
    const v = await r.json();
    return v.success === true && v.action === 'login' && v.hostname === 'samge.studio';
  } catch { return false; }
}
function safeNext(n) { return n.startsWith(BASE + '/') && !n.startsWith('//') && !/[\r\n]/.test(n) && !n.startsWith(BASE + '/_log') ? n : PLAY + '/'; }
async function signedIn(req, env) {
  if (!env.SESSION_SECRET) return false;
  const m = new RegExp('(?:^|;\\s*)' + COOKIE + '=(\\d+)\\.([\\w-]+)').exec(req.headers.get('Cookie') || '');
  if (!m || +m[1] < Date.now() / 1000) return false;
  return same(m[2], await sign('session.' + m[1], env), env);
}
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg)));
}
async function sign(msg, env) { return btoa(String.fromCharCode(...await hmac(env.SESSION_SECRET, msg))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
/* compares two strings in constant time (as HMACs, so their lengths don't show either) */
async function same(a, b, env) {
  const k = env.SESSION_SECRET || 'compare', x = await hmac(k, String(a)), y = await hmac(k, String(b));
  let d = 0; for (let i = 0; i < x.length; i++) d |= x[i] ^ y[i];
  return d === 0;
}

/* ---------------------------------------------------------------- pages */
const LOGO = '/prototypes/withdraw-fund-flow/assets/perasure-logo.svg';   /* shown on the sign-in page, so served before sign-in */
function loginPage(next, problem, status, tries = 0, env = {}) {
  /* copy follows the PeraSure tone of voice: plain, kind, says what to do next */
  const msg = problem === 'wrong' ? 'That account or password doesn’t match. Try again.'
    : problem === 'human' ? 'Please finish the quick check below, then continue.'
    : problem === 'locked' ? 'Too many tries for now. Please wait 15 minutes, then try again.' : '';
  const check = problem !== 'locked' && tries >= CHECK_AFTER && env.TURNSTILE_SITEKEY
    ? `<div class="ts cf-turnstile" data-sitekey="${env.TURNSTILE_SITEKEY}" data-action="login" data-theme="light" data-language="en"></div><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>` : '';
  const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const eye = '<svg class="on" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>'
    + '<svg class="off" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18M10.6 5.1A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A16.6 16.6 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex"><meta name="theme-color" content="#ffffff"><title>Sign in · PeraSure</title>
<link rel="preload" href="${BASE}/assets/fonts/hanken-grotesk-var.woff2" as="font" type="font/woff2" crossorigin>
<style>
@font-face{font-family:"Hanken Grotesk";src:url("${BASE}/assets/fonts/hanken-grotesk-var.woff2") format("woff2");font-weight:100 900;font-display:swap}
@font-face{font-family:"Inter";src:url("${BASE}/assets/fonts/inter-var.woff2") format("woff2");font-weight:100 900;font-display:swap}
:root{color-scheme:light;--ink:#0a1219;--mute:#6a757d;--line:#dfe3e6;--focus:#2c74be;--err:#c0261a;--head:"Hanken Grotesk","Inter",system-ui,-apple-system,sans-serif;--body:"Inter",system-ui,-apple-system,sans-serif}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}html,body{margin:0}
body{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;align-items:center;background:#fff;color:var(--ink);font:16px/1.45 var(--body);-webkit-font-smoothing:antialiased}
main{flex:1;width:100%;max-width:440px;display:flex;flex-direction:column;justify-content:center;padding:calc(env(safe-area-inset-top) + 48px) 24px 32px}
.logo{display:block;height:34px;width:auto;margin:0 auto 36px}
h1{margin:0 0 40px;text-align:center;font:500 clamp(28px,7.4vw,34px)/1.15 var(--head);letter-spacing:-.02em}
.f{position:relative;margin-bottom:14px;border:1.5px solid var(--line);border-radius:20px;background:#fff;transition:border-color .15s,box-shadow .15s}
.f:focus-within{border-color:var(--focus);box-shadow:0 0 0 4px rgba(44,116,190,.12)}
.f label{position:absolute;left:20px;top:13px;font-size:13px;line-height:1;color:var(--mute);pointer-events:none}
.f input{display:block;width:100%;height:68px;padding:24px 20px 0;border:0;border-radius:20px;background:transparent;color:var(--ink);font:500 18px/1 var(--body);outline:0}
.f.pw input{padding-right:64px}
.eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);width:44px;height:44px;display:grid;place-items:center;border:0;border-radius:50%;background:none;color:var(--ink);cursor:pointer;touch-action:manipulation}
.eye .off,.eye[aria-pressed=true] .on{display:none}.eye[aria-pressed=true] .off{display:block}
.err{margin:2px 4px 14px;color:var(--err);font-size:14px;line-height:1.4}
.ts{display:flex;justify-content:center;margin:6px 0 14px;min-height:65px}
.go{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:62px;margin-top:14px;border:0;border-radius:999px;background:var(--ink);color:#fff;
  font:600 18px/1 var(--head);letter-spacing:.005em;cursor:pointer;touch-action:manipulation;transition:transform .08s,opacity .15s}
.go:hover{opacity:.9}.go:active{transform:scale(.985)}
.help{margin:26px 0 0;text-align:center;font-size:15px;color:var(--mute)}
footer{padding:0 24px calc(env(safe-area-inset-bottom) + 28px);font-size:13px;color:#9aa3a9;text-align:center}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>
<main><form method="post" action="${BASE}/_login" novalidate>
  <img class="logo" src="${BASE}${LOGO}" alt="PeraSure" width="126" height="34">
  <h1>Welcome back</h1>
  <input type="hidden" name="next" value="${esc(next)}">
  <div class="f"><label for="u">Account</label><input id="u" name="user" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus></div>
  <div class="f pw"><label for="p">Password</label><input id="p" name="pass" type="password" autocomplete="current-password" required>
    <button type="button" class="eye" aria-label="Show password" aria-pressed="false">${eye}</button></div>
  ${msg ? `<p class="err" role="alert">${msg}</p>` : ''}${check}
  <button type="submit" class="go">Continue</button>
  <p class="help">Need access? Ask the PeraSure design team.</p>
</form></main>
<footer>PeraSure Playground &amp; Dev Mode</footer>
<script>var b=document.querySelector('.eye'),i=document.getElementById('p');b.onclick=function(){var s=i.type==='password';i.type=s?'text':'password';b.setAttribute('aria-pressed',s);b.setAttribute('aria-label',s?'Hide password':'Show password');i.focus()};</script>
</body></html>`, { status, headers: { 'Content-Type': TYPES.html, 'Cache-Control': 'no-store', ...SAFE } });
}
function blank(status) {
  return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>samge.studio</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:15px -apple-system,sans-serif;color:#888}</style></head><body>samge.studio</body></html>',
    { status, headers: { 'Content-Type': TYPES.html } });
}
const text = (s, status = 200) => new Response(s, { status, headers: { 'Content-Type': TYPES.txt, ...SAFE } });
const json = (o, status = 200, h = {}) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', ...h } });
const redirect = (to, status = 301) => new Response(null, { status, headers: { Location: to } });
const notFound = () => text('Not found', 404);
