# PeraSure Dev Mode (`devmode/`)

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** the task touches Dev Mode: iterations, snapshots, `pages.js`, the visual check, the MCP. Skill: `perasure-iteration-log`.

## PeraSure Dev Mode (`devmode/` — data only; the platform is the repo `devmode-platform`)

The owner's tool for designers and developers (desktop, after Figma Dev Mode): every page of the app and every shared component, live,
with hover spacing (padding / gaps labelled with the tokens the CSS uses), Alt redlines, specs, tokens, the code behind each piece (GitHub,
at the version's tag), Figma nodes, statuses, the iteration record and version compare. Guide: `devmode/README.md`.

- **One requirement, one iteration, one tag** (owner, 2026-11-17): every change made for one requirement — tokens, global components and
  the pages they touch — is recorded as ONE iteration (one snapshot, one tag `devmode-<id>`). A global iteration also gets an
  **overview** (`devmode/iterations/<id>/`: the visual check's before | after | difference for every changed page state and component
  state, shown on the iteration's page in Dev Mode, and `README.md`, the brief for developers' AI — what changed, the rules, the token
  changes, every page and component, how to build it; `get_iteration` returns it). Skill `perasure-iteration-log`.
- **Every new requirement is recorded** (owner): a change to a page, a component or a motion gets an iteration entry — skill
  `perasure-iteration-log` (Jira key and title read from Jira; "无 Jira 单号" when there is none). The version stays v1 — iterations are
  labelled `v1 · YYYY-MM-DD · PHL-xxx`; only a large redesign starts v2.0. Each iteration keeps a runnable snapshot (`devmode/snapshots/<id>`)
  and a git tag `devmode-<id>` (made by `.github/workflows/devmode.yml` on push — don't tag yourself); the statuses (Ready for dev / Changed / Completed) are in `devmode/data/status.js`, kept by Claude.
- **Nothing is tagged by hand**: components are found in React's tree (`PS.*`, and the app's own `APP.*` pieces), pages come from
  `devmode/data/pages.js` (how each page and state is opened) and `devmode/data/index.js` (made by `tools/devmode-index.py` from the code).
  A new screen → add it to `pages.js`; a new component → its gallery entry (it then has states in Dev Mode).
- **The platform's own look is not PeraSure's** (owner): PeraSure tokens are data inside it (Inspect, the Tokens tab), never its styling.
  It is bilingual (中 / EN, every text in devmode-platform's `js/i18n.js`, data as `{ zh, en }`) and has light and dark themes.
- Don't read `tokens/tokens.css` into context for it: the Tokens tab parses the file in the browser.
- **Unrecorded changes** (owner wanted a Chromatic-like check): `tools/devmode-visual.mjs diff` renders every page state and component
  state from the latest iteration's snapshot and from the code now and compares pixels (steady renders: fixed clock and random numbers,
  finished entrances, Lottie on a fixed frame, self-moving parts rendered twice and left out). `.github/workflows/devmode-visual.yml`
  runs it on every push and publishes the report to the branch `devmode-visual` (Dev Mode → Iterations → Unrecorded changes; MCP
  `get_visual_changes`). Use it before recording an iteration (skill `perasure-iteration-log`); a new page or state in `pages.js` must
  render steadily (check with `--filter <id>` twice).
- **Screen as on the phone** (owner): the canvas lays a page out and draws it as the chosen phone does — device, Screen fit (the app's
  Tune modes, default capped zoom) and Text size, in the toolbar's screen menu; the frame keeps one size and place on every page.
  `DM.screenOf` (devmode-platform `js/canvas.js`) and `screenOf` in its `mcp/core.mjs` mirror `shared/ps-ui/phone-fit.js`: when the fit
  modes or the capped zoom change there, change both (and `zmax` in `devmode/app.js`).
- **Annotate, QA, Figma links** (owner): notes pinned on layers travel in links (devmode-platform `js/notes.js`); QA lays the developers'
  screenshot over the demo (canvas); design-system components matched to PS components live in `devmode/data/figma-links.js` (only
  clear one-to-one matches). Writing links into the shared Figma file needs the owner's go-ahead (Code Connect needs an Organization plan).
- **MCP for developers' AI** (owner): hosted at https://samge.studio/devmode/mcp (one server for every app on the platform; each tool takes
  `app`; OAuth sign-in or the account and password as headers; reads any repo file, so developers never need GitHub) and local
  (`node mcp/server.mjs --app <Perasure clone>` in a devmode-platform clone, adds the Playwright tools). Guide: devmode-platform `mcp/README.md`.
  The local one injects this repo's `devmode/inspector.js` (a copy of the platform's `js/inspector.js`: keep them the same). When a data
  format or a page's opening (`pages.js`) changes, update the platform's `mcp/core.mjs` (`pagesFrom`) too, raise its `VERSION` and redeploy
  the Worker.
