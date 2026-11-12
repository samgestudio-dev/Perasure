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

## Loading, entrances, tooltips

- **Loading covers the whole screen** (owner): while a page's data loads, the Loading page fills the screen — coin and dots in the
  middle, at the Loading page's sizes — and only the header's buttons stay. When it fails, the fallback page ("Something went wrong",
  Figma 52:10976) fills it the same way. `APP.Loaded` does both with `PS.Cover`. `?fast=1` skips every wait (for checking a screen).
- **What was waited for rises in** piece by piece (`PS.Rise`: 0.34 s each, 40 ms apart); a page seen before is there at once. Lists
  that replace each other (tabs) and the content of a sheet rise in the same way; home's cards do the first time it shows.
- **Withdraw on the home card:** the card grows into the keypad's sheet and closes back into it (the card morph: one progress on the
  Smooth spring; the box's colour goes blue → white as two flat layers; the page comes in behind it; what is in the sheet rises in once
  there is room and leaves first on the way back). From the pencil on the loan page the keypad **rises from the bottom** like a sheet
  (`APP.go(name, params, 'rise')`) and goes back down. Typed digits rise in.
- **Tooltips place themselves** (`APP.tipAt(element, text, width)`): 8 px under what was tapped, centred on it, or with their edge
  16 px past it when it is near a side; never outside the 16 px margins; above when there is no room below.

## Compared with Figma

Every page and sheet that is built was laid over its Figma frame (Figma | app | difference) and corrected: log in, verification code
(box states), sending code, permissions, home in every state (with the penalty explainer), amount keypad, loan detail, withdrawal
method and bank search, verification sheet, loan application status (in review, failed), Payment tab (list, empty, signed out),
payment detail, anti-scam cards, how-to-pay sheet, pay page (app, number, QR), Account tab (signed in, signed out), log out, credit
limit hub, credit history (both tabs), contact us, about, SEC and BIR registration, manage account, delete account and its sheets,
inbox and message, loan history, loan record, cancel a loan, rating sheets, the fallback page.

Icons are the Figma exports (`shared/ps-ui/assets/icons`), not redrawn ones.

Where the app differs from the frame on purpose: copy follows the PeraSure tone of voice; the loan detail has the coupon system's
coupons section; sample numbers and names; stills replaced by their animations; the Tune button in the header.

## Not in yet

Application details (ID, details check, basic information, trusted contact, selfie, loan estimate), add documents, FAQs, phone
number change, withdrawal account change with face check — these routes show a "not in the test app yet" page. The keypad's
amount does not travel into the loan card yet (keypad → loan detail is a page push); the Withdraw demo's travelling amount is the reference.
