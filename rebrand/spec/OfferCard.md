# OfferCard

Figma: component `11066:2514` (06 · Product cards `10982:21`) · showcase `11066:2627`
A partner product offered when ours isn't available (home · Not approved, "More for you"). Replaces the legacy partner offer card (demo
`PS.OfferCard`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Label | TEXT | | "Max amount" | `label` |
| Value | TEXT | | "₱50,000" | `value` |
| exposed Tag | Label | | "Best match" | `tag` (none → no tag) |
| exposed KV | Label · Value | | "Max term" · "180 days" | `rows` [{ label, value }] |
| exposed Button | Label | | "Apply now" | `action`, `onClick` |
| (logo, swap the image) | | | LoadCash | `logo` (file in assets/logos), `name` (alt) |

## Parts and tokens

Card: vertical, width **343**, fill `var(--surface-default)`, radius `var(--radius-card)`, padding `var(--spacing-padding-lg)`, gap
`var(--spacing-gap-md)`.

| Part | Token |
|---|---|
| Head | row, space-between, centred: partner logo 24 tall (legacy artwork, unchanged) + Tag Medium Accent Subtle |
| Value | vertical, centred, gap `var(--spacing-gap-2xs)`: label `.ps-t-body-md` `var(--content-tertiary)` + value `.ps-t-amount-lg` `var(--content-brand)` |
| Divider | 1 px `var(--border-subtle)` |
| Rows | KV Inline, no divider |
| Button | Button Primary Large, fill width — the page's one green action (the state card above it has no Primary) |

## States

| # | Props |
|---|---|
| 0 | `logo:'loadcash', name:'LoadCash', tag:'Best match', label:'Max amount', value:'₱50,000', rows:[{label:'Max term', value:'180 days'}], action:'Apply now'` |

## Phase 1 · legacy geometry (2026-11-19)

Matches legacy 9447:27224: 328 × 235 (legacy 234), gap 16, Body gap 12, two-text row, Tag Small, Button Medium "Apply now", label "Max Amount".
