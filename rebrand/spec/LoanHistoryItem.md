# LoanHistoryItem

Figma: component set `11259:22291` (06 · Product cards) · 2 variants. Built from legacy `Installment` 6619:22073 (Phase 1, legacy layout).
A loan-history row: amount + tag + chevron, on a card surface (328 × 56). Demo: loan history list.

## Props

| Figma property | Type | Values | React prop |
|---|---|---|---|
| Kind | VARIANT | History (`Kind=History` 11259:22289) · State (`Kind=State` 11259:22290) | `kind: 'history' \| 'state'` |

## Parts and tokens

| Part | Token |
|---|---|
| Card | `var(--surface-default)`, radius as legacy (card), padding 16 |
| Amount | legacy 18 px → `Title/sm` (18/24 700), `var(--content-primary)` |
| Tag (History) | Tag Size=Small, Tone=Navy, Subtle — term ("12 terms"); legacy Term tag 5813:15725 |
| Tag (State) | Tag Size=Medium — Reviewing: Navy Subtle · Disbursing: Accent Strong (green-500 + navy text) · Not approved / Paid off: Neutral Subtle · Action needed: Navy Strong (legacy State tag 6619:22092) |
| Chevron | legacy `Icon / Chevron right` (16), `var(--content-tertiary)` |

States: none interactive in Phase 1 (row press is Phase 2).
