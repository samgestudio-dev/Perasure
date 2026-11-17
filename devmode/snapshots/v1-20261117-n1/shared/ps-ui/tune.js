/* PeraSure UI — Tune panel for prototypes (prototype only: production pages leave tune.js / tune.css out and use the defaults).
   Load in <head> after phone-fit.js, then describe the settings once:
     PSTune.setup({ key: 'perasure.<demo>.tune', settings: [
       { key: 'fit', label: 'Screen fit', options: [['cap', 'Capped zoom'], ['1', '1:1']], def: 'cap' },
       … ], note: 'One line on what the settings do.' });
   Values: PSTune.get('fit') (also window.PS_TUNE). The link wins over saved values (?fit=1); changing a setting saves it
   on this phone and reloads the page with it. (The progressive-blur setting was removed with tokens v2026.11.17: bars have no
   progressive blur any more — an old ?blur= in a link is ignored.)
   Open the panel with PSTune.open() — React pages use PS.TuneButton (layout.js); { button: true } adds a floating one. */
(function () {
  var root = document.documentElement, cfg = null, T = {}, saved = {}, fromLink = [];
  function str(v) { return v == null ? '' : String(v); }
  function setup(c) {
    cfg = c; var q = new URLSearchParams(location.search);
    try { T = JSON.parse(localStorage.getItem(c.key) || '{}') || {}; } catch (e) { T = {}; }
    saved = JSON.parse(JSON.stringify(T));
    c.settings.forEach(function (s) { if (q.has(s.key)) { T[s.key] = q.get(s.key); fromLink.push(s.key); } });
    window.PS_TUNE = {};
    c.settings.forEach(function (s) {
      var v = T[s.key] != null ? T[s.key] : s.def, hit = s.options.filter(function (o) { return str(o[0]) === str(v); })[0];
      window.PS_TUNE[s.key] = hit ? hit[0] : s.def;
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  }
  function apply(patch) {
    Object.keys(patch).forEach(function (k) { saved[k] = patch[k]; });
    try { localStorage.setItem(cfg.key, JSON.stringify(saved)); } catch (e) {}
    var u = new URL(location.href); cfg.settings.forEach(function (s) { u.searchParams.delete(s.key); });
    location.replace(u.href);
  }
  var panel, catcher;
  function build() {
    catcher = document.createElement('div'); catcher.id = 'psTuneCatch';
    panel = document.createElement('div'); panel.id = 'psTune'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Tune');
    panel.innerHTML = '<div class="th"><b>Tune</b><button type="button" data-a="reset">Reset</button><button type="button" data-a="close">Close</button></div>';
    cfg.settings.forEach(function (s) {
      var row = document.createElement('div'); row.className = 'tr';
      row.innerHTML = '<span></span><div class="ts"></div>'; row.firstChild.textContent = s.label;
      s.options.forEach(function (o) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1];
        if (str(window.PS_TUNE[s.key]) === str(o[0])) b.className = 'on';
        b.addEventListener('click', function () { var x = {}; x[s.key] = o[0]; apply(x); });
        row.lastChild.appendChild(b);
      });
      panel.appendChild(row);
    });
    var note = document.createElement('div'); note.className = 'tn';
    note.textContent = (cfg.note ? cfg.note + ' ' : '') + 'Changing a setting reloads the page with it; values are kept on this phone.' +
      (fromLink.length ? ' Set by the link: ' + fromLink.join(', ') + '.' : '');
    panel.appendChild(note);
    catcher.addEventListener('click', close);
    panel.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      if (a === 'close') close();
      if (a === 'reset') { saved = {}; apply({}); }
    });
    document.body.appendChild(catcher); document.body.appendChild(panel);
    if (cfg.button) { var b = document.createElement('button'); b.type = 'button'; b.className = 'ps-tune-btn ps-tune-btn--float'; b.textContent = 'Tune'; b.addEventListener('click', open); document.body.appendChild(b); }
  }
  function open() { if (panel) { panel.classList.add('on'); catcher.classList.add('on'); } }
  function close() { if (panel) { panel.classList.remove('on'); catcher.classList.remove('on'); } }
  window.PSTune = { setup: setup, open: open, close: close, get: function (k) { return window.PS_TUNE ? window.PS_TUNE[k] : undefined; } };
})();
