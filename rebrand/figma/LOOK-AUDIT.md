# Look audit: legacy component → library variant (figma-lib, 2026-11-20)

Brief: BRIEF "⚠️ Look parity". Allowed differences: colour values through the token mapping, owner decisions 2, 3, 8, 10, 12–16,
18–22, 24–31, 33–39, Hanken glyph shapes (text boxes keep legacy positions), normalisations (`NORMALISATIONS.md`).

**Method.** The sheet "Look parity" (section `11311:21425` on Component - Rebranding) holds one fresh instance of every legacy
component variant used by the 175 legacy frames (148 rows, icons and system art excluded): left `Look parity / Legacy source`
`11311:21426`, right `Look parity / Rebrand` `11311:23552`. The right column is the kit's own translation of the left one, so it
shows exactly what the screens get. To re-test after a fix, delete the right frame and run the kit job again (log entry 27).
Compared by eye at 1:1, row by row. Drawn (non-instance) parts of screens, such as the coupon ticket notches and the header pill, are
covered in the page pass (part B).

Status: **open** = not fixed yet · **fixed** = library / kit fixed and re-tested on the sheet · **ok** = allowed difference.

> **Status 2026-11-20 (fourth session, log entry 32):** fixed in the library and on the screens, re-tested on the re-translated sheet:
> A2, A4, A5, A7 (new `Tab` set), A8, A9, A10 (Button Glass), A13 (Tag Outline-fill), A16, A17 / A18 (Field `Layout=Inline`, 83 screen
> fields), A19, A20, A21, A22 (`rangeFix`), A24, A28, calendar selected date, "Recommend" tags. Already OK on re-check: A25, A30, A32.
> A14: not used on any screen → skipped (coordinator, no new token). A27 (MethodPicker / OTP text x +5: open),
> A29 (inside retired `_bin/AmountCard`, OrderAmountCard on hold). G1 → owner table in `NORMALISATIONS.md`; G2 → the Plugin API can't
> resize layers inside instances, so hug drift is classified as glyph cascade (container keeps the legacy box). Part B: see
> `NORMALISATIONS.md` (classified differences + open list).

## A. Component rows

| # | Legacy component (variant) | Library target now | Difference | Allowed? | Fix | Status |
|---|---|---|---|---|---|---|
| A1 | Any rotated `Icon / Chevron right` (up / down: Expandable, File catalog, Drop down, Accordion…) | Chevron right, unrotated | Up / down chevrons point right: the kit's unrotate post-pass (BRIEF 26) turns every rotated chevron into a right chevron | no | Kit `unrot`: rotation 180 → `Icon / Chevron left` (line), ±90 → a Chevron up / down component at the same stroke, never right. Re-run on all frames | open |
| A2 | Coupon `10643:48597` (Default, countdown, long text) | CouponTicket `11046:2168` | "Use": legacy small outlined rounded rectangle (~60 × 28, 1 px, r ≈ 6) vs a round 50 × 40 pill | no | Button variant Size=XS / Outline / legacy radius; CouponTicket uses it | open |
| A3 | Coupon (all live variants) | CouponTicket | "Best": legacy subtle tag (light fill, green text) vs strong solid tag | no | CouponTicket Best = Tag Subtle Accent | open |
| A4 | Coupon (Default - long text) | CouponTicket | Legacy truncates the rule to 1 line with an inline (i) Info circle at the end; new wraps 2 lines and puts an Alert circle before the date | no | Rule row: 1 line, ENDING truncation, `Icon / Info circle` after the text | open |
| A5 | Coupon tickets on Coupons / To use (drawn around the instance) | CouponTicket | Half-circle notches on both sides in legacy; plain rectangle now (coordinator, overlay 10628:47774) | no | CouponTicket gets the notch cut-outs (Notches=On) at the legacy positions; check every coupon screen | open |
| A6 | coupon picker `Installment` 10840:29499 (selected), `/Variant2` 10840:29500 (unavailable), `/Variant3` 10842:29685 (unselected) | CouponTicket | Wrong component. Legacy: white card, 1 px brand outline (selected), r 12, "Best" subtle tag right + check / empty radio, orange outlined "Expires in" pill top-right, bottom tinted "Expires in" strip (selected), "Unavailable" right + divider + Borrow line | no | New set **CouponPickCard** `11314:9986` (06 · Product cards): State=Selected `11314:9983`, Unavailable `11314:9984`, Default `11314:9985`, translated from the legacy mains with only colours and text styles mapped; map points the 3 legacy sets at it. Left: Unavailable is 96 tall vs 98 (title line height 22 vs legacy 24, see G1); hugging pills narrower (G2). Screens not re-applied yet | partly fixed |
| A7 | coupon pill `10594:45571` (Active / Default) + inbox filter tab `8620:34465` | Chip `10989:185` | Legacy: tabs inside one white track; Active = filled pill with a white count badge; Default = text + grey count badge, no border / fill. New: separate outlined / solid pills, count merged into the label, taller | no | New component Tabs (track + segment, Badge on / off) at legacy sizes; map both legacy sets to it | open |
| A8 | Header Action Container `3416:1148` Primary | TopBar Type=Brand | Bell + headset grouped in ONE white pill (legacy) vs two separate circles | no | TopBar Brand: actions in one pill group (legacy geometry) | open |
| A9 | Header Action Container (Primary, Secondary, Back, Title, Secondary two btn) | TopBar | Legacy header has a vertical gradient veil (page colour → transparent); new is a solid band | no (no decision covers it) | TopBar fill = gradient veil in the mapped colour | open |
| A10 | Calendar/button `5892:9378` (Cancel / Confirm) | Button Secondary | Legacy white pill with shadow, no border; new outlined pill, no shadow | no | Button Variant=White-elevated (fill Surface, Elevation/1, no stroke); map | open |
| A11 | Popover btn `5911:9660` Variant2 ("Try again") | Button Secondary | Legacy thin 1 px light-grey outline, grey label; new thick navy outline, navy label | no | Button Outline-subtle (1 px Border/Default, Content/Secondary); map | open |
| A12 | Term pick `8980:16878` + the in-card term chips (order primary card) | Chip | Default: legacy light-grey 1 px outline + grey label vs dark outline + dark label. Selected: legacy tint fill + 1 px outline + brand label vs solid green, no outline | colour of selected = green (dec 2); shape no | Chip Default = Border/Subtle + Content/Secondary; Selected = green subtle fill + 1 px green border + green label | open |
| A13 | borrower protection pill `9124:24180` | Tag | Legacy subtle fill + border; new border only | no | Tag Outline+Fill variant; map | open |
| A14 | remaining days `5610:6087` Variant2 ("Overdue") | Tag | Legacy fixed ~100 wide, new hugs ~58 | no | Keep legacy width (fixed) in the map | open |
| A15 | credit increase `10656:51695` / percentage off `10656:51539` (Active) | copy, nested radio remapped | Selected check-circle lost: shows an empty radio | no | Map: legacy Check mar `5607:6085` → library `Check` `10989:254` Small On / Off (check-circle, not Radio). CouponOption `11273:4944`: Radio swapped for Check (Active = On) in all 4 variants. Screens not re-applied yet | partly fixed |
| A16 | Select bar `5680:9442` / `5772:13613` Default | SelectBar | Legacy radio (ring + dot) vs a filled check-circle; border looks heavier | no (radio colour navy = dec 2) | SelectBar Selected uses Radio On; stroke weight = legacy | open |
| A17 | Typing box/Empty `3921:1419` | Field | Legacy: one-box layout, label inside, label + placeholder red, no caret. New: multi-box layout, label above, caret, dark | no | Map to Field one-box Error-empty look | open |
| A18 | Typing box/Filled `3924:1433` | Field | Legacy: one-box, label inside (grey) + value, no caret. New: label above + caret (Typing) | no | Map to Field one-box Filled | open |
| A19 | Typing box/ one box per page `5933:8750`, Phone number typing `3279:127` | Field / PhoneField | Focus label brand-coloured in legacy, dark / grey now; PhoneField placeholder ~14 → ~16 and "+63" larger | label colour = token mapping (should map to a brand content token); size no | Map label colour; PhoneField text styles = legacy sizes | open |
| A20 | Typing box/ multible boxes (Typing) | Field | Label legacy grey regular, new dark and heavier | no | Field Typing label = legacy style | open |
| A21 | Search Bar `3081:574` (Default / Focus) | Search | Legacy grey filled circle-✕ on both; new none on Default, thin ✕ on Focus; text size differs | no | Search clear = Close circle filled, shown as in legacy; text style = legacy | open |
| A22 | Bank list (Focus), City list (Matched), Email/Auto filled, penalty / upcoming notice ("5%") | copies | Text-range colours lost: typed-part highlight (bank, email) and the red "5%"; notice line 2 becomes semibold dark (legacy regular grey) | no | Kit copies per-range fills and styles (getStyledTextSegments) | open |
| A23 | Expandable Container `5922:10152` | copy | Title legacy dark primary → new tertiary grey | no | Colour map: that legacy token → Content/Primary | open |
| A24 | Extra Documents Verified Tag `3651:1461` | `11156:5431` | Broken: badge blob offset, loose check below | no | Rebuild as the legacy badge-check 16 | open |
| A25 | ID FAILED `5914:9238` | `11166:4407` | White ✕ on red → black ✕ | no | Glyph = Content/Inverse | open |
| A26 | FAQS/feedback btn `5453:5054` | Chip | Legacy plain label (no visible fill / border on white) vs outlined / solid chip | check legacy fill / stroke | Match legacy exactly | open |
| A27 | Delete my account/otc, type rows ("GCash") | copies | Text x +5 (16 → 21, 28 → 33) | no | Kit: keep the legacy text x (padding copy) | open |
| A28 | Home primary card (legend dot) | copy | Dot before "Total credit" missing | no | Keep the dot (mapped colour) | open |
| A29 | order primary card · With coupon | `_bin/AmountCard` | Slider end "₱50,000" with the coupon icon in green → plain grey | no | AmountCard With coupon end label = legacy (icon + green) | open |
| A30 | Links: About Perasure list, System notification "View more", Installment "Detail" | copies | Legacy link blue becomes navy / black here but green in FAQs / City | colour; one mapping | Legacy link colour → `Content/Link/Default` everywhere (dec 2: links green) | open |
| A31 | Drop down `3259:962` Active | copy | Tile removed (BRIEF 22, allowed) but chevron up → right (see A1) | A1 | A1 | open |
| A32 | Bottom Nav Action Container/Terms `3420:1821` | BottomBar | New shows the gradient band; legacy has none | no | Terms variant without band | open |
| A33 | Small "New" label (owner, from `11161:11636`) and the other small badges that went navy in entry 14 (Account menu "New" / coupon count badges, any others) | navy fill | **Tag Accent Strong**: fill `Bg/Positive/Default` (green-500), label `Tag/Accent/Content/Strong` (navy), legacy geometry 40 × 20 (owner, 2026-11-20) | find every badge that entry 14 set to navy (Account menu, list rows, tabs), swap to Tag Accent Strong at the legacy size; add the look to the Tag set if missing | open |
| A34 | ActivityItem `11157:4385` tile icons (owner, from `11159:12050`; BRIEF 28 updated) | green "Loan Approved" tile icon is navy | both tiles' icons **white** (`Content/Inverse`), the green tile included | change in the component (all variants), screens follow; re-export ActivityItem.png + affected overlays | open |
| A35 | Focus rings and text carets everywhere (owner, from PhoneField `11018:750`, "green, the light one"; replaces the OtpBox-only note) | navy | **`Border/Focused` re-aliased Navy/900 → Palette/Green/500** (`VariableID:10999:154`, done 2026-11-20). Still to do: bind every caret (PhoneField, Field, Search, OtpBox, AmountEntry…) to Border/Focused where it is navy / raw; check every focus ring uses Border/Focused (PhoneField, Search, OtpBox, any Field focus state legacy draws with a ring); Error stays red, other states legacy | sweep library components + screens; re-export affected PNGs (PhoneField, Field, Search, OtpBoxes, AmountEntry) + overlays | variable done, sweep open |
| A36 | Slider `11063:2434` (owner, 2026-11-20: "green, a lighter one") | Fill + knob (Rail) navy | Fill and knob → green-500 `Bg/Positive/Default` #5CD680 in every Slider variant; track and end labels unchanged; also the slider inside OrderAmountCard / AmountCard | change in the component; re-export Slider.png + affected overlays (amount entry / loan detail frames) | open |
| A37 | Coupon "Best" pill (owner, node `13036:55898`, 2026-11-21) | CouponTicket Best = Tag Small Accent Strong (38 × 22, r8, solid green-500, navy 11/14 Medium) | Legacy: 43 × 24, padding 8/4, r12, fill `Color/Positive/100` (green-100), text 12/16 SemiBold `Color/Text/Positive/Heavy` (green-700) | owner: legacy shape, **orange scale at the legacy steps** | New Tag `Size=Medium, Tone=Urgent, Emphasis=Subtle` `13049:9588` (r12, p8/4, Label/sm): fill orange-100 (`Palette/Orange/100`, stop-gap until a semantic orange-100 fill token exists), text orange-700 `Content/Urgent`; CouponTicket Use / Pick / Selected Best → this variant, fixed 43 px (legacy box); CouponPickCard drawn Best pills (48 × 24, already legacy geometry) recoloured the same | fixed (token pending) |
| — | About list, Upload sheet, Bank list (rest), Bottom Nav (Default / Variant2 / 3), Calendar date / week, City list, Close, Contact method, Coupon Used / Expired, Coupon primary card, Credit History tab, Credit history card, Credit limit primary card (dec 8), Customer service list, Questionnaire, Detail list, Exist account, FAQs lists, Feedback box, File catalog Default, Header Back / Secondary (except A9), Home upcoming payment card, Installment (repay) tiles (dec 3), Installment State, Installment card, Loan detail popover, Loan state (BRIEF 22), Loan state card (dec 3), Method type, Navigator, Page empty state, Popover btn Default (dec 7), Profile credit hub (BRIEF 22), Resend btn, Search city tabs, Star 5, Status, Toast (dec 6), Top nav btn, delete CTA, number typing, select overlay, sms, search city list | various | colour only / allowed decision | ok | — | ok |

## G. General causes (found while fixing; they explain most page drift)

| # | Cause | Effect | Fix (kit, all frames) | Status |
|---|---|---|---|---|
| G1 | Text style mapping picks a v2 style whose line height differs from legacy (e.g. legacy 16 / 24 title → a 16 / 22 style) | Boxes 2 px shorter, everything below shifts | Map each legacy (size, weight, line height) to a v2 style with the same line height; where none exists, list it for the owner (type addition or normalisation) | open |
| G2 | Auto-layout frames that hug their text shrink because Hanken sets narrower than Inter | Pills / tags narrower, right-aligned items shift (CouponPickCard "Expires" pill +7 px) | Post-pass "legacy geometry": every translated node whose legacy twin is known gets the legacy width / height fixed and the legacy x / y (text boxes keep legacy size; glyphs may differ) | open |
| G3 | `copyOverrides` swapped nested icons to the legacy icon without its rotation | Up / down chevrons became right | Fixed in kit (A1) | fixed |

## H. Colour hierarchy

> **2026-11-20, owner: BRIEF "✅ Colour rule — step for step" supersedes the case-by-case greens below.** Legacy blue step N → green step N;
> navy only for dark brand surfaces; text keeps legacy neutral levels. H1 = sync variables from `tokens/v2/figma-tokens.json`, regenerate
> the kit map, translator step rule, then re-bind everything. A33–A36 colour targets are re-checked against the step rule.
 (owner, 2026-11-20, BRIEF "⚠️ Look parity": colour hierarchy is the legacy hierarchy)

Every text and icon keeps its legacy level: Primary / Secondary / Tertiary / Placeholder / Disabled / Inverse / Brand / Link / Positive /
Negative, mapped through `tokens/v2/rename-map.json` (changed 2026-11-20 18:15; 2 719 entries, reload it, never a cached copy).

| # | Item | Now | Required | Fix | Status |
|---|---|---|---|---|---|
| H1 | Kit variable map `RM` (inline in shared data `kit`) | old values, e.g. `Color/Text/Brand/Default` → `content-brand` (navy #000128, reads as Primary) | regenerate `RM` from rename-map.json: legacy `Color/Text/Brand/*`, `Color/Icon/Brand/*` (default, heavy, light) and `color-action-text-brand` → **`Content/Accent-strong`** (green-800); every other legacy text / icon token → its rename-map target | generate `RM` from the JSON (script), replace it in the kit, check `Content/Accent-strong` exists in Semantic `10999:16` (create from the v2 build if missing, scopes TEXT_FILL / SHAPE_FILL / STROKE_COLOR) | **fixed (kit + variables):** Content/Accent-strong, Content/Link/Default, Content/Positive/Default, Bg/Positive/Strong → Palette/Green/600; Content/Link/Pressed → Green/700 (BRIEF "Green content = green-600"). Kit `RM` merged with the 265 colour entries of rename-map.json (shared data `rmNew`): 312 entries, legacy Brand text / icon → content-accent-strong. Existing screens not re-bound yet (H3) |
| H2 | Raw legacy brand-blue text / icon paints (#2C74BE and siblings) | navy or primary | `Content/Accent-strong` | kit raw-colour rule + re-apply | open |
| H3 | Component defaults override legacy levels (e.g. coupon subtitle "First-payment interest": legacy Brand → now Primary) | library default colour | each instance's text / icon gets the legacy node's level as an override | kit post-pass: for every translated text / icon with a legacy twin, bind fill to map(legacy token) | open |
| H4 | Where navy `Content/Brand` stays (owner) | — | only: BRIEF 22 filled icons, PlaceTab label, ActivityItem icons on green, Tag Strong text | exempt list in the post-pass and the checker | open |
| H5 | Checker rule `level` | — | for each text / icon with a legacy counterpart: v2 role = map(legacy role); list mismatches; target 0 | add to shared data `check` | open |
| H6 | Library components whose default text / icon colours differ from the legacy component they replace (CouponTicket subtitle, Field label, link rows…) | defaults | defaults = legacy level of the main legacy use; instances override the rest | per component during part A | open |

| H7 | Legacy brand-blue icons / outlines inside library components (owner examples: ContactMethod `11086:2673` "SMS" icon + circle outline if legacy drew it in brand, and every ContactMethod: Call, Email…; `.MethodTabs` selected item `11133:6114` "QR Code" icon, label keeps its legacy level) | navy / primary | `Content/Accent-strong` (green-600) for icons; outlines → the mapped brand border | sweep: every library component built from a legacy main, compare each icon / stroke with its legacy twin's token, re-bind by RM; screens via H3; H5 checker covers icons and strokes, not only text | open |
> **Status 2026-11-20 (file `3oi5Omgi2dC5sR0L7Ux5hf`, log entry 29):** H1 done (variables synced from tokens/v2; kit map `rm2` = rename-map,
> replaced). H2 done (`rawStep`, step rule for raw paints). H3 / H5 / H6 / H7 done for texts and icons: 175 frames + 130 component variants
> re-bound to map(legacy role) by checker `lvl`; 0 unclassified, 173 exempt (owner decisions, H4 list), 14 blocked by the contrast guard
> (listed in entry 29). Entry 30: green text = green-800; per-node fill / stroke pass `shapeLvl` applied (A11, A12, A26, A36 colour
> parts fixed; checks / radios navy flagged). Geometry data in `geoLast`; shape items A2–A32 / G1–G2 still open (resume point, entry 30).
Per page (part B), every remaining colour difference is classified as level-correct colour change or fixed.

## B. Pages (pixel alignment)

Every frame: overlay legacy | new | difference + numeric position diff of every mapped node; each remaining difference classified
(colour / decision N / font glyph / normalisation) or fixed. "done" only when nothing unclassified remains.

| Section | Frames | Done | Notes |
|---|---|---|---|
| (filled in per section after part A is fixed) | | | |
