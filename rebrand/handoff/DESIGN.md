# DESIGN.md — PeraSure

How PeraSure looks, feels and moves, written for designers, developers and AI agents. It follows the
[awesome-design-md](https://github.com/VoltAgent/awesome-design-md) layout, as CashSaya's does.

Sources of truth, in order:
1. **Figma.** Design system `OBsvf42AiRapcRrasD7KNm` (variables, styles, components) and app file `barda5NcnFzxG7CHtISKsW` (page
   `38:1137`). If anything here disagrees with Figma, Figma wins.
2. **`tokens/`** (generated from the design system by `tools/sync-tokens.py`, version in `tokens/version.json`, history in
   `tokens/CHANGELOG.md`) and **`tokens-rem/`** (the same lengths in rem).
3. **`shared/ps-ui`** (the components) and **PeraSure Dev Mode** (https://samge.studio/devmode/?app=perasure), which shows every page,
   component, state and the tokens each one uses.

Product rules (what a loan is, what we may say) live in [PRODUCT.md](PRODUCT.md); how to work on the repo lives in `CLAUDE.md`.

> Chapters marked **TODO (owner)** need the owner's words: the facts below come from the repo; the "why" and the mood have not been written
> down yet.

---

## 01 · Overview — visual theme and atmosphere

PeraSure is a phone-first lending app for the Philippines: check how much you can borrow, borrow, repay. Voice:
**straightforward kindness · everyday magic · warm wit** (`perasure-tone-of-voice`).

TODO (owner): the visual mood in a few words (what it should feel like, reference apps).

| Trait | What it means |
|---|---|
| **Phone first** | Designed at 360 wide; layouts fill the width with 16 px page margins. Checked at 360, 390 and 430. See 10 · Responsive. |
| **Everything is a token** | Colours, type, spacing and radius come from the design system's variables and styles; a value with no token goes into `ps-ui.css` `:root` as `--ps-*` with a note. |
| **Components first** | A new piece is a component in `shared/ps-ui` with its states in the gallery before a page uses it; pages only place components. |
| **Sizes in rem** | 1 rem = 16 design px at the default text size; px only for hairlines, shadows, blurs, the status strip and max widths. |
| **Refined motion, never in the way** | Reuse the repo's motion values (`PS.MT`); animate transform and opacity; existing animations are never re-imagined. |
| **Animations replace stills** | Wherever Figma shows a still that has an animation in `animations/`, the app plays it. |

---

## 02 · Colors — palette and roles

Screens use **semantic tokens only**, never a primitive or a hex. In code: `var(--color-…)`, defined in `tokens/tokens.css`.

| Group (CSS prefix) | Used for |
|---|---|
| `--color-text-*` | Text |
| `--color-icon-*` | Icons |
| `--color-surface-*` | Fills: page (`--color-surface-page-default`), cards, sheets |
| `--color-stroke-*` | Borders and dividers |
| `--color-action-*` | Buttons and other controls |
| `--color-brand-*` | Brand colour |
| `--color-positive-*` / `--color-negative-*` | Success / error meaning only |
| `--color-ambient-*` | The ambient page tint (#F0F5F4) used by the bars' veils |
| `--color-overlay-*`, `--color-alpha-*` | Scrims and see-through colours |
| `--gradient-*` | Bar veils (see 06), card gradients |
| Primitive scales (`neutral`, `blue`, `green`, `red`, …) | Only inside the token files; never in a screen |

TODO (owner): the role of each brand colour, and whether there is a Dark mode.

Don't paste the token table here: Dev Mode's Tokens tab reads `tokens/tokens.css` live. Old names that an update removed stay usable from
`tokens/legacy/<version>.css`.

---

## 03 · Typography

| Family | CSS variable | Used for |
|---|---|---|
| **Hanken Grotesk** | `--ps-font-text` | Headlines, titles, list numbers (Tips 1 2 3) |
| **Inter** | `--ps-font-body` | Body text, labels, small notes beside an amount (Total credit, Used / Available, old prices) |
| **Reddit Sans** | `--ps-font-num` | **Emphasised amounts only**, always in a Number style; it has its own ₱ |

Text styles are classes from the tokens (`.ps-text-*` / `.ps-t-*`): display xl–sm, headline, title lg–sm, section-title md–xs (+ light),
body lg–md (+ emphasis), label md–sm (+ light), caption sm–xs, link, number xs–xxl.

Number styles (all Bold): `xs 16/20 +2 %` · `sm 18/24 +3 %` · `md 24/32 0` · `lg 32/40 +2 %` · `xl 36/100 % +4 %` · `xxl 48/100 % +3 %`.
A title with an amount in it ("+₱5,000", "₱300 OFF") keeps its own font; only its ₱ is the number font. An amount at a size with no
Number style: ask the owner which style it takes. Details: `shared/README.md` → "Number font".

Fonts ship from `assets/fonts/` (`fonts-2026.11.17.css`).

---

## 04 · Layout and spacing

- Page margin **16** at every width; content grows with the width.
- Spacing tokens: `--spacing-0 … --spacing-56` (in rem from `tokens-rem/`).
- Positions and sizes come from Figma node geometry; each page is laid over its frame (Figma | app | difference) before it counts as done.
  `prototypes/app/README.md` → "Compared with Figma" lists what has been compared.

### Page anatomy

| Page kind | Header | Bottom |
|---|---|---|
| Primary (Home / Payment / Account tabs) | `--gradient-top-nav-filled` | tab bar `--gradient-bottom-primary-nav-filled` |
| Secondary (every other page) | solid `--color-surface-page-default` | `--gradient-bottom-secondary-nav-filled` |
| Amount entry and order page | `--gradient-top-nav-filled` | `--gradient-bottom-secondary-nav-filled` |

The header's veil appears as content scrolls under it; the bottom veil fades out over the last stretch of scroll. A page that doesn't
scroll shows none.

TODO (owner): grid, safe areas and spacing rules between sections, if any beyond Figma.

---

## 05 · Shapes

Radius tokens: `--radius-none / xs / sm / md / lg / xl / xxl / full` (and numeric `--radius-0 … --radius-999`).

TODO (owner): which radius goes with which kind of element (cards, sheets, buttons, chips).

---

## 06 · Elevation and depth

- **Default shadow** on Home's blue card, the payment card and the updates strip.
- **No progressive blur** on bars (since tokens v2026.11.17); glass buttons and the tab bar's pill keep their own background blur.
- Sheets whose content scrolls have a veil at the top (the sheet's own colour, 80 % → 0); the drag handle is always the top layer.

TODO (owner): the shadow scale and when each level is used.

---

## 07 · Components

The library is **`shared/ps-ui`** (React, configurable; every state a prop). Index and props: [shared/README.md](../../shared/README.md). Every
component with all its states: Dev Mode → Components. Design-system components matched one-to-one to their `PS.*` twins:
`devmode/data/figma-links.js`.

Granularity: atoms (amount, button, tag, chip, check, icon), bars (top / bottom / navigator), sheets, and each functional card (credit card,
payment card, home coupons, coupon ticket, coupon row, amount card, order details, protection, method, profile, credit limit, menu…).

Icons are Figma exports (`shared/ps-ui/assets/icons`); never redrawn. Payment logos are 24 px.

---

## 08 · Motion

| Rule | Detail |
|---|---|
| Library | Motion 14.4.0 (`LazyMotion` + `m`), GSAP 3.15 for illustration timelines, lottie-web 5.12.2 for Lottie |
| Values | `PS.MT` in `shared/ps-ui/core.js` (from Withdraw's `motion-tokens.js`): Smooth spring 240 / 30 / 1; ENTER / LEAVE crossfade with a 3 px blur; press 60 ms, scale 0.985 / 0.92 |
| Page changes | Crossfade, never a sideways slide (`PS.Pages`) |
| Loading | The Loading page covers the whole screen (`PS.Cover`); what was waited for rises in piece by piece (`PS.Rise`) |
| Popovers | The only thing that bounces (`PS.MT.MENU`): grow from where the finger tapped |
| Toasts | At the top under the header; the new one covers the old (stack of 3); swipe left to close |
| Selections | Colour only, 150 ms. Numbers that follow a slider never animate |
| Carousels of animations | Only the card on screen plays, from the start each time it is swiped to |
| Existing animations | Brought in as they are (Withdraw morphs, Credit limit increase, Order submit, OTP sheet): never re-imagined |
| Performance | Animate `transform` / `opacity`; respect `prefers-reduced-motion` |

Card morphs follow the `perasure-card-morph` skill.

---

## 09 · Do's and don'ts

| Do | Don't |
|---|---|
| Use semantic tokens and the text-style classes | Paste a hex, a raw size or loose font settings |
| Build the piece in `shared/ps-ui` first, with gallery states | Patch a component's look from a page |
| Use rem; `min-height` on text boxes | Fixed px sizes (except hairlines, shadows, blurs) |
| Use Reddit Sans only for emphasised amounts | Use it for small labels or list numbers |
| Play the animation where one exists | Show a still where an animation exists |

TODO (owner): add the do's and don'ts you find yourself repeating in reviews.

---

## 10 · Responsive

- Layouts fill the width with 16 px margins; checked at **360, 390 and 430** wide.
- **Screen fit** (Tune): capped zoom (default: the 360 design enlarged with the screen, at most 1.15×) · capped zoom · rem · 1:1 · full zoom.
  The owner is still comparing them on phones. TODO (owner): the fit mode for production.
- **Text size follows the phone** (Android font size; the product is Android only — the demos also read iOS Dynamic Type). Up to 130 % the whole layout follows; above that only text grows;
  capped at 150 % until every component holds 200 %.

---

## 11 · Iteration guide

- Every requirement that changes a page, a component or a motion is recorded as **one iteration** in Dev Mode (skill
  `perasure-iteration-log`): an entry in `devmode/data/iterations.js`, statuses in `devmode/data/status.js`, a runnable snapshot and a git tag.
- Token updates go through `tools/sync-tokens.py` only; each gets a version, a `tokens/CHANGELOG.md` entry with *Developer impact*, and a
  `tokens-v<version>` tag.
- Developer-facing changes also get a line in [CHANGELOG.md](CHANGELOG.md).

### Known gaps

- TODO: list Figma values with no token, pieces drawn on screens that should be components, and differences kept on purpose
  (`prototypes/app/README.md` → "Compared with Figma" has the current list).

---

## Agent prompt guide

When generating PeraSure UI: use `shared/ps-ui` components and the tokens only; rem sizes; Hanken Grotesk / Inter / Reddit Sans as in 03;
copy from the `perasure-tone-of-voice` skill; one set of numbers (PRODUCT.md); motion values from `PS.MT`; check at 360 / 390 / 430.
