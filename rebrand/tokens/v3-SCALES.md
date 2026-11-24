# Colour scales v3: proposal for owner review (2026-11-21)

- **Source:** PeraSure UI Foundations v1.0 (Brand Bible addendum). Copy in `rebrand/reference/PeraSure_UI_Foundations_v1.0.pdf`, pp. 4–5.
- **Figma:** the review page "Colour scales · review v3" (`15004:15`, wrapper `15004:27`) in the copy file `kYyNV2MgxvH1w9bJ46A3yx`.
- **Status:** owner approved 2026-11-21. **Applied in Figma** (copy `kYyNV2MgxvH1w9bJ46A3yx`): Primitive, Semantic and Component variables overwritten; component bindings re-pointed. Migration map: `tokens/v3-map.json`. Code tokens (`tokens/v3`) not built yet.

## Owner direction (2026-11-21)

- Work in the copy file `kYyNV2MgxvH1w9bJ46A3yx`.
- Leave warning, error and typography alone.
- **Green:** re-anchored at **500 = #5CD680** (was 600). Every component follows.
- **Navy:** anchored at **900 = #000128**. Navy replaces the neutral scale: every token on a neutral step moves to navy, and the Neutral scale is deleted.
- **Mist** has its own scale, kept apart from navy.
- Evaluate the scales in OKLCH and fill the missing steps.

## Green: anchor 500

| Step | Hex | Status | OKLCH (L · C · H) | On white |
|---|---|---|---|---|
| 50 | #EFFBF2 | PDF | 0.98 · 0.017 · 154 | 1.1 |
| 100 | #DAF6E2 | PDF | 0.95 · 0.040 · 154 | 1.1 |
| 200 | #BAEEC9 | PDF | 0.90 · 0.073 · 154 | 1.3 |
| 300 | #8DE2A6 | PDF | 0.84 · 0.118 · 153 | 1.5 |
| 400 | #76DC93 | ADDED (OKLCH midpoint 300–500) | 0.81 · 0.141 · 151 | 1.7 |
| **500** | **#5CD680** | ANCHOR | 0.79 · 0.164 · 151 | 1.8 |
| 600 | #36A65B | ADJUSTED (was #29A34D) | 0.64 · 0.149 · 151 | 3.1 |
| 700 | #298648 | ADJUSTED (was #278142) | 0.55 · 0.128 · 151 | 4.6 |
| 800 | #1D6334 | ADJUSTED (was #1D6232) | 0.44 · 0.103 · 151 | 7.3 |
| 900 | #144322 | PDF | 0.34 · 0.076 · 150 | 11.3 |
| 950 | #0B2C15 | ADDED (extends 800→900) | 0.26 · 0.057 · 150 | 15.2 |

Evaluation:
- The hue is constant (149–154°). Chroma peaks at 500–600 and tapers both ways.
- The PDF dark side was uneven: 500→600 ΔL 0.155, the other steps ~0.095.
- **Owner pick (2026-11-21): 600–800 smoothed in OKLCH, keeping the contrast roles** (600 ≥ 3:1 for icons, 700 ≥ 4.5:1 for small text).
- Now ΔL 0.140 / 0.096 / 0.104 / 0.104.
- A strictly even scale would put 600 at 2.8:1 and 700 at 4.3:1, failing both roles, so it was not used.
- Green 700 is 4.2:1 on Mist, so small green text on Mist uses Green 800 (6.6:1), as the PDF says.
- The light side stays tight: the brand green is very light (L 0.79).

## Navy: anchor 900, replaces all neutrals

| Step | Hex | Status | OKLCH | On white | PDF use |
|---|---|---|---|---|---|
| 50 | #F5F5F6 | PDF | 0.97 · 0.001 · 286 | 1.1 | App background |
| 100 | #EBEBEE | PDF | 0.94 · 0.004 · 286 | 1.2 | Input fills, inactive chips |
| 200 | #D6D6DD | PDF | 0.88 · 0.010 · 286 | 1.4 | Dividers |
| 300 | #B2B3BE | PDF | 0.77 · 0.016 · 282 | 2.1 | Input borders |
| 400 | #8A8A9C | PDF | 0.64 · 0.027 · 286 | 3.4 | Placeholder, disabled only |
| 500 | #61627A | PDF | 0.50 · 0.038 · 283 | 5.9 | Secondary and helper text |
| 600 | #3D3E5C | PDF | 0.38 · 0.051 · 282 | 10.3 | Body text |
| 700 | #1F1F42 | PDF | 0.26 · 0.064 · 281 | 15.8 | Dark cards on navy |
| 800 | #0B0F35 | ADDED (OKLCH midpoint 700–900) | 0.19 · 0.074 · 273 | 18.5 | — |
| **900** | **#000128** | ANCHOR | 0.13 · 0.084 · 264 | 20.3 | Headings, amounts, dark surfaces |
| 950 | #00011A | KEPT (existing Navy/950) | 0.10 · 0.064 · 264 | 20.6 | Overlay shade |

Evaluation:
- Lightness steps are even (ΔL 0.12–0.13 from 300 to 700).
- The tints sit at 281–286° against the anchor's 264°, because they are navy mixed with white in sRGB. The result is a faint violet cast at very low chroma.
- Locking the hue to 264° would give slate blue-greys (500 → #5A657B), which Rule 02 bans ("no blue from the old app"). The PDF values are kept.

## Mist: anchor 100, separate scale (was Ambient)

| Step | Hex | Status | Note |
|---|---|---|---|
| 50 | #F7FAF9 | KEPT | |
| **100** | **#F0F5F4** | ANCHOR | Mist, brand background |
| 200 | #E4ECE9 | ADJUSTED (was #EAF2F0) | Was only ΔL 0.01 from 100. It is Surface/Page/Strong today, so that surface gets one notch darker |
| 300 | #D3E0DC | ADJUSTED (was #DFEEE5) | Was off-hue (160°) |
| 400 | #BCCDC8 | ADJUSTED (was #C3D6D0) | Re-spaced |
| 500–950 | #A1B7B0 · #7C928B · #5A6E68 · #3C4C47 · #222E2B · #121A18 | KEPT | |

The hue is held at ~175°. The anchor reads 183° only because its chroma is 0.005.

## Base: White and Black (two colours, no scale; owner 2026-11-21)

- **White #FFFFFF**: cards, sheets, and text and icons on navy (was Neutral 0).
- **Black #000000**: shadows and scrims only, as alpha. Text and surfaces use navy.
- Transparency is not a scale. A see-through white or black stays a named alpha token, only where it is used. Today that is White 0/20/40/50/60/80 % and Black 6/8/12/16/20 %.
- Figma variables can't apply an opacity modifier to a colour, so each alpha in use needs its own variable.

## Removed or replaced

- **Neutral 0–950: deleted.** Every neutral token is re-pointed to the navy step for its role. That mapping is the next step, for owner review.
- **Old navy 50–800** (chromatic blue-navy, e.g. 600 #304C8C): replaced by the PDF navy. Bg/Brand/Muted changes from #304C8C to #3D3E5C.
- **Old green** (600 = #5CD680): replaced. Components on green-600 move to green-500.
- **Ambient:** renamed to Mist (above).
- **Alpha/White and Alpha/Black:** kept as use-specific alpha tokens (no full ladder).
- **Alpha/Grey and Alpha/Deep Green:** proposal: drop them ("no other greys"). This is confirmed in the next review step.
- **Not touched:** Orange, Red, typography, Alpha/Navy.

## Applied in Figma (2026-11-21)

1. **Primitives.**
   - Renamed: Ambient → Mist, and Alpha/Grey → Alpha/Navy-100 (base #EBEBEE).
   - Added: Base/White, Base/Black, Alpha/Navy/60, Alpha/White/24, and Alpha/Mist/0–80.
   - Green, Navy and Mist values set to v3.
   - Deleted (26): Neutral 0–950, Alpha/Black, Alpha/Deep Green, Periwinkle.
2. **Semantic and Component.**
   - 65 colour aliases re-pointed per `v3-map.json`: grey → navy by role, green brand 600 → 500, the old lighter 500 → 400, pressed → 600, text 700/800 kept.
   - Tag content → 800 (PDF active tag; 700 on green-100 is only 4.0:1).
   - Bg/Tint → Alpha/Navy, and On-brand → Alpha/White/24.
   - New Gradient/Mist/0–80.
3. **Components.**
   - Direct primitive bindings re-pointed: 45 on Component - Rebranding, 122 on Design - Rebranding.
   - Legacy gradient stops (Color/Gradient/Ambient, Subtle) → Gradient/Mist and Gradient/White: 18 nodes.
   - No reference to a deleted variable is left (checked on both pages, gradient stops and effects included).
4. **Contrast pass.**
   - Green 700 text on a light background below 4.5:1 (green tints, Mist, light navy) → Content/Accent-heavy or Positive/Strong (800).
   - Covered: 12 main-component labels, 17 loose texts, and 125 instance overrides, plus 22 paired icons.
5. **Not changed.**
   - Orange and Red.
   - The 4 local paint styles, which are still bound to the Legacy collection (nav gradients).
   - Raw decorative colours (illustration, glow).

## Next steps

1. Owner review of the applied file (component sheet `11311:21425`).
2. Build `tokens/v3` (copy of v2) from `v3-map.json` → tokens.css, figma-tokens.json, dev CSS, rename map; update DEV-HANDOFF.
3. The 4 nav gradient paint styles: rebind to Gradient/Mist / White (styles are shared with legacy pages: decide first).
