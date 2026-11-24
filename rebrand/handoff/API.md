# PeraSure — API map (skeleton for backend integration)

What the app needs from a server, to be worked out from the test app (`prototypes/app/screens-*.js`, `data.js`, `coupons-data.js`,
`app.js`, Tune). Part 1 groups the endpoints by domain, each with an id (A1, B2 …). Part 2 goes screen by screen (the Dev Mode page ids
from `devmode/data/pages.js`) and points back to those ids. Part 3 maps the demo's Tune states to server states, Part 4 lists text that looks
fixed in the demo but should come from a server, and Part 5 the open questions.

**Status: skeleton.** The domains and screens are filled in from the demo; the endpoint rows are still to write (`TODO`). Paths and fields
are suggestions; the backend team owns the final names.

**Conventions (suggested — confirm with the backend)**
- Base `/api/v1`, JSON, `Authorization: Bearer <token>`. A guest calls only the endpoints marked *public*.
- Money as integer centavos (`4500000` = ₱45,000.00); the app formats it. Dates ISO 8601, Asia/Manila time.
- Errors: `{ code, message, fields }`; `message` is short user-facing copy, written to the `perasure-tone-of-voice` rules.
- `Idempotency-Key` header on every POST that moves money or creates a loan.
- **The server does the maths.** The demo works out credit, coupons, plans and penalties on the phone (`coupons-data.js` → `NUM`, `CS.credit`,
  `CS.take`); in production every amount, date and breakdown comes from the API and the app only shows it ("one set of numbers", PRODUCT.md).
- "When": **Open** = when the screen opens · **Action** = on a tap · **Poll** = repeated while waiting · **Cache** = at app start, kept.

---

## 1. Endpoints

Row format for every domain:

| Id | Method + path | Accepts → returns (key fields) | Screens | When |
|---|---|---|---|---|

### A · Auth and session
Log in by phone number and verification code; resend; SMS failure; log out; token refresh.
Screens: `login`, `sending`, `otp`, `logout`. — TODO endpoints.

### B · Account and user state
Who the person is and which account state they are in (guest · new · in review · documents needed · not approved · approved · expired ·
on hold); permissions.
Screens: `home` (every state), `account`, `permission`, `opening`. — TODO endpoints.

### C · Credit
Credit limit, temporary credit and its end date, total, used, available; credit history; Credit limit increase (when to play it, and the
before / after numbers).
Screens: `home` (credit card), `hub`, `credit`, `account`, `withdraw` (intro). — TODO endpoints.

### D · Loan quote and repayment plan
Amount range, terms, fees, the plan for an amount + term + coupons; borrower protection.
Screens: `withdraw`, `amount`, `loan`, `plan`. — TODO endpoints.

### E · Order (borrow)
Create the order after the verification code; order status (in review, sent, transfer failed); sending again.
Screens: `order`, `withdraw` (Confirm → code → Order submit). — TODO endpoints.

### F · Withdrawal methods and banks
The person's methods, the bank list (search), add a method.
Screens: `method`, `banks`. — TODO endpoints.

### G · Coupons
Coupons owned (six / one / none), which fit an amount, apply / remove, "Keep your coupon?" check.
Screens: `coupons`, `picker`, `keep`, `loan`, `home` (home coupons). — TODO endpoints.

### H · Loans, history and records
Current loans, loan history, loan record, cancel a loan.
Screens: `history`, `loan-record`, `cancel`. — TODO endpoints.

### I · Repayment
Amount due, overdue and penalty, payment detail, ways to pay, pay by app / QR / transfer, payment result.
Screens: `payment`, `paydetail`, `paymethods`, `pay`, `scams`. — TODO endpoints.

### J · Applying (KYC)
Loan estimate, basic information, ID type and photos, ID checks (in use, failed), check the details, selfie, trusted contact, submit;
proof of income.
Screens: `kyc-estimate`, `kyc-basic`, `kyc-id`, `camera`, `kyc-check`, `kyc-selfie`, `kyc-contact`, `docs`, `id-inuse`, `id-failed`, `date`.
— TODO endpoints.

### K · Places
Region → Province → City (the demo uses PSA PSGC 2025-2Q in `ph-places.js`).
Screens: `city`. — TODO: served by the API or shipped with the app?

### L · Inbox
Messages, unread count, read state, message detail.
Screens: `inbox`, `message`. — TODO endpoints.

### M · Help and support
Help topics, articles, search; contact us.
Screens: `faqs`, `faq-topic`, `faq`, `support`. — TODO endpoints.

### N · Settings and legal
About, SEC and BIR registration, legal texts, manage account.
Screens: `about`, `sec`, `bir`, `doc`, `manage`. — TODO endpoints.

### O · Phone number change
Old number → new number → code → selfie → done; confirm identity.
Screens: `phone-old`, `phone-new`, `phone-selfie`, `face`. — TODO endpoints.

### P · Account deletion
Can the account be deleted (no open loan), confirm with a code, delete.
Screens: `delete`, `delete-ok`, `delete-no`. — TODO endpoints.

### Q · Rating
When to ask for a rating; send the answer.
Screens: `rating`. — TODO endpoints.

### R · App config
Feature switches, fixed copy that should be editable, minimum app version.
Screens: all. — TODO endpoints.

---

## 2. Screen by screen

| Section | Screen (Dev Mode id) | Needs |
|---|---|---|
| Start & log in | `login`, `sending`, `otp`, `permission`, `opening` | A, B |
| Home | `home` (13 states) | B, C, G, I |
| Borrow | `withdraw`, `amount`, `loan`, `plan`, `method`, `banks`, `order`, `coupons`, `picker`, `keep` | C, D, E, F, G |
| Repay | `payment`, `pay`, `paydetail`, `scams`, `paymethods` | I |
| Apply for credit | `kyc-estimate`, `kyc-basic`, `kyc-id`, `camera`, `kyc-check`, `kyc-selfie`, `kyc-contact`, `docs`, `id-inuse`, `id-failed`, `date`, `city` | J, K |
| Account | `account`, `hub`, `credit`, `inbox`, `message`, `history`, `loan-record`, `cancel`, `manage`, `delete`, `delete-ok`, `delete-no`, `about`, `sec`, `bir`, `doc`, `support`, `logout`, `rating` | B, C, H, L, M, N, P, Q |
| Help & security | `faqs`, `faq-topic`, `faq`, `phone-old`, `phone-new`, `phone-selfie`, `face` | M, O |

TODO: per screen, which ids it calls on Open / Action / Poll.

---

## 3. Tune states → server states

The demo switches these in Tune (and in the address, e.g. `?user=hold&loan=overdue`). In production each is a server state.

| Tune key | Values | Server source |
|---|---|---|
| `user` | `guest`, `new`, `review`, `docs`, `declined`, `approved`, `expired`, `hold` | B — TODO |
| `loan` | `none`, `reviewing`, `active`, `overdue`, `failed` | E, H, I — TODO |
| `temp` | temporary credit on / off | C — TODO |
| `coupons` | `6`, `1`, `0` | G — TODO |
| `intro` | play Credit limit increase on open | C — TODO |
| `otp` | correct, wrong first, SMS fails first | A — TODO |
| `kyc`, `selfie` | pass / fail | J — TODO |
| `inbox` | unread, read, empty | L — TODO |
| `rating` | ask for a rating | Q — TODO |
| `net` | normal, slow, fails once | (network behaviour; no endpoint) |
| `fast`, `auto`, `blur`, Screen fit, Text size | demo-only | — |

---

## 4. Static or config — decide with the backend

| Text or list in the demo | Where | Server or app? |
|---|---|---|
| Help articles | `screens-help.js` | TODO |
| Bank and wallet lists, payment methods | `screens-loan.js`, `screens-pay.js` | TODO |
| Legal texts, SEC / BIR registration | `screens-account.js` | TODO |
| Anti-scam tips | `screens-pay.js` | TODO |
| Places | `ph-places.js` | TODO |

---

## 5. Open questions for the owner / backend

- TODO: add questions as the endpoints are written; link each to the screen and PRODUCT.md rule it affects.
