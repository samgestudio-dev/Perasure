# PeraSure components (`shared/ps-ui`)

The building blocks of PeraSure app screens, as configurable React components. A prototype passes its own data and
states as props; the look lives here once. Change a component here and every prototype built on it changes with it.

> **For AI agents — components first (owner's rule, every PeraSure project):** a new piece of UI or feature is built here first
> (every state a prop, tokens only, rem, its states in the gallery in the same commit), then pages use it directly. A change to a piece
> is made in the component, never patched from a page: page CSS only places shared pieces. Skill: `.claude/skills/perasure-components`.

- **Live, with every state:** [PeraSure Dev Mode → Components](https://samge.studio/devmode/?app=perasure#v=components) — each component's states (the chips
  above the canvas), props, specs, tokens, code and where it is used. The states are written in `gallery.js` (the components added with
  the full app: `gallery-app.js`), one entry per component; `stage.html?entry=<name>&state=<n>` draws one of them, and that is what Dev
  Mode shows. `gallery.html` only sends old links on to Dev Mode.
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
    { key: 'fit', label: 'Screen fit', options: [['cap', 'Capped zoom'], ['fit', '1:1'], ['scale', 'Full zoom']], def: 'cap' } ] });</script>
  <script src="../../shared/ps-ui/phone-fit.js"></script>          <!-- after Tune: responsive layout, fit mode, iOS 26 edge to edge -->
  <link rel="stylesheet" href="../../tokens/tokens.css">
  <link rel="stylesheet" href="../../assets/fonts/fonts-2026.11.17.css">
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
| `core.js` | namespace, motion values (`PS.MT`, `PS.fade`, `PS.reveal`, `PS.press`) and helpers (`PS.money`), `PS.rise` / `Rise` (content that rises in piece by piece), `Lottie` + `Anim` (the repo's animations, cropped to their art), `Icon`, `Art`, `Amount`, `Button` (`inactive`), `Glass` / `Back` / `Close`, `Brand`, `Tag`, `Count`, `Chip`, `Check`, `Divider`, `Card`, `Section`, `Link`, `KV`, `Rows`, `Swap`, `TextLink`, `InfoButton`, `SectionLabel`; `Glass` `round: false` · `size: 'lg'` |
| `layout.js` | `Shell`, `Screen` (`rise`), `Cover` (a loading or failed page, over the whole screen), `TopBar`, `BottomBar` (`note`: a small line over the button; `consent`: an agreement line over it), `Bands` (progressive blur), `Navigator`, `Pages` (crossfade; rise from the bottom / back down), `Sheet` + `SheetTitle` (their content rises in), `SheetHead` (title row: centred or left, a mark, the title at the bottom), `ButtonRow`, `Confirm` (sheet className `ps-confirm`), `Tooltip` (places itself next to its `anchor`), `Toast` + `useToast`, `TuneButton`, `frameRect` |
| `home.js` | `HomeActions`, `CreditCard`, `PaymentCard`, `HomeCoupons` (two / one / none), `PartnerLogos`, `TrustCard`, `Legal` |
| `coupon.js` | `CouponArt`, `Countdown`, `CouponTicket` (the coupon centre: default, selected, used, expired, unavailable), `CouponOption` (a coupon in the picker, DS 10840:29499: default, selected, unavailable; the countdown strip with less than a day left), `Tabs`, `Crossfade` (`rise`), `EmptyState`, `CouponRow`, `Summary`, `CouponPicker`, `Decision` (`pages` · `index` · `onIndex`: more than one coupon side by side, swiped — needs `pay.js`); `CouponArt` `animate` · `active`; `Tabs` `split` · `spaced` |
| `loan.js` | `Slider`, `AmountCard`, `CouponsSection`, `OrderDetails`, `ProtectionCard`, `MethodCard`, `Agreement` (`nudge`: withdraw's ripple), `RepaymentPlan`, `OrderHead`, `OrderStatus`, `PlanRows`, `AmountEntry` (the keypad page's sheet) |
| `account.js` | `Profile`, `CreditLimitCard` (`masked`), `Menu`, `Social`, `GuestProfile`, `AboutHead`, `FooterMark`, `RegCard`, `Message`, `Rating` (sheet className `ps-rating`) |
| `feedback.js` | `Coin` (Coins loading: loop → success), `Dots`, `Loader` (the Loading page's coin + dots, larger; `fill`: in the very middle of a whole screen), `Busy`, `StatusBox`, `Notice`, `Result`, `Overlay`, `Splash`, `SendingCard`, `Fallback` (the failed page, in `Cover` tone white) |
| `form.js` | `Field` (typing box, also a picker row), `PhoneField`, `OtpBoxes`, `ContactMethods`, `Keypad`, `Segmented`, `SelectBar`, `Search`, `Consent`, `UploadTile`, `OtpForm` (the code page's body), `ReasonList` |
| `status.js` | home states: `StateCard`, `Strip` (`raised`: default shadow), `DotTitle`, `OfferCard`, `Banners`, `Hero`, `Reviews`, `PermissionCard` |
| `pay.js` | `ScamStrip`, `Installment`, `PayBar`, `RepayCard`, `InsetRows`, `PayTimer`, `QrPanel`, `Accordion`, `MethodPicker`, `Pager`, `Carousel` (`dots` · `gap`); `Accordion` `small` · `icon` (a brand tile before the title), `PenaltyInfo`, `ScamTips` (sheet className `ps-scams`), `GuestPay`, `PayDock` |
| `list.js` | `LinkList` (`tall`), `Facts`, `ActivityItem`, `InboxItem`, `HistoryRow`, `HubCard`, `Tiles`, `Tips`, `Bullets` |
| `apply.js` | applying and identity: `PageHead`, `useCamera` + `pickFile` (the phone's camera / file picker), `Shutter`, `IdCamera`, `IdSideCard`, `Selfie` (live / checking / failed), `FaceCamera`, `IdResult` (in use / failed, sheet className `ps-idres`) with `SheetHero`, `ChoiceList` / `ChoiceButton`, `PhotoTips`; `FileList` + `FileNote`, `SearchSheet` (grey, or white with sheet className `ps-sheet--white`), `BankList`, `PlacePicker` (Region → Province → City, search) + `PS.mark`, `EstimateCard`; help articles: `Article`, `Feedback`, `RelatedLinks`; `PageHero` |
| `fx.js` | the earlier demos' motion as components: `OrderSubmit`, `OtpSheet`, `CreditLimitIntro` (hosts the shipped page; `exit` hands the closing to the page, as the demo's intro.js does) |
| `withdraw-host.js` | `PS.loadWithdraw()`: the Withdraw demo's loan screen (slide up, amount entry, morph into the order card) the demo's home card and loan screen (slide up, amount entry, morph, the order page's own blocks) run from the demo's own code, laid out at the host's width; the host gives the limit, numbers, sample data, extra blocks and taps (header of the file) — wrappers get `.ps-wd` |
| `phone-fit.js` | responsive phone page, iOS 26 edge to edge; fit mode cap (default, ≤ 1.15×) / rem (the same factor through the root font size) / fit (1:1) / scale (old 360 zoom), from `window.PS_FIT` or Tune (`fit`, `zoom`); sets `--vh --ph --ftop --e --sb` |
| `tune.js`, `tune.css` | the prototype Tune panel, configured per page (`PSTune.setup`) |
| `assets/icons/` | one-colour icons exported from Figma, drawn as masks (`PS.Icon`) so their colour is a token (an icon's own opacity is set where it is used) |
| `assets/art/`, `assets/logos/` | full-colour pictures: coupon illustrations, empty box, ticket mask, laurels, logos |

Each component's props are written in a comment right above it and listed in the gallery. Fields left out are not
drawn (a coupon with no `best`, a summary with no `newLimit`, an order row whose `value` is `null`).

New in round 5: `PS.FormField` (application fields) with `PS.Popover` (DS 7201:12032), `PS.DatePicker` + `PS.Wheel`
(react-wheel-picker, `vendor/react-wheel-picker@1.2.3` — load its script after React and its `style.css` before ps-ui.css),
`PS.DocCard` + `PS.FileRow` (proof of income), `PS.Carousel` and `PS.Pager{progress}`, `PS.Installment{tone}`, `PS.Toast` at the
top, `PS.Screen{secondary}`, `PS.CreditCard` without temporary credit, `PS.Button{variant: 'soft' | 'glass'}` (all in form.js / pay.js / home.js / layout.js / core.js).

New in round 6: `PS.Toasts` (layout.js: a stack of the last three, each new one covering the one before, swipe left to close),
`PS.SelfieTips` (DS 5585:5407: the three selfie pictures + More) and `PS.LineTabs` (underlined tabs, `off` for a step not reached yet)
in form.js, `PS.Lottie{active}` / `PS.Anim{active}` (core.js: play from the start when it becomes the card on screen), `PS.Accordion{small}`
(pay.js), `PS.FileRow{pic}` (a photo's thumbnail; the tick is Icon / Check 8, 8 around the dot), `.ps-t-section-md-light`, and the icons
`clear-small` (the fields' clear button: Neutral/950 at 60 %), `upload-cloud`, `alert-filled`, `warning-filled`.
`PS.Popover` opens centred on the last tap (or `at`), 8 from the page's sides, growing from that point; without a tap, its right edge on the
anchor's. `PS.Wheel`'s band is its highlight (it covers the wheel's own line: no double text) and it owns every touch on it.

## Number font and bars (owner, tokens v2026.11.17)

**Number font.** `--ps-font-num` = token `Font/Family/Number` = **Reddit Sans** (variable 200–900, with its own ₱;
`assets/fonts/reddit-sans-var.woff2`, OFL). Before 2026.11.17 it was Satoshi with ₱ from Inter (`--font-family-satoshi`, now in
`tokens/legacy/2026.11.12.css`).

| Rule | How |
|---|---|
| Only **emphasised amounts** use it, always in a Number text style | `.ps-t-number-xs/sm/md/lg/xl/xxl` = DS `Number/*`: 16/20 +2 % · 18/24 +3 % · 24/32 0 · 32/40 +2 % · 36/100 % +4 % · 48/100 % +3 %, all Bold. `PS.Amount{ num: 'lg' }`, a smaller ".00" with `decNum: 'xs'` |
| **Notes and labels** beside an amount stay **Inter** | Total credit, Used / Available, an old (struck) price, the intro's "+₱10,000 added" / "Previous limit" |
| **Titles** keep their own font; **only the ₱** in them is the number font | `h(PS.Peso, null, '+₱5,000')` → `<span class="ps-peso">₱</span>` (coupon values on home, the coupon centre, the coupon picker) |
| **List numbers** are not amounts | Tips' 1 2 3: Hanken |
| A size with **no Number style** | ask the owner (OfferCard's 28 → lg 32, owner's choice) |
| **One glyph per box** (typed digits, the Withdraw morph) | boxes don't kern, so each box carries its pair's kern as a right margin: `PS.kern(a, b)` (em) from `PS.KERN`, Reddit Sans Bold's GPOS pairs; withdraw.js has the same table (`Component.KERN`) |

Where it is used (2026.11.17): home credit card (xl + xs), payment card (md), coupon picker total (md), order / estimate amount
card (lg), amount entry (₱ lg, digits xxl, ".00" xs), account credit limit card (xs), credit limit hub (lg + xs), pay page (lg), loan
application (lg), payment tab instalments (sm) and total (md), loan history (sm), credit history (xs), guest hero (xl), More for you
(lg), the Credit limit increase's big number.

**Bars** (`PS.TopBar`, `PS.BottomBar`, `PS.Navigator`, `PS.Bands`): no progressive blur — one token veil each. Tab pages: header
`--gradient-top-nav-filled`, tab bar `--gradient-bottom-primary-nav-filled`; secondary pages (`PS.Screen{secondary}`): solid header,
bottom `--gradient-bottom-secondary-nav-filled`; the amount entry and the order page: header `--gradient-top-nav-filled`, bottom
`BottomBar{secondary}`; a page sheet's foot: `--gradient-bottom-secondary-nav-filled`. Table and reasons: `CLAUDE.md` → "Header and
bottom bars".

## Rules for changing components

- **Sizes are rem** (owner): 1rem = 16 design px at the default text size. Load `tokens-rem/tokens-rem.css` after `tokens/tokens.css`;
  write new CSS in rem (`1.5rem` for 24 px), never a fixed px — except hairlines (1–2 px strokes), shadows and blurs, the 40 px status
  strip above the screen (`calc(40px + 4.75rem)` is the 116 px header line) and a page's max width. In JavaScript give design px through
  `PS.rem(n)` (a size), `PS.y(n)` (a distance from the frame's top, which includes the strip) or `PS.px(n)` (the CSS px it is right now,
  for geometry). A box that holds text gets `min-height`, not `height`, so larger text has room. `phone-fit.js` (with
  `PS_FIT.text`) sets the root size from the phone's text size: up to 130 % everything follows, above that only text (`--ps-tx`).

- **Responsive.** Layouts fill the width with the 16 px page margins (360–430 px phones, up to 600 px on a desktop).
  No fixed 360 px widths; fixed sizes only where Figma fixes them. How big the page is drawn is phone-fit's mode:
  capped zoom by default (the 360 design enlarged with the screen, at most 1.15×; a 430 px phone shows 14 px text at
  16.1 px), 1:1, or full zoom. With a Tune panel, load `phone-fit.js` after `PSTune.setup`.
- **Tokens only.** Colours, spacing, radii, type, shadows and blur come from `tokens/tokens.css`. A value with no
  token goes once into `:root` of `ps-ui.css` as `--ps-*`, with a note saying so.
- **Configurable, not copied.** Anything that differs between screens (copy, amounts, states, which parts show) is a
  prop. A prototype never restyles a component's insides; if it needs another look, add a prop or a variant here.
- **States are props:** `state`, `on`, `tone`, `variant`… and every state appears in the gallery. Add new states there too.
- **Motion = the PeraSure values**, the same as `prototypes/withdraw-fund-flow/motion-tokens.js` and the
  `perasure-card-morph` skill, in `PS.MT` (core.js). Reuse them; don't invent new timings:
  - moves (sheets, page push / pop, tab and nav pills, rows opening): the Smooth spring 240 / 30 / 1 (`PS.MT.SPRING`),
    never sped up for a short move, no bounce (the one exception: menus — `PS.Popover` grows out of the tap on `PS.MT.MENU`,
    a light-bounce spring, its rows following, like an iPhone menu; owner);
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
  sheet is closed (sheets unmount); the header veil comes in as content scrolls under it and the bottom one fades out at
  the end of the scroll.
- **Don't break consumers.** Renaming or removing a prop or a class: update every prototype that uses it
  (`grep -rl "PS\.<Name>" prototypes shared`) in the same commit, and the gallery.
- **Caching:** links to these files carry `?v=<stamp>`; `python3 tools/stamp.py` updates them before a commit.
