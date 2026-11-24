import type { Transition, Variants } from 'motion/react';

import { EASE_LEAVE, MT, PAGE_RISE, blur } from './tokens';

/** initial / animate / exit triple for a keyed node inside AnimatePresence. */
export interface PresenceProps {
  initial: { opacity: number; y: number; filter: string };
  animate: {
    opacity: number;
    y: number;
    filter: string;
    transition: Transition;
  };
  exit: {
    opacity: number;
    y?: number;
    filter?: string;
    transition: Transition;
  };
}

/**
 * `PS.fade(y)` (Perasure `shared/ps-ui/core.js:55-60`) — R-FADE crossfade for a
 * keyed node inside `AnimatePresence`: comes in rising `y` px from a 3 px blur
 * on ENTER (0.30 s after 0.07 s), goes out rising another `y` px into the blur
 * on LEAVE (0.15 s). `y` defaults to `MT.Y.text` (8); use `MT.Y.block` (10)
 * for blocks, `MT.Y.digit` (6) for digits / meta lines, a negative value to
 * drop in from above (field error: -4).
 */
export function fade(y: number = MT.Y.text): PresenceProps {
  const b = blur();
  return {
    initial: { opacity: 0, y, filter: b },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: MT.ENTER },
    exit: { opacity: 0, y: -y, filter: b, transition: MT.LEAVE },
  };
}

/**
 * `PS.reveal(i)` (core.js:62-65) — entrance of secondary content, item i of a
 * list (R-RISE): rises 8 px from a 3 px blur in 0.34 s, 60 ms + i·30 ms late;
 * leaves with opacity only on LEAVE.
 */
export function reveal(i = 0): PresenceProps {
  return {
    initial: { opacity: 0, y: MT.Y.text, filter: blur() },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: MT.REVEAL(i),
    },
    exit: { opacity: 0, transition: MT.LEAVE },
  };
}

/**
 * Page crossfade variants — `PS.Pages` PAGE (Perasure `shared/ps-ui/layout.js:128-147`).
 * `custom` is the direction: 0 / 1 / -1 crossfade (owner: no sideways slide);
 * 2 = the new page rises from the bottom over the old one on SPRING_PCT;
 * -2 = the leaving page goes back down in 0.3 s.
 */
export const PAGE_VARIANTS: Variants = {
  enter: (d: number) => {
    if (d === 2) return { x: '0%', y: '100%', opacity: 1, zIndex: 2 };
    if (d === -2) return { x: '0%', y: '0%', opacity: 1, zIndex: 0 };
    return { x: '0%', y: '0%', opacity: 0, zIndex: 1 };
  },
  center: (d: number) =>
    d === 2 || d === -2
      ? { x: '0%', y: '0%', opacity: 1, zIndex: 1, transition: MT.SPRING_PCT }
      : {
          x: '0%',
          y: '0%',
          opacity: 1,
          zIndex: 1,
          transition: { opacity: MT.ENTER },
        },
  exit: (d: number) => {
    if (d === 2)
      return { opacity: 0.999, zIndex: 0, transition: PAGE_RISE.holdOld };
    if (d === -2)
      return {
        y: '100%',
        zIndex: 2,
        transition: { duration: PAGE_RISE.down.duration, ease: EASE_LEAVE },
      };
    return { opacity: 0, zIndex: 0, transition: MT.LEAVE };
  },
};
