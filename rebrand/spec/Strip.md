# Strip

Figma: `11093:2760` (04 · Lists `10982:15`) · 1 variant(s) · showcase "Strip · states"
A one-line card on home that opens something ("You have updates on your loan"). Replaces legacy Loan state 6619:21799 (demo `PS.Strip`). Built 2026-11-19 by translating the legacy component (phase 1: legacy geometry, v2
tokens, library instances inside).

## Props

Title · Subtitle · Count (TEXT) · Icon (INSTANCE_SWAP). React: `title`, `sub`, `count`, `icon`, `onClick`.

## Parts and tokens (legacy geometry)

328 × 58, padding 12 / 16, radius 20, gap 12: icon tile 28 (padding 4, radius 8) + title Body/md-strong / subtitle Caption/xs + count badge 16 (navy, white digit).

## States

| # | Variant |
|---|---|
| 0 | Default |

## 2026-11-20 · BRIEF 22 · icon tile removed (owner)
The navy icon tile is gone: the icon stands alone in its **Filled** twin (`Icon / <name> / Filled`, 07 · Icons), **24 px**, `var(--content-brand)`,
gap **12** to the label (the label moves left). Owner-requested, so allowed in phase 1; Phase 2 compares with legacy.
