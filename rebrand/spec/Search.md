# Search

Figma: component set `11009:488` (03 · Inputs `10982:18`) · 3 variants · showcase `11009:655`
Replaces legacy Search Bar. The glass pill in sheet headers and list pages (next to the glass close button).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Default · Focus · Filled | Default | demo: derived (focus, value); gallery: `state` |
| Placeholder | TEXT | | "Search city or province" | `placeholder` |
| Value | TEXT | | "Quezon" | `value` |

## Parts and tokens

Horizontal, width **343** fixed (Fill next to a close button), items centred.

| Part | Property | Token |
|---|---|---|
| root | min-height | **40** (legacy Search Bar 3081:574) |
| root | padding left/right · top/bottom | `var(--spacing-padding-md)` 12 · `var(--spacing-padding-sm)` 8 |
| root | gap | `var(--spacing-gap-sm)` 8 |
| root | radius | `var(--radius-full)` |
| root | fill | `var(--surface-glass)` [Surface/Glass/Default] |
| root | rim | `var(--surface-default)` (white), `var(--stroke-width-default)` 1, inside |
| root | effect | Blur/Glass (backdrop blur + glass shadow) |
| Search icon | 20 × 20, `var(--content-secondary)` | |
| Placeholder (Default) | `.ps-t-body-md`, `var(--content-placeholder)` | |
| Value (Focus, Filled) | `.ps-t-body-md`, `var(--content-primary)` | |
| Caret (Focus) | 2 × 20, `var(--border-focused)` | |
| Clear (Focus, Filled) | Icon / Close 16 × 16, `var(--content-tertiary)` | |

## States

| # | Props |
|---|---|
| 0 | `state:'default'` |
| 1 | `state:'focus', value:'Que'` |
| 2 | `state:'filled', value:'Quezon City'` |

## Phase 1 · legacy geometry (2026-11-20)

Android only (owner, 2026-11-19): Phase 1 keeps the legacy sizes; 40 tall and 14/20 text as the legacy Search Bar (3081:574; bank search 5803:14326). The 44 / 16 px came from the iOS reasons; Android's ≥ 48 dp touch target is a Phase 2 note. Legacy "Focus" (typed value + clear) maps to State=Focus (was Default).
