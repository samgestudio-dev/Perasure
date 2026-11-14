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
     /perasure/devmode/mcp     the MCP server (Streamable HTTP, JSON answers). Signs in the MCP standard way (OAuth 2.1): the developer's AI tool
                               finds the sign-in through /.well-known/…, opens /perasure/oauth/authorize in a browser, the developer enters the
                               account and password once, and the tool gets a token (refreshed by itself). Also accepted: headers
                               X-PeraSure-Account + X-PeraSure-Password, Authorization: Basic …, or Bearer <MCP_TOKEN>
     /.well-known/oauth-*      the OAuth discovery documents (protected resource + authorization server)
     /perasure/oauth/register  dynamic client registration (stateless: the client id is signed, nothing is stored)
     /perasure/oauth/authorize the sign-in page an AI tool opens · /perasure/oauth/token  codes and refresh tokens → access tokens
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
      if (p.startsWith('/.well-known/')) return wellKnown(req, url) || blank(404);
      if (p !== BASE && !p.startsWith(BASE + '/')) return blank(p === '/' ? 200 : 404);
      if (p === BASE || p === BASE + '/' || p === BASE + '/index.html') return redirect(PLAY + '/' + url.search, 302);
      if (p === PLAY) return redirect(PLAY + '/' + url.search);
      /* one Dev Mode: the picker's link to it goes to /perasure/devmode/ */
      if (p.startsWith(PLAY + '/devmode/')) return redirect(BASE + p.slice(PLAY.length) + url.search, 302);
      if (p === BASE + '/devmode/mcp') return await mcp(req, env, ctx);
      if (p.startsWith(BASE + '/oauth/')) return await oauth(req, env, url);
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
  if (auth !== 'ok') {
    /* WWW-Authenticate points the AI tool at the sign-in (MCP authorization spec); the message is for people reading the raw answer */
    const meta = new URL(req.url).origin + '/.well-known/oauth-protected-resource' + BASE + '/devmode/mcp';
    return json({ jsonrpc: '2.0', id: null, error: { code: -32001, message:
      auth === 'locked' ? 'Too many wrong passwords from this address. Please wait 15 minutes, then try again.'
      : auth === 'wrong' ? 'That account or password doesn’t match. Check the X-PeraSure-Account and X-PeraSure-Password headers.'
      : auth === 'expired' ? 'Your sign-in has ended. Sign in again from your AI tool (in Claude Code: /mcp → perasure-devmode → Authenticate).'
      : 'Sign in first: your AI tool opens the PeraSure sign-in page (in Claude Code: /mcp → perasure-devmode → Authenticate). Dev Mode → Connect AI shows the setup.' } },
      auth === 'locked' ? 429 : 401, { ...cors(), 'WWW-Authenticate': `Bearer realm="PeraSure Dev Mode", resource_metadata="${meta}"` + (auth === 'expired' ? ', error="invalid_token"' : '') });
  }
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
  if (/^Bearer\s/i.test(h)) {
    const tok = h.replace(/^Bearer\s+/i, '').trim();
    if (tok.startsWith('psat.')) return (await readToken(tok, 'a', env)) ? 'ok' : 'expired';
    if (env.MCP_TOKEN && await same(tok, env.MCP_TOKEN, env)) return 'ok';
    return 'expired';
  }
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
function cors() { return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version, X-PeraSure-Account, X-PeraSure-Password', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Expose-Headers': 'WWW-Authenticate' }; }

/* ---------------------------------------------------------------- signing in */
async function login(req, env, url) {
  if (req.method !== 'POST') return redirect(BASE + '/');
  const f = await req.formData(), next = safeNext(String(f.get('next') || ''));
  const c = await checkPassword(req, f, env);
  if (c.problem) return loginPage(next, c.problem, c.status, c.tries, env);
  return new Response(null, { status: 303, headers: { Location: next, 'Set-Cookie': await sessionCookie(env) } });
}
/* the account and password from a sign-in form (the site's or an AI tool's): 20 wrong tries per address in 15 minutes lock it; from the
   3rd, Turnstile first, checked with Cloudflare before the password is even looked at */
async function checkPassword(req, f, env) {
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown', tries = await triesOf(ip);
  if (tries >= MAX_TRIES) return { problem: 'locked', status: 429, tries };
  if (tries >= CHECK_AFTER && !(await human(f.get('cf-turnstile-response'), ip, env))) return { problem: 'human', status: 403, tries };
  const okUser = String(f.get('user') || '').trim().toLowerCase() === String(env.DEVMODE_USER || '').trim().toLowerCase();
  const okPass = await same(String(f.get('pass') || ''), String(env.DEVMODE_PASS || ''), env);
  if (!env.DEVMODE_USER || !env.DEVMODE_PASS || !okUser || !okPass) {
    await caches.default.put(triesKey(ip), new Response(String(tries + 1), { headers: { 'Cache-Control': 'max-age=900' } }));
    await new Promise(r => setTimeout(r, 400));
    return { problem: 'wrong', status: 401, tries: tries + 1 };
  }
  await caches.default.delete(triesKey(ip));
  return {};
}
async function sessionCookie(env) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  return `${COOKIE}=${exp}.${await sign('session.' + exp, env)}; Path=${BASE}; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
}

/* ---------------------------------------------------------------- MCP sign-in (OAuth 2.1, as the MCP authorization spec asks)
   Nothing is stored: client ids, codes and tokens are signed with SESSION_SECRET. Tokens carry a fingerprint of the password, so
   changing DEVMODE_PASS (or SESSION_SECRET) signs every AI tool out. Codes are single-use (Cache API) and need PKCE (S256). */
const ACCESS_TTL = 86400, REFRESH_TTL = 90 * 86400, CODE_TTL = 600;
const b64u = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
async function seal(kind, o, env) { const body = b64u(JSON.stringify(o)); return kind + '.' + body + '.' + await sign(kind + '.' + body, env); }
async function unseal(kind, s, env) {
  const m = new RegExp('^' + kind + '\\.([\\w-]+)\\.([\\w-]+)$').exec(String(s || ''));
  if (!m || !env.SESSION_SECRET || !(await same(m[2], await sign(kind + '.' + m[1], env), env))) return null;
  try { const o = JSON.parse(unb64u(m[1])); return o.exp && o.exp < Date.now() / 1000 ? null : o; } catch { return null; }
}
async function passPrint(env) { return (await sign('pass.' + (env.DEVMODE_PASS || ''), env)).slice(0, 16); }
async function readToken(tok, kind, env) { const o = await unseal('psat', tok, env); return o && o.k === kind && o.pv === await passPrint(env) ? o : null; }
async function tokens(env, client) {
  const now = Math.floor(Date.now() / 1000), pv = await passPrint(env);
  return { access_token: await seal('psat', { k: 'a', c: client, pv, exp: now + ACCESS_TTL }, env), token_type: 'Bearer', expires_in: ACCESS_TTL,
    refresh_token: await seal('psat', { k: 'r', c: client, pv, exp: now + REFRESH_TTL, n: crypto.randomUUID() }, env), scope: 'devmode' };
}
function wellKnown(req, url) {
  const o = url.origin, p = url.pathname, h = { 'Cache-Control': 'max-age=3600', ...cors() };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (p === '/.well-known/oauth-protected-resource' || p === '/.well-known/oauth-protected-resource' + BASE + '/devmode/mcp')
    return json({ resource: o + BASE + '/devmode/mcp', authorization_servers: [o], bearer_methods_supported: ['header'], scopes_supported: ['devmode'], resource_name: 'PeraSure Dev Mode' }, 200, h);
  if (p === '/.well-known/oauth-authorization-server' || p === '/.well-known/openid-configuration')
    return json({ issuer: o, authorization_endpoint: o + BASE + '/oauth/authorize', token_endpoint: o + BASE + '/oauth/token', registration_endpoint: o + BASE + '/oauth/register',
      response_types_supported: ['code'], response_modes_supported: ['query'], grant_types_supported: ['authorization_code', 'refresh_token'], code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'], scopes_supported: ['devmode'], service_documentation: o + BASE + '/devmode/' }, 200, h);
  return null;
}
/* a redirect address an AI tool may register: https, a loopback http address, or the tool's own scheme (cursor://, vscode://) */
function okRedirect(u) {
  try { const x = new URL(u); if (/^(javascript|data|file|blob|vbscript):$/i.test(x.protocol) || x.hash) return false;
    return x.protocol === 'https:' || (x.protocol === 'http:' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(x.hostname)) || !/^https?:$/.test(x.protocol); } catch { return false; }
}
/* loopback addresses match whatever port the tool listens on that time (RFC 8252); everything else matches exactly */
function sameRedirect(a, b) {
  if (a === b) return true;
  try { const x = new URL(a), y = new URL(b); return x.protocol === 'http:' && y.protocol === 'http:' && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(x.hostname) && x.hostname === y.hostname && x.pathname === y.pathname; } catch { return false; }
}
const oauthErr = (error, description, status = 400) => json({ error, error_description: description }, status, { 'Cache-Control': 'no-store', ...cors() });
async function oauth(req, env, url) {
  const p = url.pathname.slice((BASE + '/oauth/').length);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (p === 'register') {
    if (req.method !== 'POST') return oauthErr('invalid_request', 'POST the client metadata here', 405);
    let m; try { m = JSON.parse(await req.text() || '{}'); } catch { return oauthErr('invalid_client_metadata', 'the body is not JSON'); }
    const r = Array.isArray(m.redirect_uris) ? m.redirect_uris.map(String) : [];
    if (!r.length || r.length > 10 || r.some(u => u.length > 500 || !okRedirect(u))) return oauthErr('invalid_redirect_uri', 'redirect_uris: 1 to 10 https, loopback or app addresses');
    const name = String(m.client_name || 'Your AI tool').replace(/[\u0000-\u001f<>]/g, '').slice(0, 60);
    const client_id = await seal('psc', { r, n: name }, env);
    return json({ client_id, client_id_issued_at: Math.floor(Date.now() / 1000), client_name: name, redirect_uris: r, grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'], token_endpoint_auth_method: 'none', scope: 'devmode' }, 201, { 'Cache-Control': 'no-store', ...cors() });
  }
  if (p === 'authorize') {
    const q = req.method === 'POST' ? null : url.searchParams;
    const f = req.method === 'POST' ? await req.formData() : null;
    const a = q ? Object.fromEntries(q) : await unseal('psq', f.get('q'), env);
    if (!a) return oauthPage(env, { problem: 'This sign-in link has expired. Please start again from your AI tool.' }, 400);
    const client = await unseal('psc', a.client_id, env);
    if (!client || !a.redirect_uri || !client.r.some(r => sameRedirect(r, a.redirect_uri))) return oauthPage(env, { problem: 'This sign-in link isn’t valid. Please start again from your AI tool.' }, 400);
    const back = (o) => { const u = new URL(a.redirect_uri); for (const [k, v] of Object.entries(o)) if (v != null) u.searchParams.set(k, v); return redirect(u.toString(), 303); };
    if (a.response_type !== 'code') return back({ error: 'unsupported_response_type', state: a.state });
    if (!a.code_challenge || (a.code_challenge_method || 'plain') !== 'S256') return back({ error: 'invalid_request', error_description: 'PKCE with S256 is required', state: a.state });
    const give = async (extra = {}) => {
      const code = await seal('psk', { c: a.client_id.slice(-24), r: a.redirect_uri, ch: a.code_challenge, exp: Math.floor(Date.now() / 1000) + CODE_TTL, n: crypto.randomUUID() }, env);
      const res = back({ code, state: a.state, iss: url.origin });
      for (const [k, v] of Object.entries(extra)) res.headers.append(k, v);
      return res;
    };
    if (!isOn(env.MCP_LOGIN)) return give();
    const sealed = await seal('psq', { ...a, exp: Math.floor(Date.now() / 1000) + 1800 }, env);
    const signed = await signedIn(req, env), tries = await triesOf(req.headers.get('CF-Connecting-IP') || 'unknown');
    if (!f) return oauthPage(env, { name: client.n, q: sealed, signed, tries });
    /* signed in to the site already: Allow is enough (the cookie is SameSite=Lax, so another site can't post this for you) */
    if (signed && f.get('allow') === '1') return give();
    const c = await checkPassword(req, f, env);
    if (c.problem) return oauthPage(env, { name: client.n, q: sealed, signed: false, tries: c.tries, problem: c.problem }, c.status);
    return give({ 'Set-Cookie': await sessionCookie(env) });
  }
  if (p === 'token') {
    if (req.method !== 'POST') return oauthErr('invalid_request', 'POST here', 405);
    const ct = req.headers.get('Content-Type') || '';
    let f; try { f = ct.includes('json') ? new Map(Object.entries(await req.json())) : await req.formData(); } catch { return oauthErr('invalid_request', 'unreadable body'); }
    const g = k => { const v = f.get(k); return v == null ? '' : String(v); };
    if (g('grant_type') === 'authorization_code') {
      const k = await unseal('psk', g('code'), env);
      if (!k) return oauthErr('invalid_grant', 'the code is wrong or has expired');
      if (g('client_id') && g('client_id').slice(-24) !== k.c) return oauthErr('invalid_grant', 'the code was given to another client');
      if (g('redirect_uri') && !sameRedirect(k.r, g('redirect_uri'))) return oauthErr('invalid_grant', 'redirect_uri doesn’t match');
      const v = g('code_verifier');
      const ch = v ? btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : '';
      if (!v || ch !== k.ch) return oauthErr('invalid_grant', 'code_verifier doesn’t match');
      const used = new Request(CACHE + 'oauth-code/' + k.n);
      if (await caches.default.match(used)) return oauthErr('invalid_grant', 'the code was used already');
      await caches.default.put(used, new Response('1', { headers: { 'Cache-Control': 'max-age=' + CODE_TTL } }));
      return json(await tokens(env, k.c), 200, { 'Cache-Control': 'no-store', Pragma: 'no-cache', ...cors() });
    }
    if (g('grant_type') === 'refresh_token') {
      const r = await readToken(g('refresh_token'), 'r', env);
      if (!r) return oauthErr('invalid_grant', 'the sign-in has ended; sign in again');
      return json(await tokens(env, r.c), 200, { 'Cache-Control': 'no-store', Pragma: 'no-cache', ...cors() });
    }
    return oauthErr('unsupported_grant_type', 'authorization_code or refresh_token');
  }
  return notFound();
}
function oauthPage(env, o, status = 200) {
  if (!o.q) return loginPage('', '', status, 0, env, { title: 'Can’t sign in', note: o.problem });
  const name = (o.name || 'Your AI tool').replace(/\s*\([^)]*\)\s*$/, '') || 'Your AI tool';   /* "Claude Code (perasure-devmode)" → "Claude Code" */
  return loginPage('', o.problem || '', status, o.tries || 0, env, {
    action: BASE + '/oauth/authorize', hidden: { q: o.q }, title: 'Connect ' + name, signed: o.signed,
    sub: o.signed ? `You’re signed in. Allow ${name} to read PeraSure Dev Mode: pages, components and code.`
      : `Sign in to let ${name} read PeraSure Dev Mode: pages, components and code.`,
    button: o.signed ? 'Allow' : 'Sign in and allow' });
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
function loginPage(next, problem, status, tries = 0, env = {}, o = {}) {
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
h1{margin:0 0 40px;text-align:center;font:500 clamp(28px,7.4vw,34px)/1.15 var(--head);letter-spacing:-.02em;overflow-wrap:anywhere}
.sub{margin:-26px 0 32px;text-align:center;color:var(--mute);font-size:16px;line-height:1.5;overflow-wrap:anywhere}
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
<main><form method="post" action="${esc(o.action || BASE + '/_login')}" novalidate>
  <img class="logo" src="${BASE}${LOGO}" alt="PeraSure" width="126" height="34">
  <h1>${esc(o.title || 'Welcome back')}</h1>${o.sub ? `\n  <p class="sub">${esc(o.sub)}</p>` : ''}
  ${o.note ? `<p class="sub">${esc(o.note)}</p>` : `${o.action ? '' : `<input type="hidden" name="next" value="${esc(next)}">`}${Object.entries(o.hidden || {}).map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join('')}
  ${o.signed ? '<input type="hidden" name="allow" value="1">' : `<div class="f"><label for="u">Account</label><input id="u" name="user" autocomplete="username" autocapitalize="none" spellcheck="false" required autofocus></div>
  <div class="f pw"><label for="p">Password</label><input id="p" name="pass" type="password" autocomplete="current-password" required>
    <button type="button" class="eye" aria-label="Show password" aria-pressed="false">${eye}</button></div>`}
  ${msg ? `<p class="err" role="alert">${msg}</p>` : ''}${o.signed ? '' : check}
  <button type="submit" class="go">${esc(o.button || 'Continue')}</button>
  <p class="help">Need access? Ask the PeraSure design team.</p>`}
</form></main>
<footer>PeraSure Playground &amp; Dev Mode</footer>
<script>var b=document.querySelector('.eye'),i=document.getElementById('p');if(b)b.onclick=function(){var s=i.type==='password';i.type=s?'text':'password';b.setAttribute('aria-pressed',s);b.setAttribute('aria-label',s?'Hide password':'Show password');i.focus()};</script>
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
