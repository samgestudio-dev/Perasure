# QrPanel

Figma: `11113:3539` (06 · Product cards `10982:15`) · 1 variant(s) · showcase "QrPanel · states"
The navy panel with the QR, merchant and Save QR Code. Replaces legacy 5925:9634 (demo `PS.QrPanel`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside). Texts are instance overrides (copied from the legacy screens).

## Parts and tokens (legacy geometry)

296 × 310; QR image unchanged.

## 2026-11-20 · BRIEF 16: fills on the navy card

Owner rule: fills on the navy brand card are a bluish light alpha. New variables: Primitive `Alpha/Periwinkle/24` (#9DB8FF at 24 %, hidden,
no scopes) → Semantic `Bg/On-brand` (FRAME_FILL, SHAPE_FILL, `var(--bg-on-brand)`) and `Border/On-brand` (STROKE_COLOR,
`var(--border-on-brand)`). Bars' own fills (white, green) are unchanged.
Rebound here: "Save QR Code" button fill → Bg/On-brand, stroke → Border/On-brand, label Content/Inverse.
