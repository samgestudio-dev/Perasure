/* PeraSure UI — core: the namespace, helpers and atoms (icon, amount, button, tag, chip, check, card, section, rows).
   Load order: react, react-dom, motion-react, then core.js, layout.js, and the area files the page needs
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
  function spring(d, b) { return { type: 'spring', visualDuration: d, bounce: b }; }
  /* springs (visualDuration + bounce, like the Playground's PG.T) */
  PS.T = { ui: spring(0.3, 0.15), snap: spring(0.22, 0), pop: spring(0.35, 0.3), layout: spring(0.4, 0.12), sheet: spring(0.42, 0.08), page: spring(0.4, 0.04) };
  PS.TAP = { scale: 0.97 };
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

  /* Art: a full-colour picture from assets/art (illustrations, logos) · name · size (px) · ext (svg) */
  PS.Art = function Art(p) {
    return h('img', { className: PS.cx('ps-art', p.className), src: PS.asset((p.dir || 'art') + '/' + p.name + '.' + (p.ext || 'svg')), alt: p.alt || '',
      style: Object.assign({ '--ps-s': (p.size || 36) + 'px' }, p.style), draggable: false });
  };

  /* Amount: ₱ + digits in the number font (Satoshi; ₱ from Inter), as in the app.
     value (number) · dec (2) · curFont: 'num' | 'body' (Inter Medium ₱, loan amount) · split: decimals in their own span (credit card) · strike */
  PS.Amount = function Amount(p) {
    var s = num(p.value, p.dec == null ? 2 : p.dec), neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var parts = s.split('.'), kids = [];
    kids.push(h('span', { key: 'c', className: p.curFont === 'body' ? 'ps-amount__cur ps-amount__cur--body' : 'ps-amount__cur' }, (neg ? '-' : '') + (p.prefix || '') + '₱'));
    kids.push(h('span', { key: 'i', className: 'ps-amount__int' }, parts[0]));
    if (parts[1] != null) kids.push(h('span', { key: 'd', className: 'ps-amount__dec' }, '.' + parts[1]));
    return h('span', { className: PS.cx('ps-amount', p.strike && 'ps-amount--strike', p.className), style: p.style }, kids);
  };

  /* Button: variant primary | text | inverse | shade (on the blue card) | outline (coupon "Use") · size lg | sm · block */
  PS.Button = function Button(p) {
    var v = p.variant || 'primary', size = p.size || (v === 'outline' || v === 'shade' ? null : 'lg');
    return h(PS.m.button, { type: 'button', className: PS.cx('ps-btn', 'ps-btn--' + v, size && 'ps-btn--' + size, p.block && 'ps-btn--block', p.className),
      disabled: p.disabled, onClick: p.onClick, whileTap: p.disabled ? undefined : PS.TAP, transition: PS.T.snap, style: p.style, 'aria-label': p.label },
      p.icon ? h(PS.Icon, { name: p.icon, size: p.iconSize || 16 }) : null, p.children);
  };

  /* Glass: the frosted round / pill button of headers and sheets · icon (name) or children · round (40×40) · label (aria) */
  PS.Glass = function Glass(p) {
    return h(PS.m.button, { type: 'button', className: PS.cx('ps-glass', (p.round !== false && !p.children) && 'ps-glass--round', p.className),
      onClick: p.onClick, whileTap: PS.TAP, transition: PS.T.snap, 'aria-label': p.label, style: p.style },
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
  /* Check: the round selection mark · on · off (can't be picked) · box (2 px ring, agreement) */
  PS.Check = function Check(p) {
    return h('span', { className: PS.cx('ps-check', p.on && 'ps-check--on', p.off && !p.on && 'ps-check--off', p.box && 'ps-check--box', p.className), 'aria-hidden': true },
      h(PS.AP, { initial: false }, p.on ? h(PS.m.span, { key: 'k', initial: { scale: 0.4, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.4, opacity: 0 }, transition: PS.T.pop, style: { display: 'flex' } },
        h(PS.Icon, { name: 'check', size: 8, color: 'inverse' })) : null));
  };
  PS.Divider = function Divider(p) { return h('span', { className: PS.cx('ps-divider', p.vertical && 'ps-divider--v'), 'aria-hidden': true }); };

  /* Card: white rounded card · variant plain | outline (home: 2 px white ring) | raised (shadow) · clip · as (element) */
  PS.Card = function Card(p) {
    var v = p.variant || 'plain';
    return h(p.as || 'div', { className: PS.cx('ps-card', v !== 'plain' && 'ps-card--' + v, p.clip && 'ps-card--clip', p.className), style: p.style, onClick: p.onClick }, p.children);
  };
  /* Section: uppercase label above a card, optional action link ("See all 6") */
  PS.Section = function Section(p) {
    return h('section', { className: PS.cx('ps-section', p.className) },
      h('div', { className: 'ps-section__head' }, h('p', { className: 'ps-section__label' }, p.label),
        p.action ? h(PS.m.button, { type: 'button', className: 'ps-link', onClick: p.onAction, whileTap: PS.TAP }, p.action) : null),
      p.children);
  };
  PS.Link = function Link(p) { return h(PS.m.button, { type: 'button', className: PS.cx('ps-link', p.className), onClick: p.onClick, whileTap: PS.TAP }, p.children); };
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
  /* Swap: content that changes cross-fades in place (text, amounts) · k: what identifies the content */
  PS.Swap = function Swap(p) {
    return h('span', { style: Object.assign({ position: 'relative', display: 'inline-grid' }, p.style), className: p.className },
      h(PS.AP, { initial: false, mode: 'popLayout' },
        h(PS.m.span, { key: p.k, style: { gridArea: '1 / 1', display: 'inline-flex', alignItems: 'baseline' }, initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: PS.T.snap }, p.children)));
  };
})();
