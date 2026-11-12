/* PeraSure app — Account and what hangs off it. Figma section "Account" (52:5059 logged in, 52:4257 logged out, 52:4390 log out,
   52:3892 credit limit hub, 52:4160 / 52:4181 credit history, 52:4582 contact us, 52:4640 about, 52:4598 SEC, 52:4622 BIR,
   52:5052 manage, 52:4718… delete), "inbox" (52:10300 list, 52:10338 detail), "Loan history" (52:9635, 52:9668, 52:9719). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, AD = window.AD, CS = window.CS, h = R.createElement, m = PS.m, money = PS.money, T = APP.T;
  var MT_Y = PS.MT.Y.block;
  function soon(what) { return function () { APP.say(what + ' isn’t part of the test app yet.'); }; }
  function go(name, params) { return function () { APP.go(name, params); }; }

  /* ---- the Account tab ---- */
  APP.tabs.account = function Account() {
    var S = APP.use(), n = S.coupons.length, inUse = APP.signedIn(), unread = (S.inbox || INBOX()).filter(function (x) { return x.unread; }).length;
    var head = { left: h(PS.Brand), right: [APP.tune(), inUse ? h(PS.Glass, { key: 'h', icon: 'headset', iconSize: 18, label: 'Contact us', onClick: APP.support })
      : h(PS.HomeActions, { key: 'a', actions: [{ icon: 'gift', label: 'Rewards', onClick: soon('Rewards') }, { icon: 'headset', label: 'Contact us', onClick: APP.support }] })] };
    var login = go('login');
    var menu = [
      { id: 'inbox', icon: 'inbox', label: 'Inbox', badge: inUse ? (unread ? 'New' : null) : 'New', onClick: inUse ? go('inbox') : login },
      { id: 'coupons', icon: 'coupon', label: 'Coupons', badge: n ? n + (n === 1 ? ' coupon' : ' coupons') : null, onClick: inUse ? go('coupons') : login },
      { id: 'history', icon: 'history', label: 'Loan history', onClick: inUse ? go('history') : login }, { id: 'faq', icon: 'info', label: 'FAQs', onClick: go('faqs') },
      { id: 'contact', icon: 'support-chat', label: 'Contact us', onClick: APP.support }, { id: 'manage', icon: 'user-circle', label: 'Manage account', onClick: inUse ? go('manage') : login },
      { id: 'about', icon: 'help-circle', label: 'About PeraSure', onClick: go('about') }];
    if (!inUse) return h(PS.Screen, { colBottom: 120, className: 'app-account', top: head },
      h('div', { className: 'app-guest' }, h(PS.Profile, { icon: 'user', name: 'Hello!' }), h(PS.Button, { size: 'md', block: true, onClick: login }, 'Sign up or log in')),
      h(PS.CreditLimitCard, { masked: true, onClick: login }),
      h(PS.Menu, { items: menu }),
      h(PS.Social, {}));
    return h(PS.Screen, { colBottom: 120, className: 'app-account', top: head },
      h(PS.Profile, AD.user),
      h(PS.CreditLimitCard, { total: CS.credit.total, available: CS.credit.available, onClick: go('hub') }),
      h(PS.Menu, { items: menu }),
      h(PS.Social, {}),
      h(PS.Button, { variant: 'inverse', block: true, onClick: function () { APP.open('logout'); } }, 'Log out'));
  };
  /* a confirm sheet: title + close, text, two buttons (log out, delete) */
  function Confirm(p) {
    return h(R.Fragment, null, h('div', { className: 'app-confirm__text' }, h('div', { className: 'app-sheethead app-sheethead--left' }, h('p', { className: 'ps-t-title-sm' }, p.title), h(PS.Close, { onClick: APP.close })),
        h('p', { className: 'ps-t-body-md' }, p.body)),
      h('div', { className: 'app-confirm__acts' }, p.cancel ? h(PS.Button, { variant: 'inverse', size: 'md', className: 'ps-btn--ghost', onClick: APP.close }, p.cancel) : null, h(PS.Button, { size: 'md', onClick: p.onOk }, p.ok)));
  }
  APP.sheet('logout', { kind: 'card', label: 'Log out', className: 'app-confirm', render: function () {
    return h(Confirm, { title: 'Log out', body: 'Are you sure you want to log out?', cancel: 'Cancel', ok: 'Log out', onOk: function () { APP.close(); APP.run(function () { APP.set({ user: 'guest', tab: 'home' }); APP.say('You’re logged out.'); }); } });
  } });

  /* ---- credit limit hub and credit history ---- */
  APP.screen('hub', function Hub() {
    var c = CS.credit, used = c.total - c.available;
    return h(APP.Page, { title: 'Credit limit', load: 'hub' },
      h(PS.HubCard, { total: c.total, used: used, available: c.available, onWithdraw: function () { APP.borrow(); }, onInfo: function (e) { APP.tipAt(e.currentTarget, 'Your total credit limit is the most you can borrow at one time.'); } }),
      h(PS.Tiles, { title: 'Credit history', items: [{ id: 'adj', art: 'credit-adjustments', label: 'Credit adjustments', onClick: go('credit', { tab: 'adj' }) }, { id: 'act', art: 'borrowing-activity', label: 'Borrowing activity', onClick: go('credit', { tab: 'act' }) }] }),
      h(PS.Tips, { title: 'How to improve your credit limit', items: [
        { title: 'Repay on time', body: 'Pay on or before your due date to qualify for limit increases from ₱5,000 to ₱15,000.' },
        { title: 'Use loans responsibly', body: 'Regular and responsible borrowing and repayment can help build a better credit profile.' },
        { title: 'Keep your information complete', body: 'Accurate profile and reference information helps us assess your eligibility.' }] }));
  });
  /* credit history, written from the app's numbers (CS.credit, CS.current) so it agrees with the cards: each line says what the credit was
     after it, on its own date. The story: ID check and documents in September (the limit), a first loan of ₱3,000 taken and repaid in
     October, the temporary credit added on Nov 6, and the current loan (its date follows Tune → Loan).
     K0: the numbers the app opened with; a loan ordered since then (S.order) is one more line on top */
  var K0 = Object.assign({}, CS.credit), CUR = CS.current, m0 = function (n) { return money(n, 0); }, HELD = CUR && !/^(active|overdue)$/.test(CUR.state);
  var CUR_AFTER = CUR ? (HELD ? K0.total : K0.limit) - CUR.amount : 0;      /* a loan taken before Nov 6 was taken before the temporary credit */
  var ACT0 = (CUR ? [{ icon: 'money-out', title: HELD ? 'Loan in review' : 'Loan approved', sub: m0(CUR.amount) + (HELD ? ' is held for this loan' : ' was used for this loan'), amount: '- ' + m0(CUR.amount),
      date: CUR.date + (HELD ? ', 09:30' : ', 14:05'), nv: m0(CUR_AFTER) }] : []).concat([
    { icon: 'money-in', tone: 'positive', title: 'Repayment completed', sub: 'Available credit was restored', amount: '+ ' + m0(3000), up: true, date: 'Oct 18, 2026, 10:42', nv: m0(K0.limit) },
    { icon: 'money-out', title: 'Loan approved', sub: m0(3000) + ' was used for this loan', amount: '- ' + m0(3000), date: 'Oct 3, 2026, 16:20', nv: m0(K0.limit - 3000) }]);
  function acts(S) {
    return (S.order ? [{ icon: 'money-out', title: 'Loan in review', sub: m0(S.order.amount) + ' is held for this loan', amount: '- ' + m0(S.order.amount), date: CS.today + ', 09:30', nv: m0(CS.credit.available) }] : []).concat(ACT0);
  }
  var ADJ = (K0.temporary ? [{ title: 'Temporary credit added', sub: 'Valid until ' + K0.temporaryUntilLong + '. It is part of your total credit until then', amount: '+ ' + m0(K0.temporary), up: true, date: 'Nov 6, 2026, 08:00', nv: m0(K0.total) }] : []).concat([
    { title: 'Documents verified', sub: 'You added documents and a reference contact, which unlocked the next credit tier', amount: '+ ' + m0(5000), up: true, date: 'Sep 24, 2026, 06:10', nv: m0(K0.limit) },
    { title: 'ID verified', sub: 'You passed the government ID check and the face scan', amount: '+ ' + m0(K0.limit - 5000), up: true, date: 'Sep 20, 2026, 11:15', nv: m0(K0.limit - 5000) }]);
  APP.screen('credit', function Credit(p) {
    var s = R.useState(p.params.tab || 'adj'), tab = s[0], S = APP.S, none = S.loan === 'none' && S.user !== 'approved';
    var rows = tab === 'act' ? acts(S) : ADJ;
    return h(PS.Screen, { secondary: true, colTop: 172, colBottom: 48, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Credit history', right: APP.tune(), solid: true, extraHeight: 56,
      extra: h('div', { className: 'app-ptabs' }, h(PS.Tabs, { id: 'app-credit', split: true, value: tab, onChange: s[1], items: [{ id: 'adj', label: 'Credit adjustments' }, { id: 'act', label: 'Borrowing activity' }] })) } },
      h(APP.Loaded, { k: 'credit', rise: false }, h(PS.Crossfade, { k: tab, rise: true, className: none ? null : 'app-stack-12' },
        none ? h(PS.EmptyState, { title: 'No limit history yet', body: 'Complete your profile check and link your e-wallet to activate your revolving credit limit.', page: true })
        : rows.map(function (r, i) { return h(PS.ActivityItem, Object.assign({ key: i, note: tab === 'act' ? 'Available:' : 'Total credit:', noteValue: r.nv }, r)); }))));
  });

  /* ---- contact us ---- */
  APP.screen('support', function Support() {
    return h(APP.Page, { title: 'Contact us' },
      h(APP.Head, { title: 'PeraSure customer services', body: 'We’re here to help with any questions about your loan or the PeraSure app.' }),
      h('div', { className: 'app-stack-12' }, h('div', { className: 'app-stack-16' },
        h(PS.LinkList, { items: [{ id: 'chat', icon: 'support-chat', label: 'Online customer support', onClick: soon('Live chat') }] }),
        h(PS.LinkList, { items: [{ id: 'tel', icon: 'phone', label: 'Hotline', value: '(+632)82712800', onClick: function () { APP.say('Calls open your phone app.'); } },
          { id: 'mail', icon: 'email', label: 'Email', value: 'customercare@perasure.ph', onClick: function () { APP.say('Copied our email address.'); } },
          { id: 'wa', icon: 'whatsapp', label: 'WhatsApp', value: '+63 9173118701', onClick: function () { APP.say('WhatsApp opens outside the test app.'); } }] })),
        h('p', { className: 'ps-t-caption-sm ps-c-tertiary', style: { textAlign: 'center' } }, 'Customer service hours: 8:00 AM - 8:00 PM')));
  });

  /* ---- about, SEC and BIR registration ---- */
  APP.screen('about', function About() {
    var doc = function (title) { return go('doc', { title: title }); };
    return h(APP.Page, { title: 'About PeraSure' },
      h('div', { className: 'app-about' }, h('span', { className: 'ps-brand__mark app-about__logo' }, h('img', { src: PS.asset('logos/perasure-mark.svg'), alt: '' })), h('p', { className: 'ps-t-title-sm' }, 'PeraSure'), h('p', { className: 'ps-t-caption-sm ps-c-secondary' }, 'Version 3.2.9 (2355)')),
      h(PS.LinkList, { title: 'Legal', tone: 'link', items: [{ label: 'Terms of Service', onClick: doc('Terms of Service') }, { label: 'Privacy & Data Collection Policy', onClick: doc('Privacy & Data Collection Policy') },
        { label: 'Loan Agreement', onClick: doc('Loan Agreement') }, { label: 'Ownbank Platform Service', onClick: doc('Ownbank Platform Service') }] }),
      h(PS.LinkList, { title: 'Social', tone: 'link', items: ['TikTok', 'Facebook', 'Instagram'].map(function (x) { return { label: 'Follow PeraSure on ' + x, onClick: soon(x) }; }).concat([{ label: 'Subscribe to PeraSure on YouTube', onClick: soon('YouTube') }]) }),
      h(PS.LinkList, { items: [{ label: 'SEC Registration', onClick: go('sec') }, { label: 'BIR Registration', onClick: go('bir') }] }),
      h('p', { className: 'ps-t-caption-sm app-foot40' }, h('span', null, h('i', { 'aria-hidden': true }), 'PeraSure'), '© 2026 PeraSure. All rights reserved.'));
  });
  APP.screen('sec', function Sec() {
    return h(APP.Page, { title: 'SEC Registration' },
      h(PS.Card, { className: 'app-seccard' }, h('p', { className: 'ps-t-body-lg', style: { fontWeight: 600 } }, 'Sulit Lending Corporation'),
        h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'Authorized and registered in compliance with Republic Act No.9474 (Lending Company Regulation Act of 2007) of the Republic of the Philippines.')),
      h(PS.Facts, { rows: [{ label: 'SEC registered number', value: '2020100002616-03' }, { label: 'Certificate of authority (CA)', value: 'No. 3410' },
        { label: 'Corporate headquarters', value: 'Brgy. Wack-Wack, Mandaluyong City, Metro Manila' }, { label: 'In-App product brand', value: 'PeraSure Secure MicroCredits' }] }),
      h('p', { className: 'ps-t-caption-xs ps-c-tertiary', style: { textAlign: 'center' } }, 'SULIT LENDING is audited regularly by the Securities and Exchange Commission (SEC) to guarantee transparent collection policies under Fair Debt Collection Practices guidelines.'));
  });
  APP.screen('bir', function Bir() {
    return h(APP.Page, { title: 'BIR Registration' },
      h(PS.Card, { className: 'app-seccard app-bir' }, h('img', { src: PS.asset('art/bir-badge.png'), alt: 'Bureau of Internal Revenue: registered, with a QR code' }),
        h('p', { className: 'ps-t-caption-xs ps-c-tertiary' }, 'Scan the QR code to verify our registration with the Bureau of Internal Revenue.')),
      h(PS.Facts, { rows: [{ label: 'Registered name', value: 'Sulit Lending Corporation' }, { label: 'Registration Seal No.', value: '050RC20260000001686' }] }),
      h(PS.LinkList, { items: [{ label: 'BIR Registration', trail: 'link', onClick: function () { APP.say('The BIR website opens outside the test app.'); } }] }));
  });
  APP.screen('doc', function Doc(p) {
    return h(APP.Page, { title: p.params.title, load: 'doc' }, h(PS.Card, null, h('p', { className: 'ps-t-body-md ps-c-secondary' }, 'The full text of the ' + p.params.title + ' goes here. It comes from the backend, so the test app shows this note instead.')));
  });

  /* ---- manage account: change number, delete ---- */
  APP.screen('manage', function Manage() {
    return h(APP.Page, { title: 'Manage account' }, h(PS.LinkList, { items: [{ label: 'Change phone number', onClick: go('phone-old') }, { label: 'Delete my account', onClick: go('delete') }] }));
  });
  /* Reasons: a card of reasons with a radio each, then a box for more (delete account, cancel a loan) · items · value (index) · onChange · text · onText */
  function Reasons(p) {
    return h(PS.Card, { className: 'app-reasons' }, p.items.map(function (w, i) {
      return h(R.Fragment, { key: i }, i ? h(PS.Divider) : null, h('button', { type: 'button', role: 'radio', 'aria-checked': p.value === i, className: 'app-reason ps-t-title-14', onClick: function () { p.onChange(i); } },
        h('span', null, w), h('span', { className: PS.cx('ps-radio', p.value === i && 'is-on') })));
    }), h('div', { className: 'app-reasons__more' }, h('textarea', { value: p.text, maxLength: 200, placeholder: 'Tell us more… (Optional)', 'aria-label': 'Tell us more', onChange: function (e) { p.onText(e.target.value); } }),
      h('span', { className: 'ps-t-caption-xs ps-c-placeholder' }, p.text.length + '/200 characters')));
  }
  var WHY = ['I’m having trouble logging in', 'I’m having trouble applying for or repaying a loan', 'I have concerns about fees', 'I have security concerns', 'I no longer need PeraSure', 'Other reason'];
  APP.screen('delete', function Delete() {
    var s = R.useState(0), why = s[0], t = R.useState(''), text = t[0];
    return h(APP.Page, { title: 'Delete my account', colBottom: 180, bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { APP.back(); } }, 'I changed my mind'),
        h(PS.Button, { variant: 'text', block: true, onClick: function () { APP.open(APP.S.loan === 'none' ? 'delete-ok' : 'delete-no'); } }, 'Continue')) },
      h(APP.Head, { title: 'Why are you deleting your account?', body: 'Your feedback helps us improve PeraSure.' }),
      h(Reasons, { items: WHY, value: why, onChange: s[1], text: text, onText: t[1] }));
  });
  APP.sheet('delete-ok', { kind: 'card', label: 'Delete your account?', className: 'app-confirm', render: function () {
    return h(Confirm, { title: 'Delete your account?', body: 'Once you close your account, your loan limit goes back to its starting amount. We also remove your PeraSure credit history and account data. This can’t be undone.',
      cancel: 'Cancel', ok: 'Continue', onOk: function () { APP.close(); APP.set({ otp: { then: function () { APP.run(function () { APP.set({ user: 'guest' }); APP.home('home'); APP.say('We’ve deleted your account.', 3200); }); } } }); } });
  } });
  APP.sheet('delete-no', { kind: 'card', label: 'You can’t delete your account yet', className: 'app-confirm', render: function () {
    return h(Confirm, { title: 'You can’t delete your account yet', body: 'You still have a loan application in progress or a loan to repay. You can close your account once it’s complete or fully repaid.', ok: 'I understand', onOk: APP.close });
  } });

  /* ---- rating: after a loan (Tune → Ask for a rating). Good ratings go to the store, the others to support. ---- */
  var RATE = {
    ask: { pic: h(PS.Anim, { name: 'doc-verify', size: 100 }), title: 'How was your experience with PeraSure?' },
    good: { pic: h('img', { src: PS.asset('art/stars.svg'), alt: '5 stars', style: { width: '9.25rem', height: '1.75rem' } }), title: 'Thank you for your feedback!', body: 'Share your experience with PeraSure by leaving a review on Google Play.' },
    bad: { pic: h(PS.Anim, { name: 'customer-service-chat', size: 100 }), title: 'Help us improve PeraSure', body: 'Share your concerns with our online customer service. We’ll get back to you soon.' } };
  APP.sheet('rating', { kind: 'card', label: 'Rate PeraSure', className: 'app-rating', render: function Rating() {
    var s = R.useState('ask'), step = s[0];
    function done() { APP.set({ rated: true, sheet: null }); }
    var P = step === 'ask' ? { pic: h(PS.Anim, { name: 'doc-verify', size: 100 }), title: 'How was your experience with PeraSure?', ok: 'Satisfied', onOk: function () { s[1]('good'); }, no: 'Not satisfied', onNo: function () { s[1]('bad'); } }
      : step === 'good' ? { head: 'Thank you for your feedback!', pic: h('img', { src: PS.asset('art/stars.svg'), alt: '5 stars', style: { width: '9.25rem', height: '1.75rem' } }), title: 'Thank you for your feedback!',
          body: 'Share your experience with PeraSure by leaving a review on Google Play.', ok: 'Leave a review', onOk: function () { done(); APP.say('Google Play opens outside the test app.'); }, no: 'Later', onNo: done }
      : { head: 'Thank you for your feedback!', pic: h(PS.Anim, { name: 'customer-service-chat', size: 100 }), title: 'Help us improve PeraSure',
          body: 'Share your concerns with our online customer service. We’ll get back to you soon.', ok: 'Contact customer support', onOk: function () { done(); APP.support(); }, no: 'Later', onNo: done };
    /* the three steps lie on top of each other, so the sheet keeps the height of the tallest and nothing jumps (owner); the step shown
       crossfades in (ENTER, 3 px blur), the one before it out (LEAVE) — the title and the buttons swap their words the same way */
    var all = ['ask', 'good', 'bad'].map(function (k) {
      var Q = k === step ? P : RATE[k], on = k === step;
      return h(m.div, { key: k, className: PS.cx('app-rating__page', k === 'ask' && 'is-ask'), 'aria-hidden': !on, initial: false,
        animate: on ? { opacity: 1, filter: 'blur(0px)', transition: PS.MT.ENTER } : { opacity: 0, filter: 'blur(' + PS.MT.BLUR + 'px)', transition: PS.MT.LEAVE },
        style: { gridArea: '1 / 1', pointerEvents: on ? 'auto' : 'none' } }, Q.pic,
        h('div', null, h('p', { className: 'ps-t-title-sm' }, Q.title), Q.body ? h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, Q.body) : null));
    });
    return h(R.Fragment, null,
      h('div', { className: 'app-sheethead app-sheethead--left' }, h(PS.Swap, { k: step, block: true }, h('span', { className: 'ps-t-title-16' }, P.head || '')), h(PS.Close, { onClick: done })),
      h('div', { className: 'app-rating__pages' }, all),
      h('div', { className: 'app-rating__acts' }, h(PS.Button, { block: true, onClick: P.onOk }, h(PS.Swap, { k: step }, h('span', null, P.ok))),
        h(PS.Button, { variant: 'text', block: true, onClick: P.onNo }, h(PS.Swap, { k: step }, h('span', null, P.no)))));
  } });

  /* ---- inbox ---- */
  function INBOX() {
    if (T.inbox === 'empty') return [];
    /* newest first; the amounts and dates are the app's (CS.credit, CS.current): the coupon, the loan once it has been sent (repaying / overdue),
       and the limit from when the documents were verified (Sep 24) */
    var cur = CS.current, mt = APP.S.method, list = [{ id: 'm3', kind: 'Reminder', time: '5d ago', title: 'You have a new coupon', body: '25% off first-payment interest on your next loan. Use it before Nov 13, 2026.' }];
    if (cur && APP.S.repay) list.push({ id: 'm2', kind: 'Reminder', time: cur.ago + 'd ago', title: 'Your ' + money(cur.amount) + ' loan has been sent',
      body: 'We’ve sent ' + money(cur.amount) + ' to your ' + mt.name + ' ending in ' + mt.last4 + '. Your first payment is due on ' + cur.dues[0].dueShort + '.' });
    list.push({ id: 'm1', kind: 'System notification', time: '49d ago', title: 'Your credit limit is ready', body: 'You’ve been approved for a revolving credit limit of ' + money(CS.credit.limit, 0) + '. You can choose how much to borrow based on your available credit. As you repay on time, your available credit goes up.', cta: 'Go to borrow' });
    return list.map(function (x) { return Object.assign({ unread: T.inbox !== 'read' }, x); });
  }
  APP.screen('inbox', function Inbox() {
    var S = APP.use(), list = S.inbox || INBOX(), s = R.useState(list.some(function (x) { return x.unread; }) ? 'unread' : 'read'), tab = s[0];
    var un = list.filter(function (x) { return x.unread; }), shown = tab === 'unread' ? un : list.filter(function (x) { return !x.unread; });
    function open(msg) { APP.set({ inbox: list.map(function (x) { return x.id === msg.id ? Object.assign({}, x, { unread: false }) : x; }) }); APP.go('message', { msg: msg }); }
    var empty = !list.length ? ['No messages yet', 'When we have news about your loan or account, you’ll see it here.'] : tab === 'unread' ? ['You’re all caught up', 'You’ve read every message.'] : ['No read messages yet', 'Messages you open show up here.'];
    var markAll = h(PS.AP, null, un.length && tab === 'unread' ? h(m.div, Object.assign({ key: 'fab', className: 'app-fab' }, PS.fade(MT_Y)),
      h(PS.Glass, { round: false, onClick: function () { APP.set({ inbox: list.map(function (x) { return Object.assign({}, x, { unread: false }); }) }); } }, 'Mark all read')) : null);
    return h(PS.Screen, { secondary: true, colTop: 172, colBottom: un.length && tab === 'unread' ? 124 : 48, overlay: markAll, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: 'Inbox', solid: true, extraHeight: 56,
      right: APP.tune(),
      extra: h('div', { className: 'app-ptabs app-ptabs--16' }, h(PS.Tabs, { id: 'app-inbox', split: true, value: tab, onChange: s[1], items: [{ id: 'unread', label: 'Unread' + (un.length ? ' (' + un.length + ')' : '') }, { id: 'read', label: 'Read' }] })) } },
      h(APP.Loaded, { k: 'inbox', rise: false }, h(PS.Crossfade, { k: tab + shown.length, rise: true, className: shown.length ? 'app-stack-12' : null }, shown.length ? shown.map(function (x) {
          return h(PS.InboxItem, { key: x.id, kind: x.kind, time: x.time, unread: x.unread, title: x.title, body: x.body, onOpen: function () { open(x); } }); }).concat(
          h('p', { key: 'end', className: 'ps-t-caption-xs ps-c-placeholder', style: { textAlign: 'center' } }, 'You have reached the end.'))
        : h(PS.EmptyState, { title: empty[0], body: empty[1], page: true }))));
  });
  APP.screen('message', function Message(p) {
    var x = p.params.msg;
    return h(APP.Page, { title: x.title, bottom: x.cta ? h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { if (APP.S.user === 'approved') APP.borrow(); else APP.home('home'); } }, x.cta)) : null },
      h('div', { className: 'app-stack-8' }, h('div', { className: 'app-msgmeta ps-t-caption-xs ps-c-tertiary' }, h('span', null, x.kind.toUpperCase()), h('span', null, '12:59, MAY 18')),
        h(PS.Card, { style: { gap: 'var(--spacing-gap-xs)' } }, h('p', { className: 'ps-t-title-md' }, x.title), h('p', { className: 'ps-t-body-md ps-c-secondary' }, x.body))));
  });

  /* ---- loan history ---- */
  var HIST = [{ id: 'h0', date: 'JULY 5, 2026', amount: 2000, state: 'none' }, { id: 'h1', date: null, amount: 2000, state: 'review', label: 'Under review' }, { id: 'h2', date: 'JULY 5, 2026', amount: 2000, state: 'disbursing', label: 'Disbursing' },
    { id: 'h3', date: 'JULY 5, 2026', amount: 2000, state: 'declined', label: 'Not approved' }, { id: 'h4', date: 'JULY 5, 2026', amount: 2000, state: 'action', label: 'Action needed' }, { id: 'h5', date: null, amount: 2000, state: 'paid', label: 'Paid off' }];
  function groups(list) { var out = []; list.forEach(function (x) { if (x.date || !out.length) out.push({ date: x.date, rows: [] }); out[out.length - 1].rows.push(x); }); return out; }
  APP.screen('history', function History() {
    var none = APP.S.user !== 'approved' && APP.S.user !== 'hold' && APP.S.user !== 'expired';
    return h(APP.Page, { title: 'Loan history', load: 'history' }, none ? h(PS.EmptyState, { title: 'No loan history yet', body: 'Your loan records will appear here once you apply.', page: true })
      : h('div', { className: 'app-stack-20' }, groups(HIST).map(function (g, gi) {
          return h('div', { key: gi, className: 'app-stack-8' }, h('p', { className: 'app-seclabel app-seclabel--in8' }, g.date), h('div', { className: 'app-stack-12' }, g.rows.map(function (x) {
            return h(PS.HistoryRow, { key: x.id, amount: x.amount, state: x.state, label: x.label, onClick: x.state === 'action' ? function () { APP.set({ loan: 'failed' }); APP.go('order'); } : x.state === 'review' ? go('order') : go('loan-record', { item: x }) });
          })));
        })));
  });
  APP.screen('loan-record', function Record(p) {
    var x = p.params.item, plan = ['June 10, 2026', 'June 25, 2026', 'July 10, 2026', 'July 25, 2026'], doc = function (t) { return go('doc', { title: t }); };
    return h(APP.Page, { title: 'July 5, 2026', load: 'record' },
      h('div', { className: 'app-order__head' }, h('p', { className: 'app-order__label' }, 'Loan amount'), h(PS.Amount, { value: x.amount, className: 'app-order__amount' })),
      h(PS.Section, { label: 'DETAILS' }, h(PS.Card, { className: 'ps-details' }, h(PS.Rows, { rows: [{ label: 'Repayment amount', value: money(1234.56) }, { label: 'Loan term', value: '4 terms (15 days / term)' }, { label: 'Loan date', value: '23:59:59, July 5 2026' }, { label: 'Withdrawal method', value: 'GCash ending in 4057' }] }))),
      h(PS.Section, { label: 'PAYMENT PLAN' }, h('div', { className: 'app-plan' }, plan.map(function (d) { return h(PS.KV, { key: d, label: d, value: money(500) }); }))),
      h(PS.LinkList, { tone: 'link', items: [{ label: 'Loan contract', onClick: doc('Loan contract') }, { label: 'Loan disclosure statement', onClick: doc('Loan disclosure statement') }, { label: 'Borrower protection plan', onClick: doc('Borrower protection plan') }] }),
      x.state === 'none' || x.state === 'disbursing' ? h('div', { className: 'app-stack-8' }, h(PS.LinkList, { tone: 'link', items: [{ label: 'Cancel my loan', trail: 'none', onClick: go('cancel') }] }),
        h('p', { className: 'ps-t-caption-xs ps-c-tertiary', style: { padding: '0 12px' } }, 'You can cancel your loan within 24 hours after we send the money.')) : null);
  });
  var KNOW = ['You only need to repay the principal amount.', 'We’ll cancel your loan once we get the full principal within 12 hours.', 'A partial or late payment counts as a regular repayment, and your loan stays active.', 'Cancelling often may affect your future loan applications.'];
  APP.screen('cancel', function Cancel() {
    var s = R.useState(-1), why = s[0], t = R.useState(''), reasons = ['I no longer need the money', 'I borrowed by mistake', 'The fees are higher than I expected', 'The repayment terms don’t work for me', 'I’m worried about repaying on time', 'Other reason'];
    function confirm() { if (why < 0) { APP.say('Pick a reason to continue.'); return; } APP.run(function () { APP.go('pay', { total: 2000, method: { name: 'GCash', kind: 'app' } }); }); }
    return h(APP.Page, { title: 'Cancel my loan', colBottom: 180, bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { APP.back(); } }, 'I changed my mind'),
        h(PS.Button, { variant: 'text', block: true, onClick: confirm }, 'Confirm')) },
      h(APP.Head, { title: 'Want to cancel this loan?', body: 'To cancel it, repay the principal within 12 hours.' }),
      h(PS.Section, { label: 'WHAT YOU NEED TO KNOW' }, h(PS.Card, { className: 'app-know' }, KNOW.map(function (k, i) { return h('p', { key: i, className: 'ps-t-body-md' }, h('i', null), k); }))),
      h(PS.Section, { label: 'WHY ARE YOU CANCELLING?' }, h(Reasons, { items: reasons, value: why, onChange: s[1], text: t[0], onText: t[1] })));
  });
})();
