/* PeraSure Dev Mode — the left column: Pages / Components / Tokens / Iterations, a search, and the Layers of what is in the canvas. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, t = function (k, v) { return DM.t(k, v); };

  DM.FILES = {
    'core.js': { zh: '基础', en: 'Basics' }, 'layout.js': { zh: '布局与导航', en: 'Layout & navigation' }, 'feedback.js': { zh: '加载与反馈', en: 'Loading & feedback' },
    'form.js': { zh: '表单', en: 'Forms' }, 'coupon.js': { zh: '优惠券', en: 'Coupons' }, 'home.js': { zh: '首页', en: 'Home' }, 'status.js': { zh: '首页状态', en: 'Home states' },
    'loan.js': { zh: '借款', en: 'Borrowing' }, 'pay.js': { zh: '还款', en: 'Repayment' }, 'account.js': { zh: '账户', en: 'Account' }, 'list.js': { zh: '列表', en: 'Lists' },
    'apply.js': { zh: '申请', en: 'Applying' }, 'fx.js': { zh: '动效', en: 'Motion' }
  };
  function match(q) { q = (q || '').trim().toLowerCase(); return function () { if (!q) return true; for (var i = 0; i < arguments.length; i++) if (arguments[i] && String(arguments[i]).toLowerCase().indexOf(q) >= 0) return true; return false; }; }

  function Group(p) {
    var s = R.useState(p.open !== false), open = s[0] || !!p.force;
    return h('div', { className: DM.cx('dm-group', open && 'is-open') },
      h('button', { type: 'button', className: 'dm-group__head', onClick: function () { s[1](!open); } }, h(DM.Icon, { name: 'chevron', size: 12 }), h('span', null, p.title), h('span', null, p.count)),
      open ? p.children : null);
  }
  function Row(p) {
    var ref = R.useRef(null);
    R.useEffect(function () { if (p.on && ref.current) ref.current.scrollIntoView({ block: 'nearest' }); }, [p.on]);
    return h('button', { ref: ref, type: 'button', className: DM.cx('dm-row', p.on && 'is-on'), onClick: p.onClick, title: p.title },
      h('span', { className: DM.cx('dm-row__icon', p.comp && 'is-comp') }, h(DM.Icon, { name: p.icon, size: 14 })),
      h('span', { className: 'dm-row__text' }, h('b', null, p.name), p.sub ? h('small', null, p.sub) : null),
      p.right || null);
  }
  function statusMark(kind, id) {
    var s = DM.statusOf(kind, id);
    return s.status === 'ready' ? null : h(DM.StatusPill, { status: s, short: true });
  }

  function PagesList(p) {
    var m = match(p.q), any = false;
    var groups = window.DM_PAGES.sections.map(function (sec) {
      var rows = sec.pages.filter(function (pg) { return m(pg.name, pg.en, pg.id, pg.page, pg.code); });
      if (!rows.length) return null; any = true;
      return h(Group, { key: sec.id, title: DM.lang === 'en' ? sec.en : sec.name, count: rows.length, force: !!p.q },
        rows.map(function (pg) {
          return h(Row, { key: pg.id, on: p.page === pg.id && p.view === 'pages', icon: pg.kind === 'sheet' ? 'sheet' : 'frame', name: DM.pageName(pg), sub: pg.code,
            right: statusMark('pages', pg.id), onClick: function () { p.onPage(pg.id); } });
        }));
    });
    return any ? groups : h(DM.Empty, { icon: 'search' }, '—');
  }
  function CompList(p) {
    var idx = DM.IDX().components, by = {}, m = match(p.q);
    Object.keys(idx).sort().forEach(function (n) {
      var c = idx[n]; if (!m(n, c.doc, c.gallery)) return;
      var f = c.file.split('/').pop(); (by[f] = by[f] || []).push(c);
    });
    var files = Object.keys(DM.FILES).filter(function (f) { return by[f]; }).concat(Object.keys(by).filter(function (f) { return !DM.FILES[f]; }));
    if (!files.length) return h(DM.Empty, { icon: 'search' }, '—');
    return files.map(function (f) {
      return h(Group, { key: f, title: DM.FILES[f] ? DM.tx(DM.FILES[f]) : f, count: by[f].length, force: !!p.q, open: !!p.q || by[f].some(function (c) { return c.name === p.comp; }) },
        by[f].map(function (c) {
          var first = (c.doc || '').split('\n')[0].replace(/^[A-Za-z]+:\s*/, '').replace(new RegExp('^' + c.name + '\\s*[:·—-]\\s*'), '');
          return h(Row, { key: c.name, on: p.comp === c.name && p.view === 'components', icon: 'component', comp: true, name: c.name, sub: first, title: c.doc,
            right: statusMark('components', c.name), onClick: function () { p.onComp(c.name); } });
        }));
    });
  }
  function IterList(p) {
    var vis = DM.useVisual ? DM.useVisual() : null, pend = vis && !vis.none ? vis.changed.length + vis.added.length : 0;
    var top = h(Row, { key: '__pending', on: p.iter === 'pending', icon: 'eye', name: t('vis.title'), sub: vis && !vis.none ? t('vis.against', { v: vis.against }) : t('loading'),
      right: vis && !vis.none ? h('span', { className: 'dm-chip ' + (pend ? 'is-edit' : 'is-add') }, pend || '✓') : null, onClick: function () { p.onIter('pending'); } });
    return [top].concat(DM.iterations().map(function (it, i) {
      var ui = (it.changes || []).filter(function (c) { return c.type === 'ui'; }).length, mo = (it.changes || []).length - ui;
      return h(Row, { key: it.id, on: p.iter === it.id, icon: 'history', name: it.label, sub: it.date + ' · ' + DM.tx(it.title),
        right: h('span', { className: 'dm-row__chips' }, ui ? h('span', { className: 'dm-chip is-ui' }, ui) : null, mo ? h('span', { className: 'dm-chip is-motion' }, mo) : null, i === 0 ? h('span', { className: 'dm-chip' }, t('version.latest')) : null),
        onClick: function () { p.onIter(it.id); } });
    }));
  }
  function TokenCats(p) {
    var cats = p.tokens ? p.tokens.cats : [];
    if (!p.tokens) return h(DM.Empty, null, t('loading'));
    return h('div', { className: 'dm-group is-open' }, cats.map(function (c) {
      return h(Row, { key: c.id, on: p.cat === c.id, icon: c.icon, name: t('tk.' + c.id), sub: c.items.length + '', onClick: function () { p.onCat(c.id); } });
    }));
  }

  /* ---- layers: the components in the canvas, nested as React renders them ---- */
  function Layer(p) {
    var n = p.node, open = p.open[n.path] != null ? p.open[n.path] : p.depth < 2 || (p.sel && p.sel.indexOf(n.path + '>') === 0) || (p.sel && p.sel.indexOf(n.path + '|') === 0);
    var on = p.sel === n.path, hov = p.hover === n.path, ref = R.useRef(null);
    R.useEffect(function () { if (on && ref.current) ref.current.scrollIntoView({ block: 'nearest' }); }, [on]);
    var page = n.kind === 'page' || n.kind === 'tab';
    var icon = page ? 'frame' : n.sheet ? 'sheet' : 'instance';
    return h(R.Fragment, null,
      h('button', { ref: ref, type: 'button', className: DM.cx('dm-layer', on && 'is-on', hov && 'is-hover'), style: { paddingLeft: 8 + p.depth * 14 },
          onClick: function () { p.onSelect(n.path); }, onMouseEnter: function () { p.onHover(n.path); }, onMouseLeave: function () { p.onHover(null); } },
        h('span', { className: DM.cx('dm-layer__tw', open && 'is-open'), onClick: function (e) { e.stopPropagation(); p.toggle(n.path, !open); } }, n.children.length ? h(DM.Icon, { name: 'chevron', size: 10 }) : null),
        h('span', { className: DM.cx('dm-layer__icon', page && 'is-page') }, h(DM.Icon, { name: icon, size: 12 })),
        h('span', { className: 'dm-layer__name' }, page ? (DM.pageName(window.DM_PAGES.byId[n.id]) || n.name) : I().label(n), page ? h('small', null, n.id) : null)),
      open ? n.children.map(function (c) { return h(Layer, Object.assign({}, p, { key: c.path, node: c, depth: p.depth + 1 })); }) : null);
  }
  function I() { return DM.inspect; }
  function Layers(p) {
    var o = R.useState({}), open = o[0];
    var toggle = function (path, v) { var n = Object.assign({}, open); n[path] = v; o[1](n); };
    var roots = p.T ? p.T.root.children : [];
    return h('div', { className: 'dm-layers' },
      h('div', { className: 'dm-paneltitle' }, h('span', null, t('layers')), h('small', null, p.T ? p.T.list.length : '')),
      h('div', { className: 'dm-scroll' }, roots.length ? roots.map(function (n) {
        return h(Layer, { key: n.path, node: n, depth: 0, open: open, toggle: toggle, sel: p.sel, hover: p.hover, onSelect: p.onSelect, onHover: p.onHover });
      }) : h(DM.Empty, { icon: 'layers' }, t('layers.empty'))));
  }

  /* a Figma link in the search: what it is built as */
  function FigmaResults(p) {
    var fig = p.fig, r = DM.figmaFind(DM.IDX(), fig), byCode = {};
    Object.keys(window.DM_PAGES.byId).forEach(function (k) { var x = window.DM_PAGES.byId[k]; byCode[x.code] = byCode[x.code] || x; });
    var any = r.comps.length || r.pages.length;
    return h('div', { className: 'dm-group is-open' },
      h('div', { className: 'dm-fighead' }, h(DM.Icon, { name: 'figma', size: 14 }), t('fig.node', { id: fig.id })),
      r.comps.map(function (c) { return h(Row, { key: 'c' + c.name, icon: 'component', comp: true, name: 'PS.' + c.name, sub: c.file.split('/').pop() + ':' + c.line, onClick: function () { p.onComp(c.name); } }); }),
      r.pages.map(function (pg) { var reg = byCode[pg.id]; return reg ? h(Row, { key: 'p' + pg.id, icon: 'frame', name: DM.pageName(reg), sub: reg.code, onClick: function () { p.onPage(reg.id); } }) : null; }),
      any ? null : h(DM.Empty, { icon: 'figma' }, t('fig.none')));
  }

  /* p: view, onView, q, onQ, page, onPage, comp, onComp, iter, onIter, cat, onCat, tokens, T, sel, onSelect, hover, onHoverLayer */
  DM.Left = function Left(p) {
    var v = p.view;
    var tabs = [{ id: 'pages', label: t('nav.pages') }, { id: 'components', label: t('nav.components') }, { id: 'tokens', label: t('nav.tokens') }, { id: 'iterations', label: t('nav.iterations') }];
    var withLayers = v === 'pages' || v === 'components';
    var fig = (v === 'pages' || v === 'components') && DM.parseFigma(p.q);
    var list = fig ? h(FigmaResults, Object.assign({}, p, { fig: fig })) : v === 'pages' ? h(PagesList, p) : v === 'components' ? h(CompList, p) : v === 'iterations' ? h(IterList, p) : h(TokenCats, p);
    var searchable = v === 'pages' || v === 'components';
    return h('aside', { className: 'dm-left' },
      h(DM.Tabs, { items: tabs, value: v, onChange: p.onView }),
      searchable ? h('label', { className: 'dm-search' }, h(DM.Icon, { name: 'search', size: 14 }),
        h('input', { value: p.q || '', placeholder: t(v === 'pages' ? 'search.pages' : 'search.components') + t('fig.orLink'), onChange: function (e) { p.onQ(e.target.value); }, onKeyDown: function (e) { if (e.key === 'Escape') p.onQ(''); } })) : null,
      withLayers ? h('div', { className: 'dm-split' }, h('div', { className: 'dm-scroll' }, list),
        h(Layers, { T: p.T, sel: p.sel, hover: p.hover, onSelect: p.onSelect, onHover: p.onHoverLayer }))
        : h('div', { className: 'dm-scroll' }, list));
  };
})();
