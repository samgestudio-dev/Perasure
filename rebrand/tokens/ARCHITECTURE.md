# PeraSure tokens v2 — architecture (proposal for the owner)

Status: **proposal, 2026-11-19.** Nothing is built from it until the owner approves. Once approved, `rebrand/tokens/` gets the
machine-readable source (DTCG JSON), the generated CSS, the old → new rename map, the legacy alias file and a codemod, and Figma gets
the new variable collections.

## 1. What we learned (research summary)

| Source | What we take |
|---|---|
| **Google Material 3** | Three tiers that only alias downward (reference → system → component). Every fill role has an **"on-" pair** for the text and icons on it. Names are theme-agnostic, so dark mode only swaps values. State layers: pressed 0.10, disabled content 0.38 / container 0.12. Typescale = role × size (display / headline / title / body / label × lg / md / sm). Shape and elevation as small scales. |
| **Wise (Neptune)** — the richest public fintech system | Two published tiers, base → semantic, **role-first names**: `content-*`, `background-*`, `border-*`, `interactive-*`, `sentiment-*`, then `-hover/-active`. Brand colour split into interactive roles, each with an on-colour. **Status (sentiment) colours fenced off** for alerts only. Few surfaces. Semantic spacing (`screen-mobile`, `between-sections`). Money has its own type styles. Their own navy → green rebrand **kept the names and changed the values**, with old names kept as deprecated aliases. |
| **Atlassian, Primer, Polaris, Carbon, Uber Base, Spectrum** | Grammar `property · role · emphasis · state` (Atlassian `color.background.brand.bold.pressed`). Emphasis words `subtle / default / bold`; states `pressed / disabled / selected / focused` (no hover on mobile). Surfaces as their own family (`surface`, `raised`, `sunken`, `overlay`). Components never use primitives. |
| **How they migrated live apps** | All of them: a machine-readable **rename map** (old → new, or null = removed, with a "split" flag), **old names kept as aliases** pointing at the new tokens so the app keeps working on day one, a **codemod / lint autofix** driven by the map, comments on the few ambiguous cases, then the aliases are deleted in a planned release. Polaris warns: never reuse an old name for a new meaning. |
| **CashSaya** (the owner's other app) | Already uses the Uber Base grammar: `content-*`, `bg-*`, `border-*`. Using the same grammar in PeraSure lets designs, skills and code move between the two products. |

## 2. Principles

1. **Three tiers, aliasing only downward:** Primitive (raw values, hidden from designers) → Semantic (roles; what screens use) → Component
   (a small set of per-component values). Screens and components never use primitives.
2. **Role-first names, one grammar:** `property-role-emphasis-state`. Emphasis: `subtle · (default) · strong`. States: `pressed ·
   disabled · selected · focused`.
3. **Every fill role has an on-colour** for the text and icons on it (`bg-action` ↔ `content-on-action`).
4. **Theme-agnostic names.** Dark mode later = a second mode with the same names.
5. **Status colours (positive / negative) only mean status.** The green **action** colour and the green **positive** colour are separate
   tokens even where today's values match.
6. **Cheap for the live app:** new colour names never reuse an old name (no collisions); the good parts of the old system (spacing,
   radius, text style names) keep their names and change only values; everything renamed ships with an alias and a codemod.

## 3. Naming

| | Figma variable | CSS custom property |
|---|---|---|
| Colour (semantic) | `Content/Primary`, `Bg/Action/Pressed`, `Border/Selected` | `--content-primary`, `--bg-action-pressed`, `--border-selected` |
| Colour (primitive) | `Palette/Navy/900` (hidden) | `--palette-navy-900` |
| Component | `Button/Primary/Bg/Pressed`, `Tag/Positive/Text` | `--button-primary-bg-pressed`, `--tag-positive-text` |
| Spacing / radius / size / stroke | `Spacing/Gap/sm`, `Radius/full`, `Size/Control/lg`, `Stroke/Width/Default` | `--spacing-gap-sm`, `--radius-full`, `--size-control-lg`, `--stroke-width-default` |
| Typography | text styles `Body/md`, `Amount/lg` + variables `Font/…` | `.ps-t-body-md`, `--body-md-font-size`, `--font-family-body` |
| Effects / motion | effect styles `Elevation/Raised`; variables `Motion/Duration/fast` | `--elevation-raised`, `--motion-duration-fast` |

## 4. Colour — semantic tokens (light / Rebrand values)

Values: navy 900 `#000128`, 950 `#00011A`, 800 `#0A1A4A`, 600 `#304C8C`; green 500 `#5CD680` (logo), 700 `#2B8448`; Ink `#141E24`
(neutral-900); Mist `#F0F5F4` (ambient-100); Surface `#F7FAF9` (ambient-50). ⏳ = waits for the "green text on white" decision.

### Content — text and icons (one family; icons use the same tokens)

| Token | Value | Use | Replaces (old) |
|---|---|---|---|
| `content-primary` | Ink #141E24 | Body text, titles, icons | text-primary, icon-primary |
| `content-secondary` | neutral-700 #3C4850 | Supporting text | text-secondary, icon-secondary |
| `content-tertiary` | Mute #6A757D | Captions, meta | text-tertiary, icon-tertiary |
| `content-placeholder` | neutral-400 #7D878E | Placeholders | text-placeholder, icon-placeholder |
| `content-disabled` | neutral-300 #97A0A6 | Disabled text/icons | text-disabled, icon-disabled, action-text-disabled |
| `content-inverse` | white | Text/icons on navy, Ink, photos | text-inverse, icon-inverse |
| `content-brand` | navy-900 | Large amounts, titles, brand icons | text-brand-default, icon-brand-default, action-text-brand |
| `content-brand-strong` | navy-950 | Pressed brand text | text-brand-heavy, icon-brand-heavy |
| `content-brand-subtle` | navy-800 | Softer brand text | text-brand-light, icon-brand-light |
| `content-link` | green-700 ⏳ | Links on light surfaces | text-link-default, action-text-link |
| `content-link-pressed` | green-800 | Pressed link | text-link-heavy |
| `content-accent` | green-500 | Green on navy: rate, one green word, links on navy, the leaf | text-positive-light, icon-positive-light, (new) brand-inverse, link-inverse |
| `content-positive` | green-700 ⏳ | Paid, verified, success text/icons | text-positive-default, icon-positive-default, action-text-positive, text-link-light |
| `content-positive-strong` | green-800 | | text-positive-heavy, icon-positive-heavy |
| `content-negative` | red-600 | Errors, overdue | text-negative-default, icon-negative-default |
| `content-negative-strong` | red-700 | | text-negative-heavy, icon-negative-heavy |
| `content-negative-subtle` | red-500 | Decorative error icons | text-negative-light, icon-negative-light |
| `content-on-action` | navy-900 | Text on the green button / green fills | action-text-default |

### Surface — containers and layers

| Token | Value | Use | Replaces |
|---|---|---|---|
| `surface-page` | Mist #F0F5F4 | App background (default page) | surface-page-default |
| `surface-page-subtle` | Surface #F7FAF9 | Lighter page | surface-page-light |
| `surface-page-strong` | ambient-200 #EAF2F0 | Heavier page | surface-page-heavy |
| `surface-default` | white | Cards | surface-card-default |
| `surface-raised` | white | Elevated cards, sheets (with `elevation-raised`) | surface-elevated-default |
| `surface-sunken` | Mist | Inset areas inside cards | surface-inset-default |
| `surface-muted` | neutral-100 #E0E3E5 | Muted card | surface-card-muted |
| `surface-glass` | white 80 % | Glass bars and buttons | surface-elevated-glass |
| `surface-glass-subtle` | white 60 % | Lighter glass | surface-elevated-glass-blue |
| `surface-brand` | navy-900 | Amount / credit card, navy headers | surface-card-brand |
| `surface-brand-subtle` | Mist | Light brand area (no light navy) | surface-card-brand-subtle |
| `surface-inverse` | Ink #141E24 | Tooltips, toasts (dark, owner) | **new** |
| `surface-device-navy` | navy-800 | Brand device (sprout) on navy | (new 2026-11-19) |
| `surface-device-mist` | ambient-300 #DFEEE5 | Brand device on Mist | (new 2026-11-19) |

### Bg — fills for controls, states and badges

| Token | Value | Use | Replaces |
|---|---|---|---|
| `bg-action` | green-500 | Primary button, the one action | action-bg-primary-default |
| `bg-action-pressed` | green-600 | | action-bg-primary-pressed |
| `bg-action-subtle` | green-100 | Tonal action, chip selected-soft | action-bg-primary-subtle |
| `bg-action-subtle-pressed` | green-200 | | action-bg-primary-subtle-pressed |
| `bg-disabled` | neutral-100 | Any disabled fill | action-bg-primary-disabled, surface-icon-inverse-disabled |
| `bg-selected` | navy-900 | Toggle on, radio on, segmented thumb (decision 2) | **new** |
| `bg-brand` | navy-900 | Navy badges, icon circles | surface-icon-brand-default |
| `bg-positive` | green-500 | Success badge / icon circle | action-bg-positive-default, surface-card-positive, surface-icon-positive-default |
| `bg-positive-pressed` | green-600 | | action-bg-positive-pressed |
| `bg-positive-subtle` | green-100 | Success banner, paid tag | action-bg-positive-subtle, surface-card-positive-subtle* |
| `bg-positive-subtle-pressed` | green-200 | | action-bg-positive-subtle-pressed |
| `bg-positive-disabled` | green-200 | | action-bg-positive-disabled, surface-icon-positive-disabled |
| `bg-negative` | red-600 | Error badge / icon circle | surface-card-negative, surface-icon-negative-default |
| `bg-negative-subtle` | red-50 | Error banner, overdue tag | surface-card-negative-subtle |
| `bg-negative-disabled` | red-300 | | surface-icon-negative-disabled |
| `bg-neutral` | neutral-100 | Neutral tag, track | (several primitive uses) |
| `bg-neutral-subtle` | neutral-50 | Neutral icon circle | surface-icon-neutral-default |
| `bg-inverse` | white | White pill on dark | action-bg-inverse, surface-icon-inverse-default |
| `bg-tint-minimum` / `-subtle` / `-default` / `-strong` | dark tint 6 / 20 / 40 / 60 % | Overlays on images | alpha-bg-minimum / subtle / default / emphasis |
| `bg-tint-navy-subtle` / `-default` | navy 6 / 20 % | Navy tint | alpha-cold-bg-subtle / default |

\* `surface-card-positive-subtle` was green-50; it merges into green-100 — one of the few visible changes, owner to confirm.

### Border

| Token | Value | Use | Replaces |
|---|---|---|---|
| `border-default` | neutral-200 | Inputs, cards that need a line | stroke-default |
| `border-subtle` | neutral-100 | Dividers, quiet lines | stroke-subtle, stroke-divider, action-stroke-default |
| `border-strong` | neutral-300 | Emphasised line | stroke-strong |
| `border-filled` | neutral-150 | Filled input | action-stroke-filled, stroke-brand-subtle |
| `border-selected` | navy-900 | Selected card / radio ring (decision 2) | action-stroke-active, stroke-brand-default |
| `border-selected-subtle` | neutral-300 | | action-stroke-active-subtle |
| `border-brand-strong` | navy-950 | | stroke-brand-strong |
| `border-focused` | navy-900 | Focus ring, 2 px | **new** |
| `border-positive` / `-subtle` / `-strong` | green-500 / 200 / 700 | | stroke-positive-default / subtle / strong |
| `border-negative` / `-subtle` / `-strong` | red-500 / 200 / 600 | | stroke-negative-default / subtle / strong |

### Overlay, shadow colour, gradient

| Token | Value | Replaces |
|---|---|---|
| `overlay-scrim` | black 20 % | overlay-scrim-default |
| `overlay-shade` | navy-950 | (new 2026-11-19) |
| `shadow-color-raised-1` / `-2`, `shadow-color-overlay-1` / `-2`, `shadow-color-focus-1` / `-2`, `shadow-color-backdrop` | navy alpha (unchanged values) | shadow-default-1/2, shadow-subtle-1/2, shadow-focus-1/2, shadow-backdrop |
| `gradient-grey-0…80`, `gradient-white-0…80`, `gradient-ambient-0…80` | unchanged | gradient-default-*, gradient-subtle-*, gradient-ambient-* |

**Removed from the semantic tier:** the scale re-exports `brand-50…950`, `positive-*`, `negative-*`, `neutral-*` (62 tokens — screens
must use roles; code that used them maps to a role or, where no role fits, to `--palette-*` with a lint warning), `warning-*`,
`marketing-*` (owner: pink/yellow removed), `surface-icon-*` (merged into `bg-*`), `icon-*` (merged into `content-*`).

## 5. Colour — primitives (hidden in Figma, `--palette-*` in CSS)

`navy` 600–950 · `green` 50–950 (500 = logo) · `neutral` 0–950 (unchanged) · `ambient` 50–300 · `red` 50–950 (unchanged) ·
`alpha-white / black / navy / grey / green` (unchanged values). **Removed:** blue, pink, yellow, alpha-blue.

## 6. Typography — one typeface (owner)

Hanken Grotesk for everything, its own ₱. Text style names stay (they are already role × size), values change:

| Style | Size / line | Weight | Notes |
|---|---|---|---|
| Display xl / lg / md / sm | 48/56 · 40/48 · 36/44 · 32/40 | 800 | headlines, hero amounts |
| Headline sm | 28/36 | 800 | |
| Title lg / md / sm | 24/32 · 20/28 · 18/24 | 700 | |
| Section-title md / sm / xs (+ `-light`) | 16/22 · 14/20 · 11/14 | 600 (light 500) | |
| Body lg / md (+ `-emphasis`) | 16/24 · 14/20 | 400 (emphasis 500) | |
| Label md / sm (+ `-light`) | 14/20 · 12/16 | 600 (light 500) | buttons use Label at 700 via the Button component |
| Caption sm / xs | 12/16 · 11/14 | 500 (Bible: captions 500) | was Inter Regular |
| Link | 14/20 | 600 | |
| Number xs … xxl → **Amount** xs … xxl | 16/20 … 48/1 | 800, tabular figures | renamed: amounts are a role (Wise); `Number/*` kept as aliases |

`--font-family-body`, `-label`, `-title`, `-display`, `-number` all point at Hanken Grotesk (code keeps working unchanged).
Removed: the Tokens Studio leftovers `font-weights-*`, `font-size-0…11`, `letter-spacing-0…6`, `paragraph-*`, `text-case-*`,
`text-decoration-*` (after checking usage; `font-size-14` etc. primitives stay).

## 7. Spacing, radius, size, stroke, opacity, elevation, motion

- **Spacing — names and values kept** (`spacing-gap-*`, `spacing-padding-*`, `spacing-section-*`, `spacing-page-*`, ~1,090 uses).
  The section scale keeps its own steps (section `xs` = 12 while gap `xs` = 4): changing those values under the same names would reuse
  an old name for a new meaning, which the migration research says never to do. Documented instead.
- **Radius — names kept** (`radius-xs 8 … xxl 32, full`). New semantic radii: `radius-control` (full), `radius-card` (xl 24),
  `radius-sheet` (xxl 32 top), `radius-tooltip` (xs 8).
- **Size — new:** `size-control-sm 36 / md 44 / lg 52`, `size-icon-xs 16 / sm 20 / md 24 / lg 32`, `size-touch-min 44`.
- **Stroke width — kept:** `stroke-width-default 1 / medium 1.5 / strong 2 / heavy 2.5`; new `stroke-width-focus 2`.
- **Opacity — new:** `opacity-disabled 0.4`, `opacity-pressed 0.10` (M3 state layer); `layer-opacity-*` kept.
- **Elevation:** effect styles become `Elevation/Raised` (was Shadow/Default), `Elevation/Overlay` (Shadow/Over), `Elevation/Focus`
  (Shadow/Focus); CSS `--elevation-raised / -overlay / -focus` with `--shadow-default / -over / -focus` kept as aliases.
- **Motion — new in Figma** (the code already has them in `PS.MT`): `motion-duration-instant 80 / fast 150 / base 240 / slow 360`,
  `motion-easing-standard cubic-bezier(0.2,0,0,1)`, `-enter (0,0,0,1)`, `-exit (0.3,0,1,1)`; springs documented as tokens in code
  (`smooth` 240/30/1, `menu` light bounce).
- **Blur — kept** (`blur-backdrop-bg` …).

## 8. Component tokens (small set)

`button-{primary|secondary|text|destructive|navy}-{bg|content|border}-{state}`, `button-height-{lg|sm}` · `chip-*` (selected = green)
· `segmented-*` (thumb = navy) · `tag-{brand|navy|neutral|positive|negative}-{bg|content|border}` (replaces `tag-color-*`) ·
`input-{bg|border|border-focused|border-error}` · `tooltip-{bg|content}` (inverse) · `toast-*` · `tabbar-*` · `sheet-*` ·
`amount-card-{bg|content|accent}`. Each aliases semantic tokens; written with the component specs.

## 9. Figma structure

- Three **new** collections with the clean names: **Primitive** (hidden from publishing, scopes empty), **Semantic**, **Component** —
  one mode **Light** (Dark can be added later without renaming anything). Every variable gets scopes and WEB code syntax.
- The three old collections are renamed **Legacy · Primitive / Semantic / Component** and frozen. Legacy pages keep working on them;
  the Rebrand mode added to them today becomes unnecessary (can be removed later).
- Text styles and effect styles are updated in place (renames keep every binding): Hanken Grotesk everywhere, Amount styles,
  Elevation names.
- The 7 rebrand components already built get rebound to the new variables.

## 10. Developer migration (phi_h5_025) — low cost by design

| Phase | What developers do | Cost |
|---|---|---|
| 1 · Drop-in | Add `tokens.css` (new) and `legacy-aliases.css` (every old name → `var(--new)`). Nothing in the code changes; the app is already rebranded except hard-coded colours. | ~0.5 day |
| 2 · Hand fixes | The 221 hard-coded blues (212 are `var(--x, #hex)` fallbacks — harmless after phase 1, cleaned by the codemod) and any white text on primary buttons. List with file:line in `DEV-HANDOFF.md`. | 1–2 days |
| 3 · Codemod | `node migrate-tokens.mjs src/` rewrites `var(--old)` → `var(--new)` from `rename-map.json`; ambiguous cases get a `/* token-migrate: */` comment. Optional lint rule blocks old names. | ~0.5 day + review |
| 4 · Clean-up | Delete `legacy-aliases.css` in a planned release. | minutes |

Import script: their `scripts/import_figma_tokens.py` reads `Mode 1.json`; with the new collections it reads `Light.json` — one constant.

## 11. Decisions for the owner

1. CSS colour names without the `color-` prefix, in the CashSaya grammar (`--content-*`, `--surface-*`, `--bg-*`, `--border-*`).
2. Keep the names of spacing, radius and text styles (values change), so ~3,900 of the 5,366 token uses in the live app need nothing; only the ~1,480 colour uses are renamed (by alias + codemod).
3. New Figma collections with clean names; old ones frozen as "Legacy".
4. `surface-card-positive-subtle` merges into `bg-positive-subtle` (green-50 → green-100) — the only visible merge.
5. Still open: green text on white (⏳ tokens).

## 12. Coordinator decisions after approval (2026-11-19)

Raised by figma-lib while rebinding; decided by the coordinator (owner's rule: lanes ask the coordinator).

1. New pressed roles: `bg-brand-pressed` navy-800, `bg-negative-pressed` red-700, `content-accent-pressed` green-300 (semantic, not
   component-only, since cards and links need them too). `Bg/Brand` is now `Bg/Brand/Default` in Figma (CSS name unchanged).
2. `border-control` neutral-400 (3.6:1): unselected checkbox/radio rings, toggle track outline and input borders (controls need ≥3:1).
3. `size-control-lg` is **48** (the demo's button height), not 52; sm 36, md 44.
4. Tag text meets 4.5:1: content green-800 / red-700 / neutral-700 / navy-900.
5. Tags have three emphases per tone: Subtle (`tag-*-bg` + `tag-*-content`), Outline (`tag-*-border` + content), Strong
   (`tag-*-bg-strong` + `tag-*-content-strong`). Tones: Neutral, Accent (green: chosen / protected), Navy, Positive (paid / verified),
   Negative. In Figma the content tokens are `Tag/<Tone>/Content/Default|Strong`.
6. `radius-tooltip` is 12 (the tooltip as designed), not 8.

7. **Full 50–950 scales** (owner): `navy` 50–950 (light steps 50–500 are primitives only — no semantic token uses them, decision 3),
   `ambient` 50–950 (400–950 added in the same mist hue), `green`, `neutral`, `red` already full.
8. **Lean typography and effect styles** (owner approved `TYPE-AND-STYLES.md`): 19 text styles, 5 effect styles; merged old styles keep
   working through `legacy-aliases.css` (variables and `.ps-text-*` classes) and the codemod (`rename-map.json` → `classes`).
9. **Scrim** (owner, following the gradient scrims in the newest Figma screens, e.g. Loan Detail `10712:55367`, Rating Popover
   `9336:18322`): secondary pages sit under the app's **native nav bar**, which the web view cannot dim, so a flat scrim makes a hard
   dark band under it. The scrim is a vertical gradient in navy: `--overlay-scrim-top` (navy 0 %) → `--overlay-scrim-mid` (32 %) at
   28 % of the height → `--overlay-scrim-bottom` (56 %), composed as `--gradient-scrim`. It starts clear where it meets the native bar
   and is darkest behind the sheet (the old one peaked at 20 % black — too weak). No background blur (cheap on low-end Android; the
   `Blur/Scrim` effect style is dropped, 4 effect styles remain). `--overlay-scrim` (flat navy 40 %) stays for full-screen dialogs on
   tab pages only.
10. **Coupon gradient** (owner): the coupon tickets (Home "Coupons for your next loan" pair, the single coupon with its folder tab) keep
    the gradient they had, moved from the brand blue scale to the green scale with the same stops — component tokens
    `--coupon-gradient-top|upper|mid|bottom` (green 700 / 600 / 400 / 200) and composites `--gradient-coupon` (pair frame, 0 / 14.9 /
    59.6 / 100 %), `--gradient-coupon-panel` (single panel, 0 / 69.2 / 100 %), `--gradient-coupon-tab` (folder tab, bottom → top). The
    connector curve between tab and panel is flat `--coupon-gradient-upper`. The only gradient exception to decision 8.
