PeraSure rebrand demo — golden motion reference
===============================================

What this is
------------
Recorded reference data ("golden" data) for the motions in inventory/motions.json (M-001 … M-139), taken from the
running demo (branch tokens/rebrand-v3, served at http://localhost:8788/). Use it to check a production re-creation of a
motion 1:1: same trigger, same properties, same values over time.

For every take there is:
  curves/<id>.json   the sampled property values, one sample per animation frame (~16.7 ms), t in ms from the trigger
  frames/<id>/       NOT SHIPPED in this hand-off (251 MB of PNG screenshots). Re-record a take with tools/ to get them.
  strip/<id>.png     contact sheet: 10 (12 for long takes) evenly spaced moments from t=0 to the settle time,
                     cropped to the animated area when it is small, each labelled with its t
  video/<id>.mp4     (shipped for the global and flow motions only; component-area videos were left out to keep the
                     hand-off under ~60 MB — use strip/ for those, or re-record) the frames replayed in real time (H.264, 360x828 incl. a time bar). Timing is the frame times,
                     re-encoded by the browser; use curves/ for exact timing, the video only to eyeball.
index.json           one entry per inventory motion: recorded, status, curves / strip / video paths, durationMs,
                     trigger, what t=0 is, notes, and "variants" (extra takes of the same motion, e.g. _close,
                     _reverse, _reduced, _app).
tools/               the recorder (Node 24 + headless Chrome over the DevTools protocol) to re-record a take, or to
                     record your production build with the very same sampler (see "Recording production").

Take ids
--------
M-013 is the main take of motion M-013. Variants: M-013_close (the other direction), M-013_reduced
(prefers-reduced-motion: reduce), M-107_reverse, M-117_app (the same motion hosted in the app), etc. Reduced-motion
samples: M-013_reduced (sheet: the y spring jumps, scrim and content fades still run), M-008_reduced and M-126_reduced
(page change: the opacity crossfade still runs).

Environment of every take
-------------------------
Headless Google Chrome (new headless) via CDP; viewport 360x800 CSS px, deviceScaleFactor 2, mobile, touch emulation on
(taps are Input.dispatchTouchEvent; two drags use the mouse, noted in the take); prefers-reduced-motion: no-preference
unless the id ends in _reduced. The app was opened with ?auto=0&fast=1 (no auto typing, no load waits) unless the take
says otherwise (M-012, M-020, M-127, M-128 run without fast=1 to show loading; M-094 / M-132 without auto=0 to show the
auto-typed code). The gallery stage (shared/stage.html?entry=…&state=…) was used for single components.

curves/<id>.json
----------------
  motionId, name, recordedWith {url, viewport, prefersReducedMotion, date}
  trigger      what was done (JS call, tap, drag, page load)
  t0           what t = 0 is (see "Time alignment")
  setup        what was done before the trigger
  elementSelectors  [{name, selector (CSS, or a JS function evaluated in the page), frame, maxElements, props}]
  settledAt    ms after t0 of the last change (null = never settled: loops, or the take hit its max length)
  endT         ms when sampling stopped (settle + 300 ms quiet, or the max length)
  events       pointerdown / pointerup / click / touch* times relative to t0 (a tap is held 60–220 ms; see each take)
  constants    properties that never changed during the take (their single value)
  samples      [{t, "<element>.<prop>": value, …}] — only the properties that changed are listed per sample
  notes

Property keys: "<name>.<prop>" for a single element; "<name>#<k>.<prop>" when several elements match — #k is the k-th
distinct element in order of first appearance (so an element that leaves and its replacement keep different k: #1 is
usually the old one, #2 the new one); "<name>[i].<prop>" (byIndex takes) is the i-th match in DOM order.
"<name>.count" is how many elements matched in that frame. A null value means the element did not exist in that frame.

  x, y, w, h        getBoundingClientRect() in CSS px (includes transforms and scroll position)
  tx, ty            translate from the computed transform matrix (px)
  sx, sy, rot       scale and rotation (deg) decomposed from the computed transform matrix
  translate/scale/rotate  the individual CSS transform properties when used
  opacity           computed opacity of the element itself;  opacityEffective = product with its ancestors
  blur              px from computed filter blur();  filter = the whole computed filter when it is not just a blur
  backgroundColor, color, borderColor, boxShadow, radiusTL/radiusBL, clipPath, height, width, padding, fontSize,
  letterSpacing     computed CSS values;  afterOpacity / afterBoxShadow = the ::after pseudo element
  scrollTop         of a scroller;  --ps-top-fade etc. = CSS custom properties
  text              textContent (whitespace collapsed, 60 chars);  class = className
  lottie.lottie     every registered lottie-web animation as "file:frame" (p = paused), "|" separated
  gsap.gsapTime     gsap.globalTimeline.time() in seconds (in the credit-limit frame where noted)

Time alignment
--------------
Every take has its own t0, stated in the file (and in index.json):
  * "pointerdown of the tap" — press motions (whileTap starts on pointer down);
  * "click of the tap" — state changes made by onClick (the touch was held ~60 ms, so pointerdown is at about -60 ms);
  * "trigger call" — t0 is taken right before the JS call (APP.go / APP.open / APP.say / APP.set …) in the same task;
  * "first frame where …" — for motions started by a timer or by data (loading, countdowns, the OTP step after the
    random send wait, Order submit's later lines): t0 is the first animation frame in which the condition is true.
    In that frame the element already exists with its initial styles, so t = 0 shows the "from" values;
  * "navigation start" — mounts on page load (the splash, lottie loops, marquees).
Sampling is one value per requestAnimationFrame (~16.7 ms at 60 Hz). Values are what getComputedStyle reports in that
frame, i.e. the value about to be painted.

How to compare a production take with this reference
-----------------------------------------------------
1. Record the production motion the same way (same viewport, same trigger, same t0 definition) — ideally with
   tools/sampler.js injected into the production page (it is framework-free), so both sides are measured alike.
2. Time-align on the trigger: t = 0 on both sides as defined above. Do not align on the first visible change unless the
   reference says t0 is a state condition.
3. Compare per property, not per frame: linearly interpolate the reference samples at the production sample times
   (or both onto a 1 ms grid) and compare value by value.
4. Suggested tolerances:
     position / size / translate / scrollTop   ±2 px
     opacity                                   ±0.02
     scale                                     ±0.005 (±0.01 for scales below 0.95)
     rotation                                  ±1 deg
     blur                                      ±0.3 px
     colours                                   ±3 per RGB channel, alpha ±0.02
     timing                                    ±16 ms (one frame): compare the times at which each property passes
                                               10 %, 50 % and 90 % of its total change, its start time and its settle
                                               time (last change), rather than value-at-time alone
     lottie frame                              ±1 frame;  GSAP timeline time ±0.02 s
5. Springs: compare the overshoot (peak beyond the target, in px or %), the time of the peak and the settle time as
   well as the curve; a different spring that still meets ±2 px at every sample is acceptable.
6. Scroll-linked motions (M-010, M-011, M-040, M-114, M-115) have no easing in time: compare the property against
   scrollTop (both are in the samples), not against t.
7. Loops (lottie, marquees, caret, busy dots, star twinkle, dashed ring): compare period and phase within the recorded
   window; the take never settles.
8. Use strip/ and video/ to check what the numbers cannot say (layering, clipping, which element is in front).

Known limits
------------
* Takes with random waits (app network latency, OTP send / verify) contain one sample of that randomness: M-127,
  M-020, M-132 (marked partial in index.json, with what to compare instead); in M-094 the typing is aligned to the
  start of step 1 but the verify wait after the 6th digit is random (450–950 ms).
* M-099 / M-133 (Withdraw keypad, first open) were RE-RECORDED on 2026-11-24 after the demo regression was fixed
  (withdraw.js mounted the keypad inside AnimatePresence initial:false, which skipped the first-open cascade). The new
  takes show the key-by-key REVEAL(i): key[0] opacity 0 -> 1, y 10 -> 0, scale 0.94 -> 1 from ~70 ms to ~390 ms after
  the tap, the ⌫ key from ~400 ms to ~720 ms. They are authoritative.
* Some triggers are synthetic (flag syntheticTrigger in index.json): the motion code that runs is the demo's own, only
  the way it was started differs (e.g. M-097 forces available() = false, M-119 forces the intro fallback, M-044/M-045
  stub the file picker, the credit-limit exits are started by the "tap to skip" instead of the 3 s hold — M-095 shows the
  natural hold).
* Screencast frames are emitted only when the screen changes, so a gap in frames means nothing changed. Frame times are
  presentation times from the compositor and line up with the curves to about one frame.
* The app's ?page=loan deep link has no loan and shows "PNaN" in its toasts / sheets (demo issue, not recorded); the
  loan-page takes set a ₱45,000 · 6-term loan first (APP.freshLoan) and open the page with APP.go('loan').

Recording production
--------------------
(Production kit: ../verify/ — rec-prod.mjs, specs-prod.mjs, mock.mjs, cmp.py; see ../README.md "Verify against the
reference". curves/M-099_prod.json is one production take, app opens on Home -> Withdraw, 2026-11-25.)
tools/ holds cdp.mjs (launch Chrome + CDP), sampler.js (the in-page sampler), specs.mjs (every take: url, setup,
trigger, targets), rec.mjs (records curves + frames), post.mjs (strips + videos), comp.html (the compositor page),
index.mjs (index.json). Run from tools/ with Node 24:
   node rec.mjs M-013 M-107        # record takes into the folder above tools/ (curves/, frames/, meta/)
   node post.mjs M-013 M-107       # strips + videos
   INVENTORY=/path/to/motions.json node index.mjs    # index.json
rec.mjs needs the demo at http://localhost:8788 and Google Chrome at /Applications/Google Chrome.app (cdp.mjs).
Point a spec's url / selectors at the production build to record it with the same sampler and the same trigger;
copy the tools to a new folder first so the reference takes are not overwritten.
meta/<id>.json are the recorder's per-take summaries (settle time, region of interest used for the strip).
