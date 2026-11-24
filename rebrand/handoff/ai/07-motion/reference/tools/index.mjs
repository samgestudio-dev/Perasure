// Builds reference/index.json from inventory + recorded metas.
import fs from 'node:fs'; import path from 'node:path';
import { SPECS } from './specs.mjs';
const REF = path.resolve(new URL('..', import.meta.url).pathname);
const inv = JSON.parse(fs.readFileSync(new URL(process.env.INVENTORY || '../../inventory/motions.json', import.meta.url))).motions;
const metas = {}; for (const f of fs.readdirSync(path.join(REF, 'meta'))) { const m = JSON.parse(fs.readFileSync(path.join(REF, 'meta', f))); metas[m.motionId] = m; }
const SYNTH = {
  'M-020_hide': '.is-covered added by script', 'M-084': 'coupon count changed through APP.set', 'M-097': 'available() overridden to false on the demo instance',
  'M-119': 'window.__wdIntroExit replaced to force the fallback', 'M-044': 'file picker stubbed (no file dialog in headless)', 'M-045': 'file picker stubbed (no file dialog in headless)',
  'M-117': 'skip tap instead of the natural 3 s hold', 'M-118': 'skip tap instead of the natural 3 s hold', 'M-117_app': 'skip tap instead of the natural 3 s hold', 'M-118_app': 'skip tap instead of the natural 3 s hold', 'M-128': 'APP.run called with a fixed 900 ms wait',
};
const PARTIAL = {
  'M-132': 'Long chain with random waits (send / verify latency); compare the order of steps and each step against its own reference (M-091..M-094, M-087..M-090, M-008).',
  'M-127': 'Contains one sample of the random load latency; compare the cover exit and the rise against M-012, not the wait.',
  'M-020': 'Contains a random load wait before the row shows; the CSS transition itself is 0.2 s ease (see M-020_hide for the clean take).',
  'M-099': 'Finding: in this build the key-by-key cascade did not run on first open (standalone demo and app host alike): the keys are at opacity 1 / no transform from their first frame (the loan screen enters inside AnimatePresence initial={false}); only the sheet slide is recorded. The by-rows reveal (M-100) does run. Check on a device before treating "no cascade" as the reference.',
  'M-133': 'Sheet slide recorded; the first-open key cascade did not run (see M-099).',
};
const file = (dir, id, ext) => fs.existsSync(path.join(REF, dir, id + ext)) ? `${dir}/${id}${ext}` : null;
function entry(id) {
  const m = metas[id], spec = SPECS.find(s => s.id === id) || {};
  if (!m) return { motionId: id, recorded: false, status: 'not recorded', notes: 'no take' };
  const ok = m.ok && m.status !== 'failed';
  const loop = !!spec.loop;
  const dur = !ok ? null : m.settledAt != null && m.settledAt > 0 ? Math.round(m.settledAt) : Math.round(m.endT || 0);
  let status = !ok ? (m.status === 'failed' ? 'failed' : 'no motion detected') : (m.status === 'partial' ? 'partial' : 'full');
  if (ok && PARTIAL[id]) status = 'partial';
  const notes = [m.notes || spec.notes || '', loop ? `Loop: recorded window ${Math.round(m.endT)} ms (never settles).` : (m.settledAt == null && ok ? `Did not settle within ${Math.round(m.endT)} ms.` : ''),
    SYNTH[id] ? `Synthetic trigger: ${SYNTH[id]}.` : '', PARTIAL[id] || '', m.error ? 'Error: ' + m.error : ''].filter(Boolean).join(' ');
  return { motionId: id, name: m.name || spec.name, recorded: ok, status, curves: ok ? file('curves', id, '.json') : null, strip: ok ? file('strip', id, '.png') : null,
    video: ok ? (file('video', id, '.mp4') || file('video', id, '.webm')) : null, frames: ok ? `frames/${id}/` : null, durationMs: dur, settled: ok ? m.settledAt != null : null, loop,
    trigger: spec.triggerText || (spec.trigger?.js ? 'JS: ' + spec.trigger.js : spec.trigger?.nav ? 'page load' : spec.trigger?.steps ? 'input: ' + spec.trigger.steps.map(s => Object.keys(s)[0]).join(' + ') : (spec.trigger?.startWhen ? 'timer / state (startWhen)' : '')),
    t0: spec.trigger?.waitEvent ? `${spec.trigger.waitEvent} of the tap` : spec.trigger?.startWhen ? `first frame where ${spec.trigger.startWhen}` : spec.trigger?.nav ? 'navigation start' : 'trigger call',
    url: spec.url, syntheticTrigger: !!SYNTH[id], notes };
}
const out = inv.map(mv => {
  const ids = Object.keys(metas).filter(k => k === mv.id || k.startsWith(mv.id + '_')).sort();
  const main = ids.includes(mv.id) ? entry(mv.id) : { motionId: mv.id, recorded: false, status: 'not recorded', notes: '' };
  const variants = ids.filter(k => k !== mv.id).map(entry);
  const e = Object.assign({ motionId: mv.id, name: mv.name, area: mv.area, demoComponent: mv.demoComponent }, main, { name: mv.name, takeName: main.name });
  if (!e.recorded && variants.some(v => v.recorded)) e.status = 'partial (variants only)';
  if (variants.length) e.variants = variants;
  return e;
});
fs.writeFileSync(path.join(REF, 'index.json'), JSON.stringify(out, null, 1));
const cnt = {}; out.forEach(e => { cnt[e.status] = (cnt[e.status] || 0) + 1; });
console.log(JSON.stringify(cnt), 'variants:', out.reduce((a, e) => a + (e.variants ? e.variants.length : 0), 0));
out.filter(e => e.status !== 'full').forEach(e => console.log(' ', e.motionId, e.status, (e.notes || '').slice(0, 140)));
