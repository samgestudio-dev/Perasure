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
  var ICON_C = { primary: 'var(--color-icon-primary)', secondary: 'var(--color-icon-secondary)', tertiary: 'var(--color-icon-tertiary)',
    placeholder: 'var(--color-icon-placeholder)', brand: 'var(--color-icon-brand-default)', 'brand-light': 'var(--color-icon-brand-light)',
    positive: 'var(--color-icon-positive-heavy)', inverse: 'var(--color-icon-inverse)', countdown: 'var(--ps-countdown)', text: 'currentColor' };

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

  /* ---- animations: the repo's Lottie files (animations/<slug>/), played with lottie-web (SVG renderer), which is loaded
     the first time one is shown. Owner's rule: wherever Figma shows a still that has an animation, play the animation. ---- */
  PS.root = BASE + '../../';
  var lottieP = null;
  PS.loadLottie = function () {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (!lottieP) lottieP = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = PS.root + 'vendor/lottie-web@5.12.2/lottie_svg.min.js';
      s.onload = function () { res(window.lottie); }; s.onerror = rej; document.head.appendChild(s);
    });
    return lottieP;
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
})();
