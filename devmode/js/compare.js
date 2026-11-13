/* PeraSure Dev Mode — compare two versions: side by side (what is done in one frame is done in the other) or overlaid (the newer one's
   opacity on a slider); both replayed together, at 1× / 0.5× / 0.25×; the changes recorded between them, and for a component its
   properties and code, before → after. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, I = DM.inspect, t = function (k, v) { return DM.t(k, v); };

  /* ---- slow motion: a clock for the compared frames (shared/ps-ui/core.js calls DM_CLOCK before anything moves) ---- */
  window.DM_SPEED = 1;
  window.DM_CLOCK = function (win) {
    var fe = win.frameElement; if (!fe || !fe.hasAttribute('data-dm-clock') || win.__dmClock) return;
    win.__dmClock = true;
    var perf = win.performance, realNow = perf.now.bind(perf), last = realNow(), virt = last;
    function now() { var r = realNow(); virt += (r - last) * (window.DM_SPEED || 1); last = r; return virt; }
    perf.now = now;
    var raf = win.requestAnimationFrame.bind(win), st = win.setTimeout.bind(win), si = win.setInterval.bind(win);
    win.requestAnimationFrame = function (cb) { return raf(function () { cb(now()); }); };
    win.setTimeout = function (fn, d) { var a = Array.prototype.slice.call(arguments, 2); return st.apply(win, [fn, (d || 0) / (window.DM_SPEED || 1)].concat(a)); };
    win.setInterval = function (fn, d) { var a = Array.prototype.slice.call(arguments, 2); return si.apply(win, [fn, (d || 0) / (window.DM_SPEED || 1)].concat(a)); };
    /* CSS transitions and animations follow the same speed */
    (function rate() {
      try { var sp = window.DM_SPEED || 1; win.document.getAnimations().forEach(function (a) { if (a.playbackRate !== sp) a.playbackRate = sp; }); } catch (e) {}
      raf(rate);
    })();
  };

  /* ---- doing in one frame what is done in the other: taps (at the same point), scrolling, typing ---- */
  function pathOf(el) { var p = []; for (var e = el; e && e.parentElement; e = e.parentElement) p.unshift(Array.prototype.indexOf.call(e.parentElement.children, e)); return p; }
  function byPath(doc, p) { var e = doc.documentElement; for (var i = 0; e && i < p.length; i++) e = e.children[p[i]]; return e || null; }
  function link(winA, winB, on) {
    var busy = false;
    function mirror(src, dst) {
      var hs = [];
      function add(t, f) { src.addEventListener(t, f, true); hs.push([t, f]); }
      function point(e) {
        if (busy || !on()) return;
        var el = dst.document.elementFromPoint(e.clientX, e.clientY); if (!el) return;
        busy = true;
        try {
          var Ctor = e.type.indexOf('pointer') === 0 ? dst.PointerEvent : dst.MouseEvent;
          el.dispatchEvent(new Ctor(e.type, { bubbles: true, cancelable: true, composed: true, clientX: e.clientX, clientY: e.clientY, button: e.button, buttons: e.buttons, pointerId: e.pointerId || 1, pointerType: e.pointerType || 'mouse', isPrimary: true, view: dst }));
        } catch (x) {}
        busy = false;
      }
      ['pointerdown', 'pointerup', 'click'].forEach(function (tp) { add(tp, point); });
      add('pointermove', function (e) { if (e.buttons) point(e); });
      add('scroll', function (e) {
        if (busy || !on()) return;
        var s = e.target, d = s === src.document ? dst.document.scrollingElement : byPath(dst.document, pathOf(s));
        var from = s === src.document ? src.document.scrollingElement : s;
        if (!d || !from) return;
        busy = true; d.scrollTop = from.scrollTop; d.scrollLeft = from.scrollLeft; busy = false;
      });
      add('input', function (e) {
        if (busy || !on()) return;
        var s = e.target, d = byPath(dst.document, pathOf(s)); if (!d || d.tagName !== s.tagName) return;
        busy = true;
        try { var proto = d.tagName === 'TEXTAREA' ? dst.HTMLTextAreaElement.prototype : dst.HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(d, s.value); d.dispatchEvent(new dst.Event('input', { bubbles: true })); } catch (x) {}
        busy = false;
      });
      return function () { hs.forEach(function (x) { src.removeEventListener(x[0], x[1], true); }); };
    }
    var u1 = mirror(winA, winB), u2 = mirror(winB, winA);
    return function () { u1(); u2(); };
  }

  /* ---- a frame of one version ---- */
  function Frame(p) {
    var ref = R.useRef(null);
    function load() {
      var win = ref.current && ref.current.contentWindow, n = 0; if (!win) return;
      (function wait() {
        if (!ref.current || ref.current.contentWindow !== win) return;
        var ok = false; try { ok = I.ready(win) && (p.app === false || !!(win.APP && win.APP.S)); } catch (e) {}
        if (!ok) { if (++n < 300) setTimeout(wait, 50); return; }
        var needWd = p.js && /APP\.borrow/.test(p.js), m = 0;
        (function run() {
          var wd = false; try { var sh = win.APP.wd && win.APP.wd.sheet(); wd = !!(sh && sh.ready && sh.ready()); } catch (e) {}
          if (needWd && !wd && ++m < 120) { setTimeout(run, 50); return; }
          if (p.js) { try { win.eval(p.js); } catch (e) { console.warn('[devmode] page script failed', e); } }
          p.onReady(win);
        })();
      })();
    }
    return h('div', { className: 'dm-frame', style: Object.assign({ width: p.w, height: p.h, transform: 'scale(' + p.z + ')' }, p.style) },
      h('iframe', { ref: ref, key: p.src + '|' + p.run, src: p.src, width: p.w, height: p.h, 'data-dm-clock': '', title: p.label, onLoad: load }));
  }

  /* ---- before → after ---- */
  function diffLines(a, b) {
    var A = a.split('\n'), B = b.split('\n'), n = A.length, m = B.length;
    if (n * m > 400000) return A.map(function (x) { return { k: 'del', t: x }; }).concat(B.map(function (x) { return { k: 'add', t: x }; }));
    var L = []; for (var i = 0; i <= n; i++) { L.push(new Uint16Array(m + 1)); }
    for (i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var out = []; i = 0; j = 0;
    while (i < n && j < m) { if (A[i] === B[j]) { out.push({ k: 'same', t: A[i] }); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) out.push({ k: 'del', t: A[i++] }); else out.push({ k: 'add', t: B[j++] }); }
    while (i < n) out.push({ k: 'del', t: A[i++] }); while (j < m) out.push({ k: 'add', t: B[j++] });
    /* long unchanged stretches fold to their ends */
    var res = [], run = [];
    function flush() { if (run.length > 6) { res.push(run[0], run[1], { k: 'gap', t: '⋯ ' + (run.length - 4) }, run[run.length - 2], run[run.length - 1]); } else res.push.apply(res, run); run = []; }
    out.forEach(function (r) { if (r.k === 'same') run.push(r); else { flush(); res.push(r); } }); flush();
    return res;
  }
  function Diff(p) {
    if (p.loading) return h('div', { className: 'dm-note' }, t('loading'));
    if (p.a === p.b) return h('div', { className: 'dm-note' }, t('cmp.same'));
    return h('div', { className: 'dm-diff' }, diffLines(p.a || '', p.b || '').map(function (r, i) {
      return h('div', { key: i, className: r.k === 'same' ? '' : 'is-' + r.k }, (r.k === 'add' ? '+ ' : r.k === 'del' ? '− ' : r.k === 'gap' ? '' : '  ') + r.t);
    }));
  }
  function cssText(c) { return c ? (c.css || []).map(function (r) { return r.sel + ' {\n  ' + r.body.split(/;\s*\n?\s*/).filter(Boolean).join(';\n  ') + ';\n}'; }).join('\n') : ''; }
  function CompDiff(p) {
    var s = R.useState(null), d = s[0];
    R.useEffect(function () {
      var on = true; s[1](null);
      Promise.all([DM.index(p.a), DM.index(p.b)]).then(function (ix) {
        var ca = ix[0] && ix[0].components[p.name], cb = ix[1] && ix[1].components[p.name];
        var src = function (v, c) { return c ? DM.text(DM.root(v) + c.file).then(function (tx) { return DM.lines(tx, c.line, c.end); }, function () { return ''; }) : Promise.resolve(''); };
        return Promise.all([src(p.a, ca), src(p.b, cb)]).then(function (code) { if (on) s[1]({ ca: ca, cb: cb, codeA: code[0], codeB: code[1] }); });
      });
      return function () { on = false; };
    }, [p.name, p.a, p.b]);
    if (!d) return h('div', { className: 'dm-note' }, t('loading'));
    var rows = [
      ['file', d.ca ? d.ca.file + ':' + d.ca.line : '—', d.cb ? d.cb.file + ':' + d.cb.line : '—'],
      ['props', d.ca && d.ca.galleryProps || '—', d.cb && d.cb.galleryProps || '—'],
      ['tokens', d.ca ? d.ca.tokens.join(' ') : '—', d.cb ? d.cb.tokens.join(' ') : '—'],
      ['motion', d.ca ? d.ca.motion.join(' ') || '—' : '—', d.cb ? d.cb.motion.join(' ') || '—' : '—'],
      ['icons', d.ca ? d.ca.icons.concat(d.ca.art).join(' ') || '—' : '—', d.cb ? d.cb.icons.concat(d.cb.art).join(' ') || '—' : '—'],
      ['figma', d.ca ? d.ca.figma.map(function (f) { return f.id; }).join(' ') || '—' : '—', d.cb ? d.cb.figma.map(function (f) { return f.id; }).join(' ') || '—' : '—'],
      ['states', d.ca ? (d.ca.states || []).join(' · ') || '—' : '—', d.cb ? (d.cb.states || []).join(' · ') || '—' : '—']];
    if (p.winA && p.winB && d.cb && d.cb.motion.length) {
      var ma = I.motion(p.winA, d.cb.motion), mb = I.motion(p.winB, d.cb.motion);
      ma.forEach(function (m, i) { rows.push(['MT.' + m.name, m.value, mb[i].value]); });
    }
    return h(R.Fragment, null,
      h('div', { className: 'dm-spec__group' }, t('cmp.props')),
      h('div', { className: 'dm-pdiff' }, h('div', { className: 'is-head' }), h('div', { className: 'is-head' }, t('cmp.before')), h('div', { className: 'is-head' }, t('cmp.after')),
        rows.map(function (r) { var ch = r[1] !== r[2]; return h(R.Fragment, { key: r[0] }, h('div', { className: 'dm-mono' }, r[0]), h('div', { className: ch ? 'is-changed' : '' }, r[1]), h('div', { className: ch ? 'is-changed' : '' }, r[2])); })),
      h('div', { className: 'dm-spec__group dm-gap' }, t('cmp.code') + ' · CSS'), h(Diff, { a: cssText(d.ca), b: cssText(d.cb) }),
      h('div', { className: 'dm-spec__group dm-gap' }, t('cmp.code') + ' · ' + (d.cb || d.ca ? (d.cb || d.ca).file.split('/').pop() : '')), h(Diff, { a: d.codeA, b: d.codeB }));
  }

  /* p: a, b (iteration ids, older → newer), page, state, comp, onChange(a, b), onClose */
  DM.Compare = function Compare(p) {
    var its = DM.iterations(), ids = its.map(function (x) { return x.id; });
    var A = DM.iteration(p.a) || its[Math.min(1, its.length - 1)], B = DM.iteration(p.b) || its[0];
    var ms = R.useState('side'), mode = ms[0];
    var ss = R.useState(true), sync = ss[0];
    var sp = R.useState(1), speed = sp[0];
    var op = R.useState(50), opacity = op[0];
    var rn = R.useState(0), run = rn[0];
    var pk = R.useState(null), pick = pk[0];
    var wins = R.useRef({ a: null, b: null }), syncRef = R.useRef(sync); syncRef.current = sync;
    var modeRef = R.useRef(mode); modeRef.current = mode;
    var ws = R.useState(0), bump = ws[1];
    var stageRef = R.useRef(null), zs = R.useState(0.7), z = zs[0];
    var dev = DM.device(R.useMemo(function () { try { return localStorage.getItem('perasure.devmode.device') || '360'; } catch (e) { return '360'; } }, []));
    R.useEffect(function () { window.DM_SPEED = speed; }, [speed]);
    R.useEffect(function () { return function () { window.DM_SPEED = 1; }; }, []);
    R.useLayoutEffect(function () {
      var el = stageRef.current; if (!el) return;
      function fit() { var cols = mode === 'side' ? 2 : 1; zs[1](Math.max(0.3, Math.min(1, Math.min((el.clientWidth - 80 - 40 * (cols - 1)) / (dev.w * cols), (el.clientHeight - 110) / dev.h)))); }
      fit(); var ro = new ResizeObserver(fit); ro.observe(el); return function () { ro.disconnect(); };
    }, [mode]);
    R.useEffect(function () { var f = function (e) { if (e.key === 'Escape') p.onClose(); }; window.addEventListener('keydown', f); return function () { window.removeEventListener('keydown', f); }; }, []);
    /* link the two frames once both are ready */
    function ready(which, win) {
      wins.current[which] = win; bump(function (x) { return x + 1; });
      var W = wins.current;
      if (W.a && W.b) { if (W.unlink) W.unlink(); W.unlink = link(W.a, W.b, function () { return syncRef.current && modeRef.current === 'side'; }); }
    }
    R.useEffect(function () { return function () { if (wins.current.unlink) wins.current.unlink(); }; }, []);

    var src = function (ver) {
      if (p.comp) return p.comp.gallery ? DM.root(ver) + 'shared/stage.html?entry=' + encodeURIComponent(p.comp.gallery) + '&state=0' : null;
      return window.DM_PAGES.url(p.page, p.state, DM.root(ver));
    };
    var js = p.comp ? null : window.DM_PAGES.js(p.page, p.state) || null, app = !p.comp;
    var ia = ids.indexOf(A.id), ib = ids.indexOf(B.id), lo = Math.max(ia, ib), hi = Math.min(ia, ib);
    var between = its.slice(hi, lo).filter(function (x) { return !x.baseline; });
    var label = function (it) { return it.label + ' · ' + it.date; };
    function verSelect(val, onCh) {
      return h('label', { className: 'dm-select' }, h('select', { value: val, onChange: function (e) { onCh(e.target.value); } }, its.map(function (it) { return h('option', { key: it.id, value: it.id }, label(it)); })), h(DM.Icon, { name: 'down', size: 12 }));
    }
    function frame(which, it, style) {
      return h(Frame, { key: which + it.id, src: src(it.id), js: js, app: app, w: dev.w, h: dev.h, z: 1, run: run, label: it.label, style: style, onReady: function (w) { ready(which, w); } });
    }
    var boxStyle = { width: dev.w * z, height: dev.h * z };
    var inner = function (which, it, extra) { return h('div', { className: 'dm-cmp__frame', style: boxStyle }, h('div', { style: { transform: 'scale(' + z + ')', transformOrigin: '0 0', width: dev.w, height: dev.h, position: 'relative' } }, frame(which, it, extra))); };
    var stage = src(B.id) ? (mode === 'side'
      ? h('div', { className: 'dm-cmp' },
          h('div', { className: 'dm-cmp__col' }, h('div', { className: 'dm-cmp__label' }, h('span', { className: 'dm-chip is-remove' }, t('cmp.before')), h('b', null, A.label), A.date), inner('a', A)),
          h('div', { className: 'dm-cmp__col' }, h('div', { className: 'dm-cmp__label' }, h('span', { className: 'dm-chip is-add' }, t('cmp.after')), h('b', null, B.label), B.date), inner('b', B)))
      : h('div', { className: 'dm-cmp' }, h('div', { className: 'dm-cmp__col' },
          h('div', { className: 'dm-cmp__label' }, h('b', null, A.label), '→', h('b', null, B.label)),
          h('div', { className: 'dm-cmp__frame', style: boxStyle }, h('div', { style: { transform: 'scale(' + z + ')', transformOrigin: '0 0', width: dev.w, height: dev.h, position: 'relative' } },
            frame('a', A), frame('b', B, { position: 'absolute', left: 0, top: 0, opacity: opacity / 100, pointerEvents: opacity > 50 ? 'auto' : 'none' }))))))
      : h(DM.Empty, { icon: 'component' }, t('stage.empty'));

    var changed = {};
    between.forEach(function (it) { (it.changes || []).forEach(function (c) { (c.components || []).forEach(function (n) { changed[n] = 1; }); }); });
    var title = p.comp ? 'PS.' + p.comp.name : DM.pageName(p.page);

    return h('div', { className: 'dm-modal', role: 'dialog', 'aria-label': t('compareTitle') },
      h('div', { className: 'dm-modal__top' },
        h('h3', null, t('compareTitle')), h('span', { className: 'dm-cmp__what' }, title),
        verSelect(A.id, function (v) { p.onChange(v, B.id); }), h(DM.Icon, { name: 'chevron', size: 12 }), verSelect(B.id, function (v) { p.onChange(A.id, v); }),
        h('span', { className: 'dm-toolbar__sep' }),
        h('div', { className: 'dm-seg' },
          h('button', { type: 'button', className: mode === 'side' ? 'is-on' : '', onClick: function () { ms[1]('side'); } }, h(DM.Icon, { name: 'compare', size: 14 }), t('cmp.side')),
          h('button', { type: 'button', className: mode === 'overlay' ? 'is-on' : '', onClick: function () { ms[1]('overlay'); } }, h(DM.Icon, { name: 'layers', size: 14 }), t('cmp.overlay'))),
        mode === 'side' ? h('button', { type: 'button', className: DM.cx('dm-btn', sync && 'is-on'), onClick: function () { ss[1](!sync); }, title: t('cmp.syncTip') }, h(DM.Icon, { name: 'sync', size: 14 }), t('cmp.sync'))
          : h('label', { className: 'dm-range' }, t('cmp.opacity'), h('input', { type: 'range', min: 0, max: 100, value: opacity, onChange: function (e) { op[1](+e.target.value); } }), h('span', { className: 'dm-mono' }, opacity + '%')),
        h('span', { className: 'dm-toolbar__sep' }),
        h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { wins.current = { a: null, b: null }; rn[1](run + 1); } }, h(DM.Icon, { name: 'replay', size: 14 }), t('cmp.replay')),
        h('span', { className: 'dm-cmp__speedlabel' }, t('cmp.speed')),
        h('div', { className: 'dm-seg' }, [1, 0.5, 0.25].map(function (v) { return h('button', { key: v, type: 'button', className: speed === v ? 'is-on' : '', onClick: function () { sp[1](v); } }, v + '×'); })),
        h('span', { style: { flex: 1 } }),
        h('button', { type: 'button', className: 'dm-iconbtn', title: t('cmp.close') + ' (Esc)', onClick: p.onClose }, h(DM.Icon, { name: 'close', size: 16 }))),
      h('div', { className: 'dm-modal__body' },
        h('div', { className: 'dm-modal__stage', ref: stageRef }, stage),
        h('aside', { className: 'dm-modal__side' },
          h('div', { className: 'dm-paneltitle' }, h('span', null, t('cmp.changes')), h('small', null, A.label + ' → ' + B.label)),
          h('div', { className: 'dm-scroll' },
            A.id === B.id ? h('div', { className: 'dm-sec__body is-top' }, h('div', { className: 'dm-note' }, t('cmp.sameVersion')))
            : !between.length ? h('div', { className: 'dm-sec__body is-top' }, h('div', { className: 'dm-note' }, t('cmp.noChanges')))
            : h('div', { className: 'dm-sec__body is-top' }, between.map(function (it) {
                return h('div', { key: it.id, className: 'dm-cmpit' },
                  h('div', { className: 'dm-hist__top' }, h('span', { className: 'dm-hist__label' }, it.label), h('span', { className: 'dm-hist__date' }, it.date),
                    it.jira ? h('a', { className: 'dm-chip is-link', href: DM.jiraUrl(it.jira), target: '_blank', rel: 'noopener' }, h(DM.Icon, { name: 'jira', size: 12 }), it.jira.key) : h('span', { className: 'dm-chip' }, t('noJira'))),
                  (it.changes || []).map(function (c, j) {
                    return h('div', { key: j, className: 'dm-cmpchange' },
                      h('div', { className: 'dm-hist__change' }, h('span', { className: 'dm-chip is-' + c.type }, t('type.' + c.type)), h('span', { className: 'dm-chip is-' + c.action }, t('a.' + c.action)), h('b', null, DM.tx(c.title))),
                      c.detail ? h('div', { className: 'dm-change__detail' }, DM.tx(c.detail)) : null,
                      (c.components || []).length ? h('div', { className: 'dm-change__targets' }, c.components.map(function (n) {
                        return h('button', { key: n, type: 'button', className: DM.cx('dm-chip is-link is-comp', pick === n && 'is-on'), onClick: function () { pk[1](pick === n ? null : n); } }, h(DM.Icon, { name: 'instance', size: 11 }), n);
                      })) : null);
                  }));
              })),
            between.length && A.id !== B.id ? h('div', { className: 'dm-sec__body' },
              pick ? h(CompDiff, { name: pick, a: ids.indexOf(A.id) > ids.indexOf(B.id) ? A.id : B.id, b: ids.indexOf(A.id) > ids.indexOf(B.id) ? B.id : A.id, winA: wins.current.a, winB: wins.current.b })
                : h('div', { className: 'dm-note' }, t('cmp.pick'))) : null))));
  };
})();
