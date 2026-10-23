# Credit limit increase animation: integration guide

**Deliverable: `baked/`.** `physics-tuner/` is an engineering file, used only to tune the coin paths; it is not shipped.

> **Why two:** the Physics tuner is for tuning the animation's paths (the coins are simulated live with a physics
> engine, with a Tune panel for the model). To run smoothly on low-end phones, what ships is a baked recording of that
> simulation, so the phone does not simulate physics collisions in real time.
>
> 中文备注：Physics tuner 用于调整（tuning）动画轨迹；为适配低端机，交付的是烘焙（bake）后的动画，避免在手机上实时模拟物理碰撞等。交付文件只有 `baked/` 文件夹。

```
credit-limit-coins/
  baked/                 DELIVERABLE
    baked-heap.html        markup (text, pills, star layer, two canvases)
    baked-heap.css         page styles
    baked-heap.js          the animation: data interface, count-up, burst, canvas coin drawing, timeline
    baked.json             the coin recording, loaded by baked-heap.js at start-up
    baked-shockwave.html   VARIANT: the same plus a shockwave (own script baked-shockwave.js; same css and data)
  physics-tuner/         ENGINEERING ONLY (not shipped)
    physics-tuner.html     live Matter.js simulation + Tune panel, self-contained
    record-tuner.js        bakes the tuner's simulation into baked/baked.json
    bake.js                earlier standalone simulation, kept for reference
  assets/icon-pending.svg  expiry icon as exported from Figma (inlined in both pages)
  index.html, baked-heap.html   redirects for old links only
```

| Deliverable file | Size (gzip / Brotli) |
| --- | --- |
| `baked/baked-heap.html` | 1.6 / 1.3 KB |
| `baked/baked-heap.css` | 1.6 / 1.3 KB |
| `baked/baked-heap.js` | 13 / 11 KB |
| `baked/baked.json` | 49 / 37 KB |

The deliverable uses the shared environment, as the app would: the app's fonts (`assets/fonts/fonts.css` at the repo root) and GSAP (`vendor/gsap@3.15.0/`) are not part of it. Since the recording is fetched, open the page through a web server (GitHub Pages, or `python3 -m http.server` in the repo), not straight from disk. A host that already has the recording can set `window.CREDIT_LIMIT_BAKED = <the JSON>` before `baked-heap.js` instead, or point the script elsewhere with `data-recording="…"` on its tag.

It plays a 3.4-second animation: the credit limit counts up from the old amount to the new one while gold coins drop onto three stacks, then the new amount lands with a burst. After that the `+increase` pill, the old amount (struck through) and the expiry pill appear.

The numbers come from the backend and change per user. **The timing never changes**: whatever the amounts, the count-up, the coins and the landing always take the same time.

### The Physics tuner (engineering file)

`physics-tuner/physics-tuner.html` simulates the coins live in the browser with Matter.js, drawn exactly like the deliverable (two canvases, the same shadows). Its **Tune** button (top right) opens sliders for the physics model and a shadow switch, for trying values on a phone; **Copy** gives the current values as JSON, which is what `record-tuner.js` bakes (see *Baked heap* in section 5). The panel keeps its values in the phone's `localStorage` (`perasure.creditLimit.tune`). The tuner has the same data interface as the deliverable, so it can be tested with the same links.

Everything below (data fields, the three ways to pass data, events, timing) applies to the deliverable (and works the same in the tuner).

> 中文摘要：页面只需要接入下面表格里的 4 个后端字段（旧额度、新额度、提额金额、过期时间）。数字怎么变，动画时长都固定 3.4 秒。接入方式三选一：URL 参数 / 预先注入 `window.CREDIT_LIMIT_DATA` / 调用 `PeraCreditLimit.play(data)`。

---

## 1. Data contract

| Field (camelCase) | Also accepted (snake_case) | Type | Required | Example | Shown as |
| --- | --- | --- | --- | --- | --- |
| `oldLimit` | `old_limit` | number, or numeric string such as `"45,000"` | yes | `45000` | the starting value of the big number, and the struck-through `₱45,000` |
| `newLimit` | `new_limit` | number, or numeric string | yes | `50000` | the big number after the count-up |
| `increase` | `increase_amount` | number | no (defaults to `newLimit − oldLimit`) | `5000` | the blue `+₱5,000` pill |
| `expiresAt` | `expires_at` | `"YYYY-MM-DD"` or an ISO date-time string | no | `"2026-11-30"` | the pill `Valid until Nov 30 2026`; **hidden when empty** |
| `expiresText` | `expires_text` | string | no | `"Valid until Nov 30 2026"` | overrides the formatted `expiresAt` text when you want the backend's own wording |
| `currency` | | string | no (default `₱`) | `"₱"` | prefix on every amount |
| `label` | | string | no (default `Your credit limit is going up`) | | the small line above the number |

Rules:

- Amounts are whole pesos and have **at most 5 digits** (≤ ₱99,999), per the product rule. The layout is designed for that range. Longer numbers still shrink to fit the width, but that path is only a fallback.
- Formatting is done for you: `₱` plus a thousands separator (`₱50,000`). Pass plain numbers, not formatted strings, whenever you can.
- If `increase` is `0`, or `oldLimit === newLimit`, the `+increase` pill and the struck-through amount are hidden.
- Dates use the Philippine style `MMM d yyyy`, for example `Oct 16 2026` (English month abbreviation, no comma, the same on every phone whatever its language setting). An `expiresAt` given as a date-time is shown in the phone's local time zone.

### Mapping your API response

Replace the left-hand side with the real field names from the API. Write this adapter once in the host app:

```js
// Example API response, with illustrative names only. Use the real ones.
// { "data": { "previousCreditLimit": 45000, "currentCreditLimit": 50000,
//             "limitIncrease": 5000, "offerExpireDate": "2026-11-30" } }

function toCreditLimitData(res) {
  return {
    oldLimit:  res.data.previousCreditLimit,   // ← old credit limit
    newLimit:  res.data.currentCreditLimit,    // ← new credit limit
    increase:  res.data.limitIncrease,         // ← optional; omit to use new - old
    expiresAt: res.data.offerExpireDate        // ← optional; omit to hide the pill
  };
}
```

---

## 2. Three ways to pass the data (pick one)

The page checks them in this order. The first one it finds wins.

### A. Call `PeraCreditLimit.play(data)`: recommended when the data arrives after the page loads

Stop the page from autoplaying with the sample numbers, then call `play` once the API responds:

```html
<script>window.CREDIT_LIMIT_AUTOPLAY = false;</script>
<!-- … the animation page … -->
<script>
  fetch('/api/credit-limit/raise')                 // your endpoint
    .then(r => r.json())
    .then(res => window.PeraCreditLimit.play(toCreditLimitData(res), {
      onLanded: d => {},                           // optional: fires when the new amount lands (t = 2.30 s)
      onDone:   d => {}                            // optional: fires when everything has settled (t = 3.40 s)
    }));
</script>
```

It is safe to call `play` before the page has finished loading. The call is queued and runs as soon as the page is ready. Calling it again replays the animation with the new data.

### B. Inject `window.CREDIT_LIMIT_DATA` before the page script: best for a native WebView

Set it before the page's scripts run (for Baked heap: before `baked-heap.js`), so the page autoplays with the real data and never shows the sample.

- iOS (`WKWebView`): use a `WKUserScript` injected at `.atDocumentStart`.
- Android: use `WebViewCompat.addDocumentStartJavaScript`, or put an inline `<script>` before the page scripts.

```js
window.CREDIT_LIMIT_DATA = { old_limit: 45000, new_limit: 50000, increase_amount: 5000, expires_at: "2026-11-30" };
```

### C. URL query parameters: for testing, or a quick WebView link

```
baked/baked-heap.html?old=45000&new=50000&inc=5000&exp=2026-11-30
```

`cur=` sets the currency. `from=` and `to=` are accepted as aliases of `old=` and `new=`.

If none of the three is provided, the page plays the built-in sample: ₱45,000 → ₱50,000, valid until Nov 30 2026.

---

## 3. Events (to close the screen, log analytics, and so on)

The page reports two moments:

| Event | When | `detail` |
| --- | --- | --- |
| `creditlimit:landed` | the new amount lands (2.30 s) | `{ oldLimit, newLimit, increase }` |
| `creditlimit:done` | all motion has settled (3.40 s) and the Replay button is showing | same |

Each event is delivered through every channel that exists in the host:

- `window` CustomEvent: `addEventListener('creditlimit:done', e => e.detail)`
- the `onLanded` / `onDone` callbacks passed to `play()`
- React Native WebView: `window.ReactNativeWebView.postMessage(JSON string)`
- iOS WKWebView: `webkit.messageHandlers.creditLimit.postMessage(JSON string)` (register a handler named `creditLimit`)
- Android: `CreditLimitBridge.onEvent(JSON string)` (add a JavaScript interface named `CreditLimitBridge`)
- iframe parent: `parent.postMessage({ type, detail }, '*')`

The JSON string is `{"type":"creditlimit:done","detail":{"oldLimit":45000,"newLimit":50000,"increase":5000}}`.

---

## 4. Timing: fixed, do not tie it to the numbers

| Beat | Time |
| --- | --- |
| label and amount fade in | 0.00–0.45 s |
| count-up from `oldLimit` to `newLimit` (power2.out) | 0.45–2.30 s |
| 44 coins drop on an eased-out schedule (many at first, slower and slower) | 0.45–2.30 s, the last coin lands at 2.30 s |
| landing: punch, burst, scene shake, coins jump | 2.30 s |
| `+increase` pill, old amount, expiry pill | 2.35–2.76 s |
| everything settled, `creditlimit:done` | 3.40 s |

The constants live in the page script:

- `COUNT = { start:.45, dur:1.85 }`: the count-up window, also used for the coin schedule.
- `N = 44` inside `DROPS`: the number of coins.
- `END = F + 1.1`: the settle time after landing.

The count-up interpolates between whatever the two amounts are, so a ₱3,000 raise and a ₱40,000 raise take exactly the same time. Don't scale the coin count or the durations to the amount.

`PeraCreditLimit.duration` returns `3.4`.

---

## 5. Other behaviour worth knowing

- **Layout** is responsive, in normal document flow. Sizes scale with the screen width (designed at 360 px wide, capped at 480 px), and the coin artwork keeps its aspect ratio, using at most 42% of the screen height. No page zoom or fixed viewport is used.
- **Reduced motion**: if the phone has "Reduce motion" turned on, the page jumps straight to the final state (new amount and pills) without the coin animation. Both events still fire, right away. In Baked heap no timeline is built at all: the last recorded frame is drawn once, the stars don't twinkle and there is no Replay button. The page follows the setting live (`gsap.matchMedia()`).
- **Replay**: the button appears at the end. `PeraCreditLimit.replay()` replays from code.
- **Start-up** (Baked heap): the page starts at once, without waiting for the fonts, and re-measures the amount when they are ready. Until it plays, it shows the first frame (nothing visible), not the sample's end state.
- `PeraCreditLimit.getData()` returns the normalised data the page is using, which helps with debugging.
- **Physics tuner**: coins are moved by a Matter.js simulation stepped on the GSAP timeline's clock, so every playback with the same model values looks identical. They are drawn with the same canvas renderer as Baked heap: every coin casts its own shadow onto the coins below it and the coins behind, recomputed only for coins that moved (resting coins that only tremble in the solver by less than a hundredth of a pixel count as still). The model values live in `MODEL`: step rate, gravity, coin and floor friction, bounce, knock strength up / sideways / spin, how far each dropped coin's starting point may be off (`dropX`, the full sideways spread, 16 = ±8 by default; `dropY`, height, 0 by default, with the start speed adjusted so it still lands on time; `dropAngle`, the largest starting tilt in degrees, 2.3 by default), edge walls, and `shadows` (1 = each coin, 0 = whole stack, which draws only the front row's shadow on the stack behind, as the tuner used to). The Tune panel overrides them for testing; a tap outside the panel closes it.
- **Baked heap**: coin positions come from `baked/baked.json`, recorded at 60 fps offline. No physics runs on the phone.
  - **How it was made**: `physics-tuner/record-tuner.js` runs the Physics tuner's own physics code (read from `physics-tuner.html`, same seeds, so it matches what the tuner shows with the same values) and records until every coin rests. Current values (from Tune → Copy): `{"hz":240,"gravity":4.4,"friction":1.1,"frictionStatic":2.3,"restitution":0.05,"floorFriction":1.45,"kickUp":3,"kickSide":0.75,"kickSpin":0.15,"walls":0,"shadows":0,"dropX":8,"dropY":15,"dropAngle":1.3}`. They are also stored in the JSON (`model`).
  - **Packing**: the recording is cleaned and packed as it is written (`enc: "same1"`). A resting coin that only trembles in the solver (under 0.2 world units ≈ 0.1 CSS px, `TREMBLE` in `record-tuner.js`) keeps its exact previous pose, positions are rounded to 0.1 and angles to 0.001, and a pose that repeats the previous frame is stored as `1` (`0` = coin not dropped yet). The page expands it on load. Result: about half the file size (311 KB → 167 KB of JSON) and resting coins are exactly still, so they are never redrawn.
  - **Result**: like the tuner, it starts with no coins, and the 44 drops build the stacks. The landing knocks 11 coins off their stacks, two of them off the screen. Everything rests by about 5.9 s; the UI is still done at 3.4 s (pills, Replay, `creditlimit:done`). Shadows are in whole-stack mode (`shadows: 0`).
  - **Re-baking**: tune in the Physics tuner, tap Copy, then, in this folder, run `npm i matter-js@0.19.0 && node physics-tuner/record-tuner.js '<copied values>' baked/baked.json` (put `TREMBLE=0.1 ` in front for less cleaning) — the deliverable loads `baked/baked.json`, so that is all (then run `python3 tools/stamp.py` so phones fetch the new file). No checks are applied; it is exactly what the tuner shows.
  - **Drawing**: the two rows of coins are drawn on two canvases, with the twinkling stars in an SVG layer over them. There are no SVG nodes or clip paths per coin. A row is redrawn only on frames where one of its coins moved, and a shadow is recomputed only when its caster or the coin it falls on moved. On phones with 4 cores or fewer, or 4 GB of memory or less, the canvases are drawn at 2× at most. The canvases start just above the highest point any coin reaches in the recording (not at the top of the page), with their top edge on a whole screen pixel; this halves their memory.
  - `physics-tuner/bake.js` is the earlier standalone simulation (aimed heaps, rule checks, seed search); it is kept for reference and not used for the current recording.
- **Start**: both begin with no coins at all; the three stacks are built only by the 44 drops (`start: 0` in `STACK`).
- **Layout**: the number block sits a little higher and the coins a little lower than in the first versions (the tuner and Baked heap match).
- **Shockwave variant** (`baked/baked-shockwave.html` + `baked-shockwave.js`): Baked heap plus a screen-distorting shockwave. When the amount lands, a bubble of compressed air grows out of it and refracts the whole screen like a glass ball: magnified inside, squeezed and repeated toward its edge, a sharp seam against the picture outside, a thin band of air pushed outward just beyond it; the red, green and blue channels bend slightly differently (a glass fringe from the scene's own colours; nothing is drawn or coloured). How: for about a second `<main>` (given the page colour as background) gets an SVG displacement filter whose map is one 384×384 image made on the first play; each frame only moves/resizes it and sets the strength. Strength 1 by default, `?shock=<number>` overrides (`0` = off); the bubble takes about 1.35 s to sweep past the screen. All its settings are in `SW_DEFAULT` at the top of the shockwave section of `baked-shockwave.js`. **Tune** (top right, this variant only) has sliders for the shockwave alone — strength, speed, start delay, full-strength time, fade-out, final size, magnification inside, max bend at the edge, edge softness, air band, colour fringe; releasing a slider replays (the panel steps aside until the wave has passed), values are kept on the phone (`perasure.creditLimit.shockTune`), **Copy** gives them as JSON for `SW_DEFAULT`. The panel is prototype-only: delete its styles (in `baked-shockwave.html`), markup and script (both marked SHOCKWAVE TUNE PANEL) for production. This variant has no automatic downgrades: every phone draws the coins at full screen sharpness (up to 3×) and gets the full three-channel effect; only the phone's Reduce motion setting still skips the animation. Known limit: the browser's filter samples without smoothing, so the most squeezed part of the edge shows fine streaks.
- **Expiry icon**: the clock in the expiry pill is `Icon / Pending` from the PeraSure design system in Figma (node 3426:2872). The SVG is kept as exported in `assets/icon-pending.svg` and inlined in both pages, placed as in the Figma component; its stroke is tinted with the accent blue by CSS.
- **Layers (all versions)**: the coins are under everything else on the page (the number, the pills, Replay) and over the small twinkling stars behind them. The coin canvases reach high enough that a coin thrown up passes under the number instead of being cut off (Physics tuner: up to the top of the page; Baked heap: up to the highest point in its recording).

---

## 6. Checklist for whoever wires it up (human or AI)

1. Write the adapter from your API response to `{ oldLimit, newLimit, increase?, expiresAt? }` (section 1).
2. Choose A, B or C (section 2). For a native WebView, B is the most robust because it never shows the sample numbers.
3. Listen for `creditlimit:done` if the screen should close or move on automatically (section 3).
4. Don't edit the timing constants (section 4).
5. Test with a link such as `baked/baked-heap.html?old=8000&new=15000&exp=2026-12-15`, and one with no `exp`, to confirm the pill hides.
