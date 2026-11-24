# Not purely visual — left out of visual-changes.json

Found while reading the log and the `main..tokens/rebrand-v3` diff. Each line: what · where · why it's out. "log NN" = coordinator entries 39–80 in `rebrand/log/figma.md`.

## Logic / behaviour

- Coupon threshold logic: ticking a coupon that doesn't fit moves the loan to its threshold (`meet`, `APP.meetCoupons`, `toggleRow`) · log 75 · logic.
- "Use" from the coupon centre turns the coupon on and moves the loan; the other coupon may be taken off · log 75 · logic.
- See all: no Unavailable state, Confirm applies / ✕ discards, summary shows the loan the picks need · log 75 · logic (CouponOption `unavailable` state no longer used by the app; Figma instance 13032:47841 → Default).
- "Never fits" rule, coupon pairing (`never`, `pair`, `reach`, `plan`, `APP.neverFits`, `APP.planLoan`) · log 76 · logic.
- One-button "You can't use your … coupon" sheet (`nocoupon`, PS.Decision without facts) · log 76 · new flow + copy (no Figma frame yet).
- Coupon logic paused / saved for later (`rebrand/log/coupon-logic-2026-11-24.md`) · log 79 · logic, may change.
- Amount screen never starts above what can be borrowed (`withdraw-host.js open`) · log 77 · logic.
- PaymentCard `stage` prop (upcoming | today | overdue) and the Tune "Due today" option · log 54 · new prop/state; its look is in visual-changes.
- Installment footer line chosen by stage (`note(d)`, new data fields `loanShort`, `graceEnd`, singular "1 day") · log 59 · logic + copy.
- FormField clear ✕ only while the field is focused · decisions-11-24 #14, log 63 · behaviour.
- Every application choice opens as a popover menu instead of a bottom sheet (ID type, Gender, Marital status, Payroll period) · log 62 · flow/structure (menu timing values are in visual-changes).
- Pay-method search keeps every category and filters rows / drops empty groups · decisions-11-24 #24 · logic (the match highlight colour is visual and listed).
- Withdrawal method E-Wallet asks for an account number (label, placeholder, error, 10–16-digit check) · log 64 · flow + copy.
- Tooltip placement (a corner covers the ⓘ) · decisions-11-24 #21, log 63 · no change made (already so).
- Sheet scrim default on for every sheet (`layout.js` SheetBody `scrim` default true) · log 68 · behaviour switch (the scrim look is listed).
- Credit limit intro / splash add classes on `<html>` (`ps-climit-on`, `ps-splash-on`) · log 58, 71 · mechanism; the resulting edge colour is listed.
- `PS.TopBar{flat}` prop (now a no-op) · log 59, 68 · API only.
- Coupon picker: intro line ("You can use 1 interest discount…") and "Your loan" row no longer passed · log 74 · structure + copy (PS.CouponPicker still accepts them).

## Structure (components added / removed / rebuilt)

- `PS.ChoiceSheet` + `SelectBar{trailing}` + `FormField{sheet}` (bottom-sheet choice lists, CSS `.ps-choice*`, `.ps-sheet--choice`) · log 62 · new component, kept in the library but no longer used by the app.
- `Popover{tags}` / `FormField menu.tags` and `.ps-pop__opt--tag`, `PS.Tag{tone:'accent'}` ("Higher credit" on ID types) · log 62 · new element in menu rows.
- `PS.Mask` component · log 63 · new component (its letter-spacing is listed as visual).
- Home hero rebuilt as the Figma block (navy top + white body, stats panel) · log 61 · owner asked for a structure change; its colours/type/spacing are listed.
- Tabs count shown as text "To use (6)" instead of a badge · log 58, decisions-11-24 #9 · structure + copy.
- Verified mark removed from Profile and `verified` prop dropped · log 58 · removal (listed as a visual removal too, since it is an icon).
- MethodPicker becomes a standalone open-only component (Open=Off variant deleted) · log 45 · Figma structure.
- Button variants added in code (`plain`, `neutral`, `secondary`, `navy`, `danger`, new meaning of `inverse`) and Figma Button component tokens `button/*` (52 → 44) · log 49, 54–56 · API; the looks are listed.
- Tag tones added (`neutral`, `brand`) · log 54 · API; looks listed.
- Figma: BottomBar `Type=Two buttons compact`, Tag Small Muted variants, Button Inverse/Outline variants, OrderAmountCard, `Icon / Wallet / Outline`, Filled icon twins, `.MenuRow` changes · figma-lib 38–39, log 47, 49, 57 · library structure.
- Figma frame naming convention (`<Section> / <Screen> / <State>`) · BRIEF 23 · naming only.
- Figma semantic restructure (14 merged, 142 renamed), raw numbers aliased to primitives, gradient paint styles · log 41–43 · token architecture; resolved values are in the token-mapping rows.
- Token renames with identical values (`--shadow-*` → `--elevation-*`, `--gradient-*-nav-filled` → `--gradient-nav-*`, 46 rename-only CSS blocks) · diff · no visual effect.
- `withdraw-fund-flow/perasure-ds.css` (−462 lines) · diff · removed duplicated token definitions; not reviewed line by line.
- Retired card styles moved to "bin" (white CreditCard, blue-gradient card, navy ring card) · BRIEF 17 · library housekeeping.

## Test / tooling only

- Tune grouping, "Special cases" folding list, `credit=low` special case, its own coupon set (`coupons('case')`) · log 77, 78 · test controls (tune.js, tune.css, index.html).
- Dev Mode "PeraSure · Rebrand" app (devmode-platform) · log 80 · tooling.
- `tools/dev-server.py`, `tools/phone-server.command` · diff · tooling.

## Copy (text changes)

Owner-requested, but text, not look:
- Home hero tagline "Simple, Fast, Made for You." → "Fast, clear,\ncredit when life can’t wait." (Figma 11187:19933 updated too) · log 61.
- Installment due-today footer "No penalty for 3 days after the due date" → "It's your due date. No penalty until Jan 18"; new lines for 1–2 days late / 3 days late / >3 days · log 59.
- E-Wallet field "Mobile number" → "Account number", placeholder "Enter your account number", error "Enter your account number (10–16 digits)." · log 64.
- New sheet copy "You can’t use your {coupon} on this loan" + body + "Got it" · log 76.
- Coupon tab labels "To use (6)" · log 58.
- Copy source rule: the app's copy wins over Figma's Title Case (decision 47) · BRIEF 47 · Figma copy to be aligned later.
- Non-breaking hyphens in 35 words is listed in visual-changes (G-008) because the owner asked for it as a line-break fix; the wording itself did not change.
- Toast "Your loan is now ₱… · n terms." replaces the refusal toast · log 75 (logic-driven copy).

## Open / unverified (for the reader)

- Credit limit increase rebrand copy exists (`rebrand/prototypes/credit-limit-coins/baked/`) but is not wired; its CSS uses token names missing from v2026.11.23.
- Figma-only visual items (marked "Figma only" in visual-changes) were not checked in the demo; demo-only items were not checked in Figma.
