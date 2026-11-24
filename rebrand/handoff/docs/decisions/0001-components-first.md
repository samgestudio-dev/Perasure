# 0001 · Components first

- **Status:** accepted
- **Owner:** Sam
- **Date:** — (first written in CLAUDE.md)
- **Source:** CLAUDE.md → "Components first"; skill `perasure-components`

## Context
The owner's rule for this repo and every PeraSure project. TODO (owner): the reason in your words.

## Decision
A new component or feature is made in the component library (`shared/ps-ui`) first, with every state as a prop and its states in the gallery (`shared/gallery.js` / `gallery-app.js`, shown in Dev Mode → Components), then the page uses it. A change to a piece is made in the component, never patched from a page.

## Consequences
- Page CSS only places shared pieces and never targets a component's classes.
- Developers can build and check each component on its own (Dev Mode → Components, `shared/stage.html`).
- Renaming or removing a prop updates every prototype that uses it in the same commit.
