/* Withdraw fund flow — the page's code (both variants). Run by the Claude Design runtime (runtime/dc-runtime.js):
   index.html / with-blur.html put this text into their <script data-dc-script> and then start the runtime.
   BLUR: the With-blur variant (<html data-variant="blur">) adds the progressive backdrop-blur bands. */
var BLUR = document.documentElement.getAttribute('data-variant') === 'blur';
/* ---- Performance: partial re-render slots ------------------------------------
   Before, every setState (one per frame during the 420ms amount morph, two per
   key press) re-rendered the whole page: the static home template, the hero
   card and the entire loan sheet. A PerfSlot renders one region through
   `render()`; setState below re-renders only the slots whose state changed.
   When an ancestor hands a slot new props it simply re-runs. When AnimatePresence
   freezes an exiting subtree, its slots are frozen too and keep their last
   output, exactly like the frozen element they replace. */
class PerfSlot extends React.Component {
  constructor(p){ super(p); this._p = null; this._out = null; this._frozen = false; }
  componentDidMount(){ if (!this._frozen) this.props.owner._sub(this.props.ch, this); }
  componentDidUpdate(){ if (!this._frozen) this.props.owner._sub(this.props.ch, this); }
  componentWillUnmount(){ this.props.owner._unsub(this.props.ch, this); }
  render(){
    if (this.props !== this._p) { this._p = this.props; this._frozen = false; }
    if (!this._frozen) this._out = this.props.render();
    return this._out;
  }
}

class Component extends DCLogic {
  C = { blue:'#2c74be', blue700:'#20558d', blue500:'#3fa0f0', blue50:'#f3f8ff', blue100:'#e4f0ff', ink:'#141e24', sub:'#6a757d', mute:'#7d878e', line:'#e0e3e5', page:'#f0f5f4', white:'#ffffff', green:'#3bcb84' };
  SH = {
    card:'0px 0px 2px 0px rgba(0,1,40,0.16), 0px 4px 12px 0px rgba(0,1,40,0.08)',
    cardOff:'0px 0px 0px 0px rgba(0,1,40,0), 0px 0px 0px 0px rgba(0,1,40,0)',
    glow:'0px 0px 24px 0px rgba(0,1,40,0.08)',
    glowOff:'0px 0px 0px 0px rgba(0,1,40,0)'
  };
  G = {
    moneyOut:'M12 15.2V4m0 0 3.8 3.8M12 4 8.2 7.8M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3',
    alert:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M12 7.6v5.2M12 16.4h.01',
    info:'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M12 11v5M12 8h.01',
    pencil:'M4 20h4L19 9a2.475 2.475 0 0 0-3.5-3.5L4.5 16.5 4 20z',
    chevL:'M14.5 5.5 8 12l6.5 6.5',
    chevR:'M9.5 5.5 16 12l-6.5 6.5',
    delFill:'M19.0002 2.00002H9.95621C9.19442 1.99767 8.44231 2.1706 7.75806 2.50545C7.07381 2.84029 6.47577 3.32806 6.01021 3.93102L0.210206 11.386C0.0736511 11.5616 -0.000488281 11.7776 -0.000488281 12C-0.000488281 12.2224 0.0736511 12.4385 0.210206 12.614L6.01021 20.069C6.47577 20.672 7.07381 21.1598 7.75806 21.4946C8.44231 21.8294 9.19442 22.0024 9.95621 22H19.0002C20.3258 21.9984 21.5966 21.4711 22.534 20.5338C23.4713 19.5965 23.9986 18.3256 24.0002 17V7.00002C23.9986 5.67443 23.4713 4.40358 22.534 3.46624C21.5966 2.52891 20.3258 2.00161 19.0002 2.00002ZM22.0002 17C22.0002 17.7957 21.6841 18.5587 21.1215 19.1213C20.5589 19.684 19.7959 20 19.0002 20H9.95621C9.49911 20.0016 9.04778 19.898 8.63716 19.6972C8.22653 19.4964 7.86762 19.2038 7.58821 18.842L2.26721 12L7.58821 5.15802C7.86762 4.79627 8.22653 4.50366 8.63716 4.30286C9.04778 4.10205 9.49911 3.99843 9.95621 4.00002H19.0002C19.7959 4.00002 20.5589 4.31609 21.1215 4.8787C21.6841 5.44131 22.0002 6.20437 22.0002 7.00002V17ZM17.2072 10.207L15.4142 12L17.2072 13.793C17.3027 13.8853 17.3789 13.9956 17.4313 14.1176C17.4837 14.2396 17.5113 14.3708 17.5125 14.5036C17.5136 14.6364 17.4883 14.7681 17.438 14.891C17.3877 15.0139 17.3135 15.1255 17.2196 15.2194C17.1257 15.3133 17.0141 15.3876 16.8912 15.4378C16.7683 15.4881 16.6366 15.5134 16.5038 15.5123C16.371 15.5111 16.2398 15.4835 16.1178 15.4311C15.9958 15.3787 15.8855 15.3025 15.7932 15.207L14.0002 13.414L12.2072 15.207C12.0186 15.3892 11.766 15.49 11.5038 15.4877C11.2416 15.4854 10.9908 15.3803 10.8054 15.1948C10.62 15.0094 10.5148 14.7586 10.5125 14.4964C10.5103 14.2342 10.611 13.9816 10.7932 13.793L12.5862 12L10.7932 10.207C10.611 10.0184 10.5103 9.76582 10.5125 9.50362C10.5148 9.24143 10.62 8.99061 10.8054 8.80521C10.9908 8.6198 11.2416 8.51463 11.5038 8.51235C11.766 8.51007 12.0186 8.61087 12.2072 8.79302L14.0002 10.586L15.7932 8.79302C15.9818 8.61087 16.2344 8.51007 16.4966 8.51235C16.7588 8.51463 17.0096 8.6198 17.195 8.80521C17.3804 8.99061 17.4856 9.24143 17.4879 9.50362C17.4902 9.76582 17.3894 10.0184 17.2072 10.207Z',
    coupon:'M3.5 7.8h17v3.1a1.8 1.8 0 0 0 0 3.6v3.1h-17v-3.1a1.8 1.8 0 0 0 0-3.6V7.8z',
    bank:'M3.6 10.4 12 4.6l8.4 5.8M6.2 10.9V19m11.6-8.1V19M3.4 19h17.2M9.6 19v-4.4h4.8V19',
    check:'M5.5 12.6 10 17l8.5-9.5',
    cardIcon:'M2.6 9h18.8M4.4 6h15.2a1.8 1.8 0 0 1 1.8 1.8v8.4a1.8 1.8 0 0 1-1.8 1.8H4.4a1.8 1.8 0 0 1-1.8-1.8V7.8A1.8 1.8 0 0 1 4.4 6z'
  };
  /* state key -> slots that read it (anything unlisted re-renders hero + loan) */
  static ROUTE = {
    pillOpen:['hero'], fm:['hero','loan'], MT:['hero','loan'],
    screen:['loan'], phase:['loan'], term:['loan'],
    amt:['amount','blocks'], agree:['blocks','bcta'],
    morph:['amount','bcta','grad'],
    /* the protection toggle lives in the confirm blocks — it used to fall
       through to hero + loan and re-render the whole page on every press */
    prot:['blocks'], protPress:['blocks'],
    /* bottom bar mount/unmount while the morph runs outside React */
    ctaOn:['bcta']
  };
  FALLBACK = { FEEL:{Smooth:{},Snappy:{},Gentle:{}}, ENTER:{}, LEAVE:{}, LAYER_IN:{}, LAYER_OUT:{}, Y:{text:8,block:10,digit:6}, PRESS:{}, PRESS_SCALE:{pill:0.985,iconButton:0.92}, STAGGER_STEP:0.03, REVEAL:function(){ return {initial:{},transition:{}}; }, REVEAL_ROW:function(){ return {initial:{},transition:{}}; } };

  constructor(props){
    super(props);
    var a = parseInt(props && props.initialAmount, 10);
    this.state = {
      fm:null, MT:null,
      screen:'home', pillOpen:false, phase:'enter',
      amt: String(Math.round((isNaN(a) ? 12500 : a) / 100)), term:null,
      avail:null, agree:false, morph:false, mp:0, prot:true, protPress:false
    };
    this._subs = {}; this._dirty = {};
  }

  componentDidMount(){
    var self = this;
    /* home header blur only while content scrolls under it (see .ps-live) — With-blur variant only */
    var hs = document.querySelector('.ps-home-scroll'), ht = document.querySelector('.ps-home-top');
    if (BLUR && hs && ht) { var live = false; hs.addEventListener('scroll', function(){ var on = hs.scrollTop > 0; if (on !== live) { live = on; ht.classList.toggle('ps-live', on); } }, { passive: true }); }
    /* the Credit limit intro (with-credit-limit.html, intro.js) hands its exit to the page: see introExit() */
    window.__wdIntroExit = function(o){ return self.introExit(o); };
    this._onVp = function(){ self.setState({ vp: window.__PS_PH || 740 }); };
    window.addEventListener('ps-viewport', this._onVp);
    /* Motion only loads once the document is actually painted — in a hidden
       document rAF never fires, so an animation would stall mid-flight and
       leave content stuck at its `initial` values. */
    var go = function(){
      if (self._loading) return; self._loading = true;
      var waitRes = function(){
        return new Promise(function(res){
          var t = function(){ if (window.__resources && window.__resources.motionTokens) res(); else setTimeout(t, 50); };
          t();
        });
      };
      waitRes().then(function(){
        return import(window.__resources.motionTokens).then(function(MT){
          return new Promise(function(res, rej){
            if (window.Motion) return res(window.Motion);
            var s = document.createElement('script');
            s.src = window.__resources.framerMotion;
            s.onload = function(){ res(window.Motion); };
            s.onerror = rej;
            document.head.appendChild(s);
          /* the callback routes this one update through the host, so renderVals()
             runs again and can mount the two LazyMotion roots exactly once */
          }).then(function(fm){ if (fm && !fm.features) fm.features = fm.domMax;   /* Motion 14 (shared vendor copy): the LazyMotion feature set is domMax */
            self.setState({ fm:fm, MT:MT }, function(){}); self.warmSheet(); });
        });
      }).catch(function(e){ console.warn('[motion] tokens unavailable', e); });
    };
    if (document.visibilityState === 'visible') go();
    else {
      this._onVis = function(){ if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', self._onVis); go(); } };
      document.addEventListener('visibilitychange', this._onVis);
    }
  }
  componentWillUnmount(){
    if (this._onVis) document.removeEventListener('visibilitychange', this._onVis);
    if (this._onVp) window.removeEventListener('ps-viewport', this._onVp);
  }

  /* ---- Performance: state -> slot routing --------------------------------- */
  _sub(ch, s){ (this._subs[ch] || (this._subs[ch] = new Set())).add(s); }
  _unsub(ch, s){ var set = this._subs[ch]; if (set) set.delete(s); }
  _freeze(ch){ var set = this._subs[ch]; if (!set) return; set.forEach(function(s){ s._frozen = true; }); set.clear(); }
  slot(ch, render, key){ return React.createElement(PerfSlot, { key:key, owner:this, ch:ch, render:render }); }
  setState(update, cb){
    var prev = this.state, patch = typeof update === 'function' ? update(prev) : update;
    var S = this._subs;
    /* until the slots are mounted (or with a callback) behave exactly as before */
    if (cb || !patch || !S.hero || !S.hero.size || !S.loan || !S.loan.size) return super.setState(patch, cb);
    var R = Component.ROUTE, want = {}, any = false;
    for (var k in patch) {
      if (patch[k] === prev[k]) continue;
      var r = R[k] || ['hero','loan'];
      for (var i = 0; i < r.length; i++) want[r[i]] = true;
      any = true;
    }
    this.state = Object.assign({}, prev, patch);   /* same synchronous merge as the host */
    if (!any) return;
    /* a pending/queued loan render re-renders everything inside it with the
       latest state, so fold region updates into it (keeps every frame coherent) */
    if ((want.amount || want.bcta || want.grad || want.blocks) && (want.loan || this._dirty.loan)) {
      want.loan = true; want.amount = want.bcta = want.grad = want.blocks = false;
    }
    if (want.loan) this._dirty.loan = true;
    for (var ch in want) if (want[ch] && S[ch]) S[ch].forEach(function(s){ s.forceUpdate(); });
  }

  mt(){ return this.state.MT || this.FALLBACK; }
  /* extra screen height on a phone taller than the 740px design (0 on desktop):
     the sheet, the card's edit-state height and the keypad follow the bottom */
  ex(){ var p = window.__PS_PH; return p > 740 ? Math.round(p - 740) : 0; }
  /* ...and the shortfall on a shorter one (≤100): the band between the amount
     and the caption shrinks by it in the edit state */
  df(){ var p = window.__PS_PH; return p && p < 740 ? Math.min(100, Math.round(740 - p)) : 0; }
  /* iOS Safari edge-to-edge: how far the page runs on under the search bar (sb)
     and up behind the status bar (ee); 0 elsewhere */
  sb(){ return Math.max(0, Math.round(window.__PS_SB || 0)); }
  ee(){ return Math.max(0, Math.round(window.__PS_E || 0)); }
  spring(){ var F = this.mt().FEEL, T = window.WD_TUNE || {}; return F[T.feel || this.props.feel] || F.Smooth; }
  available(){ return true; }

  el(tag, props, kids){
    var fm = this.state.fm;
    /* `m` + LazyMotion(strict) instead of `motion` — features ship once, in renderVals() */
    if (fm && this.state.MT) return React.createElement(fm.m[tag], props, kids);
    var clean = {}, skip = /^(initial|animate|exit|transition|variants|layout|layoutRoot|layoutId|layoutDependency|whileTap|whileHover|whileFocus|custom|onAnimationStart|onAnimationComplete)$/;
    for (var k in props) if (!skip.test(k)) clean[k] = props[k];
    return React.createElement(tag, clean, kids);
  }
  ap(props, kids){
    var MT = this.state.MT;
    var AP = MT ? MT.presence(this.state.fm) : function(p){ return p.children; };
    return React.createElement(AP, props, kids);
  }
  fade(key, y, style, children){
    var MT = this.state.MT, fm = this.state.fm;
    if (MT && fm) return MT.fade(React, fm.m, key, y, style, children);
    return React.createElement('div', { key:key, style:style }, children);
  }
  /* Like mo(), but animated values stay OUT of `style` so React can't write the
     target straight to the DOM — the motion engine owns them and tweens from the
     previous value. */
  an(base, vals, tr){
    return { style: base, initial:false, animate: Object.assign({}, vals, { transition: tr || this.spring() }) };
  }
  mo(base, vals, tr){
    return { style: Object.assign({}, base, vals), animate: Object.assign({}, vals, { transition: tr || this.spring() }) };
  }
  /* Brand / filled marks supplied as real SVG — painted, not stroked */
  GS = {
    gcash: { vb:'0 0 16 16', body:'<path d="M4.6375 1.58205C5.44935 1.31682 6.31294 1.20685 7.16684 1.26184C8.41856 1.32976 9.64118 1.77288 10.66 2.50063C10.77 2.58149 10.8897 2.65588 10.9835 2.75938C11.1452 2.94375 11.2099 3.20574 11.1517 3.44509C11.0934 3.70384 10.8897 3.92378 10.6374 4.00141C10.3916 4.07904 10.1102 4.02728 9.91287 3.86233C9.15278 3.27689 8.22773 2.90817 7.27357 2.8176C6.92425 2.77879 6.56846 2.77879 6.21914 2.8176C5.21323 2.91787 4.23967 3.32218 3.45693 3.96583C2.57393 4.68711 1.93028 5.70272 1.67799 6.81537C1.44511 7.82452 1.51627 8.90482 1.89147 9.87192C2.28607 10.9005 3.02028 11.7899 3.94533 12.3851C4.6375 12.8282 5.43641 13.1031 6.25149 13.1807C6.56846 13.2196 6.89191 13.2196 7.20565 13.184C8.19215 13.0999 9.14631 12.7215 9.92905 12.1166C10.1263 11.9614 10.4077 11.9161 10.6471 11.9969C10.977 12.1101 11.2131 12.4627 11.1711 12.812C11.1517 13.0158 11.0449 13.2099 10.8832 13.3328C10.2622 13.8179 9.55709 14.1899 8.8067 14.4292C7.8396 14.7397 6.79811 14.8206 5.7922 14.6815C4.67632 14.5263 3.60248 14.0799 2.70331 13.4007C1.83001 12.7473 1.11843 11.8773 0.649441 10.8908C0.190151 9.92367 -0.0330253 8.84336 0.005788 7.77276C0.0413668 6.45635 0.478016 5.1561 1.24781 4.0855C2.07583 2.92111 3.27581 2.02517 4.6375 1.58205Z" fill="currentColor"/><path d="M14.1013 3.41859C14.4377 3.31832 14.8323 3.47681 14.994 3.79378C15.7703 5.31073 16.1099 7.04439 15.9708 8.74247C15.8738 9.95215 15.5407 11.1457 14.9811 12.2227C14.7773 12.6076 14.2307 12.7305 13.8782 12.4783C13.5515 12.268 13.4447 11.799 13.6388 11.4594C14.7191 9.33761 14.7288 6.70801 13.6614 4.57975C13.5644 4.40509 13.5127 4.19809 13.5612 4.00078C13.6162 3.72586 13.8329 3.49298 14.1013 3.41859Z" fill="currentColor"/><path d="M4.53351 4.32968C5.90491 3.50167 7.75824 3.52431 9.09083 4.42672C9.42074 4.6693 9.48867 5.18681 9.23315 5.50702C9.0035 5.82076 8.52804 5.91456 8.20136 5.70432C7.68385 5.37441 7.05637 5.23209 6.44829 5.30325C5.84022 5.36794 5.25802 5.64934 4.83107 6.08598C4.40413 6.5097 4.12597 7.07896 4.05804 7.67733C3.99659 8.16249 4.07745 8.66383 4.27799 9.11018C4.54321 9.69885 5.02514 10.1873 5.61381 10.4589C6.21541 10.7436 6.92052 10.7889 7.55447 10.5916C8.4019 10.3328 9.10377 9.63093 9.34635 8.78027C8.73828 8.78351 8.1302 8.78027 7.52213 8.78027C7.23103 8.78027 6.94963 8.59914 6.82996 8.33715C6.68117 8.03635 6.7588 7.64498 7.01109 7.42504C7.14046 7.3086 7.31189 7.23098 7.48655 7.22451C8.40513 7.21804 9.32048 7.22127 10.2391 7.22127C10.5399 7.21157 10.831 7.39917 10.9506 7.67409C11.0541 7.88757 11.0218 8.13015 11.0089 8.35979C10.928 9.356 10.4784 10.3166 9.76683 11.0217C9.08436 11.7074 8.16255 12.1506 7.19868 12.2476C6.25099 12.3511 5.27096 12.1214 4.46558 11.6072C3.65374 11.0929 3.01979 10.294 2.70928 9.38188C2.39231 8.46006 2.40848 7.42828 2.73839 6.51293C3.06184 5.60729 3.70872 4.82455 4.53351 4.32968Z" fill="currentColor"/><path d="M11.9989 4.75125C12.3321 4.66392 12.7105 4.83535 12.8657 5.14262C13.7067 6.92156 13.7067 9.0757 12.8657 10.8546C12.759 11.0649 12.5455 11.2201 12.3094 11.2589C12.0345 11.3075 11.7402 11.191 11.5687 10.9711C11.3908 10.7414 11.3585 10.4115 11.4879 10.1528C12.1154 8.79107 12.1057 7.15767 11.4717 5.79921C11.2809 5.38197 11.5526 4.84828 11.9989 4.75125Z" fill="currentColor"/>' },
    infoFill: { vb:'0 0 12 12', body:'<path d="M6.08333 4.7015C6.27092 4.70156 6.42863 4.82822 6.47624 5.00065C6.50095 5.05506 6.51497 5.11538 6.51497 5.17904V7.92904H6.84017C7.0655 7.92904 7.24837 8.11158 7.24837 8.33691C7.24837 8.56225 7.0655 8.74479 6.84017 8.74479H5.29199C5.06666 8.74479 4.88411 8.56225 4.88411 8.33691C4.88411 8.11158 5.06666 7.92904 5.29199 7.92904H5.65104V5.51725H5.20768C4.98235 5.51725 4.7998 5.33471 4.7998 5.10938C4.7998 4.88404 4.98235 4.7015 5.20768 4.7015H6.08333Z" fill="currentColor"/><path d="M5.99967 3C6.33102 3 6.59957 3.26859 6.59961 3.59993C6.59961 3.93131 6.33105 4.19987 5.99967 4.19987C5.66833 4.19983 5.39974 3.93128 5.39974 3.59993C5.39977 3.26862 5.66836 3.00004 5.99967 3Z" fill="currentColor"/><path d="M6.00049 0.333984C9.12995 0.33416 11.6665 2.87147 11.6665 6.00098C11.6663 9.13033 9.12984 11.6668 6.00049 11.667C2.87098 11.667 0.333672 9.13044 0.333496 6.00098C0.333496 2.87136 2.87087 0.333984 6.00049 0.333984ZM6.00049 1.33398C3.42316 1.33398 1.3335 3.42365 1.3335 6.00098C1.33367 8.57816 3.42327 10.667 6.00049 10.667C8.57756 10.6668 10.6663 8.57805 10.6665 6.00098C10.6665 3.42376 8.57767 1.33416 6.00049 1.33398Z" fill="currentColor"/>' },
    coupon: { vb:'0 0 20 20', body:'<path d="M13.4299 2.46373C14.8373 2.61076 15.9088 3.7929 15.9186 5.20791L15.9427 8.56184C15.9482 9.35208 15.6165 10.108 15.0312 10.639L9.1617 15.963C8.02558 16.9936 6.26891 16.9083 5.23808 15.7724L1.87864 12.0691C0.848153 10.9329 0.933244 9.17619 2.06922 8.14544L7.93807 2.82074C8.52337 2.28972 9.30791 2.03291 10.0939 2.11501L13.4299 2.46373ZM14.2461 5.24106C14.2511 4.66185 13.8107 4.17639 13.2338 4.12516L9.84602 3.82408C9.53714 3.79667 9.22977 3.89953 9.00011 4.10789L3.18927 9.38012C2.735 9.79237 2.70063 10.4953 3.11262 10.9497L6.47207 14.653C6.88441 15.1071 7.58729 15.1404 8.04165 14.7283L13.8532 9.45677C14.0828 9.24846 14.215 8.95331 14.2178 8.64332L14.2461 5.24106ZM18.0551 4.44418C18.5153 4.44418 18.8886 4.81745 18.8886 5.27766V9.73022C18.8886 10.6143 18.5373 11.4626 17.9121 12.0877L11.9418 18.0581C11.6268 18.3727 11.1252 18.3997 10.7775 18.1216C10.3655 17.7918 10.337 17.1747 10.7175 16.8089L16.1989 11.5387C16.8524 10.9104 17.2215 10.0429 17.2216 9.13636L17.2223 5.27697C17.2226 4.81721 17.5953 4.44445 18.0551 4.44418ZM12.4638 5.55525C13.1147 6.20613 13.1147 7.26186 12.4638 7.91273C11.8129 8.56328 10.7578 8.56281 10.107 7.91204C9.45641 7.26127 9.45654 6.2068 10.107 5.55594C10.7579 4.90511 11.8129 4.90452 12.4638 5.55525Z" fill="currentColor"/>' },
    edit: { vb:'0 0 20 20', body:'<path d="M15.4601 16.2416H4.53966C4.33278 16.2416 4.13438 16.3238 3.98809 16.4701C3.84181 16.6163 3.75963 16.8147 3.75963 17.0216C3.75963 17.2285 3.84181 17.4269 3.98809 17.5732C4.13438 17.7195 4.33278 17.8016 4.53966 17.8016H15.4601C15.667 17.8016 15.8654 17.7195 16.0116 17.5732C16.1579 17.4269 16.2401 17.2285 16.2401 17.0216C16.2401 16.8147 16.1579 16.6163 16.0116 16.4701C15.8654 16.3238 15.667 16.2416 15.4601 16.2416ZM4.53966 14.6815H4.60986L7.86259 14.3851C8.2189 14.3496 8.55216 14.1926 8.80642 13.9405L15.8267 6.92022C16.0992 6.63237 16.2464 6.24823 16.2362 5.852C16.226 5.45577 16.0591 5.07975 15.7721 4.80634L13.6348 2.66906C13.3559 2.40704 12.9903 2.2567 12.6078 2.24663C12.2252 2.23657 11.8523 2.36747 11.5599 2.61446L4.53966 9.63473C4.28752 9.88899 4.13053 10.2223 4.09504 10.5786L3.75963 13.8313C3.74912 13.9455 3.76394 14.0607 3.80304 14.1686C3.84214 14.2764 3.90456 14.3743 3.98583 14.4553C4.05872 14.5276 4.14516 14.5848 4.2402 14.6236C4.33523 14.6624 4.437 14.6821 4.53966 14.6815ZM12.5506 3.7611L14.6801 5.89058L13.12 7.41164L11.0295 5.32116L12.5506 3.7611ZM5.6083 10.7112L9.99987 6.3508L12.106 8.45688L7.73778 12.8251L5.39769 13.0435L5.6083 10.7112Z" fill="#2C74BE"/>' }
  };
  gs(name, px){
    var g = this.GS[name];
    return React.createElement('svg', {
      width:px, height:px, viewBox:g.vb, fill:'none',
      style:{ display:'block', flex:'none' },
      dangerouslySetInnerHTML:{ __html: g.body }
    });
  }
  ic(name, px, color, sw){
    return React.createElement('svg', {
      width:px, height:px, viewBox:'0 0 24 24', fill:'none', stroke: color || 'currentColor',
      strokeWidth: sw || 1.7, strokeLinecap:'round', strokeLinejoin:'round',
      style:{ display:'block', flex:'none' },
      dangerouslySetInnerHTML:{ __html: '<path d="' + this.G[name] + '"/>' }
    });
  }
  icf(name, px, color){
    return React.createElement('svg', {
      width:px, height:px, viewBox:'0 0 24 24', fill: color || 'currentColor',
      style:{ display:'block', flex:'none' },
      dangerouslySetInnerHTML:{ __html: '<path d="' + this.G[name] + '"/>' }
    });
  }
  /* Stacked backdrop layers, each blurrier and masked to a smaller slice, so the
     sampled blur ramps from `max` at `edge` down to 0 at the far side. */
  /* digit motion targets, defined once (rerender-variants-object /
     rerender-animate-prop): stable objects, so a re-render never restarts them */
  static DIGIT_IN = {
    initial: { opacity:0, y:5, filter:'blur(5px)' },
    animate: {
      opacity:[0, 0.28, 0.72, 1],
      y:[5, 2.1, 0.6, 0],
      filter:['blur(5px)', 'blur(2.5px)', 'blur(0.8px)', 'blur(0px)'],
      transition:{ duration:0.38, times:[0, 0.4, 0.7, 1], ease:[0.34, 0.02, 0.2, 1] }
    }
  };
  static DIGIT_STILL = { opacity:1, y:0, filter:'blur(0px)', transition:{ duration:0 } };
  static PBL = [[0.06,84,100],[0.14,66,84],[0.3,48,66],[0.55,28,48],[1,10,28]];
  pbBlur(max, i){ var b = (max * Component.PBL[i][0]).toFixed(2) + 'px'; return 'blur(' + b + ')'; }
  pblur(key, style, max, edge, refName){
    var dir = edge === 'top' ? 'to bottom' : 'to top', self = this;
    return React.createElement('div', { key:key, style: Object.assign({ position:'absolute', pointerEvents:'none' }, style) },
      Component.PBL.map(function(l, i){
        var m = 'linear-gradient(' + dir + ', #000 0%, #000 ' + l[1] + '%, rgba(0,0,0,0) ' + l[2] + '%)';
        var b = self.pbBlur(max, i);
        return React.createElement('div', { key:'l'+i, ref: refName ? self.ref(refName + i) : undefined, style:{ position:'absolute', left:0, top:0, right:0, bottom:0, backdropFilter:b, WebkitBackdropFilter:b, maskImage:m, WebkitMaskImage:m } }, null);
      }));
  }
  sp(text, style, extra){ return React.createElement('span', Object.assign({ style:style }, extra||{}), text); }

  amount(){ var n = parseInt(this.state.amt || '5', 10); return isNaN(n) ? 500 : n * 100; }
  money(v, dec){ return '₱' + v.toLocaleString('en-US', { minimumFractionDigits: dec===0?0:2, maximumFractionDigits: dec===0?0:2 }); }
  display(){ return (this.amount()).toLocaleString('en-US') + '.00'; }
  /* Keypad enters hundreds. chars() returns only the typed digits (+ commas);
     the fixed grey "00" and the caret are rendered separately so the caret can
     sit between them. Cleared input falls back to the ₱500 minimum. */
  chars(){
    var raw = this.state.amt || '', lead = raw || '5';
    var full = lead + '00', out = [];
    for (var i = 0; i < lead.length; i++){
      /* keyed by position only: a digit the slider changes is the same node with
         new text (no unmount/mount per pointer move); typing still appends a new
         key at the end, which is what gets the entrance */
      out.push({ key: (raw ? 'd' : 'z') + i, ch: lead.charAt(i) });
      var rest = full.length - 1 - i;
      /* keyed by how many digits follow it, so a comma keeps its identity
         (and its node) as the number grows — only the new digit animates */
      if (rest > 0 && rest % 3 === 0) out.push({ key:'cr'+rest, ch:',' });
    }
    return out;
  }
  order(){
    var amt = this.amount(), terms = this.state.term || 6, days = terms * 15;
    var daily = amt * 0.000275, fee = daily * days, disc = Math.round(fee * 0.35);
    var total = amt + fee - disc;
    return { terms:terms, days:days, daily:daily, fee:fee, disc:disc, total:total, per: total / terms };
  }

  press(k){
    var s = this.state;
    if (k === 'del') { this.setState({ amt: s.amt.slice(0,-1) }); return; }
    if (k === '*') return;
    var n = (s.amt + k).replace(/^0+/, '');
    if (parseInt(n || '0', 10) > 500) n = '500';
    if (n.length > 3) n = n.slice(0,3);
    this.setState({ amt:n });
  }
  /* The motion engine refuses to tween font-size, so the amount row runs off an
     explicit 0→1 progress driven here: every size, gap and offset is lerped from
     it, which keeps type scale and position on one curve. */
  /* ---- Morph progress lives in a MotionValue, not in React state ------------
     It used to be state: one setState per frame → React re-rendered the amount,
     bottom-bar and gradient slots 60×/s (and, with createRoot, painted the
     result a frame late). Now `_mpMV` is driven on Framer Motion's frame loop
     and its "change" event writes the handful of affected style props straight
     to the DOM (skills: rerender-motion-value, rerender-motion-value-event).
     Every value comes from the same mp*() functions render() uses, so a frame
     and a render can never disagree. */
  _mp = 0;
  _r = {};
  _refFns = {};
  /* stable callback refs (rerender-stable-callbacks). A detach (null) is
     ignored: an exiting sheet must not clear the ref of the sheet replacing it. */
  ref(name){
    var R = this._r;
    return this._refFns[name] || (this._refFns[name] = function(n){ if (n) R[name] = n; });
  }
  /* lerp follows the spring exactly (same tiny overshoot as the card it rides
     with); anything that must stay in range — opacity, colour, weight — clamps */
  lerp(a, b){ var k = this._mp; return a + (b - a) * k; }
  k01(){ return Math.max(0, Math.min(1, this._mp)); }
  /* clamped lerp for box geometry (no negative height / radius on the spring's
     sub-pixel overshoot) */
  lc(a, b){ return a + (b - a) * this.k01(); }
  /* opacity window on the shared progress: 0 before k=a, 1 after k=b, smoothstep
     between. Same function both ways, so a reversal simply runs it back; and
     because the spring is front-loaded, the exit (1→0) is naturally quicker
     than the entrance. */
  win(a, b){ var t = Math.max(0, Math.min(1, (this._mp - a) / (b - a))); return t * t * (3 - 2 * t); }
  /* Colour has to ride the same 0→1 as the sizes; handing it to the spring
     instead makes it land on a different curve and reads as a flash. */
  mix(a, b){
    var k = this.k01(), h = (c) => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];
    var x = h(a), y = h(b);
    return 'rgb(' + x.map((v,i) => Math.round(v + (y[i]-v)*k)).join(',') + ')';
  }
  /* every mp-dependent style, by node */
  /* pure moves are transforms (anim-transform-properties): top stays at the
     edit-state value, the morph only translates — no layout for these three */
  /* The card's left edge + left padding and its top padding are layout, moving
     on the progress. Blink snaps an element's layout offset to device pixels
     before applying its transform, so with left (→) and padding (←) moving in
     opposite directions the content stepped back a pixel now and then while the
     transforms inside kept gliding. cardSnap() puts the card's layout on whole
     device pixels (summing left + padding first, so it only ever steps one way)
     and hands the sub-pixel remainder to the transforms of the amount block. */
  cardSnap(){
    /* Blink rounds the layout offset of any transformed element to whole CSS
       pixels before applying its transform (translations themselves are drawn
       exactly). So the card's CONTENT origin goes on whole CSS pixels — its
       edge keeps moving smoothly, the left padding absorbs the difference — and
       the sub-pixel remainder rides the transforms of what's inside. */
    /* layout lengths are kept in 1/64 px (LayoutUnit); quantise first so that
       left + padding really lands on the whole pixel instead of 1/64 short */
    var q = (v) => Math.round(v * 64) / 64;
    var l = q(this.lc(0, 16)), pl = this.lc(24, 16), pt = this.lc(0, 16);
    var xs = Math.round(l + pl), pts = Math.round(pt);
    return { left: l, padLeft: xs - l, padTop: pts, rx: (l + pl) - xs, ry: pt - pts };
  }
  /* residual translate for layout-moved content inside the card */
  resT(){ var c = this.cardSnap(), r3 = (v) => Math.round(v * 1000) / 1000; return 'translate(' + r3(c.rx) + 'px,' + r3(c.ry) + 'px)'; }
  ty(from, to){ var c = this.cardSnap(), r3 = (v) => Math.round(v * 1000) / 1000; return 'translate(' + r3(c.rx) + 'px,' + r3(this.lerp(from, to) - from + c.ry) + 'px)'; }
  mpLabel(){ return { transform: this.ty(32, 0) }; }
  mpRow(){ return { transform: this.ty(68, 24), height: this.ll(44, 40) }; }
  /* ₱ has no glyph in Satoshi — it renders from Inter, a variable font (wght
     100–900), so the weight can ride the progress continuously. Quantised to 5
     units: visually continuous, and the glyph cache sees ≤41 instances instead
     of a new one every frame. Font-size already re-lays this span each frame,
     so the weight adds no extra layout pass. */
  pesoWeight(){ return Math.round((500 + 200 * this.k01()) / 5) * 5; }
  /* ---- amount row: layout frozen, glyphs FLIPped ----------------------------
     Animating font-size / line-height made Blink re-lay the row every frame,
     and Blink rounds a font's ascent/descent to whole pixels for the baseline:
     as the size swept, ascent and descent rounded up at different sizes, so the
     baseline stepped +½px, −½px … and ₱ (Inter), the digits and ".00" (Satoshi)
     each stepped at different moments — the shimmer, worst in the slow tail.
     Not Satoshi's fault as such; any font animated through font-size does it.
     Now: layout-affecting values (_lk) jump to the destination once at the start
     of a morph; every glyph is then moved and scaled from where it was to where
     it ends with a transform (flipStart / flipApply), on the same progress. No
     layout per frame, and positions are continuous. Paint-only values (colour,
     ₱ weight, caret fade) still follow the live progress. */
  _lk = 0;
  ll(a, b){ return a + (b - a) * this._lk; }
  pxl(a, b){ return this.ll(a, b) + 'px'; }
  mpPeso(){ return { fontWeight: this.pesoWeight(), fontSize: this.pxl(28, 32), lineHeight: this.pxl(28, 40), letterSpacing: this.pxl(0.84, -0.16), marginRight: this.ll(8, 0), color: this.mix('#97a0a6', this.C.blue) }; }
  mpNum(){ return { fontSize: this.pxl(48, 32), lineHeight: this.pxl(44, 40), height: this.ll(44, 40), letterSpacing: this.pxl(1.44, -0.16), color: this.mix(this.C.ink, this.C.blue) }; }
  mpCaret(){ return { width: this.ll(1, 0), height: this.ll(44, 40), marginLeft: this.ll(2, 0) }; }
  /* The caret's fade lives on a plain wrapper, not on the layout node: a node with
     `layout` turns opacity into a Framer Motion value (stuck at 1), which used to
     swallow this fade. */
  mpCaretFade(){ return { opacity: 1 - this.k01() }; }
  mpTail(){ return { marginLeft: this.ll(2, 0), color: this.mix('#97a0a6', this.C.blue) }; }
  mpDec(){ return { fontSize: this.pxl(18, 32), lineHeight: this.pxl(28, 40), letterSpacing: this.pxl(0.54, -0.16), marginLeft: this.ll(4, 0), color: this.mix('#97a0a6', this.C.blue) }; }
  /* glyph wrapper: inline-block box + an empty inline-block whose top sits
     exactly on the text baseline — what FLIP measures and scales around */
  static GLYPH = { display:'inline-block' };
  /* Satoshi kerns "." → "0" by −36/1000 em; split into separate boxes the pair
     no longer kerns, so the period carries that kern as a margin — the settled
     ".00" lands exactly where the unsplit text did */
  static GLYPH_DOT = { display:'inline-block', marginRight:'-0.036em' };
  static BASE = { display:'inline-block', width:0, height:0 };
  glyph(id, text, st){ return React.createElement('span', { key:'g', 'data-g': id, style: st || Component.GLYPH }, [React.createElement('i', { key:'b', style: Component.BASE }), text]); }
  fsOf(id, k){ var c = id.charAt(0), l = (a, b) => a + (b - a) * k; return c === 'p' ? l(28, 32) : c === 'x' ? l(18, 32) : l(48, 32); }
  r3(v){ return Math.round(v * 1000) / 1000; }
  flipStart(from, target){
    var row = this._r.row; if (!row) { this._lk = target; return; }
    var prev = this._flip, src = {}, dst = {}, self = this;
    var els = Array.prototype.slice.call(row.querySelectorAll('[data-g]'));
    var boxes = { caret: this._r.caretFade, edit: this._r.editBox };
    var rr = row.getBoundingClientRect();
    /* where everything is on screen right now (mid-morph: the last frame) */
    els.forEach(function(g){
      var id = g.getAttribute('data-g');
      if (prev && prev.vis[id]) { src[id] = prev.vis[id]; return; }
      var m = g.firstChild.getBoundingClientRect();
      /* text is drawn on the whole-px line its baseline rounds to: track that */
      src[id] = { x: m.left - rr.left, b: Math.round(m.top - rr.top), f: self.fsOf(id, from) };
    });
    for (var k in boxes) { var el = boxes[k]; if (!el) continue;
      if (prev && prev.vis['#' + k]) { src['#' + k] = prev.vis['#' + k]; continue; }
      /* boxes (the pencil's svg, the caret bar) are painted at their layout
         position rounded to the whole px, then shifted by their translate
         exactly — so they are tracked by where they are DRAWN, not laid out */
      var r = el.getBoundingClientRect(); src['#' + k] = { x: Math.round(r.left - rr.left), y: Math.round(r.top - rr.top), h: r.height || 1 }; }
    /* lay the row out once at the destination and measure it */
    els.forEach(function(g){ g.style.transform = ''; g.style.position = ''; g.style.left = ''; });
    for (k in boxes) if (boxes[k]) boxes[k].style.transform = '';
    var peso = this._r.peso; if (peso) peso.style.width = '';
    this._lk = target; this.applyLayout();
    if (peso) peso.style.fontWeight = String(Math.round(500 + 200 * Math.max(0, Math.min(1, target))));
    rr = row.getBoundingClientRect();
    els.forEach(function(g){
      var id = g.getAttribute('data-g'), m = g.firstChild.getBoundingClientRect(), gr = g.getBoundingClientRect();
      var ox = gr.left - rr.left, oy = gr.top - rr.top;
      dst[id] = { x: m.left - rr.left, b: Math.round(m.top - rr.top), f: self.fsOf(id, target), cx: ox - Math.round(ox), cy: oy - Math.round(oy) };
      g.style.transformOrigin = self.r3(m.left - gr.left) + 'px ' + self.r3(m.top - gr.top) + 'px';
    });
    /* Each glyph box is nudged by its own sub-pixel remainder (relative offset)
       so it sits on a whole pixel, and the remainder rides its translate instead.
       A browser that rounds the position of a scaled element (Blink does, WebKit
       may not) then has nothing to round, so the glyph lands in the same place in
       every engine and at any page zoom — no engine-specific correction needed. */
    els.forEach(function(g){ var d = dst[g.getAttribute('data-g')]; if (!d) return;
      g.style.position = 'relative'; g.style.left = self.r3(-d.cx) + 'px'; });
    for (k in boxes) { var el2 = boxes[k]; if (!el2) continue;
      var r2 = el2.getBoundingClientRect(), ox2 = r2.left - rr.left, oy2 = r2.top - rr.top;
      dst['#' + k] = { x: Math.round(ox2), y: Math.round(oy2), h: r2.height || 1 };
      el2.style.transformOrigin = '0 0'; }
    /* ₱ changes weight on the way; a fixed box keeps that from moving the digits */
    /* the exact laid-out width (a multiple of 1/64 px): rounding it to 0.001
       moved everything after ₱ by 1/64 px for the whole morph — enough to tip
       the pencil's pixel snapping across .5 and jump it 1px when the box was
       released at the end */
    if (peso) { peso.style.width = Math.round(peso.getBoundingClientRect().width * 64) / 64 + 'px'; peso.style.fontWeight = String(this.pesoWeight()); }
    this._flip = { from: from, target: target, src: src, dst: dst, els: els, boxes: boxes, vis: {} };
    this.flipApply();
  }
  flipApply(){
    var F = this._flip; if (!F) return;
    var t = F.target === F.from ? 1 : (this._mp - F.from) / (F.target - F.from), r3 = this.r3;
    /* Text is drawn on the whole-px line its baseline rounds to, so both ends
       are tracked on those lines (src/dst .b) and the translate carries the
       motion between them: the first and last frames then match the settled
       text exactly, also when the page is scaled to the phone's width (where a
       mismatch showed as a 1-device-pixel hop at the start). Horizontally
       the glyph box sits on a whole pixel (see flipStart) and its sub-pixel
       remainder cx is part of the translate, scaled or not. */
    F.els.forEach(function(g){
      var id = g.getAttribute('data-g'), s = F.src[id], d = F.dst[id]; if (!s || !d) return;
      var x = s.x + (d.x - s.x) * t, b = s.b + (d.b - s.b) * t, f = s.f + (d.f - s.f) * t;
      /* within 0.2% of full size the scale is dropped: the glyph is then drawn
         exactly like the untransformed one it hands over to (same sub-pixel
         text path), so the last frame and the settled frame are identical */
      var sc = f / d.f, scaled = Math.abs(sc - 1) >= 0.002;
      g.style.transform = 'translate(' + r3(x - d.x + d.cx) + 'px,' + r3(b - d.b) + 'px)' + (scaled ? ' scale(' + Math.round(sc * 1e5) / 1e5 + ')' : '');
      F.vis[id] = { x: x, b: b, f: f };
    });
    for (var k in F.boxes) { var el = F.boxes[k], s = F.src['#' + k], d = F.dst['#' + k]; if (!el || !s || !d) continue;
      var x = s.x + (d.x - s.x) * t, y = s.y + (d.y - s.y) * t, h = s.h + (d.h - s.h) * t;
      var hs = h / d.h, sy = Math.abs(hs - 1) >= 0.002;
      el.style.transform = 'translate(' + r3(x - d.x) + 'px,' + r3(y - d.y) + 'px)' + (sy ? ' scale(1,' + Math.round(hs * 1e5) / 1e5 + ')' : '');
      F.vis['#' + k] = { x: x, y: y, h: h }; }
  }
  flipEnd(){
    var F = this._flip; if (!F) return;
    F.els.forEach(function(g){ g.style.transform = ''; g.style.transformOrigin = ''; g.style.position = ''; g.style.left = ''; });
    for (var k in F.boxes) if (F.boxes[k]) { F.boxes[k].style.transform = ''; F.boxes[k].style.transformOrigin = ''; }
    if (this._r.peso) this._r.peso.style.width = '';
    this._flip = null;
  }
  /* the pencil's slot opens with the morph; the glyph itself is a secondary
     layer on its own clock (LAYER_IN / LAYER_OUT), see amountBlock() */
  mpEdit(){ return { width: this.ll(0, 20), marginLeft: this.ll(0, 4) }; }
  mpRange(){ return { transform: this.ty(196, 72), height: this.lerp(16, 42) }; }
  /* "Flexible amounts…" lives in the gap between the Loan-term row (above) and
     the term pills (below). Both neighbours move on the same spring but by
     different distances (77px vs 101px), so the caption follows the MIDDLE of
     the two — the gap compresses evenly instead of one neighbour running into it.
     Same numbers the card animates with, in card coordinates: */
  capTermBottom(){ return this.lc(0, 16) + this.lerp(259 - this.df(), 114) + this.lc(0, 32) + this.lc(0, 20); } // pad + amount + divider + term row
  capChipsTop(){ return this.capTermBottom() + this.lc(0, 12) + this.lc(36, 0); }                     // + term margin + pill offset
  capY(){ return (this.capTermBottom() + (this.capChipsTop() - 36)) / 2 - (259 - this.df()); }                          // 0 → −89px
  /* Gone while the Loan-term row it would overlap is still visible: full at
     k=0, nothing past k=0.5 — so on a reversal it simply runs back. */
  capO(){ var t = Math.max(0, Math.min(1, 1 - 2 * this._mp)); return t * t * (3 - 2 * t); }
  mpAmt(){ return { height: this.lerp(259 - this.df(), 114) }; }
  /* ---- card geometry on the SAME progress --------------------------------
     These used to be ~20 separate Framer Motion springs (card left/right/height/
     padding/radius, divider, term row, pill row, each pill). Same stiffness, but
     each spring stops on its own rest threshold (0.5px for pixel values) while
     the amount — on the progress value, threshold 0.005 of the range — kept
     going: in the last ~100ms the card's padding snapped by up to 0.5px, then
     its left edge, then the amount settled, so the amount (which sits on that
     padding) stepped back and forth — the wobble at the end of both morphs.
     One progress → one curve → one rest point for everything. */
  mpCard(){ var c = this.cardSnap(); return {
    left: c.left, right: this.lc(0, 16), height: this.lc(624 + this.ex() - this.df() + this.sb(), 246),
    borderBottomLeftRadius: this.lc(0, 24), borderBottomRightRadius: this.lc(0, 24),
    paddingTop: c.padTop, paddingBottom: this.lc(32, 16), paddingLeft: c.padLeft, paddingRight: this.lc(24, 16)
  }; }
  /* Slider → divider → Loan-term row cascade top-down on the way in and
     bottom-up on the way out, each over a wide window instead of popping on a
     raw spring. With Smooth: in ≈ 80–240 / 105–270 / 125–330ms, out ≈ 20–125 /
     35–150 / 45–175ms (the spring is front-loaded, so exits come out quicker). */
  mpDivider(){ return { height: this.lc(0, 1), marginTop: this.lc(0, 16), marginBottom: this.lc(0, 15), opacity: this.win(0.40, 0.92), transform: this.resT() }; }
  mpTerm(){ return { height: this.lc(0, 20), marginBottom: this.lc(0, 12), opacity: this.win(0.50, 0.96), transform: this.resT() }; }
  mpSlider(){ var e = this.win(0.30, 0.88); return { opacity: e, transform: 'translateY(' + Math.round((1 - e) * this.mt().Y.block * 100) / 100 + 'px)', visibility: e > 0 ? 'visible' : 'hidden' }; }
  mpBottom(){ return { height: this.lc(333 + this.ex() + this.sb(), 36) }; }
  mpChips(){ return { top: this.lc(36, 0), height: this.lc(41, 36), transform: this.resT() }; }
  mpChip(){ return { height: this.lc(41, 36) }; }
  mpGrad(){ return { opacity: this.bkv() }; }
  mpBar(bk){ return { background: 'linear-gradient(180deg, rgba(225,228,229,0) 0%, rgba(225,228,229,' + (0.2*bk).toFixed(3) + ') 20.19%, rgba(225,228,229,' + (0.4*bk).toFixed(3) + ') 100%)' }; }
  mpBtn(bk){ return { opacity: Math.min(1, bk * 1.45), transform: 'translateY(' + ((1 - bk) * this.mt().Y.block).toFixed(2) + 'px)' }; }
  ctaWanted(){ return this.state.phase === 'confirm' || this.bkv() > 0.01; }

  /* write a style patch exactly the way React would serialise it */
  static UNITLESS = { opacity:1, fontWeight:1, zIndex:1, flex:1, lineHeight:1 };
  put(name, patch){
    var n = this._r[name]; if (!n) return;
    var s = n.style;
    for (var k in patch) {
      var v = patch[k];
      s[k] = (typeof v === 'number' && v !== 0 && !Component.UNITLESS[k]) ? v + 'px' : ('' + v).trim();
    }
  }
  applyMp(){
    if (!this._flip) this._lk = this._mp;     // at rest / without motion: layout follows the progress
    this.put('label', this.mpLabel());
    this.applyLayout();
    this.put('caretFade', this.mpCaretFade());
    this.flipApply();
    this.put('range', this.mpRange()); this.put('amtBox', this.mpAmt());
    this.put('grad', this.mpGrad());
    this.put('card', this.mpCard()); this.put('divider', this.mpDivider()); this.put('term', this.mpTerm());
    this.put('bottom', this.mpBottom()); this.put('chips', this.mpChips()); this.put('slider', this.mpSlider());
    var ch = this.mpChip(); this.put('chip3', ch); this.put('chip6', ch); this.put('chip8', ch);
    if (!this._mpMV) this.put('cap', { transform: 'translateY(' + this.capY() + 'px)', opacity: this.capO(), visibility: this.capO() > 0 ? 'visible' : 'hidden' });
    if (this.ctaWanted() !== !!this._ctaShown) { this.setState({ ctaOn: (this.state.ctaOn || 0) + 1 }); return; }
    if (this._ctaShown) {
      var bk = this.bkv();
      this.put('bar', this.mpBar(bk)); this.put('btnWrap', this.mpBtn(bk));
      if (BLUR) for (var i = 0; i < 5; i++) { var b = this.pbBlur(10 * bk, i); this.put('pbc' + i, { backdropFilter: b, WebkitBackdropFilter: b }); }
    }
  }
  /* Motion values, created once motion has loaded (rerender-motion-value):
     _mpMV is the morph progress; _capY / _capO are derived from it in its change
     event (rerender-motion-value-event / rerender-use-transform) and bound to the
     caption's style, so Framer Motion writes them in the same frame's render step
     as transform + opacity — compositor-only, no React render, no layout. */
  mvs(){
    var fm = this.state.fm, self = this;
    if (!fm || !fm.motionValue) return false;
    if (!this._mpMV) {
      this._capY = fm.motionValue(this.capY());
      this._capO = fm.motionValue(this.capO());
      /* fully transparent → not painted at all: opacity 0 alone still leaves a
         paint chunk that nudges the raster of the pills around it */
      this._capV = fm.motionValue(this.capO() > 0 ? 'visible' : 'hidden');
      this._mpMV = fm.motionValue(this._mp);
      this._mpMV.on('change', function(v){
        self._mp = v;
        var o = self.capO();
        self._capY.set(self.capY()); self._capO.set(o); self._capV.set(o > 0 ? 'visible' : 'hidden');
        self.applyMp();
      });
    }
    return true;
  }
  /* amount row styles (layout part on _lk, paint part on _mp) */
  applyLayout(){
    this.put('row', this.mpRow()); this.put('peso', this.mpPeso()); this.put('num', this.mpNum());
    this.put('caret', this.mpCaret()); this.put('tail', this.mpTail()); this.put('dec', this.mpDec());
    this.put('editBox', this.mpEdit());
  }
  setMp(v){
    this._mp = v;
    if (this._mpMV) this._mpMV.set(v); else this.applyMp();
  }
  /* The amount morph rides the SAME spring as the card (this.spring() → FEEL
     Smooth / Snappy / Gentle), so container and type land together whatever the
     feel. Framer Motion animates the MotionValue and carries its velocity into
     a reversal — tapping back mid-morph turns around smoothly from where it is
     instead of restarting a fixed 420ms curve (spring-physics-based). */
  tweenMp(target){
    var self = this, fm = this.state.fm, from = this._mp, t0 = null, dur = 420;
    if (fm && fm.animate && this.mvs()) {
      /* caption gets its own compositor layer only while it moves (anim-will-change) */
      var cap = this._r.cap; if (cap) cap.style.willChange = 'transform, opacity';
      /* rest thresholds tightened for a 0→1 value: the one final snap moves
         nothing by more than ~0.4px (card bottom edge) / ~0.15px (the amount) */
      this.flipStart(this._mp, target);
      this._mpAnim = fm.animate(this._mpMV, target, Object.assign({}, this.spring(), { restDelta: 0.001, restSpeed: 0.01 }, {
        onComplete: function(){
          self._mpAnim = null; self._mp = target; self.flipEnd(); self.applyMp();
          if (self._r.cap) self._r.cap.style.willChange = '';
          self.setState({ morph:false });
        }
      }));
      return;
    }
    /* fallback before motion has loaded: the original eased tween */
    if (this._mpStep) cancelAnimationFrame(this._mpStep);
    var req = requestAnimationFrame;
    var step = function(now){
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      if (p < 1) { self.setMp(from + (target - from) * e); self._mpStep = req(step); }
      else { self._mpStep = null; self.setMp(target); self.setState({ morph:false }); }
    };
    this._mpStep = req(step);
  }
  goPhase(p){
    var self = this;
    /* coming back to edit: the keypad returns by rows, fast (REVEAL_ROW) */
    if (p === 'enter') this._padQuick = true;
    this.setState({ morph:true });
    requestAnimationFrame(function(){
      self.setState({ phase:p });
      self.tweenMp(p === 'confirm' ? 1 : 0);
    });
  }
  pickTerm(t){
    if (this.state.phase === 'enter') { this.setState({ term:t }); this.goPhase('confirm'); }
    else this.setState({ term:t });
  }
  slide(e){
    var r = e.currentTarget.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    this.setState({ amt: String(Math.round((500 + p * 49500) / 100)) });
  }

  /* ---------------- HOME : hero card with the morphing pill ---------------- */
  /* ---------------- HOME : the available-amount card (Figma: PeraSure design system, node 9867:36981) ----------------
     Available amount, a two-line legend (total credit, temporary credit) and a credit bar, then the Withdraw pill.
     The bar is the total credit: white = long-term credit still available, green (right after it) = temporary credit
     still available, the dark rest = used. The temporary amount is the temporary credit left; it is part of the
     available amount, the rest of which is long-term credit. */
  creditBar(){
    var T = window.WD_TUNE || {}, num = function(v, d){ v = Number(v); return isFinite(v) ? v : d; };
    var total = Math.max(1, num(T.total != null ? T.total : this.props.totalBalance, 50000));
    var avail = Math.max(0, Math.min(total, num(T.available != null ? T.available : this.props.availableAmount, 40000)));
    var temp = Math.max(0, Math.min(total, num(T.temporary != null ? T.temporary : this.props.temporaryAmount, 10000)));
    var tempLeft = Math.min(temp, avail);                    /* temporary credit left (part of the available amount) */
    var longLeft = avail - tempLeft;
    return { total:total, avail:avail, temp:temp, white:longLeft / total, green:(longLeft + tempLeft) / total,
             till:(T.till != null ? T.till : this.props.temporaryValidTill) || 'Nov 20' };
  }
  /* ---------------- Credit limit intro → home (with-credit-limit.html) ----------------
     The same interaction as picking a term in "Apply a loan" (the full page closes in to the order card), built the same
     way: ONE progress 0→1 in a Motion value, animated with this.spring() and the same rest thresholds as tweenMp(); its
     change event writes every affected style straight to the DOM (no React renders), with the same windows (win) and
     travel distances (MT.Y) the sheet's morph uses.
       · the Credit limit screen (intro.js's frame, full screen, above the page) closes its edges in to this card's exact box,
         corners rounding to 24, its colour turning from the dark to the card's blue (the frame's own page turns see-through
         so that colour shows); nothing of it is cut by the closing edges: its number block leaves with the number (same
         path, shrinking to the card's scale) and fades out softly, its artwork travels with the box — the four stars and
         the coins move up to the same relative spot inside it and shrink — the coins fading first, then the stars;
       · the card itself is lifted above that screen for the length of the exit, with no background of its own: the closing
         screen IS its background; at rest the card takes the colour back and the screen is removed — nothing fades over;
       · the card's amount is the big number: the real amount element starts at the big number's place and size (it lies
         inside the card's box, so nothing clips it) and settles on the progress; the decimals fade in on the way;
       · the card's content is cut to the closing box (not to the card's final edges), so what sits on the card's bottom rides
         the box's bottom edge: the Withdraw pill comes in halfway through and moves up with that edge until the end, and the
         glow under it brightens slowly from halfway, always at the bottom;
       · the rest of the card comes in on windows of the same progress, early enough to overlap what is leaving (the card is
         never empty), each rising its MT.Y distance and coming into focus from a slight blur: label and info, the two legend
         rows, the bar (its track, then its fills revealed left to right), and last the card's shadow;
       · the cards below rise in one after another, then the tab bar (static markup, styled the same way).
     Returns false (intro.js then runs its own simpler exit) if Motion or the card is not there yet. */
  introExit(o){
    var self = this, fm = this.state.fm, MT = this.mt(), R = this._r, card = R.hc, amt = R.hcAmt;
    if (!fm || !fm.animate || !fm.motionValue || !card || !amt) return false;
    var box = o.box, f = o.iframe, src = o.src;
    /* measure everything first */
    var B = box.getBoundingClientRect(), CR = card.getBoundingClientRect();
    var to = { t:CR.top - B.top, r:B.right - CR.right, b:B.bottom - CR.bottom, l:CR.left - B.left };
    var ar = amt.getBoundingClientRect(), p0 = amt.children[0].getBoundingClientRect(), p1 = amt.children[1].getBoundingClientRect();
    var s0 = src && src.size ? src.size / 36 : 1;                        /* the card's amount is 36px */
    var mx = (p0.left + p1.right) / 2 - ar.left, my = (p0.top + p0.bottom) / 2 - ar.top;   /* "₱40,000" without the decimals */
    /* the big number is set tighter (−0.02em) and slightly off-white: the card's amount starts with the same tracking and
       colour and turns into its own on the progress; its centre follows a straight line from the big number's centre to
       its resting place, the tracking change included (letter-spacing adds after every glyph) */
    var pS = amt.children[0], dS = amt.children[1], nD = (dS.textContent || '').length;
    var lsP1 = parseFloat(pS.style.letterSpacing) || 0, lsD1 = parseFloat(dS.style.letterSpacing) || 0, ls0 = -0.02 * 36;
    var from = src ? { x:src.x, y:src.y } : { x:ar.left + mx, y:ar.top + my }, toC = { x:ar.left + mx, y:ar.top + my };
    var srcColor = (src && src.color) || '#ffffff';
    /* every style touched is saved and put back exactly at rest (React's own inline values included) */
    var touched = [];
    var set = function(el, prop, val){
      if (!el) return;
      if (!el.__iv) { el.__iv = {}; touched.push(el); }
      if (!(prop in el.__iv)) el.__iv[prop] = el.style[prop];
      el.style[prop] = val;
    };
    var base = function(el){ var v = el && el.__iv && el.__iv.opacity; return v === undefined || v === '' ? 1 : parseFloat(v); };
    var mixHex = function(a, b, k){
      var h = function(c){ return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }, x = h(a), y = h(b);
      k = Math.max(0, Math.min(1, k));
      return 'rgb(' + x.map(function(c, i){ return Math.round(c + (y[i] - c) * k); }).join(',') + ')';
    };
    var win = function(k, a, b){ var t = Math.max(0, Math.min(1, (k - a) / (b - a))); return t * t * (3 - 2 * t); };
    var r3 = function(v){ return Math.round(v * 1000) / 1000; };
    /* the page around the card */
    var frame = document.querySelector('.ps-frame');
    var items = [].slice.call(document.querySelectorAll('.ps-home-in > *')).filter(function(el){ return !el.contains(card); });
    var logo = document.querySelector('img[alt="PeraSure"]'), head = logo && logo.parentElement && logo.parentElement.parentElement;
    var bar = document.querySelector('.ps-tabbar');
    var rise = items.concat(bar ? [bar] : []);
    /* what sits below the card is under the closing box until its bottom edge reaches the card: it rides that edge up
       (pushed, like the pill and the glow), so nothing below is ever cut by the box or appears behind it */
    var below = rise.map(function(el){ return el !== bar && el.getBoundingClientRect().top >= CR.bottom - 1; });
    var ah = ar.height;
    var GR = R.hcGlow ? R.hcGlow.getBoundingClientRect() : null;               /* the glow, measured untransformed-ish */
    var gb = GR ? r3(Math.max(0, GR.bottom - CR.bottom)) : 0, gx = GR ? r3(Math.max(0, (GR.width - CR.width) / 2)) : 0;                                                   /* the amount's box, for the push below it */
    /* the Credit limit page inside the frame: see-through from now on (the closing box's colour is its background). Nothing
       of it is cut by the closing edges: its number block leaves WITH the number (same path, shrinking to the card's scale)
       and fades out softly (blur); its artwork (coins and stars) travels with the box — its centre to the same relative
       spot inside it — and shrinks, the coins fading first, the stars a little later. The frame is removed afterwards. */
    var fd = null, fHero = null, fArt = null, fStars = null, fCanvases = [], artM = null;
    try { fd = f && f.contentDocument; } catch (e) {}
    if (fd) {
      var st = fd.createElement('style');
      st.textContent = ':root{color-scheme:normal!important}html,body,main{background:transparent!important}';
      fd.head.appendChild(st); f.style.background = 'transparent';
      var fr = f.getBoundingClientRect();
      fHero = fd.getElementById('hero'); fArt = fd.getElementById('art'); fStars = fd.getElementById('artStars');
      fCanvases = [fd.getElementById('cvBack'), fd.getElementById('cvFront')].filter(Boolean);
      if (fHero && src) {
        var hr = fHero.getBoundingClientRect();
        fHero.style.transformOrigin = r3(from.x - fr.left - hr.left) + 'px ' + r3(from.y - fr.top - hr.top) + 'px';   /* the number's centre */
        fHero.style.willChange = 'transform, opacity, filter';
      } else fHero = null;
      if (fArt) {
        var rr = fArt.getBoundingClientRect(), W = B.width, H = B.height;
        artM = { ax:fr.left + rr.left + rr.width / 2, ay:fr.top + rr.top + rr.height / 2, sx:(W - to.l - to.r) / W, sy:(H - to.t - to.b) / H };
        fArt.style.transformOrigin = '50% 50%'; fArt.style.willChange = 'transform';
      }
    }
    /* start: the card above the closing screen, see-through and cut to the closing box (not to its own edges); the big
       number handed to the card's amount */
    set(card, 'zIndex', '101'); set(card, 'backgroundColor', 'transparent'); set(card, 'boxShadow', 'none');
    set(card, 'overflow', 'visible');
    set(amt, 'transformOrigin', '0 0'); set(amt, 'willChange', 'transform');
    set(box, 'willChange', 'clip-path');
    if (src && src.el) src.el.style.visibility = 'hidden';
    var SHA = [[0, 0, 2, 0, 0.16], [0, 4, 12, 0, 0.08]];               /* this.SH.card, by layer: x y blur spread alpha */
    var apply = function(k){
      var c = Math.max(0, Math.min(1, k));
      /* the screen's edges close in to the card; corners round; dark → the card's blue */
      box.style.clipPath = 'inset(' + r3(to.t * c) + 'px ' + r3(to.r * c) + 'px ' + r3(to.b * c) + 'px ' + r3(to.l * c) + 'px round ' + r3(24 * c) + 'px)';
      box.style.backgroundColor = mixHex('#0d1620', self.C.blue, win(k, 0.15, 0.85));
      /* the number's path (the card's amount and the Credit limit number block share it) */
      var sc = s0 + (1 - s0) * k, cx = from.x + (toC.x - from.x) * k, cy = from.y + (toC.y - from.y) * k;
      /* inside the frame: the number block leaves with the number, shrinking to the card's scale, fading out softly */
      if (fHero) {
        var fe = win(k, 0, 0.5);
        fHero.style.transform = 'translate(' + r3(cx - from.x) + 'px,' + r3(cy - from.y) + 'px) scale(' + r3(1 + (1 / s0 - 1) * k) + ')';
        fHero.style.opacity = r3(1 - fe); fHero.style.filter = 'blur(' + r3(fe * 4) + 'px)';
      }
      /* its artwork travels with the box (centre to the same relative spot) and shrinks; coins fade first, then the stars */
      if (artM) fArt.style.transform = 'translate(' + r3((artM.ax * (artM.sx - 1) + to.l) * c) + 'px,' + r3((artM.ay * (artM.sy - 1) + to.t) * c) + 'px) scale(' + r3(1 - 0.4 * c) + ')';
      var ce = win(k, 0, 0.45);                                           /* coins: out of focus as they go (no muddy half-fade) */
      fCanvases.forEach(function(cv){ cv.style.opacity = r3(1 - ce); cv.style.filter = ce > 0 && ce < 1 ? 'blur(' + r3(ce * 6) + 'px)' : ''; });
      if (fStars) fStars.style.opacity = r3(1 - win(k, 0.35, 0.8));
      /* the card itself is never clipped during the exit: iOS Safari drops the pill's frosted backdrop-filter inside a
         clipped parent, so the glow showed through the pill until the clip came off at the end. Everything in the card
         stays inside the closing box anyway, except the glow, which is cut to that box on its own (below). */
      var u = 1 - c;
      /* the amount settles from the big number (follows the spring exactly, like the sheet's lerp) */
      var lsP = ls0 + (lsP1 - ls0) * k, lsD = ls0 + (lsD1 - ls0) * k;
      set(pS, 'letterSpacing', r3(lsP) + 'px'); set(dS, 'letterSpacing', r3(lsD) + 'px');
      var mxk = mx + ((lsP - lsP1) + (lsD - lsD1) * nD) / 2;
      set(amt, 'transform', 'translate(' + r3(cx - ar.left - sc * mxk) + 'px,' + r3(cy - ar.top - sc * my) + 'px) scale(' + r3(sc) + ')');
      set(amt, 'color', mixHex(srcColor, '#ffffff', c));
      set(R.hcDec, 'opacity', r3(win(k, 0.3, 0.75)));
      /* the rest of the card, on windows of the same progress — early enough to overlap what is leaving (no empty card),
         each rising its MT.Y distance and coming into focus (a little blur smooths the crossfade) */
      /* while the amount is still larger than its own size it takes more room: what is under it makes way (the amount's
         bottom edge beyond its resting one), as a layout change would, so the legend never runs into the digits */
      var push = Math.max(0, (cy - sc * my + sc * ah) - (toC.y - my + ah));
      var inn = function(el, a, b, dy, keepBase, py){
        if (!el) return;
        var e = win(k, a, b);
        set(el, 'opacity', r3((keepBase ? base(el) : 1) * e));
        if (dy || py) set(el, 'transform', 'translateY(' + r3((1 - e) * dy + (py || 0)) + 'px)');
        set(el, 'filter', e >= 1 ? '' : 'blur(' + r3((1 - e) * 3) + 'px)');
      };
      inn(R.hcLabel, 0.2, 0.62, MT.Y.text, true);
      inn(R.hcInfo, 0.3, 0.7, 0);
      inn(R.hcLeg0, 0.3, 0.72, MT.Y.text, false, push);
      inn(R.hcLeg1, 0.36, 0.78, MT.Y.text, false, push);
      set(R.hcBar, 'opacity', r3(win(k, 0.38, 0.76))); set(R.hcBar, 'transform', 'translateY(' + r3(push) + 'px)');
      set(R.hcFill, 'clipPath', 'inset(0px ' + r3((1 - win(k, 0.42, 0.95)) * 100) + '% 0px 0px)');
      /* on the box's bottom edge: the pill comes in as the edge passes halfway and rides it up; the glow brightens with it */
      var down = r3(to.b * u);
      set(R.hcPill, 'opacity', r3(win(k, 0.38, 0.58))); set(R.hcPill, 'transform', 'translateY(' + down + 'px)');
      set(R.hcGlow, 'opacity', r3(win(k, 0.38, 1))); set(R.hcGlow, 'transform', 'translateX(-50%) translateY(' + down + 'px)');
      /* the glow cut to the box's bottom and side edges (at rest the card's own overflow does it: same edges at k = 1) */
      set(R.hcGlow, 'clipPath', 'inset(0px ' + r3(Math.max(0, gx - to.r * u)) + 'px ' + gb + 'px ' + r3(Math.max(0, gx - to.l * u)) + 'px round 0px 0px ' + r3(24 * c) + 'px ' + r3(24 * c) + 'px)');
      var a = win(k, 0.65, 1);
      set(card, 'boxShadow', SHA.map(function(L){ return L[0] + 'px ' + L[1] + 'px ' + L[2] + 'px ' + L[3] + 'px rgba(0,1,40,' + r3(L[4] * a) + ')'; }).join(', '));
      /* around it */
      /* the logo row rides the top edge down the same way (never cut by it) */
      if (head) { set(head, 'opacity', r3(win(k, 0.15, 0.6))); set(head, 'transform', 'translateY(' + r3(-to.t * u) + 'px)'); }
      rise.forEach(function(el, i){
        /* the floating tab bar settles first, so the content riding up passes under a solid bar, not through it */
        var e2 = el === bar ? win(k, 0.3, 0.6) : win(k, 0.25 + i * 0.07, 0.7 + i * 0.07);
        set(el, 'opacity', r3(e2));
        set(el, 'transform', 'translateY(' + r3((1 - e2) * (el === bar ? MT.Y.block : MT.Y.block * 1.6) + (below[i] ? to.b * u : 0)) + 'px)');
      });
    };
    apply(0);
    var mv = fm.motionValue(0), off = mv.on('change', apply);
    if (frame) frame.style.willChange = '';
    fm.animate(mv, 1, Object.assign({}, this.spring(), { restDelta: 0.001, restSpeed: 0.01,
      onComplete: function(){
        apply(1); off();
        /* at rest: the card takes its colour back the same frame the screen goes (identical blue, identical box) */
        touched.forEach(function(el){ for (var p in el.__iv) el.style[p] = el.__iv[p]; delete el.__iv; });
        box.style.clipPath = ''; box.style.willChange = '';
        if (o.done) o.done();
      }
    }));
    return true;
  }

  hero(){
    var C = this.C, MT = this.mt(), open = this.state.pillOpen, avail = this.available();
    var tap = () => {
      if (avail) {
        if (this._mpStep) { cancelAnimationFrame(this._mpStep); this._mpStep = null; }
        if (this._mpAnim) { this._mpAnim.stop(); this._mpAnim = null; }
        this.flipEnd(); this._lk = 0;
        this._padQuick = false;
        /* digits on screen when the sheet opens are the value, not typing */
        this._born = {}; this._freshSheet = true;
        this._mp = 0; if (this._mpMV) this._mpMV.jump(0);
        this.setState({ screen:'loan', phase:'enter', term:null, pillOpen:false, morph:false });
      }
      else this.setState({ pillOpen: !this.state.pillOpen });
    };
    var dim = { color:'#ffffff', opacity:0.6 };
    var B = this.creditBar(), W = 304;                        /* the bar's width: the card's inner width */
    var availStr = this.money(B.avail, 2).split('.');
    var img = (src, w, h, style) => React.createElement('img', { src:src, alt:'', width:w, height:h, draggable:false,
      style:Object.assign({ display:'block', maxWidth:'none', width:w, height:h }, style || {}) });
    var legend = (key, dot, text, ref) => React.createElement('div', { key:key, ref:this.ref(ref), style:{ display:'flex', flexDirection:'row', gap:4, alignItems:'center', flex:'none' } }, [
      React.createElement('span', { key:'d', style:{ width:6, height:6, flex:'none', display:'block' } }, img(dot, 6, 6)),
      this.sp(text, Object.assign({ flex:'1 1 auto', minWidth:0, fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:12, lineHeight:'16px' }, dim), { key:'t' })
    ]);
    /* the bar (Figma node 9867:36993): white then green side by side, each as long as its share of the total credit.
       The white one overlaps the green by 4px (margin -4, drawn on top) so its rounded end leaves no gap; the green one
       is 4px longer to make up for it, so the green that shows is exactly its share. */
    var wW = B.white * W, gW = (B.green - B.white) * W, OV = wW > 0 && gW > 0 ? 4 : 0;
    var seg = (key, w, z, mr, color, shadow) => React.createElement('div', { key:key, style:{
      position:'relative', flex:'none', height:8, width:Math.round(w * 100) / 100, marginRight:mr, zIndex:z,
      borderRadius:'0 999px 999px 0', backgroundColor:color, boxShadow:shadow } });

    var pill = this.el('div', Object.assign({
      ref: this.ref('hcPill'),
      onClick: tap,
      whileTap: { scale: open ? 0.99 : 0.98 },
      transition: MT.PRESS
    }, this.mo({
      position:'relative', zIndex:1, alignSelf:'stretch', flex:'none', boxSizing:'border-box',
      overflow:'hidden', cursor:'pointer', backgroundColor:'rgba(0,1,40,0.3)',
      backdropFilter:'blur(5px)', WebkitBackdropFilter:'blur(5px)'
    }, {
      height: open ? 58 : 46,
      borderRadius: open ? 16 : 999,
      boxShadow: open ? this.SH.glowOff : this.SH.glow
    })), [
      this.ap({ key:'ap', initial:false }, [
        open
          ? this.fade('msg', MT.Y.text, {
              position:'absolute', left:12, right:12, top:12, display:'flex', flexDirection:'row', gap:8, alignItems:'flex-start', color:'#ffffff'
            }, [
              React.createElement('span', { key:'i', style:{ display:'inline-flex', flex:'none', marginTop:1 } }, this.ic('alert', 16, '#ffffff', 1.6)),
              this.sp(this.props.unavailableMessage || 'Withdrawals are temporarily unavailable. You can try again after Sep 28.',
                { flex:'1 1 auto', fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:12, lineHeight:'16px', color:'#ffffff' }, { key:'t' })
            ])
          : this.fade('cta', MT.Y.text, {
              position:'absolute', left:0, right:0, top:0, bottom:0, display:'flex', flexDirection:'row', gap:4, alignItems:'center', justifyContent:'center'
            }, this.sp('Withdraw', { fontFamily:"'Hanken Grotesk', sans-serif", fontWeight:600, fontSize:16, lineHeight:'22px', color:'#ffffff' }))
      ])
    ]);

    return this.el('div', Object.assign({ key:'hero', ref:this.ref('hc') }, this.mo({
      position:'relative', boxSizing:'border-box', overflow:'hidden', borderRadius:24,
      backgroundColor:C.blue, boxShadow:this.SH.card, padding:12, display:'flex',
      flexDirection:'column', gap:16, justifyContent:'flex-end', flex:'none'
    }, { height: open ? 208 : 196 })), [
      /* the glow under the Withdraw pill (Figma asset), anchored to the card's bottom so it follows the pill. Explicit layers
         (glow 0, pill 1): while the intro's exit moves and fades both, iOS Safari otherwise drew the glow over the pill */
      React.createElement('div', { key:'glow', ref:this.ref('hcGlow'), style:{ position:'absolute', zIndex:0, left:'calc(50% - 0.5px)', bottom:-63, width:411, height:109,
        transform:'translateX(-50%)', pointerEvents:'none' } },
        React.createElement('div', { style:{ position:'absolute', top:'-31.47%', bottom:'-31.47%', left:'-8.35%', right:'-8.35%' } },
          img('assets/card-glow.svg', '100%', '100%'))),

      React.createElement('div', { key:'body', style:{ position:'relative', display:'flex', flexDirection:'column', gap:8, flex:'none' } }, [
        React.createElement('div', { key:'top', style:{ display:'flex', flexDirection:'row', gap:12, alignItems:'flex-start', padding:'0 4px' } }, [
          React.createElement('div', { key:'amt', style:{ flex:'1 1 auto', minWidth:0, display:'flex', flexDirection:'column', gap:2, whiteSpace:'nowrap' } }, [
            this.sp('Available amount', Object.assign({ fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:11, lineHeight:'14px' }, dim), { key:'a', ref:this.ref('hcLabel') }),
            /* Satoshi Bold; ₱ falls back to Inter, as in the app */
            React.createElement('div', { key:'b', 'data-wd-amount':'1', ref:this.ref('hcAmt'), style:{ display:'flex', flexDirection:'row', alignItems:'baseline', color:'#ffffff', fontFamily:'Satoshi, Inter, sans-serif', fontWeight:700, lineHeight:1 } }, [
              this.sp(availStr[0].charAt(0), { fontSize:36, lineHeight:1, letterSpacing:'0.72px' }, { key:'p' }),
              this.sp(availStr[0].slice(1), { fontSize:36, lineHeight:1, letterSpacing:'1.08px' }, { key:'x' }),
              this.sp('.' + availStr[1], { fontSize:16, lineHeight:1, letterSpacing:'0.48px' }, { key:'y', ref:this.ref('hcDec') })
            ])
          ]),
          React.createElement('span', { key:'info', ref:this.ref('hcInfo'), style:{ width:20, height:20, flex:'none', display:'block' } }, img('assets/icon-info-circle.svg', 20, 20))
        ]),
        React.createElement('div', { key:'slider', style:{ display:'flex', flexDirection:'column', gap:8 } }, [
          React.createElement('div', { key:'legend', style:{ display:'flex', flexDirection:'column', gap:2 } }, [
            legend('total', 'assets/dot-total-credit.svg', 'Total credit: ' + this.money(B.total, 0), 'hcLeg0'),
            legend('temp', 'assets/dot-temporary.svg', 'Temporary: ' + this.money(B.temp, 0) + ' (Incl. valid till ' + B.till + ')', 'hcLeg1')
          ]),
          React.createElement('div', { key:'bar', ref:this.ref('hcBar'), style:{ position:'relative', isolation:'isolate', height:8,
            borderRadius:999, overflow:'hidden', backgroundColor:'rgba(0,1,40,0.3)' } },
            /* the two fills in their own row (the Credit limit intro reveals it left to right) */
            React.createElement('div', { ref:this.ref('hcFill'), style:{ position:'absolute', left:0, top:0, right:0, bottom:0, display:'flex', alignItems:'center' } }, [
              wW > 0 ? seg('long', wW, 2, -OV, '#ffffff', '0px 0px 4px 0px rgba(0,1,40,0.16), 0px 8px 32px 0px rgba(0,1,40,0.12)') : null,
              gW > 0 ? seg('temp', gW + OV, 1, 0, '#58e09a', '0px 0px 2px 0px rgba(0,1,40,0.16), 0px 4px 12px 0px rgba(0,1,40,0.08)') : null
            ]))
        ])
      ]),

      pill
    ]);
  }

  /* ---------------- LOAN : one page, enter-amount ⇄ order-confirm ---------------- */
  chipRow(){
    var C = this.C, MT = this.mt(), cf = this.state.phase === 'confirm';
    return React.createElement('div', { key:'chips', ref:this.ref('chips'), style:Object.assign({
      position:'absolute', left:0, right:0, display:'flex', flexDirection:'row', gap:8
    }, this.mpChips()) },
      [3,6,8].map((t) => {
        var on = this.state.term === t;
        /* height rides the morph progress; only the selection colours keep their
           own 150ms tween */
        return this.el('div', Object.assign({
          key:'t'+t, ref:this.ref('chip'+t), onClick: () => this.pickTerm(t), whileTap:{ scale:0.96 }
        }, this.mo(Object.assign({
          flex:'1 1 0', boxSizing:'border-box', borderRadius:16, borderStyle:'solid', borderWidth:1.5,
          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
          fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:14, lineHeight:'20px'
        }, this.mpChip()), {
          borderColor: on ? '#c8deff' : C.line,
          backgroundColor: on ? C.blue50 : 'rgba(255,255,255,0)',
          color: on ? C.blue : C.sub
        }, { duration:0.15 })), t + ' Terms');
      })
    );
  }
  keypad(){
    var C = this.C, MT = this.mt(), quick = !!this._padQuick && !!MT.REVEAL_ROW;
    var keys = ['1','2','3','4','5','6','7','8','9','*','0','del'];
    return this.el('div', {
      key:'pad',
      initial:{ opacity:0 }, animate:{ opacity:1, transition:{ duration:0.2 } },
      exit:{ opacity:0, y:-MT.Y.block, transition:MT.LEAVE },
      style:{ position:'absolute', left:'50%', width:312, marginLeft:-156, top:360 + this.ex() - this.df(), height:232, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gridTemplateRows:'52px 52px 52px 52px', gap:'8px' }
    }, keys.map((k, i) => {
      /* first open: the full key-by-key cascade; back from confirm: by rows */
      var R = quick ? MT.REVEAL_ROW(Math.floor(i / 3)) : MT.REVEAL(i), I = R.initial || {};
      /* The cascade runs while the sheet is still sliding in. With y / scale as
         separate values it ran on the main thread and re-rasterised the sliding
         sheet every frame; as one `transform` string (+ opacity) Framer Motion
         hands it to the compositor (WAAPI) — anim-hardware-acceleration. The press
         feedback stays on an inner node (whileTap's scale would fight the string). */
      var T0 = 'translateY(' + (I.y || 0) + 'px) scale(' + (I.scale == null ? 1 : I.scale) + ')';
      return this.el('div', {
        key:'k'+k,
        initial: I.opacity == null ? false : { opacity: I.opacity, transform: T0 },
        animate: { opacity: k==='*' ? 0.4 : 1, transform: 'translateY(0px) scale(1)', transition: R.transition },
        style:{ display:'flex' }
      }, this.el('div', {
        key:'b', onClick: () => this.press(k), whileTap:{ scale:0.94, backgroundColor:C.line },
        style:{ flex:'1 1 auto', borderRadius:16, backgroundColor:C.page, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:C.ink, fontFamily:"'Hanken Grotesk', sans-serif", fontWeight:700, fontSize:20, lineHeight:'28px', letterSpacing:'-0.01em' }
      }, k === 'del' ? this.icf('delFill', 24, C.ink) : k));
    }));
  }
  amountBlock(){
    var C = this.C, MT = this.mt(), cf = this.state.phase === 'confirm';
    var pct = Math.min(1, Math.max(0, (this.amount() - 500) / 49500));


    var label = this.el('div', Object.assign({ key:'label', ref:this.ref('label') }, this.an(Object.assign({
      position:'absolute', left:0, right:0, height:20, top:32
    }, this.mpLabel(), {
      fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.sub
    }), {})), 'Disbursement amount');

    var row = React.createElement('div', {
      key:'row', ref:this.ref('row'), onClick: () => { if (cf) this.goPhase('enter'); },
      style:Object.assign({ position:'absolute', left:0, top:68 }, this.mpRow(), { display:'flex', flexDirection:'row', alignItems:'flex-end' })
    }, [
      this.el('span', Object.assign({ key:'peso', ref:this.ref('peso') }, this.an(Object.assign({
        fontFamily:'Satoshi, Inter, sans-serif', whiteSpace:'nowrap'
      }, this.mpPeso()), {})), this.glyph('p', '₱')),
      this.el('span', Object.assign({ key:'num', ref:this.ref('num') }, this.an((() => { var s = this.mpNum(); return {
        fontFamily:'Satoshi, Inter, sans-serif', whiteSpace:'nowrap',
        position:'relative', display:'inline-flex', flexDirection:'row', alignItems:'center', fontWeight:700,
        fontSize: s.fontSize, lineHeight: s.lineHeight, height: s.height, letterSpacing: s.letterSpacing,
        color: s.color
      }; })(), {})), [
        /* Each digit decides ONCE, when it first appears, whether it gets the typing
           entrance: typed on the keypad → entrance; changed by the slider, or
           already there when the sheet opens → no animation at all, it is just
           the new value. That choice never flips with the phase, so nothing
           replays on a morph either way.
           No AnimatePresence here: the exit was instant anyway, and with
           popLayout + a 0s exit the removed digits were never cleaned up — every
           slider step left invisible ghost spans behind. */
        (() => {
          var born = this._born || (this._born = {}), live = {}, fresh = this._freshSheet;
          this._freshSheet = false;
          var out = this.chars().map((c) => {
            if (born[c.key] === undefined) born[c.key] = (fresh || cf) ? 'still' : 'typed';
            live[c.key] = 1;
            var still = born[c.key] === 'still';
            return this.el('span', {
          key: c.key,
          layout: (this.state.morph || cf) ? false : 'position', layoutDependency: this.state.amt,
          initial: still ? false : Component.DIGIT_IN.initial,
          animate: still ? Component.DIGIT_STILL : Component.DIGIT_IN.animate,
          style: { display:'inline-block', whiteSpace:'pre' }
        }, this.glyph('c:' + c.key, c.ch));
          });
          for (var k in born) if (!live[k]) delete born[k];
          return out;
        })(),
        (() => { var s = this.mpCaret(); return this.el('div', {
          key:'caret', ref:this.ref('caret'), layout: (this.state.morph || cf) ? false : 'position', layoutDependency: this.state.amt,
          style:{ width: s.width, height: s.height, marginLeft: s.marginLeft, flex:'none' }
        }, React.createElement('div', { ref:this.ref('caretFade'), style:Object.assign({ width:'100%', height:'100%' }, this.mpCaretFade()) },
          React.createElement('div', { style:{ width:'100%', height:'100%', backgroundColor:C.blue500, animation:'psBlink 1s step-end infinite' } }, null))); })(),
        this.el('span', Object.assign({ key:'tail', ref:this.ref('tail'), layout: (this.state.morph || cf) ? false : 'position', layoutDependency: this.state.amt }, this.an(Object.assign({
          flex:'none', whiteSpace:'pre'
        }, this.mpTail()), {})), [this.glyph('t:0', '0'), this.glyph('t:1', '0')].map((g, i) => React.cloneElement(g, { key: 't' + i })))
      ]),
      this.el('span', Object.assign({ key:'dec', ref:this.ref('dec'), layout: (this.state.morph || cf) ? false : 'position', layoutDependency: this.state.amt }, this.an(Object.assign({
        fontFamily:'Satoshi, Inter, sans-serif', whiteSpace:'nowrap', flex:'none', fontWeight:700, alignSelf:'flex-end'
      }, this.mpDec()), {})), [this.glyph('x:0', '.', Component.GLYPH_DOT), this.glyph('x:1', '0'), this.glyph('x:2', '0')].map((g, i) => React.cloneElement(g, { key: 'x' + i }))),
      (() => { var s = this.mpEdit(); return React.createElement('div', {
          key:'editBox', ref:this.ref('editBox'),
          style:{ width:s.width, height:28, paddingTop:8, boxSizing:'border-box', flex:'none', color:C.blue, cursor:'pointer', alignSelf:'flex-end', marginLeft:s.marginLeft }
        }, this.el('div', {
          key:'edit', ref:this.ref('edit'), initial:false,
          animate: cf ? { opacity:1, x:0, scale:1, transition: MT.LAYER_IN } : { opacity:0, x:-5, scale:0.82, transition: MT.LAYER_OUT },
          style:{ transformOrigin:'left center', opacity: this.state.fm ? undefined : (cf ? 1 : 0) }
        }, this.gs('edit', 20))); })()
    ]);

    var range = this.el('div', Object.assign({ key:'range', ref:this.ref('range') }, this.an(Object.assign({ position:'absolute', left:0, right:0, top:196 }, this.mpRange()), {})), [
      /* always mounted; opacity / rise / visibility come from the progress (mpSlider) */
      [
          React.createElement('div', { key:'slider', ref:this.ref('slider'), 'aria-hidden': !cf, style:Object.assign({ position:'absolute', left:0, right:0, top:0 }, this.mpSlider()) }, [
              React.createElement('div', {
                key:'track',
                onPointerDown:(e) => { e.currentTarget.setPointerCapture(e.pointerId); this.slide(e); },
                onPointerMove:(e) => { if (e.buttons) this.slide(e); },
                style:{ position:'relative', height:25, cursor:'pointer', touchAction:'none' }
              }, [
                React.createElement('div', { key:'bg', style:{ position:'absolute', left:0, right:0, top:6, height:8, borderRadius:999, backgroundColor:C.page } }, null),
                React.createElement('div', { key:'fg', style:{ position:'absolute', left:0, top:6, height:8, width:(pct*100)+'%', borderRadius:999, backgroundColor:C.blue500 } }, null),
                React.createElement('div', { key:'knob', style:{ position:'absolute', left:'calc('+(pct*100)+'% - 9px)', top:1, width:18, height:18, borderRadius:'50%', backgroundColor:'#ffffff', boxShadow:'0px 8px 32px 0px rgba(7,20,60,0.12), 0px 0px 4px 0px rgba(7,20,60,0.16)', display:'flex', alignItems:'center', justifyContent:'center' } },
                  React.createElement('div', { style:{ width:12, height:12, borderRadius:'50%', backgroundColor:C.blue500 } }, null))
              ]),
              React.createElement('div', { key:'lab', style:{ marginTop:2, height:15, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center' } }, [
                this.sp('₱500', { fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:12, lineHeight:'15px', color:C.mute }, { key:'a' }),
                this.sp('₱50,000', { fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:12, lineHeight:'15px', color:C.mute }, { key:'b' })
              ])
            ])
      ]
    ]);

    return React.createElement('div', { key:'amt', ref:this.ref('amtBox'), style:Object.assign({ position:'relative', alignSelf:'stretch', flex:'none' }, this.mpAmt()) }, [label, row, range]);
  }
  drow(label, value, color, key){
    var C = this.C;
    return React.createElement('div', { key:key, style:{ height:20, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center' } }, [
      this.sp(label, { fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.sub }, { key:'l' }),
      this.sp(value, { fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color: color || C.ink }, { key:'v' })
    ]);
  }
  hr(key){ return React.createElement('div', { key:key, style:{ height:1, backgroundColor:this.C.line } }, null); }
  sectionLabel(text, key){
    return React.createElement('div', { key:key, style:{ height:16, padding:'0 12px', display:'flex', alignItems:'center' } },
      this.sp(text, { fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:12, lineHeight:'16px', color:this.C.sub }));
  }
  confirmBlocks(){
    var C = this.C, MT = this.mt(), o = this.order();
    var blocks = [
      React.createElement('div', { key:'details', style:{ display:'flex', flexDirection:'column', gap:8 } }, [
        this.sectionLabel('ORDER DETAILS', 'l'),
        React.createElement('div', { key:'c', style:{ boxSizing:'border-box', padding:'20px 16px', borderRadius:24, backgroundColor:'#ffffff', display:'flex', flexDirection:'column', gap:16 } }, [
          this.drow('Daily fee', this.money(o.daily), null, 'a'), this.hr('a1'),
          this.drow('First payment date', 'Oct 3, 2026', null, 'b'), this.hr('b1'),
          this.drow('Per Installment', this.money(o.per), null, 'c'), this.hr('c1'),
          this.drow('Total payment', this.money(o.total), null, 'e'), this.hr('e1'),
          this.sp('View payment schedule', { fontFamily:"'Hanken Grotesk', sans-serif", fontWeight:600, fontSize:14, lineHeight:'20px', color:C.blue, cursor:'pointer' }, { key:'f' })
        ])
      ]),
      React.createElement('div', { key:'protection', style:{ boxSizing:'border-box', padding:16, borderRadius:24, backgroundColor:'#ffffff', display:'flex', flexDirection:'column', gap:16 } }, [
        React.createElement('div', { key:'top', style:{ display:'flex', flexDirection:'row', gap:12, alignItems:'flex-start' } }, [
          React.createElement('div', { key:'i', style:{ width:36, height:36, flex:'none' }, dangerouslySetInnerHTML:{ __html: "<svg width=\"36\" height=\"36\" style=\"display:block\" viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><mask id=\"mask0_9109_24075\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"4\" y=\"5\" width=\"23\" height=\"26\"><path d=\"M14.1093 5.95453C14.5106 5.66788 14.8859 5.56641 15.2738 5.56641C15.6618 5.56641 16.0221 5.65742 16.438 5.95453C19.1549 7.89512 21.0956 7.89512 24.2006 8.67148C25.7531 9.05967 26.0302 9.83572 26.1411 10.612C26.5293 13.3289 26.5293 15.6576 26.1411 17.9863C25.7529 20.3149 24.9766 22.6437 23.0361 24.9724C21.0957 27.3012 17.9905 29.6298 15.6619 30.018C15.2737 30.0827 15.2802 30.0838 14.8856 30.018C12.5568 29.6298 9.45207 27.3012 7.51137 24.9724C5.57066 22.6437 4.79464 20.3151 4.40641 17.9863C4.01819 15.6575 4.01816 13.3288 4.40641 10.612C4.51362 9.86179 4.74998 9.07082 6.34708 8.67148C9.45203 7.89512 11.3925 7.89512 14.1093 5.95453Z\" fill=\"#D9D9D9\"></path></mask><g mask=\"url(#mask0_9109_24075)\"><path d=\"M14.1093 5.95453C14.5106 5.66788 14.8859 5.56641 15.2738 5.56641C15.6618 5.56641 16.0221 5.65742 16.438 5.95453C19.1549 7.89512 21.0956 7.89512 24.2006 8.67148C25.7531 9.05967 26.0302 9.83572 26.1411 10.612C26.5293 13.3289 26.5293 15.6576 26.1411 17.9863C25.7529 20.3149 24.9766 22.6437 23.0361 24.9724C21.0957 27.3012 17.9905 29.6298 15.6619 30.018C15.2737 30.0827 15.2802 30.0838 14.8856 30.018C12.5568 29.6298 9.45207 27.3012 7.51137 24.9724C5.57066 22.6437 4.79464 20.3151 4.40641 17.9863C4.01819 15.6575 4.01816 13.3288 4.40641 10.612C4.51362 9.86179 4.74998 9.07082 6.34708 8.67148C9.45203 7.89512 11.3925 7.89512 14.1093 5.95453Z\" fill=\"#7AFFE4\"></path><path d=\"M15.2739 5.5667L16.8264 5.17858L21.4838 4.40234L29.2462 11.3885L30.7987 26.137L17.6026 31.9588L15.2739 30.0182C15.2739 30.0182 17.7676 28.2706 19.1551 26.9133C20.695 25.4068 21.4838 24.5846 22.6482 23.0321C23.8304 21.4557 24.2007 20.3152 24.5888 18.3746C25.1238 15.6994 24.9769 13.3291 24.5888 11.3885C24.5047 10.9681 24.2007 10.4829 23.8126 10.2241C22.6482 9.4479 21.6277 9.65652 20.3195 9.05978C17.6026 7.82052 15.2739 5.5667 15.2739 5.5667Z\" fill=\"#00AC89\"></path><path d=\"M19.7202 14.0039C20.1001 13.6167 20.7175 13.6165 21.0972 14.0039C21.4747 14.389 21.4747 15.0113 21.0972 15.3965L14.4976 22.126C14.1179 22.5132 13.5003 22.5132 13.1206 22.126L9.54541 18.4814C9.16772 18.0964 9.16781 17.473 9.54541 17.0879C9.925 16.7006 10.5427 16.7008 10.9224 17.0879L13.8081 20.0303L19.7202 14.0039Z\" fill=\"#00AC89\" stroke=\"#00AC89\" stroke-width=\"0.388119\"></path><path d=\"M27.4557 19.5381C25.9032 19.5381 24.3505 20.7025 24.3505 20.7025C24.3505 20.7025 22.7981 19.5383 21.2456 19.5382C19.6932 19.5381 18.9166 19.9261 18.1404 20.7025C17.3644 21.4788 16.9815 22.6637 17.3644 24.1956C17.7524 25.748 18.534 26.9174 19.6933 28.0767C20.8576 29.2411 22.4101 30.4054 23.5743 31.1817C23.9428 31.4274 24.0886 31.5699 24.3505 31.5698C24.6124 31.5698 24.7734 31.4173 25.1268 31.1817C26.2913 30.4054 27.8438 29.2411 29.0081 28.0767C30.1726 26.9122 30.9484 25.7481 31.3367 24.1956C31.725 22.643 31.3365 21.4788 30.5604 20.7025C29.7844 19.9262 29.0081 19.5381 27.4557 19.5381Z\" fill=\"#00AC89\"></path></g><mask id=\"mask1_9109_24075\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"17\" y=\"18\" width=\"16\" height=\"13\"><path d=\"M28.0821 18.7617C26.5297 18.7617 24.977 19.9261 24.977 19.9261C24.977 19.9261 23.4246 18.7619 21.8721 18.7618C20.3196 18.7617 19.543 19.1498 18.7669 19.9262C17.9909 20.7024 17.6079 21.8873 17.9908 23.4192C18.3789 24.9716 19.1605 26.1411 20.3197 27.3003C21.4841 28.4647 23.0366 29.6291 24.2007 30.4054C24.5692 30.6511 24.7151 30.7935 24.977 30.7935C25.2389 30.7934 25.3998 30.6409 25.7532 30.4054C26.9178 29.6291 28.4703 28.4647 29.6346 27.3003C30.7991 26.1359 31.5748 24.9717 31.9631 23.4192C32.3514 21.8667 31.9629 20.7024 31.1869 19.9261C30.4109 19.1498 29.6346 18.7617 28.0821 18.7617Z\" fill=\"#D9D9D9\"></path></mask><g mask=\"url(#mask1_9109_24075)\"><path d=\"M28.0821 18.7617C26.5297 18.7617 24.977 19.9261 24.977 19.9261C24.977 19.9261 23.4246 18.7619 21.8721 18.7618C20.3196 18.7617 19.543 19.1498 18.7669 19.9262C17.9909 20.7024 17.6079 21.8873 17.9908 23.4192C18.3789 24.9716 19.1605 26.1411 20.3197 27.3003C21.4841 28.4647 23.0366 29.6291 24.2007 30.4054C24.5692 30.6511 24.7151 30.7935 24.977 30.7935C25.2389 30.7934 25.3998 30.6409 25.7532 30.4054C26.9178 29.6291 28.4703 28.4647 29.6346 27.3003C30.7991 26.1359 31.5748 24.9717 31.9631 23.4192C32.3514 21.8667 31.9629 20.7024 31.1869 19.9261C30.4109 19.1498 29.6346 18.7617 28.0821 18.7617Z\" fill=\"#FF9EDF\"></path><path d=\"M28.082 23.8069C27.3058 20.3138 24.9771 19.9257 24.9771 19.9257L26.5295 16.4326L34.68 17.2089L32.3513 30.793H24.9771C24.9771 30.793 28.8582 27.3 28.082 23.8069Z\" fill=\"#F061D1\"></path></g></svg>" } }),
          React.createElement('div', { key:'b', style:{ flex:'1 1 auto', minWidth:0, display:'flex', flexDirection:'column', gap:8 } }, [
            React.createElement('div', { key:'h', style:{ height:24, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', gap:8 } }, [
              this.sp('Borrower protection', { fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:'rgb(20,30,36)' }, { key:'t' }),
              (function(self){ var on = self.state.prot !== false, pr = !!self.state.protPress, E = 'cubic-bezier(0.2, 0, 0, 1)';
  var lbl = function(k, txt, show, col){ return React.createElement('span', { key:k, 'aria-hidden': !show, style:{ position:'absolute', left:0, right:0, top:4, textAlign:'center', whiteSpace:'nowrap', color:col, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : (k === 'on' ? 'translateY(4px)' : 'translateY(-4px)'), transition:'opacity 150ms ' + E + ', transform 150ms ' + E } }, txt); };
  return React.createElement('button', { key:'p', type:'button', 'aria-pressed':on, 'aria-label': on ? 'Protected' : 'Add protection',
    onClick:function(){ self.setState({ prot: !on }); },
    onPointerDown:function(){ self.setState({ protPress:true }); },
    onPointerUp:function(){ self.setState({ protPress:false }); },
    onPointerLeave:function(){ if (self.state.protPress) self.setState({ protPress:false }); },
    style:{ position:'relative', overflow:'hidden', width: on ? 74 : 40, height:24, boxSizing:'border-box', padding:0, borderRadius:8, border:'none', backgroundColor: on ? 'rgb(243,248,255)' : '#ffffff', boxShadow: on ? 'inset 0 0 0 1px rgb(200,222,255)' : 'inset 0 0 0 1px rgb(224,227,229)', fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:12, lineHeight:'16px', cursor:'pointer', flex:'none', transform: pr ? 'scale(0.96)' : 'scale(1)', transition:'width 150ms ' + E + ', background-color 150ms ' + E + ', box-shadow 150ms ' + E + ', transform 60ms ' + E, WebkitTapHighlightColor:'transparent' } },
    [ lbl('on', 'Protected', on, 'rgb(44,116,190)'), lbl('off', 'Add', !on, 'rgb(106,117,125)') ]); })(this)
            ]),
            this.sp('Get full coverage up to \u20b130,000. Protect your family from loan burdens in case of medical emergencies or unexpected accidents.', { fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:12, lineHeight:'16px', color:'rgb(106,117,125)', textWrap:'pretty' }, { key:'d' })
          ])
        ]),
        React.createElement('div', { key:'hr', style:{ height:0, borderTop:'1px solid rgb(224,227,229)' } }),
        this.sp('See benefits', { fontFamily:"'Hanken Grotesk', sans-serif", fontWeight:600, fontSize:14, lineHeight:'20px', color:C.blue, cursor:'pointer' }, { key:'s' })
      ]),
      React.createElement('div', { key:'method', style:{ display:'flex', flexDirection:'column', gap:8 } }, [
        this.sectionLabel('WITHDRAWAL METHOD', 'l'),
        React.createElement('div', { key:'c', style:{ height:72, boxSizing:'border-box', padding:16, borderRadius:24, backgroundColor:'#ffffff', display:'flex', flexDirection:'row', alignItems:'center', gap:12 } }, [
          React.createElement('div', { key:'logo', style:{ width:36, height:36, flex:'none', display:'flex', alignItems:'center', justifyContent:'center' } },
            React.createElement('img', { src: window.__resources.mayaLogo, alt:'Maya', style:{ width:26, height:26, display:'block' } }, null)),
          React.createElement('div', { key:'t', style:{ flex:'1 1 auto', display:'flex', flexDirection:'column' } }, [
            this.sp('Bank of the Philippins Islands', { fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }, { key:'a' }),
            this.sp('Ending in 4567', { fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.sub }, { key:'b' })
          ]),
          React.createElement('span', { key:'c2', style:{ color:C.mute, display:'flex' } }, this.ic('chevR', 16, C.mute, 2))
        ])
      ]),
      React.createElement('div', { key:'agree', onClick:() => this.setState({ agree: !this.state.agree }), style:{ height:28, display:'flex', flexDirection:'row', alignItems:'center', gap:8, cursor:'pointer' } }, [
        React.createElement('div', { key:'b', style:{ width:16, height:16, flex:'none', boxSizing:'border-box', borderRadius:'50%', border:'1.5px solid ' + (this.state.agree ? C.blue : '#bac0c4'), backgroundColor: this.state.agree ? C.blue : 'transparent', transition:'background-color .15s ease, border-color .15s ease', display:'flex', alignItems:'center', justifyContent:'center', color:'#ffffff' } }, this.state.agree ? this.ic('check', 10, '#ffffff', 3) : null),
        this.sp('By typing confirm indicates you accept Loan Agreement and Loan Disclosure Statement', { flex:'1 1 auto', fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:11, lineHeight:'14px', color:C.mute }, { key:'t' })
      ])
    ];
    return this.el('div', {
      key:'blocks',
      initial:{ opacity:0 }, animate:{ opacity:1, transition:{ duration:0.2 } }, exit:{ opacity:0, transition:MT.LEAVE },
      style:{ position:'absolute', left:16, right:16, top:382, zIndex:1, display:'flex', flexDirection:'column', gap:20 }
    }, blocks.map((b, i) => {
      var R = MT.REVEAL(i);
      return this.el('div', {
        key:'b'+i, initial:R.initial, animate:{ opacity:1, y:0, scale:1, transition:R.transition }, style:{}
      }, b);
    }));
  }
  /* 0..1 strength of the confirm chrome, riding the morph progress */
  bkv(){
    var cf = this.state.phase === 'confirm';
    /* Settled confirm page must never paint at bk=0, whatever the tween did. */
    return cf ? (this.state.morph ? this.k01() : 1) : this.k01();
  }
  gradLayer(){
    return React.createElement('div', { key:'grad', ref:this.ref('grad'), style:{ position:'absolute', left:0, top:-this.ee(), width:360, height:426 + this.ee(), pointerEvents:'none', opacity: this.mpGrad().opacity, background:'linear-gradient(180deg, rgb(221,248,238) 0px, rgb(221,248,238) ' + this.ee() + 'px, rgba(221,248,238,0) 100%)' } }, null);
  }
  ctaBar(){
    var C = this.C, MT = this.mt(), bk = this.bkv(), on = this.ctaWanted(), bs = this.mpBtn(bk);
    this._ctaShown = on;
    return this.ap({ key:'bcta', initial:false }, on ? [
      React.createElement('div', {
        key:'bar', ref:this.ref('bar'),
        style:Object.assign({
          position:'absolute', left:0, bottom:0, width:360, height:108 + (this.sb() ? this.sb() + 4 : 0), zIndex:6, boxSizing:'border-box',
          padding:'32px 48px ' + (this.sb() ? this.sb() + 24 : 20) + 'px', display:'flex', flexDirection:'column', alignItems:'center', gap:4
        }, this.mpBar(bk))
      }, [
        BLUR ? this.pblur('pb', { left:0, top:0, right:0, bottom:0, zIndex:-1 }, 10 * bk, 'bottom', 'pbc') : null,
        /* slide + fade on a plain wrapper; the press scale stays on the m.div inside.
           On one node, whileTap's scale value took over `transform` and the slide
           was dropped for good after the first press. */
        React.createElement('div', { key:'btnWrap', ref:this.ref('btnWrap'), style:Object.assign({ position:'relative', alignSelf:'stretch', flex:'none', height:48 }, bs) },
          this.el('div', Object.assign({
            key:'btn', ref:this.ref('btn'), whileTap:{ scale:MT.PRESS_SCALE.pill }, transition:MT.PRESS
          }, this.mo({
            position:'relative', height:48, borderRadius:999, boxSizing:'border-box',
            padding:'12px 20px', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center',
            cursor:'pointer', fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:14, lineHeight:'20px', color:'#ffffff'
          }, { backgroundColor: this.state.agree ? C.blue : '#e0e3e5' }, { duration:0.2 })), 'Confirm'))
      ])
    ] : null);
  }
  loanScreen(){
    var C = this.C, MT = this.mt(), cf = this.state.phase === 'confirm', sp = this.spring(), PH = 740 + this.ex() - this.df();
    var SB = this.sb(), EE = this.ee(), FULL = PH + SB + EE;      // sheet runs EE up behind the status bar, SB down under the search bar
    var back = () => { if (cf) this.goPhase('enter'); else this.setState({ screen:'home' }); };

    var card = React.createElement('div', { key:'card', ref:this.ref('card'), style:Object.assign({
      position:'absolute', top:116, zIndex:2, boxSizing:'border-box', backgroundColor:'#ffffff', overflow:'hidden',
      borderTopLeftRadius:24, borderTopRightRadius:24, display:'flex', flexDirection:'column', boxShadow: this.SH.card
    }, this.mpCard()) }, [
      this.slot('amount', () => this.amountBlock(), 'amt'),
      React.createElement('div', { key:'div', ref:this.ref('divider'), style:Object.assign({ alignSelf:'stretch', flex:'none', backgroundColor:C.line }, this.mpDivider()) }, null),
      /* no overflow clip: the text fades in place instead of being wiped open
         by the growing row */
      React.createElement('div', { key:'term', ref:this.ref('term'), style:Object.assign({
        alignSelf:'stretch', flex:'none', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'
      }, this.mpTerm()) }, [
        this.sp('Loan term', { fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.sub }, { key:'a' }),
        this.sp('15 days / Term', { fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.ink }, { key:'b' })
      ]),
      React.createElement('div', { key:'bottom', ref:this.ref('bottom'), style:Object.assign({ position:'relative', alignSelf:'stretch', flex:'none' }, this.mpBottom()) }, [
        this.chipRow()
      ]),
      /* Caption + keypad are pinned to the card at their edit-state spot instead of
         riding the 'bottom' row. In the row they inherited the card's 65px layout
         travel (amount block / divider / term all morphing) on top of their own
         fade: on the way back the caption's +8px rise turned into a ~57px fall
         that kept creeping after it was readable, and the chips slid through it.
         Fixed 312px width centred on the card, which shrinks symmetrically. */
      /* Caption: never mounted/unmounted by the morph — its position and opacity
         are pure functions of the progress (capY / capO), so any reversal just
         runs the same path back. Base = its edit-state spot in the card. */
      (() => {
        var mv = this.mvs();
        return this.el('div', {
          key:'cap', ref:this.ref('cap'), 'aria-hidden': cf,
          style: Object.assign({ position:'absolute', top:259 - this.df(), left:'50%', width:312, marginLeft:-156, height:20, pointerEvents:'none', textAlign:'center', fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:14, lineHeight:'20px', letterSpacing:'0.02em', color:C.mute },
            mv ? { y: this._capY, opacity: this._capO, visibility: this._capV } : { transform: 'translateY(' + this.capY() + 'px)', opacity: this.capO(), visibility: this.capO() > 0 ? 'visible' : 'hidden' })
        }, 'Flexible amounts from ₱500–₱50,000');
      })(),
      this.ap({ key:'pinned', initial:false }, cf ? null : [ this.keypad() ])
    ]);

    /* Progressive blur: stacked backdrop layers, each blurrier and masked to a
       smaller slice of the top, so the sampled blur ramps 10px → 0px down the nav. */
    var header = React.createElement('div', { key:'hdr', style:{ position:'absolute', left:0, top:0, width:360, height:116 + EE, zIndex:5, pointerEvents:'none' } }, [
      /* blur layers only while content is scrolled under the header — at the top
         of the sheet there is only flat background behind it (blur = no-op) */
      BLUR ? React.createElement('div', { key:'pbw', ref:this.ref('hdrBlur'), style:{ position:'absolute', left:0, top:0, width:360, height:116 + EE, display:'none' } },
        this.pblur('pb', { left:0, top:0, width:360, height:116 + EE }, 10, 'top')) : null,
      React.createElement('div', { key:'veil', style:{ position:'absolute', left:0, top:0, width:360, height:116 + EE, background:'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.33) 70%, rgba(255,255,255,0) 100%)' } }, null),
      React.createElement('div', { key:'sb', className:'ps-sb', style:{ position:'absolute', left:0, top:0, width:360, height:40, boxSizing:'border-box', padding:'0 20px', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between' } }, [
        this.el('span', Object.assign({ key:'t' }, this.mo({ fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:13, lineHeight:'1', letterSpacing:'0.01em' }, { color: C.ink }, { duration:0.2 })), '9:30'),
        React.createElement('div', { key:'punch', style:{ position:'absolute', left:174, top:14, width:12, height:12, borderRadius:'50%', backgroundColor:'#0a1219' } }, null),
        this.el('div', Object.assign({ key:'r' }, this.mo({ display:'flex', flexDirection:'row', alignItems:'flex-end', gap:5 }, { color: C.ink }, { duration:0.2 })), [
          React.createElement('svg', { key:'a', width:16, height:11, viewBox:'0 0 16 11', fill:'currentColor', dangerouslySetInnerHTML:{ __html:'<rect x="0" y="7.5" width="2.6" height="3.5" rx="1"/><rect x="4.4" y="5" width="2.6" height="6" rx="1"/><rect x="8.8" y="2.5" width="2.6" height="8.5" rx="1"/><rect x="13.2" y="0" width="2.6" height="11" rx="1"/>' } }),
          React.createElement('svg', { key:'b', width:15, height:11, viewBox:'0 0 15 11', fill:'none', stroke:'currentColor', strokeWidth:1.6, strokeLinecap:'round', dangerouslySetInnerHTML:{ __html:'<path d="M1 4.1a9 9 0 0 1 13 0"/><path d="M3.9 6.9a5 5 0 0 1 7.2 0"/><path d="M7.5 9.6h.01"/>' } }),
          React.createElement('svg', { key:'c', width:22, height:11, viewBox:'0 0 22 11', fill:'none', dangerouslySetInnerHTML:{ __html:'<rect x="0.8" y="0.8" width="18" height="9.4" rx="2.6" stroke="currentColor" stroke-width="1.4" opacity="0.5"/><rect x="2.6" y="2.6" width="14.4" height="5.8" rx="1.4" fill="currentColor"/><path d="M20.4 4.1v2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>' } })
        ])
      ]),
      this.el('div', Object.assign({
        key:'back', onClick:back, whileTap:{ scale:MT.PRESS_SCALE.iconButton }, transition:MT.PRESS
      }, this.mo({
        position:'absolute', left:16, top:56 + EE, width:40, height:40, borderRadius:999, display:'flex',
        alignItems:'center', justifyContent:'center', cursor:'pointer', pointerEvents:'auto',
        backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)'
      }, {
        backgroundColor: 'rgba(255,255,255,0.6)',
        color: C.ink,
        boxShadow: '0px 0px 24px 0px rgba(0,1,40,0.08)'
      }, { duration:0.2 })), this.ic('chevL', 20, 'currentColor', 2)),
      this.el('div', Object.assign({ key:'title' }, this.mo({
        position:'absolute', left:0, right:0, top:56 + EE, height:40, display:'flex', alignItems:'center',
        justifyContent:'center', fontFamily:"'Hanken Grotesk', sans-serif", fontWeight:600, fontSize:14, lineHeight:'20px'
      }, { color: C.ink }, { duration:0.2 })), 'Apply a loan')
    ]);


    /* The bar itself never animates opacity: it hosts the progressive-blur
       backdrop layers, and any opacity < 1 isolates them into their own
       compositing group (they sample the group, not the page), which snaps
       back at opacity 1 and reads as a flash. Only the button fades. */
    var bottomCta = this.slot('bcta', () => this.ctaBar(), 'bcta');
    /* per-render holder: an exiting (frozen) sheet keeps the closure of its own node */
    var sheet = { n:null }, sheetRef = function(n){ if (n) sheet.n = n; };

    return this.el('div', {
      key:'loan', ref: sheetRef,
      initial:{ y:FULL }, animate:{ y:0, transition:sp },
      exit:{ y:FULL, transition:{ duration:0.3, ease:[0.4,0,1,1] } },
      /* own compositor layer only while the sheet slides (anim-will-change):
         the whole 360×740 sheet moves as one texture instead of repainting
         every frame, and the layer is released once it settles */
      onAnimationStart: () => { if (sheet.n) sheet.n.style.willChange = 'transform'; var f = BLUR && document.querySelector('.ps-frame'); if (f) f.classList.remove('ps-covered'); },
      onAnimationComplete: () => { if (sheet.n) sheet.n.style.willChange = '';
        var f = BLUR && document.querySelector('.ps-frame'); if (f) f.classList.toggle('ps-covered', this.state.screen === 'loan'); },
      style:{ position:'absolute', left:0, top:-EE, width:360, height:FULL, overflow:'hidden', backgroundColor: C.page }
    }, [
      React.createElement('div', { key:'scroll', className:'psScroll', onScroll: !BLUR ? undefined : this._onSheetScroll || (this._onSheetScroll = (e) => {
          var on = e.currentTarget.scrollTop > 0, h = this._r.hdrBlur;
          if (h && on !== this._hdrLive) { this._hdrLive = on; h.style.display = on ? '' : 'none'; } }), style:{ position:'absolute', left:0, top:0, width:360, height:FULL, boxSizing:'border-box', paddingTop:EE, overflowY: cf ? 'auto' : 'hidden', overflowX:'hidden' } },
        React.createElement('div', { style:{ position:'relative', width:360, height: cf ? Math.max(1175 + SB, PH + SB) : PH + SB } }, [
          this.slot('grad', () => this.gradLayer(), 'grad'),
          card,
          this.ap({ key:'ap', initial:false }, cf ? [this.slot('blocks', () => this.confirmBlocks(), 'blocks')] : null)
        ])
      ),
      header,
      bottomCta
    ]);
  }

  _renderHero(){ return this.hero(); }
  /* First tap on Withdraw used to build the whole loan sheet from cold (React +
     Framer Motion + first use of its fonts): one ~80ms task right as the slide
     began = the dropped frames at the start. Once motion has loaded and the page
     is idle, the sheet is built once out of sight and dropped two frames later,
     so the real first open runs on warm code and caches. */
  warmSheet(){
    var self = this;
    if (this._warmed) return; this._warmed = true;
    var go = function(){
      if (self.state.screen === 'loan') return;
      self._warmNow = true; self.setState({ warm: 1 });
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ self._warmNow = false; self.setState({ warm: 2 }); }); });
    };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 600);
  }
  _renderLoan(){
    /* lets the (prototype-only) Tune button step aside while the loan sheet is open */
    document.documentElement.classList.toggle('wd-loan', this.state.screen === 'loan');
    this._dirty.loan = false;
    if (this._warmNow && this.state.screen !== 'loan')
      return React.createElement('div', { key:'warm', 'aria-hidden': true, style:{ position:'absolute', left:0, top:0, width:360, height:0, overflow:'hidden', visibility:'hidden', pointerEvents:'none' } }, this.loanScreen());
    /* region slots re-subscribe when this render hands them new props; any left
       behind in an exiting (frozen) sheet keep their last frame */
    ['amount','bcta','grad','blocks'].forEach(this._freeze, this);
    return this.ap({ initial:false }, this.state.screen === 'loan' ? [this.loanScreen()] : null);
  }
  renderVals(){
    if (!this._rh) { this._rh = () => this._renderHero(); this._rl = () => this._renderLoan(); }
    var hero = React.createElement(PerfSlot, { owner:this, ch:'hero', render:this._rh });
    var loan = React.createElement(PerfSlot, { owner:this, ch:'loan', render:this._rl });
    /* LazyMotion(strict) roots (bundle-lazy-motion, bundle-strict-mode). They sit
       above the slots and only re-render with the host — i.e. once, when motion
       arrives — so their context never churns the m.* components below. */
    var fm = this.state.fm;
    if (fm && this.state.MT && fm.LazyMotion) {
      hero = React.createElement(fm.LazyMotion, { features: fm.features, strict: true }, hero);
      loan = React.createElement(fm.LazyMotion, { features: fm.features, strict: true }, loan);
    }
    return { hero: hero, loan: loan };
  }
}
