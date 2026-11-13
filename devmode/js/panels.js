/* PeraSure Dev Mode — the right column, as Figma Dev Mode's Inspect: the selected component (or the page when nothing is
   selected) with its status, dev resources, description, properties, specs (List / Code, px / rem), tokens, motion, assets and the
   pages that use it; the History tab lists the iterations that changed it. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, I = DM.inspect, t = function (k, v) { return DM.t(k, v); };
  var LIVE = 'https://samgestudio-dev.github.io/Perasure/';

  /* ---- code colouring (JS / CSS / JSX), small and good enough to read ---- */
  var RX = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(var\(--[\w-]+\)|--[\w-]+)|\b(function|return|var|const|let|if|else|true|false|null|undefined|new|this|typeof|import|export|from)\b|(#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|rem|ms|s|%)?\b)|(<\/?[A-Z][\w.]*|\/>|\bPS\.[A-Z]\w*)/g;
  DM.hl = function (code) {
    var out = [], last = 0, m, i = 0; RX.lastIndex = 0;
    while ((m = RX.exec(code))) {
      if (m.index > last) out.push(code.slice(last, m.index));
      var cls = m[1] ? 't-c' : m[2] ? 't-s' : m[3] ? 't-v' : m[4] ? 't-k' : m[5] ? 't-n' : 't-p';
      out.push(h('span', { key: i++, className: cls }, m[0])); last = RX.lastIndex;
    }
    if (last < code.length) out.push(code.slice(last));
    return out;
  };
  function Code(p) {
    return h('div', { className: 'dm-codewrap' }, h('pre', { className: 'dm-code' }, p.loading ? t('loading') : DM.hl(p.code || '')),
      p.code ? h('button', { type: 'button', className: 'dm-iconbtn dm-code__copy', title: t('copy'), onClick: function () { DM.copy(p.code, t('copied')); } }, h(DM.Icon, { name: 'copy', size: 14 })) : null);
  }
  function Select(p) {
    return h('label', { className: 'dm-select' }, h('select', { value: p.value, onChange: function (e) { p.onChange(e.target.value); } },
      p.options.map(function (o) { return h('option', { key: o[0], value: o[0] }, o[1]); })), h(DM.Icon, { name: 'down', size: 12 }));
  }
  function useStored(key, def) {
    var s = R.useState(function () { try { return localStorage.getItem(key) || def; } catch (e) { return def; } });
    return [s[0], function (v) { s[1](v); try { localStorage.setItem(key, v); } catch (e) {} }];
  }
  function useText(url) {
    var s = R.useState({ url: null, text: null, err: null });
    R.useEffect(function () {
      if (!url) return; var on = true;
      DM.text(url).then(function (tx) { if (on) s[1]({ url: url, text: tx }); }, function (e) { if (on) s[1]({ url: url, err: String(e) }); });
      return function () { on = false; };
    }, [url]);
    return s[0].url === url ? s[0] : { url: url, text: null };
  }
  /* a source comment as prose: continuation lines join the line before them */
  function tidy(doc) { return doc.split('\n').map(function (l) { return l.trim(); }).reduce(function (a, l) { if (!a.length) return [l]; if (/^[a-z(·—\-+"'“]/.test(l)) a[a.length - 1] += ' ' + l; else a.push(l); return a; }, []).join('\n'); }
  function isColor(v) { return /^(#|rgb|hsl)/.test(String(v).trim()); }
  function tokenVal(win, name) { try { return win.getComputedStyle(win.document.documentElement).getPropertyValue(name).trim(); } catch (e) { return ''; } }
  function Token(p) {
    return h('button', { type: 'button', className: 'dm-token', title: t('copy') + ' var(' + p.name + ')', onClick: function () { DM.copy('var(' + p.name + ')', t('copied')); } },
      p.color ? h('i', { className: 'dm-swatch', style: { background: p.color } }) : null, p.name);
  }

  /* ---- shared parts ---- */
  function Head(p) {
    return h('div', { className: 'dm-head' },
      h('div', { className: DM.cx('dm-head__kind', p.page && 'is-page') }, h(DM.Icon, { name: p.icon, size: 12 }), p.kind),
      h('div', { className: DM.cx('dm-head__name', p.comp && 'is-comp') }, p.name),
      p.chain && p.chain.length > 1 ? h('div', { className: 'dm-head__chain' }, p.chain.map(function (n, i) {
        return h(R.Fragment, { key: n.path }, i ? h(DM.Icon, { name: 'chevron', size: 10 }) : null,
          h('button', { type: 'button', onClick: function () { p.onSelect(n.path); }, title: n.path }, n.kind === 'page' || n.kind === 'tab' ? (DM.pageName(window.DM_PAGES.byId[n.id]) || n.name) : I.label(n)));
      })) : null,
      h('div', { className: 'dm-head__meta' }, p.meta),
      p.acts ? h('div', { className: 'dm-head__acts' }, p.acts) : null);
  }
  function lastChip(kind, id, onIter) {
    var it = DM.lastOf(kind, id); if (!it) return null;
    return h('button', { type: 'button', className: 'dm-chip is-link', title: t('lastIter'), onClick: onIter }, h(DM.Icon, { name: 'history', size: 12 }), it.label);
  }
  function Resources(p) {
    var c = p.comp, pg = p.page, v = p.version, items = [];
    if (c) {
      items.push(h(DM.ExtLink, { key: 'src', icon: 'code', title: t('res.source'), sub: c.file + ' · L' + c.line + '–' + c.end, href: DM.gh(c.file, c.line, c.end, v) }));
      if (c.css && c.css.length) { var a = c.css[0].line, b = c.css[c.css.length - 1].end; items.push(h(DM.ExtLink, { key: 'css', icon: 'code', title: 'CSS · ps-ui.css', sub: c.css.length + ' rules · L' + a + '–' + b, href: DM.gh('shared/ps-ui/ps-ui.css', a, b, v) })); }
      (c.figma || []).forEach(function (f, i) { items.push(h(DM.ExtLink, { key: 'f' + i, icon: 'figma', title: t('res.figma') + ' · ' + f.id, sub: f.file === 'OBsvf42AiRapcRrasD7KNm' ? t('res.ds') : t('res.app'), href: DM.figmaUrl(f) })); });
    }
    if (pg) {
      items.push(h(DM.ExtLink, { key: 'pg', icon: 'page', title: t('res.page'), sub: pg.file + ' · L' + pg.line + '–' + pg.end, href: DM.gh(pg.file, pg.line, pg.end, v) }));
      (pg.figma || []).forEach(function (f, i) { items.push(h(DM.ExtLink, { key: 'pf' + i, icon: 'figma', title: t('res.figma') + ' · ' + f.id, sub: t('res.app'), href: DM.figmaUrl(f) })); });
    }
    return items.length ? h(DM.Section, { title: t('res') }, items) : null;
  }

  /* ---- specs: List (Figma's properties) / Code ---- */
  function Specs(p) {
    var tab = useStored('perasure.devmode.spectab', 'list'), unit = useStored('perasure.devmode.unit', 'px'), lang = useStored('perasure.devmode.lang.code', 'jsx');
    var node = p.node, c = p.comp, win = p.win;
    var sp = node && win ? (function () { try { return I.specs(win, node); } catch (e) { return null; } })() : null;
    var srcUrl = c ? DM.root(p.version) + c.file : null, src = useText(tab[0] === 'code' && lang[0] === 'source' ? srcUrl : null);
    var langs = [];
    if (node && node.kind === 'component') langs.push(['jsx', t('lang.jsx')], ['call', t('lang.call')]);
    langs.push(['css', t('lang.css')]);
    if (c) langs.push(['source', t('lang.source')]);
    var L = langs.some(function (x) { return x[0] === lang[0]; }) ? lang[0] : langs[0][0];
    var code = '', loading = false;
    if (L === 'jsx') code = I.usage(node);
    else if (L === 'call') code = I.call(node);
    else if (L === 'css') {
      if (node && win) code = I.matchedRules(win, I.hosts(node)[0]).map(function (r) { return (r.media ? '@media ' + r.media + ' {\n' : '') + '/* ' + r.file + ' */\n' + r.sel + ' {\n  ' + r.decl.join('\n  ') + '\n}' + (r.media ? '\n}' : ''); }).join('\n\n');
      else if (c) code = (c.css || []).map(function (r) { return (r.note ? '/* ' + r.note + ' */\n' : '') + r.sel + ' {\n  ' + r.body.split(/;\s*\n?\s*/).filter(Boolean).join(';\n  ') + ';\n}'; }).join('\n\n');
    } else if (L === 'source') { loading = !src.text && !src.err; code = src.text ? DM.lines(src.text, c.line, c.end) : src.err || ''; }
    var groups = {}, order = [];
    if (sp) sp.rows.forEach(function (r) { if (!groups[r.group]) { groups[r.group] = []; order.push(r.group); } groups[r.group].push(r); });
    var list = sp ? order.map(function (g) {
      return h(R.Fragment, { key: g }, h('div', { className: 'dm-spec__group' }, t('g.' + g)), groups[g].map(function (r, i) {
        var val = r.label === 'dir' ? t('s.' + r.value) : I.fmt(r.value, r.px, unit[0], sp.rootPx);
        var col = r.label === 'fill' || r.label === 'color' || r.label === 'stroke';
        return h('div', { key: i, className: 'dm-specrow' }, h('span', null, t('s.' + r.label)),
          h('div', { className: 'dm-specval' },
            h(DM.Copyable, { copy: val }, col && isColor(r.value) ? h('i', { className: 'dm-swatch', style: { background: r.value } }) : null, val),
            r.token ? h(Token, { name: r.token, color: col ? r.value : null }) : null,
            r.expr ? h(DM.Copyable, { className: 'dm-expr dm-mono', copy: r.expr }, r.expr) : null));
      }));
    }) : h('div', { className: 'dm-note' }, t('spec.select'));
    return h(DM.Section, { title: t('spec'), extra: h('div', { className: 'dm-seg is-sm' },
        h('button', { type: 'button', className: tab[0] === 'list' ? 'is-on' : '', onClick: function () { tab[1]('list'); } }, t('list')),
        h('button', { type: 'button', className: tab[0] === 'code' ? 'is-on' : '', onClick: function () { tab[1]('code'); } }, t('code'))) },
      h('div', { className: 'dm-codebar' },
        tab[0] === 'code' ? h(Select, { value: L, options: langs, onChange: lang[1] }) : null,
        h('span', { className: 'dm-codebar__sp' }),
        tab[0] === 'list' || L === 'css' ? h(Select, { value: unit[0], options: [['px', 'px'], ['rem', 'rem']], onChange: unit[1] }) : null),
      tab[0] === 'list' ? list : h(Code, { code: L === 'css' && unit[0] === 'px' && sp ? code.replace(/(\d*\.?\d+)rem\b/g, function (m, n) { return Math.round(parseFloat(n) * sp.rootPx * 100) / 100 + 'px'; }) : code, loading: loading }));
  }

  function Props(p) {
    var node = p.node;
    if (node.kind === 'element') return h(DM.Section, { title: t('classes') }, h('div', { className: 'dm-chips' },
      Array.prototype.map.call(node.el.classList, function (c) { return h(DM.Copyable, { key: c, className: 'dm-chip', copy: '.' + c }, '.' + c); })));
    var props = I.props(node);
    return h(DM.Section, { title: t('props') }, props.length ? h('dl', { className: 'dm-kv' }, props.map(function (x) {
      return h(R.Fragment, { key: x.key }, h('dt', { title: x.key }, x.key), h('dd', null, h(DM.Copyable, { className: 'dm-mono', copy: x.value }, x.value)));
    })) : h('div', { className: 'dm-note' }, t('props.none')));
  }
  function Tokens(p) {
    var list = (p.comp && p.comp.tokens) || [];
    return h(DM.Section, { title: t('tokens.used'), extra: list.length ? h('small', { className: 'dm-sec__n' }, list.length) : null, open: list.length < 14 },
      list.length ? h('div', { className: 'dm-toklist' }, list.map(function (n) {
        var v = p.win ? tokenVal(p.win, n) : '';
        return h('div', { key: n, className: 'dm-toklist__row' }, h(Token, { name: n, color: isColor(v) ? v : null }), h('span', { className: 'dm-toklist__v', title: v }, v));
      })) : h('div', { className: 'dm-note' }, t('tokens.none')));
  }
  function Motion(p) {
    var names = (p.comp && p.comp.motion) || []; if (!names.length) return null;
    var vals = p.win ? I.motion(p.win, names) : names.map(function (n) { return { name: n, value: '' }; });
    return h(DM.Section, { title: t('motion') }, h('dl', { className: 'dm-kv is-wide' }, vals.map(function (m) {
      return h(R.Fragment, { key: m.name }, h('dt', null, 'PS.MT.' + m.name), h('dd', null, h(DM.Copyable, { className: 'dm-mono', copy: m.value }, m.value || '—')));
    })), h('div', { className: 'dm-note dm-gap' }, t('motion.note')));
  }
  function Assets(p) {
    var base = DM.root(p.version) + 'shared/ps-ui/assets/', items = [];
    if (p.node && p.win) items = I.assets(p.win, p.node).map(function (a) { return { url: a.url, name: a.name, mono: a.kind === 'icon' }; });
    else if (p.comp) {
      (p.comp.icons || []).forEach(function (n) { items.push({ url: base + 'icons/' + n + '.svg', name: n + '.svg', mono: true }); });
      (p.comp.art || []).forEach(function (n) { if (!/\.json$/.test(n)) items.push({ url: base + n, name: n.split('/').pop() }); });
    }
    var anims = (p.comp && p.comp.anims) || [];
    if (!items.length && !anims.length) return null;
    return h(DM.Section, { title: t('assets'), extra: h('small', { className: 'dm-sec__n' }, items.length + anims.length) },
      items.length ? h('div', { className: 'dm-assets' }, items.slice(0, 40).map(function (a) {
        return h('a', { key: a.url, className: 'dm-asset', href: a.url, download: a.name, title: a.name, target: '_blank', rel: 'noopener' }, h('img', { src: a.url, alt: '', className: a.mono ? 'is-mono' : '' }), h('span', null, a.name));
      })) : null,
      anims.length ? h('div', { className: 'dm-list dm-gap' }, anims.map(function (n) {
        return h('a', { key: n, className: 'dm-list__row', href: '../animations/player.html?a=' + n, target: '_blank', rel: 'noopener' }, h(DM.Icon, { name: 'motion', size: 14 }), 'Lottie · ' + n, h('small', null, n + '.json'));
      })) : null);
  }
  function UsedOn(p) {
    var ids = (p.comp && p.comp.pages) || [];
    return h(DM.Section, { title: t('usedOn'), extra: ids.length ? h('small', { className: 'dm-sec__n' }, ids.length) : null, open: ids.length < 16 },
      ids.length ? h('div', { className: 'dm-list' }, ids.map(function (id) {
        var reg = window.DM_PAGES.byId[id] || Object.keys(window.DM_PAGES.byId).map(function (k) { return window.DM_PAGES.byId[k]; }).filter(function (x) { return x.code === id || x.page === id; })[0];
        return h('button', { key: id, type: 'button', className: 'dm-list__row', disabled: !reg, onClick: function () { if (reg) p.onPage(reg.id); } }, h(DM.Icon, { name: 'frame', size: 14 }), reg ? DM.pageName(reg) : id, h('small', null, id));
      })) : h('div', { className: 'dm-note' }, t('notOnPages')));
  }

  /* ---- the selected component / element ---- */
  function CompInspect(p) {
    var node = p.node, name = node ? (node.kind === 'element' ? node.parent.name : node.name) : p.compName;
    var c = DM.IDX().components[name] || null;
    var isEl = node && node.kind === 'element', disp = /^APP\./.test(name) ? name : 'PS.' + name;
    var link = location.href.split('#')[0] + '#' + location.hash.slice(1);
    return h(R.Fragment, null,
      h(Head, { icon: isEl ? 'frame' : 'instance', kind: isEl ? t('element') + ' · ' + disp : node ? (/^APP\./.test(name) ? t('appPiece') : t('instance')) : t('component'), comp: !isEl,
        name: isEl ? node.name : disp, chain: node ? I.chain(node) : null, onSelect: p.onSelect,
        meta: [h(DM.StatusPill, { key: 's', status: DM.statusOf('components', name) }), h(R.Fragment, { key: 'l' }, lastChip('components', name, function () { p.onTab('history'); })),
          c ? h('span', { key: 'f' }, c.file.split('/').pop() + ':' + c.line) : null],
        acts: [h(DM.CopyForAI, { key: 'ai', what: isEl ? node.name + ' (' + disp + ')' : disp }),
          c && c.gallery && !(p.compName && !node) ? h('button', { key: 'g', type: 'button', className: 'dm-btn is-outline', onClick: function () { p.onComp(name); } }, h(DM.Icon, { name: 'component', size: 14 }), t('res.gallery')) : null,
          h('button', { key: 'c', type: 'button', className: 'dm-iconbtn', title: t('copyLink'), onClick: function () { DM.copy(link, t('copied')); } }, h(DM.Icon, { name: 'link', size: 14 }))] }),
      h(Resources, { comp: c, version: p.version }),
      c && c.doc ? h(DM.Section, { title: t('doc') }, h('div', { className: 'dm-doc' }, tidy(c.doc))) : null,
      node ? h(Props, { node: node }) : null,
      h(Specs, { node: node, comp: c, win: p.win, version: p.version }),
      h(Tokens, { comp: c, win: p.win }),
      h(Motion, { comp: c, win: p.win }),
      h(Assets, { node: node, comp: c, win: p.win, version: p.version }),
      h(UsedOn, { comp: c, onPage: p.onPage }));
  }

  /* ---- the page, when nothing is selected ---- */
  function PageInspect(p) {
    var pg = p.page, info = DM.IDX().pages[pg.code] || null, st = p.state;
    var live = LIVE + 'prototypes/app/index.html?' + window.DM_PAGES.url(pg, st, '').split('?')[1].replace(/&v=\w+$/, '');
    var js = window.DM_PAGES.js(pg, st);
    var comps = {};
    if (p.T) p.T.list.forEach(function (n) { if (n.kind === 'component') { comps[n.name] = comps[n.name] || { n: 0, path: n.path }; comps[n.name].n++; } });
    var names = Object.keys(comps).sort();
    var kindLabel = pg.kind === 'sheet' ? t('sheet') : pg.kind === 'tab' ? t('tab') : t('page');
    return h(R.Fragment, null,
      h(Head, { icon: pg.kind === 'sheet' ? 'sheet' : 'frame', page: true, kind: kindLabel + ' · ' + pg.code, name: DM.pageName(pg),
        meta: [h(DM.StatusPill, { key: 's', status: DM.statusOf('pages', pg.id) }), h(R.Fragment, { key: 'l' }, lastChip('pages', pg.id, function () { p.onTab('history'); }))],
        acts: [h(DM.CopyForAI, { key: 'ai', what: t('ai.page', { n: DM.pageName(pg) }) })] }),
      pg.note ? h('div', { className: 'dm-sec dm-sec__body is-flush' }, h('div', { className: 'dm-note' }, DM.lang === 'en' ? pg.noteEn || pg.note : pg.note)) : null,
      h(Resources, { page: info, version: p.version }),
      h(DM.Section, { title: t('howOpen') },
        h('div', { className: 'dm-spec__group' }, t('open.link')), h(Code, { code: live }),
        js ? h(R.Fragment, null, h('div', { className: 'dm-spec__group' }, t('open.script')), h(Code, { code: js })) : null,
        h('a', { className: 'dm-btn is-outline dm-gap', href: live, target: '_blank', rel: 'noopener' }, h(DM.Icon, { name: 'external', size: 14 }), t('open.phone'))),
      h(DM.Section, { title: t('onPage'), extra: h('small', { className: 'dm-sec__n' }, names.length) },
        names.length ? h('div', { className: 'dm-list' }, names.map(function (n) {
          return h('button', { key: n, type: 'button', className: 'dm-list__row', onClick: function () { p.onSelect(comps[n].path); } },
            h(DM.Icon, { name: 'instance', size: 12, className: 'dm-c-comp' }), n, h('small', null, comps[n].n > 1 ? '× ' + comps[n].n : ''));
        })) : h('div', { className: 'dm-note' }, t('layers.empty'))));
  }

  /* ---- history ---- */
  function History(p) {
    var list = DM.historyOf(p.kind, p.id), all = DM.iterations();
    return h('div', { className: 'dm-sec__body is-top' },
      h('div', { className: 'dm-spec__group' }, t('history.for')),
      list.map(function (it, i) {
        var ch = it.baseline ? [] : DM.changesIn(it, p.kind, p.id), older = all[all.indexOf(it) + 1];
        return h('div', { key: it.id, className: DM.cx('dm-hist', i === 0 && 'is-latest') },
          h('div', { className: 'dm-hist__top' }, h('span', { className: 'dm-hist__label' }, it.label), h('span', { className: 'dm-hist__date' }, it.date),
            it.jira ? h('a', { className: 'dm-chip is-link', href: DM.jiraUrl(it.jira), target: '_blank', rel: 'noopener', title: it.jira.title }, h(DM.Icon, { name: 'jira', size: 12 }), it.jira.key)
              : it.baseline ? null : h('span', { className: 'dm-chip' }, t('noJira'))),
          h('div', { className: 'dm-hist__title' }, DM.tx(it.title)),
          ch.map(function (c, j) {
            return h('div', { key: j, className: 'dm-hist__change' }, h('span', { className: 'dm-chip is-' + c.type }, t('type.' + c.type)), h('span', { className: 'dm-chip is-' + c.action }, t('a.' + c.action)),
              h('span', null, DM.tx(c.title)));
          }),
          h('div', { className: 'dm-hist__acts' },
            it.id !== (p.version || DM.latest().id) ? h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { p.onVersion(it.id); } }, h(DM.Icon, { name: 'eye', size: 13 }), t('open.version')) : null,
            older ? h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { p.onCompare(older.id, it.id); } }, h(DM.Icon, { name: 'compare', size: 13 }), t('compare.prev')) : null));
      }),
      list.length <= 1 ? h('div', { className: 'dm-note' }, t('history.none')) : null);
  }

  /* p: node, compName, page, state, T, win, version, tab, onTab, onSelect, onComp, onPage, onVersion, onCompare */
  DM.Right = function Right(p) {
    var node = p.node, compName = node ? (node.kind === 'element' ? node.parent.name : node.kind === 'component' ? node.name : null) : p.compName;
    var pageNode = node && (node.kind === 'page' || node.kind === 'tab');
    var showPage = (!node || pageNode) && !p.compName && p.page;
    var kind = compName && !pageNode ? 'components' : 'pages', id = kind === 'components' ? compName : p.page && p.page.id;
    var body;
    if (p.tab === 'history' && id) body = h(History, { kind: kind, id: id, version: p.version, onVersion: p.onVersion, onCompare: p.onCompare });
    else if (showPage) body = h(PageInspect, p);
    else if (compName && !pageNode) body = h(CompInspect, Object.assign({}, p, { node: node && !pageNode ? node : null, compName: compName }));
    else body = h(DM.Empty, { icon: 'cursor' }, t('select.hint'));
    return h('aside', { className: 'dm-right' },
      h(DM.Tabs, { items: [{ id: 'inspect', label: t('tab.inspect') }, { id: 'history', label: t('tab.history') }], value: p.tab, onChange: p.onTab }),
      h('div', { className: 'dm-panel', key: (compName || '') + '|' + (p.page && p.page.id) + '|' + p.tab }, body));
  };
})();
