#!/usr/bin/env python3
"""Regenerate 02-changes/changes-by-file.md from 02-changes/changes-by-file.json (the JSON is the source)."""
import json
import os

PKG = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(PKG, '02-changes', 'changes-by-file.json')
OUT = os.path.join(PKG, '02-changes', 'changes-by-file.md')


def cell(t, n=140):
    t = '' if t is None else str(t)
    t = t.replace('\n', ' ⏎ ').replace('|', '\\|')
    return t if len(t) <= n else t[:n - 1] + '…'


def code(t, n=140):
    t = cell(t, n)
    return '`%s`' % t.replace('`', "'") if t else ''


def main():
    d = json.load(open(SRC, encoding='utf-8'))
    m, files = d['meta'], d['files']
    c = m['counts']
    out = ['# Rebrand: visual changes per production file', '',
           'Generated from `changes-by-file.json` by `tools/render_changes_md.py`; do not edit by hand. Baseline: production '
           '`phi_h5_025` master `0d9bdd4`. Rebrand: PeraSure tokens v2026.11.23. %d files, %d edits (%s). %d edits are marked '
           '**owner** (see `conflicts.md`).' % (c['files'], c['edits'],
                                                ', '.join('%d %s' % (v, k) for k, v in c['byAction'].items()), c['needsOwner']),
           '', '## How to read this', '',
           '1. **Step 0 first** (README "Step 0"): delete the local `--gradient-modal-backdrop` block, run the three seds, overwrite '
           'the token file. "Now" below is the text **after step 0** (`currentAfterStep0`), the anchor to look for.',
           '2. Groups in order (1 global … 6 copy, 7 tests). Inside a file the rows are **bottom-up**: apply them in the listed order '
           'and every "Line" (after step 0) stays valid.',
           '3. **replace**: swap "Now" for "Becomes". **insert**: add "Becomes" (whole lines) after the line(s) shown in "Now". '
           '**delete**: remove those lines. **manual**: follow the instruction. **skip**: do not apply. ⏎ marks a line break.',
           '4. `(same value)` rows change nothing on screen: they point an undefined token at a real one.',
           '5. Precedence: this list > `01-tokens/token-map.json` > `01-tokens/unresolved.md`.',
           '6. Reference implementation: `python3 tools/apply.py <phi_h5_025> --step all` does all of the above and reports '
           'applied / already-done / anchor-missing per edit.', '']
    group = None
    for fi in files:
        if fi['applyGroup'] != group:
            group = fi['applyGroup']
            out += ['', '## ' + group, '']
        out += ['### `%s`' % fi['file'], '%s (%s), %d edit(s)' % (fi['component'], fi['kind'], len(fi['edits'])), '',
                '| Id | Line (after step 0) | Where | Property | Action | Now (after step 0) | Becomes | Token = value | Row | Why |',
                '|---|---|---|---|---|---|---|---|---|---|']
        for e in fi['edits']:
            a = e['action']
            n = (e.get('currentAfterStep0') or '').count('\n')
            ln = e.get('lineAfterStep0')
            line = '%s–%s' % (ln, ln + n) if n else str(ln)
            if a == 'insert':
                line = 'after %d' % (ln + n)
            now = e.get('currentAfterStep0') if a != 'token-step' else e.get('current')
            become = e.get('target')
            if a == 'delete':
                become = '(delete these lines)'
            if a == 'manual':
                become = 'MANUAL: ' + e.get('instruction', '')
            if a == 'skip':
                become = 'SKIP: ' + e.get('skipReason', '')
            if e.get('replaceAll'):
                become = '%s (all %d on the line)' % (become, e.get('expectedCount', 0))
            tok = '`%s` = %s' % (e['targetToken'], cell(e.get('targetValue'), 60)) if e.get('targetToken') else cell(e.get('targetValue'), 60)
            flags = []
            if e.get('doneByStep0'):
                flags.append('**done by step 0**')
            if e.get('needsOwner'):
                flags.append('**owner**')
            if e.get('confidence') == 'inferred':
                flags.append('_inferred_')
            if e.get('visual') is False:
                flags.append('(same value)')
            out.append('| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s %s |' % (
                e['id'], line, code(e.get('selector'), 70), cell(e.get('property'), 40), a, code(now),
                code(become, 220) if a not in ('manual', 'skip') else cell(become, 400), tok, cell(e.get('changeId'), 30),
                ' '.join(flags), cell(e.get('reason'), 300)))
        out.append('')
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out).rstrip() + '\n')
    print('wrote', OUT)


if __name__ == '__main__':
    main()
