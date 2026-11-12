/* PeraSure app — Withdraw on the home card: the Withdraw demo's own loan screen (prototypes/withdraw-fund-flow), not a re-make.
   Owner's rule: existing animations are never re-imagined. The screen that slides up, the amount entry and the morph into the order
   card are the demo's code, loaded as it ships (shared/ps-ui/withdraw-host.js). The app only gives it:
   · the limit (what can be borrowed, with the best limit coupon), · the blocks under the order card (coupons, order details,
   protection, withdrawal method, agreement — the app's own, entering the way the demo's blocks do), · what Confirm does (the code,
   then Order submit). The amount and the term chosen there are the app's loan (APP.S.L), so coupons follow them. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, CS = window.CS, h = R.createElement;
  var CREDIT = CS.credit;
  function pesos(st) { var n = parseInt(st.amt || '5', 10); return (isNaN(n) ? 5 : n) * 100; }

  /* the sheet itself: drawn once and left alone (see withdraw-host.js → opt) */
  var Stable = R.memo(function Stable(p) {
    return h(p.K, { key: p.gen, ref: p.host.ref, scale: p.scale, host: p.host });
  });

  APP.WithdrawHost = function WithdrawHost() {
    var S = APP.use(), k = R.useState(null), K = k[0], box = R.useRef(null), sc = R.useState(1), gen = R.useState(0), idle = R.useRef(0);
    var host = R.useRef(null); if (!host.current) host.current = { sheet: null, nudge: 0, ref: function (s) { host.current.sheet = s; } };
    var H = host.current;
    R.useEffect(function () {
      PS.loadWithdraw().then(function (C) { k[1](function () { return C; }); }).catch(function (e) { console.warn('[app] the Withdraw sheet could not load; the keypad page is used instead', e); });
    }, []);
    /* the demo is 360 wide: scale it to the frame */
    R.useEffect(function () {
      function fit() { var f = box.current && box.current.parentNode; if (f) sc[1](Math.round(f.clientWidth / 360 * 10000) / 10000); }
      fit(); window.addEventListener('ps-viewport', fit); window.addEventListener('resize', fit);
      return function () { window.removeEventListener('ps-viewport', fit); window.removeEventListener('resize', fit); };
    }, [K]);
    APP.wd = {
      sheet: function () { return H.sheet; },
      /* open(withId): the amount entry; a coupon asked for ("Use") is put on the loan once the amount and the term are chosen */
      open: function (withId) { var s = H.sheet; if (!s || !s.ready()) return false; H.withId = withId || null; APP.set({ L: null, lastRow: {}, wd: APP.S.stack.length }); s.open(); return true; },
      reset: function () { APP.set({ wd: 0 }); gen[1](function (g) { return g + 1; }); }     /* gone at once (behind Order submit) */
    };
    /* the most that can be borrowed: before a term is picked, with the biggest limit coupon; after, with the one in use */
    var lims = S.coupons.filter(function (c) { return c.kind === 'limit'; }), inUse = S.L && lims.filter(function (c) { return c.id === S.L.lim; })[0];
    H.max = S.L ? CREDIT.available + (inUse ? inUse.add : 0) : CREDIT.available + lims.reduce(function (a, c) { return Math.max(a, c.add); }, 0);
    H.onState = function (next, prev) {
      if (next.screen !== prev.screen && next.screen === 'home') APP.set({ wd: 0 });
      if (next.phase === 'confirm' && prev.phase !== 'confirm') {                      /* a term was picked: this is the loan now */
        var amount = Math.min(pesos(next), H.max), l = APP.freshLoan(amount, next.term, null), c = H.withId && S.coupons.filter(function (x) { return x.id === H.withId; })[0];
        if (c) {                                                                        /* the coupon that was tapped, when it fits what was chosen */
          var why = CS.why(c, amount, next.term);
          if (why) APP.say(why + '. See all to pick another.', 3200); else if (c.kind === 'limit') l.lim = c.id; else l.disc = c.id;
        }
        H.withId = null; APP.set({ L: l, lastRow: {} });
      } else if (next.phase === 'confirm' && APP.S.L && (next.amt !== prev.amt || next.term !== prev.term)) {
        var want = { amount: pesos(next), term: next.term };
        if (APP.S.L.amount === want.amount && APP.S.L.term === want.term) return;
        if (next.term !== prev.term) { APP.loanCheck(Object.assign({}, APP.S.L, want)); return; }
        APP.set({ L: Object.assign({}, APP.S.L, want) });                              /* the slider: numbers follow at once… */
        clearTimeout(idle.current); idle.current = setTimeout(function () { if (APP.S.L) APP.loanCheck(Object.assign({}, APP.S.L)); }, 360);   /* …a coupon that no longer fits is asked about when it rests */
      } else if (next.phase === 'enter' && prev.phase === 'confirm') APP.set({ L: null });
    };
    H.blocks = function (s) { return APP.loanParts(APP.S, !!s.state.agree, function () { s.setState({ agree: !s.state.agree }); }, H.nudge).blocks; };
    H.onConfirm = function () { APP.submitLoan(); };
    H.onNudge = function (s) { H.nudge += 1; s.refresh(); };
    /* the app's loan → the sheet (a coupon was kept or taken off, which moved the amount or the term), and its blocks drawn again */
    R.useEffect(function () {
      var s = H.sheet; if (!s || s.state.screen !== 'loan' || s.state.phase !== 'confirm' || !S.L) return;
      if (S.L.amount !== pesos(s.state) || S.L.term !== s.state.term) s.setState({ amt: String(Math.round(S.L.amount / 100)), term: S.L.term });
      s.refresh();
    });
    var open = !!S.wd, under = open && S.stack.length > S.wd;      /* a page opened from the sheet (withdrawal method) shows in its place */
    return h(R.Fragment, null,
      h('div', { ref: box, className: 'app-wd', style: { transform: 'scale(' + sc[0] + ')', visibility: under ? 'hidden' : 'visible' } },
        K ? h(Stable, { K: K, gen: gen[0], scale: sc[0], host: H }) : null),
      open && !under ? h('div', { className: 'app-wd__tune' }, APP.tune()) : null);
  };
  /* borrow: every way into ordering starts at the amount entry (owner) — the home card, the credit limit hub, a coupon's "Use", "Go to borrow" */
  APP.borrow = function (withId) {
    if (APP.wd && APP.wd.open(withId)) return;
    if (withId) APP.openLoan(withId); else APP.go('amount', null, 'rise');            /* the sheet could not load */
  };
})();
