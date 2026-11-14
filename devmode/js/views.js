/* PeraSure Dev Mode — the document views: Tokens (the design system's tokens, read only) and Iterations (what each version changed),
   plus the note shown for a component that has no states in Components. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, t = function (k, v) { return DM.t(k, v); };

  /* ---- tokens: parsed from tokens/tokens.css in the browser (aliases followed to their value) ---- */
  var CATS = [
    { id: 'color', icon: 'color', test: /^--(color|gradient)-/ }, { id: 'space', icon: 'space', test: /^--spacing-/ },
    { id: 'radius', icon: 'radius', test: /^--radius-/ }, { id: 'type', icon: 'type', test: /^--font-/ },
    { id: 'shadow', icon: 'shadow', test: /^--(shadow|blur)-/ }, { id: 'other', icon: 'more', test: /./ }];
  DM.loadTokens = function (url) {
    return DM.text(url).then(function (css) {
      var map = {}, order = [], rx = /(--[\w-]+)\s*:\s*([^;]+);/g, m;
      var body = css.replace(/\/\*[\s\S]*?\*\//g, '');
      while ((m = rx.exec(body))) { if (!(m[1] in map)) order.push(m[1]); map[m[1]] = m[2].trim(); }
      function resolve(v, d) { return d > 8 ? v : v.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, function (all, n, fb) { return n in map ? resolve(map[n], d + 1) : fb || all; }); }
      var cats = CATS.map(function (c) { return { id: c.id, icon: c.icon, items: [] }; });
      order.forEach(function (n) {
        var raw = map[n], item = { name: n, raw: raw, value: resolve(raw, 0), alias: /var\(/.test(raw) };
        for (var i = 0; i < CATS.length; i++) if (CATS[i].test.test(n)) { cats[i].items.push(item); break; }
      });
      return { cats: cats.filter(function (c) { return c.items.length; }), count: order.length };
    });
  };
  function px(v) { var m = /^(-?\d*\.?\d+)(px|rem)?$/.exec(String(v).trim()); return m ? (m[2] === 'rem' ? parseFloat(m[1]) * 16 : parseFloat(m[1])) : null; }
  function Preview(p) {
    var c = p.cat, v = p.item.value, n = px(v);
    if (c === 'color') return h('span', { className: 'dm-tokprev' }, h('i', { className: 'dm-swatch is-lg', style: { background: v } }));
    if (c === 'space' && n != null) return h('span', { className: 'dm-tokprev' }, h('i', { style: { width: Math.min(n, 80) } }));
    if (c === 'radius' && n != null) return h('span', { className: 'dm-tokprev is-radius' }, h('i', { style: { borderRadius: Math.min(n, 11) + 'px ' } }));
    if (c === 'shadow' && /shadow/.test(p.item.name)) return h('span', { className: 'dm-tokprev is-shadow' }, h('i', { style: { boxShadow: v } }));
    return h('span', { className: 'dm-tokprev' });
  }
  DM.TokenView = function TokenView(p) {
    var qs = R.useState(''), q = qs[0].trim().toLowerCase();
    if (!p.tokens) return h('div', { className: 'dm-docview' }, h(DM.Empty, null, t('tokens.loading')));
    var cat = p.tokens.cats.filter(function (c) { return c.id === p.cat; })[0] || p.tokens.cats[0];
    var pool = q ? p.tokens.cats.reduce(function (a, c) { return a.concat(c.items.map(function (x) { return { c: c.id, x: x }; })); }, []) : cat.items.map(function (x) { return { c: cat.id, x: x }; });
    var rows = pool.filter(function (r) { return !q || r.x.name.toLowerCase().indexOf(q) >= 0 || r.x.value.toLowerCase().indexOf(q) >= 0 || r.x.raw.toLowerCase().indexOf(q) >= 0; });
    return h('div', { className: 'dm-docview' }, h('div', { className: 'dm-docview__inner' },
      h('h1', null, t('tokens.title')),
      h('p', { className: 'dm-docview__sub' }, t('tokens.sub'), ' ', t('tokens.count', { n: p.tokens.count })),
      h('div', { className: 'dm-filters' },
        h('label', { className: 'dm-search is-inline' }, h(DM.Icon, { name: 'search', size: 14 }), h('input', { value: qs[0], placeholder: t('search.tokens'), onChange: function (e) { qs[1](e.target.value); } })),
        q ? null : h('span', { className: 'dm-chip' }, t('tk.' + cat.id) + ' · ' + cat.items.length)),
      h('div', { className: 'dm-card' }, h('div', { className: 'dm-tokgrid' },
        h('div', { className: 'is-head' }, t('tk.name')), h('div', { className: 'is-head' }, t('tk.value')), h('div', { className: 'is-head' }, t('tk.preview')),
        rows.slice(0, 600).map(function (r) {
          var x = r.x, n = px(x.value), rem = n != null && /space|radius|type/.test(r.c) ? ' · ' + Math.round(n / 16 * 1000) / 1000 + 'rem' : '';
          return h(R.Fragment, { key: x.name },
            h('div', null, h(DM.Copyable, { copy: 'var(' + x.name + ')', className: 'dm-mono' }, x.name)),
            h('div', { className: 'dm-tokval' }, h(DM.Copyable, { copy: x.value, className: 'dm-mono' }, x.value + rem), x.alias ? h('small', { className: 'dm-mono' }, '= ' + x.raw) : null),
            h('div', null, h(Preview, { cat: r.c, item: x })));
        })),
        rows.length ? null : h(DM.Empty, { icon: 'search' }, '—'))));
  };

  /* ---- iterations ---- */
  function Change(p) {
    var c = p.c;
    return h('div', { className: 'dm-change' },
      h('div', { className: 'dm-change__chips' }, h('span', { className: 'dm-chip is-' + c.type }, h(DM.Icon, { name: c.type === 'motion' ? 'motion' : 'ui', size: 12 }), t('type.' + c.type)),
        h('span', { className: 'dm-chip is-' + c.action }, t('a.' + c.action))),
      h('div', null,
        h('div', { className: 'dm-change__title' }, DM.tx(c.title)),
        c.detail ? h('div', { className: 'dm-change__detail' }, DM.tx(c.detail)) : null,
        h('div', { className: 'dm-change__targets' },
          (c.pages || []).map(function (id) { var pg = window.DM_PAGES.byId[id]; return h('button', { key: 'p' + id, type: 'button', className: 'dm-chip is-link', onClick: function () { p.onPage(id); } }, h(DM.Icon, { name: 'frame', size: 12 }), pg ? DM.pageName(pg) : id); }),
          (c.components || []).map(function (n) { return h('button', { key: 'c' + n, type: 'button', className: 'dm-chip is-link is-comp', onClick: function () { p.onComp(n); } }, h(DM.Icon, { name: 'instance', size: 11 }), n); }),
          (c.figma || []).map(function (id) { return h('a', { key: 'f' + id, className: 'dm-chip is-link', href: DM.figmaUrl({ id: id }), target: '_blank', rel: 'noopener' }, h(DM.Icon, { name: 'figma', size: 12 }), id); }))));
  }
  DM.IterView = function IterView(p) {
    var its = DM.iterations(), it = DM.iteration(p.id) || its[0], idx = its.indexOf(it), older = its[idx + 1];
    var fs = R.useState('all'), f = fs[0];
    var ch = (it.changes || []).filter(function (c) { return f === 'all' || c.type === f; });
    var nUi = (it.changes || []).filter(function (c) { return c.type === 'ui'; }).length, nMo = (it.changes || []).length - nUi;
    return h('div', { className: 'dm-docview' }, h('div', { className: 'dm-docview__inner' },
      h('div', { className: 'dm-iterhead' },
        h('div', null, h('h1', null, it.label), h('p', { className: 'dm-docview__sub' }, DM.tx(it.title))),
        h('div', { className: 'dm-iterhead__acts' },
          h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { p.onVersion(it.id); } }, h(DM.Icon, { name: 'eye', size: 14 }), t('iter.open')),
          older ? h('button', { type: 'button', className: 'dm-btn is-primary', onClick: function () { p.onCompare(older.id, it.id); } }, h(DM.Icon, { name: 'compare', size: 14 }), t('compare.prev')) : null)),
      h('div', { className: 'dm-itermeta' },
        h('span', { className: 'dm-chip' }, h(DM.Icon, { name: 'history', size: 12 }), it.date),
        it.jira ? h('a', { className: 'dm-chip is-link', href: DM.jiraUrl(it.jira), target: '_blank', rel: 'noopener' }, h(DM.Icon, { name: 'jira', size: 12 }), it.jira.key + (it.jira.title ? ' · ' + it.jira.title : ''))
          : it.baseline ? null : h('span', { className: 'dm-chip' }, t('noJira')),
        h('span', { className: 'dm-chip' }, 'v' + it.major + (idx === 0 ? ' · ' + t('version.latest') : '')),
        nUi ? h('span', { className: 'dm-chip is-ui' }, t('type.ui') + ' ' + nUi) : null, nMo ? h('span', { className: 'dm-chip is-motion' }, t('type.motion') + ' ' + nMo) : null),
      h('h2', null, t('iter.summary')),
      h('div', { className: 'dm-card' }, h('div', { className: 'dm-card__pad dm-prose' }, DM.tx(it.summary))),
      h('h2', null, t('iter.changes')),
      it.baseline && !(it.changes || []).length ? h('div', { className: 'dm-card' }, h('div', { className: 'dm-card__pad dm-prose' }, t('iter.baseline'))) : h(R.Fragment, null,
        h('div', { className: 'dm-filters' }, h('div', { className: 'dm-seg' }, [['all', t('filter.all')], ['ui', t('type.ui')], ['motion', t('type.motion')]].map(function (x) {
          return h('button', { key: x[0], type: 'button', className: f === x[0] ? 'is-on' : '', onClick: function () { fs[1](x[0]); } }, x[1]);
        }))),
        h('div', { className: 'dm-card' }, ch.length ? ch.map(function (c, i) { return h(Change, { key: i, c: c, onPage: p.onPage, onComp: p.onComp }); }) : h(DM.Empty, null, t('iter.empty')))),
      h('h2', null, t('iter.all')),
      h('div', { className: 'dm-card' }, its.map(function (x, i) {
        var n = (x.changes || []).length;
        return h('button', { key: x.id, type: 'button', className: DM.cx('dm-iterrow', x.id === it.id && 'is-on'), onClick: function () { p.onIter(x.id); } },
          h('b', null, x.label), h('span', null, x.date), h('span', { className: 'dm-iterrow__t' }, DM.tx(x.title)), h('small', null, x.baseline ? t('iter.baseline').split(/[:：]/)[0] : t('iter.count', { n: n })));
      }))));
  };

  DM.StageMissing = function StageMissing(p) {
    var c = p.comp, pages = (c.pages || []).map(function (id) { return window.DM_PAGES.byId[id] || Object.keys(window.DM_PAGES.byId).map(function (k) { return window.DM_PAGES.byId[k]; }).filter(function (x) { return x.code === id || x.page === id; })[0]; }).filter(Boolean);
    return h('div', { className: 'dm-docview' }, h('div', { className: 'dm-docview__inner is-narrow' },
      h(DM.Empty, { icon: 'component' }, t('stage.empty')),
      pages.length ? h('div', { className: 'dm-card' }, h('div', { className: 'dm-card__pad' }, h('div', { className: 'dm-spec__group' }, t('stage.usedOnTip')),
        h('div', { className: 'dm-list' }, pages.map(function (pg) {
          return h('button', { key: pg.id, type: 'button', className: 'dm-list__row', onClick: function () { p.onPage(pg.id); } }, h(DM.Icon, { name: 'frame', size: 14 }), DM.pageName(pg), h('small', null, pg.code));
        })))) : null));
  };
})();

/* ---- unrecorded changes: the visual check (tools/devmode-visual.mjs, published by the Dev Mode visual check workflow) ---- */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, t = function (k, v) { return DM.t(k, v); };
  /* the report lives on the branch devmode-visual; ?visual=<folder> reads another one (a local run of the tool) */
  var RAW = new URLSearchParams(location.search).get('visual') || '../_visual/';   /* the branch devmode-visual, through the Worker (worker/index.js) */
  DM.VISUAL = RAW;
  var vp = null;
  DM.loadVisual = function () {
    if (!vp) vp = fetch(RAW + 'report.json?t=' + Math.floor(Date.now() / 60000), { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(function () { return null; });
    return vp;
  };
  DM.useVisual = function () {
    var s = R.useState(null);
    R.useEffect(function () { var on = true; DM.loadVisual().then(function (r) { if (on) s[1](r || { none: true }); }); return function () { on = false; }; }, []);
    return s[0];
  };
  function ago(iso) {
    var m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return m < 1 ? t('vis.now') : m < 60 ? t('vis.min', { n: m }) : m < 1440 ? t('vis.hour', { n: Math.round(m / 60) }) : t('vis.day', { n: Math.round(m / 1440) });
  }
  function Item(p) {
    var c = p.c, pg = c.page ? window.DM_PAGES.byId[c.page] : null;
    return h('div', { className: 'dm-vis' },
      h('div', { className: 'dm-vis__head' },
        h('span', { className: 'dm-chip ' + (c.kind === 'page' ? '' : 'is-comp') }, h(DM.Icon, { name: c.kind === 'page' ? 'frame' : 'component', size: 12 }), c.kind === 'page' ? t('page') : t('component')),
        h('b', null, DM.lang === 'en' ? c.label : c.labelZh || c.label),
        c.ratio != null ? h('span', { className: 'dm-vis__ratio' }, t('vis.ratio', { n: (c.ratio * 100).toFixed(c.ratio < 0.01 ? 2 : 1) })) : null,
        h('span', { style: { flex: 1 } }),
        pg ? h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { p.onPage(pg.id, c.state); } }, h(DM.Icon, { name: 'eye', size: 13 }), t('vis.open')) : null),
      c.image ? h('a', { href: RAW + c.image, target: '_blank', rel: 'noopener', className: 'dm-vis__img' },
        h('img', { src: RAW + c.image + '?t=' + encodeURIComponent(p.at || ''), alt: '', loading: 'lazy' }),
        h('div', { className: 'dm-vis__cap' }, h('span', null, t('cmp.before') + ' · ' + p.against), h('span', null, t('cmp.after')), h('span', null, t('vis.diff')))) : null,
      (c.components || []).length ? h('div', { className: 'dm-change__targets' }, h('span', { className: 'dm-vis__where' }, c.kind === 'page' ? t('vis.where') : t('vis.comps')),
        c.components.map(function (n) { return /^APP\./.test(n) ? h('span', { key: n, className: 'dm-chip' }, n) : h('button', { key: n, type: 'button', className: 'dm-chip is-link is-comp', onClick: function () { p.onComp(n); } }, h(DM.Icon, { name: 'instance', size: 11 }), n); })) : null,
      c.error ? h('div', { className: 'dm-note' }, c.error) : null);
  }
  DM.VisualView = function VisualView(p) {
    var r = DM.useVisual();
    if (!r) return h('div', { className: 'dm-docview' }, h(DM.Empty, null, t('loading')));
    var head = h(R.Fragment, null, h('h1', null, t('vis.title')), h('p', { className: 'dm-docview__sub' }, t('vis.sub')));
    if (r.none) return h('div', { className: 'dm-docview' }, h('div', { className: 'dm-docview__inner' }, head, h('div', { className: 'dm-card dm-gap' }, h('div', { className: 'dm-card__pad dm-prose' }, t('vis.noReport')))));
    var n = r.changed.length + r.added.length;
    return h('div', { className: 'dm-docview' }, h('div', { className: 'dm-docview__inner' }, head,
      h('div', { className: 'dm-itermeta' },
        h('span', { className: 'dm-chip' }, h(DM.Icon, { name: 'history', size: 12 }), t('vis.against', { v: r.against })),
        h('span', { className: 'dm-chip' }, t('vis.checked', { t: ago(r.at) })),
        r.commit ? h('a', { className: 'dm-chip is-link', href: DM.REPO + '/commit/' + r.commit, target: '_blank', rel: 'noopener' }, h(DM.Icon, { name: 'code', size: 12 }), r.commit.slice(0, 7)) : null,
        h('span', { className: 'dm-chip' }, t('vis.renders', { n: r.items })),
        h('span', { className: 'dm-chip ' + (n ? 'is-edit' : 'is-add') }, n ? t('vis.count', { n: n }) : t('vis.clean'))),
      n ? h('div', { className: 'dm-note dm-gap' }, t('vis.howRecord')) : null,
      r.summary && r.summary.components.length ? h(R.Fragment, null, h('h2', null, t('vis.compsTitle')), h('div', { className: 'dm-change__targets' }, r.summary.components.map(function (c) {
        return /^APP\./.test(c) ? h('span', { key: c, className: 'dm-chip' }, c) : h('button', { key: c, type: 'button', className: 'dm-chip is-link is-comp', onClick: function () { p.onComp(c); } }, h(DM.Icon, { name: 'instance', size: 11 }), c);
      }))) : null,
      r.changed.length ? h(R.Fragment, null, h('h2', null, t('vis.changed') + ' · ' + r.changed.length), r.changed.map(function (c) { return h(Item, { key: c.id, c: c, against: r.against, at: r.at, onPage: p.onPage, onComp: p.onComp }); })) : null,
      r.added.length ? h(R.Fragment, null, h('h2', null, t('vis.added') + ' · ' + r.added.length), r.added.map(function (c) { return h(Item, { key: c.id, c: c, against: r.against, at: r.at, onPage: p.onPage, onComp: p.onComp }); })) : null,
      r.failed.length ? h(R.Fragment, null, h('h2', null, t('vis.failed') + ' · ' + r.failed.length), r.failed.map(function (c) { return h(Item, { key: c.id, c: c, against: r.against, at: r.at, onPage: p.onPage, onComp: p.onComp }); })) : null));
  };
})();
