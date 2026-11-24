# QA acceptance checklist

Two parts: **global checks**, run once per handoff drop or release candidate, and a **per-page template**, copied for each page that
changes and linked from its CHANGELOG entry.

Where the spec lives:
- **Every page and state**: PeraSure Dev Mode (https://samge.studio/devmode/?app=perasure). Each state opens the test app with the right
  Tune settings in the address (`devmode/data/pages.js`).
- **What changed and why**: the page's iteration in Dev Mode → Iterations (before | after | difference) and [CHANGELOG.md](../../CHANGELOG.md).
- **Product words and rules**: [PRODUCT.md](../../PRODUCT.md) and the `perasure-tone-of-voice` skill. **Visual rules and tokens**:
  [DESIGN.md](../../DESIGN.md).
- **Devices, widths, conditions**: [devices.md](devices.md).

Result per check: ✅ pass · ⚠️ pass with a note · ❌ fail. A difference from the demo is only allowed if the owner wrote it down (Dev Mode
note, PRODUCT.md or DESIGN.md); otherwise it is a fail.

---

## 1. Global checks (once per drop)

Build / commit: `<sha>` · Tester: · Date: · Devices: (rows from devices.md)

### Layout and visual
- [ ] Every page fills the phone width with 16 px margins and no horizontal scroll, at **360, 390 and 430** px wide.
- [ ] Only tokens: no new hex colours, raw sizes or loose font settings (px only for hairlines, shadows, blurs). Text uses the
      `.ps-text-*` styles (or their platform equivalent).
- [ ] Emphasised amounts are Reddit Sans in a Number style; notes and labels beside them are Inter.
- [ ] Bars follow the page level (DESIGN.md → 04): primary tabs, secondary pages, amount entry and order page. No progressive blur.
- [ ] Bar veils: the header's appears only when content scrolls under it; the bottom one fades out at the end of the scroll.
- [ ] Loading covers the whole screen; a failed load shows the fallback under the header with Try again.
- [ ] Every page has been laid over its Figma frame (Figma | app | difference).

### Words and money
- [ ] Copy follows the `perasure-tone-of-voice` skill: sentence case, plain English, no apology for a declined loan, no jokes in
      sensitive moments.
- [ ] Amounts with the ₱ sign and comma thousands; the largest amounts fit at 360 px. Dates as "Nov 20, 2026".
- [ ] Credit numbers agree on every screen (home card, hub, Account, credit history, amount entry): **one set of numbers**.
- [ ] A limit-increase coupon raises the amount only on the order page, once ticked; never on Home or the amount entry.
- [ ] Every amount, date and breakdown comes from the server; the app computes no fee, total or penalty (API.md).

### States (Tune in the test app = server state in production)
- [ ] Every state listed for a page in Dev Mode exists in the build and matches it.
- [ ] Account: guest, new, in review, documents needed, not approved, approved, limit expired, credit on hold.
- [ ] Loan: none, in review, repaying, overdue, transfer failed.
- [ ] Credit: with and without temporary credit; Credit limit increase in both credit states (unused / partly used).
- [ ] Coupons: six, one, none; "Keep your coupon?" with one and with two coupons.
- [ ] Outcomes: code correct / wrong / SMS fails; ID check pass / fail (in use, failed); selfie pass / fail.
- [ ] Inbox unread / read / empty; rating asked.
- [ ] Network: slow, fails once ("Something went wrong" → Try again), offline.

### Behaviour
- [ ] Every way into borrowing starts at the amount entry.
- [ ] Order submit plays only after Confirm and a verified code; double tap, back during a request or the app sent to the background never
      creates two loans or two payments.
- [ ] Input text at the agreed size (Android only, so no iOS zoom rule); number keypad for amounts, phone numbers and codes; pasting a code fills the cells.
- [ ] Sheets with inputs stay above the keyboard; pick lists in the application open as popovers.
- [ ] Toasts sit at the top; a new one covers the old; swipe left closes one.

### Motion
- [ ] Existing animations (Withdraw morphs, Credit limit increase, Order submit, OTP sheet) match the demo frame by frame.
- [ ] Page changes crossfade; only popovers bounce; animations move only `transform` / `opacity`.
- [ ] Carousels of animations play only the card on screen, from the start.
- [ ] Reduced motion: transitions switch at once; nothing flashes.

### Accessibility (WCAG 2.2 AA)
- [ ] Text contrast ≥ 4.5:1; large text, icons and borders ≥ 3:1.
- [ ] Touch targets ≥ 44 px where possible (24 px minimum); every gesture has a tap alternative.
- [ ] VoiceOver and TalkBack: every control has a label, headings are marked, reading order follows the screen, loading / errors / toasts
      are announced, status is not shown by colour alone.
- [ ] Text size 130 % and 150 % (and 200 % where supported): nothing overlaps or is cut off.
- [ ] Automated scan (axe or Lighthouse) shows no serious or critical issue.

### Regression
- [ ] For every changed shared component, every page that uses it was re-checked (Dev Mode → the component → where it is used). List them below.

Result: pass · pass with notes · fail. Notes:

---

## 2. Per-page template

Copy this block for each changed page.

```
### <Page name> (`<Dev Mode id>`) — iteration <id>

Build: <sha> · Tester: · Date: · Devices:

- [ ] Every state in Dev Mode matches the build (list them):
- [ ] Laid over the Figma frame: differences listed, each one allowed by the owner or a fail
- [ ] Copy checked against the tone of voice
- [ ] Data: every number comes from the API (ids from API.md):
- [ ] Loading, empty, error, offline
- [ ] Text size 130 % / 150 %, widths 360 / 390 / 430
- [ ] Screen reader pass
- [ ] Motion matches the demo

Result: ✅ / ⚠️ / ❌ · Notes:
```
