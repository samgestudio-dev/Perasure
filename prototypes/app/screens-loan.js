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
    if (l.moved) APP.say('To use this coupon, we set your loan to ' + l.term + ' terms.');
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
    return h(PS.Screen, { tint: true, colBottom: 0, className: 'app-amount', top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Apply a loan', right: APP.tune() } },
      h('div', { className: 'app-amount__sheet' },
        h('div', { className: 'app-amount__top' },
          h('p', { className: 'ps-t-body-lg-em ps-c-secondary', style: { lineHeight: '20px' } }, 'Disbursement amount'),
          h('div', { className: 'app-amount__num', 'aria-live': 'polite', 'aria-label': money(amount) },
            h('span', { className: 'app-amount__cur' }, '₱'), h('span', { className: 'app-amount__typed' }, shown), h('span', { className: 'app-amount__caret', 'aria-hidden': true }),
            h('span', { className: 'app-amount__rest' }, '00'), h('span', { className: 'app-amount__dec' }, '.00')),
          h(PS.Swap, { k: err ? 'e' : 'r', block: true }, h('span', { className: PS.cx('ps-t-body-md', err ? 'ps-c-negative' : 'ps-c-tertiary') },
            err ? 'Enter an amount from ' + money(LOAN.min, 0) + ' to ' + money(max, 0) + '.' : 'Flexible amounts from ' + money(LOAN.min, 0) + '–' + money(max, 0)))),
        h('div', { className: 'app-amount__pad' },
          h('div', { className: 'app-stack-8' }, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'Choose a loan term to continue'),
            h('div', { className: 'ps-terms', role: 'radiogroup', 'aria-label': 'Loan term' }, LOAN.terms.map(function (t) {
              var on = cur && cur.term === t;
              return h(m.button, Object.assign({ key: t, type: 'button', role: 'radio', 'aria-checked': !!on, className: PS.cx('ps-term', on && 'is-on'), onClick: function () { pick(t); } }, PS.press()), t + ' terms');
            }))),
          h(PS.Divider), h(PS.Keypad, { onKey: key, cascade: true }))));
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
      if (lim) { l.lim = null; if (l.amount > CREDIT.available) { l.amount = CREDIT.available; APP.say('Your amount is now ' + money(CREDIT.available, 0) + ', your limit without the increase.'); } } else l.disc = null;
      setL(l); return;
    }
    var r = CS.why(c, l.amount, l.term);
    if (r) { APP.say(r + '. See all to pick another.'); return; }
    if (lim) l.lim = c.id; else l.disc = c.id; setL(l);
  }

  /* ---- loan detail ---- */
  APP.screen('loan', function Loan() {
    var S = APP.use(), l = S.L || fresh(null, null, null), coupons = S.coupons, sc = R.useRef(null), n = R.useState(0);
    var discs = coupons.filter(function (c) { return c.kind === 'discount'; }), lims = coupons.filter(function (c) { return c.kind === 'limit'; });
    var D = find(coupons, l.disc), Lm = find(coupons, l.lim), C = CS.calc(l.amount, l.term, D, Lm), last = S.lastRow || {}, rows = [];
    if (D) last.d = D.id; if (Lm) last.l = Lm.id;
    if (discs.length) { var bd = D || find(coupons, last.d) || CS.best(coupons, 'discount', l.amount, l.term) || discs[0];
      rows.push({ key: 'd', type: bd.type, title: bd.name, on: !!D, onClick: function () { toggleRow(bd); }, sub: D ? 'You save ' + money(C.save, C.save % 1 ? 2 : 0) : bd.rule }); }
    if (lims.length) { var bl = Lm || find(coupons, last.l) || CS.best(coupons, 'limit', l.amount, l.term) || lims[0];
      rows.push({ key: 'l', type: 'limit', title: bl.name, on: !!Lm, onClick: function () { toggleRow(bl); }, sub: Lm ? 'Your limit is ' + money(C.max, 0) + ' for this loan' : bl.rule }); }
    function pointAgree() {
      var el = sc.current, fired = false, fire = function () { if (!fired) { fired = true; n[1](function (x) { return x + 1; }); } };
      if (!el) { fire(); return; }
      var to = el.scrollHeight - el.clientHeight, from = el.scrollTop;
      if (to - from < 24 || PS.reduce) { el.scrollTop = to; fire(); return; }
      window.Motion.animate(from, to, Object.assign({}, PS.MT.SPRING, { restDelta: 0.5, restSpeed: 5, onUpdate: function (v) { el.scrollTop = v; if (to - v < 24) fire(); }, onComplete: fire }));
    }
    function confirm() {
      if (!S.agree) { pointAgree(); return; }
      APP.set({ otp: { then: function () {
        APP.set({ submitting: { then: function () {
          var spent = [D, Lm].filter(Boolean);
          APP.set({ used: spent.map(function (c) { return { id: 'u-' + c.id, type: c.type, value: c.value, label: c.label, rule: c.rule, meta: 'Used on ' + CS.today }; }).concat(APP.S.used),
            coupons: APP.S.coupons.filter(function (c) { return spent.indexOf(c) < 0; }), loan: 'reviewing',
            order: { amount: l.amount, term: l.term, first: C.per, date: CS.today, method: APP.S.method } });
          APP.home('home', -1);
          if (APP.T.rating && +APP.T.rating && !APP.S.rated) setTimeout(function () { APP.open('rating'); }, 900);
          else APP.say('Thanks, we’ve got your application. We’ll let you know what happens next.', 3400);
        } } });
      } } });
    }
    var mt = S.method;
    return h(PS.Screen, { tint: true, scrollRef: sc, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Apply a loan', right: APP.tune() },
      bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !S.agree, onClick: confirm }, 'Confirm')) },
      h(PS.AmountCard, { amount: l.amount, min: LOAN.min, max: C.max, step: LOAN.step, boost: !!Lm, terms: LOAN.terms, term: l.term, termNote: LOAN.days + ' days / term',
        onAmount: function (v) { setL(Object.assign({}, APP.S.L, { amount: v })); }, onCommit: function (v) { APP.loanCheck(Object.assign({}, APP.S.L, { amount: v })); },
        onTerm: function (t) { APP.loanCheck(Object.assign({}, APP.S.L, { term: t })); }, onEdit: function () { APP.go('amount', { edit: true }); } }),
      rows.length ? h(PS.CouponsSection, { count: coupons.length, onSeeAll: function () { APP.set({ draft: { tab: 'discount', disc: l.disc, lim: l.lim } }); APP.open('picker'); }, rows: rows }) : null,
      h(PS.OrderDetails, { link: 'View payment schedule', onLink: function () { APP.open('plan'); }, rows: [
        { label: 'Daily fee', value: money(C.daily) }, { label: 'First payment date', value: CS.date(1) }, { label: 'Per installment', value: money(C.per) },
        { label: 'Discount', value: C.save ? '-' + money(C.save) : null, tone: 'positive' }, { label: 'Total payment', value: money(C.total) }] }),
      h(PS.ProtectionCard, { body: 'Get covered for up to ₱30,000, so your family isn’t left with the loan if a medical emergency or accident happens.', onLink: function () { APP.say('Benefits aren’t part of the test app yet.'); } }),
      h(PS.MethodCard, { name: mt.name, last4: mt.last4, logo: logoOf(mt), logoExt: 'png', onClick: function () { APP.go('method'); } }),
      h(PS.Agreement, { on: !!S.agree, nudge: n[0], onToggle: function () { APP.set({ agree: !S.agree }); } }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), ' and ', h('b', null, 'Loan Disclosure Statement'), '.'));
  });

  /* ---- sheets of the loan page ---- */
  APP.sheet('picker', { kind: 'page', label: 'Coupons', render: function Picker() {
    var S = APP.use(), l = S.L, draft = S.draft || { tab: 'discount', disc: l.disc, lim: l.lim }, coupons = S.coupons, kind = draft.tab;
    var discs = coupons.filter(function (c) { return c.kind === 'discount'; }), lims = coupons.filter(function (c) { return c.kind === 'limit'; }), list = kind === 'limit' ? lims : discs;
    var c2 = CS.calc(l.amount, l.term, find(coupons, draft.disc), find(coupons, draft.lim)), top = CS.best(coupons, kind, l.amount, l.term);
    var sorted = list.slice().sort(function (a, b) { return (CS.fits(b, l.amount, l.term) ? 1 : 0) - (CS.fits(a, l.amount, l.term) ? 1 : 0); });
    function confirm() {
      var n = Object.assign({}, l, { disc: draft.disc, lim: draft.lim }), max = CREDIT.available + (find(coupons, n.lim) ? find(coupons, n.lim).add : 0);
      if (n.amount > max) { n.amount = max; APP.say('Your amount is now ' + money(max, 0) + ', your limit without the increase.'); }
      APP.set({ L: n, sheet: null });
    }
    return h(PS.CouponPicker, { tab: kind, onTab: function (t) { APP.set({ draft: Object.assign({}, draft, { tab: t }) }); }, onClose: APP.close,
      tabs: [{ id: 'discount', label: 'Discount', count: discs.length }, { id: 'limit', label: 'Limit increase', count: lims.length }],
      intro: 'You can use 1 interest discount and 1 limit increase on each loan.', loan: termLine(l.amount, l.term),
      summary: h(PS.Summary, { total: c2.total, was: c2.was, saved: c2.save, newLimit: c2.limit, onConfirm: confirm }) },
      sorted.length ? sorted.map(function (c) {
        var ok = CS.fits(c, l.amount, l.term), on = (kind === 'limit' ? draft.lim : draft.disc) === c.id;
        return h(PS.CouponTicket, { key: c.id, value: c.value, label: c.label, rule: c.rule, ruleLong: c.long, meta: c.meta, expiresAt: c.expiresAt, best: ok && top === c,
          state: on ? 'selected' : ok ? 'default' : 'unavailable', reason: CS.why(c, l.amount, l.term), action: 'pick',
          onPick: function () { var r = CS.why(c, l.amount, l.term); if (r) { APP.say(r + '.'); return; }
            var d = Object.assign({}, draft); if (c.kind === 'limit') d.lim = d.lim === c.id ? null : c.id; else d.disc = d.disc === c.id ? null : c.id; APP.set({ draft: d }); },
          onRule: function (el) { APP.tipAt(el, c.rule); } });
      }) : h(PS.EmptyState, { title: kind === 'limit' ? 'No limit increases yet' : 'No discounts yet', body: 'When you get one, it shows up here.', style: { marginTop: 72 } }));
  } });
  APP.sheet('keep', { kind: 'card', label: 'Keep your coupon?', render: function Keep() {
    var S = APP.use(), keep = S.keep || [], k = keep[0], K = k ? find(S.coupons, k.id) : null;
    if (!K) return null;
    function next() { var rest = keep.slice(1); APP.set({ keep: rest, sheet: rest.length ? APP.S.sheet : null }); }
    function keepIt() {
      var l = Object.assign({}, APP.S.L, k.need); if (K.kind === 'limit') l.lim = K.id; else l.disc = K.id;
      if (k.need.amount && K.kind !== 'limit' && !find(S.coupons, l.lim) && l.amount > CREDIT.available) l.amount = CREDIT.available;
      APP.set({ L: l }); next(); APP.say(k.need.amount ? 'Your loan is now ' + termLine(l.amount, l.term) + '.' : 'Your loan is now ' + l.term + ' terms.');
    }
    var kept = Object.assign({ amount: k.amount, term: k.term }, k.need), lim = K.kind === 'limit', facts = [{ label: 'Your loan', value: termLine(k.amount, k.term).replace('.00', '') }];
    facts.push(lim ? { label: 'Your credit limit with it', value: money(CREDIT.available + K.add, 0), tone: 'positive' } : { label: 'You’d save', value: money(CS.calc(kept.amount, kept.term, K).save, 2), tone: 'positive' });
    var body = k.byTerm ? 'You picked ' + k.term + ' terms. This coupon works with ' + CS.termsText(K.terms) + ', so we’ve taken it off. Keep it and we’ll switch you to ' + k.need.term + ' terms.'
      : 'Your new amount is ' + money(k.amount, 0) + '. This coupon needs a loan of ' + money(K.min, 0) + ' or more, so we’ve taken it off. Keep it and we’ll set your loan to ' + money(k.need.amount, 0) + '.';
    return h(PS.Decision, { art: K.type, title: 'Keep your ' + CS.short(K) + '?', body: body, facts: facts, onClose: next, primary: { label: 'Keep coupon', onClick: keepIt }, secondary: { label: 'Don’t use coupon', onClick: next } });
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
      APP.run(function () { APP.set({ method: { kind: st.kind, id: st.id, name: st.name, last4: st.acct.slice(-4) }, loan: APP.S.loan === 'failed' ? 'reviewing' : APP.S.loan }); APP.back(); APP.say('We’ll send your money to ' + st.name + ' ending in ' + st.acct.slice(-4) + '.'); });
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
  APP.sheet('banks', { kind: 'page', label: 'Choose your bank', className: 'app-banks', render: function Banks() {
    var s = R.useState(''), q = s[0], setQ = s[1], groups = {}, keys;
    AD.banks.filter(function (b) { return b[1].toLowerCase().indexOf(q.trim().toLowerCase()) >= 0; }).forEach(function (b) { var k = b[1].charAt(0).toUpperCase(); (groups[k] = groups[k] || []).push(b); });
    keys = Object.keys(groups).sort();
    return h(R.Fragment, null,
      h('div', { className: 'app-banks__head' }, h(PS.Search, { value: q, onChange: setQ, placeholder: 'Search bank name' }), h(PS.Close, { onClick: APP.close })),
      h('div', { className: 'app-banks__body' }, keys.length ? keys.map(function (k) {
        return h(PS.Card, { key: k, className: 'app-banks__group' }, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, k), groups[k].map(function (b, i) {
          return h(R.Fragment, { key: b[0] }, i ? h(PS.Divider) : null, h(m.button, Object.assign({ type: 'button', className: 'app-banks__row ps-t-body-md-em', onClick: function () { APP.set({ pickedBank: b, sheet: null }); } }, PS.press()),
            h('img', { src: PS.asset('logos/pay-' + b[0] + '.png'), alt: '', width: 16, height: 16 }), b[1]));
        }));
      }) : h(PS.EmptyState, { title: 'No matching banks found', body: 'Check the spelling or try another name.', style: { marginTop: 72 } })));
  } });

  /* ---- coupon centre ---- */
  APP.screen('coupons', function Coupons() {
    var S = APP.use(), s = R.useState('use'), tab = s[0], setTab = s[1], coupons = S.coupons;
    var list = tab === 'use' ? coupons : tab === 'used' ? S.used : CS.expired, bestD = CS.best(coupons, 'discount', CREDIT.available, LOAN.term);
    var empty = { use: ['No coupons yet', 'When you get a coupon, you’ll see it here.'], used: ['No used coupons yet', 'Coupons you use on a loan show up here.'], expired: ['No expired coupons', 'Coupons that run out before you use them show up here.'] }[tab];
    var body = list.length ? h('div', { className: 'ps-list' }, list.map(function (c) {
      return h(PS.CouponTicket, { key: c.id, value: c.value, label: c.label, rule: c.rule, ruleLong: c.long, meta: c.meta, expiresAt: tab === 'use' ? c.expiresAt : null, best: tab === 'use' && bestD === c,
        state: tab === 'use' ? 'default' : tab, action: tab === 'use' && S.user === 'approved' ? 'use' : 'none', onUse: function () { APP.openLoan(c.id); }, onRule: function (el) { APP.tipAt(el, c.rule); } });
    })) : h(PS.EmptyState, { title: empty[0], body: empty[1], style: { marginTop: 112 } });
    return h(PS.Screen, { colTop: 174, colBottom: 48, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Coupons', right: APP.tune(), solid: true, extraHeight: 58,
      extra: h('div', { className: 'app-ctabs' }, h(PS.Tabs, { id: 'app-centre', value: tab, onChange: function (t) { APP.set({ tip: null }); setTab(t); },
        items: [{ id: 'use', label: 'To use', count: coupons.length || null }, { id: 'used', label: 'Used' }, { id: 'expired', label: 'Expired' }] })) } },
      h(APP.Loaded, { k: 'coupons', top: 60 }, h(PS.Crossfade, { k: tab }, body)));
  });

  /* ---- your loan application: in review, or the transfer failed ---- */
  APP.screen('order', function Order() {
    var S = APP.use(), o = S.order || { amount: 2000, term: 4, first: 1234.5, date: 'Jul 5, 2026', method: S.method }, failed = S.loan === 'failed';
    return h(APP.Page, { title: 'Your loan application', load: 'order', bottom: failed ? h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { APP.go('method'); } }, 'Change withdrawal method')) : null },
      h('div', { className: 'app-order__head' }, h('p', { className: 'ps-t-body-lg ps-c-secondary' }, 'You applied for a loan'), h(PS.Amount, { value: o.amount, className: 'app-order__amount' })),
      h(PS.Card, { className: 'app-order__status' }, h('span', { className: PS.cx('ps-strip__icon', failed && 'is-negative') }, h(PS.Icon, { name: failed ? 'alert-circle' : 'pending', size: 16, color: 'inverse' })),
        h('div', null, h('p', { className: 'ps-t-label-md' }, failed ? 'We couldn’t send your loan' : 'We’re reviewing your application'),
          h('p', { className: 'ps-t-caption-xs ps-c-tertiary' }, failed ? 'The transfer to your account didn’t go through. Change your withdrawal method to try again.' : 'Your loan is under review. We’ll let you know once we’re sending your money.'))),
      h(PS.Section, { label: 'DETAILS' }, h(PS.Card, { className: 'ps-details' }, h(PS.Rows, { rows: [{ label: 'First payment', value: money(o.first) }, { label: 'Loan term', value: o.term + ' terms (' + LOAN.days + ' days / term)' },
        { label: 'Loan date', value: o.date }, { label: 'Withdrawal method', value: o.method.name + ' ending in ' + o.method.last4 }] }))));
  });
})();
