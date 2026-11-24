# PeraSure rebrand — shared brief for every session

Owner: Sam (designer; replies in Chinese, plain language). Coordinator: the main session. Each lane session reads this file first,
works only in its own files, logs what it did in its own log, and reports back. **Nothing is committed or pushed** unless the owner says so.

## What we are doing

The Brand Bible (`~/Downloads/PeraSure_Brand_Bible_FINAL.pdf`, 5.2 Colour, 5.3 CTA, 5.9 App) replaces the app's blue with the logo
colours: **navy #000128 is the ground, green #5CD680 is the action, no light blue anywhere.** At the same time the owner wants the
design quality raised: duplicated / badly built components cleaned up, weak patterns (tooltips, notifications…) redesigned.

- **Demo** (reference, untouched): GitHub repo `samgestudio-dev/Perasure` → local `Perasure/` (`prototypes/app` + `shared/ps-ui`).
- **Rebranded demo**: new folder `Perasure/rebrand/` (copy of the app + components, recoloured and improved).
- **Developers' version**: GitLab `phi_h5_025` → local `phi_h5_025/` (React + TS + Vite). Read-only for us. Its token **structure**
  (Figma variables export `tokens/figma-tokens.json` → `src/styles/figma-tokens.css`, same CSS names) is the structure we follow, so the
  developers mostly swap values. Keep their change cost low: keep CSS names, change values; remove a name only when the colour is gone.
- **Figma** file `OBsvf42AiRapcRrasD7KNm`: legacy pages stay as they are. New work goes on **Component - Rebranding** (`10982:15`),
  **Design - Rebranding** (`10977:32417`) and **Branding** (`10972:32412`). IDs and state: `rebrand/figma/ledger.json`.
- **Workflow (CashSaya style, but parallel):** a change is made in Figma and in the demo **together**, and logged once, with Figma node ids
  and demo files side by side. Not "Figma first, then code".

## ⚠️ Phase rule (owner, 2026-11-19) — read before any screen work

**Phase 1 (now): recolour + invisible changes only.** Every rebranded screen must have the **same layout** as its legacy Design-page
frame — same structure, order, positions, sizes, spacing, copy and states. Only colours (the v2 tokens) and invisible things (token
bindings, component instances instead of drawn shapes, names, Hanken Grotesk with the same sizes) change. Page = legacy page in new
colours, "大差不差". Do **not** "improve" layouts now. The only layout changes allowed are the ones the owner asked for explicitly
(e.g. PhoneField, Segmented style, scrim, coupon gradient, dark tooltip/toast, disabled inputs, notifications copy) — each is a decision below.
Check each new frame against its legacy frame by overlay (legacy | new | difference) before calling it done.

**Phase 2 (only after every flow is rebuilt in Figma and the demo):** compare every rebranded page with its Design-page frame, element by
element; first derive the overall patterns and rules (page margins, section and card spacing, header/bottom bar heights, list rhythm, type
use…) and list where the legacy files are inconsistent or wrong (missing states, wrong spacing, off-grid values); agree those rules with the
owner; then optimise everything to the rules. Tracked in `rebrand/CHANGES.md` → "Later".



## Figma file (owner, 2026-11-20)

Don't edit the design system file `OBsvf42AiRapcRrasD7KNm` any more. The owner duplicates it; all rebrand Figma work continues in that copy
— **rebrand file: `3oi5Omgi2dC5sR0L7Ux5hf` ("PeraSure design system (rebrand)"; replaces the first copy 5SiSMQZXSrS7MHGHuw3grP, which had no edit access)**. Node ids in the copy may differ from the logs. The rebrand content already in the design system file stays there for now (owner: leave it).

## ✅ Colour rule — step for step (owner, 2026-11-20, final; overrides earlier colour choices where they differ)

"Old and new both have full scales — map them one to one." **Green replaces the legacy blue scale step for step** (blue-50 → green-50 …
blue-900 → green-900; blue-950 #000128 is the navy itself). **Neutral, red and green keep the same step — the red scale is unchanged.**
**Text keeps the legacy neutral** (primary / secondary / tertiary … unchanged; a label that was white stays white). **Navy is only the brand
colour for dark brand surfaces** (home / hub / state cards, the brand ground, brand icon tiles, the scrim) — never for text, borders or
controls. E.g.: primary button blue-600 → green-600 (= #5CD680, navy label, see below); brand strokes / focus / slider blue-500 → green-500; brand text
blue-600 → green-600, blue-500 → green-500, blue-700 → green-700; light brand fills blue-50 / 100 → green-50 / 100; toggles, radios, checks
take their legacy blue step in green.
**Checks, radios and toggles** (coordinator, applying the owner's step rule, 2026-11-20): selected fill `Bg/Selected` = green-600 #5CD680
(legacy blue-600), the mark / knob navy — the same pairing as the primary button (#5CD680 + navy, 11:1). No navy controls.
**Green text is one tier darker** (owner, same day, after seeing the pale coupon screen): fills, borders and the button follow the step rule,
but green text and icons on a light background get their own tier. **Updated (owner, direct to the Figma lane, 2026-11-20 later: "深绿色文字浅一个色阶"):
every green text and icon on a light background is green-700 #44A05F** (3.3:1 on white, 3.2:1 on green-50): `Content/Accent-strong`,
`Content/Link/Default`, `Content/Positive/Default`, Tag Accent / Positive default content = green-700; heavy / pressed (`Content/Accent-heavy`,
`Content/Link/Pressed`, `Content/Positive/Strong`) = green-800 #327545 (5.6:1). Legacy blue text of any step (default, light, link) → green-700.
**Icons paired with green text follow the text** (owner, "和深绿色文字搭配的icon也一样"): an icon next to green text binds to the same variable as that text (green-700, or green-800 for heavy). Green text on navy keeps `Content/Accent` green-500. ⚠️ 3.3:1 passes WCAG AA only for large / bold text (≥ 18.66 px bold, ≥ 24 px);
small green body text, links and captions fall below 4.5:1. Owner's pick, kept; logged as a phase-2 check (CHANGES "Later").
**Green scale rebuilt around the Brand Bible green** (owner, same day): #5CD680 is the anchor at **600** (where legacy blue-600, the primary
action, sits); the other steps follow the legacy blue scale's lightness / chroma profile (`tokens/v2/green-scale.py`): 50 #F6FEF7 · 100 #EAFDED ·
200 #D1FBD9 · 300 #B0F6BF · 400 #8DF2A6 · 500 #72EB94 · **600 #5CD680** · 700 #44A05F · 800 #327545 · 900 #18572D · 950 #143A1F. The primary
button is as the Brand Bible: #5CD680 with a navy label (11:1) — the one exception to "white labels stay white".
Tokens: `tokens/v2/build.py` (BLUE_TO + semantic values); rename-map and aliases rebuilt (dev JSON 656 vars); the step check leaves only
the navy brand surfaces as intended exceptions. Kept as explicit owner picks for specific elements: decisions 14 (scrim), 16 (periwinkle on
navy cards), 18 (scam strip mist), 28 (navy-600 repayment tile), 38 (orange countdown). The Figma translator maps every legacy paint by
this rule: legacy variable / raw colour → its legacy scale step → the same step here.

## Green content = green-600 everywhere (owner, 2026-11-20 — superseded by the step-for-step rule above)

"Accent strong is too dark, use 600 — unify them all." `Content/Accent-strong`, `Content/Link/Default`, `Content/Positive/Default` and
`Bg/Positive/Strong` are all **green-600 #43B265**; link pressed = green-700. Every place that said green-800 / green-700 for green text,
icons, progress, search matches, step numbers, legacy brand emphasis and links now uses green-600. The old "green text on white: pending"
is decided. Note: 2.7:1 on white / 2.5:1 on mist — below the 4.5:1 text guideline; the owner's choice.

**"New" labels are green-500** (owner, 2026-11-20, on `11161:11636`): the small "New" badge (and the same count / coupon badges that went
navy) = Tag Accent Strong — fill green-500 `Bg/Positive/Default`, label navy (`Tag/Accent/Content/Strong`).

**Focus = light green everywhere** (owner, 2026-11-20, on `.OtpBox` and PhoneField `11018:750`): every focus / active ring and every text
caret = green-500 #5CD680 — `Border/Focused` now aliases green-500 (was navy). OTP boxes, PhoneField, Search, any input with a focus ring.
Error stays red; other states as legacy.

**Slider is light green** (owner, 2026-11-20, on `11063:2434`): the amount slider's fill and knob = green-500 #5CD680 (`Bg/Positive/Default`)
instead of navy; track and labels as they are.

## ⚠️ Look parity (owner, 2026-11-20 — overrides everything that is not an owner decision)

"Only the colours change; everything else looks the same. Consolidate and optimise the components, then apply them — but they must
look the same." Consolidation is allowed **only if every legacy look can be reproduced exactly by a variant**. Per element, the rebrand
must equal legacy in: shape (fill vs outline, border yes / no and width, radius, notches / cut-outs), size and padding, grouping (e.g.
two icons in one pill stays one pill), badges and counts, icon, text style (size / weight / case), shadow and position. The only allowed
differences are (a) colour values through the token mapping and (b) the owner decisions in this file (2, 3, 8, 10, 12–16, 18–22, 24–31,
33–39). Anything else is a defect, even when the automated check is clean. Review is by eye, element by element, legacy | new side by side.
**Every page is checked and must be pixel-aligned with legacy** (owner, 2026-11-20): same x / y / width / height for every element
(±0.5 px rounding), same spacing. Allowed exceptions, each logged per page with its reason:
- colour values; owner decisions (list above); glyph shapes from the Hanken font (decision 10) — but text boxes keep legacy positions;
- **normalisations of inconsistent legacy** (e.g. pop-up header heights that differ between sheets): pick the legacy value used most
  often (or the one on the grid), apply it everywhere, and list the before / after per frame in `figma/NORMALISATIONS.md` for the owner.
**Colour hierarchy is the legacy hierarchy** (owner, 2026-11-20): every text and icon keeps the level legacy gave it — Primary,
Secondary, Tertiary, Placeholder, Disabled, Inverse, Brand (emphasis), Link, Positive, Negative — whatever the component's default is.
Legacy's blue **Brand** level (big amounts, coupon subtitles, "1st installment", "Detail" links, brand icons) is **dark green**
`Content/Accent-strong` green-800 (owner picked A): the legacy brand text / icon variables now map there (rename-map, aliases); navy
`Content/Brand` is only for content the owner made navy (filled icons, active tab label…). Raw legacy brand-blue text / icon paints map
the same way.
Owner, same day: legacy text sizes with no v2 style (10/16, 12/15, scaled 16.33 / 13.6 …) keep the **nearest v2 style** — a logged
normalisation (1–2 px), no new styles, 11 px stays the minimum.
Per page: overlay legacy | new | difference; every remaining difference is classified (colour / decision N / font glyph / normalisation)
or fixed. A page is done only when nothing unclassified remains.

## The pre-rebrand version stays (owner, 2026-11-20)

The version before the rebrand is kept as it is, everywhere; the rebrand is built next to it, never on top of it. **Every change — code,
assets, docs — goes into a copy inside `rebrand/`: copy first, then edit** (owner, 2026-11-20). The developer-handoff docs therefore live in
`rebrand/handoff/` (README and CLAUDE copies with their new sections, PRODUCT, DESIGN, API, CHANGELOG, docs/decisions, docs/qa, reviews);
the repo root's README.md and CLAUDE.md are back to their originals.
- **Demo:** everything outside `rebrand/` (`prototypes/`, `shared/`, `animations/`, `assets/`, `tokens/`, `index.html`) is never edited for
  the rebrand. Anything the rebrand needs from it is copied into `rebrand/` first (e.g. the Credit limit increase). GitHub `main` keeps
  the pre-rebrand demo; the rebrand goes on its own branch (`rebrand`) and is merged only if the owner says so.
- **Figma:** the Design page (`3259:657`), the old component pages, the old variable collections ("Legacy · …"), the Legacy mode and the
  "Legacy/…" text and effect styles keep their values, and the legacy frames stay bound to them. New work only on "Design - Rebranding"
  and "Component - Rebranding". Never re-point, merge or delete anything a legacy frame uses.
- **Live app:** `phi_h5_025` is read-only for us.

## Usage limit (owner, 2026-11-19 — every task: coordinator, lanes, subagents)

If a session or subagent hits the usage limit, it is tried again **2 h 30 min later**. The coordinator does the retry (SendMessage to the
lane, or a new subagent with the same brief). So that the retry can pick up where it stopped: write progress to your log as you go (what is
done, what is next, ids), not only at the end of a turn.

## Decisions (owner, 2026-11-19)

1. Green text on white — **PENDING**. For now text-safe `green-700 #2B8448` (4.7:1); only via the tokens marked pending in
   `rebrand/tokens/mapping.json`, so it is a one-value change later. Logo green #5CD680 is never text on white.
2. **Toggles, radios, checkboxes: navy. Chips (chosen term), tags, states (paid, verified), links: green.** Segmented controls
   (E-Wallet | Online bank) are the exception (owner, 2026-11-19): grey track `Bg/Neutral/Default`, white thumb `Surface/Default`,
   selected label `Content/Primary`, others `Content/Tertiary`, both `Label/md`.
3. **No light navy / light blue tints.** Light brand fills use ambient (Mist #F0F5F4) instead.
4. Pink and yellow (and their aliases marketing, warning) are removed (legacy).
5. Figma variables: the three collections have mode **Legacy** (old, default) and **Rebrand** (new). Rebrand pages / sections / new
   components set Rebrand explicitly for all three collections. Variable names are unchanged.
6. **Tooltips are dark** (Ink #141E24 / `Color/Neutral/900`, white text) — never white. Notifications and toasts get redesigned too.
7. Primary button: green pill, **navy text**, one per screen. On green surfaces the exception: navy pill, white text.
8. Amount / credit card: flat navy, white text. No gradients (gradients become flat navy) — **except the coupon tickets** (owner,
   2026-11-19): they keep their gradient, in the green scale (green 700 → 600 → 400 → 200; `--gradient-coupon`, `-panel`, `-tab`).
9. Light surfaces stay: Surface #F7FAF9 (`ambient-50`), Mist #F0F5F4 (`ambient-100`), white cards, Ink #141E24 text, Mute #6A757D.
10. **One typeface: Hanken Grotesk for everything** (owner, 2026-11-19, as the Brand Bible says) — body, labels, titles and amounts,
    using Hanken Grotesk's own ₱ (no ₱ borrowed from another font). Inter and Reddit Sans go. Applied through the new token system
    (being rebuilt), not by patching the old tokens.
    Owner, 2026-11-20: keep Hanken's own ₱ at every size too, even where its single bar reads lighter at 12–14 px. No ₱ from another font.
12. **Animations and illustrations stay exactly as they are** (owner, 2026-11-19) — Lottie / GSAP animations, empty states, scam
    tips, rating art, coupon art, every illustration: no recolour, no redraw. **One exception: the spinning coin** (Coins loading:
    the loader coin and Order submit's coin, `animations/coins-loading/*` and its GSAP version) is recoloured to the new brand colours: coin body `#2B74BD` → logo green `#5CD680`, highlight `#78AAE2` → green-300 `#99E8AB`,
    ₱ and details `#F6F9F8` unchanged (owner picked "green coin"). Lottie JSON and the GSAP modules (`rgb(43,116,189)`,
    `rgb(120,170,226)`) both change, in the rebrand copy only.
    **Second exception (owner, 2026-11-20): the Credit limit increase** (`prototypes/credit-limit-coins/baked`, rebrand copy only): every blue
    becomes the new green — accent `#3FA0F0` (number flash, rings, rays, blue stars, focus ring) → green-500 `#5CD680`; increase pill text
    `#6FB8F5` → green-300 `#99E8AB`. **Unchanged (owner, 2026-11-20): the background `#0D1620` and the pill fills** (increase pill `#16304A`,
    date pill `#1B2834`) keep their original colours.
    Gold coins, the orange star, white, motion, physics and timing are unchanged.
    **Third exception (owner, 2026-11-20): the loading dots** under the loader coin (`shared/ps-ui/assets/lottie/loading-dots.json`, rebrand
    copy; `PS.Dots`): blue `#2C74BE` (rgb 44 116 190) → green-500 `#5CD680`, same as the coin body. Motion unchanged.
13. **PhoneField is a one-job component** (owner, 2026-11-19): used only on log-in / change-phone pages, where it is the only
    interactive element on the page — so it is large and calm: separate country pill (flag + +63) and number pill, 64 tall, gap 12,
    value 16 px with digits grouped 3-3-4, no border at rest. Phone numbers inside forms (trusted contact…) use the normal Field.
    Coordinator, 2026-11-20: Android-only does not undo this — the 16 px value here is part of the owner's PhoneField design, not the
    iOS input-zoom rule. Other inputs keep the legacy 14.
14. **Scrim = navy gradient, clear at the top** (owner, 2026-11-19): secondary pages have the native nav bar (not dimmable), so the scrim
    fades from 0 % at the top to 56 % navy at the bottom (`--gradient-scrim`); no blur. Tapping it closes the sheet.
15. **Disabled inputs stay white** (owner, 2026-11-19, on PhoneField `11018:813`; coordinator extends it to every input — Field,
    PhoneField, SelectBar, Search, OtpBoxes): container `Surface/Default` (same as rest, no grey `Bg/Disabled`), icons / flags / images
    at `Opacity/Disabled` (40 %, bound to the variable, never a raw 0.4), all text `Content/Disabled` (label, value, placeholder, prefix),
    border (if the state has one) `Border/Subtle`. Not interactive; no focus ring. Buttons keep `Bg/Disabled`.
16. **Fills on the navy brand card use a bluish light alpha** (owner, 2026-11-20, option D): `Bg/On-brand` / `Border/On-brand` =
    periwinkle `#9DB8FF` at 24 % (`--bg-on-brand`, `--border-on-brand`) for secondary buttons (Chat), the timer pill ("Time remaining …" on the StateCard, which had no fill), every progress-bar
    track (the full bar's background) and dividers on dark cards — replaces white 16 % (`--ps-on-navy`). The bars' own fills (white, green)
    stay as they are.
    **The rule (generalised by the coordinator, 2026-11-20):** on any navy surface (CreditCard, StateCard, HubCard, CreditLimitCard, OfferCard,
    the Onboarding offer card, any other dark card), every *neutral container or line* — secondary button, pill, chip/tag background, timer,
    progress track, legend dot, divider, empty slot — uses `Bg/On-brand` / `Border/On-brand`, including ones that had no fill. What stays:
    text and icons (inverse content), the primary action (green), and *data* fills (the white / green part of a bar, the accent dot).
17. **Retired card styles go to "bin"** (owner, 2026-11-20): the white CreditCard (with or without the "withdrawals paused" notice), the
    blue-gradient card and the navy ring card are no longer used (the Apply-a-loan slider card was un-retired 2026-11-20, see 39). Figma: Rebranding frames moved to a
    "bin" section, variants prefixed "_bin/" (never deleted; the legacy Design page untouched). Demo: the same set retired.
18. **Tints that sit on the page use mist ambient-300** (owner, 2026-11-20, ScamStrip option B): `Surface/Tint/Default` (`--surface-tint`,
    #DFEEE5) with navy text / icon. Cause: legacy light-blue tints were mapped to ambient 50–200, which equals the page (#F0F5F4) and vanishes.
    Rule: any tinted strip, notice or chip that sits directly on the page background uses `Surface/Tint`; tints inside white cards keep
    their ambient fills.
19. **Every pop-up sits on the scrim and casts the Over shadow** (owner, 2026-11-20, on `11182:63676`): every sheet (Plain, Card, Panel and
    the Page sheets — method picker, bank list, coupon picker, city search, which had no scrim before) and every popover sits on the navy
    gradient scrim (BRIEF 14) and has `Elevation/2` (Over). **Sheet header vs content:** the fixed header (handle + search / title + close,
    e.g. "Frame 1940698733") is separated from the content by a 12 px gap (`Spacing/Gap/md`); at rest (scrollTop 0) the header casts no
    shadow; as the content scrolls under it the header shadow (`Elevation/1`, downward) fades in with the distance — opacity = min(scrollTop /
    32, 1) — like the page header's veil. Figma shows two states: At rest (no shadow) and Scrolled (full shadow).
    Coordinator, same review: the "Recommend" tag drew white text on green-500 (≈1.9:1) → Tag Accent **Strong** (green-500 + navy-900 text).
20. **Empty states sit a little above the middle of their container** (owner, 2026-11-20, on `11182:65547`; distance set by the
    coordinator). One rule for every empty state (full page, tab, list, sheet, the method picker's right column): the container is the
    free area that holds it (below the header / tabs / search, above the bottom bar or sheet foot — not the whole screen). The empty-state
    block (picture + text + optional button) is centred horizontally; vertically the space above it : the space below it = **2 : 3**, so its
    centre sits at 40 % of the container height on any phone. Minimum 24 px above and below; when the container is shorter than the block
    + 48, the block starts 24 px from the top and the area scrolls. Demo: flex column with a top spacer `flex: 2` and a bottom spacer
    `flex: 3` (`min-height: 24px` each). Figma: top = round((container height − block height) × 0.4), noted on each frame's EmptyState.
    The loader is not an empty state: it stays in the very middle of the screen.
21. **Tooltip tone follows what it sits on** (owner, 2026-11-20, on `11159:11801`): dark tooltip on light backgrounds (as decided),
    **white tooltip on dark backgrounds** (navy cards — hub, home credit card, StateCard — and any navy surface): `Tone=Light` = surface
    default fill, Elevation/3, navy text. In both tones **the leading icon has the same colour as the text** (dark tone: inverse content;
    light tone: primary content) — it was drawn near-black on the dark bubble. The close icon keeps its muted tone of the same family.
22. **List rows with an icon tile lose the tile; the icon becomes Filled** (owner, 2026-11-20, e.g. "A friendly reminder", the permission
    page): rows that show a white outlined icon on a navy square (permission rows, accordions, any list row with an icon tile) show the
    icon alone, **Filled** style, 24 px, navy (`Content/Brand`), gap 12 to the label (the label moves left with it — owner-requested, so
    allowed in phase 1). Missing filled icons are drawn by figma-lib on the outlined icon's 24 grid: same silhouette, corners and
    proportions, the outline turned solid with inner details knocked out at the outlined stroke width; added to the icon set as
    `Icon / <name> / Filled`. The demo exports them from Figma (never redraws).
23. **Every frame is named by its structure** (owner, 2026-11-20; convention set by the coordinator). Rebranding pages only (legacy
    untouched). No default names anywhere ("Frame 1940698733", "Group 12", "Rectangle 5", "Vector 100", "Ellipse 761"):
    - **Screens:** `<Section> / <Screen> / <State>` in sentence case, e.g. `Payment / Repayment list / Overdue`,
      `Application details / Basic info / Gender popover`. Sections keep the Design-page section names in English.
    - **Inside screens and components:** the role in the layout, from one vocabulary — `Header`, `Title`, `Subtitle`, `Body`, `Content`,
      `Scroll`, `List`, `Row`, `Item`, `Group`, `Section`, `Card`, `Media`, `Icon`, `Label`, `Value`, `Meta`, `Actions`, `Footer`,
      `Bottom bar`, `Divider`, `Spacer`, `Background`, `Glow`, `Mask`. Qualify when there are siblings: `Row / Used`, `Row / Available`,
      `Actions / Primary`. A sheet's fixed top is `Header` (handle + search / title + close), its scroll area `Content`.
    - **Text layers** keep their content as the name only when the text is fixed copy; texts that change (amounts, dates, names) are named
      by role (`Amount`, `Date`, `Name`). Instances keep their component name unless two siblings share it (`Button / Withdraw`).
    - Illustrations and logos keep their art names; their inner vectors may stay as drawn.
    The translator names new nodes this way from now on. Checker rule: 0 default names on Rebranding pages.
24. **Side-by-side secondary buttons are grey** (owner, 2026-11-20, "Try again | Enter manually"): when a secondary button sits in a
    row next to a primary (two-button rows in sheets, dialogs, bottom bars `Type=Two buttons`, result pages), it uses the new Button
    `Variant=Neutral`: fill `Bg/Neutral/Default` (neutral-100), no border, label `Content/Primary`; pressed `Bg/Neutral/Strong`; disabled as
    every button (`Bg/Disabled`, `Content/Disabled`). A secondary button on its own keeps the outlined Secondary.
25. **Date picker: the month and year controls are equal width** (owner, 2026-11-20, on `11206:46087`): the row holds two equal columns
    (each = (row width − 12) / 2, gap 12); in each column the ‹ and › sit at its two ends (16 px icon in a 40 px touch area) and the label is
    centred in the space between, so the controls keep the same width and arrow positions whatever the month ("May" or "December").
    Same in every view of the picker (days, month wheel, year wheel).
26. **Back buttons use the legacy back icon** (owner, 2026-11-20, reference legacy header `5588:5273`): the rebuild used a rotated
    "Chevron right" as a stand-in for the legacy `nav/chevron-left`, which is wrong. The legacy glyph (its exact vector) goes into the v2
    icon set as `Icon / Chevron left` (same stroke and size as legacy) and every back button (TopBar Back, glass back buttons, sheet back)
    uses it; other left-pointing chevrons (date picker ‹) use it too. No rotated or mirrored stand-ins for any icon. Demo exports it from Figma.
27. **Dark green for emphasis icons and titles** (owner, 2026-11-20, on `11159:12570` and `11159:12580`): `Content/Accent-strong`
    (`--content-accent-strong`, green-800 #206335; 6.6:1 on mist, 7.3:1 on white) for the icon and title of informational empty panels
    ("No limit history yet") and for step numbers ("How to improve your credit limit" 1 2 3). Body text stays grey. This also answers the
    pending "green text on white" for these uses: dark green, not green-500.
28. **Activity icon tiles** (owner, 2026-11-20, on `11159:11900`): the tiles are swapped — **Loan Approved = green** (`Bg/Positive/Default`
    green-500, navy icon) and **Repayment Completed = lighter navy** `Bg/Brand/Muted` (`--bg-brand-muted`, navy-600 #304C8C, white icon). The
    amounts keep their colours. An explicit owner exception to "no light navy" (BRIEF 3): navy-600 for icon tiles only.
    Owner, same day (on `11159:12050`): **the icons in both activity tiles are white** (Content/Inverse), the green tile included.
29. **Upload progress is dark green** (owner, 2026-11-20, on DocCard `11168:29432` and the selfie upload ring `11168:21869`): the
    progress bar fill, the dashed upload ring, the ring's icon and "Uploading" label, and the success status ("✓ Uploaded") use dark
    green — fills / strokes `Bg/Positive/Strong` (`--bg-positive-strong`, green-800), text / icons `Content/Accent-strong`. Tracks stay
    neutral; neutral statuses ("Uploading · 62 %", "Compressing…") stay grey; errors stay red.
30. **Selected tab = brand green** (owner, 2026-11-20, on PlaceTab `11186:24712`): the active PlaceTab (Region / Province / City) is
    filled `Bg/Positive/Default` (green-500) with navy label, the same as a selected chip (decision 2). Default and Picked states unchanged.
    Segmented keeps its grey track + white thumb (decision 2 amended).
31. **Search matches are dark green** (owner, 2026-11-20, on `11186:25200`): in every fuzzy-search result list (city / province search,
    bank search, payment-method search, e-mail suggestions) the characters that match the query use `Content/Accent-strong` (green-800),
    same weight as the rest of the row; the rest of the row stays primary.
32. **Illustrations and icons are the originals, only recoloured** (owner, 2026-11-20; restates decision 12 and extends it to icons):
    - **Illustrations** (empty box, laurels, coupon art, scam art, selfie / ID art, logos, every picture): the original art, untouched —
      the same component / image instance as legacy (Figma) or the same file as the root demo (demo). No redraw, no recolour, no tint
      mapping (e.g. the Onboarding laurels' #C8E5DF goes back to the original). Only the animation exceptions in decision 12 apply.
    - **Icons:** the exact legacy icon — an instance of the same main component, or a 1:1 copy of its vector when the legacy one is remote
      or locked — with **only its colour** overridden by a v2 variable. No stand-ins from another set ("Close ← Cancel-Thick", "Alert
      circle ← Warning filled", "More horizontal ← More", rotated chevrons…), no redrawn icons. The only new drawings are the Filled
      twins of decision 22. Demo: the root demo's icon files, recoloured through CSS (`currentColor` / mask), never swapped.
33. **Text styles: 21** (owner, 2026-11-20, after `tokens/TYPE-GAPS.md`): add `Body/sm` 12/16 400 (hints, helper sentences) and `Body/xs`
    11/14 400 (legal / consent); Caption stays 500 for meta labels. The file name stays Label/sm. TYPE-AND-STYLES.md updated.
34. **Log out button has no outline** (owner, 2026-11-20, on `11161:11768`): the Account page's "Log Out" (a lone secondary on the
    page background) uses the new Button `Variant=Plain`: fill `Surface/Default` (white), no border, label `Content/Primary`; pressed
    `Bg/Neutral/Default`; disabled as every button. Other lone secondaries keep the outline until the owner says otherwise (phase-2 question:
    should every lone secondary on the page background be Plain?).
35. **The light tooltip is glass** (owner, 2026-11-20; read by the coordinator as the Tone=Light tooltip of decision 21 — the one on dark
    cards): bubble and arrow `Surface/Glass/Default` (white 80 %) with the `Blur/Glass` effect (the glass buttons' and tab bar's), plus
    Elevation/3; text and icon `Content/Primary`. The dark tooltip on light backgrounds is unchanged.
36. **Graphic components change size with Scale (K), never Resize** (owner, 2026-11-20, on the Radio in `11159:14094`, whose dot
    grew when the radio was made smaller): icons, Radio, Check, logos, illustrations, the coin, badges — any component that is a drawing —
    are sized with Figma's Scale tool (K; Plugin API `node.rescale(factor)`), so strokes, inner shapes, radii and effects scale with it.
    `resize()` is only for layout containers. Better still: a size the system uses often gets its own size variant. Checker rule: no
    graphic instance whose size differs from its main component unless it was rescaled (inner geometry proportional).
37. **Pop-up close button = the legacy Close** (owner, 2026-11-20, reference `8995:18817`): 40 × 40 glass button with the legacy
    `Cancel-Thick` icon at **14 × 14**, centred (13 / 13). Every sheet / popover / dialog close button uses exactly this; the rebrand's X was
    the wrong size. Icon colour per v2 (Content/Primary), size and glyph as legacy.
38. **Orange for countdowns** (owner, 2026-11-20): new palette `orange` 50–950 (500 = legacy #FF5E00) and `Content/Urgent`
    (`--content-urgent`, orange-700 #B83F00: 5.6:1 on white, 5.1:1 on mist) for countdown text and its clock icon (coupon "Expires in
    23:59:59", the coupon tooltip / discount countdowns). Named "urgent", not "warning": the old warning names were deleted and are never
    reused with a new meaning.
    **Owner, 2026-11-21 (supersedes orange-700 above): countdown text = the orange step nearest the legacy colour.** Legacy countdown text is raw
    #FF5E00 (11 texts on the legacy Design page), which is exactly orange-500, so `Content/Urgent` = **orange-500 #FF5E00** (3.1:1 on white,
    2.8:1 on orange-50; phase-2 contrast check). The orange scale itself stays. Countdown rows on coupon cards: no stroke, white fill
    (`13036:56889`, `13036:56972`).
    **Owner, 2026-11-21, on the pill `13036:55898`:** this pill takes the **orange** scale. Each legacy paint (fill, stroke, text, icon)
    → its legacy scale step → the same orange step. Its shape matches legacy exactly. Pills of the same kind follow it (the Figma lane lists them).
39. **Coupon Loan detail frames use the current borrowing pieces** (owner, 2026-11-20): the three coupon "Loan detail" frames built on the
    retired Apply-a-loan card (decision 17) are rebuilt with the current amount entry / order page components. Any sheet or popover whose
    background is a retired screen (e.g. the rating sheet over the old home) gets the current screen behind it.
    **Owner, same day (supersedes the first half of 39 and the slider card's retirement in 17): keep the slider card.** It is the live
    order page card (Withdraw demo, confirm phase: amount + edit, slider ₱500–₱50,000, divider, Loan term, term chips). It becomes the
    library component **`OrderAmountCard`**, built exactly as the demo's card, used on all 14 frames; frames that were binned only because
    of this card come back out of the bin. Checker: no `_bin/AmountCard` instance left.
    Coordinator, same day: **state cards keep their coloured status tile** (LoanStateCard reviewing / declined / method / disbursed, like
    ActivityItem, decision 28) — decision 22 removes tiles only from list rows (permission, accordions, menu rows).
40. **Shadowed components don't clip content** (owner, 2026-11-21, on `13036:56539`): a frame, component or instance with a drop shadow (or a child with one) has clipsContent off, so the shadow is never cut. Where clipping is needed (scroll area, image mask), the shadow moves to an outer, non-clipping wrapper. Checker rule in the Figma kit; in code the same: no overflow:hidden on the element that carries the shadow.
41. **Element picks, owner look-parity review 2026-11-21:**
    - (a) ContactMethod selected (`13036:55882`): all on green-600. Stroke Border/Brand-strong; label + icon on the new Content/Selected = green-600 (⚠️ 1.9:1 on white, phase-2 check).
    - (b) Disabled CouponTicket (`13036:56028`): white background; disabled text and icons stay.
    - (c) CouponPayCard (`13036:56096`): both tags take the "New limit" tag style. Surface/Brand/Subtle + Border/Selected + Content/Accent-strong; icons follow the text.
    - (d) ActivityItem icon tile (`13036:56152` and siblings): Bg/Brand/Muted navy-600 instead of navy-900 ("too heavy").
    - (e) VerifiedBadge star (`13036:56350`): green-600 ("brand strong"), bound to Bg/Positive/Strong (fill scope); check mark stays white.
    - (f) The orange "Best" pill is only CouponTicket `13036:55898`. Other "Best" pills (CouponPickCard `13036:56889`) keep green text: legacy positive-heavy → Content/Positive/Strong.
42. **Colour scales v3: UI Foundations (owner, 2026-11-21; approved and applied in Figma copy `kYyNV2MgxvH1w9bJ46A3yx`).**
    - Work in the copy file `kYyNV2MgxvH1w9bJ46A3yx`. Source: PeraSure UI Foundations v1.0 (`reference/`).
    - Green re-anchored at **500 = #5CD680**; components follow.
    - Navy anchored at **900 = #000128** replaces the neutral scale. The Neutral scale is deleted, and every neutral token moves to navy.
    - **Mist** is its own scale (old Ambient, anchor 100 #F0F5F4).
    - Green 600–800 are smoothed in OKLCH (owner pick): 600 #36A65B (3.1:1), 700 #298648 (4.6:1), 800 #1D6334 (7.3:1).
    - White #FFFFFF and Black #000000 are two base colours, not scales. Alpha tokens stay only where used (owner: no separate scales).
    - Warning, error and typography are out of scope.
    - Proposal: `tokens/v3-SCALES.md`; review page `15004:15` in that file. Decisions 1–41 colour values that conflict are superseded. Migration map: `tokens/v3-map.json`. Small green text on Mist or a green tint uses the 800 token.
11. Scales (`rebrand/tokens/recolour.py` is the single source): green 50–950 with 500 = #5CD680; navy 600 #304C8C, 700 #0F2B74,
    800 #0A1A4A (device), 900 #000128 (brand), 950 #00011A (shade); ambient 300 #DFEEE5 (Mist device); neutral, red unchanged; blue removed.
43. **Semantic layer, Primer-style (owner, 2026-11-21, applied in kYyNV2MgxvH1w9bJ46A3yx).**
    - Grammar: `{fg|bg|border|overlay|shadow|gradient}/{role}[-{emphasis}][-{state}]`.
      - Roles: neutral (no prefix) · accent · brand · success · danger · attention · selected · focus · disabled.
      - Emphasis: subtle < muted < default < emphasis < strong.
      - On-colours: fg/on-emphasis, fg/on-accent.
    - Component tokens: `tag/{neutral,accent,brand,success,danger}/…`, `coupon/…` and `control/checked-bg`.
    - 14 duplicates merged; full table in `tokens/v3-SEMANTIC-PROPOSAL.md`.
44. **Inputs: fixed height, single line with an ending ellipsis (owner, 2026-11-21).**
    - Applies to Field, Search, PhoneField and SelectBar. Boxes have a fixed height; value, placeholder, label and note text is one line, truncated with "…".
    - PhoneField stays at the legacy 328×56 with 14 px text. The iOS zoom issue (decision 13) is handled in code (phase 2).
45. **Gradient styles (owner, 2026-11-21).**
    - UI gradients are paint styles bound to tokens: Gradient/Glass-stroke, Nav-top, Nav-bottom, Nav-bottom-mist and Scrim.
    - The old styles are kept as `Legacy/Gradient/…` for the legacy pages.
    - Illustration gradients and the coupon gradient are not styled.
    - Page-wide sweeps never touch the parity sheet's Legacy source column `11311:21426`.
    - Gradient/Brand-card (owner, 2026-11-21): navy brand cards (home CreditCard / StateCard, HubCard) use bg/brand at 50 % → bg/brand-muted at 100 %.
46. **Corners (owner, 2026-11-21).** No card in the app has square corners. Every state of a component keeps the same shape (radius, size, stroke weight); a pressed state only changes colour. Rows that draw a divider or underline (ListItem, KV, BankRow, PlaceRow, PlaceTab) stay square inside their rounded card, so the divider stays straight.
47. **Copy source (owner, 2026-11-21).**
    - The app's copy wins: sentence case and the PeraSure tone-of-voice wording.
    - Figma's Title Case and its own wording are not copied into the code. Figma copy is to be aligned to the app later.
    - The screen-by-screen differences are in `figma/screen-diff/SCREEN-DIFF-2026-11-21.md`.

## Quality bar (ui-ux-pro-max skill rules we adopt)

- **The app is Android only** (owner, 2026-11-19; no iOS version, pages run in the Android WebView): no iOS-only rules.
- Touch targets ≥48dp (Android); ≥8px between targets; inputs ≥44px tall; 4/8 spacing rhythm.
- Contrast: text ≥4.5:1 (large 3:1), icons and control borders ≥3:1, in every state. Colour is never the only indicator.
- One primary CTA per screen; destructive actions red and separated; disabled = reduced opacity (0.38–0.5) and non-interactive;
  loading disables the button and shows progress.
- Press feedback within 80–150ms, no layout shift (colour/opacity/scale 0.95–1.05 only).
- Input text: legacy size in phase 1 (16 px is a phase 2 readability option; no iOS zoom reason — Android only), line-height 1.5 for body; tabular figures for amounts, dates and timers.
- Forms: visible label (never placeholder-only), error below the field saying cause + fix, validate on blur, error clears once fixed.
- Toasts: don't steal focus, auto-dismiss 3–5s, undo for destructive actions; timeouts show retry.
- Lists: skeletons for waits >1s; content insets so nothing hides behind fixed bars.
- Navigation: bottom nav ≤5 items, icon + label, active state clear; respect safe areas.
- Sheets: visible close + swipe down; scrim measured against the real background.
- Motion: transform/opacity only; exit ≈60–70% of enter; never block input; respect reduced motion.
- No emoji as icons; one icon family; consistent elevation scale.

## Tokens v2 (approved by the owner 2026-11-19) — the only token source from now on

`rebrand/tokens/ARCHITECTURE.md` (the structure) and `rebrand/tokens/v2/` (generated by `v2/build.py`, coordinator only):
`tokens.css` (demo), `legacy-aliases.css` (old names → v2, load after tokens.css), `figma-tokens.json` (developers' format; their own
script output is `dev-figma-tokens.css`), `rename-map.json`, `MAPPING.md` (every old token → new), `migrate-tokens.mjs` (codemod).
The old `rebrand/tokens/recolour.py`, `tokens.css`, `mapping.json`, `figma-tokens.json` are superseded. Figma gets new collections
**Primitive / Semantic / Component** (mode Light); the old ones become **Legacy · …**.

## Requests go to the coordinator, not the owner (owner, 2026-11-19)

Every question, request or proposed change from a lane goes to the coordinator (SendMessage to the main session), never straight to the
owner. The coordinator decides; only decisions that are truly the owner's are batched and asked by the coordinator. If the owner speaks
to a lane directly, the lane does what was asked and tells the coordinator in the same turn.

## Lanes (who writes what — never touch another lane's files)

| Lane | Session | Writes | Reads |
|---|---|---|---|
| Figma library + screens | `figma-lib` | Figma only (it is the **only** session that writes to Figma); `rebrand/figma/ledger.json`, `rebrand/spec/*.md`, `rebrand/log/figma.md` | everything |
| Rebranded demo | `demo-rebrand` | `rebrand/prototypes/`, `rebrand/shared/`, `rebrand/animations/` (coin only), `rebrand/index.html`, `rebrand/log/demo.md` | everything |
| Developer handoff | `dev-handoff` | `rebrand/tokens/MAPPING.md`, `rebrand/DEV-HANDOFF.md`, `rebrand/log/dev.md` | everything, incl. `phi_h5_025/` |
| Coordinator | main session | `rebrand/BRIEF.md`, `rebrand/tokens/recolour.py` and its outputs, `rebrand/CHANGES.md` | everything |

Need a change in another lane's files (e.g. a token value)? Write it in your log under "Requests" and tell the coordinator.

## Figma = demo (parity protocol, owner 2026-11-19 — the CashSaya way, run in parallel)

The rebranded Figma and the rebranded demo must be **the same design**. CashSaya keeps them equal with one change log, components
first, every value a token, and checks against Figma; we do the same, with both sides built at once:

1. **One vocabulary.** A Figma component and its demo component have the same name (`Button` ↔ `PS.Button`), the same properties
   (Figma variant/boolean/text props ↔ React props, same names and values), and the **same state list in the same order**: every Figma
   variant combination shown in the showcase = one entry state in `rebrand/shared/gallery*.js`. Add a state on one side → add it on the other.
2. **One set of values.** Figma binds the variables in the Rebrand mode; the demo uses the CSS name in that variable's code syntax
   (`var(--color-action-bg-primary-default)`). Spacing / radius / stroke / text styles the same way. No raw value on either side. Sizes and
   positions come from the Figma node geometry (rem in the demo), never judged by eye. The values match today (coordinator checked the
   Rebrand mode against `rebrand/tokens/tokens.css`).
3. **One spec per component, written by figma-lib.** When a component is built, figma-lib writes `rebrand/spec/<Name>.md`: Figma node id,
   properties and values, the state list, and per part which variable / text style / spacing token it uses, plus sizes. demo-rebrand builds
   or changes `PS.<Name>` from that spec (and may ask for spec changes via the coordinator). Demo-only behaviour (motion, gestures) is
   written in the same spec under "Behaviour".
4. **One change log.** `rebrand/CHANGES.md` (coordinator) lists every change with both sides: date · component/screen · Figma node ids ·
   demo files · status `Figma ✅ / Demo ✅ / Compared ✅`. An item is done only when all three are ticked. Lanes write their part in their
   own log; the coordinator moves it into CHANGES.md.
5. **Compared, not assumed.** For each component the coordinator puts the Figma screenshot of every state next to the demo render
   (`rebrand/shared/stage.html?entry=<Name>&state=<i>`, same width) and lists differences; the wrong side is fixed (ask the owner when
   unclear). Screens later the same way: Figma frame | demo page | difference.
6. **Draft.** Like CashSaya: the rebrand is a draft — no PeraSure Dev Mode iterations, snapshots or `devmode-*` tags for it.
7. **Commits.** Lanes never commit. The coordinator commits locally (branch `rebrand`, never pushed unless the owner says) after each
   compared item, so the owner can see progress. demo-rebrand keeps a local server running and gives the owner its phone address.

## Log format (`rebrand/log/<lane>.md`)

One entry per change, newest first:

```
### <date> · <short title>
- Figma: <page / node ids> — what changed
- Demo: <files> — what changed
- Tokens: <names> (if any)
- Open: <questions for the owner>
```
