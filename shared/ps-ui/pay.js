/* PeraSure UI — repayments: the installment card, the total bar, the scam strip, the repayment card (amount + how to pay),
   the QR panel, an accordion and the method picker. Needs core.js. Figma: app file barda5NcnFzxG7CHtISKsW, section Payment. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* ScamStrip: the blue line under the header; the text runs sideways when it doesn't fit · children · onClick */
  PS.ScamStrip = function ScamStrip(p) {
    return h(m.button, Object.assign({ type: 'button', className: 'ps-scamstrip', onClick: p.onClick }, PS.press()),
      h(PS.Icon, { name: 'info', size: 16 }), h('span', { className: 'ps-scamstrip__clip' }, h('span', { className: 'ps-scamstrip__run ps-t-caption-sm' }, p.children)));
  };
  /* Installment: one repayment (328 × 114) · month ('JAN') · day ('15') · amount · sub ('Overdue 18 days') · tone negative | brand (date tile and sub)
     on (ticked: part of what is paid now) · onToggle · note (footer line) · noteIcon (12 px) · onDetail */
  PS.Installment = function Installment(p) {
    var neg = p.tone === 'negative';
    return h(PS.Card, { className: PS.cx('ps-inst', neg && 'is-negative') },
      h(m.button, Object.assign({ type: 'button', role: 'checkbox', 'aria-checked': !!p.on, className: 'ps-inst__top', onClick: p.onToggle }, PS.press()),
        h('span', { className: 'ps-inst__date' }, h('span', null, p.month), h('b', null, p.day)),
        h('span', { className: 'ps-inst__main' }, h(PS.Amount, { value: p.amount, className: 'ps-inst__amount' }), h('span', { className: 'ps-inst__sub' }, p.sub)),
        h(PS.Check, { on: p.on, off: !p.on })),
      h(PS.Divider),
      h('div', { className: 'ps-inst__foot' }, h('i', null, h(PS.Icon, { name: p.noteIcon || 'alert-circle', size: 12, color: 'tertiary' })), h('span', { className: 'ps-t-caption-xs ps-c-tertiary' }, p.note),
        h(PS.Link, { onClick: p.onDetail, className: 'ps-inst__detail' }, 'Detail', h(PS.Icon, { name: 'chevron-right', size: 12 }))));
  };
  /* PayBar: the total above the tab bar · label · total · was · action ('Repay') · onPay · disabled */
  PS.PayBar = function PayBar(p) {
    return h('div', { className: 'ps-paybar' }, h('div', null, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.label || 'TOTAL REPAYMENT AMOUNT'),
        h('p', { className: 'ps-paybar__amt' }, h(PS.Amount, { value: p.total }), p.was != null ? h(PS.Amount, { value: p.was, strike: true }) : null)),
      h(PS.Button, { size: 'sm', disabled: p.disabled, onClick: p.onPay }, p.action || 'Repay'));
  };
  /* RepayCard: what to pay · amount · due ('December 12, 2026') · onCopy · children (how: a button, the reference rows, a QR panel) */
  PS.RepayCard = function RepayCard(p) {
    return h(PS.Card, { className: 'ps-repay' },
      h('div', { className: 'ps-repay__head' }, h(PS.Amount, { value: p.amount, className: 'ps-repay__amount' }), h(PS.Button, { variant: 'outline', onClick: p.onCopy }, 'Copy')),
      h('p', { className: 'ps-t-body-md ps-repay__due' }, 'Due date: ' + p.due), p.children);
  };
  /* InsetRows: label / value rows on the grey inset (payment number, sender) · rows [{ label, value }] */
  PS.InsetRows = function InsetRows(p) {
    return h('div', { className: 'ps-insetrows' }, p.rows.map(function (r, i) {
      return h(R.Fragment, { key: i }, i ? h(PS.Divider) : null, h(PS.KV, { label: r.label, value: r.value }));
    }));
  };
  /* Countdown line: "Please complete your repayment in 04:59." · seconds */
  PS.PayTimer = function PayTimer(p) {
    var s = R.useState(p.seconds || 299), left = s[0];
    R.useEffect(function () { if (left <= 0) return; var t = setTimeout(function () { s[1](left - 1); }, 1000); return function () { clearTimeout(t); }; }, [left]);
    var mm = Math.floor(left / 60), ss = left % 60;
    return h('p', { className: 'ps-t-caption-sm ps-c-tertiary ps-paytimer' }, 'Please complete your repayment in ', h('b', null, (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss), '.');
  };
  /* QrPanel: the brand panel with the QR · title · merchant · onSave */
  PS.QrPanel = function QrPanel(p) {
    return h('div', { className: 'ps-qr' }, h('div', { className: 'ps-qr__head ps-t-body-md-em' }, h('span', null, p.title || 'Pay to Merchant'), h('b', null, p.merchant)),
      h('div', { className: 'ps-qr__code' }, h('img', { src: PS.asset('art/qr.png'), alt: 'QR code' })),
      h(PS.Button, { variant: 'inverse', size: 'md', className: 'ps-qr__save', onClick: p.onSave }, h(PS.Icon, { name: 'upload', size: 20 }), 'Save QR code'));
  };
  /* Accordion: a card that opens · title · open (first state) · children */
  PS.Accordion = function Accordion(p) {
    var s = R.useState(!!p.open), open = s[0];
    return h(PS.Card, { className: 'ps-acc' },
      h(m.button, Object.assign({ type: 'button', className: 'ps-acc__head', 'aria-expanded': open, onClick: function () { s[1](!open); } }, PS.press()),
        h('span', { className: 'ps-t-body-md-em' }, p.title),
        h(m.span, { style: { display: 'flex' }, initial: false, animate: { rotate: open ? -90 : 90 }, transition: MT.SPRING }, h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }))),
      h(AP, { initial: false }, open ? h(m.div, { key: 'b', className: 'ps-acc__body', initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1, transition: { height: MT.SPRING, opacity: MT.ENTER } },
        exit: { height: 0, opacity: 0, transition: { height: MT.SPRING, opacity: MT.LEAVE } } }, h('div', { className: 'ps-acc__in ps-t-body-md ps-c-tertiary' }, p.children)) : null));
  };
  /* MethodPicker: categories on a rail + the methods of each · cats [{ id, icon, label, groups: [{ title, tag, items: [{ id, name }] }] }] · value (cat) · onCat · onPick(item) */
  PS.MethodPicker = function MethodPicker(p) {
    var cat = p.cats.filter(function (c) { return c.id === p.value; })[0] || p.cats[0];
    return h('div', { className: 'ps-mpick' },
      h('div', { className: 'ps-mpick__rail', role: 'tablist' }, p.cats.map(function (c) {
        var on = c === cat;
        return h('button', { key: c.id, type: 'button', role: 'tab', 'aria-selected': on, className: PS.cx('ps-mpick__cat', on && 'is-on'), onClick: function () { p.onCat(c.id); } },
          h(PS.Icon, { name: c.icon, size: 24 }), h('span', null, c.label));
      })),
      h(PS.Crossfade, { k: cat.id, className: 'ps-mpick__pane' }, h('div', { className: 'ps-mpick__list' }, cat.groups.map(function (g, i) {
        return h('div', { key: i, className: 'ps-mpick__group' },
          h('div', { className: 'ps-mpick__title' }, h('span', { className: 'ps-t-title-14' }, g.title), g.tag ? h(PS.Tag, { tone: 'positive' }, g.tag) : null),
          g.items.map(function (it) {
            return h(m.button, Object.assign({ key: it.id, type: 'button', className: 'ps-mpick__row ps-t-body-md-em', onClick: function () { p.onPick(it, cat); } }, PS.press()), h('span', null, it.name),
              h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }));
          }));
      }))));
  };
  /* Pager: the dots under a carousel · n · i */
  PS.Pager = function Pager(p) {
    var d = []; for (var i = 0; i < p.n; i++) d.push(h('i', { key: i, className: i === p.i ? 'is-on' : null }));
    return h('div', { className: 'ps-pager', 'aria-hidden': true }, d);
  };
})();
