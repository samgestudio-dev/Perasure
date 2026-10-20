# PeraSure motion demos

Phone-first motion prototypes, served with GitHub Pages.

**Open on your phone:** https://samgestudio-dev.github.io/Perasure/ — a picker page that lists every demo and its variants.

## Demos

| Demo | Variants |
| --- | --- |
| Withdraw fund flow | [Standard](demos/withdraw-fund-flow/index.html) (no gradient blur) · [With gradient blur](demos/withdraw-fund-flow/with-blur.html) |

## Adding a demo

Easiest: give the demo's HTML file to Claude and say "add this to the motion demo repo" — the agent guide in
[`CLAUDE.md`](CLAUDE.md) tells it where the file goes and how to list it on the picker.

By hand:

1. Put the file(s) in `demos/<name>/`, with the main version as `index.html`.
2. Open the root `index.html`, find the `DEMOS` list near the bottom and copy an entry:
   title, a one-line description, and one line per variant (the first one is shown as recommended).
3. Add a row to the table above, commit to `main` and push. The live site updates in about a minute.

Each demo is a single self-contained HTML file, so there is nothing to build.
