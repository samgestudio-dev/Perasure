# figma-lib log

### 2026-11-21 · 43 · Owner fix 7: CouponPickCard "Best" green again
- **CouponPickCard `13036:56889` ("文字颜色应该是绿色"), component set (`11314:9983` …):** "Best" text `11314:9934` (Selected) and `11314:9970`
  Content/Urgent → **Content/Positive/Strong** (legacy Text/Positive/Heavy → green-800); pill fills `11314:9933` and `11314:9969` Palette/Green/100
  (bound by my container P rule in entry 38) → **Bg/Positive/Subtle** (semantic, green-100). Countdown row unchanged (orange, white, no stroke).
  56972 and every screen CouponPickCard follow the main (no screen overrides found).
- **Other "Best" pills on Content/Urgent:** none outside CouponTicket on either page (0 reverted). Orange stays only in the CouponTicket
  component (Tag Urgent `13049:9588` in the Use / Pick / Selected variants). Note: 13036:55898 shares its main with 55943 / 55983 and 2 screen
  coupons, so those Best pills are orange too (component level, decision 38 addendum). Entry 35's "pills of the same kind follow it" for
  CouponPickCard is withdrawn.
- **Owner fixes 1–7:** 1 ✅ · 2 ✅ (text colour question open) · 3 ✅ · 4 ✅ · 5 ✅ · 6 ✅ · 7 ✅. PNG not re-exported since entry 39.

### 2026-11-21 · 42 · Owner fixes 5–6: VerifiedBadge star, CreditCard track clip + decision-40 clip audit
- **5 · VerifiedBadge `13036:56350` ("用brand strong"):** star `11156:5432` in main `11156:5431` fill Bg/Positive/Default (green-500) →
  **Bg/Positive/Strong** (green-600 #5CD680, fill scope; legacy role Icon/Positive). Check `11156:5434` stays Content/Inverse. No instance
  overrides of the star on either page, so every badge follows.
- **6 · CreditCard `13036:56581` ("左边圆角没了"):** progress track "Card" `11133:4935` (CreditCard main) clipsContent false → **true** (legacy
  frame clips; the two "Slider progress bar" rectangles 0/999/999/0 rely on it for the rounded left end). Sheet and screens follow the main.
- **Decision-40 clip audit (`clipFix`, shared data):** frames left unclipped that carry no shadow themselves or on any child, and whose legacy
  box twin clips → clipsContent true. Mains **19** (icon frames, Check, PayMaya logo groups, chevrons), sheet 0 (follows mains), screens **34**
  (13 Scrim, 5 Keyboard, 2 Segmented, 3 Spacer, 3 Content, icons / groups). **53 restored**; every frame with a shadow keeps decision 40.
- **Owner fixes 1–6 status:** 1 ContactMethod ✅ (40) · 2 Used coupon white ✅ (40; text colour question open: Accent-strong (b) vs Disabled) ·
  3 CouponPayCard tags ✅ (41) · 4 ActivityItem tile ✅ (41) · 5 VerifiedBadge ✅ · 6 CreditCard clip ✅. PNG not re-exported since entry 39.

### 2026-11-21 · 41 · Owner fixes: CouponPayCard tags, ActivityItem tile lighter (coordinator relay, items 3–4)
- **CouponPayCard `13036:56096` ("左右两个tag都用右边tag的样式"), component `11273:4945`:** left tag Row `11273:4918` fill Surface/Positive/Subtle →
  **Surface/Brand/Subtle**, stroke Border/Positive/Default → **Border/Selected/Default**; check `I11273:4920;7182:22657` + "Saved" text
  `11273:4922` Content/Positive/Strong → **Content/Accent-strong** (glyph, size, padding, text style, r999, 1 px unchanged — already equal to
  the right tag). Right tag: text `11273:4931` and arrow Union `I11273:4927;10661:53665` Content/Brand/Default → Content/Accent-strong, arrow
  strokes `I11273:4927;10661:53653` / `:53654` Border/Brand-strong → Content/Accent-strong (icon follows text). Same on the sheet instance
  overrides and screen instance `11273:35632` (`11273:34241` had no overrides; it follows the main).
- **ActivityItem `13036:56152` ("颜色太重，用浅一点的"):** tile `I13036:56152;11156:5552` Bg/Brand/Default (navy-900) → **Bg/Brand/Muted**
  (navy-600, white icon). The mains already use Muted (Repayment `11156:5533`) / Bg/Positive/Default (Loan `11156:5552`); Documents / ID
  verified (56172 / 56190) have no tile; no screen ActivityItem tile was on Bg/Brand/Default. Other tile colours unchanged.
- Items 1–2 (ContactMethod, Used coupon) done in entry 40. Open question: Used coupon texts Accent-strong (b) vs Content/Disabled.

### 2026-11-21 · 40 · Owner fixes: ContactMethod 600 step, Used coupon white (coordinator relay)
- **Token:** new `Content/Selected` `VariableID:13081:9530` (Semantic, alias Palette/Green/600, scopes TEXT_FILL + SHAPE_FILL, WEB
  `var(--content-selected)`), as tokens/v2/build.py.
- **ContactMethod `13036:55882` ("全部用600色阶"):** variant State=Active `11086:2673`: Row `11133:5424` stroke Border/Selected/Default →
  **Border/Brand-strong** (green-600); icon `I11133:5428;3282:283`, `;3282:284` + label `11133:5432` Content/Accent-strong → **Content/Selected**.
  Row fill unchanged (white). Same values on the sheet instance overrides and 2 screen instances (`11134:10174`, `11263:19206`).
- **Used coupon `13036:56028` ("白色背景"):** CouponTicket State=Used Ticket `13025:12792` Bg/Disabled → **Surface/Default** (same as the active
  cards); sheet override `I13036:56028;13025:12792` and 6 screen instances (`11273:31739` … `11273:31844`). Texts left as they are
  (Content/Accent-strong from answer (b)) — the relay said "keep Content/Disabled from (b)"; (b) was Accent-strong, so this is flagged to the
  coordinator, not changed. `13036:56062` is State=Expired (Ticket already Surface/Default) → no change.

### 2026-11-21 · 39 · Amount 700, open list from 38, radius check; RESUME POINT
- **Amount/* = Bold 700 (coordinator decision):** Amount/xxl · lg · md · xs fontName → Hanken Grotesk Bold (size, line height, tracking,
  variables unchanged; description notes 700). 30 texts moved from Amount/xs-bold · md-bold · lg-bold · xxl-bold back to their base style
  (18 component page, 12 screens); the 4 twins deleted (0 consumers). Amount/md-semibold kept. New styles from entry 38 are now **14**.
  Weight check (`weightFix2` dry run): mains 0, sheet 0, screens 0 (one scaled 8 px legal text in the App download mockup, logged).
- **BottomBar:** new variant `Type=Two buttons compact` `13078:9537` (360 × 108, clip off, content as Two buttons) = legacy
  "Bottom Nav Action Container / Default" 3333:3079 at 108. Sheet row 9 + **21 screen bars** paired with that legacy instance swapped.
  Kit map for 3333:3079 not yet pointed at it (todo).
- **TopBar right icons:** the 4 `.GlassButton Type=Icon` instances (20 px) in the TopBar Brand mains → swapped to the legacy icons themselves
  (Icon / Inbox 7798:15838, Icon / Headset 3416:1016) at native 20, Content/Primary. Sheet row 61 follows.
- **Clock glyph:** `Icon / Pending` (native 36) was resized to 14 → strokes now native × 14/36 (0.99, = legacy) on 12 sheet + 18 screen
  instances (the icon only exists as an instance override; resize/rescale of instance sublayers is ignored, stroke override works).
- **Field Error frame 84 vs 64:** instances were fixed at 64 while label + box + message = 84 → hug: sheet rows 113 / 116 = 84 (legacy);
  **111 screen Field instances** set to hug (mains already hug). geo4 not re-run → check positions below fields next session.
- **LoanStateCard (owner 57055 / 57066):** Icon Container tiles removed in all 5 variants; icon colour by legacy tile step: Reviewing ×2 →
  Content/Accent-strong, Failed / Withdrawal method → Content/Negative/Default, Disbursed → Content/Positive/Default. Icons are still the
  outlined legacy glyphs: **filled twins for History, Alert circle, status/check are not in the set yet (decision 22 drawing).**
- **Per-corner radius check** added to `look2` (containers paired by box ±1.5 px, all four corners, only visible / clipping frames). Found 15:
  TopBar `Left` / `Right` wrappers r0 → Radius/20 (legacy 20) and TopBar logo Tile r8 → Radius/0 (legacy) fixed in the TopBar mains; 10 left =
  CouponTicket Background (legacy r16) / Shape (rebrand r16) swap: same rounded ticket, rounding on the other layer (classified).
- **Final look2 (sheet, 148 rows):** rows 93 → 65 · W 69 → **0** · text colour 56 → 32 · vector colour 114 → 92 (33 art; +5 LoanStateCard owner
  change vs legacy tiles) · stroke weight 20 → 16 · vector count 12 → 11 · frame 34 → 7 · radius (new) 10 (all classified).
  Exports: `parity/figma/look-parity.png` (1680 × 20090) and `parity/figma/look-parity-preview.png` (502 × 6000).
- **RESUME POINT (fifth session stops, context nearly full):** still open, in order —
  1. OrderAmountCard slider knob rebuild (9f-3): legacy = white ellipse + brand-light ellipse stacked; rebrand = one Bg/Positive ellipse with
     2 px white stroke (`13032:31209;11063:2305`, slider main 11063:*); colours white + green-500.
  2. InboxItem `13036:57401` "secondary": no Button instance inside the row — find the drawn secondary element and give it the legacy
     secondary look (decision 24 / 34 apply only to side-by-side / Log out).
  3. CouponTicket "Default - long text": legacy info icon sits after the rule text on the "Borrow…" line; rebrand puts it before "Valid until"
     (`Row / Rule` vs `Row / Meta` in 11046:2066).
  4. LoanStateCard filled icons: draw `Icon / History / Filled`, `Icon / Alert circle / Filled`, `status/check / Filled` (decision 22 rule), swap.
  5. Kit map 3333:3079 → `Type=Two buttons compact`; re-run geo4 on frames with hugged Fields.
  Tools: `look2` (+ radius), `weightFix2`, `colorFix` / `colorFixExempt`, `rawSweep`, `mainPairs2`, `pairs175`. Commit nothing.

### 2026-11-21 · 38 · LOOK-DIFF pass: weights, colours, shapes (fifth session)
- **Work list:** `figma/LOOK-DIFF-2026-11-21.md`. New checker `look2` (shared data; same method as the coordinator's diff: texts by characters,
  vectors by order, top frames; plus **weight equality** and **unbound paints**). Look parity sheet `11311:21425`, 148 rows:
  | class | before | after |
  |---|---|---|
  | rows with any difference | 93 | 64 |
  | W weight ≠ legacy | 69 | 1 (Toast, coordinator question) |
  | text colour | 56 | 30 (all intended / owner / pending, see below) |
  | vector colour | 114 | 87 (33 = original illustration art raw on both sides, dec 32; rest intended / order artefacts / open) |
  | stroke weight | 20 | 16 · vector count 12 → 11 · frame (radius / fill / stroke / size) 34 → 11 |
- **W — weights (rule: weight = legacy weight).** Cause: v2 styles keep the kit's normalised metrics but carry another weight
  (Amount/* 800 vs legacy Number Bold 700, Caption/* 500 vs legacy Section-title/xs 600, file badges Bold, etc.). New tool `weightFix2`:
  each paired text keeps its current style's size / line height / tracking and moves to an existing v2 style with the legacy weight, else to a
  **twin** of its current style. Applied on component mains (compPairs + 60 sheet-row main pairs: 88 texts), the sheet (2) and the 175 screen
  frames (49 + 6 unstyled scaled App-download mockup texts set directly). Dry run after: **0 weight mismatches** on all three sets
  (1 scaled 8 px legal text in the App download mockup left; 165 legacy texts with mixed weights skipped, not compared).
  **18 new text styles** (Hanken Grotesk; each binds the same Font/Family, Font/Size, Font/Line-height variables as its base; description
  says "Legacy-weight twin of …"); no existing style changed:
  Label/xs 11/14 SemiBold 0 % · Label/xs-bold 11/14 Bold 0 % · Label/sm-bold 12/16 Bold 0 % · Label/md-bold 14/20 Bold 0 % ·
  Caption/sm-light 12/16 Light 0 % · Body/lg-light 16/24 Light 0 % · Title/sm-semibold 18/24 SemiBold −0.5 % · Title/md-medium 20/28 Medium
  −0.5 % · Title/lg-medium 24/32 Medium −0.5 % · Title/lg-extrabold 24/32 ExtraBold −0.5 % · Headline/sm-bold 28/36 Bold −1 % ·
  Headline/sm-medium 28/36 Medium −1 % · Display/md-bold 36/44 Bold −2 % · Amount/xs-bold 16/20 Bold +2 % · Amount/md-semibold 24/32
  SemiBold +2 % · Amount/md-bold 24/32 Bold +2 % · Amount/lg-bold 32/40 Bold +3 % · Amount/xxl-bold 48/48 Bold +4 %.
  Note for the coordinator: no legacy text is ExtraBold on an amount, so Amount/* (800) now has ~no rebrand use; folding Amount/* to 700 would
  remove 4 twins (token change = coordinator's call).
- **C — colours.** Cause: rm2 was already right (legacy brand text / icon → Content/Accent-strong, negative light → Negative/Subtle); the
  defects were layers the kit never re-translated (mains built on Content/Brand, which resolves to #141E24; raw #000 on reused legacy icons;
  kit overrides). New tool `colorFix` (shared data; exemptions `colorFixExempt`) on sheet rows (+ main-equivalent layer), component pairs and
  the 175 screens: A unbound → legacy role token (raw-identical art skipped), B Content/Brand* → Accent-strong where legacy is brand blue (not on
  strong green / navy fills), U legacy #FF5E00 → Content/Urgent, N negative step, T legacy neutral level, and containers: P legacy primitive →
  same step, Ctrl Border/Control → legacy twin, Amb Bg/Neutral → Surface/Page. ≈170 paints. Explicit mains: Button Secondary labels → Accent-strong
  (6 variants + Link "Reject" 10987:62), CouponTicket Expired text → Content/Disabled, CouponTicket countdown = per-instance Content/Urgent (main
  meta stays Tertiary), Chip Medium + Chip Small Default = legacy term chip (no fill, Border/Subtle, Tertiary), Chip Medium Selected = green-50 +
  Border/Accent/Subtle + Accent-strong, OtpBox Filled (Border/Accent/Subtle, Tertiary digit), ResultBadge (Bg/Positive/Strong; Palette/Red/500),
  SelectBar "Supports" → Placeholder, LoanHistoryItem "Under review" → Primary, Check Off (10989:230 / :242 + 4 overrides) → no fill +
  Border/Default (9e), coupon-art ellipses legacy Positive/600 → Bg/Positive/Strong (9e), Field Error texts → Negative/Subtle (9b),
  Navigator active label + icon → Accent-strong (legacy blue; PayDock follows), PhoneField label → Accent-strong, +63 → Placeholder,
  placeholder → Palette/Neutral/150 (legacy). Credit History tabs (legacy pill tabs, 8 on screens + sheet rows 30/31): r999, no stroke, unselected
  Accent-strong text.
  **Unbound-paint sweep (`rawSweep`, checker rule "no unbound paints outside illustrations"):** Component page 64 → 0, Design page 55 → 9
  (logged exceptions: 8 raw #000000 fills on Application details frames / profile ellipse, 1 off-palette #F2F7F6 Onboarding background).
  Art = containers holding non-palette colours or images, `Media` layers, logos (1 143 + 3 115 raw art paints kept, dec 32); gradients kept raw
  (136 + 693; Figma cannot bind stops).
  **Translator:** rawStep `f#000128@low` → bg-on-brand, `s#000128@low` → border-on-brand (kit already reads `@low` for paint opacity < 0.5).
  Two own mistakes reverted in the same pass: Register / Opening `11051:16` (P rule made the navy splash green-900 → back to Surface/Brand/Default;
  P now skips navy surfaces) and two TrustCard bank-logo layers (art guard now applies to every rule). Paint opacity on alpha variables was
  briefly set to 1 and restored (Figma mirrors the variable alpha into paint opacity; render identical before / after).
- **S — shapes.** Field Floating + Inline (9 variants): white box Surface/Default + Radius/24 (legacy). CouponTicket variants frame radius 0.
  Back icon: stroke override removed on `.GlassButton` Back main (glyph fill-only as legacy; TopBars + sheet follow). Glass strokes = the legacy
  gradient (white 100 / 0 / 100 %, 1 px inside) on `.GlassButton` (4 types), Search (3 states), Button Glass; calendar Button Small Glass fill
  Surface/Default 100 %. CouponPickCard countdown rows (`11314:9939`, `:9957`, `:9975`): no stroke, Surface/Default (owner 56889 / 56972).
  LoanHistoryItem tag: Radius/full + Palette/Green/200 (legacy State tag r999, Brand/200) (owner 56876). Sheet row 21 → `.GlassButton Type=Close`
  (legacy Cancel-Thick 14, dec 37); row 92 → Button Secondary Disabled (legacy disabled look).
- **Classified, no change:** PhoneField 343 × 64 (dec 13); ChoiceButton 58 vs 56 and Installment 10 → 11 px (G1 line heights); PermissionCard,
  Strip, CreditLimitCard filled icons (dec 22); Navigator / PayDock Payment glyph 2 → 1 vectors (merged copy, same silhouette); Tag widths
  74 → 69 (Hanken glyphs) and 100 → 59 (legacy component fixed-width); illustration art (EmptyState, coupon art, rating star); `Cancel small`
  circle raw (mask); primary / selected labels navy on green-600, Best orange, Uploaded Accent-strong, selection controls, Accordion title
  Primary (owner), Tag accent text green-700 (entry 33), CreditCard alpha (dec 16).
- **Coordinator questions (sent):** Used coupon 56028 (b) confirm; Toast (dec 6 vs legacy white pill); MethodPicker Recommend (dec 19);
  FAQ "No" chip (legacy Variant2 white vs Pill Selected green).
- **Open (not done this pass):** BottomBar Variant3 108 vs 148 (row 9: needs a compact variant or instance height); TopBar right icons 18 vs 20
  (row 61); OrderAmountCard slider knob rebuild (9f-3); LoanStateCard 57055 / 57066 filled icons without tile; InboxItem 57401 secondary button;
  CouponTicket long-text rule info icon position; clock stroke 0.99 vs 1.15 (swapped icon, sheet only); Field Error frame 84 vs 64 (message
  outside the box, visually equal); per-corner radius check beyond top frames.
- **Coordinator answers applied (same day):** (1) Used coupon `13036:56028` = (b): CouponTicket State=Used `11046:2120` Ticket → Bg/Disabled,
  all 5 texts → Content/Accent-strong (main, sheet row, 6 screen instances); exemption removed from `colorFixExempt`. (2) Toast: every Status
  variant 360 wide, message → Label/md (legacy SemiBold); sheet + 1 screen instance 360; dark fill / r16 / white text = dec 6 (NORMALISATIONS).
  (3) MethodPicker "Recommend" = Tag Accent Strong, intended (dec 19). (4) FAQ "No" chip: legacy Variant2 → Chip Pill Default (sheet row 51 +
  1 screen chip); kit map 5453:5054 Variant2 → Size=Pill, State=Default.
  **Final sheet counts (look2):** rows 93 → 63 · W 69 → **0** · text colour 56 → 32 (row 27 Used (b) ×5 + intended) · vector colour 114 → 88 ·
  stroke weight 20 → 16 · vector count 12 → 11 · frame 34 → 10. PNG re-exported.
- `parity/figma/look-parity.png` re-exported (1680 × 20090). Tools in shared data: `look2`, `look2Before`, `look2After`, `weightFix2`,
  `mainPairs2`, `colorFix`, `colorFixExempt`, `rawSweep`; rawStep updated.

### 2026-11-21 · 37 · CreditCard alpha track, token sync; RESUME POINT (fourth session stops: context full)
- **13036:56581 CreditCard (sheet), "完整的alpha bar没了":** the full-width progress track was not missing — its fill was the raw legacy
  `#000128` @ 30 % (navy on the old blue card, invisible on navy). The legend dot before "Total credit" shared that colour. Both →
  **Bg/On-brand** (periwinkle 24 %, decision 16). Mains were already right; overrides from the kit on the sheet instance (track + dot)
  and on 4 screen CreditCards (track) fixed. Cause: the kit keeps raw legacy colours that equal legacy art (shapeLvl "identical raw =
  art" rule) — **rule fix still to do:** rawStep entry raw #000128 alpha on a navy surface → bg-on-brand.
- **Tokens:** created `Bg/Urgent/Subtle` `VariableID:13051:31687` (alias Palette/Orange/100, scopes FRAME_FILL + SHAPE_FILL, WEB
  `var(--bg-urgent-subtle)`); `Content/Urgent` alias Orange/700 → **Orange/500** (owner: legacy countdown #FF5E00, BRIEF 38). Best pill fills
  (Tag `13049:9588`, 2 CouponPickCard pills) rebound Palette/Orange/100 → Bg/Urgent/Subtle (3 paints).
- **RESUME POINT — queue from the coordinator, in order (all in `3oi5Omgi2dC5sR0L7Ux5hf`, commit nothing):**
  1. `13036:56028` Used coupon — waiting for the coordinator: (a) legacy disabled (label → Content/Disabled, card white) or (b) texts
     Accent-strong + card Bg/Disabled.
     **Coordinator answer (2026-11-21): (b).** Owner said first "应该用disabled色阶", then "文字和icon都用accent strong的同色": fills / strokes on
     the disabled scale (card Bg/Disabled), texts + icons Content/Accent-strong.
  2. Weights `13036:56410` (done, entry 36) + `13036:56616` + `13036:56756` + `13036:58205` (include in the screenshots): find the systematic cause (my `weightFix` fixed 383 texts
     where an exact v2 style exists); full weight check (weight must equal legacy), create the minimum new text styles where none has
     the legacy size + weight (owner allows: e.g. 11/14 SemiBold, 11/14 Bold, 18/24 SemiBold, 14/14 Bold, 24/32 Medium, 20/28 Medium —
     confirm which are really needed), apply everywhere, add weight equality to the checker, report specs.
  3. `13036:56876` radius: per-corner radius equality vs legacy, token-bound; systematic check + checker rule.
  4. `13036:56889` (orange): no stroke, fill Surface/Default, text + icon Content/Urgent (now orange-500, ΔE 0).
  5. `13036:56972` CouponPickCard unavailable "Card" countdown frame: raw fill #FFE9DD + raw stroke #FFA06C → no stroke, Surface/Default
     fill; text + clock Content/Urgent; no raw paints left in CouponPickCard (all states).
  6. `13036:57055`, `13036:57066`: filled icon, no tile / background (decision 22 filled set); siblings of the same list type; active state
     icon + label Content/Accent-strong, indicator by legacy step; inactive legacy neutral.
  7. `13036:57199`, `13036:57453`: element-by-element match with legacy (+ LOOK-AUDIT items).
  8. `13036:57401` "secondary" (button: legacy secondary look; decision 24 / 34).
  9. `13036:57448` + `13036:57453` + `13036:57471`: stroke weights (resize vs rescale, decision 36) and colour steps; back icon thicker than
     legacy — check every TopBar back / close / top-bar icon; checker rules for stroke equality and colour steps.
  9b. `13036:57522` Field error message (coordinator checked): legacy `Color/Text/Negative/Light` #FF0D19 (red-500) is bound to
     Content/Negative/Default (red-600) → **Content/Negative/Subtle** at the Field component (all layouts / states; error icon too). Note:
     entry 32 set Stacked/Floating Error message to Content/Negative/Subtle — check which variants / instances still carry
     Negative/Default (instance overrides from `lvl` or the kit). Sweep every node whose legacy twin is Text / Icon Negative/Light →
     Negative/Subtle, and Negative Default / Heavy → Negative/Default / Strong; find the collapsing rule (rm2 / rawStep / lvl), fix it,
     re-run H5 for red roles, give counts, screenshots.
  9c. `13036:57477` Field icon stroke raw #000000 → Content/Tertiary (legacy Color/Icon/Tertiary) at the Field component, all states;
     `13036:57743` same ("没绑token"): **file-wide sweep of all unbound paints** (fills, strokes, text, icons) on the library + rebrand pages,
     bound to the legacy role's token; allowed raw only inside original illustrations (decision 32) + logged exceptions; checker rule
     "no unbound paints outside illustrations", counts before / after. Placeholder stays Palette/Neutral/150 (coordinator: legacy uses
     Color/Neutral/150 here vs Content/Placeholder neutral-400 elsewhere → phase-2 inconsistency, log it in NORMALISATIONS).
  9d. `13036:57875` Tab Segment Default badge: **done** (entry 37 addendum) — Badge fill Bg/Neutral/Default → Surface/Page/Strong
     (legacy Color/Surface/Page/Heavy, ambient-200) in `13027:9413`; Active badge Surface/Default (legacy white) unchanged. Still to do:
     sweep legacy Surface/Page/Heavy / ambient surfaces that landed on Bg/Neutral/* and fix the rule.
  9e. `13036:57880` CouponOption Credit Default (legacy `11311:23157`): (1) coupon art ellipses Background / Icon raw #3BCB84 → legacy
     binds them to Color/Positive/600 → Bg/Positive/Strong (green-600) at the CouponOption mains (corrects entry 33, which reset the
     sheet overrides to the mains' raw art); other art colours stay raw. (2) unselected Check: white fill + Border/Control → no fill +
     Border/Default (legacy Color/Stroke/Default) at the Check / Radio Off component; sweep every Border/Control use → its legacy twin's
     token (Border/Control = phase-2 candidate).
  9f. `13036:57945` OrderAmountCard Off (legacy `11311:23212`): (1) edit icon Content/Brand/Default → Content/Accent-strong (legacy
     Color/Icon/Brand/Default); sweep Content/Brand/* nodes whose legacy twin is Brand blue text / icon → Accent-strong, fix the rule,
     count. (2) unselected term chips: white fill + Border/Default + Content/Secondary → no fill + Border/Subtle + Content/Tertiary
     (legacy Color/Stroke/Subtle, Color/Text/Tertiary); selected chip is right. (3) slider knob: rebuild as legacy (white ellipse +
     brand-light ellipse stacked, sizes and layering as legacy), colours white + green-500.
  9g. The coordinator is preparing a full read-only mismatch list of the Look parity sheet (element by element): fix from that list in
     one pass instead of node by node.
  10. Re-export `parity/figma/look-parity.png` at the end; report to the coordinator.
  Tools (shared plugin data): `geo4`, `rangeFix`, `pairIcon`, `weightFix` + `sty`, `shadowClip` + `shadowClipExceptions`, `lvl` +
  `lvlExempt`, kit run = `new AsyncFunction('args', kit)({page:'10982:15', jobs:[{legacy:'11311:21426', target:'11312:34019',
  section:'11311:21425'}]})`. Plugin limits: no resize / padding overrides on instance sublayers (clipsContent and paints work).

### 2026-11-21 · 36 · Owner node fixes 56266 / 56334 / 56350 / 56355 / 56410 / 56539 (rule 40)
- **13036:56266 ReasonRow radio, "all green":** legacy ring + dot both `Color/Icon/Brand/Default` (blue-600). Ring was already
  Border/Brand-strong (green-600); dot Content/On-action (navy, entry-31 rule) → **Bg/Selected (green-600)** in Radio On main
  `11156:5429`. Follows: 10 uses on Component page, 8 on screens (Change withdrawal method e-wallet, Manage my account / Delete, Delete
  account confirmation + disabled, Marital status popovers ×3, Cancel my loan). Label stays Content/Primary (legacy neutral primary),
  divider Border/Subtle (legacy neutral) — not turned green. **Note:** this changes entry 31's "navy mark" for radios (checks keep navy).
- **13036:56334 Accordion title, "用primary":** not a button — the Accordion title was bound to the primitive Palette/Neutral/600 (renders
  grey); legacy renders dark (A23) → **Content/Primary** in both Accordion mains (2 paints); 3 screen uses follow.
- **13036:56350 VerifiedBadge, "icon用白色":** check glyph Content/Brand/Default (dark) → **Content/Inverse** (fill + stroke) in main
  `11156:5431`, as legacy Color/Icon/Inverse; badge stays Bg/Positive/Default. 4 screen uses follow. ID FAILED glyph already white.
- **13036:56355 FAQ feedback "Yes" chip, "无勾边，999圆角":** legacy FAQS/feedback btn 72 × 44, p20/12, r999, no stroke, 14/20 SemiBold;
  rebrand Chip Medium had 1 px Border/Default, r16, p16/8, 16/22. Chip Medium is also the term chip, so new variants **Chip Size=Pill**
  Default `13050:31254` / Selected `13050:31257` (strokes [] weight 0, Radius/full, p20/12, Label/md). FAQ Yes / No on `11257:46414` and
  the 2 sheet rows swapped, legacy box 72 × 44, offset 0,0; map 5453:5054 → Size=Pill.
- **13036:56410 DocCard, "字重不对":** legacy 11/14 Regular (Legacy/Caption/xs) was Caption/xs Medium → Body/xs; file names legacy 12/16
  Medium (Label/sm-light) were Label/sm SemiBold → Caption/sm. The kit's style map was already right (components predate decision 33).
  New pass `weightFix` (shared data; legacy style → kit STY target, else an exact size + line-height + weight v2 style; only when the
  weight differs): **131 texts in component variants, 230 on screens, 22 on the sheet**. Missing styles (left as nearest, not faked):
  11/14 Bold (file-type badges PDF / JPG… ×5+16), 11/14 SemiBold (×105 incl. tag labels), 18/24 SemiBold (×27), 14/14 Bold, 24/32 Medium,
  20/28 Medium; amounts in Bold vs Amount ExtraBold and 10 px / scaled sizes are G1 / decision 10.
- **13036:56539 rule 40 (shadow not clipped):** checker + fix `shadowClip` (shared data). The example TopBar's glass Back / Action shadows
  were cut by `Left` (instance override) and the main's Row → unclipped. Component page 62 frames unclipped (showcases, TopBar / button
  rows…), Design page 32; then frames whose content overflows went back to clipping (exceptions, shared data `shadowClipExceptions`):
  31 on screens (sheets with lists, carousels "What customers say", App download mockup, CreditCard / coupon cards with art), 4 in the
  library (HomeCoupons Coupon 1 / 2 / Panel, a CreditCard). Slider Rail / Bar kept unclipped (knob must not be cut). Net: 94 − 35 = 59
  unclipped. Recheck: 0 cut shadows outside the exceptions.
- `parity/figma/look-parity.png` re-exported. Pending: 13036:56028 (coordinator question).

### 2026-11-21 · 35 · Coupon "Best" pill = legacy shape, orange steps (owner, node 13036:55898; LOOK-AUDIT A37)
- **Node:** `13036:55898` = CouponTicket (State=Use) on the Look parity sheet; legacy twin `Coupon / Property 1=countdown` (11311:21596).
  The pill is its "Best" tag.
- **Legacy → before → after:** size 43 × 24 → 38 × 22 → **43 × 24**; padding 8/4 → 8/4 → 8/4; radius 12 → 8 → **12**; stroke none → none → none;
  text 12/16 SemiBold → 11/14 Medium → **12/16 SemiBold (Label/sm)**; position in the value row (87, 2) → same → same; no icon, no shadow.
  Colours (owner: orange scale at the legacy steps): fill legacy `Color/Positive/100` = green-100 #DDF8EE → was solid green-500 →
  **orange-100** #FFE6D5 (`Palette/Orange/100` — no semantic orange-100 fill exists: **token needed**, e.g. a Bg urgent-subtle role);
  text legacy `Color/Text/Positive/Heavy` = green-700 #2EAE6E → was navy → **orange-700 `Content/Urgent`** #B83F00.
- **Changed:** new Tag variant `Size=Medium, Tone=Urgent, Emphasis=Subtle` `13049:9588`; CouponTicket Use / Pick / Selected Best tags
  → it, fixed 43 px (3 nodes); CouponPickCard Selected / Default drawn Best pills recoloured (2 pills, 4 paints). Screens follow the
  mains, no overrides: `11273:23987`, `11273:24336`, `11273:30212` (3 Best pills); sheet rows follow too.

### 2026-11-21 · 34 · Upload success status = Content/Accent-strong (owner, node 13036:55704)
- **Node:** `13036:55704` = UploadTile instance (`Type=File, State=Uploaded`, main `11044:1970`) on the Look parity sheet. "Uploaded" text
  + check icon were bound to **Content/Positive/Strong** (green-800) → now **Content/Accent-strong** (green-700), as decision 29 says.
- **Source:** the level map — legacy roles `Color/Text/Positive/Heavy` and `Color/Icon/Positive/Heavy` → `content-positive-strong` (rm2).
  Not changed globally: Positive/Strong also carries other legacy Positive/Heavy texts (coupon savings "Saved ₱500", "You save…",
  "Your limit is…", "Best", KV positive dates, slider / order-card coupon end labels "₱50,000"). Scoped decision-29 rule instead.
- **Changed:** mains UploadTile `11044:2020` and .FileRow `11166:4435` (DocCard `11166:4925` follows through its nested .FileRow) —
  4 paints; screens: 4 overrides in `11163:14473` (Basic info / Default 2) and `11163:23528` (Add proof of income / Full); every other
  instance follows the mains (22 on the component page incl. the sheet row). Kit map hooks for 9474:28815, 9548:31409, 9474:29171 get a
  post-step (Uploaded + paired icon → Accent-strong); `lvlExempt` + decision-29 rule (text "Uploaded", icons 11166:4550 / 11166:4455).
- **Checker:** 175 frames + 130 component variants, 0 non-exempt. `parity/figma/look-parity.png` re-exported. No shape / layout change.

### 2026-11-20 · 33 · Green text one step lighter (owner: "深绿色文字浅一个色阶", paired icons too)
- **Variables** synced from `tokens/v2/figma-tokens.json` (matched by Web code syntax, 247 colour variables in Primitive / Semantic /
  Component): exactly 8 aliases changed — Content/Accent-strong, Content/Link/Default, Content/Positive/Default, Tag/Accent/Content/Default,
  Tag/Positive/Content/Default → Palette/Green/700 (#44A05F); Content/Accent-heavy, Content/Link/Pressed, Content/Positive/Strong →
  Palette/Green/800 (#327545). Content/Accent stays green-500. Nothing missing, no duplicated names or Web syntaxes (Content/Accent-heavy,
  Surface/Positive/Subtle, Bg/Positive/Strong-pressed, Border/Accent/Faint · Subtle each exist once).
- **Paired icons:** new checker `pairIcon` (shared data): for every text on a green content variable, green icons in the same row must use
  the same variable. Component page 258 green texts / 28 paired icons, Design page 566 / 49 — all already matching (0 fixed).
  - ScamStrip: text + info icons were on Content/Accent-heavy in this copy (not Palette/Green/700 as in the original file) → moved to
    Content/Accent-strong in the main (3 paints) and in the 6 screen instances (18 overrides).
  - Legacy Color/Icon/Positive/Heavy / Color/Text/Positive/Heavy and Palette/Green/700 bindings: none left on the Rebranding pages
    (outside the sheet's legacy column).
  - The 8 Palette/Green/600 nodes are coupon-art shapes in CouponOption on the Look parity sheet (kit overrides): reset to the mains'
    original art colours (decisions 12 / 32); screens already use the mains.
  - DocCard, UploadTile, .FileRow, CouponPayCard: icons share their text's variable (Accent-strong / Positive/Strong) — verified.
- **Level checker (H5, `lvl`):** fixed OrderAmountCard coupon end label → Content/Positive/Strong (legacy heavy level); CouponPickCard
  countdown text + icon raw #FF5E00 → Content/Urgent (12 paints, dec 38); Field / Search clear icons (legacy Cancel small) legacy
  variables → v2 via rm2 (23 paints). New exemptions (`lvlExempt`): selected tab / segment navy label on Bg/Selected, date-picker
  selected day, ScamStrip = Accent-strong (coordinator), Cancel-Thick clip-path mask vector. Result: 175 frames and 130 component
  variants, **0 non-exempt mismatches**.
- Not mapped / left as is: tag and tint **fills** bound straight to Palette/Green/100 / 200 (PaymentCard / InstallmentCard tags, Installment
  "JAN" chip, 27 on screens) — fills, not text or icons, unchanged by this rule; 25 deliberate Content/Accent-heavy labels (now green-800).
- Re-exported `parity/figma/look-parity.png` (1680 × 20090). No shape or layout change.

### 2026-11-20 · 32 · Steps 5–7 (fourth session, done; see last bullets)
- **Session:** fresh Figma lane session, file `3oi5Omgi2dC5sR0L7Ux5hf`. Backups: shared data `bak20261120b_map` (map before this session).
- **Geometry checker v3** (shared data `geo3`, results `geo3Last`): adds a **cascade** bucket = text whose anchoring container (first
  non-hugging ancestor) has the legacy box and same y / height, so the x shift comes only from Hanken glyph widths inside hugging groups
  (decision 10 "font glyph"). Baseline before fixes: ok 1 159 · glyph 622 · lineH 140 · pos 2 050 · missing 39.
- **Plugin limit found:** `resize()` on a text (or frame) inside an instance is silently ignored, so text boxes inside library instances
  cannot be frozen to legacy size per screen; `geoFix` (shared data) only works for drawn (non-instance) texts. Test overrides reverted.
- **A17 / A18 fixed:** Field set `11009:437` gets `Layout=Inline` (legacy Typing box/Empty, Filled: label inside, 53 tall, gap 0):
  Default `13020:55026`, Filled `13020:55039` (label + value Content/Secondary, value Body/md-strong), Error `13020:55052` (label +
  placeholder Content/Negative/Subtle). 35 screen fields swapped (texts restored, chevron per legacy). Map 3921:1419 / 3924:1433 → Inline.
- **A2 / A4 / A5 fixed:** Button `Size=XS, Variant=Secondary, State=Default` `13025:9369` (legacy Coupon pick: 28 tall, p16/2, r8, 1 px
  Border/Brand-strong, Title/xs label Content/Accent-strong). CouponTicket `11046:2168`: Use = XS (61 × 28 as legacy), padding right 24,
  row gap 10, head gap 0, rule 1 line ENDING; Use / Used / Expired get a notched background (`Background` frame + subtract `Ticket`,
  notches 24 px at mid-height, real cut-outs). Rule info on for the 2 long-text coupons.
- **A7 fixed:** new set **Tab** `13027:9423` (01 · Actions): Style=Segment (coupon pill, 108 × 36, Active filled Bg/Selected + navy label +
  white count badge) / Filter (inbox filter tab, Active filled, Default white + green-800 text), props Label / Count / Badge. 27 Chip
  stand-ins replaced on 11 frames (coupon + inbox), inbox tabs at legacy width 156. Map 10594:45571 / 8620:34465 → Tab.

- **A8 / A9 fixed:** TopBar `11036:1355` Brand (Solid + Clear): Right = one glass pill 88 × 40 (p12, gap 24, glass paints / effects of
  `.GlassButton`, strokes out of layout), the two buttons 20 × 20 without own background; every Style=Solid variant fills with the legacy
  veil (mist 80 % → 40 % → 0 %, raw gradient: Figma cannot bind gradient stops). 158 screen TopBars inherit (no overrides).
- **A10 fixed:** Button `Size=Small, Variant=Glass, State=Default` `13028:31163` (glass paints + effect style, Content/Primary label,
  36 tall); 4 calendar Cancel / Confirm buttons swapped (they sit 18–19 px low in date-picker frames 11163:12004 / 12582, page pass);
  map 5892:9378 → Glass.
- **A13 fixed:** Tag `Size=Medium, Tone=Accent, Emphasis=Outline-fill` `13028:46944` (Surface/Brand/Subtle + Border/Accent/Subtle);
  15 borrower-protection pills swapped; map 9124:24180. **A14:** no Variant2 "Overdue" twin on screens (sheet only); its legacy fill is
  red-200, which exists only as Border/Negative/Subtle → **request** a Bg red-200 token (coordinator).
- **A16 fixed:** SelectBar control = Radio (On / Off) rescaled to legacy 14 px (was the Check tick).
- **A19 / A20 fixed (Field type):** Stacked label Body/sm Content/Tertiary, Floating label Body/xs Content/Accent-strong (legacy blue),
  values Body/md-strong (Filled / Error Content/Secondary, Focus Primary), error message Body/sm Content/Negative/Subtle. Field clear =
  legacy `Cancel small` 18 px (dec 32). Legacy `Typing box` 5803:14074 is also the one-box look: new `Layout=Inline, State=Focus`
  `13029:55503`; 48 more screen fields swapped (total 83); map 5803:14074 → Inline.
- **A21 fixed:** Search Clear = legacy `Cancel small` 3439:2962 (shown in Default + Focus as legacy), Focus value Body/md-strong; screen
  visibility copied from legacy (2 on, 9 off).
- **A22 fixed:** shared data `rangeFix` copies legacy per-range colours onto paired texts (blue → Content/Accent-strong, red → same red
  step, base = mapped legacy dominant): 45 texts / 68 ranges (legal links, bank / e-mail matches, penalty "5%"). `.PaymentNotice`
  `11100:11176` line 2 = Body/sm Content/Tertiary (was raw black Medium).
- **A24 fixed:** VerifiedBadge `11156:5431` star transform = legacy (rotation offset lost in translation). **A25:** already OK.
- **A28 fixed:** CreditCard legend dot → Bg/On-brand (dec 16; it was navy 30 % on navy, invisible); 9 screen cards.
- **Calendar selected date** (entry 31 note): `.DateCell` Selected `11166:4409` = Bg/Selected + Content/On-action.
- **"Recommend" tags** in MethodPicker / bank rows: legacy pill 18 tall, p8/2, Body/xs (was 22, r8, Medium).
- **A30 / A32:** already match on the sheet (links green, Terms band as legacy). **A29** sits in the retired `_bin/AmountCard` (OrderAmountCard
  on hold, dec 39) → not changed.
- **G1 (line heights):** cases where no v2 style has the legacy metrics: 10/16 SemiBold → Caption/xs 11/14 (99 texts), 12/12.5 (125 %)
  Bold → Label/sm 12/16 (32), 16.33/23 SemiBold → Title/xs 16/22 (27), 13.6/19 → 14/20 (10), 12/14 two-line method tab labels → 12/16
  (MethodTabs), 16/22 Medium → Body/lg-strong 16/24 (6) → listed in NORMALISATIONS.md for the owner (type additions or keep).
- **Geometry after these fixes (geo3):** ok 1 247 · glyph 633 · cascade 999 · lineH 211 · box 67 · pos 822 · missing 31.

- **Step 6 (partly):** field repair — frames with two field groups at the same positions had been paired to one field; re-paired by
  position + document order (83 fields), missing legacy texts 61 → 17 (all decision 39). Kit hooks for 3921:1419 / 3924:1433 / 5803:14074
  no longer infer State=Focus (they keep the map state). `figma/NORMALISATIONS.md` written: buckets, G1 type table for the owner,
  decision-classified frames (19, 20, 39, 13, 6/21/35), open list.
- **Step 7 done:** kit re-run in place on `Look parity / Rebrand` `11312:34019` (0 raw, 0 missing variables, 0 unmapped), `rangeFix` on the
  148 rows, DateCell overrides reset; exported `parity/figma/look-parity.png` (1680 × 20090, section `11311:21425`).
- **RESUME POINT (fourth session ends here):** step 6 open list in `NORMALISATIONS.md` §4 — date-picker header (+11…19, check dec 25),
  SelectBar +22 in Marital status popovers (variant without control), A6 CouponPickCard re-apply on picker sheets (11273:30212), Stacked
  Field label x −4…−8 (label row padding), Search placeholder +3, A27 MethodPicker / OTP text x +5, ReasonRow −20, eye check of the
  box-matched shape pairs; then re-run `geo3`, update NORMALISATIONS and re-export. Requests for the coordinator: Bg red-200 token (A14);
  G1 type decisions. Tools: `geo3` / `geo3Last`, `geoFix` (drawn texts only), `rangeFix`, kit run =
  `new AsyncFunction('args', kit)({page:'10982:15', jobs:[{legacy:'11311:21426', target:'11312:34019', section:'11311:21425'}]})`.

- **Coordinator round (same day):** G1 = owner keeps the nearest style (NORMALISATIONS §1 marked, all lineH rows classified so); A14 = not
  used; build OrderAmountCard; finish step 6.
- **OrderAmountCard built (A29, dec 39):** set `13032:31200` (06 · Product cards, cloned from `_bin/AmountCard` with the same props / layer
  names): Coupon boost Off `13032:31201` / On `13032:31219`; slider fill + knob Bg/Positive/Default (A36), coupon end label icon +
  Content/Positive/Default (A29), amount Content/Accent-strong, term chips legacy look. All 16 screen instances swapped (texts unchanged),
  0 `_bin/AmountCard` left; map 10926:30601 → OrderAmountCard.
- **Date picker:** month / year rows (`Group / Month and year`, 4 frames) are 22 tall as legacy; decision 25's 40 px touch areas overflow
  the row (clip off) — grid, weekdays and buttons back at the legacy y.
- **Marital status popovers:** legacy rows (`Select bar` Press/active) have the check at the end → SelectBar `Style=Card-trailing`
  (Default `13032:47641`, Selected `13032:47646`, Pressed `13032:47652`, Disabled `13032:47657`); 11 rows switched; map Press/active →
  Card-trailing.
- **A6 on screens:** coupon picker `11273:30212`: 5 CouponTicket stand-ins → CouponPickCard (visibility / texts copied from the legacy
  instances by tree walk); legacy selected card `10840:29498` → Selected (map added). CouponPickCard Selected `11314:9983`: expiry strip
  padding 32 / 8 (was 28 / 4, card 8 px short), outline Border/Brand-strong (was Content/Brand navy).

- **Step 6 finished (classification):** checker `geo4` (any matching edge = glyph): ok 1 272 · glyph 1 728 · cascade 183 · lineH 213 ·
  box 109 · pos 488 · missing 17; all 59 frames with pos rows classified in NORMALISATIONS §2 / §4. Fixed this round: Payment index top
  padding 95 → 83 (11109:8723 / 9162); Search icon 18 (legacy); 130 texts legacy Regular → Body/sm / Body/xs (were Caption Medium);
  ID-list titles Body/md; CouponTicket rule 1 line on screens. Tried and reverted: overrides of padding inside instances (ignored by the
  Plugin API) and a compact ListItem variant (worse; removed). Known manual fix: `Row / Rule` reset in CouponTicket instances
  `11273:31363`, `11273:31579`. Owner question still open: App download mockup scale (0.73×).
- **Step 7 again:** kit re-run on `11312:34019` (0 raw / missing / unmapped), map 10926:30601 `With coupon` → Coupon boost=On, rangeFix 7
  texts, DateCell reset; `parity/figma/look-parity.png` re-exported (1680 × 20090).

- **App download landing page (owner: mockup matches legacy at 0.73×):** `11263:18127` scaled to 1×, each text set to the v2 style of its
  unscaled legacy size (28 texts), rescaled by 0.7308 back to 264 × 562; Navigator `11263:18496` and Legal `11263:18492` inside it were
  resized (text stayed full size) → reset to main size and rescaled 0.7308 (BRIEF 36). Frame now 0 pos / 0 missing. TopBar Brand on that
  page hides both actions → its now-empty glass pill hidden (1 instance). Not on the Look parity sheet, so the PNG is unchanged.
  NORMALISATIONS §4 row removed. Remaining manual step (owner): Reset `Row / Rule` in CouponTicket `11273:31363`, `11273:31579`.

### 2026-11-20 · 31 · Selection controls green; RESUME POINT for steps 5–7
- **Owner (via coordinator, BRIEF updated):** checks, radios, toggles take the step rule: `Bg/Selected` = green-600 #5CD680, mark / knob
  navy (Content/On-action), like the primary button.
- **Done:** Semantic `Bg/Selected` → Palette/Green/600 (only change in tokens/v2). Check `10989:254` On variants: mark → content-on-action
  (fill already bg-selected). Radio `11156:5430` On `11156:5429`: ring stroke content-brand → bg-selected, dot bg-action →
  content-on-action. 16 On instances on Design - Rebranding aligned with their mains (2 overrides reset). The drawn legacy "⚠ legacy:
  Check mar" copies inside library components (Installment rows etc.): 7 mains on Component - Rebranding fill bg-brand → bg-selected,
  mark → content-on-action (36 frame copies inherit). No toggle / switch component exists in the library. `shapeExempt`: FLAG removed;
  new "selection control green" (keeps bg-selected where legacy maps to bg-brand).
- **Re-exported** `parity/figma/look-parity.png` (1004 × 12000): checks green with navy mark.
- **Seen on the sheet, add to step 5:** Calendar popover selected date `Property 1=Variant2` fills dark green (a text token used as fill;
  should be bg-selected green-600 + navy number), bank list typed-part highlight lost (A22), Terms bottom bar band (A32).
- **RESUME POINT (unchanged from entry 30, plus the line above):** step 5 shape items A2, A4, A5, A7–A10, A13–A22, A24, A25, A27–A32 +
  G1 / G2 → re-run `lvl`, `shapeLvl`, `geo`; step 6 fix position / box diffs (Field one-box A17 / A18, schedule ₱ offset, hug widths),
  eye-check box-matched shape pairs, write `figma/NORMALISATIONS.md`; step 7 re-run kit job on `11312:34019` and re-export the PNG.
  Tools and usage: see entry 30.

### 2026-11-20 · 30 · Green text one tier darker; colour pass done, steps 5–7 partly (RESUME POINT below)
- **Coordinator:** steps 1–4 approved. Owner (BRIEF "Green text is one tier darker"): green text / icons on light = green-800, heavy /
  pressed = green-900, legacy blue text of any step → Content/Accent-strong; green text on navy keeps Content/Accent (green-500).
- **Done:** aliases Content/Accent-strong, Link/Default, Positive/Default → Green/800; Accent-heavy, Link/Pressed, Positive/Strong →
  Green/900. `rm2` (283): text/icon-brand-light, text-link-light, action-text-link, Text/Brand-Light → content-accent-strong. `rawStep`: raw
  blue text 50–900 → content-accent-strong; raw legacy green text 400–600 → content-positive, 700–900 → content-positive-strong. `lvl`:
  green text on a navy surface (surface-brand, bg-brand*, device navy, on-brand) → content-accent. Strong-container exemption extended
  to content-brand labels (decision 30 PlaceTab selected label kept: `11165:4405` back on content-brand-strong).
- **Re-run:** components 5, frames 47 + 44 + 2 re-bound (the 14 previously blocked + the faint blue-500 labels now green-800). Remaining
  non-exempt: 2 blocked tooltip items (decision 6 dark tooltip text, decision 35 glass tooltip icon), both owner looks.
- **Step 5a — node-by-node fills / strokes (shared data `shapeLvl`, exemptions `shapeExempt`):** pairs every visible solid fill / stroke
  of a rebrand frame with the legacy node at the same relative box (Σ|Δx,Δy,Δw,Δh| ≤ 4), want = map(legacy paint) (fill / stroke step;
  a legacy text token used as a non-vector fill takes the fill step, e.g. Icon/Positive as a tile → bg-positive-strong); raw colours
  identical to legacy (original art, dec 12 / 32) kept. Exempt: dec 7 primary green, dec 8 navy surfaces, dec 16 on-brand, dec 18 tint,
  dec 6 dark toast, dec 22 filled icons, dec 28 activity tiles, raw black icons / alpha tints, border-control, art.
  - Applied: components 25, frames 136 + 118 + 42; kept (art) 32 + 496. A12 term chips now legacy look (default border-default; selected
    surface-brand-subtle + border-accent-subtle + green-800 label), A11 popover button outline border-default, A26 FAQ chip white,
    A36 slider fill bg-positive + white knob (legacy), OTP box states legacy strokes, 4 legacy-bound fills localised.
  - Reverted after review: `11133:6177` (dec 18 tint), `11160:11563` (dec 6 dark toast), `11263:18406` / `18405` (landing page: two
    nodes with the same box swapped — pairing ambiguity; back to raw #000 / #FFF). Coupon art `11273:34483` / `34806` (legacy
    Icon/Positive green) → bg-positive-strong.
  - **FLAG for coordinator:** checks / radios: legacy Surface/Icon/Brand → rename-map `bg-brand` and tokens `bg-selected` = navy-900,
    but BRIEF step rule says "toggles, radios, checks take their legacy blue step in green". Left navy (exempt "FLAG"); needs a token
    decision (bg-selected → green-600?).
  - Text checker re-run after the shape pass: chip labels re-bound (19); residual non-exempt = 0 (tooltip texts / icons exempted as dec
    6 / 21 / 35).
- **Step 7 done (for this state):** Look parity / Rebrand `11312:34019` re-translated in place by the kit (new map + step rule): 0 missing
  variables, 0 raw, 0 unmapped. Exported `parity/figma/look-parity.png` (section `11311:21425`, 1004 × 12000, legacy | rebrand). Visible
  open items on it: checks still navy (FLAG above), A22 range colours ("5%" red) lost, A2 / A4 / A5 / A7 shapes.
- **Step 6 started — geometry data:** shared data `geo` (paired-text x / y / w / h diff vs legacy, ±0.5) and `geoLast` (per-frame
  results). Totals over 175 pairs: ok 1 159 · glyph-width only (Hanken, dec 10) 622 · line-height (G1) 140 · position / box 2 050 ·
  missing 39; 28 frames fully clean; frame sizes all equal legacy. Biggest causes (by frame): Field one-box vs label-above (A17 / A18:
  "ID type" Δ −8, −9; Application details, Address, Bank pages ≈ 35–60 each), Installment / repayment schedule "₱" offset (Δ +15;
  `11055:2682`, `11163:23297`, `11273:30585`), Installment card dates Δ −4 (`11189:16766`), App download landing page (Δ −50, the
  0.73× mockup, open question from entry 26), CreditLimit / Activity amounts (Δ +11), Order detail popover (`11055:2492`). Many "pos"
  rows round to Δ 0,0 = box height / width differences (text box sizing, G1 / G2), not visible moves — the classifier needs a
  "box-only" bucket next.
- **RESUME POINT (context full, 2026-11-20):** in file `3oi5Omgi2dC5sR0L7Ux5hf`, page ids unchanged.
  1. Coordinator decision pending: checks / radios navy vs green (token `bg-selected`, rename-map `color-surface-icon-brand-default`).
  2. Step 5 shape fixes still open (component level, then re-run `lvl`, `shapeLvl`, `geo`): A2 coupon "Use" XS outline button, A4 rule
     row truncation + info icon, A5 coupon notches, A7 Tabs track (coupon + inbox), A8 header pill group, A9 header veil, A10 white
     elevated button, A13 Tag outline+fill, A14 fixed width tag, A16 SelectBar radio, A17–A21 Field one-box / label styles / Search
     clear, A22 range colours (kit `getStyledTextSegments`), A24 verified badge, A25 ID failed glyph, A27 text x, A28 legend dot, A29,
     A30 links, A32 Terms bar band; G1 line heights, G2 hug widths. Done in colour terms: A11, A12, A26, A34, A35 (strokes), A36.
  3. Step 6: refine `geo` classifier (box-only bucket, icon / instance boxes too), fix per section, write `figma/NORMALISATIONS.md`.
  4. Step 7: after the shape fixes, re-run the kit job on `11312:34019` (target in place) and re-export `parity/figma/look-parity.png`.
  Tools in plugin data: `lvl` (texts / icons), `shapeLvl` (fills / strokes), `geo` (geometry), `pairs175`, `compPairs`, `rm2`,
  `rawStep`, `lvlExempt`, `shapeExempt`, `remoteAllow` / `remoteCheck`. Run as `(new Function('return ('+data+')'))()(pairs, opts)`;
  `opts.apply` writes; dry by default.
- **Known limit:** the shape pairing is by box; where two nodes share the same box (background + media) it can swap — 1 case found and
  reverted; the page pass (step 6) re-checks by eye.

### 2026-11-20 · 29 · Rebrand file `3oi5Omgi2dC5sR0L7Ux5hf`: variables synced, colour map rebuilt, step rule, re-bind (steps 1–4 done, review)
- **File:** `3oi5Omgi2dC5sR0L7Ux5hf` "PeraSure design system (rebrand)", the owner's full duplicate (replaces `5SiSMQ…`, which lacked the
  Rebranding pages). Read-only check: both Rebranding pages (Design - Rebranding `10977:32417`: 21 sections, 176 frames + 5 in bin;
  Component - Rebranding `10982:15`: 8 sections, 73 sets / 526 components; Look parity `11311:21425` present), Legacy · and v2 collections,
  all 35 `perasure.rebrand` plugin-data keys, edit access OK.
- **Old → new ids: unchanged.** The duplicate keeps every node, collection, variable and style id of the original, so every id in this log,
  `ledger.json` and the plugin data stays valid (checked: pages, sections, Look parity, `VariableCollectionId:10999:15/16/17`, Border/Focused
  `VariableID:10999:154`, kit references).
- **No reference to `OBsvf42AiRapcRrasD7KNm`:** remote instances (873 on Design - Rebranding, 43 on Component - Rebranding) are the Android
  status bar / keyboard kit, PayMaya, Star 5, ID card, `content/edit--outlined`, "Property 1=Variant2", "矩形"; the original file shows the
  same instances as remote with the same keys, so they come from external libraries, not from the original. Remote variables (1 210) all sit
  inside those remote instances (Material "Schemes/…", "Camera"); 1 remote text style (AOSP/Body/Medium, status bar).
- **Step 1 done (variables):** synced from `tokens/v2/figma-tokens.json`, matched by WEB code syntax. Green 50–950 rebuilt (600 #5CD680).
  Created: Content/Accent-heavy `13004:15`, Surface/Positive/Subtle `13004:16`, Bg/Positive/Strong-pressed `13004:17`, Border/Accent/Faint
  `13004:18`, Border/Accent/Subtle `13004:19`. Aliases changed (19): content-brand / -strong → neutral-900, content-brand-subtle → neutral-700,
  content-positive-strong → green-700, surface-brand-subtle → green-50, bg-action → green-600, bg-action-pressed → green-700,
  bg-positive-disabled → green-300, border-selected → green-500, border-selected-subtle → green-300, border-brand-strong → green-600,
  border-positive-strong → green-600, tag accent / positive content strong → neutral-900. Scopes set from the JSON on 107 variables
  (primitives now [] and hidden from publishing). Periwinkle `11198:87` WEB → `palette-alpha-periwinkle-24`. Skipped: the 3 CSS
  gradient tokens (not representable as Figma colour variables). Nothing in Figma that the JSON lacks.
- **Step 2 done (colour map):** shared data `rm2` (= `rmNew`) = the 276 colour entries of `rename-map.json` (kebab legacy name → v2 WEB);
  replaces the old 312-entry merged map (old inline RM + `rm` emptied). Backups: `bak20261120_kit`, `_rm`, `_rmNew`, `_raw`, `_recolour`.
  Kit and `recolour` now read `rm2` only.
- **Step 3 done (step-rule translator):** shared data `rawStep` (149 entries): raw legacy hex → legacy scale step → same v2 step, as a role
  per use (`t` text/icon, `f` fill, `s` stroke): blue N → green N (950 → navy), legacy green N → green N, red / neutral / ambient same
  step; e.g. raw #2C74BE text → content-accent-strong, fill → bg-action, stroke → border-brand-strong. Kit raw lookup now binds by WEB name.
- **Pairs:** shared data `pairs175` = [rebrand frame, legacy frame] × 175 (b26 names, coupon pairs, then section + relative layout);
  `11206:46087` has no legacy twin.
- **Step 4 done (re-bind + level checker H5):** shared data `lvl` = checker / re-binder: pairs every visible text (same characters, nearest
  centre ≤ 64 px) and icon instance (centre ≤ 10 px, similar size) of a rebrand frame with its legacy twin; want = map(legacy paint) via
  `rm2` (local *and* remote legacy variable names) or `rawStep`; have = the rebrand binding. Guard: never binds a colour with contrast < 1.4:1
  against the node's actual background (logged "blocked"). Exemptions (shared data `lvlExempt`): BB primary label navy on green-600;
  decision 22 filled icons; decision 13 PhoneField texts; decision 21 tooltip close icon; navy surfaces keep inverse content (8 / 16);
  strong containers whose shape fix is pending (A3 Best, A12 selected term chips, A33 badges, "Recommend"); date-wheel duplicate texts;
  bank logo art; "Save QR Code" (button variant differs, review).
  - Frames: 175 pairs, 3 838 texts / 710 icons paired; **848 fills re-bound** (350 + 350 + 148); verification re-run: **0 unclassified**,
    173 exempt, 14 blocked, 56 mixed-fill texts not touched.
  - Components: `compPairs` (130 variants ↔ legacy mains from `sources`; 3 binned CreditCard variants skipped): **65 defaults re-bound**,
    re-check 0 residual (28 exempt).
  - Blocked by the guard (left as they were, need a decision): field labels that legacy draws in blue-500 (Typing focus labels "ID number",
    "Total monthly income", "Phone Number"…) → step rule gives green-500 #72EB94, 1.4:1 on the page / 1.5:1 on white; ContactMethod "SMS"
    label + icon (green-500 on page); "Uploading" (green-500); PlaceTab "City / Province / Region" (green-600 on the green-500 selected tab,
    decision 30); light tooltip "Icon / Pending" (white on glass, decision 35); dark tooltip text (decision 6).
  - Visual spot check: Coupons / To use `11273:23987` → `parity/figma/step-rule-coupons-11273-23987.png`.
- **Localised:** 2 bindings to the original file's published `Color/Text/Disabled` / `Color/Stroke/Default` (keys of OBsvf local variables)
  re-pointed to content-disabled / border-default (`11134:17469`, `11133:5407`), plus 2 legacy-source instances on the Look parity sheet
  (`I11311:22572;…`, `I11313:9321;…`, same colour). Rebranding pages: **0 remote references outside the allowlist**. New checker rule:
  shared data `remoteAllow` (16 component / 15 variable / 2 style keys of external kits, plus the forbidden OBsvf keys) + `remoteCheck`,
  hooked into `check` ("remote not allowlisted"). Left on the legacy page (not ours to edit): legacy main `10842:29527` (coupon picker
  "Unavailable") binds the original's library `Color/Text/Disabled`.
- **Next (after coordinator review):** step 5 (A33–A36, G1 / G2, remaining A items), step 6 page pass, step 7 Look parity sheet + PNG.

### 2026-11-20 · 28 · Rebrand copy `5SiSMQZXSrS7MHGHuw3grP`: read-only check (BLOCKED, nothing written)
- Owner: no more edits to `OBsvf42AiRapcRrasD7KNm`; rebrand work moves to the owner's duplicate `5SiSMQZXSrS7MHGHuw3grP`
  ("PeraSure design system rebranded"). Nothing was written to either file in this session.
- Read-only check of the copy:
  - **present:** legacy pages (Design `3259:657`, Component `3384:681`, Icon `7171:22576`, Branding `10972:32412`, …, same ids as the
    original); "Legacy · Primitive / Semantic / Component" (157 / 276 / 18 vars, mode Legacy only); text styles (31 Legacy/… + 21 v2,
    Hanken Grotesk); effect styles (8 Legacy/… + Elevation/1–3, Blur/Glass); every shared plugin data key on root
    (`perasure.rebrand`: kit 45 KB, map, rm, rmNew, check, sources, lookRows, allLegacyFrames, rules, …).
  - **missing:** pages "Component - Rebranding" (`10982:15`) and "Design - Rebranding" (`10977:32417`), so the 176 frames, the library
    components and the Look parity section `11311:21425` are not in the copy; the v2 collections Primitive / Semantic / Component are
    gone (Semantic `VariableCollectionId:10999:16` resolves by id but is not listed and holds 0 variables; `Border/Focused`
    `VariableID:10999:154` resolves as an orphan). The v2 text styles still bind lineHeight / fontFamily / fontSize to variables that
    no longer exist.
- Reported to the coordinator; waiting before any write. Old → new id map not written yet (the ids that exist are unchanged).

- **Re-check after the owner's paste (2026-11-20):** still BLOCKED, nothing written.
  - The page list is unchanged: no "Component - Rebranding" / "Design - Rebranding" in `5SiSMQZXSrS7MHGHuw3grP`, and no new collections.
  - Switching to the Branding page (read-only) failed with "you don't have edit access to this file". `whoami`: the Figma MCP account
    has a **View** seat on "葛小川's team" (starter) and a Full seat on "KN's team" (pro). So the copy may sit in the starter team, where
    this account can't edit, and the paste may have gone to a file or account the MCP doesn't see.
  - Reported to the coordinator.

### 2026-11-20 · 27 · Look parity round (IN PROGRESS)
- **Sync ran in OBsvf42 (design system file) by mistake; undo pending owner.**
- **Stopped (coordinator):** OrderAmountCard (owner chose option a, slider card; nothing was built), the final pass of entry 26.
- **Brief:** BRIEF "⚠️ Look parity": only colours change; every legacy look must exist as a library variant; every page pixel-aligned with
  legacy (x / y / w / h ±0.5), exceptions per page = colour / decision N / Hanken glyph / normalisation (`figma/NORMALISATIONS.md`).
- **Plan:** (1) inventory of legacy components used by the 175 legacy frames + their map targets; (2) sheet "Look parity" on Component -
  Rebranding, legacy instance | library instance per row, at the same size; (3) `figma/LOOK-AUDIT.md` (difference → allowed? → fix, done
  column per frame); (4) library fixes + map; (5) re-apply per section; (6) property checker (stroke, radius, height ±1, fill, grouping)
  + position diff; (7) export `parity/figma/look-parity.png`.
- **Done:** inventory (114 legacy sets in use; 148 component variants after excluding icons / system art). Sheet "Look parity" section
  `11311:21425` (Component - Rebranding): `Look parity / Legacy source` `11311:21426` (fresh legacy instances, shared data `lookRows`)
  and `Look parity / Rebrand` `11311:23552` (kit translation: job `{legacy:'11311:21426', section:'11311:21425', x:560, y:160}`, page
  `10982:15`). Reviewed at 1:1: 32 findings in `figma/LOOK-AUDIT.md` part A (A1–A32). Shared data `allLegacyFrames` = the 175 legacy
  frame ids.
- **Fixed so far:** A1 (kit `copyOverrides` keeps chevron direction; sheet re-test OK; rebrand column now `11312:34019`; repair pass on
  the screens found 0 affected). A15 map: legacy Check mar `5607:6085` → `Check` `10989:254` (check-circle); CouponOption Radio → Check.
  A6: new set **CouponPickCard** `11314:9986` (Selected `11314:9983`, Unavailable `11314:9984`, Default `11314:9985`) in 06 · Product
  cards, built by translating the legacy mains with their map entries removed (method below); map for 10840:29499 / 10840:29500 /
  10842:29685 → CouponPickCard. Temp frame `11313:9301` (legacy picker cards) kept for re-tests.
- **Method for "every legacy look exists as a variant":** put fresh legacy instances in a temp frame on the sheet, remove their map entries
  in a copy of the map, run the kit job (it translates them as drawn content: legacy geometry, v2 colours and text styles), restore the map
  (try / finally), turn the result into components and combine them, then point the map at the new variants.
- **General causes found (LOOK-AUDIT part G):** G1 text-style line heights differ from legacy (16/24 → 16/22); G2 hugging frames shrink
  with Hanken. Both need kit-level fixes before the page pass, or every page drifts.
- **New (coordinator, owner 2026-11-20): colour hierarchy = legacy hierarchy** (BRIEF "⚠️ Look parity" paragraph; LOOK-AUDIT part H,
  H1–H6). Legacy Brand text / icon (+ action-text-brand, raw brand blue) → `Content/Accent-strong` (green-800); navy `Content/Brand` only
  for BRIEF 22 filled icons, PlaceTab label, ActivityItem icons on green, Tag Strong text. Kit `RM` still holds the old map → regenerate
  from `tokens/v2/rename-map.json` (updated 18:15). Figma first; the demo is paused until the owner approves Figma. Nothing done yet.
- **H1 done (2026-11-20, after restart):** variables (Semantic mode default): Content/Accent-strong Green/800 → **Green/600**,
  Content/Link/Default 700 → 600, Content/Positive/Default 700 → 600, Bg/Positive/Strong 800 → 600, Content/Link/Pressed 800 → 700
  (Bg/Positive/Default touched by mistake and put back on Green/500). Kit `RM` (inside shared data `kit`) merged with the 265 colour entries
  of `tokens/v2/rename-map.json` (stored as shared data `rmNew`): 47 → 312 entries, 5 old values overridden; `Color/Text/Brand/Default` →
  content-accent-strong. Only new translations use it; existing screens still carry the old bindings.
- **Added (owner, 2026-11-20):** A33, small "New" / count badges (navy since entry 14) → Tag Accent Strong (green-500 fill, navy
  label, 40 × 20), starting from `11161:11636`.
- **Added (owner, 2026-11-20):** A34 ActivityItem `11157:4385` tile icons white (Content/Inverse), green tile included (BRIEF 28);
  A35 `.OtpBox` focus ring / caret → Border/Positive (green-500), Error red, rest legacy; + list components still on Border/Focused.
- **Added (owner, 2026-11-20):** H7, legacy brand-blue icons / outlines in components → Content/Accent-strong (ContactMethod `11086:2673`
  and siblings, `.MethodTabs` selected `11133:6114` icon); H3 / H5 must cover icons and strokes on every component and screen.
- **Added (owner, 2026-11-20):** A36, Slider `11063:2434` fill + knob → Bg/Positive/Default (green-500), all variants and inside
  OrderAmountCard / AmountCard; track and end labels unchanged.
- **Owner (2026-11-20, PhoneField `11018:750`):** all focus rings + carets green-500. **Done:** Semantic `Border/Focused`
  `VariableID:10999:154` Navy/900 → Palette/Green/500. Open: caret / ring sweep (A35). The "list Border/Focused users" request is dropped.
- **SUPERSEDES the case-by-case greens (owner, 2026-11-20): BRIEF "✅ Colour rule — step for step".** Legacy blue-50…900 → green-50…900
  step for step (blue-950 #000128 = navy); neutral / red / green keep their step; text keeps legacy neutral levels, white labels stay
  white; primary button = blue-600 → green-600 + white label; navy only for dark brand surfaces (home / hub / state cards, brand ground,
  brand icon tiles, scrim), never text / borders / controls; kept picks: 14 scrim, 16 periwinkle on navy, 18 scam strip mist, 28 navy-600
  repayment tile, 38 orange. tokens/v2 rebuilt (Bg/Action green-600, Content/On-action white, Border/Selected green-500, Surface/Brand/
  Subtle green-50, Content/Brand = neutral-900, Tag strong text = neutral-900; new Border/Accent/Faint · Subtle, Content/Accent-heavy,
  Surface/Positive/Subtle, Bg/Positive/Strong-pressed). My earlier alias edits (greens → 600, Border/Focused → green-500) are overwritten
  by this sync, as intended.
- **Green scale rebuilt around the Brand Bible green (owner, 2026-11-20; BRIEF step-rule section has a new paragraph):** Palette/Green
  50 #F6FEF7 · 100 #EAFDED · 200 #D1FBD9 · 300 #B0F6BF · 400 #8DF2A6 · 500 #72EB94 · **600 #5CD680** · 700 #44A05F · 800 #327545 ·
  900 #18572D · 950 #143A1F. Primary button: Bg/Action = green-600 #5CD680, Content/On-action = navy-900 (Brand Bible). Every other legacy
  blue step → the same green step. Values come from `tokens/v2/figma-tokens.json` (re-read it; do not type them by hand).
- **Status 2026-11-20 (late):** this session's context is exhausted; nothing of the sync below has been run. Start here in a fresh session.
- **Owner, direct (2026-11-20, later): "深绿色文字浅一个色阶" — green text one step lighter.** `tokens/v2/build.py`: `Content/Accent-strong`, `Content/Link/Default`, `Content/Positive/Default`, `Tag/Accent|Positive/Content/Default` green-800 → **green-700 #44A05F**; heavy / pressed (`Content/Accent-heavy`, `Content/Link/Pressed`, `Content/Positive/Strong`) green-900 → **green-800**; build re-run (656 vars, 0 dangling). **Resume step 2 done (colours):** Figma Primitive / Semantic / Component colour variables synced from `tokens/v2/figma-tokens.json` — 247 colours, 36 values changed (rebuilt green scale; primary = green-600 + navy label), 5 created (Content/Accent-heavy, Surface/Positive/Subtle, Bg/Positive/Strong-pressed, Border/Accent/Faint · Subtle), `Alpha/Periwinkle/24` renamed `Palette/Alpha/Periwinkle/24`, 113 scope / WEB syntax fixes (primitives hidden, scopes []). Number / type tokens not touched. BRIEF still says green-800 for text: coordinator to update. Next: resume step 3 (kit RM).
- **Resume point (new H1 = "apply the step rule everywhere"):** (1) read BRIEF "✅ Colour rule — step for step"; (2) sync Figma variables
  from `tokens/v2/figma-tokens.json` (values, aliases, new variables; scopes + WEB syntax); (3) regenerate kit `RM` from
  `tokens/v2/rename-map.json` (replace, don't merge; shared data `rmNew`); (4) kit translator rule: every legacy paint (variable or raw) →
  its legacy scale step → same step here, bound to the v2 variable with that value and role; exceptions = brand surfaces + kept picks;
  (5) re-bind pass on all 176 frames + library components (H2 / H3 / H7) with checker rule H5 (role = map(legacy role), 0 mismatches);
  (6) re-check A33–A36 against the step rule (badges, ActivityItem icons, focus / carets, slider: take the legacy blue step in green unless
  an owner pick says otherwise); (7) then G1 / G2, the remaining A-items, part B pages.
- **Old resume point:** A33–A36 (small, component-level) → H3 + H2 re-bind pass on all 176 frames (for each text / icon with a legacy twin, found the way the checker pairs nodes:
  bind fill to the variable whose WEB name = RM[legacy token]; raw brand blue → Content/Accent-strong; exempt H4 list) with H5 as its
  checker rule → G1 + G2 in the kit → re-apply A6 / A15 on the Coupon center picker sheets and every frame with Check mar → A16, A2 / A3 /
  A10–A14 → A7 / A8 / A9 → A17–A22 → rest; re-test on the sheet (delete `11312:34019`, re-run the job); then part B page by page.
- **Old resume list (still valid for order):** A1 (kit chevron unrotate) → A6 (coupon picker → CouponOption) → A15 / A16 (selected states) → A2 / A3 / A10–A14
  (shapes) → A7 / A8 / A9 (tabs track, header pill, header veil) → A17–A22 → rest; re-test on the sheet; then part B page by page.

### 2026-11-20 · 26 · Final full pass of phase 1 (per-section summary)
Coordinator: OrderAmountCard on hold (option c) until the owner decides; the frames on `_bin/AmountCard` count as **pending owner decision**.

**What was run.** Checker on every non-bin frame of Design - Rebranding against its legacy frame (175 pairs; criterion as in the
earlier full passes: text missing / extra, ₱ texts, icons missing, issues incl. lint, unscaledGraphic, remote legacy instances, empty
texts). The one frame without a legacy twin (`11206:46087`, the second Select Date sheet) was linted (clean). Bin section not checked.

**Fixed during the pass**
- App download landing page `11263:17985`: the TopBar Help (headset) button showed; legacy has it at opacity 0 → hidden. The "Check your
  limit" button (under the "A trusted choice" card) showed; legacy has it at opacity 0 → opacity 0. Overlay 11.8 / 16.6 → **11.8 / 16.0**.
- Address search sheets `11163:18973`, `11163:20134`: the Search clear ✕ showed; legacy hides it → hidden (override; Search has no
  property for it). Overlays 76.0 / 75.0 and 66.1 / 67.2 (were 75.2 / 67.6; the rest is the known sheet-over-form difference).
- **Checker** (shared data `check`):
  - `unscaledGraphic` ignores hidden or 0 px strokes, and its "width unchanged" branch only fires when the child spills out of the
    instance. It had flagged the Payment logos (User Order `11109:5350`), the LoadCash logo (Home `11053:1776`) and a radio dot; all three
    render correctly.
  - Legacy `Cancel-Thick` 3081:690 at ≥ 12 px counts as `Icon / Close` (BRIEF 37 glass close). Before, Payment detail / penalties and
    Short link showed "Icon / Close missing". The 9 px Cancel-Thick inside legacy drawn field-clear buttons is not counted (v2 uses the
    Field's own clear icon).
- Not added: the "no `_bin/AmountCard` outside bin" rule. It belongs to the held OrderAmountCard swap and goes in with it.

**Per section** (frames = non-bin frames on Design - Rebranding; "accepted" = flags already accepted in earlier entries)

| Section | Id | Frames | Check | Accepted flags | Pending owner | Open phase-2 notes (main) |
|---|---|---|---|---|---|---|
| Register | 11051:15 | 5 | 5 clean | — | — | 22, 23, 29 |
| User home | 11052:211 | 1 | 1 clean | — | 1 (New user loan, `_bin/AmountCard`) | 8 |
| Home | 11053:846 | 14 | 14 clean | — | 4 (Loan detail ×3 `11055:1957`, `2141`, `2349`; popover `11055:2492`) | 1, 3, 4, 8, 9, 20 |
| User Order | 11109:5008 | 11 | 11 clean | — | 5 (Loan detail `11109:5153`; OTP ×4 `7308`, `7524`, `7745`, `7970`) | 3, 13, 14, 18, 20 |
| Payment | 11109:5009 | 14 | 13 clean | 1: "Online transfer" row below the sheet edge | — | 12, 13, 14, 17, 18, 19 |
| Account | 11155:9694 | 20 | 20 clean | — | — | 25, 26 |
| Application Details | 11163:11297 | 36 (35 paired + 1 sheet) | 31 clean + sheet lint clean | 4: 2 selfie artefacts (hidden check, black mask ellipse); "Calabarzon" below the sheet edge; 1 chevron below the edge (`11163:21186`) | — | 22, 23, 24, 27, 28, 32, 33, 34 |
| Onboarding | 11187:15612 | 4 | 4 clean | — | — | 30, 31 |
| 短链 · Short link | 11189:15908 | 6 | 5 clean | 1: "GCash" row below the sheet edge | — | 13, 14 |
| inbox-a | 11200:16448 | 7 | 3 clean | 4: tab label "Unread (3)" as one Chip label | — | 26 (toast) |
| 换绑卡流程 · Change bank card | 11203:17057 | 2 | 2 clean | — | — | 22 |
| FAQs | 11257:46356 | 7 | 7 clean | — | — | 5, 6 |
| Loan history | 11259:17665 | 5 | 5 clean | — | — | 17 |
| Miniapp loading | 11263:17952 | 1 | 1 clean | — | — | — |
| App download landing page | 11263:17984 | 1 | 1 clean (after the fixes above) | — | — | 31; **open: review quotes (below)** |
| Global fallback | 11263:18591 | 1 | 1 clean | — | — | — |
| Mobile phone change | 11263:18771 | 6 | 5 clean | 1: Login selfie artefact | — | 33 |
| Rating popover | 11263:19751 | 3 | 0 clean | 3: Home behind = live CreditCard Temporary=On (entry 22, BRIEF 39 check) | — | 8 |
| Order state | 11263:21265 | 4 | 3 clean | 1: Full states = live CreditCard (same) | — | 8, 35 |
| Coupon center | 11272:19793 | 28 | 21 clean | 7: chip label merges "To use 6" ×5, "Discount 2 / Limit Increase 1"; leftover legacy "Unavailable" | 6 (Loan detail 1–6) | 36, 37 |
| **Total** | | **176** | **153 / 175 clean + 1 lint clean** | **22** | **16** | |

- Not built (as agreed): Section 1 (owner: exploration), the empty "popover" section, every "- bin" section, Payso OFW, OFW BIN.
- **Pending owner decision: 16 frames, not 14.** The list in the approval itself adds up to 16: Coupon center Loan detail 1–6 (6), Home
  Loan detail ×3 + popover (4), User order Loan detail + 4 OTP sheets (5), User home New user loan (1). The 16 `_bin/AmountCard`
  instances: `11135:9766`, `11134:16579`, `16832`, `17068`, `17350`, `11136:22802`, `22964`, `23155`, `23350`, `23547`,
  `11273:32407`, `32659`, `32915`, `33271`, `33585`, `33892`.
- Phase-2 notes 36–37 are the two unnumbered Coupon center notes of entry 24: 36. the legacy picker card (white card, brand outline, Best on
  the right, orange strip) vs CouponTicket Selected; 37. legacy segmented tabs vs Chip tabs in the coupon centre. Notes 1–7, 9–11, 15, 16, 20,
  21, 26, 27, 29, 32 are library-wide; the table lists only the sections where each shows. Open coordinator questions from entry 09 (legacy
  drawn sheets vs library Sheet) still stand.

**Open (needs a decision)**
1. **OrderAmountCard** (entry 25): (a) as the demo, with slider / (b) without slider / (c) hold. 16 frames.
2. **App download landing page, review quotes** (`11263:18293`, `11263:18317`): the phone mockup is a 0.73× miniature. Legacy sets the quotes
   at 8.77 / 11.69 (= Body/sm × 0.731); the kit applied the 11 px minimum (Body/xs 11 / 14), so "Super convenient…" needs 5 lines in a 4-line
   box and runs into "John S.". Proposal: treat the mockup as art (BRIEF 32) and give its texts legacy metrics in Hanken Grotesk (unstyled,
   art-exempt in the type audit). Alternative: keep Body/xs and let the review cards grow (changes the mockup geometry).
3. **Loose frame** `PermissionCard` `11193:49210` on Design - Rebranding (−674 / 12264, outside every section): a leftover component copy.
   Remove or move to bin?

No commits, no pushes. Legacy pages and the shared Icon page untouched.

### 2026-11-20 · 25 · BRIEF 38–39 (38 done; OrderAmountCard on hold, option c)
- Entry 24 (Coupon center) approved.
- **BRIEF 38, orange countdown.** Primitive `Palette/Orange/50–950` created (`VariableID:11297:15`–`25`; 500 = #FF5E00, 700 = #B83F00;
  values from `tokens/v2/build.py`), hidden, scopes [], Web `var(--palette-orange-<n>)`. Semantic **`Content/Urgent`** `VariableID:11297:26`
  → Orange/700, scopes TEXT_FILL / SHAPE_FILL / STROKE_COLOR, Web `var(--content-urgent)`, described. Nothing named "warning".
  Bound: the "Expires in 23:59:59" text + its clock (3 strokes) on Coupons / To use, To use tooltip and Loan application / Coupon discount
  (12 paints); 0 raw #FF5E00 left on either Rebranding page (the library has no countdown text; it is a screen override). CouponTicket.md
  updated. Overlays re-shot: To use 13.9, tooltip 12.3, Coupon discount 19.8 (unchanged within 0.1).
- **Decision 3 (state cards keep their tile):** LoanStateCard already has its coloured status tile (BRIEF 22 was applied to list rows
  only); no change.
- **BRIEF 39, sheets over retired screens:** the 3 rating popovers and Order state / Full states already show the current home (CreditCard
  Temporary=On, the card Home / Full states uses; swapped in entry 21) — checked on screenshots, no change. Sheets still over the retired
  slider card (`_bin/AmountCard`): Coupon center Loan detail 3–6, Home / Loan detail popover `11055:2492`, User order / OTP ×4
  (`11109:7308`, `7524`, `7745`, `7970`). Pages themselves on it: Coupon center Loan detail 1–2, Home Loan detail ×3, User order Loan
  detail, User home New user loan.
- **BRIEF 39, Loan detail 3 / 4 / 5: waiting for the coordinator.** The current order page (Withdraw demo, `withdraw.js` loanScreen,
  confirm phase) is the same card without the slider: "Disbursement amount", amount + edit pencil, divider, Loan term "15 days / Term", term
  chips. The library has no component for it (AmountEntry is the keypad page's top half; `_bin/AmountCard` is the slider card). Question
  sent: build `OrderAmountCard` from the demo and use it on these frames.
- **Correction (before building):** the coordinator approved `OrderAmountCard` "without slider" for all 14 frames, but re-reading
  `withdraw.js` shows the confirm phase **does** show the slider (`mpSlider` / `mpRange`: slider + "₱500 / ₱50,000", range height 42; card
  246 tall = `_bin/AmountCard`). My earlier "without the slider" was wrong. Asked the coordinator to choose: (a) build it exactly as the demo
  (with slider, i.e. the retired style under a new name), (b) build it without the slider as briefed (the demo would have to drop it too),
  (c) leave the frames until the owner decides. Nothing built yet.

### 2026-11-20 · 24 · Coupon center (approved)
- Section **`11272:19793`** on Design - Rebranding, **28 frames** (21 screens + 7 small asset frames), pairs in plugin data `couponPairs`.
  Sizes equal legacy. Names `Coupon center / <Screen> / <State>` ("appliacaion" → application).
- **New components** (Component - Rebranding): `CouponOption` **`11273:4944`** (Kind=Percentage/Credit × State=Active/Default, legacy
  "percentage off" 10656:51539 / "credit increase" 10656:51695, legacy art kept); `CouponPayCard` **`11273:4945`** (legacy "Coupon primary
  card" 10926:29645, glass). Specs `CouponOption.md`, `CouponPayCard.md`.
- **CouponTicket `11046:2168`**: + `Meta icon` (BOOLEAN `11273:0`) + `Meta glyph` (INSTANCE_SWAP `11273:7`) for the legacy countdown clock /
  alert before the meta line; + **`Rule info`** (BOOLEAN `11289:7`, default off): rule text wrapped in `Row / Rule` with an Alert circle 12
  (rescaled) at its end, as legacy 10648:48733. Tickets whose rule is hidden also hide `Row / Rule` (5, picker), so their spacing is unchanged.
  CouponTicket.md updated. Slider Boost=On: legacy "Icon/ Coupon" 8885:28670 rescaled to 14 as the boost mark.
- **Maps**: legacy Coupon 10643:48597 → CouponTicket (Use / Used / Expired; Value, Label, Rule, Best, Meta, Meta icon only for clock /
  alert); picker "Installment" 10840:29499 → Selected, 10842:29685 → Pick, 10840:29500 → Unavailable (reason "Unavailable", alert hidden);
  coupon pill 10594:45571 → Chip Medium; `_bin/AmountCard` Coupon boost=On on Loan detail 2–6.
- **Fixes after the first pass**:
  - Tabs: the kit merged hidden counts into the chip label. Coupons ×5: "Used 6" / "Expired 6" → "Used" / "Expired" (legacy shows the count on
    To use only); Coupon discount: "Discount 2" / "Limit Increase 1" → no counts (legacy hides them). Loan application / Empty state keeps
    both counts (visible in legacy). Kit follow-up: skip hidden count texts when merging chip labels.
  - Coupons / Empty state: nav title "Coupons" hidden (hidden in legacy).
  - To use + tooltip, 3rd ticket: `Rule info` on, Meta icon off, rule one line with ellipsis (legacy).
  - "Expires in 23:59:59" (To use, tooltip, Coupon discount): legacy orange **#FF5E00** on text + clock kept as raw override, since v2 has
    no warning/orange content token (same as the legacy yellow in entry 21). **Owner question.**
  - **BRIEF 20 empty-state placement** (top = container top + max(24, round((H − block) × 0.4)), block = picture + text, 168):
    Coupons / Empty state, container 161–766 (below tabs → frame bottom): y 299 → **336**; Loan application / Empty state, container
    183–620 (below tabs → CouponPayCard): y 308 → **291**. (Overlay % rises as on the other BRIEF 20 frames, entry 21.)
  - Picker ticket heights forced to legacy (100 / 66 / 98).
- **BRIEF 8 (green coupon gradient)**: the home coupon cards on Full states 2coupon / 1coupon and the 5 small coupon frames (50% off ×3,
  +₱5,000) were translated legacy frames with raw blue stops (#20558D / #2C74BE / #74B2F5 / #C8DEFF). All 16 gradient fills rebound to
  `Coupon/Gradient/Top · Upper · Mid · Bottom` (Green 700 / 600 / 400 / 200); 0 raw blue left in the section. Kit follow-up: map these
  stops in the raw table so later sections get it automatically.
- **BRIEF 32**: coupon art (pink / green tickets with badges, CouponOption art) is the legacy vectors, untouched (checked on screenshots).
- **Checker**: clean except the accepted chip merge ("To use 6", "Discount 2 / Limit Increase 1" on Loan application / Empty state),
  the extra nav Chevron left (Icon-page twin), "Icon / Check" on the picker's Selected ticket (CouponTicket design) and the legacy residual
  "Unavailable" hidden under the pay card on Coupon discount.
- **Overlays** (`parity/figma/screens/`, unmatched %, legacy / new):

| Frame | Legacy | New | Note |
|---|---|---|---|
| Coupons / Empty state | 49.8 | 58.1 | BRIEF 20 placement (block moved 37 down); chip tabs; description fits one line in Hanken |
| Coupons / To use | 11.6 | 14.0 | chip tabs; Use button Secondary Small |
| Coupons / To use tooltip | 10.3 | 12.4 | same |
| Coupons / Used | 5.7 | 8.0 | |
| Coupons / Expired | 4.9 | 7.7 | |
| Login / Default | 12.5 | 13.0 | |
| Loan detail | 6.6 | 6.2 | |
| Loan detail 2 | 7.0 | 6.0 | |
| Loan detail 3 | 4.6 | 7.9 | `_bin/AmountCard` (retired) is the only design: owner question |
| Loan detail 4 | 4.6 | 7.8 | same |
| Loan detail 5 | 4.5 | 7.4 | same |
| Loan detail 6 | 4.9 | 4.3 | |
| Loan application / Empty state | 35.8 | 38.4 | BRIEF 20 placement (block moved 17 up) |
| Full states 2coupon | 5.0 | 4.0 | green coupon gradient |
| 50% off | 6.4 | 2.7 | |
| Full states 1coupon | 6.5 | 5.0 | |
| +₱5,000 | 5.2 | 1.6 | |
| 50% off 2 | 5.7 | 2.0 | |
| 50% off 3 | 5.5 | 1.9 | |
| Loan application / Coupon discount | 17.1 | 19.8 | picker tickets use CouponTicket Pick / Selected (navy bar, Best beside the value), as approved in round 06 |
| Repayment plan | 6.2 | 0.9 | |

  The 7 small asset frames (< 300 px) are not overlaid; the checker matches them.
- **Phase 2 notes**: legacy picker card (white card, brand outline, Best on the right, orange strip) vs CouponTicket Selected; legacy
  segmented tabs vs Chip tabs in the coupon centre.
- **Owner questions**: (1) orange countdown #FF5E00 — add a v2 warning content token or keep raw? (2) retired `_bin/AmountCard` is the only
  design for the coupon Loan detail frames — keep or replace?
- PNGs: CouponTicket, CouponOption, CouponPayCard, Slider.

### 2026-11-20 · 23 · BRIEF 34–37 (Button Plain, glass tooltip, rescale rule, legacy Close)
- **BRIEF 34, Button Plain.** Button `10987:225`: Variant=Plain ×9 (`11268:4645`–`11268:4693`; fill Surface/Default, no border, label
  Content/Primary; pressed Bg/Neutral/Default; disabled Bg/Disabled + Content/Disabled). Component-property bindings copied from Secondary
  (4 per variant; the entry-18 regression avoided). Log Out → Plain on Account / Login / Default `11161:11769`, Inbox / Login / Default
  `11200:19337` and the page behind Account / Logout confirmation `11160:12668` (the dialog's "Log out" stays Primary). Labels kept. Other
  lone secondaries keep the outline. Button.md + Button.png.
- **BRIEF 35, glass tooltip.** Tooltip Tone=Light ×18: bubble + arrow Surface/Glass/Default + Blur/Glass background blur, Elevation/3 kept;
  text / leading icon Content/Primary, close Content/Tertiary; Dark unchanged. Screens `11134:13704`, `11159:11801` inherit (no overrides).
  Tooltip.md + Tooltip.png.
- **BRIEF 36, scale graphics, don't resize.** Audit of 1 337 graphic instances whose size differs from their main (icons, Radio, Check,
  stars, logos, badges, illustrations) on both Rebranding pages: 17 were resized without scaling (inner dot / stroke unchanged): Radio
  State=On ×6 (ReasonRow 16 → 14 and its screen copies), status/check ×4, ID card ×4, Warning filled ×2, legacy check mark ×1. Fixed:
  own instances reset to the main size then `rescale()` (ReasonRow radios, ResultBadge status/check, UploadTile ID card, LoanStateCard
  status/check, Warning filled ×2); nested copies (cannot be rescaled in an instance) had their overrides reset so they inherit the rescaled
  child from the fixed parent (9). Radio: **rescaled to 14, no new Size variant** (14 is used only in ReasonRow). The reset undid one legacy
  check-mark swap on User order / Change withdrawal method ewallet; swapped back and recoloured. Shared Icon-page icons were already
  rescaled by the kit. **Kit:** graphic instances placed at a legacy size now use rescale (map path and instance path, helper `__isG`).
  **Checker:** new rule `unscaledGraphic`.
- **BRIEF 37, legacy Close.** New `.GlassButton Type=Close` **`11271:24010`**: 40 × 40 glass, legacy `Cancel-Thick` 3081:690 rescaled 36 →
  **14 × 14** at 13 / 13, Content/Primary. Every glass close moved to it, inner overrides reset: library 18 (7 components: Sheet, Popover,
  Search, sheet headers…), screens 29 (27 frames). Kit: legacy close buttons map to Type=Close. Spec `_GlassButton.md`, Sheet.md;
  PNGs: _GlassButton, Sheet, Popover, Tooltip, ReasonRow, ResultBadge, UploadTile, LoanStateCard.
- **Overlays re-shot for all 147 frames** (19 sections): no frame worse by more than 1 point, 2 better.

### 2026-11-20 · 22 · Batch: miniapp loading, App download landing page, global fallback, Mobile phone change, Rating popover, Order state
All built with the kit (BRIEF 1–33 incl. post-passes: unrotate, tint flag, structural names, Filled twins) via the stored `buildSection`
helper, then screen names, positional icon fixer, full check, overlays. Sizes equal legacy on all 17 frames.

| Section (new id) | Legacy frame → new frame · name | Overlay % (legacy / new) | Notes |
|---|---|---|---|
| Miniapp loading `11263:17952` | 8387:14080 → 11263:17953 · Miniapp loading / Open app loading / Default | 0.5 / 0.7 | clean |
| App download landing page `11263:17984` | 8389:14148 → 11263:17985 · App download landing page / Landing page / Default | 11.8 / 16.6 | laurels #C8E5DF / #75BDAF kept raw (art, BRIEF 32); page fill #F2F7F6 → Surface/Page/Default; 15 star instances named after their component |
| Global fallback `11263:18591` | 8414:22315 → 11263:18592 · Global fallback / Fallback / Default | 0.2 / 0.0 | clean |
| Mobile phone change `11263:18771` | 8655:27420 → 11263:18772 · Number entering · 8833:31439 → 11263:18880 · Old number entering · 8655:27434 → 11263:18984 · OTP · 8667:28313 → 11263:19402 · Keep your face within the oval · 8667:28329 → 11263:19462 · Make sure your face and eyes… · 8833:31280 → 11263:19542 · Login | 5.7/8.7 · 5.8/8.8 · 2.2/2.0 · 0.0/1.5 · 0.1/7.5 · 4.4/0.3 | camera screens got the on-dark glass buttons (kit rule); camera mask and selfie art raw (legacy art); "Login" = same checker artefact as the selfie screens (hidden check icon, black mask ellipse) |
| Rating popover `11263:19751` | 9336:17995 → 11263:19752 · Rating / Default · 9337:18620 → 11263:20277 · Feedback / Positive dumped · 9337:19180 → 11263:20755 · Rating / Negative | 26.3/34.9 · 26.9/38.4 · 28.8/34.1 | raw black-gradient scrim → library Scrim Gradient (BRIEF 19); card already Elevation/2; "paper" illustration pinks raw (art); legacy Cancel-Thick close kept (3 swaps); Home behind = live card (see below) |
| Order state `11263:21265` | 6104:11747 → 11263:21266 · Your loan application / Reviewing · 6572:21617 → 11263:21373 · Your loan application / Withdrawal method error · 6619:21945 → 11263:21504 · Loan history / Default · 9345:19818 → 11263:21612 · Full states / Default | 6.2/1.9 · 7.6/3.3 · 7.1/0.8 · 65.0/64.9 | new `LoanStateCard`; Full states = live card (see below) |

- **New library component `LoanStateCard`** `11263:25900` (06 · Product cards) from legacy `Loan state card` 6104:11953: State=Reviewing
  `11263:25895`, Reviewing 2 `11263:25896` (legacy "Variant5" is an exact duplicate of Reviewing — Phase 2 note 35), Failed `11263:25897`,
  Withdrawal method `11263:25898`, Disbursed `11263:25899`. Mapped, in `sources` / `ids2`.
- **Retired card in live states (question for the owner):** the Home shown behind the 3 rating popovers and "Order state / Full states"
  use the retired blue "Available amount / Total balance" CreditCard (bin, entry 17). The kit fell back to the retired `_bin/Off` variant and
  rendered it broken; I swapped these 4 cards to the only live variant, `CreditCard Temporary=On` (default content, 182 → 196 tall, content
  below shifts 14), and pointed the map's legacy Default at Temporary=On. If the owner wants these frames binned instead (like Home Full
  States in entry 17), it is one move.
- **Bug found and fixed (BRIEF 22 follow-up):** screen instances of the Filled twins inside Strip / Notice / PermissionCard / CreditLimitCard
  could keep a navy fill or white glyph override from the old tile (the "You have updates" row showed a black square). 4 overrides cleared,
  4 glyphs set to Content/Brand; kit post-pass now enforces it on every build.
- **Section 1** (10558:43004, frames "a" 10558:42287 and "b" 10558:42638, 360 × 1349): **real product screens**, not hero / background
  experiments. Both are Home with the temporary-credit card (Available amount ₱40,000, Total credit ₱50,000, Temporary ₱10,000, Withdraw),
  loan-state cards, a number tag and the next-payment row: an A / B pair of the Home temporary-credit state ("a" ends with the trust / legal
  block, "b" with Next payment + calendar). Home / temporary credit is already rebuilt (11053:1033). The hero / background experiments are
  the loose frames "b · 通用背景 1–4 / Hero 5–9B" next to it on the canvas, outside the section. Not built; waiting for your call.
- **Resume:** Coupon center (28 frames) as its own round.

### 2026-11-20 · 21 · Sections still to rebuild (Design-page order)
Done: Register, Account, Application Details, Payment, User Order, Onboarding, User home, 短链 · Short link, inbox-a, 换绑卡流程 · Change
bank card, Home. Skipped as agreed: every "- bin" section, Payso OFW, OFW BIN, loose frames / images on the canvas.

| # | Legacy section | Id | Frames | Status |
|---|---|---|---|---|
| 1 | FAQs | 5453:4712 | 7 | **done** `11257:46356` |
| 2 | Loan history | 5810:15500 | 5 | **done** `11259:17665` |
| 3 | miniapp loading | 8387:14079 | 1 | **done** `11263:17952` |
| 4 | App download landing page | 8389:14147 | 1 | **done** `11263:17984` |
| 5 | global fallback | 8414:22293 | 1 | **done** `11263:18591` |
| 6 | Mobile phone change | 8655:27419 | 6 | **done** `11263:18771` |
| 7 | popover | 8813:31002 | 0 (empty section) | nothing to build |
| 8 | Rating Popover | 9336:17994 | 3 | **done** `11263:19751` |
| 9 | Order state (link to history) | 9345:20146 | 4 | **done** `11263:21265` |
| 10 | Section 1 | 10558:43004 | 2 | **skipped (owner)** — exploration (Home temporary-credit A / B), not built |
| 11 | Coupon center | 10594:45373 | 28 | **done** (entry 24, `11272:19793`) |

**FAQs** `11257:46356` (7 frames; check 7 / 7 clean, sizes equal legacy)

| Legacy frame | New frame | Name | Overlay % (legacy / new) |
|---|---|---|---|
| 5453:4978 Account/FAQs/Index | 11257:46534 | FAQs / Index / Default | 0.7 / 0.3 |
| 5453:5042 Account/FAQs/Search-Active | 11257:46622 | FAQs / Search active / Default | 0.2 / 1.5 |
| 5453:4937 Account/FAQs/Sub | 11257:46357 | FAQs / Sub / Default | 0.1 / 0.1 |
| 5453:4947 Account/FAQs/Detail | 11257:46414 | FAQs / Detail / Default | 7.0 / 3.5 |
| 6149:12701 Account/FAQs/Detail/Form-1 | 11257:46501 | FAQs / Detail / Form 1 | 12.4 / 7.5 |
| 6150:12923 Account/FAQs/Detail/Form-2 | 11257:46704 | FAQs / Detail / Form 2 | 8.8 / 2.4 |
| 6150:12975 Account/FAQs/Detail/Form-3 | 11257:46470 | FAQs / Detail / Form 3 | 20.9 / 14.3 |

- Kit, before this section: legacy text styles Caption/sm → **Body/sm**, Caption/xs → **Body/xs**, Section-title/md-light → **Body/lg-strong**
  (BRIEF 33), and the size fallback (12 / 11 px regular → Body/sm / Body/xs).
- New maps: legacy `FAQs list` 6126:13352 → **LinkRow** Kind=Link, Last Off (Default) / On (Bottom), title in the v2 style of the legacy size
  and weight (16 → Body/lg) and link colour Content/Link/Default, row at the legacy height (first build had 14 px primary rows: Index 34 % →
  0.7 %); legacy `FAQS/feedback btn` 5453:5054 → **Chip** Medium Default / Selected ("Yes" / "No").
- The detail pages' residual % is the typeface: legacy body is Inter 14 / 20 at +2 % tracking, v2 is Hanken Grotesk Body/md 14 / 20, which
  sets narrower and rewraps the paragraphs. No layout difference.
- No icon stand-ins (positional fixer found none), no rotated icons, no default names, no remote legacy instances, no tint-on-page flags.

**Loan history** `11259:17665` (5 frames; check 5 / 5 clean, sizes equal legacy)

| Legacy frame | New frame | Name | Overlay % (legacy / new) |
|---|---|---|---|
| 5810:15501 Account/Loan History/Index | 11259:17666 | Loan history / Index / Default | 8.7 / 1.3 |
| 6220:13234 Account/Loan History/Index-Empty | 11259:17904 | Loan history / Index empty / Default | 51.8 / 50.2 (BRIEF 20 placement: block y 256 → 235) |
| 5813:15815 …/Loan Confirmation | 11259:18030 | Loan history / Loan confirmation / Default | 9.5 / 3.3 |
| 6217:22210 …/Loan Confirmation/Cancel my loan | 11259:18218 | Loan history / Loan confirmation / Cancel my loan | 9.6 / 4.1 |
| 7989:12776 …/Loan Confirmation/Loan contract | 11259:18404 | Loan history / Loan confirmation / Loan contract | 0.0 / 0.0 (document image) |

- **New library component `LoanHistoryItem`** `11259:22291` (Kind=History `11259:22289`, Kind=State `11259:22290`), built from legacy
  `Installment` 6619:22073 (a loan-history row, not the repayment Installment). Spec + `parity/figma/LoanHistoryItem.png`. Legacy
  Installment → LoanHistoryItem in the map; added to `sources` and `ids2`.
- New maps: legacy `State tag` 6619:22092 → Tag Medium (Reviewing → Navy Subtle, Disbursing → Accent Strong, Not approved / Paid off →
  Neutral Subtle, Action needed → Navy Strong); legacy `Term tag` 5813:15725 → Tag Small Navy Subtle.
- Index: legacy's first row has no tag; the new row's Tag is hidden to match.
- No icon stand-ins, no rotated icons, no default names, no remote legacy instances, no tint-on-page flags.

**Resume:** next sections in order: miniapp loading, App download landing page (both 1 frame), global fallback, Mobile phone change, Rating
Popover, Order state, Section 1, Coupon center.

### 2026-11-20 · 20 · BRIEF 33 — Body/sm + Body/xs applied
- **New text styles** (21 in all): `Body/sm` **`S:5dfe4a5e22ec539b4233ac12837a0e15c76dad45`** 12 / 16 Regular 400, tracking 0, and
  `Body/xs` **`S:d1fa8b919f0b4884ea0c52df90e83830142af2b2`** 11 / 14 Regular 400, tracking 0; both bound like Body/md (Font/Family/Body,
  size and line variables shared with Caption/sm / Caption/xs: Font/Size/caption-sm · caption-xs, Font/Line-height/Caption/sm · xs).
  Descriptions carry the rule (Body/sm hints and helper sentences; Body/xs legal / consent only).
- **Re-pointed** (legacy match by content on the 119 frame pairs; instance texts changed in their main): legacy 12 / 400 → `Body/sm` 76,
  legacy 11 / 400 → `Body/xs` 33, legacy Section-title/md-light on Title/xs → `Body/lg-strong` 9 (date picker title and month / year).
- **Unstyled bound:** 32 main / own nodes (= the 179 instance-level texts): `.MethodTabs` labels → Caption/sm (10 mains, 135 uses),
  ScamTips "*" → Title/lg (5 mains, 13 uses), date wheel selected → Title/lg (2) / near numbers → Title/md (6) / outer 16 px numbers →
  Body/lg-strong (6, keeps the legacy 16 px; Title/md would have changed their size), PaymentCard amount → Amount/md (1), Loan detail "999" →
  Display/md (1), BottomBar consent → Body/sm (1). Then 101 instance texts whose override had cleared the main's style (Field labels, "ID
  TYPE" …) were reset to their main's style (Caption/sm). Left unstyled: system art only (Status bar, Keyboard), doc boards, and 4 texts
  in retired "_bin/" CreditCard variants.
- File name stays Label/sm.
- Audit after: 4 827 segments, 0 overrides, 0 Legacy styles, 0 real unstyled; Body/sm 78 segments, Body/xs 33.
- **Regression caught and fixed:** applying the style dropped the uppercase case override on 12 Field labels in Check the details / Basic
  info ×2 ("HOUSE NO. / STREET / BARANGAY" read "House no. …"); text case restored from the legacy counterparts.
- **Full check (120):** sizes 120 / 120; flags = the accepted ones only (2 selfie, 3 rows below the sheet edge + 1 chevron, inbox "Unread (3)");
  1 default name found and renamed (`Frame 67` → `List` in 11053:847).
- **Overlays re-shot (119):** unchanged within ±0.5 % on 105 frames; ID type popover 69 → 3.4 % (fix from entry 19); Check the details back to
  11.9 / 7.3 after the case fix; small rises where hint lines go back to the legacy regular weight (Basic info 19.2 / 14.0, Basic info 2
  31.3 / 22.8, Check the details 2 etc. — edge shifts of the lighter weight against the previous 500 render, both match legacy weight now).
  BottomBar.png re-exported (its consent line is Body/sm; no other component changed visibly).

### 2026-11-20 · 19 · BRIEF 32, 28, file name, 29, 30, 31, 22, 23, overlays, type audit done
- **Chevrons, exact legacy glyphs.** Legacy draws ‹ › and up / down with the shared `Icon / Chevron right` 3664:1110 (rotated); only back
  buttons use `nav/chevron-left`. So:
  - `Icon / Chevron up` `11210:62557` / `Icon / Chevron down` `11210:62561` now carry 3664:1110's own vector (stroke 2.68, round caps,
    36 grid), turned with the geometry baked (they had been drawn from the back glyph); ids kept, so every instance updated.
  - New `Icon / Chevron left (line)` **`11226:4563`**: 3664:1110 pointing left, geometry baked; it pairs with ›. Swapped into the 8 date
    picker ‹ (`11186:20974`, `20982`, `21501`, `21509`, `22044`, `22052`, `11206:46096`, `46100`). Each ‹ › pair now matches legacy.
  - `Icon / Chevron left` `11210:62555` (legacy nav/chevron-left copy) stays for back buttons only. Kit post-pass: rotated 180 → line.
- **Library mains vs legacy sources** (positional fixer `iconfix`, ≤ 4 px; swaps to the legacy main or copies legacy art 1:1; colour from
  the stand-in's token, else legacy colour mapped by `recolour`: legacy var → v2 via RM, raw via the raw table, raw black → Content/Primary):
  ResultBadge Success `11165:4375` Icon / Check → legacy `status/check`; Failed `11165:4383` Icon / Close → `Cancel-Thick`; InboxItem
  ×4 (`11180:54346`, `54367`, `54388`, `54415`) Icon / Inbox → the legacy notification icon component. Other library differences were
  the up / down chevrons (now legacy glyph) or places where legacy drew no icon.
- **Screens** (123 pairs): 34 icons swapped to the legacy main in 27 frames — Home 2, Register 1, User Order 6, Application Details 11,
  Payment 6, Account 3, Short link 1. Kinds: Icon / Close → Cancel-Thick ×22, Icon / Check → check mark ×3, Icon / Close → Cancel small
  ×2, Icon / Check → status/check ×1, Icon / Check → legacy check variant ×1, Icon / Chevron right → Cancel small ×1 (legacy shows the
  clear icon there). Skipped 16: icons inside the legacy notification component (already legacy) ×10, payment logos (art, mapped to the
  library logo earlier) ×6. Plus entry 18: Star 5 ×30, Warning filled ×2, More ×2.
- **Remote legacy instances → library** (map entries added: Typing box set `5803:14074` → Field (state logic of the local Typing box);
  Select bar `5772:13613` → SelectBar; ID LIST `5772:13664` → ListItem (Title, Tag, Divider); Icon Container `6126:13697` (round consent
  check) → Check Small On / Off; inbox filter tab `8620:34465` → Chip Medium Selected / Default, label "Unread (3)"). Replaced in place by
  translating the legacy container with the kit and swapping it in (23 containers, 23 frames): bank search + Withdrawal Methods
  Search-Active / Empty (form `Frame 288`, 16 Fields each), Marital Status popover ×4 (SelectBar / ListItem), New user loan, Loan Detail ×3,
  OTP ×3, Code Incorrect (consent Check), inbox Unread / Read / All Caught Up / No Read (Chip tabs). Fields whose legacy box is the
  "Empty" look show the placeholder, not an error (Message off ×6). Legacy copy kept: "Job type" placeholder reads "Please enter your
  phone number" in legacy too (Phase 2 note 34). 0 remote legacy instances left except art (Status bar, Keyboard, ID card) and small
  legacy icons (kept per BRIEF 32, recoloured).
- **Legacy colours left:** 921 legacy-bound paints were found; 904 are in Status bar / system Keyboard (system art, unchanged). The other
  17 (legacy icons swapped in: More, Search close, Tooltip, PlaceRow, SelectBar, edit icon) mapped to v2 by `recolour` (37 hosts on both
  pages; 2 paints without a mapping).
- **Kit:** the 7 icon stand-in map entries are gone (Cancel small / Cancel-Thick → Icon / Close, More → More horizontal, status/check and
  check mark → Icon / Check, Warning filled → Alert circle, NOTIFICATION → Icon / Inbox); those legacy icons (`keepIcons`, + nav/chevron-left)
  are now instanced like Icon-page icons and only recoloured; remote clones are recoloured to v2 (except Status bar / Keyboard / ID card);
  the Top nav btn → GlassButton mapping passes the legacy icon into the Icon slot instead of Icon / Close. Smoke-tested on 5908:11000.
  One other entry (3439:3312) still hard-codes Icon / Close as a fallback (only when legacy has no icon).
- **Checker rules added:** `iconNotLegacy` (dry-run of the positional icon fixer: every icon instance equals the legacy icon at the same
  place; icons inside legacy components and library payment logos are exempt) and `remote legacy instance` (none on the Rebranding pages
  except Status bar / Keyboard / ID card and small legacy icons).
- **Full check (120 non-bin frames):** sizes 120 / 120. Flags: the 2 known selfie artefacts; rows below the sheet edge from the BRIEF 19
  gap (Calabarzon, Online transfer, GCash, 1 chevron in 11163:21186); inbox "Unread" + "(3)" now one Chip label "Unread (3)". BRIEF 32 done.
- **BRIEF 28, activity tiles.** New Semantic `Bg/Brand/Muted` **`VariableID:11235:5231`** → Palette/Navy/600 #304C8C, scopes FRAME_FILL +
  SHAPE_FILL, Web `var(--bg-brand-muted)`. ActivityItem `11157:4385`: Kind=Loan tile `Frame 254` → Bg/Positive/Default (green-500) with
  navy icon (Content/Brand/Default); Kind=Repayment tile `Frame 253` → Bg/Brand/Muted with white icon (Content/Inverse). Amount colours
  unchanged. The 5 instances on `11159:11900` follow the main (no overrides).
- **UploadTile file name → Label/sm** (12/16 600, was Caption/sm 12 500): `.FileRow` `11166:4449`, `4475`, `4517`; UploadTile `11166:4544`,
  `4570`, `4605`; screen override `I11186:23275;11166:4544`. The type audit decides the final style.
- **BRIEF 29, upload progress dark green.** New Semantic `Bg/Positive/Strong` **`VariableID:11235:24021`** → Palette/Green/800, scopes
  FRAME_FILL + SHAPE_FILL + STROKE_COLOR, Web `var(--bg-positive-strong)`. Progress bar fill → Bg/Positive/Strong in `.FileRow`
  State=Uploading `11166:4482` and UploadTile `11166:4577` (DocCard uses .FileRow, follows); tracks unchanged (Surface/Sunken). "Uploaded"
  status + check → Content/Accent-strong (`.FileRow` `11166:4457` / `4455`, UploadTile `11166:4552` / `4550`). Selfie upload ring
  (Take A Selfie-Uploading `11163:16413`): dashed ring `11168:21872` → Bg/Positive/Strong; upload icon + "Uploading" label
  `11168:21880` → Content/Accent-strong. Neutral statuses ("Uploading" in file rows, "Compressing…") stay grey; errors stay red.
- **BRIEF 30, PlaceTab.** State=Active `11166:4418`: fill Bg/Positive/Default (it had none), label Content/Brand/Strong (navy). Default and
  Picked unchanged; the 2 screen instances follow.
- **BRIEF 31, search matches.** Matched characters → Content/Accent-strong, same weight: PlaceRow (3 text nodes in the main; all Address
  Popover result screens inherit), bank search rows on Withdrawal Methods/Online Bank/Search-Active (3), payment-method search
  Payment/Methods/Popover-Search-Active (query "GC" in 16 "GCash" rows, range fill), e-mail suggestions (.MenuRow Kind=Email Default /
  Pressed: the typed part `11165:4397` / `11165:4400`). The rest of each row stays Content/Primary.
- **BRIEF 22, icon tiles removed, Filled icons.** New Filled twins in 07 · Icons (same 36 grid as the outlined icon; silhouette made solid,
  inner details knocked out at the outline width; colour Content/Primary, rows override Content/Brand). **Ids for the demo:**
  `Icon / Camera / Filled` 11238:4570 · `Icon / Smartphone / Filled` 11238:4584 · `Icon / App / Filled` 11238:4595 · `Icon / Location /
  Filled` 11238:4610 · `Icon / Notification / Filled` 11238:4615 · `Icon / Message / Filled` 11238:4620 · `Icon / Heart / Filled` 11238:4632 ·
  `Icon / Wallet / Filled` 11238:4637 · `Icon / Info circle / Filled` 11238:4648 · `Icon / Support chat / Filled` 11238:4663. (The icon set
  already had Check circle / Filled and Close circle / Filled.) Sheet "Filled icons" `11241:21197` (outlined | filled at 24 and 48) →
  `parity/figma/filled-icons.png`.
  - Tiles removed (icon 24, Filled, Content/Brand/Default, gap 12): PermissionCard Open=Off / On, CreditLimitCard Default / Masked, Strip,
    Notice; screens: "A friendly reminder" row `11193:49213` (Heart), Account/Login wallet row `11200:19191`. Permission screen rows
    (Camera, Device information, App list, Location, Notification, SMS, Heart) swapped to the Filled twins (6 instance swaps + the main).
    ActivityItem tiles stay (BRIEF 28). Specs PermissionCard, CreditLimitCard, Strip, Notice noted.
- **BRIEF 23, structural names.** Renamer (`renamer` plugin data) derives roles from structure: Divider (lines / hairlines), Background
  (full-size shape), Media (image / large shape), Glow (radial gradient), Icon (≤ 32 or a 48 tile with one instance), Spacer (empty),
  Actions (only buttons), Header (back button near the top), Card (filled + radius ≥ 8, ≥ 120 wide), Text / Label (text-only groups),
  Row (horizontal), List (≥ 3 equal-width children) / Content (vertical), Group (else); Title / Label for default-named texts. Siblings
  with the same role are qualified by their first text (`Row / Used`), else by index; sibling instances sharing a name are qualified by
  label (`Button / Withdraw`); default-named instances take their component name. Illustration and logo internals (art names, shape-only
  groups) stay as drawn.
  - Counts (layers renamed + sibling instances qualified): library 01 Actions 0 + 26, 02 Feedback 138 + 8, 03 Inputs 46 + 21, 04 Lists
    110 + 12, 05 Structure 6 + 2, 06 Product cards 379 + 10, 07 Icons 12; screens Register 41 + 10, User home 5, Home 88 + 3, User Order
    160 + 58, Payment 90 + 72, Account 295 + 44, Application Details 363 + 243, Onboarding 139, Short link 64 + 13, Inbox 63 + 8, Change bank
    card 15; second pass (tightened rules) 86 screens + 20 library. Default names left: **0** on every non-bin section and in the library
    (bin = retired frames, untouched).
  - Screens: `<Section> / <Screen> / <State>` in sentence case, built from the legacy frame name (leading flow names that are not the
    section dropped, repeated parts collapsed, typos fixed: "Appliacaion" → application; acronyms kept: OTP, ID, SMS, QR, SEC, BIR, GCash;
    PeraSure). Default / Chinese legacy names use the screen heading; real duplicates take the heading as state when distinct, else " 2", " 3".
    Samples: `Home/Loan Appliacaion/Loan Detail` → `Home / Loan application / Loan detail`; `Permission` → `Register / Permission / Default`;
    `Account/Credit Limit Hub/Credit History/Borrowing Activity/Empty` → `Account / Borrowing activity / Empty`; `拍照` → `Change bank card /
    Confirm your identity / Keep your face within the oval`; Marital Status popover ×4 → `Application details / Marital status popover /
    Marital status · Payroll period · Gender · ID type`.
  - Component sample (InboxItem): `Frame 1940698976` → `Card`, `Frame 1940698951` → `Content / System notifications`, `Frame 1940698952` →
    `Content / View more`, `Frame 1940698945` → `Row`, `Line 22` → `Divider`, `Frame 1940698947` → `Text`. Screen sample (Select Date):
    `Frame 1940698759` → `Group / Month and year`, `Frame 1940698761` → `Month`, sheet top → `Header`, wheel → `Wheel`, buttons → `Actions`.
  - Overrides survive: the full check after renaming shows no text or override loss (texts identical on all 120 frames).
  - Translator: post-pass runs the renamer on every built frame. Checker: `defaultNames` and `rotatedIcons` rules (via `lint`, art exempt);
    Filled twins count as their outlined legacy icon in the icon rules.
- **Full check (120 non-bin frames) after BRIEF 22–32:** sizes 120 / 120; default names 0; rotated icons 0; remote legacy instances 0 (art
  and small legacy icons exempt). Remaining flags, all accepted: 2 selfie artefacts; rows below the sheet edge (Calabarzon, Online transfer,
  GCash, 1 chevron in 11163:21186); inbox tab label "Unread (3)" as one Chip label.

- **Filled icons sheet fixed** (coordinator review): rebuilt as `11246:4604` (old `11241:21197` removed). Every row shows outlined | filled
  at 24 and at 48; the outlined icons are now scaled with rescale (they had been resized, which broke App and Support chat at 24), and
  Wallet / Info circle got their source link back. Eye check: each Filled twin keeps its outlined silhouette (Camera lens, Smartphone
  speaker, App 3 squares + ×, Location dot, Message lines, Wallet clasp, Info "i", Support chat dots knocked out). No twin changed; ids
  unchanged. `parity/figma/filled-icons.png` re-exported.

- **Overlays re-shot for all 119 non-bin frames** (section screenshots at 1:1, frames cropped; legacy panel reused from the previous
  composites; `parity/figma/screens/`). Unmatched-edge share (max of legacy / new): < 5 % 38 frames, 5–10 % 31, 10–20 % 22, 20–40 % 4,
  > 40 % 24. Every frame ≥ 20 % was eye-checked; all come from owner decisions in entries 18–19, not defects:
  - BRIEF 19 (gradient scrim + 12 px header gap shifts the whole sheet content): Address Region / City / Search result / Search multi
    (66–78 %), Bank search / active / empty (44–74 %), Methods popover / search active / empty (41–65 %), Short link detail popover and repay
    methods (62–78 %), Payment Index detail / penalties (49 %);
  - BRIEF 20 (empty-state placement): Inbox Empty / All caught up / No read (48–70 %), Payment Empty (44 %), Borrowing / Credit adjustment
    Empty (42–46 %);
  - BRIEF 22 (icon tiles removed, labels move left): Permission (36–42 %); BRIEF 25 (equal month / year controls): Select date ×3 (17–33 %);
    Onboarding fragments 1 / 2 are 28-px chips where any shift reads large (28–50 %).
  - Fixed while reviewing: Application details / Marital status popover / ID type `11163:17566` — the ListItem rows were indented 32 (container
    16 + row 16) and set 14 / 20 medium; now the list spans the sheet (text at 16), titles Body/lg (16 / 24, legacy size), content moved
    11 up, frame height held at the legacy 498: 69 % → 1.3 / 3.4 %.

- **Component PNGs re-exported** (18): PermissionCard, CreditLimitCard, Strip, Notice, ActivityItem, UploadTile, _FileRow, DocCard, PlaceTab,
  PlaceRow, _MenuRow, ResultBadge, InboxItem, Accordion, TrustCard, StateCard, ListItem, MethodPicker.
- **Type audit** → `rebrand/tokens/TYPE-GAPS.md` (no style changed): 4 827 text segments; 0 overrides, 0 Legacy styles; 407 unstyled (228
  system art; 179 have an exact v2 style, binding missing); 146 texts differ from legacy beyond the approved merges. Real gaps: legacy 12/400
  → Caption/sm 500 (76) and legacy 11/400 legal → Caption/xs 500 (33). Proposal: add `Body/sm` 12/16 400 (79 uses, restores
  Legacy/Caption/sm) and `Body/xs` 11/14 400 (33 uses, legal only, restores Legacy/Caption/xs); minimal alternative = Body/sm only. Mapping
  errors to fix with no decision: 9 Section-title/md-light texts on Title/xs (should be Body/lg-strong), unstyled wheel / tabs / amounts.
  Turn ended for the coordinator to take it to the owner.

### 2026-11-20 · 18 · BRIEF 26, 16, 18, 19, 20, 21, 24, 25 done; 22 and 23 next
- **BRIEF 16 addition, StateCard timer row:** the component row `11133:5113` (296 Fill × 32 Hug, Status=Documents, the only variant with
  the timer) already had Bg/On-brand at radius 999 (Radius/full). The one screen that shows it, `11053:2212` Home/Add documents, had a
  raw navy 30 % override on the row (`I11134:16100;11133:5113`); now bound to Bg/On-brand.
- **BRIEF 26, new icons** (section "07 · Icons" `11210:62554` on Component - Rebranding; the shared Icon page is not edited):
  - `Icon / Chevron left` **`11210:62555`**: exact copy of legacy `nav/chevron-left` (3416:907 via I5588:5273;3416:935): 18 × 18,
    filled vector 7.93 × 14 at (4.36, 2), same path data, fill Content/Primary.
  - `Icon / Chevron up` **`11210:62557`** and `Icon / Chevron down` **`11210:62561`**: the same glyph with the turn baked into the
    geometry (rotation 0). Needed because the library also used Chevron right turned ±90 for accordion / select arrows.
- **Swapped (colour kept: the old stroke colour moves to the new fill, same token):**
  - Library mains (7): .GlassButton Type=Back `11036:1181` → left (covers TopBar Back and every glass back button); Accordion /
    expandable arrows `11133:5343` / `11133:5717` / `11166:4804` → down, `11133:5355` / `11133:5724` / `11166:4643` → up. 15 nested
    library copies recoloured.
  - Design - Rebranding: 9 own stand-ins swapped (date picker ‹ `11206:46096` / `46100`, sheet backs `11186:20974`, `20982`, `21501`,
    `21509`, `22044`, `22052`, up arrow `11193:49217`); 109 nested back chevrons recoloured. 84 frames touched: Register 3, User home 1,
    Home 5, User Order 11, Payment 8, Account 17, Application Details 29, Short link 1, inbox-a 6, Change bank card 2, 11193:49210 1.
    Colours carried: Content/Primary 93, Content/Tertiary 11, Border/Brand-strong 8, Content/Inverse 6.
  - Rotated icon instances left: 0 on both Rebranding pages.
- **Kit:** post-pass after every job unrotates any rotated Chevron right in the built frames (helpers `unrot` / `unrotRec`); tested on
  `11203:17105`. **Lint** (`lint` plugin data): rotated or mirrored icon instances = 0 rule; it also counts default names for BRIEF 23
  (library today: 699).
- **Open:** the date picker pairs the filled legacy ‹ with the thinner stroked v2 › (`Icon / Chevron right` 3664:1110). Question
  sent in the report: copy the legacy chevron-right too, so every pair matches?
- Overlays for the 84 frames not re-exported (icon-only change); they will be re-shot with the BRIEF 16–25 round.
- **BRIEF 16 audit (general rule).** Navy surfaces found: library 14 hosts (CreditCard, StateCard, HubCard, QrPanel, RepayCard,
  PaymentCard, .PaymentNotice and their "· states" sheets); Design - Rebranding 15 card instances + the Opening splash (logo only).
  - Library: already compliant from the entry-16 round (Bg/On-brand ×25 fills, Border/On-brand ×11 strokes; HubCard Withdraw `Button
    Navy` and ring track `Ellipse 114` are Bg/On-brand; StateCard timer row Bg/On-brand). Left as they are: icon internals, glow
    ellipses, Content/Inverse (ring fill, text), green actions. CreditLimitCard is a white card (no navy surface); its navy icon tile is
    BRIEF 22.
  - Screens: 10 rebinds, all old overrides (raw navy 30 % = the retired --ps-on-navy, raw white 20 %):
    - CreditCard on Home/Full States (×2) and Home/Valid Date: slider track `Frame 1940699330` 304×8 and legend dot `Ellipse 771`
      → Bg/On-brand (6);
    - StateCard on Home/Credit On Hold and Home/Credit Disapproved: divider `Line 24` → Border/On-brand, expand pill
      `Expandable Container` → Bg/On-brand (4).
  - HubCard instance `11159:12524` (Account/Credit Limit Hub/Empty) was already Bg/On-brand on Withdraw and the track; the owner's view
    was likely the old HubCard.png, which is re-exported with this round.
  - Check: 0 buttons / tags / chips inside navy surfaces without On-brand (library and screens). "_bin/" styles skipped.
- **BRIEF 18, Surface/Tint.** New Semantic `Surface/Tint/Default` **`VariableID:11212:20681`** → Palette/Ambient/300, scopes FRAME_FILL +
  SHAPE_FILL, Web `var(--surface-tint)`.
  - Audit: fills resolving to Ambient 50 / 100 / 200 whose nearest filled parent is page-coloured. Library 26 hits, screens 28 hits.
  - Rebound (mains; all 24 screen instances follow, no overrides): ScamStrip `11113:3512` (Ambient/200 → Tint) and the MethodPicker
    group header strip "Name title" `11133:6177` (Open=Off) / `11133:6189` (Open=On) (Surface/Brand/Subtle = Ambient/100 → Tint).
    Frames: Payment/Index ×3 (`11109:8198`, `8723`, `9162`), Payment/Anti-Scams/1–3 (`11109:9870`, `10262`, `10651`),
    Payment/Methods/Popover `11109:11309`, Popover-Search-Active `11109:12194`, 还款方式组件 `11189:16766`.
  - Not rebound, outside the strip / notice / chip rule (question in the report): .MethodTabs rail (Surface/Sunken = page colour, the
    method picker's left column), SelectBar, Keypad keys, UploadTile picture (controls on Surface/Sunken), Sheet Content (Page/Subtle).
  - Kit: post-pass now reports `tintOnPage` (ambient 50–200 on a page-coloured parent) for every new frame, for review.
  - Specs: ScamStrip, MethodPicker.
- **BRIEF 19, pop-ups.**
  - Library: Sheet Kind=Page `11038:1430` now Elevation/2 (Plain / Card / Panel had it); Popover `11039:1543` both types: blur + Elevation/2.
    New `.SheetHeader` **`11216:4546`** (05 · Structure): `State=At rest` `11216:4541` (blur, no shadow), `State=Scrolled` `11216:4542`
    (blur + Elevation/1). Sheet.md table + Popover.md updated (scrim rule, behaviour opacity = min(scrollTop / 32, 1)).
  - Screens, scrim (library `Scrim Type=Gradient` instance in the scrim layer; old fill removed). The bound Overlay/Scrim layers in the
    Page sheets were **hidden**, which is why they showed no scrim:
    change withdrawal method bank search, Withdrawal Methods/Online Bank/Search-Active and Search-Empty, Payment/Methods/Popover,
    Popover-Search-Active, Popover-Search-Empty, Address Popover-City, Address Popover/Search Result Multi, Search Result, Address
    Popover-Region and Province, 还款方式组件 (11 Page sheets), and Payment/Index ×2 + 详细弹窗 (raw black gradient → Scrim).
  - Screens, sheet shadow: all 20 Sheet instances already had Elevation/2.
  - Screens, fixed header (14): drop shadows removed (blur kept), content moved 12 below the header (container top padding 88 → 100,
    92 → 104, 83 → 95). Same 14 frames as above.
  - Not changed: 6 sheet-only frames (no page behind them): Frame 1940699432 `11055:2682`, Marital Status popover ×4 (`11163:17383`…),
    Frame 64 `11163:23297`.
  - "Recommend" tag: drawn white-on-green frame in MethodPicker (`11133:6180` Open=Off, `11133:6192` Open=On) → `Tag Size=Small,
    Tone=Accent, Emphasis=Strong` (green-500 bg, Tag/Accent/Content/Strong navy-900 text; 22 tall, was 18). 12 screen copies follow.
    There is no `Content/Strong` variable; the tag uses its own Tag/Accent/Content/Strong.
  - Same check on other tags: Strip "⚠ legacy: Number tag" `11133:4577` had white on green-500 → text Tag/Accent/Content/Strong (10 uses).
    The legacy "inbox filter tab" in inbox-a (remote legacy instance, legacy tokens) is white on legacy green: see the follow-up below.
- **Found while auditing (not part of the briefs; follow-up):** visible remote legacy instances remain on Design - Rebranding: Typing box
  ×48 (bank search sheets), Select bar ×11 and ID LIST ×10 (Marital Status popover), Icon Container ×10 (loan detail / OTP), inbox
  filter tab ×8 (inbox-a), Keyboard ×4 (system keyboard), ID card ×2 (camera art). The checker does not flag remote instances.
- **BRIEF 20, empty-state placement** (top = container top + max(24, round((H − block) × 0.4))):

  | Frame | Node | Container | Change |
  |---|---|---|---|
  | Payment/Empty `11109:9617` | EmptyState `11134:23522` | 116–672 (TopBar → Navigator) | y 277 → 252 |
  | Borrowing Activity/Empty `11155:10416` | `11159:12175` | 152–739 (below tabs) | y 252 → 292 |
  | Credit Adjustment/Empty `11155:10646` | `11159:12417` | 152–745 | y 255 → 295 |
  | Inbox/Empty `11200:17043` | `11200:18958` | 116–781 | y 283 → 296 |
  | Inbox/All Caught Up `11200:17230` | `11200:19063` | 160–781 (below filter tabs) | y 283 → 322 |
  | Inbox/No Read Message `11200:17331` | `11200:19120` | 160–781 | y 283 → 322 |
  | Methods/Popover-Search-Empty `11109:12948` | column `11182:65547` | 516 tall, block 96 | top padding 8 → 168 |
  | Withdrawal Methods/Online Bank/Search-Empty `11109:6835` | results `11137:16564` | now fills the sheet below the header (512), block 96 | top padding 20 → 166 |

  "No limit history yet" (`11159:12570`, inside the white hub card) is an informational panel inside a card, already centred: unchanged.
  Coupons empty: no such frame built yet (it follows the rule when built). EmptyState.md has the rule and the flex 2 / flex 3 build.
- **BRIEF 21, Tooltip tone.** Tooltip `10991:475`: new variant property Tone (Dark default · Light), 18 → 36 variants. Dark: leading
  icon → Content/Inverse (same as text), close → Palette/Alpha/White/60. Light: bubble + arrow Surface/Default, Elevation/3, text and
  leading icon Content/Primary, close Content/Tertiary. Screens set to Tone=Light (both point at navy cards): Home/Valid Date
  `11134:13704` (frame `11053:1210`), Account/Credit Limit Hub/Valid Date `11159:11801` (frame `11155:9918`). No other Tooltip instances
  on the Rebranding pages. Tooltip.md + Tooltip.png updated.
- **BRIEF 24, Button Neutral.** Button `10987:225`: Variant=Neutral added, 9 variants `11218:4557`–`11218:4605` (fill Bg/Neutral/Default,
  pressed Bg/Neutral/Strong, disabled Bg/Disabled + Content/Disabled, no border, label Content/Primary). Swapped to Neutral (secondary
  beside a primary in a horizontal row): Account/Logout Confirmation `11160:12757` ("Continue" | Log out), Delete My Account/Confirmation
  `11159:14354`, Application Details/Upload ID/ID Verify Failed `11168:22729`, "in use popover" `11168:23317`. The Button · states
  showcase row keeps Secondary (it demonstrates the variant). BottomBar Type=Two buttons = Primary over Text (stacked), unchanged.
  Button.md, BottomBar.md, Button.png updated.
- **BRIEF 25, date picker month / year.** Rebuilt in all 4 Select Date views (no picker-header component exists; DateCell / Weekday are
  unchanged): Application Details/…/Select (days) `11163:12004` (row `11186:20972`), the `11206:46087` sheet (row `11206:46094`),
  `11163:12582` (row `11186:21499`), `11163:13127` (row `11186:22042`).
  - Row `Group / Month and year`: 312 wide, gap 12 (was 20 with two 156 frames), two columns `Month` / `Year` of **150 × 40** each.
  - In each column the label fills the 150 and is centred; `Item / Previous` and `Item / Next` are 40 × 40 touch areas (16 px icon centred,
    Icon / Chevron left / right) pinned to the two ends. So the arrows never move and "December" fits (a 70 px label between two inline 40s
    wrapped "December").
  - Row height 22 → 40 (touch areas); the wheel below moved 18 down inside the sheet.
  - Renamed per BRIEF 23: `Header`, `Month`, `Year`, `Label / Month`, `Label / Year`, `Wheel`, `Actions`.
- **Regressions caught by the full check, fixed:**
  - New variants made by cloning (Button Neutral ×9, Tooltip Tone=Light ×18) had lost their component-property bindings (Label, icon,
    Title / Text, Close), so swapped instances fell back to defaults. Bindings copied back from the source variants (4 per variant).
    Restored from legacy: labels "Cancel" (Logout Confirmation `11160:12757`, Delete My Account `11159:14354`), "Try again" (ID Verify
    Failed `11168:22729`, in use popover `11168:23317`); tooltip text "This credit limit is valid until October 31, 2026." + leading
    Icon / Pending (Content/Primary) on `11134:13704` and `11159:11801`.
  - The new Recommend tags were visible where legacy hides them; visibility now follows the legacy group headers (shown on Direct App
    Pay, QR Code, Bank Transfer, Offline Payment; hidden on Bills Payment, Online transfer) in `11109:11309`, `11109:12194`, `11189:16766`.
  - Checker: counts the 07 · Icons section and names rotated legacy chevrons by direction (legacy itself used rotated Chevron right).
- **Full check (124):** sizes 124 / 124; flags 5 = the 2 known selfie artefacts + 3 rows now below the sheet edge because of the BRIEF 19
  12 px header gap (Calabarzon `11163:18973`, Online transfer `11109:12194`, GCash `11189:16766`; the lists scroll). Lint: rotated icons 0;
  default names 1532 on Design - Rebranding, 699 in the library (BRIEF 23).
- **PNGs re-exported:** HubCard, ScamStrip, MethodPicker, Sheet, Popover, _SheetHeader (new), Strip, Button, Tooltip, icons-v2 (new, the
  07 · Icons section).
- **BRIEF 27, dark green emphasis.** New Semantic `Content/Accent-strong` **`VariableID:11223:15`** → Palette/Green/800 #206335, scopes
  TEXT_FILL + SHAPE_FILL + STROKE_COLOR (icons), Web `var(--content-accent-strong)`. Applied: "No limit history yet" panel `11159:12570`
  (Icon / Pending `11159:12571` + title `11159:12578`; body stays Content/Tertiary); step numbers 1 2 3 (were Content/Brand/Subtle) in
  "How to improve your credit limit" on Account/Credit Limit Hub/Index (`11159:11564`, `11570`, `11576`), Valid Date (`11159:11779`,
  `11785`, `11791`) and Empty (`11159:12584`, `12590`, `12596`). No other informational empty panels or numbered step lists on the
  Rebranding pages or in the library (the Strip number badge is a tag, see BRIEF 19).
- **BRIEF 32, legacy icons and untouched illustrations (in progress).**
  - Survey over 123 pairs (icons matched by position, ≤ 6 px): 246 legacy icons; 84 already the same main component; 35 direct
    stand-ins (Star 5 → RatingStar ×30, More → Icon / More horizontal ×2, Warning filled → Icon / Alert circle ×2, Icon Container →
    Check ×1); 127 without a same-place icon in the new frame, because the icon now sits inside a re-composed library part (TopBar
    Left / Right frames with GlassButton, Field trailing icons moved 10–20 px, "Icon Container" frames, flattened vectors such as Icon /
    Inbox → "Union", Icon / Bank → "Polygon 3", Icon / Pending → group).
  - Done: laurels restored to legacy raw #C8E5DF, unbound (TrustCard `11133:5145` / `11133:5154`, Home/Onboarding `11187:20023` /
    `11187:20032`); `f#c8e5df` removed from the raw-colour table (the kit already skips raw mapping for "art" paints; the laurels slipped
    through as plain rectangles). 34 direct stand-ins swapped back to the legacy main: Star 5 ×30 (Home/Onboarding, Details Container;
    legacy yellow raw #FFCC00 kept, since there is no v2 yellow token: question), Warning filled ×2 (in use popover `11168:23251`, ID Verify
    Failed `11168:22663`; raw black / white → Content/Primary / Content/Inverse), More ×2 (Take A Selfie `11168:21484` / `21685`). Icon
    Container → Check (checkbox control, not an icon) left.
  - **Next (resume here):**
    1. Kit: for a legacy INSTANCE whose main is an icon (Icon page, nav/*, remote icon sets: Cancel-Thick, legacy check, Warning filled,
       More, Gift, Inbox / NOTIFICATION …), keep the legacy main (clone the instance) and only map its paints to v2 (mapPaints); drop the
       icon entries from `map` / `ids2` that point at other icons. Library parts that embed an icon (GlassButton, TopBar, Field trailing
       icon, ListItem, Toast …) get the legacy icon through their INSTANCE_SWAP property instead of their default.
    2. Library mains: for each component built from a legacy source (`sources` index), compare its icons with the source's icons and swap
       to the legacy main (or a 1:1 vector copy when remote and locked).
    3. Swap in place on screens by position (as for the 34 above) and handle the 127 re-composed cases per component; a full kit rebuild
       would also need the entry-18 screen fixes re-applied (BRIEF 16 rebinds, 19 scrim / gap, 20 placements, 21 tone, 24 Neutral, 25 rows).
    4. Checker rule: each icon instance's main component (or copied vector) equals the legacy node's icon at the same place.
    5. Overlays for all sections; log counts per section.
  - **Coordinator answers (entry 18 reviewed, 2026-11-20), folded into the plan:**
    - Date picker ›: copy the legacy chevron-right glyph 1:1 into 07 · Icons (like Chevron left) and use it for every ›. Under BRIEF 32
      no v2 stand-in icon survives, including `Icon / Chevron right` 3664:1110 wherever legacy had its own glyph.
    - BRIEF 18 leftovers (.MethodTabs rail, SelectBar, Keypad keys, UploadTile picture, Sheet content) stay as they are (controls / structure).
    - Rating stars keep raw legacy #FFCC00 (art, no token).
    - Remote legacy instances still visible (Typing box ×48, Select bar ×11, ID LIST ×10, Icon Container ×10, inbox filter tab ×8) are a
      phase-1 defect: replace each with its library equivalent at the legacy geometry (Field / Search, SelectBar, list row, the icon, inbox
      filter as Chip or Segmented, whichever matches the legacy look), keeping their legacy icons. Keyboard ×4 and ID card ×2 are art and stay.
      Checker rule: no remote legacy component instances on the Rebranding pages except art.
    - The 3 rows below the sheet edge are fine (lists scroll).
  - **Resume order:** BRIEF 32 steps 1–5 above (+ chevron-right copy, + remote legacy instances replaced, + the two checker rules) →
    BRIEF 28 → UploadTile file name Label/sm → BRIEF 29 → BRIEF 30 (PlaceTab) → BRIEF 31 (search matches) → BRIEF 22 (filled icons; log
    ids for the demo) → BRIEF 23 (renames) → overlays for everything touched → type audit `rebrand/tokens/TYPE-GAPS.md` (last; end turn).
- **Still to do in this round (queue from the coordinator, in order):** BRIEF 32 (finish, see above), BRIEF 28 (ActivityItem tiles + Bg/Brand/Muted), UploadTile file name Label/sm, BRIEF 29 (upload progress dark green + Bg/Positive/Strong), BRIEF 30 (PlaceTab active green), BRIEF 31 (search matches dark green), BRIEF 22 (filled icons, icon tiles removed), BRIEF 23 (structural names + translator naming + checker rule),
  and the screen overlays for every frame touched in entry 18 (≈100 frames; icon, scrim, tint, gap, tooltip, button and date-picker
  changes). Overlays shot once after the renames; the type audit (`rebrand/tokens/TYPE-GAPS.md`) is the last item, then the turn ends.

### 2026-11-20 · 17 · Retired card styles to "bin", Field without any ring, BRIEF 16, inbox-a, change bank card
- **Owner: "these styles are no longer used: bin them".** Mapping of the five styles:
  - (a) white CreditCard with ring, Used / Total balance tags, "Withdraw Fund" — drawn card on `11052:212` user HOME (legacy 8921:30605);
  - (b) same card with the red "Withdrawals are temporarily unavailable…" notice — drawn on `11052:454` user HOME paused (legacy 8914:30139);
  - (c) "Apply a loan" disbursement card with slider and term chips — AmountCard `11064:2451` (both variants);
  - (d) card with Total credit and white bar (legacy blue gradient, our flat navy) — CreditCard Temporary=Off `11093:2766` (legacy
    10926:30158) and Temporary=User home `11098:2821` (legacy 9867:36981);
  - (e) navy card with the ring and Total credit, no bar — CreditCard Temporary=User home compact `11098:2822` (legacy 9867:37346).
- **Moved into section "bin"** `11196:16445` on Design - Rebranding (moved, ids kept, nothing deleted): `11052:212` (a, legacy 8921:30605),
  `11052:454` (b, 8914:30139), `11052:667` User home Full States coupons (d, 9867:36920), `11052:903` User home Full States (e, 8958:19617),
  `11053:847` Home Full States (d, 10789:29220).
- **Library marked retired** (name prefix + description "Retired (owner 2026-11-20 …)"): CreditCard `Temporary=_bin/Off`,
  `Temporary=_bin/User home`, `Temporary=_bin/User home compact` (the prefix sits in the variant value so the set's property stays valid);
  AmountCard set renamed `_bin/AmountCard` (both variants noted). Showcases left as they are.
- **Not moved — the style is one block of a live page that has no other Figma design (for the owner):**
  - AmountCard (c) on the loan-order page and its OTP sheets: `11052:609` New user loan (8957:16440), `11055:1957` Loan Detail
    (8958:20032), `11055:2141` coupons (10952:29768), `11055:2349` top (10261:36235), `11055:2492` popover (9137:26172), `11109:5153` Loan
    Detail (9137:26562), `11109:7308` / `7524` / `7745` / `7970` OTP sheets (9137:27682 / 28053 / 28357 / 28667). In the demo the order page
    is the Withdraw demo's own code; AmountCard is only the demo's fallback `loan` page and the gallery entry "AmountCard".
  - CreditCard Temporary=On (the (d) card + the temporary-credit row): `11053:1033` temporary credit (10029:45495), `11053:1210` Valid Date
    (9137:25806), `11053:1397` overdue (10545:37326). After the bin it is the only home credit card left in Figma.
  - Live states that lose their only Figma design with this bin: home "credit ready" without temporary credit (d / e), user home (a), and
    **withdrawals paused (b)** — no other card shows "Withdrawals are temporarily unavailable".
- Demo mapping (for the demo lane): CreditCard → gallery "CreditCard" and app `home` states "Credit ready · repaying / · no loan"
  (`prototypes/app/screens-home.js` PS.CreditCard; the app's hero is the Withdraw demo's own card); AmountCard → gallery "AmountCard" and the
  fallback page `loan` ("Loan details (fallback)"); (a) / (b) are user-home cards with no separate gallery entry found.
- **Field: no ring in any state** (phase 1, state by state). Legacy typing boxes have no stroke or effect on the box in any state (Typing,
  Error included); Focus and Error lose their ring. Overlays re-exported for the 8 frames where a focus / error field is visible: 0–3 %
  (were 9–20 %). Phase 2 note 23 corrected; note 32: focus visibility needs a decision (with the 3:1 control-border rule). Spec + PNG updated.
- **BRIEF 16 (periwinkle on navy):** created `Alpha/Periwinkle/24` `VariableID:11198:87` (Primitive, #9DB8FF 24 %, hidden, scopes []),
  `Bg/On-brand` `11198:88` (alias, FRAME_FILL + SHAPE_FILL, `var(--bg-on-brand)`), `Border/On-brand` `11198:89` (alias, STROKE_COLOR,
  `var(--border-on-brand)`). Rebound: CreditCard bar track (all 4 variants), legend dot (On), ring track (compact); HubCard ring track and
  Withdraw shade button; StateCard Chat pill (Hold, Not approved), timer pill (Documents), secondary buttons (Expired, Documents) and
  dividers; QrPanel "Save QR Code". Labels on the alpha fills → Content/Inverse. Bars' white / green fills unchanged. CreditLimitCard is a
  white card with no bar — not on navy, nothing to change. PNGs re-exported (CreditCard, HubCard, StateCard, QrPanel) and overlays for the
  12 screens that show them (Home temporary / Valid Date / overdue, the 5 StateCard homes, the 3 Credit Limit Hubs, Methods QR): ≤ 7 %.
  Specs noted.

**inbox-a** `11200:16448` (legacy section 8128:26393; 7 frames; check 7 / 7 clean)

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 8128:26487 Inbox · Unread | 11200:16449 | inbox (unread) | 3 / 3 |
| 8181:29653 Inbox · Read | 11200:16755 | inbox (read) | 3 / 3 |
| 8128:26997 Inbox · Empty | 11200:17043 | inbox (empty) | 3 / 0 |
| 8181:30112 Inbox · Detail | 11200:17133 | message | 8 / 2 |
| 8181:30145 Inbox · All caught up | 11200:17230 | inbox (all read) | 2 / 0 |
| 8181:30227 Inbox · No read message | 11200:17331 | inbox (read, empty) | 3 / 1 |
| 9351:20344 Account (signed in, inbox badge) | 11200:17432 | account | 3 / 5 |

- Maps added: legacy System notification card 8133:28403 (Unread / Read) and overdue card 8620:34504 → InboxItem (rebuilt from them in
  entry 15); TopBar legacy "Secondary two btn" → Back+Title+Action (the "Inbox" title had been hidden).
- EmptyState: title now fills the width, centred (longer titles had wrapped onto two lines); 6 instances fixed; spec noted.

**换绑卡流程 · Change bank card** `11203:17057` (legacy section 8286:30444; 2 frames; check 2 / 2 clean)

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 8381:14003 拍照 · Camera (change card) | 11203:17058 | change card · photo | 0 / 2 |
| 8381:14019 拍照上传 · Photo confirm (change card) | 11203:17105 | change card · photo confirm | 0 / 8 |

- **New kit rule: dim nav buttons on the camera screen.** Legacy Top nav btn / Bottom nav btn there use a white 10 % fill on black (dark
  back button, dark "Take again"). They came out as light glass / a white Secondary button. Now, when the legacy fill is white ≤ 25 %:
  fill Palette/Alpha/White/20, no stroke, icon and label Content/Inverse. Stored as `ondark`, called from the Top nav btn map entry and
  the Bottom nav btn handler. Both frames rebuilt in place. Of the other legacy frames with this pattern, the 2 already built (Camera
  front `11163:17229`, Camera back `11163:17306`) got the same fix on their back button only (no rebuild). The rest (5755:10881,
  5755:10896, 8667:28313 / 28329, 9619:34445 / 34459, 9719:38619 / 38633) pick it up when their sections are built.
- Remaining overlay difference: v2's nearest alpha step is White/20 (legacy 10 %), so the dark buttons are a little lighter. "Next" text
  is navy (v2) where legacy was blue.
- Raw #000000 ×2 = the camera mask, also raw black in legacy (as on the selfie screens).
- Phase 2 note 33: there is no on-dark button in the library (Button has no glass / on-dark variant, GlassButton is light-only), and no
  White/10 alpha token. Legacy camera screens need one; this phase overrides the instance with tokens.

**Full check (124 frames):** 122 clean; root sizes 124 / 124 equal legacy; the 2 flags are the known selfie-screen checker artefacts
(11163:16009, 16206). Stored as `lastcheck` 2026-11-20e. EmptyState PNG re-exported. Ledger updated.


### 2026-11-20 · 16 · Field without border, Legacy collections restored, older sections diffed, Onboarding + Short link
- **Field: no border at rest** (phase 1): Default / Filled / Disabled lose the Border/Control ring; Focus and Error keep their 2 px ring
  (coordinator). Legacy shows no ring in any state (no stroke in the legacy typing boxes or their screen instances) — flagged. Placeholder
  → `Palette/Neutral/150` (legacy Color/Neutral/150); 9 old value-as-placeholder overrides rebound. The multi typing box map now also treats a
  placeholder-coloured legacy value as a placeholder (Basic info "Work address" was Filled); 14 Application Details frames rebuilt.
  Overlays re-exported for all 24 frames with Fields: forms 9–17 % (were 36–50 %), method screens 13 / 20 %, others ≤ 5 %.
- **Legacy collections restored to Legacy-only:** nothing used the 11 added variables or the Rebrand mode (all pages incl. Rebranding, all
  styles; the only references were aliases inside the Rebrand mode). Backup: `rebrand/figma/legacy-additions-backup.json` (+ plugin data
  `legacyAdditionsBackup`). Removed the Rebrand mode from Legacy · Component / Semantic / Primitive and deleted the 11 variables. Legacy
  collections now: Component 18, Semantic 276, Primitive 157 variables, one mode "Legacy"; 0 Legacy values changed.
- **Installment date chip** `11133:5812` (Status=Due today) → Tag/Navy/Bg/Default (ambient-100), like the tags.
- **Older sections vs today's kit (diff first):** each of the 50 frames was rebuilt in a temporary section with the current kit and
  compared node by node (texts, sizes, opacity, instances, fills, strokes), then the temps were deleted.
  - 42 identical, untouched.
  - 6 Home / User home (11052:667, 903, 11053:847, 1033, 1210, 1397): only the CreditCard info icon differs — legacy 60 % opacity (new
    opacity rule); set directly.
  - 3 method pickers (11109:11309, 12194, 12948): the background form's Fields now get the clear icon / label case → rebuilt in place.
  - Kept as they are (the fresh rebuild is worse: one-off swaps and manual fixes from earlier rounds): Sending 11051:303 (SendingCard),
    Enter Number 11055:1916 / 11109:5010 (Keypad, AmountEntry), Loan Detail popover 11055:2492 (+36 % "999"), Anti-Scams 3 (1 px vector).
  - Check on the 9 changed frames: clean.

**Onboarding** `11187:15612` (legacy section 6013:34883: 1 screen + 3 fragment frames; check 4 / 4 clean)

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 6069:13382 Home/Onboarding | 11187:15613 | home (guest) | 2 / 1 |
| 6123:12540 Details Container ("What customers say") | 11187:16092 | home (guest, reviews) | 3 / 0 |
| 6078:13330 Frame 1940698819 (rating row) | 11187:16168 | — (fragment) | 1 / 1 |
| 8289:30907 Frame 1940698939 (fragment) | 11187:16177 | — (fragment) | 0 / 0 |

- New component **RatingStar** `11187:19925` (legacy Star 5 6078:13294, 14 × 14, art colour kept).
- Fixes found by eye: (1) the offer card kept the legacy blue gradient — the kit drops gradient-stop bindings, so it came out raw; now flat
  Surface/Brand/Default, as decision 8 does for the home card. (2) The laurels around "Made for Filipinos" disappeared: the raw table mapped
  their tint #C8E5DF to Surface/Brand/Subtle, which equals the Surface/Sunken card → now Palette/Ambient/400 (nearest v2 tint), in the raw
  table, here and in the TrustCard component (User home's laurels get the same, more visible tint). (3) The hero text sat at the left: legacy
  centres the single child of its space-between row → row set to centre. Rename map: Color/Neutral/700 → content-secondary.

**短链 · Short link** `11189:15908` (legacy section 7792:14711, next non-bin section after Onboarding; 6 frames, 0 unmapped, check 6 / 6 clean)

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 7792:14577 短链 (repayment list) | 11189:15909 | pay (short link) | 7 / 2 |
| 7869:20659 短链兜底 (link expired) | 11189:16336 | pay (link expired) | 5 / 1 |
| 7981:12477 短链兜底 | 11189:16480 | pay (link expired) | 3 / 0 |
| 7986:12576 短链兜底 | 11189:16623 | pay (link expired) | 4 / 1 |
| 7792:15391 还款方式组件 (repayment methods) | 11189:16766 | paymethods | 1 / 0 |
| 7792:14712 详细弹窗 (repayment detail sheet) | 11189:17580 | paydetail | 5 / 1 |

- Section order: the "- bin" sections (初审 - bin, inbox-b - bin …) are the designers' trash and were skipped; User home is already done, so
  短链 was next. Next in order: inbox-a (8128:26393).
- **Full check, 115 frames: 113 / 115 clean (the 2 known selfie artefacts), 2,846 texts, all root sizes = legacy** (`lastcheck` 2026-11-20d).
- Phase 2 notes (new): 29. Legacy fields have no ring on focus or error (the ring is a coordinator decision; the 3:1 control-border rule is
  Phase 2). 30. Legacy hero cards use blue gradients; v2 is flat navy (decision 8 applied to the Onboarding offer card too). 31. Legacy laurel
  art uses a raw tint (#C8E5DF) with no token.

### 2026-11-20 · 15 · PhoneField restored, legacy read-only check, InboxItem from legacy, colour rules
- **PhoneField back to the owner design (BRIEF 13)** `11018:830`, all 6 variants: pills 64, gap 12, value 16 px grouped 3-3-4 (groups
  Body/lg-strong, placeholder and "+63" Body/lg), label Caption/sm 12/16, label → value gap 4, flag 24, caret 24, no border at rest. The
  Android-only change of entry 13 is withdrawn for PhoneField only; Field and Search stay at the legacy 14.
  - New detail for review: pill side padding 20 → 16 (`Spacing/Padding/lg`). At the legacy 328 width the 16 px placeholder "Enter your phone
    number" (184) did not fit in 177 and was cut; now 193. Country pill 91.
  - Login's "No longer have access" link sits 8 px lower than legacy again: **owner-decision difference, note re-opened** (entry 13 had closed it).
  - Re-exported: `parity/figma/PhoneField.png`, overlays Login (15 / 17 %), Enter Number `11109:5010` and `11055:1916` (no PhoneField; unchanged).
- **Credit limit increase colours (BRIEF 12, second exception, as corrected):** no Rebranding frame or component shows the Credit limit
  increase screen (searched both Rebranding pages by name and for #3FA0F0 / #6FB8F5 / #0D1620 / #16304A / #1B2834) — nothing to change.
- **Loading dots (BRIEF 12, third exception):** no Rebranding frame or component shows the coin loader; the only "Loading Container"
  (`11168:21870`, selfie uploading) is the upload ring, not the loader — nothing to change. Note: the colour search found #2C74BE on many
  bound paints; those are stale colour values stored on paints that are bound to v2 variables (the binding wins), not raw colours.
- **Legacy read-only check ("The pre-rebrand version stays"):**
  - Legacy pages (Design `3259:657`, Component `3384:681`, the bin, handbook, Icon, Screenshot, Logo, Illustration, Tone of voice): every
    variable binding goes to the "Legacy · …" collections or to external libraries (remote) — **none to the v2 collections**; no missing
    variables; text styles are "Legacy/…" or remote library styles (the 13 non-"Legacy/" names on Design, e.g. Caption/sm, Body/md,
    AOSP/Body/Medium, Shadow/Enhenced, are all remote, not v2 local styles); no instance points to a Rebranding page; no missing main components.
    Nothing a legacy frame uses was re-pointed, merged or deleted.
  - Legacy-mode values: all 420 Legacy variables that exist in the pre-rebrand snapshot (`tokens/tokens.css` v2026.11.17, exported from this
    file) have the same values — 0 differences, none missing.
  - **Found, not fixed (waiting for the coordinator):** the Legacy collections are not untouched — (1) 11 variables were added to them in the
    first token round (by this lane): Color/Navy/600–950, Color/Ambient/300, Color/Text/Brand/Inverse, Color/Text/Link/Inverse,
    Color/Surface/Device/Navy, Color/Surface/Device/Mist, Color/Overlay/Shade; (2) each Legacy collection has a second mode "Rebrand"
    (70 of 462 values differ from Legacy). No legacy frame uses the added variables or the Rebrand mode, so legacy frames render as before.
  - Not checkable with the plugin API: edit history ("no edits since the rebrand started"); the check is structural.
- **InboxItem rebuilt from the legacy card** `11043:1798` (same ids): Unread / Read ← System notification card 7809:16461 / 8133:28404,
  Overdue ← 8620:34504 (Read = dot off), 328 × 174 / 176 (was the 343 × 171 demo layout). New part `.InboxTime` `11180:54341`
  (legacy Time 7809:16667); map NOTIFICATION 7809:16437 → Icon / Inbox. Spec + `parity/figma/InboxItem.png` updated.
- **CreditCard.md:** heights corrected to 182 / 196 / 186 / 162 = legacy (Figma checked). The 194 / 170 the coordinator saw were from before
  today's amount-box fix (entry 14), so Figma and spec now agree.

### 2026-11-20 · 14 · Owner decisions, overlay re-export with graded tracking, Account + Application Details
- **Decisions applied:**
  - ₱: owner keeps Hanken's own ₱ at every size (2026-11-20). Question closed; no override anywhere.
  - "Total balance" tag: legacy `Color/Brand/100` → `Tag/Navy/Bg/Default` (ambient-100) in the kit's rename map; the two built tags
    (`11134:10624`, `11134:11052`) rebound. Note: the Installment date chip (`11133:5812`) also came from Brand/100 and keeps
    Tag/Navy/Bg/Subtle — it is not a tag; left for the coordinator.
  - EmptyState 236 vs 216: **not a defect and not an owner decision — my earlier note was wrong.** The legacy main component
    Page empty state `6220:14417` is itself 360 × 236 (help text in a 40 px box, two lines). 216 is the legacy *screen instance* on
    Payment / Empty, whose copy is one line; ours is 216 there too. Component kept at 236; description and spec corrected.
- **All 50 overlays re-exported after the tracking change** (`parity/figma/screens/`). The re-export found regressions from
  yesterday's widening and older library defects; all fixed:
  1. PaymentCard Upcoming 164 → 149 (legacy): legacy amounts use **cap-height leading trim** (24 px text in a 17 px box). The widened
     box had switched to auto-height at the full 32 px line. Amount + old price now `leadingTrim = CAP_HEIGHT`; the kit copies
     `leadingTrim` from legacy from now on. Same trim on ScamTips Tip 3 bullets and .MethodTabs labels (box kept at legacy 22).
  2. PaymentCard Due / Overdue / Overdue coupon / Next and CreditCard User home / compact: widened amount boxes had gone auto-height
     (32 / 44 / 36 vs legacy 24 / 36 / 28). Boxes back to legacy height, width kept, text centred vertically.
  3. CreditCard Off / On 185 / 199 → 182 / 196: the baseline-aligned amount row grew to 39 with Hanken's 44 px line; row pinned to
     legacy 36.
  4. .PaymentNotice penalty text had no style (auto line height, 15 px) → v2 Caption/sm 12/16 (also the overrides in PaymentCard
     Overdue variants). PaymentCard Due 245 → 246, Overdue 260 → 262, .PaymentNotice 59 → 60 (all = legacy).
  5. PenaltyInfo (overdue popover): the label column had shrunk to natural text width; back to legacy 100 px (main component).
  6. Loan Detail popover `11055:2492`: typed "999" lost legacy's explicit +36 % letter-spacing (restored); the outlined "Back" pill
     had become Button Text → Button Secondary. Kit handler Bottom nav btn: an unfilled button with a visible stroke → Secondary.
  7. Withdrawal methods: legacy fields show a clear (×) icon. **Field** gets a `Clear` boolean + icon (legacy Close circle filled,
     20 px, before the trailing chevron) in all 10 variants; on in `11109:5350`, `11109:5592`. Map Typing box → Field turns it on
     when legacy's clear icon is visible.
  8. Method bank `11109:5592`: legacy "Bank name" field is a placeholder (grey Neutral/150 text) but had become State=Filled → State=Default
     with Placeholder. Map rule: placeholder-coloured legacy value → State=Default.
- Unmatched-edge % after fixes: Register 0–7, User home 3–4, Home 1–9 (Enter Number 9 / 15: typed digits + keypad), User Order 1–13
  (method screens: v2 Field border), Payment 0–11. Remaining differences: v2 colours, Hanken metrics, v2 Field border, amounts
  (graded tracking, owner decision).
- **Check after fixes: 50 / 50 clean**, 1,491 texts (stored in `lastcheck`, 2026-11-20b).
- Still 1 px off legacy (Hanken metrics, kept): QrPanel 310 vs 309 (→ RepayCard QR 514 vs 513).

**Account** `11155:9694` (20 frames, check 20 / 20 clean, 367 texts; overlays in `parity/figma/screens/`)

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 3572:902 Credit Limit Hub | 11155:9695 | hub | 6 / 2 |
| 8615:33945 Credit Limit Hub · Valid Date | 11155:9918 | hub (temporary credit tip) | 13 / 5 |
| 3582:1334 Borrowing Activity | 11155:10165 | credit (Borrowing) | 4 / 1 |
| 6220:13585 Borrowing Activity · Empty | 11155:10416 | credit (Borrowing, empty) | 7 / 4 |
| 3696:2726 Credit Adjustment | 11155:10518 | credit (Adjustments) | 6 / 2 |
| 6220:13598 Credit Adjustment · Empty | 11155:10646 | credit (Adjustments, empty) | 3 / 1 |
| 3525:949 Credit Limit Hub · Empty | 11155:10748 | hub (no history) | 5 / 2 |
| 6878:14221 Logout | 11155:10908 | account | 1 / 0 |
| 6878:13819 Logout Confirmation | 11155:11425 | logout | 3 / 5 |
| 6156:12848 Customer Service | 11155:11804 | support | 4 / 1 |
| 6175:13101 SEC Registration | 11155:11962 | sec | 9 / 4 |
| 9473:27207 BIR Registration | 11155:12038 | bir | 3 / 1 |
| 6164:12621 About PeraSure | 11155:12128 | about | 6 / 2 |
| 6207:20110 Delete My Account | 11155:12359 | delete | 2 / 0 |
| 6213:13770 Delete · Confirmation | 11155:12528 | delete (confirm sheet) | 4 / 4 |
| 6218:13545 Delete · Disabled | 11155:12699 | delete-no | 4 / 1 |
| 6211:12815 Delete · OTP | 11155:12862 | delete (code) | 2 / 3 |
| 6218:13727 Delete · Success | 11155:13220 | delete-ok | 3 / 10 (v2 toast is dark) |
| 6218:13477 Manage My Account | 11155:13330 | manage | 0 / 0 |
| 9351:20615 Account (signed in) | 11155:13411 | account | 2 / 5 |

- **New library components (all translated from legacy, legacy ids in descriptions and in `sources`):**

| Component | Id | Legacy | Demo twin |
|---|---|---|---|
| Radio (Off / On) | 11156:5430 | Check mar 5772:13600 (+ 5607:6085) | PS.ReasonList radio |
| VerifiedBadge | 11156:5431 | Extra Documents Verified 3651:1460 | PS.Profile verified |
| ReasonRow (Last Off / On) | 11157:4367 | Delete my account/Questionnaire 6207:20239 | PS.ReasonList row |
| .ReasonText (Empty / Filled) | 11157:4370 | Feedback box 6217:22306 | PS.ReasonList text box |
| .ResendTimer (Ready / Counting) | 11157:4373 | Delete my account/otc 6213:21645 | PS.OtpForm resend line |
| LinkRow (Contact / Link / Plain × Last) | 11157:4380 | Contact list 6156:12996, About Perasure list 6167:12859, FAQs secondary list 6126:13417 | PS.LinkList |
| ActivityItem (Repayment / Loan / Documents verified / ID verified) | 11157:4385 | Credit history card 3871:1173 | PS.ActivityItem |
| HubCard | 11157:4389 | Credit limit primary card 10926:30008 | PS.HubCard |
| CreditLimitCard (Default / Masked) | 11157:4388 | Profile credit hub 10927:30765 | PS.CreditLimitCard |

- Existing library used: Credit History tab 3586:1443 → Chip Small (Default = Selected, Variant2 = Default, legacy 160 wide);
  delete my account/CTA 6213:21668 → Button Large Destructive / Destructive Disabled; Toast 6218:13916 → Toast Neutral at the legacy pill
  size (231); menu rows, header, Navigator, sheets as before.
- **Translator fixes found while building Account** (all stored in the file):
  - instance texts copy the legacy **text-style override** (mapped to v2) when it differs from the legacy main — e.g. SEC / BIR Registration
    14 SemiBold / Medium on a 16 px row;
  - an instance text that Hanken sets in fewer lines keeps the legacy box height (Phase 2 note 20 applied automatically);
  - map Popover btn Variant2 (outlined) → Button Medium Secondary (was Primary: "Cancel" on the log-out sheet);
  - Bottom nav btn with a white fill → Button Secondary (the hidden "Log out" under the tab bar on Account);
  - TopBar Brand: legacy Gift icon → first right button shows Icon / Gift (logout screens);
  - Toast and Navigator keep their component fills (copying legacy root fills had removed the toast background).
  - LinkRow labels: the rebuilt box had shrunk to natural width (110) so long labels wrapped; back to legacy 280.
- Rename map additions: Color/Icon/Positive/Default → content-positive, Color/Action/Bg/Primary/Disabled → bg-disabled,
  Color/Negative/600 → bg-negative.
- v2 consequences seen (not defects): legacy brand-blue links (About lists) render navy Content/Brand; customer-service values render
  Content/Link green; New / coupons badges navy; the Toast is dark; the selected Radio is navy. VerifiedBadge tick = Content/Brand on
  Bg/Positive (white on v2's light green disappeared; same pairing as the Toast success icon).

**Application Details** `11163:11297` (35 frames incl. the 3 "Add proof of income" frames of the legacy Upload documents sub-section and the
sheet "Frame 64"; check 35 / 35 clean except the selfie artefact below; 814 texts)

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 3910:1537 ID type | 11163:11298 | kyc-id | 3 / 18 (v2 Field border) |
| 3924:1492 Check the details | 11163:11440 | kyc-check | 5 / 50 (v2 Field borders) |
| 5900:9592 Select Date · Year | 11163:12004 | date (year wheel) | 4 / 19 |
| 5900:9854 Select Date · Month | 11163:12582 | date (month wheel) | 3 / 18 |
| 5900:10086 Select Date · Date | 11163:13127 | date (days) | 3 / 12 |
| 5591:6039 Basic info | 11163:13826 | kyc-basic | 6 / 48 (Field borders) |
| 9548:30951 Basic info (support documents) | 11163:14473 | kyc-basic | 6 / 49 |
| 5985:12263 Basic info · Email | 11163:15165 | kyc-basic (e-mail suggestions) | 6 / 8 |
| 5561:7317 Add a trusted contact | 11163:15868 | kyc-contact | 5 / 23 |
| 5561:7329 Take a selfie | 11163:16009 | kyc-selfie | 5 / 1 |
| 5561:7411 Take a selfie · failed | 11163:16206 | kyc-selfie (failed) | 5 / 1 |
| 5561:7501 Take a selfie · uploading | 11163:16413 | kyc-selfie (uploading) | 0 / 1 |
| 5583:4934 Upload ID | 11163:16477 | kyc-id (sides) | 2 / 9 |
| 6012:34214 Upload ID success | 11163:16618 | kyc-id (done) | 2 / 9 |
| 5914:9271 ID used | 11163:16770 | id-inuse | 4 / 7 |
| 5914:9658 ID verify failed | 11163:16933 | id-failed | 7 / 7 |
| 5788:13914 Camera front | 11163:17229 | camera (front) | 11 / 3 |
| 5797:13982 Camera back | 11163:17306 | camera (back) | 11 / 3 |
| 5772:13696 / 13708 / 13719 / 13728 Marital status popovers | 11163:17383 / 17466 / 17529 / 17566 | kyc-basic (popovers) | 0 / 0 |
| 5908:10722 / 11000 In-use popovers | 11163:17686 / 17706 | id-inuse (sheet) | 3 / 0, 7 / 5 |
| 5975:10704 Address · City | 11163:17848 | city | 6 / 1 |
| 5975:11304 Address · search multi | 11163:18973 | city (search) | 4 / 2 |
| 5991:13479 Address · search result | 11163:20134 | city (result) | 5 / 2 |
| 5975:10755 Address · Region / Province | 11163:21186 | city (region) | 3 / 0 |
| 7201:11836 / 12020 Basic info popovers | 11163:22352 / 22742 | kyc-basic (gender / photo) | 6 / 36, 7 / 28 (Field borders) |
| 9224:37691 Your loan estimate | 11163:23146 | kyc-estimate | 7 / 3 |
| 8682:29076 Frame 64 (payment plan sheet) | 11163:23297 | kyc-estimate (plan) | 6 / 1 |
| 9473:27722 Add proof of income · full states | 11163:23528 | docs | 4 / 1 |
| 9465:26742 Add proof of income · index | 11163:23959 | docs | 5 / 1 |
| 9465:26861 Add proof of income · interact | 11163:24131 | docs | 4 / 1 |

- **New library components** (all translated from legacy):

| Component | Id | Legacy | Demo twin |
|---|---|---|---|
| .FileBadge (PDF / JPG / JPEG / PNG) | 11166:4404 | File catalog logo 9474:28841 | PS.FileRow badge |
| ResultBadge (Success / Failed) | 11166:4407 | 6012:34323, ID FAILED 5914:9238 | PS.IdResult marks |
| .DateCell (Default / Selected) | 11166:4410 | Calendar popover/date 5839:18418 | PS.DatePicker |
| .Weekday | 11166:4411 | Calendar popover/ week 5839:18282 | PS.DatePicker |
| .MenuRow (Plain / Email × Default / Pressed) | 11166:4416 | select overlay 7201:11982, Email/Auto filled list 5985:12384 | PS.Popover rows |
| PlaceTab (Default / Active / Picked) | 11166:4420 | Search city popover/tab 5974:9358 | PS.PlacePicker |
| PlaceRow (Region / City) | 11166:4427 | search city popover/list 5974:9438, City list 3439:3010 | PS.PlacePicker |
| ChoiceButton (Link / Brand) | 11166:4430 | Exist account btn 5904:10653 | PS.ChoiceButton |
| .FileRow (Uploaded / Uploading / Compressing / Failed) | 11166:4435 | Upload File Sheet 9474:28815 | PS.FileRow |
| DocCard (Expanded / Collapsed / Empty) | 11166:4925 | File catalog sheet 9474:29171 | PS.DocCard |
| EmailSuggestions | 11166:4926 | Email/Auto filled 7193:22678 | PS.FormField suggestions |
| UploadTile Type=File (rebuilt + Empty, Add more) | 11044:2020 | Application details Upload File Sheet 9548:31409 | PS.UploadTile |

- Icons: Cancel-Thick → Icon / Close, More → Icon / More horizontal, status/check and check mark → Icon / Check, Warning filled → Icon /
  Alert circle (stand-in). Calendar/button → Button Small Secondary (both legacy pills are white).
- **Fixes found by the check and the eye review (all in maps / kit, so future rebuilds keep them):**
  1. Legacy multi typing box (64, label above) mapped to Field Floating 56 except "Typing", so every form was 54 px short and the
     background forms shifted. All states → Layout=Stacked (64 / 84 with message).
  2. Field error messages were missing; legacy Error → State=Error + Message; legacy Empty (required) → Default + red message, no red border.
  3. Field labels: legacy uppercase (textCase) copied; legacy clear (×) and Calendar icons copied.
  4. Date grid: legacy blanks leading / trailing days with opacity 0 → .DateCell copies opacity; the kit now copies opacity for all copied nodes.
  5. Date sheet header: legacy check mark in the glass button → Icon / Check (was Close).
  6. Proof of income: BottomBar Variant2 with a second legacy button ("Not now") → Type=Two buttons.
  7. 17 legacy colour variables added to the rename map (Stroke/Brand/Strong, Neutral 50 / 200 / 400 / 800, Icon & Text Positive/Heavy, Alpha/Cold
     Bg/Subtle, Brand/600, Card/Negative, Negative 50 / 500, Border/Color/Brand, Border/Width/Strong, Stroke/Positive, Icon/Negative/Light,
     Tag Neutral Stroke).
- Known, not defects: selfie frames — the checker reports one Icon / Check missing; both legacy ticks are present and visible (checked node by
  node), its clip test drops one on the card row. The 184 px black ellipse is the legacy camera mask (also raw black in legacy). Popover sheets:
  legacy puts the shadow on the frame; here it is on the Sheet panel and the frame clips it (as Repayment Plan).
- **Full check, all 105 frames: 103 / 105 clean (2 = selfie artefact), 2,672 texts, all 105 root sizes equal legacy** (`lastcheck` 2026-11-20c).
- Specs: 21 new (`spec/Radio.md` … `EmailSuggestions.md`) and 2026-11-20 sections in Field, UploadTile, PaymentCard, CreditCard, PenaltyInfo,
  _PaymentNotice, _MethodTabs. Parity PNGs for all 21 new + the 9 changed components (`parity/figma/`).
- **Phase 2 notes (new):**
  22. Two legacy typing boxes for the same role: "one box per page" (56, label inside) and "multible box" (64, label above, UPPERCASE labels).
  23. Legacy required-field states differ: Empty = red message, Error = message + value (no border in either; corrected 2026-11-20).
  24. Legacy date wheel: Cancel and Confirm are both white pills (no primary action).
  25. Credit History tabs are 160 px chips; other two-way switches are Segmented.
  26. Legacy links mix brand-blue and plain labels in the same About lists; the Toast is a white pill in legacy (dark in v2).
  27. Legacy "Warning filled" and "More" icons have no exact v2 twin (stand-ins Alert circle, More horizontal).
  28. Two legacy "Check mar" radio sets (5772:13600, 5607:6085) with the same look.
- Not done / open: older sections were not rebuilt after today's kit changes (opacity copy, style-override copy, legacy box heights); their
  frames are unchanged and still pass the check.

### 2026-11-20 · 13 · Eye review of all 50 overlays, Android-only sizes, graded Amount tracking
- **Check: 50 / 50 clean** (1,491 texts equal to legacy, ₱ present everywhere, no empty / hidden labels, no black or placeholder fills, no node
  without a legacy source). Icon stand-ins only: Chevron right (← nav/chevron-left), Close (← Cancel-Thick), Check, and the Maya logo (← the
  legacy bitmap). Result stored in `lastcheck`.
- **Eye review: every overlay re-exported** (`parity/figma/screens/`, legacy | new | edge diff). Defects found and fixed:
  1. Repayment Plan `11055:2682`: the sheet panel sat above the content (only "Continue" showed). Panel is the bottom layer again.
  2. Detached legacy amount cards (Frame 1940699008 in 8957:16440, 9137:26562, 9137:27682 / 28053 / 28357 / 28667) had become drawn frames
     with grey term chips. They are AmountCard now (new kit rule "AmountCard (detached)"); frames `11052:609`, `11109:5153`, `7308`, `7524`,
     `7745`, `7970` rebuilt.
  3. "Code incorrect" `11109:7970`: OTP boxes lost the legacy red ring (legacy = stroke override, not a variant). Map sms → .OtpBox now picks
     State=Error from a Negative stroke.
  4. Withdrawal-method logo: 6 legacy screens show the Maya bitmap beside "Bank of the Philippines Islands" (legacy inconsistency, kept —
     Phase 2 note 19). The MethodCard rule now swaps in `Payment logo / Maya` 5680:9430 when legacy has that bitmap.
  5. SelectBar Card was 48 (24 px logo) → e-wallet rows drifted 2 px each. Logo 18 (legacy), Card min-height 46 + hug.
  6. Search 44 → 40 (legacy); legacy "Focus" (typed value + clear) now maps to State=Focus. Bank-search sheets: the legacy handle lives
     inside the white header, so the panel's handle was hidden — kit keeps the legacy handle there and hides the panel's
     (`11109:5726`, `6329`, `6835`, `11309`, `12194`, `12948` rebuilt).
  7. Payment detail / penalties `11109:8723`, `9162`: the hidden legacy back button showed and both glass buttons hugged to 20 px. The
     Top nav btn maps now copy legacy opacity and size.
  8. Scam tips: legacy Section-title/md-light (16/22) had become Body/lg-strong (16/24), so tip 2's sheet rose 4 px. Now Title/xs 16/22
     (kit style map + ScamTips titles). 36 legacy texts use that style; the 3 visible ones were in ScamTips.
  9. AmountCard 245 → 246: Slider 40 → 42 (legacy) and the divider is a 0-tall line like legacy.
  10. Loan Detail `11109:5153`: protection text set in 3 lines by Hanken (legacy 4) shrank the card; the box keeps the legacy 64 (as on
      `11055:1957`). Phase 2 note 20.
- **Android only (owner 2026-11-19).** Inputs back to legacy sizes: Field / Search / PhoneField prefix, placeholder, value = Body/md 14/20
  (was 16/24 for the iOS input-zoom reason); PhoneField 64 → 56, flag 20, label 11/14, gap 2 (legacy 3279:152) — Login's link is back at
  its legacy y, so the old "PhoneField 64 vs 56" owner note is closed. Specs give Android reasons now (touch target ≥ 48 dp as a Phase 2
  note; 16 px inputs as a readability option): Field, PhoneField, Search, SelectBar, Check, README, entry "Segmented restyle" note 3.
  Status bar untouched (legacy).
- **Amount tracking graded (owner 2026-11-19):** text styles Amount/xxl +4 %, Amount/lg +3 %, Amount/md +2 %, Amount/xs +2 % (was −2 %),
  descriptions updated. The v2 collections have no letterSpacing variables, so nothing to add or bind (developers' JSON has
  letterSpacing.8 / .9). Wider amounts wrapped in fixed legacy boxes: 7 texts in PaymentCard / CreditCard and 3 on screens (`11055:2492`
  ".00", `11109:5010` "12,5" / "00") widened from their anchor. Parity PNGs re-exported for every component showing an amount: AmountCard,
  AmountEntry, CreditCard, OfferCard, PayBar, PayDock, PaymentCard, Popover, RepayCard (+ Field, PhoneField, Search, SelectBar, Slider,
  ScamTips for today's fixes). Screen overlays were exported before the tracking change; amounts will differ from legacy by design
  (owner decision, not a defect).
- Phase 2 notes (new): 19. Legacy shows the Maya logo next to "Bank of the Philippines Islands" on 6 screens (kept). 20. Hanken sets some
  body copy in fewer lines than legacy; boxes keep legacy heights (Loan Detail protection text). 21. Android touch target 48 dp: Search 40,
  glass buttons 40, Small Button 36 / Chip 32 stay legacy in Phase 1.
- Open (owner): Hanken's ₱ at 12–14 px reads like "P" (single thin bar); EmptyState 236 vs legacy 216. → Both closed in entry 14.
- Re-check after the usage reset (2026-11-20): in Figma, Installment `_old` 11027:1133 is gone; Sheet Kind=Panel 11129:4353 has 9 instances; Amount styles read xxl +4 %, lg +3 %, md +2 %, xs +2 %. Nothing redone.
- Next: Account / Application Details — done in entry 14.

### 2026-11-19 · 11 · Review fixes for rounds 09–10 + automated legacy check (in progress)
- **Root causes found and fixed in the translator:**
  - Legacy instance contents were read before they had loaded, and the plugin skips hidden instance children by default. As a result, copies misaligned: wrong labels and icons, missing rows, legacy-hidden tags showing.
    - Fix: all pages are loaded before reading, and `skipInvisibleInstanceChildren = false`.
  - Components were built without the legacy hidden layers (e.g. the OrderDetails Discount row).
    - Fix: all 66 legacy-built component variants rebuilt in place, hidden layers kept. Component → source list: `getSharedPluginData('perasure.rebrand','sources')`.
  - Rule-swapped blocks only copied a label.
    - Fix: full copy; nested legacy instances get their mapped variant and label (e.g. Overdue → negative Tag).
  - Copy pairing by name prefers visible children. Auto-height text boxes are kept (PermissionCard was 16 px taller).
  - Header: a legacy Primary header with a page title becomes TopBar Pill+Actions.
  - Field, Search and PhoneField keep their legacy labels, values, placeholders and chevrons. Tooltip keeps the legacy icon and Close glyph. OfferCard copies all its texts.
  - Low-opacity navy → `Bg/Neutral/Default` (the "Used balance" tag). Legacy Brand/100 → `Tag/Navy/Bg/Subtle` (the "Total balance" tag).
- **₱:**
  - The character is never replaced: every legacy "₱…" string is identical in the new frames.
  - Hanken Grotesk's own ₱ has one thin crossbar, so at 12–14 px it reads like "P"; in the large Amount styles it is clearly ₱. A render test of all weights showed this.
  - Owner question: keep Hanken's ₱ at small sizes?
- **Sheets:** new `Sheet` variant Kind=Panel (11129:4353) at the legacy geometry (360, radius 32 top, handle 38 × 6 at 161 / 8, legacy shadow; fill overridden per screen). The legacy drawn sheet panels on 9 screens now use it. Logged in Sheet.md.
- **_old Installment** (11027:1133): no users left → deleted.
- **MethodCard** is now a set: State=Bank / State=Empty (11127:12970; "Add a withdrawal method" 10952:29823).
- **Automated check (all 50 frames):**
  - Every visible text equals legacy (1,491 strings).
  - ₱ is present wherever legacy has it.
  - No empty or hidden labels; no unexplained black fills (vector art and logos excluded).
  - Every icon instance resolves to the legacy icon or a mapped stand-in:
    - TopBar Back chevron ← legacy remote nav/chevron-left;
    - GlassButton / Sheet close ← Cancel-Thick;
    - Check tick ← legacy check icon;
    - BPI bank icon ← legacy bitmap logo.
  - The checker is stored in the file (`'check'`); its last result is in `'lastcheck'`.
  - Keypad digits on Enter Number come from a remote library, so the checker cannot read their legacy text; visually they match.
- **Eye review:** overlays re-exported for Register and User home and for Home Full States, temporary credit, Valid Date and overdue. Still to re-export and review: the other 11 Home frames, User Order and Payment.
  - Found so far: New user loan / Loan Detail "Confirm" is a disabled grey pill in legacy; the pill rule makes it Primary green. To fix: disabled pills → Button State=Disabled.

### 2026-11-19 · 10 · User Order + Payment (phase 1: legacy layout), B-list components
- Both sections are on Design - Rebranding with an explicit Light mode. Every frame is rebuilt from its legacy frame with the kit (entry 09). Nothing is unmapped, no Legacy bindings, no raw UI colours (illustrations, QR and logos are unchanged).
- Overlay per frame: `rebrand/parity/figma/screens/`. The number is the share of edges with no match (legacy side / new side).

**User Order** `11109:5008`

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 9137:26671 Enter Number | 11109:5010 | amount | 9 / 15 |
| 9137:26562 Loan Detail | 11109:5153 | loan | 7 / 7 |
| 5588:5243 Withdrawal methods · e-wallet | 11109:5350 | method (E-Wallet) | rebuilt after fixes; visually aligned |
| 5588:5261 Withdrawal methods · online bank | 11109:5592 | method (Online bank) | as above |
| 5803:14326 Bank search | 11109:5726 | method · bank sheet | 4 / 1 |
| 5932:8908 Bank search · active | 11109:6329 | method · bank sheet (search) | 17 / 0 |
| 6220:14019 Bank search · empty | 11109:6835 | method · bank sheet (no match) | 24 / 1 |
| 9137:27682 OTP index | 11109:7308 | loan · verify (sheet) | 6 / 4 |
| 9137:28053 OTP sent failed | 11109:7524 | loan · verify (failed) | 6 / 4 |
| 9137:28357 OTP enter code | 11109:7745 | loan · verify (code) | 6 / 12 |
| 9137:28667 Code incorrect | 11109:7970 | loan · verify (incorrect) | 5 / 4 |

**Payment** `11109:5009`

| Legacy frame | New frame | Demo page | Overlay % |
|---|---|---|---|
| 10534:35615 Payment / Index | 11109:8198 | pay | 5 / 4 |
| 10545:37955 Payment / Index · payment detail | 11109:8723 | pay · payment detail | 6 / 6 |
| 10545:38381 Payment / Index · penalties | 11109:9162 | pay · penalties | 6 / 6 |
| 6220:13381 Payment / Empty | 11109:9617 | pay (empty) | 2 / 0 |
| 6889:14706 Payment / Index-Logout | 11109:9756 | pay (guest) | 7 / 9 |
| 8988:17764 Anti-Scams 1 | 11109:9870 | pay · scam tips 1 | 3 / 4 |
| 8995:18429 Anti-Scams 2 | 11109:10262 | pay · scam tips 2 | 3 / 1 |
| 8995:18706 Anti-Scams 3 | 11109:10651 | pay · scam tips 3 | 4 / 1 |
| 5922:9772 Methods / Transfer | 11109:11022 | pay · transfer | 9 / 4 |
| 5925:9474 Methods / App | 11109:11112 | pay · app | 11 / 5 |
| 5925:9552 Methods / QR Code | 11109:11215 | pay · QR | 4 / 2 |
| 6062:14058 Methods / Popover | 11109:11309 | pay · method picker | 7 / 12 |
| 6062:16635 Popover · search active | 11109:12194 | pay · method picker (search) | 7 / 19 → fixed after (GC, Bills Payment) |
| 6062:17810 Popover · search empty | 11109:12948 | pay · method picker (no match) | 10 / 10 |

- **New library components (coordinator answer B), all translated from legacy** (spec + showcase + parity PNG each; 66 PNGs now):

| Component | Id | Legacy |
|---|---|---|
| Keypad | 11095:2874 | grid 9426:18088 |
| ScamStrip | 11113:3512 | 10534:35617 |
| RepayCard | 11114:3890 | Transfer 5922:10053, App 5925:9476, QR 5925:9554 |
| PayBar | 11113:3520 | 5610:6009 |
| PayDock | 11114:3886 | payment nav 5610:6037 |
| QrPanel | 11113:3539 | 5925:9634 |
| PayTimer | 11113:3544 | 7189:22669 |
| ScamTips | 11113:3516 | 8988:18005, 8995:18537, 8995:18814 |
| BankList | 11114:3891 | 5803:14368 |
| .BankRow | 11113:3530 | Bank list 5803:14662 |
| Accordion | 11113:3523 | Expandable Container 5922:10152 |
| OrderDetails | 11113:3536 | 9137:26604 |
| ProtectionCard | 11113:3537 | 9137:26629 |
| MethodCard | 11113:3538 | 9137:26650 |
| Installment (rebuilt) | 11113:3535 | 10541:36231 |
| InstallmentCard | 11114:3620 | 5597:6135 |
| OtpStatus | 11113:3519 | Status 8742:30760 |
| MethodPicker + .MethodTabs | 11113:3543, 11113:3540 | 6062:14935, 6062:18978 |

  - OrderDetails, ProtectionCard and MethodCard are also swapped into the Home loan screens (11055:1957 / 2141 / 2349 / 2492).
- **Library fixed to legacy:**
  - Segmented: 48 → 40, padding 2, radius 16; segments 36, radius 14 (legacy Tab Selector in 5588:5243).
  - KV gets Layout=Detail and Layout=Detail end (legacy Detail list element 5635:7613).
  - TopBar gets Type=Pill+Actions (legacy Primary header with a page title, 6220:13381).
  - EmptyState Action=Off is rebuilt from legacy Page empty state 6220:14417.
- **Mapped to existing library components:**
  - SelectBar (legacy Select bar 5680:9442 / 5762:11160: logo, name, note, selected).
  - Field: Floating from Typing box 5933:8750; Stacked from 3924:1433, 3921:1419, 3919:1405.
  - Search (Search Bar 3081:574), GlassButton (Top nav btn 3416:975).
  - The legacy close icons (5803:14062 etc.) → Icon / Close and Close circle.

#### Phase 2 notes (added)
13. Search highlight in the bank / method results (the typed part in blue) is a text range colour; the instances show plain text.
14. Legacy sheets (bank search, method picker) are drawn frames over a background screen ("Verify your identity" form). They are rebuilt as drawn frames with library parts inside. Ask whether the sheet frame should become the library Sheet.
15. The Segmented radius 14 is off the radius scale (8 / 12 / 16 / 20).
16. The legacy focused Field (5933:8786) has no focus ring; the library Focus shows one.
17. Legacy method "type" groups set the Recommend tag per group; the empty-state title colour differs between Payment Empty and Loan history.
18. Two different legacy select bars (5680:9442 with a radio, 5762:11160 with a check).

#### Open (coordinator)
1. Sheets: keep the legacy drawn sheet frames, or build them with the library Sheet (same geometry)?
2. "_old Installment" (11027:1133) is still used inside one library component. I'll delete it once that component is moved to the rebuilt Installment.

### 2026-11-19 · 09 · Phase 1 rule: 25 screens rebuilt to legacy layout; library fixed to legacy geometry
- **Why:** BRIEF phase rule. Every screen must be its legacy Design-page frame in new colours. The 25 screens of entries 07/08 followed the demo (layout, copy, heights), so all of them are rebuilt. The frame ids are unchanged, so the rows in entry 07 still hold.
- **How:** a translator walks each legacy frame and rebuilds every node fresh.
  - Same auto layout, sizes, positions and copy.
  - Legacy colour variables map to v2 through `tokens/v2/rename-map.json` and each v2 variable's code syntax. Spacing and radius bindings are value-checked.
  - Legacy text styles map to v2 styles of the same size and weight.
  - Legacy components become library instances: by component id, by a block rule (name + text) for drawn blocks, drawn pills become Button and underlined text becomes TextLink.
  - Illustrations, logos and the remote status bar / keyboard are copied unchanged (decision 12).
  - The kit, its map and its rules live in the file's shared plugin data (`perasure.rebrand`). Notes: `rebrand/figma/phase1-rebuild.md`.
- **Overlay check:** every frame, legacy | new | edge difference (red = only legacy, blue = only new), in `rebrand/parity/figma/screens/<legacy>_<new>_<name>.png`.
  - Unmatched-edge %:
    - Register: Opening 0 · Permission 4 · Login 16 · Sending 3 · OTP 2.
    - User home: 6 · 6 · 7 · 8 · 8.
    - Home:
      - Full States 11 · temporary 11 · Valid Date 12 · overdue 8 · hold 3 · disapproved 2 · expired 5 · in progress 3 · documents 3.
      - Enter Number 10 · Loan Detail 6 · coupons 6 · top 10 · popover 12 · plan 5.
  - What is left is font metrics (Hanken vs the legacy font, body letter spacing 2 % → 0) and the owner decisions: PhoneField 64 vs legacy 56 pushes the Login link down 8 px; green term chips; dark tooltip; flat navy cards; one green action.
  - 0 unmapped legacy components, 0 Legacy bindings, 0 raw UI colours (only illustrations and logos).
- **New library components, translated from the legacy ones** (spec, showcase, parity PNG each):

| Component | Id | Legacy |
|---|---|---|
| Strip | 11093:2760 | Loan state 6619:21799 |
| PaymentCard (rebuilt) | 11093:2765 | 5998:19294 · 10545:40950 · 10545:40952 · 10545:41016 · 10789:29251 |
| CreditCard (rebuilt) | 11093:2768 | 10926:30158 · 10926:29644 · 9867:36981 · 9867:37346 |
| StateCard (rebuilt) | 11098:2828 | 9051:22812 · 9078:23067 · 9078:23263 · 9081:23678 · 9560:32795 |
| Banners | 11098:2917 | 10789:29273 |
| TrustCard | 11098:2978 | 10789:29281 |
| Legal | 11098:3049 | 10789:29423 |
| DotTitle | 11098:3130 | 9447:27008 |
| Notice | 11098:3131 | 9614:33238 |
| PenaltyInfo | 11098:3132 | 10545:37532 |
| .PaymentNotice | 11100:11176 | penalty 10532:34863 |
| PermissionCard | 11086:2666 | Drop down 3259:962 |
| BottomBar | 11086:2672 | Bottom Nav Action Container 3420:1820 + /Terms 3420:1821 |
| ContactMethod | 11086:2675 | Contact method a 3422:2332 |
| .KeypadKey | 11102:3057 | number typing 8933:31540 |
| Keypad | 11095:2874 | grid 9426:18088 |
| ScheduleItem | 11095:2797 | Loan detail popover 5985:12587 |

  The old PaymentCard / CreditCard / StateCard sets (demo layout) are deleted.
- **Library fixed to legacy geometry** (the report rows):

| Component | Before → after | Legacy |
|---|---|---|
| CreditCard insets / gaps | rebuilt: padding 12, gap 16 / 8, 46 button | 10926:30158 |
| Navigator heights | 102 → 98 (tabs 46, bar 54) | 3152:1404 |
| PaymentCard gaps | rebuilt, 149 / 245 / 260 | 5998:19294, 10545:40950 |
| StateCard icon alignment | rebuilt per legacy card | 9081:23678 etc. |
| CouponTicket notches | legacy has none (plain bordered rectangle) → Figma already right; the demo is wrong | 10926:29645 |
| TopBar headset | Brand right buttons Gift + Help → Inbox + Headset | 3416:1149 |
| Popover dividers | .PopoverOption 36 → 44, 1 px bottom divider, last without | 5974:9438 |
| Field label case | legacy stacked labels are sentence case → unchanged | legacy forms ("First name") |
| PhoneField flag shape | legacy flag is a rounded square → Figma already right; the demo is wrong | 3279:152 |
| Field floating | 58 → 56 (stroke out of layout) | 3279:152 |
| Button 11/12 | showcase row padding 16 → 12 | showcase 10987:340 |
| SelectBar | 44 / 47 → 46. Legacy is 46, not the 48 the report asked | 5762:11160 |
| Tag | radius 8; Small 22; outline 24 | 5610:6068, 9124:24179 |
| Chip | radius 16, no check; Medium 41, Small 36 | 8980:16877, 10926:29643 |
| Button | new Size=Medium 44 (in-card buttons) | 10545:40950 "Frame 5", 9497:29633 |
| TextLink | padding 12 / 8 → 0 (21 tall) | Login 3269:329 link |
| AmountCard | 328 × 245 | 10926:29643 = 246 |
| AmountEntry | 312 × 184, no card | 9426:18067 = 185 |
| OfferCard | 328 × 235 | 9447:27224 = 234 |
| SendingCard | 292 × 212, "..." | 3282:181 |
| Slider | track / knob as legacy | 10926:29643 |
| Keypad | 312 × 232 | 9426:18088 |

- **Parity PNGs** updated / added: 49 files in `rebrand/parity/figma/`.

#### Phase 2 notes (legacy inconsistencies found — not fixed)
1. Buttons are 44, 46 or 48 tall in different places, with a 14 or 16 px label (CreditCard 46 / 16 px; cards 44; bottom bars 48).
2. Tags: 22 tall with an 11 px label (remaining days) and 24 with 12 px (protected pill), both radius 8.
3. Term chips: Term pick is 41 with its 1.5 stroke in the layout; the in-card chip is 36 with the stroke outside. Different label sizes (16 / 14).
4. Text boxes drawn smaller than their line height (e.g. ₱5,000.35 in a 17 px box at 24 px), and amounts with a separate ".00" on a baseline.
5. Links use the brand colour variable, not a link token.
6. Body styles have 2 % letter spacing.
7. BottomBar Variant2 ≈ Variant3. The /Terms container is a separate component with the same layout as Default.
8. Five state-card heights (92–214) with different inner paddings. Credit card designs differ between User home (186 / 162) and Home (182 / 196).
9. Keypad keys come from a remote library (not on the Component page). The keypad's 12th key is the same component with a delete frame laid over it.
10. Mixed raw colours inside legacy blocks (banners #FFFFFF / #000000, trust badges #C8E5DF, slider track #F0F5F4), not tokens.
11. The Popover list rows are 44 with dividers; the select overlay rows are 36. Two popover row heights.
12. The legacy PaymentCard Upcoming has a caption ("1st installment") where the other variants have a tag.

### 2026-11-19 · 08 · Review fixes: TextLink name, 5 new components, screens swapped to instances
- **TextLink:** the set `11006:366` had lost its name and showed as "Component 1" (it was always the rebound TextLink). It is renamed to `TextLink`. There is no duplicate set. All 13 link instances point at it and are renamed (5 inside library components, 8 on the screens).
- **New library components** (v2 only, Light mode on every set). Audit: 0 unbound, 0 Legacy, every text on a v2 style. The copied legacy logo and illustration are excluded.

| Component | Id | Section | Variants | Showcase | Spec | Demo twin |
|---|---|---|---|---|---|---|
| Slider | 11063:2368 | 03 · Inputs | 8 (Value Min / Mid / High / Max × Boost Off / On) | 11063:2369 | Slider.md | PS.Slider |
| AmountCard | 11064:2451 | 06 · Product cards | 2 (Coupon boost Off / On) | 11064:2483 | AmountCard.md | PS.AmountCard |
| AmountEntry | 11064:2482 | 06 · Product cards | 3 (Empty / Typing / Error) | 11064:2566 | AmountEntry.md | PS.AmountEntry (top half) |
| SendingCard | 11066:2509 | 06 · Product cards | 1 | 11066:2619 | SendingCard.md | PS.SendingCard |
| OfferCard | 11066:2514 | 06 · Product cards | 1 | 11066:2627 | OfferCard.md | PS.OfferCard |

  - Slider: the fill and the knob rail scale with the width; the knob stays round. Track `Surface/Sunken`, fill and knob `Content/Brand/Subtle`, knob ring `Surface/Default` at `Stroke/Width/Focus`, `Elevation/2`.
  - AmountCard exposes its Slider, the Loan term KV and the three term Chips. The Edit boolean shows the pencil, which opens AmountEntry.
  - AmountEntry follows the demo: you type in hundreds ("12,5" + disabled "00" + ".00" = ₱12,500.00). The hint becomes `Content/Negative` on Error.
  - SendingCard uses the legacy "Loading state OTP" still, unchanged (`3282:176`).
  - OfferCard uses the legacy LoadCash logo, unchanged (`9447:27228`), a Tag Accent Subtle, Amount/lg, a KV row and the Primary "Apply now". The library has no Medium button, so it is Large.
  - Parity PNGs added to `rebrand/parity/figma/` (now 35): Slider, AmountCard, AmountEntry, SendingCard, OfferCard.
- **Screens swapped to instances** (the rows in entry 07 are unchanged; only the content changed):
  - AmountCard replaces the drawn amount cards on 11052:609, 11055:1957, 11055:2141, 11055:2349, 11055:2492 and the sheet backdrop in 11055:2682.
    - The knob is at Max where the amount equals the max.
    - New user loan (11052:609) is now ₱40,000 of ₱40,000.
  - AmountEntry (Typing) on 11055:1916. The terms are 3 / 6 / 8, as in the demo and the loan page.
  - SendingCard on 11051:303, centred.
  - OfferCard on 11053:1776, under "More for you". The StateCard there has no button, so "Apply now" is the screen's only Primary.
  - The schedule popover is placed again above "Per installment" on 11055:2492.
  - Audit (Register, User home, Home): 0 unbound, 0 Legacy, 0 text without a style, no drawn slider or ellipse left.

### 2026-11-19 · 07 · Parity export + screens, part 1 (Register, User home, Home)
- Parity export: `rebrand/parity/figma/<Name>.png`, 30 files (Button … HomeCoupons), one per showcase, states in spec order.
  - They are **1x, not 2x**. `get_screenshot` only scales down (it caps the size and can't upscale). Scaling up a copy of a showcase would change the token-bound sizes, so I didn't. If 2x is needed, export the showcases from Figma's Export panel at 2x.
- Figma: page **Design - Rebranding** `10977:32417`. Built only from library instances and v2 variables and styles; no legacy frame was copied. Each section has an explicit Light mode on all 3 v2 collections. Frames are 360 wide, at least 800 tall.
- Audit across the 3 sections (25 frames): 0 unbound fills or strokes, 0 Legacy bindings, every text on a v2 style.

**Register** `11051:15`

| Legacy frame | New frame | Demo page |
|---|---|---|
| 6880:14528 | 11051:16 | opening |
| 3259:663 | 11051:32 | permission |
| 3269:329 | 11051:244 | login |
| 3279:172 | 11051:303 | sending |
| 3282:196 | 11051:321 | otp |

**User home** `11052:211`

| Legacy frame | New frame | Demo page |
|---|---|---|
| 8921:30605 | 11052:212 | home · Credit ready · repaying |
| 8914:30139 | 11052:454 | home · Not approved |
| 8957:16440 | 11052:609 | amount (fallback) |
| 9867:36920 | 11052:667 | home · Credit ready · repaying (coupons) |
| 8958:19617 | 11052:903 | home · Credit ready · repaying |

**Home** `11053:846`

| Legacy frame | New frame | Demo page |
|---|---|---|
| 10789:29220 | 11053:847 | home · Credit ready · repaying |
| 10029:45495 | 11053:1033 | home · temporary credit |
| 9137:25806 | 11053:1210 | home · temporary credit (valid-date tooltip) |
| 10545:37326 | 11053:1397 | home · Overdue |
| 8958:19822 | 11053:1619 | home · Credit on hold |
| 9078:23064 | 11053:1776 | home · Not approved (offer) |
| 9078:23260 | 11053:1939 | home · Limit expired |
| 9081:23675 | 11053:2088 | home · Application in review |
| 9560:32792 | 11053:2212 | home · Documents needed |
| 9426:18065 | 11055:1916 | amount (fallback) |
| 8958:20032 | 11055:1957 | loan (fallback) |
| 10952:29768 | 11055:2141 | loan (fallback) · coupons |
| 10261:36235 | 11055:2349 | loan (fallback) · coupons (top of page) |
| 9137:26172 | 11055:2492 | loan (fallback) · schedule popover |
| 10722:58385 | 11055:2682 | plan (sheet) |

- Improvements per the BRIEF:
  - One Primary button per screen. On Limit expired, the StateCard button is Secondary.
  - Calm notices: the overdue copy says what was added and the next step.
  - Flat navy for the credit and state cards. No gradients except coupons.
  - The Scrim gradient sits under the repayment-plan sheet. The page sheet and the Popover have no scrim.
  - The valid-date tooltip moved below the credit card (Arrow = Top-start) so it no longer covers the amount.
  - The schedule popover sits above "Per installment", so the row it explains stays visible.
  - PhoneField placeholder is "917 123 4567"; the longer one overflowed at 360.
- Open (coordinator):
  1. Banners and partner logos from the legacy home are left out (no library component). Should they come back as images?
  2. The library has no Keypad, Slider or Offer strip component. The amount slider and the caret are drawn from tokens inside the screen. Should a Slider / AmountCard become a library component?
  3. The "Sending code" animation is shown as a static icon.
  4. New home states (Credit on hold, Limit expired, Documents needed) use StateCard with text overrides, not new variants. Should they become variants?
  5. The BPI logo in the withdrawal method is the library's bank icon placeholder.

### 2026-11-19 · 06 · Product cards (CreditCard, PaymentCard, InboxItem, StateCard, EmptyState, UploadTile, CouponTicket, HomeCoupons)
- Figma: 06 · Product cards `10982:21`, all on v2 with the Light mode:
  - **CreditCard** `11042:1622` (2: Temporary Off / On). Flat navy `Surface/Brand`, white text, Amount/lg, legend and info mark at Layer Opacity/Secondary; bar on `Gradient/White/20` with white (available) and green (`Content/Accent`, temporary); Primary "Withdraw". Showcase `11042:1696`.
  - **PaymentCard** `11042:1695` (2: Upcoming / Overdue).
    - Upcoming: navy Tag, Amount/md navy, due date, Secondary Small "Pay … now".
    - Overdue: red Tag, a calm notice (what was added + the next step, help mark), Primary "Pay now".
    - Showcase `11042:1749`.
  - **InboxItem** `11043:1798` (4: State Unread / Read × Tone Default / Overdue), redesigned.
    - Title = the fact; body = the next step (2 lines max); time in Caption/sm; unread dot `Bg/Action/Default`.
    - Overdue: only the title is `Content/Negative`, with a calm "Pay now".
    - Showcase `11043:1848`.
  - **StateCard** `11043:1847` (4: Reviewing / Disbursing / Not approved / Transfer failed). Navy, icon 32, Title/sm + Caption/sm at Layer Opacity/Emphasis; Transfer failed has a Primary button. Copy rewritten without blame. Showcase `11043:1921`.
  - **EmptyState** `11044:1917` (2: Action Off / On). Legacy illustration copied unchanged; Title/sm + Body/md; Primary 264 wide. Showcase `11044:2021`.
  - **UploadTile** `11044:2020` (8).
    - Type=Picture: Empty / Loading / Done / Error; dashed then green / red rings and marks.
    - Type=File: Uploaded / Uploading (navy progress) / Compressing / Failed; badge, name, status, one action.
    - Showcase `11044:2071`.
  - **CouponTicket** `11046:2168` (6: Use / Pick / Selected / Used / Expired / Unavailable). The selected navy bar is colour only. Showcase `11046:2288`.
  - **HomeCoupons** `11046:2287` (2: Pair / One).
    - Every gradient stop is bound to `Coupon/Gradient/*`: pair 0 / 14.9 / 59.6 / 100 %; panel 0 / 69.2 / 100 %; folder tab bottom → top Upper → Top; curve flat Upper.
    - Coupon art copied from legacy `10750:61888`; its ₱ badge was rebound from Legacy `Color/Positive/500` to `Bg/Positive/Default`.
    - Showcase `11046:2401`.
  - Audit (1,159 nodes): 0 unbound, 0 Legacy, every gradient stop bound, text on v2 styles, every set with modes and a description. Copied illustrations are excluded.
  - Icon-page icons (Calendar, ID card) bind Legacy `Radius/full` internally; overridden to v2 `Radius/full` in these components.
  - Section 06: 2400 × 4013.
- Consolidated (legacy page untouched):
  - CreditCard ← Home primary card, Credit limit primary card, Profile credit hub.
  - PaymentCard ← Home payment card, Home upcoming payment card.
  - InboxItem ← System notification card, System notification card overdue, NOTIFICATION.
  - StateCard ← Loan state card, Loan state.
  - EmptyState ← Page empty state.
  - UploadTile ← Upload File Sheet, Application details Upload File Sheet, File catalog rows.
  - CouponTicket / HomeCoupons ← Coupon primary card, Home coupons.
- Spec: `rebrand/spec/CreditCard.md`, `PaymentCard.md`, `InboxItem.md`, `StateCard.md`, `EmptyState.md`, `UploadTile.md`, `CouponTicket.md`, `HomeCoupons.md`.
- Tokens: none.
- Open (coordinator):
  1. The legacy empty-state illustration and coupon art keep their old colours (teal box, pink coupon), per "illustrations unchanged". Say if they should be recoloured.
  2. Only the amount coupon art exists in Figma; the percent and limit arts (`PS.CouponArt` types) are demo assets.
  3. The CreditCard bar widths and amounts are sample values; the demo computes them.
  4. The Icon page binds Legacy variables inside some icons. Should that page be migrated to v2 at some point?

### 2026-11-19 · Segmented restyle + 05 · Structure (TopBar, Navigator, Sheet, Popover)
- Figma: page Component - Rebranding `10982:15`
  - **Segmented** `11011:646`, owner's style (decision 2 amended):
    - Grey track `Bg/Neutral/Default`, 48 tall (`Size/Control/lg`), padding 4, radius 24.
    - White thumb `Surface/Default`, 40 tall, radius 20, no shadow.
    - Labels: selected `Content/Primary`, unselected `Content/Tertiary`, pressed `Content/Secondary`.
    - Added State=Disabled (whole control at `Opacity/Disabled`); now 6 variants. Showcase updated.
  - **05 · Structure** `10982:20`, all on v2 with the Light mode:
    - **TopBar** `11036:1355` (10: Type Back+Title / Back+Title+Action / Brand / Pill / Search × Style Solid / Clear). Building blocks **.GlassButton** `11036:1186` (Icon, Back, Pill) and **.BrandMark** `11036:1187` (navy tile + the new logo mark from the rebrand demo SVG + wordmark). Showcase `11036:1356`.
    - **Navigator** `11037:1403` (3: Active Home / Payment / Account): glass pill bar over the bottom veil (gradient stops bound to `Gradient/White/0/60/80`). Building block **.NavTab** `11037:1351`; tab icons `.Icon/Home` / `Payment` / `Account` (`11037:1327`, `11037:1334`, `11037:1342`) copied from the legacy Navigator, each flattened to one "Glyph" layer so colour overrides survive a swap. Showcase `11037:1404`.
    - **Sheet** `11038:1448` (3: Kind Plain / Card / Page): handle, head with title + close, Content swap on **.Slot** `11038:1391`, footer Button. Showcase `11038:1449`: Plain and Card on Scrim Gradient over a secondary page (nav-bar area clear); the Page sheet has no scrim.
    - **Popover** `11039:1543` (2: Type Menu / Content): glass card, no scrim; **.PopoverOption** `11039:1488`; the Content type uses KV rows. Showcase `11039:1544`: menu under a Field, content from an info mark.
  - Audit (605 nodes): 0 unbound, 0 Legacy, every gradient stop bound, text on v2 styles, every set with modes and a description. Logo art is excluded, like bank logos.
  - Section 05 grew to 5346 px tall; section 06 moved to y 15266.
- Consolidated (legacy page untouched):
  - TopBar ← Header Action Container, Top nav btn, Close.
  - Navigator ← Navigator, Bottom nav btn.
  - Popover ← Drop down, select overlay, Loan detail popover.
  - Sheet frames ← the legacy sheet frames (their contents come in 06: UploadTile etc.).
- Spec: `rebrand/spec/TopBar.md`, `Navigator.md`, `Sheet.md`, `Popover.md`; Segmented.md updated.
- Tokens: none.
- Open (coordinator):
  1. The TopBar Clear veil (`--gradient-top-nav-filled`, ambient) has no Figma variables (`gradient-ambient-*` are CSS color-mix). Add Figma variables so it can be bound, or keep Clear = no fill?
  2. TopBar Search is 120 tall because the 44 px Search sets the row height. Keep 44 (touch) or make it 40 like the other buttons?
  3. Glass buttons are 40 × 40 as in the demo, below Android's 48 dp touch target; the hit area should be 48 dp in code (Phase 1 keeps the legacy 40; reason updated 2026-11-20, Android only).
  4. Navigator labels use Caption/xs (11 px; the demo used 10, which has no style).

### 2026-11-19 · Disabled inputs (BRIEF 15) + coupon gradient variables
- Figma: page Component - Rebranding `10982:15`
  - **Disabled rule** applied to 12 Disabled variants (the showcases follow their main components):
    - **PhoneField** Disabled: both pills `Surface/Default`; flag opacity bound to `Opacity/Disabled`; texts were already `Content/Disabled`.
    - **Field** Floating + Stacked Disabled: box `Surface/Default` with `Border/Subtle`; the trailing icon goes back to `Content/Tertiary` with opacity `Opacity/Disabled`.
    - **.OtpBox** Disabled: `Surface/Default` + `Border/Subtle`.
    - **SelectBar** Card + Plain Disabled: logo opacity bound to `Opacity/Disabled`; the card stays `Surface/Default`; the Check is Disabled.
    - **Check** Disabled: `Surface/Default` + `Border/Subtle`.
    - **Chip** Disabled: `Surface/Default` + `Border/Subtle`.
    - **ListItem** Disabled: leading and trailing icons in their normal colours with opacity `Opacity/Disabled`.
    - Unchanged: Buttons keep `Bg/Disabled`. Search and Segmented have no Disabled variant.
  - Before / after: `rebrand/figma/disabled-before-phonefield.png` → `disabled-after-phonefield.png`.
  - **Coupon gradient** (owner, ARCHITECTURE §12.10): Component variables `Coupon/Gradient/Top` → Green/700, `/Upper` → Green/600, `/Mid` → Green/400, `/Bottom` → Green/200 (`11030:15`–`18`). Scopes FRAME_FILL / SHAPE_FILL, WEB `var(--coupon-gradient-top|upper|mid|bottom)`. CouponTicket will use them in 06.
- Spec: README (the rule) and the Disabled rows of PhoneField, Field, OtpBoxes, SelectBar, Check, Chip and ListItem.
- Tokens: the 4 coupon variables.
- Open: Check Disabled on white with `Border/Subtle` is very faint (#E0E3E5 on white). It follows the rule; say if Check should keep `Border/Default`.

### 2026-11-19 · 04 · Lists (ListItem, Installment, KV)
- Figma: 04 · Lists `10982:19`, all on tokens v2 with the Light mode:
  - **ListItem** `11025:971` (6: Tone Default / Brand × State Default / Pressed / Disabled).
    - Options: Leading (icon or logo swap), Subtitle, Tag (exposed Tag instance), Value, Chevron / trailing swap, Divider.
    - Showcase `11025:972`: one card per legacy list (help topics, contact, city results, ID types, banks).
  - **Installment** `11027:1133` (9).
    - Type=Repay: Status Upcoming / Due today / Overdue × Selected On / Off; Check nested.
    - Type=Schedule: Paid / Due today / Upcoming, the ring step that replaces the legacy graphics.
    - Showcase `11027:1134`.
  - **KV** `11028:1193` (6: Layout Inline / Stacked × Tone Default / Positive / Negative; Info icon and Divider options). Showcase `11028:1194`.
  - Audit (585 nodes): 0 unbound, 0 Legacy, every text on a v2 style, every set with modes and a description.
  - Section 04 grew to 2305 px tall; sections 05 and 06 moved down.
- Consolidated (legacy page untouched):
  - ListItem ← FAQs list, FAQs secondary list, About Perasure list, Contact list, City list, Name list, ID LIST, Bank list, search city popover / list.
  - Installment ← Installment ×3, Installment card, Installment graphic, Instalment detail graphic.
  - KV ← Detail list element, Registration box.
- Spec: `rebrand/spec/ListItem.md`, `Installment.md`, `KV.md`.
- Tokens: none.
- Open (coordinator):
  1. The legacy term rings showed progress as a partial arc (1st = ¼). Schedule shows status as a full ring instead (paid green / due navy / upcoming grey). Should the partial arc come back?
  2. Loan-history rows (amount + state tag) and order rows are built from ListItem + Tag, not Installment. The demo has PS.HistoryRow; should it be its own component?
  3. Search-result highlighting (matched letters in navy) is demo-only: two colours in one text would need per-range fills, which hit the Figma shared-fill quirk.

### 2026-11-19 · Navy gradient scrim
- Figma: page Component - Rebranding `10982:15`
  - Primitive: added `Palette/Alpha/Navy/0`, `/32`, `/40`, `/56` (`11020:15`–`18`; navy at 0 / 32 / 40 / 56 %). Hidden, scopes [], WEB `var(--palette-alpha-navy-<n>)`.
  - Semantic: `Overlay/Scrim` renamed to `Overlay/Scrim/Default` (`10999:161`), now pointing at Navy/40, WEB `var(--overlay-scrim)`.
  - Semantic: added `Overlay/Scrim/Top` → Navy/0, `/Mid` → Navy/32, `/Bottom` → Navy/56 (`11020:19`–`21`). Scopes FRAME_FILL / SHAPE_FILL, WEB `var(--overlay-scrim-top|mid|bottom)`.
  - Effect style `Blur/Scrim` deleted (0 users); 4 effect styles remain.
  - **Scrim** `11021:822` in 05 · Structure `10982:20`: Type=Gradient (stops 0 / 28 / 100 % bound to Top / Mid / Bottom) and Type=Flat (Overlay/Scrim/Default), 360 × 800.
  - Showcase `11021:823`: both types over a secondary-page mock, with the nav-bar area clear in the gradient.
- Spec: `rebrand/spec/Scrim.md`.
- Tokens: as above.
- Open: — (Sheet / Popover will use Scrim when built.)

### 2026-11-19 · Gap tokens applied, palettes, lean text / effect styles, PhoneField
- Figma: page Component - Rebranding `10982:15`
  - **Gap decisions applied:**
    - Button Destructive pressed → `Bg/Negative/Pressed`; Navy pressed → `Bg/Brand/Pressed`.
    - Button min-heights bound to `Size/Control/lg` 48 and `Size/Control/sm` 36.
    - TextLink Inverse pressed → `Content/Accent-pressed`.
    - Check off ring and the Field Default / Filled ring → `Border/Control`.
    - Tag Outline = border + content, no fill.
    - The Tag Positive tone and Tooltip radius 12 were already in place.
  - **A · palettes:** 13 primitives added to Primitive `10999:15`: Navy 50–500 (`11014:718`–`723`) and Ambient 400–950 (`11014:724`–`730`). All hidden, scopes [], WEB `var(--palette-<fam>-<step>)`.
  - **B · text styles:** 37 → 19.
    - Renamed: Section-title/md → Title/xs, Body/lg-emphasis → Body/lg-strong, Body/md-emphasis → Body/md-strong.
    - 12 merged and deleted. 29 text nodes re-pointed: 18 from Section-title/xs to Caption/xs (Tag Small) and 11 from Link to Label/md (TextLink). The other merged styles had no users.
    - No page other than Component - Rebranding uses a v2 text style (checked with style consumers across the file).
  - **C · effect styles:** 6 → 5.
    - Renamed: Elevation/Raised → 1, Overlay → 2, Focus → 3.
    - Blur/Glass-focus merged into Blur/Glass (0 users) and deleted.
    - The Legacy variables inside the v2 effect styles (blur radii, Blur/Glass shadow colours, Blur/Scrim radius) are re-pointed to the same-named v2 variables (12 bindings).
  - **Type rules applied:**
    - Field and Search input text → Body/lg (stacked box padding 8 so it stays 44).
    - TextLink label → Label/md; the underline is now a 1 px `Stroke/Width/Default` line in the label colour.
    - Tooltip shadow → Elevation/3 (popovers, tooltips, toasts).
  - **TextLink colour bug, found and fixed:** text nodes linked to a TEXT component property shared one fill. Fix: delete the property, set the fills, recreate the property, restore the showcase labels.
  - **PhoneField** `11018:830` (6 states: Default, Focus, Filled, Error-empty, Error, Disabled), showcase `11018:831`:
    - Country pill + number pill, 64 tall, `Radius/full`, gap 12.
    - Digits 3-3-4 in `Body/lg-strong`; error message at the number's text inset.
    - The flag image is copied from the legacy component (legacy page untouched).
  - **Field showcase:** the phone row is replaced by an account-number row (Floating: Default, Focus, Filled, Error, Disabled).
  - **Audit**, sections 01–03 (17 sets, 1,724 nodes): 0 Legacy bindings, 0 unbound values, every text on a v2 style.
- Spec: README (type rules, style names) updated; Button, TextLink, Tag, Check, Tooltip, Toast, Field, Search, SelectBar and LineTabs updated; **PhoneField.md** added.
- Tokens: the 13 primitives above. No semantic or component variable created or changed.
- Open (coordinator):
  - Error-empty is a variant of its own: Figma can't switch placeholder ↔ digits by property, so Error has two variants instead of two copies.
  - Field's TEXT-property defaults still read "Phone number". Changing a TEXT default re-applies one fill to every linked label, so I left them; the showcase uses account-number copy.
  - CSS names for Elevation/1–3 are not in `v2/tokens.css` yet (still `--elevation-raised/overlay/focus`). The specs name both.

### 2026-11-19 · Tokens v2 rebind (Actions + Feedback), specs, 03 · Inputs
- Figma: page Component - Rebranding `10982:15`
  - **Rebind:** the 7 Actions + Feedback sets and their showcases now use only the v2 collections. Covered: fills, strokes, stroke widths, padding, gaps, radii, Hanken text styles, and effect styles Elevation/Raised (Tooltip) and Elevation/Focus (Toast). Sets and all six sections are on the Light mode of Primitive / Semantic / Component; the Legacy-collection modes were removed.
  - **Audit** (844 + 689 nodes): 0 unbound values, 0 bindings to Legacy variables, every text on a v2 text style. One exception: the effect styles Elevation/Raised, Overlay and Focus still bind the Legacy `Blur/Shadow/*` radius variables. Those styles belong to the coordinator (see Requests).
  - **Tag:** tone Brand → **Accent** (green). Added Tone=**Positive** (status green), now 30 variants. Colours come from the new Tag component tokens (Bg/Default · Bg/Strong · Bg/Subtle · Content/Default · Content/Strong · Border). Showcase: Disbursing, Paid off and Verified moved to Positive.
  - **TextLink rebuilt** as `11006:366`: the old set's labels shared one fill (a Figma bug), so I deleted `10988:133` after moving its instances. The underline is a range override on the Link style.
  - Fixed during the rebind: re-bound paints kept a stale black colour until refreshed; cloned variants lost their property links (relinked).
  - **03 · Inputs `10982:18` built on v2:**
    - **Field** `11009:437` (10): Layout Floating / Stacked × State.
    - **Search** `11009:488` (3).
    - **SelectBar** `11009:954` (8): Style Card / Plain × State; the radio is a nested Check.
    - **OtpBoxes** `11009:1031` (5), on building block **.OtpBox** `11009:965` (5).
    - **Segmented** `11011:646` (5), on **.Segment** `11011:614` (3).
    - **LineTabs** `11011:717` (5), on **.LineTab** `11011:659` (3).
    - Every set has a showcase. Section 03 grew to 2895 px; sections 04–06 moved down.
  - Consolidated (legacy page untouched):
    - Field ← Phone number typing, Typing box / one box per page, Typing box / multiple boxes.
    - SelectBar ← both Select bars.
    - OtpBoxes ← the OTP use of the typing boxes.
    - Search ← Search Bar.
    - Segmented ← Tab Selector, Credit History tab.
    - LineTabs ← the address-sheet tabs.
- Spec: `rebrand/spec/` — README (conventions), plus Button, TextLink, Tag, Chip, Check, Tooltip, Toast, Field, Search, SelectBar, OtpBoxes, Segmented and LineTabs. Each spec has props → React props, the token per part (CSS name + Figma variable), sizes, and the state list in showcase order.
- Demo: — (demo-rebrand builds from the specs)
- Tokens: none created or changed.
- Stand-ins until the coordinator decides (each marked ⚠ in the specs):

  | Use | Stand-in token | Token asked for |
  |---|---|---|
  | Button Destructive pressed fill | `Content/Negative/Strong` | `bg-negative-pressed` |
  | Button Navy pressed fill | `Surface/Device/Navy` | `bg-brand-pressed` |
  | TextLink Inverse pressed | `Bg/Action/Subtle-pressed` | `content-accent-pressed` |
  | Check off ring | `Content/Placeholder` (3.6:1) | `border-control` |
  | Chip Selected ring | `Bg/Action/Default` (same as the fill) | — |

- Requests (coordinator):
  1. Add the pressed tokens and `border-control` from the table above.
  2. Button Large is 48, but `size-control-*` is 36 / 44 / 52. Say which value Large should use.
  3. An upper-case caption text style for the stacked Field label: a text-case override detaches the style, so Figma shows sentence case for now.
  4. Elevation/* effect styles: their blur radii still bind Legacy `Blur/Shadow/*`. Please rebind them to the v2 `Blur/Shadow/*` variables.
  5. `Content/Placeholder` (neutral-400) is 3.6:1 on white. That fails 4.5:1 for placeholder text in Field and Search.
  6. `Radius/tooltip` is 12 in Figma, but ARCHITECTURE says 8. The Tooltip uses the token, so it follows whichever value is right.
  7. Icons: the Calendar icon binds Legacy `Radius/full` internally (overridden in the showcase). Colour overrides are lost when icons are swapped, because their layers are named differently. The two-tone Close circle icons can't be recoloured, so the clear button uses Icon / Close.
- Open (from figma-lib): the stacked Field label case (request 3).

### 2026-11-19 · PAUSED — what exists before the token rebuild
- Figma: page Component - Rebranding `10982:15`. Nothing deleted, nothing built after the pause. 7 component sets, each with a showcase frame beside it:

  | Component | Set | Variants | Showcase | Section |
  |---|---|---|---|---|
  | Button | `10987:225` | 30 | `10987:226` | 01 · Actions `10982:16` |
  | TextLink | `10988:133` | 6 | `10988:134` | 01 · Actions |
  | Tag | `10988:272` | 24 | `10988:273` | 01 · Actions |
  | Chip | `10989:185` | 8 | `10989:186` | 01 · Actions |
  | Check | `10989:254` | 8 | `10989:255` | 01 · Actions |
  | Tooltip | `10991:475` | 18 | `10991:525` | 02 · Feedback `10982:17` |
  | Toast | `10991:524` | 4 | `10991:633` | 02 · Feedback |

  Every set has an explicit Rebrand mode for Primitive `10980:0`, Semantic `10980:1` and Component `10980:2`.
- Variables each set binds directly (fills, strokes, stroke widths, padding, gaps, radii). This is the list to rebind:
  - **Button**: Color/Action/Bg/Primary/{Default, Pressed, Disabled} · Color/Action/Text/{Default, Disabled} · Color/Action/Stroke/Default · Color/Surface/Card/{Default, Brand, Negative} · Color/Surface/Inset/Default · Color/Stroke/Brand/Default · Color/Text/{Brand/Default, Inverse, Disabled, Tertiary} · Color/Brand/400 (Navy pressed) · Color/Negative/700 (Destructive pressed) · Spacing/Padding/{sm, md, xl} · Spacing/Gap/{2xs, xs} · Radius/full · Stroke/Width/Default
  - **TextLink**: Color/Text/Link/{Default, Heavy, Inverse} · Color/Text/Disabled · Color/Positive/300 (Inverse pressed) · Spacing/Padding/{sm, md} · Spacing/Gap/xs
  - **Tag**: Tag/Color/Brand/{Bg/Default, Bg/Subtle, Stroke/Default} · Tag/Color/Neutral/{Bg/Default, Bg/Inverse, Stroke/Default} · Tag/Color/Negative/{Bg/Default, Bg/Subtle, Stroke/Default} · Color/Surface/Card/{Default, Brand, Brand-subtle, Positive, Negative} · Color/Neutral/900 · Color/Stroke/Brand/Default · Color/Text/{Brand/Default, Inverse, Secondary, Positive/Heavy, Negative/Heavy} · Spacing/Padding/{2xs, xs, sm} · Spacing/Gap/{2xs, xs} · Radius/full · Stroke/Width/Default
  - **Chip**: Color/Action/Bg/Primary/Default · Color/Action/Text/Default · Color/Surface/Card/Default · Color/Surface/Inset/Default · Color/Stroke/{Default, Subtle, Positive/Default} · Color/Text/{Primary, Disabled} · Spacing/Padding/{sm, md, lg} · Spacing/Gap/xs · Radius/full · Stroke/Width/Default
  - **Check**: Color/Surface/Icon/Brand/{Default, Disabled} · Color/Surface/Card/Default · Color/Surface/Inset/Default · Color/Neutral/400 (off ring) · Color/Stroke/Default (disabled ring) · Color/Icon/Inverse (tick) · Radius/full · Stroke/Width/{Medium, Strong}
  - **Tooltip**: Color/Neutral/900 (bubble + arrow) · Color/Text/Inverse · Color/Neutral/400 (×) · Color/Icon/Positive/Light (leading icon; it does not show in the audit because the icon is hidden by default) · Spacing/Padding/{none, md, lg} · Spacing/Gap/{xs, md} · Radius/sm
  - **Toast**: Color/Neutral/900 · Color/Text/Inverse · Color/Text/Link/Inverse (action) · Color/Positive/500 + Color/Icon/Brand/Default (success icon) · Color/Negative/400 (error icon) · Color/Icon/Inverse (info icon) · Color/Neutral/400 (×) · Spacing/Padding/{md, lg} · Spacing/Gap/md · Radius/md
- Styles used (the Font/*, Blur/* and Shadow/* variables come in through these styles): text styles Label/md, Label/sm, Section-title/xs, Link (+ underline override), Body/md, Caption/sm; effect styles Shadow/Default (Tooltip), Shadow/Focus (Toast).
- Fixed geometry, not tokens: minimum heights Button 48 / 36 and Chip 44 / 32; Check 20 / 16; Tooltip bubble width 250 with a 12×6 arrow; Toast width 343; icon sizes 12 / 16 / 20 (Icon-page instances, rescaled).
- Variable code syntax that is wrong in Figma (the coordinator's to fix, not touched here). Specs will use the right CSS name: `Color/Action/Bg/Positive/Pressed` shows `color-action-bg-positive-disabled` (should be `--color-action-bg-positive-pressed`) · `Color/Action/Text/Link` shows `color-action-text-positive` (should be `--color-action-text-link`) · `Tag/Color/Neutral/Bg/Alpha` shows `tag-color-neutral-bg-inverse` (should be `--tag-color-neutral-bg-alpha`). None of the 7 components binds these three.
- Not done yet (waiting for the new tokens): rebinding; `rebrand/spec/<Name>.md` for each of the 7 (parity protocol); showcases with one instance per spec state in spec order (today's showcases are curated legacy examples, not the full variant list).
- Open: the requests and owner questions in the entry below are still valid, but requests 1 and 2 (Tag text contrast, a ≥3:1 control-border colour) should go into the new token structure instead.

### 2026-11-19 · Component library — 01 · Actions + 02 · Feedback
- Figma: page Component - Rebranding `10982:15`
  - 01 · Actions `10982:16`: **Button** `10987:225` (30 variants), **TextLink** `10988:133` (6), **Tag** `10988:272` (24), **Chip** `10989:185` (8), **Check** `10989:254` (8). State showcases of instances beside each set (`10987:226`, `10988:134`, `10988:273`, `10989:186`, `10989:255`).
  - 02 · Feedback `10982:17`: **Tooltip** `10991:475` (18), **Toast** `10991:524` (4). Showcases `10991:525`, `10991:633`.
  - Every set: auto layout; all fills / strokes / stroke widths / padding / gaps / radii bound to Semantic or Component variables; all text on text styles (Label/md, Label/sm, Section-title/xs, Link, Body/md, Caption/sm); explicit Rebrand mode for Primitive, Semantic and Component on the set; description written. Audit script: 517 nodes, 0 unbound values. Fixed geometry only: min heights (48 / 36 / 44 / 32), Check 20 / 16, Tooltip width 250, Toast width 343, icon sizes.
  - Consolidated (legacy page `3384:681` untouched): Button ← CTA, Resend btn, Exist account btn (Subtitle on), Popover btn, delete my account/CTA (Destructive), FAQS/feedback btn (Text), Calendar/button. Tag ← Term tag, Number tag, State tag, Recommend tag, Extra Documents Verified Tag, borrower protection pill. Chip ← term, Term pick, inbox filter tab, Search city popover/tab (pickers; Segmented comes with Inputs). Check ← Check mar. Toast ← Toast.
  - Brand rules applied: Primary = green fill + navy text; Navy variant for green surfaces; chip selected = green + navy text + tick; Check on = navy; Tooltip and Toast dark (Neutral/900, white text); Toast status icon (green tick / red alert / white info / none).
  - Sections 03–06 moved down 264 px so Feedback (now 1464 tall) doesn't overlap.
- Demo: — (demo-rebrand mirrors; see naming note below)
- Tokens: none created or changed. Used existing: Color/Action/*, Color/Text/*, Color/Stroke/*, Color/Surface/*, Color/Icon/*, Color/Neutral/400 + 900, Color/Brand/400, Color/Negative/400 + 700, Color/Positive/500, Tag/Color/*/Bg + Stroke, Spacing/Padding/*, Spacing/Gap/*, Radius/sm, md, full, Stroke/Width/Default, Medium, Strong.
- Requests (coordinator):
  1. `Tag/Color/Brand/Text`, `Tag/Color/Positive/Text` (#2B8448 on #DBF8E0 = 4.1:1) and `Tag/Color/Negative/Text` (#FF0D19 on #FFE0E2 ≈ 3.2:1) fail 4.5:1 in Rebrand. Tag text is bound to `Color/Text/Positive/Heavy` (#206335, 6.4:1) and `Color/Text/Negative/Heavy` instead; please point the Tag text variables at those values so the Tag can use them.
  2. No neutral control-border token ≥3:1 (`Color/Stroke/Default` #BAC0C4 = 1.9:1, `Strong` #97A0A6 = 2.7:1). Check's off ring uses `Color/Neutral/400` (#7D878E, 3.6:1). Suggest a `Color/Stroke/Control` (or raise Stroke/Strong) — say if you want it.
  3. Icons on page Icon have differently named layers (路径 / Union / Subtract…), so a colour override is lost when an icon is swapped through the Icon property (it falls back to black). Instances in the showcases are re-tinted by hand. Fix later = icons with one flattened layer named the same in every icon (Icon page is shared with live designs, so not touched).
- Open (owner):
  - Naming: the demo's `PS.Chip` is a summary pill (✓ Saved / ↑ New limit); in Figma that look is **Tag · Outline + icon**, and **Chip** is the selectable choice pill (term picker) as the brief asks. demo-rebrand should mirror that or we rename one.
  - Small Button (36) and Small Chip (32) are below 44: use inside a 44 px row / hit area only.
  - Loading is a boolean on Button (spinner beside the label) rather than a State, to keep variants at 30.

## 39 — Colour scales v3 applied (coordinator, 2026-11-21, file kYyNV2MgxvH1w9bJ46A3yx)

- Owner approved the v3 scales (review page `15004:15`) and asked for Primitive, Semantic and Component to be overwritten.
- Done by the coordinator session, the only writer on this file. The 3oi5 file and its LOOK-DIFF lane are untouched.
- Map: `tokens/v3-map.json`. Results: `tokens/v3-SCALES.md` § "Applied in Figma".
- New variables: Base/White `VariableID:15016:31671`, Base/Black `:31672`, Alpha/Navy/60 `:31673`, Alpha/White/24 `:31674`, Alpha/Mist/0–80, Gradient/Mist/0–80.
- Verified: no references to deleted variables on Component - Rebranding or Design - Rebranding. Parity sheet screenshot: `parity/figma/look-parity-v3.png`.
- Open: the 4 local nav gradient paint styles are still on the Legacy collection; code tokens v3 not built.

## 40 — Owner node fixes on the v3 copy (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **ActivityItem** (set `11157:4385`): Loan Approved tile → Bg/Positive/Strong (green 500) with a navy icon. Repayment Completed → Bg/Brand/Muted (navy) with a white icon. Instance overrides fixed.
- **Installment:** the check circle's navy override → Bg/Selected (green), in 7 places.
- **Check** (`10989:254`): State=On mark → white (Content/Inverse).
- **Urgent tokens:** Bg/Urgent/Subtle = Orange/100. New: Surface/Urgent/Subtle = Orange/50 and Border/Urgent/Subtle = Orange/300.
- **CouponPickCard** (`11314:9986`) countdown: Selected → Orange 50 with no stroke (legacy #FFF4EE). Unavailable → Orange 100 fill with an Orange 300 1 px stroke (legacy #FFE9DD / #FFA06C).
- **LoanStateCard** (`11263:25900`): Reviewing icon → Content/Primary (same as the title). Withdrawal method icon → white on the red tile.
- **PhoneField** (`11018:830`), all variants, matched to legacy:
  - 328×56, gap 8; country pill 88, number pill 232;
  - flag 20; input text Body/md 14/20; label Body/xs; label–value gap 2.
  - Note: this supersedes decision 13 (16 px input). Phase 2: handle iOS zoom in code.
- **SelectBar** (`11009:954`):
  - Selected stroke and radio → new Border/Accent/Strong (Green 700); dot → Content/Accent-strong.
  - Card variants: note box 120 wide, centred (legacy).
- **Chip** (`10989:185`): stroke 1 → 1.5 (legacy), all 8 variants.
- **Elevation/1–3:** shadow layer colours swapped to match legacy (blur-12 layer 8 %, blur-2 layer 16 %).
- **New Elevation/Knob** (legacy Shadow/Enhanced): navy 16 % blur 4 + navy 12 % y8 blur 32. Applied to the Slider knobs, ring 3 px.

## 41 — Semantic restructure and input truncation (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- Applied `tokens/v3-SEMANTIC-PROPOSAL.md`:
  - 14 merged (bindings re-pointed: 158 on the Component page, 189 on the Design page);
  - 142 renamed;
  - 26 tag tokens now alias semantics;
  - control/checked-bg `VariableID:15025:15`.
- Inputs:
  - Field `11009:437`: 42 texts. Search `11009:488`: 6. PhoneField `11018:830`: 12. SelectBar `11009:954`: 24.
  - All are single line with an ENDING truncation; boxes have a fixed height.

## 42 — Raw semantic numbers linked to primitives (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- Owner asked why Stroke/Width/Focus had no reference. Cause: build.py wrote the semantic number and string tokens as raw values; only colours were aliased.
- Now all 18 are aliased:
  - Stroke/Width/Focus → Stroke/Width/20;
  - Size/Control, Size/Icon and Touch-min → Spacing/*;
  - Opacity → Layer opacity/40 and /10 (new);
  - Motion/Duration → Duration/80, 150, 240, 360 (new);
  - Motion/Easing → Easing/standard, decelerate, accelerate (new).
- Semantic and Component now contain no raw values.

## 43 — Styles audit and gradient styles (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **Effect styles:** Elevation/1–3, Blur/Glass and Elevation/Knob are all bound to semantic shadow/* tokens. OK.
- **Text styles:** 35, in Body, Caption, Display, Headline, Label, Title and Amount; no colour. OK.
- **Paint styles:** the 4 old gradient styles were bound to the Legacy collection (and raw values). They are used almost only on the legacy pages (Design, Component, handbook, Screenshot).
  - They are renamed `Legacy/Gradient/…`. Name only; the legacy pages look the same.
- **New rebrand gradient styles,** bound to tokens:
  - Gradient/Glass-stroke (gradient/white-100, 0, 100; gradient/white-100 is new and aliases Base/White);
  - Gradient/Nav-top (mist 80, 40, 0);
  - Gradient/Nav-bottom (white 0, 60, 80; rebrand top-to-bottom direction);
  - Gradient/Nav-bottom-mist (mist 0, 60, 80);
  - Gradient/Scrim (overlay/scrim-top, mid, bottom).
- **Attached** where stops and direction match:
  - Component - Rebranding: 36 glass, 13 nav-top, 7 nav-bottom, 8 nav-bottom-mist, 1 scrim;
  - Design - Rebranding: 7 glass, 15 nav-top, 2 nav-bottom-mist.
- **Not styled** (illustration or decorative raw gradients): coins, logo, card glows (#9AE8FF, #C2A4FF), #70FF99 → #53C574 vector, #00FFEA bin strokes. Coupon: owner said to skip.
- ⚠️ **My error, fixed:** the page-wide attach also styled 33 nodes in the parity sheet's "Look parity / Legacy source" column (`11311:21426`). They were reverted to the matching Legacy/Gradient styles, and one stray fg/disabled text there went back to Color/Text/Disabled. Future page-wide sweeps must exclude `11311:21426`.
- **Removed by the owner on purpose** (confirmed 2026-11-21): the Legacy effect styles (Legacy/Shadow/…) and the Legacy text styles no longer exist in this file. For example, legacy card `11311:23212` has no effect style any more; its effects are detached but look the same.

## 44 — Corners and press shape (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- Owner rule: no card in the app has square corners, and a pressed state keeps the same shape (only colour changes). Rows that draw a divider stay square, so the divider stays straight (owner screenshot of BankList).
- Applied:
  - SelectBar Style=Plain (4 variants) → Radius/xl 24, the same as Card. So Plain Pressed (`11009:924`) is no longer a square fill.
  - .MenuRow (4 variants) → Radius/full; Default was 0 and Pressed was 999.
  - ListItem, KV, .BankRow, PlaceRow and PlaceTab stay at radius 0 in every variant: they draw a divider or underline and sit inside rounded cards.
  - Design page: Details Container `11259:22550` and `11259:22555` → Radius/md 16. Amount Container `11134:17776` stays square (divider).
  - SelectBar Logo 18 → 24 (rescale, 12 variants; owner, `11009:1033`).
  - Coupons skipped (ticket shape).
- ⚠️ **My error, fixed:** `.MenuRow`'s id is the set itself, and I took its parent, so 39 section-level children of "03 · Inputs" got radius 999. They were restored from the source file 3oi5 (read-only): set frames 5, "· states" frames Radius/md, Keypad / .Weekday / EmailSuggestions 0, .MethodTabs Radius/lg + none.

## 45 — RepayCard, MethodPicker, ActivityItem icon, Chip label, nested-override audit (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **RepayCard** (`11114:3890`): the "Copy" pill stroke was fg/default (navy) while its text was green; legacy has both at the brand colour. Stroke → border/accent-strong (3 mains, 6 instances).
- **MethodPicker:** owner — a list rendered from data, with no open/closed state.
  - The Open=Off instances (5) were swapped to the open design with rows 2–3 hidden; heights unchanged (84).
  - The Off variant is deleted. The open one is now the standalone component MethodPicker `11113:3542`, with layers renamed Header / Row.
- **ActivityItem** Kind=Loan: icon on the green tile → fg/on-emphasis (white), owner `11156:5552`. 1 main, 3 instances.
- **Chip** Small Default: 5 instances had overridden the label to fg/accent. They are now fg/subtle, the same as base (owner `11159:12167`). An unintended Pill Default change was reverted.
- **Nested-override audit** (read-only, Component - Rebranding, legacy column excluded): 174 colour-override groups on 663 nested instances in 473 components.
  - ~80 % are icon recolours on shared glyph components (raw #000 or Legacy tokens; the Icon page is shared with the legacy pages).
  - Real state overrides that belong in the base:
    - Radio On (SelectBar → G700 vs ReasonRow G500);
    - .NavTab Active (Navigator: navy → green);
    - .PaymentNotice (PaymentCard: text muted, icons subtle);
    - Tag Small Subtle at the 200 step (PaymentCard, InstallmentCard);
    - .GlassButton / Search glyphs on Legacy tokens.
  - Waiting for the owner's decision.
- **Empty-state illustration** (owner, `11134:23656`, Payment / Index logout): the legacy screen has none either, and the file has no empty-state illustration. Needs an asset or a brief.

## 46 — Owner screen fixes against the original (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **PermissionCard** (`11086:2666`, both variants): the filled camera icon is rolled back to the legacy look. A 28 px tile (Radius/xs 8, bg/brand-muted) holds the outline Icon / Camera in fg/on-emphasis (owner: "card fill + white icon").
- **Camera-screen back buttons** (.GlassButton Back, 2): solid white → bg/on-brand (white 24 %, the closest token to legacy white 10 %).
- **PlaceTab:** the Active variant and 2 instances drop the bg/success fill; text → fg/accent (legacy brand text). The tab indicator bars (2) → bg/accent-emphasis (legacy brand light).
- **Take a selfie** examples (`11168:21481`): the two check badges are moved back to their legacy positions (icon x 91 / 194).
- **Date header** chevrons (4 "Group / Month and year" frames, 24 paints): border/accent-emphasis (G500, too light) → fg/accent (G700).
- **Trust cards:** NPC logo tint "Media / 2" (21) → fg/accent, the same dark green as the SEC text.
- **.BrandMark** (`11036:1187`): logo Tile radius 0 → 6.34 (legacy logo geometry), fixed in the base component. 37 instance overrides aligned.

## 47 — Nested overrides moved into base components; empty state (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- Owner: "Yes, move the 5".
  1. **Radio** (`11156:5430`) State=On → stroke border/accent-strong, dot fg/accent (Green 700). Overrides reset on the 5 Radio instances nested in components (SelectBar, ReasonRow), which now inherit.
  2. **.NavTab** (`11037:1351`) Active → Glyph and Label fg/accent (2 paints). Navigator's equal-value overrides stay, because the label text is overridden.
  3. **.PaymentNotice** (`11100:11176`): notice text → fg/muted. Its help icon was already fg/subtle in the base.
  4. **Tag** (`10988:272`): new variants Size=Small, Tone=Negative / Accent, Emphasis=Muted (`15042:11297`, `15042:11300`). New tokens tag/danger/bg-muted (Red/200) and tag/accent/bg-muted (Green/200). The 7 step-200 tag overrides in PaymentCard, InstallmentCard and related cards were swapped to them, with labels kept.
  5. **.GlassButton / Search glyphs:** already fg/default and fg/muted in their base components. The audit had compared against the raw icon base, so these were false positives. No change.
- **Empty state** (`11109:9756`, Payment / Index logout): the hand-built block is replaced by an EmptyState Action=On instance (`15043:22768`) with the empty-box art, the same title and body, and the button "Sign up or Log in".
- **Lesson:** a use_figma call that errors rolls back entirely. Re-check state after any error.

## 48 — Buttons on black screens (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **New semantic tokens:**
  - border/on-emphasis = Base/White (`VariableID:15044:51760`);
  - bg/glass-on-dark = Alpha/White/20 (`VariableID:15044:51761`), following the owner's hand-tuned value. Legacy was white 10 %.
- **Glass buttons on black screens:** all 10 .GlassButton instances (camera, Confirm your identity, Mobile phone change) → bg/glass-on-dark. This replaces solid white, bg/on-brand 24 % and raw Alpha/White/20.
- **Owner's hand-tuned secondary button** (`15041:61214`, Change bank card / Confirm your identity): stroke border/default → border/on-emphasis (pure white). It is still a detached frame, not a Button variant.

## 49 — Button Inverse variant; coupon Used = Expired (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **Button** (`10987:225`): new Variant=Inverse, for dark or black backgrounds. 10 variants (Large, Medium, Small, XS × Default, Pressed, Disabled), cloned from Secondary.
  - Default: no fill, border/on-emphasis, fg/on-emphasis.
  - Pressed: bg/glass-on-dark fill.
  - Disabled: border/emphasis + fg/disabled.
- The owner's hand-drawn "Take again" frame is replaced by an instance (`15046:22848`, Large Inverse Default, FILL width, label "Take again").
- **Fix found on the way:** the Secondary variants' Label and Subtitle texts were not bound to the component properties. The Secondary and Inverse variants (20 text nodes) now mirror Primary's references, so Label#10987:0 and Subtitle work on instances.
- **CouponTicket** (`11046:2168`): State=Used now uses exactly the State=Expired paints (all grey). Only the status text differs ("Used" vs "Expired"). 5 base paints changed; 54 instance overrides aligned.

## 50 — PermissionCard icons restored (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- **Icon fix in the tile** (owner `15038:5194`): the camera icon had been resized 36 → 20, which kept a 3 px stroke and could show the frame fill. It is rebuilt with rescale (stroke 1.67, as legacy), white strokes and no frame fill.
- **Side effect of entry 46, fixed:** rebuilding the base icon dropped each instance's swapped icon, so all cards showed the camera. Each card's legacy outline icon was restored by title:
  - Camera → Icon / Camera; Device Information → Icon / Smartphone; App List → Icon / App;
  - Location → Icon / Location; Notification → Icon / Notification; SMS → Icon / Message;
  - A friendly reminder → Icon / Heart (owner `11168:28836`).
- **Tile colour** → bg/brand (navy 900), in the base and in all instances (owner: "background navy").
- **Lesson:** never delete and recreate a nested instance in a base component. Swap or restyle it in place, so instance swaps survive.

## 51 — Gradient/Brand-card style (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- From the owner's hand-tuned card `15049:61655`: a new paint style Gradient/Brand-card. It is a linear gradient, bg/brand (navy 900) at 50 % to bg/brand-muted (navy 600) at 100 %, top to bottom. The cyan glow stays a separate layer.
- Applied in the base components: CreditCard (`11093:2768`, all variants), StateCard (`11098:2828`, all variants) and HubCard (`11157:4389`), plus the owner's node. Home cards and the Credit limit hub / Empty card follow; no instance overrode the fill.
- Note: HubCard is shared, so every Credit limit hub screen that uses it gets this background.

## 52 — On-brand alpha 10 %, Major Digits spacing (coordinator, 2026-11-21, kYyNV2MgxvH1w9bJ46A3yx)

- Owner: on navy cards, opacity 10 % is enough (`11134:14386` Hold, `11134:15295` Expired).
  - New primitive Palette/Alpha/White/10 (`VariableID:15052:40`).
  - bg/on-brand and border/on-brand now alias it (they were Alpha/White/24).
  - Alpha/White/24 had no other users and is deleted.
  - Affects every translucent fill or stroke on a navy card: StateCard buttons and dividers, HubCard Withdraw.
- **Major Digits** (`11134:17781`, Home / Loan application / Loan detail popover): letter spacing −2 % → 36 % (legacy). Set as a direct value: the owner wants no token or style for this one-off, so the text style is detached.

## 53 — Credit bar track, toast position (coordinator, 2026-11-21)

- **CreditCard** (`11093:2768`): the progress track was bg/on-brand (white 10 %), too light on navy (owner `11134:12940`). It is now bg/glass-on-dark (white 20 %), in 3 mains and 15 instances.
  - Code: the withdraw.js home-card track (it was navy 30 %, invisible on navy) and `.ps-credit__bar` → `--bg-glass-on-dark`.
  - The temp segment → `--fg-accent-on-brand`.
- **Toasts** (owner: every toast in one fixed place, a little below the top nav bar):
  - code: the default `--ps-toast-top` is 40px + 4.75rem + 0.5rem = 124, 8 px under the 116 px top bar. Checked on home, FAQs and inbox: gap 8 px on each.
  - Figma: the only toast (Delete my account / Success `11160:11563`) moved to y 124, centred.
- **ProtectionCard illustration** (owner: "different from the original"): Figma copy, 3oi5, legacy and both code versions use the same 5 colours. No difference found; waiting for the owner to point at what differs.

## 54 · Next payment in stages (2026-11-21)

Owner: "next payment分阶段，默认截图所示 … overdue用红色", then "当天用navy吧" (stages; default as in the screenshot; due today navy; overdue red).

- **Figma, Button set `10987:225`:** new Variant=Outline for every size and state (`15097:9927`–`15097:9981`). White `bg/default` (Pressed `bg/inset`), line `border/default`, label `fg/default`; Disabled uses `border/muted` and `fg/disabled`.
- **Figma, PaymentCard `11093:2765`:**

  | Variant | Tag | Amount | Button | Notice |
  |---|---|---|---|---|
  | Next (default) | Neutral Subtle "Due in 45 days" | green | Small Outline | — |
  | **Today** (new, `15099:138`) | Navy Strong "Due today" | green | Small Navy | — |
  | Due, Overdue, Overdue coupon | Negative Muted | green | Medium Destructive | `bg/danger-muted` (Due's was green) |

- **Code:**
  - `PS.PaymentCard` has a new prop `stage`: upcoming | today | overdue. The old `overdue: true` still works.
  - New button variants `bordered` (Figma Outline), `navy` and `danger` (Figma Destructive). `outline` was already taken by the coupon "Use" button.
  - New tags `neutral` and `brand`.
  - Gallery: new state "Due today".
  - App: Tune → Loan has a new option "Due today": the first payment falls due today.
  - Checked in the browser:
    - Repaying: grey tag, green amount, white button with a #B2B3BE line.
    - Due today: navy tag and button.
    - Overdue: red tag and button, pink notice.
- **Amount:** owner: "stay". The big amount stays green (`fg/accent`) in every stage, in Figma and in code.

## 55 · Button component tokens (2026-11-21)

Owner: "在component里加新token绑定" (add new token bindings in the Component collection), then chose "All buttons".

- **Figma, Component collection:** 52 new tokens with the pattern `button/{variant}/{bg|border|fg|fg-subtle|icon}[-pressed|-disabled]`.
  - Variants: primary, secondary, text, destructive, navy, neutral, plain, glass, inverse, outline.
  - Each token aliases the semantic token the Button set used before, so nothing changes visually.
  - A state token exists only where its value differs from Default. Otherwise the state uses the default token, e.g. Primary Pressed keeps `button/primary/fg`.
  - Subtitle and spinner layers reuse `fg` where they match it. The one exception is `button/secondary/icon` (`fg/default`): the Secondary spinner is navy.
  - Scopes: bg → frame and shape fill; border → stroke; fg → text, shape and stroke.
  - Code syntax: `var(--button-…)`.
- **Bindings:** 270 layer bindings plus 85 spinners in the Button set `10987:225`.
  - Instances follow the main components. Instances that override a colour keep their own (semantic) binding.
- **Left on semantic tokens, for the owner to settle:**
  - **Text, Large, Default label:** `fg/accent` (green). Small and Medium are `fg/default` (navy), so `button/text/fg` = navy. The code's text button is green.
  - **Secondary, XS, Default line:** `border/accent-emphasis`. The other sizes use `border/selected`. XS is the coupon "Use" button (code `outline`).
  - **Glass line:** a gradient (`gradient/white-0 → 100`), not a single colour.
- **Repo:**
  - tokens v2026.11.21.2: 52 variables added (`tools/sync-tokens.py`, then `rem-tokens.py`; rem output unchanged).
  - `ps-ui.css` buttons now use `--button-*`: primary (+ disabled), plain, neutral, inverse, bordered (= outline), navy, danger (= destructive) and glass. `text` stays `--fg-accent` until the Text colour is settled.
  - Visible change: a disabled primary button now has the grey label `--button-primary-fg-disabled` (#8A8A9C), as in Figma. Before, the label stayed navy.
  - Gallery Button entry: new states "Bordered · navy · danger" and "Disabled".
  - Checked in the browser: the payment card's 3 stages and every gallery button state resolve through the new tokens.

## 56 · Only primary buttons are green (2026-11-21)

Owner: "不需要，只有主要按钮是绿色，其他的可能没有背景可能置灰可能是navy，你看情况做吧" (only primary buttons are green; the others may have no fill, be grey or be navy — use judgment).

- **Text:** navy label `button/text/fg` = `fg/default`.
  - The Large Default label, which was the green outlier, is now bound to it.
  - 16 screen instances had green label overrides (`fg/accent` / `fg/accent-strong`); they are re-bound to `button/text/fg`. Examples: "Not now", "Skip", "Later", "Not satisfied", "Don't use coupon", "I changed my mind".
  - 4 nested instances on the Component page were re-bound the same way ("Cancel", "Reject").
- **Secondary:** white, grey line `border/default`, navy label.
  - `button/secondary/border` → `border/default`; `button/secondary/fg` → `fg/default`.
  - The XS line (coupon "Use"), which was the outlier, is now bound too.
  - The face camera's "Next" label override is re-bound.
  - `button/secondary/fg-pressed` and `button/secondary/icon` are deleted, because they now equal `fg`.
- **Outline merged into Secondary:** it looked identical, so its 10 variants and 6 `button/outline/*` tokens are deleted. The PaymentCard "Next" button is swapped to Small Secondary, and the 12 nested copies on screens follow.
- **Repo:**
  - tokens v2026.11.21.3: 8 removed, 2 changed; 44 `--button-*` tokens.
  - Code variant `bordered` → `secondary`.
  - `.ps-btn--text` → `--button-text-fg` (navy).
  - `.ps-btn--outline` (coupon "Use") → the grey line + navy label of `--button-secondary-*`.
  - Checked in the browser: the text button, the coupon "Use", and the secondary, navy and danger buttons, plus the home payment card.
- **Still open:** the Glass line is a gradient and keeps its gradient tokens.

## 57 · Owner's colour pass: checks, info, badges, slider, QR card (2026-11-23)

Owner asked, node by node: every round tick navy with a white icon (11134:22233); Credit limit back to a filled tile with an outlined icon (11160:12104); "New" in the green scale (11160:12143); the demo's tab bar icon colour is wrong (11161:11777); the QR card in the demo as in Figma (11134:25180); info notices in the blue scale (11134:22148); a dark green centre on the slider knob (11136:22802); the estimate amount in navy (11168:28856); no blur on the headers; inbox Unread / Read without the sliding green pill, the two tags crossfading.

- **Tokens (v2026.11.23, 22 added, nothing removed):**
  - Component: `check/on-bg` and `check/on-border` → `bg/brand`, `check/on-fg` → `fg/on-emphasis`; `slider/knob-center` → `fg/accent`.
  - Primitive: `Palette/Blue/50–950` (the legacy blue ramp's values, 950 made a dark blue #0B1A33 instead of navy).
  - Semantic: `bg/info-subtle` (Blue 50), `bg/info-muted` (100), `bg/info-emphasis` (600), `fg/info` (700), `fg/info-strong` (800), `border/info-muted` (200), `border/info` (400).
- **Figma:**
  - Check State=On (Medium, Small) bound to `check/on-*`. The 7 "⚠ legacy: Check mark" frames in Installment / InstallmentCard are swapped for Check Small On instances, so 36 screen copies follow; 1 screen override re-bound.
  - New component `Icon / Wallet / Outline` (07 · Icons, from the repo's wallet.svg). CreditLimitCard (both states): a 28 Brand tile, `Radius/xs`, with the outlined wallet in `fg/on-emphasis`, replacing the bare filled wallet.
  - "New" / "6 coupons" badges (7 on screens): `tag/accent/bg-emphasis` + `tag/accent/fg-on-emphasis`.
  - ScamStrip: `bg/info-muted`, icon and text `fg/info-strong`.
  - Slider Knob, all 8 variants, plus 16 screen overrides that were white: `slider/knob-center`.
  - Loan estimate amount and pencil (11168:28856): `fg/default`.
  - Background blur removed from 14 screen Header frames (Payment index, bank search, method and address popovers, short link).
- **Code (`shared/ps-ui`):**
  - `.ps-check--on` uses `--check-on-*`.
  - CreditLimitCard: the tile is back (`--bg-brand`, white `wallet` icon).
  - `.ps-tag--solid` uses `--tag-accent-*`.
  - `.ps-scamstrip` uses `--bg-info-muted` / `--fg-info-strong`.
  - Slider knob centre: `--slider-knob-center`.
  - EstimateCard: amount and pencil in `--fg-default`; the AmountCard pencil now takes its colour from the card.
  - Navigator: the icon follows the tab's colour (green when active, as in Figma); before, it was always navy.
  - RepayCard / QrPanel as in Figma: Copy has a green line + green Body/lg-light label at radius 8; Save QR code is white 10 % (`--bg-on-brand` / `--border-on-brand`), white label, no icon; the QR picture fills its 208 box, so the blue corners are gone.
  - `PS.Tabs{fade}`: the pill crossfades in 150 ms instead of gliding. Used by the inbox; gallery state added.
  - The light weight has no token, so it is `--ps-weight-light: 300`.
  - Checked in the browser at 360: Account, Payment, Loan estimate, QR pay and Inbox. No console errors.
- **Not changed:** the primary headers in the app had no blur already. Only Figma headers carried one.

## 58 · Owner's second pass: account, hub, credit history, coupons (2026-11-23)

- **Verified badge removed** (11200:19183):
  - Figma: it is gone from the 4 screens that showed it (Account login / logout confirmation, Inbox login, Coupon center login). The VerifiedBadge component stays in the library.
  - Code: `PS.Profile` loses the mark and its `verified` prop. The app, the coupon-system data and the gallery are updated. `art/verified.svg` is kept, because old Dev Mode snapshots use it.
- **HubCard as in Figma** (11159:12524, 11159:11450), code only, since Figma was already right:
  - the card goes from Bg/Brand to Bg/Brand-muted from the middle down, 12 apart;
  - the ring is 24 and 3 thick, with its track in Bg/On-brand;
  - the Used / Available block is at 80 % opacity and its labels are not dimmed further;
  - Withdraw is the Navy small button on Bg/On-brand (white 10 %).
- **Credit history** (11155:10165):
  - ActivityItem tiles as in Figma: repayment is Bg/Brand-muted and loan is Bg/Success-emphasis, both with a white icon. Before, they were the other way round.
  - The chip tabs crossfade like the inbox (`PS.Tabs{fade}`).
  - Inbox and Credit history now have 8 under the tabs instead of 20 (header extra 56 → 44, column top 172 → 160).
- **Credit history tile labels bold** (11159:11540): Label/sm → Label/sm-bold on the 4 hub screens; code `.ps-tilepic > span` is bold.
- **Credit limit increase:** while it shows, the page behind (html, body and frame) takes the screen's dark #0d1620, so iOS Safari 26's status-bar edge no longer draws a light band over it (`html.ps-climit-on`, set by `PS.CreditLimitIntro`). It can only be seen on an iPhone and is not yet checked on one.
- **Coupons:**
  - Used is the same grey as Expired, and only the word differs. In Figma the two variants were already the same, but the 6 Used tickets on screens had colour overrides; those 42 overrides are reset. In code, the green label for Used is gone.
  - The Use button label is one size down: Button XS label Title/xs 16 → Label/md 14 in Figma; `.ps-btn--outline` uses label-md in code.
  - Tab counts are no longer a badge (13027:31381). The number goes in brackets after the label, like the inbox: "To use (6)". In Figma that is 7 tab instances (badge hidden, label written); in code, `PS.Tabs` count.
- Checked in the browser at 360: Account, Credit limit hub, Credit history (both tabs), Coupon centre (all three tabs). No console errors.

## 59 · Installment footer line by stage; no blur on the primary headers (2026-11-23)

- **Installment footer** (owner, 11134:22406). One line per stage:

  | Stage | Footer line |
  |---|---|
  | Before the due date | "Loan from Dec 31, 2026" (the loan's date) |
  | Due today | "It's your due date. No penalty until Jan 18" (due date + the 3 days without a penalty; reworded from "No penalty for 3 days after the due date", as the owner asked) |
  | 1–2 days late | "Pay now to avoid a ₱50.00 penalty" |
  | 3 days late (the last day without a penalty) | "Pay by 11:59 PM to avoid a ₱50.00 penalty" |
  | More than 3 days late | "Includes ₱50.00 penalty" |

  - Figma:
    - Due today copy changed.
    - New variant `Status=Overdue 1-2 days` (15147:9933).
    - Variants re-ordered by stage.
    - 3 Payment screens re-written with each card's own date.
  - Code:
    - `screens-pay.js` `note(d)`.
    - New fields `loanShort` and `graceEnd` on each payment (coupons-data.js).
    - "Overdue 1 day" is singular.
    - 3 new Installment states in the gallery.
  - Checked in the app with Loan = active, today and overdue.
- **Primary headers** (Home, Payment, Account). The owner saw a blur, and it was the glass buttons' background blur.
  - Figma: TopBar Right, Title pill, Help and Inbox lose the blur and keep their shadow (10 nodes in the TopBar main). No screen overrode them.
  - Code: `PS.TopBar{flat}` drops the blur behind `.ps-glass`; Home, Payment and Account pass it.
  - Back / Close buttons on other pages keep their glass blur.
  - The header's colour veil is unchanged.

## 60 · Home before a limit: reviews and stats match Figma (2026-11-23)

- **What customers say** (owner, 11187:19954: "colour wrong and cut off").
  - The quote mark is Figma's vector (`assets/art/quote.svg`) in Palette/Navy/200, 16 px from the right and 12 px above the card. It was a font glyph in bg/inset, clipped by the card.
  - The card no longer clips. The review row stops at the card's padding, as Figma's Row does.
  - Avatars: the 3 Figma photos (`assets/art/review-avatars.png`), with a white 2 px line and the default shadow. They had been cut from the trust card's group picture.
- **Stats row** (owner, 11187:19934: "background missing"): `.ps-hero__stats` now sits on bg/inset with Radius/sm, as in Figma.
- Figma unchanged. A temporary export frame was removed.

## 61 · Home before a limit: hero card rebuilt as Figma (2026-11-23)

- Owner, 11187:19927: "change this part's structure to this". `PS.Hero` (status.js / ps-ui.css) now follows the Figma block:
  - **Top:** navy (bg/brand), only the top corners rounded (Radius/xl), 16 px padding, 4 px gap.
    - Label: Label/md.
    - Amount: Display/md-bold (Hanken Bold 36, −2 %) in a 36 px box. It was Number/xl spacing.
  - **Body:** white, only the bottom corners rounded. A 1.5 px border/selected line runs on its sides and bottom, inside the 16 px padding. 16 px gap (was 24).
    - Tagline: Title/sm in fg/muted, two lines.
    - Stats panel: values Title/xs; labels Label/xs (new `.ps-t-label-xs`, was regular Caption/xs).
    - Large primary button.
  - Elevation/1 on the whole card; nothing clips.
- Copy: the tagline is "Fast, clear,\ncredit when life can’t wait." The owner chose the contraction; the Figma text 11187:19933, the app data and the gallery are all updated. A `\n` in `tagline` breaks the line.
- Sizes checked in the app: top 92, body 216, stats 296 × 56, button 296 × 48 (Figma the same). Figma unchanged.

## 62 · Application form: every choice opens as a menu; menus open faster (2026-11-24)

- Owner: "every choice popup in the application flow should work like Job type". ID type (ID screen and the check screen), Gender, Marital status and Payroll period now open the same popover menu as Job type and Time in current job. Before, they opened a bottom sheet (PS.ChoiceSheet).
  - ID type keeps its Accent "Higher credit" tags: `PS.Popover` takes `tags { option: label }`, and `FormField` passes `menu.tags` through. New `.ps-pop__opt--tag` / `.ps-pop__txt` rules put the tag at the row's end.
  - City / province (the searchable place picker) and the date fields are not simple choice lists, so they stay as they are.
  - `PS.ChoiceSheet` and `FormField sheet` stay in the library; the gallery still shows them. New gallery entry: "Menu with tags".
- Owner: "the menu should open faster; it drags". Menu timing in core.js `MT`:
  - MENU spring 0.34 → 0.22 s; MENU_Y 0.42 → 0.26 s.
  - Rows start 0.02 s plus 0.014 s each (was 0.05 plus 0.022). Each row's spring is 0.24 s (was 0.36) and fades in over 0.12 s (was 0.2).
  - The card fades in over 0.1 s and goes from blurred to sharp over 0.16 s.
  - Folding away: 0.12 s (was 0.18). After a pick it waits 90 ms (was 120) before closing.
- Checked in the app: Marital status and ID type (with tags) open as menus. A pick fills the field, and the console shows no errors.
- Figma unchanged. Its Application details screens still draw these choices as bottom sheets.

## 63 · Old demo (main) vs rebrand: the owner's 11 changes (2026-11-24)

- Comparison: every screen, scroll position and tappable element of `main` vs the working tree, leaving out colour and copy. Decisions (24): `rebrand/log/old-vs-rebrand-decisions-2026-11-24.md`. Code only; Figma unchanged.
- **Font: Hanken Grotesk everywhere.**
  - The Withdraw demo code (the Home credit card and the Withdraw sheet: `prototypes/withdraw-fund-flow/withdraw.js`, `withdraw.css` and its three pages) drops Reddit Sans and Inter.
  - `PS.kern` and `Component.kern` return 0, because their table was Reddit Sans's.
  - The ₱ is Hanken's own.
- **Line breaks:** non-breaking hyphens (U+2011, which Hanken has) in 35 copy words, so no line ends on a hyphen. Words: bank-level, SEC-licensed, e-wallet, first-payment, in-app, 10-digit, one-time, Wack-Wack.
- **Reviews row** runs to the card's edges again (`margin 0 −lg; padding 0 lg`). The quote mark stays above the card.
- **Credit card legend:** the Total credit dot takes the bar track's colour (`--bg-glass-on-dark`), in both PS.CreditCard and the Withdraw card.
- **StateCard:** the timer row and the Chat pill get `--fg-accent-on-brand` at 16 % (color-mix), so they read as pills on navy.
- **Reapply now:** no icon (app and gallery).
- **Strip count badge:** the number is white (`--fg-on-emphasis`). Note: white on green-500 is about 1.9:1, same as the old demo.
- **FormField:** label in UPPER CASE, value Regular, as in the old demo. The ✕ still shows only while the field is focused.
- **New `PS.Mask`** (gallery entry "Mask"): the hidden phone digits, with letter-spacing 0.16em. Used on the code page.
- **Slider min/max labels:** `--font-weight-black` (800). Hanken Bold at 12 px read lighter than the old Inter Bold.
- **Help rows:** tall link list back to min-height 22 and the regular link style; related-article rows back to Body/md-em.
- **Tooltip placement:** no change. A real ⓘ tap already puts the tooltip's corner over the icon. The screenshot in the review was anchored to the label by the capture script.
- **Checked in the demo:** Home card, Home banners, Reviews, trust card, check-details fields, code page, estimate slider, Help topics, Add files hint. No console errors.

## 64 · Withdrawal method: e-wallet asks for the account number (2026-11-24)

- **Withdrawal methods** (`screens-loan.js`): with E-Wallet picked, the field is now "Account number" with "Enter your account number", the same as Online bank. It was "Mobile number" (in the old demo too).
- **Error:** one message for both tabs: "Enter your account number (10–16 digits)." The check is unchanged (10–16 digits).
- **Gallery:** the Field "Error" state uses the same label and message.
- **Checked in the demo:** E-Wallet tab shows "Account number". No console errors.

## 65 · Bottom distances: Android values (2026-11-24)

The owner asked for Android bottom distances instead of the old ones (they were the legacy design's values, not an iOS safe area: Figma has no home indicator and production adds `env(safe-area-inset-bottom)`, 0 on Android). Approved values: button 16 from the bottom, nav bar 12, floating card sheet 8. Tokens: Spacing/Padding/lg (16), Padding/md (12), Gap/sm (8). Token values are unchanged (production uses `--spacing-page-bottom-*`).

**Demo** (`shared/ps-ui/ps-ui.css`, `prototypes/withdraw-fund-flow/withdraw.js`, `shared/ps-ui/withdraw-host.js`); iOS 26 Safari still adds its own `--sb` on top:
- BottomBar: min-height 108 → 96, bottom padding 20 → 16 (button 28 → 16; two-button bars 20 → 16). Note bar and consent bar 28 → 16.
- Navigator: bottom padding 24 → 12 (bar 98 → 86). PayDock 162 → 150.
- Plain sheet and the choice sheet: 32 → 16. Full-page sheet foot: 24 → 16. Card sheet: 16 → 8 from the bottom (its button 32 → 24).
- Amount entry: 32 → 16. Withdraw order Confirm bar: 108 → 96, button 28 → 16 (the host's page length uses 96).
- Keypads unchanged.
- Checked at 360 × 800: method / permission / delete CTA 16, Home nav 12, Payment dock 150, plan sheet 16, card sheets 8 (button 24), Withdraw Confirm 16.

**Figma** (Component - Rebranding, Design - Rebranding only; legacy pages and 11311:21426 untouched):
- Components: BottomBar 5 variants (96 / 144 / 136, button 16), Navigator 3 variants (86, bar 12; PayDock follows, 146), Sheet Plain 32 → 16, Sheet Page foot 24 → 16 (Content 516 → 524).
- Screens: about 136 instances on 75 screens. 86 bars re-anchored to the bottom, 24 BottomBar instances with their own height resized; 20 card sheets 16 → 8 from the bottom (button 24, as in the demo); wheel-picker and "in use" cards' inner padding 32 / 24 → 16; one-off blocks (11203:17105, 11263:19462, 11200:16449, 11200:16755, 13086:31170, 11155:13220) → 16; full-page sheet footers 11273:28567 / 11273:30212 → 16.
- Survey after: BottomBar 96 ×50 and 144 ×9 at 16, Navigator ×31 at 12, PayDock ×7 at 12.
- Left alone: 11263:18496 (scaled Navigator illustration), PayDock cut to 88 on 11189:15909 / 11189:16766 (already off the bottom before), keyboards, button-less lists, and gaps that weren't tied to a bar (11155:12128, 11259:18404, 11052:212, 11052:454, 11053:1397).

## 66 · Spinning coin: dark green (2026-11-24)

- **Found:** the demo's PS.Coin (Loader, Order submit) still loaded the legacy blue coin from the root `animations/coins-loading/`. The green copy in `rebrand/animations/coins-loading/` (CHANGES 2026-11-19) was never wired in.
- **Recoloured** `rebrand/animations/coins-loading/` (loading-coin.json, success-coin.json, both GSAP files, perasure-coins.lottie): body #5CD680 → **#298648** (Palette/Green/700 = Content/Accent), highlight #99E8AB → **#5CD680** (Green/500). The near-white face #F6F9F8 is unchanged. `preview.png` is not regenerated.
- **Wired:** `shared/ps-ui/feedback.js` loads the coin from `rebrand/animations/coins-loading/`. Root `animations/` keeps the legacy blue (main's demo).
- **Loading dots** (owner, same day): `shared/ps-ui/assets/lottie/loading-dots.json`, 4 fills, still the legacy blue #2C74BE (the CHANGES 2026-11-20 row was never applied) → **#298648**. The fading dots are the same colour at lower opacity.
- **Not changed:** Figma (no coin frames touched).
- **Checked:** Loader (coin + dots) and a 120 px Coin, loading and success states, all dark green; no new console errors.

## 67 · Slider ₱500 / ₱50,000 back to Bold (2026-11-24)

- Owner: the labels under the slider on the order details page were too heavy. They were Black (900 in the Withdraw order page, 800 in PS.Slider) since entry 63.
- Now Bold 700, the pre-rebrand weight: `.ps-slider__ends` uses `--font-weight-bold`; `withdraw.js` order-page labels fontWeight 900 → 700.
- Checked on the order page at 360 × 800: both labels compute to 700.

## 68 · Owner fixes: page-sheet scrim, centred loader / submit, toast place, glass blur back, Withdraw back button (2026-11-24)

- **Coupon picker scrim** (order page → See all): page sheets never had a scrim (by design, Figma too). Now every sheet has one; a page sheet takes the **Flat** scrim (`.ps-scrim--flat`, `--overlay-scrim`, navy 40 %), since only the header strip shows above it and the Gradient one is clear there. `layout.js` SheetBody: scrim default on.
- **Loader centred:** the dots' picture ends 8 px above its box, so the coin + dots sat ~4 px high. `.ps-loader > .ps-dots { margin-bottom: -0.5rem }`; visible group now at 400.5 on an 800 screen.
- **Order submit centred:** the coin + first line were centred, so the last, two-line message sat 17 px low. `.ps-stage__text` grows with its lines (min-height one line) and the coin / text glide on the Smooth spring when a line wraps (`layout: 'position'`); coin + all lines in the middle.
- **Toasts:** (first tried measuring the header with its tabs; withdrawn the same day, see entry 69.)
- **Glass blur back** (owner: only the bar's own gradient blur was to go, entry 59 went too far):
  - Code: `.ps-top--flat .ps-glass` rule removed; Home / Payment / Account glass pills blur again (5 px).
  - Figma: TopBar (11036:1355) Right ×2, Title pill ×4, Inbox ×2, Help ×2 get Blur/Glass again (10 nodes). All 208 pills in TopBar / Navigator instances on Design - Rebranding have the background blur.
- **Withdraw amount screen back button:** had its own look (24 px glow, white 60 %, 10 px blur, no line). Now the app's glass button: `--bg-glass`, 1 px `--fg-on-emphasis` line, `--blur-glass-shadow`, half the backdrop blur.

## 69 · Toast place settled; submit / loader centred on iPhone (2026-11-24)

- **Toast rule (owner):** every toast 8 px under the top nav bar (116 → 124 design px, + `--e` on iOS 26), on every page. A primary page's bar is in the webview; a secondary page's bar is the app's own, above the webview, so tabs under it stay under the toast. Entry 68's header measuring (`PS.toastTop`, toast under the tabs) is removed; PS.Toasts / PS.Toast use the fixed CSS place again.
- **Where toasts fire:** ~38 `APP.say` calls in screens-account, -auth, -help, -home, -kyc, -loan, -pay, -withdraw; all through PS.Toasts. Page types checked with a screenshot at 360 × 800, toast top 84 px under a bar ending at 76 on each: Home, Payment, Account, Coupons (tabs), Inbox (tabs), Withdraw order page, order page with the coupon sheet open, back from Withdrawal methods (real save), Login, Log out → login (real). Home's earlier "68" was the toast mid-drop (the pane was hidden).
- **Loan submitting / loader on iPhone Safari 26:** the page runs on under the floating search bar, so the centring counted that strip and the content sat ~half its height low. `html.ps-edge .ps-loader--fill, .ps-stage { padding-bottom: var(--sb) }`.
- **Noticed, not changed:** after `APP.home()` from a script the Withdraw order page can stay drawn over the next page (test path only; the app's own back closes it).

## 70 · Loan submitting: nothing moves, sits higher (2026-11-24)

- Owner: the coin and text moved when the last line wrapped to two lines; move the whole thing up more.
- `.ps-stage__text` is always two lines tall (3.5rem, text from the top), and the coin / text glide from entry 68 is removed. The coin + two lines are centred, so the coin sits 14 px higher than before entry 68 and never moves.
- Checked at 360 × 800, sampled every second through all three lines: coin 330–402 and the first line's top 414 the whole time; the last, two-line message ends at 470 (group 330–470, centre 400).
- **Higher still (owner, same day):** `.ps-osub` padding-bottom 3rem (+ `--sb` on iOS 26): the group moves up another 24 px. At 360 × 800: coin 330–402 → **306–378**, text box 390–446, fixed through all three lines (group centre 376, 24 above the middle).

## 71 · Splash: no light band at the top (2026-11-24)

- Owner: every launch showed a header-like gradient at the top of the splash. On iOS Safari 26 (edge mode) the page's light colour showed above the frame, under the status bar and Safari's tint; Android's webview starts below the status bar, so it didn't show there.
- `PS.Splash` adds `ps-splash-on` to `<html>` while it shows; `html.ps-splash-on`, its body and `.ps-frame` take `--bg-brand` (the Credit limit screen's own fix, `ps-climit-on`). The class goes when the splash leaves; Home is back on the page colour.
- Checked with `?edge=1` at 393 × 852: before, a 14 px light strip on top; after, navy to the edge.

## 72 · Credit unlocking soon: Chat pill neutral (2026-11-24)

- Owner: the Chat button on the navy banner looked green. Entry 63 (decision 5) gave it, like the timer pill, the Temporary dot's green at 16 %.
- `.ps-credit .ps-state__chat` now `--bg-glass-on-dark` (white 20 %, the credit bar's track). The Time remaining pill keeps the green 16 %.
- Checked on Home with `user=hold`: Chat pill rgba(255,255,255,0.2), no green cast.

## 73 · Home Next payment: Pay now button navy (2026-11-24)

- Owner: the "Pay ₱… now" button on Home's Next payment card: navy fill, no line, white label.
- Code: `PS.PaymentCard` (home.js) uses Button `navy` before the due date too (was `secondary`, the white outlined one); due today stays navy, overdue stays red.
- Figma: PaymentCard (11093:2765) Status=Upcoming (was Primary) and Status=Next (was Secondary) → Button Variant=Navy. The 14 Upcoming / Next instances on Design - Rebranding follow (no overrides).
- Checked on Home: `ps-btn--navy`, bg #000128, white label, no shadow / border.
- **Time remaining pill too (owner, same day):** `.ps-state__timer` → `--bg-glass-on-dark` (white 20 %), like Chat. It is on the "Help us review your application" card (user=docs). No green translucent fill is left on the navy cards. Checked: rgba(255,255,255,0.2).

## 74 · Coupon sheet: no intro / Your loan block; selected line navy (2026-11-24)

- Owner, node 11273:35457: delete the block ("You can use 1 interest discount and 1 limit increase on each loan." + "Your loan ₱… · 6 terms") in Figma and the demo; the selected coupon's line in the sheet is navy.
- Figma: 11273:35457 removed from 11273:30212 (the only screen with it; the List moves up). CouponPickCard State=Selected (11314:9983) stroke → `check/on-border` (navy, the tick's colour; was `border/accent-emphasis`). The one Selected instance on the screens follows.
- Demo: the coupon picker (screens-loan.js) no longer passes `intro` / `loan` (PS.CouponPicker still takes them). `.ps-copt__card::after` line → `--check-on-border`.
- Checked: order page → See all 6: tabs, then the list, selected 20% OFF with a navy line and navy tick.

## 75 · Order page coupons: a ticked coupon moves the loan to its threshold; no Unavailable in See all (2026-11-24)

- **Owner's rule:**
  - Changing the amount / term so a coupon no longer fits still opens "Keep your coupon?"; Don't use works as before.
  - New: when the user ticks a coupon that doesn't fit, it is used and the loan moves to its threshold.
  - See all: every coupon can be picked (no Unavailable); only Confirm moves the loan, ✕ leaves it.
- **Threshold** (`meet`, screens-loan.js, also `APP.meetCoupons`): the term stays if every picked coupon takes it, else 6 when they all do, else the longest they share; the amount rises to each coupon's minimum (to the ₱100 step). Nothing is lowered.
- **Order page rows** (`toggleRow`): a coupon that doesn't fit is turned on and the loan goes through `APP.loanCheck(meet(…))`, so a coupon the move takes off is asked about in the usual sheet. Toast "Your loan is now ₱… · n terms." (was: refused with "… See all to pick another.").
- **"Use" from the coupon centre** (screens-withdraw.js): same — the coupon is on and the loan moves to its threshold; the other coupon, if the move breaks it, is taken off. (Was: refused with a toast.)
- **See all** (`picker`): CouponOption state default | selected only; the summary shows the loan the picks need; Confirm applies it (toast), ✕ discards. The limit cap message stays.
- **Figma:** the one CouponPickCard State=Unavailable instance on Design - Rebranding (13032:47841) → Default. The Unavailable variant stays in the component (unused); the gallery still shows it.
- **Checked:**
  - Logic: ₱3,000 · 4 + tick +₱5,000 → ₱6,000 · 4; ₱3,000 · 4 + tick 20% off → ₱6,000 · 6; See all with 20% off + +₱2,000: ✕ → unchanged, Confirm → ₱20,000 · 6.
  - Real Withdraw order page: ₱3,000 · 4 → tick +₱5,000 → slider glides to ₱6,000, the top end becomes ₱50,000 with the tag, toast shown.

## 76 · A coupon that can never fit: one-button sheet (2026-11-24)

- **Owner:** "Use" from the coupon list → order page. If the coupon's threshold can't be met whatever the loan, a sheet opens straight after the amount is entered. It has the "Keep your … limit increase?" build (animation, title, text) without the facts box (Figma 11273:33246) and one main button.
- **Never fits** (`never`, screens-loan.js, `APP.neverFits`): the coupon's minimum is above the most this loan can be.
  - A limit coupon counts its own increase.
  - A discount counts its *pair*: the smallest limit coupon the user has that shares a term and whose own minimum can be met too.
  - So with ₱5,000 available, 20% off (₱6,000) and ₱300 off (₱10,000) can still be used: the +₱5,000 comes along. Only +₱2,000 (₱20,000 > ₱7,000) never fits.
- **`plan(l, disc, lim)`** (`APP.planLoan`): the loan with these coupons on, moved to what they need. A discount that needs more than the credit brings its pair, and the amount never goes past the cap. Used by the order-page tick, "Use" (Withdraw path and the fallback loan page) and See all.
- **Sheet `nocoupon`** (card, PS.Decision with no facts and no secondary):
  - Title: "You can’t use your {coupon} on this loan"
  - Body: "This coupon needs a loan of ₱X or more, and [even with the +₱N,] you can borrow up to ₱Y right now. So we’ve left it off this loan. It’s yours to use until {date}."
  - Button: Got it. The loan stays as entered and the coupon stays off.
- **Opens from:** "Use" → amount + term; ticking it on the order page; See all → Confirm (the coupon is left off, the rest applied, then the sheet).
- **Gallery:** Decision gains "Can’t use (one button)".
- **Tune:** "Coupon you can’t use" (On/Off, under Coupons you have; `?credit=low`): available credit ₱5,000, and the app opens on Coupons (opening screen → `coupons` when on and the account is Credit ready). Tap Use on +₱2,000, pick an amount and a term → the sheet.
- **Checked with `credit=low`:**
  - Use +₱2,000 → ₱4,000 · 6 → the sheet; Got it closes it and the loan is unchanged.
  - Use 20% off → ₱6,000 · 6 with +₱3,000; Use ₱300 off → ₱10,000 · 6 with +₱5,000.
  - Ticking +₱2,000 on the order page → the sheet.
- **Not done:** no Figma frame for this sheet yet.

## 77 · Tune: grouped, with a standalone special case (2026-11-24)

- **Owner:** the switch showed no sheet; make it an isolated case, not affected by other Tune settings; regroup Tune.
- **Why no sheet before:** other saved settings could block it (Coupons One / None has no +₱2,000; another account opens elsewhere), and the amount screen started at the Withdraw demo's ₱12,500, above the ₱5,000 that can be borrowed.
- **Special case "Coupon you can’t use"** (`credit=low`):
  - When On it sets Credit ready, repaying, six coupons, ₱5,000 available, and normal checks / network itself (index.html, right after `PSTune.setup`). Display settings still apply.
  - Opens on Coupons. Checked with Logged out + no coupons + no loan saved: the overrides hold; Use +₱2,000 → 6 terms → the sheet.
- **Amount screen** (withdraw-host.js `open`): never starts above what can be borrowed (₱5,000 here, not ₱12,500).
- **Tune panel** (`shared/ps-ui/tune.js`, `tune.css`):
  - Groups: a `{ heading, note, kind, lock }` entry starts a group. `kind: 'scenario'` is tinted and placed first. `lock` groups are dimmed with "Not used while a special case is on." when any special case is on.
  - Settings may carry `desc` (a line under the label). Option rows wrap instead of running off the panel.
  - Pages without headings (first-application, coupon-system) look as before.
- **App groups:** Special cases · Account and loan · Checks and messages · Network · Display. Long labels moved into `desc`.
- **Special cases as a folding list (owner, same day):**
  - The group header ("SPECIAL CASES", "· 1 on" when one is on, chevron) opens and closes it, with a 0.22 s fold. It starts open when a case is on, otherwise as it was left this visit (sessionStorage).
  - Each case is a list row: name, ⓘ and a switch (off = its default). The ⓘ opens a white bubble under the row with the case's description, pointing at the icon.
  - Checked: closed / open / bubble; switch on → reload, header "· 1 on", app on Coupons with ₱5,000; switch off → back to normal.

## 78 · Special case "Coupon you can’t use": its own coupons (2026-11-24)

- **Owner:** with the case on it still didn't reproduce: the case also gave limit increases that make it not hold.
- **Why:** it kept all six coupons. With ₱5,000 available, +₱5,000 lifted 20% off (₱6,000) and ₱300 off (₱10,000) into reach, so the loan moved instead. Only +₱2,000 (₱20,000 > ₱5,000 + ₱2,000) showed the sheet.
- **Now** (coupons-data.js `coupons('case')`, set by the case): 25% off (works), 20% off (₱6,000), ₱300 off (₱10,000), +₱2,000 (₱20,000). No limit coupon can lift a loan, so the last three can't be used on any loan. Tune's description lists this.
- **Checked** (real taps, ₱5,000): Use 20% off → 6 terms → "You can’t use your 20% off on this loan"; Use ₱300 off → 4 terms → "You can’t use your ₱300 off on this loan"; +₱2,000 as before; `neverFits`: d25 ok, d20 / a300 / l2 never.

## 79 · Coupon logic paused (2026-11-24)

- Owner: save the whole coupon discussion; the logic may change; continue later.
- Saved in `rebrand/log/coupon-logic-2026-11-24.md`: the owner's messages verbatim, what is built (entries 74–78), what conflicts with the latest discussion (auto-pairing, See all without Unavailable, limit coupons' amount minimums, the special case's +₱2,000), the gaps and suggestions, and the logic as understood (not built). Nothing changed in code or Figma.
