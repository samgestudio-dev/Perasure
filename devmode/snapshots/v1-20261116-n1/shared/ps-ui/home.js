/* PeraSure UI — home cards: credit card, next payment, coupons for your next loan (two / one / none), trust card,
   partner logos, legal footer. Needs core.js (and coupon.js for the coupon pictures). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* HomeHeader: the brand header row content · actions: [{ icon, label, onClick }] in one frosted pill */
  PS.HomeActions = function HomeActions(p) {
    return h('div', { className: 'ps-glass', role: 'group' }, (p.actions || []).map(function (a) {
      return h(m.button, { key: a.icon, type: 'button', 'aria-label': a.label, onClick: a.onClick, whileTap: PS.TAP_ICON, transition: PS.MT.PRESS, style: { display: 'flex' } },
        h(PS.Icon, { name: a.icon, size: 20, color: 'primary' }));
    }));
  };

  /* CreditCard: available amount on the brand card · available · total · temporary (+ temporaryUntil) · onWithdraw · onInfo
     label ('Available amount') · action ('Withdraw')
     With temporary credit: the two-line legend and the white + green bar (the Withdraw demo's card). Without (Figma 10789:29220): one line,
     "Total credit:" with the amount, and the white bar alone; the card is as tall as its content (186 here). */
  PS.CreditCard = function CreditCard(p) {
    var tot = p.total || 1, temp = p.temporary || 0;
    var white = Math.max(0, Math.min(100, (p.available - temp) / tot * 100)), green = Math.max(0, Math.min(100 - white, temp / tot * 100));
    var bar = h('div', { className: 'ps-credit__bar', 'aria-hidden': true }, h('i', { style: { width: white + '%' } }), temp ? h('i', { style: { width: green + '%' } }) : null);
    return h('div', { className: PS.cx('ps-credit', !temp && 'ps-credit--one', p.className) },
      h('img', { className: 'ps-credit__glow', src: PS.asset('art/card-glow.svg'), alt: '' }),
      h('div', { className: 'ps-credit__top' },
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('p', { className: 'ps-credit__label' }, p.label || 'Available amount'),
          h(PS.Amount, { value: p.available, className: 'ps-credit__amount' })),
        h(m.button, { type: 'button', 'aria-label': 'About your credit', onClick: p.onInfo, whileTap: PS.TAP_ICON, transition: PS.MT.PRESS, style: { height: '1.25rem' } },
          h(PS.Icon, { name: 'info', size: 20, color: 'inverse', style: { opacity: 0.6 } }))),
      temp ? h('div', { className: 'ps-credit__legend ps-t-caption-sm' },
          h('p', null, h('i', { className: 'ps-credit__dot' }), h('span', null, 'Total credit: ' + PS.money(tot, 0))),
          h('p', null, h('i', { className: 'ps-credit__dot ps-credit__dot--temp' }),
            h('span', null, 'Temporary: ' + PS.money(temp, 0) + (p.temporaryUntil ? ' (included, valid until ' + p.temporaryUntil + ')' : ''))),
          bar)
        : h('div', { className: 'ps-credit__one' },
          h('p', null, h('span', { className: 'ps-t-section-sm-light' }, 'Total credit: '), h(PS.Amount, { value: tot, className: 'ps-credit__total' })),
          bar),
      h(PS.Button, { variant: 'shade', onClick: p.onWithdraw }, p.action || 'Withdraw'));
  };
  /* PaymentCard: next repayment · amount · was (struck-through original, optional) · due (date text) · badge ('Due in 45 days')
     onPay · payLabel (default 'Pay ₱800 now') · title ('Next payment') · overdue (red badge)
     notice { title, body, onHelp }: the overdue layout — due date under the amount, the penalty box, a full-width button */
  PS.PaymentCard = function PaymentCard(p) {
    var head = h('div', { className: 'ps-payment__head' }, h('p', { className: 'ps-t-section-sm' }, p.title || 'Next payment'),
      p.badge ? h(PS.Tag, { tone: p.overdue ? 'negative' : 'soft' }, p.badge) : null);
    var amt = h('div', { className: 'ps-payment__amt' }, h(PS.Amount, { value: p.amount }), p.was != null ? h(PS.Amount, { value: p.was, strike: true }) : null);
    var due = h('p', { className: 'ps-payment__date ps-t-body-md' }, h(PS.Icon, { name: 'calendar', size: 16, color: 'secondary' }), p.notice ? 'Due ' + p.due : p.due);
    if (p.notice) return h(PS.Card, { variant: 'outline', raised: true, className: 'ps-payment ps-payment--stack' }, head,
      h('div', { className: 'ps-payment__sum' }, amt, due),
      h('div', { className: 'ps-payment__note' }, h('p', null, p.notice.title), h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.notice.body),
        p.notice.onHelp ? h(m.button, Object.assign({ type: 'button', 'aria-label': 'How penalties work', onClick: function (e) { p.notice.onHelp(e.currentTarget); } }, PS.press(true)),
          h(PS.Icon, { name: 'help-circle', size: 16, color: 'tertiary' })) : null),
      h(PS.Button, { block: true, size: 'md', onClick: p.onPay }, p.payLabel || 'Pay now'));
    return h(PS.Card, { variant: 'outline', raised: true, className: 'ps-payment' }, head, amt,   /* default shadow (owner) */
      h(PS.Divider),
      h('div', { className: 'ps-payment__foot' },
        h('div', { className: 'ps-payment__due' }, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'Due date'), due),
        h(PS.Button, { size: 'sm', onClick: p.onPay }, p.payLabel || 'Pay ' + PS.money(p.amount, p.amount % 1 ? 2 : 0) + ' now')));
  };

  /* HomeCoupons: "Coupons for your next loan" (Figma 10750:62557 two, 10750:61878 one) · coupons [{ type: percent | amount | limit,
     value: '50% OFF', until: 'Until Nov 11, 2026', kind: 'Credit limit', label: 'Borrow more than ₱20,000', cond: 'Any term' }]
     onOpen · title · layout auto | pair | one. Two or more → the pair (first two); one → the wide card with the folder tab; none → nothing. */
  PS.HomeCoupons = function HomeCoupons(p) {
    var list = p.coupons || [], title = p.title || 'Coupons for your next loan';
    if (!list.length) return null;
    var one = p.layout === 'one' || (p.layout !== 'pair' && list.length === 1);
    var press = Object.assign({ role: 'button', tabIndex: 0, 'aria-label': title, onClick: p.onOpen,
      onKeyDown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (p.onOpen) p.onOpen(); } } }, PS.press());
    if (one) {
      var c = list[0];
      return h(m.div, Object.assign({ className: 'ps-card ps-hcone' }, press),
        h('div', { className: 'ps-hcone__head' },
          h('p', { className: 'ps-hcone__title ps-t-section-sm' }, title),
          h('div', { className: 'ps-hcone__tabs' }, h('img', { className: 'ps-hcone__curve', src: PS.asset('art/tab-connector.svg'), alt: '' }), h('span', { className: 'ps-hcone__tab' }))),
        h('div', { className: 'ps-hcone__panel' },
          h(PS.CouponArt, { type: c.type, size: 80, className: 'ps-hcone__art' }),
          h('div', { className: 'ps-hcone__in' },
            h('div', { className: 'ps-hcone__lead' }, h('p', { className: 'ps-hcone__value' }, c.value),
              h('p', { className: 'ps-t-section-xs ps-c-tertiary', style: { textTransform: 'uppercase' } }, c.kind)),
            h(PS.Divider, { vertical: true, dashed: true }),
            h('div', { className: 'ps-hcone__body' }, h('p', { className: 'ps-t-label-md-light ps-c-secondary' }, c.label),
              h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, c.cond)))));
    }
    return h(PS.Card, Object.assign({ as: m.div, variant: 'outline', className: 'ps-hcoupons' }, press),
      h('div', { className: 'ps-hcoupons__title' }, h('p', { className: 'ps-t-section-sm' }, title)),
      h('div', { className: 'ps-hcoupons__pair' }, list.slice(0, 2).map(function (c, i) {
        return h('div', { key: i, className: 'ps-hcoupon' }, h('div', { className: 'ps-hcoupon__in' },
          h(PS.CouponArt, { type: c.type, size: 40, className: 'ps-hcoupon__art' }),
          h('p', { className: 'ps-hcoupon__value' }, c.value), h('p', { className: 'ps-t-caption-xs ps-c-tertiary' }, c.until)));
      })));
  };

  /* partner logos (Figma Home, frame 10730:58735): width, optional inner box, parts as [file, top, right, bottom, left] insets */
  var PARTNERS = [
    { w: 64.814, parts: [['dbp', '0%', '0%', '0%', '0%']] },
    { w: 124.288, parts: [['eastwest', '0%', '0%', '0%', '0%']] },
    { w: 67.31, parts: [['gcash', '0%', '0%', '0%', '0%']] },
    { w: 57.216, box: [3.58, 1, 50.064, 14], parts: [['aub-a', '0.28%', '0.49%', '0.38%', '7.54%'], ['aub-b', '2.92%', '66.78%', '1.52%', '0.39%']] },
    { w: 55.637, box: [4.64, 2.67, 46.364, 13.333], parts: [['maya', '0%', '0%', '0%', '0%']] },
    { w: 36.364, parts: [['v1', '18.49%', '40.26%', '25.15%', '38.74%'], ['v2', '18.49%', '16.05%', '25.12%', '62.73%'], ['v3', '18.49%', '6.25%', '25.15%', '86.89%'], ['vg', '0%', '67.8%', '12.5%', '6.25%']] },
    { w: 62.713, parts: [['g1', '0%', '0%', '0%', '0%']] },
    { w: 61.519, parts: [['f', '0%', '0%', '0%', '0%']] }
  ];
  function logo(L, k) {
    var imgs = L.parts.map(function (q) {
      return h('img', { key: q[0], src: PS.asset('logos/partner-' + q[0] + '.svg'), alt: '', style: { top: q[1], left: q[4], width: 'calc(100% - ' + q[4] + ' - ' + q[2] + ')', height: 'calc(100% - ' + q[1] + ' - ' + q[3] + ')' } });
    });
    var inner = L.box ? h('div', { style: { position: 'absolute', left: L.box[0], top: L.box[1], width: L.box[2], height: L.box[3] } }, imgs) : imgs;
    return h('div', { key: k, className: 'ps-logo', style: { width: L.w } }, inner);
  }
  /* PartnerLogos: the bank and wallet logos, scrolling slowly (still with reduced motion) */
  /* the strip runs on its own compositor animation, started once when it appears. It was a Motion `animate` prop: every redraw of the home
     page (any change in the app: a toast, a tooltip, the sheet's state…) handed it a new target and it started over from 0, so on a busy
     page it seemed to stand still (owner: "the partner logos often don't move") */
  PS.PartnerLogos = function PartnerLogos() {
    var L = PARTNERS.reduce(function (s, x) { return s + x.w + 24; }, 0), track = R.useRef(null);
    R.useEffect(function () {
      var el = track.current; if (!el || PS.reduce || !el.animate) return;
      var a = el.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(' + (-L) + 'px)' }], { duration: L / 28 * 1000, iterations: Infinity, easing: 'linear' });
      return function () { a.cancel(); };
    }, []);
    var row = PARTNERS.map(function (x, i) { return logo(x, 'a' + i); }).concat(PARTNERS.map(function (x, i) { return logo(x, 'b' + i); }));
    return h('div', { className: 'ps-marquee', 'aria-label': 'DBP, EastWest Bank, GCash, AUB, Maya and other partners' },
      h('div', { ref: track, className: 'ps-marquee__track' }, row));
  };
  /* TrustCard: "Made for Filipinos", the NPC and SEC tiles and the partner logos · kicker · title */
  PS.TrustCard = function TrustCard(p) {
    return h(PS.Card, { variant: 'outline', className: 'ps-trust' },
      h('div', { className: 'ps-trust__hero ps-inset' },
        h('img', { className: 'ps-trust__laurel', src: PS.asset('art/laurel-left.png'), alt: '' }),
        h('div', { className: 'ps-trust__mid' },
          h('div', { style: { textAlign: 'center' } }, h('p', { className: 'ps-t-section-sm ps-c-secondary' }, p.kicker || 'A trusted choice'),
            h('p', { className: 'ps-t-title-md ps-c-brand' }, p.title || 'Made for Filipinos')),
          h('div', { className: 'ps-trust__faces' }, h('img', { src: PS.asset('art/avatars.png'), alt: '' }))),
        h('img', { className: 'ps-trust__laurel', src: PS.asset('art/laurel-right.png'), alt: '' })),
      h('div', { className: 'ps-trust__tiles' },
        h('div', { className: 'ps-trust__tile ps-inset' },
          h('div', { className: 'ps-trust__logo' }, h('div', null, h('span', { className: 'ps-trust__npc', style: { '--ps-src': 'url("' + PS.asset('logos/npc.png') + '")' } }))),
          h('p', { className: 'ps-t-caption-sm' }, 'National Privacy Commission')),
        h('div', { className: 'ps-trust__tile ps-inset' },
          h('div', { className: 'ps-trust__logo' }, h('div', null, h('div', { className: 'ps-trust__sec' },
            h('img', { src: PS.asset('logos/sec-shape.svg'), alt: '' }), h('span', null, 'SEC Registration')))),
          h('p', { className: 'ps-t-caption-sm' }, 'SEC-licensed, with bank-level security'))),
      h(PS.PartnerLogos));
  };

  /* Legal: the company lines at the bottom of home · lines (first one bold) */
  PS.Legal = function Legal(p) {
    var lines = p.lines || ['SULIT LENDING CORPORATION', 'SEC Registration No. 2020100002616-03', 'Certificate of Authority to Operate as a Financing/Lending Company No.3333'];
    return h('div', { className: 'ps-legal ps-t-caption-xs' }, lines.map(function (l, i) {
      return h('p', { key: i, className: i ? null : 'ps-t-section-xs' }, l);
    }));
  };
})();
