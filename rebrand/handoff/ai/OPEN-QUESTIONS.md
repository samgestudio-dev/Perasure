# Open questions for the design owner

The package already chooses a value for every item below (**Used**), so development can go ahead; an answer only changes that value.
Full detail, with every affected file and line: `02-changes/conflicts.md` (items 1–10, sections C and D) and `01-tokens/unresolved.md`.
Each edit affected carries `needsOwner: true` in `02-changes/changes-by-file.json` (75 edits; `apply.py --skip-owner-items` leaves them out). Three edits are `manual` (E023, E285, E286): nothing is applied there until the owner decides.

## Colour system

1. **Grey text and lines become navy.** The current design deleted the neutral grey scale (design decision 42, 2026-11-21), so 34 production
   grey tokens map to navy tokens (e.g. text `#141e24` → `#000128`). An earlier rule (2026-11-20) said "text keeps its neutral".
   **Used:** navy (the current design). → `01-tokens/unresolved.md` §1
2. **14 tokens where the current design departs from the "same step" colour rule** — the primary button's white label becomes navy;
   glass goes from white 60 % to 80 %; the scrim from black 20 % to navy 40 %; brand-blue cards and icon discs become navy instead of
   green; tag text and borders get darker. **Used:** the current design. Each row has an `alternative` keeping the legacy look.
   → `01-tokens/unresolved.md` §2
3. **Brand-card gradient.** Figma puts `Gradient/Brand-card` on the home credit card and the application state card; the demo paints them
   flat navy. **Used:** flat navy (gradient only on the credit-limit hub). → `conflicts.md` 2

## Components

4. **"Best" pill** on coupons: orange (demo) or green (latest Figma). Production has no coupon UI yet, so nothing is edited. → `conflicts.md` 1
5. **Contact-method selected state** (OTP page): green-700 label + green-400 ring (demo) or all green-600 (Figma). **Used:** demo. → `conflicts.md` 3
6. **Amount tracking:** new Figma Amount tracking (xxl +4 %, lg +3 %, md +2 %) or the older values. **Used:** family and weight only, tracking unchanged. → `conflicts.md` 4
7. **Slider knob:** dark-green centre + knob elevation (PS.Slider) or a plain white knob (Withdraw demo). **Used:** dark-green centre. → `conflicts.md` 5
8. **Focus ring and caret:** a 2 px green focus ring (production removes outlines on purpose for Android WebView) and the caret colour.
   **Used:** 2 px `--border-selected` on `:focus-visible`; caret `--fg-accent`. → `conflicts.md` 6, section C (`global.css:192`)
9. **Boot splash in `index.html`:** navy ground needs a white wordmark. **Used:** navy + white. → `conflicts.md` 9

## Places where a look needs a small structural hook (flagged, not restructured)

10. Active tab icon colour (icons are `<img>` with a baked colour; needs `currentColor`; edit E023 is `manual`, out of scope). 11. The overdue red button (needs a state hook;
    the package uses a `:has()` rule). 12. Buttons that share one rule but should differ (LoanDetail cancel vs document links; LoanEstimate
    Cancel / Confirm). → `conflicts.md` section C and D

## Production screens without a design

13. 12 components need design before they can match the rebrand: the pink / lime fraud and feedback illustrations, the app-entry
    showcase image, the reloan banner, the captcha bubble hues, the NoticeTicker and fraud-ticker colours (server config), the partner
    offer card, two error states, the disclosure document, the credit-increase coin heap. 32 more are covered by the token map only.
    → `05-coverage/coverage.json` (b)

## Issues in the rebrand token file (design side to fix)

14. `--duration-*` are emitted in px and `--easing-*` as quoted strings: don't use them until fixed. → `unresolved.md` §7
