# SendingCard

Figma: component `11066:2509` (06 · Product cards `10982:21`) · showcase `11066:2619`
The security code is on its way (Log in → Sending code). Replaces the legacy Sending Code card (demo `PS.SendingCard`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Title | TEXT | | "Sending security code…" | `title` |
| Body | TEXT | | "This may take a few seconds" | `body` |

## Parts and tokens

Card: vertical, width **292**, centred on the page, fill `var(--surface-default)`, radius `var(--radius-xl)`, padding
`var(--spacing-padding-xl)` top/bottom, `var(--spacing-padding-lg)` left/right, items centred.

| Part | Token |
|---|---|
| Illustration | 120 × 120, the "Loading state OTP" animation (Figma: the legacy still, unchanged; demo `PS.Anim name:'loading-state-otp' size:120`) |
| Text | vertical, gap `var(--spacing-gap-xs)`, centred |
| Title | `.ps-t-title-md`, `var(--content-primary)` |
| Body | `.ps-t-body-md`, `var(--content-tertiary)` |

## States

| # | Props |
|---|---|
| 0 | `title:'Sending security code…', body:'This may take a few seconds'` |

## Phase 1 · legacy geometry (2026-11-19)

Matches legacy 3282:181 (292 × 212); title "Sending security code..." as legacy.
