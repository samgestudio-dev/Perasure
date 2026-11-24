# Navigator

Figma: component set `11037:1403` (05 · Structure `10982:20`) · 3 variants · showcase `11037:1404`
Building block `.NavTab` `11037:1351` (Active · Inactive); tab icons `.Icon/Home` `11037:1327`, `.Icon/Payment` `11037:1334`, `.Icon/Account`
`11037:1342` (copied from the legacy Navigator, one flattened "Glyph" layer each).
The tab bar of the three main pages. Replaces legacy Navigator and Bottom nav btn (demo `PS.Navigator`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Active | VARIANT | Home · Payment · Account | Home | `value` |
| exposed .NavTab | Label · Icon swap | | | `tabs: [{ id, label, icon }]` |

## Parts and tokens

Root: vertical, width **360**, padding top `var(--spacing-section-md)`, sides `var(--spacing-padding-xl)` 20, bottom `var(--spacing-section-lg)`
(+ safe area in the demo). Fill: linear gradient top → bottom `var(--gradient-white-0)` 0 % · `var(--gradient-white-60)` 40 % ·
`var(--gradient-white-80)` 100 % (= `--gradient-bottom-primary-nav-filled`).

| Part | Property | Token |
|---|---|---|
| Bar | padding · gap | `var(--spacing-padding-xs)` 4 · `var(--spacing-gap-md)` 12 |
| Bar | fill · rim · radius · effect | `var(--surface-glass)` · `var(--surface-default)` 1 px inside · `var(--radius-full)` · Blur/Glass |
| .NavTab | vertical, centred, gap `var(--spacing-gap-2xs)` 2, padding top/bottom `var(--spacing-padding-xs)` 4, radius `var(--radius-full)`, fills the bar width / 3 | |
| Icon | **20 × 20** | |
| Label | `.ps-t-caption-xs` | |

| Tab | Fill | Icon + label |
|---|---|---|
| Active | `var(--bg-tint-minimum)` | `var(--content-brand)` |
| Inactive | none | `var(--content-primary)` |

## States

| # | Props |
|---|---|
| 0 | `value:'home'` |
| 1 | `value:'payment'` |
| 2 | `value:'account'` |

Motion (demo, existing): the active pill glides between tabs on the Smooth spring.

## Phase 1 · legacy geometry (2026-11-19)

98 tall as legacy 3152:1404: tabs 46 (fixed), bar 54 (padding 4, stroke out of layout), root padding 20 / 20 / 24.
