# 0015 · The app is Android only

- **Status:** accepted
- **Owner:** Sam
- **Date:** 2026-11-19
- **Source:** PRODUCT.md → "What PeraSure is"

## Context
The QA matrix, the quality bar and some type rules assumed an iOS version (iPhone widths, Safari, VoiceOver, 16 px inputs to stop iOS
zooming in on focus).

## Decision
PeraSure ships only as an Android app; its pages run in the app's WebView. There is no iOS version.

## Consequences
- QA covers Android phones only (`docs/qa/devices.md`): Android WebView / Chrome, TalkBack, Android font size and "Remove animations".
- Touch targets follow Android: at least 48 dp.
- "16 px inputs (no iOS zoom)" is no reason any more; input size is a readability choice (rebrand phase 2).
- The Playground demos may still be opened on an iPhone; their iOS fixes stay, but they are not product requirements.
