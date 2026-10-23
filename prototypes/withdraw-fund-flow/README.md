# Withdraw fund flow

Home card → withdraw sheet → amount entry ⇄ order confirmation. Open `index.html` through a web server (GitHub Pages,
or `python3 -m http.server` in the repo): the page code is fetched, so opening the file from disk does not work.

## Files

| File | What it is |
| --- | --- |
| `index.html` | the page: its markup (the `<x-dc>` block) and the links below |
| `withdraw.js` | the page code (home card, sheet, keypad, amount morph, order details) |
| `withdraw.css`, `perasure-ds.css` | page styles; the PeraSure design-system stylesheet (tokens, type roles) as exported |
| `motion-tokens.js` | the animation constants (springs, reveals, presses) |
| `phone-fit.js` | fits the 360 px design to the phone, iOS Safari 26 edge-to-edge handling (`?debug=1` shows the numbers) |
| `boot.js` | start-up: points the page at its files, loads `withdraw.js`, starts the runtime |
| `runtime/dc-runtime.js` | the Claude Design runtime that renders the `<x-dc>` markup with the page code |
| `assets/` | PeraSure and Maya logos; the card's glow, info icon and legend dots (from Figma) |
| `with-credit-limit.html` | the variant that opens with the Credit limit increase animation (below) |
| `intro.js`, `intro.css` | that intro: plays the Credit limit increase deliverable first, then closes it in to the home card |
| `tune.js`, `tune.css` | **prototype only** — the Tune panel; delete them and their two lines in `index.html` for production |
| `with-blur.html` | old link only: forwards to `index.html?blur=1` |

Shared from the repo (not part of this folder): the app's fonts (`assets/fonts/`), React 18.3.1 and Motion 14.4.0 (`vendor/`).

## Home card (Figma: PeraSure design system, node 9867:36981)

Available amount (Satoshi Bold 36, ₱ from Inter), a legend (total credit; temporary credit and its end date) and a credit
bar, then the frosted Withdraw pill with the glow under it. The bar is the total credit:

- **white** = long-term credit still available, **green** (right after it) = temporary credit left, the dark rest = used;
- each is as long as its share of the total credit (Figma node 9867:36993). The white bar overlaps the green by 4 px so its
  rounded end leaves no gap; the green bar is 4 px longer to make up for it, so the green that shows is exactly its share;
- the temporary credit left is part of the available amount, the rest of which is long-term credit. With the design's numbers
  (₱40,000 available of ₱50,000, ₱10,000 temporary left) white ends at 60 % and green at 80 %; any temporary amount above
  zero shows green.

Data: `availableAmount`, `totalBalance` (total credit), `temporaryAmount` (temporary credit left), `temporaryValidTill` in the page's `data-props`.

## With credit limit increase (`with-credit-limit.html`)

The same page, opening with the Credit limit increase animation full screen — the deliverable itself,
`../credit-limit-coins/baked/baked-heap.html`, loaded in a frame (not a copy) by `intro.js` / `intro.css` (the only difference
from `index.html`; keep the two pages' markup in step). Its numbers come from the card: the amount goes up from
(available − temporary) to the available amount, +temporary, valid until Nov 20 2026 (₱30,000 → ₱40,000 by default), so it
ends on the card's number. 3 s after it ends (`creditlimit:done`) it closes in to the home card — the same interaction as
picking a term in "Apply a loan", where the full page closes in to the order card, and built the same way in React + Motion
(`introExit()` in `withdraw.js`; `intro.js` only hands over): one progress 0→1 in a Motion value, animated with the page's
spring (`this.spring()`, Tune → Motion feel; Smooth = stiffness 240, damping 30) and the same rest thresholds as the sheet's
morph; its change event writes the styles straight to the DOM, with the sheet's windows and travel distances (`MT.Y`):

- the Credit limit screen's edges close in to the card's exact box, corners rounding to 24, colour turning from the dark to
  the card's blue; its content stays put and fades early;
- the card is lifted above that screen for the length of the exit with no background of its own — the closing screen is its
  background; at rest the card takes the blue back and the screen is removed (identical box and colour: nothing fades over);
- the amount is the same element the whole way: the card's real amount starts at the big number's place, size, tracking and
  colour (the big number lies inside the card's box, so nothing clips it) and settles on the progress; decimals fade in;
- the rest of the card comes in on windows of the progress: label and info, the two legend rows, the bar (track, then its
  fills revealed left to right), the Withdraw pill, the glow, and last the card's shadow; the cards below rise in one after
  another, then the tab bar.

A tap after the animation has ended skips the rest of the 3 s. While the intro plays the home's runtime does not start
(`boot.js` waits), so nothing competes with the coins; the home is built during the hold. Afterwards the frame is removed.

## Tune (bottom left, home screen only)

Gradient blur on/off (the progressive backdrop-blur bands on the header and bottom bars; before, this was a separate
"With gradient blur" page), the card's available amount / total credit / temporary credit left, and the motion feel
(Smooth / Snappy / Gentle). A change is saved on the phone and reloads the page with it. Links can set them too:
`?blur=1`, `?available=45000`, `?total=50000`, `?temporary=10000`.
