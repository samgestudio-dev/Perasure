# Open questions for the design owner

The design owner answered on **2026-11-24**. The answers are applied in `02-changes/changes-by-file.json` (edits carry
`decided: "2026-11-24 <letter>"` and `needsOwner: false`); details per file in `02-changes/conflicts.md`.

## Open

- **Design side to fix in the rebrand token file:** `--duration-*` are emitted in px and `--easing-*` as quoted strings; don't use them
  until fixed. → `01-tokens/unresolved.md` §7
- **Waiting for design** (decision G): 02 AppEntryLanding showcase picture, 09 PaymentErrorModal, 10 PaymentListRecoveryState.

Nothing else is open. Two edits stay `manual` by nature (E285, E286: icon recolours through CSS filter chains, see their `target`).

## Decided 2026-11-24

**H. Every other per-file call** (the 56 edits that were still `needsOwner`): the owner accepted the package's value for all of them
(`decided: "2026-11-24 H …"`) — `conflicts.md` sections B (7, 10), C and D, the shared-rule buttons left as they are, the hyphen copy
fixes E507–E523.

**G. Production pieces with no rebrand design** (screenshots reviewed, before | after): **hold for a proper design before release** —
02 AppEntryLanding (the showcase picture still shows the old blue app), 09 PaymentErrorModal, 10 PaymentListRecoveryState; their
token-map edits may still be applied meanwhile (`designPending: true` in `changes-by-file.json`). **Ship as the package leaves them**
(token map only) — 01 CreditIncreaseIntro, 03 NoticeTicker (backend colours: update the server palette to the rebrand colours),
04 RiskVerifyCaptcha, 05 DisclosureStatementForm, 06 RejectDiversionCard, 07 FeedbackInvitationSheet, 08 FraudWarningSheet,
11 Payment fraud ticker (backend colours), 12 ShortLinkRepay reloan banner. → `05-coverage/coverage.json` (b)

**A. Keep as the package has them.**
- **Grey text and lines become navy** (decision 42; 34 production grey tokens map to navy). → `unresolved.md` §1
- **The 14 "current design" token rows** (primary label navy, glass 80 %, scrim navy 40 %, navy brand cards / icon discs, darker tag
  text and borders). → `unresolved.md` §2, `conflicts.md` 8
- **Contact-method selected state = demo:** label `--fg-accent`, ring `--border-selected` (E360, E361). → `conflicts.md` 3
- **Slider knob = green centre + knob elevation** (E081–E084, E114; captcha thumb E189, E190). → `conflicts.md` 5
- **Boot splash navy + white wordmark** (E008–E010, E013–E015). → `conflicts.md` 9
- **"Best" pill = demo orange** (only matters when coupons are built; nothing is edited now). → `conflicts.md` 1

**B. Brand-card gradient.** Figma's Gradient/Brand-card (`--gradient-brand-card`) as `background` on the home credit card
(CreditAmountCard, E219), the application state card (ApplicationStateCard, E544) and the Home state card `.primaryCard`
(expired / error, E425, E421; its old ellipse highlight goes, E424). Diversion / partner cards stay flat navy. Test E534 follows.
→ `conflicts.md` 2

**C. No focus ring.** The global `:focus-visible` ring (former E002, `global.css:192`) is removed from the package; production keeps
its no-outline rule. Caret colours stay (E003 and the per-field caret edits). Existing per-control focus outlines in production only
change colour, as before. → `conflicts.md` 6

**D. Amount tracking = Figma Amount styles, weight 700, in em:** xxl `0.04em`, xl `0.04em`, lg `0.03em`, md `0.02em`, sm `0.03em`,
xs `0.02em` (xl / sm: Figma has no Amount style, the Number values stay). Edits E545–E555 on every selector moved from Satoshi to
`--font-family-number`. → `conflicts.md` 4

**E. Home tab bar active icon — structural (owner-approved).** The decorative `<img>` becomes a `<span aria-hidden="true">` with the
same SVG as CSS mask and `background-color: currentcolor` (E023 in `BottomNavigation/index.tsx`, E542 in its CSS); active
`--fg-accent`, inactive `--fg-default`. → `conflicts.md` C

**F. Overdue red button on Home — structural (owner-approved).** The payment button gets
`data-overdue={repayment.isRepaymentOverdue}` (E543 in `HomeComposite.tsx`), and `.repaymentFooter button[data-overdue='true']`
paints it with the destructive button tokens (E400); the `:has()` rule is gone. → `conflicts.md` C
