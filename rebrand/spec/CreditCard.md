# CreditCard

Figma: `11093:2768` (06 · Product cards `10982:15`) · 4 (Temporary) variant(s) · showcase "CreditCard · states"
The available amount on home. Replaces legacy Home primary card 10926:30157 (Default 10926:30158 → Off, With credit limit increase 10926:29644 → On); User home cards 9867:36981 → User home, 9867:37346 → User home compact (demo `PS.CreditCard`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside).

## Props

Temporary (VARIANT); Button exposed.. React: `available`, `total`, `temporary`, `temporaryUntil`, `onWithdraw`.

## Parts and tokens (legacy geometry)

328 wide, padding 12, gap 16 / 8, radius 24, flat navy (decision 8 — the legacy glow ellipse is hidden); Withdraw = Button Medium Primary with the legacy 16 px label (Title/xs), 46 tall. Heights 182 / 196 / 186 / 162 = legacy (Off, On, User home, User home compact; checked in Figma 2026-11-20). The 194 / 170 seen earlier came from the widened amount boxes going auto-height after the tracking change, and the 185 / 199 from the baseline-aligned amount row; both fixed 2026-11-20.

## States

| # | Variant |
|---|---|
| 0 | Off |
| 1 | On |
| 2 | User home |
| 3 | User home compact |

## 2026-11-20 · Legacy heights after graded tracking

Off / On amount row pinned to legacy 36 (baseline alignment with Hanken's 44 px line made it 39): 182 / 196 = legacy. User home / compact amount boxes back to legacy 36 / 28 (width kept).

## 2026-11-20 · BRIEF 16: fills on the navy card

Owner rule: fills on the navy brand card are a bluish light alpha. New variables: Primitive `Alpha/Periwinkle/24` (#9DB8FF at 24 %, hidden,
no scopes) → Semantic `Bg/On-brand` (FRAME_FILL, SHAPE_FILL, `var(--bg-on-brand)`) and `Border/On-brand` (STROKE_COLOR,
`var(--border-on-brand)`). Bars' own fills (white, green) are unchanged.
Rebound here: the bar track (Bg/Neutral/Default → Bg/On-brand), the "Total credit" legend dot (On), and the ring's faint track (white at 40 % →
Bg/On-brand at 100 %).
