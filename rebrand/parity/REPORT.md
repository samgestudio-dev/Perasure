# Figma ↔ demo parity report — components (2026-11-19)

30 components checked (all have both PNGs and a spec). **7 match, 23 differ: 10 high, 21 medium, 25 low.**
Method: `parity/figma/<Name>.png` (1x) vs `parity/demo/<Name>.png` (2x, halved) against `spec/<Name>.md`. Sheet backgrounds differ
(Figma #F7FAF9, demo stage #F0F5F4) and the demo stage clips shadows — not counted.

Phase rule applies (BRIEF): where a difference is about layout, the **legacy layout** decides; the spec should already follow it.

## High — demo side is wrong

| Component | State | Difference | Fix |
|---|---|---|---|
| Segmented | 3 disabled | State missing in the demo gallery | add state 3 (`disabled:true`) |
| CreditCard | 1 temporary | Temporary legend dot white | `--content-accent` |
| Check | 2, 6 disabled | Mark has no fill | `--surface-default` (BRIEF 15) |
| Chip | 3, 7 disabled | Chip has no fill | `--surface-default` (BRIEF 15) |
| Field | 7 stacked focus | Label grey | `--content-brand` |
| EmptyState | 0, 1 | Box art ~36×29, no rays | art slot 80×80, the full illustration |
| HomeCoupons | 1 one | Body wraps to 2 lines, card 116 → 123 | match spec padding / text width so it stays 1 line |
| TopBar | 4 search | Search ~228 wide, close 68 from right | Search fills the row, close 16 from right |
| UploadTile | 0–3 picture | Slot ~57×36 | slot 165×107 |
| UploadTile | 2, 3 done/error | ID card fills slot, mark over it | 40 px card centred, 20 px mark bottom-right |

## Medium

| Component | State | Difference (Figma · demo) | Wrong side |
|---|---|---|---|
| UploadTile | 1 loading | thin 24 px ring · heavy ring | demo (follows slot) |
| HomeCoupons | 1 | art: pink ticket + ₱ badge · mint ticket + arrow | check legacy |
| HomeCoupons | 0 | badge on coupon 1: ₱ · % | check legacy |
| HomeCoupons | 0 | card 156 / inner 68 · 168 / 76 | check legacy |
| CouponTicket | 0–5 | plain rectangle · notched edges | check legacy (spec silent) |
| CouponTicket | 5 unavailable | right slot empty · Check off | check legacy |
| CreditCard | 0, 1 | Total/legend/bar inset 20 · 16 | check legacy |
| CreditCard | 0 | amount→Total 22, card 196 · 17.5, 192 | check legacy |
| CreditCard | 1 | legend→bar 10, card 216 · 18, 223 | check legacy |
| KV | all | card 375 / KV 343 · 343 / 311 | demo |
| Navigator | all | bar 58, pill 47–48 · 54, 46 | check legacy |
| PaymentCard | 0 | amount→divider 29, card 163 · 24, 154 | check legacy |
| PaymentCard | 1 | notice title→body 21, notice 77 · 26, 83 | check legacy |
| Popover | 0 | anchor label "Region" navy · "REGION" grey | demo (colour); case per legacy |
| Popover | 1 | no dividers · dividers | check legacy |
| Popover | 1 | row pitch 48 · 44 | demo |
| Scrim | 0 | frame 800 · 358 | demo |
| Sheet | 0–2 | title 16 in · ~28 in | demo |
| Sheet | 2 page | 684 tall · ~452 | demo |
| StateCard | 0–3 | icon top-aligned · centred | check legacy |
| TextLink | 3, 4 on navy | row 69 · ~76 | demo |
| Toast | 4 neutral+Undo | 44 · 52 | demo |
| TopBar | 2 brand | 2nd button headset · help | check legacy (legacy Home has headset) |

## Low (fix while there)

Field stacked label case (sentence vs UPPER — check legacy) · Field close icon 12 vs 14 · Field floating 58 vs 56 (Figma off) ·
Button 11/12 side padding 16 vs 12 (Figma off) · SelectBar card 51 vs 48 (Figma off) · PaymentCard title/tag alignment ·
PaymentCard overdue notice body width · PhoneField flag rounded-square vs circle (check legacy) · Search clear X 12 vs 14 ·
Sheet page shadow (spec none) · Sheet showcase page behind (secondary page per spec) · CouponTicket sample copy · HomeCoupons tab join
curve · Scrim/Sheet showcase extras · TextLink showcase grouping.

## Match

InboxItem, Installment, LineTabs, ListItem, OtpBoxes, Tag, Tooltip. Minor only: Search, SelectBar.
