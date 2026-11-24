# 0007 · Loading is the whole screen

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "The full app"

## Context
TODO (owner): the reason in your words.

## Decision
While a page loads, the Loading page covers everything (`PS.Cover`: no header, bottom bar or tab bar). A failed load shows the fallback page under the header. What was waited for then rises in piece by piece (`PS.Rise`).

## Consequences
- The loader (72 px coin + dots) sits in the very middle; Order submit's coin and text a little above it.
- Full-page empty states and the fallback put their picture at Order submit's height.
