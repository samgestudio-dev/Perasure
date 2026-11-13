/* PeraSure Dev Mode — the canvas: the live app (or a snapshot) in a phone-sized frame, with Figma Dev Mode's overlays over it.
   Inspect: hover outlines a component with its name; its padding is hatched blue and the gaps between its children pink, each
   labelled with what the CSS says (var(--…), Auto, or the number when no token is written); its children get dashed outlines.
   Click selects (Ctrl / ⌘ goes down to the element). Alt: red redlines from the selection to what the pointer is over (or to the
   frame), with dashed guides when they don't line up. Interact: the app works as on a phone and the page list follows it. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, I = DM.inspect;
  DM.DEVICES = [{ id: '360', w: 360, h: 780, name: 'Android · 360' }, { id: '390', w: 390, h: 844, name: 'iPhone 15 · 390' }, { id: '430', w: 430, h: 932, name: 'iPhone 15 Pro Max · 430' }];
  DM.device = function (id) { return DM.DEVICES.filter(function (d) { return d.id === String(id); })[0] || DM.DEVICES[0]; };

  /* ---- overlay, drawn as HTML every frame (only written when it changed) ---- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v) { return String(Math.round(v * 10) / 10); }
  function rectBox(cls, r, z) { return '<i class="' + cls + '" style="left:' + r.left * z + 'px;top:' + r.top * z + 'px;width:' + Math.max(0, r.right - r.left) * z + 'px;height:' + Math.max(0, r.bottom - r.top) * z + 'px"></i>'; }
  function lab(cls, x, y, text) { return '<b class="dm-o-num ' + cls + '" style="left:' + x + 'px;top:' + y + 'px">' + esc(text) + '</b>'; }
  /* a label says the token as written, short: var(--spacing-gap-sm) → gap-sm (the full name is in Inspect); otherwise the number */
  function spText(s) {
    if (s.auto) return 'Auto';
    var m = s.decl && /^var\(--([a-z0-9-]+)\)$/.exec(s.decl);
    return m ? m[1].replace(/^spacing-/, '') : num(s.px);
  }
  /* labels that would sit on each other move along their band, then out of it (as Figma keeps them readable) */
  function placeLabels(list) {
    var done = [];
    return list.map(function (l) {
      var w = l.text.length * 6 + 10, hh = 16, t2 = (l.thick || 0) / 2, ox = w / 2 + t2 + 2, oy = hh / 2 + t2 + 2;
      var tries = l.side === 'top' ? [[0, 0], [0, -oy], [w * 0.7, 0], [-w * 0.7, 0]] : l.side === 'bottom' ? [[0, 0], [0, oy], [w * 0.7, 0], [-w * 0.7, 0]]
        : l.side === 'left' ? [[0, 0], [-ox, 0], [-ox, 17], [-ox, -17]] : l.side === 'right' ? [[0, 0], [ox, 0], [ox, 17], [ox, -17]]
        : [[0, 0], [0, 17], [0, -17], [w * 0.7, 0], [-w * 0.7, 0], [0, 34], [0, -34]];
      for (var i = 0; i < tries.length; i++) {
        var x = l.x + tries[i][0], y = l.y + tries[i][1], r = { l: x - w / 2, r: x + w / 2, t: y - hh / 2, b: y + hh / 2 };
        if (!done.some(function (d) { return r.l < d.r && d.l < r.r && r.t < d.b && d.t < r.b; })) { done.push(r); return lab(l.cls, x, y, l.text); }
      }
      return '';
    }).join('');
  }
  function R4(l, t, r, b) { return { left: l, top: t, right: r, bottom: b }; }

  function spacing(o, n, out, labels) {
    var L = I.layout(o.win, n), z = o.z; if (!L) return;
    L.children.forEach(function (c) { out.push(rectBox('dm-o-child', c, z)); });
    var b = L.box, bw = L.border, p = L.padding;
    var x0 = b.left + bw.left, x1 = b.right - bw.right, y0 = b.top + bw.top, y1 = b.bottom - bw.bottom;
    var bands = [
      { s: p.top, r: R4(x0, y0, x1, y0 + p.top.px) }, { s: p.bottom, r: R4(x0, y1 - p.bottom.px, x1, y1) },
      { s: p.left, r: R4(x0, y0 + p.top.px, x0 + p.left.px, y1 - p.bottom.px) }, { s: p.right, r: R4(x1 - p.right.px, y0 + p.top.px, x1, y1 - p.bottom.px) }];
    var ls = [];
    bands.forEach(function (bd, i) {
      if (bd.s.px < 0.5) return;
      out.push(rectBox('dm-o-pad', bd.r, z));
      ls.push({ cls: 'is-pad', x: (bd.r.left + bd.r.right) / 2 * z, y: (bd.r.top + bd.r.bottom) / 2 * z, text: spText(bd.s), side: ['top', 'bottom', 'left', 'right'][i], thick: bd.s.px * z });
    });
    L.gaps.forEach(function (g) {
      out.push(rectBox('dm-o-gap', g.rect, z));
      ls.push({ cls: 'is-gap', x: (g.rect.left + g.rect.right) / 2 * z, y: (g.rect.top + g.rect.bottom) / 2 * z, text: spText(g), side: 'gap' });
    });
    labels.push(placeLabels(ls));
  }
  function tag(r, text, z, cls, H) {
    var y = r.top * z - 19; if (y < -2) y = r.top * z + 2;
    return '<b class="dm-o-tag ' + (cls || '') + '" style="left:' + r.left * z + 'px;top:' + y + 'px">' + esc(text) + '</b>';
  }
  function sizeTag(r, z, H) {
    var y = r.bottom * z + 4; if (y > H * z - 4) y = r.bottom * z - 21;
    return '<b class="dm-o-tag is-size" style="left:' + (r.left + r.right) / 2 * z + 'px;top:' + y + 'px">' + num(r.right - r.left) + ' × ' + num(r.bottom - r.top) + '</b>';
  }
  /* redlines between a (the selection) and b (what the pointer is over) */
  function measure(a, b, z, out, labels) {
    function hl(x1, x2, y, v) { var l = Math.min(x1, x2), w = Math.abs(x2 - x1); if (w < 0.5) return; out.push('<i class="dm-o-line" style="left:' + l * z + 'px;top:' + (y * z - 0.5) + 'px;width:' + w * z + 'px;height:1px"></i>'); labels.push(lab('is-m', (l + w / 2) * z, y * z, num(v == null ? w : v))); }
    function vl(y1, y2, x, v) { var t = Math.min(y1, y2), hh = Math.abs(y2 - y1); if (hh < 0.5) return; out.push('<i class="dm-o-line" style="left:' + (x * z - 0.5) + 'px;top:' + t * z + 'px;width:1px;height:' + hh * z + 'px"></i>'); labels.push(lab('is-m', x * z, (t + hh / 2) * z, num(v == null ? hh : v))); }
    function hg(x1, x2, y) { var l = Math.min(x1, x2), w = Math.abs(x2 - x1); if (w >= 0.5) out.push('<i class="dm-o-guide is-h" style="left:' + l * z + 'px;top:' + y * z + 'px;width:' + w * z + 'px"></i>'); }
    function vg(y1, y2, x) { var t = Math.min(y1, y2), hh = Math.abs(y2 - y1); if (hh >= 0.5) out.push('<i class="dm-o-guide is-v" style="left:' + x * z + 'px;top:' + t * z + 'px;height:' + hh * z + 'px"></i>'); }
    var meet = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    if (meet) {   /* one inside the other, or overlapping: edge to edge, through the middle of what they share */
      var cx = (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2, cy = (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2;
      vl(a.top, b.top, cx); vl(a.bottom, b.bottom, cx); hl(a.left, b.left, cy); hl(a.right, b.right, cy);
      return;
    }
    var oy = Math.max(a.top, b.top) < Math.min(a.bottom, b.bottom), ox = Math.max(a.left, b.left) < Math.min(a.right, b.right);
    if (b.left >= a.right || a.left >= b.right) {
      var right = b.left >= a.right, x1 = right ? a.right : a.left, x2 = right ? b.left : b.right;
      var y = oy ? (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2 : (a.top + a.bottom) / 2;
      hl(x1, x2, y);
      if (!oy) vg(y, y < b.top ? b.top : b.bottom, x2);
    }
    if (b.top >= a.bottom || a.top >= b.bottom) {
      var down = b.top >= a.bottom, y1 = down ? a.bottom : a.top, y2 = down ? b.top : b.bottom;
      var x = ox ? (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2 : (a.left + a.right) / 2;
      vl(y1, y2, x);
      if (!ox) hg(x, x < b.left ? b.left : b.right, y2);
    }
  }
  /* o: { win, T, hover, sel, alt, z, w, h } */
  DM.overlayHTML = function (o) {
    var out = [], labels = [], z = o.z, frame = R4(0, 0, o.w, o.h);
    var sameAsSel = o.hover && o.sel && o.hover.path === o.sel.path;
    if (!o.alt) { var focus = o.hover || o.sel; if (focus && focus.kind !== 'page' && focus.kind !== 'tab') spacing(o, focus, out, labels); }
    var clamp = function (r) { return r ? R4(Math.max(0, r.left), Math.max(0, r.top), Math.min(o.w, r.right), Math.min(o.h, r.bottom)) : r; };
    var hr = o.hover && !sameAsSel ? I.rect(o.hover) : null, sr = o.sel ? I.rect(o.sel) : null, top = [];
    var isPage = function (n) { return n.kind === 'page' || n.kind === 'tab'; };
    if (hr && !o.alt) { top.push(rectBox('dm-o-hover' + (isPage(o.hover) ? ' is-page' : ''), clamp(hr), z)); labels.push(tag(hr, I.label(o.hover), z, isPage(o.hover) ? 'is-page' : 'is-hover')); }
    if (sr) { top.push(rectBox('dm-o-sel' + (isPage(o.sel) ? ' is-page' : ''), clamp(sr), z)); labels.push(tag(sr, I.label(o.sel), z, isPage(o.sel) ? 'is-page' : '')); if (!o.alt) labels.push(sizeTag(sr, z, o.h)); }
    if (o.alt && sr) {
      var target = hr || null;
      if (!target) { for (var p = o.sel.parent; p && !target; p = p.parent) { if (p.kind === 'root') break; var pr = I.rect(p); if (pr && (pr.right - pr.left) > (sr.right - sr.left) + 0.5 || pr && (pr.bottom - pr.top) > (sr.bottom - sr.top) + 0.5) target = pr; } }
      target = target || frame;
      if (target !== frame) top.push(rectBox('dm-o-target', clamp(target), z));
      measure(sr, target, z, out, labels);
    }
    return '<div class="dm-o-clip" style="width:' + o.w * z + 'px;height:' + o.h * z + 'px">' + out.join('') + '</div>' + top.join('') + labels.join('');
  };

  function editable(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }

  /* p: src, js, app (false for a page without the app), device, zoom ('fit' | number), mode, sel (path), extHover (path from Layers),
        onSelect(path), onHover(path), onTree(T), onRoute(route), onMode(mode), onZoom(z), onDevice(id), onReload(), title, code,
        states [{ label, on, onClick }], banner (node), hintless */
  DM.Canvas = function Canvas(p) {
    var frameRef = R.useRef(null), ovRef = R.useRef(null), centerRef = R.useRef(null), headRef = R.useRef(null);
    var st = R.useRef({ T: null, hover: null, alt: false, win: null, html: '', sig: '', route: '' }).current;
    var ls = R.useState(true), loading = ls[0], setLoading = ls[1];
    var fz = R.useState(1), fitZ = fz[0], setFitZ = fz[1];
    var dev = DM.device(p.device), z = p.zoom === 'fit' || !p.zoom ? fitZ : +p.zoom;
    var pr = R.useRef(p); pr.current = p;
    var zr = R.useRef(z); zr.current = z;
    var dr = R.useRef(dev); dr.current = dev;

    /* fit the frame to the space the canvas has */
    R.useLayoutEffect(function () {
      var el = centerRef.current; if (!el) return;
      function fit() {
        var head = headRef.current ? headRef.current.offsetHeight : 40, d = dr.current;
        var zz = Math.min((el.clientWidth - 160) / d.w, (el.clientHeight - 64 - 96 - head) / d.h);
        setFitZ(Math.max(0.3, Math.min(1.5, Math.floor(zz * 100) / 100)));
      }
      fit(); var ro = new ResizeObserver(fit); ro.observe(el); if (headRef.current) ro.observe(headRef.current);
      return function () { ro.disconnect(); };
    }, [p.device]);

    function setHover(n) {
      var a = st.hover && st.hover.path, b = n && n.path;
      st.hover = n;
      if (a !== b && pr.current.onHover) pr.current.onHover(b || null);
    }
    function setAlt(v) { st.alt = !!v; }
    function refresh(first) {
      var win = st.win; if (!win) return;
      var T; try { T = I.tree(win); } catch (e) { return; }
      st.T = T;
      if (st.hover) st.hover = I.resolve(T, st.hover.path);
      if (pr.current.onTree) pr.current.onTree(T);
      var S = win.APP && win.APP.S;
      if (S) {
        var top = S.stack && S.stack[S.stack.length - 1];
        var r = { screen: top && top.name, params: top && top.params, tab: S.tab, sheet: S.sheet && S.sheet.name };
        var rs = JSON.stringify([r.screen, r.tab, r.sheet, r.params]);
        if (rs !== st.route) { st.route = rs; if (!first && pr.current.onRoute) pr.current.onRoute(r); }
      }
    }
    function keys(e, inFrame) {
      var P = pr.current;
      if (e.key === 'Alt') { setAlt(true); e.preventDefault(); return; }
      if (editable(e.target) && (inFrame ? P.mode !== 'inspect' : true)) return;
      if (e.metaKey || e.ctrlKey) return;
      var k = e.key.toLowerCase();
      if (k === 'i' && !e.shiftKey) { P.onMode && P.onMode('inspect'); return; }
      if (k === 'p' && !e.shiftKey) { P.onMode && P.onMode('interact'); return; }
      if (P.mode !== 'inspect') return;
      var T = st.T, n = P.sel ? I.resolve(T, P.sel) : null;
      if (e.key === 'Escape') { P.onSelect(null); e.preventDefault(); }
      else if (e.key === 'Enter' && n) {
        e.preventDefault();
        if (e.shiftKey) { var up = n.kind === 'element' ? n.parent : n.parent; while (up && up.kind !== 'component' && up.kind !== 'root' && up.kind !== 'page' && up.kind !== 'tab') up = up.parent; if (up && up.kind !== 'root') P.onSelect(up.path); }
        else if (n.children && n.children.length) P.onSelect(n.children[0].path);
      }
    }
    function pick(e, click) {
      var T = st.T; if (!T) return;
      var el = e.target; if (el && el.nodeType !== 1) el = el.parentElement;
      var n = (e.metaKey || e.ctrlKey) ? I.elementNode(T, el) : I.nodeFor(T, el);
      if (click) { pr.current.onSelect(n ? n.path : null); return; }
      setHover(n);
    }
    function bind(win) {
      var block = function (e) { if (pr.current.mode !== 'inspect') return; e.preventDefault(); e.stopImmediatePropagation(); };
      ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'dblclick', 'contextmenu', 'auxclick', 'submit'].forEach(function (t) { win.addEventListener(t, block, true); });
      win.addEventListener('click', function (e) { if (pr.current.mode !== 'inspect') return; e.preventDefault(); e.stopImmediatePropagation(); pick(e, true); }, true);
      win.addEventListener('mousemove', function (e) { setAlt(e.altKey); if (pr.current.mode === 'inspect') pick(e, false); }, true);
      win.document.documentElement.addEventListener('mouseleave', function () { setHover(null); });
      win.addEventListener('keydown', function (e) { keys(e, true); }, true);
      win.addEventListener('keyup', function (e) { if (e.key === 'Alt') setAlt(false); }, true);
      win.addEventListener('blur', function () { setAlt(false); });
      var mo = new win.MutationObserver(function () { clearTimeout(st.moT); st.moT = setTimeout(function () { refresh(false); }, 120); });
      mo.observe(win.document.body, { childList: true, subtree: true });
      win.addEventListener('dm-refresh', function () { refresh(false); });
    }
    function onLoad() {
      var f = frameRef.current; if (!f) return;
      var win = f.contentWindow; st.win = win; st.T = null; st.hover = null; st.route = '';
      var tries = 0;
      (function wait() {
        if (!frameRef.current || frameRef.current.contentWindow !== win) return;
        var ok = false; try { ok = I.ready(win) && (pr.current.app === false || !!(win.APP && win.APP.S)); } catch (e) {}
        if (!ok) { if (++tries < 300) setTimeout(wait, 50); else setLoading(false); return; }
        bind(win);
        var js = pr.current.js;
        /* the hosted Withdraw demo loads after the app: a script that borrows waits for it (otherwise the app falls back to its keypad page) */
        var needWd = js && /APP\.borrow/.test(js), n = 0;
        (function run() {
          if (frameRef.current && frameRef.current.contentWindow !== win) return;
          var wd = false; try { var sh = win.APP.wd && win.APP.wd.sheet(); wd = !!(sh && sh.ready && sh.ready()); } catch (e) {}
          if (needWd && !wd && ++n < 120) { setTimeout(run, 50); return; }
          if (js) { try { win.eval(js); } catch (e) { console.warn('[devmode] page script failed', e); } }
          setTimeout(function () { refresh(true); setLoading(false); }, js ? (needWd ? 900 : 500) : 250);
        })();
      })();
    }
    R.useEffect(function () { setLoading(true); }, [p.src, p.js, p.device, p.reloadKey]);

    /* the overlay follows the app every frame (scrolling, motion, sheets) */
    R.useEffect(function () {
      var raf;
      (function loop() {
        var ov = ovRef.current, P = pr.current, html = '';
        if (ov && st.T && st.win && P.mode === 'inspect') {
          try {
            var hv = st.hover || (P.extHover ? I.resolve(st.T, P.extHover) : null);
            html = DM.overlayHTML({ win: st.win, T: st.T, hover: hv, sel: P.sel ? I.resolve(st.T, P.sel) : null, alt: st.alt, z: zr.current, w: dr.current.w, h: dr.current.h });
          } catch (e) { html = ''; }
        }
        if (ov && html !== st.html) { ov.innerHTML = html; st.html = html; }
        raf = requestAnimationFrame(loop);
      })();
      var kd = function (e) { if (e.target && e.target.closest && e.target.closest('input, textarea, select, .dm-modal')) { if (e.key === 'Alt') setAlt(true); return; } keys(e, false); };
      var ku = function (e) { if (e.key === 'Alt') setAlt(false); };
      var bl = function () { setAlt(false); };
      window.addEventListener('keydown', kd); window.addEventListener('keyup', ku); window.addEventListener('blur', bl);
      return function () { cancelAnimationFrame(raf); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); window.removeEventListener('blur', bl); };
    }, []);
    R.useEffect(function () { if (p.mode !== 'inspect') setHover(null); }, [p.mode]);

    var zoomTo = function (v) { p.onZoom && p.onZoom(v === 'fit' ? 'fit' : Math.max(0.25, Math.min(3, Math.round(v * 100) / 100))); };
    var canvasWheel = function (e) { if (e.ctrlKey || e.metaKey) { e.preventDefault(); zoomTo(z * (e.deltaY < 0 ? 1.1 : 1 / 1.1)); } };
    var t = DM.t;

    return h('div', { className: 'dm-center', ref: centerRef },
      h('div', { className: 'dm-canvas', onWheel: canvasWheel },
        h('div', { className: 'dm-canvas__inner' },
          h('div', { ref: headRef },
            h('div', { className: 'dm-framehead' }, h(DM.Icon, { name: p.kind === 'sheet' ? 'sheet' : p.kind === 'component' ? 'component' : 'frame', size: 14 }),
              h('b', null, p.title), p.code ? h('code', null, p.code) : null, p.headExtra || null),
            p.states && p.states.length > 1 ? h('div', { className: 'dm-states' }, p.states.map(function (s, i) {
              return h('button', { key: i, type: 'button', className: DM.cx('dm-state', s.on && 'is-on'), onClick: s.onClick, title: s.title }, s.label);
            })) : null),
          h('div', { className: 'dm-framebox', style: { width: dev.w * z, height: dev.h * z } },
            h('div', { className: DM.cx('dm-frame', loading && 'is-loading'), style: { width: dev.w, height: dev.h, transform: 'scale(' + z + ')' } },
              p.src ? h('iframe', { key: p.src + '|' + (p.js || '') + '|' + dev.id + '|' + (p.reloadKey || 0), ref: frameRef, src: p.src, width: dev.w, height: dev.h, title: p.title, onLoad: onLoad }) : null),
            h('div', { className: 'dm-ov', ref: ovRef, style: { width: dev.w * z, height: dev.h * z } }),
            loading ? h('div', { className: 'dm-loading', style: { width: dev.w * z, height: dev.h * z } }, h('span', null, t('loading'))) : null))),
      p.banner || null,
      p.hintless ? null : h('div', { className: 'dm-hint' }, p.mode === 'inspect' ? t('hint.inspect') : t('hint.interact')),
      h('div', { className: 'dm-toolbar' },
        h('div', { className: 'dm-seg' },
          h('button', { type: 'button', className: p.mode === 'inspect' ? 'is-on' : '', title: t('mode.inspect') + ' (I)', onClick: function () { p.onMode('inspect'); } }, h(DM.Icon, { name: 'cursor', size: 14 }), t('mode.inspect')),
          h('button', { type: 'button', className: p.mode === 'interact' ? 'is-on' : '', title: t('mode.interact') + ' (P)', onClick: function () { p.onMode('interact'); } }, h(DM.Icon, { name: 'play', size: 13 }), t('mode.interact'))),
        h('span', { className: 'dm-toolbar__sep' }),
        h('label', { className: 'dm-select', title: t('device') },
          h('select', { value: dev.id, onChange: function (e) { p.onDevice(e.target.value); } }, DM.DEVICES.map(function (d) { return h('option', { key: d.id, value: d.id }, d.name); })),
          h(DM.Icon, { name: 'down', size: 12 })),
        h('span', { className: 'dm-toolbar__sep' }),
        h('button', { type: 'button', className: 'dm-iconbtn', title: '−', onClick: function () { zoomTo(z / 1.25); } }, h(DM.Icon, { name: 'minus', size: 14 })),
        h('span', { className: 'dm-zoom' }, Math.round(z * 100) + '%'),
        h('button', { type: 'button', className: 'dm-iconbtn', title: '+', onClick: function () { zoomTo(z * 1.25); } }, h(DM.Icon, { name: 'plus', size: 14 })),
        h('button', { type: 'button', className: DM.cx('dm-btn', (p.zoom === 'fit' || !p.zoom) && 'is-on'), onClick: function () { zoomTo('fit'); } }, h(DM.Icon, { name: 'fit', size: 14 }), t('zoom.fit')),
        h('span', { className: 'dm-toolbar__sep' }),
        h('button', { type: 'button', className: 'dm-iconbtn', title: t('reload'), onClick: function () { p.onReload && p.onReload(); } }, h(DM.Icon, { name: 'replay', size: 14 }))));
  };
})();
