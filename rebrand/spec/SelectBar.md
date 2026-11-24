# SelectBar

Figma: component set `11009:954` (03 · Inputs `10982:18`) · 8 variants · showcase `11009:1032`
One option of a single-choice list (withdrawal method, bank, reason). Replaces both legacy Select bars. The whole row is the tap target.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Style | VARIANT | Card · Plain | Card | `plain` boolean (Plain = no card, reason lists) |
| State | VARIANT | Default · Selected · Pressed · Disabled | Default | `on` (selected), `disabled`; gallery `state` |
| Label | TEXT | | "PayMaya" | `label` |
| Logo | BOOLEAN | | false | shown when `logo` is set |
| Logo image | INSTANCE_SWAP | GCash, PayMaya, Coins.ph, GrabPay, ShopeePay, BPI, BDO, Landbank, Metrobank, UnionBank | PayMaya | `logo` (18 px in Figma = legacy; the app's 24 px rule is Phase 2; never recoloured) |
| Note | BOOLEAN | | false | shown when `note` is set |
| Note text | TEXT | | "Supports ₱50k+ Loans" | `note` |

## Parts and tokens

Horizontal, width **343** fixed (Fill in layouts), items centred. Parts: Radio · [Logo] · Label (fills, ends with …) · [Note].

| Part | Property | Token |
|---|---|---|
| root | min-height | Card **46** · Plain 44 |
| root | padding left/right · top/bottom | `var(--spacing-padding-lg)` 16 · `var(--spacing-padding-md)` 12 |
| root | gap | `var(--spacing-gap-sm)` 8 |
| root | radius | Card `var(--radius-xl)` 24 · Plain `var(--radius-none)` |
| Radio | **Check** (Size=Small) instance: Default/Pressed → Off · Selected → On · Disabled → Disabled | see Check.md |
| Logo | 18 × 18 (legacy) | |
| Label | `.ps-t-body-md`; Selected `.ps-t-body-md-strong` | |
| Note | `.ps-t-caption-xs`, right aligned | |

| Style · State | Fill | Ring | Label | Note |
|---|---|---|---|---|
| Card · Default | `var(--surface-default)` | — | `var(--content-tertiary)` | `var(--content-tertiary)` |
| Card · Selected | `var(--surface-default)` | `var(--border-selected)`, `var(--stroke-width-medium)` 1.5, inside | `var(--content-brand)` | `var(--content-brand-subtle)` |
| Card · Pressed | `var(--surface-sunken)` | — | `var(--content-tertiary)` | `var(--content-tertiary)` |
| Card · Disabled | `var(--surface-default)` | — | `var(--content-disabled)` | `var(--content-disabled)` · logo opacity `var(--opacity-disabled)` |
| Plain · Default / Selected / Disabled | none | — | as Card | as Card |
| Plain · Pressed | `var(--surface-sunken)` | — | `var(--content-tertiary)` | `var(--content-tertiary)` |

## States

| # | Group | Props |
|---|---|---|
| 0 | Withdrawal method — Card | `on:true, label:'GCash', logo:'gcash'` |
| 1 | Withdrawal method — Card | `label:'PayMaya', logo:'paymaya', note:'Supports ₱50k+ Loans'` |
| 2 | Withdrawal method — Card | `state:'pressed', label:'Coins.ph', logo:'coins'` |
| 3 | Withdrawal method — Card | `disabled:true, label:'GrabPay', logo:'grabpay', note:'Not available now'` |
| 4 | Reason list — Plain | `plain:true, on:true, label:'I found a better offer'` |
| 5 | Reason list — Plain | `plain:true, label:'I no longer need a loan'` |
| 6 | Reason list — Plain | `plain:true, disabled:true, label:'Other reason'` |

## Phase 1 · legacy geometry (2026-11-19)

Style=Card = 46 tall, stroke out of layout (legacy Select bar 5762:11160 / 5680:9442 = 328 × 46; the report asked 48, legacy decides).

2026-11-20: the Card hugged to 48 once the 24 px logo was shown, so withdrawal-method rows drifted 2 px each (Method-ewallet 5588:5243). Logo is now 18 (legacy) and Card has min-height 46 + hug: rows pitch 58 as in legacy.
