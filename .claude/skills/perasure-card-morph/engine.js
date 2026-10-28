/* PeraSure card morph engine — window.PSMorph (plain script, no build step).
   Needs Motion's vanilla build first: <script src="…/vendor/motion@14.4.0/motion.js"></script> (window.Motion).
   Extracted from prototypes/co-maker-change/co-maker.js; the rules behind every number are in SKILL.md.

   const m = PSMorph.create({
     travel: 202,                 // px — the longest distance anything travels in the morph (sets the rest thresholds)
     feel: 'Smooth',              // 'Smooth' | 'Snappy' | 'Gentle' (withdraw's feels) or { stiffness, damping, mass }
     promote: [card, …],          // moved by transform / size: will-change: transform during the morph
     blurred: [title, row, …],    // anything that blurs: own layer + a blur() filter for the WHOLE morph (iOS hairline fix)
     apply(f) { … },              // one frame: write every style from f.k (see "frame helpers" below)
     rows: [ { at: 0.42, items: [ { el, y: 8, a: 0.26, b: 0.68 } ] }, … ],   // secondary content on a clock (optional)
     onStart(t) {}, onSettle(t) {}
   });
   m.go(1) / m.go(0)   — open / close (a call mid-morph re-targets: the spring carries its velocity into the reversal)
   m.set(k)            — draw any frame (for frame-by-frame checks), m.spring, m.target(), m.k()
   PSMorph.firstK(test), PSMorph.scrollTo(scroller, top, m.spring), PSMorph.pressable(el, scale), PSMorph.MT (constants)

   frame helpers handed to apply(f):
     f.k  progress (may overshoot a hair)   f.c  k clamped to 0–1 (use for geometry)
     f.win(a, b)    smoothstep window of k: 0 before a, 1 after b — the same function both ways
     f.front(t)     1 − (1 − t)²: a front-loaded path for things that must land early (cross other content)
     f.lerp(a, b, t), f.r3(v)
     f.put(el, prop, val)        write a style only if it changed
     f.show(el, o)               opacity + visibility (hidden at 0: no paint, no taps)
     f.blur(el, px)              filter blur (kept as blur() — 0 px included — while the morph runs; none at rest)
     f.out(el, a, b, y)          leaving: fades over window a–b, rises y px, blurs 0 → 3 px
     f.inn(el, a, b, y, base)    coming in: fades in over a–b, rises from +y into place (+ base px), 3 px → sharp */
(function(){
  'use strict';
  var FEEL = {
    Smooth: { stiffness: 240, damping: 30, mass: 1 },
    Snappy: { stiffness: 430, damping: 34, mass: 0.8 },
    Gentle: { stiffness: 140, damping: 24, mass: 1.15 }
  };
  var EASE_IN = [0.22, 0.61, 0.36, 1];
  var MT = {
    FEEL: FEEL, EASE_IN: EASE_IN,
    Y: { text: 8, block: 10, digit: 6 },                       /* travel distance by element size */
    ENTER: { duration: 0.30, delay: 0.07, ease: EASE_IN }, LEAVE: { duration: 0.15, ease: [0.4, 0, 1, 1] },
    PRESS: { duration: 0.06 }, PRESS_SCALE: { pill: 0.985, icon: 0.92 },
    REVEAL: 0.34,                                              /* secondary content entrance, s */
    BLUR: 3,                                                   /* px — the crossfade bridge */
    REF_TRAVEL: 378,                                           /* withdraw loan morph travel at design size, px */
    REST_PX: 0.378, REST_PXS: 3.78                             /* its rest thresholds: 0.001 / 0.01 of that travel */
  };
  var r3 = function(v){ return Math.round(v * 1000) / 1000; };
  var lerp = function(a, b, t){ return a + (b - a) * t; };
  var winAt = function(k, a, b){ var t = Math.max(0, Math.min(1, (k - a) / (b - a))); return t * t * (3 - 2 * t); };
  var front = function(t){ return 1 - (1 - t) * (1 - t); };
  var reduced = function(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };

  /* same spring as withdraw; never sped up for a short travel (that read as rushed). A travel longer than withdraw's is
     stretched in time by the ratio (stiffness ÷ s², damping ÷ s: same curve, same speed), at most 2.5×. */
  function springFor(feel, travel, slow){
    var F = typeof feel === 'object' && feel ? feel : (FEEL[feel] || FEEL.Smooth);
    var s = Math.min(2.5, Math.max(1, (travel || MT.REF_TRAVEL) / MT.REF_TRAVEL)) * (slow || 1);
    var d = travel || MT.REF_TRAVEL;
    return { type: 'spring', stiffness: F.stiffness / (s * s), damping: F.damping / s, mass: F.mass || 1,
             restDelta: MT.REST_PX / d, restSpeed: MT.REST_PXS / d / s };
  }

  function create(o){
    var Mo = window.Motion, slow = o.slow || +((/[?&]slow=([\d.]+)/.exec(location.search) || [])[1]) || 1;
    var spring = springFor(o.feel, o.travel, slow), reduce = reduced();
    var last = new Map(), running = false, still = true, target = 0, cur = 0, anim = null;
    var promote = o.promote || [], blurred = (o.blurred || []).slice();
    var rows = (o.rows || []).map(function(g){ g.items.forEach(function(it){ if (blurred.indexOf(it.el) < 0) blurred.push(it.el); });
      return { at: g.at, items: g.items, r: 0, on: false, anim: null }; });

    function put(el, prop, val){
      if (!el) return;
      var m = last.get(el); if (!m) { m = {}; last.set(el, m); }
      if (m[prop] === val) return;
      m[prop] = val; el.style[prop] = val;
    }
    function show(el, v){ put(el, 'visibility', v > 0.001 ? 'visible' : 'hidden'); put(el, 'opacity', String(r3(v))); }
    function blur(el, px){ put(el, 'filter', running || !still ? 'blur(' + r3(Math.max(0, px)) + 'px)' : 'none'); }
    function helpers(k){
      var f = { k: k, c: Math.max(0, Math.min(1, k)), lerp: lerp, r3: r3, front: front, put: put, show: show, blur: blur, MT: MT };
      f.win = function(a, b){ return winAt(k, a, b); };
      f.out = function(el, a, b, y){ var e = f.win(a, b); show(el, 1 - e); blur(el, MT.BLUR * e); put(el, 'transform', 'translateY(' + r3(-y * e) + 'px)'); };
      f.inn = function(el, a, b, y, base){ var e = f.win(a, b); show(el, e); blur(el, MT.BLUR * (1 - e)); put(el, 'transform', 'translateY(' + r3((base || 0) + y * (1 - e)) + 'px)'); };
      return f;
    }
    /* rows: each plays the same clocked entrance once k passes its `at`; closing, each leaves on its window of k.
       What shows is the smaller of the two, so a reversal at any moment carries on from what is on screen. */
    function rowE(g, it, tgt){ return Math.min(g.r, tgt ? 1 : winAt(cur, it.a, it.b)); }
    function drawRows(){
      rows.forEach(function(g){ g.items.forEach(function(it){
        var e = rowE(g, it, target);
        show(it.el, e); blur(it.el, MT.BLUR * (1 - e)); put(it.el, 'transform', 'translateY(' + r3((it.y || 0) * (1 - e)) + 'px)');
      }); });
    }
    function reveal(g){
      if (g.anim) g.anim.stop();
      if (!Mo || reduce) { g.r = 1; return; }
      g.anim = Mo.animate(g.r, 1, { duration: MT.REVEAL * slow * (1 - g.r), ease: EASE_IN,
        onUpdate: function(v){ g.r = v; drawRows(); },
        onComplete: function(){ g.anim = null; g.r = 1; drawRows(); finish(); } });
    }
    function frame(k){
      cur = k;
      o.apply(helpers(k));
      if (running && target === 1) rows.forEach(function(g){ if (!g.on && k >= g.at) { g.on = true; reveal(g); } });
      drawRows();
    }
    var mv = Mo && Mo.motionValue ? Mo.motionValue(0) : null;
    if (mv) mv.on('change', frame);
    function finish(){ if (!anim && !rows.some(function(g){ return g.anim; }) && running) settle(); }
    function settle(){
      anim = null;
      rows.forEach(function(g){ if (g.anim) { g.anim.stop(); g.anim = null; } g.r = target ? 1 : 0; g.on = !!target; });
      running = false; still = true;
      if (o.onSettle) o.onSettle(target);                      /* commit layout first (e.g. the slot height) … */
      frame(target);                                           /* … then the rest frame is drawn against it */
      promote.concat(blurred).forEach(function(el){ if (el) el.style.willChange = ''; });
    }
    function go(t){
      target = t ? 1 : 0;
      rows.forEach(function(g){
        if (g.anim) { g.anim.stop(); g.anim = null; }
        if (target) { g.r = rowE(g, g.items[g.items.length - 1], 0); g.on = false; }
      });
      if (anim) { anim.stop(); anim = null; }
      if (o.onStart) o.onStart(target);
      if (!mv || reduce) { if (mv) mv.set(target); else frame(target); running = true; settle(); return; }
      promote.forEach(function(el){ if (el) el.style.willChange = 'transform'; });
      blurred.forEach(function(el){ if (el) el.style.willChange = 'transform, opacity, filter'; });
      running = true; frame(mv.get());
      anim = Mo.animate(mv, target, Object.assign({}, spring, { onComplete: function(){ anim = null; finish(); } }));
    }
    frame(0);
    return {
      go: go, spring: spring, MT: MT,
      target: function(){ return target; }, k: function(){ return cur; },
      set: function(k){ if (anim) { anim.stop(); anim = null; } still = k === 0 || k === 1; if (mv) mv.set(k); else frame(k); }
    };
  }

  /* press: ~60 ms down, no bounce (withdraw PRESS / PRESS_SCALE). Use on an element whose transform nothing else writes. */
  function pressable(el, s){
    var Mo = window.Motion; if (!Mo || !el || reduced()) return;
    el.addEventListener('pointerdown', function(){ Mo.animate(el, { scale: s || MT.PRESS_SCALE.pill }, MT.PRESS); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function(n){ el.addEventListener(n, function(){ Mo.animate(el, { scale: 1 }, { duration: 0.12 }); }); });
  }
  /* scroll a container on the same spring (e.g. bring an open card's buttons above the bottom bar); a touch stops it */
  function scrollTo(sc, top, spring){
    var Mo = window.Motion, from = sc.scrollTop; top = Math.max(0, Math.min(top, sc.scrollHeight - sc.clientHeight));
    if (!Mo || reduced() || Math.abs(top - from) < 0.5) { sc.scrollTop = top; return null; }
    var a = Mo.animate(from, top, Object.assign({}, spring || springFor('Smooth'), { restDelta: MT.REST_PX, restSpeed: MT.REST_PXS,
      onUpdate: function(v){ sc.scrollTop = v; } }));
    sc.addEventListener('touchstart', function(){ a.stop(); }, { passive: true, once: true });
    return a;
  }

  /* the first k (0–1, step 0.005) where test(k) holds — e.g. when may a row appear without a rider crossing it:
     PSMorph.firstK(k => riderTop(k) >= rowBottom + 4). Round up to 0.01 and use it as the row's `at`. */
  function firstK(test){ for (var i = 0; i <= 200; i++) { var k = i / 200; if (test(k)) return Math.ceil(k * 100) / 100; } return 1; }

  window.PSMorph = { create: create, springFor: springFor, pressable: pressable, scrollTo: scrollTo, firstK: firstK, MT: MT, win: winAt, front: front };
})();
