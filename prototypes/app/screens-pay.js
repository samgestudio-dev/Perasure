/* PeraSure app — repayments: the Payment tab, payment detail, the anti-scam cards, choosing how to pay and the pay page.
   Figma section "Payment": 52:7925 / 52:7947 index, 52:7678 empty, 52:7683 logged out, 52:7194… anti-scams,
   52:7763 methods, 52:7693 transfer, 52:7714 app, 52:7733 QR code. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, AD = window.AD, CS = window.CS, h = R.createElement, m = PS.m, money = PS.money;

  function dues(S) { return S.repay ? AD.dues : []; }      /* the current loan's payments that are still to make */
  function startPay(total) {
    var next = function () { APP.open('paymethods', { total: total }); };
    if (!APP.S.seenScam) APP.open('scams', { then: next }); else next();
  }

  APP.tabs.payment = function Payment() {
    var S = APP.use(), list = dues(S), s = R.useState(null), sel = s[0] || list.filter(function (d, i) { return d.late || i === 0; }).map(function (d) { return d.id; });
    function toggle(id) { s[1](sel.indexOf(id) >= 0 ? sel.filter(function (x) { return x !== id; }) : sel.concat([id])); }
    var total = list.filter(function (d) { return sel.indexOf(d.id) >= 0; }).reduce(function (a, d) { return a + d.amount + (d.penalty || 0); }, 0);
    var late = list.filter(function (d) { return d.late; }), soon = list.filter(function (d) { return !d.late; }), body;
    /* the card's footer line, by stage (owner, 2026-11-23): before the due date the loan's date; on the due date the last day without a penalty;
       1–2 days late "pay now"; on the last day without a penalty "pay by 11:59 PM"; after it, the penalty included */
    function note(d) {
      var pen = money(CS.current.penalty);
      if (d.penalty) return 'Includes ' + money(d.penalty) + ' penalty';
      if (d.late >= CS.loan.grace) return 'Pay by 11:59 PM to avoid a ' + pen + ' penalty';
      if (d.late) return 'Pay now to avoid a ' + pen + ' penalty';
      if (d.today) return 'It\'s your due date. No penalty until ' + d.graceEnd;
      return 'Loan from ' + d.loanShort;
    }
    function card(d) {
      return h(PS.Installment, { key: d.id, month: d.month, day: d.day, amount: d.amount + (d.penalty || 0), tone: d.late ? 'negative' : d.today ? 'brand' : 'default', on: sel.indexOf(d.id) >= 0, onToggle: function () { toggle(d.id); },
        sub: d.late ? 'Overdue ' + d.late + ' day' + (d.late === 1 ? '' : 's') : d.badge, note: note(d), noteIcon: d.late ? 'info' : 'order',
        onDetail: function () { APP.open('paydetail', { id: d.id }); } });
    }
    if (!APP.signedIn()) body = h(PS.GuestPay, { onLogin: function () { APP.go('login'); } });
    else body = h(APP.Loaded, { k: 'payment', className: list.length ? 'app-stack-20' : null }, list.length ? [
        h(PS.ScamStrip, { key: 's', onClick: function () { APP.open('scams', {}); } }, 'Beware of scams. Contact in‑app customer service to verify transaction requests from outside the app.'),
        late.length ? h('div', { key: 'l', className: 'app-stack-8' }, h(PS.SectionLabel, { tone: 'negative' }, 'OVERDUE'), h('div', { className: 'app-stack-12' }, late.map(card))) : null,
        soon.length ? h('div', { key: 'u', className: 'app-stack-8' }, h(PS.SectionLabel, null, 'UPCOMING'), h('div', { className: 'app-stack-12' }, soon.map(card))) : null]
      : h(PS.EmptyState, { title: 'Nothing to repay right now', body: 'Your upcoming repayments will appear here.', page: true }));
    return h(PS.Screen, { colBottom: list.length ? 196 : 120, top: { flat: true, left: h(PS.Glass, { round: false }, 'Payment'), right: [APP.tune(), h(PS.Glass, { key: 'h', icon: 'headset', label: 'Contact us', onClick: APP.support })] },
      overlay: list.length && APP.signedIn() ? h(PS.PayDock, null, h(PS.PayBar, { total: total, disabled: !total, onPay: function () { startPay(total); } })) : null }, body);
  };

  /* Payment detail: what one repayment is made of */
  APP.sheet('paydetail', { kind: 'plain', label: 'Payment detail', className: 'ps-sheet--inset', render: function Detail(p) {
    var d = AD.dues.filter(function (x) { return x.id === p.params.id; })[0] || AD.dues[0];
    return h(R.Fragment, null,
      h(PS.SheetHead, { title: 'Payment detail', type: 'ps-t-title-16', onClose: APP.close }),
      h(PS.Card, { className: 'ps-details' }, h(PS.Rows, { rows: [{ label: 'Payment amount', value: money(d.amount + (d.penalty || 0)) }, { label: 'Instalment due date', value: d.due }, { label: 'Loan date', value: d.loanDate },
        { label: 'Coupon', value: d.coupon ? '-' + money(d.coupon) : null, tone: 'positive' }, { label: 'Interest', value: money(d.interest) }, { label: 'Late payment fee', value: money(d.penalty || 0) },
        { label: 'Overdue', value: h(PS.InfoButton, { onClick: function (e) { APP.showPenalty(e.currentTarget.lastChild); } }, (d.late || 0) + ' days') }]
        .filter(function (r) { return r.value != null; }) })));
  } });

  /* Anti-scam: three cards, once before the first payment (and from the strip) */
  /* Anti-scam: three cards, once before the first payment (and from the strip) — swiped left / right or moved on with Next; the sheet keeps
     the height of its tallest card, and the dots follow the swipe (owner) */
  APP.sheet('scams', { kind: 'card', label: 'Protect yourself from scams', className: 'ps-scams', render: function Scams(p) {
    var s = R.useState(0), i = s[0], last = i === AD.scams.length - 1;
    function next() { if (!last) { s[1](i + 1); return; } APP.set({ seenScam: true, sheet: null }); if (p.params.then) setTimeout(p.params.then, 260); }
    return h(PS.ScamTips, { cards: AD.scams, index: i, onIndex: s[1], onNext: next, onClose: APP.close });
  } });

  /* How to pay: categories on the left, methods on the right */
  var CATS = [
    { id: 'qr', icon: 'qr-code', label: 'QR Code', groups: [{ title: 'Direct App Pay', tag: 'Recommend', items: [{ id: 'gcash-app', name: 'GCash', kind: 'app' }] },
      { title: 'QR Code', tag: 'Recommend', items: [{ id: 'gcash-qr', name: 'GCash', kind: 'qr' }, { id: 'maya-qr', name: 'Maya', kind: 'qr' }, { id: 'bpi-qr', name: 'BPI', kind: 'qr' }] }] },
    { id: 'bill', icon: 'receipt', label: 'Bill Payment', groups: [{ title: 'Bills Payment', items: [{ id: 'gcash-bill', name: 'GCash', kind: 'transfer' }, { id: 'maya-bill', name: 'Maya', kind: 'transfer' }, { id: 'shopee-bill', name: 'ShopeePay', kind: 'transfer' }] }] },
    { id: 'online', icon: 'smartphone', label: 'Online Transfer', groups: [{ title: 'Online Transfer', items: [{ id: 'bdo-on', name: 'BDO Online', kind: 'transfer' }, { id: 'ub-on', name: 'UnionBank Online', kind: 'transfer' }] }] },
    { id: 'bank', icon: 'bank', label: 'Bank Transfer', groups: [{ title: 'Bank Transfer', items: [{ id: 'bpi-b', name: 'BPI', kind: 'transfer' }, { id: 'mb-b', name: 'Metrobank', kind: 'transfer' }, { id: 'lb-b', name: 'Landbank', kind: 'transfer' }] }] },
    { id: 'offline', icon: 'store', label: 'Offline Payment', groups: [{ title: 'Over the counter', items: [{ id: '711', name: '7-Eleven', kind: 'transfer' }, { id: 'ceb', name: 'Cebuana Lhuillier', kind: 'transfer' }] }] }];
  /* How to pay (Figma DS 7792:15391): a tall white sheet — search and close over its top, then the rail and every way to pay in one list */
  APP.sheet('paymethods', { kind: 'page', label: 'Choose how to pay', className: 'ps-sheet--white', render: function Methods(p) {
    var s = R.useState(''), q = s[0], c = R.useState('qr'), k = q.trim().toLowerCase(), body = R.useRef(null);
    var any = !k || CATS.some(function (x) { return x.groups.some(function (g) { return g.items.some(function (it) { return it.name.toLowerCase().indexOf(k) >= 0; }); }); });
    return h(PS.SearchSheet, { tone: 'white', value: q, onChange: s[1], placeholder: 'Search payment method', onClose: APP.close, bodyRef: body },
      any ? h(PS.MethodPicker, { cats: CATS, q: k, value: c[0], onCat: c[1], scroller: body,
        onPick: function (it) { APP.close(); APP.run(function () { APP.go('pay', { total: p.params.total, method: it }); }); } })
        : h(PS.EmptyState, { title: 'No repayment method found', style: { marginTop: '4.5rem' } }));
  } });

  /* The pay page: the amount, then the way to pay it (app, reference number, or QR code) */
  APP.screen('pay', function Pay(p) {
    var mt = p.params.method || { name: 'GCash', kind: 'app' }, d0 = AD.dues[0], total = p.params.total || (d0 ? d0.amount : 2000), how;
    function copy() { APP.say('Copied ' + money(total) + '.'); }
    if (mt.kind === 'app') how = [h(PS.Button, { key: 'b', block: true, onClick: function () { APP.say(mt.name + ' opens outside the test app.'); } }, 'Open ' + mt.name), h(PS.PayTimer, { key: 't' })];
    else if (mt.kind === 'qr') how = [h('p', { key: 'n', className: 'ps-t-caption-sm ps-repay__note' }, 'Refresh the page to get a new code when this one expires.'),
      h(PS.QrPanel, { key: 'q', merchant: 'Payso', onSave: function () { APP.say('Saved the QR code to your photos.'); } }), h(PS.PayTimer, { key: 't' })];
    else how = h(PS.InsetRows, { rows: [{ label: 'Payment No.', value: AD.payNo }, { label: 'Sender’s name', value: AD.user.name }] });
    return h(APP.Page, { title: 'Payment', load: 'pay-' + mt.kind },
      h(PS.Section, { label: 'TOTAL REPAYMENT' }, h(PS.RepayCard, { amount: total, due: d0 ? d0.due : 'December 12, 2026', onCopy: copy }, how)),
      h(PS.Accordion, { title: (mt.kind === 'transfer' ? 'Payment' : 'Repayment') + ' example (' + mt.name + ')', open: mt.kind === 'app' },
        '1. Open the ' + mt.name + ' app and tap "Pay Bills".\n2. Select "Loans" and find "PeraSure".\n3. Enter the exact amount and your payment number.\n4. Confirm the payment.'));
  });
})();
