# Conflicts: values chosen in the change list, with the owner's decisions of 2026-11-24

Items the design owner answered on 2026-11-24 are marked **Decided 2026-11-24** (letter = the answer in `OPEN-QUESTIONS.md`); every other item is still marked **needs owner confirmation**. The change list (`changes-by-file.json`/`.md`) already uses the value in **Used**. **Alternative** is what to switch to if the owner disagrees. Baseline: production `phi_h5_025` master `0d9bdd4`.

## A. The six Figma-vs-demo conflicts found by the visual pass

### 1. "Best" pill colour (C-015). **Decided 2026-11-24 (A): orange, as in the demo**
- **Conflict:** Figma (figma-lib 43) makes the CouponPickCard "Best" pill green again and keeps orange only on CouponTicket. The demo uses orange on both.
- **Used:** nothing. Production has no coupon UI, so no file is edited (see `coverage.json` a).
- **When coupons are built:** orange `--bg-attention-muted` #ffe6d5 with `--fg-attention` #ff5e00, as in the demo (owner's answer).

### 2. Brand-card gradient (G-002, C-064, C-095). **Decided 2026-11-24 (B): Gradient/Brand-card on the credit and state cards**
- **Owner's answer:** use Figma's Gradient/Brand-card (`--gradient-brand-card`, navy 50 % → #3d3e5c) on the home credit card and on the application / status cards that Figma's StateCard covers. Diversion / partner cards stay flat navy.
- **Used (all `background`, the property production already sets):**
  - `var(--gradient-brand-card)` on the home credit card (`CreditAmountCard/index.module.scss:11`, E219), the application state card (`ApplicationStateCard/index.module.css:7`, E544), the Home state card `.primaryCard` (expired / error, `HomeComposite.module.css:85`, E425) and its expired variant (`:139`, E421). The old ellipse highlight `.primaryCard::after` goes (E424). Test E534 now expects the gradient on the expired card.
  - `--gradient-brand-card` on the credit-limit hub card (`CreditLimitPage/index.module.css`, C-095), unchanged.
  - Flat `--bg-brand` #000128 stays on the diversion cards (DiversionApplicationCard, LoanPlanCard, NewCustomerCard, DiversionHomeShell tile, QuoteForm amount panel).

### 3. ContactMethod selected state (C-045). **Decided 2026-11-24 (A): demo**
- **Conflict:** Figma puts the selected stroke, icon and label all on green-600 (Content/Selected). The code uses a green-700 label with a green-400 ring.
- **Used (owner's answer: keep):** `src/pages/AuthPage/OtpVerify/index.module.css` lines 181 and 224 (E361, E360) follow the demo. Labels are `--fg-subtle` #61627a when off and `--fg-accent` #298648 when on. Rings are `--border-muted` #d6d6dd when off and `--border-selected` #76dc93 when on.

### 4. Number tracking on amounts (G-005). **Decided 2026-11-24 (D): Figma Amount tracking**
- **Owner's answer:** use Figma's newer Amount tracking wherever an amount uses the number font, weight 700, in em.
- **Values (by font size):** xxl 48 px `0.04em`, xl 36 px `0.04em`, lg 32 px `0.03em`, md 24 px `0.02em`, sm 18 px `0.03em`, xs 16 px `0.02em`. xxl / lg / md / xs are Figma's Amount styles (log 2026-11-20 entry 13; `.ps-text-amount-*` in `rebrand-tokens.css`); Figma has no Amount/sm or Amount/xl, so sm and xl keep the Number values (+3 %, +4 %). Sizes between steps take the nearer step (28 px → lg).
- **Used (E545–E555, every selector moved from Satoshi to `--font-family-number`):** LoanQuote `.confirmAmount` 0.03em; QuoteForm `.amountValue` 0.03em (currency / integer / fraction inherit it), `.keypadFixedDigits` 0.04em, withdraw-flow `.amountInteger` 0.04em and `.amountFraction` 0.03em; CreditAmountCard `.amount` 0.04em and `.fraction` 0.02em; RejectDiversionCard `.amountValue` 0.03em (added); LoanDetail `.amountValue` 0.03em; ConfirmPage Order `.amount` 0.03em; HomeComposite `.repaymentAmount` 0.02em (added).
- **Not changed:** the hero amounts (NewCustomer, NewCustomerCard) keep Display/md −0.02 em (C-078); the CreditIncreaseIntro iframe material uses its own `--ps-font-num` and keeps its tracking.

### 5. Slider knob (C-050, G-035). **Decided 2026-11-24 (A): green centre + knob elevation**
- **Conflict:** Figma adds Elevation/Knob (navy 16 % blur 4 + navy 12 % y8 blur 32) for the knob. The demo withdraw slider uses a plain white knob with no centre dot.
- **Used (owner's answer: keep):** in `src/components/ui/Slider/index.module.css`:
  - Knob centre `--slider-knob-center` #298648 with a white ring (L6, E084).
  - Fill `--bg-success` #76dc93 (L7, E083).
  - Track `--bg-glass-on-dark` (E082).
  - Shadow `--elevation-knob` (L80, E081).
  - LoanQuote `.confirmSlider` (E114) and the captcha thumb (`RiskVerifyCaptcha/index.module.css:192-193`, E189 / E190) follow.

### 6. Focus ring and caret colours (G-033, G-034). **Decided 2026-11-24 (C): no focus ring**
- **Owner's answer:** no focus ring. Production keeps its no-outline rule (`button` outline 0 for Android WebView).
- **Used:**
  - The global `:focus-visible` 2 px ring (former E002, `global.css` after L192) is **removed** from the package. No edit adds a focus ring.
  - Carets stay: `--fg-accent` #298648 (global rule E003 after L191, plus per-field adds in CityCascadeSheet, EmailField, BasicInformation, RecognizedIdentityDetails, LoanEstimate and the caret replacements).
  - Focus outlines that production already has on single controls (E105, E118, E221, E238, E271, E274, E278, E327, E426, E466, E470, E481) are not new rings: they only change colour from the legacy blue to `--border-selected`, and stay.

## B. Conflicts I found between the token map and the visual rules

### 7. Brand primitive steps: token map vs owner colour rule (G-060, G-061, G-075, G-076). **Needs owner confirmation**
- **Conflict:** `token-map.json` follows the official 11.21 CSV, which maps legacy blue primitives one tier lighter. The owner colour rule (G-001) and the visual rows map them step for step.
- **Used:** where a primitive does a semantic job, the edit sets the semantic token: primary fill → `--button-primary-bg`, navy card → `--bg-brand`, accent text → `--fg-accent`. That removes most uses. Any `--color-brand-*` left after the edits takes the token-map value.

| Production token | Token map gives | Visual rule gives |
|---|---|---|
| `--color-brand-400` #74b2f5 | `--palette-green-300` #8de2a6 | `--palette-green-400` #76dc93 |
| `--color-brand-500` #3fa0f0 | `--palette-green-400` #76dc93 | `--palette-green-500` #5cd680 |
| `--color-brand-600` #2c74be | `--palette-green-500` #5cd680 | `--palette-green-600` #36a65b |
| `--color-green-500` #58e09a | `--palette-green-400` #76dc93 | `--palette-green-500` #5cd680 |
| `--color-positive-600` #3bcb84 | `--palette-green-500` #5cd680 | `--palette-green-600` #36a65b |

- **Alternative:** switch the token map to the `alternative` column for these five.

### 8. Glass fill, scrim and dark-surface alternatives in the token map. **Decided 2026-11-24 (A): keep the current design**
- `--color-surface-elevated-glass` (white 60 %) becomes `--bg-glass` (white 80 %), which C-063 and C-128 want. **Used:** 80 %.
- `--color-overlay-scrim-default` (black 20 %) becomes `--overlay-scrim` (navy 40 %, the flat page-sheet scrim, G-024). Bottom sheets use `--gradient-scrim` (G-023). The global.css local `--gradient-modal-backdrop` is deleted so the token wins. **Used:** navy 40 % flat, gradient on bottom sheets.
- `--color-action-text-default` (white) becomes `--fg-on-accent` (navy). That is right on green primaries. Every white label on navy, red or dark fills is edited to `--fg-on-emphasis` in the change list.
- These are rows of `unresolved.md` §2 (the 14 "current design" rows), which the owner kept as they are.

### 9. Boot splash (index.html) (G-029). **Decided 2026-11-24 (A): navy + white wordmark**
- **Conflict:** G-029 makes the demo splash navy. Production shows a static boot frame before React mounts: mist ground, navy wordmark, blue dots.
- **Used (owner's answer: keep):**
  - Navy ground (#000128) on body, #static-boot and the SVG plates (E015, E014, E010, E008).
  - White wordmark (E013, E009).
  - Dots #298648.
  - Hanken Grotesk.

### 10. Removed letter-spacing tokens. **Needs owner confirmation**
- **Issue:** the token map removes `--body-md-letter-spacing`, `--display-sm-letter-spacing` and the others (v3 keeps tracking in the text classes). `removed-literals.sed` replaces each whole `var()` with a literal: 0, −0.02 em or −0.005 em.
- `--display-sm-letter-spacing` was −0.005 em (fallback) and becomes −0.02 em.
- `--title-*-letter-spacing` was −0.01 em and becomes −0.005 em.
- `--body-*` drops from 0.02 em to 0.
- **Used:** the sed values.
- **Alternative:** keep the production values as literals.

## C. Conflicts raised while mapping production files

- **`index.html:17-283`** (G-029). **Decided 2026-11-24 (A):** navy ground #000128 + white wordmark, as the package has it (E008–E015).
- **`src/styles/global.css:192`** (G-033). **Decided 2026-11-24 (C):** no focus ring; production keeps its no-outline rule. The former E002 is removed; the caret rule E003 stays.
- **`src/components/ui/LoanQuote/index.module.css:32`** (C-118,C-119). .confirmAmountButton colour (and @keyframes morph-amount to brand, L274) is shared by the Withdraw amount card (C-118: --fg-accent) and the Loan estimate (C-119: --fg-default navy). **Used:** token map --fg-accent #298648 (no edit). **Alternative:** scope a navy override in the Loan estimate page (EstimateView/EstimateAmount) to var(--fg-default). **Needs owner confirmation.**
- **`src/components/ui/Alert.module.css:66`** (G-003,C-008). Single dialog action was dark slate #172139, not brand blue; treated as green primary. **Used:** var(--button-primary-bg) / var(--button-primary-fg). **Alternative:** var(--button-navy-bg) #000128 / var(--button-navy-fg) #fff. **Needs owner confirmation.**
- **`src/components/ui/Slider/index.module.css:6-8,80`** (C-050). **Decided 2026-11-24 (A):** knob `--slider-knob-center`, fill `--bg-success`, track `--bg-glass-on-dark`, shadow `--elevation-knob` (E081–E084, E114).
- **`src/components/ui/HeaderActionContainer/index.module.css:144-145; src/components/ui/CreditFlowHeader/index.module.css:39`** (G-012,G-013). Production glass header buttons blur 10px (--blur-backdrop-bg) with a 0 0 24 navy 8 % shadow; demo primary-header glass is blur 5px with --blur-glass-shadow. Not listed as edits because production never matched the demo before. **Used:** unchanged (10px, 24px glow). **Alternative:** blur(calc(var(--blur-backdrop-bg) / 2)) + var(--blur-glass-shadow) on primary headers. **Needs owner confirmation.**
- **`src/components/ui/PageLoading/index.module.css:61-75`** (G-032). Production page loader has 4 dots in 4 brand colours; G-032 makes all loader dots #298648 (fading at lower opacity). Edits make them one colour; opacity steps not added. **Used:** var(--fg-accent) on all dots. **Alternative:** keep a multi-colour set in green steps. **Needs owner confirmation.**
- **`src/pages/AuthPage/BankCard/index.module.css:482`** (C-001, G-002, C-008). Confirm-account sheet submit uses --color-surface-card-brand; token map turns it into a navy button with white label (looks like C-008 Navy), but next to a neutral Cancel it is the primary action (unresolved.md §2 lists BankCard :482 as an owner call). **Used:** --button-primary-bg #5cd680 / --button-primary-fg #000128. **Alternative:** keep token-map result: --bg-brand #000128 + white label (Navy button). **Needs owner confirmation.**
- **`src/pages/AccountPage/AccountDeletionReason/components/DeleteAccountConfirmDialog/index.module.css:115 and src/pages/AccountPage/AccountDeletionVerify/index.module.css:178`** (C-009, C-001). Delete-account confirm buttons are brand-blue primary in production; rules map delete account to Destructive red. **Used:** --button-destructive-bg #e00010 / --button-destructive-fg #fff. **Alternative:** green primary --button-primary-bg / --button-primary-fg. **Needs owner confirmation.**
- **`src/features/reloan/components/AmountEditDrawer/index.module.css:150, src/features/reloan/components/AmountEditDrawer/index.module.css:161`** (C-120). Production fixed digits / decimals use neutral-150 #cdd1d4 (lighter than demo before #97a0a6); C-120 after = --fg-disabled #8a8a9c. **Used:** --fg-disabled #8a8a9c. **Alternative:** token map only: --palette-navy-200 #d6d6dd (keeps production lightness). **Needs owner confirmation.**
- **`src/features/reloan/components/AmountEditDrawer/index.module.css:209`** (C-004, C-005). Back next to a primary: white + #bac0c4 line + grey label reads as secondary (C-004) but could be the neutral Cancel (C-005). **Used:** secondary: keep white/#b2b3be line, label --button-secondary-fg. **Alternative:** neutral: --button-neutral-bg #ebebee, no line, --button-neutral-fg. **Needs owner confirmation.**
- **`src/pages/AuthPage/Identity/components/IdentityInUseDialog/index.module.css:148, src/pages/AuthPage/Identity/components/IdentityInUseDialog/index.module.css:165`** (C-004, C-139). Two-line outlined account buttons with link-blue titles: secondary button vs choice card. **Used:** --button-secondary-border / --button-secondary-fg. **Alternative:** choice card: line --border-muted (token map) and title --fg-accent (token map). **Needs owner confirmation.**
- **`src/pages/AuthPage/OtpVerify/index.module.css:181,224`** (C-045). **Decided 2026-11-24 (A):** demo: label `--fg-subtle` / `--fg-accent`, ring `--border-muted` / `--border-selected` (E360, E361).
- **`src/pages/AuthPage/Liveness/components/LivenessStatusCircle/index.module.css:73`** (C-134). BRIEF 29 asked for a dark-green upload ring; code demo dash is light green. **Used:** var(--border-selected) #76dc93. **Alternative:** var(--fg-accent) #298648 (what the token map alone gives). **Needs owner confirmation.**
- **`src/pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:192-193`** (C-050). **Decided 2026-11-24 (A, with the slider knob):** `--slider-knob-center` #298648, `--elevation-knob` (E189, E190).
- **`src/pages/HomePage/CreditAmountCard/index.module.scss:11`** (C-064). **Decided 2026-11-24 (B):** `var(--gradient-brand-card)` (E219), also on ApplicationStateCard `.card` (E544) and the Home state card `.primaryCard` / expired (E425, E421, E424).
- **`src/pages/HomePage/BottomNavigation/index.tsx:203`** (G-039). **Decided 2026-11-24 (E), structural (owner-approved):** the decorative `<img alt="">` becomes `<span aria-hidden="true" className={styles.tabIcon}>` with the same SVG as `mask-image` (inline style) (E023); `.tabIcon` paints `background-color: currentcolor` through the mask, 18 px unchanged (E542). The icon then follows `.tabButton` `--fg-default` and `.tabButtonActive` `--fg-accent` (E019).
- **`src/pages/HomePage/Home/HomeComposite.module.css:353`** (C-077). **Decided 2026-11-24 (F), structural (owner-approved):** the Home payment button gets `data-overdue={repayment.isRepaymentOverdue}` (the flag the badge and due date already use; `HomeComposite.tsx:702`, E543) and `.repaymentFooter button[data-overdue='true']` paints it `--button-destructive-bg` / `--button-destructive-fg` (E400). The `:has()` rule is gone.
- **`src/pages/HomePage/Payment/components/PaymentErrorModal/index.module.css:44`** (G-003). Production renders a near-black confirm button (undefined token fallback); no design row for this modal **Used:** green primary. **Alternative:** var(--button-navy-bg) + var(--button-navy-fg) (keeps the dark look). **Needs owner confirmation.**
- **`src/pages/RepayPage/components/RepayDetailRefreshFeedback.module.css:88`** (C-004,C-005). 'Back' button next to the primary 'Retry' in a modal: production draws it blue-outlined (=> Secondary C-004) but it plays the Cancel role that C-005 makes Neutral (grey fill, no line). **Used:** Secondary: white, 1px --button-secondary-border, label --button-secondary-fg. **Alternative:** Neutral: background var(--button-neutral-bg) #ebebee, border 0, color var(--button-neutral-fg). **Needs owner confirmation.**
- **`src/pages/OutPages/DiversionPage/Home/components/NewCustomerCard/index.module.css:44,47`** (C-078,C-079). NewCustomerCard is the diversion copy of PS.Hero; C-078/C-079 type and green body line are listed with the hero rebuild (structure excluded). Applying them changes the card height. **Used:** amount 36/36 -2 %, 1.5px --border-selected on body sides+bottom. **Alternative:** leave geometry/type as production (colour-only rebrand). **Needs owner confirmation.**

- **`src/pages/HomePage/Payment/components/PaymentMethodDrawer/index.module.css:345-346, 350-351`** (G-001). Category icons are `<img>` recoloured by a CSS `filter` chain tuned for the legacy greys / blue. **Used:** E285 / E286 replace the chains with new ones computed for #298648 (`--fg-accent`, active) and #8A8A9C (`--fg-disabled`), checked by rendering in Chrome (exact pixel colours; the old active chain rendered #3670b1, not #2c74be). **Alternative:** mask + `background-color: currentColor` like E023 — structural (the shared `AssetIcon` `<img>` would become a `<span>`). **Decided 2026-11-24 (H): package value**; value shipped 2026-11-25.

## D. Other owner checks noted while mapping (not edited)

- QuoteForm L442 box-shadow: var(--shadow-subtle) is undefined with no fallback, so production renders no shadow on the withdraw-flow order stack; edit E125 deletes the declaration (renders the same; owner may want --elevation-1/2). **Needs owner confirmation.**
- LoanQuote and QuoteForm term-chip font-weight: --body-md-emphasis-font-weight resolves to 500 while C-052 wants 600 (QuoteForm L279 edited; LoanQuote uses the undefined --font-weight-semibold so 600 already renders). **Needs owner confirmation.**
- Assets with legacy blue to cover in the assets file: src/assets/svg/credit-validity/close.svg (#2C74BE), src/assets/svg/withdraw-amount-edit.svg (#2C74BE), src/components/ui/NoticeTicker/assets/info.svg (#20558D), src/assets/payment-methods/default-wallet.svg (fill var(--fill-0, #7D878E)). **Needs owner confirmation.**
- AccountDeletionVerify success toast (page-local glass pill, centred) keeps its glow shadow; G-025/G-026 apply to the shared Toast only. **Needs owner confirmation.**
- Owner check: LoanDetail .cancelButton shares one rule with the document link rows (.actionButton, .cancelButton line 303-315) and stays green --fg-link; if 'Cancel loan' should be a navy text button (C-003) or destructive, the selector must be split (structural). **Needs owner confirmation.**
- Owner check: LoanEstimate edit-amount Cancel/Confirm share '.editActions button' (green accent-muted fill + green label); C-005/C-001 would need the two buttons split (structural). **Needs owner confirmation.**
- Focus indicators in LoanDetail/LoanHistory/LoginEntry/OtpVerify use --shadow-focus (elevation, already navy), not a blue outline; not changed. **Decided 2026-11-24 (C):** no new focus rings.
- RiskVerifyCaptcha.tsx line 171 random bubble hue range 160-215 (teal to blue) left untouched; canvas art needs design if it must lose the blue. **Needs owner confirmation.**
- CreditLimitPage .limitAmount uses weight 600 for a money amount; G-005 (Hanken 700 for amounts) only mandated for Satoshi/Reddit amounts, so not changed — check. **Needs owner confirmation.**
- Fraud ticker (C-106) colours come from backend config, not CSS in this slice. **Needs owner confirmation.**
- Focus outlines in About/CustomerService/FAQ are 3px (G-033 says 2px); colour is right after the map, width left alone. **Needs owner confirmation.**
- `src/components/ui/Button/index.tsx` (C-001, C-005): dead Tailwind component (only its README uses it, `06-production-audit/SUMMARY.md` item 4). Its two colour edits are `skip` (E066, E067); delete the component or restyle it only if it comes back into use.
