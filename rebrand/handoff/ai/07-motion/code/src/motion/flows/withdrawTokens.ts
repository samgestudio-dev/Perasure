/**
 * Withdraw fund flow motion values the foundation `MT` does not carry — copied
 * 1:1 from the demo's own `prototypes/withdraw-fund-flow/motion-tokens.js` and
 * `withdraw.js` (the withdraw flow keeps these, not PS.MT's REVEAL, which has
 * no scale). New file (flow agent): tokens missing from `src/motion/tokens.ts`.
 */
import { EASE_IN, EASE_LEAVE, MT, type CubicBezier } from '../tokens';

/** motion-tokens.js:30-31 — REVEAL_SCALE 0.94 and the 0.03 s stagger. */
export const REVEAL_SCALE = 0.94;
export const STAGGER_STEP = 0.03;

/**
 * motion-tokens.js:32-39 `REVEAL(i)` — the withdraw flow's staggered reveal:
 * opacity 0, y 10 (Y.block), scale 0.94 → in 0.34 s after 0.06 + i·0.03 s on
 * EASE_IN. Used by the keypad keys (first open, i = 0…11 in reading order,
 * M-099) and the order page blocks (M-108).
 */
export function WD_REVEAL(i: number) {
  return {
    initial: { opacity: 0, y: MT.Y.block, scale: REVEAL_SCALE },
    transition: {
      duration: 0.34,
      delay: 0.06 + i * STAGGER_STEP,
      ease: EASE_IN,
    },
  } as const;
}

/**
 * motion-tokens.js:43-50 `REVEAL_ROW(row)` — coming back to the keypad from
 * the order page: by rows, 0.22 s after 0.02 + row·0.025 s (M-100).
 */
export function WD_REVEAL_ROW(row: number) {
  return {
    initial: { opacity: 0, y: 8, scale: 0.96 },
    transition: { duration: 0.22, delay: 0.02 + row * 0.025, ease: EASE_IN },
  } as const;
}

/** withdraw.js:1146 / 1156 — pad line and keypad wrapper fade in 0.2 s (Motion's default ease). */
export const PAD_IN = { duration: 0.2 } as const;

/** withdraw.js:1147 / 1157 — pad line and keypad leave: opacity 0, y −10 on LEAVE. */
export const PAD_OUT = {
  opacity: 0,
  y: -MT.Y.block,
  transition: { duration: MT.LEAVE.duration, ease: EASE_LEAVE },
} as const;

/** withdraw.js:1174 — key press: scale 0.94 + background to the line colour, Motion's default transition. */
export const KEY_PRESS_SCALE = 0.94;
/** withdraw.js:27 C.line — the key's pressed background (no token in production; Figma Stroke/Default). */
export const KEY_PRESS_BG_FALLBACK = '#d6d6dd';

/** withdraw.js:1127 — term chip press 0.96. */
export const CHIP_PRESS_SCALE = 0.96;

/** withdraw.js:1044 — Withdraw pill press 0.98 (0.99 while it shows the message). */
export const PILL_PRESS_SCALE = { closed: 0.98, open: 0.99 } as const;

/**
 * withdraw.js:230-238 DIGIT_IN — a typed digit: 0.38 s, times [0, .4, .7, 1],
 * ease [0.34, 0.02, 0.2, 1]; opacity 0 → .28 → .72 → 1, y 5 → 2.1 → .6 → 0,
 * blur 5 → 2.5 → .8 → 0 px. A digit that was already there when the screen
 * opened is DIGIT_STILL (no animation).
 */
export const DIGIT_IN = {
  duration: 0.38,
  times: [0, 0.4, 0.7, 1],
  ease: [0.34, 0.02, 0.2, 1] as CubicBezier,
  opacity: [0, 0.28, 0.72, 1],
  y: [5, 2.1, 0.6, 0],
  blur: [5, 2.5, 0.8, 0],
} as const;

/**
 * Motion's default layout transition (motion-dom `defaultLayoutTransition`):
 * what the demo's `layout: 'position'` digits / caret / "00" / ".00" glide on
 * when a typed digit pushes them (withdraw.js:1221-1239, no transition prop).
 */
export const LAYOUT_GLIDE = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1] as CubicBezier,
};

/** withdraw.js:1494 — the loan screen leaves: y → full height, 0.3 s [0.4, 0, 1, 1]. */
export const SHEET_EXIT = { duration: 0.3, ease: EASE_LEAVE };

/** withdraw.js:1399 — Confirm colours (disabled ↔ enabled) 0.2 s. */
export const CONFIRM_COLOR_S = 0.2;

/** withdraw.js:547 — scroll to the agreement: Smooth + restDelta 0.5, restSpeed 5; nudge within 24 px. */
export const AGREE_SCROLL = {
  restDelta: 0.5,
  restSpeed: 5,
  arriveWithinPx: 24,
} as const;

/** withdraw.js:556 — the nudge ring: scale 1 → 2.4, opacity 0.6 → 0, 0.6 s EASE_IN, played twice (chained). */
export const NUDGE = {
  scale: [1, 2.4],
  opacity: [0.6, 0],
  duration: 0.6,
  ease: EASE_IN,
} as const;

/** withdraw.js:564 / 82 — bar veil: fades out over the last (bar height || 108 / 116) px of scroll. */
export const VEIL_END_PX = { orderBar: 108, homeBar: 116 } as const;
