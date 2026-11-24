# Chip

Figma: component set `10989:185` (01 · Actions `10982:16`) · 8 variants · showcase `10989:186`
A choice the user picks from a row (term picker, amount presets, inbox filters). Replaces legacy term / Term pick / inbox filter tab /
Search city popover/tab. Two or three equal views use Segmented instead. (The demo's old summary "Chip" pill is now Tag · Outline.)

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Default · Selected · Pressed · Disabled | Default | `state` (app: `selected`, `disabled` booleans) |
| Size | VARIANT | Medium · Small | Medium | `size` |
| Label | TEXT | | "6 terms" | `label` (children) |

## Parts and tokens

Layout: horizontal auto layout, centred, hugs; `min-height` Medium **44** (= `size-control-md`) / Small **32**.

| Part | Property | Medium | Small |
|---|---|---|---|
| root | padding top/bottom | `var(--spacing-padding-md)` 12 | `var(--spacing-padding-sm)` 8 |
| root | padding left/right | `var(--spacing-padding-lg)` 16 | `var(--spacing-padding-md)` 12 |
| root | gap | `var(--spacing-gap-xs)` 4 | same |
| root | radius | `var(--radius-full)` | same |
| root | border | `var(--stroke-width-default)` 1, inside | same |
| Label | text style | `.ps-t-label-md` | `.ps-t-label-sm` |
| Check mark | size, shown only in Selected | 16 × 16 | 12 × 12 |

| State | Fill | Border | Label + check mark |
|---|---|---|---|
| Default | `var(--surface-default)` | `var(--border-default)` [Border/Default] | `var(--content-primary)` |
| Selected | `var(--bg-action)` [Bg/Action/Default] | `var(--bg-action)` (same as fill) | `var(--content-on-action)` |
| Pressed | `var(--surface-sunken)` | `var(--border-default)` | `var(--content-primary)` |
| Disabled | `var(--surface-default)` | `var(--border-subtle)` | `var(--content-disabled)` |

Selected = green + navy text + tick (colour is never the only cue). 8 px between chips (`--spacing-gap-sm`); Small chips sit in a ≥ 44 px row.

## States

| # | Group | Props |
|---|---|---|
| 0 | Term picker — Medium | `size:'medium', state:'default', label:'3 terms'` |
| 1 | Term picker — Medium | `size:'medium', state:'selected', label:'6 terms'` |
| 2 | Term picker — Medium | `size:'medium', state:'pressed', label:'9 terms'` |
| 3 | Term picker — Medium | `size:'medium', state:'disabled', label:'12 terms'` |
| 4 | Inbox filter — Small | `size:'small', state:'selected', label:'Unread (3)'` |
| 5 | Inbox filter — Small | `size:'small', state:'default', label:'All'` |
| 6 | Inbox filter — Small | `size:'small', state:'default', label:'Repayment'` |
| 7 | Inbox filter — Small | `size:'small', state:'disabled', label:'Promos'` |

## Phase 1 · legacy geometry (2026-11-19)

Radius 16 (`var(--radius-md)`), no check mark (legacy has none). Medium = padding 8 / 16, Title/xs (16), min 41 (legacy Term pick 8980:16877). Small = padding 8 / 12, Label/md, 36, stroke out of layout (legacy in-card term chip in 10926:29643). Chosen = green (decision 2).
