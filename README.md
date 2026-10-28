# PeraSure Playground

Phone-first motion prototypes, served with GitHub Pages.

**Open on your phone:** https://samgestudio-dev.github.io/Perasure/ — a picker page with two tabs:
**Prototypes** (interactive flows) and **Animations** (illustration animations, played one at a time as Lottie or GSAP).

## Prototypes

| Demo | Variants |
| --- | --- |
| Change co-maker | [Standard](prototypes/co-maker-change/index.html) (Change → card morphs into the form; Cancel / Save morph back) · [guide](prototypes/co-maker-change/README.md) |
| Credit limit increase | [Baked heap](prototypes/credit-limit-coins/baked/baked-heap.html) (deliverable) · [Baked heap + shockwave](prototypes/credit-limit-coins/baked/baked-shockwave.html) (variant) · [Physics tuner](prototypes/credit-limit-coins/physics-tuner/physics-tuner.html) (engineering file for tuning, not shipped) · [integration guide](prototypes/credit-limit-coins/README.md) |
| Withdraw fund flow | [Standard](prototypes/withdraw-fund-flow/index.html) (Tune: gradient blur, card amounts, motion feel) · [With credit limit increase](prototypes/withdraw-fund-flow/with-credit-limit.html) (the Credit limit animation first, closing in to the home card) · [guide](prototypes/withdraw-fund-flow/README.md) |
| Order submit | [Standard](prototypes/order-submit/index.html) |
| OTP sheet morph | [Standard](prototypes/otp-sheet-morph/index.html) |
| Loading page | [Standard](prototypes/loading-page/index.html) |
| Landing page (website) | [Standard](prototypes/landing-page/index.html) |

## Animations

Open the **Animations** tab on the picker, tap an animation, and it plays in the player
(`animations/player.html?a=<name>`): intro once → seamless loop, as specified in each hand-off README.
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

Every animation also has a **GSAP version** (`animations/<name>/gsap/*.js`: inline SVG + one GSAP timeline,
pixel-matched to the Lottie). The **Lottie / GSAP** switch in the animation's top-left corner changes renderer (background swatches sit top-right); the
controls work the same for both and the current frame is kept when you switch.

To add one: put the `.json` (plus `.lottie` and a `preview.png`) in `animations/<name>/`, the GSAP module (if
any) in `animations/<name>/gsap/`, and add an entry to `animations/animations.js`. Rendered with
[lottie-web](https://github.com/airbnb/lottie-web) (SVG renderer) and GSAP 3.15.

## Design tokens

`tokens/` holds the PeraSure design system's tokens from Figma, versioned: `tokens.css` (CSS variables, shadow /
gradient variables, `.ps-text-*` type classes), `tokens.json` (W3C Design Tokens format) and `CHANGELOG.md` (what
changed in each version, dated, with the impact on code). Each version is tagged `tokens-v<version>`. To update:
export with the Figma plugin and upload into `tokens/inbox`, or ask Claude. Not shown on the picker. See
[tokens/README.md](tokens/README.md).

## Shared libraries

`vendor/` holds pinned copies so demos don't depend on a CDN: lottie-web 5.12.2, GSAP 3.15.0 (core +
all plugins, as browser scripts and as ES modules in `esm/`), React 18.3.1, ReactDOM 18.3.1 and
Material UI 5.18.0 (used by the Playground pages; theme in `assets/playground-ui.js`) and Matter.js 0.19.0.

`assets/fonts/` holds the app's fonts — Hanken Grotesk and Inter (variable, 100–900) and Satoshi (500, 700) —
with `fonts.css`, which defines them and three variables: `--ps-font-text` (Hanken Grotesk), `--ps-font-body`
(Inter) and `--ps-font-num` (Satoshi for amounts, with ₱ taken from Inter, as in the app).

Motion 14.4.0 (formerly Framer Motion) in `vendor/motion@14.4.0/`, two browser builds — load one per page,
both define `window.Motion`:

- `motion-react.js` — the React API (`motion` / `m` components, `LazyMotion`, `AnimatePresence`, …); load after
  React and ReactDOM: `const { LazyMotion, domAnimation, m } = Motion;`
- `motion.js` — the plain JavaScript API, no React: `const { animate, scroll, inView, stagger } = Motion;` Load them from a demo with a relative path, e.g.
`<script src="../../vendor/gsap@3.15.0/gsap.min.js"></script>`, or for code that does `import { gsap } from "gsap"`
an import map: `{"imports":{"gsap":"../../vendor/gsap@3.15.0/esm/index.js","gsap/":"../../vendor/gsap@3.15.0/esm/"}}`
(see `animations/player.html`).

## Adding a demo

Easiest: give the demo's HTML file to Claude and say "add this to the motion demo repo" — the agent guide in
[`CLAUDE.md`](CLAUDE.md) tells it where the file goes and how to list it on the picker.

By hand:

1. Copy `prototypes/_template/` to `prototypes/<name>/` (it already links the fonts and libraries), with the main version as `index.html`.
2. Open the root `index.html`, find the `DEMOS` list near the bottom and copy an entry:
   title, a one-line description, and one line per variant (the first one is shown as recommended).
3. Add a row to the table above, commit to `main` and push. The live site updates in about a minute.

There is nothing to build. New prototypes link the shared fonts (`assets/fonts/fonts.css`) and libraries
(`vendor/`) instead of packing them into the page, as the app already has them; the page itself then holds only
the prototype's own code and data. Older demos are single self-contained files and keep working as they are.

## Skills

PeraSure skills for AI assistants live in [`.claude/skills/`](.claude/skills/):

| Skill | What it is |
| --- | --- |
| [perasure-tone-of-voice](.claude/skills/perasure-tone-of-voice/SKILL.md) | the tone of voice: every piece of PeraSure copy follows it |
| [perasure-card-morph](.claude/skills/perasure-card-morph/SKILL.md) | the card morph motion of the withdraw fund flow and Change co-maker — core rules, references per kind of morph (card → form, page → card, checks), engine and a working example |

