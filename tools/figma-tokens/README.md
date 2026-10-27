# Figma side of the token pipeline

`core.js` reads the Figma file's local variables and styles into the snapshot format (`tokens/figma-export.json`)
and hashes them (`psDigest`) exactly as `tools/tokenlib.py` does. It is used two ways:

- **`plugin/`** — the *PeraSure Tokens Export* development plugin. `plugin/code.js` is generated from `core.js` +
  `plugin/glue.js` by `tools/sync-tokens.py` (CI checks it); edit `core.js` / `glue.js`, never `code.js`.
- **Agent route** — Claude runs `core.js` through the Figma MCP `use_figma` tool (see *Updating tokens* in `CLAUDE.md`).

## Install the plugin (once, Figma desktop app)

1. Download this folder's `plugin/` files (`manifest.json`, `code.js`, `ui.html`) into a folder on your computer —
   or clone the repo.
2. In Figma: **Plugins → Development → Import plugin from manifest…** and pick `plugin/manifest.json`.
3. Open the PeraSure design system file and run **Plugins → Development → PeraSure Tokens Export**.

The plugin only reads the file. It shows the counts and which groups changed since the version in the repo, then:
**Download export** (a `.json`), **Copy JSON**, or **Open GitHub upload** (the `tokens/inbox` upload page).
After a pull, re-import nothing: Figma reloads `code.js` from the same folder.

## Keeping the two sides identical

`psCanon` / `psHash` (JS) and `canon` / `fnv` (Python) must give the same strings and hashes. Both sort object keys,
drop `undefined`, write numbers the way JavaScript does, and hash UTF-16 code units with FNV-1a 32-bit. Every
sync verifies it: a patch or plugin export carries Figma's digest, and `sync-tokens.py` stops if its own differs.
If you change the record shape in `psExport`, change nothing else — do one full export afterwards so the snapshot
matches the new shape.
