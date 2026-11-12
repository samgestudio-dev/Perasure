# Coupon system

Figma: PeraSure design system, section `10594:45373` (Coupon center), with the loan page `10656:51873`, coupon sheet
`10676:30203`, keep-coupon sheets `10712:55111 / 55543 / 55892`, repayment plan `10722:58508`, home `10730:58631` /
`10747:59920` and account `10750:63340`.

Built only from the shared components in [`shared/ps-ui`](../../shared/README.md). The page is responsive: it fills the
phone's width (check at 360, 390 and 430 px), nothing is scaled. This folder holds just the flow
(`coupon-system.js`) and the sample data and coupon rules (`data.js`).

## Flow

- **Home** — "Coupons for your next loan": two coupons (the best discount and the best limit increase), one coupon
  (wide card with the folder tab), or nothing. Tap it → coupon centre. Withdraw → apply a loan.
- **Account** — Coupons row with the count → coupon centre.
- **Coupon centre** — To use / Used / Expired. A coupon ending within a day counts down. A long rule ends in ⓘ:
  tap the line for the whole rule. Use → apply a loan with that coupon (the amount or term moves if the coupon needs it).
- **Apply a loan** — opens with the coupons that do the most for the loan. Tapping a coupon row turns that coupon on or
  off; "See all" opens the picker with every coupon. The order details show the discount only when one is used.
  Confirm stays inactive until the agreement is ticked; tapping it then scrolls to the agreement and the circle ripples.
- **Coupon picker** (sheet) — Discount / Limit increase, one of each per loan. Coupons that don't fit the loan are
  greyed with the reason. The total, "Saved" and "New limit" update as you pick; Confirm applies.
- **Keep your coupon?** (card sheet) — when a new amount or term takes a coupon off: Keep coupon sets the amount or
  term it needs, Don't use coupon leaves it off.
- **Repayment plan** (sheet) — from "View payment schedule"; a discounted interest shows the original struck through.
- Confirm (with the agreement ticked) → home; the coupons used move to Used.

## Tune and links

Tune (top right): progressive blur on / off, and how many coupons you have (six / one / none).
Links: `?page=coupons|loan|account`, `&tab=used|expired`, `&sheet=picker|plan`, `&coupons=6|1|0`, `&blur=0`.

## Numbers

All sample values (credit, coupons, pricing) are in `data.js`; in the app they come from the backend. Pricing is a
simple model so the screen adds up: per 15-day term, interest 1.5% and service fee 0.5% of the amount.
