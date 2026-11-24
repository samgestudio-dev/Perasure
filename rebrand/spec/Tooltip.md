# Tooltip

Figma: component set `10991:475` (02 · Feedback `10982:17`) · 18 variants · showcase `10991:525`
Dark explainer bubble (decision 6) — never white. Opens from a help mark / InfoButton; closes on tap outside or ×.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Type | VARIANT | Simple · Rich | Simple | `type: 'simple' \| 'rich'` (rich = title + text) |
| Arrow | VARIANT | Top-start · Top · Top-end · Bottom-start · Bottom · Bottom-end · Left · Right · None | Top-start | `arrow` (the edge the pointer sits on; demo places it from `anchor`) |
| Text | TEXT | | "Short help text, one or two lines." | `text` |
| Title | TEXT | (Rich only) | "Title" | `title` |
| Leading icon | BOOLEAN | | false | shown when `icon` is set |
| Icon | INSTANCE_SWAP | preferred: Info circle, Help circle, Alert circle, Copy, shield | Icon / Info circle | `icon` |
| Close | BOOLEAN | | false | `onClose` shows the × |

## Parts and tokens

Layout: Top* / Bottom* / None = vertical [Arrow row] + Bubble; Left / Right = horizontal. Bubble width **250** fixed, height hugs.

| Part | Property | Token |
|---|---|---|
| root | shadow | `var(--elevation-3)` (Elevation/3; today `--elevation-focus`) |
| Bubble | fill | `var(--surface-inverse)` [Surface/Inverse] |
| Bubble | padding top/bottom | Simple `var(--spacing-padding-md)` 12 · Rich `var(--spacing-padding-lg)` 16 |
| Bubble | padding left/right | `var(--spacing-padding-lg)` 16 |
| Bubble | gap (icon · text · ×) | `var(--spacing-gap-md)` 12 |
| Bubble | radius | `var(--radius-tooltip)` 12 |
| Text | gap Title → Text | `var(--spacing-gap-xs)` 4 |
| Title | text style / colour | `.ps-t-label-md`, `var(--content-inverse)` |
| Text | text style / colour | `.ps-t-body-md`, `var(--content-inverse)` |
| Icon | 20 × 20, `var(--content-accent)` | |
| Close | Icon / Close-thin 16 × 16, `var(--content-placeholder)` | |
| Arrow row | padding left/right (start / end inset) | `var(--spacing-padding-lg)` 16, top/bottom `var(--spacing-padding-none)` |
| Arrow | triangle 12 × 6 (Left / Right 6 × 12), `var(--surface-inverse)` | |

## States

| # | Group | Props |
|---|---|---|
| 0 | Simple | `type:'simple', arrow:'top', text:'Pay on or before the due date to avoid a late fee.'` |
| 1 | Simple | `type:'simple', arrow:'bottom-start', text:'Your limit grows as you repay on time.'` |
| 2 | Rich | `type:'rich', arrow:'top-end', title:'What is the service fee?', text:'A one-time fee taken from the amount you receive. It is shown before you confirm.', close` |
| 3 | With icon | `type:'simple', arrow:'left', icon:'copy', text:'Tap to copy your reference number.', close` |

Motion (demo, existing `PS.Tooltip`): fade + scale 0.96 → 1 on ENTER, exit faster (LEAVE).

## 2026-11-20 · BRIEF 21 · Tone
New variant property **Tone** = `Dark` (default, current look, on light backgrounds) · `Light` (when the tooltip points at something on a navy
surface: hub card info icon, home credit card, StateCard, the "Valid date" frames). Set: 36 variants (Type × Arrow × Tone).

| Part | Tone=Dark | Tone=Light |
|---|---|---|
| Bubble + arrow | `var(--surface-inverse)` | `var(--surface-default)` |
| Shadow | Elevation/3 | Elevation/3 |
| Title / body | `var(--content-inverse)` | `var(--content-primary)` |
| Leading icon | `var(--content-inverse)` (same as text; it was near-black) | `var(--content-primary)` |
| Close icon | Palette/Alpha/White/60 (muted inverse) | `var(--content-tertiary)` |

React: `tone: 'dark' | 'light'` (default `'dark'`). Screens on Tone=Light: Home/Valid Date `11134:13704`, Account/Credit Limit Hub/Valid Date `11159:11801`.

## 2026-11-20 · BRIEF 35 · Tone=Light is glass
Tone=Light bubble + arrow: `var(--surface-glass)` (Surface/Glass/Default, white 80 %) with the Blur/Glass background blur (same as glass
buttons and the tab bar), Elevation/3 on the tooltip. Text and leading icon stay `var(--content-primary)`, close `var(--content-tertiary)`.
Tone=Dark unchanged. Screens 11134:13704, 11159:11801 inherit it.
