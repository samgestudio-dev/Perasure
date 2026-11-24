import { createContext, use } from 'react';
import type { TargetAndTransition, Transition } from 'motion/react';

import { POPOVER, MT, blur } from './tokens';

/**
 * Popover / menu motion — the demo's `PS.Popover` PopCard
 * (Perasure `shared/ps-ui/form.js:165-224`), R-MENU: like an iPhone menu the
 * list opens centred on where the finger tapped (kept 8 px from the page
 * sides), grows out of that point on a light-bounce spring — wide and flat
 * first, its height a beat behind (MENU 0.22 s / MENU_Y 0.26 s), from a 6 px
 * blur — rows following one after another; a picked row lights up, then the
 * menu folds back into the tap (MENU_OUT 0.12 s).
 */

/** Where the last finger went down, so a list opens where the finger was. */
interface Tap {
  x: number;
  y: number;
  t: number;
}

let lastTap: Tap = { x: 0, y: 0, t: 0 };
let listening = false;

/** Starts recording the last pointerdown (capture phase, once per page). */
export function trackLastTap(): void {
  if (listening || typeof document === 'undefined') return;
  listening = true;
  document.addEventListener(
    'pointerdown',
    (event) => {
      lastTap = { x: event.clientX, y: event.clientY, t: Date.now() };
    },
    true,
  );
}

/** The last tap if it happened within the last second (form.js:189), else null (keyboard). */
export function recentTap(now: number = Date.now()): Tap | null {
  return now - lastTap.t < POPOVER.tapMemoryMs ? lastTap : null;
}

/** Test hook. */
export function setLastTapForTest(tap: Tap): void {
  lastTap = tap;
}

/** Input of {@link centreOnTap}. */
export interface TapPlacementInput {
  /** left the default placement chose (right-aligned to the anchor) */
  left: number;
  placement: 'bottom' | 'top';
  popoverWidth: number;
  viewportWidth: number;
  /** keep this far from the page sides (production: the 8 px probe) */
  edge: number;
  tap: { x: number } | null;
}

/**
 * Centres the card on the tap, kept `edge` px from the sides; the transform
 * origin is the tap's x within the card, on the edge facing the anchor
 * (top edge opening down, bottom edge opening up) — form.js:189-195.
 * Without a tap (keyboard) the default left and a right-edge origin stay.
 */
export function centreOnTap({
  left,
  placement,
  popoverWidth,
  viewportWidth,
  edge,
  tap,
}: TapPlacementInput): { left: number; transformOrigin: string } {
  const oy = placement === 'top' ? '100%' : '0px';
  if (!tap) return { left, transformOrigin: `100% ${oy}` };
  const x = Math.max(
    edge,
    Math.min(viewportWidth - edge - popoverWidth, tap.x - popoverWidth / 2),
  );
  const ox = Math.max(0, Math.min(popoverWidth, tap.x - x));
  return { left: Math.round(x), transformOrigin: `${Math.round(ox)}px ${oy}` };
}

/** Card states (calm = reduced motion: opacity only). */
export function popoverMotion(calm: boolean): {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
} {
  if (calm) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, transition: MT.MENU_OUT },
    };
  }
  return {
    initial: {
      opacity: 0,
      scaleX: POPOVER.initial.scaleX,
      scaleY: POPOVER.initial.scaleY,
      filter: blur(POPOVER.initial.blur),
    },
    animate: {
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      filter: 'blur(0px)',
      transition: {
        scaleX: MT.MENU,
        scaleY: MT.MENU_Y,
        opacity: POPOVER.opacity,
        filter: POPOVER.filter,
      } as Transition,
    },
    exit: {
      opacity: 0,
      scaleX: POPOVER.exit.scaleX,
      scaleY: POPOVER.exit.scaleY,
      filter: blur(POPOVER.exit.blur),
      transition: MT.MENU_OUT,
    },
  };
}

/**
 * Row i of an opening menu (M-038): rises 10 px from the anchor's side
 * (dir -1 opening down, +1 opening up — form.js:209,219) out of a 2 px blur,
 * MENU_ROW(i) timing. Keyframes, so the row can wait (opacity 0) while the
 * card measures and start from the right side once the placement is known.
 */
export function menuRowMotion(
  i: number,
  placement: 'bottom' | 'top' | null,
  calm: boolean,
): { initial: TargetAndTransition | false; animate: TargetAndTransition } {
  if (calm) return { initial: false, animate: { opacity: 1 } };
  if (!placement) return { initial: { opacity: 0 }, animate: { opacity: 0 } };
  const dir = placement === 'top' ? 1 : -1;
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1],
      y: [POPOVER.rowY * dir, 0],
      filter: [blur(POPOVER.rowBlur), 'blur(0px)'],
      transition: MT.MENU_ROW(i),
    },
  };
}

/** What a menu's rows need from the card around them. */
export interface PopoverMotionState {
  /** null while the card is still measuring */
  placement: 'bottom' | 'top' | null;
  /** reduced motion: opacity only, rows appear without motion */
  calm: boolean;
}

export const PopoverMotionContext = createContext<PopoverMotionState>({
  placement: null,
  calm: false,
});

/** Read inside a Popover's children (menu rows). */
export function usePopoverMotion(): PopoverMotionState {
  return use(PopoverMotionContext);
}
