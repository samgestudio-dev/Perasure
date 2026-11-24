/* PeraSure components — the gallery entries for the components added with the full app (feedback.js, form.js, status.js, apply.js,
   pay.js, list.js, fx.js). gallery.js adds these groups after its own (window.PS_GALLERY). Same entry format. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement;
  function noop() {}
  function col(kids, gap) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: gap == null ? 12 : gap } }, kids); }
  function frame(height, kids) { return h('div', { className: 'g-frame', style: { height: height } }, kids); }
  /* Stateful: a demo that needs its own state — render(value, set) */
  function Stateful(p) { var s = R.useState(p.first); return p.render(s[0], s[1]); }
  function live(first, render) { return function () { return h(Stateful, { first: first, render: render }); }; }
  /* Replay: plays its content again on tap (entrances, one-shot animations) */
  function Replay(p) {
    var s = R.useState(0);
    return col([h('div', { key: s[0] }, p.children(s[0])), h(PS.Button, { key: 'b', variant: 'text', onClick: function () { s[1](s[0] + 1); } }, 'Play again')]);
  }

  /* phone: a frame as tall as a small phone, for the full-screen pieces (the cameras read the frame's height from --ph) */
  function phone(height, kids) { return h('div', { className: 'g-frame', style: { height: height, '--ph': height + 'px' } }, kids); }
  function InSheet(p) { return h(PS.GalleryInSheet, p); }
  var NOCAM = { state: 'none', video: null };   /* the gallery never asks for the camera: the pieces show their "no camera" state */
  var PLACES = [['National Capital Region (NCR)', [['Metro Manila', ['Caloocan City', 'Makati City', 'Manila', 'Pasig City', 'Quezon City', 'Taguig City']]]],
    ['Region III (Central Luzon)', [['Bulacan', ['Malolos City', 'Meycauayan City', 'San Jose del Monte City']], ['Pampanga', ['Angeles City', 'City of San Fernando', 'Mabalacat City']]]],
    ['Region VII (Central Visayas)', [['Cebu', ['Cebu City', 'Lapu-Lapu City', 'Mandaue City', 'Talisay City']], ['Bohol', ['Tagbilaran City']]]]];
  var BANKS = [['aub', 'Asia United Bank'], ['bdo', 'Banco de Oro (BDO)'], ['bpi', 'Bank of the Philippine Islands'], ['bpi-banko', 'BPI Globe BanKO'], ['chinabank', 'China Bank'],
    ['eastwest', 'EastWest Bank'], ['gcash', 'GCash'], ['landbank', 'Landbank'], ['maya', 'Maya'], ['metrobank', 'Metrobank'], ['rcbc', 'RCBC'], ['unionbank', 'UnionBank']];
  function bankGroups(q) {
    var g = {}; BANKS.filter(function (b) { return b[1].toLowerCase().indexOf(q.trim().toLowerCase()) >= 0; }).forEach(function (b) { var k = b[1].charAt(0).toUpperCase(); (g[k] = g[k] || []).push({ id: b[0], name: b[1], logo: PS.asset('logos/pay-' + b[0] + '.png') }); });
    return Object.keys(g).sort().map(function (k) { return { title: k, items: g[k] }; });
  }
  function WhiteSheet(p) {
    var body = R.useRef(null), k = p.v.q.trim().toLowerCase();
    var cats = !k ? CATS : CATS.map(function (x) { return Object.assign({}, x, { groups: x.groups.map(function (g) { return Object.assign({}, g, { items: g.items.filter(function (it) { return it.name.toLowerCase().indexOf(k) >= 0; }) }); }).filter(function (g) { return g.items.length; }) }); }).filter(function (x) { return x.groups.length; });
    return h(PS.SearchSheet, { tone: 'white', value: p.v.q, onChange: function (q) { p.set({ q: q, c: p.v.c }); }, placeholder: 'Search payment method', onClose: p.close, bodyRef: body },
      cats.length ? h(PS.MethodPicker, { cats: cats, value: p.v.c, onCat: function (c) { p.set({ q: p.v.q, c: c }); }, scroller: body, onPick: p.close })
        : h(PS.EmptyState, { title: 'No repayment method found', body: 'Check the spelling or try another name.', style: { marginTop: '4.5rem' } }));
  }
  var PENALTIES = [['Days 1-3', 'No penalty, but your payment is overdue.'], ['Day 4', '5% of the unpaid principal for each installment.'], ['Every 30 days', 'Another 5% on the principal that’s still unpaid.']];
  var SCAMS = [{ anim: 'customer-service', title: 'Customer service is only available in the app', body: 'If you’re unsure about anything, contact customer service in the app.' },
    { anim: 'safe-transaction', title: 'Keep all payments and transactions in the app', body: 'Watch out for people who say they represent us on Facebook, by SMS or elsewhere. Don’t pay anyone for a higher credit limit or other offers outside the app.' },
    { anim: 'verification-code', title: 'Keep your verification code private', body: 'Never share it with anyone, even if they say they’re our staff. We’ll never ask for your code.' }];
  var WAYS = [{ id: 'sms', icon: 'message', label: 'SMS' }, { id: 'phone', icon: 'phone', label: 'Phone' }, { id: 'viber', icon: 'viber', label: 'Viber' }, { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' }];
  /* Ticker: counts v.left down once a second (the Resend countdown) */
  function Ticker(p) { R.useEffect(function () { if (p.v.left <= 0) return; var t = setTimeout(function () { p.set(Object.assign({}, p.v, { left: p.v.left - 1 })); }, 1000); return function () { clearTimeout(t); }; }, [p.v]); return p.children; }
  var ARTICLE = [{ p: 'To apply, you need to:' }, { list: ['Be a Filipino citizen', 'Be between 18 and 65 years old', 'Have a valid government ID, like a Driver’s License, UMID, Passport, TIN ID or Postal ID', 'Have a regular source of income'] },
    { h: 'What if I don’t have a payslip?' }, { p: 'You can still apply. Bank or e-wallet statements, or a company ID, can show your income too.' }];

  var CATS = [{ id: 'qr', icon: 'qr-code', label: 'QR Code', groups: [{ title: 'Direct App Pay', tag: 'Recommend', items: [{ id: 'a', name: 'GCash' }] }, { title: 'QR Code', items: [{ id: 'b', name: 'GCash' }, { id: 'c', name: 'Maya' }] }] },
    { id: 'bill', icon: 'receipt', label: 'Bill Payment', groups: [{ title: 'Bills Payment', items: [{ id: 'd', name: 'GCash' }, { id: 'e', name: 'ShopeePay' }] }] },
    { id: 'bank', icon: 'bank', label: 'Bank Transfer', groups: [{ title: 'Bank Transfer', items: [{ id: 'f', name: 'BPI' }, { id: 'g', name: 'Metrobank' }] }] }];

  window.PS_GALLERY = [
    { id: 'feedback', title: 'Loading and feedback', items: [
      { name: 'Loader · Coin · Dots · Busy', desc: 'The Loading page as a component: the coin and the three dots at its sizes. Coin alone lands on the tick (Order submit). Busy is the small pulse inside a waiting button.',
        props: 'Loader: fill · label — Coin: size (50) · inset · state loading | success · onDone — Dots: width (84) — Busy: none',
        states: [
          ['Loader', function () { return h(PS.Loader, { style: { padding: '32px 0' } }); }],
          ['Coin → tick', function () { return h(Replay, null, function () { return h(Stateful, { first: 'loading', render: function (st, set) {
            return col([h('div', { key: 'c', style: { display: 'flex', justifyContent: 'center', padding: 16 } }, h(PS.Coin, { size: 56, state: st })), h(PS.Button, { key: 'b', size: 'sm', onClick: function () { set('success'); } }, 'Finish')]); } }); }); }],
          ['Dots', function () { return h('div', { style: { display: 'flex', justifyContent: 'center', padding: 24 } }, h(PS.Dots)); }],
          ['Busy', function () { return h(PS.Button, { block: true, disabled: true }, h(PS.Busy)); }]] },
      { name: 'Overlay', desc: 'A full-screen layer over the page (loaders, Order submit) that fades in quickly and leaves on LEAVE. Glass: the page shows through, blurred.', props: 'open · tone page | glass · children',
        states: [['Page', live(true, function (v, set) { return frame(260, [h('div', { key: 'b', className: 'g-center' }, h(PS.Button, { size: 'sm', onClick: function () { set(true); } }, 'Show it')),
            h(PS.Overlay, { key: 'o', open: v }, h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 } }, h(PS.Loader), h(PS.Button, { size: 'sm', variant: 'text', onClick: function () { set(false); } }, 'Hide')))]); })],
          ['Glass', live(true, function (v, set) { return frame(260, [h('div', { key: 'c', style: { padding: 16 } }, h(PS.HistoryRow, { amount: 2000, state: 'paid', label: 'Paid off', onClick: noop })),
            h('div', { key: 'b', style: { position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' } }, h(PS.Button, { size: 'sm', onClick: function () { set(true); } }, 'Show it')),
            h(PS.Overlay, { key: 'o', open: v, tone: 'glass' }, h(PS.Button, { size: 'sm', variant: 'text', onClick: function () { set(false); } }, 'Hide'))]); })]] },
      { name: 'Splash · SendingCard', desc: 'The app opening (the PeraSure mark growing in on the page grey) and "Sending security code…" on its white card with the Loading state OTP animation.', props: 'Splash: none — SendingCard: title · body',
        states: [['Splash', function () { return frame(300, h(PS.Splash)); }], ['Sending', function () { return h('div', { style: { display: 'flex', justifyContent: 'center' } }, h(PS.SendingCard, { title: 'Sending security code…', body: 'This may take a few seconds' })); }]] },
      { name: 'Cover · Fallback', desc: 'A page that is still loading, or that failed (PS.Fallback: “Something went wrong” with its picture where the loader’s coin was and a 264 px Try again): the layer covers the whole screen (content and bottom bar); the header’s buttons stay. Used anywhere inside a Screen.',
        props: 'open · tone page | white (the fallback page) · chrome · children — Fallback: onRetry · title · body',
        states: [
          ['Loading', function () { return frame(420, h(PS.Screen, { top: { left: h(PS.Back, { onClick: noop }), title: 'Loan history' }, bottom: h(PS.BottomBar, null, h(PS.Button, { block: true }, 'Continue')) },
            h(PS.Cover, { open: true }, h(PS.Loader, { fill: true })))); }],
          ['Failed', function () { return frame(420, h(PS.Screen, { top: { left: h(PS.Back, { onClick: noop }), title: 'Loan history' } },
            h(PS.Cover, { open: true, tone: 'white', chrome: true }, h(PS.Fallback, { onRetry: noop })))); }]] },
      { name: 'Rise · Crossfade', desc: 'Content that has just loaded rises in piece by piece (0.34 s each, 40 ms apart). Crossfade with rise does the same for a list that replaces another.',
        props: 'Rise: className · delay · gap · y · off — Crossfade: k · rise · className',
        states: [['Rise', function () { return h(Replay, null, function () { return h(PS.Rise, { style: { display: 'flex', flexDirection: 'column', gap: 12 } },
          [0, 1, 2].map(function (i) { return h(PS.HistoryRow, { key: i, amount: 2000, state: ['review', 'disbursing', 'paid'][i], label: ['Under review', 'Disbursing', 'Paid off'][i], onClick: noop }); })); }); }]] },
      { name: 'StatusBox · Notice · Result', desc: 'An inline message, the white strip under a card, and a whole-page message with its buttons.',
        props: 'StatusBox: tone negative | info | neutral · title · children · action — Notice: icon · children · onClick — Result: anim | art · title · body · children',
        states: [
          ['Status', function () { return col([h(PS.StatusBox, { key: 'a', title: 'We couldn’t send the code' }, 'Check your signal and try again.'), h(PS.StatusBox, { key: 'b', tone: 'info', icon: 'info' }, 'We check every application within 2 hours.')]); }],
          ['Notice', function () { return h(PS.Notice, { onClick: noop }, 'All PeraSure transactions happen in the app. Never send money through third parties.'); }],
          ['Result', function () { return h(PS.Result, { anim: 'customer-service-chat', title: 'Help us improve PeraSure', body: 'Share your concerns with our online customer service.' }, h(PS.Button, { block: true }, 'Contact customer support')); }]] },
      { name: 'Tooltip · placement', desc: 'The app\'s tooltip, live (spec states: entry Tooltip). Places itself: 8 px under what was tapped, centred, or with its edge 16 px past it near a side; always inside the 16 px margins; above when there is no room below.',
        props: 'open · text (string or node) · anchor (PS.frameRect(el)) · width · icon (a 28 px brand tile and a ×) · big (16 padding, radius 24: the penalty explainer) · onClose',
        states: [['Try it', live(null, function (tip, set) {
          return frame(260, [h('div', { key: 'r', style: { display: 'flex', justifyContent: 'space-between', padding: 24 } }, ['left', 'middle', 'right'].map(function (k) {
            return h(PS.Glass, { key: k, icon: 'help-circle', label: 'Help', onClick: function (e) { set({ anchor: PS.frameRect(e.currentTarget), text: 'Your available amount is what you can borrow today.' }); } }); })),
            h(PS.Tooltip, { key: 't', open: !!tip, anchor: tip && tip.anchor, text: tip ? tip.text : '', onClose: function () { set(null); } })]); })],
          ['Icon · big', live(null, function (tip, set) {
          return frame(420, [h('div', { key: 'r', style: { display: 'flex', justifyContent: 'space-between', padding: 24 } }, [['icon', 'info'], ['big', 'help-circle']].map(function (k) {
            return h(PS.Glass, { key: k[0], icon: k[1], label: k[0], onClick: function (e) { set({ kind: k[0], anchor: PS.frameRect(e.currentTarget) }); } }); })),
            h(PS.Tooltip, { key: 't', open: !!tip, anchor: tip && tip.anchor, icon: tip && tip.kind === 'icon' ? 'coupon' : null, big: tip && tip.kind === 'big', width: tip && tip.kind === 'big' ? 288 : undefined,
              text: !tip ? '' : tip.kind === 'big' ? h(PS.PenaltyInfo, { rows: PENALTIES }) : 'Borrow ₱10,000 or more · 3 / 6 terms · One per account', onClose: function () { set(null); } })]); })]] },
      { name: 'Toasts', desc: 'Messages at the top, like iPhone notifications: every tap shows a new one at once, covering the one before (it slips down, shrinks and fades; three deep). Swipe one left to close it.',
        props: 'items [{ id, text }] · onClose(id) · top',
        states: [['Try it', live({ n: 0, items: [] }, function (v, set) {
          var texts = ['Code sent to +63 •••• 4567.', 'We’ve copied the reference number.', 'Your loan is now ₱6,000 · 6 terms.'];
          function close(id) { set(function (o) { return { n: o.n, items: o.items.filter(function (t) { return t.id !== id; }) }; }); }
          return frame(200, [h(PS.Toasts, { key: 't', items: v.items, onClose: close, top: 16 }),
            h('div', { key: 'b', style: { position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' } },
              h(PS.Button, { size: 'sm', onClick: function () { var id = v.n + 1; set({ n: id, items: v.items.concat([{ id: id, text: texts[id % 3] }]).slice(-4) }); setTimeout(function () { close(id); }, 2600); } }, 'Show a toast'))]); })]] }] },

    { id: 'forms', title: 'Forms', items: [
      
      { name: 'ContactMethods · more', desc: 'How the code is sent. (OtpBoxes is its own entry now.)', props: 'items · value · onChange',
        states: [['Methods', live('sms', function (v, set) { return h(PS.ContactMethods, { value: v, onChange: set, items: [{ id: 'sms', icon: 'message', label: 'SMS' }, { id: 'phone', icon: 'phone', label: 'Phone' }, { id: 'viber', icon: 'viber', label: 'Viber' }, { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' }] }); })]] },
      { name: 'OtpForm', desc: 'The code page\'s body: the boxes with the error under them, another way to get the code, and Resend after a countdown.', props: 'value · onChange · error (text) · disabled · ways · way · onWay · left (seconds) · onResend',
        states: [['Live', live({ code: '', way: 'sms', left: 9 }, function (v, set) {
          return h(Ticker, { v: v, set: set }, h('div', { style: { display: 'flex', flexDirection: 'column' } }, h(PS.OtpForm, { value: v.code, error: v.code.length === 6 && v.code !== '122436' ? 'Incorrect code. Please try again.' : null,
            onChange: function (c) { set(Object.assign({}, v, { code: c })); }, ways: WAYS, way: v.way, onWay: function (w) { set(Object.assign({}, v, { way: w, code: '', left: 9 })); }, left: v.left, onResend: function () { set(Object.assign({}, v, { code: '', left: 9 })); } }))); })],
          ['Wrong code', function () { return h('div', { style: { display: 'flex', flexDirection: 'column' } }, h(PS.OtpForm, { value: '122435', error: 'Incorrect code. Please try again.', onChange: noop, ways: WAYS, way: 'sms', left: 0, onWay: noop, onResend: noop })); }]] },
      { name: 'ReasonList', desc: 'Reasons with a radio each, then a box for more (200 characters): deleting the account, cancelling a loan.', props: 'items · value (index, -1 none) · onChange · text · onText',
        states: [['Pick', live({ i: -1, t: '' }, function (v, set) { return h(PS.ReasonList, { items: ['I no longer need the money', 'I borrowed by mistake', 'The fees are higher than I expected', 'Other reason'], value: v.i, text: v.t,
          onChange: function (i) { set({ i: i, t: v.t }); }, onText: function (t) { set({ i: v.i, t: t }); } }); })]] },
      { name: 'Keypad · more', desc: 'The amount keypad. (Segmented and SelectBar are their own entries now.)', props: 'onKey · extra · cascade',
        states: [['Keypad', function () { return h(PS.Keypad, { onKey: noop }); }]] },
      { name: 'FormField · Popover', desc: 'The application forms\' field (label above, white 44 px box) and its popover list (DS 7201:12032): glass card, 36 px pills, at most 220 high with a thumb and a fade, 8 px under the box, above it when there is no room.',
        props: 'FormField: label · value · placeholder · onChange | onClick | menu { options, onPick } · icon · clear · error · suggest + onSuggest — Popover: open · options · value · onPick · onClose · anchor · block',
        states: [
          ['Typing', live('', function (v, set) { return h(PS.FormField, { label: 'Email', value: v, placeholder: 'Enter your email', clear: true, onChange: set, suggest: v && v.indexOf('@') < 0 ? [v + '@gmail.com', v + '@yahoo.com'] : [], onSuggest: set }); })],
          ['Error', function () { return h(PS.FormField, { label: 'Total monthly income (PHP)', value: '35k', onChange: noop, clear: true, error: 'Please enter numbers only' }); }],
          ['Menu', live('', function (v, set) { return frame(300, h(PS.FormField, { label: 'Job type', value: v, placeholder: 'Select your job type', menu: { options: ['BPO Worker', 'Freelance', 'Staff/Factory Worker', 'Government/Public Utility', 'Self-employed', 'House Wife', 'Unemployed/Retired'], onPick: set } })); })],
          ['Date', function () { return h(PS.FormField, { label: 'Next payday', value: '', placeholder: 'Select your next payday', icon: 'calendar', onClick: noop }); }],
          ['Picked', function () { return h(PS.FormField, { label: 'City / province', value: 'Quezon City, Metro Manila', placeholder: 'Select city and province', onClick: noop }); }]] },
      { name: 'DatePicker · Wheel', desc: 'The date card (DS 7628:14113): month and year steppers, the days with the chosen one on a brand circle; tap the month or the year for a wheel (react-wheel-picker, vendor/react-wheel-picker@1.2.3) with Cancel / Confirm. The body keeps six weeks\' height.',
        props: 'DatePicker: value { y, m, d } · min · max · onConfirm · onCancel · title — Wheel: options [{ value, label }] · value · onChange · infinite',
        states: [
          ['Days', live({ y: 2026, m: 11, d: 24 }, function (v, set) { return h('div', { className: 'ps-card', style: { padding: '20px 16px 32px' } }, h(PS.DatePicker, { value: v, min: { y: 2026, m: 0, d: 1 }, max: { y: 2027, m: 11, d: 31 }, onConfirm: set, onCancel: noop })); })],
          ['Wheel', live(5, function (v, set) { return h(PS.Wheel, { options: PS.MONTHS.map(function (n, i) { return { value: i, label: n }; }), value: v, onChange: set, infinite: true }); })]] },
      { name: 'DocCard · FileRow', desc: 'Proof of income (DS 9473:27722): a kind of document with a + until a file is added, then its files with their state, a chevron to fold them and a dashed Add files.',
        props: 'DocCard: title · sub · files · open · onToggle · onAdd(element) — FileRow: name · size · state done | compressing | uploading | failed · progress · onRemove · onRetry · pic',
        states: [
          ['Empty', function () { return h(PS.DocCard, { title: 'Payslips', sub: 'From the last 2–3 months', files: [], onAdd: noop, onToggle: noop }); }],
          ['Files', live(true, function (v, set) { return h(PS.DocCard, { title: 'Payslips', sub: 'From the last 2–3 months', open: v, onToggle: function () { set(!v); }, onAdd: noop, files: [
            { id: 'a', name: 'SSS_Contributions_2026.pdf', size: 1153434, state: 'done', onRemove: noop }, { id: 'b', name: 'Payslip_scan_Sept_2026.jpg', size: 2516582, state: 'uploading', progress: 0.62, onRemove: noop },
            { id: 'c', name: 'Payslip_scan_Sept_2026.jpeg', size: 2516582, state: 'compressing', onRemove: noop }, { id: 'd', name: 'SSS_Contributions_2026_012345.png', size: 900000, state: 'failed', onRetry: noop }] }); })],
          ['Picture', function () { return h(PS.FileRow, { name: 'Payslip_scan_Sept_2026.jpg', size: 2516582, state: 'done', pic: PS.asset('art/id-front.png'), onRemove: noop }); }]] },
      { name: 'SelfieTips', desc: 'The selfie instructions (DS 5585:5407): three pictures with a tick or a cross, and More (three brand dots) for the full tip. (LineTabs is its own entry now.)',
        props: 'items [{ art, label, ok }] · title · onMore(element)',
        states: [['Selfie tips', function () { return h(PS.SelfieTips, { onMore: noop }); }]] },
      { name: 'Consent', desc: 'The small agreement line. (Search is its own entry now.)', props: 'on · onToggle · children',
        states: [['Consent', live(true, function (v, set) { return h(PS.Consent, { on: v, onToggle: function () { set(!v); } }, 'By continuing, you agree to our ', h('b', null, 'Terms of Service'), '.'); })]] },
      { name: 'UploadTile · more', desc: '(Spec states: entry UploadTile.) A picture slot (ID sides, documents): the sample or a +, a veil with the pulse while it uploads, a green tick or a red cross in the corner.', props: 'art (png in assets/art) · label · state empty | loading | done | error · onClick',
        states: [['States', function () { return h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } },
          h(PS.UploadTile, { art: 'id-front', label: 'Empty', onClick: noop }), h(PS.UploadTile, { art: 'id-front', label: 'Uploading', state: 'loading' }),
          h(PS.UploadTile, { art: 'id-back', label: 'Done', state: 'done' }), h(PS.UploadTile, { art: 'id-back', label: 'Failed', state: 'error' })); }],
          ['No picture', function () { return h('div', { style: { width: 160 } }, h(PS.UploadTile, { label: 'Add a photo', onClick: noop })); }]] }] },

    { id: 'status', title: 'Home states', items: [
      { name: 'StateCard · more', desc: '(Spec states: entry StateCard.) The brand card of an application state, in place of the credit card.', props: 'title · body · icon · timer { label, value } · support { text, onClick } · button { label, icon, tone, onClick }',
        states: [
          ['In progress', function () { return h(PS.StateCard, { icon: 'history', title: 'Application in progress', body: 'We’ve got your application and we’re reviewing it now.' }); }],
          ['Add documents', function () { return h(PS.StateCard, { title: 'Help us review your application', body: 'Add documents that show your job or income.', timer: { label: 'Time remaining', value: '47h 57m 10s' }, button: { label: 'Add documents', tone: 'white', onClick: noop } }); }],
          ['Not approved', function () { return h(PS.StateCard, { title: 'Application wasn’t approved', body: 'We can’t offer you a credit limit right now. You can apply again after 30 days.', support: { text: 'Have a question about the result? Chat with support!', onClick: noop } }); }],
          ['Expired', function () { return h(PS.StateCard, { title: 'Your application expired', body: 'Apply again to see your credit limit.', button: { label: 'Reapply now', icon: 'money-out', onClick: noop } }); }]] },
      { name: 'Strip · more', desc: 'A white one-line card that leads somewhere: loan updates, or a question to support. Raised: the default shadow (on home).', props: 'icon · tone · title · sub · text · count · chevron · raised · onClick',
        states: [
          ['Loan update', function () { return h(PS.Strip, { icon: 'info', title: 'You have updates on your loan', sub: 'Tap to view the latest status', count: 1, onClick: noop }); }],
          ['Chat', function () { return h(PS.Strip, { icon: 'support-chat', text: 'Have a question about your application? Chat with support!', chevron: true, onClick: noop }); }],
          ['Raised', function () { return h(PS.Strip, { icon: 'info', title: 'You have updates on your loan', sub: 'Tap to view the latest status', count: 1, raised: true, onClick: noop }); }]] },
      { name: 'Hero · Reviews · OfferCard · PermissionCard', desc: 'The first home page before there is a limit, what customers say, another product when ours isn’t available, and one permission with its reason.',
        props: 'Hero: label · amount · tagline · stats · action — Reviews: items — OfferCard: logo · tag · label · value · rows — PermissionCard: icon · title · body',
        states: [
          ['Hero', function () { return h(PS.Hero, { label: 'You may qualify for up to', amount: 50000, tagline: 'Simple, Fast, Made for You.', stats: [{ value: '<0.3%', label: 'Daily rate' }, { value: '91-180d', label: 'Terms' }, { value: '3 mins', label: 'Approval' }], action: 'Check your limit', onClick: noop }); }],
          ['Reviews', function () { return h(PS.Reviews, { items: [{ title: 'Borrow Again Anytime', text: '"Super convenient revolving limit! Paid my dues and was able to borrow again in just a few minutes."', name: 'John S.' }, { title: '100% Legit, Low Interest', text: '"Legit and highly recommended, low interest and no hidden fees."', name: 'Maria C.' }] }); }],
          ['Offer', function () { return h(PS.OfferCard, { logo: 'loadcash', name: 'LoadCash', tag: 'Best match', label: 'Max amount', value: '₱50,000', rows: [{ label: 'Max term', value: '180 days' }], onClick: noop }); }],
          ['Permission', function () { return h(PS.PermissionCard, { icon: 'camera', title: 'Camera', body: 'Used for facial verification, ID verification, and uploading ID photos.' }); }]] }] },

    { id: 'pay', title: 'Repayments', items: [
      { name: 'Installment · PayBar · PayDock · ScamStrip', desc: 'One repayment with its tick, the total above the tab bar, and the scam warning whose text runs sideways.',
        props: 'Installment: month · day · amount · sub · tone · on · onToggle · note · noteIcon · onDetail — PayBar: total · was · onPay · disabled — ScamStrip: children · onClick',
        states: [
          ['Overdue', live(true, function (v, set) { return h(PS.Installment, { month: 'JAN', day: '15', amount: 2050, tone: 'negative', sub: 'Overdue 18 days', note: 'Includes ₱50.00 penalty', noteIcon: 'info', on: v, onToggle: function () { set(!v); }, onDetail: noop }); })],
          ['Upcoming', live(false, function (v, set) { return h(PS.Installment, { month: 'JUL', day: '20', amount: 1234.5, tone: 'brand', sub: 'Due in 45 days', note: 'No penalty for 3 days after the due date', noteIcon: 'order', on: v, onToggle: function () { set(!v); }, onDetail: noop }); })],
          ['Total', function () { return h(PS.PayBar, { total: 2050, onPay: noop }); }],
          ['Scam strip', function () { return h(PS.ScamStrip, { onClick: noop }, 'Beware of scams. Contact in-app customer service to verify transaction requests from outside the app.'); }],
          ['Nothing picked', function () { return h(PS.PayBar, { total: 0, disabled: true, onPay: noop }); }],
          ['Docked', function () { return frame(200, h(PS.PayDock, null, h(PS.PayBar, { total: 2050, onPay: noop }))); }]] },
      { name: 'RepayCard · InsetRows · QrPanel · PayTimer · Accordion', desc: 'What to pay and how: a button to the e-wallet, the reference rows, or a QR code; then an example that opens.',
        props: 'RepayCard: amount · due · onCopy · children — InsetRows: rows — QrPanel: merchant · onSave — PayTimer: seconds — Accordion: title · open · children',
        states: [
          ['App', function () { return h(PS.RepayCard, { amount: 2000, due: 'December 12, 2026', onCopy: noop }, h(PS.Button, { block: true }, 'Open GCash'), h(PS.PayTimer, null)); }],
          ['Transfer', function () { return h(PS.RepayCard, { amount: 2000, due: 'December 12, 2026', onCopy: noop }, h(PS.InsetRows, { rows: [{ label: 'Payment No.', value: 'PH0000351234567' }, { label: 'Sender’s name', value: 'Sam Ge' }] })); }],
          ['QR code', function () { return h(PS.RepayCard, { amount: 2000, due: 'December 12, 2026', onCopy: noop }, h(PS.QrPanel, { merchant: 'Payso', onSave: noop }), h(PS.PayTimer, null)); }],
          ['Example', function () { return h(PS.Accordion, { title: 'Repayment example (GCash)', open: true }, '1. Open the GCash app and tap "Pay Bills".\n2. Select "Loans" and find "PeraSure".'); }]] },
      { name: 'MethodPicker · Pager', desc: 'Ways to pay: categories on a rail, the methods of each on the right. Pager: the dots under cards you step through.',
        props: 'MethodPicker: cats · value · onCat · onPick — Pager: n · i',
        states: [
          ['Methods', live('qr', function (v, set) { return h(PS.MethodPicker, { cats: CATS, value: v, onCat: set, onPick: noop }); })],
          ['Pager', live(0, function (v, set) { return col([h(PS.Pager, { key: 'p', n: 3, i: v }), h(PS.Button, { key: 'b', size: 'sm', onClick: function () { set((v + 1) % 3); } }, 'Next')]); })]] },
      { name: 'Carousel', desc: 'Pages side by side, swiped left or right (or moved by index) on the Smooth spring, as tall as the tallest page so nothing jumps; the dots follow the swipe. Only the card on show plays its animation, again from the start each time (the anti-scam cards).',
        props: 'pages [nodes] · index · onIndex(i) · dots · gap (pages → dots: a gap token, default 2xl)',
        states: [['Swipe', live(0, function (v, set) { return col([h(PS.Carousel, { key: 'c', index: v, onIndex: set, dots: true, pages: [['customer-service', 'Customer service is only available in the app'], ['safe-transaction', 'Keep all payments and transactions in the app'], ['verification-code', 'Keep your verification code private']].map(function (c, k) {
          return h('div', { key: k, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', padding: '8px 16px 0' } }, h(PS.Anim, { name: c[0], size: 100, active: k === v }), h('p', { className: 'ps-text-title-xs' }, c[1]));
        }) }), h(PS.Button, { key: 'b', block: true, onClick: function () { set((v + 1) % 3); } }, 'Next')]); })]] },
      { name: 'Accordion · more', desc: 'A card that opens. Small: the quiet 14 px one with an optional 28 px brand tile before its title (the loan estimate\'s friendly reminder, DS 9224:37691).', props: 'title · open · small · icon · children',
        states: [['Default', function () { return h(PS.Accordion, { title: 'Repayment example (GCash)', open: true }, '1. Open the GCash app and tap "Pay Bills".\n2. Select "Loans" and find "PeraSure".'); }],
          ['Small · tile', function () { return h(PS.Accordion, { small: true, icon: 'heart', title: 'A friendly reminder', open: true }, 'Take a look at the estimated loan amounts and rates. If they work for you, continue to apply. We’ll review your details to work out your final offer.'); }]] },
      { name: 'PenaltyInfo · more', desc: 'How penalties work for an installment (Figma 10545:38381): the content of the big tooltip (width 288) — the rules in a 100 px column, the first in brand, the others red, a line, a note.', props: 'title · rows [[when, what]] · note',
        states: [['Card', function () { return h('div', { className: 'ps-bubble', style: { padding: 16, borderRadius: 24, width: 288 } }, h(PS.PenaltyInfo, { rows: PENALTIES })); }]] },
      { name: 'ScamTips · more', desc: '"Protect yourself from scams" in a card sheet (className ps-scams): cards swiped or moved on with Next, as tall as the tallest, the dots following; only the card on show plays, from the start each time.', props: 'cards [{ anim, title, body }] · index · onIndex · onNext · onClose',
        states: [['Sheet', function () { return h(InSheet, { className: 'ps-scams', height: 560, render: function (close) { return h(Stateful, { first: 0, render: function (i, set) {
          return h(PS.ScamTips, { cards: SCAMS, index: i, onIndex: set, onNext: function () { if (i < SCAMS.length - 1) set(i + 1); else close(); }, onClose: close }); } }); } }); }]] },
      { name: 'GuestPay', desc: 'Payment when not signed in (Figma 52:7683): a text block and a 264 px button, at the height of a loading page\'s coin.', props: 'onLogin',
        states: [['Logged out', function () { return h('div', { className: 'g-frame', style: { height: 520, '--ph': '520px' } }, h(PS.Screen, { top: { left: h(PS.Glass, { round: false }, 'Payment') } }, h(PS.GuestPay, { onLogin: noop }))); }]] },] },

    { id: 'apply', title: 'Applying and identity', items: [
      { name: 'PageHead', desc: 'A page\'s own big title with one line under it (24 / 32 and 14 / 20, 8 in from the column); centred on the welcome pages.', props: 'title · body · center',
        states: [['Default', function () { return h(PS.PageHead, { title: 'Verify your identity', body: 'Choose an ID type and upload a clear photo.' }); }],
          ['Centred', function () { return h(PS.PageHead, { center: true, title: 'Why do we ask for these?', body: 'To create your personalized loan service, we need your consent to access your data.' }); }]] },
      { name: 'PageHero', desc: 'A picture over a centred PageHead (Permissions: "Why do we ask for these?").', props: 'art · ext · size (120) · title · body',
        states: [['Permissions', function () { return h(PS.PageHero, { art: 'permission', title: 'Why do we ask for these?', body: 'To create your personalized loan service, we need your consent to access your data.' }); }]] },
      { name: 'EstimateCard', desc: 'The loan estimate (DS 9224:37691): the amount card and the numbers as one card — a line after the terms, the rows, a line, the schedule link — and a note under it.',
        props: 'AmountCard\'s props (label · amount · min · max · step · terms · term · termNote · onAmount · onTerm) + rows · link { label, onClick } · note',
        states: [['Live', live({ amount: 12500, term: 6 }, function (v, set) {
          var per = Math.round(v.amount * (1 + 0.003 * 30 * v.term) / v.term * 100) / 100;
          return h(PS.EstimateCard, { label: 'Estimated credit limit', amount: v.amount, min: 500, max: 50000, step: 100, terms: [3, 6, 8], term: v.term, termNote: '30 days / term',
            onAmount: function (a) { set({ amount: a, term: v.term }); }, onTerm: function (t) { set({ amount: v.amount, term: t }); },
            rows: [{ label: 'Daily fee', value: PS.money(v.amount * 0.003) }, { label: 'First payment date', value: 'Dec 12, 2026' }, { label: 'Per installment', value: PS.money(per) }, { label: 'Total payment', value: PS.money(per * v.term) }],
            link: { label: 'View payment schedule', onClick: noop }, note: 'These are examples only. Approval and your final loan details depend on our review.' }); })]] },
      { name: 'IdSideCard', desc: 'One side of the ID (Figma 52:6066 / 52:6134): the sample picture with a hint, or the photo taken — blurred under a green ring and a tick that springs in — with Camera / Album.',
        props: 'side front | back · title · name · hint · pic (data URL once taken) · onCamera · onAlbum',
        states: [['To add', function () { return h(PS.IdSideCard, { side: 'front', title: 'Upload front side of ID', name: 'Front side of ID', hint: 'Show the side with your photo', onCamera: noop, onAlbum: noop }); }],
          ['Added', live(PS.asset('art/id-back.png'), function (v, set) { return h(PS.IdSideCard, { side: 'back', title: 'Upload back side of ID', name: 'Back side of ID', hint: 'Show the other side', pic: v, onCamera: function () { set(null); setTimeout(function () { set(PS.asset('art/id-back.png')); }, 400); }, onAlbum: noop }); })]] },
      { name: 'IdCamera · Shutter', desc: 'The ID camera (DS 5788:13914): the whole screen, laid out for an ID held sideways — the hint down the left, the box, the side down the right, the shutter, a back button turned the same way. Here without a camera: the box says so, and the shutter still passes the step with a sample.',
        props: 'IdCamera: side · cam (PS.useCamera(\'environment\', true)) · onShoot · onClose — Shutter: onClick · label — PS.useCamera(facing, on) → { video, state, snap(fallback) } · PS.pickFile(accept, then, capture)',
        states: [['Front', function () { return phone(740, h(PS.IdCamera, { side: 'front', cam: NOCAM, onShoot: noop, onClose: noop })); }],
          ['Back', function () { return phone(740, h(PS.IdCamera, { side: 'back', cam: NOCAM, onShoot: noop, onClose: noop })); }]] },
      { name: 'Selfie', desc: 'The front camera in the circle (DS 5561:7329), the tips under it. Checking: only the circle stays, a dashed ring turns ("Uploading"); a failed check turns it red.',
        props: 'state live | checking | failed · cam (PS.useCamera(\'user\', state === \'live\')) · children (under the circle)',
        states: [['Live', function () { return h(PS.Selfie, { state: 'live', cam: NOCAM }, h(PS.SelfieTips, { onMore: noop })); }],
          ['Checking', function () { return h(PS.Selfie, { state: 'checking', cam: NOCAM }); }],
          ['Failed', function () { return h(PS.Selfie, { state: 'failed', cam: NOCAM }); }]] },
      { name: 'FaceCamera', desc: 'Confirm your identity (DS 8667:28313 / 8667:28329): black, an oval, the hint under it; after the shutter the photo with Take again / Next.',
        props: 'cam (PS.useCamera(\'user\', !shot)) · shot · title · onBack · onTake · onRetake · onNext',
        states: [['Camera', live(null, function (v, set) { return phone(740, h(PS.FaceCamera, { cam: NOCAM, shot: v, onBack: noop, onTake: function () { set(PS.asset('art/selfie-tip-1.png')); }, onRetake: function () { set(null); }, onNext: noop })); })],
          ['Photo taken', live(PS.asset('art/selfie-tip-1.png'), function (v, set) { return phone(740, h(PS.FaceCamera, { cam: NOCAM, shot: v, onBack: noop, onTake: function () { set(PS.asset('art/selfie-tip-1.png')); }, onRetake: function () { set(null); }, onNext: noop })); })]] },
      { name: 'IdResult · SheetHero · ChoiceList · PhotoTips', desc: 'What the ID check says, in a card sheet (className ps-idres). In use (DS 5908:10722): a picture, the title, ways forward as outlined buttons and a quiet "Use a different ID". Failed (DS 5908:11000): why photos fail, two by two; "Try again" is the quiet button, since repeated tries count against the application.',
        props: 'IdResult: state inuse | failed · onLogin · onRecover · onOther · onRetry · onManual · onClose — SheetHero: art | pic · title · body — ChoiceList: items [{ title, sub, onClick }] · more { label, onClick } — PhotoTips: tips · art',
        states: [['In use', function () { return h(InSheet, { className: 'ps-idres', height: 560, render: function (close) { return h(PS.IdResult, { state: 'inuse', onLogin: close, onRecover: close, onOther: close }); } }); }],
          ['Failed', function () { return h(InSheet, { className: 'ps-idres', height: 560, render: function (close) { return h(PS.IdResult, { state: 'failed', onClose: close, onRetry: close, onManual: close }); } }); }]] },
      { name: 'FileList · FileNote', desc: 'Support documents in a form (DS 9548:30951): each file on a white card, then the dashed Add files with the count (and the hint while there are none); it opens Take a photo / Choose from photos / Choose from files.',
        props: 'FileList: label · files [{ name, size, pic }] · max · hint · note · onAdd(option) · onRemove(index) — FileNote: children',
        states: [['Files', live([{ name: 'Payslip_scan_Sept_2026.jpg', size: 2516582, pic: PS.asset('art/id-front.png') }], function (v, set) {
            return frame(300, h('div', { style: { padding: 16 } }, h(PS.FileList, { label: 'Support documents (optional)', files: v, max: 3, note: 'Supports JPG, JPEG, PNG and PDF.', hint: 'Show us your job or income with payslips, bank or e-wallet statements, or a company ID.',
              onAdd: function (o) { if (v.length < 3) set(v.concat([{ name: o === 'Choose from files' ? 'COE_2026.pdf' : 'Photo_' + (v.length + 1) + '.jpg', size: 900000, pic: o === 'Choose from files' ? null : PS.asset('art/id-back.png') }])); },
              onRemove: function (i) { set(v.filter(function (x, j) { return j !== i; })); } }))); })],
          ['Empty', function () { return h(PS.FileList, { label: 'Support documents (optional)', files: [], max: 3, note: 'Supports JPG, JPEG, PNG and PDF.', hint: 'Show us your job or income with payslips, bank or e-wallet statements, or a company ID.', onAdd: noop, onRemove: noop }); }]] },
      { name: 'SearchSheet · BankList', desc: 'A full-height sheet\'s search and close over the top, on the sheet\'s own veil so what scrolls up fades under it. Grey (Figma 52:7763) for the bank list — banks by first letter, a 24 px logo before each — or white (DS 7792:15391: sheet className ps-sheet--white) for the ways to pay.',
        props: 'SearchSheet: placeholder · value · onChange · onClose · tone inset | white · bodyRef · children — BankList: groups [{ title, items: [{ id, name, logo }] }] · onPick',
        states: [['Banks', function () { return h(InSheet, { kind: 'page', height: 620, render: function (close) { return h(Stateful, { first: '', render: function (q, setQ) {
            var g = bankGroups(q);
            return h(PS.SearchSheet, { value: q, onChange: setQ, placeholder: 'Search bank name', onClose: close }, g.length ? h(PS.BankList, { groups: g, onPick: close }) : h(PS.EmptyState, { title: 'No matching banks found', body: 'Check the spelling or try another name.', style: { marginTop: '4.5rem' } })); } }); } }); }],
          ['White', function () { return h(InSheet, { kind: 'page', className: 'ps-sheet--white', height: 620, render: function (close) { return h(Stateful, { first: { q: '', c: 'qr' }, render: function (v, set) {
            return h(WhiteSheet, { v: v, set: set, close: close }); } }); } }); }]] },
      { name: 'PlacePicker', desc: 'The address sheet (DS 5975:10755 · 5975:10704 · 5975:11304): Region → Province → City, the line under the step; or search, with cities, provinces and regions in groups and the typed part in brand blue. The app gives it the Philippines\' real list (PSA PSGC); here a short sample.',
        props: 'places [[region, [[province, [cities]]]]] · onPick(city, province) · onClose · placeholder · id',
        states: [['Pick', function () { return h(InSheet, { kind: 'page', height: 620, render: function (close) { return h(PS.PlacePicker, { places: PLACES, onPick: close, onClose: close, id: 'g-places' }); } }); }]] }] },

    { id: 'help', title: 'Help articles', items: [
      { name: 'Article · Feedback · RelatedLinks', desc: 'A help article (DS 5453:4947): the answer in headings, paragraphs and dashed lists; "Was this article helpful?" full width between two lines (the answer chosen turns dark, the title thanks you); then related articles.',
        props: 'Article: blocks [{ h } | { p } | { list }] — Feedback: value · onVote · question · thanks — RelatedLinks: title · items [{ id, label, onClick }]',
        states: [['Article', function () { return h(PS.Article, { blocks: ARTICLE }); }],
          ['Feedback', live(null, function (v, set) { return h(PS.Feedback, { value: v, onVote: set }); })],
          ['Related', function () { return h(PS.RelatedLinks, { title: 'Related articles', items: [{ id: 'a', label: 'What is the application process?', onClick: noop }, { id: 'b', label: 'How much can I borrow?', onClick: noop }, { id: 'c', label: 'Can I have multiple active loans?', onClick: noop }] }); }]] }] },

    { id: 'lists', title: 'Lists', items: [
      { name: 'LinkList · Facts', desc: 'Rows that lead somewhere (with an icon, a value, or brand-coloured labels) and labelled facts.',
        props: 'LinkList: title · tone link | plain · tall (22 px rows: help) · items [{ label, icon, value, trail, onClick }] — Facts: rows',
        states: [
          ['Links', function () { return h(PS.LinkList, { title: 'Legal', tone: 'link', items: [{ label: 'Terms of Service', onClick: noop }, { label: 'Loan Agreement', onClick: noop }] }); }],
          ['Contacts', function () { return h(PS.LinkList, { items: [{ id: 'tel', icon: 'phone', label: 'Hotline', value: '(+632)82712800' }, { id: 'mail', icon: 'email', label: 'Email', value: 'customercare@perasure.ph' }] }); }],
          ['Outside', function () { return h(PS.LinkList, { items: [{ label: 'BIR Registration', trail: 'link', onClick: noop }] }); }],
          ['Facts', function () { return h(PS.Facts, { rows: [{ label: 'SEC registered number', value: '2020100002616-03' }, { label: 'Certificate of authority (CA)', value: 'No. 3410' }] }); }],
          ['Help topics', function () { return h(PS.LinkList, { tall: true, tone: 'link', title: 'Explore all topics', items: [{ label: 'Applying for a loan', onClick: noop }, { label: 'Repayments', onClick: noop }, { label: 'Your account', onClick: noop }] }); }]] },
      { name: 'Message · Bullets', desc: 'An inbox message (its kind and time over the card), and a card of short points after grey dots ("What you need to know").', props: 'Message: kind · time · title · body — Bullets: items',
        states: [['Message', function () { return h(PS.Message, { kind: 'Reminder', time: '12:59, MAY 18', title: 'You have a new coupon', body: '25% off first-payment interest on your next loan. Use it before Nov 13, 2026.' }); }],
          ['Bullets', function () { return h(PS.Section, { label: 'WHAT YOU NEED TO KNOW' }, h(PS.Bullets, { items: ['You only need to repay the principal amount.', 'We’ll cancel your loan once we get the full principal within 12 hours.', 'Cancelling often may affect your future loan applications.'] })); }]] },
      { name: 'ActivityItem · InboxItem · HistoryRow', desc: 'One line of credit history, a message, and a loan in the history with its state.',
        props: 'ActivityItem: icon · tone · title · sub · amount · up · date · note · noteValue — InboxItem: kind · time · unread · title · body · onOpen — HistoryRow: amount · state · label · onClick',
        states: [
          ['Activity', function () { return h(PS.ActivityItem, { icon: 'money-in', tone: 'positive', title: 'Repayment completed', sub: 'Available credit was restored', amount: '+ ₱5,000', up: true, date: 'Jun 24, 2026, 06:10', note: 'Available:', noteValue: '₱5,000' }); }],
          ['Message', function () { return h(PS.InboxItem, { kind: 'System notification', time: '21h ago', unread: true, title: 'Your credit limit is ready', body: 'You’ve been approved for a revolving credit limit of ₱50,000. You can choose how much to borrow based on your available credit.', onOpen: noop }); }],
          ['History', function () { return col([['review', 'Under review'], ['disbursing', 'Disbursing'], ['declined', 'Not approved'], ['action', 'Action needed'], ['paid', 'Paid off']].map(function (x) {
            return h(PS.HistoryRow, { key: x[0], amount: 2000, state: x[0], label: x[1], onClick: noop }); })); }]] },
      { name: 'HubCard · Tiles · Tips', desc: 'The credit limit hub: total with used and available, picture tiles, numbered advice.',
        props: 'HubCard: total · used · available · onWithdraw · onInfo — Tiles: title · items — Tips: title · items',
        states: [
          ['Hub', function () { return h(PS.HubCard, { total: 50000, used: 5000, available: 45000, onWithdraw: noop, onInfo: noop }); }],
          ['Tiles', function () { return h(PS.Tiles, { title: 'Credit history', items: [{ id: 'a', art: 'credit-adjustments', label: 'Credit adjustments', onClick: noop }, { id: 'b', art: 'borrowing-activity', label: 'Borrowing activity', onClick: noop }] }); }],
          ['Tiles · empty (hub, BRIEF 27)', function () { return h(PS.Tiles, { title: 'Credit history', empty: { title: 'No limit history yet', body: 'Complete your profile check and link your e-wallet to activate your revolving credit limit.' } }); }],
          ['Tips', function () { return h(PS.Tips, { title: 'How to improve your credit limit', items: [{ title: 'Repay on time', body: 'Pay on or before your due date to qualify for limit increases.' }, { title: 'Use loans responsibly', body: 'Regular borrowing and repayment can help build a better credit profile.' }] }); }]] }] },

    { id: 'fx', title: 'Motion pieces', items: [
      { name: 'OrderSubmit', desc: 'The loan request being sent: the coin spins while three lines take turns, then lands on the tick (the Order submit demo).', props: 'lines · submitMs · holdMs · onDone',
        states: [['Play', function () { return h(Replay, null, function () { return frame(340, h(PS.OrderSubmit, { onDone: noop })); }); }]] },
      { name: 'OtpSheet', desc: '"Verify it’s you" → "Enter code" in one sheet that changes height (the OTP sheet morph demo). The test code is typed for you.', props: 'open · phone · outcome ok | wrong | fail · auto · onClose · onVerified · onChange',
        states: [['Open it', live(false, function (v, set) { return frame(460, [h('div', { key: 'b', style: { padding: 24 } }, h(PS.Button, { block: true, onClick: function () { set(true); } }, 'Confirm')),
          h(PS.OtpSheet, { key: 's', open: v, phone: '091****6789', outcome: 'ok', onClose: function () { set(false); }, onVerified: function () { set(false); }, onChange: noop })]); })]] },
      { name: 'CreditLimitIntro', desc: 'The Credit limit increase over a page (the shipped coins page in a frame, as in the Withdraw demo): it plays, holds 3 s (a tap skips the wait) and leaves. In the app it closes into home\'s credit card (exit); on its own it fades out.',
        props: 'data { old, new, inc, exp } · mode available | total · exit(o) · onDone · holdMs',
        states: [['Play', live(false, function (v, set) { return frame(640, [h('div', { key: 'b', className: 'g-center' }, h(PS.Button, { size: 'sm', onClick: function () { set(true); } }, 'Play')),
          v ? h(PS.CreditLimitIntro, { key: 'i', data: { old: 40000, new: 50000, inc: 10000, exp: 'Nov 20' }, holdMs: 1500, onDone: function () { set(false); } }) : null]); })]] }] }
  ];
})();
