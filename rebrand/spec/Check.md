# Check

Figma: component set `10989:254` (01 · Actions `10982:16`) · 8 variants · showcase `10989:255`
The round selection mark (agreements, single-choice lists, option cards). Replaces legacy Check mar. Selected = navy (decision 2).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Off · On · Disabled · On-disabled | Off | `on` boolean + `off` (can't be picked) → On-disabled = on + off |
| Size | VARIANT | Medium · Small | Medium | `size: 'medium' \| 'small'` |

## Parts and tokens

Layout: fixed square, content centred. Medium **20 × 20** (`size-icon-sm`), Small **16 × 16** (`size-icon-xs`).

| Part | Property | Medium | Small |
|---|---|---|---|
| root | radius | `var(--radius-full)` | same |
| root | ring | `var(--stroke-width-strong)` 2, inside | `var(--stroke-width-medium)` 1.5, inside |
| Check mark | tick | Icon / Check 12 × 12, `var(--content-inverse)` | 10 × 10 |

| State | Fill | Ring | Tick |
|---|---|---|---|
| Off | `var(--surface-default)` | `var(--border-control)` [Border/Control] (3.6:1) | hidden |
| On | `var(--bg-selected)` [Bg/Selected] | `var(--border-selected)` [Border/Selected/Default] | shown |
| Disabled | `var(--surface-default)` | `var(--border-subtle)` | hidden |
| On-disabled | `var(--bg-neutral-strong)` [Bg/Neutral/Strong] | `var(--bg-neutral-strong)` | shown |

The mark is not a tap target: the row or card around it is (Android: ≥ 48 dp; Phase 1 keeps the legacy row heights).

## States

| # | Group | Props |
|---|---|---|
| 0 | Medium | `size:'medium'` (off) |
| 1 | Medium | `size:'medium', on:true` |
| 2 | Medium | `size:'medium', off:true` |
| 3 | Medium | `size:'medium', on:true, off:true` |
| 4 | Small | `size:'small'` |
| 5 | Small | `size:'small', on:true` |
| 6 | Small | `size:'small', off:true` |
| 7 | Small | `size:'small', on:true, off:true` |
| 8 | In an agreement row | `size:'medium', on:true` + text "I have read and agree to the Loan Agreement" (`.ps-t-body-md`, `var(--content-secondary)`), row min-height 44, gap `--spacing-gap-md` 12 |
