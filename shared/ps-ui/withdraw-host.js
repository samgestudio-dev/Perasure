/* PeraSure UI — the Withdraw demo's loan screen, run from the demo's own code.
   Owner's rule: an animation that exists is never re-imagined. So this file does not copy or re-write the Withdraw fund flow
   (prototypes/withdraw-fund-flow): it loads that page's code as it ships (withdraw.js + motion-tokens.js) and mounts its loan screen —
   the screen that slides up from the bottom, the amount entry, and the morph into the order card when a term is picked (the
   travelling amount, the card, the chips, the keypad leaving, the confirm blocks and the Confirm bar), all the demo's functions and
   numbers. A change to the demo's motion therefore shows up here by itself.

   What a host page may set (everything else is the demo's):
     PS.loadWithdraw()            → Promise of the sheet component (class)
     <Sheet ref scale initialAmount host={{ max, blocks, onState, onConfirm, onNudge }} />      (render it from a memo'd parent: see opt())
            host.blocks(sheet) → [nodes]   the confirm blocks (default: the demo's own) — they enter exactly as the demo's blocks do
            host.onState(next, prev, sheet) · host.onConfirm(sheet) · host.onNudge(sheet) (Confirm tapped before the agreement is ticked)
     sheet.open()  · sheet.close()  · sheet.state { screen 'home' | 'loan', phase 'enter' | 'confirm', amt (hundreds, as text), term, agree }
   scale: the demo is drawn 360 wide; on a wider frame the host scales it (and tells the sheet, so its heights still fit the screen).
   max: the most that can be borrowed, in pesos (the demo's own 50,000 when not set) — the keypad, the slider and the caption follow it.
   Needs core.js; the page must not set window.__resources itself. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement;
  var klass = null, loading = null;
  function url(p) { return new URL(PS.root + 'prototypes/withdraw-fund-flow/' + p, document.baseURI).href; }

  /* the demo's limits are written into its code as numbers (₱500–₱50,000); these four spots read the host's limit instead. Motion code is not touched. */
  var PATCHES = [
    ["if (parseInt(n || '0', 10) > 500) n = '500';", "if (parseInt(n || '0', 10) > this.maxH()) n = String(this.maxH());"],
    ["(500 + p * 49500) / 100", "(500 + p * (this.maxH() * 100 - 500)) / 100"],
    ["(this.amount() - 500) / 49500", "(this.amount() - 500) / (this.maxH() * 100 - 500)"],
    ["this.sp('₱50,000', {", "this.sp(this.money(this.maxH() * 100, 0), {"],
    ["}, 'Flexible amounts from ₱500–₱50,000');", "}, 'Flexible amounts from ₱500–' + this.money(this.maxH() * 100, 0));"]
  ];
  function patch(src) {
    PATCHES.forEach(function (p) {
      if (src.split(p[0]).length !== 2) { console.warn('[withdraw-host] the demo changed: could not find', p[0]); return; }
      src = src.replace(p[0], p[1]);
    });
    return src;
  }

  /* DCLogic: the base class the demo's code expects from the Claude Design runtime — state is merged at once (the demo relies on that,
     and also assigns this.state itself for its partial re-rendering), then the component is drawn again. React must never put an older
     state back when a parent re-renders, so `state` is kept here and React's own assignments of the object it knows are ignored. */
  class DCLogic extends R.Component {
    get state() { return this._st; }
    set state(v) { if (this._st === undefined) { this._st = v; this._known = v; } else if (v !== this._known) this._st = v; }
    setState(update, cb) {
      var patch = typeof update === 'function' ? update(this._st) : update;
      if (patch) this._st = Object.assign({}, this._st, patch);
      this.forceUpdate(cb);
    }
  }

  function make(Base) {
    return class WithdrawSheet extends Base {
      scale() { return this.props.scale || 1; }
      /* the demo reads the screen from phone-fit's globals (design px); on a scaled frame the same numbers, in its own px */
      ex() { var p = (window.__PS_PH || 740) / this.scale(); return p > 740 ? Math.round(p - 740) : 0; }
      df() { var p = (window.__PS_PH || 740) / this.scale(); return p < 740 ? Math.min(100, Math.round(740 - p)) : 0; }
      sb() { return Math.max(0, Math.round((window.__PS_SB || 0) / this.scale())); }
      ee() { return Math.max(0, Math.round((window.__PS_E || 0) / this.scale())); }
      /* host: one object that stays the same while its fields change (max, blocks, onState, onConfirm, onNudge). The sheet must not be
         re-rendered from outside — the demo keeps part of its state out of React's queue, and a re-render from a parent would put the
         old state back — so what changes is read from here when a slot draws, never passed as new props. */
      opt(name) { var hst = this.props.host; return hst && hst[name] != null ? hst[name] : this.props[name]; }
      maxH() { return Math.max(5, Math.round((this.opt('max') || 50000) / 100)); }
      /* open: what the demo's Withdraw pill does (hero(), "tap") */
      open() {
        if (this._mpStep) { cancelAnimationFrame(this._mpStep); this._mpStep = null; }
        if (this._mpAnim) { this._mpAnim.stop(); this._mpAnim = null; }
        this.flipEnd(); this._lk = 0;
        this._padQuick = false;
        this._born = {}; this._freshSheet = true;
        this._mp = 0; if (this._mpMV) this._mpMV.jump(0);
        this.setState({ screen: 'loan', phase: 'enter', term: null, pillOpen: false, morph: false, agree: false });
      }
      close() { this.setState({ screen: 'home' }); }
      ready() { return !!(this.state.fm && this.state.MT); }
      setState(update, cb) {
        var prev = this.state, patch = typeof update === 'function' ? update(prev) : update;
        super.setState(patch, cb);
        var on = this.opt('onState'); if (patch && on) on(Object.assign({}, prev, patch), prev, this);
      }
      /* the host's blocks changed for a reason the sheet doesn't know (a coupon was picked): draw them again */
      refresh() { var S = this._subs || {}; ['amount', 'blocks'].forEach(function (ch) { if (S[ch]) S[ch].forEach(function (x) { x.forceUpdate(); }); }); }
      confirmTap() {
        if (!this.state.agree) return super.confirmTap();
        var on = this.opt('onConfirm'); if (on) on(this);
      }
      nudgeAgree() { var on = this.opt('onNudge'); if (on) on(this); else super.nudgeAgree(); }
      /* the confirm blocks: the host's content, in the demo's wrapper (same place, same entrance: each block on MT.REVEAL(i)) */
      confirmBlocks() {
        var make = this.opt('blocks'); if (!make) return super.confirmBlocks();
        var MT = this.mt(), self = this, blocks = make(this).filter(Boolean);
        return this.el('div', {
          key: 'blocks', ref: this._blocksRef || (this._blocksRef = function (n) { self.watchBlocks(n); }),
          initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: MT.LEAVE },
          style: { position: 'absolute', left: 16, right: 16, top: 382, zIndex: 1, display: 'flex', flexDirection: 'column', gap: 20 }
        }, blocks.map(function (b, i) {
          var RV = MT.REVEAL(i);
          return self.el('div', { key: 'b' + i, initial: RV.initial, animate: { opacity: 1, y: 0, scale: 1, transition: RV.transition }, style: {} }, b);
        }));
      }
      /* the demo's order page has a fixed length (made for its own blocks); with the host's blocks the page is as long as they need:
         the last block ends 24 px above the Confirm bar (108) */
      watchBlocks(n) {
        var self = this;
        if (this._ro) { this._ro.disconnect(); this._ro = null; }
        this._hostBlocks = n;
        if (!n) return;
        if (window.ResizeObserver) { this._ro = new ResizeObserver(function () { self.fitBlocks(); }); this._ro.observe(n); }
        this.fitBlocks();
      }
      fitBlocks() {
        var b = this._hostBlocks; if (!b || !b.parentNode) return;
        var need = 382 + b.offsetHeight + 24 + 108 + this.sb(), min = 740 + this.ex() - this.df() + this.sb(), hgt = Math.max(need, min) + 'px';
        if (b.parentNode.style.height !== hgt) b.parentNode.style.height = hgt;
        if (this.updEnd) this.updEnd();
      }
      componentWillUnmount() { if (this._ro) this._ro.disconnect(); if (super.componentWillUnmount) super.componentWillUnmount(); }
      render() {
        var v = this.renderVals();
        /* the demo's home-card slot stays mounted (empty): the demo's partial re-rendering needs both slots */
        return h(R.Fragment, null, h('div', { 'aria-hidden': true, style: { display: 'none' } }, v.hero), v.loan);
      }
      _renderHero() { return null; }      /* the slot is there; the demo's home card itself is not needed (the host page has its own) */
    };
  }

  PS.loadWithdraw = function () {
    if (klass) return Promise.resolve(klass);
    if (!loading) loading = fetch(url('withdraw.js'), { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + r.url); return r.text(); })
      .then(function (src) {
        window.__resources = Object.assign({ motionTokens: url('motion-tokens.js'), framerMotion: '', mayaLogo: url('assets/maya-logo.png') }, window.__resources);
        var Base = new Function('React', 'DCLogic', patch(src) + '\n;return Component;')(R, DCLogic);
        klass = make(Base); return klass;
      });
    return loading;
  };
})();
