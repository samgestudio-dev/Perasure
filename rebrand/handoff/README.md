> ⚠️ **Old copy — not the rules (2026-11-26).** This file was copied on 2026-11-20 and is not kept up to date: its token names, fonts
> and sections are from before the rebrand v3. An agent working anywhere in this repo, this folder included, follows the root
> [`AGENTS.md`](../../AGENTS.md) and its topic guides in `docs/agents/`. Only the "Developer handoff" section below is specific to this
> copy; for the developers' package itself read [`ai/README.md`](ai/README.md) and [`updates/`](updates/).

> Copy of the repo's `README.md` with the **Developer handoff** section added (owner, 2026-11-20: every change goes into a copy in
> `rebrand/`; the original at the repo root is unchanged). Paths in code spans are relative to the repo root.

# PeraSure Playground

Phone-first motion prototypes. The repo is private; it is served at samge.studio behind a password (the Worker is in the repo `devmode-platform`).

**Open on your phone:** https://samge.studio/perasure/playground/ — a picker page with two tabs:
**Prototypes** (interactive flows) and **Animations** (illustration animations, played one at a time as Lottie or GSAP).

## Developer handoff (the PeraSure app)

What developers and QA build from is the **PeraSure app** ([`prototypes/app`](../../prototypes/app/README.md), the whole app as a test
environment) and the component library it is made of ([`shared/ps-ui`](../../shared/README.md)). The other prototypes are motion references:
the app already hosts the ones that ship (Withdraw, Credit limit increase, Order submit, OTP sheet).

- **Test app:** https://samge.studio/perasure/playground/prototypes/app/index.html (same sign-in as the picker)
- **Dev Mode:** https://samge.studio/devmode/?app=perasure — every page with all its states, every component and its states, specs,
  tokens, code, Figma links, statuses and the iteration record.

### Read in this order

1. **README.md** (this section): what is handed off, what is real and what is mock.
2. **[PRODUCT.md](PRODUCT.md)**: product rules. Credit, loans, coupons, the words we use. When a screen disagrees with PRODUCT.md, the
   screen is wrong.
3. **[DESIGN.md](DESIGN.md)**: the visual system. Tokens, type, spacing, components, motion, responsive rules. Figma wins if they differ.
4. **Dev Mode**: each page's states (and how to reach each one), each iteration's before | after | difference.
5. **[API.md](API.md)**: what each screen needs from a server (skeleton: domains and screens mapped, endpoints still to write).
6. **[docs/qa/](docs/qa/acceptance.md)**: the acceptance checklist and the [device matrix](docs/qa/devices.md).

Then as needed: [docs/decisions/](docs/decisions/README.md) (why the rules are what they are), [CHANGELOG.md](CHANGELOG.md) (what changed
for developers), [tokens/README.md](../../tokens/README.md) and [tokens/CHANGELOG.md](../../tokens/CHANGELOG.md), [reviews/](reviews/README.md).

### Status legend

Each page and component has a dev status in `devmode/data/status.js`, shown in Dev Mode, following Figma Dev Mode's model. Anything not
listed there is `ready` since the v1.0 baseline.

| Status | Meaning | What a developer does |
|---|---|---|
| **ready** | Ready for dev | Build it; Dev Mode's states and the iteration are the spec |
| **changed** | Was ready or completed, changed by an iteration since | Read that iteration in Dev Mode and its CHANGELOG line, update the build |
| **completed** | Built and accepted (set when the owner says so) | Nothing; a later change moves it back to `changed` |

### Reference, mock or demo-only

The production app will be built against a real backend. This table says what to copy and what to throw away.

| Part | Label | What it means for you |
|---|---|---|
| `tokens/`, `tokens-rem/` | **Reference** | Match exactly. Generated from the Figma design system; see [tokens/README.md](../../tokens/README.md) |
| `shared/ps-ui/` components and motion values (`PS.MT`) | **Reference** | The visual and interaction contract. Port or reuse; match states and motion |
| `prototypes/app/screens-*.js`: flow, states, copy | **Reference for behaviour**, not for data | Copy what happens on each tap and each state; replace every data access with the API |
| Hosted motion (`prototypes/withdraw-fund-flow/withdraw.js`, Credit limit increase, Order submit, OTP sheet) | **Reference** | Port from the code; timing and values are final ([decision 0006](docs/decisions/0006-existing-animations-kept.md)) |
| `prototypes/app/data.js`, `coupons-data.js` (credit numbers, coupons, plans, sample loans), made-up loading (`APP.useLoad`, `APP.run`), codes that always work | **Mock** | Numbers are samples. In production every amount, date and breakdown comes from the server (API.md) |
| `prototypes/app/ph-places.js` | Reference data | PSA PSGC 2025-2Q; whether the API serves it is open (API.md K) |
| Tune (`shared/ps-ui/tune.js`), `?fast=` `?auto=` and other demo links, `devmode/`, `tools/`, `shared/stage.html`, `shared/gallery*.js`, the picker and the player | **Demo-only** | Do not ship. Tune states map to server states (API.md §3) |
| `vendor/` | Third-party | Use the package version named in the folder |
| `assets/fonts/` (Hanken Grotesk, Inter, Reddit Sans) | Reference | The fonts to ship (`fonts-2026.11.17.css`) |

### Internal files (not part of the developer contract)

| File | What it is | Rely on it? |
|---|---|---|
| `CLAUDE.md`, `AGENTS.md`, `.claude/skills/` | Working guide and skills for the AI agents that build the prototypes | No, except the tone of voice skill, which PRODUCT.md points to |
| `devmode/snapshots/` | Runnable copies of earlier versions, for Dev Mode's compare | No |

## Prototypes

| Demo | Variants |
| --- | --- |
| First application | [Standard](../../prototypes/first-application/index.html) (log in → code → home before a limit → the application → Submit → credit limit ready, on the app's own screens; Tune: forms empty / filled in, after Submit, code / ID / selfie outcomes) · [guide](../../prototypes/first-application/README.md) |
| PeraSure app | [Test app](../../prototypes/app/index.html) (the whole app as a test environment: every account and loan state in Tune, made-up loading; in progress) · [guide](../../prototypes/app/README.md) |
| Coupon system | [Standard](../../prototypes/coupon-system/index.html) (home / account → coupon centre → apply a loan with coupons; Tune: blur, six / one / no coupons) · [guide](../../prototypes/coupon-system/README.md) |
| PeraSure Dev Mode | [Desktop](https://samge.studio/devmode/?app=perasure) (every page and shared component, inspected like Figma Dev Mode: specs, tokens, code, iterations, version compare; platform repo `devmode-platform`) · [guide](../../devmode/README.md) · [component docs](../../shared/README.md) |
| Change co-maker | [Standard](../../prototypes/co-maker-change/index.html) (Change → card morphs into the form; Cancel / Save morph back) · [guide](../../prototypes/co-maker-change/README.md) |
| Credit limit increase | [Baked heap](../../prototypes/credit-limit-coins/baked/baked-heap.html) (deliverable) · [Baked heap + shockwave](../../prototypes/credit-limit-coins/baked/baked-shockwave.html) (variant) · [Physics tuner](../../prototypes/credit-limit-coins/physics-tuner/physics-tuner.html) (engineering file for tuning, not shipped) · [integration guide](../../prototypes/credit-limit-coins/README.md) |
| Withdraw fund flow | [Standard](../../prototypes/withdraw-fund-flow/index.html) (Tune: gradient blur, card amounts, motion feel) · [Credit limit increase · credit unused](../../prototypes/withdraw-fund-flow/with-credit-limit.html) (the Credit limit animation first, closing in to the home card; the available amount carries over) · [Credit limit increase · credit partly used](../../prototypes/withdraw-fund-flow/with-credit-limit-used.html) (the total credit goes up and lands on "Total credit"; the available amount counts up) · [guide](../../prototypes/withdraw-fund-flow/README.md) |
| Order submit | [Standard](../../prototypes/order-submit/index.html) |
| OTP sheet morph | [Standard](../../prototypes/otp-sheet-morph/index.html) |
| Loading page | [Standard](../../prototypes/loading-page/index.html) |
| Landing page (website) | [Standard](../../prototypes/landing-page/index.html) |

## Animations

Open the **Animations** tab on the picker, tap an animation, and it plays in the player
(`animations/player.html?a=<name>`): intro once → seamless loop, as specified in each hand-off README.
The player has replay, play/pause, a frame scrubber, speed (1× / 0.5× / 0.25× / 2×), background
swatches, prev / next (or swipe on the animation), and a menu button (top right) that lists every animation. Only one animation plays at a time; the list
shows still thumbnails.

| Animation | Playback |
| --- | --- |
| Coupon · percentage discount | GSAP only · intro 0–66 → loop 66–210 (60 fps) |
| Coupon · amount discount | GSAP only · intro 0–66 → loop 66–210 (60 fps) |
| Coupon · credit limit increase | GSAP only · intro 0–66 → loop 66–210 (60 fps) |
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
The coupon icons are GSAP only: animated straight from the Figma SVGs (Figma file `5nVoWWFTfqPDWrABYG6BsW`), with no
Lottie file, so the player opens them in GSAP and greys out Lottie. Each badge is drawn as a flat-coloured object with real
thickness (coin edge, recess, raised ₱ / % / arrow) and one light from the right — the side Figma's shadow on the ticket
comes from — so every hard shadow and tone agrees with it while the badge turns. Like Figma, the recess is white on one
side (its lit lip) and shadow on the other, and the ₱ / % / arrow are white with their shadow on one side. No SVG filters,
no gradients.

To add one: put the `.json` (plus `.lottie` and a `preview.png`) in `animations/<name>/`, the GSAP module (if
any) in `animations/<name>/gsap/`, and add an entry to `animations/animations.js`. Rendered with
[lottie-web](https://github.com/airbnb/lottie-web) (SVG renderer) and GSAP 3.15.

## Design tokens

`tokens/` holds the PeraSure design system's tokens from Figma, versioned: `tokens.css` (CSS variables, shadow /
gradient variables, `.ps-text-*` type classes), `tokens.json` (W3C Design Tokens format) and `CHANGELOG.md` (what
changed in each version, dated, with the impact on code). Each version is tagged `tokens-v<version>`. To update:
export with the Figma plugin and upload into `tokens/inbox`, or ask Claude. Not shown on the picker. See
[tokens/README.md](../../tokens/README.md).

## Shared components

`shared/ps-ui/` holds the PeraSure screens' building blocks as configurable React components — header and bottom
bars, tab bar, sheets, home cards, coupon tickets, the loan page cards, account rows and more — styled only with the
design tokens. A prototype puts them together with its own data; change a component once and every prototype built on
it changes with it. Live, with every state: [PeraSure Dev Mode → Components](https://samge.studio/devmode/?app=perasure#v=components) · docs and props:
[`shared/README.md`](../../shared/README.md). The Coupon system demo is the first one built this way; older demos keep
their own code for now.

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
   For a PeraSure app screen, start from `prototypes/coupon-system/index.html` instead and build it from the shared
   components (`shared/ps-ui/`).
2. Open the root `index.html`, find the `DEMOS` list near the bottom and copy an entry:
   title, a one-line description, and one line per variant (the first one is shown as recommended).
3. Add a row to the table above, commit to `main` and push. The live site updates in about a minute.

There is nothing to build. New prototypes link the shared fonts (`assets/fonts/fonts-2026.11.17.css`) and libraries
(`vendor/`) instead of packing them into the page, as the app already has them; the page itself then holds only
the prototype's own code and data. Older demos are single self-contained files and keep working as they are.

## Skills

PeraSure skills for AI assistants live in [`.claude/skills/`](../../.claude/skills):

| Skill | What it is |
| --- | --- |
| [perasure-tone-of-voice](../../.claude/skills/perasure-tone-of-voice/SKILL.md) | the tone of voice: every piece of PeraSure copy follows it |
| [perasure-card-morph](../../.claude/skills/perasure-card-morph/SKILL.md) | the card morph motion of the withdraw fund flow and Change co-maker — core rules, references per kind of morph (card → form, page → card, checks), engine and a working example |

