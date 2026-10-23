/* Withdraw fund flow — phone page fitting (runs in <head>, before the page renders). */
/* ---- Phone page -----------------------------------------------------------------
   The screen itself is the page: no backdrop, no device frame, and the mock
   status bar (40px) is never shown — the phone has its own.
   The design is 360 CSS px wide, so on a touch screen the layout viewport is set
   to 360 px and the browser scales it to the screen width. Taller than the
   design, the extra goes below (keypad and sheet follow the bottom); shorter,
   the empty band between the amount and the caption gives up to 100px; shorter
   still, the viewport gets a little wider (narrow side margins).

   iOS Safari 26+ (Liquid Glass): the status bar and the floating search bar sit
   OVER the page, so the page runs edge to edge (viewport-fit=cover) instead of
   being cut at the visible area:
     · the top gradient blur grows upward behind the status bar (same layers,
       taller), header controls stay just below it;
     · the bottom blur grows downward behind the search bar, and the tab bar /
       Confirm button keep 24px above the search bar;
     · the document is scrolled by the status-bar height (a "scroll runway"),
       which is what makes Safari draw real page pixels behind the status bar
       instead of a flat colour.
   Chrome and other browsers keep the plain behaviour.
   ?edge=1 / ?edge=0 forces the Safari mode on / off, ?debug=1 shows the numbers. */
(function(){
  var root = document.documentElement, meta = document.querySelector('meta[name="viewport"]'), lastR = 0;
  var ua = navigator.userAgent, qs = location.search;
  var touch = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
  var iosSafari = /iP(hone|od)/.test(ua) && /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|DuckDuckGo|YaBrowser/.test(ua);
  var ver = +((/Version\/(\d+)/.exec(ua) || [])[1] || 0);
  var edge = /[?&]edge=1/.test(qs) || (iosSafari && ver >= 26 && !/[?&]edge=0/.test(qs));
  root.classList.add('ps-phone'); if (edge) root.classList.add('ps-edge');
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
    var r = window.innerHeight / window.innerWidth;           // visible aspect, the same at any zoom
    if (!(r > 0)) return;
    if (!force && lastR && Math.abs(r - lastR) / lastR < 0.01) { runway(); return; }
    /* rotation re-fits at once; a toolbar showing / hiding (a few % of height)
       is settled first, so it never re-renders the page under the user's finger */
    if (!force && lastR && Math.abs(r - lastR) / lastR < 0.2) { clearTimeout(timer); timer = setTimeout(function(){ fit(true); }, 200); return; }
    lastR = r;
    var V, W = 360;
    if (touch) { W = Math.max(360, Math.ceil(600 / r)); V = Math.floor(W * r);
      if (meta) meta.setAttribute('content', 'width=' + W + ', user-scalable=no' + (edge ? ', viewport-fit=cover' : '')); }
    else V = Math.max(600, window.innerHeight);
    var top = 0, sb = 0, ext = 0, hs = V, run = 0;
    if (edge) {
      var e = env(), land = window.innerWidth > window.innerHeight;
      var sw = land ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
      var sh = land ? Math.min(screen.width, screen.height) : Math.max(screen.width, screen.height);
      var k = touch ? W / sw : 1;                                 // CSS px per point
      hs = Math.round(sh * k);                                     // whole screen, CSS px
      if (!touch) hs = V + 140;                                    // desktop preview of the mode
      if (e.t > 0) { top = e.t; run = 0; }                         // Safari already lays out under the status bar
      else { top = Math.round(statusPt(sh) * k); run = top; }      // viewport starts below it: scroll by it
      var zone = Math.max(0, hs - V - (run ? top : 0));           // what is under the toolbar
      sb = e.b > 40 ? e.b : Math.max(e.b, zone - Math.round(15 * k));   // search-bar top above the screen bottom
      ext = Math.max(0, top - 40);                                 // header grows up by this much
    }
    var U = edge ? hs - sb - (top - 40) : V + 40;                  // usable frame height (status mock + content)
    G.W = W; G.V = V; G.hs = hs; G.top = top; G.sb = sb; G.ext = ext; G.run = run; G.U = U; G.ver = ver; G.edge = edge;
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
  window.addEventListener('resize', function(){ fit(false); });
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
      '\nW ' + G.W + ' V ' + G.V + ' hs ' + G.hs + ' top ' + G.top + ' run ' + G.run + '\nsb ' + G.sb + ' ext ' + G.ext + ' U ' + G.U;
  }, 500);
})();
