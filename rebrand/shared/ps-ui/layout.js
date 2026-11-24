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

  /* Bands: a bar's token veil (no progressive blur since tokens v2026.11.17 — owner) · pos top | bot
     secondary: Gradient/Bottom-secondary-nav-filled (a secondary page, the amount entry, the order page); else the page decides (ps-ui.css) */
  PS.Bands = function Bands(p) {
    return h('div', { className: PS.cx('ps-pb', 'ps-pb--' + (p.pos || 'top'), p.secondary && 'ps-pb--secondary'), 'aria-hidden': true },
      h('i', { className: 'ps-veil' }));
  };

  /* TopBar: left (node) · title (text) · right (node) · search (node: fills the row, right after it) · extra (node under the 116 px bar, e.g. tabs) + extraHeight · solid (page colour, no blur) · live */
  PS.TopBar = function TopBar(p) {
    var hgt = 116 + (p.extraHeight || 0);
    return h('header', { className: PS.cx('ps-top', p.solid && 'ps-top--solid', p.live && 'is-live'), style: { '--ps-top-h': PS.y(hgt) } },
      h(PS.Bands, { pos: 'top' }),
      p.search ? h('div', { className: 'ps-top__row ps-top__row--search' }, p.search, p.right) :   /* spec TopBar · Search: the search fills the row, close at the end */
      h('div', { className: 'ps-top__row' },
        h('div', { className: 'ps-top__side' }, p.left),
        p.title ? h('p', { className: 'ps-top__title ps-text-label-md' }, p.title) : null,
        h('div', { className: 'ps-top__side ps-top__side--end' }, p.right)),
      p.extra ? h('div', { className: 'ps-top__extra' }, p.extra) : null);
  };

  /* BottomBar: the bottom action area (primary button, links) · secondary: Gradient/Bottom-secondary-nav-filled (on a secondary page it
     is that already; pass it on the amount entry and the order page, which are not secondary pages but take the secondary bottom — owner)
     note: a small line over the button (DS 5561:7317) · consent: an agreement line (PS.Consent) over a slightly narrower button (Login) */
  PS.BottomBar = function BottomBar(p) {
    return h('div', { className: PS.cx('ps-bot', p.note && 'ps-bot--note', p.consent && 'ps-bot--consent', p.className) }, h(PS.Bands, { pos: 'bot', secondary: p.secondary }),
      p.note ? h('p', { className: 'ps-bot__note ps-text-body-xs ps-c-placeholder' }, p.note) : null, p.children);
  };

  /* Navigator: the tab bar · tabs [{ id, label, icon }] · value · onChange(id). The pill glides between tabs. */
  PS.Navigator = function Navigator(p) {
    return h('nav', { className: 'ps-nav', 'aria-label': 'Main' }, h(PS.Bands, { pos: 'bot' }),
      h('div', { className: 'ps-nav__bar' }, p.tabs.map(function (t) {
        var on = t.id === p.value;
        return h(m.button, Object.assign({ key: t.id, type: 'button', className: PS.cx('ps-nav__tab', on && 'is-on'), 'aria-current': on ? 'page' : undefined,
          onClick: function () { if (!on && p.onChange) p.onChange(t.id); } }, PS.press()),
          on ? h(m.span, { layoutId: (p.id || 'ps-nav') + '-pill', className: 'ps-nav__pill', transition: PS.MT.SPRING }, h('i')) : null,
          h(PS.Icon, { name: t.icon, size: 18 }), h('span', null, t.label));   /* phase 1: legacy icon 18, label 10 / 16; active brand (colour) */
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
     onClose · label (aria) · scrim (default: card / plain; the navy gradient --gradient-scrim) · children. Slides on the Smooth spring; the scrim fades in 0.2 s and
     out on LEAVE. Drag the top edge down to close. While it closes it no longer blocks the page. */
  function SheetBody(p) {
    var kind = p.kind || 'plain', controls = M.useDragControls(), scrim = p.scrim != null ? p.scrim : true, present = M.useIsPresent(), box = R.useRef(null);   /* BRIEF 19: every sheet on the scrim, page sheets too */
    R.useLayoutEffect(function () { PS.rise(box.current, { skip: 2, delay: 110, y: PS.MT.Y.text }); }, []);   /* what is in the sheet rises in piece by piece while it slides up */
    R.useEffect(function () { return PS.sheetHead(box.current); }, []);
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
  /* sheetHead(root): BRIEF 19 — a sheet's fixed header (handle + search / title + close) sits 12 above the content (--ps-head-h + gap md) and casts
     Elevation/1 downward as the content scrolls under it: --ps-head-sh = min(scrollTop / 32, 1), written from the scroll event (no React state).
     Works for the page sheet's head / body and the SearchSheet's; returns the clean-up. */
  PS.sheetHead = function sheetHead(root) {
    if (!root) return function () {};
    var offs = [];
    function wire() {
      [['.ps-sheet__head', '.ps-sheet__body'], ['.ps-ssheet__head', '.ps-ssheet__body']].forEach(function (pq) {
        var hd = root.querySelector(pq[0]), bd = root.querySelector(pq[1]);
        if (!hd || !bd || bd.__psHead) return;
        bd.__psHead = true;
        function size() { bd.style.setProperty('--ps-head-h', hd.offsetHeight + 'px'); }
        function sc() { hd.style.setProperty('--ps-head-sh', Math.min(bd.scrollTop / PS.px(32), 1).toFixed(3)); }
        size(); sc(); bd.addEventListener('scroll', sc, { passive: true });
        var ro = window.ResizeObserver ? new ResizeObserver(size) : null; if (ro) ro.observe(hd);
        offs.push(function () { bd.removeEventListener('scroll', sc); if (ro) ro.disconnect(); bd.__psHead = false; });
      });
    }
    wire();
    var mo = new MutationObserver(wire); mo.observe(root, { childList: true, subtree: true });   /* bodies that mount later (crossfades) */
    return function () { mo.disconnect(); offs.forEach(function (f) { f(); }); };
  };
  PS.Sheet = function Sheet(p) { return h(AP, null, p.open ? h(SheetBody, Object.assign({ key: 'sheet' }, p)) : null); };
  /* SheetTitle: title + close button row of a plain sheet */
  PS.SheetTitle = function SheetTitle(p) {
    return h('div', { className: 'ps-sheet__titlebar' }, h('p', { className: 'ps-text-title-sm' }, p.children), h(PS.Close, { onClick: p.onClose }));
  };
  /* SheetHead: a card or plain sheet's title row with the close button in the 40 px corner (Figma payment detail · DS 5908:11000)
     title · type (the title's text style, 'ps-text-title-sm') · align center | left · bottom (the title at the bottom of the 40 px row)
     icon + iconColor (a 16 px mark before the title) · onClose · children (in place of title: e.g. a PS.Swap) */
  PS.SheetHead = function SheetHead(p) {
    return h('div', { className: PS.cx('ps-shead', p.align === 'left' && 'ps-shead--left', p.bottom && 'ps-shead--bottom', p.className) },
      p.title != null ? h('p', { className: PS.cx(p.type || 'ps-text-title-sm', p.icon && 'ps-shead__title') }, p.icon ? h(PS.Icon, { name: p.icon, size: 16, color: p.iconColor }) : null, p.title) : p.children,
      p.onClose ? h(PS.Close, { onClick: p.onClose }) : null);
  };
  /* ButtonRow: two buttons side by side, 10 apart (no token), as wide as each other; large text wraps inside them instead of running out */
  PS.ButtonRow = function ButtonRow(p) { return h('div', { className: PS.cx('ps-btnrow', p.className) }, p.children); };
  /* Confirm: a card sheet that asks before something happens (log out, delete the account) — title + close, the text, Cancel and the action.
     Put the sheet in className 'ps-confirm' (24 between the text and the buttons). title · body · cancel (label; none: one button) · ok · onOk
     · onClose (also what Cancel does, unless onCancel) */
  PS.Confirm = function Confirm(p) {
    return h(R.Fragment, null, h('div', { className: 'ps-confirm__text' }, h(PS.SheetHead, { align: 'left', title: p.title, onClose: p.onClose }), h('p', { className: 'ps-text-body-md' }, p.body)),
      h(PS.ButtonRow, null, p.cancel ? h(PS.Button, { variant: 'neutral', size: 'md', onClick: p.onCancel || p.onClose }, p.cancel) : null,   /* BRIEF 24: Neutral beside the primary */ h(PS.Button, { size: 'md', onClick: p.onOk }, p.ok)));
  };

  /* Tooltip (spec rebrand/spec/Tooltip.md, Figma 10991:475): a dark explainer bubble (Ink, white text — never white, decision 6), 250 wide,
     an arrow on the edge that points at what was tapped · type simple | rich (title + text) · text · title · icon (leading, 20, accent) ·
     close (shows the ×; default: when there is an icon) · onClose (any tap closes it) · open.
     arrow top-start | top | top-end | bottom-start | bottom | bottom-end | left | right | none — set for a fixed bubble (gallery: inline);
     in the app the bubble places itself from anchor { left, top, right, bottom } (frame px, PS.frameRect(el)): under what was tapped with the
     arrow at its centre, or over it (arrow at the bottom) when there is no room below; always inside the 16 px screen margins.
     Kept from the old demo (not in the spec): width (px, the penalty explainer is 288), big (= rich padding without a title), at { x, y }
     (older calls: a top-left corner, no arrow). Grows from the arrow on ENTER, goes on LEAVE. */
  var TIP_ARROW = 6, TIP_IN = 16;
  function tipSide(a) { return !a || a === 'none' ? 'none' : a.split('-')[0]; }
  function TipBody(p) {
    var ref = R.useRef(null), arrowRef = R.useRef(null), placed = p.anchor && !p.inline;
    var st = R.useState(placed ? 'top' : tipSide(p.arrow || 'top-start')), side = st[0], setSide = st[1];
    R.useLayoutEffect(function () {
      if (p.inline) return;
      var el = ref.current, f = el && el.offsetParent; if (!el || !f) return;
      var w = el.offsetWidth, hh = el.offsetHeight, FW = f.clientWidth, FH = f.clientHeight, M = PS.px(16), G = PS.px(4), x, y, sd = 'none', ax = 0;
      var bottomSafe = M + (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sb')) || 0);
      if (p.anchor) {
        var a = p.anchor, cx = (a.left + a.right) / 2;
        x = Math.max(M, Math.min(FW - w - M, cx - w / 2));
        y = a.bottom + G; sd = 'top';
        if (y + hh > FH - bottomSafe) { y = a.top - G - hh; sd = 'bottom'; }
        ax = Math.max(PS.px(TIP_IN), Math.min(w - PS.px(TIP_IN) - PS.px(2 * TIP_ARROW), cx - x - PS.px(TIP_ARROW)));
      } else { x = Math.max(M, Math.min(FW - w - M, p.at.x)); y = Math.max(M, Math.min(FH - hh - bottomSafe, p.at.y)); }
      el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
      if (sd !== side) setSide(sd);
      if (arrowRef.current) arrowRef.current.style.left = Math.round(ax) + 'px';
      if (p.anchor) el.style.transformOrigin = Math.round(ax + PS.px(TIP_ARROW)) + 'px ' + (sd === 'top' ? '0px' : hh + 'px');
    });
    var rich = p.type === 'rich' || !!p.title || p.big, showX = p.close != null ? !!p.close : !!p.icon, light = p.tone === 'light';
    var pos = p.arrow ? p.arrow.split('-')[1] || 'center' : 'start';
    var arrow = side === 'none' ? null : h('span', { ref: arrowRef, className: PS.cx('ps-tip__arrow', 'ps-tip__arrow--' + (placed ? 'free' : pos)), 'aria-hidden': true });
    var bubble = h('div', { className: PS.cx('ps-tip__bubble', rich && 'ps-tip__bubble--rich') },
      p.icon ? h(PS.Icon, { name: p.icon, size: 20, color: light ? 'primary' : 'inverse', className: 'ps-tip__icon' }) : null,   /* BRIEF 21: the icon takes the text colour */
      h('div', { className: 'ps-tip__body' },
        p.title ? h('p', { className: 'ps-tip__title ps-text-label-md' }, p.title) : null,
        h('div', { className: 'ps-tip__text ps-text-body-md' }, p.text)),
      showX ? h('span', { className: 'ps-tip__x', 'aria-hidden': true }, h(PS.Icon, { name: 'close-thin', size: 16, color: light ? 'tertiary' : 'placeholder' })) : null);   /* the close stays muted */
    return h(m.div, Object.assign({ ref: ref, className: PS.cx('ps-tip', 'ps-tip--' + side, light && 'ps-tip--light', p.inline && 'ps-tip--inline'), role: 'tooltip',
        style: p.inline ? { width: p.width ? PS.rem(p.width) : undefined } : { left: 0, top: 0, width: p.width ? PS.rem(p.width) : undefined }, onClick: p.onClose },
      p.inline ? null : { initial: { opacity: 0, scale: 0.96, filter: 'blur(' + PS.MT.BLUR + 'px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: PS.MT.ENTER }, exit: { opacity: 0, scale: 0.98, transition: PS.MT.LEAVE } }),
      side === 'top' || side === 'left' ? arrow : null, bubble, side === 'bottom' || side === 'right' ? arrow : null);
  }
  /* tipTone(el): BRIEF 21 — 'light' when the element sits on a dark surface (the first filled background behind it is dark: navy cards), else 'dark' */
  PS.tipTone = function tipTone(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var m2 = getComputedStyle(e).backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
      if (!m2 || (m2[4] != null && +m2[4] < 0.5)) continue;
      return (0.2126 * m2[1] + 0.7152 * m2[2] + 0.0722 * m2[3]) / 255 < 0.35 ? 'light' : 'dark';
    }
    return 'dark';
  };
  /* Tooltip · tone dark (default: on light backgrounds) | light (white bubble, Elevation/3, primary text: on navy surfaces — BRIEF 21) */
  PS.Tooltip = function Tooltip(p) {
    if (p.inline) return h(TipBody, p);   /* gallery / a fixed bubble: no catcher, no motion */
    return h(AP, null, p.open ? h(R.Fragment, { key: 'tip' },
      h('div', { className: 'ps-tip-catch', onClick: p.onClose }), h(TipBody, p)) : null);
  };

  /* TuneButton: opens the prototype's Tune panel (tune.js); nothing when the page has none */
  PS.TuneButton = function TuneButton() {
    if (!window.PSTune) return null;
    return h(m.button, Object.assign({ type: 'button', className: 'ps-tune-btn', onClick: window.PSTune.open }, PS.press()), 'Tune');
  };

  /* Toast (spec rebrand/spec/Toast.md, Figma 10991:524): a short dark notice under the header bar, like an iPhone notification (owner)
     · status success | error | info | neutral (icon before the text; none for neutral) · text · action { label, onClick } (green on Ink)
     · close (shows the ×) · onClose. role=status: read out, never takes focus. The app shows it for 3–5 s (APP.say).
     ToastBody draws one; PS.Toasts stacks them; PS.Toast shows one (older calls: msg). */
  function ToastIcon(p) {
    if (p.status === 'success') return h('span', { className: 'ps-toast__ok', 'aria-hidden': true }, h(PS.Icon, { name: 'check', size: 12, color: 'on-action' }));
    if (p.status === 'error') return h(PS.Icon, { name: 'alert-circle', size: 20, color: 'var(--content-negative-subtle)', className: 'ps-toast__icon' });
    if (p.status === 'info') return h(PS.Icon, { name: 'info', size: 20, color: 'inverse', className: 'ps-toast__icon' });
    return null;
  }
  function ToastBody(t, onClose) {
    return [h(ToastIcon, { key: 'i', status: t.status }),
      h('p', { key: 't', className: 'ps-toast__text ps-text-body-md' }, t.text),
      t.action ? h('button', { key: 'a', type: 'button', className: 'ps-toast__act ps-text-label-md', onClick: function () { if (t.action.onClick) t.action.onClick(); if (onClose) onClose('action'); } }, t.action.label) : null,
      t.close ? h('button', { key: 'x', type: 'button', className: 'ps-toast__x', 'aria-label': 'Close', onClick: function () { if (onClose) onClose('close'); } }, h(PS.Icon, { name: 'close-thin', size: 16, color: 'placeholder' })) : null];
  }
  PS.ToastCard = function ToastCard(p) { return h('div', { className: 'ps-toast ps-toast--static', role: 'status' }, ToastBody(p, p.onClose)); };   /* one toast, in place (gallery) */
  /* Toasts: the app's notices, stacked like iPhone notifications (owner) — every call shows a new one (a repeat is not merged or held back):
     the newest sits on top, the ones before it slip a little lower behind it, smaller and fainter (two show behind at most), each goes
     after its own time, and a swipe to the left closes one at once. items [{ id, text, status, action, close }] (oldest first) · onClose(id) · top */
  var STACK = [{ y: 0, s: 1, o: 1 }, { y: 10, s: 0.94, o: 0.55 }, { y: 18, s: 0.88, o: 0.3 }];
  PS.Toasts = function Toasts(p) {
    var items = (p.items || []).slice(-3), n = items.length, MT = PS.MT, b = 'blur(' + MT.BLUR + 'px)', sw = R.useState({}), swiped = sw[0];
    var spring = Object.assign({}, MT.SPRING, { restDelta: 0.01, restSpeed: 0.1 });
    function swipe(id) { sw[1](function (o) { var x = Object.assign({}, o); x[id] = true; return x; }); setTimeout(function () { p.onClose(id, 'swipe'); }, 0); }
    return h('div', { className: 'ps-toasts', style: p.top ? { '--ps-toast-top': PS.y(p.top) } : null },
      h(AP, { initial: false }, items.map(function (t, i) {
        var d = n - 1 - i, k = STACK[Math.min(d, 2)], top = d === 0;
        return h(m.div, { key: t.id, className: 'ps-toast', role: 'status', style: { zIndex: 10 - d, pointerEvents: top ? 'auto' : 'none' },
          initial: { opacity: 0, y: -16, scale: 0.97, filter: b },
          animate: { opacity: k.o, y: PS.px(k.y), scale: k.s, x: 0, filter: 'blur(0px)', transition: { default: spring, opacity: d ? { duration: 0.2 } : MT.ENTER, filter: MT.ENTER } },
          exit: swiped[t.id] ? { x: '-110%', opacity: 0, transition: { x: spring, opacity: MT.LEAVE } } : { opacity: 0, y: -10, scale: 0.98, filter: b, transition: MT.LEAVE },
          drag: top ? 'x' : false, dragConstraints: { left: 0, right: 0 }, dragElastic: { left: 0.9, right: 0.08 },
          onDragEnd: function (e, info) { if (info.offset.x < -56 || info.velocity.x < -320) swipe(t.id); } },
          ToastBody(t, function (why) { p.onClose(t.id, why); }));
      })));
  };
  PS.Toast = function Toast(p) {
    var MT = PS.MT, b = 'blur(' + MT.BLUR + 'px)', text = p.msg != null ? p.msg : p.text;
    return h(AP, null, text ? h(m.div, { key: text, className: 'ps-toast', role: 'status', style: p.top ? { '--ps-toast-top': PS.y(p.top) } : null,
      initial: { opacity: 0, y: -16, scale: 0.97, filter: b }, animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
        transition: { default: Object.assign({}, MT.SPRING, { restDelta: 0.01, restSpeed: 0.1 }), opacity: MT.ENTER, filter: MT.ENTER } },   /* fade on the clock, the drop on the spring */
      exit: { opacity: 0, y: -10, scale: 0.98, filter: b, transition: MT.LEAVE } }, ToastBody({ text: text, status: p.status, action: p.action, close: p.close }, p.onClose)) : null);
  };
  /* useToast: [msg, show(text, ms)] */
  PS.useToast = function () {
    var s = R.useState(null), t = R.useRef(0);
    var show = R.useCallback(function (text, ms) { clearTimeout(t.current); s[1](text); t.current = setTimeout(function () { s[1](null); }, Math.max(3000, Math.min(5000, ms || 4000))); }, []);   /* 3–5 s (spec) */
    return [s[0], show];
  };
})();
