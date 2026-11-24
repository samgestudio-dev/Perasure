# AmountCard

Figma: component set `11064:2451` (06 · Product cards `10982:21`) · 2 variants · showcase `11064:2483`
"Disbursement amount" + slider + loan term on the loan page. Replaces the amount card that was drawn on each screen (New user loan, Loan
Detail) (demo `PS.AmountCard`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Coupon boost | VARIANT | Off · On | Off | `boost` |
| Label | TEXT | | "Disbursement amount" | `label` |
| Amount | TEXT | | "₱45,000.00" | `amount` (formatted `PS.num(amount, 2)` with ₱) |
| Edit | BOOLEAN | | true | `onEdit` (the pencil opens the keypad page, AmountEntry) |
| exposed Slider | Value · Min · Max | | High · ₱500 · ₱45,000 | `amount`, `min`, `max`, `step`, `onAmount`, `onCommit` |
| exposed KV | Label · Value | | "Loan term" · "15 days / term" | `termNote` |
| exposed Chips (Term 3 / 6 / 8) | State · Label | | 6 terms Selected | `terms` [3, 6, 8], `term`, `onTerm(t)` |

## Parts and tokens

Card: vertical, width **343** (fills the page column), fill `var(--surface-default)`, radius `var(--radius-card)`, padding
`var(--spacing-padding-lg)`, gap `var(--spacing-gap-md)`, shadow `var(--elevation-1)`.

| Part | Token |
|---|---|
| Top | vertical, gap `var(--spacing-gap-sm)`: Head + Slider |
| Head | vertical, gap `var(--spacing-gap-xs)` |
| Label | `.ps-t-body-md-strong`, `var(--content-tertiary)` |
| Amount row | gap `var(--spacing-gap-2xs)`, centred: amount `.ps-t-amount-lg` `var(--content-brand)` + edit 20 `var(--content-brand)` |
| Slider | Slider, fill width (see Slider.md) |
| Divider | line, 1 px stroke `var(--border-subtle)`, 0 tall in layout (legacy Line 24) |
| Term | vertical, gap `var(--spacing-gap-md)`: KV Inline (no divider) + Terms |
| Terms | row, gap `var(--spacing-gap-sm)`, three Chip Medium sharing the width; the chosen term is Selected |
| Coupon boost=On | Slider Boost On (max in `var(--content-positive-strong)` with the coupon mark) |

## States

| # | Props |
|---|---|
| 0 | `amount:45000, min:500, max:45000, terms:[3,6,8], term:6, termNote:'15 days / term'` |
| 1 | `amount:45000, min:500, max:50000, boost:true, terms:[3,6,8], term:6, termNote:'15 days / term'` |

## Phase 1 · legacy geometry (2026-11-19)

Matches legacy order primary card 10926:29643: 328 × 246 (Slider 42 + a 0-tall divider line, 2026-11-20), gap 16, term row = two texts (Term label / Term note "15 days / Term"), chips Small "3 Terms".

Detached copies: some legacy screens hold a detached copy of the order primary card (Frame 1940699008, e.g. 8957:16442, 9137:26565). The kit rule "AmountCard (detached)" now swaps them for AmountCard too (they had become drawn frames with grey term chips).
