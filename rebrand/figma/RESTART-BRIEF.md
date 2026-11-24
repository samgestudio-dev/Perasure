# Figma lane — restart brief (2026-11-20)

The previous Figma session (`local_d80dae0b…`, "Figma: rebrand component library") ran out of context. A fresh session continues from here.

You are the Figma lane of the PeraSure rebrand. Only you write to Figma file `3oi5Omgi2dC5sR0L7Ux5hf` (the rebrand copy; never `OBsvf42AiRapcRrasD7KNm` or `5SiSMQZXSrS7MHGHuw3grP`), and only on the pages "Component - Rebranding" and "Design - Rebranding". Never edit the legacy Design page `3259:657`, the old component pages or the "Legacy · …" collections. The coordinator session gives instructions; report to it at the end of each turn.

## Read first

1. `rebrand/BRIEF.md`, all of it. Especially:
   - "✅ Colour rule — step for step" (with the rebuilt green scale: 600 = #5CD680);
   - "⚠️ Look parity" (pixel alignment, colour hierarchy);
   - "The pre-rebrand version stays";
   - decisions 1–39.
2. `rebrand/log/figma.md` entries 28–31; **entry 31 is the resume point** (steps 1–4 are done in the copy, plus the green-800 text, the background / outline pass and green checks).
3. `rebrand/figma/LOOK-AUDIT.md`: items A1–A36, G1–G3, H1–H7.

Load the figma-use and figma-generate-library skills before any `use_figma` call. Call `create_session` with the file key first. Keep writes sequential.

## Do, in order

1. **Sync variables.** Sync the Primitive and Semantic variables (values, aliases, new variables) from `rebrand/tokens/v2/figma-tokens.json`. That includes the rebuilt green scale (50 #F6FEF7 … 600 #5CD680 … 950 #143A1F), plus Bg/Action = green-600 with Content/On-action = navy-900.
2. **Rebuild the colour map.** Rebuild the kit's colour map from `rebrand/tokens/v2/rename-map.json`. Replace the old 312-entry merged map; don't merge into it. The kit and checker are plugin data in the file.
3. **Add the step-rule translator.**
   - Every legacy paint (variable or raw) goes to its legacy scale step, then to the same step in v2: legacy blue N → green N; neutral, red and green keep the same step.
   - Navy is only for dark brand surfaces.
   - The explicit owner exceptions are listed in BRIEF.
4. **Re-bind.** Re-bind all 176 frames and the library components. Run the colour-level checker (H5): each text and icon role must equal map(legacy role).
5. **Re-check items.** Re-check A33–A36, then G1 / G2 and the remaining A items.
6. **Page-by-page pass.**
   - Each page must be pixel-aligned with legacy.
   - Classify every remaining difference as colour / decision N / font glyph / normalisation, or fix it.
   - List the normalisations in `rebrand/figma/NORMALISATIONS.md`.
7. **Comparison sheet.** Update the "Look parity" sheet (section `11311:21425` on Component - Rebranding) and export `rebrand/parity/figma/look-parity.png` for the owner.

## Kit state

- The kit holds a merged colour map (312 entries); step 2 replaces it.
- Border/Focused points at Green/500, and Accent-strong / Link / Positive / Bg/Positive/Strong at Green/600. Step 1 overwrites them from tokens/v2.

## Rules

- Log progress in `rebrand/log/figma.md` as you go: what's done, what's next, node ids. If your context fills, write the resume point and stop.
- Nothing is committed or pushed.
- The demo is stopped by the owner: don't touch `rebrand/prototypes` or `rebrand/shared`.

## Update 2026-11-20 (third session)

Steps 1–4 are done in `3oi5Omgi2dC5sR0L7Ux5hf`, together with the green-800 text, the node-by-node background / outline pass and the green-600 checks with a navy mark. Continue from log entry 31:

- **Step 5:** the shape items A2, A4, A5, A7–A10, A13–A22, A24, A25, A27–A32, plus G1 (line heights) and G2 (hug widths).
- **Step 6:** the pixel fixes. These include the Field layout (A17 / A18), the ₱ offset in the repayment schedule and hug widths. Re-check the box-matched nodes by eye, and write `figma/NORMALISATIONS.md`.
- **Step 7:** re-export `parity/figma/look-parity.png`.
