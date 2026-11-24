/** @jsxRuntime automatic @jsxImportSource react */
import styles from './motion.module.css';

/**
 * `PS.Busy` (Perasure `shared/ps-ui/feedback.js:37-38`) — M-055: the small
 * three-dot pulse inside a button that is waiting. CSS keyframes (0.9 s,
 * dots 150 ms apart); still at 0.7 opacity with reduced motion.
 */
export function BusyDots({ label = 'Loading' }: { label?: string }) {
  return (
    <span aria-label={label} className={styles.busy} role="status">
      <i />
      <i />
      <i />
    </span>
  );
}

export default BusyDots;
