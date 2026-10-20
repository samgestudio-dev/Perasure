"""Turn lottie-style SVG <mask> stacks into plain <clipPath>s, in place.

Companion to flatten-lottie-masks.py, for inline SVG (e.g. the GSAP modules generated from
Lottie, which copy lottie-web's mask markup). A mask built the lottie-web way is a luminance
<mask> whose children are applied in order:
    <path fill="#ffffff">                 add        (union)
    <path fill="#000000">                 subtract   (difference)
    <g mask="url(#id_n)">…</g>             intersect  (everything so far ∩ the alpha mask's path)
    <rect fill="#ffffff" width height>    full-frame start for a leading subtract/intersect
Nested <mask>s are painted by iOS Safari at the layer's pre-transform resolution, so they
look blurry when the art is scaled up. This computes the resulting shape exactly with Skia
PathOps, writes it as a <clipPath> with the same id, and points the masked element at it.
Masks that don't follow that pattern (animated paths, mattes, opacity, filters) are left alone.

usage: python3 tools/flatten-svg-masks.py file.js [more files…]     (needs: pip install skia-pathops)
"""
import re, sys
import pathops

NUM = r'-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?'


def parse_d(d):
    """Absolute M/L/C/Z path data (lottie-web output) → pathops.Path."""
    toks = re.findall(r'[MLCZmlcz]|' + NUM, d)
    p = pathops.Path(); pen = p.getPen()
    i, cmd, open_ = 0, None, False
    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            cmd = t; i += 1
            if cmd in 'Zz':
                pen.closePath(); open_ = False
            continue
        if cmd not in 'MLC':
            raise ValueError('unsupported path command %r' % cmd)
        n = {'M': 2, 'L': 2, 'C': 6}[cmd]
        v = [float(x) for x in toks[i:i + n]]; i += n
        if cmd == 'M':
            if open_: pen.endPath()
            pen.moveTo((v[0], v[1])); open_ = True; cmd = 'L'
        elif cmd == 'L':
            pen.lineTo((v[0], v[1]))
        else:
            pen.curveTo((v[0], v[1]), (v[2], v[3]), (v[4], v[5]))
    if open_:
        pen.closePath()   # a fill closes open subpaths implicitly
    return p


def to_d(path):
    f = lambda pt: '%s,%s' % (round(pt[0], 4), round(pt[1], 4))
    out = []
    for op, pts in path.segments:
        if op == 'moveTo': out.append('M' + f(pts[0]))
        elif op == 'lineTo': out.append('L' + f(pts[0]))
        elif op == 'curveTo': out.append('C' + ' '.join(f(p) for p in pts))
        elif op == 'qCurveTo':
            if len(pts) != 2: raise ValueError('multi-point quad')
            out.append('Q' + ' '.join(f(p) for p in pts))
        elif op in ('closePath', 'endPath'): out.append('Z')
    return ''.join(out)


TAG = re.compile(r'<(/?)(path|g|rect|mask)\b([^>]*?)(/?)>')


def attrs(s):
    return dict(re.findall(r'([\w:-]+)="([^"]*)"', s))


def evaluate(body, masks):
    """Evaluate the children of a lottie-style luminance mask → pathops.Path."""
    acc = pathops.Path()
    pos = 0
    while True:
        m = TAG.search(body, pos)
        if not m: break
        close, tag, a, selfclose = m.groups(); a = attrs(a)
        if close: raise ValueError('unexpected </%s>' % tag)
        if tag == 'path':
            end = body.find('</path>', m.end()) if not selfclose else m.end()
            pos = (end + 7) if not selfclose else m.end()
            fill = a.get('fill', '#ffffff').lower()
            p = parse_d(a['d'])
            if fill in ('#ffffff', '#fff', 'white'):
                acc = pathops.op(acc, p, pathops.PathOp.UNION)
            elif fill in ('#000000', '#000', 'black'):
                acc = pathops.op(acc, p, pathops.PathOp.DIFFERENCE)
            else:
                raise ValueError('fill %s' % fill)
        elif tag == 'rect':
            w, h = float(a.get('width', 0)), float(a.get('height', 0))
            x, y = float(a.get('x', 0)), float(a.get('y', 0))
            p = pathops.Path(); pen = p.getPen()
            pen.moveTo((x, y)); pen.lineTo((x + w, y)); pen.lineTo((x + w, y + h)); pen.lineTo((x, y + h)); pen.closePath()
            acc = pathops.op(acc, p, pathops.PathOp.UNION)
            pos = m.end() if selfclose else body.find('</rect>', m.end()) + 7
        elif tag == 'g':
            # find the matching </g>
            depth, j = 1, m.end()
            while depth:
                n = re.search(r'<(/?)g\b[^>]*?(/?)>', body[j:])
                if n.group(1): depth -= 1
                elif not n.group(2): depth += 1
                j += n.end()
            inner = body[m.end():j - 4]
            sub = evaluate(inner, masks)
            ref = re.match(r'url\(#([^)]+)\)', a.get('mask', ''))
            if not ref or a.keys() - {'mask'}:
                raise ValueError('group with %s' % a)
            sub = pathops.op(sub, masks[ref.group(1)], pathops.PathOp.INTERSECTION)
            acc = pathops.op(acc, sub, pathops.PathOp.UNION)
            pos = j
        else:
            raise ValueError('<%s> inside mask' % tag)
    return acc


def flatten(text):
    defs = {}
    for m in re.finditer(r'<mask\b([^>]*)>(.*?)</mask>', text, re.S):
        defs[attrs(m.group(1))['id']] = (m, attrs(m.group(1)))
    alpha = {}
    for mid, (m, a) in defs.items():
        if a.get('mask-type') == 'alpha':
            ps = re.findall(r'<path\b([^>]*?)/?>', m.group(2))
            if len(ps) == 1 and '<g' not in m.group(2):
                alpha[mid] = parse_d(attrs(ps[0])['d'])
    done, used_alpha = [], set()
    for mid, (m, a) in defs.items():
        if a.get('mask-type') == 'alpha' or set(a) != {'id'}:
            continue
        if text.count('mask="url(#%s)"' % mid) != 1:
            continue
        try:
            shape = evaluate(m.group(2), alpha)
        except (ValueError, KeyError) as e:
            print('  skip %s: %s' % (mid, e)); continue
        used_alpha |= set(re.findall(r'url\(#([^)]+)\)', m.group(2)))
        done.append((mid, m, to_d(shape)))
    for mid, m, d in done:
        text = text.replace(m.group(0), '<clipPath id="%s"><path d="%s"/></clipPath>' % (mid, d), 1)
        text = text.replace('mask="url(#%s)"' % mid, 'clip-path="url(#%s)"' % mid, 1)
    for aid in used_alpha:
        if 'url(#%s)' % aid not in text:
            text = re.sub(r'<mask\b[^>]*\bid="%s"[^>]*>.*?</mask>' % re.escape(aid), '', text, count=1, flags=re.S)
    return text, [mid for mid, _, _ in done]


if __name__ == '__main__':
    for f in sys.argv[1:]:
        src = open(f, encoding='utf-8').read()
        out, ids = flatten(src)
        if ids:
            open(f, 'w', encoding='utf-8').write(out)
        print('%s: %d mask(s) → clipPath %s; <mask> left: %d' % (f, len(ids), ids, out.count('<mask')))
