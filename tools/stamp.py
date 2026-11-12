"""Stamp the Playground pages with a deploy version, so phones fetch fresh copies after an update.

GitHub Pages lets browsers reuse a page for up to 10 minutes. The Playground pages load their
shared scripts as `…/playground-ui.js?v=<stamp>` and `…/animations.js?v=<stamp>`, and the
picker adds `v=<stamp>` to every link and thumbnail, so a new stamp means new URLs everywhere.
Run before committing a change to index.html, animations/, assets/, prototypes/ or shared/:

    python3 tools/stamp.py
"""
import os, re, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'animations/player.html']
stamp = time.strftime('%Y%m%d%H%M', time.gmtime())
# the rem version of the tokens (tokens-rem/) is made from tokens/tokens.css: keep it in step before anything is stamped
subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'rem-tokens.py')], check=True)
pat = re.compile(r'((?:playground-ui|animations)\.js)\?v=[\w-]+')
for rel in PAGES:
    p = os.path.join(ROOT, rel)
    s = open(p, encoding='utf-8').read()
    s2, n = pat.subn(r'\1?v=' + stamp, s)
    open(p, 'w', encoding='utf-8').write(s2)
    print('%s: %d script tag(s) -> v=%s' % (rel, n, stamp))

# prototypes that load their own files (page.js / page.css / data.json next to them) mark them ?v=<stamp> too
own = re.compile(r'((?:href|src|data-[\w-]+)="(?!\.\./\.\./)[^"?]+\.(?:js|css|json))\?v=[\w-]+"')
# … and the shared components they link (../../shared/ps-ui/…?v=)
shared = re.compile(r'((?:href|src)="\.\./\.\./(?:shared|tokens-rem)/[^"?]+\.(?:js|css))\?v=[\w-]+"')
for d, _, files in os.walk(os.path.join(ROOT, 'prototypes')):
    for f in files:
        if not f.endswith('.html'): continue
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        s2, n = own.subn(r'\1?v=' + stamp + '"', s)
        s2, n2 = shared.subn(r'\1?v=' + stamp + '"', s2); n += n2
        if n:
            open(p, 'w', encoding='utf-8').write(s2)
            print('%s: %d own file link(s) -> v=%s' % (os.path.relpath(p, ROOT), n, stamp))

# the shared component gallery (shared/*.html) and its own files
for f in os.listdir(os.path.join(ROOT, 'shared')):
    if not f.endswith('.html'): continue
    p = os.path.join(ROOT, 'shared', f); s = open(p, encoding='utf-8').read()
    s2, n = own.subn(r'\1?v=' + stamp + '"', s)
    if n:
        open(p, 'w', encoding='utf-8').write(s2)
        print('shared/%s: %d own file link(s) -> v=%s' % (f, n, stamp))
