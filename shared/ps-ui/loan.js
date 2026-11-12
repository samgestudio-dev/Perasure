/* PeraSure UI — loan application: amount + term card (slider), coupons section, order details, borrower protection,
   withdrawal method, agreement line and the repayment plan. Needs core.js and coupon.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* Slider: amount slider (pointer + keyboard) · value · min · max · step · onChange(v) while dragging · onCommit(v) on release · boost (max is raised by a coupon) */
  PS.Slider = function Slider(p) {
    var el = R.useRef(null), drag = R.useRef(false), last = R.useRef(p.value);
    var span = Math.max(1, p.max - p.min), pct = Math.max(0, Math.min(100, (p.value - p.min) / span * 100));
    function at(x) {
      var r = el.current.getBoundingClientRect(), t = Math.max(0, Math.min(1, (x - r.left) / r.width));
      var v = Math.round((p.min + t * span) / p.step) * p.step;
      return Math.max(p.min, Math.min(p.max, v));
    }
    function set(v) { if (v !== last.current) { last.current = v; p.onChange(v); } }
    return h('div', null,
      h('div', { className: 'ps-slider', ref: el, role: 'slider', tabIndex: 0, 'aria-label': p.label || 'Amount', 'aria-valuemin': p.min, 'aria-valuemax': p.max, 'aria-valuenow': p.value,
        'aria-valuetext': PS.money(p.value, 0), style: { touchAction: 'pan-y' },
        onPointerDown: function (e) { drag.current = true; last.current = p.value; el.current.setPointerCapture(e.pointerId); set(at(e.clientX)); },
        onPointerMove: function (e) { if (drag.current) set(at(e.clientX)); },
        onPointerUp: function () { if (drag.current) { drag.current = false; if (p.onCommit) p.onCommit(last.current); } },
        onPointerCancel: function () { if (drag.current) { drag.current = false; if (p.onCommit) p.onCommit(last.current); } },
        onKeyDown: function (e) {
          var d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
          if (!d) return; e.preventDefault(); var v = Math.max(p.min, Math.min(p.max, p.value + d * p.step)); last.current = v; p.onChange(v); if (p.onCommit) p.onCommit(v);
        } },
        h('div', { className: 'ps-slider__track' }, h('div', { className: 'ps-slider__fill', style: { width: pct + '%' } })),
        h('div', { className: 'ps-slider__knob', style: { left: pct + '%' } })),
      h('div', { className: PS.cx('ps-slider__ends', p.boost && 'is-boost') }, h('span', null, PS.money(p.min, 0)),
        h('span', null, p.boost ? h(PS.Icon, { name: 'coupon', size: 14, color: 'positive' }) : null, PS.money(p.max, 0))));
  };

  /* AmountCard: "Disbursement amount" + slider + loan term · amount · min · max · step · boost · onAmount(v) · onCommit(v)
     terms [3, 6, 8] · term · termNote ('15 days / Term') · onTerm(t) · label */
  PS.AmountCard = function AmountCard(p) {
    return h(PS.Card, { variant: 'raised', className: 'ps-amountcard' },
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-sm)' } },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-xs)' } },
          h('p', { className: 'ps-t-body-md-em ps-c-tertiary' }, p.label || 'Disbursement amount'),
          h('div', { className: 'ps-amountcard__amt' }, h(PS.Amount, { value: p.amount, curFont: 'body' }),
            h('span', { className: 'ps-amountcard__edit' }, h(PS.Icon, { name: 'edit', size: 20, color: 'brand' })))),
        h(PS.Slider, { value: p.amount, min: p.min, max: p.max, step: p.step || 500, boost: p.boost, onChange: p.onAmount, onCommit: p.onCommit, label: p.label || 'Disbursement amount' })),
      h(PS.Divider),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-md)' } },
        h(PS.KV, { label: 'Loan term', value: p.termNote || '15 days / term' }),
        h('div', { className: 'ps-terms', role: 'radiogroup', 'aria-label': 'Loan term' }, (p.terms || [3, 6, 8]).map(function (t) {
          var on = t === p.term;
          return h(m.button, { key: t, type: 'button', role: 'radio', 'aria-checked': on, className: PS.cx('ps-term', on && 'is-on'), whileTap: PS.TAP,
            onClick: function () { if (!on && p.onTerm) p.onTerm(t); } }, t + ' terms');
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
        h('div', null, h('div', null, h('p', { className: 'ps-t-body-md-em' }, p.title || 'Borrower protection'), p.tag !== null ? h(PS.Tag, { tone: 'outline' }, p.tag || 'Protected') : null),
          h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.body))),
      h(PS.Divider), h(PS.Link, { onClick: p.onLink }, p.link || 'See benefits'));
  };

  /* MethodCard: "WITHDRAWAL METHOD" · name · last4 · logo (assets/logos file, 'bank-bpi') · onClick */
  PS.MethodCard = function MethodCard(p) {
    return h(PS.Section, { label: p.label || 'Withdrawal method' },
      h(m.button, { type: 'button', className: 'ps-card ps-method', onClick: p.onClick, whileTap: { scale: 0.985 } },
        h('span', { className: 'ps-method__main' }, h('span', { className: 'ps-method__logo' }, h(PS.Art, { dir: 'logos', name: p.logo || 'bank-bpi', size: 36 })),
          h('span', { className: 'ps-method__info' }, h('span', { className: 'ps-t-body-md-em ps-ellipsis', style: { display: 'block' } }, p.name),
            h('span', { className: 'ps-t-body-md ps-c-tertiary' }, 'Ending in ' + p.last4))),
        h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })));
  };

  /* Agreement: tick line above the primary button · on · onToggle · children (text; wrap links in <b>) */
  PS.Agreement = function Agreement(p) {
    return h(m.button, { type: 'button', role: 'checkbox', 'aria-checked': !!p.on, className: 'ps-agree', onClick: p.onToggle, whileTap: { scale: 0.99 } },
      h(PS.Check, { on: p.on, box: true }), h('p', null, p.children));
  };

  /* RepaymentPlan: schedule list (inside a plain sheet) · items [{ title, date, total, rows: [{ label, value, was }] }] */
  PS.RepaymentPlan = function RepaymentPlan(p) {
    return h('div', { className: 'ps-plan' }, p.items.map(function (it, i) {
      return h('div', { key: i, className: 'ps-plan__item' },
        h('div', { className: 'ps-plan__rail' }, h('img', { src: PS.asset('art/dot-schedule.svg'), alt: '' }), h('i')),
        h('div', { className: 'ps-plan__main' },
          h('div', { className: 'ps-plan__head' },
            h('div', null, h('p', { className: 'ps-t-body-lg-em' }, it.title), h('p', { className: 'ps-t-caption-sm ps-c-disabled' }, it.date)),
            h('div', null, h('p', { className: 'ps-t-body-lg-em' }, PS.money(it.total)), h('p', { className: 'ps-t-caption-sm ps-c-disabled' }, 'Total payment'))),
          h('div', { className: 'ps-plan__rows' }, it.rows.map(function (r, j) {
            return h('div', { key: j }, h('span', { className: 'ps-t-body-md' }, r.label),
              h('span', null, r.was != null && Math.abs(r.was - r.value) > 0.004 ? h('span', { className: 'ps-plan__was' }, PS.money(r.was)) : null,
                h('span', { className: 'ps-t-body-md-em' }, PS.money(r.value))));
          }))));
    }));
  };
})();
