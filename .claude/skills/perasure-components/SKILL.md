---
name: perasure-components
description: Components first for every PeraSure screen or feature — a new piece of UI is made as a shared component (with its states as props and a gallery entry) before any page uses it, and a change to a piece is made in the component. Use whenever building, changing or reviewing PeraSure screens, prototypes or app code, in the Playground repo or any other PeraSure project.
---

# PeraSure: components first

The owner's rule for every PeraSure project: **a new component or feature is created in the component library first,
then the page uses it directly.** Pages hold the flow, the data and where things sit — never a look of their own.

## The order, every time

1. **Look for it.** Check the library (and its gallery) for a component that already does this. A new variant of an
   existing piece is a new prop or state on that component, not a copy.
2. **Build it in the library.** Give it a name for what it is (`IdResult`, `PlanRows`, not `Box2`), every state as a
   prop (`state`, `tone`, `variant`, `size`, booleans), styles from the design tokens only (a value with no token gets a
   named variable with a note), sizes in rem, the repo's motion values. Write its props in a comment right above it.
3. **Show it in the gallery** with every state the product uses (tap the chips to switch), in the same change.
4. **Then use it on the page** by passing data and states as props. The page's own CSS may only place shared pieces
   (gaps, margins, absolute positions); it never restyles a component.
5. **Changing a piece** later — a colour, a spacing, a new state the designer asked for — is done in the component, so
   the gallery and every page using it change together. Never patch the look from a page (no page CSS aimed at a
   component's classes, no inline styles that change its look).
6. **Renaming or removing** a prop or class: update every page that uses it in the same change.

Checking: before calling it done, open the gallery and confirm the new states are there; a page that moved to a
component must look the same as before (compare screenshots pixel for pixel).

## In the Playground repo (`samgestudio-dev/Perasure`)

- Library: `shared/ps-ui/` (React, no build step; `PS.<Name>`; styles in `ps-ui.css`). File by area: `core.js`,
  `layout.js`, `form.js`, `feedback.js`, `coupon.js`, `home.js`, `loan.js`, `pay.js`, `account.js`, `list.js`,
  `status.js`, `apply.js`, `fx.js` — the table is in `shared/README.md`.
- Gallery entries: `shared/gallery.js` and `gallery-app.js` (`name`, `desc`, `props`, `states`), shown in PeraSure Dev Mode →
  Components (`devmode/index.html#v=components`), which replaced the gallery page.
- A change to a component or a page is also an iteration: record it with `perasure-iteration-log`.
- After changing shared files run `python3 tools/stamp.py` (cache stamps).
- The full app (`prototypes/app/`) follows this too: `app.css` only places shared pieces.

## In another PeraSure project

Use that project's component library and its catalogue (Storybook or similar) in the same order. If it has none yet,
start one (a components folder plus a page that shows each component's states) before building screens, and follow
the PeraSure design tokens. Copy follows the `perasure-tone-of-voice` skill; card and page morphs follow
`perasure-card-morph`.

## Global look rules (owner, tokens v2026.11.17)

- **Number font** (Reddit Sans, token Font/Family/Number) only for emphasised amounts, always in a Number style (`.ps-t-number-*`,
  `PS.Amount{num}`); notes beside an amount are Inter; a title keeps its font and only its ₱ is the number font (`PS.Peso`).
- **Bars**: no progressive blur. Tab pages: header Top-nav-filled, tab bar Bottom-primary-nav-filled. Secondary pages: solid header,
  Bottom-secondary-nav-filled. Amount entry / order page: header Top-nav-filled, bottom secondary.
- Full rules: the repo's `CLAUDE.md` ("Number font", "Header and bottom bars") and `shared/README.md`.
