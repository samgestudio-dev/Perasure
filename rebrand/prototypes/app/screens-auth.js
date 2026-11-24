/* PeraSure app — opening, log in, verification code, permissions (Figma section "Register": 52:3780 Login, 52:3797 OTP,
   52:3838 Sending code, 52:3846 Permission, 52:3866 Opening). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, AD = window.AD, CS = window.CS, h = R.createElement, m = PS.m, T = APP.T;

  /* Opening: the splash while the app starts; then the Credit limit increase (Tune) and home */
  APP.screen('opening', function Opening() {
    R.useEffect(function () {
      var t = setTimeout(function () {
        var deep = APP.q.get('page');
        if (T.intro && +T.intro && APP.S.user === 'approved' && CS.credit.temporary > 0) APP.set({ intro: 'play' });
        APP.home(deep === 'payment' || deep === 'account' ? deep : 'home', 0);
        if (deep && APP.screens[deep]) APP.go(deep);
      }, APP.q.get('page') ? 60 : APP.rnd(900, 1500));
      return function () { clearTimeout(t); };
    }, []);
    return h(PS.Splash);
  });

  /* Miniapp loading (legacy 8387:14080) and the App download landing page (legacy 8389:14148): pages outside the app's flow, opened by link */
  APP.screen('miniapp', function Miniapp() { return h(PS.MiniappLoading); });
  APP.screen('download', function Download() {
    return h(PS.Screen, { colBottom: 160, top: { left: h(PS.Brand), right: APP.tune() },
      bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { APP.home('home'); } }, 'Open PeraSure'),
        h(PS.Button, { variant: 'text', block: true, onClick: function () { APP.say('Google Play opens outside the test app.', 'info'); } }, 'Get it on Google Play')) },
      h('div', { style: { position: 'relative' } },
        h(PS.AppPreview, { tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] }, h(PS.Hero, Object.assign({}, AD.hero, { onClick: function () {} })), h(PS.Reviews, { items: AD.reviews })),
        h('div', { className: 'ps-landing__badge' }, h(PS.TrustBadge, { raised: true }))));
  });

  /* Login: phone number → we send a code */
  APP.screen('login', function Login() {
    var s = R.useState(''), phone = s[0], setPhone = s[1], e = R.useState(null), err = e[0], setErr = e[1], a = R.useState(true), agree = a[0], setAgree = a[1];
    function submit() {
      if (!/^9\d{9}$/.test(phone)) { setErr('Enter your 10-digit mobile number, starting with 9.'); return; }
      if (!agree) { APP.say('Tick the box to agree to the terms first.', 'error'); return; }
      APP.set({ phone: phone }); APP.go('sending');
    }
    return h(PS.Screen, { secondary: true, colBottom: 180, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), right: APP.tune() },
      bottom: h(PS.BottomBar, { consent: true },
        h(PS.Consent, { on: agree, onToggle: function () { setAgree(!agree); } }, 'By continuing, you agree to our ', h('b', null, 'Terms of Service'), ' and ', h('b', null, 'Privacy & Data Collection Policy'), '.'),
        h(PS.Button, { block: true, onClick: submit }, 'Log in')) },
      h(APP.Head, { title: h(R.Fragment, null, 'Start your PeraSure', h('br'), 'journey'), body: 'Enter your phone number to get a verification code.' }),
      h('div', { className: 'app-stack-8' },
        h(PS.PhoneField, { value: phone, onChange: function (v) { setPhone(v); setErr(null); }, error: err }),
        h(PS.TextLink, { onClick: function () { APP.go('phone-old'); } }, 'No longer have access to old number?')));
  });

  /* Sending: the code is on its way (animation: Loading state OTP) */
  APP.screen('sending', function Sending(p) {   /* params (phone, then) are handed to the code page */
    R.useEffect(function () { if (!APP.auto) return; var t = setTimeout(function () { APP.swap('otp', p.params, 0); }, APP.rnd(1400, 2400)); return function () { clearTimeout(t); }; }, []);
    return h('div', { className: 'ps-screen app-center' },
      h(PS.SendingCard, { title: 'Sending security code…', body: 'This may take a few seconds' }));
  });

  /* OTP page: six boxes; another way to get the code; resend */
  var WAYS = [{ id: 'sms', icon: 'message', label: 'SMS' }, { id: 'phone', icon: 'phone', label: 'Phone' }, { id: 'viber', icon: 'viber', label: 'Viber' }, { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' }];
  APP.screen('otp', function Otp(p) {
    var s = R.useState({ code: '', err: null, busy: false, left: 59, way: 'sms', tries: 0 }), st = s[0], setSt = s[1];
    function set(o) { setSt(function (x) { return Object.assign({}, x, o); }); }
    var live = R.useRef(true); R.useEffect(function () { return function () { live.current = false; }; }, []);
    R.useEffect(function () { if (st.left <= 0) return; var t = setTimeout(function () { set({ left: st.left - 1 }); }, 1000); return function () { clearTimeout(t); }; }, [st.left]);
    /* the test environment types the code for you (Tune → Verification code: a wrong one first) */
    R.useEffect(function () {
      if (st.code || st.err || !APP.auto) return;
      var code = T.otp === 'wrong' && st.tries < 1 ? '122435' : '122436', ts = [];
      for (var i = 1; i <= 6; i++) (function (i) { ts.push(setTimeout(function () { if (live.current) onCode(code.slice(0, i)); }, 1100 + i * 110)); })(i);
      return function () { ts.forEach(clearTimeout); };
    }, [st.err, st.tries]);
    function onCode(v) {
      set({ code: v, err: null });
      if (v.length < 6) return;
      set({ busy: true });
      setTimeout(function () {
        if (!live.current) return;
        if (v !== '122436') { setSt(function (x) { return Object.assign({}, x, { busy: false, err: 'Incorrect code. Please try again.', tries: x.tries + 1 }); }); return; }
        if (p.params.then) { p.params.then(); return; }
        APP.set({ user: APP.S.user === 'guest' ? 'new' : APP.S.user }); APP.swap('permission', null, 1);
      }, APP.rnd(450, 1000));
    }
    var ph = p.params.phone || APP.S.phone;   /* a new number being confirmed (phone change), else the one logging in */
    return h(PS.Screen, { secondary: true, top: { left: h(PS.Back, { onClick: function () { APP.back(); } }), title: p.params.phone ? 'PeraSure account' : undefined, right: APP.tune() } },   /* the phone change flow's title (legacy 8655:27434) */
      h(APP.Head, { title: 'Verification code sent', body: h(R.Fragment, null, 'Enter the verification code sent to', h('br'), '+63 ••••••' + ph.slice(-4) + ' via ' + (WAYS.filter(function (w) { return w.id === st.way; })[0].label) + '.') }),
      h(PS.OtpForm, { value: st.code, onChange: onCode, error: st.err, disabled: st.busy, ways: WAYS, way: st.way, left: st.left,
        onWay: function (w) { set({ way: w, code: '', err: null, left: 59 }); APP.say('We sent a new code by ' + WAYS.filter(function (x) { return x.id === w; })[0].label + '.', 'success'); },
        onResend: function () { set({ code: '', err: null, left: 59 }); APP.say('We sent you a new code.', 'success'); } }));
  });

  /* Permission: what we ask for and why, before the first use */
  APP.screen('permission', function Permission() {
    var s = R.useState(true), agree = s[0], setAgree = s[1];
    function done() { if (!agree) { APP.say('Tick the box to agree first.', 'error'); return; } APP.run(function () { APP.home('home', 1); }); }
    return h(PS.Screen, { secondary: true, colBottom: 180, top: { left: h(PS.Glass, { round: false }, 'Permissions we need'), right: APP.tune() },
      bottom: h(PS.BottomBar, null,
        h(PS.Button, { block: true, onClick: done }, 'Agree and continue'),
        h(PS.Button, { variant: 'text', block: true, onClick: function () { APP.home('home', 1); } }, 'Not now')) },
      h(PS.PageHero, { art: 'permission', title: 'Why do we ask for these?', body: 'To create your personalized loan service, we need your consent to access your data.' }),
      h('div', { className: 'app-stack-8' }, AD.permissions.map(function (x) { return h(PS.PermissionCard, Object.assign({ key: x.title }, x)); })),
      h('div', { className: 'app-permfoot' }, h(PS.Consent, { on: agree, onToggle: function () { setAgree(!agree); } }, 'I agree to the ', h('b', null, 'Privacy & Data Collection Policy'), ' and let PeraSure use this data for my application.')));
  });

  /* a page that isn't built yet: says so, never a dead end */
  APP.screen('missing', function Missing() {
    return h(APP.Page, { title: '' }, h(PS.EmptyState, { title: 'This page isn’t in the test app yet', body: 'It’s on the list. Go back to keep going.', page: true }));
  });
})();
