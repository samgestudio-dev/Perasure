# Segmented

Figma: component set `11011:646` (03 · Inputs `10982:18`) · 6 variants · showcase `11011:718`
Building block `.Segment`: component set `11011:614` · 3 variants (hidden).
Switch between 2–3 equal views (E-Wallet | Online bank). Replaces legacy Tab Selector and Credit History tab. Owner reference style
(decision 2 amended): grey track, white thumb.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Items | VARIANT | 2 · 3 | 2 | `items: [{ id, label }]` (2 or 3) |
| Selected | VARIANT | 1 · 2 · 3 (≤ Items) | 1 | `value` (id of the selected item) |
| State | VARIANT | Default · Disabled (Items=2, Selected=1 only) | Default | `disabled` |
| (each segment, exposed) Label | TEXT | | "E-Wallet" | `items[i].label` |
| `.Segment` State | VARIANT | Default · Selected · Pressed | | per segment |

## Parts and tokens

Track: horizontal, width **343** fixed, min-height `var(--size-control-lg)` 48, padding `var(--spacing-padding-xs)` 4 all round, gap
`var(--spacing-gap-none)`, radius `var(--radius-xl)` 24, fill `var(--bg-neutral)` [Bg/Neutral/Default]. Segments share the width.
Disabled: the whole track at opacity `var(--opacity-disabled)` (40 %).

`.Segment`: min-height **40**, padding `var(--spacing-padding-md)` 12 / `var(--spacing-padding-sm)` 8, radius `var(--radius-lg)` 20, label
`.ps-t-label-md` centred, no shadow.

| Segment state | Fill | Label |
|---|---|---|
| Default | none | `var(--content-tertiary)` |
| Selected (thumb) | `var(--surface-default)` | `var(--content-primary)` |
| Pressed | none | `var(--content-secondary)` |

Labels must fit one line (3 items ≈ 112 px each): keep them short.

## States

| # | Props |
|---|---|
| 0 | `items:['E-Wallet','Online bank'], value: first` |
| 1 | `items:['E-Wallet','Online bank'], value: second` |
| 2 | `items:['Bank','E-Wallet','Counter'], value: second` |
| 3 | `items:['E-Wallet','Online bank'], value: first, disabled:true` |

Motion (demo, existing): the thumb glides on the Smooth spring (`layoutId`).

## Phase 1 · legacy geometry (2026-11-19)


328 × 40, padding 2, radius 16; segments 36, radius 14 (no v2 token for 14 → raw, Phase 2) — legacy Tab Selector in 5588:5243. Owner restyle colours kept.
