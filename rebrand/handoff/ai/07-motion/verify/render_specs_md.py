import json, re, sys
from collections import defaultdict, Counter
import os
H=os.environ.get('H') or os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))   # the package folder ($H)
d=json.load(open(H+'/07-motion/specs.json'))
motions=d['motions']; cnt=Counter(m['status'] for m in motions)
def group_of(m):
    f = (m['productionTarget'] or {}).get('file') or ''
    f = f.split('→')[-1].strip().split(' ')[0]
    if not f: return 'No production counterpart'
    mm = re.match(r'src/(pages|components/ui|features|motion|components)/([^/]+(?:/[^/]+)?)', f)
    if not mm: return f
    seg = mm.group(2)
    if mm.group(1) == 'pages': seg = '/'.join(seg.split('/')[:2])
    else: seg = seg.split('/')[0]
    return f'src/{mm.group(1)}/{seg}'
groups = defaultdict(list)
for m in motions: groups[group_of(m)].append(m)
def fmt(v):
    if v is None: return '—'
    if isinstance(v, (dict, list)): return json.dumps(v, ensure_ascii=False)
    return str(v)
L = ['# PeraSure motion specs — by production page / component', '',
     'Generated from `specs.json` (the source of truth) by `07-motion/verify/render_specs_md.py`. One section per production page or component; each motion lists its target, trigger, timeline, interruption / exit, reduced motion, code (line numbers in the tree after `07-motion/motion.patch`, before step 8), reference take, status and notes; partial motions also say what remains and how to finish.', '',
     'Counts: ' + ', '.join('%s %d' % (k, cnt[k]) for k in ('done', 'partial', 'n.a.')) + ' (of %d). Status: done = ported 1:1; partial = see reason / remaining; n.a. = no production counterpart.' % len(motions), '', '## Contents', '']
order = sorted(groups, key=lambda g: (g == 'No production counterpart', g))
for g in order: L.append(f'- [{g}](#{re.sub(r"[^a-z0-9 -]", "", g.lower()).replace(" ", "-")}) — {len(groups[g])}')
L.append('')
for g in order:
    L += [f'## {g}', '']
    for m in sorted(groups[g], key=lambda x: x['motionId']):
        pt = m['productionTarget'] or {}
        L.append(f"### {m['motionId']} — {m['name']} · **{m['status']}**")
        L.append('')
        L.append(f"- Area: {m['area']} · demo: {m.get('demoComponent') or '—'}")
        L.append(f"- Target: `{pt.get('file') or '—'}` — {pt.get('component') or '—'} — {pt.get('element') or '—'}")
        L.append(f"- Trigger: {fmt(m['trigger'])}")
        if m['timeline']:
            L.append('- Timeline:')
            for e in m['timeline']:
                parts = [f"{e.get('property')}"]
                if 'from' in e or 'to' in e: parts.append(f"{fmt(e.get('from'))} → {fmt(e.get('to'))}{(' ' + e['unit']) if e.get('unit') else ''}")
                for k in ('transition', 'delay', 'window', 'note'):
                    if e.get(k): parts.append(f"{k}: {fmt(e[k])}")
                L.append('  - ' + ' · '.join(parts))
        if m.get('delayStagger'): L.append(f"- Delay / stagger: {fmt(m['delayStagger'])}")
        if m.get('layout'): L.append(f"- Layout: {fmt(m['layout'])}")
        for k, lab in (('interruption', 'Interruption'), ('exit', 'Exit'), ('reducedMotion', 'Reduced motion')):
            if m.get(k): L.append(f"- {lab}: {fmt(m[k])}")
        if m['codeRefs']:
            L.append('- Code: ' + ', '.join(f"`{r['file']}{(':' + r['lines']) if r.get('lines') else ''}`" + (f" ({r['note']})" if r.get('note') else '') for r in m['codeRefs'] if r.get('file')))
        rc = m.get('referenceCurve')
        if rc:
            L.append(f"- Reference: `{rc['curves']}`" + (f", strip `{rc['strip']}`" if rc.get('strip') else '') + (f", video `{rc['video']}`" if rc.get('video') else '') + (f" — {rc['status']}" if rc.get('status') else ''))
            for v in rc.get('variants') or []:
                if isinstance(v, dict) and v.get('what'): L.append(f"  - Variant `{v['curves']}`: {v['what']}")
        if m.get('reason'): L.append(f"- Status reason: {m['reason']}")
        if m.get('remaining'):
            L.append('- Remaining: ' + ('; '.join(m['remaining']) if isinstance(m['remaining'], list) else fmt(m['remaining'])))
        if m.get('migrationHowTo'): L.append(f"- How to finish: {m['migrationHowTo']}")
        for x in m.get('deviations') or []: L.append(f"- Deviation: {x}")
        for x in m.get('decisionNotes') or []: L.append(f"- Decision: {x}")
        L.append('')
open(H+'/07-motion/specs.md', 'w').write('\n'.join(L))
print('groups', len(groups), 'motions', len(motions))
