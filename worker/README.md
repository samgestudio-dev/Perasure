# PeraSure Playground on samge.studio

The repo is private, so it is served by a Cloudflare Worker (`perasure-devmode`, [`index.js`](index.js)) instead of GitHub Pages:

| Address | What |
|---|---|
| https://samge.studio/perasure/devmode/ | PeraSure Dev Mode |
| https://samge.studio/perasure/playground/ | the Playground picker (every prototype and animation); `/perasure/` forwards here |
| https://samge.studio/perasure/devmode/mcp | the hosted MCP server for developers' AI tools (Dev Mode → Connect AI) |

- **Password first.** Every page asks for the account and password once (a cookie keeps you signed in for 30 days; `/perasure/_logout`
  signs out). Both live only in Cloudflare secrets. After 3 wrong tries from one address the page asks for Cloudflare
  Turnstile (are you human?), checked on the server before the password; 20 wrong tries lock the address for 15 minutes.
- **A relay, not a copy.** Each file is read from GitHub (main, newest commit) when it is asked for. A push is live within about
  20 seconds, with nothing to deploy. Files are cached by commit, so a page loads fast after the first visit.
- **MCP.** The hosted server runs the same tools as `devmode/mcp/server.mjs` (shared code: `devmode/mcp/core.mjs`), except screenshots,
  design QA and live measurements, which need a browser (local server only), and reads any file of the repo (`read_file`,
  `list_files`, `search_code`). It signs in the MCP standard way (OAuth 2.1): an AI tool given only the address finds the sign-in through
  `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server`, registers itself (`/perasure/oauth/register`),
  opens `/perasure/oauth/authorize` — the same sign-in page, titled "Connect <tool>" (just **Allow** when the browser is signed in) — and
  swaps the code for tokens at `/perasure/oauth/token` (PKCE S256; codes single-use; access tokens 24 h, refresh tokens 90 days).
  Nothing is stored: client ids, codes and tokens are signed with `SESSION_SECRET` and carry a fingerprint of the password, so changing
  `DEVMODE_PASS` signs every tool out. Also accepted: the headers `X-PeraSure-Account` + `X-PeraSure-Password`, HTTP Basic, or
  `Authorization: Bearer <MCP_TOKEN>`. Wrong passwords anywhere count toward the same lockout.
- Paths outside `/perasure/`: only `/.well-known/oauth-*` (the discovery documents above) and `robots.txt`; the rest is a blank page.
- **Source viewer.** `/perasure/_source/<path>` shows a repo file with line numbers (`#L10-L20` highlights, `?v=<iteration>` an older
  version, `?raw` the plain file). Dev Mode's code links open it, so nobody needs a GitHub account. The data of `devmode/data/pages.js`, `iterations.js` and `status.js` reaches it as
  JSON on the branch `devmode-mcp`, made by the *Dev Mode live* workflow on every change (Workers can't run those scripts).
- Not served: dot folders (`.github`, `.claude` …) and `worker/`. `samge.studio` itself shows a blank page.

## Switches

Same page, type *Text* (a missing switch counts as on). Changing one takes effect at once, no deploy:

| Name | Value |
|---|---|
| `SITE_LOGIN` | `on` / `off` — whether the website (Playground, Dev Mode, source viewer) asks for the account and password |
| `MCP_LOGIN` | `on` / `off` — whether the MCP server asks for them |

`wrangler.toml` has `keep_vars = true`, so a deploy keeps whatever the dashboard says.

## Secrets

Cloudflare dashboard → Workers & Pages → `perasure-devmode` → Settings → Variables and Secrets (type *Secret*):

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | GitHub fine-grained token: only this repo, Contents read-only (renew it before it expires) |
| `DEVMODE_USER` | the account (not case-sensitive) |
| `DEVMODE_PASS` | the password (case-sensitive) |
| `SESSION_SECRET` | random text that signs the sign-in cookie and the AI tools' tokens; changing it signs everyone out |
| `MCP_TOKEN` | optional: an older way into the MCP (`Authorization: Bearer …`); the account and password are the normal way |
| `TURNSTILE_SECRET` | the secret of the Turnstile widget `perasure-devmode-login` (Cloudflare → Turnstile); its public site key is `TURNSTILE_SITEKEY` in `wrangler.toml` |

To change the password, edit `DEVMODE_PASS` there. Random text: `openssl rand -hex 32`.

## Deploying the Worker's own code

Only needed when `worker/` or `devmode/mcp/core.mjs` changes. The *Dev Mode live* workflow (`.github/workflows/devmode-live.yml`)
deploys it with Wrangler when the repo has the Actions secrets `CLOUDFLARE_API_TOKEN` (a Cloudflare API token with *Edit Cloudflare
Workers*) and `CLOUDFLARE_ACCOUNT_ID`; without them it skips and says so, and Claude can deploy through the Cloudflare connector.
By hand: `npx wrangler deploy -c worker/wrangler.toml`.
