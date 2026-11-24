/* PeraSure UI — loan application: amount + term card (slider), coupons section, order details, borrower protection,
   withdrawal method, agreement line and the repayment plan. Needs core.js and coupon.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, MT = PS.MT;

  /* useGlide: a motion value that follows target — at once while the user holds the slider (or with reduced motion), on the
     Smooth spring when something else moved it (a coupon raised the limit, "Keep coupon" set the amount). rest: in value units */
  function useGlide(target, held, rest) {
    var mv = M.useMotionValue(target), first = R.useRef(true);
    R.useEffect(function () {
      if (first.current) { first.current = false; return; }
      if (held.current || PS.reduce) { mv.stop(); mv.set(target); return; }
      var a = M.animate(mv, target, Object.assign({}, MT.SPRING, { restDelta: rest, restSpeed: rest * 10 }));
      return function () { a.stop(); };
    }, [target]);
    return mv;
  }
  var M = window.Motion;

  /* Slider: amount slider (pointer + keyboard) · value · min · max · step · onChange(v) while dragging · onCommit(v) on release
     boost (max is raised by a coupon: green end with the coupon mark). The knob and fill follow the finger at once; when the
     value or the max changes for any other reason they glide there on the Smooth spring. Transforms only.
     (AmountCard hands in its own motion values: amt, maxMv, held.) */
  PS.Slider = function Slider(p) {
    var el = R.useRef(null), last = R.useRef(p.value), ownHeld = R.useRef(false), held = p.held || ownHeld;
    var rest = (p.step || 500) * 0.1;
    var ownAmt = useGlide(p.value, held, rest), ownMax = useGlide(p.max, held, rest);
    var amt = p.amt || ownAmt, mx = p.maxMv || ownMax, lo = p.min;
    var pct = M.useTransform([amt, mx], function (v) { var sp = Math.max(1, v[1] - lo); return Math.max(0, Math.min(100, (v[0] - lo) / sp * 100)); });
    /* the knob rides in px (track width × progress), so nothing reaches past the track */
    var tw = M.useMotionValue(0);
    R.useEffect(function () {
      var n = el.current; if (!n) return; tw.set(n.offsetWidth);
      var ro = window.ResizeObserver ? new ResizeObserver(function () { tw.set(n.offsetWidth); }) : null; if (ro) ro.observe(n);
      return function () { if (ro) ro.disconnect(); };
    }, []);
    var fillX = M.useTransform(pct, function (v) { return (v - 100) + '%'; }), knobX = M.useTransform([pct, tw], function (v) { return v[0] * v[1] / 100; });
    var span = Math.max(1, p.max - p.min);
    function at(x) {
      var r = el.current.getBoundingClientRect(), t = Math.max(0, Math.min(1, (x - r.left) / r.width));
      var v = Math.round((p.min + t * span) / p.step) * p.step;
      return Math.max(p.min, Math.min(p.max, v));
    }
    function set(v) { if (v !== last.current) { last.current = v; p.onChange(v); } }
    function end() { if (held.current) { held.current = false; if (p.onCommit) p.onCommit(last.current); } }
    return h('div', null,
      h('div', { className: 'ps-slider', ref: el, role: 'slider', tabIndex: 0, 'aria-label': p.label || 'Amount', 'aria-valuemin': p.min, 'aria-valuemax': p.max, 'aria-valuenow': p.value,
        'aria-valuetext': PS.money(p.value, 0), style: { touchAction: 'pan-y' },
        onPointerDown: function (e) { held.current = true; last.current = p.value; amt.stop(); el.current.setPointerCapture(e.pointerId); set(at(e.clientX)); },
        onPointerMove: function (e) { if (held.current) set(at(e.clientX)); },
        onPointerUp: end, onPointerCancel: end,
        onKeyDown: function (e) {
          var d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
          if (!d) return; e.preventDefault(); held.current = true;
          var v = Math.max(p.min, Math.min(p.max, p.value + d * p.step)); last.current = v; p.onChange(v); end();
        } },
        h('div', { className: 'ps-slider__track' }, h(m.div, { className: 'ps-slider__fill', style: { x: fillX } })),
        h(m.div, { className: 'ps-slider__rail', style: { x: knobX } }, h('span', { className: 'ps-slider__knob' }))),
      h('div', { className: PS.cx('ps-slider__ends', p.boost && 'is-boost') }, h('span', null, PS.money(p.min, 0)),
        h(PS.Swap, { k: p.max + (p.boost ? 'b' : ''), y: MT.Y.digit },
          h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-gap-2xs)' } },
            p.boost ? h(PS.Icon, { name: 'coupon-tag', size: 14, color: 'positive' }) : null, PS.money(p.max, 0)))));
  };

  /* AmountCard: "Disbursement amount" + slider + loan term · amount · min · max · step · boost · onAmount(v) · onCommit(v)
     terms [3, 6, 8] · term · termNote ('15 days / term') · onTerm(t) · label · onEdit (the pencil opens the keypad).
     The amount follows the slider at once; when a coupon changes it, the amount counts with the gliding knob (in steps). */
  PS.AmountCard = function AmountCard(p) {
    var held = R.useRef(false), step = p.step || 500, rest = step * 0.1;
    var amt = useGlide(p.amount, held, rest), mx = useGlide(p.max, held, rest);
    var intEl = R.useRef(null), decEl = R.useRef(null), init = R.useRef(PS.num(p.amount, 2).split('.'));
    R.useEffect(function () {
      return amt.on('change', function (v) {
        var t = PS.num(Math.round(v / step) * step, 2).split('.');
        if (intEl.current && intEl.current.textContent !== t[0]) intEl.current.textContent = t[0];
        if (decEl.current) decEl.current.textContent = '.' + t[1];
      });
    }, [amt, step]);
    return h(PS.Card, { variant: 'raised', className: 'ps-amountcard' },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-sm)' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-xs)' } },
          h('p', { className: 'ps-text-body-md-strong ps-c-tertiary' }, p.label || 'Disbursement amount'),
          h('div', { className: 'ps-amountcard__amt', 'aria-live': 'off' },
            h('span', { className: 'ps-amount' }, h('span', { className: 'ps-amount__cur' }, '₱'),
              h('span', { className: 'ps-amount__int', ref: intEl }, init.current[0]), h('span', { className: 'ps-amount__dec', ref: decEl }, '.' + init.current[1])),
            p.onEdit ? h(m.button, Object.assign({ type: 'button', className: 'ps-amountcard__edit', 'aria-label': 'Type the amount', onClick: p.onEdit }, PS.press(true)), h(PS.Icon, { name: 'edit', size: 20, color: 'brand' }))
              : h('span', { className: 'ps-amountcard__edit' }, h(PS.Icon, { name: 'edit', size: 20, color: 'brand' })))),
        h(PS.Slider, { value: p.amount, min: p.min, max: p.max, step: step, boost: p.boost, onChange: p.onAmount, onCommit: p.onCommit, label: p.label || 'Disbursement amount',
          amt: amt, maxMv: mx, held: held })),
      h(PS.Divider),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-md)' } },
        h(PS.KV, { bare: true, label: 'Loan term', value: p.termNote || '15 days / term' }),
        h('div', { className: 'ps-terms', role: 'radiogroup', 'aria-label': 'Loan term' }, (p.terms || [3, 6, 8]).map(function (t) {
          var on = t === p.term;
          return h(PS.Chip, { key: t, size: 'small', selected: on, onClick: function () { if (!on && p.onTerm) p.onTerm(t); } }, t + ' terms');   /* phase 1: Chip Small 36 = the legacy in-card term chip */
        }))));
  };

  /* CouponsSection: "COUPONS · See all n" + rows · count · onSeeAll · rows [{ key, type, title, sub, on, onClick }] (PS.CouponRow) */
  PS.CouponsSection = function CouponsSection(p) {
    var rows = [];
    p.rows.forEach(function (r, i) {
      if (i) rows.push(h(PS.Divider, { key: 'd' + i }));
      rows.push(h(PS.CouponRow, Object.assign({ key: r.key || i }, r)));
    });
    return h(PS.Section, { label: p.label || 'Coupons', action: p.count ? 'See all ' + p.count : null, onAction: p.onSeeAll },
      h(PS.Card, null, rows));
  };

  /* OrderDetails: "ORDER DETAILS" card · rows [{ label, value, tone }] (a row is hidden when its value is null) · link · onLink */
  PS.OrderDetails = function OrderDetails(p) {
    var rows = p.rows.filter(function (r) { return r.value != null; });
    return h(PS.Section, { label: p.label || 'Order details' },
      h(PS.Card, { className: 'ps-details' }, h(PS.Rows, { rows: rows }), h(PS.Divider), p.link ? h(PS.Link, { onClick: p.onLink }, p.link) : null));
  };

  /* ProtectionCard: borrower protection · title · tag ('Protected') · body · link ('See benefits') · onLink */
  PS.ProtectionCard = function ProtectionCard(p) {
    return h(PS.Card, null,
      h('div', { className: 'ps-protect__row' }, h(PS.Art, { name: 'protection', size: 36 }),
        h('div', null, h('div', null, h('p', { className: 'ps-text-body-md-strong' }, p.title || 'Borrower protection'), p.tag !== null ? h(PS.Tag, { tone: 'outline' }, p.tag || 'Protected') : null),
          h('p', { className: 'ps-text-body-sm ps-c-tertiary ps-protect__body' }, p.body))),
      h(PS.Divider), h(PS.Link, { onClick: p.onLink }, p.link || 'See benefits'));
  };

  /* MethodCard: "WITHDRAWAL METHOD" · name · last4 · logo (assets/logos file, 'bank-bpi') · onClick */
  PS.MethodCard = function MethodCard(p) {
    return h(PS.Section, { label: p.label || 'Withdrawal method' },
      h(m.button, Object.assign({ type: 'button', className: 'ps-card ps-method', onClick: p.onClick }, PS.press()),
        h('span', { className: 'ps-method__main' }, h('span', { className: 'ps-method__logo' }, h(PS.Art, { dir: 'logos', name: p.logo || 'bank-bpi', ext: p.logoExt, size: 36 })),
          h('span', { className: 'ps-method__info' }, h('span', { className: 'ps-text-body-md-strong ps-ellipsis', style: { display: 'block' } }, p.name),
            h('span', { className: 'ps-text-body-md ps-c-tertiary' }, 'Ending in ' + p.last4))),
        h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })));
  };

  /* Agreement: tick line above the primary button (as withdraw's) · on · onToggle · children (text; wrap links in <b>)
     nudge: a number — each time it changes, a brand ring ripples out of the empty circle twice (1 → 2.4×, fading, 0.6 s on
     the ENTER curve), the page's hint that this is what's missing. Transform / opacity only. */
  PS.Agreement = function Agreement(p) {
    var halo = R.useRef(null), first = R.useRef(true);
    R.useEffect(function () {
      if (first.current) { first.current = false; return; }
      if (!p.nudge || p.on || PS.reduce || !halo.current || !window.Motion.animate) return;
      var ring = function () { return window.Motion.animate(halo.current, { scale: [1, 2.4], opacity: [0.6, 0] }, { duration: 0.6, ease: MT.EASE_IN }); };
      var a = ring(), b = null; if (a && a.then) a.then(function () { b = ring(); });
      return function () { if (a && a.stop) a.stop(); if (b && b.stop) b.stop(); };
    }, [p.nudge]);
    return h(m.button, Object.assign({ type: 'button', role: 'checkbox', 'aria-checked': !!p.on, className: 'ps-agree', onClick: p.onToggle, ref: p.innerRef }, PS.press()),
      h('span', { className: 'ps-agree__mark' }, h('span', { className: 'ps-agree__halo', ref: halo }), h(PS.Check, { size: 'small', on: p.on })), h('p', null, p.children));
  };

  /* RepaymentPlan: schedule list (inside a plain sheet) · items [{ title, date, total, rows: [{ label, value, was }] }] */
  PS.RepaymentPlan = function RepaymentPlan(p) {
    return h('div', { className: PS.cx('ps-plan', p.className) }, p.items.map(function (it, i) {
      return h('div', { key: i, className: 'ps-plan__item' },
        h('div', { className: 'ps-plan__rail' }, h('span', { className: 'ps-plan__dot', 'aria-hidden': true }), h('i')),   /* BRIEF 32: the root dot file untouched, coloured through a CSS mask */
        h('div', { className: 'ps-plan__main' },
          h('div', { className: 'ps-plan__head' },
            h('div', null, h('p', { className: 'ps-text-body-lg-strong' }, it.title), h('p', { className: 'ps-text-body-sm ps-c-disabled' }, it.date)),
            h('div', null, h('p', { className: 'ps-text-body-lg-strong' }, PS.money(it.total)), h('p', { className: 'ps-text-body-sm ps-c-disabled' }, 'Total payment'))),
          h('div', { className: 'ps-plan__rows' }, it.rows.map(function (r, j) {
            return h('div', { key: j }, h('span', { className: 'ps-text-body-md' }, r.label),
              h('span', null, r.was != null && Math.abs(r.was - r.value) > 0.004 ? h('span', { className: 'ps-plan__was' }, PS.money(r.was)) : null,
                h('span', { className: 'ps-text-body-md-strong' }, PS.money(r.value))));
          }))));
    }));
  };

  /* OrderHead: the amount at the top of a loan page — a label over the amount in brand blue (32 / 40) · label · amount */
  PS.OrderHead = function OrderHead(p) {
    return h('div', { className: 'ps-ohead' }, h('p', { className: 'ps-ohead__label' }, p.label), h(PS.Amount, { value: p.amount, className: 'ps-ohead__amount' }));
  };
  /* LoanStateCard (Figma 11263:25900 = legacy Loan state card 6104:11953): where a loan application stands, on the outlined card (328 × 80 / 96) —
     a 28 tile coloured by the state with its icon, a title and a line · state reviewing (navy, clock) | declined (red, close: not approved) | method
     (red, alert: the transfer failed — change the withdrawal method) | disbursed (green, check: on its way) · title · body (defaults: the legacy copy).
     The tile stays (coloured by state, like ActivityItem's — not the neutral navy tile BRIEF 22 removed). */
  var LSC = { reviewing: ['history', '', 'We’re reviewing your application', 'Your loan is under review. We’ll let you know once we’re sending your money.'],
    declined: ['close', 'is-negative', 'Your loan wasn’t approved', 'We can’t offer you a loan right now. You can check your credit limit again in a few days.'],
    method: ['alert-circle', 'is-negative', 'We couldn’t send your loan', 'The transfer to your account didn’t go through. Change your withdrawal method to try again.'],
    disbursed: ['check', 'is-positive', 'Your loan is on its way', 'We’re sending the money to your account now. This usually takes a few minutes.'] };
  PS.LoanStateCard = function LoanStateCard(p) {
    var c = LSC[p.state] || LSC.reviewing;
    return h(PS.Card, { variant: 'outline', className: 'ps-ostatus' }, h('span', { className: PS.cx('ps-tile', c[1]) }, h(PS.Icon, { name: c[0], size: 20, color: c[1] === 'is-positive' ? 'on-action' : 'inverse' })),
      h('div', null, h('p', { className: 'ps-text-title-xs' }, p.title || c[2]), h('p', { className: 'ps-text-body-sm ps-c-secondary' }, p.body || c[3])));
  };
  /* OrderStatus: the older name — state review → reviewing, failed → method */
  PS.OrderStatus = function OrderStatus(p) { return h(PS.LoanStateCard, Object.assign({}, p, { state: p.state === 'failed' ? 'method' : p.state === 'review' ? 'reviewing' : p.state })); };
  /* PlanRows: a payment plan as separate white rows 2 px apart, the first and last rounded (Figma 52:9668) · rows [{ label, value }] */
  PS.PlanRows = function PlanRows(p) {
    return h('div', { className: 'ps-planrows' }, p.rows.map(function (r) { return h(PS.KV, { key: r.label, label: r.label, value: r.value }); }));
  };
  /* AmountEntry: the amount keypad page's white sheet (Figma 52:12744; numbers 13732:11315) — the amount as it is typed (₱ Number/lg, digits
     Number/xxl, ".00" Number/xs — Hanken Grotesk; each typed digit is its own box), what is
     not typed yet in the disabled colour, a blinking caret; a typed digit rises in, a deleted one fades), a line that turns red for an amount out
     of range, the terms, the keypad. typed (the digits typed so far, with commas, '' for none) · amount (for screen readers) · label · hint
     · error (text) · terms · term · onTerm(t) · onKey */
  PS.AmountEntry = function AmountEntry(p) {
    var shown = p.typed || '', AP = PS.AP;
    var top = h('div', { className: 'ps-aentry__top' },
        h('p', { className: 'ps-text-body-md-strong ps-c-secondary' }, p.label || 'Disbursement amount'),
        h('div', { className: 'ps-aentry__num', 'aria-live': 'polite', 'aria-label': PS.money(p.amount) },
          h('span', { className: 'ps-aentry__cur' }, '₱'),
          h('span', { className: 'ps-aentry__typed' }, h(AP, { initial: false, mode: 'popLayout' }, shown.split('').map(function (c, i, all) {
            return h(m.span, { key: i + c, initial: { opacity: 0, y: MT.Y.digit, filter: 'blur(' + MT.BLUR + 'px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.2, ease: MT.EASE_IN } },
              exit: { opacity: 0, transition: { duration: 0.08 } } }, c);
          }))), h('span', { className: 'ps-aentry__caret', 'aria-hidden': true }),
          h('span', { className: 'ps-aentry__rest' }, '00'), h('span', { className: 'ps-aentry__dec' }, '.00')),
        h(PS.Swap, { k: p.error ? 'e' : 'r', block: true }, h('span', { className: PS.cx('ps-text-body-md', p.error ? 'ps-c-negative' : 'ps-c-placeholder') }, p.error || p.hint)));
    if (p.part === 'top') return top;   /* spec AmountEntry (legacy 9426:18067): only the number block, 312 × 184 */
    return h('div', { className: 'ps-aentry' }, top,
      h('div', { className: 'ps-aentry__pad' },
        h('div', { className: 'ps-aentry__terms' }, h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, 'Choose a loan term to continue'),
          h('div', { className: 'ps-terms', role: 'radiogroup', 'aria-label': 'Loan term' }, p.terms.map(function (t) {
            var on = p.term === t;
            return h(PS.Chip, { key: t, size: 'medium', selected: !!on, onClick: function () { p.onTerm(t); } }, t + ' terms');   /* Chip Medium 41 = legacy Term pick */
          }))),
        h(PS.Divider), h(PS.Keypad, { onKey: p.onKey, cascade: true })));
  };
})();
