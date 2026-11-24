/**
 * PeraSure motion tokens — a 1:1 port of the rebrand demo's `PS.MT`
 * (Perasure repo, `shared/ps-ui/core.js:27-49`) plus the shared values the
 * demo keeps next to it (press, toast spring, sheet / toast drag, stack).
 *
 * Rules these values serve (motions.json → rules):
 * - R-SPRING: geometry rides the Smooth spring 240 / 30 / 1, never sped up for
 *   a short move, no bounce (except menus, R-MENU).
 * - R-FADE: replaced content crossfades — LEAVE 0.15 s rising out, ENTER 0.30 s
 *   + 0.07 s delay rising 6–10 px, 3 px blur between.
 * - R-PRESS: press is 60 ms, scale 0.985 (pills, cards) / 0.92 (icon buttons).
 * - R-COLOR: a state change that moves nothing changes colour only, in 150 ms.
 * - R-RISE: secondary content enters on a 0.34 s clock, 3 px blur, one after another.
 *
 * Do not change a value here without changing the demo: these numbers are the
 * owner-approved feel. Durations are in SECONDS (Motion convention) unless the
 * name ends in `_MS`.
 */
import type { Transition } from 'motion/react';

/** A cubic-bezier as Motion takes it. */
export type CubicBezier = [number, number, number, number];

/** Physical spring (stiffness / damping / mass) as Motion takes it. */
export interface PhysicalSpring {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass: number;
  restDelta: number;
  restSpeed: number;
}

/** Perceptual spring (visualDuration / bounce) as Motion takes it. */
export interface VisualSpring {
  type: 'spring';
  visualDuration: number;
  bounce: number;
}

/** A tween with a fixed duration (and optional delay / ease). */
export interface Tween {
  duration: number;
  delay?: number;
  ease?: CubicBezier | 'easeOut' | 'linear';
}

/**
 * `PS.MT.EASE_IN` — core.js:30. Despite the name this is an ease-OUT curve
 * (fast start, soft landing). Used by ENTER, REVEAL, rise, menu opacity /
 * filter, agreement ripple.
 */
export const EASE_IN: CubicBezier = [0.22, 0.61, 0.36, 1];

/** `PS.MT.LEAVE.ease` — core.js:38. Accelerating curve for what goes away. */
export const EASE_LEAVE: CubicBezier = [0.4, 0, 1, 1];

/** Same curve as a CSS string, for WAAPI / CSS (PS.rise, core.js:73). */
export const EASE_IN_CSS = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

/** Rise / reveal distances by element size — `PS.MT.Y`, core.js:39. */
export interface RiseDistances {
  /** 8 px: text lines, Swap default, reveal, sheet rows. */
  text: number;
  /** 10 px: blocks, Crossfade, rise default. */
  block: number;
  /** 6 px: digits, small meta lines, FormField error. */
  digit: number;
}

/** Shape of {@link MT}. */
export interface MotionTokens {
  SPRING: PhysicalSpring;
  SPRING_PCT: PhysicalSpring;
  EASE_IN: CubicBezier;
  ENTER: Required<Pick<Tween, 'duration' | 'delay'>> & { ease: CubicBezier };
  LEAVE: Required<Pick<Tween, 'duration'>> & { ease: CubicBezier };
  Y: RiseDistances;
  BLUR: number;
  REVEAL: (i?: number) => {
    duration: number;
    delay: number;
    ease: CubicBezier;
  };
  PRESS: { duration: number };
  PRESS_SCALE: { pill: number; icon: number };
  COLOR: number;
  MENU: VisualSpring;
  MENU_Y: VisualSpring;
  MENU_ROW: (i: number) => Transition;
  MENU_OUT: { duration: number; ease: CubicBezier };
}

/**
 * `PS.MT` — every key of the demo, same values (core.js:31-49).
 */
export const MT: MotionTokens = {
  /**
   * Smooth spring in px — core.js:33. Settles within 0.378 px; 95 % at
   * ≈ 290 ms, rest ≈ 560 ms. Used by: layoutId pills (BottomNavigation,
   * Segmented, Tabs, LineTabs, MethodPicker mark), accordion / doc-card
   * height, chips reflow, carousel settle, toast spring (with tighter rest).
   */
  SPRING: {
    type: 'spring',
    stiffness: 240,
    damping: 30,
    mass: 1,
    restDelta: 0.378,
    restSpeed: 3.78,
  },
  /**
   * The same spring for values in % (something moving by its own size) —
   * core.js:35. Used by: Sheet y 100% ↔ 0% (enter AND exit), page rise dir 2.
   */
  SPRING_PCT: {
    type: 'spring',
    stiffness: 240,
    damping: 30,
    mass: 1,
    restDelta: 0.05,
    restSpeed: 0.5,
  },
  /** See {@link EASE_IN} — core.js:30. */
  EASE_IN,
  /**
   * What comes in — core.js:37: 0.30 s after a 0.07 s delay on EASE_IN.
   * Used by: Swap / fade / Crossfade enter, Tooltip grow, toast opacity +
   * filter, page crossfade opacity, Cover, sheet-card enter opacity.
   */
  ENTER: { duration: 0.3, delay: 0.07, ease: EASE_IN },
  /**
   * What goes — core.js:38: 0.15 s accelerating.
   * Used by: Swap / fade / Crossfade exit, page exit, scrim out, Cover out,
   * toast exit, tooltip exit, Overlay out.
   */
  LEAVE: { duration: 0.15, ease: EASE_LEAVE },
  /** Rise distances (px) — core.js:39. */
  Y: { text: 8, block: 10, digit: 6 },
  /** Crossfade blur bridge (px): blur(3px) ↔ blur(0px) — core.js:39. */
  BLUR: 3,
  /**
   * Reveal of item i of a list — core.js:40: 0.34 s, delay 0.06 + i·0.03 s.
   * Used by: reveal(i), OTP boxes cascade, keypad cascade (i = row + col·0.5).
   */
  REVEAL: (i = 0) => ({
    duration: 0.34,
    delay: 0.06 + i * 0.03,
    ease: EASE_IN,
  }),
  /** Press in AND release: 60 ms — core.js:41. Used by every whileTap. */
  PRESS: { duration: 0.06 },
  /** Press scale — core.js:41: pills / cards 0.985, round icon buttons 0.92. */
  PRESS_SCALE: { pill: 0.985, icon: 0.92 },
  /**
   * Colour changes: 150 ms (seconds) — core.js:42. CSS writes it as
   * `transition: <prop> 0.15s ease` (see {@link COLOR_TRANSITION_CSS}).
   */
  COLOR: 0.15,
  /**
   * Menu width spring — core.js:45: the one thing that bounces (owner).
   * Used by: Popover scaleX.
   */
  MENU: { type: 'spring', visualDuration: 0.22, bounce: 0.28 },
  /** Menu height spring, a beat behind width — core.js:46. Popover scaleY. */
  MENU_Y: { type: 'spring', visualDuration: 0.26, bounce: 0.3 },
  /**
   * Menu row i — core.js:47 ("faster, owner 2026-11-24: the menu was
   * dragging"): delay 0.02 + min(i, 8)·0.014 s; y on a light-bounce spring,
   * opacity / filter 0.12 s EASE_IN. Used by: Select popover rows.
   */
  MENU_ROW: (i: number) => ({
    delay: 0.02 + Math.min(i, 8) * 0.014,
    y: { type: 'spring', visualDuration: 0.24, bounce: 0.32 },
    opacity: { duration: 0.12, ease: EASE_IN },
    filter: { duration: 0.12, ease: EASE_IN },
  }),
  /** Menu folds back into the finger — core.js:48. Popover exit. */
  MENU_OUT: { duration: 0.12, ease: EASE_LEAVE },
};

/** `PS.TAP` — core.js:51. whileTap target for pills, cards, rows, tabs, keys. */
export const TAP = { scale: MT.PRESS_SCALE.pill } as const;

/** `PS.TAP_ICON` — core.js:52. whileTap target for round icon buttons. */
export const TAP_ICON = { scale: MT.PRESS_SCALE.icon } as const;

/** R-COLOR as a CSS duration (CSS Modules can't import TS). */
export const COLOR_TRANSITION_CSS = '0.15s ease';

/**
 * Toast spring — layout.js:252 / 271: SPRING with a tighter rest
 * (restDelta 0.01, restSpeed 0.1) because toasts move by tiny amounts
 * (scale 0.94 ↔ 1) that the px rest would cut short.
 */
export const TOAST_SPRING: PhysicalSpring = {
  ...MT.SPRING,
  restDelta: 0.01,
  restSpeed: 0.1,
};

/**
 * Height open / close spring — form.js:254, pay.js:62: SPRING with
 * restDelta 0.5 (accordion, doc card, summary chips row).
 */
export const HEIGHT_SPRING: PhysicalSpring = {
  ...MT.SPRING,
  restDelta: 0.5,
  restSpeed: 5,
};

/** Scrim / Overlay fade-in — layout.js:166, feedback.js:67: 0.2 s, Motion's default ease. */
export const SCRIM_IN: Tween = { duration: 0.2 };

/**
 * Toast stack slots by depth (0 = newest, on top) — layout.js:248.
 * y in design px, scale, opacity. Only 3 show (a stack, not a list).
 */
export const TOAST_STACK = [
  { y: 0, scale: 1, opacity: 1 },
  { y: 10, scale: 0.94, opacity: 0.55 },
  { y: 18, scale: 0.88, opacity: 0.3 },
] as const;

/** Opacity of a toast that moved behind another — layout.js:258. */
export const TOAST_BEHIND_OPACITY: Tween = { duration: 0.2 };

/** Toast swipe-left to close — layout.js:260-262. */
export const TOAST_SWIPE = {
  elastic: { left: 0.9, right: 0.08 },
  /** close when offset.x < -56 px … */
  offsetX: -56,
  /** … or velocity.x < -320 px/s */
  velocityX: -320,
  exitX: '-110%',
} as const;

/** Single-toast default time on screen (PS.useToast) — layout.js:275. ms. */
export const TOAST_DEFAULT_MS = 2600;

/** Sheet drag-to-close — layout.js:168-173. */
export const SHEET_DRAG = {
  elastic: { top: 0, bottom: 0.6 },
  /** spring back below threshold */
  dragTransition: { bounceStiffness: 240, bounceDamping: 30 },
  /** close when offset.y > 96 px … */
  offsetY: 96,
  /** … or velocity.y > 640 px/s */
  velocityY: 640,
  /** height of the drag strip at the sheet's top (1.75rem = 28 design px) — ps-ui.css:309 */
  stripHeight: '1.75rem',
} as const;

/** Sheet content rise — layout.js:164: rise {skip: 2, delay: 110 ms, y: Y.text}. */
export const SHEET_RISE = { skip: 2, delay: 110, y: MT.Y.text } as const;

/**
 * Page rise dir 2 / -2 — layout.js:134-145: new page springs up on SPRING_PCT
 * while the old one holds (opacity 0.999 for 0.56 s ≈ spring rest); going
 * back down is 0.3 s on LEAVE's curve.
 */
export const PAGE_RISE = {
  holdOld: { duration: 0.56 },
  down: { duration: 0.3, ease: EASE_LEAVE } as Tween,
} as const;

/** `PS.rise` defaults — core.js:68-74 (ms). */
export const RISE_DEFAULTS = {
  delay: 60,
  gap: 40,
  durationMs: 340,
  cap: 8,
} as const;

/** Crossfade{rise} children — coupon.js:110: delay 70 ms, gap 40 ms. */
export const CROSSFADE_RISE = { delay: 70, gap: 40 } as const;

/** Loaded page content rise — layout.js:99 (`PS.Screen rise`): delay 120 ms. */
export const SCREEN_RISE = { delay: 120 } as const;

/** Tooltip placement — layout.js:199-206 (design px). */
export const TOOLTIP = {
  margin: 16,
  reach: 12,
  enterScale: 0.96,
  exitScale: 0.98,
} as const;

/** Popover placement — form.js:175 (design px). Last tap counts for 1 s. */
export const POPOVER = {
  max: 220,
  gap: 8,
  edge: 8,
  tapMemoryMs: 1000,
  /** a picked row lights up, then the menu folds after 90 ms — form.js:182 */
  pickDelayMs: 90,
  initial: { scaleX: 0.5, scaleY: 0.22, blur: 6 },
  exit: { scaleX: 0.7, scaleY: 0.5, blur: 4 },
  rowY: 10,
  rowBlur: 2,
  opacity: { duration: 0.1, ease: EASE_IN } as Tween,
  filter: { duration: 0.16, ease: EASE_IN } as Tween,
} as const;

/** Choice sheet: colour on pick, then the sheet closes after 160 ms — form.js:141-142. */
export const CHOICE_CLOSE_DELAY_MS = 160;

/** Bars veil (R-BARS) — layout.js:79-84: header over the first 24 px; bottom over the bar's height (108 default). */
export const VEIL = { topPx: 24, bottomDefaultPx: 108 } as const;

/** OTP digit pop — form.js:45-46. */
export const OTP_DIGIT = {
  from: { opacity: 0, scale: 0.6 },
  enter: { duration: 0.18, ease: EASE_IN } as Tween,
  exit: { duration: 0.1 } as Tween,
} as const;

/** Typed amount digit — loan.js:201-202. */
export const AMOUNT_DIGIT = {
  enter: { duration: 0.2, ease: EASE_IN } as Tween,
  exit: { duration: 0.08 } as Tween,
} as const;

/** Agreement nudge ripple — loan.js:146-147: scale 1→2.4, opacity 0.6→0, 0.6 s EASE_IN, twice. */
export const RIPPLE = {
  scale: [1, 2.4],
  opacity: [0.6, 0],
  duration: 0.6,
  ease: EASE_IN,
  plays: 2,
} as const;

/** Inbox tabs pill fade (no glide, owner 2026-11-23) — coupon.js:101. */
export const TABS_FADE: Tween = { duration: 0.15, ease: 'easeOut' };

/** Carousel drag — pay.js:145-150. */
export const CAROUSEL = {
  elastic: 0.18,
  nextFraction: 0.2,
  velocity: 400,
} as const;

/**
 * R-SPRING travel stretch: a travel longer than 378 px stretches the same
 * spring (s = travel / 378 ≤ 2.5: stiffness ÷ s², damping ÷ s). Never faster.
 */
export function stretchSpring(
  travelPx: number,
  base: PhysicalSpring = MT.SPRING,
): PhysicalSpring {
  const s = Math.min(2.5, Math.max(1, Math.abs(travelPx) / 378));
  if (s === 1) return base;
  return {
    ...base,
    stiffness: base.stiffness / (s * s),
    damping: base.damping / s,
  };
}

/** `blur(Npx)` helper for the 3 px bridge. */
export const blur = (px: number = MT.BLUR): string => `blur(${px}px)`;

/**
 * z-index layers. Existing production values are kept (hand-picked per
 * component, see prod-structure.json → zIndexLayers); the motion layers sit
 * in the same scale so a dev can see where each new piece goes.
 */
export const Z = {
  /** shared Sheet / MobileModal default (unchanged) */
  sheet: 1000,
  /** Popover default (unchanged) */
  popover: 1000,
  /** Tooltip bubble + its tap catcher */
  tooltip: 1050,
  /** Toaster (unchanged default of Toast.show; callers may raise it) */
  toast: 1100,
} as const;
