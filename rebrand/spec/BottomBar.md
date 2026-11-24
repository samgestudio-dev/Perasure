# BottomBar

Figma: `11086:2672` (05 · Structure `10982:15`) · 4 (Type) variant(s) · showcase "BottomBar · states"
The bottom action area. Replaces legacy Bottom Nav Action Container 3420:1820 (Default 3333:3079 → Two buttons, Variant3 3938:2048 → One button, Variant2 3908:1521, With term 7705:14283 → With terms) and /Terms 3420:1821 (→ Two buttons) (demo `PS.BottomBar`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside).

## Props

Type (VARIANT) · Terms (TEXT); Buttons exposed. React: `children`, `secondary`.

## Parts and tokens (legacy geometry)

360 wide, padding 32 / 48 / 20 (With terms 32 / 0 / 20), legacy gradient ground; buttons = Button Large Primary (+ Text), 264 wide, exposed.

## States

| # | Variant |
|---|---|
| 0 | Two buttons |
| 1 | One button |
| 2 | Variant2 |
| 3 | With terms |

## 2026-11-20 · BRIEF 24
Side-by-side secondary buttons use Button `Variant=Neutral`. `Type=Two buttons` in the library is Primary stacked over a Text button
(legacy layout), not a side-by-side secondary, so it is unchanged; a bottom bar with a secondary beside the primary uses Neutral.
