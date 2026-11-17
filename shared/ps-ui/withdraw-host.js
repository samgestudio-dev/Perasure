/* PeraSure UI — the Withdraw demo's home card and loan screen, run from the demo's own code.
   Owner's rule: everything the Withdraw fund flow (prototypes/withdraw-fund-flow) covers is the demo as it is on GitHub — its motion,
   its look, its interactions, its copy — apart from new features and the numbers. So this file does not copy or re-write the demo: it
   loads that page's code as it ships (withdraw.js + motion-tokens.js) and mounts it — the home card, the screen that slides up from the
   bottom, the amount entry, the morph into the order card when a term is picked (the travelling amount, the card, the chips, the keypad
   leaving), the order page's blocks (order details, borrower protection with its Protected / Add button, withdrawal method, the
   agreement and its nudge) and the Confirm bar. A change to the demo therefore shows up here by itself.

   What a host page may set (everything else is the demo's) — one `host` object, read when a part draws (see opt()):
     PS.loadWithdraw()            → Promise of the sheet component (class)
     <Sheet ref initialAmount availableAmount totalBalance temporaryAmount temporaryValidTill host={host} />   (from a memo'd parent)
     host.width                   the frame's width in CSS px: the demo is laid out that wide (it is drawn for 360; nothing is scaled, so
                                  its type is the same size as the host's pages)
     host.max                     the most that can be borrowed, in pesos (the demo's 50,000 when not set): keypad, slider and caption
     host.maxLabel(sheet, text, style, extra) → the slider's right end (default: the demo's grey amount) · sheet.glide(amount): see there
     host.heroEl                  an element to draw the demo's home card in (then call sheet.forceUpdate()); its Withdraw pill opens the sheet
     host.blocks(sheet, blocks)   → the order page's blocks: the demo's own, with the host's new ones added (they enter like the demo's)
     host.order(sheet)            → { daily, per, total, save } the numbers of the order details (save: a coupon's discount)
     host.extraRows(sheet, o)     → rows added above "Total payment" (drawn with sheet.drow / sheet.hr: the demo's own row)
     host.firstDate · host.methodName · host.methodSub · host.methodLogo   values (or functions of the sheet) for the demo's sample data
     host.onMethod · host.onSchedule · host.onBenefits   taps on the method card, "View payment schedule", "See benefits"
     host.onState(next, prev, sheet) · host.onConfirm(sheet) (Confirm with the agreement ticked)
     sheet.open()  · sheet.close()  · sheet.refresh() · sheet.state { screen 'home' | 'loan', phase 'enter' | 'confirm', amt (hundreds,
     as text), term, agree, morph }
   Needs core.js; the page must not set window.__resources itself. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement;
  var klass = null, loading = null;
  function url(p) { return new URL(PS.root + 'prototypes/withdraw-fund-flow/' + p, document.baseURI).href; }

  /* Where the demo writes sample data or a fixed size into its code, these spots read the host instead. Motion code is not touched. */
  var PATCHES = [
    /* the limits (₱500–₱50,000) → host.max */
    ["if (parseInt(n || '0', 10) > 500) n = '500';", "if (parseInt(n || '0', 10) > this.maxH()) n = String(this.maxH());"],
    ["(500 + p * 49500) / 100", "(500 + p * (this.maxH() * 100 - 500)) / 100"],
    ["(this.amount() - 500) / 49500", "(this.amount() - 500) / (this.maxShownH() * 100 - 500)"],
    ["this.sp('₱50,000', {", "this.maxLabel({"],
    ["}, 'Flexible amounts from ₱500–₱50,000');", "}, 'Flexible amounts from ₱500–' + this.money(this.maxH() * 100, 0));"],
    /* the home card's bar is as long as the card's inside (304 at 360); its temporary-credit line shows while some is left */
    ["var B = this.creditBar(), W = 304;", "var B = this.creditBar(), W = this.heroW() - 24;"],   /* the bar: the card's own inner width (the app sizes its page margins in rem) */
    ["legend('temp', 'assets/dot-temporary.svg',", "B.temp > 0 && legend('temp', 'assets/dot-temporary.svg',"],
    /* the order page: hooks for the host's blocks and numbers, the sample data, taps */
    ["    ];\n    return this.el('div', {\n      key:'blocks',", "    ];\n    blocks = this.hostBlocks(blocks);\n    return this.el('div', {\n      key:'blocks', ref:this.blocksRef(),"],
    ["this.drow('First payment date', 'Oct 3, 2026', null, 'b')", "this.drow('First payment date', this.hv('firstDate', 'Oct 3, 2026'), null, 'b')"],
    ["this.drow('Total payment', this.money(o.total), null, 'e')", "...this.extraRows(o), this.drow('Total payment', this.money(o.total), null, 'e')"],
    ["cursor:'pointer' }, { key:'f' })", "cursor:'pointer' }, { key:'f', onClick:this.hv('onSchedule') })"],
    ["cursor:'pointer' }, { key:'s' })", "cursor:'pointer' }, { key:'s', onClick:this.hv('onBenefits') })"],
    ["React.createElement('div', { key:'c', style:{ height:72,", "React.createElement('div', { key:'c', onClick:this.hv('onMethod'), style:{ height:72, cursor:'pointer',"],
    ["src: window.__resources.mayaLogo, alt:'Maya',", "src: this.hv('methodLogo', window.__resources.mayaLogo), alt:this.hv('methodName', 'Maya'),"],
    ["this.sp('Bank of the Philippins Islands',", "this.sp(this.hv('methodName', 'Bank of the Philippins Islands'),"],
    ["this.sp('Ending in 4567',", "this.sp(this.hv('methodSub', 'Ending in 4567'),"]
  ];
  /* the demo is drawn 360 wide: these lengths follow the host's width instead (the keypad and its line keep 24 px from the edges) */
  var WIDE = [
    ["width:360,", "width:this.vw(),"],
    ["width:312, marginLeft:-156,", "width:this.vw() - 48, marginLeft:-(this.vw() - 48) / 2,"]
  ];
  function patch(src) {
    PATCHES.forEach(function (p) {
      if (src.split(p[0]).length !== 2) { console.warn('[withdraw-host] the demo changed: could not find', p[0]); return; }
      src = src.replace(p[0], p[1]);
    });
    WIDE.forEach(function (p) {
      if (src.split(p[0]).length < 2) console.warn('[withdraw-host] the demo changed: could not find', p[0]);
      src = src.split(p[0]).join(p[1]);
    });
    /* the home card's pictures are named relative to the demo's own page */
    src = src.split("'assets/").join("'" + url('assets/'));
    return src;
  }

  /* DCLogic: the base class the demo's code expects from the Claude Design runtime — state is merged at once (the demo relies on that,
     and also assigns this.state itself for its partial re-rendering), then the component is drawn again. React must never put an older
     state back: after every render it remembers the state object of that moment and assigns it again at the next update, by which time
     the demo may have moved on. So `state` is kept here, every object that has been replaced is remembered, and an assignment of one of
     those (only React does that; the demo always assigns a new object) is ignored. */
  class DCLogic extends R.Component {
    get state() { return this._st; }
    set state(v) {
      if (v === this._st) return;
      if (!this._old) this._old = new WeakSet();
      if (v && this._old.has(v)) return;
      if (this._st) this._old.add(this._st);
      this._st = v;
    }
    setState(update, cb) {
      var patch = typeof update === 'function' ? update(this._st) : update;
      if (patch) this.state = Object.assign({}, this._st, patch);
      this.forceUpdate(cb);
    }
  }

  function make(Base) {
    return class WithdrawSheet extends Base {
      /* the frame's width (the demo's 360 when not set) */
      vw() { return Math.max(320, Math.round(this.opt('width') || 360)); }
      /* the home card's width: the element the app gives it (its column follows the rem page margins and the text size), else the screen's less 2 × 16 */
      heroW() { var el = this.opt('heroEl'); return el && el.clientWidth ? el.clientWidth : this.vw() - 32; }
      /* host: one object that stays the same while its fields change. The sheet must not be re-rendered from outside — the demo keeps
         part of its state out of React's queue — so what changes is read from here when a part draws, never passed as new props. */
      opt(name) { var hst = this.props.host; return hst && hst[name] != null ? hst[name] : this.props[name]; }
      /* a host value: data may be a function of the sheet; a tap (on…) is passed as it is */
      hv(name, fb) { var v = this.opt(name); if (v == null) return fb === undefined ? null : fb; return typeof v === 'function' && name.slice(0, 2) !== 'on' ? v(this) : v; }
      maxH() { return Math.max(5, Math.round((this.opt('max') || 50000) / 100)); }
      /* the slider's right end (host.maxLabel(sheet, text, style, extra): e.g. the raised limit of a coupon) and the max the knob is drawn
         against — while glide() runs it moves with the knob instead of jumping */
      maxShownH() { return this._maxShown != null ? this._maxShown / 100 : this.maxH(); }
      maxLabel(style, extra) { var t = this.money(this.maxH() * 100, 0), f = this.opt('maxLabel'); return f ? f(this, t, style, extra) : this.sp(t, style, extra); }
      /* glide(amount): something other than the finger changed the amount or the limit (a coupon was ticked or kept): the knob, the fill
         and the amount move there on the sheet's spring (CLAUDE.md: "the amount slider follows the finger at once; when something else
         moves it… glide there on the Smooth spring"). While it runs the sheet's amount is not the user's (gliding()). */
      gliding() { return !!this._glide; }
      glide(amount) {
        var self = this, fm = this.state.fm, toMax = this.maxH() * 100, fromMax = this._maxShown != null ? this._maxShown : (this._lastMax || toMax);
        var fromAmt = this.amount(), toAmt = amount == null ? fromAmt : amount, hund = function (v) { return String(Math.round(v / 100)); };
        this._lastMax = toMax;
        if (this._glide) { this._glide.stop(); this._glide = null; }
        if (fromMax === toMax && fromAmt === toAmt) { this._maxShown = null; return; }
        if (!fm || !fm.animate || this.reduced()) { this._maxShown = null; this.setState({ amt: hund(toAmt) }); this.refresh(); return; }
        this._glide = fm.animate(0, 1, Object.assign({}, this.spring(), { restDelta: 0.001, restSpeed: 0.01,
          onUpdate: function (k) { self._maxShown = fromMax + (toMax - fromMax) * k; var a = hund(fromAmt + (toAmt - fromAmt) * k); if (a !== self.state.amt) self.setState({ amt: a }); else self.refresh(); },
          onComplete: function () { self._glide = null; self._maxShown = null; self.setState({ amt: hund(toAmt) }); self.refresh(); } }));
      }
      order() { var o = super.order(), f = this.opt('order'); return f ? Object.assign({}, o, f(this)) : o; }
      extraRows(o) { var f = this.opt('extraRows'); return (f && f(this, o)) || []; }
      hostBlocks(blocks) { var f = this.opt('blocks'); return f ? f(this, blocks) : blocks; }
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
      /* the host's numbers or blocks changed for a reason the sheet doesn't know (a coupon was picked): draw them again */
      refresh() { var S = this._subs || {}; ['amount', 'blocks'].forEach(function (ch) { if (S[ch]) S[ch].forEach(function (x) { x.forceUpdate(); }); }); }
      /* Confirm: before the agreement is ticked, the demo's own scroll + nudge; after, the host's */
      confirmTap() {
        if (!this.state.agree) return super.confirmTap();
        var on = this.opt('onConfirm'); if (on) on(this);
      }
      /* the demo's order page has a fixed length, made for its own blocks (its last block ends 24 px above the Confirm bar, 108);
         with the host's blocks added it is as long as they need, with the same 24 px */
      blocksRef() { var self = this; return this._blocksRef || (this._blocksRef = function (n) { self.watchBlocks(n); }); }
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
        /* the demo's home-card slot stays mounted (empty when there is no element for it): its partial re-rendering needs both slots */
        var el = this.opt('heroEl');
        return h(R.Fragment, null, el ? window.ReactDOM.createPortal(v.hero, el) : h('div', { 'aria-hidden': true, style: { display: 'none' } }, v.hero), v.loan);
      }
      /* the demo's home card: drawn into host.heroEl — the card the Credit limit increase closes into (introExit) and whose Withdraw
         pill opens the sheet */
      _renderHero() { return this.opt('heroEl') ? super._renderHero() : null; }
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
