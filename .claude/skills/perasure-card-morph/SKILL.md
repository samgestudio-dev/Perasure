---
name: perasure-card-morph
description: Reproduce PeraSure's card morph motion — one card or page turning into another state (a card growing into a form, a page closing into a card, a button becoming another button, text changing as it travels), as in the withdraw fund flow and Change co-maker prototypes. Use for any PeraSure prototype or screen with such a transition.
---

# PeraSure card morph

The motion behind two shipped prototypes in the PeraSure Playground (`samgestudio-dev/Perasure`):

| Reference | What morphs | Code |
| --- | --- | --- |
| **Change co-maker** (`prototypes/co-maker-change/`) | a card grows into a form and back: the avatar tile grows, the header text changes as it travels, the Change pill travels down and becomes Save, form rows come in, the card below rides the edge | `co-maker.js` (vanilla + Motion, ~350 lines, heavily commented) |
| **Withdraw fund flow** (`prototypes/withdraw-fund-flow/`) | amount entry ⇄ order card (the full page closes into a card, the amount travels and resizes); Credit-limit screen → home card (a full screen closes into a card); keypad / pills | `withdraw.js`: `tweenMp`, `applyMp`, `mpCard`, `introExit`; constants in `motion-tokens.js`; `README.md` explains each decision |

Next to this file:
- `engine.js` — the reusable engine (`window.PSMorph`), extracted from the co-maker code.
- `example.html` — the smallest complete morph built on it.

Outside the repo, fetch them from `https://raw.githubusercontent.com/samgestudio-dev/Perasure/main/.claude/skills/perasure-card-morph/`.

To reproduce the motion on a new project, **start from `example.html`**: copy it, keep `engine.js` beside it, change the markup and the geometry numbers, and keep every rule below. The motion should feel identical to withdraw and co-maker. That is the point: it is one motion language across PeraSure.

Copy on any screen follows the **perasure-tone-of-voice** skill. Header / bottom bars follow the repo's `CLAUDE.md` → "Header and bottom bars".

---

## 1. The engine in one minute

```html
<script src="…/vendor/motion@14.4.0/motion.js"></script>   <!-- Motion's vanilla build: window.Motion -->
<script src="engine.js"></script>
```
```js
const m = PSMorph.create({
  travel: 202,                    // px: the LONGEST distance anything travels (sets the end threshold)
  feel: 'Smooth',                 // withdraw's feels: Smooth (default) | Snappy | Gentle
  promote: [card, below, tile, pill, headerLine1, headerLine2],      // moved by transform / size
  blurred: [caption, nameA, nameB, …],                               // everything that ever blurs
  rows: [ { at: 0.42, items: [{ el: row1, y: 8, a: 0.26, b: 0.68 }] }, … ],   // secondary content (§3.6)
  apply(f) { /* one frame: write every style from f.c / f.win(a,b) — see example.html */ },
  onStart(t) { /* pointer-events; opening: commit the OPEN layout height now */ },
  onSettle(t) { /* commit the final layout height */ }
});
button.onclick = () => m.go(m.target() ? 0 : 1);   // a tap mid-morph re-targets: the reversal is smooth
```

`apply(f)` gets these helpers:

| Helper | What it does |
| --- | --- |
| `f.c` | Progress k, clamped to 0–1. Use it for geometry. |
| `f.win(a, b)` | Smoothstep window of k. |
| `f.front(t)` | `1 − (1 − t)²`, a front-loaded path. |
| `f.lerp` | Linear interpolation. |
| `f.put(el, prop, val)` | Writes a style only if it changed. |
| `f.show(el, o)` | Opacity, plus visibility hidden at 0. |
| `f.blur(el, px)` | Blur filter. |
| `f.out(el, a, b, y)` | What leaves: fade out, rise, blur. |
| `f.inn(el, a, b, y, base)` | What comes in: rise into place from a blur. |

Other exports:
- `PSMorph.scrollTo(scroller, top, m.spring)` scrolls on the same spring.
- `PSMorph.pressable(el)` adds the press.
- `PSMorph.firstK(test)` computes row thresholds.
- `PSMorph.MT` holds all the constants.

The withdraw page does the same things inside React. There, `this.spring()`, `this.win()`, `this.put()` and `applyMp()` play these roles, so read it as the same engine.

---

## 2. Constants (do not change them)

| | Value | Use |
| --- | --- | --- |
| Spring Smooth | stiffness 240, damping 30, mass 1 | default for every morph (`FEEL.Smooth`) |
| Spring Snappy / Gentle | 430 / 34 / 0.8 · 140 / 24 / 1.15 | only as Tune options |
| Spring end | within 0.378 px and 3.78 px/s over the longest travel (`restDelta = 0.378 / travel`, `restSpeed = 3.78 / travel`) | withdraw's own threshold (0.001 of its 378 px loan morph) |
| Travel (MT.Y) | text 8 px, block 10 px, digit 6 px | how far things rise when they enter / leave |
| Blur bridge | 3 px | every crossfade: leaving blurs 0 → 3, entering 3 → 0 |
| ENTER | 0.30 s, delay 0.07, ease `[0.22, 0.61, 0.36, 1]` | clocked entrances / label swaps |
| LEAVE | 0.15 s, ease `[0.4, 0, 1, 1]` | clocked exits |
| Secondary entrance | 0.34 s on the ENTER curve, rise 8 px, 3 px → sharp | form rows, details (§3.6) |
| Press | 60 ms down, scale 0.985 (pills / buttons), 0.92 (icon buttons), no bounce | everything tappable |

**Timing.** Measured with Smooth: 95 % of the way at **≈ 290 ms**, settled at **≈ 560 ms**. This is the same for co-maker, the example and withdraw (572 ms).
- **Never speed the spring up because a move is short.** An early co-maker version scaled the spring to the same *speed* over its shorter travel. It came out 40 % quicker (175 ms) and the owner rejected it as rushed. Same spring = same feel; the time follows from the distance, slightly sooner for a short move.
- Only a much longer travel than 378 px is stretched in time, as withdraw's Credit-limit → card exit does: `s = travel / 378`, at most 2.5; stiffness ÷ s², damping ÷ s. The curve stays the same. `PSMorph.springFor` does this.

---

## 3. The rules of the motion

### 3.1 One progress, one spring
Everything that moves is a function of ONE progress k (0 = state A, 1 = state B), animated by Motion on the spring above.
- The progress's change event writes styles straight to the DOM: no framework render per frame.
- Container and content land on the same curve and at the same moment.
- Separate springs per property were tried in withdraw. Each stopped at its own threshold and the content wobbled at the end. Don't do it.

### 3.2 Windows
- Geometry (sizes, positions) follows k clamped to 0–1.
- Opacity, blur and small rises follow smoothstep windows `win(a, b)`, the same function both ways. So a reversal runs them back, and because the spring is front-loaded, leaving is naturally quicker than arriving.

| | Window |
| --- | --- |
| What leaves | gone by k ≈ 0.4 (e.g. `out(caption, 0, 0.32)`, `out(box, 0.04, 0.42, 10)`) |
| What arrives | starts while the old content is still fading (≈ 0.2), done by ≈ 0.65 |

The two overlap, so the card is never empty.

### 3.3 Shared elements stay one element
Anything present in both states is the same element, moved and resized. It never fades out and back in.
- **Tile / icon**: animate its size (a small absolute box); scale the icon inside (24 → 32 px is the same SVG at 0.75 → 1).
- **Header text that changes words** (co-maker "Sam Ge" → "Change your co-maker"):
  - The line is one block that rides with the tile, always centred on it.
  - Inside it, the old words leave (`out`: rise 8, blur 3) and the new words enter (`inn`: from +8, 3 → 0), overlapping.
  - Line 2 starts a beat (+0.04) after line 1.
  - Same type style in both states, so only the words change.
- **Two different texts on one path** (when the style differs): both move and scale along the same path from A's spot to B's spot (transform origin top-left), crossfading with the 3 px blur in the middle. Withdraw's amount goes further: it is the same element whose glyphs are FLIPped (see §4.2).
- **A button that becomes another button** (co-maker Change pill → Save):
  - Animate the pill's position (transform) and size (width / height on its small box).
  - Inside it, its light fill stays and the primary fill fades over it (`win(0.12, 0.6)`).
  - The labels cross over each other: old `1 − win(0.02, 0.42)`, new `win(0.28, 0.72)`, so it is never blank.

### 3.4 Nothing is cut by a moving edge
The card box (rounded overflow = the clip) grows or shrinks, so its edge sweeps over content. Everything either:
- **fades before the edge reaches it**, or
- **rides the edge**:
  - Buttons on the card's bottom sit at `top = cardHeight − 60` (co-maker Cancel / Save).
  - Content below the card rides via `translateY(currentHeight − committedHeight)`.

**The page layout is committed only at rest.** At the start of an opening, commit the open height (the content below is held in place by a −Δ transform). At the end of a closing, commit the closed height. Never animate layout of the page itself.

### 3.5 Things that cross content land early
An element whose path crosses rows that are coming in uses a front-loaded path, `p = 1 − (1 − k)²` (still on the same progress). Example: the co-maker pill travels from the top-right down to Save's spot. It is then already past those rows when they appear. Without it, Save sat on the Mobile row in the spring's slow tail.

### 3.6 Secondary content: on a clock, started by the progress
Form rows and other details do **not** ride the progress. On the progress, rows that arrive while the card still moves fast finish their rise in 50–80 ms and read as "no animation"; the owner noticed.

Instead (as withdraw's LAYER_IN / REVEAL):
- Each row plays the **same** clocked entrance (0.34 s, ENTER curve, rise 8 px, 3 px → sharp).
- It starts at the k where the card has room for it, i.e. once every rider (pill, bottom-edge buttons) is past the row's spot.
- Compute that k:
  ```js
  PSMorph.firstK(k => Math.min(pillTop(k), cardH(k) - 60) >= rowBottom + 4)
  ```
  Co-maker: Name 0.42, Relationship + rule 0.66, Mobile + rule 0.84, about 95 / 145 / 210 ms in, roughly 60 ms apart.
- Closing, rows leave on progress windows, bottom-up. What shows is `min(clocked value, window)`, so any reversal carries on from what is on screen.

### 3.7 Colour and other non-transform changes
- Never animate a colour on a separate timer: it lands on a different curve and reads as a flash.
- Crossfade two flat layers (a disabled layer over the button; the blue box layer fading in over the dark in withdraw), or mix colours on the same progress.
- A primary button that becomes unavailable while the form is open: fade a disabled layer over it on the progress (`win(0.1, 0.55)`).

---

## 4. Recipes

### 4.1 A card grows into a form (co-maker, `example.html`)
1. Lay out both states as absolutely positioned children of one card, in card coordinates (Figma numbers).
   - State B elements start hidden.
   - Shared elements carry their A geometry in CSS.
2. In `apply`:
   - card height `lerp(H0, H1, c)`;
   - the content below rides;
   - the tile grows;
   - the header lines ride with the tile and swap words;
   - state A leaves;
   - Cancel rides the bottom edge (`inn(…, 0.5, 0.92, 10, h − 60)`);
   - the pill travels (front-loaded) and becomes Save.
3. `rows` for the form rows (thresholds from `firstK`).
4. `onStart`:
   - switch pointer-events (A off / B on, or back);
   - opening: commit the open slot height;
   - closing: blur the focused input.
5. `onSettle`: commit the slot height.
6. **Form opens empty** when it is a "change X" form: every field on its placeholder, nothing of the current value carried in (owner's rule for co-maker).

### 4.2 A page or screen closes into a card (withdraw)
Read `introExit()` and `mpCard()` in `withdraw.js`; the README there explains each step. The techniques:
- **The closing box is not a clip-path** (that repaints the full screen every frame). It is the screen's box scaled to the card's box with a transform. Its rounded overflow is the clip (`border-radius: 24·c/sx px / 24·c/sy px`), and its content gets the inverse transform so it stays put.
- **Colour**: two flat layers, dark then the card's blue fading in. **Shadow**: a layer of its own fading in on the box's outline. **Bar fills**: revealed by two opposite slides (row slides in, fills slide back the same amount).
- **The amount is the same element the whole way.**
  - Layout values jump to the destination once; every glyph is then FLIPped (moved and scaled from where it was), so nothing is laid out per frame.
  - Letter-spacing changes in 24 quantised steps during the fast first half.
  - A variable-font weight is quantised to steps of 5.
- **Whole-pixel layout**: `cardSnap()` puts the card's content origin on whole CSS pixels and hands the sub-pixel rest to transforms. Blink rounds layout offsets of transformed elements; without this, the content stepped back a pixel now and then.
- What sits on the card's bottom (the pill, the glow) rides the closing box's bottom edge. Cards below ride it up while fading in one after another. The header rides the top edge down.
- A longer travel than 378 px stretches the spring by the distance ratio (§2).

### 4.3 Around a morph
- **Short screens**: if the opened card's buttons would land under the bottom bar, scroll with the morph on the same spring: `PSMorph.scrollTo(scroller, target, m.spring)`, which a touch stops.
- **A disabled primary action tapped** (withdraw Confirm before the agreement is ticked): scroll to it on the same spring. As it arrives, ripple the thing to do: a brand-blue ring grows out of the empty checkbox to 2.4× while fading, 0.6 s, ENTER curve, twice. **No error state** (owner's rule: no red, no shake).
- **Keyboard**: keep the focused field above it (spacer + scroll); never re-fit the page while an input has focus.
- **Tune panel** (prototype only, `tune.js` / `tune.css`): Motion feel (Smooth / Snappy / Gentle) and progressive blur on / off; saved on the phone; `?feel=`, `?blur=` in links.
- **`?slow=10`** plays everything 10× slower (engine reads it) for checking on a phone.
- **`prefers-reduced-motion`**: jump to the end state; no ripples.

---

## 5. Performance and phone pitfalls (all found on real phones)
- Per frame, write only `transform`, `opacity`, `filter`, plus the size of the card and of small absolutely positioned boxes (tile, pill); they lay out nothing else. Write a value only when it changed (`put`). Nothing goes through React during a morph.
- `will-change` only during the morph; release at rest (the engine does this for `promote` and `blurred`).
- **iOS blur hairline**: iOS WebKit (Safari and Chrome on iPhone) drew a dark rectangle edge around a blurred element when:
  - it had no layer of its own and got one improvised mid-animation (because it was drawn over a moving layer), and
  - its filter switched between `none` and `blur()`.

  Fix (built into the engine): everything in `blurred` has its own layer for the whole morph, and keeps a `blur()` filter — `blur(0px)` included — until the morph ends; `none` only at rest.
- No `clip-path` animation (full repaint). No CSS transitions mixed in for colour that must ride the progress.
- **Class names**: give prototype-only panels (Tune) their own prefixed classes. A page class like `.row { height: 20px }` broke the Tune panel's rows once.
- Headless Chrome's software renderer draws `backdrop-filter` bands with stray reflections; check those with GPU compositing (`--use-angle=swiftshader --enable-unsafe-swiftshader`) or on a phone.

---

## 6. Check before you ship
- [ ] Spring is withdraw's Smooth; `travel` = the longest path; 95 % at ≈ 290 ms, settled ≈ 560 ms. Measure: watch the card height per animation frame.
- [ ] Frame grid at k = 0.1 … 0.9 (`m.set(k)`; rows are clocked, so also capture a real run at `?slow=10`). Check that:
  - the card is never empty;
  - nothing is cut by the moving edge;
  - no rider crosses a visible row;
  - the travelling text lands with the row or line it joins.
- [ ] Reverse mid-morph (tap again at ~90 ms): it turns around smoothly and ends at the exact rest layout (content below in place, no leftover transform).
- [ ] Phone viewport 390 × 664 and 390 × 844, touch, DPR 3; no console errors; reduced motion works.
- [ ] Copy checked against perasure-tone-of-voice; tokens from `tokens/tokens.css` (no hard-coded colours unless no token exists).
