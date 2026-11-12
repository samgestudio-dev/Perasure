/* PeraSure components — the gallery entries for the components added with the full app (feedback.js, form.js, status.js,
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
          ['Busy', function () { return h(PS.Button, { block: true, disabled: true }, h(PS.Busy)); }]] },
      { name: 'Cover', desc: 'A page that is still loading, or that failed: the layer covers the whole screen (content and bottom bar); the header’s buttons stay. Used anywhere inside a Screen.',
        props: 'open · tone page | white (the fallback page) · children',
        states: [
          ['Loading', function () { return frame(420, h(PS.Screen, { top: { left: h(PS.Back, { onClick: noop }), title: 'Loan history' }, bottom: h(PS.BottomBar, null, h(PS.Button, { block: true }, 'Continue')) },
            h(PS.Cover, { open: true }, h(PS.Loader, { fill: true })))); }],
          ['Failed', function () { return frame(420, h(PS.Screen, { top: { left: h(PS.Back, { onClick: noop }), title: 'Loan history' } },
            h(PS.Cover, { open: true, tone: 'white' }, h(PS.EmptyState, { title: 'Something went wrong' }, h(PS.Button, { onClick: noop }, 'Try again'))))); }]] },
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
      { name: 'Tooltip', desc: 'Places itself: 8 px under what was tapped, centred, or with its edge 16 px past it near a side; always inside the 16 px margins; above when there is no room below.',
        props: 'open · text · anchor (PS.frameRect(el)) · width · onClose',
        states: [['Try it', live(null, function (tip, set) {
          return frame(260, [h('div', { key: 'r', style: { display: 'flex', justifyContent: 'space-between', padding: 24 } }, ['left', 'middle', 'right'].map(function (k) {
            return h(PS.Glass, { key: k, icon: 'help-circle', label: 'Help', onClick: function (e) { set({ anchor: PS.frameRect(e.currentTarget), text: 'Your available amount is what you can borrow today.' }); } }); })),
            h(PS.Tooltip, { key: 't', open: !!tip, anchor: tip && tip.anchor, text: tip ? tip.text : '', onClose: function () { set(null); } })]); })]] },
      { name: 'Toasts', desc: 'Messages at the top, like iPhone notifications: every tap shows a new one at once, covering the one before (it slips down, shrinks and fades; three deep). Swipe one left to close it.',
        props: 'items [{ id, text }] · onClose(id) · top',
        states: [['Try it', live({ n: 0, items: [] }, function (v, set) {
          var texts = ['Code sent to +63 •••• 4567.', 'We’ve copied the reference number.', 'Your loan is now ₱6,000 · 6 terms.'];
          function close(id) { set(function (o) { return { n: o.n, items: o.items.filter(function (t) { return t.id !== id; }) }; }); }
          return frame(200, [h(PS.Toasts, { key: 't', items: v.items, onClose: close, top: 16 }),
            h('div', { key: 'b', style: { position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' } },
              h(PS.Button, { size: 'sm', onClick: function () { var id = v.n + 1; set({ n: id, items: v.items.concat([{ id: id, text: texts[id % 3] }]).slice(-4) }); setTimeout(function () { close(id); }, 2600); } }, 'Show a toast'))]); })]] }] },

    { id: 'forms', title: 'Forms', items: [
      { name: 'Field · PhoneField', desc: 'The 56 px typing box with its label inside. A field that opens a picker shows a chevron.',
        props: 'label · value · onChange · placeholder · error · hint · clear · onClick (picker) · inputMode — PhoneField: value · onChange · error',
        states: [
          ['Typing', live('', function (v, set) { return h(PS.Field, { label: 'Account number', value: v, onChange: set, placeholder: 'Enter your account number', clear: true }); })],
          ['Error', function () { return h(PS.Field, { label: 'Mobile number', value: '0917', onChange: noop, error: 'Enter the mobile number linked to this e-wallet (10–11 digits).' }); }],
          ['Picker', function () { return h(PS.Field, { label: 'Bank name', value: '', placeholder: 'Choose your bank', onClick: noop }); }],
          ['Phone', live('', function (v, set) { return h(PS.PhoneField, { value: v, onChange: set }); })]] },
      { name: 'OtpBoxes · ContactMethods', desc: 'Six code boxes over one input: grey when empty, light blue when filled, the brand ring on the one being typed, red when wrong. Under them, how the code is sent.',
        props: 'OtpBoxes: value · onChange · error · disabled · autoFocus — ContactMethods: items · value · onChange',
        states: [
          ['Empty', live('', function (v, set) { return h(PS.OtpBoxes, { value: v, onChange: set }); })],
          ['Filled', function () { return h(PS.OtpBoxes, { value: '122', onChange: noop }); }],
          ['Wrong', function () { return h(PS.OtpBoxes, { value: '122435', onChange: noop, error: true }); }],
          ['Methods', live('sms', function (v, set) { return h(PS.ContactMethods, { value: v, onChange: set, items: [{ id: 'sms', icon: 'message', label: 'SMS' }, { id: 'phone', icon: 'phone', label: 'Phone' }, { id: 'viber', icon: 'viber', label: 'Viber' }, { id: 'whatsapp', icon: 'whatsapp', label: 'WhatsApp' }] }); })]] },
      { name: 'Keypad · Segmented · SelectBar', desc: 'The amount keypad, the two-way switch (its pill glides) and an option with a radio.',
        props: 'Keypad: onKey · extra · cascade — Segmented: items · value · onChange — SelectBar: on · label · logo · note · onClick',
        states: [
          ['Keypad', function () { return h(PS.Keypad, { onKey: noop }); }],
          ['Segmented', live('wallet', function (v, set) { return h(PS.Segmented, { id: 'g-seg', value: v, onChange: set, items: [{ id: 'wallet', label: 'E-Wallet' }, { id: 'bank', label: 'Online bank' }] }); })],
          ['Options', live('gcash', function (v, set) { return col([['maya', 'Maya'], ['gcash', 'GCash']].map(function (w) {
            return h(PS.SelectBar, { key: w[0], on: v === w[0], label: w[1], logo: 'pay-' + w[0], note: 'Supports ₱50k+ loans', onClick: function () { set(w[0]); } }); })); })]] },
      { name: 'FormField · Popover', desc: 'The application forms\' field (label above, white 44 px box) and its popover list (DS 7201:12032): glass card, 36 px pills, at most 220 high with a thumb and a fade, 8 px under the box, above it when there is no room.',
        props: 'FormField: label · value · placeholder · onChange | onClick | menu { options, onPick } · icon · clear · error · suggest + onSuggest — Popover: open · options · value · onPick · onClose · anchor · block',
        states: [
          ['Typing', live('', function (v, set) { return h(PS.FormField, { label: 'Email', value: v, placeholder: 'Enter your email', clear: true, onChange: set, suggest: v && v.indexOf('@') < 0 ? [v + '@gmail.com', v + '@yahoo.com'] : [], onSuggest: set }); })],
          ['Error', function () { return h(PS.FormField, { label: 'Total monthly income (PHP)', value: '35k', onChange: noop, clear: true, error: 'Please enter numbers only' }); }],
          ['Menu', live('', function (v, set) { return frame(300, h(PS.FormField, { label: 'Job type', value: v, placeholder: 'Select your job type', menu: { options: ['BPO Worker', 'Freelance', 'Staff/Factory Worker', 'Government/Public Utility', 'Self-employed', 'House Wife', 'Unemployed/Retired'], onPick: set } })); })]] },
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
            { id: 'c', name: 'Payslip_scan_Sept_2026.jpeg', size: 2516582, state: 'compressing', onRemove: noop }, { id: 'd', name: 'SSS_Contributions_2026_012345.png', size: 900000, state: 'failed', onRetry: noop }] }); })]] },
      { name: 'SelfieTips · LineTabs', desc: 'The selfie instructions (DS 5585:5407): three pictures with a tick or a cross, and More (three brand dots) for the full tip. Underlined tabs (the address sheet\'s Region / Province / City): the line glides to the step; a step not reached yet is grey.',
        props: 'SelfieTips: items [{ art, label, ok }] · title · onMore(element) — LineTabs: items [{ id, label, off }] · value · onChange · id',
        states: [['Selfie tips', function () { return h(PS.SelfieTips, { onMore: noop }); }],
          ['Tabs', live('province', function (v, set) { return h(PS.LineTabs, { id: 'g-lt', value: v, onChange: set, items: [{ id: 'region', label: 'Region' }, { id: 'province', label: 'Province' }, { id: 'city', label: 'City', off: v === 'region' }] }); })]] },
      { name: 'Search · Consent', desc: 'The search pill of full-height sheets and the small agreement line.',
        props: 'Search: value · onChange · placeholder — Consent: on · onToggle · children',
        states: [
          ['Search', live('', function (v, set) { return h(PS.Search, { value: v, onChange: set, placeholder: 'Search bank name' }); })],
          ['Consent', live(true, function (v, set) { return h(PS.Consent, { on: v, onToggle: function () { set(!v); } }, 'By continuing, you agree to our ', h('b', null, 'Terms of Service'), '.'); })]] }] },

    { id: 'status', title: 'Home states', items: [
      { name: 'StateCard', desc: 'The brand card of an application state, in place of the credit card.', props: 'title · body · icon · timer { label, value } · support { text, onClick } · button { label, icon, tone, onClick }',
        states: [
          ['In progress', function () { return h(PS.StateCard, { icon: 'history', title: 'Application in progress', body: 'We’ve got your application and we’re reviewing it now.' }); }],
          ['Add documents', function () { return h(PS.StateCard, { title: 'Help us review your application', body: 'Add documents that show your job or income.', timer: { label: 'Time remaining', value: '47h 57m 10s' }, button: { label: 'Add documents', tone: 'white', onClick: noop } }); }],
          ['Not approved', function () { return h(PS.StateCard, { title: 'Application wasn’t approved', body: 'We can’t offer you a credit limit right now. You can apply again after 30 days.', support: { text: 'Have a question about the result? Chat with support!', onClick: noop } }); }],
          ['Expired', function () { return h(PS.StateCard, { title: 'Your application expired', body: 'Apply again to see your credit limit.', button: { label: 'Reapply now', icon: 'money-out', onClick: noop } }); }]] },
      { name: 'Strip', desc: 'A white one-line card that leads somewhere: loan updates, or a question to support.', props: 'icon · tone · title · sub · text · count · chevron · onClick',
        states: [
          ['Loan update', function () { return h(PS.Strip, { icon: 'info', title: 'You have updates on your loan', sub: 'Tap to view the latest status', count: 1, onClick: noop }); }],
          ['Chat', function () { return h(PS.Strip, { icon: 'support-chat', text: 'Have a question about your application? Chat with support!', chevron: true, onClick: noop }); }]] },
      { name: 'Hero · Reviews · OfferCard · PermissionCard', desc: 'The first home page before there is a limit, what customers say, another product when ours isn’t available, and one permission with its reason.',
        props: 'Hero: label · amount · tagline · stats · action — Reviews: items — OfferCard: logo · tag · label · value · rows — PermissionCard: icon · title · body',
        states: [
          ['Hero', function () { return h(PS.Hero, { label: 'You may qualify for up to', amount: 50000, tagline: 'Simple, Fast, Made for You.', stats: [{ value: '<0.3%', label: 'Daily rate' }, { value: '91-180d', label: 'Terms' }, { value: '3 mins', label: 'Approval' }], action: 'Check your limit', onClick: noop }); }],
          ['Reviews', function () { return h(PS.Reviews, { items: [{ title: 'Borrow Again Anytime', text: '"Super convenient revolving limit! Paid my dues and was able to borrow again in just a few minutes."', name: 'John S.' }, { title: '100% Legit, Low Interest', text: '"Legit and highly recommended, low interest and no hidden fees."', name: 'Maria C.' }] }); }],
          ['Offer', function () { return h(PS.OfferCard, { logo: 'loadcash', name: 'LoadCash', tag: 'Best match', label: 'Max amount', value: '₱50,000', rows: [{ label: 'Max term', value: '180 days' }], onClick: noop }); }],
          ['Permission', function () { return h(PS.PermissionCard, { icon: 'camera', title: 'Camera', body: 'Used for facial verification, ID verification, and uploading ID photos.' }); }]] }] },

    { id: 'pay', title: 'Repayments', items: [
      { name: 'Installment · PayBar · ScamStrip', desc: 'One repayment with its tick, the total above the tab bar, and the scam warning whose text runs sideways.',
        props: 'Installment: month · day · amount · sub · tone · on · onToggle · note · noteIcon · onDetail — PayBar: total · was · onPay · disabled — ScamStrip: children · onClick',
        states: [
          ['Overdue', live(true, function (v, set) { return h(PS.Installment, { month: 'JAN', day: '15', amount: 2050, tone: 'negative', sub: 'Overdue 18 days', note: 'Includes ₱50.00 penalty', noteIcon: 'info', on: v, onToggle: function () { set(!v); }, onDetail: noop }); })],
          ['Upcoming', live(false, function (v, set) { return h(PS.Installment, { month: 'JUL', day: '20', amount: 1234.5, tone: 'brand', sub: 'Due in 45 days', note: 'No penalty for 3 days after the due date', noteIcon: 'order', on: v, onToggle: function () { set(!v); }, onDetail: noop }); })],
          ['Total', function () { return h(PS.PayBar, { total: 2050, onPay: noop }); }],
          ['Scam strip', function () { return h(PS.ScamStrip, { onClick: noop }, 'Beware of scams. Contact in-app customer service to verify transaction requests from outside the app.'); }]] },
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
          ['Pager', live(0, function (v, set) { return col([h(PS.Pager, { key: 'p', n: 3, i: v }), h(PS.Button, { key: 'b', size: 'sm', onClick: function () { set((v + 1) % 3); } }, 'Next')]); })]] }] },

    { id: 'lists', title: 'Lists', items: [
      { name: 'LinkList · Facts', desc: 'Rows that lead somewhere (with an icon, a value, or brand-coloured labels) and labelled facts.',
        props: 'LinkList: title · tone link | plain · items [{ label, icon, value, trail, onClick }] — Facts: rows',
        states: [
          ['Links', function () { return h(PS.LinkList, { title: 'Legal', tone: 'link', items: [{ label: 'Terms of Service', onClick: noop }, { label: 'Loan Agreement', onClick: noop }] }); }],
          ['Contacts', function () { return h(PS.LinkList, { items: [{ id: 'tel', icon: 'phone', label: 'Hotline', value: '(+632)82712800' }, { id: 'mail', icon: 'email', label: 'Email', value: 'customercare@perasure.ph' }] }); }],
          ['Outside', function () { return h(PS.LinkList, { items: [{ label: 'BIR Registration', trail: 'link', onClick: noop }] }); }],
          ['Facts', function () { return h(PS.Facts, { rows: [{ label: 'SEC registered number', value: '2020100002616-03' }, { label: 'Certificate of authority (CA)', value: 'No. 3410' }] }); }]] },
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
          ['Tips', function () { return h(PS.Tips, { title: 'How to improve your credit limit', items: [{ title: 'Repay on time', body: 'Pay on or before your due date to qualify for limit increases.' }, { title: 'Use loans responsibly', body: 'Regular borrowing and repayment can help build a better credit profile.' }] }); }]] }] },

    { id: 'fx', title: 'Motion pieces', items: [
      { name: 'OrderSubmit', desc: 'The loan request being sent: the coin spins while three lines take turns, then lands on the tick (the Order submit demo).', props: 'lines · submitMs · holdMs · onDone',
        states: [['Play', function () { return h(Replay, null, function () { return frame(340, h(PS.OrderSubmit, { onDone: noop })); }); }]] },
      { name: 'OtpSheet', desc: '"Verify it’s you" → "Enter code" in one sheet that changes height (the OTP sheet morph demo). The test code is typed for you.', props: 'open · phone · outcome ok | wrong | fail · auto · onClose · onVerified · onChange',
        states: [['Open it', live(false, function (v, set) { return frame(460, [h('div', { key: 'b', style: { padding: 24 } }, h(PS.Button, { block: true, onClick: function () { set(true); } }, 'Confirm')),
          h(PS.OtpSheet, { key: 's', open: v, phone: '091****6789', outcome: 'ok', onClose: function () { set(false); }, onVerified: function () { set(false); }, onChange: noop })]); })]] }] }
  ];
})();
