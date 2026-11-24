# 0006 · Existing animations are never re-imagined

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"

## Context
The repo already holds finished motion pieces (Withdraw morphs, Credit limit increase, Order submit, OTP sheet) tuned with the owner.

## Decision
A motion that already exists is brought into the app as it is: the demo's own code and values, the same timing and rules. The app hosts the Withdraw demo's own code (`withdraw-host.js`) instead of re-making it.

## Consequences
- `prototypes/withdraw-fund-flow/withdraw.js` is used by the app too: keep its class, method names and `PATCHES` working.
- Developers port these animations from the demo code, not from a description.
