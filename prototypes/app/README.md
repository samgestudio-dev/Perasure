# PeraSure app (test environment)

The whole app in one prototype. Figma: file `barda5NcnFzxG7CHtISKsW`, page `38:1137`, plus what the repo already had
(coupon system, Order submit, OTP sheet, Loading page, Credit limit increase). Built on the shared components
([`shared/ps-ui`](../../shared/README.md)); this folder holds only the flows and the sample data.

| File | What's in it |
| --- | --- |
| `app.js` | the store, the page stack, sheets, the made-up network (`APP.useLoad`, `APP.run`), page helpers |
| `data.js`, `coupons-data.js` | sample data; coupon rules and loan pricing (the coupon system's model) |
| `screens-auth.js` | opening, log in, sending code, verification code, permissions |
| `screens-home.js` | the tab pages; Home in every account state |
| `screens-loan.js` | amount keypad, loan detail with coupons, coupon sheets, withdrawal method, bank search, coupon centre, loan application status |
| `screens-pay.js` | Payment tab, payment detail, anti-scam cards, how to pay, the pay page (app / number / QR) |
| `screens-account.js` | Account tab, log out, credit limit hub and history, contact us, about, SEC / BIR, manage and delete account, inbox, loan history, cancel a loan, rating |

## Tune

Account (credit ready, logged out, new, in review, documents needed, not approved, expired, on hold) · Loan (none, in review,
repaying, overdue, transfer failed) · Coupons (six, one, none) · Credit limit increase when the app opens · Network (normal, slow,
fails once) · Verification code (correct, wrong first, SMS fails first) · ID check · Selfie check · Inbox · Ask for a rating · blur.
A change reloads the app from its opening screen. Links: any setting as `?user=hold&loan=overdue`, `?page=<screen>` (for example
`page=payment`, `page=loan`, `page=inbox`), `?auto=0` (the app types no codes and doesn't move on by itself).

Loading is made up so it feels like a real network: a page's first load takes 0.35–1.1 s (sometimes up to 2.2 s), later visits are
often instant; actions wait 0.25–1 s and show the loader only when it's long enough to notice.

## What plays where

- **Animations instead of stills:** anti-scam cards (Customer service, Safe transaction, Verification code), rating (Doc verify,
  Customer service chat), sending code (Loading state OTP), every empty state and "Something went wrong" (Empty box), loaders and
  Order submit (Coins loading).
- **Order submit** plays only after Confirm on apply-a-loan, once the code is verified. **OTP sheet** opens from Confirm and from
  deleting the account. **Credit limit increase** plays on open when Tune turns it on.

## Compared with Figma (text positions within about 1.5 px)

Compared: log in, verification code, sending code, home (credit ready, on hold, not approved, expired, in review, onboarding),
amount keypad, withdrawal method, loan application status, Account tab, credit limit hub, contact us, about, SEC registration,
loan history, pay page (app).

Built but not yet compared number by number: permissions, add-documents home, loan detail (the coupon system's page; the amount card was
re-measured), Payment tab and payment detail, anti-scam cards, how-to-pay sheet, pay page (number / QR), log out and delete sheets,
credit history, inbox and message, loan record, cancel a loan, rating, bank search.

## Not in yet

Application details (ID, details check, basic information, trusted contact, selfie, loan estimate), add documents, FAQs, phone
number change, withdrawal account change with face check — these routes show a "not in the test app yet" page. The home card →
keypad morph of the Withdraw demo is not rebuilt yet (the keypad opens with a page push). The new shared components are not in the
gallery yet.
