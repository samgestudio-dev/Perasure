# Field

Figma: component set `11009:437` (03 · Inputs `10982:18`) · 10 variants · showcase `11009:489`
Replaces legacy Phone number typing, Typing box / one box per page, Typing box / multiple boxes. (Demo today: `PS.Field` = Floating,
`PS.FormField` = Stacked — one component with `layout` in the rebrand.)
Rule (owner): the phone number of Log in / Change phone number is **PhoneField**, not Field. Phone numbers inside forms (trusted
contact) use Field.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Layout | VARIANT | Floating · Stacked | Floating | `layout: 'floating' \| 'stacked'` |
| State | VARIANT | Default · Focus · Filled · Error · Disabled | Default | demo: derived (focus, value, `error`, `disabled`); gallery: `state` |
| Label | TEXT | | "Phone number" | `label` |
| Placeholder | TEXT | shown in Default / Disabled | "Enter your phone number" | `placeholder` |
| Value | TEXT | shown in Focus / Filled / Error | "999 999 9999" | `value` |
| Message | BOOLEAN | | false | shown when `hint` or `error` is set |
| Message text | TEXT | | "This field is required" | `hint` / `error` |
| Prefix | BOOLEAN | | false | shown when `prefix` is set |
| Prefix text | TEXT | | "+63" | `prefix` |
| Trailing icon | BOOLEAN | | false | shown when `icon` is set (picker → chevron) |
| Icon | INSTANCE_SWAP | preferred: Chevron right, Close (clear), Calendar, Help circle | Icon / Chevron right | `icon` |

## Parts and tokens

Root: vertical, width **343** fixed (Fill in layouts), gap `var(--spacing-gap-xs)` 4. Parts top → bottom: [Label row (Stacked)] · Box · [Message row].

| Part | Property | Floating | Stacked |
|---|---|---|---|
| Label row | padding left/right | — | `var(--spacing-padding-sm)` 8 |
| Label (stacked) | text style | — | `.ps-t-caption-sm` (sentence case — see Open) |
| Box | min-height | **56** (fixed number) | `var(--size-control-md)` 44 |
| Box | padding left/right · top/bottom | `var(--spacing-padding-lg)` 16 · `var(--spacing-padding-sm)` 8 | same |
| Box | gap | `var(--spacing-gap-sm)` 8 | same |
| Box | radius | `var(--radius-xl)` 24 | `var(--radius-lg)` 20 |
| Main | gap Label → value | `var(--spacing-gap-2xs)` 2 | — |
| Label (floating) | text style | `.ps-t-caption-xs` | — |
| Prefix | `.ps-t-body-md`, `var(--content-secondary)` (Disabled: `--content-disabled`) | | same |
| Placeholder | `.ps-t-body-md`, `var(--content-placeholder)` (Disabled: `--content-disabled`) | | same |
| Value | text style | `.ps-t-body-md` 14/20 (legacy size; 16 px is a Phase 2 readability option) | same |
| Value | colour | `var(--content-primary)` | same |
| Caret (Focus only) | 2 × 20, `var(--border-focused)` | | same |
| Trailing icon | 16 × 16, `var(--content-tertiary)`; Disabled: opacity `var(--opacity-disabled)` | | same |
| Message row | padding left/right | `var(--spacing-padding-lg)` 16 | `var(--spacing-padding-sm)` 8 |
| Message | `.ps-t-caption-sm`; hint `var(--content-tertiary)`, Error `var(--content-negative)` | | same |

| State | Box fill | Box ring (inside) | Label colour |
|---|---|---|---|
| Default | `var(--surface-default)` | `var(--border-control)`, `var(--stroke-width-default)` 1 | `var(--content-tertiary)` |
| Focus | `var(--surface-default)` | `var(--border-focused)`, `var(--stroke-width-focus)` 2 | `var(--content-brand)` |
| Filled | `var(--surface-default)` | `var(--border-control)`, 1 | `var(--content-tertiary)` |
| Error | `var(--surface-default)` | `var(--border-negative)`, `var(--stroke-width-focus)` 2 | `var(--content-tertiary)` |
| Disabled | `var(--surface-default)` | `var(--border-subtle)`, 1 | `var(--content-disabled)` |

Floating box: label 14 + 2 + value 20 = 36, centred in the 56 box (label at +10, value at +26, as legacy 5588:5261). Stacked box: value 20 centred in min-height 44.

## States

| # | Group | Props |
|---|---|---|
| 0 | Floating — account number | `layout:'floating', state:'default', label:'Account number', placeholder:'Enter your account number'` |
| 1 | Floating — account number | `…, state:'focus', value:'1234 5678 9012'` |
| 2 | Floating — account number | `…, state:'filled', value:'1234 5678 9012'` |
| 3 | Floating — account number | `…, state:'error', value:'1234 56AB', error:'Please enter numbers only'` |
| 4 | Floating — account number | `…, state:'disabled'` |
| 5 | Picker · Stacked | `layout:'floating', state:'filled', label:'Bank name', value:'ABC Bank', icon:'chevron-right'` |
| 6 | Picker · Stacked | `layout:'stacked', state:'default', label:'Email address', placeholder:'name@example.com'` |
| 7 | Picker · Stacked | `layout:'stacked', state:'focus', label:'Email address', value:'juan.delacruz@gmail', icon:'close'` |
| 8 | Picker · Stacked | `layout:'stacked', state:'error', label:'Phone number', value:'99999', error:'This field is required'` |
| 9 | Picker · Stacked | `layout:'stacked', state:'filled', label:'Birthday', value:'12 / 05 / 1994', icon:'calendar'` |
(states 0–4 share label 'Account number' and placeholder 'Enter your account number'.)

Open: the stacked label is upper case in the demo / legacy; a text-case override detaches the Figma text style, so Figma shows sentence
case until an upper-case caption style exists (asked the coordinator).

## Phase 1 · legacy geometry (2026-11-19)

Floating = 56 (legacy Phone number typing 3279:152): the Box stroke is out of layout. Stacked labels stay sentence case (legacy forms: "First name").

### 2026-11-20 · inputs back to legacy 14/20 (Android only)

Android only (owner, 2026-11-19): Phase 1 keeps the legacy sizes; prefix, placeholder and value are `Body/md` 14/20 as in every legacy input (Typing box 5588:5261, Phone number 3279:152). The earlier 16 px came from the iOS input-zoom rule, which does not apply on Android; 16 px stays a Phase 2 readability option. Touch target on Android: ≥ 48 dp (Phase 2; the box is already 56).

## 2026-11-20 · Clear icon, Application Details states

- New boolean `Clear` (all 10 variants): legacy Close circle filled 20 px before the trailing icon (legacy typing boxes show it while typing: withdrawal methods, ID number). The maps turn it on when the legacy clear icon is visible.
- Legacy multi typing box 3919:1405 (64 tall, label row above) maps to Layout=Stacked in every state (only Typing did before, so Application Details forms were 54 px short).
- Legacy Empty (required, no value) → State=Default + Message on, message Content/Negative, placeholder shown (no red border, as legacy); legacy Error → State=Error + message. Label text case copied from legacy (UPPER on Application Details). Calendar trailing icon (5712:9040) copied when legacy shows it.
- Legacy Typing box placeholder text (Neutral/150) → State=Default with Placeholder (was Filled).

## 2026-11-20 · No border at rest (phase 1)

Legacy fields are borderless white pills, so the 1 px Border/Control ring at rest was a visible design change (the "v2 Field border" in
the overlays). Now: Default, Filled and Disabled have **no border**; Focus (Border/Focused 2) and Error (Border/Negative 2) keep their ring
as the coordinator asked. Note: legacy shows no ring on focus or error either (checked on 5588:5243, 5588:5261, 5591:6039, 3924:1492:
no stroke anywhere in the legacy typing boxes) — the ring there is a coordinator decision. Placeholder = `Palette/Neutral/150`
(legacy Color/Neutral/150), lighter than Content/Placeholder. The 3:1 control-border rule is on the Phase 2 list.

## 2026-11-20 (later) · No ring in any state

Coordinator: phase 1 follows legacy state by state. The legacy typing boxes (3919:1405 all 5 states, 5933:8750 all 5 states) have no
stroke or effect on the box in any state — only icon vectors carry strokes; Focus ("Typing" / Variant5) and Error have no ring either. So
Focus and Error now have no ring; the error shows through the red message only (and, for the legacy Error state, the State=Error variant
keeps its message). Phase 2: focus visibility needs a decision (with the 3:1 control-border rule). The earlier Phase 2 note 23 ("Error = red
border + message") was wrong — that border came from our Field, not from legacy.
