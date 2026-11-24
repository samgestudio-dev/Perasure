#!/usr/bin/env python3
"""Local dev server for the PeraSure prototypes — open it on a phone on the same Wi-Fi and it reloads by itself when a file changes.

    python3 tools/dev-server.py            # then open the printed address on the phone (same Wi-Fi as this computer)
    python3 tools/dev-server.py --port 9000

By cable (no Wi-Fi needed):
  Android — USB debugging on, then `adb reverse tcp:8788 tcp:8788` on the computer; the phone opens http://localhost:8788/perasure/playground/
            (or Chrome on the computer → chrome://inspect → Port forwarding 8788 → localhost:8788).
  iPhone  — plug it in and turn on Personal Hotspot; the computer joins it over the cable and the list below shows a 172.20.10.x
            address: open that on the iPhone.

Serves the repo at /perasure/playground/ (the same paths as samge.studio/perasure/playground/…): the picker is http://<this computer>:8788/perasure/playground/,
the app http://<this computer>:8788/perasure/playground/prototypes/app/.
Every HTML page gets a small script that checks once a second whether any file changed and reloads the page when one did.
No caching, no build step, Python's standard library only. Stop it with Ctrl+C.
"""
import argparse, http.server, os, socket, socketserver, threading, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PREFIX = '/perasure/playground'
SKIP = {'.git', 'node_modules', '__pycache__'}
RELOAD = b"""<script>(function(){var v=null;setInterval(function(){fetch('/__version',{cache:'no-store'}).then(function(r){return r.text()}).then(function(t){if(v===null)v=t;else if(t!==v)location.reload()}).catch(function(){})},1000)})();</script>"""

state = {'v': '0'}

def watch():
    last = None
    while True:
        newest = 0
        for d, dirs, files in os.walk(ROOT):
            dirs[:] = [x for x in dirs if x not in SKIP]
            for f in files:
                try: newest = max(newest, os.stat(os.path.join(d, f)).st_mtime)
                except OSError: pass
        if newest != last:
            last = newest; state['v'] = repr(newest)
        time.sleep(0.7)

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def translate(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        if path == PREFIX or path == '/': return None
        if path.startswith(PREFIX + '/'): path = path[len(PREFIX):]
        return path
    def do_GET(self):
        if self.path.startswith('/__version'):
            b = state['v'].encode(); self.send_response(200); self.send_header('Content-Type', 'text/plain'); self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b); return
        p = self.translate()
        if p is None:
            self.send_response(302); self.send_header('Location', PREFIX + '/'); self.end_headers(); return
        q = self.path[len(self.path.split('?', 1)[0]):]
        self.path = p + q
        fs = self.translate_path(p)
        if os.path.isdir(fs) and not p.endswith('/'):
            self.send_response(301); self.send_header('Location', PREFIX + p + '/' + q); self.end_headers(); return
        if os.path.isdir(fs): fs = os.path.join(fs, 'index.html')
        if fs.endswith('.html') and os.path.isfile(fs):
            with open(fs, 'rb') as fh: body = fh.read()
            body = body.replace(b'</body>', RELOAD + b'</body>') if b'</body>' in body else body + RELOAD
            self.send_response(200); self.send_header('Content-Type', 'text/html; charset=utf-8'); self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body); return
        super().do_GET()

class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True; allow_reuse_address = True

class Server6(Server):
    """IPv4 and IPv6 on one port: an iPhone on the cable without Personal Hotspot's address can still reach <this Mac>.local
    (the cable link only has IPv6 link-local addresses then)"""
    address_family = socket.AF_INET6
    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()

def addresses():
    """every IPv4 address of this computer (Wi-Fi, cable / hotspot …), so the phone can use whichever link it has"""
    import re, subprocess
    out = []
    try:
        txt = subprocess.run(['ifconfig'], capture_output=True, text=True, timeout=3).stdout
        name = None
        for line in txt.splitlines():
            m = re.match(r'^(\S+?):? ', line)
            if m and not line.startswith(('\t', ' ')): name = m.group(1)
            m = re.search(r'inet (?:addr:)?(\d+\.\d+\.\d+\.\d+)', line)
            if m and not m.group(1).startswith('127.'): out.append((name, m.group(1)))
    except Exception:
        pass
    return out

def subprocess_name():
    import subprocess
    return subprocess.run(['scutil', '--get', 'LocalHostName'], capture_output=True, text=True, timeout=3).stdout.strip()

def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try: s.connect(('10.255.255.255', 1)); return s.getsockname()[0]
    except OSError: return '127.0.0.1'
    finally: s.close()

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--port', type=int, default=8788); a = ap.parse_args()
    threading.Thread(target=watch, daemon=True).start()
    try: srv = Server6(('::', a.port), H)
    except OSError: srv = Server(('0.0.0.0', a.port), H)
    ip = lan_ip()
    print('\n  PeraSure dev server — reloads by itself when a file changes\n')
    print('  On this computer:  http://localhost:%d%s/   (picker)' % (a.port, PREFIX))
    print('  The app:           http://localhost:%d%s/prototypes/app/' % (a.port, PREFIX))
    try: print('  By cable / any link: http://%s.local:%d%s/' % (subprocess_name(), a.port, PREFIX))
    except Exception: pass
    print('  On your phone:     http://%s:%d%s/   (same Wi-Fi)' % (ip, a.port, PREFIX))
    for name, addr in addresses():
        if addr != ip: print('                     http://%s:%d%s/   (%s%s)' % (addr, a.port, PREFIX, name, ', iPhone hotspot / cable' if addr.startswith('172.20.10.') else ''))
    print('  Android by cable:  adb reverse tcp:%d tcp:%d   then http://localhost:%d%s/ on the phone' % (a.port, a.port, a.port, PREFIX))
    print('  Gallery:           http://%s:%d%s/shared/gallery.html\n' % (ip, a.port, PREFIX))
    print('  Stop: Ctrl+C\n')
    try: srv.serve_forever()
    except KeyboardInterrupt: pass
