# LineTabs

Figma: component set `11011:717` (03 · Inputs `10982:18`) · 5 variants · showcase `11011:739`
Building block `.LineTab`: component set `11011:659` · 3 variants (hidden).
Tabs with a navy underline for steps or sections in a sheet (address picker Region → Province → City; Upcoming | History).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Items | VARIANT | 2 · 3 | 2 | `items: [{ id, label, off }]` |
| Selected | VARIANT | 1 · 2 · 3 (≤ Items) | 1 | `value` |
| (each tab, exposed) Label | TEXT | | "Region" | `items[i].label` |
| `.LineTab` State | VARIANT | Default · Selected · Off | | per tab (`off`: can't be chosen yet) |

## Parts and tokens

LineTabs: horizontal, width **343** fixed, gap `var(--spacing-gap-none)`; tabs share the width. No track line.

`.LineTab`: vertical, centred; padding top `var(--spacing-padding-md)` 12, left/right `var(--spacing-padding-sm)` 8, bottom
`var(--spacing-padding-none)`; inner Label wrap (hugs the label) gap `var(--spacing-gap-sm)` 8 → Bar.

| Part | Property | Token |
|---|---|---|
| Label | `.ps-t-body-md-strong` | |
| Bar | height `var(--stroke-width-strong)` 2, width = label, radius `var(--radius-full)` | |

| Tab state | Label | Bar |
|---|---|---|
| Default | `var(--content-tertiary)` | none |
| Selected | `var(--content-brand)` | `var(--bg-selected)` |
| Off | `var(--content-disabled)` | none |

## States

| # | Props |
|---|---|
| 0 | `items:['Region','Province'(off),'City'(off)], value:'Region'` |
| 1 | `items:['Region','Province','City'(off)], value:'Province'` |
| 2 | `items:['Region','Province','City'], value:'City'` |
| 3 | `items:['Upcoming','History'], value:'Upcoming'` |

Motion (demo, existing): the bar glides on the Smooth spring; label colours change in 150 ms.
