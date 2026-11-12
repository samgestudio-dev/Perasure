/* Coupon system — the prototype's flow, built only from the shared PeraSure components (shared/ps-ui).
   Pages: home and account (tab bar) · coupon centre (To use / Used / Expired) · apply a loan.
   Sheets: coupon picker (Discount / Limit increase, live total), repayment plan, "Keep your coupon?" when a change to
   the amount or term takes a coupon off. Data and rules: data.js. Deep links: ?page=coupons|loan|account · ?sheet=picker|plan
   · &tab=used|expired (coupon centre). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, CS = window.CS, h = R.createElement, money = PS.money;
  var T = window.PS_TUNE || {};
  var LOAN = CS.loan, CREDIT = CS.credit;
  var q = new URLSearchParams(location.search);

  function termLine(a, t) { return money(a) + ' · ' + t + ' terms'; }
  function find(list, id) { return list.filter(function (c) { return c.id === id; })[0] || null; }

  function App() {
    var s0 = R.useState(function () { return CS.coupons(T.coupons == null ? '6' : T.coupons); }), coupons = s0[0], setCoupons = s0[1];
    var s1 = R.useState(CS.used), used = s1[0], setUsed = s1[1];
    var nav = R.useState(function () {
      var pg = q.get('page'); return { tab: pg === 'account' ? 'account' : 'home', page: pg === 'coupons' || pg === 'loan' ? pg : 'tabs', dir: 0, from: 'tabs' };
    }), N = nav[0], setN = nav[1];
    var s2 = R.useState(q.get('tab') === 'used' || q.get('tab') === 'expired' ? q.get('tab') : 'use'), ctab = s2[0], setCtab = s2[1];
    var s3 = R.useState(function () { return freshLoan(coupons, null); }), loan = s3[0], setLoan = s3[1];
    var s4 = R.useState(q.get('sheet') || null), sheet = s4[0], setSheet = s4[1];
    var s5 = R.useState({ tab: 'discount', disc: loan.disc, lim: loan.lim }), draft = s5[0], setDraft = s5[1];
    var s6 = R.useState([]), keep = s6[0], setKeep = s6[1];
    var s7 = R.useState(false), agree = s7[0], setAgree = s7[1];
    var s8 = R.useState(null), tip = s8[0], setTip = s8[1];
    var s9 = R.useState(0), nudge = s9[0], setNudge = s9[1];
    var loanSc = R.useRef(null), lastRow = R.useRef({});
    var toast = PS.useToast(), say = toast[1];

    var discs = coupons.filter(function (c) { return c.kind === 'discount'; }), lims = coupons.filter(function (c) { return c.kind === 'limit'; });
    var D = find(coupons, loan.disc), L = find(coupons, loan.lim), C = CS.calc(loan.amount, loan.term, D, L);

    /* ---- the loan as it opens: full available amount, 6 terms, the coupons that do the most ---- */
    function freshLoan(list, withId) {
      var term = LOAN.term, lim = CS.best(list, 'limit', CREDIT.available, term), amount = CREDIT.available + (lim ? lim.add : 0);
      var disc = CS.best(list, 'discount', amount, term), want = withId ? find(list, withId) : null, msg = null;
      if (want) {
        if (want.terms.indexOf(term) < 0) { term = want.terms[want.terms.length - 1]; msg = true; }
        if (want.kind === 'limit') { lim = want; amount = CREDIT.available + want.add; } else disc = want;
        if (amount < want.min) amount = Math.ceil(want.min / LOAN.step) * LOAN.step;
        if (want.kind === 'limit') disc = CS.fits(disc, amount, term) ? disc : CS.best(list, 'discount', amount, term);
        else lim = CS.fits(lim, amount, term) ? lim : CS.best(list, 'limit', amount, term);
      }
      return { amount: amount, term: term, disc: disc ? disc.id : null, lim: lim ? lim.id : null, moved: msg };
    }

    /* ---- navigation ---- */
    function go(page, dir) { setTip(null); setN(function (n) { return Object.assign({}, n, { page: page, dir: dir == null ? 1 : dir, from: n.page }); }); }
    function back() { setTip(null); setN(function (n) { return Object.assign({}, n, { page: n.page === 'loan' && n.from === 'coupons' ? 'coupons' : 'tabs', dir: -1, from: n.page }); }); }
    function openLoan(withId) {
      var l = freshLoan(coupons, withId); lastRow.current = {}; setLoan(l); setAgree(false); go('loan');
      if (l.moved) say('To use this coupon, we set your loan to ' + l.term + ' terms.');
    }
    function openCoupons() { setCtab('use'); go('coupons'); }

    /* ---- amount and term: a change that takes a coupon off asks whether to keep it ---- */
    function check(next) {
      var out = Object.assign({}, next), asks = [], d = find(coupons, next.disc), l = find(coupons, next.lim);
      [d, l].forEach(function (c) {
        if (!c || CS.fits(c, next.amount, next.term)) return;
        var byTerm = c.terms.indexOf(next.term) < 0;
        asks.push({ id: c.id, byTerm: byTerm, amount: next.amount, term: next.term,
          need: byTerm ? { term: c.terms.indexOf(6) >= 0 ? 6 : c.terms[c.terms.length - 1] } : { amount: Math.ceil(c.min / LOAN.step) * LOAN.step } });
        if (c.kind === 'limit') out.lim = null; else out.disc = null;
      });
      var max = CREDIT.available + (find(coupons, out.lim) ? find(coupons, out.lim).add : 0);
      if (out.amount > max) out.amount = max;
      setLoan(out);
      if (asks.length) { setKeep(asks); setSheet('keep'); }
    }
    function onAmount(v) { setLoan(function (l) { return Object.assign({}, l, { amount: v }); }); }
    function onCommit(v) { check(Object.assign({}, loan, { amount: v })); }
    function onTerm(t) { check(Object.assign({}, loan, { term: t })); }

    var K = keep[0] ? find(coupons, keep[0].id) : null;
    function nextKeep() { var rest = keep.slice(1); setKeep(rest); if (!rest.length) setSheet(null); }
    function keepIt() {
      var k = keep[0], l = Object.assign({}, loan, k.need);
      if (K.kind === 'limit') l.lim = K.id; else l.disc = K.id;
      if (k.need.amount && K.kind !== 'limit') { var lc = find(coupons, l.lim); if (!lc && l.amount > CREDIT.available) l.amount = CREDIT.available; }
      setLoan(l); nextKeep();
      say(k.need.amount ? 'Your loan is now ' + termLine(l.amount, l.term) + '.' : 'Your loan is now ' + l.term + ' terms.');
    }

    /* ---- coupon picker ---- */
    function openPicker(tab) { setDraft({ tab: tab || 'discount', disc: loan.disc, lim: loan.lim }); setSheet('picker'); }
    function pick(c) {
      var r = CS.why(c, loan.amount, loan.term);
      if (r) { say(r + '.'); return; }
      setDraft(function (d) {
        var n = Object.assign({}, d); if (c.kind === 'limit') n.lim = d.lim === c.id ? null : c.id; else n.disc = d.disc === c.id ? null : c.id; return n;
      });
    }
    function confirmPicker() {
      var l = Object.assign({}, loan, { disc: draft.disc, lim: draft.lim }), max = CREDIT.available + (find(coupons, l.lim) ? find(coupons, l.lim).add : 0);
      setSheet(null);
      if (l.amount > max) { l.amount = max; say('Your amount is now ' + money(max, 0) + ', your limit without the increase.'); }
      setLoan(l);
    }

    /* ---- coupon rows on the loan page: a tap turns the coupon on or off ---- */
    function toggleRow(c) {
      var lim = c.kind === 'limit', on = lim ? loan.lim === c.id : loan.disc === c.id, l = Object.assign({}, loan);
      if (on) {
        if (lim) { l.lim = null; if (l.amount > CREDIT.available) { l.amount = CREDIT.available; say('Your amount is now ' + money(CREDIT.available, 0) + ', your limit without the increase.'); } }
        else l.disc = null;
        setLoan(l); return;
      }
      var r = CS.why(c, loan.amount, loan.term);
      if (r) { say(r + '. See all to pick another.'); return; }
      if (lim) l.lim = c.id; else l.disc = c.id;
      setLoan(l);
    }

    /* ---- apply. Confirm stays inactive until the agreement is ticked; a tap on it scrolls down to the agreement and the
       empty circle ripples (withdraw's nudge) — no error message ---- */
    function pointAgree() {
      var sc = loanSc.current, fired = false, fire = function () { if (!fired) { fired = true; setNudge(function (n) { return n + 1; }); } };
      if (!sc) { fire(); return; }
      var to = sc.scrollHeight - sc.clientHeight, from = sc.scrollTop;
      if (to - from < 24 || PS.reduce) { sc.scrollTop = to; fire(); return; }
      window.Motion.animate(from, to, Object.assign({}, PS.MT.SPRING, { restDelta: 0.5, restSpeed: 5,
        onUpdate: function (v) { sc.scrollTop = v; if (to - v < 24) fire(); }, onComplete: fire }));
    }
    function confirmLoan() {
      if (!agree) { pointAgree(); return; }
      var spent = [D, L].filter(Boolean);
      setUsed(spent.map(function (c) { return { id: 'u-' + c.id, type: c.type, value: c.value, label: c.label, rule: c.rule, meta: 'Used on ' + CS.today }; }).concat(used));
      setCoupons(coupons.filter(function (c) { return spent.indexOf(c) < 0; }));
      setN({ tab: 'home', page: 'tabs', dir: -1, from: 'loan' });
      say("Thanks, we've got your application. We'll let you know what happens next.", 3400);
    }

    function showRule(c, el) {
      var r = PS.frameRect(el), x = Math.max(16, Math.min(360 - 16 - 248, r.left - 8));
      setTip({ text: c.rule, at: { x: x, y: r.bottom + 8 } });
    }

    /* =================================================================== pages */
    var tune = h(PS.TuneButton);
    function homePage() {
      var bd = CS.best(coupons, 'discount', CREDIT.available, LOAN.term) || discs[0], bl = CS.best(coupons, 'limit', CREDIT.available, LOAN.term) || lims[0];
      var show = [bd, bl].filter(Boolean);
      if (show.length < 2) show = coupons.slice(0, 2);
      var cards = show.map(function (c) {
        return { type: c.type, value: c.value, until: 'Until ' + c.until, kind: c.kind === 'limit' ? 'Credit limit' : 'Off interest',
          label: CS.minText(c), cond: c.terms.length === LOAN.terms.length ? 'Any term' : CS.termsText(c.terms).replace(/^./, function (x) { return x.toUpperCase(); }) };
      });
      return h(PS.Screen, { key: 'home', colBottom: 120,
        top: { left: h(PS.Brand), right: [h(R.Fragment, { key: 't' }, tune), h(PS.HomeActions, { key: 'a', actions: [{ icon: 'bell', label: 'Inbox', onClick: function () { say('Your inbox is empty.'); } }, { icon: 'headset', label: 'Contact us', onClick: function () { say('Support isn’t part of this prototype.'); } }] })] } },
        h(PS.CreditCard, { available: CREDIT.available, total: CREDIT.total, temporary: CREDIT.temporary, temporaryUntil: CREDIT.temporaryUntil, onWithdraw: function () { openLoan(null); },
          onInfo: function () { say('Your available amount is what you can borrow today.'); } }),
        h(PS.PaymentCard, { amount: CS.payment.amount, due: CS.payment.due, badge: CS.payment.badge, onPay: function () { say('Payments aren’t part of this prototype.'); } }),
        h(PS.HomeCoupons, { coupons: cards, onOpen: openCoupons }),
        h(PS.TrustCard),
        h(PS.Legal));
    }
    function accountPage() {
      var n = coupons.length;
      return h(PS.Screen, { key: 'account', colBottom: 120, className: 'cs-account',
        top: { left: h(PS.Brand), right: [h(R.Fragment, { key: 't' }, tune), h(PS.Glass, { key: 'h', icon: 'headset', iconSize: 18, label: 'Contact us', onClick: function () { say('Support isn’t part of this prototype.'); } })] } },
        h(PS.Profile, CS.user),
        h(PS.CreditLimitCard, { total: CREDIT.total, available: CREDIT.available }),
        h(PS.Menu, { items: [
          { id: 'inbox', icon: 'inbox', label: 'Inbox', badge: 'New' },
          { id: 'coupons', icon: 'coupon', label: 'Coupons', badge: n ? n + (n === 1 ? ' coupon' : ' coupons') : null, onClick: openCoupons },
          { id: 'history', icon: 'history', label: 'Loan history' }, { id: 'faq', icon: 'info', label: 'FAQs' },
          { id: 'contact', icon: 'chat', label: 'Contact us' }, { id: 'manage', icon: 'user', label: 'Manage account' }, { id: 'about', icon: 'help', label: 'About PeraSure' }] }),
        h(PS.Social, {}),
        h(PS.Button, { variant: 'inverse', block: true }, 'Log out'));
    }
    function tabsPage() {
      return h('div', { className: 'cs-tabs' },
        h(PS.Pages, { id: N.tab, dir: 0 }, N.tab === 'home' ? homePage() : accountPage()),
        h(PS.Navigator, { value: N.tab, onChange: function (t) { if (t === 'payment') { say('Payments aren’t part of this prototype.'); return; } setN(Object.assign({}, N, { tab: t })); },
          tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] }));
    }

    function centrePage() {
      var list = ctab === 'use' ? coupons : ctab === 'used' ? used : CS.expired;
      var empty = { use: ['No coupons yet', 'When you get a coupon, you’ll see it here.'], used: ['No used coupons yet', 'Coupons you use on a loan show up here.'], expired: ['No expired coupons', 'Coupons that run out before you use them show up here.'] }[ctab];
      var bestD = CS.best(coupons, 'discount', CREDIT.available, LOAN.term);
      var body = list.length ? h('div', { className: 'ps-list' }, list.map(function (c) {
        return h(PS.CouponTicket, { key: c.id, value: c.value, label: c.label, rule: c.rule, ruleLong: c.long, meta: c.meta, expiresAt: ctab === 'use' ? c.expiresAt : null,
          best: ctab === 'use' && bestD === c, state: ctab === 'use' ? 'default' : ctab, action: ctab === 'use' ? 'use' : 'none',
          onUse: function () { openLoan(c.id); }, onRule: function (el) { showRule(c, el); } });
      })) : h(PS.EmptyState, { title: empty[0], body: empty[1], style: { marginTop: 112 } });
      return h(PS.Screen, { key: 'coupons', colTop: 174, colBottom: 48,
        top: { left: h(PS.Back, { onClick: back }), title: 'Coupons', right: tune, solid: true, extraHeight: 58,
          extra: h('div', { className: 'cs-ctabs' }, h(PS.Tabs, { id: 'cs-centre', value: ctab, onChange: function (t) { setTip(null); setCtab(t); },
            items: [{ id: 'use', label: 'To use', count: coupons.length || null }, { id: 'used', label: 'Used' }, { id: 'expired', label: 'Expired' }] })) } },
        h(PS.Crossfade, { k: ctab }, body));
    }

    function loanPage() {
      /* each row keeps the coupon it last showed, so turning it off leaves the same coupon there (just off) */
      var rows = [], last = lastRow.current;
      if (D) last.d = D.id; if (L) last.l = L.id;
      if (discs.length) {
        var bd = D || find(coupons, last.d) || CS.best(coupons, 'discount', loan.amount, loan.term) || discs[0];
        rows.push({ key: 'd', type: bd.type, title: bd.name, on: !!D, onClick: function () { toggleRow(bd); },
          sub: D ? 'You save ' + money(C.save, C.save % 1 ? 2 : 0) : bd.rule });
      }
      if (lims.length) {
        var bl = L || find(coupons, last.l) || CS.best(coupons, 'limit', loan.amount, loan.term) || lims[0];
        rows.push({ key: 'l', type: 'limit', title: bl.name, on: !!L, onClick: function () { toggleRow(bl); },
          sub: L ? 'Your limit is ' + money(C.max, 0) + ' for this loan' : bl.rule });
      }
      return h(PS.Screen, { key: 'loan', tint: true, scrollRef: loanSc,
        top: { left: h(PS.Back, { onClick: back }), title: 'Apply a loan', right: tune },
        bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !agree, onClick: confirmLoan }, 'Confirm')) },
        h(PS.AmountCard, { amount: loan.amount, min: LOAN.min, max: C.max, step: LOAN.step, boost: !!L, terms: LOAN.terms, term: loan.term, termNote: LOAN.days + ' days / term',
          onAmount: onAmount, onCommit: onCommit, onTerm: onTerm }),
        rows.length ? h(PS.CouponsSection, { count: coupons.length, onSeeAll: function () { openPicker('discount'); }, rows: rows }) : null,
        h(PS.OrderDetails, { link: 'View payment schedule', onLink: function () { setSheet('plan'); }, rows: [
          { label: 'Daily fee', value: money(C.daily) }, { label: 'First payment date', value: CS.date(1) }, { label: 'Per installment', value: money(C.per) },
          { label: 'Discount', value: C.save ? '-' + money(C.save) : null, tone: 'positive' }, { label: 'Total payment', value: money(C.total) }] }),
        h(PS.ProtectionCard, { body: 'Get covered for up to ₱30,000, so your family isn’t left with the loan if a medical emergency or accident happens.', onLink: function () { say('Benefits aren’t part of this prototype.'); } }),
        h(PS.MethodCard, { name: 'Bank of the Philippine Islands', last4: '4567' }),
        h(PS.Agreement, { on: agree, nudge: nudge, onToggle: function () { setAgree(!agree); } }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), ' and ', h('b', null, 'Loan Disclosure Statement'), '.'));
    }

    /* =================================================================== sheets */
    function pickerSheet() {
      var kind = draft.tab, list = kind === 'limit' ? lims : discs, dD = find(coupons, draft.disc), dL = find(coupons, draft.lim);
      var c2 = CS.calc(loan.amount, loan.term, dD, dL), top = CS.best(coupons, kind, loan.amount, loan.term);
      var sorted = list.slice().sort(function (a, b) { return (CS.fits(b, loan.amount, loan.term) ? 1 : 0) - (CS.fits(a, loan.amount, loan.term) ? 1 : 0); });
      return h(PS.CouponPicker, { tab: kind, onTab: function (t) { setDraft(Object.assign({}, draft, { tab: t })); }, onClose: function () { setSheet(null); },
        tabs: [{ id: 'discount', label: 'Discount', count: discs.length }, { id: 'limit', label: 'Limit increase', count: lims.length }],
        intro: 'You can use 1 interest discount and 1 limit increase on each loan.', loan: termLine(loan.amount, loan.term),
        summary: h(PS.Summary, { total: c2.total, was: c2.was, saved: c2.save, newLimit: c2.limit, onConfirm: confirmPicker }) },
        sorted.length ? sorted.map(function (c) {
          var ok = CS.fits(c, loan.amount, loan.term), on = (kind === 'limit' ? draft.lim : draft.disc) === c.id;
          return h(PS.CouponTicket, { key: c.id, value: c.value, label: c.label, rule: c.rule, ruleLong: c.long, meta: c.meta, expiresAt: c.expiresAt, best: ok && top === c,
            state: on ? 'selected' : ok ? 'default' : 'unavailable', reason: CS.why(c, loan.amount, loan.term), action: 'pick',
            onPick: function () { pick(c); }, onRule: function (el) { showRule(c, el); } });
        }) : h(PS.EmptyState, { title: kind === 'limit' ? 'No limit increases yet' : 'No discounts yet', body: 'When you get one, it shows up here.', style: { marginTop: 72 } }));
    }
    function keepSheet() {
      if (!K) return null;
      var k = keep[0], kept = Object.assign({ amount: k.amount, term: k.term }, k.need);
      var lim = K.kind === 'limit', facts = [{ label: 'Your loan', value: termLine(k.amount, k.term).replace('.00', '') }];
      facts.push(lim ? { label: 'Your credit limit with it', value: money(CREDIT.available + K.add, 0), tone: 'positive' }
                     : { label: 'You’d save', value: money(CS.calc(kept.amount, kept.term, K).save, 2), tone: 'positive' });
      var body = k.byTerm ? 'You picked ' + k.term + ' terms. This coupon works with ' + CS.termsText(K.terms) + ', so we’ve taken it off. Keep it and we’ll switch you to ' + k.need.term + ' terms.'
        : 'Your new amount is ' + money(k.amount, 0) + '. This coupon needs a loan of ' + money(K.min, 0) + ' or more, so we’ve taken it off. Keep it and we’ll set your loan to ' + money(k.need.amount, 0) + '.';
      return h(PS.Decision, { art: K.type, title: 'Keep your ' + CS.short(K) + '?', body: body, facts: facts, onClose: nextKeep,
        primary: { label: 'Keep coupon', onClick: keepIt }, secondary: { label: 'Don’t use coupon', onClick: nextKeep } });
    }
    function planSheet() {
      return h(R.Fragment, null, h(PS.SheetTitle, { onClose: function () { setSheet(null); } }, 'Repayment plan'),
        h(PS.RepaymentPlan, { items: CS.schedule(loan.amount, loan.term, D) }),
        h(PS.Button, { block: true, onClick: function () { setSheet(null); } }, 'Continue'));
    }

    var page = N.page === 'coupons' ? centrePage() : N.page === 'loan' ? loanPage() : tabsPage();
    var toastAt = N.page === 'tabs' ? 112 : N.page === 'loan' ? 124 : 40;
    return h(PS.Shell, null,
      h(PS.Pages, { id: N.page, dir: N.dir }, page),
      h(PS.Sheet, { open: sheet === 'picker', kind: 'page', label: 'Coupons', onClose: function () { setSheet(null); } }, sheet === 'picker' ? pickerSheet() : null),
      h(PS.Sheet, { open: sheet === 'plan', kind: 'plain', label: 'Repayment plan', onClose: function () { setSheet(null); } }, sheet === 'plan' ? planSheet() : null),
      h(PS.Sheet, { open: sheet === 'keep' && !!K, kind: 'card', label: 'Keep your coupon?', onClose: nextKeep }, sheet === 'keep' ? keepSheet() : null),
      h(PS.Tooltip, { open: !!tip, at: tip ? tip.at : null, text: tip ? tip.text : '', onClose: function () { setTip(null); } }),
      h(PS.Toast, { msg: toast[0], bottom: toastAt }));
  }

  PS.mount(App);
})();
