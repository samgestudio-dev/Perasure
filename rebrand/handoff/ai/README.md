# PeraSure rebrand — visual hand-off for phi_h5_025 (read this first)

**For:** the developers of `phi_h5_025` and their AI coding assistant.
**What:** every *visual* change of the PeraSure rebrand, expressed against the production code, plus the token mapping.
**Baseline:** GitLab `business_delivery_ph/phi_h5_025`, branch `master`, commit **`0d9bdd4`** (2026-11-23). Every `current` value and `line` in this package was read from that commit; every `currentAfterStep0` / `lineAfterStep0` was computed by running step 0 on it.
**Design source:** Figma `kYyNV2MgxvH1w9bJ46A3yx` (pages *Design - Rebranding*, *Component - Rebranding*) and the rebrand demo (`samgestudio-dev/Perasure`, branch `tokens/rebrand-v3`). Rebrand tokens: **v2026.11.23**.
**Written:** 2026-11-24. Supersedes `rebrand/DEV-HANDOFF.md` and `rebrand/tokens/MAPPING.md` (2026-11-19, tokens v2).
**Owner decisions:** the design owner answered the open questions on 2026-11-24 (`OPEN-QUESTIONS.md` → "Decided 2026-11-24"); they are applied here.
**Proven (after the owner decisions, 2026-11-24):** the whole package was applied with `tools/apply.py --step all` to a clean copy of `0d9bdd4`: 548 edits applied plus the 3 step-0 operations, 2 edits already done by step 0, 2 manual, 2 skipped, **0 anchor-missing**; `npm run build` passes; `npm test` 927 / 927 pass.

## Scope — read carefully

- **In scope: purely visual changes.** Colour, typeface, font size / weight / tracking, radius, shadow, blur, spacing and position, icons, illustrations, animation colours.
- **Out of scope:** component structure, props, behaviour, flows, business logic, copy (except where listed as a visual copy fix). Do **not** restructure components to apply this. Where a look cannot be reached without a small structural hook, the edit is `manual` or marked `needsOwner` and listed in `OPEN-QUESTIONS.md`.
- **Two exceptions, owner-approved (2026-11-24),** marked `structural: "owner-approved"` in the edit list: the Home tab icons become a masked `<span>` that takes `currentColor` (E023 + E542, `BottomNavigation`), and the Home payment button carries `data-overdue` for the red overdue look (E543 + E400, `HomeComposite`). Nothing else changes markup.
- Things deliberately left out are listed in `03-design-intent/excluded.md` (e.g. the coupon selection logic, which is still being redesigned).

## One source of truth (precedence)

**`02-changes/changes-by-file.json` > `01-tokens/token-map.json` > `01-tokens/unresolved.md`.**
The token map is the file-wide default that step 0 applies with sed. Every place that needs file context is an edit in `changes-by-file.json`, made after step 0 and anchored on the renamed text, so where both touch a line the edit wins. That includes every use of the 41 undefined names (`unresolved.md` §6) and of the 4 removed names still in use (`--color-warning-300`, `--color-alpha-blue-20/40/50`): they are **not** part of step 0, and `unresolved.md` / `token-map.json` name the edit id and the same value.

## Apply order (do it in this order)

| Step | What | Where |
|---|---|---|
| 0 | **Tokens** (file-wide, mechanical; details below) | `01-tokens/` |
| 1 | **Global edits** (`global.css` fonts / caret, the boot splash in `index.html`; no focus ring) | `02-changes/changes-by-file.json`, `applyGroup` "1 …" |
| 2 | **App shell and shared controls** (header / bottom bars, sheets, buttons, inputs, toasts, loaders) | group "2 …" |
| 3 | **Components and features** | group "3 …" |
| 4 | **Pages** | group "4 …" |
| 5 | **Animations drawn in code** (coin / dots colours, the credit-increase iframe), then the asset files | group "5 …", then `04-assets/` |
| 6 | **Copy characters** that are part of the visual work (non-breaking hyphens) | group "6 …" |
| 7 | **Tests** that pin old token names, fonts or values (below) | group "7 …" |
| 8 | **Clean-up:** remove stale `var(--x, fallback)` fallbacks (122 of them differ from the real value; `06-production-audit/hardcoded.json`) | — |
| 9 | **Verify** with the checklist below | — |

### The reference script

`tools/apply.py` (Python 3.8+, standard library only) does steps 0–7 exactly as described here:

```sh
python3 rebrand/handoff/ai/tools/apply.py <path-to-phi_h5_025> --step all        # or --step 0, 1 … 7
python3 rebrand/handoff/ai/tools/apply.py <repo> --step all --dry-run             # report only
python3 rebrand/handoff/ai/tools/apply.py <repo> --skip-owner-items               # leave needsOwner edits out (default: include, with the package's value)
```

It reports every edit as `applied`, `already-done`, `anchor-missing`, `manual` or `skipped` (exit code 1 if anything is missing), writes `<repo>/rebrand-apply-report.json` (`--report` to move it; delete it before committing), and writes only under `src/`, `tests/` and `index.html`. It is idempotent: a second run reports everything as already done. An AI or a person can apply the package by hand instead; the script is the reference for what "applied" means. `tools/render_changes_md.py` regenerates `02-changes/changes-by-file.md` from the JSON.

### Step 0 in detail (tokens)

Run from the root of `phi_h5_025`, with `H` pointing at this folder (`H=…/rebrand/handoff/ai`). The commands work with BSD sed (macOS) and GNU sed. The order matters.

**0.0 — delete the local `--gradient-modal-backdrop` (before the seds).** `src/styles/global.css` lines 50–54 define their own `--gradient-modal-backdrop`. If the seds ran first they would rename it to a local `--gradient-scrim` declared on `html`, which silently overrides the token's navy scrim everywhere. Check, then delete:

```sh
sed -n '50,54p' src/styles/global.css     # must print exactly the 5 lines "--gradient-modal-backdrop: linear-gradient( … );"
sed -i.bak '50,54d' src/styles/global.css && rm src/styles/global.css.bak
```

(This is edit E005 in the change list, marked `doneByStep0`. All `global.css` line numbers below line 54 move up by 5 after it: that is why the edits carry `lineAfterStep0`.)

**0.1 — rename variable references** (`rename.sed`: 183 pure renames; `rename-value-changes.sed`: 178 renames that also change the value; `removed-literals.sed`: 31 removed letter-spacing variables → their literal), on every CSS / SCSS / TS / TSX file under `src/`:

```sh
find src -type f \( -name '*.css' -o -name '*.scss' -o -name '*.ts' -o -name '*.tsx' \) -print0 \
  | xargs -0 sed -E -i.bak -f "$H/01-tokens/rename.sed" -f "$H/01-tokens/rename-value-changes.sed" -f "$H/01-tokens/removed-literals.sed"
find src -name '*.bak' -delete
```

One pass with the three `-f` files gives the same result as three passes in that order (checked). Running it twice changes nothing (no new name is also an old name).

**0.2 — overwrite the token file.** Production's `src/styles/figma-tokens.css` is generated by `scripts/figma_tokens_to_css.py` from `tokens/figma-tokens.json` and starts with a "Generated … do not edit by hand" header. Replace the whole file with the rebrand set, keeping that convention with a new generated header (`01-tokens/figma-tokens.header.css`):

```sh
{ cat "$H/01-tokens/figma-tokens.header.css"; tail -n +5 "$H/01-tokens/rebrand-tokens.css"; } > src/styles/figma-tokens.css
```

- Use **`01-tokens/rebrand-tokens.css` (px) only.** Production is px and its PostCSS step (`scripts/postcss_px_to_rem.cjs`) converts to rem at build time; `rebrand-tokens-rem.css` is the PeraSure prototypes' rem override and is not for production (`unresolved.md` §7).
- `tail -n +5` drops the rebrand file's own 4-line comment, which tells prototypes to "link assets/fonts/fonts-2026.11.17.css": **do not** link that sheet. Production already self-hosts Hanken Grotesk: keep the `@font-face` for `'Hanken Grotesk'` in `src/styles/global.css` (lines 12–18, `/fonts/hanken-grotesk/HankenGrotesk-Variable.woff2`, weights 300–900); the Inter (lines 4–10) and Satoshi (lines 20–34) `@font-face` rules are deleted by edits E007 / E006, the iframe copies in `baked-heap.css` (lines 1–18) by edit E497; the Hanken one there (lines 19–24) stays.
- `tokens/figma-tokens.json` still holds the legacy tokens: **do not run `npm run figma:tokens` / `figma:sync`** until it carries the rebrand set (or point the generator at the rebrand tokens), or it writes the old file back. The global.css `@import './figma-tokens.css'` stays as it is.
- The rebrand file has two known issues: `--duration-*` are emitted in px and `--easing-*` as quoted strings; don't use those two groups until fixed (`unresolved.md` §7). Production has no motion tokens, so nothing maps onto them.

### Steps 1–7: the edit list

`02-changes/changes-by-file.json` (readable copy: `changes-by-file.md`, generated from it): 128 files, 554 edits — 525 replace, 17 insert, 7 delete, 2 manual, 2 skip, 1 token-step. 56 are still `needsOwner` (`conflicts.md`); 35 carry `decided: "2026-11-24 <letter>"` (the owner's answers), 4 of them `structural: "owner-approved"`. Each edit has an `id` (E001…E555; E002, the former focus ring, was removed).

- **Anchor on `currentAfterStep0`, at `lineAfterStep0`.** `current` / `line` are the baseline text and line (for reference); after step 0 they may differ (renamed variables, global.css −5). If `currentAfterStep0` is not at `lineAfterStep0`, stop and report that edit; do not guess.
- **Work in the listed order.** Files go by group; inside a file the edits are bottom-up (descending line, an insert before any other edit on its anchor line), so every `lineAfterStep0` stays valid while you go down the list and no edit changes the anchor of a later one.
- **replace**: replace the first occurrence of `currentAfterStep0` in the line(s) starting at `lineAfterStep0` with `target` (both exact text, may span lines). `replaceAll: true` (coin SVG strings): replace every occurrence on that line; `expectedCount` says how many.
- **insert**: `anchor` (= `currentAfterStep0`) is exact text starting at `lineAfterStep0`; add `target` — complete line(s), indentation included — directly after the anchor's last line. `selector` names the rule, or the new rule when the target is one.
- **delete**: `currentAfterStep0` is the exact full text of the lines to remove, starting at `lineAfterStep0`.
- **manual** (2): not scriptable; follow `instruction` (E285 / E286 icon `filter` chains). E023 (tab icon) is now a normal `replace` (owner-approved structural edit). **skip** (2): E066 / E067 on `src/components/ui/Button/index.tsx`, a dead Tailwind component. **token-step** (E001): done by step 0.2.
- `doneByStep0: true` (E001, E005): step 0 already did it.
- `targetToken` is the rebrand token the target renders and always exists in `01-tokens/rebrand-tokens.css`; in files that cannot read the token CSS (`index.html` boot splash, the CreditIncreaseIntro iframe material, SVG strings in TS) the target is that token's literal value. The only other variables in targets are production's own `--app-safe-area-top` / `--app-header-content-height`.

### Step 7: tests

After steps 0–6, 8 of production's 927 tests fail because they pin the old look. Group 7 (18 edits, E524–E541) updates them; with it, `npm test` passes 927 / 927.

| Test (file:line of the `test(`) | Fails on | New expectation (edit) |
|---|---|---|
| `credit ring reflects updated available shares…` (`tests/credit-progress-ring.test.ts:18`), `零额度空态显示完整淡色圆环…` (:33), `credit ring bounds invalid…` (:48) | used-arc `opacity: 0.4` — edit E093 makes the hub ring track white 10 % (`strokeOpacity` 0.4 → 0.1, C-096) | `opacity: 0.1` on lines 21, 29, 36, 40, 44, 57 (E536–E541) |
| `composite Home isolates credit loading…` (`tests/user-status-display.test.ts:797`) | expects `--color-text-negative-light` on the overdue date | `--fg-danger-muted` (line 860, E535) |
| `active and expired credit cards share the final Home glow treatment` (:993) | expects `background: var(--color-brand-600` on the expired card | `background: var\(--gradient-brand-card\)` (line 1016, E534; owner decision B) |
| `money typography uses self-hosted Satoshi…` (:1123) | expects the Satoshi `@font-face` and font files, `'Satoshi'` families, `--line-height-body-md` | renamed `…uses Hanken Grotesk (--font-family-number)…`; asserts no `/fonts/satoshi/` in global.css and the Hanken `@font-face`; `var(--font-family-number)`; `var(--font-line-height-body-md)` (E527–E533) |
| `Figma font-weight tokens stay unitless CSS numbers` (:1256) | expects literal `--font-weight-bold: 700;` etc. | the rebrand file defines them as aliases: accepts `700` or `var(--font-weight-700)` (line 1274, E526) |
| `withdraw amount guidance stays in the amount panel…` (:1548) | expects `--line-height-body-md, 20px` | `var(--font-line-height-body-md)` (lines 1578, 1582, E524–E525) |

(After step 0 alone, 3 of them fail: the overdue-date and expired-card name checks and the font-weight test. The other 5 fail once steps 1–6 are in: the Satoshi and withdraw-typography tests and the 3 ring tests, after E093.)

## Files

| Path | Format | What |
|---|---|---|
| `README.md` | md | this file |
| `OPEN-QUESTIONS.md` | md | the owner's decisions of 2026-11-24 and what is still open (only the 12 production pieces without a design) |
| `manifest.json` | json | machine index of this package (baseline, files, schemas, apply order, precedence) |
| `tools/apply.py` | python | the reference applier (steps 0–7, report JSON) |
| `tools/render_changes_md.py` | python | regenerates `02-changes/changes-by-file.md` from the JSON |
| `01-tokens/token-map.json` | json | one row per production token: `old`, `oldValue`, `category`, `new`, `newValue`, `kind` (same / renamed / value-changed / renamed+value-changed / removed), `confidence` (exact / inferred), `alternative`, `replacement` (removed rows), `note` |
| `01-tokens/token-map.md` | md | the same as tables per category |
| `01-tokens/new-tokens.json` | json | rebrand tokens production does not have yet that the new look needs (scrim, glass, nav gradients, check-on, button-navy, text-style classes) |
| `01-tokens/rename.sed`, `rename-value-changes.sed`, `removed-literals.sed`, `rename.json` | sed / json | step 0.1 (`rename.json` = the two rename lists as JSON) |
| `01-tokens/rebrand-tokens.css` | css | the complete rebrand token set (v2026.11.23), px — step 0.2 |
| `01-tokens/figma-tokens.header.css` | css | the generated-file header step 0.2 puts on `src/styles/figma-tokens.css` |
| `01-tokens/rebrand-tokens-rem.css` | css | rem lengths for the PeraSure prototypes — **not for production** |
| `01-tokens/unresolved.md` | md | mapping judgement calls; §4 removed names and §6 undefined names with the edit ids that fix them |
| `02-changes/changes-by-file.json` | json | **the edit list** (schema in `manifest.json`): `{meta, files[]}`; per file `file`, `component`, `kind`, `applyGroup`, `edits[]` |
| `02-changes/changes-by-file.md` | md | the same, one section per file, in apply order (generated) |
| `02-changes/conflicts.md` | md | every edit marked *needs owner confirmation*, with the value used and the alternative |
| `03-design-intent/visual-changes.json` | json | the design's own list of 251 visual changes (ids `G-` global, `C-` component, `P-` page), with Figma node ids and the owner decision behind each — the *why* behind `changeId` |
| `03-design-intent/visual-changes.md` | md | the same, readable |
| `03-design-intent/excluded.md` | md | what is not visual and therefore not here |
| `04-assets/assets-to-replace.json` | json | production asset → rebrand asset or recolour (fonts, animations drawn in code, icons, logos, illustrations); file swaps are not done by `apply.py` |
| `04-assets/assets-changed.json` | json | the design-side asset changes (source of the above) |
| `04-assets/files/` | files | the asset files referenced (Hanken Grotesk variable font, recoloured coin and loading-dots animations, new and recoloured icons, images), at their design-repo paths |
| `05-coverage/coverage.json` | json | (a) design changes with no production counterpart (demo-only: coupons, "due today" stage, face camera …), (b) production components the design does not cover explicitly — `token map only` or `needs design` |
| `06-production-audit/` | json / md | the scan of production this package is built on: all tokens and their usage, every hard-coded visual value, every component, every asset; `SUMMARY.md` lists production bugs found on the way (opacity tokens in px, 41 undefined names, stale fallbacks, unused Tailwind) |

## Global rules (the design intent in one place)

These come from `03-design-intent/visual-changes.json` (ids in brackets). When an edit seems odd, check the rule.

1. **Palette.** The logo colours replace the app's blue: every legacy brand blue becomes the green at the same step; red (danger) stays; navy `#000128` (`--bg-brand`) is the dark brand surface and the primary text colour. The neutral grey scale no longer exists in the rebrand set (see OPEN-QUESTIONS 1).
2. **One typeface: Hanken Grotesk** for everything — body, titles and amounts. Inter and Satoshi go away (`--font-family-number` = Hanken Grotesk, weight 700 and the Amount tracking of rule 12 for emphasised amounts).
3. **Header and bottom bars:** no progressive blur. Primary pages (Home / Payment / Account) use `--gradient-top-nav-filled` / `--gradient-bottom-primary-nav-filled`; secondary pages a solid page-colour header and `--gradient-bottom-secondary-nav-filled`. Glass buttons and the tab-bar pill keep their own backdrop blur.
4. **Bottom distances (Android):** the primary button sits 16 px above the bottom of the webview, the tab bar 12 px, floating card sheets 8 px; iOS adds the safe-area inset on top (`env(safe-area-inset-bottom)` stays).
5. **Sheets:** plain and card sheets use the gradient scrim (`--gradient-scrim`); full-page sheets use the flat scrim (`--overlay-scrim`, navy 40 %).
6. **Toasts:** 8 px under the top nav bar on every page (primary pages: under the in-webview bar; secondary pages: under the native bar, i.e. at the top of the webview + 8).
7. **Loader and loan-submitting:** coin + dots centred in the visible screen; loan submitting sits 24 px above the middle and its coin never moves when the text wraps.
8. **Coin and loading dots:** dark green `#298648` with a `#5CD680` highlight (was blue).
9. **Splash:** navy to the screen edges (no light band under the status bar).
10. **Primary button:** green fill with a navy label; the "Pay … now" button on Home's payment card is navy with a white label and no outline, and red (`--button-destructive-*`) when the payment is overdue (`button[data-overdue='true']`).
11. **Brand cards (owner, 2026-11-24):** the home credit card, the application state card and the Home state card (expired / error) take `--gradient-brand-card` (Figma Gradient/Brand-card), like the credit-limit hub card; diversion / partner cards stay flat `--bg-brand`.
12. **Amount tracking (owner, 2026-11-24):** emphasised amounts (`--font-family-number`, weight 700) use Figma's Amount tracking by size: xxl 48 / xl 36 `0.04em`, lg 32 `0.03em`, md 24 `0.02em`, sm 18 `0.03em`, xs 16 `0.02em`.
13. **Focus (owner, 2026-11-24):** no focus ring is added; production keeps its no-outline rule. The text caret is `--fg-accent`.
14. **Tab bar:** the active tab's icon and label are `--fg-accent`, inactive `--fg-default` (icons painted with `currentColor` through a CSS mask).

## Verify (checklist)

- [ ] `tools/apply.py` report (or your own record): 0 `anchor-missing`; the 2 `manual` edits (E285, E286) decided or left on purpose.
- [ ] `npm run build` passes and `npm test` passes (927 / 927 at `0d9bdd4` + this package).
- [ ] No `var(--…)` name from `01-tokens/token-map.json` with `kind` ≠ `same` / `value-changed` is left in `src/` (except deliberate fallbacks), and no name from `unresolved.md` §6.
- [ ] No hard-coded legacy blue (`#2c74be`, `#2b74bd`, Tailwind blues) remains; `06-production-audit/hardcoded.json` lists every colour literal to re-check.
- [ ] Only Hanken Grotesk is loaded and used (no Inter, Satoshi, Nunito Sans, Roboto, Arial Black in computed styles); `public/fonts/inter` and `public/fonts/satoshi` removed per `04-assets/assets-to-replace.json`.
- [ ] Owner decisions of 2026-11-24 applied (they are in the edit list); the remaining open item (12 pieces without a design) left as is.
- [ ] Screens checked side by side with the Figma frames named in `03-design-intent/visual-changes.json` (`figmaNode`), at 360 and 390 px wide, Android WebView and iOS.

## Notes for the AI applying this

- Anchor on `currentAfterStep0` at `lineAfterStep0` (after step 0, in the listed order). If it is not there, stop and report the edit id instead of guessing; `current` is only the baseline text before step 0.
- If your branch is newer than `0d9bdd4`, run `tools/apply.py --dry-run` first: it searches ±40 lines and reports an edit it can't place unambiguously as `anchor-missing`.
- Never change a component's structure or behaviour to apply a visual edit, apart from the four `structural: "owner-approved"` edits (E023, E542, E543, E400); `manual` edits and `OPEN-QUESTIONS.md` list the other places where that would be needed.
- Prefer tokens over literals; every `targetToken` exists in `01-tokens/rebrand-tokens.css`.
