# HomeCoupons

Figma: component set `11046:2287` (06 · Product cards `10982:21`) · 2 variants · showcase `11046:2401`
"Coupons for your next loan" on home (legacy Home coupons pair `10750:62557` and single coupon with folder tab `10750:61878`; demo
`PS.HomeCoupons`). The only gradient exception (owner, ARCHITECTURE §12.10).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Layout | VARIANT | Pair · One | Pair | `layout: 'pair' \| 'one'` (auto: 2+ → pair, 1 → one) |
| Title | TEXT | | "Coupons for your next loan" | `title` |
| (text) coupon values | | | | `coupons[{ value, until, kind, label, cond, type }]` |

## Parts and tokens

Card: `var(--surface-default)`, radius `var(--radius-card)` 24, width **343**. The whole card opens the coupon centre.

**Pair:** padding top `var(--spacing-padding-lg)` 16, sides/bottom `var(--spacing-padding-sm)` 8, gap `var(--spacing-gap-lg)` 16. Title row
padding left/right 8, `.ps-t-label-md`. Two coupons, gap `var(--spacing-gap-xs)` 4, each: padding top `var(--spacing-padding-2xl)` 24,
sides/bottom `var(--spacing-padding-xs)` 4, radius `var(--radius-md)`, fill = `var(--gradient-coupon)`: `--coupon-gradient-top` 0 % ·
`--coupon-gradient-upper` 14.9 % · `--coupon-gradient-mid` 59.6 % · `--coupon-gradient-bottom` 100 %. Inner: `var(--surface-default)`, radius
`var(--radius-sm)`, padding 16 / 8, gap 2: value `.ps-t-title-md` `var(--content-brand)` + until `.ps-t-caption-xs` tertiary. Coupon art 40,
centred, 8 above the coupon's top.

**One:** padding 8. Head: title (padding 4 / 8) + tabs at the bottom right: curve 24 × 16 flat `var(--coupon-gradient-upper)` + folder tab
106 × 16, top-right radius `var(--radius-md)`, `var(--gradient-coupon-tab)` (bottom → top Upper → Top). Panel: padding 4, radius
`var(--radius-md)` except top-right 0, `var(--gradient-coupon-panel)` (Upper 0 % · Mid 69.2 % · Bottom 100 %). Inner: white, radius sm,
padding 8, gap 12: Lead 110 wide (value `.ps-t-title-lg` brand + kind `.ps-t-caption-xs` tertiary, upper case) · dashed divider 48
(`var(--border-default)`) · Body (label `.ps-t-body-md-strong` secondary + condition `.ps-t-caption-sm` tertiary). Coupon art 80, 18 from the
right, 59 above the panel.

Coupon art is the existing illustration (its green ₱ badge now `var(--bg-positive)`).

## States

| # | Props |
|---|---|
| 0 | `layout:'pair', coupons:[{value:'50% OFF', until:'Until Nov 11, 2026'}, {value:'₱500 OFF', until:'Until Nov 30, 2026'}]` |
| 1 | `layout:'one', coupons:[{value:'₱500 OFF', kind:'Credit limit', label:'Borrow more than ₱20,000', cond:'Any term'}]` |
