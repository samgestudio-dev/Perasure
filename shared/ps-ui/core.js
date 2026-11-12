/* PeraSure UI — core: the namespace, motion values, helpers and atoms (icon, amount, button, tag, chip, check, card,
   section, rows). Load order: react, react-dom, motion-react, then core.js, layout.js, and the area files the page needs
   (home.js, coupon.js, loan.js, account.js). Each file adds components to window.PS. Styles: ps-ui.css.
   No JSX, no build step: PS.h = React.createElement. Docs and props: shared/README.md, live: shared/gallery.html. */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, h = R.createElement;
  var PS = window.PS = window.PS || {};

  /* assets sit next to this file, so a page anywhere in the repo can use the components */
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? me.replace(/[^/]*(\?.*)?$/, '') : '../../shared/ps-ui/';
  PS.base = BASE;
  PS.asset = function (p) { return BASE + 'assets/' + p; };

  PS.h = h; PS.m = M.m; PS.AP = M.AnimatePresence;
  PS.reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---- motion: the PeraSure values, the same as prototypes/withdraw-fund-flow/motion-tokens.js and the
     perasure-card-morph skill. Never sped up for a short move; nothing bounces. ---- */
  var EASE_IN = [0.22, 0.61, 0.36, 1];
  var MT = PS.MT = {
    /* geometry (sheets, pages, pills): withdraw's Smooth spring, settles within 0.378 px — 95 % at ≈ 290 ms, rest ≈ 560 ms */
    SPRING: { type: 'spring', stiffness: 240, damping: 30, mass: 1, restDelta: 0.378, restSpeed: 3.78 },
    EASE_IN: EASE_IN,
    ENTER: { duration: 0.30, delay: 0.07, ease: EASE_IN },     /* what comes in: rises from below, 3 px blur → sharp */
    LEAVE: { duration: 0.15, ease: [0.4, 0, 1, 1] },           /* what goes: rises out, sharp → 3 px blur */
    Y: { text: 8, block: 10, digit: 6 }, BLUR: 3,
    REVEAL: function (i) { return { duration: 0.34, delay: 0.06 + (i || 0) * 0.03, ease: EASE_IN }; },
    PRESS: { duration: 0.06 }, PRESS_SCALE: { pill: 0.985, icon: 0.92 },
    COLOR: 0.15                                                /* colour changes: 150 ms */
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
  var ICON_C = { primary: 'var(--color-icon-primary)', secondary: 'var(--color-icon-secondary)', tertiary: 'var(--color-icon-tertiary)',
    placeholder: 'var(--color-icon-placeholder)', brand: 'var(--color-icon-brand-default)', 'brand-light': 'var(--color-icon-brand-light)',
    positive: 'var(--color-icon-positive-heavy)', inverse: 'var(--color-icon-inverse)', countdown: 'var(--ps-countdown)', text: 'currentColor' };

  /* Icon: a one-colour icon from assets/icons, drawn as a mask so its colour is a token.
     name: file name without .svg · size (px, 20) · color: primary | secondary | tertiary | brand | positive | inverse | … (default: text colour) */
  PS.Icon = function Icon(p) {
    var st = { '--ps-s': (p.size || 20) + 'px', '--ps-src': 'url("' + PS.asset('icons/' + p.name + '.svg') + '")' };
    if (p.color) st.color = ICON_C[p.color] || p.color;
    return h('span', { className: PS.cx('ps-icon', p.className), style: Object.assign(st, p.style), 'aria-hidden': true });
  };

  /* Art: a full-colour picture from assets/art (illustrations, logos) · name · size (px) · ext (svg) · dir (art | logos) */
  PS.Art = function Art(p) {
    return h('img', { className: PS.cx('ps-art', p.className), src: PS.asset((p.dir || 'art') + '/' + p.name + '.' + (p.ext || 'svg')), alt: p.alt || '',
      style: Object.assign({ '--ps-s': (p.size || 36) + 'px' }, p.style), draggable: false });
  };

  /* Amount: ₱ + digits in the number font (Satoshi; ₱ from Inter), as in the app. Numbers never animate.
     value (number) · dec (2) · curFont: 'num' | 'body' (Inter Medium ₱, loan amount) · strike */
  PS.Amount = function Amount(p) {
    var s = num(p.value, p.dec == null ? 2 : p.dec), neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var parts = s.split('.'), kids = [];
    kids.push(h('span', { key: 'c', className: p.curFont === 'body' ? 'ps-amount__cur ps-amount__cur--body' : 'ps-amount__cur' }, (neg ? '-' : '') + (p.prefix || '') + '₱'));
    kids.push(h('span', { key: 'i', className: 'ps-amount__int' }, parts[0]));
    if (parts[1] != null) kids.push(h('span', { key: 'd', className: 'ps-amount__dec' }, '.' + parts[1]));
    return h('span', { className: PS.cx('ps-amount', p.strike && 'ps-amount--strike', p.className), style: p.style }, kids);
  };

  /* Button: variant primary | text | inverse | shade (on the blue card) | outline (coupon "Use") · size lg | sm · block
     disabled (can't be pressed) · inactive (looks disabled but still calls onClick — e.g. to point at what's missing) */
  PS.Button = function Button(p) {
    var v = p.variant || 'primary', size = p.size || (v === 'outline' || v === 'shade' ? null : 'lg');
    return h(PS.m.button, { type: 'button', className: PS.cx('ps-btn', 'ps-btn--' + v, size && 'ps-btn--' + size, p.block && 'ps-btn--block', p.inactive && 'is-inactive', p.className),
      disabled: p.disabled, 'aria-disabled': p.inactive || undefined, onClick: p.onClick, whileTap: p.disabled || p.inactive ? undefined : PS.TAP, transition: MT.PRESS,
      style: p.style, 'aria-label': p.label },
      p.icon ? h(PS.Icon, { name: p.icon, size: p.iconSize || 16 }) : null, p.children);
  };

  /* Glass: the frosted round / pill button of headers and sheets · icon (name) or children · round (40×40) · label (aria) */
  PS.Glass = function Glass(p) {
    return h(PS.m.button, Object.assign({ type: 'button', className: PS.cx('ps-glass', (p.round !== false && !p.children) && 'ps-glass--round', p.className),
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

  /* Tag: tone outline ("Protected") | soft ("Due in 45 days") | best ("Best") | solid (menu "New") */
  PS.Tag = function Tag(p) { return h('span', { className: PS.cx('ps-tag', 'ps-tag--' + (p.tone || 'outline'), p.className) }, p.children); };
  /* Count: the round number badge of tabs · n · on (inside the active tab) */
  PS.Count = function Count(p) { return h('span', { className: PS.cx('ps-count', p.on && 'ps-count--on') }, p.n); };
  /* Chip: summary pills · tone positive (✓ Saved) | brand (↑ New limit) */
  PS.Chip = function Chip(p) {
    var tone = p.tone || 'positive';
    return h('span', { className: PS.cx('ps-chip', 'ps-chip--' + tone, p.className) },
      h(PS.Icon, { name: p.icon || (tone === 'positive' ? 'check-sm' : 'arrow-up'), size: 12 }), p.children);
  };
  /* Check: the round selection mark (colour changes in 150 ms, as withdraw's agreement) · on · off (can't be picked) · box (2 px ring) */
  PS.Check = function Check(p) {
    return h('span', { className: PS.cx('ps-check', p.on && 'ps-check--on', p.off && !p.on && 'ps-check--off', p.box && 'ps-check--box', p.className), 'aria-hidden': true },
      p.on ? h(PS.Icon, { name: 'check', size: 8, color: 'inverse' }) : null, p.children);
  };
  PS.Divider = function Divider(p) { return h('span', { className: PS.cx('ps-divider', p.vertical && 'ps-divider--v', p.dashed && 'ps-divider--dash'), 'aria-hidden': true }); };

  /* Card: white rounded card · variant plain | outline (home: 2 px white ring) | raised (shadow) · clip · as (element) */
  PS.Card = function Card(p) {
    var v = p.variant || 'plain';
    return h(p.as || 'div', { className: PS.cx('ps-card', v !== 'plain' && 'ps-card--' + v, p.clip && 'ps-card--clip', p.className), style: p.style, onClick: p.onClick }, p.children);
  };
  /* Section: uppercase label above a card, optional action link ("See all 6") */
  PS.Section = function Section(p) {
    return h('section', { className: PS.cx('ps-section', p.className) },
      h('div', { className: 'ps-section__head' }, h('p', { className: 'ps-section__label' }, p.label),
        p.action ? h(PS.m.button, Object.assign({ type: 'button', className: 'ps-link', onClick: p.onAction }, PS.press()), p.action) : null),
      p.children);
  };
  PS.Link = function Link(p) { return h(PS.m.button, Object.assign({ type: 'button', className: PS.cx('ps-link', p.className), onClick: p.onClick }, PS.press()), p.children); };
  /* KV: a label / value row · tone positive (green value) */
  PS.KV = function KV(p) {
    return h('div', { className: PS.cx('ps-kv', 'ps-t-body-md-em', p.tone && 'is-' + p.tone, p.className) }, h('span', null, p.label), h('span', null, p.value));
  };
  /* Rows: KV rows with dividers between them */
  PS.Rows = function Rows(p) {
    var out = [];
    p.rows.forEach(function (r, i) {
      if (i) out.push(h(PS.Divider, { key: 'd' + i }));
      out.push(r.node ? R.cloneElement(r.node, { key: 'r' + i }) : h(PS.KV, { key: r.key || r.label, label: r.label, value: r.value, tone: r.tone }));
    });
    return out;
  };
  /* Swap: text that changes after a tap crossfades in place (old rises out, new rises in, 3 px blur between) · block (fills the width).
     k: what identifies the content — key it on the state, not on a number that follows a slider (numbers never animate). */
  PS.Swap = function Swap(p) {
    var f = PS.fade(p.y);
    return h('span', { style: Object.assign({ position: 'relative', display: p.block ? 'grid' : 'inline-grid', minWidth: 0 }, p.style), className: p.className },
      h(PS.AP, { initial: false },
        h(PS.m.span, Object.assign({ key: p.k, style: p.block ? { gridArea: '1 / 1', display: 'block', minWidth: 0 } : { gridArea: '1 / 1', display: 'inline-flex', alignItems: 'baseline', minWidth: 0 } }, f), p.children)));
  };
})();
