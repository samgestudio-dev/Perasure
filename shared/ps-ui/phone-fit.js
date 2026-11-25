/* PeraSure UI — phone page fitting (load in <head>, before the page renders: <script src="…/shared/ps-ui/phone-fit.js">;
   with a Tune panel, after PSTune.setup so its settings are known).
   RESPONSIVE (owner's rule for pages built on the shared components): the layout fills the phone's width — cards stretch
   with the 16 px page margins, heights follow the visible screen. How big it is drawn is the "fit" mode, set by the page
   (window.PS_FIT = { mode, max }) or the Tune panel (PS_TUNE.fit / PS_TUNE.zoom), default capped 1.15 (owner):
     cap   — capped zoom: the 360 px design is enlarged with the screen, but at most `max` times (1.15: a 390 px phone
             shows it at 1.08×, a 430 px one at 1.15×, where full zoom would be 1.19×); the layout fills what is left.
             The browser enlarges the whole page (the viewport is narrower than the screen), so every px in it grows too;
     rem   — capped zoom in rem: the same factor, but the page is laid out at the phone's own width and the root font size
             carries the factor, so everything sized in rem grows and anything in px (the hosted Withdraw demo) stays 1:1;
     fit   — 1:1: laid out at the phone's own width, nothing enlarged (true sizes, text can feel small on big iPhones);
     scale — full zoom: the 360 px design scaled to the screen (as the older demos, prototypes/withdraw-fund-flow/phone-fit.js).
   A phone narrower than 360 px is never shrunk (cap / fit): the layout takes its width.
   Dev Mode draws these modes itself (devmode-platform: js/canvas.js DM.screenOf, mcp/core.mjs screenOf; zmax in devmode/app.js): change them together.

   TEXT SIZE (pages that opt in with PS_FIT.text = true: the app). The page is sized in rem (tokens-rem/, shared/ps-ui): 1rem is the
   phone's text size — 16 px at the default setting. The setting is read from the browser: Chrome / Android WebView with
   <meta name="text-scale" content="scale"> put it in the root font size (medium), iOS Safari / WKWebView in -apple-system-body (Dynamic
   Type, 17 px at the default), desktop browsers in their default font size; Tune → Text size can fix it for checking. Up to 130 % the whole
   UI follows (spacing, icons and boxes grow with the text, so nothing clips); above that only text grows (--ps-tx), up to 150 % for
   now (the phone's setting is capped there until every component holds 200 %; Tune → Text size 200 % shows what still breaks). The screen
   fit above is a separate, second factor. Sets the root font size (%) and --ps-tx.

   iOS Safari 26+ (Liquid Glass): the status bar and the floating search bar sit OVER the page, so the page runs edge to
   edge (viewport-fit=cover): the header grows up behind the status bar, the bottom bar grows down behind the search bar
   and its button keeps clear of it, and the document is scrolled by the status-bar height (a "scroll runway") so Safari
   draws real page pixels behind the status bar. Other browsers keep the plain behaviour.
   Sets --vh, --ph, --ftop, --e, --sb on <html> (used by ps-ui.css: .ps-wrap, .ps-frame, .ps-screen, bars) and fires
   "ps-viewport". No re-fit while an input has focus (Android keyboards resize the viewport); it re-fits on blur.
   ?edge=1 / ?edge=0 forces the Safari mode on / off, ?debug=1 shows the numbers.
   PS_FIT.web = true: a scrolling web page — only the screen fit; no scroll lock, no edge mode (see below). */
(function(){
  var root = document.documentElement, meta = document.querySelector('meta[name="viewport"]'), lastR = 0;
  var ua = navigator.userAgent, qs = location.search;
  var touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var iosSafari = /iP(hone|od)/.test(ua) && /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|DuckDuckGo|YaBrowser/.test(ua);
  var ver = +((/Version\/(\d+)/.exec(ua) || [])[1] || 0);
  var T = window.PS_TUNE || {}, F = window.PS_FIT || {};
  /* PS_FIT.web: a scrolling web page (the SMS landing page), not the app's phone frame — only the screen fit (the viewport width) is set;
     the page keeps its own scrolling (no html.ps-phone lock, no Safari edge runway) and stays edge to edge (viewport-fit=cover) */
  var web = !!F.web;
  var edge = !web && (/[?&]edge=1/.test(qs) || (iosSafari && ver >= 26 && !/[?&]edge=0/.test(qs)));
  if (!web) root.classList.add('ps-phone'); if (edge) root.classList.add('ps-edge');
  var mode = F.mode || T.fit || 'cap', zmax = +(F.max || T.zoom || 1.15) || 1.15;
  /* the text size: ts = the phone's setting (1 = default), ui = the part the whole layout follows, tx = the rest, for text only */
  var TS_MIN = 0.85, TS_MAX = 1.5, UI_MAX = 1.3, ios = /iP(hone|od|ad)/.test(ua) || (/Macintosh/.test(ua) && touch);
  function textSize(){
    var o = +(T.text || 0), p = document.createElement('div');
    p.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;font-size:medium';
    root.appendChild(p);
    var med = parseFloat(getComputedStyle(p).fontSize) || 16, dt = 0;
    if (ios) { p.style.font = '-apple-system-body'; dt = parseFloat(getComputedStyle(p).fontSize) || 0; }
    p.remove();
    var ts = o ? o / 100 : dt ? dt / 17 : med / 16;
    ts = Math.max(TS_MIN, Math.min(o ? 2 : TS_MAX, ts));                 /* Tune can go to 200 % to show what still needs work */
    var ui = Math.min(ts, UI_MAX);
    return { med: med, ts: ts, ui: ui, tx: ts / ui };
  }
  function text(){
    if (!F.text && mode !== 'rem') return;
    var t = F.text ? textSize() : { med: 16, ts: 1, ui: 1, tx: 1 }, pct = Math.round(t.ui * (G.fz || 1) * 16 / t.med * 100000) / 1000;
    root.style.fontSize = pct + '%';                                    /* relative to medium, so the browser's own scaling stays in */
    root.style.setProperty('--ps-tx', String(Math.round(t.tx * 10000) / 10000));
    root.classList.toggle('ps-text-big', t.ts > 1.01);                 /* lets a few rows wrap that sit on one line at the default size */
    G.ts = t.ts; G.ui = t.ui; G.tx = t.tx; G.med = t.med;
  }
  root.setAttribute('data-fit', mode);
  if (!touch && meta) meta.setAttribute('content', 'width=device-width, initial-scale=1' + (web ? ', viewport-fit=cover' : ''));
  /* status-bar height (pt) by screen height, used when Safari reports no top inset */
  function statusPt(h){ return h >= 874 ? 62 : h >= 852 ? 59 : h >= 812 ? 47 : 20; }
  function env(){
    var p = document.createElement('div');
    p.style.cssText = 'position:absolute;left:0;top:0;width:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)';
    (document.body || root).appendChild(p);
    var cs = getComputedStyle(p), o = { t: parseFloat(cs.paddingTop) || 0, b: parseFloat(cs.paddingBottom) || 0 };
    p.remove(); return o;
  }
  var timer = 0, G = window.__PS_GEO = {};
  function runway(){ if (edge && G.run) { if (Math.abs(window.scrollY - G.run) > 0.5) window.scrollTo(0, G.run); } }
  function fit(force){
    var r = window.innerHeight / window.innerWidth;
    if (!(r > 0)) return;
    if (!force && lastR && Math.abs(r - lastR) / lastR < 0.01) { runway(); return; }
    /* rotation re-fits at once; a toolbar showing / hiding (a few % of height) is settled first, so it never re-lays
       the page out under the user's finger */
    if (!force && lastR && Math.abs(r - lastR) / lastR < 0.2) { clearTimeout(timer); timer = setTimeout(function(){ fit(true); }, 200); return; }
    lastR = r;
    var V, W = 0, land0 = window.innerWidth > window.innerHeight;
    var sw0 = land0 ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);   // device width, points
    if (touch) {
      /* layout width W (CSS px) → the browser draws it at sw0 / W */
      if (mode === 'scale') W = Math.max(360, Math.ceil(600 / r));
      else if (mode === 'fit' || mode === 'rem') W = sw0;
      else W = Math.round(sw0 / Math.max(1, Math.min(zmax, sw0 / 360)));
      V = Math.floor(W * r);
      var ms = Math.max(0.1, Math.ceil(sw0 / W * 1000) / 1000);
      if (meta) meta.setAttribute('content', (W === sw0 ? 'width=device-width, initial-scale=1' : 'width=' + W) + ', user-scalable=no, maximum-scale=' + ms + (edge || web ? ', viewport-fit=cover' : ''));
    } else V = Math.max(600, window.innerHeight);
    var top = 0, sb = 0, ext = 0, hs = V, run = 0;
    if (edge) {
      var e = env(), land = window.innerWidth > window.innerHeight;
      var sw = land ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
      var sh = land ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
      var k = touch ? W / sw : 1;                                  // CSS px per point
      hs = touch ? Math.round(sh * k) : V + 140;                   // whole screen, CSS px
      if (e.t > 0) { top = e.t; run = 0; }                         // Safari already lays out under the status bar
      else { top = Math.round(statusPt(sh) * k); run = top; }      // viewport starts below it: scroll by it
      var zone = Math.max(0, hs - V - (run ? top : 0));           // what is under the toolbar
      sb = e.b > 40 ? e.b : Math.max(e.b, zone - Math.round(15 * k));   // search-bar top above the screen bottom
      ext = Math.max(0, top - 40);                                 // header grows up by this much
    }
    var U = edge ? hs - sb - (top - 40) : V + 40;                  // usable frame height (status mock + content)
    G.fz = mode === 'rem' ? Math.max(1, Math.min(zmax, (touch ? sw0 : Math.min(window.innerWidth, 600)) / 360)) : 1;   /* the rem mode's factor */
    G.mode = mode; G.W = W; G.V = V; G.hs = hs; G.top = top; G.sb = sb; G.ext = ext; G.run = run; G.U = U; G.ver = ver; G.edge = edge;
    root.style.setProperty('--vh', (edge ? hs : V) + 'px');
    root.style.setProperty('--ph', (U + sb) + 'px');
    root.style.setProperty('--ftop', (top - 40) + 'px');
    root.style.setProperty('--e', ext + 'px');
    root.style.setProperty('--sb', sb + 'px');
    window.__PS_PH = U; window.__PS_SB = sb; window.__PS_E = ext;
    text();
    window.dispatchEvent(new Event('ps-viewport'));
    runway(); setTimeout(runway, 60); setTimeout(runway, 400);
  }
  window.__PS_FIT = fit;
  fit(true);
  function typing(){ var a = document.activeElement; return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA')); }
  window.addEventListener('resize', function(){ if (!typing()) fit(false); });
  document.addEventListener('focusout', function(){ setTimeout(function(){ if (!typing()) fit(false); }, 300); });
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ fit(true); }, 250); });
  window.addEventListener('load', function(){ fit(true); });
  document.addEventListener('visibilitychange', function(){ if (!document.hidden && F.text) { text(); window.dispatchEvent(new Event('ps-viewport')); } });   /* the text size changed in Settings */
  window.addEventListener('scroll', runway, { passive: true });
  if (/[?&]debug=1/.test(qs)) setInterval(function(){
    var d = document.getElementById('ps-debug');
    if (!d) { d = document.createElement('pre'); d.id = 'ps-debug'; d.style.cssText = 'position:fixed;left:8px;top:120px;z-index:99999;margin:0;padding:6px 8px;font:10px/1.35 ui-monospace,monospace;color:#fff;background:rgba(0,0,0,.72);border-radius:6px;pointer-events:none;white-space:pre'; document.body.appendChild(d); }
    var e = env(), vv = window.visualViewport;
    d.textContent = 'safari ' + ver + ' edge ' + edge + ' touch ' + touch + '\nscreen ' + screen.width + 'x' + screen.height + ' dpr ' + devicePixelRatio +
      '\ninner ' + innerWidth + 'x' + innerHeight + ' vv ' + (vv ? Math.round(vv.width) + 'x' + Math.round(vv.height) + ' @' + vv.scale.toFixed(3) : '-') +
      '\nenv top ' + e.t + ' bottom ' + e.b + ' scrollY ' + Math.round(scrollY) +
      '\nfit ' + G.mode + (G.fz > 1 ? ' ×' + G.fz.toFixed(3) : '') + ' W ' + G.W + ' V ' + G.V + ' hs ' + G.hs + ' top ' + G.top + ' run ' + G.run + '\nsb ' + G.sb + ' ext ' + G.ext + ' U ' + G.U +
      (F.text ? '\ntext ' + Math.round(G.ts * 100) + '% (ui ' + Math.round(G.ui * 100) + '% · text only ×' + G.tx.toFixed(2) + ') medium ' + G.med : '');
  }, 500);
})();
