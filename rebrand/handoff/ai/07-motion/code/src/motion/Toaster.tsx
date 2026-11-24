/** @jsxRuntime automatic @jsxImportSource react */
import { useSyncExternalStore } from 'react';
import { AnimatePresence, m, type PanInfo } from 'motion/react';

import { toastStore, type ToastItem } from './toastStore';
import {
  MT,
  TOAST_BEHIND_OPACITY,
  TOAST_SPRING,
  TOAST_STACK,
  TOAST_SWIPE,
  Z,
  blur,
} from './tokens';
import styles from './Toaster.module.css';

/** Design px → CSS px at the current root size (the demo's PS.px, core.js:24). */
function px(n: number): number {
  if (typeof document === 'undefined') return n;
  const root =
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return (n * root) / 16;
}

/**
 * Toaster — the demo's `PS.Toasts` (Perasure `shared/ps-ui/layout.js:242-264`),
 * R-TOAST: toasts sit at the top, 8 px under the header bar, like iPhone
 * notifications. Every call shows a new one at once; the new one covers the
 * old, which slips a little lower behind it, smaller and fainter (a stack of
 * 3: y 0 / 10 / 18, scale 1 / 0.94 / 0.88, opacity 1 / 0.55 / 0.3); each
 * leaves after its own time; a swipe to the left closes the top one.
 *
 * Motions: M-016 stack, M-017 swipe-left, M-023 single toast in / out.
 */
export function Toaster() {
  const all = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );
  const shown = all.slice(-TOAST_STACK.length);
  const n = shown.length;
  const zIndex = shown.reduce<number>(
    (z, item) => Math.max(z, item.zIndex),
    Z.toast,
  );

  return (
    <div aria-live="polite" className={styles.toaster} style={{ zIndex }}>
      <AnimatePresence initial={false}>
        {shown.map((item: ToastItem, i) => {
          const depth = n - 1 - i;
          const slot = TOAST_STACK[Math.min(depth, TOAST_STACK.length - 1)];
          const top = depth === 0;
          const b = blur();
          return (
            <m.div
              animate={{
                opacity: slot.opacity,
                y: px(slot.y),
                scale: slot.scale,
                x: 0,
                filter: 'blur(0px)',
                transition: {
                  default: TOAST_SPRING,
                  opacity: depth ? TOAST_BEHIND_OPACITY : MT.ENTER,
                  filter: MT.ENTER,
                },
              }}
              className={styles.slot}
              drag={top ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={TOAST_SWIPE.elastic}
              exit={
                item.swiped
                  ? {
                      x: TOAST_SWIPE.exitX,
                      opacity: 0,
                      transition: { x: TOAST_SPRING, opacity: MT.LEAVE },
                    }
                  : {
                      opacity: 0,
                      y: -10,
                      scale: 0.98,
                      filter: b,
                      transition: MT.LEAVE,
                    }
              }
              initial={{ opacity: 0, y: -16, scale: 0.97, filter: b }}
              key={item.id}
              onDragEnd={(_: unknown, info: PanInfo) => {
                if (
                  info.offset.x < TOAST_SWIPE.offsetX ||
                  info.velocity.x < TOAST_SWIPE.velocityX
                ) {
                  toastStore.remove(item.id, 'swipe');
                }
              }}
              role="status"
              style={{
                zIndex: 10 - depth,
                pointerEvents: top ? 'auto' : 'none',
              }}
            >
              <div className={styles.bubble}>{item.content}</div>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Toaster;
