import type { TargetAndTransition } from 'motion/react';

import { MT, TOOLTIP, blur } from './tokens';

/**
 * Tooltip motion + placement — the demo's `PS.Tooltip` / TipBody
 * (Perasure `shared/ps-ui/layout.js:186-234`), R-TOOLTIP / M-022: the bubble
 * grows from what was tapped (transform-origin = the anchor's centre) on
 * ENTER — opacity 0 → 1, scale 0.96 → 1, blur 3 px → 0 — and goes on LEAVE
 * (opacity 0, scale 0.98). Any tap closes it.
 */

/** For a bubble mounted inside AnimatePresence (the demo's way). */
export const TOOLTIP_PRESENCE: {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
} = {
  initial: { opacity: 0, scale: TOOLTIP.enterScale, filter: blur() },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: MT.ENTER },
  exit: { opacity: 0, scale: TOOLTIP.exitScale, transition: MT.LEAVE },
};

/**
 * For a bubble that stays mounted and toggles (production
 * CreditValidityTooltip): keyframes so every opening grows from 0.96 / 3 px
 * blur, as a fresh mount would.
 */
export function tooltipToggle(open: boolean): TargetAndTransition {
  return open
    ? {
        opacity: [0, 1],
        scale: [TOOLTIP.enterScale, 1],
        filter: [blur(), 'blur(0px)'],
        transition: MT.ENTER,
      }
    : {
        opacity: 0,
        scale: TOOLTIP.exitScale,
        filter: 'blur(0px)',
        transition: MT.LEAVE,
      };
}

/** transform-origin that makes the bubble grow out of the anchor's centre. */
export function anchorOrigin(
  anchor: { left: number; top: number; right: number; bottom: number },
  bubble: { left: number; top: number },
): string {
  const x = Math.round((anchor.left + anchor.right) / 2 - bubble.left);
  const y = Math.round((anchor.top + anchor.bottom) / 2 - bubble.top);
  return `${x}px ${y}px`;
}

/**
 * The demo's own placement (layout.js:203-214) for new tooltips: one corner
 * covers the anchor and reaches 12 px past it on both sides — top-right corner
 * for an anchor in the right third, top-left in the left third, centred in the
 * middle; with no room below it covers the anchor with a bottom corner and
 * opens upwards; always inside the 16 px margins. All values in CSS px,
 * relative to the frame the bubble is positioned in.
 */
export function placeTooltip(input: {
  anchor: { left: number; top: number; right: number; bottom: number };
  bubble: { width: number; height: number };
  frame: { width: number; height: number };
  /** px per design px (root font size / 16) */
  scale?: number;
  /** extra bottom inset (safe area) */
  bottomInset?: number;
}): { left: number; top: number; transformOrigin: string; up: boolean } {
  const k = input.scale ?? 1;
  const M = TOOLTIP.margin * k;
  const O = TOOLTIP.reach * k;
  const { anchor: a, bubble, frame } = input;
  const bottomSafe = M + (input.bottomInset ?? 0);
  const cx = (a.left + a.right) / 2;
  let x =
    cx > (frame.width * 2) / 3
      ? a.right + O - bubble.width
      : cx < frame.width / 3
        ? a.left - O
        : cx - bubble.width / 2;
  let y = a.top - O;
  let up = false;
  if (y + bubble.height > frame.height - bottomSafe) {
    y = a.bottom + O - bubble.height;
    up = true;
  }
  x = Math.max(M, Math.min(frame.width - bubble.width - M, x));
  y = Math.max(M, Math.min(frame.height - bubble.height - bottomSafe, y));
  const left = Math.round(x);
  const top = Math.round(y);
  return { left, top, up, transformOrigin: anchorOrigin(a, { left, top }) };
}
