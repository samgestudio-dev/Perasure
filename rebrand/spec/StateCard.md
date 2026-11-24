# StateCard

Figma: `11098:2828` (06 · Product cards `10982:15`) · 5 (Status) variant(s) · showcase "StateCard · states"
The navy card that says where the account or application stands. Replaces legacy "Application state 12" cards: Hold 9051:22812, Not approved 9078:23067, Expired 9078:23263, In progress 9081:23678, Documents 9560:32795 (demo `PS.StateCard`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside).

## Props

Status (VARIANT); buttons exposed. No shared TEXT props (legacy copy per variant).. React: `status`, `title`, `body`, `action`, `onAction`.

## Parts and tokens (legacy geometry)

328 wide, heights 192 / 160 / 150 / 92 / 214 as legacy, radius 24, navy, white text. Expired: "Reapply now" is Button Secondary (one green action per screen, decision 7). Documents: Secondary "Add documents". Hold / Not approved: support row inside.

## States

| # | Variant |
|---|---|
| 0 | Hold |
| 1 | Not approved |
| 2 | Expired |
| 3 | In progress |
| 4 | Documents |

## 2026-11-20 · BRIEF 16: fills on the navy card

Owner rule: fills on the navy brand card are a bluish light alpha. New variables: Primitive `Alpha/Periwinkle/24` (#9DB8FF at 24 %, hidden,
no scopes) → Semantic `Bg/On-brand` (FRAME_FILL, SHAPE_FILL, `var(--bg-on-brand)`) and `Border/On-brand` (STROKE_COLOR,
`var(--border-on-brand)`). Bars' own fills (white, green) are unchanged.
Rebound here: the "Chat" pill (Hold, Not approved), the timer pill (Documents), the secondary buttons (Expired "Reapply now", Documents
"Add documents") → Bg/On-brand, their strokes and the dividers → Border/On-brand; their labels are Content/Inverse (navy text would vanish on
the alpha).
