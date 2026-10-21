# PeraSure Playground — agent guide

Phone-first motion prototypes for PeraSure, served by GitHub Pages from `main` / root.

- Live picker: https://samgestudio-dev.github.io/Perasure/
- Each demo is opened and tested on a real phone (iOS Safari and Android Chrome).
- The owner is a designer; reply in plain language and keep the picker page tidy.

## Layout

```
index.html                 picker ("Playground"): "Prototypes" tab (DEMOS array) + "Animations" tab (reads animations/animations.js)
assets/playground-ui.js    shared Material UI theme + icons for the picker and the player (window.PG)
prototypes/<slug>/index.html    main / recommended variant of a demo
prototypes/<slug>/<variant>.html  other variants of the same demo (optional)
animations/animations.js       Lottie registry (LOTTIES array) — shared by the picker and the player
animations/player.html         player, one animation at a time: player.html?a=<slug>[&r=gsap] (Lottie / GSAP tabs)
animations/<slug>/             <slug>.json (+ <slug>.lottie, preview.png, gsap/<module>.js)
tools/                     flatten-lottie-masks.py, flatten-svg-masks.py (Safari mask-blur fixes)
vendor/<lib>@<version>/    pinned libraries: lottie-web, gsap (+ plugins; esm/ = ES modules), react, react-dom, mui-material,
                           motion (motion-react.js = React API, motion.js = vanilla; both set window.Motion)
README.md                  human-facing summary + demo / animation tables
.nojekyll                  keep: Pages serves files as-is
```

`<slug>` is lowercase-kebab-case, e.g. `withdraw-fund-flow`, `repayment-success`.

## Adding a demo

1. Put the demo's file(s) in `prototypes/<slug>/`. The recommended variant is `index.html`;
   name other variants by what differs (`with-blur.html`, `snappy-spring.html`).
2. Register it in the `DEMOS` array in the root `index.html` (inside the `<script>`):

   ```js
   {
     title: 'Repayment success',          // sentence case, short
     tag: 'Loan',                          // optional small pill: product area / status
     desc: 'One sentence: what flow it covers and what motion to look at.',
     variants: [                           // first entry = recommended ("Recommended" label when there are several)
       { name: 'Standard', note: 'What is special about this variant', href: 'prototypes/repayment-success/index.html' },
       { name: 'Gentle spring', note: 'Slower, softer settle', href: 'prototypes/repayment-success/gentle.html' }
     ]
   }
   ```

   - Link to the file explicitly (`.../index.html`), not the folder — folder links break when the repo is opened locally.
   - Newest demo goes at the top of the array unless the owner says otherwise.
   - Only edit the `DEMOS` array for a normal addition; don't restyle the picker unless asked.
   - The picker and the player are React + Material UI 5 (browser builds in `vendor/`, no JSX, no build step;
     `PG.h` = `React.createElement`). Style through the theme in `assets/playground-ui.js`, not per page.
   - All Playground interface motion is Motion (`vendor/motion@14.4.0/motion-react.js`, `PG.m` / `PG.Mo`), never CSS
     transitions or the MUI ripple: springs from `PG.T` (ui / snap / pop / layout, defined by visualDuration + bounce),
     `whileTap: PG.TAP` on everything pressable, `layoutId` for indicators that move between options, `AnimatePresence`
     for content that swaps (button labels/icons via the player's `Swap`), and `layout` on cards so size changes
     animate. Exception: the player's timeline is painted per frame with no easing (it must show the exact time);
     the one exception is switching animations, when it glides back to 0 s in a fixed 0.2 s before the next one may start.
3. Make the option screenshots shown on the index: `python3 tools/prototype-thumbs.py <slug>` (writes
   `prototypes/<slug>/preview.webp`, `preview-<variant>.webp`; adjust its `WAIT` if the first screen needs time).
4. Add a row to the demo table in `README.md`.
5. Removing or renaming a demo: update the folder, the `DEMOS` entry and the README row together.

## Adding a Lottie animation

1. Put the files in `animations/<slug>/`: the Lottie JSON (played), the `.lottie` (download only) and a still
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

## Requirements for a demo page

Demos are full-screen phone pages, not device mockups. The withdraw demo is the reference
implementation (`prototypes/withdraw-fund-flow/index.html`, see the comments in its head script):

- Designed at 360 CSS px wide: set the viewport to `width=360` on touch devices so the browser
  scales it to the screen, and fill the visible height (no green backdrop / phone frame / fake status bar).
- `touch-action: manipulation` on interactive elements — iOS Safari otherwise delays every tap ~300ms.
- iOS Safari 26+ (floating toolbar): `viewport-fit=cover`, extend the top/bottom bars behind the status bar
  and search bar; bottom nav / primary button sits 24px above the search bar. `?debug=1` on the withdraw
  demo shows the measured insets.
- Bottom sheets with text inputs must avoid the on-screen keyboard: lift the sheet with a transform using
  `visualViewport` (`offsetTop + height` = keyboard top), and don't re-fit / re-zoom the page on resize while
  an input has focus (Android keyboards resize the viewport). See the OTP demo's head script.
- iOS Safari 26+ tints the status bar and toolbar from `position:fixed` layers that reach the screen edges.
  Don't leave a coloured fixed overlay (scrim, backdrop) in the page, even at `opacity:0`: use
  `display:none` when closed, and give tap-outside catchers no background.
- Motion: prefer Motion (formerly Framer Motion; `vendor/motion@14.4.0/motion-react.js`) with `LazyMotion` + `m` (strict), drive continuous values with motion values
  instead of React state, animate only `transform` / `opacity` where possible, and respect
  `prefers-reduced-motion`.
- Keep a demo self-contained in one HTML file (inline or bundled assets) so Pages needs no build step.
  Shared libraries may instead be loaded from `vendor/` with a relative path
  (`../../vendor/gsap@3.15.0/gsap.min.js`); never from a CDN at runtime.
- Claude Design bundled exports (`__bundler/template` + dc-runtime): the runtime loads React on its own and
  does not wait for it, so any bundled script that needs `window.React` at load time (e.g. the Framer Motion
  UMD, `window.__FM_UMD`) races it — iOS Safari loses and shows `[bundle] ReferenceError: Can't find variable:
  React`. Fix: in the template, add `<script src="<react uuid>">` and `<script src="<react-dom uuid>">` (uuids
  from `__bundler/ext_resources`) before the runtime's `<script src>`; the unpacker runs template scripts in
  order and the runtime then reuses that React.
- Don't break existing prototypes: never edit another prototype's files when adding a new one.

## Checking before you push

- Open the picker and every new link at a phone viewport (e.g. 390×664, touch, DPR 3) and confirm the demo
  loads with no console errors.
- Tap through the main flow once.

## Caching (phones keep old copies otherwise)

GitHub Pages lets browsers reuse a file for 10 minutes. Before committing a change to the Playground pages,
`animations/` or `assets/`, run `python3 tools/stamp.py`: it stamps the shared scripts (`?v=<stamp>`), and the
index adds that stamp to every link and thumbnail, so phones load the new version right away. The player
fetches animation JSON with `cache: 'no-cache'` and loads GSAP modules with a per-load token.

## Publishing

- Commit to `main` and push; GitHub Pages redeploys automatically (about a minute).
- Pages is configured in the repo settings (source: `main`, folder `/`). If the live link 404s, check that
  setting and that the repo is public.
- Give the owner the direct demo link as well as the picker link.
