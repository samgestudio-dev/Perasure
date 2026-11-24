# PeraSure — product rules

What PeraSure is and how its credit, loans and coupons work. Figma (app file `barda5NcnFzxG7CHtISKsW`, page `38:1137`) and the test app
(`prototypes/app`) follow these rules; when a screen disagrees with them, the screen is wrong. Owner: Sam.

Every rule names where it was first written down. Lines marked **TODO (owner)** are not decided or not written down yet: ask before
building them; don't guess.

---

## What PeraSure is

A lending app for people in the Philippines. People come to check how much they can borrow, apply for a loan and keep on top of their
repayments (`perasure-tone-of-voice` → Context).

- **Android only** (owner, 2026-11-19): there is no iOS version. The app's pages run in the Android app's WebView, under its native
  navigation bar. iOS-only concerns (Safari, the iOS 26 toolbar, Dynamic Type, input zoom on focus) are out of scope for the product;
  the Playground demos may still be opened on an iPhone ([decision 0015](docs/decisions/0015-android-only.md)).

## Credit

PeraSure has a **credit line**: an approved limit that a loan uses up and a payment gives back (`prototypes/app/README.md` → "One set of
numbers").

| Term | Rule | Demo value |
|---|---|---|
| **Credit limit** | The long-term limit, given after the application is approved | ₱40,000 |
| **Temporary credit** | Extra credit with an end date, added on top of the limit. Not a coupon | ₱10,000 until Nov 20, 2026 |
| **Total credit** | Limit + temporary credit | ₱50,000 |
| **Used credit** | The principal of the loans being repaid | ₱5,000 |
| **Available** | Total − used. The most that can be typed on the amount entry | ₱45,000 |

- **Temporary credit is used first** (owner): what the home card shows as temporary is what is left of it (temporary − used).
- **Ordering a loan takes its amount out of the available credit at once.** Home card, hub, Account, credit history and the next order's
  maximum follow.
- **One set of numbers** (owner): every amount and date that matters comes from one source (in the demo `coupons-data.js`, in production the
  server); a screen never types its own number.
- TODO (owner): how a payment gives credit back (principal only, or the whole payment?), and when (on payment, or once it clears).
- TODO (owner): what happens to temporary credit that is used when it expires.

## Account states

Guest (logged out) · new · application in review · documents needed · not approved · approved (credit ready) · limit expired · credit on
hold. Each is a Home state in Dev Mode (`devmode/data/pages.js` → Home).

- TODO (owner): what moves an account from *expired* or *on hold* back to *approved*, and what each one allows (borrow? pay only?).

## Applying for credit

The application runs in this order (owner): **Your loan estimate → Basic info → ID type + both sides → Check the details → Selfie →
Trusted contact → Submit**. Addresses use the Philippines' real Region → Province → City list (PSA PSGC). Proof of income is asked for
only in the *documents needed* state.

## Borrowing

- **Every way into ordering starts at the amount entry** (owner) — never straight to the order details.
- The order page shows the order details, borrower protection (Protected / Add), the withdrawal method and the agreement before Confirm.
- After Confirm, a verification code; **Order submit** plays only once the code is verified.
- Loan states: none · in review · repaying · overdue · transfer failed.
- TODO (owner): can a new loan be ordered while one is being repaid, and how many can be open at once?
- TODO (owner): terms offered (the demo loan has 4 terms) and how the repayment plan is worked out.

## Coupons

- **Discount coupons** lower what a loan costs (for example "25% off first-payment interest").
- **A limit-increase coupon is not credit** (owner): it raises what **one loan** may borrow, and only on the order page once it is ticked
  there — never on Home or the amount entry. (+₱5,000 / +₱3,000 / +₱2,000 in the demo.)
- When a changed amount no longer fits a picked coupon, the app asks **"Keep your coupon?"**; with more than one coupon affected they are in
  one card, swiped, answered together, and the loan changes once.
- TODO (owner): which coupons can be combined, and what happens to a coupon when its loan is cancelled.

## Repaying

- Overdue: the demo's overdue loan has its first payment 3 days late, "the last day without a penalty"; the penalty explainer is on Home.
- Ways to pay: in an app (e.g. GCash), by QR code, or by transfer.
- TODO (owner): penalty rule (from which day, how much), and whether paying early changes the fees.

## Words

All copy follows the **`perasure-tone-of-voice`** skill (`.claude/skills/perasure-tone-of-voice/SKILL.md`). The points developers and QA
check most:

- Plain, short, friendly English; **sentence case** for headlines, buttons and labels.
- Show real amounts, fees and repayment dates up front; never bury or soften them.
- Unwelcome news that isn't our fault (a declined loan): don't apologise, say what happens next. Never jokes in sensitive moments
  (declined, overdue, money worries, account restrictions).
- "Repay / repayment" is in use today (Payment tab: "Nothing to repay right now", "TOTAL REPAYMENT"). TODO (owner): keep it, or move to
  "pay / payment"?
- Amounts: ₱ sign, comma thousands (₱45,000). TODO (owner): always two decimals (₱45,000.00) or only where centavos matter?
- Dates: "Nov 20, 2026" (`en-US`, short month). TODO (owner): time zone (Asia/Manila?).
- Phone numbers are shown masked in places. TODO (owner): is the person's name ever shown?

## Still to look at

| Where | Question |
|---|---|
| — | Add rows here as they come up; move a row into the rules above once the owner decides it, and add a [decision record](docs/decisions/README.md) |
