# Unresolved: production tokens without a confident mapping

Target: PeraSure `tokens/tokens.css` v2026.11.23. Sections 1–5 are rows of `token-map.json` (judgement calls are `confidence: "inferred"`, with an `alternative` where one exists); section 6 lists names production code references but never defines; section 7 is about the rebrand file itself. Decide, then edit the row (or ask the design side for a token).

## 1. Neutral greys became navy (v3) — conflicts with "text keeps its neutral"

The owner rule of 2026-11-20 says neutrals stay and text keeps its neutral. Decision 42 (2026-11-21, applied in Figma and in tokens v2026.11.21+) deleted the neutral scale: **navy replaces every grey** (`--color-text-primary` `#141e24` → `--fg-default` `#000128`; `#3c4850` → `#3d3e5c`; `#6a757d` → `#61627a`; dividers `#e0e3e5` → `#d6d6dd`).
34 production tokens are affected (`note` says "Neutral grey -> navy"); they are mapped to the navy tokens because v2026.11.23 has no grey left. If the 11-20 rule must win, the design side has to bring the neutral values back; no token in the current file keeps them. The step mapping used is `rebrand/tokens/v3-map.json` `neutral_to` (300 and 400 both → navy-400, 500 and 600 both → navy-500).

## 2. v3 value departs from the owner rule: mapped to v3, alternative keeps the legacy step

| production | uses | mapped to (v3 migration) | alternative (legacy look) | why |
|---|---:|---|---|---|
| `--color-action-text-default` #ffffff | 8 | `--fg-on-accent` #000128 | `--fg-on-emphasis` #ffffff | White label on the primary (green) button becomes navy (owner rule exception). Where this token sits on a non-green fill (danger, navy, dark surfaces) use --fg-on-emphasis (white) instead. |
| `--color-overlay-scrim-default` #00000033 | 2 | `--overlay-scrim` rgb(0 1 40 / 0.4) | `--palette-alpha-navy-20` rgb(0 1 40 / 0.2) | Production scrim is black 20%; v3 --overlay-scrim is navy 40% (twice as dark). Navy 20% keeps the strength. |
| `--color-surface-card-brand` #2c74be | 4 | `--bg-brand` #000128 | `--bg-accent-emphasis` #5cd680 | Legacy blue-600 surface. v3 maps it to navy --bg-brand; the step rule gives green (#5cd680). DEV-HANDOFF 2p left it open. If green, white text on it must become --fg-on-accent. |
| `--color-surface-elevated-glass` #ffffff99 | 24 | `--bg-glass` rgb(255 255 255 / 0.8) | `--bg-glass-subtle` rgb(255 255 255 / 0.6) | Production glass is white 60%; v3 --bg-glass is white 80%. --bg-glass-subtle keeps 60%. |
| `--color-surface-icon-brand-default` #2c74be | 4 | `--bg-brand` #000128 | `--bg-accent-emphasis` #5cd680 | Legacy blue-600 icon disc. v3 maps it to navy --bg-brand; the step rule gives green. Selected checks use --control-checked-bg / --check-on-* instead (DEV-HANDOFF 2o). |
| `--gradient-bottom-nav-filled` linear-gradient(180deg, #e1e4e500 0%, #e1e4e533 20.19%, #e1e4e566 100%) | 6 | `--gradient-nav-bottom` linear-gradient(180deg, rgb(255 255 255 / 0) 0%, rgb(255 255 255 / 0.6) 40%, rgb(255 255 255 / 0.8) 100%) | `--gradient-nav-bottom-mist` linear-gradient(180deg, rgb(240 245 244 / 0) 0%, rgb(240 245 244 / 0.6) 40%, rgb(240 245 244 / 0.8) 100%) | Grey 0/20/40% at 0/20/100% -> white 0/60/80% at 0/40/100% (v3 Nav-bottom). On mist pages use --gradient-nav-bottom-mist. |
| `--tag-color-brand-stroke-default` #c8deff | 1 | `--tag-accent-border` #76dc93 | `--border-accent-muted` #baeec9 | Legacy blue-200; step rule gives green-200 (#baeec9); v3 tag-accent-border is green-400. |
| `--tag-color-brand-text-default` #3fa0f0 | 2 | `--tag-accent-fg` #1d6334 | `--fg-accent` #298648 | Legacy blue-500 text; v3 tag-accent-fg is green-800 (green text on a green tint uses 800, v3-map.json). fg-accent is green-700. |
| `--tag-color-negative-stroke-default` #ffbfc3 | 0 | `--tag-danger-border` #ff0d19 | `--border-danger-muted` #ffbfc3 | Legacy red-200; v3 tag-danger-border is red-500. border-danger-muted keeps red-200. |
| `--tag-color-negative-text-default` #ff0d19 | 3 | `--tag-danger-fg` #b8000d | `--fg-danger-muted` #ff0d19 | Legacy red-500; v3 tag-danger-fg is red-700 (contrast). fg-danger-muted keeps red-500. |
| `--tag-color-neutral-stroke-default` #cdd1d4 | 2 | `--tag-neutral-border` #8a8a9c | `--border-muted` #d6d6dd | Legacy neutral-150; v3 tag-neutral-border is navy-400 (much darker). border-muted keeps the step (navy-200). |
| `--tag-color-neutral-text-default` #6a757d | 11 | `--tag-neutral-fg` #3d3e5c | `--fg-subtle` #61627a | Legacy neutral-500; v3 tag-neutral-fg is navy-600 (tag text >= 4.5:1, ARCHITECTURE.md). fg-subtle keeps the step (navy-500). |
| `--tag-color-positive-stroke-default` #bdf1dd | 0 | `--tag-success-border` #76dc93 | `--border-success-muted` #baeec9 | Legacy green-200; v3 tag-success-border is green-400. border-success-muted keeps green-200. |
| `--tag-color-positive-text-default` #58e09a | 0 | `--tag-success-fg` #1d6334 | `--fg-success` #298648 | Legacy green-500 text (low contrast); v3 tag-success-fg is green-800. fg-success is green-700. |

Where these are used today:

- `--color-action-text-default` (white label, 8 uses): `GlobalErrorHandler` :88, `AccountDeletionVerify` :179, `FeedbackInvitationSheet` :134, `CancelLoanConfirmDialog` :111, `CreditAmountCard` :10, `CreditIncreaseIntro` :34, `OtpVerify` :249, `DiversionExceptionState` :30. Navy (`--fg-on-accent`) only where the fill is the green primary button; on any other fill keep white (`--fg-on-emphasis`).
- `--color-surface-card-brand` (4): `ApplicationStateCard` :7, `CreditValidityTooltip` :153, `Account` :328 (`.newBadge`), `BankCard` :482. `--color-surface-icon-brand-default` (4): `QrCodePayment` :37, `RepaymentCard` :98 (a selected check → `--control-checked-bg`/`--check-on-*`), `Account` :130, `CreditHistoryPage` :155. Navy = "dark brand surface"; green = "blue becomes green". Owner call (DEV-HANDOFF 2p left it open).
- `--color-surface-elevated-glass` (24 uses): white 60 % today, v3 `--bg-glass` is 80 %.
- `--color-overlay-scrim-default` (2) and `--gradient-modal-backdrop` (20, from `global.css`): the v3 scrim is navy and much darker (black 20 % → navy 40 %, or the 0/32/56 % gradient).
- Tag text and borders (`--tag-color-*-text-default`, `-stroke-default`): v3 tags use darker text (≥ 4.5 : 1) and stronger borders by design (ARCHITECTURE.md); the alternatives keep the legacy step.

## 3. Colour primitives: mapped by step, not by the 11.21 CSV

`tokens/migration-2026.11.21.csv` maps `--color-blue-N` / `--color-brand-N` / `--color-green-N` / `--color-positive-N` to `--palette-green-N` (same number). In production these are the *legacy* blue and green, and v3 re-numbered the green scale: v2 green-600 `#5CD680` (the step of legacy blue-600, the primary button) is v3 **green-500**. The map follows the owner rule plus `v3-map.json` `green_direct_binding_to` (300→200, 400→300, 500→400, 600→500; others unchanged), which agrees with the semantic rows (`--color-action-bg-primary-default` → `--bg-accent-emphasis` = green-500). The CSV target is given as `alternative`. 39 production uses (mostly `--color-brand-600` ×29). Confirm with design.

## 4. Removed with no successor

The four removed names still used in `src/` are fixed by edits in `02-changes/changes-by-file.json` (not by step 0); `token-map.json` `replacement` says the same.

| production | uses | applied by changes-by-file edit → value |
|---|---:|---|
| `--color-warning-300` | 1 | `var(--fg-accent)` (E058 PageLoading:74 owner) |
| `--color-alpha-blue-20` | 1 | `inset 0 0 8px color-mix(in srgb, var(--bg-success) 20%, transparent)` (E192 RiskVerifyCaptcha:151) |
| `--color-alpha-blue-40` | 1 | `var(--elevation-knob)` (E189 RiskVerifyCaptcha:193 owner) |
| `--color-alpha-blue-50` | 1 | `color-mix(in srgb, var(--bg-success) 50%, transparent)` (E191 RiskVerifyCaptcha:179) |
| `--color-alpha-black-*`, `--color-pink-*`, `--color-marketing-*`, `--color-yellow-*`, other `--color-warning-*`, `--color-alpha-blue-0/60/80` | 0 | Unused: nothing to do. |

`--color-warning-300` (third loading dot) uses `--fg-accent` so the three dots are one colour (G-032, needsOwner: the owner may prefer a light green such as `--bg-accent-muted-pressed`). The blue alpha glow / fill of the captcha slider become green-400 (`--bg-success`) at the same alpha; its thumb shadow becomes the knob elevation.

## 5. Typography judgement calls

- **Caption/sm, Caption/xs (400) → `.ps-text-body-sm` / `.ps-text-body-xs`**, not `.ps-text-caption-*` as the 11.21 CSV says: production captions are 400 and v3 Caption is 500; Body/sm·xs restore the legacy weight (TYPE-GAPS.md). Their variables have 203 (caption-sm) and 59 (caption-xs) uses in `src/`, so this choice decides the weight of a lot of small text.
- **Section-title/xs (600) → `.ps-text-label-xs`** (twin, keeps 600), not Caption/xs (500) as in the CSV.
- **Display/sm 700**: v3 Display/sm is 800 and has no 700 twin → class + `font-weight: var(--font-weight-bold)`. Display/md 700 → `.ps-text-display-md-bold`; Headline/sm 700 → `.ps-text-headline-sm-bold`.
- **Display/lg, Display/xl** (40/48, 48/56) merge into Display/md 36/44 (0 uses in the app per TYPE-AND-STYLES.md).
- **Section-title/md-light** → Body/lg-strong: line height 22 → 24 (approved).
- **Tracking changes** with one typeface: body/label/caption 0.02em → 0; titles −0.01em → −0.005em; Display/md −0.003em → −0.02em; Headline/sm 0 → −0.01em. `--letter-spacing-0…6` have no v3 variable.
- `--font-size-11` is defined twice in production's JSON (primitive 11 px and index-scale 11 = 48 px); the CSS kept 11 px, so the index-scale 48 px never shipped. Mapped as 11 px.

## 6. Referenced in production `src/` but never defined (they render their fallback today)

Not production tokens, so not rows in `token-map.json`. **41 names** (an earlier README said 39; 41 is the count of this table and of `06-production-audit/SUMMARY.md`). They are **not** part of step 0: every use is an edit in `02-changes/changes-by-file.json` (made with the file in front of it), and the value used is the one in the last column, by edit id. Precedence: changes-by-file > token-map > this file. Component-local variables set at runtime (`--header-action-*`, `--full-screen-layer-height`, `--keyboard-scroll-reserve`, `--app-viewport-height`, `--bottom-sheet-drag-offset`, `--history-title-duration`) are left out.

| name | uses | fallback(s) in code today | applied by changes-by-file edit → value (`owner` = needsOwner) |
|---|---:|---|---|
| `--border-radius-md` | 2 | `8px`×2 | `var(--radius-xs)` (E166 IdentityUploadCard:175, E168 IdentityUploadCard:66) |
| `--color-action-text-primary-default` | 7 | `#2c74be`×3, `#fff`×2, `var(--tag-color-neutral-bg-alpha`×1, `#ffffff`×1 | `var(--button-text-fg)` (E319 AccountDeletionVerify:189); `var(--fg-link)` (E323 AccountDeletionVerify:122); `var(--fg-accent)` (E325 Inbox:220); `var(--button-primary-fg)` (E371 Order:280, E376 Order:228, E442 WithdrawFlowLayout:65, E450 WithdrawMainRoute:296) |
| `--color-border-brand-default` | 1 | `#2c74be`×1 | `2px solid var(--border-selected)` (E466 Repay:27) |
| `--color-border-default` | 2 | `#d9e1e6`×1, `#d8e1e8`×1 | `1px solid var(--border-muted)` (E311 RepayDetailShell.module.css:269); `var(--border-muted)` (E461 Loan:72) |
| `--color-border-focus` | 2 | `#2c74be`×2 | `2px solid var(--border-selected)` (E274 PaymentErrorModal:56, E278 PaymentListRecoveryState:81) |
| `--color-brand-primary` | 2 | `#1f73b7`×1, `#0a1219`×1 | `var(--button-primary-bg)` (E276 PaymentErrorModal:44 owner); `2px solid var(--border-selected)` (E470 NormalPayment:80) |
| `--color-feedback-danger-default` | 1 | `#dc2626`×1 | `var(--border-danger-emphasis)` (E071 Textarea:41) |
| `--color-icon-warning` | 1 | `#b35c00`×1 | `var(--fg-attention)` (E281 PaymentListRecoveryState:23 owner) |
| `--color-primary` | 2 | `#2c74be`×1, `#6222cc`×1 | `var(--button-primary-bg)` (E270 FraudWarningSheet:231, E438 WithdrawDisclosureRoute:55) |
| `--color-semantic-warning` | 1 | `#f59e0b`×1 | `var(--fg-attention)` (E277 PaymentErrorModal:18 owner) |
| `--color-status-error-default` | 1 | `#e5484d`×1 | `var(--bg-danger-emphasis)` (E326 Inbox:126) |
| `--color-surface` | 3 | `#fff`×3 | `var(--bg-default)` (E435 WithdrawBankRoute:19, E436 WithdrawBankRoute:7, E439 WithdrawDisclosureRoute:19) |
| `--color-surface-brand-subtle` | 1 | `#edf6ff`×1 | `var(--bg-accent-subtle)` (E310 RepayDetailShell.module.css:278) |
| `--color-surface-container-low` | 1 | `rgba(44, 116, 190, 0.08)`×1 | `color-mix(in srgb, var(--bg-accent-emphasis) 8%, transparent)` (E069 EmailField:136) |
| `--color-surface-positive-subtle` | 1 | `#ecfff5`×1 | `var(--bg-success-subtle)` (E170 IdentityUploadCard:53) |
| `--color-surface-warning-subtle` | 1 | `#fff4db`×1 | `var(--bg-attention-subtle)` (E282 PaymentListRecoveryState:22 owner) |
| `--color-text-error` | 1 | `var(--tag-color-negative-text-default)`×1 | `var(--fg-danger)` (E146 documents.module.css:120) |
| `--color-text-positive` | 1 | `#0c7a49`×1 | `var(--fg-success-strong)` (E169 IdentityUploadCard:54) |
| `--color-text-subtle` | 1 | `#7d878e`×1 | `var(--fg-placeholder)` (E482 BirRegistrationPage:74) |
| `--font-family-nunito-sans` | 2 | `'Nunito Sans'`×1, `var(--font-family-body, Inter)`×1 | `var(--font-family-body)` (E180 LivenessStatusCircle:166, E475 QrCodePayment:113) |
| `--font-line-height-caption-md` | 2 | `16px`×2 | `var(--font-line-height-caption-sm)` (E224 ApplicationStateCard:106, E343 LoanDetail:112) |
| `--font-size-caption` | 1 | `14px`×1 | `var(--font-size-body-md)` (E179 LivenessStatusCircle:167) |
| `--font-size-caption-md` | 2 | `12px`×2 | `var(--font-size-caption-sm)` (E225 ApplicationStateCard:104, E344 LoanDetail:110) |
| `--font-size-footnote` | 1 | `12px`×1 | `var(--font-size-caption-sm)` (E080 Slider:100) |
| `--font-size-semibold` | 1 | `700`×1 | `var(--font-weight-bold)` (E079 Slider:101) |
| `--font-weight-semibold` | 40 | `600`×40 | `var(--font-weight-semi-bold)` (E018 CreditFlowHeader:52, E107 LoanQuote:217, E111 LoanQuote:123, E120 QuoteForm:580, E135 QuoteForm:58, E148 AccountDeletionUnavailableDialog:95, E155 DeleteAccountConfirmDialog:101, E181 LivenessStatusCircle:124, E222 ApplicationStateCard:171, E230 HomePromotionSection:130, E232 HomePromotionSection:87, E234 HomePromotionSection:53, E236 HomePromotionSection:16, E237 HomeTrustSection:37, E240 RejectDiversionCard:145, E248 RejectDiversionCard:86, E250 RejectDiversionCard:73, E255 RejectDiversionCard:16, E279 PaymentListRecoveryState:71, E314 HomeTrustSection:37, E338 Liveness:118, E339 LoanDetail:436, E341 LoanDetail:403, E345 LoanDetail:103, E350 LoanHistory:216, E351 LoanHistory:85, E353 LoanHistory:60, E396 Account:332, E402 HomeComposite.module.css:350, E409 HomeComposite.module.css:264, E413 HomeComposite.module.css:251, E414 HomeComposite.module.css:230, E418 HomeComposite.module.css:172, E441 WithdrawFlowLayout:68, E444 WithdrawMainRoute:440, E449 WithdrawMainRoute:299, E457 WithdrawMainRoute:74, E460 Loan:100, E463 Loan:61, E464 Repay:97) |
| `--label-lg-font-family` | 2 | `var(--font-family-label, Inter)`×2 | `var(--font-family-label)` (E370 Order:282, E375 Order:233) |
| `--label-lg-font-size` | 2 | `var(--font-size-16)`×1, `16px`×1 | `var(--font-size-16)` (E369 Order:283, E374 Order:234) |
| `--label-lg-font-weight` | 2 | `600`×2 | `var(--font-weight-semi-bold)` (E368 Order:284, E373 Order:235) |
| `--label-lg-line-height` | 2 | `24px`×2 | `24px` (E367 Order:285, E372 Order:236) |
| `--layer-opacity-disabled` | 4 | `0.4`×4 | `var(--opacity-disabled)` (E312 RepayDetailShell.module.css:95, E469 NormalPayment:86, E471 QrCodePayment:131); `1;
  background: var(--button-primary-bg-disabled);
  color: var(--button-primary-fg-disabled)` (E467 GcashPayment:25) |
| `--line-height-body-lg` | 6 | `22px`×5, `24px`×1 | `var(--font-line-height-section-title-md)` (E119 QuoteForm:581, E233 HomePromotionSection:54, E235 HomePromotionSection:17, E254 RejectDiversionCard:17, E417 HomeComposite.module.css:173); `var(--font-line-height-body-lg)` (E440 WithdrawFlowLayout:69) |
| `--line-height-body-md` | 21 | `20px`×21 | `var(--font-line-height-body-md)` (E106 LoanQuote:231, E108 LoanQuote:197, E110 LoanQuote:124, E112 LoanQuote:89, E117 LoanQuote:20, E121 QuoteForm:545, E124 QuoteForm:464, E129 QuoteForm:360, E229 HomePromotionSection:131, E231 HomePromotionSection:88, E239 RejectDiversionCard:146, E243 RejectDiversionCard:127, E247 RejectDiversionCard:87, E401 HomeComposite.module.css:351, E405 HomeComposite.module.css:313, E412 HomeComposite.module.css:252, E416 HomeComposite.module.css:209, E443 WithdrawFlowLayout:55, E446 WithdrawMainRoute:361, E447 WithdrawMainRoute:352, E456 WithdrawMainRoute:75) |
| `--line-height-caption-sm` | 7 | `16px`×7 | `var(--font-line-height-caption-sm)` (E109 LoanQuote:167, E227 HomePromotionSection:150, E228 HomePromotionSection:139, E406 HomeComposite.module.css:301, E407 HomeComposite.module.css:285, E422 HomeComposite.module.css:132, E448 WithdrawMainRoute:318) |
| `--line-height-caption-xs` | 3 | `14px`×3 | `var(--font-line-height-caption-xs)` (E249 RejectDiversionCard:74, E408 HomeComposite.module.css:265, E415 HomeComposite.module.css:217) |
| `--line-height-display-sm` | 1 | `40px`×1 | `var(--font-line-height-display-sm)` (E115 LoanQuote:42) |
| `--line-height-title-md` | 2 | `28px`×2 | `var(--font-line-height-title-md)` (E126 QuoteForm:404, E293 SubmissionStatus.module.css:41) |
| `--line-height-title-sm` | 1 | `24px`×1 | `var(--font-line-height-title-sm)` (E423 HomeComposite.module.css:126) |
| `--radius-2xs` | 1 | `4px`×1 | `4px` (E288 PaymentMethodDrawer:248) |
| `--shadow-subtle` | 2 | `<none>`×2 | `(declaration deleted)` (E125 QuoteForm:442 owner, E226 ApplicationStateCard:8 owner) |
| `--text-link-2-font-size` | 1 | `14px`×1 | `var(--font-size-label-md)` (E474 QrCodePayment:115) |

138 uses, 138 edits. After step 0 and these edits no undefined name is left in `src/` except the component-local ones (checked by applying the package to a clean copy of `0d9bdd4`).

## 7. Issues in the rebrand token file itself (v2026.11.23)

- `--duration-80/150/240/360` are emitted as **px** (`80px`), so `--motion-duration-*` is not a valid `<time>`; `--easing-*` are emitted as **quoted strings** (`"cubic-bezier(…)"`), not usable in `transition-timing-function`. Use literals (80/150/240/360 ms) until the build is fixed. Production has no motion tokens, so nothing maps onto them.
- `--blur-0`, `--spacing-0`, `--radius-0` are unitless `0` (fine for lengths; `calc()` users should know).
- px vs rem: production is px and its PostCSS step (`scripts/postcss_px_to_rem.cjs`) converts px to rem at build time, so production uses **`01-tokens/rebrand-tokens.css` (px) only**. `01-tokens/rebrand-tokens-rem.css` is the PeraSure prototypes' rem override; do not load it in production.
