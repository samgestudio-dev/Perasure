#!/usr/bin/env python3
"""Reference applier for the PeraSure rebrand hand-off (phi_h5_025).

Usage:
  python3 apply.py <path-to-phi_h5_025> [--step 0|1|2|3|4|5|6|7|all] [--dry-run]
                   [--include-owner-items | --skip-owner-items] [--report PATH] [--window N]

What it does (README.md "Apply order"):
  step 0  tokens, file-wide and mechanical:
          0.0 delete the local --gradient-modal-backdrop block in src/styles/global.css (before the seds,
              or the rename would turn it into a local --gradient-scrim that overrides the token)
          0.1 run 01-tokens/rename.sed, rename-value-changes.sed, removed-literals.sed (in that order)
              on every src/**/*.css|scss|ts|tsx
          0.2 overwrite src/styles/figma-tokens.css with 01-tokens/rebrand-tokens.css (+ generated header)
  steps 1-7  every edit of 02-changes/changes-by-file.json whose file's applyGroup starts with that digit,
          anchored on `currentAfterStep0` (exact text) at `lineAfterStep0`; `manual` and `skip` edits are
          only listed.
Each edit is reported as applied / already-done / anchor-missing / manual / skipped. A JSON report is
written (default: <repo>/rebrand-apply-report.json). Python 3.8+, standard library only.
The script only writes files under src/, tests/ and index.html of the target repo, plus the report.
"""
import argparse
import json
import os
import re
import shutil
import sys
import tempfile

PKG = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKENS = os.path.join(PKG, '01-tokens')
CHANGES = os.path.join(PKG, '02-changes', 'changes-by-file.json')
SEDS = ['rename.sed', 'rename-value-changes.sed', 'removed-literals.sed']
SED_EXT = ('.css', '.scss', '.ts', '.tsx')
TOKEN_FILE = 'src/styles/figma-tokens.css'
GLOBAL_CSS = 'src/styles/global.css'
ALLOWED_TOP = ('src/', 'tests/')
ALLOWED_FILES = ('index.html',)

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


def run_edits(repo, data, steps, dry, owner, window, results):
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


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('repo', help='path to the phi_h5_025 checkout')
    ap.add_argument('--step', default='all', help='0, 1..7 or all (default: all = 0 then 1..7)')
    ap.add_argument('--dry-run', action='store_true', help='report only: runs on a temporary copy of src/, tests/, index.html and writes nothing but the report')
    g = ap.add_mutually_exclusive_group()
    g.add_argument('--include-owner-items', dest='owner', action='store_true', default=True,
                   help='apply needsOwner edits with the package default (default)')
    g.add_argument('--skip-owner-items', dest='owner', action='store_false',
                   help='leave needsOwner edits out (reported as skipped-owner)')
    ap.add_argument('--report', help='report path (default <repo>/rebrand-apply-report.json)')
    ap.add_argument('--window', type=int, default=40, help='lines to search around lineAfterStep0 (default 40)')
    a = ap.parse_args()

    repo = os.path.abspath(a.repo)
    if not os.path.isfile(os.path.join(repo, GLOBAL_CSS)):
        raise SystemExit('%s does not look like phi_h5_025 (no %s)' % (repo, GLOBAL_CSS))
    steps = list('01234567') if a.step == 'all' else [a.step]
    if any(s not in '01234567' or len(s) != 1 for s in steps):
        raise SystemExit('--step must be 0..7 or all')
    data = json.loads(read(CHANGES))
    results = []
    work = repo
    if a.dry_run:  # run for real on a throw-away copy, so later steps see what earlier steps would write
        work = tempfile.mkdtemp(prefix='rebrand-dry-')
        for p in ('src', 'tests'):
            if os.path.isdir(os.path.join(repo, p)):
                shutil.copytree(os.path.join(repo, p), os.path.join(work, p))
        if os.path.exists(os.path.join(repo, 'index.html')):
            shutil.copy(os.path.join(repo, 'index.html'), work)
    try:
        if '0' in steps:
            step0(work, False, results)
        elif TOKEN_MARK not in read(os.path.join(work, TOKEN_FILE)):
            raise SystemExit('step 0 is not applied (%s has no rebrand header): run --step 0 first; '
                             'every anchor is post-step-0 text' % TOKEN_FILE)
        run_edits(work, data, [s for s in steps if s != '0'], False, a.owner, a.window, results)
    finally:
        if work != repo:
            shutil.rmtree(work, ignore_errors=True)

    counts = {}
    for r in results:
        counts[r['status']] = counts.get(r['status'], 0) + 1
    report = {
        'package': PKG, 'repo': repo, 'step': a.step, 'dryRun': a.dry_run, 'ownerItems': a.owner,
        'counts': counts,
        'anchorMissing': [r for r in results if r['status'] in ('anchor-missing', 'error')],
        'manual': [r for r in results if r['status'] == 'manual'],
        'results': results,
        'notDoneByThisScript': [
            '04-assets/assets-to-replace.json: icon / logo / illustration / font file swaps (public/, src/assets/)',
            'README step 8: remove stale var(--x, fallback) fallbacks; step 9: verify checklist',
        ],
    }
    out = a.report or os.path.join(repo, 'rebrand-apply-report.json')
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=1, ensure_ascii=False)
    print(json.dumps(counts))
    for r in report['anchorMissing']:
        print('MISSING %s %s:%s %s' % (r['id'], r['file'], r.get('lineAfterStep0'), r.get('detail', '')))
    print('manual: %d (listed in %s)' % (len(report['manual']), out))
    return 1 if report['anchorMissing'] else 0


if __name__ == '__main__':
    sys.exit(main())
