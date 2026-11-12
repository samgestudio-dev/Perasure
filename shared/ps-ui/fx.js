/* PeraSure UI — the motion pieces of the earlier demos as shared components (the demo pages themselves stay as they are):
   OrderSubmit (prototypes/order-submit) · OtpSheet (prototypes/otp-sheet-morph) · CreditLimitIntro (prototypes/credit-limit-coins,
   hosted as it ships) · the Loading page is PS.Loader (feedback.js). Needs core.js, layout.js, feedback.js, form.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* ---- Letters: a line whose letters rise in one after another (Order submit): 560 ms each, 16 ms apart, 12 px, 5 px blur;
     out: the whole line rises 10 px and fades in 400 ms. dots: the trailing "…" keeps looping while the line waits. */
  var IN = 'cubic-bezier(0.34, 0.02, 0.2, 1)', OUT = 'cubic-bezier(0.4, 0.05, 0.6, 0.4)';
  function Letters(p) {
    var ref = R.useRef(null);
    R.useEffect(function () {
      var el = ref.current; if (!el || PS.reduce || !el.animate) return;
      var ls = el.querySelectorAll('.ps-osub__l');
      for (var i = 0; i < ls.length; i++) ls[i].animate([{ opacity: 0, transform: 'translateY(12px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }],
        { duration: 560, delay: i * 16, easing: IN, fill: 'both' });
    }, []);
    R.useEffect(function () {
      var el = ref.current; if (!p.out || !el || PS.reduce || !el.animate) return;
      el.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 400, easing: OUT, fill: 'both' });
    }, [p.out]);
    var text = p.text, dots = p.dots && /(…|\.\.\.)$/.test(text); if (dots) text = text.replace(/(…|\.\.\.)$/, '');
    var n = 0, words = text.split(' ').map(function (w, wi, all) {
      return h('span', { key: wi, className: 'ps-osub__w' }, w.split('').map(function (c) { return h('span', { key: n++, className: 'ps-osub__l' }, c); }),
        wi < all.length - 1 ? ' ' : dots ? h('span', { className: 'ps-osub__dots ps-osub__l', 'aria-hidden': true }, h('i', null, '.'), h('i', null, '.'), h('i', null, '.')) : null);
    });
    return h('p', { ref: ref, className: 'ps-osub__line ps-t-title-md', style: p.out && PS.reduce ? { opacity: 0 } : null }, words);
  }
  /* OrderSubmit: the loan request being sent — the coin spins while three lines take turns, then lands on the tick.
     lines (three texts) · submitMs (how long the request takes, 3000) · holdMs (1500) · onDone. Shown full-screen (PS.Overlay). */
  PS.OrderSubmit = function OrderSubmit(p) {
    var lines = p.lines || ['Submitting your loan request…', 'Confirming your loan details…', 'Your loan request has been submitted.'];
    var s = R.useState({ i: 0, out: false }), st = s[0], set = s[1], ok = R.useState(false), done = R.useRef(p.onDone); done.current = p.onDone;
    R.useEffect(function () {
      var hold = p.holdMs || 1500, sub = p.submitMs || 3000, gap = 120, ts = [], at = 0;
      function later(fn, ms) { ts.push(setTimeout(fn, ms)); }
      var inMs = function (t) { return 560 + t.length * 16; };
      at = inMs(lines[0]) * 0.6 + hold; later(function () { set({ i: 0, out: true }); }, at);
      at += 400 + gap; later(function () { set({ i: 1, out: false }); }, at);
      at = Math.max(at + inMs(lines[1]) * 0.6 + hold, sub); later(function () { set({ i: 1, out: true }); }, at);
      at += 400 + gap; later(function () { set({ i: 2, out: false }); }, at);
      later(function () { ok[1](true); }, at + inMs(lines[2]) * 0.3);                 /* the tick lands half way through the last line */
      later(function () { if (done.current) done.current(); }, at + inMs(lines[2]) * 0.6 + hold + 600);
      return function () { ts.forEach(clearTimeout); };
    }, []);
    return h('div', { className: 'ps-osub', role: 'status', 'aria-live': 'polite' },
      h(PS.Coin, { size: 56, state: ok[0] ? 'success' : 'loading' }),
      h('div', { className: 'ps-osub__text' }, h(Letters, { key: st.i, text: lines[st.i], out: st.out, dots: st.i === 1 })));
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
