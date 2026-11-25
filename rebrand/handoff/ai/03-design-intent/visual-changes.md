# PeraSure rebrand — purely visual changes

Pre-rebrand demo (`main`) → rebrand (`tokens/rebrand-v3`, tokens v2026.11.23, Figma copy `kYyNV2MgxvH1w9bJ46A3yx`).
Source of every row: the work log `rebrand/log/figma.md` ("log NN" = the coordinator entries 39–80 at the end of the file; "figma-lib NN" = the figma-lib lane entries 01–43 at the top), `rebrand/BRIEF.md` decisions, `rebrand/log/old-vs-rebrand-decisions-2026-11-24.md` ("decisions-11-24 #n"), `rebrand/CHANGES.md` and the code diff `main..tokens/rebrand-v3` (values resolved through both token sets).
Where the log contradicts itself the later entry wins; the earlier one is named under *Superseded*. ★ = owner decision.
Not here: behaviour, logic, flow, structure and copy — see `excluded.md`. Icons / illustrations / animations files: `assets-changed.json`.

Rows: 252 (global 92, of which token mapping 52; component 157; page 3). Owner decisions: 189.

## 1. Global rules

### G-001 · Colour rule (palette)
*Demo:* `all PS.* / --tokens` — every legacy blue paint · colour mapping rule · ★ owner

- **Before:** legacy blue scale (brand #2C74BE blue-600, light #3FA0F0 blue-500, heavy #20558D blue-700, tints #F3F8FF/#E4F0FF/#C8DEFF); neutral scale for text/lines (#141E24 … #E0E3E5)
- **After:** green v3 scale step for step (green-500 #5CD680 anchor; 400 #76DC93, 600 #36A65B, 700 #298648, 800 #1D6334; 50 #EFFBF2, 100 #DAF6E2, 200 #BAEEC9); navy v3 scale replaces neutral (900 #000128 … 50 #F5F5F6); Mist kept (#F0F5F4); red unchanged; text keeps its legacy hierarchy level
- **Source:** BRIEF colour rule (2026-11-20) + BRIEF 42/43; log 39, 41 · Figma 15004:15 (v3 scale review page)
- **Note:** Exact per-token values in the 'token mapping' rows below. Navy is used only for dark brand surfaces, controls on/selected and text.
- **Superseded:** BRIEF 'Green content = green-600 everywhere' (#43B265); green text green-700 #44A05F / heavy green-800 #327545 (CHANGES 2026-11-20); BRIEF 1 pending green-700 #2B8448; v2 green scale with 600 = #5CD680 — all superseded by v3 scales (BRIEF 42)

### G-002 · Brand surfaces
*Demo:* `PS.CreditCard, PS.StateCard, PS.QrPanel, PS.Hero, .ps-tile, CreditLimitCard tile` — dark brand card / tile fills · background · ★ owner

- **Before:** --color-surface-card-brand / --color-surface-icon-brand-default #2C74BE (blue)
- **After:** --bg-brand #000128 (Palette/Navy/900), flat
- **Source:** BRIEF 8; diff
- **Note:** HubCard is the only card with the Gradient/Brand-card in code (see HubCard). Figma also puts Gradient/Brand-card on CreditCard and StateCard (log 51) — not in code.

### G-003 · Primary action colour
*Demo:* `PS.Button primary, Withdraw Confirm, withdraw card button` — primary button · fill + label · ★ owner

- **Before:** fill --color-action-bg-primary-default #2C74BE, label white #FFFFFF
- **After:** fill --button-primary-bg → --bg-accent-emphasis #5CD680 (green-500), label --button-primary-fg → --fg-on-accent #000128 (navy)
- **Source:** BRIEF 7; log 55, 56 · Figma 10987:225
- **Note:** Only primary buttons are green (log 56).

### G-004 · Typeface
*Demo:* `all text (--font-family-body / -label / caption styles)` — body, label, caption text · font-family · ★ owner

- **Before:** Inter (body, labels, captions, Field values, buttons' labels); Hanken Grotesk only for titles/sections
- **After:** Hanken Grotesk for everything (--font-family-body/-label = "Hanken Grotesk")
- **Source:** BRIEF 10; decisions-11-24 #1b; log 63
- **Note:** Sizes, line heights, weights and letter-spacing of every .ps-t-* style are unchanged in code (only the family). Withdraw demo (withdraw.js/withdraw.css) also drops Inter.

### G-005 · Number font (Amount / Number styles)
*Demo:* `PS.Amount{num}, .ps-t-number-*, Withdraw amounts` — emphasised amounts · font-family · ★ owner

- **Before:** --font-family-number "Reddit Sans" (₱ from Reddit Sans); Number/xs 16/20 +2 %, sm 18/24 +3 %, md 24/32 0, lg 32/40 +2 %, xl 36/1 +4 %, xxl 48/1 +3 %, Bold 700
- **After:** --font-family-number "Hanken Grotesk" (Hanken's own ₱); sizes / weight 700 / tracking unchanged in code
- **Source:** decisions-11-24 #1, #1b; log 63; BRIEF 10
- **Note:** Figma Amount/* tracking was graded by the owner on 2026-11-19 (xxl +4 %, lg +3 %, md +2 %, xs +2 %) and Amount/* weight 800 → 700 (figma-lib 39); the code keeps its old Number tracking (xxl +3 %, lg +2 %, md 0). Check which tracking production should use.
- **Superseded:** CLAUDE.md 'Number font = Reddit Sans' (tokens v2026.11.17); decisions-11-24 #1 open question

### G-006 · Amount kerning
*Demo:* `PS.kern (core.js), Component.kern (withdraw.js)` — amounts drawn one glyph per box · pair kerning · ★ owner

- **Before:** Reddit Sans kerning table (PS.KERN / Component.KERN, units/2048)
- **After:** 0 (no pair kerning; Hanken)
- **Source:** log 63
- **Note:** Typed amount digits and the Withdraw morph lose the old pair offsets.

### G-007 · Peso sign
*Demo:* `PS.Peso, PS.Amount` — ₱ · glyph source · ★ owner

- **Before:** ₱ from the number font (Reddit Sans)
- **After:** Hanken Grotesk's own ₱ at every size (no second font)
- **Source:** decisions-11-24 #1; BRIEF 10 (2026-11-20); CHANGES '₱: Hanken's own'

### G-008 · Hyphenated words
*Demo:* `app copy (35 words), PS.CouponTicket/Option labels, fx.js, home.js` — bank-level, SEC-licensed, e-wallet, first-payment, in-app, 10-digit, one-time, Wack-Wack · line breaking (hyphen character) · ★ owner

- **Before:** U+002D hyphen (line may break after it)
- **After:** U+2011 non-breaking hyphen (Hanken has it); no line ends on a hyphen
- **Source:** decisions-11-24 #2; log 63
- **Note:** Text characters change but the wording does not; listed here because the owner asked for it as a visual (line-break) fix.

### G-009 · Text styles added
*Demo:* `ps-ui.css :root / .ps-t-label-xs` — type scale · new styles · ★ owner

- **Before:** —
- **After:** Label/xs 11/14 600 (.ps-t-label-xs); --ps-weight-light 300 (Body/lg-light); Figma: Body/sm 12/16 400, Body/xs 11/14 400 + 18 legacy-weight twins
- **Source:** BRIEF 33; figma-lib 38; log 57, 61
- **Note:** Figma 'legacy-weight twin' styles exist only in Figma.

### G-010 · Header bar veil (primary pages)
*Demo:* `PS.TopBar / .ps-pb--top, withdraw .ps-home-top` — header gradient · background

- **Before:** --gradient-top-nav-filled: mist #F0F5F4 80 % → 40 % (70 %) → 0 %
- **After:** --gradient-nav-top: rgb(240 245 244) 80 % → 40 % (70 %) → 0 % — same look, token renamed
- **Source:** log 43 (Gradient/Nav-top); diff
- **Note:** No visual change in code; listed so the rename is not mistaken for a change.

### G-011 · Bottom bar veils
*Demo:* `PS.BottomBar, PS.Navigator, page-sheet foot, Withdraw bottom` — bottom gradients · background

- **Before:** --gradient-bottom-primary-nav-filled (white 0/60/80 %), --gradient-bottom-secondary-nav-filled (mist 0/60/80 %)
- **After:** --gradient-nav-bottom (white 0/60/80 %), --gradient-nav-bottom-mist (mist 0/60/80 %) — same look
- **Source:** log 43; diff
- **Note:** No visual change (rename).

### G-012 · Glass buttons' blur on primary headers
*Demo:* `PS.TopBar (Home / Payment / Account), .ps-glass` — Help / Inbox / title glass pills · backdrop-filter · ★ owner

- **Before:** blur(5px) (--blur-backdrop-bg / 2)
- **After:** blur(5px) — unchanged (removed on 2026-11-23, restored 2026-11-24)
- **Source:** log 59, 68 · Figma 11036:1355 (TopBar)
- **Note:** Net: no change vs pre-rebrand. Figma: Blur/Glass back on TopBar Right ×2, Title pill ×4, Inbox ×2, Help ×2; Figma's 14 screen Header frames lost their (Figma-only) background blur (log 57).
- **Superseded:** log 59 (no blur on primary headers) superseded by log 68

### G-013 · Glass effect shadow
*Demo:* `--blur-glass-shadow (.ps-glass, .ps-tabs--glass, .ps-bubble)` — glass shadow · box-shadow

- **Before:** --blur-glass-nav-effect-shadow 0 0 12 navy 8 % + 0 0 2 navy 16 %; bubble used the focus variant 0 4 12 + 0 0 2
- **After:** --blur-glass-shadow 0 0 12 navy 8 % + 0 0 2 navy 16 % (bubble now the same, y offset 4 → 0)
- **Source:** diff
- **Note:** Only the tooltip/bubble shadow actually moves (y 4 → 0).

### G-014 · Bottom distance: BottomBar
*Demo:* `PS.BottomBar (.ps-bot)` — bar height / button distance from bottom · min-height, padding-bottom · ★ owner

- **Before:** min-height 108 (6.75rem); padding-bottom 20 (--spacing-padding-xl) → button 28 from the bottom
- **After:** min-height 96 (6rem); padding-bottom 16 (--spacing-padding-lg) → button 16 from the bottom; + --sb on iOS edge
- **Source:** log 65 · Figma BottomBar 5 variants (96 / 144 / 136)
- **Note:** Android values; production adds env(safe-area-inset-bottom).

### G-015 · Bottom distance: note bar / consent bar
*Demo:* `PS.BottomBar{note}, .ps-bot--consent` — bottom padding · padding-bottom · ★ owner

- **Before:** 28 (1.25rem + 0.5rem)
- **After:** 16 (--spacing-padding-lg)
- **Source:** log 65

### G-016 · Bottom distance: Navigator
*Demo:* `PS.Navigator (.ps-nav)` — tab bar bottom padding · padding-bottom · ★ owner

- **Before:** 24 (--spacing-section-lg), bar 98
- **After:** 12 (--spacing-padding-md), bar 86
- **Source:** log 65 · Figma Navigator 3 variants

### G-017 · Bottom distance: PayDock
*Demo:* `PS.PayDock (.ps-paydock)` — dock height · height · ★ owner

- **Before:** 162 (10.125rem)
- **After:** 150 (9.375rem) (Figma 146)
- **Source:** log 65

### G-018 · Bottom distance: plain sheet
*Demo:* `PS.Sheet kind plain (.ps-sheet--plain)` — bottom padding · padding-bottom · ★ owner

- **Before:** 32 (--spacing-page-bottom-md); iOS sb + 20
- **After:** 16 (--spacing-padding-lg); iOS sb + 16
- **Source:** log 65 · Figma Sheet Plain
- **Note:** Also the choice sheet.

### G-019 · Bottom distance: page sheet foot
*Demo:* `PS.Sheet kind page (.ps-sheet__foot)` — foot bottom padding · padding-bottom · ★ owner

- **Before:** 24 (--spacing-page-bottom-sm); iOS sb + 20
- **After:** 16; iOS sb + 16
- **Source:** log 65 · Figma Sheet Page foot (Content 516 → 524)

### G-020 · Bottom distance: card sheet
*Demo:* `PS.Sheet kind card (.ps-sheet--card)` — sheet distance from the bottom · bottom · ★ owner

- **Before:** 16 (--spacing-section-sm) (its button 32 from the bottom)
- **After:** 8 (--spacing-gap-sm) (its button 24 from the bottom)
- **Source:** log 65

### G-021 · Bottom distance: amount entry
*Demo:* `PS.AmountEntry (.ps-aentry)` — bottom padding · padding-bottom · ★ owner

- **Before:** 32 (2rem); iOS sb + 20
- **After:** 16; iOS sb + 16
- **Source:** log 65

### G-022 · Bottom distance: Withdraw order Confirm bar
*Demo:* `withdraw.js confirm bar, withdraw-host.js page length` — bar height / button distance · height, padding-bottom · ★ owner

- **Before:** bar 108, padding-bottom 20 (iOS sb + 24)
- **After:** bar 96, padding-bottom 16 (iOS sb + 20); host page length uses 96
- **Source:** log 65
- **Note:** Keypads unchanged.

### G-023 · Sheet scrim (gradient)
*Demo:* `PS.Sheet / PS.Popover (.ps-scrim, --ps-scrim)` — scrim behind sheets and popovers · background · ★ owner

- **Before:** linear-gradient black rgba(0,0,0,0) → rgba(0,0,0,0.2)
- **After:** --gradient-scrim: navy rgb(0 1 40) 0 % → 32 % (at 28 %) → 56 %
- **Source:** BRIEF 14; log 43 (Gradient/Scrim) · Figma Scrim Type=Gradient
- **Note:** No blur. Clear at the top because secondary pages have a native nav bar.

### G-024 · Page-sheet scrim (flat)
*Demo:* `PS.Sheet kind page (.ps-scrim--flat)` — scrim behind full-page sheets (coupon picker, method picker, bank list, city search) · background · ★ owner

- **Before:** none (page sheets had no scrim)
- **After:** --overlay-scrim navy rgb(0 1 40 / 0.4), flat
- **Source:** log 68 · Figma Scrim Type=Flat
- **Note:** Only the header strip shows above a page sheet, where the gradient scrim would be clear.
- **Superseded:** BRIEF 19 said page sheets take the gradient scrim; log 68 settles Flat

### G-025 · Toast position
*Demo:* `PS.Toasts / PS.Toast (.ps-toast, .ps-toasts)` — toast top · top · ★ owner

- **Before:** 40px + 4rem = 104 design px (+ --e on iOS edge)
- **After:** 40px + 4.75rem + 0.5rem = 124 design px: 8 under the 116 top nav bar, on every page (+ --e on iOS 26)
- **Source:** log 53, 69; decisions-11-24 #22 · Figma 11160:11563 (only Figma toast, moved to y 124)
- **Note:** Fixed place; tabs under a secondary page's bar stay under the toast.
- **Superseded:** log 68 (toast measured under the header's tabs) withdrawn by log 69

### G-026 · Toast shadow
*Demo:* `PS.Toast` — toast shadow · box-shadow

- **Before:** --shadow-focus 0 8 32 navy 12 % + 0 0 4 navy 16 %
- **After:** --elevation-3 (same value)
- **Source:** diff
- **Note:** No visual change (rename).

### G-027 · Loader centring
*Demo:* `PS.Loader (.ps-loader > .ps-dots)` — coin + dots group · margin-bottom · ★ owner

- **Before:** dots box ends 8 px below the drawing → group ~4 px high
- **After:** margin-bottom −0.5rem (−8): visible group centred (400.5 on an 800 screen); iOS 26 edge: padding-bottom var(--sb)
- **Source:** log 68, 69

### G-028 · Order submit / Loan submitting position
*Demo:* `PS.OrderSubmit (.ps-stage__text, .ps-osub)` — coin + message group · height, padding-bottom · ★ owner

- **Before:** text box 1.75rem (one line; a 2-line message pushed the group); centred on the coin + first line
- **After:** text box always 3.5rem (two lines, text from the top); .ps-osub padding-bottom 3rem (+ --sb on iOS 26) → group 24 above the middle: coin 306–378, text 390–446 on 360 × 800; nothing moves while lines change
- **Source:** log 68, 70
- **Superseded:** log 68 (coin/text glide when a line wraps) removed by log 70

### G-029 · Splash background
*Demo:* `PS.Splash (.ps-splash)` — splash screen ground · background · ★ owner

- **Before:** #EAF2F0 (page-heavy mist)
- **After:** --bg-brand #000128 (navy); html/body/.ps-frame navy while it shows (no light band on iOS 26 edge)
- **Source:** CHANGES 2026-11-21 A-list ('navy splash'); log 71 · Figma 11051:16 (Register / Opening)

### G-030 · Credit limit intro page edge
*Demo:* `PS.CreditLimitIntro (html.ps-climit-on)` — page behind the dark screen · background · ★ owner

- **Before:** page colour #F0F5F4 (light band at the top on iOS 26)
- **After:** #0D1620 (the screen's own dark colour) while it shows
- **Source:** log 58
- **Note:** Visible only on iPhone; not checked on a device.

### G-031 · Spinning coin colours
*Demo:* `PS.Coin (Loader, Order submit) — rebrand/animations/coins-loading` — coin body / highlight / face · fill · ★ owner

- **Before:** body #2B74BD, highlight #78AAE2, face #F6F9F8 (legacy blue coin)
- **After:** body #298648 (Green/700 = fg/accent), highlight #5CD680 (Green/500), face #F6F9F8 unchanged
- **Source:** log 66
- **Note:** feedback.js now loads rebrand/animations/coins-loading/. preview.png not regenerated.
- **Superseded:** CHANGES 2026-11-19 / BRIEF 12 (body #5CD680, highlight #99E8AB) superseded by log 66

### G-032 · Loading dots colour
*Demo:* `PS.Dots (assets/lottie/loading-dots.json)` — 4 dot fills · fill · ★ owner

- **Before:** #2C74BE
- **After:** #298648 (same as the coin body); fading dots the same colour at lower opacity
- **Source:** log 66
- **Note:** Motion unchanged.
- **Superseded:** CHANGES 2026-11-20 / BRIEF 12 third exception (#5CD680) superseded by log 66

### G-033 · Focus ring
*Demo:* `all (:focus-visible), Field / FormField focus` — keyboard focus outline · outline colour · ★ owner

- **Before:** 2 px #3FA0F0 (--color-stroke-brand-default)
- **After:** 2 px --border-selected #76DC93 (Green/400)
- **Source:** BRIEF 'Focus = light green'; diff
- **Note:** BRIEF named green-500 #5CD680 (v2); v3 token border/selected resolves to green-400 #76DC93.

### G-034 · Text caret
*Demo:* `Field, AmountEntry` — caret · caret-color / background

- **Before:** #2C74BE
- **After:** --fg-accent #298648
- **Source:** diff
- **Note:** BRIEF 'Focus = light green' said every caret green-500; code uses fg/accent green-700 — check.

### G-035 · Elevation tokens
*Demo:* `--elevation-1/2/3 (were --shadow-default / -over / -focus)` — card, sheet, focus shadows · box-shadow

- **Before:** 0 4 12 navy 8 % + 0 0 2 navy 16 % / 0 −4 12 navy 6 % + 0 0 2 navy 12 % / 0 8 32 navy 12 % + 0 0 4 navy 16 %
- **After:** same values, renamed
- **Source:** log 40, 43; diff
- **Note:** Figma swapped the layer colours of Elevation/1–3 to match legacy (log 40) — no change in code. New Figma Elevation/Knob (navy 16 % blur 4 + navy 12 % y8 blur 32) for the Slider knob; code slider knob shadow unchanged.

### G-036 · Corners rule
*Demo:* `Figma components (SelectBar Plain, .MenuRow, Details containers, .BrandMark)` — card / row corners · border-radius · ★ owner

- **Before:** SelectBar Plain 0 (pressed square fill); .MenuRow 0 / 999; Details containers 0; BrandMark tile 0
- **After:** SelectBar Plain Radius/xl 24; .MenuRow Radius/full; Details Container Radius/md 16; BrandMark tile 6.34; rows with dividers stay 0
- **Source:** log 44, 46; BRIEF 46 · Figma 11009:924, 11259:22550, 11259:22555, 11036:1187
- **Note:** Figma only; not seen in the code diff.

### G-037 · Shadowed components don't clip
*Demo:* `Figma frames / code` — shadow clipping · clipsContent / overflow · ★ owner

- **Before:** shadowed frames clipped their shadow
- **After:** no clip on an element that carries a shadow (shadow moves to an outer wrapper)
- **Source:** BRIEF 40; figma-lib 42
- **Note:** Code example: .ps-reviews / .ps-hero no longer overflow:hidden.

### G-038 · Icon colour by token
*Demo:* `PS.Icon ICON_C (core.js) + icon SVGs to currentColor` — icon colours · color · ★ owner

- **Before:** primary #141E24, secondary #3C4850, tertiary #6A757D, placeholder #7D878E, brand #2C74BE, brand-light #3FA0F0, positive #2EAE6E
- **After:** primary #000128, secondary #3D3E5C, tertiary #61627A, placeholder #8A8A9C, brand #298648, brand-light #298648, positive #1D6334, new on-accent #000128 (icon on a green fill)
- **Source:** BRIEF 32; diff
- **Note:** Icons keep the legacy glyphs; only colour changes (see assets-changed.json).

### G-039 · Navigator active tab
*Demo:* `PS.Navigator (.ps-nav__tab[aria-current])` — active tab icon + label · color · ★ owner

- **Before:** icon always #141E24 (primary), label #141E24
- **After:** icon + label --fg-accent #298648 (inactive --fg-default #000128)
- **Source:** log 47, 57 · Figma 11037:1351 (.NavTab)
- **Superseded:** figma-lib 38 (Accent-strong)

### G-040 · Navigator pill
*Demo:* `PS.Navigator (.ps-nav__pill)` — pressed pill · background

- **Before:** #0A1219 at 8 %
- **After:** --palette-navy-950 #00011A at 8 %
- **Source:** diff

## 2. Token mapping (colours the demo uses)

Old CSS token (pre-rebrand value) → new token (v3 value). Counts = uses in `shared/ps-ui` on `main`.

| id | old token | old value | new token | new value | uses |
|---|---|---|---|---|---|
| G-041 | `--color-text-primary` | #141e24 | `--fg-default` | #000128 | 48 |
| G-042 | `--color-text-brand-default` | #2c74be | `--fg-accent` | #298648 | 33 |
| G-043 | `--color-text-secondary` | #3c4850 | `--fg-muted` | #3d3e5c | 22 |
| G-044 | `--color-text-tertiary` | #6a757d | `--fg-subtle` | #61627a | 20 |
| G-045 | `--color-text-placeholder` | #7d878e | `--fg-placeholder` | #8a8a9c | 17 |
| G-046 | `--color-text-disabled` | #97a0a6 | `--fg-disabled` | #8a8a9c | 14 |
| G-047 | `--color-stroke-subtle` | #e0e3e5 | `--border-muted` | #d6d6dd | 11 |
| G-048 | `--color-icon-brand-default` | #2c74be | `--fg-accent` | #298648 | 9 |
| G-049 | `--color-stroke-brand-default` | #3fa0f0 | `--border-selected` | #76dc93 | 8 |
| G-050 | `--color-text-positive-heavy` | #2eae6e | `--fg-success-strong` | #1d6334 | 7 |
| G-051 | `--color-surface-card-brand` | #2c74be | `--bg-brand` | #000128 | 7 |
| G-052 | `--color-surface-card-brand-subtle` | #f3f8ff | `--bg-accent-subtle` | #effbf2 | 6 |
| G-053 | `--color-text-brand-light` | #3fa0f0 | `--fg-accent` | #298648 | 6 |
| G-054 | `--color-neutral-950` | #0a1219 | `--palette-navy-950` | #00011a | 5 |
| G-055 | `--color-stroke-default` | #bac0c4 | `--border-default` | #b2b3be | 5 |
| G-056 | `--color-icon-brand-light` | #3fa0f0 | `--fg-accent` | #298648 | 5 |
| G-057 | `--color-text-link-default` | #2c74be | `--fg-link` | #298648 | 4 |
| G-058 | `--color-stroke-brand-strong` | #2c74be | `--border-accent-emphasis` | #5cd680 | 4 |
| G-059 | `--color-stroke-brand-subtle` | #c8deff | `--border-accent-muted` | #baeec9 | 4 |
| G-060 | `--color-brand-200` | #c8deff | `--palette-green-200` | #baeec9 | 4 |
| G-061 | `--color-brand-600` | #2c74be | `--palette-green-600` | #36a65b | 4 |
| G-062 | `--color-action-bg-positive-default` | #3bcb84 | `--bg-success-emphasis` | #5cd680 | 4 |
| G-063 | `--color-positive-100` | #ddf8ee | `--palette-green-100` | #daf6e2 | 3 |
| G-064 | `--color-stroke-positive-default` | #58e09a | `--border-success` | #76dc93 | 3 |
| G-065 | `--color-surface-icon-brand-default` | #2c74be | `--bg-brand` | #000128 | 3 |
| G-066 | `--color-neutral-150` | #cdd1d4 | `--palette-navy-200` | #d6d6dd | 3 |
| G-067 | `--color-neutral-50` | #f2f3f4 | `--palette-navy-50` | #f5f5f6 | 3 |
| G-068 | `--color-stroke-divider` | #e0e3e5 | `--border-muted` | #d6d6dd | 3 |
| G-069 | `--color-icon-placeholder` | #7d878e | `--fg-placeholder` | #8a8a9c | 3 |
| G-070 | `--color-action-bg-primary-default` | #2c74be | `--bg-accent-emphasis` | #5cd680 | 2 |
| G-071 | `--color-icon-primary` | #141e24 | `--fg-default` | #000128 | 2 |
| G-072 | `--color-text-brand-heavy` | #20558d | `--fg-accent-strong` | #1d6334 | 2 |
| G-073 | `--color-surface-page-heavy` | #eaf2f0 | `--bg-page-strong` | #e4ece9 | 2 |
| G-074 | `--color-icon-positive-light` | #58e09a | `--fg-accent-on-brand` | #5cd680 | 2 |
| G-075 | `--color-brand-700` | #20558d | `--palette-green-700` | #298648 | 2 |
| G-076 | `--color-brand-400` | #74b2f5 | `--palette-green-400` | #76dc93 | 2 |
| G-077 | `--color-text-positive-default` | #3bcb84 | `--fg-success` | #298648 | 2 |
| G-078 | `--color-text-link-light` | #3fa0f0 | `--fg-accent` | #298648 | 2 |
| G-079 | `--color-surface-icon-positive-default` | #3bcb84 | `--bg-success-emphasis` | #5cd680 | 2 |
| G-080 | `--color-icon-tertiary` | #6a757d | `--fg-subtle` | #61627a | 2 |
| G-081 | `--color-icon-positive-heavy` | #2eae6e | `--fg-success-strong` | #1d6334 | 2 |
| G-082 | `--color-action-bg-primary-disabled` | #e0e3e5 | `--bg-disabled` | #ebebee | 1 |
| G-083 | `--color-surface-card-positive-subtle` | #f3fcf9 | `--bg-success-subtle` | #effbf2 | 1 |
| G-084 | `--color-neutral-100` | #e0e3e5 | `--palette-navy-100` | #ebebee | 1 |
| G-085 | `--color-surface-card-muted` | #e0e3e5 | `--bg-muted` | #ebebee | 1 |
| G-086 | `--color-surface-card-positive` | #3bcb84 | `--bg-success-emphasis` | #5cd680 | 1 |
| G-087 | `--color-brand-100` | #e4f0ff | `--palette-green-100` | #daf6e2 | 1 |
| G-088 | `--color-neutral-600` | #55606a | `--palette-navy-500` | #61627a | 1 |
| G-089 | `--color-neutral-200` | #bac0c4 | `--palette-navy-300` | #b2b3be | 1 |
| G-090 | `--tag-color-neutral-stroke-default` | #cdd1d4 | `--tag-neutral-border` | #8a8a9c | 1 |
| G-091 | `--color-neutral-800` | #26323a | `--palette-navy-700` | #1f1f42 | 1 |
| G-092 | `--color-icon-secondary` | #3c4850 | `--fg-muted` | #3d3e5c | 1 |

## 3. Components

### Button / Primary
*Demo:* `PS.Button{variant:'primary'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-001 | fill + label | colour | #2C74BE / white | --button-primary-bg #5CD680 / --button-primary-fg #000128 | BRIEF 7; log 55 · Figma 10987:225 | ★ |

### Button / Primary Disabled
*Demo:* `PS.Button primary :disabled`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-002 | fill + label | colour | #E0E3E5 / label stayed white | --button-primary-bg-disabled #EBEBEE / --button-primary-fg-disabled #8A8A9C | log 55 · Figma 10987:225 |  |

- **C-002** Visible change named in log 55.

### Button / Text
*Demo:* `PS.Button{variant:'text'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-003 | label | colour | #2C74BE (brand) | --button-text-fg #000128 (navy) | log 56 · Figma 10987:225 | ★ |

- **C-003** Only primary buttons are green. Examples: Not now, Skip, Later, Don't use coupon.

- **C-003** superseded: log 55 (Text Large label green)

### Button / Secondary
*Demo:* `PS.Button{variant:'secondary'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-004 | fill / line / label | colour | (no such variant in code; single secondaries were blue-outlined in legacy Figma) | white #FFFFFF, inset 1 px --button-secondary-border #B2B3BE, label #000128 | log 54, 56 · Figma 10987:225 | ★ |

- **C-004** Outline variant merged into Secondary (log 56).

- **C-004** superseded: log 54 'bordered' renamed secondary

### Button / Neutral
*Demo:* `PS.Button{variant:'neutral'} (Confirm sheet Cancel)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-005 | Cancel next to a primary | fill / line / label | inverse white + inset 1 px #E0E3E5 + label #97A0A6 (.ps-btn--ghost) | --button-neutral-bg #EBEBEE, no line, label #000128 | BRIEF 24; decisions-11-24 #12 · Figma 10987:225 | ★ |

### Button / Plain
*Demo:* `PS.Button{variant:'plain'} (Account Log out)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-006 | Log out | fill / label | inverse: white, label #141E24 (Figma legacy: outlined) | --button-plain-bg #FFFFFF, no border, label #000128 | BRIEF 34 · Figma 10987:225 | ★ |

### Button / Inverse
*Demo:* `PS.Button{variant:'inverse'} (face camera Take again)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-007 | button on black | fill / line / label | (old 'inverse' = white fill + primary text) | no fill, inset 1 px white (--button-inverse-border), white label; pressed bg/glass-on-dark white 20 % | log 48, 49 · Figma 10987:225; 15046:22848 | ★ |

### Button / Navy
*Demo:* `PS.Button{variant:'navy'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-008 | fill / label | colour | — | --button-navy-bg #000128 / white label, no shadow / border | log 54, 73 · Figma 10987:225 | ★ |

- **C-008** Used by PaymentCard (upcoming, today) and HubCard Withdraw.

### Button / Destructive
*Demo:* `PS.Button{variant:'danger'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-009 | fill / label | colour | — | --button-destructive-bg #E00010 / white | log 54 · Figma 10987:225 | ★ |

- **C-009** PaymentCard overdue.

### Button / Secondary XS (coupon Use)
*Demo:* `PS.Button{variant:'outline'} (.ps-btn--outline)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-010 | line + label | colour, font | 1 px #2C74BE line, label #2C74BE, Section-title/md 16/22 600 | 1 px #B2B3BE line, label #000128, Label/md 14/20 600 | log 56, 58; decisions-11-24 #10 · Figma 10987:225 | ★ |

### Button / Glass
*Demo:* `PS.Button{variant:'glass'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-011 | label | font, colour | Inter 600 14/20, #141E24 | Hanken 600 14/20, #000128 | diff |  |

### Button / Soft
*Demo:* `PS.Button{variant:'soft'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-012 | fill / label | colour | #F2F3F4 / #3C4850 | --palette-navy-50 #F5F5F6 / #3D3E5C | diff |  |

### Tag / Accent Subtle outline ('Protected')
*Demo:* `PS.Tag{tone:'outline'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-013 | fill / line / label | colour | #F3F8FF / #C8DEFF / #2C74BE | --bg-accent-subtle #EFFBF2 / --border-accent-muted #BAEEC9 / --fg-accent #298648 | diff (colour rule) · Figma 10988:272 | ★ |

### Tag / soft
*Demo:* `PS.Tag{tone:'soft'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-014 | fill / label | colour | #C8DEFF / #20558D | --palette-green-200 #BAEEC9 / --fg-accent-strong #1D6334 | diff · Figma 10988:272 | ★ |

### Tag / Urgent Subtle ('Best')
*Demo:* `PS.Tag{tone:'best'} (CouponTicket, CouponOption)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-015 | fill / label | colour | #DDF8EE / #2EAE6E (green) | --bg-attention-muted #FFE6D5 / --fg-attention #FF5E00 (orange); radius 12, 4/8 padding unchanged | BRIEF 38 addendum; figma-lib 35 · Figma 13036:55898; 13049:9588 | ★ |

- **C-015** CONFLICT: figma-lib 43 (later) makes CouponPickCard 'Best' green again (Bg/Positive/Subtle + Content/Positive/Strong) and keeps orange only on CouponTicket; code uses orange in both CouponTicket and CouponOption (picker).

- **C-015** superseded: figma-lib 35 'pills of the same kind follow' withdrawn by figma-lib 43

### Tag / Accent Strong ('New', '6 coupons')
*Demo:* `PS.Tag{tone:'solid'} (Menu badge)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-016 | fill / label | colour | #2C74BE / white | --tag-accent-bg-emphasis #5CD680 / --tag-accent-fg-on-emphasis #000128 | log 57; BRIEF 'New labels are green-500' · Figma 11160:12143 | ★ |

### Tag / Neutral ('Due in 45 days')
*Demo:* `PS.Tag{tone:'neutral'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-017 | fill / label / type | colour, font | soft blue tag #C8DEFF / #20558D | --tag-neutral-bg #EBEBEE / --tag-neutral-fg #3D3E5C, 11/14 600 | log 54 · Figma 10988:272 | ★ |

### Tag / Navy Strong ('Due today')
*Demo:* `PS.Tag{tone:'brand'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-018 | fill / label | colour | — | --tag-brand-bg-emphasis #000128 / white, 11/14 600 | log 54 · Figma 10988:272 | ★ |

### Tag / positive
*Demo:* `PS.Tag{tone:'positive'} (permission card)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-019 | fill / label | colour | #3BCB84 / white | --bg-success-emphasis #5CD680 / --fg-on-accent #000128 | diff |  |

### Tag / muted
*Demo:* `PS.Tag{tone:'muted'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-020 | label | colour | #7D878E | --fg-placeholder #8A8A9C | diff |  |

### Tag / Small Muted (Negative, Accent)
*Demo:* `Figma Tag Size=Small Emphasis=Muted`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-021 | fill | colour | step-200 overrides | tag/danger/bg-muted Red/200, tag/accent/bg-muted Green/200 | log 47 · Figma 15042:11297, 15042:11300 | ★ |

- **C-021** Figma only.

### Chip / positive
*Demo:* `PS.Chip (.ps-chip--positive)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-022 | fill / line / label | colour | #F3FCF9 / #58E09A / #2EAE6E | --bg-success-subtle #EFFBF2 / --border-success #76DC93 / --fg-success-strong #1D6334 | diff · Figma 10989:185 |  |

### Chip / brand
*Demo:* `PS.Chip (.ps-chip--brand)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-023 | fill / line / label | colour | #F3F8FF / #3FA0F0 / #2C74BE | --bg-accent-subtle #EFFBF2 / --border-selected #76DC93 / --fg-accent #298648 | diff · Figma 10989:185 |  |

### Chip
*Demo:* `Figma Chip (8 variants)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-024 | stroke | width | 1 | 1.5 (legacy) | log 40 · Figma 10989:185 | ★ |

- **C-024** Figma only.

### Count badge
*Demo:* `PS.Count`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-025 | badge | colour | #EAF2F0 / #3C4850; on: white / #2C74BE | --bg-page-strong #E4ECE9 / #3D3E5C; on: white / #298648 | diff |  |

- **C-025** Tabs no longer show it (see excluded.md).

### Check / On
*Demo:* `PS.Check (.ps-check--on)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-026 | fill / line / tick | colour | #2C74BE fill + border, white tick | --check-on-bg / --check-on-border #000128 (navy), --check-on-fg white | log 57 · Figma 10989:254 (Medium, Small) | ★ |

- **C-026** Installment check circles become Check Small On (navy).

- **C-026** superseded: BRIEF colour rule 'Bg/Selected green-600 + navy mark' and log 40 'Check On mark white' superseded

### Check / Off
*Demo:* `PS.Check`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-027 | ring | colour | 1.5 px #BAC0C4 (box variant: #E0E3E5 on #F0F5F4) | 1.5 px --border-default #B2B3BE (box: --border-muted #D6D6DD on --bg-inset #F0F5F4) | diff · Figma 10989:230 |  |

### Radio
*Demo:* `PS.Radio (.ps-radio)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-028 | ring / dot | colour | off ring #BAC0C4; on ring + dot #2C74BE | off ring --border-default #B2B3BE; on ring --border-accent-strong #298648, dot --fg-accent #298648 | log 47 · Figma 11156:5430 | ★ |

- **C-028** superseded: BRIEF 2 (navy controls) superseded

### Consent check
*Demo:* `PS.Consent (.ps-consent__check)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-029 | box / tick / link | colour | off #BAC0C4; on #3BCB84 + white tick; link #2C74BE | off #B2B3BE; on --bg-success-emphasis #5CD680 + navy tick (on-accent); link --fg-link #298648 | diff |  |

### Agreement mark
*Demo:* `PS.Agree (.ps-agree), Withdraw order page agree box`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-030 | halo / text / link | colour, font | halo #2C74BE; text Inter #6A757D; bold #3FA0F0; Withdraw box on #2C74BE | halo --border-accent-emphasis #5CD680; text Hanken #61627A; bold --fg-accent #298648; Withdraw box on --bg-accent-emphasis #5CD680 | diff |  |

### Segmented (E-Wallet | Online bank)
*Demo:* `PS.Segmented (.ps-seg)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-031 | track / labels | colour | track #E0E3E5; label #7D878E; on #141E24 | track --bg-muted #EBEBEE; label --fg-placeholder #8A8A9C; on --fg-default #000128 | BRIEF 2 (exception); diff · Figma 52:8395 | ★ |

### Tabs (segmented pill)
*Demo:* `PS.Tabs (.ps-tabs__pill)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-032 | selected pill / labels | colour | pill #2C74BE; on label white; off #3C4850 | pill --control-checked-bg #5CD680; on label --fg-on-accent #000128; off --fg-muted #3D3E5C | diff |  |

### Tabs / Filter (split: inbox)
*Demo:* `PS.Tabs{split}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-033 | unselected tab | fill / line / label | white, inset 1 px #C8DEFF, label #2C74BE | white, no line, label --fg-accent #298648 | decisions-11-24 #11; diff · Figma Tab Style=Filter | ★ |

### Tabs / Chip (split: credit history)
*Demo:* `PS.Tabs{split, chip}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-034 | unselected tab label | colour | #2C74BE (with #C8DEFF line) | --fg-subtle #61627A, no line | log 58; figma-lib 38 · Figma 11155:10165 | ★ |

### Tabs fade (inbox, credit history)
*Demo:* `PS.Tabs{fade}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-035 | selected pill motion | motion | pill glides on the Smooth spring | pill and labels crossfade in 150 ms (easeOut) | log 57, 58; decisions-11-24 #11 | ★ |

- **C-035** Motion value only (visual).

### Tabs / page spacing (inbox, credit history)
*Demo:* `app .app-ptabs / PS.Screen colTop`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-036 | space under the tabs | padding-bottom / column top | 20 (--spacing-padding-xl); column top 172 | 8 (--spacing-padding-sm); header extra 56 → 44; column top 160 | log 58 | ★ |

### LineTabs / PlaceTab
*Demo:* `PS.LineTabs (.ps-ltabs), PS.PlacePicker`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-037 | labels / bar | colour | label #6A757D; on #2C74BE; disabled #7D878E; bar #2C74BE | label --fg-subtle #61627A; on --fg-accent #298648; not-yet --palette-navy-200 #D6D6DD; bar --control-checked-bg #5CD680 | log 46 · Figma 11166:4420 | ★ |

- **C-037** Active tab has no fill.

- **C-037** superseded: BRIEF 30 (green-500 filled active tab, navy label) superseded by log 46

### Field
*Demo:* `PS.Field (.ps-field)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-038 | focus ring / label / value / caret / placeholder / message | colour, font | ring 1.5 px #3FA0F0; label Inter #3FA0F0; value #141E24; caret #2C74BE; placeholder #CDD1D4; msg #6A757D | ring --border-selected #76DC93; label Hanken --fg-accent #298648; value #000128; caret #298648; placeholder --palette-navy-200 #D6D6DD; msg #61627A | diff; log 41 · Figma 11009:437 |  |

- **C-038** Figma: single line, ending ellipsis, fixed height (log 41).

### FormField (application form)
*Demo:* `PS.FormField (.ps-ff)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-039 | label | font, colour, case | Inter Regular 12/16 #6A757D, UPPER CASE | Hanken Regular 12/16 --fg-subtle #61627A, UPPER CASE (kept) | decisions-11-24 #14; log 63 · Figma 52:5689 | ★ |
| C-040 | value | font, colour | Inter Regular 14/20 #141E24 | Hanken Regular 14/20 --fg-muted #3D3E5C; focused --fg-default #000128 | decisions-11-24 #14; log 63 · Figma 52:5689 | ★ |
| C-041 | focus ring / placeholder / error | colour, font | ring 1 px #3FA0F0; placeholder #7D878E; error Inter | ring 1 px --border-selected #76DC93; placeholder --palette-navy-200 #D6D6DD Regular; error Hanken #E00010 | diff |  |

- **C-039** Net vs legacy: only font + colour.

### PhoneField
*Demo:* `PS.PhoneField`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-042 | prefix / placeholder | font, colour | Inter 14/20 #7D878E | Hanken 14/20 --fg-placeholder #8A8A9C | diff; log 40 · Figma 11018:830 | ★ |

- **C-042** Figma: 328 × 56, gap 8, country pill 88, number pill 232, flag 20, Body/md 14/20, label Body/xs (legacy). Code geometry unchanged.

- **C-042** superseded: BRIEF 13 (64 tall, 16 px, gap 12) superseded by log 40 / BRIEF 44

### Mask (hidden phone digits)
*Demo:* `PS.Mask (.ps-mask)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-043 | •••••• | letter-spacing | Hanken bullets set tight (no spacing) | letter-spacing 0.16em, margin-right −0.06em | decisions-11-24 #15; log 63 | ★ |

- **C-043** Used on the code page.

### OtpBoxes
*Demo:* `PS.OtpBoxes (.ps-otp__box)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-044 | box line / digit | colour | rest 2 px #E0E3E5, digit #6A757D; filled #C8DEFF; active #3FA0F0 + digit #3FA0F0 | rest --border-muted #D6D6DD, digit #61627A; filled --border-accent-muted #BAEEC9; active --border-selected #76DC93 + digit --fg-accent #298648 | BRIEF focus light green; diff | ★ |

### ContactMethod
*Demo:* `PS.ContactMethod (.ps-contact)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-045 | label / ring | colour | #6A757D / #E0E3E5; on #3FA0F0 / #3FA0F0 | #61627A / --border-muted #D6D6DD; on --fg-accent #298648 / ring --border-selected #76DC93 | BRIEF 41a; figma-lib 40; diff · Figma 13036:55882; 11086:2673 | ★ |

- **C-045** CONFLICT: Figma (figma-lib 40) puts the selected stroke, icon and label all on green-600 (Content/Selected); code uses green-700 label + green-400 ring.

### Search
*Demo:* `PS.Search (.ps-search)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-046 | input / placeholder | font, colour | Inter 14/20 #141E24 / #7D878E | Hanken 14/20 #000128 / --fg-placeholder #8A8A9C | diff · Figma 11009:488 |  |

### Search match highlight
*Demo:* `PS.mark (PlacePicker, BankList, MethodPicker, FormField suggestions)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-047 | typed part of a result | colour | brand blue #2C74BE (where marked) | --fg-accent #298648, same weight; BankList and MethodPicker search now mark too | BRIEF 31; decisions-11-24 #24 | ★ |

- **C-047** Filtering logic of the method search is in excluded.md.

### SelectBar
*Demo:* `PS.SelectBar (.ps-selbar)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-048 | selected line / label / note / radio | colour | on line 1.5 px #3FA0F0; label #6A757D; on label #2C74BE 500; note #7D878E; on note #3FA0F0 | on line --border-accent-strong #298648; label --fg-subtle #61627A; on label --fg-accent #298648 500; note #8A8A9C; on note #298648 | log 40, 47 · Figma 11009:954 | ★ |

- **C-048** Figma: Card note box 120 centred; Logo 18 → 24 (log 44); Plain radius 24.

### Keypad key
*Demo:* `PS.Keypad (.ps-key)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-049 | digit | colour | #141E24 | --fg-default #000128 | diff |  |

### Slider
*Demo:* `PS.Slider (.ps-slider)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-050 | fill / knob | colour | fill #3FA0F0; knob #3FA0F0 | fill --bg-success #76DC93; knob centre --slider-knob-center #298648 (white ring) | log 57; BRIEF 'Slider is light green' · Figma 11063:2434; 11136:22802 | ★ |

- **C-050** Withdraw order-page slider (withdraw.js): fill #76DC93 but the knob is plain white with no inner dot — not the same as PS.Slider.

- **C-050** superseded: BRIEF slider fill + knob green-500 superseded by log 57

### Slider min/max labels (₱500 / ₱50,000)
*Demo:* `PS.Slider (.ps-slider__ends), withdraw.js order page`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-051 | labels | font, weight, colour | Inter Bold 700 12 #7D878E; boost end #2EAE6E | Hanken Bold 700 12 --fg-placeholder #8A8A9C; boost end --fg-success-strong #1D6334 | decisions-11-24 #16; log 63, 67 | ★ |

- **C-051** superseded: log 63 (Black 800 / 900) superseded by log 67 (Bold 700)

### Term chips
*Demo:* `PS.TermChips (.ps-term), withdraw.js term pills`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-052 | chip | colour, font | 1.5 px #E0E3E5, label Inter 600 #6A757D; on #F3F8FF / #C8DEFF / #2C74BE | 1.5 px --border-muted #D6D6DD, label Hanken 600 #61627A; on --bg-accent-subtle #EFFBF2 / --border-accent-muted #BAEEC9 / --fg-accent #298648 | diff |  |

### Date picker
*Demo:* `PS.DatePicker (.ps-date)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-053 | selected day / weekday / disabled / text | colour | selected #2C74BE + white day; weekday #BAC0C4; off #97A0A6; text #141E24 | selected --control-checked-bg #5CD680 + --fg-on-accent #000128; weekday --palette-navy-300 #B2B3BE; off #8A8A9C; text #000128 | diff; BRIEF 25 · Figma DateCell Selected | ★ |

- **C-053** Figma: month/year chevrons fg/accent G700 (log 46); code chevrons stay tertiary. Equal-width month/year controls (BRIEF 25).

### Wheel picker
*Demo:* `PS.Wheel (.ps-wheel)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-054 | options / highlight band | colour | opt #7D878E; band #F2F3F4; item #141E24 | opt --fg-placeholder #8A8A9C; band --palette-navy-50 #F5F5F6; item #000128 | diff |  |

### Popover / menu
*Demo:* `PS.Popover (.ps-pop__opt)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-055 | option text | font, colour | Inter 14/20 #141E24 | Hanken 14/20 #000128 | diff |  |

### Popover / menu motion
*Demo:* `PS.MT.MENU / MENU_Y / MENU_ROW / MENU_OUT (core.js), PS.Popover`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-056 | open / rows / fold | motion values | MENU spring 0.34 s bounce 0.30; MENU_Y 0.42 s bounce 0.32; rows delay 0.05 + 0.022·i, spring 0.36 s bounce 0.35, fade/blur 0.2 s; card fade 0.16 s, blur 0.24 s; fold 0.18 s; wait after pick 120 ms | MENU 0.22 s bounce 0.28; MENU_Y 0.26 s bounce 0.30; rows 0.02 + 0.014·i, spring 0.24 s bounce 0.32, fade/blur 0.12 s; card fade 0.1 s, blur 0.16 s; fold 0.12 s; wait 90 ms | log 62 | ★ |

- **C-056** Owner: menus open faster. Purely timing.

### Sheet handle
*Demo:* `PS.Sheet (.ps-sheet__grab)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-057 | drag handle | colour | #0A1219 at 20 % | --palette-navy-950 #00011A at 20 % | diff |  |

### Sheet shadow / header
*Demo:* `PS.Sheet`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-058 | sheet elevation, header gap | shadow, gap | plain sheet --shadow-over | --elevation-2 (same value); Figma: header 12 gap, scroll-linked header shadow | BRIEF 19 · Figma Sheet | ★ |

- **C-058** Code shadow value unchanged.

### Pop-up close
*Demo:* `PS.Sheet / PS.Popover close (.ps-close / GlassButton Close)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-059 | close icon | size | rebrand X wrong size | legacy Cancel-Thick 14 × 14 in the 40 × 40 glass button | BRIEF 37 · Figma .GlassButton Type=Close | ★ |

- **C-059** Demo already matched (CHANGES).

### Tooltip (with icon)
*Demo:* `PS.Tooltip{icon}`, `PS.Tooltip{icon} / APP.tipAt`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-060 | leading icon | shape, colour | 28 px brand tile #2C74BE radius 8 + white 20 px icon ('clock') | bare 20 px icon, --fg-default #000128 (Figma Icon / Pending glyph) | decisions-11-24 #21; diff · Figma Tooltip Simple 10991:475 | ★ |
| C-061 | close × | size, colour | 12 px close-thin, brand blue | 18 px close-thin in a 16 box, --fg-placeholder #8A8A9C (Palette/Navy/400) | decisions-11-24 #21 · Figma 10991:475 | ★ |
| C-062 | row alignment | align-items | center | flex-start (top-aligned), gap 12 | decisions-11-24 #21 · Figma 10991:475 | ★ |

### Tooltip / Light (glass bubble)
*Demo:* `PS.Tooltip{tone:'light'} (.ps-bubble)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-063 | bubble | fill / shadow / blur | white 80 %, shadow 0 4 12 + 0 0 2, blur 10 | --bg-glass white 80 %, --blur-glass-shadow 0 0 12 + 0 0 2, --blur-glass blur(10px); text #000128 | BRIEF 21, 35 · Figma 10991:475 | ★ |

- **C-063** Dark tooltip on light backgrounds unchanged.

- **C-063** superseded: BRIEF 6 'tooltips are dark, never white' narrowed by BRIEF 21/35

### CreditCard (home)
*Demo:* `PS.CreditCard (.ps-credit), APP.WdHero / withdraw.js home card`, `PS.CreditCard (.ps-credit__cta), withdraw.js Withdraw`, `PS.CreditCard, withdraw.js`, `withdraw.js home card`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-064 | card ground | background | #2C74BE | --bg-brand #000128 flat | BRIEF 8; diff · Figma 11093:2768 | ★ |
| C-065 | progress track | background | navy rgba(0,1,40,0.3) (invisible on navy) | --bg-glass-on-dark white 20 % | log 53 · Figma 11093:2768; 11134:12940 | ★ |
| C-066 | Total credit legend dot | background | rgba(0,1,40,0.3) (navy on navy, vanished) | --bg-glass-on-dark white 20 % (the track's colour) | decisions-11-24 #4; log 63 | ★ |
| C-067 | temporary credit dot + bar segment | colour | #58E09A | --fg-accent-on-brand #5CD680 | log 53 |  |
| C-068 | Withdraw button | variant | shade glass: navy 30 % fill, white label 16/22 600 | green primary --bg-accent-emphasis #5CD680, label --fg-on-accent #000128, 46 high, Section-title/md 16/22 600; the 'unavailable' open state keeps the navy 30 % fill | CHANGES 2026-11-21 A-list; diff · Figma 11093:2768 | ★ |
| C-069 | label 'Available amount' / legend text / amount | font | Inter 600 11/14; Inter 400 12/16; Reddit Sans 700 | Hanken 600 11/14; Hanken 400 12/16; Hanken 700 | log 63 | ★ |

- **C-064** CONFLICT: Figma applies Gradient/Brand-card (navy 50 % → navy-600 100 %) to CreditCard (log 51); code is flat navy.

- **C-065** superseded: BRIEF 16 periwinkle 24 % → log 52 white 10 % → log 53 white 20 %
- **C-066** superseded: figma-lib 37 (Bg/On-brand)

### StateCard (navy banners)
*Demo:* `PS.StateCard (.ps-credit .ps-state__chat)`, `PS.StateCard (.ps-state)`, `PS.StateCard (.ps-state__btn)`, `PS.StateCard button 'Reapply now'`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-070 | Time remaining pill | background | rgba(0,1,40,0.3) (navy 30 %) | --bg-glass-on-dark white 20 % | log 73 | ★ |
| C-071 | Chat pill | background, font | shade navy 30 %, Inter 600 14/20 | --bg-glass-on-dark white 20 %, Hanken 600 14/20 | log 72 | ★ |
| C-072 | card button | variant | shade glass or white button (label #20558D) | green Primary Medium, 46 high, padding 12/20 | status.js diff; CHANGES A-list | ★ |
| C-073 | button icon | icon | money-out icon before the label | no icon | decisions-11-24 #7; log 63 | ★ |

- **C-070** On the 'Help us review your application' card.
- **C-072** decisions-11-24 #7 keeps the solid green primary.

- **C-070** superseded: BRIEF 16 periwinkle 24 %; decisions-11-24 #5 / log 63 green 16 % — superseded by log 73
- **C-071** superseded: log 63 green 16 % superseded by log 72

### PaymentCard (Next payment)
*Demo:* `PS.PaymentCard`, `PS.PaymentCard stage=overdue`, `PS.PaymentCard stage=today`, `PS.PaymentCard stage=upcoming`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-074 | amount | colour | #2C74BE | --fg-accent #298648 in every stage | log 54 · Figma 11093:2765 | ★ |
| C-075 | badge / button | variant | soft blue tag; blue primary sm button | neutral grey tag ('Due in 45 days'); navy small button, white label, no line | log 54, 73 · Figma 11093:2765 | ★ |
| C-076 | badge / button | variant | — | navy Strong tag 'Due today'; navy button | log 54 · Figma 15099:138 | ★ |
| C-077 | badge / button / notice | variant | red tag; blue primary button | red tag; Destructive red button #E00010; notice bg/danger-muted | log 54 · Figma 11093:2765 | ★ |

- **C-075** superseded: log 54 (Small Secondary/Outline white button) superseded by log 73

### Hero (home before a limit)
*Demo:* `PS.Hero`, `PS.Hero (.ps-hero__body)`, `PS.Hero (.ps-hero__stats)`, `PS.Hero (.ps-hero__top)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-078 | top block | colour, shape, type | #2C74BE, whole card clipped radius 24; label Section/sm 14/20 600; amount Number/xl 36/45 +4 % | --bg-brand #000128, top corners 24 only, gap 4, padding 16; label Label/md 14/20 600; amount Display/md-bold Hanken 700 36/36 −2 % | log 61 · Figma 11187:19927 | ★ |
| C-079 | body block | border, spacing, type | white, gap 20, tagline Section/md 16/24 600 | white, 1.5 px --border-selected #76DC93 line on sides + bottom (inside), bottom corners 24, gap 16; tagline Title/sm --fg-muted #3D3E5C (two lines) | log 61 · Figma 11187:19927 | ★ |
| C-080 | stats panel | background, type | no fill; labels Caption/xs 400 | --bg-inset #F0F5F4, Radius/sm 12; values Title/xs; labels Label/xs 11/14 600 | log 60, 61 · Figma 11187:19934 | ★ |
| C-081 | card shadow / clipping | shadow | Elevation default, overflow hidden | --elevation-1 on the whole card, nothing clipped | log 61 · Figma 11187:19927 | ★ |

- **C-078** Structure rebuild itself: see excluded.md.

### Reviews ('What customers say')
*Demo:* `PS.Review (.ps-review__by > i)`, `PS.Reviews`, `PS.Reviews (.ps-reviews__quote)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-082 | quote mark | shape, colour, position | font glyph ” Hanken 800 96/96, #F0F5F4, right 12, top −14, clipped by the card | Figma vector (assets/art/quote.svg) 48 × 42 as a mask, --palette-navy-200 #D6D6DD, right 16, top −12, not clipped | log 60; decisions-11-24 #3 · Figma 11187:19954 | ★ |
| C-083 | avatars | image, border, shadow | cut from the trust card's group picture (avatars.png), no border, bg #F3F8FF | 3 Figma photos (review-avatars.png) 28 px, 2 px white line, --elevation-1, bg #EFFBF2 | log 60 · Figma 11187:19954 | ★ |
| C-084 | review row edge | margin / padding | row runs to the card edges | row runs to the card edges (margin 0 −16, padding 0 16) — same as legacy | decisions-11-24 #3; log 63 | ★ |

- **C-084** Net: no change vs legacy.

- **C-084** superseded: log 60 (row stops at the card padding) superseded by log 63

### TrustCard
*Demo:* `PS.TrustCard (.ps-trust)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-085 | partner logo tint / SEC text | colour | #2C74BE | --fg-accent #298648 (NPC logo tint fg/accent too) | log 46; diff · Figma Trust cards | ★ |

### HomeCoupons
*Demo:* `PS.HomeCoupons`, `PS.HomeCoupons (.ps-hcoupon, .ps-hcone)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-086 | gradient ground / tab / panel | gradient | blue 700 #20558D → 600 #2C74BE → 400 #74B2F5 → 200 #C8DEFF | green 700 #298648 → 600 #36A65B → 400 #76DC93 → 200 #BAEEC9 (same stops) | BRIEF 8 (coupon gradient kept, green scale) | ★ |
| C-087 | coupon value | colour | #2C74BE | --fg-accent #298648 | diff |  |

### Strip ('You have updates')
*Demo:* `PS.Strip (.ps-strip__count)`, `PS.Strip (.ps-strip__icon)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-088 | leading icon | shape | 20 px white icon on a 28 px brand tile (#2C74BE) | bare 24 px icon, --fg-default #000128; info / support-chat use Figma Filled icons; negative tone keeps a red 28 tile | BRIEF 22; decisions-11-24 #8 · Figma Strip | ★ |
| C-089 | count badge | colour | #3BCB84 fill, white number | --bg-success-emphasis #5CD680, white number (--fg-on-emphasis) | decisions-11-24 #8; log 63 | ★ |

- **C-089** White on green-500 ≈ 1.9:1.

### OrderStatus
*Demo:* `PS.OrderStatus (.ps-ostatus)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-090 | leading icon | shape | 20 px white icon on a brand tile | bare history icon 20, --fg-default (failed: red tile + alert icon) | loan.js diff; decisions-11-24 #8 | ★ |

### Profile
*Demo:* `PS.Profile`, `PS.Profile (.ps-profile)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-091 | verified mark | icon | verified.svg after the name | removed | log 58; decisions-11-24 #13 · Figma 11200:19183 | ★ |
| C-092 | avatar ring / initials | colour | #BAC0C4 / #3C4850 | --border-default #B2B3BE / --fg-muted #3D3E5C | diff |  |

- **C-091** VerifiedBadge stays in the Figma library.

### CreditLimitCard
*Demo:* `PS.CreditLimitCard (.ps-limit__icon)`, `PS.CreditLimitCard (.ps-limit__nums)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-093 | icon tile | colour, icon | #2C74BE tile + white icon | --bg-brand #000128 28 px tile, radius 8, outlined Wallet icon in white | log 57 · Figma 11160:12104 | ★ |
| C-094 | numbers | font, colour | Reddit Sans 700 16/20 #141E24 | Hanken 700 16/20 #000128 (Number/xs) | log 63 | ★ |

- **C-093** superseded: BRIEF 22 (filled icon, no tile) superseded by log 57

### HubCard (Credit limit hub)
*Demo:* `PS.HubCard`, `PS.HubCard (.ps-hub)`, `PS.HubCard (.ps-hub__btn)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-095 | card ground / gap | background, gap | #2C74BE flat; gap 20 | linear-gradient(180deg, --bg-brand #000128 50 %, --bg-brand-muted #3D3E5C); gap 12 | log 51, 58 · Figma 11157:4389; 11159:12524 | ★ |
| C-096 | usage ring | size, colour | 20 px, r 8, 3 thick, track currentColor 30 % | 24 px, r 10.5, 3 thick, track --bg-on-brand white 10 % | log 58 · Figma 11159:11450 | ★ |
| C-097 | Used / Available block | opacity | labels at 60 % | whole block at 80 %, labels not dimmed further | log 58 | ★ |
| C-098 | Withdraw | variant | shade glass navy 30 %, Inter 600 14/20, padding 8/12 | Navy small button on --bg-on-brand white 10 %, white label, no shadow, Hanken 600 14/20, padding 8/8 | log 52, 58; decisions-11-24 #19 | ★ |

### Credit history tiles
*Demo:* `PS.Tiles (.ps-tilepic > span)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-099 | tile labels | weight | Label/sm 600 | Label/sm-bold 700 | log 58 · Figma 11159:11540 | ★ |

### ActivityItem (credit history)
*Demo:* `PS.ActivityItem`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-100 | icon tiles | colour | loan (brand) #2C74BE; repayment (positive) #3BCB84; white icons | repayment --bg-brand-muted #3D3E5C; loan --bg-success-emphasis #5CD680; white icons on both | log 58 · Figma 11157:4385; 11155:10165 | ★ |
| C-101 | amount | font, colour | Reddit Sans 700 16/22 #141E24; up #3BCB84 | Hanken 700 #000128; up --fg-success #298648 | diff |  |

- **C-100** superseded: BRIEF 28 / figma-lib 41(d) / log 40 (navy icon on green tile) superseded by log 45 + 58

### History row
*Demo:* `PS.HistRow (.ps-histrow)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-102 | amount | font | Reddit Sans 700 18/24 +3 % | Hanken 700 18/24 +3 % | log 63 |  |

### InboxItem
*Demo:* `PS.InboxItem`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-103 | meta / time / 'more' link | colour | #3C4850 / #7D878E / #2C74BE | #3D3E5C / #8A8A9C / --fg-accent #298648 | diff |  |

### LinkRow (help)
*Demo:* `PS.LinkRow{link}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-104 | link label | font, colour | Inter 14/20 #2C74BE | Hanken 14/20 --fg-accent #298648 | diff; decisions-11-24 #18 | ★ |

- **C-104** Help rows keep the legacy 14 regular size (log 63).

### Menu (account)
*Demo:* `PS.Menu`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-105 | row text / value | colour | #141E24 / #6A757D | #000128 / #61627A | diff |  |

### ScamStrip
*Demo:* `PS.ScamStrip (.ps-scamstrip)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-106 | strip | colour | #C8DEFF / #2C74BE | --bg-info-muted #E4F0FF / --fg-info-strong #173D67 (blue info scale) | log 57 · Figma 11134:22148 | ★ |

- **C-106** superseded: BRIEF 18 (mist ambient-300 #DFEEE5, navy text) superseded by log 57

### Installment
*Demo:* `PS.Installment (.ps-inst)`, `PS.Installment check`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-107 | date tile / sub | colour, font | tile #F0F5F4 / #3C4850 Inter; due-today tile #E4F0FF / #2C74BE; sub Inter #3C4850, brand #2C74BE | tile --bg-inset / --fg-muted Hanken; due-today --palette-green-100 #DAF6E2 / --fg-accent #298648; sub Hanken #3D3E5C, brand #298648 | diff |  |
| C-108 | check circle | colour | navy override (Figma) / blue | Check Small On (navy, white tick) | log 40, 57 | ★ |

### PayBar
*Demo:* `PS.PayBar (.ps-paybar__amt)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-109 | amount / strike | colour | #2C74BE / #7D878E | --fg-accent #298648 / #8A8A9C | diff |  |

### RepayCard
*Demo:* `PS.RepayCard`, `PS.RepayCard (.ps-repay__head .ps-btn--outline)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-110 | Copy pill | shape, colour, font | padding 2/8, blue line + label, weight 400 | padding 2/4, radius 8, 1 px --border-accent-strong #298648, label --fg-accent #298648, Body/lg-light Hanken 300 16/24 | log 45, 57 · Figma 11114:3890 | ★ |
| C-111 | amount / due / note | colour | #2C74BE / #141E24 / #7D878E | --fg-accent #298648 / #000128 / #8A8A9C | diff |  |

### PayTimer
*Demo:* `PS.PayTimer (.ps-paytimer)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-112 | text | text-align | center | left (Figma PayTimer) | diff |  |

### QrPanel
*Demo:* `PS.QrPanel (.ps-qr)`, `PS.QrPanel (.ps-qr__code)`, `PS.QrPanel (.ps-qr__save)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-113 | panel ground | colour | #2C74BE | --bg-brand #000128 | log 57 · Figma 11134:25180 | ★ |
| C-114 | QR picture | size | 176 × 176 inside the 208 box (blue corners showed) | fills the 208 box, radius 12 clips it | log 57 | ★ |
| C-115 | Save QR code | variant, icon | white button, blue label Inter 700, upload icon, 37 high | --bg-on-brand white 10 % + 1 px --border-on-brand white 10 %, white label Hanken 700 14/20, no icon, 38 high | log 57 | ★ |

### MethodPicker
*Demo:* `PS.MethodPicker (.ps-mpick)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-116 | category / title / rows | colour | cat #97A0A6, on #141E24 + icon #2C74BE; title #F3F8FF; rows #141E24 | cat #8A8A9C, on #000128 + icon #298648; title --bg-accent-subtle #EFFBF2; rows #000128 | diff · Figma 11113:3542 |  |

- **C-116** Figma 'Recommend' tag = Tag Accent Strong (BRIEF 19).

### Accordion (small)
*Demo:* `PS.Accordion (.ps-acc--small)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-117 | head | colour | #55606A | --palette-navy-500 #61627A | diff |  |

### AmountCard / OrderAmountCard
*Demo:* `PS.AmountCard (.ps-amountcard)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-118 | amount / pencil | colour | #2C74BE (pencil icon 'brand') | --fg-accent #298648; pencil takes the card's colour | log 57; diff | ★ |

### Loan estimate
*Demo:* `PS.EstimateCard (.ps-estimate)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-119 | amount / pencil | colour | #2C74BE | --fg-default #000128 (navy) | log 57 · Figma 11168:28856 | ★ |

### AmountEntry
*Demo:* `PS.AmountEntry (.ps-aentry)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-120 | ₱ / typed / rest / decimals / caret | colour, font | ₱ Reddit Sans #97A0A6; typed #141E24; rest/dec #97A0A6; caret #2C74BE | ₱ Hanken --fg-disabled #8A8A9C; typed #000128; rest/dec #8A8A9C; caret #298648 | diff; log 63 |  |

### Order head
*Demo:* `PS.OrderHead (.ps-ohead)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-121 | amount / label | colour | #2C74BE / #3C4850 | --fg-accent #298648 / #3D3E5C | diff |  |

### KV rows
*Demo:* `PS.KV (.ps-kv), .ps-details, .ps-insetrows, .ps-planrows`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-122 | label / value / positive | colour | #6A757D / #141E24 / #2EAE6E; details label #3C4850, positive #3BCB84 | #61627A / #000128 / #1D6334; details label #3D3E5C, positive --fg-success #298648 | diff |  |

### Plan (repayment plan)
*Demo:* `PS.Plan (.ps-plan)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-123 | rail / labels / old value | colour, font | rail #E0E3E5; labels #7D878E / #3C4850; was Inter #CDD1D4 | rail --palette-navy-100 #EBEBEE; labels #8A8A9C / #3D3E5C; was Hanken --palette-navy-200 #D6D6DD | diff |  |

### Divider
*Demo:* `PS.Divider (.ps-divider)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-124 | line | colour | #E0E3E5 | --border-muted #D6D6DD | diff |  |

### Borrower protection toggle
*Demo:* `withdraw.js Protected / Add`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-125 | pill | colour, font | on #F3F8FF fill, label rgb(44,116,190); off label rgb(106,117,125); Inter | on --bg-accent-subtle #EFFBF2, label rgb(41,134,72); off rgb(97,98,122); Hanken | diff |  |

### Withdraw order Confirm
*Demo:* `withdraw.js Confirm`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-126 | button | colour | on #2C74BE / white; off #E0E3E5 / #97A0A6 | on --bg-accent-emphasis #5CD680 / --fg-on-accent #000128; off --bg-disabled #EBEBEE / --fg-disabled #8A8A9C | diff | ★ |

### Withdraw agreement line
*Demo:* `withdraw.js agree text`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-127 | 'Loan Agreement', 'Loan Disclosure Statement' | colour | whole sentence grey #7D878E Inter 500 11/14 | document names --fg-accent #298648 (links), rest grey; Hanken | diff (Figma rebrand order page) |  |

### Withdraw amount screen back button
*Demo:* `withdraw.js back button`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-128 | glass button | fill / line / shadow / blur | white 60 %, no line, 0 0 24 navy 8 % glow, blur 10 | --bg-glass white 80 %, 1 px white line, --blur-glass-shadow, blur 5 (half --blur-backdrop-bg) | log 68 | ★ |

### Upload progress (DocCard / FileRow)
*Demo:* `PS.FileRow (.ps-file)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-129 | bar / Uploaded / Try again | colour | bar #3FA0F0; ✓ Uploaded #2EAE6E; retry icon #3FA0F0 | bar --fg-accent #298648; ✓ Uploaded --fg-success-strong #1D6334; retry --fg-accent #298648 | BRIEF 29; log 34 (figma-lib) · Figma 11168:29432 | ★ |

### DocCard add button
*Demo:* `PS.DocCard (.ps-doc__add)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-130 | dashed line / label | colour | 2 px dashed #CDD1D4; label #2C74BE | 2 px dashed --tag-neutral-border #8A8A9C; label --fg-accent #298648 | diff (token mapping) |  |

- **C-130** The dashed line is much darker than legacy (token map neutral-150 stroke → tag/neutral/border). Possibly unintended — check.

### UploadTile
*Demo:* `PS.UploadTile (.ps-upload)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-131 | dashed line / done line / veil icon | colour | #BAC0C4 / #58E09A / #2C74BE | --border-default #B2B3BE / --border-success #76DC93 / --fg-accent #298648 | diff |  |

### ID side
*Demo:* `PS.IdSide (.ps-idside)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-132 | dashed box / done ring / tick | colour | #E0E3E5 / #58E09A / #3BCB84 + white tick | --border-muted #D6D6DD / --border-success #76DC93 / --bg-success-emphasis #5CD680 + navy tick (on-accent) | diff |  |

### Camera side label
*Demo:* `PS.Camera (.ps-cam__side)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-133 | label | colour | #3FA0F0 | --fg-accent #298648 | diff |  |

### Selfie ring
*Demo:* `PS.Selfie (.ps-selfie)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-134 | ring / dashed ring / state | colour | ring #CDD1D4; checking #F2F3F4; dash #3FA0F0; brand state #3FA0F0 | ring --palette-navy-200 #D6D6DD; checking --palette-navy-50 #F5F5F6; dash --border-selected #76DC93; brand state --fg-accent #298648 | diff; BRIEF 29 · Figma 11168:21869 | ★ |

- **C-134** BRIEF 29 asked for a dark-green upload ring; code dash is light green #76DC93 — check.

### Face camera
*Demo:* `PS.FaceCamera (.ps-face)`, `PS.FaceCamera buttons`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-135 | ground / oval | colour | #0A1219 / #0A1219 | --palette-base-black #000000 / --palette-navy-950 #00011A | CHANGES 2026-11-21 A-list; log 48 · Figma 11203:17058; 11203:17105 | ★ |
| C-136 | Take again / Next | variant | Take again: shade white 20 %; Next: white (old inverse) | Take again: Inverse (no fill, white line + label); Next: green Primary | log 48, 49 · Figma 11203:17105; 15046:22848 | ★ |

### Glass buttons on black screens
*Demo:* `Figma .GlassButton (camera, Confirm your identity, Mobile phone change)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-137 | fill | colour | solid white / white 10 % (legacy) | bg/glass-on-dark white 20 % | log 46, 48 | ★ |

- **C-137** Figma; code camera back buttons not in diff.

### PermissionCard
*Demo:* `Figma PermissionCard (11086:2666)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-138 | icon tile | shape, colour | (BRIEF 22: filled icon, no tile) | 28 px tile Radius/xs 8, bg/brand navy 900, outline icon in white (legacy look) | log 46, 50 · Figma 11086:2666; 15038:5194 | ★ |

- **C-138** Code .ps-tile is navy now; card unchanged otherwise.

- **C-138** superseded: BRIEF 22 superseded for PermissionCard

### ChoiceButton / choice card
*Demo:* `PS.Choice (.ps-choice)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-139 | card line | colour | #E0E3E5 | --border-muted #D6D6DD | diff |  |

### Protect tips picture
*Demo:* `PS.PTips (.ps-ptips__pic)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-140 | placeholder ground | colour | #26323A | --palette-navy-700 #1F1F42 | diff |  |

### Status notice
*Demo:* `PS.Status (.ps-status--info / --neutral)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-141 | info / neutral | colour | info #F3F8FF / #2C74BE; neutral text #6A757D | info --bg-accent-subtle #EFFBF2 / --fg-accent #298648; neutral #61627A | diff |  |

- **C-141** Info notices in the blue scale apply to ScamStrip (log 57); PS.Status info stays green.

### Tile
*Demo:* `PS.Tile (.ps-tile)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-142 | icon tile | colour | #2C74BE; positive #3BCB84 | --bg-brand #000128; positive --bg-success-emphasis #5CD680 | diff |  |

### Vote chips (help article)
*Demo:* `PS.Vote (.ps-vote__chip)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-143 | selected chip | colour | #2C74BE / white | --bg-accent-emphasis #5CD680 / --fg-on-accent #000128 | diff |  |

### GuestPay (Payment, logged out)
*Demo:* `PS.GuestPay (.ps-guestpay)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-144 | picture / title / line / spacing | illustration, colour, spacing | no picture; title tertiary #6A757D; line placeholder #7D878E; gap 20, top padding 20 | empty-box animation 80 (EmptyState Action=On); title --fg-default; line --fg-subtle; gap 16; picture where a full-page empty state sits; button 20 under the text | log 45, 47 · Figma 11109:9756; 15043:22768 | ★ |

### Screen tint
*Demo:* `PS.Screen (.ps-screen__tint)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-145 | top tint gradient | colour | #DDF8EE → transparent | --palette-green-100 #DAF6E2 → transparent | diff |  |

### Brand mark / logo
*Demo:* `PS.Brand (.ps-brand__name), withdraw perasure-logo.svg`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-146 | wordmark text | colour | #141E24 | #000128 | diff |  |

### CouponTicket
*Demo:* `PS.CouponTicket`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-147 | selected bar / value / sub / meta / status | colour | bar #2C74BE; value #141E24; sub #2C74BE; meta #6A757D; status #97A0A6 | bar --fg-accent #298648; value #000128; sub --fg-accent-strong #1D6334; meta #61627A; status #8A8A9C | diff · Figma 11046:2168 |  |

### CouponTicket Used = Expired
*Demo:* `PS.CouponTicket{state:'used'}`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-148 | texts | colour | value #6A757D, sub #6A757D, meta #97A0A6; Used label green | value --fg-subtle #61627A; sub + meta --fg-disabled #8A8A9C; same grey as Expired, only the word differs | log 49, 58 · Figma 11046:2168 | ★ |

- **C-148** superseded: figma-lib 38/40 (Used texts Accent-strong, white ticket) superseded

### CouponOption (coupon picker)
*Demo:* `PS.CouponOption`, `PS.CouponOption (.ps-copt__card::after)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-149 | selected line | colour | 1 px #2C74BE | 1 px --check-on-border #000128 (navy, the tick's colour) | log 74 · Figma 11314:9983; 11273:30212 | ★ |
| C-150 | value / label / off | font, colour | Inter 600 16/24 #141E24; label #6A757D; off #97A0A6 | Hanken 600 16/24 #000128; label #61627A; off #8A8A9C | diff |  |

- **C-149** superseded: Figma border/accent-emphasis (green) superseded

### CouponPickCard countdown
*Demo:* `Figma CouponPickCard`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-151 | countdown row | fill / stroke | legacy #FFF4EE / #FFE9DD + #FFA06C | Selected: Orange 50, no stroke; Unavailable: Orange 100 + Orange 300 1 px; text Content/Urgent #FF5E00 | log 40; BRIEF 38 · Figma 11314:9986 | ★ |

- **C-151** Figma only (code countdown colour #FF5E00 unchanged).

### Coupon row (order page)
*Demo:* `PS.CouponRow (.ps-crow)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-152 | sub line | colour | #6A757D; on #2EAE6E | #61627A; on --fg-success-strong #1D6334 | diff |  |

### Coupon illustrations (small)
*Demo:* `PS.CouponArt (coupon-*-sm.svg)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-153 | green badge | fill | #3BCB84 | #5CD680 | assets diff |  |

- **C-153** See assets-changed.json.

### CouponPayCard tags
*Demo:* `Figma CouponPayCard`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-154 | both tags | colour | left Surface/Positive/Subtle + Border/Positive | both: Surface/Brand/Subtle + Border/Selected + Content/Accent-strong (the 'New limit' style) | BRIEF 41c; figma-lib 41 · Figma 11273:4945; 13036:56096 | ★ |

- **C-154** Figma only.

### LoanStateCard
*Demo:* `Figma LoanStateCard`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-155 | status icons | colour | tiles | Reviewing icon Content/Primary; Withdrawal method white on red tile; state cards keep their coloured tile | log 40; BRIEF 39 · Figma 11263:25900 | ★ |

- **C-155** Figma only.

### Legal / foot / bullets / labels
*Demo:* `PS.Legal, .ps-foot, .ps-bullets, .ps-seclabel, .ps-section__label`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-156 | grey texts | colour, font | #97A0A6 / #6A757D (Inter) | --fg-disabled #8A8A9C / --fg-subtle #61627A (Hanken) | diff |  |

### ID camera layout
*Demo:* `PS.IdCamera (.ps-cam__view / __land / __box)`

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| C-157 | box / side title / hint | position, size | fixed box 259 × 382 (Figma) / 21 rem frame 9 rem down (demo); hint over two lines | ID-1 box (1 : 1.585) as big as fits, centred between the back button and the shutter (24 each); side title and one-line hint 4 from it, all turned 90° clockwise — layout after CashSaya's ID camera, PeraSure look kept. Native screen in production: `08-native/` N-001 · Figma 11163:17229, 11163:17306 | log 84 | ★ |

## 4. Pages

| id | element | property | before | after | source | ★ |
|---|---|---|---|---|---|---|
| P-001 | space under the tabs | padding / column top | 20 under the tabs; column top 172 | 8 under the tabs; column top 160 | log 58 | ★ |
| P-002 | no green translucent fills left on navy cards | background | timer / Chat on navy 30 % | both white 20 % | log 72, 73 | ★ |
| P-003 | empty state | illustration | text block only | EmptyState Action=On: empty-box art + title + body + 'Sign up or Log in' | log 47 · Figma 11109:9756 | ★ |

- **P-001** Same as the Tabs spacing row.
