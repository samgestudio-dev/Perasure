#!/usr/bin/env python3
"""PeraSure rebrand — one set of rules, three outputs.

Brand Bible 5.2: navy is the ground, green is the action, no light blue anywhere.

Reads the two baselines in source/ (never edited):
  source/dev-figma-tokens.json  the developers' Figma variables export (phi_h5_025 tokens/figma-tokens.json, 2026-11-18)
  source/demo-tokens.css        the demo's tokens/tokens.css (tokens v2026.11.17)

Writes:
  figma-tokens.json   drop-in for phi_h5_025 tokens/figma-tokens.json (same format; run `npm run figma:tokens` there)
  tokens.css          the demo's tokens.css with the new colours (the rebrand demo loads it)
  mapping.json        every colour token: old → new, status
  MAPPING.md          the same as a table for developers

Principle (keep the developers' cost low): CSS names stay; only values change. A name is removed only when the colour
itself is gone (blue, pink, yellow) and is listed with every place the code still uses it.

Usage: python3 rebrand/tokens/recolour.py
"""
from __future__ import annotations

import copy
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "source"

# ---------------------------------------------------------------- decisions (owner, 2026-11-19)
# 1. Green text on white: PENDING. Text-safe green-700 (#2B8448, 4.7:1) is used for now; every token that depends on it is
#    marked "pending" in the mapping. If the owner picks the logo green, change PENDING_GREEN_TEXT to "green-500".
# 2. Toggles and radios navy; chips, tags and states green.
# 3. No light navy: light brand fills use ambient (Mist).
# 4. Pink and yellow (with their aliases marketing and warning) are removed: legacy of the old project.
PENDING_GREEN_TEXT = "green-700"

# ---------------------------------------------------------------- primitives
GREEN = {50: "#edfcf0", 100: "#dbf8e0", 200: "#bcf2c7", 300: "#99e8ab", 400: "#79e094", 500: "#5cd680",
         600: "#43b265", 700: "#2b8448", 800: "#206335", 900: "#154624", 950: "#0c2b15"}
NAVY = {600: "#304c8c", 700: "#0f2b74", 800: "#0a1a4a", 900: "#000128", 950: "#00011a"}
AMBIENT_NEW = {300: "#dfeee5"}  # Brand Bible "Mist device"
REMOVED_PRIMITIVE_FAMILIES = ("blue", "pink", "yellow")
REMOVED_ALPHA_FAMILIES = ("blue",)
REMOVED_SEMANTIC_FAMILIES = ("marketing", "warning")

# ---------------------------------------------------------------- semantic re-points (CSS name without --color-, → primitive)
P = PENDING_GREEN_TEXT
REPOINT = {
    # action
    "action-bg-primary-default": "green-500", "action-bg-primary-pressed": "green-600",
    "action-bg-primary-subtle": "green-100", "action-bg-primary-subtle-pressed": "green-200",
    "action-bg-positive-default": "green-500", "action-bg-positive-pressed": "green-600",
    "action-bg-positive-disabled": "green-200",
    "action-text-default": "navy-900",          # text on the green primary button
    "action-text-brand": "navy-900", "action-text-link": P, "action-text-positive": P,
    "action-stroke-active": "navy-900",         # decision 2: selection ring navy
    "action-stroke-active-subtle": "neutral-300", "action-stroke-filled": "neutral-150",
    # brand scale: dark steps navy, light steps ambient (decision 3)
    "brand-50": "ambient-50", "brand-100": "ambient-100", "brand-200": "ambient-200", "brand-300": "ambient-300",
    "brand-400": "navy-600", "brand-500": "navy-800", "brand-600": "navy-900", "brand-700": "navy-950",
    "brand-800": "navy-950", "brand-900": "navy-950", "brand-950": "navy-950",
    # text
    "text-brand-default": "navy-900", "text-brand-heavy": "navy-950", "text-brand-light": "navy-800",
    "text-link-default": P, "text-link-heavy": "green-800", "text-link-light": "green-600",
    "text-positive-default": P, "text-positive-heavy": "green-800", "text-positive-light": "green-500",
    # icon
    "icon-brand-default": "navy-900", "icon-brand-heavy": "navy-950", "icon-brand-light": "navy-800",
    "icon-positive-default": P, "icon-positive-heavy": "green-800", "icon-positive-light": "green-500",
    # stroke
    "stroke-brand-default": "navy-900", "stroke-brand-strong": "navy-950", "stroke-brand-subtle": "neutral-150",
    "stroke-positive-strong": P,
    # surface
    "surface-card-brand": "navy-900", "surface-card-brand-subtle": "ambient-100",
    "surface-card-positive": "green-500",
    "surface-icon-brand-default": "navy-900", "surface-icon-brand-disabled": "neutral-200",
    "surface-icon-positive-default": "green-500", "surface-icon-positive-disabled": "green-200",
}
# component tokens (dev only, codeSyntax --tag-color-*)
REPOINT_TAG = {
    "tag-color-brand-bg-default": "green-100", "tag-color-brand-bg-subtle": "green-50",
    "tag-color-brand-stroke-default": "green-200", "tag-color-brand-text-default": P,
    "tag-color-positive-text-default": P,
}
PENDING = {k for k, v in {**REPOINT, **REPOINT_TAG}.items() if v == P}

# new semantic tokens: css name → (primitive, JSON path in the Semantic collection, Figma scopes)
NEW_SEMANTIC = {
    "text-brand-inverse": ("green-500", ["Color", "Text", "Brand", "Inverse"], ["TEXT_FILL"]),
    "text-link-inverse": ("green-500", ["Color", "Text", "Link", "Inverse"], ["TEXT_FILL"]),
    "surface-device-navy": ("navy-800", ["Color", "Surface", "Device", "Navy"], ["FRAME_FILL", "SHAPE_FILL"]),
    "surface-device-mist": ("ambient-300", ["Color", "Surface", "Device", "Mist"], ["FRAME_FILL", "SHAPE_FILL"]),
    "overlay-shade": ("navy-950", ["Color", "Overlay", "Shade"], ["FRAME_FILL", "SHAPE_FILL"]),
}
NEW_NOTE = {
    "text-brand-inverse": "Green accent text on navy (rate, one green word in a headline)",
    "text-link-inverse": "Links on navy",
    "surface-device-navy": "Brand device (sprout) on navy",
    "surface-device-mist": "Brand device (sprout) on Mist",
    "overlay-shade": "The navy shade over photos and the sprout (key visual)",
}


def prim_hex(name: str) -> str | None:
    fam, step = name.rsplit("-", 1)
    step = int(step)
    if fam == "green":
        return GREEN[step]
    if fam == "navy":
        return NAVY[step]
    if fam == "ambient" and step in AMBIENT_NEW:
        return AMBIENT_NEW[step]
    return None


def title(s: str) -> str:
    return s[:1].upper() + s[1:]


# ============================================================ demo CSS
def build_demo_css(css: str):
    decl = re.compile(r"^(\s*)--color-([a-z0-9-]+):\s*([^;]+);\s*$")
    out, old, removed = [], {}, []
    inserted = False
    for line in css.splitlines():
        m = decl.match(line)
        if not m:
            out.append(line)
            continue
        ind, name, val = m.groups()
        old[name] = val
        fam = name.split("-")[0]
        if (fam in REMOVED_PRIMITIVE_FAMILIES and re.match(rf"{fam}-\d+$", name)) or \
           any(name.startswith(f"alpha-{f}-") for f in REMOVED_ALPHA_FAMILIES) or \
           (fam in REMOVED_SEMANTIC_FAMILIES):
            removed.append(name)
            if fam == "blue" and not inserted:      # navy primitives take blue's place
                for s, h in NAVY.items():
                    out.append(f"{ind}--color-navy-{s}: {h};")
                inserted = True
            continue
        if re.match(r"green-\d+$", name):
            val = GREEN[int(name.split("-")[1])]
        elif name in REPOINT:
            val = f"var(--color-{REPOINT[name]})"
        out.append(f"{ind}--color-{name}: {val};")
        if name == "ambient-200":
            for s, h in AMBIENT_NEW.items():
                out.append(f"{ind}--color-ambient-{s}: {h};")
    # new semantic tokens before the closing brace of :root
    css2 = "\n".join(out)
    # component (tag) tokens are named --tag-color-*, not --color-*
    for name, target in REPOINT_TAG.items():
        css2, n = re.subn(rf"(--{name}:\s*)[^;]+;", rf"\g<1>var(--color-{target});", css2)
    extra ="".join(f"  --color-{n}: var(--color-{p});\n" for n, (p, _, _) in NEW_SEMANTIC.items())
    i = css2.index("\n}")
    css2 = css2[:i] + "\n  /* rebrand: new tokens */\n" + extra.rstrip("\n") + css2[i:]
    header = ("/* PeraSure rebrand — generated by rebrand/tokens/recolour.py from source/demo-tokens.css (tokens v2026.11.17).\n"
              "   Brand Bible 5.2: navy is the ground, green is the action, no light blue. Do not edit by hand. */\n")
    return header + css2 + "\n", old, removed


# ============================================================ dev JSON
def walk_tokens(node, path=()):
    if isinstance(node, dict) and "$value" in node:
        yield path, node
        return
    if isinstance(node, dict):
        for k, v in node.items():
            if not k.startswith("$"):
                yield from walk_tokens(v, path + (k,))


def css_name(tok) -> str | None:
    web = tok.get("$extensions", {}).get("com.figma.codeSyntax", {}).get("Web", "")
    m = re.match(r"var\(--([a-z0-9-]+)\)", web)
    return m.group(1) if m else None


def ref(prim: str) -> str:
    fam, step = prim.rsplit("-", 1)
    return "{Color.%s.%s}" % (title(fam), step)


def build_dev_json(data):
    d = copy.deepcopy(data)
    prim = d["Primitive/Mode 1"]["Color"]
    sem = d["Semantic/Mode 1"]["Color"]
    comp = d["Component/Mode 1"]
    old, removed = {}, []
    for coll in ("Primitive/Mode 1", "Semantic/Mode 1", "Component/Mode 1"):
        for _, tok in walk_tokens(d[coll]):
            n = css_name(tok)
            if n and (n.startswith("color-") or n.startswith("tag-color-")):
                old[n] = tok["$value"]

    def prim_token(fam, step, hexv):
        return {"$extensions": {"com.figma.hiddenFromPublishing": False,
                                "com.figma.codeSyntax": {"Web": f"var(--color-{fam}-{step})"}},
                "$type": "color", "$value": hexv}

    # primitives: remove blue / pink / yellow / alpha blue, add navy, new green, ambient 300
    for fam in ("Blue", "Pink", "Yellow"):
        for _, tok in walk_tokens(prim.get(fam, {})):
            removed.append(css_name(tok))
        prim.pop(fam, None)
    for _, tok in walk_tokens(prim["Alpha"].get("Blue", {})):
        removed.append(css_name(tok))
    prim["Alpha"].pop("Blue", None)
    new_prim = {}
    for k, v in prim.items():
        new_prim[k] = v
        if k == "Red":                                  # keep the collection order readable: Navy after Red
            new_prim["Navy"] = {str(s): prim_token("navy", s, h) for s, h in NAVY.items()}
    if "Navy" not in new_prim:
        new_prim["Navy"] = {str(s): prim_token("navy", s, h) for s, h in NAVY.items()}
    for s, tok in new_prim["Green"].items():
        tok["$value"] = GREEN[int(s)]
    for s, h in AMBIENT_NEW.items():
        new_prim["Ambient"][str(s)] = prim_token("ambient", s, h)
    d["Primitive/Mode 1"]["Color"] = new_prim

    # semantic: remove marketing / warning, re-point by CSS name
    for fam in ("Marketing", "Warning"):
        for _, tok in walk_tokens(sem.get(fam, {})):
            removed.append(css_name(tok))
        sem.pop(fam, None)
    missing = []
    seen = set()
    for coll in (sem, comp):
        for _, tok in walk_tokens(coll):
            n = css_name(tok)
            if not n:
                continue
            key = n[len("color-"):] if n.startswith("color-") else n
            target = REPOINT.get(key) or REPOINT_TAG.get(key)
            if target:
                tok["$value"] = ref(target)
                seen.add(key)
            elif isinstance(tok["$value"], str) and re.search(r"\{Color\.(Blue|Pink|Yellow|Alpha\.Blue)\.", tok["$value"]):
                missing.append((n, tok["$value"]))
            elif isinstance(tok["$value"], str) and tok["$value"].startswith("#") and key.startswith("tag-color-"):
                pass
    # new semantic tokens
    for n, (p, path, scopes) in NEW_SEMANTIC.items():
        node = d["Semantic/Mode 1"]
        for part in path[:-1]:
            node = node.setdefault(part, {})
        node[path[-1]] = {"$extensions": {"com.figma.scopes": scopes, "com.figma.hiddenFromPublishing": False,
                                          "com.figma.codeSyntax": {"Web": f"var(--color-{n})"}},
                          "$type": "color", "$value": ref(p)}
    return d, old, removed, missing, seen


# ============================================================ resolve + mapping
def resolve_dev(d):
    """css name → hex, resolving {Color.X.Y} references (Semantic, then Primitive, which wins on a shared path)."""
    by_path = {}
    for coll in ("Semantic/Mode 1", "Primitive/Mode 1"):
        for path, tok in walk_tokens(d[coll]):
            by_path[".".join(path)] = tok["$value"]

    def res(v, depth=0):
        if isinstance(v, str) and v.startswith("{") and depth < 6:
            return res(by_path.get(v.strip("{}"), v), depth + 1)
        return v
    out = {}
    for coll in ("Primitive/Mode 1", "Semantic/Mode 1", "Component/Mode 1"):
        for _, tok in walk_tokens(d[coll]):
            n = css_name(tok)
            if n:
                out[n] = res(tok["$value"])
    return out


def main():
    demo_css = (SRC / "demo-tokens.css").read_text()
    dev = json.loads((SRC / "dev-figma-tokens.json").read_text())

    new_css, demo_old, demo_removed = build_demo_css(demo_css)
    (HERE / "tokens.css").write_text(new_css)

    new_dev, dev_old, dev_removed, missing, seen = build_dev_json(dev)
    (HERE / "figma-tokens.json").write_text(json.dumps(new_dev, ensure_ascii=False, indent=2) + "\n")

    before, after = resolve_dev(dev), resolve_dev(new_dev)
    rows = []
    names = sorted(set(before) | set(after), key=lambda n: (n.startswith("tag-"), n))
    for n in names:
        if not (n.startswith("color-") or n.startswith("tag-color-")):
            continue
        key = n[len("color-"):] if n.startswith("color-") else n
        b, a = before.get(n), after.get(n)
        if b is None:
            status = "new"
        elif a is None:
            status = "removed"
        elif str(b).lower() == str(a).lower():
            status = "same"
        else:
            status = "changed"
        target = REPOINT.get(key) or REPOINT_TAG.get(key) or (NEW_SEMANTIC.get(key, (None,))[0])
        rows.append({"token": f"--{n}", "status": status, "before": b, "after": a,
                     "points_to": target, "pending": key in PENDING, "note": NEW_NOTE.get(key, "")})
    # demo-only names (not in the dev export)
    for name in sorted(set(demo_old) - {r["token"][len("--color-"):] for r in rows if r["token"].startswith("--color-")}):
        rows.append({"token": f"--color-{name}", "status": "removed" if name in demo_removed else "same (demo only)",
                     "before": demo_old[name], "after": None if name in demo_removed else demo_old[name],
                     "points_to": None, "pending": False, "note": "demo only"})
    (HERE / "mapping.json").write_text(json.dumps({
        "source": {"dev": "phi_h5_025 tokens/figma-tokens.json @ 2026-11-18", "demo": "Perasure tokens v2026.11.17"},
        "decisions": {"green_text_on_white": f"pending — using {PENDING_GREEN_TEXT}", "selection": "toggles/radios navy, chips/tags green",
                      "light_navy": "none; ambient instead", "pink_yellow": "removed (with marketing, warning)"},
        "tokens": rows,
        "unmapped_blue_refs": missing}, ensure_ascii=False, indent=2) + "\n")

    from collections import Counter
    c = Counter(r["status"] for r in rows)
    print("demo tokens.css: removed", len(demo_removed), "| dev json: removed", len(dev_removed))
    print("mapping:", dict(c), "| pending:", sum(r["pending"] for r in rows))
    print("unmapped blue refs left in dev json:", missing)
    left = [l for l in new_css.splitlines() if re.search(r"--color-(blue|alpha-blue|pink|yellow|marketing|warning)-", l)]
    print("blue/pink/yellow names left in demo css:", left[:5])


if __name__ == "__main__":
    main()
