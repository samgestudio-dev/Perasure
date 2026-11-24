# 0005 · Every way into ordering starts at the amount entry

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"

## Context
Borrowing can start from several places (Home, a coupon, the coupon centre).

## Decision
Every way into ordering starts at the amount entry (`APP.borrow(couponId?)`), never straight at the order details.

## Consequences
- A coupon tapped elsewhere is passed along and pre-picked; the person still sees the amount first.
