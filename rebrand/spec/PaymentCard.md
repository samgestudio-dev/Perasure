# PaymentCard

Figma: `11093:2765` (06 · Product cards `10982:15`) · 5 (Status) variant(s) · showcase "PaymentCard · states"
The next repayment on home. Replaces legacy Home payment card 5998:19294 → Upcoming; Home upcoming payment card 10545:40951 (Default 10545:40950 → Due, Variant2 10545:40952 → Overdue, Variant3 10545:41016 → Overdue coupon); drawn home card 10789:29251 → Next (demo `PS.PaymentCard`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside).

## Props

Status (VARIANT); Tag and Button exposed. No shared TEXT props (each variant has its own legacy copy; texts are instance overrides).. React: `amount`, `was`, `due`, `badge`, `action`, `onPay`, `status`.

## Parts and tokens (legacy geometry)

328 wide, padding 16, radius 24, gap 12–16 as legacy; heights Upcoming 149, Due 245 (legacy 246), Overdue / Overdue coupon 260 (262), Next 152. Badge = Tag Small; button = Button Small (Upcoming, Next) / Medium (in-card); penalty line = .PaymentNotice.

## States

| # | Variant |
|---|---|
| 0 | Upcoming |
| 1 | Due |
| 2 | Overdue |
| 3 | Overdue coupon |
| 4 | Next |

## 2026-11-20 · Legacy heights after graded tracking

- Upcoming amount + old price use cap-height leading trim as legacy (24 px text in a 17 px box); the card is 149 again (was 164).
- Due / Overdue / Overdue coupon / Next amounts: fixed legacy 24 px boxes, width kept for the wider tracking, text centred.
- Penalty line (.PaymentNotice) text had no style (auto line height) → Caption/sm 12/16. Due 246, Overdue 262 = legacy.
