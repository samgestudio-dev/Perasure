/* PeraSure Dev Mode — helpers shared by every part: React shorthands, icons, versions, iterations, statuses, links. */
(function () {
  'use strict';
  var R = window.React, h = R.createElement;
  var DM = window.DM = window.DM || {};
  DM.h = h; DM.R = R;
  DM.REPO = 'https://github.com/samgestudio-dev/Perasure';
  DM.JIRA = 'https://kylith.atlassian.net/browse/';
  DM.STAMP = (function () { var s = document.querySelector('script[src*="js/util.js"]'), m = s && /[?&]v=(\w+)/.exec(s.src); return m ? m[1] : '0'; })();
  DM.cx = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  /* ---- icons (16 px, stroke 1.25, currentColor) ---- */
  var P = {
    frame: 'M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11',
    sheet: 'M3 6.5h10v7H3zM5.5 4h5',
    component: 'M8 1.8l2.6 2.6L8 7 5.4 4.4zM8 9l2.6 2.6L8 14.2l-2.6-2.6zM4.4 5.4L7 8l-2.6 2.6L1.8 8zM11.6 5.4L14.2 8l-2.6 2.6L9 8z',
    instance: 'M8 2l6 6-6 6-6-6z',
    page: 'M4 2.5h5.5L12 5v8.5H4zM9.5 2.5V5H12',
    chevron: 'M6 4l4 4-4 4',
    down: 'M4 6l4 4 4-4',
    search: 'M7 12A5 5 0 107 2a5 5 0 000 10zM10.6 10.6L14 14',
    cursor: 'M4 2.5l8.5 5.2-3.8.9 2.3 4.2-1.6.8-2.3-4.2-3.1 2.4z',
    play: 'M5 3l8 5-8 5z',
    compare: 'M2.5 3.5h4.5v9H2.5zM9 3.5h4.5v9H9z',
    history: 'M8 14A6 6 0 102 8M2 4.5V8h3.5M8 5v3l2 1.5',
    link: 'M6.5 9.5l3-3M7 4.6l1.1-1.1a2.6 2.6 0 013.7 3.7L10.7 8.3M9 11.4l-1.1 1.1a2.6 2.6 0 01-3.7-3.7L5.3 7.7',
    copy: 'M5.5 5.5h7v7h-7zM3.5 10.5v-7h7',
    external: 'M9 3h4v4M13 3L7.5 8.5M11 9.5V13H3V5h3.5',
    check: 'M3.5 8.5l3 3 6-7',
    close: 'M4 4l8 8M12 4l-8 8',
    minus: 'M3.5 8h9', plus: 'M8 3.5v9M3.5 8h9',
    fit: 'M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10',
    layers: 'M8 2l6 3.2-6 3.2-6-3.2zM2 8l6 3.2L14 8M2 10.8L8 14l6-3.2',
    ui: 'M2.5 3.5h11v9h-11zM2.5 6h11',
    motion: 'M2 11c2.5 0 3-6 6-6s3.5 6 6 6',
    figma: 'M6 2.5h4a2 2 0 010 4H6zM6 6.5h4a2 2 0 010 4H6zM6 10.5h2a2 2 0 11-2 2zM6 2.5a2 2 0 000 4M6 6.5a2 2 0 000 4',
    code: 'M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5',
    jira: 'M8 2l6 6-6 6-6-6zM8 5.5L10.5 8 8 10.5 5.5 8z',
    dot: 'M8 6a2 2 0 110 4 2 2 0 010-4z',
    info: 'M8 14A6 6 0 108 2a6 6 0 000 12zM8 7.2V11M8 5v.1',
    eye: 'M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8zM8 10a2 2 0 100-4 2 2 0 000 4z',
    replay: 'M3 8a5 5 0 105-5H5.5M7 1.5L5 3l2 1.5',
    slow: 'M8 14A6 6 0 108 2a6 6 0 000 12zM8 4.5V8l-2.5 2',
    sync: 'M3 6.5A5 5 0 0112.4 5M13 9.5A5 5 0 013.6 11M12.5 2.5V5H10M3.5 13.5V11H6',
    filter: 'M2.5 3.5h11l-4.3 5v4l-2.4 1v-5z',
    dev: 'M5.5 5L2.5 8l3 3M10.5 5l3 3-3 3M9 3.5l-2 9',
    sun: 'M8 11a3 3 0 100-6 3 3 0 000 6zM8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1',
    moon: 'M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 107 7z',
    monitor: 'M2 3h12v8H2zM6 14h4M8 11v3',
    globe: 'M8 14.5A6.5 6.5 0 108 1.5a6.5 6.5 0 000 13zM1.5 8h13M8 1.5c-2 2-2.8 4.2-2.8 6.5S6 12.5 8 14.5M8 1.5c2 2 2.8 4.2 2.8 6.5S10 12.5 8 14.5',
    token: 'M8 2.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM8 5.5v5M5.5 8h5',
    color: 'M8 2s4.5 4.7 4.5 7.5a4.5 4.5 0 01-9 0C3.5 6.7 8 2 8 2z',
    space: 'M2.5 3v10M13.5 3v10M5 8h6M5 8l1.5-1.5M5 8l1.5 1.5M11 8l-1.5-1.5M11 8l-1.5 1.5',
    radius: 'M3 13V8a5 5 0 015-5h5',
    type: 'M3 4V3h10v1M8 3v10M6 13h4',
    shadow: 'M3 3h8v8H3zM5 13h8V5',
    more: 'M4 8h.01M8 8h.01M12 8h.01',
    image: 'M2.5 3.5h11v9h-11zM2.5 10.5l3-3 3 3 2-2 3 3M10.5 6.5a1 1 0 100-2 1 1 0 000 2z',
    pin: 'M8 14s-4.5-4.2-4.5-7.5a4.5 4.5 0 019 0C12.5 9.8 8 14 8 14zM8 8.2a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z',
    pen: 'M10.5 3l2.5 2.5L6 12.5 3 13l.5-3zM9.3 4.2l2.5 2.5',
    spark: 'M8 2.5l1.3 3.2L12.5 7 9.3 8.3 8 11.5 6.7 8.3 3.5 7l3.2-1.3zM12.5 11l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z'
  };
  DM.Icon = function Icon(p) {
    var s = p.size || 16;
    return h('svg', { className: DM.cx('dm-icon', p.className), width: s, height: s, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: p.weight || 1.25,
      strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: p.style }, h('path', { d: P[p.name] || P.dot }));
  };

  /* ---- versions: the live app is the latest; every iteration with a snapshot can be opened ---- */
  DM.iterations = function () { return window.DM_ITERATIONS || []; };
  /* the component index of the version in the canvas (the app swaps it in when an older snapshot is open) */
  DM.IDX = function () { return DM._idx || window.DM_INDEX; };
  DM.latest = function () { return DM.iterations()[0]; };
  DM.iteration = function (id) { return DM.iterations().filter(function (x) { return x.id === id; })[0]; };
  /* the folder an iteration runs from: the live repo for the latest, its snapshot for an older one */
  DM.root = function (id) { return !id || id === DM.latest().id ? '../' : 'snapshots/' + id + '/'; };
  DM.ref = function (id) { return !id || id === DM.latest().id ? 'main' : 'devmode-' + id; };
  DM.gh = function (file, a, b, id) { return DM.REPO + '/blob/' + DM.ref(id) + '/' + file + (a ? '#L' + a + (b && b !== a ? '-L' + b : '') : ''); };
  DM.figmaUrl = function (n) { return n.url || ('https://www.figma.com/design/' + (n.file || 'OBsvf42AiRapcRrasD7KNm') + '/?node-id=' + String(n.id).replace(':', '-')); };
  /* a Figma link (or a node id) → the components and pages that name that node (index: comments + data/figma-links.js) */
  DM.parseFigma = function (q) {
    q = String(q || '').trim();
    var m = /node-id=([0-9]+)(?:-|%3A|:)([0-9]+)/i.exec(q) || (/^([0-9]+)[:-]([0-9]+)$/.exec(q));
    if (!m) return null;
    var f = /figma\.com\/(?:design|file|proto)\/([0-9a-zA-Z]{10,})/.exec(q);
    return { id: m[1] + ':' + m[2], file: f ? f[1] : null };
  };
  DM.figmaFind = function (ix, fig) {
    var comps = [], pages = [];
    Object.keys(ix.components).forEach(function (n) { var c = ix.components[n]; if ((c.figma || []).some(function (f) { return f.id === fig.id && (!fig.file || f.file === fig.file); })) comps.push(c); });
    Object.keys(ix.pages || {}).forEach(function (k) { var pg = ix.pages[k]; if ((pg.figma || []).some(function (f) { return f.id === fig.id && (!fig.file || f.file === fig.file); })) pages.push(pg); });
    return { comps: comps, pages: pages };
  };
  DM.jiraUrl = function (j) { return j ? (j.url || DM.JIRA + j.key) : null; };

  /* the iterations that changed a page or a component (newest first), and the last one ('v1.0' when none did) */
  DM.historyOf = function (kind, id) {
    return DM.iterations().filter(function (it) {
      return it.baseline || (it.changes || []).some(function (c) { return (c[kind] || []).indexOf(id) >= 0; });
    });
  };
  DM.changesIn = function (it, kind, id) { return (it.changes || []).filter(function (c) { return !kind || (c[kind] || []).indexOf(id) >= 0; }); };
  DM.lastOf = function (kind, id) { var l = DM.historyOf(kind, id); return l[0] || DM.iterations()[DM.iterations().length - 1]; };

  /* ---- statuses (Figma Dev Mode: Ready for dev · Changed · Completed) ---- */
  DM.STATUS = { ready: { label: 'Ready for dev', zh: '可开发', tone: 'ready' }, changed: { label: 'Changed', zh: '已改动', tone: 'changed' }, completed: { label: 'Completed', zh: '开发完成', tone: 'completed' } };
  DM.statusOf = function (kind, id) {
    var S = window.DM_STATUS || {}, map = (kind === 'pages' ? S.pages : S.components) || {};
    return map[id] || S.default || { status: 'ready', since: 'v1.0' };
  };
  DM.StatusPill = function StatusPill(p) {
    var st = DM.STATUS[p.status && p.status.status] || DM.STATUS.ready;
    return h('span', { className: 'dm-status is-' + st.tone, title: st.label + (p.status && p.status.since ? ' · ' + p.status.since : '') },
      h('i'), p.short ? null : h('span', null, DM.lang === 'en' ? st.label : st.zh));
  };

  /* ---- copy ---- */
  DM.copy = function (text, toast) {
    var done = function () { if (DM.toast) DM.toast(toast || (DM.t ? DM.t('copied') : 'Copied')); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (e) {} t.remove(); }
  };

  /* ---- fetching a version's files (cached) ---- */
  var cache = {};
  DM.text = function (url) {
    if (!cache[url]) cache[url] = fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.text(); });
    return cache[url];
  };
  /* the component index of a version: the live one is loaded with the page; a snapshot has its own devmode-index.js */
  var idx = {};
  DM.index = function (id) {
    if (!id || id === DM.latest().id) return Promise.resolve(window.DM_INDEX);
    if (!idx[id]) idx[id] = DM.text(DM.root(id) + 'devmode-index.js').then(function (t) { return JSON.parse(t.slice(t.indexOf('=') + 1).trim().replace(/;\s*$/, '')); });
    return idx[id];
  };
  DM.lines = function (text, a, b) { return text.split('\n').slice(a - 1, b).join('\n'); };

  /* ---- small React pieces ---- */
  DM.useHashState = function () {
    var read = function () { var o = {}; location.hash.replace(/^#/, '').split('&').forEach(function (kv) { if (!kv) return; var i = kv.indexOf('='); o[decodeURIComponent(i < 0 ? kv : kv.slice(0, i))] = i < 0 ? '' : decodeURIComponent(kv.slice(i + 1)); }); return o; };
    var s = R.useState(read), st = s[0];
    R.useEffect(function () { var f = function () { s[1](read()); }; window.addEventListener('hashchange', f); return function () { window.removeEventListener('hashchange', f); }; }, []);
    function set(patch, replace) {
      var n = Object.assign({}, read(), patch); Object.keys(n).forEach(function (k) { if (n[k] == null || n[k] === '') delete n[k]; });
      var hs = '#' + Object.keys(n).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(n[k]); }).join('&');
      if (replace) history.replaceState(null, '', hs); else history.pushState(null, '', hs);
      s[1](n);
    }
    return [st, set];
  };
  DM.Tabs = function Tabs(p) {
    return h('div', { className: DM.cx('dm-tabs', p.className), role: 'tablist' }, p.items.map(function (it) {
      return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': p.value === it.id, className: DM.cx('dm-tab', p.value === it.id && 'is-on'), onClick: function () { p.onChange(it.id); } },
        it.icon ? h(DM.Icon, { name: it.icon, size: 14 }) : null, it.label, it.count != null ? h('span', { className: 'dm-tab__n' }, it.count) : null);
    }));
  };
  DM.Section = function Section(p) {
    var s = R.useState(p.open !== false), open = s[0];
    return h('section', { className: DM.cx('dm-sec', !open && 'is-closed', p.className) },
      h('button', { type: 'button', className: 'dm-sec__head', onClick: function () { s[1](!open); } },
        h('span', null, p.title), p.extra ? h('span', { className: 'dm-sec__extra', onClick: function (e) { e.stopPropagation(); } }, p.extra) : null,
        h(DM.Icon, { name: 'down', size: 12, className: 'dm-sec__chev' })),
      open ? h('div', { className: 'dm-sec__body' }, p.children) : null);
  };
  DM.Copyable = function Copyable(p) {
    return h('button', { type: 'button', className: DM.cx('dm-copyable', p.className), title: (DM.t ? DM.t('copy') : 'Copy') + ' ' + (p.copy != null ? p.copy : ''), onClick: function () { DM.copy(String(p.copy != null ? p.copy : p.children)); } }, p.children);
  };
  DM.ExtLink = function ExtLink(p) {
    return h('a', { className: DM.cx('dm-res', p.className), href: p.href, target: '_blank', rel: 'noopener' },
      h('span', { className: 'dm-res__icon' }, h(DM.Icon, { name: p.icon || 'external', size: 14 })), h('span', { className: 'dm-res__text' }, h('b', null, p.title), p.sub ? h('small', null, p.sub) : null),
      h(DM.Icon, { name: 'external', size: 12, className: 'dm-res__go' }));
  };
  DM.Empty = function Empty(p) { return h('div', { className: 'dm-empty' }, p.icon ? h(DM.Icon, { name: p.icon, size: 20 }) : null, h('p', null, p.children)); };
})();
