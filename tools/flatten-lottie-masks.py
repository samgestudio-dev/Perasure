"""Flatten static Lottie mask stacks (add + intersect / subtract / add) into plain 'add' masks.

lottie-web (SVG renderer) turns a layer whose masks are all mode 'a' into one <clipPath>, which
every browser rasterises at screen resolution. Any 'i'/'s' mask makes it build nested <mask>
elements instead, which Safari paints at the layer's own (pre-transform) resolution, so those
edges go soft when the art is scaled up (these files draw in Figma units and scale 10x).
The boolean result is computed exactly with Skia PathOps and written back as one 'a' mask per
contour. Only masks that are static, opaque, not inverted and not expanded are touched.

usage: python3 flatten_masks.py in.json out.json
"""
import json, sys
import pathops


def to_path(shape):
    v, i, o, closed = shape['v'], shape['i'], shape['o'], shape['c']
    p = pathops.Path()
    pen = p.getPen()
    n = len(v)
    pen.moveTo(tuple(v[0]))
    segs = n if closed else n - 1
    for k in range(segs):
        a, b = k, (k + 1) % n
        c1 = (v[a][0] + o[a][0], v[a][1] + o[a][1])
        c2 = (v[b][0] + i[b][0], v[b][1] + i[b][1])
        pen.curveTo(c1, c2, tuple(v[b]))
    if closed:
        pen.closePath()
    else:
        pen.endPath()
    return p


def contours(path):
    """Split a pathops Path into Lottie shapes (all cubic, closed)."""
    out, cur = [], None

    def start(pt):
        return {'v': [list(pt)], 'i': [[0, 0]], 'o': [[0, 0]]}

    last = None
    for op, pts in path.segments:
        if op == 'moveTo':
            cur = start(pts[0]); last = pts[0]
        elif op == 'lineTo':
            p = pts[0]
            cur['v'].append(list(p)); cur['i'].append([0, 0]); cur['o'].append([0, 0]); last = p
        elif op == 'curveTo':
            c1, c2, p = pts
            cur['o'][-1] = [c1[0] - last[0], c1[1] - last[1]]
            cur['v'].append(list(p)); cur['i'].append([c2[0] - p[0], c2[1] - p[1]]); cur['o'].append([0, 0]); last = p
        elif op == 'qCurveTo':
            # TrueType-style run of off-curve points ending in an on-curve point
            offs, end = list(pts[:-1]), pts[-1]
            ons = []
            for k in range(len(offs) - 1):
                ons.append(((offs[k][0] + offs[k + 1][0]) / 2, (offs[k][1] + offs[k + 1][1]) / 2))
            ons.append(end)
            for q, p in zip(offs, ons):
                c1 = (last[0] + 2 / 3 * (q[0] - last[0]), last[1] + 2 / 3 * (q[1] - last[1]))
                c2 = (p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1]))
                cur['o'][-1] = [c1[0] - last[0], c1[1] - last[1]]
                cur['v'].append(list(p)); cur['i'].append([c2[0] - p[0], c2[1] - p[1]]); cur['o'].append([0, 0]); last = p
        elif op in ('closePath', 'endPath'):
            v = cur['v']
            if len(v) > 1 and abs(v[-1][0] - v[0][0]) < 1e-6 and abs(v[-1][1] - v[0][1]) < 1e-6:
                cur['i'][0] = cur['i'][-1]
                cur['o'][-2] = cur['o'][-2]
                for key in ('v', 'i', 'o'):
                    cur[key].pop()
            cur['c'] = True
            r = lambda a: [[round(x, 4) for x in pt] for pt in a]
            out.append({'i': r(cur['i']), 'o': r(cur['o']), 'v': r(cur['v']), 'c': True})
            cur = None
    return out


OPS = {'a': pathops.PathOp.UNION, 'i': pathops.PathOp.INTERSECTION, 's': pathops.PathOp.DIFFERENCE}


def flatten_layer(layer):
    ms = layer.get('masksProperties') or []
    if len(ms) < 2 or all(m['mode'] == 'a' for m in ms):
        return False
    for m in ms:
        if m['mode'] not in OPS or m.get('inv') or m['pt'].get('a') or m['o'].get('a') or m['o'].get('k') != 100 \
                or (m.get('x') and (m['x'].get('a') or m['x'].get('k'))):
            print('  skip', layer.get('nm'), '(animated / inverted / expanded / translucent mask)')
            return False
    acc = to_path(ms[0]['pt']['k'])
    if ms[0]['mode'] != 'a':
        return False
    for m in ms[1:]:
        acc = pathops.op(acc, to_path(m['pt']['k']), OPS[m['mode']])
    shapes = contours(acc)
    base = {k: v for k, v in ms[0].items() if k not in ('pt', 'mode', 'nm')}
    layer['masksProperties'] = [dict(base, mode='a', inv=False, nm='merged %d' % (n + 1), pt={'a': 0, 'k': s})
                                for n, s in enumerate(shapes)]
    print('  %s: %s -> %d add mask(s)' % (layer.get('nm'), ''.join(m['mode'] for m in ms), len(shapes)))
    return True


def main(src, dst):
    d = json.load(open(src))
    layers = list(d['layers']) + [l for a in d.get('assets', []) for l in a.get('layers', [])]
    n = sum(flatten_layer(l) for l in layers)
    json.dump(d, open(dst, 'w'), separators=(',', ':'), ensure_ascii=False)
    print(src, '->', dst, n, 'layer(s) flattened')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
