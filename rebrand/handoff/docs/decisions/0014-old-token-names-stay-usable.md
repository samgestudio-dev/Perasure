# 0014 · Old token names stay usable

- **Status:** accepted
- **Owner:** Sam
- **Date:** 2026-11-17
- **Source:** CLAUDE.md → "Updating tokens"

## Context
A token update can remove or rename CSS names that a build already uses.

## Decision
Each update writes `tokens/legacy/<previous version>.css` with every name it removed, renamed or gave a new value, at its old value.

## Consequences
- A build can load the legacy file after `tokens.css` to keep the old look while it moves over.
- The *Developer impact* table of each `tokens/CHANGELOG.md` entry lists what to replace.
