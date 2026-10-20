# PeraSure motion demos — agent guide

Phone-first motion prototypes for PeraSure, served by GitHub Pages from `main` / root.

- Live picker: https://samgestudio-dev.github.io/Perasure/
- Each demo is opened and tested on a real phone (iOS Safari and Android Chrome).
- The owner is a designer; reply in plain language and keep the picker page tidy.

## Layout

```
index.html                 demo picker (the only page you edit when adding a demo)
demos/<slug>/index.html    main / recommended variant of a demo
demos/<slug>/<variant>.html  other variants of the same demo (optional)
README.md                  human-facing summary + demo table
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
