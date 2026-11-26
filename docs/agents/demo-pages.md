# Demo pages: adding one and what every page must do

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** you add, rename or remove a demo on the picker, or build / change any demo page (phone rules, header and bottom bars, motion, shared environment, Claude Design bundles).

## Adding a demo

1. Put the demo's file(s) in `prototypes/<slug>/` — for a new one, start from a copy of `prototypes/_template/index.html`
   (for a PeraSure app screen, from `prototypes/coupon-system/index.html`, built on the shared components). The recommended variant is `index.html` (exception:
   `credit-limit-coins` is split into `baked/` — the deliverable, `baked/baked-heap.html` + its css/js/`baked.json`, plus the
   `baked-shockwave.html` variant (same data and css, own js) — and
   `physics-tuner/` — the engineering file for tuning the coin paths and baking them, never shipped; the top-level
   `index.html` and `baked-heap.html` there only redirect old links);
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
   - Newest demo goes at the top of the array unless the owner says otherwise. Order set by the owner (keep it, in the
     `DEMOS` array and the README table): Credit limit increase, Withdraw fund flow, Order submit, OTP sheet morph,
     Loading page, Landing page (website). Newer ones sit above them, newest first; "PeraSure Dev Mode" (it replaced the gallery)
     stays right after Coupon system.
   - Only edit the `DEMOS` array for a normal addition; don't restyle the picker unless asked.
   - The picker and the player are React + Material UI 5 (browser builds in `vendor/`, no JSX, no build step;
     `PG.h` = `React.createElement`). Style through the theme in `assets/playground-ui.js`, not per page.
   - All Playground interface motion is Motion (`vendor/motion@14.4.0/motion-react.js`, `PG.m` / `PG.Mo`), never CSS
     transitions or the MUI ripple: springs from `PG.T` (ui / snap / pop / layout, defined by visualDuration + bounce),
     `whileTap: PG.TAP` on everything pressable, `layoutId` for indicators that move between options, `AnimatePresence`
     for content that swaps (button labels/icons via the player's `Swap`), and `layout` on cards so size changes
     animate. Exception: the player's timeline is painted per frame with no easing (it must show the exact time);
     the one exception is switching animations, when it glides back to 0 s in a fixed 0.2 s before the next one may start.
     An element that is still on the page after an interaction (or replaced by a similar one) stays put and only
     changes what differs (text swap, colour, size); it never disappears and plays its entrance again. Reloads keep
     the previous state on screen until the new one is ready (e.g. the renderer switch keeps a still frame).
3. Make the option screenshots shown on the index: `python3 tools/prototype-thumbs.py <slug>` (writes
   `prototypes/<slug>/preview.webp`, `preview-<variant>.webp`; adjust its `WAIT` if the first screen needs time).
4. Add a row to the demo table in `README.md`.
5. Removing or renaming a demo: update the folder, the `DEMOS` entry and the README row together.

## Requirements for a demo page

Demos are full-screen phone pages, not device mockups. The withdraw demo is the reference
implementation (`prototypes/withdraw-fund-flow/`, see the comments in its `phone-fit.js`; its README shows how a Claude Design
bundle was unpacked onto the shared environment):

- Designed at 360 CSS px wide: set the viewport to `width=360` on touch devices so the browser
  scales it to the screen, and fill the visible height (no green backdrop / phone frame / fake status bar).
  **Exception (owner): pages built on the shared components are responsive** — layouts fill the width with the 16 px
  page margins (`shared/ps-ui/phone-fit.js`). How big they are drawn is a fit mode (Tune → "Screen fit"; the owner is
  comparing them on phones): **capped zoom** (default: the 360 design enlarged with the screen, at most 1.15×), **capped zoom · rem**
  (the same factor through the root font size, so only rem sizes grow; the hosted Withdraw demo stays 1:1), **1:1**
  (true size: text felt small on big iPhones) or **full zoom** (the old 360 scaling). Load `phone-fit.js` after
  `PSTune.setup`. Check at 360, 390 and 430 px wide.
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
- **Header and bottom bars** (PeraSure standard since tokens v2026.11.17, owner; components `PS.TopBar` / `PS.BottomBar` / `PS.Navigator`
  / `PS.Bands`): **no progressive blur** (the Figma effect styles Top/Bottom-nav-effect are off; the Tune setting and `?blur=` are gone).
  Each bar is one token veil, chosen by the kind of page:

  | Page | Header | Bottom |
  |---|---|---|
  | Primary (the Home / Payment / Account tabs) | `--gradient-top-nav-filled` (Ambient #F0F5F4 80 → 40 → 0) | tab bar `--gradient-bottom-primary-nav-filled` (white 0 → 60 → 80) |
  | Secondary (二级页面: every other page) | solid page colour (`--color-surface-page-default`) | `--gradient-bottom-secondary-nav-filled` (Ambient 0 → 60 → 80) |
  | Amount entry and order page (not secondary) | `--gradient-top-nav-filled` | `--gradient-bottom-secondary-nav-filled` (`BottomBar{secondary}`) |
  | Page sheet's foot (the coupon picker's total + Confirm) | — | `--gradient-bottom-secondary-nav-filled` |

  A bottom action bar on a tab page uses the primary gradient. The glass buttons and the tab bar's pill keep their own normal
  background blur (that is the glass, not a progressive blur). The veils come and go with the scroll as before: the header's appears as
  content scrolls under it; on a scrolling page the bottom one fades out over the last stretch of scroll (as tall as the bar), so at
  the very bottom it is gone; a page that does not scroll shows none. Both extend behind the iOS status bar / search bar. The Withdraw
  demo (its own bars in withdraw.js / withdraw.css, `BLUR = false`) and Change co-maker follow the same table.
  The old #EBF0EF secondary bottom and `--gradient-bottom-nav-filled` are retired (`tokens/legacy/2026.11.12.css` keeps the old names).
- Motion: prefer Motion (formerly Framer Motion; `vendor/motion@14.4.0/motion-react.js`) with `LazyMotion` + `m` (strict), drive continuous values with motion values
  instead of React state, animate only `transform` / `opacity` where possible, and respect
  `prefers-reduced-motion`.
- Shared environment, not bundles (owner's rule for new prototypes): the app already ships its fonts, GSAP, React and
  Motion, so a prototype links them from the repo instead of inlining them — the page's own file then holds only
  what the prototype adds, which is what developers would actually ship. Fonts:
  `<link rel="stylesheet" href="../../assets/fonts/fonts-2026.11.17.css">` and `font-family: var(--ps-font-text | --ps-font-body |
  --ps-font-num)` (emphasised amounts use `--ps-font-num`: Reddit Sans, ₱ included — see "Number font" in [app.md](app.md)). Libraries:
  `<script src="../../vendor/…">` with a relative path. Never a CDN at runtime, no build step, no base64 fonts or
  pasted library code in the page. Data and code specific to the prototype (a recording, an SVG) may stay inline or
  sit next to it in its folder. Existing prototypes that were made as single files stay as they are unless the owner
  asks. A Claude Design bundled export (below) should be unpacked into such a plain page when practical.
- Claude Design bundled exports (`__bundler/template` + dc-runtime): the runtime loads React on its own and
  does not wait for it, so any bundled script that needs `window.React` at load time (e.g. the Framer Motion
  UMD, `window.__FM_UMD`) races it — iOS Safari loses and shows `[bundle] ReferenceError: Can't find variable:
  React`. Fix: in the template, add `<script src="<react uuid>">` and `<script src="<react-dom uuid>">` (uuids
  from `__bundler/ext_resources`) before the runtime's `<script src>`; the unpacker runs template scripts in
  order and the runtime then reuses that React.
- Unpacking a Claude Design bundle (as done for Withdraw): decode `__bundler/manifest` (base64, gzip when `compressed`), keep
  the `<x-dc>` markup in the HTML, move the `<script data-dc-script>` text to a `.js` file that a small boot script fetches
  into that element before loading `runtime/dc-runtime.js`; set `window.__resources` (the page's resource ids → files,
  e.g. `framerMotion` → `vendor/motion@14.4.0/motion-react.js`, which needs `features = domMax`); load React/ReactDOM from
  `vendor/` before the runtime (it then never reaches the CDN); fonts from `assets/fonts/`. Verify pixel-identical frames.
- Don't break existing prototypes: never edit another prototype's files when adding a new one.
