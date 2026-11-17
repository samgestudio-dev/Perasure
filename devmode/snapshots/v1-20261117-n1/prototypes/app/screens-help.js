/* PeraSure app — help articles (DS section "FAQs" 5453:4712: index, topic, article, search), changing the phone number (DS "Mobile phone change"
   8655:27419: old number → new number → code → selfie → done) and adding proof of income (DS "Upload documents" 9465:26742 / 9473:27722).
   As everywhere in the test app, nothing is uploaded or kept: a photo is only shown, a file only "uploads" on a made-up timer. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, h = R.createElement, m = PS.m, MT = PS.MT;

  /* ---- help articles: four topics; each article is paragraphs (p), headings (h) and lists (list) ---- */
  var TOPICS = [
    { id: 'apply', title: 'Credit limit application & loan drawdown' },
    { id: 'money', title: 'Disbursement' },
    { id: 'repay', title: 'Repayment' },
    { id: 'account', title: 'Registration & account management' }];
  var ARTICLES = [
    { id: 'eligible', topic: 'apply', q: 'What are the eligibility requirements for a loan?', blocks: [
      { h: 'To apply, you need to:' },
      { list: ['Be a Filipino citizen', 'Be between 18 and 65 years old', 'Have a valid government ID, like a Driver’s License, UMID, Passport, TIN ID or Postal ID', 'Have a regular source of income'] }] },
    { id: 'process', topic: 'apply', q: 'What is the application process?', blocks: [
      { p: 'You apply in the app, with no paperwork, and it takes a few minutes.' },
      { h: 'Step 1: Apply for a credit limit' },
      { p: 'Fill in your basic information, take photos of your ID and a selfie, then send your application. We’ll review it in about 2–3 minutes. Once we approve it, you’ll see your credit limit on the home screen.' },
      { h: 'Step 2: Withdraw your loan' },
      { p: 'Choose your loan amount and repayment term, then send your request. Once we approve it, we send the money to your account in about 1–5 minutes.' }] },
    { id: 'howmuch', topic: 'apply', q: 'How much can I borrow?', blocks: [
      { p: 'Your credit limit depends on your application and how you’ve repaid before. You’ll see it on the home screen once we approve you.' },
      { p: 'You can borrow from ₱500 up to your available credit. Paying on time can raise your limit over time.' }] },
    { id: 'multiple', topic: 'apply', q: 'Can I have multiple active loans?', blocks: [
      { p: 'Yes, as long as you have credit available. Each loan uses part of your credit limit, and repaying a loan frees that amount up again.' }] },
    { id: 'failed', topic: 'money', q: 'What if my loan couldn’t be disbursed?', blocks: [
      { p: 'This can happen when the account details are wrong, or when your bank or e-wallet has a temporary problem. If it happens, we’ll let you know by SMS.' },
      { p: 'Update your receiving account in the app within 48 hours, and we’ll try again. If it isn’t updated within 48 hours, we’ll cancel the loan request, and you’ll need to send a new one.' },
      { p: 'Before you send a request, check that your account details are correct.' }] },
    { id: 'howlong', topic: 'money', q: 'How long does it take to get my money?', blocks: [
      { p: 'Once we approve your loan, we send the money in about 1–5 minutes. It can take longer when your bank or e-wallet is busy.' }] },
    { id: 'method', topic: 'money', q: 'Can I change where my money is sent?', blocks: [
      { p: 'Yes. On the order page, tap the withdrawal method and choose another e-wallet or bank account. We’ll send the money to the account you choose.' }] },
    { id: 'howpay', topic: 'repay', q: 'How do I repay my loan?', blocks: [
      { p: 'Open Payment, choose what you’d like to pay, then pick a payment method: an e-wallet, a bank transfer or a payment partner.' },
      { p: 'We show you the amount and how to pay before you confirm.' }] },
    { id: 'late', topic: 'repay', q: 'What happens if I miss a payment?', blocks: [
      { p: 'A late payment adds a penalty for each day it stays unpaid, and it can lower your credit limit. Your payment card shows the amount to pay today.' },
      { p: 'If money is causing you worry, contact us. We’ll help you understand your options and find a next step that works for you.' }] },
    { id: 'early', topic: 'repay', q: 'Can I pay early?', blocks: [
      { p: 'Yes. You can pay an installment, or the whole loan, before its due date. The payment page shows the exact amount to pay today.' }] },
    { id: 'phone', topic: 'account', q: 'How do I change my phone number?', blocks: [
      { p: 'Go to Account → Manage account → Change phone number. Enter your previous number and your new one, then confirm it’s you with a code and a selfie.' },
      { p: 'Can’t get into your account? On the log in page, tap “No longer have access to old number?”.' }] },
    { id: 'delete', topic: 'account', q: 'How do I delete my account?', blocks: [
      { p: 'Go to Account → Manage account → Delete my account. You can delete your account once you’ve repaid every loan.' }] },
    { id: 'safe', topic: 'account', q: 'How do you keep my information safe?', blocks: [
      { p: 'We’re registered with the SEC and follow the Data Privacy Act. We use your information to review your application and keep your account secure.' },
      { p: 'You can read how we use your data in our Privacy & Data Collection Policy.' }] }];
  function topicOf(id) { return TOPICS.filter(function (t) { return t.id === id; })[0]; }
  function articleOf(id) { return ARTICLES.filter(function (a) { return a.id === id; })[0]; }
  /* the part of a title that matches the search, in brand blue (DS 5453:5042) */
  function marked(text, q) {
    var i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i < 0) return text;
    return [text.slice(0, i), h('span', { key: 'm', className: 'ps-c-brand' }, text.slice(i, i + q.length)), text.slice(i + q.length)];
  }

  /* index: "Hi, how can we help?", the search, every topic (DS 5453:4978); typing swaps the topics for the matching articles (5453:5042) */
  APP.screen('faqs', function Faqs() {
    var s = R.useState(''), q = s[0], setQ = s[1], k = q.trim(), hits = k ? ARTICLES.filter(function (a) { return a.q.toLowerCase().indexOf(k.toLowerCase()) >= 0; }) : null;
    return h(APP.Page, { title: '', load: 'faqs', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: APP.support }, 'Contact us')) },
      h(APP.Head, { center: true, title: 'Hi, how can we help?' }),
      h(PS.Search, { value: q, onChange: setQ, placeholder: 'Search help articles' }),
      h(PS.Crossfade, { k: hits ? 'q' + (hits.length ? 1 : 0) : 'topics' }, hits
        ? (hits.length ? h(PS.LinkList, { tall: true, items: hits.map(function (a) { return { id: a.id, label: marked(a.q, k), onClick: function () { APP.go('faq', { id: a.id }); } }; }) })
          : h(PS.EmptyState, { title: 'No matching articles', body: 'Try other words, or contact us and we’ll help.', style: { marginTop: '3rem' } }))
        : h(PS.LinkList, { tall: true, tone: 'link', title: 'Explore all topics', items: TOPICS.map(function (t) { return { id: t.id, label: t.title, onClick: function () { APP.go('faq-topic', { id: t.id }); } }; }) })));
  });
  /* a topic: its articles (DS 5453:4937) */
  APP.screen('faq-topic', function FaqTopic(p) {
    var t = topicOf(p.params.id) || TOPICS[0];
    return h(APP.Page, { title: '', load: 'faq-' + t.id },
      h(APP.Head, { title: t.title }),
      h(PS.LinkList, { tall: true, items: ARTICLES.filter(function (a) { return a.topic === t.id; }).map(function (a) { return { id: a.id, label: a.q, onClick: function () { APP.go('faq', { id: a.id }); } }; }) }));
  });
  /* an article (DS 5453:4947 · 6149:12701 · 6150:12923 · 6150:12975): the answer, "Was this article helpful?", then related articles */
  APP.screen('faq', function Faq(p) {
    var a = articleOf(p.params.id) || ARTICLES[0], s = R.useState(null), vote = s[0], setVote = s[1];
    var related = ARTICLES.filter(function (x) { return x.topic === a.topic && x.id !== a.id; });
    return h(APP.Page, { title: '', load: 'faq-a-' + a.id },
      h(APP.Head, { title: a.q }),
      h(PS.Article, { blocks: a.blocks }),
      h(PS.Feedback, { value: vote, onVote: function (x) { setVote(x); if (x === 'No') APP.say('Sorry this didn’t help. Contact us and we’ll find the answer with you.', 3200); } }),
      related.length ? h(PS.RelatedLinks, { title: 'Related articles', items: related.map(function (x) { return { id: x.id, label: x.q, onClick: function () { APP.swap('faq', { id: x.id }, 0); } }; }) }) : null);
  });

  /* ---- changing the phone number (DS 8833:31439 → 8655:27420 → 8655:27434 → 8833:31280 → 8667:28313 → 8667:28329) ---- */
  function validPhone(v) { return /^9\d{9}$/.test(v) ? null : 'Enter your 10-digit mobile number, starting with 9.'; }
  /* leave the flow: back to the page it was started from */
  function leaveFlow() { var st = APP.S.stack, i = st.map(function (x) { return x.name; }).lastIndexOf('phone-old'); APP.back(i > 0 ? st.length - i : 1); }
  APP.screen('phone-old', function PhoneOld() {
    var s = R.useState(''), v = s[0], set = s[1], e = R.useState(null), err = e[0], setErr = e[1];
    function next() { var x = validPhone(v); if (x) { setErr(x); return; } APP.go('phone-new', { old: v }); }
    return h(APP.Page, { title: 'PeraSure account', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: v.length < 10, onClick: next }, 'Next')) },
      h(APP.Head, { title: 'Your previous phone number', body: 'Enter the phone number linked to your PeraSure account.' }),
      h(PS.PhoneField, { value: v, onChange: function (x) { set(x); setErr(null); }, error: err }));
  });
  APP.screen('phone-new', function PhoneNew(p) {
    var s = R.useState(''), v = s[0], set = s[1], e = R.useState(null), err = e[0], setErr = e[1];
    function next() {
      var x = validPhone(v) || (v === p.params.old ? 'This is your previous number. Enter the new one.' : null); if (x) { setErr(x); return; }
      APP.go('sending', { phone: v, then: function () { APP.swap('phone-selfie', { phone: v }, 1); } });
    }
    return h(APP.Page, { title: 'PeraSure account', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: v.length < 10, onClick: next }, 'Send code')) },
      h(APP.Head, { title: 'Your new phone number', body: 'We’ll send a verification code to this number before we update your account.' }),
      h(PS.PhoneField, { value: v, onChange: function (x) { set(x); setErr(null); }, error: err }));
  });
  /* the selfie: the front camera in the circle and the tips (DS 8833:31280); Next opens the full camera */
  APP.screen('phone-selfie', function PhoneSelfie(p) {
    var cam = APP.useCamera('user', true);
    return h(APP.Page, { title: 'PeraSure account', bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: function () { APP.go('face', p.params); } }, 'Next')) },
      h(APP.Head, { title: 'Take a selfie', body: 'Look straight ahead with a relaxed face. Use good lighting and remove glasses or hats.' }),
      h(PS.Selfie, { state: 'live', cam: cam },
        h(PS.SelfieTips, { onMore: function (el) { APP.tipAt(el, 'Hold the phone at eye level, keep your whole face inside the circle and stay still while we take the photo.'); } })));
  });
  /* the face camera (DS 8667:28313 / 8667:28329): the whole screen, an oval; after the shutter, the photo with Take again / Next */
  APP.screen('face', function Face(p) {
    var s = R.useState(null), shot = s[0], setShot = s[1], cam = APP.useCamera('user', !shot);
    function take() { setShot(cam.snap(PS.asset('art/selfie-tip-1.png'))); }
    function done() {
      APP.run(function () {
        var ph = p.params.phone; APP.set({ phone: ph }); leaveFlow();
        APP.say('Your phone number is updated. Use +63 ••••••' + ph.slice(-4) + ' to log in from now on.', 3400);
      });
    }
    return h(PS.FaceCamera, { cam: cam, shot: shot, title: 'Confirm your identity', onBack: function () { APP.back(); }, onTake: take, onRetake: function () { setShot(null); }, onNext: done });
  });

  /* ---- proof of income (DS 9465:26742 · 9465:26861 · 9473:27722): five kinds of document; + (or Add files) opens Take a photo / Choose from
     photos / Choose from files; a file compresses, uploads (a made-up timer) and is done. Tune → Network "First try fails": the first upload fails. ---- */
  var KINDS = [
    { id: 'payslip', title: 'Payslips', sub: 'From the last 2–3 months' },
    { id: 'coe', title: 'Certificate of employment (COE)', sub: 'Issued in the last 90 days' },
    { id: 'salary', title: 'Salary deposit records', sub: 'From your bank or e-wallet, last 2–3 months' },
    { id: 'sss', title: 'SSS contribution records', sub: 'Showing your employer’s contributions, last 3–6 months' },
    { id: 'gsis', title: 'GSIS contribution records', sub: 'Last 3–6 months' }];
  var PICK = ['Take a photo', 'Choose from photos', 'Choose from files'], MAX = 5, failedOnce = false, fid = 0;
  APP.screen('docs', function Docs() {
    var s = R.useState({}), files = s[0], setFiles = s[1], o = R.useState({}), open = o[0], setOpen = o[1], pk = R.useState(null), pick = pk[0], setPick = pk[1];
    var anchor = R.useRef(null), timers = R.useRef({});
    R.useEffect(function () { return function () { Object.keys(timers.current).forEach(function (k) { clearInterval(timers.current[k]); }); }; }, []);
    function patch(kind, id, ch) { setFiles(function (all) { var n = Object.assign({}, all); n[kind] = (n[kind] || []).map(function (f) { return f.id === id ? Object.assign({}, f, ch) : f; }); return n; }); }
    function upload(kind, id) {
      patch(kind, id, { state: 'compressing', progress: 0 });
      var fail = APP.T.net === 'error' && !failedOnce, t0 = 0;
      setTimeout(function () {
        patch(kind, id, { state: 'uploading', progress: 0 }); t0 = Date.now();
        timers.current[id] = setInterval(function () {
          var k = Math.min(1, (Date.now() - t0) / 1600);
          if (fail && k > 0.4) { clearInterval(timers.current[id]); failedOnce = true; patch(kind, id, { state: 'failed' }); return; }
          if (k >= 1) { clearInterval(timers.current[id]); patch(kind, id, { state: 'done', progress: 1 }); return; }
          patch(kind, id, { progress: k });
        }, 80);
      }, 700);
    }
    function add(kind, how) {
      setPick(null);
      if ((files[kind] || []).length >= MAX) { APP.say('You can add up to ' + MAX + ' files here.'); return; }
      APP.pickFile(how === 'Choose from files' ? 'image/*,application/pdf' : 'image/*', function (pic, f) {
        var id = 'f' + (++fid);
        setFiles(function (all) { var n = Object.assign({}, all); n[kind] = (n[kind] || []).concat([{ id: id, name: f.name, size: f.size, state: 'compressing', progress: 0 }]); return n; });
        setOpen(function (x) { var n = Object.assign({}, x); n[kind] = true; return n; });
        upload(kind, id);
      }, how === 'Take a photo' ? 'environment' : null);
    }
    function remove(kind, id) { clearInterval(timers.current[id]); setFiles(function (all) { var n = Object.assign({}, all); n[kind] = (n[kind] || []).filter(function (f) { return f.id !== id; }); return n; }); }
    var done = KINDS.some(function (k) { return (files[k.id] || []).some(function (f) { return f.state === 'done'; }); });
    function next() { APP.run(function () { APP.set({ user: 'review' }); APP.home('home', 0); APP.say('Thanks, we’ve got your documents. We’ll let you know what happens next.', 3400); }); }
    return h(APP.Page, { title: '', colBottom: 168, bottom: h(PS.BottomBar, null, h(PS.Button, { block: true, inactive: !done, onClick: function () { if (done) next(); else APP.say('Add at least one file, or tap Not now.'); } }, 'Next'),
        h(PS.Button, { variant: 'text', block: true, onClick: function () { APP.back(); } }, 'Not now')) },
      h(APP.Head, { title: 'Add proof of income (optional)', body: 'It may improve your chances of approval and the amount you can borrow.' }),
      h('div', { className: 'app-docs' },
        KINDS.map(function (k) {
          return h(PS.DocCard, { key: k.id, title: k.title, sub: k.sub, open: !!open[k.id], onToggle: function () { setOpen(function (x) { var n = Object.assign({}, x); n[k.id] = !x[k.id]; return n; }); },
            onAdd: function (el) { anchor.current = el; setPick(k.id); },
            files: (files[k.id] || []).map(function (f) { return Object.assign({}, f, { onRemove: function () { remove(k.id, f.id); }, onRetry: function () { upload(k.id, f.id); } }); }) });
        }),
        h(PS.Popover, { open: !!pick, anchor: anchor, options: PICK, label: 'Add a file', onPick: function (x) { add(pick, x); }, onClose: function () { setPick(null); } }),
        h(PS.FileNote, null, 'Supports JPG, JPEG, PNG and PDF')));
  });
})();
