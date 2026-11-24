# PermissionCard

Figma: `11086:2666` (04 · Lists `10982:15`) · 2 (Open) variant(s) · showcase "PermissionCard · states"
One permission and why we ask. Replaces legacy Drop down 3259:962 (Default 3259:961 → Off, Active 3259:963 → On) (demo `PS.PermissionCard`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside).

## Props

Title · Description (TEXT) · Icon (INSTANCE_SWAP) · Open (VARIANT). React: `icon`, `title`, `body`.

## Parts and tokens (legacy geometry)

328 wide, padding 12 / 16, radius 20; icon tile 28 (Bg/Brand, icon white), title Label/md, chevron 16; Open=On adds the description (Caption/sm, gap 12).

## States

| # | Variant |
|---|---|
| 0 | Off |
| 1 | On |

## 2026-11-20 · BRIEF 22 · icon tile removed (owner)
The navy icon tile is gone: the icon stands alone in its **Filled** twin (`Icon / <name> / Filled`, 07 · Icons), **24 px**, `var(--content-brand)`,
gap **12** to the label (the label moves left). Owner-requested, so allowed in phase 1; Phase 2 compares with legacy.
