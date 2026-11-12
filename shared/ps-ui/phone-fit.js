/* PeraSure UI — phone page fitting (load in <head>, before the page renders: <script src="…/shared/ps-ui/phone-fit.js">).
   RESPONSIVE (owner's rule for pages built on the shared components): the page is laid out at the phone's own width
   (viewport = device-width, scale 1) and fills it — nothing is scaled up or down. Cards stretch with the 16 px page
   margins; heights follow the visible screen. (The older demos scale a 360 px design instead: see
   prototypes/withdraw-fund-flow/phone-fit.js.)

   iOS Safari 26+ (Liquid Glass): the status bar and the floating search bar sit OVER the page, so the page runs edge to
   edge (viewport-fit=cover): the header grows up behind the status bar, the bottom bar grows down behind the search bar
   and its button keeps clear of it, and the document is scrolled by the status-bar height (a "scroll runway") so Safari
   draws real page pixels behind the status bar. Other browsers keep the plain behaviour.
   Sets --vh, --ph, --ftop, --e, --sb on <html> (used by ps-ui.css: .ps-wrap, .ps-frame, .ps-screen, bars) and fires
   "ps-viewport". No re-fit while an input has focus (Android keyboards resize the viewport); it re-fits on blur.
   ?edge=1 / ?edge=0 forces the Safari mode on / off, ?debug=1 shows the numbers. */
(function(){
  var root = document.documentElement, meta = document.querySelector('meta[name="viewport"]'), lastR = 0;
  var ua = navigator.userAgent, qs = location.search;
  var touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var iosSafari = /iP(hone|od)/.test(ua) && /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|DuckDuckGo|YaBrowser/.test(ua);
  var ver = +((/Version\/(\d+)/.exec(ua) || [])[1] || 0);
  var edge = /[?&]edge=1/.test(qs) || (iosSafari && ver >= 26 && !/[?&]edge=0/.test(qs));
  root.classList.add('ps-phone'); if (edge) root.classList.add('ps-edge');
  /* the phone's own width at scale 1; no pinch zoom (an app screen), no zoom-in when an input gets focus */
  if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1' + (touch ? ', maximum-scale=1, user-scalable=no' : '') + (edge ? ', viewport-fit=cover' : ''));
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
    var V = touch ? window.innerHeight : Math.max(600, window.innerHeight);
    var top = 0, sb = 0, ext = 0, hs = V, run = 0;
    if (edge) {
      var e = env(), land = window.innerWidth > window.innerHeight;
      var sh = land ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
      hs = touch ? sh : V + 140;                                    // whole screen in CSS px (= points at scale 1)
      if (e.t > 0) { top = e.t; run = 0; }                         // Safari already lays out under the status bar
      else { top = statusPt(sh); run = top; }                      // viewport starts below it: scroll by it
      var zone = Math.max(0, hs - V - (run ? top : 0));           // what is under the toolbar
      sb = e.b > 40 ? e.b : Math.max(e.b, zone - 15);              // search-bar top above the screen bottom
      ext = Math.max(0, top - 40);                                 // header grows up by this much
    }
    var U = edge ? hs - sb - (top - 40) : V + 40;                  // usable frame height (status mock + content)
    G.V = V; G.hs = hs; G.top = top; G.sb = sb; G.ext = ext; G.run = run; G.U = U; G.ver = ver; G.edge = edge;
    root.style.setProperty('--vh', (edge ? hs : V) + 'px');
    root.style.setProperty('--ph', (U + sb) + 'px');
    root.style.setProperty('--ftop', (top - 40) + 'px');
    root.style.setProperty('--e', ext + 'px');
    root.style.setProperty('--sb', sb + 'px');
    window.__PS_PH = U; window.__PS_SB = sb; window.__PS_E = ext;
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
  window.addEventListener('scroll', runway, { passive: true });
  if (/[?&]debug=1/.test(qs)) setInterval(function(){
    var d = document.getElementById('ps-debug');
    if (!d) { d = document.createElement('pre'); d.id = 'ps-debug'; d.style.cssText = 'position:fixed;left:8px;top:120px;z-index:99999;margin:0;padding:6px 8px;font:10px/1.35 ui-monospace,monospace;color:#fff;background:rgba(0,0,0,.72);border-radius:6px;pointer-events:none;white-space:pre'; document.body.appendChild(d); }
    var e = env(), vv = window.visualViewport;
    d.textContent = 'safari ' + ver + ' edge ' + edge + ' touch ' + touch + '\nscreen ' + screen.width + 'x' + screen.height + ' dpr ' + devicePixelRatio +
      '\ninner ' + innerWidth + 'x' + innerHeight + ' vv ' + (vv ? Math.round(vv.width) + 'x' + Math.round(vv.height) + ' @' + vv.scale.toFixed(3) : '-') +
      '\nenv top ' + e.t + ' bottom ' + e.b + ' scrollY ' + Math.round(scrollY) +
      '\nV ' + G.V + ' hs ' + G.hs + ' top ' + G.top + ' run ' + G.run + '\nsb ' + G.sb + ' ext ' + G.ext + ' U ' + G.U;
  }, 500);
})();
