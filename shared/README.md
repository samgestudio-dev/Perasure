# PeraSure components (`shared/ps-ui`)

The building blocks of PeraSure app screens, as configurable React components. A prototype passes its own data and
states as props; the look lives here once. Change a component here and every prototype built on it changes with it.

- **Live gallery:** [`shared/gallery.html`](gallery.html) — every component with its states (tap the chips) and props.
- **First prototype built on it:** [`prototypes/coupon-system/`](../prototypes/coupon-system/README.md).
- Figma source: PeraSure design system (`OBsvf42AiRapcRrasD7KNm`) — home `10730:58631`, loan `10656:51873`,
  coupons section `10594:45373`, account `10750:63340`.

## Using it in a prototype

React + Motion from `vendor/`, no build step (`PS.h` = `React.createElement`). Paths below are from `prototypes/<slug>/`.

```html
<head>
  <script src="../../shared/ps-ui/phone-fit.js"></script>          <!-- 360 px design fitted to the phone, iOS 26 edge to edge -->
  <script src="../../shared/ps-ui/tune.js"></script>               <!-- optional, prototype only: Tune panel -->
  <link rel="stylesheet" href="../../shared/ps-ui/tune.css">
  <script>PSTune.setup({ key: 'perasure.<slug>.tune', settings: [
    { key: 'blur', label: 'Progressive blur (header and bottom bars)', options: [[1, 'On'], [0, 'Off']], def: 1 } ] });</script>
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
| `core.js` | namespace and helpers (`PS.money`, `PS.T` springs, `PS.TAP`), `Icon`, `Art`, `Amount`, `Button`, `Glass` / `Back` / `Close`, `Brand`, `Tag`, `Count`, `Chip`, `Check`, `Divider`, `Card`, `Section`, `Link`, `KV`, `Rows`, `Swap` |
| `layout.js` | `Shell`, `Screen`, `TopBar`, `BottomBar`, `Bands` (progressive blur), `Navigator`, `Pages` (push / pop), `Sheet` + `SheetTitle`, `Tooltip`, `Toast` + `useToast`, `TuneButton`, `frameRect` |
| `home.js` | `HomeActions`, `CreditCard`, `PaymentCard`, `HomeCoupons` (two / one / none), `PartnerLogos`, `TrustCard`, `Legal` |
| `coupon.js` | `CouponArt`, `Countdown`, `CouponTicket` (default, selected, used, expired, unavailable), `Tabs`, `EmptyState`, `CouponRow`, `Summary`, `CouponPicker`, `Decision` |
| `loan.js` | `Slider`, `AmountCard`, `CouponsSection`, `OrderDetails`, `ProtectionCard`, `MethodCard`, `Agreement`, `RepaymentPlan` |
| `account.js` | `Profile`, `CreditLimitCard`, `Menu`, `Social` |
| `phone-fit.js` | phone fitting (same as the withdraw / co-maker demos): sets `--vh --ph --ftop --e --sb` |
| `tune.js`, `tune.css` | the prototype Tune panel, configured per page (`PSTune.setup`) |
| `assets/icons/` | one-colour icons, drawn as masks (`PS.Icon`) so their colour is a token |
| `assets/art/`, `assets/logos/` | full-colour pictures: coupon illustrations, empty box, ticket mask, laurels, logos |

Each component's props are written in a comment right above it and listed in the gallery. Fields left out are not
drawn (a coupon with no `best`, a summary with no `newLimit`, an order row whose `value` is `null`).

## Rules for changing components

- **Tokens only.** Colours, spacing, radii, type, shadows and blur come from `tokens/tokens.css`. A value with no
  token goes once into `:root` of `ps-ui.css` as `--ps-*`, with a note saying so.
- **Configurable, not copied.** Anything that differs between screens (copy, amounts, states, which parts show) is a
  prop. A prototype never restyles a component's insides; if it needs another look, add a prop or a variant here.
- **States are props:** `state`, `on`, `tone`, `variant`… and every state appears in the gallery. Add new states there too.
- **Motion:** Motion (`m.*`, strict `LazyMotion` with `domMax`, given by `PS.Shell`), springs from `PS.T`, `whileTap: PS.TAP`
  on pressables, `layoutId` for pills that move between options, `AnimatePresence` for content that swaps.
  `MotionConfig reducedMotion="user"` respects reduced motion.
- **Copy** in examples and defaults follows the `perasure-tone-of-voice` skill (sentence case, plain words).
- **Phone rules** from `CLAUDE.md` hold here: `touch-action: manipulation`, no coloured overlay left in the page when a
  sheet is closed (sheets unmount), the header blur runs only while content is under it, with blur off the bottom
  gradient fades out at the end of the scroll.
- **Don't break consumers.** Renaming or removing a prop or a class: update every prototype that uses it
  (`grep -rl "PS\.<Name>" prototypes shared`) in the same commit, and the gallery.
- **Caching:** links to these files carry `?v=<stamp>`; `python3 tools/stamp.py` updates them before a commit.
