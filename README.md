# PeraSure Playground

Phone-first motion prototypes, served with GitHub Pages.

**Open on your phone:** https://samgestudio-dev.github.io/Perasure/ — a picker page with two tabs:
**Prototypes** (interactive flows) and **Animations** (illustration animations, played one at a time as Lottie or GSAP).

## Prototypes

| Demo | Variants |
| --- | --- |
| Loading page | [Standard](demos/loading-page/index.html) |
| OTP sheet morph | [Standard](demos/otp-sheet-morph/index.html) |
| Order submit | [Standard](demos/order-submit/index.html) |
| Landing page (website) | [Standard](demos/landing-page/index.html) |
| Withdraw fund flow | [Standard](demos/withdraw-fund-flow/index.html) (no gradient blur) · [With gradient blur](demos/withdraw-fund-flow/with-blur.html) |

## Animations

Open the **Animations** tab on the picker, tap an animation, and it plays in the player
(`lottie/player.html?a=<name>`): intro once → seamless loop, as specified in each hand-off README.
The player has replay, play/pause, a frame scrubber, speed (1× / 0.5× / 0.25× / 2×), background
swatches, prev / next (or swipe on the animation), and a menu button (top right) that lists every animation. Only one animation plays at a time; the list
shows still thumbnails.

| Animation | Playback |
| --- | --- |
| Customer service chat | intro 0–36 → loop 36–96 |
| Customer service | intro 0–45 → loop 45–105 |
| Empty box | plays once, holds |
| Loading state OTP | intro 0–36 → loop 36–96 |
| Safe transaction | intro 0–54 → loop 54–114 |
| Verification code | intro 0–56 → loop 56–116 |
| Doc verify | intro 0–36 → loop 36–96 |
| Coins loading | loading loops → "Show success" finishes the turn → success once |

Every animation also has a **GSAP version** (`lottie/<name>/gsap/*.js`: inline SVG + one GSAP timeline,
pixel-matched to the Lottie). The **Lottie / GSAP** tab above the animation switches renderer; the
controls work the same for both and the current frame is kept when you switch.

To add one: put the `.json` (plus `.lottie` and a `preview.png`) in `lottie/<name>/`, the GSAP module (if
any) in `lottie/<name>/gsap/`, and add an entry to `lottie/animations.js`. Rendered with
[lottie-web](https://github.com/airbnb/lottie-web) (SVG renderer) and GSAP 3.15.

## Shared libraries

`vendor/` holds pinned copies so demos don't depend on a CDN: lottie-web 5.12.2, GSAP 3.15.0 (core +
all plugins, as browser scripts and as ES modules in `esm/`), React 18.3.1 and ReactDOM 18.3.1. Load them from a demo with a relative path, e.g.
`<script src="../../vendor/gsap@3.15.0/gsap.min.js"></script>`, or for code that does `import { gsap } from "gsap"`
an import map: `{"imports":{"gsap":"../../vendor/gsap@3.15.0/esm/index.js","gsap/":"../../vendor/gsap@3.15.0/esm/"}}`
(see `lottie/player.html`).

## Adding a demo

Easiest: give the demo's HTML file to Claude and say "add this to the motion demo repo" — the agent guide in
[`CLAUDE.md`](CLAUDE.md) tells it where the file goes and how to list it on the picker.

By hand:

1. Put the file(s) in `demos/<name>/`, with the main version as `index.html`.
2. Open the root `index.html`, find the `DEMOS` list near the bottom and copy an entry:
   title, a one-line description, and one line per variant (the first one is shown as recommended).
3. Add a row to the table above, commit to `main` and push. The live site updates in about a minute.

Each demo is a single self-contained HTML file, so there is nothing to build.
