import { MT, TAP, TAP_ICON } from './tokens';

/**
 * Props that give an `m.*` element the PeraSure press (R-PRESS) — the demo's
 * `PS.press(icon)` (Perasure `shared/ps-ui/core.js:53`):
 * scale 0.985 (pills, cards, rows, tabs, keys) or 0.92 (`icon`: round icon
 * buttons), 60 ms in and out, no bounce. Spread onto an `m.button` / `m.div`:
 *
 * ```tsx
 * <m.button {...pressProps()} />          // pill / card
 * <m.button {...pressProps(true)} />      // round icon button
 * ```
 *
 * Disabled controls get no press (core.js:152): pass `disabled`.
 */
export function pressProps(icon = false, disabled = false) {
  if (disabled) return { transition: MT.PRESS } as const;
  return { whileTap: icon ? TAP_ICON : TAP, transition: MT.PRESS } as const;
}

/** Hook form of {@link pressProps} (same object; no state). */
export function usePress(icon = false, disabled = false) {
  return pressProps(icon, disabled);
}

export { TAP, TAP_ICON };
