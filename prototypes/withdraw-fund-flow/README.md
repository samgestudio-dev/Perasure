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
| `intro.js`, `intro.css` | the Credit limit intro (below): plays the Credit limit increase deliverable first, then hands its amount to the card |
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

## Credit limit intro (on by default)

The page opens with the Credit limit increase animation full screen — the deliverable itself,
`../credit-limit-coins/baked/baked-heap.html`, loaded in a frame (not a copy) by `intro.js` / `intro.css`. Its numbers come from
the card: the amount goes up from (available − temporary) to the available amount, +temporary, valid until Nov 20 2026
(₱30,000 → ₱40,000 by default). 3 s after it ends (`creditlimit:done`), it leaves:

- the amount carries over: it leaves the Credit limit screen and flies, shrinking, into the card's "Available amount" — one
  element the whole way (a copy of the card's amount starts at the big number's place and size and lands exactly on it; the
  decimals fade in on the way);
- around it the Credit limit screen recedes into a rounded card and fades, the home settles from a slight zoom, and its cards
  rise in one after another, then the tab bar (about 0.8 s, all on the compositor);
- a tap after the animation has ended skips the rest of the 3 s.

While the intro plays, the home's runtime does not start (`boot.js` waits for it), so nothing competes with the coins; the home
is built during the 3 s hold. Afterwards the frame is removed. Turn it off in Tune (or `?intro=0`).

## Tune (bottom left, home screen only)

Credit limit intro on/off, gradient blur on/off (the progressive backdrop-blur bands on the header and bottom bars; before, this was a separate
"With gradient blur" page), the card's available amount / total credit / temporary credit left, and the motion feel
(Smooth / Snappy / Gentle). A change is saved on the phone and reloads the page with it. Links can set them too:
`?intro=0`, `?blur=1`, `?available=45000`, `?total=50000`, `?temporary=10000`.
