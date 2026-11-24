#!/usr/bin/env python3
"""PeraSure tokens v2 — the single source (approved by the owner 2026-11-19, see ../ARCHITECTURE.md).

Reads the two old baselines (never edited):
  ../source/demo-tokens.css        demo tokens v2026.11.17 (CSS, incl. .ps-text-* classes)
  ../source/dev-figma-tokens.json  developers' Figma export (phi_h5_025, 2026-11-18)

Writes (this folder):
  tokens.css            v2 tokens: palette, semantic, component, kept non-colour tokens, text classes
  legacy-aliases.css    every old name that was renamed or removed → var(--new)  (load after tokens.css; delete in phase 4)
  rename-map.json       old → new, kind (kept · rename · merge · removed), note, live-app usage count
  MAPPING.md            the same, as tables for people
  tokens.json           DTCG source (colour + new non-colour tokens), for tools and Figma
  migrate-tokens.mjs    codemod: rewrites var(--old) → var(--new) in a source tree (dry run by default)

Usage: python3 rebrand/tokens/v2/build.py
"""
from __future__ import annotations

import json
import re
from collections import OrderedDict, Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE.parent / "source"
USAGE = HERE.parent.parent / "log" / "dev-usage.json"
PENDING_GREEN_TEXT = "green-700"   # owner decision pending: green text on white

# ============================================================ primitives (palette)
OLD = dict(re.findall(r"^\s*--([a-z0-9-]+)\s*:\s*([^;]+);", (SRC / "demo-tokens.css").read_text(), re.M))
OLD = {k: v.strip() for k, v in OLD.items()}

def old_scale(fam):
    return OrderedDict((int(k.split("-")[-1]), v) for k, v in OLD.items() if re.fullmatch(rf"color-{fam}-\d+", k))

PALETTE = OrderedDict()
PALETTE["navy"] = OrderedDict([(50, "#f4f7fc"), (100, "#e8edf7"), (200, "#d2dbec"), (300, "#b1bed8"), (400, "#8498c1"), (500, "#5770a6"),
                               (600, "#304c8c"), (700, "#0f2b74"), (800, "#0a1a4a"), (900, "#000128"), (950, "#00011a")])
# owner 2026-11-20: the Brand Bible green #5CD680 is the anchor at **600** (it replaces legacy blue-600, the primary action);
# the other steps follow the legacy blue scale's lightness / chroma profile in OKLCH (generator: tokens/v2/green-scale.py)
PALETTE["green"] = OrderedDict([(50, "#f6fef7"), (100, "#eafded"), (200, "#d1fbd9"), (300, "#b0f6bf"), (400, "#8df2a6"),
                                (500, "#72eb94"), (600, "#5cd680"), (700, "#44a05f"), (800, "#327545"), (900, "#18572d"), (950, "#143a1f")])
PALETTE["neutral"] = old_scale("neutral")
PALETTE["ambient"] = old_scale("ambient"); PALETTE["ambient"][300] = "#dfeee5"
PALETTE["ambient"].update([(400, "#c3d6d0"), (500, "#a1b7b0"), (600, "#7c928b"), (700, "#5a6e68"), (800, "#3c4c47"), (900, "#222e2b"), (950, "#121a18")])
# full 50–950 scales (owner). Light navy 50–500 exist as primitives only: no semantic token uses them (decision 3, no light navy in the UI).
# orange (owner 2026-11-20: coupon countdowns "Expires in …"; 500 = legacy #FF5E00; text uses 700 for 5.6:1 on white)
PALETTE["orange"] = OrderedDict([(50, "#fff4ed"), (100, "#ffe6d5"), (200, "#ffc9a8"), (300, "#ffa36f"), (400, "#ff7a36"), (500, "#ff5e00"),
                                 (600, "#e04f00"), (700, "#b83f00"), (800, "#8f3200"), (900, "#6b2600"), (950, "#3d1500")])
PALETTE["red"] = old_scale("red")
ALPHA = OrderedDict()
for fam, newfam in (("white", "white"), ("black", "black"), ("cold-black", "navy"), ("grey", "grey"), ("green", "deep-green")):
    ALPHA[newfam] = OrderedDict((int(k.split("-")[-1]), v) for k, v in OLD.items() if re.fullmatch(rf"color-alpha-{fam}-\d+", k))

ALPHA["navy"].update([(0, "rgb(0 1 40 / 0)"), (32, "rgb(0 1 40 / 0.32)"), (40, "rgb(0 1 40 / 0.4)"), (56, "rgb(0 1 40 / 0.56)")])
ALPHA["navy"] = OrderedDict(sorted(ALPHA["navy"].items()))
# bluish light alpha for fills on the navy brand card (owner, 2026-11-20: Chat button, timer pill, progress tracks, divider; option D)
ALPHA["periwinkle"] = OrderedDict([(24, "rgb(157 184 255 / 0.24)")])

def pal(ref):            # 'navy-900' or 'alpha-white-80' → css var
    return f"var(--palette-{ref})"

# ============================================================ semantic colour (css name, figma path, palette ref, scopes, replaces)
P = PENDING_GREEN_TEXT
TXT, FILL, BOR, EFF = ["TEXT_FILL", "SHAPE_FILL"], ["FRAME_FILL", "SHAPE_FILL"], ["STROKE_COLOR"], ["EFFECT_COLOR"]
SEM = [
 # content (text + icons)
 ("content-primary", "Content/Primary", "neutral-900", TXT, ["text-primary", "icon-primary"]),
 ("content-secondary", "Content/Secondary", "neutral-700", TXT, ["text-secondary", "icon-secondary"]),
 ("content-tertiary", "Content/Tertiary", "neutral-500", TXT, ["text-tertiary", "icon-tertiary"]),
 ("content-placeholder", "Content/Placeholder", "neutral-400", TXT, ["text-placeholder", "icon-placeholder"]),
 ("content-disabled", "Content/Disabled", "neutral-300", TXT, ["text-disabled", "icon-disabled", "action-text-disabled"]),
 ("content-inverse", "Content/Inverse", "neutral-0", TXT, ["text-inverse", "icon-inverse"]),
 ("content-brand", "Content/Brand/Default", "neutral-900", TXT, []),   # navy for intentional navy content (filled icons, tab labels); legacy brand text → accent-strong (owner 2026-11-20)
 ("content-brand-strong", "Content/Brand/Strong", "neutral-900", TXT, []),
 ("content-brand-subtle", "Content/Brand/Subtle", "neutral-700", TXT, []),
 ("content-link", "Content/Link/Default", "green-700", TXT, ["text-link-default"]),
 ("content-link-pressed", "Content/Link/Pressed", "green-800", TXT, ["text-link-heavy"]),
 ("content-accent", "Content/Accent", "green-500", TXT, ["text-positive-light", "icon-positive-light", "text-brand-inverse", "text-link-inverse"]),
 ("content-accent-heavy", "Content/Accent-heavy", "green-800", TXT, ["text-brand-heavy", "icon-brand-heavy"]),
 ("content-urgent", "Content/Urgent", "orange-500", TXT + BOR, []),   # owner 2026-11-21: text nearest legacy = legacy #FF5E00 exactly (was 700). 2026-11-20: countdown text + clock icon (coupon "Expires in"); not "warning" (old name, deleted)
 ("content-selected", "Content/Selected", "green-600", TXT, []),   # owner 2026-11-21 (13036:55882 ContactMethod selected): selected option label + icon = green-600, stroke Border/Brand-strong
 ("content-accent-strong", "Content/Accent-strong", "green-700", TXT, ["text-brand-default", "icon-brand-default", "action-text-brand", "text-brand-light", "icon-brand-light", "text-link-light", "action-text-link"]),   # owner 2026-11-20 (late): green text one step lighter → green-700 #44A05F (was 800); heavy / pressed 800
 ("content-positive", "Content/Positive/Default", "green-700", TXT, ["text-positive-default", "icon-positive-default", "action-text-positive"]),
 ("content-positive-strong", "Content/Positive/Strong", "green-800", TXT, ["text-positive-heavy", "icon-positive-heavy"]),
 ("content-negative", "Content/Negative/Default", "red-600", TXT, ["text-negative-default", "icon-negative-default"]),
 ("content-negative-strong", "Content/Negative/Strong", "red-700", TXT, ["text-negative-heavy", "icon-negative-heavy"]),
 ("content-negative-subtle", "Content/Negative/Subtle", "red-500", TXT, ["text-negative-light", "icon-negative-light"]),
 ("content-on-action", "Content/On-action", "navy-900", TXT, ["action-text-default"]),   # owner 2026-11-20: primary button as the Brand Bible (#5CD680 + navy label, 11:1)
 ("content-accent-pressed", "Content/Accent-pressed", "green-300", TXT, []),
 # surface
 ("surface-page", "Surface/Page/Default", "ambient-100", FILL, ["surface-page-default"]),
 ("surface-page-subtle", "Surface/Page/Subtle", "ambient-50", FILL, ["surface-page-light"]),
 ("surface-page-strong", "Surface/Page/Strong", "ambient-200", FILL, ["surface-page-heavy"]),
 ("surface-default", "Surface/Default", "neutral-0", FILL, ["surface-card-default"]),
 ("surface-raised", "Surface/Raised", "neutral-0", FILL, ["surface-elevated-default"]),
 ("surface-sunken", "Surface/Sunken", "ambient-100", FILL, ["surface-inset-default"]),
 ("surface-muted", "Surface/Muted", "neutral-100", FILL, ["surface-card-muted"]),
 ("surface-glass", "Surface/Glass/Default", "alpha-white-80", FILL, ["surface-elevated-glass"]),
 ("surface-glass-subtle", "Surface/Glass/Subtle", "alpha-white-60", FILL, ["surface-elevated-glass-blue"]),
 ("surface-brand", "Surface/Brand/Default", "navy-900", FILL, ["surface-card-brand"]),
 ("surface-brand-subtle", "Surface/Brand/Subtle", "green-50", FILL, ["surface-card-brand-subtle"]),   # owner 2026-11-20: green = legacy blue scale, step for step
 ("surface-inverse", "Surface/Inverse", "neutral-900", FILL, []),
 ("surface-device-navy", "Surface/Device/Navy", "navy-800", FILL, ["surface-device-navy"]),
 ("surface-device-mist", "Surface/Device/Mist", "ambient-300", FILL, ["surface-device-mist"]),
 ("surface-tint", "Surface/Tint/Default", "ambient-300", FILL, []),   # owner 2026-11-20: tinted strips / notices that sit on the page (ScamStrip); ambient-100/200 vanish on the page
 # bg (controls, states, badges)
 ("bg-action", "Bg/Action/Default", "green-600", FILL, ["action-bg-primary-default"]),   # owner 2026-11-20: green = legacy blue scale, step for step
 ("bg-action-pressed", "Bg/Action/Pressed", "green-700", FILL, ["action-bg-primary-pressed"]),
 ("bg-action-subtle", "Bg/Action/Subtle", "green-100", FILL, ["action-bg-primary-subtle"]),
 ("bg-action-subtle-pressed", "Bg/Action/Subtle-pressed", "green-200", FILL, ["action-bg-primary-subtle-pressed"]),
 ("bg-disabled", "Bg/Disabled", "neutral-100", FILL, ["action-bg-primary-disabled", "surface-icon-inverse-disabled"]),
 ("bg-selected", "Bg/Selected", "green-600", FILL, []),   # owner step rule: checks / radios / toggles = legacy blue-600 -> green-600; mark navy like the primary label
 ("bg-brand", "Bg/Brand/Default", "navy-900", FILL, ["surface-icon-brand-default"]),
 ("bg-brand-pressed", "Bg/Brand/Pressed", "navy-800", FILL, []),
 ("bg-brand-muted", "Bg/Brand/Muted", "navy-600", FILL, []),   # owner 2026-11-20: lighter navy icon tile (activity: Repayment Completed); white icon 8:1
 ("bg-positive", "Bg/Positive/Default", "green-500", FILL, []),
 ("bg-positive-pressed", "Bg/Positive/Pressed", "green-600", FILL, []),
 ("bg-positive-strong-pressed", "Bg/Positive/Strong-pressed", "green-700", FILL, ["action-bg-positive-pressed"]),
 ("bg-urgent-subtle", "Bg/Urgent/Subtle", "orange-100", FILL, []),   # owner 2026-11-21: coupon "Best" pill fill (legacy positive-100 step, orange scale)
 ("bg-positive-subtle", "Bg/Positive/Subtle", "green-100", FILL, ["action-bg-positive-subtle"]),
 ("surface-positive-subtle", "Surface/Positive/Subtle", "green-50", FILL, ["surface-card-positive-subtle"]),
 ("bg-positive-subtle-pressed", "Bg/Positive/Subtle-pressed", "green-200", FILL, ["action-bg-positive-subtle-pressed"]),
 ("bg-positive-strong", "Bg/Positive/Strong", "green-600", FILL + BOR, ["action-bg-positive-default", "surface-card-positive", "surface-icon-positive-default"]),   # unified with the other dark greens (owner 2026-11-20: green-600 everywhere)   # owner 2026-11-20: dark green progress (upload bar fill, upload ring dashes)
 ("bg-positive-disabled", "Bg/Positive/Disabled", "green-300", FILL, ["action-bg-positive-disabled", "surface-icon-positive-disabled", "surface-icon-brand-disabled"]),
 ("bg-negative", "Bg/Negative/Default", "red-600", FILL, ["surface-card-negative", "surface-icon-negative-default"]),
 ("bg-negative-pressed", "Bg/Negative/Pressed", "red-700", FILL, []),
 ("bg-negative-subtle", "Bg/Negative/Subtle", "red-50", FILL, ["surface-card-negative-subtle"]),
 ("bg-negative-disabled", "Bg/Negative/Disabled", "red-300", FILL, ["surface-icon-negative-disabled"]),
 ("bg-neutral", "Bg/Neutral/Default", "neutral-100", FILL, []),
 ("bg-neutral-subtle", "Bg/Neutral/Subtle", "neutral-50", FILL, ["surface-icon-neutral-default"]),
 ("bg-neutral-strong", "Bg/Neutral/Strong", "neutral-300", FILL, ["surface-icon-neutral-disabled"]),
 ("bg-inverse", "Bg/Inverse", "neutral-0", FILL, ["action-bg-inverse", "surface-icon-inverse-default"]),
 ("bg-on-brand", "Bg/On-brand", "alpha-periwinkle-24", FILL, []),   # owner 2026-11-20: buttons, timer, track on the navy card (was white 16 %, no token)
 ("bg-tint-minimum", "Bg/Tint/Minimum", "alpha-deep-green-6", FILL, ["alpha-bg-minimum"]),
 ("bg-tint-subtle", "Bg/Tint/Subtle", "alpha-deep-green-20", FILL, ["alpha-bg-subtle"]),
 ("bg-tint-default", "Bg/Tint/Default", "alpha-deep-green-40", FILL, ["alpha-bg-default"]),
 ("bg-tint-strong", "Bg/Tint/Strong", "alpha-deep-green-60", FILL, ["alpha-bg-emphasis"]),
 ("bg-tint-navy-subtle", "Bg/Tint/Navy-subtle", "alpha-navy-6", FILL, ["alpha-cold-bg-subtle"]),
 ("bg-tint-navy-default", "Bg/Tint/Navy-default", "alpha-navy-20", FILL, ["alpha-cold-bg-default"]),
 # border
 ("border-default", "Border/Default", "neutral-200", BOR, ["stroke-default"]),
 ("border-subtle", "Border/Subtle", "neutral-100", BOR, ["stroke-subtle", "stroke-divider", "action-stroke-default"]),
 ("border-on-brand", "Border/On-brand", "alpha-periwinkle-24", BOR, []),   # owner 2026-11-20: dividers on the navy card
 ("border-strong", "Border/Strong", "neutral-300", BOR, ["stroke-strong"]),
 ("border-filled", "Border/Filled", "neutral-150", BOR, []),
 ("border-accent-faint", "Border/Accent/Faint", "green-100", BOR, ["action-stroke-filled"]),   # owner 2026-11-20: green = legacy blue scale, step for step
 ("border-accent-subtle", "Border/Accent/Subtle", "green-200", BOR, ["stroke-brand-subtle"]),
 ("border-control", "Border/Control", "neutral-400", BOR, []),
 ("border-selected", "Border/Selected/Default", "green-500", BOR, ["action-stroke-active", "stroke-brand-default"]),   # owner 2026-11-20: green = legacy blue scale, step for step
 ("border-selected-subtle", "Border/Selected/Subtle", "green-300", BOR, ["action-stroke-active-subtle"]),
 ("border-brand-strong", "Border/Brand-strong", "green-600", BOR, ["stroke-brand-strong"]),
 ("border-focused", "Border/Focused", "green-500", BOR, []),
 ("border-positive", "Border/Positive/Default", "green-500", BOR, ["stroke-positive-default"]),
 ("border-positive-subtle", "Border/Positive/Subtle", "green-200", BOR, ["stroke-positive-subtle"]),
 ("border-positive-strong", "Border/Positive/Strong", "green-600", BOR, ["stroke-positive-strong"]),
 ("border-negative", "Border/Negative/Default", "red-500", BOR, ["stroke-negative-default"]),
 ("border-negative-subtle", "Border/Negative/Subtle", "red-200", BOR, ["stroke-negative-subtle"]),
 ("border-negative-strong", "Border/Negative/Strong", "red-600", BOR, ["stroke-negative-strong"]),
 # overlay, shadow colours, gradient stops
 ("overlay-scrim", "Overlay/Scrim/Default", "alpha-navy-40", FILL, ["overlay-scrim-default"]),
 # gradient scrim (owner's Figma direction): clear at the top so it meets the native nav bar with no dark band, darker towards the sheet
 ("overlay-scrim-top", "Overlay/Scrim/Top", "alpha-navy-0", FILL, []),
 ("overlay-scrim-mid", "Overlay/Scrim/Mid", "alpha-navy-32", FILL, []),
 ("overlay-scrim-bottom", "Overlay/Scrim/Bottom", "alpha-navy-56", FILL, []),
 ("overlay-shade", "Overlay/Shade", "navy-950", FILL, ["overlay-shade"]),
 ("shadow-color-default-1", "Shadow-color/Default/1", "alpha-navy-16", EFF, ["shadow-default-1"]),
 ("shadow-color-default-2", "Shadow-color/Default/2", "alpha-navy-8", EFF, ["shadow-default-2"]),
 ("shadow-color-subtle-1", "Shadow-color/Subtle/1", "alpha-navy-12", EFF, ["shadow-subtle-1"]),
 ("shadow-color-subtle-2", "Shadow-color/Subtle/2", "alpha-navy-6", EFF, ["shadow-subtle-2"]),
 ("shadow-color-focus-1", "Shadow-color/Focus/1", "alpha-navy-16", EFF, ["shadow-focus-1"]),
 ("shadow-color-focus-2", "Shadow-color/Focus/2", "alpha-navy-12", EFF, ["shadow-focus-2"]),
 ("shadow-color-backdrop", "Shadow-color/Backdrop", "alpha-navy-8", EFF, ["shadow-backdrop"]),
]
for n in (0, 20, 40, 60, 80):
    SEM.append((f"gradient-grey-{n}", f"Gradient/Grey/{n}", f"alpha-grey-{n}", FILL, [f"gradient-default-{n}"]))
for n in (0, 20, 40, 50, 60, 80):
    SEM.append((f"gradient-white-{n}", f"Gradient/White/{n}", f"alpha-white-{n}", FILL, [f"gradient-subtle-{n}"]))
GRAD_AMBIENT = [0, 20, 40, 60, 80]   # color-mix of ambient-100 with layer opacity (kept formula)

# component: tag (tones neutral, accent=green, navy, positive, negative); replaces tag-color-*
TAG = OrderedDict([   # Subtle = bg + content, Outline = border + content, Strong = bg-strong + content-strong (all ≥4.5:1 text)
 ("neutral", {"bg": "neutral-100", "bg-subtle": "neutral-50", "bg-inverse": "neutral-0", "bg-alpha": "neutral-0", "content": "neutral-700",
              "border": "neutral-300", "bg-strong": "neutral-700", "content-strong": "neutral-0"}),
 ("accent", {"bg": "green-100", "bg-subtle": "green-50", "content": "green-700", "border": "green-500", "bg-strong": "green-500", "content-strong": "neutral-900"}),
 ("navy", {"bg": "ambient-100", "bg-subtle": "ambient-50", "content": "navy-900", "border": "navy-900", "bg-strong": "navy-900", "content-strong": "neutral-0"}),
 ("positive", {"bg": "green-100", "bg-subtle": "green-50", "content": "green-700", "border": "green-500", "bg-strong": "green-500", "content-strong": "neutral-900"}),
 ("negative", {"bg": "red-100", "bg-subtle": "red-50", "content": "red-700", "border": "red-500", "bg-strong": "red-600", "content-strong": "neutral-0"}),
])
# component: coupon ticket gradient (owner 2026-11-19: the one gradient kept, in the green scale; was brand 700→600→400→200)
COUPON = OrderedDict([("top", "green-700"), ("upper", "green-600"), ("mid", "green-400"), ("bottom", "green-200")])
TAG_OLD = {"bg-default": "bg", "bg-subtle": "bg-subtle", "bg-inverse": "bg-inverse", "bg-alpha": "bg-alpha", "text-default": "content", "stroke-default": "border"}
TAG_TONE_OLD = {"neutral": "neutral", "brand": "accent", "positive": "positive", "negative": "negative"}

# ============================================================ non-colour: new tokens
NEW_OTHER = OrderedDict([
 ("size-control-sm", "36px"), ("size-control-md", "44px"), ("size-control-lg", "48px"),
 ("size-icon-xs", "16px"), ("size-icon-sm", "20px"), ("size-icon-md", "24px"), ("size-icon-lg", "32px"),
 ("size-touch-min", "44px"),
 ("radius-control", "var(--radius-full)"), ("radius-card", "var(--radius-xl)"), ("radius-sheet", "var(--radius-xxl)"), ("radius-tooltip", "var(--radius-sm)"),
 ("stroke-width-focus", "2px"),
 ("opacity-disabled", "0.4"), ("opacity-pressed", "0.1"),
 ("motion-duration-instant", "80ms"), ("motion-duration-fast", "150ms"), ("motion-duration-base", "240ms"), ("motion-duration-slow", "360ms"),
 ("motion-easing-standard", "cubic-bezier(0.2, 0, 0, 1)"), ("motion-easing-enter", "cubic-bezier(0, 0, 0, 1)"), ("motion-easing-exit", "cubic-bezier(0.3, 0, 1, 1)"),
 ("font-family-amount", "var(--font-family-hanken-grotesk)"),
 ("gradient-coupon", "linear-gradient(180deg, var(--coupon-gradient-top) 0%, var(--coupon-gradient-upper) 14.9%, var(--coupon-gradient-mid) 59.6%, var(--coupon-gradient-bottom) 100%)"),
 ("gradient-coupon-panel", "linear-gradient(180deg, var(--coupon-gradient-upper) 0%, var(--coupon-gradient-mid) 69.2%, var(--coupon-gradient-bottom) 100%)"),
 ("gradient-coupon-tab", "linear-gradient(0deg, var(--coupon-gradient-upper) 0%, var(--coupon-gradient-top) 100%)"),
 ("gradient-scrim", "linear-gradient(180deg, var(--overlay-scrim-top) 0%, var(--overlay-scrim-mid) 28%, var(--overlay-scrim-bottom) 100%)"),
 # semantic size / line-height that Figma's text styles bind to (added with the v2 styles)
 ("font-size-link", "var(--font-size-14)"), ("font-line-height-link", "var(--font-line-height-20)"),
 ("font-size-section-title-xs", "var(--font-size-11)"), ("font-line-height-section-title-xs", "var(--font-line-height-14)"),
 ("font-size-amount-xs", "var(--font-size-16)"), ("font-line-height-amount-xs", "var(--font-line-height-20)"),
 ("font-size-amount-sm", "var(--font-size-18)"), ("font-line-height-amount-sm", "var(--font-line-height-24)"),
 ("font-size-amount-md", "var(--font-size-24)"), ("font-line-height-amount-md", "var(--font-line-height-32)"),
 ("font-size-amount-lg", "var(--font-size-32)"), ("font-line-height-amount-lg", "var(--font-line-height-40)"),
 ("font-size-amount-xl", "var(--font-size-36)"), ("font-line-height-amount-xl", "var(--font-line-height-36)"),
 ("font-size-amount-xxl", "var(--font-size-48)"), ("font-line-height-amount-xxl", "var(--font-line-height-48)"),
])
FONT_FAMILY_ROLES = ["body", "display", "label", "number", "title"]          # all → Hanken Grotesk
REMOVED_FONTS = ["font-family-inter", "font-family-reddit-sans"]
ELEVATION = {"elevation-raised": "shadow-default", "elevation-overlay": "shadow-over", "elevation-focus": "shadow-focus"}
# text classes: weight + letter-spacing for Hanken Grotesk (owner: one typeface)
TEXT = OrderedDict([   # lean set (owner, 2026-11-19, TYPE-AND-STYLES.md): new class → (old source class, weight, tracking)
 ("display-md", ("display-md", "black", "-0.02em")), ("display-sm", ("display-sm", "black", "-0.02em")),
 ("headline-sm", ("headline-sm", "black", "-0.01em")),
 ("title-lg", ("title-lg", "bold", "-0.005em")), ("title-md", ("title-md", "bold", "-0.005em")), ("title-sm", ("title-sm", "bold", "-0.005em")),
 ("title-xs", ("section-title-md", "semi-bold", "0")),
 ("body-lg", ("body-lg", "regular", "0")), ("body-lg-strong", ("body-lg-emphasis", "medium", "0")),
 ("body-md", ("body-md", "regular", "0")), ("body-md-strong", ("body-md-emphasis", "medium", "0")),
 ("label-md", ("label-md", "semi-bold", "0")), ("label-sm", ("label-sm", "semi-bold", "0")),
 ("caption-sm", ("caption-sm", "medium", "0")), ("caption-xs", ("caption-xs", "medium", "0")),
 # owner 2026-11-20 (TYPE-GAPS.md): regular 12 / 11 for hints and legal copy (legacy Caption 400)
 ("body-sm", ("caption-sm", "regular", "0")), ("body-xs", ("caption-xs", "regular", "0")),
])
TEXT_MERGED = {  # old style → surviving style (merged or renamed); never reuse an old name for a new meaning
 "display-xl": "display-md", "display-lg": "display-md", "body-lg-emphasis": "body-lg-strong", "body-md-emphasis": "body-md-strong",
 "section-title-md": "title-xs", "section-title-md-light": "body-lg-strong", "section-title-sm": "label-md",
 "section-title-sm-light": "body-md-strong", "section-title-xs": "caption-xs", "section-title-xs-light": "caption-xs",
 "label-md-light": "body-md-strong", "label-sm-light": "caption-sm", "link": "label-md",
}
AMOUNT = OrderedDict([("xxl", "number-xxl"), ("lg", "number-lg"), ("md", "number-md"), ("xs", "number-xs")])
# amount tracking, graded: bigger amounts get more (owner, 2026-11-19: "数字间距太小了，尤其是大数字"; was −2 % on every size)
AMOUNT_TRACK = {"xxl": "0.04em", "lg": "0.03em", "md": "0.02em", "xs": "0.02em"}
AMOUNT_MERGED = {"number-xxl": "amount-xxl", "number-xl": "amount-lg", "number-lg": "amount-lg", "number-md": "amount-md",
                 "number-sm": "amount-xs", "number-xs": "amount-xs", "amount-xl": "amount-lg", "amount-sm": "amount-xs"}
STYLE_PROPS = ["font-family", "font-size", "font-weight", "line-height", "letter-spacing", "paragraph-spacing", "text-decoration", "text-transform"]

# ============================================================ helpers
def usage():
    if not USAGE.exists():
        return {}
    u = json.loads(USAGE.read_text()); u = u.get("tokens", u)
    return {k[2:]: (v["count"] if isinstance(v, dict) else v) for k, v in u.items() if k.startswith("--")}


def build():
    use = usage()
    rmap = OrderedDict()          # old name (no --) → dict(new, kind, note)
    def rec(old, new, kind, note=""):
        if old in rmap and rmap[old]["kind"] != "removed":
            return
        rmap[old] = {"new": new, "kind": kind, "note": note}

    lines = ["/* PeraSure tokens v2 — generated by rebrand/tokens/v2/build.py. Do not edit by hand.",
             "   Tiers: --palette-* (primitives, never used by screens) → semantic (--content-*, --surface-*, --bg-*, --border-*) → component (--tag-*, …).",
             "   Old names live in legacy-aliases.css until the codemod has run (phase 3). */", ":root {"]
    def decl(n, v): lines.append(f"  --{n}: {v};")

    lines.append("  /* palette (primitives) */")
    for fam, sc in PALETTE.items():
        for s, h in sc.items():
            decl(f"palette-{fam}-{s}", h)
    for fam, sc in ALPHA.items():
        for s, v in sc.items():
            decl(f"palette-alpha-{fam}-{s}", v)

    # old primitives → palette
    for fam in ("green", "neutral", "ambient", "red", "navy"):
        for s in PALETTE[fam]:
            rec(f"color-{fam}-{s}", f"palette-{fam}-{s}", "rename", "primitive; screens should use a semantic token")
    for k in list(OLD):
        m = re.fullmatch(r"color-alpha-(white|black|cold-black|grey|green|blue)-(\d+)", k)
        if m:
            fam = {"cold-black": "navy", "green": "deep-green"}.get(m.group(1), m.group(1))
            if fam == "blue":
                tgt = f"palette-alpha-white-{m.group(2)}"
                rec(k, tgt, "removed", "blue removed; alias keeps glass glows as white")
            else:
                rec(k, f"palette-alpha-{fam}-{m.group(2)}", "rename", "primitive")
    # old blue primitives and semantic scale re-exports
    # owner 2026-11-20: green replaces the legacy blue scale step for step (950 = #000128 is the navy brand itself)
    BLUE_TO = {50: "green-50", 100: "green-100", 200: "green-200", 300: "green-300", 400: "green-400", 500: "green-500",
               600: "green-600", 700: "green-700", 800: "green-800", 900: "green-900", 950: "navy-900"}
    for s, t in BLUE_TO.items():
        rec(f"color-blue-{s}", f"palette-{t}", "removed", "blue removed; alias points at the rebrand equivalent")
        rec(f"color-brand-{s}", f"palette-{t}", "removed", "scale re-export removed; use a role (content-brand, surface-brand…)")
    for s in PALETTE["green"]:
        rec(f"color-positive-{s}", f"palette-green-{s}", "removed", "scale re-export removed; use bg/content/border-positive")
    for s in PALETTE["red"]:
        rec(f"color-negative-{s}", f"palette-red-{s}", "removed", "scale re-export removed; use bg/content/border-negative")
    for fam in ("warning", "marketing", "yellow", "pink"):
        for s in (50, 100, 200, 300, 400, 500, 600, 700):
            rec(f"color-{fam}-{s}", None, "removed", "owner: pink/yellow removed (legacy); no replacement")

    lines.append("  /* semantic colour */")
    for css, path, ref, scopes, replaces in SEM:
        decl(css, pal(ref))
        for o in replaces:
            old = o if o.startswith(("surface-device", "overlay-shade")) else o
            rec(f"color-{old}", css, "rename" if len(replaces) == 1 else "merge")
    for n in GRAD_AMBIENT:
        decl(f"gradient-ambient-{n}", f"color-mix(in srgb, var(--palette-ambient-100) calc(var(--layer-opacity-{n}) * 100%), transparent)")
        rec(f"color-gradient-ambient-{n}", f"gradient-ambient-{n}", "rename")

    lines.append("  /* component: coupon gradient */")
    for k, ref in COUPON.items():
        decl(f"coupon-gradient-{k}", pal(ref))
    lines.append("  /* component: tag */")
    for tone, parts in TAG.items():
        for part, ref in parts.items():
            decl(f"tag-{tone}-{part}", pal(ref))
    for tone_old, tone in TAG_TONE_OLD.items():
        for p_old, p in TAG_OLD.items():
            if p in TAG[tone]:
                rec(f"tag-color-{tone_old}-{p_old}", f"tag-{tone}-{p}", "rename", "brand tone is now 'accent' (green)" if tone_old == "brand" else "")

    # kept non-colour tokens, with targeted changes
    lines.append("  /* kept: spacing, radius, stroke, blur, layer opacity, typography (values changed: one typeface) */")
    kept_values = OrderedDict()
    for k, v in OLD.items():
        if k.startswith("color-") or k.startswith("tag-color-"):
            continue
        if k in REMOVED_FONTS:
            continue
        if k.startswith("font-family-") and k[len("font-family-"):] in FONT_FAMILY_ROLES:
            v = "var(--font-family-hanken-grotesk)"
        if k.startswith("shadow-"):
            continue
        # rewrite references to renamed colour tokens
        v = re.sub(r"var\(--(color-[a-z0-9-]+)\)", lambda m: f"var(--{rmap[m.group(1)[0:]]['new']})" if m.group(1) in rmap and rmap[m.group(1)]['new'] else m.group(0), v)
        kept_values[k] = v
        decl(k, v)
    for k in REMOVED_FONTS:
        rec(k, "font-family-hanken-grotesk", "removed", "owner: one typeface (Hanken Grotesk)")
    lines.append("  /* elevation (was shadow-*) */")
    for new, old in ELEVATION.items():
        v = OLD[old]
        v = re.sub(r"var\(--(color-[a-z0-9-]+)\)", lambda m: f"var(--{rmap[m.group(1)]['new']})", v)
        decl(new, v)
        rec(old, new, "rename")
    lines.append("  /* new */")
    for k, v in NEW_OTHER.items():
        decl(k, v)
    lines.append("}")

    # text classes
    lines.append("/* text styles — Hanken Grotesk for everything (owner) */")
    old_css = (SRC / "demo-tokens.css").read_text()
    class_body = {}
    for cls, (src, w, ls) in TEXT.items():
        m = re.search(rf"^\.ps-text-{re.escape(src)}\s*\{{([^}}]*)\}}", old_css, re.M)
        body = m.group(1)
        body = re.sub(r"font-weight: var\(--font-weight-[a-z-]+\)", f"font-weight: var(--font-weight-{w})", body)
        body = re.sub(r"letter-spacing: [^;]+", f"letter-spacing: {ls}", body)
        class_body[cls] = body
        lines.append(f".ps-text-{cls} {{{body}}}")
    for s_, src in AMOUNT.items():
        m = re.search(rf"^\.ps-text-{src}\s*\{{([^}}]*)\}}", old_css, re.M)
        body = m.group(1)
        body = re.sub(r"font-family: var\(--font-family-[a-z-]+\)", "font-family: var(--font-family-amount)", body)
        body = re.sub(r"font-weight: var\(--font-weight-[a-z-]+\)", "font-weight: var(--font-weight-bold)", body)   # owner look parity 2026-11-21: amounts = legacy Bold 700 (was black 800)
        body = re.sub(r"letter-spacing: [^;]+", f"letter-spacing: {AMOUNT_TRACK[s_]}", body)
        body = body.rstrip().rstrip(";") + "; font-variant-numeric: tabular-nums lining-nums; "
        class_body[f"amount-{s_}"] = body
        lines.append(f".ps-text-amount-{s_} {{{body}}}")
    # composite style variables, same names as the developers' generated CSS (--body-md-font-size …)
    comp = [":root {"]
    for cls, body in class_body.items():
        d = dict((k.strip(), v.strip()) for k, v in (x.split(":", 1) for x in body.split(";") if ":" in x))
        for prop in ("font-family", "font-size", "font-weight", "line-height", "letter-spacing"):
            if prop in d:
                comp.append(f"  --{cls}-{prop}: {d[prop]};")
        comp += [f"  --{cls}-paragraph-spacing: 0;", f"  --{cls}-text-decoration: none;", f"  --{cls}-text-transform: none;"]
    comp.append("}")
    lines.extend(comp)
    # old composite style variables (developers' --section-title-sm-font-size …) → the surviving style
    for old, new in {**TEXT_MERGED, **AMOUNT_MERGED}.items():
        for prop in STYLE_PROPS:
            rec(f"{old}-{prop}", f"{new}-{prop}", "merge", "text style merged (TYPE-AND-STYLES.md)")
    tokens_css = "\n".join(lines) + "\n"

    # aliases
    al = ["/* PeraSure tokens v2 — legacy aliases. Every old name that was renamed or removed → its v2 token.",
          "   Load AFTER tokens.css. Phase 1: the app works unchanged. Phase 3: run migrate-tokens.mjs. Phase 4: delete this file. */", ":root {"]
    for old, r in rmap.items():
        if r["new"]:
            al.append(f"  --{old}: var(--{r['new']});")
    al.append("}")
    al.append("/* old text classes → the surviving style */")
    for old, new in {**TEXT_MERGED, **AMOUNT_MERGED}.items():
        al.append(f".ps-text-{old} {{{class_body[new]}}}")
    aliases_css = "\n".join(al) + "\n"
    global CLASS_MAP
    CLASS_MAP = {f"ps-text-{o}": f"ps-text-{n}" for o, n in {**TEXT_MERGED, **AMOUNT_MERGED}.items()}

    # kept list (for the map): non-colour names that stayed
    for k in kept_values:
        if not k.startswith("palette-"):
            rmap.setdefault(k, {"new": k, "kind": "kept", "note": ""})
    # new tokens
    news = [c for c, *_ in SEM if not any(f"color-{o}" in rmap and rmap[f"color-{o}"]["new"] == c for o in [])]
    for k in list(rmap):
        rmap[k]["uses"] = use.get(k, 0)
    return tokens_css, aliases_css, rmap


def write_mapping_md(rmap):
    groups = OrderedDict([("Colour — primitives", lambda k: re.match(r"color-(green|neutral|ambient|red|navy|blue|alpha|yellow|pink)-", k)),
                          ("Colour — semantic", lambda k: k.startswith("color-")),
                          ("Tag (component)", lambda k: k.startswith("tag-")),
                          ("Typography", lambda k: k.startswith(("font-", "body-", "caption-", "title-", "label-", "display-", "headline-", "section-", "number-", "link-", "letter-", "paragraph-", "text-"))),
                          ("Effects", lambda k: k.startswith(("shadow-", "elevation-", "blur-", "gradient-"))),
                          ("Spacing, radius, stroke, opacity", lambda k: True)])
    placed = set(); out = ["# Old → new token map (v2)", "",
        "Generated by `rebrand/tokens/v2/build.py`. Every token the old system had, and what it is now. Kinds: **kept** (same name; value may",
        "differ, e.g. fonts), **rename** (1 old → 1 new), **merge** (several old → 1 new), **removed** (alias points at the closest v2 token, or",
        "nothing). *Uses* = occurrences in the live app (`phi_h5_025/src`). Tokens marked ⏳ wait for the green-text decision.", ""]
    c = Counter(r["kind"] for r in rmap.values())
    out.append(f"Totals: {dict(c)} · live-app uses of renamed/merged/removed names: "
               f"{sum(r['uses'] for r in rmap.values() if r['kind'] != 'kept')} (handled by legacy-aliases.css, then the codemod).")
    out.append("")
    for title, f in groups.items():
        rows = [(k, r) for k, r in rmap.items() if k not in placed and f(k)]
        if not rows:
            continue
        out += [f"## {title}", "", "| Old | New | Kind | Uses | Note |", "|---|---|---|---|---|"]
        for k, r in sorted(rows, key=lambda x: (x[1]["kind"], x[0])):
            placed.add(k)
            new = f"`--{r['new']}`" if r["new"] else "—"
            out.append(f"| `--{k}` | {new} | {r['kind']} | {r['uses']} | {r['note']} |")
        out.append("")
    newset = sorted({c for c, *_ in SEM} - {r["new"] for r in rmap.values()} | set(NEW_OTHER))
    out += ["## New in v2 (no old equivalent)", "", ", ".join(f"`--{n}`" for n in newset), ""]
    (HERE / "MAPPING.md").write_text("\n".join(out))


CODEMOD = r"""#!/usr/bin/env node
// PeraSure tokens v2 codemod — rewrites var(--old) → var(--new) from rename-map.json.
// Usage: node migrate-tokens.mjs <src-dir-or-file> [--write]   (dry run without --write: prints what would change)
// Removed tokens with no replacement are left alone and listed. Review the diff before committing.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const full = JSON.parse(fs.readFileSync(path.join(here, 'rename-map.json'), 'utf8'));
const map = full.tokens; const classes = full.classes || {};
const [dir, flag] = process.argv.slice(2); const write = flag === '--write';
if (!dir) { console.error('usage: node migrate-tokens.mjs <src-dir> [--write]'); process.exit(1); }
const exts = new Set(['.css', '.scss', '.ts', '.tsx', '.js', '.jsx', '.html']);
const pairs = Object.entries(map).filter(([o, r]) => r.new && r.new !== o).sort((a, b) => b[0].length - a[0].length);
const re = new RegExp('--(' + pairs.map(([o]) => o.replace(/[-]/g, '\\-')).join('|') + ')(?![a-z0-9-])', 'g');
const lookup = Object.fromEntries(pairs);
const cpairs = Object.keys(classes).sort((a, b) => b.length - a.length);
const cre = cpairs.length ? new RegExp('(?<![a-z0-9-])(' + cpairs.map(c => c.replace(/[-]/g, '\\-')).join('|') + ')(?![a-z0-9-])', 'g') : null;
let files = 0, hits = 0; const orphans = new Map();
function walk(p) {
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const f = path.join(p, e.name);
    if (e.isDirectory()) walk(f); else if (exts.has(path.extname(f)) && !/figma-tokens\.css$|legacy-aliases\.css$|tokens\.css$/.test(f)) fix(f);
  }
}
function fix(f) {
  const s = fs.readFileSync(f, 'utf8'); let n = 0;
  let out = s.replace(re, (m, old) => { n++; return '--' + lookup[old].new; });
  if (cre) out = out.replace(cre, (m, old) => { n++; return classes[old]; });
  for (const [o, r] of Object.entries(map)) if (!r.new && s.includes('--' + o)) orphans.set(o, (orphans.get(o) || 0) + 1);
  if (n) { files++; hits += n; console.log(`${write ? 'fixed' : 'would fix'} ${n}\t${f}`); if (write) fs.writeFileSync(f, out); }
}
if (fs.statSync(dir).isDirectory()) walk(dir); else fix(dir);
console.log(`\n${hits} replacements in ${files} files${write ? '' : ' (dry run; add --write)'}`);
if (orphans.size) console.log('removed tokens with no replacement still used (check by hand):', Object.fromEntries(orphans));
"""


def _hex(v):
    v = v.strip()
    m = re.fullmatch(r"rgb\((\d+) (\d+) (\d+) / ([\d.]+)\)", v)
    if m:
        r, g, b, a = int(m.group(1)), int(m.group(2)), int(m.group(3)), float(m.group(4))
        return "#%02x%02x%02x%02x" % (r, g, b, round(a * 255))
    return v


def _tok(css, typ, value, scopes=None, hidden=False):
    ext = {"com.figma.hiddenFromPublishing": hidden, "com.figma.codeSyntax": {"Web": f"var(--{css})"}}
    if scopes is not None:
        ext = {"com.figma.scopes": scopes, **ext}
    return {"$extensions": ext, "$type": typ, "$value": value}


def _set(tree, path, leaf):
    node = tree
    for part in path[:-1]:
        node = node.setdefault(part, {})
    node[path[-1]] = leaf


def _ref(ref):           # 'navy-900' → {Color.Navy.900}; 'alpha-deep-green-6' → {Color.Alpha.Deep Green.6}
    if ref.startswith("alpha-"):
        fam, step = ref[len("alpha-"):].rsplit("-", 1)
        return "{Color.Alpha.%s.%s}" % (" ".join(w.title() for w in fam.split("-")), step)
    fam, step = ref.rsplit("-", 1)
    return "{Color.%s.%s}" % (fam.title(), step)


def tag_path(part):       # 'bg' → ['Bg', 'Default'] so 'Bg' is a group, never also a token
    p = [w.title() for w in part.split("-")]
    return p + ["Default"] if len(p) == 1 and p[0] in ("Bg", "Content") else p


def build_dev_json():
    """Developers' format (phi_h5_025 tokens/figma-tokens.json): same structure, v2 names, one mode 'Light'."""
    old = json.loads((SRC / "dev-figma-tokens.json").read_text())
    P, S, C = old["Primitive/Mode 1"], old["Semantic/Mode 1"], old["Component/Mode 1"]
    # primitives: palette
    col = OrderedDict()
    for fam, sc in PALETTE.items():
        col[fam.title()] = {str(s): _tok(f"palette-{fam}-{s}", "color", h, [], True) for s, h in sc.items()}
    col["Alpha"] = {" ".join(w.title() for w in fam.split("-")): {str(s): _tok(f"palette-alpha-{fam}-{s}", "color", _hex(v), [], True) for s, v in sc.items()}
                    for fam, sc in ALPHA.items()}
    P["Color"] = col
    P["Font"]["Family"].pop("Inter", None)
    # semantic colour
    sem = OrderedDict()
    for css, path, ref, scopes, _ in SEM:
        _set(sem, path.split("/"), _tok(css, "color", _ref(ref), scopes))
    S["Color"] = sem
    # one typeface
    for k in list(S["Font"]["Family"]):
        S["Font"]["Family"][k]["$value"] = "{Font.Family.Hanken Grotesk}"
    S["Font"]["Family"]["Amount"] = _tok("font-family-amount", "text", "{Font.Family.Hanken Grotesk}", ["FONT_FAMILY"])
    for k, t in S.get("fontWeights", {}).items():
        t["$value"] = {"Semi Bold": "SemiBold"}.get(t["$value"], t["$value"])
    # their CSS script turns weights / tracking into CSS values only through references, so the styles point at tokens
    WEIGHT = {"regular": "{fontWeights.inter-0}", "medium": "{fontWeights.hanken-grotesk-2}", "semi-bold": "{fontWeights.hanken-grotesk-1}",
              "bold": "{fontWeights.hanken-grotesk-5}", "black": "{fontWeights.hanken-grotesk-6}"}
    S["letterSpacing"]["7"] = {"$type": "letterSpacing", "$value": "-2%", "$extensions": {"com.figma.codeSyntax": {"Web": "var(--letter-spacing-7)"}}}
    S["letterSpacing"]["8"] = {"$type": "letterSpacing", "$value": "3%", "$extensions": {"com.figma.codeSyntax": {"Web": "var(--letter-spacing-8)"}}}
    S["letterSpacing"]["9"] = {"$type": "letterSpacing", "$value": "4%", "$extensions": {"com.figma.codeSyntax": {"Web": "var(--letter-spacing-9)"}}}
    AMOUNT_TRACK_REF = {"0.02em": "{letterSpacing.2}", "0.03em": "{letterSpacing.8}", "0.04em": "{letterSpacing.9}"}
    TRACK = {"0": "{letterSpacing.0}", "-0.005em": "{letterSpacing.4}", "-0.01em": "{letterSpacing.3}", "-0.02em": "{letterSpacing.7}"}
    def old_node(cls):     # 'section-title-md' → S['Section-title']['md']; 'body-lg-emphasis' → S['Body']['lg-emphasis']
        if cls.startswith("section-title-"):
            return S["Section-title"][cls[len("section-title-"):]]
        g, k = cls.split("-", 1)
        return S[g.title()][k]
    import copy as _copy
    styles = OrderedDict()
    for cls, (src, w, ls) in TEXT.items():
        node = _copy.deepcopy(old_node(src))
        node["$value"]["fontWeight"] = WEIGHT[w]
        node["$value"]["letterSpacing"] = TRACK[ls]
        node["$extensions"] = {"com.figma.codeSyntax": {"Web": f"var(--{cls})"}}
        g, k = cls.split("-", 1)
        styles.setdefault(g.title(), OrderedDict())[k] = node
    for g in ("Caption", "Section-title", "Body", "Label", "Title", "Headline", "Display", "Amount", "Link"):
        S.pop(g, None)
    S.update(styles)
    AMOUNT_SIZES = {"xs": (16, 20), "md": (24, 32), "lg": (32, 40), "xxl": (48, 48)}
    S["Amount"] = {s: {"$type": "typography", "$value": {"fontFamily": "{Font.Family.Amount}", "fontWeight": "{fontWeights.hanken-grotesk-5}", "lineHeight": "{Font.Line-height.%d}" % lh,
                                                          "fontSize": "{Font.Size.%d}" % fs, "letterSpacing": AMOUNT_TRACK_REF[AMOUNT_TRACK[s]], "paragraphSpacing": "{paragraphSpacing.0}",
                                                          "paragraphIndent": "{paragraphIndent.0}", "textCase": "{textCase.none}",
                                                          "textDecoration": "{textDecoration.none}"},
                       "$extensions": {"com.figma.codeSyntax": {"Web": f"var(--amount-{s})"}}} for s, (fs, lh) in AMOUNT_SIZES.items()}
    # elevation (was shadow)
    for key, css in (("Default", "elevation-raised"), ("Over", "elevation-overlay"), ("Focus", "elevation-focus")):
        if key in S.get("Shadow", {}):
            S["Shadow"][key]["$extensions"]["com.figma.codeSyntax"]["Web"] = f"var(--{css})"
            S["Shadow"][key]["$value"] = [dict(x, color=x["color"]) for x in S["Shadow"][key]["$value"]]
    # new number tokens
    num = lambda css, v, scopes: _tok(css, "number", v, scopes)
    S["Size"] = {"Control": {s: num(f"size-control-{s}", v, ["WIDTH_HEIGHT"]) for s, v in (("sm", 36), ("md", 44), ("lg", 48))},
                 "Icon": {s: num(f"size-icon-{s}", v, ["WIDTH_HEIGHT"]) for s, v in (("xs", 16), ("sm", 20), ("md", 24), ("lg", 32))},
                 "Touch-min": num("size-touch-min", 44, ["WIDTH_HEIGHT"])}
    for k, v in (("control", "{Radius.999}"), ("card", "{Radius.24}"), ("sheet", "{Radius.32}"), ("tooltip", "{Radius.12}")):
        S["Radius"][k] = num(f"radius-{k}", v, ["CORNER_RADIUS"])
    S["Stroke"]["Width"]["Focus"] = num("stroke-width-focus", 2, ["STROKE_FLOAT"])
    # their CSS script appends px to every number (it already emits --layer-opacity-20: 20px); opacities go in as text fractions
    S["Opacity"] = {"Disabled": _tok("opacity-disabled", "text", "0.4", ["OPACITY"]), "Pressed": _tok("opacity-pressed", "text", "0.1", ["OPACITY"])}
    S["Motion"] = {"Duration": {k: num(f"motion-duration-{k}", v, []) for k, v in (("instant", 80), ("fast", 150), ("base", 240), ("slow", 360))},
                   "Easing": {k: _tok(f"motion-easing-{k}", "text", v, []) for k, v in (("standard", "cubic-bezier(0.2, 0, 0, 1)"),
                              ("enter", "cubic-bezier(0, 0, 0, 1)"), ("exit", "cubic-bezier(0.3, 0, 1, 1)"))}}
    # component: tag
    tag = OrderedDict()
    for tone, parts in TAG.items():
        for part, ref in parts.items():
            _set(tag, [tone.title()] + tag_path(part), _tok(f"tag-{tone}-{part}", "color", _ref(ref), ["ALL_FILLS", "STROKE_COLOR"]))
    C["Tag"] = tag
    C["Coupon"] = {"Gradient": {k.title(): _tok(f"coupon-gradient-{k}", "color", _ref(ref), ["FRAME_FILL", "SHAPE_FILL"]) for k, ref in COUPON.items()}}
    out = OrderedDict([("Semantic/Light", S), ("Primitive/Light", P), ("Component/Light", C), ("$themes", []),
                       ("$metadata", {"tokenSetOrder": ["Semantic/Light", "Primitive/Light", "Component/Light"]})])
    return out


def main():
    tokens_css, aliases_css, rmap = build()
    (HERE / "figma-tokens.json").write_text(json.dumps(build_dev_json(), indent=2, ensure_ascii=False) + "\n")
    (HERE / "tokens.css").write_text(tokens_css)
    (HERE / "legacy-aliases.css").write_text(aliases_css)
    (HERE / "rename-map.json").write_text(json.dumps({"version": "2.0.0-draft", "date": "2026-11-19", "tokens": rmap, "classes": CLASS_MAP}, indent=1, ensure_ascii=False) + "\n")
    write_mapping_md(rmap)
    # DTCG source for colour + new tokens
    dt = OrderedDict()
    dt["palette"] = {f: {str(s): {"$type": "color", "$value": h} for s, h in sc.items()} for f, sc in PALETTE.items()}
    dt["semantic"] = {css: {"$type": "color", "$value": "{palette." + ref.replace("alpha-", "alpha.", 1).replace("-", ".", 1) + "}",
                            "$extensions": {"figma": {"path": path, "scopes": scopes}, "replaces": replaces}} for css, path, ref, scopes, replaces in SEM}
    dt["other"] = {k: {"$value": v} for k, v in NEW_OTHER.items()}
    (HERE / "tokens.json").write_text(json.dumps(dt, indent=1) + "\n")
    (HERE / "migrate-tokens.mjs").write_text(CODEMOD)
    # self-checks
    defined = set(re.findall(r"--([a-z0-9-]+)\s*:", tokens_css))
    refs = set(re.findall(r"var\(--([a-z0-9-]+)", tokens_css))
    dangling = sorted(r for r in refs - defined if not r.startswith("ps-"))
    alias_refs = set(re.findall(r"var\(--([a-z0-9-]+)\)", aliases_css))
    print("tokens.css vars:", len(defined), "| dangling refs:", dangling)
    print("aliases:", aliases_css.count("\n  --"), "| alias targets missing:", sorted(alias_refs - defined))
    print("map kinds:", dict(Counter(r["kind"] for r in rmap.values())))
    stale = [l for l in tokens_css.splitlines() if re.search(r"var\(--color-", l)]
    print("old --color-* refs left in tokens.css:", stale[:3])


if __name__ == "__main__":
    main()
