# EmptyState

Figma: component set `11044:1917` (06 · Product cards `10982:21`) · 2 variants · showcase: component set (old showcase frame gone)
What a list or page shows when there is nothing yet. Replaces legacy Page empty state (demo `PS.EmptyState`, `PS.Fallback`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Action | VARIANT | Off · On | Off | `children` (a button) |
| Title | TEXT | | "No loans yet" | `title` |
| Body | TEXT | | "Your loans will show here once you apply." | `body` |

## Parts and tokens

Vertical, width **343**, centred, padding left/right `var(--spacing-padding-lg)` 16, gap `var(--spacing-gap-lg)` 16.

| Part | Token |
|---|---|
| Art | the existing illustration **80 × 80**, unchanged (demo plays the Empty box animation) |
| Text | gap `var(--spacing-gap-sm)` 8, centred |
| Title | `.ps-t-title-sm`, `var(--content-primary)` |
| Body | `.ps-t-body-md`, `var(--content-tertiary)` |
| Button (On) | Primary Large, **264** wide |

On a page of its own (`page`), the art sits where the loader's coin sits.

## States

| # | Props |
|---|---|
| 0 | `title:'No messages yet', body:"We'll let you know here when something needs you."` |
| 1 | `title:'No loans yet', body:'Your loans will show here once you apply.'` + button "Apply for a loan" |

## Phase 1 · legacy geometry (2026-11-19)


Action=Off rebuilt from legacy Page empty state 6220:14417, which is 360 × 236 (help text a 40 px box: two lines in legacy, one in Hanken; the box keeps 40, Phase 2 note 20). Screen instances with one-line copy are 216 in legacy and here (Payment / Empty). Title / Body are instance overrides.

## 2026-11-20 · Title fills the width

The title hugged its sample text (154), so longer legacy titles ("You're all caught up", "No read messages yet") wrapped onto two lines.
Title now fills the content width (328), centred, height auto — one line as legacy. Fixed on the 6 instances too.

## 2026-11-20 · BRIEF 20 · placement (owner rule)
One placement for every empty state (full page, tab, list, sheet, the method picker's right column):
- **Container** = the free area that holds it: below the header / tabs / search, above the bottom bar, navigator or sheet foot (not the whole screen).
- Block (picture + text + optional button) centred horizontally; vertically space above : space below = **2 : 3**.
- Figma: `top = round((container height − block height) × 0.4)`, minimum 24 above and below; when the container is shorter than block + 48, the block starts 24 from the top and the area scrolls.
- Demo: flex column, top spacer `flex: 2`, bottom spacer `flex: 3`, each `min-height: 24px`.
- The loader is not an empty state: it stays in the middle of the screen.
- Differs from legacy on purpose (owner decision); Phase 2 compares.
