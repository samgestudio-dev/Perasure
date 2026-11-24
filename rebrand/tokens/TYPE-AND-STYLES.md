# Typography and styles — lean set (approved by the owner 2026-11-19)

Owner asked to slim typography and styles to what is really used, in a more mature structure. Usage measured in the live app
(`phi_h5_025/src`, per text-style token use) and the demo (`ps-t-*` classes in `shared/ps-ui` + `prototypes/app`).

## Why the current set is too big

- **37 text styles** (31 + 6 Amount). Two are never used (`Display/xl`, `Display/lg`), `Link` is never used, `Number/*` only in demos.
- **Duplicates now that there is one typeface:** `Label/md` (600 14/20) = `Section-title/sm` (600 14/20); `Label/md-light`
  (500 14/20) = `Body/md-emphasis` = `Section-title/sm-light`; `Section-title/md-light` (500 16/22) ≈ `Body/lg-emphasis` (500 16/24);
  `Label/sm-light` (500 12/16) = `Caption/sm` (500 12/16); `Section-title/xs` (600 11/14) ≈ `Caption/xs` (500 11/14).
- **"-light" / "-emphasis" weight twins** for almost every style. Mature systems (Material 3, Polaris, Atlassian) keep one style per
  role × size and allow at most one stronger body weight.

## Text styles — 21 (19 approved 2026-11-19 + Body/sm, Body/xs approved 2026-11-20)

Final names keep every surviving old name with its old meaning (an old name is never reused for a different size):
`Caption/sm` 12 and `Caption/xs` 11 (not md/sm), `Display/md` 36, `Headline/sm` 28, `Amount/xxl · lg · md · xs`.

Structure: **role / size**, the Material 3 roles (Display, Title, Body, Label) plus Caption and Amount. Hanken Grotesk only.

| Style | Size / line | Weight | Tracking | Replaces (live-app uses) |
|---|---|---|---|---|
| `Display/md` | 36 / 44 | 800 | −2 % | Display/md (13), Display/lg (0), Display/xl (0) |
| `Display/sm` | 32 / 40 | 800 | −2 % | Display/sm (16) |
| `Headline/sm` | 28 / 36 | 800 | −1 % | Headline/sm (6) |
| `Title/lg` | 24 / 32 | 700 | −0.5 % | Title/lg (70) |
| `Title/md` | 20 / 28 | 700 | −0.5 % | Title/md (33) |
| `Title/sm` | 18 / 24 | 700 | −0.5 % | Title/sm (71) |
| `Title/xs` | 16 / 22 | 600 | 0 | Section-title/md (53) |
| `Body/lg` | 16 / 24 | 400 | 0 | Body/lg (11) |
| `Body/lg-strong` | 16 / 24 | 500 | 0 | Body/lg-emphasis (13), Section-title/md-light (9) |
| `Body/md` | 14 / 20 | 400 | 0 | Body/md (336) |
| `Body/md-strong` | 14 / 20 | 500 | 0 | Body/md-emphasis (75), Label/md-light (18), Section-title/sm-light (17) |
| `Label/md` | 14 / 20 | 600 | 0 | Label/md (113), Section-title/sm (98), Link (0) |
| `Label/sm` | 12 / 16 | 600 | 0 | Label/sm (8) |
| `Caption/sm` | 12 / 16 | 500 | 0 | Caption/sm (232), Label/sm-light (0) |
| `Caption/xs` | 11 / 14 | 500 | 0 | Caption/xs (77), Section-title/xs (7), Section-title/xs-light (3) |
| `Body/sm` | 12 / 16 | 400 | 0 | added 2026-11-20 (TYPE-GAPS.md): hints and helper sentences that legacy set Caption 400 (79 uses) |
| `Body/xs` | 11 / 14 | 400 | 0 | added 2026-11-20 (TYPE-GAPS.md): legal and consent micro-copy (33 uses) |
| `Amount/xxl` | 48 / 48 | 700 (was 800; look parity 2026-11-21) | +4 %, tabular | Number/xxl |
| `Amount/lg` | 32 / 40 | 700 (was 800; look parity 2026-11-21) | +3 %, tabular | Number/lg, Number/xl (36 → 32) |
| `Amount/md` | 24 / 32 | 700 (was 800; look parity 2026-11-21) | +2 %, tabular | Number/md |
| `Amount/xs` | 16 / 20 | 700 (was 800; look parity 2026-11-21) | +2 %, tabular | Number/sm (18 → 16), Number/xs |

Amount tracking is graded (owner, 2026-11-19: amounts were too tight, the big ones most): xxl +4 %, lg +3 %, md +2 %, xs +2 % (was −2 % on
every size). Developers' JSON: `letterSpacing.2` (2 %), new `letterSpacing.8` (3 %) and `.9` (4 %). Comparison: `parity/tracking/amount-tracking.png`.

Rules that come with it:
- Buttons use `Label/md` (sizes Small/Large keep their heights); links are a colour (`--content-link`) + underline on any style, not a style.
- Inputs: phase 1 keeps the legacy 14 px (`Body/md`); `Body/lg` 16 px is a phase 2 readability option. The app is Android only, so the
  iOS "zoom on focus" reason does not apply (owner, 2026-11-19).
- Only `Body` has a `-strong` twin; any other emphasis is a different role (e.g. `Label` instead of "Caption bold").
- Smallest text is 11 px and only for meta (`Caption/xs`: dates, statuses) and legal copy (`Body/xs`); **long paragraphs** never below
  `Body/md`; one- or two-line hints may use `Body/sm`. `Caption/*` (500) is for meta labels (tabs, timestamps, statuses), `Body/sm`·`xs` (400) for prose.

Visible changes (all small): Section-title/xs 600 → 500; Number/xl 36 → 32; Number/sm 18 → 16; Section-title/md-light line height
22 → 24. Everything else keeps its size, line height and weight from the approved v2.

## Legacy-weight twins — phase 1 (Figma lane, 2026-11-21, log 38)

Look parity rule: **every text keeps its legacy weight.** Where no style above has the legacy size + weight, Figma has a *twin*: the same
size / line height / tracking and the same font variables as its base, with the legacy weight. No base style changed weight, except
**Amount/* 800 → 700**: no legacy amount is ExtraBold, so the four Amount bold twins fold back into the base styles.

| Twin | Size / line | Weight | Tracking |
|---|---|---|---|
| `Label/xs` | 11 / 14 | 600 | 0 |
| `Label/xs-bold` | 11 / 14 | 700 | 0 |
| `Label/sm-bold` | 12 / 16 | 700 | 0 |
| `Label/md-bold` | 14 / 20 | 700 | 0 |
| `Caption/sm-light` | 12 / 16 | 300 | 0 |
| `Body/lg-light` | 16 / 24 | 300 | 0 |
| `Title/sm-semibold` | 18 / 24 | 600 | −0.5 % |
| `Title/md-medium` | 20 / 28 | 500 | −0.5 % |
| `Title/lg-medium` | 24 / 32 | 500 | −0.5 % |
| `Title/lg-extrabold` | 24 / 32 | 800 | −0.5 % |
| `Headline/sm-bold` | 28 / 36 | 700 | −1 % |
| `Headline/sm-medium` | 28 / 36 | 500 | −1 % |
| `Display/md-bold` | 36 / 44 | 700 | −2 % |
| `Amount/md-semibold` | 24 / 32 | 600 | +2 % |

The folded twins (`Amount/xs-bold`, `Amount/md-bold`, `Amount/lg-bold`, `Amount/xxl-bold`) are removed in Figma; their texts use the base
Amount style (now 700). Code: a twin is the base class plus its `font-weight`, e.g. `.ps-text-label-sm` + `font-weight: 700`. That's
14 twins, too many for phase 2: consolidate them with the owner (CHANGES "Later").

## Effect styles — 4 (from 8 legacy / 6 v2)

| Style | Use | Replaces |
|---|---|---|
| `Elevation/1` | Cards that lift (raised) | Shadow/Default → Elevation/Raised |
| `Elevation/2` | Sheets, bottom bars (shadow upward) | Shadow/Over → Elevation/Overlay |
| `Elevation/3` | Popovers, tooltips, toasts, pressed/lifted cards | Shadow/Focus → Elevation/Focus (renamed: it is not a focus ring — focus is `--border-focused`) |
| `Blur/Glass` | Glass buttons and the tab bar pill | Blur/Glass-nav-effect, Blur/Glass-nav-effect-focus (merged) |
| ~~`Blur/Scrim`~~ | dropped 2026-11-19: the scrim is a gradient without blur (ARCHITECTURE §12.9) | Blur/Scrim-default-effect |

Dropped: Blur/Top-nav-effect and Blur/Bottom-nav-effect (turned off since tokens v2026.11.17).

## Migration (same low-cost path)

Old text-style CSS variables (`--section-title-sm-font-size` …) and classes (`.ps-text-section-title-sm` …) are aliased to the new ones
in `legacy-aliases.css`, and the codemod renames them; Figma styles are renamed/merged in place so instances keep their binding
(merged styles: instances of the dropped twin are re-pointed to the surviving style).
