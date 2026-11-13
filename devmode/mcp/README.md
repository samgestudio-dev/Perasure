# PeraSure Dev Mode — MCP server

Lets a developer's AI (Claude Code, Cursor, Codex, VS Code, Windsurf … anything that speaks MCP) read what PeraSure Dev Mode shows:
every app page and shared component with its source, CSS as written, tokens and their values, motion values, usage examples, Figma
nodes, statuses and iteration history — and, optionally, screenshots and live measurements. In Dev Mode: **Connect AI** in the top bar
shows the same steps; **Copy for AI** in the right panel copies an instruction with the link to what is selected.

One file ([`server.mjs`](server.mjs)), no dependencies, Node 18+, MCP over stdio. It reads the live Dev Mode
(`https://samgestudio-dev.github.io/Perasure/`); run from inside a clone of this repo it reads the clone's files instead.

## Set up

```sh
# 1. download (macOS / Linux; Windows: Invoke-WebRequest <url> -OutFile $HOME\.perasure\devmode-mcp.mjs)
mkdir -p ~/.perasure && curl -fsSL https://samgestudio-dev.github.io/Perasure/devmode/mcp/server.mjs -o ~/.perasure/devmode-mcp.mjs

# 2. add it to your AI tool
claude mcp add perasure-devmode -s user -- node ~/.perasure/devmode-mcp.mjs       # Claude Code
codex mcp add perasure-devmode -- node ~/.perasure/devmode-mcp.mjs                # Codex (or ~/.codex/config.toml, below)

# 3. check it
node ~/.perasure/devmode-mcp.mjs --check

# 4. optional: screenshots and live measurements (about 150 MB)
npm install -g playwright && npx playwright install chromium
```

Cursor (`~/.cursor/mcp.json`) and most other tools:

```json
{ "mcpServers": { "perasure-devmode": { "command": "node", "args": ["/Users/<you>/.perasure/devmode-mcp.mjs"] } } }
```

Codex `~/.codex/config.toml`:

```toml
[mcp_servers.perasure-devmode]
command = "node"
args = ["/Users/<you>/.perasure/devmode-mcp.mjs"]
```

To update, download it again (`get_overview` and `--check` say when a newer one is published).
Settings (environment): `PERASURE_SOURCE=remote` always reads the live site; `PERASURE_ROOT=<folder>` reads a local clone;
`PERASURE_DEVMODE_URL` another copy of the site.

## Tools

| Tool | What it gives |
|---|---|
| `get_overview` | versions, page sections, component files, statuses, how to use the tools |
| `resolve_devmode_link` | everything behind a Dev Mode link (page, selected layer, component, version, comparison) — what **Copy for AI** sends |
| `list_pages` / `get_page` | pages and sheets; how to open one (link + script), its states, source code, components, Figma, history |
| `list_components` / `get_component` | shared components; description, props, states, usage examples (the gallery entry), source, CSS as written, tokens with values, motion, assets, Figma, pages, history (`sections` to ask for less) |
| `get_component_code` | just the JS source and CSS rules, at a version |
| `get_tokens` | design tokens: raw value, resolved value, rem; by words, category or names |
| `get_motion` | `PS.MT`: springs, tweens, press, rises, menus — with their rules |
| `list_iterations` / `get_iteration` / `get_changes` | the iteration record; what changed between two versions, by component and page |
| `get_status` | Ready for dev / Changed / Completed |
| `search` | pages, components, tokens and iterations at once |
| `get_screenshot` | PNG of a page (state) or a component state; can outline a component (needs Playwright) |
| `get_live_specs` | a component measured as it renders: size, padding and gaps with the token the CSS uses, radius, fill, stroke, shadow, text, the layers inside, matching CSS rules (needs Playwright) |

Every tool takes `version` (an iteration id) where it makes sense: older versions are read from their git tag `devmode-<id>` or
snapshot. All tools only read.

## For whoever changes Dev Mode

`server.mjs` reads `devmode/data/*.js` (the same files the platform loads), `tokens/tokens.css`, `shared/ps-ui/*`, `shared/gallery*.js`,
and for live measurements injects `devmode/js/inspector.js` into the page. When one of those formats changes, update the server in the
same commit, raise `VERSION` in it (people then see that a newer one is published) and run
`node devmode/mcp/server.mjs --check` plus a tools call (any MCP client, or pipe JSON-RPC lines into it).
