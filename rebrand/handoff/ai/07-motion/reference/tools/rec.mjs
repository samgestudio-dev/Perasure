// Records curves + frames for motion specs. usage: node rec.mjs [ids...|all] [--port 9334]
import fs from 'node:fs'; import path from 'node:path';
import { launch, newPage, connect } from './cdp.mjs';
import { SPECS } from './specs.mjs';
const REF = path.resolve(new URL('..', import.meta.url).pathname);
const SAMPLER = fs.readFileSync(new URL('./sampler.js', import.meta.url), 'utf8');
const BASE = 'http://localhost:8788';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const args = process.argv.slice(2); const port = 9334;
let ids = args.filter(a => !a.startsWith('--'));
let list = SPECS.filter(s => !ids.length || ids.includes('all') || ids.includes(s.id) || ids.some(i => i.endsWith('*') && s.id.startsWith(i.slice(0, -1))));
for (const d of ['curves', 'frames', 'meta']) fs.mkdirSync(path.join(REF, d), { recursive: true });

async function ev(c, expr, rv = true) {
  const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: rv, userGesture: true });
  if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 300) + ' :: ' + expr.slice(0, 120));
  return r.result.value;
}
async function until(c, expr, timeout = 10000) {
  const t = Date.now();
  while (Date.now() - t < timeout) { try { if (await ev(c, `!!(${expr})`)) return true; } catch {} await sleep(40); }
  throw new Error('timeout waiting for ' + expr.slice(0, 140));
}
async function pt(c, target) {
  if (target.x != null) return target;
  const sel = typeof target === 'string' ? target : target.sel;
  const fx = target.fx ?? 0.5, fy = target.fy ?? 0.5;
  const js = typeof target === 'object' && target.js ? target.js : null;
  const p = await ev(c, `(() => { const el = ${js ? `(${js})()` : `document.querySelector(${JSON.stringify(sel)})`}; if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left + b.width * ${fx}, y: b.top + b.height * ${fy} }; })()`);
  if (!p) throw new Error('no element for tap: ' + (sel || js));
  return p;
}
async function touch(c, type, x, y) { await c.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 }] }); }
async function runSteps(c, steps = [], ctx = {}) {
  for (const s of steps) {
    if (s.js) { const v = await ev(c, s.js); if (s.log) console.log('   js->', JSON.stringify(v)?.slice(0, 200)); }
    else if (s.wait) await sleep(s.wait);
    else if (s.until) await until(c, s.until, s.timeout);
    else if (s.tap) { const p = await pt(c, s.tap); await touch(c, 'touchStart', p.x, p.y); await sleep(s.hold ?? 90); await touch(c, 'touchEnd', p.x, p.y); }
    else if (s.click) { const p = await pt(c, s.click); for (const type of ['mousePressed', 'mouseReleased']) { await c.send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 }); if (type === 'mousePressed') await sleep(s.hold ?? 90); } }
    else if (s.drag) {
      const p = await pt(c, s.drag); const n = s.steps || 12, ms = s.ms || 300;
      await touch(c, 'touchStart', p.x, p.y);
      if (s.holdFirst) await sleep(s.holdFirst);
      for (let i = 1; i <= n; i++) { const k = s.ease === 'lin' || !s.ease ? i / n : 1 - Math.pow(1 - i / n, 2); await sleep(ms / n); await touch(c, 'touchMove', p.x + (s.dx || 0) * k, p.y + (s.dy || 0) * k); }
      if (s.holdEnd) await sleep(s.holdEnd);
      await touch(c, 'touchEnd', p.x + (s.dx || 0), p.y + (s.dy || 0));
    }
    else if (s.mdrag) { // mouse drag
      const p = await pt(c, s.mdrag); const n = s.steps || 12, ms = s.ms || 300;
      await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
      for (let i = 1; i <= n; i++) { await sleep(ms / n); await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x + (s.dx || 0) * i / n, y: p.y + (s.dy || 0) * i / n, button: 'left', buttons: 1 }); }
      await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x + (s.dx || 0), y: p.y + (s.dy || 0), button: 'left', clickCount: 1 });
    }
    else if (s.scrollTo) { // animate scrollTop linearly in the page
      await ev(c, `new Promise(ok => { const el = ${s.scrollTo.startsWith('(') ? s.scrollTo + '()' : `document.querySelector(${JSON.stringify(s.scrollTo)})`}; const a = el.scrollTop, b = ${s.to === 'end' ? 'el.scrollHeight - el.clientHeight' : s.to}, ms = ${s.ms || 600}, t0 = performance.now(); (function f() { const k = Math.min(1, (performance.now() - t0) / ms); el.scrollTop = a + (b - a) * k; if (k < 1) requestAnimationFrame(f); else ok(true); })(); })`);
    }
    else if (s.mark) await ev(c, '__rec.mark()');
    else if (s.key) { for (const ch of s.key) { await c.send('Input.dispatchKeyEvent', { type: 'keyDown', text: ch, key: ch }); await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch }); await sleep(s.gap || 60); } }
    else throw new Error('unknown step ' + JSON.stringify(s));
  }
}

async function recordOne(c, spec) {
  const id = spec.id, t = spec.trigger || {};
  await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: spec.reduced ? 'reduce' : 'no-preference' }] });
  const o = { minMs: spec.minMs || 0, settleMs: spec.settleMs || 300, maxMs: spec.maxMs || 3000, loop: !!spec.loop };
  const frames = []; let scOn = false;
  const offFrame = c.on('Page.screencastFrame', p => { frames.push({ epoch: p.metadata.timestamp * 1000, data: p.data }); c.send('Page.screencastFrameAck', { sessionId: p.sessionId }).catch(() => {}); });
  const startSc = async () => { await c.send('Page.startScreencast', { format: 'png', maxWidth: 360, maxHeight: 800, everyNthFrame: 1 }); scOn = true; };
  let scriptId = null, scriptId2 = null;
  try {
    const url = BASE + spec.url;
    if (spec.preScript) { const r = await c.send('Page.addScriptToEvaluateOnNewDocument', { source: spec.preScript }); scriptId2 = r.identifier; }
    if (t.nav) {
      const r = await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__recAutoArm = ${JSON.stringify({ targets: spec.targets, o: { ...o, startWhen: t.startWhen || null } })};\n` + SAMPLER });
      scriptId = r.identifier;
      await c.send('Page.navigate', { url: 'about:blank' }); await sleep(200);
      await startSc(); await sleep(150);
      await c.send('Page.navigate', { url });
    } else {
      await c.send('Page.navigate', { url }); 
      await until(c, spec.ready || 'document.readyState === "complete"', 15000);
      await sleep(spec.settleBefore ?? 400);
      await ev(c, SAMPLER + ';true');
      await runSteps(c, spec.setup);
      await ev(c, `__rec.arm(${JSON.stringify(spec.targets)}, ${JSON.stringify({ ...o, waitEvent: t.waitEvent || null, startWhen: t.startWhen || null })})`);
      await startSc(); await sleep(250);
      if (t.js) await ev(c, `${t.startWhen ? '' : '__rec.mark();'} ${t.js}; true`);
      if (t.steps) { if (!t.waitEvent && !t.startWhen) await ev(c, '__rec.mark()'); await runSteps(c, t.steps); }
    }
    const tStart = Date.now();
    while (true) {
      await sleep(100);
      let s = null; try { s = await ev(c, 'window.__rec && __rec.state()'); } catch {}
      if (s && s.done) break;
      if (Date.now() - tStart > o.maxMs + 6000) { try { await ev(c, '__rec.stop()'); } catch {} break; }
      if (spec.during) { /* not used */ }
    }
    await sleep(120);
    await c.send('Page.stopScreencast'); scOn = false;
    const res = await ev(c, '__rec.result()');
    if (!res) throw new Error('no sampler result');
    if (res.t0 == null) throw new Error('trigger time never set (no pointerdown?)');
    return { res, frames };
  } finally {
    offFrame(); if (scOn) await c.send('Page.stopScreencast').catch(() => {});
    if (scriptId) await c.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: scriptId }).catch(() => {});
    if (scriptId2) await c.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: scriptId2 }).catch(() => {});
  }
}

function postProcess(spec, res, frames) {
  const id = spec.id;
  // curves: varying vs constant keys
  const keys = new Set(); res.samples.forEach(s => Object.keys(s.v).forEach(k => keys.add(k)));
  const varying = [], constants = {};
  for (const k of keys) {
    const vals = res.samples.map(s => JSON.stringify(s.v[k]));
    if (new Set(vals).size > 1) varying.push(k); else constants[k] = res.samples[0]?.v[k];
  }
  // drop consecutive duplicate samples? keep all (per frame), but only varying keys
  const samples = res.samples.map(s => { const o = { t: s.t }; varying.forEach(k => { o[k] = s.v[k] ?? null; }); return o; });
  const end = res.endT ?? (res.samples.at(-1)?.t || 0);
  // frames: t relative to trigger
  const fdir = path.join(REF, 'frames', id); fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir, { recursive: true });
  const fr = frames.map(f => ({ t: Math.round((f.epoch - res.epoch0) * 10) / 10, data: f.data })).sort((a, b) => a.t - b.t);
  const kept = []; let last = -1e9;
  const pre = fr.filter(f => f.t < 0).at(-1); if (pre) { kept.push(pre); last = pre.t; }
  for (const f of fr) { if (f.t < 0 || f.t > end + 60) continue; if (f.t - last >= 30 || !kept.length) { kept.push(f); last = f.t; } }
  const flist = kept.map((f, i) => { const name = `f${String(i).padStart(3, '0')}_t${f.t < 0 ? 'm' : ''}${String(Math.abs(Math.round(f.t))).padStart(5, '0')}.png`; fs.writeFileSync(path.join(fdir, name), Buffer.from(f.data, 'base64')); return { file: name, t: f.t }; });
  fs.writeFileSync(path.join(fdir, 'frames.json'), JSON.stringify({ motionId: id, note: 'Screencast frames (360x800 CSS px at 1x, PNG). t = ms from the trigger (frame presentation time minus trigger time). Frames are only emitted when the screen changes, so a gap means nothing changed.', frames: flist }, null, 1));
  // ROI from rect keys
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const s of res.samples) for (const k in s.v) { const m = /^(.*)\.x$/.exec(k); if (!m) continue; const x = s.v[k], y = s.v[m[1] + '.y'], w = s.v[m[1] + '.w'], h = s.v[m[1] + '.h']; if (!(w > 0 && h > 0)) continue; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h); }
  let roi = spec.roi || null;
  if (!roi && x1 > x0) { const p = 16; roi = { x: Math.max(0, x0 - p), y: Math.max(0, y0 - p) }; roi.w = Math.min(360, x1 + p) - roi.x; roi.h = Math.min(800, y1 + p) - roi.y; if (roi.w * roi.h > 360 * 800 * 0.45 || roi.w <= 0 || roi.h <= 0) roi = null; }
  if (roi) { roi = { x: Math.round(roi.x), y: Math.round(roi.y), w: Math.round(roi.w), h: Math.round(roi.h) }; }
  const curve = {
    motionId: id, name: spec.name, recordedWith: { url: BASE + spec.url, viewport: '360x800 CSS px, deviceScaleFactor 2, mobile, touch emulation', prefersReducedMotion: spec.reduced ? 'reduce' : 'no-preference', chrome: 'headless Chrome (CDP)', date: new Date().toISOString() },
    trigger: spec.triggerText || (spec.trigger?.js ? 'JS: ' + spec.trigger.js : spec.trigger?.nav ? 'page load (t=0 = navigation start of the document)' : JSON.stringify(spec.trigger?.steps)),
    t0: spec.t0Text || (spec.trigger?.waitEvent ? `t=0 = the ${spec.trigger.waitEvent} event of the tap` : spec.trigger?.startWhen ? `t=0 = first animation frame where: ${spec.trigger.startWhen}` : spec.trigger?.nav ? 't=0 = document timeOrigin (navigation start)' : 't=0 = just before the trigger call'),
    setup: spec.setupText || (spec.setup || []).map(s => JSON.stringify(s)).join(' ; '),
    elementSelectors: spec.targets.map(t => ({ name: t.name, selector: t.sel || t.js || t.expr || (t.lottie ? 'lottie.getRegisteredAnimations()' : t.gsap ? 'gsap.globalTimeline.time()' : ''), frame: t.frame, maxElements: t.max || 1, props: t.props || (t.lottie || t.gsap || t.expr ? undefined : ['op', 'tf', 'blur', 'rect']) })),
    propertyLegend: 'x/y/w/h = getBoundingClientRect (CSS px, includes transforms); tx/ty/sx/sy/rot = computed transform matrix decomposed (px, scale, deg); blur = filter blur px; opacity = computed opacity of the element itself; opacityEffective = product of ancestors; other names are computed CSS values.',
    settledAt: res.settledAt, endT: Math.round(end), settled: res.settledAt != null, changesDetected: res.changes,
    events: res.events.filter(e => e.t != null && e.t > -200),
    constants, samples,
    notes: spec.notes || '',
  };
  fs.writeFileSync(path.join(REF, 'curves', id + '.json'), JSON.stringify(curve));
  const meta = { motionId: id, name: spec.name, ok: res.changes > 0, settledAt: res.settledAt, endT: Math.round(end), frames: flist.length, roi, varying: varying.length, status: spec.status || (res.changes > 0 ? 'full' : 'partial'), notes: spec.notes || '' };
  if (!(res.changes > 0)) meta.notes = (meta.notes ? meta.notes + ' ' : '') + 'No change was detected in the sampled properties.';
  fs.writeFileSync(path.join(REF, 'meta', id + '.json'), JSON.stringify(meta, null, 1));
  return meta;
}

const { proc } = await launch(port);
const c = await newPage(port);
await c.send('Page.enable'); await c.send('Runtime.enable');
await c.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 2, mobile: true });
await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
c.on('Runtime.exceptionThrown', p => { if (process.env.V) console.error('   page exc', p.exceptionDetails.exception?.description?.slice(0, 200)); });
for (const spec of list) {
  const t0 = Date.now();
  try {
    const { res, frames } = await recordOne(c, spec);
    const m = postProcess(spec, res, frames);
    console.log(`${spec.id} ok changes=${res.changes} settled=${res.settledAt} end=${Math.round(res.endT)} frames=${m.frames} varying=${m.varying} (${Date.now() - t0} ms)`);
  } catch (e) {
    console.log(`${spec.id} FAIL ${e.message}`);
    fs.writeFileSync(path.join(REF, 'meta', spec.id + '.json'), JSON.stringify({ motionId: spec.id, name: spec.name, ok: false, status: 'failed', error: e.message, notes: spec.notes || '' }, null, 1));
  }
}
c.close(); proc.kill(); process.exit(0);
