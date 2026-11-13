/* PeraSure Dev Mode — reading the app in the canvas: its shared components (PS.*) are found in React's own tree, so nothing in the app
   is marked by hand and a new component is picked up by itself. Works on the live app and on every snapshot (same origin).
   tree(win) → { node tree, byFiber } · nodeFor(win, element) → the innermost component under an element · rect(node) · props(node)
   specs(win, node) → measured values with the tokens they match · usage(node) → a JSX line for the component as it is used here. */
(function () {
  'use strict';
  var DM = window.DM;
  var I = DM.inspect = {};

  function key(o, pre) { for (var k in o) if (k.indexOf(pre) === 0) return k; return null; }
  function maps(win) {
    if (win.__dmMaps && win.__dmMaps.ps === win.PS) return win.__dmMaps;
    var comp = new Map(), page = new Map(), app = new Map(), PS = win.PS || {}, APP = win.APP;
    Object.keys(PS).forEach(function (k) { if (/^[A-Z]/.test(k) && typeof PS[k] === 'function') comp.set(PS[k], k); });
    /* the app's own pieces (APP.WdHero: the Withdraw demo's home card …) are layers too */
    if (APP) Object.keys(APP).forEach(function (k) { if (/^[A-Z]/.test(k) && k !== 'App' && typeof APP[k] === 'function' && !comp.has(APP[k])) app.set(APP[k], k); });
    if (APP && APP.screens) Object.keys(APP.screens).forEach(function (k) { page.set(APP.screens[k], { kind: 'screen', id: k }); });
    if (APP && APP.tabs) Object.keys(APP.tabs).forEach(function (k) { page.set(APP.tabs[k], { kind: 'tab', id: k }); });
    return (win.__dmMaps = { ps: PS, comp: comp, page: page, app: app });
  }
  I.ready = function (win) {
    try { var el = win.document.getElementById('root'); return !!(el && key(el, '__reactContainer$') && win.PS); } catch (e) { return false; }
  };
  I.compName = function (win, fiber) { var M = maps(win); return fiber && typeof fiber.type === 'function' ? M.comp.get(fiber.type) : null; };

  /* host elements of a component (the first DOM elements under it) */
  function hosts(fiber) {
    var out = [];
    (function walk(f) {
      for (var c = f.child; c; c = c.sibling) {
        if (c.tag === 5 && c.stateNode && c.stateNode.nodeType === 1) out.push(c.stateNode);
        else if (c.tag !== 6) walk(c);
      }
    })(fiber);
    return out;
  }
  I.hosts = function (node) { return node && node.el ? [node.el] : node && node.fiber ? hosts(node.fiber) : []; };

  /* tree(win): the shared components in the order React renders them, nested; sheets and pages become frames */
  I.tree = function (win) {
    /* the container keeps the root fiber it started with; the tree React is showing now hangs from FiberRoot.current */
    var M = maps(win), el = win.document.getElementById('root'), rf = el && el[key(el, '__reactContainer$')], rootFiber = rf && rf.stateNode && rf.stateNode.current || rf;
    var byFiber = new Map(), top = { name: 'App', kind: 'root', children: [], path: '' };
    if (!rootFiber) return { root: top, byFiber: byFiber, list: [] };
    var list = [], APP = win.APP;
    function add(parent, f, info) {
      var n = { name: info.name, kind: info.kind, id: info.id, fiber: f, parent: parent, children: [] };
      var same = parent.children.filter(function (c) { return c.name === n.name; }).length;
      n.path = (parent.path ? parent.path + '>' : '') + n.name + (same ? '#' + same : '');
      parent.children.push(n); byFiber.set(f, n); if (f.alternate) byFiber.set(f.alternate, n); list.push(n);
      return n;
    }
    (function walk(f, parent) {
      for (var c = f; c; c = c.sibling) {
        var next = parent, t = c.type;
        if (typeof t === 'function') {
          var cn = M.comp.get(t), pg = M.page.get(t);
          if (pg) next = add(parent, c, { name: pg.id, kind: pg.kind === 'tab' ? 'tab' : 'page', id: pg.id });
          else if (cn === 'Sheet') {
            if (!(c.memoizedProps && c.memoizedProps.open)) continue;          /* a closed sheet is not on the page */
            var nm = APP && APP.S && APP.S.sheet ? APP.S.sheet.name : (c.memoizedProps.label || 'sheet');
            next = add(parent, c, { name: 'Sheet', kind: 'component' });
            next.sheet = nm;
          } else if (cn && known(cn) && !PLUMBING[cn]) next = add(parent, c, { name: cn, kind: 'component' });
          else if (!cn && M.app.get(t)) { next = add(parent, c, { name: 'APP.' + M.app.get(t), kind: 'component' }); next.app = true; }
        }
        if (c.child) walk(c.child, next);
      }
    })(rootFiber.child, top);
    /* what draws nothing and holds nothing is left out (a closed overlay, an empty toast stack) */
    (function prune(n) { n.children = n.children.filter(function (c) {
      prune(c);
      var keep = c.children.length || c.kind !== 'component' || !!I.rect(c);
      if (!keep) { byFiber.delete(c.fiber); if (c.fiber.alternate) byFiber.delete(c.fiber.alternate); }
      return keep;
    }); })(top);
    list = []; (function flat(n) { n.children.forEach(function (c) { list.push(c); flat(c); }); })(top);
    return { root: top, byFiber: byFiber, list: list };
  };
  /* wrappers that only move or swap what is inside them: their children show in their place (as Figma flattens groups) */
  var PLUMBING = { Shell: 1, Pages: 1, Rise: 1, Crossfade: 1, Swap: 1 };
  function known(n) { var ix = DM.IDX ? DM.IDX() : window.DM_INDEX; return !ix || !!ix.components[n]; }

  /* the innermost component under a DOM element */
  I.nodeFor = function (T, el) {
    /* the page as it is drawn (like Figma's layers): up the elements, each one belongs to the components that render it directly
       (its fibers up to the next element). So a card drawn into another element (a portal: the hosted Withdraw demo's home card)
       belongs to the component of the element it sits in */
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var k = key(e, '__reactFiber$'); if (!k) continue;
      for (var f = e[k].return; f && f.tag !== 5 && f.tag !== 4 && f.tag !== 3; f = f.return) { var n = T.byFiber.get(f); if (n && n.kind === 'component') return n; }
    }
    return null;
  };
  I.find = function (T, path) { return T.list.filter(function (n) { return n.path === path; })[0] || null; };
  /* an element inside a component (Ctrl / ⌘ + hover, like Figma's deep select): path "<component path>|<host>.<child>.<child>" */
  function elName(el) { var c = Array.prototype.filter.call(el.classList || [], function (x) { return /^ps-/.test(x) && !/^ps-[tc]-/.test(x) && !/^is-/.test(x); }); return c.length ? '.' + c[0] : el.tagName.toLowerCase(); }
  I.elementNode = function (T, el) {
    var comp = I.nodeFor(T, el); if (!comp || !el) return comp;
    var hs = I.hosts(comp), idx = [], e = el;
    while (e && hs.indexOf(e) < 0) { var par = e.parentElement; if (!par) return comp; idx.unshift(Array.prototype.indexOf.call(par.children, e)); e = par; }
    if (!e) return comp;
    if (!idx.length) return comp;
    idx.unshift(hs.indexOf(e));
    return { name: elName(el), kind: 'element', el: el, parent: comp, children: [], path: comp.path + '|' + idx.join('.'), fiber: null };
  };
  I.resolve = function (T, path) {
    if (!T || !path) return null;
    var cut = path.indexOf('|'), comp = I.find(T, cut < 0 ? path : path.slice(0, cut));
    if (!comp || cut < 0) return comp;
    var idx = path.slice(cut + 1).split('.').map(Number), el = I.hosts(comp)[idx[0]];
    for (var i = 1; el && i < idx.length; i++) el = el.children[idx[i]];
    return el ? { name: elName(el), kind: 'element', el: el, parent: comp, children: [], path: path, fiber: null } : comp;
  };
  I.label = function (n) { return !n ? '' : n.kind === 'element' ? n.name : n.sheet ? 'Sheet · ' + n.sheet : n.name; };
  I.chain = function (n) { var out = []; for (var x = n; x && x.kind !== 'root'; x = x.parent) out.unshift(x); return out; };

  I.rect = function (node) {
    var r = null;
    /* an empty wrapper (0 high, its content placed absolutely) says nothing about where the layer is: its children do */
    (function each(els, depth) {
      els.forEach(function (e) {
        var b = e.getBoundingClientRect(), st = e.ownerDocument.defaultView.getComputedStyle(e);
        if (st.display === 'none') return;
        if (b.width < 0.5 || b.height < 0.5 || st.display === 'contents') { if (depth < 4) each(Array.prototype.slice.call(e.children), depth + 1); return; }
        if (st.visibility === 'hidden') return;
        r = r ? { left: Math.min(r.left, b.left), top: Math.min(r.top, b.top), right: Math.max(r.right, b.right), bottom: Math.max(r.bottom, b.bottom) } : { left: b.left, top: b.top, right: b.right, bottom: b.bottom };
      });
    })(I.hosts(node), 0);
    if (r) { r.width = r.right - r.left; r.height = r.bottom - r.top; }
    return r;
  };

  /* ---- props as the page passes them ---- */
  function preview(v, depth) {
    if (v == null) return String(v);
    if (typeof v === 'function') return 'ƒ';
    if (typeof v === 'string') return v.length > 60 ? JSON.stringify(v.slice(0, 57) + '…') : JSON.stringify(v);
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (v.$$typeof) return '<' + (v.type && (typeof v.type === 'string' ? v.type : v.type.name || 'Element')) + '>';
    if (v.current !== undefined && Object.keys(v).length === 1) return 'ref';
    if (Array.isArray(v)) return depth > 0 ? '[' + v.length + ']' : '[' + v.slice(0, 3).map(function (x) { return preview(x, depth + 1); }).join(', ') + (v.length > 3 ? ', … ' + v.length : '') + ']';
    if (depth > 0) return '{…}';
    var ks = Object.keys(v);
    return '{ ' + ks.slice(0, 4).map(function (k) { return k + ': ' + preview(v[k], depth + 1); }).join(', ') + (ks.length > 4 ? ', …' : '') + ' }';
  }
  I.props = function (node) {
    var p = node && node.fiber && node.fiber.memoizedProps || {};
    return Object.keys(p).filter(function (k) { return k !== 'children' && k !== 'key'; }).map(function (k) { return { key: k, value: preview(p[k], 0), raw: p[k] }; });
  };
  function jsx(v, depth) {
    if (typeof v === 'string') return JSON.stringify(v);
    if (typeof v === 'function') return '{() => {}}';
    if (v && v.$$typeof) return '{/* ' + preview(v, 0) + ' */}';
    var s = preview(v, depth || 0); return '{' + s + '}';
  }
  I.usage = function (node) {
    if (!node) return '';
    var p = node.fiber.memoizedProps || {}, parts = [];
    Object.keys(p).forEach(function (k) {
      if (k === 'children' || k === 'key') return;
      var v = p[k];
      if (v === true) parts.push(k); else if (v === undefined) return; else parts.push(k + '=' + jsx(v));
    });
    var ch = p.children, inner = typeof ch === 'string' ? ch : ch ? '{/* children */}' : null;
    var tagn = (node.app ? '' : 'PS.') + node.name, open = '<' + tagn + (parts.length ? (parts.join(' ').length > 50 ? '\n  ' + parts.join('\n  ') + '\n' : ' ' + parts.join(' ')) : '');
    return inner ? open + '>' + inner + '</' + tagn + '>' : open + (parts.join(' ').length > 50 ? '/>' : ' />');
  };
  /* the same as a call, as the repo writes it (no JSX: React.createElement) */
  I.call = function (node) {
    if (!node) return '';
    var p = node.fiber.memoizedProps || {}, parts = [];
    Object.keys(p).forEach(function (k) {
      if (k === 'children' || k === 'key' || p[k] === undefined) return;
      var v = p[k]; parts.push(k + ': ' + (typeof v === 'function' ? 'function () {}' : v && v.$$typeof ? 'null /* ' + preview(v, 0) + ' */' : preview(v, 0)));
    });
    var ch = p.children;
    return 'h(' + (node.app ? '' : 'PS.') + node.name + ', ' + (parts.length ? '{ ' + parts.join(', ') + ' }' : 'null') + (typeof ch === 'string' ? ', ' + JSON.stringify(ch) : ch ? ', /* children */' : '') + ')';
  };

  /* ---- tokens: every custom property of the app's stylesheets, resolved once per window ---- */
  I.tokens = function (win) {
    if (win.__dmTokens) return win.__dmTokens;
    var doc = win.document, names = {};
    Array.prototype.forEach.call(doc.styleSheets, function (sh) {
      var rules; try { rules = sh.cssRules; } catch (e) { return; }
      (function each(rs) { Array.prototype.forEach.call(rs || [], function (r) { if (r.cssRules) each(r.cssRules); if (r.style) for (var i = 0; i < r.style.length; i++) { var n = r.style[i]; if (n.indexOf('--') === 0) names[n] = 1; } }); })(rules);
    });
    var probe = doc.createElement('div'); probe.style.cssText = 'position:absolute;visibility:hidden;left:-999px;top:0;'; doc.body.appendChild(probe);
    var cs = win.getComputedStyle(probe), color = {}, len = {}, shadow = {}, all = {};
    Object.keys(names).forEach(function (n) {
      var raw = win.getComputedStyle(doc.documentElement).getPropertyValue(n).trim(); if (!raw) return;
      all[n] = raw;
      if (/shadow/.test(n)) { probe.style.boxShadow = 'var(' + n + ')'; var s = cs.boxShadow; probe.style.boxShadow = ''; (shadow[s] = shadow[s] || []).push(n); return; }
      if (/color|gradient|^--ps-(inset|countdown|expire)/.test(n) && !/gradient/.test(n)) { probe.style.color = 'rgb(1, 2, 3)'; probe.style.color = 'var(' + n + ')'; var c = cs.color; if (c !== 'rgb(1, 2, 3)') (color[c] = color[c] || []).push(n); probe.style.color = ''; return; }
      if (/spacing|radius|size|line-height|stroke|blur|gap|padding/.test(n)) { probe.style.width = '0px'; probe.style.width = 'var(' + n + ')'; var w = parseFloat(cs.width); probe.style.width = ''; if (!isNaN(w)) { var cat = /radius/.test(n) ? 'radius' : /font-size/.test(n) ? 'font' : /line-height/.test(n) ? 'line' : /stroke/.test(n) ? 'stroke' : /blur/.test(n) ? 'blur' : 'space'; var m = len[cat] = len[cat] || {}; (m[w] = m[w] || []).push(n); } }
    });
    probe.remove();
    var rank = function (a, b) { var sc = function (n) { return /^--color-(text|surface|icon|stroke|action|gradient)/.test(n) ? 0 : /^--color-/.test(n) ? 2 : /^--ps-/.test(n) ? 3 : 1; }; return sc(a) - sc(b) || a.length - b.length; };
    Object.keys(color).forEach(function (k) { color[k].sort(rank); });
    Object.keys(len).forEach(function (c) { Object.keys(len[c]).forEach(function (k) { len[c][k].sort(function (a, b) { return (/^--spacing-(padding|gap)/.test(a) ? 0 : 1) - (/^--spacing-(padding|gap)/.test(b) ? 0 : 1) || a.length - b.length; }); }); });
    return (win.__dmTokens = { color: color, len: len, shadow: shadow, all: all, count: Object.keys(all).length });
  };

  /* specs(win, node): what the component measures, with the token each value matches (as Figma lists a layer's properties) */
  I.specs = function (win, node) {
    var el = I.hosts(node)[0]; if (!el) return null;
    var T = I.tokens(win), cs = win.getComputedStyle(el), r = I.rect(node) || el.getBoundingClientRect(), rootPx = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;
    function lenTok(px, cat) { var m = T.len[cat] || {}; var v = Math.round(parseFloat(px) * 100) / 100; return (m[v] || m[Math.round(v)] || [])[0] || null; }
    /* what the CSS says for a length (var(--…) as written; an expression as written); the value's token only when nothing is written */
    function said(prop, px, cat) {
      var d = I.declared && I.trueDecl ? I.trueDecl(win, el, I.declared(win, el, prop), px) : '';
      var tk = I.tokenOf ? I.tokenOf(d) : null;
      return { token: tk || (d && /var\(/.test(d) ? null : lenTok(px, cat)), expr: d && /var\(/.test(d) && !tk ? d : null };
    }
    function colTok(c, prop, from) {
      var tk = null, e = from || el;
      if (prop && I.declared) {
        for (var k = 0; e && e.nodeType === 1 && k < (prop === 'color' ? 40 : 1); k++, e = e.parentElement) {   /* text colour is inherited */
          var d = I.declared(win, e, prop) || (prop === 'background-color' ? I.declared(win, e, 'background') : prop === 'border-top-color' ? I.declared(win, e, 'border') || I.declared(win, e, 'border-top') : '');
          if (d) { var m = /var\((--color-[\w-]+)\)/.exec(d) || /var\((--[\w-]+)\)/.exec(d); tk = m && !/^(?:inherit|currentcolor)$/i.test(d) ? m[1] : null; break; }
        }
      }
      return tk || (T.color[c] || [])[0] || null;
    }
    var rows = [], add = function (group, label, value, token, px, expr) { rows.push({ group: group, label: label, value: value, token: token, px: px, expr: expr || null }); };
    add('layout', 'w', r.width, null, true); add('layout', 'h', r.height, null, true);
    var pad = ['Top', 'Right', 'Bottom', 'Left'].map(function (s) { return parseFloat(cs['padding' + s]); });
    if (pad.some(Boolean)) ['top', 'right', 'bottom', 'left'].forEach(function (s, i) { if (pad[i]) { var w = said('padding-' + s, pad[i], 'space'); add('padding', s, pad[i], w.token, true, w.expr); } });
    var col = /column/.test(cs.flexDirection) || cs.display.indexOf('grid') >= 0, gap = parseFloat(col ? cs.rowGap : cs.columnGap) || parseFloat(cs.rowGap) || parseFloat(cs.columnGap);
    if (gap && /flex|grid/.test(cs.display)) { var g = said(col ? 'row-gap' : 'column-gap', gap, 'space'); add('layout', 'gap', gap, g.token, true, g.expr); }
    if (/flex|grid/.test(cs.display)) add('layout', 'dir', cs.display.indexOf('grid') >= 0 ? 'grid' : cs.flexDirection === 'column' ? 'column' : 'row');
    var rad = parseFloat(cs.borderTopLeftRadius);
    if (rad) { var rw = said('border-top-left-radius', rad, 'radius'); add('look', 'radius', rad >= 999 ? 9999 : rad, rw.token || (rad >= 999 ? '--radius-full' : null), true, rw.expr); }
    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') add('look', 'fill', cs.backgroundColor, colTok(cs.backgroundColor, 'background-color'));
    if (cs.backgroundImage && cs.backgroundImage !== 'none') add('look', 'image', cs.backgroundImage.slice(0, 80) + (cs.backgroundImage.length > 80 ? '…' : ''));
    if (parseFloat(cs.borderTopWidth)) add('look', 'stroke', cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor, colTok(cs.borderTopColor, 'border-top-color'));
    if (cs.boxShadow && cs.boxShadow !== 'none' && !/^(rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?)+$/.test(cs.boxShadow)) { var sd = I.declared ? I.declared(win, el, 'box-shadow') : '', stk = I.tokenOf ? I.tokenOf(sd) : null; add('look', 'shadow', cs.boxShadow, stk || (sd && /var\(/.test(sd) ? null : (T.shadow[cs.boxShadow] || [])[0] || null), false, sd && /var\(/.test(sd) && !stk ? sd : null); }
    if (parseFloat(cs.opacity) < 0.99) add('look', 'opacity', Math.round(parseFloat(cs.opacity) * 100) / 100);
    var tc = Array.prototype.filter.call(el.classList, function (c) { return /^ps-t-/.test(c); });
    var txt = el.querySelector('*') && !el.textContent.trim() ? null : el;
    if (txt) {
      var t = tc.length ? el : (el.querySelector('[class*="ps-t-"]') || el), ts = win.getComputedStyle(t), tcls = Array.prototype.filter.call(t.classList, function (c) { return /^ps-t-/.test(c); });
      add('text', 'style', tcls[0] || '—', null);
      add('text', 'font', ts.fontFamily.split(',')[0].replace(/["']/g, '') + ' ' + ts.fontWeight);
      add('text', 'size', parseFloat(ts.fontSize), lenTok(ts.fontSize, 'font'), true);
      if (ts.lineHeight !== 'normal') add('text', 'line', parseFloat(ts.lineHeight), lenTok(ts.lineHeight, 'line'), true);
      add('text', 'color', ts.color, colTok(ts.color, 'color', t));
    }
    return { rows: rows, rootPx: rootPx, element: el, classes: Array.prototype.slice.call(el.classList) };
  };
  I.fmt = function (v, px, unit, rootPx) {
    if (!px || typeof v !== 'number') return String(v);
    if (v >= 9999) return 'full';
    return unit === 'rem' ? (Math.round(v / (rootPx || 16) * 1000) / 1000) + 'rem' : (Math.round(v * 100) / 100) + 'px';
  };

  /* motion values of the version in the canvas (PS.MT): a spring, a tween, or a function of an index */
  I.motion = function (win, names) {
    var MT = win.PS && win.PS.MT; if (!MT) return [];
    return (names || []).map(function (n) {
      var v = MT[n]; var text;
      if (typeof v === 'function') { try { text = JSON.stringify(v(0)); } catch (e) { text = String(v); } text = '(i) → ' + text; }
      else if (v && typeof v === 'object' && !Array.isArray(v)) text = JSON.stringify(v);
      else text = JSON.stringify(v);
      return { name: n, value: text };
    });
  };
})();

/* ---- layout: padding and gaps as Figma draws them on hover, labelled with what the CSS actually says (var(--…)) ---- */
(function () {
  'use strict';
  var I = window.DM.inspect;
  function styleRules(win) {
    if (win.__dmRules) return win.__dmRules;
    var out = [];
    Array.prototype.forEach.call(win.document.styleSheets, function (sh) {
      var rs; try { rs = sh.cssRules; } catch (e) { return; }
      (function each(list) { Array.prototype.forEach.call(list || [], function (r) { if (r.selectorText && r.style) out.push(r); else if (r.cssRules && (!r.media || win.matchMedia(r.media.mediaText).matches)) each(r.cssRules); }); })(rs);
    });
    return (win.__dmRules = out);
  }
  function splitTop(v) { var out = [], d = 0, cur = ''; for (var i = 0; i < v.length; i++) { var c = v[i]; if (c === '(') d++; if (c === ')') d--; if (c === ' ' && !d) { if (cur) out.push(cur); cur = ''; } else cur += c; } if (cur) out.push(cur); return out; }
  /* the value the stylesheets give a property (last matching rule wins; the element's own style after them) */
  /* the value the stylesheets give one longhand (padding-top, row-gap …): the rule that wins by !important, specificity, then order.
     A shorthand counts too — with var() in it, CSSOM leaves its longhands empty, so the shorthand's value is split here */
  var SHORT = { 'padding-top': ['padding', 0], 'padding-right': ['padding', 1], 'padding-bottom': ['padding', 2], 'padding-left': ['padding', 3], 'row-gap': ['gap', 0], 'column-gap': ['gap', 1],
    'border-top-left-radius': ['border-radius', 0], 'border-top-right-radius': ['border-radius', 1], 'border-bottom-right-radius': ['border-radius', 2], 'border-bottom-left-radius': ['border-radius', 3] };
  function part(v, prop) {
    var sh = SHORT[prop], ps = splitTop(v); if (!sh) return v;
    if (sh[0] === 'gap') return ps[sh[1]] || ps[0];
    var ix = ps.length === 1 ? [0, 0, 0, 0] : ps.length === 2 ? [0, 1, 0, 1] : ps.length === 3 ? [0, 1, 2, 1] : [0, 1, 2, 3];
    return ps[ix[sh[1]]];
  }
  function ruleValue(st, prop) {
    var v = st.getPropertyValue(prop); if (v) return { v: v.trim(), imp: st.getPropertyPriority(prop) === 'important' };
    var sh = SHORT[prop], w = sh && st.getPropertyValue(sh[0]);
    return w ? { v: part(w.trim(), prop), imp: st.getPropertyPriority(sh[0]) === 'important' } : null;
  }
  I.declared = function (win, el, prop) {
    var C = win.__dmDecl || (win.__dmDecl = new WeakMap()), sig = el.className + '|' + (el.getAttribute('style') || ''), c = C.get(el);
    if (!c || c.sig !== sig) C.set(el, c = { sig: sig, v: {} });
    if (!(prop in c.v)) c.v[prop] = declared(win, el, prop);
    return c.v[prop];
  };
  /* specificity of one selector: [ids, classes / attributes / pseudo-classes, tags / pseudo-elements] as one number */
  function spec(sel) {
    var s = sel.replace(/:(not|is|has)\(([^()]*)\)/g, ' $2').replace(/:where\([^()]*\)/g, '');
    var a = (s.match(/#[\w-]+/g) || []).length, b = (s.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) || []).length;
    var c = (s.replace(/"[^"]*"|'[^']*'/g, '').match(/(^|[\s>+~(])[a-z][\w-]*/gi) || []).length + (s.match(/::[\w-]+/g) || []).length;
    return a * 10000 + b * 100 + c;
  }
  function declared(win, el, prop) {
    var best = null;
    styleRules(win).forEach(function (r) {
      var rv = ruleValue(r.style, prop); if (!rv) return;
      var sp = -1;
      r.selectorText.split(/,(?![^(]*\))/).forEach(function (one) { var m = false; try { m = el.matches(one); } catch (e) {} if (m) sp = Math.max(sp, spec(one)); });
      if (sp < 0) return;
      var imp = rv.imp ? 1 : 0;
      if (!best || imp > best.imp || (imp === best.imp && sp >= best.sp)) best = { v: rv.v, sp: sp, imp: imp };
    });
    var own = el.style && ruleValue(el.style, prop);
    if (own && !(best && best.imp)) return own.v;
    return best ? best.v : '';
  }
  function sides(win, el, base) {
    var out = {};
    ['top', 'right', 'bottom', 'left'].forEach(function (s) { out[s] = I.declared(win, el, base + '-' + s); });
    return out;
  }
  /* a declared length still true for the element (an animation or a script may have changed it since) */
  I.trueDecl = function (win, el, decl, px) {
    if (!decl) return '';
    var m = /^var\((--[a-z0-9-]+)\)$/.exec(decl); if (!m) return decl;
    var raw = win.getComputedStyle(el).getPropertyValue(m[1]).trim(), root = parseFloat(win.getComputedStyle(win.document.documentElement).fontSize) || 16;
    var v = /rem$/.test(raw) ? parseFloat(raw) * root : parseFloat(raw);
    return isNaN(v) || Math.abs(v - px) < 0.6 ? decl : '';
  };
  I.tokenOf = function (decl) { var m = /^var\((--[a-z0-9-]+)\)$/.exec(decl || ''); return m ? m[1] : null; };
  /* layout(win, node) → { box, padding: { top: { px, decl } … }, gaps: [{ rect, px, decl, auto }], children: [rects], dir } */
  I.layout = function (win, node) {
    var el = I.hosts(node)[0]; if (!el) return null;
    var cs = win.getComputedStyle(el), b = el.getBoundingClientRect();
    var bw = { top: parseFloat(cs.borderTopWidth) || 0, right: parseFloat(cs.borderRightWidth) || 0, bottom: parseFloat(cs.borderBottomWidth) || 0, left: parseFloat(cs.borderLeftWidth) || 0 };
    var pd = sides(win, el, 'padding'), pad = {};
    ['top', 'right', 'bottom', 'left'].forEach(function (s) { var px = parseFloat(cs['padding' + s[0].toUpperCase() + s.slice(1)]) || 0; pad[s] = { px: px, decl: I.trueDecl(win, el, pd[s], px) }; });
    var flex = /flex|grid/.test(cs.display), col = flex && (cs.display.indexOf('grid') >= 0 || /column/.test(cs.flexDirection));
    var kids = Array.prototype.filter.call(el.children, function (c) {
      var s = win.getComputedStyle(c); if (s.position === 'absolute' || s.position === 'fixed' || s.display === 'none') return false;
      var r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0;
    }).map(function (c) { return c.getBoundingClientRect(); });
    var gaps = [];
    if (flex && kids.length > 1) {
      var gdecl = I.declared(win, el, col ? 'row-gap' : 'column-gap'), auto = /space-(between|around|evenly)/.test(cs.justifyContent) && (!gdecl || gdecl === 'normal' || parseFloat(gdecl) === 0);
      var inner = { left: b.left + bw.left + pad.left.px, right: b.right - bw.right - pad.right.px, top: b.top + bw.top + pad.top.px, bottom: b.bottom - bw.bottom - pad.bottom.px };
      var sorted = kids.slice().sort(function (x, y) { return col ? x.top - y.top : x.left - y.left; });
      for (var i = 1; i < sorted.length; i++) {
        var a = sorted[i - 1], c = sorted[i], px = col ? c.top - a.bottom : c.left - a.right;
        if (px < 0.5) continue;
        gaps.push({ px: px, decl: I.trueDecl(win, el, gdecl, px), auto: auto, rect: col ? { left: inner.left, right: inner.right, top: a.bottom, bottom: c.top } : { left: a.right, right: c.left, top: inner.top, bottom: inner.bottom } });
      }
    }
    return { box: { left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height }, border: bw, padding: pad, gaps: gaps, children: kids, dir: col ? 'column' : 'row' };
  };
})();

/* ---- the stylesheet rules an element matches (as written in the repo), and the pictures inside a layer ---- */
(function () {
  'use strict';
  var I = window.DM.inspect;
  function rules(win) {
    var out = [];
    Array.prototype.forEach.call(win.document.styleSheets, function (sh) {
      var rs; try { rs = sh.cssRules; } catch (e) { return; }
      var file = (sh.href || '').split('?')[0].split('/').slice(-2).join('/') || 'inline';
      (function each(list, media) { Array.prototype.forEach.call(list || [], function (r) { if (r.selectorText && r.style) out.push({ r: r, file: file, media: media }); else if (r.cssRules) each(r.cssRules, r.media ? r.media.mediaText : media); }); })(rs, null);
    });
    return out;
  }
  /* the declarations as written: from cssText, split at top-level semicolons (a var() shorthand stays one line) */
  function declsOf(st) {
    var t = st.cssText, out = [], d = 0, cur = '';
    for (var i = 0; i < t.length; i++) { var c = t[i]; if (c === '(') d++; if (c === ')') d--; if (c === ';' && !d) { if (cur.trim()) out.push(cur.trim() + ';'); cur = ''; } else cur += c; }
    if (cur.trim()) out.push(cur.trim() + ';');
    return out;
  }
  I.matchedRules = function (win, el) {
    if (!el) return [];
    return rules(win).filter(function (x) {
      if (/tokens(-rem)?\.css$|fonts\.css$/.test(x.file)) return false;
      if (x.media && !win.matchMedia(x.media).matches) return false;
      return x.r.selectorText.split(/,(?![^(]*\))/).some(function (s) { try { return el.matches(s.trim()); } catch (e) { return false; } });
    }).filter(function (x) { return !/^[\s*,:a-z-]*$/.test(x.r.selectorText) || /[a-z]/.test(x.r.selectorText.replace(/::?(before|after)/g, '')); })
      .map(function (x) { return { sel: x.r.selectorText, file: x.file, media: x.media, decl: declsOf(x.r.style) }; });
  };
  /* pictures drawn inside a layer: <img>, and icons / backgrounds set with url() */
  I.assets = function (win, node) {
    var seen = {}, out = [];
    function add(u, kind) { if (!u || seen[u] || /^data:/.test(u) && u.length > 4000) return; seen[u] = 1; var name = decodeURIComponent(u.split('?')[0].split('/').pop()); out.push({ url: u, name: name, kind: kind }); }
    I.hosts(node).forEach(function (root) {
      [root].concat(Array.prototype.slice.call(root.querySelectorAll('*'))).slice(0, 600).forEach(function (e) {
        if (e.tagName === 'IMG' && e.currentSrc) add(e.currentSrc, 'img');
        var src = e.style && e.style.getPropertyValue('--ps-src'); var m = src && /url\(["']?([^"')]+)/.exec(src); if (m) add(new win.URL(m[1], win.location.href).href, 'icon');
        var bg = win.getComputedStyle(e).backgroundImage; var mb = bg && /url\(["']?([^"')]+)/.exec(bg); if (mb) add(mb[1], 'bg');
      });
    });
    return out;
  };
})();
