# 0013 · One requirement, one iteration, one tag

- **Status:** accepted
- **Owner:** Sam
- **Date:** 2026-11-17
- **Source:** CLAUDE.md → "PeraSure Dev Mode"; skill `perasure-iteration-log`

## Context
Developers need to see exactly what changed for each requirement, and run the version before and after.

## Decision
Every change made for one requirement (tokens, global components and the pages they touch) is recorded as one iteration: an entry in `devmode/data/iterations.js`, statuses in `devmode/data/status.js`, a runnable snapshot and a git tag `devmode-<id>` (made by CI).

## Consequences
- The version stays v1; iterations are labelled `v1 · YYYY-MM-DD · PHL-xxx` ("无 Jira 单号" when there is none). Only a large redesign starts v2.0.
- [CHANGELOG.md](../../CHANGELOG.md) gets one line per iteration.
