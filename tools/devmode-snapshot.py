#!/usr/bin/env python3
"""Save a runnable snapshot of the PeraSure app for Dev Mode's version history.

    python3 tools/devmode-snapshot.py <id>        e.g. v1.0 · v1-20261120-PHL-123 · v1-20261120-n1 (no Jira ticket)

Copies what the app needs to run as it is today into devmode/snapshots/<id>/, keeping the repo's folder layout:
prototypes/app, shared/ps-ui, the component states (shared/gallery*.js, shared/stage.html), tokens/tokens.css,
tokens-rem/tokens-rem.css, the animations' JSON, the Withdraw demo (the app runs its code) and the baked Credit limit
increase. Links that climb to the repo root for vendor/ and assets/ (pinned libraries and fonts, never changed in place)
are pointed at the root copies, so a snapshot holds only what can change. Then it writes the snapshot's own Dev Mode index
(devmode-index.js) for its version of the components, and meta.json. An existing snapshot is never overwritten.
"""
import json, os, re, shutil, subprocess, sys, time

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIRS = ['prototypes/app', 'shared/ps-ui', 'prototypes/withdraw-fund-flow', 'prototypes/credit-limit-coins/baked']
FILES = ['shared/gallery.js', 'shared/gallery-app.js', 'shared/stage.html', 'tokens/tokens.css', 'tokens-rem/tokens-rem.css']
SKIP = re.compile(r'(^|/)(\.DS_Store|preview[^/]*\.(webp|png)|[^/]*\.lottie|gsap/.*)$')
TEXT = ('.html', '.js', '.css')
UP = '../../../'          # a snapshot's root is devmode/snapshots/<id>/, three folders below the repo's


def rewrite(text, depth):
    """links that climb exactly to the snapshot's root and go into vendor/ or assets/ climb on to the repo's root"""
    def climb(m):
        ups = m.group(2).count('../')
        return m.group(1) + (UP if ups == depth else '') + m.group(2) + m.group(3) + '/'
    text = re.sub(r"""(['"(\s=])((?:\.\./)+)(vendor|assets)/""", climb, text)
    text = re.sub(r"(PS\.root\s*\+\s*')(vendor|assets)/", r"\1" + UP + r"\2/", text)
    return text


def main():
    if len(sys.argv) < 2 or not re.match(r'^[A-Za-z0-9._-]+$', sys.argv[1]):
        sys.exit('usage: devmode-snapshot.py <id>   (letters, digits, . _ -)')
    sid = sys.argv[1]
    dest = os.path.join(ROOT, 'devmode', 'snapshots', sid)
    if os.path.exists(dest):
        sys.exit('snapshot %s already exists — a saved version is never changed' % sid)
    files = []
    for d in DIRS:
        for base, _, names in os.walk(os.path.join(ROOT, d)):
            for n in names:
                rel = os.path.relpath(os.path.join(base, n), ROOT).replace(os.sep, '/')
                if not SKIP.search(rel): files.append(rel)
    files += [f for f in FILES if os.path.exists(os.path.join(ROOT, f))]
    for base, _, names in os.walk(os.path.join(ROOT, 'animations')):
        for n in names:
            rel = os.path.relpath(os.path.join(base, n), ROOT).replace(os.sep, '/')
            if n.endswith('.json') and '/gsap/' not in rel: files.append(rel)
    size = 0
    for rel in sorted(set(files)):
        src, out = os.path.join(ROOT, rel), os.path.join(dest, rel)
        os.makedirs(os.path.dirname(out), exist_ok=True)
        if rel.endswith(TEXT):
            with open(src, encoding='utf-8') as f: t = f.read()
            t = rewrite(t, rel.count('/'))
            with open(out, 'w', encoding='utf-8') as f: f.write(t)
        else:
            shutil.copyfile(src, out)
        size += os.path.getsize(out)
    commit = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    with open(os.path.join(dest, 'meta.json'), 'w', encoding='utf-8') as f:
        json.dump({'id': sid, 'created': time.strftime('%Y-%m-%d %H:%M'), 'baseCommit': commit, 'files': len(set(files))}, f, ensure_ascii=False, indent=1)
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'devmode-index.py'), dest, os.path.join(dest, 'devmode-index.js')], check=True)
    print('snapshot %s: %d files, %.1f MB -> %s' % (sid, len(set(files)), size / 1e6, os.path.relpath(dest, ROOT)))


if __name__ == '__main__':
    main()
