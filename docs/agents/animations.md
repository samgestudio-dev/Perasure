# Adding a Lottie / GSAP animation

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** you add or fix an animation in `animations/`.

## Adding a Lottie animation

1. Put the files in `animations/<slug>/`: the Lottie JSON (played), the `.lottie` (kept for hand-off; the player does not show it) and a still
   `preview.png` (thumbnail on the picker; never show animated thumbnails — one animation plays at a time).
2. Add an entry to `LOTTIES` in `animations/animations.js` (field reference at the top of that file):
   `intro` / `loop` frame ranges from the hand-off README (they match the `intro` / `loop` markers in the
   JSON); omit both for a one-shot; `success` for a two-part loading → success animation.
3. GSAP version (optional, shown under the player's "GSAP" tab): put the module(s) in `animations/<slug>/gsap/` and
   set `gsap` (and `gsapSuccess` for coin-style) in the entry. A module must export `create…(container,
   { autoplay })` returning `{ svg, timeline, … destroy() }` plus `FPS` / `FRAMES` — the format produced by
   lottie2gsap. It imports `"gsap"`, which the player's import map points at `vendor/gsap@3.15.0/esm/`.
   If its inline SVG has nested `<mask>`s, run `python3 tools/flatten-svg-masks.py <module>.js` (same Safari
   blur as below).
   Then run `python3 tools/unscale-gsap-svg.py <module>.js`: lottie2gsap draws shapes at 1/100 size inside
   `scale(0.01)` groups and enlarges them 100×; nested, that glitches on iOS Safari (Customer service chat's dots).
4. Add a row to the Lottie table in `README.md`. Don't edit `player.html` for a normal addition.
5. If any layer combines masks (an add mask plus intersect / subtract masks), run
   `python3 tools/flatten-lottie-masks.py in.json out.json` (needs `pip install skia-pathops`) and rebuild the
   `.lottie` from the result. lottie-web draws such layers with nested SVG `<mask>`s, which iOS Safari renders
   blurry when the art is scaled up; the script merges them into one exact clip shape (pixel-identical in Chrome).
6. Check for bitmap-traced shapes: `python3 tools/smooth-traced-path.py --report animations/<slug>/<slug>.json`.
   A traced path (many vertices on a half-pixel grid) shows jagged edges once scaled; rebuild it with
   `python3 tools/smooth-traced-path.py in.json out.json "<layer name>" 8 0.5`, then put the same path into
   the GSAP module's inline SVG and rebuild the `.lottie` (see the Customer service bubble).
7. Renderer: lottie-web SVG (`vendor/lottie-web@5.12.2/lottie_svg.min.js`). Don't switch to the canvas
   renderer — it mis-renders the masks in Doc verify and Safe transaction.
