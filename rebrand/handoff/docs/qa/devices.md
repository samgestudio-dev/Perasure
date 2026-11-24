# QA device matrix

PeraSure is a phone app for the Philippines. The design is 360 wide; pages built on the shared components fill any phone width (see
DESIGN.md → 10 · Responsive). **The app is Android only** (owner, 2026-11-19 — [decision 0015](../decisions/0015-android-only.md)): its pages run in the Android app's
WebView. Every demo is tested on a real Android phone. Checklist:
[acceptance.md](acceptance.md).

## Widths

| Width | Why | Example phones |
|---|---|---|
| **360** | The Figma frame; the most common Android width | Samsung Galaxy A0x / A1x, Redmi, realme C, Infinix, TECNO |
| **390** | Common mid-range Android width (384–412); the width checks use 390 × 664 or 390 × 844 | Galaxy A5x, Pixel, Redmi Note |
| **430** | Large phones: content grows, nothing stretches oddly | Galaxy S Ultra, large-screen Android |

Also check one **short screen** (about 640 px tall) for sheets and bottom bars.

## Devices and browsers

TODO (owner): confirm the target phones and OS versions.

| # | Device class | OS / browser | Priority | Notes |
|---|---|---|---|---|
| D1 | Low-end Android (2–3 GB RAM, 360 wide) | Android 11–13, app WebView | Must | Motion and list performance, slow network |
| D2 | Mid-range Android (390–412 wide) | Android 13–14, app WebView | Must | Main flows |
| D3 | Large Android (430 wide) | Android 14–15, app WebView | Should | Width growth, capped zoom |
| D4 | Android with a 3-button nav bar | app WebView | Should | Bottom bars over the system bar |
| D5 | Android with gesture navigation | app WebView | Must | Back gesture, bottom insets, keyboard |
| D6 | Desktop Chrome at 360 / 390 / 430 in device mode | — | Quick checks only | Not a substitute for D1–D2 |

## Conditions

| Condition | How | Priority |
|---|---|---|
| Text size | Android font size at 130 % and 150 % (Tune → Text size in the test app) | Must |
| Screen fit | Tune → Screen fit (capped zoom is the default) | Must until the owner picks one |
| Slow network | Chrome DevTools "Slow 3G" or Tune → Network → slow | Must for first load, lists, payments |
| Fails once / offline | Tune → Network → fails once; airplane mode mid-flow | Must |
| Reduced motion | Android "Remove animations" | Must |
| Screen reader | TalkBack on D1 or D2 | Must for ready pages |
| On-screen keyboard | Every sheet and page with an input | Must |
| App backgrounded mid-request | Switch apps during borrow and repay | Must |

## Matrix per drop

| | D1 | D2 | D3 | D4 | D5 |
|---|---|---|---|---|---|
| Global checks (acceptance.md §1) | ✔ | ✔ | ✔ | widths only | bars only |
| Changed pages (per-page template) | ✔ | — | ✔ | — | — |
| Borrow and repay flows end to end | ✔ | ✔ | ✔ | ✔ | — |
| Screen reader pass | TalkBack | — | VoiceOver | — | — |

Record the exact model, OS version and browser version in each checklist.
