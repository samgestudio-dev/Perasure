/**
 * `PS.reduce` (Perasure `shared/ps-ui/core.js:26`): true when the user asked
 * for reduced motion. Motion components already honour it through
 * `<MotionConfig reducedMotion="user">` (MotionRoot); this flag gates what
 * Motion does not see — WAAPI rises (`rise()`), imperative glides
 * (`animate()` on motion values), ripples and the "calm" popover.
 *
 * Read at call time (not cached at import) so tests and settings changes are
 * picked up; `matchMedia` is cheap.
 */
export function prefersReducedMotion(): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { useReducedMotion } from 'motion/react';
