/* PeraSure Dev Mode — the platform: top bar, navigation, canvas, inspect; state in the address (#…) so any view can be shared. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, I = DM.inspect, t = function (k, v) { return DM.t(k, v); };
  var PAGES = window.DM_PAGES;

  /* ---- theme: system | light | dark (remembered) ---- */
  function stored(k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(th) { document.documentElement.setAttribute('data-theme', th === 'system' ? (mq.matches ? 'dark' : 'light') : th); }
  applyTheme(stored('perasure.devmode.theme', 'system'));
  DM.setLang(DM.lang);

  function routePage(r) {
    var B = PAGES.byId, all = Object.keys(B).map(function (k) { return B[k]; });
    if (r.sheet) return (B[r.sheet] && B[r.sheet].kind === 'sheet' && B[r.sheet]) || all.filter(function (p) { return p.kind === 'sheet' && (p.js || '').indexOf("'" + r.sheet + "'") >= 0; })[0] || null;
    if (r.screen === 'tabs') return B[r.tab] || null;
    return B[r.screen] || all.filter(function (p) { return p.page === r.screen || p.code === r.screen; })[0] || null;
  }

  function Toast() {
    var s = R.useState(null), msg = s[0], tm = R.useRef(0);
    DM.toast = function (m) { s[1](m); clearTimeout(tm.current); tm.current = setTimeout(function () { s[1](null); }, 1400); };
    return msg ? h('div', { className: 'dm-toast', role: 'status' }, msg) : null;
  }

  function PendingBadge(p) {
    var v = DM.useVisual(), n = v && !v.none ? v.changed.length + v.added.length : 0;
    return n ? h('button', { type: 'button', className: 'dm-btn dm-pending', onClick: p.onOpen, title: t('vis.sub') }, h('i'), t('vis.badge', { n: n })) : null;
  }
  function Top(p) {
    var its = DM.iterations(), old = p.ver && p.ver !== DM.latest().id;
    var cur = DM.iteration(p.ver) || DM.latest();
    return h('header', { className: 'dm-top' },
      h('div', { className: 'dm-brand' }, h('span', { className: 'dm-brand__mark' }, h('img', { src: '../shared/ps-ui/assets/logos/perasure-mark.svg', alt: '' })),
        h('span', null, 'PeraSure'), h('span', { className: 'dm-brand__tag' }, t('brand.sub'))),
      h('nav', { className: 'dm-crumbs' }, p.crumbs.map(function (c, i) { return h(R.Fragment, { key: i }, i ? h(DM.Icon, { name: 'chevron', size: 12 }) : null, i === p.crumbs.length - 1 ? h('b', null, c) : h('span', null, c)); })),
      h('div', { className: 'dm-top__right' },
        h('label', { className: DM.cx('dm-select', old && 'is-old'), title: t('version') },
          h('select', { value: cur.id, onChange: function (e) { p.onVer(e.target.value === DM.latest().id ? null : e.target.value); } },
            its.map(function (it, i) { return h('option', { key: it.id, value: it.id }, it.label + (i === 0 ? ' · ' + t('version.latest') : '') + (it.jira ? '' : '')); })),
          h(DM.Icon, { name: 'down', size: 12 })),
        h(PendingBadge, { onOpen: p.onPending }),
        h('button', { type: 'button', className: 'dm-btn is-outline', onClick: p.onAi, title: t('ai.title') }, h(DM.Icon, { name: 'spark', size: 14 }), t('ai.button')),
        h('button', { type: 'button', className: 'dm-btn is-outline', onClick: p.onCompare }, h(DM.Icon, { name: 'compare', size: 14 }), t('compare')),
        h('span', { className: 'dm-toolbar__sep' }),
        h('div', { className: 'dm-seg', role: 'group', 'aria-label': 'Theme' }, [['system', 'monitor'], ['light', 'sun'], ['dark', 'moon']].map(function (x) {
          return h('button', { key: x[0], type: 'button', className: p.theme === x[0] ? 'is-on' : '', title: t('theme.' + x[0]), onClick: function () { p.onTheme(x[0]); } }, h(DM.Icon, { name: x[1], size: 14 }));
        })),
        h('button', { type: 'button', className: 'dm-btn is-outline dm-lang', title: DM.lang === 'en' ? '切换到中文' : 'Switch to English', onClick: p.onLang }, h(DM.Icon, { name: 'globe', size: 14 }), t('lang'))));
  }

  function App() {
    var hs = DM.useHashState(), H = hs[0], setH = hs[1];
    var view = H.v || 'pages';
    var th = R.useState(stored('perasure.devmode.theme', 'system')), theme = th[0];
    var lg = R.useState(DM.lang), setLangState = lg[1];
    var md = R.useState('inspect'), mode = md[0], setMode = md[1];
    /* device, Screen fit and Text size: saved in this browser; a link can carry them (#…&dev=390&fit=cap&tx=100) */
    var dv = R.useState(function () { return H.dev && DM.DEVICES.some(function (d) { return d.id === H.dev; }) ? H.dev : stored('perasure.devmode.device', '360'); }), device = dv[0];
    var sc = R.useState(function () { var s = DM.screenPrefs(); return { fit: DM.validFit(H.fit) || s.fit, text: DM.validText(H.tx) || s.text }; }), screen = sc[0];
    function setScreen(patch) { var n = Object.assign({}, screen, patch); store('perasure.devmode.fit', n.fit); store('perasure.devmode.text', String(n.text)); sc[1](n); }
    R.useEffect(function () {
      if (H.dev == null && H.fit == null && H.tx == null) return;
      if (H.dev && DM.DEVICES.some(function (d) { return d.id === H.dev; })) { store('perasure.devmode.device', H.dev); dv[1](H.dev); }
      setScreen({ fit: DM.validFit(H.fit) || screen.fit, text: DM.validText(H.tx) || screen.text });
      setH({ dev: null, fit: null, tx: null }, true);
    }, [H.dev, H.fit, H.tx]);
    DM._screen = { device: device, fit: screen.fit, text: screen.text };
    var zm = R.useState('fit'), zoom = zm[0];
    var tr = R.useState(null), T = tr[0], setT = tr[1];
    var hv = R.useState(null), hover = hv[0], setHover = hv[1];
    var lh = R.useState(null), layerHover = lh[0], setLayerHover = lh[1];
    var qs = R.useState(''), q = qs[0], setQ = qs[1];
    var rk = R.useState(0), reloadKey = rk[0], setReloadKey = rk[1];
    var winRef = R.useRef(null), autoSel = R.useRef(null), autoTry = R.useRef({});
    var ix = R.useState(0), bumpIdx = ix[1];
    var tk = R.useState(null), tokens = tk[0];

    /* an old gallery link (#v=components&find=couponoption) opens that component */
    R.useEffect(function () {
      if (!H.find) return;
      var f = H.find.toLowerCase(), hit = Object.keys(DM.IDX().components).filter(function (n) { return n.toLowerCase() === f; })[0];
      if (hit) setH({ find: null, c: hit }, true); else { setQ(H.find); setH({ find: null }, true); }
    }, [H.find]);
    var ver = H.ver && DM.iteration(H.ver) && H.ver !== DM.latest().id ? H.ver : null;
    /* an older version brings its own component index */
    R.useEffect(function () {
      if (!ver) { DM._idx = null; bumpIdx(function (x) { return x + 1; }); return; }
      DM.index(ver).then(function (ix) { DM._idx = ix; bumpIdx(function (x) { return x + 1; }); }, function () { DM._idx = null; });
    }, [ver]);
    R.useEffect(function () { if (view === 'tokens' && !tokens && DM.loadTokens) DM.loadTokens(DM.root(ver) + 'tokens/tokens.css').then(tk[1]); }, [view]);
    R.useEffect(function () { var f = function () { if (stored('perasure.devmode.theme', 'system') === 'system') applyTheme('system'); }; mq.addEventListener('change', f); return function () { mq.removeEventListener('change', f); }; }, []);

    /* the page in the canvas follows the list; in Interact the list follows the app (without reloading it) */
    var page = PAGES.byId[H.p] || PAGES.byId.home;
    var stateIdx = Math.max(0, +H.s || 0), state = page.states ? page.states[stateIdx] || page.states[0] : null;
    var ld = R.useState({ p: page.id, s: stateIdx }), load = ld[0], setLoad = ld[1];
    var routeDriven = R.useRef(false);
    R.useEffect(function () {
      if (routeDriven.current) { routeDriven.current = false; return; }
      if (load.p !== page.id || load.s !== stateIdx) setLoad({ p: page.id, s: stateIdx });
    }, [page.id, stateIdx]);
    var lpage = PAGES.byId[load.p] || page, lstate = lpage.states ? lpage.states[load.s] || lpage.states[0] : null;

    var comp = H.c && DM.IDX().components[H.c] ? DM.IDX().components[H.c] : null;
    var compState = Math.max(0, +H.cs || 0);
    var src = null, js = null, app = true, title = '', code = '', kind = 'screen', states = null;
    if (view === 'components' && comp) {
      title = 'PS.' + comp.name; kind = 'component'; app = false;
      if (comp.gallery) {
        src = DM.screenSrc(DM.root(ver) + 'shared/stage.html?entry=' + encodeURIComponent(comp.gallery) + '&state=' + compState + '&focus=' + comp.name + (ver ? '' : '&v=' + DM.STAMP), false, screen);
        states = (comp.states || []).map(function (s, i) { return { label: s, on: i === compState, onClick: function () { setH({ cs: i || null, sel: null }); } }; });
      }
      code = comp.file.split('/').pop() + ':' + comp.line;
    } else if (view === 'pages') {
      src = DM.screenSrc(PAGES.url(lpage, lstate, DM.root(ver)), true, screen); js = PAGES.js(lpage, lstate) || null;
      title = DM.pageName(page); kind = page.kind; code = page.kind === 'sheet' ? "APP.open('" + page.code + "')" : '?page=' + (page.page || page.code);
      states = page.states ? page.states.map(function (s, i) { return { label: DM.lang === 'en' ? s.en || s.name : s.name, on: i === stateIdx, onClick: function () { setH({ s: i || null, sel: null }); } }; }) : null;
    }
    var sel = H.sel || null;
    var node = T && sel ? I.resolve(T, sel) : null;

    /* ---- notes (Annotate): kept per page and state, or per component state ---- */
    var where = view === 'components' && comp ? 'c:' + comp.name + ':' + compState : 'p:' + page.id + ':' + stateIdx;
    var nsS = R.useState(function () { return DM.notesFor(where); }), notes = nsS[0];
    var edS = R.useState(null), editing = edS[0];
    var anS = R.useState(null), activeNote = anS[0];
    R.useEffect(function () { nsS[1](DM.notesFor(where)); edS[1](null); }, [where]);
    function setNotes(list) { DM.setNotes(where, list); nsS[1](list); }
    /* a link with notes (#…&notes=…) brings them into this browser and opens where they were made */
    R.useEffect(function () {
      if (!H.notes) return;
      var o = DM.decodeNotes(H.notes);
      if (!o) { setH({ notes: null }, true); return; }
      DM.importNotes(o);
      var m = /^([pc]):(.+):(\d+)$/.exec(o.w), patch = { notes: null, tab: 'notes' };
      if (m && m[1] === 'p') Object.assign(patch, { v: null, p: m[2], s: +m[3] || null });
      else if (m) Object.assign(patch, { v: 'components', c: m[2], cs: +m[3] || null });
      setH(patch, true);
      nsS[1](DM.notesFor(o.w));
      setTimeout(function () { if (DM.toast) DM.toast(t('nt.imported', { n: o.n.length })); }, 300);
    }, [H.notes]);
    function shareLink() { var l = DM.liveLink(); return l + (l.indexOf('#') < 0 ? '#' : '&') + 'notes=' + DM.encodeNotes(where, notes); }
    function editNote(n, x, y) { var pos = x == null ? DM._notePos(n) : { x: x, y: y }; edS[1]({ note: n, x: pos.x, y: pos.y, isNew: false }); }
    var noteTitle = view === 'components' && comp ? 'PS.' + comp.name + (comp.states && comp.states[compState] ? ' · ' + comp.states[compState] : '')
      : DM.pageName(page) + (state ? ' · ' + (DM.lang === 'en' ? state.en || state.name : state.name) : '');

    function select(path) { setH({ sel: path || null, tab: null }, true); }
    function openPage(id) { setH({ v: 'pages', p: id, s: null, sel: null, c: null, cs: null, tab: null }); setMode('inspect'); }
    function openComp(name) { setH({ v: 'components', c: name, cs: null, sel: null, tab: null }); setMode('inspect'); }
    function onRoute(r) {
      if (view !== 'pages' || mode !== 'interact') return;      /* a page's own start-up script moving on is not the user going somewhere */
      var pg = routePage(r); if (!pg || pg.id === page.id) return;
      routeDriven.current = true; setH({ p: pg.id, s: null, sel: null }, true);
    }
    function changeLang() { var l = DM.lang === 'en' ? 'zh' : 'en'; DM.setLang(l); setLangState(l); }
    function changeTheme(x) { store('perasure.devmode.theme', x); th[1](x); applyTheme(x); }
    function openCompare(a, b) {
      var its = DM.iterations(), cur = ver || DM.latest().id, i = its.map(function (x) { return x.id; }).indexOf(cur);
      setH({ cmp: (a || (its[i + 1] || its[i]).id) + '..' + (b || cur) });
    }

    var crumbs = [];
    if (view === 'pages') { var sec = PAGES.sections.filter(function (s) { return s.id === page.section; })[0]; crumbs = [t('nav.pages'), sec ? (DM.lang === 'en' ? sec.en : sec.name) : '', DM.pageName(page)]; }
    else if (view === 'components') crumbs = [t('nav.components'), comp ? DM.tx(DM.FILES[comp.file.split('/').pop()] || comp.file) : '', comp ? comp.name : ''];
    else if (view === 'tokens') crumbs = [t('nav.tokens'), t('tk.' + (H.cat || 'color'))];
    else crumbs = [t('nav.iterations'), H.it === 'pending' ? t('vis.title') : (DM.iteration(H.it) || DM.latest()).label];
    if (node && view !== 'tokens' && view !== 'iterations') crumbs.push(I.label(node));

    var banner = ver ? h('div', { className: 'dm-banner' }, h(DM.Icon, { name: 'history', size: 14 }), t('version.viewing') + ' · ' + DM.iteration(ver).label,
      h('button', { type: 'button', className: 'dm-btn', onClick: function () { setH({ ver: null }); } }, t('back.latest'))) : null;

    var center;
    if (view === 'tokens') center = h('main', { className: 'dm-center' }, DM.TokenView ? h(DM.TokenView, { tokens: tokens, cat: H.cat || 'color', onCat: function (c) { setH({ cat: c }, true); } }) : null);
    else if (view === 'iterations' && H.it === 'pending') center = h('main', { className: 'dm-center' }, h(DM.VisualView, { onComp: openComp, onPage: function (id, st) { setH({ v: null, p: id, s: st || null, sel: null, it: null }); } }));
    else if (view === 'iterations') center = h('main', { className: 'dm-center' }, DM.IterView ? h(DM.IterView, { id: H.it, onIter: function (id) { setH({ it: id }); }, onPage: openPage, onComp: openComp, onVersion: function (id) { setH({ ver: id === DM.latest().id ? null : id, v: 'pages' }); }, onCompare: openCompare }) : null);
    else if (view === 'components' && !comp) center = h('main', { className: 'dm-center' }, h(DM.Empty, { icon: 'component' }, t('comp.count', { n: Object.keys(DM.IDX().components).length }) + ' · ' + t('search.components')));
    else if (view === 'components' && comp && !comp.gallery) center = h('main', { className: 'dm-center' }, DM.StageMissing ? h(DM.StageMissing, { comp: comp, onPage: openPage }) : null);
    else center = h(DM.Canvas, { src: src, js: js, app: app, device: device, fit: screen.fit, text: screen.text, zoom: zoom, mode: mode, sel: sel, extHover: layerHover, reloadKey: reloadKey,
      title: title, code: code, kind: kind, states: states, banner: banner,
      notes: notes, activeNote: activeNote,
      onAnnotate: function (a) { edS[1]({ note: { i: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), p: a.p, x: a.x, y: a.y, t: '', k: 'ui', c: Date.now() }, x: a.sx, y: a.sy, isNew: true }); },
      onEditNote: editNote,
      onSelect: select, onHover: setHover, onMode: function (m) { setMode(m); if (m === 'annotate') setH({ tab: 'notes' }, true); }, onRoute: onRoute,
      onTree: function (tt) {
        setT(tt);
        /* a component opened from Components starts selected, so Inspect shows it as drawn */
        if (view === 'components' && comp && !H.sel && autoSel.current !== src) {
          autoSel.current = src;
          var first = tt.list.filter(function (n) { return n.name === comp.name; })[0];
          if (first) { setH({ sel: first.path }, true); return; }
          /* an entry that shows several components may draw this one only in a later state: look there (once), else stay on the first */
          var A = autoTry.current, nst = (comp.states || []).length;
          if (A.comp !== comp.name) A = autoTry.current = { comp: comp.name, n: 0, done: false, manual: H.cs != null };
          if (A.done || A.manual) return;
          if (A.n + 1 < nst) { A.n++; setH({ cs: A.n }, true); }
          else { A.done = true; if (A.n) setH({ cs: null }, true); }
        }
      },
      onZoom: zm[1], onDevice: function (d) { store('perasure.devmode.device', d); dv[1](d); }, onFit: function (f) { setScreen({ fit: f }); }, onText: function (n) { setScreen({ text: n }); }, onReload: function () { setReloadKey(reloadKey + 1); },
      winRef: winRef });

    var doc = view === 'tokens' || view === 'iterations';
    var win = null; try { var fr = document.querySelector('.dm-frame iframe'); win = fr && fr.contentWindow && fr.contentWindow.PS ? fr.contentWindow : null; } catch (e) {}
    var cmp = H.cmp ? H.cmp.split('..') : null;

    return h(R.Fragment, null,
      h('div', { className: DM.cx('dm-app', doc && 'is-doc') },
        h(Top, { crumbs: crumbs.filter(Boolean), ver: ver, theme: theme, onTheme: changeTheme, onLang: changeLang, onVer: function (v) { setH({ ver: v }); }, onCompare: function () { openCompare(); }, onAi: function () { setH({ ai: 1 }); }, onPending: function () { setH({ v: 'iterations', it: 'pending', sel: null }); } }),
        h(DM.Left, { view: view, onView: function (v) { setQ(''); setH({ v: v === 'pages' ? null : v, sel: null, tab: null }); }, q: q, onQ: setQ,
          page: page.id, onPage: openPage, comp: H.c, onComp: openComp, iter: H.it || DM.latest().id, onIter: function (id) { setH({ it: id }); },
          cat: H.cat || 'color', onCat: function (c) { setH({ cat: c }, true); }, tokens: tokens,
          T: view === 'pages' || (view === 'components' && comp && comp.gallery) ? T : null, sel: sel, onSelect: select, hover: hover, onHoverLayer: setLayerHover }),
        center,
        doc ? null : h(DM.Right, { node: node, compName: view === 'components' && comp ? comp.name : null, page: view === 'pages' ? page : null, state: state, T: T, win: win, version: ver,
          tab: H.tab === 'history' || H.tab === 'notes' ? H.tab : 'inspect', onTab: function (x) { setH({ tab: x === 'inspect' ? null : x }, true); },
          notes: { notes: notes, mode: mode, active: activeNote, title: noteTitle, T: T, shareLink: shareLink,
            onMode: function (m) { setMode(m); }, onHover: anS[1], onEdit: function (n) { editNote(n); }, onSelect: function (path) { setMode('inspect'); setH({ sel: path, tab: null }, true); },
            onClear: function () { setNotes([]); } },
          onSelect: select, onComp: openComp, onPage: openPage, onVersion: function (id) { setH({ ver: id === DM.latest().id ? null : id }); }, onCompare: openCompare })),
      cmp && DM.Compare ? h(DM.Compare, { a: cmp[0], b: cmp[1], page: page, state: state, comp: comp, onChange: function (a, b) { setH({ cmp: a + '..' + b }, true); }, onClose: function () { setH({ cmp: null }); } }) : null,
      H.ai && DM.AiSetup ? h(DM.AiSetup, { onClose: function () { setH({ ai: null }); } }) : null,
      editing ? h(DM.NoteEditor, { key: editing.note.i, note: editing.note, x: editing.x, y: editing.y, target: DM.noteLabel(T, editing.note),
        number: editing.isNew ? notes.length + 1 : notes.map(function (n) { return n.i; }).indexOf(editing.note.i) + 1,
        onCancel: function () { edS[1](null); },
        onSave: function (n) { setNotes(editing.isNew ? notes.concat([n]) : notes.map(function (x) { return x.i === n.i ? n : x; })); edS[1](null); },
        onDelete: editing.isNew ? null : function () { setNotes(notes.filter(function (x) { return x.i !== editing.note.i; })); edS[1](null); } }) : null,
      h(Toast));
  }

  window.addEventListener('DOMContentLoaded', function () {
    window.ReactDOM.createRoot(document.getElementById('dm')).render(h(App));
  });
})();
