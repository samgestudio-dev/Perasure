/* PeraSure app — applying for a credit limit (Figma app file, "Application Details" 52:5194 … 52:7050; DS 3908:1341):
   the loan estimate → basic information → ID type and the two sides of the ID (camera or album) → check the recognised details → a selfie →
   a trusted contact → Submit: the application is in review. Owner's rule for this test app: whatever is filled in and in the right format passes;
   the camera is the phone's real camera (front for the selfie, back for the ID); a photo is only shown, never uploaded or kept — once it is
   taken the step passes. Tune → ID check / Selfie check pick the outcomes (a failure only on the first try). Nothing here is saved. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, h = R.createElement, m = PS.m, MT = PS.MT;

  var ID_TYPES = ['PhilSys National ID', 'UMID', 'Driver’s License', 'Passport', 'SSS ID', 'PRC ID', 'Postal ID', 'Voter’s ID', 'TIN ID'];
  /* the IDs Figma's ID type sheet marks with an Accent "Higher credit" tag */
  var ID_TAGS = { 'UMID': 'Higher credit', 'SSS ID': 'Higher credit', 'Driver’s License': 'Higher credit', 'Passport': 'Higher credit' };
  var MARITAL = ['Single', 'Married', 'Separated', 'Widowed'];
  var JOBS = ['BPO Worker', 'Freelance', 'Staff/Factory Worker', 'Government/Public Utility', 'Self-employed', 'House Wife', 'Unemployed/Retired'];
  var TENURE = ['Less than 6 months', '6 to 12 months', '1 to 2 years', 'More than 2 years'];
  var PAYROLL = ['Weekly', 'Twice a month', 'Monthly'];
  var GENDER = ['Male', 'Female'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'];
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

  /* the camera and the file picker are shared (PS.useCamera, PS.pickFile in shared/ps-ui/apply.js): the phone's real camera — front for the
     selfie, back for the ID; no camera (or no permission) still passes the step with a sample picture */
  var useCamera = PS.useCamera, pickFile = PS.pickFile;
  APP.useCamera = useCamera; APP.pickFile = pickFile;   /* the names the phone change and the documents use (screens-help.js) */
  /* the application is sent from the last step (the trusted contact): a first application has no loan to repay yet; someone reapplying keeps theirs */
  function sendApplication() {
    APP.run(function () { var first = APP.S.user === 'new' || APP.S.user === 'guest'; APP.set(Object.assign({ user: 'review', kyc: null }, first ? { repay: null } : null)); APP.home('home', 0);
      APP.say('Thanks, we’ve got your application. We’ll let you know what happens next.', 3400); });
  }
  /* the way in: the loan estimate comes first (DS 9224:37691), then basic information, then the ID */
  APP.apply = function () { APP.go('kyc-estimate'); };

  /* the ID camera (Figma 52:6602 / 52:6616; DS 5788:13914): the whole screen, laid out for an ID held sideways (PS.IdCamera) */
  APP.screen('camera', function Camera(p) {
    var side = p.params.side || 'front', cam = useCamera('environment', true);
    function shoot() { var pic = cam.snap(PS.asset('art/id-' + side + '.png')), f = {}; f[side] = pic; setK(f); APP.back(); }
    return h(PS.IdCamera, { side: side, cam: cam, onShoot: shoot, onClose: function () { APP.back(); } });
  });

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
      h(APP.Head, { title: 'Verify your identity', body: 'Choose an ID type and upload a clear photo.' }),
      h(PS.FormField, { label: 'ID type', value: k.type, placeholder: 'Select ID type', menu: { options: ID_TYPES, tags: ID_TAGS, onPick: function (o) { setK({ type: o }); } } }),
      h(PS.AP, { initial: false }, k.type ? h(m.div, Object.assign({ key: 'sides', className: 'app-stack-20' }, PS.fade(MT.Y.block)),
        h(PS.IdSideCard, { side: 'front', title: 'Upload front side of ID', name: 'Front side of ID', hint: 'Show the side with your photo', pic: k.front,
          onCamera: function () { APP.go('camera', { side: 'front' }); }, onAlbum: function () { album('front'); } }),
        h(PS.IdSideCard, { side: 'back', title: 'Upload back side of ID', name: 'Back side of ID', hint: 'Show the other side', pic: k.back,
          onCamera: function () { APP.go('camera', { side: 'back' }); }, onAlbum: function () { album('back'); } })) : null));
  });
  /* the ID is already in use (DS 5908:10722) · the check failed (DS 5908:11000): PS.IdResult */
  APP.sheet('id-inuse', { kind: 'card', label: 'This ID is already in use', className: 'ps-idres', render: function InUse() {
    return h(PS.IdResult, { state: 'inuse', onLogin: function () { APP.close(); APP.go('login'); }, onRecover: function () { APP.close(); APP.go('phone-old'); },
      onOther: function () { setK({ front: null, back: null, type: null }); APP.close(); } });
  } });
  APP.sheet('id-failed', { kind: 'card', label: 'We couldn’t verify your ID', className: 'ps-idres', render: function Failed() {
    return h(PS.IdResult, { state: 'failed', onClose: APP.close, onRetry: function () { setK({ front: null, back: null }); APP.close(); },
      onManual: function () { APP.close(); APP.go('kyc-check', { manual: true }); } });
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
        h(PS.FormField, { label: 'ID type', value: v.type, placeholder: 'Select ID type', error: F.err('type'), menu: { options: ID_TYPES, tags: ID_TAGS, onPick: function (o) { F.set('type', o); } } }),
        h(PS.FormField, { label: 'House no. / street / barangay', value: v.street, placeholder: 'House number, street, barangay', error: F.err('street'), onChange: function (x) { F.set('street', x); }, onBlur: function () { F.touch('street'); } }),
        h(PS.FormField, { label: 'City / province', value: v.city, placeholder: 'Select city and province', error: F.err('city'), onClick: function () { APP.open('city', { then: function (c) { F.set('city', c); } }); } }),
        h(PS.FormField, { label: 'First name', value: v.first, placeholder: 'Enter your first name', error: F.err('first'), clear: true, onChange: function (x) { F.set('first', x); }, onBlur: function () { F.touch('first'); } }),
        h(PS.FormField, { label: 'Last name', value: v.last, placeholder: 'Enter your last name', error: F.err('last'), clear: true, onChange: function (x) { F.set('last', x); }, onBlur: function () { F.touch('last'); } }),
        h(PS.FormField, { label: 'Middle name (optional)', value: v.middle, placeholder: 'Enter your middle name', clear: true, onChange: function (x) { F.set('middle', x); } }),
        h(PS.FormField, { label: 'Suffix name (optional)', value: v.suffix, placeholder: 'Jr., Sr., III', clear: true, onChange: function (x) { F.set('suffix', x); } }),
        h(PS.FormField, { label: 'Gender', value: v.gender, placeholder: 'Select your gender', error: F.err('gender'), menu: { options: GENDER, onPick: function (o) { F.set('gender', o); } } }),
        h(PS.FormField, { label: 'ID number', value: v.idno, placeholder: 'Enter ID number', error: F.err('idno'), clear: true, onChange: function (x) { F.set('idno', x); }, onBlur: function () { F.touch('idno'); } }),
        h(PS.FormField, { label: 'Date of birth', value: fmtDate(v.dob), placeholder: 'Select your date of birth', icon: 'calendar', error: F.err('dob'),
          onClick: function () { APP.open('date', { value: v.dob || { y: 1995, m: 0, d: 1 }, min: { y: 1940, m: 0, d: 1 }, max: { y: TODAY.y - 18, m: TODAY.m, d: TODAY.d }, then: function (d) { F.set('dob', d); } }); } })));
  });

  /* ---- 3. Take a selfie (Figma 52:5784 / 52:5912 / 52:6050; DS 5561:7329 · uploading 5561:7501 · failed 5561:7411): the front camera in the
     circle; Next takes it. While it uploads only the circle stays (a turning dashed ring, "Uploading"); a failed check shows "Failed" in red ---- */
  APP.screen('kyc-selfie', function KycSelfie() {
    var st = R.useState('live'), state = st[0], cam = useCamera('user', state === 'live'), busy = state === 'checking';
    function take() {
      if (busy) return;
      if (state === 'failed') { st[1]('live'); return; }
      st[1]('checking');   /* the photo is only taken, never uploaded or kept */
      setTimeout(function () {
        if ((APP.T.selfie || 'pass') !== 'pass' && once('selfie')) { st[1]('failed'); return; }
        setK({ selfie: true }); APP.go('kyc-contact');
      }, 1600);
    }
    var hide = { animate: { opacity: busy ? 0 : 1, transition: busy ? MT.LEAVE : MT.ENTER }, style: { pointerEvents: busy ? 'none' : null } };   /* what leaves takes no taps */
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(m.div, Object.assign({ initial: false }, hide), h(PS.Button, { block: true, inactive: busy, onClick: take }, h(PS.Swap, { k: state === 'failed' ? 'a' : 'n' }, h('span', null, state === 'failed' ? 'Try again' : 'Next'))))) },
      h(m.div, Object.assign({ initial: false }, hide), h(APP.Head, { title: 'Take a selfie', body: 'Look straight ahead with a relaxed face. Use good lighting and remove glasses or hats.' })),
      h(PS.Selfie, { state: state, cam: cam },
        h(m.div, Object.assign({ initial: false, className: 'ps-selfie__tips' }, hide), h(PS.SelfieTips, { onMore: function (el) { APP.tipAt(el, 'Hold the phone at eye level, keep your whole face inside the circle and stay still while we take the photo.'); } }))));
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
    function add(how) {
      if (v.files.length >= 3) { APP.say('You can add up to 3 files.'); return; }
      pickFile(how === 'Choose from files' ? 'image/*,application/pdf' : 'image/*', function (pic, f) {
        F.set('files', v.files.concat([{ name: f.name, size: f.size, pic: pic }]));
      });
    }
    function field(key, o) { return h(PS.FormField, Object.assign({ value: v[key], error: F.err(key), onChange: function (x) { F.set(key, x); }, onBlur: function () { F.touch(key); } }, o)); }
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !F.ok(), onClick: function () { F.submit(function () { APP.go('kyc-id'); }); } }, 'Next')) },
      h(APP.Head, { title: 'Basic information', body: 'Share a few details so we can better understand your needs and estimate your loan limit.' }),
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
        /* DS 9548:30951: each file on a white card, then the dashed "Add files" (with the hint only while there are none) */
        h(PS.FileList, { label: 'Support documents (optional)', files: v.files, max: 3, onAdd: add, note: 'Supports JPG, JPEG, PNG and PDF.',
          hint: 'Show us your job or income with payslips, bank or e‑wallet statements, or a company ID.',
          onRemove: function (i) { F.set('files', v.files.filter(function (x, j) { return j !== i; })); } })));
  });

  /* ---- 5. Add a trusted contact (Figma 52:5772) ---- */
  APP.screen('kyc-contact', function KycContact() {
    var F = useForm('contact', { name: '', mobile: '' }, { name: req(), mobile: function (x) { var c = String(x || '').replace(/[\s-]/g, ''); return !c ? 'This field is required' : MOBILE.test(c) ? null : 'Enter a mobile number like 0917 123 4567'; } });
    var v = F.v;
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, { note: 'SEC rules ask us for an emergency contact. We only call them if a payment is overdue and we can’t reach you.' },
        h(PS.Button, { block: true, inactive: !F.ok(), onClick: function () { F.submit(sendApplication); } }, 'Submit')) },
      h(APP.Head, { title: 'Add a trusted contact', body: 'We’ll only reach out to them if we can’t contact you. Adding one may also improve your approval chances.' }),
      h('div', { className: 'app-form app-form--12' },
        h(PS.FormField, { label: 'Full name', value: v.name, placeholder: 'Enter their full name', clear: true, error: F.err('name'), onChange: function (x) { F.set('name', x); }, onBlur: function () { F.touch('name'); } }),
        h(PS.FormField, { label: 'Mobile number', value: v.mobile, placeholder: 'Enter their mobile number', inputMode: 'tel', type: 'tel', clear: true, error: F.err('mobile'), onChange: function (x) { F.set('mobile', x); }, onBlur: function () { F.touch('mobile'); } })));
  });

  /* ---- 6. Your loan estimate (Figma 52:7050): a friendly reminder, the estimated limit with the amount card and the numbers ---- */
  APP.screen('kyc-estimate', function KycEstimate() {
    var CS = window.CS, money = PS.money, st = R.useState({ amount: 12500, term: 6 }), e = st[0], C = CS.calc(e.amount, e.term, null, null);
    function apply() { APP.go('kyc-basic'); }
    return h(APP.Page, { title: '', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: apply }, 'Continue to apply')) },
      h(APP.Head, { title: 'Your loan estimate', body: 'Low rates, with costs you can see upfront. Explore an amount and repayment plan that work for you.' }),
      h(PS.Accordion, { small: true, icon: 'heart', title: 'A friendly reminder', open: true },
        'Take a look at the estimated loan amounts and rates. If they work for you, continue to apply. We’ll review your details to work out your final offer.'),
      /* one card with the amount card above (DS 9224:37691): a line after the terms, the rows, a line, the schedule link */
      h(PS.EstimateCard, { label: 'Estimated credit limit', amount: e.amount, min: 500, max: 50000, step: 100, terms: CS.loan.terms, term: e.term, termNote: CS.loan.days + ' days / term',
        onAmount: function (a) { st[1]({ amount: a, term: e.term }); }, onTerm: function (t) { st[1]({ amount: e.amount, term: t }); },
        rows: [{ label: 'Daily fee', value: money(C.daily) }, { label: 'First payment date', value: CS.date(1) }, { label: 'Per installment', value: money(C.per) }, { label: 'Total payment', value: money(C.total) }],
        link: { label: 'View payment schedule', onClick: function () { APP.say('Your payment schedule shows once you apply.'); } },
        note: 'These are examples only. Approval and your final loan details depend on our review.' }));
  });

  /* ---- the date sheet (DS 7628:14113 · 5900:9854 · 5900:9592): the shared date picker — the month's days, or a wheel for the month or the year ---- */
  APP.sheet('date', { kind: 'card', label: 'Select date', className: 'app-date', render: function DateSheet(p) {
    return h(PS.DatePicker, { value: p.params.value, min: p.params.min, max: p.params.max, title: 'Select date', onCancel: APP.close,
      onConfirm: function (v) { APP.close(); if (p.params.then) p.params.then(v); } });
  } });

  /* ---- the address sheet (DS 5975:10755 · 5975:10704 · 5975:11304): search, or Region → Province → City on the Philippines' real list
     (ph-places.js, PSA PSGC 2025-2Q), PS.PlacePicker. The field gets "City, Province". ---- */
  APP.sheet('city', { kind: 'page', label: 'Select city and province', render: function City(p) {
    return h(PS.PlacePicker, { places: window.PH_PLACES, onClose: APP.close, onPick: function (c, pv) { APP.close(); if (p.params.then) p.params.then(c + ', ' + pv); } });
  } });
})();
