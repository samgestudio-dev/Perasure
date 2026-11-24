#!/usr/bin/env python3
"""Compare production takes (rec-prod.mjs) with the demo reference curves (../reference/curves).

usage: python3 cmp.py PROD_DIR[,PROD_DIR2,...] [ids...]   PROD_DIR = the --out of rec-prod.mjs (its curves/ is read);
       several comma-separated takes of the same build are merged (median of each metric), which removes the
       one-frame phase jitter of a single take (recommended: 3 takes)
       python3 cmp.py PROD_DIR --json OUT.json  also write the table as JSON
Exit code 1 if a judged value is out of tolerance.

Per property it reads both curves, aligns them (PAIRS[id]['align']), and compares where the value starts
moving, the times it passes 10 / 50 / 90 % of its change, the end value and the overshoot (springs).
Tolerances (README "Verify against the reference"): timing +-17 ms (one frame at 60 Hz) for the interpolated
10 / 50 / 90 % crossings, +-34 ms for 'start' (the first sample that moved: quantised to a frame on both sides), opacity +-0.02,
position +-2 px, scale +-0.005 (+-0.01 below 0.95), blur +-0.3 px, overshoot +-2 % of the change.
The first value is judged only when both curves rest before they move (otherwise the first visible frame
lands at a random phase of the animation and is shown as information). A crossing that falls inside a gap of either curve (no sample for > 34 ms, i.e. a dropped frame in the
recording) cannot be timed: it is shown as 'gap' and not judged. Settle time is shown for information only
(it is 'last change > 0.2 %', which a single late sample moves).
Python 3.8+, standard library only.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, '..', 'reference', 'curves')
FRAME = 17.0
GAP = 34.0

# id -> how to align and which (reference key, production key) pairs to compare.
# props: (reference key, production key[, {'until': ms, 'geometry': True}]); geometry = end values depend on
# content (not judged). align: 'trigger' = t=0 of both takes (same trigger); 'appear:K' = first sample where K exists (> 0 for counts)
# in each take, i.e. the element mounts; 'change:K' = first sample where K has moved 1 % of its change.
# M-008: the page boxes change index when the leaving page is removed, so follow each page through the
# indices. n = the number of boxes while both pages exist (demo 2; production 3: + the Home tab container).
def _pages(d, n, entering):
    c = d.get('constants', {})
    g = lambda s, k: s.get(k, c.get(k))
    pts, both = [], False
    for s in d['samples']:
        cnt = g(s, 'page.count') or 0
        if cnt >= n:
            both = True
            v = g(s, 'page[%d].opacity' % (n - 1)) if entering else g(s, 'page[0].opacity')
        elif both and entering:
            v = g(s, 'page[0].opacity')
        else:
            v = None
        if isinstance(v, (int, float)):
            pts.append((s['t'], float(v)))
    return pts


LEAVING_REF = lambda d: _pages(d, 2, False)
LEAVING_PROD = lambda d: _pages(d, 3, False)
ENTERING_REF = lambda d: _pages(d, 2, True)
ENTERING_PROD = lambda d: _pages(d, 3, True)

PAIRS = {
    # a sheet's travel is its own height: production's Log Out sheet is taller than the demo's, so the y
    # end points are information (geometry: content), the spring timing is judged
    'M-013': {'align': 'trigger', 'props': [('sheet.ty', 'sheet.ty', {'geometry': True}), ('scrim.opacity', 'scrim.opacity')]},
    'M-013_close': {'align': 'trigger', 'props': [('sheet.ty', 'sheet.ty', {'geometry': True}), ('scrim.opacity', 'scrim.opacity')]},
    # the two older toasts were shown by the setup; only the first 340 ms are the stack move
    'M-016': {'align': 'trigger', 'until': 340, 'props': [
        ('toast[2].opacity', 'toast[2].opacity'), ('toast[2].ty', 'toast[2].ty'),
        ('toast[1].ty', 'toast[1].ty'), ('toast[0].ty', 'toast[0].ty'), ('toast[0].opacity', 'toast[0].opacity')]},
    # the page boxes change index while the old one is removed: follow the leaving and the entering page
    # through the indices (production has one more [data-page-present] box, the Home tab container)
    'M-008': {'align': 'trigger', 'props': [
        ('leaving page opacity', LEAVING_REF, LEAVING_PROD), ('entering page opacity', ENTERING_REF, ENTERING_PROD)]},
    'M-037': {'align': 'trigger', 'props': [('pop.opacity', 'pop.opacity'), ('pop.sx', 'pop.sx'), ('pop.sy', 'pop.sy'), ('pop.blur', 'pop.blur')]},
    # the keypad mounts when the withdraw route has its data (/card/list): the cascade is timed from that mount
    'M-099': {'align': 'appear:key.count', 'props': [
        ('key[0].opacity', 'key[0].opacity'), ('key[0].ty', 'key[0].ty'), ('key[0].sy', 'key[0].sy'),
        ('key[5].opacity', 'key[5].opacity'), ('key[11].opacity', 'key[11].opacity'), ('key[11].ty', 'key[11].ty')]},
    'M-099_via': {'ref': 'M-099', 'align': 'appear:key.count', 'props': [
        ('key[0].opacity', 'key[0].opacity'), ('key[11].opacity', 'key[11].opacity')]},
    # the order card morph is timed from its start; the moving surface is removed when the morph ends
    # (~600 ms) and its end height is production's card (content), so the height end points are information
    'M-107': {'align': 'change:card.h', 'props': [
        ('card.h', 'card.h', {'until': 560, 'geometry': True}), ('slider.opacity', 'slider.opacity'),
        ('divider.opacity', 'divider.opacity'), ('term.opacity', 'term.opacity')]},
}


def load(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def series(d, key):
    if callable(key):
        return key(d)
    pts = []
    for s in d['samples']:
        v = s.get(key, d.get('constants', {}).get(key))
        if isinstance(v, (int, float)) and not isinstance(v, bool):
            pts.append((s['t'], float(v)))
    return pts


def align_t(d, how):
    if how == 'trigger':
        return 0.0
    kind, key = how.split(':', 1)
    pts = series(d, key)
    if kind == 'appear':
        for t, v in pts:
            if (key.endswith('.count') and v > 0) or (not key.endswith('.count')):
                return t
    if kind == 'change' and pts:
        v0, v1 = pts[0][1], pts[-1][1]
        for t, v in pts:
            if abs(v - v0) > abs(v1 - v0) * 0.01:
                return t
    raise SystemExit('cannot align on %s' % how)


def stats(pts, until=None):
    if until is not None:
        pts = [p for p in pts if p[0] <= until]
    pts = [p for p in pts if p[0] >= -1]
    if len(pts) < 2:
        return None
    v0, v1 = pts[0][1], pts[-1][1]
    dv = v1 - v0
    out = {'v0': v0, 'v1': v1}
    if abs(dv) < 1e-9:
        out['flat'] = True
        return out

    def cross(f):
        tgt = v0 + dv * f
        for (ta, a), (tb, b) in zip(pts, pts[1:]):
            if a != b and (a - tgt) * (b - tgt) <= 0 and (b - a) * dv > 0:
                t = ta + (tgt - a) / (b - a) * (tb - ta)
                return (t, tb - ta > GAP)
        return (None, False)
    out['start'] = next((t for t, v in pts if abs(v - v0) > abs(dv) * 0.01), None)
    # the first sample is a resting value only if the next one has the same value (it rested a frame)
    out['rest0'] = len(pts) > 1 and abs(pts[1][1] - v0) <= abs(dv) * 0.001
    for f in (0.1, 0.5, 0.9):
        out['t%d' % int(f * 100)], out['gap%d' % int(f * 100)] = cross(f)
    last = pts[0][0]
    for (ta, a), (tb, b) in zip(pts, pts[1:]):
        if abs(b - a) > abs(dv) * 0.002:
            last = tb
    out['settle'] = last
    ext = max(v for t, v in pts) if dv > 0 else min(v for t, v in pts)
    out['over'] = (ext - v1) / abs(dv) * 100 * (1 if dv > 0 else -1)
    return out


def vtol(key, v):
    k = 'opacity' if 'opacity' in key else key.split('.')[-1]
    if k == 'opacity':
        return 0.02
    if k in ('sx', 'sy'):
        return 0.01 if v < 0.95 else 0.005
    if k == 'blur':
        return 0.3
    return 2.0


def median(xs):
    xs = sorted(x for x in xs if x is not None)
    if not xs:
        return None
    n = len(xs)
    return xs[n // 2] if n % 2 else (xs[n // 2 - 1] + xs[n // 2]) / 2


def merge(all_stats):
    """Median of each metric over several takes (frame-phase jitter); a gap in any take marks the crossing."""
    all_stats = [x for x in all_stats if x]
    if not all_stats:
        return None
    if len(all_stats) == 1:
        return all_stats[0]
    if any(x.get('flat') for x in all_stats) and not all(x.get('flat') for x in all_stats):
        all_stats = [x for x in all_stats if not x.get('flat')]
    out = {}
    for k in all_stats[0]:
        vals = [x.get(k) for x in all_stats]
        if k.startswith('gap') or k in ('flat', 'rest0'):
            out[k] = any(vals) if k.startswith('gap') else all(vals)
        else:
            out[k] = median(vals)
    out['takes'] = len(all_stats)
    return out


def compare(pid, prod_dirs):
    cfg = PAIRS[pid]
    r = load(os.path.join(REF, cfg.get('ref', pid) + '.json'))
    takes = [load(os.path.join(dp, 'curves', pid + '.json')) for dp in prod_dirs if os.path.exists(os.path.join(dp, 'curves', pid + '.json'))]
    ar = align_t(r, cfg['align'])
    aps = [align_t(p, cfg['align']) for p in takes]
    ap = median(aps)
    rows = []
    for prop in cfg['props']:
        if callable(prop[1]):
            label, rk, pk = prop[0], prop[1], prop[2]
            po = prop[3] if len(prop) > 3 else {}
        else:
            rk, pk = prop[0], prop[1]
            label = rk if rk == pk else '%s / %s' % (rk, pk)
            po = prop[2] if len(prop) > 2 else {}
        until = po.get('until', cfg.get('until'))
        rs = stats([(t - ar, v) for t, v in series(r, rk)], until)
        ps = merge([stats([(t - a, v) for t, v in series(p, pk)], until) for p, a in zip(takes, aps)])
        row = {'id': pid, 'prop': label, 'align': cfg['align'],
               'alignRef': round(ar, 1), 'alignProd': round(ap, 1), 'ref': rs, 'prod': ps, 'checks': [], 'ok': True}
        if not rs or not ps:
            row['ok'] = False
            row['checks'].append('missing curve')
            rows.append(row)
            continue
        for k in ('v0', 'v1'):
            d = ps[k] - rs[k]
            if k == 'v0' and not (rs.get('flat') or ps.get('flat')) and not (rs.get('rest0') and ps.get('rest0')):
                row['checks'].append('v0 %+.3g (first visible frame, info)' % d)
                continue
            if po.get('geometry'):
                row['checks'].append('%s %+.3g (geometry, info)' % (k, d))
                continue
            ok = abs(d) <= vtol(label, min(rs[k], ps[k]))
            row['checks'].append('%s %+.3g%s' % (k, d, '' if ok else ' FAIL'))
            row['ok'] &= ok
        if rs.get('flat') or ps.get('flat'):
            if rs.get('flat') != ps.get('flat'):
                row['ok'] = False
                row['checks'].append('one curve does not move FAIL')
            rows.append(row)
            continue
        for k in ('start', 't10', 't50', 't90'):
            a, b = rs.get(k), ps.get(k)
            g = rs.get('gap' + k[1:]) or ps.get('gap' + k[1:]) if k != 'start' else False
            if a is None or b is None:
                row['checks'].append('%s n/a' % k)
                continue
            d = b - a
            if g:
                row['checks'].append('%s %+.0f gap' % (k, d))
                continue
            ok = abs(d) <= (2 * FRAME if k == 'start' else FRAME)
            row['checks'].append('%s %+.0f%s' % (k, d, '' if ok else ' FAIL'))
            row['ok'] &= ok
        d = ps['over'] - rs['over']
        ok = abs(d) <= 2.0
        row['checks'].append('over %+.1f%%%s' % (d, '' if ok else ' FAIL'))
        row['ok'] &= ok
        row['checks'].append('settle %+.0f (info)' % (ps['settle'] - rs['settle']))
        rows.append(row)
    return rows


def fmt(s):
    if not s:
        return '-'
    if s.get('flat'):
        return 'flat %g' % s['v0']
    t = lambda x: '-' if x is None else '%.0f' % x
    return '%g->%g start %s t10/50/90 %s/%s/%s settle %s over %.1f%%' % (
        round(s['v0'], 3), round(s['v1'], 3), t(s['start']), t(s['t10']), t(s['t50']), t(s['t90']), t(s['settle']), s['over'])


def main():
    a = sys.argv[1:]
    if not a:
        raise SystemExit(__doc__)
    prods = a[0].split(',')
    out_json = None
    if '--json' in a:
        out_json = a[a.index('--json') + 1]
        a = a[:a.index('--json')] + a[a.index('--json') + 2:]
    ids = a[1:] or [i for i in PAIRS if any(os.path.exists(os.path.join(p, 'curves', i + '.json')) for p in prods)]
    allrows, bad = [], 0
    for pid in ids:
        rows = compare(pid, prods)
        allrows += rows
        for row in rows:
            bad += not row['ok']
            al = '' if row['align'] == 'trigger' else ' [aligned %s: ref %+.0f ms, prod %+.0f ms after t0]' % (row['align'], row['alignRef'], row['alignProd'])
            print('%-11s %-34s %s%s' % (pid, row['prop'], 'OK  ' if row['ok'] else 'FAIL', al))
            print('    ref  %s\n    prod %s\n    diff %s' % (fmt(row['ref']), fmt(row['prod']), ', '.join(row['checks'])))
    if out_json:
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump(allrows, f, indent=1)
    print('%d of %d properties within tolerance' % (len(allrows) - bad, len(allrows)))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
