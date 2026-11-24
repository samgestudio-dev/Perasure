# TopBar

Figma: component set `11036:1355` (05 · Structure `10982:20`) · 10 variants · showcase `11036:1356`
Building blocks: `.GlassButton` `11036:1186` (Icon · Back · Pill), `.BrandMark` `11036:1187` (logo tile + wordmark).
The page header. Replaces legacy Header Action Container and Top nav btn (demo `PS.TopBar` + `PS.Glass` / `PS.Back` / `PS.Close` / `PS.Brand`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Type | VARIANT | Back+Title · Back+Title+Action · Brand · Pill · Search | Back+Title | `left` / `title` / `right` content (demo props) |
| Style | VARIANT | Solid · Clear | Solid | `solid` (secondary pages) — Clear = tab pages, veil on scroll |
| Title | TEXT | | "Credit limit profile" | `title` |
| exposed .GlassButton | Icon swap · Label | share, gift, help, close… | | `right` buttons, pill text |

## Parts and tokens

Root: vertical, width **360**, height **116**: Status bar area **40** (system, empty) + Row. Solid fill `var(--surface-page)`; Clear: none
(the demo's `--gradient-top-nav-filled` veil comes in as content scrolls under it — no Figma variable for the ambient veil).

| Part | Property | Token |
|---|---|---|
| Row | padding top · sides · bottom | `var(--spacing-padding-lg)` 16 · 16 · `var(--spacing-padding-xl)` 20; content 40 tall; space between |
| Left / Right | gap | `var(--spacing-gap-sm)` 8 |
| Title | `.ps-t-label-md`, `var(--content-primary)`, centred, **232** wide (64 from each side), one line with … | |
| .GlassButton | 40 tall; Icon / Back **40 × 40** (icon 18, `var(--content-primary)`; Back = chevron left); Pill padding `var(--spacing-padding-md)` 12, `.ps-t-label-md` | |
| .GlassButton | fill `var(--surface-glass)`, rim `var(--surface-default)` `var(--stroke-width-default)` inside, radius `var(--radius-full)`, effect Blur/Glass | |
| .BrandMark | tile **28 × 28** `var(--bg-brand)` radius `var(--radius-xs)` + logo mark (art) · gap `var(--spacing-gap-sm)` · "PeraSure" `.ps-t-title-xs` `var(--content-primary)` | |
| Search (Type=Search) | Search component (see Search.md) filling the row + close .GlassButton; row grows to 44 (bar 120 tall) | |

## States

| # | Props |
|---|---|
| 0 | `Back+Title`, solid, `title:'Loan details'` |
| 1 | `Back+Title+Action`, solid, `title:'Credit limit profile'`, right: share |
| 2 | `Brand`, clear — logo + gift + help |
| 3 | `Pill`, clear — pill "Permissions we need" |
| 4 | `Search`, solid — Search + close |

## Phase 1 · legacy geometry (2026-11-19)

Brand right buttons = Inbox + Headset (legacy Primary 3416:1149); screens hide Inbox where legacy has only the headset. Legacy header variants map: Title → Pill, Back → Back+Title (title hidden), Primary → Brand, Secondary → Back+Title+Action (action hidden when the legacy Share is hidden).

New Type=Pill+Actions (Solid / Clear): the title pill with the right buttons — legacy Primary header with a page title ("Payment", 6220:13381).
