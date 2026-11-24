// Records production takes with the reference sampler.
// usage: node rec-prod.mjs [ids...|all] [--out DIR] [--base URL] [--port N] [--frames]
//   ids    take ids of specs-prod.mjs (default all); 'M-099*' matches a prefix
//   --out  where curves/<id>.json and meta/<id>.json go (default ./prod-takes)
//   --base the preview server (default http://127.0.0.1:4173)
// Needs Node 22+ and Google Chrome (CHROME=/path/to/chrome to override).
import fs from 'node:fs'; import path from 'node:path';
import { launch, newPage } from './cdp.mjs';
import { SPECS } from './specs-prod.mjs';
import { installMock } from './mock.mjs';

const SAMPLER = fs.readFileSync(new URL('../reference/tools/sampler.js', import.meta.url), 'utf8');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const BASE = opt('--base', 'http://127.0.0.1:4173');
const OUT = path.resolve(opt('--out', 'prod-takes'));
const PORT = +opt('--port', 9335);
const FRAMES = argv.includes('--frames');
const vals = new Set(['--out', '--base', '--port'].map(k => opt(k, null)).filter(Boolean));
const ids = argv.filter(a => !a.startsWith('--') && !vals.has(a));
const list = SPECS.filter(s => !ids.length || ids.includes('all') || ids.includes(s.id) || ids.some(i => i.endsWith('*') && s.id.startsWith(i.slice(0, -1))));
for (const d of ['curves', 'meta'].concat(FRAMES ? ['frames'] : [])) fs.mkdirSync(path.join(OUT, d), { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function ev(c, expr) {
  const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
  if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 300) + ' :: ' + expr.slice(0, 120));
  return r.result.value;
}
async function until(c, expr, timeout = 15000) {
  const t = Date.now();
  while (Date.now() - t < timeout) { try { if (await ev(c, `!!(${expr})`)) return true; } catch {} await sleep(40); }
  throw new Error('timeout waiting for ' + expr.slice(0, 140));
}
async function pt(c, target) {
  if (target.x != null) return target;
  const js = target.js ? `(${target.js})()` : `document.querySelector(${JSON.stringify(target.sel || target)})`;
  const p = await ev(c, `(() => { const el = ${js}; if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  if (!p) throw new Error('no element to tap: ' + (target.js || target.sel || target));
  return p;
}
const touch = (c, type, x, y) => c.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 1, radiusY: 1, force: 1 }] });
async function runSteps(c, steps = []) {
  for (const s of steps) {
    if (s.js) await ev(c, s.js);
    else if (s.wait) await sleep(s.wait);
    else if (s.until) await until(c, s.until, s.timeout);
    else if (s.tap) { const p = await pt(c, s.tap); await touch(c, 'touchStart', p.x, p.y); await sleep(s.hold ?? 90); await touch(c, 'touchEnd', p.x, p.y); }
    else throw new Error('unknown step ' + JSON.stringify(s));
  }
}

async function recordOne(c, spec) {
  const t = spec.trigger || {};
  await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: spec.reduced ? 'reduce' : 'no-preference' }] });
  const o = { minMs: spec.minMs || 0, settleMs: spec.settleMs || 300, maxMs: spec.maxMs || 3000 };
  const frames = [];
  const off = c.on('Page.screencastFrame', p => { if (FRAMES) frames.push({ epoch: p.metadata.timestamp * 1000, data: p.data }); c.send('Page.screencastFrameAck', { sessionId: p.sessionId }).catch(() => {}); });
  let pre = null;
  try {
    if (spec.preScript) pre = (await c.send('Page.addScriptToEvaluateOnNewDocument', { source: spec.preScript })).identifier;
    await c.send('Page.navigate', { url: 'about:blank' }); await sleep(150);
    await c.send('Page.navigate', { url: BASE + spec.url });
    await until(c, spec.ready || 'document.readyState === "complete"');
    await sleep(spec.settleBefore ?? 400);
    await ev(c, SAMPLER + ';true');
    await runSteps(c, spec.setup);
    await ev(c, `__rec.arm(${JSON.stringify(spec.targets)}, ${JSON.stringify({ ...o, waitEvent: t.waitEvent || null })})`);
    // the screencast keeps the compositor producing a frame every vsync (as in the reference takes)
    await c.send('Page.startScreencast', { format: 'png', maxWidth: 360, maxHeight: 800, everyNthFrame: 1 }); await sleep(250);
    if (t.js) await ev(c, `__rec.mark(); ${t.js}; true`);
    if (t.steps) { if (!t.waitEvent) await ev(c, '__rec.mark()'); await runSteps(c, t.steps); }
    const t0 = Date.now();
    for (;;) {
      await sleep(100);
      let s = null; try { s = await ev(c, 'window.__rec && __rec.state()'); } catch {}
      if (s && s.done) break;
      if (Date.now() - t0 > o.maxMs + 6000) { try { await ev(c, '__rec.stop()'); } catch {} break; }
    }
    await sleep(120);
    await c.send('Page.stopScreencast');
    const res = await ev(c, '__rec.result()');
    if (!res || res.t0 == null) throw new Error('trigger time never set');
    return { res, frames };
  } finally {
    off();
    if (pre) await c.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: pre }).catch(() => {});
  }
}

function save(spec, res, frames) {
  const keys = new Set(); res.samples.forEach(s => Object.keys(s.v).forEach(k => keys.add(k)));
  const varying = [], constants = {};
  for (const k of keys) { const v = res.samples.map(s => JSON.stringify(s.v[k])); if (new Set(v).size > 1) varying.push(k); else constants[k] = res.samples[0]?.v[k]; }
  const samples = res.samples.map(s => { const o = { t: s.t }; varying.forEach(k => { o[k] = s.v[k] ?? null; }); return o; });
  const curve = {
    motionId: spec.id, name: spec.name,
    recordedWith: { url: BASE + spec.url, viewport: '360x800 CSS px, deviceScaleFactor 2, mobile, touch emulation', prefersReducedMotion: spec.reduced ? 'reduce' : 'no-preference', chrome: 'headless Chrome (CDP)', date: new Date().toISOString() },
    trigger: t0Text(spec), t0: spec.trigger?.waitEvent ? `t=0 = the ${spec.trigger.waitEvent} event of the tap` : 't=0 = just before the trigger call',
    settledAt: res.settledAt, endT: Math.round(res.endT ?? 0), changesDetected: res.changes,
    events: res.events.filter(e => e.t != null && e.t > -200), constants, samples,
  };
  fs.writeFileSync(path.join(OUT, 'curves', spec.id + '.json'), JSON.stringify(curve));
  if (FRAMES) {
    const dir = path.join(OUT, 'frames', spec.id); fs.mkdirSync(dir, { recursive: true });
    frames.forEach(f => { const t = Math.round(f.epoch - res.epoch0); if (t >= -50 && t <= (res.endT || 0) + 60) fs.writeFileSync(path.join(dir, `t${t < 0 ? 'm' : ''}${String(Math.abs(t)).padStart(5, '0')}.png`), Buffer.from(f.data, 'base64')); });
  }
  const meta = { motionId: spec.id, name: spec.name, ok: res.changes > 0, settledAt: res.settledAt, endT: Math.round(res.endT ?? 0), varying: varying.length };
  fs.writeFileSync(path.join(OUT, 'meta', spec.id + '.json'), JSON.stringify(meta, null, 1));
  return meta;
}
const t0Text = s => s.trigger?.js ? 'JS: ' + s.trigger.js.slice(0, 200) : JSON.stringify(s.trigger?.steps).slice(0, 300);

const { proc, dir } = await launch(PORT);
let failed = 0;
try {
  const c = await newPage(PORT);
  await c.send('Page.enable'); await c.send('Runtime.enable');
  const net = []; const extra = {};
  await installMock(c, net, extra);
  await c.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 2, mobile: true });
  await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  for (const spec of list) {
    const t = Date.now();
    for (const k of Object.keys(extra)) delete extra[k];
    Object.assign(extra, spec.mocks || {});
    try {
      const { res, frames } = await recordOne(c, spec);
      const m = save(spec, res, frames);
      console.log(`${spec.id} ok changes=${res.changes} settled=${res.settledAt} end=${m.endT} varying=${m.varying} (${Date.now() - t} ms)`);
    } catch (e) { failed++; console.log(`${spec.id} FAIL ${e.message}`); }
  }
  c.close();
} finally { proc.kill(); await sleep(500); try { fs.rmSync(dir, { recursive: true, force: true }); } catch {} }
console.log(`curves in ${path.join(OUT, 'curves')}`);
process.exit(failed ? 1 : 0);
