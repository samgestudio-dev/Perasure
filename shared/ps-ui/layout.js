/* PeraSure UI — layout: the phone shell, a screen (scroller + header + bottom bar), page transitions, navigator,
   sheets, tooltip and toast. Needs core.js. Phone fitting itself is phone-fit.js (in <head>). */
(function () {
  'use strict';
  var R = window.React, M = window.Motion, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP;

  /* Shell: Motion (LazyMotion domMax, strict) + the frame (the phone's full width). Everything of a phone page goes inside. */
  PS.Shell = function Shell(p) {
    return h(M.LazyMotion, { features: M.domMax, strict: true },
      h(M.MotionConfig, { reducedMotion: 'user' },
        h('div', { className: 'ps-wrap' }, h('div', { className: 'ps-frame', ref: p.frameRef }, p.children))));
  };
  PS.mount = function (App, el) { window.ReactDOM.createRoot(el || document.getElementById('root')).render(h(App)); };

  /* a rect relative to the frame (for tooltips placed next to what was tapped) */
  PS.frameWidth = function (el) { var f = (el && el.closest && el.closest('.ps-frame')) || document.querySelector('.ps-frame'); return f ? f.clientWidth : window.innerWidth; };
  PS.frameRect = function (el) {
    var f = el.closest('.ps-frame'), a = el.getBoundingClientRect(), b = f ? f.getBoundingClientRect() : { left: 0, top: 0 };
    return { left: a.left - b.left, top: a.top - b.top, right: a.right - b.left, bottom: a.bottom - b.top, width: a.width, height: a.height };
  };

  /* the outermost page (PS.Pages) an element is in, or the element itself: what a full-screen cover fills, and where a page's scroll state is kept */
  PS.pageOf = function (el) { var pg = el.closest('.ps-page'), up; while (pg && (up = pg.parentElement && pg.parentElement.closest('.ps-page'))) pg = up; return pg || el; };

  /* Bands: the progressive-blur layers + token veil of a bar (pos top | bot · secondary: #EBF0EF bottom of secondary pages) */
  PS.Bands = function Bands(p) {
    return h('div', { className: PS.cx('ps-pb', 'ps-pb--' + (p.pos || 'top'), p.secondary && 'ps-pb--secondary'), 'aria-hidden': true },
      h('i'), h('i'), h('i'), h('i'), h('i'), h('i', { className: 'ps-veil' }));
  };

  /* TopBar: left (node) · title (text) · right (node) · extra (node under the 116 px bar, e.g. tabs) + extraHeight · solid (page colour, no blur) · live */
  PS.TopBar = function TopBar(p) {
    var hgt = 116 + (p.extraHeight || 0);
    return h('header', { className: PS.cx('ps-top', p.solid && 'ps-top--solid', p.live && 'is-live'), style: { '--ps-top-h': PS.y(hgt) } },
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
        return h(m.button, Object.assign({ key: t.id, type: 'button', className: 'ps-nav__tab', 'aria-current': on ? 'page' : undefined,
          onClick: function () { if (!on && p.onChange) p.onChange(t.id); } }, PS.press()),
          on ? h(m.span, { layoutId: (p.id || 'ps-nav') + '-pill', className: 'ps-nav__pill', transition: PS.MT.SPRING }, h('i')) : null,
          h(PS.Icon, { name: t.icon, size: 18, color: 'primary' }), h('span', null, t.label));
      })));
  };

  /* Screen: one page of the app. Owns its scroller. The bars have no colour while they cover nothing: the header's veil (and blur)
     comes in as content scrolls under it, the bottom bar's goes as the scroll reaches the end (CLAUDE.md → "Header and bottom bars").
     top: TopBar props · bottom: node (a BottomBar or a Navigator) · tint: green top glow (loan pages) · colTop / colBottom (px)
     scrollRef: gets the scroller · className: on the column · rise: the content rises in piece by piece when the page first shows · children: the page content
     secondary: a secondary page (二级页面: every page but the app's tabs — owner): the header is solid, in the page's own colour, and the bottom
     bar's veil is the secondary-page colour (CLAUDE.md) */
  PS.Screen = function Screen(p) {
    var sc = R.useRef(null), bot = R.useRef(null), col = R.useRef(null), fade = R.useRef({}), ls = R.useState(false), live = ls[0], setLive = ls[1], liveRef = R.useRef(false);
    var update = R.useCallback(function () {
      var s = sc.current; if (!s) return;
      var on = s.scrollTop > 0;
      if (on !== liveRef.current) { liveRef.current = on; setLive(on); }
      /* the bars have no colour while they cover nothing (owner): the header's fades in over the first 24 px of scroll, the bottom one
         (this page's bar, or the tab bar around it) fades out over the last stretch of scroll, as tall as the bar — both follow the scroll */
      var root = s.parentNode, host = PS.pageOf(root), f = fade.current;
      var t = Math.max(0, Math.min(1, s.scrollTop / 24)).toFixed(3);
      if (t !== f.t) { f.t = t; root.style.setProperty('--ps-top-fade', t); }
      var b = (bot.current && bot.current.firstElementChild) || host.querySelector('.ps-nav');
      var left = s.scrollHeight - s.clientHeight - s.scrollTop, o = Math.max(0, Math.min(1, left / ((b && b.offsetHeight) || 108))).toFixed(3);
      if (o !== f.o) { f.o = o; host.style.setProperty('--ps-bot-fade', o); }
      /* room under the content for this page's own bar, however tall large text makes it (never less than colBottom) */
      var own = bot.current && bot.current.firstElementChild, room = own ? own.offsetHeight + 16 + 'px' : '0px';
      if (room !== f.r && col.current) { f.r = room; col.current.style.setProperty('--ps-bot-room', room); }
      if (p.onScroll) p.onScroll(s);
    }, [p.onScroll]);
    R.useEffect(function () {
      update();
      var ro = window.ResizeObserver ? new ResizeObserver(update) : null;
      if (ro && col.current) ro.observe(col.current);
      if (ro && bot.current && bot.current.firstElementChild) ro.observe(bot.current.firstElementChild);
      window.addEventListener('ps-viewport', update);
      return function () { if (ro) ro.disconnect(); window.removeEventListener('ps-viewport', update); };
    }, [update]);
    R.useEffect(function () { if (p.scrollRef) p.scrollRef.current = sc.current; });
    R.useLayoutEffect(function () { if (p.rise) PS.rise(col.current, { delay: 120 }); }, []);
    var es = R.useState(null), colStyle = {};
    if (p.colTop != null) colStyle['--ps-col-top'] = PS.y(p.colTop);
    if (p.colBottom != null) colStyle['--ps-col-bottom'] = PS.rem(p.colBottom);
    return h('div', { className: PS.cx('ps-screen', p.secondary && 'ps-screen--secondary'), ref: es[1] },
      p.tint ? h('div', { className: 'ps-screen__tint' }) : null,
      h(ScreenCtx.Provider, { value: es[0] }, h('div', { className: 'ps-scroll', ref: sc, onScroll: update },
        h('div', { className: PS.cx('ps-col', p.className), ref: col, style: colStyle }, p.children))),
      p.top ? h(PS.TopBar, Object.assign({}, p.top, { live: live }, p.secondary ? { solid: true } : null)) : null,
      p.bottom ? h('div', { ref: bot, style: { display: 'contents' } }, p.bottom) : null,
      p.overlay || null);
  };
  /* Cover: a layer over the page it is used in — a page that is still loading, or that failed. Use it anywhere inside a PS.Screen.
     Loading (default) is the whole screen and nothing else (owner): it covers the header, the bottom bar and the tab bar too.
     chrome: keep the header and the tab bar (a failed page: the way back stays) — it then covers the content and the bottom bar only.
     open · tone page | white (the fallback page) · chrome · children. It is there at once and leaves on LEAVE. */
  var ScreenCtx = R.createContext(null);
  PS.Cover = function Cover(p) {
    var el = R.useContext(ScreenCtx), host = el && !p.chrome ? PS.pageOf(el) : el;
    R.useLayoutEffect(function () {
      if (!el) return;
      el.classList.toggle('is-covered', !!p.open);
      return function () { el.classList.remove('is-covered'); };
    }, [el, p.open]);
    if (!host) return null;
    return window.ReactDOM.createPortal(h(AP, { initial: false }, p.open ? h(m.div, { key: 'cover', className: PS.cx('ps-cover', !p.chrome && 'ps-cover--full', p.tone === 'white' && 'ps-cover--white'),
      exit: { opacity: 0, transition: PS.MT.LEAVE } }, p.children) : null), host);
  };

  /* Pages: one page at a time, pushed in from the right (dir 1), popped back (dir -1) or swapped in place (dir 0);
     dir 2: the new page rises from the bottom over the old one — the Withdraw demo's loan screen: in on the Smooth spring;
     dir -2: it goes back down in 0.3 s on (0.4, 0, 1, 1), as there.
     Push / pop ride the PeraSure Smooth spring (the page underneath moves a quarter as far); a swap crossfades on
     ENTER / LEAVE. A page that is leaving no longer takes taps. id: the page's key · dir · children: the page */
  /* page changes crossfade, as home's tabs do (owner: no sideways slide) — the new page fades in on ENTER, the old one out on LEAVE;
     dir 2 / -2: a page that rises from the bottom like a sheet / goes back down (withdraw's sheet exit) */
  var PAGE = {
    enter: function (d) {
      if (d === 2) return { x: '0%', y: '100%', opacity: 1, zIndex: 2 };
      if (d === -2) return { x: '0%', y: '0%', opacity: 1, zIndex: 0 };
      return { x: '0%', y: '0%', opacity: 0, zIndex: 1 };
    },
    center: function (d) { return d === 2 || d === -2 ? { x: '0%', y: '0%', opacity: 1, zIndex: 1, transition: PS.MT.SPRING_PCT } : { x: '0%', y: '0%', opacity: 1, zIndex: 1, transition: { opacity: PS.MT.ENTER } }; },
    exit: function (d) {
      if (d === 2) return { opacity: 0.999, zIndex: 0, transition: { duration: 0.56 } };          /* stays where it is while the new page covers it */
      if (d === -2) return { y: '100%', zIndex: 2, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } };   /* withdraw's sheet exit */
      return { opacity: 0, zIndex: 0, transition: PS.MT.LEAVE };
    }
  };
  function PageBox(p) {
    var present = M.useIsPresent();
    return h(m.div, { className: 'ps-page', custom: p.dir, variants: PAGE, initial: 'enter', animate: 'center', exit: 'exit',
      style: { pointerEvents: present ? 'auto' : 'none' } }, p.children);
  }
  PS.Pages = function Pages(p) {
    return h(AP, { initial: false, custom: p.dir || 0 }, h(PageBox, { key: p.id, dir: p.dir || 0 }, p.children));
  };

  /* Sheet: open · kind page (fills below the header: coupon picker) | card (floating, scrim: decisions) | plain (bottom, white: plans)
     onClose · label (aria) · scrim (default: card / plain) · children. Slides on the Smooth spring; the scrim fades in 0.2 s and
     out on LEAVE. Drag the top edge down to close. While it closes it no longer blocks the page. */
  function SheetBody(p) {
    var kind = p.kind || 'plain', controls = M.useDragControls(), scrim = p.scrim != null ? p.scrim : kind !== 'page', present = M.useIsPresent(), box = R.useRef(null);
    R.useLayoutEffect(function () { PS.rise(box.current, { skip: 2, delay: 110, y: PS.MT.Y.text }); }, []);   /* what is in the sheet rises in piece by piece while it slides up */
    return h('div', { className: 'ps-layer', role: 'dialog', 'aria-modal': true, 'aria-label': p.label, style: present ? null : { pointerEvents: 'none' } },
      scrim ? h(m.div, { className: 'ps-scrim', initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: PS.MT.LEAVE }, onClick: p.onClose })
            : h('div', { className: 'ps-scrim ps-scrim--clear', onClick: p.onClose }),
      h(m.div, { ref: box, className: PS.cx('ps-sheet', 'ps-sheet--' + kind, p.className), initial: { y: '100%' }, animate: { y: '0%' }, exit: { y: '100%' }, transition: PS.MT.SPRING_PCT,
        drag: 'y', dragListener: false, dragControls: controls, dragConstraints: { top: 0, bottom: 0 }, dragElastic: { top: 0, bottom: 0.6 },
        dragTransition: { bounceStiffness: 240, bounceDamping: 30 },
        onDragEnd: function (e, i) { if (i.offset.y > 96 || i.velocity.y > 640) p.onClose(); } },
        h('span', { className: 'ps-sheet__grab', 'aria-hidden': true }),
        h('div', { className: 'ps-sheet__drag', onPointerDown: function (e) { controls.start(e); } }),
        p.children));
  }
  PS.Sheet = function Sheet(p) { return h(AP, null, p.open ? h(SheetBody, Object.assign({ key: 'sheet' }, p)) : null); };
  /* SheetTitle: title + close button row of a plain sheet */
  PS.SheetTitle = function SheetTitle(p) {
    return h('div', { className: 'ps-sheet__titlebar' }, h('p', { className: 'ps-t-title-sm' }, p.children), h(PS.Close, { onClick: p.onClose }));
  };

  /* Tooltip: a frosted bubble that places itself · open · text (string or node) · onClose (any tap closes it) · width (250)
     icon: a 28 px brand tile with that icon before the text, and a × after it (Figma 9137:25806) · big: the roomy one (16 padding, radius 24:
     the penalty explainer, Figma 10545:38381)
     anchor { left, top, right, bottom } (frame px, PS.frameRect(el)): one corner covers what was tapped and reaches 12 px past it on both
     sides (owner) — the top-right corner for something in the right third of the screen, the top-left in the left third, centred over it in
     the middle; when there is no room below it covers it with a bottom corner instead and opens upwards; always inside the 16 px screen
     margins. at { x, y } (older calls): a top-left corner, kept on screen. Grows from the anchor on ENTER, goes on LEAVE. */
  function TipBody(p) {
    var ref = R.useRef(null);
    R.useLayoutEffect(function () {
      var el = ref.current, f = el && el.offsetParent; if (!el || !f) return;
      var w = el.offsetWidth, hh = el.offsetHeight, FW = f.clientWidth, FH = f.clientHeight, M = PS.px(16), O = PS.px(12), x, y, oy = 0;
      var bottomSafe = M + (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sb')) || 0);
      if (p.anchor) {
        var a = p.anchor, cx = (a.left + a.right) / 2;
        x = cx > FW * 2 / 3 ? a.right + O - w : cx < FW / 3 ? a.left - O : cx - w / 2;
        y = a.top - O;
        if (y + hh > FH - bottomSafe) { y = a.bottom + O - hh; oy = 1; }
      } else { x = p.at.x; y = p.at.y; }
      x = Math.max(M, Math.min(FW - w - M, x)); y = Math.max(M, Math.min(FH - hh - bottomSafe, y));
      el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
      if (p.anchor) el.style.transformOrigin = Math.round((p.anchor.left + p.anchor.right) / 2 - x) + 'px ' + Math.round((p.anchor.top + p.anchor.bottom) / 2 - y) + 'px';   /* grows from what was tapped */
    });
    var body = p.icon ? h(R.Fragment, null,
        h('span', { className: 'ps-tip__icon' }, h(PS.Icon, { name: p.icon, size: 20, color: 'inverse' })),
        h('span', { className: 'ps-tip__text' }, p.text),
        h('span', { className: 'ps-tip__x', 'aria-hidden': true }, h(PS.Icon, { name: 'close-thin', size: 12, color: 'brand' })))
      : p.text;
    return h(m.div, Object.assign({ ref: ref, className: PS.cx('ps-tip ps-bubble ps-t-body-md', p.icon && 'ps-tip--icon', p.big && 'ps-tip--big'), role: 'tooltip', style: { left: 0, top: 0, width: p.width ? PS.rem(p.width) : undefined }, onClick: p.onClose },
      { initial: { opacity: 0, scale: 0.96, filter: 'blur(' + PS.MT.BLUR + 'px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: PS.MT.ENTER }, exit: { opacity: 0, scale: 0.98, transition: PS.MT.LEAVE } }), body);
  }
  PS.Tooltip = function Tooltip(p) {
    return h(AP, null, p.open ? h(R.Fragment, { key: 'tip' },
      h('div', { className: 'ps-tip-catch', onClick: p.onClose }), h(TipBody, p)) : null);
  };

  /* TuneButton: opens the prototype's Tune panel (tune.js); nothing when the page has none */
  PS.TuneButton = function TuneButton() {
    if (!window.PSTune) return null;
    return h(m.button, Object.assign({ type: 'button', className: 'ps-tune-btn', onClick: window.PSTune.open }, PS.press()), 'Tune');
  };

  /* Toast: a short message at the top, under the header's bar, like an iPhone notification (owner) · msg (null hides) · top (px, 104)
     It drops in from above on the Smooth spring, coming into focus from the 3 px blur; it leaves upwards on LEAVE. */
  /* Toasts: the app's notices, stacked like iPhone notifications (owner) — every call shows a new one (a repeat is not merged or held back):
     the newest sits on top, the ones before it slip a little lower behind it, smaller and fainter (two show behind at most), each goes
     after its own time, and a swipe to the left closes one at once. items [{ id, text }] (oldest first) · onClose(id) · top (frame px) */
  var STACK = [{ y: 0, s: 1, o: 1 }, { y: 10, s: 0.94, o: 0.55 }, { y: 18, s: 0.88, o: 0.3 }];
  PS.Toasts = function Toasts(p) {
    var items = (p.items || []).slice(-3), n = items.length, MT = PS.MT, b = 'blur(' + MT.BLUR + 'px)', sw = R.useState({}), swiped = sw[0];
    var spring = Object.assign({}, MT.SPRING, { restDelta: 0.01, restSpeed: 0.1 });
    function swipe(id) { sw[1](function (o) { var x = Object.assign({}, o); x[id] = true; return x; }); setTimeout(function () { p.onClose(id, 'swipe'); }, 0); }
    return h('div', { className: 'ps-toasts', style: p.top ? { '--ps-toast-top': PS.y(p.top) } : null },
      h(AP, { initial: false }, items.map(function (t, i) {
        var d = n - 1 - i, k = STACK[Math.min(d, 2)], top = d === 0;
        return h(m.div, { key: t.id, className: 'ps-toast ps-bubble ps-t-body-md', role: 'status', style: { zIndex: 10 - d, pointerEvents: top ? 'auto' : 'none' },
          initial: { opacity: 0, y: -16, scale: 0.97, filter: b },
          animate: { opacity: k.o, y: PS.px(k.y), scale: k.s, x: 0, filter: 'blur(0px)', transition: { default: spring, opacity: d ? { duration: 0.2 } : MT.ENTER, filter: MT.ENTER } },
          exit: swiped[t.id] ? { x: '-110%', opacity: 0, transition: { x: spring, opacity: MT.LEAVE } } : { opacity: 0, y: -10, scale: 0.98, filter: b, transition: MT.LEAVE },
          drag: top ? 'x' : false, dragConstraints: { left: 0, right: 0 }, dragElastic: { left: 0.9, right: 0.08 },
          onDragEnd: function (e, info) { if (info.offset.x < -56 || info.velocity.x < -320) swipe(t.id); } }, t.text);
      })));
  };
  PS.Toast = function Toast(p) {
    var MT = PS.MT, b = 'blur(' + MT.BLUR + 'px)';
    return h(AP, null, p.msg ? h(m.div, { key: p.msg, className: 'ps-toast ps-bubble ps-t-body-md', role: 'status', style: p.top ? { '--ps-toast-top': PS.y(p.top) } : null,
      initial: { opacity: 0, y: -16, scale: 0.97, filter: b }, animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
        transition: { default: Object.assign({}, MT.SPRING, { restDelta: 0.01, restSpeed: 0.1 }), opacity: MT.ENTER, filter: MT.ENTER } },   /* fade on the clock, the drop on the spring */
      exit: { opacity: 0, y: -10, scale: 0.98, filter: b, transition: MT.LEAVE } }, p.msg) : null);
  };
  /* useToast: [msg, show(text, ms)] */
  PS.useToast = function () {
    var s = R.useState(null), t = R.useRef(0);
    var show = R.useCallback(function (text, ms) { clearTimeout(t.current); s[1](text); t.current = setTimeout(function () { s[1](null); }, ms || 2600); }, []);
    return [s[0], show];
  };
})();
