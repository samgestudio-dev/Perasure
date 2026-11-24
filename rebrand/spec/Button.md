# Button

Figma: component set `10987:225` (01 · Actions `10982:16`) · 30 variants · showcase `10987:226`
Replaces legacy CTA, Resend btn, Exist account btn, Popover btn, delete my account/CTA, FAQS/feedback btn, Calendar/button.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Variant | VARIANT | Primary · Secondary · Text · Destructive · Navy | Primary | `variant: 'primary' \| 'secondary' \| 'text' \| 'destructive' \| 'navy'` |
| Size | VARIANT | Large · Small | Large | `size: 'large' \| 'small'` |
| State | VARIANT | Default · Pressed · Disabled | Default | `state: 'default' \| 'pressed' \| 'disabled'` (app: `disabled` boolean; pressed = tap) |
| Label | TEXT | | "Continue" | `label` (children) |
| Subtitle | BOOLEAN | | false | `subtitle` shown when a string is passed |
| Subtitle text | TEXT | | "Supporting text" | `subtitle: string` |
| Leading icon | BOOLEAN | | false | shown when `icon` is set |
| Icon | INSTANCE_SWAP | preferred: Check, Chevron right, add, reload, Copy, Upload, Info circle | Icon / Check | `icon: string` |
| Loading | BOOLEAN | | false | `loading` (spinner before the label; button not pressable) |

Rules: one Primary per screen; Navy only on a green surface; Destructive kept apart from other actions; width hugs, block = full width.

## Parts and tokens

Layout: horizontal auto layout, centred, `min-height` Large `var(--size-control-lg)` **48** / Small `var(--size-control-sm)` **36**; children: Spinner · Icon · Text (Label over Subtitle).

| Part | Property | Large | Small |
|---|---|---|---|
| root | padding top/bottom | `var(--spacing-padding-sm)` 8 | `var(--spacing-padding-sm)` 8 |
| root | padding left/right | `var(--spacing-padding-xl)` 20 | `var(--spacing-padding-md)` 12 |
| root | gap | `var(--spacing-gap-xs)` 4 | same |
| root | radius | `var(--radius-full)` | same |
| root | border (Secondary only) | `var(--stroke-width-default)` 1, inside | same |
| Text | gap Label → Subtitle | `var(--spacing-gap-2xs)` 2 | same |
| Label | text style | `.ps-t-label-md` (Label/md) | same |
| Subtitle | text style | `.ps-t-caption-sm` (Caption/sm) | same |
| Spinner | size | 16 × 16 ring (arc 270°, inner radius 72 %), colour = label colour | same |
| Icon | size | 16 × 16, colour = label colour | same |

Colours (fill / border / label; subtitle = label unless noted; spinner and icon = label):

| Variant · State | Fill | Border | Label | Subtitle |
|---|---|---|---|---|
| Primary · Default | `var(--bg-action)` [Bg/Action/Default] | — | `var(--content-on-action)` [Content/On-action] | = label |
| Primary · Pressed | `var(--bg-action-pressed)` [Bg/Action/Pressed] | — | `var(--content-on-action)` | = label |
| Primary · Disabled | `var(--bg-disabled)` [Bg/Disabled] | — | `var(--content-disabled)` [Content/Disabled] | = label |
| Secondary · Default | `var(--surface-default)` [Surface/Default] | `var(--border-selected)` [Border/Selected/Default] | `var(--content-brand)` [Content/Brand/Default] | `var(--content-tertiary)` |
| Secondary · Pressed | `var(--surface-sunken)` [Surface/Sunken] | `var(--border-selected)` | `var(--content-brand)` | `var(--content-tertiary)` |
| Secondary · Disabled | `var(--surface-default)` | `var(--border-subtle)` [Border/Subtle] | `var(--content-disabled)` | = label |
| Text · Default | none | — | `var(--content-brand)` | `var(--content-tertiary)` |
| Text · Pressed | `var(--surface-sunken)` | — | `var(--content-brand)` | `var(--content-tertiary)` |
| Text · Disabled | none | — | `var(--content-disabled)` | = label |
| Destructive · Default | `var(--bg-negative)` [Bg/Negative/Default] | — | `var(--content-inverse)` | = label |
| Destructive · Pressed | `var(--bg-negative-pressed)` [Bg/Negative/Pressed] | — | `var(--content-inverse)` | = label |
| Destructive · Disabled | `var(--bg-disabled)` | — | `var(--content-disabled)` | = label |
| Navy · Default | `var(--surface-brand)` [Surface/Brand/Default] | — | `var(--content-inverse)` | = label |
| Navy · Pressed | `var(--bg-brand-pressed)` [Bg/Brand/Pressed] | — | `var(--content-inverse)` | = label |
| Navy · Disabled | `var(--bg-disabled)` | — | `var(--content-disabled)` | = label |


## States (showcase order = gallery order)

| # | Group | Props |
|---|---|---|
| 0 | Primary | `variant:'primary', size:'large', state:'default', label:'Check your limit'` |
| 1 | Primary | `…primary, large, state:'pressed', label:'Check your limit'` |
| 2 | Primary | `…primary, large, state:'disabled', label:'Check your limit'` |
| 3 | Primary | `…primary, large, state:'default', loading:true, label:'Submitting…'` |
| 4 | Two-line · Secondary | `variant:'secondary', size:'large', label:'Log in to your existing account', subtitle:'Continue with your previous account'` |
| 5 | Two-line · Secondary | `variant:'secondary', size:'large', label:'Try again'` |
| 6 | Two-line · Secondary | `variant:'secondary', size:'large', state:'disabled', label:'Try again'` |
| 7 | Destructive · Text | `variant:'destructive', size:'large', label:'Close my account'` |
| 8 | Destructive · Text | `variant:'destructive', size:'large', state:'disabled', label:'Close my account'` |
| 9 | Destructive · Text | `variant:'text', size:'large', label:'Cancel'` |
| 10 | Destructive · Text | `variant:'text', size:'large', state:'pressed', label:'Yes'` |
| 11 | Navy on green (row on `var(--bg-action)`, padding 16 / 12, radius `--radius-sm`) | `variant:'navy', size:'large', label:'Withdraw now'` |
| 12 | Navy on green | `variant:'navy', size:'large', state:'pressed', label:'Withdraw now'` |
| 13 | Small | `variant:'primary', size:'small', label:'Resend code'` |
| 14 | Small | `variant:'primary', size:'small', state:'disabled', label:'Resend code after 59s'` |
| 15 | Small | `variant:'secondary', size:'small', icon:'add', label:'Enter manually'` |
| 16 | Small | `variant:'text', size:'small', label:'Confirm'` |

## Phase 1 · legacy geometry (2026-11-19)

New Size=Medium (15 variants): padding 12 / 12, min 44 — the legacy in-card buttons (PaymentCard pay 10545:40950 "Frame 5", offer 9497:29633, popover button 5911:9659). Large stays 48 (legacy Bottom nav btn 3269:311). Where legacy uses a 16 px label (CreditCard Withdraw 10926:30158) the instance label uses Title/xs → 46. Showcase "navy on green" row padding 12.

## 2026-11-20 · BRIEF 24 · Variant=Neutral
New variant **Neutral** in Large / Medium / Small × Default / Pressed / Disabled (Figma `11218:4557`–`11218:4605`).

| State | Fill | Border | Label / icon |
|---|---|---|---|
| Default | `var(--bg-neutral-default)` (neutral-100) | none | `var(--content-primary)` |
| Pressed | `var(--bg-neutral-strong)` | none | `var(--content-primary)` |
| Disabled | `var(--bg-disabled)` | none | `var(--content-disabled)` |

Rule: a secondary button that sits **in a row next to a primary** (two-button rows in sheets, dialogs, result pages, bottom bars) uses
Neutral. A secondary on its own keeps the outlined Secondary. React: `variant: 'neutral'`.

## 2026-11-20 · BRIEF 34 · Variant=Plain
New variant **Plain** in Large / Medium / Small × Default / Pressed / Disabled (Figma `11268:4645`–`11268:4693`; component-property bindings
copied from Secondary, 4 per variant).

| State | Fill | Border | Label / icon |
|---|---|---|---|
| Default | `var(--surface-default)` (white) | none | `var(--content-primary)` |
| Pressed | `var(--bg-neutral-default)` | none | `var(--content-primary)` |
| Disabled | `var(--bg-disabled)` | none | `var(--content-disabled)` |

Use: the Account "Log Out" button (a lone action on a page that should not draw an outline). Other lone secondaries keep the outlined
Secondary for now. React: `variant: 'plain'`.
