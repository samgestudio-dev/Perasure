# 0010 · Sizes in rem; text size follows the phone

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "Shared components" and "The full app"

## Context
The owner asked for rem so the app follows the phone's text size (Android text scale, iOS Dynamic Type).

## Decision
Sizes are rem (1 rem = 16 design px). Text size follows the phone's setting: up to 130 % the whole layout follows, above that only text grows, capped at 150 % until every component holds 200 %.

## Consequences
- px only for hairlines, shadows, blurs, the status strip and max widths; text boxes get `min-height`, not `height`.
- QA checks every page at 130 % and 150 %. TODO (owner): the Screen fit mode for production.
