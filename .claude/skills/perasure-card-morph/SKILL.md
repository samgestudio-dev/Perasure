---
name: perasure-card-morph
description: Reproduce PeraSure's card morph motion — one card or page turning into another state (a card growing into a form, a page closing into a card, a button becoming another button, text changing as it travels), as in the withdraw fund flow and Change co-maker prototypes. Use for any PeraSure prototype or screen with such a transition.
---

# PeraSure card morph

One motion language for every PeraSure transition where a card or page becomes another state. It must feel identical
to the two references in the Playground repo (`samgestudio-dev/Perasure`):

- **Change co-maker** (`prototypes/co-maker-change/co-maker.js`): a card grows into a form and back.
- **Withdraw fund flow** (`prototypes/withdraw-fund-flow/withdraw.js`, `README.md`): a full page closes into a card; a
  screen closes into the home card.

## Files

The files sit next to this one in the repo. Elsewhere, fetch them from
`https://raw.githubusercontent.com/samgestudio-dev/Perasure/main/.claude/skills/perasure-card-morph/<file>`.

| File | Read it when |
| --- | --- |
| `example.html` + `engine.js` | always: **start every new morph by copying these two** (a complete working morph; the engine's API is in the header comment of `engine.js`) |
| `references/card-to-form.md` | a card turns into a form or another card in place; also forms: scroll into view, keyboard, a disabled button tapped |
| `references/page-to-card.md` | a page, sheet or full screen closes into a card (or opens out of one); an amount travels and resizes |
| `references/checks.md` | before shipping, or when something glitches on a phone (blur lines, wobble, jank) |

Copy follows the **perasure-tone-of-voice** skill. Header / bottom bars follow the repo's `CLAUDE.md` →
"Header and bottom bars".

## Fixed values (never change them)

| | Value |
| --- | --- |
| Spring (Smooth, default) | stiffness 240, damping 30, mass 1. Snappy 430 / 34 / 0.8 and Gentle 140 / 24 / 1.15 only as Tune options |
| Spring end | within 0.378 px and 3.78 px/s over the morph's longest travel (`restDelta = 0.378 / travel`) |
| Resulting timing | 95 % at ≈ 290 ms, settled ≈ 560 ms (withdraw: 572 ms) |
| Rise distance | text 8 px, block 10 px, digit 6 px |
| Crossfade blur | 3 px (leaving 0 → 3, entering 3 → 0) |
| ENTER / LEAVE | 0.30 s + 0.07 delay, `[0.22, 0.61, 0.36, 1]` / 0.15 s, `[0.4, 0, 1, 1]` |
| Secondary entrance | 0.34 s on the ENTER curve, rise 8 px, 3 px → sharp |
| Press | 60 ms, scale 0.985 (buttons) / 0.92 (icon buttons), no bounce |

- **Never speed the spring up because a move is short.** A version scaled to the same *speed* over a short travel came out 40 % quicker, and the owner rejected it as rushed. Same spring = same feel; the time follows from the distance.
- Only a travel longer than 378 px stretches it: `s = travel / 378` (≤ 2.5), stiffness ÷ s², damping ÷ s. `PSMorph.springFor` does this.

## Core rules (every morph)

1. **One progress, one spring.** Everything is a function of ONE progress k (0 = state A, 1 = state B), animated by Motion. Its change event writes styles straight to the DOM, so there are no framework renders per frame. A tap mid-morph re-targets the same value, and the reversal is smooth. Never give each property its own spring: they stop at different moments and the content wobbles.
2. **Windows.**
   - Geometry follows k clamped to 0–1.
   - Opacity, blur and small rises follow smoothstep windows of k: what leaves is gone by ≈ 0.4, what arrives starts ≈ 0.2. They overlap, so the card is never empty.
3. **Shared elements stay one element.** Whatever exists in both states is moved and resized, never faded out and in again. Text that changes words rides with its block and swaps (old rises out, new rises in, 3 px blur between).
4. **Nothing is cut by a moving edge.** Things either fade before the edge reaches them or ride it:
   - buttons ride the card's bottom edge;
   - content below the card rides it by a transform.

   The page layout is committed only at rest: the open height at the start of an opening, the closed height at the end of a closing.
5. **Paths that cross other content are front-loaded** (`1 − (1 − k)²`) so they land before that content appears.
6. **Secondary content (form rows, details) enters on a clock, started by the progress** once the card has room for it. Each piece plays the same 0.34 s entrance. It leaves on the progress.
7. **Colour rides the progress** (two flat layers crossfading), never its own timer.
8. **Per frame, only `transform`, `opacity` and `filter`**, plus the size of the card and small absolute boxes. Write a value only when it changed. Use `will-change` only during the morph. Everything that blurs keeps its own layer and a `blur()` filter for the whole morph (an iOS fix; see `references/checks.md`).
9. Respect `prefers-reduced-motion` (jump to the end). `?slow=10` slows everything for checking on a phone.
