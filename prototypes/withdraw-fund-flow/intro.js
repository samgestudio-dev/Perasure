/* Withdraw fund flow — Credit limit intro: the Credit limit increase animation plays full screen first, then, 3 s after it
   ends, it leaves and the Withdraw home settles in underneath. The Credit limit page is the deliverable itself
   (../credit-limit-coins/baked/baked-heap.html), loaded in a frame — not a copy — and told the numbers through its link:
   the amount goes up from (available − temporary) to the available amount (+temporary), valid until the temporary
   credit's end date — so it ends on the very number the home card shows.

   Smoothness: while the intro plays, this page does not start its own runtime (boot.js waits for WD_INTRO.ready), so
   nothing competes with the coins; the home is built during the 3 s hold and is fully drawn before the exit.
   Exit — the same interaction as picking a term in "Apply a loan" (the full page closes in to the order card): one
   progress 0→1 on the page's spring (Tune → Motion feel; Smooth = stiffness 240, damping 30) drives everything, like the
   sheet's morph does:
     · the Credit limit screen's edges close in to the home card's exact box, corners rounding to 24, its colour turning
       from the dark to the card's blue; its content stays where it is and fades out as the edges come in;
     · the amount carries over — a copy of the card's amount, started at the big number's place and size, travels and
       shrinks onto the card's "Available amount" (the decimals fade in on the way): one element the whole way;
     · once the closed-in screen covers the real card exactly, it fades and the card is simply there; the cards below
       rise in one after another, then the tab bar.
   A tap after the animation has ended skips the rest of the hold.
   Used by with-credit-limit.html (the variant with the intro); index.html does not load it. */
(function(){
  var T = window.WD_TUNE || {};
  var root = document.documentElement; root.classList.add('wd-intro');
  var HOLD = 3000;
  var me = document.currentScript, mv = /[?&]v=([^&]+)/.exec(me && me.src || ''), v = mv ? mv[1] : '';
  var avail = Number(T.available != null ? T.available : 40000), temp = Number(T.temporary != null ? T.temporary : 10000);
  if (!(temp > 0)) temp = 10000;
  var from = Math.max(0, avail - temp);
  var till = '2026-11-20';                                      /* the temporary credit's end date (card: "valid till Nov 20") */
  var resolveReady, ready = new Promise(function(r){ resolveReady = r; }), started = false;
  window.WD_INTRO = { ready:ready };
  function startHome(){ if (!started) { started = true; resolveReady(); } }

  function homeDrawn(){ return !!document.querySelector('#dc-root .ps-home-in') && !!document.querySelector('#dc-root img[alt="PeraSure"]'); }
  var leaving = false, holdTimer = 0;
  function leave(){
    if (leaving) return; leaving = true; clearTimeout(holdTimer); startHome();
    /* the home must be on screen before the intro leaves (it is, well within the hold; this only guards slow loads) */
    var t0 = performance.now();
    (function wait(){ if (homeDrawn() || performance.now() - t0 > 4000) requestAnimationFrame(function(){ requestAnimationFrame(go); }); else setTimeout(wait, 50); })();
  }
  /* the page's springs (motion-tokens.js FEEL), stepped here so the exit rides the same curve as the sheet's morph */
  var FEEL = { Smooth:[240, 30, 1], Snappy:[430, 34, 0.8], Gentle:[140, 24, 1.15] };
  function spring(onUpdate, onDone){
    var P = FEEL[(window.WD_TUNE || {}).feel] || FEEL.Smooth, K = P[0], C = P[1], M = P[2], x = 0, v = 0, last = null;
    (function tick(now){
      if (last === null) last = now;
      var dt = Math.min(0.064, (now - last) / 1000); last = now;
      for (var n = 0; n < 8; n++) { var h = dt / 8, a = (-K * (x - 1) - C * v) / M; v += a * h; x += v * h; }
      var rest = Math.abs(1 - x) < 0.0005 && Math.abs(v) < 0.005;
      onUpdate(rest ? 1 : x);
      if (rest) onDone(); else requestAnimationFrame(tick);
    })(performance.now());
  }
  /* 0 before a, 1 after b, smoothstep between — the same windows the sheet's morph uses */
  function win(k, a, b){ var t = Math.max(0, Math.min(1, (k - a) / (b - a))); return t * t * (3 - 2 * t); }
  function mixHex(a, b, k){
    var h = function(c){ return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }, x = h(a), y = h(b);
    k = Math.max(0, Math.min(1, k));
    return 'rgb(' + x.map(function(c, i){ return Math.round(c + (y[i] - c) * k); }).join(',') + ')';
  }

  function go(){
    var box = document.getElementById('wdIntro'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var f = box.querySelector('iframe'), tgt = document.querySelector('[data-wd-amount]');
    var card = tgt; while (card && card !== document.body && getComputedStyle(card).borderTopLeftRadius !== '24px') card = card.parentElement;
    function finish(){
      if (tgt) tgt.style.opacity = '';
      if (fly) fly.remove();
      root.classList.remove('wd-intro', 'wd-intro-out');
      if (f) { f.src = 'about:blank'; f.remove(); }                  /* the Credit limit page is freed */
      box.remove();
      window.dispatchEvent(new Event('wd-intro-done'));
    }
    var fly = null;
    root.classList.add('wd-intro-out');
    if (reduce || !card || card === document.body) {
      box.animate([{ opacity:1 }, { opacity:0 }], { duration:300, easing:'linear', fill:'forwards' }).finished.then(finish);
      return;
    }
    /* measure everything first, before anything moves */
    var B = box.getBoundingClientRect(), CR = card.getBoundingClientRect();
    var to = { t:CR.top - B.top, r:B.right - CR.right, b:B.bottom - CR.bottom, l:CR.left - B.left };
    var cardBlue = '#2c74be';
    var src = null;
    try {
      var d = f && f.contentDocument, a = d && d.getElementById('amount');
      if (a) { var fr = f.getBoundingClientRect(), ar = a.getBoundingClientRect();
        src = { el:a, x:fr.left + ar.left + ar.width / 2, y:fr.top + ar.top + ar.height / 2, size:parseFloat(f.contentWindow.getComputedStyle(a).fontSize) }; }
    } catch (e) {}
    var F = null;
    if (src && tgt && src.size) {
      var tr = tgt.getBoundingClientRect(), kids = tgt.children, main = kids[0].getBoundingClientRect(), last = kids[1].getBoundingClientRect();
      /* a copy of the card's amount at the card's place, started on the big number (scaled and moved) */
      fly = tgt.cloneNode(true); fly.removeAttribute('data-wd-amount');
      fly.style.cssText += ';position:fixed;margin:0;left:' + tr.left + 'px;top:' + tr.top + 'px;width:' + tr.width + 'px;height:' + tr.height +
        'px;z-index:101;transform-origin:0 0;pointer-events:none;will-change:transform';
      var s0 = src.size / 36, mx = (main.left + last.right) / 2 - tr.left, my = (main.top + main.bottom) / 2 - tr.top;
      F = { s0:s0, dx:src.x - tr.left - s0 * mx, dy:src.y - tr.top - s0 * my, dec:fly.children[2] };
      document.body.appendChild(fly);
      src.el.style.visibility = 'hidden';                            /* the same frame: the big number is now the flyer */
      tgt.style.opacity = '0';
    }
    /* what rises in below the card, in order (the header and tab bar too) */
    var items = [].slice.call(document.querySelectorAll('.ps-home-in > *')).filter(function(el){ return !el.contains(card); });
    var logo = document.querySelector('img[alt="PeraSure"]'), head = logo && logo.parentElement && logo.parentElement.parentElement;
    var bar = document.querySelector('.ps-tabbar');
    var rise = [], fades = [];
    if (head) fades.push(head);
    items.forEach(function(el){ rise.push(el); });
    if (bar) rise.push(bar);
    rise.concat(fades).forEach(function(el){ el.style.willChange = 'transform, opacity'; });
    box.style.willChange = 'clip-path';
    if (f) f.style.willChange = 'opacity';

    function frame(k){
      var c = Math.max(0, Math.min(1, k));
      /* edges close in to the card's box, corners round to 24 (k may overshoot a hair; geometry clamps) */
      box.style.clipPath = 'inset(' + (to.t * c).toFixed(2) + 'px ' + (to.r * c).toFixed(2) + 'px ' + (to.b * c).toFixed(2) + 'px ' + (to.l * c).toFixed(2) +
        'px round ' + (24 * c).toFixed(2) + 'px)';
      box.style.backgroundColor = mixHex('#0d1620', cardBlue, win(k, 0.15, 0.85));
      if (f) f.style.opacity = (1 - win(k, 0, 0.45)).toFixed(3);   /* its content stays put and fades as the edges come in */
      box.style.opacity = (1 - win(k, 0.72, 1)).toFixed(3);          /* closing on the real card (same blue): hand over to it */
      if (F) {
        fly.style.transform = 'translate(' + (F.dx * (1 - k)).toFixed(2) + 'px,' + (F.dy * (1 - k)).toFixed(2) + 'px) scale(' + (F.s0 + (1 - F.s0) * k).toFixed(4) + ')';
        if (F.dec) F.dec.style.opacity = win(k, 0.45, 0.9).toFixed(3);
      }
      rise.forEach(function(el, i){
        var e = win(k, 0.22 + i * 0.08, 0.72 + i * 0.08);
        el.style.opacity = e.toFixed(3); el.style.transform = e >= 1 ? '' : 'translateY(' + ((1 - e) * (el === bar ? 10 : 16)).toFixed(2) + 'px)';
      });
      fades.forEach(function(el){ el.style.opacity = win(k, 0.1, 0.6).toFixed(3); });
    }
    frame(0);
    spring(frame, function(){
      rise.concat(fades).forEach(function(el){ el.style.opacity = ''; el.style.transform = ''; el.style.willChange = ''; });
      finish();
    });
  }

  function mount(){
    var box = document.getElementById('wdIntro');
    if (!box) { box = document.createElement('div'); box.id = 'wdIntro'; document.body.insertBefore(box, document.body.firstChild); }
    var f = document.createElement('iframe');
    f.title = 'Credit limit increase'; f.setAttribute('allow', 'autoplay');
    f.src = '../credit-limit-coins/baked/baked-heap.html?old=' + from + '&new=' + avail + '&inc=' + (avail - from) + '&exp=' + till + (v ? '&v=' + v : '');
    f.addEventListener('load', function(){
      try {
        var d = f.contentDocument, s = d.createElement('style');
        s.textContent = '#replay{visibility:hidden!important}';        /* no Replay inside the intro (its space kept: same layout as the page on its own) */
        d.head.appendChild(s);
        d.addEventListener('click', function(){ if (doneAt) leave(); }, true);
      } catch (e) {}
    });
    f.addEventListener('error', function(){ leave(); });
    box.appendChild(f);
  }
  var doneAt = 0;
  window.addEventListener('message', function(e){
    var t = e.data && e.data.type;
    if (t === 'creditlimit:done' && !doneAt) {
      doneAt = performance.now();
      startHome();                                                  /* build the home during the hold */
      holdTimer = setTimeout(leave, HOLD);
    }
  });
  /* never stuck: if the Credit limit page does not report back, leave anyway */
  setTimeout(function(){ if (!doneAt) leave(); }, 12000);
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
