# Conflicts: values chosen in the change list that need the owner

Every item here is marked **needs owner confirmation**. The change list (`changes-by-file.json`/`.md`) already uses the value in **Used**. **Alternative** is what to switch to if the owner disagrees. Baseline: production `phi_h5_025` master `0d9bdd4`.

## A. The six Figma-vs-demo conflicts found by the visual pass

### 1. "Best" pill colour (C-015). **Needs owner confirmation**
- **Conflict:** Figma (figma-lib 43) makes the CouponPickCard "Best" pill green again and keeps orange only on CouponTicket. The demo uses orange on both.
- **Used:** nothing. Production has no coupon UI, so no file is edited (see `coverage.json` a).
- **When coupons are built:** orange `--bg-attention-muted` #ffe6d5 with `--fg-attention` #ff5e00, as in the demo. The alternative is green `--bg-success-subtle` #effbf2 with `--fg-success-strong` #1d6334 on the picker.

### 2. Brand-card gradient (G-002, C-064, C-095). **Needs owner confirmation**
- **Conflict:** Figma puts Gradient/Brand-card (navy 50 % → #3d3e5c) on CreditCard and StateCard. The code paints them flat navy and uses the gradient only on HubCard.
- **Used:**
  - Flat `--bg-brand` #000128 on the home credit card (`CreditAmountCard/index.module.scss:11`), the application state card, the Home expired/error card and the diversion cards (DiversionApplicationCard, LoanPlanCard, NewCustomerCard, DiversionHomeShell tile, QuoteForm amount panel).
  - `--gradient-brand-card` only on the credit-limit hub card (`CreditLimitPage/index.module.css`, C-095).
- **Alternative:** `var(--gradient-brand-card)` on CreditAmountCard and ApplicationStateCard as well.

### 3. ContactMethod selected state (C-045). **Needs owner confirmation**
- **Conflict:** Figma puts the selected stroke, icon and label all on green-600 (Content/Selected). The code uses a green-700 label with a green-400 ring.
- **Used:** `src/pages/AuthPage/OtpVerify/index.module.css` lines 181 and 224 follow the code. Labels are `--fg-subtle` #61627a when off and `--fg-accent` #298648 when on. Rings are `--border-muted` #d6d6dd when off and `--border-selected` #76dc93 when on.
- **Alternative:** stroke, icon and label all #36a65b (`--palette-green-600`).

### 4. Number tracking on amounts (G-005). **Needs owner confirmation**
- **Conflict:** On 2026-11-19 the owner set new Figma Amount tracking: xxl +4 %, lg +3 %, md +2 %, xs +2 %, weight 700. The code keeps the old Number tracking (xxl +3 %, lg +2 %, md 0).
- **Used:** amounts change family only. Satoshi becomes `--font-family-number` (Hanken Grotesk) at weight 700. Production letter-spacing on amounts stays as it is, with no tracking edits. The exceptions are the hero amounts (NewCustomer, NewCustomerCard), which take the C-078 Display/md value of −0.02 em.
- **Alternative:** apply the Figma Amount tracking by size wherever `--font-family-number` is used.

### 5. Slider knob (C-050, G-035). **Needs owner confirmation**
- **Conflict:** Figma adds Elevation/Knob (navy 16 % blur 4 + navy 12 % y8 blur 32) for the knob. The code left the knob shadow unchanged. The demo withdraw slider uses a plain white knob with no centre dot.
- **Used:** in `src/components/ui/Slider/index.module.css`:
  - Knob centre `--slider-knob-center` #298648 with a white ring (L6).
  - Fill `--bg-success` #76dc93 (L7).
  - Track `--bg-glass-on-dark`.
  - Shadow `--elevation-knob` (L80).
  - The captcha thumb (`RiskVerifyCaptcha/index.module.css:192-193`) follows by analogy.
- **Alternative:** keep the current knob shadow (`--elevation-3`, the old --shadow-focus), or use the plain white knob from withdraw.js.

### 6. Focus ring and caret colours (G-033, G-034). **Needs owner confirmation**
- **Conflict:** BRIEF says "Focus = light green" (green-500 #5cd680) for both. In v3, `--border-selected` is green-400 #76dc93 and the code caret is `--fg-accent` green-700 #298648.
- **Used:**
  - Focus rings and active field borders: `--border-selected` #76dc93.
  - Carets: `--fg-accent` #298648. There is a global rule (`src/styles/global.css` after L191), plus per-field adds in CityCascadeSheet, EmailField, BasicInformation, RecognizedIdentityDetails and LoanEstimate.
  - New global `:focus-visible` 2 px ring (`global.css` after L192). Production removes outlines on purpose for Android WebView.
- **Alternatives:**
  - green-500 #5cd680 for both.
  - No global focus ring.
  - 3 px rings stay in About/CustomerService/FAQ (left as is).

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

### 8. Glass fill, scrim and dark-surface alternatives in the token map. **Needs owner confirmation**
- `--color-surface-elevated-glass` (white 60 %) becomes `--bg-glass` (white 80 %), which C-063 and C-128 want. The parity alternative is `--bg-glass-subtle` (60 %). **Used:** 80 %.
- `--color-overlay-scrim-default` (black 20 %) becomes `--overlay-scrim` (navy 40 %, the flat page-sheet scrim, G-024). Bottom sheets use `--gradient-scrim` (G-023). The global.css local `--gradient-modal-backdrop` is deleted so the token wins. **Used:** navy 40 % flat, gradient on bottom sheets. The alternative is navy 20 % (`--palette-alpha-navy-20`).
- `--color-action-text-default` (white) becomes `--fg-on-accent` (navy). That is right on green primaries. Every white label on navy, red or dark fills is edited to `--fg-on-emphasis` in the change list.

### 9. Boot splash (index.html) (G-029). **Needs owner confirmation**
- **Conflict:** G-029 makes the demo splash navy. Production shows a static boot frame before React mounts: mist ground, navy wordmark, blue dots.
- **Used:**
  - Navy ground (#000128) on body, #static-boot and the SVG plates.
  - White wordmark.
  - Dots #298648.
  - Hanken Grotesk.
- **Alternative:** keep the mist ground and navy wordmark, and change only the dots and font. SplashPage itself also turns navy (slice 5).

### 10. Removed letter-spacing tokens. **Needs owner confirmation**
- **Issue:** the token map removes `--body-md-letter-spacing`, `--display-sm-letter-spacing` and the others (v3 keeps tracking in the text classes). `removed-literals.sed` replaces each whole `var()` with a literal: 0, −0.02 em or −0.005 em.
- `--display-sm-letter-spacing` was −0.005 em (fallback) and becomes −0.02 em.
- `--title-*-letter-spacing` was −0.01 em and becomes −0.005 em.
- `--body-*` drops from 0.02 em to 0.
- **Used:** the sed values.
- **Alternative:** keep the production values as literals.

## C. Conflicts raised while mapping production files

- **`index.html:17-283`** (G-029). G-029 sets the demo splash to navy; production shows a static boot frame (mist ground, navy wordmark) before React. Making it navy needs the wordmark white. **Used:** navy ground #000128 + white wordmark. **Alternative:** keep mist #f0f5f4 ground and navy wordmark (only dots + font change). **Needs owner confirmation.**
- **`src/styles/global.css:192`** (G-033). Production removes button outlines on purpose (Android WebView orange focus ring). G-033 wants a 2px green focus ring. **Used:** :focus-visible 2px --border-selected. **Alternative:** leave production without focus ring. **Needs owner confirmation.**
- **`src/components/ui/LoanQuote/index.module.css:32`** (C-118,C-119). .confirmAmountButton colour (and @keyframes morph-amount to brand, L274) is shared by the Withdraw amount card (C-118: --fg-accent) and the Loan estimate (C-119: --fg-default navy). **Used:** token map --fg-accent #298648 (no edit). **Alternative:** scope a navy override in the Loan estimate page (EstimateView/EstimateAmount) to var(--fg-default). **Needs owner confirmation.**
- **`src/components/ui/Alert.module.css:66`** (G-003,C-008). Single dialog action was dark slate #172139, not brand blue; treated as green primary. **Used:** var(--button-primary-bg) / var(--button-primary-fg). **Alternative:** var(--button-navy-bg) #000128 / var(--button-navy-fg) #fff. **Needs owner confirmation.**
- **`src/components/ui/Slider/index.module.css:6-8,80`** (C-050). C-050 knob/elevation-knob flagged as conflict in rules; the default slider sits on the QuoteForm amount panel (navy after this list) and DiversionPage LoanPlanCard, which the demo never shows. **Used:** knob --slider-knob-center, fill --bg-success, track --bg-glass-on-dark, shadow --elevation-knob. **Alternative:** keep white fill/knob on dark (withdraw.js: plain white knob, #76DC93 fill). **Needs owner confirmation.**
- **`src/components/ui/HeaderActionContainer/index.module.css:144-145; src/components/ui/CreditFlowHeader/index.module.css:39`** (G-012,G-013). Production glass header buttons blur 10px (--blur-backdrop-bg) with a 0 0 24 navy 8 % shadow; demo primary-header glass is blur 5px with --blur-glass-shadow. Not listed as edits because production never matched the demo before. **Used:** unchanged (10px, 24px glow). **Alternative:** blur(calc(var(--blur-backdrop-bg) / 2)) + var(--blur-glass-shadow) on primary headers. **Needs owner confirmation.**
- **`src/components/ui/PageLoading/index.module.css:61-75`** (G-032). Production page loader has 4 dots in 4 brand colours; G-032 makes all loader dots #298648 (fading at lower opacity). Edits make them one colour; opacity steps not added. **Used:** var(--fg-accent) on all dots. **Alternative:** keep a multi-colour set in green steps. **Needs owner confirmation.**
- **`src/pages/AuthPage/BankCard/index.module.css:482`** (C-001, G-002, C-008). Confirm-account sheet submit uses --color-surface-card-brand; token map turns it into a navy button with white label (looks like C-008 Navy), but next to a neutral Cancel it is the primary action (unresolved.md §2 lists BankCard :482 as an owner call). **Used:** --button-primary-bg #5cd680 / --button-primary-fg #000128. **Alternative:** keep token-map result: --bg-brand #000128 + white label (Navy button). **Needs owner confirmation.**
- **`src/pages/AccountPage/AccountDeletionReason/components/DeleteAccountConfirmDialog/index.module.css:115 and src/pages/AccountPage/AccountDeletionVerify/index.module.css:178`** (C-009, C-001). Delete-account confirm buttons are brand-blue primary in production; rules map delete account to Destructive red. **Used:** --button-destructive-bg #e00010 / --button-destructive-fg #fff. **Alternative:** green primary --button-primary-bg / --button-primary-fg. **Needs owner confirmation.**
- **`src/features/reloan/components/AmountEditDrawer/index.module.css:150, src/features/reloan/components/AmountEditDrawer/index.module.css:161`** (C-120). Production fixed digits / decimals use neutral-150 #cdd1d4 (lighter than demo before #97a0a6); C-120 after = --fg-disabled #8a8a9c. **Used:** --fg-disabled #8a8a9c. **Alternative:** token map only: --palette-navy-200 #d6d6dd (keeps production lightness). **Needs owner confirmation.**
- **`src/features/reloan/components/AmountEditDrawer/index.module.css:209`** (C-004, C-005). Back next to a primary: white + #bac0c4 line + grey label reads as secondary (C-004) but could be the neutral Cancel (C-005). **Used:** secondary: keep white/#b2b3be line, label --button-secondary-fg. **Alternative:** neutral: --button-neutral-bg #ebebee, no line, --button-neutral-fg. **Needs owner confirmation.**
- **`src/pages/AuthPage/Identity/components/IdentityInUseDialog/index.module.css:148, src/pages/AuthPage/Identity/components/IdentityInUseDialog/index.module.css:165`** (C-004, C-139). Two-line outlined account buttons with link-blue titles: secondary button vs choice card. **Used:** --button-secondary-border / --button-secondary-fg. **Alternative:** choice card: line --border-muted (token map) and title --fg-accent (token map). **Needs owner confirmation.**
- **`src/pages/AuthPage/OtpVerify/index.module.css:181,224`** (C-045). Figma puts selected stroke, icon and label on green-600 (Content/Selected); code demo uses --fg-accent label + --border-selected ring. **Used:** label --fg-subtle / --fg-accent, ring --border-muted / --border-selected. **Alternative:** selected stroke+icon+label green-600 #36a65b. **Needs owner confirmation.**
- **`src/pages/AuthPage/Liveness/components/LivenessStatusCircle/index.module.css:73`** (C-134). BRIEF 29 asked for a dark-green upload ring; code demo dash is light green. **Used:** var(--border-selected) #76dc93. **Alternative:** var(--fg-accent) #298648 (what the token map alone gives). **Needs owner confirmation.**
- **`src/pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:192-193`** (C-050). Captcha thumb is not PS.Slider; knob colour/shadow applied by analogy; C-050 knob shadow itself is a Figma/code conflict. **Used:** --slider-knob-center #298648, --elevation-knob. **Alternative:** token-map green-500 #5cd680 thumb; shadow 0 4px 12px rgb(0 1 40 / 0.4) (rule: blue-alpha shadow -> navy alpha). **Needs owner confirmation.**
- **`src/pages/HomePage/CreditAmountCard/index.module.scss:11`** (C-064). Figma puts Gradient/Brand-card on CreditCard; code/visual-changes after = flat navy **Used:** var(--bg-brand) flat. **Alternative:** var(--gradient-brand-card). **Needs owner confirmation.**
- **`src/pages/HomePage/BottomNavigation/index.tsx:203`** (G-039). Active tab icon must turn --fg-accent but icons are <img> with baked #141E24; needs currentColor rendering (small structural change) **Used:** label colour edit only; the icon line is the `manual` edit E023 (out of scope until the owner decides; nothing is applied). **Alternative:** separate active asset per tab. **Needs owner confirmation.**
- **`src/pages/HomePage/Home/HomeComposite.module.css:353`** (C-077). Overdue red button needs a state hook on the button; production only marks the badge/date with data-overdue **Used:** :has(strong[data-overdue='true']) rule. **Alternative:** add data-overdue on the <button> in HomeComposite.tsx. **Needs owner confirmation.**
- **`src/pages/HomePage/Payment/components/PaymentErrorModal/index.module.css:44`** (G-003). Production renders a near-black confirm button (undefined token fallback); no design row for this modal **Used:** green primary. **Alternative:** var(--button-navy-bg) + var(--button-navy-fg) (keeps the dark look). **Needs owner confirmation.**
- **`src/pages/RepayPage/components/RepayDetailRefreshFeedback.module.css:88`** (C-004,C-005). 'Back' button next to the primary 'Retry' in a modal: production draws it blue-outlined (=> Secondary C-004) but it plays the Cancel role that C-005 makes Neutral (grey fill, no line). **Used:** Secondary: white, 1px --button-secondary-border, label --button-secondary-fg. **Alternative:** Neutral: background var(--button-neutral-bg) #ebebee, border 0, color var(--button-neutral-fg). **Needs owner confirmation.**
- **`src/pages/OutPages/DiversionPage/Home/components/NewCustomerCard/index.module.css:44,47`** (C-078,C-079). NewCustomerCard is the diversion copy of PS.Hero; C-078/C-079 type and green body line are listed with the hero rebuild (structure excluded). Applying them changes the card height. **Used:** amount 36/36 -2 %, 1.5px --border-selected on body sides+bottom. **Alternative:** leave geometry/type as production (colour-only rebrand). **Needs owner confirmation.**

- **`src/pages/HomePage/Payment/components/PaymentMethodDrawer/index.module.css:345-346, 350-351`** (G-001). Category icons are `<img>` recoloured by a CSS `filter` chain tuned for the legacy greys / blue. **Used:** `manual` edits E285, E286 (compute a filter chain for #8A8A9C and #298648, or mask + currentColor, which is structural). **Needs owner confirmation.**

## D. Other owner checks noted while mapping (not edited)

- QuoteForm L442 box-shadow: var(--shadow-subtle) is undefined with no fallback, so production renders no shadow on the withdraw-flow order stack; edit E125 deletes the declaration (renders the same; owner may want --elevation-1/2). **Needs owner confirmation.**
- LoanQuote and QuoteForm term-chip font-weight: --body-md-emphasis-font-weight resolves to 500 while C-052 wants 600 (QuoteForm L279 edited; LoanQuote uses the undefined --font-weight-semibold so 600 already renders). **Needs owner confirmation.**
- Assets with legacy blue to cover in the assets file: src/assets/svg/credit-validity/close.svg (#2C74BE), src/assets/svg/withdraw-amount-edit.svg (#2C74BE), src/components/ui/NoticeTicker/assets/info.svg (#20558D), src/assets/payment-methods/default-wallet.svg (fill var(--fill-0, #7D878E)). **Needs owner confirmation.**
- AccountDeletionVerify success toast (page-local glass pill, centred) keeps its glow shadow; G-025/G-026 apply to the shared Toast only. **Needs owner confirmation.**
- Owner check: LoanDetail .cancelButton shares one rule with the document link rows (.actionButton, .cancelButton line 303-315) and stays green --fg-link; if 'Cancel loan' should be a navy text button (C-003) or destructive, the selector must be split (structural). **Needs owner confirmation.**
- Owner check: LoanEstimate edit-amount Cancel/Confirm share '.editActions button' (green accent-muted fill + green label); C-005/C-001 would need the two buttons split (structural). **Needs owner confirmation.**
- Focus indicators in LoanDetail/LoanHistory/LoginEntry/OtpVerify use --shadow-focus (elevation, already navy), not a blue outline; not changed to a 2px green ring (G-033) because that changes structure — flag if wanted. **Needs owner confirmation.**
- RiskVerifyCaptcha.tsx line 171 random bubble hue range 160-215 (teal to blue) left untouched; canvas art needs design if it must lose the blue. **Needs owner confirmation.**
- CreditLimitPage .limitAmount uses weight 600 for a money amount; G-005 (Hanken 700 for amounts) only mandated for Satoshi/Reddit amounts, so not changed — check. **Needs owner confirmation.**
- Fraud ticker (C-106) colours come from backend config, not CSS in this slice. **Needs owner confirmation.**
- Focus outlines in About/CustomerService/FAQ are 3px (G-033 says 2px); colour is right after the map, width left alone. **Needs owner confirmation.**
- `src/components/ui/Button/index.tsx` (C-001, C-005): dead Tailwind component (only its README uses it, `06-production-audit/SUMMARY.md` item 4). Its two colour edits are `skip` (E066, E067); delete the component or restyle it only if it comes back into use.
