/* PeraSure Playground on samge.studio — a Cloudflare Worker that serves this private repo at https://samge.studio/perasure/ behind a
   password, straight from GitHub (nothing is copied or built: a push to main is live within about 20 seconds), plus the hosted MCP
   server for developers' AI tools at /perasure/devmode/mcp.

     /perasure/<path>          the repo's file at the newest commit of main (Dev Mode: /perasure/devmode/; the picker: /perasure/)
     /perasure/_visual/<path>  the Dev Mode visual check (branch devmode-visual)
     /perasure/_login, _logout the password page (account and password are Cloudflare secrets, never in the page)
     /perasure/_mcp            for signed-in Dev Mode: the MCP address and access token (Connect AI shows them)
     /perasure/devmode/mcp     the MCP server (Streamable HTTP, JSON answers; header Authorization: Bearer <MCP_TOKEN>)
     anything else             a blank samge.studio page

   Secrets (Cloudflare → Workers & Pages → perasure-devmode → Settings → Variables and Secrets):
     GITHUB_TOKEN    fine-grained token, this repo only, Contents: read-only
     DEVMODE_USER    the account (compared without case)       DEVMODE_PASS   the password (case matters)
     SESSION_SECRET  signs the sign-in cookie (changing it signs everyone out)
     MCP_TOKEN       developers' MCP access token (changing it disconnects their AI tools until they update it)
   Deployed by .github/workflows/devmode-live.yml (when CLOUDFLARE_API_TOKEN is set in the repo's Actions secrets). Guide: worker/README.md */
import { createDevmode } from '../devmode/mcp/core.mjs';

const REPO = 'samgestudio-dev/Perasure';
const BASE = '/perasure';
const COOKIE = 'ps_devmode';
const SESSION_DAYS = 30;
const HEAD_TTL = 20;            /* seconds a data centre keeps the newest commit id before asking GitHub again */
const MAX_TRIES = 10;           /* wrong passwords per address in 15 minutes */
const CACHE = 'https://samge.studio/__cache/';   /* Cache API keys (never served) */
const TYPES = {
  html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8', js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8', json: 'application/json; charset=utf-8', md: 'text/markdown; charset=utf-8', txt: 'text/plain; charset=utf-8',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', ico: 'image/x-icon',
  woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf', lottie: 'application/zip', zip: 'application/zip',
  mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wasm: 'application/wasm', map: 'application/json; charset=utf-8'
};
const SAFE = { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin', 'X-Robots-Tag': 'noindex, nofollow', 'X-Frame-Options': 'SAMEORIGIN' };

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url), p = url.pathname;
    try {
      if (p === '/robots.txt') return text('User-agent: *\nDisallow: /\n');
      if (p !== BASE && !p.startsWith(BASE + '/')) return blank(p === '/' ? 200 : 404);
      if (p === BASE) return redirect(BASE + '/' + url.search);
      if (p === BASE + '/devmode/mcp') return await mcp(req, env, ctx);
      if (p === BASE + '/_login') return await login(req, env, url);
      if (p === BASE + '/_logout') return new Response(null, { status: 303, headers: { Location: BASE + '/', 'Set-Cookie': `${COOKIE}=; Path=${BASE}; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });
      if (!(await signedIn(req, env))) return loginPage(url.pathname + url.search, '', 200);
      if (p === BASE + '/_mcp') return json({ url: url.origin + BASE + '/devmode/mcp', token: env.MCP_TOKEN || '' }, 200, { 'Cache-Control': 'no-store' });
      if (req.method !== 'GET' && req.method !== 'HEAD') return text('Method not allowed', 405);
      if (p.startsWith(BASE + '/_visual/')) return await file(req, env, ctx, 'devmode-visual', p.slice((BASE + '/_visual/').length));
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

/* ---------------------------------------------------------------- the MCP server */
let dm = null, dmSha = '';
async function mcp(req, env, ctx) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (!env.MCP_TOKEN || !(await same(bearer(req), env.MCP_TOKEN, env))) return json({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Unauthorized: add the header Authorization: Bearer <token> (Dev Mode → Connect AI shows it)' } }, 401, cors());
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
function bearer(req) { const h = req.headers.get('Authorization') || ''; return h.replace(/^Bearer\s+/i, '').trim(); }
function cors() { return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }; }

/* ---------------------------------------------------------------- signing in */
async function login(req, env, url) {
  if (req.method !== 'POST') return redirect(BASE + '/');
  const f = await req.formData(), next = safeNext(String(f.get('next') || ''));
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown', key = new Request(CACHE + 'tries/' + encodeURIComponent(ip));
  const tries = +(await (await caches.default.match(key))?.text() || 0);
  if (tries >= MAX_TRIES) return loginPage(next, 'locked', 429);
  const okUser = String(f.get('user') || '').trim().toLowerCase() === String(env.DEVMODE_USER || '').trim().toLowerCase();
  const okPass = await same(String(f.get('pass') || ''), String(env.DEVMODE_PASS || ''), env);
  if (!env.DEVMODE_USER || !env.DEVMODE_PASS || !okUser || !okPass) {
    await caches.default.put(key, new Response(String(tries + 1), { headers: { 'Cache-Control': 'max-age=900' } }));
    await new Promise(r => setTimeout(r, 400));
    return loginPage(next, 'wrong', 401);
  }
  await caches.default.delete(key);
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  return new Response(null, { status: 303, headers: { Location: next, 'Set-Cookie': `${COOKIE}=${exp}.${await sign('session.' + exp, env)}; Path=${BASE}; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax` } });
}
function safeNext(n) { return n.startsWith(BASE + '/') && !n.startsWith('//') && !/[\r\n]/.test(n) && !n.startsWith(BASE + '/_log') ? n : BASE + '/devmode/'; }
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
function loginPage(next, problem, status) {
  const msg = problem === 'wrong' ? '<p class="err">账号或密码不对，请再试一次。<br>That account or password isn’t right. Please try again.</p>'
    : problem === 'locked' ? '<p class="err">试错次数太多了，请 15 分钟后再试。<br>Too many tries. Please try again in 15 minutes.</p>' : '';
  const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return new Response(`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>PeraSure Dev Mode · 登录</title><style>
:root{color-scheme:light dark;--bg:#f4f5f7;--card:#fff;--fg:#16181d;--mute:#6b7280;--line:#d9dce1;--acc:#4f46e5;--err:#c2410c}
@media(prefers-color-scheme:dark){:root{--bg:#111316;--card:#1b1e23;--fg:#eceef1;--mute:#9aa1ab;--line:#2e333a;--acc:#8b85ff;--err:#fb923c}}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}
form{width:min(360px,calc(100vw - 32px));background:var(--card);border:1px solid var(--line);border-radius:14px;padding:28px}
h1{font-size:18px;margin:0 0 4px}p.sub{margin:0 0 20px;color:var(--mute);font-size:13px}
label{display:block;font-size:13px;color:var(--mute);margin:14px 0 6px}
input{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:transparent;color:inherit;font:inherit}
input:focus{outline:2px solid var(--acc);outline-offset:-1px;border-color:transparent}
button{width:100%;margin-top:22px;padding:11px;border:0;border-radius:8px;background:var(--acc);color:#fff;font:inherit;font-weight:600;cursor:pointer}
.err{color:var(--err);font-size:13px;margin:12px 0 0}</style></head><body>
<form method="post" action="${BASE}/_login"><h1>PeraSure Dev Mode</h1><p class="sub">登录后查看页面、组件和代码 · Sign in to see the pages, components and code</p>
<input type="hidden" name="next" value="${esc(next)}">
<label for="u">账号 Account</label><input id="u" name="user" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus>
<label for="p">密码 Password</label><input id="p" name="pass" type="password" autocomplete="current-password" required>
${msg}<button type="submit">登录 Sign in</button></form></body></html>`, { status, headers: { 'Content-Type': TYPES.html, 'Cache-Control': 'no-store', ...SAFE } });
}
function blank(status) {
  return new Response('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>samge.studio</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font:15px -apple-system,sans-serif;color:#888}</style></head><body>samge.studio</body></html>',
    { status, headers: { 'Content-Type': TYPES.html } });
}
const text = (s, status = 200) => new Response(s, { status, headers: { 'Content-Type': TYPES.txt, ...SAFE } });
const json = (o, status = 200, h = {}) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', ...h } });
const redirect = (to, status = 301) => new Response(null, { status, headers: { Location: to } });
const notFound = () => text('Not found', 404);
