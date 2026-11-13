#!/usr/bin/env python3
"""Build the PeraSure Dev Mode index: every shared component (shared/ps-ui/*.js) and every app page (prototypes/app/screens-*.js).

    python3 tools/devmode-index.py                  # the live repo  -> devmode/data/index.js
    python3 tools/devmode-index.py <root> <out.js>  # a snapshot (tools/devmode-snapshot.py calls this)

For each component: file, first / last line, the props comment above it, the ps-* classes it renders, the CSS rules of those
classes (ps-ui.css, with line numbers), the tokens they use, the motion values (PS.MT.*), icons and pictures, Figma nodes named in
its comment, the gallery entry that shows its states, and the app pages that use it. For each page: file, lines, comment, Figma
nodes and the components it uses. Nothing here is edited by hand: run it again after a change (stamp.py does).
"""
import json, os, re, sys, time

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'devmode', 'data', 'index.js')
UI = os.path.join(ROOT, 'shared', 'ps-ui')
APPDIR = os.path.join(ROOT, 'prototypes', 'app')
DS_FILE, APP_FILE = 'OBsvf42AiRapcRrasD7KNm', 'barda5NcnFzxG7CHtISKsW'
FILES = ['core.js', 'layout.js', 'feedback.js', 'form.js', 'coupon.js', 'home.js', 'loan.js', 'account.js', 'status.js', 'pay.js', 'list.js', 'fx.js', 'apply.js']


def read(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def block_end(src, i):
    """index just after the brace block that starts at src[i] == '{' (skips strings, comments, template literals)"""
    depth, n = 0, len(src)
    while i < n:
        c = src[i]
        if c in '"\'`':
            q = c; i += 1
            while i < n and src[i] != q:
                if src[i] == '\\': i += 1
                i += 1
        elif c == '/' and src[i + 1:i + 2] == '/':
            i = src.find('\n', i)
            if i < 0: return n
        elif c == '/' and src[i + 1:i + 2] == '*':
            i = src.find('*/', i + 2) + 1
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0: return i + 1
        i += 1
    return n


def line_of(src, i):
    return src.count('\n', 0, i) + 1


def figma_nodes(text):
    out = []
    for m in re.finditer(r'(Figma DS|DS|Figma)\s+((?:\d+:\d+)(?:\s*(?:/|·|,|and)\s*\d+:\d+)*)', text):
        f = DS_FILE if 'DS' in m.group(1) else APP_FILE
        for nid in re.findall(r'\d+:\d+', m.group(2)):
            if not any(o['id'] == nid and o['file'] == f for o in out):
                out.append({'file': f, 'id': nid, 'url': 'https://www.figma.com/design/%s/?node-id=%s' % (f, nid.replace(':', '-'))})
    return out


def comment_mentioning(src, start, name):
    """a block comment within the 60 lines above that names the component (one comment can cover several: 'A · B · C')"""
    lo = src.rfind('\n', 0, max(0, start - 1))
    first = start
    for _ in range(60):
        first = src.rfind('\n', 0, first - 1)
        if first <= 0: first = 0; break
    best = ''
    for m in re.finditer(r'/\*(.*?)\*/', src[first:start], re.S):
        if re.search(r'(^|[^A-Za-z])' + re.escape(name) + r'([^A-Za-z]|$)', m.group(1)):
            best = m.group(1).strip()
    return best


def comment_above(src, start):
    """the block comment(s) right above a component (a var line or two may sit between)"""
    head = src[:start].rstrip()
    lines = head.split('\n')
    k, skipped = len(lines) - 1, 0
    while k >= 0 and not lines[k].strip().endswith('*/') and skipped < 6 and not lines[k].strip().startswith('PS.'):
        k -= 1; skipped += 1
    if k < 0 or not lines[k].strip().endswith('*/'):
        return ''
    j = k
    while j >= 0 and '/*' not in lines[j]:
        j -= 1
    txt = '\n'.join(lines[j:k + 1]).strip()
    return re.sub(r'^\s*/\*\s?|\s?\*/\s*$', '', txt, flags=re.S).strip()


# ---- CSS rules of ps-ui.css ----
def css_rules(path):
    src, rules, i = read(path), [], 0
    while True:
        b = src.find('{', i)
        if b < 0: break
        sel_start = max(src.rfind('}', 0, b), src.rfind('*/', 0, b) + 1 if src.rfind('*/', 0, b) >= 0 else -1) + 1
        sel = src[sel_start:b].strip()
        if sel.startswith('@keyframes') or sel.startswith('@media') or sel.startswith('@supports'):
            e = block_end(src, b)
            if sel.startswith('@keyframes'):
                rules.append({'sel': sel, 'body': src[b + 1:e - 1].strip(), 'line': line_of(src, b), 'end': line_of(src, e)})
                i = e; continue
            i = b + 1; continue
        e = src.find('}', b)
        body = src[b + 1:e].strip()
        tail = src[e + 1:src.find('\n', e + 1) if src.find('\n', e + 1) > 0 else len(src)]
        note = re.findall(r'/\*\s*(.*?)\s*\*/', tail)
        rules.append({'sel': sel, 'body': body, 'line': line_of(src, sel_start + len(src[sel_start:b]) - len(src[sel_start:b].lstrip())), 'end': line_of(src, e), 'note': ' '.join(note)})
        i = e + 1
    return rules


GENERIC = re.compile(r'^ps-(t|c)-')   # typography / colour utilities belong to the tokens, not to one component


def components():
    rules = css_rules(os.path.join(UI, 'ps-ui.css'))
    comps, used_classes = {}, {}
    for fn in FILES:
        p = os.path.join(UI, fn)
        if not os.path.exists(p): continue
        src = read(p)
        for m in re.finditer(r'^\s*PS\.([A-Z][A-Za-z0-9]*)\s*=\s*function\b[^{]*', src, re.M):
            name, b = m.group(1), src.find('{', m.end() - 1)
            e = block_end(src, b)
            body = src[m.start():e]
            doc = comment_above(src, m.start())
            if not re.search(r'(^|[^A-Za-z])' + name + r'([^A-Za-z]|$)', doc or ''):
                doc = comment_mentioning(src, m.start(), name) or doc
            classes = sorted(set(c for c in re.findall(r"['\s(](ps-[a-z0-9_-]+)", body) if not GENERIC.match(c) and not c.endswith('-')))
            comps[name] = {
                'name': name, 'file': 'shared/ps-ui/' + fn, 'line': line_of(src, m.start()), 'end': line_of(src, e),
                'doc': doc, 'classes': classes,
                'motion': sorted(set(re.findall(r'\bMT\.([A-Z_]+)', body))),
                'icons': sorted(set(re.findall(r"PS\.Icon,\s*\{\s*name:\s*'([^']+)'", body))),
                'art': sorted(set(re.findall(r"PS\.asset\('([^']+)'\)", body)) | set('art/' + a + '.' + 'svg' for a in re.findall(r"PS\.Art,\s*\{\s*name:\s*'([^']+)'", body))),
                'anims': sorted(set(re.findall(r"PS\.Anim,\s*\{\s*name:\s*'([^']+)'", body))),
                'uses': sorted(set(x for x in re.findall(r'\bPS\.([A-Z][A-Za-z0-9]*)\b', body) if x != name)),
                'figma': figma_nodes(doc),
            }
    # CSS: a rule belongs to a component when its selector names one of the component's own classes (the class's block: ps-copt → ps-copt__*)
    owner = {}
    for n, c in comps.items():
        for cl in c['classes']:
            owner.setdefault(cl, set()).add(n)
    for n, c in comps.items():
        own = set(c['classes'])
        blocks = set(cl.split('__')[0].split('--')[0] for cl in own)
        picked = []
        for r in rules:
            cls = set(re.findall(r'\.(ps-[a-z0-9_-]+)', r['sel']))
            if not cls: continue
            hit = cls & own or set(x for x in cls if x.split('__')[0].split('--')[0] in blocks and x.split('__')[0].split('--')[0] in own)
            if hit:
                picked.append(r)
        c['css'] = [{'sel': r['sel'], 'body': r['body'], 'line': r['line'], 'end': r['end'], 'note': r.get('note', '')} for r in picked]
        tok = set()
        for r in picked:
            tok |= set(re.findall(r'var\((--[a-z0-9-]+)', r['body']))
        c['tokens'] = sorted(tok)
    return comps


def gallery_entries():
    out = {}
    for fn in ['gallery.js', 'gallery-app.js']:
        p = os.path.join(ROOT, 'shared', fn)
        if not os.path.exists(p): continue
        src = read(p)
        for m in re.finditer(r"\{ name: '((?:[^'\\]|\\.)*)', desc: '((?:[^'\\]|\\.)*)'", src):
            name = m.group(1)
            # the states of this entry: the [' label ', function ...] pairs up to the next entry
            nxt = src.find("{ name: '", m.end())
            seg = src[m.end(): nxt if nxt > 0 else len(src)]
            states = re.findall(r"\[\s*'((?:[^'\\]|\\.)*)'\s*,\s*(?:function|live\(|\(\))", seg)
            props = re.search(r"props: '((?:[^'\\]|\\.)*)'", seg)
            for part in name.split(' · '):
                out.setdefault(part.strip(), {'entry': name, 'desc': m.group(2).replace("\\'", "'"), 'props': props.group(1).replace("\\'", "'") if props else '', 'states': [s.replace("\\'", "'") for s in states]})
    return out


def pages(comps):
    out = {}
    for fn in sorted(os.listdir(APPDIR)):
        if not (fn.startswith('screens-') or fn == 'app.js') or not fn.endswith('.js'): continue
        src = read(os.path.join(APPDIR, fn))
        marks = [(m.start(), m.group(1), m.group(2)) for m in re.finditer(r"APP\.(screen|sheet)\('([^']+)'", src)]
        marks += [(m.start(), 'tab', m.group(1)) for m in re.finditer(r"APP\.tabs\.([a-z]+)\s*=\s*function", src)]   # the three tab pages (Home / Payment / Account)
        marks.sort()
        helpers = {}   # function name -> (components, calls): a screen also uses what the helpers it calls render
        for m in re.finditer(r'^\s*(?:function\s+([A-Za-z_$][\w$]*)|(APP\.[A-Za-z_$][\w$]*)\s*=\s*function)\b[^{]*', src, re.M):
            hb = src.find('{', m.end() - 1); he = block_end(src, hb); hbody = src[m.start():he]
            helpers[m.group(1) or m.group(2)] = (set(re.findall(r'\bPS\.([A-Z][A-Za-z0-9]*)\b', hbody)), set(re.findall(r'\b((?:APP\.)?[A-Za-z_$][\w$]*)\s*\(', hbody)))
        def reach(calls, seen):
            got = set()
            for c in calls:
                if c in helpers and c not in seen:
                    seen.add(c); got |= helpers[c][0] | reach(helpers[c][1], seen)
            return got
        for k, (pos, kind, name) in enumerate(marks):
            b = src.find('{', src.find('function', pos)) if kind == 'tab' else src.find('{', src.find(',', pos))
            e = block_end(src, b) if kind == 'screen' else block_end(src, b)
            body = src[pos:e]
            doc = comment_above(src, pos)
            out[name] = {'id': name, 'kind': kind, 'file': 'prototypes/app/' + fn, 'line': line_of(src, pos), 'end': line_of(src, e), 'doc': doc,
                         'figma': figma_nodes(doc), 'components': sorted(set(x for x in set(re.findall(r'\bPS\.([A-Z][A-Za-z0-9]*)\b', body)) | reach(set(re.findall(r'\b((?:APP\.)?[A-Za-z_$][\w$]*)\s*\(', body)), set()) if x in comps))}
    for n, c in comps.items():
        c['pages'] = sorted(p for p, v in out.items() if n in v['components'])
    return out


def main():
    comps = components()
    gal = gallery_entries()
    for n, c in comps.items():
        g = gal.get(n)
        c['gallery'] = g['entry'] if g else None
        c['states'] = g['states'] if g else []
        c['galleryProps'] = g['props'] if g else ''
    # design-system components matched to PS components (devmode/data/figma-links.js) join the Figma nodes from the comments
    links = os.path.join(ROOT, 'devmode', 'data', 'figma-links.js')
    if not os.path.exists(links):
        links = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'devmode', 'data', 'figma-links.js')
    if os.path.exists(links):
        for fid, fname, ps in re.findall(r"\['(\d+:\d+)',\s*'([^']*)',\s*'(\w+)'\]", read(links)):
            c = comps.get(ps)
            if c is not None and not any(f['id'] == fid for f in c['figma']):
                c['figma'].append({'file': DS_FILE, 'id': fid, 'url': 'https://www.figma.com/design/%s/?node-id=%s' % (DS_FILE, fid.replace(':', '-')), 'name': fname, 'component': True})
    pg = pages(comps)
    data = {'generated': time.strftime('%Y-%m-%d %H:%M'), 'figmaFiles': {'ds': DS_FILE, 'app': APP_FILE}, 'components': comps, 'pages': pg,
            'gallery': {k: v['entry'] for k, v in gal.items()}}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    js = OUT.endswith('.js')
    with open(OUT, 'w', encoding='utf-8') as f:
        if js:
            f.write('/* generated by tools/devmode-index.py — do not edit */\nwindow.DM_INDEX = ')
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        if js:
            f.write(';\n')
    print('devmode index: %d components, %d pages, %d with a gallery entry -> %s' % (len(comps), len(pg), sum(1 for c in comps.values() if c['gallery']), os.path.relpath(OUT, ROOT)))


if __name__ == '__main__':
    main()
