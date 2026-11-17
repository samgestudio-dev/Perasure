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
      { name: 'Amount', desc: 'An emphasised amount in the number font (Reddit Sans, its own ₱) and a Number text style (tokens v2026.11.17). Notes beside an amount and old prices are Inter; a title keeps its font and only its ₱ is the number font (PS.Peso).', props: 'value · dec (2 | 0) · num xs | sm | md | lg | xl | xxl · decNum (a smaller ".00") · strike · className — PS.Peso children (a title with ₱)',
        states: [
          ['Number/xs 16', function () { return h(PS.Amount, { value: 50000, num: 'xs' }); }],
          ['Number/sm 18', function () { return h(PS.Amount, { value: 2000, num: 'sm' }); }],
          ['Number/md 24', function () { return h(PS.Amount, { value: 800, num: 'md', style: { color: 'var(--color-text-brand-default)' } }); }],
          ['Number/lg 32', function () { return h(PS.Amount, { value: 45000, num: 'lg', style: { color: 'var(--color-text-brand-default)' } }); }],
          ['Number/xl 36 + xs', function () { return h(PS.Amount, { value: 40000, num: 'xl', decNum: 'xs' }); }],
          ['Number/xxl 48', function () { return h(PS.Amount, { value: 12500, dec: 0, num: 'xxl' }); }],
          ['Struck', function () { return h(PS.Amount, { value: 46500, strike: true }); }],
          ['₱ in a title', function () { return h('p', { className: 'ps-t-title-md ps-c-brand' }, h(PS.Peso, null, '+₱5,000')); }]] },
      { name: 'Button', desc: 'Every pressable label. Press: spring scale.', props: 'variant primary | text | inverse | shade | outline | soft | ghost · size lg | md | sm · block · icon · disabled · inactive (looks disabled, still tappable: points at what is missing) · onClick',
        states: [
          ['Primary', function () { return h(PS.Button, { block: true }, 'Confirm'); }],
          ['Small', function () { return h(PS.Button, { size: 'sm' }, 'Pay ₱800 now'); }],
          ['Text', function () { return h(PS.Button, { variant: 'text', block: true }, 'Don’t use coupon'); }],
          ['Inverse', function () { return h(PS.Button, { variant: 'inverse', block: true }, 'Log out'); }],
          ['Outline', function () { return h(PS.Button, { variant: 'outline' }, 'Use'); }],
          ['Shade', function () { return h('div', { className: 'ps-credit', style: { padding: 12 } }, h(PS.Button, { variant: 'shade' }, 'Withdraw')); }],
          ['Soft · ghost · md', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, h(PS.Card, null, h('div', { className: 'ps-idside__btns' }, h(PS.Button, { variant: 'soft', size: 'sm' }, 'Camera'), h(PS.Button, { variant: 'soft', size: 'sm' }, 'Album'))),
            h(PS.ButtonRow, null, h(PS.Button, { variant: 'ghost', size: 'md' }, 'Try again'), h(PS.Button, { size: 'md' }, 'Enter manually'))); }],
          ['Inactive', function () { return h(PS.Button, { block: true, inactive: true, onClick: noop }, 'Next'); }],
          ['Disabled', function () { return h(PS.Button, { block: true, disabled: true }, 'Confirm'); }]] },
      { name: 'TextLink · InfoButton · SectionLabel', desc: 'An underlined link on its own line; a value with a help mark that opens an explainer; the small uppercase label over a list (red for OVERDUE, 8 in for dates).', props: 'TextLink: onClick · children — InfoButton: onClick(event) · children — SectionLabel: tone negative · inset · children',
        states: [['All', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }, h(PS.TextLink, { onClick: noop }, 'No longer have access to old number?'),
          h(PS.Card, null, h(PS.KV, { label: 'Overdue', value: h(PS.InfoButton, { onClick: noop }, '18 days') })),
          h(PS.SectionLabel, { tone: 'negative' }, 'OVERDUE'), h(PS.SectionLabel, null, 'UPCOMING'), h(PS.SectionLabel, { inset: true }, 'JULY 5, 2026')); }]] },
      { name: 'Glass · Back · Close', desc: 'The frosted buttons of headers and sheets.', props: 'Glass: icon · iconSize · label · children · round (false: a pill) · size lg (44 px) · onClick — Back / Close: onClick',
        states: [['Pills', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap' } }, h(PS.Glass, { round: false }, 'Payment'), h(PS.Glass, { round: false, size: 'lg' }, 'Mark all read'), h(PS.Glass, { icon: 'help-circle', label: 'Help' })); }],
          ['All', function () { return h('div', { className: 'g-row' }, h(PS.Back, { onClick: noop }), h(PS.Close, { onClick: noop }), h(PS.HomeActions, { actions: [{ icon: 'bell', label: 'Inbox' }, { icon: 'headset', label: 'Contact us' }] }), h(PS.Brand)); }]] },
      { name: 'Tag · Count · Chip', desc: 'Small labels.', props: 'Tag tone outline | soft | best | solid — Count n · on — Chip tone positive | brand · icon',
        states: [['All', function () {
          return h('div', { className: 'g-row', style: { flexWrap: 'wrap' } }, h(PS.Tag, { tone: 'outline' }, 'Protected'), h(PS.Tag, { tone: 'soft' }, 'Due in 45 days'),
            h(PS.Tag, { tone: 'best' }, 'Best'), h(PS.Tag, { tone: 'solid' }, '6 coupons'), h(PS.Count, { n: 6 }), h('span', { style: { background: 'var(--color-surface-card-brand)', borderRadius: 99, padding: 4, display: 'inline-flex' } }, h(PS.Count, { n: 2, on: true })),
            h(PS.Chip, { tone: 'positive' }, 'Saved ₱500'), h(PS.Chip, { tone: 'brand' }, 'New limit ₱50,000'));
        }]] },
      { name: 'Check · Agreement', desc: 'The round selection mark, and the tick line above a primary button.', props: 'Check on · off · box — Agreement on · onToggle · nudge (a number: each change ripples the circle) · children (links in <b>)',
        states: [['Marks', function () { return h('div', { className: 'g-row' }, h(PS.Check, {}), h(PS.Check, { on: true }), h(PS.Check, { off: true }), h(PS.Check, { box: true })); }],
          ['Agreement', function () { return h(Toggle, { render: function (on, set) { return h(PS.Agreement, { on: on, onToggle: function () { set(!on); } }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), ' and ', h('b', null, 'Loan Disclosure Statement'), '.'); } }); }],
          ['Nudge', function () { return h(Toggle, { init: 0, render: function (n, set) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }, h(PS.Agreement, { on: false, nudge: n, onToggle: noop }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), '.'), h(PS.Button, { block: true, inactive: true, onClick: function () { set(n + 1); } }, 'Confirm')); } }); }]] },
      { name: 'Icon', desc: 'One-colour icons from assets/icons, drawn as masks so the colour is a token.', props: 'name · size · color primary | secondary | tertiary | brand | positive | inverse | countdown',
        states: [['Set', function () {
          return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 14 } }, ['chevron-left', 'chevron-right', 'close', 'check-sm', 'arrow-up', 'edit', 'coupon', 'clock', 'alert-circle', 'bell', 'inbox', 'headset', 'history', 'info', 'chat', 'user', 'help', 'wallet', 'calendar', 'nav-home', 'nav-payment', 'nav-account']
            .map(function (n) { return h('span', { key: n, title: n }, h(PS.Icon, { name: n, size: 20, color: n === 'clock' ? 'countdown' : n === 'coupon' ? 'positive' : 'primary' })); }));
        }]] },
      { name: 'Card · Divider · Link', desc: 'The white rounded card (plain, outline: the home cards\' 2 px white ring, raised: with shadow — or outline + raised, as home\'s payment card), the hairline between rows (or dashed, or upright), and the blue text link.', props: 'Card: variant plain | outline | raised · raised (shadow on any variant) · clip · as · onClick — Divider: dashed · vertical — Link: onClick · children',
        states: [['Cards', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, [['plain'], ['outline'], ['raised'], ['outline', true]].map(function (v) { return h(PS.Card, { key: v.join(), variant: v[0], raised: v[1] }, h('p', { className: 'ps-t-body-md-em' }, v[1] ? 'outline + raised' : v[0])); })); }],
          ['Lines · link', function () { return h(PS.Card, null, h('p', { className: 'ps-t-body-md' }, 'Above the line'), h(PS.Divider), h('p', { className: 'ps-t-body-md' }, 'Dashed below'), h(PS.Divider, { dashed: true }), h(PS.Link, { onClick: noop }, 'View payment schedule')); }]] },
      { name: 'Section · KV · Rows', desc: 'The uppercase label over a card with an optional action, and label / value rows (Rows puts the lines between them; tone positive turns a value green).', props: 'Section: label · action · onAction · children — KV: label · value · tone — Rows: rows [{ label, value, tone }]',
        states: [['Section', function () { return h(PS.Section, { label: 'TOTAL REPAYMENT', action: 'See all 6', onAction: noop }, h(PS.Card, null, h(PS.KV, { label: 'Amount', value: '₱2,000.00' }))); }],
          ['Rows', function () { return h(PS.Card, null, h(PS.Rows, { rows: [{ label: 'Daily fee', value: '₱12.50' }, { label: 'Coupon', value: '-₱300.00', tone: 'positive' }, { label: 'Total payment', value: '₱13,250.00' }] })); }]] },
      { name: 'Swap', desc: 'Text that changes after a tap crossfades in place: the old rises out, the new rises in, 3 px blur between. Key it on the state, never on a number that follows a slider.', props: 'k · block · y · children',
        states: [['Tap', function () { return h(Toggle, { init: false, render: function (v, set) { return h(PS.Button, { block: true, onClick: function () { set(!v); } }, h(PS.Swap, { k: v ? 'b' : 'a' }, h('span', null, v ? 'I understand' : 'Next'))); } }); }]] },
      { name: 'Anim · Lottie · Art', desc: 'The repo\'s illustrations by name, cropped to their art so size is the picture\'s box; they play their intro, then loop (empty-box plays once). active: only the card on show plays, again from the start each time. Art: a full-colour picture from assets/art.', props: 'Anim: name · size · active · fit — Lottie: src · width · height · intro · loop · once · active · onDone — Art: name · size · ext · dir',
        states: [['Illustrations', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 12 } }, ['customer-service-chat', 'customer-service', 'empty-box', 'loading-state-otp', 'safe-transaction', 'verification-code', 'doc-verify'].map(function (n) { return h('span', { key: n, title: n }, h(PS.Anim, { name: n, size: 88 })); })); }],
          ['Art', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 12 } }, h(PS.Art, { name: 'empty-box', size: 64 }), h(PS.Art, { name: 'stars', size: 64 }), h(PS.Art, { name: 'verified', size: 40 }), h(PS.Art, { name: 'protection', size: 40 })); }]] },
    ] },
    { id: 'layout', title: 'Layout', items: [
      { name: 'TopBar', desc: 'Header: back or brand on the left, title, actions on the right. No progressive blur (tokens v2026.11.17): on a tab page, the amount entry and the order page its veil is Gradient/Top-nav-filled; a secondary page has a solid header in the page colour (solid).', props: 'left · title · right · extra + extraHeight · solid · live',
        states: [['Order page (veil)', function () { return frame(116, h(PS.TopBar, { left: h(PS.Back, {}), title: 'Apply a loan', live: true })); }],
          ['Secondary page (solid)', function () { return frame(116, h(PS.TopBar, { left: h(PS.Back, {}), title: 'Loan history', solid: true })); }],
          ['Brand', function () { return frame(116, h(PS.TopBar, { left: h(PS.Brand), right: h(PS.HomeActions, { actions: [{ icon: 'bell' }, { icon: 'headset' }] }) })); }],
          ['With tabs', function () { return frame(174, h(PS.TopBar, { left: h(PS.Back, {}), title: 'Coupons', solid: true, extraHeight: 58,
            extra: h('div', { style: { padding: '2px 16px 16px' } }, h(Tabs3, {})) })); }]] },
      { name: 'BottomBar · Navigator', desc: 'The bottom action area and the tab bar (the pill glides between tabs). Veils (tokens v2026.11.17, no progressive blur): tab bar and a tab page’s bar Gradient/Bottom-primary-nav-filled; a secondary page, the amount entry and the order page Gradient/Bottom-secondary-nav-filled (secondary).', props: 'BottomBar children · secondary · note (a small line over the button, DS 5561:7317) · consent (an agreement line over a narrower button) — Navigator tabs [{ id, label, icon }] · value · onChange · id',
        states: [['Navigator', function () { return frame(110, h(Toggle, { init: 'home', render: function (v, set) { return h(PS.Navigator, { id: 'g-nav', value: v, onChange: set, tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] }); } })); }],
          ['Bottom bar · primary', function () { return frame(110, h(PS.BottomBar, null, h(PS.Button, { block: true }, 'Confirm'))); }],
          ['Bottom bar · secondary', function () { return frame(110, h(PS.BottomBar, { secondary: true }, h(PS.Button, { block: true }, 'Confirm'))); }],
          ['With a note', function () { return frame(150, h(PS.BottomBar, { note: 'SEC rules ask us for an emergency contact. We only call them if a payment is overdue and we can’t reach you.' }, h(PS.Button, { block: true }, 'Submit'))); }],
          ['With consent', function () { return frame(170, h(Toggle, { render: function (on, set) { return h(PS.BottomBar, { consent: true }, h(PS.Consent, { on: on, onToggle: function () { set(!on); } }, 'By continuing, you agree to our ', h('b', null, 'Terms of Service'), ' and ', h('b', null, 'Privacy & Data Collection Policy'), '.'), h(PS.Button, { block: true }, 'Log in')); } })); }]] },
      { name: 'Sheet', desc: 'Three kinds: page (fills below the header), card (floating decision), plain (bottom). Drag the top edge down or tap outside to close.', props: 'open · kind page | card | plain · onClose · label · scrim',
        states: [['Plain', function () { return h(SheetDemo, { kind: 'plain' }); }], ['Card', function () { return h(SheetDemo, { kind: 'card' }); }], ['Page', function () { return h(SheetDemo, { kind: 'page' }); }]] },
      { name: 'Tooltip · Toast', desc: 'A frosted bubble next to what was tapped; a short message above the bottom bar.', props: 'Tooltip open · at { x, y } · text · onClose — Toast msg · bottom; PS.useToast() → [msg, show]',
        states: [['Tooltip', function () { return frame(120, h(PS.Tooltip, { open: true, at: { x: 56, y: 24 }, text: 'Borrow ₱10,000 or more · 3 / 6 terms · One per account', onClose: noop })); }],
          ['Toast', function () { return frame(90, h(PS.Toast, { msg: 'Your loan is now ₱6,000 · 6 terms.', bottom: 20 })); }]] },
      { name: 'SheetHead · ButtonRow · Confirm', desc: 'A sheet\'s title row with the close button in its 40 px corner (centred, or left with room for the button; a mark before the title; the title at the bottom of the row). Two buttons side by side, 10 apart, that wrap large text. Confirm: a card sheet that asks before something happens (put the sheet in className ps-confirm).',
        props: 'SheetHead: title · type · align center | left · bottom · icon · iconColor · onClose · children — ButtonRow: children — Confirm: title · body · cancel · ok · onOk · onClose · onCancel',
        states: [['Centred', function () { return h('div', { className: 'ps-card', style: { padding: 16 } }, h(PS.SheetHead, { title: 'Payment detail', type: 'ps-t-title-16', onClose: noop })); }],
          ['Left · mark', function () { return h('div', { className: 'ps-card', style: { padding: 16 } }, h(PS.SheetHead, { align: 'left', bottom: true, title: 'We couldn’t verify your ID', icon: 'warning-filled', iconColor: 'var(--color-icon-negative-light)', onClose: noop })); }],
          ['Confirm', function () { return h(InSheet, { className: 'ps-confirm', height: 360, render: function (close) { return h(PS.Confirm, { title: 'Log out', body: 'Are you sure you want to log out?', cancel: 'Cancel', ok: 'Log out', onOk: close, onClose: close }); } }); }],
          ['One button', function () { return h(InSheet, { className: 'ps-confirm', height: 380, render: function (close) { return h(PS.Confirm, { title: 'You can’t delete your account yet', body: 'You still have a loan application in progress or a loan to repay. You can close your account once it’s complete or fully repaid.', ok: 'I understand', onOk: close, onClose: close }); } }); }]] },
    ] },
    { id: 'home', title: 'Home', items: [
      { name: 'CreditCard', desc: 'Available amount, total and temporary credit, Withdraw.', props: 'available · total · temporary · temporaryUntil · onWithdraw · onInfo · label · action',
        states: [['Temporary credit', function () { return h(PS.CreditCard, { available: 40000, total: 50000, temporary: 10000, temporaryUntil: 'Nov 20' }); }],
          ['No temporary', function () { return h(PS.CreditCard, { available: 15000, total: 50000 }); }]] },
      { name: 'PaymentCard', desc: 'The next repayment; overdue: a red badge, and with a notice the overdue layout (the due date under the amount, the penalty box, a full-width button).', props: 'amount · was · due · badge · onPay · payLabel · title · overdue · notice { title, body, onHelp }',
        states: [['Default', function () { return h(PS.PaymentCard, { amount: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' }); }],
          ['Discounted', function () { return h(PS.PaymentCard, { amount: 700, was: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' }); }],
          ['Overdue', function () { return h(PS.PaymentCard, { amount: 2150, due: 'Nov 9', badge: 'Overdue · 3 days', overdue: true, onPay: noop, notice: { title: 'Last day to pay without a penalty', body: 'Pay by 11:59 PM today to avoid a ₱100.00 penalty on Nov 13.', onHelp: noop } }); }]] },
      { name: 'HomeCoupons', desc: 'Coupons for your next loan: two or more → two cards; one → the wide card with the folder tab; none → nothing.', props: 'coupons [{ type, value, until, kind, label, cond }] · onOpen · title · layout auto | pair | one',
        states: [['Two', function () { return h('div', { style: { paddingTop: 8 } }, h(PS.HomeCoupons, { coupons: [{ type: 'percent', value: '50% OFF', until: 'Until Nov 11, 2026' }, { type: 'limit', value: '+₱5,000', until: 'Until Nov 11, 2026' }] })); }],
          ['Amount off', function () { return h('div', { style: { paddingTop: 8 } }, h(PS.HomeCoupons, { coupons: [{ type: 'amount', value: '₱300 OFF', until: 'Until Dec 15, 2026' }, { type: 'percent', value: '20% OFF', until: 'Until Nov 30, 2026' }] })); }],
          ['One', function () { return h('div', { style: { paddingTop: 40 } }, h(PS.HomeCoupons, { coupons: [{ type: 'limit', value: '+₱5,000', kind: 'Credit limit', label: 'Borrow more than ₱20,000', cond: 'Any term' }] })); }]] },
      { name: 'TrustCard · Legal', desc: '“Made for Filipinos”, the NPC and SEC tiles, partner logos (scrolling), and the company lines.', props: 'TrustCard kicker · title — Legal lines',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.TrustCard), h(PS.Legal)); }]] },
      { name: 'DotTitle · Banners · PartnerLogos', desc: 'The small section title with the red dot, "More from PeraSure" cards that scroll sideways, and the bank and wallet logos scrolling slowly.', props: 'DotTitle: children — Banners: items [{ id, title, body, onClick }] — PartnerLogos: none',
        states: [['More from PeraSure', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, h(PS.DotTitle, null, 'More from PeraSure'),
            h(PS.Banners, { items: [{ id: 'b1', title: 'Invite a friend', body: 'You both get a coupon when they take their first loan.' }, { id: 'b2', title: 'Pay early, save more', body: 'See how early payments lower your interest.' }] })); }],
          ['Partner logos', function () { return h(PS.PartnerLogos); }]] },
    ] },
    { id: 'coupons', title: 'Coupons', items: [
      { name: 'CouponTicket', desc: 'The coupon in the coupon centre (Use). The picker uses CouponOption. Fields not given are left out.', props: 'value · label · rule · ruleLong + onRule · meta · expiresAt · best · state default | selected | used | expired | unavailable · reason · action use | pick | none · onUse · onPick',
        states: [['To use', function () { return T({ action: 'use', best: true, expiresAt: NOW + 86399000 }); }],
          ['Long rule', function () { return T({ action: 'use', value: '₱300 OFF', rule: 'Borrow ₱10,000 or more · 3 / 6 terms · One per account, on your first loan of the month', ruleLong: true }); }],
          ['Picker', function () { return h(Toggle, { render: function (on, set) { return T({ action: 'pick', state: on ? 'selected' : 'default', onPick: function () { set(!on); } }); } }); }],
          ['Unavailable', function () { return T({ action: 'pick', state: 'unavailable', value: '20% OFF', label: 'Interest on all payments', rule: 'Borrow ₱6,000 or more · 6 / 8 terms', reason: 'Works with 6 or 8 terms' }); }],
          ['Used', function () { return T({ state: 'used', meta: 'Used on Oct 24, 2026' }); }],
          ['Expired', function () { return T({ state: 'expired', value: '+₱3,000', label: 'Credit limit increase', meta: 'Expired on Oct 15, 2026' }); }]] },
      { name: 'CouponOption', desc: 'A coupon in the picker sheet (DS 10840:29499): picking gives it a 1 px brand line inside (DS 10842:29606), the default shadow and the mark; with less than a day left, the countdown strip sits under the card.',
        props: 'value · label · best · expiresAt · rule (shown when unavailable) · state default | selected | unavailable · onPick',
        states: [['Pick', function () { return h(Toggle, { init: false, render: function (on, set) { return h(PS.CouponOption, { value: '25% OFF', label: 'First-payment interest', best: true, state: on ? 'selected' : 'default', onPick: function () { set(!on); } }); } }); }],
          ['Less than a day left', function () { return h(Toggle, { init: true, render: function (on, set) { return h(PS.CouponOption, { value: '25% OFF', label: 'First-payment interest', expiresAt: NOW + 86399000, state: on ? 'selected' : 'default', onPick: function () { set(!on); } }); } }); }],
          ['Unavailable', function () { return h(PS.CouponOption, { value: '20% OFF', label: 'Interest on all payments', rule: 'Borrow ₱6,000 or more · 6 / 8 terms', state: 'unavailable' }); }]] },
      { name: 'Tabs', desc: 'Segmented control; the pill glides to the picked tab. Count badges are optional.', props: 'items [{ id, label, count }] · value · onChange · glass · split (separate pills) · spaced (16 between them) · id',
        states: [['Coupon centre', function () { return h(Tabs3, {}); }], ['Picker (glass)', function () { return h(Toggle, { init: 'd', render: function (v, set) { return h('div', { style: { background: 'var(--color-surface-inset-default)', padding: 12, borderRadius: 24 } }, h(PS.Tabs, { id: 'g-t2', glass: true, value: v, onChange: set, items: [{ id: 'd', label: 'Discount' }, { id: 'l', label: 'Limit increase' }] })); } }); }],
          ['Split', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
            h(Toggle, { init: 'adj', render: function (v, set) { return h(PS.Tabs, { id: 'g-split', split: true, value: v, onChange: set, items: [{ id: 'adj', label: 'Credit adjustments' }, { id: 'act', label: 'Borrowing activity' }] }); } }),
            h(Toggle, { init: 'unread', render: function (v, set) { return h(PS.Tabs, { id: 'g-spaced', split: true, spaced: true, value: v, onChange: set, items: [{ id: 'unread', label: 'Unread (2)' }, { id: 'read', label: 'Read' }] }); } })); }]] },
      { name: 'EmptyState', desc: 'Picture, title and one line (the Empty box animation by default). page: all a page shows — it sits where the loading coin sat, so loading → empty reads as one place.', props: 'art · title · body · children (a button) · page',
        states: [['Default', function () { return h(PS.EmptyState, { title: 'No coupons yet', body: 'When you get a coupon, you’ll see it here.' }); }],
          ['Page', function () { return h('div', { className: 'g-frame', style: { height: 600, '--ph': '600px' } }, h(PS.Screen, { secondary: true, top: { left: h(PS.Back, { onClick: noop }), title: 'Loan history' } }, h(PS.EmptyState, { title: 'No loan history yet', body: 'Your loan records will appear here once you apply.', page: true }))); }]] },
      { name: 'CouponRow · CouponsSection', desc: 'Coupon lines on the loan page; green sub-line when the coupon is on.', props: 'CouponRow type · title · sub · on · onClick — CouponsSection count · onSeeAll · rows',
        states: [['Both on', function () { return h(PS.CouponsSection, { count: 6, rows: [{ type: 'percent', title: '50% off first-payment interest', sub: 'You save ₱5,000', on: true }, { type: 'limit', title: '+₱5,000 credit limit', sub: 'Your limit is ₱50,000 for this loan', on: true }] }); }],
          ['Not used', function () { return h(PS.CouponsSection, { count: 6, rows: [{ type: 'percent', title: '20% off interest on all payments', sub: 'Borrow ₱6,000 or more · 6 / 8 terms' }, { type: 'limit', title: '+₱5,000 credit limit', sub: 'Borrow ₱6,000 or more · 3 / 6 / 8 terms' }] }); }]] },
      { name: 'Summary', desc: 'Total payment with what the coupons do. A coupon that isn’t used hides its field.', props: 'total · was · saved · newLimit · onConfirm · label · title',
        states: [['Both', function () { return h(PS.Summary, { total: 46000, was: 46500, saved: 500, newLimit: 50000 }); }],
          ['Discount only', function () { return h(PS.Summary, { total: 46000, was: 46500, saved: 500 }); }],
          ['No coupon', function () { return h(PS.Summary, { total: 46500 }); }]] },
      { name: 'Decision', desc: '“Keep your coupon?” after a change takes a coupon off (inside a card sheet). Its coupon picture plays the coupon animation. When a change takes off more than one coupon, the coupons sit side by side and are swiped like the anti-scam cards (Carousel + dots); the buttons act on the coupon on show.', props: 'art · title · body · facts [{ label, value, tone }] · primary · secondary · onClose · pages [{ art, title, body, facts }] · index · onIndex',
        states: [['Discount', function () { return h('div', { className: 'ps-card', style: { borderRadius: 32 } }, h(PS.Decision, { art: 'percent', title: 'Keep your 50% off?', body: 'Your new amount is ₱5,000. This coupon needs a loan of ₱6,000 or more, so we’ve taken it off.', facts: [{ label: 'Your loan', value: '₱5,000 · 6 terms' }, { label: 'You’d save', value: '₱5,000', tone: 'positive' }], primary: { label: 'Keep coupon' }, secondary: { label: 'Don’t use coupon' } })); }],
          ['Limit', function () { return h('div', { className: 'ps-card', style: { borderRadius: 32 } }, h(PS.Decision, { art: 'limit', title: 'Keep your ₱5,000 limit increase?', body: 'Your new amount is ₱5,000. This coupon needs a loan of ₱6,000 or more, so we’ve taken it off.', facts: [{ label: 'Your loan', value: '₱5,000 · 6 terms' }, { label: 'Your credit limit with it', value: '₱50,000', tone: 'positive' }], primary: { label: 'Keep coupon' }, secondary: { label: 'Don’t use coupon' } })); }],
          ['Two coupons', function () { return h(Toggle, { init: 0, render: function (i, set) {
            var body = 'Your new amount is ₱3,000. This coupon needs a loan of ₱6,000 or more, so we’ve taken it off. Keep it and we’ll set your loan to ₱6,000.', loan = { label: 'Your loan', value: '₱3,000 · 6 terms' };
            var go = function () { set(i ? 0 : 1); };
            return h('div', { className: 'ps-card', style: { borderRadius: 32 } }, h(PS.Decision, { index: i, onIndex: set, pages: [
              { art: 'percent', title: 'Keep your 20% off?', body: body, facts: [loan, { label: 'You’d save', value: '₱108.00', tone: 'positive' }] },
              { art: 'limit', title: 'Keep your ₱5,000 limit increase?', body: body, facts: [loan, { label: 'Your credit limit with it', value: '₱50,000', tone: 'positive' }] }],
              primary: { label: 'Keep coupon', onClick: go }, secondary: { label: 'Don’t use coupon', onClick: go } })); } }); }]] },
      { name: 'Countdown · CouponArt', desc: 'A ticking "Expires in" (every second) and the coupon pictures: Figma\'s exports with the green badge — with the white outline and shadow from 40 px up, the plain small one below. animate plays the coupon animation instead (only the “Keep your coupon?” sheet uses it).', props: 'Countdown: to (ms) · prefix — CouponArt: type percent | amount | limit · size · animate',
        states: [['Countdown', function () { return h('p', { className: 'ps-t-caption-sm', style: { color: 'var(--ps-countdown)' } }, h(PS.Countdown, { to: NOW + 23 * 3600000 + 59 * 60000 })); }],
          ['Pictures', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 16 } }, ['percent', 'amount', 'limit'].map(function (t) { return h('span', { key: t, className: 'g-row' }, h(PS.CouponArt, { type: t, size: 56 }), h(PS.CouponArt, { type: t, size: 36 })); })); }],
          ['Animated', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 16 } }, ['percent', 'amount', 'limit'].map(function (t) { return h(PS.CouponArt, { key: t, type: t, size: 80, animate: true }); })); }]] },
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
        states: [['Default', function () { return h(PS.RepaymentPlan, { items: [1, 2, 3].map(function (k) { return { title: 'Payment ' + k, date: ['Nov 27', 'Dec 12', 'Dec 27'][k - 1] + ', 2026', total: k === 1 ? 8231.25 : 8400, rows: [{ label: 'Principal', value: 7500 }, { label: 'Interest', value: k === 1 ? 506.25 : 675, was: 675 }, { label: 'Service fee', value: 225 }] }; }) }); }]] },
      { name: 'Slider', desc: 'The amount slider on its own: the knob and the fill follow the finger at once; when something else moves the value or the maximum (a coupon raises it) they glide there on the Smooth spring. boost: the green end with the coupon mark.', props: 'value · min · max · step · onChange(v) while dragging · onCommit(v) · boost',
        states: [['Drag', function () { return h(Toggle, { init: 30000, render: function (v, set) { return h('div', { style: { padding: '16px 4px' } }, h(PS.Slider, { value: v, min: 500, max: 45000, step: 500, onChange: set, onCommit: set })); } }); }],
          ['Raised by a coupon', function () { return h(Toggle, { init: 50000, render: function (v, set) { return h('div', { style: { padding: '16px 4px' } }, h(PS.Slider, { value: v, min: 500, max: 50000, step: 500, boost: true, onChange: set, onCommit: set })); } }); }]] },
      { name: 'OrderHead · OrderStatus · PlanRows', desc: 'The top of a loan page (a label over the amount in brand blue), where the application stands (the outlined card with a tile; red when the transfer failed), and a payment plan as separate rows 2 px apart.', props: 'OrderHead: label · amount — OrderStatus: state review | failed · title · body — PlanRows: rows [{ label, value }]',
        states: [['In review', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.OrderHead, { label: 'You applied for a loan', amount: 12500 }),
            h(PS.OrderStatus, { state: 'review', title: 'We’re reviewing your application', body: 'Your loan is under review. We’ll let you know once we’re sending your money.' })); }],
          ['Failed', function () { return h(PS.OrderStatus, { state: 'failed', title: 'We couldn’t send your loan', body: 'The transfer to your account didn’t go through. Change your withdrawal method to try again.' }); }],
          ['Plan', function () { return h(PS.Section, { label: 'PAYMENT PLAN' }, h(PS.PlanRows, { rows: ['June 10, 2026', 'June 25, 2026', 'July 10, 2026'].map(function (d) { return { label: d, value: '₱500.00' }; }) })); }]] },
      { name: 'AmountEntry', desc: 'The amount keypad page\'s white sheet (Figma 52:12744): the amount as it is typed (digits rise in, a caret blinks, what is not typed yet is grey), a line that turns red out of range, the terms and the keypad.', props: 'typed (digits so far, with commas) · amount · label · hint · error · terms · term · onTerm · onKey',
        states: [['Type', function () { return h('div', { className: 'g-frame', style: { height: 620, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' } }, h(Toggle, { init: '125', render: function (d, set) {
          var n = parseInt(d || '0', 10) * 100, out = n > 50000;
          return h(PS.AmountEntry, { typed: d ? PS.num(n, 0).slice(0, -2) : '', amount: n, terms: [3, 6, 8], term: null, onTerm: noop, hint: 'Flexible amounts from ₱500–₱50,000', error: out ? 'Enter an amount from ₱500 to ₱50,000.' : null,
            onKey: function (k) { set(k === 'del' || k === 'back' || k === 'delete' ? d.slice(0, -1) : /^\d$/.test(k) && d.length < 4 ? (d + k).replace(/^0+/, '') : d); } }); } })); }]] },
    ] },
    { id: 'account', title: 'Account', items: [
      { name: 'Profile · CreditLimitCard · GuestProfile', desc: 'Who is signed in and their credit.', props: 'Profile initials · name · verified · icon — CreditLimitCard total · available · onClick · masked (not signed in) — GuestProfile onLogin',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 24 } }, h(PS.Profile, { initials: 'SG', name: 'Sam Ge', verified: true }), h(PS.CreditLimitCard, { total: 50000, available: 15000 })); }],
          ['Not signed in', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 24 } }, h(PS.GuestProfile, { onLogin: noop }), h(PS.CreditLimitCard, { masked: true, onClick: noop })); }]] },
      { name: 'Menu · Social', desc: 'Menu rows with an optional badge, and the social links.', props: 'Menu items [{ id, icon, label, badge, onClick }] — Social title · items',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.Menu, { items: [{ icon: 'inbox', label: 'Inbox', badge: 'New' }, { icon: 'coupon', label: 'Coupons', badge: '6 coupons' }, { icon: 'history', label: 'Loan history' }] }), h(PS.Social, {})); }]] },
      { name: 'AboutHead · FooterMark · RegCard', desc: 'About PeraSure: the app icon (64), the name and the version; the grey mark and a line at the bottom of the page; the SEC and BIR registration cards.', props: 'AboutHead: name · version — FooterMark: children — RegCard: title | img + alt · body',
        states: [['About', function () { return h('div', null, h(PS.AboutHead, { name: 'PeraSure', version: 'Version 3.2.9 (2355)' }), h(PS.FooterMark, null, '© 2026 PeraSure. All rights reserved.')); }],
          ['SEC', function () { return h(PS.RegCard, { title: 'Sulit Lending Corporation', body: 'Authorized and registered in compliance with Republic Act No.9474 (Lending Company Regulation Act of 2007) of the Republic of the Philippines.' }); }],
          ['BIR', function () { return h(PS.RegCard, { img: PS.asset('art/bir-badge.png'), alt: 'Bureau of Internal Revenue: registered, with a QR code', body: 'Scan the QR code to verify our registration with the Bureau of Internal Revenue.' }); }]] },
      { name: 'Rating', desc: '"How was your experience with PeraSure?" in a card sheet (className ps-rating): the steps lie on top of each other so nothing jumps; the step shown crossfades in, the title and the buttons swap their words.', props: 'step ask | good | bad · onOk · onNo · onClose',
        states: [['Sheet', function () { return h(InSheet, { className: 'ps-rating', height: 520, render: function (close) { return h(Toggle, { init: 'ask', render: function (st, set) {
          return h(PS.Rating, { step: st, onOk: st === 'ask' ? function () { set('good'); } : close, onNo: st === 'ask' ? function () { set('bad'); } : close, onClose: close }); } }); } }); }]] }
    ] }
  ].concat(window.PS_GALLERY || []);   /* the app's components: gallery-app.js */

  function Toggle(p) { var s = R.useState(p.init != null ? p.init : true); return p.render(s[0], s[1]); }
  var seq = 0;
  function Tabs3() { var id = R.useRef('g-t3-' + (++seq)).current; return h(Toggle, { init: 'use', render: function (v, set) { return h(PS.Tabs, { id: id, value: v, onChange: set, items: [{ id: 'use', label: 'To use', count: 6 }, { id: 'used', label: 'Used' }, { id: 'expired', label: 'Expired' }] }); } }); }
  function LoanDemo(p) {
    var s = R.useState(45000), t = R.useState(6), max = p.boost ? 50000 : 45000;
    return h(PS.AmountCard, { amount: Math.min(s[0], max), min: 500, max: max, step: 500, boost: p.boost, onAmount: s[1], terms: [3, 6, 8], term: t[0], onTerm: t[1], onEdit: noop });
  }
  /* InSheet: any content in a sheet that opens again with a button · kind (card) · className · height · render(close) */
  function InSheet(p) {
    var s = R.useState(true), open = s[0], set = s[1], close = function () { set(false); };
    return frame(p.height || 480, [h('div', { key: 'b', className: 'g-center' }, h(PS.Button, { size: 'sm', onClick: function () { set(true); } }, 'Open sheet')),
      h(PS.Sheet, { key: 's', open: open, kind: p.kind || 'card', className: p.className, onClose: close, label: 'Example' }, p.render(close))]);
  }
  PS.GalleryInSheet = InSheet;   /* for gallery-app.js */
  function SheetDemo(p) {
    var s = R.useState(true), open = s[0], set = s[1];
    var close = function () { set(false); };
    var body = p.kind === 'plain' ? h(R.Fragment, null, h(PS.SheetTitle, { onClose: close }, 'Repayment plan'), h('p', { className: 'ps-t-body-md ps-c-tertiary', style: { padding: '0 12px' } }, 'Sheet content.'), h(PS.Button, { block: true, onClick: close }, 'Continue'))
      : p.kind === 'card' ? h(PS.Decision, { art: 'amount', title: 'Keep your ₱300 off?', body: 'This coupon works with 3 or 6 terms, so we’ve taken it off.', primary: { label: 'Keep coupon', onClick: close }, secondary: { label: 'Don’t use coupon', onClick: close }, onClose: close })
      : h(PS.CouponPicker, { tab: 'd', onTab: noop, onClose: close, tabs: [{ id: 'd', label: 'Discount' }, { id: 'l', label: 'Limit increase' }], intro: 'You can use 1 interest discount and 1 limit increase on each loan.', loan: '₱45,000.00 · 6 terms', summary: h(PS.Summary, { total: 50231.25, was: 50400, saved: 168.75, onConfirm: close }) },
          h(PS.CouponOption, { value: '25% OFF', label: 'First-payment interest', state: 'selected', best: true, expiresAt: NOW + 86399000 }));
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
  PS.GALLERY = GROUPS;                  /* every entry, for PeraSure Dev Mode's component stage (shared/stage.html) */
  if (window.PS_STAGE) return;          /* the stage mounts one entry itself */
  PS.mount(App);
})();
