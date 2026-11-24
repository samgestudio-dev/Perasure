/**
 * PeraSure motion foundation (rebrand demo → production).
 * Import from here or from the single files (the single files keep the
 * source-level tests free of CSS imports: Sheet, Rise, presets, tokens,
 * press, popover, tooltip, PageTransition have no CSS).
 */
export * from './tokens';
export { MotionRoot } from './MotionRoot';
export { prefersReducedMotion, useReducedMotion } from './reducedMotion';
export { pressProps, usePress } from './press';
export { fade, reveal, PAGE_VARIANTS, type PresenceProps } from './presets';
export { Swap, type SwapProps } from './Swap';
export { Crossfade, type CrossfadeProps } from './Crossfade';
export {
  Rise,
  RiseContext,
  rise,
  useRise,
  type RiseOptions,
  type RiseProps,
} from './Rise';
export {
  PageTransition,
  pageTransitionKey,
  type PageDirection,
  type PageTransitionProps,
} from './PageTransition';
export {
  Sheet,
  useSheetDrag,
  type SheetDragApi,
  type SheetPlacement,
  type SheetProps,
} from './Sheet';
export { Toaster } from './Toaster';
export { toastStore, type ToastItem } from './toastStore';
export {
  centreOnTap,
  menuRowMotion,
  popoverMotion,
  PopoverMotionContext,
  recentTap,
  trackLastTap,
  usePopoverMotion,
} from './popover';
export {
  anchorOrigin,
  placeTooltip,
  TOOLTIP_PRESENCE,
  tooltipToggle,
} from './tooltip';
export { useScrollVeil } from './useScrollVeil';
export { BusyDots } from './BusyDots';
export { Cover, Overlay, type LayerProps } from './Overlay';
export { default as motionStyles } from './motion.module.css';
