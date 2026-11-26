# Shared components (`shared/ps-ui`)

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** you build or change a UI component, its states or its gallery entry. Skill: `perasure-components`.

## Shared components (`shared/ps-ui`)

PeraSure app screens are built from shared, configurable React components (owner's rule): the look lives in
`shared/ps-ui` once, a prototype passes its data and states as props, so updating a component updates every prototype
built on it. Details and the head block to copy: `shared/README.md`; reference prototype: `prototypes/coupon-system/`.

- A new prototype of an app screen uses the components, and anything missing is added to `shared/ps-ui` (and the gallery) first —
  never built in the page (see "Components first" in [AGENTS.md](../../AGENTS.md)).
  Older prototypes keep their own code until the owner asks to move them over; never edit them to adopt it unasked.
- Granularity (owner: "functional cards and states as components"): atoms (amount, button, tag, chip, check, icon),
  bars (top / bottom / navigator), sheets, and each functional card (credit card, payment card, home coupons, coupon
  ticket, coupon row, amount card, order details, protection, method, profile, credit limit, menu…). Every state is a
  prop (`state`, `on`, `tone`, `variant`) and has a gallery entry (`shared/gallery.js` / `gallery-app.js`, shown in Dev Mode → Components) —
  add new states there too.
- Styles only from the tokens; a value with no token goes into `:root` of `ps-ui.css` as `--ps-*` with a note.
- **Sizes in rem, never a fixed px** (owner): 1rem = 16 design px at the default text size; tokens from `tokens-rem/` (load it after
  `tokens/tokens.css`). px only for hairlines (1–2 px strokes), shadows, blurs, the 40 px status strip above the screen
  (`calc(40px + 4.75rem)` = the 116 px header line) and a page's max width. JS lengths: `PS.rem(n)`, `PS.y(n)` (from the frame's top),
  `PS.px(n)` (geometry). Text boxes get `min-height`, not `height`. Check at the default text size (it must look exactly as before)
  and at 130 % / 150 % (Tune → Text size).
- Motion (owner: refined and just right, never in the way): reuse the repo's values — `PS.MT` in `core.js` is withdraw's
  `motion-tokens.js` (Smooth spring 240/30/1, ENTER/LEAVE crossfade with 3 px blur, press 60 ms 0.985 / 0.92). Numbers that
  follow a slider never animate; selection states change colour only (150 ms); leaving pages and sheets take no taps.
  Details: `shared/README.md` → "Rules for changing components".
- Responsive (see "Requirements for a demo page" in [demo-pages.md](demo-pages.md)): no fixed 360 px widths in `ps-ui.css`; fixed sizes only for things
  that are fixed in Figma (icons, pictures, buttons' heights). Fit mode: capped zoom ≤ 1.15× by default.
- The amount slider follows the finger at once; when something else moves it (a coupon raises or removes the limit,
  "Keep coupon" sets the amount) the knob, fill and amount glide there on the Smooth spring (`PS.AmountCard`).
- Coupon illustrations: the Figma version with the green badge — with shadow and white outline from 40 px up, the plain
  small version at 36 px (`PS.CouponArt` picks it).
- Renaming / removing a prop or class: update every prototype using it in the same commit (`grep -rl "PS\.<Name>"`).
- Links to these files carry `?v=<stamp>`; `python3 tools/stamp.py` updates them (prototypes and the gallery).
