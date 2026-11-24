> **Superseded (2026-11-24):** use `rebrand/handoff/ai/` (README.md there) — this file was written for tokens v2 against phi_h5_025 32268e1.

# PeraSure rebrand — colour token mapping (old → new)

> **Superseded (2026-11-19):** the owner decided to rebuild the whole token system with a new structure and new names, so this table
> will be regenerated from a new mapping. It is kept as a record of the interim "same names, new values" mapping.

Generated from `rebrand/tokens/mapping.json` (output of `rebrand/tokens/recolour.py`). Baseline: phi_h5_025 `tokens/figma-tokens.json` @ 2026-11-18. **CSS names are kept; only values change.** A name is removed only when its colour is gone.

## Decisions behind the values (owner, 2026-11-19)

1. **Green text on white is pending.** For now text uses text-safe `green-700 #2B8448` (4.7:1). Every token that depends on it is marked **pending** below — if the owner picks another green, only `green-700` references change. Logo green `#5CD680` is never text on white.
2. **Toggles, radios, segmented selection → navy. Chips, tags, states (paid, verified), links → green.**
3. **No light navy / light blue tints.** Light brand fills use ambient (Mist `#F0F5F4`): `brand-50…300` now point to `ambient-50…300`.
4. **Pink and yellow are removed**, with their aliases `marketing-*` and `warning-*` (legacy). Blue is removed and replaced by navy.

## Counts

| status | tokens |
|---|---:|
| same | 147 |
| changed | 86 |
| new | 11 |
| removed | 49 |
| same (demo only) | 5 |
| **total** | **298** |

Pending (green text on white): **8** tokens — `--color-action-text-link`, `--color-action-text-positive`, `--color-icon-positive-default`, `--color-stroke-positive-strong`, `--color-text-link-default`, `--color-text-positive-default`, `--tag-color-brand-text-default`, `--tag-color-positive-text-default`.

In the developers' generated CSS this is **690 → 652 variables** (49 removed, 11 added, 86 values changed; nothing outside colour changes). "same (demo only)" rows exist only in the demo's tokens.css and are listed for completeness.

**Points to** is the primitive the token references in the new JSON. **Bold** = re-pointed by the rebrand (old reference in brackets); plain = same reference, value follows the new primitive. For removed tokens the column says what to use instead.

## Primitives (green, neutral, red, ambient) (38)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-ambient-50` | same | `#f7faf9` | `#f7faf9` | (own value) |  |
| `--color-ambient-100` | same | `#f0f5f4` | `#f0f5f4` | (own value) |  |
| `--color-ambient-200` | same | `#eaf2f0` | `#eaf2f0` | (own value) |  |
| `--color-green-50` | **changed** | `#f3fcf9` | `#edfcf0` | (own value) |  |
| `--color-green-100` | **changed** | `#ddf8ee` | `#dbf8e0` | (own value) |  |
| `--color-green-200` | **changed** | `#bdf1dd` | `#bcf2c7` | (own value) |  |
| `--color-green-300` | **changed** | `#97e9c7` | `#99e8ab` | (own value) |  |
| `--color-green-400` | **changed** | `#73e1b1` | `#79e094` | (own value) |  |
| `--color-green-500` | **changed** | `#58e09a` | `#5cd680` | (own value) |  |
| `--color-green-600` | **changed** | `#3bcb84` | `#43b265` | (own value) |  |
| `--color-green-700` | **changed** | `#2eae6e` | `#2b8448` | (own value) |  |
| `--color-green-800` | **changed** | `#1f9158` | `#206335` | (own value) |  |
| `--color-green-900` | **changed** | `#145f3a` | `#154624` | (own value) |  |
| `--color-green-950` | **changed** | `#0a3321` | `#0c2b15` | (own value) |  |
| `--color-neutral-0` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-neutral-50` | same | `#f2f3f4` | `#f2f3f4` | neutral-50 |  |
| `--color-neutral-100` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--color-neutral-150` | same | `#cdd1d4` | `#cdd1d4` | neutral-150 |  |
| `--color-neutral-200` | same | `#bac0c4` | `#bac0c4` | neutral-200 |  |
| `--color-neutral-300` | same | `#97a0a6` | `#97a0a6` | neutral-300 |  |
| `--color-neutral-400` | same | `#7d878e` | `#7d878e` | neutral-400 |  |
| `--color-neutral-500` | same | `#6a757d` | `#6a757d` | neutral-500 |  |
| `--color-neutral-600` | same | `#55606a` | `#55606a` | neutral-600 |  |
| `--color-neutral-700` | same | `#3c4850` | `#3c4850` | neutral-700 |  |
| `--color-neutral-800` | same | `#26323a` | `#26323a` | neutral-800 |  |
| `--color-neutral-900` | same | `#141e24` | `#141e24` | neutral-900 |  |
| `--color-neutral-950` | same | `#0a1219` | `#0a1219` | neutral-950 |  |
| `--color-red-50` | same | `#fff5f5` | `#fff5f5` | (own value) |  |
| `--color-red-100` | same | `#ffe0e2` | `#ffe0e2` | (own value) |  |
| `--color-red-200` | same | `#ffbfc3` | `#ffbfc3` | (own value) |  |
| `--color-red-300` | same | `#ff9099` | `#ff9099` | (own value) |  |
| `--color-red-400` | same | `#ff5560` | `#ff5560` | (own value) |  |
| `--color-red-500` | same | `#ff0d19` | `#ff0d19` | (own value) |  |
| `--color-red-600` | same | `#e00010` | `#e00010` | (own value) |  |
| `--color-red-700` | same | `#b8000d` | `#b8000d` | (own value) |  |
| `--color-red-800` | same | `#8c000a` | `#8c000a` | (own value) |  |
| `--color-red-900` | same | `#5e0007` | `#5e0007` | (own value) |  |
| `--color-red-950` | same | `#330004` | `#330004` | (own value) |  |

## Positive / negative scales (semantic aliases of green / red) (22)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-negative-50` | same | `#fff5f5` | `#fff5f5` | red-50 |  |
| `--color-negative-100` | same | `#ffe0e2` | `#ffe0e2` | red-100 |  |
| `--color-negative-200` | same | `#ffbfc3` | `#ffbfc3` | red-200 |  |
| `--color-negative-300` | same | `#ff9099` | `#ff9099` | red-300 |  |
| `--color-negative-400` | same | `#ff5560` | `#ff5560` | red-400 |  |
| `--color-negative-500` | same | `#ff0d19` | `#ff0d19` | red-500 |  |
| `--color-negative-600` | same | `#e00010` | `#e00010` | red-600 |  |
| `--color-negative-700` | same | `#b8000d` | `#b8000d` | red-700 |  |
| `--color-negative-800` | same | `#8c000a` | `#8c000a` | red-800 |  |
| `--color-negative-900` | same | `#5e0007` | `#5e0007` | red-900 |  |
| `--color-negative-950` | same | `#330004` | `#330004` | red-950 |  |
| `--color-positive-50` | **changed** | `#f3fcf9` | `#edfcf0` | green-50 |  |
| `--color-positive-100` | **changed** | `#ddf8ee` | `#dbf8e0` | green-100 |  |
| `--color-positive-200` | **changed** | `#bdf1dd` | `#bcf2c7` | green-200 |  |
| `--color-positive-300` | **changed** | `#97e9c7` | `#99e8ab` | green-300 |  |
| `--color-positive-400` | **changed** | `#73e1b1` | `#79e094` | green-400 |  |
| `--color-positive-500` | **changed** | `#58e09a` | `#5cd680` | green-500 |  |
| `--color-positive-600` | **changed** | `#3bcb84` | `#43b265` | green-600 |  |
| `--color-positive-700` | **changed** | `#2eae6e` | `#2b8448` | green-700 |  |
| `--color-positive-800` | **changed** | `#1f9158` | `#206335` | green-800 |  |
| `--color-positive-900` | **changed** | `#145f3a` | `#154624` | green-900 |  |
| `--color-positive-950` | **changed** | `#0a3321` | `#0c2b15` | green-950 |  |

## Action (20)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-action-bg-inverse` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-action-bg-positive-default` | **changed** | `#3bcb84` | `#5cd680` | **green-500** (was green-600) |  |
| `--color-action-bg-positive-disabled` | **changed** | `#97e9c7` | `#bcf2c7` | **green-200** (was green-300) |  |
| `--color-action-bg-positive-pressed` | **changed** | `#2eae6e` | `#43b265` | **green-600** (was green-700) |  |
| `--color-action-bg-positive-subtle` | **changed** | `#ddf8ee` | `#dbf8e0` | green-100 |  |
| `--color-action-bg-positive-subtle-pressed` | **changed** | `#bdf1dd` | `#bcf2c7` | green-200 |  |
| `--color-action-bg-primary-default` | **changed** | `#2c74be` | `#5cd680` | **green-500** (was blue-600) |  |
| `--color-action-bg-primary-disabled` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--color-action-bg-primary-pressed` | **changed** | `#20558d` | `#43b265` | **green-600** (was blue-700) |  |
| `--color-action-bg-primary-subtle` | **changed** | `#e4f0ff` | `#dbf8e0` | **green-100** (was blue-100) |  |
| `--color-action-bg-primary-subtle-pressed` | **changed** | `#c8deff` | `#bcf2c7` | **green-200** (was blue-200) |  |
| `--color-action-stroke-active` | **changed** | `#3fa0f0` | `#000128` | **navy-900** (was blue-500) |  |
| `--color-action-stroke-active-subtle` | **changed** | `#9fc6fa` | `#97a0a6` | **neutral-300** (was blue-300) |  |
| `--color-action-stroke-default` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--color-action-stroke-filled` | **changed** | `#e4f0ff` | `#cdd1d4` | **neutral-150** (was blue-100) |  |
| `--color-action-text-brand` | **changed** | `#2c74be` | `#000128` | **navy-900** (was blue-600) |  |
| `--color-action-text-default` | **changed** | `#ffffff` | `#000128` | **navy-900** (was neutral-0) |  |
| `--color-action-text-disabled` | same | `#97a0a6` | `#97a0a6` | neutral-300 |  |
| `--color-action-text-link` | **changed** | `#3fa0f0` | `#2b8448` | **green-700** (was blue-500) | ● |
| `--color-action-text-positive` | **changed** | `#3bcb84` | `#2b8448` | **green-700** (was green-600) | ● |

## Brand scale (11)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-brand-50` | **changed** | `#f3f8ff` | `#f7faf9` | **ambient-50** (was blue-50) |  |
| `--color-brand-100` | **changed** | `#e4f0ff` | `#f0f5f4` | **ambient-100** (was blue-100) |  |
| `--color-brand-200` | **changed** | `#c8deff` | `#eaf2f0` | **ambient-200** (was blue-200) |  |
| `--color-brand-300` | **changed** | `#9fc6fa` | `#dfeee5` | **ambient-300** (was blue-300) |  |
| `--color-brand-400` | **changed** | `#74b2f5` | `#304c8c` | **navy-600** (was blue-400) |  |
| `--color-brand-500` | **changed** | `#3fa0f0` | `#0a1a4a` | **navy-800** (was blue-500) |  |
| `--color-brand-600` | **changed** | `#2c74be` | `#000128` | **navy-900** (was blue-600) |  |
| `--color-brand-700` | **changed** | `#20558d` | `#00011a` | **navy-950** (was blue-700) |  |
| `--color-brand-800` | **changed** | `#173d67` | `#00011a` | **navy-950** (was blue-800) |  |
| `--color-brand-900` | **changed** | `#102950` | `#00011a` | **navy-950** (was blue-900) |  |
| `--color-brand-950` | **changed** | `#000128` | `#00011a` | **navy-950** (was blue-950) |  |

## Text (18)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-text-brand-default` | **changed** | `#2c74be` | `#000128` | **navy-900** (was blue-600) |  |
| `--color-text-brand-heavy` | **changed** | `#20558d` | `#00011a` | **navy-950** (was blue-700) |  |
| `--color-text-brand-light` | **changed** | `#3fa0f0` | `#0a1a4a` | **navy-800** (was blue-500) |  |
| `--color-text-disabled` | same | `#97a0a6` | `#97a0a6` | neutral-300 |  |
| `--color-text-inverse` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-text-link-default` | **changed** | `#2c74be` | `#2b8448` | **green-700** (was blue-600) | ● |
| `--color-text-link-heavy` | **changed** | `#20558d` | `#206335` | **green-800** (was blue-700) |  |
| `--color-text-link-light` | **changed** | `#3fa0f0` | `#43b265` | **green-600** (was blue-500) |  |
| `--color-text-negative-default` | same | `#e00010` | `#e00010` | red-600 |  |
| `--color-text-negative-heavy` | same | `#b8000d` | `#b8000d` | red-700 |  |
| `--color-text-negative-light` | same | `#ff0d19` | `#ff0d19` | red-500 |  |
| `--color-text-placeholder` | same | `#7d878e` | `#7d878e` | neutral-400 |  |
| `--color-text-positive-default` | **changed** | `#3bcb84` | `#2b8448` | **green-700** (was green-600) | ● |
| `--color-text-positive-heavy` | **changed** | `#2eae6e` | `#206335` | **green-800** (was green-700) |  |
| `--color-text-positive-light` | **changed** | `#58e09a` | `#5cd680` | green-500 |  |
| `--color-text-primary` | same | `#141e24` | `#141e24` | neutral-900 |  |
| `--color-text-secondary` | same | `#3c4850` | `#3c4850` | neutral-700 |  |
| `--color-text-tertiary` | same | `#6a757d` | `#6a757d` | neutral-500 |  |

## Icon (15)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-icon-brand-default` | **changed** | `#2c74be` | `#000128` | **navy-900** (was blue-600) |  |
| `--color-icon-brand-heavy` | **changed** | `#20558d` | `#00011a` | **navy-950** (was blue-700) |  |
| `--color-icon-brand-light` | **changed** | `#3fa0f0` | `#0a1a4a` | **navy-800** (was blue-500) |  |
| `--color-icon-disabled` | same | `#97a0a6` | `#97a0a6` | neutral-300 |  |
| `--color-icon-inverse` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-icon-negative-default` | same | `#e00010` | `#e00010` | red-600 |  |
| `--color-icon-negative-heavy` | same | `#b8000d` | `#b8000d` | red-700 |  |
| `--color-icon-negative-light` | same | `#ff0d19` | `#ff0d19` | red-500 |  |
| `--color-icon-placeholder` | same | `#7d878e` | `#7d878e` | neutral-400 |  |
| `--color-icon-positive-default` | **changed** | `#3bcb84` | `#2b8448` | **green-700** (was green-600) | ● |
| `--color-icon-positive-heavy` | **changed** | `#2eae6e` | `#206335` | **green-800** (was green-700) |  |
| `--color-icon-positive-light` | **changed** | `#58e09a` | `#5cd680` | green-500 |  |
| `--color-icon-primary` | same | `#141e24` | `#141e24` | neutral-900 |  |
| `--color-icon-secondary` | same | `#3c4850` | `#3c4850` | neutral-700 |  |
| `--color-icon-tertiary` | same | `#6a757d` | `#6a757d` | neutral-500 |  |

## Stroke (13)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-stroke-brand-default` | **changed** | `#3fa0f0` | `#000128` | **navy-900** (was blue-500) |  |
| `--color-stroke-brand-strong` | **changed** | `#2c74be` | `#00011a` | **navy-950** (was blue-600) |  |
| `--color-stroke-brand-subtle` | **changed** | `#c8deff` | `#cdd1d4` | **neutral-150** (was blue-200) |  |
| `--color-stroke-default` | same | `#bac0c4` | `#bac0c4` | neutral-200 |  |
| `--color-stroke-divider` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--color-stroke-negative-default` | same | `#ff0d19` | `#ff0d19` | red-500 |  |
| `--color-stroke-negative-strong` | same | `#e00010` | `#e00010` | red-600 |  |
| `--color-stroke-negative-subtle` | same | `#ffbfc3` | `#ffbfc3` | red-200 |  |
| `--color-stroke-positive-default` | **changed** | `#58e09a` | `#5cd680` | green-500 |  |
| `--color-stroke-positive-strong` | **changed** | `#3bcb84` | `#2b8448` | **green-700** (was green-600) | ● |
| `--color-stroke-positive-subtle` | **changed** | `#bdf1dd` | `#bcf2c7` | green-200 |  |
| `--color-stroke-strong` | same | `#97a0a6` | `#97a0a6` | neutral-300 |  |
| `--color-stroke-subtle` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |

## Surface (25)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-surface-card-brand` | **changed** | `#2c74be` | `#000128` | **navy-900** (was blue-600) |  |
| `--color-surface-card-brand-subtle` | **changed** | `#f3f8ff` | `#f0f5f4` | **ambient-100** (was blue-50) |  |
| `--color-surface-card-default` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-surface-card-muted` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--color-surface-card-negative` | same | `#e00010` | `#e00010` | red-600 |  |
| `--color-surface-card-negative-subtle` | same | `#fff5f5` | `#fff5f5` | red-50 |  |
| `--color-surface-card-positive` | **changed** | `#3bcb84` | `#5cd680` | **green-500** (was green-600) |  |
| `--color-surface-card-positive-subtle` | **changed** | `#f3fcf9` | `#edfcf0` | green-50 |  |
| `--color-surface-elevated-default` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-surface-elevated-glass` | same | `#ffffff99` | `#ffffff99` | alpha-white-60 |  |
| `--color-surface-elevated-glass-blue` | same | `#ffffff99` | `#ffffff99` | alpha-white-60 |  |
| `--color-surface-icon-brand-default` | **changed** | `#2c74be` | `#000128` | **navy-900** (was blue-600) |  |
| `--color-surface-icon-brand-disabled` | **changed** | `#9fc6fa` | `#bac0c4` | **neutral-200** (was blue-300) |  |
| `--color-surface-icon-inverse-default` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--color-surface-icon-inverse-disabled` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--color-surface-icon-negative-default` | same | `#e00010` | `#e00010` | red-600 |  |
| `--color-surface-icon-negative-disabled` | same | `#ff9099` | `#ff9099` | red-300 |  |
| `--color-surface-icon-neutral-default` | same | `#f2f3f4` | `#f2f3f4` | neutral-50 |  |
| `--color-surface-icon-neutral-disabled` | same | `#97a0a6` | `#97a0a6` | neutral-300 |  |
| `--color-surface-icon-positive-default` | **changed** | `#3bcb84` | `#5cd680` | **green-500** (was green-600) |  |
| `--color-surface-icon-positive-disabled` | **changed** | `#97e9c7` | `#bcf2c7` | **green-200** (was green-300) |  |
| `--color-surface-inset-default` | same | `#f0f5f4` | `#f0f5f4` | ambient-100 |  |
| `--color-surface-page-default` | same | `#f0f5f4` | `#f0f5f4` | ambient-100 |  |
| `--color-surface-page-heavy` | same | `#eaf2f0` | `#eaf2f0` | ambient-200 |  |
| `--color-surface-page-light` | same | `#f7faf9` | `#f7faf9` | ambient-50 |  |

## Alpha, shadow, gradient, overlay (58)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-alpha-bg-default` | same | `#00292166` | `#00292166` | alpha-green-40 |  |
| `--color-alpha-bg-emphasis` | same | `#00292199` | `#00292199` | alpha-green-60 |  |
| `--color-alpha-bg-minimum` | same | `#0029210f` | `#0029210f` | alpha-green-6 |  |
| `--color-alpha-bg-subtle` | same | `#00292133` | `#00292133` | alpha-green-20 |  |
| `--color-alpha-black-6` | same | `#0000000f` | `#0000000f` | (own value) |  |
| `--color-alpha-black-8` | same | `#00000014` | `#00000014` | (own value) |  |
| `--color-alpha-black-12` | same | `#0000001f` | `#0000001f` | (own value) |  |
| `--color-alpha-black-16` | same | `#00000029` | `#00000029` | (own value) |  |
| `--color-alpha-black-20` | same | `#00000033` | `#00000033` | (own value) |  |
| `--color-alpha-cold-bg-default` | same | `#00012833` | `#00012833` | alpha-cold black-20 |  |
| `--color-alpha-cold-bg-subtle` | same | `#0001280f` | `#0001280f` | alpha-cold black-6 |  |
| `--color-alpha-cold-black-6` | same | `#0001280f` | `#0001280f` | (own value) |  |
| `--color-alpha-cold-black-8` | same | `#00012814` | `#00012814` | (own value) |  |
| `--color-alpha-cold-black-12` | same | `#0001281f` | `#0001281f` | (own value) |  |
| `--color-alpha-cold-black-16` | same | `#00012829` | `#00012829` | (own value) |  |
| `--color-alpha-cold-black-20` | same | `#00012833` | `#00012833` | (own value) |  |
| `--color-alpha-green-6` | same | `#0029210f` | `#0029210f` | (own value) |  |
| `--color-alpha-green-8` | same | `#00292114` | `#00292114` | (own value) |  |
| `--color-alpha-green-12` | same | `#0029211f` | `#0029211f` | (own value) |  |
| `--color-alpha-green-16` | same | `#00292129` | `#00292129` | (own value) |  |
| `--color-alpha-green-20` | same | `#00292133` | `#00292133` | (own value) |  |
| `--color-alpha-green-40` | same | `#00292166` | `#00292166` | (own value) |  |
| `--color-alpha-green-60` | same | `#00292199` | `#00292199` | (own value) |  |
| `--color-alpha-grey-0` | same | `#e1e4e500` | `#e1e4e500` | (own value) |  |
| `--color-alpha-grey-20` | same | `#e1e4e533` | `#e1e4e533` | (own value) |  |
| `--color-alpha-grey-40` | same | `#e1e4e566` | `#e1e4e566` | (own value) |  |
| `--color-alpha-grey-60` | same | `#e1e4e599` | `#e1e4e599` | (own value) |  |
| `--color-alpha-grey-80` | same | `#e1e4e5cc` | `#e1e4e5cc` | (own value) |  |
| `--color-alpha-white-0` | same | `#ffffff00` | `#ffffff00` | (own value) |  |
| `--color-alpha-white-20` | same | `#ffffff33` | `#ffffff33` | (own value) |  |
| `--color-alpha-white-40` | same | `#ffffff66` | `#ffffff66` | (own value) |  |
| `--color-alpha-white-50` | same | `#ffffff80` | `#ffffff80` | (own value) |  |
| `--color-alpha-white-60` | same | `#ffffff99` | `#ffffff99` | (own value) |  |
| `--color-alpha-white-80` | same | `#ffffffcc` | `#ffffffcc` | (own value) |  |
| `--color-gradient-ambient-0` | same (demo only) | `color-mix(ambient-100 …)` | `color-mix(ambient-100 …)` | demo only |  |
| `--color-gradient-ambient-20` | same (demo only) | `color-mix(ambient-100 …)` | `color-mix(ambient-100 …)` | demo only |  |
| `--color-gradient-ambient-40` | same (demo only) | `color-mix(ambient-100 …)` | `color-mix(ambient-100 …)` | demo only |  |
| `--color-gradient-ambient-60` | same (demo only) | `color-mix(ambient-100 …)` | `color-mix(ambient-100 …)` | demo only |  |
| `--color-gradient-ambient-80` | same (demo only) | `color-mix(ambient-100 …)` | `color-mix(ambient-100 …)` | demo only |  |
| `--color-gradient-default-0` | same | `#e1e4e500` | `#e1e4e500` | alpha-grey-0 |  |
| `--color-gradient-default-20` | same | `#e1e4e533` | `#e1e4e533` | alpha-grey-20 |  |
| `--color-gradient-default-40` | same | `#e1e4e566` | `#e1e4e566` | alpha-grey-40 |  |
| `--color-gradient-default-60` | same | `#e1e4e599` | `#e1e4e599` | alpha-grey-60 |  |
| `--color-gradient-default-80` | same | `#e1e4e5cc` | `#e1e4e5cc` | alpha-grey-80 |  |
| `--color-gradient-subtle-0` | same | `#ffffff00` | `#ffffff00` | alpha-white-0 |  |
| `--color-gradient-subtle-20` | same | `#ffffff33` | `#ffffff33` | alpha-white-20 |  |
| `--color-gradient-subtle-40` | same | `#ffffff66` | `#ffffff66` | alpha-white-40 |  |
| `--color-gradient-subtle-50` | same | `#ffffff80` | `#ffffff80` | alpha-white-50 |  |
| `--color-gradient-subtle-60` | same | `#ffffff99` | `#ffffff99` | alpha-white-60 |  |
| `--color-gradient-subtle-80` | same | `#ffffffcc` | `#ffffffcc` | alpha-white-80 |  |
| `--color-overlay-scrim-default` | same | `#00000033` | `#00000033` | alpha-black-20 |  |
| `--color-shadow-backdrop` | same | `#00012814` | `#00012814` | alpha-cold black-8 |  |
| `--color-shadow-default-1` | same | `#00012829` | `#00012829` | alpha-cold black-16 |  |
| `--color-shadow-default-2` | same | `#00012814` | `#00012814` | alpha-cold black-8 |  |
| `--color-shadow-focus-1` | same | `#00012829` | `#00012829` | alpha-cold black-16 |  |
| `--color-shadow-focus-2` | same | `#0001281f` | `#0001281f` | alpha-cold black-12 |  |
| `--color-shadow-subtle-1` | same | `#0001281f` | `#0001281f` | alpha-cold black-12 |  |
| `--color-shadow-subtle-2` | same | `#0001280f` | `#0001280f` | alpha-cold black-6 |  |

## Tag (component tokens, `--tag-color-*`) (18)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--tag-color-brand-bg-default` | **changed** | `#e4f0ff` | `#dbf8e0` | **green-100** (was brand-100) |  |
| `--tag-color-brand-bg-subtle` | **changed** | `#f3f8ff` | `#edfcf0` | **green-50** (was brand-50) |  |
| `--tag-color-brand-stroke-default` | **changed** | `#c8deff` | `#bcf2c7` | **green-200** (was brand-200) |  |
| `--tag-color-brand-text-default` | **changed** | `#3fa0f0` | `#2b8448` | **green-700** (was brand-500) | ● |
| `--tag-color-negative-bg-default` | same | `#ffe0e2` | `#ffe0e2` | negative-100 |  |
| `--tag-color-negative-bg-subtle` | same | `#fff5f5` | `#fff5f5` | negative-50 |  |
| `--tag-color-negative-stroke-default` | same | `#ffbfc3` | `#ffbfc3` | negative-200 |  |
| `--tag-color-negative-text-default` | same | `#ff0d19` | `#ff0d19` | negative-500 |  |
| `--tag-color-neutral-bg-alpha` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--tag-color-neutral-bg-default` | same | `#e0e3e5` | `#e0e3e5` | neutral-100 |  |
| `--tag-color-neutral-bg-inverse` | same | `#ffffff` | `#ffffff` | neutral-0 |  |
| `--tag-color-neutral-bg-subtle` | same | `#f2f3f4` | `#f2f3f4` | neutral-50 |  |
| `--tag-color-neutral-stroke-default` | same | `#cdd1d4` | `#cdd1d4` | neutral-150 |  |
| `--tag-color-neutral-text-default` | same | `#6a757d` | `#6a757d` | neutral-500 |  |
| `--tag-color-positive-bg-default` | **changed** | `#ddf8ee` | `#dbf8e0` | positive-100 |  |
| `--tag-color-positive-bg-subtle` | **changed** | `#f3fcf9` | `#edfcf0` | positive-50 |  |
| `--tag-color-positive-stroke-default` | **changed** | `#bdf1dd` | `#bcf2c7` | positive-200 |  |
| `--tag-color-positive-text-default` | **changed** | `#58e09a` | `#2b8448` | **green-700** (was positive-500) | ● |

## New tokens (11)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-ambient-300` | **new** | — | `#dfeee5` | **None** |  |
| `--color-navy-600` | **new** | — | `#304c8c` | **None** |  |
| `--color-navy-700` | **new** | — | `#0f2b74` | **None** |  |
| `--color-navy-800` | **new** | — | `#0a1a4a` | **None** |  |
| `--color-navy-900` | **new** | — | `#000128` | **None** |  |
| `--color-navy-950` | **new** | — | `#00011a` | **None** |  |
| `--color-overlay-shade` | **new** | — | `#00011a` | **navy-950** — The navy shade over photos and the sprout (key visual) |  |
| `--color-surface-device-mist` | **new** | — | `#dfeee5` | **ambient-300** — Brand device (sprout) on Mist |  |
| `--color-surface-device-navy` | **new** | — | `#0a1a4a` | **navy-800** — Brand device (sprout) on navy |  |
| `--color-text-brand-inverse` | **new** | — | `#5cd680` | **green-500** — Green accent text on navy (rate, one green word in a headline) |  |
| `--color-text-link-inverse` | **new** | — | `#5cd680` | **green-500** — Links on navy |  |

## Removed tokens (49)

| token | status | before | after | points to | pending |
|---|---|---|---|---|:-:|
| `--color-alpha-blue-0` | **removed** | `#3fa0f000` | — | shadow/glow: alpha-cold-black-* · fill: action-bg-primary-subtle(-pressed) |  |
| `--color-alpha-blue-20` | **removed** | `#3fa0f033` | — | shadow/glow: alpha-cold-black-* · fill: action-bg-primary-subtle(-pressed) |  |
| `--color-alpha-blue-40` | **removed** | `#3fa0f066` | — | shadow/glow: alpha-cold-black-* · fill: action-bg-primary-subtle(-pressed) |  |
| `--color-alpha-blue-50` | **removed** | `#3fa0f080` | — | shadow/glow: alpha-cold-black-* · fill: action-bg-primary-subtle(-pressed) |  |
| `--color-alpha-blue-60` | **removed** | `#3fa0f099` | — | shadow/glow: alpha-cold-black-* · fill: action-bg-primary-subtle(-pressed) |  |
| `--color-alpha-blue-80` | **removed** | `#3fa0f0cc` | — | shadow/glow: alpha-cold-black-* · fill: action-bg-primary-subtle(-pressed) |  |
| `--color-blue-50` | **removed** | `#f3f8ff` | — | use ambient-50 |  |
| `--color-blue-100` | **removed** | `#e4f0ff` | — | use ambient-100 |  |
| `--color-blue-200` | **removed** | `#c8deff` | — | use ambient-200 |  |
| `--color-blue-300` | **removed** | `#9fc6fa` | — | use ambient-300 |  |
| `--color-blue-400` | **removed** | `#74b2f5` | — | use navy-600 |  |
| `--color-blue-500` | **removed** | `#3fa0f0` | — | use navy-800 |  |
| `--color-blue-600` | **removed** | `#2c74be` | — | use navy-900 (primary action: action-bg-primary-default) |  |
| `--color-blue-700` | **removed** | `#20558d` | — | use navy-950 (pressed action: action-bg-primary-pressed) |  |
| `--color-blue-800` | **removed** | `#173d67` | — | use navy-900 |  |
| `--color-blue-900` | **removed** | `#102950` | — | use navy-900 |  |
| `--color-blue-950` | **removed** | `#000128` | — | use navy-900 (same value) |  |
| `--color-marketing-50` | **removed** | `#fdf2f6` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-100` | **removed** | `#fce7ef` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-200` | **removed** | `#f9c2d9` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-300` | **removed** | `#f48fb5` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-400` | **removed** | `#e8528f` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-500` | **removed** | `#d93a78` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-600` | **removed** | `#b82a61` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-marketing-700` | **removed** | `#8c1f49` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-50` | **removed** | `#fdf2f6` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-100` | **removed** | `#fce7ef` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-200` | **removed** | `#f9c2d9` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-300` | **removed** | `#f48fb5` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-400` | **removed** | `#e8528f` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-500` | **removed** | `#d93a78` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-600` | **removed** | `#b82a61` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-pink-700` | **removed** | `#8c1f49` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-50` | **removed** | `#fff7e8` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-100` | **removed** | `#ffecc2` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-200` | **removed** | `#ffd98a` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-300` | **removed** | `#ffbe45` | — | positive-300 (only use: PageLoading dot) — see DEV-HANDOFF |  |
| `--color-warning-400` | **removed** | `#f59e0b` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-500` | **removed** | `#d98e0a` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-600` | **removed** | `#c27a07` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-warning-700` | **removed** | `#a66205` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-50` | **removed** | `#fff7e8` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-100` | **removed** | `#ffecc2` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-200` | **removed** | `#ffd98a` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-300` | **removed** | `#ffbe45` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-400` | **removed** | `#f59e0b` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-500` | **removed** | `#d98e0a` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-600` | **removed** | `#c27a07` | — | none (legacy; not used in phi_h5_025/src) |  |
| `--color-yellow-700` | **removed** | `#a66205` | — | none (legacy; not used in phi_h5_025/src) |  |
