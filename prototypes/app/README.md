# PeraSure app (test environment)

> **For AI agents — components first (owner's rule):** a new component or feature is created in the component library
> (`shared/ps-ui`, with its states in `shared/gallery.html`) first, then this page uses it directly; a change to a piece is made in
> the component, never patched from the page. See the `perasure-components` skill and `CLAUDE.md` → "Components first".

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
| `screens-kyc.js` | the application, in its order: the loan estimate, basic information, ID type and both sides (camera or album), the check of the details, the selfie, a trusted contact (Submit); the date and city sheets |
| `ph-places.js` | the Philippines' regions, provinces and cities / municipalities (PSA PSGC 2025-2Q) for the address sheet |
| `screens-help.js` | help articles (index, topic, article, search), changing the phone number (old → new → code → selfie → done), proof of income (documents) |
| `screens-withdraw.js` | the home card and Withdraw: the Withdraw demo's own code, hosted |

## Tune

Account (credit ready, logged out, new, in review, documents needed, not approved, expired, on hold) · Loan (none, in review,
repaying, overdue, transfer failed) · Coupons (six, one, none) · Credit limit increase when the app opens · Network (normal, slow,
fails once) · Verification code (correct, wrong first, SMS fails first) · ID check · Selfie check · Inbox · Ask for a rating ·
Progressive blur (off by default, owner) · **Screen fit** (capped zoom 1.15× by default · capped zoom through rem · 1:1 · full zoom) · **Text size** (System — the
phone's setting — or 85 / 100 / 115 / 130 / 150 / 200 % for checking; see "Sizes and text size").
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
  very middle, larger than on the Loading page (a 72 px coin, dots 104 wide) — and nothing else shows. When it fails, the fallback page ("Something went wrong", Figma 52:10976) shows
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
- **Toasts sit at the top** (owner), under the header bar like an iPhone notification: they drop in from above on the Smooth spring and
  rise away (`PS.Toasts`). Tapping again shows a new one at once; it covers the one before, which slips 10 px down, shrinks to 94 % and
  fades (three deep at most, like iOS notifications — a stack, not a list). Each keeps its own time; a swipe left closes it at once.
- **Secondary pages** (owner): every page except the Home / Payment / Account tabs has a solid header in the page colour, no gradient
  (`PS.Screen{secondary}`, `APP.Page`); the immersive amount entry and the order page keep theirs.
- **Loading and Order submit are the whole screen and nothing else**: no header, no bottom bar, no tab bar.
- **Bars have no colour while they cover nothing**: the header's veil comes in as content scrolls under it (over the first 24 px),
  the bottom bar's and the tab bar's goes as the scroll reaches the end.
- **Tooltips place themselves** (`APP.tipAt(element, text, width, { icon, big })`, DS 9137:25806): one corner covers what was tapped and
  reaches 12 px past it on both sides — top-right for something in the right third, top-left in the left third, centred in the middle;
  a bottom corner (opening upwards) when there is no room below; never outside the 16 px margins.
- **Lists in the application are popovers** (DS 7201:12032; the bottom-sheet lists are retired): glass card, 36 px pills, at most 220
  high with a thumb and a fade, 8 px under the field and right-aligned, above it when there is no room (`PS.FormField{menu}`). The
  email suggestions use the same card.
- **Dates** (DS 7628:14113): the month's days, the chosen one on a brand circle; the month or the year opens a wheel
  (react-wheel-picker, `vendor/react-wheel-picker@1.2.3`) with Cancel / Confirm (`PS.DatePicker`). A date of birth is 18+, a payday
  within two months. The card keeps six weeks' height, so stepping months never makes it jump (Figma shows five).
- **The camera is the phone's own** (ID: back camera in a box; selfie and the phone change: front camera). A photo is only shown, never
  uploaded or kept; once it's taken the step passes. Whatever is filled in and in the right format passes (owner).
- **Payment logos are 24 px** (owner) in the withdrawal method and bank lists.
- **Applying** (owner): Your loan estimate → Basic info → ID type → Check the details → selfie → trusted contact → Submit (the
  application goes in for review). Home's Apply and Reapply start at the estimate (`APP.apply()`).
- **Addresses** are the real list (owner): Region → Province → City / municipality tabs (the underline moves to the step; City opens once
  a province is picked), or search, which groups matching cities, provinces and regions with the typed part in brand blue.
- **The selfie** (DS 5561:7329 / 7501 / 7411): while it uploads only the circle stays — a turning dashed brand ring with "Uploading";
  a failed check shows the red mark and "Failed", and the button becomes Try again.
- **The coupon picker** (DS 10836:28988): white coupon cards (`PS.CouponOption`; the picked one has a 1 px brand line inside, the default shadow and the mark), no counts on the tabs; the countdown strip only with less than a
  day left (owner). The coupon centre keeps the tickets.
- **Lists open where you tap** (owner), like an iPhone menu: centred on the finger, 8 px from the page's sides at most.
- **Dates**: the month wheel lists only the months of the year on show that can be picked (names only); the ‹ › arrows switch month / year at
  once and a sideways swipe on the days changes the month; the days are always six rows.
- **Animations in a carousel** play only on the card on screen, from the start each time it is swiped to ("Protect yourself from scams").
- **Fonts as Figma marks them** (owner): Satoshi only where the Figma node is Satoshi; amounts Figma sets in Inter or Hanken stay so.

## Sizes and text size

Everything is sized in **rem** (owner): 1rem = 16 design px at the default text size. The tokens come in rem from
[`tokens-rem/`](../../tokens-rem/README.md) (made from `tokens/tokens.css` by `tools/rem-tokens.py`; the token files are never edited),
`shared/ps-ui/ps-ui.css` and `app.css` are written in rem, and lengths given in JavaScript go through `PS.rem(n)` / `PS.y(n)` /
`PS.px(n)` (core.js). What stays px: hairlines (1–2 px strokes), shadows and blurs, the 40 px status strip above the screen, and the
Withdraw demo (its own code, see below).

Two separate factors decide how big things are drawn:

1. **Screen fit** (Tune, default capped zoom): the 360 design enlarged with the screen, at most 1.15× (`phone-fit.js`). "Capped zoom ·
   rem" gets the same factor by raising the root font size instead of zooming the page, so everything in rem grows and the Withdraw
   demo's px screens stay 1:1 — the option to try for a rem-only scale.
2. **Text size**: the phone's own setting — Chrome / Android WebView through `<meta name="text-scale" content="scale">` (Chrome 146+),
   iOS Safari / WKWebView through Dynamic Type (`-apple-system-body`), desktop browsers through their default font size. Up to **130 %**
   the whole layout follows (spacing, icons and boxes grow with the text, so nothing clips); above that only text grows (`--ps-tx`), and
   the phone's setting is capped at **150 %** for now. Tune → Text size fixes a value for checking; 200 % there shows what still needs work.

At the default size every page is pixel-identical to the px version (checked page by page). Known gaps: the Withdraw demo's screens
(home card, amount entry, order page) are the demo's px code, so they follow the screen fit but not the text size; at 200 % some
one-line rows (coupon tickets, top bar titles, installment rows, the log in consent) still need room to wrap.

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
inbox and message, loan history, loan record, cancel a loan, rating sheets, the fallback page; and in round 5 the application
pages against the design system's "Application Details" (3908:1341: ID type, upload, check, popovers, date, basic information, contact,
selfie, estimate, camera), the withdrawal method tabs (52:8389), the payment method sheet (7792:15391), the repayment tiles
(10534:35615), the tooltips (9137:25806, 10545:38381), the home card without temporary credit (10789:29220), help articles
(5453:4712), the phone change (8655:27419) and proof of income (9465:26742, 9473:27722). Round 6 went through the application again token
by token: the estimate (9224:37691), basic information with a file (9548:30951), upload and upload success (5583:4934, 6012:34214), the
selfie states (5561:7329, 7501, 7411), the trusted contact (5561:7317), the ID in use / failed sheets (5908:10722, 5908:11000) and the
camera (5788:13914).

Icons are the Figma exports (`shared/ps-ui/assets/icons`), not redrawn ones.

Where the app differs from the frame on purpose: copy follows the PeraSure tone of voice; the loan detail has the coupon system's
coupons section; sample numbers and names; stills replaced by their animations; the Tune button in the header. In the application:
sentence case for labels; text fields show the clear button, not a chevron (Figma draws the chevron on every field); the date card keeps
six weeks; the trusted contact's button is Submit (it is the last step now); the selfie's failed button is Try again. Figma
inconsistencies left as the system has them: the selfie frame's heading text is 320 wide (312 elsewhere), its "Failed" is Nunito Sans
(the app uses Section-title/sm), the uploading ring's #F5F5F5 has no token (Neutral/50 is used).

## Shared pieces and the gallery

Every piece of the app's look is a shared component in `shared/ps-ui`, shown with its states in the
[component gallery](../../shared/gallery.html) (owner: a new piece is made there first, then the page uses it). `app.css` only places
shared pieces (stacks, gaps, the Withdraw demo's layer); nothing in it restyles a component. Moved out of the app, each checked pixel for
pixel against the screen it came from: `apply.js` (`PageHead`, `PageHero`, `IdCamera`, `IdSideCard`, `Selfie`, `FaceCamera`, `IdResult`,
`FileList`, `SearchSheet`, `BankList`, `PlacePicker`, `EstimateCard`, `Article`, `Feedback`, `RelatedLinks`), `layout.js` (`SheetHead`,
`ButtonRow`, `Confirm`, `BottomBar` `note` / `consent`), `feedback.js` (`Splash`, `SendingCard`, `Fallback`), `form.js` (`OtpForm`,
`ReasonList`), `loan.js` (`OrderHead`, `OrderStatus`, `PlanRows`, `AmountEntry`), `pay.js` (`PenaltyInfo`, `ScamTips`, `GuestPay`,
`PayDock`, `Accordion` `icon`), `account.js` (`GuestProfile`, `AboutHead`, `FooterMark`, `RegCard`, `Message`, `Rating`), `list.js`
(`Bullets`, `LinkList` `tall`), `core.js` (`TextLink`, `InfoButton`, `SectionLabel`, `Glass` `size: 'lg'`), `coupon.js` (`Tabs`
`spaced`). Sheets that need their own padding take a class from ps-ui.css: `ps-idres`, `ps-confirm`, `ps-rating`, `ps-scams`,
`ps-sheet--white`, `ps-sheet--inset`.

## Not in yet

The withdrawal account change with its face check (换绑卡流程) shows a "not in the test app yet" page. The `amount` and `loan` pages
built on the shared components are only what shows if the demo's code cannot be loaded.
