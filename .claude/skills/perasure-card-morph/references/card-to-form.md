# Card → form (or another card), in place

Reference: Change co-maker (`prototypes/co-maker-change/co-maker.js`) and this skill's `example.html`, which uses the
same geometry. Read `example.html` alongside this.

## Build it
1. **Lay out both states** as absolutely positioned children of one card, in card coordinates taken from Figma.
   - The card's rounded overflow is the clip.
   - State B starts hidden (`opacity: 0; visibility: hidden`).
   - Shared elements carry their state-A geometry in CSS.
2. **Wrap the card in a slot** (in the page flow) whose height is the committed layout height.
   - `onStart(1)`: set the slot to the open height at once.
   - `onSettle(t)`: set it to the final height.
   - The content below rides with `translateY(cardHeight − slotHeight)`.
3. **In `apply(f)`, per frame:**
   - Card height: `lerp(H0, H1, c)`.
   - Avatar tile: animate its size (a small absolute box, e.g. 40 → 48) and position; scale the icon inside (24 → 32 px is one SVG at 0.75 → 1).
   - Header lines next to the tile:
     - Each line is one block that rides with the tile, always centred on it (co-maker: 64,40 / 64,66 → 80,20 / 80,44).
     - Inside each block, the old words `out(…, 0.04, 0.4, 8)` and the new words `inn(…, 0.2, 0.6, 8)`.
     - Line 2 runs +0.04 later than line 1.
     - Same type style in both states, so only the words change.
   - State A's other content leaves early: `out(caption, 0, 0.32, 8)`, `out(box, 0.04, 0.42, 10)`, `out(note, 0, 0.36, 8)`.
   - Bottom buttons ride the card's bottom edge: `inn(cancel, 0.5, 0.92, 10, h − 60)` (top = card height − 60).
   - The button that started the morph becomes the confirm button (co-maker: Change pill → Save):
     - its position and size travel on the front-loaded path `np = 1 − (1 − c)²`;
     - the primary fill fades over the light one (`win(0.12, 0.6)`);
     - the labels cross, old `1 − win(0.02, 0.42)` and new `win(0.28, 0.72)`, so the button is never blank.
   - A page-level primary action that is unavailable while the form is open: a disabled layer fades over it, `win(0.1, 0.55)`.
4. **`rows`** for the form rows: each `{ at, items: [{ el, y, a, b }] }`.
   - Rows enter on a clock (0.34 s), started when k passes `at`.
   - Closing, each leaves on its window `a`–`b`.
   - Dividers go in the same group as the row below them, with `y: 0`.
5. **`onStart`**:
   - switch pointer-events (A off and B on when opening, back when closing);
   - when closing, blur the focused input.
6. **A "change X" form opens empty**: every field on its placeholder, nothing of the current value carried in (owner's rule). Only the header text travels.

## Row thresholds (`at`)
A row may appear only once every rider (the travelling button, the bottom-edge buttons) is past its spot:

```js
const pillTop = k => lerp(41, cardH(k) - 60, 1 - (1 - k) ** 2);
const at = PSMorph.firstK(k => Math.min(pillTop(k), cardH(k) - 60) >= rowBottom + 4);
```

| Co-maker row | `firstK` gives | Used | ≈ ms in |
| --- | --- | --- | --- |
| Name | 0.36 | 0.42 (a little margin) | 95 |
| Relationship (+ rule) | 0.59 | 0.66 | 145 |
| Mobile (+ rule) | 0.86 | 0.84 (0 px gap) | 210 |

Rows end up ≈ 60 ms apart. Rows left on the progress alone rose in 50–80 ms while the card moved fast and read as "no animation", which is why they are clocked.

Closing windows used: Name `0.26–0.68`, rule `0.3–0.72`, Relationship `0.33–0.75`, rule `0.62–0.9`, Mobile `0.8–1`.

## Forms around the morph
- **Short screens**: if the opened card's buttons would land under the bottom bar, scroll with the morph on the same spring, so they rest 16 px above the bar. Use `PSMorph.scrollTo(scroller, target, m.spring)`; a touch stops it.
- **Keyboard**: keep the focused field above it.
  - Add a spacer as tall as the keyboard (`innerHeight − (visualViewport.offsetTop + visualViewport.height)`), then scroll the field into view.
  - Never re-fit or re-zoom the page while an input has focus.
  - On iOS, set the viewport's `maximum-scale` to the fitted scale so 14 px inputs don't zoom.
- **A disabled primary button tapped** (withdraw Confirm before the agreement is ticked):
  - Scroll to the missing step on the page's spring. As it arrives (within 24 px), the empty checkbox ripples: a brand-blue 2 px ring grows from it, 1 → 2.4× while fading 0.6 → 0, over 0.6 s on the ENTER curve. It plays twice, chained, not with `repeat`.
  - **No error state**: no red, no shake, no text change (owner's rule).
  - Button colours from the tokens: disabled `--color-action-bg-primary-disabled` + `--color-text-disabled`, enabled `--color-action-bg-primary-default` + `--color-text-inverse`, 0.2 s.
- **Phone numbers** shown as text: add `<meta name="format-detection" content="telephone=no">`, so iOS doesn't turn them into links.
