# Tag

Figma: component set `10988:272` (01 · Actions `10982:16`) · 30 variants · showcase `10988:273`
Replaces legacy Term tag, Number tag, State tag, Recommend tag, Extra Documents Verified Tag, borrower protection pill — and the demo's
summary "Chip" pills (✓ Saved, ↑ New limit) = Tag · Outline + icon.

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Tone | VARIANT | Accent · Positive · Navy · Neutral · Negative | Accent | `tone` |
| Emphasis | VARIANT | Subtle · Strong · Outline | Subtle | `emphasis` |
| Size | VARIANT | Medium · Small | Medium | `size: 'medium' \| 'small'` |
| Label | TEXT | | "Tag" | `label` (children) |
| Leading icon | BOOLEAN | | false | shown when `icon` is set |
| Icon | INSTANCE_SWAP | preferred: Check, shield, arrow-up, Pending, Alert circle, Profile-check | Icon / Check | `icon` |

Tone meaning: Accent = green, chosen / protected / recommended · Positive = status green, paid / verified / disbursing · Navy = in progress or
needs the user (Under review, Action needed, New, counts) · Neutral = inactive (Not approved, Add) · Negative = overdue / failed. Non-interactive.

## Parts and tokens

Layout: horizontal auto layout, centred, hugs; Medium 24 px tall, Small 18 px.

| Part | Property | Medium | Small |
|---|---|---|---|
| root | padding top/bottom | `var(--spacing-padding-xs)` 4 | `var(--spacing-padding-2xs)` 2 |
| root | padding left/right | `var(--spacing-padding-sm)` 8 | same |
| root | gap | `var(--spacing-gap-xs)` 4 | `var(--spacing-gap-2xs)` 2 |
| root | radius | `var(--radius-full)` | same |
| root | border (Outline only) | `var(--stroke-width-default)` 1, inside | same |
| Label | text style | `.ps-t-label-sm` (Label/sm) | `.ps-t-caption-xs` (Caption/xs) |
| Icon | size / colour | 12 × 12, colour = label colour | same |

Colours — component tokens, `<t>` = accent · positive · navy · neutral · negative (Figma `Tag/<Tone>/…`):

| Emphasis | Fill | Border | Label |
|---|---|---|---|
| Subtle | `var(--tag-<t>-bg)` [Tag/<Tone>/Bg/Default] | — | `var(--tag-<t>-content)` [Tag/<Tone>/Content/Default] |
| Strong | `var(--tag-<t>-bg-strong)` [Tag/<Tone>/Bg/Strong] | — | `var(--tag-<t>-content-strong)` [Tag/<Tone>/Content/Strong] |
| Outline | none (transparent) | `var(--tag-<t>-border)` [Tag/<Tone>/Border] | `var(--tag-<t>-content)` |

## States

| # | Group | Props |
|---|---|---|
| 0 | Loan state | `tone:'navy', emphasis:'subtle', label:'Under review'` |
| 1 | Loan state | `tone:'positive', emphasis:'strong', label:'Disbursing'` |
| 2 | Loan state | `tone:'neutral', emphasis:'subtle', label:'Not approved'` |
| 3 | Loan state | `tone:'navy', emphasis:'strong', label:'Action needed'` |
| 4 | Loan state | `tone:'positive', emphasis:'subtle', icon:'check', label:'Paid off'` |
| 5 | Protection · verified · recommend | `tone:'accent', emphasis:'outline', icon:'shield', label:'Protected'` |
| 6 | Protection · verified · recommend | `tone:'neutral', emphasis:'outline', label:'Add'` |
| 7 | Protection · verified · recommend | `tone:'positive', emphasis:'subtle', icon:'check', label:'Verified'` |
| 8 | Protection · verified · recommend | `tone:'accent', emphasis:'strong', size:'small', label:'Recommend'` |
| 9 | Terms · counts · overdue | `tone:'neutral', emphasis:'subtle', size:'small', label:'12 terms'` |
| 10 | Terms · counts · overdue | `tone:'navy', emphasis:'strong', size:'small', label:'1'` |
| 11 | Terms · counts · overdue | `tone:'negative', emphasis:'strong', label:'Overdue'` |
| 12 | Terms · counts · overdue | `tone:'negative', emphasis:'subtle', label:'Due in 3 days'` |
| 13 | Terms · counts · overdue | `tone:'navy', emphasis:'outline', icon:'arrow-up', label:'New limit'` |
(size is 'medium' unless given.)

## Phase 1 · legacy geometry (2026-11-19)

Radius 8 (`var(--radius-xs)`) on every variant, not a pill (legacy remaining days 5610:6068 and borrower protection pill 9124:24179 are radius 8). Small = padding 4 / 8, Caption/xs → 22 tall (legacy 5610:6068). Outline stroke inside, out of layout → Medium Outline 24 (legacy 9124:24179).
