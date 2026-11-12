/* PeraSure UI — feedback: loaders, status boxes, notices and result pages. Needs core.js (PS.Lottie, PS.Anim).
   Loader = the "Loading page" demo (coin + dots), Coin = Coins loading (loop → success), as shared components. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP;
  var COINS = PS.root + 'animations/coins-loading/';

  /* Coin: the PeraSure coin · state loading (spins) | success (finishes the turn, lands on the tick, once) · onDone
     size: how big the coin is drawn (50) · inset: how much of it hangs outside its box on each side (the Loading page: 7 on a 50 px coin) */
  PS.Coin = function Coin(p) {
    var size = p.size || 50, inset = p.inset || 0, box = size - inset * 2, ok = p.state === 'success', s = R.useState(false), swapped = s[0], setSwapped = s[1], api = R.useRef(null);
    R.useEffect(function () {
      if (!ok) { setSwapped(false); return; }
      if (PS.reduce || !api.current) { setSwapped(true); return; }
      var a = api.current, off = function () { try { a.removeEventListener('loopComplete', done); } catch (e) {} }, done = function () { off(); setSwapped(true); };
      a.addEventListener('loopComplete', done);                       /* the loop finishes its turn before the success part starts — no deadline (Order submit) */
      var start = a.playCount || 0, t = setInterval(function () { if (!a.isLoaded || (a.playCount || 0) > start) done(); }, 120);   /* a turn's end the event missed */
      return function () { clearInterval(t); off(); };   /* the item may already be destroyed */
    }, [ok]);
    var st = { width: PS.rem(size), height: PS.rem(size), margin: PS.rem(-inset) };
    return h('span', { className: 'ps-coin', style: { width: PS.rem(box), height: PS.rem(box) } },
      swapped ? h(PS.Lottie, { key: 's', src: COINS + 'success-coin.json', width: size, once: true, onDone: p.onDone, style: st })
              : h(PS.Lottie, { key: 'l', src: COINS + 'loading-coin.json', width: size, api: api, style: st }));
  };
  /* Dots: the three loading dots (Loading page: 84 × 22) · width */
  PS.Dots = function Dots(p) {
    var w = p.width || 84;
    return h(PS.Lottie, { src: PS.asset('lottie/loading-dots.json'), width: w, height: Math.round(w * 22 / 84), viewBox: '50 130 425 180', className: 'ps-dots' });
  };
  /* Loader: the Loading page's coin + dots, drawn larger than there (owner: 50 px read too small in the app): a 72 px coin, the same as Order submit's
     (its picture hangs 10 px outside its box, as 7 does at 50), dots 128 × 34, 16 px apart (owner: larger), centred in its box · label (optional line under it)
     fill: a whole screen that is loading — the coin and the dots sit in the very middle of the screen (owner) */
  PS.Loader = function Loader(p) {
    return h('div', { className: PS.cx('ps-loader', p.fill && 'ps-loader--fill', p.className), style: p.style, role: 'status', 'aria-label': p.label || 'Loading' },
      h(PS.Coin, { size: 72, inset: 10 }), h(PS.Dots, { width: 128 }), p.label ? h('p', { className: 'ps-t-body-md ps-c-tertiary' }, p.label) : null);
  };
  /* Busy: the small three-dot pulse inside a button that is waiting */
  PS.Busy = function Busy() { return h('span', { className: 'ps-busy', role: 'status', 'aria-label': 'Loading' }, h('i'), h('i'), h('i')); };

  /* StatusBox: an inline message box · tone negative | info | neutral · title · children (text) · icon · action (node, right) */
  PS.StatusBox = function StatusBox(p) {
    var tone = p.tone || 'negative';
    return h('div', { className: PS.cx('ps-status', 'ps-status--' + tone, p.className), role: tone === 'negative' ? 'alert' : 'note' },
      p.icon === false ? null : h(PS.Icon, { name: p.icon || 'alert-circle', size: 16 }),
      h('div', { className: 'ps-status__text' }, p.title ? h('p', { className: 'ps-t-label-sm' }, p.title) : null,
        p.children ? h('p', { className: 'ps-t-caption-sm' }, p.children) : null),
      p.action || null);
  };
  /* Notice: the white strip under a card (home: "All PeraSure transactions happen in the app…") · icon · children · onClick */
  PS.Notice = function Notice(p) {
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-notice', p.className), onClick: p.onClick }, PS.press()),
      h(PS.Icon, { name: p.icon || 'info', size: 16, color: 'tertiary' }), h('span', { className: 'ps-t-caption-sm' }, p.children),
      h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }));
  };
  /* Result: a whole-page message — picture, title, text, buttons (fallback, success, sign-in prompts)
     anim (PS.Anim name) | art (png in assets/art) · size (100) · title · body · children (buttons) */
  PS.Result = function Result(p) {
    return h('div', { className: PS.cx('ps-result', p.className), style: p.style },
      p.anim ? h(PS.Anim, { name: p.anim, size: p.size || 100 }) : p.art ? h(PS.Art, { name: p.art, ext: 'png', size: p.size || 100 }) : null,
      h('div', { className: 'ps-result__text' }, h('p', { className: 'ps-t-title-md' }, p.title),
        p.body ? h('p', { className: 'ps-t-body-md ps-c-tertiary' }, p.body) : null),
      p.children ? h('div', { className: 'ps-result__acts' }, p.children) : null);
  };
  /* Overlay: a full-screen layer over the page (loaders, order submit) that fades on ENTER / LEAVE · open · children · tone page | glass */
  PS.Overlay = function Overlay(p) {
    return h(AP, null, p.open ? h(m.div, { key: 'o', className: PS.cx('ps-overlay', p.tone === 'glass' && 'ps-overlay--glass'),
      initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: PS.MT.LEAVE } }, p.children) : null);
  };
})();
