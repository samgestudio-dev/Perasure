# 0003 · Temporary credit is used first

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"; PRODUCT.md → Credit

## Context
A person can have a long-term credit limit and temporary credit with an end date at the same time; the app has to say which part a loan uses.

## Decision
A loan uses the temporary credit first. The home card's temporary amount is what is left of it (temporary − used).

## Consequences
- Home card legend, its green bar part and tooltip show the temporary credit left (`CS.credit.temporaryLeft`).
- TODO (owner): what happens to used temporary credit when it expires.
