/* PeraSure app — coupons: sample data and the coupon rules (the same model as prototypes/coupon-system/data.js).
   In the app every number here comes from the backend. Pricing is a simple model so the numbers add up on screen:
   per 15-day term, interest = 1.5% and service fee = 0.5% of the amount, principal = amount / terms. */
window.CS = (function () {
  'use strict';
  var money = function (n, d) { return window.PS.money(n, d); };
  var NOW = Date.now(), HOUR = 3600e3;

  var credit = { available: 45000, total: 50000, temporary: 10000, temporaryUntil: 'Nov 20' };
  var loan = { min: 500, step: 100, terms: [3, 6, 8], term: 6, days: 15, interest: 0.015, fee: 0.005, start: new Date(2026, 10, 12) };
  var user = { initials: 'SG', name: 'Sam Ge', verified: true };
  var payment = { amount: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' };
  var today = 'Nov 12, 2026';

  /* coupons to use. kind: discount | limit · type: percent | amount | limit (picture) · scope: first (first-payment interest) | all
     min: smallest loan it works with · terms: terms it works with · long: the rule line is cut, ⓘ opens the whole rule */
  var ALL = [
    { id: 'd25', kind: 'discount', type: 'percent', pct: 25, scope: 'first', value: '25% OFF', name: '25% off first-payment interest', label: 'First-payment interest',
      min: 0, terms: [3, 6, 8], expiresAt: NOW + 24 * HOUR - 1000, until: 'Nov 13, 2026' },
    { id: 'd20', kind: 'discount', type: 'percent', pct: 20, scope: 'all', value: '20% OFF', name: '20% off interest on all payments', label: 'Interest on all payments',
      min: 6000, terms: [6, 8], until: 'Nov 30, 2026' },
    { id: 'a300', kind: 'discount', type: 'amount', off: 300, scope: 'first', value: '₱300 OFF', name: '₱300 off first-payment interest', label: 'First-payment interest',
      min: 10000, terms: [3, 6], long: true, extra: 'One per account, on your first loan of the month', until: 'Dec 15, 2026' },
    { id: 'l5', kind: 'limit', type: 'limit', add: 5000, value: '+₱5,000', name: '+₱5,000 credit limit', label: 'Credit limit increase', min: 6000, terms: [3, 6, 8], until: 'Nov 30, 2026' },
    { id: 'l3', kind: 'limit', type: 'limit', add: 3000, value: '+₱3,000', name: '+₱3,000 credit limit', label: 'Credit limit increase', min: 0, terms: [6, 8], until: 'Dec 10, 2026' },
    { id: 'l2', kind: 'limit', type: 'limit', add: 2000, value: '+₱2,000', name: '+₱2,000 credit limit', label: 'Credit limit increase', min: 20000, terms: [3, 6, 8], until: 'Dec 31, 2026' }
  ];
  var USED = [
    { id: 'u1', type: 'percent', value: '25% OFF', label: 'First-payment interest', rule: 'Any amount · 3 / 6 / 8 terms', meta: 'Used on Oct 24, 2026' },
    { id: 'u2', type: 'percent', value: '20% OFF', label: 'Interest on all payments', rule: 'Borrow ₱6,000 or more · 6 / 8 terms', meta: 'Used on Sep 30, 2026' },
    { id: 'u3', type: 'limit', value: '+₱5,000', label: 'Credit limit increase', rule: 'Borrow ₱6,000 or more · 3 / 6 / 8 terms', meta: 'Used on Sep 30, 2026' }
  ];
  var EXPIRED = [
    { id: 'x1', type: 'amount', value: '₱200 OFF', label: 'First-payment interest', rule: 'Borrow ₱5,000 or more · 3 / 6 terms', meta: 'Expired on Nov 1, 2026' },
    { id: 'x2', type: 'limit', value: '+₱3,000', label: 'Credit limit increase', rule: 'Any amount · 6 / 8 terms', meta: 'Expired on Oct 15, 2026' }
  ];

  function termsText(t, sep) {
    if (t.length === loan.terms.length) return sep ? '3 / 6 / 8 terms' : 'any term';
    return sep ? t.join(' / ') + ' terms' : t.slice(0, -1).join(', ') + (t.length > 1 ? ' or ' : '') + t[t.length - 1] + ' terms';
  }
  function minText(c) { return c.min ? 'Borrow ' + money(c.min, 0) + ' or more' : 'Any amount'; }
  function rule(c) { return minText(c) + ' · ' + termsText(c.terms, true) + (c.extra ? ' · ' + c.extra : ''); }
  ALL.forEach(function (c) { c.rule = rule(c); c.meta = 'Valid until ' + c.until; });

  function fits(c, amount, term) { return !!c && amount >= c.min && c.terms.indexOf(term) >= 0; }
  function why(c, amount, term) {
    if (amount < c.min) return 'Needs a loan of ' + money(c.min, 0) + ' or more';
    if (c.terms.indexOf(term) < 0) return 'Works with ' + termsText(c.terms);
    return null;
  }
  function round2(n) { return Math.round(n * 100) / 100; }
  /* the loan with coupons: what it costs and what the coupons do */
  function calc(amount, term, disc, lim) {
    var I = round2(amount * loan.interest), F = round2(amount * loan.fee), P = round2(amount / term), base = round2(amount + term * (I + F)), save = 0;
    if (disc && fits(disc, amount, term)) {
      var interest = disc.scope === 'all' ? I * term : I;
      save = disc.pct ? interest * disc.pct / 100 : Math.min(disc.off, interest);
    }
    save = round2(save);
    return { interest: I, fee: F, principal: P, per: round2(P + I + F), daily: round2((I + F) / loan.days), was: base, total: round2(base - save), save: save,
      max: credit.available + (lim ? lim.add : 0), limit: lim ? credit.available + lim.add : null };
  }
  function date(k) { var d = new Date(loan.start.getTime() + k * loan.days * 864e5); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function schedule(amount, term, disc) {
    var c = calc(amount, term, disc, null), out = [];
    for (var k = 1; k <= term; k++) {
      var off = 0;
      if (c.save) off = disc.scope === 'all' ? c.save / term : (k === 1 ? c.save : 0);
      var interest = round2(c.interest - off);
      out.push({ title: 'Payment ' + k, date: date(k), total: round2(c.principal + interest + c.fee),
        rows: [{ label: 'Principal', value: c.principal }, { label: 'Interest', value: interest, was: c.interest }, { label: 'Service fee', value: c.fee }] });
    }
    return out;
  }
  /* the coupon of a kind that does the most for this loan */
  function best(list, kind, amount, term) {
    var top = null, topV = 0;
    list.forEach(function (c) {
      if (c.kind !== kind || !fits(c, amount, term)) return;
      var v = kind === 'limit' ? c.add : calc(amount, term, c, null).save;
      if (v > topV) { top = c; topV = v; }
    });
    return top;
  }
  function short(c) { return c.kind === 'limit' ? money(c.add, 0) + ' limit increase' : (c.pct ? c.pct + '%' : money(c.off, 0)) + ' off'; }

  /* Tune: how many coupons the user has */
  function coupons(set) {
    if (String(set) === '0') return [];
    if (String(set) === '1') return ALL.filter(function (c) { return c.id === 'l5'; });
    return ALL.slice();
  }
  return { credit: credit, loan: loan, user: user, payment: payment, today: today, coupons: coupons, used: USED, expired: EXPIRED,
    fits: fits, why: why, calc: calc, schedule: schedule, best: best, short: short, termsText: termsText, minText: minText, date: date };
})();
