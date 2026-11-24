# PhoneField

Figma: component set `11018:830` (03 · Inputs `10982:18`) · 6 variants · showcase `11018:831`
Demo twin: `PS.PhoneField`. Replaces legacy Phone number typing (`3279:127`), keeping its look (separate country pill + number pill,
white on the page colour, no border, digits grouped 3-3-4).

**Rule (owner, 2026-11-19):** PhoneField is used only on the Log in and Change phone number pages, where it is the only interactive
element on the page — so it is prominent and stands on its own. Phone numbers inside forms (e.g. the trusted contact) use the normal Field.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Default · Focus · Filled · Error-empty · Error · Disabled | Default | derived: focus, `value`, `error`, `disabled` (Error-empty = error with no value); gallery `state` |
| Label | TEXT | | "Phone number" | `label` |
| Placeholder | TEXT | | "Enter your phone number" | `placeholder` |
| Country code | TEXT | | "+63" | `code` (static, PH only) |
| Digits 1 / 2 / 3 | TEXT | | "917" / "123" / "4567" | from `value`, split 3-3-4 |
| Message | BOOLEAN | | false | shown when `error` is set |
| Message text | TEXT | | "This field is required" | `error` |

## Parts and tokens

Root: horizontal, width **343** (Fill), gap `var(--spacing-gap-md)` 12, top-aligned. Parts: Country pill · Number column (fills) = Number
pill + Message row (gap `var(--spacing-gap-sm)` 8).

| Part | Property | Token |
|---|---|---|
| Country pill, Number pill | height | **64** (owner design, BRIEF 13; legacy 3279:152 is 56) |
| both pills | padding left/right | `var(--spacing-padding-lg)` 16 (top/bottom `--spacing-padding-none`, content centred) — 16 so the 16 px placeholder fits at the legacy 328 width |
| both pills | radius | `var(--radius-full)` |
| both pills | fill | `var(--surface-default)` (Disabled too) |
| Country pill | gap flag → code | `var(--spacing-gap-sm)` 8 |
| Flag | 24 × 24,  PH flag image; Disabled opacity `var(--opacity-disabled)` 40 % | |
| Country code | `.ps-t-body-lg` 16/24, `var(--content-secondary)` (Disabled `--content-disabled`) | |
| Main (in number pill) | vertical, gap `var(--spacing-gap-xs)` 4, centred (label at +10, value at +30) | |
| Label | `.ps-t-caption-sm` 12/16, `var(--content-tertiary)`; Focus `var(--content-brand)`; Disabled `--content-disabled` | |
| Value row | horizontal, gap `var(--spacing-gap-xs)` 4: Group 1 · Group 2 · Group 3 · caret | |
| Groups | `.ps-t-body-lg-strong` 16/24, `var(--content-primary)` | |
| Placeholder | `.ps-t-body-lg` 16/24, `var(--content-placeholder)` (Disabled `--content-disabled`) | |
| Caret (Focus) | 2 × 24, `var(--border-focused)` | |
| Number pill ring | none at rest; Focus `var(--border-focused)`, Error / Error-empty `var(--border-negative)`; width `var(--stroke-width-focus)` 2, inside | |
| Message row | padding left/right `var(--spacing-padding-lg)` 16 (starts at the number's text inset) | |
| Message | `.ps-t-caption-sm`, `var(--content-negative)` | |

| State | Shows | Number pill ring | Label |
|---|---|---|---|
| Default | placeholder | — | tertiary |
| Focus | groups + caret | `--border-focused` 2 | `--content-brand` |
| Filled | groups | — | tertiary |
| Error-empty | placeholder | `--border-negative` 2 | tertiary |
| Error | groups | `--border-negative` 2 | tertiary |
| Disabled | placeholder `--content-disabled`, "+63" `--content-disabled`, pills stay `--surface-default`, flag opacity `--opacity-disabled` | — | disabled |

## States

| # | Caption | Props |
|---|---|---|
| 0 | Default | `value:''` |
| 1 | Focus — typing | `value:'9171234567'`, focused |
| 2 | Filled | `value:'9171234567'` |
| 3 | Error — empty | `value:'', error:'This field is required'` |
| 4 | Error — filled | `value:'91712345A7', error:'Please enter numbers only'` (groups 917 · 123 · 45A7) |
| 5 | Disabled | `disabled:true` |

## Owner design restored (2026-11-20)

The Android-only rule does **not** apply to PhoneField (BRIEF 13, coordinator 2026-11-20): it is the owner's one-job component — 64 tall,
separate pills, gap 12, value 16 px grouped 3-3-4, no border at rest. The 56 / 14 / gap 2 version of the morning is withdrawn. Field and
Search stay at the legacy 14. Pill side padding is 16 (was 20) because at the legacy 328 width the 16 px placeholder "Enter your phone number"
(184) did not fit in 177. Login's "No longer have access" link sits 8 px lower than legacy — accepted owner-decision difference.
