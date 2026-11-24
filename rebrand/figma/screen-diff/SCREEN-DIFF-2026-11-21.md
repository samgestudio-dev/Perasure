# Figma (Design – Rebranding) vs app: differences, 2026-11-21

- **Source:** Figma `kYyNV2MgxvH1w9bJ46A3yx`, about 140 screens across 22 sections. The app is the `tokens/rebrand-v3` working tree, checked at 360×800.
- **Method:** a read-only comparison per screen (Figma dump + screenshot vs the running app).
- **Tokens:** Figma variables and styles are identical to the repo, so every difference below is in screens, components or copy.

## A. Shared components: one fix covers many screens

| # | Component (code) | App now | Figma | Screens affected |
|---|---|---|---|---|
| A1 | Bottom nav `ps-nav__tab` | active icon + label navy | active **green** `fg/accent` | every tab screen |
| A2 | Split tabs / segmented `PS.Tabs`, `.ps-tabs__pill` | active navy + white label; inactive with a green outline | active **green** `control/checked-bg` + navy label; inactive white, no border | Credit history, Inbox, Coupons, coupon picker |
| A3 | `PS.SelectBar` (selected) | outline / radio `--border-selected` #76DC93 | `border/accent-strong` #298648 | withdrawal methods |
| A4 | `PS.Slider` / AmountCard / Withdraw order slider | dark green #298648, dark knob | light green #76DC93, white knob | loan estimate, order page, withdraw |
| A5 | `PS.DatePicker` selected day, `PS.LineTabs` underline | dark green fill, white text / dark underline | #5CD680 fill with navy text / light-green underline | select date, address picker |
| A6 | Icon tiles in Strip / Tooltip / OrderStatus / Account credit-limit row | icon inside a navy tile | **bare** icon | home strip, tooltips, order state, account |
| A7 | `PS.Confirm` Cancel | white outlined | **Neutral grey filled** | logout, delete account |
| A8 | `PS.Tooltip` (Simple) | no icon, no close | leading clock icon + close × (grey) | credit-limit hub, home card tooltip |
| A9 | StateCard buttons (Reapply now, Add documents) | shade / white variants | **green Primary** | home expired, home docs |
| A10 | `PS.CouponTicket` | label `fg/accent`, "Best" tag green, Used/Expired labels #61627a, rule "Any amount · …" | label `fg/accent-strong`, "Best" **orange** (`bg/attention-muted`), Used label green, Expired `fg/disabled`, rule "4 / 6 / 8 terms" | coupons |
| A11 | `PS.CouponOption` selected outline | `fg/accent` | `border/accent-emphasis` #5CD680 | coupon picker |
| A12 | `PS.FormField` | labels upper-cased by CSS; placeholder #8A8A9C; value #000128; clear button | mixed-case labels; placeholder #D6D6DD; value #3D3E5C Medium; trailing chevron | basic info, check details, trusted contact, withdrawal method |
| A13 | Choice pickers (marital, payroll, gender, ID type) | anchored popover menu | bottom **Sheet** with SelectBar radios / ListItem rows with "Higher credit" tags | basic info, ID type |
| A14 | `PS.FaceCamera` | navy-black background, "Take again" shade, Next white | pure black, "Take again" Inverse (white outline), Next **Primary green** (bank-card frames; the phone-change frames disagree) | phone change, bank card |
| A15 | `PS.LinkList` / RelatedLinks | 14 px rows | 16 px Medium / 24 line height | FAQs |
| A16 | Search sheets (BankList, MethodPicker) | regroup or filter, no highlight, extra body line when empty | keep the full structure, **green highlight** of the typed text, a single empty line | bank search, pay methods |
| A17 | `PS.EmptyState` / `PS.GuestPay` | GuestPay has no illustration, lighter title and body | empty-box art, title `fg/default`, body `fg/subtle` | payment logged out (Figma `EmptyState` placed today) |
| A18 | Agreement line (order page) | whole line grey | "Loan Agreement" / "Loan Disclosure Statement" as **green links** | order page |
| A19 | Sheets: scrim | light dim | darker navy gradient scrim | all sheets / popovers |
| A20 | `PS.PayTimer` | centred | left-aligned | pay by app / QR |
| A21 | Log Out button | `ps-btn--inverse`, white, no border | Button Large Plain (text) / white + `border/selected` (two frames disagree) | account |
| A22 | `PS.Splash` | light `--bg-page-strong` | dark **navy** background | opening |

## B. Screens or states in Figma that the app does not have

- **PaymentCard:** state Due ("Overdue · 1 days" + green notice) and state Overdue-with-penalty ("Includes a ₱50.00 penalty").
- **Home:** the "You have updates" strip together with a Next payment card. The app never shows both.
- **Loan application:**
  - empty withdrawal method ("Add a withdrawal method");
  - the "Update withdrawal method" sheet + card;
  - the amount-edit popup (Back / Confirm).
- **Loan estimate:** "View payment schedule" should open the Payment Plan sheet (the app shows a toast).
- **Credit limit hub:**
  - Empty card ("No limit history yet");
  - per-tab empty states (Borrowing activity / Credit adjustment);
  - the tooltip text "valid until …".
- **Delete account:** OTP as a full page with a destructive button and Cancel; the success toast over it.
- **Short link:** "The link has expired", "No payment due", "You're all set".
- **App download landing page; Miniapp loading** (mark + wordmark + 4-dot progress).
- **Change bank card flow** (only `PS.FaceCamera` exists).
- **Loan contract:** scanned document pages (the app has a placeholder).
- **Loan history:** the bottom nav on history and loan-record pages.
- **Home layout:** the app has "Coupons for your next loan" and "Invite a friend / Pay early" cards that no Figma home frame has. Figma has a Banner slot, the "A trusted choice" block with avatars, and a partner logos row (order DBP, EastWest, GCash …).

## C. Copy

1. **Casing.** Figma uses Title Case in titles, labels and buttons (Credit Limit, Loan History, Repayment Plan, Cancel My Loan, Log Out, Due Date, Sign up or Log in …). The app uses sentence case, as the PeraSure tone of voice asks. **Decision needed.**
2. **Wording.** In about 60 places the app's copy is a tone-of-voice rewrite of Figma's. Examples:

   | Figma | App |
   |---|---|
   | "Agree & Authorize" / "Skip" | "Agree and continue" / "Not now" |
   | "Schedule 1" | "Payment 1" |
   | "GCash end in 4057" | "GCash ending in 4057" |
   | "You applied a loan" | "You applied for a loan" |
   | Inbox empty "Your inbox is empty" | "No messages yet" |
   | FAQ articles | FAQ articles, reworded |
   | anti-scam cards | anti-scam cards, reworded |
   | selfie tips | selfie tips, reworded |
   | trusted contact | trusted contact, reworded |
   | OTP copy | OTP copy, reworded |

   **Decision needed:** which source wins (Figma copy as written, or the app's tone-of-voice copy).
3. **Term chips.** Figma's loan detail says "3 Terms / 6 Terms / 8 Terms"; its own Enter number frame says "4 Term". The app says "4 Term" (Withdraw) and "4 terms" (loan page).

## D. Figma inconsistencies and typos to settle in Figma

- **Typos:** "Martial status", "WOKR City / Province", "Selete an ID type", "You new credit limit", "about the your application", a full-width "（" in the hotline, "Loans" in "Supports ₱50k+ Loans".
- **Basic info:** two different subtitles.
- **ID upload:** "Upload back side" on both ID cards.
- **Date sheets:** drawn over "Verify your identity".
- **Coupons:**
  - the Used frame's Meta fill is on the frame, so it draws grey bars;
  - Empty shows a count of 6 and borrowed copy;
  - the credit-limit coupon uses the discount art.
- **Coupon keep-sheets:** a stray "Thank you for your feedback!" layer.
- **Face camera:** phone-change and bank-card frames disagree on the button styles.
- **Badge "1":** navy in one frame, white in another.
- **Anti-scam sheets:** drawn over the old InstallmentCard list.

## E. Bug

- `?page=loan` → "View payment schedule" crashes the app (`S.L` undefined at `prototypes/app/screens-loan.js:202`, blank screen).
