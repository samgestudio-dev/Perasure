# Slider

Figma: component set `11063:2368` (03 · Inputs `10982:18`) · 8 variants · showcase `11063:2369`
The amount slider. Used inside AmountCard (demo `PS.Slider`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Value | VARIANT | Min · Mid · High · Max | — | `value` (Figma shows where the knob rests: 0 / 50 / 90 / 100 % of `min…max`) |
| Boost | VARIANT | Off · On | Off | `boost` (a coupon raised the max) |
| Min | TEXT | | "₱500" | `min` (formatted `PS.money(min, 0)`) |
| Max | TEXT | | "₱45,000" | `max` |
| — | | | | `step`, `onChange(v)` while dragging, `onCommit(v)` on release, `label` (aria) |

## Parts and tokens

Slider: vertical, width 311 (fills its card), gap `var(--spacing-gap-2xs)`.

| Part | Token |
|---|---|
| Bar | 25 tall; the track sits 6 from the bottom |
| Track | 8 tall, full width, `var(--surface-sunken)`, radius `var(--radius-full)` |
| Fill | 8 tall, from the left to the knob, `var(--content-brand-subtle)`, radius `var(--radius-full)` |
| Knob | 18 circle, centred on the value (half of it past the ends at Min / Max), `var(--content-brand-subtle)`, ring `var(--surface-default)` `var(--stroke-width-focus)` inside, `var(--elevation-2)` |
| Ends | row, space-between: Min / Max `.ps-t-label-sm`, `var(--content-placeholder)` |
| Boost=On | Max in `var(--content-positive-strong)` with the coupon mark 14 (`coupon-tag`) before it, gap `var(--spacing-gap-2xs)` |

Fill and knob rail scale with the slider width in Figma (constraints Scale); the knob stays round.

## States

| # | Props |
|---|---|
| 0 | `value:500, min:500, max:45000` |
| 1 | `value:22750, min:500, max:45000` |
| 2 | `value:40500, min:500, max:45000` |
| 3 | `value:45000, min:500, max:45000` |
| 4 | `value:500, min:500, max:50000, boost:true` |
| 5 | `value:25250, min:500, max:50000, boost:true` |
| 6 | `value:45050, min:500, max:50000, boost:true` |
| 7 | `value:50000, min:500, max:50000, boost:true` |

## Phase 1 · legacy geometry (2026-11-19)

Matches the legacy slider inside 10926:29643 (track 8 at 11, knob 18 at 6); ends Label/sm 16 tall vs legacy 15 (Hanken). 2026-11-20: height 40 → **42** (legacy slider container 25 + 2 + 15), so AmountCard is 246 like legacy.
