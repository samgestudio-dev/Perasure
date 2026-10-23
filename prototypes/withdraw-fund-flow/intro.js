/* Withdraw fund flow — Credit limit intro: the Credit limit increase animation plays full screen first, then, 3 s after it
   ends, it leaves and the Withdraw home settles in underneath. The Credit limit page is the deliverable itself
   (../credit-limit-coins/baked/baked-heap.html), loaded in a frame — not a copy — and told the numbers through its link:
   the amount goes up from (available − temporary) to the available amount (+temporary), valid until the temporary
   credit's end date — so it ends on the very number the home card shows.

   Smoothness: while the intro plays, this page does not start its own runtime (boot.js waits for WD_INTRO.ready), so
   nothing competes with the coins; the home is built during the 3 s hold and is fully drawn before the exit.
   Exit (≈0.8 s): the amount carries over — it leaves the Credit limit screen and flies, shrinking, into the card's
   "Available amount" (one element the whole way: a copy of the card's amount, started at the big number's place and
   size, lands exactly on it; the decimals fade in on the way). Around it the Credit limit screen recedes into a rounded
   card and fades, the home settles from a slight zoom and its cards rise in one after another. A tap after the
   animation has ended skips the rest of the hold.
   Tune → "Credit limit intro" turns it off (on by default); ?intro=0 / ?intro=1 in the link too. */
(function(){
  var T = window.WD_TUNE || {}, q = new URLSearchParams(location.search);
  var on = q.has('intro') ? q.get('intro') !== '0' : T.intro !== 0;
  if (!on) return;
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
  function go(){
    var box = document.getElementById('wdIntro'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var EASE = 'cubic-bezier(0.32, 0.72, 0, 1)', SOFT = 'cubic-bezier(0.22, 0.61, 0.36, 1)', FADE = 'cubic-bezier(0.4, 0, 0.2, 1)';
    /* measure everything first, before anything moves */
    var f = box.querySelector('iframe'), src = null, tgt = document.querySelector('[data-wd-amount]');
    try {
      var d = f && f.contentDocument, a = d && d.getElementById('amount');
      if (a) { var fr = f.getBoundingClientRect(), ar = a.getBoundingClientRect();
        src = { el:a, x:fr.left + ar.left + ar.width / 2, y:fr.top + ar.top + ar.height / 2, size:parseFloat(f.contentWindow.getComputedStyle(a).fontSize) }; }
    } catch (e) {}
    var fly = null, flyAnims = [];
    if (!reduce && src && tgt && src.size) {
      var tr = tgt.getBoundingClientRect(), kids = tgt.children, main = kids[0].getBoundingClientRect(), last = kids[1].getBoundingClientRect();
      /* a copy of the card's amount, at the card's place; it starts scaled and moved onto the big number */
      fly = tgt.cloneNode(true); fly.removeAttribute('data-wd-amount');
      fly.style.cssText += ';position:fixed;margin:0;left:' + tr.left + 'px;top:' + tr.top + 'px;width:' + tr.width + 'px;height:' + tr.height +
        'px;z-index:101;transform-origin:0 0;pointer-events:none;will-change:transform';
      var k = src.size / 36;                                         /* the card's amount is 36px */
      var mx = (main.left + last.right) / 2 - tr.left, my = (main.top + main.bottom) / 2 - tr.top;   /* "₱40,000" without the decimals */
      var dx = src.x - tr.left - k * mx, dy = src.y - tr.top - k * my;
      document.body.appendChild(fly);
      src.el.style.visibility = 'hidden';                            /* the same frame: the big number is now the flyer */
      tgt.style.opacity = '0';
      flyAnims.push(fly.animate([{ transform:'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')' }, { transform:'translate(0px,0px) scale(1)' }],
        { duration:820, easing:EASE, fill:'both' }));
      var dec = fly.children[2];
      if (dec) flyAnims.push(dec.animate([{ opacity:0 }, { opacity:1 }], { duration:320, delay:380, easing:SOFT, fill:'both' }));
    }
    root.classList.add('wd-intro-out');
    var anims = [];
    if (reduce) anims.push(box.animate([{ opacity:1 }, { opacity:0 }], { duration:300, easing:'linear', fill:'forwards' }));
    else {
      /* the Credit limit screen recedes into a rounded card and fades (the amount has already left it) */
      anims.push(box.animate([{ opacity:1, transform:'scale(1)', borderRadius:'0px' }, { opacity:0, transform:'scale(0.93)', borderRadius:'40px' }],
        { duration:640, easing:FADE, fill:'forwards' }));
      /* the home settles from a slight zoom… */
      var frame = document.querySelector('.ps-frame');
      if (frame) anims.push(frame.animate([{ transform:'scale(1.04)', opacity:0.5 }, { transform:'scale(1)', opacity:1 }], { duration:820, easing:EASE }));
      /* …and its cards rise in one after another (the amount's card first, ready for the amount), then the tab bar */
      var items = [].slice.call(document.querySelectorAll('.ps-home-in > *'));
      var logo = document.querySelector('img[alt="PeraSure"]'), head = logo && logo.parentElement && logo.parentElement.parentElement;
      if (head) items.splice(1, 0, head);
      var bar = document.querySelector('.ps-tabbar'); if (bar) items.push(bar);
      items.forEach(function(el, i){
        anims.push(el.animate([{ transform:'translateY(' + (el === bar ? 10 : 16) + 'px)', opacity:0 }, { transform:'none', opacity:1 }],
          { duration:600, delay:60 + i * 60, easing:SOFT, fill:'backwards' }));
      });
    }
    Promise.all(anims.concat(flyAnims).map(function(x){ return x.finished; })).then(function(){
      if (tgt) tgt.style.opacity = '';
      if (fly) fly.remove();
      root.classList.remove('wd-intro', 'wd-intro-out');
      if (f) { f.src = 'about:blank'; f.remove(); }                  /* the Credit limit page is freed */
      box.remove();
      window.dispatchEvent(new Event('wd-intro-done'));
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
