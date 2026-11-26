# Updating tokens

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** you sync tokens from Figma or apply a plugin export.

## Updating tokens

`tokens/README.md` explains the pipeline. Rules for agents (they keep an update to a few thousand tokens):

- Never read `tokens/figma-export.json`, `tokens.json`, `tokens.css`, `digest.json` or the whole `CHANGELOG.md` into
  context, and never use `get_variable_defs` / `get_metadata` / `get_design_context` to read tokens. The scripts
  print a short summary; work from that.
- **Owner attached a plugin export** (`perasure-tokens-*.json`):
  `python3 tools/sync-tokens.py <file> --message-out /tmp/msg.txt`.
- **Sync straight from Figma** (file `OBsvf42AiRapcRrasD7KNm`):
  1. `python3 tools/sync-tokens.py --digest` → one line of JSON.
  2. `use_figma` (read-only) with `code` = the full text of `tools/figma-tokens/core.js` followed by
     `return await psMcp(<that JSON>, 0);`.
  3. `{"unchanged":true}` → tell the owner nothing changed; stop. Otherwise save the result verbatim to a scratch
     file; if it says `"parts": N` with N > 1, run step 2 again with part 1 … N−1 and save each.
  4. `python3 tools/sync-tokens.py part0.json [part1.json …] --message-out /tmp/msg.txt`.
- Then run `python3 tools/rem-tokens.py` (it remakes `tokens-rem/tokens-rem.css` from the new tokens) and
  `python3 tools/legacy-tokens.py tokens-v<previous version>` — **old CSS names and values stay usable** (owner, 2026-11-17): it writes
  `tokens/legacy/<previous version>.css` with every name the update removed, renamed or gave a new value, at its old value (load it after
  tokens.css to get the old look back). Then commit `tokens/` + `tokens-rem/` with
  `/tmp/msg.txt` as the message and push to `main`. Don't tag: the *Tokens* workflow
  tags `tokens-v<version>` on push. `stamp.py` is not needed for token-only changes.
- Report the summary line and any removed / renamed CSS names (the *Developer impact* of the new
  `CHANGELOG.md` entry — read just that entry), plus the tag.
- Changing the export or hashing: edit `tools/figma-tokens/core.js` and `tools/tokenlib.py` together, run
  `python3 tools/sync-tokens.py --check`, then do one full export (`psMcp({}, …)`, all parts).
