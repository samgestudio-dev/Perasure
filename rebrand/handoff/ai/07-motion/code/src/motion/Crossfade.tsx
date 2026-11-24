/** @jsxRuntime automatic @jsxImportSource react */
import {
  use,
  useEffect,
  useState,
  type CSSProperties,
  type Key,
  type ReactNode,
} from 'react';
import { AnimatePresence, m } from 'motion/react';

import { fade } from './presets';
import { Rise, RiseContext } from './Rise';
import { CROSSFADE_RISE, MT } from './tokens';

/** Props of {@link Crossfade}. */
export interface CrossfadeProps {
  /** what identifies the content (tab id, month, list id …) */
  k: Key;
  /**
   * rise variant: the old content just fades (LEAVE), the new content's
   * direct children rise in one after another (delay 70 ms, gap 40 ms) —
   * skipped on the FIRST render when RiseContext says the page was seen
   * before (later changes always rise), as coupon.js:108-111.
   */
  rise?: boolean;
  /** rise distance (default MT.Y.block 10) */
  y?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * `PS.Crossfade` (Perasure `shared/ps-ui/coupon.js:106-114`) — R-FADE: content
 * that is replaced (a tab's list, a month grid, a places list) crossfades.
 * `AnimatePresence initial={false} mode="popLayout"`: the leaving node is
 * popped out of layout so the new one takes its place at once. Default:
 * PS.fade(10) — new rises 10 px from a 3 px blur on ENTER, old rises out on
 * LEAVE. The parent needs `position: relative` (popLayout).
 */
export function Crossfade({
  k,
  rise: riseKids,
  y = MT.Y.block,
  className,
  style,
  children,
}: CrossfadeProps) {
  const seen = use(RiseContext);
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    setFirstRender(false);
  }, []);
  if (riseKids) {
    return (
      <AnimatePresence initial={false} mode="popLayout">
        <m.div
          key={k}
          style={style}
          exit={{ opacity: 0, transition: MT.LEAVE }}
        >
          <Rise
            className={className}
            delay={CROSSFADE_RISE.delay}
            gap={CROSSFADE_RISE.gap}
            off={firstRender && seen}
          >
            {children}
          </Rise>
        </m.div>
      </AnimatePresence>
    );
  }
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <m.div key={k} className={className} style={style} {...fade(y)}>
        {children}
      </m.div>
    </AnimatePresence>
  );
}

export default Crossfade;
