> **Superseded (2026-11-24):** use `rebrand/handoff/ai/` (README.md there) — this file was written for tokens v2 against phi_h5_025 32268e1.

# PeraSure rebrand: developer handoff for phi_h5_025 (tokens v2)

This is for the developers of `phi_h5_025` (React + TS + Vite). Nothing in `phi_h5_025` has been changed by the design side.
Paths are relative to the repo root unless they start with `rebrand/`, which means `Perasure/rebrand/` in the design repo.
Written 2026-11-19 against `phi_h5_025` master `32268e1`.

## What is changing

The Brand Bible replaces the app's blue with the logo colours. **Every legacy blue becomes the green at the same step** (blue-600 →
green-600 `#5CD680`, blue-500 → green-500 `#72EB94` …). Neutrals and red stay, text keeps its neutral, white labels stay white (except the primary button's, which is navy as in the Brand Bible), and navy
`#000128` is only for dark brand surfaces (owner's colour rule, 2026-11-20; table in Phase 2). One typeface, **Hanken Grotesk**, is used for everything, amounts included. At the same time the tokens
move to **v2**, a cleaner, role-based system (`rebrand/tokens/ARCHITECTURE.md`):

| | old | v2 |
|---|---|---|
| text and icons | `--color-text-primary`, `--color-icon-primary` | `--content-primary` |
| brand text and icons (legacy blue) | `--color-text-brand-light` / `-default`, `--color-text-link-*`, `--color-icon-brand-*`, `--color-action-text-link` | `--content-accent-strong` (green-700 `#44A05F`: green text is one tier darker); `-heavy` → `--content-accent-heavy` (green-800 `#327545`) |
| containers | `--color-surface-card-default`, `--color-surface-card-brand-subtle` (blue-50) | `--surface-default`, `--surface-brand-subtle` (green-50) |
| fills | `--color-action-bg-primary-default` (blue-600) | `--bg-action` (green-600), with `--content-on-action` (navy) for text on it |
| lines | `--color-stroke-default`, `--color-action-stroke-active` | `--border-default`, `--border-selected` |
| spacing, radius | `--spacing-gap-sm`, `--radius-full` | **unchanged names** |
| text styles | 37 styles, e.g. `--section-title-sm-font-size` | **21 styles**: most names kept (`--body-md-font-size`), the old weight twins merged (`--label-md-font-size`); Figma adds 14 legacy-weight twins, which in code are a base style plus its `font-weight` (§2d) |

The full old → new table is in **`rebrand/tokens/v2/MAPPING.md`** (machine-readable: `v2/rename-map.json`).

The migration is built so that **day one needs no code changes**: a legacy alias file keeps every old name working. You then fix the
hard-coded colours by hand, run a codemod that renames the rest, and delete the aliases.

| Phase | What | Effort |
|---|---|---|
| **1 · Drop-in** | New token JSON, regenerate the CSS, import `legacy-aliases.css`, a 2-line change in the import script, a 3-line opacity fix in the CSS builder | **~0.5 day** incl. a smoke test |
| **2 · Hand fixes** | Hard-coded blues (SVG, raw values, canvas) → the same green step, two owner shape decisions, font literals → Hanken Grotesk (one typeface, lean type set) | **~1 day** + visual QA |
| **3 · Codemod** | `migrate-tokens.mjs` renames 1,762 old token uses in 117 files; a fallback refresh | **~0.5 day** incl. review |
| **4 · Clean-up** | Delete `legacy-aliases.css` | **minutes** |

### Look parity: only the colours change (owner, 2026-11-20)

The rebrand must look exactly like the current app with only the colours changed. **Every text and icon keeps its current level.** When
you fix a rule, keep the level it has today and swap only the variable: primary text stays primary, tertiary stays tertiary, a brand-blue
title stays a brand-level title (now its green step), a link stays a link. Don't promote, demote or merge levels, and don't change sizes, spacing
or layout on the way.

The colour itself follows the step rule (Phase 2): a legacy blue N becomes green N, neutral and red keep their value, a legacy green N
becomes the v2 green N, and navy is only for dark brand surfaces. The aliases (§1.2) and the codemod (phase 3) apply it; the phase 2 hand
fixes apply it to the code that bypasses tokens.

**Everything else is colour-only.** Three owner decisions are the only exceptions, where a fix changes more than a colour. Keep them as
they are:

- **Owner decision 1** (BRIEF 30): the active place tab in the address picker is a green pill with a dark label; its underline goes (§2l).
- **Owner decision 2** (segmented controls, amended 2026-11-20): grey track `--bg-neutral`, white thumb `--surface-default`, selected label
  `--content-primary`, the others `--content-tertiary` (§2b, Inbox and credit history tabs).
- **Owner decision 3** (the lean type set, approved 2026-11-19): 37 styles become 21, Hanken Grotesk only, captions 400 → 500. `body-sm` /
  `body-xs` (2026-11-20) bring back legacy's regular 12 / 11 px for hints and legal lines (§2d).

These labels are not the open decisions in §6.

**Contrast (measured).** The green scale is anchored on the Brand Bible green `#5CD680` at step 600 (`tokens/v2/green-scale.py`).
Green text and icons on light backgrounds are green-700 `#44A05F`: **3.3:1 on white** (3.0:1 on the page background `#F0F5F4`), so they pass
WCAG AA only for large or bold text (24 px, or 18.7 px bold). This is the owner's pick (2026-11-20) and a phase-2 check: list the small green
text you see (links, hints, the tip numbers, the "Uploaded" labels) and report it; don't change the colour. Heavy and pressed text (green-800
`#327545`) is 5.6:1 and passes. The primary button's navy label on green-600 is 11:1. Green text on navy (green-500) is 13.6:1. What stays
low is white on a green-600 fill (1.8:1: the green cards and the term badge), where legacy white labels stay white by the owner's rule.

### The current version stays until the switch (owner, 2026-11-20)

The pre-rebrand app is kept as it is. The rebrand is built next to it, never on top of it:

- **Own branch.** Do all four phases on a branch `rebrand`, cut from master. Master, and every build made from it, keeps today's look.
  **The branch is not merged into master without the owner's go-ahead.** Ask for it through the design side, not on your own after
  QA passes.
- **Old token values saved.** As the first commit on the branch, before phase 1, keep today's token files next to the new ones:

  ```bash
  mkdir -p tokens/legacy/pre-rebrand
  cp tokens/figma-tokens.json      tokens/legacy/pre-rebrand/figma-tokens.json
  cp src/styles/figma-tokens.css   tokens/legacy/pre-rebrand/figma-tokens.css
  ```

  These are the exact values the app shows today. They are not imported anywhere. They stay as the reference for "before", and do not
  delete them in phase 4. While only phase 1 is in, you can go back to today's look on the branch: copy the saved JSON back to
  `tokens/figma-tokens.json`, run `npm run figma:tokens`, and remove the `legacy-aliases.css` import. After phases 2–3 have changed code,
  the current look is master.
- **What the aliases do and don't do.** `legacy-aliases.css` (1.2) keeps every **old name** working, but at its **new** value. It stops the
  code from breaking during the move; it does not keep the old look. The old look is master plus `tokens/legacy/pre-rebrand/`.
- **Figma keeps it too.** The old variable collections stay in the Figma file as "Legacy · …" with their values. The changed import script
  (1.3) reads only the new collections, so those folders are ignored.

---

## Phase 1 · Drop-in (~0.5 day)

### 1.1 Replace the token JSON and regenerate

```bash
cp <design-repo>/Perasure/rebrand/tokens/v2/figma-tokens.json tokens/figma-tokens.json
npm run figma:tokens            # → src/styles/figma-tokens.css
cp <design-repo>/Perasure/rebrand/tokens/v2/legacy-aliases.css src/styles/legacy-aliases.css
```

The new JSON has the same format as today. Its collections are now `Primitive/Light`, `Semantic/Light` and `Component/Light` (the
previous ones were `…/Mode 1`). Your `scripts/figma_tokens_to_css.py` reads it unchanged. We ran a copy of your script on the current v2
JSON (current version): **657 variables** (today: 690). This matches `v2/dev-figma-tokens.css`. It includes the full 50–950 green, navy and ambient palettes (the green steps are the targets of the step rule), the same-step greens `--content-accent` / `-strong` / `-heavy`, `--surface-positive-subtle`, `--border-accent-faint` / `-subtle` and `--bg-positive-strong-pressed`, the navy-surface fills `--bg-on-brand` / `--border-on-brand` (§2h), `--surface-tint` and `--bg-brand-muted` (kept for new UI), the small regular text styles `--body-sm-*` / `--body-xs-*` (§2d), the orange scale `--palette-orange-50…950`, `--content-urgent` and `--bg-urgent-subtle` (§2m), the Amount styles at weight 700 (§2d), the navy scrim stops `--overlay-scrim-top / -mid / -bottom` and the coupon stops `--coupon-gradient-*`. The composite gradients that use them (`--gradient-scrim`, `--gradient-coupon`, `-panel`, `-tab`) are defined in the demo's `v2/tokens.css`. `src/` does not use them today; copy them from there when a screen needs them.

### 1.2 Import the aliases after the generated CSS

`src/styles/global.css`, line 1 today is `@import './figma-tokens.css';`. Add the aliases **right after it**:

```css
@import './figma-tokens.css';
@import './legacy-aliases.css';   /* tokens v2: old names → new. Delete in phase 4. */
```

`legacy-aliases.css` maps **every old token name** to its v2 token (`--color-text-primary: var(--content-primary);` …, 452 names, text-style composites included). We
checked it against what the code uses today (`rebrand/log/dev-usage.json`):
- **Every one of the 324 old token names used in `src/` resolves** (92 of them are text-style composites with 1,056 uses) through the new CSS or an alias. The one exception is
  `--color-warning-300` (yellow is removed). Its single use has a fallback (`PageLoading`, fixed in phase 2).
- Every alias target exists in the generated CSS. The only exceptions are 5 `--color-gradient-ambient-*` aliases that point at
  demo-only tokens, and nothing in `src/` uses them.

After phase 1 the app is rebranded wherever it uses tokens: every blue is now the green at the same step (buttons and blue cards green-600, light
blue fills green-50 / -100, green text and icons green-700), labels on the primary button navy where they use the button text token, other white labels white,
neutrals and red unchanged, fonts Hanken Grotesk through `--font-family-*`, and text styles on the lean set (§2d). What still looks old is phase 2.

### 1.3 Import script: the new Figma collections (2 lines)

In Figma the new variable collections are **Primitive / Semantic / Component**, each with one mode, **Light**. The old ones are renamed
**Legacy · Primitive / Semantic / Component** and frozen. A Tokens Studio folder export therefore contains `Primitive/Light.json`,
`Semantic/Light.json` and `Component/Light.json`, next to `Legacy · …/Mode 1.json` folders that you ignore.

In `scripts/import_figma_tokens.py`:

```python
COLLECTIONS = ("Semantic", "Component", "Primitive")   # line 22: unchanged (same collection names)
MODE_FILE = "Light.json"                                # line 23: was "Mode 1.json"
...
        merged[f"{collection}/Light"] = read_json(mode_path)   # line 37: was f"{collection}/Mode 1"
```

What we verified on a mock export laid out as above (including the `Legacy · …` folders):
- The merged JSON has the **same content** as `v2/figma-tokens.json`. Only the key order differs, `Semantic, Component, Primitive` as in
  `COLLECTIONS`.
- The generated CSS is **byte-identical** to the CSS from the drop-in.
- The line 37 label is cosmetic: the CSS is identical with `/Mode 1`. Use `/Light` so the file matches the drop-in and `$metadata`.
- The unpatched script stops with `FileNotFoundError … Mode 1.json`. It fails loudly, so it cannot silently import old values.
- Never import a `Legacy · …` folder.

`docs/figma-developer-guide.md` §3 describes this workflow. Please add one line about the Light mode there.

### 1.4 Needs a fix in your pipeline: opacity tokens get `px`

`scripts/figma_token_build.py` adds `px` to every number. Opacity variables therefore come out as lengths, which CSS rejects. **This is
already live today** (`src/styles/figma-tokens.css` lines 495–508): `--layer-opacity-subtle: 20px`, `--layer-opacity-80: 80px` and the rest.

An `opacity: var(--x)` whose value is invalid is dropped, so the element is drawn at **full opacity**. Two places in `src/` hit this today:
- `components/ui/Select/index.module.css:138`: the scrollbar thumb, meant to be 20 %.
- `pages/OutPages/DiversionPage/Home/components/DownloadGuideSheet/index.module.css:71`: the sheet handle. Its fallback `0.2` is never
  used, because the variable is defined.

`--layer-opacity-disabled` (4 uses in RepayPage) is not a token, so its fallback `0.4` works.

For v2 the design side wrote `--opacity-disabled: 0.4` and `--opacity-pressed: 0.1` as text in the JSON, so they come out right. The
14 `--layer-opacity-*` tokens are still `20px` etc. in v2, and any opacity variable exported straight from Figma (0–100 numbers) breaks
the same way.

**Fix:** in `value_to_css()`, add a branch right before the generic number branch (after the font-weight one):

```python
    if t in ("float", "number") and ("OPACITY" in scopes or any("opacity" in p for p in path_parts)):
        n = float(val)  # Figma opacity variables are 0-100; CSS opacity is a unitless 0-1
        return f"{n / 100:g}" if n > 1 else f"{n:g}"
    if t in ("float", "number", "fontSizes", "paragraphSpacing", "dimension"):
```

We tested it on copies of your scripts:
- On today's JSON and on v2 it changes **exactly the 14 `--layer-opacity-*` lines** (`20px` → `0.2`, `100px` → `1`, `8px` → `0.08` …) and
  nothing else.
- `--opacity-disabled` / `-pressed` stay `0.4` / `0.1`.
- Values ≤ 1 are kept as they are. The one ambiguous case is an opacity of exactly 1 %, which no token uses.

### 1.5 Smoke test

`npm run dev`, then open home, apply (amount entry → order), repayment, account and inbox. Expect green primary buttons with navy text (white where phase 2b is not done yet),
green cards (gradients where they were gradients), and Hanken Grotesk everywhere. Expect blue only in the places phase 2 lists. Then run `npm run lint`, `npm run type-check`
and `npm run build:test`. Phase 1 changes no TS, so these should behave exactly as before.

---

## Phase 2 · Hand fixes (~1 day)

**The colour rule (owner, 2026-11-20, final; it replaces the case-by-case greens):**
- **Legacy blue N → green N.** The same step on the green scale, which is anchored on the Brand Bible green at 600: blue-600 `#2C74BE` →
  green-600 `#5CD680`, blue-500 → green-500 and so on.
  Blue-950 `#000128` is already navy and stays navy.
- **Neutral, red and green keep their step.** Neutral and red are unchanged. A legacy green N becomes the v2 green N (e.g. legacy
  green-600 `#3BCB84` → `#5CD680`).
- **Text keeps its legacy neutral, and white labels stay white.** The one exception is the primary button: green-600 `#5CD680` with a
  navy-900 label, as in the Brand Bible (2b).
- **Green text and icons on light backgrounds are one tier darker** (owner, 2026-11-20): green-700 `#44A05F` (`--content-accent-strong`,
  `--content-link`, `--content-positive`, the tag accent / positive text). It is 3.3 : 1 on white, so AA only for large or bold text: the
  owner's pick, and a phase-2 check. Heavy and pressed text are green-800 `#327545` (5.6 : 1). Green text on navy is green-500
  (`--content-accent`). Fills, borders and the button follow the step.
- **Navy only for dark brand surfaces** (the dark logo tiles, the dark animation page).

| step | legacy blue | → v2 green | | step | legacy green | → v2 green |
|---|---|---|---|---|---|---|
| 50 | `#F3F8FF` | `#F6FEF7` | | 50 | `#F3FCF9` | `#F6FEF7` |
| 100 | `#E4F0FF` | `#EAFDED` | | 100 | `#DDF8EE` | `#EAFDED` |
| 200 | `#C8DEFF` | `#D1FBD9` | | 200 | `#BDF1DD` | `#D1FBD9` |
| 300 | `#9FC6FA` | `#B0F6BF` | | 300 | `#97E9C7` | `#B0F6BF` |
| 400 | `#74B2F5` | `#8DF2A6` | | 400 | `#73E1B1` | `#8DF2A6` |
| 500 | `#3FA0F0` | `#72EB94` | | 500 | `#58E09A` | `#72EB94` |
| 600 | `#2C74BE` | `#5CD680` | | 600 | `#3BCB84` | `#5CD680` |
| 700 | `#20558D` | `#44A05F` | | 700 | `#2EAE6E` | `#44A05F` |
| 800 | `#173D67` | `#327545` | | 800 | `#1F9158` | `#327545` |
| 900 | `#102950` | `#18572D` | | 900 | `#145F3A` | `#18572D` |
| 950 | `#000128` | navy `#000128` | | 950 | `#0A3321` | `#143A1F` |

A value that is not exactly on the scale (an `rgba()`, a one-off hex) takes the nearest step, with its alpha kept.

**The aliases already apply the rule.** `legacy-aliases.css` sends `--color-blue-*` / `--color-brand-*` to green-N (950 → navy), and the
semantic names to tokens with the same-step value. Checked: of the **113 legacy colour tokens that `src/` uses, 102 land on their target** (the step
for fills and borders, green-700 / -800 for green text and icons), and `--color-action-text-default` gives navy on purpose (the primary
button label, 2b). The 10 that miss are listed in 2p (reported, not for a hand fix). Where code uses a text token as a fill, or a scale
step as text, the alias gives the wrong tier: those rules are in 2n. So phase 1 rebrands everything that goes through a token. What is left
for phase 2 is the code that **bypasses tokens**: raw hex and `rgba()`, fallbacks of tokens that were never defined, removed tokens, SVG
files, canvas code and CSS filters. Fix each with the same step. Write fixes with v2 names where a role token has the value; otherwise use
the palette variable (`var(--palette-green-600)`) or the hex in non-CSS files.

Summary:

| | count | effort |
|---|---:|---|
| 2a · SVG icons on light backgrounds → green-700 `#44A05F`; filled tiles and the radio → the step `#5CD680`; the ticker icon → `#327545` | 19 values in 13 files | 0.5 h (or re-exported by design) |
| 2a · raw / undefined / removed tokens in CSS, same step | 16 rules | 1 h |
| 2a · canvas and standalone-animation colours (TS, JS, HTML), same step | 10 values | 0.5 h |
| 2b · labels on the primary button → navy `--content-on-action`; the home credit card keeps white | 38 rules + 1 | 1.5 h |
| 2b / 2l · owner decisions 1 and 2 (segmented tabs, place tab) | 4 rules | 0.5 h |
| 2c · card gradients | **nothing to do** (green gradients through the aliases) | – |
| 2d · typography: font literals → Hanken Grotesk | ~25 places | 1.5 h |
| 2d · small hints and legal lines back to regular (`--body-sm-*` / `--body-xs-*`) | 21 rules | 0.5 h |
| 2d · legacy weights back where phase 1 makes text heavier (display / headline 700 → 800, `section-title-xs` 600 → 500) | 11 rules | 20 min |
| 2e · other blue-ish and off-scale values, the payment tab icon filter | 8 places | 1 h |
| 2f · coin animations (`successCoin.ts`, `loadingCoin.ts`) | 2 files | design re-export, 0.5 h to drop in |
| 2i · the scam warning strip, colours in code | 1 component | 0.5 h incl. its test |
| 2n · text tokens used as fills → the step; scale steps used as text → green-700 | 14 rules | 35 min |
| 2o · selected checks and radios → `--bg-selected` (green-600) with a navy mark | 5 controls | 30 min |
| 2h, 2k, 2o · on-brand fills, activity tiles, focus / slider / badges / brand icons (2j: one rule, in 2n; 2o: the selected controls) | **nothing to do** (aliases) | – |
| 2m · coupon countdown → `--content-urgent` | nothing in `src/` today; for new coupon UI | – |
| visual QA on device | | 0.5 day |

### 2a. Hard-coded blue → the same green step

How we found them: we searched every file in `src/` (except the generated CSS) for the legacy blues `#2c74be #3fa0f0 #20558d #c8deff
#e4f0ff #f3f8ff #102950 #74b2f5 #9fc6fa #173d67`, in hex and `rgb()` form. That gives **249 values in 88 files**:
- **208 are fallbacks of a token that exists** (`var(--token, #2c74be)`). They are harmless, because the token wins. Phase 3 renames
  the token and refreshes the fallback.
- **The rest below must change.** They are raw values, fallbacks of a token that was **never defined** (so the blue is what users see
  today), or removed tokens.

**SVG icons.** Icons on light backgrounds take the green text tier, green-700 `#44A05F`; a filled tile or control takes the step. They are
`<img>` files, so set the colour in the file (or use `currentColor` where the icon should follow the text colour).
Design can re-export them from Figma "Component - Rebranding" instead.

| file:line | today | step | change to |
|---|---|---|---|
| assets/home/sec-registration.svg:2 | `var(--fill-0, #2C74BE)` | blue-600 | `#44A05F` (icon on a light background) |
| assets/loan/loan-detail-reviewing.svg:2 | `#2C74BE` | blue-600 | `#5CD680` (a filled tile with a white glyph: the step) |
| assets/payment-methods/empty-account.svg:2, 3, 4 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| assets/svg/withdraw-amount-edit.svg:2 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| assets/svg/credit-validity/close.svg:3 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| features/workProfile/documents/assets/9565-10156.svg:2 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| pages/AccountPage/AccountDeletionReason/assets/radio-selected.svg:2 | `#2C74BE` | blue-600 | `#5CD680` (the selected radio's dot: `--bg-selected`, 2o) |
| pages/CreditLimitPage/assets/pending.svg:2, 3, 4 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| pages/HomePage/Home/assets/loan-update.svg:2 | `#2C74BE` | blue-600 | `#5CD680` (a filled tile with a white glyph: the step) |
| pages/HomePage/Payment/components/PaymentMethodDrawer/assets/category-qr.svg:2 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| pages/RepayPage/QrCodePayment/assets/download.svg:3 | `#2C74BE` | blue-600 | `#44A05F` (icon on a light background) |
| components/ui/NoticeTicker/assets/info.svg:3, 4, 5 | `#20558D` | blue-700, heavy text level | `#327545` (the ticker text colour, 2i) |
| features/workProfile/documents/assets/9565-10122.svg:2 | `fill="#2EAE6E"` | legacy green-700 | `#44A05F` (the work documents success tick, an icon on a light background; also its step) |

`pages/CreditHistoryPage/assets/cash-in.svg` and `cash-out.svg` are white and stay white.

**CSS: raw values, undefined and removed tokens.**

| file:line | today | kind | step | change to | note |
|---|---|---|---|---|---|
| components/ui/EmailField/index.module.css:136 | `var(--color-surface-container-low, rgba(44, 116, 190, 0.08))` | undefined | blue-600 at 8 % | `rgb(92 214 128 / 8%)` | press state |
| features/reloan/components/AmountEditDrawer/index.module.css:136 | `rgba(44, 116, 190, 0.18)` | raw | blue-600 at 18 % | `rgb(92 214 128 / 18%)` | text selection |
| pages/HomePage/Home/components/NewCustomer/index.module.css:200 | `rgba(44, 116, 190, 0.24)` | raw | blue-600 at 24 % | `rgb(92 214 128 / 24%)` | focus ring |
| pages/AccountPage/AccountDeletionVerify/index.module.css:122, 189 · pages/AccountPage/Inbox/index.module.css:220 | `var(--color-action-text-primary-default, #2c74be)` | undefined | blue-600 | `var(--content-link)` (`#44A05F`) | text buttons, card footer link |
| pages/HomePage/Payment/components/FraudWarningSheet/index.module.css:231 | `var(--color-primary, #2c74be)` | undefined | blue-600 | `var(--bg-action)` (`#5CD680`) | primary button; its `color: #fff` (line 232) → `var(--content-on-action)` (2b) |
| pages/HomePage/Payment/components/FraudWarningSheet/index.module.css:93 | `#20558d` | raw | blue-700 | `var(--palette-green-700)` (`#44A05F`) as the outline colour | focus ring (a border: the step) |
| pages/HomePage/Payment/components/PaymentErrorModal/index.module.css:56 · pages/HomePage/Payment/components/PaymentListRecoveryState/index.module.css:81 | `var(--color-border-focus, #2c74be)` | undefined | blue-600 | `var(--border-brand-strong)` (`#5CD680`) | focus rings |
| pages/OutPages/ShortLink/Repay/index.module.css:27 | `var(--color-border-brand-default, #2c74be)` | undefined | blue-600 | `var(--border-brand-strong)` | focus ring |
| pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:151 | `var(--color-alpha-blue-20, rgba(63, 160, 240, 0.2))` | removed | blue-500 at 20 % | `rgb(114 235 148 / 20%)` | track inset glow. The alias gives white 20 % (2p) |
| pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:179 | `var(--color-alpha-blue-50, rgba(63, 160, 240, 0.5))` | removed | blue-500 at 50 % | `rgb(114 235 148 / 50%)` | slider progress |
| pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:193 | `var(--color-alpha-blue-40, rgba(63, 160, 240, 0.4))` | removed | blue-500 at 40 % | `rgb(114 235 148 / 40%)` | thumb shadow |
| components/ui/HeaderActionContainer/index.module.css:183 | `#102950` | raw | blue-900, **dark brand surface** | `var(--surface-brand)` (navy) | logo tile |
| pages/OutPages/DiversionPage/Home/components/DiversionHomeShell/index.module.css:48 | `var(--color-blue-900, #102950)` | alias | blue-900, **dark brand surface** | `var(--surface-brand)` (navy) | logo tile. By step the alias gives green-900; a dark logo tile is a brand surface, so navy |

**Canvas and the standalone animation page** (no tokens there; use the hex):

| file:line | today | change to | note |
|---|---|---|---|
| pages/AuthPage/components/RiskVerifyCaptcha/index.tsx:164–166 | gradient stops `'#e4f0ff'`, `'#f3fcf9'`, `'#ddf8ee'` | `'#EAFDED'`, `'#F6FEF7'`, `'#EAFDED'` | captcha background: blue-100 and the old green-50 / -100, same steps. Keep the gradient |
| pages/AuthPage/components/RiskVerifyCaptcha/index.tsx:325 | `'rgba(44, 116, 190, 0.34)'` | `'rgba(92, 214, 128, 0.34)'` | puzzle hole outline. The white fill (:324) stays |
| pages/AuthPage/components/RiskVerifyCaptcha/index.tsx:342–343 | `'#3fa0f0'` → `'#58e09a'` | `'#72EB94'` → `'#72EB94'` | puzzle piece: blue-500 and the old green-500 both land on green-500 |
| pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:42 | `--accent: #3fa0f0` | `#72EB94` | |
| pages/HomePage/CreditIncreaseIntro/material/baked-heap.html:79 · baked-heap.js:630, :922 | `#3FA0F0` | `#72EB94` | accent, burst ring, pulse |

### 2b. Labels on the green primary button → `--content-on-action` (navy)

The Brand Bible's primary button is green-600 `#5CD680` (`--bg-action`) with a navy-900 label (`--content-on-action`, 11 : 1; white on it
would be 1.8 : 1). This is the **only** label that changes from white. These rules put white text (`--color-text-inverse`, `#fff`,
`--tag-color-neutral-bg-alpha`, `--color-surface-card-default`, or the undefined `--color-action-text-primary-default`) on the primary button
background (`--color-action-bg-primary-*`). Change the text to `var(--content-on-action)`:

| file:line (rule start) | selector | text today | change to |
|---|---|---|---|
| components/ui/AppEntryLanding/index.module.css:91 | `.primaryAction` | `var(--color-text-inverse, #fff)` | `var(--content-on-action)` |
| components/ui/BottomActionButton/index.module.css:34 | `.button` | `var(--color-text-inverse, #fff)` | `var(--content-on-action)` |
| features/reloan/components/AmountEditDrawer/index.module.css:212 | `.confirmButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| features/workProfile/documents/documents.module.css:251 | `.dialogActions .retrySave` | `var(--color-text-inverse)` | `var(--content-on-action)` |
| pages/AccountPage/AccountDeletionReason/components/AccountDeletionUnavailableDialog/index.module.css:81 | `.understandButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AccountPage/AccountDeletionReason/components/DeleteAccountConfirmDialog/index.module.css:114 | `.confirmButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AccountPage/AccountDeletionReason/index.module.css:206 | `.primaryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AccountPage/Inbox/index.module.css:375 | `.loadMoreRetry` | `#fff` | `var(--content-on-action)` |
| pages/AuthPage/Identity/components/IdentityVerifyFailedDialog/index.module.css:264 | `.primaryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AuthPage/LoanDetail/index.module.css:424 | `.stateButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AuthPage/LoanEstimate/index.module.css:57 | `.reminderIcon` | `var(--color-text-inverse)` | `var(--content-on-action)` |
| pages/AuthPage/LoanHistory/index.module.css:73 | `.retryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AuthPage/LoginEntry/PrivacyConsentSheet/index.module.css:93 | `.agreeButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AuthPage/LoginEntry/index.module.css:236 | `.primaryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/ConfirmPage/Order/components/ReceivingAccountGuideSheet/index.module.css:78 | `.cta` | `#fff` | `var(--content-on-action)` |
| pages/ConfirmPage/Order/index.module.css:222 | `.agreementPromptButton` | `var( --color-action-text-primary-default, var(--tag-color-neutral-bg-alpha) )` | `var(--content-on-action)` |
| pages/ConfirmPage/Order/index.module.css:274 | `.submitErrorDialogButton` | `var(--color-action-text-primary-default, #ffffff)` | `var(--content-on-action)` |
| pages/ConfirmPage/Order/phoneVerification/sheet.module.css:144 | `.cta` | `var(--color-surface-card-default)` | `var(--content-on-action)` |
| pages/CreditLimitPage/index.module.css:270 | `.retryButton` | `var(--color-text-inverse, #fff)` | `var(--content-on-action)` |
| pages/HomePage/Account/index.module.css:59 | `.loginButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/HomePage/Account/index.module.css:520 | `.confirmLogoutButton` | `var(--tag-color-neutral-bg-alpha)` | `var(--content-on-action)` |
| pages/HomePage/Home/components/NewCustomer/index.module.css:171 | `.applyButton` | `var(--color-text-inverse, var(--tag-color-neutral-bg-alpha))` | `var(--content-on-action)` |
| pages/HomePage/Payment/components/FraudWarningSheet/index.module.css:224 | `.primaryButton` | `#fff` | `var(--content-on-action)` + background → `var(--bg-action)` (its `--color-primary` is undefined) |
| pages/HomePage/Payment/components/PaymentListRecoveryState/index.module.css:56 | `.retryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/HomePage/Payment/components/RepaymentSummaryBar/index.module.css:102 | `.repayButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/HomePage/WithdrawDisclosureRoute/index.module.css:50 | `.status button` | `#fff` | `var(--content-on-action)` + background → `var(--bg-action)` (its `--color-primary` is undefined) |
| pages/HomePage/WithdrawFlowLayout/index.module.css:59 | `.submissionNoticeButton` | `var(--color-action-text-primary-default, #fff)` | `var(--content-on-action)` |
| pages/HomePage/WithdrawMainRoute/index.module.css:289 | `.agreementPromptButton` | `var(--color-action-text-primary-default, #fff)` | `var(--content-on-action)` |
| pages/OutPages/DiversionPage/Home/components/NewCustomerCard/index.module.css:118 | `.primaryButton` | `var(--color-text-inverse, #fff)` | `var(--content-on-action)` |
| pages/OutPages/ShortLink/Loan/index.module.css:66 | `.primaryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/OutPages/ShortLink/Repay/index.module.css:88 | `.retryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/RepayPage/GcashPayment/index.module.css:6 | `.openButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/RepayPage/components/RepayDetailRefreshFeedback.module.css:81 | `.primaryButton` | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/SupportPage/FaqPage/index.module.css:283 | `.emptyState a` | `var(--color-text-inverse, var(--tag-color-neutral-bg-alpha))` | `var(--content-on-action)` |
| pages/SupportPage/FaqPage/index.module.css:363 | `.contactButton` | `var(--color-text-inverse, var(--tag-color-neutral-bg-alpha))` | `var(--content-on-action)` |
| components/ui/DatePickerSheet/index.module.css:303 | `.dateCellActive` (green circle is `::before`) | `var(--color-text-inverse, #ffffff)` | `var(--content-on-action)` |
| pages/AuthPage/components/RiskVerifyCaptcha/index.module.css:202 | `.sliderThumb i` (grip bars) | `var(--color-alpha-white-80, …)` | `var(--content-on-action)` |
| pages/ConfirmPage/Order/components/AgreementConsent/index.module.css:32 | `.checkboxChecked` (white tick, line 29) | `var(--color-icon-inverse)` | background → `var(--bg-selected)` (navy, like radios), border → `var(--border-selected)`; keep the white tick (**decision**, §6) |

Seven rules already use `--color-action-text-default` and become navy through the alias: `GlobalErrorHandler .retryButton`,
`AccountDeletionVerify .deleteButton`, `FeedbackInvitationSheet .primaryAction`, `CancelLoanConfirmDialog .primaryButton`,
`CreditIncreaseIntro .skip`, `OtpVerify .resendButton` and `DiversionExceptionState .action`.

`CreditAmountCard .card` (`pages/HomePage/CreditAmountCard/index.module.scss:1`) also uses the button tokens, but it is the home credit card,
not a button. Through the aliases it becomes green-600 with navy text; its legacy text is white, so keep it white:
`color: var(--content-inverse)`.

Buttons built on brand tokens instead of action tokens (`HomeComposite .repaymentFooter button` :341, `RejectDiversionCard .applyButton`
:136, `BankCard .confirmSubmitButton` :481) take their step like any blue. If one is the screen's main action, give it the primary button
pair `--bg-action` + `--content-on-action`.

**Owner decision 2** (segmented controls): the two segmented tab rows change shape, so they stay a hand fix:


| file:line (rule start) | selector | text today | change to |
|---|---|---|---|
| pages/AccountPage/Inbox/index.module.css:36 | `.tabs .activeTab` | `var(--color-text-inverse, #fff)` | segmented (**owner decision 2**, amended 2026-11-20): selected → background `var(--surface-default)` (white thumb), text `var(--content-primary)`; the other buttons → transparent, `var(--content-tertiary)`; track (`.tabs`) → `var(--bg-neutral)` |
| pages/CreditHistoryPage/index.module.css:42 | `.tabs .activeTab` | `var(--color-text-inverse, #ffffff)` | segmented (**owner decision 2**, amended 2026-11-20): selected → background `var(--surface-default)` (white thumb), text `var(--content-primary)`; the other buttons → transparent, `var(--content-tertiary)`; track (`.tabs`) → `var(--bg-neutral)` |

### 2c. Card gradients: nothing to do

The amount and credit cards (`QuoteForm .amountPanel`, `HomeComposite .primaryCard`, `NewCustomer .limitHero`, `LoanPlanCard .amountPanel`,
`NewCustomerCard .limitHero`, `DiversionApplicationCard .card`) are gradients of blue-600 → blue-500 / -400. They are not dark surfaces, so
by step they become green-600 → green-500 / -400 through the aliases, with their white text. Keep the gradients (look parity); don't
flatten them. The cyan glows on two of them (`assets/home/application-state-glow.svg`, `pages/CreditLimitPage/assets/card-decoration.svg`,
`#9ae8ff`) are not on the blue scale: design decides (2e).

### 2d. Typography: one typeface, lean set

**One typeface.** Hanken Grotesk is used for everything, amounts included. Every `--font-family-*` token (`body`, `title`, `label`,
`display`, `amount`, `hanken-grotesk`) is Hanken Grotesk.

**Lean set (owner decision 3, a look-parity exception).** The owner approved 21 text styles, cut from 37 (`rebrand/tokens/TYPE-AND-STYLES.md`, plus `body-sm` and `body-xs` from
`rebrand/tokens/TYPE-GAPS.md`, 2026-11-20): `display-md/-sm`, `headline-sm`, `title-lg/-md/-sm/-xs`, `body-lg`, `body-lg-strong`, `body-md`,
`body-md-strong`, `body-sm`, `body-xs`, `label-md/-sm`, `caption-sm/-xs` and `amount-xxl/-lg/-md/-xs`. Each style is a group of variables (`--body-md-font-family / -font-size / -font-weight / -line-height /
-letter-spacing`). What this means for `src/`:

- `src/` uses **92 old text-style variables, 1,056 times**.
- **53 of them keep their name.** Their values follow v2: the family Inter → Hanken Grotesk, caption weight 400 → 500, and small
  letter-spacing changes (17 names get a new value).
- **39 names (263 uses) are merged into a surviving style.** `legacy-aliases.css` keeps them working in phase 1, and the codemod renames
  them in phase 3:

| old style (live-app uses) | becomes |
|---|---|
| `section-title-sm-*` (76) | `label-md-*` |
| `body-md-emphasis-*` (75) | `body-md-strong-*` |
| `section-title-md-*` (45) | `title-xs-*` |
| `label-md-light-*` (18) · `section-title-sm-light-*` (17) | `body-md-strong-*` |
| `body-lg-emphasis-*` (13) · `section-title-md-light-*` (9) | `body-lg-strong-*` |
| `section-title-xs-*` (7) · `section-title-xs-light-*` (3) | `caption-xs-*` |

- The class renames in `rename-map.json` → `classes` (`.ps-text-*`, 21) are **not used** in `src/`, so there is nothing to do.
- The visible changes are all small:
  - `section-title-xs` weight 600 → 500 in phase 1; its 2 rules get 600 back in phase 2 (legacy-weight twins, below)
  - `section-title-md-light` line height 22 → 24
  - captions 400 → 500. Hints and legal lines that should stay regular move to `body-sm` / `body-xs` (below).
  - Number xl / sm → Amount lg / xs. The code has no Number styles; the amount fonts are the Satoshi literals in the table below.
  - Amount weight is 700 (owner, 2026-11-21; look parity: legacy amounts are Bold). It was 800. `src/` reads no `--amount-*` or
    `--number-*` weight variable (its amounts write the weight in the rule or use the display / headline weights, below), so this
    changes nothing in phase 1. It keeps the Amount styles at the legacy weight for phase 3 and new UI.
  - Amount letter-spacing is graded by size (owner, 2026-11-19): `amount-xxl` +4 %, `amount-lg` +3 %, `amount-md` +2 %, `amount-xs` +2 %
    (it was −2 % on every size). The JSON adds two primitives, `--letter-spacing-8` (3 %) and `--letter-spacing-9` (4 %). The Amount styles
    point at 9 / 8 / 2 / 2, so `--amount-*-letter-spacing` comes out as `0.04em / 0.03em / 0.02em / 0.02em`. Use the variable, never a typed value.

**Small regular text → `body-sm` / `body-xs` (owner, 2026-11-20, BRIEF 33).** Two styles were added to the lean set:

| style | size / line | weight | use |
|---|---|---|---|
| `body-sm` (`--body-sm-font-family / -font-size / -font-weight / -line-height / -letter-spacing`) | 12 / 16 | 400 | one- or two-line hints, helper and error lines under fields, short secondary sentences |
| `body-xs` (`--body-xs-*`) | 11 / 14 | 400 | legal and consent micro-copy only |

`caption-sm` / `caption-xs` (now 500) stay for meta: labels, field titles, dates, statuses, badges, counters.

Why it matters in `src/`: 54 rules take their weight from `var(--caption-sm-font-weight, 400)` or `var(--caption-xs-font-weight, 400)`.
In v2 those come out at 500, so in phase 1 they all turn medium. 33 of them are labels and dates, where 500 is intended. The 21 below are
prose, so they move to the Body styles and stay regular. In each rule, rename every `--caption-sm-*` variable to `--body-sm-*` (or
`--caption-xs-*` to `--body-xs-*`). The fallbacks (`12px` / `11px`, `400`, `16px` / `14px`) stay correct.

| where | text | change to |
|---|---|---|
| components/ui/EmailField/index.module.css:139 `.fieldError` · components/ui/Select/index.module.css:84 `.error` · features/workProfile/WorkLocationField.module.css:61 `.error` · pages/AuthPage/BasicInformation/index.module.css:163 `.fieldError` · pages/AuthPage/Contact/index.module.css:181 `.fieldError` · pages/AuthPage/BankCard/index.module.css:421 `.fieldError` · pages/AuthPage/Identity/components/RecognizedIdentityDetails/index.module.css:168 `.fieldError` · pages/AuthPage/Identity/components/IdentityIdTypeSelect/index.module.css:84 `.error` · pages/OutPages/DiversionPage/BasicInformation/index.module.css:77 `.fieldError` | error lines under fields (9) | `body-sm` |
| pages/RepayPage/QrCodePayment/index.module.css:1 `.refreshTip`, :11 and :22 `.expiredNotice` | "Refresh the page to get the new number…", "QR code expired…" | `body-sm` |
| pages/SupportPage/CustomerServicePage/index.module.css:211 `.openingTimes` | "Customer service hours: …" | `body-sm` |
| features/reloan/components/AmountEditDrawer/index.module.css:170 `.rangeText` | "₱2,000–₱10,000, in steps of ₱500" | `body-sm` |
| pages/AuthPage/Identity/components/IdentityUploadCard/index.module.css:139 `.previewDescription` | the hint under the ID preview | `body-sm` |
| pages/SupportPage/SecRegistrationPage/index.module.css:61 `.companyCard p` | the company description | `body-sm` |
| pages/SupportPage/AboutPage/index.module.css:229 `.footer` | the copyright line | `body-sm` |
| pages/ConfirmPage/Order/components/AgreementConsent/index.module.css:47 `.text` | the loan agreement consent | `body-xs` |
| pages/AuthPage/Contact/index.module.css:195 `.notice` | "SEC regulations require emergency contacts…" | `body-xs` |
| pages/SupportPage/SecRegistrationPage/index.module.css:116 `.auditNote` | "SULIT LENDING is audited regularly by the SEC…" | `body-xs` |
| pages/AuthPage/LoanDetail/index.module.css:368 `.cancelHint` | "You can cancel your loan within 24 hours…" (the cooling-off right) | `body-xs` |

Your call, one rule: `PaymentMethodDrawer/index.module.css:525 .errorMessage` is an 11 px error, not legal copy. Leave it on `caption-xs`,
or move it to `body-sm` (12 px) to match the other error lines.

Not in the list, no visible change: rules that write `12px` / `11px` with a fixed or inherited weight stay regular in v2. Pointing them at the
Body variables is optional tidy-up, for example `BorrowerProtectionCard .copy p` :46, `FraudWarningSheet .body` :164,
`OtpVerify .methodHint` :107, `LoanEstimate .hint` :70 and `.disclaimer` :128 (`body-sm`), and the legal lines `LoginEntry .agreement` :174
and the four `.companyInfo` rules (HomeTrustSection ×2, QuoteForm :41, ShortLink/Loan :77) (`body-xs`).

**Legacy-weight twins (Figma lane, 2026-11-21; `rebrand/tokens/TYPE-AND-STYLES.md` → "Legacy-weight twins").** Look parity keeps every
text at its legacy weight. Where no lean style has the legacy size and weight, Figma has a *twin*: its base style (same size, line height,
tracking and font variables) with the legacy weight. There are 14, all in phase 1. The JSON has no variables for them. **In code a twin is
its base plus a `font-weight`**: the base's `--*-font-family / -font-size / -line-height / -letter-spacing` variables (or its `.ps-text-*`
class) and the weight from a primitive: `--font-weight-medium` (500), `-semi-bold` (600), `-bold` (700), `-black` (800). 300 has no primitive,
so write `300`; the Hanken Grotesk variable font in `global.css` covers 300–900.

| Figma twin | size / line | weight | in code: base + weight |
|---|---|---|---|
| `Label/xs` | 11 / 14 | 600 | `caption-xs` + `var(--font-weight-semi-bold)` |
| `Label/xs-bold` | 11 / 14 | 700 | `caption-xs` + `var(--font-weight-bold)` |
| `Label/sm-bold` | 12 / 16 | 700 | `label-sm` + `var(--font-weight-bold)` |
| `Label/md-bold` | 14 / 20 | 700 | `label-md` + `var(--font-weight-bold)` |
| `Caption/sm-light` | 12 / 16 | 300 | `caption-sm` + `300` |
| `Body/lg-light` | 16 / 24 | 300 | `body-lg` + `300` |
| `Title/sm-semibold` | 18 / 24 | 600 | `title-sm` + `var(--font-weight-semi-bold)` |
| `Title/md-medium` | 20 / 28 | 500 | `title-md` + `var(--font-weight-medium)` |
| `Title/lg-medium` | 24 / 32 | 500 | `title-lg` + `var(--font-weight-medium)` |
| `Title/lg-extrabold` | 24 / 32 | 800 | `title-lg` + `var(--font-weight-black)` |
| `Headline/sm-bold` | 28 / 36 | 700 | `headline-sm` + `var(--font-weight-bold)` |
| `Headline/sm-medium` | 28 / 36 | 500 | `headline-sm` + `var(--font-weight-medium)` |
| `Display/md-bold` | 36 / 44 | 700 | `display-md` + `var(--font-weight-bold)` |
| `Amount/md-semibold` | 24 / 32 | 600 | `amount-md` + `var(--font-weight-semi-bold)` |

The four `Amount/*-bold` twins were folded back into the base Amount styles (now 700), so they don't exist. The owner will consolidate the
14 later (CHANGES "Later"), so don't add twin variables or classes of your own; write the base plus the weight.

**Where phase 1 makes text heavier than legacy: 11 rules.** Rules that read the display / headline weight variables were Bold (700) in
legacy and come out ExtraBold (800) in v2, and `section-title-xs` (600) is merged into `caption-xs` (500). Keep the size variables and
give the weight back:

| where | text | today | weight → | twin |
|---|---|---|---|---|
| features/reloan/components/AmountEditDrawer/index.module.css:91 `.currencySymbol`, :123 `.amountInput`, :154 `.fixedDigit` | the amount being edited, 36 px | `var(--display-md-font-weight, 700)` | `var(--font-weight-bold)` | `Display/md-bold` |
| features/reloan/QuoteForm/index.module.css:123 `.amountValue` · pages/RepayPage/components/RepayDetailShell.module.css:76 `.amount` · pages/ConfirmPage/Order/index.module.css:63 `.amount` · pages/AuthPage/LoanDetail/index.module.css:140 `.amountValue` | amounts, 32 px | `var(--display-sm-font-weight, 700)` | `var(--font-weight-bold)` | none: Figma has no `Display/sm` twin (32 / 40 at 700 is `amount-lg`'s size and weight) |
| pages/HomePage/Payment/components/RepaymentSummaryBar/index.module.css:77 `.amount` · pages/HomePage/Account/index.module.css:29 `.avatar` | the amount due, 28 px · the avatar initial | `var(--headline-sm-font-weight, 700)` | `var(--font-weight-bold)` | `Headline/sm-bold` |
| pages/HomePage/Payment/components/RepaymentCard/index.module.css:43 `.statusBadge` · pages/AuthPage/LoanHistory/index.module.css:243 `.termTag` | status badge, term tag, 11 px | `var(--section-title-xs-font-weight, 600)` | `var(--font-weight-semi-bold)` | `Label/xs` |

Rules that write a literal weight (for example `Account .userName` `font-weight: 800`) don't change. Every other old weight variable that
`src/` reads comes out at its legacy weight, except the captions (400 → 500), which are covered above.

The rules that come with the set (TYPE-AND-STYLES.md):
- Buttons use `label-md`.
- Inputs keep their current text size in phase 1. Moving them to `body-lg` (16 px) is a later readability option, not a requirement.
- Links are a colour (`--content-link`) plus underline, not a style.
- Long paragraphs never go below `body-md`. A one- or two-line hint may use `body-sm`; `body-xs` is for legal and consent copy only.
- Touch targets are at least 48 × 48 dp (in CSS px, 48 px at 1:1). A smaller icon or link gets padding to reach that size.

The app is Android only: these pages run in the Android app's WebView, and there is no iOS version (`rebrand/handoff/PRODUCT.md`, `rebrand/handoff/docs/decisions/0015-android-only.md`).
Check on Android Chrome / WebView; no iOS Safari workaround is needed.

**Fixes.** The `var(--font-family-*, Inter)` fallbacks (~250) are harmless: every `--font-family-*` token is Hanken Grotesk in v2. `--font-family-inter`
(19 uses in Inbox, Account and FaqPage) is aliased in phase 1 and renamed to `--font-family-hanken-grotesk` in phase 3. The fixes are the
places that name a font directly:

| where | today | change to |
|---|---|---|
| styles/global.css:64 | `font-family: 'Inter', sans-serif;` (the app's base font) | `var(--font-family-body), sans-serif` |
| features/reloan/QuoteForm/index.module.css:121, 383, 489, 514 · components/ui/LoanQuote/index.module.css:39 · pages/HomePage/Home/HomeComposite.module.css:335 · pages/HomePage/Home/components/RejectDiversionCard/index.module.css:103 · pages/AuthPage/LoanDetail/index.module.css:138 | `'Satoshi', var(--font-family-body, Inter), sans-serif` (amounts) | `var(--font-family-amount), sans-serif` + `font-variant-numeric: tabular-nums`; better, the whole Amount style (`--amount-lg-font-size`, `-font-weight`, `-letter-spacing` …: weight 800, spacing +3 % for lg) |
| components/ui/BorrowerProtectionCard/index.module.css:39, 48 · pages/HomePage/Home/feedbackInvitation/FeedbackInvitationSheet.module.css:107, 124 | `Inter, sans-serif` | `var(--font-family-body), sans-serif` |
| pages/HomePage/Home/feedbackInvitation/FeedbackInvitationSheet.module.css:97 | `'Hanken Grotesk', sans-serif` | `var(--font-family-title), sans-serif` (same font, through the token) |
| pages/RepayPage/QrCodePayment/index.module.css:112 · pages/AuthPage/Liveness/components/LivenessStatusCircle/index.module.css:165 | `var(--font-family-nunito-sans, …)` (undefined) | `var(--font-family-body)` |
| pages/HomePage/CreditIncreaseIntro/adapter.ts:153–154 · material/entry.ts:56–60 | `document.fonts.load('700 64px Satoshi' / '… Inter')` | load `'… Hanken Grotesk'` instead (same weights) |
| pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:2–20 | `@font-face` Inter / Satoshi / Hanken for the standalone animation page | keep only Hanken Grotesk |
| styles/global.css:4–35 | `@font-face` Inter and Satoshi | delete once nothing uses them (after this phase), with `public/fonts/inter` and `public/fonts/satoshi` |

Leave `ConfirmPage/DisclosureLetterPage/…/DisclosureStatementForm.module.css` (Arial, Roboto) alone. It reproduces a printed legal
form, so it is not brand typography.

### 2e. Other blue-ish and off-scale values

| where | today | step | change to |
|---|---|---|---|
| components/ui/BorrowerProtectionCard/index.module.css:77–78 | checked toggle `#f2f8ff` / border `#c5dcff` | ≈ blue-50 / blue-200 | background `var(--surface-brand-subtle)` (`#F6FEF7`), border `var(--border-accent-subtle)` (`#D1FBD9`) |
| pages/RepayPage/NormalPayment/index.module.css:80 | `var(--color-brand-primary, #1f73b7)` (undefined) | ≈ blue-600 | `var(--border-brand-strong)` (`#5CD680`), the focus outline |
| pages/RepayPage/components/RepayDetailShell.module.css:278 | `var(--color-surface-brand-subtle, #edf6ff)` (undefined) | ≈ blue-50 | `var(--surface-brand-subtle)` (`#F6FEF7`) |
| pages/AuthPage/Identity/components/IdentityUploadCard/index.module.css:51 | `.status[data-tone='success']`: `var(--color-surface-positive-subtle, #ecfff5)` / `var(--color-text-positive, #0c7a49)`, both undefined | ≈ old green-50 / -800 | background `var(--surface-positive-subtle)` (`#F6FEF7`), color `var(--content-positive)` (`#44A05F`) |
| pages/HomePage/WithdrawDisclosureRoute/index.module.css:55–56 | `var(--color-primary, #6222cc)` (undefined → **purple**) + `#fff` | meant as the primary button | `var(--bg-action)` + `var(--content-on-action)` |
| pages/HomePage/Payment/components/PaymentMethodDrawer/index.module.css:349 | `.categoryButtonActive > .assetIcon img`: `filter: … invert(43%) sepia(17%) saturate(1985%) hue-rotate(171deg) …` (≈ `#2C74BE`) | blue-600 | a filter that gives `#44A05F` (an icon on a light background), or better, draw the icon as a mask with `background: currentColor` so it follows `.categoryButtonActive > .assetIcon` (:340, green-700 through the alias). The inactive grey filter (:344) stays. Check on device |
| pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:39, 133–134 | page `--bg: #0d1620`; chip `#16304a`, text `#6fb8f5` | dark page; chip ≈ blue-900, text ≈ blue-400 | page `#000128`, chip `#0A1A4A` (navy-800: dark surfaces are navy), text `#72EB94` (green-500: green text on navy) |
| assets/svg/credit-validity/history-pen.svg, pages/CreditLimitPage/assets/adjustments.svg, pages/HomePage/Payment/components/FraudWarningSheet/assets/transaction.svg | illustration blues | same steps | design re-export |
| 4 empty-state SVGs (`empty-payment-method`, `history-empty`, `inbox-empty`, `link-expired`) · the card glows (2c) | teal `#2ab0be` · cyan `#9ae8ff` | not on the blue scale | design decides |

Leave these alone: bank and wallet logos and the Facebook / Instagram icons (third-party colours).

### 2f. Coin animations (design asset)

`pages/HomePage/WithdrawMainRoute/motion/successCoin.ts:144` and `loadingCoin.ts:117` are generated from Lottie by `lottie2gsap`, with blue
baked into the inline SVG: `#2b74bd` ×49 (≈ blue-600 → `#5CD680`) and light blue `#78aae2` ×8 (≈ blue-400 → `#8DF2A6`). Design will
deliver rebranded files. Replace the two files as a whole; don't hand-edit them.

### 2g. Removed token: `--color-warning-300`

`components/ui/PageLoading/index.module.css:74`, `.dot_warning`: yellow is gone. Use `var(--bg-action-subtle-pressed)` (light green) for the
third loading dot, or a neutral like `var(--bg-neutral)` (decision, §6). Don't use the new orange here: `--content-urgent` (§2m) is not a
replacement for warning.


### 2h. Fills on the brand cards: nothing to do

The home credit card (`CreditAmountCard .card`), the application state card and the other blue-600 cards become green-600 (or a green
gradient, 2c) through the aliases. Their fills keep their legacy values: navy at 30 % and white at 20–40 % are not blue, so look parity
keeps them. Earlier versions of this handoff moved them to `--bg-on-brand` / `--border-on-brand`; don't.

`--bg-on-brand` / `--border-on-brand` (periwinkle `#9DB8FF` at 24 %) stay in v2 for fills on a **navy** surface, the only navy being dark
brand surfaces. `src/` has none with fills today; use them when a navy card is built (for example the demo's hub card).

### 2i. The scam warning strip: colours in code, same step

`components/ui/NoticeTicker` (placed at `pages/HomePage/Payment/index.tsx:1816`) draws the scam warning on the Payment tab. Its colours
are not in CSS. Each notice brings its own `backgroundColor` and `textColor` from the remote rollout config (`FRAUD_WARNING_ROLLOUT_KEY`).
`NoticeTicker/index.tsx:177` sets them inline, and `fraudWarningNoticeConfig.ts:50` accepts only `#rgb` / `#rrggbb`. Today's values (from
`tests/fraud-warning.test.ts`) are blue-200 `#C8DEFF` with blue-700 `#20558D` text.

The colours are set in code (coordinator, 2026-11-20), with the step colours:
- In `NoticeTicker/index.module.css` `.root`: `background: var(--palette-green-200); color: var(--content-accent-heavy);`
  (`#D1FBD9` / `#327545`, 4.9 : 1, passes AA: the fill takes the step, the text the heavy green tier).
- In `NoticeTicker/index.tsx:177`, stop applying `activeNotice.backgroundColor` / `textColor`. The remote config keeps only the copy
  (and the timing). Update the colour cases in `tests/fraud-warning.test.ts` to match.
- The icon (`assets/info.svg`) becomes `#327545`, like the text (2a). It is an `<img>`, so `currentColor` does not reach it.
- The new look ships with the `rebrand` branch, and master keeps today's look.
- If the remote config must keep colour fields (for older app builds that still read them), set them to **`#D1FBD9` background /
  `#327545` text**. Do this only on the day the rebrand ships, because the config is shared with master.

This replaces the earlier `--surface-tint` / navy choice. `--surface-tint` (ambient-300 `#DFEEE5`) stays in v2 for new tinted strips.
The other light-blue fills (`--color-surface-card-brand-subtle`, blue-50: selected term options, `GlobalErrorHandler .iconWrap`,
`PaymentMethodDrawer .groupHeader`) become green-50 through the alias.

### 2j. Empty-panel title and step numbers

On the credit limit page, the tip numbers (`.tipNumber`, `--color-text-brand-light`) become green-700 through the alias. The title "No limit
history yet" (`.historyEmpty h3`) writes the scale step `--color-brand-700`, so the alias gives green-700, which is the text tier: nothing to do. The panel's
icon is `pending.svg` (2a, green-700).

### 2k. Credit history activity tiles: nothing to do

The tiles keep their legacy roles and step: Repayment (`.positiveIcon`, legacy green-600) → v2 green-600 through the alias; Loan
(`.loanIcon`, `--color-surface-icon-brand-default`, blue-600) → by step green-600, but the alias gives navy today (2p). Both icons stay
white (`cash-in.svg`, `cash-out.svg`). The earlier swap to `--bg-brand-muted` / `--bg-positive` is replaced by the step rule.

### 2l. Upload progress and the place tab

The "Uploaded" texts and the selfie ring's icon and label become green-700 through the aliases, and the ID ✓ mark (legacy green-600) gets
its step. The work documents bar and the selfie ring's dashed stroke use a *text* token as a fill, so the alias gives them green-700
instead of the step: they are in 2n. Two upload values bypass tokens and are in 2a / 2e: the success tick `9565-10122.svg` and
`IdentityUploadCard .status[data-tone='success']`.

**Owner decision 1** (BRIEF 30): the active place tab in the address picker is a green pill; its underline goes. This changes the shape,
so it stays a hand fix:

| file:line (rule start) | selector | today | change to | note |
|---|---|---|---|---|
| components/ui/CityCascadeSheet/index.module.css:298 | `.tabActive` | color `var(--color-text-brand-default, #2c74be)` | `background: var(--bg-positive); color: var(--content-primary);` | green-500 pill with a dark label (11.3 : 1). Shape (radius, padding) from the Figma PlaceTab `11186:24712` |
| components/ui/CityCascadeSheet/index.module.css:302 | `.tabActive::after` | the light-blue underline `var(--color-icon-brand-light, #3fa0f0)` | remove | the fill replaces the underline |

### 2m. Coupon countdown → `--content-urgent` (owner, 2026-11-20, BRIEF 38)

New in v2:

| token | value | use |
|---|---|---|
| `--palette-orange-50 … -950` | 11 stops, `-500` = `#FF5E00` | primitives; don't use them in components |
| `--content-urgent` | orange-500 `#FF5E00` (owner, 2026-11-21: the legacy countdown colour; it was orange-700) | the countdown text and its clock icon on coupons ("Expires in …"), the "Best" pill text |
| `--bg-urgent-subtle` | orange-100 `#FFE6D5` (2026-11-21) | the coupon "Best" pill fill |

`--content-urgent` is 3.1 : 1 on white (2.8 : 1 on the page background `#F0F5F4`, 2.6 : 1 on the `--bg-urgent-subtle` pill), so it passes AA
only for large or bold text, as the legacy countdown did. It is the owner's pick and a phase-2 check. Use it as a text and icon colour only.

**The old `--color-warning*` names stay deleted.** The name "urgent" is on purpose: it marks time pressure (an offer running out), not a
warning or error state. Don't alias `--color-warning-*` to the orange, and don't map existing warning or error colours to it. Errors stay
`--content-negative`; the loading dot stays as in §2g.

**Where `src/` draws it: nowhere yet.** `src/` has no coupon card and no coupon countdown. Coupons appear only as a deducted amount
("Coupon −₱…" in `PaymentDetailDrawer`, green, left alone). The "Expires in …" coupon is new UI from Figma, so build it with
`--content-urgent` for the countdown and the clock icon.

Checked and left alone: the only live countdown in `src/` is the payment deadline on the QR payment page
(`pages/RepayPage/QrCodePayment/index.module.css:21`, `.countdown strong`, "Please complete your payment in mm:ss"). It is red
(`--color-negative-600`) and stays on the negative colour, because it ends in an expired payment code, not a lost offer. The step rule keeps
red as it is, so it stays red (§6, 7). The selfie countdown (`LivenessStatusCircle .countdownValue`)
is a camera timer, not urgency.


### 2n. Text tokens used as fills, and scale steps used as text

The aliases send every legacy **text** name to the darker green tier (green-700; the heavy names to green-800), and every **scale step** (`--color-brand-N`) to the
same green step. So code that uses a text token as a fill or border gets green-700 where it should get the step, and code that writes a
scale step as text gets the step where it should get green-700. A step that is already 700 (or 800 for heavy text) lands on the
text tier and needs nothing. Fix these by hand:

| file:line | selector | today | change to | note |
|---|---|---|---|---|
| features/workProfile/documents/documents.module.css:172, 176 | `.progress::-webkit-progress-value`, `::-moz-progress-bar` | background `var(--color-action-text-link)` (blue-500) | `var(--bg-positive)` (green-500) | work documents upload bar |
| pages/AuthPage/Liveness/components/LivenessStatusCircle/index.module.css:72 | `.uploading::before` | first conic stop `var(--color-text-brand-light, #3fa0f0)` | `var(--bg-positive)` | the selfie's dashed upload ring |
| components/ui/PageLoading/index.module.css:70 | `.dot_light` | background `var(--color-icon-brand-light, #3fa0f0)` | `var(--bg-positive)` | loading dot |
| pages/RepayPage/components/RepayDetailShell.module.css:84, 277 | `.copyButton`, `.guideOptionActive` | border `var(--color-icon-brand-default, #2c74be)` | `var(--border-brand-strong)` (green-600) | |
| pages/SupportPage/BirRegistrationPage/index.module.css:106 | `.verifyLink:focus-visible` | outline `var(--color-text-brand-default, #2c74be)` | `var(--border-brand-strong)` | focus ring |
| pages/HomePage/Home/components/MadeForFilipinos/index.module.css:143 · pages/OutPages/DiversionPage/Home/components/MadeForFilipinos/index.module.css:143 | `.npcMark` | background `var(--color-icon-brand-default, #2c74be)` | `var(--bg-positive-strong)` | |
| pages/AuthPage/Liveness/index.module.css:183 | `.cardCheck` | background `var(--color-icon-positive-default, #3bcb84)` | `var(--bg-positive-strong)` | legacy green-600 fill |
| components/ui/BorrowerProtectionCard/index.module.css:79, 112, 131 | `.toggle[data-checked='true']`, `.preview`, `.feedback button` | color `var(--color-brand-600)` | `var(--content-accent-strong)` | text |
| pages/HomePage/Home/components/RejectDiversionCard/index.module.css:91 | `.amountBlock strong` | color `var(--color-brand-600, #2c74be)` | `var(--content-accent-strong)` | the offered amount |

Already right: `CreditLimitPage .historyEmpty h3` (:230, "No limit history yet") and `RejectDiversionCard .matchBadge` (:70) write
`--color-brand-700`, which is green-700, the text tier (switching them to `--content-accent-strong` / `--tag-accent-content` is optional).
`HomeComposite .repaymentCard header > strong` writes `--color-brand-800`, which is green-800, the heavy tier (switching it to
`--content-accent-heavy` is optional). `DiversionLandingLoading .brandName` (`--color-brand-950`) stays navy. The place tab's underline
(`CityCascadeSheet .tabActive::after`) goes with owner decision 1 (2l).

### 2o. Focus, slider, badges, brand icons: nothing to do

All through the aliases (fills by step, text and icons green-700):
- **Focus rings and carets.** `--color-action-stroke-active` (blue-500) → green-500 (`--border-selected`) on the OTP boxes and the
  `:focus-visible` outlines; carets on `--color-icon-brand-default` → green-700, on `--color-action-bg-primary-default` →
  green-600. Outlines that are white or neutral today stay as they are. The fields that show focus with a shadow only (phone field,
  `Input`, search fields) keep the shadow. `--border-focused` (green-500) is for new UI.
- **The amount slider.** `LoanQuote` knob and fill (`--color-action-stroke-active`, blue-500) → green-500; the default `Slider` knob
  (blue-600) → green-600. The white knob border and the white fill on the cards stay.
- **Badges.** `LoanHistory .termTag[data-loan-status='CHANGE_CARD']` (blue-600, white text) → green-600 with white text. The account
  page's `.newBadge` uses `--color-surface-card-brand`, whose alias gives navy today (2p).
- **Brand-blue icons.** The OTP contact method icon, the contact picker icon and the payment tab's inline SVG (`--color-icon-brand-*`)
  → green-700. The payment tab's image icons use a CSS filter (2e); make them green-700 `#44A05F`. The selected checks and radios are
  below.

**Selected checks and radios → `--bg-selected`** (owner, 2026-11-20). `--bg-selected` is green-600 `#5CD680` (the step of legacy
blue-600), and the mark on it (tick, dot centre, knob) is navy `--content-on-action` (11 : 1; the legacy white mark would be 1.8 : 1). No
legacy name aliases to `--bg-selected`, so set it by hand:

| file:line (rule start) | selector | today | change to | note |
|---|---|---|---|---|
| pages/ConfirmPage/Order/components/AgreementConsent/index.module.css:32 | `.checkboxChecked` | background `var(--color-action-bg-primary-default, #2c74be)`, border `var(--color-stroke-brand-default, #3fa0f0)`; the tick inherits white from `.checkbox` (:29) | background and border `var(--bg-selected)`, add `color: var(--content-on-action)` | the loan agreement check (lucide `Check`). Its tick is also in the 2b list; one change covers both. Settles §6, 1 |
| pages/HomePage/Payment/components/RepaymentCard/index.module.css:95 | `.itemSelected .checkButton` | background `var(--color-surface-icon-brand-default, #2c74be)` (the alias gives navy, 2p), color `var(--color-surface-icon-inverse-default, #ffffff)` | background `var(--bg-selected)`, color `var(--content-on-action)` | repayment item check |
| pages/AuthPage/LoginEntry/index.module.css:205, 210 | `.agreementCheckActive`, `.checkMark` | fill and border `var(--color-surface-card-positive, #3bcb84)` (legacy green-600); mark borders `var(--color-text-inverse, #ffffff)` | fill and border `var(--bg-selected)`; mark borders `var(--content-on-action)` | login consent check. Legacy green-600 gives the same fill; the mark goes navy |
| pages/AuthPage/BankCard/index.module.css:264, 268 | `.methodItemSelected .radio`, `.radio::after` | `var(--color-icon-brand-default, #2c74be)` ring and dot (the alias gives green-700, the text tier) | ring `var(--bg-selected)`, dot `var(--bg-selected)` | payment method radio |
| pages/AccountPage/AccountDeletionReason/index.module.css:120 | `.radio[data-selected='true']` | border `var(--color-action-bg-primary-default, #2c74be)` | `var(--bg-selected)` | same colour through the alias; set it for the role. Its dot is `radio-selected.svg` (2a, `#5CD680`) |

Left on the step: the `Checkbox` component (`.checked` :42–53) and the select sheet's option indicator (`SelectSheet .optionSelected`
:221–237) draw their ring and dot in legacy **blue-500** (`--color-stroke-brand-default`), so they become green-500 through the alias. The
BorrowerProtectionCard toggle is a light chip, not a filled toggle (2e). `src/` has no switch with a knob today.

### 2p. Aliases that miss the step (reported to the coordinator)

These legacy tokens are used in `src/` but their alias does not land on the same step. Don't hand-fix them: the fix belongs in
`tokens/v2` (a new `legacy-aliases.css`), and phase 1 picks it up.

| legacy token (uses) | legacy value | step says | alias gives today |
|---|---|---|---|
| `--color-surface-card-brand` (4: `ApplicationStateCard`, `Account .newBadge`, `BankCard` :482, `CreditValidityTooltip` :153) | blue-600 | green-600 `#5CD680` | navy `#000128` |
| `--color-surface-icon-brand-default` (4: `CreditHistoryPage .loanIcon`, `RepaymentCard` :98 (hand-fixed to `--bg-selected` in 2o), `QrCodePayment` :37, `Account` :130) | blue-600 | green-600 `#5CD680` | navy `#000128` |
| `--tag-color-brand-stroke-default` (1, `RejectDiversionCard .matchBadge` fill) | blue-200 | green-200 `#D1FBD9` | green-500 `#72EB94` |
| `--tag-color-neutral-text-default` (11) | neutral-500 `#6A757D` | unchanged | neutral-700 `#3C4850` |
| `--tag-color-neutral-stroke-default` (2) | neutral-150 `#CDD1D4` | unchanged | neutral-300 `#97A0A6` |
| `--tag-color-negative-text-default` (3) | red-500 `#FF0D19` | unchanged | red-700 `#B8000D` |
| `--color-alpha-blue-20 / -40 / -50` (1 each, removed) | blue-500 at 20 / 40 / 50 % | green-500 at the same alpha | white at that alpha (hand-fixed in 2a) |
| `--color-surface-elevated-glass` (24) | white 60 % | unchanged | white 80 % |

If any of these is meant (a dark brand surface, say), the coordinator will say so and this table goes.

---

## Phase 3 · Codemod (~0.5 day incl. review)

```bash
cp -R <design-repo>/Perasure/rebrand/tokens/v2/{migrate-tokens.mjs,rename-map.json} scripts/tokens-v2/
node scripts/tokens-v2/migrate-tokens.mjs src            # dry run: lists what would change
node scripts/tokens-v2/migrate-tokens.mjs src --write
# a single file works too: node scripts/tokens-v2/migrate-tokens.mjs src/path/file.module.css --write
```

It rewrites every old token name to its v2 name from `rename-map.json` (`var(--color-text-primary)` → `var(--content-primary)`, including
names inside fallbacks and TS strings). It skips `figma-tokens.css` and `legacy-aliases.css`.

**What it did on a copy of today's `src/`:**
- **1,762 replacements in 117 files** (v2 of 18:48: 1,499 colour and other token renames + 263 text-style renames) (116 stylesheets + `components/ui/AppEntryLanding/index.tsx`, one string prop). Dry run and
  `--write` agree.
- Every name it wrote exists in the v2 CSS. **No old token name is left** except `--color-warning-300`, which it reports as an orphan.
  That one is fixed in 2g.
- It only swaps names, so no syntax can break, and the only TS change is a string. We could not run `type-check` / `build` on the copy:
  the checkout has no `node_modules`, and we did not install anything. Run them after the codemod (step 3.2).

**Review these after the codemod:**
1. **125 uses become primitives (`--palette-*`)** because the old name was a scale step with no role: `--color-brand-600` (29),
   `--color-neutral-950` (25), `--color-neutral-150` (16) and so on. Screens should use roles, so give each one a role. The common cases:
   the old blue steps now become the same green step (`--color-brand-600` → `--palette-green-600`, `-500` → `-green-500` …, `-950` →
   `--palette-navy-900`). Give each a role: as text on a light background, any green step → `--content-accent-strong` (green-700; heavy text → `-heavy`, green-800), on navy →
   `--content-accent`;
   as a fill, green-600 → `--bg-action` (buttons) or `--bg-positive-strong`, green-200 → `--bg-positive-subtle-pressed`, green-50 →
   `--surface-brand-subtle`; as a border, green-600 → `--border-brand-strong`, green-200 → `--border-accent-subtle`. Navy-900 stays
   `--surface-brand` / `--bg-brand` (dark brand surfaces). If no role has the value, keep the palette variable rather than change the colour.
   Other cases: `--palette-ambient-200` background (3) → `--surface-page-strong`, `--palette-red-*` → `--content-negative` /
   `--bg-negative-subtle`. The card gradients (15 uses) become `--palette-green-*` stops; keep them (2c). `rebrand/log/dev-usage.json` has the per-file list.
2. **Fallbacks keep old values** (`var(--bg-action, #2c74be)`). They are harmless, but they mislead. Refresh them all (step 3.1).

### 3.1 Refresh fallbacks (optional, 5 minutes)

Run from the repo root after `npm run figma:tokens`. It sets every `var(--token, <colour>)` fallback to the token's current value, and
only touches tokens defined in `figma-tokens.css`. On the migrated copy it updated **279 fallbacks**. Afterwards, the only blue left in
`src/` is the phase 2 list (if phase 2 is not done yet).

```python
#!/usr/bin/env python3
"""Refresh var(--token, <colour>) fallbacks so they match src/styles/figma-tokens.css.
Run from the repo root AFTER `npm run figma:tokens`. Only touches fallbacks that are a literal colour
(#hex or rgb()/rgba()) of a token that exists in figma-tokens.css. Prints what it changed."""
import re, pathlib
root = pathlib.Path("src")
tokens = dict(re.findall(r"^\s*(--[\w-]+):\s*(#[0-9a-fA-F]{3,8});", (root / "styles/figma-tokens.css").read_text(), re.M))
pat = re.compile(r"var\(\s*(--[\w-]+)\s*,\s*(#[0-9a-fA-F]{3,8}|rgba?\([^()]*\))\s*\)")


def rgba(c):
    c = c.strip().lower()
    if c.startswith("#"):
        h = c[1:]
        if len(h) in (3, 4):
            h = "".join(ch * 2 for ch in h)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), round(a, 2))
    nums = [x for x in re.split(r"[\s,/()a-z%]+", c) if x]
    a = float(nums[3]) if len(nums) > 3 else 1.0
    return (int(float(nums[0])), int(float(nums[1])), int(float(nums[2])), round(a, 2))


total = 0
for f in sorted(root.rglob("*")):
    if f.suffix not in {".css", ".scss", ".ts", ".tsx"} or f.name == "figma-tokens.css":
        continue
    text = f.read_text(encoding="utf-8")
    n = 0

    def fix(m):
        global n
        name, fb = m.group(1), m.group(2)
        new = tokens.get(name)
        if not new or rgba(new) == rgba(fb):
            return m.group(0)
        n += 1
        return f"var({name}, {new})"
    out = pat.sub(fix, text)
    if n:
        f.write_text(out, encoding="utf-8")
        print(f"{f}: {n}")
        total += n
print("fallbacks updated:", total)
```

### 3.2 Check

`npm run lint && npm run type-check && npm run build:test`, then a visual pass. The codemod changes names only, so the screens should look
exactly as after phase 2.

Optional: a stylelint rule (`declaration-property-value-disallowed-list` or a custom regex on `--color-`, `--tag-color-`) to stop old
names from coming back.

---

## Phase 4 · Clean-up (minutes)

1. `grep -rE -- '--(color|tag-color)-' src --include='*.css' --include='*.scss' --include='*.ts' --include='*.tsx' | grep -v figma-tokens.css`
   should find nothing. Local names such as `--color-gradient-…` would show up here: check them.
2. Delete `src/styles/legacy-aliases.css` and its `@import` line.
3. Delete the Inter / Satoshi `@font-face` blocks and their font files (2d), if not done already.
4. Build and smoke test.
5. Keep `tokens/legacy/pre-rebrand/`; it is not part of the clean-up. All of this is still on the `rebrand` branch, and it is merged into
   master only when the owner says so.

---

## 5. Inventory (reference)

- **`rebrand/log/dev-usage.json`**: every CSS custom property `src/` uses today: 436 names, 5,366 `var()` uses (count, files, per-file
  counts, defined where). 324 come from the token file, and 366 tokens are never used. 48 names are defined nowhere, so their fallback
  renders: `--font-weight-semibold` 40, `--line-height-body-md` 21, `--color-action-text-primary-default` 7 …
- **`rebrand/log/dev-colours.json`**: every hard-coded colour, 2,047 in 219 files, with file:line and kind. There are 1,108 fallbacks of
  live tokens, 43 fallbacks of undefined names, 320 raw values and 576 colours inside SVGs.
- **Figma code syntax:** in the **old** collections, 3 variables export the wrong CSS name: `Action/Bg/Positive/Pressed` →
  `…-disabled`, `Action/Text/Link` → `…-text-positive`, `Tag/Neutral/Bg/Alpha` → `…-bg-inverse`. They don't matter for v2: the new
  collections have their own code syntax, and the v2 JSON has no colour collisions. The one shared name is `--font-size-11`, from
  `Primitive/Font/Size/11` and a leftover `Semantic/fontSize/11`, and both are 11px.

## 6. Open decisions (the coordinator collects them)

1. ~~**Selected checkbox** (`AgreementConsent`)?~~ **Decided by the owner (2026-11-20):** `--bg-selected` green-600 with a navy tick (2o).
2. ~~**Three buttons on brand tokens** (`HomeComposite .repaymentFooter button`, `RejectDiversionCard .applyButton`,
   `BankCard .confirmSubmitButton`)?~~ **Decided by the step rule:** each takes the green step of its legacy blue. If one is the screen's main
   action, it gets the primary button pair `--bg-action` + `--content-on-action` (2b). Where a button uses `--color-surface-card-brand`, the
   alias gives navy today (2p).
3. **Yellow loading dot** (`PageLoading .dot_warning`): light green or neutral?
4. ~~**Green text on white** (`--content-link`, `--content-positive`)?~~ **Decided by the owner (2026-11-20): green text and icons on light
   backgrounds are one tier darker, green-700 `#44A05F`** (`--content-accent-strong`, `--content-link`, `--content-positive`). It is 3.3:1 on white,
   so AA only for large or bold text: the owner's pick, and a phase-2 check. Heavy / pressed are green-800 `#327545` (5.6:1). Fills keep the step (`--bg-positive-strong` = green-600). It comes with the JSON, so it needs no
   code change except 2n.
5. **Coin animations and illustrations** need re-exports from design (2f, 2a SVGs, 2e).
6. ~~**Scam warning strip** (2i): tokens in code, or the shared rollout config?~~ **Decided by the coordinator (2026-11-20): in code**,
   with the step colours (green-200 `#D1FBD9` bg, green-700 `#44A05F` text and icon). If the config must keep colours: those two values.
7. ~~**QR payment countdown** (2m, `QrCodePayment .countdown strong`)?~~ **Decided by the step rule:** red keeps its step, so it stays red.
