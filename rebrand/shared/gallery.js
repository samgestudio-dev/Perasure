/* PeraSure components — live gallery of every shared component (shared/ps-ui) and its states.
   Each entry: name · what it is for · props · states (chips switch between them) · the live component. */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, PS = window.PS, h = R.createElement, m = PS.m;
  var NOW = Date.now();
  function noop() {}
  function frame(height, kids) { return h('div', { className: 'g-frame', style: { height: height } }, kids); }

  /* spec entries' frames: a row on green / navy (Button 11–12, TextLink 3–4) and a page under a scrim (Scrim) */
  function kvCard(kid) { return h('div', { style: { margin: '0 -1rem', background: 'var(--surface-default)', borderRadius: 'var(--radius-card)', padding: 'var(--spacing-padding-xs) var(--spacing-padding-lg)' } }, kid); }   /* the spec's card: 375 wide, KV 343 */
  function topFrame(bar, hh) { return h('div', { className: 'g-frame', style: { height: hh || 120, '--e': '0px' } }, bar); }
  function sheetStatic(kind) {   /* spec Sheet states, drawn still with the sheet's own classes (the live one: Sheet · live) */
    var slot = h('div', { key: 'slot', style: { flex: kind === 'page' ? '1 1 auto' : 'none', height: kind === 'page' ? undefined : 120, border: '1px dashed var(--border-default)', background: 'var(--surface-page-subtle)', borderRadius: 'var(--radius-md)' } });
    var body = [h('span', { key: 'g', className: 'ps-sheet__grab', 'aria-hidden': true }), h(PS.SheetTitle, { key: 't', onClose: noop }, kind === 'page' ? 'Choose a coupon' : 'Choose a repayment plan'), slot,
      h(PS.Button, { key: 'b', block: true, label: 'Confirm' })];
    var page = h('div', { key: 'p', style: { position: 'absolute', inset: 0, padding: '3.5rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: 12 } },
      h('p', { className: 'ps-text-label-md', style: { textAlign: 'center', margin: '-2rem 0 1.5rem' } }, 'Payment'),
      h('div', { style: { height: 120, borderRadius: 'var(--radius-card)', background: 'var(--surface-default)' } }), h('div', { style: { height: 72, borderRadius: 'var(--radius-card)', background: 'var(--surface-default)' } }));
    var sheet = h('div', { key: 's', className: 'ps-sheet ps-sheet--' + kind, style: kind === 'page' ? { top: 116, padding: 'var(--spacing-padding-2xl) var(--spacing-padding-lg) var(--spacing-page-bottom-sm)', gap: 'var(--spacing-gap-lg)' } : null }, body);
    return frame(800, [page, h(PS.Scrim, { key: 'sc' }), sheet]);   /* the 360 × 800 screen of the spec; BRIEF 19: page sheets on the scrim too */
  }
  /* BRIEF 19: a page sheet with a fixed search header — at rest (no shadow) or scrolled (the header's Elevation/1 at full) */
  function SheetScroll(p) {
    var box = R.useRef(null);
    R.useEffect(function () { var off = PS.sheetHead(box.current), b = box.current.querySelector('.ps-ssheet__body');
      if (p.scrolled && b) { b.scrollTop = PS.px(80); b.dispatchEvent(new Event('scroll')); } return off; }, []);
    var rows = ['National Capital Region (NCR)', 'Cordillera Administrative Region (CAR)', 'Ilocos Region', 'Cagayan Valley', 'Central Luzon', 'Calabarzon', 'Mimaropa', 'Bicol Region', 'Western Visayas', 'Central Visayas', 'Eastern Visayas', 'Zamboanga Peninsula'];
    var page = h('div', { key: 'p', style: { position: 'absolute', inset: 0, padding: '3.5rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: 12 } },
      h('div', { style: { height: 120, borderRadius: 'var(--radius-xl)', background: 'var(--surface-default)' } }));
    return frame(800, [page, h(PS.Scrim, { key: 'sc' }), h('div', { key: 's', ref: box, className: 'ps-sheet ps-sheet--page', style: { top: 116 } },
      h('span', { className: 'ps-sheet__grab', 'aria-hidden': true }),
      h(PS.SearchSheet, { value: '', onChange: noop, onClose: noop, placeholder: 'Search city name' },
        h('div', { className: 'ps-card ps-places__card' }, h('div', { className: 'ps-places__list' }, rows.map(function (r) { return h(PS.PlaceRow, { key: r, kind: 'region', label: r, onClick: noop }); })))))]);
  }
  function tile(kid) { return h('div', { style: { width: '10.3125rem' } }, kid); }   /* UploadTile picture: 165 wide */
  function onGreen(kid) { return h('div', { style: { display: 'inline-flex', padding: '1rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-action)' } }, kid); }
  function onNavy(kid) { return h('div', { style: { display: 'inline-flex', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-brand)' } }, kid); }
  function scrimDemo(type) {
    var card = function (k, hh) { return h('div', { key: k, style: { height: hh, borderRadius: 'var(--radius-xl)', background: 'var(--surface-default)' } }); };
    return frame(800, [h('div', { key: 'p', style: { position: 'absolute', inset: 0, padding: '3.5rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: 12 } },
        h('p', { className: 'ps-text-title-xs', style: { textAlign: 'center', margin: '-2.5rem 0 1rem' } }, type === 'flat' ? 'Home' : 'Payment'), card('a', 120), card('b', 72), card('c', 72)),
      h(PS.Scrim, { key: 's', type: type }),
      type === 'flat' ? h('div', { key: 'd', style: { position: 'absolute', left: 24, right: 24, top: 110, height: 140, borderRadius: 'var(--radius-xl)', background: 'var(--surface-raised)' } })
        : h('div', { key: 'd', style: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, borderRadius: 'var(--radius-xxl) var(--radius-xxl) 0 0', background: 'var(--surface-raised)' } })]);
  }
  var SCAMS = [{ anim: 'customer-service', title: 'Customer service is only available in the App', body: 'If anything unsure, contact customer service in the app.' },
    { anim: 'safe-transaction', title: 'Keep all payments and transactions within the App', body: 'Beware of people claiming to represent us on Facebook, via SMS, or on other platforms. Do not pay for promises of a higher credit limit or other paid offers out of our app.' },
    { anim: 'verification-code', title: 'Keep your verification code private', body: 'Never share it with anyone, even if they claim to be our staff. We will never ask for your code.' }];
  var ACC = '1. Open GCash app and tap "Pay Bills".\n2. Select "Loans" and find "Tinbo" or our partner biller.\n3. Enter the exact amount and your reference number.\n4. Confirm the payment.';
  var ticket = { value: '25% OFF', label: 'First-payment interest', rule: 'Any amount · 3 / 6 / 8 terms', meta: 'Valid until Nov 30, 2026' };
  function T(extra) { return h(PS.CouponTicket, Object.assign({}, ticket, extra)); }

  var GROUPS = [
    /* ---- Rebrand · the components built from the Figma specs (rebrand/spec/<Name>.md). Entry name = component name; states = the spec's
       showcase, in its order, so shared/stage.html?entry=<Name>&state=<i> lines up with Figma. ---- */
    { id: 'spec', title: 'Rebrand · spec components', items: [
      { name: 'Button', desc: 'Figma 10987:225 (spec Button.md). One Primary per screen; Navy only on green; Destructive kept apart.', props: 'variant primary | secondary | neutral (beside a primary, BRIEF 24) | plain (Log out, BRIEF 34) | text | destructive | navy · size large | small · state default | pressed | disabled · label · subtitle · icon · loading · block · onClick (kept: cta, shade, inverse, outline, soft, glass, ghost · size md · inactive)',
        states: [
          ['Primary', function () { return h(PS.Button, { variant: 'primary', size: 'large', label: 'Check your limit' }); }],
          ['Primary · pressed', function () { return h(PS.Button, { variant: 'primary', size: 'large', state: 'pressed', label: 'Check your limit' }); }],
          ['Primary · disabled', function () { return h(PS.Button, { variant: 'primary', size: 'large', state: 'disabled', label: 'Check your limit' }); }],
          ['Primary · loading', function () { return h(PS.Button, { variant: 'primary', size: 'large', loading: true, label: 'Submitting…' }); }],
          ['Secondary · two-line', function () { return h(PS.Button, { variant: 'secondary', size: 'large', label: 'Log in to your existing account', subtitle: 'Continue with your previous account' }); }],
          ['Secondary', function () { return h(PS.Button, { variant: 'secondary', size: 'large', label: 'Try again' }); }],
          ['Secondary · disabled', function () { return h(PS.Button, { variant: 'secondary', size: 'large', state: 'disabled', label: 'Try again' }); }],
          ['Neutral', function () { return h(PS.Button, { variant: 'neutral', size: 'large', label: 'Try again' }); }],
          ['Neutral · pressed', function () { return h(PS.Button, { variant: 'neutral', size: 'large', state: 'pressed', label: 'Try again' }); }],
          ['Neutral · disabled', function () { return h(PS.Button, { variant: 'neutral', size: 'large', state: 'disabled', label: 'Try again' }); }],
          ['Plain (Log out)', function () { return h(PS.Button, { variant: 'plain', size: 'large', label: 'Log out' }); }],
          ['Plain · pressed', function () { return h(PS.Button, { variant: 'plain', size: 'large', state: 'pressed', label: 'Log out' }); }],
          ['Neutral + primary in a row', function () { return h('div', { style: { width: '20.5rem' } }, h(PS.ButtonRow, null, h(PS.Button, { variant: 'neutral', size: 'md', label: 'Try again' }), h(PS.Button, { size: 'md', label: 'Enter manually' }))); }],
          ['Destructive', function () { return h(PS.Button, { variant: 'destructive', size: 'large', label: 'Close my account' }); }],
          ['Destructive · disabled', function () { return h(PS.Button, { variant: 'destructive', size: 'large', state: 'disabled', label: 'Close my account' }); }],
          ['Text', function () { return h(PS.Button, { variant: 'text', size: 'large', label: 'Cancel' }); }],
          ['Text · pressed', function () { return h(PS.Button, { variant: 'text', size: 'large', state: 'pressed', label: 'Yes' }); }],
          ['Navy on green', function () { return onGreen(h(PS.Button, { variant: 'navy', size: 'large', label: 'Withdraw now' })); }],
          ['Navy · pressed', function () { return onGreen(h(PS.Button, { variant: 'navy', size: 'large', state: 'pressed', label: 'Withdraw now' })); }],
          ['Small', function () { return h(PS.Button, { variant: 'primary', size: 'small', label: 'Resend code' }); }],
          ['Small · disabled', function () { return h(PS.Button, { variant: 'primary', size: 'small', state: 'disabled', label: 'Resend code after 59s' }); }],
          ['Small · secondary · icon', function () { return h(PS.Button, { variant: 'secondary', size: 'small', icon: 'add', label: 'Enter manually' }); }],
          ['Small · text', function () { return h(PS.Button, { variant: 'text', size: 'small', label: 'Confirm' }); }]] },
      { name: 'TextLink', desc: 'Figma 11006:366 (spec TextLink.md). A link is a colour + underline on Label/md, never a style; 45 px tall.', props: 'tone default | inverse · state default | pressed | disabled · label · icon (trailing) · onClick',
        states: [
          ['Default', function () { return h(PS.TextLink, { tone: 'default', state: 'default', label: 'No longer have access to old number?' }); }],
          ['Pressed', function () { return h(PS.TextLink, { tone: 'default', state: 'pressed', label: 'See all 6' }); }],
          ['Disabled', function () { return h(PS.TextLink, { tone: 'default', state: 'disabled', label: 'See all 6' }); }],
          ['On navy', function () { return onNavy(h(PS.TextLink, { tone: 'inverse', state: 'default', label: 'View details', icon: 'chevron-right' })); }],
          ['On navy · pressed', function () { return onNavy(h(PS.TextLink, { tone: 'inverse', state: 'pressed', label: 'View details' })); }]] },
      { name: 'Tag', desc: 'Figma 10988:272 (spec Tag.md). Accent = chosen / protected · Positive = paid / verified · Navy = in progress / needs the user · Neutral = inactive · Negative = overdue.', props: 'tone accent | positive | navy | neutral | negative · emphasis subtle | strong | outline · size medium | small · icon · label',
        states: [
          ['Under review', function () { return h(PS.Tag, { tone: 'navy', emphasis: 'subtle', label: 'Under review' }); }],
          ['Disbursing', function () { return h(PS.Tag, { tone: 'positive', emphasis: 'strong', label: 'Disbursing' }); }],
          ['Not approved', function () { return h(PS.Tag, { tone: 'neutral', emphasis: 'subtle', label: 'Not approved' }); }],
          ['Action needed', function () { return h(PS.Tag, { tone: 'navy', emphasis: 'strong', label: 'Action needed' }); }],
          ['Paid off', function () { return h(PS.Tag, { tone: 'positive', emphasis: 'subtle', icon: 'check', label: 'Paid off' }); }],
          ['Protected', function () { return h(PS.Tag, { tone: 'accent', emphasis: 'outline', icon: 'shield', label: 'Protected' }); }],
          ['Add', function () { return h(PS.Tag, { tone: 'neutral', emphasis: 'outline', label: 'Add' }); }],
          ['Verified', function () { return h(PS.Tag, { tone: 'positive', emphasis: 'subtle', icon: 'check', label: 'Verified' }); }],
          ['Recommend', function () { return h(PS.Tag, { tone: 'accent', emphasis: 'strong', size: 'small', label: 'Recommend' }); }],
          ['12 terms', function () { return h(PS.Tag, { tone: 'neutral', emphasis: 'subtle', size: 'small', label: '12 terms' }); }],
          ['Count', function () { return h(PS.Tag, { tone: 'navy', emphasis: 'strong', size: 'small', label: '1' }); }],
          ['Overdue', function () { return h(PS.Tag, { tone: 'negative', emphasis: 'strong', label: 'Overdue' }); }],
          ['Due in 3 days', function () { return h(PS.Tag, { tone: 'negative', emphasis: 'subtle', label: 'Due in 3 days' }); }],
          ['New limit', function () { return h(PS.Tag, { tone: 'navy', emphasis: 'outline', icon: 'arrow-up', label: 'New limit' }); }]] },
      { name: 'Chip', desc: 'Figma 10989:185 (spec Chip.md). A choice in a row (terms, presets, filters); selected = green, navy text and a tick.', props: 'size medium | small · state default | selected | pressed | disabled (app: selected, disabled) · label · onClick',
        states: [['3 terms', 'medium', 'default'], ['6 terms', 'medium', 'selected'], ['9 terms', 'medium', 'pressed'], ['12 terms', 'medium', 'disabled'],
          ['Unread (3)', 'small', 'selected'], ['All', 'small', 'default'], ['Repayment', 'small', 'default'], ['Promos', 'small', 'disabled']].map(function (s) {
            return [s[0] + ' · ' + s[2], function () { return h(PS.Chip, { size: s[1], state: s[2], label: s[0] }); }]; }) },
      { name: 'Check', desc: 'Figma 10989:254 (spec Check.md). The round mark, navy when on; the row around it is the tap target.', props: 'size medium | small · on · off (can\'t be picked)',
        states: [['medium'], ['medium', 1], ['medium', 0, 1], ['medium', 1, 1], ['small'], ['small', 1], ['small', 0, 1], ['small', 1, 1]].map(function (s) {
            return [s[0] + (s[1] ? ' · on' : '') + (s[2] ? ' · off' : ''), function () { return h(PS.Check, { size: s[0], on: !!s[1], off: !!s[2] }); }]; })
          .concat([['In an agreement row', function () { return h('div', { className: 'ps-agree' }, h(PS.Check, { size: 'medium', on: true }), h('span', { className: 'ps-text-body-md' }, 'I have read and agree to the Loan Agreement')); }]]) },
      { name: 'Tooltip', desc: 'Figma 10991:475 (spec Tooltip.md). Dark bubble on light backgrounds; white bubble (Tone=Light, Elevation/3, navy text) on navy surfaces, picked from what was tapped (BRIEF 21); the icon takes the text colour; arrow on the edge that points at what was tapped. Live placement: entry Tooltip · placement.', props: 'type simple | rich · arrow top-start | top | top-end | bottom-start | bottom | bottom-end | left | right | none · text · title · icon · close · onClose (app: open, anchor)',
        states: [
          ['Simple · top', function () { return h(PS.Tooltip, { inline: true, type: 'simple', arrow: 'top', text: 'Pay on or before the due date to avoid a late fee.' }); }],
          ['Simple · bottom-start', function () { return h(PS.Tooltip, { inline: true, type: 'simple', arrow: 'bottom-start', text: 'Your limit grows as you repay on time.' }); }],
          ['Rich · top-end', function () { return h(PS.Tooltip, { inline: true, type: 'rich', arrow: 'top-end', title: 'What is the service fee?', text: 'A one-time fee taken from the amount you receive. It is shown before you confirm.', close: true }); }],
          ['With icon · left', function () { return h(PS.Tooltip, { inline: true, type: 'simple', arrow: 'left', icon: 'copy', text: 'Tap to copy your reference number.', close: true }); }],
          ['Light · on navy', function () { return onNavy(h(PS.Tooltip, { inline: true, tone: 'light', type: 'simple', arrow: 'top-end', icon: 'clock', text: 'Temporary credit of ₱10,000 is valid until Nov 20, 2026.', close: true })); }],
          ['Light · glass over the hub card', function () { return h('div', { style: { position: 'relative', width: '20.5rem', height: '13rem' } }, h(PS.HubCard, { total: 50000, used: 40000, available: 10000, onWithdraw: noop, onInfo: noop }),
            h('div', { style: { position: 'absolute', right: 12, top: 40 } }, h(PS.Tooltip, { inline: true, tone: 'light', type: 'simple', arrow: 'top-end', icon: 'clock', width: 250, text: 'Your total credit limit is the most you can borrow at one time.', close: true }))); }],
          ['Light · rich on navy', function () { return onNavy(h(PS.Tooltip, { inline: true, tone: 'light', type: 'rich', arrow: 'top', title: 'Your credit limit', text: 'Used and available credit add up to your total limit.', close: true })); }]] },
      { name: 'Toast', desc: 'Figma 10991:524 (spec Toast.md). Dark notice under the header bar; never takes focus; 3–5 s; swipe left or × closes. Live stack: entry Toasts.', props: 'status success | error | info | neutral · text · action { label, onClick } · close · onClose',
        states: [
          ['Success', function () { return h(PS.ToastCard, { status: 'success', text: 'Bank account added.' }); }],
          ['Error · retry', function () { return h(PS.ToastCard, { status: 'error', text: 'Couldn’t send the code. Check your signal.', action: { label: 'Retry' } }); }],
          ['Info · close', function () { return h(PS.ToastCard, { status: 'info', text: 'Your application is being reviewed. We’ll notify you.', close: true }); }],
          ['Neutral', function () { return h(PS.ToastCard, { status: 'neutral', text: 'Your account has been deleted.' }); }],
          ['Destructive → Undo', function () { return h(PS.ToastCard, { status: 'neutral', text: 'Bank account removed.', action: { label: 'Undo' } }); }]] },
      { name: 'Field', desc: 'Figma 11009:437 (spec Field.md). Floating (56 px, label inside) or stacked (label above, 44 px box). Values Body/lg 16 px. Disabled: white box (BRIEF 15).', props: 'layout floating | stacked · label · value · onChange · placeholder · hint · error · prefix · icon · disabled · state (gallery) (kept: onClick picker, clear, menu, suggest, multiline …)',
        states: [
          ['Floating · default', function () { return h(PS.Field, { layout: 'floating', state: 'default', label: 'Account number', placeholder: 'Enter your account number' }); }],
          ['Floating · focus', function () { return h(PS.Field, { layout: 'floating', state: 'focus', label: 'Account number', placeholder: 'Enter your account number', value: '1234 5678 9012' }); }],
          ['Floating · filled', function () { return h(PS.Field, { layout: 'floating', state: 'filled', label: 'Account number', placeholder: 'Enter your account number', value: '1234 5678 9012' }); }],
          ['Floating · error', function () { return h(PS.Field, { layout: 'floating', state: 'error', label: 'Account number', placeholder: 'Enter your account number', value: '1234 56AB', error: 'Please enter numbers only' }); }],
          ['Floating · disabled', function () { return h(PS.Field, { layout: 'floating', state: 'disabled', label: 'Account number', placeholder: 'Enter your account number' }); }],
          ['Picker', function () { return h(PS.Field, { layout: 'floating', state: 'filled', label: 'Bank name', value: 'ABC Bank', icon: 'chevron-right' }); }],
          ['Stacked · default', function () { return h(PS.Field, { layout: 'stacked', state: 'default', label: 'Email address', placeholder: 'name@example.com' }); }],
          ['Stacked · focus', function () { return h(PS.Field, { layout: 'stacked', state: 'focus', label: 'Email address', value: 'juan.delacruz@gmail', clear: true, onChange: noop }); }],
          ['Stacked · error', function () { return h(PS.Field, { layout: 'stacked', state: 'error', label: 'Phone number', value: '99999', error: 'This field is required' }); }],
          ['Stacked · filled', function () { return h(PS.Field, { layout: 'stacked', state: 'filled', label: 'Birthday', value: '12 / 05 / 1994', icon: 'calendar' }); }]] },
      { name: 'PhoneField', desc: 'Figma 11018:830 (spec PhoneField.md). Only on Log in and Change phone number (owner). Country pill + number pill, digits 3-3-4. Disabled: white pills, flag 40 % (BRIEF 15).', props: 'value · onChange · error · label · placeholder · code · disabled · autoFocus · state (gallery)',
        states: [
          ['Default', function () { return h(PS.PhoneField, { state: 'default', value: '' }); }],
          ['Focus · typing', function () { return h(PS.PhoneField, { state: 'focus', value: '9171234567' }); }],
          ['Filled', function () { return h(PS.PhoneField, { state: 'filled', value: '9171234567' }); }],
          ['Error · empty', function () { return h(PS.PhoneField, { state: 'error', value: '', error: 'This field is required' }); }],
          ['Error · filled', function () { return h(PS.PhoneField, { state: 'error', value: '91712345A7', error: 'Please enter numbers only' }); }],
          ['Disabled', function () { return h(PS.PhoneField, { state: 'disabled', disabled: true }); }]] },
      { name: 'OtpBoxes', desc: 'Figma 11009:1031 (spec OtpBoxes.md). Six 48 × 60 boxes over one hidden numeric input (one-time-code).', props: 'value · onChange · length · error · disabled · autoFocus · focused (gallery)',
        states: [
          ['Empty', function () { return h(PS.OtpBoxes, { value: '', onChange: noop }); }],
          ['Typing', function () { return h(PS.OtpBoxes, { value: '482', focused: true, onChange: noop }); }],
          ['Filled', function () { return h(PS.OtpBoxes, { value: '482916', onChange: noop }); }],
          ['Error', function () { return h(PS.OtpBoxes, { value: '482916', error: true, onChange: noop }); }],
          ['Disabled', function () { return h(PS.OtpBoxes, { disabled: true, onChange: noop }); }]] },
      { name: 'Search', desc: 'Figma 11009:488 (spec Search.md). The glass pill in sheet headers and list pages.', props: 'value · onChange · placeholder · autoFocus · state (gallery)',
        states: [['default', ''], ['focus', 'Que'], ['filled', 'Quezon City']].map(function (s) {
          return [s[0], function () { return h(PS.Search, { state: s[0], value: s[1], placeholder: 'Search city or province', onChange: noop }); }]; }) },
      { name: 'SelectBar', desc: 'Figma 11009:954 (spec SelectBar.md). One option of a single-choice list; the whole row is the tap target; its radio is Check · small.', props: 'on · label · logo · note · plain · disabled · state (gallery) · onClick',
        states: [
          ['Card · selected', function () { return h(PS.SelectBar, { on: true, label: 'GCash', logo: 'pay-gcash' }); }],
          ['Card · note', function () { return h(PS.SelectBar, { label: 'PayMaya', logo: 'pay-maya', note: 'Supports ₱50k+ Loans' }); }],
          ['Card · pressed', function () { return h(PS.SelectBar, { state: 'pressed', label: 'Coins.ph', logo: 'pay-coins' }); }],
          ['Card · disabled', function () { return h(PS.SelectBar, { disabled: true, label: 'GrabPay', logo: 'pay-grabpay', note: 'Not available now' }); }],
          ['Plain · selected', function () { return h(PS.SelectBar, { plain: true, on: true, label: 'I found a better offer' }); }],
          ['Plain', function () { return h(PS.SelectBar, { plain: true, label: 'I no longer need a loan' }); }],
          ['Plain · disabled', function () { return h(PS.SelectBar, { plain: true, disabled: true, label: 'Other reason' }); }]] },
      { name: 'Segmented', desc: 'Figma 11011:646 (spec Segmented.md). 2–3 equal views; grey track, the chosen one a white thumb (decision 2 amended); the thumb glides.', props: 'items [{ id, label }] · value · onChange · id',
        states: [[['E-Wallet', 'Online bank'], 0], [['E-Wallet', 'Online bank'], 1], [['Bank', 'E-Wallet', 'Counter'], 1], [['E-Wallet', 'Online bank'], 0, true]].map(function (s, k) {
          return [s[0].join(' | ') + ' · ' + s[0][s[1]] + (s[2] ? ' · disabled' : ''), function () { return h(Toggle, { init: s[0][s[1]], render: function (v, set) {
            return h(PS.Segmented, { id: 'g-spec-seg' + k, value: v, onChange: set, disabled: !!s[2], items: s[0].map(function (l) { return { id: l, label: l }; }) }); } }); }]; }) },
      { name: 'LineTabs', desc: 'Figma 11011:717 (spec LineTabs.md). Tabs with a navy bar for steps or sections; a step not reached yet is off.', props: 'items [{ id, label, off }] · value · onChange · id',
        states: [[['Region', 'Province', 'City'], 'Region', ['Province', 'City']], [['Region', 'Province', 'City'], 'Province', ['City']], [['Region', 'Province', 'City'], 'City', []], [['Upcoming', 'History'], 'Upcoming', []]].map(function (s, k) {
          return [s[0].join(' › ') + ' · ' + s[1], function () { return h(Toggle, { init: s[1], render: function (v, set) {
            return h(PS.LineTabs, { id: 'g-spec-lt' + k, value: v, onChange: set, items: s[0].map(function (l) { return { id: l, label: l, off: s[2].indexOf(l) >= 0 }; }) }); } }); }]; }) },
      { name: 'ListItem', desc: 'Figma 11025:971 (spec ListItem.md). One row of a list in a card (help topics, contact, city results, ID types, banks). LinkList, BankList and the city picker use it.', props: 'tone default | brand · title · subtitle · icon | logo · tag { label, tone } · value · trail chevron-right | link | copy | none · divider · disabled · state (gallery) · onClick',
        states: [
          ['Help · brand', function () { return h(PS.List, null, h(PS.ListItem, { tone: 'brand', title: 'How do I repay my loan?' })); }],
          ['Help · brand · pressed', function () { return h(PS.List, null, h(PS.ListItem, { tone: 'brand', state: 'pressed', title: 'Sending money' })); }],
          ['Help · brand · last', function () { return h(PS.List, null, h(PS.ListItem, { tone: 'brand', title: 'Why was my application not approved?', divider: false })); }],
          ['Contact · hotline', function () { return h(PS.List, null, h(PS.ListItem, { title: 'Hotline', icon: 'phone', value: '(+632) 8299 3923', trail: 'none' })); }],
          ['Contact · email', function () { return h(PS.List, null, h(PS.ListItem, { title: 'Email', icon: 'email', value: 'support@perasure.ph', trail: 'none', divider: false })); }],
          ['City result', function () { return h(PS.List, null, h(PS.ListItem, { title: 'Angeles City', subtitle: 'Pampanga, Central Luzon', trail: 'none' })); }],
          ['City result · last', function () { return h(PS.List, null, h(PS.ListItem, { title: 'San Fernando City', subtitle: 'Pampanga, Central Luzon', trail: 'none', divider: false })); }],
          ['ID type · tag', function () { return h(PS.List, null, h(PS.ListItem, { title: 'UMID (Unified Multi-purpose ID)', tag: { label: 'Higher credit' } })); }],
          ['ID type · pressed', function () { return h(PS.List, null, h(PS.ListItem, { state: 'pressed', title: 'Driver’s License' })); }],
          ['ID type · disabled', function () { return h(PS.List, null, h(PS.ListItem, { disabled: true, title: 'Postal ID', divider: false })); }],
          ['Bank', function () { return h(PS.List, null, h(PS.ListItem, { logo: 'bdo', title: 'Bank de Oro Universal Bank' })); }],
          ['E-wallet · last', function () { return h(PS.List, null, h(PS.ListItem, { logo: 'gcash', title: 'GCash', divider: false })); }]] },
      { name: 'Installment', desc: 'Figma 11113:3535 (spec Installment.md; legacy 10541:36231). One repayment on Payment: date tile, amount, sub, the tick; a note and Detail.', props: 'status upcoming | due-today | overdue (old tone: brand | negative) · on · onToggle · month · day · amount · sub · note · noteIcon · onDetail',
        states: [
          ['Default', function () { return h(PS.Installment, { status: 'upcoming', on: true, month: 'JAN', day: '15', amount: 2000, sub: 'Due in 2 days', note: 'Loan from Dec 31, 2026', noteIcon: 'order', onToggle: noop, onDetail: noop }); }],
          ['Due today', function () { return h(PS.Installment, { status: 'due-today', on: true, month: 'JAN', day: '15', amount: 2000, sub: 'Due today', note: 'No penalty for 3 days after the due date', noteIcon: 'order', onToggle: noop, onDetail: noop }); }],
          ['Overdue 3 days', function () { return h(PS.Installment, { status: 'overdue', on: true, month: 'JAN', day: '15', amount: 2000, sub: 'Overdue 3 days', note: 'Pay by 11:59 PM today to avoid a ₱50.00 penalty', noteIcon: 'info', onToggle: noop, onDetail: noop }); }],
          ['Overdue over 3 days', function () { return h(PS.Installment, { status: 'overdue', on: true, month: 'JAN', day: '15', amount: 2000, sub: 'Overdue 18 days', note: 'Includes ₱50.00 penalty', noteIcon: 'info', onToggle: noop, onDetail: noop }); }]] },
      { name: 'InstallmentCard', desc: 'Figma 11114:3620 (spec InstallmentCard.md; legacy 5597:6135). One loan’s installments: due date and days tag, a white row per installment.', props: 'due · badge · badgeTone (negative: Overdue) · items [{ id, amount, date, on }] · onToggle · onOpen',
        states: [
          ['One', function () { return h(PS.InstallmentCard, { due: 'July 5, 2026', badge: 'Due in 45 days', items: [{ id: 'a', amount: 2000, date: 'Jul 5, 2026', on: true }], onOpen: noop }); }],
          ['Two', function () { return h(PS.InstallmentCard, { due: 'July 5, 2026', badge: 'Due in 45 days', items: [{ id: 'a', amount: 2000, date: 'Jul 5, 2026', on: true }, { id: 'b', amount: 2000, date: 'Jul 5, 2026', on: true }], onOpen: noop }); }],
          ['Overdue (short link)', function () { return h(PS.InstallmentCard, { due: 'July 5, 2026', badge: 'Overdue', badgeTone: 'negative', items: [{ id: 'a', amount: 2000, date: 'Jul 5, 2026', on: true }], onOpen: noop, onToggle: noop }); }]] },
      { name: 'KV', desc: 'Figma 11028:1193 (spec KV.md). A label and its value; inline or stacked; Rows puts a divider under each but the last.', props: 'layout inline | stacked · tone default | positive | negative · label · value · onInfo · divider (kept: bare)',
        states: [
          ['Inline · loan date', function () { return kvCard(h(PS.KV, { layout: 'inline', label: 'Loan date', value: 'July 5, 2026', divider: true })); }],
          ['Inline · amount', function () { return kvCard(h(PS.KV, { layout: 'inline', label: 'Amount received', value: '₱9,500.00', divider: true })); }],
          ['Inline · positive', function () { return kvCard(h(PS.KV, { layout: 'inline', tone: 'positive', label: 'Coupon discount', value: '−₱200.00', divider: true })); }],
          ['Inline · negative · info', function () { return kvCard(h(PS.KV, { layout: 'inline', tone: 'negative', label: 'Penalty', value: '₱50.00', onInfo: noop })); }],
          ['Stacked · SEC', function () { return kvCard(h(PS.KV, { layout: 'stacked', label: 'SEC registration number', value: '2020100002616-03', divider: true })); }],
          ['Stacked · certificate', function () { return kvCard(h(PS.KV, { layout: 'stacked', label: 'Certificate of authority', value: 'No. 3187' })); }]] },
      { name: 'TopBar', desc: 'Figma 11036:1355 (spec TopBar.md). The 116 px header: back + title (+ action), brand, pill, or search. Solid on secondary pages; clear on tabs (the veil comes in on scroll).', props: 'left · title · right · solid · extra (PS.Back / PS.Glass / PS.Close / PS.Brand / PS.Search)',
        states: [
          ['Back + title · solid', function () { return topFrame(h(PS.TopBar, { solid: true, left: h(PS.Back, { onClick: noop }), title: 'Loan details' })); }],
          ['Back + title + action · solid', function () { return topFrame(h(PS.TopBar, { solid: true, left: h(PS.Back, { onClick: noop }), title: 'Credit limit profile', right: h(PS.Glass, { icon: 'share', label: 'Share', onClick: noop }) })); }],
          ['Brand · clear', function () { return topFrame(h(PS.TopBar, { left: h(PS.Brand), right: [h(PS.Glass, { key: 'i', icon: 'bell', label: 'Inbox', onClick: noop }), h(PS.Glass, { key: 'h', icon: 'headset', label: 'Contact us', onClick: noop })] })); }],   /* phase 1: Inbox + Headset (legacy 3416:1149) */
          ['Pill · clear', function () { return topFrame(h(PS.TopBar, { left: h(PS.Glass, { round: false, onClick: noop }, 'Permissions we need') })); }],
          ['Search · solid', function () { return topFrame(h(PS.TopBar, { solid: true, search: h(PS.Search, { state: 'default', placeholder: 'Search city or province', onChange: noop }), right: h(PS.Close, { onClick: noop }) }), 124); }]] },
      { name: 'Navigator', desc: 'Figma 11037:1403 (spec Navigator.md). The tab bar of Home / Payment / Account; the active pill glides.', props: 'tabs [{ id, label, icon }] · value · onChange · id',
        states: ['home', 'payment', 'account'].map(function (v) { return [v, function () { return frame(110, h(PS.Navigator, { id: 'g-spec-nav-' + v, value: v, onChange: noop,
          tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] })); }]; }) },
      { name: 'Sheet', desc: 'Figma 11038:1448 (spec Sheet.md). Every sheet sits on the navy gradient scrim with Elevation/2, page sheets too (BRIEF 19); a fixed header sits 12 above the content and its shadow fades in with the scroll. Live: entry Sheet · live.', props: 'open · kind plain | card | page · onClose · label · scrim · children (SheetTitle / SheetHead, content, a Primary button)',
        states: [['Plain on the scrim', function () { return sheetStatic('plain'); }], ['Card on the scrim', function () { return sheetStatic('card'); }], ['Page on the scrim', function () { return sheetStatic('page'); }], ['Page · header at rest', function () { return h(SheetScroll, { scrolled: false }); }], ['Page · header scrolled', function () { return h(SheetScroll, { scrolled: true }); }]] },
      { name: 'Popover', desc: 'Figma 11039:1543 (spec Popover.md). A glass card from the tap point, on the navy scrim with Elevation/2 (BRIEF 19; not the suggestions under a field while typing): a menu (200 wide) or content (296).', props: 'open · anchor · options · value · onPick · onClose · block · children (content) · inline (gallery)',
        states: [
          ['Menu under a field', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, h(PS.Field, { layout: 'stacked', state: 'focus', label: 'Region', value: 'Calabarzon', icon: 'chevron-right' }),
            h(PS.Popover, { inline: true, options: ['NCR', 'Calabarzon', 'Central Luzon', 'Western Visayas'], value: 'Calabarzon' })); }],
          ['Content · schedule details', function () { return h(PS.Popover, { inline: true },
            h('div', { className: 'ps-pophead' }, h('div', null, h('span', { className: 'ps-text-label-md' }, 'Schedule 1'), h('span', { className: 'ps-text-caption-sm ps-c-tertiary' }, 'May 24, 2026')),
              h('div', null, h('span', { className: 'ps-text-amount-xs' }, '₱2,400.00'), h('span', { className: 'ps-text-body-sm ps-c-tertiary' }, 'Total payment'))),
            h(PS.Rows, { layout: 'inline', rows: [{ label: 'Principal', value: '₱2,000.00' }, { label: 'Interest', value: '₱250.00' }, { label: 'Service fee', value: '₱150.00' }] })); }],
          ['Menu on the scrim', function () { return frame(360, [h('div', { key: 'f', style: { position: 'absolute', left: 16, right: 16, top: 24 } }, h(PS.Field, { layout: 'stacked', state: 'focus', label: 'Region', value: 'Calabarzon', icon: 'chevron-right' })),
            h(PS.Scrim, { key: 's' }), h('div', { key: 'm', style: { position: 'absolute', left: 16, right: 16, top: 100 } }, h(PS.Popover, { inline: true, options: ['NCR', 'Calabarzon', 'Central Luzon', 'Western Visayas'], value: 'Calabarzon' }))]); }]] },
      { name: 'CreditCard', desc: 'Figma 11093:2768 (spec CreditCard.md; legacy 10926:30158 / 10926:29644 / 9867:36981 / 9867:37346). The available amount: flat navy, padding 12, Withdraw = Button Medium with the 16 px label (46).', props: 'available · total · temporary · temporaryUntil · layout (compact: the ring) · onWithdraw · onInfo',
        states: [['Off', function () { return h(PS.CreditCard, { available: 40000, total: 50000, onWithdraw: noop, onInfo: noop }); }],
          ['On', function () { return h(PS.CreditCard, { available: 40000, total: 50000, temporary: 10000, temporaryUntil: 'Nov 20', onWithdraw: noop, onInfo: noop }); }],
          ['User home', function () { return h(PS.CreditCard, { layout: 'user', available: 40000, total: 50000, onWithdraw: noop, onInfo: noop }); }],
          ['User home compact', function () { return h(PS.CreditCard, { layout: 'compact', available: 40000, total: 50000, onWithdraw: noop, onInfo: noop }); }]] },
      { name: 'PaymentCard', desc: 'Figma 11093:2765 (spec PaymentCard.md; legacy 5998:19294 · 10545:40950 · 10545:40952 · 10545:41016 · 10789:29251). The next repayment.', props: 'amount · was · due · badge · badgeTone · caption · overdue · notice { title, body, tone, onHelp } · payLabel · onPay · title',
        states: [['Upcoming', function () { return h(PS.PaymentCard, { title: 'Upcoming payment', caption: '1st installment', amount: 5000.35, was: 5000.35, due: 'Oct 24, 2026', payLabel: 'Repay', onPay: noop }); }],
          ['Due', function () { return h(PS.PaymentCard, { amount: 800, was: 800, due: 'Oct 24, 2026', badge: 'Overdue · 1 days', overdue: true, payLabel: 'Pay ₱800 now', onPay: noop, notice: { tone: 'neutral', title: 'Pay now to avoid extra charges', body: 'A 5% penalty applies from Oct 28 if unpaid', onHelp: noop } }); }],
          ['Overdue', function () { return h(PS.PaymentCard, { amount: 800, was: 800, due: 'Oct 24, 2026', badge: 'Overdue · 3 days', overdue: true, payLabel: 'Pay ₱800 now', onPay: noop, notice: { title: 'Last day to pay without a penalty', body: 'Pay by 11:59 PM today to avoid a ₱50.00 penalty on Jan 19.', onHelp: noop } }); }],
          ['Overdue coupon', function () { return h(PS.PaymentCard, { amount: 800, was: 800, due: 'Oct 24, 2026', badge: 'Overdue · 4 days', overdue: true, payLabel: 'Pay ₱800 now', onPay: noop, notice: { title: 'Includes a ₱50.00 penalty', body: 'We added it on Jan 19. Pay now to avoid another penalty.', onHelp: noop } }); }],
          ['Next', function () { return h(PS.PaymentCard, { amount: 800, was: 800, due: 'Oct 24, 2026', badge: 'Due in 45 days', badgeTone: 'positive', payLabel: 'Pay ₱800 now', onPay: noop }); }]] },
      { name: 'InboxItem', desc: 'Figma 11043:1798 (spec InboxItem.md). Calm and useful: title = the fact, body = the next step; overdue = only the fact in red.', props: 'kind · time · unread · tone default | overdue · title · body · action · onOpen',
        states: [
          ['Unread', function () { return h(PS.InboxItem, { kind: 'Loan', time: '21h ago', unread: true, title: '₱3,000.00 sent to your GCash', body: 'It should arrive within a few minutes. Your first payment is due on Jan 15.', action: 'View details', onOpen: noop }); }],
          ['Read', function () { return h(PS.InboxItem, { kind: 'Loan', time: 'Nov 2', title: '₱3,000.00 sent to your GCash', body: 'It should arrive within a few minutes. Your first payment is due on Jan 15.', action: 'View details', onOpen: noop }); }],
          ['Overdue · unread', function () { return h(PS.InboxItem, { tone: 'overdue', kind: 'Repayment', time: '2h ago', unread: true, title: '₱2,050.00 was due on Dec 28', body: 'Pay today to keep your credit limit. Need more time? Chat with us and we’ll help.', action: 'Pay now', onOpen: noop }); }],
          ['Overdue · read', function () { return h(PS.InboxItem, { tone: 'overdue', kind: 'Repayment', time: 'Yesterday', title: '₱2,050.00 was due on Dec 28', body: 'Pay today to keep your credit limit. Need more time? Chat with us and we’ll help.', action: 'Pay now', onOpen: noop }); }]] },
      { name: 'StateCard', desc: 'Figma 11098:2828 (spec StateCard.md; legacy Application state 12 cards). The navy home card for an application or account state.', props: 'icon · title · body · support { text, onClick } · timer { label, value } · button { label, tone, onClick }',
        states: [
          ['Hold', function () { return h(PS.StateCard, { title: 'Credit unlocking soon', body: 'To ensure account security and channel readiness, your ₱10,000 limit is temporarily paused for cash-out. It will be available for your next attempt on October 15, 2026.', support: { text: 'Have a question about the hold? Chat with support!', onClick: noop } }); }],
          ['Not approved', function () { return h(PS.StateCard, { title: 'Application wasn’t approved', body: 'We’re unable to assess your credit limit at this time. Please check back in * days to see your credit limit.', support: { text: 'Have a question about the result? Chat with support!', onClick: noop } }); }],
          ['Expired', function () { return h(PS.StateCard, { title: 'Credit limit expired', body: 'Your limit expired on September 20, 2026. Reapply to get a new one.', button: { label: 'Reapply now', onClick: noop } }); }],
          ['In progress', function () { return h(PS.StateCard, { icon: 'history', title: 'Application in progress', body: 'Your application has been submitted and is under review.' }); }],
          ['Documents', function () { return h(PS.StateCard, { title: 'Help us review your application', body: 'Add documents that show your job or income. Clear, complete documents may improve your chances of approval.', timer: { label: 'Time remaining', value: '47h 57m 10s' }, button: { label: 'Add documents', tone: 'white', onClick: noop } }); }]] },
      { name: 'EmptyState', desc: 'Figma 11044:1917 (spec EmptyState.md). Nothing here yet; the illustration is unchanged (the Empty box animation).', props: 'title · body · children (a button) · page · art',
        states: [['Text only', function () { return h(PS.EmptyState, { title: 'No messages yet', body: 'We’ll let you know here when something needs you.' }); }],
          ['With a button', function () { return h(PS.EmptyState, { title: 'No loans yet', body: 'Your loans will show here once you apply.' }, h(PS.Button, { label: 'Apply for a loan', onClick: noop })); }]] },
      { name: 'UploadTile', desc: 'Figma 11044:2020 (spec UploadTile.md). A picture slot (ID sides) or a document row.', props: 'type picture | file · state empty | loading | done | error · uploaded | uploading | compressing | failed · label · name · fileType · size · progress · onClick · onRemove · onRetry',
        states: [
          ['Picture · empty', function () { return tile(h(PS.UploadTile, { state: 'empty', art: 'id-front', label: 'Front of ID' })); }],
          ['Picture · loading', function () { return tile(h(PS.UploadTile, { state: 'loading', art: 'id-back', label: 'Back of ID' })); }],
          ['Picture · done', function () { return tile(h(PS.UploadTile, { state: 'done', art: 'id-front', label: 'Front of ID' })); }],
          ['Picture · error', function () { return tile(h(PS.UploadTile, { state: 'error', art: 'id-back', label: 'Back of ID' })); }],
          ['File · uploaded', function () { return h(PS.UploadTile, { type: 'file', state: 'uploaded', name: 'SSS_Contributions_2026.pdf', fileType: 'PDF', size: 1153434 }); }],
          ['File · uploading', function () { return h(PS.UploadTile, { type: 'file', state: 'uploading', name: 'Payslip_scan_Sept_2026.jpg', fileType: 'JPG', size: 2516582, progress: 0.62 }); }],
          ['File · compressing', function () { return h(PS.UploadTile, { type: 'file', state: 'compressing', name: 'Payslip_scan_Sept_2026.jpeg', fileType: 'JPEG', size: 2516582 }); }],
          ['File · failed', function () { return h(PS.UploadTile, { type: 'file', state: 'failed', name: 'SSS_Contributions_2026_page2.png', fileType: 'PNG', size: 900000 }); }],
          ['File · empty', function () { return h(PS.UploadTile, { type: 'file', state: 'empty', count: 0, hint: 'Upload payslips, bank statements or other proof of income', onClick: noop }); }],
          ['File · add more', function () { return h(PS.UploadTile, { type: 'file', state: 'more', count: 2, onClick: noop }); }]] },
      { name: 'CouponTicket', desc: 'Figma 11046:2168 (spec CouponTicket.md). A coupon in the coupon centre and the picker; selected = the navy bar, nothing moves.', props: 'action use | pick · state default | selected | used | expired | unavailable · value · label · rule · best · meta / expiresAt · reason · onUse · onPick',
        states: [
          ['Use', function () { return h(PS.CouponTicket, { action: 'use', value: '25% OFF', label: 'First-payment interest', rule: 'For loans of ₱5,000 and up', meta: 'Valid until Nov 30, 2026', best: true }); }],
          ['Pick', function () { return h(PS.CouponTicket, { action: 'pick', value: '₱300 OFF', label: 'Service fee', rule: 'Any amount · 3 / 6 terms', meta: 'Valid until Dec 15, 2026' }); }],
          ['Selected', function () { return h(PS.CouponTicket, { action: 'pick', state: 'selected', value: '25% OFF', label: 'First-payment interest', rule: 'For loans of ₱5,000 and up', meta: 'Valid until Nov 30, 2026', best: true }); }],
          ['Used', function () { return h(PS.CouponTicket, { state: 'used', value: '10% OFF', label: 'Interest', rule: 'Any amount', meta: 'Used on Oct 2, 2026' }); }],
          ['Expired', function () { return h(PS.CouponTicket, { state: 'expired', value: '₱200 OFF', label: 'Service fee', rule: 'Any amount', meta: 'Expired on Sep 30, 2026' }); }],
          ['Unavailable', function () { return h(PS.CouponTicket, { action: 'pick', state: 'unavailable', value: '₱1,000 OFF', label: 'Credit limit', rule: 'For loans of ₱5,000 and up', reason: 'Your loan amount is below ₱5,000' }); }]] },
      { name: 'HomeCoupons', desc: 'Figma 11046:2287 (spec HomeCoupons.md). "Coupons for your next loan" on home — the one gradient exception (green coupon gradient).', props: 'layout pair | one (auto) · title · coupons [{ value, until, kind, label, cond, type }] · onOpen',
        states: [['Pair', function () { return h('div', { style: { paddingTop: 8 } }, h(PS.HomeCoupons, { layout: 'pair', onOpen: noop, coupons: [{ type: 'percent', value: '50% OFF', until: 'Until Nov 11, 2026' }, { type: 'amount', value: '₱500 OFF', until: 'Until Nov 30, 2026' }] })); }],
          ['One', function () { return h('div', { style: { paddingTop: 56 } }, h(PS.HomeCoupons, { layout: 'one', onOpen: noop, coupons: [{ type: 'limit', value: '₱500 OFF', kind: 'Credit limit', label: 'Borrow more than ₱20,000', cond: 'Any term' }] })); }]] },
      { name: 'Scrim', desc: 'Figma 11021:822 (spec Scrim.md). The layer behind a sheet: a navy gradient, clear at the top (the native nav bar can\'t be dimmed); flat only for full-screen dialogs on tab pages. No blur.', props: 'type gradient | flat · onClick',
        states: [['Gradient — sheet on a secondary page', function () { return scrimDemo('gradient'); }], ['Flat — dialog on a tab page', function () { return scrimDemo('flat'); }]] },
      /* ---- phase 1 (2026-11-19): components figma-lib translated from legacy (log/figma.md 09–10) ---- */
      { name: 'Keypad', desc: 'Figma 11095:2874 (spec Keypad.md; legacy 9426:18088). The amount keypad, 3 × 4 keys, gaps 8.', props: 'onKey · extra · cascade',
        states: [['Default', function () { return h('div', { style: { width: '19.5rem' } }, h(PS.Keypad, { onKey: noop })); }]] },
      { name: '_KeypadKey', desc: 'Figma 11102:3057 (spec _KeypadKey.md; legacy 8933:31540). One key, 99 × 52 in the grid.', props: 'k · onKey',
        states: [['Digit', function () { return h('div', { style: { display: 'grid', width: '6.1875rem' } }, h(PS.KeypadKey, { k: '1', onKey: noop })); }],
          ['Delete', function () { return h('div', { style: { display: 'grid', width: '6.1875rem' } }, h(PS.KeypadKey, { k: 'del', onKey: noop })); }]] },
      { name: 'ScamStrip', desc: 'Figma 11113:3512 (spec ScamStrip.md; legacy 10534:35617). The scam warning line at the top of Payment.', props: 'children · onClick',
        states: [['Default', function () { return h(PS.ScamStrip, { onClick: noop }, 'Beware of scams. Contact in-app customer service to verify transaction requests from outside the app.'); }]] },
      { name: 'ScamTips', desc: 'Figma 11113:3516 (spec ScamTips.md; legacy 8988:18005 · 8995:18537 · 8995:18814). "Protect yourself from scams" in a card sheet.', props: 'cards · index · onIndex · onNext · onClose',
        states: [0, 1, 2].map(function (i) { return [String(i + 1), function () { return h('div', { className: 'ps-sheet ps-sheet--card ps-scams', style: { position: 'relative', left: 0, right: 0, bottom: 0 } }, h(PS.ScamTips, { cards: SCAMS, index: i, onIndex: noop, onNext: noop, onClose: noop })); }]; }) },
      { name: 'RepayCard', desc: 'Figma 11114:3890 (spec RepayCard.md; legacy 5922:10053 · 5925:9476 · 5925:9554). What to pay and how: transfer rows, the app button, or the QR.', props: 'amount · due · onCopy · children',
        states: [['Transfer', function () { return h(PS.Section, { label: 'TOTAL REPAYMENT' }, h(PS.RepayCard, { amount: 2000, due: 'December 12, 2026', onCopy: noop }, h(PS.InsetRows, { rows: [{ label: 'Payment No.', value: 'PH0000351234567' }, { label: 'Sender’s name', value: 'Sam Ge' }] }))); }],
          ['App', function () { return h(PS.Section, { label: 'TOTAL REPAYMENT' }, h(PS.RepayCard, { amount: 2000, due: 'December 12, 2026', onCopy: noop }, h(PS.Button, { block: true, onClick: noop }, 'Open Gcash'), h(PS.PayTimer, null))); }],
          ['QR', function () { return h(PS.Section, { label: 'TOTAL REPAYMENT' }, h(PS.RepayCard, { amount: 2000, due: 'December 12, 2026', onCopy: noop },
            h('p', { className: 'ps-text-body-sm ps-repay__note' }, 'Refresh the page to get the new number when the last one has expired.'), h(PS.QrPanel, { merchant: 'Payso', onSave: noop }), h(PS.PayTimer, null))); }]] },
      { name: 'PayBar', desc: 'Figma 11113:3520 (spec PayBar.md; legacy 5610:6009). The total with Repay, above the tab bar.', props: 'label · total · was · action · onPay · disabled',
        states: [['Default', function () { return h(PS.PayBar, { total: 2000, was: 2000, onPay: noop }); }]] },
      { name: 'PayDock', desc: 'Figma 11114:3886 (spec PayDock.md; legacy 5610:6037). The frosted panel at the bottom of Payment: PayBar + Navigator.', props: 'children',
        states: [['Default', function () { return frame(170, [h(PS.PayDock, { key: 'd' }, h(PS.PayBar, { total: 2000, was: 2000, onPay: noop })), h(PS.Navigator, { key: 'n', id: 'g-paydock-nav', value: 'payment', onChange: noop,
          tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] })]); }]] },
      { name: 'QrPanel', desc: 'Figma 11113:3539 (spec QrPanel.md; legacy 5925:9634). The navy panel with the QR, merchant and Save QR Code.', props: 'title · merchant · onSave',
        states: [['Default', function () { return h('div', { style: { width: '18.5rem' } }, h(PS.QrPanel, { merchant: 'Payso', onSave: noop })); }]] },
      { name: 'PayTimer', desc: 'Figma 11113:3544 (spec PayTimer.md; legacy 7189:22669). "Please complete your repayment in 04:59."', props: 'seconds',
        states: [['Default', function () { return h(PS.PayTimer, { seconds: 299 }); }]] },
      { name: 'BankList', desc: 'Figma 11114:3891 (spec BankList.md; legacy 5803:14368). Banks grouped by first letter, each group a card.', props: 'groups [{ title, items [{ id, name, logo }] }] · onPick',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.BankList, { onPick: noop, groups: [
          { title: 'A', items: [{ id: 'aub', name: 'Asia United Bank', logo: PS.asset('logos/pay-aub.png') }] },
          { title: 'B', items: [{ id: 'bdo', name: 'Bank de Oro Universal Bank', logo: PS.asset('logos/pay-bdo.png') }, { id: 'banko', name: 'BPI Globe BanKO', logo: PS.asset('logos/pay-bpi-banko.png') }, { id: 'bm', name: 'Bangko Mabuhay', logo: PS.asset('logos/pay-bangko-mabuhay.png') }, { id: 'bm2', name: 'Bangko Mabuhay', logo: PS.asset('logos/pay-bangko-mabuhay.png') }] }] })); }]] },
      { name: '_BankRow', desc: 'Figma 11113:3530 (spec _BankRow.md; legacy 5803:14662). One bank: logo 24 + name; Bottom = the last row (no line).', props: 'logo · name · state default | focus · onClick',
        states: [['Default', 'default', true], ['Focus', 'focus', true], ['Bottom', 'default', false], ['Focus bottom', 'focus', false], ['Search hit (BRIEF 31)', 'default', false, 'oro']].map(function (s) { return [s[0], function () {
          return h('div', { className: 'ps-card ps-banks', style: { width: '18.5rem', padding: 0, background: 'none', boxShadow: 'none' } }, h(PS.BankRow, { state: s[1], name: 'Bank de Oro Universal Bank', q: s[3], logo: PS.asset('logos/pay-bdo.png'), onClick: noop }), s[2] ? h(PS.Divider) : null); }]; }) },
      { name: 'Accordion', desc: 'Figma 11113:3523 (spec Accordion.md; legacy 5922:10152). A card that opens ("Repayment example (GCash)").', props: 'title · open · small · icon · children',
        states: [['Off', function () { return h(PS.Accordion, { title: 'Repayment example (GCash)' }, ACC); }], ['On', function () { return h(PS.Accordion, { title: 'Repayment example (GCash)', open: true }, ACC); }]] },
      { name: 'OrderDetails', desc: 'Figma 11113:3536 (spec OrderDetails.md; legacy 9137:26604). "ORDER DETAILS" with the rows and the plan link.', props: 'rows [{ label, value, tone }] · link · onLink',
        states: [['Default', function () { return h(PS.OrderDetails, { link: 'View payment schedule', onLink: noop, rows: [{ label: 'Daily fee', value: '₱11.00' }, { label: 'First payment date', value: 'Jun 19, 2026' }, { label: 'Per Installment', value: '₱1,560.00' }, { label: 'Total payment', value: '₱41,000.00' }] }); }]] },
      { name: 'ProtectionCard', desc: 'Figma 11113:3537 (spec ProtectionCard.md; legacy 9137:26629). Borrower protection with the Protected tag and See benefits.', props: 'title · tag · body · link · onLink',
        states: [['Default', function () { return h(PS.ProtectionCard, { body: 'Get full coverage up to ₱30,000. Protect your family from loan burdens in case of medical emergencies or unexpected accidents.', onLink: noop }); }]] },
      { name: 'MethodCard', desc: 'Figma 11113:3538 (spec MethodCard.md; legacy 9137:26650). "WITHDRAWAL METHOD" with the bank and last 4.', props: 'name · last4 · logo · onClick',
        states: [['Default', function () { return h(PS.MethodCard, { name: 'Bank of the Philippins Islands', last4: '4567', logo: 'pay-bpi', logoExt: 'png', onClick: noop }); }]] },
      { name: 'Strip', desc: 'Figma 11093:2760 (spec Strip.md; legacy 6619:21799). A one-line card on home that opens something.', props: 'title · sub · count · icon · onClick (kept: text, chevron, raised, lg)',
        states: [['Default', function () { return h(PS.Strip, { icon: 'info', title: 'You have updates on your loan', sub: 'Tap to view the latest status', count: 1, onClick: noop }); }]] },
      { name: 'Banners', desc: 'Figma 11098:2917 (spec Banners.md; legacy 10789:29273). "More from PeraSure": cards that scroll sideways.', props: 'items [{ id, title, body, onClick }]',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, h(PS.DotTitle, null, 'More from PeraSure'), h(PS.Banners, { items: [{ id: 'b1', title: 'Invite a friend', body: 'You both get a coupon when they take their first loan.', onClick: noop }, { id: 'b2', title: 'Pay early, save more', body: 'See how early payments lower your interest.', onClick: noop }] })); }]] },
      { name: 'TrustCard', desc: 'Figma 11098:2978 (spec TrustCard.md; legacy 10789:29281). "A trusted choice · Made for Filipinos", the badges and partner logos.', props: 'kicker · title',
        states: [['Default', function () { return h(PS.TrustCard); }]] },
      { name: 'MethodPicker', desc: 'Figma 11113:3543 (spec MethodPicker.md; legacy 6062:14935). One group of payment methods (PS.MethodGroup; the whole picker = MethodTabs + groups).', props: 'title · tag · items [{ id, name }] · onPick',
        states: [['Off', function () { return h('div', { style: { width: '12.8125rem' } }, h(PS.MethodGroup, { title: 'Direct App Pay', tag: 'Recommend', items: [{ id: 'a', name: 'GCash' }], onPick: noop })); }],
          ['On', function () { return h('div', { style: { width: '12.8125rem' } }, h(PS.MethodGroup, { title: 'Direct App Pay', tag: 'Recommend', items: [{ id: 'a', name: 'GCash' }, { id: 'b', name: 'GCash' }, { id: 'c', name: 'GCash' }], onPick: noop })); }]] },
      { name: '_MethodTabs', desc: 'Figma 11113:3540 (spec _MethodTabs.md; legacy 6062:18978). The method types column of the picker.', props: 'cats [{ id, icon, label }] · value · onPick',
        states: [['Default', function () { return h('div', { style: { height: '33rem', '--ph': '664px' } }, h(PS.MethodTabs, { value: 'qr', onPick: noop, cats: [{ id: 'qr', icon: 'qr-code', label: 'QR Code' }, { id: 'bill', icon: 'receipt', label: 'Bill Payment' }, { id: 'online', icon: 'smartphone', label: 'Online Transfer' }, { id: 'bank', icon: 'bank', label: 'Bank Transfer' }, { id: 'offline', icon: 'store', label: 'Offline Payment' }] })); }]] },
      { name: 'OtpStatus', desc: 'Figma 11113:3519 (spec OtpStatus.md; legacy 8742:30760). The error under the code boxes.', props: 'children',
        states: [['No connection', function () { return h('div', { style: { width: '19.5rem' } }, h(PS.OtpStatus, null, 'We couldn’t send your code. Check your connection and try again.')); }],
          ['Incorrect', function () { return h('div', { style: { width: '19.5rem' } }, h(PS.OtpStatus, null, 'Incorrect code. Please try again.')); }]] },,
      /* ---- phase 1, part 2 (2026-11-20): the remaining specs (log/figma.md 09) ---- */
      { name: 'AmountCard', desc: 'Figma (spec AmountCard.md; legacy 10926:29643). Disbursement amount, the slider, the loan term and the term chips (Small).', props: 'amount · min · max · step · boost · terms · term · termNote · onTerm · onEdit',
        states: [['Default', function () { return h(PS.AmountCard, { amount: 45000, min: 500, max: 45000, step: 500, terms: [3, 6, 8], term: 6, termNote: '15 days / term', onTerm: noop, onAmount: noop, onCommit: noop, onEdit: noop }); }],
          ['Coupon boost', function () { return h(PS.AmountCard, { amount: 45000, min: 500, max: 50000, step: 500, boost: true, terms: [3, 6, 8], term: 6, termNote: '15 days / term', onTerm: noop, onAmount: noop, onCommit: noop, onEdit: noop }); }]] },
      { name: 'AmountEntry', desc: 'Figma (spec AmountEntry.md; legacy 9426:18067). The typed amount on the keypad page: 312 wide, no card.', props: 'typed · amount · hint · error · terms · term · onTerm · onKey',
        states: [['Empty', function () { return h('div', { style: { width: '19.5rem' } }, h(PS.AmountEntry, { part: 'top', typed: '', amount: 0, hint: 'Flexible amounts from ₱500–₱40,000', terms: [3, 6, 8], term: null, onTerm: noop, onKey: noop })); }],
          ['Typing', function () { return h('div', { style: { width: '19.5rem' } }, h(PS.AmountEntry, { part: 'top', typed: '12,5', amount: 12500, hint: 'Flexible amounts from ₱500–₱40,000', terms: [3, 6, 8], term: null, onTerm: noop, onKey: noop })); }],
          ['Error', function () { return h('div', { style: { width: '19.5rem' } }, h(PS.AmountEntry, { part: 'top', typed: '45,0', amount: 45000, error: 'Enter an amount from ₱500 to ₱40,000.', terms: [3, 6, 8], term: null, onTerm: noop, onKey: noop })); }]] },
      { name: 'OfferCard', desc: 'Figma (spec OfferCard.md; legacy 9447:27224). A partner offer when ours isn’t available.', props: 'logo · name · tag · label · value · rows · action · onClick',
        states: [['Default', function () { return h(PS.OfferCard, { logo: 'loadcash', name: 'LoadCash', tag: 'Best match', label: 'Max Amount', value: '₱50,000', rows: [{ label: 'Max term', value: '180 days' }], action: 'Apply now', onClick: noop }); }]] },
      { name: 'BottomBar', desc: 'Figma 11086:2672 (spec BottomBar.md; legacy 3420:1820 + 3420:1821). The bottom action area on its gradient.', props: 'children · secondary · note · consent',
        states: [['Two buttons', function () { return frame(150, h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: noop }, 'Agree & Authorize'), h(PS.Button, { variant: 'text', block: true, onClick: noop }, 'Reject'))); }],
          ['One button', function () { return frame(120, h(PS.BottomBar, null, h(PS.Button, { block: true, onClick: noop }, 'Agree & Authorize'))); }],
          ['Variant2', function () { return frame(120, h(PS.BottomBar, { secondary: true }, h(PS.Button, { block: true, onClick: noop }, 'Agree & Authorize'))); }],
          ['With terms', function () { return frame(150, h(PS.BottomBar, { consent: true }, h(PS.Consent, { on: false, onToggle: noop }, 'By typing confirm indicates you accept Loan Agreement and Ownbank Platform Service'), h(PS.Button, { block: true, onClick: noop }, 'Agree & Authorize'))); }]] },
      { name: 'Legal', desc: 'Figma 11098:3049 (spec Legal.md; legacy 10789:29423). The company lines at the bottom of home.', props: 'lines',
        states: [['Default', function () { return h(PS.Legal); }]] },
      { name: 'DotTitle', desc: 'Figma 11098:3130 (spec DotTitle.md; legacy 9447:27008). The small section title with the dot.', props: 'children',
        states: [['Default', function () { return h(PS.DotTitle, null, 'More from PeraSure'); }]] },
      { name: 'Notice', desc: 'Figma 11098:3131 (spec Notice.md; legacy 9614:33238). The support strip: icon tile, a two-line text, chevron (demo: PS.Strip with text).', props: 'icon · text · chevron · onClick (PS.Strip)',
        states: [['Default', function () { return h(PS.Strip, { icon: 'support-chat', text: 'Have a question about your application? Chat with support!', chevron: true, onClick: noop }); }]] },
      { name: 'PenaltyInfo', desc: 'Figma 11098:3132 (spec PenaltyInfo.md; legacy 10545:37532). How penalties work: the title and the rules (the big tooltip’s content).', props: 'title · rows [[when, what]] · note',
        states: [['Default', function () { return h('div', { style: { width: '18rem', padding: 16, borderRadius: 24, background: 'var(--surface-default)' } }, h(PS.PenaltyInfo, { rows: [['Due date', 'Pay by 11:59 PM to avoid a penalty.'], ['1–3 days late', 'No penalty: pay within 3 days after the due date.'], ['4+ days late', 'A ₱50.00 penalty is added, and another every 7 days.']] })); }]] },
      { name: 'PermissionCard', desc: 'Figma 11086:2666 (spec PermissionCard.md; legacy 3259:962). One permission and why we ask; On shows the reason.', props: 'icon · title · body · open',
        states: [['Off', function () { return h(PS.PermissionCard, { open: false, icon: 'camera', title: 'Camera', body: 'Used for facial verification, ID verification, and uploading ID photos.' }); }],
          ['On', function () { return h(PS.PermissionCard, { icon: 'camera', title: 'Camera', body: 'Used for facial verification, ID verification, and uploading ID photos.' }); }]] },
      { name: 'ContactMethod', desc: 'Figma 11086:2675 (spec ContactMethod.md; legacy 3422:2332). One way to get the code: a 54 ring and its label.', props: 'items · value · onChange (PS.ContactMethods)',
        states: [['Active', function () { return h('div', { style: { width: '5.125rem' } }, h(PS.ContactMethods, { items: [{ id: 'sms', icon: 'message', label: 'SMS' }], value: 'sms', onChange: noop })); }],
          ['Default', function () { return h('div', { style: { width: '5.125rem' } }, h(PS.ContactMethods, { items: [{ id: 'sms', icon: 'message', label: 'SMS' }], value: null, onChange: noop })); }]] },
      { name: 'ScheduleItem', desc: 'Figma 11095:2797 (spec ScheduleItem.md; legacy 5985:12587). One payment of the schedule: timeline dot and line, totals, the three rows.', props: 'items [{ title, date, total, rows [{ label, value, was }] }] (PS.RepaymentPlan)',
        states: [['Default', function () { return h('div', { style: { width: '18.5rem' } }, h(PS.RepaymentPlan, { className: 'ps-plan--bare', items: [{ title: 'Schedule 1', date: 'May 24, 2026', total: 88888, rows: [{ label: 'Principal', value: 800 }, { label: 'Interest', value: 800, was: 900 }, { label: 'Service fee', value: 800, was: 900 }] }] })); }]] },
      { name: 'SendingCard', desc: 'Figma (spec SendingCard.md; legacy 3282:181). The code is on its way: 292 wide, the Loading state OTP animation.', props: 'title · body',
        states: [['Default', function () { return h(PS.SendingCard, { title: 'Sending security code...', body: 'This may take a few seconds' }); }]] },
      { name: 'Slider', desc: 'Figma (spec Slider.md; legacy slider in 10926:29643). The amount slider: knob at min / mid / high / max, with and without a coupon boost.', props: 'value · min · max · step · boost · onChange · onCommit',
        states: [[500, 45000, false], [22750, 45000, false], [40500, 45000, false], [45000, 45000, false], [500, 50000, true], [25250, 50000, true], [45050, 50000, true], [50000, 50000, true]].map(function (s) {
          return [PS.money(s[0], 0) + ' of ' + PS.money(s[1], 0) + (s[2] ? ' · boost' : ''), function () { return h('div', { style: { width: '19.4375rem' } }, h(PS.Slider, { value: s[0], min: 500, max: s[1], step: 50, boost: s[2], onChange: noop, onCommit: noop })); }]; }) },
      /* ---- figma-lib 14: Account ---- */
      { name: 'Radio', desc: 'Figma 11156:5430 (spec Radio.md; legacy Check mar 5772:13600). One choice of a list: 16 (screens 14).', props: 'on · size (PS.Radio)',
        states: [['Off', function () { return h(PS.Radio, { size: 16 }); }], ['On', function () { return h(PS.Radio, { size: 16, on: true }); }]] },
      { name: 'VerifiedBadge', desc: 'Figma 11156:5431 (spec VerifiedBadge.md; legacy 3651:1460). The star with a tick beside a verified name (16).', props: '(PS.VerifiedBadge)',
        states: [['Default', function () { return h('div', { style: { width: '1rem', height: '1rem', display: 'flex' } }, h(PS.VerifiedBadge)); }]] },
      { name: 'ReasonRow', desc: 'Figma 11157:4367 (spec ReasonRow.md; legacy 6207:20239). One reason, its radio and the line under it: 36, last 20.', props: 'label · on · last · onClick (PS.ReasonRow)',
        states: [['Last off', function () { return h('div', { style: { width: '15.4375rem' } }, h(PS.ReasonRow, { label: 'Login issues', on: true, onClick: noop })); }],
          ['Last on', function () { return h('div', { style: { width: '15.4375rem' } }, h(PS.ReasonRow, { label: 'Login issues', on: true, last: true, onClick: noop })); }]] },
      { name: '_ReasonText', desc: 'Figma 11157:4370 (spec _ReasonText.md; legacy Feedback box 6217:22306). "Tell us more" with the 0/200 count: 296 × 166.', props: 'value · onChange · max (PS.ReasonText)',
        states: [['Empty', function () { return h('div', { style: { width: '18.5rem' } }, h(PS.ReasonText, { value: '' })); }],
          ['Filled', function () { return h('div', { style: { width: '18.5rem' } }, h(PS.ReasonText, { value: 'I found a loan with a lower interest rate somewhere else, and I don’t need this account any more. Thank you for the help over the past months — the app was easy to use, and repayments were always clear to me.' })); }]] },
      { name: '_ResendTimer', desc: 'Figma 11157:4373 (spec _ResendTimer.md; legacy Delete my account/otc 6213:21645). The resend line under code boxes.', props: 'left · onResend (PS.ResendTimer)',
        states: [['Ready', function () { return h(PS.ResendTimer, { left: 0, onResend: noop }); }], ['Counting', function () { return h(PS.ResendTimer, { left: 59 }); }]] },
      { name: 'LinkRow', desc: 'Figma 11157:4380 (spec LinkRow.md; legacy 6156:12996 · 6167:12859 · 6126:13417). One row of a link list: 36 / 20, plain 38 / 22.', props: 'kind contact | link | plain · label · icon · value · trail · tall · last · onClick (PS.LinkRow)',
        states: [['Contact', 'contact', false], ['Contact · last', 'contact', true], ['Link', 'link', false], ['Link · last', 'link', true], ['Plain', 'plain', false], ['Plain · last', 'plain', true]].map(function (st) {
          return [st[0], function () { return h('div', { style: { width: '18.5rem' } }, h(PS.LinkRow, st[1] === 'contact' ? { kind: 'contact', icon: 'phone', label: 'Hotline', value: '(+632) 82993923', last: st[2], onClick: noop }
            : { kind: st[1], label: 'Sending money', tall: st[1] === 'plain', last: st[2], onClick: noop })); }]; }) },
      { name: 'ActivityItem', desc: 'Figma 11157:4385 (spec ActivityItem.md; legacy Credit history card 3871:1173). One line of credit history: 112, verified 128.', props: 'icon · tone · title · sub · amount · up · date · note · noteValue',
        states: [['Repayment', function () { return h(PS.ActivityItem, { icon: 'money-in', tone: 'positive', title: 'Repayment Completed', sub: 'Available credit was restored', amount: '+ ₱5,000', up: true, date: 'Jun 24, 2026 , 06:10', note: 'Available:', noteValue: '₱5,000' }); }],
          ['Loan', function () { return h(PS.ActivityItem, { icon: 'money-out', title: 'Loan Approved', sub: '₱5,000 was used for this loan', amount: '- ₱5,000', date: 'Jun 24, 2026 , 06:10', note: 'Available:', noteValue: '₱5,000' }); }],
          ['Documents verified', function () { return h(PS.ActivityItem, { title: 'Documents Verified', sub: 'Submitted additional docs and reference contact to unlock next credit tier', amount: '+ ₱5,000', up: true, date: 'Jun 24, 2026 , 06:10', note: 'Total credit:', noteValue: '₱5,000' }); }],
          ['ID verified', function () { return h(PS.ActivityItem, { title: 'ID Verified Approved', sub: 'Passed standard government ID check and biometric face scan', amount: '+ ₱5,000', up: true, date: 'Jun 24, 2026 , 06:10', note: 'Total credit:', noteValue: '₱5,000' }); }]] },
      { name: 'HubCard', desc: 'Figma 11157:4389 (spec HubCard.md; legacy Credit limit primary card 10926:30008). Total credit limit, used / available with a ring, Withdraw: 328 × 138.', props: 'total · used · available · onWithdraw · onInfo',
        states: [['Default', function () { return h(PS.HubCard, { total: 50000, used: 40000, available: 10000, onWithdraw: noop, onInfo: noop }); }]] },
      { name: 'CreditLimitCard', desc: 'Figma 11157:4388 (spec CreditLimitCard.md; legacy Profile credit hub 10927:30765). Credit limit on Account: 328 × 130; masked when signed out.', props: 'total · available · masked · title · onClick',
        states: [['Default', function () { return h(PS.CreditLimitCard, { total: 50000, available: 15000, title: 'Credit Limit', onClick: noop }); }],
          ['Masked', function () { return h(PS.CreditLimitCard, { masked: true, title: 'Credit Limit', onClick: noop }); }]] },
      { name: 'DatePicker', desc: 'The date card (DS 7628:14113). BRIEF 25: month and year are two equal columns ((row − 12) / 2), ‹ › at their ends, the label centred — nothing moves with the month name, in every view.', props: 'value { y, m, d } · min · max · mode date | month | year (the view it opens on) · onConfirm · onCancel · title',
        states: [[{ y: 2026, m: 8, d: 24 }, 'date', 'Days · September'], [{ y: 2026, m: 4, d: 24 }, 'date', 'Days · May'], [{ y: 2026, m: 4, d: 24 }, 'month', 'Month wheel'], [{ y: 2026, m: 4, d: 24 }, 'year', 'Year wheel']].map(function (st) {
          return [st[2], function () { return h('div', { className: 'ps-card', style: { width: '20.5rem', padding: '20px 16px 32px' } }, h(PS.DatePicker, { value: st[0], mode: st[1], min: { y: 1950, m: 0, d: 1 }, max: { y: 2027, m: 11, d: 31 }, onConfirm: noop, onCancel: noop })); }]; }) },
      { name: 'RatingStar', desc: 'Figma 11187:19925 (legacy Star 5 6078:13294). One rating star, 14, the legacy art colour; the reviews on the guest home use five.', props: 'size · off (PS.RatingStar)',
        states: [['Default', function () { return h(PS.RatingStar); }], ['Row of five (reviews)', function () { return h('span', { className: 'ps-review__stars' }, [0, 1, 2, 3, 4].map(function (k) { return h(PS.RatingStar, { key: k }); })); }]] },
      { name: 'LoanHistoryItem', desc: 'Figma 11259:22291 (spec LoanHistoryItem.md; legacy Installment 6619:22073). One loan of the history on a card (328 × 56): amount, tag, chevron.', props: 'kind history | state · amount · state review | disbursing | declined | action | paid | none · label · term · onClick',
        states: [['Kind=History', function () { return h(PS.LoanHistoryItem, { kind: 'history', amount: 2000, term: '12 terms', onClick: noop }); }],
          ['Kind=State · Reviewing', function () { return h(PS.LoanHistoryItem, { kind: 'state', amount: 2000, state: 'review', label: 'Under review', onClick: noop }); }],
          ['State · Disbursing', function () { return h(PS.LoanHistoryItem, { amount: 2000, state: 'disbursing', label: 'Disbursing', onClick: noop }); }],
          ['State · Not approved', function () { return h(PS.LoanHistoryItem, { amount: 2000, state: 'declined', label: 'Not approved', onClick: noop }); }],
          ['State · Action needed', function () { return h(PS.LoanHistoryItem, { amount: 2000, state: 'action', label: 'Action needed', onClick: noop }); }],
          ['State · Paid off', function () { return h(PS.LoanHistoryItem, { amount: 2000, state: 'paid', label: 'Paid off', onClick: noop }); }]] },
      { name: 'LoanStateCard', desc: 'Figma 11263:25900 (legacy Loan state card 6104:11953). Where a loan application stands: the state tile, title and line.', props: 'state reviewing | declined | method | disbursed · title · body',
        states: ['reviewing', 'declined', 'method', 'disbursed'].map(function (st) { return [st, function () { return h(PS.LoanStateCard, { state: st }); }]; }) },
      /* ---- figma-lib 14: Application Details ---- */
      { name: '_FileBadge', desc: 'Figma 11166:4404 (spec _FileBadge.md; legacy File catalog logo 9474:28841). The file type on a 36 px sunken square.', props: 'type · pic (PS.FileBadge)',
        states: ['PDF', 'JPG', 'JPEG', 'PNG'].map(function (t) { return [t, function () { return h(PS.FileBadge, { type: t }); }]; }) },
      { name: 'ResultBadge', desc: 'Figma 11166:4407 (spec ResultBadge.md; legacy 6012:34323 · 5914:9238). The round tick or cross on ID photos (20).', props: 'kind success | failed (PS.ResultBadge)',
        states: [['Success', function () { return h(PS.ResultBadge, { kind: 'success' }); }], ['Failed', function () { return h(PS.ResultBadge, { kind: 'failed' }); }]] },
      { name: '_DateCell', desc: 'Figma 11166:4410 (spec _DateCell.md; legacy Calendar popover/date 5839:18418). One day of the date grid (24; selected: the 36 disc).', props: 'day · on · off · blank · onClick (PS.DateCell)',
        states: [['Default', function () { return h('div', { style: { width: '1.5rem' } }, h(PS.DateCell, { day: 1, onClick: noop })); }], ['Selected', function () { return h('div', { style: { width: '1.5rem', margin: '0.375rem' } }, h(PS.DateCell, { day: 1, on: true, onClick: noop })); }]] },
      { name: '_Weekday', desc: 'Figma 11166:4411 (spec _Weekday.md; legacy Calendar popover/ week 5839:18282). The weekday above a column (24 × 14).', props: 'label (PS.Weekday)',
        states: [['Default', function () { return h('div', { className: 'ps-date__week ps-text-body-xs', style: { display: 'block', width: '1.5rem', padding: 0 } }, h(PS.Weekday, { label: 'Sun' })); }]] },
      { name: '_MenuRow', desc: 'Figma 11166:4416 (spec _MenuRow.md; legacy select overlay 7201:11982 · Email/Auto filled list 5985:12384). One popover row: 36 pill.', props: 'label · kind plain | email · on · onClick (PS.MenuRow)',
        states: [['Plain', 'plain', false], ['Plain · pressed', 'plain', true], ['Email', 'email', false], ['Email · pressed', 'email', true]].map(function (st) {
          return [st[0], function () { return h('div', { className: 'ps-pop__list', style: { width: st[1] === 'email' ? '12.25rem' : '19.625rem', display: 'flex', flexDirection: 'column' } }, h(PS.MenuRow, { kind: st[1], on: st[2], label: st[1] === 'email' ? 'samge.studio@gmail.com' : 'Male' })); }]; }) },
      { name: 'PlaceTab', desc: 'Figma 11166:4420 (spec PlaceTab.md; legacy Search city popover/tab 5974:9358). One step tab of the address picker: 109 × 44.', props: 'label · state default | active | picked · bar · onClick (PS.PlaceTab)',
        states: ['default', 'active', 'picked'].map(function (st) { return [st.charAt(0).toUpperCase() + st.slice(1), function () { return h('div', { className: 'ps-ltabs', style: { width: '6.8125rem' } }, h(PS.PlaceTab, { label: 'Region', state: st, bar: true })); }]; }) },
      { name: 'PlaceRow', desc: 'Figma 11166:4427 (spec PlaceRow.md; legacy 5974:9438 · 3439:3010). One place of the address picker: region with a chevron, or a city with its province.', props: 'kind region | city · label · sub · q · on · last · onClick (PS.PlaceRow)',
        states: [['Region', false, false], ['Region · selected', true, false], ['Region · last', false, true], ['Region · selected last', true, true]].map(function (st) {
          return [st[0], function () { return h('div', { style: { width: '18.5rem' } }, h(PS.PlaceRow, { kind: 'region', label: 'Calabarzon', on: st[1], last: st[2], onClick: noop })); }]; }).concat([
          ['City', function () { return h('div', { style: { width: '18.5rem' } }, h(PS.PlaceRow, { kind: 'city', label: 'Angeles City', sub: 'Pampanga, Central Luzon', last: true, onClick: noop })); }],
          ['City · matched', function () { return h('div', { style: { width: '18.5rem' } }, h(PS.PlaceRow, { kind: 'city', label: 'Angeles City', sub: 'Pampanga, Central Luzon', q: 'ang', last: true, onClick: noop })); }]]) },
      { name: 'ChoiceButton', desc: 'Figma 11166:4430 (spec ChoiceButton.md; legacy Exist account btn 5904:10653). Two-line choice in the "ID in use" sheet: 288 × 56.', props: 'title · sub · tone link | brand · onClick',
        states: [['Link', function () { return h('div', { style: { width: '18rem' } }, h(PS.ChoiceButton, { title: 'Log in to your existing account', sub: 'Continue with your previous account', onClick: noop })); }],
          ['Brand', function () { return h('div', { style: { width: '18rem' } }, h(PS.ChoiceButton, { tone: 'brand', title: 'Log in to your existing account', sub: 'Continue with your previous account', onClick: noop })); }]] },
      { name: '_FileRow', desc: 'Figma 11166:4435 (spec _FileRow.md; legacy Upload File Sheet 9474:28815). One file of a DocCard: 304 × 36 (uploading 40).', props: 'name · size · state done | uploading | compressing | failed · progress · onRemove · onRetry (PS.FileRow)',
        states: [['Uploaded', { name: 'SSS_Contributions_2026.pdf', size: 1153434, state: 'done' }], ['Uploading', { name: 'Payslip_scan_hi-r_Sept_2026.jpg', size: 2516582, state: 'uploading', progress: 0.62 }],
          ['Compressing', { name: 'Payslip_scan_hi-r_Sept_2026.jpeg', size: 2516582, state: 'compressing' }], ['Failed', { name: 'SSS_Contributions_2026_0123456789.png', size: 1153434, state: 'failed' }]].map(function (st) {
          return [st[0], function () { return h('div', { style: { width: '19rem' } }, h(PS.FileRow, Object.assign({ onRemove: noop, onRetry: noop }, st[1]))); }]; }) },
      { name: 'DocCard', desc: 'Figma 11166:4925 (spec DocCard.md; legacy File catalog sheet 9474:29171). One proof-of-income type: expanded 328 × 368, collapsed / empty 60.', props: 'title · sub · files · open · onToggle · onAdd',
        states: [['Expanded', true, true], ['Collapsed', true, false], ['Empty', false, false]].map(function (st) {
          var files = [{ id: 1, name: 'SSS_Contributions_2026.pdf', size: 1153434, state: 'done' }, { id: 2, name: 'Payslip_scan_hi-r_Sept_2026.jpg', size: 2516582, state: 'uploading', progress: 0.62 },
            { id: 3, name: 'Payslip_scan_hi-r_Sept_2026.jpeg', size: 2516582, state: 'compressing' }, { id: 4, name: 'SSS_Contributions_2026_0123456789.png', size: 1153434, state: 'failed' }];
          return [st[0], function () { return h(PS.DocCard, { title: 'Payslips', sub: 'From the last 2-3 months', files: st[1] ? files : [], open: st[2], onToggle: noop, onAdd: noop }); }]; }) },
      { name: 'EmailSuggestions', desc: 'Figma 11166:4926 (spec EmailSuggestions.md; legacy Email/Auto filled 7193:22678). The e-mail domains under the e-mail field: 360 × 220.', props: 'FormField suggest · onSuggest (rows: PS.MenuRow email)',
        states: [['Default', function () { return h('div', { style: { padding: '0 0.5rem' } }, h(PS.Popover, { inline: true, kind: 'email', value: 'samge.studio@inbox.com', options: ['gmail.com', 'yahoo.com', 'msn.com', 'inbox.com', 'hotmail.com', 'mail.com'].map(function (d) { return 'samge.studio@' + d; }) })); }]] },
    ] },
    { id: 'basics', title: 'Basics', items: [
      { name: 'Amount', desc: 'An emphasised amount in the Amount text style (rebrand: Hanken Grotesk 800, its own ₱, tabular figures). Notes beside an amount and old prices are body text; a title with ₱ keeps its own style.', props: 'value · dec (2 | 0) · num xs | sm | md | lg | xl | xxl · decNum (a smaller ".00") · strike · className — PS.Peso children (a title with ₱)',
        states: [
          ['Number/xs 16', function () { return h(PS.Amount, { value: 50000, num: 'xs' }); }],
          ['Number/sm 18', function () { return h(PS.Amount, { value: 2000, num: 'sm' }); }],
          ['Number/md 24', function () { return h(PS.Amount, { value: 800, num: 'md', style: { color: 'var(--content-brand)' } }); }],
          ['Number/lg 32', function () { return h(PS.Amount, { value: 45000, num: 'lg', style: { color: 'var(--content-brand)' } }); }],
          ['Number/xl 36 + xs', function () { return h(PS.Amount, { value: 40000, num: 'xl', decNum: 'xs' }); }],
          ['Number/xxl 48', function () { return h(PS.Amount, { value: 12500, dec: 0, num: 'xxl' }); }],
          ['Struck', function () { return h(PS.Amount, { value: 46500, strike: true }); }],
          ['₱ in a title', function () { return h('p', { className: 'ps-text-title-md ps-c-brand' }, '+₱5,000'); }]] },
      
      { name: 'InfoButton · SectionLabel', desc: 'A value with a help mark that opens an explainer; the small uppercase label over a list (red for OVERDUE, 8 in for dates). (TextLink is its own entry now.)', props: 'InfoButton: onClick(event) · children — SectionLabel: tone negative · inset · children',
        states: [['All', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
          h(PS.Card, null, h(PS.KV, { label: 'Overdue', value: h(PS.InfoButton, { onClick: noop }, '18 days') })),
          h(PS.SectionLabel, { tone: 'negative' }, 'OVERDUE'), h(PS.SectionLabel, null, 'UPCOMING'), h(PS.SectionLabel, { inset: true }, 'JULY 5, 2026')); }]] },
      { name: 'Glass · Back · Close', desc: 'The frosted buttons of headers and sheets.', props: 'Glass: icon · iconSize · label · children · round (false: a pill) · size lg (44 px) · onClick — Back / Close: onClick',
        states: [['Pills', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap' } }, h(PS.Glass, { round: false }, 'Payment'), h(PS.Glass, { round: false, size: 'lg' }, 'Mark all read'), h(PS.Glass, { icon: 'help-circle', label: 'Help' })); }],
          ['All', function () { return h('div', { className: 'g-row' }, h(PS.Back, { onClick: noop }), h(PS.Close, { onClick: noop }), h(PS.HomeActions, { actions: [{ icon: 'bell', label: 'Inbox' }, { icon: 'headset', label: 'Contact us' }] }), h(PS.Brand)); }]] },
      { name: 'Count', desc: 'The round number badge of tabs. (Tag and Chip are their own entries now.)', props: 'n · on',
        states: [['All', function () { return h('div', { className: 'g-row' }, h(PS.Count, { n: 6 }), h('span', { style: { background: 'var(--surface-brand)', borderRadius: 99, padding: 4, display: 'inline-flex' } }, h(PS.Count, { n: 2, on: true }))); }]] },
      { name: 'Agreement', desc: 'The tick line above a primary button. (Check is its own entry now.)', props: 'on · onToggle · nudge (a number: each change ripples the circle) · children (links in <b>)',
        states: [['Agreement', function () { return h(Toggle, { render: function (on, set) { return h(PS.Agreement, { on: on, onToggle: function () { set(!on); } }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), ' and ', h('b', null, 'Loan Disclosure Statement'), '.'); } }); }],
          ['Nudge', function () { return h(Toggle, { init: 0, render: function (n, set) { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } }, h(PS.Agreement, { on: false, nudge: n, onToggle: noop }, 'By tapping Confirm, you accept the ', h('b', null, 'Loan Agreement'), '.'), h(PS.Button, { block: true, inactive: true, onClick: function () { set(n + 1); } }, 'Confirm')); } }); }]] },
      { name: 'Icon', desc: 'One-colour icons from assets/icons, drawn as masks so the colour is a token.', props: 'name · size · color primary | secondary | tertiary | brand | positive | inverse | countdown',
        states: [['Set', function () {
          return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 14 } }, ['chevron-left', 'chevron-right', 'close', 'check-sm', 'arrow-up', 'edit', 'coupon', 'clock', 'alert-circle', 'bell', 'inbox', 'headset', 'history', 'info', 'chat', 'user', 'help', 'wallet', 'calendar', 'nav-home', 'nav-payment', 'nav-account']
            .map(function (n) { return h('span', { key: n, title: n }, h(PS.Icon, { name: n, size: 20, color: n === 'clock' ? 'countdown' : n === 'coupon' ? 'positive' : 'primary' })); }));
        }]] },
      { name: 'Card · Divider · Link', desc: 'The white rounded card (plain, outline: the home cards\' 2 px white ring, raised: with shadow — or outline + raised, as home\'s payment card), the hairline between rows (or dashed, or upright), and the blue text link.', props: 'Card: variant plain | outline | raised · raised (shadow on any variant) · clip · as · onClick — Divider: dashed · vertical — Link: onClick · children',
        states: [['Cards', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, [['plain'], ['outline'], ['raised'], ['outline', true]].map(function (v) { return h(PS.Card, { key: v.join(), variant: v[0], raised: v[1] }, h('p', { className: 'ps-text-body-md-strong' }, v[1] ? 'outline + raised' : v[0])); })); }],
          ['Lines · link', function () { return h(PS.Card, null, h('p', { className: 'ps-text-body-md' }, 'Above the line'), h(PS.Divider), h('p', { className: 'ps-text-body-md' }, 'Dashed below'), h(PS.Divider, { dashed: true }), h(PS.Link, { onClick: noop }, 'View payment schedule')); }]] },
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
      { name: 'TopBar · live', desc: '(Spec states: entry TopBar.) Header: back or brand on the left, title, actions on the right. No progressive blur (tokens v2026.11.17): on a tab page, the amount entry and the order page its veil is Gradient/Top-nav-filled; a secondary page has a solid header in the page colour (solid).', props: 'left · title · right · extra + extraHeight · solid · live',
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
      { name: 'Sheet · live', desc: '(Spec states: entry Sheet.) Three kinds: page (fills below the header), card (floating decision), plain (bottom). Drag the top edge down or tap outside to close.', props: 'open · kind page | card | plain · onClose · label · scrim',
        states: [['Plain', function () { return h(SheetDemo, { kind: 'plain' }); }], ['Card', function () { return h(SheetDemo, { kind: 'card' }); }], ['Page', function () { return h(SheetDemo, { kind: 'page' }); }]] },
      
      { name: 'SheetHead · ButtonRow · Confirm', desc: 'A sheet\'s title row with the close button in its 40 px corner (centred, or left with room for the button; a mark before the title; the title at the bottom of the row). Two buttons side by side, 10 apart, that wrap large text. Confirm: a card sheet that asks before something happens (put the sheet in className ps-confirm).',
        props: 'SheetHead: title · type · align center | left · bottom · icon · iconColor · onClose · children — ButtonRow: children — Confirm: title · body · cancel · ok · onOk · onClose · onCancel',
        states: [['Centred', function () { return h('div', { className: 'ps-card', style: { padding: 16 } }, h(PS.SheetHead, { title: 'Payment detail', type: 'ps-text-title-xs', onClose: noop })); }],
          ['Left · mark', function () { return h('div', { className: 'ps-card', style: { padding: 16 } }, h(PS.SheetHead, { align: 'left', bottom: true, title: 'We couldn’t verify your ID', icon: 'warning-filled', iconColor: 'var(--content-negative-subtle)', onClose: noop })); }],
          ['Confirm', function () { return h(InSheet, { className: 'ps-confirm', height: 360, render: function (close) { return h(PS.Confirm, { title: 'Log out', body: 'Are you sure you want to log out?', cancel: 'Cancel', ok: 'Log out', onOk: close, onClose: close }); } }); }],
          ['One button', function () { return h(InSheet, { className: 'ps-confirm', height: 380, render: function (close) { return h(PS.Confirm, { title: 'You can’t delete your account yet', body: 'You still have a loan application in progress or a loan to repay. You can close your account once it’s complete or fully repaid.', ok: 'I understand', onOk: close, onClose: close }); } }); }]] },
    ] },
    { id: 'home', title: 'Home', items: [
      { name: 'CreditCard · more', desc: '(Spec states: entry CreditCard.) Available amount, total and temporary credit, Withdraw.', props: 'available · total · temporary · temporaryUntil · onWithdraw · onInfo · label · action',
        states: [['Temporary credit', function () { return h(PS.CreditCard, { available: 40000, total: 50000, temporary: 10000, temporaryUntil: 'Nov 20' }); }],
          ['No temporary', function () { return h(PS.CreditCard, { available: 15000, total: 50000 }); }]] },
      { name: 'PaymentCard · more', desc: '(Spec states: entry PaymentCard.) The next repayment; overdue: a red badge, and with a notice the overdue layout (the due date under the amount, the penalty box, a full-width button).', props: 'amount · was · due · badge · onPay · payLabel · title · overdue · notice { title, body, onHelp }',
        states: [['Default', function () { return h(PS.PaymentCard, { amount: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' }); }],
          ['Discounted', function () { return h(PS.PaymentCard, { amount: 700, was: 800, due: 'Dec 27, 2026', badge: 'Due in 45 days' }); }],
          ['Overdue', function () { return h(PS.PaymentCard, { amount: 2150, due: 'Nov 9', badge: 'Overdue · 3 days', overdue: true, onPay: noop, notice: { title: 'Last day to pay without a penalty', body: 'Pay by 11:59 PM today to avoid a ₱100.00 penalty on Nov 13.', onHelp: noop } }); }]] },
      { name: 'HomeCoupons · more', desc: '(Spec states: entry HomeCoupons.) Coupons for your next loan: two or more → two cards; one → the wide card with the folder tab; none → nothing.', props: 'coupons [{ type, value, until, kind, label, cond }] · onOpen · title · layout auto | pair | one',
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
      { name: 'CouponTicket · more', desc: '(Spec states: entry CouponTicket.) The coupon in the coupon centre (Use). The picker uses CouponOption. Fields not given are left out.', props: 'value · label · rule · ruleLong + onRule · meta · expiresAt · best · state default | selected | used | expired | unavailable · reason · action use | pick | none · onUse · onPick',
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
        states: [['Coupon centre', function () { return h(Tabs3, {}); }], ['Picker (glass)', function () { return h(Toggle, { init: 'd', render: function (v, set) { return h('div', { style: { background: 'var(--surface-sunken)', padding: 12, borderRadius: 24 } }, h(PS.Tabs, { id: 'g-t2', glass: true, value: v, onChange: set, items: [{ id: 'd', label: 'Discount' }, { id: 'l', label: 'Limit increase' }] })); } }); }],
          ['Split', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
            h(Toggle, { init: 'adj', render: function (v, set) { return h(PS.Tabs, { id: 'g-split', split: true, value: v, onChange: set, items: [{ id: 'adj', label: 'Credit adjustments' }, { id: 'act', label: 'Borrowing activity' }] }); } }),
            h(Toggle, { init: 'unread', render: function (v, set) { return h(PS.Tabs, { id: 'g-spaced', split: true, spaced: true, value: v, onChange: set, items: [{ id: 'unread', label: 'Unread (2)' }, { id: 'read', label: 'Read' }] }); } })); }]] },
      { name: 'EmptyState · more', desc: '(Spec states: entry EmptyState.) Picture, title and one line (the Empty box animation by default). page: all a page shows — it sits where the loading coin sat, so loading → empty reads as one place.', props: 'art · title · body · children (a button) · page',
        states: [['Default', function () { return h(PS.EmptyState, { title: 'No coupons yet', body: 'When you get a coupon, you’ll see it here.' }); }],
          ['Page', function () { return h('div', { className: 'g-frame', style: { height: 600, '--ph': '600px' } }, h(PS.Screen, { secondary: true, top: { left: h(PS.Back, { onClick: noop }), title: 'Loan history' } }, h(PS.EmptyState, { title: 'No loan history yet', body: 'Your loan records will appear here once you apply.', page: true }))); }]] },
      { name: 'CouponRow · CouponsSection', desc: 'Coupon lines on the loan page; green sub-line when the coupon is on.', props: 'CouponRow type · title · sub · on · onClick — CouponsSection count · onSeeAll · rows',
        states: [['Both on', function () { return h(PS.CouponsSection, { count: 6, rows: [{ type: 'percent', title: '50% off first-payment interest', sub: 'You save ₱5,000', on: true }, { type: 'limit', title: '+₱5,000 credit limit', sub: 'Your limit is ₱50,000 for this loan', on: true }] }); }],
          ['Not used', function () { return h(PS.CouponsSection, { count: 6, rows: [{ type: 'percent', title: '20% off interest on all payments', sub: 'Borrow ₱6,000 or more · 6 / 8 terms' }, { type: 'limit', title: '+₱5,000 credit limit', sub: 'Borrow ₱6,000 or more · 3 / 6 / 8 terms' }] }); }]] },
      { name: 'CouponPayCard', desc: 'Figma 11273:4945 (spec CouponPayCard.md; legacy "Coupon primary card" 10926:29645) — PS.CouponPayCard = PS.Summary. The total card at the foot of the coupon sheet, 174 tall with both chips: total payment, the old price struck, the Saved / New limit chips (pills 26), Confirm 16 under them. A coupon that isn’t used hides its field.', props: 'total · was · saved · newLimit · onConfirm · label · title',
        states: [['Both', function () { return h(PS.CouponPayCard, { total: 46000, was: 46500, saved: 500, newLimit: 50000 }); }],
          ['Discount only', function () { return h(PS.CouponPayCard, { total: 46000, was: 46500, saved: 500 }); }],
          ['No coupon', function () { return h(PS.CouponPayCard, { total: 46000 }); }]] },
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
        states: [['Countdown', function () { return h('p', { className: 'ps-text-body-sm', style: { color: 'var(--ps-countdown)' } }, h(PS.Countdown, { to: NOW + 23 * 3600000 + 59 * 60000 })); }],
          ['Pictures', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 16 } }, ['percent', 'amount', 'limit'].map(function (t) { return h('span', { key: t, className: 'g-row' }, h(PS.CouponArt, { type: t, size: 56 }), h(PS.CouponArt, { type: t, size: 36 })); })); }],
          ['Animated', function () { return h('div', { className: 'g-row', style: { flexWrap: 'wrap', gap: 16 } }, ['percent', 'amount', 'limit'].map(function (t) { return h(PS.CouponArt, { key: t, type: t, size: 80, animate: true }); })); }]] },
    ] },
    { id: 'loan', title: 'Loan', items: [
      { name: 'AmountCard · more', desc: 'Disbursement amount with the slider, and the loan term. A limit coupon turns the maximum green.', props: 'amount · min · max · step · boost · onAmount · onCommit · terms · term · termNote · onTerm',
        states: [['Default', function () { return h(LoanDemo, { boost: false }); }], ['Limit coupon', function () { return h(LoanDemo, { boost: true }); }]] },
      { name: 'OrderDetails · more', desc: 'Order detail rows; a row with no value is hidden.', props: 'rows [{ label, value, tone }] · link · onLink',
        states: [['With discount', function () { return h(PS.OrderDetails, { link: 'View payment schedule', rows: [{ label: 'Daily fee', value: '₱60.00' }, { label: 'First payment date', value: 'Nov 27, 2026' }, { label: 'Per installment', value: '₱8,400.00' }, { label: 'Discount', value: '-₱810.00', tone: 'positive' }, { label: 'Total payment', value: '₱49,590.00' }] }); }],
          ['No discount', function () { return h(PS.OrderDetails, { link: 'View payment schedule', rows: [{ label: 'Daily fee', value: '₱60.00' }, { label: 'Discount', value: null }, { label: 'Total payment', value: '₱50,400.00' }] }); }]] },
      { name: 'ProtectionCard · MethodCard', desc: 'Borrower protection and the withdrawal account.', props: 'ProtectionCard title · tag · body · link — MethodCard name · last4 · logo · onClick',
        states: [['Default', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.ProtectionCard, { body: 'Get covered for up to ₱30,000, so your family isn’t left with the loan if a medical emergency or accident happens.' }), h(PS.MethodCard, { name: 'Bank of the Philippine Islands', last4: '4567' })); }]] },
      { name: 'RepaymentPlan', desc: 'The payment schedule (inside a plain sheet); a discounted value shows the original struck through.', props: 'items [{ title, date, total, rows [{ label, value, was }] }]',
        states: [['Default', function () { return h(PS.RepaymentPlan, { items: [1, 2, 3].map(function (k) { return { title: 'Payment ' + k, date: ['Nov 27', 'Dec 12', 'Dec 27'][k - 1] + ', 2026', total: k === 1 ? 8231.25 : 8400, rows: [{ label: 'Principal', value: 7500 }, { label: 'Interest', value: k === 1 ? 506.25 : 675, was: 675 }, { label: 'Service fee', value: 225 }] }; }) }); }]] },
      { name: 'Slider · more', desc: 'The amount slider on its own: the knob and the fill follow the finger at once; when something else moves the value or the maximum (a coupon raises it) they glide there on the Smooth spring. boost: the green end with the coupon mark.', props: 'value · min · max · step · onChange(v) while dragging · onCommit(v) · boost',
        states: [['Drag', function () { return h(Toggle, { init: 30000, render: function (v, set) { return h('div', { style: { padding: '16px 4px' } }, h(PS.Slider, { value: v, min: 500, max: 45000, step: 500, onChange: set, onCommit: set })); } }); }],
          ['Raised by a coupon', function () { return h(Toggle, { init: 50000, render: function (v, set) { return h('div', { style: { padding: '16px 4px' } }, h(PS.Slider, { value: v, min: 500, max: 50000, step: 500, boost: true, onChange: set, onCommit: set })); } }); }]] },
      { name: 'OrderHead · OrderStatus · PlanRows', desc: 'The top of a loan page (a label over the amount in brand blue), where the application stands (the outlined card with a tile; red when the transfer failed), and a payment plan as separate rows 2 px apart.', props: 'OrderHead: label · amount — OrderStatus: state review | failed · title · body — PlanRows: rows [{ label, value }]',
        states: [['In review', function () { return h('div', { style: { display: 'flex', flexDirection: 'column', gap: 20 } }, h(PS.OrderHead, { label: 'You applied for a loan', amount: 12500 }),
            h(PS.OrderStatus, { state: 'review', title: 'We’re reviewing your application', body: 'Your loan is under review. We’ll let you know once we’re sending your money.' })); }],
          ['Failed', function () { return h(PS.OrderStatus, { state: 'failed', title: 'We couldn’t send your loan', body: 'The transfer to your account didn’t go through. Change your withdrawal method to try again.' }); }],
          ['Plan', function () { return h(PS.Section, { label: 'PAYMENT PLAN' }, h(PS.PlanRows, { rows: ['June 10, 2026', 'June 25, 2026', 'July 10, 2026'].map(function (d) { return { label: d, value: '₱500.00' }; }) })); }]] },
      { name: 'AmountEntry · more', desc: 'The amount keypad page\'s white sheet (Figma 52:12744): the amount as it is typed (digits rise in, a caret blinks, what is not typed yet is grey), a line that turns red out of range, the terms and the keypad.', props: 'typed (digits so far, with commas) · amount · label · hint · error · terms · term · onTerm · onKey',
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
    var body = p.kind === 'plain' ? h(R.Fragment, null, h(PS.SheetTitle, { onClose: close }, 'Repayment plan'), h('p', { className: 'ps-text-body-md ps-c-tertiary', style: { padding: '0 12px' } }, 'Sheet content.'), h(PS.Button, { block: true, onClick: close }, 'Continue'))
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
        h('h3', { className: 'ps-text-title-xs' }, it.name.split(' · ').map(function (n) { return 'PS.' + n; }).join(' · ')),
        h('p', { className: 'ps-text-body-md ps-c-secondary' }, it.desc),
        h('p', { className: 'g-props ps-text-caption-sm' }, h('b', null, 'Props '), it.props),
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
          h('div', null, h('p', { className: 'ps-text-title-md' }, 'PeraSure components'),
            h('p', { className: 'ps-text-caption-sm ps-c-tertiary' }, 'shared/ps-ui · styled only with the design tokens · docs in shared/README.md')),
          h('nav', { className: 'g-nav' }, GROUPS.map(function (g) { return h('a', { key: g.id, href: '#g-' + g.id, className: 'g-chip' }, g.title); }))),
        GROUPS.map(function (g) {
          return h('section', { key: g.id, id: 'g-' + g.id, className: 'g-group' }, h('h2', { className: 'ps-text-title-sm' }, g.title),
            g.items.map(function (it) { return h(Entry, { key: it.name, item: it }); }));
        }))));
  }
  PS.GALLERY = GROUPS;                  /* every entry, for PeraSure Dev Mode's component stage (shared/stage.html) */
  if (window.PS_STAGE) return;          /* the stage mounts one entry itself */
  PS.mount(App);
})();
