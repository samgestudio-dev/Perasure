# Credit limit increase animation: integration guide

`baked-heap.html` and `index.html` in this folder are single self-contained pages (GSAP, the fonts and, for `index.html`, Matter.js are inlined, so there are no network requests). It plays a 3.4-second animation: the credit limit counts up from the old amount to the new one while gold coins drop onto three stacks, then the new amount lands with a burst. After that the `+increase` pill, the old amount (struck through) and the expiry pill appear.

The numbers come from the backend and change per user. **The timing never changes**: whatever the amounts, the count-up, the coins and the landing always take the same time.

### Two versions, same interface

| File | Coins | Use when |
| --- | --- | --- |
| `baked-heap.html` (Baked heap, **recommended**) | a fixed recording of the Standard page's own simulation, made offline with values tuned in Standard's Tune panel (no physics engine shipped), drawn on canvas; at the landing the coins are knocked up and the physics engine decides where they end up | you want the exact same, polished motion on every phone, at the lowest cost |
| `index.html` (Standard) | simulated live in the browser with Matter.js; at the landing the coins jump and fall where they fall. Drawn like Baked heap (two canvases, every coin casts its own shadow). Has a **Tune** button (top right) with sliders for the physics model and a shadow switch, for trying values on a phone | you want every play to be computed on the device, or you are tuning the model |

> **Before shipping `index.html` (Standard), delete the tuning panel.** It is a prototype tool, marked in three places:
> the CSS between `/* ==== TUNING PANEL` and `/* ==== END TUNING PANEL ==== */`, the markup between
> `<!-- ==== TUNING PANEL` and `<!-- ==== END TUNING PANEL ==== -->`, and the script between `/* ==== TUNING PANEL`
> and `/* ==== END TUNING PANEL ==== */`. With it gone, the page uses the default model in `MODEL` (and the coins
> stop with the timeline at 3.4 s, as before). The panel also keeps its values in the phone's `localStorage`
> (`perasure.creditLimit.tune`); nothing reads that once the panel is removed. **Copy** in the panel copies the
> current values as JSON, so they can be written into `MODEL` (or used for a new bake of Baked heap).

Everything below (data fields, the three ways to pass data, events, timing) is identical for both files.

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

Set it before the page's scripts run, so the page autoplays with the real data and never shows the sample.

- iOS (`WKWebView`): use a `WKUserScript` injected at `.atDocumentStart`.
- Android: use `WebViewCompat.addDocumentStartJavaScript`, or put an inline `<script>` before the page scripts.

```js
window.CREDIT_LIMIT_DATA = { old_limit: 45000, new_limit: 50000, increase_amount: 5000, expires_at: "2026-11-30" };
```

### C. URL query parameters: for testing, or a quick WebView link

```
index.html?old=45000&new=50000&inc=5000&exp=2026-11-30
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
- **Standard**: coins are moved by a Matter.js simulation stepped on the GSAP timeline's clock, so every playback with the same model values looks identical. They are drawn with the same canvas renderer as Baked heap: every coin casts its own shadow onto the coins below it and the coins behind, recomputed only for coins that moved (resting coins that only tremble in the solver by less than a hundredth of a pixel count as still). The model values live in `MODEL`: step rate, gravity, coin and floor friction, bounce, knock strength up / sideways / spin, how far each dropped coin's starting point may be off (`dropX`, the full sideways spread, 16 = ±8 by default; `dropY`, height, 0 by default, with the start speed adjusted so it still lands on time; `dropAngle`, the largest starting tilt in degrees, 2.3 by default), edge walls, and `shadows` (1 = each coin, 0 = whole stack, which draws only the front row's shadow on the stack behind, as Standard used to). The Tune panel overrides them for testing; a tap outside the panel closes it.
- **Baked heap**: coin positions come from `bake/baked.json`, recorded at 60 fps offline. No physics runs on the phone.
  - **How it was made**: `bake/record-standard.js` runs the Standard page's own physics code (read from `index.html`, same seeds, so it matches what Standard shows with the same values) and records until every coin rests. Current values (from Tune → Copy): `{"hz":240,"gravity":4.4,"friction":1.1,"frictionStatic":2.3,"restitution":0.05,"floorFriction":1.45,"kickUp":3,"kickSide":0.75,"kickSpin":0.15,"walls":0,"shadows":0,"dropX":8,"dropY":15,"dropAngle":1.3}`. They are also stored in the JSON (`model`).
  - **Result**: like Standard, it starts with no coins, and the 44 drops build the stacks. The landing knocks 11 coins off their stacks, two of them off the screen. Everything rests by about 5.9 s; the UI is still done at 3.4 s (pills, Replay, `creditlimit:done`). Shadows are in whole-stack mode (`shadows: 0`).
  - **Re-baking**: tune in Standard, tap Copy, then run `npm i matter-js@0.19.0 && node bake/record-standard.js '<copied values>' bake/baked.json` and paste the JSON into `baked-heap.html` (the `var BAKED = …;` line). No checks are applied; it is exactly what Standard shows.
  - **Drawing**: the two rows of coins are drawn on two canvases, with the twinkling stars in an SVG layer over them. There are no SVG nodes or clip paths per coin. A row is redrawn only on frames where one of its coins moved, and a shadow is recomputed only when its caster or the coin it falls on moved. On phones with 4 cores or fewer, or 4 GB of memory or less, the canvases are drawn at 2× at most.
  - `bake/bake.js` is the earlier standalone simulation (aimed heaps, rule checks, seed search); it is kept for reference and not used for the current recording.
- **Standard's start**: Standard begins with no coins at all; the three stacks are built only by the 44 drops (`start: 0` in `STACK`).
- **Layout**: the number block sits a little higher and the coins a little lower than in the first versions (Standard and Baked heap match).
- **Layers (all versions)**: the coins are under everything else on the page (the number, the pills, Replay) and over the small twinkling stars behind them. The coin canvases reach up to the top of the page, so a coin thrown high passes under the number instead of being cut off.

---

## 6. Checklist for whoever wires it up (human or AI)

1. Write the adapter from your API response to `{ oldLimit, newLimit, increase?, expiresAt? }` (section 1).
2. Choose A, B or C (section 2). For a native WebView, B is the most robust because it never shows the sample numbers.
3. Listen for `creditlimit:done` if the screen should close or move on automatically (section 3).
4. Don't edit the timing constants (section 4).
5. Test with a link such as `index.html?old=8000&new=15000&exp=2026-12-15`, and one with no `exp`, to confirm the pill hides.
