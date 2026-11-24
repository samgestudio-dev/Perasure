// Builds strips (PNG contact sheets) and videos (MP4) from recorded frames. usage: node post.mjs [ids|all] [--no-video]
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
import { launch, newPage } from './cdp.mjs';
const REF = path.resolve(new URL('..', import.meta.url).pathname);
const COMP = fs.readFileSync(new URL('./comp.html', import.meta.url));
const args = process.argv.slice(2), noVideo = args.includes('--no-video'), ids = args.filter(a => !a.startsWith('--'));
const srv = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/__comp.html') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(COMP); }
  const f = path.join(REF, u); if (!f.startsWith(REF) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': f.endsWith('.png') ? 'image/png' : 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(8799);
const { proc } = await launch(9335);
const c = await newPage(9335);
await c.send('Page.enable'); await c.send('Runtime.enable');
await c.send('Page.navigate', { url: 'http://127.0.0.1:8799/__comp.html' }); await new Promise(r => setTimeout(r, 800));
async function ev(expr) { const r = await c.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; }
fs.mkdirSync(path.join(REF, 'strip'), { recursive: true }); fs.mkdirSync(path.join(REF, 'video'), { recursive: true });
const metas = fs.readdirSync(path.join(REF, 'meta')).map(f => JSON.parse(fs.readFileSync(path.join(REF, 'meta', f)))).filter(m => !ids.length || ids.includes('all') || ids.includes(m.motionId));
for (const m of metas) {
  const fj = path.join(REF, 'frames', m.motionId, 'frames.json');
  if (!fs.existsSync(fj)) { console.log(m.motionId, 'no frames'); continue; }
  const frames = JSON.parse(fs.readFileSync(fj)).frames; if (!frames.length) continue;
  const end = Math.max(100, (m.settledAt != null && m.settledAt > 0 ? m.settledAt + 50 : m.endT) || 100);
  const n = end > 4000 ? 12 : 10, picks = [];
  for (let k = 0; k < n; k++) { const t = end * k / (n - 1); let best = frames[0]; for (const f of frames) if (f.t <= t + 0.5) best = f; picks.push({ url: `/frames/${m.motionId}/${best.file}`, t: Math.max(t, best.t < 0 ? best.t : t) , ft: best.t }); }
  const roi = m.roi || { x: 0, y: 0, w: 360, h: 800 };
  const full = !m.roi;
  const tileW = full ? 160 : Math.round(Math.max(120, Math.min(340, roi.w * (roi.w < 170 ? 2 : 1))));
  const cols = full ? (n > 10 ? 6 : 5) : Math.max(2, Math.min(n > 10 ? 6 : 5, Math.floor(1100 / (tileW + 6))));
  const title = `${m.motionId}  ${m.name}  (t = ms from trigger; frame shown = last frame at or before t)`;
  try {
    const b64 = await ev(`strip(${JSON.stringify({ frames: picks.map(p => ({ url: p.url, t: p.t })), roi, title, cols, tileW })})`);
    fs.writeFileSync(path.join(REF, 'strip', m.motionId + '.png'), Buffer.from(b64, 'base64'));
  } catch (e) { console.log(m.motionId, 'strip fail', e.message.slice(0, 120)); }
  if (!noVideo) {
    try {
      const vf = frames.filter(f => f.t <= end + 300);
      const v = await ev(`video(${JSON.stringify({ frames: vf.map(f => ({ url: `/frames/${m.motionId}/${f.file}`, t: f.t })), title: m.motionId, tail: 400 })})`);
      fs.writeFileSync(path.join(REF, 'video', m.motionId + (v.type.includes('mp4') ? '.mp4' : '.webm')), Buffer.from(v.b64, 'base64'));
    } catch (e) { console.log(m.motionId, 'video fail', e.message.slice(0, 120)); }
  }
  process.stdout.write(m.motionId + ' ');
}
console.log('\ndone');
c.close(); proc.kill(); srv.close(); process.exit(0);
