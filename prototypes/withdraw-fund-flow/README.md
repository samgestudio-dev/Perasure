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
bar, then the Withdraw pill (translucent, no blur) with the glow under it. The bar is the total credit:

- **white** = long-term credit still available, **green** (right after it) = temporary credit left, the dark rest = used;
- each is as long as its share of the total credit (Figma node 9867:36993). The white bar overlaps the green by 4 px so its
  rounded end leaves no gap; the green bar is 4 px longer to make up for it, so the green that shows is exactly its share;
- the temporary credit left is part of the available amount, the rest of which is long-term credit. With the design's numbers
  (₱40,000 available of ₱50,000, ₱10,000 temporary left) white ends at 60 % and green at 80 %; any temporary amount above
  zero shows green.

Data: `availableAmount`, `totalBalance` (total credit), `temporaryAmount` (temporary credit left), `temporaryValidTill` in the page's `data-props`.

## Amount entry (Figma: PeraSure design system, node 9426:18066)

"Apply a loan", entering the amount: "Disbursement amount" (text-secondary #3C4850), the amount (₱ Inter 28, digits
Satoshi 48, decimals Satoshi 18 / 24), and right under it "Flexible amounts from ₱500–₱50,000"; at the bottom, pinned
above the keypad like it: the term pills (4 / 6 / 8 Term, Hanken Grotesk SemiBold 16), a 1 px #E0E3E5 line and the
keypad (16 px apart). On taller screens the space between the two groups grows.
The morph to the order details: the caption fades out (gone by halfway), the edit pencil grows
in with the amount on the same progress, the caption riding with the amount row, the pills moving up into the card; the line leaves and
comes back with the keypad.

## With credit limit increase (`with-credit-limit.html`)

The same page, opening with the Credit limit increase animation full screen — the deliverable itself,
`../credit-limit-coins/baked/baked-heap.html`, loaded in a frame (not a copy) by `intro.js` / `intro.css` (the only difference
from `index.html`; keep the two pages' markup in step). Its numbers come from the card: the amount goes up from
(available − temporary) to the available amount, +temporary, valid until Nov 20 2026 (₱30,000 → ₱40,000 by default), so it
ends on the card's number. 3 s after it ends (`creditlimit:done`) it closes in to the home card — the same interaction as
picking a term in "Apply a loan", where the full page closes in to the order card, and built the same way in React + Motion
(`introExit()` in `withdraw.js`; `intro.js` only hands over): one progress 0→1 in a Motion value, animated with the page's
spring (`this.spring()`, Tune → Motion feel; Smooth = stiffness 240, damping 30) and the same rest thresholds as the sheet's
morph; its change event writes the styles straight to the DOM (no React renders), with the sheet's windows and travel
distances (`MT.Y`).

Timing follows the card-morph skill (`.claude/skills/perasure-card-morph`): the page's spring, never sped up for a shorter
travel. This exit's longest edge travels ≈ 508 px to the home card, longer than the loan morph's 378 px (design size), so it
is the same spring stretched in time by s = 508 / 378 ≈ 1.34 (stiffness ÷ s², damping ÷ s, same damping ratio; s is at least
1 and at most 2.5): the edges move at the same speed and settle on the same curve, for a little longer (≈ 0.85 s). It ends
at withdraw's own pixel threshold (0.378 px, 3.78 px/s) over that travel. (Before, s was the ratio to the loan morph on the
current screen and could drop to 0.6, so on shorter phones the exit ran quicker than the loan morph.)

Performance (low-end phones, 60 fps): every per-frame change is a transform or an opacity on its own layer — the closing
box is the frame's box scaled with a transform (its rounded overflow is the clip; its content gets the inverse transform),
not a clip-path (a full-screen repaint every frame); its colour is two flat layers; the glow is a copy inside the box; the
card's shadow is a layer that fades in; the bar's fills are revealed by two opposite slides; everything that moves is
promoted for the exit only; a value is written only when it changes; the Credit limit page's star twinkle is stopped. The
amount's tracking and colour (the only text layout) change in 24 steps during the fast first half. Measured with the CPU
slowed 6× (whole exit): layout 52 → 14 ms, paint 81 → 35 ms, raster 109 → 31 ms; main-thread time per frame 20.8 → 16.4 ms.

What happens:

- the Credit limit screen's edges close in to the card's exact box, corners rounding to 24, colour turning from the dark to
  the card's blue (its page turns see-through so that colour shows). Nothing of it is ever cut by the closing edges: its
  number block leaves with the number (same path, shrinking to the card's scale) and fades out with a little blur; its
  artwork travels with the box — centre to the same relative spot inside it — and shrinks, the coins blurring out first,
  the four stars moving up and fading a little later;
- the card is lifted above that screen for the length of the exit with no background of its own — the closing screen is its
  background; at rest the card takes the blue back and the screen is removed (identical box and colour: nothing fades over);
- the amount is the same element the whole way: the card's real amount starts at the big number's place, size, tracking and
  colour and settles on the progress; decimals fade in. While it is still larger than its own size, what is under it
  (legend rows, bar) makes way, as a layout change would, so nothing runs into the digits;
- what sits on the card's bottom rides the closing box's bottom edge: the Withdraw pill comes in halfway through and moves up with that edge until the end; the glow under it
  brightens slowly from halfway, always at the bottom;
- the rest of the card comes in early (overlapping what leaves — the card is never empty). Its details — label and info,
  the two legend rows, the bar's track — are secondary content, so as in the card-morph skill each plays the same clocked
  entrance (0.34 s, ENTER curve, rising its `MT.Y` distance into focus from a 3 px blur), started when the progress reaches
  0.2 / 0.3 / 0.3 / 0.36 / 0.38; on the progress alone their rise was over while the box was still closing fast. The bar's
  fills (revealed left to right) and last the card's shadow stay on the progress: they are the card itself;
- around it, nothing is cut by the box either: the cards below ride its bottom edge up (pushed, like the pill) while they
  fade in one after another, the logo row rides its top edge down, and the floating tab bar settles first so the content
  passes under a solid bar.

Checked frame by frame (slowed 20×) against the motion guidelines (Emil Kowalski's
web-animation-design: blur to bridge crossfades, paired elements on one progress, transform / opacity only).

A tap after the animation has ended skips the rest of the 3 s. While the intro plays the home's runtime does not start
(`boot.js` waits), so nothing competes with the coins; the home is built during the hold. Afterwards the frame is removed.

## Confirm (order details)

The button follows Figma 10168:26475 (Bottom nav btn, button only): 48 tall, Label/md; disabled = `--color-action-bg-primary-
disabled` with `--color-text-disabled`, enabled (agreement ticked) = `--color-action-bg-primary-default` with
`--color-text-inverse` — token values read at runtime so the 0.2 s colour change can animate.

Tapping it while disabled (`confirmTap`): the page scrolls to the bottom on the page's spring (Tune → Motion feel), and as
it arrives the agreement's empty circle ripples — a brand-blue ring grows out of it to 2.4× while fading, 0.6 s on the
ENTER curve, twice (`nudgeAgree`). No error state: nothing else changes. A touch on the page stops the scroll;
reduced motion jumps and skips the ripple.

## Header and bottom bars

Home and the loan screen ("Apply a loan" and the order details) use the PeraSure standard bars (repo `CLAUDE.md` →
"Header and bottom bars", same as the Change co-maker demo), from the tokens (`../../tokens/tokens.css`, loaded before
`perasure-ds.css`, which keeps its own values and gains the names it lacks):

- **Progressive blur on** (default): the five backdrop-blur bands under the token veils `--gradient-top-nav-filled` /
  `--gradient-bottom-nav-filled`; the header's bands only while content is scrolled under it.
- **Off**: the token gradients only — header subtle-80 → 40 → 0, bottom default-0 → 60 → 80 — and the bottom one fades
  out over the last stretch of scroll (as tall as the bar), gone at the very bottom (home: `homeScroll`; order details:
  `updEnd`). The order details are a secondary page (二级页面): their bottom gradient is #EBF0EF instead (same stops; no token holds that colour). On the order details the Confirm bar's veil is its own layer (the bar itself never fades: it hosts the blur
  bands), in with the confirm chrome and out at the end of the scroll.

## Tune (bottom left on home; top right on the loan screen)

Progressive blur on (default) / off — the two looks of the bars above, same as the Change co-maker demo's Tune (before,
this was a separate "With gradient blur" page) — the card's available amount / total credit / temporary credit left, and the motion feel
(Smooth / Snappy / Gentle). A change is saved on the phone and reloads the page with it. Links can set them too:
`?blur=1` / `?blur=0`, `?available=45000`, `?total=50000`, `?temporary=10000`.
