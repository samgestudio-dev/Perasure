# Change co-maker

"Invite your co-maker" page: tapping **Change** turns the co-maker card into the "Change your co-maker" form; **Cancel**
or **Save** turns it back. One page, one card — the two Figma frames are its two states.

Figma: PeraSure design system, section 10168:26588 — state A *Your co-maker* (frame 10168:26372), state B *Change your
co-maker* (frame 10168:26423).

## Files

| File | What it is |
| --- | --- |
| `index.html` | the page: markup and styles, all values from the PeraSure tokens (`../../tokens/tokens.css`, `.ps-text-*` type styles) |
| `co-maker.js` | the page code: the card morph, the form (name, relationship, mobile), Copy |
| `tune.js`, `tune.css` | **prototype only** — the Tune panel (top right): progressive blur on / off, motion feel; delete them and their two lines in `index.html` for production |
| `phone-fit.js` | phone fitting and iOS Safari 26 edge-to-edge, copied from the withdraw demo, plus: no iOS zoom on input focus, no re-fit while typing |
| `assets/` | the design's icons, downloaded from Figma (link, co-maker, edit, copy, shield, chevrons, divider) |

Shared from the repo: the tokens, the app's fonts (`assets/fonts/`) and Motion 14.4.0 (`vendor/motion@14.4.0/motion.js`).
Open it through a web server (GitHub Pages, or `python3 -m http.server` in the repo root).

## The morph

Built like the withdraw fund flow's morphs (`withdraw.js`: `tweenMp`, `introExit`):

- **One progress** k (0 = A, 1 = B) in a Motion value, animated with the withdraw page's spring (Smooth: stiffness 240,
  damping 30). Its change event writes every style straight to the DOM. A tap mid-morph re-targets the same value, so it
  turns around smoothly from where it is.
- **Same spring as withdraw** (Smooth: stiffness 240, damping 30), so the acceleration and curve — the feel — are the
  same. The time is not forced to match: the spring stops when the longest travel here (the pill, ≈ 202 px) is within
  withdraw's own pixel threshold (≈ 0.38 px), so this shorter move settles a little sooner — ≈ 535 ms against 572 ms
  (95 % of the way at ≈ 290 ms in both). The first version scaled the spring to the same *speed* over the shorter
  distance; that made it ≈ 40 % quicker (95 % at 175 ms) and felt rushed.
- **The card box** grows 182 → 296 (its rounded edge is the clip); the card below rides its bottom edge (a transform; the
  page's layout is committed once, at rest).
- **Shared elements stay one element**: the avatar tile (40 → 48 px, icon 24 → 32); the **header next to it** — its two
  lines travel with the tile (always centred on it) and **change their words on the way**: "Sam Ge" → "Change your
  co-maker", the number → "Shares responsibility for your loan" (same type styles in both states, so only the words swap:
  old words rise out, new ones rise in, a 3 px blur bridging them, line 2 a beat after line 1); the **Change pill travels to Save's
  place and becomes Save** (light fill → primary, "Change" leaves as "Save" arrives, overlapping so it is never blank).
  Its path is front-loaded (1 − (1 − k)²) so it is past the Mobile row before that row comes in.
- **The form opens empty** — Name, Relationship and Mobile all show their placeholders — so the current co-maker's name
  and number leave with the rest of state A; nothing is carried into the form.
- **What leaves** (caption, link box, note) rises its MT.Y distance and blurs out early (gone by k ≈ 0.4).
- **The form rows come in on a clock**, as withdraw brings in its secondary layers (LAYER_IN / REVEAL): each row plays
  the same entrance — 0.34 s on withdraw's ENTER curve, rising 8 px into focus from a 3 px blur — starting once the card
  has made room for it (the Save pill and Cancel, riding the bottom edge, are past its spot): Name at k 0.42,
  Relationship at 0.66, Mobile at 0.84 — ≈ 95 / 145 / 210 ms in, about 60 ms apart. (On the progress alone, Name and
  Relationship arrived while the card was still moving fast and their rise was over in 50–80 ms.) Closing, they leave
  on the progress, bottom-up. Cancel rides the bottom edge and comes in last.
- "Check verification status" turns disabled while the form is open (a disabled layer fades over it).
- **Progressive blur** on the header and bottom bar, as withdraw's: five backdrop-blur layers (0.6 → 1.4 → 3 → 5.5 →
  10 px, fractions of the token `--blur-backdrop-bg`), each masked to a narrower band at the bar's outer edge, under the
  token colour veil. The header's bands run only while the page is scrolled under it. (Headless Chrome's software
  renderer draws these with stray reflections; with GPU compositing — phones — they render correctly.)
- **Tune → Progressive blur Off**: no bands; the header and bottom bar use the PeraSure bar gradients without blur
  (token gradients — see "Header and bottom bars" in the repo's `CLAUDE.md`). The bottom one fades out over the last stretch of scroll — as tall as the bar, tied to the scroll
  position — so at the very bottom, with nothing left under the bar, it is gone (a page that doesn't scroll shows none).
- On a short screen the page scrolls with the morph (same spring) so Cancel / Save come to rest just above the bottom bar.
- Per frame: transform / opacity / filter, plus the card's height and the tile's and pill's size (small absolute boxes);
  unchanged values are not rewritten. `prefers-reduced-motion` jumps.
- **Blur on iPhone**: every element that blurs has its own GPU layer for the whole morph, and its filter stays a `blur()`
  (0 px included) until the morph ends. Without this, iOS WebKit (Safari and Chrome on iPhone) drew a dark hairline along
  the edges of a layer it created mid-animation for the blurred title.

Tune (top right) sets the blur and the motion feel (Smooth / Snappy / Gentle — withdraw's three); saved on the phone. Links can set them too: `?blur=1` / `?blur=0`, `?feel=Gentle`. `?slow=10` plays everything 10× slower.

## Behaviour

- Save takes the name if one was entered and the mobile number when it has 10 digits (otherwise the current ones stay),
  and makes a new invite link when the co-maker changed. The number is plain text (no tap-to-call link). Relationship is a native picker.
- The focused field is kept above the on-screen keyboard (the page scrolls; it is not re-fitted while typing).
- Copy puts `https://perasure.ph/g/<code>` on the clipboard; the label reads "Copied" for 1.8 s.
- The back arrow goes to the Playground; "Back home" and "Check verification status" only press.
