#!/usr/bin/env python3
"""Reference applier for the PeraSure rebrand hand-off (phi_h5_025).

Usage (README.md "Apply order"; $H = this package, $REPO = the phi_h5_025 checkout):
  python3 "$H/tools/apply.py" "$REPO" --step all      # visual: steps 0-7 (+ the step-5 asset files) + fmt
  python3 "$H/tools/apply.py" "$REPO" --step 8        # after the motion patch: stale var() fallbacks + blue check
  python3 "$H/tools/apply.py" "$REPO" --step 0|1|..|8|fmt [--dry-run] [--skip-owner-items] [--report PATH]

What it does:
  step 0  tokens, file-wide and mechanical:
          0.0 delete the local --gradient-modal-backdrop block in src/styles/global.css (before the seds,
              or the rename would turn it into a local --gradient-scrim that overrides the token)
          0.1 run 01-tokens/rename.sed, rename-value-changes.sed, removed-literals.sed (in that order)
              on every src/**/*.css|scss|ts|tsx
          0.2 overwrite src/styles/figma-tokens.css with 01-tokens/rebrand-tokens.css (+ generated header)
  steps 1-7  every edit of 02-changes/changes-by-file.json whose file's applyGroup starts with that digit,
          anchored on `currentAfterStep0` (exact text) at `lineAfterStep0`; `skip` edits are only listed.
          Step 5 also does the asset files of 04-assets/assets-to-replace.json (rows with applyPy
          "recolour": hex swaps inside the SVG files; "remove": delete the Inter and Satoshi font folders).
  fmt     run the repo's own prettier (node_modules/.bin/prettier, .prettierrc.json, .prettierignore) on
          every changed file prettier formats in the pre-commit hook (lint-staged: js jsx ts tsx css scss json
          md): the files `git diff --name-only HEAD` lists under src/ and tests/ (or, without git, the files
          this run wrote). `--step all` ends with it, so the visual result is what the hook would commit.
          Needs `npm ci` first. --no-format skips it (then the hook reformats on commit and the motion patch
          may not apply: do not do that).
  step 8  (run LAST, after the motion patch) remove var() fallbacks of tokens the token file defines:
          every `var(--x, <anything>)` with --x declared in src/styles/figma-tokens.css (and resolvable there)
          becomes `var(--x)`; those fallbacks never render (the token file is loaded on every page), and 122 of
          them still carry legacy values. Skipped: the token file itself and the CreditIncreaseIntro iframe
          material (its document does not load the token file). Then fmt on the changed files, then a check
          that no legacy blue literal (LEGACY_BLUES below) is left anywhere in src/ (exit 1 if one is).
Each edit / operation is reported as applied / already-done / anchor-missing / skipped. A JSON report is
written (default: <repo>/rebrand-apply-report.json; delete it before committing). Python 3.8+, standard
library only. Writes only under src/, tests/, index.html and public/fonts/ (removals) of the target repo.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

PKG = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKENS = os.path.join(PKG, '01-tokens')
CHANGES = os.path.join(PKG, '02-changes', 'changes-by-file.json')
STEP8_TESTS = os.path.join(PKG, '02-changes', 'step8-tests.json')
SEDS = ['rename.sed', 'rename-value-changes.sed', 'removed-literals.sed']
SED_EXT = ('.css', '.scss', '.ts', '.tsx')
TOKEN_FILE = 'src/styles/figma-tokens.css'
GLOBAL_CSS = 'src/styles/global.css'
ALLOWED_TOP = ('src/', 'tests/')
ALLOWED_FILES = ('index.html',)
ASSETS = os.path.join(PKG, '04-assets', 'assets-to-replace.json')
ASSET_REMOVE_TOP = ('public/fonts/',)
PRETTIER_EXT = ('.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.md')  # lint-staged in package.json
STEP8_SKIP = ('src/styles/figma-tokens.css', 'src/pages/HomePage/CreditIncreaseIntro/material/')
# Legacy blues that must be gone from src/ after step 8: the old brand ramp 50-800 (token-map oldValue),
# the coin / iframe blues of 04-assets, #2b74bd, and Tailwind's blue-50..950. The rebrand token file still
# declares its own --palette-blue-* primitives (unused); those declarations are not counted.
LEGACY_BLUES = ['#f3f8ff', '#e4f0ff', '#c8deff', '#9fc6fa', '#74b2f5', '#3fa0f0', '#2c74be', '#20558d',
                '#173d67', '#2b74bd', '#78aae2', '#6fb8f5',
                '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8',
                '#1e40af', '#1e3a8a', '#172554']
LEGACY_BLUE_RGB = [(43, 116, 189), (44, 116, 190), (120, 170, 226)]

# Step 0.0: the block deleted from src/styles/global.css before the seds (baseline lines 50-54).
GRADIENT_BLOCK = (
    "  --gradient-modal-backdrop: linear-gradient(\n"
    "    to bottom,\n"
    "    rgba(0, 0, 0, 0) 0%,\n"
    "    var(--color-overlay-scrim-default, rgba(0, 0, 0, 0.2)) 100%\n"
    "  );\n"
)

TOKEN_HEADER_FILE = os.path.join(TOKENS, 'figma-tokens.header.css')  # 5-line generated header
TOKEN_MARK = 'Generated from the PeraSure rebrand token set'


# ---------------------------------------------------------------- helpers
def read(path):
    with open(path, encoding='utf-8', newline='') as f:
        return f.read()


def write(path, text, dry):
    if dry:
        return
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(text)


def check_target_path(rel):
    rel = rel.replace('\\', '/')
    if rel in ALLOWED_FILES or rel.startswith(ALLOWED_TOP):
        return rel
    raise SystemExit('refusing to touch %s (only src/, tests/, index.html)' % rel)


def load_sed(path):
    """Parse a hand-off .sed file (only `s/PAT/REP/g` lines, POSIX ERE) into Python regexes."""
    rules = []
    for line in read(path).split('\n'):
        if not line.startswith('s/'):
            continue
        assert line.endswith('/g'), line
        parts = re.split(r'(?<!\\)/', line[2:-2])
        assert len(parts) == 2, line
        pat, rep = parts
        pat = pat.replace('[[:space:]]', r'[ \t\r\f\v]')
        rep = re.sub(r'\\(\d)', r'\\g<\1>', rep)
        rules.append((re.compile(pat), rep))
    return rules


def apply_rules(text, rules):
    out = []
    for line in text.split('\n'):  # sed works line by line
        for rx, rep in rules:
            line = rx.sub(rep, line)
        out.append(line)
    return '\n'.join(out)


def sed_files(repo):
    for dp, dn, fn in os.walk(os.path.join(repo, 'src')):
        dn.sort()
        for f in sorted(fn):
            if f.endswith(SED_EXT):
                yield os.path.join(dp, f)


def token_file_text():
    """Same bytes as: cat 01-tokens/figma-tokens.header.css; tail -n +5 01-tokens/rebrand-tokens.css
    (rebrand-tokens.css lines 1-4 are its own comment, which points at the prototypes' font sheet)."""
    body = read(os.path.join(TOKENS, 'rebrand-tokens.css')).split('\n')
    assert body[3].rstrip().endswith('*/') and body[4] == '', 'rebrand-tokens.css header is not 4 lines'
    return read(TOKEN_HEADER_FILE) + '\n'.join(body[4:])


# ---------------------------------------------------------------- step 0
def step0(repo, dry, results):
    # 0.0 delete the local --gradient-modal-backdrop
    p = os.path.join(repo, GLOBAL_CSS)
    t = read(p)
    if GRADIENT_BLOCK in t:
        write(p, t.replace(GRADIENT_BLOCK, '', 1), dry)
        st = 'applied'
    elif '--gradient-modal-backdrop:' not in t and '--gradient-scrim:' not in t:
        st = 'already-done'
    else:
        st = 'anchor-missing'
    results.append({'id': 'S0.0', 'file': GLOBAL_CSS, 'action': 'delete', 'status': st,
                    'detail': 'local --gradient-modal-backdrop block (baseline lines 50-54)'})
    # 0.1 seds
    rules = []
    for name in SEDS:
        rules += load_sed(os.path.join(TOKENS, name))
    changed = 0
    for fp in sed_files(repo):
        t = read(fp)
        n = apply_rules(t, rules)
        if n != t:
            changed += 1
            write(fp, n, dry)
    results.append({'id': 'S0.1', 'file': 'src/**/*.{css,scss,ts,tsx}', 'action': 'sed',
                    'status': 'applied' if changed else 'already-done',
                    'detail': '%s: %d files changed' % (', '.join(SEDS), changed)})
    # 0.2 token file
    p = os.path.join(repo, TOKEN_FILE)
    new = token_file_text()
    old = read(p) if os.path.exists(p) else ''
    st = 'already-done' if old == new else 'applied'
    if st == 'applied':
        write(p, new, dry)
    results.append({'id': 'S0.2', 'file': TOKEN_FILE, 'action': 'overwrite', 'status': st,
                    'detail': 'rebrand-tokens.css (px) with the generated header'})


# ---------------------------------------------------------------- edits
def nearest(lines, start, n, test, window):
    """Return the 1-based line s nearest to `start` (within +-window) for which test(block) holds."""
    for d in range(0, window + 1):
        for s in ((start,) if d == 0 else (start - d, start + d)):
            if s < 1 or s + n - 1 > len(lines):
                continue
            if test('\n'.join(lines[s - 1:s - 1 + n])):
                return s
    return None


def apply_edit(lines, e, window):
    """Mutates `lines`; returns (status, detail)."""
    act = e['action']
    anchor = e.get('currentAfterStep0')
    tgt = e.get('target') or ''
    exp = e['lineAfterStep0']
    n = anchor.count('\n') + 1 if anchor is not None else 1
    moved = lambda s: '' if s == exp else ' (found %+d lines from lineAfterStep0)' % (s - exp)

    if e.get('doneByStep0'):
        if act == 'delete':
            ok = nearest(lines, exp, n, lambda b: anchor in b, window) is None
        else:
            ok = tgt == '' or nearest(lines, exp, tgt.count('\n') + 1, lambda b: tgt in b, window) is not None
        return ('already-done', 'done by step 0') if ok else ('anchor-missing', 'doneByStep0 but target not found')

    m = tgt.count('\n') + 1
    at = lambda k, text: '\n'.join(lines[k - 1:k - 1 + text.count('\n') + 1]) if k >= 1 else ''

    if act == 'replace':
        # 1. anchor at the expected line; 2. target already there; 3. anchor nearby (newer branch)
        if anchor in at(exp, anchor):
            s = exp
        elif tgt and tgt in at(exp, tgt):
            return 'already-done', 'target text already at lineAfterStep0'
        elif tgt and nearest(lines, exp, m, lambda b: tgt in b, window) is not None:
            return 'already-done', 'target text already present nearby'
        else:
            hits = [k for k in range(max(1, exp - window), exp + window + 1) if anchor in at(k, anchor)]
            if len(hits) > 1:
                return 'anchor-missing', 'currentAfterStep0 not at lineAfterStep0 and ambiguous nearby (lines %s)' % hits
            s = hits[0] if hits else None
        if s is None:
            return 'anchor-missing', 'currentAfterStep0 not found within +-%d lines' % window
        block = '\n'.join(lines[s - 1:s - 1 + n])
        if e.get('replaceAll'):
            cnt = block.count(anchor)
            new = block.replace(anchor, tgt)
            det = 'replaced %d occurrence(s)' % cnt
            if e.get('expectedCount') and cnt != e['expectedCount']:
                det += ' (expected %d)' % e['expectedCount']
        else:
            new = block.replace(anchor, tgt, 1)
            det = ''
        lines[s - 1:s - 1 + n] = new.split('\n')
        return 'applied', det + moved(s)

    if act == 'insert':
        add = tgt.split('\n')
        s = exp if anchor in at(exp, anchor) else nearest(lines, exp, n, lambda b: anchor in b, window)
        if s is None:
            body = '\n'.join(x for x in add if x.strip())
            if nearest(lines, exp, body.count('\n') + 1, lambda b: b == body, window) is not None:
                return 'already-done', 'inserted lines already present'
            return 'anchor-missing', 'anchor not found within +-%d lines' % window
        end = s + n - 1
        for k in range(end, min(end + 12, len(lines))):  # already inserted (possibly after a sibling insert)?
            if lines[k:k + len(add)] == add:
                return 'already-done', 'inserted lines already present'
        lines[end:end] = add
        return 'applied', 'inserted %d line(s) after line %d' % (len(add), end) + moved(s)

    if act == 'delete':
        s = exp if at(exp, anchor) == anchor else nearest(lines, exp, n, lambda b: b == anchor, window)
        if s is None:
            if nearest(lines, exp, n, lambda b: anchor in b, window) is not None:
                return 'anchor-missing', 'text found but not as whole lines'
            return 'already-done', 'lines not present'
        del lines[s - 1:s - 1 + n]
        return 'applied', 'deleted %d line(s)' % n + moved(s)

    return 'error', 'unknown action %r' % act


def run_edits(repo, data, steps, dry, owner, window, results, touched=None):
    for fi in data['files']:
        grp = fi['applyGroup'][:1]
        if grp not in steps:
            continue
        rel = check_target_path(fi['file'])
        path = os.path.join(repo, rel)
        lines = None
        dirty = False
        for e in fi['edits']:
            row = {'id': e['id'], 'file': rel, 'group': grp, 'action': e['action'],
                   'lineAfterStep0': e.get('lineAfterStep0'), 'needsOwner': e.get('needsOwner', False)}
            if e['action'] == 'manual':
                row.update(status='manual', detail=e.get('instruction', ''))
            elif e['action'] == 'skip':
                row.update(status='skipped', detail=e.get('skipReason', ''))
            elif e['action'] == 'token-step':
                row.update(status='already-done', detail='done by step 0 (0.2)')
            elif e.get('needsOwner') and not owner:
                row.update(status='skipped-owner', detail='needsOwner (run with --include-owner-items)')
            else:
                if lines is None:
                    if not os.path.exists(path):
                        row.update(status='anchor-missing', detail='file not found')
                        results.append(row)
                        continue
                    lines = read(path).split('\n')
                st, det = apply_edit(lines, e, window)
                row.update(status=st, detail=det)
                dirty = dirty or st == 'applied'
            results.append(row)
        if dirty:
            write(path, '\n'.join(lines), dry)
            if touched is not None:
                touched.add(rel)


# ---------------------------------------------------------------- step 5: asset files
def step5_assets(repo, results, touched):
    data = json.loads(read(ASSETS))
    for group in ('fonts', 'animations', 'logos', 'icons', 'emptyStatesAndIllustrations'):
        for row in data.get(group, []):
            how = row.get('applyPy')
            if how == 'recolour':
                rel = check_target_path(row['productionPath'])
                p = os.path.join(repo, rel)
                r = {'id': 'A5', 'file': rel, 'action': 'recolour', 'group': '5'}
                if not os.path.exists(p):
                    r.update(status='anchor-missing', detail='file not found')
                    results.append(r)
                    continue
                t = read(p)
                n = t
                done, missing = [], []
                for c in row['colourReplacements']:
                    rx = re.compile(re.escape(c['from']), re.I)
                    if rx.search(n):
                        n = rx.sub(c['to'], n)
                        done.append('%s -> %s' % (c['from'], c['to']))
                    elif c['to'].lower() not in n.lower():
                        missing.append(c['from'])
                if missing:
                    r.update(status='anchor-missing', detail='colour not in file: ' + ', '.join(missing))
                elif n != t:
                    write(p, n, False)
                    touched.add(rel)
                    r.update(status='applied', detail='; '.join(done))
                else:
                    r.update(status='already-done', detail='new colours already in the file')
                results.append(r)
            elif how == 'remove':
                for rel in row['removePaths']:
                    rel = rel.replace('\\', '/').rstrip('/')
                    if not rel.startswith(ASSET_REMOVE_TOP):
                        raise SystemExit('refusing to remove %s' % rel)
                    p = os.path.join(repo, rel)
                    r = {'id': 'A5', 'file': rel, 'action': 'remove', 'group': '5'}
                    if os.path.isdir(p):
                        shutil.rmtree(p)
                        r.update(status='applied', detail='folder removed')
                    elif os.path.exists(p):
                        os.remove(p)
                        r.update(status='applied', detail='file removed')
                    else:
                        r.update(status='already-done', detail='not present')
                    results.append(r)


# ---------------------------------------------------------------- fmt
def changed_files(repo, touched):
    """Files changed since HEAD (git), else the files this run wrote."""
    try:
        out = subprocess.run(['git', 'diff', '--name-only', 'HEAD', '--', 'src', 'tests'], cwd=repo,
                             check=True, capture_output=True, text=True).stdout.split('\n')
        out += subprocess.run(['git', 'ls-files', '--others', '--exclude-standard', '--', 'src', 'tests'],
                              cwd=repo, check=True, capture_output=True, text=True).stdout.split('\n')
        files = set(f for f in out if f)
    except (OSError, subprocess.CalledProcessError):
        files = set(touched)
    return sorted(f for f in files if f.endswith(PRETTIER_EXT) and os.path.exists(os.path.join(repo, f)))


def fmt(repo, results, touched):
    files = changed_files(repo, touched)
    bin_ = os.path.join(repo, 'node_modules', '.bin', 'prettier')
    if not files:
        results.append({'id': 'FMT', 'file': '-', 'action': 'prettier', 'status': 'already-done', 'detail': 'no changed files'})
        return
    if not os.path.exists(bin_):
        raise SystemExit('fmt: %s not found - run `npm ci` in the repo first (the pre-commit hook formats with '
                         'the same prettier, so the package output must be formatted before the next step)' % bin_)
    before = {f: read(os.path.join(repo, f)) for f in files}
    for i in range(0, len(files), 200):
        subprocess.run([bin_, '--write', '--log-level', 'warn'] + files[i:i + 200], cwd=repo, check=True)
    changed = [f for f in files if read(os.path.join(repo, f)) != before[f]]
    results.append({'id': 'FMT', 'file': '%d files' % len(files), 'action': 'prettier --write',
                    'status': 'applied' if changed else 'already-done',
                    'detail': '%d of %d changed files reformatted' % (len(changed), len(files))})


# ---------------------------------------------------------------- step 8
DECL = re.compile(r'(?m)^\s*(--[A-Za-z0-9_-]+)\s*:\s*([^;]*);')


def token_defs(repo):
    t = re.sub(r'/\*.*?\*/', '', read(os.path.join(repo, TOKEN_FILE)), flags=re.S)
    if TOKEN_MARK not in read(os.path.join(repo, TOKEN_FILE)):
        raise SystemExit('step 8 needs step 0 (the rebrand token file) first')
    defs = {m.group(1): m.group(2).strip() for m in DECL.finditer(t)}
    ok = {}

    def resolvable(name, seen=()):
        if name in ok:
            return ok[name]
        if name not in defs or name in seen:
            return False
        res = True
        for m in re.finditer(r'var\(\s*(--[A-Za-z0-9_-]+)\s*(,)?', defs[name]):
            if not m.group(2) and not resolvable(m.group(1), seen + (name,)):
                res = False
        ok[name] = res
        return res
    return {n for n in defs if resolvable(n)}


def strip_fallbacks(text, names, hits):
    """Rewrite var(--x, fb) -> var(--x) for --x in names; recursive, balanced parentheses."""
    out, i, n = [], 0, len(text)
    while i < n:
        j = text.find('var(', i)
        if j < 0:
            out.append(text[i:])
            break
        out.append(text[i:j])
        depth, k = 0, j + 3
        while k < n:
            if text[k] == '(':
                depth += 1
            elif text[k] == ')':
                depth -= 1
                if depth == 0:
                    break
            k += 1
        if k >= n:  # unbalanced (e.g. inside a regex): leave as is
            out.append(text[j:])
            break
        inner = text[j + 4:k]
        m = re.match(r'\s*(--[A-Za-z0-9_-]+)\s*,', inner)
        if m and m.group(1) in names:
            hits.append((m.group(1), inner[m.end():].strip()))
            out.append('var(%s)' % m.group(1))
        else:
            out.append('var(' + strip_fallbacks(inner, names, hits) + ')')
        i = k + 1
    return ''.join(out)


def strip_fallbacks_in_regex(text, names, hits):
    """Same rewrite inside regex literals of the tests: var\\(--x, fb\\) -> var\\(--x\\) (escaped parens)."""
    out, i = [], 0
    while True:
        j = text.find('var\\(--', i)
        if j < 0:
            out.append(text[i:])
            break
        out.append(text[i:j])
        k, depth = j + 5, 1
        while k < len(text) and depth:
            if text.startswith('\\(', k):
                depth += 1
                k += 2
            elif text.startswith('\\)', k):
                depth -= 1
                k += 2
            elif text[k] == '\n':
                break
            else:
                k += 1
        inner = text[j + 5:k - 2]
        m = re.match(r'(--[A-Za-z0-9_-]+)\s*,', inner)
        if depth == 0 and m and m.group(1) in names:
            hits.append((m.group(1), inner[m.end():].strip()))
            out.append('var\\(%s\\)' % m.group(1))
            i = k
        else:
            out.append('var\\(')
            i = j + 5
    return ''.join(out)


def step8(repo, results, touched):
    names = token_defs(repo)
    total = 0
    for fp in sed_files(repo):
        rel = os.path.relpath(fp, repo).replace(os.sep, '/')
        if rel.startswith(STEP8_SKIP):
            continue
        t = read(fp)
        if 'var(' not in t:
            continue
        hits = []
        n = strip_fallbacks(t, names, hits)
        if n != t:
            write(fp, n, False)
            touched.add(rel)
            total += len(hits)
            results.append({'id': 'S8', 'file': rel, 'action': 'strip-fallback', 'status': 'applied',
                            'detail': '%d fallback(s): %s' % (len(hits), ', '.join(sorted(set(h[0] for h in hits))))})
    # the tests that pin those fallbacks in their regexes (escaped form) follow the same rule
    for dp, dn, fn in os.walk(os.path.join(repo, 'tests')):
        dn.sort()
        for f in sorted(fn):
            if not f.endswith(('.ts', '.tsx', '.mjs', '.js')):
                continue
            fp = os.path.join(dp, f)
            rel = os.path.relpath(fp, repo).replace(os.sep, '/')
            t = read(fp)
            hits = []
            n = strip_fallbacks_in_regex(t, names, hits)
            if n != t:
                write(fp, n, False)
                touched.add(rel)
                total += len(hits)
                results.append({'id': 'S8', 'file': rel, 'action': 'strip-fallback (test regex)', 'status': 'applied',
                                'detail': '%d pattern(s): %s' % (len(hits), ', '.join(sorted(set(h[0] for h in hits))))})
    for e in json.loads(read(STEP8_TESTS))['edits']:
        rel = check_target_path(e['file'])
        fp = os.path.join(repo, rel)
        t = read(fp)
        row = {'id': e['id'], 'file': rel, 'action': 'replace (test)', 'group': '8'}
        if t.count(e['current']) == 1:
            write(fp, t.replace(e['current'], e['target']), False)
            touched.add(rel)
            row.update(status='applied', detail=e['test'])
        elif e['target'] in t:
            row.update(status='already-done', detail=e['test'])
        else:
            row.update(status='anchor-missing', detail='text not found once: ' + e['current'][:80])
        results.append(row)
    results.append({'id': 'S8', 'file': 'src/**, tests/**', 'action': 'strip-fallback', 'status': 'applied' if total else 'already-done',
                    'detail': '%d var() fallbacks of defined tokens removed in %d files' % (total, len(touched))})


def blue_check(repo):
    """Every legacy blue literal left in src/ (the token file's own --palette-blue-* declarations excepted)."""
    hexes = '|'.join(h[1:] for h in LEGACY_BLUES)
    rgb = '|'.join(r'%d\s*,\s*%d\s*,\s*%d' % c for c in LEGACY_BLUE_RGB)
    rx = re.compile(r'#(?:%s)\b|rgba?\(\s*(?:%s)\b|\b(?:bg|text|border|ring|fill|stroke|from|to|via)-blue-\d+' % (hexes, rgb), re.I)
    left = []
    for dp, dn, fn in os.walk(os.path.join(repo, 'src')):
        dn.sort()
        for f in sorted(fn):
            fp = os.path.join(dp, f)
            rel = os.path.relpath(fp, repo).replace(os.sep, '/')
            try:
                t = read(fp)
            except (UnicodeDecodeError, ValueError):
                continue
            for no, line in enumerate(t.split('\n'), 1):
                if rx.search(line):
                    if rel == TOKEN_FILE and re.match(r'\s*--palette-blue-\d+\s*:', line):
                        continue
                    left.append('%s:%d: %s' % (rel, no, line.strip()[:140]))
    return left


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('repo', help='path to the phi_h5_025 checkout ($REPO)')
    ap.add_argument('--step', default='all',
                    help='all (= 0..7 incl. the step-5 asset files, then fmt), 0..7, 8 (after the motion patch) or fmt')
    ap.add_argument('--dry-run', action='store_true', help='report only: runs on a temporary copy of src/, tests/, index.html, public/fonts and writes nothing but the report (no fmt)')
    g = ap.add_mutually_exclusive_group()
    g.add_argument('--include-owner-items', dest='owner', action='store_true', default=True,
                   help='apply needsOwner edits with the package default (default)')
    g.add_argument('--skip-owner-items', dest='owner', action='store_false',
                   help='leave needsOwner edits out (reported as skipped-owner)')
    ap.add_argument('--no-format', action='store_true', help='do not run prettier at the end (not recommended)')
    ap.add_argument('--report', help='report path (default <repo>/rebrand-apply-report.json)')
    ap.add_argument('--window', type=int, default=40, help='lines to search around lineAfterStep0 (default 40)')
    a = ap.parse_args()

    repo = os.path.abspath(a.repo)
    if not os.path.isfile(os.path.join(repo, GLOBAL_CSS)):
        raise SystemExit('%s does not look like phi_h5_025 (no %s)' % (repo, GLOBAL_CSS))
    if a.step == 'all':
        steps = list('01234567') + ['fmt']
    elif a.step in list('012345678') + ['fmt']:
        steps = [a.step] + (['fmt'] if a.step == '8' else [])
    else:
        raise SystemExit('--step must be all, 0..8 or fmt')
    if a.no_format or a.dry_run:
        steps = [s for s in steps if s != 'fmt']
    data = json.loads(read(CHANGES))
    results = []
    touched = set()
    work = repo
    if a.dry_run:  # run for real on a throw-away copy, so later steps see what earlier steps would write
        work = tempfile.mkdtemp(prefix='rebrand-dry-')
        for p in ('src', 'tests', 'public/fonts'):
            if os.path.isdir(os.path.join(repo, p)):
                shutil.copytree(os.path.join(repo, p), os.path.join(work, p))
        if os.path.exists(os.path.join(repo, 'index.html')):
            shutil.copy(os.path.join(repo, 'index.html'), work)
    blues = None
    try:
        if '0' in steps:
            step0(work, False, results)
        elif TOKEN_MARK not in read(os.path.join(work, TOKEN_FILE)):
            raise SystemExit('step 0 is not applied (%s has no rebrand header): run --step 0 first; '
                             'every anchor is post-step-0 text' % TOKEN_FILE)
        for st in [s for s in steps if s in '1234567']:
            run_edits(work, data, [st], False, a.owner, a.window, results, touched)
            if st == '5':
                step5_assets(work, results, touched)
        if '8' in steps:
            step8(work, results, touched)
        if 'fmt' in steps:
            fmt(work, results, touched)
        if '8' in steps:
            blues = blue_check(work)
            results.append({'id': 'S8.check', 'file': 'src/**', 'action': 'legacy-blue-check',
                            'status': 'anchor-missing' if blues else 'applied',
                            'detail': ('%d legacy blue literal(s) left' % len(blues)) if blues else 'no legacy blue literal left in src/'})
    finally:
        if work != repo:
            shutil.rmtree(work, ignore_errors=True)

    counts = {}
    for r in results:
        counts[r['status']] = counts.get(r['status'], 0) + 1
    edits = [r for r in results if str(r['id']).startswith('E')]
    ecounts = {}
    for r in edits:
        ecounts[r['status']] = ecounts.get(r['status'], 0) + 1
    report = {
        'package': PKG, 'repo': repo, 'step': a.step, 'dryRun': a.dry_run, 'ownerItems': a.owner,
        'counts': counts,
        'editCounts': ecounts,
        'anchorMissing': [r for r in results if r['status'] in ('anchor-missing', 'error')],
        'legacyBlueLeft': blues,
        'results': results,
    }
    out = a.report or os.path.join(repo, 'rebrand-apply-report.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=1, ensure_ascii=False)
    print('all rows: %s' % json.dumps(counts))
    if edits:
        print('edits (E…): %s' % json.dumps(ecounts))
    for r in results:
        if not str(r['id']).startswith('E'):
            print('%-9s %-14s %s  %s' % (r['id'], r['status'], r['file'], r.get('detail', '')[:120]))
    for r in report['anchorMissing']:
        print('MISSING %s %s:%s %s' % (r['id'], r['file'], r.get('lineAfterStep0', ''), r.get('detail', '')))
    for b in blues or []:
        print('BLUE ' + b)
    print('anchor-missing: %d' % len(report['anchorMissing']))
    print('report: %s (delete it before committing)' % out)
    return 1 if report['anchorMissing'] else 0


if __name__ == '__main__':
    sys.exit(main())
