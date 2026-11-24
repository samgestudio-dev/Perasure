import { useEffect, type RefObject } from 'react';

import { prefersReducedMotion } from './reducedMotion';

/** Partner logos marquee speed — home.js:127: 28 px per second. */
export const MARQUEE_PX_PER_S = 28;

/**
 * `PS.PartnerLogos` strip (Perasure `shared/ps-ui/home.js:117-131`, M-068):
 * the track holds its content twice and runs left by one copy's length L
 * (Σ logo width + 24 px gap) at 28 px/s, linear, forever, on its own WAAPI
 * (compositor) animation started once — not a Motion `animate` prop, whose
 * re-renders restarted it (owner: "the partner logos often don't move").
 * Not started with reduced motion (the strip stands still).
 *
 * L is measured as half the track's width (two identical copies), again when
 * the track resizes (fonts, images, rotation); the loop keeps its place.
 */
export function useMarquee(trackRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof el.animate !== 'function' || prefersReducedMotion()) {
      return undefined;
    }

    let animation: Animation | null = null;
    let length = 0;

    const start = () => {
      const next = el.scrollWidth / 2;
      if (!(next > 0) || Math.abs(next - length) < 0.5) return;
      const duration = (next / MARQUEE_PX_PER_S) * 1000;
      let progress = 0;
      if (animation) {
        const time = Number(animation.currentTime ?? 0);
        const previous = (length / MARQUEE_PX_PER_S) * 1000;
        progress = previous > 0 ? (time % previous) / previous : 0;
        animation.cancel();
      }
      length = next;
      animation = el.animate(
        [
          { transform: 'translateX(0px)' },
          { transform: `translateX(${-next}px)` },
        ],
        { duration, iterations: Infinity, easing: 'linear' },
      );
      animation.currentTime = progress * duration;
    };

    start();
    const observer =
      typeof ResizeObserver === 'function' ? new ResizeObserver(start) : null;
    observer?.observe(el);
    window.addEventListener('resize', start);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', start);
      animation?.cancel();
    };
  }, [trackRef]);
}
