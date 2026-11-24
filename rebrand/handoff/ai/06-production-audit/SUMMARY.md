# Prod visual inventory — phi_h5_025 master 0d9bdd4

Read-only scan of the production export. Scanned GitLab phi_h5_025 master 0d9bdd4 (2026-11-23).

## Files
| File | What |
|---|---|
| `prod-tokens.json` | 757 custom-property definitions (737 names): 693 global in `src/styles/figma-tokens.css` + `global.css`, 64 module-local. Each has value, resolvedValue, category, definedIn, usageCount, usedIn, and `figmaSource` (path + alias in `tokens/figma-tokens.json`). Also lists names defined twice, same-value groups, unused tokens, and var() names that are never defined. |
| `hardcoded.json` | 5,793 records: 4,527 var() fallbacks, 366 font-family, 293 colour literals (188 CSS, 105 TS/JS), 121 letter-spacing, 115 font-weight, 110 line-height, 103 font-size, 67 radius, 39 box-shadow, 36 gradients, 16 blurs. Includes a per-file summary and a list of the 97 distinct colours with any token that has the same value. |
| `components.json` | 129 styled units: 82 components, 40 pages, 7 features. Each has a plain-words `draws`, its stylesheet(s), the tokens it uses, a hard-code summary, icons, images and keyframes. |
| `assets.json` | Fonts (4 @font-face families, the files, where each family is used), 6 animation sources with their colours, 61 CSS keyframes, 5 GSAP files, icon sets (lucide-react: 28 icons; 30 local SVG folders) and 183 images with size, category, colours and where each is used. |

## Token naming schemes (all generated from Figma Variables by `scripts/figma_tokens_to_css.py`; the generated file says "do not edit")
- **Primitive colour ramps:** `--color-{brand|blue|green|red|neutral|positive|negative|warning|yellow|pink|marketing}-{50..950}` and `--color-alpha-{black|white|blue|green|grey|cold-*}-{N}`. The brand colour is blue: `--color-brand-600` #2c74be, `-500` #3fa0f0, `-950` #000128.
- **Semantic colours** (the ones most used): `--color-text-*`, `--color-surface-*`, `--color-action-{bg|text|stroke}-*`, `--color-icon-*`, `--color-stroke-*`, `--color-shadow-*`, `--color-gradient-*`, plus component tokens `--tag-color-{brand|neutral|positive|negative}-*`.
- **Typography has three naming schemes at once:**
  - style first: `--{body-lg|body-md|caption-sm|label-md|title-lg|display-xl|section-title-sm…}-{font-size|font-weight|line-height|letter-spacing|font-family}`
  - property first: `--font-size-body-md`, `--font-line-height-title-sm`
  - raw numbers: `--font-size-14`, plus index numbers `--font-size-0…10` that duplicate them
  - Tokens Studio leftovers: `--font-weights-inter-0`, `--font-weights-hanken-grotesk-5`
- **Spacing:** raw `--spacing-{0..64}` plus semantic `--spacing-{gap|padding|section|page-x|page-top|page-bottom}-{size}`. **Radius:** `--radius-{8..32}` and `--radius-{xs..xxl|full}`. Also `--blur-*`, `--stroke-width-*`, `--layer-opacity-*`, and 3 shadows `--shadow-{default|focus|over}`.
- 159 groups of global tokens share the same value (aliases). 366 of the 693 global tokens are never used. The most used are `--color-text-primary` (208), `--font-family-body` (172), `--spacing-gap-sm` (167), `--radius-full` (155).

## Odd things worth knowing before a rebrand
1. **Almost every var() has a hard-coded fallback** (4,527 of them). 122 of those fallbacks differ from the token's real value. Examples: `--radius-full` 999px vs 9999px, `--blur-backdrop-bg` 5px vs 10px, `--color-text-secondary` written as #7d878e / #5a656d / #6a757d / #4b5563 while the token is #3c4850, and `--color-stroke-brand-default` #2c74be vs #3fa0f0. A rebrand must change the tokens *and* clean up the fallbacks, or the old colours stay in the code.
2. **41 names are used in var() but never defined anywhere**, so only their fallback ever renders. Examples: `--font-weight-semibold` (40 uses; the token is spelled `--font-weight-semi-bold`), `--line-height-body-md` (21), `--color-primary`, `--color-brand-primary`, `--color-border-*`, `--label-lg-*`, `--shadow-subtle`, `--radius-2xs`. A separate 22 names are set at runtime from TS (viewport height, sheet drag offset, header colours).
3. **`--layer-opacity-*` tokens are in px** (for example `--layer-opacity-subtle: 20px`). `opacity: var(--layer-opacity-subtle)` in `Select` is therefore invalid, and the element renders at full opacity.
4. **The old Tailwind slate palette is still hard-coded** (#0f172a, #172139, #64748b, #94a3b8, #cbd5e1, #f1f5f9). It appears in `Alert`, `ErrorBlock`, `Loading`, `MobileModal` and `SplashPage`. `components/ui/Button` still uses Tailwind classes and is dead: only its README references it.
5. **Hard-coded colours cluster in a few places.** The withdraw coin animations (`motion/successCoin.ts`, `loadingCoin.ts`) were converted from Lottie and use rgb(43,116,189) (#2b74bd), #78aae2 and #f6f9f8. Those are near the brand blue #2c74be but are not tokens. The credit-increase coin heap (`CreditIncreaseIntro/material/baked-heap.*`) uses a separate dark palette (#0d1620, #eef5ef, accent #3fa0f0) and gold coins (#FFB000 / #FFD21F / #F29A00 …). Other hard-coded colours: `RiskVerifyCaptcha` (canvas colours), `ProgressiveBlur/model.ts`, `DisclosureStatementForm` (#111, fixed px, excluded from rem), star ratings #ffc400.
6. **Artwork that is off-palette:**
   - The app mark (`src/assets/Group 393.svg`, `public/logo.svg`) is green: #70ff99 / #53c574.
   - The `index.html` boot splash uses green dots rgb(88,208,124) and a navy wordmark rgb(0,1,40).
   - The empty-state illustrations (history, inbox, payment method, link expired) use a teal set: #2ab0be / #004e60 / #8ae6d0.
   - The fraud-warning and feedback illustrations use pink and lime: #ff9edf / #64c100 / #db3c8d.
   - None of these images follow the tokens.
7. **Copies that will drift:** some Diversion pages copy Home or Auth styles almost line for line (`MadeForFilipinos`, `HomeTrustSection`, `BasicInformation`, review cards). `--slider-*` is defined in both `Slider` and `LoanQuote`; `--bottom-action-button-max-width` is defined in 6 modules (12 names in all are defined more than once, all module-local).
8. There is no Lottie JSON in the repo. Both coin animations were baked to GSAP/SVG, and the Diversion landing loader only copies its timing from designer JSON. There is no coupon artwork; "coupon" appears only in API code.

## Fonts
All fonts are self-hosted WOFF2 files in `public/fonts`, declared in `src/styles/global.css`:
- **Inter** (variable, weights 300–800) is the body default (`body { font-family: 'Inter' }`), used via `--font-family-body` and `--font-family-label`. It appears in 298 declarations.
- **Hanken Grotesk** (variable, weights 300–900) is for titles and display, via `--font-family-title` and `--font-family-display`. It appears in 169 declarations.
- **Satoshi** (500 and 700, ITF Free Font License rather than OFL) is used only for large money digits in 7 files, and is hard-coded rather than tokenised.

Fonts referenced but never loaded: 'Nunito Sans' (QR payment), plus Roboto, Arial Black and Helvetica (disclosure document only).

`postcss_px_to_rem` turns px into rem at build time (the 360px artboard is the base). Inputs are forced to 16px so iOS does not zoom.
