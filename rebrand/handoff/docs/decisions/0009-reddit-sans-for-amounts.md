# 0009 · Reddit Sans only for emphasised amounts

- **Status:** accepted
- **Owner:** Sam
- **Date:** 2026-11-17
- **Source:** CLAUDE.md → "The full app" → Number font; tokens v2026.11.17

## Context
The number font changed from Satoshi (with ₱ borrowed from Inter) to Reddit Sans, which has its own ₱.

## Decision
Reddit Sans is only for emphasised amounts, always in a Number text style (xs–xxl, Bold). Small notes and labels beside an amount are Inter; list numbers are Hanken Grotesk.

## Consequences
- A title with an amount keeps its own font; only its ₱ is the number font (`PS.Peso`).
- An amount at a size with no Number style: ask the owner.
