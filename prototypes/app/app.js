/* PeraSure app — the shell of the test environment: one store, a page stack, sheets, and a made-up network.
   Screens register themselves (screens-*.js): APP.screen(name, Component) · APP.sheet(name, { kind, label, render }).
   Navigation: APP.go(name, params) · APP.back() · APP.home(tab) · APP.open(sheet, params) · APP.close().
   Network: APP.useLoad(key) for a page's first data (random time, sometimes slow; Tune → Network makes the first try fail),
   APP.run(fn) for an action (a short wait; the loader shows only when it takes long enough to notice). */
window.APP = (function () {
  'use strict';
  var R = window.React, PS = window.PS, CS = window.CS, h = R.createElement, T = window.PS_TUNE || {};
  var q = new URLSearchParams(location.search);

  /* ---- store ---- */
  var subs = [], uid = 1;
  var S = {
    stack: [{ name: 'opening', key: 'k0', params: {} }], dir: 0, tab: 'home',
    sheet: null, tip: null, toast: null, busy: false, otp: null, submitting: false, intro: false,
    user: T.user || 'approved', loan: T.loan || 'active', seenScam: false, rated: false,
    coupons: CS.coupons(T.coupons == null ? '6' : T.coupons), used: CS.used,
    inbox: null, method: { kind: 'wallet', id: 'gcash', name: 'GCash', last4: '4057' }, order: null, phone: '9171236789'
  };
  function set(patch) { Object.assign(S, typeof patch === 'function' ? patch(S) : patch); subs.slice().forEach(function (f) { f(); }); }
  function use() {
    var f = R.useReducer(function (x) { return x + 1; }, 0)[1];
    R.useEffect(function () { subs.push(f); return function () { subs.splice(subs.indexOf(f), 1); }; }, []);
    return S;
  }

  /* ---- navigation: a stack of pages; the tab pages are one entry ('tabs') ---- */
  function entry(name, params, how) { return { name: name, key: 'k' + uid++, params: params || {}, how: how }; }
  /* go: push a page from the right; how 'rise': it comes up from the bottom like a sheet (and goes back down) */
  function go(name, params, how) { set({ stack: S.stack.concat([entry(name, params, how)]), dir: how === 'rise' ? 2 : 1, tip: null }); }
  function swap(name, params, dir) { set({ stack: S.stack.slice(0, -1).concat([entry(name, params)]), dir: dir == null ? 0 : dir, tip: null }); }
  function back(n) { if (S.stack.length > 1) set({ stack: S.stack.slice(0, -(n || 1)), dir: S.stack[S.stack.length - 1].how === 'rise' ? -2 : -1, tip: null }); }
  function home(tab, dir) { set({ stack: [entry('tabs')], tab: tab || 'home', dir: dir == null ? -1 : dir, tip: null, sheet: null }); }
  function open(name, params) { set({ sheet: { name: name, params: params || {} }, tip: null }); }
  function close() { set({ sheet: null }); }
  var toastT = 0;
  function say(text, ms) { clearTimeout(toastT); set({ toast: text }); toastT = setTimeout(function () { set({ toast: null }); }, ms || 2600); }
  function tipAt(el, text, width) {
    set({ tip: { text: text, anchor: PS.frameRect(el), width: width } });
  }

  /* ---- the made-up network ---- */
  var K = q.get('fast') ? 0 : T.net === 'slow' ? 2.6 : 1, seen = {}, failed = {};   /* ?fast=1: nothing waits (for checking a screen) */
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function latency(key) {
    if (seen[key]) return Math.random() < 0.55 ? 0 : rnd(180, 420) * K;          /* a page seen before is often there at once */
    return (Math.random() < 0.12 ? rnd(1400, 2200) : rnd(350, 1100)) * K;       /* first time: sometimes slow */
  }
  function useLoad(key) {
    var s = R.useState(function () { var ms = latency(key); return { state: ms ? 'loading' : 'ready', ms: ms, n: 0 }; }), st = s[0], setSt = s[1];
    R.useEffect(function () {
      if (st.state !== 'loading') return;
      var t = setTimeout(function () {
        if (T.net === 'error' && !failed[key]) { failed[key] = 1; setSt({ state: 'error', n: st.n }); return; }
        seen[key] = 1; setSt({ state: 'ready', n: st.n });
      }, st.ms);
      return function () { clearTimeout(t); };
    }, [st.state, st.n]);
    return { state: st.state, retry: function () { setSt({ state: 'loading', ms: rnd(500, 1100) * K, n: st.n + 1 }); } };
  }
  /* Loaded: a page's content once its data is in. Until then the Loading page covers the whole screen (the header's buttons stay);
     when it fails, the fallback page ("Something went wrong") does. Content that was waited for rises in piece by piece.
     k (what is loaded) · className (of the box around the content: its children are the pieces) · rise false (the content brings its own entrance) */
  function Loaded(p) {
    var l = useLoad(p.k), err = l.state === 'error', waited = R.useRef(l.state !== 'ready');
    return h(R.Fragment, null,
      h(PS.Cover, { open: l.state !== 'ready', tone: err ? 'white' : 'page' }, h(PS.Crossfade, { k: l.state, className: 'ps-cover__in' }, err
        ? h(PS.EmptyState, { title: 'Something went wrong', className: 'app-fallback' }, h(PS.Button, { onClick: l.retry }, 'Try again'))
        : h(PS.Loader, { fill: true }))),
      l.state === 'ready' ? h(PS.RiseCtx.Provider, { value: !waited.current }, h(PS.Rise, { className: p.className, off: !waited.current || p.rise === false }, p.children)) : null);
  }
  /* run: an action that talks to the server. Resolves after a random wait; the loader covers the page only for the longer ones. */
  function run(fn, o) {
    o = o || {};
    var ms = rnd(o.min || 250, o.max || 1000) * K, show = setTimeout(function () { set({ busy: true }); }, 380);
    setTimeout(function () { clearTimeout(show); if (S.busy) set({ busy: false }); fn(); }, ms);
  }

  /* ---- registries ---- */
  var screens = {}, sheets = {};
  function screen(name, C) { screens[name] = C; }
  function sheet(name, def) { sheets[name] = def; }

  /* ---- root ---- */
  function SheetHost(p) {
    var cur = S.sheet && sheets[S.sheet.name], on = !!cur && (cur.kind || 'plain') === p.kind, last = R.useRef(null);
    if (on) last.current = S.sheet;
    var keep = last.current, def = keep && sheets[keep.name];
    return h(PS.Sheet, { open: on, kind: p.kind, label: def ? def.label : '', onClose: close, className: def && def.className },
      on ? h(def.render, { key: keep.name, params: keep.params }) : null);
  }
  function Root() {
    use();
    var top = S.stack[S.stack.length - 1], C = screens[top.name] || screens.missing;
    return h(PS.Shell, null,
      h(PS.Pages, { id: top.key, dir: S.dir }, h(C, { params: top.params })),
      h(SheetHost, { kind: 'page' }), h(SheetHost, { kind: 'plain' }), h(SheetHost, { kind: 'card' }),
      h(PS.OtpSheet, { open: !!S.otp, phone: maskPhone(S.phone), outcome: T.otp || 'ok', auto: q.get('auto') !== '0', onClose: function () { set({ otp: null }); },
        onChange: function () { set({ otp: null }); go('phone-old'); },
        onVerified: function () { var cb = S.otp && S.otp.then; set({ otp: null }); if (cb) cb(); } }),
      h(PS.Overlay, { open: S.submitting }, S.submitting ? h(PS.OrderSubmit, { onDone: function () { var cb = S.submitting.then; set({ submitting: false }); if (cb) cb(); } }) : null),
      S.intro ? h(PS.CreditLimitIntro, { data: { old: CS.credit.total - CS.credit.temporary, new: CS.credit.total, inc: CS.credit.temporary, exp: '2026-11-20' }, onDone: function () { set({ intro: false }); } }) : null,
      h(PS.Overlay, { open: S.busy, tone: 'glass' }, h(PS.Loader)),
      h(PS.Tooltip, { open: !!S.tip, anchor: S.tip ? S.tip.anchor : null, width: S.tip ? S.tip.width : null, text: S.tip ? S.tip.text : '', onClose: function () { set({ tip: null }); } }),
      h(PS.Toast, { msg: S.toast, bottom: top.name === 'tabs' ? 112 : 124 }));
  }
  function maskPhone(p) { return '0' + p.slice(0, 2) + '****' + p.slice(-4); }

  /* ---- small helpers shared by the screens ---- */
  var tune = function () { return h(PS.TuneButton, { key: 'tune' }); };
  /* Page: a secondary page with a back button and a title; `load` (a key) shows the loader first */
  function Page(p) {
    var top = Object.assign({ left: h(PS.Back, { onClick: p.onBack || function () { back(); } }), title: p.title, right: p.right === undefined ? tune() : p.right }, p.top);
    return h(PS.Screen, { top: top, bottom: p.bottom, tint: p.tint, colTop: p.colTop, colBottom: p.colBottom == null ? (p.bottom ? 140 : 48) : p.colBottom, className: p.className, scrollRef: p.scrollRef },
      p.load ? h(Loaded, { k: p.load, className: 'app-col' }, p.children) : p.children);
  }
  /* Head: a page's own big title + one line under it (24 / 32 and 14 / 20, inset 8 from the column) */
  function Head(p) {
    return h('div', { className: PS.cx('app-head', p.center && 'app-head--center') }, h('h1', { className: 'ps-t-title-lg' }, p.title), p.body ? h('p', { className: 'ps-t-body-md ps-c-secondary' }, p.body) : null);
  }
  function signedIn() { return S.user !== 'guest'; }
  function support() { go('support'); }

  return { S: S, T: T, q: q, set: set, use: use, go: go, swap: swap, back: back, home: home, open: open, close: close, say: say, tipAt: tipAt,
    useLoad: useLoad, Loaded: Loaded, run: run, rnd: rnd, screen: screen, sheet: sheet, screens: screens, tune: tune, Page: Page, Head: Head, signedIn: signedIn, support: support, maskPhone: maskPhone,
    auto: q.get('auto') !== '0',   /* ?auto=0: nothing is typed or moved on for you (for checking a screen) */
    start: function () { PS.mount(Root); } };
})();
