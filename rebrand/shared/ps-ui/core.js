/* PeraSure UI — core: the namespace, motion values, helpers and atoms (icon, amount, button, tag, chip, check, card,
   section, rows). Load order: react, react-dom, motion-react, then core.js, layout.js, and the area files the page needs
   (home.js, coupon.js, loan.js, account.js). Each file adds components to window.PS. Styles: ps-ui.css.
   No JSX, no build step: PS.h = React.createElement. Docs and props: shared/README.md, live with every state: devmode/ (PeraSure Dev Mode → Components). */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, h = R.createElement;
  var PS = window.PS = window.PS || {};
  /* PeraSure Dev Mode (devmode/) can slow a page it is comparing (slow motion): it sets its clock here, before anything moves */
  try { if (window.parent !== window && window.parent.DM_CLOCK) window.parent.DM_CLOCK(window); } catch (e) {}

  /* assets sit next to this file, so a page anywhere in the repo can use the components */
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? me.replace(/[^/]*(\?.*)?$/, '') : '../../shared/ps-ui/';
  PS.base = BASE;
  PS.asset = function (p) { return BASE + 'assets/' + p; };
  /* lengths: everything is sized in rem (1rem = 16 design px at the default text size, tokens-rem/). A size given as a number of design px
     (an icon's size, a column's top) is written with these:
     rem(n) — n design px as rem · y(n) — a distance from the frame's top, which includes the 40 px status strip above the screen (it stays px)
     px(n) — n design px in CSS px right now (for JavaScript geometry: tooltip margins, popover gaps) */
  PS.rem = function (n) { return typeof n === 'number' ? (n ? n / 16 + 'rem' : 0) : n; };
  PS.y = function (n) { return typeof n === 'number' ? 'calc(40px + ' + (n - 40) / 16 + 'rem)' : n; };
  PS.px = function (n) { return n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16) / 16; };

  PS.h = h; PS.m = M.m; PS.AP = M.AnimatePresence;
  PS.reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---- motion: the PeraSure values, the same as prototypes/withdraw-fund-flow/motion-tokens.js and the
     perasure-card-morph skill. Never sped up for a short move; nothing bounces — except menus (MENU, owner). ---- */
  var EASE_IN = [0.22, 0.61, 0.36, 1];
  var MT = PS.MT = {
    /* geometry (sheets, pages, pills): withdraw's Smooth spring, settles within 0.378 px — 95 % at ≈ 290 ms, rest ≈ 560 ms */
    SPRING: { type: 'spring', stiffness: 240, damping: 30, mass: 1, restDelta: 0.378, restSpeed: 3.78 },
    /* the same spring for values in % (a page or sheet moving by its own size): rests within 0.05 % */
    SPRING_PCT: { type: 'spring', stiffness: 240, damping: 30, mass: 1, restDelta: 0.05, restSpeed: 0.5 },
    EASE_IN: EASE_IN,
    ENTER: { duration: 0.30, delay: 0.07, ease: EASE_IN },     /* what comes in: rises from below, 3 px blur → sharp */
    LEAVE: { duration: 0.15, ease: [0.4, 0, 1, 1] },           /* what goes: rises out, sharp → 3 px blur */
    Y: { text: 8, block: 10, digit: 6 }, BLUR: 3,
    REVEAL: function (i) { return { duration: 0.34, delay: 0.06 + (i || 0) * 0.03, ease: EASE_IN }; },
    PRESS: { duration: 0.06 }, PRESS_SCALE: { pill: 0.985, icon: 0.92 },
    COLOR: 0.15,                                               /* colour changes: 150 ms */
    /* menus (owner asked for an iPhone menu's life — the one thing that bounces): the list grows out of the finger on a light-bounce spring,
       its height a beat behind its width so it unfolds like a drop; rows follow one after another; it shrinks back into the finger quickly */
    MENU: { type: 'spring', visualDuration: 0.34, bounce: 0.3 },
    MENU_Y: { type: 'spring', visualDuration: 0.42, bounce: 0.32 },
    MENU_ROW: function (i) { return { delay: 0.05 + Math.min(i, 8) * 0.022, y: { type: 'spring', visualDuration: 0.36, bounce: 0.35 }, opacity: { duration: 0.2, ease: EASE_IN }, filter: { duration: 0.2, ease: EASE_IN } }; },
    MENU_OUT: { duration: 0.18, ease: [0.4, 0, 1, 1] }
  };
  PS.T = { spring: MT.SPRING, ui: MT.SPRING, layout: MT.SPRING, sheet: MT.SPRING, page: MT.SPRING, snap: MT.PRESS, pop: MT.SPRING };
  PS.TAP = { scale: MT.PRESS_SCALE.pill };
  PS.TAP_ICON = { scale: MT.PRESS_SCALE.icon };
  PS.press = function (icon) { return { whileTap: icon ? PS.TAP_ICON : PS.TAP, transition: MT.PRESS }; };
  /* crossfade props for a keyed node inside AnimatePresence (withdraw's fade()): y = MT.Y.text | block | digit */
  PS.fade = function (y) {
    y = y == null ? MT.Y.text : y;
    var b = 'blur(' + MT.BLUR + 'px)';
    return { initial: { opacity: 0, y: y, filter: b }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: MT.ENTER },
      exit: { opacity: 0, y: -y, filter: b, transition: MT.LEAVE } };
  };
  /* entrance of secondary content (rows, details) — the 0.34 s reveal, item i of a list */
  PS.reveal = function (i) {
    return { initial: { opacity: 0, y: MT.Y.text, filter: 'blur(' + MT.BLUR + 'px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: MT.REVEAL(i) },
      exit: { opacity: 0, transition: MT.LEAVE } };
  };
  /* rise: plays that entrance on the direct children of el, one after another (40 ms apart) — content that has just loaded,
     the rows of a sheet. Web Animations, so the children need no wrappers; transform / opacity / filter only. o { delay, gap, y, skip (first n children stay) } */
  PS.rise = function (el, o) {
    if (!el || PS.reduce || !el.animate) return;
    o = o || {};
    var kids = el.children, gap = o.gap == null ? 40 : o.gap, y = o.y == null ? MT.Y.block : o.y, d0 = o.delay == null ? 60 : o.delay;
    for (var i = o.skip || 0; i < kids.length; i++) kids[i].animate(
      [{ opacity: 0, transform: 'translateY(' + y + 'px)', filter: 'blur(' + MT.BLUR + 'px)' }, { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }],
      { duration: 340, delay: d0 + Math.min(i - (o.skip || 0), 8) * gap, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', fill: 'backwards' });
  };
  /* Rise: a box whose children rise in one after another when it appears (PS.rise) · className · style · delay · gap · y · off (no motion)
     RiseCtx: true = what is inside was not waited for (a page seen before), so lists that rise (Crossfade rise) are there at once. */
  PS.RiseCtx = R.createContext(false);
  PS.Rise = function Rise(p) {
    var ref = R.useRef(null);
    R.useLayoutEffect(function () { if (!p.off) PS.rise(ref.current, p); }, []);
    return h('div', { ref: ref, className: p.className, style: p.style }, p.children);
  };
  PS.cx = function () { return [].filter.call(arguments, Boolean).join(' '); };

  /* ---- money: ₱ with thousands separators; dec = 2 (default) or 0 ---- */
  function num(n, dec) {
    dec = dec == null ? 2 : dec;
    var s = (Math.round(Math.abs(n) * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
    var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-' : '') + p.join('.');
  }
  PS.num = num;
  PS.money = function (n, dec) { var s = num(n, dec); return s.charAt(0) === '-' ? '-₱' + s.slice(1) : '₱' + s; };

  /* colour shorthands for icons: a token name or any CSS colour */
  var ICON_C = { primary: 'var(--content-primary)', secondary: 'var(--content-secondary)', tertiary: 'var(--content-tertiary)',
    placeholder: 'var(--content-placeholder)', brand: 'var(--content-brand)', 'brand-light': 'var(--content-brand-subtle)',
    positive: 'var(--content-positive-strong)', inverse: 'var(--content-inverse)', 'on-action': 'var(--content-on-action)',   /* rebrand: icons on green fills */ countdown: 'var(--ps-countdown)', text: 'currentColor' };

  /* Icon: a one-colour icon from assets/icons, drawn as a mask so its colour is a token.
     name: file name without .svg · size (px, 20) · color: primary | secondary | tertiary | brand | positive | inverse | … (default: text colour) */
  PS.Icon = function Icon(p) {
    var st = { '--ps-s': PS.rem(p.size || 20), '--ps-src': 'url("' + PS.asset('icons/' + p.name + '.svg') + '")' };
    if (p.color) st.color = ICON_C[p.color] || p.color;
    return h('span', { className: PS.cx('ps-icon', p.className), style: Object.assign(st, p.style), 'aria-hidden': true });
  };

  /* Art: a full-colour picture from assets/art (illustrations, logos) · name · size (px) · ext (svg) · dir (art | logos) */
  PS.Art = function Art(p) {
    return h('img', { className: PS.cx('ps-art', p.className), src: PS.asset((p.dir || 'art') + '/' + p.name + '.' + (p.ext || 'svg')), alt: p.alt || '',
      style: Object.assign({ '--ps-s': PS.rem(p.size || 36) }, p.style), draggable: false });
  };

  /* Amounts (rebrand, tokens v2): one typeface — Hanken Grotesk, its own ₱ — in the Amount text styles (.ps-text-amount-xs … xxl =
     v2 .ps-text-amount-*: 800, tabular figures). The old Reddit Sans kerning table (PS.KERN / PS.kern) and the ₱-in-the-number-font
     wrapper (PS.Peso) are gone: Hanken has no kerning between digits, and a title's ₱ is already its own font. */

  /* Amount: ₱ + digits in the Amount style (Hanken Grotesk, its own ₱). Numbers never animate.
     value (number) · dec (2) · num: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' (the Number text style; else the component's CSS sizes it)
     · decNum: the style of ".00" when it is smaller (home card: xl + xs) · strike (an old price: body text, not the Amount style)
     · curFont: kept for old callers, does nothing */
  /* the old Number sizes → the four Amount styles (TYPE-AND-STYLES.md): sm 18 → xs 16, xl 36 → lg 32 */
  var AMT_MAP = { xs: 'xs', sm: 'xs', md: 'md', lg: 'lg', xl: 'lg', xxl: 'xxl' }, AMT = function (k) { return AMT_MAP[k] || k; };
  PS.Amount = function Amount(p) {
    var s = num(p.value, p.dec == null ? 2 : p.dec), neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var parts = s.split('.'), kids = [];
    kids.push(h('span', { key: 'c', className: 'ps-amount__cur' }, (neg ? '-' : '') + (p.prefix || '') + '₱'));
    kids.push(h('span', { key: 'i', className: 'ps-amount__int' }, parts[0]));
    if (parts[1] != null) kids.push(h('span', { key: 'd', className: PS.cx('ps-amount__dec', p.decNum && 'ps-text-amount-' + AMT(p.decNum)) }, '.' + parts[1]));
    return h('span', { className: PS.cx('ps-amount', !p.strike && p.num && 'ps-text-amount-' + AMT(p.num), p.strike && 'ps-amount--strike', p.className), style: p.style }, kids);
  };

  /* Button (spec rebrand/spec/Button.md, Figma 10987:225) · variant primary | secondary | text | destructive | navy · size large | small
     (also lg / sm / md) · state default | pressed | disabled (gallery; in the app: disabled, and pressed is the tap) · label or children
     · subtitle (second line) · icon (leading, 16) · loading (spinner, not pressable) · block (full width).
     Kept from the old demo (not in the spec yet): variants cta (the navy card's main action), shade (on navy), inverse, outline (coupon
     "Use"), soft, glass, ghost; size md (44); inactive (looks disabled but still calls onClick — points at what's missing). */
  var BTN_SIZE = { large: 'lg', small: 'sm', medium: 'md', lg: 'lg', sm: 'sm', md: 'md' };   /* medium = 44, the legacy in-card button; titleLabel → the 16 px label (46) */
  PS.Button = function Button(p) {
    var v = p.variant || 'primary', st = p.state || 'default', off = p.disabled || st === 'disabled';
    var size = BTN_SIZE[p.size] || (v === 'outline' || v === 'shade' || v === 'cta' || v === 'soft' || v === 'glass' ? null : 'lg');
    var label = p.children != null ? p.children : p.label;
    var text = p.subtitle ? h('span', { className: 'ps-btn__text' }, h('span', null, label), h('span', { className: 'ps-btn__sub' }, p.subtitle)) : label;
    return h(PS.m.button, { type: 'button', className: PS.cx('ps-btn', 'ps-btn--' + v, size && 'ps-btn--' + size, p.bigLabel && 'ps-btn--title', p.block && 'ps-btn--block', p.inactive && 'is-inactive',
        st === 'pressed' && 'is-pressed', st === 'disabled' && 'is-disabled', p.loading && 'is-loading', p.className),
      disabled: off, 'aria-disabled': p.inactive || undefined, 'aria-busy': p.loading || undefined, onClick: p.loading ? undefined : p.onClick,
      whileTap: off || p.inactive || p.loading ? undefined : PS.TAP, transition: MT.PRESS, style: p.style, 'aria-label': p.ariaLabel || (p.children != null && typeof p.label === 'string' ? p.label : undefined) },
      p.loading ? h('span', { className: 'ps-btn__spin', 'aria-hidden': true }) : null,
      p.icon ? h(PS.Icon, { name: p.icon, size: p.iconSize || 16 }) : null, text);
  };

  /* Glass: the frosted round / pill button of headers and sheets · icon (name) or children · round (40×40; false: a pill even with only an
     icon) · size lg (the 44 px pill) · iconSize · label (aria) */
  PS.Glass = function Glass(p) {
    return h(PS.m.button, Object.assign({ type: 'button', className: PS.cx('ps-glass', (p.round !== false && !p.children) && 'ps-glass--round', p.size === 'lg' && 'ps-glass--lg', p.className),
      onClick: p.onClick, 'aria-label': p.label, style: p.style }, PS.press(!p.children)),
      p.icon ? h(PS.Icon, { name: p.icon, size: p.iconSize || 18 }) : null, p.children);
  };
  PS.Back = function Back(p) { return h(PS.Glass, { icon: 'chevron-left', label: p.label || 'Back', onClick: p.onClick }); };
  PS.Close = function Close(p) { return h(PS.Glass, { icon: 'close', iconSize: 14, label: p.label || 'Close', onClick: p.onClick, className: 'ps-close' }); };

  /* Brand: the PeraSure logo of the home and account headers */
  PS.Brand = function Brand() {
    return h('span', { className: 'ps-brand' },
      h('span', { className: 'ps-brand__mark' }, h('img', { src: PS.asset('logos/perasure-mark.svg'), alt: '' })),
      h('span', { className: 'ps-brand__name' }, 'PeraSure'));
  };

  /* Tag (spec Tag.md, Figma 10988:272) · tone accent | positive | navy | neutral | negative · emphasis subtle | strong | outline
     · size medium | small · icon (leading, 12) · label or children. Non-interactive.
     Old tones still accepted (mapped): outline → accent outline ("Protected") · soft → neutral subtle ("Due in 5 days") · best → accent
     strong small ("Best") · solid → navy strong (menu "New") · positive → positive strong ("Paid") · negative → negative subtle (overdue) ·
     muted → neutral subtle. */
  var TAG_OLD = { outline: ['accent', 'outline'], soft: ['neutral', 'subtle'], best: ['accent', 'strong', 'small'], solid: ['navy', 'strong'],
    positive: ['positive', 'strong'], negative: ['negative', 'subtle'], muted: ['neutral', 'subtle'] };
  /* RowIcon (BRIEF 22): a row's leading icon on its own — no navy tile; Filled style, 24, Content/Brand (negative: Content/Negative); 12 to the label
     (the row's gap). Filled glyphs come from figma-lib; until then the outlined icon stands in · name · tone brand | negative */
  PS.RowIcon = function RowIcon(p) {
    var filled = PS.FILLED && PS.FILLED[p.name];
    return h(PS.Icon, { name: filled || p.name, size: 24, color: p.tone === 'negative' ? 'var(--content-negative)' : 'brand', className: PS.cx('ps-rowicon', p.className) });
  };
  PS.FILLED = {   /* outlined name → its Filled twin in assets/icons (figma-lib 19, BRIEF 22; Figma OBsvf42AiRapcRrasD7KNm 11238:4570 … 4663) */
    camera: 'camera-filled', smartphone: 'smartphone-filled', app: 'app-filled', location: 'location-filled', notification: 'notification-filled',
    message: 'message-filled', heart: 'heart-filled', wallet: 'wallet-filled', info: 'info-circle-filled', 'support-chat': 'support-chat-filled' };
  PS.Tag = function Tag(p) {
    var old = !p.emphasis && TAG_OLD[p.tone || 'outline'], tone = old ? old[0] : (p.tone || 'accent'), em = old ? old[1] : (p.emphasis || 'subtle');
    var small = (p.size || (old && old[2]) || 'medium') === 'small';
    var leg = old ? (p.tone || 'outline') : p.legacy;   /* look parity: the old tone (or legacy: '<old tone>' on a new-tone call) keeps the root tag's size and shape */
    return h('span', { className: PS.cx('ps-tag', 'ps-tag--' + tone + '-' + em, small && 'ps-tag--small', leg && 'ps-tag--L-' + leg, p.className) },
      p.icon ? h(PS.Icon, { name: p.icon, size: 12 }) : null, p.children != null ? p.children : p.label);
  };
  /* Count: the round number badge of tabs · n · on (inside the active tab) */
  PS.Count = function Count(p) { return h('span', { className: PS.cx('ps-count', p.on && 'ps-count--on') }, p.n); };
  /* Chip (spec Chip.md, Figma 10989:185): a choice the user picks from a row (terms, presets, inbox filters) · size medium | small
     · state default | selected | pressed | disabled (gallery) — in the app: selected, disabled · label or children · onClick.
     Selected = green, navy text and a tick. (The old summary pills "✓ Saved" / "↑ New limit" are Tag · outline + icon now.) */
  PS.Chip = function Chip(p) {
    var st = p.state || 'default', sel = p.selected || st === 'selected', off = p.disabled || st === 'disabled', small = p.size === 'small';
    return h(PS.m.button, Object.assign({ type: 'button', role: p.role || 'radio', 'aria-checked': sel, disabled: off, onClick: p.onClick,
        className: PS.cx('ps-chip', small && 'ps-chip--small', sel && 'is-selected', st === 'pressed' && 'is-pressed', off && 'is-disabled', p.className) },
        off ? null : PS.press()),
      p.children != null ? p.children : p.label);   /* phase 1: no check mark (legacy has none) */
  };
  /* Check (spec Check.md, Figma 10989:254): the round selection mark, navy when on (decision 2); colour changes in 150 ms · size medium (20) |
     small (16) · on · off (can't be picked: Disabled; with on: On-disabled). Not a tap target — the row around it is.
     (Old prop box — a 2 px ring on the 16 px mark — is read as size small.) */
  PS.Check = function Check(p) {
    var small = p.size ? p.size === 'small' : true;   /* phase 1: the legacy mark is 16 — medium (20) only when asked */
    return h('span', { className: PS.cx('ps-check', small && 'ps-check--small', p.on && 'ps-check--on', p.off && !p.on && 'ps-check--off', p.on && p.off && 'ps-check--lock', p.className), 'aria-hidden': true },
      p.on ? h(PS.Icon, { name: 'check', size: small ? 10 : 12, color: 'inverse' }) : null, p.children);
  };
  /* Scrim (spec Scrim.md, Figma 11021:822): the layer behind a sheet / dialog · type gradient (default: navy, clear at the top) | flat (full-screen
     dialogs on tab pages) · onClick. PS.Sheet draws it itself (with its fade). */
  PS.Scrim = function Scrim(p) { return h('div', { className: PS.cx('ps-scrim', p.type === 'flat' && 'ps-scrim--flat', p.className), style: p.style, onClick: p.onClick }); };
  PS.Divider = function Divider(p) { return h('span', { className: PS.cx('ps-divider', p.vertical && 'ps-divider--v', p.dashed && 'ps-divider--dash'), 'aria-hidden': true }); };

  /* Card: white rounded card · variant plain | outline (home: 2 px white ring) | raised (shadow; = plain + raised) · raised (the default shadow
     on any variant: home's payment card is outline + raised) · clip · as (element, e.g. m.div) · any other prop (role, aria-*, onKeyDown,
     PS.press()) goes to the element */
  var CARD_OWN = { variant: 1, raised: 1, clip: 1, as: 1, className: 1, children: 1 };
  PS.Card = function Card(p) {
    var v = p.variant || 'plain', o = {};
    for (var k in p) if (!CARD_OWN[k]) o[k] = p[k];
    o.className = PS.cx('ps-card', v === 'outline' && 'ps-card--outline', (p.raised || v === 'raised') && 'ps-card--raised', p.clip && 'ps-card--clip', p.className);
    return h(p.as || 'div', o, p.children);
  };
  /* Section: uppercase label above a card, optional action link ("See all 6") */
  PS.Section = function Section(p) {
    return h('section', { className: PS.cx('ps-section', p.className) },
      h('div', { className: 'ps-section__head' }, h('p', { className: 'ps-section__label' }, p.label),
        p.action ? h(PS.m.button, Object.assign({ type: 'button', className: 'ps-link', onClick: p.onAction }, PS.press()), p.action) : null),
      p.children);
  };
  PS.Link = function Link(p) { return h(PS.m.button, Object.assign({ type: 'button', className: PS.cx('ps-link', p.className), onClick: p.onClick }, PS.press()), p.children); };
  /* KV (spec rebrand/spec/KV.md, Figma 11028:1193): a label and its value · layout inline | stacked · tone default | positive | negative
     · label · value · onInfo(event) (help mark after the value) · divider (a line under the row). Row padding 12, inline min-height 44; no side
     padding (it sits inside a card's 16). Kept from the old demo: bare (no padding: one compact line — the amount card's term, the offer card,
     the payment-number inset) · className. */
  PS.KV = function KV(p) {
    var st = p.layout === 'stacked', val = h('span', { className: 'ps-kv__value' }, h('span', null, p.value),
      p.onInfo ? h('button', { type: 'button', className: 'ps-kv__info', 'aria-label': 'More about ' + p.label, onClick: p.onInfo }, h(PS.Icon, { name: 'help-circle', size: 16, color: 'tertiary' })) : null);
    var lay = { inline: 'ps-kv--inline', detail: 'ps-kv--detail', 'detail-end': 'ps-kv--detail-end' }[p.layout];   /* phase 1: no layout = the legacy bare line */
    return h('div', { className: PS.cx('ps-kv', st && 'ps-kv--stacked', lay, p.bare && 'ps-kv--bare', p.divider && 'has-divider', p.tone && 'is-' + p.tone, p.className) },
      h('span', { className: PS.cx('ps-kv__label', st ? 'ps-text-body-sm' : 'ps-text-body-md') }, p.label), val);
  };
  /* Rows: KV rows, a divider under each but the last (KV.divider) · rows [{ label, value, tone, onInfo, node }] */
  PS.Rows = function Rows(p) {   /* phase 1: legacy = KV lines with a Divider between them, spaced by the card's gap; layout (inline | detail) = the
     padded spec rows in a list, a divider under each but the last */
    if (!p.layout) {
      var out = [];
      p.rows.forEach(function (r, i) {
        if (i) out.push(h(PS.Divider, { key: 'd' + i }));
        out.push(r.node ? R.cloneElement(r.node, { key: 'r' + i }) : h(PS.KV, { key: r.key || r.label, label: r.label, value: r.value, tone: r.tone, onInfo: r.onInfo }));
      });
      return out;
    }
    return h('div', { className: 'ps-kvlist' }, p.rows.map(function (r, i) {
      var last = i === p.rows.length - 1;
      return r.node ? R.cloneElement(r.node, { key: 'r' + i }) : h(PS.KV, { key: r.key || r.label, label: r.label, value: r.value, tone: r.tone, onInfo: r.onInfo, layout: r.layout || (p.layout === 'detail' && last ? 'detail-end' : p.layout), divider: !last });
    }));
  };
  /* Swap: text that changes after a tap crossfades in place (old rises out, new rises in, 3 px blur between) · block (fills the width).
     k: what identifies the content — key it on the state, not on a number that follows a slider (numbers never animate). */
  PS.Swap = function Swap(p) {
    var f = PS.fade(p.y);
    return h('span', { style: Object.assign({ position: 'relative', display: p.block ? 'grid' : 'inline-grid', minWidth: 0 }, p.block ? { gridTemplateColumns: 'minmax(0, 1fr)' } : null, p.style), className: p.className },   /* block: the column never grows past the box, so text inside can end in … */
      h(PS.AP, { initial: false },
        h(PS.m.span, Object.assign({ key: p.k, style: p.block ? { gridArea: '1 / 1', display: 'block', minWidth: 0 } : { gridArea: '1 / 1', display: 'inline-flex', alignItems: 'baseline', minWidth: 0 } }, f), p.children)));
  };

  /* ---- animations: the repo's Lottie files (animations/<slug>/), played with lottie-web (SVG renderer), which is loaded
     the first time one is shown. Owner's rule: wherever Figma shows a still that has an animation, play the animation. ---- */
  PS.root = BASE + '../../../';   /* rebrand: the repo root (vendor, animations, other prototypes) */
  PS.rebrand = BASE + '../../';   /* rebrand: rebrand/ (its own prototypes copy) */
  var lottieP = null;
  PS.loadLottie = function () {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (!lottieP) lottieP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = PS.root + 'vendor/lottie-web@5.12.2/lottie_svg.min.js';
      s.onload = function () { res(window.lottie); }; s.onerror = rej; document.head.appendChild(s);
    });
    return lottieP;
  };
  /* GSAP modules of animations/<slug>/gsap/ are written for an import map (import { gsap } from "gsap"); the app's pages have none.
     loadGsapModule(url) puts the shared GSAP build on window, points the module's one import line at it and imports the text from a
     Blob URL — the module file itself stays exactly what the Playground player plays. */
  var gsapP = null, gsapMods = {};
  PS.loadGsap = function () {
    if (window.gsap) return Promise.resolve(window.gsap);
    if (!gsapP) gsapP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = PS.root + 'vendor/gsap@3.15.0/gsap.min.js';
      s.onload = function () { res(window.gsap); }; s.onerror = rej; document.head.appendChild(s);
    });
    return gsapP;
  };
  PS.loadGsapModule = function (url) {
    if (!gsapMods[url]) gsapMods[url] = PS.loadGsap().then(function () { return fetch(url, { cache: 'no-cache' }); })
      .then(function (r) { if (!r.ok) throw new Error('Couldn’t load ' + url); return r.text(); })
      .then(function (src) {
        var code = 'const gsap = window.gsap;\n' + src.replace(/^import \{ gsap \} from "gsap";[^\n]*$/m, '');
        return import(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
      });
    return gsapMods[url];
  };
  /* Lottie: src (json url) · width · height · viewBox ('x y w h': crop) · intro [a, b] (played once) · loop [a, b] (then looped;
     with no intro / loop the file loops, or plays once and holds with once) · once · play (false: wait) · onDone · api (ref → the lottie item)
     active (false: holds its first frame; true again: plays from the start — a carousel's pages, owner: only the page on show plays, and
     each time it comes back it plays again). Reduced motion: the resting frame, no movement. */
  PS.Lottie = function Lottie(p) {
    var ref = R.useRef(null), cb = R.useRef(p.onDone), item = R.useRef(null), act = R.useRef(p.active), first = p.intro ? p.intro[0] : 0;
    cb.current = p.onDone; act.current = p.active;
    function start(a) {
      if (p.intro) {
        var looped = false;
        a.removeEventListener('complete'); a.loop = false;
        a.addEventListener('complete', function () {
          if (looped || item.current !== a) return; looped = true;
          if (p.loop) { a.loop = true; a.playSegments(p.loop, true); } else if (cb.current) cb.current();
        });
        a.playSegments(p.intro, true);
      } else { if (p.once) { a.removeEventListener('complete'); a.addEventListener('complete', function () { if (cb.current) cb.current(); }); } a.goToAndPlay(0, true); }
    }
    R.useEffect(function () {
      var dead = false, a = null;
      PS.loadLottie().then(function (l) {
        if (dead || !ref.current) return;
        var rs = { preserveAspectRatio: 'xMidYMid meet' }; if (p.viewBox) rs.viewBoxSize = p.viewBox;
        a = l.loadAnimation({ container: ref.current, renderer: 'svg', loop: !p.once && !p.intro, autoplay: false, path: p.src, rendererSettings: rs });
        if (p.api) p.api.current = a;
        a.addEventListener('DOMLoaded', function () {
          if (dead) return;
          item.current = a; a.__ready = true;
          if (PS.reduce) { a.goToAndStop(p.loop ? p.loop[0] : p.once ? a.totalFrames - 1 : 0, true); if (cb.current) cb.current(); return; }
          if (p.play === false) return;
          if (act.current === false) { a.goToAndStop(first, true); return; }
          start(a);
        });
      }, function () {});
      return function () { dead = true; item.current = null; if (a) a.destroy(); if (p.api) p.api.current = null; };
    }, [p.src, p.play]);
    /* active turning on plays it again from the start; turning off holds the first frame once it has slid away */
    R.useEffect(function () {
      var a = item.current; if (!a || !a.__ready || PS.reduce || p.active === undefined) return;
      if (p.active) { start(a); return; }
      var t = setTimeout(function () { if (item.current === a && act.current === false) { a.loop = false; a.goToAndStop(first, true); } }, 450);
      return function () { clearTimeout(t); };
    }, [p.active]);
    return h('span', { className: PS.cx('ps-lottie', p.className), ref: ref, 'aria-hidden': true, style: Object.assign({ width: PS.rem(p.width), height: PS.rem(p.height || p.width) }, p.style) });
  };
  /* Anim: one of the repo's illustrations by name, cropped to its art so `size` is the picture's box (as the Figma still)
     name: customer-service-chat | customer-service | empty-box | loading-state-otp | safe-transaction | verification-code | doc-verify */
  var ANIMS = PS.ANIMS = {
    'customer-service-chat': { box: [34, 34, 962, 947], intro: [0, 36], loop: [36, 96] },
    'customer-service': { box: [227, 273, 803, 717], intro: [0, 45], loop: [45, 105] },
    'empty-box': { box: [257, 263, 750, 740], once: true },
    'loading-state-otp': { box: [183, 257, 823, 713], intro: [0, 36], loop: [36, 96] },
    'safe-transaction': { box: [283, 240, 743, 730], intro: [0, 54], loop: [54, 114] },
    'verification-code': { box: [240, 300, 790, 713], intro: [0, 56], loop: [56, 116] },
    'doc-verify': { box: [50, 33, 983, 967], intro: [0, 36], loop: [36, 96] }
  };
  PS.Anim = function Anim(p) {
    var a = ANIMS[p.name], b = a.box, side = Math.max(b[2] - b[0], b[3] - b[1]) * (p.fit || 1), cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2;
    return h(PS.Lottie, { src: PS.root + 'animations/' + p.name + '/' + p.name + '.json', width: p.size || 100, className: p.className, style: p.style,
      viewBox: [cx - side / 2, cy - side / 2, side, side].map(Math.round).join(' '), intro: a.intro, loop: a.loop, once: a.once, active: p.active });
  };

  /* TextLink (spec TextLink.md, Figma 11006:366): an underlined link on its own line, 45 px tall (Login: "No longer have access to old number?")
     · tone default | inverse (on navy) · state default | pressed | disabled (gallery; app: disabled) · label or children · icon (trailing, 16) · onClick */
  PS.TextLink = function TextLink(p) {
    var st = p.state || 'default', off = p.disabled || st === 'disabled';
    return h('button', { type: 'button', disabled: off, onClick: p.onClick,
        className: PS.cx('ps-ulink', p.tone === 'inverse' && 'ps-ulink--inverse', st === 'pressed' && 'is-pressed', off && 'is-disabled', p.className) },
      p.children != null ? p.children : p.label, p.icon ? h(PS.Icon, { name: p.icon, size: 16 }) : null);
  };
  /* InfoButton: a value with a help mark after it that opens an explainer (Payment detail: "18 days ⓘ") · onClick(event) · children.
     The mark is its last child, so a tooltip can be anchored to event.currentTarget.lastChild. */
  PS.InfoButton = function InfoButton(p) {
    return h('button', { type: 'button', className: PS.cx('ps-inline', p.className), onClick: p.onClick }, p.children, h(PS.Icon, { name: 'help-circle', size: 16, color: 'tertiary' }));
  };
  /* SectionLabel: the small uppercase grey label over a list (UPCOMING, a date in Loan history) · tone negative (OVERDUE) · inset (8 in, not 12) */
  PS.SectionLabel = function SectionLabel(p) {
    return h('p', { className: PS.cx('ps-seclabel', p.inset && 'ps-seclabel--in8', p.tone === 'negative' && 'ps-c-negative', p.className) }, p.children);
  };
})();
