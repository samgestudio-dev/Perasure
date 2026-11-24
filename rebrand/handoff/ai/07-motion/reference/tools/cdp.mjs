// Minimal CDP helper: launch headless Chrome, connect to a page.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export async function launch(port = 9333) {
  const dir = new URL('./chrome-profile-' + port, import.meta.url).pathname;
  fs.mkdirSync(dir, { recursive: true });
  const p = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    '--autoplay-policy=no-user-gesture-required', '--force-color-profile=srgb', '--window-size=360,800', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  return { proc: p, port };
}
export async function connectPage(port) {
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  let t = list.find(x => x.type === 'page');
  if (!t) t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  return connect(t.webSocketDebuggerUrl);
}
export async function newPage(port) {
  const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  return connect(t.webSocketDebuggerUrl);
}
export function connect(url) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(url); let id = 0; const pend = new Map(); const lis = new Map();
    ws.onmessage = ev => {
      const m = JSON.parse(ev.data);
      if (m.id && pend.has(m.id)) { const [ok, ko] = pend.get(m.id); pend.delete(m.id); m.error ? ko(new Error(m.error.message + ' ' + (m.error.data || ''))) : ok(m.result); }
      else if (m.method) (lis.get(m.method) || []).forEach(f => f(m.params));
    };
    ws.onerror = e => rej(e);
    ws.onopen = () => res({
      ws,
      send: (method, params = {}) => new Promise((ok, ko) => { const i = ++id; pend.set(i, [ok, ko]); ws.send(JSON.stringify({ id: i, method, params })); }),
      on: (m, f) => { if (!lis.has(m)) lis.set(m, []); lis.get(m).push(f); return () => lis.set(m, lis.get(m).filter(x => x !== f)); },
      close: () => ws.close(),
    });
  });
}
