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
    function card(d) {
      return h(PS.Installment, { key: d.id, month: d.month, day: d.day, amount: d.amount + (d.penalty || 0), tone: d.late ? 'negative' : d.today ? 'brand' : 'default', on: sel.indexOf(d.id) >= 0, onToggle: function () { toggle(d.id); },
        sub: d.late ? 'Overdue ' + d.late + ' days' : d.badge, note: d.penalty ? 'Includes ' + money(d.penalty) + ' penalty' : d.late >= CS.loan.grace ? 'No penalty if you pay today' : 'No penalty for 3 days after the due date', noteIcon: d.late ? 'info' : 'order',
        onDetail: function () { APP.open('paydetail', { id: d.id }); } });
    }
    if (!APP.signedIn()) body = h(PS.GuestPay, { onLogin: function () { APP.go('login'); } });
    else body = h(APP.Loaded, { k: 'payment', className: list.length ? 'app-stack-20' : null }, list.length ? [
        h(PS.ScamStrip, { key: 's', onClick: function () { APP.open('scams', {}); } }, 'Beware of scams. Contact in-app customer service to verify transaction requests from outside the app.'),
        late.length ? h('div', { key: 'l', className: 'app-stack-8' }, h(PS.SectionLabel, { tone: 'negative' }, 'OVERDUE'), h('div', { className: 'app-stack-12' }, late.map(card))) : null,
        soon.length ? h('div', { key: 'u', className: 'app-stack-8' }, h(PS.SectionLabel, null, 'UPCOMING'), h('div', { className: 'app-stack-12' }, soon.map(card))) : null]
      : h(PS.EmptyState, { title: 'Nothing to repay right now', body: 'Your upcoming repayments will appear here.', page: true }));
    return h(PS.Screen, { colBottom: list.length ? 196 : 120, top: { left: h(PS.Glass, { round: false }, 'Payment'), right: [APP.tune(), h(PS.Glass, { key: 'h', icon: 'headset', label: 'Contact us', onClick: APP.support })] },
      overlay: list.length && APP.signedIn() ? h(PS.PayDock, null, h(PS.PayBar, { total: total, disabled: !total, onPay: function () { startPay(total); } })) : null }, body);
  };

  /* ---- 短链 Short link (figma-lib 16; legacy 7792:14577 · 7869:20659 · 7981:12477 · 7986:12576): the page a repayment SMS link opens — no
     tab bar, the brand header with support, the loan's installments grouped by due date (InstallmentCard), the total and Repay; or one of three
     link states. ?page=shortlink&link=expired | nodue | done ---- */
  var LINK = { expired: ['The link has expired', 'If you have any questions, please contact our online customer service'],
    nodue: ['No payment due', 'There’s no payment due for this link right now.'], done: ['You’re all set', 'Your loan has been fully repaid. There’s nothing else you need to do.'] };
  APP.screen('shortlink', function ShortLink() {
    var st = APP.q.get('link'), list = AD.dues, s = R.useState(null), sel = s[0] || list.map(function (d) { return d.id; });
    function toggle(id) { s[1](sel.indexOf(id) >= 0 ? sel.filter(function (x) { return x !== id; }) : sel.concat([id])); }
    var total = list.filter(function (d) { return sel.indexOf(d.id) >= 0; }).reduce(function (a, d) { return a + d.amount + (d.penalty || 0); }, 0), groups = [], by = {};
    list.forEach(function (d) { if (!by[d.due]) { by[d.due] = { due: d.due, late: d.late, items: [] }; groups.push(by[d.due]); } by[d.due].items.push(d); });
    var empty = LINK[st] || (!list.length ? LINK.nodue : null);
    var body = empty ? h(PS.EmptyState, { title: empty[0], body: empty[1] }, h(PS.Button, { size: 'md', onClick: function () { APP.home('home'); } }, 'Get a loan'))   /* legacy 264 × 44 */
      : h('div', { className: 'app-stack-20' }, groups.map(function (g) {
          return h(PS.InstallmentCard, { key: g.due, due: g.due, badge: g.late ? 'Overdue' : g.items[0].badge, badgeTone: g.late ? 'negative' : 'positive',
            items: g.items.map(function (d) { return { id: d.id, amount: d.amount + (d.penalty || 0), date: d.loanDate, on: sel.indexOf(d.id) >= 0 }; }),
            onToggle: toggle, onOpen: function (id) { APP.open('paydetail', { id: id }); } }); }));
    return h(PS.Screen, { colBottom: empty ? 48 : 112, top: { left: h(PS.Brand), right: [APP.tune(), h(PS.Glass, { key: 'h', icon: 'headset', label: 'Contact us', onClick: APP.support })] },
      overlay: empty ? null : h(PS.PayDock, { alone: true }, h(PS.PayBar, { total: total, disabled: !total, onPay: function () { startPay(total); } })) }, body);
  });

  /* Payment detail: what one repayment is made of */
  APP.sheet('paydetail', { kind: 'plain', label: 'Payment detail', className: 'ps-sheet--inset', render: function Detail(p) {
    var d = AD.dues.filter(function (x) { return x.id === p.params.id; })[0] || AD.dues[0];
    return h(R.Fragment, null,
      h(PS.SheetHead, { title: 'Payment detail', type: 'ps-text-title-xs', onClose: APP.close }),
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
    var cats = !k ? CATS : CATS.map(function (x) { return Object.assign({}, x, { groups: x.groups.map(function (g) { return Object.assign({}, g, { items: g.items.filter(function (it) { return it.name.toLowerCase().indexOf(k) >= 0; }) }); })
      .filter(function (g) { return g.items.length; }) }); }).filter(function (x) { return x.groups.length; });
    return h(PS.SearchSheet, { tone: 'white', value: q, onChange: s[1], placeholder: 'Search payment method', onClose: APP.close, bodyRef: body },
      cats.length ? h(PS.MethodPicker, { cats: cats, value: c[0], onCat: c[1], scroller: body, q: k,
        onPick: function (it) { APP.close(); APP.run(function () { APP.go('pay', { total: p.params.total, method: it }); }); } })
        : h(PS.EmptyState, { title: 'No repayment method found', body: 'Check the spelling or try another name.' }));
  } });

  /* The pay page: the amount, then the way to pay it (app, reference number, or QR code) */
  APP.screen('pay', function Pay(p) {
    var mt = p.params.method || { name: 'GCash', kind: 'app' }, d0 = AD.dues[0], total = p.params.total || (d0 ? d0.amount : 2000), how;
    function copy() { APP.say('Copied ' + money(total) + '.', 'success'); }
    if (mt.kind === 'app') how = [h(PS.Button, { key: 'b', block: true, onClick: function () { APP.say(mt.name + ' opens outside the test app.', 'info'); } }, 'Open ' + mt.name), h(PS.PayTimer, { key: 't' })];
    else if (mt.kind === 'qr') how = [h('p', { key: 'n', className: 'ps-text-body-sm ps-repay__note' }, 'Refresh the page to get a new code when this one expires.'),
      h(PS.QrPanel, { key: 'q', merchant: 'Payso', onSave: function () { APP.say('Saved the QR code to your photos.', 'success'); } }), h(PS.PayTimer, { key: 't' })];
    else how = h(PS.InsetRows, { rows: [{ label: 'Payment No.', value: AD.payNo }, { label: 'Sender’s name', value: AD.user.name }] });
    return h(APP.Page, { title: 'Payment', load: 'pay-' + mt.kind },
      h(PS.Section, { label: 'TOTAL REPAYMENT' }, h(PS.RepayCard, { amount: total, due: d0 ? d0.due : 'December 12, 2026', onCopy: copy }, how)),
      h(PS.Accordion, { title: (mt.kind === 'transfer' ? 'Payment' : 'Repayment') + ' example (' + mt.name + ')', open: mt.kind === 'app' },
        '1. Open the ' + mt.name + ' app and tap "Pay Bills".\n2. Select "Loans" and find "PeraSure".\n3. Enter the exact amount and your payment number.\n4. Confirm the payment.'));
  });
})();
