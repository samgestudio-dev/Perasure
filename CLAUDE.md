# PeraSure Playground — agent guide

Phone-first motion prototypes for PeraSure. The repo is private: a Cloudflare Worker serves `main` at samge.studio behind a password,
read straight from GitHub (the Worker lives in the repo `samgestudio-dev/devmode-platform`, `worker/`, guide `worker/README.md`).

- Live picker: https://samge.studio/perasure/playground/ · Dev Mode: https://samge.studio/devmode/?app=perasure
- Each demo is opened and tested on a real phone (iOS Safari and Android Chrome).
- The owner is a designer; reply in plain language and keep the picker page tidy.
- **`main` is the rebrand v3** (navy + green, since 2026-11-26). The old **blue** version is **legacy**: branch `legacy/blue`
  and tag `legacy-blue` (frozen, don't build on it). Its CSS names and values stay usable through
  `tokens/legacy/2026.11.17.css` (load it after `tokens/tokens.css`).

## Components first (owner's rule — this repo and every PeraSure project)

**A new component or feature is created in the component library first, then the page uses it directly.** Here the library is
`shared/ps-ui` and its gallery entries (`shared/gallery.js` / `gallery-app.js`, shown in PeraSure Dev Mode → Components): build the piece
there (every state a prop, tokens only, rem), add its states to the gallery entries in the same commit, then use it from the page. A change to a piece (a colour, a spacing, a new state) is made in the
component, never patched from a page — page CSS only places shared pieces, and never targets a component's classes. Skill:
`perasure-components`.

## PeraSure skills (use them on every PeraSure task)

`.claude/skills/` holds the PeraSure skills; Claude Code loads them from here, and they are also meant for any other
PeraSure-related project (fetch from `https://raw.githubusercontent.com/samgestudio-dev/Perasure/main/.claude/skills/…`).

- **`perasure-tone-of-voice`** — the owner's tone of voice. All PeraSure copy (screens in prototypes included: titles,
  buttons, placeholders, errors, notes) follows it, in this repo and in any PeraSure-related project.
- **`perasure-components`** — components first: a new piece of UI or feature is made in the component library (with its states
  and a gallery entry) before any page uses it, and changes are made in the component. Every PeraSure project, every screen.
- **`perasure-iteration-log`** — recording an iteration in PeraSure Dev Mode: every new requirement (a Jira ticket or not) that changes a
  page, a component or a motion gets an entry in `devmode/data/iterations.js` (UI / motion, pages, components, before → after), its
  statuses, a runnable snapshot and a git tag. Use it whenever such a change is committed.
- **`perasure-card-morph`** — the card morph motion of the withdraw fund flow and Change co-maker (a card or page turning
  into another state). Any new morph starts from its `example.html` + `engine.js` and keeps its rules, so the motion is
  the same everywhere. When a morph in a prototype is changed for the owner, update the skill too if the rule changed.

How skills are organised (owner's rule): a different kind of task gets its own skill; branches of the same task share one
short `SKILL.md` (when to use it, what every branch needs, which reference to read when) plus reference files read only
when that branch comes up. Don't cut files small to save tokens — the aim is that a task reads as little unrelated
content as possible.

## Layout

```
index.html                 picker ("Playground"): "Prototypes" tab (DEMOS array) + "Animations" tab (reads animations/animations.js)
assets/playground-ui.js    shared Material UI theme + icons for the picker and the player (window.PG)
assets/fonts/              the app's fonts (Hanken Grotesk, Inter, Reddit Sans; Satoshi kept for old versions) + fonts-2026.11.17.css —
                           shared by all prototypes (fonts.css is the frozen version before 2026.11.17: old Dev Mode snapshots link it)
prototypes/_template/index.html  starting point for a new prototype (links the shared fonts and libraries); not on the picker
shared/ps-ui/              PeraSure UI components (React, configurable): ps-ui.css (tokens only), core.js, layout.js, home.js,
                           coupon.js, loan.js, account.js, phone-fit.js, tune.js/.css, assets/ — see "Shared components"
                           + feedback.js (loaders, status, result), form.js (fields, OTP, keypad), status.js (home states), pay.js (repayments),
                           list.js (links, facts, activity, inbox, history, hub), fx.js (Order submit, OTP sheet, Credit limit intro),
                           apply.js (page head, cameras, selfie, ID sides and result, documents, search sheets, address picker, estimate, help articles),
                           withdraw-host.js (runs the Withdraw demo's loan screen from the demo's own code)
shared/gallery.js, gallery-app.js  every shared component's states (one entry each: name, desc, props, states) — shown in Dev Mode
shared/stage.html          draws one state of one entry (?entry=&state=): Dev Mode's canvas for a component
shared/gallery.html        only forwards old links to Dev Mode → Components
devmode/                   what PeraSure Dev Mode reads (the platform is the repo devmode-platform, at samge.studio/devmode/?app=perasure):
                           app.js (adapter), data/, snapshots/, iterations/, inspector.js — see "PeraSure Dev Mode" and devmode/README.md;
tools/devmode-index.py     makes devmode/data/index.js from the code (stamp.py runs it); devmode-snapshot.py saves a version's runnable copy
shared/README.md           how to use the components, files, rules for changing them
prototypes/app/            the whole app as a test environment ("PeraSure app") — see "The full app"
prototypes/<slug>/index.html    main / recommended variant of a demo
prototypes/<slug>/<variant>.html  other variants of the same demo (optional)
animations/animations.js       Lottie registry (LOTTIES array) — shared by the picker and the player
animations/player.html         player, one animation at a time: player.html?a=<slug>[&r=gsap] (Lottie / GSAP tabs)
animations/<slug>/             <slug>.json (+ <slug>.lottie, preview.png, gsap/<module>.js)
tools/                     flatten-lottie-masks.py, flatten-svg-masks.py (Safari mask-blur fixes), unscale-gsap-svg.py (Safari scale glitch)
tokens/                    versioned design tokens from the Figma design system (tokens.css, tokens.json, CHANGELOG.md, snapshot)
                           — not shown on the picker; updated only through tools/sync-tokens.py (see "Updating tokens")
tokens-rem/                the same length tokens in rem (tokens-rem.css), MADE by tools/rem-tokens.py from tokens/tokens.css
                           (stamp.py runs it) — never edit it or the token files by hand; used by the app and shared/ps-ui
tools/figma-tokens/        Figma side of the token pipeline: core.js (export + digest) and the export plugin
.github/workflows/tokens.yml  applies exports dropped in tokens/inbox/, tags tokens-v<version>, checks generated files
.github/workflows/devmode.yml tags each Dev Mode snapshot's commit devmode-<id>
.github/workflows/devmode-visual.yml  the Dev Mode visual check on every push (tools/devmode-visual.mjs) → branch devmode-visual
.github/workflows/devmode-live.yml    Dev Mode data as JSON → branch devmode-mcp (for the hosted MCP in devmode-platform)
vendor/<lib>@<version>/    pinned libraries: lottie-web, gsap (+ plugins; esm/ = ES modules), react, react-dom, mui-material,
                           motion (motion-react.js = React API, motion.js = vanilla; both set window.Motion), matter-js,
                           react-wheel-picker (the package's dist/index.js unchanged in a small wrapper → window.WheelPicker; + style.css)
README.md                  human-facing summary + demo / animation tables
.claude/skills/            PeraSure skills: perasure-components (components first), perasure-tone-of-voice (all copy), perasure-card-morph (morph motion: short SKILL.md,
                           references/ read per branch, engine.js, example.html) — see "PeraSure skills"
.nojekyll                  keep: Pages serves files as-is
```

`<slug>` is lowercase-kebab-case, e.g. `withdraw-fund-flow`, `repayment-success`.

## Adding a demo

1. Put the demo's file(s) in `prototypes/<slug>/` — for a new one, start from a copy of `prototypes/_template/index.html`
   (for a PeraSure app screen, from `prototypes/coupon-system/index.html`, built on the shared components). The recommended variant is `index.html` (exception:
   `credit-limit-coins` is split into `baked/` — the deliverable, `baked/baked-heap.html` + its css/js/`baked.json`, plus the
   `baked-shockwave.html` variant (same data and css, own js) — and
   `physics-tuner/` — the engineering file for tuning the coin paths and baking them, never shipped; the top-level
   `index.html` and `baked-heap.html` there only redirect old links);
   name other variants by what differs (`with-blur.html`, `snappy-spring.html`).
2. Register it in the `DEMOS` array in the root `index.html` (inside the `<script>`):

   ```js
   {
     title: 'Repayment success',          // sentence case, short
     tag: 'Loan',                          // optional small pill: product area / status
     desc: 'One sentence: what flow it covers and what motion to look at.',
     variants: [                           // first entry = recommended ("Recommended" label when there are several)
       { name: 'Standard', note: 'What is special about this variant', href: 'prototypes/repayment-success/index.html' },
       { name: 'Gentle spring', note: 'Slower, softer settle', href: 'prototypes/repayment-success/gentle.html' }
     ]
   }
   ```

   - Link to the file explicitly (`.../index.html`), not the folder — folder links break when the repo is opened locally.
   - Newest demo goes at the top of the array unless the owner says otherwise. Order set by the owner (keep it, in the
     `DEMOS` array and the README table): Credit limit increase, Withdraw fund flow, Order submit, OTP sheet morph,
     Loading page, Landing page (website). Newer ones sit above them, newest first; "PeraSure Dev Mode" (it replaced the gallery)
     stays right after Coupon system.
   - Only edit the `DEMOS` array for a normal addition; don't restyle the picker unless asked.
   - The picker and the player are React + Material UI 5 (browser builds in `vendor/`, no JSX, no build step;
     `PG.h` = `React.createElement`). Style through the theme in `assets/playground-ui.js`, not per page.
   - All Playground interface motion is Motion (`vendor/motion@14.4.0/motion-react.js`, `PG.m` / `PG.Mo`), never CSS
     transitions or the MUI ripple: springs from `PG.T` (ui / snap / pop / layout, defined by visualDuration + bounce),
     `whileTap: PG.TAP` on everything pressable, `layoutId` for indicators that move between options, `AnimatePresence`
     for content that swaps (button labels/icons via the player's `Swap`), and `layout` on cards so size changes
     animate. Exception: the player's timeline is painted per frame with no easing (it must show the exact time);
     the one exception is switching animations, when it glides back to 0 s in a fixed 0.2 s before the next one may start.
     An element that is still on the page after an interaction (or replaced by a similar one) stays put and only
     changes what differs (text swap, colour, size); it never disappears and plays its entrance again. Reloads keep
     the previous state on screen until the new one is ready (e.g. the renderer switch keeps a still frame).
3. Make the option screenshots shown on the index: `python3 tools/prototype-thumbs.py <slug>` (writes
   `prototypes/<slug>/preview.webp`, `preview-<variant>.webp`; adjust its `WAIT` if the first screen needs time).
4. Add a row to the demo table in `README.md`.
5. Removing or renaming a demo: update the folder, the `DEMOS` entry and the README row together.

## Adding a Lottie animation

1. Put the files in `animations/<slug>/`: the Lottie JSON (played), the `.lottie` (kept for hand-off; the player does not show it) and a still
   `preview.png` (thumbnail on the picker; never show animated thumbnails — one animation plays at a time).
2. Add an entry to `LOTTIES` in `animations/animations.js` (field reference at the top of that file):
   `intro` / `loop` frame ranges from the hand-off README (they match the `intro` / `loop` markers in the
   JSON); omit both for a one-shot; `success` for a two-part loading → success animation.
3. GSAP version (optional, shown under the player's "GSAP" tab): put the module(s) in `animations/<slug>/gsap/` and
   set `gsap` (and `gsapSuccess` for coin-style) in the entry. A module must export `create…(container,
   { autoplay })` returning `{ svg, timeline, … destroy() }` plus `FPS` / `FRAMES` — the format produced by
   lottie2gsap. It imports `"gsap"`, which the player's import map points at `vendor/gsap@3.15.0/esm/`.
   If its inline SVG has nested `<mask>`s, run `python3 tools/flatten-svg-masks.py <module>.js` (same Safari
   blur as below).
   Then run `python3 tools/unscale-gsap-svg.py <module>.js`: lottie2gsap draws shapes at 1/100 size inside
   `scale(0.01)` groups and enlarges them 100×; nested, that glitches on iOS Safari (Customer service chat's dots).
4. Add a row to the Lottie table in `README.md`. Don't edit `player.html` for a normal addition.
5. If any layer combines masks (an add mask plus intersect / subtract masks), run
   `python3 tools/flatten-lottie-masks.py in.json out.json` (needs `pip install skia-pathops`) and rebuild the
   `.lottie` from the result. lottie-web draws such layers with nested SVG `<mask>`s, which iOS Safari renders
   blurry when the art is scaled up; the script merges them into one exact clip shape (pixel-identical in Chrome).
6. Check for bitmap-traced shapes: `python3 tools/smooth-traced-path.py --report animations/<slug>/<slug>.json`.
   A traced path (many vertices on a half-pixel grid) shows jagged edges once scaled; rebuild it with
   `python3 tools/smooth-traced-path.py in.json out.json "<layer name>" 8 0.5`, then put the same path into
   the GSAP module's inline SVG and rebuild the `.lottie` (see the Customer service bubble).
7. Renderer: lottie-web SVG (`vendor/lottie-web@5.12.2/lottie_svg.min.js`). Don't switch to the canvas
   renderer — it mis-renders the masks in Doc verify and Safe transaction.

## Shared components (`shared/ps-ui`)

PeraSure app screens are built from shared, configurable React components (owner's rule): the look lives in
`shared/ps-ui` once, a prototype passes its data and states as props, so updating a component updates every prototype
built on it. Details and the head block to copy: `shared/README.md`; reference prototype: `prototypes/coupon-system/`.

- A new prototype of an app screen uses the components, and anything missing is added to `shared/ps-ui` (and the gallery) first —
  never built in the page (see "Components first" at the top).
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
- Responsive (see "Requirements for a demo page"): no fixed 360 px widths in `ps-ui.css`; fixed sizes only for things
  that are fixed in Figma (icons, pictures, buttons' heights). Fit mode: capped zoom ≤ 1.15× by default.
- The amount slider follows the finger at once; when something else moves it (a coupon raises or removes the limit,
  "Keep coupon" sets the amount) the knob, fill and amount glide there on the Smooth spring (`PS.AmountCard`).
- Coupon illustrations: the Figma version with the green badge — with shadow and white outline from 40 px up, the plain
  small version at 36 px (`PS.CouponArt` picks it).
- Renaming / removing a prop or class: update every prototype using it in the same commit (`grep -rl "PS\.<Name>"`).
- Links to these files carry `?v=<stamp>`; `python3 tools/stamp.py` updates them (prototypes and the gallery).

## The full app (`prototypes/app`)

One prototype that holds the whole app, like a test environment (owner's rule): every screen and motion piece in the repo plus the
rest of the app from Figma (file `barda5NcnFzxG7CHtISKsW`, page `38:1137`), built on the shared components. Guide: `prototypes/app/README.md`.

- **New work goes in here too.** When a new screen, flow or motion piece is added to the repo, add it to the app as well (a screen in
  `screens-*.js`, its states in Tune), so the app stays complete. Change co-maker and the landing page are not part of it.
- **The gallery keeps up with the app** (owner): a card, sheet content or other piece of the app's look is a shared component (`shared/ps-ui`)
  with its states in the gallery entries (`shared/gallery*.js`, shown in Dev Mode), added in the same commit as the screen that uses it — `app.css` / `screens-*.js` only place
  shared pieces and hold the flow. A visual change to a piece is made in the component, so the gallery shows it too.
- States that can't be reached by tapping are switched in Tune (account, loan, coupons, network, code / ID / selfie outcomes, inbox,
  rating). Also in Tune: Screen fit (default capped zoom 1.15×; "Capped zoom · rem" gives the same factor through the root font size), Text size
  (default: the phone's setting). (No progressive-blur setting any more: the bars have none since tokens v2026.11.17.)
- **Text size follows the phone** (owner asked for rem): `<meta name="text-scale" content="scale">` (Chrome / Android WebView) and
  Dynamic Type (iOS, read through `-apple-system-body`) set the root size in `phone-fit.js` (`PS_FIT.text`). Up to 130 % the whole layout
  follows; above that only text grows (`--ps-tx`); the phone's setting is capped at 150 % until every component holds 200 %. The hosted
  Withdraw demo is px (its own code) and follows only the screen fit. Loading is made up: `APP.useLoad` (a page's first data: random time, sometimes slow) and
  `APP.run` (an action); Tune → Network makes the first try fail (the "Something went wrong" state).
- Order submit plays only after Confirm on apply-a-loan (after the code).
- **Existing animations are never re-imagined** (owner): a motion that already exists in the repo (Withdraw: credit limit increase → home,
  home → amount entry, amount entry → order details; Order submit; OTP sheet…) is brought into the app as it is — the demo's code and values,
  the same timing and rules (Order submit: home only after the last line has held and the tick has finished). Read the demo before touching it.
  Ordering runs the Withdraw demo's own page code (`shared/ps-ui/withdraw-host.js` loads `prototypes/withdraw-fund-flow/withdraw.js`), so
  that file is used by the app too: keep its class, method names and the few lines listed in `PATCHES` there working when you change it.
- **Every way into ordering starts at the amount entry** (owner): `APP.borrow(couponId?)` — never straight to the order details.
- **Loading is the whole screen and nothing else** (owner): while a page loads, the Loading page covers everything (`PS.Cover`: no header, no
  bottom bar, no tab bar), never just the content area; Order submit likewise. A failed load shows the fallback page under the header. What
  was waited for then rises in piece by piece (`PS.Rise`).
- **Where things sit** (owner): the loader (a 72 px coin + dots) is in the very middle of the screen; Order submit's coin (72 px, the same) and text sit a little above the middle (`.ps-stage`);
  full-page empty states (`PS.EmptyState{page}`) and the fallback put their picture at Order submit's height.
- **Toasts sit at the top** (owner): under the header bar, like an iPhone notification (`PS.Toasts`). Every tap shows a new one at once (never
  queued or merged); the new one covers the old, which moves down a little, shrinks and fades (a stack of 3, not a list); a swipe left closes one.
- **Secondary pages** (owner): every page except the Home / Payment / Account tabs has a solid header in the page colour (`PS.Screen{secondary}`)
  and the secondary bottom (`Gradient/Bottom-secondary-nav-filled`); the immersive amount entry and the order page are not secondary pages
  (header `Gradient/Top-nav-filled`) but take the secondary bottom too (owner, 2026-11-17). Full rule: "Header and bottom bars" below.
- **Lists in the application are popovers** (owner, DS 7201:12032 — the bottom-sheet lists are retired): `PS.FormField{menu}` / `PS.Popover`.
  Like an iPhone menu they open centred on where the finger tapped, kept 8 px from the page's sides, and grow out of that point on a
  light-bounce spring (`PS.MT.MENU`, the one thing that bounces), rows following one after another; a picked row lights up, then it folds away.
  **Dates** use `PS.DatePicker` (DS 7628:14113); its month / year wheel is react-wheel-picker (`PS.Wheel`), not a hand-made one. The month wheel lists
  only the months of the year on show that can be picked, by name, no year (owner); it sits in the middle of the space between the month / year
  line and its buttons. The ‹ › arrows switch at once (a step past the range lands on its end; greyed out at the very end), a sideways swipe on
  the days changes the month. The days are always six rows; the weekday row never moves (owner).
- **Payment logos are 24 px** (owner) in the withdrawal method and bank lists.
- **The coupon picker** (owner, DS 10836:28988): tabs without counts; each coupon a white card (`PS.CouponOption`) — picking gives it a 1 px
  brand line inside (DS 10842:29606, over the strip too), the default shadow and the mark; the "Expires in" strip shows only with less than a day left, and only as the strip under the card (owner). Used by the app and
  the Coupon system demo. The coupon centre keeps its tickets (`PS.CouponTicket`).
- **Number font** (owner, tokens v2026.11.17): `Font/Family/Number` = **Reddit Sans** (it has its own ₱; before: Satoshi with ₱ from Inter).
  It is only for **emphasised amounts**, always in a Number text style — `Number/xs 16/20 +2 %`, `sm 18/24 +3 %`, `md 24/32 0`,
  `lg 32/40 +2 %`, `xl 36/100 % +4 %`, `xxl 48/100 % +3 %`, all Bold (`.ps-t-number-*`, `PS.Amount{num, decNum}`). Never for small notes
  and labels beside an amount (Total credit, Used / Available, an old price, the credit limit pill's "+₱…", "Previous limit") — those
  are Inter; never for list numbers (Tips 1 2 3 — Hanken). A title (a coupon's value "+₱5,000", "₱300 OFF") keeps its own font and
  only its ₱ is the number font (`PS.Peso`). An amount Figma sets at a size with no Number style takes the one the owner picks (OfferCard 28 → lg 32)
  — ask the owner. Amounts drawn one glyph per box (typed digits, the Withdraw morph) carry Reddit Sans's kerning as margins
  (`PS.KERN` / `PS.kern`, withdraw.js `Component.KERN`): split boxes don't kern. Details: `shared/README.md` → "Number font".
- **Applying** (owner): Your loan estimate → Basic info → ID type + both sides → Check the details → selfie → trusted contact → Submit
  (`APP.apply()`). Addresses are the Philippines' real Region → Province → City list (`prototypes/app/ph-places.js`, PSA PSGC).
- **Carousels of animations** (owner): only the card on screen plays, and it plays again from the start each time it is swiped to
  (`PS.Anim{active}`), e.g. "Protect yourself from scams".
- **One set of numbers** (owner): every amount and date that matters comes from `prototypes/app/coupons-data.js` (`NUM` → `CS.credit`: limit,
  used, temporary + its end date, total, available; `CS.current`: the loan being repaid, whose principal is the used credit) — never a number
  typed into a screen. Temporary credit is not a limit-increase coupon (that raises what one loan may borrow). Not in Tune, except the
  Temporary credit on / off switch (and Loan "No loan" → nothing used). Ordering takes the amount out of the available credit (`CS.take`).
  Table: `prototypes/app/README.md` → "One set of numbers".
- **What the Withdraw demo covers is the demo as on GitHub** (owner) — home card, sheet, amount entry, morph, the order page's blocks
  (order details, borrower protection and its Protected / Add button, withdrawal method, agreement + nudge), look and copy — apart from new
  features (the coupons section, its Discount row) and the numbers. Host it, never re-make it: `withdraw-host.js` patches only sample data
  and sizes (`PATCHES` / `WIDE`) and gives hooks (`host.blocks`, `order`, `extraRows`, `method…`, `on…`). Home's credit card is the demo's
  own (`APP.WdHero`), so the Credit limit increase closes into it with the demo's `introExit` in both credit states.
- **Same size on every page** (owner): nothing is scaled — the demo is laid out as wide as the frame (`host.width`). Its wrappers carry
  `.ps-wd` (ps-ui.css: what the demo's withdraw.css gives its elements — instant taps on iOS, caret blink, content-box).
- **Page changes crossfade** (owner), like home's tabs — never a sideways slide (`PS.Pages`).
- **Temporary credit is used first** (owner): the card's temporary amount is what is left of it (`CS.credit.temporaryLeft`). The amount entry's
  maximum is the available credit; a limit coupon raises it only on the order page, once ticked.
- **Default shadow** on home's blue card, payment card and updates strip (owner). Coupon pictures are Figma's SVG exports (`PS.CouponArt`).
- **Sheets** (owner): every sheet whose content scrolls has the coupon picker's veil at its top (the sheet's own colour, 80 % → 0, behind
  the search / tabs), so what scrolls up fades out; the drag handle is always the top layer.
- **Bars have no colour while they cover nothing** (owner): the header's veil appears as content scrolls under it, the bottom / tab bar's goes
  when the scroll reaches the end; both fade with the scroll (`PS.Screen`).
- **Tooltips place themselves** (owner, DS 9137:25806): `APP.tipAt(element, text)` / `PS.Tooltip{anchor}` — a corner covers what was tapped and
  reaches 12 px past it on both sides; never off screen.
- **Icons come from Figma** (owner): export the icon (`download_assets` on its node) into `shared/ps-ui/assets/icons`; don't redraw one.
- **Animations replace stills** (owner): wherever Figma shows a still that has an animation in `animations/`, the app plays the
  animation (`PS.Anim`, core.js): anti-scam cards, rating, sending code, every empty state and the fallback, loaders, order submit.
- **Spacing is checked against Figma, not judged by eye** (owner): positions and sizes come from the Figma node geometry, and each page
  is laid over its frame (Figma | app | difference) and corrected before it counts as done. `prototypes/app/README.md` lists what has
  been compared.
- Links: `?page=<screen>` opens a screen directly, `?auto=0` stops the app typing codes and moving on by itself.
- **Demos that run the app's screens** (owner: "the app has the content, give me the flow"): a flow demo loads `prototypes/app/*.js` as they are and
  sets only its path in its own `flow.js` (wrapping `APP.go` / `swap` / `set`) — e.g. `prototypes/first-application/`. The names it relies on are
  listed at the top of its `flow.js`; when you rename an app screen, a user state or a form key, update those demos in the same commit.

## PeraSure Dev Mode (`devmode/` — data only; the platform is the repo `devmode-platform`)

The owner's tool for designers and developers (desktop, after Figma Dev Mode): every page of the app and every shared component, live,
with hover spacing (padding / gaps labelled with the tokens the CSS uses), Alt redlines, specs, tokens, the code behind each piece (GitHub,
at the version's tag), Figma nodes, statuses, the iteration record and version compare. Guide: `devmode/README.md`.

- **One requirement, one iteration, one tag** (owner, 2026-11-17): every change made for one requirement — tokens, global components and
  the pages they touch — is recorded as ONE iteration (one snapshot, one tag `devmode-<id>`). A global iteration also gets an
  **overview** (`devmode/iterations/<id>/`: the visual check's before | after | difference for every changed page state and component
  state, shown on the iteration's page in Dev Mode, and `README.md`, the brief for developers' AI — what changed, the rules, the token
  changes, every page and component, how to build it; `get_iteration` returns it). Skill `perasure-iteration-log`.
- **Every new requirement is recorded** (owner): a change to a page, a component or a motion gets an iteration entry — skill
  `perasure-iteration-log` (Jira key and title read from Jira; "无 Jira 单号" when there is none). The version stays v1 — iterations are
  labelled `v1 · YYYY-MM-DD · PHL-xxx`; only a large redesign starts v2.0. Each iteration keeps a runnable snapshot (`devmode/snapshots/<id>`)
  and a git tag `devmode-<id>` (made by `.github/workflows/devmode.yml` on push — don't tag yourself); the statuses (Ready for dev / Changed / Completed) are in `devmode/data/status.js`, kept by Claude.
- **Nothing is tagged by hand**: components are found in React's tree (`PS.*`, and the app's own `APP.*` pieces), pages come from
  `devmode/data/pages.js` (how each page and state is opened) and `devmode/data/index.js` (made by `tools/devmode-index.py` from the code).
  A new screen → add it to `pages.js`; a new component → its gallery entry (it then has states in Dev Mode).
- **The platform's own look is not PeraSure's** (owner): PeraSure tokens are data inside it (Inspect, the Tokens tab), never its styling.
  It is bilingual (中 / EN, every text in devmode-platform's `js/i18n.js`, data as `{ zh, en }`) and has light and dark themes.
- Don't read `tokens/tokens.css` into context for it: the Tokens tab parses the file in the browser.
- **Unrecorded changes** (owner wanted a Chromatic-like check): `tools/devmode-visual.mjs diff` renders every page state and component
  state from the latest iteration's snapshot and from the code now and compares pixels (steady renders: fixed clock and random numbers,
  finished entrances, Lottie on a fixed frame, self-moving parts rendered twice and left out). `.github/workflows/devmode-visual.yml`
  runs it on every push and publishes the report to the branch `devmode-visual` (Dev Mode → Iterations → Unrecorded changes; MCP
  `get_visual_changes`). Use it before recording an iteration (skill `perasure-iteration-log`); a new page or state in `pages.js` must
  render steadily (check with `--filter <id>` twice).
- **Screen as on the phone** (owner): the canvas lays a page out and draws it as the chosen phone does — device, Screen fit (the app's
  Tune modes, default capped zoom) and Text size, in the toolbar's screen menu; the frame keeps one size and place on every page.
  `DM.screenOf` (devmode-platform `js/canvas.js`) and `screenOf` in its `mcp/core.mjs` mirror `shared/ps-ui/phone-fit.js`: when the fit
  modes or the capped zoom change there, change both (and `zmax` in `devmode/app.js`).
- **Annotate, QA, Figma links** (owner): notes pinned on layers travel in links (devmode-platform `js/notes.js`); QA lays the developers'
  screenshot over the demo (canvas); design-system components matched to PS components live in `devmode/data/figma-links.js` (only
  clear one-to-one matches). Writing links into the shared Figma file needs the owner's go-ahead (Code Connect needs an Organization plan).
- **MCP for developers' AI** (owner): hosted at https://samge.studio/devmode/mcp (one server for every app on the platform; each tool takes
  `app`; OAuth sign-in or the account and password as headers; reads any repo file, so developers never need GitHub) and local
  (`node mcp/server.mjs --app <Perasure clone>` in a devmode-platform clone, adds the Playwright tools). Guide: devmode-platform `mcp/README.md`.
  The local one injects this repo's `devmode/inspector.js` (a copy of the platform's `js/inspector.js`: keep them the same). When a data
  format or a page's opening (`pages.js`) changes, update the platform's `mcp/core.mjs` (`pagesFrom`) too, raise its `VERSION` and redeploy
  the Worker.

## Withdraw: the two credit states of the Credit limit intro

The Withdraw demo can open with the Credit limit increase animation. Every number in it, and on the home card it lands on,
comes from the backend: the values in the demo pages are samples. The **state** follows from those numbers (`intro.js`),
never from which page is open, and decides what the animation shows and whether its big number carries over:

| State | When | Credit limit screen shows | Into the home card |
|---|---|---|---|
| **Credit unused** (额度未使用) | available = total | the limit going up: available − increase → available | the home card's **big number** (the available amount): the same element, FLIPped in |
| **Credit partly used** (额度部分已使用) | available < total | the **total credit** going up: total − increase → total | **nothing carries over**: the whole block (big number, increase pill, date, "Previous limit") leaves with the closing box, and every line of the card comes in like the other details. The available amount enters at available − increase and counts up to the available amount while the green bar slides out |

- The increase is the temporary credit (until its end date).
- `with-credit-limit.html` and `with-credit-limit-used.html` differ only in their sample numbers (`window.WD_PRESET`, each
  with its own Tune storage). Changing the numbers in Tune can switch the state.
- Both states run through `introExit()` in `withdraw.js`; the partly-used branch is its `used` flag (`o.mode === 'total'`).
- Details are in `prototypes/withdraw-fund-flow/README.md`.

## Requirements for a demo page

Demos are full-screen phone pages, not device mockups. The withdraw demo is the reference
implementation (`prototypes/withdraw-fund-flow/`, see the comments in its `phone-fit.js`; its README shows how a Claude Design
bundle was unpacked onto the shared environment):

- Designed at 360 CSS px wide: set the viewport to `width=360` on touch devices so the browser
  scales it to the screen, and fill the visible height (no green backdrop / phone frame / fake status bar).
  **Exception (owner): pages built on the shared components are responsive** — layouts fill the width with the 16 px
  page margins (`shared/ps-ui/phone-fit.js`). How big they are drawn is a fit mode (Tune → "Screen fit"; the owner is
  comparing them on phones): **capped zoom** (default: the 360 design enlarged with the screen, at most 1.15×), **capped zoom · rem**
  (the same factor through the root font size, so only rem sizes grow; the hosted Withdraw demo stays 1:1), **1:1**
  (true size: text felt small on big iPhones) or **full zoom** (the old 360 scaling). Load `phone-fit.js` after
  `PSTune.setup`. Check at 360, 390 and 430 px wide.
- `touch-action: manipulation` on interactive elements — iOS Safari otherwise delays every tap ~300ms.
- iOS Safari 26+ (floating toolbar): `viewport-fit=cover`, extend the top/bottom bars behind the status bar
  and search bar; bottom nav / primary button sits 24px above the search bar. `?debug=1` on the withdraw
  demo shows the measured insets.
- Bottom sheets with text inputs must avoid the on-screen keyboard: lift the sheet with a transform using
  `visualViewport` (`offsetTop + height` = keyboard top), and don't re-fit / re-zoom the page on resize while
  an input has focus (Android keyboards resize the viewport). See the OTP demo's head script.
- iOS Safari 26+ tints the status bar and toolbar from `position:fixed` layers that reach the screen edges.
  Don't leave a coloured fixed overlay (scrim, backdrop) in the page, even at `opacity:0`: use
  `display:none` when closed, and give tap-outside catchers no background.
- **Header and bottom bars** (PeraSure standard since tokens v2026.11.17, owner; components `PS.TopBar` / `PS.BottomBar` / `PS.Navigator`
  / `PS.Bands`): **no progressive blur** (the Figma effect styles Top/Bottom-nav-effect are off; the Tune setting and `?blur=` are gone).
  Each bar is one token veil, chosen by the kind of page:

  | Page | Header | Bottom |
  |---|---|---|
  | Primary (the Home / Payment / Account tabs) | `--gradient-top-nav-filled` (Ambient #F0F5F4 80 → 40 → 0) | tab bar `--gradient-bottom-primary-nav-filled` (white 0 → 60 → 80) |
  | Secondary (二级页面: every other page) | solid page colour (`--color-surface-page-default`) | `--gradient-bottom-secondary-nav-filled` (Ambient 0 → 60 → 80) |
  | Amount entry and order page (not secondary) | `--gradient-top-nav-filled` | `--gradient-bottom-secondary-nav-filled` (`BottomBar{secondary}`) |
  | Page sheet's foot (the coupon picker's total + Confirm) | — | `--gradient-bottom-secondary-nav-filled` |

  A bottom action bar on a tab page uses the primary gradient. The glass buttons and the tab bar's pill keep their own normal
  background blur (that is the glass, not a progressive blur). The veils come and go with the scroll as before: the header's appears as
  content scrolls under it; on a scrolling page the bottom one fades out over the last stretch of scroll (as tall as the bar), so at
  the very bottom it is gone; a page that does not scroll shows none. Both extend behind the iOS status bar / search bar. The Withdraw
  demo (its own bars in withdraw.js / withdraw.css, `BLUR = false`) and Change co-maker follow the same table.
  The old #EBF0EF secondary bottom and `--gradient-bottom-nav-filled` are retired (`tokens/legacy/2026.11.12.css` keeps the old names).
- Motion: prefer Motion (formerly Framer Motion; `vendor/motion@14.4.0/motion-react.js`) with `LazyMotion` + `m` (strict), drive continuous values with motion values
  instead of React state, animate only `transform` / `opacity` where possible, and respect
  `prefers-reduced-motion`.
- Shared environment, not bundles (owner's rule for new prototypes): the app already ships its fonts, GSAP, React and
  Motion, so a prototype links them from the repo instead of inlining them — the page's own file then holds only
  what the prototype adds, which is what developers would actually ship. Fonts:
  `<link rel="stylesheet" href="../../assets/fonts/fonts-2026.11.17.css">` and `font-family: var(--ps-font-text | --ps-font-body |
  --ps-font-num)` (emphasised amounts use `--ps-font-num`: Reddit Sans, ₱ included — see "Number font"). Libraries:
  `<script src="../../vendor/…">` with a relative path. Never a CDN at runtime, no build step, no base64 fonts or
  pasted library code in the page. Data and code specific to the prototype (a recording, an SVG) may stay inline or
  sit next to it in its folder. Existing prototypes that were made as single files stay as they are unless the owner
  asks. A Claude Design bundled export (below) should be unpacked into such a plain page when practical.
- Claude Design bundled exports (`__bundler/template` + dc-runtime): the runtime loads React on its own and
  does not wait for it, so any bundled script that needs `window.React` at load time (e.g. the Framer Motion
  UMD, `window.__FM_UMD`) races it — iOS Safari loses and shows `[bundle] ReferenceError: Can't find variable:
  React`. Fix: in the template, add `<script src="<react uuid>">` and `<script src="<react-dom uuid>">` (uuids
  from `__bundler/ext_resources`) before the runtime's `<script src>`; the unpacker runs template scripts in
  order and the runtime then reuses that React.
- Unpacking a Claude Design bundle (as done for Withdraw): decode `__bundler/manifest` (base64, gzip when `compressed`), keep
  the `<x-dc>` markup in the HTML, move the `<script data-dc-script>` text to a `.js` file that a small boot script fetches
  into that element before loading `runtime/dc-runtime.js`; set `window.__resources` (the page's resource ids → files,
  e.g. `framerMotion` → `vendor/motion@14.4.0/motion-react.js`, which needs `features = domMax`); load React/ReactDOM from
  `vendor/` before the runtime (it then never reaches the CDN); fonts from `assets/fonts/`. Verify pixel-identical frames.
- Don't break existing prototypes: never edit another prototype's files when adding a new one.

## Updating tokens

`tokens/README.md` explains the pipeline. Rules for agents (they keep an update to a few thousand tokens):

- Never read `tokens/figma-export.json`, `tokens.json`, `tokens.css`, `digest.json` or the whole `CHANGELOG.md` into
  context, and never use `get_variable_defs` / `get_metadata` / `get_design_context` to read tokens. The scripts
  print a short summary; work from that.
- **Owner attached a plugin export** (`perasure-tokens-*.json`):
  `python3 tools/sync-tokens.py <file> --message-out /tmp/msg.txt`.
- **Sync straight from Figma** (file `OBsvf42AiRapcRrasD7KNm`):
  1. `python3 tools/sync-tokens.py --digest` → one line of JSON.
  2. `use_figma` (read-only) with `code` = the full text of `tools/figma-tokens/core.js` followed by
     `return await psMcp(<that JSON>, 0);`.
  3. `{"unchanged":true}` → tell the owner nothing changed; stop. Otherwise save the result verbatim to a scratch
     file; if it says `"parts": N` with N > 1, run step 2 again with part 1 … N−1 and save each.
  4. `python3 tools/sync-tokens.py part0.json [part1.json …] --message-out /tmp/msg.txt`.
- Then run `python3 tools/rem-tokens.py` (it remakes `tokens-rem/tokens-rem.css` from the new tokens) and
  `python3 tools/legacy-tokens.py tokens-v<previous version>` — **old CSS names and values stay usable** (owner, 2026-11-17): it writes
  `tokens/legacy/<previous version>.css` with every name the update removed, renamed or gave a new value, at its old value (load it after
  tokens.css to get the old look back). Then commit `tokens/` + `tokens-rem/` with
  `/tmp/msg.txt` as the message and push to `main`. Don't tag: the *Tokens* workflow
  tags `tokens-v<version>` on push. `stamp.py` is not needed for token-only changes.
- Report the summary line and any removed / renamed CSS names (the *Developer impact* of the new
  `CHANGELOG.md` entry — read just that entry), plus the tag.
- Changing the export or hashing: edit `tools/figma-tokens/core.js` and `tools/tokenlib.py` together, run
  `python3 tools/sync-tokens.py --check`, then do one full export (`psMcp({}, …)`, all parts).

## Checking before you push

- **Index:** decide whether the file index in `AGENTS.md` needs an edit (see "Keep this index current" there); if it does, update it in this commit.
- Open the picker and every new link at a phone viewport (e.g. 390×664, touch, DPR 3) and confirm the demo
  loads with no console errors.
- Tap through the main flow once.

## Caching (phones keep old copies otherwise)

The site asks browsers to check every file for a newer version, but phones still hold on to some. Before committing a change to the Playground pages,
`animations/` or `assets/`, run `python3 tools/stamp.py`: it stamps the shared scripts (`?v=<stamp>`), and the
index adds that stamp to every link and thumbnail, so phones load the new version right away. It also remakes Dev Mode's index
(`devmode/data/index.js`). The player
fetches animation JSON with `cache: 'no-cache'` and loads GSAP modules with a per-load token.

## Publishing

- Commit to `main` and push; samge.studio shows it within about 20 seconds (the Worker reads `main` from GitHub; nothing to deploy).
  The Worker and the Dev Mode platform live in `devmode-platform`; only a change there needs a Worker deploy.
- The account, password and tokens are Cloudflare secrets: never write them into the repo.
- Give the owner the direct demo link (https://samge.studio/perasure/playground/prototypes/…) as well as the picker link.
