# Normalisations and classified differences — Figma rebrand (file `3oi5Omgi2dC5sR0L7Ux5hf`)

Status 2026-11-20 (figma lane, log entry 32). Source: geometry checker `geo3` (shared plugin data) over the 175 legacy | rebrand
frame pairs (`pairs175`), plus eye checks of the Look parity sheet (section `11311:21425`, `parity/figma/look-parity.png`).

## How a difference is classified

For every visible text in a legacy frame, `geo3` finds the same text in the rebrand frame and compares the box (x / y / w / h, ±0.5):

| Bucket | Meaning | BRIEF category |
|---|---|---|
| ok | same box | — |
| glyph | same anchor edge and y / h, only the width differs | font glyph (decision 10) |
| cascade | the anchoring container (first non-hugging ancestor) has the legacy box and the text has the legacy y / h; the x shift comes only from narrower Hanken glyphs inside a hugging group (e.g. "₱" before a right-aligned amount) | font glyph (decision 10) |
| lineH | same anchor and centre, height differs by ≤ 4 | normalisation: type (G1, table below) |
| box | centre within 1.5 px, box size differs | font glyph / text box sizing |
| pos | moved | classified per frame below, or open |

Totals after the fixes (checker `geo4`: a width-only difference counts as glyph when any edge — left, centre or right — matches):
**ok 1 272 · glyph 1 728 · cascade 183 · lineH 213 · box 109 · pos 488 · missing 17**; every one of the 59 frames that still has
`pos` rows is classified in §2 / §4 below (113 frames fully clean). Earlier: ok 1 247 · glyph 660 · cascade 1 036 · lineH 211 · pos 728 · missing 61
(before: ok 1 159 · glyph 622 · lineH 140 · pos 2 050 · missing 39; the missing count is texts that legacy shows and the rebrand
frame doesn't have; after the field repair it is 17, all in decision-39 frames).

**Plugin limit (why glyph / cascade can't be frozen):** the Plugin API ignores `resize()` on layers inside instances, so a text box inside a
library instance can't be set to its legacy width per screen. Text boxes keep the legacy anchor (left, right or centre) and the container
keeps the legacy box; only the glyph advance differs.

## 1. Type normalisations (G1) — owner: keep nearest style (2026-11-20)

The v2 type ramp (21 styles, decision 33) has no style with these legacy metrics, so the closest style is used and the box height differs.
**Owner, 2026-11-20: keep the nearest style; no new text styles.** These are normalisations of inconsistent legacy, and every lineH / G1
row of the checker is classified this way.

| Legacy style (size / line height / weight) | Used now | Texts | Visible effect | Where |
|---|---|---|---|---|
| 10 / 16 SemiBold | Caption/xs 11 / 14 Medium | 99 | 1 px larger type, box 2 px shorter | small labels, tags, meta |
| 12 / 15 (125 %) Bold | Label/sm 12 / 16 SemiBold | 32 | box +1, lighter weight | amount captions |
| 16.33 / 23 SemiBold (scaled instance) | Title/xs 16 / 22 SemiBold | 27 | box −1 | card titles in scaled cards |
| 13.6 / 19 SemiBold (scaled instance) | Label/md 14 / 20 SemiBold | 10 | box +1 | scaled cards |
| 12 / 14 Regular, two lines (payment method tabs) | Body/sm 12 / 16 | 20 (`.MethodTabs`) | label 2 px taller per line, icon 5 px higher | Payment / Methods popovers, Short link payment |
| 16 / 22 Medium | Body/lg-strong 16 / 24 | 6 | box +2 | list titles |
| 11 / 14 ExtraBold (tab count badge) | raw Hanken ExtraBold 11 / 14 (no style) | Tab badge | none — keeps the exact legacy metrics as raw values (coordinator, 2026-11-20); the only text on the Rebranding pages without a style | `Tab` `13027:9423` |
| 11 / 14 SemiBold (legacy "Overdue" / remaining days) | Caption/xs 11 / 14 Medium | few | lighter weight | Installment states |

## 2. Differences classified as owner decisions (allowed)

| Decision | Difference | Frames (rebrand ids) |
|---|---|---|
| 19 — sheet header separated from content by 12 px | content inside sheets 12 px lower (MethodPicker, PlaceRow / PlaceTab, BankList / .BankRow, address lists) | 11109:5726, 11109:6329, 11109:11309, 11109:12194, 11109:12948, 11189:16766, 11163:17848, 11163:18973, 11163:20134, 11163:21186 |
| 20 — empty states at 40 % of their container | EmptyState block (and search-empty text) moved | 11155:10416, 11155:10646, 11200:17043, 11200:17230, 11200:17331, 11109:9617, 11259:17904, 11273:23882, 11273:28567, 11109:6835, 11109:12948 |
| 22 — icon tiles removed, 24 px filled icon | rows with a 28 px tile are now 24 px tall: every row below moves up 4 px (credit hub rows, permission / reminder rows) | 11273:25193, 11155:10908, 11155:11425, 11155:13411, 11200:17432, 11051:32, 11163:23146 |
| 25 — equal-width month / year controls | month and year labels ±3 px (centred in 150 px columns instead of 156) | 11163:12004, 11163:12582, 11163:13127 |
| 39 — current pieces / current screen behind sheets | background screen differs (+34; missing "₱40,000.00", "Total balance:"); coupon loan-detail frames rebuilt with current pieces | 11263:19752, 11263:20277, 11263:20755, 11263:21612, 11055:1957, 11055:2141, 11055:2349, 11055:2492 |
| 13 — PhoneField one-job design | "+63" pill and value positions | 11051:244, 11263:18772, 11263:18880 |
| 6 / 21 / 35 — tooltip redesign | tooltip text −4 / +6 | 11053:1210, 11155:9918 |
| 10 — Hanken Grotesk everywhere | big amounts drawn as separate texts ("₱40,000" + ".00", 48 px) shift with Hanken's narrower digits (".00" −26); the Cancel-my-loan reason sentence fits on one line instead of two, so the list moves up 20 | 11273:28719, 11273:29417, 11053:1033, 11053:1210, 11053:1397, 11109:5010, 11259:18218 |
| 14 / 19 — scrim and Over shadow on every pop-up | scrim colour / shadow only | all sheets |
| 8 — flat navy cards | no gradient on credit / state cards | home, account, hub |

## 3. Other normalisations

| What | Legacy | Rebrand | Why |
|---|---|---|---|
| TopBar veil | gradient mist 80 % → 40 % → 0 % (raw on legacy) | same gradient, raw stops | Figma can't bind gradient stops to variables; values equal Surface/Page |
| Field clear icon | `Cancel small` 18 px, dark circle | the same legacy component (dec 32) | — (exact) |

## 4. Remaining frames — classified

| Frames | Difference | Class |
|---|---|---|
| 11273:30212 | CouponPickCard title −2 | G1 (title 16 / 22 vs legacy 16 / 24) — owner: keep nearest style |
| 11257:46414, 11109:5010 | FAQ titles 16 / 22 Medium → 16 / 24 (−3); amount entry digits 48 / 44 → 48 / 48, ₱ 28 / 28 → 28 / 36 | G1 — owner: keep nearest style |
| 11109:11309, 11109:12194, 11109:12948, 11189:16766 | payment method tab labels +7 | G1 (12 / 14 two-line labels → 12 / 16) — owner: keep nearest style |
| 11163:17566 | ID-type list rows ±3 | normalisation: the "Higher credit" tag is the library Tag Small (22 tall); legacy small tags vary 18–22 |
| 11189:17580 | "Repayment detail" title −12 | normalisation: the short-link page uses the standard TopBar Back+Title (legacy drew its own header 12 px lower) |
| 11257:46534 | one LinkRow text box | box size only (font glyph) |
| 11273:23987, 11273:24336 | "Valid until" +8 in the long-text coupon | **known defect, manual fix:** the two CouponTicket instances `11273:31363`, `11273:31579` keep a 32 px height on `Row / Rule` from an old override that the Plugin API can't reset; in Figma select `Row / Rule` → right-click → Reset (main is 16 px, NO_WRAP) |

Fixed in this round (no longer in the list): App download landing page 11263:17985 (owner: mockup at legacy 0.73× — content set in
the v2 styles of the unscaled legacy sizes and rescaled by 0.7308, Navigator / Legal rescaled instead of resized (BRIEF 36): 0 moves,
0 missing; its line heights fall under §1), Payment index pages' top padding (95 → legacy 83: 11109:8723, 11109:9162), date-picker
month / year rows (22 px tall, decision 25 touch areas overflow), Marital status rows (SelectBar `Style=Card-trailing`), coupon picker
(CouponPickCard), Stacked field labels and Search placeholder (icon 18 as legacy), A27, 130 texts back to Regular (legacy 12 / 16 and
11 / 14 Regular → Body/sm / Body/xs instead of Caption Medium).

**Eye check of box-matched shapes:** done on the Look parity sheet (148 rows, composites legacy | rebrand) and on the screens touched in
this round (coupons, inbox, application details, payment methods, coupon picker, order card, date picker); fills and strokes follow
`shapeLvl` elsewhere. No further shape defect found.

## 2026-11-21 · LOOK-DIFF pass (Figma lane, entry 38)
- Placeholder colour: legacy PhoneField / Field placeholders use `Color/Neutral/150` (#CDD1D4) while other legacy placeholders use
  Content/Placeholder (neutral-400). Kept as legacy (Palette/Neutral/150); phase-2 inconsistency for the owner.
- G1 line heights also explain ChoiceButton 58 vs legacy 56 (Title/xs 22 vs legacy 20).
- Legacy Tag "Overdue" component is fixed 100 wide; rebrand Tag hugs its text (59 on the sheet). Screens hug the real text.
- Intended look-parity differences (coordinator, 2026-11-21): Toast `13036:57458` dark fill, radius 16, white text (dec 6; width 360 and
  weight now legacy); MethodPicker "Recommend" navy text on green-500 (dec 19, white was 1.9:1); Used coupon `13036:56028` Bg/Disabled card +
  Accent-strong texts (owner, option b).
