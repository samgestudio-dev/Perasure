/* SMS landing page — a standalone page in React, its interaction in Framer Motion (vendor/motion@14.4.0 = Motion for React, the successor
   of Framer Motion: drag, motion values, springs). The looks are shared pieces: landing.js (nav, hero, sections, calculator, steps, Play button,
   sticky bar, plan sheet) and the app's AmountCard, TrustCard and Legal.
   Copy: perasure-tone-of-voice (campaign landing page). Numbers: PS.LANDING_LOAN (owner, 2026-11-25): ₱500–₱90,000, 4 / 6 / 8 terms of 15 days,
   3 % interest + 0.75 % service fee per term (0.25 % a day) — the hero's fee and amount are worked out from it.

   How the page moves (owner):
   · The hero is one screen. Dragging it is a Framer Motion drag: it follows the finger as a GPU transform, and the page after it (the
     calculator first) moves with it, joined to its foot — the turn looks like one page scrolling (owner: as before). On release it springs on
     to the calculator or back to the hero, the way the finger last went — no threshold.
   · Once the hero is away, the calculator, the trust card, How it works and the closing band scroll natively, from the calculator at the top.
   · Pulled down while that page is at its top, the hero comes back over it, following the finger; on release, the same rule.
   · A flick up from further down stops at the calculator by itself (the top); if it was going fast enough to have run on more than half a
     screen, the hero springs back down instead (where it would have come to rest decides).
   · Wheel / arrow and page keys / "See what you'd pay" do the same on a desktop. The spring: the Smooth spring stretched for a screen's travel
     (PS.MT.stretch, capped 1.5), the finger's speed carried in. */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, PS = window.PS, h = R.createElement, m = M.m;
  var L = PS.LANDING_LOAN;

  /* the PeraSure listing on Google Play (owner, 2026-11-25). ?play=<url> overrides it for testing. The referrer says the visit came from the SMS. */
  var q = new URLSearchParams(location.search);
  var PLAY = q.get('play') || 'https://play.google.com/store/apps/details?id=com.perasure.loan&referrer=utm_source%3Dsms%26utm_medium%3Dlanding';

  var COPY = {
    hero: {
      kicker: 'An invite from PeraSure',
      title: h(R.Fragment, null, 'Fast, clear,', h('br'), 'credit when life can’t wait.'),
      stats: [{ value: +(PS.loanQuote(L.amount, L.term).rate * 100).toFixed(2) + '%', label: 'Daily fee' },
        { value: '180 days', label: 'Term, up to' },   /* owner's figure, kept on purpose (2026-11-25), though 4 / 6 / 8 terms of 15 days reach 120 days */
        { value: PS.money(L.max, 0), label: 'Borrow up to' }],
      more: 'See what you’d pay',
      note: 'Borrowing costs money. Your final offer depends on our review.'
    },
    steps: [
      { title: 'Get the app', text: 'Download PeraSure from Google Play and log in with your mobile number.' },
      { title: 'Check your limit', text: 'Answer a few questions and add your ID. We’ll review them and show you your credit limit.' },
      { title: 'Get your money', text: 'Choose an amount and a plan, and we’ll send it to your wallet or bank.' }
    ]
  };

  function track(where) { try { (window.dataLayer = window.dataLayer || []).push({ event: 'play_click', where: where }); } catch (e) {} }
  function play(where, label) { return h(PS.PlayButton, { href: PLAY, block: true, label: label, onClick: function () { track(where); } }); }

  /* in view: true while el is on screen (the sticky bar hides while one of the page's own Play buttons, the calculator or the trust card shows) */
  function useInView(ref) {
    var s = R.useState(true);
    R.useEffect(function () {
      if (!ref.current || !window.IntersectionObserver) return;
      var io = new IntersectionObserver(function (e) { s[1](e[0].isIntersecting); }, { rootMargin: '0px 0px -40px 0px' });
      io.observe(ref.current); return function () { io.disconnect(); };
    }, []);
    return s[0];
  }

  /* the screen's height in layout px (the hero's travel), kept up to date */
  function useScreenH() {
    var s = R.useState(window.innerHeight);
    R.useEffect(function () {
      function on() { s[1](window.innerHeight); }
      window.addEventListener('resize', on); return function () { window.removeEventListener('resize', on); };
    }, []);
    return s[0];
  }

  /* useHero: the hero layer's position (a motion value: 0 = over the page, -H = up out of the way) and everything that moves it */
  function useHero(H) {
    var y = M.useMotionValue(0), open = R.useState(true), run = R.useRef(null), Hr = R.useRef(H), quiet = R.useRef(0);
    Hr.current = H;
    function sheetOpen() { return !!document.querySelector('.ps-llayer .ps-layer'); }
    function to(show, v) {   /* spring the hero over the page (show) or up out of the way, the finger's speed carried in */
      if (run.current) run.current.stop();
      var target = show ? 0 : -Hr.current, sp = PS.MT.stretch(Hr.current, null, 1.5);
      open[1](show);
      if (show) window.scrollTo(0, 0);
      run.current = PS.reduce ? (y.set(target), null) : M.animate(y, target, { type: 'spring', stiffness: sp.stiffness, damping: sp.damping, mass: sp.mass, velocity: v || 0, restDelta: 0.5, restSpeed: 5 });
    }
    /* the page under the hero doesn't scroll while the hero covers it */
    R.useEffect(function () {
      var root = document.documentElement;
      if (open[0]) { root.style.overflow = 'hidden'; window.scrollTo(0, 0); } else if (!sheetOpen()) root.style.overflow = '';
    }, [open[0]]);
    /* keep the hero out of the way at the right distance when the screen height changes */
    R.useEffect(function () { if (!open[0] && !run.current) y.set(-H); }, [H]);

    R.useEffect(function () {
      var t = null, lastY = window.scrollY, lastT = performance.now(), v = 0;
      /* pull the hero back down: a drag down while the page is at its top follows the finger */
      function tstart(e) {
        if (open[0] || sheetOpen() || e.touches.length !== 1 || window.scrollY > 0.5) { t = null; return; }
        if (e.target.closest && e.target.closest('.ps-slider')) { t = null; return; }
        t = { y: e.touches[0].clientY, x: e.touches[0].clientX, pulling: false, ly: e.touches[0].clientY, lt: e.timeStamp, v: 0, d: 0 };
      }
      function tmove(e) {
        if (!t) return;
        var fy = e.touches[0].clientY, dy = fy - t.y, dx = e.touches[0].clientX - t.x;
        if (!t.pulling) {
          if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;                          /* a tap's jitter is not a move */
          if (Math.abs(dx) > Math.abs(dy) || dy < 0 || window.scrollY > 0.5) { t = null; return; }   /* sideways, or up: the page scrolls */
          t.pulling = true; t.y = fy; if (run.current) run.current.stop();
        }
        if (e.cancelable) e.preventDefault();
        var dt = Math.max(8, e.timeStamp - t.lt), step = fy - t.ly;
        if (Math.abs(step) >= 1) t.d = step > 0 ? 1 : -1;
        t.v = 0.7 * (step / dt * 1000) + 0.3 * t.v; t.ly = fy; t.lt = e.timeStamp;
        y.set(Math.min(0, -Hr.current + Math.max(0, fy - t.y)));
      }
      function tend() {
        var g = t; t = null;
        if (!g || !g.pulling) return;
        to(g.d > 0, g.v);   /* the way the finger last went */
      }
      /* a flick up that reaches the top: it stops on the calculator, unless it would have run on more than half a screen — then the hero */
      function scroll() {
        var now = performance.now(), sy = window.scrollY, dt = Math.max(1, now - lastT);
        v = 0.6 * ((sy - lastY) / dt) + 0.4 * v; lastY = sy; lastT = now;   /* px per ms, + = down */
        if (!open[0] && !t && sy <= 0.5 && v < 0 && !sheetOpen()) {
          var runOn = -v * 1000 * 0.33;   /* how far the momentum would still have carried it (a phone's ~0.33 s decay) */
          if (runOn > Hr.current / 2) to(true, -v * 1000);
          v = 0;
        }
      }
      function wheel(e) {
        if (sheetOpen() || Math.abs(e.deltaY) < 1 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        var now = performance.now(), down = e.deltaY > 0;
        if (now < quiet.current) { if (open[0] || (window.scrollY <= 0.5 && !down)) { e.preventDefault(); quiet.current = now + 250; } return; }   /* a trackpad's tail doesn't turn twice */
        if (open[0] && down) { e.preventDefault(); quiet.current = now + 250; to(false); }
        else if (open[0]) e.preventDefault();
        else if (!down && window.scrollY <= 0.5) { e.preventDefault(); quiet.current = now + 250; to(true); }
      }
      function key(e) {
        if (sheetOpen() || (e.target && e.target.closest && e.target.closest('input, textarea, select, button, a, [role="slider"], [role="radio"], [role="tab"]'))) return;
        var down = /^(ArrowDown|PageDown| )$/.test(e.key), up = /^(ArrowUp|PageUp|Home)$/.test(e.key);
        if (open[0] && down) { e.preventDefault(); to(false); }
        else if (!open[0] && up && window.scrollY <= 0.5) { e.preventDefault(); to(true); }
      }
      window.addEventListener('touchstart', tstart, { passive: true });
      window.addEventListener('touchmove', tmove, { passive: false });
      window.addEventListener('touchend', tend, { passive: true });
      window.addEventListener('touchcancel', tend, { passive: true });
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('wheel', wheel, { passive: false });
      window.addEventListener('keydown', key);
      return function () {
        window.removeEventListener('touchstart', tstart); window.removeEventListener('touchmove', tmove); window.removeEventListener('touchend', tend);
        window.removeEventListener('touchcancel', tend); window.removeEventListener('scroll', scroll); window.removeEventListener('wheel', wheel);
        window.removeEventListener('keydown', key);
      };
    }, [open[0]]);

    /* the hero's own drag (Framer Motion): it follows the finger up; on release it goes the way the finger last went */
    var drag = {
      drag: 'y', dragConstraints: { top: -H, bottom: 0 }, dragElastic: { top: 0, bottom: 0.06 }, dragMomentum: false, dragDirectionLock: true,
      onDragStart: function () { if (run.current) run.current.stop(); },
      onDragEnd: function (e, info) {
        var vy = info.velocity.y, up = Math.abs(vy) > 40 ? vy < 0 : info.offset.y < 0;   /* no threshold: any move up shows the calculator */
        to(!up, vy);
      }
    };
    return { y: y, open: open[0], to: to, drag: drag };
  }

  function Page() {
    var est = R.useState({ amount: L.amount, term: L.term }), e = est[0], plan = R.useState(false);
    /* the turn's travel: a screen less the top bar (as the scrolling page before: the hero's foot ends under the bar, the calculator just below it) */
    var T = useScreenH() - PS.px(56), hero = useHero(T), Tref = R.useRef(T); Tref.current = T;
    /* the page after the hero moves with it, joined to its foot (one page scrolling): T below while the hero covers the screen, 0 once it's away */
    var contentY = M.useTransform(hero.y, function (v) { return v + Tref.current; });
    var navSolid = R.useState(false);
    M.useMotionValueEvent(hero.y, 'change', function (v) { var s = v < -PS.px(120); if (s !== navSolid[0]) navSolid[1](s); });   /* the bar turns navy once the hero has moved off it */
    var calc = R.useRef(null), trust = R.useRef(null), endCta = R.useRef(null);
    var b = useInView(calc), t = useInView(trust), c = useInView(endCta);

    return h(M.LazyMotion, { features: M.domMax, strict: true }, h(M.MotionConfig, { reducedMotion: 'user' },
      h('div', { className: 'ps-landing__page' },
        h(PS.LandingNav, { href: PLAY, solid: navSolid[0], onCta: function () { track('nav'); } }),

        /* the page under the hero: the calculator at its top */
        h(m.main, { className: 'lp-content', style: { y: contentY }, 'aria-hidden': hero.open || undefined },
          h(PS.LandingSection, { id: 'calc', kicker: 'Loan calculator', title: 'See what you’d pay' },
            h('div', { ref: calc }, h(PS.LoanCalculator, { amount: e.amount, term: e.term,
              onAmount: function (v) { est[1]({ amount: v, term: e.term }); }, onTerm: function (tm) { est[1]({ amount: e.amount, term: tm }); },
              onSchedule: function () { plan[1](true); }, action: play('calculator', 'Apply in the app'),
              note: 'These are examples only. Approval and your final loan details depend on our review.' }))),
          /* the trust card, as on the app's home before a limit */
          h('div', { className: 'lp-trust' }, h('div', { ref: trust }, h(PS.TrustCard, null))),
          h(PS.LandingSection, { id: 'steps', tone: 'white', kicker: 'How it works', title: 'Three steps to your money' }, h(PS.Steps, { items: COPY.steps })),
          h(PS.LandingSection, { tone: 'navy', align: 'center', glow: false, title: 'Ready when you are', body: 'Get the app, see your limit, then decide if you want to borrow.' },
            h('div', { ref: endCta }, play('end')),
            h('footer', { className: 'lp-legal' }, h(PS.Legal, { tone: 'inverse' })))),

        /* the hero: a full-screen layer over it, dragged with Framer Motion */
        h(m.div, Object.assign({ className: 'lp-hero', style: { y: hero.y }, 'aria-hidden': !hero.open || undefined }, hero.drag),
          h(PS.LandingHero, Object.assign({}, COPY.hero, { image: 'img/hero.jpg', imageAlt: 'A woman at work smiling at her phone',
            action: play('hero'), more: { label: COPY.hero.more, onClick: function () { hero.to(false); } } }))),

        h(PS.LoanPlanSheet, { open: plan[0], onClose: function () { plan[1](false); }, amount: e.amount, term: e.term }),
        h(PS.StickyCta, { show: !hero.open && !b && !t && !c }, play('sticky')))));
  }

  window.ReactDOM.createRoot(document.getElementById('root')).render(h(Page));
})();
