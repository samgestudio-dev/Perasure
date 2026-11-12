/* PeraSure UI — layout: the phone shell, a screen (scroller + header + bottom bar), page transitions, navigator,
   sheets, tooltip and toast. Needs core.js. Phone fitting itself is phone-fit.js (in <head>). */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP;

  /* Shell: Motion (LazyMotion domMax, strict) + the 360 px frame. Everything of a phone page goes inside. */
  PS.Shell = function Shell(p) {
    return h(M.LazyMotion, { features: M.domMax, strict: true },
      h(M.MotionConfig, { reducedMotion: 'user' },
        h('div', { className: 'ps-wrap' }, h('div', { className: 'ps-frame', ref: p.frameRef }, p.children))));
  };
  PS.mount = function (App, el) { window.ReactDOM.createRoot(el || document.getElementById('root')).render(h(App)); };

  /* a rect relative to the frame (for tooltips placed next to what was tapped) */
  PS.frameRect = function (el) {
    var f = el.closest('.ps-frame'), a = el.getBoundingClientRect(), b = f ? f.getBoundingClientRect() : { left: 0, top: 0 };
    return { left: a.left - b.left, top: a.top - b.top, right: a.right - b.left, bottom: a.bottom - b.top, width: a.width, height: a.height };
  };

  /* Bands: the progressive-blur layers + token veil of a bar (pos top | bot · secondary: #EBF0EF bottom of secondary pages) */
  PS.Bands = function Bands(p) {
    return h('div', { className: PS.cx('ps-pb', 'ps-pb--' + (p.pos || 'top'), p.secondary && 'ps-pb--secondary'), 'aria-hidden': true },
      h('i'), h('i'), h('i'), h('i'), h('i'), h('i', { className: 'ps-veil' }));
  };

  /* TopBar: left (node) · title (text) · right (node) · extra (node under the 116 px bar, e.g. tabs) + extraHeight · solid (page colour, no blur) · live */
  PS.TopBar = function TopBar(p) {
    var hgt = 116 + (p.extraHeight || 0);
    return h('header', { className: PS.cx('ps-top', p.solid && 'ps-top--solid', p.live && 'is-live'), style: { '--ps-top-h': hgt + 'px' } },
      h(PS.Bands, { pos: 'top' }),
      h('div', { className: 'ps-top__row' },
        h('div', { className: 'ps-top__side' }, p.left),
        p.title ? h('p', { className: 'ps-top__title ps-t-section-sm' }, p.title) : null,
        h('div', { className: 'ps-top__side ps-top__side--end' }, p.right)),
      p.extra ? h('div', { className: 'ps-top__extra' }, p.extra) : null);
  };

  /* BottomBar: the bottom action area (primary button, links) · secondary: #EBF0EF gradient (secondary pages, blur off) */
  PS.BottomBar = function BottomBar(p) {
    return h('div', { className: PS.cx('ps-bot', p.className) }, h(PS.Bands, { pos: 'bot', secondary: p.secondary }), p.children);
  };

  /* Navigator: the tab bar · tabs [{ id, label, icon }] · value · onChange(id). The pill glides between tabs. */
  PS.Navigator = function Navigator(p) {
    return h('nav', { className: 'ps-nav', 'aria-label': 'Main' }, h(PS.Bands, { pos: 'bot' }),
      h('div', { className: 'ps-nav__bar' }, p.tabs.map(function (t) {
        var on = t.id === p.value;
        return h(m.button, { key: t.id, type: 'button', className: 'ps-nav__tab', 'aria-current': on ? 'page' : undefined, whileTap: PS.TAP,
          onClick: function () { if (!on && p.onChange) p.onChange(t.id); } },
          on ? h(m.span, { layoutId: (p.id || 'ps-nav') + '-pill', className: 'ps-nav__pill', transition: PS.T.layout }, h('i')) : null,
          h(PS.Icon, { name: t.icon, size: 18, color: 'primary' }), h('span', null, t.label));
      })));
  };

  /* Screen: one page of the app. Owns its scroller; the header's blur runs only while content is under it, and with
     blur off the bottom gradient fades out over the last stretch of scroll (CLAUDE.md → "Header and bottom bars").
     top: TopBar props · bottom: node (a BottomBar or a Navigator) · tint: green top glow (loan pages) · colTop / colBottom (px)
     scrollRef: gets the scroller · className: on the column · children: the page content */
  PS.Screen = function Screen(p) {
    var sc = R.useRef(null), bot = R.useRef(null), col = R.useRef(null), ls = R.useState(false), live = ls[0], setLive = ls[1], liveRef = R.useRef(false);
    var update = R.useCallback(function () {
      var s = sc.current; if (!s) return;
      var on = s.scrollTop > 0;
      if (on !== liveRef.current) { liveRef.current = on; setLive(on); }
      var b = bot.current && bot.current.firstElementChild;
      if (b) {
        var left = s.scrollHeight - s.clientHeight - s.scrollTop, o = Math.max(0, Math.min(1, left / (b.offsetHeight || 1)));
        bot.current.style.setProperty('--ps-bot-fade', o.toFixed(3));
      }
      if (p.onScroll) p.onScroll(s);
    }, [p.onScroll]);
    R.useEffect(function () {
      update();
      var ro = window.ResizeObserver ? new ResizeObserver(update) : null;
      if (ro && col.current) ro.observe(col.current);
      window.addEventListener('ps-viewport', update);
      return function () { if (ro) ro.disconnect(); window.removeEventListener('ps-viewport', update); };
    }, [update]);
    R.useEffect(function () { if (p.scrollRef) p.scrollRef.current = sc.current; });
    var colStyle = {};
    if (p.colTop != null) colStyle['--ps-col-top'] = p.colTop + 'px';
    if (p.colBottom != null) colStyle['--ps-col-bottom'] = p.colBottom + 'px';
    return h('div', { className: 'ps-screen' },
      p.tint ? h('div', { className: 'ps-screen__tint' }) : null,
      h('div', { className: 'ps-scroll', ref: sc, onScroll: update },
        h('div', { className: PS.cx('ps-col', p.className), ref: col, style: colStyle }, p.children)),
      p.top ? h(PS.TopBar, Object.assign({}, p.top, { live: live })) : null,
      p.bottom ? h('div', { ref: bot, style: { display: 'contents' } }, p.bottom) : null,
      p.overlay || null);
  };

  /* Pages: one page at a time, pushed in from the right (dir 1), popped back (dir -1) or swapped in place (dir 0).
     id: the page's key · dir · children: the page */
  var PAGE = {
    enter: function (d) { return d ? { x: d > 0 ? 360 : -96, zIndex: d > 0 ? 2 : 0, opacity: 1 } : { opacity: 0, zIndex: 1 }; },
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: function (d) { return d ? { x: d > 0 ? -96 : 360, zIndex: d > 0 ? 0 : 2, opacity: 1 } : { opacity: 0, zIndex: 0 }; }
  };
  PS.Pages = function Pages(p) {
    return h(AP, { initial: false, custom: p.dir || 0 },
      h(m.div, { key: p.id, custom: p.dir || 0, className: 'ps-page', variants: PAGE, initial: 'enter', animate: 'center', exit: 'exit',
        transition: p.dir ? PS.T.page : { duration: 0.18 } }, p.children));
  };

  /* Sheet: open · kind page (fills below the header: coupon picker) | card (floating, scrim: decisions) | plain (bottom, white: plans)
     onClose · label (aria) · scrim (default: card / plain) · children. Drag the top edge down to close. */
  function SheetBody(p) {
    var kind = p.kind || 'plain', controls = M.useDragControls(), scrim = p.scrim != null ? p.scrim : kind !== 'page';
    return h('div', { className: 'ps-layer', role: 'dialog', 'aria-modal': true, 'aria-label': p.label },
      scrim ? h(m.div, { className: 'ps-scrim', initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 }, onClick: p.onClose })
            : h('div', { className: 'ps-scrim ps-scrim--clear', onClick: p.onClose }),
      h(m.div, { className: PS.cx('ps-sheet', 'ps-sheet--' + kind, p.className), initial: { y: '110%' }, animate: { y: 0 }, exit: { y: '110%' }, transition: PS.T.sheet,
        drag: 'y', dragListener: false, dragControls: controls, dragConstraints: { top: 0, bottom: 0 }, dragElastic: { top: 0.04, bottom: 0.7 },
        onDragEnd: function (e, i) { if (i.offset.y > 90 || i.velocity.y > 600) p.onClose(); } },
        h('span', { className: 'ps-sheet__grab', 'aria-hidden': true }),
        h('div', { className: 'ps-sheet__drag', onPointerDown: function (e) { controls.start(e); } }),
        p.children));
  }
  PS.Sheet = function Sheet(p) { return h(AP, null, p.open ? h(SheetBody, Object.assign({ key: 'sheet' }, p)) : null); };
  /* SheetTitle: title + close button row of a plain sheet */
  PS.SheetTitle = function SheetTitle(p) {
    return h('div', { className: 'ps-sheet__titlebar' }, h('p', { className: 'ps-t-title-sm' }, p.children), h(PS.Close, { onClick: p.onClose }));
  };

  /* Tooltip: a frosted bubble · open · at { x, y } (frame px) · text · onClose (any tap closes it) */
  PS.Tooltip = function Tooltip(p) {
    return h(AP, null, p.open ? h(R.Fragment, { key: 'tip' },
      h('div', { className: 'ps-tip-catch', onClick: p.onClose }),
      h(m.div, { className: 'ps-tip ps-bubble ps-t-body-md', role: 'tooltip', style: { left: p.at.x, top: p.at.y }, onClick: p.onClose,
        initial: { opacity: 0, y: -6, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -4 }, transition: PS.T.ui }, p.text)) : null);
  };

  /* TuneButton: opens the prototype's Tune panel (tune.js); nothing when the page has none */
  PS.TuneButton = function TuneButton() {
    if (!window.PSTune) return null;
    return h(m.button, { type: 'button', className: 'ps-tune-btn', onClick: window.PSTune.open, whileTap: PS.TAP }, 'Tune');
  };

  /* Toast: a short message above the bottom bar · msg (null hides) · bottom (px above the frame bottom, 120) */
  PS.Toast = function Toast(p) {
    return h(AP, null, p.msg ? h(m.div, { key: p.msg, className: 'ps-toast ps-bubble ps-t-body-md', role: 'status', style: p.bottom ? { '--ps-toast-bottom': p.bottom + 'px' } : null,
      initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: PS.T.ui }, p.msg) : null);
  };
  /* useToast: [msg, show(text, ms)] */
  PS.useToast = function () {
    var s = R.useState(null), t = R.useRef(0);
    var show = R.useCallback(function (text, ms) { clearTimeout(t.current); s[1](text); t.current = setTimeout(function () { s[1](null); }, ms || 2600); }, []);
    return [s[0], show];
  };
})();
