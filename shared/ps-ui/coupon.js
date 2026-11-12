/* PeraSure UI — coupons: pictures, the ticket (every state), segmented tabs, empty state, the loan-page coupon row,
   the payment summary, the coupon picker sheet and the "keep your coupon?" decision. Needs core.js and layout.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP;

  /* CouponArt: the coupon picture · type percent (% off) | amount (₱ off) | limit (credit limit increase) · size (36 / 40 / 80 px) */
  var ART = { percent: 'coupon-percent', amount: 'coupon-amount', limit: 'coupon-limit' };
  PS.CouponArt = function CouponArt(p) { return h(PS.Art, { name: ART[p.type] || ART.percent, size: p.size || 36, className: p.className, style: p.style }); };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /* Countdown: "Expires in 23:59:59" ticking every second · to (time in ms) · prefix */
  PS.Countdown = function Countdown(p) {
    var s = R.useState(Date.now()), now = s[0];
    R.useEffect(function () { var t = setInterval(function () { s[1](Date.now()); }, 1000); return function () { clearInterval(t); }; }, []);
    var left = Math.max(0, Math.floor((p.to - now) / 1000)), d = Math.floor(left / 86400);
    var text = d >= 2 ? d + ' days' : pad(Math.floor(left / 3600)) + ':' + pad(Math.floor(left / 60) % 60) + ':' + pad(left % 60);
    return h('span', { className: 'ps-nowrap', style: { fontVariantNumeric: 'tabular-nums' } }, (p.prefix == null ? 'Expires in ' : p.prefix) + text);
  };

  /* CouponTicket: the coupon in the coupon centre and the picker.
     value ('25% OFF') · label ('First-payment interest') · rule (condition line) · ruleLong (truncated: ⓘ, tap → onRule(el)) · meta ('Valid until …')
     expiresAt (ms: live countdown instead of meta) · best · state default | selected | used | expired | unavailable · reason (unavailable)
     action use (Use button → onUse) | pick (whole ticket toggles → onPick) | none · shadow */
  PS.CouponTicket = function CouponTicket(p) {
    var st = p.state || 'default', muted = st === 'used' || st === 'expired', off = st === 'unavailable', sel = st === 'selected', pick = p.action === 'pick';
    var right = muted ? h('p', { className: 'ps-ticket__status' }, st === 'used' ? 'Used' : 'Expired')
      : p.action === 'use' ? h(PS.Button, { variant: 'outline', onClick: function (e) { e.stopPropagation(); if (p.onUse) p.onUse(); } }, p.useLabel || 'Use')
      : pick ? h('span', { className: 'ps-ticket__pick' }, h(PS.Check, { on: sel, off: off })) : null;
    var rule = p.ruleLong
      ? h('span', { className: 'ps-ticket__rule', role: 'button', tabIndex: 0, 'aria-label': p.rule,
          onClick: function (e) { e.stopPropagation(); if (p.onRule) p.onRule(e.currentTarget); } },
          h('span', { className: 'ps-ellipsis' }, p.rule), h(PS.Icon, { name: 'alert-circle', size: 12, color: 'tertiary' }))
      : h('span', { className: 'ps-ellipsis', style: { display: 'block', width: '100%' } }, p.rule);
    var second = off && p.reason ? h('p', { className: 'ps-ticket__why' }, h(PS.Icon, { name: 'alert-circle', size: 12 }), p.reason)
      : p.expiresAt && !muted ? h('p', { className: 'ps-ticket__count' }, h(PS.Icon, { name: 'clock', size: 12, color: 'countdown' }), h(PS.Countdown, { to: p.expiresAt }))
      : h('p', null, p.meta);
    var kids = [
      h('span', { key: 's', className: 'ps-ticket__shape' }, h(AP, { initial: false }, sel ? h(m.span, { key: 'bar', className: 'ps-ticket__bar',
        initial: { scaleX: 0 }, animate: { scaleX: 1 }, exit: { scaleX: 0 }, style: { originX: 0 }, transition: PS.T.ui }) : null)),
      h('div', { key: 'i', className: 'ps-ticket__in' },
        h('div', { className: 'ps-ticket__row' },
          h('div', { className: 'ps-ticket__head' },
            h('div', { className: 'ps-ticket__value' }, h('p', { className: 'ps-t-title-md' }, p.value), p.best && !muted && !off ? h(PS.Tag, { tone: 'best' }, 'Best') : null),
            h('p', { className: 'ps-t-label-md ps-ticket__sub ps-ellipsis' }, p.label)),
          right),
        h('div', { className: 'ps-ticket__meta ps-t-caption-sm' }, h('p', null, rule), second))
    ];
    var cls = PS.cx('ps-ticket', (sel || p.shadow) && 'ps-ticket--shadow', muted && 'ps-ticket--muted', off && 'ps-ticket--off', p.className);
    if (pick) return h(m.button, { type: 'button', className: cls, 'aria-pressed': sel, 'aria-disabled': off || undefined, onClick: p.onPick, whileTap: { scale: 0.985 }, transition: PS.T.snap, layout: p.layout ? 'position' : undefined }, kids);
    return h(m.div, { className: cls, layout: p.layout ? 'position' : undefined }, kids);
  };

  /* Tabs: segmented control · items [{ id, label, count }] (count shown when set) · value · onChange(id) · glass (frosted, in sheets) · id (pill layout id) */
  PS.Tabs = function Tabs(p) {
    return h('div', { className: PS.cx('ps-tabs', p.glass && 'ps-tabs--glass', p.className), role: 'tablist' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h(m.button, { key: it.id, type: 'button', role: 'tab', 'aria-selected': on, className: PS.cx('ps-tabs__tab', on && 'is-on'), whileTap: PS.TAP,
        onClick: function () { if (!on && p.onChange) p.onChange(it.id); } },
        on ? h(m.span, { layoutId: (p.id || 'ps-tabs') + '-pill', className: 'ps-tabs__pill', transition: PS.T.layout }) : null,
        h('span', null, it.label), it.count != null ? h(PS.Count, { n: it.count, on: on }) : null);
    }));
  };

  /* EmptyState: picture + title + one line · art (file in assets/art, 'empty-box') · title · body */
  PS.EmptyState = function EmptyState(p) {
    return h('div', { className: PS.cx('ps-empty', p.className), style: p.style },
      h(PS.Art, { name: p.art || 'empty-box', size: 80 }),
      h('div', null, h('p', { className: 'ps-t-title-sm ps-c-tertiary' }, p.title), p.body ? h('p', { className: 'ps-t-body-md ps-c-placeholder' }, p.body) : null));
  };

  /* CouponRow: a coupon line on the loan page · type · title · sub (green when on) · on · onClick */
  PS.CouponRow = function CouponRow(p) {
    return h(m.button, { type: 'button', className: PS.cx('ps-crow', p.on && 'is-on'), onClick: p.onClick, whileTap: PS.TAP, 'aria-pressed': !!p.on },
      h('span', { className: 'ps-crow__main' }, h(PS.CouponArt, { type: p.type, size: 36 }),
        h('span', { className: 'ps-crow__text' }, h('span', { className: 'ps-t-label-md-light ps-ellipsis' }, p.title),
          h('span', { className: PS.cx('ps-crow__sub', p.on ? 'ps-t-label-sm-light' : 'ps-t-caption-sm') }, h(PS.Swap, { k: p.sub }, p.sub)))),
      h(PS.Check, { on: p.on }));
  };

  /* Summary: total payment + what the coupons do · total · was (before coupons; hidden when equal) · saved (hidden when 0) · newLimit (hidden when null)
     onConfirm · label ('Confirm'). Fields of a coupon that isn't used are hidden. */
  PS.Summary = function Summary(p) {
    var chips = [];
    if (p.saved > 0) chips.push(h(m.span, { key: 's', layout: 'position', initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: PS.T.pop },
      h(PS.Chip, { tone: 'positive' }, 'Saved ' + PS.money(p.saved, p.saved % 1 ? 2 : 0))));
    if (p.newLimit) chips.push(h(m.span, { key: 'l', layout: 'position', initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: PS.T.pop },
      h(PS.Chip, { tone: 'brand' }, 'New limit ' + PS.money(p.newLimit, 0))));
    return h(m.div, { className: 'ps-summary ps-bubble', layout: true, transition: PS.T.layout },
      h(m.div, { layout: 'position', className: 'ps-summary__total' }, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.title || 'Total payment'),
        h('div', null, h(PS.Swap, { k: p.total }, h(PS.Amount, { value: p.total })),
          p.was != null && Math.abs(p.was - p.total) > 0.004 ? h(PS.Amount, { value: p.was, strike: true }) : null)),
      h(AP, { initial: false }, chips.length ? h(m.div, { key: 'c', className: 'ps-summary__chips', initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: PS.T.layout },
        h(AP, { initial: false, mode: 'popLayout' }, chips)) : null),
      h(m.div, { layout: 'position' }, h(PS.Button, { block: true, onClick: p.onConfirm }, p.label || 'Confirm')));
  };

  /* CouponPicker: the content of a page sheet (PS.Sheet kind="page") · tabs · tab · onTab · onClose · intro (rule line)
     loan ('₱45,000.00 · 6 terms') · children (the list of the current tab) · summary (node, e.g. PS.Summary) */
  PS.CouponPicker = function CouponPicker(p) {
    var order = p.tabs.map(function (t) { return t.id; }), prev = R.useRef(p.tab), dir = order.indexOf(p.tab) >= order.indexOf(prev.current) ? 1 : -1;
    R.useEffect(function () { prev.current = p.tab; }, [p.tab]);
    return h(R.Fragment, null,
      h('div', { className: 'ps-sheet__head' }, h(PS.Tabs, { items: p.tabs, value: p.tab, onChange: p.onTab, glass: true, id: 'ps-picker', className: 'ps-grow' }), h(PS.Close, { onClick: p.onClose })),
      h('div', { className: 'ps-sheet__body' },
        h('div', { className: 'ps-picker__intro' }, p.intro ? h('p', { className: 'ps-t-body-md' }, p.intro) : null,
          p.loan ? h('div', { className: 'ps-picker__loan' }, h('span', { className: 'ps-t-body-md ps-c-tertiary' }, p.loanLabel || 'Your loan'), h('span', { className: 'ps-t-label-md' }, p.loan)) : null),
        h(AP, { initial: false, mode: 'popLayout', custom: dir },
          h(m.div, { key: p.tab, custom: dir, className: 'ps-list', variants: { a: function (d) { return { opacity: 0, x: 24 * d }; }, b: { opacity: 1, x: 0 }, c: function (d) { return { opacity: 0, x: -24 * d }; } },
            initial: 'a', animate: 'b', exit: 'c', transition: PS.T.ui }, p.children))),
      p.summary ? h('div', { className: 'ps-sheet__foot' }, p.summary) : null);
  };

  /* Decision: the "Keep your coupon?" card sheet (PS.Sheet kind="card") · art (coupon type) · title · body · facts [{ label, value, tone: positive }]
     primary { label, onClick } · secondary { label, onClick } · onClose */
  PS.Decision = function Decision(p) {
    return h('div', { className: 'ps-decide' },
      h('div', { className: 'ps-decide__close' }, h(PS.Close, { onClick: p.onClose })),
      h('div', { className: 'ps-decide__body' },
        h(PS.CouponArt, { type: p.art, size: 80 }),
        h('div', { className: 'ps-decide__text' }, h('p', { className: 'ps-t-title-sm' }, p.title), p.body ? h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.body) : null),
        p.facts ? h('div', { className: 'ps-decide__facts' }, p.facts.map(function (f, i) {
          return h('div', { key: i }, h('span', { className: 'ps-t-caption-sm ps-c-tertiary' }, f.label),
            h('span', { className: PS.cx('ps-t-label-md', f.tone === 'positive' ? 'ps-c-positive' : 'ps-c-secondary') }, f.value));
        })) : null),
      h('div', { className: 'ps-decide__acts' },
        h(PS.Button, { block: true, onClick: p.primary.onClick }, p.primary.label),
        p.secondary ? h(PS.Button, { variant: 'text', block: true, onClick: p.secondary.onClick }, p.secondary.label) : null));
  };
})();
