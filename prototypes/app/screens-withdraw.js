/* PeraSure app — the home card and Withdraw: the Withdraw demo's own code (prototypes/withdraw-fund-flow), not a re-make.
   Owner's rule: everything the demo covers is the demo as it is on GitHub, apart from new features and the numbers. The home card, the
   screen that slides up, the amount entry, the morph into the order card and the order page's blocks (order details, borrower protection
   with its Protected / Add button, withdrawal method, the agreement and its nudge) are the demo's code, loaded as it ships
   (shared/ps-ui/withdraw-host.js). The app only gives it:
   · its width (nothing is scaled: the demo's type is the size of the app's pages) · the numbers (the app's credit and loan pricing) ·
   · the new feature, the coupons section (above the order details) and its Discount row · the withdrawal method chosen in the app ·
   · what the taps on the method card, "View payment schedule" and Confirm do.
   The amount and the term chosen there are the app's loan (APP.S.L), so coupons follow them. While the sheet moves (slides up, morphs) the
   loan is written to APP.S without telling the rest of the app, and the app is told once the motion has settled: a whole-app redraw at
   the start of the morph delayed its first frame (owner: "the amount entry → order page lags"). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, CS = window.CS, h = R.createElement;
  var CREDIT = CS.credit;
  function pesos(st) { var n = parseInt(st.amt || '5', 10); return (isNaN(n) ? 5 : n) * 100; }
  function find(list, id) { return id ? list.filter(function (c) { return c.id === id; })[0] || null : null; }
  /* tell the app about the loan once the sheet's motion has settled (its spring settles in ≈ 560 ms) */
  var tellT = 0;
  function tellLater() { clearTimeout(tellT); tellT = setTimeout(function () { APP.set({}); }, 620); }

  /* the sheet itself: drawn once and left alone (see withdraw-host.js → opt) */
  var Stable = R.memo(function Stable(p) {
    return h(p.K, Object.assign({ key: p.gen, ref: p.host.ref, host: p.host }, p.credit));
  });

  APP.WithdrawHost = function WithdrawHost() {
    var S = APP.use(), k = R.useState(null), K = k[0], box = R.useRef(null), gen = R.useState(0), idle = R.useRef(0);
    var host = R.useRef(null);
    if (!host.current) {
      host.current = { sheet: null, ref: function (s) { host.current.sheet = s; } };
      /* the most that can be borrowed: the available credit (long-term + temporary); a limit coupon raises it only on the order page,
         once it is ticked there (owner) */
      Object.defineProperty(host.current, 'max', { enumerable: true, get: function () {
        var L = APP.S.L, sh = host.current.sheet, lim = L && sh && sh.state.phase === 'confirm' ? find(APP.S.coupons, L.lim) : null;
        return CREDIT.available + (lim ? lim.add : 0);
      } });
    }
    var H = host.current;
    R.useEffect(function () {
      PS.loadWithdraw().then(function (C) { k[1](function () { return C; }); }).catch(function (e) { console.warn('[app] the Withdraw sheet could not load; the keypad page is used instead', e); });
    }, []);
    /* the demo is laid out as wide as the frame (no scaling) */
    R.useEffect(function () {
      function fit() { var f = box.current && box.current.parentNode; if (!f || H.width === f.clientWidth) return; H.width = f.clientWidth; if (H.sheet) H.sheet.forceUpdate(); }
      fit(); window.addEventListener('ps-viewport', fit); window.addEventListener('resize', fit);
      return function () { window.removeEventListener('ps-viewport', fit); window.removeEventListener('resize', fit); };
    }, [K]);
    /* the numbers on the demo's home card: the app's (a new sheet is made after an order, see reset). The temporary amount is what is
       left of it: the temporary credit is used first (owner) */
    var CARD = R.useMemo(function () {
      return { availableAmount: CREDIT.available, totalBalance: CREDIT.total, temporaryAmount: CREDIT.temporaryLeft, temporaryValidTill: String(CREDIT.temporaryUntil || '').replace(/,? ?\d{4}$/, '') };
    }, [gen[0]]);
    APP.wd = {
      sheet: function () { return H.sheet; },
      /* open(withId): the amount entry; a coupon asked for ("Use") is put on the loan once the amount and the term are chosen */
      open: function (withId) { var s = H.sheet; if (!s || !s.ready()) return false; s.open(); H.withId = withId || null; return true; },
      /* the demo's home card can be drawn (the home page then uses APP.WdHero) */
      heroReady: function () { return !!APP.S.wdReady; },
      setHero: function (el) { if (H.heroEl === el) return; H.heroEl = el; if (H.sheet) H.sheet.forceUpdate(); },
      /* a home page that leaves gives the card up only if a newer home page hasn't taken it (two exist while one fades over the other) */
      dropHero: function (el) { if (H.heroEl === el) APP.wd.setHero(null); },
      reset: function () { APP.set({ wd: 0 }); gen[1](function (g) { return g + 1; }); }     /* gone at once (behind Order submit) */
    };

    H.onState = function (next, prev, s) {
      if (next.fm && next.MT && !APP.S.wdReady) APP.set({ wdReady: true });               /* the demo's code is ready: home can show its card */
      if (next.screen !== prev.screen && next.screen === 'home') { APP.S.wd = 0; APP.S.L = null; tellLater(); }
      if (next.screen === 'loan' && prev.screen !== 'loan') {                         /* opened (APP.borrow, or the card's own Withdraw) */
        H.withId = null; APP.S.L = null; APP.S.lastRow = {}; APP.S.wd = APP.S.stack.length; tellLater();
      }
      if (next.phase === 'confirm' && prev.phase !== 'confirm') {                      /* a term was picked: this is the loan now */
        var amount = Math.min(pesos(next), CREDIT.available), l = APP.freshLoan(amount, next.term, null), c = H.withId && find(APP.S.coupons, H.withId);
        if (c) {                                                                        /* the coupon that was tapped, when it fits what was chosen */
          var why = CS.why(c, amount, next.term);
          if (why) setTimeout(function () { APP.say(why + '. See all to pick another.', 3200); }, 620); else if (c.kind === 'limit') l.lim = c.id; else l.disc = c.id;
        }
        H.withId = null; APP.S.L = l; APP.S.lastRow = {}; s._lastMax = null; tellLater();
      } else if (next.phase === 'confirm' && APP.S.L && !s.gliding() && (next.amt !== prev.amt || next.term !== prev.term)) {   /* (a glide is the app's own change) */
        var want = { amount: pesos(next), term: next.term };
        if (APP.S.L.amount === want.amount && APP.S.L.term === want.term) return;
        if (next.term !== prev.term) { APP.loanCheck(Object.assign({}, APP.S.L, want)); return; }
        APP.S.L = Object.assign({}, APP.S.L, want); s.refresh();                        /* the slider: the numbers follow at once… */
        clearTimeout(idle.current); idle.current = setTimeout(function () { if (APP.S.L) APP.loanCheck(Object.assign({}, APP.S.L)); }, 360);   /* …a coupon that no longer fits is asked about when it rests */
      } else if (next.phase === 'enter' && prev.phase === 'confirm') { APP.S.L = null; tellLater(); }
    };
    /* the order page: the demo's blocks, with the coupons section (new) first, and the app's numbers, date and method */
    function parts() { return APP.loanParts(APP.S); }
    H.blocks = function (s, blocks) { var c = parts().coupons; return c ? [h('div', { key: 'cpn', className: 'ps-wd-app' }, c)].concat(blocks) : blocks; };
    H.order = function () { var C = parts().C; return { daily: C.daily, per: C.per, total: C.total, save: C.save }; };
    H.extraRows = function (s, o) { return o.save ? [s.drow('Discount', '-' + s.money(o.save), 'var(--color-text-positive-heavy)', 'dsc'), s.hr('dsc1')] : []; };
    H.firstDate = function () { return CS.date(1); };
    H.methodName = function () { return APP.S.method.name; };
    H.methodSub = function () { return 'Ending in ' + APP.S.method.last4; };
    H.methodLogo = function () { return PS.asset('logos/pay-' + APP.S.method.id + '.png'); };
    H.onMethod = function () { APP.go('method'); };
    H.onSchedule = function () { APP.open('plan'); };
    H.onBenefits = function () { APP.say('Benefits aren’t part of the test app yet.'); };
    H.onConfirm = function () { APP.submitLoan(); };
    /* the slider's right end: with a limit coupon in use, the raised limit in green with the coupon tag, swapped (old out, new in) when it
       changes — the shared slider's boost state (coupon system) */
    H.maxLabel = function (s, text, style, extra) {
      var lim = APP.S.L && find(APP.S.coupons, APP.S.L.lim), boost = !!lim && s.state.phase === 'confirm';
      return h(PS.Swap, Object.assign({ k: text + (boost ? '+' : ''), y: PS.MT.Y.digit }, extra),
        h('span', { style: Object.assign({}, style, { display: 'inline-flex', alignItems: 'center', gap: 2 }, boost ? { color: 'var(--color-text-positive-heavy)' } : null) },
          boost ? h(PS.Icon, { name: 'coupon-tag', size: 14, color: 'positive' }) : null, text));
    };
    /* the app's loan → the sheet (a coupon was kept or taken off, which moved the amount or the term), and its blocks drawn again */
    R.useEffect(function () {
      var s = H.sheet; if (!s || s.state.screen !== 'loan' || s.state.phase !== 'confirm' || !S.L) return;
      if (S.L.term !== s.state.term) s.setState({ term: S.L.term });
      if (s.state.morph) { s.refresh(); return; }
      if (s._lastMax == null) s._lastMax = s.maxH() * 100;                              /* the order page has just opened: nothing to glide from */
      if (S.L.amount !== pesos(s.state) || s.maxH() * 100 !== s._lastMax) s.glide(S.L.amount); else s.refresh();   /* the knob, fill and amount glide */
    });
    var open = !!S.wd, under = open && S.stack.length > S.wd;      /* a page opened from the sheet (withdrawal method) shows in its place */
    return h(R.Fragment, null,
      h('div', { ref: box, className: 'app-wd ps-wd', style: { visibility: under ? 'hidden' : 'visible' } },
        K ? h(Stable, { K: K, gen: gen[0], host: H, credit: CARD }) : null),
      open && !under ? h('div', { className: 'app-wd__tune' }, APP.tune()) : null);
  };
  /* WdHero: the home page's credit card — the demo's own card (the one its motion works on), drawn by the sheet into this element */
  APP.WdHero = function WdHero(p) {
    var ref = R.useRef(null), cb = R.useRef(p); cb.current = p;
    R.useLayoutEffect(function () {
      var el = ref.current; APP.wd.setHero(el);
      /* the card is drawn here by the sheet through a portal, so React's events go to the sheet, not to this element: a DOM listener */
      function click(e) { var info = el.querySelector('img[src*="icon-info-circle"]'); if (info && cb.current.onInfo && info.parentNode.contains(e.target)) cb.current.onInfo(info.parentNode); }
      el.addEventListener('click', click);
      return function () { el.removeEventListener('click', click); APP.wd.dropHero(el); };
    }, []);
    return h('div', { ref: ref, className: 'app-wdhero ps-wd' });
  };

  /* borrow: every way into ordering starts at the amount entry (owner) — the home card, the credit limit hub, a coupon's "Use", "Go to borrow" */
  APP.borrow = function (withId) {
    if (APP.wd && APP.wd.open(withId)) return;
    if (withId) APP.openLoan(withId); else APP.go('amount', null, 'rise');            /* the sheet could not load */
  };
})();
