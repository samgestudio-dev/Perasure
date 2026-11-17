# Global iteration (tokens or global components changed)

Read this when the requirement changes design tokens, the number / text fonts, the header / bottom / tab bars, or another shared piece
that many pages use. First done for `v1-20261117-n1` (number font Reddit Sans, bars without progressive blur) — use it as the example.

## Before building

1. **Find the differences first and wait for the owner** (owner): Figma page vs repo — tokens (`tools/sync-tokens.py --digest` + the
   export, read only), each global component's variants (fills, bound variables, effects), and every page / component the change
   reaches in the app (grep the CSS for the token / font, map components → screens → `devmode/data/pages.js` ids). List them, list what
   the Figma page misses, ask everything open as interactive questions (AskUserQuestion), and only then change code.
2. **Tokens first, old version kept**: `sync-tokens.py`, `rem-tokens.py`, then `python3 tools/legacy-tokens.py tokens-v<previous>`
   (old CSS names and values stay usable in `tokens/legacy/<previous>.css`). Fonts and other `assets/` are never changed in place
   (old snapshots link them from the repo root): a new font set is a new file (`assets/fonts/fonts-<version>.css`) and every current
   prototype links it.

## After building, before the snapshot

3. **Check motion frame by frame** (owner): every animation that draws a changed piece (e.g. the Withdraw morph and the Credit limit
   intro for a font change). Drive it with Playwright's fake clock (`page.clock.install()`, `runFor(1000/60)` per frame), record the
   moving elements' rects every frame and screenshot every few frames; compare with the same run on the previous snapshot
   (`devmode/snapshots/<previous>/…`): no reversals or jumps that the old one didn't have, the last frame equal to the settled frame,
   and the settled glyphs where the unsplit text would put them.
4. **Overview pictures**: `node tools/devmode-visual.mjs diff --against <previous id> --out devmode/iterations/<id>/visual --jobs 6`
   (before the new entry is the latest, or with `--against`). It writes `report.json` and before | after | difference pictures;
   Dev Mode shows them on the iteration's page (`overview: 'iterations/<id>/'` in the entry).
5. **Developer brief** `devmode/iterations/<id>/README.md` — for developers and their AI (the MCP `get_iteration` returns it):
   what changed and why, the owner's rules in full (as rules, not just values), the token changes (from the CHANGELOG entry) and how
   to keep the old ones, every component with before → after (CSS values, props), every page, the motion checks and their results,
   what Figma still lacks, and how to verify. Entry fields: `overview`, `doc: 'devmode/iterations/<id>/README.md'`, `tokens: '<version>'`.
6. Statuses → `changed` for every page and component touched; then stamp, snapshot, commit, push — one commit is best.
