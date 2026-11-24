# Demo lane log (`demo-rebrand`)

Rebranded copy of the demo in `rebrand/`; the original (`prototypes/`, `shared/`) is untouched. Newest first.

### 2026-11-20 · Review round: intro copy, size gaps, InboxItem, the 13 remaining specs, motion check
Progress (for a retry): **all done** (1–5) — waiting for review (`rebrand/parity/motion/`, capture script:
CDP + virtual time, 50 ms steps, 360 × 800 Android UA).
1. **Credit limit intro**: copied `prototypes/credit-limit-coins/baked/` (page, CSS, JS only) to `rebrand/prototypes/credit-limit-coins/baked/`;
   `fx.js` (`PS.rebrand + …`) and `withdraw-fund-flow/intro.js` (`../credit-limit-coins/…`) load the copy. The coin recording `baked.json`, GSAP
   and the fonts stay shared from the root (paths point there). Recoloured: ground `--surface-brand`, label / notes white at 60–80 %, accent and
   the burst's "blue" rays / the punch colour `--content-accent`, increase pill `--palette-green-950` / `-400`, date pill `--palette-navy-800`,
   coin shadows on the navy ground, the blue star green; every text Hanken; the big number Amount weight with `--amount-xxl-letter-spacing`.
   JS colours are read once from the page's custom properties (values only). Coins, physics, motion, timing unchanged.
   Other root loads checked: `vendor/`, `animations/` (Lottie JSON, the coupon GSAP modules — illustration colours only), fonts, `tokens-rem.css`
   (no colours) — nothing else brings legacy interface colours; OrderSubmit / OtpSheet are drawn by `fx.js` itself (already v2).
   The Withdraw exit (`withdraw.js`) now reads the intro number's tracking from the frame (was a fixed −0.02em) — values only.
2. **Size gaps**: the gallery drew cards 332–339 wide; the specs are legacy 328. Measured at 328 (frame 360), from the Figma nodes:
   StateCard 192 / 160 / 150 / 92 / 214 = Figma exactly; CreditCard 186 / 198 / 194 / 170 vs Figma 185 / 199 / 194 / 170 (the spec text's
   186 / 162 is stale: Figma has User home 194, compact 170) — new `layout: 'user'` (amount on a 44 line, legacy 9867:36981); RepayCard
   212 / 188 / 490 = Figma (Transfer: InsetRows now KV Detail 36 + Detail end 20; QR: Save QR code 38, the Medium minimum had made it 44).
   ProtectionCard 164 vs 180: Figma's body text box is fixed at 64 (four lines in the legacy font); in Hanken the same text is three lines
   (48), same style (Caption/sm 12 / 16, 248 wide) — left at 164 (padding a blank line would add space the text doesn't fill).
   Parity PNGs of the 328-wide components are now exported at 360 (card 328), the others stay at 375.
3. **InboxItem**: back to the legacy card (328 × 174: head · line · title / two-line body · line · action row) with the owner's copy, the overdue
   red title and the green unread dot. Note: Figma InboxItem (11043:1798) is still the demo layout (343 × 171) — figma-lib to rebuild from legacy.
4. **The 13 remaining specs** — gallery entries in spec state order, parity PNGs at 360 (card 328):
   AmountCard (246) · AmountEntry (new `part: 'top'`: only the number block, 312 × 181; legacy 185) · OfferCard (234) · BottomBar (4 variants on
   their gradient) · Legal (64) · DotTitle (22) · Notice (= the support strip, `PS.Strip` text; `.ps-strip--lg` radius 24 → 20 as legacy, 64) ·
   PenaltyInfo (288 × 232) · PermissionCard (new `open: false` = Off; 52 / 96) · ContactMethod (82 × 74, `PS.ContactMethods` with one item) ·
   ScheduleItem (`PS.RepaymentPlan` item, new `className`, `.ps-plan--bare`: 296 × 146) · SendingCard (292 × 212) · Slider (8 states, 311 × 42).
   Old same-name entries renamed "· more" (AmountCard, AmountEntry, Slider in gallery.js; PenaltyInfo, ContactMethods in gallery-app.js).
   Also: QrPanel Save QR code really 38 now (the Medium minimum had won on specificity) → QrPanel 296 × 310, RepayCard QR 514 = Figma.
   Every one of the 63 spec entries renders with no console errors; all parity PNGs re-exported at 360.
5. **Motion check, headless** — `rebrand/parity/motion/` (`REPORT.md` + one contact sheet per morph, root on top, rebrand below). Chrome over
   CDP on **virtual time** (both runs on one clock), 50 ms frames, 360 × 800, Android UA, threaded animation off (so Motion's transforms are
   on the same clock), taps scripted at the same moments, `Math.random` fixed (the OTP sheet's random waits), positions probed every frame.
   Morphs: Credit limit intro → home (available, used; plus dense exit sheets), home → amount entry, amount entry → order details, Order
   submit, OTP sheet. Result: same timing and paths; differences only where the text differs (Reddit Sans → Hanken, graded tracking: the
   amount glyphs, a chip one frame, the intro amount's first two exit frames 8 px). **Found and fixed**: the OTP boxes blanked the digits while
   the code was checked (my OtpBoxes `disabled` change) → new `locked` (input off, look unchanged) used by OtpSheet and OtpForm; `disabled`
   only greys. Frames (67 MB) are in `_frames/`, git-ignored.

### 2026-11-19 · Amount tracking (owner, graded) · Android only
Progress (for a retry): **all done** — component rules, Withdraw values, pages checked, amount PNGs re-exported (CreditCard, PaymentCard,
Installment, InstallmentCard, RepayCard, PayBar, PayDock, Button). Not verified: the Withdraw / Credit limit morphs in motion (the browser pane is hidden here).
- Tokens: `tokens/v2/tokens.css` (rebuilt by the coordinator) is loaded directly by every demo page and the stage; `tokens-rem.css` after it
  has no amount rules, so `.ps-text-amount-*` carry the new tracking as they are.
- Components (ps-ui.css): every emphasised amount that set its own tracking now reads the token for its size — `--amount-xxl-letter-spacing`
  (AmountEntry typed digits, 48), `--amount-lg-…` (CreditCard / hero 36, AmountCard, OfferCard, RepayCard, OrderHead, HubCard 32, AmountEntry ₱),
  `--amount-md-…` (PaymentCard, Summary total, PayBar 24; also the `.ps-amount` default), `--amount-xs-…` (decimals 16, Installment / history /
  activity / limit figures 16–20). The old price (`.ps-amount--strike`) is body text: tracking normal. No −0.02em left on an amount.
- Withdraw demo (withdraw.js, values only — no motion or timing touched): entry number 48 → 1.92 px (0.04em), ₱ 32 → 0.96, ".00" 16 → 0.32;
  the card's 32 → 0.96 (0.03em); the home card's 36 → ₱ and digits 1.08, ".00" 0.32. The per-glyph boxes carry tracking as letter-spacing inside
  each box (it adds after the glyph), so no extra margins were needed; `Component.KERN` stays empty. Static home cards in index.html /
  with-credit-limit*.html: ₱800.00 24 px → 0.02em.
- The Credit limit intro's big number is drawn by the root `prototypes/credit-limit-coins` page (outside this lane, unchanged, −0.02em); the
  Withdraw exit starts from that tracking and ends on the card's (it reads the card's inline value), so the change needs no code there.
- Android only (owner): checks now run at an Android viewport in Chrome (360 × 800, Android UA, headless); iOS fixes stay in shared code.

### 2026-11-19 · Phase 1 — back to the legacy geometry (specs from log/figma.md 09–10)
The specs now carry the legacy values; where my earlier fix and the spec disagreed, the spec won. All 16 restore rows below are **restored**.
Most of the work was putting the components back to the original demo's geometry (the original demo was built from the legacy frames), keeping
the v2 colours, Hanken Grotesk and the owner decisions.
| Component | Now | Source |
|---|---|---|
| Button | new `size: 'medium'` (44, padding 12); `bigLabel` = the 16 px label (CreditCard Withdraw, 46). The spec base rule is `:where(.ps-btn)` so the legacy variants (outline Copy / Use, shade, inverse Save QR code, cta, soft, glass) keep their own padding, radius, font and fill — they had lost them | Button.md phase 1 |
| Tag | radius 8; Small 22 (padding 4 / 8) | Tag.md |
| Chip | radius 16, no tick; Medium 41 (Title/xs, 1.5 stroke in the layout), Small 36 (Label/md) | Chip.md |
| TextLink | padding 0 (20–21 tall) | TextLink.md |
| Segmented | 40, padding 2, radius 16; segments 36, radius 14 (raw, phase 2) | Segmented.md |
| Popover | options 44 with a bottom divider (last without); no fixed menu width; the 48 pitch undone (content rows = KV inline 44 + divider) | Popover.md |
| SelectBar | Card 46 (padding 11 / 16) | SelectBar.md |
| Field · Search | floating 56 (value 14 medium), stacked label sentence case, values 14 | Field.md, coordinator |
| PhoneField | flag a rounded square | PhoneField.md |
| CreditCard | legacy block (padding 12, gap 16 / 8, Number/xl amount); Medium Withdraw 46; new `layout: 'compact'` (ring) for User home compact | CreditCard.md (11093:2768) |
| PaymentCard | legacy layout; `caption` (Upcoming "1st installment"), `badgeTone`, `notice.tone: 'neutral'` (Due: grey box); badge Tag Small; Pay Primary; heights 150 / 246 / 262 / 262 / 152 (spec 149 / 245 / 260 / 260 / 152) | PaymentCard.md (11093:2765) |
| StateCard | legacy (tight variant, shade / white buttons); gallery = Hold · Not approved · Expired · In progress · Documents | StateCard.md (11098:2828) |
| Navigator | 98: tabs 46, bar 54 (rim out of the layout), icon 18, label 10 / 16 | Navigator.md |
| TopBar | Brand: Inbox + Headset; brand gap 10 | TopBar.md |
| CouponTicket | no notches; Use = legacy outline; unavailable: right slot empty | coordinator (legacy 10926:29645) |
| KV · Rows | bare legacy line by default; `layout: 'inline' \| 'detail' \| 'detail-end'` (44 / 36 / 20) | KV.md |
| Check | default mark 16 again (legacy); 20 only with `size: 'medium'` | legacy |
| Installment | legacy card; states Default · Due today · Overdue 3 days · Overdue over 3 days (114) | Installment.md (11113:3535) |
| UploadTile · FileRow · EmptyState · LinkList · Facts · BankList · PlacePicker | legacy (see the restore list) | restore list |
- **New gallery entries** (spec states, legacy copy from the Figma frames): Keypad, _KeypadKey, ScamStrip, ScamTips, RepayCard, PayBar, PayDock,
  QrPanel, PayTimer, BankList, _BankRow, Accordion, OrderDetails, ProtectionCard, MethodCard, Strip, Banners, TrustCard, InstallmentCard,
  MethodPicker, _MethodTabs, OtpStatus (+ rebuilt Installment, CreditCard 4, PaymentCard 5, StateCard 5). Same-name old entries in gallery.js /
  gallery-app.js renamed "· more" (the stage took the last of two same names).
- **New components** (factored out so each spec part renders alone; pages unchanged): `PS.KeypadKey` (Keypad uses it), `PS.MethodTabs` +
  `PS.MethodGroup` (MethodPicker uses them), `PS.OtpStatus` (OtpForm's error: the legacy pink box), `PS.BankRow` (BankList), `PS.InstallmentCard`
  (legacy 5597:6135; not on a demo page yet).
- Sizes measured in the stage: Installment 114, InstallmentCard 100 / 182, Segmented 40, Chip 41 / 36, SelectBar 46, Navigator 98, Field 56,
  Tag 24 / 22, OrderDetails 268 + label, Strip 58, Keypad 312 × 232 (in 339), OtpStatus 312 × 64 / 44, MethodGroup 205 × 84 / 188, CreditCard
  186 / 198 / 186 / 170 (spec 185 / 199 / 186 / 162).
- Not changed (not asked): InboxItem keeps the spec layout of batch 3; Sheet left for figma-lib's Sheet.md (only the restore-row padding is back).
- Checks: every gallery state above renders with no console errors; 16 app pages (home, payment, pay, loan, method, order, amount, docs, coupons,
  inbox, id, account, faq, about, city, payment detail) load with no errors. Parity PNGs re-exported to `parity/demo/`.

### 2026-11-19 · Parity fixes (REPORT.md high + medium "demo") · phase-1 restore list
Fixed in the components (`shared/ps-ui`), gallery helpers and the export; "check legacy" rows left for figma-lib's updated specs.
| Row | Fix | Where |
|---|---|---|
| Segmented 3 disabled | new `disabled` prop: whole track at `--opacity-disabled`, tabs not pressable; gallery state 3 | form.js, ps-ui.css `.ps-seg.is-disabled`, gallery.js |
| CreditCard 1 | Temporary legend dot back to `--content-accent` (a later rule had made every dot inverse) | ps-ui.css `.ps-credit__dot--temp` |
| Check 2, 6 · Chip 3, 7 | disabled fill `--surface-default` (BRIEF 15) | ps-ui.css `.ps-check--off`, `.ps-chip:disabled` |
| Field 7 stacked focus | label `--content-brand` (also the Popover anchor label) | ps-ui.css `.ps-ff.is-focus .ps-ff__label` |
| EmptyState 0, 1 | component was right; the export caught the Lottie mid-play. `parity/sheet.html` now parks every Lottie on its last frame | parity/sheet.html |
| HomeCoupons 1 one | body one line: the label may use the inner's end padding (172 text in a 168 slot), ellipsis if longer; card 114 (Figma 116) | ps-ui.css `.ps-hcone__body` |
| TopBar 4 search | new `search` prop: the field fills the row, close at the end (16 from the right) | layout.js `PS.TopBar`, ps-ui.css `.ps-top__row--search` |
| UploadTile 0–3 | the tile button filled only its content (57 × 36): now `width: 100%` → slot 165 × 107, ID card 40, mark 20 | ps-ui.css `.ps-upload` |
| UploadTile 1 · Button loading | spinner ring thin (mask `closest-side` 72 %): 24 ring in the tile, 16 in buttons | ps-ui.css `.ps-btn__spin` |
| KV all | gallery card 375, KV 343 | gallery.js `kvCard` |
| Popover 1 | rows sit in the card's 4 gap: pitch 48 | ps-ui.css `.ps-pop--content > .ps-kvlist` |
| Scrim 0 · Sheet 0–2 | gallery frame 360 × 800 (page sheet 684 tall); sheet title no extra inset (16 from the edge) | gallery.js, ps-ui.css `.ps-sheet__titlebar > p` |
| TextLink 3, 4 | on-navy row padding 12 / 16 → 69 | gallery.js `onNavy` |
| Toast 4 | action has no own padding → 44 | ps-ui.css `.ps-toast__act` |
- Re-exported to `parity/demo/`: Segmented, CreditCard, Check, Chip, Field, EmptyState, HomeCoupons, TopBar, UploadTile, KV, Popover, Scrim,
  Sheet, TextLink, Toast, Button. Stage states and app pages (home, ID, documents, coupons, inbox, repay) load with no errors.

**Phase 1 restore list — page layouts I changed beyond the owner's requests.** Each differs from the legacy page; restore it (or keep it
if the owner decides so) in phase 1. "spec" = came from following a Figma spec, "mine" = my own call.
| Change | Pages | Source | Restore |
|---|---|---|---|
| Term chips 36 → 44 tall (`PS.Chip`) | Withdraw amount (AmountCard / AmountEntry) | spec | `.ps-chip` min-height back to 36 where it is a term chip | **restored** — Chip Small 36 (AmountCard) / Medium 41 (AmountEntry), radius 16, no tick (spec Chip phase 1) |
| KV rows min 44 with 12 padding | order details, repay details, loan record | spec | legacy row pitch | **restored** — KV is the bare legacy line again; Rows = lines with a Divider between, spaced by the card's gap; padded rows only with `layout` |
| Sheet top padding 24 and sheet card padding | every bottom sheet | spec | legacy padding | **restored** — card padding 16, plain top 16, title inset 12 (legacy); Sheet.md may still change (figma-lib) |
| LinkList / BankList / PlacePicker rows rebuilt on ListItem (row spacing, chevrons) | FAQ, About, Contact, Account menus, bank picker, city picker | spec | legacy row heights and gaps | **restored** — legacy rows and CSS back (`ps-linkrow`, `ps-banks__row` via `PS.BankRow`, `ps-places__row`) |
| Installment card restyle (42 tile, Check medium, note + Detail) | Repay | spec | legacy card | **restored** — legacy card (42 tile, 16 tick, Divider, Detail link); due today navy text on the grey tile (no light blue) |
| Home Pay button made Secondary (one primary per screen) | Home, repayment due | mine | legacy Primary | **restored** — Primary again |
| TextLink padding | links under forms, support rows | spec | legacy padding | **restored** — padding 0 (spec TextLink phase 1, 21 tall) |
| FileRow as a white card (radius 16, padding 12) | Documents | spec | legacy row | **restored** — legacy row inside `.ps-files__item` again |
| Facts as stacked KVs | loan / offer facts | spec | legacy fact rows | **restored** — legacy fact rows |
| Navigator label and icon sizes | bottom bar, all tab pages | spec | legacy sizes | **restored** — icon 18, label 10 / 16, tabs 46, rim out of the layout → 98 (spec Navigator phase 1) |
| CreditCard / StateCard main button (Primary Large fill, tight StateCard variant dropped) | Home states (review, declined, failed) | spec | legacy button and padding | **restored** — CreditCard: Button Medium + 16 px label (46), padding 12 (spec); StateCard: legacy shade / white buttons and the tight variant |
| UploadTile picture icons (add / ID card / mark instead of the legacy pictures) | ID upload | spec | legacy pictures (`art` prop still works) | **restored** — legacy art (`art`), veil + Busy while loading, round marks |
| Popover menu width 200 | region / city menus | spec | legacy width | **restored** — no fixed width (legacy); options 44 with a divider (spec Popover phase 1) |
| TopBar brand gap | Home header | spec | legacy gap | **restored** — gap 10, mark radius 6.3 (legacy) |
| Input text 14 → 16 (Body/lg) | every field | spec (type rule) | legacy 14 | **restored** — Field, stacked Field and Search values 14 again; 16 px rule moved to phase 2 (coordinator). PhoneField keeps its owner geometry |
| EmptyState colours of title / body (primary / tertiary) | inbox, loans, coupons empty | spec | legacy colours if they differed | **restored** — title tertiary, body placeholder (legacy) |
| Parity fixes above that move things on pages: HomeCoupons one-line body, TopBar search width, UploadTile slot | Home, city picker, ID upload | spec | — (they match the legacy look) |

### 2026-11-19 · Spec components, batch 3 — Product cards · parity export
Stage: `rebrand/shared/stage.html?entry=<Name>&state=<i>`; 35 new states render with no console errors; app pages that use them (Home in
approved / overdue / review / declined / failed, hub, inbox incl. overdue and empty, coupons, ID, documents, history) load with no errors.
| Component | Figma | Demo files | Notes |
|---|---|---|---|
| CreditCard | 11042:1622 | home.js `PS.CreditCard`, ps-ui.css `.ps-credit` | radius 24, padding 16, gap 12, Elevation/1; Amount/lg; legend dots inverse / accent, track `--gradient-white-20`; Withdraw = Primary Large fill (was the 16 px `cta`). Home's approved state is the Withdraw demo's own card (`APP.WdHero`): morph + Credit limit intro untouched |
| PaymentCard | 11042:1695 | home.js | badge Tag navy / negative subtle; overdue Pay = Primary Large; notice Surface/Sunken radius 16, padding 12, title Body/md-strong |
| InboxItem | 11043:1798 | list.js `PS.InboxItem`, screens-account.js (INBOX copy) | whole card is the button; meta (bell 16 · kind Label/sm · green unread dot 8 · time); title = the fact (red only when overdue), body = next step (2 lines), action link green. Inbox copy rewritten to the pattern (tone of voice): coupon, money sent, credit limit, and a calm overdue message when the loan is overdue |
| StateCard | 11043:1847 | status.js, ps-ui.css `.ps-state` | padding 16, gap 16 (the tight variant dropped); main button Primary Large fill; kept: timer, support row, white button tone |
| EmptyState | 11044:1917 | coupon.js `PS.EmptyState` | title primary, body tertiary; button 264; illustration unchanged (Empty box Lottie) |
| UploadTile | 11044:2020 | form.js `PS.UploadTile` + `PS.FileRow` | picture: dashed slot, loading spinner (brand), done = ID card 40 + green mark, error = alert; new `type:'file'` = the document row (FileRow restyled: white row radius 16, badge 36, Body/md-strong name, Caption/sm status, navy progress, 20 px actions) |
| CouponTicket | 11046:2168 | coupon.js | Use = Button Secondary Small; unavailable at Layer/Secondary; selected bar + Elevation/1 unchanged |
| HomeCoupons | 11046:2287 | ps-ui.css | pair coupons 24 top / inner 16·8; one: curve flat `--coupon-gradient-upper` (spec), tab + panel gradients |
- Gallery: spec entries added; old same-name entries renamed "<Name> · more" (their extra states kept).
- **Parity export**: `rebrand/parity/demo/<Name>.png` for all 30 spec components (states in spec order, labelled "Name · state i", 2x,
  375 wide = 343 + the stage's 16 margins; TopBar, Navigator, Sheet, Scrim 360 = full width). Made with headless Chrome from
  `rebrand/parity/sheet.html?entry=<Name>&w=<px>&h=<heights>` (heights measured from the stage); animations are photographed mid-play.

### 2026-11-19 · Spec components, batch 2 — Lists (ListItem, Installment, KV) · Structure (TopBar, Navigator, Sheet, Popover)
Stage: `rebrand/shared/stage.html?entry=<Name>&state=<i>`; 44 new states render with no console errors; 19 app pages that use them load
with no errors (`?page=loan-record` by direct link fails as in the original).
| Component | Figma | Demo files | Notes |
|---|---|---|---|
| ListItem | 11025:971 | list.js `PS.ListItem` + `PS.List` (card), ps-ui.css `.ps-li`, `.ps-list` | rows of `PS.LinkList` (FAQ topics, About, contact, Account menus …), `PS.BankList` and the city picker (`PS.PlacePicker`) now are ListItems (same props for the pages); search marks kept; ID type stays a popover menu in the app (owner rule), no list to switch |
| Installment | 11027:1133 | pay.js `PS.Installment` | Repay card (42 px tile, status colours, Check medium, note + Detail) and new `type:'schedule'` (40 px ring, ordinal, amount, date); old `tone` still read |
| KV | 11028:1193 | core.js `PS.KV` + `PS.Rows`, list.js `PS.Facts` | inline / stacked, tone, onInfo, divider; Rows uses KV dividers; Facts = stacked KVs; kept `bare` (compact line: AmountCard term, OfferCard, payment-number inset) |
| TopBar | 11036:1355 | layout.js (unchanged API), ps-ui.css `.ps-brand` | geometry already matched (116, row 16/16/20, title Label/md 232 wide, glass 40); BrandMark radius `--radius-xs`, gap 8, wordmark Title/xs |
| Navigator | 11037:1403 | layout.js `PS.Navigator`, ps-ui.css `.ps-nav*` | icon 20, Caption/xs, gap 2, active pill `--bg-tint-minimum`, active icon + label `--content-brand`; glide kept |
| Sheet | 11038:1448 | ps-ui.css `.ps-sheet--*` | plain / card: top padding 24, `--surface-raised`, card Elevation/2 (was drop-shadow); handle `--bg-tint-subtle`; page: no scrim (as before); inset sheet's old +11 px margin removed |
| Popover | 11039:1543 | form.js `PS.Popover`, ps-ui.css | menu 200 wide, max 220 (already), options Body/md; new content type (children, 296) and `inline` (gallery); placement / motion unchanged |
- Gallery: entries ListItem, Installment, KV, TopBar, Navigator, Sheet, Popover added to "Rebrand · spec components" in spec order; old "TopBar" and
  "Sheet" renamed "TopBar · live" / "Sheet · live" (interactive). Sheet spec states are drawn still with the sheet classes (the live one animates).
- Open: RepaymentPlan's partial-arc rings (loan.js) are not switched to Installment · schedule (spec Open: full ring) — say if it should; KV rows in
  order-detail cards are now 44 min (spec) so those cards are taller; the Withdraw demo's own header / order rows are its own code (unchanged).

### 2026-11-19 · Segmented: grey track, white thumb (BRIEF decision 2 amended)
- Figma: 11011:646 (figma-lib updating Segmented.md)
- Demo: `shared/ps-ui/ps-ui.css` — track `--bg-neutral`, padding `--spacing-padding-xs` 4, radius `--radius-xl`, min-height `--size-control-lg` 48;
  thumb `--surface-default`, radius `--radius-lg`, no shadow, 40 tall; labels Label/md — selected `--content-primary`, unselected
  `--content-tertiary`, pressed `--content-secondary`. Thumb glide (layoutId, Smooth spring) unchanged. form.js / gallery.js descriptions.
- Checked: stage Segmented 0–2; withdrawal method page (`?page=method`, E-Wallet | Online bank) — computed track #E0E3E5, 48 tall, thumb white.
  In-app screenshot not taken: the browser pane is hidden, so the app's entrance animations don't run (needs the pane shown).

### 2026-11-19 · Components from the Figma specs (15) · green coupon gradient · disabled inputs (BRIEF 15)
Stage: `rebrand/shared/stage.html?entry=<Name>&state=<i>` — gallery group "Rebrand · spec components" (gallery.js), one entry per spec,
states = the spec's showcase in its order. 102 states render with no console errors; 25 app pages that use them load with no errors.
| Component | Figma | Demo files | Notes |
|---|---|---|---|
| Button | 10987:225 | core.js `PS.Button`, ps-ui.css | spec variants/sizes/states, subtitle, icon, loading spinner; kept old variants cta, shade, inverse, outline, soft, glass, ghost, size md, `inactive` |
| TextLink | 11006:366 | core.js `PS.TextLink`, ps-ui.css `.ps-ulink` | tone default/inverse, states, trailing icon, 45 px |
| Tag | 10988:272 | core.js `PS.Tag` | tone × emphasis × size, icon; old tones mapped (outline → accent outline, soft → neutral subtle, best → accent strong small, solid → navy strong, positive → positive strong, negative → negative subtle) |
| Chip | 10989:185 | core.js `PS.Chip`, loan.js | choice chip (selected = green + navy text + tick); AmountCard / AmountEntry term buttons use it (36 → 44 px tall per spec); Summary's old pills → Tag outline + icon (coupon.js) |
| Check | 10989:254 | core.js `PS.Check` | medium 20 / small 16, off / on / disabled / on-disabled; existing 16 px callers pass `size:'small'` |
| Tooltip | 10991:475 | layout.js `PS.Tooltip`, ps-ui.css | dark Ink bubble, arrow, simple / rich, icon (accent), ×; `inline` for fixed bubbles; app placement now under/over the anchor with the arrow at it (see Open) |
| Toast | 10991:524 | layout.js `PS.Toasts` / `PS.Toast` / `PS.ToastCard`, app.js `say`, screens-*.js | dark, status icon, action, ×; never takes focus; `APP.say(text, [ms], status)` shown 3–5 s (4 s default); 39 calls given a status (12 success, 8 error, 19 info) |
| Field | 11009:437 | form.js `PS.Field` (floating) + `PS.FormField` (= stacked) | ring Border/Control → Focus 2 px, Error 2 px; values Body/lg 16; prefix, icon, state (gallery); kept onClick picker, clear, menu, suggest, multiline |
| PhoneField | 11018:830 | form.js `PS.PhoneField`, ps-ui.css `.ps-phone` | country pill + number pill 64, digits 3-3-4 over one hidden input; used only on Log in + Change phone (already the case) |
| OtpBoxes | 11009:1031 | form.js `PS.OtpBoxes` | 48 × 60, ring 2, Active = focused ring + Elevation/3; `focused` for the gallery |
| Search | 11009:488 | form.js `PS.Search` | glass pill 44, icon 20, clear = Icon close 16 |
| SelectBar | 11009:954 | form.js `PS.SelectBar` | radio = `PS.Check` small; card / plain, pressed, disabled |
| Segmented | 11011:646 | form.js `PS.Segmented` | track Surface/Muted, thumb Bg/Selected (navy), glide kept |
| LineTabs | 11011:717 | form.js `PS.LineTabs` | bar Bg/Selected 2 px = label width, off = disabled |
| Scrim | 11021:822 | core.js `PS.Scrim`, ps-ui.css `.ps-scrim--flat` | gradient / flat; PS.Sheet keeps drawing its own (with the fade) |
- Disabled inputs (BRIEF 15): Field, FormField, PhoneField, SelectBar, OtpBoxes — container `--surface-default`, text `--content-disabled`, images /
  icons `opacity: var(--opacity-disabled)` (0.4, already a fraction), border `--border-subtle`, no ring, native input disabled (not focusable).
- Coupon gradient (BRIEF 8 exception, ARCHITECTURE §12.10): `.ps-hcoupon` `--gradient-coupon`, `.ps-hcone__panel` `--gradient-coupon-panel`,
  `.ps-hcone__tab` `--gradient-coupon-tab`; the connector curve is now a masked span (an `<img>` can't be recoloured) filled with
  `--gradient-coupon-tab` (600 → 700, the original SVG's stops) — not the flat `--coupon-gradient-upper`. Coupon centre tickets and the
  coupon picker never had the blue gradient (nothing to change).
- Gallery: old entries renamed / trimmed so names don't collide: "Tooltip · placement" (live app placement), "Toasts" (live stack) kept;
  "InfoButton · SectionLabel", "Count", "Agreement", "ContactMethods", "Keypad", "SelfieTips", "Consent" keep what isn't a spec component;
  "Button", "Tooltip · Toast", "Field · PhoneField" removed (covered by the spec entries).
- Open (to the coordinator): see the report — Tooltip placement vs the owner's corner rule; Withdraw demo's own chips / agreement tick /
  Confirm are not PS components (still the old look); `--elevation-1/2/3` don't exist yet (used raised / overlay / focus); spec class
  names `.ps-t-*` are `.ps-text-*` in the demo; Tag navy-subtle fill = Mist (invisible on the Mist page); stacked Field label upper case.

### 2026-11-19 · Sheet scrim: navy gradient (BRIEF 14, ARCHITECTURE §12.9)
- Figma: — (figma-lib)
- Demo: `shared/ps-ui/ps-ui.css` — `.ps-scrim` background `var(--gradient-scrim)` (navy 0 % → 32 % at 28 % → 56 %), no backdrop blur; the
  old `--ps-scrim` (black 0 → 20 %) removed. `layout.js` comment. Every sheet with a scrim goes through `PS.Sheet` (card + plain sheets:
  log out, delete, rating, scam tips, keep coupon, ID results, date, payment detail, plan), so it is one change. Fade timing unchanged
  (in 0.2 s, out on `PS.MT.LEAVE`).
- Checked at 390: payment detail over the Pay page (secondary) and scam tips over Home — gradient computed exactly as the token, the
  layer runs from behind the status strip to the bottom edge (no band at the nav-bar area); tapping the scrim closes both; once the exit
  fade ends the scrim and sheet are unmounted (0 in the DOM) and no coloured `position:fixed` layer exists (iOS tint rule).
- Not changed (questions to the coordinator): (1) full-page sheets (coupon picker, bank list, pay methods, city) have no scrim by design —
  they cover all but the 48 px strip under the status bar, where the gradient would be ~0 % anyway; keep without? (2) popovers (form
  lists, `PS.Popover`) have a transparent tap-catcher (iPhone-menu style, and CLAUDE.md: no coloured fixed layers) — add the gradient?
  (3) `PS.Overlay` is the full-screen loading cover (owner rule: loading covers everything), not a scrim — unchanged. No full-screen
  dialogs on tab pages exist, so `--overlay-scrim` is not used.

### 2026-11-19 · Lean type set (19 styles, TYPE-AND-STYLES.md)
- Figma: — (text styles renamed by figma-lib)
- Demo — codemod rerun (`migrate-tokens.mjs … --write` on `shared/` and `prototypes/`): **0 replacements** — correct, the copies used
  no old `ps-text-*` classes or old text-style variables (only ps-ui's own `ps-t-*`; `ps-text-big` is the large-text flag, not a style).
- Demo — ps-ui's short classes → the 19 v2 classes, **250 replacements** in 18 files (apply.js 35, form.js 27, pay.js 21, coupon.js 20,
  list.js 20, account.js 20, status.js 20, home.js 18, loan.js 16, gallery.js 13, layout.js 9, feedback.js 8, core.js 5, fx.js 5,
  screens-account.js 5, ps-ui.css selectors 5, screens-pay.js 2, gallery-app.js 1); the 30 `.ps-t-*` definitions removed from ps-ui.css.
  Map: caption-xs/sm → caption-xs/sm · body-md → body-md · body-md-em, label-md-light, section-sm-light, title-14 → body-md-strong ·
  body-lg(-em) → body-lg(-strong) · section-md-light → body-lg-strong · label-sm → label-sm · label-sm-light → caption-sm · label-md,
  section-sm → label-md · section-xs → caption-xs · section-md, title-16 → title-xs · title-sm/md/lg, headline-sm, display-sm → same ·
  number-xs/sm → amount-xs, md → amount-md, lg/xl → amount-lg, xxl → amount-xxl (`PS.Amount` maps its `num` / `decNum` sizes).
- Demo — rules: inputs Body/lg 16 px (`.ps-ff__value` application fields, `.ps-field__value`, search input; field boxes keep 44 px);
  field labels Caption/sm vars; `.ps-link` = Label/md vars + `--content-link` colour. Buttons were already Label/md (`.ps-btn`).
- Checked: 538 text elements on Home, Payment, application basic + estimate, Account hub, Inbox, Coupons, Loan, Login, at 390 and 360,
  measured before and after: **no font-size change, no height change at 390**; 181 differences, all from the approved set — weight
  400 → 500 on captions (49 per width), 600 → 500 on one Caption/xs, letter-spacing 0.02em → 0 on body (31), titles −0.01em → −0.005em
  (10); at 360 one paragraph now wraps to 2 lines instead of 3. Inputs 14 → 16 px as the rule asks. 20 pages: no errors, all text Hanken,
  no `ps-t-*` left. Borrow flow order page checked by tapping at 360.
- Open (questions for the coordinator): (1) the big buttons on the navy card (`.ps-btn--cta` Withdraw / state actions, `.ps-btn--shade`
  Chat) are 16/22 semi-bold (= Title/xs), not Label/md — Figma's card button; left as is so nothing jumps; switch to Label/md 14?
  (2) the loading dots under the green coin are still the original blue (decision 12 kept them as an animation) — recolour them with
  the coin?

### 2026-11-19 · Moved to tokens v2 (colours, Hanken Grotesk, amounts)
- Figma: — (no component specs yet; no component redesign done)
- Demo — tokens: every page (`prototypes/app/index.html`, the 3 Withdraw pages, `shared/stage.html`, `index.html`) loads
  `tokens/v2/tokens.css` then `tokens/v2/legacy-aliases.css`, then root `tokens-rem/` as before.
- Demo — codemod (`tokens/v2/migrate-tokens.mjs`, dry run then `--write`): 489 replacements in `shared/` (ps-ui.css 462, core.js 8,
  form.js 8, gallery.js 5, apply.js 3, stage.html 3), 17 in `prototypes/` (perasure-ds.css 11, withdraw.js 4, screens-withdraw.js 2),
  14 in `rebrand/index.html`. No removed-token orphans. **Codemod problem (reported):** it reads `rename-map.json` through
  `new URL(import.meta.url).pathname`, which keeps the space in "PeraSure Project" as `%20` → ENOENT; ran an unchanged copy from a
  folder without spaces. No `var(--color-*)` left in the copies.
- Demo — palette → roles (ps-ui.css): tag--best `--tag-positive-bg`, ticket shape / slider knob ring `--surface-default`, plan rail
  `--border-subtle`, due-today date `--surface-brand-subtle`, overdue date `--tag-negative-bg`, popover fade `--gradient-white-0`,
  soft button / wheel highlight / selfie checking `--bg-neutral-subtle`, more-dots `--bg-brand`, selfie failed `--bg-negative-subtle`,
  logo tile `--bg-brand`.
- **`--palette-*` kept where no role fits** (value would change or the meaning isn't a role): screen tint + Withdraw amount wash
  `--palette-green-100` (decorative wash) ×5 · nav pill / dimmer / face camera `--palette-neutral-950` ×5 · old-plan price + placeholder +
  selfie ring `--palette-neutral-150` ×3 (placeholder is very faint — flag for the input spec) · white-20 on dark (face camera buttons,
  card track) `--palette-alpha-white-20` ×3 · Withdraw nav pill `--palette-alpha-deep-green-8` ×3 · tag--soft / pay hero `--palette-ambient-200`
  ×2 · negative tile `--palette-red-500` · negative tag bg `--palette-red-200` · photo tips bg `--palette-neutral-800` · small accordion
  head `--palette-neutral-600` · calendar weekday `--palette-neutral-200` · popover thumb `--palette-alpha-navy-16`.
- Demo — hard-coded colours → roles: `withdraw.js` palette `C` now reads v2 roles once (`--surface-brand`, `--content-inverse`,
  `--content-accent`, `--content-brand`, `--bg-selected`, `--content-brand-subtle` (slider), `--content-link`, `--bg-action`,
  `--content-on-action`, `--tag-accent-bg-subtle` / `--tag-accent-content` (chips), content-*/border-*/surface-* neutrals) as hex, because
  the morph mixes them; every inline literal on the home card, order page, chips, Protected toggle, agreement tick and glass bar uses
  them; motion code untouched. `intro.js` card colour reads `--surface-brand`. Withdraw pages' inline `color:` / `background:` → roles
  (amount `--content-brand`, Pay `--bg-action` + `--content-on-action`, tile `--bg-brand`, tag `--tag-accent-*`, divider
  `--border-subtle`, dot `--bg-negative`, cards `--surface-default`, glass `--surface-glass-subtle`, text content-*). `withdraw.css`
  links `--content-link(-pressed)`, page `--surface-page`.
- Demo — text on green: count badge (`.ps-strip__count`) white → `--content-on-action` (white on green-500 was 1.9:1); new icon colour
  `on-action` in `PS.Icon` used on green fills (positive list tile, ID-side tick, selfie-tip ok tick); Withdraw demo badge likewise.
- Demo — fonts: Hanken Grotesk only. `--ps-font-num` → `--font-family-amount`; every amount style in ps-ui.css (`.ps-t-number-*`,
  `.ps-amount`, limits, offer, activity, history, amount entry) = v2 Amount: weight black (800), letter-spacing −0.02em, tabular
  figures. Removed `PS.KERN` / `PS.kern` (core.js) and the split-digit kerning in `PS.AmountEntry` (loan.js); removed `PS.Peso` and its
  uses (coupon.js ×2, home.js ×2, gallery.js) and `.ps-peso`. Tune panel and `index.html` fonts → Hanken. Withdraw: `Component.KERN` stays
  empty (kern() returns 0; motion code unchanged).
- Checked (server http://127.0.0.1:8731 / phone http://10.1.5.169:8731): 46 states in the browser — Home in all 16 Tune states, Payment,
  Pay, Loan (+ overdue), History, Inbox (+ empty), Coupons, Credit, Account pages, borrow (amount → order), application (estimate → selfie),
  login, fallback — no console errors or warnings, every visible text in Hanken Grotesk, no blue except the teal empty-state animation
  (kept, decision 12). Screens at 390 and 360. Standalone Withdraw demo: no errors.
- Re-checked after the coordinator regenerated v2 (§12 tag tones, `--border-control` …): every `var(--*)` the copies use still resolves;
  only value change that reaches the demo is `--tag-accent-content` → green-800 (chips, accent tags, Withdraw chips). Home, order, Payment,
  application reload with no errors. Codemod fix confirmed by the coordinator (no rerun needed).
- Open: (1) the Withdraw demo's own amounts are still weight 700 with their tuned letter-spacing (home card ₱45,000, order ₱12,500) while
  ps-ui amounts are now 800 / −0.02em — change in the Withdraw code (not motion) when the Amount spec lands? (2) left hard-coded on
  purpose: masks `#000`, navy shadow rgba (= shadow-color values, inside animated box-shadow strings), the Credit limit intro's dark
  `#0d1620`, the demo backdrop `#dfe6e5`, `--ps-*` no-token values (countdown orange, expire strip, laurel, star, pager shades,
  on-navy white 16 %), Tune panels (dev tool), inline nav-icon SVG strokes in the Withdraw pages.

### 2026-11-19 · Hold after step 1 (coordinator: token system rebuilt) · spinning coin green (decision 12)
- Status: the coordinator asked to stop after step 1 (copy + paths) because tokens, type and names are being rebuilt. The entries
  below "Copy + no blue", "Pay button" and "One font" were made **before** that message; they are left in place, not extended, and will
  be redone against the new token names. Exactly what they touched is listed in those entries and in the inventory at the end.
- Demo — coin: `rebrand/animations/coins-loading/` = copy of `animations/coins-loading/`, recoloured only there: coin body
  #2B74BD / rgb(43,116,189) → #5CD680 (42 colour values in the two Lottie JSONs, keyframed ones included; 10 + 39 in the GSAP
  modules), highlight #78AAE2 → #99E8AB (8 + 8); ₱ and details #F6F9F8 unchanged. `perasure-coins.lottie` rebuilt cleanly (same
  manifest, the two recoloured JSONs). `preview.png` is still the blue original (not regenerated). `shared/ps-ui/feedback.js`:
  `COINS = PS.rebrand + 'animations/coins-loading/'` (the Loading page and Order submit both use `PS.Coin`). Checked on
  `shared/stage.html?entry=OrderSubmit&state=0`: the loop spins green, the success part lands on the green tick, no console errors.
- Reverted (decision 12, animations and illustrations unchanged): my earlier navy copies of the coin
  (`shared/ps-ui/assets/lottie/loading-coin.json`, `success-coin.json`) deleted; `shared/ps-ui/assets/lottie/loading-dots.json` and
  both `card-glow.svg` restored to the originals (the glow is still not drawn on the home card — see "Copy + no blue").
- Still changed from the original and possibly "illustration" under decision 12 — coordinator to say: `tab-connector.svg` (flat navy),
  `dot-schedule.svg` (navy-800), `logos/sec-shape.svg` and `icons/arrow-up.svg` (navy; the icon is a mask, colour unused),
  withdraw `dot-total-credit.svg` (white 20 %), `dot-temporary.svg` (#5CD680), `perasure-logo.svg` mark (#000128).
- Server (owner allowed the network, 2026-11-19): `python3` static server with no-cache headers, serving `Perasure/` on port 8731 on all
  interfaces. Mac: **http://127.0.0.1:8731/rebrand/index.html** · phone (same Wi-Fi): **http://10.1.5.169:8731/rebrand/index.html**
  (app: `/rebrand/prototypes/app/index.html`). The IP changes if the Mac changes network; the server stops when this session ends.

### 2026-11-19 · One font: Hanken Grotesk (owner, in chat: "按照branding book用一个字体就好")
- Figma: — (figma-lib to follow; coordinator told)
- Demo: `prototypes/withdraw-fund-flow/withdraw.js`, its `index.html`, `with-credit-limit*.html`, `withdraw.css`, `tune.css` — every
  `Inter` / `'Reddit Sans', Inter` font stack → `'Hanken Grotesk'`; `Component.KERN` emptied (Hanken Grotesk has no kerning between
  digits, ₱ , and . — measured in the browser at 2048 px, every pair 0). `perasure-ds.css`: `--font-family-body` / `-label` → Hanken.
  `shared/ps-ui/core.js`: `PS.kern` applies Reddit Sans's table only while `--font-family-number` is still Reddit Sans, so typed
  digits are right before and after the token change. Hanken Grotesk has its own ₱ (checked).
- Tokens: **Request** — `--font-family-body`, `--font-family-label`, `--font-family-number` → `var(--font-family-hanken-grotesk)` in
  `recolour.py`. Until then the shared components (`ps-ui.css`, token-driven) still show Inter for body and Reddit Sans for amounts.
- Open: overrides brief decision 10 (typography was out of scope); letter-spacing of the Number styles was tuned for Reddit Sans — check
  once the token lands.

### 2026-11-19 · Pay button on home: secondary (one green button per screen)
- Demo: `shared/ps-ui/home.js` (PaymentCard, regular layout) uses the new `PS.Button{variant:'secondary'}`; `ps-ui.css`
  `.ps-btn--secondary` — white pill, navy 1.5 px line and text, Mist when pressed. The overdue layout keeps the green button.
- Open: gallery entry text for PaymentCard not updated yet (states unchanged).

### 2026-11-19 · Copy + no blue (steps 1–2)
- Figma: —
- Demo — copies and paths:
  - Copied `prototypes/app/`, `prototypes/withdraw-fund-flow/`, `shared/ps-ui/`, `shared/gallery.js`, `shared/gallery-app.js`,
    `shared/stage.html` into `rebrand/` (same relative layout).
  - HTML: `vendor/`, `assets/`, `tokens-rem/` one level further up (`../../` → `../../../`; stage `../` → `../../`); the token sheet
    link stays `../../tokens/tokens.css`, which from `rebrand/prototypes/*` is `rebrand/tokens/tokens.css`.
  - `shared/ps-ui/core.js`: `PS.root` = repo root (`BASE + '../../../'`, for vendor / animations / credit-limit-coins) and new
    `PS.rebrand` = `rebrand/`; `withdraw-host.js` loads `withdraw.js` from `PS.rebrand` (the rebranded copy). `PS.asset` unchanged
    (the copied, recoloured assets). `withdraw-fund-flow/boot.js` vendor path, `intro.js` credit-limit-coins iframe path fixed.
  - `rebrand/index.html`: picker — rebranded app, Withdraw (plain + credit limit), originals for comparison.
- Demo — colours:
  - `withdraw-fund-flow/perasure-ds.css`: all 257 `--color-*` declarations removed (it re-declared the old palette after
    tokens.css), so the demo takes `rebrand/tokens/tokens.css`.
  - `withdraw-fund-flow/withdraw.js`: palette `C` without blue (navy, navyLight = icon-brand-light, link = green-700, green = #5cd680).
    Home card flat navy, light-blue glow no longer drawn (element kept for `introExit`), credit bar track white 20 %, temporary
    segment green-500; **Withdraw pill green with navy text** (unavailable message on white 12 %); amount morph ink → navy;
    term chips green (green-50 / green-500 line / green-700 text); slider navy-800; caret navy; edit pencil + "View payment schedule" /
    "See benefits" green-700; agreement tick navy; **Confirm green, navy text** (`--color-action-text-default`); Protected toggle green;
    amount-entry top wash new green-100; edit glyph `currentColor`. `intro.js`: closing box colour navy.
  - Withdraw demo pages (`index.html`, `with-credit-limit*.html`): sample payment card — icon tile navy, tag green-100/green-700,
    amount navy, Pay button green/navy; `withdraw.css` links green-700/800; `tune.css` navy; assets: `dot-total-credit.svg` white 20 %,
    `dot-temporary.svg` #5CD680, `perasure-logo.svg` mark #000128, `card-glow.svg` recoloured (unused now).
  - `shared/ps-ui/ps-ui.css`: `.ps-btn--primary` text → `--color-action-text-default` (navy); new `.ps-btn--cta` (shade's size, primary
    colours) for the brand card's main action; `--ps-shade-30` (navy 30 %, invisible on navy) → `--ps-on-navy` white 16 % for the
    card's dots, bar, timer and shade buttons; home coupon tiles / one-coupon tab + panel: blue gradients → flat
    `--color-surface-card-brand`; chips (`.ps-chip--brand`), chosen term (`.ps-term.is-on`), outline tag → green
    (`--color-surface-card-positive-subtle` / `--color-stroke-positive-default|subtle` / `--color-text-positive-default`);
    consent tick navy; `.ps-tag--positive` and `.ps-vote__chip.is-on` text navy on green; brand mark #102950 → #000128.
  - `shared/ps-ui/home.js`: CreditCard glow removed, Withdraw → `variant:'cta'`. `status.js`: StateCard glow removed, its main
    button `cta` (green, navy text), white-tone button unchanged. `tune.css` navy.
  - Assets: `tab-connector.svg` flat navy, `dot-schedule.svg` navy-800, `sec-shape.svg` + `icons/arrow-up.svg` navy.
- Checked: served locally, 390×844 and 360 wide; Home in 16 Tune states, Payment, Pay, Loan, History, Inbox (+ empty), Coupons,
  Credit, Account pages, borrow flow (amount → order → agreement → Confirm), application (estimate, basic, ID, check, contact, selfie),
  login, fallback. Computed-colour audit: no blue outside third-party logos and Lottie art; no new console errors (`?page=loan-record`
  and `?page=message` throw when opened by link without an item — the original does the same).
- Tokens: **Request** — `tokens.css` does not match `mapping.json` for `--tag-color-brand-*` (text = brand-500 → navy-800, bg-subtle
  ambient) and `--tag-color-positive-text-default` (= green-500, unreadable as text); mapping says green-100 / 50 / 200 / 700.
- Open:
  1. **Lottie art in `animations/` (repo root, shared, not copied)** still has blue: `safe-transaction` (#076AFD, light blue #B5D9FF —
     anti-scam carousel), teal in `doc-verify`, `empty-box`, `customer-service-chat`. Same teal in `ps-ui/assets/art/empty-box.svg`,
     `protection.svg` (+ pink heart), pink coupon art. Recolour (rebrand copies of the files) or keep as illustration palette?
  2. "Amount card: flat navy" — applied to the home credit card. The order page's editable amount panel (slider, term chips) stays white;
     confirm.
  3. Third-party logos keep their colours (Facebook, GCash, partner banks).
  4. `.ps-tag--solid` badges ("New", "6 coupons") stay navy — green instead (rule 2 "tags green")?

## Inventory of the copies (generated 2026-11-19)

Per file: hard-coded colours (value×count), font names (×count), and every `var(--*)` used (×count). Assets (SVG/PNG/Lottie) and `ph-places.js` (data) excluded. Font counts include mentions in comments. Regenerated after the v2 move.

### `index.html`
- Fonts: Hanken Grotesk×3
- Other vars (15 uses, 13 names): `--content-primary`×2, `--content-secondary`×2, `--surface-page`×1, `--font-family-body`×1, `--surface-brand`×1, `--content-inverse`×1, `--content-accent`×1, `--surface-default`×1, `--elevation-raised`×1, `--border-selected`×1, `--bg-action`×1, `--content-on-action`×1, `--surface-sunken`×1

### `prototypes/app/app.css`
- Other vars (21 uses, 11 names): `--spacing-gap-md`×4, `--spacing-padding-xl`×3, `--spacing-page-x-sm`×3, `--spacing-gap-lg`×2, `--spacing-padding-lg`×2, `--spacing-padding-5xl`×2, `--spacing-gap-sm`×1, `--spacing-gap-xl`×1, `--spacing-gap-2xs`×1, `--sb`×1, `--e`×1

### `prototypes/app/coupons-data.js`
- Fonts: Inter×3

### `prototypes/app/data.js`
- Fonts: Inter×1

### `prototypes/app/screens-account.js`
- Fonts: Inter×2

### `prototypes/app/screens-help.js`
- Fonts: Inter×5

### `prototypes/app/screens-pay.js`
- Fonts: Inter×1

### `prototypes/app/screens-withdraw.js`
- Other vars (2 uses, 1 names): `--content-positive-strong`×2

### `prototypes/withdraw-fund-flow/index.html`
- Colours (74): `#000`×40, `rgba(0,0,0,0)`×20, `#3c4850`×7, `rgba(0,1,40,0.08)`×3, `rgba(0,1,40,0.16)`×2, `#dfe6e5`×1, `rgba(0,1,40,0.12)`×1
- Fonts: Hanken Grotesk×16
- Colour/effect vars (2 uses, 2 names): `--tag-accent-bg`×1, `--tag-accent-content`×1
- Other vars (36 uses, 17 names): `--content-primary`×9, `--surface-default`×5, `--content-placeholder`×4, `--content-tertiary`×2, `--content-on-action`×2, `--content-disabled`×2, `--surface-glass-subtle`×2, `--surface-page`×1, `--bg-brand`×1, `--content-inverse`×1, `--bg-positive`×1, `--content-brand`×1, `--border-subtle`×1, `--content-secondary`×1, `--bg-action`×1, `--bg-negative`×1, `--palette-alpha-deep-green-8`×1

### `prototypes/withdraw-fund-flow/intro.css`
- Colours (3): `#0d1620`×3

### `prototypes/withdraw-fund-flow/intro.js`
- Colours (2): `#000128`×1, `#0d1620`×1

### `prototypes/withdraw-fund-flow/motion-tokens.js`
- Colours (4): `rgba(0,1,40,0)`×2, `rgba(0,1,40,0.16)`×1, `rgba(0,1,40,0.12)`×1

### `prototypes/withdraw-fund-flow/perasure-ds.css`
- Colours (4): `#6ee317`×2, `#53c575`×2
- Fonts: Inter×2, -apple-system×2, Hanken Grotesk×2
- Colour/effect vars (6 uses, 6 names): `--shadow-color-subtle-2`×1, `--shadow-color-subtle-1`×1, `--shadow-color-default-2`×1, `--shadow-color-default-1`×1, `--shadow-color-focus-2`×1, `--shadow-color-focus-1`×1
- Other vars (142 uses, 95 names): `--font-weight-bold`×8, `--font-family-display`×5, `--font-family-title`×5, `--font-family-hanken-grotesk`×4, `--spacing-16`×4, `--font-family-body`×4, `--font-weight-regular`×4, `--font-size-14`×3, `--line-height-20`×3, `--spacing-32`×3, `--font-size-12`×2, `--font-size-16`×2, `--line-height-16`×2, `--line-height-24`×2, `--spacing-2`×2, `--spacing-4`×2, `--spacing-8`×2, `--spacing-12`×2, `--spacing-20`×2, `--spacing-24`×2, `--spacing-48`×2, `--font-weight-semibold`×2, `--font-family-label`×2, `--font-weight-medium`×2, `--font-size-11`×1, `--font-size-18`×1, `--font-size-20`×1, `--font-size-24`×1, `--font-size-28`×1, `--font-size-32`×1, `--font-size-36`×1, `--font-size-40`×1, `--font-size-48`×1, `--line-height-14`×1, `--line-height-22`×1, `--line-height-28`×1, `--line-height-32`×1, `--line-height-36`×1, `--line-height-40`×1, `--line-height-44`×1, `--line-height-48`×1, `--line-height-56`×1, `--font-weight-400`×1, `--font-weight-500`×1, `--font-weight-600`×1, `--font-weight-700`×1, `--font-weight-800`×1, `--radius-0`×1, `--radius-8`×1, `--radius-12`×1, `--radius-16`×1, `--radius-20`×1, `--radius-24`×1, `--radius-32`×1, `--radius-999`×1, `--spacing-0`×1, `--spacing-40`×1, `--stroke-width-10`×1, `--stroke-width-15`×1, `--stroke-width-20`×1, `--stroke-width-25`×1, `--font-size-display-xl`×1, `--line-height-display-xl`×1, `--font-size-display-lg`×1, `--line-height-display-lg`×1, `--font-size-display-md`×1, `--line-height-display-md`×1, `--font-size-display-sm`×1, `--line-height-display-sm`×1, `--font-size-headline-sm`×1, `--line-height-headline-sm`×1, `--font-size-title-lg`×1, `--line-height-title-lg`×1, `--font-size-title-md`×1, `--line-height-title-md`×1, `--font-size-title-sm`×1, `--line-height-title-sm`×1, `--font-size-section-title-md`×1, `--line-height-section-title-md`×1, `--font-size-section-title-sm`×1, `--line-height-section-title-sm`×1, `--font-size-body-lg`×1, `--line-height-body-lg`×1, `--font-size-body-md`×1, `--line-height-body-md`×1, `--font-size-label-md`×1, `--line-height-label-md`×1, `--font-size-label-sm`×1, `--line-height-label-sm`×1, `--font-size-caption-sm`×1, `--line-height-caption-sm`×1, `--font-size-caption-xs`×1, `--line-height-caption-xs`×1, `--content-link`×1, `--content-link-pressed`×1

### `prototypes/withdraw-fund-flow/phone-fit.js`
- Colours (2): `#fff`×1, `rgba(0,0,0,.72)`×1
- Fonts: Inter×1

### `prototypes/withdraw-fund-flow/tune.css`
- Colours (13): `#fff`×2, `#141e24`×2, `#6a757d`×2, `#000128`×2, `rgba(0,1,40,.16)`×2, `#ffffff`×1, `#eef1f2`×1, `rgba(20,30,36,.78)`×1
- Fonts: Hanken Grotesk×4, system-ui×3, Inter×1
- Other vars (3 uses, 2 names): `--sb`×2, `--ftop`×1

### `prototypes/withdraw-fund-flow/with-blur.html`
- Colours (1): `#f0f5f4`×1

### `prototypes/withdraw-fund-flow/with-credit-limit-used.html`
- Colours (74): `#000`×40, `rgba(0,0,0,0)`×20, `#3c4850`×7, `rgba(0,1,40,0.08)`×3, `rgba(0,1,40,0.16)`×2, `#dfe6e5`×1, `rgba(0,1,40,0.12)`×1
- Fonts: Hanken Grotesk×16
- Colour/effect vars (2 uses, 2 names): `--tag-accent-bg`×1, `--tag-accent-content`×1
- Other vars (36 uses, 17 names): `--content-primary`×9, `--surface-default`×5, `--content-placeholder`×4, `--content-tertiary`×2, `--content-on-action`×2, `--content-disabled`×2, `--surface-glass-subtle`×2, `--surface-page`×1, `--bg-brand`×1, `--content-inverse`×1, `--bg-positive`×1, `--content-brand`×1, `--border-subtle`×1, `--content-secondary`×1, `--bg-action`×1, `--bg-negative`×1, `--palette-alpha-deep-green-8`×1

### `prototypes/withdraw-fund-flow/with-credit-limit.html`
- Colours (74): `#000`×40, `rgba(0,0,0,0)`×20, `#3c4850`×7, `rgba(0,1,40,0.08)`×3, `rgba(0,1,40,0.16)`×2, `#dfe6e5`×1, `rgba(0,1,40,0.12)`×1
- Fonts: Hanken Grotesk×16
- Colour/effect vars (2 uses, 2 names): `--tag-accent-bg`×1, `--tag-accent-content`×1
- Other vars (36 uses, 17 names): `--content-primary`×9, `--surface-default`×5, `--content-placeholder`×4, `--content-tertiary`×2, `--content-on-action`×2, `--content-disabled`×2, `--surface-glass-subtle`×2, `--surface-page`×1, `--bg-brand`×1, `--content-inverse`×1, `--bg-positive`×1, `--content-brand`×1, `--border-subtle`×1, `--content-secondary`×1, `--bg-action`×1, `--bg-negative`×1, `--palette-alpha-deep-green-8`×1

### `prototypes/withdraw-fund-flow/withdraw.css`
- Colours (1): `#dfe6e5`×1
- Fonts: Hanken Grotesk×1, system-ui×1
- Colour/effect vars (2 uses, 2 names): `--gradient-top-nav-filled`×1, `--gradient-bottom-primary-nav-filled`×1
- Other vars (16 uses, 8 names): `--e`×5, `--sb`×3, `--surface-page`×2, `--vh`×2, `--content-link`×1, `--content-link-pressed`×1, `--ph`×1, `--ftop`×1

### `prototypes/withdraw-fund-flow/withdraw.js`
- Colours (50): `#000128`×5, `rgba(0,1,40,0.16)`×4, `rgba(0,1,40,0.08)`×4, `#ffffff`×3, `#5cd680`×3, `#e0e3e5`×3, `rgba(0,1,40,0)`×3, `#2b8448`×2, `#97a0a6`×2, `#000`×2, `rgba(0,1,40,0.12)`×2, `#0a1a4a`×1, `#edfcf0`×1, `#141e24`×1, `#3c4850`×1, `#6a757d`×1, `#7d878e`×1, `#bac0c4`×1, `#f0f5f4`×1, `#0d1620`×1, `#91e8d2`×1, `#0da58e`×1, `#193f46`×1, `#ff72a3`×1, `#0a1219`×1, `rgba(0,0,0,0)`×1, `rgba(255,255,255,0.12)`×1, `rgba(255,255,255,0)`×1
- Fonts: Hanken Grotesk×31, Reddit Sans×5, Satoshi×4, Inter×2
- Colour/effect vars (2 uses, 2 names): `--gradient-bottom-secondary-nav-filled`×1, `--gradient-top-nav-filled`×1
- Other vars (5 uses, 3 names): `--palette-green-100`×3, `--palette-alpha-white-20`×1, `--surface-glass-subtle`×1

### `shared/gallery-app.js`
- Fonts: Inter×1

### `shared/gallery.js`
- Fonts: Inter×5, Hanken Grotesk×1
- Other vars (6 uses, 5 names): `--content-brand`×2, `--surface-brand`×1, `--content-negative-subtle`×1, `--surface-sunken`×1, `--ps-countdown`×1

### `shared/ps-ui/apply.js`
- Other vars (3 uses, 2 names): `--content-negative-subtle`×2, `--content-negative`×1

### `shared/ps-ui/core.js`
- Fonts: Hanken Grotesk×2, Reddit Sans×1
- Other vars (10 uses, 10 names): `--content-primary`×1, `--content-secondary`×1, `--content-tertiary`×1, `--content-placeholder`×1, `--content-brand`×1, `--content-brand-subtle`×1, `--content-positive-strong`×1, `--content-inverse`×1, `--content-on-action`×1, `--ps-countdown`×1

### `shared/ps-ui/coupon.js`
- Fonts: Inter×2

### `shared/ps-ui/feedback.js`
- Fonts: Inter×2

### `shared/ps-ui/form.js`
- Other vars (8 uses, 6 names): `--content-placeholder`×2, `--border-brand-strong`×2, `--content-negative`×1, `--palette-neutral-950`×1, `--content-positive-strong`×1, `--content-brand-subtle`×1

### `shared/ps-ui/loan.js`
- Fonts: Hanken Grotesk×1
- Other vars (4 uses, 4 names): `--spacing-gap-2xs`×1, `--spacing-gap-sm`×1, `--spacing-gap-xs`×1, `--spacing-gap-md`×1

### `shared/ps-ui/pay.js`
- Other vars (1 uses, 1 names): `--spacing-gap-`×1

### `shared/ps-ui/phone-fit.js`
- Colours (2): `#fff`×1, `rgba(0,0,0,.72)`×1
- Fonts: -apple-system×2, Inter×1

### `shared/ps-ui/ps-ui.css`
- Colours (30): `#000`×14, `#000128`×2, `#0d1620`×2, `#ff5e00`×1, `#fff4ee`×1, `#c8e5df`×1, `#ffcc00`×1, `#f5f5f5`×1, `rgba(255,255,255,0.16)`×1, `rgba(0,0,0,0)`×1, `rgba(0,0,0,0.2)`×1, `rgba(0,1,40,0.4)`×1, `rgba(0,1,40,0.08)`×1, `rgba(255,255,255,0.9)`×1, `rgba(0,0,0,0.6)`×1
- Fonts: Inter×6, Hanken Grotesk×5
- Colour/effect vars (36 uses, 15 names): `--blur-backdrop-bg`×14, `--blur-glass-nav-effect-shadow`×6, `--gradient-bottom-primary-nav-filled`×2, `--gradient-bottom-secondary-nav-filled`×2, `--blur-glass-nav-effect-focus`×2, `--gradient-top-nav-filled`×1, `--tag-positive-bg`×1, `--blur-glass-nav-effect-focus-shadow`×1, `--shadow-color-subtle-1`×1, `--shadow-color-subtle-2`×1, `--shadow-color-default-1`×1, `--shadow-color-default-2`×1, `--tag-negative-bg`×1, `--gradient-white-0`×1, `--tag-neutral-border`×1
- Other vars (1812 uses, 170 names): `--spacing-gap-sm`×110, `--spacing-gap-md`×81, `--spacing-gap-xs`×78, `--spacing-padding-lg`×60, `--spacing-gap-lg`×54, `--content-primary`×49, `--radius-full`×49, `--spacing-padding-md`×49, `--font-family-body`×44, `--font-weight-semi-bold`×42, `--font-family-title`×40, `--content-brand`×39, `--ps-tx`×38, `--spacing-padding-sm`×38, `--surface-default`×37, `--content-inverse`×30, `--font-weight-regular`×28, `--radius-xl`×28, `--surface-sunken`×27, `--spacing-padding-xl`×26, `--spacing-gap-2xs`×25, `--content-secondary`×22, `--content-tertiary`×21, `--e`×20, `--stroke-width-default`×20, `--font-weight-medium`×18, `--content-placeholder`×17, `--radius-sm`×17, `--font-weight-black`×16, `--border-subtle`×15, `--radius-md`×15, `--font-line-height-body-md`×14, `--font-weight-bold`×14, `--content-disabled`×14, `--sb`×14, `--font-size-caption-xs`×13, `--font-size-caption-sm`×13, `--font-family-label`×13, `--ps-font-num`×13, `--spacing-gap-xl`×13, `--spacing-padding-xs`×13, `--radius-xs`×13, `--font-line-height-caption-xs`×12, `--font-line-height-caption-sm`×12, `--stroke-width-medium`×12, `--content-negative`×12, `--font-size-body-md`×11, `--font-size-label-md`×11, `--font-line-height-label-md`×11, `--stroke-width-strong`×11, `--surface-brand`×10, `--font-size-body-lg`×9, `--spacing-padding-3xl`×9, `--radius-xxl`×9, `--content-brand-subtle`×9, `--surface-page`×8, `--border-selected`×8, `--font-size-section-title-md`×8, `--font-line-height-section-title-md`×8, `--font-size-display-sm`×8, `--font-line-height-display-sm`×8, `--spacing-page-x-sm`×8, `--elevation-raised`×8, `--spacing-padding-2xs`×8, `--content-positive-strong`×7, `--spacing-gap-2xl`×7, `--bg-brand`×7, `--content-positive`×7, `--spacing-padding-2xl`×7, `--radius-lg`×7, `--font-line-height-body-lg`×6, `--font-size-section-title-sm`×6, `--font-line-height-section-title-sm`×6, `--font-size-title-lg`×6, `--surface-glass`×6, `--ps-s`×6, `--spacing-4`×6, `--font-size-label-sm`×5, `--font-line-height-label-sm`×5, `--font-line-height-title-lg`×5, `--ph`×5, `--content-on-action`×5, `--surface-brand-subtle`×5, `--border-positive`×5, `--border-default`×5, `--elevation-overlay`×5, `--spacing-12`×5, `--bg-positive`×5, `--font-size-title-sm`×4, `--content-link`×4, `--ps-col-top`×4, `--spacing-padding-5xl`×4, `--palette-neutral-950`×4, `--ps-src`×4, `--bg-inverse`×4, `--ps-on-navy`×4, `--bg-positive-subtle`×4, `--ps-toast-top`×4, `--elevation-focus`×4, `--layer-opacity-secondary`×4, `--bg-negative-subtle`×4, `--font-size-title-md`×3, `--font-line-height-title-md`×3, `--font-size-display-md`×3, `--font-size-display-xl`×3, `--bg-action`×3, `--ps-inset-0`×3, `--palette-neutral-150`×3, `--border-negative`×3, `--bg-neutral-subtle`×3, `--surface-raised`×3, `--font-family-display`×2, `--content-negative-strong`×2, `--palette-green-100`×2, `--ps-col-bottom`×2, `--ps-bot-room`×2, `--ps-top-h`×2, `--spacing-section-lg`×2, `--layer-opacity-minimum`×2, `--border-brand-strong`×2, `--palette-ambient-200`×2, `--content-brand-strong`×2, `--surface-page-strong`×2, `--border-filled`×2, `--ps-inset-80`×2, `--content-accent`×2, `--ps-countdown`×2, `--border-negative-subtle`×2, `--ps-shade-8`×2, `--ps-shade-40`×2, `--spacing-24`×2, `--h`×2, `--palette-alpha-white-20`×2, `--font-family-amount`×1, `--font-line-height-title-sm`×1, `--font-size-headline-sm`×1, `--font-line-height-headline-sm`×1, `--vh`×1, `--ftop`×1, `--ps-top-fade`×1, `--ps-bot-fade`×1, `--spacing-section-md`×1, `--bg-disabled`×1, `--border-positive-subtle`×1, `--ps-scrim`×1, `--layer-opacity-subtle`×1, `--spacing-page-bottom-sm`×1, `--spacing-section-sm`×1, `--spacing-page-bottom-md`×1, `--bg-action-pressed`×1, `--font-size-16`×1, `--font-line-height-24`×1, `--radius-12`×1, `--ps-expire-strip`×1, `--spacing-16`×1, `--spacing-8`×1, `--palette-red-500`×1, `--surface-muted`×1, `--surface-page-subtle`×1, `--palette-red-200`×1, `--ps-star`×1, `--ps-i`×1, `--palette-neutral-600`×1, `--bg-tint-navy-subtle`×1, `--palette-alpha-navy-16`×1, `--palette-neutral-200`×1, `--bg-negative`×1, `--palette-neutral-800`×1, `--radius-2xs`×1, `--spacing-gap-3xl`×1

### `shared/ps-ui/tune.css`
- Colours (12): `#fff`×2, `#141e24`×2, `#6a757d`×2, `rgba(0,1,40,0.16)`×2, `#ffffff`×1, `#eef1f2`×1, `#000128`×1, `rgba(20,30,36,0.78)`×1
- Fonts: Hanken Grotesk×4, system-ui×3
- Other vars (1 uses, 1 names): `--sb`×1

### `shared/stage.html`
- Other vars (4 uses, 3 names): `--surface-page`×2, `--content-tertiary`×1, `--font-family-body`×1

Totals: 258 distinct `var(--*)` names, 2213 uses; 47 distinct hard-coded colour values, 346 uses.


## 2026-11-20 · Credit limit increase: the blue becomes the new green (owner rule, BRIEF 12 exception)

Rebrand copy only (`rebrand/prototypes/credit-limit-coins/baked/`); the root copy is untouched.

- Already in place from the review round: `#3FA0F0` → green-500 via `--accent` (= `--content-accent`) for `BLUE` (rings, rays), the number flash (`CL.accent`), the blue SVG star `starS2` (`#5CD680`) and the replay focus outline; ground `--bg` = `--surface-brand` (navy-900 #000128); `--chip` navy-800; muted text neutral white alphas.
- Changed now: increase pill bg green-950 → **green-900 #154624**, text green-400 → **green-300 #99E8AB**; the burst's white is back to the art white `#EEF5EF` (was the interface white).
- Unchanged: gold coins, orange star `#FF6B3D`, white stars `#EEF5EF`, all motion, physics, timing.
- Shockwave variant: not used anywhere in the rebrand app (only the heap is loaded by fx.js / intro.js), so nothing to map.
- Also found: the closing box around the intro still had the legacy ground `#0D1620` (shown at 6250–6350 ms). Now navy: `withdraw-fund-flow/intro.css` (`var(--surface-brand,#000128)`), `intro.js` (`mixHex('#000128', …)`), `withdraw.js` introExit `bgDark` `#000128`, `ps-ui.css` `.ps-climit` (the app's intro host) `var(--surface-brand)`. Colour only; motion untouched.
- Motion sheets re-captured: `parity/motion/intro-available(.png, -exit.png)` and `intro-used(.png, -exit.png)`: root (blue) on top, rebrand (green) below, same frames. Positions unchanged from the review round (only the font-related 7–8 px in two exit frames, available state).
- Progress: **done** — waiting for review.

## 2026-11-20 · Rule noted: the pre-rebrand version stays as it is

Every change goes into a copy inside `rebrand/` (copy first, then edit; no exceptions, docs included). `git status` outside `rebrand/` is clean: the coordinator's handoff docs now live in `rebrand/handoff/`, and this lane never changed a root file. The root is only read: the motion comparison opens the root demo, and the rebrand loads the shared coin recording, fonts and vendor/ from there.

## 2026-11-20 · Loading dots → brand green (owner rule, BRIEF 12 third exception)

- `shared/ps-ui/assets/lottie/loading-dots.json` (PS.Dots / PS.Loader): the 4 fills #2C74BE → green-500 #5CD680 (the coin body's green). Nothing else in the file changed; motion and timing as before.
- Other copies in rebrand/: none (no GSAP version of the dots; `animations/coins-loading` holds only the coin). The small button pulse `PS.Busy` is CSS, not these dots.
- Parity PNG: new `parity/demo/Loader.png` (gallery entry "Loader · Coin · Dots · Busy", 4 states, 360 wide; there was no Loader PNG before).
- Motion sheet: new scenario `loader` → `parity/motion/loader.png` (one 1 s loop every 50 ms, root blue above, rebrand green below: same frames).
- Progress: **done** — waiting for review.

## 2026-11-20 · Review accepted: two follow-ups

1. Intro pills: already on the BRIEF 12 map since the "blue becomes green" round. The increase pill is green-900 #154624 with green-300 #99E8AB text, and the date pill is navy-800. The intro sheets in `parity/motion/` (intro-available, intro-used and their -exit sheets) were captured after that change, so they show these colours.
2. ProtectionCard: the body gets the legacy / Figma fixed text box as `min-height: 4rem` (64) through a new class `.ps-protect__body` in ps-ui.css and loan.js. The card is now 180 × 328, the same as legacy and Figma. Phase 2 decides whether it shrinks. `parity/demo/ProtectionCard.png` is re-exported.
- Progress: **done**, waiting for review.

## 2026-11-20 · Owner correction: Credit limit increase keeps its own ground and pill fills (BRIEF 12 updated)

Replaces the pill / ground colours of the two entries above. Rebrand copy only.
- Back to the ORIGINAL: ground `#0D1620` (`--bg`, `--ink`, the page's first-paint style, the JS fallback), increase pill fill `#16304A`, date pill fill `#1B2834` (`--cl-exp-bg`; `--chip` too, the same original value).
- Green only: accent `#3FA0F0` → green-500 (number flash, rings, rays, blue star, focus ring) and the increase pill text `#6FB8F5` → green-300 `#99E8AB`.
- The closing box around the intro is back on `#0D1620` as well (withdraw-fund-flow `intro.css`, `intro.js` mix, `withdraw.js` introExit `bgDark`, `ps-ui.css` `.ps-climit`). It is the intro's own ground, so a navy box would flash against it. The home card it lands on stays v2.
- Everything else as built: Hanken, tracking, inverse text, coins, motion.
- Intro sheets re-captured (available, used and both -exit sheets). Available: as before (the font's 7–8 px in two frames). Used: the root side was re-captured too, because a re-capture of the root alone moved the exit's first frame by one 50 ms step against the old one (load timing in the capture, not the page). Now one frame differs (6350 ms, the first exit frame), from the same capture timing.
- Progress: **done**, waiting for review.

## 2026-11-20 · Round: figma-lib 14–15 (Field, PhoneField, Account + Application Details specs, pages)

1. Field: no ring at rest or filled (Floating `.ps-field` and Stacked `.ps-ff__box`); focus (border-focused 2) and error (border-negative 2) unchanged; disabled keeps the BRIEF 15 subtle ring. Placeholder = legacy Neutral/150 #CDD1D4 through a new `--ps-field-placeholder: var(--palette-neutral-150)` in ps-ui.css :root (no semantic token: Content/Placeholder is neutral-400 → token request for the coordinator).
2. PhoneField: both pills' side padding 20 → 16 (`--spacing-padding-lg`), message too. Measured at 328: country pill 91 × 64 (= Figma), number pill 225, placeholder 184 fits in 193.
3. ProtectionCard: done last round (`.ps-protect__body` min-height 4rem → card 180 × 328 = legacy / Figma).
- Progress: 1–3 done → 4 (specs) next.
4. New specs (in progress). New parts, each used by its parent (components first): `PS.Radio` (size 16 | 14), `PS.ReasonRow`, `PS.ReasonText`, `PS.ResendTimer` (form.js; ReasonList uses the first three), `PS.LinkRow` (list.js; LinkList uses it), `PS.VerifiedBadge` (account.js; Profile), `PS.FileBadge` (FileRow), `PS.ResultBadge` (UploadTile marks), `PS.DateCell` + `PS.Weekday` (DatePicker), `PS.MenuRow` + `PS.emailParts` (Popover rows, FormField suggestions), `PS.PlaceTab` (LineTabs), `PS.PlaceRow` (PlacePicker, apply.js), ChoiceButton `tone: 'brand'`. 20 gallery entries added in spec state order (spec group, after Slider).
   - Measured = Figma: Radio 16, VerifiedBadge 16, ReasonRow 247 × 36 / 20, _ReasonText 296 × 166, _ResendTimer 46 / 121 × 20, LinkRow 296 × 36 / 20 / 38 / 22, ActivityItem 112 / 128, CreditLimitCard 130, _FileBadge 36, ResultBadge 20, _DateCell 24, _Weekday 24 × 14, _FileRow 36 / 40.
   - Fixed to Figma / legacy: HubCard 146 → 138 (gap 20 → 12: 16 · 58 · 12 · 36 · 16); PlaceTab 42 → 44 (tab bottom padding 2); ChoiceButton 58 → 56 (title box 22); DocCard 67 / 359 → 60 / 368 (sub line 14 without the button's strut; a line after the last file and 16 before Add files, as legacy 9474:29171); _MenuRow 44 → 36: **popover options are 36 pills 2 apart, no dividers** (legacy select overlay 7201:11982 and EmailSuggestions 38 pitch). The round-09 rule "options 44 with a divider" came from the city list (5974:9438 = PlaceRow), so Popover.md's phase-1 note needs aligning by figma-lib.
   - LinkRow Contact now shows the chevron after the value, as legacy 6156:12996 (it had none).
   - Explained, not changed: PlaceRow — screens keep the legacy pitch 60 (region) / 72 (city) and the same text positions; Figma cuts the row as 44 + 16 gap (city 48 + 12 + line + 12), the demo as one 60 / 72 row. EmailSuggestions 222 vs 220 (the 1 px rim).
   - Changed specs (measured against legacy / Figma):
     - **CreditCard** 186 / 198 / 194 / 170 → **182 / 196 / 186 / 162** (= legacy and Figma; the spec text's numbers): Off 8 under the amount (`.ps-credit__one` −8), On legend → bar 8, User home amount back to the 36 box (last round's 44 withdrawn) and 12 under it, compact amount box 28, 16 to the total, 12 above Withdraw.
     - **PaymentCard** Upcoming 150 → **149** (`.ps-payment--trim` when `caption` is set: 17 cap-height box 16 under the head, same glyph place; due line 24); Due 246, Overdue 262, Overdue coupon 262, Next 152 unchanged (= legacy).
     - **InboxItem**: Overdue now shows the red "Overdue" tag beside the title (legacy 8620:34504; Tag negative strong small); card 176 (Unread / Read 174). The title stays primary as legacy: this replaces the owner-copy rule "overdue = only the title in red" for phase 1 → coordinator to confirm.
     - **UploadTile** Type=File: each file on its white card (`.ps-files__item`): 60 / 64 / 60 / 60; new states Empty ("Add files (0/3)" + hint, 80) and Add more (48) through a new `PS.FileAdd` (FileList uses it). Gallery: 2 states added at the end.
     - **Field**: Stacked 64 / 84 with message = Figma; the clear (×) is the legacy Close circle filled 20 (was close 16), in Field and FormField; gallery state 7 shows it (`clear`) instead of a trailing close icon.
     - **PenaltyInfo**: label column 100 (already); content 256 × 200 = Figma's 254 × 200; card 232 vs 234 = Figma's 1 px rim inside the 17 padding (not changed).
   - **Bug found and fixed (older than this round):** every rebrand app page that uses `phone-fit.js` rendered **blank** (empty grey screen) — PhoneField's root class `.ps-phone` (from the PhoneField round) is also the class phone-fit.js puts on `<html>`, so `.ps-phone { display: flex; width: 100% }` turned the whole document into a flex row and `.ps-screen` became 0 wide. PhoneField's root is now `.ps-phonefield` (form.js + ps-ui.css; the `__cc` / `__num` … parts keep their names). App pages render again (support / delete / about checked headless; root app unaffected: it never had that rule). Earlier "no console errors" sweeps did not catch it: no error is thrown.
   - Parity PNGs exported (360 wide, card 328): the 20 new entries + Field, UploadTile, PaymentCard, CreditCard, PenaltyInfo, InboxItem, PhoneField, Popover, ProtectionCard (29). All gallery states render with no missing entries.
- Progress: 1–4 done; 5 (pages) running in a helper (report → `parity/demo/pages/REPORT.md`), re-capturing after the blank-page fix.
   - Delete OTP (legacy 6211:12815 is a page: boxes, centred "Resend code in 59s" = `.ResendTimer`, Delete my account (destructive), Cancel): the demo's delete flow uses the OTP sheet morph (`PS.OtpSheet`, an existing animation, owner rule), so the page was not rebuilt; `PS.ResendTimer` is ready for it → coordinator to decide (keep the sheet or build the legacy page).
   - App sweep after the blank-page fix (headless, 360, 4 s): 23 pages render (payment / credit / manage still on the loading cover at 4 s — random load time, by design).

## 2026-11-20 · BRIEF 16 / 18 / 19 / 20 / 21 (same round)

**BRIEF 16 — on-brand alpha on navy surfaces** (`--bg-on-brand` / `--border-on-brand`, periwinkle 24 %). Audit of every navy surface:
- `--ps-on-navy` deleted from ps-ui.css; its 4 uses → `--bg-on-brand`: `.ps-btn--shade` (StateCard Chat, HubCard Withdraw, every secondary button on navy), `.ps-credit__dot`, `.ps-credit__bar` (base rule), `.ps-state__timer` (the "Time remaining" pill: filled in every StateCard state that shows it).
- Later overrides that had replaced them: `.ps-credit__bar` `--gradient-white-20` → `--bg-on-brand`; `.ps-credit__dot` (the neutral "Total credit" legend dot) white → `--bg-on-brand`; the Temporary dot stays green (data).
- StateCard divider `.ps-state__line` (white at minimum opacity) → `--border-on-brand`.
- Ring tracks: CreditCard compact ring (home.js) and HubCard ring (list.js) — `currentColor` 30 % → `stroke: var(--bg-on-brand)`; the white progress arc stays.
- Withdraw hero `APP.WdHero` (rebrand withdraw.js): bar track white 20 % → `--bg-on-brand`; the "withdrawals unavailable" panel white 12 % → `--bg-on-brand`; the Total credit legend dot (assets/dot-total-credit.svg) white 20 % → #9DB8FF 24 % (an SVG can't read the token; value = the token's). White / green bar fills and the green dot unchanged.
- Checked, nothing neutral on navy: Hero (guest home offer: navy top holds only text and the amount), QrPanel (its Save button is the white action, not a neutral container), CreditLimitCard (white card; only the navy icon tile), OfferCard (a white card). Selfie / camera screens are neutral-950 / black device surfaces, not navy brand: their white 20 % buttons stay.

**BRIEF 18 — tints on the page use `--surface-tint`.** `PS.ScamStrip` ambient-200 → `--surface-tint` (text / icon navy as before). Audit: a live scan of 28 app pages for ambient-50/100/200 fills whose nearest filled parent is the page found nothing else (only the full-screen splash). Strips, notices, chips and the FileList add button are white; sunken fills (inset rows, file badges, the reason box, photo tips) sit inside white cards or sheets → kept. `PS.StatusBox` tone info (ambient-100) is not used by any page; left as is.

**BRIEF 19 — scrim, Over shadow, sheet header.**
- Every sheet on the scrim: `PS.Sheet` scrim now defaults on for every kind (page sheets — coupon picker, banks, payment methods, city — included), same 0.2 s fade in / LEAVE out, tap to close. Elevation/2 (`--elevation-overlay`) was already on page / card / plain / white sheets.
- Popovers: the menu's tap catcher is now the scrim (fades in 0.2 s, out on LEAVE, tap to close) and the popover casts `--elevation-overlay` (was the glass focus shadow). Not for the e-mail suggestions under a field while typing (no catcher there: the field must stay usable).
- Sheet header: new `PS.sheetHead` (layout.js, run by every sheet) — the content sits 12 (`--spacing-gap-md`) under the measured header (`--ps-head-h`), and the header's Elevation/1 (downward only) fades in with `--ps-head-sh = min(scrollTop / 32, 1)` from the scroll event (no React state). **The veil is retired** for these headers: they are solid in the sheet's colour (sunken / white), the shadow does the separating. Checked headless: city, banks, payment methods → gap 12, shadow 0 → 0.5 → 1 at 0 / 16 / 80 px, scrim on.
- "Recommend" tag (method picker): Tag Accent Strong (green-500, navy-900 text). The rebrand tokens already drew Positive Strong navy on green, so no white-on-green tag is left (Negative Strong / Navy Strong are white on red / navy, as designed).
- Gallery: Sheet — 'Page on the scrim', 'Page · header at rest', 'Page · header scrolled'; Popover — 'Menu on the scrim'.

**BRIEF 20 — empty-state placement.** `PS.EmptyState` now places itself (every use gets it): a wrapper `.ps-emptybox` (flex column, spacers flex 2 / flex 3, min 24 each) whose min-height is the free area measured from where it starts down to the bottom bar / sheet foot / tab bar or the scroller's bottom (`emptyRoom`, ResizeObserver + resize; re-measured once the page has risen in). Shorter than block + 48 → it starts 24 down and the area scrolls. `inline: true` keeps a bare block. Removed page offsets (rebrand copy only): `.ps-empty--page` margin, the Fallback's absolute "Order submit height" position, and `marginTop` 3 / 4.5 rem on the help search, banks, payment methods, coupon picker tabs and city search empties. The loader is untouched (centre of the screen). Contact sheet `parity/motion/empty-states.png` (fallback and banks search at 360×640 / 390×844 / 430×932; payment and inbox at 430 — the headless capture kept the other sizes on the app's made-up loading).

**BRIEF 21 — Tooltip tone.** `PS.Tooltip{tone: 'dark' | 'light'}`: light = white bubble and arrow (`--surface-default`), the existing focus drop shadows (Elevation/3), primary text; the leading icon takes the text colour in both tones (inverse / primary; it was green); the close stays muted (placeholder / tertiary). `APP.tipAt` picks the tone from what was tapped (`PS.tipTone`: the first opaque background behind the element is dark → light), so the hub card, the home credit card (WdHero and PS.CreditCard) and StateCard get the white tooltip with no call-site change. Gallery: Tooltip 'Light · on navy', 'Light · rich on navy'.

**Page check (item 5)** — `parity/demo/pages/REPORT.md` + 55 comparison PNGs (legacy | demo | difference), captured after the blank-page fix: 16 match, 37 differ (9 minor), 2 not reached (hub empty state not built; Frame 64 plan sheet does not exist). Fixed now:
- `PS.Menu` badge: 24 → 18 tall (`.ps-menu__item .ps-tag`), the rows stay 20 — removes the +8 under Inbox / Coupons on Account (signed in and out).
- `PS.LinkRow` Contact: no chevron (legacy screen 6156:12848: values end at x 336). Note: the Figma LinkRow Contact variant draws one → figma-lib to align.
- Credit history empties: one copy per tab (legacy 6220:13585 / 6220:13598); their position now follows BRIEF 20.
- Manage account: tall rows; tall LinkRow label 16 px on a 22 line (legacy 6218:13477: 54 pitch).
Left for the coordinator (page / flow or owner decisions, listed in REPORT.md top fixes 4–13): hub empty state (`PS.Tiles` empty) and the hub ⓘ copy ("valid until …" + clock); the delete-code page vs the OTP sheet; PlacePicker card inset 16, 4 px rounded underline, search-group pitch 64, no inner × in the search; popover placement (legacy covers its anchor when opening up, opens from the + on document cards, min width 180, e-mail list anchor + 16); DatePicker bottom inset +16; Confirm title width; BottomBar button + text button spacing / text-link style; option lists (Annulled, Other, ID types with "Higher credit"); the selfie tips gap; the ID camera side label (navy on black); the FormField error ring (legacy shows the red text only); plan sheet from Your loan estimate.
- Parity PNGs re-exported (360): CreditCard, StateCard (timer pill, Chat, divider on the periwinkle alpha), HubCard, CreditLimitCard, ScamStrip, Sheet (5 states), Popover (3), Tooltip (6), MethodPicker, _MethodTabs (Recommend tag), LinkRow, EmptyState. Hub ⓘ checked in the app: the tip opens as `ps-tip--light` by itself.
- Motion sheet `parity/motion/sheet-scroll.png` (city search scrolled 4 px / 50 ms: shadow 0 → 1 by 32 px; scrim behind); `parity/motion/empty-states.png`.
- Progress: **all done** (round items 1–5 + BRIEF 16 / 18 / 19 / 20 / 21) — waiting for review.

## 2026-11-20 · BRIEF 22 / 24 / 25 / 26 / 27

**BRIEF 22 — no navy icon tiles in rows.** New `PS.RowIcon` (core.js): the icon alone, 24, Content/Brand (negative tone: Content/Negative), 12 to the label; `PS.FILLED` maps outlined → filled file names, empty until figma-lib logs the filled icons (none in log/figma.md yet: the outlined icon stands in; swap = one line per icon after `download_assets`). Tiles removed in: Accordion lead ("A friendly reminder": gap 8 → 12), PermissionCard (gap 12), Strip (home chat / updates rows), OrderStatus (failed: red icon; gap 16 → 12), CreditLimitCard head (wallet). Not changed, to confirm: ActivityItem's 36 tiles are coloured by type (green repayment / navy loan, legacy credit history card 3871:1173), so I left them; say if they go too. PNGs: Accordion, PermissionCard, Notice, Strip, CreditLimitCard.

**BRIEF 24 — `PS.Button{variant:'neutral'}`**: `--bg-neutral` fill, no border, primary label; pressed `--bg-neutral-strong`; disabled as every button. Swapped: `PS.Confirm` Cancel (log out, delete, every two-button dialog), IdResult failed "Try again" (beside "Enter manually"). Kept: a secondary alone (outlined); the BottomBar's second action is a text button in every use (Reject / Not now / Continue — legacy), not a secondary, so it stays text; the date wheel's Cancel / Confirm are both glass (no primary); the selfie camera's "Take again" sits on the black camera screen (not changed). Gallery: Button 'Neutral', '· pressed', '· disabled', 'Neutral + primary in a row'. PNGs: Button, BottomBar.

**BRIEF 25 — DatePicker columns**: month and year are two equal columns ((row − 12) / 2, gap 12), the ‹ › at their ends (16 icon, 40 touch area), the label centred between them — measured 142 + 12 + 142 in a 296 row, whatever the month. Same steppers in every view (days, month wheel, year wheel). New `mode` prop (the view it opens on) for the gallery; spec-group entry 'DatePicker' (Days · September, Days · May, Month wheel, Year wheel); PNG DatePicker.

**BRIEF 26 — back icon**: the demo's back icon `assets/icons/chevron-left.svg` **is the legacy glyph** (its layer is `nav/chevron-left`, filled #141E24, 18 × 18; identical to the root demo's file) — `PS.Back` (TopBar back), the selfie glass back and the date sheet's back already use it. Stand-ins found and fixed: the date picker ‹ was `chevron-right` mirrored (scaleX(−1)) → `chevron-left`; the Withdraw demo's amount / order pages drew their own stroked `chevL` path → the legacy file. Stand-ins left (no up / down chevron in the icon set): PermissionCard draws `chevron-right` turned ±90° for open / closed; Accordion and DocCard turn it with their open / close motion (a rotation by design). The ID camera's close is the back chevron turned 90° with the landscape layout (by design). Note: with ‹ = the legacy filled glyph, the date picker's › is still the stroked v2 `chevron-right`, so the pair doesn't match until figma-lib's `Icon / Chevron left` (or a matching right) lands — then export and swap.

**BRIEF 27 — `--content-accent-strong`**: step numbers (`PS.Tips`: "How to improve your credit limit" 1 2 3) green-800. Hub empty panel built (it was missing — page check "Hub · Empty" not reached): `PS.Tiles{empty: { icon, title, body }}` = legacy 3525:949, sunken 296 × 144 (20 · clock 32 · 12 · title · 8 · body · 20), icon and title accent-strong, body grey; the hub shows it when there is no history (Loan "No loan", not approved). Gallery-app 'Tiles · empty'. Page empty states (EmptyState) keep their grey title (not panels) — say if they should follow.
- Progress: **all done** — waiting for review. Nothing committed.

## 2026-11-20 · BRIEF 28 / 29 / 30 / 31 + file name

- **BRIEF 28 — ActivityItem tiles swapped:** Loan (no tone) = `--bg-positive` green with a navy icon; Repayment (tone positive) = `--bg-brand-muted` (navy-600, new `.ps-tile.is-muted`) with a white icon. Amount colours unchanged.
- **File name (FileRow / UploadTile file):** already `.ps-text-label-sm` — computed Hanken 600 12 / 16, primary (checked in the stage). Nothing to change in the rebrand copy; if the owner saw it light, it was likely another copy (root demo or Figma) — waiting for figma-lib's typography pass.
- **BRIEF 29 — upload progress dark green:** FileRow bar fill → `--bg-positive-strong` (track neutral); "✓ Uploaded" text and tick → `--content-accent-strong`; selfie upload ring dashes → `--bg-positive-strong`, its cloud icon and "Uploading" → `--content-accent-strong`. Grey statuses (Uploading · 62 % …, Compressing…) and the red failed line unchanged.
- **BRIEF 30 — PlacePicker active tab:** a selected chip — `--bg-positive` with the navy label (`--content-on-action`), radius full, colour change 150 ms; the underline is retired (`.ps-ltabs__bar` hidden). Tab stays 44 (8 · 28 · 8); Default (light grey) and Picked (grey) unchanged.
- **BRIEF 31 — search hits:** one class `.ps-match` (Content/Accent/Strong, same weight) for the typed part: `PS.mark` (city / province search, PlaceRow), bank search (`PS.BankList{q}` → BankRow), payment-method search (`PS.MethodPicker{q}` → MethodGroup rows), help article search, e-mail suggestions (the name before @; it lost its semibold). The rest of each row stays primary.
- Gallery: _BankRow 'Search hit'; the other states already show these (ActivityItem, _FileRow, DocCard, UploadTile, PlaceTab, PlaceRow City · matched, _MenuRow, EmailSuggestions). PNGs re-exported: ActivityItem, _FileRow, DocCard, UploadTile, PlaceTab, PlaceRow, _MenuRow, EmailSuggestions, _BankRow, MethodPicker.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · BRIEF 32 — the root demo's original art and icons

Audit: every file in `rebrand/shared/ps-ui/assets` (art, icons, logos, lottie) and `rebrand/prototypes/withdraw-fund-flow/assets` compared byte for byte with the root demo; the icon paths drawn inline in the rebrand JS (withdraw.js: 17) compared with the root's (all identical); the icon and art names the rebrand code uses compared with the root's; CSS filters on pictures (none); the laurel colour (same).

Restored to the root files (all were colour edits):
- `art/dot-schedule.svg` (schedule timeline dot, was recoloured navy) → original; ScheduleItem / RepaymentPlan now draw it as a CSS mask coloured `--content-brand-subtle` (`.ps-plan__dot`), so the file stays the root's.
- `art/tab-connector.svg` (coupon tab curve, recoloured) → original; it is only ever a CSS mask, so nothing changes on screen.
- `icons/arrow-up.svg` (recoloured fill) → original; icons are CSS masks (`PS.Icon`, currentColor), so nothing changes on screen.
- `logos/sec-shape.svg` (SEC globe on the trust card, recoloured navy) → original (its light blue at 30 % is back: original art, as the rule says).
- Withdraw `assets/dot-total-credit.svg`, `assets/dot-temporary.svg` (recoloured for BRIEF 16 / green) → originals; the hero's legend dots are now drawn in CSS from the tokens (`--bg-on-brand`, `--content-accent`) instead of the files.
- Withdraw `assets/perasure-logo.svg` (its navy tile recoloured #102950 → #000128) → original.
- Icon stand-ins in components → the root's choice: Field (floating) clear = `art/clear.svg` 20 (the root's picture; was `close-circle-filled` 20); FormField clear = `icons/clear-small` 16, neutral-950 at 60 % through CSS (the root's; was `close-circle-filled`).

Kept (exceptions): `lottie/loading-dots.json` and `animations/coins-loading/*` (decision 12 recolours), the Credit limit increase copy (decision 12), the back glyph `chevron-left` (already the legacy file, identical to the root; BRIEF 26 — the date picker ‹ uses it instead of a mirrored chevron-right). Rotations that the root demo already has stay (Accordion / DocCard / PermissionCard chevron turns, the ID camera's turned close). No Filled twins yet (BRIEF 22: none logged by figma-lib). UploadTile pictures, laurels, empty-state art, coupon art and scam art were already the root's files (no differences).
- PNGs re-exported: ScheduleItem, Field, TrustCard. Now `diff -r` root ↔ rebrand assets differs only in `lottie/loading-dots.json`.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · figma-lib 19: Filled icons (BRIEF 22) + parity checks

- **Filled icons exported** (Figma OBsvf42AiRapcRrasD7KNm, `download_assets`, SVG; the vector layer of each, not redrawn) into `shared/ps-ui/assets/icons`: `camera-filled` 11238:4570, `smartphone-filled` 4584, `app-filled` 4595, `location-filled` 4610, `notification-filled` 4615, `message-filled` 4620, `heart-filled` 4632, `wallet-filled` 4637, `info-circle-filled` 4648, `support-chat-filled` 4663. The node's own SVG export carried the page section behind it (a 38 px frame with the canvas paths), so the files are the vector layer in a 36 frame **centred on the glyph** (viewBox noted in each file). Note for figma-lib: in the symbols the vector sits at (−1.5, −1.5) inside the 36 frame, i.e. top-left, not centred (e.g. Camera 31 × 24.7) — please check; re-export by the same ids when fixed.
- Wired: `PS.FILLED` maps camera, smartphone, app, location, notification, message, heart, wallet, info, support-chat → their twins, so every `PS.RowIcon` row shows the Filled icon at 24, Content/Brand, 12 to the label: PermissionCard (both states; Camera, Device information = Smartphone, App list = App, Location, Notification, SMS = Message), the "A friendly reminder" row (Heart), CreditLimitCard / Account wallet row (Wallet), Strip / Notice (Info circle, Support chat). OrderStatus keeps History / Alert circle (no Filled twin listed). ActivityItem tiles kept (BRIEF 28). Check / Close circle Filled were already in the set.
- **Parity with entry 19:**
  - Bank forms: the withdrawal-method page uses `PS.Field` (Bank name picker + account / mobile number) ✓.
  - Marital status: the demo opens a popover (owner rule: application lists are popovers, DS 7201:12032); Figma now uses SelectBar / ListItem → stays a popover unless the owner changes that rule.
  - OTP consent: `PS.Consent`, the 16 px round check = Check Small ✓.
  - Inbox filter: was `PS.Tabs` split (36 tall, navy pill) → now two **Chip Medium** (41, 156 wide, 16 apart, "Unread (3)" / "Read"); header extra 61, list 20 below the chips (measured: chips y 76, first card 137 in the frame under the status strip). Note: Credit history's two tabs are also chips in Figma (Chip Small 160) and the demo still draws them with `PS.Tabs` split (same size, navy selected) — say if they should become Chip Small too.
  - ResultBadge / UploadTile marks use the root files `check-circle-filled` / `close-circle-filled` (BRIEF 32) ✓; InboxItem uses the root `inbox` icon ✓.
  - Chevrons: `chevron-right.svg` (the line chevron) and `chevron-left.svg` (nav/chevron-left) are byte-identical to the root files ✓; up / down = the same line chevron turned (as the root).
- PNGs re-exported: PermissionCard, CreditLimitCard, Strip, Notice, Accordion.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · BRIEF 33 — Body/sm (12/16 400) and Body/xs (11/14 400)

Every `ps-text-caption-sm / -xs` in the rebrand components and app pages was sorted by role (TYPE-GAPS §3 A / B): prose (hints, helper sentences, card bodies) and legal / consent copy move; meta labels stay Caption 500 (tabs, timestamps, dates, statuses, field / KV labels, "Due date", "Total payment", legends, counts, file states, place subs, coupon rules, tile labels); the file name stays Label/sm.
- **→ Body/sm**: ProtectionCard blurb; OtpForm "Didn't receive the code? …"; AmountEntry "Choose a loan term to continue"; customer service hours (support page); FileList label "Support documents (optional)" (`.ps-files__label`, regular weight on the field-label style); Field hint; StateCard body (the 80 % opacity rule follows the class); PermissionCard body; Accordion small body ("A friendly reminder" text); Tips bodies (how to improve your limit); hub empty panel body; OrderStatus body; PaymentCard notice body (penalty / pay-now text); PenaltyInfo rule texts; ScamStrip line; ScamTips bodies; PayTimer sentence; StatusBox and Notice text; Decision body; RegCard body (no picture); banner bodies; review texts; camera / selfie hints and "camera isn't available" lines; IdSide hint; the QR "Refresh the page…" note; the wheel-failed line.
- **→ Body/xs**: `PS.Consent` text ("By typing confirm indicates…", the permission page consent); BottomBar note ("Tap Agree to allow permission data…"); Legal lines (home footer); PenaltyInfo footnote; FileNote ("Supports JPG, JPEG, PNG and PDF"); FileAdd hint; EstimateCard note; RegCard body with a picture; SEC disclaimer (About); "You can cancel your loan within 24 hours…" (order).
- Note: the brief lists "the BottomBar consent line" under Body/sm and "By typing confirm indicates…" under Body/xs; in the demo both are the same `PS.Consent` (11 px) inside the BottomBar, so it is Body/xs — say if it should be Body/sm (12).
- PNGs re-exported: ProtectionCard, StateCard, PermissionCard, Accordion, PenaltyInfo, ScamStrip, ScamTips, BottomBar, Legal, Notice, OtpStatus, AmountEntry, Field, OfferCard, TrustCard, PaymentCard. Sizes unchanged (same 12/16 and 11/14 boxes; ProtectionCard 180, StateCard 192 / 160 / 150 / 92 / 214).
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · Pages: Onboarding, Short link, inbox-a, Change bank card (figma-lib 16–18)

Compared headless at 360 against each legacy frame (`parity/demo/pages/<Name>.png`: legacy | demo | difference; captured with the page tool in the scratchpad, `JOBS=jobs2`).

| Legacy frame | New frame | Demo page | Result |
|---|---|---|---|
| 6069:13382 Home/Onboarding | 11187:15613 | `?page=home&user=guest` | fixed: hero top 97 → 89 (amount box 37, legacy 16 · 20 · 37 · 16), everything below moved up 8; reviews now one 24 avatar each (the original sprite stepped one head, was 28 showing two halves). Kept: the trust card's partner-logo marquee inside the card (legacy: a static row under it), the NPC logo size (same as the root). |
| 6123:12540 "What customers say" | 11187:16092 | home (guest) | stars are the new `PS.RatingStar`; card sizes = legacy. |
| 6078:13330 rating row · 8289:30907 | 11187:16168 · 16177 | — (fragments) | RatingStar row in the gallery. |
| 7792:14577 短链 (repayment list) | 11189:15909 | **new** `?page=shortlink` | new screen (screens-pay.js): brand header + support, InstallmentCards grouped by due date (Overdue tag red: new `badgeTone`; the check toggles, the row opens the detail), PayBar in a dock with no tab bar under it (new `PS.PayDock{alone}`, 80 tall as legacy). Layout = legacy; data = the app's numbers. |
| 7869:20659 短链兜底 link expired | 11189:16336 | `?page=shortlink&link=expired` | EmptyState + "Get a loan" (Button md, 264 × 44 as legacy); placement per BRIEF 20 (2 : 3), so 28 lower than legacy. |
| 7981:12477 短链兜底 no payment due | 11189:16480 | `&link=nodue` (also when there are no dues) | same. |
| 7986:12576 短链兜底 all set | 11189:16623 | `&link=done` | same. |
| 7792:15391 还款方式 repayment methods | 11189:16766 | `paymethods` sheet | matches; the list starts 12 lower (BRIEF 19 header gap). |
| 7792:14712 详细弹窗 detail sheet | 11189:17580 | `paydetail` sheet | fixed: rows on the legacy 49 pitch (24 lines 12 apart, card padding 16; `.ps-sheet--inset .ps-details`). Kept: legacy's "PAYMENT DETAIL" label under the title (it repeats the title). |
| 8128:26487 Inbox · Unread | 11200:16449 | `?page=inbox` | filter chips: legacy draws them 36 tall → **Chip Small** (36; last round's Chip Medium 41 reverted), cards on the legacy pitch. Unselected chip keeps the Chip Small ring (legacy: none). |
| 8181:29653 Inbox · Read | 11200:16755 | `&inbox=read` + tap Read | matches. |
| 8128:26997 Inbox · Empty | 11200:17043 | `&inbox=empty` | BRIEF 20 placement. |
| 8181:30112 Inbox · Detail | 11200:17133 | `message` | matches (the sample message has no button; legacy "Go to borrow" shows on messages with a cta). |
| 8181:30145 All caught up · 8181:30227 No read message | 11200:17230 · 17331 | inbox (read / Read tab) | BRIEF 20 placement; chips as above. |
| 9351:20344 Account (inbox badge) | 11200:17432 | `?page=account` | matches (menu badge 18 from the earlier fix). |
| 8381:14003 拍照 Camera (change card) | 11203:17058 | `face` | fixed `PS.FaceCamera` to legacy: black ground (raw #000 as legacy / figma-lib), oval 286 × 366 48 under the header, hint 28 under it, shutter centre 127 above the bottom. |
| 8381:14019 拍照上传 Photo confirm | 11203:17105 | `face` after the shot | fixed: Take again / Next 158 + 12 + 158, 32 above the bottom (`.ps-face__bot.is-shot`). Take again = white 20 % (figma-lib's on-dark rule), Next white with navy text. |

- New / changed components: `PS.RatingStar` (gallery 'RatingStar': Default, Row of five), `PS.InstallmentCard{badgeTone, onToggle}` (gallery 'Overdue (short link)'), `PS.PayDock{alone}`, `PS.FaceCamera` geometry, the hero amount box, the review avatar. PNGs: RatingStar, InstallmentCard, PayBar.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · Pages: FAQs and Loan history (figma-lib 21)

Compared headless at 360 (`parity/demo/pages/<Name>.png`, `JOBS=jobs3`).

| Legacy frame | New frame | Demo page | Result |
|---|---|---|---|
| 5453:4978 FAQs / Index | 11257:46534 | `?page=faqs` | fixed: topic rows = LinkRow Kind=Link in Body/lg on the 22 line, Content/Link (figma-lib's FAQ map); rows on the legacy 54 pitch. Search pill 44 vs legacy 40 (the Search component; kept). |
| 5453:5042 FAQs / Search active | 11257:46622 | faqs + type | rows Body/lg regular (tall rows lost their 500), the typed part Content/Accent/Strong (BRIEF 31); the demo's longer article titles wrap to two lines. |
| 5453:4937 FAQs / Sub | 11257:46357 | `faq-topic` | matches (tall rows). |
| 5453:4947 FAQs / Detail | 11257:46414 | `faq` | fixed: the feedback block and the related list sit 8 in like the article (lines 24 … 352); related titles Body/lg on a 22 line (46 apart). Article copy is the demo's (tone of voice). |
| 6149:12701 · 6150:12923 · 6150:12975 Detail / Form 1–3 | 11257:46501 · 46704 · 46470 | faq + Yes / No / another article | Yes / No chips 72 × 44 = legacy; "Thanks for letting us know" after a vote. |
| 5810:15501 Loan history / Index | 11259:17666 | `?page=history` | rows are the new `PS.LoanHistoryItem` (328 × 56); "Under review" tag now Navy Subtle (was neutral), Disbursing Accent Strong, Not approved / Paid off Neutral Subtle, Action needed Navy Strong (legacy State tag map). |
| 6220:13234 Index empty | 11259:17904 | `&user=new` | BRIEF 20 placement. |
| 5813:15815 Loan confirmation | 11259:18030 | `loan-record` | matches (details, plan rows, link rows, cancel note). |
| 6217:22210 Cancel my loan | 11259:18218 | `cancel` | matches the radio rows (52), the reason box and counter; the "need to know" card is shorter (Hanken sets the bullets in fewer lines). |
| 7989:12776 Loan contract | 11259:18404 | `doc` | the document page (image). |

- **`PS.LoanHistoryItem`** (list.js; spec 11259:22291): `kind: 'state'` (the state tag) or `'history'` (the term tag, Small Navy Subtle), amount, chevron; `PS.HistoryRow` now calls it. Gallery 'LoanHistoryItem' (Kind=History, Kind=State · Reviewing, then Disbursing / Not approved / Action needed / Paid off); `parity/demo/LoanHistoryItem.png` (328 × 56 each). Amount keeps the app's amount weight (black) — spec says Title/sm 700; say if it should drop to 700.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · BRIEF 34 / 35 / 36

- **BRIEF 34 — `PS.Button{variant:'plain'}`**: `--surface-default` fill, no border, `--content-primary` label; pressed `--bg-neutral`; disabled as every button. Account "Log out" uses it (was the outlined inverse). Other lone secondaries keep the outline. Gallery: Button 'Plain (Log out)', 'Plain · pressed'.
- **BRIEF 35 — Tooltip light = glass**: bubble and arrow `--surface-glass` (white 80 %) with the glass buttons' backdrop blur (`--blur-glass-nav-effect-focus`) and Elevation/3 as a box-shadow; the tone's drop-shadow filter is removed, because a filter on the parent stops the blur from seeing the card behind. Text and icon stay primary; the dark tone is unchanged. Gallery: Tooltip 'Light · glass over the hub card' (the blur over the card's number and glow).
- **BRIEF 36 — scale-safe inner parts**: `.ps-radio` now sizes everything from one `--s` (ring 9.4 %, dot radius 31.4 % — 1.5 / 5 at 16), so the 14 px radio in ReasonRow / ReasonList keeps the 16 px proportions (before: ring fixed 1.5 px at 14, dot set separately per size). Audit of the rest: icons and ResultBadge / VerifiedBadge are masks or images (they scale as a whole); `PS.Check` medium 20 / small 16 keep their designed tick (12 / 10) and rings (2 / 1.5), the same ratio; the consent check (16, tick 8), selfie-tip marks (16, tick 8), UploadTile mark (20) and the date cell disc are drawn only at their own size. Nothing else drawn at a non-default size.
- PNGs re-exported: Button, Tooltip, Radio, ReasonRow.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · BRIEF 37 — pop-up close = legacy Close (checked, already so)

- Every pop-up close in the demo is `PS.Close`: a 40 × 40 glass button (`PS.Glass`, white 80 % glass) with the root demo's `icons/close.svg` (byte-identical to the root file) drawn at exactly 14 × 14, centred (13 / 13 inset) — measured in the stage on the plain / card / page sheets. Same component in: SheetTitle and SheetHead (plain / card sheets, Confirm dialogs: log out, delete), SearchSheet (city, banks, payment methods), the coupon picker head, Decision sheets, the OTP sheet. The date picker has no close (back + check glass buttons), popovers have none (tap the scrim), so nothing else to change.
- Compared with the legacy glyph in Figma: legacy Close 5911:9618 ("in use popover") = 40 glass with `Cancel-Thick` in a 14 clip, its X 11.08 × 11.07 centred; the root `close.svg` draws its X 10.9 × 10.9 (round-capped 2.4 strokes) in the same 14 box — the same size within 0.2 px. No file swapped (BRIEF 32: the root icon file stays). If the owner saw a different size, it is likely Figma's v2 `Icon / Close` (figma-lib: now instanced from the legacy icon).
- Non-pop-up ×: Field / Search clear (legacy clear pictures), FileRow stop (close-thin 16), Toast and Tooltip × (close-thin 16) — left as they are.
- No component changed, so no PNG re-export was needed.
- Progress: **done** — waiting for review. Nothing committed.

## 2026-11-20 · Pages: figma-lib 22 (miniapp loading, download landing, fallback, phone change, rating, order state) — stopped at the usage limit

| Legacy frame | New frame | Demo page | Result |
|---|---|---|---|
| 8387:14080 Miniapp loading | 11263:17953 | **new** `?page=miniapp` (`PS.MiniappLoading`) | lockup (34 tile + Title/lg navy) centred, dots 84 above the bottom = legacy |
| 8389:14148 App download landing | 11263:17985 | **new** `?page=download` | `PS.AppPreview` (guest home at 73 % in a phone outline, 276 × 570 from under the status bar) + `PS.TrustBadge{raised}` (split out of TrustCard, which now uses it) + Open PeraSure / Get it on Google Play; the preview has no mini tab bar yet; badge 17 shorter (laurels) |
| 8414:22315 Global fallback | 11263:18592 | a page that fails (`&net=error`, e.g. payment) | Cover + Fallback + tab bar = legacy; BRIEF 20 placement (38 higher); Home has no load, so its own fallback can't be shown |
| 8833:31439 · 8655:27420 Old / new number | 11263:18880 · 18772 | `phone-old` / `phone-new` | match (PhoneField) |
| 8655:27434 OTP | 11263:18984 | `otp` (change flow) | fixed: header title "PeraSure account" in the change flow |
| 8833:31280 · 8667:28313 · 8667:28329 Selfie / camera / confirm | 11263:19542 · 19402 · 19462 | `phone-selfie`, `face` | camera = last round's legacy fix |
| 9336:17995 · 9337:18620 · 9337:19180 Rating | 11263:19752 · 20277 · 20755 | `rating` sheet | ask state 24 taller: the three steps share one height (the tallest), so the sheet never jumps — kept; legacy home behind uses the retired card (figma-lib question) |
| 6104:11747 · 6572:21617 Order state | 11263:21266 · 21373 | `order` (review / `&loan=failed`) | match with the new **`PS.LoanStateCard`** |
| 6619:21945 · 9345:19818 History / Full states | 11263:21504 · 21612 | `history`, home | match (Full states: the demo's live card) |

- **`PS.LoanStateCard`** (loan.js; Figma 11263:25900): states reviewing / declined / method / disbursed with the legacy copy (tone of voice); `PS.OrderStatus` calls it. The **state-coloured tile is back** (navy / red / green, like ActivityItem's, as Figma keeps it) — a reversal of BRIEF 22 for this card only: coordinator to confirm. Gallery 'LoanStateCard' (4 states); PNGs: LoanStateCard, TrustCard.
- Not done (usage limit): the rating "positive / negative" and phone-change comparison images were captured but not reviewed one by one; no mini tab bar in the AppPreview.
- Progress: **stopped at the usage limit**, nothing committed.

## 2026-11-20 · Pages: figma-lib 22, continued after the limit reset — every frame reviewed
Picked up from the entry above; nothing logged there as done was redone. Re-captured: App-download-landing, Phone-change-camera, Phone-change-camera-confirm, Rating-feedback-positive, Rating-popover-negative, Order-state-full-states (`parity/demo/pages/`).

| Legacy | Figma | Demo | Result |
|---|---|---|---|
| 9337:18620 · 9337:19180 Rating positive / negative | 11263:20277 · 20755 | `rating` sheet | **fixed**: legacy has no heading beside the close button in these steps; the demo showed "Thank you for your feedback!" there (`RATE.good / bad` in account.js lose `head`). Positive step: legacy is shorter (shared height kept, as logged) |
| 8833:31439 · 8655:27420 Old / new number | 11263:18880 · 18772 | `phone-old` / `phone-new` | match (PhoneField). Legacy button says "Update" and is on while the field is empty (a static mock); the demo keeps Next / Send code, off until the number is valid |
| 8833:31280 Selfie | 11263:19542 | `phone-selfie` | match (instructions card +4, with its ⋯ button) |
| 8667:28313 Camera | 11263:19402 | `face` | **fixed**: the shutter sat 48 too high. Legacy frames are 749 tall, with the 60 shutter at y 641 and 48 under it (centre 78 up); last round's "127 above the bottom" was wrong. `.ps-face__bot` bottom 2.875rem. This also fixes 8381:14003 (change card), which has the same geometry |
| 8667:28329 Camera confirm | 11263:19462 | `face` after the shutter | **fixed**: Take again / Next were 150 / 166 (the shade button's padding counted in its flex share). Now no side padding, so the halves are equal: 158 + 12 + 158 = legacy |
| 8389:14148 App download landing | 11263:17985 | `download` | **fixed**: the mini tab bar is now in the preview. `PS.AppPreview{tabs}` puts the app's `PS.Navigator` (Home on, its own pill id) at the preview's foot at the same 73 % = legacy |
| 6619:21945 Loan history | 11263:21504 | `history` | legacy (older frame) has no date groups. The demo keeps the LoanHistoryItem list from the FAQs / history round |
| 9345:19818 Full states | 11263:21612 | `home&loan=reviewing` | match: "You have updates on your loan" strip under the credit card, count 1 (raised). Capture switched to `loan=reviewing` so the strip shows. Icon without tile = BRIEF 22. Legacy also has a Next payment card (two loans at once), which isn't a demo state |

- Files: `shared/ps-ui/account.js` (RATE), `shared/ps-ui/home.js` (AppPreview tabs), `shared/ps-ui/ps-ui.css` (`.ps-face__bot`, `.ps-face__acts > .ps-btn`, `.ps-preview__tabs`), `prototypes/app/screens-auth.js` (download passes the tabs). No component spec PNGs changed (FaceCamera / AppPreview have no gallery entries).
- Open for the coordinator: the LoanStateCard tile (reversal of BRIEF 22, from the entry above); the legacy home behind the rating sheet uses the retired card (figma-lib question).
- Progress: figma-lib 22 round **done**, nothing committed.

## 2026-11-20 · BRIEF 38 urgent orange + coupon centre pages (figma-lib 24)
Coordinator answers on the last round: LoanStateCard keeps its coloured tile (BRIEF 39 note). The rating sheet already sits over the demo's current home: the retired card only appears in the legacy / Figma frame, so the demo has nothing to change.

**BRIEF 38**: `--ps-countdown` → `var(--content-urgent)` (orange-700 #B83F00), `--ps-expire-strip` → `var(--palette-orange-50)` (legacy #FFF4EE). That covers every countdown: CouponTicket's "Expires in …" and clock (coupon centre), CouponOption's strip (picker) and the gallery Countdown. No raw orange left in ps-ui. PNGs: CouponTicket, CouponOption (new file).

**Bug found**: the coupon lists (centre and picker) used the class `.ps-list`, which PS.List also uses (the white group card, a later rule). So the tickets sat in one white panel with no gaps or ticket shapes. They now use `.ps-tickets`: tickets are 116 tall, 16 apart, as legacy.

Pages (`parity/demo/pages/Coupon-*.png`, job module `jobs5`, PFX 11273; legacy 1-x frames vs demo):

| Legacy | Figma | Demo | Result |
|---|---|---|---|
| 10628:47774 · 10648:48762 · 10648:49017 To use / Used / Expired | 11273:23987 · 24671 · 24932 | `coupons` (+ tabs) | **fixed** (`.ps-tickets`): match. Segmented tabs = legacy (Figma's chip tabs are figma-lib's kit). Use button = legacy outline 60 × 28 (Figma: Secondary Small 40 tall, which differs from legacy; phase 1 keeps legacy). Label in Content/Brand (navy) as in Figma |
| 10648:49319 To use + tooltip | 11273:24336 | `coupons`, tap the ⓘ | demo: dark tooltip anchored to the ⓘ, with its arrow. Per BRIEF 21 a tooltip on a light background is dark. Figma copied legacy's white tooltip (no arrow, under the rule line), which doesn't follow that rule: **figma-lib to check** |
| 10594:45374 Coupons / Empty state | 11273:23882 | `coupons&coupons=0` | BRIEF 20: the demo's block is 16 below Figma's. The demo's container starts after the column's 16 top padding, and the demo body is one line (block 147; Figma counts 168). Copy per tone of voice ("No coupons yet", legacy's "loan records" line was wrong). Title "Coupons" shown (Figma hides it as legacy) |
| 10836:28988 Coupon discount (picker) | 11273:30212 | loan page → `picker` | **fixed** pay card: 166 → **174** = legacy (2 between label and amount, chips as 26 pills, 16 above Confirm). Options 98 / 66 = legacy. Intro 4 lower (BRIEF 19: 12 under the sheet header, legacy 8). Card 24 above the bottom (legacy 28: its sheet stops 4 short of the frame). **Open:** Figma uses CouponTicket Pick / Selected (navy bar) for the options; legacy and the demo use the bordered card with the countdown strip (PS.CouponOption, owner rule on the strip) |
| 10661:53764 Loan application / Empty state | 11273:28567 | picker, `coupons=0`, Limit increase | demo keeps the intro and Your loan row above the empty block (legacy drops them); counts hidden when there are no coupons |
| 10722:58508 Repayment plan | 11273:30585 | loan page → `plan` | legacy frame is the sheet alone, so it can't be overlaid. It belongs to the Loan detail rebuild (item 3) |
| 10730:58631 · 10747:59920 Full states 2coupon / 1coupon | 11273:28719 · 29417 | home (`coupons=1`) | match (HomeCoupons from earlier rounds; the 1-coupon card is 12 shorter because the demo's condition fits one line) |
| 10750:63340 "Login / Default" (= Account tab) | 11273:25193 | Account tab | match ("6 coupons" tag on Coupons) |

- **Twins**: `PS.CouponPayCard` = PS.Summary (Figma 11273:4945); gallery entry renamed `Summary` → **CouponPayCard** (3 states), PNG exported. Figma's **CouponOption** (11273:4944) is the loan page's coupon row with art + radio = the demo's `PS.CouponRow`. But the demo's `PS.CouponOption` is the picker card, which Figma maps to CouponTicket Pick. So the names cross: I'm leaving the rename until figma-lib's Loan detail rebuild (item 3) is logged, and **coordinator to decide** which picker look stays.
- Item 3 (Loan detail 1–6 with the current amount entry / order pieces): waiting for figma-lib's frames.
- Files: `shared/ps-ui/ps-ui.css` (countdown tokens, `.ps-tickets`, `.ps-summary*`), `shared/ps-ui/coupon.js` (`.ps-tickets`, CouponPayCard), `prototypes/app/screens-loan.js` (`.ps-tickets`), `shared/gallery.js` (CouponPayCard). PNGs: CouponPayCard, CouponTicket, CouponOption.
- Progress: done except item 3, nothing committed.

## 2026-11-20 · BRIEF 39 OrderAmountCard — waiting for the spec
- Coordinator heads-up: figma-lib builds `OrderAmountCard` (the order page's top card from `withdraw.js` loanScreen, confirm phase); the demo adds the `PS.OrderAmountCard` twin + gallery entry **once `spec/OrderAmountCard.md` exists**. It doesn't yet (figma-lib entry 25: nothing built, question open).
- Checked `prototypes/withdraw-fund-flow/withdraw.js`: the confirm phase **does show the slider**. `mpSlider()` fades it in over morph progress 0.30–0.88, so it's fully visible at confirm, and `mpRange()` puts the range row at 42 tall. This agrees with figma-lib's correction. A card "without slider" would not be identical to the Withdraw demo, which the demo hosts unchanged. So the slider question (figma-lib's a / b / c) has to be settled before the twin can both match the spec and stay identical to withdraw.js.
- Demo places still on the retired slider card, to switch once the spec lands: `?page=loan` (screens-loan.js, the loan page opened from a coupon's Use: coupon Loan detail 1–6) and `PS.LoanApply` (apply.js: New user loan / Home Loan detail). The Withdraw sheet itself is withdraw.js (unchanged).
- Nothing changed in code, nothing committed.

## 2026-11-20 · BRIEF 39 answer (slider card stays) + coupon Loan detail 1–6 + button font fix
- **Coordinator: the owner keeps the slider card.** `OrderAmountCard` = the Withdraw demo's order card as it is (amount + edit, slider ₱500–₱50,000, term chips). The "two demo places to switch" (`?page=loan`, `PS.LoanApply`) **stay on the slider card**, so no code change there. The `PS.OrderAmountCard` gallery entry (the demo's own card in the spec's states, hosted or reused from withdraw.js, plus a parity PNG) waits for `spec/OrderAmountCard.md`, which **doesn't exist yet** (figma-lib entry 25 still in progress).
- **Coupon item 3, Loan detail 1–6** (the legacy frames already use the slider card, so they compare as is). Jobs in `jobs5`: `openLoan`, then set the coupons; for 3–6, `APP.loanCheck` to ₱5,000, which takes them off.

| Legacy | Demo state | Result |
|---|---|---|
| 10648:49958 Loan detail (no coupon) | `L` disc / lim null | **fixed**: coupon section 4 low. Its header row was 20 (the "See all 6" link's line box); legacy 10648:50001 keeps the row 16. Now `.ps-section__head > .ps-link { margin: -0.125rem 0 }`, and every section below is back on legacy. Slider thumb at the track end (₱45,000 of ₱45,000). Legacy's thumb sits at 88 %, copied from the 50,000 frame |
| 10656:51873 Loan detail 2 (both on) | d20 + l5 | match after the fix (range end "₱50,000" with the coupon mark, Discount row, ticked rows). Figures are the demo's data |
| 10712:55111 · 55543 · 55892 Keep 50% / ₱5,000 off / limit | d20 · a300 · l5, then ₱5,000 | Decision sheet matches in width, art, facts and buttons. The demo body has one more sentence ("Keep it and we'll set your loan to ₱6,000."), so the sheet is 16 taller. The card behind shows the new amount (legacy keeps ₱45,000) |
| 10893:29050 Loan detail 6 (two coupons, dots) | d20 + l5, then ₱5,000 | match (pager dots). The demo shows the discount first, then the limit (legacy starts on the limit) |

- **Bug found, every spec button**: the reset `button { font: inherit; … }` (0,0,1) beat the Button base `:where(.ps-btn)` (0,0,0). So since the Button phase-1 change, Primary / Secondary / Neutral / Plain / Text / Destructive labels rendered in the body font at **weight 400**, not Label/md semibold (Confirm, Keep coupon, Don't use coupon, Pay now …). Legacy variants (outline Use, shade, cta …) were fine because they set their own font. Fix: the reset is now `:where(button)`, so the later spec rule wins. Checked on all 17 coupon-centre pages (no layout change apart from the bolder labels). PNGs re-exported: Button, Decision. Other component PNGs that contain spec buttons pick it up on their next export.
- Files: `shared/ps-ui/ps-ui.css` (reset `:where(button)`, section-head link margin). PNGs: `parity/demo/pages/Coupon-*.png` (all 17), `parity/demo/Button.png`, `Decision.png`.
- Coupon round: all items compared. Open: picker look and CouponOption naming (coordinator), tooltip tone in figma-lib's frame (BRIEF 21). Nothing committed.

## 2026-11-20 · ⚠️ Look parity: root demo vs rebrand demo (IN PROGRESS)
BRIEF "⚠️ Look parity": only colours change, and every element keeps the root demo's position and size (±0.5 px). Allowed: colour, owner decisions (2, 3, 8, 10, 12–16, 18–22, 24–31, 33–39), Hanken glyph shapes (text boxes keep their positions) and the normalisations in `figma/NORMALISATIONS.md` (not there yet; `figma/LOOK-AUDIT.md` not there yet either).

Method: the same URL / gallery state in both demos (root `prototypes/app`, `shared/stage.html` | rebrand), 360 × 800, Android UA. Each capture is root | rebrand | difference, plus an **element geometry diff**: every visible text box, picture and filled / bordered / shadowed box is matched by text or class and occurrence. Reported: x / y / w / h off by > 0.5 (text: x by its nearest edge or centre, so Hanken glyph widths don't count), font size / weight / case / line height, and shape (border width, inset ring, radius, fill yes / no, shadow yes / no).
- Components: 213 root gallery states paired with the same-named rebrand states (legacy groups; entries moved to the spec group matched by state name).
- Pages: 48 states (home ×12 Tune states, Payment / Account tabs, 31 pages, loan page, coupons Used).

**How a difference is judged.** The root demo is the legacy look, but it isn't always pixel-equal to the legacy Figma frames, and earlier rounds fitted several rebrand pieces to those frames. So each difference from root is checked against the log and, where needed, against the legacy frame:
- **fixed**: the rebrand drifted (spec values, a reshaped part) → back to root.
- **R≠L**: root differs from the legacy frame and the rebrand already equals the frame → kept (e.g. HubCard 138 = legacy 10926:30008, root 146; Navigator bar 54 = legacy 3152:1404, root 56; hero 89 = legacy 6069:13382; review avatar 24 = legacy 6123:12540; SelectBar 46 = legacy Select bar 5762:11160, root 48; menu badge 18).
- **decision N**: an owner decision (e.g. amounts 800 = the v2 weights approved with decision 33; dark tooltip = 6; Sheet Over shadow = 19; side-by-side grey secondary = 24; no light blue tints = 3).
- **font**: Hanken glyph widths and line breaks (decision 10). Text boxes keep their position.

### Component fixes (round 1)
| Component | Root (legacy look) | Rebrand before | Fix |
|---|---|---|---|
| CouponTicket | side notches (radial mask) | plain rectangle (earlier coordinator call) | **notches back** (root mask, the same 0.725 / 0.7625 rem circles) |
| HomeCoupons (pair) | 16 top, inner 8; title → value 64 (legacy 63) | spec 24 top, inner 16 · 8 → value 16 lower (80) | spec override removed → root geometry |
| Tag | one geometry per tone: outline 26 (1 px border), soft / negative 22 (11/14 600), best 24 r12, solid 20 pill (12/16), positive 18 pill (11/14 400) | one geometry for all (24, radius 8; Best as Small 22) | `legacy` geometry class: automatic for old tones, `legacy:` prop on the two call sites that moved to new tones (PaymentCard badge = soft / negative, method picker tag = positive); colours stay the tone × emphasis. The legacy-fitted context rules (menu badge 18, picker Best, history tag, pay-card chips) still win |
| Tooltip | no arrow, 1 px border (66 for two lines) | arrow (spec), 64 | arrow hidden, + 1 px padding; dark = decision 6 |
| Captions | `ps-t-caption-sm / xs` are **400** (87 uses; root has no 500 caption) | 60 uses on Caption/sm · xs **500** | all → `ps-text-body-sm / xs` (decision 33 restores the legacy 400 caption as Body/sm · xs); Field label, form label, form error → 400; credit card label → 600 (root) |
| CreditLimitCard | 28 tile slot → card 130 | decision 22 (24 icon, no tile) shrank the row → card 126, all rows below 4 higher | the 24 icon sits in the 28 slot (margin 2): card 130, title at x 72 |
| SelectBar | radio (legacy Select bar 5762:11160 = radio too), logo radius 4 | tick (PS.Check) and square logos | **radio back**, logo radius 4; height stays legacy 46 (R≠L) |
| Button labels | Label/md semibold | weight 400 (reset beat the spec rule) | fixed last round (`:where(button)`) |
| Caption merges | root `ps-t-section-xs` (11 / 600) and `ps-t-label-sm-light` (12 / 500) | the bulk switch above made them 400 | back to Caption/xs · Caption/sm 500 (approved merges, TYPE-AND-STYLES): CreditLimitCard "Total / Available credit", HomeCoupons kind label, legal first line "SULIT LENDING CORPORATION", coupon row sub line when on. DocCard file name stays Label/sm 600 (decision 33) |

### Findings not fixed yet (from the root | rebrand geometry diff)
- **Tag · Count · Chip**: root PS.Chip = the summary pill with icon (26, 12 / 600); the rebrand Chip is the term chip (41). The pay card already uses Tag + `.ps-summary__chiprow` (26 pill, legacy-fitted), so only the gallery shows the old pill. "Best" / "6 coupons" / "New" / "Recommend" radius and size are covered by the Tag legacy classes (to verify on the next capture).
- **Credit card (home)**: Withdraw is the green primary; root has the translucent shade button. Decision 7 (green primary) or decision 16 (bluish alpha fills on the navy card)? **Coordinator question.**
- **Scam strip (Payment tab)**: the rebrand copy is longer and gets cut off at 360 ("… customer service to …"); root fits one line.
- **Form labels**: root upper case; the rebrand is sentence case (earlier legacy-forms fix, R≠L to confirm against NORMALISATIONS / LOOK-AUDIT).
- **OtpForm error**: root plain 12 px line; the rebrand error is a 14 px filled banner (r16).
- **PlaceTab / LineTabs**: root text tabs with an underline bar; the rebrand chosen tab is a pill (decision 30 = colour only?), the bar is hidden.
- **Date picker** (47 position diffs), **SearchSheet / BankList** (~32), **PlacePicker** (15), **DocCard rows**, **Hero / Reviews / Offer** (14), **ProtectionCard · MethodCard** (12), **Profile** (11): not yet reviewed one by one.
- Home pages: the only page-wide shift was HomeCoupons (+22 on "More from PeraSure"), fixed above. Account tab: −4 from CreditLimitCard, fixed above. Hub, Docs, Navigator, loan-page coupon header: R≠L (kept).

### Stopped here (coordinator, 2026-11-20: "Figma first")
Paused on the coordinator's message: the demo follows Figma only after the owner approves it (LOOK-AUDIT.md, NORMALISATIONS.md, colour hierarchy fix). Where things stand:
- **Fixed in code** (not yet re-captured together): notches, HomeCoupons, Tag legacy geometry, Tooltip, caption weights + merges, CreditLimitCard slot, SelectBar radio + logo radius. The final re-capture was stopped part-way, so `parity/demo/look/` was **not** written yet.
- **Tooling** (scratchpad `look/`): `look.py` (root | rebrand | difference + element geometry diff), `capmany.mjs` (one Chrome per side, storage cleared per item: Tune keeps URL params in localStorage), `jc.py` (221 root gallery states, rendered with the root gallery definitions on the rebrand components through a scratch server on :8732 that serves `stage-root.html`), `jp.py` (48 page states), `cssdiff.py` (root vs rebrand ps-ui.css, non-colour properties only), `show.py` (per-page report).
- **Next, after the approved Figma lands**: align with LOOK-AUDIT / NORMALISATIONS, re-run all captures, write `parity/demo/look/`, review the remaining components above and then each page with a done column.
- Files touched this round: `shared/ps-ui/ps-ui.css`, `core.js` (Tag legacy class), `form.js` (SelectBar radio), `home.js`, `pay.js`, `account.js`, `coupon.js`, all `*.js` caption classes, `shared/gallery.js` (sample captions). Nothing committed.
- 2026-11-20 · **Stopped (owner, all demo work)**: no file half-edited. Paused after the look-parity round 1 entry above (fixes in code, not re-captured; parity/demo/look/ not written). No queued work started. Nothing committed.
