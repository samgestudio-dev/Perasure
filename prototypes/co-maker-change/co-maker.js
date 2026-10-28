/* Change co-maker — page code.
   "Change" turns the co-maker card (state A, Figma 10168:26372) into the "Change your co-maker" form (state B,
   10168:26423); Cancel / Save turn it back. Built the way the withdraw fund flow builds its morphs (withdraw.js:
   tweenMp, introExit):

   · ONE progress k (0 = A, 1 = B) in a Motion value, animated by Motion with the page's spring; its change event writes
     every style straight to the DOM (no framework renders). A tap mid-morph re-targets the same value, so the spring
     carries its velocity into the reversal and turns around smoothly from where it is.
   · Speed, not time, matches the withdraw morph: the longest travel here (the Change pill → Save, ≈ 202 px) is compared
     with the loan morph's (its page's bottom edge, 624 → 246 px = 378 px at the design size); the spring is the same
     one stretched in time by that ratio (stiffness ÷ s², damping ÷ s — same damping ratio, same curve), clamped to
     0.6–2.5 like the withdraw exit.
   · Geometry follows k clamped to 0–1 (no box goes negative on the spring's sub-pixel overshoot); everything else rides
     windows of k (smoothstep), the same function both ways, so a reversal simply runs them back and — the spring being
     front-loaded — leaving is naturally quicker than arriving.
   · The card box grows / shrinks (its rounded overflow is the clip). What leaves fades before the moving edge could cut
     it; what sits on the card's bottom (Cancel, and Save once it gets there) rides the bottom edge; the card below rides
     it too (a transform — the page's layout is committed once, at rest).
   · Shared elements stay one element the whole way: the avatar tile (40 → 48, icon 24 → 32), and the Change pill, which
     travels to Save's place and becomes it (its light fill turns primary, "Change" leaves, "Save" arrives). The name is
     a pair on ONE path: the header name (Hanken 16) and the form's Name value (Inter Medium 14) move and scale together
     from one spot to the other, crossfading with a little blur in the middle (MT.Y travel, 3 px blur — as withdraw).
   · Everything that comes in rises its MT.Y distance and comes into focus from a 3 px blur, staggered top-down, early
     enough to overlap what leaves (the card is never empty); what leaves rises out and blurs a little.
   · Per frame only transform / opacity / filter, plus the card's height and the tile's / pill's size (small, absolutely
     positioned boxes — they lay out nothing else). A value equal to the last one written is not written again.
   ?feel=Snappy | Gentle picks the other withdraw feels; prefers-reduced-motion jumps. */
(function(){
  'use strict';
  var Mo = window.Motion;
  var qs = location.search;

  /* ---- motion constants: prototypes/withdraw-fund-flow/motion-tokens.js (same values) ---- */
  var FEEL = {
    Smooth: { stiffness: 240, damping: 30, mass: 1 },
    Snappy: { stiffness: 430, damping: 34, mass: 0.8 },
    Gentle: { stiffness: 140, damping: 24, mass: 1.15 }
  };
  var F = FEEL[(/[?&]feel=(\w+)/.exec(qs) || [])[1]] || FEEL.Smooth;
  var MTY = { text: 8, block: 10 };
  var EASE_IN = [0.22, 0.61, 0.36, 1];
  var ENTER = { duration: 0.30, delay: 0.07, ease: EASE_IN }, LEAVE = { duration: 0.15, ease: [0.4, 0, 1, 1] };
  var PRESS = { duration: 0.06 }, PRESS_SCALE = { pill: 0.985, icon: 0.92 };
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  var $ = function(id){ return document.getElementById(id); };
  var r3 = function(v){ return Math.round(v * 1000) / 1000; };
  var lerp = function(a, b, t){ return a + (b - a) * t; };

  /* ---- geometry (card coordinates, Figma) ---- */
  var H0 = 182, H1 = 296;                                  /* card height: A, B */
  var NAME_A = { x: 64, y: 40, s: 16 }, NAME_B = { x: 116, y: 88, s: 14 };
  var PILL_A = { l: 224, t: 41, w: 88, h: 40 }, PILL_B = { l: 170, w: 142, h: 44, bottom: 60 };   /* B: top = card height − 60 */
  var BTN_BOTTOM = 60;                                     /* Cancel / Save: 236 in a 296 card */

  var R = {
    slot: $('slot'), card: $('card'), steps: $('steps'), tile: $('tile'), tileIcon: $('tileIcon'),
    aCap: $('aCap'), aName: $('aName'), aPhone: $('aPhone'), aLink: $('aLink'), aNote: $('aNote'),
    bTitle: $('bTitle'), bRow1: $('bRow1'), bName: $('bName'), rule1: $('rule1'), bRow2: $('bRow2'), rule2: $('rule2'), bRow3: $('bRow3'),
    cancelWrap: $('cancelWrap'), cancel: $('cancel'),
    pill: $('pill'), pillBtn: $('pillBtn'), pillStrong: $('pillStrong'), pillChange: $('pillChange'), pillSave: $('pillSave'),
    ctaOff: $('ctaOff'), cta: $('cta'), home: $('home'), back: $('back'),
    copy: $('copy'), copyLbl: $('copyLbl'), url: $('url'),
    inName: $('inName'), inRel: $('inRel'), relV: $('relV'), inMobile: $('inMobile'),
    scroll: $('scroll'), kb: $('kb')
  };
  var A_LAYER = [R.aCap, R.aName, R.aPhone, R.aLink, R.aNote];
  var B_LAYER = [R.bTitle, R.bRow1, R.bName, R.rule1, R.bRow2, R.rule2, R.bRow3, R.cancelWrap];

  /* ---- data ---- */
  var D = { name: 'Sam Ge', phone: '9123456789', rel: '', code: '7KQ2-JD9A' };
  var fmtPhone = function(d){ return d.replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*$/, function(_, a, b, c){ return [a, b, c].filter(Boolean).join(' '); }); };

  /* ---- writing styles: only what changed ---- */
  var last = new Map();
  function put(el, prop, val){
    var m = last.get(el); if (!m) { m = {}; last.set(el, m); }
    if (m[prop] === val) return;
    m[prop] = val; el.style[prop] = val;
  }
  function show(el, o){ put(el, 'visibility', o > 0.001 ? 'visible' : 'hidden'); put(el, 'opacity', String(r3(o))); }
  function blur(el, px){ put(el, 'filter', px > 0.01 ? 'blur(' + r3(px) + 'px)' : 'none'); }

  /* ---- one frame at progress k ---- */
  var slotH = H0;                                           /* the slot's laid-out height (committed at rest) */
  function apply(k){
    var c = Math.max(0, Math.min(1, k));
    var win = function(a, b){ var t = Math.max(0, Math.min(1, (k - a) / (b - a))); return t * t * (3 - 2 * t); };
    /* leaving: rises its MT.Y distance and blurs a little; coming in: rises into place from a 3 px blur */
    var out = function(el, a, b, y){ var e = win(a, b); show(el, 1 - e); blur(el, 3 * e); put(el, 'transform', 'translateY(' + r3(-y * e) + 'px)'); };
    var inn = function(el, a, b, y, base){ var e = win(a, b); show(el, e); blur(el, 3 * (1 - e)); put(el, 'transform', 'translateY(' + r3((base || 0) + y * (1 - e)) + 'px)'); };

    /* the box, and the card below riding its bottom edge */
    var h = lerp(H0, H1, c);
    put(R.card, 'height', r3(h) + 'px');
    put(R.steps, 'transform', Math.abs(h - slotH) < 0.001 ? 'none' : 'translateY(' + r3(h - slotH) + 'px)');

    /* shared: avatar tile 40 → 48 (top 41 → 16), icon 24 → 32 */
    var ts = lerp(40, 48, c);
    put(R.tile, 'width', r3(ts) + 'px'); put(R.tile, 'height', r3(ts) + 'px');
    put(R.tile, 'transform', 'translateY(' + r3(lerp(41, 16, c) - 41) + 'px)');
    put(R.tileIcon, 'transform', 'scale(' + r3(lerp(0.75, 1, c)) + ')');

    /* state A leaves (early: gone by ~0.4) */
    out(R.aCap, 0, 0.32, MTY.text);
    out(R.aPhone, 0.02, 0.38, MTY.text);
    out(R.aLink, 0.04, 0.42, MTY.block);
    out(R.aNote, 0, 0.36, MTY.text);

    /* the name pair: one path, one scale, crossfading in the middle */
    /* its path is front-loaded (1 − (1 − k)², still on the same progress) so it lands with the Name row it joins
       instead of hovering above the row while the row is already in place */
    var dx = NAME_B.x - NAME_A.x, dy = NAME_B.y - NAME_A.y, np = 1 - (1 - c) * (1 - c);
    var sA = lerp(1, NAME_B.s / NAME_A.s, np), sB = lerp(NAME_A.s / NAME_B.s, 1, np);
    var nA = win(0.08, 0.5), nB = win(0.22, 0.64);
    put(R.aName, 'transform', 'translate(' + r3(dx * np) + 'px,' + r3(dy * np) + 'px) scale(' + r3(sA) + ')');
    show(R.aName, 1 - nA); blur(R.aName, 3 * nA);
    put(R.bName, 'transform', 'translate(' + r3(-dx * (1 - np)) + 'px,' + r3(-dy * (1 - np)) + 'px) scale(' + r3(sB) + ')');
    show(R.bName, nB); blur(R.bName, 3 * (1 - nB));

    /* state B comes in, top-down */
    inn(R.bTitle, 0.2, 0.62, MTY.text);
    inn(R.bRow1, 0.26, 0.68, MTY.text);
    inn(R.rule1, 0.3, 0.72, 0);
    inn(R.bRow2, 0.33, 0.75, MTY.text);
    /* the Mobile row and its rule come in once the bottom-edge riders (Save, Cancel) have passed their spot — before
       that the card is too short for both and they would cross it */
    inn(R.rule2, 0.62, 0.9, 0);
    inn(R.bRow3, 0.8, 1, MTY.text);
    /* Cancel rides the card's bottom edge and comes in last */
    inn(R.cancelWrap, 0.5, 0.92, MTY.block, h - BTN_BOTTOM);

    /* shared: the Change pill travels to Save's place (B's top rides the bottom edge) and becomes it; its path is
       front-loaded like the name's, so it is past the Mobile row before that row comes in */
    var pl = lerp(PILL_A.l, PILL_B.l, np), pt = lerp(PILL_A.t, h - PILL_B.bottom, np);
    put(R.pill, 'transform', 'translate(' + r3(pl) + 'px,' + r3(pt) + 'px)');
    put(R.pill, 'width', r3(lerp(PILL_A.w, PILL_B.w, np)) + 'px');
    put(R.pill, 'height', r3(lerp(PILL_A.h, PILL_B.h, np)) + 'px');
    show(R.pillStrong, win(0.12, 0.6));
    /* the labels overlap (blur bridges the crossfade), so the pill is never blank */
    var ch = win(0.02, 0.42); show(R.pillChange, 1 - ch); blur(R.pillChange, 3 * ch);
    var sv = win(0.28, 0.72); show(R.pillSave, sv); blur(R.pillSave, 3 * (1 - sv));

    /* the page's primary action is disabled while the form is open (paint only: a disabled layer fades over it) */
    show(R.ctaOff, win(0.1, 0.55));
  }

  /* ---- driving it: one Motion value, one spring ---- */
  var DL = 624 - 246;                                       /* withdraw loan morph travel at the design size */
  var DE = Math.hypot(PILL_B.l - PILL_A.l, (H1 - PILL_B.bottom) - PILL_A.t);
  var TS = Math.min(2.5, Math.max(0.6, DE / DL));
  var SPRING = { type: 'spring', stiffness: F.stiffness / (TS * TS), damping: F.damping / TS, mass: F.mass, restDelta: 0.001, restSpeed: 0.01 / TS };
  var MOVING = [R.card, R.steps, R.tile, R.aName, R.bName, R.pill, R.aLink, R.cancelWrap];

  var mv = Mo && Mo.motionValue ? Mo.motionValue(0) : null, anim = null, target = 0;
  if (mv) mv.on('change', apply);
  function settle(){
    anim = null;
    var h = target ? H1 : H0;
    slotH = h; R.slot.style.height = h + 'px';               /* commit the layout once, at rest */
    apply(target);
    MOVING.forEach(function(el){ el.style.willChange = ''; });
  }
  function go(t){
    target = t;
    /* who can be tapped: decided at the start, so a tap lands on the state being shown */
    A_LAYER.forEach(function(el){ el.style.pointerEvents = t ? 'none' : ''; });
    B_LAYER.forEach(function(el){ el.style.pointerEvents = t ? '' : 'none'; });
    R.pillBtn.setAttribute('aria-label', t ? 'Save' : 'Change co-maker');
    R.cta.disabled = !!t;
    if (anim) { anim.stop(); anim = null; }
    /* opening: the page's layout takes the open height at once (the card below is held in place by its transform,
       which now starts at −114 px), so the page can already scroll as far as the open card needs */
    if (t && slotH !== H1) { slotH = H1; R.slot.style.height = H1 + 'px'; apply(mv ? mv.get() : 0); }
    if (!mv || reduce) { if (mv) mv.set(t); else apply(t); settle(); if (t) follow(); return; }
    MOVING.forEach(function(el){ el.style.willChange = 'transform'; });
    anim = Mo.animate(mv, t, Object.assign({}, SPRING, { onComplete: settle }));
    if (t) follow();
  }
  /* on a short screen Save / Cancel would land under the bottom bar: the page scrolls with the morph, on the same
     spring, so they come to rest 16 px above it. A touch on the page stops it. */
  var scrollAnim = null;
  function follow(){
    var sc = R.scroll, bar = document.querySelector('.bot');
    var bottom = R.slot.getBoundingClientRect().top + H1 + 16;
    var limit = sc.getBoundingClientRect().bottom - (bar ? bar.offsetHeight : 0);
    var need = Math.min(bottom - limit, sc.scrollHeight - sc.clientHeight - sc.scrollTop);
    if (scrollAnim) { scrollAnim.stop(); scrollAnim = null; }
    if (need <= 0.5) return;
    var from = sc.scrollTop;
    if (reduce) { sc.scrollTop = from + need; return; }
    scrollAnim = Mo.animate(from, from + need, Object.assign({}, SPRING, { onUpdate: function(v){ sc.scrollTop = v; }, onComplete: function(){ scrollAnim = null; } }));
  }
  R.scroll.addEventListener('touchstart', function(){ if (scrollAnim) { scrollAnim.stop(); scrollAnim = null; } }, { passive: true });

  /* ---- actions ---- */
  function openForm(){
    R.inName.value = D.name;
    R.inMobile.value = '';
    R.inRel.value = D.rel; showRel();
    go(1);
  }
  function closeForm(save){
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    if (save) {
      var name = R.inName.value.trim() || D.name, digits = R.inMobile.value.replace(/\D/g, '');
      var phone = digits.length === 10 ? digits : D.phone;
      if (name !== D.name || phone !== D.phone) D.code = newCode();
      D.name = name; D.phone = phone; D.rel = R.inRel.value || '';
      R.aName.textContent = D.name;
      R.aPhone.textContent = '+63 ' + fmtPhone(D.phone);
      R.url.textContent = 'perasure.ph/g/' + D.code;
    }
    go(0);
  }
  function newCode(){
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    for (var i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)] + (i === 3 ? '-' : '');
    return s;
  }
  function showRel(){
    var v = R.inRel.value;
    R.relV.textContent = v || 'Select';
    R.relV.classList.toggle('t-placeholder', !v);
    R.relV.classList.toggle('t-primary', !!v);
  }

  R.pillBtn.addEventListener('click', function(){ if (target) closeForm(true); else openForm(); });
  R.cancel.addEventListener('click', function(){ closeForm(false); });
  R.inRel.addEventListener('change', showRel);
  R.inMobile.addEventListener('input', function(){
    var d = R.inMobile.value.replace(/\D/g, '').slice(0, 10), f = fmtPhone(d);
    if (R.inMobile.value !== f) R.inMobile.value = f;
  });
  R.inName.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); R.inMobile.focus(); } });
  R.inMobile.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); R.inMobile.blur(); } });

  /* Copy: the label swaps (withdraw's crossfade: leave 150 ms up, enter 300 ms from below) and the button resizes to it */
  var copyT = 0, copyBusy = false;
  function swapLabel(text){
    if (!Mo || reduce) { R.copyLbl.textContent = text; return; }
    var b = R.copy, w0 = b.getBoundingClientRect().width;
    Mo.animate(R.copyLbl, { opacity: 0, y: -MTY.text }, LEAVE).then(function(){
      R.copyLbl.textContent = text;
      b.style.width = ''; var w1 = b.getBoundingClientRect().width; b.style.width = w0 + 'px';
      Mo.animate(b, { width: w1 + 'px' }, { type: 'spring', visualDuration: 0.3, bounce: 0 });
      Mo.animate(R.copyLbl, { opacity: [0, 1], y: [MTY.text, 0] }, ENTER);
    });
  }
  R.copy.addEventListener('click', function(){
    var link = 'https://perasure.ph/g/' + D.code;
    try { if (navigator.clipboard) navigator.clipboard.writeText(link).catch(function(){}); } catch (e) {}
    clearTimeout(copyT);
    if (!copyBusy) { copyBusy = true; swapLabel('Copied'); }
    copyT = setTimeout(function(){ copyBusy = false; swapLabel('Copy'); }, 1800);
  });

  /* press: ~60 ms, no bounce (withdraw PRESS / PRESS_SCALE) */
  function pressable(el, s){
    if (!Mo || reduce) return;
    var down = function(){ Mo.animate(el, { scale: s }, PRESS); };
    var up = function(){ Mo.animate(el, { scale: 1 }, { duration: 0.12 }); };
    el.addEventListener('pointerdown', down);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(n){ el.addEventListener(n, up); });
  }
  pressable(R.pillBtn, PRESS_SCALE.pill); pressable(R.cancel, PRESS_SCALE.pill); pressable(R.cta, PRESS_SCALE.pill);
  pressable(R.copy, PRESS_SCALE.pill); pressable(R.home, PRESS_SCALE.pill); pressable(R.back, PRESS_SCALE.icon);

  /* keyboard: keep the focused field above it — the column gets a spacer as tall as the keyboard so the page can
     scroll that far, and the scroller moves the field into view (the page itself is never re-fitted while typing) */
  var vv = window.visualViewport;
  function keepVisible(){
    var a = document.activeElement;
    if (!a || a.tagName !== 'INPUT' || !vv) return;
    var kbTop = vv.offsetTop + vv.height, kb = Math.max(0, window.innerHeight - kbTop);
    R.kb.style.height = kb + 'px';
    var over = a.getBoundingClientRect().bottom + 24 - Math.min(kbTop, R.scroll.getBoundingClientRect().bottom - 148);
    if (over > 0) R.scroll.scrollBy({ top: over, behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('focusin', function(){ setTimeout(keepVisible, 320); });
  document.addEventListener('focusout', function(){ setTimeout(function(){ var a = document.activeElement; if (!a || a.tagName !== 'INPUT') R.kb.style.height = '0px'; }, 320); });
  if (vv) vv.addEventListener('resize', keepVisible);

  apply(0);
  /* for checks: window.__cm.set(k) draws any frame */
  window.__cm = { set: function(k){ if (anim) { anim.stop(); anim = null; } if (mv) mv.set(k); else apply(k); }, go: go, spring: SPRING, ts: TS };
})();
