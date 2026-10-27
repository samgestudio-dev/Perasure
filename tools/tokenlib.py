"""Shared helpers for the token scripts: canonical JSON + hashes identical to tools/figma-tokens/core.js,
the digest used for incremental syncs, and the CSS naming rule (tokens/code-syntax-naming.md)."""
import json, re
from decimal import Decimal

BUCKETS = 32


def js_num(x):
    """Format a number exactly as JavaScript's JSON.stringify does."""
    if isinstance(x, bool):
        return 'true' if x else 'false'
    if isinstance(x, int):
        return str(x)
    if x != x or x in (float('inf'), float('-inf')):
        return 'null'
    if x == 0:
        return '0'
    t = Decimal(repr(x)).as_tuple()
    digits = ''.join(map(str, t.digits))
    s = digits.rstrip('0')
    e = t.exponent + (len(digits) - len(s))
    k, n = len(s), len(s) + e
    sign = '-' if t.sign else ''
    if k <= n <= 21:
        return sign + s + '0' * (n - k)
    if 0 < n <= 21:
        return sign + s[:n] + '.' + s[n:]
    if -6 < n <= 0:
        return sign + '0.' + '0' * (-n) + s
    ex = n - 1
    ex = ('+' if ex > 0 else '-') + str(abs(ex))
    return sign + (s if k == 1 else s[0] + '.' + s[1:]) + 'e' + ex


def canon(x):
    if x is None:
        return 'null'
    if isinstance(x, (bool, int, float)):
        return js_num(x)
    if isinstance(x, str):
        return json.dumps(x, ensure_ascii=False)
    if isinstance(x, list):
        return '[' + ','.join(canon(v) for v in x) + ']'
    return '{' + ','.join(json.dumps(k, ensure_ascii=False) + ':' + canon(x[k]) for k in sorted(x)) + '}'


def fnv(s):
    h = 0x811c9dc5
    b = s.encode('utf-16-le')
    for i in range(0, len(b), 2):
        h = ((h ^ (b[i] | b[i + 1] << 8)) * 0x01000193) & 0xffffffff
    return '%08x' % h


def bucket(item_id):
    return int(fnv(item_id), 16) % BUCKETS


def groups(snap):
    g = {'collections': [{k: c[k] for k in ('id', 'name', 'modes', 'defaultMode')} for c in snap['collections']]}
    for c in snap['collections']:
        g['v:' + c['id']] = c['variables']
    for k in ('text', 'effect', 'paint'):
        g['s:' + k] = snap['styles'][k]
    return g


def digest(snap):
    out = {}
    for k, items in groups(snap).items():
        b = [[] for _ in range(BUCKETS)]
        for it in items:
            b[bucket(it['id'])].append(it['id'] + '=' + fnv(canon(it)))
        bh = [fnv('|'.join(sorted(l)))[:6] if l else '' for l in b]
        out[k] = {'n': len(items), 'h': fnv(','.join(bh)), 'b': ','.join(bh)}
    return out


def to_code_syntax(path):
    """Token path -> CSS custom property name: every level in order, kebab-case, lowercase."""
    parts = []
    for seg in path.split('/'):
        seg = seg.strip()
        seg = re.sub(r'([a-z0-9])([A-Z])', r'\1-\2', seg)
        seg = re.sub(r'[\s_/]+', '-', seg)
        seg = re.sub(r'[^a-zA-Z0-9-]', '', seg)
        seg = re.sub(r'-+', '-', seg).strip('-').lower()
        if seg:
            parts.append(seg)
    return '--' + '-'.join(parts)


def natural(name):
    """Sort key: path levels in order, numbers by value (Color/Blue/50 before Color/Blue/100)."""
    return [[(0, int(t), '') if t.isdigit() else (1, 0, t.lower()) for t in re.split(r'(\d+)', seg) if t]
            for seg in name.split('/')]


def sort_snapshot(snap):
    """Stable, readable order for the snapshot file (the digest does not depend on order)."""
    for c in snap['collections']:
        c['variables'].sort(key=lambda v: natural(v['name']))
    for k in snap['styles']:
        snap['styles'][k].sort(key=lambda s: natural(s['name']))
    return snap
