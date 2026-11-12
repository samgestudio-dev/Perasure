# PeraSure components (`shared/ps-ui`)

The building blocks of PeraSure app screens, as configurable React components. A prototype passes its own data and
states as props; the look lives here once. Change a component here and every prototype built on it changes with it.

- **Live gallery:** [`shared/gallery.html`](gallery.html) — every component with its states (tap the chips) and props (`gallery.js`; the components added with the full app are in `gallery-app.js`).
- **The whole app built on it:** [`prototypes/app/`](../prototypes/app/README.md).
- **First prototype built on it:** [`prototypes/coupon-system/`](../prototypes/coupon-system/README.md).
- Figma source: PeraSure design system (`OBsvf42AiRapcRrasD7KNm`) — home `10730:58631`, loan `10656:51873`,
  coupons section `10594:45373`, account `10750:63340`.

## Using it in a prototype

React + Motion from `vendor/`, no build step (`PS.h` = `React.createElement`). Paths below are from `prototypes/<slug>/`.

```html
<head>
  <script src="../../shared/ps-ui/tune.js"></script>               <!-- optional, prototype only: Tune panel -->
  <link rel="stylesheet" href="../../shared/ps-ui/tune.css">
  <script>PSTune.setup({ key: 'perasure.<slug>.tune', settings: [
    { key: 'blur', label: 'Progressive blur (header and bottom bars)', options: [[1, 'On'], [0, 'Off']], def: 1 },
    { key: 'fit', label: 'Screen fit', options: [['cap', 'Capped zoom'], ['fit', '1:1'], ['scale', 'Full zoom']], def: 'cap' } ] });</script>
  <script src="../../shared/ps-ui/phone-fit.js"></script>          <!-- after Tune: responsive layout, fit mode, iOS 26 edge to edge -->
  <link rel="stylesheet" href="../../tokens/tokens.css">
  <link rel="stylesheet" href="../../assets/fonts/fonts.css">
  <link rel="stylesheet" href="../../shared/ps-ui/ps-ui.css">
</head>
<body>
  <div id="root"></div>
  <script src="../../vendor/react@18.3.1/react.production.min.js"></script>
  <script src="../../vendor/react-dom@18.3.1/react-dom.production.min.js"></script>
  <script src="../../vendor/motion@14.4.0/motion-react.js"></script>
  <script src="../../shared/ps-ui/core.js"></script>     <!-- always -->
  <script src="../../shared/ps-ui/layout.js"></script>   <!-- always -->
  <script src="../../shared/ps-ui/coupon.js"></script>   <!-- the areas the page uses -->
  <script src="../../shared/ps-ui/home.js"></script>
  <script src="../../shared/ps-ui/loan.js"></script>
  <script src="../../shared/ps-ui/account.js"></script>
  <script src="my-flow.js"></script>
</body>
```

```js
var h = PS.h;
function App() {
  return h(PS.Shell, null,
    h(PS.Screen, { top: { left: h(PS.Back, { onClick: back }), title: 'Apply a loan', right: h(PS.TuneButton) },
                   bottom: h(PS.BottomBar, null, h(PS.Button, { block: true }, 'Confirm')) },
      h(PS.AmountCard, { amount: a, min: 500, max: 45000, step: 500, onAmount: setA, terms: [3, 6, 8], term: t, onTerm: setT }),
      h(PS.OrderDetails, { rows: [{ label: 'Total payment', value: PS.money(50400) }] })));
}
PS.mount(App);
```

The page's own file then holds only the flow and its data (what developers would ship), as the shared-environment
rule in `CLAUDE.md` asks.

## Files

| File | What's in it |
| --- | --- |
| `ps-ui.css` | every component's styles, on the tokens only (values with no token are `--ps-*` variables at the top, with a note) |
| `core.js` | namespace, motion values (`PS.MT`, `PS.fade`, `PS.reveal`, `PS.press`) and helpers (`PS.money`), `PS.rise` / `Rise` (content that rises in piece by piece), `Lottie` + `Anim` (the repo's animations, cropped to their art), `Icon`, `Art`, `Amount`, `Button` (`inactive`), `Glass` / `Back` / `Close`, `Brand`, `Tag`, `Count`, `Chip`, `Check`, `Divider`, `Card`, `Section`, `Link`, `KV`, `Rows`, `Swap` |
| `layout.js` | `Shell`, `Screen` (`rise`), `Cover` (a loading or failed page, over the whole screen), `TopBar`, `BottomBar`, `Bands` (progressive blur), `Navigator`, `Pages` (crossfade; rise from the bottom / back down), `Sheet` + `SheetTitle` (their content rises in), `Tooltip` (places itself next to its `anchor`), `Toast` + `useToast`, `TuneButton`, `frameRect` |
| `home.js` | `HomeActions`, `CreditCard`, `PaymentCard`, `HomeCoupons` (two / one / none), `PartnerLogos`, `TrustCard`, `Legal` |
| `coupon.js` | `CouponArt`, `Countdown`, `CouponTicket` (default, selected, used, expired, unavailable), `Tabs`, `Crossfade` (`rise`), `EmptyState`, `CouponRow`, `Summary`, `CouponPicker`, `Decision` |
| `loan.js` | `Slider`, `AmountCard`, `CouponsSection`, `OrderDetails`, `ProtectionCard`, `MethodCard`, `Agreement` (`nudge`: withdraw's ripple), `RepaymentPlan` |
| `account.js` | `Profile`, `CreditLimitCard`, `Menu`, `Social` |
| `feedback.js` | `Coin` (Coins loading: loop → success), `Dots`, `Loader` (the Loading page's coin + dots, larger; `fill`: in the very middle of a whole screen), `Busy`, `StatusBox`, `Notice`, `Result`, `Overlay` |
| `form.js` | `Field` (typing box, also a picker row), `PhoneField`, `OtpBoxes`, `ContactMethods`, `Keypad`, `Segmented`, `SelectBar`, `Search`, `Consent`, `UploadTile` |
| `status.js` | home states: `StateCard`, `Strip` (`raised`: default shadow), `DotTitle`, `OfferCard`, `Banners`, `Hero`, `Reviews`, `PermissionCard` |
| `pay.js` | `ScamStrip`, `Installment`, `PayBar`, `RepayCard`, `InsetRows`, `PayTimer`, `QrPanel`, `Accordion`, `MethodPicker`, `Pager` |
| `list.js` | `LinkList`, `Facts`, `ActivityItem`, `InboxItem`, `HistoryRow`, `HubCard`, `Tiles`, `Tips` |
| `fx.js` | the earlier demos' motion as components: `OrderSubmit`, `OtpSheet`, `CreditLimitIntro` (hosts the shipped page; `exit` hands the closing to the page, as the demo's intro.js does) |
| `withdraw-host.js` | `PS.loadWithdraw()`: the Withdraw demo's loan screen (slide up, amount entry, morph into the order card) the demo's home card and loan screen (slide up, amount entry, morph, the order page's own blocks) run from the demo's own code, laid out at the host's width; the host gives the limit, numbers, sample data, extra blocks and taps (header of the file) — wrappers get `.ps-wd` |
| `phone-fit.js` | responsive phone page, iOS 26 edge to edge; fit mode cap (default, ≤ 1.1×) / fit (1:1) / scale (old 360 zoom), from `window.PS_FIT` or Tune (`fit`, `zoom`); sets `--vh --ph --ftop --e --sb` |
| `tune.js`, `tune.css` | the prototype Tune panel, configured per page (`PSTune.setup`) |
| `assets/icons/` | one-colour icons exported from Figma, drawn as masks (`PS.Icon`) so their colour is a token (an icon's own opacity is set where it is used) |
| `assets/art/`, `assets/logos/` | full-colour pictures: coupon illustrations, empty box, ticket mask, laurels, logos |

Each component's props are written in a comment right above it and listed in the gallery. Fields left out are not
drawn (a coupon with no `best`, a summary with no `newLimit`, an order row whose `value` is `null`).

## Rules for changing components

- **Responsive.** Layouts fill the width with the 16 px page margins (360–430 px phones, up to 600 px on a desktop).
  No fixed 360 px widths; fixed sizes only where Figma fixes them. How big the page is drawn is phone-fit's mode:
  capped zoom by default (the 360 design enlarged with the screen, at most 1.1×; a 430 px phone shows 14 px text at
  15.4 px), 1:1, or full zoom. With a Tune panel, load `phone-fit.js` after `PSTune.setup`.
- **Tokens only.** Colours, spacing, radii, type, shadows and blur come from `tokens/tokens.css`. A value with no
  token goes once into `:root` of `ps-ui.css` as `--ps-*`, with a note saying so.
- **Configurable, not copied.** Anything that differs between screens (copy, amounts, states, which parts show) is a
  prop. A prototype never restyles a component's insides; if it needs another look, add a prop or a variant here.
- **States are props:** `state`, `on`, `tone`, `variant`… and every state appears in the gallery. Add new states there too.
- **Motion = the PeraSure values**, the same as `prototypes/withdraw-fund-flow/motion-tokens.js` and the
  `perasure-card-morph` skill, in `PS.MT` (core.js). Reuse them; don't invent new timings:
  - moves (sheets, page push / pop, tab and nav pills, rows opening): the Smooth spring 240 / 30 / 1 (`PS.MT.SPRING`),
    never sped up for a short move, no bounce;
  - content that is replaced (text after a tap, a tab's list, toasts, tooltips): `PS.fade()` / `PS.Swap` / `PS.Crossfade`
    — LEAVE 0.15 s rising out, ENTER 0.30 s + 0.07 s rising 8–10 px, 3 px blur between;
  - press: `PS.press()` — 60 ms, scale 0.985 (buttons, cards) / 0.92 (icon buttons);
  - a state change that doesn't move anything (selected ticket, check, term pill, tab label) changes colour only, in 150 ms;
  - **numbers that follow the slider never animate** (amounts, savings, totals just update);
  - when something other than the finger moves the slider (a coupon changes the limit, "Keep coupon" sets the amount),
    the knob, fill and amount glide there on the Smooth spring — the amount counts in slider steps;
  - a page or sheet that is leaving takes no taps, so nothing blocks the next tap.
  Motion (`m.*`, strict `LazyMotion` with `domMax`) comes from `PS.Shell`; `MotionConfig reducedMotion="user"`.
- **Coupon pictures** (`PS.CouponArt`): from 40 px up the Figma version with the green badge, its shadow and the white
  outline (`assets/art/coupon-<type>.svg`, drawn 3.31 % / 5 % wider than its box, as in Figma); below 40 px the plain
  small one (`coupon-<type>-sm.svg`). Both are Figma's own SVG exports (app file, "Coupon center": 80 px 52:16887 / 52:16857 /
  52:16835, 36 px 52:15586 / 52:15725 / 52:15780) with the canvas behind them taken out — re-export them if they change; never redraw.
- **Copy** in examples and defaults follows the `perasure-tone-of-voice` skill (sentence case, plain words).
- **Phone rules** from `CLAUDE.md` hold here: `touch-action: manipulation`, no coloured overlay left in the page when a
  sheet is closed (sheets unmount), the header blur runs only while content is under it, with blur off the bottom
  gradient fades out at the end of the scroll.
- **Don't break consumers.** Renaming or removing a prop or a class: update every prototype that uses it
  (`grep -rl "PS\.<Name>" prototypes shared`) in the same commit, and the gallery.
- **Caching:** links to these files carry `?v=<stamp>`; `python3 tools/stamp.py` updates them before a commit.
