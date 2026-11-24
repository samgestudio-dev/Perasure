# Semantic layer restructure (2026-11-21): APPLIED in Figma copy kYyNV2MgxvH1w9bJ46A3yx

The owner's request: "The whole semantic layer is messy; restructure it after the tokens of the top open-source internet companies."

## What is wrong today (≈125 colour semantics + 36 component tokens)

1. **Four overlapping groups.** Content / Surface / Bg / Border mix two axes. Surface vs Bg has no rule: there is both Surface/Default and Bg/Inverse = white, and both Surface/Brand/Default and Bg/Brand/Default = navy.
2. **Duplicates with different names.**
   - Content/Brand/Default = Brand/Strong = Primary.
   - Border/Subtle = Border/Filled.
   - Border/Strong = Border/Control.
   - Bg/Tint/Minimum = Bg/Tint/Navy-subtle (both navy 6 %).
3. **One role, several names.** Green is called Accent, Action, Brand-strong, Positive and Selected, with no rule for which is which. Navy is called Brand and Inverse.
4. **Inconsistent emphasis words.** Subtle / Faint / Muted / Minimum / Strong / Heavy / Default are used differently in each group: Accent-heavy vs Positive/Strong vs Accent/Strong.
5. **Leftovers:** Content/Brand/* is navy text, Gradient/Grey has no grey any more, and Device/Mist vs Tint/Default are two names for the same value.

## Reference model

- **GitHub Primer** (primitives v8) gives the axes:
  - `fgColor` / `bgColor` / `borderColor`, crossed with role (`default`, `accent`, `success`, `attention`, `danger`) and emphasis (`muted`, `emphasis`, `onEmphasis`).
  - It is the most widely referenced open-source token system.
- **Atlassian** and **Shopify Polaris** give the state suffixes (`-pressed`, `-disabled`, `-selected`) and component tokens kept separate from the semantic layer.
- PeraSure is mobile-first, so there are no hover states.

## The new grammar

```
{property}/{role}[-{emphasis}][-{state}]
property  fg (text + icons) · bg · border · overlay · shadow · gradient
role      (none = neutral) · accent (green) · brand (navy surfaces) · success · danger · attention (orange) · selected · focus · disabled
emphasis  subtle < muted < (default) < emphasis < strong
state     -pressed · -disabled
on-colour fg/on-emphasis (white on dark or strong fills) · fg/on-accent (navy on green)
```

- **Names:** Figma names are lowercase with slash groups (`fg/default`). CSS is `--fg-default`.
- **Component tokens** live in their own namespace (`tag/…`, `coupon/…`, `control/…`) and alias the semantic layer, not primitives.

## Mapping (old → new; ⊕ = merged into an existing token)

### fg: text and icons
| Old | New | Value |
|---|---|---|
| Content/Primary · Content/Brand/Default ⊕ · Content/Brand/Strong ⊕ | `fg/default` | Navy 900 |
| Content/Secondary · Content/Brand/Subtle ⊕ | `fg/muted` | Navy 600 |
| Content/Tertiary | `fg/subtle` | Navy 500 |
| Content/Placeholder | `fg/placeholder` | Navy 400 |
| Content/Disabled | `fg/disabled` | Navy 400 |
| Content/Inverse | `fg/on-emphasis` | White |
| Content/On-action | `fg/on-accent` | Navy 900 |
| Content/Accent-strong | `fg/accent` | Green 700 |
| Content/Accent-heavy | `fg/accent-strong` | Green 800 |
| Content/Link/Default · Content/Link/Pressed | `fg/link` · `fg/link-pressed` | Green 700 · 800 |
| Content/Accent · Content/Accent-pressed | `fg/accent-on-brand` · `fg/accent-on-brand-pressed` | Green 500 · 400 (on navy) |
| Content/Selected | `fg/selected` | Green 500 |
| Content/Positive/Default · /Strong | `fg/success` · `fg/success-strong` | Green 700 · 800 |
| Content/Negative/Default · /Strong · /Subtle | `fg/danger` · `fg/danger-strong` · `fg/danger-muted` | Red 600 · 700 · 500 |
| Content/Urgent | `fg/attention` | Orange 500 |

### bg: surfaces and fills
| Old | New | Value |
|---|---|---|
| Surface/Default · Surface/Raised ⊕ · Bg/Inverse ⊕ | `bg/default` | White |
| Surface/Page/Default · Subtle · Strong | `bg/page` · `bg/page-subtle` · `bg/page-strong` | Mist 100 · 50 · 200 |
| Surface/Sunken | `bg/inset` | Mist 100 |
| Surface/Muted · Bg/Neutral/Default ⊕ | `bg/muted` | Navy 100 |
| Bg/Neutral/Subtle | `bg/subtle` | Navy 50 |
| Bg/Neutral/Strong | `bg/neutral-emphasis` | Navy 400 |
| Bg/Disabled | `bg/disabled` | Navy 100 |
| Surface/Inverse | `bg/inverse` | Navy 900 |
| Surface/Brand/Default · Bg/Brand/Default ⊕ | `bg/brand` | Navy 900 |
| Bg/Brand/Pressed · Bg/Brand/Muted | `bg/brand-pressed` · `bg/brand-muted` | Navy 800 · 600 |
| Bg/On-brand | `bg/on-brand` | White 24 % |
| Surface/Glass/Default · Subtle | `bg/glass` · `bg/glass-subtle` | White 80 % · 60 % |
| Bg/Tint/Minimum · Bg/Tint/Navy-subtle ⊕ | `bg/neutral-alpha-subtle` | Navy 6 % |
| Bg/Tint/Subtle · Bg/Tint/Navy-default ⊕ | `bg/neutral-alpha-muted` | Navy 20 % |
| Bg/Tint/Default · Strong | `bg/neutral-alpha` · `bg/neutral-alpha-strong` | Navy 40 % · 60 % |
| Surface/Tint/Default · Surface/Device/Mist ⊕ | `bg/tint` | Mist 300 |
| Surface/Device/Navy | `bg/brand-pressed` ⊕ | Navy 800 |
| Surface/Brand/Subtle | `bg/accent-subtle` | Green 50 |
| Bg/Action/Subtle · Subtle-pressed | `bg/accent-muted` · `bg/accent-muted-pressed` | Green 100 · 200 |
| Bg/Action/Default · Pressed | `bg/accent-emphasis` · `bg/accent-emphasis-pressed` | Green 500 · 600 |
| Surface/Positive/Subtle | `bg/success-subtle` | Green 50 |
| Bg/Positive/Subtle · Subtle-pressed | `bg/success-muted` · `bg/success-muted-pressed` | Green 100 · 200 |
| Bg/Positive/Default · Pressed | `bg/success` · `bg/success-pressed` | Green 400 · 500 |
| Bg/Positive/Strong · Strong-pressed | `bg/success-emphasis` · `bg/success-emphasis-pressed` | Green 500 · 600 |
| Bg/Positive/Disabled | `bg/success-disabled` | Green 200 |
| Bg/Negative/Subtle · Default · Pressed · Disabled | `bg/danger-muted` · `bg/danger-emphasis` · `bg/danger-emphasis-pressed` · `bg/danger-disabled` | Red 50 · 600 · 700 · 300 |
| Surface/Urgent/Subtle · Bg/Urgent/Subtle | `bg/attention-subtle` · `bg/attention-muted` | Orange 50 · 100 |

### border
| Old | New | Value |
|---|---|---|
| Border/Default | `border/default` | Navy 300 |
| Border/Subtle · Border/Filled ⊕ | `border/muted` | Navy 200 |
| Border/Strong · Border/Control ⊕ | `border/emphasis` | Navy 400 |
| Border/Focused | `border/focus` | Green 400 |
| Border/Selected/Default · Subtle | `border/selected` · `border/selected-muted` | Green 400 · 200 |
| Border/Accent/Faint · Subtle | `border/accent-subtle` · `border/accent-muted` | Green 100 · 200 |
| Border/Brand-strong | `border/accent-emphasis` | Green 500 |
| Border/Accent/Strong | `border/accent-strong` | Green 700 |
| Border/Positive/Subtle · Default · Strong | `border/success-muted` · `border/success` · `border/success-emphasis` | Green 200 · 400 · 500 |
| Border/Negative/Subtle · Default · Strong | `border/danger-muted` · `border/danger` · `border/danger-emphasis` | Red 200 · 500 · 600 |
| Border/Urgent/Subtle | `border/attention` | Orange 300 |
| Border/On-brand | `border/on-brand` | White 24 % |

### overlay · shadow · gradient
| Old | New |
|---|---|
| Overlay/Scrim/Default · Top · Mid · Bottom | `overlay/scrim` · `overlay/scrim-top` · `overlay/scrim-mid` · `overlay/scrim-bottom` |
| Overlay/Shade | `overlay/shade` |
| Shadow-color/{Default,Subtle,Focus}/{1,2} · Backdrop | `shadow/{default,subtle,focus}-{1,2}` · `shadow/backdrop` |
| Gradient/White/* · Gradient/Mist/* · Gradient/Grey/* | `gradient/white-*` · `gradient/mist-*` · `gradient/neutral-*` |

### Component tokens (Component collection; they alias semantics)
| Old | New |
|---|---|
| Tag/{Neutral,Accent,Navy,Positive,Negative}/… | `tag/{neutral,accent,brand,success,danger}/{bg, bg-subtle, bg-emphasis, fg, fg-on-emphasis, border}` (+ `tag/neutral/bg-inverse`, `bg-alpha`) |
| Coupon/Gradient/Top · Upper · Mid · Bottom | `coupon/gradient-top` · `-upper` · `-mid` · `-bottom` |
| Bg/Selected (moved here) | `control/checked-bg` (checks, radios, toggles: Green 500) |

## Effect

- About 125 → 104 colour semantics: 12 duplicates merged, Bg/Selected moved to the component layer, Device/Navy merged into brand-pressed.
- Every value stays the same, so nothing changes visually.
- **Rename in place:** variable IDs stay, so all component bindings follow automatically. Merged tokens are re-pointed to the kept token and then deleted.
- Code syntax is updated to `var(--fg-default)` etc. Code tokens v3 are generated from this.

## Applied (2026-11-21, owner: "apply")

- **Merged** (14 deleted after re-pointing): 158 bindings on Component - Rebranding and 189 on Design - Rebranding. A check found no references left.
- **control/checked-bg** (`VariableID:15025:15`) created in the Component collection; it replaces Bg/Selected.
- **Renamed:** 142 Semantic and Component colour variables, with code syntax `var(--fg-default)` etc. IDs are kept, so all bindings follow.
- **Tag tokens:** 26 now alias the semantic layer (values identical). Kept on primitives because no semantic with the same role exists:
  - tag/neutral/bg-emphasis (Navy 600);
  - tag/accent/border (Green 400);
  - tag/brand/bg, bg-subtle and border (Mist 100 / 50, Navy 900);
  - tag/danger/bg (Red 100);
  - coupon/gradient-*.
- **Not renamed:** the Legacy collections, and the 4 nav-gradient paint styles (still on Legacy).
