# 0008 · Bars have no progressive blur; their veil follows the page level

- **Status:** accepted
- **Owner:** Sam
- **Date:** 2026-11-17
- **Source:** CLAUDE.md → "Requirements for a demo page" → Header and bottom bars; tokens v2026.11.17; iteration v1-20261117-n1

## Context
The design system turned its bar effect styles (Top/Bottom-nav-effect) off in tokens v2026.11.17.

## Decision
Bars use one token veil chosen by the kind of page (primary tabs, secondary pages, amount entry and order page); no progressive blur. Glass buttons and the tab bar's pill keep their own background blur.

## Consequences
- Table of veils: DESIGN.md → 04 · Page anatomy.
- The Tune blur setting and `?blur=` are gone; old gradient names stay in `tokens/legacy/2026.11.12.css`.
