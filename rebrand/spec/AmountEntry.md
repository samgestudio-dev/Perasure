# AmountEntry

Figma: component set `11064:2482` (06 · Product cards `10982:21`) · 3 variants · showcase `11064:2566`
The amount as it is typed on the keypad page ("Apply a loan" → Enter amount). Demo `PS.AmountEntry` (its top half; the term Chips and the
keypad sit under it on the screen).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Empty · Typing · Error | — | Empty = `typed:''`; Error = `error` set |
| Typed | TEXT | | "12,5" | `typed` (the digits typed so far, comma where it will sit in the whole amount: "12,5" + "00" = ₱12,500) |
| Hint | TEXT (Empty, Typing) | | "Flexible amounts from ₱500–₱40,000" | `hint` |
| (text, Error variant) | | | "Enter an amount from ₱500 to ₱40,000." | `error` |
| — | | | | `amount` (for screen readers), `label`, `terms`, `term`, `onTerm`, `onKey` |

## Parts and tokens

Card: vertical, width **343**, fill `var(--surface-default)`, radius `var(--radius-card)`, padding `var(--spacing-padding-2xl)` top/bottom,
`var(--spacing-padding-lg)` left/right, gap `var(--spacing-gap-lg)`.

| Part | Token |
|---|---|
| Label | `.ps-t-body-md-strong`, `var(--content-secondary)` |
| Number | row, bottom-aligned, 44 tall |
| ₱ | `.ps-t-amount-lg`, `var(--content-disabled)`, then a `var(--spacing-gap-sm)` gap |
| Typed | `.ps-t-amount-xxl`, `var(--content-primary)` (hidden when nothing is typed) |
| Caret | 2 × 44, `var(--content-brand)`, blinks (1.06 s steps) |
| Rest "00" | `.ps-t-amount-xxl`, `var(--content-disabled)` (the amount is typed in hundreds) |
| ".00" | `.ps-t-amount-xs`, `var(--content-disabled)` |
| Hint | `.ps-t-body-md`, `var(--content-placeholder)`; Error: `var(--content-negative)` |

## States

| # | Props |
|---|---|
| 0 | `typed:'', hint:'Flexible amounts from ₱500–₱40,000'` |
| 1 | `typed:'12,5', amount:12500, hint:'Flexible amounts from ₱500–₱40,000'` |
| 2 | `typed:'45,0', amount:45000, error:'Enter an amount from ₱500 to ₱40,000.'` |

## Phase 1 · legacy geometry (2026-11-19)

Matches legacy 9426:18067: 312 wide, no card, padding 32 / 0, gap 16; number row ₱ + 8 + (typed + 2 + 1 px caret + 2 + "00") + 4 + ".00" (9426:18069).
