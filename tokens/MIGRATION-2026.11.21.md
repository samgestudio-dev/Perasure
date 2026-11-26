# Token migration 2026.11.21: v2026.11.17 → v2026.11.21 (rebrand v3)

Source: the Figma file `kYyNV2MgxvH1w9bJ46A3yx` (rebrand copy), exported through `tools/sync-tokens.py`. The Legacy collections and styles are left out, and no `tokens/legacy/` file is written (owner, 2026-11-21).

**Update (owner, 2026-11-26):** the blue version is now legacy. `tokens/legacy/2026.11.17.css` (from `tools/legacy-tokens.py legacy-blue 2026.11.17`)
keeps every v2026.11.17 name and value that the rebrand removed or changed; the full blue repo is on branch `legacy/blue`.

## What changed

- **Colour scales** (Brand Bible UI Foundations, OKLCH):
  - Green is anchored at **500 = #5CD680**.
  - Smoothed steps: 600 #36A65B (3.1:1 on white), 700 #298648 (4.6:1), 800 #1D6334.
  - **Navy** is anchored at 900 = #000128 and **replaces every neutral grey**; the neutral scale is removed.
  - **Mist** is its own scale (100 = #F0F5F4; formerly Ambient).
  - **Base** has White and Black.
  - Orange and red are unchanged.
- **Alpha:**
  - Added: navy 60, white 10, mist 0–80, navy-100 0–80 (replaces the grey alpha).
  - Removed: black, deep green, periwinkle, blue.
- **Semantic layer, Primer-style:** `fg/*`, `bg/*` and `border/*` by role (accent, brand, success, danger, attention, selected, focus), emphasis (subtle < muted < default < emphasis < strong) and state (`-pressed`). On-colours: `fg/on-emphasis`, `fg/on-accent`, `border/on-emphasis`.
- **Component tokens:**
  - `tag/{neutral,accent,brand,success,danger}/…`, with new `tag/*/bg-muted` (step 200).
  - `coupon/gradient-*`.
  - `control/checked-bg`.
- **Styles:**
  - Effects: Elevation 1–3 (layers matched to legacy), Elevation/Knob, Blur/Glass.
  - Gradients: Glass-stroke, Nav-top, Nav-bottom, Nav-bottom-mist, Scrim, Brand-card.
  - Text styles: 35, at legacy weights.
- **Number tokens:** Stroke/Width/Focus, Size/*, Opacity/* and Motion/* now alias primitives (new Duration/* and Easing/*).
- **Counts:** Primitive 165, Semantic 257, Component 39; styles 46 (text 35, effect 5, paint 6).

## How to read the table

- `old` is the CSS name in v2026.11.17; `new` is the CSS name now.
- A new name starting with `.ps-text-…` means the old per-property text variable has no direct replacement: use the class.
- `—` means no replacement: the scale was removed.
- `uses` is how many times the old name appears in the prototypes.
- Every `new` name was checked against `tokens/tokens.css`. The full list is also in `migration-2026.11.21.csv`.

## Text and icons (35)

| old | new | note | uses |
|---|---|---|---|
| `--color-icon-brand-default` | `--fg-accent` | semantic | 22 |
| `--color-icon-brand-heavy` | `--fg-accent-strong` | semantic | 0 |
| `--color-icon-brand-light` | `--fg-accent` | semantic | 2 |
| `--color-icon-disabled` | `--fg-disabled` | semantic | 2 |
| `--color-icon-inverse` | `--fg-on-emphasis` | semantic | 19 |
| `--color-icon-negative-default` | `--fg-danger` | semantic | 1 |
| `--color-icon-negative-heavy` | `--fg-danger-strong` | semantic | 0 |
| `--color-icon-negative-light` | `--fg-danger-muted` | semantic | 0 |
| `--color-icon-placeholder` | `--fg-placeholder` | semantic | 1 |
| `--color-icon-positive-default` | `--fg-success` | semantic | 1 |
| `--color-icon-positive-heavy` | `--fg-success-strong` | semantic | 0 |
| `--color-icon-positive-light` | `--fg-accent-on-brand` | semantic | 0 |
| `--color-icon-primary` | `--fg-default` | semantic | 10 |
| `--color-icon-secondary` | `--fg-muted` | semantic | 8 |
| `--color-icon-tertiary` | `--fg-subtle` | semantic | 10 |
| `--color-text-brand-default` | `--fg-accent` | semantic | 37 |
| `--color-text-brand-heavy` | `--fg-accent-strong` | semantic | 2 |
| `--color-text-brand-inverse` | `--fg-accent-on-brand` | semantic | 0 |
| `--color-text-brand-light` | `--fg-accent` | semantic | 12 |
| `--color-text-disabled` | `--fg-disabled` | semantic | 22 |
| `--color-text-inverse` | `--fg-on-emphasis` | semantic | 59 |
| `--color-text-link-default` | `--fg-link` | semantic | 7 |
| `--color-text-link-heavy` | `--fg-link-pressed` | semantic | 0 |
| `--color-text-link-inverse` | `--fg-accent-on-brand` | semantic | 0 |
| `--color-text-link-light` | `--fg-accent` | semantic | 0 |
| `--color-text-negative-default` | `--fg-danger` | semantic | 6 |
| `--color-text-negative-heavy` | `--fg-danger-strong` | semantic | 3 |
| `--color-text-negative-light` | `--fg-danger-muted` | semantic | 15 |
| `--color-text-placeholder` | `--fg-placeholder` | semantic | 39 |
| `--color-text-positive-default` | `--fg-success` | semantic | 2 |
| `--color-text-positive-heavy` | `--fg-success-strong` | semantic | 1 |
| `--color-text-positive-light` | `--fg-accent-on-brand` | semantic | 0 |
| `--color-text-primary` | `--fg-default` | semantic | 208 |
| `--color-text-secondary` | `--fg-muted` | semantic | 93 |
| `--color-text-tertiary` | `--fg-subtle` | semantic | 96 |

## Surfaces (27)

| old | new | note | uses |
|---|---|---|---|
| `--color-surface-card-brand` | `--bg-brand` | semantic | 4 |
| `--color-surface-card-brand-subtle` | `--bg-accent-subtle` | semantic | 5 |
| `--color-surface-card-default` | `--bg-default` | semantic | 134 |
| `--color-surface-card-muted` | `--bg-muted` | semantic | 3 |
| `--color-surface-card-negative` | `--bg-danger-emphasis` | semantic | 2 |
| `--color-surface-card-negative-subtle` | `--bg-danger-muted` | semantic | 2 |
| `--color-surface-card-positive` | `--bg-success-emphasis` | semantic | 2 |
| `--color-surface-card-positive-subtle` | `--bg-success-subtle` | semantic | 1 |
| `--color-surface-device-mist` | `--bg-tint` | semantic | 0 |
| `--color-surface-device-navy` | `--bg-brand-pressed` | semantic | 0 |
| `--color-surface-elevated-default` | `--bg-default` | semantic | 0 |
| `--color-surface-elevated-glass` | `--bg-glass` | semantic | 24 |
| `--color-surface-elevated-glass-blue` | `--bg-glass-subtle` | semantic | 0 |
| `--color-surface-icon-brand-default` | `--bg-brand` | semantic | 4 |
| `--color-surface-icon-brand-disabled` | `--bg-success-disabled` | semantic | 0 |
| `--color-surface-icon-inverse-default` | `--bg-default` | semantic | 1 |
| `--color-surface-icon-inverse-disabled` | `--bg-disabled` | semantic | 0 |
| `--color-surface-icon-negative-default` | `--bg-danger-emphasis` | semantic | 0 |
| `--color-surface-icon-negative-disabled` | `--bg-danger-disabled` | semantic | 0 |
| `--color-surface-icon-neutral-default` | `--bg-subtle` | semantic | 0 |
| `--color-surface-icon-neutral-disabled` | `--bg-neutral-emphasis` | semantic | 0 |
| `--color-surface-icon-positive-default` | `--bg-success-emphasis` | semantic | 2 |
| `--color-surface-icon-positive-disabled` | `--bg-success-disabled` | semantic | 0 |
| `--color-surface-inset-default` | `--bg-inset` | semantic | 28 |
| `--color-surface-page-default` | `--bg-page` | semantic | 73 |
| `--color-surface-page-heavy` | `--bg-page-strong` | semantic | 0 |
| `--color-surface-page-light` | `--bg-page-subtle` | semantic | 2 |

## Actions (20)

| old | new | note | uses |
|---|---|---|---|
| `--color-action-bg-inverse` | `--bg-default` | semantic | 13 |
| `--color-action-bg-positive-default` | `--bg-success-emphasis` | semantic | 3 |
| `--color-action-bg-positive-disabled` | `--bg-success-disabled` | semantic | 0 |
| `--color-action-bg-positive-pressed` | `--bg-success-emphasis-pressed` | semantic | 0 |
| `--color-action-bg-positive-subtle` | `--bg-success-muted` | semantic | 0 |
| `--color-action-bg-positive-subtle-pressed` | `--bg-success-muted-pressed` | semantic | 0 |
| `--color-action-bg-primary-default` | `--bg-accent-emphasis` | semantic | 64 |
| `--color-action-bg-primary-disabled` | `--bg-disabled` | semantic | 10 |
| `--color-action-bg-primary-pressed` | `--bg-accent-emphasis-pressed` | semantic | 8 |
| `--color-action-bg-primary-subtle` | `--bg-accent-muted` | semantic | 7 |
| `--color-action-bg-primary-subtle-pressed` | `--bg-accent-muted-pressed` | semantic | 0 |
| `--color-action-stroke-active` | `--border-selected` | semantic | 13 |
| `--color-action-stroke-active-subtle` | `--border-selected-muted` | semantic | 1 |
| `--color-action-stroke-default` | `--border-muted` | semantic | 7 |
| `--color-action-stroke-filled` | `--border-accent-subtle` | semantic | 1 |
| `--color-action-text-brand` | `--fg-accent` | semantic | 7 |
| `--color-action-text-default` | `--fg-on-accent` | semantic | 8 |
| `--color-action-text-disabled` | `--fg-disabled` | semantic | 7 |
| `--color-action-text-link` | `--fg-accent` | semantic | 3 |
| `--color-action-text-positive` | `--fg-success` | semantic | 1 |

## Borders (13)

| old | new | note | uses |
|---|---|---|---|
| `--color-stroke-brand-default` | `--border-selected` | semantic | 13 |
| `--color-stroke-brand-strong` | `--border-accent-emphasis` | semantic | 0 |
| `--color-stroke-brand-subtle` | `--border-accent-muted` | semantic | 5 |
| `--color-stroke-default` | `--border-default` | semantic | 11 |
| `--color-stroke-divider` | `--border-muted` | semantic | 6 |
| `--color-stroke-negative-default` | `--border-danger` | semantic | 2 |
| `--color-stroke-negative-strong` | `--border-danger-emphasis` | semantic | 0 |
| `--color-stroke-negative-subtle` | `--border-danger-muted` | semantic | 1 |
| `--color-stroke-positive-default` | `--border-success` | semantic | 1 |
| `--color-stroke-positive-strong` | `--border-success-emphasis` | semantic | 0 |
| `--color-stroke-positive-subtle` | `--border-success-muted` | semantic | 0 |
| `--color-stroke-strong` | `--border-emphasis` | semantic | 1 |
| `--color-stroke-subtle` | `--border-muted` | semantic | 37 |

## Positive / negative / urgent (22)

| old | new | note | uses |
|---|---|---|---|
| `--color-negative-100` | `--palette-red-100` | same name | 1 |
| `--color-negative-200` | `--palette-red-200` | same name | 2 |
| `--color-negative-300` | `--palette-red-300` | same name | 0 |
| `--color-negative-400` | `--palette-red-400` | same name | 0 |
| `--color-negative-50` | `--palette-red-50` | same name | 0 |
| `--color-negative-500` | `--palette-red-500` | same name | 1 |
| `--color-negative-600` | `--palette-red-600` | same name | 3 |
| `--color-negative-700` | `--palette-red-700` | same name | 0 |
| `--color-negative-800` | `--palette-red-800` | same name | 0 |
| `--color-negative-900` | `--palette-red-900` | same name | 0 |
| `--color-negative-950` | `--palette-red-950` | same name | 0 |
| `--color-positive-100` | `--palette-green-100` | same name | 1 |
| `--color-positive-200` | `--palette-green-200` | same name | 0 |
| `--color-positive-300` | `--palette-green-300` | same name | 0 |
| `--color-positive-400` | `--palette-green-400` | same name | 0 |
| `--color-positive-50` | `--palette-green-50` | same name | 0 |
| `--color-positive-500` | `--palette-green-500` | same name | 0 |
| `--color-positive-600` | `--palette-green-600` | same name | 1 |
| `--color-positive-700` | `--palette-green-700` | same name | 0 |
| `--color-positive-800` | `--palette-green-800` | same name | 0 |
| `--color-positive-900` | `--palette-green-900` | same name | 0 |
| `--color-positive-950` | `--palette-green-950` | same name | 0 |

## Tags (18)

| old | new | note | uses |
|---|---|---|---|
| `--tag-color-brand-bg-default` | `--tag-accent-bg` | semantic | 0 |
| `--tag-color-brand-bg-subtle` | `--tag-accent-bg-subtle` | semantic | 0 |
| `--tag-color-brand-stroke-default` | `--tag-accent-border` | semantic | 1 |
| `--tag-color-brand-text-default` | `--tag-accent-fg` | semantic | 2 |
| `--tag-color-negative-bg-default` | `--tag-danger-bg` | semantic | 0 |
| `--tag-color-negative-bg-subtle` | `--tag-danger-bg-subtle` | semantic | 0 |
| `--tag-color-negative-stroke-default` | `--tag-danger-border` | semantic | 0 |
| `--tag-color-negative-text-default` | `--tag-danger-fg` | semantic | 3 |
| `--tag-color-neutral-bg-alpha` | `--tag-neutral-bg-alpha` | semantic | 28 |
| `--tag-color-neutral-bg-default` | `--tag-neutral-bg` | semantic | 6 |
| `--tag-color-neutral-bg-inverse` | `--tag-neutral-bg-inverse` | semantic | 0 |
| `--tag-color-neutral-bg-subtle` | `--tag-neutral-bg-subtle` | semantic | 0 |
| `--tag-color-neutral-stroke-default` | `--tag-neutral-border` | semantic | 2 |
| `--tag-color-neutral-text-default` | `--tag-neutral-fg` | semantic | 11 |
| `--tag-color-positive-bg-default` | `--tag-success-bg` | semantic | 0 |
| `--tag-color-positive-bg-subtle` | `--tag-success-bg-subtle` | semantic | 0 |
| `--tag-color-positive-stroke-default` | `--tag-success-border` | semantic | 0 |
| `--tag-color-positive-text-default` | `--tag-success-fg` | semantic | 0 |

## Overlay (2)

| old | new | note | uses |
|---|---|---|---|
| `--color-overlay-scrim-default` | `--overlay-scrim` | semantic | 2 |
| `--color-overlay-shade` | `--overlay-shade` | semantic | 0 |

## Alpha (40)

| old | new | note | uses |
|---|---|---|---|
| `--color-alpha-bg-default` | `--bg-neutral-alpha` | semantic | 0 |
| `--color-alpha-bg-emphasis` | `--bg-neutral-alpha-strong` | semantic | 2 |
| `--color-alpha-bg-minimum` | `--bg-neutral-alpha-subtle` | semantic | 0 |
| `--color-alpha-bg-subtle` | `--bg-neutral-alpha-muted` | semantic | 0 |
| `--color-alpha-black-12` | `—` | black alpha deleted (unused) | 0 |
| `--color-alpha-black-16` | `—` | black alpha deleted (unused) | 0 |
| `--color-alpha-black-20` | `—` | black alpha deleted (unused) | 0 |
| `--color-alpha-black-6` | `—` | black alpha deleted (unused) | 0 |
| `--color-alpha-black-8` | `—` | black alpha deleted (unused) | 0 |
| `--color-alpha-blue-0` | `--palette-alpha-white-0` | same name | 0 |
| `--color-alpha-blue-20` | `--palette-alpha-white-20` | same name | 1 |
| `--color-alpha-blue-40` | `--palette-alpha-white-40` | same name | 1 |
| `--color-alpha-blue-50` | `--palette-alpha-white-50` | same name | 1 |
| `--color-alpha-blue-60` | `--palette-alpha-white-60` | same name | 0 |
| `--color-alpha-blue-80` | `--palette-alpha-white-80` | same name | 0 |
| `--color-alpha-cold-bg-default` | `--bg-neutral-alpha-muted` | semantic | 1 |
| `--color-alpha-cold-bg-subtle` | `--bg-neutral-alpha-subtle` | semantic | 2 |
| `--color-alpha-cold-black-12` | `--palette-alpha-navy-12` | same name | 0 |
| `--color-alpha-cold-black-16` | `--palette-alpha-navy-16` | same name | 1 |
| `--color-alpha-cold-black-20` | `--palette-alpha-navy-20` | same name | 0 |
| `--color-alpha-cold-black-6` | `--palette-alpha-navy-6` | same name | 0 |
| `--color-alpha-cold-black-8` | `--palette-alpha-navy-8` | same name | 1 |
| `--color-alpha-green-12` | `--palette-alpha-navy-12` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-green-16` | `--palette-alpha-navy-16` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-green-20` | `--palette-alpha-navy-20` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-green-40` | `--palette-alpha-navy-40` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-green-6` | `--palette-alpha-navy-6` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-green-60` | `--palette-alpha-navy-60` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-green-8` | `--palette-alpha-navy-8` | deep-green alpha → navy alpha | 0 |
| `--color-alpha-grey-0` | `--palette-alpha-navy-100-0` | grey alpha → navy-100 alpha | 0 |
| `--color-alpha-grey-20` | `--palette-alpha-navy-100-20` | grey alpha → navy-100 alpha | 0 |
| `--color-alpha-grey-40` | `--palette-alpha-navy-100-40` | grey alpha → navy-100 alpha | 0 |
| `--color-alpha-grey-60` | `--palette-alpha-navy-100-60` | grey alpha → navy-100 alpha | 0 |
| `--color-alpha-grey-80` | `--palette-alpha-navy-100-80` | grey alpha → navy-100 alpha | 0 |
| `--color-alpha-white-0` | `--palette-alpha-white-0` | same name | 0 |
| `--color-alpha-white-20` | `--palette-alpha-white-20` | same name | 0 |
| `--color-alpha-white-40` | `--palette-alpha-white-40` | same name | 0 |
| `--color-alpha-white-50` | `--palette-alpha-white-50` | same name | 0 |
| `--color-alpha-white-60` | `--palette-alpha-white-60` | same name | 2 |
| `--color-alpha-white-80` | `--palette-alpha-white-80` | same name | 2 |

## Gradients (20)

| old | new | note | uses |
|---|---|---|---|
| `--color-gradient-ambient-0` | `--gradient-mist-0` | gradient renamed | 0 |
| `--color-gradient-ambient-20` | `--gradient-mist-20` | gradient renamed | 0 |
| `--color-gradient-ambient-40` | `--gradient-mist-40` | gradient renamed | 0 |
| `--color-gradient-ambient-60` | `--gradient-mist-60` | gradient renamed | 0 |
| `--color-gradient-ambient-80` | `--gradient-mist-80` | gradient renamed | 0 |
| `--color-gradient-default-0` | `--gradient-neutral-0` | gradient renamed | 1 |
| `--color-gradient-default-20` | `--gradient-neutral-20` | gradient renamed | 1 |
| `--color-gradient-default-40` | `--gradient-neutral-40` | gradient renamed | 2 |
| `--color-gradient-default-60` | `--gradient-neutral-60` | gradient renamed | 0 |
| `--color-gradient-default-80` | `--gradient-neutral-80` | gradient renamed | 0 |
| `--color-gradient-subtle-0` | `--gradient-white-0` | same name | 4 |
| `--color-gradient-subtle-20` | `--gradient-white-20` | same name | 0 |
| `--color-gradient-subtle-40` | `--gradient-white-40` | same name | 4 |
| `--color-gradient-subtle-50` | `--gradient-white-50` | same name | 0 |
| `--color-gradient-subtle-60` | `--gradient-white-60` | same name | 5 |
| `--color-gradient-subtle-80` | `--gradient-white-80` | same name | 0 |
| `--gradient-bottom-primary-nav-filled` | `--gradient-nav-bottom` | style renamed | 0 |
| `--gradient-bottom-secondary-nav-filled` | `--gradient-nav-bottom-mist` | style renamed | 0 |
| `--gradient-glass-nav-stroke` | `--gradient-glass-stroke` | style renamed | 0 |
| `--gradient-top-nav-filled` | `--gradient-nav-top` | style renamed | 4 |

## Shadows and blur (23)

| old | new | note | uses |
|---|---|---|---|
| `--blur-0` | `--blur-0` | same name | 2 |
| `--blur-10` | `--blur-10` | same name | 0 |
| `--blur-12` | `--blur-12` | same name | 0 |
| `--blur-2` | `--blur-2` | same name | 0 |
| `--blur-24` | `--blur-24` | same name | 0 |
| `--blur-32` | `--blur-32` | same name | 0 |
| `--blur-4` | `--blur-4` | same name | 0 |
| `--blur-backdrop-bg` | `--blur-backdrop-bg` | same name | 34 |
| `--blur-backdrop-shadow` | `--blur-backdrop-shadow` | same name | 19 |
| `--blur-glass-nav-effect` | `--blur-glass` | style renamed | 0 |
| `--blur-glass-nav-effect-focus` | `--blur-glass` | style renamed | 0 |
| `--blur-glass-nav-effect-focus-shadow` | `--blur-glass-shadow` | style renamed | 0 |
| `--blur-glass-nav-effect-shadow` | `--blur-glass-shadow` | style renamed | 0 |
| `--blur-none` | `--blur-none` | same name | 0 |
| `--blur-overlay-scrim-default` | `--blur-overlay-scrim-default` | same name | 0 |
| `--blur-scrim-default-effect` | `--blur-overlay-scrim-default` | style renamed | 0 |
| `--blur-shadow-default-1` | `--blur-shadow-default-1` | same name | 14 |
| `--blur-shadow-default-2` | `--blur-shadow-default-2` | same name | 13 |
| `--blur-shadow-focus-1` | `--blur-shadow-focus-1` | same name | 0 |
| `--blur-shadow-focus-2` | `--blur-shadow-focus-2` | same name | 0 |
| `--shadow-default` | `--elevation-1` | style renamed | 4 |
| `--shadow-focus` | `--elevation-3` | style renamed | 7 |
| `--shadow-over` | `--elevation-2` | style renamed | 22 |

## Colour primitives (118)

| old | new | note | uses |
|---|---|---|---|
| `--color-ambient-100` | `--palette-mist-100` | ambient → mist | 0 |
| `--color-ambient-200` | `--palette-mist-200` | ambient → mist | 0 |
| `--color-ambient-300` | `--palette-mist-300` | ambient → mist | 0 |
| `--color-ambient-400` | `--palette-mist-400` | ambient → mist | 0 |
| `--color-ambient-50` | `--palette-mist-50` | ambient → mist | 0 |
| `--color-ambient-500` | `--palette-mist-500` | ambient → mist | 0 |
| `--color-ambient-600` | `--palette-mist-600` | ambient → mist | 0 |
| `--color-ambient-700` | `--palette-mist-700` | ambient → mist | 0 |
| `--color-ambient-800` | `--palette-mist-800` | ambient → mist | 0 |
| `--color-ambient-900` | `--palette-mist-900` | ambient → mist | 0 |
| `--color-ambient-950` | `--palette-mist-950` | ambient → mist | 0 |
| `--color-blue-100` | `--palette-green-100` | same name | 0 |
| `--color-blue-200` | `--palette-green-200` | same name | 0 |
| `--color-blue-300` | `--palette-green-300` | same name | 0 |
| `--color-blue-400` | `--palette-green-400` | same name | 0 |
| `--color-blue-50` | `--palette-green-50` | same name | 0 |
| `--color-blue-500` | `--palette-green-500` | same name | 0 |
| `--color-blue-600` | `--palette-green-600` | same name | 0 |
| `--color-blue-700` | `--palette-green-700` | same name | 0 |
| `--color-blue-800` | `--palette-green-800` | same name | 0 |
| `--color-blue-900` | `--palette-green-900` | same name | 1 |
| `--color-blue-950` | `--palette-navy-900` | same name | 0 |
| `--color-brand-100` | `--palette-green-100` | same name | 0 |
| `--color-brand-200` | `--palette-green-200` | same name | 3 |
| `--color-brand-300` | `--palette-green-300` | same name | 0 |
| `--color-brand-400` | `--palette-green-400` | same name | 2 |
| `--color-brand-50` | `--palette-green-50` | same name | 0 |
| `--color-brand-500` | `--palette-green-500` | same name | 5 |
| `--color-brand-600` | `--palette-green-600` | same name | 29 |
| `--color-brand-700` | `--palette-green-700` | same name | 2 |
| `--color-brand-800` | `--palette-green-800` | same name | 1 |
| `--color-brand-900` | `--palette-green-900` | same name | 0 |
| `--color-brand-950` | `--palette-navy-900` | same name | 2 |
| `--color-green-100` | `--palette-green-100` | same name | 0 |
| `--color-green-200` | `--palette-green-200` | same name | 0 |
| `--color-green-300` | `--palette-green-300` | same name | 0 |
| `--color-green-400` | `--palette-green-400` | same name | 0 |
| `--color-green-50` | `--palette-green-50` | same name | 0 |
| `--color-green-500` | `--palette-green-500` | same name | 2 |
| `--color-green-600` | `--palette-green-600` | same name | 0 |
| `--color-green-700` | `--palette-green-700` | same name | 0 |
| `--color-green-800` | `--palette-green-800` | same name | 0 |
| `--color-green-900` | `--palette-green-900` | same name | 0 |
| `--color-green-950` | `--palette-green-950` | same name | 0 |
| `--color-marketing-100` | `—` | removed in v2 | 0 |
| `--color-marketing-200` | `—` | removed in v2 | 0 |
| `--color-marketing-300` | `—` | removed in v2 | 0 |
| `--color-marketing-400` | `—` | removed in v2 | 0 |
| `--color-marketing-50` | `—` | removed in v2 | 0 |
| `--color-marketing-500` | `—` | removed in v2 | 0 |
| `--color-marketing-600` | `—` | removed in v2 | 0 |
| `--color-marketing-700` | `—` | removed in v2 | 0 |
| `--color-navy-100` | `--palette-navy-100` | same name | 0 |
| `--color-navy-200` | `--palette-navy-200` | same name | 0 |
| `--color-navy-300` | `--palette-navy-300` | same name | 0 |
| `--color-navy-400` | `--palette-navy-400` | same name | 0 |
| `--color-navy-50` | `--palette-navy-50` | same name | 0 |
| `--color-navy-500` | `--palette-navy-500` | same name | 0 |
| `--color-navy-600` | `--palette-navy-600` | same name | 0 |
| `--color-navy-700` | `--palette-navy-700` | same name | 0 |
| `--color-navy-800` | `--palette-navy-800` | same name | 0 |
| `--color-navy-900` | `--palette-navy-900` | same name | 0 |
| `--color-navy-950` | `--palette-navy-950` | same name | 0 |
| `--color-neutral-0` | `--palette-base-white` | neutral → navy | 5 |
| `--color-neutral-100` | `--palette-navy-100` | neutral → navy | 2 |
| `--color-neutral-150` | `--palette-navy-200` | neutral → navy | 16 |
| `--color-neutral-200` | `--palette-navy-300` | neutral → navy | 1 |
| `--color-neutral-300` | `--palette-navy-400` | neutral → navy | 1 |
| `--color-neutral-400` | `--palette-navy-400` | neutral → navy | 0 |
| `--color-neutral-50` | `--palette-navy-50` | neutral → navy | 6 |
| `--color-neutral-500` | `--palette-navy-500` | neutral → navy | 2 |
| `--color-neutral-600` | `--palette-navy-500` | neutral → navy | 1 |
| `--color-neutral-700` | `--palette-navy-600` | neutral → navy | 1 |
| `--color-neutral-800` | `--palette-navy-700` | neutral → navy | 0 |
| `--color-neutral-900` | `--palette-navy-900` | neutral → navy | 0 |
| `--color-neutral-950` | `--palette-navy-950` | neutral → navy | 25 |
| `--color-pink-100` | `—` | removed in v2 | 0 |
| `--color-pink-200` | `—` | removed in v2 | 0 |
| `--color-pink-300` | `—` | removed in v2 | 0 |
| `--color-pink-400` | `—` | removed in v2 | 0 |
| `--color-pink-50` | `—` | removed in v2 | 0 |
| `--color-pink-500` | `—` | removed in v2 | 0 |
| `--color-pink-600` | `—` | removed in v2 | 0 |
| `--color-pink-700` | `—` | removed in v2 | 0 |
| `--color-red-100` | `--palette-red-100` | same name | 0 |
| `--color-red-200` | `--palette-red-200` | same name | 0 |
| `--color-red-300` | `--palette-red-300` | same name | 0 |
| `--color-red-400` | `--palette-red-400` | same name | 0 |
| `--color-red-50` | `--palette-red-50` | same name | 0 |
| `--color-red-500` | `--palette-red-500` | same name | 0 |
| `--color-red-600` | `--palette-red-600` | same name | 0 |
| `--color-red-700` | `--palette-red-700` | same name | 0 |
| `--color-red-800` | `--palette-red-800` | same name | 0 |
| `--color-red-900` | `--palette-red-900` | same name | 0 |
| `--color-red-950` | `--palette-red-950` | same name | 0 |
| `--color-shadow-backdrop` | `--shadow-backdrop` | semantic | 20 |
| `--color-shadow-default-1` | `--shadow-default-1` | semantic | 12 |
| `--color-shadow-default-2` | `--shadow-default-2` | semantic | 12 |
| `--color-shadow-focus-1` | `--shadow-focus-1` | semantic | 0 |
| `--color-shadow-focus-2` | `--shadow-focus-2` | semantic | 0 |
| `--color-shadow-subtle-1` | `--shadow-subtle-1` | semantic | 3 |
| `--color-shadow-subtle-2` | `--shadow-subtle-2` | semantic | 3 |
| `--color-warning-100` | `—` | removed in v2 | 0 |
| `--color-warning-200` | `—` | removed in v2 | 0 |
| `--color-warning-300` | `—` | removed in v2 | 1 |
| `--color-warning-400` | `—` | removed in v2 | 0 |
| `--color-warning-50` | `—` | removed in v2 | 0 |
| `--color-warning-500` | `—` | removed in v2 | 0 |
| `--color-warning-600` | `—` | removed in v2 | 0 |
| `--color-warning-700` | `—` | removed in v2 | 0 |
| `--color-yellow-100` | `—` | removed in v2 | 0 |
| `--color-yellow-200` | `—` | removed in v2 | 0 |
| `--color-yellow-300` | `—` | removed in v2 | 0 |
| `--color-yellow-400` | `—` | removed in v2 | 0 |
| `--color-yellow-50` | `—` | removed in v2 | 0 |
| `--color-yellow-500` | `—` | removed in v2 | 0 |
| `--color-yellow-600` | `—` | removed in v2 | 0 |
| `--color-yellow-700` | `—` | removed in v2 | 0 |

## Typography (74)

| old | new | note | uses |
|---|---|---|---|
| `--font-family-body` | `--font-family-body` | same name | 172 |
| `--font-family-display` | `--font-family-display` | same name | 1 |
| `--font-family-hanken-grotesk` | `--font-family-hanken-grotesk` | same name | 5 |
| `--font-family-inter` | `--font-family-hanken-grotesk` | same name | 19 |
| `--font-family-label` | `--font-family-label` | same name | 19 |
| `--font-family-number` | `--font-family-number` | same name | 0 |
| `--font-family-reddit-sans` | `--font-family-hanken-grotesk` | same name | 0 |
| `--font-family-title` | `--font-family-title` | same name | 111 |
| `--font-line-height-14` | `--font-line-height-14` | same name | 0 |
| `--font-line-height-16` | `--font-line-height-16` | same name | 0 |
| `--font-line-height-20` | `--font-line-height-20` | same name | 0 |
| `--font-line-height-22` | `--font-line-height-22` | same name | 0 |
| `--font-line-height-24` | `--font-line-height-24` | same name | 0 |
| `--font-line-height-28` | `--font-line-height-28` | same name | 0 |
| `--font-line-height-32` | `--font-line-height-32` | same name | 0 |
| `--font-line-height-36` | `--font-line-height-36` | same name | 0 |
| `--font-line-height-40` | `--font-line-height-40` | same name | 0 |
| `--font-line-height-44` | `--font-line-height-44` | same name | 0 |
| `--font-line-height-48` | `--font-line-height-48` | same name | 0 |
| `--font-line-height-56` | `--font-line-height-56` | same name | 0 |
| `--font-line-height-body-lg` | `--font-line-height-body-lg` | same name | 1 |
| `--font-line-height-body-md` | `--font-line-height-body-md` | same name | 19 |
| `--font-line-height-caption-sm` | `--font-line-height-caption-sm` | same name | 11 |
| `--font-line-height-caption-xs` | `--font-line-height-caption-xs` | same name | 7 |
| `--font-line-height-display-lg` | `--font-line-height-display-lg` | same name | 0 |
| `--font-line-height-display-md` | `--font-line-height-display-md` | same name | 0 |
| `--font-line-height-display-sm` | `--font-line-height-display-sm` | same name | 0 |
| `--font-line-height-display-xl` | `--font-line-height-display-xl` | same name | 0 |
| `--font-line-height-headline-sm` | `--font-line-height-headline-sm` | same name | 1 |
| `--font-line-height-label-md` | `--font-line-height-label-md` | same name | 15 |
| `--font-line-height-label-sm` | `--font-line-height-label-sm` | same name | 2 |
| `--font-line-height-section-title-md` | `--font-line-height-section-title-md` | same name | 4 |
| `--font-line-height-section-title-sm` | `--font-line-height-section-title-sm` | same name | 11 |
| `--font-line-height-title-lg` | `--font-line-height-title-lg` | same name | 1 |
| `--font-line-height-title-md` | `--font-line-height-title-md` | same name | 0 |
| `--font-line-height-title-sm` | `--font-line-height-title-sm` | same name | 16 |
| `--font-size-11` | `--font-size-11` | same name | 9 |
| `--font-size-12` | `--font-size-12` | same name | 10 |
| `--font-size-14` | `--font-size-14` | same name | 32 |
| `--font-size-16` | `--font-size-16` | same name | 10 |
| `--font-size-18` | `--font-size-18` | same name | 1 |
| `--font-size-20` | `--font-size-20` | same name | 0 |
| `--font-size-24` | `--font-size-24` | same name | 4 |
| `--font-size-28` | `--font-size-28` | same name | 2 |
| `--font-size-32` | `--font-size-32` | same name | 2 |
| `--font-size-36` | `--font-size-36` | same name | 1 |
| `--font-size-40` | `--font-size-40` | same name | 0 |
| `--font-size-48` | `--font-size-48` | same name | 0 |
| `--font-size-body-lg` | `--font-size-body-lg` | same name | 7 |
| `--font-size-body-md` | `--font-size-body-md` | same name | 41 |
| `--font-size-caption-sm` | `--font-size-caption-sm` | same name | 18 |
| `--font-size-caption-xs` | `--font-size-caption-xs` | same name | 11 |
| `--font-size-display-lg` | `--font-size-display-lg` | same name | 0 |
| `--font-size-display-md` | `--font-size-display-md` | same name | 0 |
| `--font-size-display-sm` | `--font-size-display-sm` | same name | 1 |
| `--font-size-display-xl` | `--font-size-display-xl` | same name | 0 |
| `--font-size-headline-sm` | `--font-size-headline-sm` | same name | 1 |
| `--font-size-label-md` | `--font-size-label-md` | same name | 15 |
| `--font-size-label-sm` | `--font-size-label-sm` | same name | 2 |
| `--font-size-section-title-md` | `--font-size-section-title-md` | same name | 4 |
| `--font-size-section-title-sm` | `--font-size-section-title-sm` | same name | 11 |
| `--font-size-title-lg` | `--font-size-title-lg` | same name | 4 |
| `--font-size-title-md` | `--font-size-title-md` | same name | 3 |
| `--font-size-title-sm` | `--font-size-title-sm` | same name | 17 |
| `--font-weight-400` | `--font-weight-400` | same name | 0 |
| `--font-weight-500` | `--font-weight-500` | same name | 0 |
| `--font-weight-600` | `--font-weight-600` | same name | 0 |
| `--font-weight-700` | `--font-weight-700` | same name | 0 |
| `--font-weight-800` | `--font-weight-800` | same name | 0 |
| `--font-weight-black` | `--font-weight-black` | same name | 0 |
| `--font-weight-bold` | `--font-weight-bold` | same name | 14 |
| `--font-weight-medium` | `--font-weight-medium` | same name | 13 |
| `--font-weight-regular` | `--font-weight-regular` | same name | 26 |
| `--font-weight-semi-bold` | `--font-weight-semi-bold` | same name | 0 |

## Text styles (168)

| old | new | note | uses |
|---|---|---|---|
| `--amount-sm-font-family` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-font-size` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-font-weight` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-letter-spacing` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-line-height` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-paragraph-spacing` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-text-decoration` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-sm-text-transform` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--amount-xl-font-family` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-font-size` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-font-weight` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-letter-spacing` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-line-height` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-paragraph-spacing` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-text-decoration` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--amount-xl-text-transform` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--body-lg-emphasis-font-family` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 3 |
| `--body-lg-emphasis-font-size` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 3 |
| `--body-lg-emphasis-font-weight` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 3 |
| `--body-lg-emphasis-letter-spacing` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 1 |
| `--body-lg-emphasis-line-height` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 3 |
| `--body-lg-emphasis-paragraph-spacing` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--body-lg-emphasis-text-decoration` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--body-lg-emphasis-text-transform` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--body-md-emphasis-font-family` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 13 |
| `--body-md-emphasis-font-size` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 9 |
| `--body-md-emphasis-font-weight` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 28 |
| `--body-md-emphasis-letter-spacing` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 11 |
| `--body-md-emphasis-line-height` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 14 |
| `--body-md-emphasis-paragraph-spacing` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--body-md-emphasis-text-decoration` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--body-md-emphasis-text-transform` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--display-lg-font-family` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-font-size` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-font-weight` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-letter-spacing` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-line-height` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-paragraph-spacing` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-text-decoration` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-lg-text-transform` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-font-family` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-font-size` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-font-weight` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-letter-spacing` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-line-height` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-paragraph-spacing` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-text-decoration` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--display-xl-text-transform` | `.ps-text-display-md` | text style → class (no per-property variable) | 0 |
| `--label-md-light-font-family` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 4 |
| `--label-md-light-font-size` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 5 |
| `--label-md-light-font-weight` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 4 |
| `--label-md-light-letter-spacing` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--label-md-light-line-height` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 5 |
| `--label-md-light-paragraph-spacing` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--label-md-light-text-decoration` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--label-md-light-text-transform` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-font-family` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-font-size` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-font-weight` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-letter-spacing` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-line-height` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-paragraph-spacing` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-text-decoration` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--label-sm-light-text-transform` | `.ps-text-caption-sm` | text style → class (no per-property variable) | 0 |
| `--link-font-family` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-font-size` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-font-weight` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-letter-spacing` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-line-height` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-paragraph-spacing` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-text-decoration` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--link-text-transform` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--number-lg-font-family` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-font-size` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-font-weight` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-letter-spacing` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-line-height` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-paragraph-spacing` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-text-decoration` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-lg-text-transform` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-md-font-family` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-font-size` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-font-weight` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-letter-spacing` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-line-height` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-paragraph-spacing` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-text-decoration` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-md-text-transform` | `.ps-text-amount-md` | text style → class (no per-property variable) | 0 |
| `--number-sm-font-family` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-font-size` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-font-weight` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-letter-spacing` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-line-height` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-paragraph-spacing` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-text-decoration` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-sm-text-transform` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xl-font-family` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-font-size` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-font-weight` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-letter-spacing` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-line-height` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-paragraph-spacing` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-text-decoration` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xl-text-transform` | `.ps-text-amount-lg` | text style → class (no per-property variable) | 0 |
| `--number-xs-font-family` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-font-size` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-font-weight` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-letter-spacing` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-line-height` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-paragraph-spacing` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-text-decoration` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xs-text-transform` | `.ps-text-amount-xs` | text style → class (no per-property variable) | 0 |
| `--number-xxl-font-family` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-font-size` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-font-weight` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-letter-spacing` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-line-height` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-paragraph-spacing` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-text-decoration` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--number-xxl-text-transform` | `.ps-text-amount-xxl` | text style → class (no per-property variable) | 0 |
| `--section-title-md-font-family` | `.ps-text-title-xs` | text style → class (no per-property variable) | 11 |
| `--section-title-md-font-size` | `.ps-text-title-xs` | text style → class (no per-property variable) | 14 |
| `--section-title-md-font-weight` | `.ps-text-title-xs` | text style → class (no per-property variable) | 9 |
| `--section-title-md-letter-spacing` | `.ps-text-title-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-md-light-font-family` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 2 |
| `--section-title-md-light-font-size` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 2 |
| `--section-title-md-light-font-weight` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 3 |
| `--section-title-md-light-letter-spacing` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-md-light-line-height` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 2 |
| `--section-title-md-light-paragraph-spacing` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-md-light-text-decoration` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-md-light-text-transform` | `.ps-text-body-lg-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-md-line-height` | `.ps-text-title-xs` | text style → class (no per-property variable) | 11 |
| `--section-title-md-paragraph-spacing` | `.ps-text-title-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-md-text-decoration` | `.ps-text-title-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-md-text-transform` | `.ps-text-title-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-sm-font-family` | `.ps-text-label-md` | text style → class (no per-property variable) | 19 |
| `--section-title-sm-font-size` | `.ps-text-label-md` | text style → class (no per-property variable) | 19 |
| `--section-title-sm-font-weight` | `.ps-text-label-md` | text style → class (no per-property variable) | 19 |
| `--section-title-sm-letter-spacing` | `.ps-text-label-md` | text style → class (no per-property variable) | 1 |
| `--section-title-sm-light-font-family` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 4 |
| `--section-title-sm-light-font-size` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 4 |
| `--section-title-sm-light-font-weight` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 4 |
| `--section-title-sm-light-letter-spacing` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 1 |
| `--section-title-sm-light-line-height` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 4 |
| `--section-title-sm-light-paragraph-spacing` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-sm-light-text-decoration` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-sm-light-text-transform` | `.ps-text-body-md-strong` | text style → class (no per-property variable) | 0 |
| `--section-title-sm-line-height` | `.ps-text-label-md` | text style → class (no per-property variable) | 18 |
| `--section-title-sm-paragraph-spacing` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--section-title-sm-text-decoration` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--section-title-sm-text-transform` | `.ps-text-label-md` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-font-family` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 1 |
| `--section-title-xs-font-size` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 2 |
| `--section-title-xs-font-weight` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 2 |
| `--section-title-xs-letter-spacing` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-light-font-family` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 1 |
| `--section-title-xs-light-font-size` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-light-font-weight` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 1 |
| `--section-title-xs-light-letter-spacing` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-light-line-height` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 1 |
| `--section-title-xs-light-paragraph-spacing` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-light-text-decoration` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-light-text-transform` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-line-height` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 2 |
| `--section-title-xs-paragraph-spacing` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-text-decoration` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |
| `--section-title-xs-text-transform` | `.ps-text-caption-xs` | text style → class (no per-property variable) | 0 |

## Spacing, radius, size (80)

| old | new | note | uses |
|---|---|---|---|
| `--radius-0` | `--radius-0` | same name | 0 |
| `--radius-12` | `--radius-12` | same name | 0 |
| `--radius-16` | `--radius-16` | same name | 0 |
| `--radius-20` | `--radius-20` | same name | 0 |
| `--radius-24` | `--radius-24` | same name | 0 |
| `--radius-32` | `--radius-32` | same name | 1 |
| `--radius-8` | `--radius-8` | same name | 0 |
| `--radius-999` | `--radius-999` | same name | 0 |
| `--radius-full` | `--radius-full` | same name | 155 |
| `--radius-lg` | `--radius-lg` | same name | 24 |
| `--radius-md` | `--radius-md` | same name | 21 |
| `--radius-none` | `--radius-none` | same name | 0 |
| `--radius-sm` | `--radius-sm` | same name | 30 |
| `--radius-xl` | `--radius-xl` | same name | 86 |
| `--radius-xs` | `--radius-xs` | same name | 23 |
| `--radius-xxl` | `--radius-xxl` | same name | 40 |
| `--spacing-0` | `--spacing-0` | same name | 0 |
| `--spacing-12` | `--spacing-12` | same name | 33 |
| `--spacing-16` | `--spacing-16` | same name | 30 |
| `--spacing-2` | `--spacing-2` | same name | 13 |
| `--spacing-20` | `--spacing-20` | same name | 13 |
| `--spacing-24` | `--spacing-24` | same name | 4 |
| `--spacing-28` | `--spacing-28` | same name | 0 |
| `--spacing-32` | `--spacing-32` | same name | 7 |
| `--spacing-36` | `--spacing-36` | same name | 0 |
| `--spacing-4` | `--spacing-4` | same name | 26 |
| `--spacing-40` | `--spacing-40` | same name | 0 |
| `--spacing-44` | `--spacing-44` | same name | 0 |
| `--spacing-48` | `--spacing-48` | same name | 1 |
| `--spacing-56` | `--spacing-56` | same name | 0 |
| `--spacing-64` | `--spacing-64` | same name | 1 |
| `--spacing-8` | `--spacing-8` | same name | 44 |
| `--spacing-gap-2xl` | `--spacing-gap-2xl` | same name | 9 |
| `--spacing-gap-2xs` | `--spacing-gap-2xs` | same name | 9 |
| `--spacing-gap-3xl` | `--spacing-gap-3xl` | same name | 0 |
| `--spacing-gap-lg` | `--spacing-gap-lg` | same name | 87 |
| `--spacing-gap-md` | `--spacing-gap-md` | same name | 106 |
| `--spacing-gap-none` | `--spacing-gap-none` | same name | 3 |
| `--spacing-gap-sm` | `--spacing-gap-sm` | same name | 167 |
| `--spacing-gap-xl` | `--spacing-gap-xl` | same name | 51 |
| `--spacing-gap-xs` | `--spacing-gap-xs` | same name | 64 |
| `--spacing-padding-2xl` | `--spacing-padding-2xl` | same name | 13 |
| `--spacing-padding-2xs` | `--spacing-padding-2xs` | same name | 6 |
| `--spacing-padding-3xl` | `--spacing-padding-3xl` | same name | 15 |
| `--spacing-padding-4xl` | `--spacing-padding-4xl` | same name | 0 |
| `--spacing-padding-5xl` | `--spacing-padding-5xl` | same name | 8 |
| `--spacing-padding-lg` | `--spacing-padding-lg` | same name | 140 |
| `--spacing-padding-md` | `--spacing-padding-md` | same name | 73 |
| `--spacing-padding-none` | `--spacing-padding-none` | same name | 1 |
| `--spacing-padding-sm` | `--spacing-padding-sm` | same name | 57 |
| `--spacing-padding-xl` | `--spacing-padding-xl` | same name | 46 |
| `--spacing-padding-xs` | `--spacing-padding-xs` | same name | 13 |
| `--spacing-page-bottom-lg` | `--spacing-page-bottom-lg` | same name | 3 |
| `--spacing-page-bottom-md` | `--spacing-page-bottom-md` | same name | 7 |
| `--spacing-page-bottom-sm` | `--spacing-page-bottom-sm` | same name | 2 |
| `--spacing-page-bottom-xl` | `--spacing-page-bottom-xl` | same name | 1 |
| `--spacing-page-top-lg` | `--spacing-page-top-lg` | same name | 1 |
| `--spacing-page-top-md` | `--spacing-page-top-md` | same name | 0 |
| `--spacing-page-top-sm` | `--spacing-page-top-sm` | same name | 2 |
| `--spacing-page-x-lg` | `--spacing-page-x-lg` | same name | 6 |
| `--spacing-page-x-md` | `--spacing-page-x-md` | same name | 2 |
| `--spacing-page-x-sm` | `--spacing-page-x-sm` | same name | 37 |
| `--spacing-section-2xl` | `--spacing-section-2xl` | same name | 1 |
| `--spacing-section-2xs` | `--spacing-section-2xs` | same name | 0 |
| `--spacing-section-3xl` | `--spacing-section-3xl` | same name | 4 |
| `--spacing-section-4xl` | `--spacing-section-4xl` | same name | 0 |
| `--spacing-section-lg` | `--spacing-section-lg` | same name | 4 |
| `--spacing-section-md` | `--spacing-section-md` | same name | 15 |
| `--spacing-section-none` | `--spacing-section-none` | same name | 0 |
| `--spacing-section-sm` | `--spacing-section-sm` | same name | 12 |
| `--spacing-section-xl` | `--spacing-section-xl` | same name | 3 |
| `--spacing-section-xs` | `--spacing-section-xs` | same name | 2 |
| `--stroke-width-10` | `--stroke-width-10` | same name | 0 |
| `--stroke-width-15` | `--stroke-width-15` | same name | 0 |
| `--stroke-width-20` | `--stroke-width-20` | same name | 0 |
| `--stroke-width-25` | `--stroke-width-25` | same name | 0 |
| `--stroke-width-default` | `--stroke-width-default` | same name | 39 |
| `--stroke-width-heavy` | `--stroke-width-heavy` | same name | 0 |
| `--stroke-width-medium` | `--stroke-width-medium` | same name | 10 |
| `--stroke-width-strong` | `--stroke-width-strong` | same name | 14 |

## Opacity (14)

| old | new | note | uses |
|---|---|---|---|
| `--layer-opacity-0` | `--layer-opacity-0` | same name | 0 |
| `--layer-opacity-100` | `--layer-opacity-100` | same name | 0 |
| `--layer-opacity-20` | `--layer-opacity-20` | same name | 0 |
| `--layer-opacity-40` | `--layer-opacity-40` | same name | 0 |
| `--layer-opacity-60` | `--layer-opacity-60` | same name | 0 |
| `--layer-opacity-8` | `--layer-opacity-8` | same name | 0 |
| `--layer-opacity-80` | `--layer-opacity-80` | same name | 0 |
| `--layer-opacity-emphasis` | `--layer-opacity-emphasis` | same name | 0 |
| `--layer-opacity-full` | `--layer-opacity-full` | same name | 0 |
| `--layer-opacity-hide` | `--layer-opacity-hide` | same name | 0 |
| `--layer-opacity-minimum` | `--layer-opacity-minimum` | same name | 0 |
| `--layer-opacity-muted` | `--layer-opacity-muted` | same name | 0 |
| `--layer-opacity-secondary` | `--layer-opacity-secondary` | same name | 0 |
| `--layer-opacity-subtle` | `--layer-opacity-subtle` | same name | 2 |
