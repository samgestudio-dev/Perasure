/* Withdraw fund flow — start-up. Points the page at its files and the shared libraries, puts withdraw.js into the
   page's <script data-dc-script> and then starts the Claude Design runtime, which renders the <x-dc> markup with it. */
(function(){
  var me = document.currentScript, m = /[?&]v=([^&]+)/.exec(me && me.src || ''), q = m ? '?v=' + m[1] : '';
  var abs = function(p){ return new URL(p, document.baseURI).href; };
  window.__resources = {
    framerMotion: abs('../../vendor/motion@14.4.0/motion-react.js'),   /* Motion (React API), shared */
    motionTokens: abs('motion-tokens.js' + q),                          /* this page's animation constants */
    mayaLogo: abs('assets/maya-logo.png')
  };
  fetch('withdraw.js' + q).then(function(r){ if (!r.ok) throw new Error(r.status + ' ' + r.url); return r.text(); })
    .then(function(src){
      document.querySelector('script[data-dc-script]').textContent = src;
      var s = document.createElement('script'); s.src = 'runtime/dc-runtime.js' + q; document.head.appendChild(s);
    })
    .catch(function(e){ console.error('[withdraw] could not load withdraw.js:', e); });
})();
