"""Build the PeraSure design tokens from the Figma snapshot.

    python3 tools/build-tokens.py

Reads  tokens/figma-export.json  (raw export of the Figma file's variables and styles)
Writes tokens/tokens.json        (W3C Design Tokens format: primitive / semantic / component, aliases kept)
       tokens/tokens.css         (CSS custom properties named from each token's path — see tokens/README.md,
                                  plus shadow / gradient variables and .ps-text-* type classes)

Nothing in the Playground loads these files; they are for prototypes and hand-off to reference.
To refresh: re-export the Figma variables into tokens/figma-export.json, then run this script.
"""
import json, math, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tokens', 'figma-export.json')
OUT_JSON = os.path.join(ROOT, 'tokens', 'tokens.json')
OUT_CSS = os.path.join(ROOT, 'tokens', 'tokens.css')

data = json.load(open(SRC, encoding='utf-8'))
cols = {c['name']: c['variables'] for c in data['collections']}
ORDER = ['Primitive', 'Semantic', 'Component']
by_name = {(c, v['name']): v for c in ORDER for v in cols[c]}

FONT_STACK = {  # generic fallbacks; Satoshi has no ₱, the app takes it from Inter (as assets/fonts/fonts.css does)
    'Inter': '"Inter", sans-serif',
    'Hanken Grotesk': '"Hanken Grotesk", sans-serif',
    'Satoshi': '"Satoshi", "Inter", sans-serif',
}


def hexcolor(c):
    h = '#%02x%02x%02x' % tuple(round(c[k] * 255) for k in 'rgb')
    a = c.get('a', 1)
    return h if a >= 0.9999 else h + '%02x' % round(a * 255)


def css_color(c):
    a = c.get('a', 1)
    if a >= 0.9999:
        return hexcolor(c)
    r, g, b = (round(c[k] * 255) for k in 'rgb')
    return 'rgb(%d %d %d / %s)' % (r, g, b, ('%.4f' % a).rstrip('0').rstrip('.'))


def num(x):
    return ('%.4f' % x).rstrip('0').rstrip('.')


def kind(name, vtype):
    """What a FLOAT / STRING variable means, from its path."""
    top = name.split('/')
    if vtype == 'COLOR':
        return 'color'
    if vtype == 'STRING':
        return 'fontFamily'
    if top[0] == 'Font' and top[1] == 'Weight':
        return 'fontWeight'
    if top[0].lower() == 'layer opacity':
        return 'opacity'
    return 'dimension'  # spacing, radius, blur, stroke width, font size, line height (px)


# ---- CSS names: generated from the token path (Token Code Syntax naming spec) ---------------------
# Every level of the path, in order, kebab-case, lowercase; collection and mode are left out; Default is kept.
# The code syntax stored in Figma is not trusted: when it differs from the standard name it is reported, not used.
def to_code_syntax(path):
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


css_name, mismatched, owner, shared = {}, [], {}, set()
for c in ORDER:
    for v in cols[c]:
        name = to_code_syntax(v['name'])
        css_name[(c, v['name'])] = name
        existing = (v.get('codeSyntax') or {}).get('WEB')
        if existing != 'var(%s)' % name:
            mismatched.append((c, v['name'], existing, 'var(%s)' % name))
        if name in owner:
            oc, on = owner[name]
            val = v['value']
            # Semantic Color/Neutral/* repeat the primitive of the same path: one CSS variable serves both
            if isinstance(val, dict) and val.get('alias') == on and val.get('collection') == oc:
                shared.add((c, v['name']))
                continue
            raise SystemExit('CSS name clash: %s (%s %s / %s %s)' % (name, oc, on, c, v['name']))
        owner[name] = (c, v['name'])


def target(c, v):
    """(collection, name) an alias points at."""
    val = v['value']
    return (val['collection'], val['alias'])


def resolve(c, v):
    while isinstance(v['value'], dict) and 'alias' in v['value']:
        c, n = target(c, v)
        v = by_name[(c, n)]
    return v['value']


# ---- tokens.json (W3C Design Tokens Community Group format) ---------------------------------------
def dtcg_value(c, v):
    k = kind(v['name'], v['type'])
    val = v['value']
    if isinstance(val, dict) and 'alias' in val:
        tc, tn = target(c, v)
        return '{%s.%s}' % (tc.lower(), tn.replace('/', '.'))
    if k == 'color':
        return hexcolor(val)
    if k == 'dimension':
        return '%spx' % num(val)
    if k == 'opacity':
        return float(num(val / 100))
    return val


tree = {}
for c in ORDER:
    root = tree.setdefault(c.lower(), {})
    for v in cols[c]:
        node = root
        for part in v['name'].split('/'):
            node = node.setdefault(part, {})
        node['$type'] = {'opacity': 'number'}.get(kind(v['name'], v['type']), kind(v['name'], v['type']))
        node['$value'] = dtcg_value(c, v)
        if v.get('description'):
            node['$description'] = v['description']
        ext = {'variable': v['name'], 'collection': c, 'css': 'var(%s)' % css_name[(c, v['name'])]}
        if 'scopes' in v:
            ext['scopes'] = v['scopes']
        figma_cs = (v.get('codeSyntax') or {}).get('WEB')
        if figma_cs != ext['css']:
            ext['figmaCodeSyntax'] = figma_cs
        node['$extensions'] = {'com.figma': ext}


def ref(vname, col='Semantic'):
    """{semantic.X.Y} reference for a style's bound variable (styles bind Semantic variables)."""
    for c in [col] + ORDER:
        if (c, vname) in by_name:
            return '{%s.%s}' % (c.lower(), vname.replace('/', '.')), 'var(%s)' % css_name[(c, vname)]
    raise KeyError(vname)


WEIGHT_VAR = {400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'Black'}
styles = tree.setdefault('style', {})
css_type = []
for s in data['styles']['text']:
    b = s.get('bound', {})
    ls = s['letterSpacing']
    ls_em = num(ls['value'] / 100) + 'em' if ls['unit'] == 'PERCENT' else num(ls['value']) + 'px'
    if ls_em in ('0em', '0px'):
        ls_em = '0'
    val = {
        'fontFamily': ref(b['fontFamily'])[0] if 'fontFamily' in b else s['fontName']['family'],
        'fontWeight': ref(b['fontWeight'])[0] if 'fontWeight' in b else s['fontName']['variationSettings']['wght'],
        'fontSize': ref(b['fontSize'])[0] if 'fontSize' in b else '%spx' % num(s['fontSize']),
        'lineHeight': ref(b['lineHeight'])[0] if 'lineHeight' in b else '%spx' % num(s['lineHeight']['value']),
        'letterSpacing': ls_em,
    }
    node = styles.setdefault('Text', {})
    for part in s['name'].split('/'):
        node = node.setdefault(part, {})
    node.update({'$type': 'typography', '$value': val,
                 '$extensions': {'com.figma': {'style': s['name'], 'font': s['fontName']['family'] + ' ' + s['fontName']['style']}}})
    css_type.append((s['name'], [
        ('font-family', ref(b['fontFamily'])[1] if 'fontFamily' in b else FONT_STACK[s['fontName']['family']]),
        ('font-weight', ref(b['fontWeight'])[1] if 'fontWeight' in b else str(s['fontName']['variationSettings']['wght'])),
        ('font-size', ref(b['fontSize'])[1] if 'fontSize' in b else '%spx' % num(s['fontSize'])),
        ('line-height', ref(b['lineHeight'])[1] if 'lineHeight' in b else '%spx' % num(s['lineHeight']['value'])),
        ('letter-spacing', ls_em),
    ]))

css_effects = []
for s in data['styles']['effect']:
    shadows, blurs, notes = [], [], []
    for e in s['effects']:
        bv = e.get('boundVariables', {})
        if e['type'] in ('DROP_SHADOW', 'INNER_SHADOW'):
            color = ref(bv['color'])[0] if 'color' in bv else hexcolor(e['color'])
            blur = ref(bv['radius'])[0] if 'radius' in bv else '%spx' % num(e['radius'])
            shadows.append({'color': color, 'offsetX': '%spx' % num(e['offset']['x']), 'offsetY': '%spx' % num(e['offset']['y']),
                            'blur': blur, 'spread': '%spx' % num(e.get('spread', 0)), 'inset': e['type'] == 'INNER_SHADOW'})
        elif e['type'] == 'BACKGROUND_BLUR':
            r = ref(bv['radius'])[0] if 'radius' in bv else '%spx' % num(e.get('startRadius') if e.get('blurType') == 'PROGRESSIVE' and not e.get('radius') else e['radius'])
            blurs.append({'radius': r, 'progressive': e.get('blurType') == 'PROGRESSIVE'})
    node = styles.setdefault('Effect', {})
    for part in s['name'].split('/'):
        node = node.setdefault(part, {})
    if shadows and not blurs:
        node.update({'$type': 'shadow', '$value': shadows})
    else:
        node['$value'] = {'backgroundBlur': blurs, 'shadow': shadows}
        if any(b['progressive'] for b in blurs):
            node['$description'] = 'Progressive background blur (fades from top to bottom of the layer); CSS has no direct equivalent — use a masked backdrop-filter.'
    node['$extensions'] = {'com.figma': {'style': s['name']}}
    css_effects.append((s['name'], s['effects']))


def gradient_angle(t):
    """CSS angle of a Figma gradientTransform, in the layer's unit square."""
    (a, b, c), (d, e, f) = t
    det = a * e - b * d
    inv = lambda gx, gy: ((e * (gx - c) - b * (gy - f)) / det, (-d * (gx - c) + a * (gy - f)) / det)
    x0, y0 = inv(0, 0.5)
    x1, y1 = inv(1, 0.5)
    return round(math.degrees(math.atan2(x1 - x0, -(y1 - y0)))) % 360


css_grad = []
for s in data['styles']['paint']:
    p = s['paints'][0]
    stops = []
    for g in p['gradientStops']:
        bc = (g.get('bound') or {}).get('color')
        stops.append({'color': ref(bc)[0] if bc else hexcolor(g['color']), 'position': round(g['position'], 4)})
    ang = gradient_angle(p['gradientTransform'])
    node = styles.setdefault('Paint', {})
    for part in s['name'].split('/'):
        node = node.setdefault(part, {})
    node.update({'$type': 'gradient', '$value': stops,
                 '$extensions': {'com.figma': {'style': s['name'], 'type': p['type'], 'cssAngle': '%ddeg' % ang}}})
    css_grad.append((s['name'], ang, [((ref(g['bound']['color'])[1] if (g.get('bound') or {}).get('color') else css_color(g['color'])),
                                       g['position']) for g in p['gradientStops']]))

meta = {'$description': 'PeraSure design tokens, generated by tools/build-tokens.py from tokens/figma-export.json. '
                        'Source: ' + data['source']['url'] + ' (exported ' + data['source']['exported'] + ').'}
json.dump(dict(meta, **tree), open(OUT_JSON, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

# ---- tokens.css ---------------------------------------------------------------------------------
def css_value(c, v):
    val = v['value']
    if isinstance(val, dict) and 'alias' in val:
        return 'var(%s)' % css_name[target(c, v)]
    k = kind(v['name'], v['type'])
    if k == 'color':
        return css_color(val)
    if k == 'dimension':
        return '%spx' % num(val) if val else '0'
    if k == 'opacity':
        return num(val / 100)
    if k == 'fontFamily':
        return FONT_STACK.get(val, '"%s", sans-serif' % val)
    return num(val)


L = ['/* PeraSure design tokens — generated by tools/build-tokens.py from tokens/figma-export.json. Do not edit by hand.',
     '   Source: ' + data['source']['url'],
     '   Exported ' + data['source']['exported'] + '. Fonts are not loaded here: also link assets/fonts/fonts.css.',
     '   Layer opacity values are 0–1 here (Figma stores them as 0–100). */', '', ':root {']
for c in ORDER:
    L.append('  /* %s */' % c)
    for v in cols[c]:
        if (c, v['name']) in shared:
            continue  # same name and value as the primitive above
        line = '  %s: %s;' % (css_name[(c, v['name'])], css_value(c, v))
        if v.get('description'):
            line += ' /* %s */' % v['description']
        L.append(line)
    L.append('')
L.append('  /* Effect styles */')
for name, effects in css_effects:
    sh = []
    for e in effects:
        if e['type'] not in ('DROP_SHADOW', 'INNER_SHADOW'):
            continue
        bv = e.get('boundVariables', {})
        col = ref(bv['color'])[1] if 'color' in bv else css_color(e['color'])
        blur = ref(bv['radius'])[1] if 'radius' in bv else '%spx' % num(e['radius'])
        sh.append('%s%spx %spx %s %spx %s' % ('inset ' if e['type'] == 'INNER_SHADOW' else '', num(e['offset']['x']),
                                             num(e['offset']['y']), blur, num(e.get('spread', 0)), col))
    if sh:
        has_blur = any(e['type'] == 'BACKGROUND_BLUR' for e in effects)
        # a style with both a backdrop blur and a shadow: the blur keeps the name, the shadow gets "-shadow"
        L.append('  %s%s: %s;' % (to_code_syntax(name), '-shadow' if has_blur else '', ', '.join(sh)))
    for e in effects:
        if e['type'] == 'BACKGROUND_BLUR':
            bv = e.get('boundVariables', {})
            r = ref(bv['radius'])[1] if 'radius' in bv else '%spx' % num(e.get('radius') or e.get('startRadius', 0))
            note = ' /* progressive in Figma: fades top → bottom */' if e.get('blurType') == 'PROGRESSIVE' else ''
            L.append('  %s: blur(%s);%s' % (to_code_syntax(name), r, note))
L.append('')
L.append('  /* Paint styles */')
for name, ang, stops in css_grad:
    L.append('  %s: linear-gradient(%ddeg, %s);' % (to_code_syntax(name), ang, ', '.join('%s %s%%' % (col, num(pos * 100)) for col, pos in stops)))
L.append('}')
L.append('')
L.append('/* Text styles: class="ps-text-body-md" etc. */')
for name, props in css_type:
    L.append('.ps-text-%s { %s }' % (to_code_syntax(name)[2:], ' '.join('%s: %s;' % kv for kv in props)))
open(OUT_CSS, 'w', encoding='utf-8').write('\n'.join(L) + '\n')

n = sum(len(cols[c]) for c in ORDER)
print('%d variables, %d text / %d effect / %d paint styles -> tokens/tokens.json, tokens/tokens.css'
      % (n, len(data['styles']['text']), len(data['styles']['effect']), len(data['styles']['paint'])))
print('%d of them have a different code syntax in Figma (CSS uses the standard name):' % len(mismatched))
for c, vn, was, now in mismatched:
    print('  %-9s %-40s %s -> %s' % (c, vn, was, now))
if shared:
    print('%d semantic variables share the CSS variable of the same-named primitive (Color/Neutral/*)' % len(shared))
