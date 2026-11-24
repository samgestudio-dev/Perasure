# 0002 · One set of numbers

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"; `prototypes/app/README.md` → "One set of numbers"

## Context
The same amounts show on many screens (home card, hub, Account, credit history, amount entry, order page), so they must always agree.

## Decision
Every amount and date that matters comes from one source. In the demo that is `prototypes/app/coupons-data.js` (`NUM` → `CS.credit`, `CS.current`); in production it is the server.

## Consequences
- No screen computes or types a number of its own; ordering a loan updates every screen at once (`CS.take`).
- Production: the app shows what the API returns and computes no fee, total or penalty (API.md conventions).
