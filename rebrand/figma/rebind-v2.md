# figma-lib · rebind plan: 7 components → tokens v2 (draft, 2026-11-19)

Prepared while Figma is paused, from `tokens/v2/rename-map.json` + `tokens/v2/tokens.css`. Applied once the coordinator says the v2
collections and styles are in Figma. Items marked **GAP** need a coordinator decision before the rebind.

## Direct renames (no decision needed)

| Old Figma variable | v2 | Used in |
|---|---|---|
| Color/Action/Bg/Primary/Default | `Bg/Action` | Button Primary, Chip Selected |
| Color/Action/Bg/Primary/Pressed | `Bg/Action/Pressed` | Button Primary pressed |
| Color/Action/Bg/Primary/Disabled | `Bg/Disabled` | Button disabled (all variants) |
| Color/Action/Text/Default | `Content/On-action` | Button Primary label, Chip Selected label |
| Color/Action/Text/Disabled, Color/Text/Disabled | `Content/Disabled` | disabled labels |
| Color/Action/Stroke/Default | `Border/Subtle` | Button Secondary disabled ring |
| Color/Surface/Card/Default | `Surface/Default` | Button Secondary, Chip, Check off, Tag Navy outline |
| Color/Surface/Card/Brand | `Surface/Brand` | Button Navy, Tag Navy strong |
| Color/Surface/Card/Negative | `Bg/Negative` | Button Destructive, Tag Negative strong |
| Color/Surface/Card/Positive | `Bg/Positive` → **Accent: use `Bg/Action`?** (see GAP 6) | Tag Accent strong |
| Color/Surface/Card/Brand-subtle | `Surface/Brand-subtle` | Tag Navy subtle |
| Color/Surface/Inset/Default | `Surface/Sunken` | pressed fills, Chip/Check disabled |
| Color/Stroke/Brand/Default | `Border/Selected` | Button Secondary ring, Tag Navy outline |
| Color/Stroke/Default | `Border/Default` | Chip ring, Check disabled ring |
| Color/Stroke/Subtle | `Border/Subtle` | Chip disabled ring |
| Color/Stroke/Positive/Default | `Border/Positive` → **Accent: same value; keep?** | Chip Selected ring |
| Color/Text/Brand/Default, Color/Icon/Brand/Default | `Content/Brand` | navy labels |
| Color/Text/Primary / Secondary / Tertiary | `Content/Primary` / `Secondary` / `Tertiary` | |
| Color/Text/Inverse, Color/Icon/Inverse | `Content/Inverse` | |
| Color/Text/Link/Default / Heavy / Inverse | `Content/Link` / `Content/Link-pressed` / `Content/Accent` | TextLink |
| Color/Text/Positive/Heavy | `Content/Positive-strong` | Tag Accent text (until GAP 4) |
| Color/Text/Negative/Heavy | `Content/Negative-strong` | Tag Negative text (until GAP 4) |
| Color/Surface/Icon/Brand/Default | `Bg/Selected` (Check on = selection, decision 2) | Check on |
| Color/Surface/Icon/Brand/Disabled | `Bg/Neutral-strong` | Check on-disabled |
| Color/Icon/Positive/Light | `Content/Accent` | Tooltip leading icon |
| Color/Neutral/900 (Tooltip, Toast, Tag Neutral strong) | `Surface/Inverse` | |
| Color/Neutral/400 (× on Tooltip/Toast) | `Content/Placeholder` (#7D878E, 4.5:1 on Ink) | |
| Color/Positive/500 (Toast success circle) | `Bg/Positive` | |
| Color/Icon/Brand/Default (Toast success tick) | `Content/On-action`? no — it is on a positive fill → `Content/Brand` | |
| Color/Negative/400 (Toast error icon on Ink) | `Content/Negative-subtle` (red-500, 4.3:1 on Ink — icon ≥3:1 ✓) | |
| Tag/Color/Brand/Bg/Default · Bg/Subtle · Stroke/Default | `Tag/Accent/Bg` · `Tag/Accent/Bg-subtle` · `Tag/Accent/Border` | Tag tone renamed Brand → **Accent** |
| Tag/Color/Neutral/Bg/Default · Bg/Inverse · Stroke/Default | `Tag/Neutral/Bg` · `Tag/Neutral/Bg-inverse` · `Tag/Neutral/Border` | |
| Tag/Color/Negative/Bg/Default · Bg/Subtle · Stroke/Default | `Tag/Negative/Bg` · `Tag/Negative/Bg-subtle` · `Tag/Negative/Border` | |
| Spacing/*, Radius/*, Stroke/Width/* | same names (kept) | |
| Text styles Label/md, Label/sm, Section-title/xs, Link, Body/md, Caption/sm | same names, Hanken Grotesk values | |
| Effect Shadow/Default · Shadow/Focus | `Elevation/Raised` (Tooltip) · `Elevation/Focus` (Toast) | |

## GAPs (sent to the coordinator)

1. **Pressed fills with no semantic role:** Button Navy pressed (was Brand/400 = navy-600), Button Destructive pressed (was
   Negative/700 = red-700), TextLink Inverse pressed (was Positive/300 = green-300). v2 has no `bg-brand-pressed`,
   `bg-negative-pressed`, `content-accent-pressed`. Proposal: add them (or the `button-*` component tokens from ARCHITECTURE §8).
2. **Check's off ring:** needs a neutral control border ≥3:1. `Border/Strong` (neutral-300) = 2.7:1. Proposal: `Border/Control` =
   neutral-400 (#7D878E, 3.6:1), also for radios/toggles/inputs later.
3. **Button heights:** v2 has `Size/Control/sm 36 · md 44 · lg 52`; Button Large today = 48 (demo `ps-btn--lg` = 3rem). Which is
   Large: 52 (lg) or 44 (md)? Proposal: Large = `size-control-lg` 52? or keep 48 and add a value — coordinator decides.
4. **Tag text contrast in v2 values:** `tag-accent-content` green-700 on `tag-accent-bg` green-100 = 4.1:1; `tag-negative-content`
   red-500 on red-100 ≈ 3.2:1; `tag-neutral-content` neutral-500 on neutral-100 ≈ 3.9:1 — all below 4.5:1 for 11–12 px text.
   Proposal: accent/positive content → green-800, negative → red-700, neutral → neutral-700.
5. **Tag emphasis:** the Tag has Subtle / Strong / Outline; v2 tag tokens are one bg/content/border pair per tone (and
   `tag-navy-content` is white, which only works on `tag-navy-bg`). Proposal: add `tag-<tone>-bg-strong` + `-content-strong`, or
   the Tag uses semantic `Bg/*` + `Content/*` for Strong.
6. **Accent vs positive in Tag/Chip:** Tag tone "Accent" (green) for protected / recommend / chosen; status (paid, verified) should
   be the Positive tone (principle 5). Add Tone=Positive back to the Tag (5 tones × 3 emphasis × 2 sizes = 30 variants)?
7. **Tooltip radius:** v2 `radius-tooltip` = xs 8; built with sm 12. Switch to `Radius/Tooltip` (8)?
