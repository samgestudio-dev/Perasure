// Motion recording specs. Each: id, name, url, ready, setup steps, trigger {js | steps (+waitEvent) | nav}, targets, maxMs, minMs, loop, notes.
const APPQ = '/prototypes/app/index.html?auto=0&fast=1';
const APP_READY = "window.APP && APP.S.stack.at(-1).name === 'tabs' && document.querySelector('.ps-nav')";
const stage = (entry, state = 0, extra = '') => `/shared/stage.html?entry=${encodeURIComponent(entry)}&state=${state}${extra}`;
const STAGE_READY = "document.querySelector('.st') && document.querySelector('.st').children.length";
const T = (name, sel, props, max, extra) => Object.assign({ name, sel, props, max }, extra || {});
const J = (name, js, props, max, extra) => Object.assign({ name, js, props, max }, extra || {});
const tapEv = (sel, hold = 160, more = {}) => ({ waitEvent: 'pointerdown', steps: [{ tap: sel, hold, ...more }] });
export const SPECS = [];
const add = s => SPECS.push(s);
// app helper: navigate to app, wait for home
const app = (extra = '') => ({ url: APPQ + extra, ready: APP_READY, settleBefore: 1700 });

/* ---------------- global ---------------- */
add({ id: 'M-001', name: 'Press (pill / card)', url: stage('Button', 0), ready: STAGE_READY, trigger: tapEv('.ps-btn', 200),
  targets: [T('button', '.ps-btn', ['tf', 'rect'])], notes: 'Gallery Button (Primary). Touch held 200 ms then released: press-in at t=0, release at the pointerup event time (see events).' });
add({ id: 'M-002', name: 'Press (icon button)', url: stage('Glass · Back · Close', 0), ready: STAGE_READY, trigger: tapEv('.ps-glass--round', 200),
  targets: [T('iconButton', '.ps-glass--round', ['tf', 'rect'])], notes: 'Gallery Glass round (Help). Touch held 200 ms then released.' });
add({ id: 'M-003', name: 'Swap (text replaced after a tap)', url: stage('Swap', 0), ready: STAGE_READY, trigger: tapEv('.ps-btn', 80),
  targets: [T('swapChild', '.ps-btn > span > span', ['op', 'tf', 'blur', 'text'], 2), T('button', '.ps-btn', ['tf'])], notes: 'Gallery Swap: button label Next -> I understand. swapChild[0]/[1] are the stacked grid children (old leaves, new enters; order may change when React re-keys).' });
add({ id: 'M-008', name: 'Page change crossfade', ...app(), trigger: { js: "APP.go('about')" },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'css:z-index'], 3)], minMs: 100, notes: "APP.go('about') from home (dir 1). page[i] are the stacked .ps-page layers inside .ps-frame (old and new)." });
add({ id: 'M-008_reduced', name: 'Page change crossfade (prefers-reduced-motion: reduce)', reduced: true, ...app(), trigger: { js: "APP.go('about')" },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'css:z-index'], 3)], minMs: 100, notes: 'Same as M-008 with prefers-reduced-motion: reduce (MotionConfig reducedMotion=user: opacity still animates).' });
add({ id: 'M-013', name: 'Sheet slide up / down (open)', ...app(), trigger: { js: "APP.open('logout')" },
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: "APP.open('logout') (card sheet). Close recorded as M-013_close." });
add({ id: 'M-013_close', name: 'Sheet slide up / down (close)', ...app(), setup: [{ js: "APP.open('logout')" }, { wait: 1200 }], trigger: { js: 'APP.close()' },
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: 'APP.close() on the open logout card sheet.' });
add({ id: 'M-013_reduced', name: 'Sheet slide up (prefers-reduced-motion: reduce)', reduced: true, ...app(), trigger: { js: "APP.open('logout')" },
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op']), T('content', '.ps-sheet > *:nth-child(n+3)', ['op', 'tf', 'blur'], 3)], notes: 'Reduced motion: the y spring is skipped (jumps), the scrim opacity and content fade still animate.' });
add({ id: 'M-014', name: 'Sheet scrim fade', ...app(), trigger: { js: "APP.open('logout')" }, setup: [],
  targets: [T('scrim', '.ps-scrim', ['op', 'bg'])], notes: 'Scrim in (0.2 s). The scrim out is in M-014_close.' });
add({ id: 'M-014_close', name: 'Sheet scrim fade (out)', ...app(), setup: [{ js: "APP.open('logout')" }, { wait: 1200 }], trigger: { js: 'APP.close()' },
  targets: [T('scrim', '.ps-scrim', ['op'])] });
add({ id: 'M-015', name: 'Sheet drag-to-close', ...app(), setup: [{ js: "APP.open('logout')" }, { wait: 1200 }],
  trigger: { waitEvent: 'pointerdown', steps: [{ mdrag: '.ps-sheet__drag', dy: 160, ms: 260, steps: 14 }] }, minMs: 600,
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: 'Mouse drag on the drag strip (touch emulation did not start the drag in headless Chrome): 160 px down over 260 ms (14 moves), released -> closes (offset > 96 px).' });
add({ id: 'M-015_snapback', name: 'Sheet drag released early (snaps back)', ...app(), setup: [{ js: "APP.open('logout')" }, { wait: 1200 }],
  trigger: { waitEvent: 'pointerdown', steps: [{ mdrag: '.ps-sheet__drag', dy: 60, ms: 600, steps: 20 }] }, minMs: 900,
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: 'Mouse drag 60 px down over 600 ms, released: below the 96 px threshold and slow -> springs back.' });
add({ id: 'M-016', name: 'Toasts stack (iPhone notifications)', ...app(), setup: [{ js: "APP.say('First message', 6000)" }, { wait: 900 }, { js: "APP.say('Second message', 6000)" }, { wait: 900 }],
  trigger: { js: "APP.say('Third message', 6000)" },
  targets: [T('toast', '.ps-toast', ['op', 'tf', 'blur', 'rect', 'text'], 3)], notes: 'Two toasts already shown; a third pushed at t=0: the new one drops in, the older ones slip down / shrink / fade.' });
add({ id: 'M-017', name: 'Toast swipe-left to close', ...app(), setup: [{ js: "APP.say('Swipe me away', 8000)" }, { wait: 1000 }],
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: '.ps-toast', dx: -140, ms: 200, steps: 10 }] },
  targets: [T('toast', '.ps-toast', ['op', 'tf', 'rect'])], notes: 'Touch drag left 140 px over 200 ms, release -> exits to x -110%.' });

const OTP_OPEN = [{ js: 'APP.set({ otp: {} })' }, { wait: 900 }];
const OTP_BTN = "() => [...document.querySelectorAll('.ps-otps .ps-btn')].pop()";
add({ id: 'M-004', name: 'reveal (secondary content entrance, item i)', ...app(), setup: OTP_OPEN,
  trigger: { startWhen: "document.querySelector('.ps-otp__box')", steps: [{ tap: { js: OTP_BTN }, hold: 60 }] },
  targets: [T('otpBox', '.ps-otp__box', ['op', 'tf', 'blur'], 6)], notes: 'PS.reveal(i) is used by the OTP boxes (cascade). Recorded on the app OTP sheet: Get verification code -> step 1; t=0 = first frame the boxes exist (the send wait before it is random 500-1200 ms).' });
add({ id: 'M-005', name: 'rise / Rise (children rise in one after another)', url: stage('Rise · Crossfade', 0), ready: STAGE_READY,
  trigger: tapEv('.ps-btn--text', 60), settleBefore: 1200,
  targets: [T('row', '.ps-histrow', ['op', 'tf', 'blur'], 3)], notes: 'Gallery Rise: "Play again" remounts three HistoryRows. t=0 = pointerdown on the button; the remount happens on click (see events).' });
add({ id: 'M-006', name: 'Crossfade (content replaced: a tab\'s list)', ...app(), setup: [{ js: "APP.go('coupons')" }, { wait: 1200 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-tabs__tab:nth-child(2)', hold: 60 }] },
  targets: [T('pane', '.ps-screen--secondary .ps-col > div > div', ['op', 'tf', 'blur', 'rect'], 3), T('item', '.ps-screen--secondary .ps-col > div > div > * > *', ['op', 'tf', 'blur'], 6)],
  notes: 'Coupons page, tab To use -> Used: PS.Crossfade{rise}: old pane leaves, new pane children rise in.' });
add({ id: 'M-007', name: 'Lottie player (loader coin + dots)', url: stage('Loader · Coin · Dots · Busy', 0), trigger: { nav: true }, loop: true, maxMs: 3000,
  targets: [{ name: 'lottie', lottie: true }], notes: 'Page load of the gallery Loader: lottie frame numbers per registered animation (file:frame) per sample. Loops forever; recorded 3 s.' });
add({ id: 'M-009', name: 'Page rises from bottom (dir 2)', ...app(), trigger: { js: "APP.go('amount', null, 'rise')" },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'rect', 'css:z-index'], 3)], notes: "APP.go('amount', null, 'rise') — the amount page used when the Withdraw sheet cannot load." });
add({ id: 'M-009_back', name: 'Page goes back down (dir -2)', ...app(), setup: [{ js: "APP.go('amount', null, 'rise')" }, { wait: 1300 }], trigger: { js: 'APP.back()' },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'rect', 'css:z-index'], 3)], notes: 'APP.back() from the risen amount page.' });
add({ id: 'M-010', name: 'Header veil fades in on scroll', ...app(), trigger: { steps: [{ scrollTo: '.ps-frame .ps-scroll', to: 48, ms: 480 }] },
  targets: [T('topVeil', 'header.ps-top .ps-pb--top', ['op']), T('scroller', '.ps-frame .ps-scroll', ['scroll']), T('topBar', 'header.ps-top', ['attr:class'])], settleMs: 300,
  notes: 'Home: scrollTop driven linearly 0 -> 48 px over 480 ms; veil opacity = clamp(scrollTop/24). Scroll-linked (no easing): compare opacity against scrollTop, not time.' });
add({ id: 'M-011', name: 'Bottom bar / tab bar veil fades out at end of scroll', ...app(), trigger: { steps: [{ scrollTo: '.ps-frame .ps-scroll', to: 'end', ms: 1200 }] },
  targets: [T('botVeil', '.ps-nav .ps-pb--bot', ['op']), T('scroller', '.ps-frame .ps-scroll', ['scroll']), T('page', '.ps-frame .app-tabs .ps-page', ['var:--ps-bot-fade'])],
  notes: 'Home: scrollTop driven linearly to the end over 1200 ms; the veil fades over the last bar height (108 px). Scroll-linked.' });
add({ id: 'M-012', name: 'Cover (loading / failed layer) leaves', url: '/prototypes/app/index.html?auto=0', ready: APP_READY, settleBefore: 2200,
  trigger: { startWhen: "document.querySelector('.ps-frame .app-col')", js: "APP.go('history')" }, maxMs: 1200,
  targets: [T('cover', '.ps-cover', ['op', 'bg']), T('content', '.ps-frame .app-col > *', ['op', 'tf', 'blur'], 5)],
  notes: "No ?fast: APP.go('history') shows the loading cover; t=0 = the first frame the loaded content exists (the cover starts leaving). Load time itself is random (350–2200 ms) and not part of the curve." });
add({ id: 'M-127', name: 'Page loading -> content (Loaded)', url: '/prototypes/app/index.html?auto=0', ready: APP_READY, settleBefore: 2200,
  trigger: { js: "APP.go('history')" }, minMs: 2400, maxMs: 4000,
  targets: [T('cover', '.ps-cover', ['op', 'bg']), T('loader', '.ps-cover .ps-loader', ['op', 'tf', 'blur']), T('content', '.ps-frame .app-col > *', ['op', 'tf', 'blur'], 5), T('page', '.ps-frame > .ps-page', ['op'], 2)],
  notes: "Whole sequence from APP.go('history') (no ?fast): page crossfade, full-screen loader, random load wait (350–1100 ms, 12 % 1400–2200 ms), cover leaves, content rises. The wait in this take is a sample of the random latency." });
add({ id: 'M-020', name: 'Top bar extra row hides under a cover', url: '/prototypes/app/index.html?auto=0', ready: APP_READY, settleBefore: 2200,
  trigger: { js: "APP.go('coupons')" }, minMs: 2400, maxMs: 4000,
  targets: [T('extraRow', '.ps-top__extra', ['op']), T('screen', '.ps-frame .ps-screen--secondary', ['attr:class'])],
  notes: 'Coupons page (no ?fast): the screen mounts covered (.is-covered, tabs row at opacity 0) and when the data is in the row fades back in (CSS opacity 0.2 s ease). The hide direction (1 -> 0) is in M-020_hide.' });
add({ id: 'M-020_hide', name: 'Top bar extra row hides (class added)', ...app(), setup: [{ js: "APP.go('coupons')" }, { wait: 1200 }],
  trigger: { js: "document.querySelector('.ps-frame .ps-screen--secondary').classList.add('is-covered')" },
  targets: [T('extraRow', '.ps-top__extra', ['op'])], notes: 'Synthetic trigger: .is-covered added to the coupons screen by script to show the CSS transition 1 -> 0 (0.2 s ease).' });
add({ id: 'M-021', name: 'Sheet content rise', ...app(), trigger: { js: "APP.open('logout')" },
  targets: [T('content', '.ps-sheet > *:nth-child(n+3)', ['op', 'tf', 'blur'], 4), T('sheet', '.ps-sheet', ['tf'])], notes: "Logout card sheet: children after the grab + drag strip rise (delay 110 ms, gap 40 ms) while the sheet slides." });
add({ id: 'M-022', name: 'Tooltip grow from tap', url: stage('Tooltip', 0, ''), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.g-frame .ps-glass--round:nth-child(2)', hold: 60 }] },
  targets: [T('tip', '.ps-tip', ['op', 'tf', 'blur', 'rect', 'css:transform-origin'])], notes: 'Gallery Tooltip (Try it), middle Help button.' });
add({ id: 'M-022_close', name: 'Tooltip closes', url: stage('Tooltip', 0, ''), ready: STAGE_READY, setup: [{ tap: '.g-frame .ps-glass--round:nth-child(2)', hold: 60 }, { wait: 900 }],
  trigger: { waitEvent: 'click', steps: [{ tap: { x: 180, y: 200 }, hold: 60 }] },
  targets: [T('tip', '.ps-tip', ['op', 'tf', 'blur', 'rect'])], notes: 'Tap outside the open tooltip (on its catcher): exit {opacity 0, scale 0.98} on LEAVE.' });
add({ id: 'M-023', name: 'Single Toast', url: stage('Tooltip · Toast', 1), trigger: { nav: true, startWhen: "document.querySelector('.ps-toast')" },
  targets: [T('toast', '.ps-toast', ['op', 'tf', 'blur', 'rect'])], maxMs: 2000, notes: 'Gallery Toast (PS.Toast with a message on mount): t=0 = first frame the toast exists.' });
add({ id: 'M-024', name: 'Field error message', url: stage('OtpForm', 0), ready: STAGE_READY,
  trigger: { startWhen: "document.querySelector('.ps-field__msg, .ps-otpform p.is-error, .is-error')", steps: [{ key: '122435', gap: 50 }] }, setup: [{ tap: '.ps-otp', hold: 40 }, { wait: 300 }],
  targets: [J('error', "() => [...document.querySelectorAll('.ps-otpform p, .ps-field__msg')].filter(p => /Incorrect/.test(p.textContent))", ['op', 'tf', 'blur', 'rect'], 2)],
  notes: 'Gallery OtpForm (Live): typing a wrong 6-digit code sets the error; t=0 = first frame the error element exists.' });
add({ id: 'M-025', name: 'FormField error line', ...app(), setup: [{ js: "APP.go('kyc-basic')" }, { wait: 1300 }, { js: "document.querySelector('input[aria-label^=\"Total monthly\"]').scrollIntoView({ block: 'center' })" }, { wait: 300 }, { tap: 'input[aria-label^="Total monthly"]', hold: 40 }, { wait: 300 }],
  trigger: { startWhen: "document.querySelector('.ps-ff__error')", steps: [{ key: 'x' }, { js: "document.activeElement.blur()" }] },
  targets: [T('error', '.ps-ff__error', ['op', 'tf', 'blur', 'rect', 'text'], 2)], maxMs: 1500, notes: "App kyc-basic, Total monthly income: type 'x' then blur -> 'Please enter numbers only'. t=0 = first frame the error line exists." });
add({ id: 'M-026', name: 'Field focus ring', url: stage('FormField · Popover', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'pointerdown', steps: [{ tap: '.ps-ff__box', hold: 60 }] }, targets: [T('box', '.ps-ff__box', ['shadow', 'bc'])], notes: 'Gallery FormField Typing: tap the input -> focus ring (box-shadow 0.15 s ease).' });
add({ id: 'M-027', name: 'OTP digit pop', url: stage('OtpBoxes · ContactMethods', 0), ready: STAGE_READY, setup: [{ tap: '.ps-otp', hold: 40 }, { wait: 300 }],
  trigger: { steps: [{ key: '1' }] }, targets: [T('digit', '.ps-otp__box > span', ['op', 'tf', 'text'], 2), T('box1', '.ps-otp__box:nth-of-type(1)', ['bc', 'shadow', 'color'])],
  notes: 'Gallery OtpBoxes Empty: one digit typed (key event) at t=0.' });
add({ id: 'M-028', name: 'OTP boxes cascade in', ...app(), setup: OTP_OPEN,
  trigger: { startWhen: "document.querySelector('.ps-otp__box')", steps: [{ tap: { js: OTP_BTN }, hold: 60 }] },
  targets: [T('otpBox', '.ps-otp__box', ['op', 'tf', 'blur'], 6)], notes: 'OTP sheet step 2: boxes cascade (same take as M-004).' });
add({ id: 'M-029', name: 'OTP box state colours', url: stage('OtpBoxes · ContactMethods', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'pointerdown', steps: [{ tap: '.ps-otp', hold: 40 }, { wait: 400 }, { key: '1' }] },
  targets: [T('box', '.ps-otp__box', ['bc', 'shadow', 'color'], 2)], notes: 'Focus (tap) at t=0, then one digit typed ~450 ms later: box 1 empty-active -> filled, box 2 becomes active.' });
add({ id: 'M-030', name: 'Contact method / radio / selbar colour', url: stage('OtpBoxes · ContactMethods', 3), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-contact__item:nth-child(2)', hold: 60 }] },
  targets: [T('ring', '.ps-contact__ring', ['bg', 'bc', 'shadow', 'color'], 2), T('label', '.ps-contact__item > span:last-child', ['color'], 2)],
  notes: 'Gallery ContactMethods: SMS -> Phone. Colour transitions 0.15 s ease. Same token for radio / selbar / consent / check (see M-030_selbar).' });
add({ id: 'M-030_selbar', name: 'SelectBar radio colour', url: stage('Keypad · Segmented · SelectBar', 2), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-selbar:nth-child(1)', hold: 60 }] },
  targets: [T('bar', '.ps-selbar', ['bg', 'bc', 'shadow'], 2), T('radio', '.ps-radio', ['bg', 'bc', 'shadow'], 2)], notes: 'Gallery SelectBar Options: GCash -> Maya.' });
add({ id: 'M-031', name: 'Keypad keys cascade (amount page)', ...app(), trigger: { js: "APP.go('amount', null, 'rise')" },
  targets: [T('key', '.ps-key', ['op', 'tf'], 12)], notes: "APP.go('amount', null, 'rise'): PS.Keypad{cascade} on the amount page." });
add({ id: 'M-032', name: 'Segmented pill glide', url: stage('Keypad · Segmented · SelectBar', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-seg__tab:nth-child(2)', hold: 60 }] }, targets: [T('pill', '.ps-seg__pill', ['tf', 'rect'])], notes: 'E-Wallet -> Online bank.' });
add({ id: 'M-033', name: 'Tabs pill glide', url: stage('Tabs', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-tabs__tab:nth-child(3)', hold: 60 }] }, targets: [T('pill', '.ps-tabs__pill', ['tf', 'rect']), T('label', '.ps-tabs__tab > span:last-child', ['color'], 3)], notes: 'Coupon centre tabs: To use -> Expired.' });
add({ id: 'M-034', name: 'Tabs pill fade (inbox variant)', ...app(), setup: [{ js: "APP.go('inbox')" }, { wait: 1200 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-tabs__tab:nth-child(2)', hold: 60 }] }, targets: [T('pill', '.ps-tabs__pill', ['op', 'rect'], 2)], notes: 'Inbox tabs (fade variant): the pill fades out on the old tab and in on the new one (0.15 s easeOut).' });
add({ id: 'M-035', name: 'LineTabs underline glide', url: stage('SelfieTips · LineTabs', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-ltabs__tab:nth-child(1)', hold: 60 }] }, targets: [T('bar', '.ps-ltabs__bar', ['tf', 'rect']), T('label', '.ps-ltabs__tab', ['color'], 3)], notes: 'Province -> Region.' });
add({ id: 'M-036', name: 'Method picker rail mark + list glide', url: stage('MethodPicker · Pager', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-mpick__rail button, .ps-mpick__cat')].at(-1)" }, hold: 60 }] },
  targets: [T('mark', '.ps-mpick__mark', ['tf', 'rect']), J('list', "() => [document.querySelector('.ps-mpick__list') || document.querySelector('.ps-mpick [class*=list]')]", ['scroll'])], notes: 'Tap the last rail category: mark glides (layoutId) and the list scrolls on a spring.' });
add({ id: 'M-037', name: 'Popover / menu grow from tap', url: stage('FormField · Popover', 2), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-ff__box', hold: 60 }] }, targets: [T('pop', '.ps-pop', ['op', 'tf', 'blur', 'rect', 'css:transform-origin'])], notes: 'Gallery FormField Menu: tap the field -> PopCard grows from the tap (scaleX/scaleY springs with bounce).' });
add({ id: 'M-038', name: 'Menu rows stagger', url: stage('FormField · Popover', 2), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-ff__box', hold: 60 }] }, targets: [T('row', '.ps-pop__opt', ['op', 'tf', 'blur'], 7)], notes: 'Same open as M-037: rows enter with 20 ms + 14 ms per row.' });
add({ id: 'M-039', name: 'Menu pick: row lights up then folds', url: stage('FormField · Popover', 2), ready: STAGE_READY, setup: [{ tap: '.ps-ff__box', hold: 60 }, { wait: 900 }],
  trigger: { waitEvent: 'pointerdown', steps: [{ tap: '.ps-pop__opt:nth-child(2)', hold: 60 }] },
  targets: [T('row', '.ps-pop__opt:nth-child(2)', ['bg']), T('pop', '.ps-pop', ['op', 'tf', 'blur', 'rect']), T('value', '.ps-ff__value', ['text'])], notes: 'Tap row 2 (Freelance): background lights (0.15 s), onPick after 90 ms, menu exits.' });
add({ id: 'M-040', name: 'Popover scroll thumb + bottom fade', url: stage('FormField · Popover', 2), ready: STAGE_READY, setup: [{ tap: '.ps-ff__box', hold: 60 }, { wait: 900 }],
  trigger: { steps: [{ scrollTo: "(() => document.querySelector('.ps-pop__list') || document.querySelector('.ps-pop__opt').parentElement)", to: 'end', ms: 600 }] },
  targets: [T('thumb', '.ps-pop__thumb', ['tf']), T('fade', '.ps-pop__fade', ['op']), J('list', "() => [document.querySelector('.ps-pop__opt').parentElement]", ['scroll'])], notes: 'Menu list scrolled to the end linearly over 600 ms: thumb follows, bottom fade goes (0.15 s) when < 2 px left.' });
add({ id: 'M-041', name: 'Choice sheet pick then close', url: stage('ChoiceSheet', 2), ready: STAGE_READY, setup: [{ tap: '.ps-ff__box', hold: 60 }, { wait: 1200 }],
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-sheet .ps-selbar, .ps-sheet button')].filter(b => !b.classList.contains('ps-close'))[1]" }, hold: 60 }] },
  targets: [T('option', '.ps-sheet .ps-selbar', ['bg', 'bc', 'shadow'], 4), T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: 'Gallery ChoiceSheet From a field: open the sheet, tap the 2nd option: colour 0.15 s, then the sheet closes after 160 ms.' });
add({ id: 'M-042', name: 'Doc card files open/close (close)', url: stage('DocCard · FileRow', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-doc__head', hold: 60 }] }, targets: [T('body', '.ps-doc__body', ['op', 'h', 'rect']), T('chev', '.ps-doc__chev', ['tf'])], notes: 'Gallery DocCard Files (open): tap the head -> closes. Open again in M-042_open.' });
add({ id: 'M-042_open', name: 'Doc card files open', url: stage('DocCard · FileRow', 1), ready: STAGE_READY, setup: [{ tap: '.ps-doc__head', hold: 60 }, { wait: 1000 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-doc__head', hold: 60 }] }, targets: [T('body', '.ps-doc__body', ['op', 'h', 'rect']), T('chev', '.ps-doc__chev', ['tf'])] });
add({ id: 'M-043', name: 'Doc card chevron rotate', url: stage('DocCard · FileRow', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-doc__head', hold: 60 }] }, targets: [J('chev', "() => [document.querySelector('.ps-doc__chev') || document.querySelector('.ps-doc__head > span:last-child span')]", ['tf'])], notes: 'Chevron rotate 0.24 s on close.' });
const DOCS = [{ js: "APP.go('docs')" }, { until: "document.querySelector('.app-docs .ps-doc')" }, { wait: 1200 },
  { js: "APP.pickFile = PS.pickFile = function (a, then) { then(null, new File([new Uint8Array(1153434)], 'Payslip_Sept_2026.pdf', { type: 'application/pdf' })); }" },
  { tap: '.app-docs .ps-doc .ps-doc__head', hold: 40 }, { wait: 800 }];
const DOC1 = '.app-docs .ps-doc:first-of-type';
add({ id: 'M-044', name: 'Doc card subtitle / +->chevron swap', ...app(), setup: DOCS,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-pop__opt:last-child', hold: 60 }] }, maxMs: 3600, minMs: 2700,
  targets: [T('sub', DOC1 + ' .ps-doc__text > span:nth-child(2) > span', ['op', 'tf', 'blur', 'text'], 3), T('icon', DOC1 + ' .ps-doc__head > span:last-child > span', ['op', 'tf', 'blur'], 3), T('body', DOC1 + ' .ps-doc__body', ['op', 'h'])],
  notes: "App proof-of-income page: DocCard add -> 'Choose from files' with PS.pickFile stubbed to hand over a 1.1 MB PDF (no file dialog in headless). The card opens, the + swaps to the chevron and the subtitle swaps as the file goes compressing -> uploading -> done." });
add({ id: 'M-045', name: 'File row status swap + upload bar', ...app(), setup: DOCS,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-pop__opt:last-child', hold: 60 }] }, maxMs: 3600, minMs: 2700,
  targets: [T('bar', '.ps-file__bar > i', ['tf']), T('meta', '.ps-file__main > span:nth-child(2) > span', ['op', 'tf', 'blur', 'text'], 3), T('row', '.ps-file', ['attr:class', 'op', 'tf', 'blur'])],
  notes: 'Same upload as M-044: the row status Swap (y 6) compressing -> uploading -> done; the bar scaleX follows progress (set every 80 ms, no transition) over 1600 ms after a 700 ms compress.' });
add({ id: 'M-046', name: 'Date picker month change (grid crossfade)', url: stage('DatePicker · Wheel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '[aria-label="Next month"]', hold: 60 }] }, targets: [T('grid', '.ps-date__grid', ['op', 'tf', 'blur', 'rect'], 2)], notes: 'Next month arrow: December 2026 -> January 2027 (grid crossfade, popLayout).' });
add({ id: 'M-047', name: 'Date picker month/year label swap', url: stage('DatePicker · Wheel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '[aria-label="Next month"]', hold: 60 }] }, targets: [T('monthLabel', '[aria-label="Choose the month"] > span > span', ['op', 'tf', 'blur', 'text'], 2), T('yearLabel', '[aria-label="Choose the year"] > span > span', ['op', 'tf', 'blur', 'text'], 2)], notes: 'Same tap as M-046: month December -> January and year 2026 -> 2027 swap (y 6).' });
add({ id: 'M-048', name: 'Date picker days <-> wheel crossfade', url: stage('DatePicker · Wheel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '[aria-label="Choose the month"]', hold: 60 }] }, targets: [T('view', '.ps-date__body > *', ['op', 'tf', 'blur', 'rect'], 2)], notes: 'Tap the month label: day grid -> month wheel.' });
add({ id: 'M-049', name: 'Wheel picker', url: stage('DatePicker · Wheel', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: '.ps-wheel__wrap', dy: -90, ms: 240, steps: 12 }] }, maxMs: 3000,
  targets: [T('hiList', '.ps-wheel__hi ul', ['tf']), T('wheelList', '.ps-wheel__wrap > div > ul', ['css:transform']), T('opt', '.ps-wheel__wrap ul > li', ['css:transform', 'op', 'rect'], 5, { byIndex: true })], notes: 'Touch flick up 90 px over 240 ms: library physics (react-wheel-picker 1.2.3). opt[i] are the first 5 rows by DOM index.' });
add({ id: 'M-050', name: 'Selected day circle', url: stage('DatePicker · Wheel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-date__day')].find(d => d.textContent.trim() === '10')" }, hold: 60 }] },
  targets: [J('circle', "() => [...document.querySelectorAll('.ps-date__day')].filter(d => ['24', '10'].includes(d.textContent.trim())).map(d => d.querySelector('i')).filter(Boolean)", ['op'], 2, { byIndex: true }), J('day', "() => [...document.querySelectorAll('.ps-date__day')].filter(d => ['24', '10'].includes(d.textContent.trim()))", ['color'], 2, { byIndex: true })],
  notes: 'Day 24 selected -> tap day 10. circle[0] = day 10, circle[1] = day 24 (DOM order).' });
add({ id: 'M-051', name: 'OTP form resend label swap', url: stage('OtpForm', 0), ready: STAGE_READY, setup: [{ until: "/after 1s/.test(document.querySelector('.ps-otpform__resend').textContent)", timeout: 15000 }],
  trigger: { startWhen: "document.querySelectorAll('.ps-otpform__resend .ps-btn > span > span').length > 1" }, maxMs: 2500,
  targets: [T('label', '.ps-otpform__resend .ps-btn > span > span', ['op', 'tf', 'blur', 'text'], 2), T('button', '.ps-otpform__resend .ps-btn', ['bg', 'color', 'rect'])], notes: 'Gallery OtpForm Live: countdown 9 s reaches 0 -> "Resend code after 1s" swaps to "Resend". t=0 = first frame both labels exist.' });
add({ id: 'M-052', name: 'Coin loading -> success', url: stage('Loader · Coin · Dots · Busy', 1), ready: STAGE_READY, settleBefore: 1500,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-btn')].find(b => b.textContent.trim() === 'Finish')" }, hold: 60 }] }, maxMs: 3500, settleMs: 500,
  targets: [{ name: 'lottie', lottie: true }, T('coin', '.ps-coin', ['op', 'rect'])], notes: 'Finish: the loading loop finishes its loop, then success-coin plays once. Lottie frames per registered animation.' });
add({ id: 'M-053', name: 'Loading dots', url: stage('Loader · Coin · Dots · Busy', 2), trigger: { nav: true }, loop: true, maxMs: 2500, targets: [{ name: 'lottie', lottie: true }], notes: 'Loop.' });
add({ id: 'M-054', name: 'Loader (coin + dots)', url: stage('Loader · Coin · Dots · Busy', 0), trigger: { nav: true }, loop: true, maxMs: 3000, targets: [{ name: 'lottie', lottie: true }], notes: 'Loop (coin + dots lotties).' });
add({ id: 'M-055', name: 'Busy dots pulse', url: stage('Loader · Coin · Dots · Busy', 3), trigger: { nav: true }, loop: true, maxMs: 2200, targets: [T('dot', '.ps-busy > i', ['op'], 3)], notes: 'CSS keyframes 0.9 s infinite; t=0 = navigation start.' });
add({ id: 'M-056', name: 'Overlay fade (in)', url: stage('Overlay', 0), ready: STAGE_READY, setup: [{ tap: { js: "() => [...document.querySelectorAll('.ps-btn')].find(b => b.textContent.trim() === 'Hide')" }, hold: 40 }, { wait: 700 }],
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-btn')].find(b => b.textContent.trim() === 'Show it')" }, hold: 60 }] }, targets: [T('overlay', '.ps-overlay', ['op'])] });
add({ id: 'M-056_out', name: 'Overlay fade (out)', url: stage('Overlay', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-btn')].find(b => b.textContent.trim() === 'Hide')" }, hold: 60 }] }, targets: [T('overlay', '.ps-overlay', ['op'])] });
add({ id: 'M-057', name: 'Coupon ticket select (colour only)', url: stage('CouponTicket', 2), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-ticket', hold: 60 }] }, targets: [T('ticket', '.ps-ticket', ['dfilter', 'attr:class']), T('shape', '.ps-ticket__shape', ['dfilter']), T('bar', '.ps-ticket__bar', ['op'])], notes: 'Gallery CouponTicket Picker (selected) -> tap: deselected. Reverse in M-057_on.' });
add({ id: 'M-057_on', name: 'Coupon ticket select (on)', url: stage('CouponTicket', 2), ready: STAGE_READY, setup: [{ tap: '.ps-ticket', hold: 40 }, { wait: 600 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-ticket', hold: 60 }] }, targets: [T('ticket', '.ps-ticket', ['dfilter', 'attr:class']), T('shape', '.ps-ticket__shape', ['dfilter']), T('bar', '.ps-ticket__bar', ['op'])] });
add({ id: 'M-058', name: 'Coupon option select', url: stage('CouponOption', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-copt', hold: 60 }] }, targets: [T('card', '.ps-copt__card', ['shadow', 'afterOp', 'afterShadow']), T('check', '.ps-copt .ps-check', ['bg', 'bc'])], notes: 'Gallery CouponOption Pick: off -> selected.' });
const LOANPAGE = { ...app(), setup: [{ js: "APP.S.L = APP.freshLoan(45000, 6, null); APP.go('loan')" }, { until: "document.querySelector('.ps-crow')" }, { wait: 1200 }], setupText: "APP.S.L = APP.freshLoan(45000, 6, null) (₱45,000 · 6 terms, coupons d20 + l5 on); APP.go('loan')" };
add({ id: 'M-059', name: 'Coupon row sub-line swap', ...LOANPAGE,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-crow:nth-of-type(1)', hold: 60 }] }, targets: [J('sub', "() => [...document.querySelectorAll('.ps-crow')][0].querySelectorAll('.ps-crow__text > span:nth-child(2) > span')", ['op', 'tf', 'blur', 'text'], 2)],
  notes: "App loan page (APP.go('loan') with a ₱45,000 · 6-term loan): tap the first coupon row (20% off, on -> off): its sub line swaps (y 8)." });
const PICK0 = [{ js: "APP.open('picker')" }, { wait: 1300 }, { tap: '.ps-sheet .ps-copt.is-on', hold: 40 }, { wait: 800 }, { tap: '.ps-sheet .ps-tabs__tab:nth-child(2)', hold: 40 }, { wait: 900 }];
const SUMT = [T('chips', '.ps-summary__chips', ['op', 'h', 'rect']), T('chip', '.ps-summary__chiprow > span', ['op', 'tf', 'blur', 'rect', 'text'], 3), T('total', '.ps-summary__total', ['rect'])];
add({ id: 'M-060', name: 'Summary chips row open/close (close)', ...app(), setup: PICK0,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-sheet .ps-copt.is-on', hold: 60 }] }, targets: SUMT,
  notes: 'Coupon picker: discount already taken off, Limit increase tab: tap the selected limit coupon -> the last chip leaves and the chips row closes (height SPRING, opacity LEAVE).' });
add({ id: 'M-060_open', name: 'Summary chips row open/close (open)', ...app(), setup: [...PICK0, { tap: '.ps-sheet .ps-copt.is-on', hold: 40 }, { wait: 1000 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-sheet .ps-copt:not(.is-off)', hold: 60 }] }, targets: SUMT,
  notes: 'From no coupon: tap the first limit coupon -> the chips row opens and the chip enters.' });
add({ id: 'M-061', name: 'Summary chip in/out + reflow', ...app(), setup: [{ js: "APP.open('picker')" }, { wait: 1300 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-sheet .ps-copt.is-on', hold: 60 }] }, targets: SUMT,
  notes: 'Coupon picker (Saved + New limit chips): tap the selected discount -> the Saved chip leaves (opacity 0, scale 0.94, LEAVE) and the New limit chip slides into its place (layout position on SPRING).' });
add({ id: 'M-062', name: 'Coupon picker tab list crossfade', ...app(), setup: [{ js: "APP.open('picker')" }, { wait: 1300 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-sheet .ps-tabs__tab:nth-child(2)', hold: 60 }] }, targets: [T('pill', '.ps-sheet .ps-tabs__pill', ['tf', 'rect']), J('list', "() => { const t = document.querySelector('.ps-sheet .ps-tabs'); const s = document.querySelector('.ps-sheet .ps-copt'); let n = s; while (n && n.parentElement && !n.parentElement.contains(t)) n = n.parentElement; return n ? [...n.parentElement.children].filter(c => !c.contains(t)) : []; }", ['op', 'tf', 'blur', 'rect'], 3)],
  notes: 'Coupon picker: Discount -> Limit increase: glass tabs pill glides, the list crossfades (y 10).' });
add({ id: 'M-063', name: 'Decision carousel (Keep your coupon?)', url: stage('Decision', 3), ready: STAGE_READY, settleBefore: 1200,
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: '.ps-carousel__view', dx: -160, ms: 220, steps: 12 }] }, targets: [T('track', '.ps-carousel__track', ['tf']), T('dot', '.ps-pager i', ['w', 'op'], 3), { name: 'gsap', gsap: true }],
  notes: 'Gallery Decision Two coupons: swipe left 160 px over 220 ms -> next coupon; the GSAP coupon art of the shown page plays.' });
add({ id: 'M-064', name: 'Carousel swipe / settle', url: stage('Carousel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: '.ps-carousel__view', dx: -140, ms: 200, steps: 10 }] }, targets: [T('track', '.ps-carousel__track', ['tf'])], notes: 'Swipe left 140 px over 200 ms then release: settles on page 2 (SPRING).' });
add({ id: 'M-064_index', name: 'Carousel index change (Next)', url: stage('Carousel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.st .ps-btn', hold: 60 }] }, targets: [T('track', '.ps-carousel__track', ['tf'])], notes: 'Next button (index prop) -> animate x on SPRING.' });
add({ id: 'M-065', name: 'Pager dot follows the swipe', url: stage('Carousel', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: '.ps-carousel__view', dx: -140, ms: 200, steps: 10 }] }, targets: [T('dot', '.ps-pager i', ['w', 'op'], 3, { byIndex: true }), T('fill', '.ps-pager i > b', ['op'], 3, { byIndex: true }), T('track', '.ps-carousel__track', ['tf'])], notes: 'Same swipe as M-064.' });
add({ id: 'M-066', name: 'Scam tips carousel + Next/I understand swap', url: stage('ScamTips', 0), ready: STAGE_READY, settleBefore: 1500,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-scams .ps-btn--primary', hold: 60 }] }, targets: [T('track', '.ps-scams .ps-carousel__track', ['tf']), T('btnLabel', '.ps-scams .ps-btn--primary > span > span', ['op', 'tf', 'blur', 'text'], 2), { name: 'lottie', lottie: true }],
  notes: 'Gallery ScamTips sheet: Next -> card 2 (carousel x on spring), the active card animation replays.' });
add({ id: 'M-066_last', name: 'Scam tips: last card Next -> I understand swap', url: stage('ScamTips', 0), ready: STAGE_READY, settleBefore: 1500, setup: [{ tap: '.ps-scams .ps-btn--primary', hold: 40 }, { wait: 900 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-scams .ps-btn--primary', hold: 60 }] }, targets: [T('track', '.ps-scams .ps-carousel__track', ['tf']), T('btnLabel', '.ps-scams .ps-btn--primary > span > span', ['op', 'tf', 'blur', 'text'], 2)], notes: 'Card 2 -> 3: the button label swaps Next -> I understand.' });
add({ id: 'M-067', name: 'Scam strip marquee', url: stage('Installment · PayBar · PayDock · ScamStrip', 6), trigger: { nav: true }, loop: true, maxMs: 4000, targets: [T('run', '.ps-scamstrip__run', ['tf'])], notes: 'CSS 14 s linear infinite, first 12 % (1.68 s) held at 0: only the first 4 s recorded (constant 600 px / 12.32 s after the hold).' });
add({ id: 'M-068', name: 'Partner logos marquee', url: stage('DotTitle · Banners · PartnerLogos', 1), trigger: { nav: true }, loop: true, maxMs: 3000, targets: [T('track', '.ps-marquee__track', ['tf', 'w'])], notes: 'WAAPI linear 28 px/s infinite.' });
add({ id: 'M-069', name: 'Accordion close / chevron', url: stage('Accordion', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-acc__head', hold: 60 }] }, targets: [T('body', '.ps-acc__body', ['op', 'h', 'rect']), T('chev', '.ps-acc__head > span:last-child', ['tf'])], notes: 'Open -> closed. Opening in M-069_open.' });
add({ id: 'M-069_open', name: 'Accordion open / chevron', url: stage('Accordion', 0), ready: STAGE_READY, setup: [{ tap: '.ps-acc__head', hold: 40 }, { wait: 900 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-acc__head', hold: 60 }] }, targets: [T('body', '.ps-acc__body', ['op', 'h', 'rect']), T('chev', '.ps-acc__head > span:last-child', ['tf'])] });
add({ id: 'M-070', name: 'Amount slider: finger-follow', url: stage('Slider', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: '.ps-slider__knob', dx: -120, ms: 480, steps: 24 }] }, targets: [T('fill', '.ps-slider__fill', ['tf', 'rect']), T('rail', '.ps-slider__rail', ['tf', 'rect']), T('ends', '.ps-slider__ends > span:last-child', ['text'])],
  notes: 'Knob dragged 120 px left over 480 ms (24 moves, linear): fill/knob follow the finger with no easing.' });
const LOANPAGE_ROW2 = "() => [...document.querySelectorAll('.ps-crow')][1]";
add({ id: 'M-071', name: 'Amount slider glide (coupon)', ...LOANPAGE,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: LOANPAGE_ROW2 }, hold: 60 }] }, maxMs: 2500,
  targets: [T('fill', '.ps-amountcard .ps-slider__fill', ['tf']), T('rail', '.ps-amountcard .ps-slider__rail', ['tf', 'rect']), T('amount', '.ps-amountcard__amt .ps-amount', ['text']), T('maxLabel', '.ps-amountcard .ps-slider__ends > span:last-child', ['text'])],
  notes: 'App loan page (₱45,000 · 6 terms): tap the +₱5,000 limit coupon row (on -> off): the max goes 50,000 -> 45,000 with the amount unchanged, so the knob / fill glide to the end on the spring (useGlide).' });
add({ id: 'M-072', name: 'Slider right end (max) swap', ...LOANPAGE,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: LOANPAGE_ROW2 }, hold: 60 }] }, maxMs: 2500,
  targets: [J('end', "() => [...document.querySelectorAll('.ps-amountcard .ps-slider__ends > span:last-child > span')]", ['op', 'tf', 'blur', 'text', 'color'], 2)], notes: 'Same take as M-071: the right end label swaps (y 6) from the boosted (green) max to the normal one.' });
add({ id: 'M-073', name: 'Agreement nudge ripple', url: stage('Check · Agreement', 2), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.st .ps-btn', hold: 60 }] }, maxMs: 2000, targets: [T('halo', '.ps-agree__halo', ['op', 'tf'])], notes: 'Inactive Confirm tapped: nudge +1 -> halo scale 1 -> 2.4, opacity 0.6 -> 0, twice.' });
add({ id: 'M-074', name: 'Amount entry: typed digit in', url: stage('AmountEntry', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-key[aria-label="0"]', hold: 60 }] }, targets: [T('char', '.ps-aentry__typed > span', ['op', 'tf', 'blur', 'text'], 6), T('caret', '.ps-aentry__caret', ['rect'])], notes: 'Typed 125 -> key 0 -> 1250 (12,500 -> ...). Delete in M-074_out.' });
add({ id: 'M-074_out', name: 'Amount entry: typed digit out (delete)', url: stage('AmountEntry', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-key[aria-label="Delete"]', hold: 60 }] }, targets: [T('char', '.ps-aentry__typed > span', ['op', 'tf', 'blur', 'text'], 6), T('caret', '.ps-aentry__caret', ['rect'])] });
add({ id: 'M-075', name: 'Caret blink', url: stage('AmountEntry', 0), trigger: { nav: true }, loop: true, maxMs: 2500, targets: [T('caret', '.ps-aentry__caret', ['op'])], notes: 'CSS steps(1,end) 1.06 s infinite.' });
add({ id: 'M-076', name: 'Amount entry hint/error swap', url: stage('AmountEntry', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-key[aria-label="9"]', hold: 60 }] }, targets: [J('line', "() => [...document.querySelectorAll('.ps-aentry__top > span > span')]", ['op', 'tf', 'blur', 'text', 'color'], 2)], notes: '125 -> 1259 (₱125,900 > ₱50,000): hint swaps to the error (y 8).' });
add({ id: 'M-077', name: 'ID side tick pop', url: stage('IdSideCard', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-btn')].find(b => b.textContent.trim() === 'Camera')" }, hold: 60 }] }, minMs: 700, maxMs: 2000,
  targets: [T('tick', '.ps-idside__tick', ['op', 'tf']), T('pic', '.ps-idside__pic', ['attr:class'])], notes: 'Gallery IdSideCard Added: Camera clears the picture, 400 ms later it is added again -> tick pops (SPRING).' });
add({ id: 'M-078', name: 'Selfie dashed ring spin', url: stage('Selfie', 1), trigger: { nav: true, startWhen: "document.querySelector('.ps-selfie__dash')" }, loop: true, maxMs: 2500, targets: [T('dash', '.ps-selfie__dash', ['op', 'tf'])], notes: 'Gallery Selfie Checking: rotate 8 s linear infinite; t=0 = first frame the ring exists.' });
add({ id: 'M-079', name: 'Selfie state label / ring colour', ...app(), setup: [{ js: "APP.go('kyc-selfie')" }, { wait: 1300 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-bot .ps-btn', hold: 60 }] }, maxMs: 1500,
  targets: [T('ring', '.ps-selfie__ring', ['bg']), T('state', '.ps-selfie__state', ['op', 'tf', 'blur', 'text', 'attr:class'], 2)], notes: 'App selfie page: Next (shutter) -> checking: Uploading label enters (fade y 8), ring background changes (0.15 s). After 1600 ms the app moves on.' });
add({ id: 'M-080', name: 'Face camera shot fade + hint/actions swap', url: stage('FaceCamera', 0), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-shutter', hold: 60 }] }, targets: [T('shot', '.ps-face__oval img', ['op']), T('hint', '.ps-face__hint > span > span', ['op', 'tf', 'blur', 'text'], 2), T('acts', '.ps-face__bot > *', ['op', 'tf', 'blur', 'rect'], 2)],
  notes: 'Gallery FaceCamera: shutter -> photo fades in (ENTER), hint swaps, actions crossfade.' });
add({ id: 'M-081', name: 'Places sheet list crossfades', url: stage('PlacePicker', 0), ready: STAGE_READY, settleBefore: 1500,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-places__row', hold: 60 }] },
  targets: [T('list', '.ps-places__card > *:not(.ps-ltabs)', ['op', 'tf', 'blur', 'rect'], 3), T('bar', '.ps-ltabs__bar', ['tf', 'rect'])], notes: 'Gallery PlacePicker: tap the first region -> the list crossfades to provinces (y 10) and the line tab moves.' });
add({ id: 'M-082', name: 'Help vote swap', url: stage('Article · Feedback · RelatedLinks', 1), ready: STAGE_READY,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-vote__chip:nth-child(1)', hold: 60 }] }, targets: [T('line', '.ps-vote > span > span', ['op', 'tf', 'blur', 'text'], 2), T('chip', '.ps-vote__chip', ['bg', 'color', 'bc'], 2)], notes: 'Gallery Feedback: Yes -> thanks (Swap) + chip colour.' });
add({ id: 'M-083', name: 'Rating sheet steps crossfade', url: stage('Rating', 0), ready: STAGE_READY, settleBefore: 1500,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-rating .ps-btn--primary', hold: 60 }] },
  targets: [T('page', '.ps-rating__page', ['op', 'blur', 'tf', 'attr:class'], 3, { byIndex: true }), T('title', '.ps-rating .ps-shead > span > span', ['op', 'tf', 'blur', 'text'], 2)], notes: 'Gallery Rating: tap the positive answer on the ask page -> good page crossfades in (opacity + blur, no y).' });
add({ id: 'M-084', name: 'Account menu badge swap', ...app(), setup: [{ js: "APP.home('account', 0)" }, { wait: 1400 }],
  trigger: { js: "APP.set({ coupons: APP.S.coupons.slice(0, 1) })" }, targets: [J('badge', "() => [...document.querySelectorAll('.ps-menu__item')][1].querySelectorAll(':scope > span:last-child > span > span')", ['op', 'tf', 'blur', 'text'], 2)],
  notes: "Synthetic: the coupon count is changed through APP.set (6 coupons -> 1) on the Account tab so the Coupons badge Swap runs. If no change was captured the badge is not tied to that state." });
add({ id: 'M-085', name: 'Empty state animation', url: stage('EmptyState', 0), trigger: { nav: true }, loop: true, maxMs: 3000, targets: [{ name: 'lottie', lottie: true }], notes: 'Gallery EmptyState (Empty box): intro then loop. Same player for Result / SendingCard / Fallback.' });
add({ id: 'M-086', name: 'Splash logo grow-in', url: stage('Splash · SendingCard', 0), trigger: { nav: true, startWhen: "document.querySelector('.ps-splash img')" }, maxMs: 1500, targets: [T('logo', '.ps-splash img', ['op', 'tf', 'rect'])], notes: 't=0 = first frame the logo exists (mount).' });

/* ---------------- Order submit (app overlay) ---------------- */
const OSUB = { ...app(), trigger: { js: 'APP.set({ submitting: {} })' } };
add({ id: 'M-087', name: 'Order submit: letter rise-in', ...OSUB, maxMs: 1600, minMs: 1200,
  targets: [T('letter', '.ps-osub__l', ['op', 'tf', 'blur'], 28)], notes: 'APP.set({ submitting: {} }) opens the overlay with PS.OrderSubmit: line 1 letters rise in (560 ms each, 16 ms apart). letter#k = k-th letter (spaces not counted).' });
add({ id: 'M-088', name: 'Order submit: letter rise-out', ...app(), setup: [{ js: 'APP.set({ submitting: {} })' }, { wait: 1800 }],
  trigger: { startWhen: "(() => { const l = document.querySelector('.ps-osub__l'); return l && l.getAnimations().some(a => { const k = a.effect.getKeyframes(); return k.length && /-10px/.test(k[k.length - 1].transform || ''); }); })()" }, maxMs: 1400, minMs: 900,
  targets: [T('letter', '.ps-osub__l', ['op', 'tf', 'blur'], 28)], notes: 't=0 = first frame the out animation of line 1 exists (timer at 560 + 16*(n-1) + 1500 ms after mount).' });
add({ id: 'M-089', name: 'Order submit: counting dots', ...app(), setup: [{ js: 'APP.set({ submitting: {} })' }, { wait: 3200 }],
  trigger: { startWhen: "(() => { const d = document.querySelector('[data-dot=\"1\"]'); return d && d.getAnimations().some(a => a.effect.getTiming().iterations === Infinity); })()" }, loop: true, maxMs: 4200,
  targets: [T('dot', '.ps-osub__l[data-dot]:not([data-dot="0"])', ['op'], 3)], notes: 't=0 = first frame the dots loop exists (line 2 fully in + 40 ms). 2000 ms linear infinite; recorded through two cycles.' });
add({ id: 'M-090', name: 'Order submit: master timeline', ...OSUB, maxMs: 15000, minMs: 11000, settleMs: 600,
  targets: [J('line', "() => [document.querySelector('.ps-osub')]", ['attr:aria-label']), J('firstLetter', "() => [document.querySelector('.ps-osub__l')]", ['op', 'tf', 'blur', 'text']), J('lastLetter', "() => [[...document.querySelectorAll('.ps-osub__l')].pop()]", ['op', 'tf', 'blur', 'text']), { name: 'lottie', lottie: true }, T('overlay', '.ps-overlay', ['op']), T('page', '.ps-frame > .ps-page', ['op'], 2)],
  notes: 'Whole Order submit from mount to onDone and the crossfade to home: line 1 / 2 / 3 (aria-label), first and last letter of the current line, coin lotties, overlay opacity.' });

/* ---------------- OTP sheet (app) ---------------- */
const OTP_STEP = { startWhen: "document.querySelector('.ps-otp__box')", steps: [{ tap: { js: OTP_BTN }, hold: 60 }] };
add({ id: 'M-091', name: 'OTP sheet: middle height morph', ...app(), setup: OTP_OPEN, trigger: OTP_STEP,
  targets: [T('mid', '.ps-otps__mid', ['h', 'rect']), T('sheet', '.ps-otps', ['rect'])], notes: 'Get verification code -> step 1: .ps-otps__mid height 48 -> 60 on SPRING; t=0 = first frame of step 1 (boxes exist).' });
add({ id: 'M-092', name: 'OTP sheet: pane crossfade', ...app(), setup: OTP_OPEN, trigger: OTP_STEP,
  targets: [T('pane', '.ps-otps__pane', ['op', 'tf', 'blur', 'rect'], 2)], notes: 'phone pane leaves, code pane enters (y 10, popLayout).' });
add({ id: 'M-093', name: 'OTP sheet: title / description / button swaps', ...app(), setup: OTP_OPEN, trigger: OTP_STEP,
  targets: [T('title', '.ps-otps__head > span > span', ['op', 'tf', 'blur', 'text'], 2), T('desc', '.ps-otps__top > span > span', ['op', 'tf', 'blur'], 2), J('button', "() => [...document.querySelectorAll('.ps-otps .ps-btn')].pop()", ['bg', 'color', 'text'])],
  notes: 'Title Verify it’s you -> Enter code, description swap (block y 10). The countdown button text then ticks each second.' });
add({ id: 'M-094', name: 'OTP sheet: auto-typed code', url: '/prototypes/app/index.html?fast=1', ready: APP_READY, settleBefore: 1700, setup: OTP_OPEN, trigger: OTP_STEP, minMs: 1800, maxMs: 3500,
  targets: [T('digit', '.ps-otp__box > span', ['op', 'tf', 'text'], 6), T('box', '.ps-otp__box', ['bc', 'color'], 6), T('sheet', '.ps-otps', ['tf'])], notes: 'Auto typing on (no ?auto=0): digit i typed at 900 + i*110 ms after step 1, each pops (0.18 s); then verify (450–950 ms random) and the sheet closes.' });
add({ id: 'M-055_otp', name: 'Busy dots in the OTP sheet button', ...app(), setup: OTP_OPEN, trigger: { waitEvent: 'click', steps: [{ tap: { js: OTP_BTN }, hold: 60 }] }, maxMs: 1000, loop: true,
  targets: [T('dot', '.ps-otps .ps-busy > i', ['op'], 3)], notes: 'Busy dots shown while the code is sent (random 500–1200 ms).' });
add({ id: 'M-134', name: 'Keep your coupon? decision', ...LOANPAGE,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-term:nth-child(1)', hold: 60 }] }, maxMs: 2500,
  targets: [T('sheet', '.ps-sheet--card', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op']), T('track', '.ps-sheet .ps-carousel__track', ['tf']), { name: 'gsap', gsap: true }],
  notes: "App loan page (₱45,000 · 6 terms, 20% off needs 6 / 8 terms): tap 4 terms -> the coupon comes off and the card sheet 'Keep your coupon?' slides up with the coupon art (GSAP)." });
add({ id: 'M-018', name: 'GSAP coupon animation loader', url: stage('Countdown · CouponArt', 2), trigger: { nav: true, startWhen: "document.querySelector('.ps-cart__anim svg')" }, loop: true, maxMs: 3000,
  targets: [{ name: 'gsap', gsap: true }, J('artGroup', "() => [...document.querySelectorAll('.ps-cart__anim svg > g')]", ['op', 'tf', 'attr:transform', 'attr:opacity'], 3)], notes: 'Gallery CouponArt Animated (three coupon types): GSAP global timeline time and the top-level SVG groups. Plays to its loop marker, then loops.' });
add({ id: 'M-019', name: 'Navigator tab pill glide', ...app(), trigger: { waitEvent: 'click', steps: [{ tap: '.ps-nav__tab:nth-of-type(2)', hold: 60 }] },
  targets: [T('pill', '.ps-nav__pill', ['tf', 'rect']), T('tab', '.ps-nav__tab', ['tf', 'color'], 3, { byIndex: true })], notes: 'App home: tap Payment. Pill layoutId FLIP on SPRING; tabs also press 0.985 (press starts at pointerdown, before t=0).' });
add({ id: 'M-125', name: 'Tab switch (Home / Payment / Account)', ...app(), trigger: { waitEvent: 'click', steps: [{ tap: '.ps-nav__tab:nth-of-type(3)', hold: 60 }] },
  targets: [T('tabPage', '.app-tabs > .ps-page', ['op', 'css:z-index'], 3), T('pill', '.ps-nav__pill', ['rect'])], notes: 'App home -> Account tab: page crossfade (dir 0) + nav pill glide.' });
add({ id: 'M-123', name: 'App opening: splash -> home', url: '/prototypes/app/index.html?auto=0&fast=1', trigger: { nav: true, startWhen: "document.querySelector('.ps-splash')" }, maxMs: 3500, minMs: 1800,
  targets: [T('logo', '.ps-splash img', ['op', 'tf']), T('page', '.ps-frame > .ps-page', ['op'], 3), T('card', '.ps-home-in > *', ['op', 'tf', 'blur'], 5)], notes: 'Page load: splash logo grows in, after a random 900–1500 ms APP.home crossfades to home, whose cards rise. t=0 = first frame the splash exists.' });
add({ id: 'M-124', name: 'Home first show: cards rise', url: '/prototypes/app/index.html?auto=0&fast=1', trigger: { nav: true, startWhen: "document.querySelector('.ps-home-in')" }, maxMs: 2000,
  targets: [T('card', '.ps-home-in > *', ['op', 'tf', 'blur'], 6)], notes: 'First home render after the splash: PS.rise(col, {delay 120}). t=0 = first frame the home column exists.' });
add({ id: 'M-126', name: 'Page push / pop / swap (pop)', ...app(), setup: [{ js: "APP.go('about')" }, { wait: 1200 }], trigger: { js: 'APP.back()' },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'css:z-index'], 3)], notes: 'APP.back() (dir -1): crossfade like dir 1 (push is M-008).' });
add({ id: 'M-126_swap', name: 'Page swap (dir 0)', ...app(), setup: [{ js: "APP.go('about')" }, { wait: 1200 }], trigger: { js: "APP.swap('faqs')" },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'css:z-index'], 3)], notes: "APP.swap('faqs')." });
add({ id: 'M-126_reduced', name: 'Page pop (prefers-reduced-motion: reduce)', reduced: true, ...app(), setup: [{ js: "APP.go('about')" }, { wait: 1200 }], trigger: { js: 'APP.back()' },
  targets: [T('page', '.ps-frame > .ps-page', ['op', 'tf', 'css:z-index'], 3)], notes: 'Reduced motion: opacity crossfade still runs.' });
add({ id: 'M-128', name: 'Action wait loader (APP.run)', url: '/prototypes/app/index.html?auto=0', ready: APP_READY, settleBefore: 2400,
  trigger: { js: "APP.run(function () {}, { min: 900, max: 900 })" }, minMs: 1000, maxMs: 2000,
  targets: [T('overlay', '.ps-overlay', ['op'], 2)], notes: 'APP.run with a fixed 900 ms wait (no ?fast): the overlay appears at 380 ms (in 0.2 s) and leaves at 900 ms (LEAVE).' });
add({ id: 'M-129', name: 'Toast on every say()', ...app(), trigger: { js: "APP.say('Your loan is now ₱6,000 · 6 terms.', 1200)" }, minMs: 1400, maxMs: 2500,
  targets: [T('toast', '.ps-toast', ['op', 'tf', 'blur', 'rect'], 2)], notes: 'APP.say(text, 1200): enters, then leaves after 1200 ms.' });
add({ id: 'M-130', name: 'Tooltip on tap (app)', ...app(), setup: [{ js: "APP.go('hub')" }, { wait: 1300 }],
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => { const b = [...document.querySelectorAll('.ps-frame button')].find(b => /info/i.test(b.getAttribute('aria-label') || '') || b.querySelector('[style*=info]')); return b; }" }, hold: 60 }] },
  targets: [T('tip', '.ps-tip', ['op', 'tf', 'blur', 'rect', 'css:transform-origin'])], notes: 'Credit limit hub: tap the info mark -> APP.tipAt.' });
add({ id: 'M-131', name: 'Sheets host (page sheet)', ...app(), trigger: { js: "APP.open('paymethods')" },
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: "APP.open('paymethods') — a page sheet (flat scrim). Card sheet: M-013; plain: M-131_plain." });
add({ id: 'M-131_plain', name: 'Sheets host (plain sheet)', ...app(), trigger: { js: "APP.open('plan')" },
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('scrim', '.ps-scrim', ['op'])], notes: "APP.open('plan')." });
add({ id: 'M-135', name: 'Anti-scam cards before paying', ...app(), trigger: { js: "APP.open('scams')" }, maxMs: 2500,
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('track', '.ps-carousel__track', ['tf']), { name: 'lottie', lottie: true }], notes: "APP.open('scams'): card sheet with the anti-scam carousel; the first card's animation plays. Card change: M-066." });
add({ id: 'M-136', name: 'Loan page: Confirm before agreement -> scroll + nudge', ...LOANPAGE,
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-bot .ps-btn', hold: 60 }] }, maxMs: 3000, settleMs: 400,
  targets: [T('scroller', '.ps-frame .ps-scroll', ['scroll']), T('halo', '.ps-agree__halo', ['op', 'tf'])], notes: 'Inactive Confirm: the page scrolls to the agreement on SPRING (restDelta 0.5), nudge ripple x2 when within 24 px.' });
add({ id: 'M-137', name: 'Selfie checking hides the page parts', ...app(), setup: [{ js: "APP.go('kyc-selfie')" }, { wait: 1300 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-bot .ps-btn', hold: 60 }] }, maxMs: 1500,
  targets: [T('head', '.ps-frame .ps-col > div:first-child', ['op']), T('tips', '.ps-selfie__tips', ['op']), J('bottom', "() => [document.querySelector('.ps-bot .ps-btn').parentElement]", ['op'])], notes: 'Shutter -> checking: head, tips and bottom button fade out on LEAVE; the app moves on after 1600 ms.' });
add({ id: 'M-138', name: 'ID type chosen: sides block fades in', ...app(), setup: [{ js: "APP.go('kyc-id')" }, { wait: 1300 }, { tap: '.ps-ff__box', hold: 40 }, { wait: 800 }],
  trigger: { startWhen: "document.querySelector('.ps-frame .app-stack-20')", steps: [{ tap: '.ps-pop__opt', hold: 60 }] }, targets: [T('sides', '.ps-frame .app-stack-20', ['op', 'tf', 'blur', 'rect'])],
  notes: 'Pick the first ID type in the menu: the sides block fades in (y 10). t=0 = first frame the block exists.' });
add({ id: 'M-139', name: 'Rating sheet after order', ...app(), trigger: { js: "APP.open('rating')" }, maxMs: 2500,
  targets: [T('sheet', '.ps-sheet', ['tf', 'rect']), T('page', '.ps-rating__page', ['op', 'blur'], 3, { byIndex: true }), { name: 'lottie', lottie: true }], notes: "APP.open('rating') (what the app does 900 ms after home with Tune rating on). Step change: M-083." });
add({ id: 'M-132', name: 'Loan submit chain: code -> Order submit -> home', url: '/prototypes/app/index.html?fast=1', ready: APP_READY, settleBefore: 1700,
  setup: [{ js: "APP.S.L = APP.freshLoan(45000, 6, null); APP.go('loan')" }, { until: "document.querySelector('.ps-agree')" }, { wait: 1200 }, { js: "document.querySelector('.ps-agree').click()" }, { wait: 500 }],
  trigger: { waitEvent: 'click', steps: [{ tap: '.ps-bot .ps-btn', hold: 60 }, { wait: 1200 }, { tap: { js: OTP_BTN }, hold: 60 }] }, maxMs: 26000, minMs: 21000, settleMs: 800,
  targets: [T('otpSheet', '.ps-otps', ['tf']), T('overlay', '.ps-overlay', ['op'], 2), J('osub', "() => [document.querySelector('.ps-osub')]", ['attr:aria-label']), T('page', '.ps-frame > .ps-page', ['op'], 2), T('toast', '.ps-toast', ['op', 'text'], 2)],
  notes: 'Loan page, agreement ticked, Confirm -> OTP sheet; Get verification code (tapped 1.2 s later) -> auto-typed code -> verified -> Order submit overlay -> home crossfade -> toast. Long sequence with random waits (send 500–1200 ms, verify 450–950 ms).' });

/* ---------------- Withdraw demo (standalone, prototypes/withdraw-fund-flow/index.html) ---------------- */
const WDI = "(window.APP && APP.wd && APP.wd.sheet && APP.wd.sheet() ? APP.wd.sheet() : __u.wd())";
const R_ = k => `() => [${WDI}._r.${k}]`;
const WD = { url: '/prototypes/withdraw-fund-flow/index.html', ready: "document.querySelector('.ps-home-in') && [...document.querySelectorAll('span')].some(s => s.textContent === 'Withdraw')", settleBefore: 1000 };
const OPEN = [{ tap: { js: R_('hcPill').replace('() => [', '() => (').replace(/\]$/, ')') }, hold: 60 }, { wait: 1600 }];
const CONFIRM = [...OPEN, { tap: { js: R_('chip6').replace('() => [', '() => (').replace(/\]$/, ')') }, hold: 60 }, { wait: 1900 }];
const TAPR = (k, hold = 60, ev = 'click') => ({ waitEvent: ev, steps: [{ tap: { js: R_(k).replace('() => [', '() => (').replace(/\]$/, ')') }, hold }] });
const LOANROOT = `() => [${WDI}._r.loanScroll.parentElement]`;
const KEYS = '() => __u.keys()';
const MORPH_T = [J('card', R_('card'), ['rect', 'radius', 'pad', 'tf', 'bg']), J('label', R_('label'), ['tf', 'color', 'rect']), J('row', R_('row'), ['tf', 'h', 'rect']), J('peso', R_('peso'), ['fs', 'ls', 'tf', 'rect']),
  J('num', R_('num'), ['fs', 'ls', 'rect']), J('dec', R_('dec'), ['op', 'fs', 'rect']), J('caretFade', R_('caretFade'), ['op']), J('slider', R_('slider'), ['op', 'tf', 'rect']), J('divider', R_('divider'), ['op', 'rect']),
  J('term', R_('term'), ['op', 'tf', 'rect']), J('chips', R_('chips'), ['op', 'tf', 'rect']), J('cap', R_('cap'), ['op', 'tf']), J('grad', R_('grad'), ['op', 'tf']), J('btnWrap', R_('btnWrap'), ['op', 'tf']), J('loanRoot', LOANROOT, ['tf', 'rect'])];
add({ id: 'M-096', name: 'Withdraw pill press', ...WD, trigger: TAPR('hcPill', 220, 'pointerdown'), maxMs: 800, settleMs: 200,
  targets: [J('pill', R_('hcPill'), ['tf', 'rect'])], notes: 'Withdraw demo home: touch held 220 ms on the Withdraw pill (press 60 ms in / out); the release opens the loan screen.' });
add({ id: 'M-097', name: "Withdraw pill opens into 'unavailable' message", ...WD, setup: [{ js: `(() => { const w = ${WDI}; w.available = function () { return false; }; w.setState({ warm: (w.state.warm || 0) + 1 }); })()` }, { wait: 300 }],
  trigger: TAPR('hcPill'), maxMs: 2000,
  targets: [J('pill', R_('hcPill'), ['h', 'radius', 'bg', 'shadow', 'rect']), J('card', R_('hc'), ['h', 'rect']), J('pillText', `() => [...${WDI}._r.hcPill.querySelectorAll('span')]`, ['op', 'tf', 'text'], 4)],
  notes: 'Synthetic: available() is overridden to return false on the demo instance (the demo itself always returns true), then the pill is tapped: the pill opens into the unavailable message.' });
add({ id: 'M-098', name: 'Home -> loan screen: sheet slides up', ...WD, trigger: TAPR('hcPill'), maxMs: 2000,
  targets: [J('loanRoot', LOANROOT, ['tf', 'rect']), J('card', R_('card'), ['rect'])], notes: 'Tap Withdraw: the loan screen (page colour, card = amount entry) slides up on FEEL.Smooth (240/30/1).' });
add({ id: 'M-099', name: 'Keypad reveal (first open: key by key)', ...WD, trigger: TAPR('hcPill'), maxMs: 2000,
  targets: [J('key', KEYS, ['op', 'tf'], 12, { byIndex: true }), J('loanRoot', LOANROOT, ['tf'])], notes: 'Same tap as M-098: keys reveal REVEAL(i) (0.34 s, 60 ms + 30 ms * i) while the sheet slides. key[i] = i-th key (1..9, *, 0, ⌫).' });
add({ id: 'M-100', name: 'Keypad reveal (back from order: by rows)', ...WD, setup: CONFIRM, trigger: TAPR('row'), maxMs: 2000,
  targets: [J('key', KEYS, ['op', 'tf'], 12, { byIndex: true })], notes: 'In the order page, tap the amount row: goPhase(enter) -> keys return by rows (REVEAL_ROW 0.22 s).' });
add({ id: 'M-101', name: 'Keypad key press', ...WD, setup: OPEN, trigger: { waitEvent: 'pointerdown', steps: [{ tap: { js: "() => __u.keys()[4]" }, hold: 220 }] }, maxMs: 1200,
  targets: [J('keyInner', '() => [__u.keys()[4].firstElementChild]', ['tf', 'bg'])], notes: 'Key 5 held 220 ms: whileTap scale 0.94 + background (Motion default transition).' });
add({ id: 'M-102', name: 'Pad line in / out', ...WD, setup: OPEN, trigger: TAPR('chip6'), maxMs: 1500,
  targets: [J('padLine', "() => { const k = __u.keys(); return k.length ? [k[0].parentElement.previousElementSibling] : []; }", ['op', 'tf', 'rect'])], notes: 'Pick 6 terms: the 1 px line above the keypad exits (opacity 0, y -10, LEAVE).' });
add({ id: 'M-103', name: 'Typed digit entrance (withdraw)', ...WD, setup: [...OPEN, { tap: { js: '() => __u.keys()[11]' }, hold: 40 }, { wait: 500 }, { tap: { js: '() => __u.keys()[11]' }, hold: 40 }, { wait: 700 }], trigger: { waitEvent: 'pointerdown', steps: [{ tap: { js: "() => __u.keys()[4]" }, hold: 60 }] }, maxMs: 1200,
  targets: [J('digit', `() => [...${WDI}._r.num.querySelectorAll('span')]`, ['op', 'tf', 'blur', 'text'], 16)], notes: 'Two deletes first (126 -> 1, i.e. ₱100), then key 5 appends a digit (₱1,500): DIGIT_IN (0.38 s, times 0 / 0.4 / 0.7 / 1).' });
add({ id: 'M-104', name: 'Caret blink (withdraw)', ...WD, setup: OPEN, trigger: { js: '0' }, loop: true, maxMs: 2500, targets: [J('caret', `() => [${WDI}._r.caret, ...${WDI}._r.caret.querySelectorAll('*')]`, ['op'], 3, { byIndex: true })], notes: 'CSS psBlink 1 s step-end infinite (caret[0] = the caret ref, [1..] its children).' });
add({ id: 'M-105', name: 'Slider (withdraw order card) follows the finger', ...WD, setup: CONFIRM,
  trigger: { waitEvent: 'pointerdown', steps: [{ drag: { js: R_('slider').replace('() => [', '() => (').replace(/\]$/, ')'), fx: 0.5, fy: 0.3 }, dx: -100, ms: 500, steps: 25 }] }, maxMs: 1500,
  targets: [J('part', `() => [...${WDI}._r.slider.querySelectorAll('div')].slice(0, 4)`, ['w', 'css:left', 'rect'], 4, { byIndex: true }), J('num', R_('num'), ['text'])], notes: 'Order page slider: finger moves 100 px left over 500 ms: fill width / knob left follow per move (no easing).' });
add({ id: 'M-107', name: 'Amount entry -> order card morph', ...WD, setup: OPEN, trigger: TAPR('chip6'), maxMs: 2500, targets: MORPH_T,
  notes: 'Pick 6 terms in phase enter: the whole page closes into the order card (one progress mp on FEEL.Smooth; every style is a function of mp).' });
add({ id: 'M-107_reverse', name: 'Order card -> amount entry morph (reverse)', ...WD, setup: CONFIRM, trigger: TAPR('row'), maxMs: 2500, targets: MORPH_T, notes: 'Tap the amount row on the order page: the morph runs back to the amount entry.' });
add({ id: 'M-108', name: 'Order page blocks enter', ...WD, setup: OPEN, trigger: TAPR('chip6'), maxMs: 2000,
  targets: [J('blocksWrap', `() => [${WDI}._r.card.nextElementSibling]`, ['op']), J('block', `() => [...${WDI}._r.card.nextElementSibling.children]`, ['op', 'tf'], 6, { byIndex: true })], notes: 'Same tap as M-107: wrapper fades in (0.2 s), blocks REVEAL(i).' });
const PROT = "() => { const a = __u.text('Protected'), b = __u.text('Add'); let n = a; while (n && b && !n.contains(b)) n = n.parentElement; return n ? [n] : []; }";
add({ id: 'M-109', name: 'Borrower protection toggle (Protected / Add)', ...WD, setup: CONFIRM,
  trigger: { waitEvent: 'pointerdown', steps: [{ tap: { js: PROT.replace('return n ? [n] : [];', 'return n;') }, hold: 120 }] }, maxMs: 1200,
  targets: [J('button', PROT, ['w', 'bg', 'shadow', 'tf', 'rect']), J('labelProtected', "() => [__u.text('Protected')]", ['op', 'tf']), J('labelAdd', "() => [__u.text('Add')]", ['op', 'tf'])], notes: 'Tap Protected (held 120 ms) -> Add: CSS 150 ms cubic-bezier(0.2,0,0,1), press 60 ms.' });
const AGREEC = `() => [${WDI}._r.agreeHalo.nextElementSibling]`;
const TOEND = [{ js: `(${WDI})._r.loanScroll.scrollTop = 99999` }, { wait: 500 }];
add({ id: 'M-110', name: 'Agreement tick colour', ...WD, setup: [...CONFIRM, ...TOEND], trigger: { waitEvent: 'click', steps: [{ tap: { js: AGREEC.replace('() => [', '() => (').replace(/\]$/, ')') }, hold: 60 }] }, maxMs: 1000,
  targets: [J('tick', AGREEC, ['bg', 'bc'])], notes: 'Order page scrolled to the end; tap the agreement circle (.15 s ease).' });
add({ id: 'M-111', name: 'Confirm (disabled) tap: scroll to agreement', ...WD, setup: CONFIRM, trigger: TAPR('btn'), maxMs: 3000,
  targets: [J('scroller', R_('loanScroll'), ['scroll'])], notes: 'Confirm tapped while the agreement is unticked: scrollTop animates to the agreement on the spring (restDelta 0.5).' });
add({ id: 'M-112', name: 'Agreement nudge ripple (withdraw)', ...WD, setup: CONFIRM, trigger: TAPR('btn'), maxMs: 3000,
  targets: [J('halo', R_('agreeHalo'), ['op', 'tf']), J('scroller', R_('loanScroll'), ['scroll'])], notes: 'Same tap as M-111: when the scroll is within 24 px the halo ripples twice (scale 1 -> 2.4, opacity 0.6 -> 0, 0.6 s each).' });
add({ id: 'M-113', name: 'Confirm button enable colour', ...WD, setup: [...CONFIRM, ...TOEND], trigger: { waitEvent: 'click', steps: [{ tap: { js: AGREEC.replace('() => [', '() => (').replace(/\]$/, ')') }, hold: 60 }] }, maxMs: 1000,
  targets: [J('btn', R_('btn'), ['bg', 'color', 'tf'])], notes: 'Agreement ticked: Confirm colours change over 0.2 s. Press in M-113_press.' });
add({ id: 'M-113_press', name: 'Confirm button press', ...WD, setup: [...CONFIRM, ...TOEND, { tap: { js: AGREEC.replace('() => [', '() => (').replace(/\]$/, ')') }, hold: 40 }, { wait: 500 }], trigger: TAPR('btn', 220, 'pointerdown'), maxMs: 900, settleMs: 200,
  targets: [J('btn', R_('btn'), ['tf', 'bg'])], notes: 'Enabled Confirm held 220 ms: press scale (MT.PRESS 60 ms).' });
add({ id: 'M-114', name: 'Confirm bar veil fades at end of scroll', ...WD, setup: CONFIRM, trigger: { steps: [{ scrollTo: `(() => (${WDI})._r.loanScroll)`, to: 'end', ms: 1000 }] }, maxMs: 2000,
  targets: [J('veil', R_('barVeil'), ['op']), J('scroller', R_('loanScroll'), ['scroll'])], notes: 'Order page scrolled linearly to the end over 1 s: veil opacity = clamp(left / bar height). Scroll-linked.' });
add({ id: 'M-115', name: 'Withdraw home bottom veil', ...WD, trigger: { steps: [{ scrollTo: '.ps-home-scroll', to: 'end', ms: 800 }] }, maxMs: 1600,
  targets: [T('veil', '.ps-home-bot .ps-veil', ['op']), T('scroller', '.ps-home-scroll', ['scroll'])], notes: 'Home scrolled linearly to the end over 800 ms. Scroll-linked.' });
add({ id: 'M-116', name: 'Loan header back button press + sheet exit', ...WD, setup: OPEN, trigger: { waitEvent: 'pointerdown', steps: [{ tap: { x: 36, y: 36 }, hold: 120 }] }, maxMs: 1500,
  targets: [J('back', "() => { let n = document.elementFromPoint(36, 36); while (n && n.getBoundingClientRect().width < 38) n = n.parentElement; return n ? [n] : []; }", ['tf']), J('loanRoot', LOANROOT, ['tf', 'rect'])], notes: 'Back (held 120 ms) in phase enter: press, then the loan screen exits (0.3 s) to home.' });
add({ id: 'M-106', name: 'Slider glide when a coupon changes the limit (app host)', ...app(),
  setup: [{ js: 'APP.borrow()' }, { wait: 1600 }, { js: 'APP.wd.sheet().pickTerm(6)' }, { wait: 2200 }],
  trigger: { waitEvent: 'click', steps: [{ tap: { js: "() => [...document.querySelectorAll('.ps-wd-app .ps-crow')].find(r => /limit/i.test(r.textContent))" }, hold: 60 }] }, maxMs: 2500,
  targets: [J('part', "() => [...APP.wd.sheet()._r.slider.querySelectorAll('div')].slice(0, 4)", ['w', 'css:left', 'rect'], 4, { byIndex: true }), J('num', "() => [APP.wd.sheet()._r.num]", ['text']), J('maxLabel', "() => [...APP.wd.sheet()._r.slider.querySelectorAll('span')].slice(-3)", ['op', 'tf', 'text'], 3, { byIndex: true })],
  notes: 'App: APP.borrow(), 6 terms picked, then the limit coupon row in the order page is toggled: host sheet.glide() moves knob / fill / amount / max on the spring.' });
add({ id: 'M-133', name: 'Withdraw ordering hosted in the app', ...app(), trigger: { js: 'APP.borrow()' }, maxMs: 2000,
  targets: [J('loanRoot', "() => [APP.wd.sheet()._r.loanScroll.parentElement]", ['tf', 'rect']), J('key', KEYS, ['op', 'tf'], 12, { byIndex: true })], notes: 'APP.borrow(): the demo loan screen slides up inside the app (same motion as M-098 / M-099).' });

/* ---------------- Credit limit increase ---------------- */
const BAKED = '/prototypes/credit-limit-coins/baked/baked-heap.html?old=30000&new=40000&inc=10000&exp=2026-11-20';
add({ id: 'M-120', name: 'Credit limit increase animation (coins + count-up)', url: BAKED, trigger: { nav: true }, loop: true, maxMs: 4500,
  targets: [{ name: 'gsap', gsap: true }, T('label', '#label', ['op', 'tf']), T('amount', '#amount', ['op', 'tf', 'blur', 'text', 'color']), T('up', '#up', ['op', 'tf']), T('delta', '#delta', ['tf']), T('exp', '#exp', ['clip', 'op']), T('expText', '#expText', ['op', 'tf']), T('was', '#was', ['op', 'tf']),
    T('hero', '#hero', ['tf']), T('art', '#art', ['tf']), T('cvBack', '#cvBack', ['op', 'blur']), T('cvFront', '#cvFront', ['op', 'blur'])],
  notes: 'The baked page alone (old 30,000 -> new 40,000, +10,000): GSAP timeline, autoplay 250 ms after boot; t=0 = navigation start. Labels: count 0.45 s, land 2.30 s, end 3.40 s (timeline time in gsap.gsapTime).' });
add({ id: 'M-121', name: 'Credit limit burst (rings, rays, sparkles)', url: BAKED, trigger: { nav: true }, loop: true, maxMs: 4500,
  targets: [{ name: 'gsap', gsap: true }, J('burst', "() => [...document.querySelectorAll('#burst *')].filter(e => !/^(defs|g|clipPath|linearGradient|radialGradient|stop)$/i.test(e.tagName)).slice(0, 24)", ['op', 'tf', 'attr:rx', 'attr:ry', 'attr:x1', 'attr:y1', 'attr:x2', 'attr:y2', 'attr:opacity', 'attr:stroke-width', 'attr:transform', 'css:stroke-width'], 24, { byIndex: true })],
  notes: 'SVG #burst children (rings, rays, sparkles) by DOM index; the burst starts at timeline 2.30 s (land).' });
add({ id: 'M-122', name: 'Credit limit star twinkle loop', url: BAKED, trigger: { nav: true }, loop: true, maxMs: 4000,
  targets: [{ name: 'gsap', gsap: true }, T('star', '.tw', ['tf', 'op', 'attr:transform'], 8, { byIndex: true })], notes: 'Star groups .tw (repeat -1, delay i*0.17).' });
const CLDONE = "window.addEventListener('message', function (e) { var d = e.data; if (typeof d === 'string') { try { d = JSON.parse(d); } catch (x) {} } if (d && d.type === 'creditlimit:done' && !window.__cldone) window.__cldone = performance.now(); });";
const EXIT_T = (box, ifr) => [T('box', box, ['op', 'tf', 'radius', 'rect', 'clip', 'bg']), T('iframe', ifr, ['op', 'tf']),
  T('fHero', '#hero', ['op', 'tf', 'blur'], 1, { frame: ifr }), T('fArt', '#art', ['tf'], 1, { frame: ifr }), T('fStars', '#artStars', ['op'], 1, { frame: ifr }), T('fCvBack', '#cvBack', ['op', 'blur'], 1, { frame: ifr }), T('fCvFront', '#cvFront', ['op', 'blur'], 1, { frame: ifr }),
  J('cardAmt', `() => [${WDI}._r.hcAmt]`, ['tf', 'rect']), J('cardDigits', `() => [${WDI}._r.hcAmt.children[1]]`, ['ls', 'color', 'text']), J('cardPeso', `() => [${WDI}._r.hcAmt.children[0]]`, ['ls', 'color']),
  J('cardLabel', R_('hcLabel'), ['op', 'tf']), J('legend0', R_('hcLeg0'), ['op', 'tf']), J('legend1', R_('hcLeg1'), ['op', 'tf']), J('fill', `() => [...${WDI}._r.hcFill.children]`, ['tf', 'w'], 2, { byIndex: true }), J('pill', R_('hcPill'), ['op', 'tf']), J('card', R_('hc'), ['shadow', 'rect']),
  T('item', '.ps-home-in > *', ['op', 'tf'], 5, { byIndex: true }), T('tabbar', '.ps-tabbar, .ps-nav', ['op', 'tf'])];
const SKIP = ifr => `document.querySelector('${ifr}').contentDocument.body.click()`;
const WDCL = (file) => ({ url: `/prototypes/withdraw-fund-flow/${file}`, ready: "document.querySelector('#wdIntro iframe')", settleBefore: 200, preScript: CLDONE, setup: [{ until: 'window.__cldone', timeout: 20000 }, { wait: 600 }] });
add({ id: 'M-117', name: 'Credit limit intro -> home card (credit unused: big number carries over)', ...WDCL('with-credit-limit.html'), trigger: { js: SKIP('#wdIntro iframe') }, maxMs: 2500, minMs: 400,
  targets: EXIT_T('#wdIntro', '#wdIntro iframe'), notes: "Withdraw demo with-credit-limit.html (available = total 40,000): after 'creditlimit:done' a tap in the frame skips the 3 s hold; t=0 = that tap; the exit starts 2 rAF later (introExit, mode available)." });
add({ id: 'M-118', name: 'Credit limit intro -> home card (credit partly used: count-up)', ...WDCL('with-credit-limit-used.html'), trigger: { js: SKIP('#wdIntro iframe') }, maxMs: 2500, minMs: 400,
  targets: EXIT_T('#wdIntro', '#wdIntro iframe'), notes: "with-credit-limit-used.html (available < total): mode 'total' — the Credit limit block leaves with the box, the card's available amount counts up and the green bar part slides out. t=0 = skip tap." });
add({ id: 'M-119', name: 'Credit limit intro fallback exit (intro.js, page not ready)', ...WDCL('with-credit-limit.html'), setup: [{ until: 'window.__cldone', timeout: 20000 }, { wait: 600 }, { js: 'window.__wdIntroExit = function () { return false; }' }],
  trigger: { js: SKIP('#wdIntro iframe') }, maxMs: 2500, minMs: 400,
  targets: [T('box', '#wdIntro', ['op', 'clip', 'bg', 'rect']), T('iframe', '#wdIntro iframe', ['op']), J('flyer', "() => [...document.querySelectorAll('body > div')].filter(d => d.id !== 'wdIntro' && /z-index: ?101/.test(d.getAttribute('style') || ''))", ['tf', 'op'], 2), T('item', '.ps-home-in > *', ['op', 'tf'], 5, { byIndex: true })],
  notes: "Synthetic: window.__wdIntroExit is replaced by a function returning false so intro.js runs its legacy fallback (clip-path box, flying amount copy, hand-stepped spring). t=0 = skip tap." });
const APPCL = (q) => ({ url: `/prototypes/app/index.html?auto=0&fast=1&intro=1${q}`, ready: "document.querySelector('.ps-climit iframe')", settleBefore: 200, preScript: CLDONE, setup: [{ until: 'window.__cldone', timeout: 20000 }, { wait: 600 }] });
add({ id: 'M-117_app', name: 'Credit limit intro -> home card in the app (credit unused)', ...APPCL('&loan=none'), trigger: { js: SKIP('.ps-climit iframe') }, maxMs: 2500, minMs: 400,
  targets: EXIT_T('.ps-climit', '.ps-climit iframe'), notes: 'App (?intro=1&loan=none): PS.CreditLimitIntro with exit = the demo introExit, mode available. t=0 = skip tap in the frame.' });
add({ id: 'M-118_app', name: 'Credit limit intro -> home card in the app (credit partly used)', ...APPCL(''), trigger: { js: SKIP('.ps-climit iframe') }, maxMs: 2500, minMs: 400,
  targets: EXIT_T('.ps-climit', '.ps-climit iframe'), notes: 'App (?intro=1, loan repaying): mode total, count-up. t=0 = skip tap in the frame.' });
add({ id: 'M-095', name: 'Credit limit intro (hosted baked page) + exit, natural hold', url: '/prototypes/app/index.html?auto=0&fast=1&intro=1&loan=none', preScript: CLDONE,
  trigger: { nav: true, startWhen: "document.querySelector('.ps-climit iframe')" }, maxMs: 9500, minMs: 7000, settleMs: 400,
  targets: [T('box', '.ps-climit', ['op', 'tf', 'radius', 'rect']), T('iframe', '.ps-climit iframe', ['op', 'tf']), { name: 'gsap', gsap: true, frame: '.ps-climit iframe' }, { name: 'doneAt', expr: 'window.__cldone ? Math.round(window.__cldone) : null' }],
  notes: "App opening with Tune intro on: the Credit limit page plays in its frame, posts 'creditlimit:done', holds 3000 ms (no tap), then exits into the home card. t=0 = first frame the intro frame exists. doneAt = performance.now() of the done message (page clock)." });
