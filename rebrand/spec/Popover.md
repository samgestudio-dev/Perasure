# Popover

Figma: component set `11039:1543` (05 · Structure `10982:20`) · 2 variants · showcase `11039:1544`
Building block `.PopoverOption` `11039:1488` (Default · Selected).
A small glass card that opens from the tap point. Replaces legacy Drop down lists, select overlay and Loan detail popover (demo `PS.Popover`).
~~No scrim~~ → **sits on Scrim Type=Gradient and casts Elevation/2** (BRIEF 19, 2026-11-20); tapping the scrim closes it.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Type | VARIANT | Menu · Content | Menu | Menu = `options` list; Content = custom children |
| Title | TEXT (Content) | | "Schedule 1" | content |
| exposed rows | `.PopoverOption` Label / State · KV Label / Value | | | `options`, `value` |

## Parts and tokens

Card: vertical, fill `var(--surface-glass)`, rim `var(--surface-default)` 1 px inside, radius `var(--radius-xl)` 24, effect Blur/Glass.

| Part | Menu | Content |
|---|---|---|
| width | **200** | **296** |
| padding | `var(--spacing-padding-sm)` 8 | `var(--spacing-padding-lg)` 16 / `var(--spacing-padding-md)` 12 |
| gap | `var(--spacing-gap-2xs)` 2 | `var(--spacing-gap-xs)` 4 |
| max height | 220 (longer lists scroll, thumb + bottom fade in the demo) | hugs |

`.PopoverOption`: **36** tall, padding `var(--spacing-padding-md)` 12 / `var(--spacing-padding-sm)` 8, radius `var(--radius-full)`, label
`.ps-t-body-md` `var(--content-primary)` (one line, …); Selected / pressed fill `var(--bg-tint-navy-subtle)`.

Content head: Title `.ps-t-label-md` + date `.ps-t-caption-sm` `var(--content-tertiary)` (left); amount `.ps-t-amount-xs` + "Total payment"
`.ps-t-caption-sm` tertiary (right). Rows: KV Inline (see KV.md).

Placement: 8 px under the anchor (above it when there is no room below), centred on the tap point, kept 8 px from the screen sides.

## States

| # | Caption | Props |
|---|---|---|
| 0 | Menu — opens under the tapped field (Field Stacked, Focus, "Region · Calabarzon") | `options:['NCR','Calabarzon','Central Luzon','Western Visayas'], value:'Calabarzon'` |
| 1 | Content — schedule details from a row's info mark | Schedule 1 · May 24, 2026 · ₱2,400.00 · Principal ₱2,000.00 · Interest ₱250.00 · Service fee ₱150.00 |

Motion (demo, existing): grows from the tap point (scale 0.5 / 0.22 → 1, blur → sharp) on the light-bounce spring; rows follow one after
another; folds back into the tap on exit.

## Phase 1 · legacy geometry (2026-11-19)

.PopoverOption = 44 tall with a 1 px bottom divider `var(--border-subtle)`, the last option without (legacy search city popover/list 5974:9438).

## 2026-11-20 · BRIEF 19
Card effects: background blur (from Blur/Glass) + `Elevation/2` drop shadows (the effect style is detached because Figma takes one style per
layer; values equal the tokens). Shown on Scrim Type=Gradient.
