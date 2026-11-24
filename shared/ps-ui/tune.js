/* PeraSure UI — Tune panel for prototypes (prototype only: production pages leave tune.js / tune.css out and use the defaults).
   Load in <head> after phone-fit.js, then describe the settings once:
     PSTune.setup({ key: 'perasure.<demo>.tune', settings: [
       { key: 'fit', label: 'Screen fit', options: [['cap', 'Capped zoom'], ['1', '1:1']], def: 'cap' },
       … ], note: 'One line on what the settings do.' });
   Values: PSTune.get('fit') (also window.PS_TUNE). The link wins over saved values (?fit=1); changing a setting saves it
   on this phone and reloads the page with it. (The progressive-blur setting was removed with tokens v2026.11.17: bars have no
   progressive blur any more — an old ?blur= in a link is ignored.)
   Open the panel with PSTune.open() — React pages use PS.TuneButton (layout.js); { button: true } adds a floating one.
   Groups (owner 2026-11-24: sorted, not one long list): an entry { heading: 'Title', note: '…', kind: 'scenario' | undefined, lock: true }
   starts a group; the settings after it belong to it. kind 'scenario': special cases, each a test of its own (shown apart, tinted);
   lock: the group is dimmed and marked as not used while any scenario is on. A setting may carry desc (a line under its label). */
(function () {
  var root = document.documentElement, cfg = null, T = {}, saved = {}, fromLink = [];
  function str(v) { return v == null ? '' : String(v); }
  function setup(c) {
    cfg = c; var q = new URLSearchParams(location.search);
    try { T = JSON.parse(localStorage.getItem(c.key) || '{}') || {}; } catch (e) { T = {}; }
    saved = JSON.parse(JSON.stringify(T));
    var list = c.settings.filter(function (s) { return s.key; });
    c.settings.forEach(function (s) { if (s.heading) s.kind = s.kind || null; });
    list.forEach(function (s) { if (q.has(s.key)) { T[s.key] = q.get(s.key); fromLink.push(s.key); } });
    window.PS_TUNE = {};
    list.forEach(function (s) {
      var v = T[s.key] != null ? T[s.key] : s.def, hit = s.options.filter(function (o) { return str(o[0]) === str(v); })[0];
      window.PS_TUNE[s.key] = hit ? hit[0] : s.def;
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  }
  function apply(patch) {
    Object.keys(patch).forEach(function (k) { saved[k] = patch[k]; });
    try { localStorage.setItem(cfg.key, JSON.stringify(saved)); } catch (e) {}
    var u = new URL(location.href); cfg.settings.forEach(function (s) { if (s.key) u.searchParams.delete(s.key); });
    location.replace(u.href);
  }
  var panel, catcher;
  function build() {
    catcher = document.createElement('div'); catcher.id = 'psTuneCatch';
    panel = document.createElement('div'); panel.id = 'psTune'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Tune');
    panel.innerHTML = '<div class="th"><b>Tune</b><button type="button" data-a="reset">Reset</button><button type="button" data-a="close">Close</button></div>';
    /* a scenario is on when one of its settings is off its default */
    var kind = null, scen = false;
    cfg.settings.forEach(function (s) { if (s.heading) kind = s.kind; else if (kind === 'scenario' && str(window.PS_TUNE[s.key]) !== str(s.def)) scen = true; });
    var box = panel, gk = null;
    cfg.settings.forEach(function (s) {
      if (s.heading) {
        gk = s.kind;
        box = document.createElement('section'); box.className = 'tg' + (s.kind === 'scenario' ? ' tg--scen' : '') + (s.lock && scen ? ' is-locked' : '');
        if (s.kind === 'scenario') {
          /* special cases: a header that opens and closes the list (open while one is on, or as it was left this visit) */
          var key = cfg.key + '.scenOpen', was = null; try { was = sessionStorage.getItem(key); } catch (e) {}
          var open = scen || was === '1';
          if (!open) box.classList.add('is-shut');
          var hb = document.createElement('button'); hb.type = 'button'; hb.className = 'tgx'; hb.setAttribute('aria-expanded', open ? 'true' : 'false');
          hb.innerHTML = '<span class="tgh"></span><i class="tgc" aria-hidden="true"></i>'; hb.firstChild.textContent = s.heading + (scen ? ' · 1 on' : '');
          var sec = box;
          hb.addEventListener('click', function () { var shut = sec.classList.toggle('is-shut'); hb.setAttribute('aria-expanded', shut ? 'false' : 'true'); try { sessionStorage.setItem(key, shut ? '0' : '1'); } catch (e) {} });
          box.appendChild(hb);
          var body = document.createElement('div'); body.className = 'tgb';
          var inner = document.createElement('div'); inner.className = 'tgi'; body.appendChild(inner);   /* one child, so the 0fr row can fold all of it */
          if (s.note) { var sn = document.createElement('div'); sn.className = 'tgn'; sn.textContent = s.note; inner.appendChild(sn); }
          var ul = document.createElement('ul'); ul.className = 'tsl'; inner.appendChild(ul);
          box.appendChild(body); panel.appendChild(box); box = ul; return;
        }
        var hd = document.createElement('div'); hd.className = 'tgh'; hd.textContent = s.heading; box.appendChild(hd);
        var nt = s.lock && scen ? 'Not used while a special case is on.' : s.note;
        if (nt) { var n = document.createElement('div'); n.className = 'tgn'; n.textContent = nt; box.appendChild(n); }
        panel.appendChild(box); return;
      }
      if (gk === 'scenario') {
        /* a special case: one list row — its name, ⓘ (the description in a bubble), and a switch (off = its default, on = the other option) */
        var on = str(window.PS_TUNE[s.key]) !== str(s.def), other = s.options.filter(function (o) { return str(o[0]) !== str(s.def); })[0];
        var li = document.createElement('li'); li.className = 'tsr';
        li.innerHTML = '<span class="tsn"></span><button type="button" class="tsi" aria-label="About this case">i</button><button type="button" class="tsw" role="switch"><i></i></button>';
        li.firstChild.textContent = s.label;
        var sw = li.lastChild; sw.setAttribute('aria-checked', on ? 'true' : 'false'); sw.setAttribute('aria-label', s.label);
        sw.addEventListener('click', function () { var x = {}; x[s.key] = on ? s.def : other[0]; apply(x); });
        if (s.desc) {
          var tip = document.createElement('div'); tip.className = 'tst'; tip.setAttribute('role', 'tooltip'); tip.textContent = s.desc; li.appendChild(tip);
          li.children[1].addEventListener('click', function () { var was = li.classList.contains('is-tip'); [].forEach.call(panel.querySelectorAll('.tsr.is-tip'), function (r) { r.classList.remove('is-tip'); }); if (!was) li.classList.add('is-tip'); });
        } else li.children[1].style.display = 'none';
        box.appendChild(li); return;
      }
      var row = document.createElement('div'); row.className = 'tr';
      row.innerHTML = '<span></span><div class="ts"></div>'; row.firstChild.textContent = s.label;
      if (s.desc) { var d = document.createElement('small'); d.textContent = s.desc; row.insertBefore(d, row.lastChild); }
      s.options.forEach(function (o) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = o[1];
        if (str(window.PS_TUNE[s.key]) === str(o[0])) b.className = 'on';
        b.addEventListener('click', function () { var x = {}; x[s.key] = o[0]; apply(x); });
        row.lastChild.appendChild(b);
      });
      box.appendChild(row);
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
