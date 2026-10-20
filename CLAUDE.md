# PeraSure motion demos — agent guide

Phone-first motion prototypes for PeraSure, served by GitHub Pages from `main` / root.

- Live picker: https://samgestudio-dev.github.io/Perasure/
- Each demo is opened and tested on a real phone (iOS Safari and Android Chrome).
- The owner is a designer; reply in plain language and keep the picker page tidy.

## Layout

```
index.html                 picker: "Motion demos" tab (DEMOS array) + "Lottie" tab (reads lottie/animations.js)
demos/<slug>/index.html    main / recommended variant of a demo
demos/<slug>/<variant>.html  other variants of the same demo (optional)
lottie/animations.js       Lottie registry (LOTTIES array) — shared by the picker and the player
lottie/player.html         Lottie player, one animation at a time: player.html?a=<slug>
lottie/<slug>/             <slug>.json (+ <slug>.lottie, preview.png)
vendor/<lib>@<version>/    pinned libraries: lottie-web, gsap (+ plugins), react, react-dom
README.md                  human-facing summary + demo / animation tables
.nojekyll                  keep: Pages serves files as-is
```

`<slug>` is lowercase-kebab-case, e.g. `withdraw-fund-flow`, `repayment-success`.

## Adding a demo

1. Put the demo's file(s) in `demos/<slug>/`. The recommended variant is `index.html`;
   name other variants by what differs (`with-blur.html`, `snappy-spring.html`).
2. Register it in the `DEMOS` array in the root `index.html` (inside the `<script>`):

   ```js
   {
     title: 'Repayment success',          // sentence case, short
     tag: 'Loan',                          // optional small pill: product area / status
     desc: 'One sentence: what flow it covers and what motion to look at.',
     variants: [                           // first entry = recommended, shown highlighted
       { name: 'Standard', note: 'What is special about this variant', href: 'demos/repayment-success/index.html' },
       { name: 'Gentle spring', note: 'Slower, softer settle', href: 'demos/repayment-success/gentle.html' }
     ]
   }
   ```

   - Link to the file explicitly (`.../index.html`), not the folder — folder links break when the repo is opened locally.
   - Newest demo goes at the top of the array unless the owner says otherwise.
   - Only edit the `DEMOS` array for a normal addition; don't restyle the picker unless asked.
3. Add a row to the demo table in `README.md`.
4. Removing or renaming a demo: update the folder, the `DEMOS` entry and the README row together.

## Adding a Lottie animation

1. Put the files in `lottie/<slug>/`: the Lottie JSON (played), the `.lottie` (download only) and a still
   `preview.png` (thumbnail on the picker; never show animated thumbnails — one animation plays at a time).
2. Add an entry to `LOTTIES` in `lottie/animations.js` (field reference at the top of that file):
   `intro` / `loop` frame ranges from the hand-off README (they match the `intro` / `loop` markers in the
   JSON); omit both for a one-shot; `success` for a two-part loading → success animation.
3. Add a row to the Lottie table in `README.md`. Don't edit `player.html` for a normal addition.
4. Renderer: lottie-web SVG (`vendor/lottie-web@5.12.2/lottie_svg.min.js`). Don't switch to the canvas
   renderer — it mis-renders the masks in Doc verify and Safe transaction.

## Requirements for a demo page

Demos are full-screen phone pages, not device mockups. The withdraw demo is the reference
implementation (`demos/withdraw-fund-flow/index.html`, see the comments in its head script):

- Designed at 360 CSS px wide: set the viewport to `width=360` on touch devices so the browser
  scales it to the screen, and fill the visible height (no green backdrop / phone frame / fake status bar).
- `touch-action: manipulation` on interactive elements — iOS Safari otherwise delays every tap ~300ms.
- iOS Safari 26+ (floating toolbar): `viewport-fit=cover`, extend the top/bottom bars behind the status bar
  and search bar; bottom nav / primary button sits 24px above the search bar. `?debug=1` on the withdraw
  demo shows the measured insets.
- Motion: prefer Framer Motion with `LazyMotion` + `m` (strict), drive continuous values with motion values
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
- Don't break existing demos: never edit another demo's files when adding a new one.

## Checking before you push

- Open the picker and every new link at a phone viewport (e.g. 390×664, touch, DPR 3) and confirm the demo
  loads with no console errors.
- Tap through the main flow once.

## Publishing

- Commit to `main` and push; GitHub Pages redeploys automatically (about a minute).
- Pages is configured in the repo settings (source: `main`, folder `/`). If the live link 404s, check that
  setting and that the repo is public.
- Give the owner the direct demo link as well as the picker link.
