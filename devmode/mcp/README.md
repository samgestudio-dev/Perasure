# PeraSure Dev Mode — MCP server

Lets a developer's AI (Claude Code, Cursor, Codex, VS Code, Windsurf … anything that speaks MCP) read what PeraSure Dev Mode shows:
every app page and shared component with its source, CSS as written, tokens and their values, motion values, usage examples, Figma
nodes, statuses and iteration history. In Dev Mode: **Connect AI** in the top bar shows the steps with the address and token filled in;
**Copy for AI** in the right panel copies an instruction with the link to what is selected.

## Hosted (what developers use)

`https://samge.studio/perasure/devmode/mcp` — MCP over Streamable HTTP, nothing to install, always the newest code on GitHub
(`worker/index.js`; guide `worker/README.md`). It needs the header `Authorization: Bearer <token>`; Connect AI shows the token once you
are signed in to Dev Mode.

```sh
claude mcp add -s user --transport http perasure-devmode https://samge.studio/perasure/devmode/mcp --header "Authorization: Bearer <token>"
```

Cursor (`~/.cursor/mcp.json`) and most other tools:

```json
{ "mcpServers": { "perasure-devmode": { "url": "https://samge.studio/perasure/devmode/mcp", "headers": { "Authorization": "Bearer <token>" } } } }
```

Codex `~/.codex/config.toml`:

```toml
[mcp_servers.perasure-devmode]
url = "https://samge.studio/perasure/devmode/mcp"
http_headers = { Authorization = "Bearer <token>" }
```

## Local (inside a clone, for screenshots and live measurements)

[`server.mjs`](server.mjs): the same tools over stdio, reading the clone's files, plus `get_screenshot`, `qa_compare` and `get_live_specs`
when Playwright is installed (`npm install -g playwright && npx playwright install chromium`, about 150 MB).

```sh
claude mcp add perasure-devmode-local -s user -- node /path/to/Perasure/devmode/mcp/server.mjs
node devmode/mcp/server.mjs --check
```

`PERASURE_ROOT=<folder>` reads another clone.

## Tools

| Tool | What it gives |
|---|---|
| `get_overview` | versions, page sections, component files, statuses, how to use the tools |
| `resolve_devmode_link` | everything behind a Dev Mode link (page, selected layer, component, version, comparison, notes from Annotate) — what **Copy for AI** sends |
| `list_pages` / `get_page` | pages and sheets; how to open one (link + script), its states, source code, components, Figma, history |
| `list_components` / `get_component` | shared components; description, props, states, usage examples (the gallery entry), source, CSS as written, tokens with values, motion, assets, Figma, pages, history (`sections` to ask for less) |
| `get_component_code` | just the JS source and CSS rules, at a version |
| `get_tokens` | design tokens: raw value, resolved value, rem; by words, category or names |
| `get_motion` | `PS.MT`: springs, tweens, press, rises, menus — with their rules |
| `list_iterations` / `get_iteration` / `get_changes` | the iteration record; what changed between two versions, by component and page |
| `get_status` | Ready for dev / Changed / Completed |
| `get_visual_changes` | the latest visual check: what changed since the latest iteration but isn't recorded, where it starts, picture links |
| `find_by_figma` | a Figma link (or node id) → the PS components and pages built from it |
| `search` | pages, components, tokens and iterations at once |
| `get_screenshot` · `qa_compare` · `get_live_specs` | **local server only** (need Playwright): a page or component state as a PNG; your implementation's screenshot vs the demo with a difference picture; a component measured as it renders. They take `device` (360 / 390 / 430), `fit` (cap, rem, fit, scale) and `text` (85–200 %) |

Every tool takes `version` (an iteration id) where it makes sense: older versions are read from their git tag `devmode-<id>` or
snapshot. All tools only read.

## For whoever changes Dev Mode

- [`core.mjs`](core.mjs) holds every tool both servers share (no Node or Cloudflare APIs); [`server.mjs`](server.mjs) adds stdio and the
  browser tools; `worker/index.js` adds HTTP, the token and GitHub reads; [`local.mjs`](local.mjs) reads `devmode/data/*.js` in Node
  (also for `tools/devmode-mcp-data.mjs`, which publishes them as JSON for the Worker).
- They read `devmode/data/*.js` (the same files the platform loads), `tokens/tokens.css`, `shared/ps-ui/*`, `shared/gallery*.js`, and
  for live measurements inject `devmode/js/inspector.js`. When one of those formats changes, update `core.mjs` in the same commit, raise
  `VERSION` there and run `node devmode/mcp/server.mjs --check` plus a tools call. `pagesFrom()` in `core.mjs` mirrors `url()` in
  `devmode/data/pages.js`: change them together. A change to `core.mjs` or `worker/` is deployed by the *Dev Mode live* workflow.
