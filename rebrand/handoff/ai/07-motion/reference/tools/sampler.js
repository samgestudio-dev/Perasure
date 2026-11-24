// Injected into the demo page: samples animated properties every animation frame.
(function () {
  if (window.__rec) return;
  var R = {};
  function r(v, d) { var k = Math.pow(10, d == null ? 2 : d); return Math.round(v * k) / k; }
  function dec(tr) {
    if (!tr || tr === 'none') return { tx: 0, ty: 0, sx: 1, sy: 1, rot: 0 };
    var m = /matrix(3d)?\(([^)]+)\)/.exec(tr); if (!m) return { raw: tr };
    var v = m[2].split(',').map(parseFloat), a, b, c, d, e, f;
    if (m[1]) { a = v[0]; b = v[1]; c = v[4]; d = v[5]; e = v[12]; f = v[13]; } else { a = v[0]; b = v[1]; c = v[2]; d = v[3]; e = v[4]; f = v[5]; }
    var sx = Math.hypot(a, b), rot = Math.atan2(b, a) * 180 / Math.PI, sy = sx ? (a * d - b * c) / sx : 0;
    return { tx: r(e), ty: r(f), sx: r(sx, 4), sy: r(sy, 4), rot: r(rot) };
  }
  function blur(f) { var m = /blur\(([\d.]+)px\)/.exec(f || ''); return m ? r(+m[1]) : 0; }
  function opEff(el) { var o = 1; for (var n = el; n && n.nodeType === 1; n = n.parentElement) o *= +getComputedStyle(n).opacity; return r(o, 3); }
  function lotties(win) {
    var L = win.lottie || win.bodymovin; if (!L || !L.getRegisteredAnimations) return null;
    return L.getRegisteredAnimations().map(function (a) { return (a.fileName || a.animationID || '').toString().slice(-24) + ':' + r(a.currentFrame, 1) + (a.isPaused ? 'p' : ''); }).join(' | ');
  }
  function read(el, props, out, pre, win) {
    var cs = win.getComputedStyle(el);
    props.forEach(function (p) {
      if (p === 'op') out[pre + 'opacity'] = r(+cs.opacity, 3);
      else if (p === 'tf') { var t = dec(cs.transform); for (var k in t) out[pre + k] = t[k]; if (cs.translate !== 'none' && cs.translate) out[pre + 'translate'] = cs.translate; if (cs.scale !== 'none' && cs.scale) out[pre + 'scale'] = cs.scale; if (cs.rotate !== 'none' && cs.rotate) out[pre + 'rotate'] = cs.rotate; }
      else if (p === 'blur') { out[pre + 'blur'] = blur(cs.filter); if (cs.filter !== 'none' && !/^blur\([\d.]+px\)$/.test(cs.filter)) out[pre + 'filter'] = cs.filter; }
      else if (p === 'rect') { var b = el.getBoundingClientRect(); out[pre + 'x'] = r(b.left); out[pre + 'y'] = r(b.top); out[pre + 'w'] = r(b.width); out[pre + 'h'] = r(b.height); }
      else if (p === 'bg') out[pre + 'backgroundColor'] = cs.backgroundColor;
      else if (p === 'color') out[pre + 'color'] = cs.color;
      else if (p === 'bc') out[pre + 'borderColor'] = cs.borderTopColor;
      else if (p === 'shadow') out[pre + 'boxShadow'] = cs.boxShadow;
      else if (p === 'radius') { out[pre + 'radiusTL'] = cs.borderTopLeftRadius; out[pre + 'radiusBL'] = cs.borderBottomLeftRadius; }
      else if (p === 'clip') out[pre + 'clipPath'] = cs.clipPath;
      else if (p === 'h') out[pre + 'height'] = r(parseFloat(cs.height));
      else if (p === 'w') out[pre + 'width'] = r(parseFloat(cs.width));
      else if (p === 'ls') out[pre + 'letterSpacing'] = cs.letterSpacing;
      else if (p === 'fs') out[pre + 'fontSize'] = cs.fontSize;
      else if (p === 'pad') out[pre + 'padding'] = cs.padding;
      else if (p === 'scroll') out[pre + 'scrollTop'] = r(el.scrollTop, 1);
      else if (p === 'text') out[pre + 'text'] = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      else if (p === 'opEff') out[pre + 'opacityEffective'] = opEff(el);
      else if (p === 'dfilter') out[pre + 'filter'] = cs.filter;
      else if (p === 'afterOp') out[pre + 'afterOpacity'] = r(+win.getComputedStyle(el, '::after').opacity, 3);
      else if (p === 'afterShadow') out[pre + 'afterBoxShadow'] = win.getComputedStyle(el, '::after').boxShadow;
      else if (p.indexOf('var:') === 0) out[pre + p.slice(4)] = cs.getPropertyValue(p.slice(4)).trim();
      else if (p.indexOf('css:') === 0) out[pre + p.slice(4)] = cs.getPropertyValue(p.slice(4)).trim();
      else if (p.indexOf('attr:') === 0) out[pre + p.slice(5)] = el.getAttribute(p.slice(5));
    });
  }
  function resolve(t) {
    var doc = document, win = window;
    if (t.frame) { var f = document.querySelector(t.frame); if (!f || !f.contentDocument) return { els: [], win: win }; doc = f.contentDocument; win = f.contentWindow; }
    var els;
    if (t.js) { try { els = (0, eval)(t.js)(doc, win) || []; } catch (e) { els = []; } }
    else els = Array.prototype.slice.call(doc.querySelectorAll(t.sel));
    if (els && !Array.isArray(els) && typeof els.length === 'number' && !els.nodeType) els = Array.prototype.slice.call(els);
    if (!Array.isArray(els)) els = els ? [els] : [];
    els = els.filter(function (e) { return e && e.nodeType === 1; });
    return { els: els.slice(0, t.max || 1), win: win };
  }
  var st = null;
  function frame() {
    if (!st || st.done) return;
    var now = performance.now();
    var s = {};
    st.targets.forEach(function (t) { try {
      if (t.lottie) { var v = lotties(window); if (v != null) s[t.name + '.lottie'] = v; return; }
      if (t.gsap) { var w = window; if (t.frame) { var f = document.querySelector(t.frame); w = f && f.contentWindow; } if (w && w.gsap) s[t.name + '.gsapTime'] = r(w.gsap.globalTimeline.time(), 3); return; }
      if (t.expr) { try { s[t.name] = (0, eval)(t.expr); } catch (e) { s[t.name] = null; } return; }
      var res = resolve(t);
      var multi = (t.max || 1) > 1;
      if (multi) s[t.name + '.count'] = res.els.length;
      if (!t._ids) { t._ids = new WeakMap(); t._n = 0; }
      res.els.forEach(function (el, i) { var k = t._ids.get(el); if (!k) { k = ++t._n; t._ids.set(el, k); } read(el, t.props || ['op', 'tf', 'blur', 'rect'], s, t.name + (multi ? (t.byIndex ? '[' + i + ']' : '#' + k) : '') + '.', res.win); });
    } catch (e) { s[t.name + '.error'] = String(e).slice(0, 80); }
    });
    if (st.t0 == null && st.startWhen) { var ok = false; try { ok = !!(0, eval)(st.startWhen); } catch (e) {} if (ok) st.t0 = now; }
    var sig = JSON.stringify(s);
    var t = st.t0 == null ? null : now - st.t0;
    if (st.t0 != null || st.pre) st.samples.push({ t: t == null ? null : r(t, 1), _p: now, v: s });
    if (st.t0 != null) {
      if (sig !== st.lastSig) { st.lastChange = t; st.lastSig = sig; st.changes++; }
      var quiet = t - (st.lastChange == null ? 0 : st.lastChange);
      if ((t >= st.minMs && quiet >= st.settleMs && !st.loop) || t >= st.maxMs) { st.done = true; st.endT = t; st.settledAt = quiet >= st.settleMs ? st.lastChange : null; return; }
    } else st.lastSig = sig;
    requestAnimationFrame(frame);
  }
  function onEv(e) { if (!st) return; st.events.push({ type: e.type, _p: e.timeStamp }); if (st.t0 == null && st.waitEvent && e.type === st.waitEvent) { st.t0 = e.timeStamp; } }
  ['pointerdown', 'pointerup', 'click', 'touchstart', 'touchend', 'pointercancel'].forEach(function (n) { window.addEventListener(n, onEv, true); });
  R.arm = function (targets, o) {
    o = o || {};
    st = { targets: targets, samples: [], events: [], t0: o.t0 != null ? o.t0 : null, waitEvent: o.waitEvent || null, startWhen: o.startWhen || null, minMs: o.minMs || 0, settleMs: o.settleMs || 300, maxMs: o.maxMs || 3000, loop: !!o.loop, pre: true, changes: 0, lastChange: null, lastSig: null, done: false };
    requestAnimationFrame(frame);
    return true;
  };
  R.mark = function () { if (st && st.t0 == null) st.t0 = performance.now(); return st && st.t0; };
  R.state = function () { return st ? { done: st.done, t: st.t0 == null ? null : performance.now() - st.t0, n: st.samples.length } : null; };
  R.stop = function () { if (st && !st.done) { st.done = true; st.endT = performance.now() - st.t0; } };
  R.result = function () {
    if (!st) return null;
    var t0 = st.t0;
    var samples = st.samples.map(function (x) { return { t: t0 == null ? null : r(x._p - t0, 1), v: x.v }; }).filter(function (x) { return x.t != null && x.t >= -50; });
    return { t0: t0, epoch0: performance.timeOrigin + (t0 || 0), samples: samples, events: st.events.map(function (e) { return { type: e.type, t: t0 == null ? null : r(e._p - t0, 1) }; }), endT: st.endT, settledAt: st.settledAt, changes: st.changes };
  };
  window.__rec = R;
  window.__u = {
    text: function (t, root, all) { root = root || document; var out = []; var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT); var n; while ((n = w.nextNode())) { if ((n.textContent || '').trim() === t && !Array.prototype.some.call(n.children, function (c) { return (c.textContent || '').trim() === t; })) { if (!all) return n; out.push(n); } } return all ? out : null; },
    up: function (el, k) { while (el && k-- > 0) el = el.parentElement; return el; },
    wd: function () { var el = document.querySelector('.ps-home-in') || document.querySelector('.app-wd *'); var all = document.querySelectorAll('.ps-frame *, .app-wd *'); for (var i = 0; i < all.length; i++) { var n = all[i], k = Object.keys(n).find(function (x) { return x.indexOf('__reactFiber$') === 0; }); if (!k) continue; var f = n[k]; while (f) { if (f.stateNode && f.stateNode.goPhase) return f.stateNode; if (f.stateNode && f.stateNode.logic && f.stateNode.logic.goPhase) return f.stateNode.logic; f = f.return; } } return null; },
    keys: function () { var all = document.querySelectorAll('div'); for (var i = 0; i < all.length; i++) { var d = all[i]; if (d.children.length === 12 && (d.children[0].textContent || '').trim() === '1' && (d.children[1].textContent || '').trim() === '2') return Array.prototype.slice.call(d.children); } return []; },
    amt: function (root) { root = root || document; var sp = Array.prototype.slice.call(root.querySelectorAll('span')).filter(function (s) { return s.textContent === '\u20b1' && s.parentElement && s.parentElement.children.length === 3; }); return sp.length ? sp[0].parentElement : null; }
  };
  if (window.__recAutoArm) R.arm(window.__recAutoArm.targets, Object.assign({ t0: window.__recAutoArm.o.startWhen ? null : 0 }, window.__recAutoArm.o));
})();
