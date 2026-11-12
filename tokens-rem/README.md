# Tokens in rem (`tokens-rem/`)

`tokens-rem.css` is the design tokens' length primitives in **rem** (1rem = 16 px at the default text size), for pages sized in rem:
the PeraSure app (`prototypes/app`) and the shared components (`shared/ps-ui`). Load it right after `tokens/tokens.css`:

```html
<link rel="stylesheet" href="../../tokens/tokens.css">
<link rel="stylesheet" href="../../tokens-rem/tokens-rem.css?v=…">
```

- **Made, never written by hand.** `python3 tools/rem-tokens.py` reads `tokens/tokens.css` and writes this file; `tools/stamp.py` runs it
  before every commit, so it follows each token release. `--check` tells whether it is up to date. The token files themselves
  (`tokens/`) are never edited — they belong to the token pipeline (`tools/sync-tokens.py`).
- **What changes:** `--font-size-N` and `--font-line-height-N` become `calc(N/16 rem * var(--ps-tx, 1))`, `--spacing-N` and `--radius-N`
  become `N/16 rem`. Every semantic token (`--spacing-gap-md`, `--font-size-body-md`, …) points at these with `var()`, so the whole system
  turns to rem without copying a semantic token.
- **What stays px:** `--radius-999` (the pill only has to be large), stroke widths (hairlines stay crisp), blurs and shadows.
- **`--ps-tx`** is set by `shared/ps-ui/phone-fit.js`: the part of the phone's text size the layout does not follow (above 130 %, only text
  grows). It is 1 at the default size, so a page without it looks exactly the same.
