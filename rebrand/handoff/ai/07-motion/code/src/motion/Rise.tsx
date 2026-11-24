/** @jsxRuntime automatic @jsxImportSource react */
import {
  createContext,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';

import { prefersReducedMotion } from './reducedMotion';
import { EASE_IN_CSS, MT, RISE_DEFAULTS } from './tokens';

/** Options of {@link rise} — the demo's `o` (core.js:66-67). */
export interface RiseOptions {
  /** ms before the first child (default 60) */
  delay?: number;
  /** ms between children (default 40) */
  gap?: number;
  /** rise distance in px (default MT.Y.block = 10) */
  y?: number;
  /** the first n children stay still (default 0) */
  skip?: number;
}

/**
 * `PS.rise(el, o)` (Perasure `shared/ps-ui/core.js:66-75`) — R-RISE / R-LOADING:
 * the DIRECT children of `el` rise in one after another (0.34 s on EASE_IN,
 * from `y` px and a 3 px blur), `delay + min(i - skip, 8) · gap` ms late,
 * capped at the 9th child. Web Animations with `fill: 'backwards'`, so the
 * children need no wrappers and nothing re-renders. Transform / opacity /
 * filter only. Skipped entirely with reduced motion (children appear at once).
 * Returns the started animations (for tests / cancel).
 */
export function rise(
  el: Element | null | undefined,
  o: RiseOptions = {},
): Animation[] {
  if (
    !el ||
    prefersReducedMotion() ||
    typeof (el as HTMLElement).animate !== 'function'
  ) {
    return [];
  }
  const kids = el.children;
  const gap = o.gap ?? RISE_DEFAULTS.gap;
  const y = o.y ?? MT.Y.block;
  const d0 = o.delay ?? RISE_DEFAULTS.delay;
  const skip = o.skip ?? 0;
  const out: Animation[] = [];
  for (let i = skip; i < kids.length; i += 1) {
    out.push(
      kids[i].animate(
        [
          {
            opacity: 0,
            transform: `translateY(${y}px)`,
            filter: `blur(${MT.BLUR}px)`,
          },
          { opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' },
        ],
        {
          duration: RISE_DEFAULTS.durationMs,
          delay: d0 + Math.min(i - skip, RISE_DEFAULTS.cap) * gap,
          easing: EASE_IN_CSS,
          fill: 'backwards',
        },
      ),
    );
  }
  return out;
}

/**
 * `PS.RiseCtx` (core.js:78): true = what is inside was NOT waited for (a page
 * seen before), so lists that would rise (Crossfade `rise`) are there at once.
 */
export const RiseContext = createContext(false);

/**
 * Plays {@link rise} once on mount on the element in `ref` (unless `off`).
 * Read {@link RiseContext} yourself to decide `off` (the demo's Crossfade
 * skips only its first render on a seen page).
 */
export function useRise(
  ref: RefObject<Element | null>,
  o: RiseOptions & { off?: boolean } = {},
) {
  const opts = useRef(o);
  useLayoutEffect(() => {
    if (opts.current.off) return undefined;
    const anims = rise(ref.current, opts.current);
    return () => anims.forEach((a) => a.cancel());
    // plays once, on mount (as the demo's useLayoutEffect(..., []))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Props of {@link Rise}. */
export interface RiseProps extends RiseOptions {
  className?: string;
  style?: CSSProperties;
  /** no motion (content is there at once) */
  off?: boolean;
  children?: ReactNode;
}

/**
 * `PS.Rise` (core.js:79-83): a box whose direct children rise in one after
 * another when it appears. Use it around content that has just loaded
 * (R-LOADING: "what was waited for then rises in piece by piece").
 */
export function Rise({ className, style, off, children, ...o }: RiseProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useRise(ref, { ...o, off });
  return (
    <div className={className} ref={ref} style={style}>
      {children}
    </div>
  );
}

export default Rise;
