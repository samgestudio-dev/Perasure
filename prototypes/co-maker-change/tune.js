/* Change co-maker — Tune panel (prototype only: delete this file, tune.css and their two lines in index.html; the page
   then uses its defaults: progressive blur on, Smooth). Same kind of panel as the withdraw demo's.
   Runs in <head>: reads the settings (this phone's saved values; ?blur=1|0 and ?feel= in the link win) into
   window.CM_TUNE for co-maker.js, and marks <html data-blur="off"> before the page renders.
   Changing a setting saves it and reloads the page with it. */
(function(){
  var KEY = 'perasure.comaker.tune', T = {}, root = document.documentElement;
  try { T = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { T = {}; }
  var saved = JSON.parse(JSON.stringify(T)), q = new URLSearchParams(location.search), fromLink = [];
  if (q.has('blur')) { T.blur = q.get('blur') === '0' ? 0 : 1; fromLink.push('blur'); }
  if (q.has('feel')) { T.feel = q.get('feel'); fromLink.push('feel'); }

  var DEF = { blur: 1, feel: 'Smooth' };
  var get = function(k){ return T[k] != null ? T[k] : DEF[k]; };
  window.CM_TUNE = { blur: get('blur'), feel: get('feel') };
  if (!get('blur')) root.setAttribute('data-blur', 'off');

  function apply(patch){
    Object.keys(patch).forEach(function(k){ saved[k] = patch[k]; });
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    /* the link's own settings would override the change: drop them */
    var u = new URL(location.href); ['blur', 'feel'].forEach(function(k){ u.searchParams.delete(k); });
    location.replace(u.href);
  }
  function build(){
    var btn = document.createElement('button'); btn.id = 'cmTuneBtn'; btn.type = 'button'; btn.textContent = 'Tune';
    var catcher = document.createElement('div'); catcher.id = 'cmTuneCatch';
    var p = document.createElement('div'); p.id = 'cmTune'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Tune');
    p.innerHTML = '<div class="th"><b>Tune</b><button type="button" data-a="reset">Reset</button><button type="button" data-a="close">Close</button></div>';
    function seg(label, key, opts){
      var row = document.createElement('div'); row.className = 'tr';
      row.innerHTML = '<span>' + label + '</span><div class="ts"></div>';
      opts.forEach(function(o){
        var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1]; if (get(key) === o[0]) b.className = 'on';
        b.addEventListener('click', function(){ var x = {}; x[key] = o[0]; apply(x); });
        row.querySelector('.ts').appendChild(b);
      });
      p.appendChild(row);
    }
    seg('Progressive blur (header and bottom bars)', 'blur', [[1, 'On'], [0, 'Off']]);
    seg('Motion feel', 'feel', [['Smooth', 'Smooth'], ['Snappy', 'Snappy'], ['Gentle', 'Gentle']]);
    var note = document.createElement('div'); note.className = 'tn';
    note.textContent = 'Blur off: the withdraw home page\'s header and bottom gradients; the bottom one fades out as you scroll to the end. ' +
      'Changing a setting reloads the page with it; values are kept on this phone.' + (fromLink.length ? ' Set by the link: ' + fromLink.join(', ') + '.' : '');
    p.appendChild(note);
    function open(){ p.classList.add('on'); catcher.classList.add('on'); }
    function close(){ p.classList.remove('on'); catcher.classList.remove('on'); }
    btn.addEventListener('click', open); catcher.addEventListener('click', close);
    p.addEventListener('click', function(e){
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      if (a === 'close') close();
      if (a === 'reset') { saved = {}; apply({}); }
    });
    /* the button sits in the header, level with the back arrow (bottom-left would cover the page's primary button) */
    (document.getElementById('top') || document.body).appendChild(btn);
    document.body.appendChild(catcher); document.body.appendChild(p);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
