# PeraSure motion specs — by production page / component

Generated from `specs.json` (the source of truth) by `07-motion/verify/render_specs_md.py`. One section per production page or component; each motion lists its target, trigger, timeline, interruption / exit, reduced motion, code (line numbers in the tree after `07-motion/motion.patch`, before step 8), reference take, status and notes; partial motions also say what remains and how to finish.

Counts: done 92, partial 14, n.a. 33 (of 139). Status: done = ported 1:1; partial = see reason / remaining; n.a. = no production counterpart.

## Contents

- [BottomNavigation,](#bottomnavigation) — 1
- [MobileModal](#mobilemodal) — 1
- [src/components/Layout](#srccomponentslayout) — 1
- [src/components/ui/BorrowerProtectionCard](#srccomponentsuiborrowerprotectioncard) — 1
- [src/components/ui/BottomActionButton](#srccomponentsuibottomactionbutton) — 1
- [src/components/ui/Checkbox](#srccomponentsuicheckbox) — 1
- [src/components/ui/CityCascadeSheet](#srccomponentsuicitycascadesheet) — 2
- [src/components/ui/CreditValidityTooltip](#srccomponentsuicreditvaliditytooltip) — 1
- [src/components/ui/DatePickerSheet](#srccomponentsuidatepickersheet) — 5
- [src/components/ui/FullScreenLayer](#srccomponentsuifullscreenlayer) — 1
- [src/components/ui/HeaderActionContainer](#srccomponentsuiheaderactioncontainer) — 1
- [src/components/ui/Input](#srccomponentsuiinput) — 1
- [src/components/ui/Loading](#srccomponentsuiloading) — 2
- [src/components/ui/MobileModal](#srccomponentsuimobilemodal) — 1
- [src/components/ui/NoticeTicker](#srccomponentsuinoticeticker) — 1
- [src/components/ui/Popover](#srccomponentsuipopover) — 1
- [src/components/ui/RouteLoading](#srccomponentsuirouteloading) — 1
- [src/components/ui/Select](#srccomponentsuiselect) — 5
- [src/components/ui/Slider](#srccomponentsuislider) — 3
- [src/features/reloan](#srcfeaturesreloan) — 10
- [src/features/workProfile](#srcfeaturesworkprofile) — 4
- [src/motion/Crossfade.tsx](#srcmotioncrossfadetsx) — 1
- [src/motion/Overlay.tsx](#srcmotionoverlaytsx) — 1
- [src/motion/Sheet.tsx](#srcmotionsheettsx) — 4
- [src/motion/Swap.tsx](#srcmotionswaptsx) — 1
- [src/motion/Toaster.tsx](#srcmotiontoastertsx) — 3
- [src/motion/flows](#srcmotionflows) — 5
- [src/motion/presets.ts](#srcmotionpresetsts) — 3
- [src/pages/AccountPage/Inbox](#srcpagesaccountpageinbox) — 1
- [src/pages/AuthPage/BankCard](#srcpagesauthpagebankcard) — 1
- [src/pages/AuthPage/Identity](#srcpagesauthpageidentity) — 4
- [src/pages/ConfirmPage/Order](#srcpagesconfirmpageorder) — 11
- [src/pages/CreditHistoryPage](#srcpagescredithistorypage) — 1
- [src/pages/HomePage/Account](#srcpageshomepageaccount) — 1
- [src/pages/HomePage/BottomNavigation](#srcpageshomepagebottomnavigation) — 3
- [src/pages/HomePage/CreditAmountCard](#srcpageshomepagecreditamountcard) — 2
- [src/pages/HomePage/CreditIncreaseIntro](#srcpageshomepagecreditincreaseintro) — 6
- [src/pages/HomePage/Home](#srcpageshomepagehome) — 2
- [src/pages/HomePage/Payment](#srcpageshomepagepayment) — 4
- [src/pages/HomePage/WithdrawFlowLayout](#srcpageshomepagewithdrawflowlayout) — 1
- [src/pages/HomePage/WithdrawMainRoute](#srcpageshomepagewithdrawmainroute) — 11
- [src/pages/HomePage/creditIncrease](#srcpageshomepagecreditincrease) — 1
- [src/pages/RepayPage/components](#srcpagesrepaypagecomponents) — 1
- [src/pages/SupportPage](#srcpagessupportpage) — 1
- [—](#) — 8
- [No production counterpart](#no-production-counterpart) — 17

## BottomNavigation,

### M-001 — Press (pill / card) · **partial**

- Area: global · demo: PS.press() / PS.TAP
- Target: `src/motion/press.ts (pressProps) → BottomNavigation, Account menu, BottomActionButton, Checkbox` — pressProps() — every pressable pill / card / row / tab
- Trigger: tap (pointer down -> up): Motion whileTap
- Timeline:
  - scale · 1 → 0.985 · transition: PS.MT.PRESS = {duration:0.06} (both press-in and release)
- Interruption: whileTap reverts to scale 1 on pointer up/cancel with the same 60 ms tween
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/press.ts:16-22`, `src/pages/HomePage/BottomNavigation/index.tsx:191-227`, `src/pages/HomePage/Account/index.tsx:571-573`, `src/components/ui/BottomActionButton/index.tsx:105-118`, `src/components/ui/Checkbox/index.module.css:20-29`, `src/components/ui/Select/SelectSheet.tsx:1-2, 5-7, 13-14, 40-47, 86, 90-104, 106-107, 109-110 …` (lines changed by motion.patch), `src/components/ui/Select/index.module.css:48-52, 54, 135-152, 179-180, 221-223` (.trigger; lines changed by motion.patch), `src/pages/AuthPage/LoginEntry/index.module.css:254-255, 257-258, 262` (.primaryButton; lines changed by motion.patch), `src/pages/CreditLimitPage/index.tsx:26-27, 137, 142, 145` (lines changed by motion.patch), `src/pages/CreditLimitPage/HistorySection.tsx:16-17, 90, 96, 100` (lines changed by motion.patch), `src/pages/CreditHistoryPage/index.tsx:3, 26-27, 111-112, 114, 121, 123-134` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx:5, 10-17, 20-23, 33, 56-78, 81-86, 99-101, 103-108 …` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/PaymentMethodDrawer/index.tsx:1, 3, 5-9, 152, 154-158, 293-314, 355, 358-360 …` (lines changed by motion.patch), `src/components/ui/Alert.tsx:1-3, 5-6, 18-24, 35-43, 45-55` (lines changed by motion.patch)
- Reference: `curves/M-001.json`, strip `strip/M-001.png`, video `video/M-001.mp4` — full
- Status reason: Done in every shared file (SelectSheet, IdentityIdTypeSelect, BankSearchSelect, PaymentMethodDrawer rows / triggers, Identity dialogs, RepaymentPlanDrawer, CancelLoanConfirmDialog, Alert, FraudWarningSheet, CreditHistory tabs, CreditLimitPage, RepayDetailShell head, DatePicker / CityCascade buttons → m.button + pressProps()) and in the withdraw keypad (M-101). The Select trigger and LoginEntry primary button use the CSS form of the same token (0.985 / 60 ms) because they spread native props / are centred with translateX(-50%); the WithdrawMainRoute header buttons use the CSS form (0.92 / 60 ms).
- Remaining: src/features/reloan/components/AmountEditDrawer/index.tsx (+ index.module.css): its buttons still press with the old CSS :active rule
- How to finish: For each button: make it an m.button and spread pressProps() (pill, card, row) or pressProps(true) (round icon button) from src/motion/press.ts; delete its :active transform and transform transition (keep colour transitions at 0.15 s).

## MobileModal

### M-005 — rise / Rise (children rise in one after another) · **done**

- Area: global · demo: PS.rise(el, o) / PS.Rise
- Target: `src/motion/Rise.tsx → MobileModal (Sheet), RepaymentList` — rise() / Rise / useRise — direct children of a box (loaded content, sheet rows)
- Trigger: mount (useLayoutEffect)
- Timeline:
  - opacity · 0 → 1 · transition: Web Animations API: duration 340 ms, easing cubic-bezier(0.22, 0.61, 0.36, 1), fill 'backwards'
  - transform · translateY(y px) (default MT.Y.block = 10) → translateY(0px) · transition: Web Animations API: duration 340 ms, easing cubic-bezier(0.22, 0.61, 0.36, 1), fill 'backwards'
  - filter · blur(3px) → blur(0px) · transition: Web Animations API: duration 340 ms, easing cubic-bezier(0.22, 0.61, 0.36, 1), fill 'backwards'
- Delay / stagger: delay = o.delay (default 60 ms) + min(i - skip, 8) * gap (default 40 ms); o.skip keeps the first n children still; capped at the 9th child
- Reduced motion: Skipped entirely when PS.reduce (prefers-reduced-motion) — children appear at once (core.js:69)
- Code: `src/motion/Rise.tsx:35-72`, `src/motion/Rise.tsx:79-124`, `src/motion/Sheet.tsx:176-189`, `src/pages/HomePage/Payment/components/RepaymentList/index.tsx:28-32`
- Reference: `curves/M-005.json`, strip `strip/M-005.png`, video `video/M-005.mp4` — full

## src/components/Layout

### M-008 — Page change crossfade · **done**

- Area: global · demo: PS.Pages (dir 0 / 1 / -1)
- Target: `src/components/Layout/GlobalLayout/index.tsx (+ src/pages/HomePage/index.tsx for the tabs)` — PageTransition — m.div page box around the frozen useOutlet() / the active Home tab panel
- Trigger: page id changes (APP.go / swap / back)
- Timeline:
  - opacity · 0 → 1 · transition: enter: opacity on PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]} (x/y stay 0%); exit: opacity 1->0 on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}, zIndex 0
- Delay / stagger: new page fades in 70 ms after the old begins fading (ENTER.delay)
- Exit: AnimatePresence initial={false} custom=dir; leaving page gets pointerEvents 'none' (useIsPresent) — takes no taps
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/PageTransition.tsx:132-138` (SHARED_PAGE_PREFIXES), `src/motion/PageTransition.tsx:47-164`, `src/motion/presets.ts:63-65`, `src/components/Layout/GlobalLayout/index.tsx:570-592`, `src/components/Layout/GlobalLayout/index.tsx:639`, `src/styles/global.css:120-128`, `src/pages/HomePage/index.tsx:509-524`, `src/pages/HomePage/index.module.css:11-15`
- Reference: `curves/M-008.json`, strip `strip/M-008.png`, video `video/M-008.mp4` — full
- Decision: SHARED_PAGE_PREFIXES = ["/account/faqs", "/credit-history"]: routes that render the same page component keep it mounted (no crossfade).

## src/components/ui/BorrowerProtectionCard

### M-109 — Borrower protection toggle (Protected / Add) · **done**

- Area: flow · demo: withdraw.js confirmBlocks() protection button
- Target: `src/components/ui/BorrowerProtectionCard` — BorrowerProtectionCard — toggle
- Trigger: tap
- Timeline:
  - width/background/border · transition: 150 ms cubic-bezier(0.2,0,0,1)
  - scale (press) · — → 0.96 · transition: 60 ms
  - label crossfade · transition: 150 ms
- Code: `src/components/ui/BorrowerProtectionCard/index.module.css:66-137` (unchanged)
- Reference: `curves/M-109.json`, strip `strip/M-109.png`, video `video/M-109.mp4` — full
- Status reason: Production already has the demo values (prod P-067).

## src/components/ui/BottomActionButton

### M-055 — Busy dots pulse · **done**

- Area: component · demo: PS.Busy
- Target: `src/components/ui/BottomActionButton/index.tsx` — BottomActionButton loading — BusyDots replaces the label
- Trigger: button waiting
- Timeline:
  - opacity · 0.35 → 1 · transition: CSS @keyframes ps-busy {0%,60%,100% opacity .35; 30% opacity 1} 0.9s ease-in-out infinite; delays 0, 0.15s, 0.3s
- Reduced motion: CSS @media reduce: animation none, opacity 0.7
- Code: `src/motion/BusyDots.tsx:9-19`, `src/motion/motion.module.css:6-50`, `src/components/ui/BottomActionButton/index.tsx:105-118`
- Reference: `curves/M-055.json`, strip `strip/M-055.png` — full
- Decision: OPEN-DECISIONS 7: a loading BottomActionButton shows three dots instead of its label.

## src/components/ui/Checkbox

### M-030 — Contact method / radio / selbar / consent / check colour · **done**

- Area: component · demo: PS.ContactMethods, PS.SelectBar, ps-radio, PS.Consent, PS.Check, ps-term, ps-seg__tab, ps-ltabs__tab, ps-tabs__tab, ps-pop__opt, vote chip, date day
- Target: `src/components/ui/Checkbox/index.module.css (+ BankCard tabs, Select rows)` — Checkbox / selection colour — border / colour
- Trigger: selection change
- Timeline:
  - color / border-color / background-color / box-shadow · off → on · transition: CSS transition 0.15s ease (PS.MT.COLOR = 0.15)
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Code: `src/components/ui/Checkbox/index.module.css:20-29`, `src/pages/AuthPage/BankCard/index.module.css:71-79`, `src/components/ui/Select/index.module.css:154-157`, `src/components/ui/CityCascadeSheet/index.module.css:1-5, 7, 17, 21, 26, 80-81, 85-86, 103 …` (lines changed by motion.patch), `src/pages/CreditHistoryPage/index.module.css:34-36, 43-55` (lines changed by motion.patch), `src/components/ui/Select/SelectSheet.module.css:17-19, 176-179, 205-208` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/PaymentMethodDrawer/index.module.css:5-6, 23, 47, 432, 442-449, 484-485` (lines changed by motion.patch), `src/components/ui/EmailField/index.module.css:134-138` (lines changed by motion.patch), `src/components/ui/Input/index.module.css:68-72` (lines changed by motion.patch)
- Reference: `curves/M-030.json`, strip `strip/M-030.png` — full
- Status reason: Selection colour 150 ms everywhere in scope: CityCascadeSheet tabs (160 → 150), CreditHistory tabs (160 → 150), SelectSheet / IdentityIdTypeSelect option colour + indicator, BankSearchSelect rows, PaymentMethodDrawer category / method rows, EmailField suggestions, Input clear button, Alert button. FraudWarningSheet dots now follow the swipe (M-065), so no colour transition is left there.

## src/components/ui/CityCascadeSheet

### M-035 — LineTabs underline glide · **done**

- Area: component · demo: PS.LineTabs
- Target: `src/components/ui/CityCascadeSheet/index.tsx` — Region / province tabs — underline
- Trigger: tab change
- Timeline:
  - layout (x, width) · old → new · transition: layoutId on PS.MT.SPRING = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.378, restSpeed:3.78}; label colour 0.15s
- Layout: layoutId
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/CityCascadeSheet/index.tsx:6, 11, 21-24, 60-78, 246, 483, 512, 845-848 …` (lines changed by motion.patch)
- Reference: `curves/M-035.json`, strip `strip/M-035.png` — full
- Status reason: CityCascadeSheet region / province underline is <m.i layoutId="city-cascade-bar" transition={MT.SPRING}/> in the active tab (the ::after underline is gone); label colour 0.15 s.

### M-081 — Places sheet list crossfades · **done**

- Area: component · demo: PS.PlacesSheet (apply.js)
- Target: `src/components/ui/CityCascadeSheet/index.tsx` — CityCascadeSheet — level lists
- Trigger: tab / region / search change
- Timeline:
  - opacity,y(10),filter ·  →  · transition: Crossfade
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Crossfade.tsx:42-84`, `src/components/ui/CityCascadeSheet/index.tsx:6, 11, 21-24, 60-78, 246, 483, 512, 845-848 …` (lines changed by motion.patch)
- Reference: `curves/M-081.json`, strip `strip/M-081.png` — full
- Status reason: CityCascadeSheet level list <Crossfade k={tab-region-province}> in a positioned .listViewport; the body also crossfades between the tabs and the search results (demo); rows / close / clear press via pressProps.

## src/components/ui/CreditValidityTooltip

### M-022 — Tooltip grow from tap · **done**

- Area: component · demo: PS.Tooltip (TipBody)
- Target: `src/components/ui/CreditValidityTooltip/index.tsx` — CreditValidityTooltip — m.div.bubble (transform-origin = tapped icon centre)
- Trigger: open (tap on an info mark)
- Timeline:
  - opacity · 0 → 1 · transition: enter on PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]}; exit {opacity:0, scale:0.98} on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
  - scale · 0.96 → 1 · transition: enter on PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]}; exit {opacity:0, scale:0.98} on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
  - filter · blur(3px) → blur(0px) · transition: enter on PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]}; exit {opacity:0, scale:0.98} on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
- Layout: placement computed in useLayoutEffect: corner covers the anchor reaching 12 px past it, 16 px margins, flips up when no room below; transformOrigin set to anchor centre
- Exit: AnimatePresence; any tap (catcher .ps-tip-catch with no background or the bubble) closes
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/tooltip.ts:14-94`, `src/components/ui/CreditValidityTooltip/index.tsx:41-54`, `src/components/ui/CreditValidityTooltip/index.tsx:137-162`
- Reference: `curves/M-022.json`, strip `strip/M-022.png` — full
- Decision: OPEN-DECISIONS 9: CreditValidityTooltip's own reveal is replaced by the demo's grow-from-icon.

## src/components/ui/DatePickerSheet

### M-046 — Date picker month change (grid crossfade) · **done**

- Area: component · demo: PS.DatePicker
- Target: `src/components/ui/DatePickerSheet/index.tsx` — DatePickerSheet — PS.Crossfade k=y-m .ps-date__grid
- Trigger: ‹ › arrow tap or horizontal swipe on days
- Timeline:
  - opacity · 0 → 1 · transition: Crossfade (PS.fade(10)), popLayout
  - y · 10 → 0 px · transition: Crossfade (PS.fade(10)), popLayout
  - filter · blur(3px) → blur(0px) · transition: Crossfade (PS.fade(10)), popLayout
- Interruption: swipe: pointerdown->pointerup with |dx| > PS.px(40) and |dx| > 1.5*|dy|: dx<0 next month, dx>0 previous; arrows clamp to min/max month (step past range lands on the end); disabled at the very end
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/DatePickerSheet/CalendarPane.tsx:1-3, 15-16, 21-23, 26-31, 36, 41-43, 55-57, 66-78 …` (lines changed by motion.patch), `src/components/ui/DatePickerSheet/index.tsx:3-4, 11, 16-20, 22-26, 37-38, 42-43, 45, 53-80 …` (lines changed by motion.patch), `src/components/ui/DatePickerSheet/dateUtils.ts:44-46, 52` (lines changed by motion.patch)
- Reference: `curves/M-046.json`, strip `strip/M-046.png` — full
- Status reason: Month grid <Crossfade k={`${y}-${m}`} y={10}>; the weekday row stays still; the calendar is always six rows (R-DATES); arrows switch at once, clamp to min / max and grey out at the ends; a horizontal swipe |dx| > 40 && |dx| > 1.5·|dy| changes month. The outgoingMode / outgoingCalendarDate / paneTransitionDirection state machine and its keyframes are deleted.

### M-047 — Date picker month/year label swap · **done**

- Area: component · demo: PS.DatePicker
- Target: `src/components/ui/DatePickerSheet/index.tsx` — DatePickerSheet — PS.Swap in .ps-date__label
- Trigger: month or year changes
- Timeline:
  - opacity,y,filter ·  →  · transition: PS.Swap y MT.Y.digit (6)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/DatePickerSheet/index.tsx:3-4, 11, 16-20, 22-26, 37-38, 42-43, 45, 53-80 …` (lines changed by motion.patch)
- Reference: `curves/M-047.json`, strip `strip/M-047.png` — full
- Status reason: Month and year labels: <Swap block k={label} y={MT.Y.digit}>.

### M-048 — Date picker days <-> wheel crossfade · **done**

- Area: component · demo: PS.DatePicker
- Target: `src/components/ui/DatePickerSheet/index.tsx` — DatePickerSheet — PS.Crossfade k='date'|'wheel'
- Trigger: tap month/year label
- Timeline:
  - opacity · 0 → 1 · transition: Crossfade (PS.fade(10))
  - y · 10 → 0 px · transition: Crossfade (PS.fade(10))
  - filter · blur(3px) → blur(0px) · transition: Crossfade (PS.fade(10))
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/DatePickerSheet/index.tsx:3-4, 11, 16-20, 22-26, 37-38, 42-43, 45, 53-80 …` (lines changed by motion.patch)
- Reference: `curves/M-048.json`, strip `strip/M-048.png` — full
- Status reason: Days ↔ wheel: <Crossfade k={"date" | "wheel"}>; the wheel remounts per mode.

### M-049 — Wheel picker · **done**

- Area: component · demo: PS.Wheel
- Target: `src/components/ui/DatePickerSheet/WheelPane.tsx` — WheelPane — @ncdai/react-wheel-picker
- Trigger: drag / scroll
- Timeline:
  - wheel rotation (rows) ·  →  · transition: library physics: visibleCount 12, optionItemHeight round(PS.px(40)), dragSensitivity 3, scrollSensitivity 5, infinite for 12-month list
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/DatePickerSheet/WheelPane.tsx:1-2, 4, 8-16, 38-52, 54, 62, 65, 67 …` (lines changed by motion.patch), `src/components/ui/DatePickerSheet/index.module.css:1-3, 102, 139-140, 154-158, 180-186, 201-202, 207-212, 281 …` (lines changed by motion.patch)
- Reference: `curves/M-049.json`, strip `strip/M-049.png` — full
- Status reason: WheelPane: visibleCount 12, optionItemHeight 40, dragSensitivity 3, scrollSensitivity 5, infinite month list, non-passive touchmove preventDefault; highlight band moved to the 40 px row. All available in the installed 1.2.2; the package stays 1.2.2 (demo vendors 1.2.3).

### M-050 — Selected day circle · **done**

- Area: component · demo: PS.DatePicker
- Target: `src/components/ui/DatePickerSheet/index.tsx` — DatePickerSheet — .ps-date__day > i
- Trigger: tap a day
- Timeline:
  - opacity · 0 → 1 · transition: CSS transition opacity 0.15s ease; text colour 0.15s
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Code: `src/components/ui/DatePickerSheet/index.module.css:1-3, 102, 139-140, 154-158, 180-186, 201-202, 207-212, 281 …` (lines changed by motion.patch)
- Reference: `curves/M-050.json`, strip `strip/M-050.png` — full
- Status reason: Selected day circle fades in over 0.15 s and the number colour changes in 0.15 s.

## src/components/ui/FullScreenLayer

### M-098 — Home -> loan screen: sheet slides up · **done**

- Area: flow · demo: withdraw.js loanScreen()
- Target: `src/components/ui/FullScreenLayer/FullScreenLayer.tsx` — FullScreenLayer (withdraw route layer) — .backdrop
- Trigger: /withdraw mounts (tap Withdraw on Home)
- Timeline:
  - translateY (whole layer) · layer height (FULL) → 0 · transition: Smooth spring {type:spring, stiffness 240, damping 30, mass 1} (MT.SPRING feel) (Motion default rest for px)
  - transform at rest · translateY(0) → '' (released so fixed descendants use the viewport)
- Interruption: a new open restarts from FULL; exit while entering stops the entry (cleanup)
- Exit: {"close-button / app back": "requestExit → layer y → offsetHeight in 0.3 s ease [0.4, 0, 1, 1], then navigate(-1)", "business-complete": "layer opacity → 0 on MT.LEAVE (0.15 s [0.4,0,1,1]) = the page crossfade home (M-132), then navigate(-1)", "note": "pointer-events none while leaving (R-LEAVE-NOTAPS)"}
- Reduced motion: no slide, no exit motion (navigate at once) — added, not in demo
- Code: `src/components/ui/FullScreenLayer/FullScreenLayer.tsx:91`, `src/components/ui/FullScreenLayer/FullScreenLayer.tsx:105`, `src/pages/HomePage/WithdrawFlowLayout/index.tsx:390`
- Reference: `curves/M-098.json`, strip `strip/M-098.png`, video `video/M-098.mp4` — full
- Deviation: The old CSS slide-up (24 px, 300 ms ease-out) and QuoteForm withdraw-card-enter (420 ms) are removed: the whole layer rises as the demo sheet.
- Deviation: Coverage detection now re-inspects on the custom event fullscreenlayer:entered (no CSS animationend).

## src/components/ui/HeaderActionContainer

### M-010 — Header veil fades in on scroll · **done**

- Area: global · demo: PS.Screen / PS.TopBar / PS.Bands
- Target: `src/components/ui/HeaderActionContainer/index.module.css (+ GlobalLayout useScrollVeil)` — HeaderActionContainer .gradient::before — header veil opacity = --motion-top-fade
- Trigger: scroll (scrollTop 0 -> 24 px)
- Timeline:
  - opacity (--ps-top-fade) · 0 → 1 · transition: scroll-linked, no easing: t = clamp(scrollTop / 24, 0, 1) toFixed(3)
- Reduced motion: scroll-linked: unchanged
- Code: `src/motion/useScrollVeil.ts:24-86`, `src/components/Layout/GlobalLayout/index.tsx:570-592`, `src/components/ui/HeaderActionContainer/index.module.css:50-60`
- Reference: `curves/M-010.json`, strip `strip/M-010.png`, video `video/M-010.mp4` — full

## src/components/ui/Input

### M-026 — Field focus ring · **n.a.**

- Area: component · demo: PS.Field / PS.FormField
- Target: `src/components/ui/Input/index.module.css` — Input — focus state
- Trigger: focus
- Timeline:
  - box-shadow · inset ring transparent → inset ring colour · transition: CSS transition: box-shadow 0.15s ease
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Reference: `curves/M-026.json`, strip `strip/M-026.png` — full
- Status reason: Production Input has no focus ring (background only). If the rebrand adds one: transition: box-shadow 0.15s ease (R-COLOR).

## src/components/ui/Loading

### M-012 — Cover (loading / failed layer) leaves · **partial**

- Area: global · demo: PS.Cover
- Target: `src/components/ui/Loading/Loading.tsx (wrapper overlay) + src/motion/Overlay.tsx Cover` — Loading overlay / Cover — loading layer over content
- Trigger: open false
- Timeline:
  - opacity · 1 → 0 · transition: appears at once (no initial); exit on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
- Exit: AnimatePresence initial={false}; screen gets .is-covered (top extra fades out in CSS 0.2 s ease; solid header background none)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Overlay.tsx:22-35`, `src/components/ui/Loading/Loading.tsx:74-86`
- Reference: `curves/M-012.json`, strip `strip/M-012.png`, video `video/M-012.mp4` — full
- Status reason: Cover (src/motion/Overlay.tsx: there at once, leaves on LEAVE 0.15 s) is ready, and the loaders draw the rebrand coin (M-054). The leave cannot play yet because no production loader stays mounted while it leaves: RouteLoading is a <Suspense fallback>, which React removes in the same commit as the page appears; LoanEstimate returns <RouteLoading /> instead of its page while it checks (index.tsx line 298); Loading.fullscreen() (src/components/ui/Loading/methods.ts) unmounts its own React root at once.
- Remaining: src/router/index.tsx + GlobalLayout: route loading (Suspense fallback); src/pages/AuthPage/LoanEstimate/index.tsx: the check loader; src/components/ui/Loading/methods.ts: Loading.fullscreen()
- How to finish: Keep the loader mounted and let Cover remove it. (1) Router: use a fallback that only reports "loading" (a tiny component that sets a GlobalLayout context flag on mount and clears it on unmount) and render <Cover open={routeLoading} className={fullScreen}><CoinLoader /></Cover> above the outlet in GlobalLayout. (2) LoanEstimate: render the page and put <Cover open={!checked || !visible}> with the loader over it instead of returning RouteLoading. (3) Loading.fullscreen(): keep the root between show / hide, render <Cover open={visible}> and unmount the root in AnimatePresence onExitComplete. Then wrap the arriving content in <Rise> (M-127).

### M-128 — Action wait loader (APP.run) · **done**

- Area: flow · demo: APP.run -> PS.Overlay + PS.Loader
- Target: `src/components/ui/Loading/Loading.tsx` — Loading fullscreen / showLoading — layer
- Trigger: action wait
- Timeline:
  - opacity · 0 → 1 · transition: 0.2 s (SCRIM_IN)
  - opacity (exit) · — → 0 · transition: MT.LEAVE
  - appear delay · note: demo 380 ms; production keeps its own `delay` prop (callers decide)
- Exit: LEAVE
- Reduced motion: opacity only
- Code: `src/components/ui/Loading/Loading.tsx:92`, `src/components/ui/Loading/methods.ts:3`
- Reference: `curves/M-128.json`, strip `strip/M-128.png`, video `video/M-128.mp4` — full
- Deviation: showLoading renders in its own root: wrapped in MotionRoot so m.* animate.

## src/components/ui/MobileModal

### M-002 — Press (icon button) · **done**

- Area: global · demo: PS.press(true) / PS.TAP_ICON
- Target: `src/components/ui/MobileModal/MobileModal.tsx` — MobileModal close button — m.button.closeButton (pressProps(true))
- Trigger: tap: Motion whileTap
- Timeline:
  - scale · 1 → 0.92 · transition: PS.MT.PRESS = {duration:0.06}
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/press.ts:16-22`, `src/components/ui/MobileModal/MobileModal.tsx:252-261`, `src/components/ui/HeaderActionContainer/index.tsx:11-12, 148, 156, 159, 274, 280, 286, 300 …` (lines changed by motion.patch), `src/components/ui/CreditFlowHeader/index.tsx:5-6, 25, 30, 33` (lines changed by motion.patch), `src/components/ui/CreditFlowHeader/index.module.css:40` (lines changed by motion.patch)
- Reference: `curves/M-002.json`, strip `strip/M-002.png`, video `video/M-002.mp4` — full
- Status reason: Header icon buttons are m.button + pressProps(true) (0.92 / 60 ms): HeaderActionContainer (icon, group icons; brand pill pressProps()), CreditFlowHeader back button, all migrated sheet close buttons. CSS 160 ms / 0.94 removed.
- How to finish: For each: make the element an m.button / m.div and spread pressProps() (pill, card, row, tab) or pressProps(true) (round icon button); delete its :active transform and transform transition (keep colour transitions at 0.15s).

## src/components/ui/NoticeTicker

### M-067 — Scam strip marquee · **n.a.**

- Area: component · demo: PS.ScamStrip (pay.js)
- Target: `src/components/ui/NoticeTicker` — NoticeTicker — marquee
- Trigger: mount
- Timeline:
  - transform · translateX(0) → translateX(-100%) · transition: CSS @keyframes ps-marquee {0%,12% translateX(0); 100% translateX(-100%)} 14s linear infinite
- Reduced motion: CSS reduce: animation none
- Reference: `curves/M-067.json`, strip `strip/M-067.png` — full
- Status reason: Production NoticeTicker is a different design (hold + scroll + copy cycle, P-079); the demo scam strip is not in production. Missing in production: a reduced-motion override for the ticker — add @media (prefers-reduced-motion: reduce) { animation: none }.

## src/components/ui/Popover

### M-037 — Popover / menu grow from tap · **done**

- Area: component · demo: PS.Popover (PopCard) / PS.FormField{menu|suggest}
- Target: `src/components/ui/Popover/index.tsx` — Popover — m.div.popover (origin = tap x, top / bottom edge)
- Trigger: tap a menu field (open)
- Timeline:
  - opacity · 0 → 1 · transition: scaleX: PS.MT.MENU {type:'spring', visualDuration:0.22, bounce:0.28}; scaleY: PS.MT.MENU_Y {type:'spring', visualDuration:0.26, bounce:0.3}; opacity {duration:0.1, ease EASE_IN}; filter {duration:0.16, ease EASE_IN}
  - scaleX · 0.5 → 1 · transition: scaleX: PS.MT.MENU {type:'spring', visualDuration:0.22, bounce:0.28}; scaleY: PS.MT.MENU_Y {type:'spring', visualDuration:0.26, bounce:0.3}; opacity {duration:0.1, ease EASE_IN}; filter {duration:0.16, ease EASE_IN}
  - scaleY · 0.22 → 1 · transition: scaleX: PS.MT.MENU {type:'spring', visualDuration:0.22, bounce:0.28}; scaleY: PS.MT.MENU_Y {type:'spring', visualDuration:0.26, bounce:0.3}; opacity {duration:0.1, ease EASE_IN}; filter {duration:0.16, ease EASE_IN}
  - filter · blur(6px) → blur(0px) · transition: scaleX: PS.MT.MENU {type:'spring', visualDuration:0.22, bounce:0.28}; scaleY: PS.MT.MENU_Y {type:'spring', visualDuration:0.26, bounce:0.3}; opacity {duration:0.1, ease EASE_IN}; filter {duration:0.16, ease EASE_IN}
- Layout: placed in useLayoutEffect: 8 px under the anchor (above if more room), centred on the last pointerdown (within 1 s) clamped 8 px from the frame sides; max height 220 (min 120); block: anchor width
- Exit: {opacity:0, scaleX:0.7, scaleY:0.5, filter:blur(4px)} on PS.MT.MENU_OUT {duration:0.12, ease:[0.4,0,1,1]}; tap-outside catcher .ps-pop-catch (no background, closes on click/touchmove)
- Reduced motion: PS.reduce ('calm'): opacity only 0->1 / 1->0 on MENU_OUT, rows appear without motion
- Code: `src/motion/popover.ts:86-133`, `src/motion/popover.ts:67-86`, `src/components/ui/Popover/index.tsx:175-191`, `src/components/ui/Popover/index.tsx:322-351`, `src/components/ui/Popover/index.tsx:199-209` (opening in a layout effect: the card mounts before the first paint after the tap)
- Reference: `curves/M-037.json`, strip `strip/M-037.png` — full
- Decision: Fixed 2026-11-25 (cold test: first frame ~1 frame late, scale crossing 0.6 19 ms late): Popover set `rendered` in a passive useEffect, which ran after the browser had painted the frame after the tap, so the card mounted ~25 ms after the click (demo: before the first frame). It now opens in a useLayoutEffect: card in the DOM 4 ms after the click, grow starts within 5 ms of the demo.
- Decision: Not a port difference: the cold test's "scale crosses 0.95 18 ms early" and "opacity settles 53 ms early" come from the reference take, which has no samples between 73 and 189 ms (dropped frames in the demo recording); a crossing inside that gap cannot be timed. verify/cmp.py marks such crossings as "gap".

## src/components/ui/RouteLoading

### M-127 — Page loading -> content (Loaded) · **partial**

- Area: flow · demo: APP.Loaded
- Target: `src/components/ui/RouteLoading/index.tsx` — RouteLoading / PageLoading — full-screen layer
- Trigger: lazy route loads
- Timeline:
  - loader · note: CoinLoader in the middle of the screen
  - cover exit · note: Suspense swaps instantly in production (no Cover leave); content Rise is M-005
- Code: `src/components/ui/RouteLoading/index.tsx:4`
- Reference: `curves/M-127.json`, strip `strip/M-127.png`, video `video/M-127.mp4` — partial
- Status reason: The route loader is the rebrand coin + dots (M-054, done). The hand-over to the page cannot play the demo's Cover leave + content rise: RouteLoading is a Suspense fallback, removed in the same commit as the page appears.
- Remaining: Cover leave of the route loader (needs M-012 step 1); content Rise when the lazy page arrives
- How to finish: After M-012 (1): GlobalLayout renders <Cover open={routeLoading}> over the outlet, and the page wraps its first content in <Rise> (src/motion/Rise.tsx, SCREEN_RISE) as Home does (M-124).

## src/components/ui/Select

### M-025 — FormField error line · **done**

- Area: component · demo: PS.FormField
- Target: `src/components/ui/Select/index.tsx` — Select — m.div.error
- Trigger: error set
- Timeline:
  - opacity · 0 → 1 · transition: PS.fade(MT.Y.digit=6)
  - y · 6 → 0 px · transition: PS.fade(MT.Y.digit=6)
  - filter · blur(3px) → blur(0px) · transition: PS.fade(MT.Y.digit=6)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/Select/index.tsx:303-311`, `src/motion/presets.ts:30-44`
- Reference: `curves/M-025.json`, strip `strip/M-025.png` — full

### M-038 — Menu rows stagger · **done**

- Area: component · demo: PS.Popover rows
- Target: `src/components/ui/Select/SelectPopover.tsx` — SelectPopover — m.button[role=option] rows
- Trigger: menu open (first time; rows added later just appear)
- Timeline:
  - opacity · 0 → 1 · transition: PS.MT.MENU_ROW(i) = {delay: 0.02 + min(i,8)*0.014, y:{type:'spring', visualDuration:0.24, bounce:0.32}, opacity:{duration:0.12, ease EASE_IN}, filter:{duration:0.12, ease EASE_IN}}
  - y · 10 px * dir (dir = -1 opening down, +1 opening up) → 0 px · transition: PS.MT.MENU_ROW(i) = {delay: 0.02 + min(i,8)*0.014, y:{type:'spring', visualDuration:0.24, bounce:0.32}, opacity:{duration:0.12, ease EASE_IN}, filter:{duration:0.12, ease EASE_IN}}
  - filter · blur(2px) → blur(0px) · transition: PS.MT.MENU_ROW(i) = {delay: 0.02 + min(i,8)*0.014, y:{type:'spring', visualDuration:0.24, bounce:0.32}, opacity:{duration:0.12, ease EASE_IN}, filter:{duration:0.12, ease EASE_IN}}
- Delay / stagger: 20 ms + 14 ms per row, capped at row 8
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/popover.ts:133-153`, `src/components/ui/Select/SelectPopover.tsx:166-218`
- Reference: `curves/M-038.json`, strip `strip/M-038.png` — full

### M-039 — Menu pick: row lights up then folds · **done**

- Area: component · demo: PS.Popover pick
- Target: `src/components/ui/Select/SelectPopover.tsx` — SelectPopover — picked row
- Trigger: tap a row
- Timeline:
  - background-color · transparent → Alpha/Cold Bg/Subtle · transition: CSS transition background-color 0.15s ease; onPick called after setTimeout 90 ms, then menu exits on MENU_OUT
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/Select/SelectPopover.tsx:73-110`, `src/components/ui/Select/index.module.css:154-157`
- Reference: `curves/M-039.json`, strip `strip/M-039.png` — full

### M-040 — Popover scroll thumb + bottom fade · **done**

- Area: component · demo: PS.Popover
- Target: `src/components/ui/Select/SelectPopover.tsx` — SelectPopover — scroll thumb / bottom fade
- Trigger: list scroll
- Timeline:
  - translateY (thumb) · 0 → k*(track-th) px · transition: thumb scroll-linked; fade CSS transition opacity 0.15s ease (0 when < 2 px left)
  - opacity (fade) · 1 → 0 · transition: thumb scroll-linked; fade CSS transition opacity 0.15s ease (0 when < 2 px left)
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Code: `src/components/ui/Select/SelectPopover.tsx:3, 12-15, 61, 71, 73-112, 115-121, 171-180, 194-195 …` (lines changed by motion.patch), `src/components/ui/Select/index.module.css:48-52, 54, 135-152, 179-180, 221-223` (lines changed by motion.patch)
- Reference: `curves/M-040.json`, strip `strip/M-040.png` — full
- Status reason: SelectPopover bottom white fade: <i className={styles.popoverFade}/>, opacity 1 → 0 in 0.15 s when less than 2 px is left, set in updateScrollbar.

### M-041 — Choice sheet pick then close · **done**

- Area: component · demo: PS.FormField{sheet} -> PS.ChoiceSheet
- Target: `src/components/ui/Select/SelectSheet.tsx` — SelectSheet — option pick
- Trigger: tap an option
- Timeline:
  - selection colour · off → on · transition: colour 0.15s, then setTimeout 160 ms -> sheet closes (sheet exit spring)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/components/ui/Select/index.tsx:14, 17-18, 166-172, 200-211, 320-328` (lines changed by motion.patch), `src/pages/AuthPage/Identity/components/IdentityIdTypeSelect/index.tsx:11, 14-17, 21, 67-68, 118-119, 150-156, 159, 161-188 …` (lines changed by motion.patch)
- Reference: `curves/M-041.json`, strip `strip/M-041.png` — full
- Status reason: Choice sheet pick: the picked row changes colour in 0.15 s, then the sheet closes CHOICE_CLOSE_DELAY_MS (160 ms) later (onChange / onSelect fire at once). Select (sheet presentation) and IdentityIdTypeSelect; the popover keeps its 90 ms pick.

## src/components/ui/Slider

### M-070 — Amount slider: finger-follow · **done**

- Area: component · demo: PS.Slider / PS.AmountCard
- Target: `src/components/ui/Slider/index.tsx` — Slider — thumb / fill
- Trigger: pointer drag / keyboard
- Timeline:
  - x (fill) · (pct-100)% →  · transition: none: motion value set at once while held (mv.stop(); mv.set)
  - x (knob) · pct*trackWidth/100 →  px · transition: none: motion value set at once while held (mv.stop(); mv.set)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-070.json`, strip `strip/M-070.png` — full

### M-072 — Slider right end (max) swap · **n.a.**

- Area: component · demo: PS.Slider
- Target: `src/components/ui/Slider` — Slider max label — right end label
- Trigger: max/boost changes
- Timeline:
  - opacity,y(6),filter ·  →  · transition: PS.Swap y MT.Y.digit
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-072.json`, strip `strip/M-072.png` — full
- Status reason: Production slider has no max/boost label that changes.

### M-105 — Slider (withdraw order card) follows the finger · **done**

- Area: flow · demo: withdraw.js slide()
- Target: `src/components/ui/Slider/index.tsx` — Slider — knob/fill
- Trigger: pointer
- Timeline:
  - knob/fill · transition: none — follows the finger
- Code: `src/pages/HomePage/WithdrawMainRoute/index.tsx:514`
- Reference: `curves/M-105.json`, strip `strip/M-105.png`, video `video/M-105.mp4` — full
- Status reason: Finger changes are applied at once (glide.finger()); the Slider itself is M-070.

## src/features/reloan

### M-031 — Keypad keys cascade · **done**

- Area: component · demo: PS.Keypad{cascade}
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm — keypad
- Trigger: mount
- Code: `src/features/reloan/QuoteForm/index.tsx:65`
- Reference: `curves/M-031.json`, strip `strip/M-031.png` — full
- Status reason: Production keypad is the withdraw keypad: see M-099 (withdraw values, not PS.Keypad row+col·0.5).

### M-074 — Amount entry: typed digit in / out · **done**

- Area: component · demo: PS.AmountEntry
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm — glyph boxes + suffix
- Trigger: typed digit pushes the row
- Timeline:
  - translateX (FLIP of every existing glyph and the caret+00+.00 suffix) · previous left − new left → 0 · transition: 0.45 s cubic-bezier(0.4, 0, 0.1, 1) (Motion default layout transition: the demo digits are layout="position")
- Interruption: a new key press cancels and re-measures
- Reduced motion: skipped
- Code: `src/features/reloan/QuoteForm/index.tsx:297`, `src/motion/flows/withdrawTokens.ts:82`
- Reference: `curves/M-074.json`, strip `strip/M-074.png` — full
- Deviation: Production only shifted the suffix (220 ms, (0.2,0,0,1)); now every glyph box + suffix glide 0.45 s like layout="position". The PS.AmountEntry (shared component) version — digit in 0.2 s EASE_IN, y 6, blur 3 / out 0.08 s — is not the withdraw entry; the withdraw DIGIT_IN (M-103) is used.

### M-075 — Caret blink · **done**

- Area: component · demo: PS.AmountEntry
- Target: `src/features/reloan/QuoteForm/index.module.css` — ReLoanQuoteForm — .keypadCaret
- Trigger: always
- Timeline:
  - opacity · transition: psBlink 1 s step-end (withdraw); PS.AmountEntry uses ps-caret 1.06 s steps(1,end)
- Reduced motion: none
- Code: `src/features/reloan/QuoteForm/index.module.css:611`, `src/motion/motion.module.css:50-62`
- Reference: `curves/M-075.json`, strip `strip/M-075.png` — full
- Status reason: Same element as M-104 (withdraw value).
- Decision: The only caret is the withdraw keypad value (QuoteForm), done with M-104.

### M-076 — Amount entry hint/error swap · **n.a.**

- Area: component · demo: PS.AmountEntry
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm — amount hint
- Trigger: error toggles
- Reference: `curves/M-076.json`, strip `strip/M-076.png` — full
- Status reason: The withdraw entry has no error line (the keypad clamps to the maximum silently). Use <Swap k={error ? "err" : "hint"}> if one is added.

### M-099 — Keypad reveal (first open: key by key) · **done**

- Area: flow · demo: withdraw.js keypad()
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm (withdraw-flow) — .keypad > .keypadCell (m.div) per key
- Trigger: amount entry mounts (first open of the withdraw flow)
- Timeline:
  - pad line + keypad wrapper opacity · 0 → 1 · transition: PAD_IN (0.2 s, Motion default ease)
  - each key (cell m.div): opacity, transform · 0, translateY(10px) scale(0.94) → 1, translateY(0px) scale(1) · transition: WD_REVEAL(i): 0.34 s on EASE_IN [0.22, 0.61, 0.36, 1] · delay: 0.06 + 0.03·i s, i = 0…11 in reading order (1 2 3 / 4 5 6 / 7 8 9 / * 0 ⌫): key 0 at 60 ms … ⌫ at 390 ms · note: one transform string (compositor); the press scale lives on the inner button
- Exit: see M-107 (keypad leaves on LEAVE when the morph starts)
- Reduced motion: keys still fade in one after another (opacity cascade); the rise and scale are dropped (a transform string is not covered by MotionConfig reducedMotion="user") — added, not in the demo
- Code: `src/features/reloan/QuoteForm/index.tsx:62-69` (FIRST_OPEN_CASCADE), `src/features/reloan/QuoteForm/index.tsx:276` (reduced motion: fade only), `src/features/reloan/QuoteForm/index.tsx:751-825` (pad line, keypad, keys (WD_REVEAL(i))), `src/motion/flows/withdrawTokens.ts:19-28` (WD_REVEAL), `src/motion/PageTransition.tsx:22-45` (LaterMountsAnimate: what mounts after the first paint of a page plays its initial (the keypad on the normal path))
- Reference: `curves/M-099.json`, strip `strip/M-099.png`, video `video/M-099.mp4` — full
  - Variant `curves/M-099_prod.json`: PRODUCTION take (not the demo): visual + motion tree, vite build --mode test, app opens on Home (?homeMockScene=reloan), tap Withdraw; t=0 = click; recorded 2026-11-25 with 07-motion/verify/rec-prod.mjs
- Status reason: First open: key-by-key cascade (owner rule), matches the re-recorded reference.
- Deviation: "*" key: the demo fades the cell to 0.4; production fades the cell to 1 and keeps the disabled button at opacity 0.4 (same effective opacity).
- Deviation: Mount time: production mounts the keypad when the withdraw route has its data (GET /card/list), 344 ms after the tap in the production take (demo: 20 ms). The cascade is timed from the keypad's mount: key 0 starts 66 ms after the mount in both, key ⌫ 383 ms after it in both (verify/cmp.py aligns M-099 on the mount).
- Decision: Owner rule 2026-11-24: the first open of the amount entry plays the demo's key-by-key cascade (withdraw.js keypad() + motion-tokens.js REVEAL(i)). FIRST_OPEN_CASCADE = true in src/features/reloan/QuoteForm/index.tsx.
- Decision: Reference re-recorded after the demo regression was fixed (withdraw.js `this.ap({ key:'pinned', initial:false }, …)` → `this.ap({ key:'pinned' }, …)`): reference/curves/M-099.json is authoritative.
- Decision: Fixed 2026-11-25 (cold test): on the normal path (the app opens on Home, then Withdraw) the cascade did not play: PageTransition's AnimatePresence initial={false} handed initial:false to everything mounted later inside the first page. PageTransition now wraps each page in LaterMountsAnimate (only the first paint skips initial). Production take of that path: reference/curves/M-099_prod.json (verify/, 2026-11-25).

### M-100 — Keypad reveal (back from order: by rows) · **n.a.**

- Area: flow · demo: withdraw.js keypad() quick
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm — keypad
- Trigger: back from the order page to the entry
- Timeline:
  - opacity/transform per row · 0 / translateY(8px) scale(0.96) → 1 / none · transition: WD_REVEAL_ROW(row): 0.22 s EASE_IN, delay 0.02 + 0.025·row
- Code: `src/motion/flows/withdrawTokens.ts:34`
- Reference: `curves/M-100.json`, strip `strip/M-100.png`, video `video/M-100.mp4` — full
- Status reason: Production has no order → entry path (Back on the order page exits the flow; the amount opens AmountEditDrawer). Token ready for when that path exists.
- Decision: OPEN-DECISIONS 2: no order → keypad path in production; WD_REVEAL_ROW is ready, the reverse morph (M-107 reverse) is not wired.

### M-101 — Keypad key press · **done**

- Area: flow · demo: withdraw.js keypad() inner node
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm — .keypadKey (m.button)
- Trigger: tap a key
- Timeline:
  - scale · 1 → 0.94 · transition: Motion default (no transition prop, as the demo): spring stiffness 500 / damping 25
  - background-color · Surface page #f0f5f4 → --color-stroke-default (fallback #d6d6dd, demo C.line) · transition: Motion default tween 0.3 s
- Interruption: release reverses from the current value
- Reduced motion: scale skipped (MotionConfig reducedMotion user), colour still changes
- Code: `src/features/reloan/QuoteForm/index.tsx:812`, `src/features/reloan/QuoteForm/index.module.css:397`
- Reference: `curves/M-101.json`, strip `strip/M-101.png`, video `video/M-101.mp4` — full
- Deviation: CSS :active (scale 0.94 60 ms, bg 150 ms) replaced by Motion whileTap with library defaults, as the demo.

### M-102 — Pad line in / out · **done**

- Area: flow · demo: withdraw.js padLine()
- Target: `src/features/reloan/QuoteForm/index.tsx` — ReLoanQuoteForm — .divider (data-morph="line") — the ghost copy during the morph
- Trigger: mount: in; morph to the order card: out
- Timeline:
  - opacity · 0 → 1 · transition: 0.2 s (Motion default ease) — not played on first open (initial false, as recorded)
  - opacity / translateY (exit) · 1 / 0 → 0 / −10 px · transition: MT.LEAVE 0.15 s [0.4,0,1,1], starts with the morph
- Exit: ghost removed at rest
- Reduced motion: no ghost (morph jumps)
- Code: `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts:467`, `src/motion/flows/withdrawTokens.ts:45`
- Reference: `curves/M-102.json`, strip `strip/M-102.png`, video `video/M-102.mp4` — full

### M-103 — Typed digit entrance (withdraw) · **done**

- Area: flow · demo: withdraw.js amountBlock() digits (DIGIT_IN)
- Target: `src/features/reloan/QuoteForm/KeypadCharacters.tsx` — KeypadCharacters / KeypadGlyph — span.keypadDigit[data-g=int]
- Trigger: a key appends a digit
- Timeline:
  - opacity · 0 → 1
  - translateY
  - blur
  - None · transition: CSS keypad-digit-enter 380 ms cubic-bezier(0.34,0.02,0.2,1) both (= demo DIGIT_IN)
- Interruption: a deleted digit disappears at once (no exit, as the demo)
- Reduced motion: animation none (existing @media)
- Code: `src/features/reloan/QuoteForm/KeypadCharacters.tsx:22`, `src/features/reloan/QuoteForm/index.module.css:495`
- Reference: `curves/M-103.json`, strip `strip/M-103.png`, video `video/M-103.mp4` — full
- Deviation: Added the demo "born" rule: digits present when the entry opens are still (data-still), only typed positions play the entrance.

### M-104 — Caret blink (withdraw) · **done**

- Area: flow · demo: withdraw.js amountBlock() caret
- Target: `src/features/reloan/QuoteForm/index.module.css` — ReLoanQuoteForm — .keypadCaret
- Trigger: always while entering
- Timeline:
  - opacity · 1 → 0 · transition: @keyframes keypad-caret-blink {0–49 % 1; 50–100 % 0} 1 s step-end infinite (psBlink)
  - opacity (morph) · 1 → 0 · window: 1 − k01 on the ghost caret, riding the first fixed "0"
- Reduced motion: animation none
- Code: `src/features/reloan/QuoteForm/index.module.css:611`, `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts:446`
- Reference: `curves/M-104.json`, strip `strip/M-104.png`, video `video/M-104.mp4` — full
- Deviation: Keyframe split 45/46 % → 49/50 % (psBlink).

## src/features/workProfile

### M-042 — Doc card files open/close · **n.a.**

- Area: component · demo: PS.DocCard
- Target: `src/features/workProfile/documents/WorkDocumentsField.tsx` — Work documents — m.div.ps-doc__body
- Trigger: toggle open
- Timeline:
  - height · 0 → auto px · transition: height: SPRING with restDelta 0.5; opacity: ENTER in / LEAVE out
  - opacity · 0 → 1 · transition: height: SPRING with restDelta 0.5; opacity: ENTER in / LEAVE out
- Exit: AnimatePresence initial={false}
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-042.json`, strip `strip/M-042.png` — full
- Status reason: Production has no collapsible document card (WorkDocumentsField always shows its file list). Spec + HEIGHT_SPRING ready for the rebrand card.

### M-043 — Doc card chevron rotate · **n.a.**

- Area: component · demo: PS.DocCard
- Target: `src/features/workProfile/documents/WorkDocumentsField.tsx` — Work documents — .ps-doc__chev
- Trigger: open toggle
- Timeline:
  - rotate · 90deg → -90deg · transition: CSS transition transform 0.24s cubic-bezier(0.22,0.61,0.36,1)
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Reference: `curves/M-043.json`, strip `strip/M-043.png` — full
- Status reason: No collapsible document card in production (see M-042).

### M-044 — Doc card subtitle / +->chevron swap · **n.a.**

- Area: component · demo: PS.DocCard
- Target: `src/features/workProfile/documents/WorkDocumentsField.tsx` — Work documents — PS.Swap
- Trigger: file count / state change
- Timeline:
  - opacity,y,filter · PS.fade →  · transition: PS.Swap y MT.Y.digit (6) for sub; default y 8 for icon
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-044.json`, strip `strip/M-044.png` — full
- Status reason: No collapsible document card in production (see M-042).

### M-045 — File row status swap + upload bar · **done**

- Area: component · demo: PS.FileRow
- Target: `src/features/workProfile/documents/WorkDocumentsField.tsx` — WorkDocumentsField file rows — per-file status line + <progress>
- Trigger: state change; progress
- Timeline:
  - scaleX (bar) · 0 → progress · transition: Swap y 6 for the meta line; bar transform set per progress with no transition
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/features/workProfile/documents/WorkDocumentsField.tsx:100-136`, `src/features/workProfile/documents/WorkDocumentsField.tsx:4-5, 98-140` (lines changed by motion.patch)
- Reference: `curves/M-045.json`, strip `strip/M-045.png` — full
- Status reason: WorkDocumentsField per-file status line is <Swap k={entry.stage} y={MT.Y.digit} block>; the progress number / bar just update (no animation).

## src/motion/Crossfade.tsx

### M-006 — Crossfade (content replaced: a tab's list) · **done**

- Area: global · demo: PS.Crossfade{k, rise}
- Target: `src/motion/Crossfade.tsx` — Crossfade — m.div keyed on k (popLayout)
- Trigger: k changes
- Timeline:
  - opacity · 0 → 1 · transition: PS.fade(y): initial {opacity:0, y:+y, filter:blur(3px)} -> animate {opacity:1, y:0, filter:blur(0px)} on ENTER; exit {opacity:0, y:-y, filter:blur(3px)} on LEAVE with y = MT.Y.block (10)
  - y · 10 → 0 px · transition: PS.fade(y): initial {opacity:0, y:+y, filter:blur(3px)} -> animate {opacity:1, y:0, filter:blur(0px)} on ENTER; exit {opacity:0, y:-y, filter:blur(3px)} on LEAVE with y = MT.Y.block (10)
  - filter · blur(3px) → blur(0px) · transition: PS.fade(y): initial {opacity:0, y:+y, filter:blur(3px)} -> animate {opacity:1, y:0, filter:blur(0px)} on ENTER; exit {opacity:0, y:-y, filter:blur(3px)} on LEAVE with y = MT.Y.block (10)
- Delay / stagger: rise variant: old exits {opacity:0} on LEAVE; new content's children rise via PS.Rise delay 70 ms, gap 40 ms (skipped on first render if RiseCtx says the page was seen)
- Exit: AnimatePresence initial={false} mode='popLayout' (leaving node popped out of layout so the new one takes its place at once)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Crossfade.tsx:42-84`, `src/motion/presets.ts:30-44`
- Reference: `curves/M-006.json`, strip `strip/M-006.png`, video `video/M-006.mp4` — full

## src/motion/Overlay.tsx

### M-056 — Overlay fade · **partial**

- Area: component · demo: PS.Overlay
- Target: `src/motion/Overlay.tsx` — Overlay — full-screen layer
- Trigger: open
- Timeline:
  - opacity · 0 → 1 · transition: in {duration:0.2}; out PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Overlay.tsx:22-35`
- Reference: `curves/M-056.json`, strip `strip/M-056.png` — full
- Status reason: Overlay (src/motion/Overlay.tsx: fades in 0.2 s, out on LEAVE) is ready. No production layer uses it yet: Loading.fullscreen() mounts / unmounts its own React root (methods.ts lines 15-29), so there is no element left to fade; Order submit has its own layer (M-090, done).
- Remaining: src/components/ui/Loading/methods.ts: the fullscreen loading layer
- How to finish: In methods.ts keep the fullscreen loader's root alive between show and hide and render <Overlay open={visible} className={styles.fullscreen}>…</Overlay> (Loading fullscreen markup inside); unmount the root after the exit (AnimatePresence onExitComplete). Same change as M-012 (3) — use Overlay when the loader should fade in over a visible page, Cover when it must be there at once.

## src/motion/Sheet.tsx

### M-013 — Sheet slide up / down · **partial**

- Area: global · demo: PS.Sheet (SheetBody)
- Target: `src/components/ui/MobileModal/MobileModal.tsx → src/motion/Sheet.tsx` — MobileModal (placement bottom) on Sheet — role=dialog panel (m.div, consumer className)
- Trigger: open true/false
- Timeline:
  - y · 100% → 0% % · transition: enter and exit on PS.MT.SPRING_PCT = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.05, restSpeed:0.5}
- Exit: AnimatePresence; .ps-layer pointerEvents 'none' while leaving (useIsPresent) — closing sheet does not block the page
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Sheet.tsx:119-143`, `src/motion/Sheet.tsx:154-356`, `src/motion/Sheet.tsx:356-387`, `src/components/ui/MobileModal/MobileModal.tsx:219-278`, `src/components/ui/MobileModal/MobileModal.module.css:1-34`, `src/motion/Sheet.tsx:1-387` (new file), `src/motion/SheetDragArea.tsx:1-46` (new; new file), `src/motion/useScrimAttributes.ts:1-49` (new; new file), `src/components/ui/Select/SelectSheet.tsx:1-2, 5-7, 13-14, 40-47, 86, 90-104, 106-107, 109-110 …` (lines changed by motion.patch), `src/components/ui/DatePickerSheet/index.tsx:3-4, 11, 16-20, 22-26, 37-38, 42-43, 45, 53-80 …` (lines changed by motion.patch), `src/components/ui/CityCascadeSheet/index.tsx:6, 11, 21-24, 60-78, 246, 483, 512, 845-848 …` (lines changed by motion.patch), `src/pages/AuthPage/Identity/components/IdentityInUseDialog/index.tsx:1-2, 8-10, 33-34, 47-52, 74, 78-95, 97-114, 116-140 …` (lines changed by motion.patch), `src/pages/AuthPage/Identity/components/IdentityVerifyFailedDialog/index.tsx:1-2, 12-14, 40-41, 74-79, 101, 133-150, 152-160, 162-166 …` (lines changed by motion.patch), `src/pages/AuthPage/Identity/components/IdentityIdTypeSelect/index.tsx:11, 14-17, 21, 67-68, 118-119, 150-156, 159, 161-188 …` (lines changed by motion.patch), `src/pages/AuthPage/BankCard/components/BankSearchSelect/index.tsx:11, 17-20, 26-27, 173, 249-251, 253-273, 275-277, 279-317 …` (lines changed by motion.patch), `src/features/reloan/components/RepaymentPlanDrawer/index.tsx:1, 3, 6-9, 56-58, 105-110, 112-113, 126-129, 144-161 …` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/PaymentDetailDrawer/index.tsx:1, 3, 10-13, 225-227, 233-248, 250-255, 259, 263 …` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/PaymentMethodDrawer/index.tsx:1, 3, 5-9, 152, 154-158, 293-314, 355, 358-360 …` (lines changed by motion.patch), `src/pages/OutPages/DiversionPage/Home/components/DownloadGuideSheet/index.tsx:1, 8-9, 18-20, 27, 29, 31-33, 53-64, 66 …` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/CancelLoanConfirmDialog/index.tsx:1, 3, 5-7, 70-95, 102, 105-108, 110-122, 124-126 …` (lines changed by motion.patch), `src/components/ui/Alert.tsx:1-3, 5-6, 18-24, 35-43, 45-55` (lines changed by motion.patch)
- Reference: `curves/M-013.json`, strip `strip/M-013.png`, video `video/M-013.mp4` — full
- Status reason: 12 of the 13 hand-rolled sheets now run on the shared Sheet (SPRING_PCT slide both ways, unmount after exit, no taps while closing): SelectSheet, DatePickerSheet, CityCascadeSheet, IdentityInUseDialog, IdentityVerifyFailedDialog, IdentityIdTypeSelect, BankSearchSelect (z 1300), RepaymentPlanDrawer (z 1300), PaymentDetailDrawer, PaymentMethodDrawer (z 1020), DownloadGuideSheet, CancelLoanConfirmDialog (centre card, z 1010), plus Alert (centre, z 60). The five that returned null now have real enter / exit (Payment drawers keep the last plan while the exit plays). Timer / CSS mismatches removed (CityCascade 220 vs 260 ms, Identity 220 vs 340 ms). Scrim / panel tracking attributes kept via useScrimAttributes. Left: AmountEditDrawer — not wired in this package.
- Remaining: src/features/reloan/components/AmountEditDrawer: still a hand-rolled sheet (CSS slide)
- How to finish: Move AmountEditDrawer onto the shared Sheet (src/motion/Sheet.tsx) like RepaymentPlanDrawer: <Sheet open onClose placement="bottom" dragStripHeight=…> around its panel, delete its CSS slide / scrim keyframes and timers; the Sheet brings the SPRING_PCT slide, scrim fade, drag-to-close and no-taps-while-closing.
- Decision: OPEN-DECISIONS 8 (drag strip, grab handle off by default).

### M-014 — Sheet scrim fade · **partial**

- Area: global · demo: PS.Sheet
- Target: `src/motion/Sheet.tsx (scrim) via MobileModal maskClassName` — Sheet scrim — m.div scrim (styles.mask)
- Trigger: sheet open/close
- Timeline:
  - opacity · 0 → 1 · transition: in: {duration:0.2} (Motion default ease); out: PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
- Exit: scrim tap = onClose; scrim=false -> transparent catcher, no animation
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Sheet.tsx:237-261`, `src/motion/Sheet.tsx:119-143`, `src/motion/Sheet.tsx:1-387` (new file)
- Reference: `curves/M-014.json`, strip `strip/M-014.png`, video `video/M-014.mp4` — full
- Status reason: Every migrated sheet (M-013) fades its scrim 0.2 s in / LEAVE out through the Sheet; production scrim colours kept. Left: AmountEditDrawer — not wired in this package.
- Remaining: src/features/reloan/components/AmountEditDrawer: scrim without the 0.2 s / LEAVE fade
- How to finish: Move AmountEditDrawer onto the shared Sheet (src/motion/Sheet.tsx) like RepaymentPlanDrawer: <Sheet open onClose placement="bottom" dragStripHeight=…> around its panel, delete its CSS slide / scrim keyframes and timers; the Sheet brings the SPRING_PCT slide, scrim fade, drag-to-close and no-taps-while-closing.

### M-015 — Sheet drag-to-close · **done**

- Area: global · demo: PS.Sheet
- Target: `src/motion/Sheet.tsx (drag) via MobileModal` — Sheet drag-to-close — panel drag="y" from the top strip / title row
- Trigger: drag (pointerdown on the top drag strip)
- Timeline:
  - y · 0 → finger (down only) px · transition: dragConstraints {top:0,bottom:0}, dragElastic {top:0, bottom:0.6}, dragTransition {bounceStiffness:240, bounceDamping:30}; onDragEnd closes if offset.y > 96 px OR velocity.y > 640 px/s -> exit spring to 100%
- Interruption: below threshold: springs back to 0 with bounceStiffness 240 / bounceDamping 30
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Sheet.tsx:209-214`, `src/motion/Sheet.tsx:298-308`, `src/motion/Sheet.tsx:331-340`, `src/components/ui/MobileModal/MobileModal.tsx:60-91`, `src/motion/SheetDragArea.tsx:1-46` (new file)
- Reference: `curves/M-015.json`, strip `strip/M-015.png`, video `video/M-015.mp4` — full
- Status reason: All former useBottomSheetDragDismiss consumers drag through the Sheet (elastic 0.6, closes past 96 px / 640 px/s, springs back 240 / 30): top strip sized to each sheet's top padding so it never covers a control, plus the title / search row via SheetDragArea (its buttons and inputs keep their taps). PaymentMethodDrawer does not drag while paying. useBottomSheetDragDismiss now has no production consumer (kept with its two tests; can be deleted later).
- Decision: OPEN-DECISIONS 8: sheets drag from a 20 px top strip and the title row only; the grab handle is off by default (showGrabHandle).

### M-021 — Sheet content rise · **done**

- Area: component · demo: PS.Sheet
- Target: `src/motion/Sheet.tsx (rise) via MobileModal` — Sheet content rise — panel children after the drag strip / grab
- Trigger: sheet mount
- Timeline:
  - opacity · 0 → 1 · transition: PS.rise {skip:2, delay:110, y:MT.Y.text (8)}: 340 ms cubic-bezier(0.22,0.61,0.36,1), gap 40 ms
  - translateY · 8 → 0 px · transition: PS.rise {skip:2, delay:110, y:MT.Y.text (8)}: 340 ms cubic-bezier(0.22,0.61,0.36,1), gap 40 ms
  - filter · blur(3px) → blur(0px) · transition: PS.rise {skip:2, delay:110, y:MT.Y.text (8)}: 340 ms cubic-bezier(0.22,0.61,0.36,1), gap 40 ms
- Reduced motion: skipped with reduced motion
- Code: `src/motion/Sheet.tsx:176-189`, `src/motion/Rise.tsx:35-72`
- Reference: `curves/M-021.json`, strip `strip/M-021.png` — full

## src/motion/Swap.tsx

### M-003 — Swap (text replaced after a tap) · **done**

- Area: global · demo: PS.Swap{k, y, block}
- Target: `src/motion/Swap.tsx` — Swap — inline-grid span; child keyed on k
- Trigger: k changes (state change)
- Timeline:
  - opacity · 0 → 1 · transition: enter: PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]}; exit: opacity 1->0, y 0->-y, blur 0->3px on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
  - y · +y (default 8; MT.Y.text 8 | block 10 | digit 6) → 0 px · transition: enter: PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]}; exit: opacity 1->0, y 0->-y, blur 0->3px on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
  - filter · blur(3px) → blur(0px) · transition: enter: PS.MT.ENTER = {duration:0.30, delay:0.07, ease:[0.22,0.61,0.36,1]}; exit: opacity 1->0, y 0->-y, blur 0->3px on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
- Delay / stagger: old leaves on LEAVE (0.15 s) while the new waits ENTER.delay 0.07 s then rises 0.30 s; both stacked in gridArea 1/1 so no layout shift
- Interruption: rapid k changes: each old key exits independently; no queue
- Exit: AnimatePresence initial={false} (no animation on first mount), default mode (sync): old and new overlap in the same grid cell
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Swap.tsx:30-65`, `src/motion/presets.ts:30-44`
- Reference: `curves/M-003.json`, strip `strip/M-003.png`, video `video/M-003.mp4` — full

## src/motion/Toaster.tsx

### M-016 — Toasts stack (iPhone notifications) · **done**

- Area: global · demo: PS.Toasts
- Target: `src/components/ui/Toast/index.tsx → src/motion/Toaster.tsx` — Toaster (fed by Toast.show) — stack of m.div slots
- Trigger: new item pushed (every tap shows one at once)
- Timeline:
  - opacity · 0 → 1 (top) / 0.55 / 0.3 · transition: transition {default: SPRING with restDelta 0.01, restSpeed 0.1 (stiffness 240, damping 30, mass 1); opacity: ENTER for the top one, {duration:0.2} for those behind; filter: ENTER}
  - y · -16 → 0 / 10 / 18 (PS.px) px · transition: transition {default: SPRING with restDelta 0.01, restSpeed 0.1 (stiffness 240, damping 30, mass 1); opacity: ENTER for the top one, {duration:0.2} for those behind; filter: ENTER}
  - scale · 0.97 → 1 / 0.94 / 0.88 · transition: transition {default: SPRING with restDelta 0.01, restSpeed 0.1 (stiffness 240, damping 30, mass 1); opacity: ENTER for the top one, {duration:0.2} for those behind; filter: ENTER}
  - filter · blur(3px) → blur(0px) · transition: transition {default: SPRING with restDelta 0.01, restSpeed 0.1 (stiffness 240, damping 30, mass 1); opacity: ENTER for the top one, {duration:0.2} for those behind; filter: ENTER}
- Layout: STACK = [{y:0,s:1,o:1},{y:10,s:0.94,o:0.55},{y:18,s:0.88,o:0.3}] by depth d = n-1-i; zIndex 10-d; only top takes pointer events
- Interruption: new toast pushes older ones down the stack (they animate to the next STACK slot on the spring); 4th oldest exits
- Exit: normal: {opacity:0, y:-10, scale:0.98, filter:blur(3px)} on LEAVE; swiped: {x:'-110%', opacity:0} with x on the spring, opacity on LEAVE
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Toaster.module.css:6-14` (top: 8 px under the header (0rem fallbacks)), `src/motion/Toaster.module.css:29-39` (bubble (visual E051 colour carried over)), `src/motion/Toaster.tsx:35-114`, `src/motion/toastStore.ts:28-61`, `src/motion/Toaster.module.css:6-29`, `src/components/ui/Toast/index.tsx:27-85`
- Reference: `curves/M-016.json`, strip `strip/M-016.png`, video `video/M-016.mp4` — full
- Decision: OPEN-DECISIONS 6: every toast shows at the top (R-TOAST); the 8 Toast.show calls that pass position: 'bottom' now show at the top too.
- Decision: Toaster top uses 0rem fallbacks (not 0px): the px-to-rem build step turns 0px into a unitless 0, which made max() invalid and dropped the toaster to the bottom wherever --motion-header-offset is unset (found in the spot-check).

### M-017 — Toast swipe-left to close · **done**

- Area: global · demo: PS.Toasts
- Target: `src/motion/Toaster.tsx` — Toaster — top toast drag="x"
- Trigger: drag left
- Timeline:
  - x · 0 → -110% % · transition: dragConstraints {left:0,right:0}, dragElastic {left:0.9, right:0.08}; onDragEnd: offset.x < -56 px OR velocity.x < -320 px/s -> swipe (exit x '-110%' on the toast spring, opacity LEAVE) then onClose(id,'swipe')
- Interruption: below threshold: elastic back to x 0
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Toaster.tsx:71-91`, `src/motion/toastStore.ts:28-61`
- Reference: `curves/M-017.json`, strip `strip/M-017.png`, video `video/M-017.mp4` — full

### M-023 — Single Toast · **done**

- Area: component · demo: PS.Toast / PS.useToast
- Target: `src/motion/Toaster.tsx` — Toaster — single toast = top of the stack
- Trigger: msg set (useToast show(text, ms=2600))
- Timeline:
  - opacity · 0 → 1 · transition: default: SPRING with restDelta 0.01, restSpeed 0.1; opacity & filter: ENTER; exit {opacity:0, y:-10, scale:0.98, blur 3px} on LEAVE
  - y · -16 → 0 px · transition: default: SPRING with restDelta 0.01, restSpeed 0.1; opacity & filter: ENTER; exit {opacity:0, y:-10, scale:0.98, blur 3px} on LEAVE
  - scale · 0.97 → 1 · transition: default: SPRING with restDelta 0.01, restSpeed 0.1; opacity & filter: ENTER; exit {opacity:0, y:-10, scale:0.98, blur 3px} on LEAVE
  - filter · blur(3px) → blur(0px) · transition: default: SPRING with restDelta 0.01, restSpeed 0.1; opacity & filter: ENTER; exit {opacity:0, y:-10, scale:0.98, blur 3px} on LEAVE
- Delay / stagger: auto-hides after ms (default 2600 ms)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Toaster.module.css:6-14` (top: 8 px under the header (0rem fallbacks)), `src/motion/Toaster.module.css:29-39` (bubble (visual E051 colour carried over)), `src/motion/Toaster.tsx:35-114`
- Reference: `curves/M-023.json`, strip `strip/M-023.png` — full
- Decision: See M-016 (top placement, 0rem fallbacks).

## src/motion/flows

### M-053 — Loading dots · **done**

- Area: component · demo: PS.Dots
- Target: `src/motion/flows/LoadingDots.tsx` — LoadingDots — svg circles
- Trigger: mount
- Timeline:
  - per dot (start frame 0/9/17/25 of a 60-frame loop @60 fps = 1 s) · transition: each segment cubic-bezier(0.333, 0, 0.667, 1), infinite
- Reduced motion: still
- Code: `src/motion/flows/LoadingDots.tsx:46`
- Reference: `curves/M-053.json`, strip `strip/M-053.png` — full
- Deviation: Hand conversion of loading-dots.json to SVG + WAAPI (no lottie-web in production); crop viewBox 50 130 425 180, 104 × 27.

### M-054 — Loader (coin + dots) · **done**

- Area: component · demo: PS.Loader{fill}
- Target: `src/motion/flows/CoinLoader.tsx` — CoinLoader → RouteLoading, PageLoading, Loading fullscreen / showLoading — 72 px coin (inset 10) + dots 104 × 27, 16 px apart
- Trigger: page / action loading
- Timeline:
  - coin · note: GSAP loading coin repeat −1 (lazy chunk; dots alone until it arrives)
  - dots · note: M-053
- Exit: Loading fullscreen leaves on LEAVE
- Reduced motion: coin first frame, dots still
- Code: `src/motion/flows/CoinLoader.tsx:38`, `src/components/ui/RouteLoading/index.tsx:4, 16-19` (lines changed by motion.patch), `src/components/ui/PageLoading/index.tsx:1, 11-13, 17-18` (lines changed by motion.patch)
- Reference: `curves/M-054.json`, strip `strip/M-054.png` — full
- Deviation: RouteLoading showed text only; PageLoading a bouncing logo + 4 dots; both are now the Loader.

### M-071 — Amount slider glide (coupon / Keep coupon) · **done**

- Area: component · demo: PS.AmountCard useGlide
- Target: `src/motion/flows/useGlide.ts` — useGlide — slider
- Trigger: non-finger change
- Code: `src/motion/flows/useGlide.ts:24`
- Reference: `curves/M-071.json`, strip `strip/M-071.png` — full
- Status reason: Production slider glide is the withdraw one (M-106); coupon-driven PS.AmountCard glide has no production surface.

### M-106 — Slider glide when a coupon changes the limit / Keep coupon (app host) · **done**

- Area: flow · demo: withdraw-host.js sheet.glide(amount)
- Target: `src/motion/flows/useGlide.ts` — useGlide (WithdrawMainRoute order card slider + amount) — Slider value/max, LoanAmountButton amount
- Trigger: the amount or its maximum changes by something other than the finger (AmountEditDrawer Confirm, a term with a lower maximum)
- Timeline:
  - shown amount · previous → new · transition: Smooth spring {type:spring, stiffness 240, damping 30, mass 1} (MT.SPRING feel) + restDelta 0.001, restSpeed 0.01 on a 0→1 progress (MORPH_SPRING, core.ts) — 95 % ≈ 290 ms, rest ≈ 560–600 ms · window: round(lerp(k)/step)·step
  - shown max (knob scale) · previous max → new max · window: lerp(k)
- Interruption: a new change stops the running glide and starts from what is shown
- Reduced motion: jump
- Code: `src/motion/flows/useGlide.ts:24`, `src/pages/HomePage/WithdrawMainRoute/index.tsx:268`
- Reference: `curves/M-106.json`, strip `strip/M-106.png`, video `video/M-106.mp4` — full
- Deviation: Production has no coupons; the demo glide (coupon raises the limit / Keep coupon) is used for the production non-finger changes.
- Deviation: The slider's right-end label is formatLabel(max) and follows the gliding max (the demo shows the final label at once).

### M-111 — Confirm (disabled) tap: scroll to agreement · **done**

- Area: flow · demo: withdraw.js confirmTap()
- Target: `src/motion/flows/agreementNudge.ts` — scrollToAgreement (called by WithdrawMainRoute handleSubmit) — [data-full-screen-scroll-container]
- Trigger: Confirm tapped while the agreement is not ticked
- Timeline:
  - scrollTop · current → scrollHeight − clientHeight · transition: Smooth spring {type:spring, stiffness 240, damping 30, mass 1} (MT.SPRING feel) + restDelta 0.5, restSpeed 5
  - nudge · note: fires when within 24 px of the end
- Interruption: touchstart on the page stops it; a second tap stops and restarts
- Reduced motion: jump to the end, no ripple
- Code: `src/motion/flows/agreementNudge.ts:33`, `src/pages/HomePage/WithdrawMainRoute/index.tsx:421`
- Reference: `curves/M-111.json`, strip `strip/M-111.png`, video `video/M-111.mp4` — full
- Deviation: Replaces production's agreement prompt sheet (owner rule: no error state). AGREEMENT_NUDGE = false restores the sheet (open question).
- Deviation: Confirm keeps the disabled look until ticked but stays tappable (M-113).
- Decision: OPEN-DECISIONS 1: the agreement nudge replaces production's agreement prompt sheet (AGREEMENT_NUDGE = true in src/pages/HomePage/WithdrawMainRoute/index.tsx).

## src/motion/presets.ts

### M-004 — reveal (secondary content entrance, item i) · **done**

- Area: global · demo: PS.reveal(i)
- Target: `src/motion/presets.ts` — reveal(i) — rows / details / OTP boxes
- Trigger: mount
- Timeline:
  - opacity · 0 → 1 · transition: PS.MT.REVEAL(i) = {duration:0.34, delay:0.06 + i*0.03, ease:[0.22,0.61,0.36,1]}; exit {opacity:0} on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
  - y · 8 → 0 px · transition: PS.MT.REVEAL(i) = {duration:0.34, delay:0.06 + i*0.03, ease:[0.22,0.61,0.36,1]}; exit {opacity:0} on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
  - filter · blur(3px) → blur(0px) · transition: PS.MT.REVEAL(i) = {duration:0.34, delay:0.06 + i*0.03, ease:[0.22,0.61,0.36,1]}; exit {opacity:0} on PS.MT.LEAVE = {duration:0.15, ease:[0.4,0,1,1]}
- Delay / stagger: stagger 30 ms per index, base delay 60 ms
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/presets.ts:44-63`
- Reference: `curves/M-004.json`, strip `strip/M-004.png`, video `video/M-004.mp4` — full

### M-009 — Page rises from bottom (dir 2) / goes back down (dir -2) · **partial**

- Area: global · demo: PS.Pages dir 2 / -2
- Target: `src/motion/presets.ts PAGE_VARIANTS + PageTransition dir` — PageTransition dir 2 / -2 — page box
- Trigger: push with dir 2 (Withdraw-like loan screen) / pop with dir -2
- Timeline:
  - y · 100% → 0% % · transition: dir 2 enter: y 100%->0% on PS.MT.SPRING_PCT = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.05, restSpeed:0.5} (zIndex 2->1); old page exit: opacity 1->0.999 over 0.56 s (stays put under, zIndex 0). dir -2: new page enters at y 0% zIndex 0 (no motion); leaving page y 0%->100% in {duration:0.3, ease:[0.4,0,1,1]} zIndex 2
- Exit: pointerEvents none while leaving
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/presets.ts:63-65`, `src/motion/PageTransition.tsx:47-164`
- Reference: `curves/M-009.json`, strip `strip/M-009.png`, video `video/M-009.mp4` — full
- Status reason: PageTransition supports dir 2 / -2 (PAGE_VARIANTS: the new page rises on SPRING_PCT over the old one; back = it goes down in 0.3 s), but no production route passes a direction: GlobalLayout renders <PageTransition pageKey={pageKey}> (dir 0 = crossfade) for every route. The demo uses dir 2 for its loan screen; production's loan screen is the withdraw layer, which rises with its own motion (M-098, done).
- Remaining: any route that should rise over the previous page instead of crossfading (none is listed by the design today)
- How to finish: In src/components/Layout/GlobalLayout/index.tsx compute a direction per navigation — 2 when entering a "rising" route, -2 when leaving it with Back (useNavigationType() === "POP") — and render <PageTransition pageKey={pageKey} dir={dir}>. Nothing else is needed: the variants and the R-LEAVE-NOTAPS handling are in src/motion/PageTransition.tsx / presets.ts.

### M-024 — Field error message · **done**

- Area: component · demo: PS.Field / PS.OtpForm
- Target: `src/motion/presets.ts fade(-4)` — Field error (drops in) — error message under a field
- Trigger: error set
- Timeline:
  - opacity · 0 → 1 · transition: PS.fade(-4): enter ENTER; exit y -> +4 on LEAVE
  - y · -4 → 0 px · transition: PS.fade(-4): enter ENTER; exit y -> +4 on LEAVE
  - filter · blur(3px) → blur(0px) · transition: PS.fade(-4): enter ENTER; exit y -> +4 on LEAVE
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/presets.ts:30-44`, `src/components/ui/EmailField/index.tsx:6-7, 203-210` (lines changed by motion.patch), `src/pages/AuthPage/Identity/components/IdentityIdTypeSelect/index.tsx:11, 14-17, 21, 67-68, 118-119, 150-156, 159, 161-188 …` (lines changed by motion.patch), `src/pages/AuthPage/BankCard/components/BankSearchSelect/index.tsx:11, 17-20, 26-27, 173, 249-251, 253-273, 275-277, 279-317 …` (lines changed by motion.patch)
- Reference: `curves/M-024.json`, strip `strip/M-024.png` — full
- Status reason: EmailField error drops in 4 px from a 3 px blur (fade(-4)) and leaves on LEAVE. Same presence applied to the IdentityIdTypeSelect and BankSearchSelect error lines with fade(MT.Y.digit) (their Select parity, M-025).

## src/pages/AccountPage/Inbox

### M-034 — Tabs pill fade (inbox variant) · **n.a.**

- Area: component · demo: PS.Tabs{fade}
- Target: `src/pages/AccountPage/Inbox` — Inbox — tabs
- Trigger: tab change
- Timeline:
  - opacity · 0 (new) / 1 (old) → 1 / 0 · transition: enter & exit {duration:0.15, ease:'easeOut'}
- Exit: AnimatePresence initial={false}
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-034.json`, strip `strip/M-034.png` — full
- Status reason: Production inbox has no tabs.

## src/pages/AuthPage/BankCard

### M-032 — Segmented pill glide · **done**

- Area: component · demo: PS.Segmented
- Target: `src/pages/AuthPage/BankCard/index.tsx` — BankCard wallet / bank tabs — m.span.tabIndicator layoutId="bank-card-tab-pill"
- Trigger: tap other segment
- Timeline:
  - layout (x, width) · old → new · transition: layoutId FLIP on PS.MT.SPRING = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.378, restSpeed:3.78}
- Layout: layoutId shared element
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/pages/AuthPage/BankCard/index.tsx:873-874`, `src/pages/AuthPage/BankCard/index.module.css:71-79`
- Reference: `curves/M-032.json`, strip `strip/M-032.png` — full

## src/pages/AuthPage/Identity

### M-077 — ID side tick pop · **n.a.**

- Area: component · demo: PS.IdSideCard
- Target: `src/pages/AuthPage/Identity / Liveness` — PS.IdSideCard — m.span.ps-idside__tick
- Trigger: photo added
- Timeline:
  - scale · 0.6 → 1 · transition: SPRING with restDelta 0.001
  - opacity · 0 → 1 · transition: SPRING with restDelta 0.001
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-077.json`, strip `strip/M-077.png` — full
- Status reason: Production ID / liveness screens use native capture and a different layout (no side-tick card, dashed selfie ring or in-page camera); tokens ready when the rebrand screens land.

### M-078 — Selfie dashed ring spin · **n.a.**

- Area: component · demo: PS.Selfie
- Target: `src/pages/AuthPage/Identity / Liveness` — PS.Selfie — m.svg.ps-selfie__dash
- Trigger: state 'checking'
- Timeline:
  - opacity · 0 → 1 · transition: opacity ENTER; rotate {duration:8, ease linear, repeat Infinity}; exit opacity LEAVE
  - rotate · 0 → 360 deg · transition: opacity ENTER; rotate {duration:8, ease linear, repeat Infinity}; exit opacity LEAVE
- Reduced motion: PS.reduce: rotate target 0
- Reference: `curves/M-078.json`, strip `strip/M-078.png` — full
- Status reason: Production ID / liveness screens use native capture and a different layout (no side-tick card, dashed selfie ring or in-page camera); tokens ready when the rebrand screens land.

### M-079 — Selfie state label / ring colour · **n.a.**

- Area: component · demo: PS.Selfie
- Target: `src/pages/AuthPage/Identity / Liveness` — PS.Selfie — m.span state (PS.fade 8) + .ps-selfie__ring bg
- Trigger: state change
- Timeline:
  - opacity,y,filter ·  →  · transition: PS.fade(MT.Y.text); CSS bg 0.15s
  - background-color ·  →  · transition: PS.fade(MT.Y.text); CSS bg 0.15s
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-079.json`, strip `strip/M-079.png` — full
- Status reason: Production ID / liveness screens use native capture and a different layout (no side-tick card, dashed selfie ring or in-page camera); tokens ready when the rebrand screens land.

### M-080 — Face camera shot fade + hint/actions swap · **n.a.**

- Area: component · demo: PS.FaceCamera
- Target: `src/pages/AuthPage/Identity / Liveness` — PS.FaceCamera — m.img shot; Swap hint; Crossfade actions
- Trigger: shutter
- Timeline:
  - opacity · 0 → 1 · transition: img opacity ENTER; hint PS.Swap; actions PS.Crossfade
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-080.json`, strip `strip/M-080.png` — full
- Status reason: Production ID / liveness screens use native capture and a different layout (no side-tick card, dashed selfie ring or in-page camera); tokens ready when the rebrand screens land.

## src/pages/ConfirmPage/Order

### M-027 — OTP digit pop · **done**

- Area: component · demo: PS.OtpBoxes
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — PhoneVerificationSheet — digit inside a box
- Trigger: digit typed
- Timeline:
  - opacity / scale · 0 / 0.6 → 1 / 1 · transition: OTP_DIGIT.enter 0.18 s EASE_IN
  - exit opacity · — → 0 · transition: 0.1 s
- Interruption: popLayout
- Reduced motion: opacity only
- Code: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:178`
- Reference: `curves/M-027.json`, strip `strip/M-027.png` — full
- Remaining: src/pages/AuthPage/OtpVerify/index.tsx: the login OTP page boxes (no digit pop; the OTP sheet has it)
- Decision: done in the OTP sheet (PhoneVerificationSheet); the login OTP page (AuthPage/OtpVerify) keeps its boxes without the pop.

### M-028 — OTP boxes cascade in · **done**

- Area: component · demo: PS.OtpBoxes{cascade}
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — PhoneVerificationSheet — .digit boxes
- Trigger: code step mounts
- Timeline:
  - opacity / y / blur · 0 / 8 / 3 px → 1 / 0 / 0 · transition: reveal(i): 0.34 s EASE_IN, delay 0.06 + 0.03·i
- Reduced motion: opacity only
- Code: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:164`, `src/motion/presets.ts:44-63`
- Reference: `curves/M-028.json`, strip `strip/M-028.png` — full
- Remaining: src/pages/AuthPage/OtpVerify/index.tsx: the login OTP page boxes (no cascade)
- Deviation: Replaces CSS enter 340 ms (y 10, scale 0.94, no stagger).
- Decision: done in the OTP sheet; the login OTP page does not cascade its boxes.

### M-029 — OTP box state colours · **done**

- Area: component · demo: PS.OtpBoxes
- Target: `src/pages/ConfirmPage/Order/phoneVerification/sheet.module.css` — PhoneVerificationSheet — .digit
- Trigger: active / invalid
- Timeline:
  - border-color, color · transition: 0.15 s ease
- Reduced motion: transition none
- Code: `src/pages/ConfirmPage/Order/phoneVerification/sheet.module.css:119`
- Reference: `curves/M-029.json`, strip `strip/M-029.png` — full
- Status reason: Done in the OTP sheet; the login OTP page (AuthPage/OtpVerify) keeps its own border colours.
- Remaining: src/pages/AuthPage/OtpVerify/index.module.css: border colour change without the 0.15 s transition
- Decision: OtpVerify input border colour 0.15 s: not applied (the login OTP page was left as it is).

### M-051 — OTP form resend label swap · **partial**

- Area: component · demo: PS.OtpForm
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — PhoneVerificationSheet — resend label
- Trigger: countdown ends
- Code: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:252`, `src/motion/Swap.tsx:30-65`
- Reference: `curves/M-051.json`, strip `strip/M-051.png` — full
- Status reason: Done in the OTP sheet (M-093); the login OTP page (AuthPage/OtpVerify) still swaps its resend label without the Swap.
- Remaining: src/pages/AuthPage/OtpVerify/index.tsx: resend label (wrap it in <Swap>)
- Decision: OtpVerify resend label: wrap the label in <Swap> (src/motion/Swap.tsx) keyed on the label, as PhoneVerificationSheet does.

### M-073 — Agreement nudge ripple · **done**

- Area: component · demo: PS.Agreement{nudge}
- Target: `src/pages/ConfirmPage/Order/components/AgreementConsent/index.tsx` — AgreementConsent — halo
- Trigger: nudge
- Code: `src/motion/flows/agreementNudge.ts:18`
- Reference: `curves/M-073.json`, strip `strip/M-073.png` — full
- Status reason: Same as M-112 (the withdraw agreement is the only production one).
- Decision: OPEN-DECISIONS 1 (AGREEMENT_NUDGE).

### M-091 — OTP sheet: middle height morph · **done**

- Area: flow · demo: PS.OtpSheet (OtpBody)
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — PhoneVerificationSheet — .middle (m.div)
- Trigger: step phone ↔ input, error on/off
- Timeline:
  - height · 48 (number) / 60 (code) → the other; +56 while an error shows · transition: MT.SPRING (240/30/1, restDelta 0.378)
- Interruption: spring re-targets
- Reduced motion: height jumps (Motion reducedMotion user)
- Code: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:87`, `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:145`
- Reference: `curves/M-091.json`, strip `strip/M-091.png`, video `video/M-091.mp4` — full
- Deviation: The error line moved inside the middle (demo layout); the sheet min-height transitions (340 ms) are removed.

### M-092 — OTP sheet: pane crossfade · **done**

- Area: flow · demo: PS.OtpSheet
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — PhoneVerificationSheet — .pane (code / phone)
- Trigger: step change
- Timeline:
  - opacity / y / blur · note: fade(MT.Y.block): in 0.3 s + 0.07 EASE_IN from y 10, blur 3; out 0.15 s LEAVE to y −10
  - mode · note: AnimatePresence popLayout
- Reduced motion: opacity only
- Code: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:152`, `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:217`
- Reference: `curves/M-092.json`, strip `strip/M-092.png`, video `video/M-092.mp4` — full

### M-093 — OTP sheet: title / description / button swaps · **done**

- Area: flow · demo: PS.OtpSheet
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — PhoneVerificationSheet — title, description, resend label
- Trigger: step change / countdown ends
- Timeline:
  - title, description · note: <Swap block k=step> (fade y 8, 3 px blur)
  - button label (input step) · note: <Swap k={seconds > 0 ? 'wait' : 'go'}>; the countdown number changes inside one key
- Reduced motion: opacity only
- Code: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:117`, `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx:252`
- Reference: `curves/M-093.json`, strip `strip/M-093.png`, video `video/M-093.mp4` — full

### M-094 — OTP sheet: auto-typed code · **n.a.**

- Area: flow · demo: PS.OtpSheet
- Target: `src/pages/ConfirmPage/Order/phoneVerification/PhoneVerificationSheet.tsx` — — — —
- Trigger: —
- Reference: `curves/M-094.json`, strip `strip/M-094.png`, video `video/M-094.mp4` — full
- Status reason: Demo-only auto-typing of the test code.

### M-110 — Agreement tick colour · **done**

- Area: flow · demo: withdraw.js agreement
- Target: `src/pages/ConfirmPage/Order/components/AgreementConsent/index.module.css` — AgreementConsent — .checkbox
- Trigger: tap the agreement
- Timeline:
  - background-color, border-color · transition: 0.15 s ease (R-COLOR)
- Interruption: CSS reverses from the current value
- Reduced motion: unchanged (colour)
- Code: `src/pages/ConfirmPage/Order/components/AgreementConsent/index.module.css:29`
- Reference: `curves/M-110.json`, strip `strip/M-110.png`, video `video/M-110.mp4` — full

### M-112 — Agreement nudge ripple (withdraw) · **done**

- Area: flow · demo: withdraw.js nudgeAgree()
- Target: `src/pages/ConfirmPage/Order/components/AgreementConsent/index.tsx` — AgreementConsent — [data-agreement-halo] ring over the circle
- Trigger: the scroll arrives within 24 px
- Timeline:
  - scale · 1 → 2.4
  - opacity · 0.6 → 0
  - None · transition: 0.6 s EASE_IN, played twice (chained with .then)
- Reduced motion: no ripple
- Code: `src/motion/flows/agreementNudge.ts:18`, `src/pages/ConfirmPage/Order/components/AgreementConsent/index.tsx:40`
- Reference: `curves/M-112.json`, strip `strip/M-112.png`, video `video/M-112.mp4` — full
- Decision: OPEN-DECISIONS 1 (AGREEMENT_NUDGE).

## src/pages/CreditHistoryPage

### M-033 — Tabs pill glide · **done**

- Area: component · demo: PS.Tabs
- Target: `src/pages/CreditHistoryPage` — Credit history tabs — tab pill
- Trigger: tab change
- Timeline:
  - layout (x, width) · old → new · transition: layoutId FLIP on PS.MT.SPRING = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.378, restSpeed:3.78}; labels colour 0.15s ease (CSS)
- Layout: layoutId
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/PageTransition.tsx:132-138` (SHARED_PAGE_PREFIXES), `src/pages/CreditHistoryPage/index.tsx:3, 26-27, 111-112, 114, 121, 123-134` (lines changed by motion.patch), `src/pages/CreditHistoryPage/index.module.css:34-36, 43-55` (lines changed by motion.patch)
- Reference: `curves/M-033.json`, strip `strip/M-033.png` — full
- Status reason: CreditHistory tabs: <m.span layoutId="credit-history-tab-pill" transition={MT.SPRING}/> glides between tabs, labels change colour in 0.15 s, tabs press 0.985. Each tab is its own route, so a tab switch also crossfades the page; add "/credit-history" to SHARED_PAGE_PREFIXES in src/motion/PageTransition.tsx (foundation file, not edited here) if that is unwanted.
- Decision: /credit-history is in SHARED_PAGE_PREFIXES (src/motion/PageTransition.tsx): each CreditHistory tab is a route, a tab switch glides the pill and does not crossfade the page.

## src/pages/HomePage/Account

### M-084 — Account menu badge swap · **n.a.**

- Area: component · demo: PS.Menu (account.js)
- Target: `src/pages/HomePage/Account/index.tsx` — Account menu — inbox "New" badge
- Trigger: badge change
- Timeline:
  - opacity,y,filter ·  →  · transition: PS.Swap
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-084.json`, strip `strip/M-084.png` — full
- Status reason: The demo only swaps the badge TEXT (PS.Swap k=badge); production's badge copy is constant ("New") and appears / disappears without animation, as in the demo. Menu rows got the press (M-001).

## src/pages/HomePage/BottomNavigation

### M-011 — Bottom bar / tab bar veil fades out at end of scroll · **done**

- Area: global · demo: PS.Screen / PS.BottomBar / PS.Navigator
- Target: `src/pages/HomePage/BottomNavigation/index.module.css (+ GlobalLayout useScrollVeil)` — BottomNavigation .navigation::before — tab-bar veil opacity = --motion-bot-fade
- Trigger: scroll (last stretch = bar height, default 108 px)
- Timeline:
  - opacity (--ps-bot-fade) · 1 → 0 · transition: scroll-linked: o = clamp((scrollHeight - clientHeight - scrollTop) / barHeight, 0, 1)
- Reduced motion: scroll-linked: unchanged
- Code: `src/motion/useScrollVeil.ts:24-86`, `src/pages/HomePage/BottomNavigation/index.module.css:16-25`
- Reference: `curves/M-011.json`, strip `strip/M-011.png`, video `video/M-011.mp4` — full

### M-019 — Navigator tab pill glide · **done**

- Area: component · demo: PS.Navigator
- Target: `src/pages/HomePage/BottomNavigation/index.tsx` — BottomNavigation — m.span.tabPill layoutId="home-nav-pill" inside the active m.button
- Trigger: tap a tab (value changes)
- Timeline:
  - layout (x, width) · old tab → new tab · transition: layoutId shared-element FLIP on PS.MT.SPRING = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.378, restSpeed:3.78}
- Layout: layoutId=(p.id||'ps-nav')+'-pill'; only rendered inside the active tab
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/pages/HomePage/BottomNavigation/index.tsx:191-227`, `src/pages/HomePage/BottomNavigation/index.module.css:86-93`
- Reference: `curves/M-019.json`, strip `strip/M-019.png` — full

### M-115 — Withdraw home bottom veil · **done**

- Area: flow · demo: withdraw.js componentDidMount homeScroll
- Target: `src/pages/HomePage/BottomNavigation` — Home tab bar veil — veil
- Trigger: home scroll
- Reference: `curves/M-115.json`, strip `strip/M-115.png`, video `video/M-115.mp4` — full
- Status reason: Covered by M-011 (useScrollVeil on the tab bar).

## src/pages/HomePage/CreditAmountCard

### M-096 — Withdraw pill press · **partial**

- Area: flow · demo: withdraw.js hero() pill
- Target: `src/pages/HomePage/CreditAmountCard/index.tsx` — CreditAmountCard — button.withdraw
- Trigger: tap Withdraw
- Timeline:
  - scale · 1 → 0.98 · transition: MT.PRESS {duration 0.06} press in and release · note: demo value 0.98 (0.99 while the pill shows the unavailable message), not the 0.985 token
- Interruption: release returns on the same 60 ms tween
- Reduced motion: Motion reducedMotion "user": scale skipped
- Code: `src/motion/flows/withdrawTokens.ts:60`
- Reference: `curves/M-096.json`, strip `strip/M-096.png`, video `video/M-096.mp4` — full
- Status reason: Spec only: CreditAmountCard is loaded by tests/credit-amount-card.test.ts through a fixed dependency map; the edit is `<m.button … whileTap={{ scale: PILL_PRESS_SCALE.closed }} transition={MT.PRESS}>` on `.withdraw` (import m from motion/react). Not applied to keep that test unchanged — apply with the test map extended by motion/react.
- Decision: OPEN-DECISIONS 3: needs motion/react in the tests/credit-amount-card.test.ts dependency map before the press can be applied.

### M-097 — Withdraw pill opens into 'unavailable' message · **n.a.**

- Area: flow · demo: withdraw.js hero() (pillOpen)
- Target: `src/pages/HomePage/CreditAmountCard/index.tsx` — CreditAmountCard — button.withdraw + p.restriction
- Trigger: tap Withdraw when withdrawing is unavailable
- Reference: `curves/M-097.json`, strip `strip/M-097.png`, video `video/M-097.mp4` — full
- Status reason: Production disables the button and shows the restriction text under the card; the demo only reaches this branch when a host overrides available() (it returns true). No pill-opens-into-message surface.

## src/pages/HomePage/CreditIncreaseIntro

### M-095 — Credit limit intro (hosted baked page) + exit · **done**

- Area: flow · demo: PS.CreditLimitIntro
- Target: `src/pages/HomePage/CreditIncreaseIntro/adapter.ts` — startCreditIntroMotion + controller — overlay + iframe
- Trigger: Home with an eligible increase
- Timeline:
  - hold · note: 3000 ms after done (production: skip button; demo: a tap after done)
  - safety · note: 12000 ms (production timeout)
  - fallback exit · 1 → 0 · transition: 0.3 s (production fading phase, GSAP)
- Exit: M-117 / M-118
- Reduced motion: 0.3 s fade (production)
- Code: `src/pages/HomePage/creditIncrease/controller.ts:125` (after(3000, skipHold), unchanged)
- Reference: `curves/M-095.json`, strip `strip/M-095.png`, video `video/M-095.mp4` — full
- Status reason: Timing contract already matches; the exit is the new landing.

### M-117 — Credit limit intro -> home card (credit unused: big number carries over) · **done**

- Area: flow · demo: withdraw.js introExit(o) (o.mode 'available'); app: PS.CreditLimitIntro{exit} + APP.WdHero
- Target: `src/pages/HomePage/CreditIncreaseIntro/landing.ts` — createCreditLanding (CreditIncreaseIntro adapter → collapsing phase) — overlay shell + iframe material + a copy of CreditAmountCard in the overlay
- Trigger: 3000 ms after the material posts done (skip button shortens), target card visible → controller phase collapsing; landing.kind sameAmount (available = total)
- Timeline:
  - progress k · 0 → 1 · transition: stretched Smooth spring: De = max(edge travel), ts = min(2.5, max(1, De/378)); stiffness 240/ts², damping 30/ts, mass 1, restDelta 0.378/De, restSpeed 3.78/De/ts (≈ 508–528 px → ts ≈ 1.34–1.40, rest ≈ 0.85–0.9 s)
  - closing box (overlay shell) transform · translate(0,0) scale(1,1) → translate(to.l, to.t) scale(card w / W, card h / H) · window: clamp(k), origin 0 0
  - closing box border-radius · 0 → 24·k/sx px / 24·k/sy px (24 on screen)
  - iframe + glow copy inverse transform · — → scale(1/sx, 1/sy) translate(−L, −T (+ to.b·(1−k) for the glow))
  - card colour layer opacity · 0 → 1 · window: win(0.15, 0.85) over a #0d1620 layer
  - artwork transform · — → centre to the same relative spot in the box, scale 1 − 0.4k
  - coin canvases opacity / blur · 1 / 0 → 0 / 4 px · window: win(0, 0.45)
  - stars opacity · 1 → 0 · window: win(0.35, 0.8)
  - details (clocked) · note: each 0.34 s EASE_IN, opacity 0→1, blur 3→0 px, rise MT.Y: label @k 0.2 (dy 8, keeps its base opacity), info @0.3 (dy 0), legend 1 @0.3 (dy 8 + push), legend 2 @0.36 (dy 8 + push), bar @0.38 (no blur, + push)
  - bar fills · window: row translateX(−fw), fills translateX(fw), fw = (1 − win(0.42, 0.95))·row width
  - Withdraw pill opacity / translateY · 0 / to.b → 1 / 0 · window: win(0.38, 0.58); rides the box bottom edge
  - glow copy opacity · window: win(0.38, 1)
  - card shadow layer · window: win(0.65, 1) on the box outline, radius 24k
  - around: content above · window: opacity win(0.15, 0.6), rides the top edge (−to.t·(1−k))
  - around: cards below / tab bar · window: win(0.25 + 0.07i, 0.7 + 0.07i), y 16 px (+ bottom-edge ride); tab bar win(0.3, 0.6), y 10
  - number block (iframe #hero) · — → follows the number's path, scale 1 + (1/s0 − 1)k · window: opacity 1 − win(0, 0.5), blur 4·win
  - card amount transform · the big number's centre and size (s0 = 64 / card size) → its place · window: translate on lerp(k) of the centre, scale s0 + (1 − s0)k, origin 0 0
  - card amount letter-spacing / colour · −0.02 em / the big number's colour → the card's · window: 24 steps over win(0, 0.5)
  - decimals opacity · 0 → 1 · window: win(0.3, 0.75)
  - push under the amount · window: max(0, amount bottom − resting bottom) added to legend / bar translateY
- Interruption: page hidden / resize / reduced-motion change cancels (controller), cleanup restores every style
- Exit: at rest: styles restored in one frame, copy removed, real card shown, controller disposes the overlay
- Reduced motion: controller fades the overlay 0.3 s and never starts the material (production, kept)
- Code: `src/pages/HomePage/CreditIncreaseIntro/landing.ts:96`, `src/pages/HomePage/CreditIncreaseIntro/landing.ts:413`, `src/pages/HomePage/CreditIncreaseIntro/landing.ts:624`, `src/motion/flows/core.ts:86`
- Reference: `curves/M-117.json`, strip `strip/M-117.png`, video `video/M-117.mp4` — full
- Deviation: Production's card lives in the app's stacking contexts, so a visual copy of the card sits in the overlay (the demo lifts the real card to z 101); the real card reappears the frame the copy goes.
- Deviation: The old landing (0.85 s GSAP, font-size interpolation, separate fades) is replaced.
- Deviation: ₱ and digits are one text run in production: tracking changes on that run.

### M-118 — Credit limit intro -> home card (credit partly used: nothing carries over, count-up) · **done**

- Area: flow · demo: withdraw.js introExit(o) used = (o.mode === 'total')
- Target: `src/pages/HomePage/CreditIncreaseIntro/landing.ts` — createCreditLanding — same; landing.kind separateAmount (available < total)
- Trigger: same as M-117
- Timeline:
  - progress k · 0 → 1 · transition: stretched Smooth spring: De = max(edge travel), ts = min(2.5, max(1, De/378)); stiffness 240/ts², damping 30/ts, mass 1, restDelta 0.378/De, restSpeed 3.78/De/ts (≈ 508–528 px → ts ≈ 1.34–1.40, rest ≈ 0.85–0.9 s)
  - closing box (overlay shell) transform · translate(0,0) scale(1,1) → translate(to.l, to.t) scale(card w / W, card h / H) · window: clamp(k), origin 0 0
  - closing box border-radius · 0 → 24·k/sx px / 24·k/sy px (24 on screen)
  - iframe + glow copy inverse transform · — → scale(1/sx, 1/sy) translate(−L, −T (+ to.b·(1−k) for the glow))
  - card colour layer opacity · 0 → 1 · window: win(0.15, 0.85) over a #0d1620 layer
  - artwork transform · — → centre to the same relative spot in the box, scale 1 − 0.4k
  - coin canvases opacity / blur · 1 / 0 → 0 / 4 px · window: win(0, 0.45)
  - stars opacity · 1 → 0 · window: win(0.35, 0.8)
  - details (clocked) · note: each 0.34 s EASE_IN, opacity 0→1, blur 3→0 px, rise MT.Y: label @k 0.2 (dy 8, keeps its base opacity), info @0.3 (dy 0), legend 1 @0.3 (dy 8 + push), legend 2 @0.36 (dy 8 + push), bar @0.38 (no blur, + push)
  - bar fills · window: row translateX(−fw), fills translateX(fw), fw = (1 − win(0.42, 0.95))·row width
  - Withdraw pill opacity / translateY · 0 / to.b → 1 / 0 · window: win(0.38, 0.58); rides the box bottom edge
  - glow copy opacity · window: win(0.38, 1)
  - card shadow layer · window: win(0.65, 1) on the box outline, radius 24k
  - around: content above · window: opacity win(0.15, 0.6), rides the top edge (−to.t·(1−k))
  - around: cards below / tab bar · window: win(0.25 + 0.07i, 0.7 + 0.07i), y 16 px (+ bottom-edge ride); tab bar win(0.3, 0.6), y 10
  - number block (iframe #hero) · — → travels with the box, scale 1 − 0.3k · window: opacity 1 − win(0, 0.45), blur 4·win
  - card amount · note: clocked like the details at k 0.4 (dy 10)
  - count-up · available − increase (projection.landing.from) → available (landing.to) · transition: starts when the amount clock is done AND k ≥ 0.97: 1.0 s linear after 0.1 s; number on 1 − (1 − t)⁴ (whole pesos), green bar part slides out from under the white on smoothstep(t)
- Interruption: as M-117
- Exit: ends only when the spring, every clock and the count are done
- Reduced motion: as M-117
- Code: `src/pages/HomePage/CreditIncreaseIntro/landing.ts:577`, `src/pages/HomePage/CreditIncreaseIntro/landing.ts:510`
- Reference: `curves/M-118.json`, strip `strip/M-118.png`, video `video/M-118.mp4` — full
- Deviation: Count frames use production formatIntroCountFrame (Decimal) — whole pesos like the demo.
- Deviation: The old separateAmount path (bar opacity 1 s, power2.out roll after 0.85 s) is replaced.
- Decision: The card amount the number lands on uses --font-family-number after the visual package (visual edit E486 loads Hanken in the host).

### M-120 — Credit limit increase animation (coins + count-up) · **done**

- Area: flow · demo: baked-heap.js build() (hosted in an iframe by PS.CreditLimitIntro / intro.js)
- Target: `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js` — createBakedHeap — coins, count-up, number block
- Trigger: material init
- Timeline:
  - recording · note: baked.json byte-identical (60 fps, 354 frames, 44 coins)
  - count-up · note: 0.45 s → 1.85 s power2.out, whole pesos (unchanged)
  - done · 3.4 s → 3.2 s (demo end − .2)
  - colours · note: accent #3FA0F0 → #5CD680 (landing colour, --accent), "Previous limit" colour: visual package (white 60 %)
  - small numbers font · note: Satoshi → Hanken (number font, owner rule: #up .num, #was .num)
  - no end date · note: date segment hidden, increase pill on its own (.solo)
- Exit: stop() pauses the main timeline, every twinkle timeline and the frame's global timeline (stars freeze, as the demo exit)
- Reduced motion: host never starts it (production)
- Code: `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:10-12` (--ps-font-num: Hanken), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:134` (#up .num), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:168` (#was .num), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js:1084-1087` (done), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js:925` (landing colour), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js:49-51` (solo), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js:1106-1123` (stop / getVisualHandles), `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.css:25, 135, 166, 169`, `src/pages/HomePage/CreditIncreaseIntro/material/entry.ts:56`
- Reference: `curves/M-120.json`, strip `strip/M-120.png`, video `video/M-120.mp4` — full
- Deviation: GSAP 3.13 (production) vs 3.15 (demo).
- Decision: Owner rule 2026-11-24: every amount uses the rebrand number font (Hanken Grotesk 700, --font-family-number). The intro's big number and the two small amounts use the iframe's own Hanken @font-face (--ps-font-num: Hanken); the iframe cannot read app tokens, so the family is literal.
- Decision: Colours in the material come from the visual package (accent #5CD680, text #FFFFFF, "Previous limit" white 60 %), not from this section.

### M-121 — Credit limit burst (rings, rays, sparkles) · **done**

- Area: flow · demo: baked-heap.js burst(tl, land)
- Target: `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js` — burst — rings, rays, sparkles
- Trigger: land
- Timeline:
  - counts / radii / durations / delays / eases · note: identical to the demo
  - colour · #3FA0F0 → #5CD680
- Reduced motion: host
- Code: `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js:633`
- Reference: `curves/M-121.json`, strip `strip/M-121.png`, video `video/M-121.mp4` — full

### M-122 — Credit limit star twinkle loop · **done**

- Area: flow · demo: baked-heap.js twinkle()
- Target: `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.html` — stars — #artStars
- Trigger: loop
- Timeline:
  - twinkle · note: timing, keyframes, ease and stagger identical
  - star S2 colour · #3FA0F0 → #5CD680
- Interruption: paused by stop() at the exit
- Reduced motion: host
- Code: `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.html:79`, `src/pages/HomePage/CreditIncreaseIntro/material/baked-heap.js:1106-1123`
- Reference: `curves/M-122.json`, strip `strip/M-122.png`, video `video/M-122.mp4` — full

## src/pages/HomePage/Home

### M-068 — Partner logos marquee · **done**

- Area: component · demo: PS.PartnerLogos
- Target: `src/pages/HomePage/Home/components/MadeForFilipinos (+ Diversion copy)` — MadeForFilipinos — logo track
- Trigger: mount
- Timeline:
  - transform · translateX(0px) → translateX(-L px) · transition: WAAPI duration L/28*1000 ms (28 px/s), linear, infinite; L = Σ(logo width + 24)
- Reduced motion: PS.reduce: not started (still)
- Code: `src/motion/useMarquee.ts:1-63` (new; new file), `src/pages/HomePage/Home/components/MadeForFilipinos/index.tsx:1, 6, 30-32, 94` (lines changed by motion.patch), `src/pages/OutPages/DiversionPage/Home/components/MadeForFilipinos/index.tsx:1, 6, 31-33, 97` (lines changed by motion.patch), `src/components/ui/NoticeTicker/index.tsx:9, 75-78, 135, 151, 168` (lines changed by motion.patch)
- Reference: `curves/M-068.json`, strip `strip/M-068.png` — full
- Status reason: Partner logos: new shared hook useMarquee — WAAPI translateX 0 → −L at 28 px/s, linear, infinite, L = measured half track (Σ logo width + 24 gap); not started with reduced motion; re-measures on resize keeping its place; cancelled on unmount. Both MadeForFilipinos copies use it; the 20 s / 30 s CSS loop is removed. NoticeTicker (different design) only got the reduced-motion stop.

### M-083 — Rating sheet steps crossfade · **partial**

- Area: component · demo: PS.Rating
- Target: `src/pages/HomePage/Home/feedbackInvitation/FeedbackInvitationSheet.tsx` — FeedbackInvitationSheet — steps
- Trigger: step ask -> good|bad
- Timeline:
  - opacity · 0 → 1 · transition: on: ENTER; off: opacity 0 + blur 3px on LEAVE (no y); off page pointerEvents none
  - filter · blur(3px) → blur(0px) · transition: on: ENTER; off: opacity 0 + blur 3px on LEAVE (no y); off page pointerEvents none
- Layout: all steps stacked, sheet keeps the tallest height
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-083.json`, strip `strip/M-083.png` — full
- Status reason: FeedbackInvitationController remounts the sheet per step (key={sheetType}); survey exposure tracking and its test depend on that remount. To finish: drop the key, stack both steps in one grid cell (on = ENTER opacity + blur, off = LEAVE + pointer-events none) and fire the survey onAfterOpen at crossfade end — needs the tracking owner's agreement (changes the exposure contract).
- Remaining: src/pages/HomePage/Home/feedbackInvitation/FeedbackInvitationController.tsx
- Decision: OPEN-DECISIONS 4: feedback sheet steps vs the survey exposure tracking contract.

## src/pages/HomePage/Payment

### M-036 — Method picker rail mark + list glide · **n.a.**

- Area: component · demo: PS.MethodPicker
- Target: `src/pages/HomePage/Payment/components/PaymentMethodDrawer` — Method picker — rail mark
- Trigger: tap a rail category; scroll (scroll-spy)
- Timeline:
  - layout (y) · old cat → new cat · transition: mark: layoutId on PS.MT.SPRING = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.378, restSpeed:3.78}; list: Motion.animate(scrollTop -> to) on SPRING with restDelta 0.5, onUpdate sets sc.scrollTop
  - scrollTop · current → category anchor px · transition: mark: layoutId on PS.MT.SPRING = {type:'spring', stiffness:240, damping:30, mass:1, restDelta:0.378, restSpeed:3.78}; list: Motion.animate(scrollTop -> to) on SPRING with restDelta 0.5, onUpdate sets sc.scrollTop
- Layout: layoutId 'ps-mpick-mark'
- Interruption: a new tap stops the running glide (gliding.current.stop()); scroll-spy is ignored while gliding
- Reduced motion: PS.reduce: scrollTop jumps
- Reference: `curves/M-036.json`, strip `strip/M-036.png` — full
- Status reason: Production method drawer is a flat list (no category rail).

### M-064 — Carousel swipe / settle · **done**

- Area: component · demo: PS.Carousel
- Target: `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx` — FraudWarningSheet steps — carousel track
- Trigger: drag x / index prop
- Timeline:
  - x · -index*w → -newIndex*w px · transition: Motion.animate(x, -i*w, SPRING); drag 'x', dragElastic 0.18, dragMomentum false, constraints {left: -(n-1)*w, right: 0}; onDragEnd: next if offset.x < -0.2w or velocity.x < -400; prev if > 0.2w or > 400
- Interruption: resize: x.jump to the current page
- Reduced motion: PS.reduce: x.jump
- Code: `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx:5, 10-17, 20-23, 33, 56-78, 81-86, 99-101, 103-108 …` (lines changed by motion.patch), `src/pages/HomePage/Payment/components/FraudWarningSheet/index.module.css:92-93, 100, 102-108, 110, 174-178, 182, 187-190` (lines changed by motion.patch)
- Reference: `curves/M-064.json`, strip `strip/M-064.png` — full
- Status reason: FraudWarningSheet steps are a track m.div on an x motion value: Next / swipe animate(x, -i·w, MT.SPRING); drag="x", dragElastic 0.18, dragMomentum false, constraints = the viewport; next when offset.x < -0.2w or velocity.x < -400 (prev mirrored); x.jump on resize and with reduced motion. Only the step on screen is active (data-active; production art is static, so R-CAROUSEL has nothing to replay yet). Old pointer-swipe code and keyframes removed.

### M-065 — Pager dot follows the swipe · **done**

- Area: component · demo: PS.Pager{progress} (PagerDot)
- Target: `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx` — FraudWarningSheet pager — dots
- Trigger: carousel x changes
- Timeline:
  - width · 6 → 24 px · transition: scroll-linked useTransform: w = 6 + 18*max(0, 1-|progress-i|); o = max(0, 1-|progress-i|)
  - opacity (dark fill) · 0 → 1 · transition: scroll-linked useTransform: w = 6 + 18*max(0, 1-|progress-i|); o = max(0, 1-|progress-i|)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx:5, 10-17, 20-23, 33, 56-78, 81-86, 99-101, 103-108 …` (lines changed by motion.patch)
- Reference: `curves/M-065.json`, strip `strip/M-065.png` — full
- Status reason: Pager dots follow the swipe: width = 6 + 18·max(0, 1 − |p − i|), dark fill opacity = max(0, 1 − |p − i|) via useTransform on progress = −x / width.

### M-066 — Scam tips carousel + Next/I understand swap · **done**

- Area: component · demo: PS.ScamTips
- Target: `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx` — FraudWarningSheet — Next / I understand label
- Trigger: swipe / Next
- Timeline:
  - x ·  →  · transition: Carousel; PS.Anim active = on-screen card replays from start; button label PS.Swap
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/motion/Swap.tsx:30-65`, `src/pages/HomePage/Payment/components/FraudWarningSheet/index.tsx:5, 10-17, 20-23, 33, 56-78, 81-86, 99-101, 103-108 …` (lines changed by motion.patch)
- Reference: `curves/M-066.json`, strip `strip/M-066.png` — full
- Status reason: Button label in <Swap> keyed on the visible label (identical labels on adjacent steps do not replay); step texts ride the track (no extra fade, which would flicker the incoming card).

## src/pages/HomePage/WithdrawFlowLayout

### M-132 — Loan submit chain: code -> Order submit -> home · **done**

- Area: flow · demo: APP.submitLoan
- Target: `src/pages/HomePage/WithdrawFlowLayout/index.tsx` — submit chain — OTP sheet → Order submit → home
- Trigger: Confirm with the agreement ticked
- Timeline:
  - None
  - None
  - None
- Code: `src/pages/HomePage/WithdrawFlowLayout/index.tsx:397`
- Reference: `curves/M-132.json`, strip `strip/M-132.png`, video `video/M-132.mp4` — partial
- Status reason: Toast / rating after home are app-level (the Toaster, M-016).

## src/pages/HomePage/WithdrawMainRoute

### M-052 — Coin loading -> success · **done**

- Area: component · demo: PS.Coin
- Target: `src/pages/HomePage/WithdrawMainRoute/motion/coinMotion.ts` — createWithdrawCoinMotion — loading/success GSAP coins
- Trigger: state success
- Timeline:
  - loading → success · note: waits for the loop boundary (onRepeat), then success 127 frames once; no deadline beyond the safety wait
  - colours · legacy blue rgb(43,116,189) / rgb(120,170,226) → rebrand rgb(41,134,72) / rgb(92,214,128)
- Reduced motion: terminal frame (production)
- Code: `src/pages/HomePage/WithdrawMainRoute/motion/loadingCoin.ts:1`, `src/pages/HomePage/WithdrawMainRoute/motion/successCoin.ts:1`, `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.module.css:20, 22-24` (72 px; lines changed by motion.patch)
- Reference: `curves/M-052.json`, strip `strip/M-052.png` — full
- Deviation: Coin box 56 → 72 px (Order submit / Loader size).
- Deviation: GSAP modules are the production TS ports; only the fills differ from the rebrand JS (frames 102 / 127, 60 fps identical).

### M-087 — Order submit: letter rise-in · **done**

- Area: flow · demo: PS.OrderSubmit animate('in')
- Target: `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx` — SubmissionStatus animateCopyIn — [data-copy-character]:not([data-copy-space])
- Trigger: a line is shown
- Timeline:
  - translateY / blur / opacity · transition: 560 ms cubic-bezier(0.34, 0.02, 0.2, 1), fill both · delay: letter index · 16 ms (spaces take no slot)
- Interruption: presentation dispose cancels
- Reduced motion: skipped (line shown at once)
- Code: `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx:30`, `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx:139`
- Reference: `curves/M-087.json`, strip `strip/M-087.png`, video `video/M-087.mp4` — full
- Deviation: Spaces no longer take a 16 ms stagger slot (demo data-i counts letters only).

### M-088 — Order submit: letter rise-out · **done**

- Area: flow · demo: PS.OrderSubmit animate('out')
- Target: `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx` — animateCopyOut — letters
- Trigger: after the hold
- Timeline:
  - translateY / blur / opacity · transition: 400 ms cubic-bezier(0.4, 0.05, 0.6, 0.4) · delay: index · 16 ms · note: o = each letter's current opacity (a counting dot may be off); running animations cancelled first
- Exit: line hidden after
- Reduced motion: skipped
- Code: `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx:64`
- Reference: `curves/M-088.json`, strip `strip/M-088.png`, video `video/M-088.mp4` — full
- Deviation: Starts from each letter's current opacity (was 1).

### M-089 — Order submit: counting dots · **done**

- Area: flow · demo: PS.OrderSubmit loopDots
- Target: `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx` — loopDots — the three dots of the confirming line ([data-copy-dot])
- Trigger: confirming line fully in + 40 ms
- Timeline:
  - opacity · transition: 2000 ms linear, infinite
- Interruption: the line's exit cancels it
- Reduced motion: skipped
- Code: `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx:115`, `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx:240`
- Reference: `curves/M-089.json`, strip `strip/M-089.png`, video `video/M-089.mp4` — full
- Deviation: Replaces the CSS confirming-dot pulse (2 s ease-in-out 0.32↔1, 250 ms apart).

### M-090 — Order submit: master timeline · **done**

- Area: flow · demo: PS.OrderSubmit
- Target: `src/pages/HomePage/WithdrawMainRoute/submissionMotion.ts` — createSubmissionPresentation run() — three lines + coin
- Trigger: submission accepted (phase submitting)
- Timeline:
  - None
  - None
  - None
  - None
  - None
  - None
  - None
  - None · note: at (560 + tail3)/2 into line 3: the loading coin finishes its current turn (no deadline), then the success coin plays once (127 frames)
  - None · note: onEnd only when line 3 has held 1500 ms after its entrance AND the success coin has finished
- Interruption: dispose clears every timer; hidden page pauses timers and animations (production presentationScope, kept)
- Exit: WithdrawFlowLayout requestExit(business-complete) → layer crossfade (M-098 fade)
- Reduced motion: no letter motion; holds still run (1500 ms final reading time)
- Code: `src/pages/HomePage/WithdrawMainRoute/submissionMotion.ts:74`, `src/pages/HomePage/WithdrawMainRoute/submissionMotion.ts:175`, `src/pages/HomePage/WithdrawMainRoute/SubmissionStatus.tsx:191`
- Reference: `curves/M-090.json`, strip `strip/M-090.png`, video `video/M-090.mp4` — full
- Deviation: Final hold 3000 → 1500 ms (demo holdMs).
- Deviation: Line 3 no longer waits for the coin's turn; the coin switch starts halfway through line 3 (demo).
- Deviation: Tests updated: tests/withdraw-submission-motion.test.ts (timings).
- Decision: OPEN-DECISIONS 10: final hold 1500 ms (demo) instead of production's 3000 ms (HOLD_MS in src/pages/HomePage/WithdrawMainRoute/submissionMotion.ts).

### M-107 — Amount entry -> order card morph (page closes into a card) · **done**

- Area: flow · demo: withdraw.js tweenMp / applyMp / mp*()
- Target: `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts` — WithdrawMainRoute (playWithdrawMorph / captureWithdrawMorph) — [data-confirm-card] + ghost clone of the entry in the FullScreenLayer stable layer
- Trigger: pick a term on the entry (QuoteForm onConfirm → handleConfirmQuote captures, setPhase confirming, layout effect plays)
- Timeline:
  - progress k · 0 → 1 · transition: Smooth spring {type:spring, stiffness 240, damping 30, mass 1} (MT.SPRING feel) + restDelta 0.001, restSpeed 0.01 on a 0→1 progress (MORPH_SPRING, core.ts) — 95 % ≈ 290 ms, rest ≈ 560–600 ms · delay: 0 (starts in the confirm layout effect; the demo starts one rAF later)
  - card box (decoration surface [data-card-surface]) left/top/width/height · entry card box (0, header bottom, full width, page height) → order card box · window: lc: clamp(k) linear · note: layout of one absolutely positioned box, as mpCard(); never clip-path
  - card bottom radii · 0 → 24 px · window: lc(0, 24)
  - label translate · entry label box → 0 · window: lerp(k) (unclamped)
  - label colour · entry label colour (text-secondary) → card label colour · window: mix on k01
  - ₱ / each integer glyph / ".00" glyphs: translate + scale · entry glyph baseline point, font-size (48 / 28 / 18) → card glyph (32) · window: lerp(k); scale = f(k)/f(dst), dropped within 0.2 % · note: FLIP around the baseline marker (Glyphs); pairs counted from the right; a glyph with no source fades in on win(0.3, 0.75)
  - glyph colours · entry colours (ink / grey) → card brand colour · window: mix on k01
  - pencil opacity / transform · 0 / translateX(−6px) rotate(−24°) scale(0.5) → 1 / none · window: win(0.30, 0.90) · note: origin 30 % 85 %
  - slider opacity, translateY · 0, 10 px + ride from under the caption → 1, 0 · window: win(0.30, 0.88); ride on lerp
  - divider opacity · 0 → 1 · window: win(0.40, 0.92)
  - term row opacity · 0 → 1 · window: win(0.50, 0.96)
  - term chips left/top/width/height · entry chip box (h 41) → card chip box (h 36) · window: lc (top on lerp) · note: absolute small boxes during the morph
  - caption + term prompt (ghost) opacity · 1 → 0 · window: smoothstep(clamp(1 − 2k)) — gone by k 0.5 · note: translate rides the amount row
  - caret (ghost) opacity · 1 → 0 · window: 1 − k01
  - pad line + keypad (ghost) · 1 / 0 → 0 / −10 px · transition: MT.LEAVE 0.15 s at morph start
  - order page tint ([data-morph=grad]) opacity · 0 → 1 · window: bk = k01
  - Confirm button opacity, translate · 0, 10 px → 1, 0 · window: min(1, 1.45·bk), (1 − bk)·10 (CSS `translate`, composes with the press scale)
  - Confirm bar veil opacity · 0 → 1 × endF · window: bk·endF (endF = 1 at the top of the page)
- Interruption: Production has no order → entry path; a Back tap mid-morph exits the flow (the cleanup ends the morph at rest in one frame). The engine is one progress, so a reverse path only needs a second snapshot.
- Exit: at rest (spring AND the blocks / pad clocks done): every inline style restored in one frame, ghost removed, data-motion-settled="true"
- Reduced motion: jump to the end state (no ghost, no clocks) — skill rule 9; added, not in demo (the demo has no reduced path for the morph)
- Code: `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts:121`, `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts:213`, `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts:359`, `src/pages/HomePage/WithdrawMainRoute/index.tsx:352`, `src/pages/HomePage/WithdrawMainRoute/index.tsx:287`, `src/components/ui/LoanQuote/index.tsx:33`, `src/motion/flows/core.ts:78`
- Reference: `curves/M-107.json`, strip `strip/M-107.png`, video `video/M-107.mp4` — full
- Deviation: Production replaces the entry DOM by the confirm DOM, so what only the entry has (caption, prompt, caret, line, keypad) leaves on a clone ("ghost") — same windows / clocks as the demo.
- Deviation: Card content is laid out at the destination once; shared elements FLIP from the measured entry boxes (the demo moves paddings per frame + cardSnap whole-pixel rounding). cardSnap is not needed: no padding moves.
- Deviation: Replaces cardMotion.ts playCardTransition (420/450 ms clip-path keyframes) and LoanQuote morph-* keyframes. cardMotion.ts is kept only because tests/withdraw-card-motion.test.ts imports its helpers; delete both together.
- Deviation: The reverse morph (order → entry) is not wired: production has no such path (open question).
- Decision: OPEN-DECISIONS 2: the reverse morph (order card → amount entry) is not wired.

### M-108 — Order page blocks enter · **done**

- Area: flow · demo: withdraw.js confirmBlocks()
- Target: `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts` — WithdrawMainRoute — [data-morph="blocks"] and its children (order details, protection, method, agreement)
- Trigger: morph start
- Timeline:
  - wrapper opacity · 0 → 1 · transition: 0.2 s (Motion default ease)
  - block i opacity / y / scale · 0 / 10 px / 0.94 → 1 / 0 / 1 · transition: WD_REVEAL(i): 0.34 s EASE_IN · delay: 0.06 + 0.03·i s
- Interruption: cleanup stops them and clears inline values
- Exit: leaving the order page: the route exits (no block exit in production)
- Reduced motion: no entrance (blocks at rest)
- Code: `src/pages/HomePage/WithdrawMainRoute/motion/withdrawMorph.ts:483`, `src/pages/HomePage/WithdrawMainRoute/index.tsx:554`
- Reference: `curves/M-108.json`, strip `strip/M-108.png`, video `video/M-108.mp4` — full
- Deviation: The blocks sit under the card while it is large (card z-index 2 during the morph), as in the demo (absolute top 382 under the card).

### M-113 — Confirm button enable colour + press · **done**

- Area: flow · demo: withdraw.js ctaBar() btn
- Target: `src/pages/HomePage/WithdrawMainRoute/index.module.css` — WithdrawMainRoute Confirm (BottomActionButton) — .submitAction button[data-agree]
- Trigger: agreement ticked / untick; tap
- Timeline:
  - background-color · --color-action-bg-primary-disabled → action primary · transition: 0.2 s
  - color · --color-text-disabled → action text · transition: 0.2 s
  - scale (press) · — → 0.985 · transition: MT.PRESS 60 ms (BottomActionButton, M-001)
- Reduced motion: colours still change
- Code: `src/pages/HomePage/WithdrawMainRoute/index.module.css:397`, `src/pages/HomePage/WithdrawMainRoute/index.tsx:702`
- Reference: `curves/M-113.json`, strip `strip/M-113.png`, video `video/M-113.mp4` — full
- Deviation: CSS "0.2s" uses CSS ease; the demo tweens with Motion's default ease (reference M-113: rgb 185/228/199 at 52 ms) — visually equal.

### M-114 — Confirm bar veil fades at end of scroll · **done**

- Area: flow · demo: withdraw.js updEnd / mpBar
- Target: `src/pages/HomePage/WithdrawMainRoute/index.tsx` — WithdrawMainRoute — Confirm bar veil (BottomActionButton ProgressiveBlur, first child)
- Trigger: scroll on the order page
- Timeline:
  - opacity · 1 → 0 · window: clamp(left / bar height (|| 108)) rounded 0.001, scroll-linked
- Reduced motion: same (scroll-linked)
- Code: `src/pages/HomePage/WithdrawMainRoute/index.tsx:304`, `src/pages/HomePage/WithdrawMainRoute/index.module.css:404`
- Reference: `curves/M-114.json`, strip `strip/M-114.png`, video `video/M-114.mp4` — full

### M-116 — Loan header back button press + colours · **done**

- Area: flow · demo: withdraw.js loanScreen() back/title
- Target: `src/pages/HomePage/WithdrawMainRoute/index.module.css` — WithdrawHeader — .header button
- Trigger: tap Back
- Timeline:
  - scale · — → 0.92 · transition: 60 ms cubic-bezier(0.2,0,0,1) (demo MT.PRESS 60 ms)
- Reduced motion: transition none (existing)
- Code: `src/pages/HomePage/WithdrawMainRoute/index.module.css:11, 15-23, 27, 29, 124, 389-404` (.header button, unchanged; lines changed by motion.patch)
- Reference: `curves/M-116.json`, strip `strip/M-116.png`, video `video/M-116.mp4` — full
- Status reason: Existing CSS matches; Back exits the flow with the layer slide (M-098).

### M-133 — Withdraw ordering hosted in the app · **done**

- Area: flow · demo: APP.borrow -> APP.wd.open -> withdraw-host sheet.open()
- Target: `src/pages/HomePage/WithdrawMainRoute/index.tsx` — withdraw route — —
- Trigger: —
- Reference: `curves/M-133.json`, strip `strip/M-133.png`, video `video/M-133.mp4` — full
- Status reason: Composite of M-098, M-099 (key-by-key cascade on first open), M-107, M-106 (no coupons).
- Decision: The hosted take was re-recorded with the fixed demo: the key-by-key cascade (M-099) runs while the layer rises.

## src/pages/HomePage/creditIncrease

### M-119 — Credit limit intro fallback exit (intro.js, page not ready) · **n.a.**

- Area: flow · demo: intro.js go() fallback
- Target: `src/pages/HomePage/creditIncrease/controller.ts` — controller — overlay
- Trigger: target never ready
- Reference: `curves/M-119.json`, strip `strip/M-119.png`, video `video/M-119.mp4` — full
- Status reason: Legacy demo fallback (intro.js clip-path flyer). Production waits 4 s for the card then ends (target-missing); the app never uses this path.

## src/pages/RepayPage/components

### M-069 — Accordion open / chevron · **done**

- Area: component · demo: PS.Accordion
- Target: `src/pages/RepayPage/components/RepayDetailShell` — Repayment example accordion — body + chevron
- Trigger: tap head
- Timeline:
  - height · 0 → auto · transition: height SPRING, opacity ENTER/LEAVE; chevron rotate on SPRING
  - opacity · 0 → 1 · transition: height SPRING, opacity ENTER/LEAVE; chevron rotate on SPRING
  - rotate · 90 → -90 deg · transition: height SPRING, opacity ENTER/LEAVE; chevron rotate on SPRING
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Code: `src/pages/RepayPage/components/RepayDetailShell.tsx:4, 7-8, 35-38, 64, 71, 74-75, 77-83, 85-108 …` (lines changed by motion.patch), `src/pages/RepayPage/components/RepayDetailShell.module.css:136, 152, 158, 165` (lines changed by motion.patch)
- Reference: `curves/M-069.json`, strip `strip/M-069.png` — full
- Status reason: RepayDetailShell accordion: body in AnimatePresence initial={false}, height 0 ↔ auto on the spring with opacity ENTER / LEAVE; chevron m.span rotates on MT.SPRING; head presses 0.985. CSS linear() spring, mask and row-gap transitions removed.

## src/pages/SupportPage

### M-082 — Help vote swap · **n.a.**

- Area: component · demo: PS.HelpVote (apply.js)
- Target: `src/pages/SupportPage (FAQ)` — Help vote — vote chips
- Trigger: vote
- Timeline:
  - opacity,y,filter ·  →  · transition: PS.Swap; chip bg 0.15s
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-082.json`, strip `strip/M-082.png` — full
- Status reason: Production FAQ has no "was this helpful" vote.

## —

### M-020 — Top bar extra row hides under a cover · **n.a.**

- Area: component · demo: PS.Screen .ps-top__extra
- Target: `—` — PS.Screen .ps-top__extra — top bar extra row
- Trigger: screen gets .is-covered
- Timeline:
  - opacity · 1 → 0 · transition: CSS transition: opacity 0.2s ease
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Reference: `curves/M-020.json`, strip `strip/M-020.png` — partial
- Status reason: Production headers have no extra row under the bar, and loading covers are per page (see M-012).

### M-057 — Coupon ticket select (colour only) · **n.a.**

- Area: component · demo: PS.CouponTicket
- Target: `—` — PS.CouponTicket — .ps-ticket (filter drop-shadow) + .ps-ticket__bar (opacity)
- Trigger: pick
- Timeline:
  - filter drop-shadow · transparent → shadow-default · transition: CSS 0.15s ease
  - opacity (bar) · 0 → 1 · transition: CSS 0.15s ease
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Reference: `curves/M-057.json`, strip `strip/M-057.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

### M-058 — Coupon option select · **n.a.**

- Area: component · demo: PS.CouponOption
- Target: `—` — PS.CouponOption — .ps-copt__card box-shadow + ::after 1 px line opacity
- Trigger: pick
- Timeline:
  - box-shadow · none → elevation-1 · transition: CSS 0.15s ease
  - opacity (::after inset line) · 0 → 1 · transition: CSS 0.15s ease
- Reduced motion: CSS transition/keyframes: not affected by MotionConfig; no reduced-motion override in ps-ui.css
- Reference: `curves/M-058.json`, strip `strip/M-058.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

### M-059 — Coupon row sub-line swap · **n.a.**

- Area: component · demo: PS.CouponRow
- Target: `—` — PS.CouponRow — PS.Swap k on|off
- Trigger: row toggled
- Timeline:
  - opacity,y,filter ·  →  · transition: PS.Swap block (y 8)
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-059.json`, strip `strip/M-059.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

### M-060 — Summary chips row open/close · **n.a.**

- Area: component · demo: PS.Summary
- Target: `—` — PS.Summary — m.div.ps-summary__chips
- Trigger: first chip appears / last goes
- Timeline:
  - height · 0 → auto · transition: height on SPRING; opacity ENTER in / LEAVE out
  - opacity · 0 → 1 · transition: height on SPRING; opacity ENTER in / LEAVE out
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-060.json`, strip `strip/M-060.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

### M-061 — Summary chip in/out + reflow · **n.a.**

- Area: component · demo: PS.Summary chipIn()
- Target: `—` — PS.Summary chipIn() — m.span chip (layout='position')
- Trigger: saved / newLimit appear
- Timeline:
  - opacity · 0 → 1 · transition: {default: ENTER, layout: SPRING}; exit {opacity:0, scale:0.94} on LEAVE
  - scale · 0.94 → 1 · transition: {default: ENTER, layout: SPRING}; exit {opacity:0, scale:0.94} on LEAVE
  - filter · blur(3px) → blur(0px) · transition: {default: ENTER, layout: SPRING}; exit {opacity:0, scale:0.94} on LEAVE
- Layout: layout='position' on SPRING, AnimatePresence mode popLayout
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-061.json`, strip `strip/M-061.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

### M-062 — Coupon picker tab list crossfade · **n.a.**

- Area: component · demo: PS.CouponPicker
- Target: `—` — PS.CouponPicker — PS.Crossfade k=tab
- Trigger: tab change
- Timeline:
  - opacity,y(10),filter ·  →  · transition: Crossfade + Tabs pill glide (glass, id 'ps-picker')
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-062.json`, strip `strip/M-062.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

### M-063 — Decision carousel (Keep your coupon?) · **n.a.**

- Area: component · demo: PS.Decision -> PS.Carousel
- Target: `—` — PS.Decision -> PS.Carousel — carousel track + CouponArt active
- Trigger: swipe / index
- Timeline:
  - x · -i*w → -j*w px · transition: see Carousel
- Reduced motion: MotionRoot: MotionConfig reducedMotion="user" — transform / layout (x, y, scale, rotate, layoutId) jump to the end; opacity / filter / colour still animate.
- Reference: `curves/M-063.json`, strip `strip/M-063.png` — full
- Status reason: Production has no coupon picker / coupon tickets / savings summary yet.

## No production counterpart

### M-007 — Lottie player · **done**

- Area: global · demo: PS.Lottie / PS.Anim
- Target: `—` — — — —
- Trigger: mount (DOMLoaded); 'active' prop change
- Reference: `curves/M-007.json`, strip `strip/M-007.png`, video `video/M-007.mp4` — full
- Status reason: Production has no lottie-web: Lottie pieces are GSAP ports (coins) or hand conversions (dots, M-053).

### M-018 — GSAP coupon animation loader · **n.a.**

- Area: component · demo: PS.CouponArt{animate, active} (CouponAnim)
- Target: `—` — — — —
- Trigger: mount; active change
- Reference: `curves/M-018.json`, strip `strip/M-018.png` — full
- Status reason: Production has no coupon UI.

### M-085 — Empty state / result / sending card animations · **partial**

- Area: component · demo: PS.EmptyState, PS.Result{anim}, PS.SendingCard, PS.GuestPay, PS.Fallback
- Target: `—` — — — —
- Trigger: mount
- Reference: `curves/M-085.json`, strip `strip/M-085.png` — full
- Status reason: The demo plays an animation where production shows a still: empty states (EmptyState / GuestPay: animations/empty-box), result screens and the sending card (PS.Result anim, PS.SendingCard). Production has no lottie-web, and each animation needs a GSAP port of its Lottie (the demo has them under animations/<slug>/gsap/); the empty-box port is listed in 04-assets/assets-to-replace.json (optional add, structural).
- Remaining: empty states: src/assets/empty-states/history-empty.svg, src/assets/empty-payment-method.svg, src/pages/AccountPage/Inbox/assets/inbox-empty.svg, src/pages/OutPages/ShortLink/Repay/assets/link-expired.svg (stills stay valid); result / sending card screens: no animation in production
- How to finish: Port each Lottie the way loadingCoin.ts / successCoin.ts were ported (src/pages/HomePage/WithdrawMainRoute/motion/): take the demo's animations/<slug>/gsap/<slug>.js (empty-box: design repo animations/empty-box/gsap/empty-box.js, not shipped in 04-assets/files), wrap it in a component that builds the SVG and plays the timeline once on mount (R-ANIM-STILLS), shows the last frame with reduced motion, and keeps the current still as the fallback. Owner call: it adds markup (structural).

### M-086 — Splash logo grow-in · **n.a.**

- Area: flow · demo: PS.Splash
- Target: `—` — — — —
- Trigger: app opening (mount)
- Reference: `curves/M-086.json`, strip `strip/M-086.png`, video `video/M-086.mp4` — full
- Status reason: SplashPage is not routed in production (prod P-040).

### M-123 — App opening: splash -> home · **n.a.**

- Area: flow · demo: APP screen 'opening' (PS.Splash) -> APP.home
- Target: `—` — — — —
- Trigger: app start
- Reference: `curves/M-123.json`, strip `strip/M-123.png`, video `video/M-123.mp4` — full
- Status reason: App opening splash → home: no routed splash in production.

### M-124 — Home first show: cards rise · **done**

- Area: flow · demo: APP home (PS.Screen{rise})
- Target: `—` — — — —
- Trigger: first home render after the splash
- Reference: `curves/M-124.json`, strip `strip/M-124.png`, video `video/M-124.mp4` — full
- Status reason: Home first show rise — M-005 (Rise / SCREEN_RISE).

### M-125 — Tab switch (Home / Payment / Account) · **done**

- Area: flow · demo: APP screen 'tabs' -> PS.Pages dir 0 + PS.Navigator
- Target: `—` — — — —
- Trigger: tap a tab
- Reference: `curves/M-125.json`, strip `strip/M-125.png`, video `video/M-125.mp4` — full
- Status reason: Tab switch — M-008 / M-019.

### M-126 — Page push / pop / swap · **done**

- Area: flow · demo: APP.go / back / swap / home -> PS.Pages
- Target: `—` — — — —
- Trigger: navigation
- Reference: `curves/M-126.json`, strip `strip/M-126.png`, video `video/M-126.mp4` — full
- Status reason: Page push / pop — M-008 / M-009.

### M-129 — Toast on every say() · **done**

- Area: flow · demo: APP.say -> PS.Toasts
- Target: `—` — — — —
- Trigger: APP.say(text, ms) (default 2600 ms)
- Reference: `curves/M-129.json`, strip `strip/M-129.png`, video `video/M-129.mp4` — full
- Status reason: Toasts — the Toaster (M-016 / M-023).

### M-130 — Tooltip on tap · **done**

- Area: flow · demo: APP.tipAt -> PS.Tooltip
- Target: `—` — — — —
- Trigger: tap an info mark (anchor = PS.frameRect(el))
- Reference: `curves/M-130.json`, strip `strip/M-130.png`, video `video/M-130.mp4` — full
- Status reason: Tooltip — M-022.

### M-131 — Sheets host · **done**

- Area: flow · demo: APP.open / close -> SheetHost (page | plain | card)
- Target: `—` — — — —
- Trigger: APP.open(name)
- Reference: `curves/M-131.json`, strip `strip/M-131.png`, video `video/M-131.mp4` — full
- Status reason: Sheets host — Sheet / MobileModal (M-013).

### M-134 — Keep your coupon? decision · **n.a.**

- Area: flow · demo: APP sheet 'keep' -> PS.Decision (pages, Carousel)
- Target: `—` — — — —
- Trigger: a change of amount or term takes a coupon off
- Reference: `curves/M-134.json`, strip `strip/M-134.png`, video `video/M-134.mp4` — full
- Status reason: Production has no coupon UI (Keep your coupon? decision).

### M-135 — Anti-scam cards before paying · **partial**

- Area: flow · demo: APP sheet 'scams' -> PS.ScamTips
- Target: `—` — — — —
- Trigger: first pay (seenScam false) or tap the scam strip
- Reference: `curves/M-135.json`, strip `strip/M-135.png`, video `video/M-135.mp4` — full
- Status reason: The anti-scam cards themselves move as the demo (FraudWarningSheet: sheet M-013, carousel M-064, pager M-065, Next / I understand swap M-066 — all done). What differs is when they open: the demo shows them before the first payment (seenScam false) or from the scam strip; production opens FraudWarningSheet from its own exposure rules (src/pages/HomePage/Payment/fraudWarningAutoExposure.ts, useFraudWarningNotices.ts). That is behaviour, not motion.
- Remaining: the moment the sheet opens (production exposure rules vs. the demo's first payment)
- How to finish: Nothing to do for motion. If the owner wants the demo's moment, change the exposure rule in fraudWarningAutoExposure.ts / Payment/index.tsx (isFraudWarningOpen) — a behaviour change for the product owner, outside this hand-off.

### M-136 — Loan page: Confirm before agreement -> scroll + nudge · **partial**

- Area: flow · demo: APP screen 'loan' pointAgree
- Target: `—` — — — —
- Trigger: Confirm tapped while unticked
- Reference: `curves/M-136.json`, strip `strip/M-136.png`, video `video/M-136.mp4` — full
- Status reason: On the loan order page (src/pages/ConfirmPage/Order/index.tsx) Confirm before the agreement is ticked opens production's agreement prompt sheet (setAgreementPromptOpen(true), line 481). The demo scrolls the agreement into view and nudges its circle. The withdraw order page already does that (M-111 / M-112, OPEN-DECISIONS 1).
- Remaining: src/pages/ConfirmPage/Order/index.tsx: Confirm while unticked
- How to finish: Do what WithdrawMainRoute does (index.tsx: AGREEMENT_NUDGE line 78, scrollToAgreement(…) line 422): replace setAgreementPromptOpen(true) with scrollToAgreement(<the AgreementConsent element>, …) from src/motion/flows/agreementNudge.ts and play its halo; keep the prompt behind the same kind of flag. It removes production's prompt sheet, so it needs the same owner answer as OPEN-DECISIONS 1.

### M-137 — Selfie checking hides the page parts · **n.a.**

- Area: flow · demo: APP screen selfie (screens-kyc.js)
- Target: `—` — — — —
- Trigger: shutter -> state 'checking' (1600 ms)
- Reference: `curves/M-137.json`, strip `strip/M-137.png`, video `video/M-137.mp4` — full
- Status reason: Selfie checking: production uses native liveness capture (no in-page camera).

### M-138 — ID type chosen: sides block fades in · **n.a.**

- Area: flow · demo: APP screen kyc-id
- Target: `—` — — — —
- Trigger: ID type picked
- Reference: `curves/M-138.json`, strip `strip/M-138.png`, video `video/M-138.mp4` — full
- Status reason: ID type → sides block: production Identity page differs (native capture).

### M-139 — Rating sheet after order · **partial**

- Area: flow · demo: APP sheet 'rating' -> PS.Rating
- Target: `—` — — — —
- Trigger: 900 ms after home (Tune rating on)
- Reference: `curves/M-139.json`, strip `strip/M-139.png`, video `video/M-139.mp4` — full
- Status reason: Rating sheet — FeedbackInvitationSheet, M-083 (OPEN-DECISIONS 4).
- Decision: OPEN-DECISIONS 4 (same sheet as M-083).
