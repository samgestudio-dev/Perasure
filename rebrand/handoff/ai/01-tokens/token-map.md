# Production → PeraSure rebrand: design-token map

- **From:** `phi_h5_025` master `0d9bdd4`: `src/styles/figma-tokens.css` (690 variables, generated from `tokens/figma-tokens.json`) and `src/styles/global.css` (1 design token, `--gradient-modal-backdrop`).
- **To:** PeraSure `tokens/tokens.css` **v2026.11.23** (branch `tokens/rebrand-v3`, git tag `tokens-v2026.11.23`). Note: the current file is v2026.11.23, not v2026.11.21; v2026.11.23 only *adds* 22 names (info tone, `check-on-*`, `slider-knob-center`, `palette-blue-*`), nothing was renamed or removed since 2026.11.21.
- Machine-readable: `token-map.json` (one row per production token), `new-tokens.json`, `rename.json`, `rename.sed`, `rename-value-changes.sed`, `removed-literals.sed`. Open questions: `unresolved.md`.
- Every `new` name was checked by script against `tokens.css`; `new value` is resolved through the `var()` chain.

## Counts

| kind | rows | meaning |
|---|---:|---|
| same | 164 | same name, equivalent value |
| renamed | 183 | new name, equivalent value (pure rename) |
| value-changed | 16 | same name, new value |
| renamed+value-changed | 178 | new name and new value |
| removed | 150 | no successor variable; use `replacement` |
| **total** | **691** | confidence: 625 exact, 66 inferred |

Of the 150 removed rows, 96 are per-property text-style variables v3 no longer emits (`-letter-spacing`, `-paragraph-spacing`, `-text-decoration`, `-text-transform`), 32 are colour scales that no longer exist (pink, marketing, yellow, warning: all unused except `--color-warning-300` ×1), 11 are black / blue alpha.

## How to apply

Follow `../README.md` "Step 0" (or run `python3 tools/apply.py <phi_h5_025> --step 0`): it is the only description of the operation and the
order (0.0 delete the local `--gradient-modal-backdrop`, 0.1 the three seds, 0.2 overwrite `src/styles/figma-tokens.css` with
`rebrand-tokens.css`). The `removed` rows still in use, the undefined names of `unresolved.md` §6 and every place where a use needs a
different token than this map gives are edits in `02-changes/changes-by-file.json`, which wins over this map. Where code uses a palette
step as *text* (`color: var(--color-brand-600)`), the edits use `--fg-accent` (green text is one tier darker), not the mapped palette step.

## Tables

Columns: production name and value → rebrand name and resolved value, kind, confidence (E = exact, I = inferred), uses in production `src/`, note. `alt` = an existing token that keeps the legacy look (see `unresolved.md`).

### color/primitive (114)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-ambient-100` | #f0f5f4 | `--palette-mist-100` | #f0f5f4 | renamed | E | 0 |  |
| `--color-ambient-200` | #eaf2f0 | `--palette-mist-200` | #e4ece9 | renamed+value-changed | E | 0 |  |
| `--color-ambient-50` | #f7faf9 | `--palette-mist-50` | #f7faf9 | renamed | E | 0 |  |
| `--color-blue-100` | #e4f0ff | `--palette-green-100` | #daf6e2 | renamed+value-changed | I | 0 | Owner rule: legacy blue-100 -> the green at the same step (v2 green-100); v3 re-bound v2 green-100 to green-100 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-100 instead. |
| `--color-blue-200` | #c8deff | `--palette-green-200` | #baeec9 | renamed+value-changed | I | 0 | Owner rule: legacy blue-200 -> the green at the same step (v2 green-200); v3 re-bound v2 green-200 to green-200 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-200 instead. |
| `--color-blue-300` | #9fc6fa | `--palette-green-200` | #baeec9 | renamed+value-changed | I | 0 | Owner rule: legacy blue-300 -> the green at the same step (v2 green-300); v3 re-bound v2 green-300 to green-200 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-300 instead. alt: `--palette-green-300` (#8de2a6). |
| `--color-blue-400` | #74b2f5 | `--palette-green-300` | #8de2a6 | renamed+value-changed | I | 0 | Owner rule: legacy blue-400 -> the green at the same step (v2 green-400); v3 re-bound v2 green-400 to green-300 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-400 instead. alt: `--palette-green-400` (#76dc93). |
| `--color-blue-50` | #f3f8ff | `--palette-green-50` | #effbf2 | renamed+value-changed | I | 0 | Owner rule: legacy blue-50 -> the green at the same step (v2 green-50); v3 re-bound v2 green-50 to green-50 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-50 instead. |
| `--color-blue-500` | #3fa0f0 | `--palette-green-400` | #76dc93 | renamed+value-changed | I | 0 | Owner rule: legacy blue-500 -> the green at the same step (v2 green-500); v3 re-bound v2 green-500 to green-400 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-500 instead. alt: `--palette-green-500` (#5cd680). |
| `--color-blue-600` | #2c74be | `--palette-green-500` | #5cd680 | renamed+value-changed | I | 0 | Owner rule: legacy blue-600 -> the green at the same step (v2 green-600); v3 re-bound v2 green-600 to green-500 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-600 instead. alt: `--palette-green-600` (#36a65b). |
| `--color-blue-700` | #20558d | `--palette-green-700` | #298648 | renamed+value-changed | I | 0 | Owner rule: legacy blue-700 -> the green at the same step (v2 green-700); v3 re-bound v2 green-700 to green-700 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-700 instead. |
| `--color-blue-800` | #173d67 | `--palette-green-800` | #1d6334 | renamed+value-changed | I | 0 | Owner rule: legacy blue-800 -> the green at the same step (v2 green-800); v3 re-bound v2 green-800 to green-800 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-800 instead. |
| `--color-blue-900` | #102950 | `--palette-green-900` | #144322 | renamed+value-changed | I | 1 | Owner rule: legacy blue-900 -> the green at the same step (v2 green-900); v3 re-bound v2 green-900 to green-900 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-900 instead. |
| `--color-blue-950` | #000128 | `--palette-navy-900` | #000128 | renamed | E | 0 |  |
| `--color-brand-100` | #e4f0ff | `--palette-green-100` | #daf6e2 | renamed+value-changed | I | 0 | Owner rule: legacy blue-100 -> the green at the same step (v2 green-100); v3 re-bound v2 green-100 to green-100 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-100 instead. |
| `--color-brand-200` | #c8deff | `--palette-green-200` | #baeec9 | renamed+value-changed | I | 3 | Owner rule: legacy blue-200 -> the green at the same step (v2 green-200); v3 re-bound v2 green-200 to green-200 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-200 instead. |
| `--color-brand-300` | #9fc6fa | `--palette-green-200` | #baeec9 | renamed+value-changed | I | 0 | Owner rule: legacy blue-300 -> the green at the same step (v2 green-300); v3 re-bound v2 green-300 to green-200 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-300 instead. alt: `--palette-green-300` (#8de2a6). |
| `--color-brand-400` | #74b2f5 | `--palette-green-300` | #8de2a6 | renamed+value-changed | I | 2 | Owner rule: legacy blue-400 -> the green at the same step (v2 green-400); v3 re-bound v2 green-400 to green-300 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-400 instead. alt: `--palette-green-400` (#76dc93). |
| `--color-brand-50` | #f3f8ff | `--palette-green-50` | #effbf2 | renamed+value-changed | I | 0 | Owner rule: legacy blue-50 -> the green at the same step (v2 green-50); v3 re-bound v2 green-50 to green-50 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-50 instead. |
| `--color-brand-500` | #3fa0f0 | `--palette-green-400` | #76dc93 | renamed+value-changed | I | 5 | Owner rule: legacy blue-500 -> the green at the same step (v2 green-500); v3 re-bound v2 green-500 to green-400 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-500 instead. alt: `--palette-green-500` (#5cd680). |
| `--color-brand-600` | #2c74be | `--palette-green-500` | #5cd680 | renamed+value-changed | I | 29 | Owner rule: legacy blue-600 -> the green at the same step (v2 green-600); v3 re-bound v2 green-600 to green-500 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-600 instead. alt: `--palette-green-600` (#36a65b). |
| `--color-brand-700` | #20558d | `--palette-green-700` | #298648 | renamed+value-changed | I | 2 | Owner rule: legacy blue-700 -> the green at the same step (v2 green-700); v3 re-bound v2 green-700 to green-700 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-700 instead. |
| `--color-brand-800` | #173d67 | `--palette-green-800` | #1d6334 | renamed+value-changed | I | 1 | Owner rule: legacy blue-800 -> the green at the same step (v2 green-800); v3 re-bound v2 green-800 to green-800 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-800 instead. |
| `--color-brand-900` | #102950 | `--palette-green-900` | #144322 | renamed+value-changed | I | 0 | Owner rule: legacy blue-900 -> the green at the same step (v2 green-900); v3 re-bound v2 green-900 to green-900 (v3-map.json green_direct_binding_to). The 11.21 CSV maps by name to green-900 instead. |
| `--color-brand-950` | #000128 | `--palette-navy-900` | #000128 | renamed | E | 2 |  |
| `--color-green-100` | #ddf8ee | `--palette-green-100` | #daf6e2 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-green-200` | #bdf1dd | `--palette-green-200` | #baeec9 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-green-300` | #97e9c7 | `--palette-green-200` | #baeec9 | renamed+value-changed | I | 0 | Legacy green keeps its step; v2 green-300 is v3 green-200 (v3-map.json). The 11.21 CSV maps by name to green-300. alt: `--palette-green-300` (#8de2a6). |
| `--color-green-400` | #73e1b1 | `--palette-green-300` | #8de2a6 | renamed+value-changed | I | 0 | Legacy green keeps its step; v2 green-400 is v3 green-300 (v3-map.json). The 11.21 CSV maps by name to green-400. alt: `--palette-green-400` (#76dc93). |
| `--color-green-50` | #f3fcf9 | `--palette-green-50` | #effbf2 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-green-500` | #58e09a | `--palette-green-400` | #76dc93 | renamed+value-changed | I | 2 | Legacy green keeps its step; v2 green-500 is v3 green-400 (v3-map.json). The 11.21 CSV maps by name to green-500. alt: `--palette-green-500` (#5cd680). |
| `--color-green-600` | #3bcb84 | `--palette-green-500` | #5cd680 | renamed+value-changed | I | 0 | Legacy green keeps its step; v2 green-600 is v3 green-500 (v3-map.json). The 11.21 CSV maps by name to green-600. alt: `--palette-green-600` (#36a65b). |
| `--color-green-700` | #2eae6e | `--palette-green-700` | #298648 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-green-800` | #1f9158 | `--palette-green-800` | #1d6334 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-green-900` | #145f3a | `--palette-green-900` | #144322 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-green-950` | #0a3321 | `--palette-green-950` | #0b2c15 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-marketing-100` | #fce7ef | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-200` | #f9c2d9 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-300` | #f48fb5 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-400` | #e8528f | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-50` | #fdf2f6 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-500` | #d93a78 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-600` | #b82a61 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-marketing-700` | #8c1f49 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-negative-100` | #ffe0e2 | `--palette-red-100` | #ffe0e2 | renamed | E | 1 |  |
| `--color-negative-200` | #ffbfc3 | `--palette-red-200` | #ffbfc3 | renamed | E | 2 |  |
| `--color-negative-300` | #ff9099 | `--palette-red-300` | #ff9099 | renamed | E | 0 |  |
| `--color-negative-400` | #ff5560 | `--palette-red-400` | #ff5560 | renamed | E | 0 |  |
| `--color-negative-50` | #fff5f5 | `--palette-red-50` | #fff5f5 | renamed | E | 0 |  |
| `--color-negative-500` | #ff0d19 | `--palette-red-500` | #ff0d19 | renamed | E | 1 |  |
| `--color-negative-600` | #e00010 | `--palette-red-600` | #e00010 | renamed | E | 3 |  |
| `--color-negative-700` | #b8000d | `--palette-red-700` | #b8000d | renamed | E | 0 |  |
| `--color-negative-800` | #8c000a | `--palette-red-800` | #8c000a | renamed | E | 0 |  |
| `--color-negative-900` | #5e0007 | `--palette-red-900` | #5e0007 | renamed | E | 0 |  |
| `--color-negative-950` | #330004 | `--palette-red-950` | #330004 | renamed | E | 0 |  |
| `--color-neutral-0` | #ffffff | `--palette-base-white` | #ffffff | renamed | E | 5 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-100` | #e0e3e5 | `--palette-navy-100` | #ebebee | renamed+value-changed | E | 2 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-150` | #cdd1d4 | `--palette-navy-200` | #d6d6dd | renamed+value-changed | E | 16 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-200` | #bac0c4 | `--palette-navy-300` | #b2b3be | renamed+value-changed | E | 1 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-300` | #97a0a6 | `--palette-navy-400` | #8a8a9c | renamed+value-changed | E | 1 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-400` | #7d878e | `--palette-navy-400` | #8a8a9c | renamed+value-changed | E | 0 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-50` | #f2f3f4 | `--palette-navy-50` | #f5f5f6 | renamed+value-changed | E | 6 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-500` | #6a757d | `--palette-navy-500` | #61627a | renamed+value-changed | E | 2 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-600` | #55606a | `--palette-navy-500` | #61627a | renamed+value-changed | E | 1 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-700` | #3c4850 | `--palette-navy-600` | #3d3e5c | renamed+value-changed | E | 1 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-800` | #26323a | `--palette-navy-700` | #1f1f42 | renamed+value-changed | E | 0 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-900` | #141e24 | `--palette-navy-900` | #000128 | renamed+value-changed | E | 0 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-neutral-950` | #0a1219 | `--palette-navy-950` | #00011a | renamed+value-changed | E | 25 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-pink-100` | #fce7ef | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-200` | #f9c2d9 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-300` | #f48fb5 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-400` | #e8528f | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-50` | #fdf2f6 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-500` | #d93a78 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-600` | #b82a61 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-pink-700` | #8c1f49 | — | — | removed | E | 0 | Pink/Marketing scale removed in v2 with no successor. If a screen still needs it, keep the literal hex locally and ask design. |
| `--color-positive-100` | #ddf8ee | `--palette-green-100` | #daf6e2 | renamed+value-changed | E | 1 | Legacy green keeps its step. |
| `--color-positive-200` | #bdf1dd | `--palette-green-200` | #baeec9 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-positive-300` | #97e9c7 | `--palette-green-200` | #baeec9 | renamed+value-changed | I | 0 | Legacy green keeps its step; v2 green-300 is v3 green-200 (v3-map.json). The 11.21 CSV maps by name to green-300. alt: `--palette-green-300` (#8de2a6). |
| `--color-positive-400` | #73e1b1 | `--palette-green-300` | #8de2a6 | renamed+value-changed | I | 0 | Legacy green keeps its step; v2 green-400 is v3 green-300 (v3-map.json). The 11.21 CSV maps by name to green-400. alt: `--palette-green-400` (#76dc93). |
| `--color-positive-50` | #f3fcf9 | `--palette-green-50` | #effbf2 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-positive-500` | #58e09a | `--palette-green-400` | #76dc93 | renamed+value-changed | I | 0 | Legacy green keeps its step; v2 green-500 is v3 green-400 (v3-map.json). The 11.21 CSV maps by name to green-500. alt: `--palette-green-500` (#5cd680). |
| `--color-positive-600` | #3bcb84 | `--palette-green-500` | #5cd680 | renamed+value-changed | I | 1 | Legacy green keeps its step; v2 green-600 is v3 green-500 (v3-map.json). The 11.21 CSV maps by name to green-600. alt: `--palette-green-600` (#36a65b). |
| `--color-positive-700` | #2eae6e | `--palette-green-700` | #298648 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-positive-800` | #1f9158 | `--palette-green-800` | #1d6334 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-positive-900` | #145f3a | `--palette-green-900` | #144322 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-positive-950` | #0a3321 | `--palette-green-950` | #0b2c15 | renamed+value-changed | E | 0 | Legacy green keeps its step. |
| `--color-red-100` | #ffe0e2 | `--palette-red-100` | #ffe0e2 | renamed | E | 0 |  |
| `--color-red-200` | #ffbfc3 | `--palette-red-200` | #ffbfc3 | renamed | E | 0 |  |
| `--color-red-300` | #ff9099 | `--palette-red-300` | #ff9099 | renamed | E | 0 |  |
| `--color-red-400` | #ff5560 | `--palette-red-400` | #ff5560 | renamed | E | 0 |  |
| `--color-red-50` | #fff5f5 | `--palette-red-50` | #fff5f5 | renamed | E | 0 |  |
| `--color-red-500` | #ff0d19 | `--palette-red-500` | #ff0d19 | renamed | E | 0 |  |
| `--color-red-600` | #e00010 | `--palette-red-600` | #e00010 | renamed | E | 0 |  |
| `--color-red-700` | #b8000d | `--palette-red-700` | #b8000d | renamed | E | 0 |  |
| `--color-red-800` | #8c000a | `--palette-red-800` | #8c000a | renamed | E | 0 |  |
| `--color-red-900` | #5e0007 | `--palette-red-900` | #5e0007 | renamed | E | 0 |  |
| `--color-red-950` | #330004 | `--palette-red-950` | #330004 | renamed | E | 0 |  |
| `--color-warning-100` | #ffecc2 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-warning-200` | #ffd98a | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-warning-300` | #ffbe45 | → `var(--fg-accent)` | — | removed | E | 1 | Applied by changes-by-file edit E058 (src/components/ui/PageLoading/index.module.css:74), needsOwner. Yellow/Warning removed with no successor; the third loading dot takes --fg-accent so the dots are one colour (owner may prefer a light green such as --bg-accent-muted-pressed). Not orange: --fg-attention means time pressure. |
| `--color-warning-400` | #f59e0b | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-warning-50` | #fff7e8 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-warning-500` | #d98e0a | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-warning-600` | #c27a07 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-warning-700` | #a66205 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-100` | #ffecc2 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-200` | #ffd98a | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-300` | #ffbe45 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m). The loading dot (PageLoading .dot_warning) -> --bg-accent-muted-pressed or --bg-muted (open decision). |
| `--color-yellow-400` | #f59e0b | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-50` | #fff7e8 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-500` | #d98e0a | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-600` | #c27a07 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |
| `--color-yellow-700` | #a66205 | — | — | removed | E | 0 | Yellow/Warning removed with no successor. Do not alias to orange (--fg-attention is time pressure, not warning; DEV-HANDOFF 2g/2m).  |

### color/text (18)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-text-brand-default` | #2c74be | `--fg-accent` | #298648 | renamed+value-changed | E | 37 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-text-brand-heavy` | #20558d | `--fg-accent-strong` | #1d6334 | renamed+value-changed | E | 2 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-text-brand-light` | #3fa0f0 | `--fg-accent` | #298648 | renamed+value-changed | E | 12 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-text-disabled` | #97a0a6 | `--fg-disabled` | #8a8a9c | renamed+value-changed | E | 22 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-text-inverse` | #ffffff | `--fg-on-emphasis` | #ffffff | renamed | E | 59 | Merged with other legacy names into one v3 role. |
| `--color-text-link-default` | #2c74be | `--fg-link` | #298648 | renamed+value-changed | E | 7 |  |
| `--color-text-link-heavy` | #20558d | `--fg-link-pressed` | #1d6334 | renamed+value-changed | E | 0 |  |
| `--color-text-link-light` | #3fa0f0 | `--fg-accent` | #298648 | renamed+value-changed | E | 0 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-text-negative-default` | #e00010 | `--fg-danger` | #e00010 | renamed | E | 6 | Merged with other legacy names into one v3 role. |
| `--color-text-negative-heavy` | #b8000d | `--fg-danger-strong` | #b8000d | renamed | E | 3 | Merged with other legacy names into one v3 role. |
| `--color-text-negative-light` | #ff0d19 | `--fg-danger-muted` | #ff0d19 | renamed | E | 15 | Merged with other legacy names into one v3 role. |
| `--color-text-placeholder` | #7d878e | `--fg-placeholder` | #8a8a9c | renamed+value-changed | E | 39 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-text-positive-default` | #3bcb84 | `--fg-success` | #298648 | renamed+value-changed | E | 2 | Merged with other legacy names into one v3 role. |
| `--color-text-positive-heavy` | #2eae6e | `--fg-success-strong` | #1d6334 | renamed+value-changed | E | 1 | Merged with other legacy names into one v3 role. |
| `--color-text-positive-light` | #58e09a | `--fg-accent-on-brand` | #5cd680 | renamed+value-changed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-text-primary` | #141e24 | `--fg-default` | #000128 | renamed+value-changed | E | 208 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-text-secondary` | #3c4850 | `--fg-muted` | #3d3e5c | renamed+value-changed | E | 93 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-text-tertiary` | #6a757d | `--fg-subtle` | #61627a | renamed+value-changed | E | 96 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |

### color/icon (15)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-icon-brand-default` | #2c74be | `--fg-accent` | #298648 | renamed+value-changed | E | 22 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-icon-brand-heavy` | #20558d | `--fg-accent-strong` | #1d6334 | renamed+value-changed | E | 0 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-icon-brand-light` | #3fa0f0 | `--fg-accent` | #298648 | renamed+value-changed | E | 2 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-icon-disabled` | #97a0a6 | `--fg-disabled` | #8a8a9c | renamed+value-changed | E | 2 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-icon-inverse` | #ffffff | `--fg-on-emphasis` | #ffffff | renamed | E | 19 | Merged with other legacy names into one v3 role. |
| `--color-icon-negative-default` | #e00010 | `--fg-danger` | #e00010 | renamed | E | 1 | Merged with other legacy names into one v3 role. |
| `--color-icon-negative-heavy` | #b8000d | `--fg-danger-strong` | #b8000d | renamed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-icon-negative-light` | #ff0d19 | `--fg-danger-muted` | #ff0d19 | renamed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-icon-placeholder` | #7d878e | `--fg-placeholder` | #8a8a9c | renamed+value-changed | E | 1 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-icon-positive-default` | #3bcb84 | `--fg-success` | #298648 | renamed+value-changed | E | 1 | Merged with other legacy names into one v3 role. |
| `--color-icon-positive-heavy` | #2eae6e | `--fg-success-strong` | #1d6334 | renamed+value-changed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-icon-positive-light` | #58e09a | `--fg-accent-on-brand` | #5cd680 | renamed+value-changed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-icon-primary` | #141e24 | `--fg-default` | #000128 | renamed+value-changed | E | 10 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-icon-secondary` | #3c4850 | `--fg-muted` | #3d3e5c | renamed+value-changed | E | 8 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-icon-tertiary` | #6a757d | `--fg-subtle` | #61627a | renamed+value-changed | E | 10 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |

### color/surface (25)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-surface-card-brand` | #2c74be | `--bg-brand` | #000128 | renamed+value-changed | I | 4 | Legacy blue-600 surface. v3 maps it to navy --bg-brand; the step rule gives green (#5cd680). DEV-HANDOFF 2p left it open. If green, white text on it must become --fg-on-accent. alt: `--bg-accent-emphasis` (#5cd680). |
| `--color-surface-card-brand-subtle` | #f3f8ff | `--bg-accent-subtle` | #effbf2 | renamed+value-changed | E | 5 |  |
| `--color-surface-card-default` | #ffffff | `--bg-default` | #ffffff | renamed | E | 134 |  |
| `--color-surface-card-muted` | #e0e3e5 | `--bg-muted` | #ebebee | renamed+value-changed | E | 3 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-surface-card-negative` | #e00010 | `--bg-danger-emphasis` | #e00010 | renamed | E | 2 | Merged with other legacy names into one v3 role. |
| `--color-surface-card-negative-subtle` | #fff5f5 | `--bg-danger-muted` | #fff5f5 | renamed | E | 2 |  |
| `--color-surface-card-positive` | #3bcb84 | `--bg-success-emphasis` | #5cd680 | renamed+value-changed | E | 2 | Merged with other legacy names into one v3 role. |
| `--color-surface-card-positive-subtle` | #f3fcf9 | `--bg-success-subtle` | #effbf2 | renamed+value-changed | E | 1 |  |
| `--color-surface-elevated-default` | #ffffff | `--bg-default` | #ffffff | renamed | E | 0 |  |
| `--color-surface-elevated-glass` | #ffffff99 | `--bg-glass` | rgb(255 255 255 / 0.8) | renamed+value-changed | I | 24 | Production glass is white 60%; v3 --bg-glass is white 80%. --bg-glass-subtle keeps 60%. alt: `--bg-glass-subtle` (rgb(255 255 255 / 0.6)). |
| `--color-surface-elevated-glass-blue` | #ffffff99 | `--bg-glass-subtle` | rgb(255 255 255 / 0.6) | renamed | E | 0 |  |
| `--color-surface-icon-brand-default` | #2c74be | `--bg-brand` | #000128 | renamed+value-changed | I | 4 | Legacy blue-600 icon disc. v3 maps it to navy --bg-brand; the step rule gives green. Selected checks use --control-checked-bg / --check-on-* instead (DEV-HANDOFF 2o). alt: `--bg-accent-emphasis` (#5cd680). |
| `--color-surface-icon-brand-disabled` | #9fc6fa | `--bg-success-disabled` | #baeec9 | renamed+value-changed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-surface-icon-inverse-default` | #ffffff | `--bg-default` | #ffffff | renamed | E | 1 | Merged with other legacy names into one v3 role. |
| `--color-surface-icon-inverse-disabled` | #e0e3e5 | `--bg-disabled` | #ebebee | renamed+value-changed | E | 0 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-surface-icon-negative-default` | #e00010 | `--bg-danger-emphasis` | #e00010 | renamed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-surface-icon-negative-disabled` | #ff9099 | `--bg-danger-disabled` | #ff9099 | renamed | E | 0 |  |
| `--color-surface-icon-neutral-default` | #f2f3f4 | `--bg-subtle` | #f5f5f6 | renamed+value-changed | E | 0 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-surface-icon-neutral-disabled` | #97a0a6 | `--bg-neutral-emphasis` | #8a8a9c | renamed+value-changed | E | 0 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-surface-icon-positive-default` | #3bcb84 | `--bg-success-emphasis` | #5cd680 | renamed+value-changed | E | 2 | Merged with other legacy names into one v3 role. |
| `--color-surface-icon-positive-disabled` | #97e9c7 | `--bg-success-disabled` | #baeec9 | renamed+value-changed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-surface-inset-default` | #f0f5f4 | `--bg-inset` | #f0f5f4 | renamed | E | 28 |  |
| `--color-surface-page-default` | #f0f5f4 | `--bg-page` | #f0f5f4 | renamed | E | 73 |  |
| `--color-surface-page-heavy` | #eaf2f0 | `--bg-page-strong` | #e4ece9 | renamed+value-changed | E | 0 | Ambient-200 #eaf2f0 -> Mist-200 #e4ece9 (Mist 200-400 adjusted in v3). |
| `--color-surface-page-light` | #f7faf9 | `--bg-page-subtle` | #f7faf9 | renamed | E | 2 |  |

### color/action (20)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-action-bg-inverse` | #ffffff | `--bg-default` | #ffffff | renamed | E | 13 | Merged with other legacy names into one v3 role. |
| `--color-action-bg-positive-default` | #3bcb84 | `--bg-success-emphasis` | #5cd680 | renamed+value-changed | E | 3 | Merged with other legacy names into one v3 role. |
| `--color-action-bg-positive-disabled` | #97e9c7 | `--bg-success-disabled` | #baeec9 | renamed+value-changed | E | 0 | Merged with other legacy names into one v3 role. |
| `--color-action-bg-positive-pressed` | #2eae6e | `--bg-success-emphasis-pressed` | #36a65b | renamed+value-changed | E | 0 |  |
| `--color-action-bg-positive-subtle` | #ddf8ee | `--bg-success-muted` | #daf6e2 | renamed+value-changed | E | 0 |  |
| `--color-action-bg-positive-subtle-pressed` | #bdf1dd | `--bg-success-muted-pressed` | #baeec9 | renamed+value-changed | E | 0 |  |
| `--color-action-bg-primary-default` | #2c74be | `--bg-accent-emphasis` | #5cd680 | renamed+value-changed | E | 64 |  |
| `--color-action-bg-primary-disabled` | #e0e3e5 | `--bg-disabled` | #ebebee | renamed+value-changed | E | 10 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-action-bg-primary-pressed` | #20558d | `--bg-accent-emphasis-pressed` | #36a65b | renamed+value-changed | E | 8 |  |
| `--color-action-bg-primary-subtle` | #e4f0ff | `--bg-accent-muted` | #daf6e2 | renamed+value-changed | E | 7 |  |
| `--color-action-bg-primary-subtle-pressed` | #c8deff | `--bg-accent-muted-pressed` | #baeec9 | renamed+value-changed | E | 0 |  |
| `--color-action-stroke-active` | #3fa0f0 | `--border-selected` | #76dc93 | renamed+value-changed | E | 13 | Merged with other legacy names into one v3 role. |
| `--color-action-stroke-active-subtle` | #9fc6fa | `--border-selected-muted` | #baeec9 | renamed+value-changed | E | 1 |  |
| `--color-action-stroke-default` | #e0e3e5 | `--border-muted` | #d6d6dd | renamed+value-changed | E | 7 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-action-stroke-filled` | #e4f0ff | `--border-accent-subtle` | #daf6e2 | renamed+value-changed | E | 1 |  |
| `--color-action-text-brand` | #2c74be | `--fg-accent` | #298648 | renamed+value-changed | E | 7 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-action-text-default` | #ffffff | `--fg-on-accent` | #000128 | renamed+value-changed | I | 8 | White label on the primary (green) button becomes navy (owner rule exception). Where this token sits on a non-green fill (danger, navy, dark surfaces) use --fg-on-emphasis (white) instead. alt: `--fg-on-emphasis` (#ffffff). |
| `--color-action-text-disabled` | #97a0a6 | `--fg-disabled` | #8a8a9c | renamed+value-changed | E | 7 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-action-text-link` | #3fa0f0 | `--fg-accent` | #298648 | renamed+value-changed | E | 3 | Blue text/icon -> green text tier (green-700, heavy -> 800; green text is one tier darker for contrast). Merged with other legacy names into one v3 role. |
| `--color-action-text-positive` | #3bcb84 | `--fg-success` | #298648 | renamed+value-changed | E | 1 | Merged with other legacy names into one v3 role. |

### color/border (13)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-stroke-brand-default` | #3fa0f0 | `--border-selected` | #76dc93 | renamed+value-changed | E | 13 | Merged with other legacy names into one v3 role. |
| `--color-stroke-brand-strong` | #2c74be | `--border-accent-emphasis` | #5cd680 | renamed+value-changed | E | 0 |  |
| `--color-stroke-brand-subtle` | #c8deff | `--border-accent-muted` | #baeec9 | renamed+value-changed | E | 5 |  |
| `--color-stroke-default` | #bac0c4 | `--border-default` | #b2b3be | renamed+value-changed | E | 11 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-stroke-divider` | #e0e3e5 | `--border-muted` | #d6d6dd | renamed+value-changed | E | 6 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |
| `--color-stroke-negative-default` | #ff0d19 | `--border-danger` | #ff0d19 | renamed | E | 2 |  |
| `--color-stroke-negative-strong` | #e00010 | `--border-danger-emphasis` | #e00010 | renamed | E | 0 |  |
| `--color-stroke-negative-subtle` | #ffbfc3 | `--border-danger-muted` | #ffbfc3 | renamed | E | 1 |  |
| `--color-stroke-positive-default` | #58e09a | `--border-success` | #76dc93 | renamed+value-changed | E | 1 |  |
| `--color-stroke-positive-strong` | #3bcb84 | `--border-success-emphasis` | #5cd680 | renamed+value-changed | E | 0 |  |
| `--color-stroke-positive-subtle` | #bdf1dd | `--border-success-muted` | #baeec9 | renamed+value-changed | E | 0 |  |
| `--color-stroke-strong` | #97a0a6 | `--border-emphasis` | #8a8a9c | renamed+value-changed | E | 1 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). |
| `--color-stroke-subtle` | #e0e3e5 | `--border-muted` | #d6d6dd | renamed+value-changed | E | 37 | Neutral grey -> navy-tinted step (decision 42, 2026-11-21: navy replaces the neutral scale). Merged with other legacy names into one v3 role. |

### component/tag (18)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--tag-color-brand-bg-default` | #e4f0ff | `--tag-accent-bg` | #daf6e2 | renamed+value-changed | E | 0 |  |
| `--tag-color-brand-bg-subtle` | #f3f8ff | `--tag-accent-bg-subtle` | #effbf2 | renamed+value-changed | E | 0 |  |
| `--tag-color-brand-stroke-default` | #c8deff | `--tag-accent-border` | #76dc93 | renamed+value-changed | I | 1 | Legacy blue-200; step rule gives green-200 (#baeec9); v3 tag-accent-border is green-400. alt: `--border-accent-muted` (#baeec9). |
| `--tag-color-brand-text-default` | #3fa0f0 | `--tag-accent-fg` | #1d6334 | renamed+value-changed | I | 2 | Legacy blue-500 text; v3 tag-accent-fg is green-800 (green text on a green tint uses 800, v3-map.json). fg-accent is green-700. alt: `--fg-accent` (#298648). |
| `--tag-color-negative-bg-default` | #ffe0e2 | `--tag-danger-bg` | #ffe0e2 | renamed | E | 0 |  |
| `--tag-color-negative-bg-subtle` | #fff5f5 | `--tag-danger-bg-subtle` | #fff5f5 | renamed | E | 0 |  |
| `--tag-color-negative-stroke-default` | #ffbfc3 | `--tag-danger-border` | #ff0d19 | renamed+value-changed | I | 0 | Legacy red-200; v3 tag-danger-border is red-500. border-danger-muted keeps red-200. alt: `--border-danger-muted` (#ffbfc3). |
| `--tag-color-negative-text-default` | #ff0d19 | `--tag-danger-fg` | #b8000d | renamed+value-changed | I | 3 | Legacy red-500; v3 tag-danger-fg is red-700 (contrast). fg-danger-muted keeps red-500. alt: `--fg-danger-muted` (#ff0d19). |
| `--tag-color-neutral-bg-alpha` | #ffffff | `--tag-neutral-bg-alpha` | #ffffff | renamed | E | 28 |  |
| `--tag-color-neutral-bg-default` | #e0e3e5 | `--tag-neutral-bg` | #ebebee | renamed+value-changed | E | 6 |  |
| `--tag-color-neutral-bg-inverse` | #ffffff | `--tag-neutral-bg-inverse` | #ffffff | renamed | E | 0 |  |
| `--tag-color-neutral-bg-subtle` | #f2f3f4 | `--tag-neutral-bg-subtle` | #f5f5f6 | renamed+value-changed | E | 0 |  |
| `--tag-color-neutral-stroke-default` | #cdd1d4 | `--tag-neutral-border` | #8a8a9c | renamed+value-changed | I | 2 | Legacy neutral-150; v3 tag-neutral-border is navy-400 (much darker). border-muted keeps the step (navy-200). alt: `--border-muted` (#d6d6dd). |
| `--tag-color-neutral-text-default` | #6a757d | `--tag-neutral-fg` | #3d3e5c | renamed+value-changed | I | 11 | Legacy neutral-500; v3 tag-neutral-fg is navy-600 (tag text >= 4.5:1, ARCHITECTURE.md). fg-subtle keeps the step (navy-500). alt: `--fg-subtle` (#61627a). |
| `--tag-color-positive-bg-default` | #ddf8ee | `--tag-success-bg` | #daf6e2 | renamed+value-changed | E | 0 |  |
| `--tag-color-positive-bg-subtle` | #f3fcf9 | `--tag-success-bg-subtle` | #effbf2 | renamed+value-changed | E | 0 |  |
| `--tag-color-positive-stroke-default` | #bdf1dd | `--tag-success-border` | #76dc93 | renamed+value-changed | I | 0 | Legacy green-200; v3 tag-success-border is green-400. border-success-muted keeps green-200. alt: `--border-success-muted` (#baeec9). |
| `--tag-color-positive-text-default` | #58e09a | `--tag-success-fg` | #1d6334 | renamed+value-changed | I | 0 | Legacy green-500 text (low contrast); v3 tag-success-fg is green-800. fg-success is green-700. alt: `--fg-success` (#298648). |

### color/alpha (40)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-alpha-bg-default` | #00292166 | `--bg-neutral-alpha` | rgb(0 1 40 / 0.4) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-bg-emphasis` | #00292199 | `--bg-neutral-alpha-strong` | rgb(0 1 40 / 0.6) | renamed+value-changed | E | 2 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-bg-minimum` | #0029210f | `--bg-neutral-alpha-subtle` | rgb(0 1 40 / 0.06) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-bg-subtle` | #00292133 | `--bg-neutral-alpha-muted` | rgb(0 1 40 / 0.2) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-black-12` | #0000001f | → `--palette-alpha-navy-12` | rgb(0 1 40 / 0.12) | removed | I | 0 | Black alpha deleted in v3 (shadows and scrims are navy-tinted). Use navy at the same alpha, or color-mix(in srgb, var(--palette-base-black) N%, transparent) for exact parity. |
| `--color-alpha-black-16` | #00000029 | → `--palette-alpha-navy-16` | rgb(0 1 40 / 0.16) | removed | I | 0 | Black alpha deleted in v3 (shadows and scrims are navy-tinted). Use navy at the same alpha, or color-mix(in srgb, var(--palette-base-black) N%, transparent) for exact parity. |
| `--color-alpha-black-20` | #00000033 | → `--palette-alpha-navy-20` | rgb(0 1 40 / 0.2) | removed | I | 0 | Black alpha deleted in v3 (shadows and scrims are navy-tinted). Use navy at the same alpha, or color-mix(in srgb, var(--palette-base-black) N%, transparent) for exact parity. |
| `--color-alpha-black-6` | #0000000f | → `--palette-alpha-navy-6` | rgb(0 1 40 / 0.06) | removed | I | 0 | Black alpha deleted in v3 (shadows and scrims are navy-tinted). Use navy at the same alpha, or color-mix(in srgb, var(--palette-base-black) N%, transparent) for exact parity. |
| `--color-alpha-black-8` | #00000014 | → `--palette-alpha-navy-8` | rgb(0 1 40 / 0.08) | removed | I | 0 | Black alpha deleted in v3 (shadows and scrims are navy-tinted). Use navy at the same alpha, or color-mix(in srgb, var(--palette-base-black) N%, transparent) for exact parity. |
| `--color-alpha-blue-0` | #3fa0f000 | → `color-mix(in srgb, var(--bg-success) 0%, transparent)` | — | removed | I | 0 | Unused in production. Same rule as the used blue alphas: blue-500 at 0% -> green-400 (--bg-success) at 0%. |
| `--color-alpha-blue-20` | #3fa0f033 | → `color-mix(in srgb, var(--bg-success) 20%, transparent)` | — | removed | I | 1 | Applied by changes-by-file edit E192 (src/pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:151). No green alpha in v3: blue-500 at N% -> green-400 (--bg-success = --palette-green-400) at N%. |
| `--color-alpha-blue-40` | #3fa0f066 | → `var(--elevation-knob) (the whole box-shadow of the captcha thumb)` | — | removed | I | 1 | Applied by changes-by-file edit E189 (src/pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:193), needsOwner. No green alpha in v3; the blue glow under the captcha thumb becomes the navy knob elevation (C-050). |
| `--color-alpha-blue-50` | #3fa0f080 | → `color-mix(in srgb, var(--bg-success) 50%, transparent)` | — | removed | I | 1 | Applied by changes-by-file edit E191 (src/pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:179). No green alpha in v3: blue-500 at N% -> green-400 (--bg-success = --palette-green-400) at N%. |
| `--color-alpha-blue-60` | #3fa0f099 | → `color-mix(in srgb, var(--bg-success) 60%, transparent)` | — | removed | I | 0 | Unused in production. Same rule as the used blue alphas: blue-500 at 60% -> green-400 (--bg-success) at 60%. |
| `--color-alpha-blue-80` | #3fa0f0cc | → `color-mix(in srgb, var(--bg-success) 80%, transparent)` | — | removed | I | 0 | Unused in production. Same rule as the used blue alphas: blue-500 at 80% -> green-400 (--bg-success) at 80%. |
| `--color-alpha-cold-bg-default` | #00012833 | `--bg-neutral-alpha-muted` | rgb(0 1 40 / 0.2) | renamed | E | 1 |  |
| `--color-alpha-cold-bg-subtle` | #0001280f | `--bg-neutral-alpha-subtle` | rgb(0 1 40 / 0.06) | renamed | E | 2 |  |
| `--color-alpha-cold-black-12` | #0001281f | `--palette-alpha-navy-12` | rgb(0 1 40 / 0.12) | renamed | E | 0 |  |
| `--color-alpha-cold-black-16` | #00012829 | `--palette-alpha-navy-16` | rgb(0 1 40 / 0.16) | renamed | E | 1 |  |
| `--color-alpha-cold-black-20` | #00012833 | `--palette-alpha-navy-20` | rgb(0 1 40 / 0.2) | renamed | E | 0 |  |
| `--color-alpha-cold-black-6` | #0001280f | `--palette-alpha-navy-6` | rgb(0 1 40 / 0.06) | renamed | E | 0 |  |
| `--color-alpha-cold-black-8` | #00012814 | `--palette-alpha-navy-8` | rgb(0 1 40 / 0.08) | renamed | E | 1 |  |
| `--color-alpha-green-12` | #0029211f | `--palette-alpha-navy-12` | rgb(0 1 40 / 0.12) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-green-16` | #00292129 | `--palette-alpha-navy-16` | rgb(0 1 40 / 0.16) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-green-20` | #00292133 | `--palette-alpha-navy-20` | rgb(0 1 40 / 0.2) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-green-40` | #00292166 | `--palette-alpha-navy-40` | rgb(0 1 40 / 0.4) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-green-6` | #0029210f | `--palette-alpha-navy-6` | rgb(0 1 40 / 0.06) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-green-60` | #00292199 | `--palette-alpha-navy-60` | rgb(0 1 40 / 0.6) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-green-8` | #00292114 | `--palette-alpha-navy-8` | rgb(0 1 40 / 0.08) | renamed+value-changed | E | 0 | Deep green #002921 alpha -> navy #000128 alpha (same alpha). |
| `--color-alpha-grey-0` | #e1e4e500 | `--palette-alpha-navy-100-0` | rgb(235 235 238 / 0) | renamed+value-changed | E | 0 |  |
| `--color-alpha-grey-20` | #e1e4e533 | `--palette-alpha-navy-100-20` | rgb(235 235 238 / 0.2) | renamed+value-changed | E | 0 |  |
| `--color-alpha-grey-40` | #e1e4e566 | `--palette-alpha-navy-100-40` | rgb(235 235 238 / 0.4) | renamed+value-changed | E | 0 |  |
| `--color-alpha-grey-60` | #e1e4e599 | `--palette-alpha-navy-100-60` | rgb(235 235 238 / 0.6) | renamed+value-changed | E | 0 |  |
| `--color-alpha-grey-80` | #e1e4e5cc | `--palette-alpha-navy-100-80` | rgb(235 235 238 / 0.8) | renamed+value-changed | E | 0 |  |
| `--color-alpha-white-0` | #ffffff00 | `--palette-alpha-white-0` | rgb(255 255 255 / 0) | renamed | E | 0 |  |
| `--color-alpha-white-20` | #ffffff33 | `--palette-alpha-white-20` | rgb(255 255 255 / 0.2) | renamed | E | 0 |  |
| `--color-alpha-white-40` | #ffffff66 | `--palette-alpha-white-40` | rgb(255 255 255 / 0.4) | renamed | E | 0 |  |
| `--color-alpha-white-50` | #ffffff80 | `--palette-alpha-white-50` | rgb(255 255 255 / 0.5) | renamed | E | 0 |  |
| `--color-alpha-white-60` | #ffffff99 | `--palette-alpha-white-60` | rgb(255 255 255 / 0.6) | renamed | E | 2 |  |
| `--color-alpha-white-80` | #ffffffcc | `--palette-alpha-white-80` | rgb(255 255 255 / 0.8) | renamed | E | 2 |  |

### color/overlay (1)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-overlay-scrim-default` | #00000033 | `--overlay-scrim` | rgb(0 1 40 / 0.4) | renamed+value-changed | I | 2 | Production scrim is black 20%; v3 --overlay-scrim is navy 40% (twice as dark). Navy 20% keeps the strength. alt: `--palette-alpha-navy-20` (rgb(0 1 40 / 0.2)). |

### color/shadow (7)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-shadow-backdrop` | #00012814 | `--shadow-backdrop` | rgb(0 1 40 / 0.08) | renamed | E | 20 |  |
| `--color-shadow-default-1` | #00012829 | `--shadow-default-1` | rgb(0 1 40 / 0.16) | renamed | E | 12 |  |
| `--color-shadow-default-2` | #00012814 | `--shadow-default-2` | rgb(0 1 40 / 0.08) | renamed | E | 12 |  |
| `--color-shadow-focus-1` | #00012829 | `--shadow-focus-1` | rgb(0 1 40 / 0.16) | renamed | E | 0 |  |
| `--color-shadow-focus-2` | #0001281f | `--shadow-focus-2` | rgb(0 1 40 / 0.12) | renamed | E | 0 |  |
| `--color-shadow-subtle-1` | #0001281f | `--shadow-subtle-1` | rgb(0 1 40 / 0.12) | renamed | E | 3 |  |
| `--color-shadow-subtle-2` | #0001280f | `--shadow-subtle-2` | rgb(0 1 40 / 0.06) | renamed | E | 3 |  |

### color/gradient-stop (11)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--color-gradient-default-0` | #e1e4e500 | `--gradient-neutral-0` | rgb(235 235 238 / 0) | renamed+value-changed | E | 1 | Grey #e1e4e5 -> navy-100 #ebebee at the same alpha. |
| `--color-gradient-default-20` | #e1e4e533 | `--gradient-neutral-20` | rgb(235 235 238 / 0.2) | renamed+value-changed | E | 1 | Grey #e1e4e5 -> navy-100 #ebebee at the same alpha. |
| `--color-gradient-default-40` | #e1e4e566 | `--gradient-neutral-40` | rgb(235 235 238 / 0.4) | renamed+value-changed | E | 2 | Grey #e1e4e5 -> navy-100 #ebebee at the same alpha. |
| `--color-gradient-default-60` | #e1e4e599 | `--gradient-neutral-60` | rgb(235 235 238 / 0.6) | renamed+value-changed | E | 0 | Grey #e1e4e5 -> navy-100 #ebebee at the same alpha. |
| `--color-gradient-default-80` | #e1e4e5cc | `--gradient-neutral-80` | rgb(235 235 238 / 0.8) | renamed+value-changed | E | 0 | Grey #e1e4e5 -> navy-100 #ebebee at the same alpha. |
| `--color-gradient-subtle-0` | #ffffff00 | `--gradient-white-0` | rgb(255 255 255 / 0) | renamed | E | 4 |  |
| `--color-gradient-subtle-20` | #ffffff33 | `--gradient-white-20` | rgb(255 255 255 / 0.2) | renamed | E | 0 |  |
| `--color-gradient-subtle-40` | #ffffff66 | `--gradient-white-40` | rgb(255 255 255 / 0.4) | renamed | E | 4 |  |
| `--color-gradient-subtle-50` | #ffffff80 | `--gradient-white-50` | rgb(255 255 255 / 0.5) | renamed | E | 0 |  |
| `--color-gradient-subtle-60` | #ffffff99 | `--gradient-white-60` | rgb(255 255 255 / 0.6) | renamed | E | 5 |  |
| `--color-gradient-subtle-80` | #ffffffcc | `--gradient-white-80` | rgb(255 255 255 / 0.8) | renamed | E | 0 |  |

### gradient (4)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--gradient-bottom-nav-filled` | linear-gradient(180deg, #e1e4e500 0%, #e1e4e533… | `--gradient-nav-bottom` | linear-gradient(180deg, rgb(255 255 255 / 0) 0%… | renamed+value-changed | I | 6 | Grey 0/20/40% at 0/20/100% -> white 0/60/80% at 0/40/100% (v3 Nav-bottom). On mist pages use --gradient-nav-bottom-mist. alt: `--gradient-nav-bottom-mist` (linear-gradient(180deg, rgb(240 245 244 / 0) 0%, rgb(240 245 244 / 0.6) 40%, rgb(240 245 244 / 0.8) 100%)). |
| `--gradient-glass-nav-stroke` | linear-gradient(161deg, #ffffff 0%, #ffffff00 5… | `--gradient-glass-stroke` | linear-gradient(161deg, #ffffff 0%, rgb(255 255… | renamed | E | 0 | Paint style renamed; same stops. |
| `--gradient-modal-backdrop` | linear-gradient(     to bottom,     rgba(0, 0, … | `--gradient-scrim` | linear-gradient(180deg, rgb(0 1 40 / 0) 0%, rgb… | renamed+value-changed | I | 20 | Defined in src/styles/global.css (html). Transparent -> black 20% becomes the v3 Scrim gradient (navy 0 -> 32% at 28% -> 56%), noticeably darker. |
| `--gradient-top-nav-filled` | linear-gradient(180deg, #e1e4e5cc 0%, #e1e4e566… | `--gradient-nav-top` | linear-gradient(180deg, rgb(240 245 244 / 0.8) … | renamed+value-changed | E | 4 | Grey (#e1e4e5) stops -> Mist (#f0f5f4) stops, same alphas and positions. |

### shadow/elevation (3)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--shadow-default` | 0px 0px 2px 0px #00012829, 0px 4px 12px 0px #00… | `--elevation-1` | 0px 4px 12px 0px rgb(0 1 40 / 0.08), 0px 0px 2p… | renamed | E | 4 | Effect style renamed (Shadow/Default -> Elevation). Same layers; v3 lists them in reverse order (negligible). |
| `--shadow-focus` | 0px 0px 4px 0px #00012829, 0px 8px 32px 0px #00… | `--elevation-3` | 0px 8px 32px 0px rgb(0 1 40 / 0.12), 0px 0px 4p… | renamed | E | 7 | Effect style renamed (Shadow/Focus -> Elevation). Same layers; v3 lists them in reverse order (negligible). |
| `--shadow-over` | 0px 0px 2px 0px #0001281f, 0px -4px 12px 0px #0… | `--elevation-2` | 0px -4px 12px 0px rgb(0 1 40 / 0.06), 0px 0px 2… | renamed | E | 22 | Effect style renamed (Shadow/Over -> Elevation). Same layers; v3 lists them in reverse order (negligible). |

### blur (15)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--blur-0` | 0px | `--blur-0` | 0 | same | E | 2 |  |
| `--blur-10` | 10px | `--blur-10` | 10px | same | E | 0 |  |
| `--blur-12` | 12px | `--blur-12` | 12px | same | E | 0 |  |
| `--blur-2` | 2px | `--blur-2` | 2px | same | E | 0 |  |
| `--blur-24` | 24px | `--blur-24` | 24px | same | E | 0 |  |
| `--blur-32` | 32px | `--blur-32` | 32px | same | E | 0 |  |
| `--blur-4` | 4px | `--blur-4` | 4px | same | E | 0 |  |
| `--blur-backdrop-bg` | 10px | `--blur-backdrop-bg` | 10px | same | E | 34 |  |
| `--blur-backdrop-shadow` | 24px | `--blur-backdrop-shadow` | 24px | same | E | 19 |  |
| `--blur-none` | 0px | `--blur-none` | 0 | same | E | 0 |  |
| `--blur-overlay-scrim-default` | 4px | `--blur-overlay-scrim-default` | 4px | same | E | 0 |  |
| `--blur-shadow-default-1` | 2px | `--blur-shadow-default-1` | 2px | same | E | 14 |  |
| `--blur-shadow-default-2` | 12px | `--blur-shadow-default-2` | 12px | same | E | 13 |  |
| `--blur-shadow-focus-1` | 4px | `--blur-shadow-focus-1` | 4px | same | E | 0 |  |
| `--blur-shadow-focus-2` | 32px | `--blur-shadow-focus-2` | 32px | same | E | 0 |  |

### radius (16)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--radius-0` | 0px | `--radius-0` | 0 | same | E | 0 |  |
| `--radius-12` | 12px | `--radius-12` | 12px | same | E | 0 |  |
| `--radius-16` | 16px | `--radius-16` | 16px | same | E | 0 |  |
| `--radius-20` | 20px | `--radius-20` | 20px | same | E | 0 |  |
| `--radius-24` | 24px | `--radius-24` | 24px | same | E | 0 |  |
| `--radius-32` | 32px | `--radius-32` | 32px | same | E | 1 |  |
| `--radius-8` | 8px | `--radius-8` | 8px | same | E | 0 |  |
| `--radius-999` | 9999px | `--radius-999` | 999px | value-changed | E | 0 | 9999px -> 999px: no visual difference (pill). |
| `--radius-full` | 9999px | `--radius-full` | 999px | value-changed | E | 155 | 9999px -> 999px: no visual difference (pill). |
| `--radius-lg` | 20px | `--radius-lg` | 20px | same | E | 24 |  |
| `--radius-md` | 16px | `--radius-md` | 16px | same | E | 21 |  |
| `--radius-none` | 0px | `--radius-none` | 0 | same | E | 0 |  |
| `--radius-sm` | 12px | `--radius-sm` | 12px | same | E | 30 |  |
| `--radius-xl` | 24px | `--radius-xl` | 24px | same | E | 86 |  |
| `--radius-xs` | 8px | `--radius-xs` | 8px | same | E | 23 |  |
| `--radius-xxl` | 32px | `--radius-xxl` | 32px | same | E | 40 |  |

### spacing (56)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--spacing-0` | 0px | `--spacing-0` | 0 | same | E | 0 |  |
| `--spacing-12` | 12px | `--spacing-12` | 12px | same | E | 33 |  |
| `--spacing-16` | 16px | `--spacing-16` | 16px | same | E | 30 |  |
| `--spacing-2` | 2px | `--spacing-2` | 2px | same | E | 13 |  |
| `--spacing-20` | 20px | `--spacing-20` | 20px | same | E | 13 |  |
| `--spacing-24` | 24px | `--spacing-24` | 24px | same | E | 4 |  |
| `--spacing-28` | 28px | `--spacing-28` | 28px | same | E | 0 |  |
| `--spacing-32` | 32px | `--spacing-32` | 32px | same | E | 7 |  |
| `--spacing-36` | 36px | `--spacing-36` | 36px | same | E | 0 |  |
| `--spacing-4` | 4px | `--spacing-4` | 4px | same | E | 26 |  |
| `--spacing-40` | 40px | `--spacing-40` | 40px | same | E | 0 |  |
| `--spacing-44` | 44px | `--spacing-44` | 44px | same | E | 0 |  |
| `--spacing-48` | 48px | `--spacing-48` | 48px | same | E | 1 |  |
| `--spacing-56` | 56px | `--spacing-56` | 56px | same | E | 0 |  |
| `--spacing-64` | 64px | `--spacing-64` | 64px | same | E | 1 |  |
| `--spacing-8` | 8px | `--spacing-8` | 8px | same | E | 44 |  |
| `--spacing-gap-2xl` | 24px | `--spacing-gap-2xl` | 24px | same | E | 9 |  |
| `--spacing-gap-2xs` | 2px | `--spacing-gap-2xs` | 2px | same | E | 9 |  |
| `--spacing-gap-3xl` | 32px | `--spacing-gap-3xl` | 32px | same | E | 0 |  |
| `--spacing-gap-lg` | 16px | `--spacing-gap-lg` | 16px | same | E | 87 |  |
| `--spacing-gap-md` | 12px | `--spacing-gap-md` | 12px | same | E | 106 |  |
| `--spacing-gap-none` | 0px | `--spacing-gap-none` | 0 | same | E | 3 |  |
| `--spacing-gap-sm` | 8px | `--spacing-gap-sm` | 8px | same | E | 167 |  |
| `--spacing-gap-xl` | 20px | `--spacing-gap-xl` | 20px | same | E | 51 |  |
| `--spacing-gap-xs` | 4px | `--spacing-gap-xs` | 4px | same | E | 64 |  |
| `--spacing-padding-2xl` | 24px | `--spacing-padding-2xl` | 24px | same | E | 13 |  |
| `--spacing-padding-2xs` | 2px | `--spacing-padding-2xs` | 2px | same | E | 6 |  |
| `--spacing-padding-3xl` | 32px | `--spacing-padding-3xl` | 32px | same | E | 15 |  |
| `--spacing-padding-4xl` | 40px | `--spacing-padding-4xl` | 40px | same | E | 0 |  |
| `--spacing-padding-5xl` | 48px | `--spacing-padding-5xl` | 48px | same | E | 8 |  |
| `--spacing-padding-lg` | 16px | `--spacing-padding-lg` | 16px | same | E | 140 |  |
| `--spacing-padding-md` | 12px | `--spacing-padding-md` | 12px | same | E | 73 |  |
| `--spacing-padding-none` | 0px | `--spacing-padding-none` | 0 | same | E | 1 |  |
| `--spacing-padding-sm` | 8px | `--spacing-padding-sm` | 8px | same | E | 57 |  |
| `--spacing-padding-xl` | 20px | `--spacing-padding-xl` | 20px | same | E | 46 |  |
| `--spacing-padding-xs` | 4px | `--spacing-padding-xs` | 4px | same | E | 13 |  |
| `--spacing-page-bottom-lg` | 40px | `--spacing-page-bottom-lg` | 40px | same | E | 3 |  |
| `--spacing-page-bottom-md` | 32px | `--spacing-page-bottom-md` | 32px | same | E | 7 |  |
| `--spacing-page-bottom-sm` | 24px | `--spacing-page-bottom-sm` | 24px | same | E | 2 |  |
| `--spacing-page-bottom-xl` | 48px | `--spacing-page-bottom-xl` | 48px | same | E | 1 |  |
| `--spacing-page-top-lg` | 32px | `--spacing-page-top-lg` | 32px | same | E | 1 |  |
| `--spacing-page-top-md` | 24px | `--spacing-page-top-md` | 24px | same | E | 0 |  |
| `--spacing-page-top-sm` | 16px | `--spacing-page-top-sm` | 16px | same | E | 2 |  |
| `--spacing-page-x-lg` | 24px | `--spacing-page-x-lg` | 24px | same | E | 6 |  |
| `--spacing-page-x-md` | 20px | `--spacing-page-x-md` | 20px | same | E | 2 |  |
| `--spacing-page-x-sm` | 16px | `--spacing-page-x-sm` | 16px | same | E | 37 |  |
| `--spacing-section-2xl` | 40px | `--spacing-section-2xl` | 40px | same | E | 1 |  |
| `--spacing-section-2xs` | 8px | `--spacing-section-2xs` | 8px | same | E | 0 |  |
| `--spacing-section-3xl` | 48px | `--spacing-section-3xl` | 48px | same | E | 4 |  |
| `--spacing-section-4xl` | 64px | `--spacing-section-4xl` | 64px | same | E | 0 |  |
| `--spacing-section-lg` | 24px | `--spacing-section-lg` | 24px | same | E | 4 |  |
| `--spacing-section-md` | 20px | `--spacing-section-md` | 20px | same | E | 15 |  |
| `--spacing-section-none` | 0px | `--spacing-section-none` | 0 | same | E | 0 |  |
| `--spacing-section-sm` | 16px | `--spacing-section-sm` | 16px | same | E | 12 |  |
| `--spacing-section-xl` | 32px | `--spacing-section-xl` | 32px | same | E | 3 |  |
| `--spacing-section-xs` | 12px | `--spacing-section-xs` | 12px | same | E | 2 |  |

### stroke-width (8)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--stroke-width-10` | 1px | `--stroke-width-10` | 1px | same | E | 0 |  |
| `--stroke-width-15` | 1.5px | `--stroke-width-15` | 1.5px | same | E | 0 |  |
| `--stroke-width-20` | 2px | `--stroke-width-20` | 2px | same | E | 0 |  |
| `--stroke-width-25` | 2.5px | `--stroke-width-25` | 2.5px | same | E | 0 |  |
| `--stroke-width-default` | 1px | `--stroke-width-default` | 1px | same | E | 39 |  |
| `--stroke-width-heavy` | 2.5px | `--stroke-width-heavy` | 2.5px | same | E | 0 |  |
| `--stroke-width-medium` | 1.5px | `--stroke-width-medium` | 1.5px | same | E | 10 |  |
| `--stroke-width-strong` | 2px | `--stroke-width-strong` | 2px | same | E | 14 |  |

### opacity (14)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--layer-opacity-0` | 0px | `--layer-opacity-0` | 0 | same | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-100` | 100px | `--layer-opacity-100` | 1 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-20` | 20px | `--layer-opacity-20` | 0.2 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-40` | 40px | `--layer-opacity-40` | 0.4 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-60` | 60px | `--layer-opacity-60` | 0.6 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-8` | 8px | `--layer-opacity-8` | 0.08 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-80` | 80px | `--layer-opacity-80` | 0.8 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-emphasis` | 80px | `--layer-opacity-emphasis` | 0.8 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-full` | 100px | `--layer-opacity-full` | 1 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-hide` | 0px | `--layer-opacity-hide` | 0 | same | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-minimum` | 8px | `--layer-opacity-minimum` | 0.08 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-muted` | 40px | `--layer-opacity-muted` | 0.4 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-secondary` | 60px | `--layer-opacity-secondary` | 0.6 | value-changed | E | 0 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |
| `--layer-opacity-subtle` | 20px | `--layer-opacity-subtle` | 0.2 | value-changed | E | 2 | Production emits px (invalid for opacity, DEV-HANDOFF 1.4); v3 value is unitless 0-1. Fixes a live bug. |

### typography/family (6)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--font-family-body` | Inter | `--font-family-body` | "Hanken Grotesk", sans-serif | value-changed | E | 172 | One typeface: Inter -> Hanken Grotesk (same name). |
| `--font-family-display` | Hanken Grotesk | `--font-family-display` | "Hanken Grotesk", sans-serif | same | E | 1 |  |
| `--font-family-hanken-grotesk` | Hanken Grotesk | `--font-family-hanken-grotesk` | "Hanken Grotesk", sans-serif | same | E | 5 |  |
| `--font-family-inter` | Inter | `--font-family-hanken-grotesk` | "Hanken Grotesk", sans-serif | renamed+value-changed | E | 19 | One typeface: Inter -> Hanken Grotesk. |
| `--font-family-label` | Inter | `--font-family-label` | "Hanken Grotesk", sans-serif | value-changed | E | 19 | One typeface: Inter -> Hanken Grotesk (same name). |
| `--font-family-title` | Hanken Grotesk | `--font-family-title` | "Hanken Grotesk", sans-serif | same | E | 111 |  |

### typography/size (39)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--font-size-0` | 11px | `--font-size-11` | 11px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-1` | 12px | `--font-size-12` | 12px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-10` | 40px | `--font-size-40` | 40px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-11` | 11px | `--font-size-11` | 11px | same | E | 9 |  |
| `--font-size-12` | 12px | `--font-size-12` | 12px | same | E | 10 |  |
| `--font-size-14` | 14px | `--font-size-14` | 14px | same | E | 32 |  |
| `--font-size-16` | 16px | `--font-size-16` | 16px | same | E | 10 |  |
| `--font-size-18` | 18px | `--font-size-18` | 18px | same | E | 1 |  |
| `--font-size-2` | 14px | `--font-size-14` | 14px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-20` | 20px | `--font-size-20` | 20px | same | E | 0 |  |
| `--font-size-24` | 24px | `--font-size-24` | 24px | same | E | 4 |  |
| `--font-size-28` | 28px | `--font-size-28` | 28px | same | E | 2 |  |
| `--font-size-3` | 16px | `--font-size-16` | 16px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-32` | 32px | `--font-size-32` | 32px | same | E | 2 |  |
| `--font-size-36` | 36px | `--font-size-36` | 36px | same | E | 1 |  |
| `--font-size-4` | 18px | `--font-size-18` | 18px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-40` | 40px | `--font-size-40` | 40px | same | E | 0 |  |
| `--font-size-48` | 48px | `--font-size-48` | 48px | same | E | 0 |  |
| `--font-size-5` | 20px | `--font-size-20` | 20px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-6` | 24px | `--font-size-24` | 24px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-7` | 28px | `--font-size-28` | 28px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-8` | 32px | `--font-size-32` | 32px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-9` | 36px | `--font-size-36` | 36px | renamed | E | 0 | Index-scale font size -> px-named primitive. |
| `--font-size-body-lg` | 16px | `--font-size-body-lg` | 16px | same | E | 7 |  |
| `--font-size-body-md` | 14px | `--font-size-body-md` | 14px | same | E | 41 |  |
| `--font-size-caption-sm` | 12px | `--font-size-caption-sm` | 12px | same | E | 18 |  |
| `--font-size-caption-xs` | 11px | `--font-size-caption-xs` | 11px | same | E | 11 |  |
| `--font-size-display-lg` | 40px | `--font-size-display-lg` | 40px | same | E | 0 |  |
| `--font-size-display-md` | 36px | `--font-size-display-md` | 36px | same | E | 0 |  |
| `--font-size-display-sm` | 32px | `--font-size-display-sm` | 32px | same | E | 1 |  |
| `--font-size-display-xl` | 48px | `--font-size-display-xl` | 48px | same | E | 0 |  |
| `--font-size-headline-sm` | 28px | `--font-size-headline-sm` | 28px | same | E | 1 |  |
| `--font-size-label-md` | 14px | `--font-size-label-md` | 14px | same | E | 15 |  |
| `--font-size-label-sm` | 12px | `--font-size-label-sm` | 12px | same | E | 2 |  |
| `--font-size-section-title-md` | 16px | `--font-size-section-title-md` | 16px | same | E | 4 |  |
| `--font-size-section-title-sm` | 14px | `--font-size-section-title-sm` | 14px | same | E | 11 |  |
| `--font-size-title-lg` | 24px | `--font-size-title-lg` | 24px | same | E | 4 |  |
| `--font-size-title-md` | 20px | `--font-size-title-md` | 20px | same | E | 3 |  |
| `--font-size-title-sm` | 18px | `--font-size-title-sm` | 18px | same | E | 17 |  |

### typography/line-height (28)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--font-line-height-14` | 14px | `--font-line-height-14` | 14px | same | E | 0 |  |
| `--font-line-height-16` | 16px | `--font-line-height-16` | 16px | same | E | 0 |  |
| `--font-line-height-20` | 20px | `--font-line-height-20` | 20px | same | E | 0 |  |
| `--font-line-height-22` | 22px | `--font-line-height-22` | 22px | same | E | 0 |  |
| `--font-line-height-24` | 24px | `--font-line-height-24` | 24px | same | E | 0 |  |
| `--font-line-height-28` | 28px | `--font-line-height-28` | 28px | same | E | 0 |  |
| `--font-line-height-32` | 32px | `--font-line-height-32` | 32px | same | E | 0 |  |
| `--font-line-height-36` | 36px | `--font-line-height-36` | 36px | same | E | 0 |  |
| `--font-line-height-40` | 40px | `--font-line-height-40` | 40px | same | E | 0 |  |
| `--font-line-height-44` | 44px | `--font-line-height-44` | 44px | same | E | 0 |  |
| `--font-line-height-48` | 48px | `--font-line-height-48` | 48px | same | E | 0 |  |
| `--font-line-height-56` | 56px | `--font-line-height-56` | 56px | same | E | 0 |  |
| `--font-line-height-body-lg` | 24px | `--font-line-height-body-lg` | 24px | same | E | 1 |  |
| `--font-line-height-body-md` | 20px | `--font-line-height-body-md` | 20px | same | E | 19 |  |
| `--font-line-height-caption-sm` | 16px | `--font-line-height-caption-sm` | 16px | same | E | 11 |  |
| `--font-line-height-caption-xs` | 14px | `--font-line-height-caption-xs` | 14px | same | E | 7 |  |
| `--font-line-height-display-lg` | 48px | `--font-line-height-display-lg` | 48px | same | E | 0 |  |
| `--font-line-height-display-md` | 44px | `--font-line-height-display-md` | 44px | same | E | 0 |  |
| `--font-line-height-display-sm` | 40px | `--font-line-height-display-sm` | 40px | same | E | 0 |  |
| `--font-line-height-display-xl` | 56px | `--font-line-height-display-xl` | 56px | same | E | 0 |  |
| `--font-line-height-headline-sm` | 36px | `--font-line-height-headline-sm` | 36px | same | E | 1 |  |
| `--font-line-height-label-md` | 20px | `--font-line-height-label-md` | 20px | same | E | 15 |  |
| `--font-line-height-label-sm` | 16px | `--font-line-height-label-sm` | 16px | same | E | 2 |  |
| `--font-line-height-section-title-md` | 22px | `--font-line-height-section-title-md` | 22px | same | E | 4 |  |
| `--font-line-height-section-title-sm` | 20px | `--font-line-height-section-title-sm` | 20px | same | E | 11 |  |
| `--font-line-height-title-lg` | 32px | `--font-line-height-title-lg` | 32px | same | E | 1 |  |
| `--font-line-height-title-md` | 28px | `--font-line-height-title-md` | 28px | same | E | 0 |  |
| `--font-line-height-title-sm` | 24px | `--font-line-height-title-sm` | 24px | same | E | 16 |  |

### typography/weight (17)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--font-weight-400` | 400 | `--font-weight-400` | 400 | same | E | 0 |  |
| `--font-weight-500` | 500 | `--font-weight-500` | 500 | same | E | 0 |  |
| `--font-weight-600` | 600 | `--font-weight-600` | 600 | same | E | 0 |  |
| `--font-weight-700` | 700 | `--font-weight-700` | 700 | same | E | 0 |  |
| `--font-weight-800` | 800 | `--font-weight-800` | 800 | same | E | 0 |  |
| `--font-weight-black` | 800 | `--font-weight-black` | 800 | same | E | 0 |  |
| `--font-weight-bold` | 700 | `--font-weight-bold` | 700 | same | E | 14 |  |
| `--font-weight-medium` | 500 | `--font-weight-medium` | 500 | same | E | 13 |  |
| `--font-weight-regular` | 400 | `--font-weight-regular` | 400 | same | E | 26 |  |
| `--font-weight-semi-bold` | 600 | `--font-weight-semi-bold` | 600 | same | E | 0 |  |
| `--font-weights-hanken-grotesk-1` | 600 | `--font-weight-semi-bold` | 600 | renamed | E | 1 | Per-family weight alias -> named weight (one typeface now). |
| `--font-weights-hanken-grotesk-2` | 500 | `--font-weight-medium` | 500 | renamed | E | 7 | Per-family weight alias -> named weight (one typeface now). |
| `--font-weights-hanken-grotesk-5` | 700 | `--font-weight-bold` | 700 | renamed | E | 0 | Per-family weight alias -> named weight (one typeface now). |
| `--font-weights-hanken-grotesk-6` | 800 | `--font-weight-black` | 800 | renamed | E | 0 | Per-family weight alias -> named weight (one typeface now). |
| `--font-weights-inter-0` | 400 | `--font-weight-regular` | 400 | renamed | E | 6 | Per-family weight alias -> named weight (one typeface now). |
| `--font-weights-inter-3` | 500 | `--font-weight-medium` | 500 | renamed | E | 3 | Per-family weight alias -> named weight (one typeface now). |
| `--font-weights-inter-4` | 600 | `--font-weight-semi-bold` | 600 | renamed | E | 5 | Per-family weight alias -> named weight (one typeface now). |

### typography/letter-spacing (7)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--letter-spacing-0` | 0 | → `0` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |
| `--letter-spacing-1` | 0 | → `0` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |
| `--letter-spacing-2` | 0.02em | → `0.02em` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |
| `--letter-spacing-3` | -0.01em | → `-0.01em` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |
| `--letter-spacing-4` | -0.005em | → `-0.005em` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |
| `--letter-spacing-5` | -0.003em | → `-0.003em` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |
| `--letter-spacing-6` | -0.012em | → `-0.012em` | — | removed | E | 0 | v3 has no letter-spacing variables; each .ps-text-* class sets its own tracking (body 0, title -0.005em, headline -0.01em, display -0.02em, amount +0.02..0.04em). Use the class, or the literal. |

### typography/paragraph (2)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--paragraph-indent-0` | 0px | → `(literal 0px)` | — | removed | E | 0 | Figma export artefact with no v3 variable. |
| `--paragraph-spacing-0` | 0px | → `(literal 0px)` | — | removed | E | 0 | Figma export artefact with no v3 variable. |

### typography/text-case-decoration (2)

| old | old value | new | new value | kind | conf | uses | note |
|---|---|---|---|---|---|---:|---|
| `--text-case-none` | none | → `(literal none)` | — | removed | E | 0 | Figma export artefact with no v3 variable. |
| `--text-decoration-none` | none | → `(literal none)` | — | removed | E | 0 | Figma export artefact with no v3 variable. |

### typography/text-style (192 variables = 24 styles × 8 properties)

v3 has no per-style variables: each production style maps to a `.ps-text-*` class, and each of its `--{style}-font-family / -font-size / -line-height / -font-weight` variables maps to the token that class uses (kind `renamed` or `renamed+value-changed`). `-letter-spacing` is `removed` (tracking lives in the class); `-paragraph-spacing`, `-text-decoration`, `-text-transform` are `removed` (delete the declaration: they were 0 / none).

| production style | legacy (family size/line weight tracking) | class | family | size | line height | weight | tracking | uses | note |
|---|---|---|---|---|---|---|---|---:|---|
| `body-lg-emphasis` | Inter 16/24 500 0.02em | `.ps-text-body-lg-strong` | `--font-family-body` | `--font-size-body-lg` = 16px | `--font-line-height-body-lg` = 24px | `--font-weight-medium` = 500 | 0 | 13 |  |
| `body-lg` | Inter 16/24 400 0.02em | `.ps-text-body-lg` | `--font-family-body` | `--font-size-body-lg` = 16px | `--font-line-height-body-lg` = 24px | `--font-weight-regular` = 400 | 0 | 3 |  |
| `body-md-emphasis` | Inter 14/20 500 0.02em | `.ps-text-body-md-strong` | `--font-family-body` | `--font-size-body-md` = 14px | `--font-line-height-body-md` = 20px | `--font-weight-medium` = 500 | 0 | 75 |  |
| `body-md` | Inter 14/20 400 0.02em | `.ps-text-body-md` | `--font-family-body` | `--font-size-body-md` = 14px | `--font-line-height-body-md` = 20px | `--font-weight-regular` = 400 | 0 | 276 |  |
| `caption-sm` | Inter 12/16 400 0 | `.ps-text-body-sm` | `--font-family-body` | `--font-size-caption-sm` = 12px | `--font-line-height-caption-sm` = 16px | `--font-weight-regular` = 400 | 0 | 203 | Production Caption/sm is 400; Body/sm (12/16 400) restores it (TYPE-GAPS.md). The 11.21 migration CSV says .ps-text-caption-sm, which is 500. |
| `caption-xs` | Inter 11/14 400 0 | `.ps-text-body-xs` | `--font-family-body` | `--font-size-caption-xs` = 11px | `--font-line-height-caption-xs` = 14px | `--font-weight-regular` = 400 | 0 | 59 | Production Caption/xs is 400; Body/xs (11/14 400) restores it (TYPE-GAPS.md). The 11.21 migration CSV says .ps-text-caption-xs, which is 500. |
| `display-lg` | Hanken Grotesk 40/48 800 -0.01em | `.ps-text-display-md` | `--font-family-display` | `--font-size-display-md` = 36px | `--font-line-height-display-md` = 44px | `--font-weight-black` = 800 | -0.02em | 0 | Display/lg merged into Display/md (40/48 -> 36/44). TYPE-AND-STYLES.md: 0 uses in the live app. |
| `display-md` | Hanken Grotesk 36/44 700 -0.003em | `.ps-text-display-md-bold` | `--font-family-display` | `--font-size-display-md` = 36px | `--font-line-height-display-md` = 44px | `--font-weight-bold` = 700 | -0.02em | 13 | Legacy weight 700 kept via the Display/md-bold twin. |
| `display-sm` | Hanken Grotesk 32/40 700 -0.005em | `.ps-text-display-sm` | `--font-family-display` | `--font-size-display-sm` = 32px | `--font-line-height-display-sm` = 40px | `--font-weight-bold` = 700 | -0.02em | 15 | No Display/sm 700 twin: use the class plus font-weight: var(--font-weight-bold) (twin rule, TYPE-AND-STYLES.md). |
| `display-xl` | Hanken Grotesk 48/56 800 -0.012em | `.ps-text-display-md` | `--font-family-display` | `--font-size-display-md` = 36px | `--font-line-height-display-md` = 44px | `--font-weight-black` = 800 | -0.02em | 0 | Display/xl merged into Display/md (48/56 -> 36/44). TYPE-AND-STYLES.md: 0 uses in the live app. |
| `headline-sm` | Hanken Grotesk 28/36 700 0 | `.ps-text-headline-sm-bold` | `--font-family-display` | `--font-size-headline-sm` = 28px | `--font-line-height-headline-sm` = 36px | `--font-weight-bold` = 700 | -0.01em | 4 | Legacy weight 700 kept via the Headline/sm-bold twin. |
| `label-md` | Inter 14/20 600 0 | `.ps-text-label-md` | `--font-family-label` | `--font-size-label-md` = 14px | `--font-line-height-label-md` = 20px | `--font-weight-semi-bold` = 600 | 0 | 83 |  |
| `label-md-light` | Inter 14/20 500 0 | `.ps-text-body-md-strong` | `--font-family-body` | `--font-size-body-md` = 14px | `--font-line-height-body-md` = 20px | `--font-weight-medium` = 500 | 0 | 18 | Label/md-light (500 14/20) = Body/md-strong. |
| `label-sm` | Inter 12/16 600 0 | `.ps-text-label-sm` | `--font-family-label` | `--font-size-label-sm` = 12px | `--font-line-height-label-sm` = 16px | `--font-weight-semi-bold` = 600 | 0 | 4 |  |
| `label-sm-light` | Inter 12/16 500 0 | `.ps-text-caption-sm` | `--font-family-body` | `--font-size-caption-sm` = 12px | `--font-line-height-caption-sm` = 16px | `--font-weight-medium` = 500 | 0 | 0 | Label/sm-light (500 12/16) = Caption/sm. |
| `section-title-md` | Hanken Grotesk 16/22 600 0 | `.ps-text-title-xs` | `--font-family-title` | `--font-size-section-title-md` = 16px | `--font-line-height-section-title-md` = 22px | `--font-weight-semi-bold` = 600 | 0 | 45 | Section-title/md is now Title/xs (600 16/22). |
| `section-title-md-light` | Hanken Grotesk 16/22 500 0 | `.ps-text-body-lg-strong` | `--font-family-body` | `--font-size-body-lg` = 16px | `--font-line-height-body-lg` = 24px | `--font-weight-medium` = 500 | 0 | 9 | Merged into Body/lg-strong: line height 22 -> 24 (approved visible change, TYPE-AND-STYLES.md). |
| `section-title-sm` | Hanken Grotesk 14/20 600 0 | `.ps-text-label-md` | `--font-family-label` | `--font-size-label-md` = 14px | `--font-line-height-label-md` = 20px | `--font-weight-semi-bold` = 600 | 0 | 76 | Section-title/sm (600 14/20) = Label/md. |
| `section-title-sm-light` | Hanken Grotesk 14/20 500 0 | `.ps-text-body-md-strong` | `--font-family-body` | `--font-size-body-md` = 14px | `--font-line-height-body-md` = 20px | `--font-weight-medium` = 500 | 0 | 17 | Section-title/sm-light (500 14/20) = Body/md-strong. |
| `section-title-xs` | Hanken Grotesk 11/14 600 0 | `.ps-text-label-xs` | `--font-family-body` | `--font-size-caption-xs` = 11px | `--font-line-height-caption-xs` = 14px | `--font-weight-semi-bold` = 600 | 0 | 7 | Legacy weight 600 kept via the Label/xs twin (the 11.21 CSV says Caption/xs, which is 500). |
| `section-title-xs-light` | Hanken Grotesk 11/14 500 0 | `.ps-text-caption-xs` | `--font-family-body` | `--font-size-caption-xs` = 11px | `--font-line-height-caption-xs` = 14px | `--font-weight-medium` = 500 | 0 | 3 | Section-title/xs-light (500 11/14) = Caption/xs. |
| `title-lg` | Hanken Grotesk 24/32 700 -0.01em | `.ps-text-title-lg` | `--font-family-title` | `--font-size-title-lg` = 24px | `--font-line-height-title-lg` = 32px | `--font-weight-bold` = 700 | -0.005em | 65 |  |
| `title-md` | Hanken Grotesk 20/28 700 -0.01em | `.ps-text-title-md` | `--font-family-title` | `--font-size-title-md` = 20px | `--font-line-height-title-md` = 28px | `--font-weight-bold` = 700 | -0.005em | 30 |  |
| `title-sm` | Hanken Grotesk 18/24 700 -0.01em | `.ps-text-title-sm` | `--font-family-title` | `--font-size-title-sm` = 18px | `--font-line-height-title-sm` = 24px | `--font-weight-bold` = 700 | -0.005em | 38 |  |

## Rename list (pure renames, 183)

Same as `rename.sed` / `rename.json` → `pure`. Renames that also change the value (178) are in `rename-value-changes.sed` / `rename.json` → `withValueChange`.

```text
--body-lg-emphasis-font-size -> --font-size-body-lg
--body-lg-emphasis-font-weight -> --font-weight-medium
--body-lg-emphasis-line-height -> --font-line-height-body-lg
--body-lg-font-size -> --font-size-body-lg
--body-lg-font-weight -> --font-weight-regular
--body-lg-line-height -> --font-line-height-body-lg
--body-md-emphasis-font-size -> --font-size-body-md
--body-md-emphasis-font-weight -> --font-weight-medium
--body-md-emphasis-line-height -> --font-line-height-body-md
--body-md-font-size -> --font-size-body-md
--body-md-font-weight -> --font-weight-regular
--body-md-line-height -> --font-line-height-body-md
--caption-sm-font-size -> --font-size-caption-sm
--caption-sm-font-weight -> --font-weight-regular
--caption-sm-line-height -> --font-line-height-caption-sm
--caption-xs-font-size -> --font-size-caption-xs
--caption-xs-font-weight -> --font-weight-regular
--caption-xs-line-height -> --font-line-height-caption-xs
--color-action-bg-inverse -> --bg-default
--color-alpha-cold-bg-default -> --bg-neutral-alpha-muted
--color-alpha-cold-bg-subtle -> --bg-neutral-alpha-subtle
--color-alpha-cold-black-12 -> --palette-alpha-navy-12
--color-alpha-cold-black-16 -> --palette-alpha-navy-16
--color-alpha-cold-black-20 -> --palette-alpha-navy-20
--color-alpha-cold-black-6 -> --palette-alpha-navy-6
--color-alpha-cold-black-8 -> --palette-alpha-navy-8
--color-alpha-white-0 -> --palette-alpha-white-0
--color-alpha-white-20 -> --palette-alpha-white-20
--color-alpha-white-40 -> --palette-alpha-white-40
--color-alpha-white-50 -> --palette-alpha-white-50
--color-alpha-white-60 -> --palette-alpha-white-60
--color-alpha-white-80 -> --palette-alpha-white-80
--color-ambient-100 -> --palette-mist-100
--color-ambient-50 -> --palette-mist-50
--color-blue-950 -> --palette-navy-900
--color-brand-950 -> --palette-navy-900
--color-gradient-subtle-0 -> --gradient-white-0
--color-gradient-subtle-20 -> --gradient-white-20
--color-gradient-subtle-40 -> --gradient-white-40
--color-gradient-subtle-50 -> --gradient-white-50
--color-gradient-subtle-60 -> --gradient-white-60
--color-gradient-subtle-80 -> --gradient-white-80
--color-icon-inverse -> --fg-on-emphasis
--color-icon-negative-default -> --fg-danger
--color-icon-negative-heavy -> --fg-danger-strong
--color-icon-negative-light -> --fg-danger-muted
--color-negative-100 -> --palette-red-100
--color-negative-200 -> --palette-red-200
--color-negative-300 -> --palette-red-300
--color-negative-400 -> --palette-red-400
--color-negative-50 -> --palette-red-50
--color-negative-500 -> --palette-red-500
--color-negative-600 -> --palette-red-600
--color-negative-700 -> --palette-red-700
--color-negative-800 -> --palette-red-800
--color-negative-900 -> --palette-red-900
--color-negative-950 -> --palette-red-950
--color-neutral-0 -> --palette-base-white
--color-red-100 -> --palette-red-100
--color-red-200 -> --palette-red-200
--color-red-300 -> --palette-red-300
--color-red-400 -> --palette-red-400
--color-red-50 -> --palette-red-50
--color-red-500 -> --palette-red-500
--color-red-600 -> --palette-red-600
--color-red-700 -> --palette-red-700
--color-red-800 -> --palette-red-800
--color-red-900 -> --palette-red-900
--color-red-950 -> --palette-red-950
--color-shadow-backdrop -> --shadow-backdrop
--color-shadow-default-1 -> --shadow-default-1
--color-shadow-default-2 -> --shadow-default-2
--color-shadow-focus-1 -> --shadow-focus-1
--color-shadow-focus-2 -> --shadow-focus-2
--color-shadow-subtle-1 -> --shadow-subtle-1
--color-shadow-subtle-2 -> --shadow-subtle-2
--color-stroke-negative-default -> --border-danger
--color-stroke-negative-strong -> --border-danger-emphasis
--color-stroke-negative-subtle -> --border-danger-muted
--color-surface-card-default -> --bg-default
--color-surface-card-negative -> --bg-danger-emphasis
--color-surface-card-negative-subtle -> --bg-danger-muted
--color-surface-elevated-default -> --bg-default
--color-surface-elevated-glass-blue -> --bg-glass-subtle
--color-surface-icon-inverse-default -> --bg-default
--color-surface-icon-negative-default -> --bg-danger-emphasis
--color-surface-icon-negative-disabled -> --bg-danger-disabled
--color-surface-inset-default -> --bg-inset
--color-surface-page-default -> --bg-page
--color-surface-page-light -> --bg-page-subtle
--color-text-inverse -> --fg-on-emphasis
--color-text-negative-default -> --fg-danger
--color-text-negative-heavy -> --fg-danger-strong
--color-text-negative-light -> --fg-danger-muted
--display-lg-font-family -> --font-family-display
--display-lg-font-weight -> --font-weight-black
--display-md-font-family -> --font-family-display
--display-md-font-size -> --font-size-display-md
--display-md-font-weight -> --font-weight-bold
--display-md-line-height -> --font-line-height-display-md
--display-sm-font-family -> --font-family-display
--display-sm-font-size -> --font-size-display-sm
--display-sm-font-weight -> --font-weight-bold
--display-sm-line-height -> --font-line-height-display-sm
--display-xl-font-family -> --font-family-display
--display-xl-font-weight -> --font-weight-black
--font-size-0 -> --font-size-11
--font-size-1 -> --font-size-12
--font-size-10 -> --font-size-40
--font-size-2 -> --font-size-14
--font-size-3 -> --font-size-16
--font-size-4 -> --font-size-18
--font-size-5 -> --font-size-20
--font-size-6 -> --font-size-24
--font-size-7 -> --font-size-28
--font-size-8 -> --font-size-32
--font-size-9 -> --font-size-36
--font-weights-hanken-grotesk-1 -> --font-weight-semi-bold
--font-weights-hanken-grotesk-2 -> --font-weight-medium
--font-weights-hanken-grotesk-5 -> --font-weight-bold
--font-weights-hanken-grotesk-6 -> --font-weight-black
--font-weights-inter-0 -> --font-weight-regular
--font-weights-inter-3 -> --font-weight-medium
--font-weights-inter-4 -> --font-weight-semi-bold
--gradient-glass-nav-stroke -> --gradient-glass-stroke
--headline-sm-font-family -> --font-family-display
--headline-sm-font-size -> --font-size-headline-sm
--headline-sm-font-weight -> --font-weight-bold
--headline-sm-line-height -> --font-line-height-headline-sm
--label-md-font-size -> --font-size-label-md
--label-md-font-weight -> --font-weight-semi-bold
--label-md-light-font-size -> --font-size-body-md
--label-md-light-font-weight -> --font-weight-medium
--label-md-light-line-height -> --font-line-height-body-md
--label-md-line-height -> --font-line-height-label-md
--label-sm-font-size -> --font-size-label-sm
--label-sm-font-weight -> --font-weight-semi-bold
--label-sm-light-font-size -> --font-size-caption-sm
--label-sm-light-font-weight -> --font-weight-medium
--label-sm-light-line-height -> --font-line-height-caption-sm
--label-sm-line-height -> --font-line-height-label-sm
--section-title-md-font-family -> --font-family-title
--section-title-md-font-size -> --font-size-section-title-md
--section-title-md-font-weight -> --font-weight-semi-bold
--section-title-md-light-font-family -> --font-family-body
--section-title-md-light-font-size -> --font-size-body-lg
--section-title-md-light-font-weight -> --font-weight-medium
--section-title-md-line-height -> --font-line-height-section-title-md
--section-title-sm-font-family -> --font-family-label
--section-title-sm-font-size -> --font-size-label-md
--section-title-sm-font-weight -> --font-weight-semi-bold
--section-title-sm-light-font-family -> --font-family-body
--section-title-sm-light-font-size -> --font-size-body-md
--section-title-sm-light-font-weight -> --font-weight-medium
--section-title-sm-light-line-height -> --font-line-height-body-md
--section-title-sm-line-height -> --font-line-height-label-md
--section-title-xs-font-family -> --font-family-body
--section-title-xs-font-size -> --font-size-caption-xs
--section-title-xs-font-weight -> --font-weight-semi-bold
--section-title-xs-light-font-family -> --font-family-body
--section-title-xs-light-font-size -> --font-size-caption-xs
--section-title-xs-light-font-weight -> --font-weight-medium
--section-title-xs-light-line-height -> --font-line-height-caption-xs
--section-title-xs-line-height -> --font-line-height-caption-xs
--shadow-default -> --elevation-1
--shadow-focus -> --elevation-3
--shadow-over -> --elevation-2
--tag-color-negative-bg-default -> --tag-danger-bg
--tag-color-negative-bg-subtle -> --tag-danger-bg-subtle
--tag-color-neutral-bg-alpha -> --tag-neutral-bg-alpha
--tag-color-neutral-bg-inverse -> --tag-neutral-bg-inverse
--title-lg-font-family -> --font-family-title
--title-lg-font-size -> --font-size-title-lg
--title-lg-font-weight -> --font-weight-bold
--title-lg-line-height -> --font-line-height-title-lg
--title-md-font-family -> --font-family-title
--title-md-font-size -> --font-size-title-md
--title-md-font-weight -> --font-weight-bold
--title-md-line-height -> --font-line-height-title-md
--title-sm-font-family -> --font-family-title
--title-sm-font-size -> --font-size-title-sm
--title-sm-font-weight -> --font-weight-bold
--title-sm-line-height -> --font-line-height-title-sm
```

## Not design tokens (keep)

- `--app-header-content-height: 4.75rem` (src/styles/global.css): App layout variable, not a design token: keep as is.
- `--app-safe-area-top: env(safe-area-inset-top, 0px)` (src/styles/global.css): App layout variable, not a design token: keep as is.
