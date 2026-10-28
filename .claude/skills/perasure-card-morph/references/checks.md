# Checks and phone pitfalls

## Before you ship
- [ ] **Spring and timing**
  - Withdraw's Smooth spring, `travel` = the longest path.
  - Measured: 95 % at ≈ 290 ms, settled ≈ 560 ms. To measure, read the card's height every animation frame after `go(1)` / `go(0)`.
- [ ] **Frame grid** at k = 0.1 … 0.9 (`m.set(k)` draws any frame). Clocked rows only appear in a real run, so also capture one at `?slow=10`. Check that:
  - the card is never empty;
  - nothing is cut by the moving edge;
  - no rider crosses a visible row;
  - text that travels lands with the row or line it joins.
- [ ] **Reverse mid-morph** (tap again ~90 ms in): it turns around smoothly and ends at the exact rest layout. The content below is in place with no leftover transform, and the slot height is committed.
- [ ] **Phone viewports** 390 × 664 and 390 × 844, touch, DPR 3: no console errors, and the short screen scrolls the buttons clear of the bottom bar.
- [ ] **Reduced motion** jumps to the end state.
- [ ] **Copy and colours**: copy checked against perasure-tone-of-voice; colours from `tokens/tokens.css` (hard-coded only where no token exists, and said so in a comment).

## Pitfalls found on real phones
- **iOS blur hairline** (Safari and Chrome on iPhone). A blurred element showed a dark rectangle edge (top and right) while blurred. Two things together caused it:
  - it had no layer of its own and iOS improvised one mid-animation, because it was drawn over a moving layer;
  - its filter switched between `none` and `blur()` at the ends of its window.

  Fix, built into the engine: everything in `blurred` (and every row) gets `will-change: transform, opacity, filter` for the whole morph and keeps a `blur()` filter, `blur(0px)` included, until the morph ends; `none` only at rest. Desktop and headless browsers don't show this bug. Verify on an iPhone.
- **Wobble at the end**: separate springs per property, each stopping on its own threshold. Use one progress.
- **Baseline shimmer** on text that changes size: animating font-size. Use FLIP instead (`page-to-card.md`).
- **One-pixel stepping** of content inside a moving card: layout offsets rounding. Use `cardSnap` (`page-to-card.md`).
- **`clip-path` animation** repaints the full screen every frame; scale the box with a transform instead.
- **Colour on its own timer** lands on a different curve and reads as a flash; put it on the progress.
- **Class-name clashes**: a page class like `.row { height: 20px }` collapsed the Tune panel's rows. Prototype-only panels use their own prefixed classes.
- **`repeat` on a Motion element animation** played once in testing; chain plays with `.then()` instead.
- **Test sampling**: reading styles from a test script every ~25 ms is too coarse for a 0.6 s ripple. Sample inside the page with `requestAnimationFrame`.
- **Headless Chrome's software renderer** draws `backdrop-filter` bands with stray mirrored reflections. Check blur bars with GPU compositing (`--use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`) or on a phone.
