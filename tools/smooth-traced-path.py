"""Rebuild a bitmap-traced Lottie path as a smooth Bézier outline.

Some shapes in the hand-off files were auto-traced from a raster: hundreds of vertices on a
half-pixel grid stepping by 1 unit, which shows as jagged "stairs" once the layer is scaled up
(in lottie-web and in the GSAP versions alike). This resamples the closed outline densely,
smooths it along its length (Gaussian, `sigma` units of arc length — removes the 1-unit steps,
keeps the designed radii) and fits it with the fewest cubic Béziers that stay within `tol`
units of the smoothed outline (Schneider's algorithm, "An Algorithm for Automatically Fitting
Digitized Curves", Graphics Gems 1990).

usage:
  python3 tools/smooth-traced-path.py in.json out.json "<layer name>" [sigma=2.5] [tol=0.25]
  python3 tools/smooth-traced-path.py --report file.json        # list paths that look traced
"""
import json, math, sys


# ---------- geometry helpers ----------
def bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
            u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1])


def outline_points(shape, step=0.25):
    """Flatten a closed Lottie shape {v,i,o} into points every ~step units."""
    v, ii, oo = shape['v'], shape['i'], shape['o']
    n, pts = len(v), []
    for k in range(n):
        a, b = k, (k + 1) % n
        p0 = v[a]; p3 = v[b]
        p1 = (p0[0] + oo[a][0], p0[1] + oo[a][1]); p2 = (p3[0] + ii[b][0], p3[1] + ii[b][1])
        L = sum(math.dist(bez(p0, p1, p2, p3, j / 8), bez(p0, p1, p2, p3, (j + 1) / 8)) for j in range(8))
        m = max(1, int(L / step))
        for j in range(m):
            pts.append(bez(p0, p1, p2, p3, j / m))
    return pts


def resample(pts, step):
    """Closed polyline → points evenly spaced by arc length."""
    seg = [math.dist(pts[k], pts[(k + 1) % len(pts)]) for k in range(len(pts))]
    total = sum(seg); n = max(8, int(total / step)); step = total / n
    out, k, acc, pos = [], 0, 0.0, 0.0
    for j in range(n):
        target = j * step
        while acc + seg[k] < target:
            acc += seg[k]; k += 1
        t = (target - acc) / seg[k] if seg[k] else 0
        a, b = pts[k], pts[(k + 1) % len(pts)]
        out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out, step


def smooth(pts, sigma_pts):
    r = int(3 * sigma_pts) + 1
    w = [math.exp(-(d * d) / (2 * sigma_pts * sigma_pts)) for d in range(-r, r + 1)]
    sw, n = sum(w), len(pts)
    return [(sum(w[d + r] * pts[(k + d) % n][0] for d in range(-r, r + 1)) / sw,
             sum(w[d + r] * pts[(k + d) % n][1] for d in range(-r, r + 1)) / sw) for k in range(n)]


# ---------- Schneider curve fitting ----------
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def add(a, b): return (a[0] + b[0], a[1] + b[1])
def mul(a, s): return (a[0] * s, a[1] * s)
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def norm(a):
    l = math.hypot(*a); return (a[0] / l, a[1] / l) if l else (0.0, 0.0)


def chord_params(d):
    u = [0.0]
    for k in range(1, len(d)): u.append(u[-1] + math.dist(d[k], d[k - 1]))
    return [x / u[-1] for x in u] if u[-1] else u


def gen_bezier(d, u, t1, t2):
    p0, p3 = d[0], d[-1]
    C = [[0, 0], [0, 0]]; X = [0, 0]
    for k, t in enumerate(u):
        a1 = mul(t1, 3 * (1 - t) ** 2 * t); a2 = mul(t2, 3 * (1 - t) * t * t)
        C[0][0] += dot(a1, a1); C[0][1] += dot(a1, a2); C[1][1] += dot(a2, a2)
        tmp = sub(d[k], bez(p0, p0, p3, p3, t))
        X[0] += dot(a1, tmp); X[1] += dot(a2, tmp)
    C[1][0] = C[0][1]
    det = C[0][0] * C[1][1] - C[1][0] * C[0][1]
    seg = math.dist(p0, p3)
    if abs(det) > 1e-12:
        al = (X[0] * C[1][1] - X[1] * C[0][1]) / det
        ar = (C[0][0] * X[1] - C[1][0] * X[0]) / det
    else:
        al = ar = seg / 3
    if al < 1e-6 * seg or ar < 1e-6 * seg:
        al = ar = seg / 3
    return [p0, add(p0, mul(t1, al)), add(p3, mul(t2, ar)), p3]


def max_err(d, b, u):
    worst, split = 0.0, len(d) // 2
    for k, t in enumerate(u):
        e = math.dist(bez(*b, t), d[k])
        if e > worst: worst, split = e, k
    return worst, split


def newton(b, p, t):
    d1 = [mul(sub(b[k + 1], b[k]), 3) for k in range(3)]
    d2 = [mul(sub(d1[k + 1], d1[k]), 2) for k in range(2)]
    q = bez(*b, t)
    q1 = add(add(mul(d1[0], (1 - t) ** 2), mul(d1[1], 2 * (1 - t) * t)), mul(d1[2], t * t))
    q2 = add(mul(d2[0], 1 - t), mul(d2[1], t))
    num = dot(sub(q, p), q1); den = dot(q1, q1) + dot(sub(q, p), q2)
    return t - num / den if den else t


def fit(d, t1, t2, tol, out):
    if len(d) == 2:
        dist = math.dist(d[0], d[1]) / 3
        out.append([d[0], add(d[0], mul(t1, dist)), add(d[1], mul(t2, dist)), d[1]]); return
    u = chord_params(d)
    b = gen_bezier(d, u, t1, t2)
    err, split = max_err(d, b, u)
    if err < tol:
        out.append(b); return
    if err < tol * 4:
        for _ in range(20):
            u = [newton(b, d[k], t) for k, t in enumerate(u)]
            b = gen_bezier(d, u, t1, t2)
            err, split = max_err(d, b, u)
            if err < tol:
                out.append(b); return
    split = min(max(split, 1), len(d) - 2)
    tc = norm(sub(d[split - 1], d[split + 1]))
    fit(d[:split + 1], t1, tc, tol, out)
    fit(d[split:], mul(tc, -1), t2, tol, out)


def fit_closed(pts, tol):
    """Fit a closed smooth outline: split into 4 runs at evenly spaced points (all smooth joins)."""
    n, runs, out = len(pts), 4, []
    idx = [k * n // runs for k in range(runs)] + [n]
    def tangent(k): return norm(sub(pts[(k + 1) % n], pts[(k - 1) % n]))
    for r in range(runs):
        a, b = idx[r], idx[r + 1]
        seg = [pts[k % n] for k in range(a, b + 1)]
        fit(seg, tangent(a), mul(tangent(b % n), -1), tol, out)
    return out


def to_lottie(beziers):
    v, ii, oo = [], [], []
    for b in beziers:
        v.append([round(b[0][0], 3), round(b[0][1], 3)])
        oo.append([round(b[1][0] - b[0][0], 3), round(b[1][1] - b[0][1], 3)])
        ii.append(None)
    for k, b in enumerate(beziers):
        ii[(k + 1) % len(beziers)] = [round(b[2][0] - b[3][0], 3), round(b[2][1] - b[3][1], 3)]
    return {'c': True, 'v': v, 'i': ii, 'o': oo}


def rebuild(shape, sigma=2.5, tol=0.25):
    pts, step = resample(outline_points(shape), 0.5)
    pts = smooth(pts, sigma / step)
    pts, _ = resample(pts, 1.0)
    return to_lottie(fit_closed(pts, tol))


# ---------- JSON plumbing ----------
def shapes_in(items):
    for it in items:
        if it.get('ty') == 'gr':
            yield from shapes_in(it['it'])
        elif it.get('ty') == 'sh':
            yield it


def looks_traced(k):
    v = k['v']
    if len(v) < 40: return False
    halfgrid = sum(1 for x, y in v if abs((x * 2) % 1) < 0.02 or abs((y * 2) % 1) < 0.02) / len(v)
    tiny = sum(1 for k2 in range(len(v)) if math.dist(v[k2], v[(k2 + 1) % len(v)]) < 2.5) / len(v)
    return halfgrid > 0.6 and tiny > 0.5


def all_layers(d):
    yield from d['layers']
    for a in d.get('assets', []):
        yield from a.get('layers', [])


if __name__ == '__main__':
    if sys.argv[1] == '--report':
        for f in sys.argv[2:]:
            d = json.load(open(f))
            for l in all_layers(d):
                for sh in shapes_in(l.get('shapes', [])):
                    k = sh['ks']['k']
                    if isinstance(k, dict) and looks_traced(k):
                        print('%s: layer "%s" — %d vertices, looks bitmap-traced' % (f, l['nm'], len(k['v'])))
        sys.exit()
    src, dst, name = sys.argv[1], sys.argv[2], sys.argv[3]
    sigma = float(sys.argv[4]) if len(sys.argv) > 4 else 2.5
    tol = float(sys.argv[5]) if len(sys.argv) > 5 else 0.25
    d = json.load(open(src))
    done = 0
    for l in all_layers(d):
        if l['nm'] != name: continue
        for sh in shapes_in(l.get('shapes', [])):
            k = sh['ks']['k']
            if isinstance(k, dict) and looks_traced(k):
                new = rebuild(k, sigma, tol)
                print('layer "%s": %d traced vertices -> %d smooth curves' % (name, len(k['v']), len(new['v'])))
                sh['ks']['k'] = new; done += 1
    json.dump(d, open(dst, 'w'), separators=(',', ':'), ensure_ascii=False)
    print(dst, done, 'path(s) rebuilt')
