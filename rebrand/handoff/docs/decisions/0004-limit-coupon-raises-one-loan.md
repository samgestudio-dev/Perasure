# 0004 · A limit-increase coupon raises one loan, on the order page only

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"; PRODUCT.md → Coupons

## Context
A limit-increase coupon and temporary credit both make a bigger amount possible, and are easy to confuse.

## Decision
A limit-increase coupon is not credit: it raises what one loan may borrow, and only on the order page once it is ticked there — never on Home or the amount entry.

## Consequences
- The amount entry's maximum is the available credit; the coupon raises it only on the order page.
- QA checks that Home and the amount entry never show the raised amount.
