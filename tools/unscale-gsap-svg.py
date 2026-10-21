"""Remove lottie2gsap's `scale(0.01)` wrappers from a GSAP module (iOS Safari glitch fix).

lottie2gsap writes each animated group as
    <g data-n="g19"><g transform="scale(0.01)"> …shape… </g></g>
and animates the outer group with Lottie's percent scales (scaleX: 100 = 1×). The shape is drawn
at 1/100 size and enlarged 100×; when such groups nest (a dot inside a "drift" group inside the
art group) WebKit rasterises the tiny geometry and the result flickers / glitches on iOS Safari
(Chrome draws it fine). This unwraps every `scale(0.01)` group and divides that element's scaleX /
scaleY values (gsap.set, tl.to and track() channels) by 100, so every transform is ~1×.
Pixel-identical in Chrome.

usage: python3 tools/unscale-gsap-svg.py animations/<slug>/gsap/<module>.js [more.js …]   (in place)
"""
import re, sys

WRAP = '<g transform="scale(0.01)">'


def unwrap(s):
    ids = {}
    while True:
        m = re.search(r'<g data-n="([^"]+)">' + re.escape(WRAP), s)
        if not m:
            return s, ids
        start, i, depth = m.end() - len(WRAP), m.end(), 1
        while depth:
            o, c = s.find('<g', i), s.find('</g>', i)
            if o != -1 and o < c and s[o + 2] in ' >':
                depth, i = depth + 1, o + 2
            else:
                depth, i = depth - 1, c + 4
        close = i - 4
        s = s[:start] + s[m.end():close] + s[close + 4:]
        ids[m.group(1)] = ids.get(m.group(1), 0) + 1


def num(v, k):
    r = round(float(v) / 100 ** k, 8)
    return ('%.8f' % r).rstrip('0').rstrip('.') if r != int(r) else str(int(r))


def rescale_line(line, k):
    line = re.sub(r'(scale[XY]: )(-?\d+\.?\d*(?:e-?\d+)?)', lambda m: m.group(1) + num(m.group(2), k), line)

    def arr(m):
        vals = m.group(2).split(',')
        for j in range(1, len(vals), 3):
            vals[j] = num(vals[j], k)
        return m.group(1) + ','.join(vals) + ']'
    return re.sub(r'(scale[XY]: \[)([^\]]*)\]', arr, line)


def fix(path):
    s = open(path).read()
    s, ids = unwrap(s)
    if not ids:
        print(path, ': nothing to do'); return
    lines, n = s.split('\n'), 0
    for li, line in enumerate(lines):
        m = re.search(r'\$\("([^"]+)"\)', line)
        if m and m.group(1) in ids and 'scale' in line:
            lines[li] = rescale_line(line, 1); n += 1   # one id can tag several copies; each was unwrapped once
    open(path, 'w').write('\n'.join(lines))
    print('%s: unwrapped %d group(s), rescaled %d line(s)' % (path, sum(ids.values()), n))


if __name__ == '__main__':
    for p in sys.argv[1:]:
        fix(p)
