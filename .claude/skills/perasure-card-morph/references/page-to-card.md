# Page or screen ⇄ card

Reference: withdraw fund flow.

| Morph | Code in `withdraw.js` |
| --- | --- |
| Amount entry ⇄ order card (the page closes into a card) | `tweenMp`, `applyMp`, `mpCard`, `cardSnap`, the `mp*` style functions |
| Credit-limit screen → home card | `introExit` |

`prototypes/withdraw-fund-flow/README.md` explains every decision. The engine pattern is the same (one progress, the
page's spring, windows); the React page only computes the frame in its own methods.

## The closing box
- **Not a clip-path** (that is a full-screen repaint every frame). The screen's own box is scaled to the card's box with a transform:
  - `translate(to.l·c, to.t·c) scale(sx, sy)`, origin `0 0`;
  - its rounded overflow is the clip, with corners `border-radius: 24·c/sx px / 24·c/sy px` so they read 24 on screen;
  - its content gets the inverse transform, so it stays put while the box closes around it.
- **Colour**: two flat layers inside the box, the dark one with the card's blue fading in over it (`win(0.15, 0.85)`). The page behind turns see-through, so the box is the card's background.
- **The card** is lifted above the closing box for the length of the exit, with no background of its own. At rest it takes its colour back the same frame the box is removed: identical box and colour, nothing fades over.
- **Shadow**: a layer of its own on the box's outline, fading in last.
- **Things on the card's bottom** (the Withdraw pill, its glow) ride the closing box's bottom edge.
  - The pill comes in halfway and moves up with that edge.
  - The glow is a copy inside the box, brightening from halfway.
- **Around it**:
  - cards below ride the box's bottom edge up while fading in one after another;
  - the logo row rides its top edge down;
  - the tab bar settles first, so content passes under a solid bar.
- The rest of the card comes in early, overlapping what leaves. Its details (label + info, legend rows, the bar's track) are secondary content: each plays the same clocked entrance (0.34 s, ENTER curve, rise from a 3 px blur), started at k 0.2 / 0.3 / 0.3 / 0.36 / 0.38. The bar's fill reveal and, last, the shadow stay on the progress (they are the card itself). The rest state is restored only when the spring and every clocked entrance are done.
- **Bar fills** are revealed left to right by two opposite slides: the row slides in, the fills slide back by the same amount. Still no clip-path.

## The travelling amount
The amount is **the same element the whole way**.
- **FLIP the glyphs.** Layout-affecting values (font-size, row height) jump to the destination once at the start; every glyph is then moved and scaled from where it was to where it lands. Nothing is laid out per frame.
  - Animating font-size made Blink round ascent and descent at different sizes, and the baseline shimmered by ±½ px.
- **Letter-spacing** (the big number is set at −0.02 em) changes in 24 quantised steps during the fast first half: the only text layout of the morph.
- **Variable-font weight** (₱ comes from Inter, 500 → 700) is quantised to steps of 5, so the glyph cache sees ≤ 41 instances.
- **Things under the amount make way.** While it is larger than its own size, the legend rows and bar move as a layout change would, so nothing runs into the digits.
- **Decimals** fade in on `win(0.3, 0.75)`.

## Whole-pixel layout
Blink rounds an element's layout offset to whole pixels before applying its transform. When the card's left edge and its left padding move in opposite directions, the content steps back a pixel now and then while the transforms keep gliding.
- `cardSnap()` puts the card's content origin on whole CSS pixels: layout lengths are quantised to 1/64 px first, then left + padding is rounded together.
- The sub-pixel remainder rides the transforms of the content (`resT()`).

## Timing for long travels
The loan morph's edge travels 378 px (design size). A longer travel (the Credit-limit screen → card, ≈ 508 px) uses the same spring stretched by `s = travel / 378` (here ≈ 1.34, settling ≈ 0.85 s): stiffness ÷ s², damping ÷ s, rest speed ÷ s, rest at 0.378 px over that travel. The edges then move at the same speed and settle on the same curve, for a little longer.

Never compress below s = 1 for shorter travels: see `SKILL.md`.

## Performance (low-end phones, 60 fps)
Measured with the CPU slowed 6×: layout 52 → 14 ms, paint 81 → 35 ms, raster 109 → 31 ms per exit after these changes.
- Every per-frame change is a transform or an opacity on its own layer.
- Everything that moves is promoted for the exit only.
- A value is written only when it changes.
- A looping decoration on the screen being closed (the star twinkle) is paused.
