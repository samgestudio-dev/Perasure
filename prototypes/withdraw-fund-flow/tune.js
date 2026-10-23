/* Withdraw fund flow — Tune panel (prototype only: delete this file, tune.css and their two lines in index.html; the
   page then uses its defaults: no blur, the numbers in data-props, Smooth).
   Runs in <head>: reads the settings (this phone's saved values; ?blur=1|0, ?available=, ?total=, ?temporary= in the
   link win) into window.WD_TUNE for withdraw.js, and marks <html data-variant="blur"> before the page renders.
   Changing a setting saves it and reloads the page with it. */
(function(){
  var KEY = 'perasure.withdraw.tune', T = {}, root = document.documentElement;
  try { T = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { T = {}; }
  var saved = JSON.parse(JSON.stringify(T)), q = new URLSearchParams(location.search), fromLink = [];
  if (q.has('blur')) { T.blur = q.get('blur') === '1' ? 1 : 0; fromLink.push('blur'); }
  ['available', 'total', 'temporary'].forEach(function(k){ if (q.has(k) && isFinite(+q.get(k))) { T[k] = +q.get(k); fromLink.push(k); } });
  window.WD_TUNE = T;
  if (T.blur) root.setAttribute('data-variant', 'blur');

  var DEF = { blur:0, available:40000, total:50000, temporary:10000, feel:'Smooth' };
  var get = function(k){ return T[k] != null ? T[k] : DEF[k]; };
  function apply(patch){
    Object.keys(patch).forEach(function(k){ saved[k] = patch[k]; });
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    /* the link's own settings would override the change: drop them */
    var u = new URL(location.href); ['blur', 'available', 'total', 'temporary'].forEach(function(k){ u.searchParams.delete(k); });
    location.replace(u.href);
  }
  function peso(v){ return '₱' + Math.round(v).toLocaleString('en-US'); }
  function build(){
    var btn = document.createElement('button'); btn.id = 'wdTuneBtn'; btn.type = 'button'; btn.textContent = 'Tune';
    var catcher = document.createElement('div'); catcher.id = 'wdTuneCatch';
    var p = document.createElement('div'); p.id = 'wdTune'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Tune');
    p.innerHTML = '<div class="hd"><b>Tune</b><button type="button" data-a="reset">Reset</button><button type="button" data-a="copy">Copy</button><button type="button" data-a="close">Close</button></div>';
    function seg(label, key, opts){
      var row = document.createElement('div'); row.className = 'row';
      row.innerHTML = '<span>' + label + '</span><output></output><div class="seg"></div>';
      opts.forEach(function(o){
        var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1]; if (get(key) === o[0]) b.className = 'on';
        b.addEventListener('click', function(){ var x = {}; x[key] = o[0]; apply(x); });
        row.querySelector('.seg').appendChild(b);
      });
      p.appendChild(row);
    }
    function range(label, key, min, max, step){
      var row = document.createElement('label'); row.className = 'row';
      row.innerHTML = '<span>' + label + '</span><output></output><input type="range">';
      var inp = row.querySelector('input'), out = row.querySelector('output');
      inp.min = min; inp.max = max; inp.step = step; inp.value = get(key);
      var show = function(){ out.textContent = peso(+inp.value) + (+inp.value === DEF[key] ? '' : ' •'); };
      inp.addEventListener('input', show);
      inp.addEventListener('change', function(){ var x = {}; x[key] = +inp.value; apply(x); });
      show(); p.appendChild(row);
    }
    seg('Blur (header and bottom bars)', 'blur', [[0, 'Off'], [1, 'On']]);
    range('Available amount', 'available', 0, 200000, 500);
    range('Total credit', 'total', 1000, 200000, 1000);
    range('Temporary credit (used first)', 'temporary', 0, 100000, 500);
    seg('Motion feel', 'feel', [['Smooth', 'Smooth'], ['Snappy', 'Snappy'], ['Gentle', 'Gentle']]);
    var note = document.createElement('div'); note.className = 'note';
    note.textContent = 'Card bar: white = long-term credit still available, green = temporary credit still available. Changing a setting reloads the page with it; values are kept on this phone.' +
      (fromLink.length ? ' Set by the link: ' + fromLink.join(', ') + '.' : '');
    p.appendChild(note);
    function open(){ p.classList.add('on'); catcher.classList.add('on'); }
    function close(){ p.classList.remove('on'); catcher.classList.remove('on'); }
    btn.addEventListener('click', open); catcher.addEventListener('click', close);
    p.addEventListener('click', function(e){
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      if (a === 'close') close();
      if (a === 'reset') { saved = {}; apply({}); }
      if (a === 'copy') {
        var text = JSON.stringify(Object.assign({}, DEF, T)), b = e.target;
        var done = function(){ b.textContent = 'Copied'; setTimeout(function(){ b.textContent = 'Copy'; }, 1200); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function(){ prompt('Settings', text); });
        else prompt('Settings', text);
      }
    });
    document.body.appendChild(btn); document.body.appendChild(catcher); document.body.appendChild(p);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
