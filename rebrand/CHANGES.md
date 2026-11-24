# Rebrand changes — Figma ↔ demo

Every change, with both sides. Done only when Figma ✅, Demo ✅ and Compared ✅. Maintained by the coordinator from `log/*.md`.
Format: date · component or screen · Figma node ids · demo files · status · notes.

## In progress

**2026-11-21 — Code aligned to Figma on `tokens/rebrand-v3` (uncommitted):**
- old token names → new names (5,800);
- hard-coded legacy colours → v3;
- shared components A1–A22 from `figma/screen-diff/SCREEN-DIFF-2026-11-21.md` (green nav and tabs, light-green slider, bare icons, orange Best tag, form fields + ChoiceSheet, black face camera, navy splash, Neutral cancel, Plain log out, gradient scrim …);
- loan-schedule crash fixed;
- app copy kept (decision 47).

Still to do: section B (screens and states Figma has and the app doesn't).


**2026-11-21 — Repo tokens v2026.11.21 on branch `tokens/rebrand-v3` (owner):** exported from kYyNV2MgxvH1w9bJ46A3yx through tools/sync-tokens.py, no Legacy collections, no tokens/legacy file. Commit 2811e07 pushed (not merged). Mapping: tokens/MIGRATION-2026.11.21.md + .csv (637 mapped, 37 no replacement). Prototypes on that branch still use the old CSS names.


**2026-11-21 — Semantic layer restructured, Primer-style (decision 43), and inputs truncate (decision 44)** in Figma copy kYyNV2MgxvH1w9bJ46A3yx: 14 duplicates merged, 142 renamed (fg/bg/border/…), tag tokens alias semantics; Field/Search/PhoneField/SelectBar fixed height + single-line ellipsis. Owner node fixes: figma log 40. Code tokens v3 still to build (new CSS names).


**2026-11-21 — Colour scales v3 APPLIED in Figma copy kYyNV2MgxvH1w9bJ46A3yx (decision 42):** Primitive / Semantic / Component overwritten, 26 old variables deleted, component bindings and contrast pass done (see tokens/v3-SCALES.md). Code tokens v3 not built yet. Earlier: UI Foundations PDF scales checked in OKLCH. Green anchor 500 (+400, +950 added); navy anchor 900 replaces neutrals (+800 added); Mist separate scale (200–400 adjusted); green 600–800 smoothed (owner); White and Black as two base colours (no scale). Review page in Figma copy kYyNV2MgxvH1w9bJ46A3yx (`15004:15`). Nothing applied yet. Proposal: tokens/v3-SCALES.md.


**2026-11-21 — Owner picks (decision 41):** ContactMethod selected all green-600 (new token Content/Selected, dev CSS 658 vars); disabled coupon white background; CouponPayCard tags unified on the "New limit" style; ActivityItem tile → Bg/Brand/Muted; VerifiedBadge star → green-600. Routed to the Figma lane.


**2026-11-21 — Look-diff pass (Figma, log 38):** weight ≠ legacy 69 → 0, rows with differences 93 → 63; 18 legacy-weight twin styles. **Amount/* 800 → 700** (legacy Bold; tokens/v2 rebuilt, 657 vars); 4 Amount twins fold back. TYPE-AND-STYLES updated.


**2026-11-21 — `Content/Urgent` orange-700 → orange-500 #FF5E00** (owner: text nearest legacy; legacy countdown text is raw #FF5E00). Orange scale unchanged. tokens/v2 rebuilt (657). Phase-2: 3.1:1 on white.


**2026-11-21 — New token `Bg/Urgent/Subtle` = orange-100 #FFE6D5** (`--bg-urgent-subtle`), for the coupon "Best" pill fill (legacy positive-100 step → orange, BRIEF 38 addendum). tokens/v2 rebuilt, dev CSS 657 vars. Figma lane: log 35 (pill = legacy 43×24, radius 12, Label/sm SemiBold, text Content/Urgent).


**2026-11-21 — Pill `13036:55898` (owner):** match the legacy shape; colours on the orange scale at the legacy steps (BRIEF 38 addendum). Figma lane fixing.


**⚠️ 2026-11-20 (later) — Unintended edit to the design system file OBsvf42AiRapcRrasD7KNm.** The old Figma session (local_d80dae0b, "Figma: rebrand component library") ran a variable sync there instead of in the rebrand copy:
- 247 colour values synced in Primitive 10999:15 / Semantic 10999:16 / Component 10999:17;
- 5 new Semantic variables created (VariableID:11336:15–19);
- Alpha/Periwinkle/24 renamed to Palette/Alpha/Periwinkle/24;
- scopes / WEB code syntax changed on 113 variables.

That session has stopped writing. Undoing it is waiting on the owner. Recommended: restore the version from before the sync with Figma version history. The rebrand copy 3oi5… is not affected; figma-lib-3 applies green-700 there.


**2026-11-20 (later) — Green text one step lighter (owner, direct):** green text / icons green-800 → green-700 #44A05F; heavy / pressed green-900 → green-800. tokens/v2 rebuilt (656 vars), dev-figma-tokens.css regenerated. Phase-2 check: green-700 is 3.3:1 on white (AA large text only).


**2026-11-20 — Figma phase 1 in `3oi5Omgi2dC5sR0L7Ux5hf` (look parity):** colour pass (step rule, green-800 text, green checks), shape fixes A2–A32, OrderAmountCard (slider) in 16 frames, pixel pass with every difference classified in `figma/NORMALISATIONS.md` (owner: nearest text style kept; App download mockup 0.73× as legacy). Waiting on owner review of `parity/figma/look-parity.png` + 2 manual Resets. Demo stopped.


**2026-11-20 — Colour rule step for step (owner, final):** green = legacy blue scale at the same step; neutral, red, green same step; text = legacy neutral; navy only for dark brand surfaces. Tokens rebuilt (dev JSON 656). Demo stopped (owner).


**2026-11-20 — Green content unified to green-600 (owner):** Content/Accent-strong, Content/Link, Content/Positive, Bg/Positive/Strong = #43B265 (link pressed green-700); tokens + dev JSON rebuilt (651).


**2026-11-20 — Look parity audit (owner):** the rebrand no longer looks like legacy in places (coupon tickets lost their notches, "Use" became a round pill, coupon tabs became three outlined pills without the count badge, Home's bell + headset split into two circles). All work paused until every component and screen looks like legacy except colours and owner decisions. See BRIEF "Look parity". Plus: every page pixel-aligned; colour hierarchy = legacy hierarchy, with legacy blue Brand text / icons → dark green (owner A; rename-map + aliases updated, dev JSON 651). Figma first; the demo follows after the owner approves Figma.


| Date | Item | Figma | Demo | Figma | Demo | Compared | Notes |
|---|---|---|---|---|---|---|---|
| 2026-11-19 | Colour tokens (Rebrand mode ↔ `tokens/tokens.css`) | variables, mode Rebrand `10980:0/1/2` | `rebrand/tokens/tokens.css` | ✅ | ✅ | ✅ | 44 changed keys checked equal. Figma code-syntax typos on 3 variables (Action/Bg/Positive/Pressed, Action/Text/Link, Tag/…/Bg/Alpha) noted for dev handoff |
| 2026-11-19 | Component - Rebranding page, 6 sections | `10982:15`–`10982:21` | — | ✅ | — | — | |
| 2026-11-19 | **Tokens v2** (approved): new collections Primitive / Semantic / Component (Light), old → "Legacy · …"; 31 text styles + Amount/* in Hanken Grotesk, Elevation/* effects; old styles → "Legacy/…" | collections `10999:15/16/17` | `rebrand/tokens/v2/*` (tokens.css, legacy-aliases.css, figma-tokens.json, rename-map.json, MAPPING.md, codemod) | ✅ | 🔄 demo moving to v2 | — | Same source (`v2/build.py`) for both sides; developers' script accepts the JSON (657 vars, no missing names) |
| 2026-11-19 | Spinning coin recoloured green (only animation change) | — | `rebrand/animations/coins-loading/*` | n/a | ✅ | ✅ | body #5CD680, highlight #99E8AB |
| 2026-11-19 | Actions + Feedback components (Button, TextLink, Tag, Chip, Check, Tooltip dark, Toast) | `10987:225`, `10988:133`, `10988:272`, `10989:185`, `10989:254`, `10991:475`, `10991:524` | — | 🔄 rebinding to v2 | — | — | specs follow |
| 2026-11-19 | Component parity round 1 (REPORT.md: 10 high + 9 medium "demo" rows) | — | `shared/ps-ui/*`, `shared/gallery.js`, `parity/demo/*.png` (16 re-exported) | — | ✅ | 🔄 | Popover 48 superseded: legacy is 44 + divider. Waiting on the demo's legacy-geometry round |
| 2026-11-19 | Library back to legacy geometry + ~40 new/rebuilt components (Keypad, ScamStrip, RepayCard, PayBar/PayDock, QrPanel, PayTimer, ScamTips, BankList, Accordion, OrderDetails, ProtectionCard, MethodCard, Strip, Banners, TrustCard, StateCard, Installment…) | log/figma.md 09; specs carry legacy node ids | demo following the specs | ✅ | 🔄 | — | SelectBar 46 (legacy), not 48 |
| 2026-11-19 | Screens: Register, User home, Home, User Order, Payment (50 frames) | `parity/figma/screens/*` (legacy \| new \| difference) | — | ✅ (rounds 11–13) | — | — | Coordinator review: copy changed (Withdraw Fund → Continue), wrong icons, extra share icon, Repay label missing, ₱ → P in small text, Payment tab header swapped. Sent back with an automated check on every frame (text, icons, labels, ₱, nodes without a legacy source) |
| 2026-11-20 | Screens: Account (20) + Application Details (35) + ~21 new components | entries 14–15, `parity/figma/screens/*` | demo following | ✅ except Field rest border | 🔄 | — | Field gets no border at rest (legacy); legacy collections: the 11 added variables + Rebrand mode removed (backup JSON) |
| 2026-11-20 | Pop-up close X = legacy Close: Cancel-Thick 14 × 14 in the 40 glass button (owner, BRIEF 37) | .GlassButton close + every pop-up | close icon size in `PS.Sheet` / `PS.Popover` / dialogs | 🔄 | 🔄 | — | |
| 2026-11-20 | Graphic components sized with Scale (K) / rescale, never resize (owner, BRIEF 36); Radio dot too big in ReasonRow | audit + fix every resized icon / Radio / Check / art instance | n/a (CSS scales) | 🔄 | n/a | — | |
| 2026-11-20 | Tooltip Tone=Light → glass (white 80 % + Blur/Glass) (owner, BRIEF 35) | Tooltip 10991:475 | `PS.Tooltip{tone:'light'}` | 🔄 | 🔄 | — | dark tooltip unchanged |
| 2026-11-20 | Log Out button: no outline → Button Variant=Plain (white, no border) (owner, BRIEF 34) | Button set + Account Log Out | `PS.Button{variant:'plain'}` | 🔄 | 🔄 | — | other lone secondaries: phase-2 question |
| 2026-11-20 | Screens: Onboarding, Short link, inbox-a, Change bank card | entries 16–19 | pages built / aligned, PS.RatingStar, short-link page | ✅ | ✅ | ✅ | 19 frames compared at 360 |
| 2026-11-20 | Screens: FAQs (7) + Loan history (5), LoanHistoryItem | entry 21 | pages built | ✅ | ✅ | ✅ | |
| 2026-11-20 | Coupon center (28 frames) + CouponOption, CouponPayCard | entry 24 | to build | ✅ | ⏳ | — | |
| 2026-11-20 | Orange countdown token `Content/Urgent` (orange-700) + orange scale (owner, BRIEF 38) | coupon countdowns | `--content-urgent` (dev JSON 651 vars) | ✅ entry 25 | 🔄 | — | |
| 2026-11-20 | Slider card un-retired (owner): `OrderAmountCard` = the demo's order card, on all 14 frames; coupon Loan detail frames → current amount entry / order pieces; retired screens behind sheets replaced (owner, BRIEF 39); LoanStateCard keeps its tile | coupon Loan detail ×3, rating sheet bg | `PS.LoanStateCard` tile kept | 🔄 | ✅ tile | — | |
| 2026-11-20 | Screens: miniapp loading, App download, global fallback, Mobile phone change (6), Rating popover (3), Order state (4) | entry 22 | pages in progress | ✅ | ✅ | ✅ | Section 1 skipped (owner: exploration A / B) |
| 2026-11-20 | BRIEF 34–37: Button Plain on Log Out, glass light tooltip, 17 graphics rescaled, legacy Close on 47 pop-ups | entry 23 | demo already matched the close; Plain / glass tooltip done | ✅ | ✅ | — | 147 overlays re-shot |
| 2026-11-20 | Credit limit increase on its original ground and pill fills; motion sheets `parity/motion/` | — | `rebrand/prototypes/credit-limit-coins/baked/` | n/a | ✅ | ✅ | owner checks on the phone |
| 2026-11-20 | Upload progress dark green (bar, ring, ring icon + label, ✓ Uploaded) (owner, BRIEF 29) | DocCard / FileRow / selfie upload ring | `--bg-positive-strong` (dev JSON 623 vars) + `--content-accent-strong` | ✅ | 🔄 | — | |
| 2026-11-20 | Active PlaceTab green-500 + navy label (owner, BRIEF 30) | PlaceTab 11166:4420 | `PS.PlacePicker` tabs | ✅ | 🔄 | — | |
| 2026-11-20 | Illustrations untouched; icons = the exact legacy icons, colour only (owner, BRIEF 32) | ✅ entry 18–19: 68 icons back to legacy mains, remote legacy instances → library, checker rules iconNotLegacy + remote legacy | ✅ byte-for-byte root files, colour via CSS (8 files restored) | ✅ | ✅ | — | exceptions: Filled twins (22), animations (12) |
| 2026-11-20 | Search matches in results dark green (owner, BRIEF 31) | PlaceRow / bank / method search results | `PS.PlacePicker`, bank search, `PS.FormField` suggestions | ✅ | 🔄 | — | |
| 2026-11-20 | Typography: 21 styles — Body/sm 12/16 400, Body/xs 11/14 400 added (owner, BRIEF 33, after `tokens/TYPE-GAPS.md`) | new styles + rebind 79 + 33 texts, bind 179 unstyled, fix 9 Title/xs → Body/lg-strong | `.ps-text-body-sm/-xs` (dev JSON 639 vars) | ✅ entry 20 | ✅ | — | file name stays Label/sm |
| 2026-11-20 | Activity tiles swapped: Loan Approved green, Repayment Completed navy-600 (owner, BRIEF 28) | ActivityItem 11157:4385 | `PS.ActivityItem`, `--bg-brand-muted` (dev JSON 622 vars) | 🔄 | ✅ | — | |
| 2026-11-20 | Dark green (green-800) for empty-panel icon + title and step numbers (owner, BRIEF 27) | `Content/Accent-strong` (new variable) | `--content-accent-strong` (dev JSON 621 vars) | 🔄 | 🔄 | — | |
| 2026-11-20 | Back buttons: legacy back icon instead of a rotated Chevron right (owner, BRIEF 26) | `Icon / Chevron left` from legacy nav/chevron-left; every back button | exported into `shared/ps-ui/assets/icons` | 🔄 | ⏳ after Figma | — | |
| 2026-11-20 | Date picker month / year controls equal width (owner, BRIEF 25) | DatePicker header, all views | `PS.DatePicker` | 🔄 | 🔄 | — | |
| 2026-11-20 | Secondary next to a primary → grey Button Variant=Neutral (owner, BRIEF 24) | Button set + two-button rows | `PS.Button{variant:'neutral'}` | 🔄 | 🔄 | — | single secondaries stay outlined |
| 2026-11-20 | Every frame named by its structure (owner, BRIEF 23): screens `<Section> / <Screen> / <State>`, layers from one role vocabulary, 0 default names | all Rebranding frames + library | — | ✅ | n/a | — | legacy untouched |
| 2026-11-20 | List rows with an icon tile → no tile, Filled icon 24 navy (owner, BRIEF 22); missing filled icons drawn to match the outlined set | icon set `Icon / … / Filled`, PermissionCard, Accordion, rows | exported from Figma into `shared/ps-ui/assets/icons` | 🔄 | ⏳ after Figma | — | |
| 2026-11-20 | Tooltip: white on dark backgrounds (Tone=Light), icon colour = text colour in both tones (owner, BRIEF 21) | Tooltip 10991:* | `PS.Tooltip` / `APP.tipAt` | 🔄 | 🔄 | — | the dark tooltip's icon was near-black |
| 2026-11-20 | Empty states: 2 : 3 above / below in their container (centre at 40 %), min 24 px, one rule everywhere (owner, BRIEF 20) | every frame with an EmptyState | `PS.EmptyState` + its containers | 🔄 | 🔄 | — | e.g. method picker 'No repayment method found' sat at the top |
| 2026-11-20 | Every sheet / popover on the scrim + Elevation/2; sheet header 12 gap, scroll-linked header shadow; Recommend tag → Accent Strong (owner, BRIEF 19) | Sheet + every pop-up frame | `PS.Sheet`, `PS.Popover`, page sheets | 🔄 | 🔄 | — | Page sheets had no scrim before |
| 2026-11-20 | ScamStrip and other tints on the page → mist ambient-300 (owner, BRIEF 18) | rebind to Surface/Tint/Default | `--surface-tint` (dev JSON 620 vars) | 🔄 | 🔄 | — | legacy blue tints had become ambient 50–200 = page colour |
| 2026-11-20 | Retire card styles to "bin" (owner, BRIEF 17): white CreditCard ± paused notice, blue-gradient card, navy ring card (Apply-a-loan slider card un-retired, BRIEF 39) | to a "bin" section, variants "_bin/" | same set retired once figma-lib lists them | 🔄 | — | — | legacy untouched |
| 2026-11-20 | Onboarding (4) + Short link (6) screens; Field borderless at rest; Legacy collections restored (backup `figma/legacy-additions-backup.json`) | entry 16 | demo to follow | ✅ | — | — | 115 frames, 113 clean (2 known selfie artefacts) |
| 2026-11-20 | On the navy card: secondary buttons, timer pill, progress tracks, dividers → periwinkle 24 % (owner, BRIEF 16) | rebind to Bg/On-brand, Border/On-brand | `--bg-on-brand`, `--border-on-brand` (v2 tokens.css, dev JSON 619 vars) | 🔄 | 🔄 | — | bar fills white / green unchanged |
| 2026-11-20 | ₱: Hanken's own ₱ at every size (owner, after the small-size comparison `parity/tracking/peso-small.png`) | — | — | ✅ | ✅ | ✅ | no override |
| 2026-11-19 | Amount tracking graded (owner): xxl +4 %, lg +3 %, md +2 %, xs +2 % (was −2 %) | Amount/* text styles | `tokens/v2/tokens.css`, `dev-figma-tokens.css`, `figma-tokens.json` (letterSpacing 8 = 3 %, 9 = 4 %) | 🔄 | 🔄 | — | Source: `v2/build.py` `AMOUNT_TRACK`; comparison `parity/tracking/amount-tracking.png` |
| 2026-11-19 | Demo phase-1 restore list (16 page-layout changes beyond owner requests) | — | log/demo.md | n/a | ✅ restored | — | Home Pay Primary, chips 36, KV/list rows/FileRow/Facts/Installment/UploadTile legacy, inputs 14 (PhoneField 16, owner). Sheet waits for Sheet.md |
| 2026-11-20 | Demo components to legacy-geometry specs + 22 new spec entries, 44 parity PNGs | specs (figma-lib 09–10) | `shared/ps-ui/*`, `parity/demo/*` | ✅ | 🔄 | — | Open: CreditCard compact 170/162, StateCard 184·168/192·160, ProtectionCard 164/180, RepayCard taller; InboxItem; 13 specs without gallery entries; motion frame check |
| 2026-11-20 | Loading dots under the loader coin: blue #2C74BE → green #5CD680 (owner; BRIEF 12, third exception) | Loading page frames | `shared/ps-ui/assets/lottie/loading-dots.json` | 🔄 | 🔄 | — | 4 fills; motion unchanged |
| 2026-11-20 | Credit limit increase: blue → new green (owner; BRIEF 12, second exception) | same map on any frame that shows it | `rebrand/prototypes/credit-limit-coins/baked/` | 🔄 | 🔄 | — | #3FA0F0 → #5CD680, pill text #6FB8F5 → #99E8AB; background #0D1620 and pill fills unchanged (owner); gold coins unchanged |
| 2026-11-20 | Credit limit intro in the rebranded app still loads the legacy root page (dark blue, #3FA0F0, Reddit Sans) | — | to copy into `rebrand/prototypes/credit-limit-coins/baked/` and recolour the interface only | n/a | 🔄 | — | Coin art and motion unchanged; same audit for every `PS.root` page load (Order submit, OTP sheet…) |

## Later — phase 2

- Content/Selected green-600 text on white is 1.9:1 (owner pick, ContactMethod); review in phase 2. (owner, 2026-11-19; do NOT start before every flow is rebuilt in Figma and the demo)

- Text-style twins: 14 legacy-weight twins (TYPE-AND-STYLES "Legacy-weight twins"). Consolidate weights per role with the owner.

- Two placeholder greys in legacy: Field placeholder = neutral-150 #CDD1D4 (kept as primitive in phase 1), Text/Placeholder token = neutral-400 #7D878E. Pick one.

- Countdown contrast: `Content/Urgent` orange-500 #FF5E00 is 3.1:1 on white (owner pick to match legacy, 2026-11-21).

- Green text contrast: green-700 #44A05F is 3.3:1 on white (owner pick, 2026-11-20). Check small green text / links / captions against AA 4.5:1 and agree with the owner.

1. Compare every rebranded page with its Design-page frame, element by element (legacy | new | difference).
2. Derive the overall patterns and rules from them: page margins, section / card / list spacing, header and bottom bar heights, card
   paddings, type use per role, icon sizes, button placement.
3. List where the legacy design files are inconsistent or wrong (missed states, wrong or off-grid spacing, one-off values).
4. Agree the rules with the owner (coordinator batches the questions).
5. Then optimise every page and component to the agreed rules, Figma and demo together, logged here.

Candidates already noted for step 5 (not applied in phase 1):
- Input text 16 px (Body/lg) instead of the legacy 14, for readability only (the app is Android only, so no iOS zoom reason).
- One primary button per screen (Home Pay as Secondary).
- Term chips and list rows at 48 tall (Android touch target ≥ 48 dp).
- Control borders at 3:1 on inputs at rest (legacy fields have none).
- figma-lib Phase 2 notes 19–28 (entries 13–14).
- Lone secondary buttons on the page background: all Plain (white, no border) like Log out? (owner question, BRIEF 34)
- figma-lib's "Phase 2 notes" 1–18 in log/figma.md (entries 09–10).

Until then (phase 1): layout = legacy layout; only colours, tokens, typeface (same sizes) and owner-requested changes.

## Done

(none yet)
