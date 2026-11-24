// Minimal CDP helper: launch headless Chrome, open a page, talk to it (Node 22+: global WebSocket / fetch).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = process.env.CHROME || {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
  win32: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
}[process.platform];

export async function launch(port = 9335) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ps-motion-chrome-'));
  const p = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + dir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--hide-scrollbars', '--mute-audio',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    '--autoplay-policy=no-user-gesture-required', '--force-color-profile=srgb', '--window-size=360,800', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); if (r.ok) break; } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  return { proc: p, port, dir };
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
      send: (method, params = {}) => new Promise((ok, ko) => { const i = ++id; pend.set(i, [ok, ko]); ws.send(JSON.stringify({ id: i, method, params })); }),
      on: (m, f) => { if (!lis.has(m)) lis.set(m, []); lis.get(m).push(f); return () => lis.set(m, lis.get(m).filter(x => x !== f)); },
      close: () => ws.close(),
    });
  });
}
