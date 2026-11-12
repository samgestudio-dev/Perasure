/* PeraSure components — live gallery of every shared component (shared/ps-ui) and its states.
   Each entry: name · what it is for · props · states (chips switch between them) · the live component. */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, PS = window.PS, h = R.createElement, m = PS.m;
  var NOW = Date.now();
  function noop() {}
  function frame(height, kids) { return h('div', { className: 'g-frame', style: { height: height } }, kids); }

  var ticket = { value: '25% OFF', label: 'First-payment interest', rule: 'Any amount · 3 / 6 / 8 terms', meta: 'Valid until Nov 30, 2026' };
  function T(extra) { return h(PS.CouponTicket, Object.assign({}, ticket, extra)); }

  var GROUPS = [
    { id: 'basics', title: 'Basics', items: [
      { name: 'Amount', desc: 'Money in the number font: Satoshi digits, ₱ from Inter, as in the app.', props: 'value · dec (2 | 0) · curFont num | body · strike · className',
        states: [
          ['Card', function () { return h(PS.Amount, { value: 800, style: { fontSize: 24, color: 'var(--color-text-brand-default)' } }); }],
          ['Loan', function () { return h('div', { className: 'ps-amountcard__amt' }, h(PS.Amount, { value: 45000, curFont: 'body', style: { fontSize: 32, lineHeight: '40px' } })); }],
          ['Struck', function () { return h(PS.Amount, { value: 46500, strike: true }); }]] },
      { name: 'Button', desc: 'Every pressable label. Press: spring scale.', props: 'variant primary | text | inverse | shade | outline · size lg | sm · block · icon · disabled · onClick',
        states: [
          ['Primary', function () { return h(PS.Button, { block: true }, 'Confirm'); }],
          ['Small', function () { return h(PS.Button, { size: 'sm' }, 'Pay ₱800 now'); }],
          ['Text', function () { return h(PS.Button, { variant: 'text', block: true }, 'Don’t use coupon'); }],
          ['Inverse', function () { return h(PS.Button, { variant: 'inverse', block: true }, 'Log out'); }],
          ['Outline', function () { return h(PS.Button, { variant: 'outline' }, 'Use'); }],
          ['Shade', function () { return h('div', { className: 'ps-credit', style: { padding: 12 } }, h(PS.Button, { variant: 'shade' }, 'Withdraw')); }],
          ['Disabled', function () { return h(PS.Button, { block: true, disabled: true }, 'Confirm'); }]] },
      { name: 'Glass · Back · Close', desc: 'The frosted buttons of headers and sheets.', props: 'Glass: icon · iconSize · label · children · onClick — Back / Close: onClick',
        states: [['All', function () { return h('div', { className: 'g-row' }, h(PS.Back, { onClick: noop }), h(PS.Close, { onClick: noop }), h(PS.HomeActions, { actions: [{ icon: 'bell', label: 'Inbox' }, { icon: 'headset', label: 'Contact us' }] }), h(PS.Brand)); }]] },
      { name: 'Tag · Count · Chip', desc: 'Small labels.', props: 'Tag tone outline | soft | best | solid — Count n · on — Chip tone positive | brand · icon',
        states: [['All', function () {
          return h('div', { className: 'g-row', style: { flexWrap: 'wrap' } }, h(PS.Tag, { tone: 'outline' }, 'Protected'), h(PS.Tag, { tone: 'soft' }, 'Due in 45 days'),
            h(PS.Tag, { tone: 'best' }, 'Best'), h(PS.Tag, { tone: 'solid' }, '6 coupons'), h(PS.Count, { n: 6 }), h('span', { style: { background: 'var(--color-surface-card-brand)', borderRadius: 99, padding: 4, display: 'inline-flex' } }, h(PS.Count, { n: 2, on: true })),
            h(PS.Chip, { tone: 'positive' }, 'Saved ₱500'), h(PS.Chip, { tone: 'brand' }, 'New limit ₱50,000'));
        }]] },
      { name: 'Check · Agreement', desc: 'The round selection mark, and the tick line above a primary button.', props: 'Check on · off · box — Agreement on · onToggle · children (links in <b>)',
        states: [['Marks', function () { return h('div', { className: 'g-row' }, h(PS.Check, {}), h(PS.Check, { on: true }), h(PS.Check, { off: true }), h(PS.Check, { box: true })); }],
          ['Agreement', function () { return h(Toggle, { render: function (on, set) { return h(PS.Agreement, { on: on, onToggle: function () { set(!on); } }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), ' and ', h('b', null, 'Loan Disclosure Statement'), '.'); } }); }]] },
      { name: 'Icon', desc: 'One-colour icons from assets/icons, drawn as masks so the colour is a token.', props: 'name · size · color primary | secondary | tertiary | brand | positive | inverse | countdown',
        states: [['Set', function () {
          return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 14 } }, ['chevron-left', 'chevron-right', 'close', 'check-sm', 'arrow-up', 'edit', 'coupon', 'clock', 'alert-circle', 'bell', 'inbox', 'headset', 'history', 'info', 'chat', 'user', 'help', 'wallet', 'calendar', 'nav-home', 'nav-payment', 'nav-account']
            .map(function (n) { return h('span', { key: n, title: n }, h(PS.Icon, { name: n, size: 20, color: n === 'clock' ? 'countdown' : n === 'coupon' ? 'positive' : 'primary' })); }));
        }]] }
    ] },
    { id: 'layout', title: 'Layout', items: [
      { name: 'TopBar', desc: 'Header: back or brand on the left, title, actions on the right; progressive blur while content is under it.', props: 'left · title · right · extra + extraHeight · solid · live',
        states: [['Secondary page', function () { return frame(116, h(PS.TopBar, { left: h(PS.Back, {}), title: 'Apply a loan', live: true })); }],
          ['Brand', function () { return frame(116, h(PS.TopBar, { left: h(PS.Brand), right: h(PS.HomeActions, { actions: [{ icon: 'bell' }, { icon: 'headset' }] }) })); }],
          ['With tabs', function () { return frame(174, h(PS.TopBar, { left: h(PS.Back, {}), title: 'Coupons', solid: true, extraHeight: 58,
            extra: h('div', { style: { padding: '2px 16px 16px' } }, h(Tabs3, {})) })); }]] },
      { name: 'BottomBar · Navigator', desc: 'The bottom action area and the tab bar (the pill glides between tabs).', props: 'BottomBar children · secondary — Navigator tabs [{ id, label, icon }] · value · onChange · id',
        states: [['Navigator', function () { return frame(110, h(Toggle, { init: 'home', render: function (v, set) { return h(PS.Navigator, { id: 'g-nav', value: v, onChange: set, tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] }); } })); }],
          ['Bottom bar', function () { return frame(110, h(PS.BottomBar, null, h(PS.Button, { block: true }, 'Confirm'))); }]] },
      { name: 'Sheet', desc: 'Three kinds: page (fills below the header), card (floating decision), plain (bottom). Drag the top edge down or tap outside to close.', props: 'open · kind page | card | plain · onClose · label · scrim',
        states: [['Plain', function () { return h(SheetDemo, { kind: 'plain' }); }], ['Card', function () { return h(SheetDemo, { kind: 'card' }); }], ['Page', function () { return h(SheetDemo, { kind: 'page' }); }]] },
      { name: 'Tooltip · Toast', desc: 'A frosted bubble next to what was tapped; a short message above the bottom bar.', props: 'Tooltip open · at { x, y } · text · onClose — Toast msg · bottom; PS.useToast() → [msg, show]',
        states: [['Tooltip', function () { return frame(120, h(PS.Tooltip, { open: true, at: { x: 56, y: 24 }, text: 'Borrow ₱10,000 or more · 3 / 6 terms · One per account', onClose: noop })); }],
          ['Toast', function () { return frame(90, h(PS.Toast, { msg: 'Your loan is now ₱6,000 · 6 terms.', bottom: 20 })); }]] }
    ] },
    { id: 'home', title: 'Home', items: [
      { name: 'CreditCard', desc: 'Available amount, total and temporary credit, Withdraw.', props: 'available · total · temporary · temporaryUntil · onWithdraw · onInfo · label · action',
        states: [['Temporary credit', function () { return h(PS.CreditCard, { available: 40000, total: 50000, temporary: 10000, temporaryUntil: 'Nov 20' }); }],
          ['No temporary', function () { return h(PS.CreditCard, { available: 15000, total: 50000 }); }]] },
      { name: 'PaymentCard', desc: 'The next repayment.', props: 'amount · was · due · badge · onPay · payLabel · title',
        states: [['Default', function () { return h(PS.PaymentCard, { amount: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' }); }],
          ['Discounted', function () { return h(PS.PaymentCard, { amount: 700, was: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' }); }]] },
      { name: 'HomeCoupons', desc: 'Coupons for your next loan: two or more → two cards; one → the wide card with the folder tab; none → nothing.', props: 'coupons [{ type, value, until, kind, label, cond }] · onOpen · title · layout auto | pair | one',
        states: [['Two', function () { return h('div', { style: { paddingTop: 8 } }, h(PS.HomeCoupons, { coupons: [{ type: 'percent', value: '50% OFF', until: 'Until Nov 11, 2026' }, { type: 'limit', value: '+₱5,000', until: 'Until Nov 11, 2026' }] })); }],
          ['Amount off', function () { return h('div', { style: { paddingTop: 8 } }, h(PS.HomeCoupons, { coupons: [{ type: 'amount', value: '₱300 OFF', until: 'Until Dec 15, 2026' }, { type: 'percent', value: '20% OFF', until: 'Until Nov 30, 2026' }] })); }],
          ['One', function () { return h('div', { style: { paddingTop: 40 } }, h(PS.HomeCoupons, { coupons: [{ type: 'limit', value: '+₱5,000', kind: 'Credit limit', label: 'Borrow more than ₱20,000', cond: 'Any term' }] })); }]] },
      { name: 'TrustCard · Legal', desc: '“Made for Filipinos”, the NPC and SEC tiles, partner logos (scrolling), and the company lines.', props: 'TrustCard kicker · title — Legal lines',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.TrustCard), h(PS.Legal)); }]] }
    ] },
    { id: 'coupons', title: 'Coupons', items: [
      { name: 'CouponTicket', desc: 'The coupon in the coupon centre (Use) and in the picker (pick). Fields not given are left out.', props: 'value · label · rule · ruleLong + onRule · meta · expiresAt · best · state default | selected | used | expired | unavailable · reason · action use | pick | none · onUse · onPick',
        states: [['To use', function () { return T({ action: 'use', best: true, expiresAt: NOW + 86399000 }); }],
          ['Long rule', function () { return T({ action: 'use', value: '₱300 OFF', rule: 'Borrow ₱10,000 or more · 3 / 6 terms · One per account, on your first loan of the month', ruleLong: true }); }],
          ['Picker', function () { return h(Toggle, { render: function (on, set) { return T({ action: 'pick', state: on ? 'selected' : 'default', onPick: function () { set(!on); } }); } }); }],
          ['Unavailable', function () { return T({ action: 'pick', state: 'unavailable', value: '20% OFF', label: 'Interest on all payments', rule: 'Borrow ₱6,000 or more · 6 / 8 terms', reason: 'Works with 6 or 8 terms' }); }],
          ['Used', function () { return T({ state: 'used', meta: 'Used on Oct 24, 2026' }); }],
          ['Expired', function () { return T({ state: 'expired', value: '+₱3,000', label: 'Credit limit increase', meta: 'Expired on Oct 15, 2026' }); }]] },
      { name: 'Tabs', desc: 'Segmented control; the pill glides to the picked tab. Count badges are optional.', props: 'items [{ id, label, count }] · value · onChange · glass · id',
        states: [['Coupon centre', function () { return h(Tabs3, {}); }], ['Picker (glass)', function () { return h(Toggle, { init: 'd', render: function (v, set) { return h('div', { style: { background: 'var(--color-surface-inset-default)', padding: 12, borderRadius: 24 } }, h(PS.Tabs, { id: 'g-t2', glass: true, value: v, onChange: set, items: [{ id: 'd', label: 'Discount', count: 2 }, { id: 'l', label: 'Limit increase', count: 1 }] })); } }); }]] },
      { name: 'EmptyState', desc: 'Picture, title and one line.', props: 'art · title · body',
        states: [['Default', function () { return h(PS.EmptyState, { title: 'No coupons yet', body: 'When you get a coupon, you’ll see it here.' }); }]] },
      { name: 'CouponRow · CouponsSection', desc: 'Coupon lines on the loan page; green sub-line when the coupon is on.', props: 'CouponRow type · title · sub · on · onClick — CouponsSection count · onSeeAll · rows',
        states: [['Both on', function () { return h(PS.CouponsSection, { count: 6, rows: [{ type: 'percent', title: '50% off first-payment interest', sub: 'You save ₱5,000', on: true }, { type: 'limit', title: '+₱5,000 credit limit', sub: 'Your limit is ₱50,000 for this loan', on: true }] }); }],
          ['Not used', function () { return h(PS.CouponsSection, { count: 6, rows: [{ type: 'percent', title: '20% off interest on all payments', sub: 'Borrow ₱6,000 or more · 6 / 8 terms' }, { type: 'limit', title: '+₱5,000 credit limit', sub: 'Borrow ₱6,000 or more · 3 / 6 / 8 terms' }] }); }]] },
      { name: 'Summary', desc: 'Total payment with what the coupons do. A coupon that isn’t used hides its field.', props: 'total · was · saved · newLimit · onConfirm · label · title',
        states: [['Both', function () { return h(PS.Summary, { total: 46000, was: 46500, saved: 500, newLimit: 50000 }); }],
          ['Discount only', function () { return h(PS.Summary, { total: 46000, was: 46500, saved: 500 }); }],
          ['No coupon', function () { return h(PS.Summary, { total: 46500 }); }]] },
      { name: 'Decision', desc: '“Keep your coupon?” after a change takes a coupon off (inside a card sheet).', props: 'art · title · body · facts [{ label, value, tone }] · primary · secondary · onClose',
        states: [['Discount', function () { return h('div', { className: 'ps-card', style: { borderRadius: 32 } }, h(PS.Decision, { art: 'percent', title: 'Keep your 50% off?', body: 'Your new amount is ₱5,000. This coupon needs a loan of ₱6,000 or more, so we’ve taken it off.', facts: [{ label: 'Your loan', value: '₱5,000 · 6 terms' }, { label: 'You’d save', value: '₱5,000', tone: 'positive' }], primary: { label: 'Keep coupon' }, secondary: { label: 'Don’t use coupon' } })); }],
          ['Limit', function () { return h('div', { className: 'ps-card', style: { borderRadius: 32 } }, h(PS.Decision, { art: 'limit', title: 'Keep your ₱5,000 limit increase?', body: 'Your new amount is ₱5,000. This coupon needs a loan of ₱6,000 or more, so we’ve taken it off.', facts: [{ label: 'Your loan', value: '₱5,000 · 6 terms' }, { label: 'Your credit limit with it', value: '₱50,000', tone: 'positive' }], primary: { label: 'Keep coupon' }, secondary: { label: 'Don’t use coupon' } })); }]] }
    ] },
    { id: 'loan', title: 'Loan', items: [
      { name: 'AmountCard', desc: 'Disbursement amount with the slider, and the loan term. A limit coupon turns the maximum green.', props: 'amount · min · max · step · boost · onAmount · onCommit · terms · term · termNote · onTerm',
        states: [['Default', function () { return h(LoanDemo, { boost: false }); }], ['Limit coupon', function () { return h(LoanDemo, { boost: true }); }]] },
      { name: 'OrderDetails', desc: 'Order detail rows; a row with no value is hidden.', props: 'rows [{ label, value, tone }] · link · onLink',
        states: [['With discount', function () { return h(PS.OrderDetails, { link: 'View payment schedule', rows: [{ label: 'Daily fee', value: '₱60.00' }, { label: 'First payment date', value: 'Nov 27, 2026' }, { label: 'Per installment', value: '₱8,400.00' }, { label: 'Discount', value: '-₱810.00', tone: 'positive' }, { label: 'Total payment', value: '₱49,590.00' }] }); }],
          ['No discount', function () { return h(PS.OrderDetails, { link: 'View payment schedule', rows: [{ label: 'Daily fee', value: '₱60.00' }, { label: 'Discount', value: null }, { label: 'Total payment', value: '₱50,400.00' }] }); }]] },
      { name: 'ProtectionCard · MethodCard', desc: 'Borrower protection and the withdrawal account.', props: 'ProtectionCard title · tag · body · link — MethodCard name · last4 · logo · onClick',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.ProtectionCard, { body: 'Get covered for up to ₱30,000, so your family isn’t left with the loan if a medical emergency or accident happens.' }), h(PS.MethodCard, { name: 'Bank of the Philippine Islands', last4: '4567' })); }]] },
      { name: 'RepaymentPlan', desc: 'The payment schedule (inside a plain sheet); a discounted value shows the original struck through.', props: 'items [{ title, date, total, rows [{ label, value, was }] }]',
        states: [['Default', function () { return h(PS.RepaymentPlan, { items: [1, 2, 3].map(function (k) { return { title: 'Payment ' + k, date: ['Nov 27', 'Dec 12', 'Dec 27'][k - 1] + ', 2026', total: k === 1 ? 8231.25 : 8400, rows: [{ label: 'Principal', value: 7500 }, { label: 'Interest', value: k === 1 ? 506.25 : 675, was: 675 }, { label: 'Service fee', value: 225 }] }; }) }); }]] }
    ] },
    { id: 'account', title: 'Account', items: [
      { name: 'Profile · CreditLimitCard', desc: 'Who is signed in and their credit.', props: 'Profile initials · name · verified — CreditLimitCard total · available · onClick',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 24 } }, h(PS.Profile, { initials: 'SG', name: 'Sam Ge', verified: true }), h(PS.CreditLimitCard, { total: 50000, available: 15000 })); }]] },
      { name: 'Menu · Social', desc: 'Menu rows with an optional badge, and the social links.', props: 'Menu items [{ id, icon, label, badge, onClick }] — Social title · items',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.Menu, { items: [{ icon: 'inbox', label: 'Inbox', badge: 'New' }, { icon: 'coupon', label: 'Coupons', badge: '6 coupons' }, { icon: 'history', label: 'Loan history' }] }), h(PS.Social, {})); }]] }
    ] }
  ].concat(window.PS_GALLERY || []);   /* the app's components: gallery-app.js */

  function Toggle(p) { var s = R.useState(p.init != null ? p.init : true); return p.render(s[0], s[1]); }
  var seq = 0;
  function Tabs3() { var id = R.useRef('g-t3-' + (++seq)).current; return h(Toggle, { init: 'use', render: function (v, set) { return h(PS.Tabs, { id: id, value: v, onChange: set, items: [{ id: 'use', label: 'To use', count: 6 }, { id: 'used', label: 'Used' }, { id: 'expired', label: 'Expired' }] }); } }); }
  function LoanDemo(p) {
    var s = R.useState(45000), t = R.useState(6), max = p.boost ? 50000 : 45000;
    return h(PS.AmountCard, { amount: Math.min(s[0], max), min: 500, max: max, step: 500, boost: p.boost, onAmount: s[1], terms: [3, 6, 8], term: t[0], onTerm: t[1] });
  }
  function SheetDemo(p) {
    var s = R.useState(true), open = s[0], set = s[1];
    var close = function () { set(false); };
    var body = p.kind === 'plain' ? h(R.Fragment, null, h(PS.SheetTitle, { onClose: close }, 'Repayment plan'), h('p', { className: 'ps-t-body-md ps-c-tertiary', style: { padding: '0 12px' } }, 'Sheet content.'), h(PS.Button, { block: true, onClick: close }, 'Continue'))
      : p.kind === 'card' ? h(PS.Decision, { art: 'amount', title: 'Keep your ₱300 off?', body: 'This coupon works with 3 or 6 terms, so we’ve taken it off.', primary: { label: 'Keep coupon', onClick: close }, secondary: { label: 'Don’t use coupon', onClick: close }, onClose: close })
      : h(PS.CouponPicker, { tab: 'd', onTab: noop, onClose: close, tabs: [{ id: 'd', label: 'Discount', count: 1 }, { id: 'l', label: 'Limit increase', count: 0 }], intro: 'You can use 1 interest discount and 1 limit increase on each loan.', loan: '₱45,000.00 · 6 terms', summary: h(PS.Summary, { total: 50231.25, was: 50400, saved: 168.75, onConfirm: close }) },
          T({ action: 'pick', state: 'selected', best: true }));
    return frame(p.kind === 'page' ? 620 : 480, [
      h('div', { key: 'b', className: 'g-center' }, h(PS.Button, { size: 'sm', onClick: function () { set(true); } }, 'Open sheet')),
      h(PS.Sheet, { key: 's', open: open, kind: p.kind, onClose: close, label: 'Example' }, body)]);
  }

  function Entry(p) {
    var it = p.item, s = R.useState(0), i = s[0];
    return h('article', { className: 'g-entry', id: 'c-' + it.name.split(' ')[0].toLowerCase() },
      h('div', { className: 'g-info' },
        h('h3', { className: 'ps-t-section-md' }, it.name.split(' · ').map(function (n) { return 'PS.' + n; }).join(' · ')),
        h('p', { className: 'ps-t-body-md ps-c-secondary' }, it.desc),
        h('p', { className: 'g-props ps-t-caption-sm' }, h('b', null, 'Props '), it.props),
        it.states.length > 1 ? h('div', { className: 'g-chips', role: 'tablist' }, it.states.map(function (st, j) {
          return h(m.button, { key: st[0], type: 'button', role: 'tab', 'aria-selected': i === j, className: PS.cx('g-chip', i === j && 'is-on'), whileTap: PS.TAP, onClick: function () { s[1](j); } }, st[0]);
        })) : null),
      h('div', { className: 'g-stage' }, h(PS.AP, { initial: false, mode: 'popLayout' },
        h(m.div, { key: i, initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: PS.T.ui }, it.states[i][1]()))));
  }

  function App() {
    return h(M.LazyMotion, { features: M.domMax, strict: true }, h(M.MotionConfig, { reducedMotion: 'user' },
      h('div', { className: 'g-page' },
        h('header', { className: 'g-head' },
          h('div', null, h('p', { className: 'ps-t-title-md' }, 'PeraSure components'),
            h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'shared/ps-ui · styled only with the design tokens · docs in shared/README.md')),
          h('nav', { className: 'g-nav' }, GROUPS.map(function (g) { return h('a', { key: g.id, href: '#g-' + g.id, className: 'g-chip' }, g.title); }))),
        GROUPS.map(function (g) {
          return h('section', { key: g.id, id: 'g-' + g.id, className: 'g-group' }, h('h2', { className: 'ps-t-title-sm' }, g.title),
            g.items.map(function (it) { return h(Entry, { key: it.name, item: it }); }));
        }))));
  }
  PS.mount(App);
})();
