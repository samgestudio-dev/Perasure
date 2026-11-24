# CouponPayCard

Figma: component `11273:4945` (Component - Rebranding) · 344 × 174 · added 2026-11-20 (log entry 24)
The glass total card at the foot of the coupon sheet. Translated from legacy "Coupon primary card" `10926:29645` (phase 1).

## Parts and tokens

| Part | Value |
|---|---|
| Card | vertical, gap `Spacing/Gap/lg` 16, padding `Spacing/Padding/md` 12, radius `Radius/xl`, fill `Surface/Glass/Default`, effect style Blur/Glass |
| Label | "Total payment", Body/sm, `Content/Tertiary` |
| Amount | "₱46,000.00", Amount/md, `Content/Primary`; old price "₱46,500.00" Body/sm `Content/Disabled` (struck) |
| Saved chip | pill, padding 4 / 12, gap 4, border `Border/Positive/Default`; Icon / Check 12; "Saved ₱500" Label/sm `Content/Positive/Strong` |
| New limit chip | pill, fill `Surface/Brand/Subtle`, border `Border/Selected/Default`; arrow-up 12; "New limit ₱50,000" Label/sm `Content/Brand/Default` |
| Button | Button Large Primary "Confirm", full width |

No component properties: screens hide the chips or the old price by override (Loan application / Empty state shows label, amount and
Confirm only, as legacy).

## Used in

Coupon center / Loan application / Empty state, Coupon discount.
