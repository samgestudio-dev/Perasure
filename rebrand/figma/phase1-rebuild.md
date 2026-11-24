# figma-lib · phase 1 rebuild plan (2026-11-19)

Owner phase rule (BRIEF top): every rebranded screen = its legacy Design-page frame, same structure / order / positions / sizes /
spacing / copy / states. Only colours (v2), bindings, library instances instead of legacy components or drawn shapes, names, Hanken
Grotesk (same sizes) change, plus the owner decisions in BRIEF. Legacy inconsistencies → `log/figma.md` "Phase 2 notes", not fixed.

Coordinator answers (2026-11-19):
- B: every piece with a `PS.*` demo twin is a library component (composed of library rows, demo props, legacy geometry, legacy ids
  in the spec). Build Keypad, ScamStrip, RepayCard, PayBar/PayDock, QrPanel, PayTimer, ScamTips, BankList, Accordion, OrderDetails,
  ProtectionCard, MethodCard; swap them into Home / Loan Detail; use them for User Order + Payment. End turn after User Order + Payment.
- Components replace legacy ones at legacy geometry; where library ≠ legacy, the legacy decides (fix component + spec):
  `parity/REPORT.md` rows "check legacy" (CreditCard insets/gaps, Navigator heights, PaymentCard gaps, StateCard icon alignment,
  CouponTicket notches, TopBar headset, Popover dividers, Field label case, PhoneField flag shape) and "Figma off" (Field floating
  58 → 56, Button 11/12 side padding, SelectBar 51 → 48). Report each with the legacy node id.
- The 5 components of round 08 (Slider, AmountCard, AmountEntry, SendingCard, OfferCard) + TextLink must match legacy geometry.

## Method
1. Translator (one use_figma per screen): walk the legacy frame, rebuild each node fresh (not clone) on Design - Rebranding inside the
   existing new frame (keep the frame id): frames with the same auto layout / sizes / positions; text with the v2 style of the same
   size + weight; colours legacy var → kebab → rename-map `new` → v2 variable whose WEB code syntax is `var(--new)`; icons = instances of
   the same Icon-page component (shared page, not legacy); images / vectors / illustrations cloned unchanged; legacy component instances →
   library instance (mapping table below) at the legacy x / y / size with the legacy texts.
2. Overlay check per frame: structural (texts matched by copy, dx / dy / dw) + PNG legacy | new | difference
   (`rebrand/parity/figma/screens/`, Swift script in the scratchpad).
3. Log rows legacy → new → demo; Phase 2 notes.

## Mapping legacy component → library (fill in as inspected)
| Legacy | Library | Notes |
|---|---|---|
| Status bar `3292:951` (remote kit, 360×40) | same remote instance (system mock) | not a legacy token component |
| Keyboard `3292:1737` (remote kit, 360×302) | same remote instance (system mock) | |
| Header Action Container `3416:1148` (Title 3418:1623 · Back 3422:2558 · Primary 3416:1149 · Secondary 3416:900, 360×116) | TopBar `11036:1355` | 116 incl. status bar? check |
| Navigator `3152:1405` (Home 3152:1404, 360×98) | Navigator `11037:1403` | REPORT: heights check legacy |
| Bottom Nav Action Container `3420:1820` (Default 3333:3079 · Variant3 3938:2048, 360×108); /Terms `3420:1821` 360×148 | new BottomBar (demo PS.BottomBar) | |
| Bottom nav btn `5762:11150` (3269:311, 296×44) | Button Large | legacy 44 tall |
| Home primary card `10926:30157` (Default 10926:30158 328×182 · With credit limit increase 10926:29644 328×196) | CreditCard `11042:1622` | width 328 |
| Home payment card `5998:19295` (5998:19294 328×149) · Home upcoming payment card `10545:40951` (10545:40950 328×246 · V2 10545:40952 · V3 10545:41016 328×262) | PaymentCard `11042:1695` | |
| Loan state `6619:21799` 328×58 | StateCard? / ListItem | inspect |
| remaining days `5610:6087` (5610:6068 89×22 · 5610:6088 100×22) · borrower protection pill `9124:24179` 74×24 | Tag `10988:272` | |
| order primary card `10926:29643` 328×246 | AmountCard `11064:2451` | |
| Term pick `8980:16878` (8980:16877 · 8980:16902, 99×41) | Chip `10989:185` | 41 tall |
| number typing `8933:31540` 99×52 (remote?) | Keypad (new) | |
| Phone number typing `3279:152` 328×56 | PhoneField `11018:830` | owner decision 13 |
| sms `3282:243` 48×60 | .OtpBox `11009:965` | |
| Contact method a `3422:2332` 82×74 | new? (OTP other ways) | |
| Resend btn `3292:2768` 178×36 | Button Small? | |
| Drop down `3259:963` 328×96 | Accordion (new) | |
| penalty `10532:34863` 296×60 | PaymentCard overdue notice | |
| Close `3081:1244` 40×40 | .GlassButton / close | |
| Popover btn `5911:9659` 312×44 | .PopoverOption `11039:1488` | |
| Loan detail popover `5985:12587` 296×146 | Popover Type=Content `11039:1543` | |

## Tooling (built 2026-11-19)
- **Kit** = JS stored in the Figma file: `figma.root.getSharedPluginData('perasure.rebrand','kit')` (~17.5 KB). Run:
  `const AF=Object.getPrototypeOf(async function(){}).constructor; const K=figma.root.getSharedPluginData('perasure.rebrand','kit');
   return await (new AF('figma','args',K))(figma,{jobs:[{legacy,target|section+x+y,name}], map:{legacyMainOrSetId:{to:newCompOrSetId,variants:{legacyVariantName:newVariantName},copy:true,after:'async(l,n,ctx)=>{}'}}, swaps:{legacyNodeId:{to,variant,after}}, handlers:'{id:async(l,parent,ctx,m)=>node}', rm:{legacyVarName:'v2-kebab'}, page})`
  - Rebuilds each legacy node fresh: frames (auto layout copied), text (legacy style → v2 style table, size+weight fallback), shapes
    cloned + paints remapped; legacy colour var → v2 via rename map + WEB code syntax; numbers → same-name v2 vars.
  - Instances: `swaps` (by legacy node id) → `map` (by legacy main / set id) → `handlers` → remote kit / Icon page / library
    instances recreated as is (+ overrides copied) → otherwise rebuilt as frames named "⚠ legacy: …" (reported in rep.unmapped).
  - A failed use_figma call rolls back plugin data too: re-apply patches in a call that succeeds.
- **Overlay**: `scratchpad/overlay` (Swift, compiled from overlay.swift): `overlay L.png N.png out.png` → legacy | new | edge diff
  (red only legacy, blue only new) + unmatched-edge %. PNGs in `rebrand/parity/figma/screens/<legacy>_<new>_<name>.png`.
- New components with no library twin: translate the legacy main component with the kit onto the library page (page 10982:15),
  createComponentFromNode / combineAsVariants, name per the demo twin, then `map` legacy id → new component (copy overrides).

## Component legacy-geometry fixes done
- Tag: radius 8 (Radius/xs) all; Small = p4/8, Caption/xs → 22 tall (legacy remaining days 5610:6068); Outline stroke inside,
  not in layout (legacy borrower protection pill 9124:24179 = 24).
- Chip: radius 16 (Radius/md), no check mark; Medium p8/16 Title/xs min 41 (legacy Term pick 8980:16877); Small p8/12 Label/md,
  36, strokes out of layout (legacy order-card term chip in 10926:29643).
- Button: new Size=Medium (15 variants) p12/12 min 44 (legacy card buttons, e.g. PaymentCard "Frame 5" in 10545:40950, offer 9497:29633).
- AmountCard: 328 wide, gap 16, term row = two texts (Term label / Term note), chips Small "3 Terms" → 328×245 (legacy 10926:29643 = 246).
- AmountEntry: 312 wide, no card, p32/0, number row ₱ +8+ (typed +2+ 1px caret +2+ 00) +4+ .00 → 312×184 (legacy 9426:18067 = 185).
- OfferCard: 328, gap 16, Body (gap 12) + Medium button, two-text row, Tag Small, "Max Amount" → 328×235 (legacy 9447:27224 = 234).
- SendingCard: matches legacy 3282:181 (292×212); title "Sending security code..." as legacy.
- Slider: matches legacy slider in 10926:29643 (track 8 @11, knob 18 @6); ends Label/sm 16 vs legacy 15 tall (1 px, Hanken).

## Progress
- Common map stored in the file: `getSharedPluginData('perasure.rebrand','map')` (JSON, legacy main/set id → library). Extra rename
  entries: `...('perasure.rebrand','rm')`. Current map: TopBar (3416:1148, after hides its status-bar content), PhoneField (3279:127),
  BottomBar (3420:1820 + /Terms 3420:1821 → Two buttons), PermissionCard (3259:962), ContactMethod (3422:2332), .OtpBox (3282:243:
  filled→Filled, Default→Active, Variant3→Empty), Resend btn (3292:2769 → Button Small Primary, 178 wide), consent tick 6126:13676 →
  Check Small On. Underlined text → TextLink (Tone by fill lightness). Remote kit (Status bar, Keyboard) cloned as is.
- New library components (translated from legacy): PermissionCard 11086:2666 (04 · Lists), BottomBar 11086:2672 (05 · Structure:
  Two buttons / One button / Variant2 / With terms), ContactMethod 11086:2675 (03 · Inputs). Specs + showcases + parity PNGs TODO.
- Library fixes for legacy: TopBar Brand right buttons Inbox + Headset (legacy Primary 3416:1149); TextLink padding 0 (legacy links
  are plain 20 px text) → 21 tall.
- Register rebuilt from legacy (frame ids kept): 11051:16 Opening 0 % · 11051:32 Permission 3.9 % · 11051:244 Login 16 % (PhoneField
  owner decision 64 vs 56 + body letter-spacing) · 11051:303 Sending 3 % · 11051:321 OTP 2 % (unmatched-edge %). Overlays saved.
- Phase 2 notes so far: legacy links use the brand colour, not a link token; legacy body styles have 2 % letter spacing (v2 0) so
  some lines wrap differently; legacy Term pick (41, stroke 1.5 in layout) vs in-card chip (36, stroke not in layout) inconsistent;
  legacy buttons 44 / 46 / 48 tall in different places; legacy tags 22 (fs11) and 24 (fs12) both radius 8; BottomBar Variant2 ≈ Variant3.
- Kit additions: persistent `handlers` (Bottom nav btn → Button stack, size by legacy height), `rm`, `raw` (raw hex → v2 by
  f/t prefix), `rules` (block swaps by node type + name regex + first-text regex + height → library component, copy overrides),
  grid layout copy (rows sized after children), value-checked number bindings, exact strokesIncludedInLayout, fixed text boxes kept.
- New / rebuilt library components (all translated from legacy, legacy ids in descriptions):
  Strip 11093:2760 (Loan state 6619:21799) · PaymentCard 11093:2765 (Upcoming 5998:19294, Due 10545:40950, Overdue 10545:40952,
  Overdue coupon 10545:41016, Next 10789:29251) · CreditCard 11093:2768 (Off 10926:30158, On 10926:29644, User home 9867:36981,
  User home compact 9867:37346; glow hidden) · StateCard 11098:2828 (Hold 9051:22812, Not approved 9078:23067, Expired 9078:23263,
  In progress 9081:23678, Documents 9560:32795) · Banners 11098:2917 · TrustCard 11098:2978 · Legal 11098:3049 · DotTitle 11098:3130 ·
  Notice 11098:3131 · PenaltyInfo 11098:3132 · .KeypadKey 11095:2796 + Keypad 11095:2874 (grid 9426:18088) · ScheduleItem 11095:2797
  (5985:12587) · PermissionCard 11086:2666 · BottomBar 11086:2672 · ContactMethod 11086:2675.
  Old sets renamed "_old …" (PaymentCard 11042:1695, CreditCard 11042:1622, StateCard 11043:1847): delete after all screens use the new.
- Navigator: tabs 46, bar stroke out of layout → 98 (legacy 3152:1404). Close → GlassButton Icon + Icon/Close. Popover btn → Button
  Medium Primary. Tags/Chips/Button Medium as above.
- TODO: specs + showcases + parity PNGs for every new component; Tooltip frame (legacy "Loan state" 10926:30327 in 9137:25806) → Tooltip;
  delete _old sets; then User Order + Payment (B-list components: ScamStrip, RepayCard, PayBar/PayDock, QrPanel, PayTimer, ScamTips,
  BankList, Accordion, OrderDetails, ProtectionCard, MethodCard).
- 2026-11-19 later: all 25 screens (Register, User home, Home) rebuilt from legacy with the kit; 0 unmapped, 0 raw, 0 missing vars.
  Overlays in parity/figma/screens (unmatched-edge %: Register 0–16, User home 1–8, Home 1–16; residue = Hanken metrics, owner decisions).
  More kit fixes: node-level text fills keep bindings; icon instances rescale (not resize); drawn pill → Button (size by height,
  variant by fill, 16 px label → Title/xs); frame→instance copy = label only; natural width for one-line texts in rows; TopBar hides
  Action when legacy Share is hidden (ancestor visibility); Tooltip rule sets Text + Leading icon + Close.
- Library: Button Size=Medium variants relinked to Label/icon properties (clones had lost them). .KeypadKey is a set
  (Key=Digit / Key=Delete) 11102:3057. PaymentCard / CreditCard / StateCard have NO shared TEXT props (variant texts differ; a shared
  prop overwrote them) — texts are instance overrides. .PaymentNotice 11100:11176 (penalty 10532:34863).
- Remaining: REPORT rows (CouponTicket notches, Popover dividers, Field label case, PhoneField flag, Field floating 56, SelectBar 48,
  Button showcase row 16→12), specs/showcases/parity for new components, delete _old sets, log + Phase 2 notes, User Order + Payment.
- 2026-11-19 end of turn: User Order (11109:5008) + Payment (11109:5009) rebuilt; B-list components built (log entry 10).
  Kit: rules support `has` (any visible text), TEXT rules, name-match child pairing (⚠ legacy frames ≈ instances),
  Logo pages as art. Component ids of this round in `getSharedPluginData('perasure.rebrand','ids2')`.
- 2026-11-20: eye review of all 50 overlays done, checker 50 / 50 (log entry 13). Kit / map / rules changes this round:
  sheetize keeps a legacy handle that sits inside a filled header (hides the panel's); rule "AmountCard (detached)" (Frame 1940699008 +
  "Disbursement amount"); MethodCard rule swaps in Payment logo / Maya when legacy has its bitmap; sms → .OtpBox picks Error from a
  Negative stroke; Search Bar Focus → State=Focus; Top nav btn → .GlassButton copies legacy opacity + size; style map
  Section-title/md-light → Title/xs. Library to legacy geometry: SelectBar logo 18 / Card min 46, Search 40, Field / Search / PhoneField
  text 14/20, PhoneField 56, Slider 42, AmountCard divider = 0-tall line, ScamTips titles Title/xs. Amount styles graded tracking.
- 2026-11-20 (entry 14): Account (11155:9694, 20) + Application Details (11163:11297, 35) rebuilt; 21 new components. Kit: copies
  legacy leadingTrim, opacity, text-style overrides inside instances (mapped to v2), keeps legacy box heights when Hanken sets fewer lines;
  handler Bottom nav btn: white fill / unfilled+stroke → Secondary. Maps: Field (Clear, label case, Stacked for the multi box, Empty/Error
  states, Calendar icon, placeholder-coloured value → Default), BottomBar second legacy button → Two buttons, GlassButton check mark,
  TopBar Gift, Toast / Navigator keep component fills, Popover btn Variant2 → Secondary, Chip / Toast text properties. Rename map +20.

## Entry 17 kit change · on-dark nav buttons
- `ondark` (shared plugin data): fill Palette/Alpha/White/20, strokes off, TEXT and VECTOR paints → Content/Inverse.
- Called when the legacy Top nav btn (map 3416:975, after-wrapper) or Bottom nav btn (handler 5762:11150, inner frame) has a white fill ≤ 25 %.
