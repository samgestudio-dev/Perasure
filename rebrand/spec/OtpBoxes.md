# OtpBoxes

Figma: component set `11009:1031` (03 · Inputs `10982:18`) · 5 variants · showcase `11009:1228`
Building block `.OtpBox`: component set `11009:965` · 5 variants (hidden from the assets panel).
The 6-digit security code. Replaces the OTP use of the legacy typing boxes. App: six boxes over one hidden numeric input (`one-time-code`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Empty · Typing · Filled · Error · Disabled | Empty | derived from `value` length, focus, `error`, `disabled`; gallery `state` |
| (each box, exposed) Digit | TEXT | | "4" | from `value` |
| `.OtpBox` State | VARIANT | Empty · Filled · Active · Error · Disabled | | per box |

Mapping (as the demo): Typing = boxes before the last typed digit Filled, the box of the last digit Active, the rest Empty.

## Parts and tokens

OtpBoxes: horizontal, gap `var(--spacing-gap-sm)` 8, 6 boxes → **328 × 60**.

`.OtpBox`: **48 × 60** fixed, content centred, radius `var(--radius-md)` 16, ring `var(--stroke-width-strong)` 2 inside, digit `.ps-t-title-md`.

| Box state | Fill | Ring | Digit | Effect |
|---|---|---|---|---|
| Empty | `var(--surface-default)` | `var(--border-subtle)` | hidden | |
| Filled | `var(--surface-default)` | `var(--border-filled)` | `var(--content-primary)` | |
| Active | `var(--surface-default)` | `var(--border-focused)` | `var(--content-brand)` | `var(--elevation-focus)` |
| Error | `var(--surface-default)` | `var(--border-negative)` | `var(--content-primary)` | |
| Disabled | `var(--surface-default)` | `var(--border-subtle)` | hidden | |

## States

| # | Props |
|---|---|
| 0 | `value:''` (Empty) |
| 1 | `value:'482'`, focused (Typing: 4 · 8 Filled, 2 Active) |
| 2 | `value:'482916'` (Filled) |
| 3 | `value:'482916', error:true` (Error) |
| 4 | `disabled:true` (Disabled) |

Motion (demo, existing): a digit pops in (scale 0.6 → 1, opacity, 0.18 s).
