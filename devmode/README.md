# PeraSure Dev Mode

Every page of the PeraSure app and every shared component, live, inspected the way Figma Dev Mode inspects a design — so designers can
see what each iteration changed and developers can pull the exact code. Desktop only. Open: [`devmode/index.html`](index.html)
(on the picker as "PeraSure Dev Mode"). It replaced the component gallery (`shared/gallery.html` forwards here).

## What it does

- **Pages / Components / Tokens / Iterations** on the left, with a search; **Layers** of what is in the canvas, as React draws it.
- **Canvas**: the real app (or a component's states) in a 360 / 390 / 430 frame. *Inspect* (I): hover outlines a component and shows
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
- 中 / EN switch and system / light / dark theme (remembered in the browser). The platform has its own look: PeraSure's tokens are
  data inside it, never its styling.

## Files

| | |
|---|---|
| `index.html`, `devmode.css` | the page and the platform's look (its own colours, light and dark) |
| `js/util.js` | React shorthands, icons, versions, links, statuses, small pieces |
| `js/i18n.js` | every interface text in Chinese and English (`DM.t`), bilingual data (`DM.tx`) |
| `js/inspector.js` | reads the app in the canvas: components from React's tree, sizes, props, specs, the CSS as written, assets |
| `js/canvas.js` | the frame, the overlays (outlines, padding / gap hatching, redlines), modes, zoom, devices |
| `js/sidebar.js`, `js/panels.js` | the left column (lists, layers) and Inspect / History |
| `js/views.js`, `js/compare.js` | Tokens and Iterations pages; version compare (and the slow-motion clock) |
| `js/app.js` | the shell: top bar, state in the address (`#p=home&sel=…`), theme, language |
| `data/pages.js` | how each app page and state is opened (Tune settings, `?page=`, a script) — add new screens here |
| `data/index.js` | made by `tools/devmode-index.py` from the code (stamp.py runs it): components, pages, lines, CSS, tokens, Figma |
| `data/iterations.js`, `data/status.js` | the iteration record and the dev statuses (rules: skill `perasure-iteration-log`) |
| `snapshots/<id>/` | a runnable copy of each iteration (`tools/devmode-snapshot.py <id>`); git tag `devmode-<id>` |

`shared/stage.html?entry=<gallery entry>&state=<n>` draws one state of a component for the canvas; the states themselves are written
in `shared/gallery.js` / `gallery-app.js`. `shared/ps-ui/core.js` lets Dev Mode set a slower clock in pages it compares (one guarded line).

## Recording an iteration

Every change to an app page, a shared component or a motion is recorded: skill `.claude/skills/perasure-iteration-log` (Jira title
read from Jira, `v1 · YYYY-MM-DD · PHL-xxx`, "无 Jira 单号" without a ticket; snapshot, statuses, tag). The major version stays v1
until a large redesign.
