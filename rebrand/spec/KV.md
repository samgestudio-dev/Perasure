# KV

Figma: component set `11028:1193` (04 · Lists `10982:19`) · 6 variants · showcase `11028:1194`
A label and its value. Replaces legacy Detail list element and Registration box (demo `PS.KV`, `PS.Facts`, `PS.InsetRows`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Layout | VARIANT | Inline · Stacked | Inline | `layout: 'inline' \| 'stacked'` (stacked = `PS.Facts`) |
| Tone | VARIANT | Default · Positive · Negative | Default | `tone` |
| Label | TEXT | | "Loan date" | `label` |
| Value | TEXT | | "July 5, 2026" | `value` |
| Info icon | BOOLEAN | | false | `onInfo` (help mark after the value, opens a Tooltip) |
| Divider | BOOLEAN | | false | `divider` (demo `PS.Rows` puts dividers between rows) |

## Parts and tokens

Root: vertical, width **343** (Fill inside a card's 16 px padding — KV has no side padding). Parts: Row · Divider.

| Part | Property | Inline | Stacked |
|---|---|---|---|
| Row | direction · align | horizontal, space between, centred | vertical |
| Row | padding top/bottom | `var(--spacing-padding-md)` 12 | same |
| Row | min-height | `var(--size-control-md)` 44 | — |
| Row | gap | `var(--spacing-gap-md)` 12 | `var(--spacing-gap-2xs)` 2 |
| Label | style · colour | `.ps-t-body-md`, `var(--content-secondary)` | `.ps-t-caption-sm`, `var(--content-tertiary)` |
| Value group | gap value → info | `var(--spacing-gap-xs)` 4 | same |
| Value | style | `.ps-t-body-md-strong` | same |
| Info icon | Help circle 16 × 16, `var(--content-tertiary)` | | |
| Divider | height `var(--stroke-width-default)`, `var(--border-subtle)` | | |

| Tone | Value colour |
|---|---|
| Default | `var(--content-primary)` |
| Positive | `var(--content-positive-strong)` |
| Negative | `var(--content-negative)` |

## States

| # | Card | Props |
|---|---|---|
| 0 | Inline — order details | `label:'Loan date', value:'July 5, 2026', divider` |
| 1 | Inline — order details | `label:'Amount received', value:'₱9,500.00', divider` |
| 2 | Inline — order details | `tone:'positive', label:'Coupon discount', value:'−₱200.00', divider` |
| 3 | Inline — order details | `tone:'negative', label:'Penalty', value:'₱50.00', onInfo` |
| 4 | Stacked — company facts | `layout:'stacked', label:'SEC registration number', value:'2020100002616-03', divider` |
| 5 | Stacked — company facts | `layout:'stacked', label:'Certificate of authority', value:'No. 3187'` |
Cards: `var(--surface-default)`, radius `var(--radius-card)` 24, padding `var(--spacing-padding-lg)` 16 / `var(--spacing-padding-xs)` 4, width 375.

## Phase 1 · legacy geometry (2026-11-19)


New variants Layout=Detail (36, divider) and Layout=Detail end (20) = legacy Detail list element 5635:7613 (5635:7612, 5635:7614).
