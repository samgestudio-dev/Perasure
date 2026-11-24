# TextLink

Figma: component set `11006:366` (01 · Actions `10982:16`) · 6 variants · showcase `10988:134`
(Rebuilt 2026-11-19 on tokens v2; the earlier set `10988:133` was deleted after its instances were moved.)
Rule: a link is a colour (`--content-link*`) + underline on a normal style, never a text style of its own.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Tone | VARIANT | Default · Inverse | Default | `tone: 'default' \| 'inverse'` (inverse = on navy) |
| State | VARIANT | Default · Pressed · Disabled | Default | `state` |
| Label | TEXT | | "Link text" | `label` (children) |
| Trailing icon | BOOLEAN | | false | shown when `icon` is set |
| Icon | INSTANCE_SWAP | preferred: Chevron right, Link, Help circle | Icon / Chevron right | `icon` |

## Parts and tokens

Layout: horizontal auto layout, hugs; label wrap 21 + padding 12 + 12 = **45 px** tall (tap target).

| Part | Property | Token |
|---|---|---|
| root | padding top/bottom | `var(--spacing-padding-md)` 12 |
| root | padding left/right | `var(--spacing-padding-sm)` 8 |
| root | gap | `var(--spacing-gap-xs)` 4 |
| Label wrap | vertical, gap `var(--spacing-gap-none)`: Label over Underline | |
| Label | text style | `.ps-t-label-md` (Label/md 14/20, 600) |
| Underline | 1 px line under the text box, full label width, height `var(--stroke-width-default)`, colour = label colour (demo: `text-decoration: underline`, `text-underline-offset` ≈ 4 px) | |
| Icon | size / colour | 16 × 16, colour = label colour |

| Tone · State | Label, underline and icon colour |
|---|---|
| Default · Default | `var(--content-link)` [Content/Link/Default] (green-700, ⏳ green-text decision) |
| Default · Pressed | `var(--content-link-pressed)` [Content/Link/Pressed] |
| Default · Disabled | `var(--content-disabled)` [Content/Disabled] |
| Inverse · Default | `var(--content-accent)` [Content/Accent] |
| Inverse · Pressed | `var(--content-accent-pressed)` [Content/Accent-pressed] |
| Inverse · Disabled | `var(--content-disabled)` |

## States

| # | Group | Props |
|---|---|---|
| 0 | On light | `tone:'default', state:'default', label:'No longer have access to old number?'` |
| 1 | On light | `tone:'default', state:'pressed', label:'See all 6'` |
| 2 | On light | `tone:'default', state:'disabled', label:'See all 6'` |
| 3 | On navy (row on `var(--surface-brand)`, padding 16 / 12, radius `--radius-sm`) | `tone:'inverse', state:'default', label:'View details', icon:'chevron-right'` |
| 4 | On navy | `tone:'inverse', state:'pressed', label:'View details'` |

## Phase 1 · legacy geometry (2026-11-19)

Padding 0 → 21 tall (legacy links are plain 20 px underlined text, e.g. Login 3269:329). Underlined legacy text becomes a TextLink instance (Tone=Inverse on light-on-dark).
