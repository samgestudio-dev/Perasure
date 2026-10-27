"""Generate tokens/tokens.css and tokens/tokens.json from the Figma snapshot.

    python3 tools/build-tokens.py          (normally run for you by tools/sync-tokens.py)

Reads  tokens/figma-export.json  snapshot of the Figma file's variables and styles (written by sync-tokens.py)
       tokens/version.json       current token version (stamped into both outputs)
Writes tokens/tokens.json        W3C Design Tokens format: primitive / semantic / component / style, aliases kept
       tokens/tokens.css         CSS custom properties named from each token's path (tokens/code-syntax-naming.md),
                                 shadow / blur / gradient variables and .ps-text-* type classes
"""
import json, math, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tokenlib import sort_snapshot, to_code_syntax  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOK = os.path.join(ROOT, 'tokens')
KNOWN_ORDER = ['Primitive', 'Semantic', 'Component']
FONT_STACK = {  # generic fallbacks; Satoshi has no ₱, the app takes it from Inter (as assets/fonts/fonts.css does)
    'Inter': '"Inter", sans-serif',
    'Hanken Grotesk': '"Hanken Grotesk", sans-serif',
    'Satoshi': '"Satoshi", "Inter", sans-serif',
}
STYLE_WEIGHT = {'Thin': 100, 'ExtraLight': 200, 'Light': 300, 'Regular': 400, 'Medium': 500,
                'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800, 'Black': 900}


def hexcolor(c):
    h = '#%02x%02x%02x' % tuple(round(c[k] * 255) for k in 'rgb')
    a = c.get('a', 1)
    return h if a >= 0.9999 else h + '%02x' % round(a * 255)


def css_color(c):
    a = c.get('a', 1)
    if a >= 0.9999:
        return hexcolor(c)
    r, g, b = (round(c[k] * 255) for k in 'rgb')
    return 'rgb(%d %d %d / %s)' % (r, g, b, num(a))


def num(x):
    return ('%.4f' % x).rstrip('0').rstrip('.')


def kind(name, vtype):
    """What a variable means, from its type and path."""
    top = name.split('/')
    if vtype == 'COLOR':
        return 'color'
    if vtype == 'STRING':
        return 'fontFamily' if top[0] == 'Font' else 'string'
    if vtype == 'BOOLEAN':
        return 'boolean'
    if top[0] == 'Font' and len(top) > 1 and top[1] == 'Weight':
        return 'fontWeight'
    if top[0].lower() == 'layer opacity':
        return 'opacity'
    return 'dimension'  # spacing, radius, blur, stroke width, font size, line height (px)


def font_weight(s):
    vs = s['fontName'].get('variationSettings') or {}
    return vs.get('wght') or STYLE_WEIGHT.get(s['fontName']['style'].replace(' ', ''), 400)


def build(snap, version):
    """Return (css, json_text, info). Pure: writes nothing."""
    snap = sort_snapshot(json.loads(json.dumps(snap)))
    cols = sorted(snap['collections'], key=lambda c: KNOWN_ORDER.index(c['name']) if c['name'] in KNOWN_ORDER else 99)
    order = [c['name'] for c in cols]
    vars_of = {c['name']: c['variables'] for c in cols}
    by_name = {(c, v['name']): v for c in order for v in vars_of[c]}
    multi_mode = [c['name'] for c in cols if len(c.get('modes', [])) > 1]

    # CSS names from the token path; Figma's stored code syntax is only compared, never used
    css_name, mismatched, owner, shared = {}, [], {}, set()
    for c in order:
        for v in vars_of[c]:
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

    def is_alias(v):
        return isinstance(v['value'], dict) and 'alias' in v['value']

    def target(v):
        return (v['value']['collection'], v['value']['alias'])

    def ref(vname):
        """A style's bound variable -> ({json ref}, var(--css))."""
        for c in ['Semantic'] + order:
            if (c, vname) in by_name:
                return '{%s.%s}' % (c.lower(), vname.replace('/', '.')), 'var(%s)' % css_name[(c, vname)]
        raise SystemExit('Style uses a variable that is not in the snapshot: %s' % vname)

    # ---- tokens.json ----
    def dtcg_value(v):
        k = kind(v['name'], v['type'])
        if is_alias(v):
            tc, tn = target(v)
            return '{%s.%s}' % (tc.lower(), tn.replace('/', '.'))
        val = v['value']
        if k == 'color':
            return hexcolor(val)
        if k == 'dimension':
            return '%spx' % num(val)
        if k == 'opacity':
            return float(num(val / 100))
        return val

    tree = {}
    for c in order:
        root = tree.setdefault(c.lower(), {})
        for v in vars_of[c]:
            node = root
            for part in v['name'].split('/'):
                node = node.setdefault(part, {})
            k = kind(v['name'], v['type'])
            node['$type'] = {'opacity': 'number', 'string': 'string', 'boolean': 'boolean'}.get(k, k)
            node['$value'] = dtcg_value(v)
            if v.get('description'):
                node['$description'] = v['description']
            ext = {'id': v['id'], 'variable': v['name'], 'collection': c, 'css': 'var(%s)' % css_name[(c, v['name'])],
                   'scopes': v.get('scopes', [])}
            figma_cs = (v.get('codeSyntax') or {}).get('WEB')
            if figma_cs != ext['css']:
                ext['figmaCodeSyntax'] = figma_cs
            node['$extensions'] = {'com.figma': ext}

    styles = tree.setdefault('style', {})

    def style_node(group, name):
        node = styles.setdefault(group, {})
        for part in name.split('/'):
            node = node.setdefault(part, {})
        return node

    css_type = []
    for s in snap['styles']['text']:
        b = s.get('bound') or {}
        ls = s['letterSpacing']
        ls_css = num(ls['value'] / 100) + 'em' if ls['unit'] == 'PERCENT' else num(ls['value']) + 'px'
        if ls_css in ('0em', '0px'):
            ls_css = '0'
        lh = s['lineHeight']
        lh_raw = 'normal' if lh['unit'] == 'AUTO' else (num(lh['value'] / 100) if lh['unit'] == 'PERCENT' else '%spx' % num(lh['value']))
        fam_raw = s['fontName']['family']
        props = [('fontFamily', 'font-family', b.get('fontFamily'), fam_raw, FONT_STACK.get(fam_raw, '"%s", sans-serif' % fam_raw)),
                 ('fontWeight', 'font-weight', b.get('fontWeight'), font_weight(s), str(font_weight(s))),
                 ('fontSize', 'font-size', b.get('fontSize'), '%spx' % num(s['fontSize']), '%spx' % num(s['fontSize'])),
                 ('lineHeight', 'line-height', b.get('lineHeight'), lh_raw, lh_raw)]
        val = {k: (ref(bv)[0] if bv else raw) for k, _, bv, raw, _c in props}
        val['letterSpacing'] = ls_css
        node = style_node('Text', s['name'])
        node.update({'$type': 'typography', '$value': val,
                     '$extensions': {'com.figma': {'id': s['id'], 'style': s['name'],
                                                   'font': s['fontName']['family'] + ' ' + s['fontName']['style']}}})
        if s.get('description'):
            node['$description'] = s['description']
        css_type.append((s['name'], [(p, ref(bv)[1] if bv else c_) for _, p, bv, _r, c_ in props] + [('letter-spacing', ls_css)]))

    css_effects = []
    for s in snap['styles']['effect']:
        shadows, blurs, css_sh, css_bl = [], [], [], []
        for e in s['effects']:
            if e.get('visible') is False:
                continue
            bv = e.get('boundVariables') or {}
            if e['type'] in ('DROP_SHADOW', 'INNER_SHADOW'):
                col_j, col_c = ref(bv['color']) if 'color' in bv else (hexcolor(e['color']), css_color(e['color']))
                bl_j, bl_c = ref(bv['radius']) if 'radius' in bv else ('%spx' % num(e['radius']),) * 2
                shadows.append({'color': col_j, 'offsetX': '%spx' % num(e['offset']['x']), 'offsetY': '%spx' % num(e['offset']['y']),
                                'blur': bl_j, 'spread': '%spx' % num(e.get('spread', 0)), 'inset': e['type'] == 'INNER_SHADOW'})
                css_sh.append('%s%spx %spx %s %spx %s' % ('inset ' if e['type'] == 'INNER_SHADOW' else '', num(e['offset']['x']),
                                                         num(e['offset']['y']), bl_c, num(e.get('spread', 0)), col_c))
            elif e['type'] in ('BACKGROUND_BLUR', 'LAYER_BLUR'):
                prog = e.get('blurType') == 'PROGRESSIVE'
                raw = e.get('radius') or e.get('startRadius') or 0
                r_j, r_c = ref(bv['radius']) if 'radius' in bv else ('%spx' % num(raw),) * 2
                blurs.append({'radius': r_j, 'progressive': prog, 'type': e['type']})
                css_bl.append((r_c, prog))
        node = style_node('Effect', s['name'])
        if shadows and not blurs:
            node.update({'$type': 'shadow', '$value': shadows})
        else:
            node['$value'] = {'blur': blurs, 'shadow': shadows}
            if any(b['progressive'] for b in blurs):
                node['$description'] = 'Progressive background blur (fades from top to bottom of the layer); CSS has no direct equivalent — use a masked backdrop-filter.'
        node['$extensions'] = {'com.figma': {'id': s['id'], 'style': s['name']}}
        css_effects.append((s['name'], css_sh, css_bl))

    def gradient_angle(t):
        """CSS angle of a Figma gradientTransform, in the layer's unit square."""
        (a, b, c), (d, e, f) = t
        det = a * e - b * d
        inv = lambda gx, gy: ((e * (gx - c) - b * (gy - f)) / det, (-d * (gx - c) + a * (gy - f)) / det)
        x0, y0 = inv(0, 0.5)
        x1, y1 = inv(1, 0.5)
        return round(math.degrees(math.atan2(x1 - x0, -(y1 - y0)))) % 360

    css_paint = []
    for s in snap['styles']['paint']:
        p = s['paints'][0]
        node = style_node('Paint', s['name'])
        if p['type'] == 'SOLID':
            bc = (p.get('boundVariables') or {}).get('color')
            node.update({'$type': 'color', '$value': ref(bc)[0] if bc else hexcolor(p['color'])})
            css_paint.append((s['name'], ref(bc)[1] if bc else css_color(p['color'])))
        elif p['type'] == 'GRADIENT_LINEAR':
            stops_j, stops_c = [], []
            for g in p['gradientStops']:
                bc = (g.get('bound') or {}).get('color')
                stops_j.append({'color': ref(bc)[0] if bc else hexcolor(g['color']), 'position': round(g['position'], 4)})
                stops_c.append('%s %s%%' % (ref(bc)[1] if bc else css_color(g['color']), num(g['position'] * 100)))
            ang = gradient_angle(p['gradientTransform'])
            node.update({'$type': 'gradient', '$value': stops_j})
            css_paint.append((s['name'], 'linear-gradient(%ddeg, %s)' % (ang, ', '.join(stops_c))))
        else:
            node['$value'] = None
            node['$description'] = '%s paint: not converted.' % p['type']
        node.setdefault('$extensions', {})['com.figma'] = {'id': s['id'], 'style': s['name'], 'type': p['type']}

    head = 'PeraSure design tokens v%s (exported from Figma %s by %s).' % (
        version['version'], version['exportedAt'], version.get('exportedBy') or 'unknown')
    meta = {'$description': head + ' Generated by tools/build-tokens.py — do not edit by hand. Changes: tokens/CHANGELOG.md.',
            '$extensions': {'com.perasure': {'version': version['version'], 'exportedAt': version['exportedAt'],
                                             'figmaFile': version.get('figmaFile'), 'url': version.get('url')}}}
    json_text = json.dumps(dict(meta, **tree), ensure_ascii=False, indent=2) + '\n'

    # ---- tokens.css ----
    def css_value(v):
        if is_alias(v):
            return 'var(%s)' % css_name[target(v)]
        k = kind(v['name'], v['type'])
        val = v['value']
        if k == 'color':
            return css_color(val)
        if k == 'dimension':
            return '%spx' % num(val) if val else '0'
        if k == 'opacity':
            return num(val / 100)
        if k == 'fontFamily':
            return FONT_STACK.get(val, '"%s", sans-serif' % val)
        if k == 'string':
            return json.dumps(val)
        if k == 'boolean':
            return '1' if val else '0'
        return num(val)

    L = ['/* ' + head, '   Generated by tools/build-tokens.py from tokens/figma-export.json — do not edit by hand.',
         '   Changes: tokens/CHANGELOG.md · Source: ' + (version.get('url') or ''),
         '   Fonts are not loaded here: also link assets/fonts/fonts.css. Layer opacity is 0–1 here (0–100 in Figma). */',
         '', ':root {']
    for c in order:
        L.append('  /* %s */' % c)
        for v in vars_of[c]:
            if (c, v['name']) in shared:
                continue  # same name and value as the primitive above
            line = '  %s: %s;' % (css_name[(c, v['name'])], css_value(v))
            if v.get('description'):
                line += ' /* %s */' % v['description']
            L.append(line)
        L.append('')
    L.append('  /* Effect styles */')
    for name, sh, bl in css_effects:
        base = to_code_syntax(name)
        if sh:  # a style with both a blur and a shadow: the blur keeps the name, the shadow gets "-shadow"
            L.append('  %s%s: %s;' % (base, '-shadow' if bl else '', ', '.join(sh)))
        for r, prog in bl[:1]:
            L.append('  %s: blur(%s);%s' % (base, r, ' /* progressive in Figma: fades top → bottom */' if prog else ''))
    L.append('')
    L.append('  /* Paint styles */')
    for name, value in css_paint:
        L.append('  %s: %s;' % (to_code_syntax(name), value))
    L.append('}')
    L.append('')
    L.append('/* Text styles: class="ps-text-body-md" etc. */')
    for name, props in css_type:
        L.append('.ps-text-%s { %s }' % (to_code_syntax(name)[2:], ' '.join('%s: %s;' % kv for kv in props)))
    css = '\n'.join(L) + '\n'

    info = {'mismatched': mismatched, 'shared': len(shared), 'multiMode': multi_mode,
            'css_names': {v['id']: css_name[(c, v['name'])] for c in order for v in vars_of[c]}}
    return css, json_text, info


def load():
    snap = json.load(open(os.path.join(TOK, 'figma-export.json'), encoding='utf-8'))
    version = json.load(open(os.path.join(TOK, 'version.json'), encoding='utf-8'))
    return snap, version


if __name__ == '__main__':
    snap, version = load()
    css, js, info = build(snap, version)
    open(os.path.join(TOK, 'tokens.css'), 'w', encoding='utf-8').write(css)
    open(os.path.join(TOK, 'tokens.json'), 'w', encoding='utf-8').write(js)
    print('v%s -> tokens/tokens.css, tokens/tokens.json' % version['version'])
