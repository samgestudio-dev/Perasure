# CouponTicket

Figma: component set `11046:2168` (06 · Product cards `10982:21`) · 6 variants · showcase `11046:2288`
A coupon in the coupon centre and the picker (demo `PS.CouponTicket`).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| State | VARIANT | Use · Pick · Selected · Used · Expired · Unavailable | Use | `action: 'use' \| 'pick'` + `state: default \| selected \| used \| expired \| unavailable` |
| Value · Label · Rule | TEXT | | "25% OFF" · "First-payment interest" · "For loans of ₱5,000 and up" | `value`, `label`, `rule` |
| Best | BOOLEAN | | true | `best` |
| (text) meta / reason | | | | `meta` / `expiresAt`, `reason` |
| Meta icon | BOOLEAN | | false | icon before the validity line (legacy countdown clock / alert) |
| Meta glyph | INSTANCE_SWAP | Icon-page icons | Alert circle | `metaIcon` |
| Rule info | BOOLEAN | | false | `ruleInfo`: info icon (Alert circle 12) at the end of the rule line; the rule then truncates to one line (legacy 10648:48733) |

## Parts and tokens

Ticket: vertical, **343 × 116**, `var(--surface-default)`, radius `var(--radius-md)` 16, padding top/bottom `var(--spacing-padding-md)` 12,
left `var(--spacing-padding-2xl)` 24, right `var(--spacing-padding-xl)` 20; Row (top) and Meta (bottom) spaced apart.

| Part | Token |
|---|---|
| Value | `.ps-t-title-md`, `var(--content-primary)` (Used / Expired `--content-tertiary`) + Best = Tag Small Accent Strong |
| Label | `.ps-t-label-md`, `var(--content-brand)` (muted: tertiary), one line … |
| Right | Use: Button Secondary Small "Use" · Pick / Selected: Check Small Off / On · Used / Expired: `.ps-t-title-xs` `var(--content-disabled)` |
| Meta | gap `var(--spacing-gap-xs)`: rule + validity `.ps-t-caption-sm` `var(--content-tertiary)` (muted: `--content-disabled`) |
| Selected | 16 px navy bar on the left (`var(--content-brand)`) + `var(--elevation-1)` — colour only, nothing moves (150 ms) |
| Unavailable | head and rule at `var(--layer-opacity-secondary)`; reason line: alert 12 + `.ps-t-caption-sm` `var(--content-secondary)` |

## States

| # | Props |
|---|---|
| 0 | `action:'use', value:'25% OFF', label:'First-payment interest', best` |
| 1 | `action:'pick', value:'₱300 OFF', label:'Service fee'` |
| 2 | `action:'pick', state:'selected', value:'25% OFF', best` |
| 3 | `state:'used', value:'10% OFF', label:'Interest'` |
| 4 | `state:'expired', value:'₱200 OFF', label:'Service fee'` |
| 5 | `state:'unavailable', value:'₱1,000 OFF', label:'Credit limit', reason:'Your loan amount is below ₱5,000'` |

## 2026-11-20 additions (Coupon center, log entry 24)

- **Meta icon** + **Meta glyph**: 14 px icon before the meta line, `Content/Tertiary` (legacy clock on "Expires in", alert on others).
- **Rule info**: the rule text sits in `Row / Rule` (horizontal, gap 4) with `Icon / Rule info` (Alert circle, 12 × 12, rescaled) after it,
  hidden by default. On screens that turn it on, the rule text is set to one line with an ellipsis (legacy: "Borrow ₱6,000 or more · 4 / 6
  terms, Borrow…" + ⓘ). Instances whose rule text is hidden also hide `Row / Rule`, so the meta gap stays as before.
- "Expires in" countdown (BRIEF 38): text + clock bound to **`Content/Urgent`** (→ `Palette/Orange/700` #B83F00, 5.6:1 on white;
  Web `var(--content-urgent)`) as a screen override on the countdown ticket; other meta lines stay `Content/Tertiary`.
