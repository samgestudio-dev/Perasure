/* PeraSure app — applying for a credit limit (Figma app file, "Application Details" 52:5194 … 52:7050):
   ID type and the two sides of the ID (camera or album) → check the recognised details → a selfie → basic information → a trusted contact →
   the loan estimate → the application is in review. Owner's rule for this test app: whatever is filled in and in the right format passes;
   the camera is the phone's real camera (front for the selfie, back for the ID); a photo is only shown, never uploaded or kept — once it is
   taken the step passes. Tune → ID check / Selfie check pick the outcomes (a failure only on the first try). Nothing here is saved. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, h = R.createElement, m = PS.m, MT = PS.MT;

  var ID_TYPES = ['PhilSys National ID', 'UMID', 'Driver’s License', 'Passport', 'SSS ID', 'PRC ID', 'Postal ID', 'Voter’s ID', 'TIN ID'];
  var MARITAL = ['Single', 'Married', 'Separated', 'Widowed'];
  var JOBS = ['BPO Worker', 'Freelance', 'Staff/Factory Worker', 'Government/Public Utility', 'Self-employed', 'House Wife', 'Unemployed/Retired'];
  var TENURE = ['Less than 6 months', '6 to 12 months', '1 to 2 years', 'More than 2 years'];
  var PAYROLL = ['Weekly', 'Twice a month', 'Monthly'];
  var GENDER = ['Male', 'Female'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'];
  /* regions → provinces → cities (a short sample) */
  var PLACES = [
    { region: 'NCR', provinces: [{ name: 'Metro Manila', cities: ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Caloocan'] }] },
    { region: 'Central Luzon', provinces: [{ name: 'Pampanga', cities: ['Angeles City', 'San Fernando', 'Mabalacat'] }, { name: 'Bulacan', cities: ['Malolos', 'Meycauayan', 'San Jose del Monte'] }] },
    { region: 'CALABARZON', provinces: [{ name: 'Cavite', cities: ['Bacoor', 'Imus', 'Dasmariñas'] }, { name: 'Laguna', cities: ['Santa Rosa', 'Calamba', 'Biñan'] }] },
    { region: 'Central Visayas', provinces: [{ name: 'Cebu', cities: ['Cebu City', 'Mandaue', 'Lapu-Lapu'] }] },
    { region: 'Davao Region', provinces: [{ name: 'Davao del Sur', cities: ['Davao City', 'Digos'] }] }];

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, MOBILE = /^(09\d{9}|\+639\d{9}|639\d{9}|9\d{9})$/, DIGITS = /^\d+$/;
  function K() { return APP.S.kyc || {}; }
  function setK(patch) { APP.set({ kyc: Object.assign({}, K(), patch) }); }
  function fmtDate(d) { return d ? MONTHS[d.m] + ' ' + d.d + ', ' + d.y : ''; }
  /* the app's today (coupons-data.js: Nov 12, 2026): a date of birth is at least 18 years before it, a payday within the next two months */
  var TODAY = { y: 2026, m: 10, d: 12 };
  function plusDays(d, n) { var t = new Date(d.y, d.m, d.d + n); return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() }; }
  function once(key) { var t = APP.S.kycTries || {}; var first = !t[key]; t[key] = true; APP.set({ kycTries: t }); return first; }

  /* a form: values + which fields were left (to show "required" only after a field was visited, or after Next was tapped) */
  function useForm(key, init, rules) {
    var saved = K()[key], st = R.useState(saved || init), v = st[0], tv = R.useState({}), touched = tv[0], sh = R.useState(false), shown = sh[0];
    function set(name, val) { st[1](function (o) { var n = Object.assign({}, o); n[name] = val; return n; }); }
    function err(name) { var r = rules[name]; if (!r) return null; var e = r(v[name], v); return e && (shown || touched[name]) ? e : null; }
    function ok() { return Object.keys(rules).every(function (n) { return !rules[n](v[n], v); }); }
    function touch(name) { tv[1](function (o) { var n = Object.assign({}, o); n[name] = true; return n; }); }
    function submit(then) { if (!ok()) { sh[1](true); APP.say('Check the highlighted fields.'); return; } var p = {}; p[key] = v; setK(p); then(v); }
    return { v: v, set: set, err: err, ok: ok, touch: touch, submit: submit };
  }
  var req = function (msg) { return function (x) { return x == null || String(x).trim() === '' ? (msg || 'This field is required') : null; }; };

  /* ---- the camera: the phone's own (getUserMedia); a still is drawn from the video. No camera (or no permission): a placeholder, and
     the shutter still passes the step with a sample picture, so the flow can always be walked through ---- */
  function useCamera(facing, on) {
    var video = R.useRef(null), stream = R.useRef(null), st = R.useState('starting'), state = st[0];
    R.useEffect(function () {
      if (!on) return;
      var dead = false, md = navigator.mediaDevices;
      if (!md || !md.getUserMedia) { st[1]('none'); return; }
      md.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false }).then(function (s) {
        if (dead) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        stream.current = s; if (video.current) { video.current.srcObject = s; video.current.play().catch(function () {}); } st[1]('on');
      }).catch(function () { if (!dead) st[1]('none'); });
      return function () { dead = true; if (stream.current) stream.current.getTracks().forEach(function (t) { t.stop(); }); stream.current = null; };
    }, [facing, on]);
    function snap(fallback) {
      var v = video.current;
      if (state !== 'on' || !v || !v.videoWidth) return fallback;
      var c = document.createElement('canvas'), w = Math.min(960, v.videoWidth), hh = Math.round(w * v.videoHeight / v.videoWidth);
      c.width = w; c.height = hh; var g = c.getContext('2d');
      if (facing === 'user') { g.translate(w, 0); g.scale(-1, 1); }   /* a selfie as the person saw it */
      g.drawImage(v, 0, 0, w, hh); return c.toDataURL('image/jpeg', 0.85);
    }
    return { video: video, state: state, snap: snap };
  }
  function pickFile(accept, then, capture) {
    var i = document.createElement('input'); i.type = 'file'; i.accept = accept; if (capture) i.setAttribute('capture', capture);   /* capture: the phone's camera opens */
    i.onchange = function () { var f = i.files && i.files[0]; if (!f) return; if (!/^image\//.test(f.type)) { then(null, f); return; } var r = new FileReader(); r.onload = function () { then(r.result, f); }; r.readAsDataURL(f); };
    i.click();
  }

  APP.useCamera = useCamera; APP.pickFile = pickFile;   /* also used by the phone change and the documents (screens-help.js) */

  /* the ID camera (Figma 52:6602 / 52:6616): the whole screen, the ID's box, the side named along it, the shutter */
  APP.screen('camera', function Camera(p) {
    var side = p.params.side || 'front', cam = useCamera('environment', true);
    function shoot() { var pic = cam.snap(PS.asset('art/id-' + side + '.png')), f = {}; f[side] = pic; setK(f); APP.back(); }
    return h('div', { className: 'app-cam' },
      h('video', { ref: cam.video, className: 'app-cam__video', playsInline: true, muted: true, autoPlay: true }),
      h('div', { className: 'app-cam__box' }, cam.state === 'none' ? h('span', { className: 'ps-t-caption-sm' }, 'The camera isn’t available here. Take the picture anyway to use a sample.') : null),
      h('p', { className: 'app-cam__hint ps-t-caption-sm' }, 'Make sure every detail is clear and the whole ID fits in the box.'),
      h('p', { className: 'app-cam__side ps-t-title-sm' }, side === 'front' ? 'Front side of your ID' : 'Back side of your ID'),
      h(m.button, Object.assign({ type: 'button', className: 'app-cam__shutter', 'aria-label': 'Take the picture', onClick: shoot }, PS.press(true)), h('i')),
      h('div', { className: 'app-cam__close' }, h(PS.Glass, { icon: 'close', label: 'Close the camera', onClick: function () { APP.back(); } })));
  });

  /* one side of the ID (Figma 52:6066 / 52:6134): the picture (the sample, or the photo taken: green ring and tick), its name, Camera / Album */
  function IdSide(p) {
    var pic = p.pic;
    return h(PS.Card, { variant: 'outline', className: 'app-idside' },
      h('p', { className: 'ps-t-section-sm' }, p.title),
      h('div', { className: 'app-idside__box' },
        h('div', { className: 'app-idside__row' },
          h('span', { className: PS.cx('app-idside__pic', pic && 'is-done') }, h('img', { src: pic || PS.asset('art/id-' + p.side + '.png'), alt: '' }),
            pic ? h(m.span, { className: 'app-idside__tick', initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1, transition: Object.assign({}, MT.SPRING, { restDelta: 0.001 }) } }, h(PS.Icon, { name: 'check', size: 12, color: 'inverse' })) : null),
          h('span', { className: 'app-idside__text' }, h('span', { className: 'ps-t-section-md' }, p.name), h('span', { className: 'ps-t-caption-sm' }, pic ? 'Added. Take it again if it isn’t clear.' : p.hint))),
        h(PS.Divider),
        h('div', { className: 'app-idside__btns' },
          h(PS.Button, { variant: 'soft', size: 'sm', onClick: p.onCamera }, 'Camera'),
          h(PS.Button, { variant: 'soft', size: 'sm', onClick: p.onAlbum }, 'Album'))));
  }

  /* ---- 1. Verify your identity ---- */
  APP.screen('kyc-id', function KycId() {
    var S = APP.use(), k = K(), ready = !!(k.type && k.front && k.back);
    function next() {
      if (!ready) { APP.say(!k.type ? 'Choose an ID type first.' : 'Add both sides of your ID.'); return; }
      APP.run(function () {
        var out = APP.T.kyc || 'pass';
        if (out !== 'pass' && once('id')) { APP.open(out === 'inuse' ? 'id-inuse' : 'id-failed'); return; }
        APP.go('kyc-check');
      });
    }
    function album(side) { pickFile('image/*', function (pic) { var f = {}; f[side] = pic; setK(f); }); }
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !ready, onClick: next }, 'Next')) },
      h(APP.Head, { title: 'Verify your identity', body: 'Choose an ID type and upload a clear photo. Your information is kept private.' }),
      h(PS.FormField, { label: 'ID type', value: k.type, placeholder: 'Select ID type', menu: { options: ID_TYPES, onPick: function (o) { setK({ type: o }); } } }),
      h(PS.AP, { initial: false }, k.type ? h(m.div, Object.assign({ key: 'sides', className: 'app-stack-20' }, PS.fade(MT.Y.block)),
        h(IdSide, { side: 'front', title: 'Upload front side of ID', name: 'Front side of ID', hint: 'Show the side with your photo', pic: k.front,
          onCamera: function () { APP.go('camera', { side: 'front' }); }, onAlbum: function () { album('front'); } }),
        h(IdSide, { side: 'back', title: 'Upload back side of ID', name: 'Back side of ID', hint: 'Show the other side', pic: k.back,
          onCamera: function () { APP.go('camera', { side: 'back' }); }, onAlbum: function () { album('back'); } })) : null));
  });
  /* the ID is already in use (Figma 52:6204) · the check failed (Figma 52:6381) */
  APP.sheet('id-inuse', { kind: 'card', label: 'This ID is already in use', className: 'app-idres', render: function InUse() {
    return h(R.Fragment, null,
      h('div', { className: 'app-idres__top' }, h('img', { src: PS.asset('art/id-in-use.png'), alt: '', style: { width: '6.25rem', height: '6.25rem' } }),
        h('p', { className: 'ps-t-title-sm' }, 'This ID is already in use'),
        h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'This ID is linked to another account. Choose what you’d like to do next.')),
      h('div', { className: 'app-stack-8' },
        h(PS.Button, { variant: 'outline', block: true, className: 'app-idres__opt', onClick: function () { APP.close(); APP.go('login'); } }, h('span', null, 'Log in to your existing account', h('small', null, 'Continue with your previous account'))),
        h(PS.Button, { variant: 'outline', block: true, className: 'app-idres__opt', onClick: function () { APP.close(); APP.go('phone-old'); } }, h('span', null, 'Can’t access that number', h('small', null, 'Recover your account with a new phone number'))),
        h(PS.Button, { variant: 'text', block: true, onClick: function () { setK({ front: null, back: null, type: null }); APP.close(); } }, 'Use a different ID')));
  } });
  APP.sheet('id-failed', { kind: 'card', label: 'ID verify failed', className: 'app-idres', render: function Failed() {
    var tips = [['Avoid false documents', 0], ['Avoid flash', 1], ['Avoid incomplete', 2], ['Avoid blurry', 3]];
    return h(R.Fragment, null,
      h('div', { className: 'app-sheethead app-sheethead--left' }, h('p', { className: 'ps-t-section-md ps-c-negative app-idres__title' }, h(PS.Icon, { name: 'alert-circle', size: 16, color: 'var(--color-icon-negative-default)' }), 'We couldn’t verify your ID'), h(PS.Close, { onClick: APP.close })),
      h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'Repeated failures may affect your application, so check the photo carefully.'),
      h('div', { className: 'app-idres__tips ps-inset' }, tips.map(function (t) {
        return h('div', { key: t[0] }, h('span', { className: 'app-idres__tip', style: { backgroundPosition: (t[1] % 2) * 100 + '% ' + Math.floor(t[1] / 2) * 100 + '%', backgroundImage: 'url("' + PS.asset('art/verify-failed.webp') + '")' } }), h('span', { className: 'ps-t-caption-xs ps-c-tertiary' }, t[0]));
      })),
      h('div', { className: 'app-idres__acts' },
        h(PS.Button, { variant: 'outline', onClick: function () { setK({ front: null, back: null }); APP.close(); } }, 'Try again'),
        h(PS.Button, { onClick: function () { APP.close(); APP.go('kyc-check', { manual: true }); } }, 'Enter manually')));
  } });

  /* ---- 2. Check the details (Figma 52:5203): what was read from the ID, to complete ---- */
  APP.screen('kyc-check', function KycCheck(p) {
    var k = K(), manual = p.params.manual;
    var F = useForm('details', { type: k.type || '', street: '', city: '', first: manual ? '' : 'Sam', last: manual ? '' : 'Ge', middle: '', suffix: '', gender: '',
      idno: manual ? '' : '0123-4567-8901', dob: manual ? null : { y: 1997, m: 5, d: 24 } }, {
      type: req(), street: req(), city: req(), first: req(), last: req(), gender: req(), idno: function (x) { return !x ? 'This field is required' : /^[A-Za-z0-9 -]{4,}$/.test(x) ? null : 'Use letters, numbers and dashes only'; },
      dob: function (x) { return x ? null : 'This field is required'; } });
    var v = F.v;
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !F.ok(), onClick: function () { F.submit(function () { APP.go('kyc-selfie'); }); } }, 'Next')) },
      h(APP.Head, { title: 'Check the details', body: 'Review the details we read from your ID and fill in anything missing.' }),
      h('div', { className: 'app-form' },
        h(PS.FormField, { label: 'ID type', value: v.type, placeholder: 'Select ID type', error: F.err('type'), menu: { options: ID_TYPES, onPick: function (o) { F.set('type', o); } } }),
        h(PS.FormField, { label: 'House no. / street / barangay', value: v.street, placeholder: 'House number, street, barangay', error: F.err('street'), onChange: function (x) { F.set('street', x); }, onBlur: function () { F.touch('street'); } }),
        h(PS.FormField, { label: 'City / province', value: v.city, placeholder: 'Select city and province', error: F.err('city'), onClick: function () { APP.open('city', { then: function (c) { F.set('city', c); } }); } }),
        h(PS.FormField, { label: 'First name', value: v.first, placeholder: 'Enter your first name', error: F.err('first'), clear: true, onChange: function (x) { F.set('first', x); }, onBlur: function () { F.touch('first'); } }),
        h(PS.FormField, { label: 'Last name', value: v.last, placeholder: 'Enter your last name', error: F.err('last'), clear: true, onChange: function (x) { F.set('last', x); }, onBlur: function () { F.touch('last'); } }),
        h(PS.FormField, { label: 'Middle name (optional)', value: v.middle, placeholder: 'Enter your middle name', clear: true, onChange: function (x) { F.set('middle', x); } }),
        h(PS.FormField, { label: 'Suffix (optional)', value: v.suffix, placeholder: 'Jr., Sr., III', clear: true, onChange: function (x) { F.set('suffix', x); } }),
        h(PS.FormField, { label: 'Gender', value: v.gender, placeholder: 'Select your gender', error: F.err('gender'), menu: { options: GENDER, onPick: function (o) { F.set('gender', o); } } }),
        h(PS.FormField, { label: 'ID number', value: v.idno, placeholder: 'Enter ID number', error: F.err('idno'), clear: true, onChange: function (x) { F.set('idno', x); }, onBlur: function () { F.touch('idno'); } }),
        h(PS.FormField, { label: 'Date of birth', value: fmtDate(v.dob), placeholder: 'Select your date of birth', icon: 'calendar', error: F.err('dob'),
          onClick: function () { APP.open('date', { value: v.dob || { y: 1995, m: 0, d: 1 }, min: { y: 1940, m: 0, d: 1 }, max: { y: TODAY.y - 18, m: TODAY.m, d: TODAY.d }, then: function (d) { F.set('dob', d); } }); } })));
  });

  /* ---- 3. Take a selfie (Figma 52:5784 / 52:5912 / 52:6050): the front camera in the circle; Next takes it ---- */
  APP.screen('kyc-selfie', function KycSelfie() {
    var st = R.useState('live'), state = st[0], cam = useCamera('user', state === 'live'), shot = R.useState(null);
    function take() {
      if (state === 'checking') return;
      if (state === 'failed') { st[1]('live'); shot[1](null); return; }
      shot[1](cam.snap(null)); st[1]('checking');
      setTimeout(function () {
        if ((APP.T.selfie || 'pass') !== 'pass' && once('selfie')) { st[1]('failed'); return; }
        setK({ selfie: true }); APP.go('kyc-basic');
      }, 1100);
    }
    var tips = [['Look straight ahead', 1, true], ['Good lighting', 2, true], ['Face uncovered', 3, false]];
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: state === 'checking', onClick: take }, h(PS.Swap, { k: state === 'failed' ? 'a' : 'n' }, h('span', null, state === 'failed' ? 'Try again' : 'Next')))) },
      h(APP.Head, { title: 'Take a selfie', body: 'Look straight ahead with a natural expression. Use good lighting and take off glasses or hats.' }),
      h('div', { className: PS.cx('app-selfie', 'is-' + state) },
        h('div', { className: 'app-selfie__ring' },
          h('video', { ref: cam.video, className: 'app-selfie__video', playsInline: true, muted: true, autoPlay: true, style: { visibility: state === 'live' ? 'visible' : 'hidden' } }),
          shot[0] && state !== 'live' ? h('img', { className: 'app-selfie__video', src: shot[0], alt: '' }) : null,
          h(PS.AP, null, state === 'checking' ? h(m.span, Object.assign({ key: 'c', className: 'app-selfie__state is-brand' }, PS.fade(MT.Y.text)), h(PS.Icon, { name: 'upload', size: 20, color: 'brand' }), 'Checking')
            : state === 'failed' ? h(m.span, Object.assign({ key: 'f', className: 'app-selfie__state is-negative' }, PS.fade(MT.Y.text)), h(PS.Icon, { name: 'alert-circle', size: 20, color: 'var(--color-icon-negative-default)' }), 'Try again')
            : cam.state === 'none' ? h('span', { key: 'n', className: 'app-selfie__none ps-t-caption-sm' }, 'The camera isn’t available here. Tap Next to use a sample.') : null)),
        h(PS.Card, { className: 'app-selfie__tips' }, h('p', { className: 'ps-t-section-sm' }, 'Follow these tips'),
          h('div', { className: 'app-selfie__row' }, tips.map(function (t) {
            return h('div', { key: t[0] }, h('span', { className: 'app-selfie__pic' }, h('img', { src: PS.asset('art/selfie-tip-' + t[1] + '.png'), alt: '' }),
              h('i', { className: t[2] ? 'is-ok' : 'is-no' }, h(PS.Icon, { name: t[2] ? 'check' : 'close', size: 8, color: 'inverse' }))), h('span', { className: 'ps-t-caption-xs ps-c-tertiary' }, t[0]));
          })))));
  });

  /* ---- 4. Basic information (Figma 52:5689 / 52:5717 / 52:5755 / 52:7023 / 52:7000) ---- */
  APP.screen('kyc-basic', function KycBasic() {
    var F = useForm('basic', { email: '', marital: '', job: '', company: '', address: '', city: '', tenure: '', title: '', payroll: '', payday: null, income: '', files: [] }, {
      email: function (x) { return !x ? 'This field is required' : EMAIL.test(x.trim()) ? null : 'Enter an email like name@gmail.com'; },
      marital: req(), job: req(), company: req(), address: req(), city: req(), tenure: req(), title: req(), payroll: req(),
      payday: function (x) { return x ? null : 'This field is required'; },
      income: function (x) { return !x ? 'This field is required' : DIGITS.test(String(x).replace(/,/g, '')) ? null : 'Please enter numbers only'; } });
    var v = F.v, at = v.email.indexOf('@'), name = at < 0 ? v.email : v.email.slice(0, at), typed = at < 0 ? '' : v.email.slice(at + 1);
    var sugg = v.email && !EMAIL.test(v.email) ? DOMAINS.filter(function (d) { return d.indexOf(typed) === 0; }).map(function (d) { return name + '@' + d; }) : [];
    var ms = R.useState(false), menu = ms[0];
    function add(kind) {
      ms[1](false);
      if (v.files.length >= 3) { APP.say('You can add up to 3 files.'); return; }
      pickFile(kind === 'files' ? 'image/*,application/pdf' : 'image/*', function (pic, f) {
        F.set('files', v.files.concat([{ name: f.name, size: f.size, pic: pic }]));
      });
    }
    function field(key, o) { return h(PS.FormField, Object.assign({ value: v[key], error: F.err(key), onChange: function (x) { F.set(key, x); }, onBlur: function () { F.touch(key); } }, o)); }
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !F.ok(), onClick: function () { F.submit(function () { APP.go('kyc-contact'); }); } }, 'Next')) },
      h(APP.Head, { title: 'Basic information', body: 'Share a few details so we can understand your needs and estimate your loan limit.' }),
      h('div', { className: 'app-form' },
        field('email', { label: 'Email', placeholder: 'Enter your email', inputMode: 'email', type: 'email', clear: true, suggest: sugg, onSuggest: function (x) { F.set('email', x); } }),
        h(PS.FormField, { label: 'Marital status', value: v.marital, placeholder: 'Select your marital status', error: F.err('marital'), menu: { options: MARITAL, onPick: function (o) { F.set('marital', o); } } }),
        h(PS.FormField, { label: 'Job type', value: v.job, placeholder: 'Select your job type', error: F.err('job'), menu: { options: JOBS, onPick: function (o) { F.set('job', o); } } }),
        field('company', { label: 'Company / organization', placeholder: 'Enter company or organization name', clear: true }),
        field('address', { label: 'Work address', placeholder: 'Unit / floor, building, street, barangay', clear: true }),
        h(PS.FormField, { label: 'Work city / province', value: v.city, placeholder: 'Select work city and province', error: F.err('city'), onClick: function () { APP.open('city', { then: function (c) { F.set('city', c); } }); } }),
        h(PS.FormField, { label: 'Time in current job', value: v.tenure, placeholder: 'Select time in current job', error: F.err('tenure'), menu: { options: TENURE, onPick: function (o) { F.set('tenure', o); } } }),
        field('title', { label: 'Job title / position', placeholder: 'Enter job title or position', clear: true }),
        h(PS.FormField, { label: 'Payroll period', value: v.payroll, placeholder: 'Select your payroll period', error: F.err('payroll'), menu: { options: PAYROLL, onPick: function (o) { F.set('payroll', o); } } }),
        h(PS.FormField, { label: 'Next payday', value: fmtDate(v.payday), placeholder: 'Select your next payday', icon: 'calendar', error: F.err('payday'),
          onClick: function () { APP.open('date', { value: v.payday || plusDays(TODAY, 3), min: TODAY, max: plusDays(TODAY, 62), then: function (d) { F.set('payday', d); } }); } }),
        field('income', { label: 'Total monthly income (PHP)', placeholder: 'Enter your monthly income', inputMode: 'numeric', clear: true }),
        h('div', { className: 'app-files' },
          h('span', { className: 'ps-ff__label' }, 'Support documents (optional)'),
          v.files.map(function (f, i) {
            return h('div', { key: f.name + i, className: 'app-files__item' }, f.pic ? h('img', { src: f.pic, alt: '' }) : h('span', { className: 'app-files__pdf' }, 'PDF'),
              h('span', { className: 'app-files__name' }, h('span', { className: 'ps-t-label-sm' }, f.name), h('span', { className: 'ps-t-caption-xs ps-c-tertiary' }, Math.max(1, Math.round(f.size / 1024)) + ' KB')),
              h('button', { type: 'button', 'aria-label': 'Remove', onClick: function () { F.set('files', v.files.filter(function (x, j) { return j !== i; })); } }, h(PS.Icon, { name: 'close', size: 16, color: 'tertiary' })));
          }),
          h('div', { className: 'app-files__add' },
            h(m.button, Object.assign({ type: 'button', className: 'app-files__btn', onClick: function () { ms[1](true); } }, PS.press()),
              h('span', { className: 'ps-c-brand' }, h(PS.Icon, { name: 'add', size: 16, color: 'brand' }), ' Add files (' + v.files.length + '/3)'),
              v.files.length ? null : h('span', { className: 'ps-t-caption-xs ps-c-placeholder' }, 'Show us your job or income with payslips, bank or e-wallet statements, or a company ID.')),
            h(PS.Popover, { open: menu, options: ['Take a photo', 'Choose from photos', 'Choose from files'], onClose: function () { ms[1](false); },
              onPick: function (o) { add(o === 'Choose from files' ? 'files' : 'photos'); } })),
          h('p', { className: 'app-files__note ps-t-caption-xs ps-c-placeholder' }, h(PS.Icon, { name: 'info', size: 12, color: 'placeholder' }), 'Supports JPG, JPEG, PNG and PDF.'))));
  });

  /* ---- 5. Add a trusted contact (Figma 52:5772) ---- */
  APP.screen('kyc-contact', function KycContact() {
    var F = useForm('contact', { name: '', mobile: '' }, { name: req(), mobile: function (x) { var c = String(x || '').replace(/[\s-]/g, ''); return !c ? 'This field is required' : MOBILE.test(c) ? null : 'Enter a mobile number like 0917 123 4567'; } });
    var v = F.v;
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h('p', { className: 'app-contact__note ps-t-caption-xs ps-c-placeholder' }, 'Philippine SEC rules ask us for an emergency contact. We only call them if a payment is overdue and we can’t reach you.'),
        h(PS.Button, { block: true, inactive: !F.ok(), onClick: function () { F.submit(function () { APP.go('kyc-estimate'); }); } }, 'Next')) },
      h(APP.Head, { title: 'Add a trusted contact', body: 'We’ll only reach out to them if we can’t contact you. Adding one may also improve your approval chances.' }),
      h('div', { className: 'app-form app-form--12' },
        h(PS.FormField, { label: 'Full name', value: v.name, placeholder: 'Enter their full name', clear: true, error: F.err('name'), onChange: function (x) { F.set('name', x); }, onBlur: function () { F.touch('name'); } }),
        h(PS.FormField, { label: 'Mobile number', value: v.mobile, placeholder: 'Enter their mobile number', inputMode: 'tel', type: 'tel', clear: true, error: F.err('mobile'), onChange: function (x) { F.set('mobile', x); }, onBlur: function () { F.touch('mobile'); } })));
  });

  /* ---- 6. Your loan estimate (Figma 52:7050): a friendly reminder, the estimated limit with the amount card and the numbers ---- */
  APP.screen('kyc-estimate', function KycEstimate() {
    var CS = window.CS, money = PS.money, st = R.useState({ amount: 12500, term: 6 }), e = st[0], C = CS.calc(e.amount, e.term, null, null);
    /* a first application has no loan to repay yet; someone reapplying keeps theirs */
    function apply() { APP.run(function () { var first = APP.S.user === 'new' || APP.S.user === 'guest'; APP.set(Object.assign({ user: 'review', kyc: null }, first ? { repay: null } : null)); APP.home('home', 0); APP.say('Thanks, we’ve got your application. We’ll let you know what happens next.', 3400); }); }
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: apply }, 'Continue to apply')) },
      h(APP.Head, { title: 'Your loan estimate', body: 'Low rates, with costs you can see upfront. Explore an amount and repayment plan that work for you.' }),
      h(PS.Accordion, { title: h('span', { className: 'app-remind' }, h('span', { className: 'ps-tile' }, h(PS.Icon, { name: 'heart', size: 20, color: 'inverse' })), 'A friendly reminder'), open: true },
        'These are estimated amounts and rates. If they work for you, continue to apply. We’ll review your details to work out your final offer.'),
      h('div', { className: 'app-estimate' },
        h(PS.AmountCard, { label: 'Estimated credit limit', amount: e.amount, min: 500, max: 50000, step: 100, terms: CS.loan.terms, term: e.term, termNote: CS.loan.days + ' days / term',
          onAmount: function (a) { st[1]({ amount: a, term: e.term }); }, onCommit: function () {}, onTerm: function (t) { st[1]({ amount: e.amount, term: t }); } }),
        h(PS.Card, { className: 'app-estimate__rows' }, h(PS.Rows, { rows: [{ label: 'Daily fee', value: money(C.daily) }, { label: 'First payment date', value: CS.date(1) }, { label: 'Per installment', value: money(C.per) }, { label: 'Total payment', value: money(C.total) }] }),
          h(PS.Link, { onClick: function () { APP.say('Your payment schedule shows once you apply.'); } }, 'View payment schedule'))),
      h('p', { className: 'ps-t-caption-xs ps-c-placeholder', style: { padding: '0 var(--spacing-padding-sm)' } }, 'These are examples only. Approval and your final loan details depend on our review.'));
  });

  /* ---- the date sheet (DS 7628:14113 · 5900:9854 · 5900:9592): the shared date picker — the month's days, or a wheel for the month or the year ---- */
  APP.sheet('date', { kind: 'card', label: 'Select date', className: 'app-date', render: function DateSheet(p) {
    return h(PS.DatePicker, { value: p.params.value, min: p.params.min, max: p.params.max, title: 'Select date', onCancel: APP.close,
      onConfirm: function (v) { APP.close(); if (p.params.then) p.params.then(v); } });
  } });

  /* ---- the city sheet (Figma 52:6748): search, then region → province → city ---- */
  APP.sheet('city', { kind: 'page', label: 'Select city', className: 'app-city', render: function City(p) {
    var q = R.useState(''), tab = R.useState('region'), sel = R.useState({}), k = q[0].trim().toLowerCase(), s = sel[0];
    function choose(city, prov, region) { APP.close(); if (p.params.then) p.params.then(city + ', ' + prov); }
    var rows;
    if (k) {
      rows = []; PLACES.forEach(function (r) { r.provinces.forEach(function (pv) { pv.cities.forEach(function (c) { if (c.toLowerCase().indexOf(k) >= 0) rows.push({ key: c + pv.name, title: c, sub: pv.name + ', ' + r.region, go: function () { choose(c, pv.name, r.region); } }); }); }); });
    } else if (tab[0] === 'region') {
      rows = PLACES.map(function (r) { return { key: r.region, title: r.region, sub: r.provinces.map(function (x) { return x.name; }).join(', '), go: function () { sel[1]({ region: r }); tab[1]('province'); } }; });
    } else if (tab[0] === 'province') {
      var R0 = s.region || PLACES[0];
      rows = R0.provinces.map(function (pv) { return { key: pv.name, title: pv.name, sub: R0.region, go: function () { sel[1]({ region: R0, prov: pv }); tab[1]('city'); } }; });
    } else {
      var R1 = s.region || PLACES[0], P1 = s.prov || R1.provinces[0];
      rows = P1.cities.map(function (c) { return { key: c, title: c, sub: P1.name + ', ' + R1.region, go: function () { choose(c, P1.name, R1.region); } }; });
    }
    return h(R.Fragment, null,
      h('div', { className: 'app-banks__head' }, h(PS.Search, { value: q[0], onChange: q[1], placeholder: 'Search city name' }), h(PS.Close, { onClick: APP.close })),
      h('div', { className: 'app-banks__body' },
        k ? null : h(PS.Tabs, { id: 'app-city', value: tab[0], onChange: tab[1], items: [{ id: 'region', label: 'Region' }, { id: 'province', label: 'Province' }, { id: 'city', label: 'City' }] }),
        h(PS.Crossfade, { k: (k ? 'q' : tab[0]) + rows.length, className: 'ps-card app-city__list' }, rows.length ? rows.map(function (r) {
          return h(m.button, Object.assign({ key: r.key, type: 'button', className: 'app-city__row', onClick: r.go }, PS.press()), h('span', { className: 'ps-t-section-sm' }, r.title), h('span', { className: 'ps-t-caption-sm ps-c-tertiary' }, r.sub));
        }) : h('p', { className: 'ps-t-body-md ps-c-tertiary', style: { padding: '1rem' } }, 'No city found. Check the spelling or try another name.'))));
  } });
})();
