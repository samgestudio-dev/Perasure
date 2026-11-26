# The full app (`prototypes/app`) and the Withdraw demo

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** you work on any app screen or flow, the numbers, the Withdraw demo or its Credit limit intro.

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
  (header `Gradient/Top-nav-filled`) but take the secondary bottom too (owner, 2026-11-17). Full rule: "Header and bottom bars" in [demo-pages.md](demo-pages.md).
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
