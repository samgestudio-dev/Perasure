/* PeraSure UI — the motion pieces of the earlier demos as shared components (the demo pages themselves stay as they are):
   OrderSubmit (prototypes/order-submit) · OtpSheet (prototypes/otp-sheet-morph) · CreditLimitIntro (prototypes/credit-limit-coins,
   hosted as it ships) · the Loading page is PS.Loader (feedback.js). Needs core.js, layout.js, feedback.js, form.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* ---- OrderSubmit: the loan request being sent — exactly the Order submit demo (prototypes/order-submit), same numbers and rules:
     · three lines take turns; each letter rises in (560 ms, 16 ms apart, 12 px, 5 px blur, four keyframes) and rises out the same way
       (400 ms, 10 px) — letter by letter both ways;
     · line 1 holds 1500 ms; line 2 ("…" as three dots that keep counting) holds for the request, 3000 ms; 120 ms between lines;
     · the coin starts changing to the tick halfway through the last line's entrance, but only at the end of its turn (no deadline);
     · it is over — onDone — only when the last line has come in and held 1500 ms AND the tick has finished playing. Never earlier:
       the page that follows (home) waits for the animation.
     lines (three texts) · holdMs (1500) · submitMs (3000) · onDone. Fills its box (use inside PS.Overlay). */
  var IN = 'cubic-bezier(0.34, 0.02, 0.2, 1)', OUT = 'cubic-bezier(0.4, 0.05, 0.6, 0.4)', IN_MS = 560, OUT_MS = 400, STAGGER = 16, GAP = 120, RISE = 12, EXIT = 10, BLUR = 5;
  PS.OrderSubmit = function OrderSubmit(p) {
    var lines = p.lines || ['Submitting your loan request…', 'Confirming your loan details…', 'Your loan request has been submitted.'];
    var s = R.useState(0), step = s[0], ok = R.useState(false), ref = R.useRef(null), done = R.useRef(p.onDone), fin = R.useRef({ text: false, coin: false, sent: false });
    done.current = p.onDone;
    function text(i) { return i === 1 ? lines[1].replace(/(…|\.\.\.)$/, '...') : lines[i]; }
    function tail(i) { return STAGGER * Math.max(0, text(i).replace(/ /g, '').length - 1); }
    function finish() { var f = fin.current; if (f.text && f.coin && !f.sent) { f.sent = true; if (done.current) done.current(); } }
    function letters() { return ref.current ? [].slice.call(ref.current.querySelectorAll('[data-i]')) : []; }
    function animate(dir) {
      var els = letters(); if (!els.length || PS.reduce || !els[0].animate) return;
      var starts = dir === 'out' ? els.map(function (el) { return parseFloat(getComputedStyle(el).opacity) || 0; }) : null;   /* a dot may be mid-count */
      els.forEach(function (el) { el.getAnimations().forEach(function (a) { a.cancel(); }); });
      var soft = 'blur(' + BLUR + 'px)', sharp = 'blur(0px)';
      els.forEach(function (el, k) {
        var o = starts ? starts[k] : 1;
        el.animate(dir === 'in' ? [
          { transform: 'translateY(' + RISE + 'px)', filter: soft, opacity: 0, offset: 0 },
          { transform: 'translateY(' + RISE * 0.42 + 'px)', filter: 'blur(' + BLUR * 0.5 + 'px)', opacity: 0.28, offset: 0.4 },
          { transform: 'translateY(' + RISE * 0.12 + 'px)', filter: 'blur(' + BLUR * 0.16 + 'px)', opacity: 0.72, offset: 0.7 },
          { transform: 'translateY(0)', filter: sharp, opacity: 1, offset: 1 }] : [
          { transform: 'translateY(0)', filter: sharp, opacity: o, offset: 0 },
          { transform: 'translateY(' + -EXIT * 0.2 + 'px)', filter: 'blur(' + BLUR * 0.3 + 'px)', opacity: o * 0.5, offset: 0.3 },
          { transform: 'translateY(' + -EXIT * 0.5 + 'px)', filter: 'blur(' + BLUR * 0.7 + 'px)', opacity: o * 0.1, offset: 0.6 },
          { transform: 'translateY(' + -EXIT + 'px)', filter: soft, opacity: 0, offset: 1 }],
          { duration: dir === 'in' ? IN_MS : OUT_MS, easing: dir === 'in' ? IN : OUT, fill: 'both', delay: +el.getAttribute('data-i') * STAGGER });
      });
    }
    function loopDots() {
      if (PS.reduce || !ref.current) return;
      [0.25, 0.5, 0.75].forEach(function (on, i) {
        var el = ref.current.querySelector('[data-dot="' + (i + 1) + '"]'); if (!el || !el.animate) return;
        el.animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: on }, { opacity: 1, offset: on + 0.0001 }, { opacity: 1, offset: 1 }], { duration: 2000, iterations: Infinity, easing: 'linear' });
      });
    }
    R.useLayoutEffect(function () { animate('in'); }, [step]);
    R.useEffect(function () {
      var hold = p.holdMs == null ? 1500 : p.holdMs, sub = p.submitMs == null ? 3000 : p.submitMs, ts = [], at = 0;
      function later(fn, ms) { ts.push(setTimeout(fn, ms)); }
      at = IN_MS + tail(0) + hold; later(function () { animate('out'); }, at);
      at += OUT_MS + tail(0) + GAP; later(function () { s[1](1); }, at);
      later(loopDots, at + IN_MS + tail(1) + 40);
      at += IN_MS + tail(1) + sub; later(function () { animate('out'); }, at);
      at += OUT_MS + tail(1) + GAP; later(function () { s[1](2); }, at);
      later(function () { ok[1](true); }, at + (IN_MS + tail(2)) / 2);
      later(function () { fin.current.text = true; finish(); }, at + IN_MS + tail(2) + hold);
      return function () { ts.forEach(clearTimeout); };
    }, []);
    var n = 0, dot = 0, t = text(step), words = t.split(' ').map(function (w, wi, all) {
      return h(R.Fragment, { key: wi }, h('span', { className: 'ps-osub__w' }, w.split('').map(function (c) {
        return h('span', { key: n, className: 'ps-osub__l', 'data-i': n++, 'data-dot': step === 1 && c === '.' ? ++dot : 0 }, c); })), wi < all.length - 1 ? ' ' : null);
    });
    return h('div', { className: 'ps-stage ps-osub', role: 'status', 'aria-live': 'polite', 'aria-label': lines[step] },
      h('span', { className: 'ps-stage__icon' }, h(PS.Coin, { size: 56, state: ok[0] ? 'success' : 'loading', onDone: function () { fin.current.coin = true; finish(); } })),
      h('div', { className: 'ps-stage__text' }, h('p', { key: step, ref: ref, className: 'ps-osub__line', 'aria-hidden': true }, words)));
  };

  /* OtpSheet: "Verify it's you" → "Enter code" in one sheet that changes height (OTP sheet morph).
     open · phone ('091****6789') · outcome ok | wrong | fail (the test code is typed for you: right, wrong, or the SMS fails)
     onClose · onVerified · onChange ("Change" next to the number) · auto (type the code by itself, default true) · seconds (59) */
  var CODE_OK = '122436', CODE_BAD = '122435';
  function OtpBody(p) {
    var s = R.useState({ step: 0, code: '', err: null, busy: false, left: 0 }), st = s[0], setSt = s[1];
    function set(o) { setSt(function (x) { return Object.assign({}, x, o); }); }
    var live = R.useRef(true); R.useEffect(function () { return function () { live.current = false; }; }, []);
    var tries = R.useRef(0);
    function send() {
      set({ busy: true, err: null });
      setTimeout(function () {
        if (!live.current) return;
        if (p.outcome === 'fail' && tries.current++ < 1) { set({ busy: false, err: 'We couldn’t send the code. Check your signal and try again.' }); return; }
        set({ busy: false, step: 1, code: '', err: null, left: p.seconds || 59 });
      }, 500 + Math.random() * 700);
    }
    /* countdown */
    R.useEffect(function () {
      if (st.step !== 1 || st.left <= 0) return;
      var t = setTimeout(function () { set({ left: st.left - 1 }); }, 1000); return function () { clearTimeout(t); };
    }, [st.step, st.left]);
    /* the demo types the code: the right one, or a wrong one first when outcome is 'wrong' */
    R.useEffect(function () {
      if (st.step !== 1 || p.auto === false || st.code || st.err) return;
      var code = p.outcome === 'wrong' && tries.current < 1 ? CODE_BAD : CODE_OK, ts = [];
      for (var i = 1; i <= 6; i++) (function (i) { ts.push(setTimeout(function () { if (live.current) onCode(code.slice(0, i)); }, 900 + i * 110)); })(i);
      return function () { ts.forEach(clearTimeout); };
    }, [st.step, st.err]);
    function onCode(v) {
      set({ code: v, err: null });
      if (v.length < 6) return;
      set({ busy: true });
      setTimeout(function () {
        if (!live.current) return;
        if (v === CODE_OK || (p.outcome !== 'wrong' && p.auto === false)) { p.onVerified(); return; }
        tries.current++; set({ busy: false, err: 'Incorrect code. Please try again.' });
      }, 450 + Math.random() * 500);
    }
    function resend() { tries.current = Math.max(tries.current, 1); set({ code: '', err: null, left: p.seconds || 59 }); }
    var one = st.step === 1, midH = one ? (st.err ? 116 : 60) : (st.err ? 104 : 48);
    return h(R.Fragment, null,
      h('div', { className: 'ps-otps__top' },
        h('div', { className: 'ps-otps__head' }, h(PS.Swap, { k: st.step, block: true }, h('span', { className: 'ps-t-title-sm' }, one ? 'Enter code' : 'Verify it’s you')),
          h(PS.Close, { onClick: one ? function () { set({ step: 0, code: '', err: null }); } : p.onClose })),
        h(PS.Swap, { k: st.step, block: true }, h('span', { className: 'ps-t-body-md ps-otps__desc', style: { display: 'block' } },
          one ? 'We sent a one-time code to you by SMS. Copy and paste it below.' : 'We need to make sure you still have access to your registered phone number.'))),
      h(m.div, { className: 'ps-otps__mid', initial: false, animate: { height: midH }, transition: MT.SPRING },
        h(AP, { initial: false, mode: 'popLayout' }, one
          ? h(m.div, Object.assign({ key: 'code', className: 'ps-otps__pane' }, PS.fade(MT.Y.block)),
              h(PS.OtpBoxes, { value: st.code, onChange: onCode, error: !!st.err, disabled: st.busy, cascade: true, autoFocus: p.auto === false }),
              st.err ? h(m.p, Object.assign({ className: 'ps-otps__err ps-t-body-md' }, PS.fade(-4)), st.err) : null)
          : h(m.div, Object.assign({ key: 'phone', className: 'ps-otps__pane' }, PS.fade(MT.Y.block)),
              h('div', { className: 'ps-otps__phone' }, h(PS.Icon, { name: 'smartphone', size: 24, color: 'tertiary' }), h('span', { className: 'ps-t-title-16' }, p.phone || '091****6789'),
                h(PS.Link, { onClick: p.onChange }, 'Change')),
              st.err ? h(m.p, Object.assign({ className: 'ps-otps__err ps-t-body-md' }, PS.fade(-4)), st.err) : null))),
      one ? h(PS.Button, { block: true, disabled: st.left > 0 || st.busy, onClick: resend }, h(PS.Swap, { k: st.left > 0 ? 'wait' : 'go' }, h('span', null, st.left > 0 ? 'Resend code in ' + st.left + 's' : 'Resend')))
          : h(PS.Button, { block: true, disabled: st.busy, onClick: send }, st.busy ? h(PS.Busy) : st.err ? 'Try again' : 'Get verification code'));
  }
  PS.OtpSheet = function OtpSheet(p) {
    return h(PS.Sheet, { open: p.open, kind: 'card', label: 'Verify it’s you', onClose: p.onClose, className: 'ps-otps' }, p.open ? h(OtpBody, p) : null);
  };

  /* CreditLimitIntro: the Credit limit increase animation (coins, new limit), played over the page before home shows.
     data { old, new, inc, exp } · onDone. Hosts the shipped page (prototypes/credit-limit-coins/baked) and hides its Replay button. */
  PS.CreditLimitIntro = function CreditLimitIntro(p) {
    var d = p.data || {}, done = R.useRef(p.onDone); done.current = p.onDone;
    R.useEffect(function () {
      function on(e) { if (e.data && e.data.type === 'creditlimit:done' && done.current) done.current(); }
      window.addEventListener('message', on);
      var t = setTimeout(function () { if (done.current) done.current(); }, 9000);          /* never leaves the user stuck behind it */
      return function () { window.removeEventListener('message', on); clearTimeout(t); };
    }, []);
    var src = PS.root + 'prototypes/credit-limit-coins/baked/baked-heap.html?old=' + (d.old || 30000) + '&new=' + (d.new || 40000) + '&inc=' + (d.inc || 10000) + (d.exp ? '&exp=' + encodeURIComponent(d.exp) : '');
    return h('iframe', { className: 'ps-climit', src: src, title: 'Credit limit increase',
      onLoad: function (e) { try { var st = e.target.contentDocument.createElement('style'); st.textContent = '#replay{display:none!important}'; e.target.contentDocument.head.appendChild(st); } catch (x) {} } });
  };
})();
