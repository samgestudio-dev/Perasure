# Dev-handoff lane log

### 2026-11-21 · Amount weight 700, legacy-weight twins (owner / Figma lane)
- Checked tokens/v2 (rebuilt 11:50): 657 vars; their script on a copy gives the same lines. `--amount-xxl/-lg/-md/-xs-font-weight` 800 → 700.
  The 657th var is `--bg-urgent-subtle` #FFE6D5 (CHANGES 2026-11-21), and `--content-urgent` is now orange-500 #FF5E00 (was #B83F00).
- DEV-HANDOFF §2d: added the Amount 700 bullet (no phase-1 effect in `src/`: no rule reads an amount / number weight variable). Added a
  "Legacy-weight twins" block: the 14 twins from TYPE-AND-STYLES.md with "base + `font-weight` primitive" for code. The bases are inferred
  from size and line, so `Label/xs` maps to `caption-xs`.
- Weight scan of the 21 old weight variables `src/` reads: 11 rules come out heavier or lighter than legacy in phase 1. Added them as a
  phase-2 table:
  - display-md ×3 (AmountEditDrawer) and display-sm ×4 (amounts) go 700 → 800, and headline-sm ×2 too → `--font-weight-bold`.
  - section-title-xs ×2 (status badge, term tag) goes 600 → 500 → `--font-weight-semi-bold`.
  - Added a summary row (11 rules, 20 min) and changed the §2d visible-changes bullet for section-title-xs.
- Mapping table (text styles row) and §1.1 count (656 → 657, `--bg-urgent-subtle`, Amount 700).
- §2m corrected for the 2026-11-21 token change: `--content-urgent` orange-500 #FF5E00 is 3.1:1 on white (2.8 on the page, 2.6 on the pill),
  so it passes AA only for large / bold text; it is the owner's pick and a phase-2 check. Added a row for `--bg-urgent-subtle` (the "Best" pill fill).
- Backup: scratchpad handoff_before_twins.md. Nothing committed.

### 2026-11-20 · Green text is green-700, heavy / pressed green-800 (owner)
- Checked tokens/v2 (rebuilt 23:19): 656 vars; their script on a copy gives the same lines. Changed: `--content-accent-strong`,
  `--content-link`, `--content-positive`, `--tag-accent-content`, `--tag-positive-content` → green-700 #44A05F; `--content-accent-heavy`,
  `--content-link-pressed`, `--content-positive-strong` → green-800 #327545.
- Alias check rerun with the new text targets: still 102 of 113 on target, 1 intended (button label navy), the same 10 misses (§2p).
- DEV-HANDOFF: green-800 → green-700 for green text and icons, and green-900 → green-800 for heavy / pressed. Changed in the mapping table,
  the phase-1 summary, the colour rule, the alias sentence, §2a (8 SVG rows plus the success tick → #44A05F; the ticker icon → #327545), the
  §2a CSS link row, §2e (IdentityUploadCard status, payment tab filter), §2i (ticker text #327545 on #D1FBD9, 4.9:1; config fallback),
  §2j, §2l, §2o, the phase-3 codemod note, and §6-4.
- §2n: 16 → 14 rules. `.historyEmpty h3` and `.matchBadge` write `--color-brand-700`, which is now the text tier, so they moved to
  "already right". `.repaymentCard header > strong` (brand-800) is the heavy tier; the optional switch is now `--content-accent-heavy`.
- Contrast note (look-parity block, colour rule, §6-4): green-700 is 3.3:1 on white (3.0:1 on the page), so it passes AA only for large or
  bold text. It is the owner's pick and a phase-2 check. Heavy green-800 is 5.6:1.
- Backup: scratchpad handoff_before_g700.md. Nothing committed.

### 2026-11-20 · `--bg-selected` = green-600 with a navy mark (owner)
- Checked tokens/v2 (rebuilt 19:43): 656 vars (their script on a copy gives the same lines). The only change is `--bg-selected` #000128 →
  #5CD680. No legacy name aliases to it, so every selected control needs a hand fix.
- DEV-HANDOFF §2o: new "Selected checks and radios" table (5 controls, 30 min), with ring / fill → `--bg-selected` and tick / mark →
  `--content-on-action` (navy, 11:1):
  - AgreementConsent `.checkboxChecked` (adds the navy tick; settles §6-1)
  - RepaymentCard `.itemSelected .checkButton` (its alias was navy, §2p)
  - LoginEntry `.agreementCheckActive` + `.checkMark` (legacy green-600, same fill, mark now navy)
  - BankCard radio ring and dot (moved from §2n, which is now 16 rules)
  - AccountDeletionReason radio ring
- The selected radio SVG `radio-selected.svg` was already #5CD680 in my last version; its row now names it as the `--bg-selected` dot.
- Left on the step: the `Checkbox` component and `SelectSheet` option indicator draw in legacy blue-500, so they become green-500 through the
  alias. The BorrowerProtectionCard toggle is a light chip. src has no knob switch.
- Nothing committed.

### 2026-11-20 · green text one tier darker (owner)
- Checked tokens/v2 (rebuilt 19:29): 656 vars (their script on a copy gives the same lines).
  - `--content-accent-strong` / `--content-link` / `--content-positive` = green-800 #327545; heavy / pressed = green-900 #18572D.
  - All legacy brand text, link and icon names alias to `--content-accent-strong`; `-heavy` names go to `--content-accent-heavy`.
- Alias check under the new rule (step for fills, green-800 / -900 for text): 102 of 113 on target, 1 intended (navy button label), 10
  misses. `--tag-color-brand-text-default` is now correct, so it left §2p.
- New finding, now **§2n (18 rules)**. Some code uses a *text* token as a fill or border, and the alias now gives green-800 instead of the
  step colour:
  - documents progress bar ×2
  - selfie ring stroke, `.dot_light`
  - RepayDetailShell borders ×2, BankCard radio ×2, BIR focus outline
  - `.npcMark` ×2, Liveness `.cardCheck`
  Other code writes a scale step as text, so the alias gives the step instead of green-800:
  - BorrowerProtectionCard ×3, `.historyEmpty h3`, RejectDiversionCard amount, `.matchBadge` text
- DEV-HANDOFF:
  - **SVG rows:** icons on light backgrounds → #327545 (10 files, incl. the work-documents tick). The filled tiles (loan-detail-reviewing,
    loan-update) and the selected radio keep the step #5CD680. The ticker icon → #18572D like its text.
  - **Ticker:** green-200 fill with green-900 text (7.6:1); the config fallback is now #D1FBD9 / #18572D.
  - **Other rows:** content-link rows → #327545; FraudWarningSheet focus → `--palette-green-700` (a border); IdentityUploadCard text →
    `--content-positive`; baked-heap text on the dark page → #72EB94 (green text on navy); payment tab filter → #327545.
  - **Rule text, mapping row, §1.2:** green text is one tier darker. The contrast note now passes (5.6:1 text, 8.6:1 heavy, 11:1 button
    label); only white on green-600 fills stays low (1.8:1).
  - **Sections:** §2j, §2l and §2o rewritten; codemod role note and §6-4 updated.
- Nothing committed.

### 2026-11-20 · green scale re-anchored (#5CD680 = 600) + navy primary-button label (owner)
- Checked tokens/v2 (rebuilt 18:48, `green-scale.py`): 656 vars (their script on a copy gives the same lines). New `--palette-green-50…950`;
  every green semantic token moved with its step (`--bg-action` / `--content-accent-strong` / `--content-link` = #5CD680, `--bg-positive` /
  `--border-selected` / `--border-focused` = #72EB94, `-heavy` = #44A05F …). `--content-on-action` = navy #000128.
- Step check rerun: 101 of 113 land on the same step; `--color-action-text-default` → navy is the intended button label. The same 11
  misses as before (§2p).
- DEV-HANDOFF:
  - Every green value remapped by step in one pass (79 hex, 7 rgb/rgba): the step table, the SVG rows (blue-600 → #5CD680,
    blue-700 → #44A05F, old green-700 → #44A05F), the CSS alpha rows, canvas / animation values, §2e, §2i and the §2p table.
  - **§2b restored as a hand fix:** 38 rules with white text on the primary button → `--content-on-action` (navy). The seven alias rules are
    listed, and the home credit card keeps white (`--content-inverse`) because it is a card, not a button. FraudWarningSheet :232 and
    WithdrawDisclosureRoute `#fff` → `--content-on-action`.
  - The rule text, intro, §1.2 and §1.5 now say the primary button label is navy (the only label that changes).
  - Contrast notes recomputed:
    - green-600 is 1.8:1 on white, 1.7:1 on the page; the navy label is 11:1
    - green-700 is 3.3:1, green-800 is 5.6:1
    - ticker pair is 2.9:1; place tab label is 11.3:1
  - §6-2: brand-token buttons that are the main action get the primary pair.
- Nothing committed.

### 2026-11-20 · final colour rule "step for step" (owner): Phase 2 rebuilt, 656 vars
- Checked tokens/v2 (rebuilt 18:38): 656 vars (their script on a copy gives the same lines). Changed values: `--bg-action` green-600,
  `--content-on-action` white, `--border-selected` green-500, `--surface-brand-subtle` green-50, `--content-brand` neutral-900, and others.
  New: `--border-accent-faint` / `-subtle`, `--content-accent-heavy`, `--surface-positive-subtle`, `--bg-positive-strong-pressed`.
- Step check (script over every legacy colour token `src/` uses): **102 of 113 land on the same step through the aliases**. 11 miss, now
  listed in new §2p and reported:
  - `--color-surface-card-brand` and `--color-surface-icon-brand-default` (blue-600 → navy)
  - 5 `--tag-color-*` (brand text / stroke, neutral text / stroke, negative text)
  - `--color-alpha-blue-*` ×3 (→ white)
  - `--color-surface-elevated-glass` (60 → 80 %)
- DEV-HANDOFF Phase 2 rebuilt around the rule, with section letters kept so cross-references still work:
  - The step table (blue N and legacy green N → v2 green N) sits at the top of Phase 2.
  - §2a now covers only code that bypasses tokens, by step: 19 SVG values in 13 files, 16 CSS rules and 10 canvas / animation values.
    - The ticker `info.svg` is now `#2B8448`, and the work-documents tick `#2EAE6E` → `#2B8448`.
    - The radio is no longer navy.
    - The captcha keeps its gradient with step stops.
    - Focus rings take their step.
    - The two blue-900 logo tiles stay navy (dark brand surfaces).
  - **Collapsed to "nothing to do":**
    - §2b white text (40 rules; white stays white)
    - §2c card gradients (they become green gradients through the aliases; no flattening)
    - §2h on-brand fills (legacy values stay)
    - §2j, §2k (tile swap replaced), §2n, and §2o (focus, slider, badges, brand icons)
  - **Kept:**
    - owner decisions 1–2 as rows (the place tab label is now `--content-primary`, since `--content-on-action` is white)
    - §2d and §2m as they were
    - §2e by step (IdentityUploadCard success status and the payment tab filter moved there)
    - §2i ticker in code with step colours #BCF2C7 / #2B8448 (3.7:1)
- Top of the document:
  - Intro, mapping table and look-parity block rewritten to the step rule.
  - The "green content" paragraph became a contrast note.
  - §1.1 count 651 → 656; §1.2 / §1.5 expectations changed to white button text and green cards.
  - Codemod review note: `--color-brand-N` → `--palette-green-N`, with role suggestions.
  - §6: decisions 1, 2, 6 and 7 settled by the rule; 3 (yellow dot) still open.
- Earlier copy kept at scratchpad/handoff_before_step.md. Nothing committed.

### 2026-11-20 · focus green-500, slider, badges, tile icons, brand icons (owner)
- Checked tokens/v2 (rebuilt 18:30): `--border-focused` #5CD680; still 651 vars (their script on a copy gives the same lines).
- DEV-HANDOFF: new §2o (29 rules) plus an effort row. §2k updated.
  1. **Focus.** OTP `:focus` borders ×2 (the alias gives navy), the Textarea focus border, 7 carets, 9 `:focus-visible` outlines on
     `--color-action-stroke-active` (navy through the alias), and Inbox, BIR, ApplicationStateCard and RejectDiversionCard outlines →
     `--border-focused`. The 5 focus rows already in 2a / 2e are now green with no extra work. The phone field, Input and 4 search fields
     have only a shadow today and no ring: under look parity they keep the shadow and only the caret turns green.
  2. **Slider.** LoanQuote thumb and fill (navy through the alias) and the default Slider thumb → `--bg-positive`.
  3. **Badges.** Account `.newBadge` and LoanHistory `.termTag[CHANGE_CARD]` → `--tag-accent-bg-strong` / `--tag-accent-content-strong`.
     No other filled count badge exists in src.
  4. **Tiles.** `cash-out.svg` stays white, so the earlier navy row is reverted. Contrast noted: white on green-500 is 1.8:1, owner's choice.
  5. **Brand icons.** The OTP method icon, contact picker icon and payment tab inline SVG get green-600 from the alias. One hand fix: the
     payment tab's image icons are tinted by a CSS `filter` (PaymentMethodDrawer :349), which no token reaches.
- Raised with the coordinator: the green ring on shadow-only fields would be a new look; white on green-500 icon contrast.
- Nothing committed.

### 2026-11-20 · owner decisions 1–3 labelled + green content = green-600
- Checked tokens/v2 (rebuilt 18:25): `--content-accent-strong`, `--content-link`, `--content-positive`, `--bg-positive-strong` = #43B265;
  `--content-link-pressed` = #2B8448. Still 651 vars (their script on a copy gives the same lines). `--tag-accent-content` is still green-800
  #206335 (not in the brief).
- DEV-HANDOFF:
  - Look parity now says "everything else is colour-only" and lists **owner decision 1** (place tab pill, BRIEF 30), **2** (segmented
    grey track / white thumb) and **3** (lean type set + body-sm/xs). The labels are on the §2l tab row, both §2b segmented rows and the §2d
    lean-set heading, with a note that they are not the §6 open decisions.
  - Every `#206335` became `#43B265`: the 11 brand-icon SVG rows, the pending.svg rows, the work-documents success tick and the colour
    tables. Every "dark green" became green-600. §2j and §2l token lines now say green-600.
  - Contrast claims fixed: the old "7.3:1 on white / 6.6:1 on Mist" is gone. New "Green content" paragraph under look parity: green-600 is
    **2.7:1 on white**, 2.5:1 on #F0F5F4, below AA for text (4.5:1) and icons (3:1); navy on green-600 is 7.5:1. The `.verifiedMark` note
    now says its white tick is 2.7:1.
  - §6 decision 4 (green text on white) marked decided by the owner: green-600.
- Raised with the coordinator: the green-600 contrast failure, and whether `--tag-accent-content` should follow green-600.
- Nothing committed.

### 2026-11-20 · brand text level → dark green + look parity (owner)
- Checked tokens/v2 (rebuilt 18:15): `legacy-aliases.css` and `rename-map.json` send `--color-text-brand-default / -light / -heavy`,
  `--color-icon-brand-*` and `--color-action-text-brand` to `--content-accent-strong` (82 uses in src). `dev-figma-tokens.css` is unchanged
  (651; their script on a copy gives the same lines).
- DEV-HANDOFF:
  - New "Look parity" subsection at the top: keep each element's level, swap only the variable, no size or layout changes. It has a level map
    (brand text / icon → `--content-accent-strong`, brand tag → tag accent, brand surfaces → navy, `--content-brand` only for navy on purpose).
  - The top mapping table gained the brand text row. §1.2's "after phase 1" line now says brand-blue text turns dark green.
  - §2a: 10 SVG rows with `#2C74BE` (brand icon level) and `sec-registration.svg` now go to `#206335`, not `#000128`. The SVG note was
    rewritten. Kept navy: the selected radio and the ticker `info.svg` (decision 6).
  - §2j: `.tipNumber` is now done by the alias (effort 1 rule + 1 SVG). `.historyEmpty h3` stays a hand fix: it uses the scale step
    `--color-brand-700`, which aliases to navy-950.
  - §2l: Liveness `.uploadIcon` / `.uploadText` are now done by the alias; the effort row says 8 rules.
  - New §2n (6 rules), where brand blue is written as a scale step and phase 1 would turn it navy: BorrowerProtectionCard ×3,
    RejectDiversionCard `.amountBlock strong` and `.matchBadge`, and the HomeComposite repayment badge (→ tag accent).
  - Codemod review note: navy-900/950 as `color` → `--content-accent-strong`, not `--content-brand`. The one already-navy use stays navy.
- Raised with the coordinator (not changed): several handoff steps change more than colours under the new parity rule. These are the
  CityCascadeSheet tab fill (BRIEF 30), the segmented tabs (decision 2 amended) and the lean type set (caption 400 → 500, 37 → 21 styles).
- Nothing committed.

### 2026-11-20 · orange scale + `--content-urgent` (BRIEF 38) + v2: 651 vars
- Dev: DEV-HANDOFF §1.1 count 639 → **651** (their script on a copy: 651, same as `v2/dev-figma-tokens.css` apart from my opacity-fixed
  lines; 12 new: `--palette-orange-50…950` and `--content-urgent` #B83F00). New §2m plus a summary row.
- Contrast checked: `--content-urgent` 5.6 : 1 on white, 5.1 on #F0F5F4 (AA small text). Orange-500 is 3.1 on white, so the handoff says
  never as text.
- Warning note: the old `--color-warning*` names stay deleted, "urgent" means time pressure, no alias, errors stay `--content-negative`.
  §2g gained one line: don't use the orange for the loading dot.
- src: **no coupon countdown exists**. Coupons only show as the "Coupon −₱…" deduction in `PaymentDetailDrawer`. The coupon "Expires in …"
  is new UI to build with the token.
- The only live countdown is the QR payment deadline (`QrCodePayment .countdown strong` :21, red). Left red; added **decision 7** (red or
  urgent orange?).
- Nothing committed.

### 2026-11-20 · `Body/sm` + `Body/xs` (BRIEF 33) + v2: 639 vars
- Dev: DEV-HANDOFF §1.1 count 623 → **639** (their script on a copy: 639, same as `v2/dev-figma-tokens.css` apart from my opacity-fixed
  lines; the 16 new lines are `--body-sm-*` and `--body-xs-*`, 8 each). Top table and §2d: 19 → **21 styles**; the paragraph rule now reads
  "long paragraphs never below body-md; one- or two-line hints may use body-sm; body-xs for legal and consent only".
- New block in §2d plus an effort row (21 rules, 0.5 h). Finding: 54 src rules take their weight from `--caption-sm/-xs-font-weight`, which
  v2 raises 400 → 500, so phase 1 turns all of them medium. 33 are labels and dates (500 intended, left alone). 21 are prose and move:
  - `body-sm` (17): 9 field error lines, QR `.refreshTip` / `.expiredNotice` ×2, `.openingTimes`, AmountEditDrawer `.rangeText`,
    IdentityUploadCard `.previewDescription`, SEC `.companyCard p`, About `.footer`.
  - `body-xs` (4): AgreementConsent `.text`, Contact `.notice`, SEC `.auditNote`, LoanDetail `.cancelHint` (cooling-off right).
  - Left to the developer: PaymentMethodDrawer `.errorMessage` (11 px error, not legal).
  - Rules with typed `12px` / `11px` and a fixed or inherited weight stay regular; listed as optional tidy-up only.
- Nothing committed.

### 2026-11-20 · `--bg-positive-strong` + upload / place tab (BRIEF 29–30) + v2: 623 vars
- Dev: DEV-HANDOFF §1.1 count 622 → **623** (their script on a copy: 623, same as `v2/dev-figma-tokens.css` apart from my opacity-fixed
  lines). New §2l with an effort row: 10 rules + 1 SVG in 4 files.
  - Work documents (`documents.module.css`): progress fill :171 / :175 → `--bg-positive-strong`; `.success` :108 → `--content-accent-strong`;
    success tick `9565-10122.svg` `#2EAE6E` → `#206335`.
  - Selfie ring (`LivenessStatusCircle`): conic ring :66 → `--bg-positive-strong`; `.uploadIcon` :111 and `.uploadText` :118 →
    `--content-accent-strong`.
  - ID upload (`IdentityUploadCard`): success status :52 → `--content-accent-strong` + `--bg-positive-subtle`. Its two tokens are
    undefined today (the fallbacks render). `.verifiedMark` :104 → `--bg-positive-strong`, so the white tick passes.
  - Address picker (`CityCascadeSheet`): `.tabActive` :298 → `--bg-positive` fill + navy label, `::after` underline :302 removed.
- Also: BRIEF 30 amends decision 2, so segmented controls keep a grey track + white thumb. Fixed the two §2b rows that still said navy
  `--bg-selected` (`Inbox` and `CreditHistoryPage` `.tabs .activeTab`): thumb `--surface-default`, label `--content-primary`, others
  `--content-tertiary`, track `--bg-neutral`.
- Requests: none.

### 2026-11-20 · `--bg-brand-muted` (BRIEF 28) + v2: 622 vars
- Dev: DEV-HANDOFF §1.1 count 621 → **622** (their script on a copy: 622, same as `v2/dev-figma-tokens.css` apart from my opacity-fixed
  lines). New §2k with an effort row: the credit history activity tiles on `CreditHistoryPage` (Borrowing tab, `index.tsx:132`), picked
  by the sign of the change (positive = repayment / cash-in, negative = loan / cash-out).
  - `.positiveIcon` (:151) → `--bg-brand-muted`, white icon stays.
  - `.loanIcon` (:154) → `--bg-positive`, and `cash-out.svg` fills (lines 2–4) white → `#000128`.
  - Through the aliases the two would come out the wrong way round (repayment green, loan navy), so they are hand fixes. A rename of
    `.positiveIcon` is optional.
- Requests: none.

### 2026-11-20 · `--content-accent-strong` (BRIEF 27) + v2: 621 vars
- Dev: DEV-HANDOFF §1.1 count 620 → **621** (their script on a copy: 621, same as `v2/dev-figma-tokens.css` apart from my opacity-fixed
  lines). New §2j with an effort row. Both uses are on the credit limit page:
  - `CreditLimitPage/index.module.css:228` `.historyEmpty h3` ("No limit history yet", brand-700 today, the alias → navy-950).
  - `:310` `.tipNumber` (the tips' 1 2 3, brand-light `#3fa0f0` today, the alias → navy-800). Both → `--content-accent-strong`.
  - The empty panel's icon `assets/pending.svg` (`HistorySection.tsx:81`): the 2a rows now say `#206335` instead of navy.
  - Body text stays tertiary grey. No other step numbers or coloured empty titles in `src/`, and no hub card. §6 item 4 notes that these uses
    are settled.
- Requests: none.

### 2026-11-20 · Decision 6 decided (scam ticker in code) + hub card → §2h
- Dev: DEV-HANDOFF §2i now says the decision: `NoticeTicker .root` uses `--surface-tint` / `--content-primary`. Stop applying the config
  colours at `index.tsx:177` and update `tests/fraud-warning.test.ts`. The icon is navy `#000128` (an `<img>`, so no currentColor). The
  remote config keeps only the copy; if it must keep colours, `#DFEEE5` / `#000128`, changed only on release day. §6 item 6 is marked
  decided by the coordinator.
- §2h: added the hub card rule (secondary button and ring track → `--bg-on-brand`). `src/` has no hub card. The nearest ring is
  `components/ui/AvailableCreditRing.tsx` on the navy credit limit card: its used arc (white at 40 %, the track) is now a §2h row →
  `--bg-on-brand`, set in `style` because the `stroke` attribute takes no `var()`. §2h is now 10 rules in 6 files.
- Requests: none.

### 2026-11-20 · `--surface-tint` (BRIEF 18) + v2: 620 vars
- Dev: DEV-HANDOFF §1.1 count 619 → **620** (their script on a copy: 620, same as `v2/dev-figma-tokens.css` apart from my opacity-fixed
  lines). New §2i "Tinted strips on the page", an effort row, and open decision 6.
  - The only strip on the page background in `src/` is the scam warning ticker, `components/ui/NoticeTicker` on the Payment tab. Its
    colours come per notice from the remote rollout config (`FRAUD_WARNING_ROLLOUT_KEY`, hex only; tests show `#C8DEFF` / `#20558D`), set
    inline at `NoticeTicker/index.tsx:177`.
  - Recommended: `var(--surface-tint)` / `var(--content-primary)` in the component, ignoring the config colours. Changing the config
    instead would also recolour master, because the config is shared (against the "pre-rebrand stays" rule).
  - Other `#f3f8ff` fills are selected states, an icon tile and a sheet header, not page strips; they stay on the alias.
- Open (coordinator / owner): decision 6, code or config for the scam strip.

### 2026-11-20 · On-brand fills (BRIEF 16) + v2: 619 vars
- Dev: DEV-HANDOFF §1.1 count 616 → **619** (checked with their script on a copy: 619, same as `v2/dev-figma-tokens.css` apart from my
  opacity-fixed lines). New §2h "Fills on the navy brand card" with `--bg-on-brand` / `--border-on-brand` and 9 rules in 5 files:
  `CreditAmountCard` (`.card`, `.withDot::before`, `.track`, `.withdraw`), `HomeComposite .primaryAction`, `ApplicationStateCard`
  (`.divider::before`, `.supportButton`), `CreditLimitPage .useCreditButton`, the Slider's default `--slider-track-background`. Effort row
  added (0.5 h).
  - **Found:** `CreditAmountCard .card` (the home credit card) is painted with the primary-button tokens, so phase 1 would make it green
    with navy text. §2h moves it to `--surface-brand` + `--content-inverse`, and §2b no longer lists it as fixed by the alias (8 → 7).
  - The alias `--color-alpha-cold-bg-default` → `--bg-tint-navy-default` would make the navy-30 % buttons invisible on navy, hence the
    hand fixes. No timer pill on a navy card exists in `src/`. `.supportButton` and `.useCreditButton` are 36 px tall (< 48 dp), noted.
- Requests: none. (Re-pointing the alias would not help: `--color-alpha-cold-bg-default` has 1 use in `src/`, and the other 8 rules use raw
  values, so the hand fixes are the route.)

### 2026-11-20 · Handoff docs moved to rebrand/handoff/
- Dev: DEV-HANDOFF links no other moved doc (PRODUCT / DESIGN / API / CHANGELOG / docs / reviews / README / CLAUDE). The only one was the
  Android-only line (the coordinator repointed it); I made its "decision 0015" a path too:
  `rebrand/handoff/docs/decisions/0015-android-only.md`. The `tokens/legacy/pre-rebrand/` paths are in their repo, not ours.
- Requests: none.

### 2026-11-20 · The pre-rebrand version stays (owner rule)
- Dev: DEV-HANDOFF has a new part under the phase table, "The current version stays until the switch". It says:
  - All four phases go on a branch `rebrand` cut from master, and it is not merged into master without the owner's go-ahead.
  - First commit on the branch: save today's `tokens/figma-tokens.json` and `src/styles/figma-tokens.css` to
    `tokens/legacy/pre-rebrand/` (their repo has no `tokens/legacy/` today), with the way back to today's look while only phase 1 is in.
  - `legacy-aliases.css` keeps old **names** working at **new** values. It prevents breakage, not the old look; the old look is master plus
    `tokens/legacy/pre-rebrand/`.
  - The Figma "Legacy · …" collections keep the old values, and the changed import script ignores them.
  - Phase 4 gets step 5: keep `tokens/legacy/pre-rebrand/`, and merge only on the owner's word.
- Requests (coordinator): note that the aliases alone don't keep the current look (see above), in case BRIEF or the owner reads it that way.

### 2026-11-19 · Graded amount letter-spacing (v2: 616 vars)
- Dev: DEV-HANDOFF §1.1 count 614 → **616** (`--letter-spacing-8` 3 %, `-9` 4 %). §2d: amount letter-spacing is now graded, xxl +4 %,
  lg +3 %, md +2 %, xs +2 % (was −2 % on every size), and the Satoshi-literal fix row no longer says −2 %. Checked with their own script on a
  copy: the current JSON gives 616 vars, `--amount-*-letter-spacing` 0.04 / 0.03 / 0.02 / 0.02em. The only difference from
  `v2/dev-figma-tokens.css` is the 14 `--layer-opacity-*` lines, because my copy carries the §1.4 opacity fix.
- Requests: none new. v2's `--layer-opacity-*` are still `20px` etc. (see the opacity entry below).

### 2026-11-19 · Android only (decision 0015): iOS advice removed
- Dev: DEV-HANDOFF §2d, the type-set rules: inputs keep their current size in phase 1, and 16 px `body-lg` is a later readability option
  (the "so iOS does not zoom" reason is gone). Added "touch targets ≥ 48 × 48 dp" and a note that the pages run in the Android app's
  WebView, so they are checked on Android Chrome / WebView. No other iOS, Safari or 44 pt advice was in the handoff (grep checked).
- Requests: none (`TYPE-AND-STYLES.md` already says the iOS reason does not apply).

### 2026-11-19 · Opacity px bug in their CSS builder + recheck (v2: 614 vars)
- Dev: DEV-HANDOFF §1.4 "Needs a fix in your pipeline". `figma_token_build.py` appends px to opacity tokens. Live today in
  `figma-tokens.css` (`--layer-opacity-subtle: 20px` …), which leaves 2 elements at full opacity: the `Select` scrollbar thumb (:138) and
  the `DownloadGuideSheet` handle (:71, its 0.2 fallback is never used). The suggested 3-line branch in `value_to_css()` was tested on
  copies of their scripts: it changes exactly the 14 `--layer-opacity-*` lines (old JSON and v2) and nothing else.
- Recheck on the current v2: 614 vars (= `dev-figma-tokens.css`), codemod still 1,762 / 117 files, the only orphan is
  `--color-warning-300`, every old name used resolves, 125 `--palette-*` left. The scrim, coupon and full-palette tokens are present.
- Requests (coordinator):
  1. v2's `--layer-opacity-*` are still `20px` etc. in `dev-figma-tokens.css`. Write them as 0–1 text like `--opacity-*`, or rely on the
     builder fix.
  2. `--gradient-scrim` and `--gradient-coupon(-panel|-tab)` exist only in the demo's `tokens.css`, not in the dev JSON (only the stops
     ship). Fine while unused in `src/`; add them to the dev JSON (like `--gradient-top-nav-filled`) if the app needs them.

### 2026-11-19 · Rechecked against v2 of 18:48 (lean type set, full palettes)
- Dev: codemod on a fresh copy of `src/`: **1,762 replacements in 117 files** (dry run = write; +263 text-style renames). The only orphan is
  `--color-warning-300` (expected; hand fix 2g). Every name it writes exists in the generated CSS, and no old token name is left except
  that one. Their script gives 603 vars from the current JSON, identical to `v2/dev-figma-tokens.css`.
  - All 324 old token names used in `src/` resolve (generated CSS ∪ 452 aliases), except `--color-warning-300`. 92 of them are text-style
    composites (1,056 uses): 53 keep their name, 39 (263 uses) are aliased and renamed. None of the 21 `classes` renames are used in `src/`.
  - The fallback refresh still updates 279. 125 `--palette-*` uses are still left by the codemod.
  - DEV-HANDOFF: counts updated, §2d rewritten as "Typography: one typeface, lean set" (TYPE-AND-STYLES.md, the rename table, visible
    changes).
- Requests (coordinator), still open: the codemod writes no `/* token-migrate: */` comments for primitives; the 5
  `--color-gradient-ambient-*` aliases point at demo-only tokens; duplicate code syntax `--font-size-11` (Primitive + leftover Semantic
  `fontSize/11`, both 11px).

### 2026-11-19 · Rechecked against v2 of 18:37 (codemod fix, ARCHITECTURE §12)
- Dev: reran the fixed `migrate-tokens.mjs` from its own folder (path with a space) on a fresh copy of `src/`. Same result: 1,499
  replacements in 117 files, orphan `--color-warning-300` only, 125 `--palette-*` uses left, no written name missing from the v2 CSS.
  The current `figma-tokens.json` gives **678 vars** with their script (§12 tokens included). The phase 1 alias check and the import mock
  (`Light.json`) still pass. DEV-HANDOFF numbers updated.
- Requests (coordinator): `v2/dev-figma-tokens.css` is **still the 18:28 file** (657 vars). It has none of the §12 tokens and still has
  `--radius-tooltip: 8px` and `--size-control-lg: 52px`. It was not regenerated: rebuild it from the current JSON (678 vars). Codemod
  requests 2–3 and alias note 5 from the entry below still stand.

### 2026-11-19 · DEV-HANDOFF rewritten for tokens v2 (4 phases) + codemod run
- Figma: — (none)
- Demo: — (none)
- Tokens: none changed (v2 belongs to the coordinator).
- Dev: rewrote `rebrand/DEV-HANDOFF.md` as the 4-phase plan of ARCHITECTURE §10: drop-in ~0.5 d · hand fixes ~1.5 d + QA · codemod ~0.5 d ·
  clean-up minutes. All checks ran on copies in the session scratchpad; `phi_h5_025/` was not touched.
  - Codemod on a copy of `src/`: **1,499 replacements in 117 files** (dry run = write). Every name it writes exists in the v2 CSS; the only
    orphan is `--color-warning-300`. It leaves 125 `--palette-*` uses in screen code (removed scale steps such as brand-600 ×29, plus
    renamed primitives) and keeps the old literal fallbacks (a fallback refresh fixes 279). Type-check / build was not run: there is no
    `node_modules`, and we did not install anything.
  - Phase 1 check: all 324 old names used in `src/` resolve through the v2 CSS or `legacy-aliases.css`, except `--color-warning-300`.
  - Import script for v2: `MODE_FILE = "Light.json"`, key `f"{collection}/Light"`, `COLLECTIONS` unchanged. Checked on a mock export
    including `Legacy · …` folders: JSON content is identical, CSS byte-identical.
  - Fonts: 8 Satoshi amount literals → `--font-family-amount`; Inter literals (`global.css:64`, BorrowerProtectionCard, FeedbackInvitation)
    → `--font-family-body`; `document.fonts.load` calls in CreditIncreaseIntro; undefined `--font-family-nunito-sans` ×2.
- Requests (coordinator):
  1. Codemod bug: `new URL(import.meta.url).pathname` keeps `%20`, so it fails in any path with a space (this repo's). Use
     `fileURLToPath(import.meta.url)`.
  2. Codemod gap: ARCHITECTURE promises `/* token-migrate: */` comments on ambiguous cases, but the script writes none. Removed scale tokens
     with an alias target (`color-brand-600` → `palette-navy-900` …) are silently rewritten to primitives. Map by CSS property, or comment.
  3. Codemod nit: the orphan check uses `s.includes('--'+name)`, a prefix match that counts files, not uses.
  4. `v2/dev-figma-tokens.css` (18:28) is older than `v2/figma-tokens.json` (18:29). Rebuilt from the current JSON it gives 664 vars, and the
     7 Tag `*-bg-subtle / -inverse / -alpha` tokens are back. `--tag-neutral-bg-alpha` (28 uses) depends on them.
  5. Aliases `color-alpha-blue-20/40/50` → `palette-alpha-white-*`: their only user is the captcha slider, where white is wrong (track
     glow, progress, shadow). The handoff hand-fixes them (2a).
  6. `font-family-number` is "kept" in rename-map.json but missing from the dev CSS (0 uses, harmless). The 5 `--color-gradient-ambient-*`
     aliases point at demo-only tokens.
- Open (coordinator decides): checkbox → `--bg-selected`? The three brand-token buttons: navy or green? Yellow loading dot: green or neutral?

### 2026-11-19 · Inventory of phi_h5_025/src + Figma code-syntax check (token system to be rebuilt)
- Figma: — (none)
- Demo: — (none)
- Tokens: none changed. Added a "superseded" banner to `rebrand/tokens/MAPPING.md`, because the owner is rebuilding the token system.
- Dev: new `rebrand/log/dev-usage.json`: every CSS custom property `src/` uses. 436 names, 5,366 `var()` uses: 324 from figma-tokens.css
  (366 of its 690 tokens are never used), 44 declared locally, 20 set at runtime, **48 defined nowhere** (233 uses; the fallback renders).
  New `rebrand/log/dev-colours.json`: every hard-coded colour with file:line and kind. 2,047 in 219 files: 1,108 fallbacks of live tokens,
  43 fallbacks of undefined names, 320 raw, 576 in SVGs. DEV-HANDOFF has a status banner, §6 (inventory) and §7 (needs a decision).
  - Correction: the coin animations (`WithdrawMainRoute/motion/successCoin.ts`, `loadingCoin.ts`) use `#2b74bd` ×49 and `#78aae2` ×8. The
    first scan missed them because they differ from `#2c74be` by one step. They should be regenerated from a rebranded Lottie.
  - Code syntax: the developers' JSON and CSS are correct today (no collisions). A fresh Figma export with the 3 wrong syntaxes would drop
    `--color-action-text-link` (3 uses) and `--tag-color-neutral-bg-alpha` (28 uses, 4 direct), and `--color-action-text-positive`
    (1 use) would take the link colour. Simulated with copies of their build scripts.
- Open (owner): let the coordinator fix the 3 code syntaxes in Figma (recommended). Do the coin animations get a rebranded Lottie?
  Does the teal in the empty-state SVGs stay?

### 2026-11-19 · Developer handoff for phi_h5_025 (MAPPING.md + DEV-HANDOFF.md)
- Figma: — (none; read `rebrand/figma/ledger.json` for the Legacy / Rebrand mode ids)
- Demo: — (none)
- Tokens: no values changed. Wrote `rebrand/tokens/MAPPING.md` from `mapping.json`: 298 rows = 147 same, 86 changed, 11 new, 49 removed,
  5 demo-only; 8 pending (green text on white).
- Dev: wrote `rebrand/DEV-HANDOFF.md`. `phi_h5_025/` was not touched; all checks ran on copies in the session scratchpad.
  - Ran copies of `scripts/figma_tokens_to_css.py` + `figma_token_build.py`. Today's JSON reproduces today's `src/styles/figma-tokens.css`
    byte for byte. The new JSON gives 690 → 652 variables (49 removed, 11 added, 86 colour values changed, nothing else), with 0
    mismatches against `mapping.json`.
  - `scripts/import_figma_tokens.py`: `MODE_FILE = "Mode 1.json"` → `"Rebrand.json"`. Checked against a mock export: merged JSON is
    byte-identical to the drop-in. Unpatched, it stops with FileNotFoundError.
  - In `src/`: 5 uses of removed names (4 alpha-blue / blue-900, 1 warning-300; no pink, yellow or marketing). 249 blue values in 88 files:
    208 harmless fallbacks of live tokens and **41 must change** (4 removed-token, 9 undefined-token, 11 raw in CSS/TS/JS/HTML, 17 raw in
    12 SVGs). 40 rules put white text on the now-green primary button (8 more already use `--color-action-text-default` and fix
    themselves). 6 gradient cards should become flat navy. About 9 other blue-ish values fall outside the list.
  - Included a fallback-refresh script, tested on a copy: 260 fallbacks in 79 files.
  - Estimate: about 5–7 h of edits (1 dev-day) plus 0.5–1 day of visual QA.
- Open (owner):
  1. Selected checkbox (AgreementConsent): navy fill like radios? Decision 2 does not mention checkboxes. White tick on green fails (1.8:1).
  2. Three buttons built on brand tokens (`HomeComposite .repaymentFooter button`, `RejectDiversionCard .applyButton`,
     `BankCard .confirmSubmitButton`) will turn navy. Should they be the green primary button instead (decision 7)?
  3. PageLoading third dot was yellow (`--color-warning-300`): light green (`positive-300`) or neutral?
  4. Green text on white is still pending. If it changes, the developers only need a new JSON plus `npm run figma:tokens`.

## Requests
- **figma-lib / coordinator:** are the Blue / Pink / Yellow / Marketing / Warning variables still in the Figma file? If so, a "Rebrand"
  export brings the 49 removed names back into the developers' CSS. DEV-HANDOFF §2 tells developers to check with
  `grep -c -- '--color-blue-' src/styles/figma-tokens.css`, and to use the drop-in JSON as the reference until this is confirmed.
- **figma-lib:** 12 SVG icons and illustrations in phi_h5_025 have blue baked in (list in DEV-HANDOFF §3b; plus the illustrations in §3e).
  Re-exports from "Component - Rebranding" would save the developers the manual edits.
