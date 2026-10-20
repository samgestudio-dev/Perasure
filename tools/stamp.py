"""Stamp the Playground pages with a deploy version, so phones fetch fresh copies after an update.

GitHub Pages lets browsers reuse a page for up to 10 minutes. The Playground pages load their
shared scripts as `…/playground-ui.js?v=<stamp>` and `…/animations.js?v=<stamp>`, and the
picker adds `v=<stamp>` to every link and thumbnail, so a new stamp means new URLs everywhere.
Run before committing a change to index.html, animations/, assets/ or prototypes/:

    python3 tools/stamp.py
"""
import os, re, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'animations/player.html']
stamp = time.strftime('%Y%m%d%H%M', time.gmtime())
pat = re.compile(r'((?:playground-ui|animations)\.js)\?v=[\w-]+')
for rel in PAGES:
    p = os.path.join(ROOT, rel)
    s = open(p, encoding='utf-8').read()
    s2, n = pat.subn(r'\1?v=' + stamp, s)
    open(p, 'w', encoding='utf-8').write(s2)
    print('%s: %d script tag(s) -> v=%s' % (rel, n, stamp))
