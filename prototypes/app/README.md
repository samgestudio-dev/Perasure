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
  very middle, larger than on the Loading page (an 88 px coin, dots 128 wide) — and nothing else shows. When it fails, the fallback page ("Something went wrong", Figma 52:10976) shows
  under the header, so the way back stays. `APP.Loaded` does both with `PS.Cover`. `?fast=1` skips every wait (for checking a screen).
- **What was waited for rises in** piece by piece (`PS.Rise`: 0.34 s each, 40 ms apart); a page seen before is there at once. Lists
  that replace each other (tabs) and the content of a sheet rise in the same way; home's cards do the first time it shows.
- **Everything the Withdraw demo covers is the demo as it is on GitHub** (owner), apart from new features and the numbers
  (`screens-withdraw.js`, `shared/ps-ui/withdraw-host.js`, which loads `prototypes/withdraw-fund-flow/withdraw.js` + `motion-tokens.js` as
  they ship — nothing is re-made, so a change to the demo shows up here): the home card, the screen that slides up from the bottom, the
  amount entry, the morph into the order card when a term is picked, and the order page's blocks — order details, borrower protection
  with its Protected / Add button, withdrawal method, the agreement and the nudge when Confirm is tapped before it is ticked — with the
  demo's look and copy. The app adds the coupons section (new) above the order details and a Discount row, and gives the numbers, the
  first payment date, the withdrawal method chosen in the app and what the taps on the method card, "View payment schedule" and Confirm
  do. The amount and term chosen there are the app's loan, so coupons follow them ("Keep your coupon?" included).
- **Same size on every page** (owner): the demo is laid out as wide as the screen and never scaled (it was drawn 360 wide and scaled up
  on bigger phones, so its type came out up to ~10 % larger than the app's), and its own page CSS comes with it (`.ps-wd`: taps that
  fire at once — without it iOS waited ~0.3 s on every key and term pill — the caret's blink, content-box sizing).
- **Page changes crossfade** (owner), as home's tabs do: no sideways slide. The amount page used when the sheet cannot load still rises.
- **Every way into ordering starts at the amount entry** (owner): Withdraw on the home card and in the credit limit hub, a coupon's
  "Use" (the coupon is put on the loan once the amount and term are chosen, if it fits), "Go to borrow" in a message — `APP.borrow()`.
  The terms are the demo's 4 / 6 / 8.
- **Order submit** is the Order submit demo value for value (`PS.OrderSubmit`): letters in and out one by one, the dots that keep
  counting, the coin changing to the tick only at the end of its turn — and the app goes back to home only when the last line has
  held and the tick has finished playing.
- **Where loading, Order submit and empty states sit** (owner): the loader is in the very middle of the screen; Order submit's coin
  (72 px, the same size as the loader's) and text sit a little above the middle (`.ps-stage`); a page that only has an empty state
  (`PS.EmptyState{page}`), the fallback and the signed-out Payment page put their picture / text at Order submit's height.
- **The Credit limit increase closes into the home card as in the Withdraw demo**: home's credit card is the demo's own card
  (`APP.WdHero`: the sheet draws it into the page), and the exit is the demo's
  `introExit` — both credit states (see CLAUDE.md → "Withdraw: the two credit states"): Tune → Loan "No loan" gives *credit unused*
  (the big number travels into the card), any other loan state gives *partly used* (the available amount counts up, the green bar
  slides out). With no temporary credit (Tune) there is nothing to announce: no intro, and the card has no temporary line. At the end
  the Credit limit screen goes in the same moment (it used to flash back for a frame).
- **Home's blue card, the payment card and the "You have updates on your loan" strip** have the default shadow (owner).
- **Toasts sit low** (owner): 12 px above whatever is at the bottom of the page on top — the tab bar, a bottom bar's button, the pay
  bar, the order page's Confirm — and 24 px above the screen edge when nothing is there (`PS.Toast{bottom:'auto'}`).
- **Loading and Order submit are the whole screen and nothing else**: no header, no bottom bar, no tab bar.
- **Bars have no colour while they cover nothing**: the header's veil comes in as content scrolls under it (over the first 24 px),
  the bottom bar's and the tab bar's goes as the scroll reaches the end.
- **Tooltips place themselves** (`APP.tipAt(element, text, width)`): 8 px under what was tapped, centred on it, or with their edge
  16 px past it when it is near a side; never outside the 16 px margins; above when there is no room below.

## One set of numbers

Every amount and date that matters comes from one place, `coupons-data.js` (owner), so the screens agree. Nothing of it is in Tune
except two switches:

| What | Value | Where it shows |
|---|---|---|
| Credit limit (long-term) | ₱40,000 | credit history ("ID verified" + "Documents verified"), the "Your credit limit is ready" message, the hold text |
| Temporary credit | ₱10,000 until Nov 20, 2026 — **Tune → Temporary credit** on / off | home card (legend, green part of the bar, ⓘ tooltip), Credit limit increase (the increase and its end date), credit history ("Temporary credit added") |
| Total credit | limit + temporary = ₱50,000 | home card, hub, Account |
| Used credit | the current loan, ₱5,000 — ₱0 with **Tune → Loan** "No loan" | hub, credit history |
| Temporary credit left | temporary − used = ₱5,000: **the temporary credit is used first** (owner) | home card (legend, green part of the bar, ⓘ tooltip); the partly-used intro counts the available amount up by it |
| Available | total − used = ₱45,000 | home card, hub, Account, the most that can be typed on the amount entry |
| Limit-increase coupon | +₱5,000 / +₱3,000 / +₱2,000 — not credit: it raises what **one loan** may borrow, and only on the order page once it is ticked there (owner) — never on home or the amount entry | order page, coupon pages |
| The current loan | ₱5,000, 4 terms, with the 25% first-payment coupon; taken 10 days ago (repaying), 18 days ago (overdue: first payment 3 days late, the last day without a penalty) or today (in review / transfer failed) | home payment card, Payment tab, payment detail, pay page, loan application page, "Your loan has been sent" message, "Used" coupons, credit history |

- Ordering a loan in the app takes its amount out of the available credit at once (`CS.take`): home card, hub, Account, credit
  history (a "Loan in review" line) and the next order's limit follow. The loan being repaid stays (`APP.S.repay`).
- Today is Nov 12, 2026 in the app; due dates, "Due in N days" and the penalty date are counted from it.
- Not part of the story: **Loan history** and the loan record show one row per state (sample ₱2,000 loans), so every state can be
  opened; the guest hero ("up to ₱50,000") and LoadCash's offer are the product's own figures.

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
number change, withdrawal account change with face check — these routes show a "not in the test app yet" page. 

**Withdraw demo motion still to bring over exactly**: the Credit limit increase closing into the home card (`introExit` in
`withdraw.js`, with `intro.js`). Today the Credit limit increase simply ends on home. The `amount` and `loan` pages built on the shared
components are only what shows if the demo's code cannot be loaded.
