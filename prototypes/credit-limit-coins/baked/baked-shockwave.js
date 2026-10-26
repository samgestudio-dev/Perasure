/* Credit limit increase, Baked heap + shockwave (variant): the animation. Needs GSAP (window.gsap) and the markup in
   baked-shockwave.html; the coin recording is baked.json (same folder). Same as baked-heap.js plus the glass-bubble
   shockwave, and with no automatic downgrades for low-end phones: every phone draws at full screen
   sharpness and gets the full effect (only the phone's "Reduce motion" setting still turns the animation off). */
(function(){
"use strict";
/* ============================== DATA INTERFACE ==============================
   Everything the backend changes per user. See README.md next to this file.

   Fields (camelCase or snake_case both accepted):
     oldLimit     | old_limit       number  required  current credit limit before the raise, e.g. 45000
     newLimit     | new_limit       number  required  credit limit after the raise, e.g. 50000
     increase     | increase_amount number  optional  shown in the "+₱5,000" pill; defaults to newLimit - oldLimit
     expiresAt    | expires_at      string  optional  'YYYY-MM-DD' or ISO date-time; pill is hidden when absent
     expiresText  | expires_text    string  optional  ready-made pill text, overrides expiresAt formatting
     currency                       string  optional  default '₱'
     label                          string  optional  default 'Your credit limit is going up'

   How data gets in (first match wins):
     1. window.PeraCreditLimit.play(data)        call any time; plays (or replays) with this data
     2. window.CREDIT_LIMIT_DATA = { ... }       set before this script runs; autoplays with it
     3. URL ?old=45000&new=50000&inc=5000&exp=2026-11-30&cur=₱   (handy for testing links)
     4. the built-in sample: 45,000 → 50,000, valid until Nov 30 2026
   Set window.CREDIT_LIMIT_AUTOPLAY = false before this script to wait for play().

   Timing never depends on the numbers: count-up 0.45–2.30 s, landing at 2.30 s, done at 3.40 s, 44 coins.
   ============================================================================ */
var Q = new URLSearchParams(location.search);
var SAMPLE = { oldLimit:45000, newLimit:50000, expiresAt:'2026-11-30' };
function num(v){ if (v === null || v === undefined || v === '') return NaN; return typeof v === 'number' ? v : Number(String(v).replace(/[^0-9.\-]/g, '')); }
function pick(o, keys){ for (var i = 0; i < keys.length; i++) if (o && o[keys[i]] !== undefined && o[keys[i]] !== null && o[keys[i]] !== '') return o[keys[i]]; }
/* turn whatever the caller passes into the one shape the animation uses */
function normalize(d){
  d = d || {};
  var from = num(pick(d, ['oldLimit', 'old_limit', 'from'])), to = num(pick(d, ['newLimit', 'new_limit', 'to']));
  if (!isFinite(to)) { to = isFinite(from) ? from : SAMPLE.newLimit; }
  if (!isFinite(from)) from = to;
  var inc = num(pick(d, ['increase', 'increase_amount', 'inc']));
  if (!isFinite(inc)) inc = to - from;
  return {
    from:from, to:to, increase:inc,
    currency:pick(d, ['currency', 'cur']) || '₱',
    label:pick(d, ['label']) || 'Your credit limit is going up',
    expiresAt:pick(d, ['expiresAt', 'expires_at', 'exp']) || '',
    expiresText:pick(d, ['expiresText', 'expires_text']) || ''
  };
}
function initialData(){
  if (window.CREDIT_LIMIT_DATA) return window.CREDIT_LIMIT_DATA;
  if (Q.has('old') || Q.has('new') || Q.has('from') || Q.has('to'))
    return { old_limit:Q.get('old') || Q.get('from'), new_limit:Q.get('new') || Q.get('to'), increase_amount:Q.get('inc'), expires_at:Q.get('exp'), currency:Q.get('cur') };
  return SAMPLE;
}
var CONFIG = normalize(initialData());
var HOOKS = {};
/* tell the host page / native app what happened */
function emit(name, extra){
  var detail = Object.assign({ oldLimit:CONFIG.from, newLimit:CONFIG.to, increase:CONFIG.increase }, extra || {});
  try { window.dispatchEvent(new CustomEvent('creditlimit:' + name, { detail:detail })); } catch (e) {}
  var cb = HOOKS[name === 'landed' ? 'onLanded' : 'onDone']; if (typeof cb === 'function') cb(detail);
  var msg = JSON.stringify({ type:'creditlimit:' + name, detail:detail });
  try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(msg); } catch (e) {}
  try { if (window.webkit && webkit.messageHandlers && webkit.messageHandlers.creditLimit) webkit.messageHandlers.creditLimit.postMessage(msg); } catch (e) {}
  try { if (window.CreditLimitBridge && CreditLimitBridge.onEvent) CreditLimitBridge.onEvent(msg); } catch (e) {}
  try { if (window.parent !== window) window.parent.postMessage({ type:'creditlimit:' + name, detail:detail }, '*'); } catch (e) {}
}
/* ============================================================================ */
var SPEED = parseFloat(Q.get('speed')) || 1;
var NS = 'http://www.w3.org/2000/svg';
var $ = function(id){ return document.getElementById(id); };
var amountEl = $('amount'), replay = $('replay');

/* one unit of the 360-wide design, in CSS px, for this screen (no page zoom; real sizes change) */
var fitWidth = -1;
function fit(){ fitWidth = innerWidth; document.documentElement.style.setProperty('--u', (Math.min(innerWidth, 480) / 360).toFixed(4)); }
function el(tag, attrs, parent){ var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function money(v){ return CONFIG.currency + Math.round(v).toLocaleString('en-US'); }
/* the count-up calls this every frame; only touch the DOM when the visible text actually changes */
var amountText = null;
function setAmount(s){ if (s !== amountText) { amountText = s; amountEl.textContent = s; } }
function dateText(s){
  if (!s) return '';
  var d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + 'T00:00:00') : new Date(s);
  if (isNaN(d)) return String(s);
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return 'Valid until ' + MON[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear();   /* Philippine style: Oct 16 2026 */
}
/* write the data into the page */
function applyData(){
  $('label').textContent = CONFIG.label;
  $('up').textContent = (CONFIG.increase >= 0 ? '+' : '−') + money(Math.abs(CONFIG.increase));
  $('was').textContent = money(CONFIG.from);
  var showDelta = CONFIG.increase !== 0 && CONFIG.from !== CONFIG.to;
  $('delta').style.visibility = showDelta ? '' : 'hidden';
  var et = CONFIG.expiresText || dateText(CONFIG.expiresAt);
  $('expText').textContent = et; $('exp').style.display = et ? '' : 'none';
  setAmount(money(CONFIG.from));
  fitAmount();
}
/* longer amounts (₱1,250,000) shrink to fit the width instead of overflowing; short ones keep the design size.
   All reads first, then the probe (one layout), then the single write. */
function fitAmount(){
  amountEl.style.fontSize = '';
  var cs = getComputedStyle(amountEl), box = $('hero').parentNode, bs = getComputedStyle(box);
  var size = parseFloat(cs.fontSize);
  var avail = box.clientWidth - parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight) - 4;   /* content width of the page column */
  var wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;pointer-events:none';
  [CONFIG.from, CONFIG.to].forEach(function(v){
    var p = document.createElement('span');
    p.style.cssText = 'display:block;width:max-content;white-space:nowrap;font-variant-numeric:tabular-nums';
    p.style.fontFamily = cs.fontFamily; p.style.fontWeight = cs.fontWeight; p.style.fontSize = cs.fontSize; p.style.letterSpacing = cs.letterSpacing;
    p.textContent = money(v); wrap.appendChild(p);
  });
  document.body.appendChild(wrap);
  var w = 0; Array.prototype.forEach.call(wrap.children, function(p){ w = Math.max(w, p.getBoundingClientRect().width); });
  wrap.remove();
  if (w > avail) amountEl.style.fontSize = (size * avail / w).toFixed(2) + 'px';
}
/* resize: once per frame at most, and only when the width changed (iOS fires resize when its toolbars slide) */
var resizeQueued = false;
function onResize(){
  if (resizeQueued) return; resizeQueued = true;
  requestAnimationFrame(function(){ resizeQueued = false; if (innerWidth !== fitWidth) { fit(); fitAmount(); } layoutCanvas(); });
}

/* ---------- coins, colours sampled from the reference ---------- */
var H = 14, RX = 80, RY = 21;
var STYLE = {
  orange: { top:'#FFB000', ring:'#FFE36B', side:'#FFD21F', rim:'#F29A00' },
  lime:   { top:'#FFB000', ring:'#FFE36B', side:'#FFD21F', rim:'#F29A00' },
  teal:   { top:'#F5A200', ring:'#FFD84D', side:'#FFC20A', rim:'#E48C00' }   /* the stack behind, a shade deeper */
};
/* ---------- drawing (one canvas per row: no DOM per coin, no SVG clip paths to re-rasterise) ---------- */
/* the coin, in its own frame: side band (rim colour, then the side colour 3 units shorter so the rim stays inside
   the outline), top face, and the ring on the face */
function bandPath(ctx, h){ ctx.beginPath(); ctx.moveTo(-RX, 0); ctx.lineTo(-RX, h); ctx.ellipse(0, h, RX, RY, 0, Math.PI, 0, true); ctx.lineTo(RX, 0); ctx.closePath(); }
function facePath(ctx){ ctx.beginPath(); ctx.ellipse(0, 0, RX, RY, 0, 0, Math.PI * 2); }
function silPath(ctx){ ctx.beginPath(); ctx.moveTo(-RX, 0); ctx.ellipse(0, 0, RX, RY, 0, Math.PI, Math.PI * 2, false); ctx.lineTo(RX, H); ctx.ellipse(0, H, RX, RY, 0, 0, Math.PI, false); ctx.closePath(); }
function polys(ctx, list){ ctx.beginPath(); for (var i = 0; i < list.length; i++) { var p = list[i]; ctx.moveTo(p[0], p[1]); for (var j = 2; j < p.length; j += 2) ctx.lineTo(p[j], p[j + 1]); ctx.closePath(); } ctx.fill(); }
/* silhouette outline sampled in the coin's own frame (top arc, right side, bottom arc) */
var OUTLINE = (function(){
  var pts = [], n = 18, i, a;
  for (i = 0; i <= n; i++) { a = Math.PI + Math.PI * i / n; pts.push([RX * Math.cos(a), RY * Math.sin(a)]); }
  for (i = 0; i <= n; i++) { a = Math.PI * i / n; pts.push([RX * Math.cos(a), H + RY * Math.sin(a)]); }
  return pts;
})();

/* ---------- light & space ----------
   Oblique view: x right, y down, z = depth behind the front coins; one unit of depth reads as one unit up on screen.
   Front coins stand at z = 0 on the floor (y = 708); the back stack stands at z = 44.
   Light comes from the upper left, in front: rays travel +x, +y, +z in the ratio 0.85 : 1.35 : 1. */
var FLOOR = 708, LX = .85, LY = 1.35;
var Z_BACK = 44, Z_BACK_FACE = Z_BACK - RY;
/* where a point's shadow lands on the plane z = Z (or, if the ray hits the floor first, on the floor) — in screen units */
function project(x, y, Z){
  var zHit = Math.min(Z, (FLOOR - y) / LY);
  return [x + zHit * LX, y + zHit * LY - zHit];
}
/* project a whole silhouette, splitting edges exactly where the shadow folds from floor to plane */
function shadowPath(pts, Z){
  var fold = FLOOR - LY * Z, out = [], n = pts.length;
  for (var i = 0; i < n; i++) {
    var a = pts[i], b = pts[(i + 1) % n];
    out.push(project(a[0], a[1], Z));
    if ((a[1] - fold) * (b[1] - fold) < 0) {
      var t = (fold - a[1]) / (b[1] - a[1]);
      out.push(project(a[0] + (b[0] - a[0]) * t, fold, Z));
    }
  }
  return { p:flat(out), bb:bbox(out) };
}

/* ---------- baked coin motion ----------
   No physics engine runs in the browser. The coins were simulated offline with Matter.js using the same model as
   the Physics tuner (240 Hz, 20 position / 14 velocity iterations, the same knock at the landing) and recorded at
   60 fps; here we only play the recording back, interpolating between frames. Where the coins end up is the
   engine's result. The bake keeps a run only if no coin comes to rest tilted more than 30°, the stacks stand until
   the hit, at least 10 coins are knocked off, and everything is still by the end. */
/* the recording: baked.json, loaded at start-up (see the end of this file) */
var BAKED = null, TOP_Y = 0, SHADOW_EACH = true;
function useRecording(R){
  BAKED = R;
  /* unpack: in a packed recording (enc 'same1') a 1 means "same pose as this coin's previous frame"; the same array
     is reused, so a coin at rest is exactly unchanged from frame to frame and costs nothing to draw */
  if (R.enc === 'same1') { var prev = [];
    R.frames.forEach(function(fr){ for (var j = 0; j < fr.length; j++) { if (fr[j] === 1) fr[j] = prev[j]; else if (fr[j]) prev[j] = fr[j]; } }); }
  /* the highest any coin gets in the recording (its centre, less a coin's half-width for one standing on edge, and a
     little room): the canvases start there instead of at the top of the page, so they are only as tall as needed */
  var m = 1e9; R.frames.forEach(function(fr){ fr.forEach(function(f){ if (f && f[1] < m) m = f[1]; }); }); TOP_Y = m - RX - 12;
  /* shadows: each coin (default), or 'whole stack' (only the front row's shadow on the stack behind) when the bake says so */
  SHADOW_EACH = !(R.model && R.model.shadows === 0);
}
var COUNT = { start:.45, dur:1.85 };
var coins = [], front = [], back = [];
/* a coin tilted more than this has no horizontal top face to catch shadows on (only ever true mid-flight) */
var FACE_TILT = Q.get('tiltguard') === '0' ? 9 : .55;
function tilt(a){ a = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))); return Math.min(a, Math.PI - a); }
var LANES = {};
function setupCoins(){
  coins = BAKED.coins.map(function(c){
    return { kind:c.kind, lane:c.lane, x:0, y:0, a:0, on:false,
             /* last drawn state, so unchanged coins cost nothing */
             px:NaN, py:NaN, pa:NaN, wasOn:false, pts:null, moved:false, ver:0, pieces:new Map(), top:[], topFrom:[], backSh:[], backFrom:[], cast:null };
  });
  front = coins.filter(function(c){ return c.lane === 'front'; });
  back = coins.filter(function(c){ return c.lane === 'back'; });
  front.order = front.slice(); back.order = back.slice();
  LANES.front = { cv:$('cvFront'), list:front }; LANES.back = { cv:$('cvBack'), list:back };
  LANES.front.ctx = LANES.front.cv.getContext('2d'); LANES.back.ctx = LANES.back.cv.getContext('2d');
}
/* the canvases cover the artwork's box and everything above it up to the top of the page (coins fall in from above and are thrown up at the landing) and the full screen width
   (coins may spill past the edges); world units map exactly as the SVG viewBox (VB) maps in the star layer */
var VB = { x:0, y:236, w:726, h:485 };   /* must match the viewBox in the markup */
var BELOW = 30;   /* the canvases reach this far (world units) below the artwork's box: a coin's lowest edge (floor + 21) may hang into the gap above Replay */
var VIEW = null;
function layoutCanvas(){
  var box = $('artStars').getBoundingClientRect(), bw = box.width, bh = box.height;
  if (!bw || !bh) return;
  var s = Math.min(bw / VB.w, bh / VB.h), ox = (bw - VB.w * s) / 2, oy = (bh - VB.h * s) / 2;
  /* full sharpness on every phone (this variant has no low-end downgrade), up to 3x */
  var dpr = Math.min(window.devicePixelRatio || 1, 3);
  /* from the highest point any coin reaches in the recording (never above the top of the page) down to the floor:
     a coin thrown up still passes under the number, and no canvas area is spent on space no coin uses. The top edge
     is snapped to whole screen pixels (counted from the top of the page), so the canvas is not resampled (blurred) */
  var pageY = box.top + (window.scrollY || 0), L = -box.left, W = document.documentElement.clientWidth;
  var T = Math.floor(Math.max(0, pageY + oy + (TOP_Y - VB.y) * s) * dpr) / dpr - pageY, Hh = oy + (VB.h + BELOW) * s - T;
  VIEW = { a:s * dpr, e:(ox - L) * dpr, f:(oy - VB.y * s - T) * dpr, w:Math.round(W * dpr), h:Math.round(Hh * dpr) };
  ['front', 'back'].forEach(function(k){
    var cv = LANES[k].cv;
    cv.style.width = W + 'px'; cv.style.height = Hh + 'px';
    cv.style.margin = T + 'px ' + (-(L + W)) + 'px ' + (-(T + Hh)) + 'px ' + L + 'px';
    if (cv.width !== VIEW.w) cv.width = VIEW.w; if (cv.height !== VIEW.h) cv.height = VIEW.h;
    LANES[k].dirty = true;
  });
  paint(true);
}
function flat(pts){ var o = new Array(pts.length * 2); for (var i = 0; i < pts.length; i++) { o[2 * i] = pts[i][0]; o[2 * i + 1] = pts[i][1]; } return o; }
function poseAt(t){
  var F = BAKED.frames, f = Math.max(0, Math.min(F.length - 1.0001, t * BAKED.fps)), i0 = Math.floor(f), k = f - i0;
  var A = F[i0], B = F[i0 + 1] || A;
  for (var i = 0; i < coins.length; i++) {
    var c = coins[i], p = A[i], q = B[i];
    if (!p && !q) { c.on = false; continue; }
    if (!p) p = q; if (!q) q = p;
    var da = q[2] - p[2]; da = Math.atan2(Math.sin(da), Math.cos(da));
    c.on = true; c.x = p[0] + (q[0] - p[0]) * k; c.y = p[1] + (q[1] - p[1]) * k; c.a = p[2] + da * k;
  }
}
/* projection of a point onto a horizontal plane at height yP (the top face of a coin below), along the light */
function projectH(x, y, yP){
  if (y >= yP) return [x, y];
  var t = (yP - y) / LY;
  return [x + t * LX, yP - t];
}
function worldOutline(c){
  var cs = Math.cos(c.a), sn = Math.sin(c.a);
  return OUTLINE.map(function(p){ var x = p[0], y = p[1] - H / 2; return [c.x + x * cs - y * sn, c.y + x * sn + y * cs]; });
}
function bbox(pts){
  var b = [1e9, 1e9, -1e9, -1e9];
  for (var i = 0; i < pts.length; i++) { var p = pts[i];
    if (p[0] < b[0]) b[0] = p[0]; if (p[1] < b[1]) b[1] = p[1]; if (p[0] > b[2]) b[2] = p[0]; if (p[1] > b[3]) b[3] = p[1]; }
  return b;
}
function overlap(a, b){ return a[0] <= b[2] && b[0] <= a[2] && a[1] <= b[3] && b[1] <= a[3]; }
/* box around c's top face (the clip shape its face shadows are cut to), and around its whole silhouette */
function faceBox(c){
  var cs = Math.cos(c.a), sn = Math.sin(c.a), cx = c.x + sn * H / 2, cy = c.y - cs * H / 2;
  var hx = Math.sqrt(RX * RX * cs * cs + RY * RY * sn * sn), hy = Math.sqrt(RX * RX * sn * sn + RY * RY * cs * cs);
  return [cx - hx - 1, cy - hy - 1, cx + hx + 1, cy + hy + 1];
}
/* a box that holds o's shadow on the horizontal plane yP. projectH moves a point right by (yP-y)*LX/LY and maps y
   monotonically, so the shadow of o's bounding box bounds the shadow of o. Shadows whose box misses the face are
   cut away entirely by the clip, so skipping them changes no pixel. */
function shadowBoxH(bb, yP){
  var s = LX / LY, f = function(y){ return y >= yP ? y : yP - (yP - y) / LY; };
  return [bb[0] + Math.max(0, yP - bb[3]) * s - 1, f(bb[1]) - 1, bb[2] + Math.max(0, yP - bb[1]) * s + 1, f(bb[3]) + 1];
}
/* o casts onto c's top face: above it, close enough to matter */
function castsTop(o, c){ return o !== c && o.on && o.y < c.y - 4 && c.y - o.y <= 220 && Math.abs(o.x - c.x) <= 2 * RX + 60; }
function castsBack(o, c){ return o.on && Math.abs(o.x - c.x) < 2 * RX + 60; }
function has(list, o){ return list.indexOf(o) !== -1; }
/* does anything that moved this frame change what lands on c? (a caster arrived, left, or moved) */
function touched(c, moved, casts, from){
  if (c.moved) return true;
  for (var i = 0; i < moved.length; i++) if (casts(moved[i], c) || has(from, moved[i])) return true;
  return false;
}
/* paint order: lower coins first, higher ones on top */
function byHeight(p, q){ return (q.on ? q.y : 1e9) - (p.on ? p.y : 1e9); }
function drawLane(L){
  var ctx = L.ctx, V = VIEW;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, V.w, V.h);
  var order = L.list.order;
  for (var i = 0; i < order.length; i++) {
    var c = order[i]; if (!c.on) continue;
    var st = STYLE[c.kind], cs = Math.cos(c.a) * V.a, sn = Math.sin(c.a) * V.a;
    /* coin frame: translate(x, y) rotate(a) translate(0, -H/2), on top of the view transform */
    ctx.setTransform(cs, sn, -sn, cs, V.a * c.x + V.e + sn * H / 2, V.a * c.y + V.f - cs * H / 2);
    ctx.fillStyle = st.rim; bandPath(ctx, H); ctx.fill();
    ctx.fillStyle = st.side; bandPath(ctx, H - 3); ctx.fill();
    ctx.fillStyle = st.top; facePath(ctx); ctx.fill();
    ctx.strokeStyle = st.ring; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, 0, RX - 14, RY - 5, 0, 0, Math.PI * 2); ctx.stroke();
    var top = c.top.length, sh = c.backSh.length;
    if (!top && !sh) continue;
    ctx.fillStyle = '#0D1620';
    if (top) {                                   /* shadows cast onto the top face, cut to the face */
      ctx.save(); facePath(ctx); ctx.clip(); ctx.setTransform(V.a, 0, 0, V.a, V.e, V.f); polys(ctx, c.top); ctx.restore();
      if (sh) ctx.setTransform(cs, sn, -sn, cs, V.a * c.x + V.e + sn * H / 2, V.a * c.y + V.f - cs * H / 2);
    }
    if (sh) {                                    /* coins behind: the front coins' shadows, cut to the silhouette */
      ctx.save(); silPath(ctx); ctx.clip(); ctx.setTransform(V.a, 0, 0, V.a, V.e, V.f); polys(ctx, c.backSh); ctx.restore();
    }
  }
  L.dirty = false;
}
function paint(force){
  if (!VIEW) return;
  if (force || LANES.back.dirty) drawLane(LANES.back);
  if (force || LANES.front.dirty) drawLane(LANES.front);
}
function render(t){
  poseAt(t);
  /* 1. coins whose pose changed get a new outline. Coins at rest are skipped entirely. */
  var mFront = [], mBack = [];
  for (var i = 0; i < coins.length; i++) {
    var c = coins[i];
    c.moved = c.on !== c.wasOn || (c.on && (c.x !== c.px || c.y !== c.py || c.a !== c.pa));
    if (!c.moved) continue;
    c.wasOn = c.on;
    (c.lane === 'front' ? mFront : mBack).push(c);
    c.px = c.x; c.py = c.y; c.pa = c.a; c.cast = null; c.ver++;
    if (!c.on) { c.pts = null; continue; }
    c.pts = worldOutline(c); c.bb = bbox(c.pts); c.face = faceBox(c);
  }
  if (!mFront.length && !mBack.length) return;
  if (mFront.length) { front.order = front.slice().sort(byHeight); LANES.front.dirty = true; }
  if (mBack.length) back.order = back.slice().sort(byHeight);
  LANES.back.dirty = true;                      /* the coins behind also carry the front coins' shadows */
  /* 2. shadows on top faces, from coins above in the same row — only where a caster or the receiver moved */
  [[front, mFront], [back, mBack]].forEach(function(L){
    var list = L[0], moved = L[1];
    if (!moved.length) return;
    list.forEach(function(c){
      if (!c.on || !touched(c, moved, castsTop, c.topFrom)) return;
      var from = [], top = [];
      if (SHADOW_EACH && tilt(c.a) <= FACE_TILT) {
        var yP = c.y - H / 2;
        list.forEach(function(o){
          if (!castsTop(o, c) || !overlap(shadowBoxH(o.bb, yP), c.face)) return;
          from.push(o);
          /* each caster's piece is kept until that caster (or this face) moves */
          var k = c.pieces.get(o);
          if (!k || k.v !== o.ver || k.yP !== yP) {
            var q = new Array(o.pts.length * 2);
            for (var j = 0; j < o.pts.length; j++) { var p = o.pts[j], pr = projectH(p[0], p[1], yP); q[2 * j] = pr[0]; q[2 * j + 1] = pr[1]; }
            c.pieces.set(o, k = { v:o.ver, yP:yP, p:q });
          }
          top.push(k.p);
        });
      }
      c.topFrom = from; c.top = top;
    });
  });
  /* 3. shadows of the front coins on the faces of the coins behind. Each front coin's projection is the same
        for every coin behind, so it is computed once per move and shared. */
  back.forEach(function(c){
    if (!c.on || !touched(c, mFront, castsBack, c.backFrom)) return;
    var from = [], sh = [];
    front.forEach(function(o){
      if (!castsBack(o, c)) return;
      if (!o.cast) o.cast = shadowPath(o.pts, Z_BACK_FACE);
      if (!overlap(o.cast.bb, [c.bb[0] - 2, c.bb[1] - 2, c.bb[2] + 2, c.bb[3] + 2])) return;     /* cut to c's silhouette: a shadow beside it shows nothing */
      from.push(o); sh.push(o.cast.p);
    });
    c.backFrom = from; c.backSh = sh;
  });
}

/* ---------- the burst around the number (flat: ring, rays, sparkles) ----------
   One staggered tween per group instead of one tween per element. */
function burst(tl, at){
  var b = $('burst'); b.innerHTML = '';
  var BLUE = '#3FA0F0', WHITE = '#EEF5EF';
  /* two thin rings, hugging the amount's shape, one just after the other */
  var RINGS = [[3.5, BLUE], [2, WHITE]];
  var rings = RINGS.map(function(r){ return el('ellipse', { cx:0, cy:0, rx:150, ry:48, fill:'none', stroke:r[1] }, b); });
  /* short rays from the rim, alternating blue and white */
  var n = 12, RAYS = [], rays = [];
  for (var i = 0; i < n; i++) {
    var a = (i + .5) / n * Math.PI * 2;
    RAYS.push({ c:Math.cos(a), s:Math.sin(a), L:i % 2 ? 12 : 18 });
    rays.push(el('line', { 'stroke-linecap':'round', 'stroke-width':i % 2 ? 2.5 : 3.5, stroke:i % 2 ? WHITE : BLUE }, b));
  }
  /* sparkles: pop in with a turn, twinkle once, then leave outwards from the amount's centre */
  var SP = 'M0 -10 C.9 -2.7 2.7 -.9 10 0 2.7 .9 .9 2.7 0 10 -.9 2.7 -2.7 .9 -10 0 -2.7 -.9 -.9 -2.7 0 -10 Z';
  var STARS = [[-200, -26, WHITE, 1.3], [-150, 50, BLUE, .8], [-60, -70, WHITE, .7], [70, -72, BLUE, .9], [190, -30, WHITE, 1.1], [160, 52, WHITE, .75], [20, 74, BLUE, .65]];
  var sparks = STARS.map(function(p){ return el('path', { d:SP, fill:p[2] }, b); });
  /* hidden from the moment they exist: the timeline only shows them at the landing (before it first renders,
     a fresh ring and a sparkle would otherwise sit visible over the amount) */
  gsap.set(rings.concat(rays), { opacity:0 });
  gsap.set(sparks, { opacity:0, x:0, y:0, scale:0 });

  tl.set(rings.concat(rays), { opacity:0 }, 0);
  tl.set(sparks, { opacity:0, x:0, y:0, scale:0 }, 0);
  tl.fromTo(rings, { opacity:1, attr:{ rx:150, ry:48, 'stroke-width':function(i){ return RINGS[i][0]; } } },
    { opacity:0, attr:{ rx:235, ry:96, 'stroke-width':.5 }, duration:.7, ease:'expo.out', immediateRender:false, stagger:.09 }, at);
  tl.fromTo(rays, { opacity:1, attr:{ x1:function(i){ return RAYS[i].c * 158; }, y1:function(i){ return RAYS[i].s * 54; },
                                       x2:function(i){ return RAYS[i].c * 160; }, y2:function(i){ return RAYS[i].s * 55; } } },
    { attr:{ x1:function(i){ return RAYS[i].c * 188; }, y1:function(i){ return RAYS[i].s * 80; },
             x2:function(i){ return RAYS[i].c * (188 + RAYS[i].L); }, y2:function(i){ return RAYS[i].s * (80 + RAYS[i].L * .7); } },
      duration:.38, ease:'expo.out', immediateRender:false, stagger:function(i){ return (i % 3) * .015; } }, at + .03);
  tl.to(rays, { opacity:0, duration:.2, ease:'power1.in' }, at + .24);
  tl.fromTo(sparks, { x:function(i){ return STARS[i][0] * .72; }, y:function(i){ return STARS[i][1] * .72; }, scale:0, rotation:-60, opacity:1 },
    { x:function(i){ return STARS[i][0]; }, y:function(i){ return STARS[i][1]; }, scale:function(i){ return STARS[i][3]; }, rotation:0,
      duration:.42, ease:'back.out(2)', immediateRender:false, stagger:.03 }, at + .04);
  tl.to(sparks, { scale:function(i){ return STARS[i][3] * .7; }, duration:.12, ease:'sine.inOut', stagger:{ each:.02, yoyo:true, repeat:1 } }, at + .5);
  /* exit: keep travelling away from the centre, shrink and fade */
  tl.to(sparks, { x:function(i){ return STARS[i][0] * 1.7; }, y:function(i){ return STARS[i][1] * 1.7; }, scale:0, rotation:45, opacity:0,
    duration:.5, ease:'power2.in', stagger:.025 }, at + .82);
}

/* ---------- shockwave: an expanding bubble of compressed air that refracts the screen like a glass ball ----------
   Nothing is drawn on top: the whole screen (number, pills, stars, coins) is seen through a bubble that grows out of
   the number. Inside, the picture is magnified; towards the bubble's edge it is pulled in harder and harder, so near
   the edge it is squeezed into a band that repeats what is inside (as at the rim of a glass ball), and the edge is a
   sharp seam against the undisturbed picture outside; just outside, a thin band of compressed air pushes outwards.
   How: while the wave is on screen (about a second), <main> gets an SVG displacement filter. Its map is one image
   made once (red/green = where each pixel samples from, along the radius); each frame only moves/resizes that image
   and sets the strength. The red, green and blue channels are bent slightly differently (a glass fringe from the
   scene's own colours; nothing is added). Strength 1 by default; ?shock=<number> overrides it (?shock=0 = off). */
var WAVE = { r:0, s:0 }, shock = null;
/* the shockwave's settings (the Tune panel changes SW; SW_DEFAULT is what ships) */
var SW_DEFAULT = {
  strength:1,        /* overall bend (×) */
  sweep:1.35,        /* s: time for the bubble to grow past the screen */
  reach:1000,        /* design units: the bubble's final radius */
  bendShare:.35,     /* bend at the edge, as a share of the bubble's radius (how magnified the inside looks) */
  bendMax:90,        /* design units: the most the edge may bend */
  edge:.16,          /* edge softness: smaller = harder squeeze and sharper repeated band at the rim */
  air:.3,            /* push of the compressed-air band just outside the edge */
  fringe:2.5,        /* % difference in bend between red, green and blue (glass colour fringe); 0 = none */
  hold:.27,          /* s after the landing before the bend starts to fade */
  fade:.95,          /* s for the bend to fade out */
  delay:0            /* s: the wave starts this long after the landing */
};
var SW = Object.assign({}, SW_DEFAULT);
if (Q.has('shock')) SW.strength = Math.max(0, parseFloat(Q.get('shock')) || 0);   /* ?shock=<number>: strength (0 = off) */
var SHOCK_EDGE = .82;     /* the bubble's edge, as a share of the map's half-size (the rest is the outer air band) */
function shockMap(){
  var N = 384, cv = document.createElement('canvas'); cv.width = cv.height = N;
  var c = cv.getContext('2d'), img = c.createImageData(N, N), d = img.data, E = Math.max(.01, SW.edge), K = 1 / Math.sqrt(E);
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
    var dx = (x + .5) / N * 2 - 1, dy = (y + .5) / N * 2 - 1, r = Math.sqrt(dx * dx + dy * dy) || 1e-6, q = r / SHOCK_EDGE, f;
    var t = (q - 1) / .07, out = SW.air * Math.exp(-t * t);                       /* compressed air just outside: push out */
    var inn = -Math.min(q, 1) / Math.sqrt(1 - Math.min(q, 1) * Math.min(q, 1) + E) / K;   /* glass ball: pull towards the centre, harder near the edge */
    var w = Math.max(0, Math.min(1, (q - .985) / .03));                       /* the seam, over a few pixels (no jagged edge) */
    f = inn * (1 - w) + out * w;
    f *= Math.max(0, Math.min(1, (1 - r) / .05));                             /* nothing at the image's own edge */
    var i = (y * N + x) * 4;
    d[i] = Math.round(128 + 127 * f * dx / r); d[i + 1] = Math.round(128 + 127 * f * dy / r); d[i + 2] = 128; d[i + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  return cv.toDataURL('image/png');
}
function shockInit(){
  if (shock !== null) return shock;
  var svg = el('svg', { width:0, height:0, 'aria-hidden':'true', style:'position:absolute;width:0;height:0;overflow:hidden' }, document.body);
  var f = el('filter', { id:'shock', x:0, y:0, width:'100%', height:'100%', 'color-interpolation-filters':'sRGB' }, el('defs', {}, svg));
  el('feFlood', { 'flood-color':'#808080', result:'n' }, f);
  var im = el('feImage', { preserveAspectRatio:'none', x:0, y:0, width:1, height:1, result:'ring' }, f);
  im.setAttribute('href', shockMap()); im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', im.getAttribute('href'));
  el('feComposite', { in:'ring', in2:'n', operator:'over', result:'map' }, f);
  var maps = [];
  function disp(res){ var m = el('feDisplacementMap', { in:'SourceGraphic', in2:'map', scale:0, xChannelSelector:'R', yChannelSelector:'G', result:res }, f); maps.push(m); return m; }
  {
    /* colour fringing on every phone: each channel bent a little differently (the page is opaque, so the channels add back
       up). Each keeps its alpha, so whatever is pulled in from beyond the page's edge stays transparent (not black). */
    disp('dr'); disp('dg'); disp('db');
    el('feColorMatrix', { in:'dr', type:'matrix', values:'1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', result:'r' }, f);
    el('feColorMatrix', { in:'dg', type:'matrix', values:'0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', result:'g' }, f);
    el('feColorMatrix', { in:'db', type:'matrix', values:'0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', result:'b' }, f);
    el('feComposite', { in:'r', in2:'g', operator:'arithmetic', k1:0, k2:1, k3:1, k4:0, result:'rg' }, f);
    el('feComposite', { in:'rg', in2:'b', operator:'arithmetic', k1:0, k2:1, k3:1, k4:0 }, f);
  }
  return (shock = { im:im, maps:maps, mapKey:SW.edge + '/' + SW.air, on:false, at:null });
}
function shockFrame(){
  var live = WAVE.s > .01 && WAVE.r > 0 && SW.strength > 0;
  var S = shockInit(); if (!S) return;
  var main = document.querySelector('main');
  if (!live) { if (S.on) { S.on = false; main.style.filter = ''; } return; }
  if (!S.on) {
    /* the number's centre in <main>'s own coordinates; one design unit in CSS px */
    var m = main.getBoundingClientRect(), b = $('burst').getBoundingClientRect();
    S.at = { x:b.left + b.width / 2 - m.left, y:b.top + b.height / 2 - m.top,
             u:parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 1 };
    S.on = true; main.style.filter = 'url(#shock)';
  }
  var R = WAVE.r * S.at.u, half = R / SHOCK_EDGE;
  S.im.setAttribute('x', (S.at.x - half).toFixed(1)); S.im.setAttribute('y', (S.at.y - half).toFixed(1));
  S.im.setAttribute('width', (2 * half).toFixed(1)); S.im.setAttribute('height', (2 * half).toFixed(1));
  /* bend at the edge (px): grows with the bubble (about a third of its radius, so the inside is visibly magnified)
     up to ~90 px, while the wave fades */
  var bend = Math.min(SW.bendShare * R, SW.bendMax * S.at.u) * WAVE.s * SW.strength, k = 2 * bend, fr = SW.fringe / 100;
  var split = [1 + fr, 1, 1 - fr];
  S.maps.forEach(function(m, i){ m.setAttribute('scale', (k * split[i]).toFixed(2)); });
}
function shockwave(tl, at){
  WAVE.r = WAVE.s = 0;
  tl.set(WAVE, { r:0, s:0 }, 0);
  if (!SW.strength) return;
  /* the edge shape changed in the Tune panel: make the map again */
  if (shock && shock.mapKey !== SW.edge + '/' + SW.air) { var u = shockMap(); shock.im.setAttribute('href', u); shock.im.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', u); shock.mapKey = SW.edge + '/' + SW.air; }
  at += SW.delay;
  /* the bubble grows out of the number past the screen's corners: fast at first, so it reaches the coins as they are
     knocked up, then the bend fades while it is still sweeping out */
  tl.fromTo(WAVE, { r:20 }, { r:SW.reach, duration:SW.sweep, ease:'power2.out', immediateRender:false }, at);
  tl.fromTo(WAVE, { s:0 }, { s:1, duration:.05, ease:'power1.out', immediateRender:false }, at);
  tl.to(WAVE, { s:0, duration:SW.fade, ease:'power2.in' }, at + SW.hold);
}

/* ---------- stars behind the coins keep twinkling: breathe in scale, tilt a little, each on its own beat ----------
   They loop forever, so they are paused while the page is hidden and never started with reduced motion. */
var twinkles = [];
function stopTwinkles(){ twinkles.forEach(function(t){ t.kill(); }); twinkles = []; gsap.set('.tw', { scale:1, rotation:0 }); }
function twinkle(){
  twinkles.forEach(function(t){ t.kill(); }); twinkles = [];
  document.querySelectorAll('.tw').forEach(function(g, i){
    var d = +g.dataset.d, o = g.dataset.o;
    var t = gsap.timeline({ repeat:-1, delay:i * .17, defaults:{ ease:'sine.inOut', svgOrigin:o } });
    t.to(g, { scale:.62, rotation:18, duration:d * .45 })
     .to(g, { scale:1.08, rotation:-6, duration:d * .35 })
     .to(g, { scale:1, rotation:0, duration:d * .2, ease:'sine.out' });
    if (document.hidden) t.pause();
    twinkles.push(t);
  });
}
document.addEventListener('visibilitychange', function(){
  twinkles.forEach(function(t){ document.hidden ? t.pause() : t.resume(); });
});

/* ---------- timeline ---------- */
var tl = null, NUM = { v:0 }, fresh = false;
function frame(){ render(tl.time()); paint(false); shockFrame(); }   /* one draw per tick, only for rows that changed; then the shockwave lens */
function build(){
  if (tl) tl.kill();
  stopTwinkles();
  NUM.v = CONFIG.from;
  tl = gsap.timeline({ paused:true, onUpdate:frame, defaults:{ ease:'power2.out' } });
  tl.timeScale(SPEED);
  var F = COUNT.start + COUNT.dur;   /* the new limit lands — and so does the last coin */
  var END = F + 1.1;                 /* long enough for the kicked coins to settle */
  tl.addLabel('count', COUNT.start).addLabel('land', F).addLabel('end', END);

  /* the amount */
  /* entrance: the label fades and rises in, then the amount follows, rising a little further and settling from a
     slight scale and blur; the blur is cleared afterwards (no lasting filter layer) */
  tl.fromTo('#label', { opacity:0, y:10 }, { opacity:1, y:0, duration:.55, ease:'power3.out' }, 0);
  tl.fromTo(amountEl, { opacity:0, yPercent:28, scale:.94, filter:'blur(8px)', color:'#EEF5EF' },
    { opacity:1, yPercent:0, scale:1, filter:'blur(0px)', duration:.7, ease:'expo.out', clearProps:'filter' }, .12);
  tl.fromTo(NUM, { v:CONFIG.from }, { v:CONFIG.to, duration:COUNT.dur, onUpdate:function(){ setAmount(money(NUM.v)); } }, 'count');
  /* anticipation: a tiny squeeze just before it lands */
  tl.to(amountEl, { scale:.94, duration:.08, ease:'power2.in' }, 'land-=.08');
  /* punch: big, blue, then an elastic settle */
  tl.to(amountEl, { scale:1.3, color:'#3FA0F0', duration:.11, ease:'power3.out' }, 'land');
  tl.to(amountEl, { scale:1, duration:.6, ease:'elastic.out(1.15,0.42)' }, 'land+=.11');
  tl.to(amountEl, { color:'#EEF5EF', duration:.6, ease:'power1.inOut' }, 'land+=.55');
  /* burst: rings, rays and sparkles thrown out from the number */
  burst(tl, F);
  /* shockwave: a ring of compressed air that bends everything behind it */
  shockwave(tl, F);
  /* the whole scene takes the hit */
  tl.to(['#hero', '#art'], { keyframes:{ x:[0, -7, 6, -4, 3, -1, 0], y:[0, 4, -3, 2, -1, 0, 0] }, duration:.34, ease:'none' }, 'land');
  tl.fromTo('#up', { scale:.3, opacity:0 }, { scale:1, opacity:1, duration:.36, ease:'back.out(2.6)' }, 'land+=.05');
  tl.fromTo('#was', { x:-8, opacity:0 }, { x:0, opacity:1, duration:.26 }, 'land+=.1');
  tl.fromTo('#exp', { y:8, opacity:0 }, { y:0, opacity:1, duration:.3, ease:'power3.out' }, 'land+=.16');
  tl.fromTo('#starC', { scale:0, rotation:0, svgOrigin:'118 420' }, { scale:1, rotation:90, duration:.35, ease:'back.out(3)' }, 'land+=.04');
  tl.fromTo('#starW', { scale:1, svgOrigin:'600 330' }, { scale:1.35, duration:.12, yoyo:true, repeat:1 }, 'land+=.02');

  /* coins and the shadows they cast appear together */
  tl.fromTo('#cvBack', { opacity:0 }, { opacity:1, duration:.15, ease:'power1.out' }, .18);
  tl.fromTo('#cvFront', { opacity:0 }, { opacity:1, duration:.15, ease:'power1.out' }, .24);
  tl.fromTo('#starW', { scale:0, rotation:-90, svgOrigin:'600 330' }, { scale:1, rotation:0, duration:.4, ease:'back.out(2.4)' }, .4);
  tl.fromTo('#starS1', { scale:0, rotation:-90, svgOrigin:'430 300' }, { scale:1, rotation:0, duration:.35, ease:'back.out(2.6)' }, .7);
  tl.fromTo('#starS2', { scale:0, rotation:-90, svgOrigin:'268 352' }, { scale:1, rotation:0, duration:.35, ease:'back.out(2.6)' }, 1.0);
  tl.add(twinkle, .8);

  tl.add(function(){ emit('landed'); }, 'land');
  tl.add(function(){ replay.classList.add('on'); emit('done'); }, 'end-=.2');
  /* the UI is done at 'end' (3.4 s, the 'done' event); the recorded coins may settle a moment longer */
  tl.to({}, { duration:.01 }, Math.max(END, (BAKED.end || END) - .01));
  gsap.set(['#up', '#was', '#exp'], { opacity:0 });
  frame();
  fresh = true;
  return tl;
}
/* reduced motion: no timeline, no twinkling — draw the last baked frame and the final text straight away */
function showFinal(){
  if (tl) { tl.kill(); tl = null; }
  stopTwinkles();
  $('burst').innerHTML = '';
  WAVE.s = 0; shockFrame();
  gsap.set(['#label', '#amount', '#up', '#was', '#exp'], { opacity:1, x:0, y:0, scale:1 });
  gsap.set(['#label', amountEl], { clearProps:'filter' }); gsap.set(amountEl, { yPercent:0 });
  gsap.set(amountEl, { color:'#EEF5EF' });
  gsap.set(['#hero', '#art'], { x:0, y:0 });
  gsap.set(['#cvBack', '#cvFront'], { opacity:1 });
  gsap.set(['#starW', '#starS1', '#starS2', '#starC'], { scale:1, rotation:0 });
  setAmount(money(CONFIG.to));
  render(BAKED.end); paint(false);
  replay.classList.remove('on');            /* nothing to replay */
  emit('landed'); emit('done');
}
/* before anything plays (or while waiting for play(data)): the page shows the first frame, not the sample's end state */
function prepare(){
  if (reduce) { gsap.set(['#label', '#amount', '#up', '#was', '#exp', '#cvBack', '#cvFront'], { opacity:0 }); return; }
  build();
}
var started = false;
function start(){
  started = true;
  replay.classList.remove('on');
  if (reduce) { showFinal(); return; }
  if (!tl || !fresh) build();
  fresh = false;
  tl.play(0);
}

/* reduced motion via gsap.matchMedia(): follows the phone setting live (?motion forces the animation) */
var reduce = false, booted = false, pending = null;
var mm = gsap.matchMedia();
mm.add({ reduce:'(prefers-reduced-motion: reduce)', full:'(prefers-reduced-motion: no-preference)' }, function(ctx){
  reduce = !!ctx.conditions.reduce && !Q.has('motion');
  if (booted && started) start();           /* the setting changed while this screen is open */
});

/* start straight away: nothing here needs the fonts. When they are ready the amount is re-measured. */
function boot(){
  booted = true;
  setupCoins();
  fit(); applyData(); layoutCanvas();
  addEventListener('resize', onResize);
  /* the artwork's box also changes when the browser bars slide (its height is capped at 42% of the screen) */
  if (window.ResizeObserver) new ResizeObserver(function(){ layoutCanvas(); }).observe($('artStars'));
  replay.addEventListener('click', start);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fitAmount(); });
  var T = parseFloat(Q.get('t'));
  /* the scene is shown only now, with its first frame set (see the page's first-paint style) */
  var reveal = function(){ document.documentElement.classList.add('cl-on'); };
  if (!isNaN(T)) { build(); tl.seek(T, false); window.__seek = function(x){ tl.seek(x, false); return tl.duration(); }; reveal(); return; }
  if (pending) { var p = pending; pending = null; window.PeraCreditLimit.play(p); reveal(); return; }
  prepare(); reveal();
  if (window.CREDIT_LIMIT_AUTOPLAY !== false) setTimeout(function(){ if (!started) start(); }, 250);
}
/* public API for the host page / app */
window.PeraCreditLimit = {
  /* play (or replay) with backend data; options.onLanded / options.onDone are optional callbacks */
  play:function(data, options){
    if (!booted) { pending = data; HOOKS = options || HOOKS; return; }
    if (options) HOOKS = options;
    CONFIG = normalize(data || CONFIG);
    applyData(); fresh = false; start();
  },
  replay:function(){ if (booted) { fresh = false; start(); } },
  duration:3.4,
  getData:function(){ return Object.assign({}, CONFIG); }
};
window.__tl = function(){ return tl; };

/* ==== SHOCKWAVE TUNE PANEL (prototype only: delete this block, the #tune markup and its styles for production) ====
   Sliders for the shockwave only. Releasing a slider replays with the new values; the values are kept on this phone;
   Copy gives them as JSON (to write into SW_DEFAULT). ?shock=<number> in the link still sets the strength. */
(function(){
  var KEY = 'perasure.creditLimit.shockTune';
  var ROWS = [
    ['strength', 'Strength', 0, 3, .05, function(v){ return '×' + (+v).toFixed(2); }],
    ['sweep', 'Speed: time to sweep the screen', .4, 3, .05, function(v){ return (+v).toFixed(2) + ' s'; }],
    ['delay', 'Start after the landing', -.3, .5, .01, function(v){ return (+v).toFixed(2) + ' s'; }],
    ['hold', 'Full strength for', 0, 1.5, .01, function(v){ return (+v).toFixed(2) + ' s'; }],
    ['fade', 'Fade out over', .1, 2.5, .05, function(v){ return (+v).toFixed(2) + ' s'; }],
    ['reach', 'Final size (radius)', 300, 1600, 10],
    ['bendShare', 'Magnification inside', .05, .7, .01, function(v){ return Math.round(v * 100) + '%'; }],
    ['bendMax', 'Max bend at the edge', 10, 250, 5],
    ['edge', 'Edge softness', .02, .5, .01, function(v){ return (+v).toFixed(2); }],
    ['air', 'Air band outside the edge', 0, 1, .05, function(v){ return (+v).toFixed(2); }],
    ['fringe', 'Colour fringe', 0, 10, .5, function(v){ return (+v).toFixed(1) + '%'; }]
  ];
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) Object.keys(SW_DEFAULT).forEach(function(k){ if (typeof saved[k] === 'number' && !(k === 'strength' && Q.has('shock'))) SW[k] = saved[k]; });
  } catch (e) {}
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(SW)); } catch (e) {} }
  /* replay; if the panel is open it steps aside until the wave has passed, so the replay can be seen, then comes back */
  var peekTimer = 0;
  function replayNow(){
    if (!booted) return;
    fresh = false; start();
    if (!panel.classList.contains('on')) return;
    panel.classList.add('peek'); clearTimeout(peekTimer);
    var until = COUNT.start + COUNT.dur + Math.max(0, SW.delay) + Math.max(SW.sweep, SW.hold + SW.fade) + .3;
    peekTimer = setTimeout(function(){ panel.classList.remove('peek'); }, until * 1000 / SPEED);
  }
  var panel = $('tune'), rowsEl = $('tuneRows'), catcher = $('tuneCatch'), inputs = {};
  ROWS.forEach(function(r){
    var row = document.createElement('label'); row.className = 'row';
    var name = document.createElement('span'); name.textContent = r[1];
    var out = document.createElement('output');
    var inp = document.createElement('input'); inp.type = 'range'; inp.min = r[2]; inp.max = r[3]; inp.step = r[4]; inp.value = SW[r[0]];
    var show = function(){ var v = +inp.value; out.textContent = (r[5] ? r[5](v) : String(v)) + (v === SW_DEFAULT[r[0]] ? '' : ' •'); };
    inp.addEventListener('input', show);
    inp.addEventListener('change', function(){ SW[r[0]] = +inp.value; show(); save(); replayNow(); });
    row.appendChild(name); row.appendChild(out); row.appendChild(inp); rowsEl.appendChild(row);
    inputs[r[0]] = { inp:inp, show:show }; show();
  });
  function openPanel(){ panel.classList.add('on'); catcher.classList.add('on'); }
  function closePanel(){ panel.classList.remove('on', 'peek'); catcher.classList.remove('on'); clearTimeout(peekTimer); }
  $('tuneBtn').addEventListener('click', openPanel);
  $('tuneClose').addEventListener('click', closePanel);
  catcher.addEventListener('click', closePanel);                /* a tap anywhere outside the panel closes it */
  $('tuneReplay').addEventListener('click', function(){ replayNow(); });
  $('tuneReset').addEventListener('click', function(){
    SW = Object.assign({}, SW_DEFAULT); save();
    Object.keys(inputs).forEach(function(k){ inputs[k].inp.value = SW[k]; inputs[k].show(); });
    replayNow();
  });
  $('tuneCopy').addEventListener('click', function(){
    var text = JSON.stringify(SW), b = this;
    var done = function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = 'Copy'; }, 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function(){ prompt('Shockwave values', text); });
    else prompt('Shockwave values', text);
  });
})();
/* ==== END SHOCKWAVE TUNE PANEL ==== */

/* start as soon as the recording is in (the page preloads it while GSAP loads); play(data) calls made before then wait.
   A page that already has the recording can set window.CREDIT_LIMIT_BAKED instead. */
var RECORDING = document.currentScript && document.currentScript.getAttribute('data-recording') || 'baked.json';
(window.CREDIT_LIMIT_BAKED ? Promise.resolve(window.CREDIT_LIMIT_BAKED)
  : fetch(RECORDING).then(function(r){ if (!r.ok) throw new Error(r.status + ' ' + r.url); return r.json(); }))
  .then(function(R){ useRecording(R); boot(); })
  .catch(function(e){ console.error('[credit limit] could not load the coin recording (' + RECORDING + '):', e); });
})();
