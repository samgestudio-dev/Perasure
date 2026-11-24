/* PeraSure app — applying for a loan: amount keypad → loan detail (slider, coupons) → code → Order submit → home.
   Figma section "User Order": 52:12744 Enter number, 52:8604 Loan detail, 52:8389 Withdrawal methods, 52:8428 bank search,
   52:8711… OTP sheet; "Order state" 52:14159 / 52:14179; coupon centre and sheets as in prototypes/coupon-system. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, AD = window.AD, CS = window.CS, h = R.createElement, m = PS.m, money = PS.money;
  var LOAN = CS.loan, CREDIT = CS.credit;
  function find(list, id) { return list.filter(function (c) { return c.id === id; })[0] || null; }
  function termLine(a, t) { return money(a) + ' · ' + t + ' terms'; }
  function L() { return APP.S.L; }
  function setL(l) { APP.set({ L: l }); }
  function logoOf(mt) { return 'pay-' + mt.id; }

  /* the loan as it opens: the amount typed (or the full limit), the coupons that do the most */
  function fresh(amount, term, withId) {
    var list = APP.S.coupons; term = term || LOAN.term;
    var lim = CS.best(list, 'limit', amount || CREDIT.available, term), max = CREDIT.available + (lim ? lim.add : 0);
    amount = amount || max; if (amount <= CREDIT.available) lim = CS.fits(lim, amount, term) ? lim : null;
    var disc = CS.best(list, 'discount', amount, term), want = withId ? find(list, withId) : null, moved = false;
    if (want) {
      if (want.terms.indexOf(term) < 0) { term = want.terms[want.terms.length - 1]; moved = true; }
      if (want.kind === 'limit') { lim = want; amount = CREDIT.available + want.add; } else disc = want;
      if (amount < want.min) amount = Math.ceil(want.min / LOAN.step) * LOAN.step;
      if (want.kind === 'limit') disc = CS.fits(disc, amount, term) ? disc : CS.best(list, 'discount', amount, term);
      else lim = CS.fits(lim, amount, term) ? lim : CS.best(list, 'limit', amount, term);
    }
    return { amount: amount, term: term, disc: disc ? disc.id : null, lim: lim ? lim.id : null, moved: moved };
  }
  APP.openLoan = function (withId, amount, term) {
    var l = fresh(amount, term, withId); APP.set({ L: l, agree: false, lastRow: {} }); APP.go('loan');
    if (l.moved) APP.say('To use this coupon, we set your loan to ' + l.term + ' terms.', 'info');
  };

  /* ---- amount keypad: type the amount, pick a term to continue ---- */
  APP.screen('amount', function Amount(p) {
    var cur = p.params.edit ? L() : null;
    var s = R.useState(cur ? String(Math.round(cur.amount / 100)) : ''), typed = s[0], setTyped = s[1], e = R.useState(false), err = e[0], setErr = e[1];
    var max = CREDIT.available, amount = typed ? +typed * 100 : 0;
    function key(k) {
      setErr(false);
      if (k === 'del') { setTyped(typed.slice(0, -1)); return; }
      if (k === '*' || typed.length >= 3 || (!typed && k === '0')) return;
      setTyped(typed + k);
    }
    function pick(t) {
      if (amount < LOAN.min || amount > max) { setErr(true); return; }
      if (cur) { APP.loanCheck(Object.assign({}, cur, { amount: amount, term: t })); APP.back(); return; }
      var l = fresh(amount, t, null); APP.set({ L: l, agree: false, lastRow: {} }); APP.swap('loan', null, 1);
    }
    var shown = typed ? PS.num(amount, 0).slice(0, -2) : '';   /* the comma sits where it will in the whole amount: 12,5|00 */
    return h(PS.Screen, { tint: true, colBottom: 0, className: 'app-amount',   /* the amount entry: not a secondary page (owner) */ top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Apply a loan', right: APP.tune() } },
      h(PS.AmountEntry, { typed: shown, amount: amount, terms: LOAN.terms, term: cur && cur.term, onTerm: pick, onKey: key,
        error: err ? 'Enter an amount from ' + money(LOAN.min, 0) + ' to ' + money(max, 0) + '.' : null, hint: 'Flexible amounts from ' + money(LOAN.min, 0) + '–' + money(max, 0) }));
  });

  /* ---- a change of amount or term that takes a coupon off asks whether to keep it ---- */
  APP.loanCheck = function (next) {
    var list = APP.S.coupons, out = Object.assign({}, next), asks = [];
    [find(list, next.disc), find(list, next.lim)].forEach(function (c) {
      if (!c || CS.fits(c, next.amount, next.term)) return;
      var byTerm = c.terms.indexOf(next.term) < 0;
      asks.push({ id: c.id, byTerm: byTerm, amount: next.amount, term: next.term, need: byTerm ? { term: c.terms.indexOf(6) >= 0 ? 6 : c.terms[c.terms.length - 1] } : { amount: Math.ceil(c.min / LOAN.step) * LOAN.step } });
      if (c.kind === 'limit') out.lim = null; else out.disc = null;
    });
    var max = CREDIT.available + (find(list, out.lim) ? find(list, out.lim).add : 0);
    if (out.amount > max) out.amount = max;
    APP.set({ L: out, keep: asks, sheet: asks.length ? { name: 'keep', params: {} } : APP.S.sheet });
  };
  function toggleRow(c) {
    var l = Object.assign({}, L()), lim = c.kind === 'limit', on = lim ? l.lim === c.id : l.disc === c.id;
    if (on) {
      if (lim) { l.lim = null; if (l.amount > CREDIT.available) { l.amount = CREDIT.available; APP.say('Your amount is now ' + money(CREDIT.available, 0) + ', your limit without the increase.', 'info'); } } else l.disc = null;
      setL(l); return;
    }
    var r = CS.why(c, l.amount, l.term);
    if (r) { APP.say(r + '. See all to pick another.', 'info'); return; }
    if (lim) l.lim = c.id; else l.disc = c.id; setL(l);
  }

  /* ---- loan detail ---- */
  /* what a loan is made of — for the loan page and for the Withdraw sheet: the coupons in use, the numbers, and the blocks under the amount card.
     agree · onAgree · nudge: the agreement's state (the page's or the sheet's) */
  APP.freshLoan = fresh;
  APP.loanParts = function (S, agree, onAgree, nudge) {
    var l = S.L || fresh(null, null, null), coupons = S.coupons;
    var discs = coupons.filter(function (c) { return c.kind === 'discount'; }), lims = coupons.filter(function (c) { return c.kind === 'limit'; });
    var D = find(coupons, l.disc), Lm = find(coupons, l.lim), C = CS.calc(l.amount, l.term, D, Lm), last = S.lastRow || {}, rows = [];
    if (D) last.d = D.id; if (Lm) last.l = Lm.id;
    if (discs.length) { var bd = D || find(coupons, last.d) || CS.best(coupons, 'discount', l.amount, l.term) || discs[0];
      rows.push({ key: 'd', type: bd.type, title: bd.name, on: !!D, onClick: function () { toggleRow(bd); }, sub: D ? 'You save ' + money(C.save, C.save % 1 ? 2 : 0) : bd.rule }); }
    if (lims.length) { var bl = Lm || find(coupons, last.l) || CS.best(coupons, 'limit', l.amount, l.term) || lims[0];
      rows.push({ key: 'l', type: 'limit', title: bl.name, on: !!Lm, onClick: function () { toggleRow(bl); }, sub: Lm ? 'Your limit is ' + money(C.max, 0) + ' for this loan' : bl.rule }); }
    var mt = S.method;
    var cpn = rows.length ? h(PS.CouponsSection, { key: 'coupons', count: coupons.length, onSeeAll: function () { APP.set({ draft: { tab: 'discount', disc: l.disc, lim: l.lim } }); APP.open('picker'); }, rows: rows }) : null;
    /* coupons: the coupons section alone (the Withdraw sheet puts it above the demo's own blocks); blocks: the whole page (the keypad fallback) */
    return { l: l, D: D, Lm: Lm, C: C, coupons: cpn, blocks: [
      cpn,
      h(PS.OrderDetails, { key: 'details', link: 'View payment schedule', onLink: function () { APP.open('plan'); }, rows: [
        { label: 'Daily fee', value: money(C.daily) }, { label: 'First payment date', value: CS.date(1) }, { label: 'Per installment', value: money(C.per) },
        { label: 'Discount', value: C.save ? '-' + money(C.save) : null, tone: 'positive' }, { label: 'Total payment', value: money(C.total) }] }),
      h(PS.ProtectionCard, { key: 'prot', body: 'Get covered for up to ₱30,000, so your family isn’t left with the loan if a medical emergency or accident happens.', onLink: function () { APP.say('Benefits aren’t part of the test app yet.', 'info'); } }),
      h(PS.MethodCard, { key: 'method', name: mt.name, last4: mt.last4, logo: logoOf(mt), logoExt: 'png', onClick: function () { APP.go('method'); } }),
      h(PS.Agreement, { key: 'agree', on: !!agree, nudge: nudge, onToggle: onAgree }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), ' and ', h('b', null, 'Loan Disclosure Statement'), '.')] };
  };
  /* Confirm: the code, then Order submit — and home only when its animation has finished */
  APP.submitLoan = function () {
    var P = APP.loanParts(APP.S), l = P.l, D = P.D, Lm = P.Lm, C = P.C;
    APP.set({ otp: { then: function () {
      APP.set({ submitting: { then: function () {
        var spent = [D, Lm].filter(Boolean);
        CS.take(l.amount);                                  /* the amount is used credit from now on: home, the hub and the history follow */
        APP.set({ used: spent.map(function (c) { return { id: 'u-' + c.id, type: c.type, value: c.value, label: c.label, rule: c.rule, meta: 'Used on ' + CS.today }; }).concat(APP.S.used),
          coupons: APP.S.coupons.filter(function (c) { return spent.indexOf(c) < 0; }), loan: 'reviewing',
          order: { amount: l.amount, term: l.term, first: C.per, date: CS.today, method: APP.S.method } });
        if (APP.wd) APP.wd.reset();
        APP.home('home', -1);
        if (APP.T.rating && +APP.T.rating && !APP.S.rated) setTimeout(function () { APP.open('rating'); }, 900);
        else APP.say('Thanks, we’ve got your application. We’ll let you know what happens next.', 3400, 'success');
      } } });
    } } });
  };

  /* ---- loan detail as a page of its own (from a coupon's "Use"); Withdraw on the home card opens the Withdraw sheet instead (screens-withdraw.js) ---- */
  APP.screen('loan', function Loan() {
    var S = APP.use(), sc = R.useRef(null), n = R.useState(0);
    var P = APP.loanParts(S, !!S.agree, function () { APP.set({ agree: !S.agree }); }, n[0]), l = P.l, C = P.C, Lm = P.Lm;
    function pointAgree() {
      var el = sc.current, fired = false, fire = function () { if (!fired) { fired = true; n[1](function (x) { return x + 1; }); } };
      if (!el) { fire(); return; }
      var to = el.scrollHeight - el.clientHeight, from = el.scrollTop;
      if (to - from < 24 || PS.reduce) { el.scrollTop = to; fire(); return; }
      window.Motion.animate(from, to, Object.assign({}, PS.MT.SPRING, { restDelta: 0.5, restSpeed: 5, onUpdate: function (v) { el.scrollTop = v; if (to - v < 24) fire(); }, onComplete: fire }));
    }
    function confirm() { if (!S.agree) { pointAgree(); return; } APP.submitLoan(); }
    return h(PS.Screen, { tint: true, scrollRef: sc,   /* the order details: not a secondary page (owner) */ top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Apply a loan', right: APP.tune() },
      /* not a secondary page, but the secondary bottom (owner, tokens v2026.11.17) */
      bottom: h(PS.BottomBar, { secondary: true }, h(PS.Button, { block: true, inactive: !S.agree, onClick: confirm }, 'Confirm')) },
      [h(PS.AmountCard, { key: 'card', amount: l.amount, min: LOAN.min, max: C.max, step: LOAN.step, boost: !!Lm, terms: LOAN.terms, term: l.term, termNote: LOAN.days + ' days / term',
        onAmount: function (v) { setL(Object.assign({}, APP.S.L, { amount: v })); }, onCommit: function (v) { APP.loanCheck(Object.assign({}, APP.S.L, { amount: v })); },
        onTerm: function (t) { APP.loanCheck(Object.assign({}, APP.S.L, { term: t })); }, onEdit: function () { APP.go('amount', { edit: true }, 'rise'); } })].concat(P.blocks));
  });

  /* ---- sheets of the loan page ---- */
  APP.sheet('picker', { kind: 'page', label: 'Coupons', render: function Picker() {
    var S = APP.use(), l = S.L, draft = S.draft || { tab: 'discount', disc: l.disc, lim: l.lim }, coupons = S.coupons, kind = draft.tab;
    var discs = coupons.filter(function (c) { return c.kind === 'discount'; }), lims = coupons.filter(function (c) { return c.kind === 'limit'; }), list = kind === 'limit' ? lims : discs;
    var c2 = CS.calc(l.amount, l.term, find(coupons, draft.disc), find(coupons, draft.lim)), top = CS.best(coupons, kind, l.amount, l.term);
    var sorted = list.slice().sort(function (a, b) { return (CS.fits(b, l.amount, l.term) ? 1 : 0) - (CS.fits(a, l.amount, l.term) ? 1 : 0); });
    function confirm() {
      var n = Object.assign({}, l, { disc: draft.disc, lim: draft.lim }), max = CREDIT.available + (find(coupons, n.lim) ? find(coupons, n.lim).add : 0);
      if (n.amount > max) { n.amount = max; APP.say('Your amount is now ' + money(max, 0) + ', your limit without the increase.', 'info'); }
      APP.set({ L: n, sheet: null });
    }
    return h(PS.CouponPicker, { tab: kind, onTab: function (t) { APP.set({ draft: Object.assign({}, draft, { tab: t }) }); }, onClose: APP.close,
      tabs: [{ id: 'discount', label: 'Discount' }, { id: 'limit', label: 'Limit increase' }],   /* DS 10836:28988: no counts */
      intro: 'You can use 1 interest discount and 1 limit increase on each loan.', loan: termLine(l.amount, l.term),
      summary: h(PS.Summary, { total: c2.total, was: c2.was, saved: c2.save, newLimit: c2.limit, onConfirm: confirm }) },
      sorted.length ? sorted.map(function (c) {
        var ok = CS.fits(c, l.amount, l.term), on = (kind === 'limit' ? draft.lim : draft.disc) === c.id;
        return h(PS.CouponOption, { key: c.id, value: c.value, label: c.label, rule: c.rule, expiresAt: c.expiresAt, best: ok && top === c,
          state: on ? 'selected' : ok ? 'default' : 'unavailable',
          onPick: function () { var r = CS.why(c, l.amount, l.term); if (r) { APP.say(r + '.', 'info'); return; }
            var d = Object.assign({}, draft); if (c.kind === 'limit') d.lim = d.lim === c.id ? null : c.id; else d.disc = d.disc === c.id ? null : c.id; APP.set({ draft: d }); } });
      }) : h(PS.EmptyState, { title: kind === 'limit' ? 'No limit increases yet' : 'No discounts yet', body: 'When you get one, it shows up here.' }));
  } });
  /* Keep your coupon? — every coupon the change took off, together: one coupon → one card; more → the coupons side by side, swiped like the
     anti-scam cards (PS.Decision pages, dots). Keep / Don't use act on the coupon on show and move on to the next one not yet answered;
     when every coupon is answered (or the sheet is closed: the rest stay off) the loan changes once, with one toast. */
  APP.sheet('keep', { kind: 'card', label: 'Keep your coupon?', render: function Keep() {
    var S = APP.use(), keep = (S.keep || []).filter(function (k) { return find(S.coupons, k.id); });
    var st = R.useState(0), i = Math.min(st[0], Math.max(0, keep.length - 1)), setI = st[1], said = R.useRef({});
    if (!keep.length) return null;
    function finish() {
      var l = Object.assign({}, APP.S.L), kept = keep.filter(function (k) { return said.current[k.id]; });
      kept.forEach(function (k) { var K = find(S.coupons, k.id); Object.assign(l, k.need); if (K.kind === 'limit') l.lim = K.id; else l.disc = K.id; });
      var max = CREDIT.available + (find(S.coupons, l.lim) ? find(S.coupons, l.lim).add : 0);
      if (l.amount > max) l.amount = max;
      APP.set({ L: l, sheet: null });   /* keep stays so the sheet still shows its coupon while it closes */
      if (kept.length) APP.say(kept.some(function (k) { return k.need.amount; }) ? 'Your loan is now ' + termLine(l.amount, l.term) + '.' : 'Your loan is now ' + l.term + ' terms.', 'info');
    }
    function answer(yes) {
      said.current[keep[i].id] = yes;
      var open = keep.map(function (k, n) { return n; }).filter(function (n) { return !(keep[n].id in said.current); });
      var next = open.filter(function (n) { return n > i; })[0];
      if (next == null) next = open[0];
      if (next == null) finish(); else setI(next);
    }
    function page(k) {
      var K = find(S.coupons, k.id), kept = Object.assign({ amount: k.amount, term: k.term }, k.need), lim = K.kind === 'limit';
      var facts = [{ label: 'Your loan', value: termLine(k.amount, k.term).replace('.00', '') }];
      facts.push(lim ? { label: 'Your credit limit with it', value: money(CREDIT.available + K.add, 0), tone: 'positive' } : { label: 'You’d save', value: money(CS.calc(kept.amount, kept.term, K).save, 2), tone: 'positive' });
      var body = k.byTerm ? 'You picked ' + k.term + ' terms. This coupon works with ' + CS.termsText(K.terms) + ', so we’ve taken it off. Keep it and we’ll switch you to ' + k.need.term + ' terms.'
        : 'Your new amount is ' + money(k.amount, 0) + '. This coupon needs a loan of ' + money(K.min, 0) + ' or more, so we’ve taken it off. Keep it and we’ll set your loan to ' + money(k.need.amount, 0) + '.';
      return { art: K.type, title: 'Keep your ' + CS.short(K) + '?', body: body, facts: facts };
    }
    return h(PS.Decision, { pages: keep.map(page), index: i, onIndex: setI, onClose: finish,
      primary: { label: 'Keep coupon', onClick: function () { answer(true); } }, secondary: { label: 'Don’t use coupon', onClick: function () { answer(false); } } });
  } });
  APP.sheet('plan', { kind: 'plain', label: 'Repayment plan', render: function Plan() {
    var S = APP.use(), l = S.L;
    return h(R.Fragment, null, h(PS.SheetTitle, { onClose: APP.close }, 'Repayment plan'),
      h(PS.RepaymentPlan, { items: CS.schedule(l.amount, l.term, find(S.coupons, l.disc)) }), h(PS.Button, { block: true, onClick: APP.close }, 'Continue'));
  } });

  /* ---- withdrawal method: e-wallet or bank, then the account number ---- */
  APP.screen('method', function Method() {
    var S = APP.use(), cur = S.method;
    var s = R.useState({ kind: cur.kind, id: cur.id, name: cur.name, acct: '', err: null }), st = s[0], setSt = s[1];
    function set(o) { setSt(function (x) { return Object.assign({}, x, o); }); }
    R.useEffect(function () { if (S.pickedBank) { set({ kind: 'bank', id: S.pickedBank[0], name: S.pickedBank[1], err: null }); APP.set({ pickedBank: null }); } }, [S.pickedBank]);
    function save() {
      if (!/^\d{10,16}$/.test(st.acct)) { set({ err: st.kind === 'wallet' ? 'Enter the mobile number linked to this e-wallet (10–11 digits).' : 'Enter your account number (10–16 digits).' }); return; }
      APP.run(function () { APP.set({ method: { kind: st.kind, id: st.id, name: st.name, last4: st.acct.slice(-4) }, loan: APP.S.loan === 'failed' ? 'reviewing' : APP.S.loan }); APP.back(); APP.say('We’ll send your money to ' + st.name + ' ending in ' + st.acct.slice(-4) + '.', 'success'); });
    }
    return h(APP.Page, { title: 'Withdrawal methods', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: save }, 'Continue')) },
      h(APP.Head, { title: 'Choose how you get money', body: 'Your money will be sent to this account' }),
      h('div', { className: 'app-stack-12' },
        h(PS.Segmented, { id: 'app-method', value: st.kind, onChange: function (k) { set({ kind: k, id: k === 'wallet' ? 'gcash' : null, name: k === 'wallet' ? 'GCash' : '', err: null }); },
          items: [{ id: 'wallet', label: 'E-Wallet' }, { id: 'bank', label: 'Online bank' }] }),
        h(PS.Crossfade, { k: st.kind }, st.kind === 'wallet'
          ? h('div', { className: 'app-stack-12', role: 'radiogroup' }, AD.wallets.map(function (w) {
              return h(PS.SelectBar, { key: w.id, on: st.id === w.id, label: w.name, logo: 'pay-' + w.id, note: w.note, onClick: function () { set({ id: w.id, name: w.name }); } }); }))
          : h(PS.Field, { label: 'Bank name', value: st.name, placeholder: 'Choose your bank', onClick: function () { APP.open('banks'); } }))),
      h(PS.Field, { label: st.kind === 'wallet' ? 'Mobile number' : 'Account number', value: st.acct, placeholder: 'Enter your ' + (st.kind === 'wallet' ? 'mobile' : 'account') + ' number', inputMode: 'numeric', clear: true, error: st.err,
        onChange: function (v) { set({ acct: v.replace(/[^\d]/g, '').slice(0, 16), err: null }); } }));
  });
  APP.sheet('banks', { kind: 'page', label: 'Choose your bank', render: function Banks() {
    var s = R.useState(''), q = s[0], setQ = s[1], groups = {}, keys;
    AD.banks.filter(function (b) { return b[1].toLowerCase().indexOf(q.trim().toLowerCase()) >= 0; }).forEach(function (b) { var k = b[1].charAt(0).toUpperCase(); (groups[k] = groups[k] || []).push(b); });
    keys = Object.keys(groups).sort();
    return h(PS.SearchSheet, { value: q, onChange: setQ, placeholder: 'Search bank name', onClose: APP.close },
      keys.length ? h(PS.BankList, { groups: keys.map(function (k) { return { title: k, items: groups[k].map(function (b) { return { id: b[0], name: b[1], logo: PS.asset('logos/pay-' + b[0] + '.png'), b: b }; }) }; }),
        q: q.trim().toLowerCase(), onPick: function (it) { APP.set({ pickedBank: it.b, sheet: null }); } })
        : h(PS.EmptyState, { title: 'No matching banks found', body: 'Check the spelling or try another name.' }));
  } });

  /* ---- coupon centre ---- */
  APP.screen('coupons', function Coupons() {
    var S = APP.use(), s = R.useState('use'), tab = s[0], setTab = s[1], coupons = S.coupons;
    var list = tab === 'use' ? coupons : tab === 'used' ? S.used : CS.expired, bestD = CS.best(coupons, 'discount', CREDIT.available, LOAN.term);
    var empty = { use: ['No coupons yet', 'When you get a coupon, you’ll see it here.'], used: ['No used coupons yet', 'Coupons you use on a loan show up here.'], expired: ['No expired coupons', 'Coupons that run out before you use them show up here.'] }[tab];
    var body = list.length ? list.map(function (c) {
      return h(PS.CouponTicket, { key: c.id, value: c.value, label: c.label, rule: c.rule, ruleLong: c.long, meta: c.meta, expiresAt: tab === 'use' ? c.expiresAt : null, best: tab === 'use' && bestD === c,
        state: tab === 'use' ? 'default' : tab, action: tab === 'use' && S.user === 'approved' ? 'use' : 'none', onUse: function () { APP.borrow(c.id); }, onRule: function (el) { APP.tipAt(el, c.rule); } });
    }) : h(PS.EmptyState, { title: empty[0], body: empty[1], page: true });
    return h(PS.Screen, { secondary: true, colTop: 174, colBottom: 48, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Coupons', right: APP.tune(), solid: true, extraHeight: 58,
      extra: h('div', { className: 'app-ctabs' }, h(PS.Tabs, { id: 'app-centre', value: tab, onChange: function (t) { APP.set({ tip: null }); setTab(t); },
        items: [{ id: 'use', label: 'To use', count: coupons.length || null }, { id: 'used', label: 'Used' }, { id: 'expired', label: 'Expired' }] })) } },
      h(APP.Loaded, { k: 'coupons', rise: false }, h(PS.Crossfade, { k: tab, rise: true, className: list.length ? 'ps-tickets' : null }, body)));
  });

  /* ---- your loan application: in review, or the transfer failed ---- */
  APP.screen('order', function Order() {
    var S = APP.use(), cur = CS.current, o = S.order || (cur ? { amount: cur.amount, term: cur.term, first: cur.first, date: cur.date, method: S.method } : { amount: 2000, term: 4, first: 1234.5, date: CS.today, method: S.method }), failed = S.loan === 'failed';
    return h(APP.Page, { title: 'Your loan application', load: 'order', bottom: failed ? h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { APP.go('method'); } }, 'Change withdrawal method')) : null },
      h(PS.OrderHead, { label: 'You applied for a loan', amount: o.amount }),
      h(PS.OrderStatus, { state: failed ? 'failed' : 'review', title: failed ? 'We couldn’t send your loan' : 'We’re reviewing your application',
        body: failed ? 'The transfer to your account didn’t go through. Change your withdrawal method to try again.' : 'Your loan is under review. We’ll let you know once we’re sending your money.' }),
      h(PS.Section, { label: 'DETAILS' }, h(PS.Card, { className: 'ps-details' }, h(PS.Rows, { rows: [{ label: 'First payment', value: money(o.first) }, { label: 'Loan term', value: o.term + ' terms (' + LOAN.days + ' days / term)' },
        { label: 'Loan date', value: o.date }, { label: 'Withdrawal method', value: o.method.name + ' ending in ' + o.method.last4 }] }))));
  });
})();
