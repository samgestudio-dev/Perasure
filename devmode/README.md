# PeraSure Dev Mode

Every page of the PeraSure app and every shared component, live, inspected the way Figma Dev Mode inspects a design — so designers can
see what each iteration changed and developers can pull the exact code. Desktop only. Open: [`devmode/index.html`](index.html)
(on the picker as "PeraSure Dev Mode"). It replaced the component gallery (`shared/gallery.html` forwards here).

## What it does

- **Pages / Components / Tokens / Iterations** on the left, with a search; **Layers** of what is in the canvas, as React draws it.
- **Canvas**: the real app (or a component's states) in a 360 / 390 / 430 frame, laid out and drawn as on that phone: the toolbar's
  screen menu has the device, **Screen fit** (as the app's Tune — capped zoom by default: a 390 phone lays the page out 360 CSS px wide
  and draws it ×1.08, a 430 one 374 px ×1.15; capped zoom · rem; 1:1; full zoom) and **Text size** (85–200 %). Inspect measures the
  page's CSS px. The frame keeps its size and place on every page (the states line above it scrolls sideways). Links carry these
  settings (`#…&dev=390&fit=cap&tx=100`). `DM.screenOf` (`js/canvas.js`) mirrors `shared/ps-ui/phone-fit.js`: change them together
  (and `screenOf` in the MCP server). *Inspect* (I): hover outlines a component and shows
  its padding (blue hatching) and the gaps between its children (pink), labelled with the token the CSS actually uses (`gap-md` =
  `var(--spacing-gap-md)`, `Auto` for space-between, the number when no token is written); click selects; Ctrl / ⌘ goes down to the
  element; Alt draws redlines to what the pointer is over (or to the parent); Shift+Enter selects the parent, Enter the first child,
  Esc clears. *Interact* (P): use the app as on a phone; the page list follows.
- **Inspect** (right): status (Ready for dev / Changed / Completed), last iteration, dev resources (component and page source on
  GitHub at the version's tag, with lines; its CSS in `ps-ui.css`; Figma nodes), description, the props this page passes, specs as a
  list or code (JSX, the repo's `h(PS.X, …)`, the CSS rules it matches, the component's source; px or rem), tokens with their values,
  motion values (`PS.MT`), the icons and pictures inside it, and the pages that use it. With nothing selected: the page, how to open
  it on a phone, and its components. **History**: the iterations that changed it.
- **Compare**: any two versions side by side (a tap, scroll or typing on one side happens on the other) or overlaid (opacity slider),
  replayed together at 1× / 0.5× / 0.25×, with the recorded changes and, per component, properties and code before → after.
- **Unrecorded changes** (Iterations, and an orange badge in the top bar): after every push the *Dev Mode visual check* workflow
  renders every page state and component state from the latest iteration's snapshot and from the code now, compares the pixels
  (`tools/devmode-visual.mjs`) and lists what changed but isn't recorded yet — before | after | difference pictures and the
  components where each change starts. Self-moving parts (loaders, sparkles) are rendered twice and left out. The report lives on the
  branch `devmode-visual`; `?visual=<folder>` reads a local run.
- **Annotate** (N): click what should change and write a note (UI / motion / copy / bug); numbered pins stay on their layers. The
  Notes tab copies a task list (Jira, chat) or a share link — the notes travel in the link (`#…&notes=…`) and the MCP server reads them.
- **QA** (toolbar): drop, paste or choose a screenshot of the developers' implementation; it is scaled to the frame and shown as a
  difference (matching parts go black), an overlay (opacity) or side by side; arrows nudge it. Mark issues with Annotate.
- **Figma links**: paste a Figma link into the Pages / Components search to find what it is built as. Design-system components are
  matched to PS components in `data/figma-links.js` (added to each component's Figma nodes by `tools/devmode-index.py`).
- **Connect AI** (top bar): an MCP server for developers' AI tools — Claude Code, Cursor, Codex … read pages, components, code, CSS,
  tokens, motion and iterations straight from Dev Mode ([`mcp/README.md`](mcp/README.md)). **Copy for AI** (right panel) copies an
  instruction with the link to what is selected; the AI opens it with `resolve_devmode_link`.
- 中 / EN switch and system / light / dark theme (remembered in the browser). The platform has its own look: PeraSure's tokens are
  data inside it, never its styling.

## Files

| | |
|---|---|
| `index.html`, `devmode.css` | the page and the platform's look (its own colours, light and dark) |
| `js/util.js` | React shorthands, icons, versions, links, statuses, small pieces |
| `js/i18n.js` | every interface text in Chinese and English (`DM.t`), bilingual data (`DM.tx`) |
| `js/inspector.js` | reads the app in the canvas: components from React's tree, sizes, props, specs, the CSS as written, assets |
| `js/canvas.js` | the frame, the overlays (outlines, padding / gap hatching, redlines), modes, zoom, the screen menu (device, Screen fit, Text size) |
| `js/sidebar.js`, `js/panels.js` | the left column (lists, layers) and Inspect / History |
| `js/views.js`, `js/compare.js` | Tokens and Iterations pages; version compare (and the slow-motion clock) |
| `js/app.js` | the shell: top bar, state in the address (`#p=home&sel=…`), theme, language |
| `data/pages.js` | how each app page and state is opened (Tune settings, `?page=`, a script) — add new screens here |
| `data/index.js` | made by `tools/devmode-index.py` from the code (stamp.py runs it): components, pages, lines, CSS, tokens, Figma |
| `data/iterations.js`, `data/status.js` | the iteration record and the dev statuses (rules: skill `perasure-iteration-log`) |
| `js/notes.js` | Annotate: notes storage, link encoding, editor, Notes tab, task list |
| `data/figma-links.js` | design-system components (Figma) ↔ PS components |
| `../tools/devmode-visual.mjs`, `../.github/workflows/devmode-visual.yml` | the visual check and the workflow that publishes it (branch `devmode-visual`) |
| `mcp/server.mjs`, `js/ai.js` | the MCP server (one file, Node 18+; guide `mcp/README.md`) and its setup dialog / Copy for AI |
| `snapshots/<id>/` | a runnable copy of each iteration (`tools/devmode-snapshot.py <id>`); the *Dev Mode* workflow tags its commit `devmode-<id>` |

`shared/stage.html?entry=<gallery entry>&state=<n>` draws one state of a component for the canvas; the states themselves are written
in `shared/gallery.js` / `gallery-app.js`. `shared/ps-ui/core.js` lets Dev Mode set a slower clock in pages it compares (one guarded line).

## Recording an iteration

Every change to an app page, a shared component or a motion is recorded: skill `.claude/skills/perasure-iteration-log` (Jira title
read from Jira, `v1 · YYYY-MM-DD · PHL-xxx`, "无 Jira 单号" without a ticket; snapshot, statuses, tag). The major version stays v1
until a large redesign.
