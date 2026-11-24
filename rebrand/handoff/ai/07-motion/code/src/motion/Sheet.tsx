/** @jsxRuntime automatic @jsxImportSource react */
import {
  createContext,
  useCallback,
  use,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  m,
  useDragControls,
  useIsPresent,
  type PanInfo,
  type Variants,
} from 'motion/react';

import { rise } from './Rise';
import { MT, SCRIM_IN, SHEET_DRAG, SHEET_RISE, Z } from './tokens';

/**
 * Shared Sheet — the demo's `PS.Sheet` / `SheetBody`
 * (Perasure `shared/ps-ui/layout.js:157-176`), as the motion shell of every
 * production bottom sheet / dialog (MobileModal is rebuilt on it).
 *
 * Motions (motions.json): M-013 slide up / down on SPRING_PCT (enter AND
 * exit), M-014 scrim fade (0.2 s in, LEAVE out), M-015 drag-to-close from the
 * top strip (elastic 0.6 down only, closes past 96 px or 640 px/s, springs
 * back 240 / 30 otherwise), M-021 content rise (children after the first two
 * rise in, delay 110 ms, 8 px), R-LEAVE-NOTAPS (a closing sheet takes no taps).
 *
 * No CSS file on purpose: layout is inline so the shell can be loaded by the
 * source-level tests without a CSS loader; consumers style the panel through
 * `className` exactly as before.
 */

/** Where the panel sits. `center` is production's dialog (not in the demo; it uses ENTER / LEAVE). */
export type SheetPlacement = 'bottom' | 'center';

/** Lets a header (or any part of the sheet) start the drag-to-close. */
export interface SheetDragApi {
  /** call from onPointerDown of a non-interactive area to start dragging the sheet */
  startDrag: (event: ReactPointerEvent) => void;
  /** false when drag-to-close is off (center dialog, disabled) */
  enabled: boolean;
}

const SheetDragContext = createContext<SheetDragApi>({
  startDrag: () => undefined,
  enabled: false,
});

/** The drag API of the sheet this component is in. */
export function useSheetDrag(): SheetDragApi {
  return use(SheetDragContext);
}

const INTERACTIVE =
  'button, a, input, select, textarea, label, [role="button"], [data-sheet-no-drag]';

/** Props of {@link Sheet}. */
export interface SheetProps {
  open: boolean;
  /** scrim tap, drag past the threshold */
  onClose?: () => void;
  placement?: SheetPlacement;
  /** demo kind (plain | card | page): exposed as data-kind for styling; motion is the same */
  kind?: 'plain' | 'card' | 'page';
  /** show the scrim (default true); false = a clear tap catcher */
  scrim?: boolean;
  closeOnScrimClick?: boolean;
  /** drag the top strip down to close (bottom placement only; default true) */
  dragToClose?: boolean;
  /** height of the invisible drag strip at the top (default 1.75rem = 28 design px) */
  dragStripHeight?: string;
  /** draw the 38 × 6 grab handle at the top (always the top layer, R-SHEET-VEIL) */
  grabHandle?: boolean;
  /** the panel's direct children (after skip) rise in on open (default true, M-021) */
  rise?: boolean;
  /** how many leading children stay still (default 0; the strip / handle are not children) */
  riseSkip?: number;
  /** keep the panel mounted (hidden) after it closes (MobileModal destroyOnClose=false) */
  keepMounted?: boolean;
  zIndex?: number;
  /** portal target (default document.body); false = render in place */
  portal?: boolean | Element;
  className?: string;
  style?: CSSProperties;
  /**
   * Inline placement of the panel (default true): bottom = left/right/bottom 0,
   * centre = top/left 50%. Pass false when `className` positions the panel
   * (MobileModal, whose consumers float cards with left/right/bottom offsets).
   * The panel is always the moving element (y % of its own height).
   */
  positionPanel?: boolean;
  layerClassName?: string;
  scrimClassName?: string;
  scrimStyle?: CSSProperties;
  role?: string;
  ariaModal?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  tabIndex?: number;
  panelRef?: Ref<HTMLDivElement>;
  /** the panel finished coming in */
  onOpened?: () => void;
  /** the panel finished going out (and was removed unless keepMounted) */
  onClosed?: () => void;
  children?: ReactNode;
}

const PANEL_BOTTOM: Variants = {
  hidden: { y: '100%', transition: MT.SPRING_PCT },
  shown: { y: '0%', transition: MT.SPRING_PCT },
};

/* center dialog: production-only placement, built from the demo's grow-from / ENTER / LEAVE (Tooltip M-022);
   x / y -50% keep it centred on its top/left 50% (Motion owns the transform) */
const PANEL_CENTER: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    x: '-50%',
    y: '-50%',
    transition: MT.LEAVE,
  },
  shown: { opacity: 1, scale: 1, x: '-50%', y: '-50%', transition: MT.ENTER },
};
const PANEL_CENTER_INITIAL = { opacity: 0, scale: 0.96, x: '-50%', y: '-50%' };

const SCRIM: Variants = {
  hidden: { opacity: 0, transition: MT.LEAVE },
  shown: { opacity: 1, transition: SCRIM_IN },
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else (ref as { current: T | null }).current = value;
}

interface FrameProps extends SheetProps {
  /** false while AnimatePresence plays the exit */
  presentOverride?: boolean;
}

function SheetFrame(p: FrameProps) {
  const placement = p.placement ?? 'bottom';
  const isPresent = useIsPresent();
  const present = p.presentOverride ?? isPresent;
  const active = p.open && present;
  const controls = useDragControls();
  const panel = useRef<HTMLDivElement | null>(null);
  const dragEnabled = placement === 'bottom' && p.dragToClose !== false;
  const onCloseRef = useRef(p.onClose);
  useLayoutEffect(() => {
    onCloseRef.current = p.onClose;
  });
  const shownOnce = useRef(false);

  const setPanel = useCallback(
    (el: HTMLDivElement | null) => {
      panel.current = el;
      assignRef(p.panelRef, el);
    },
    [p.panelRef],
  );

  /* M-021: what is in the sheet rises in piece by piece while it slides up (layout.js:164) */
  const riseOn = p.rise !== false;
  const riseSkip = p.riseSkip ?? 0;
  useLayoutEffect(() => {
    if (!p.open || !riseOn) return undefined;
    const anims = rise(panel.current, {
      skip: riseSkip + (dragEnabled ? 1 : 0) + (p.grabHandle ? 1 : 0),
      delay: SHEET_RISE.delay,
      y: SHEET_RISE.y,
    });
    return () => anims.forEach((a) => a.cancel());
    // rise once per opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.open]);

  const drag = useMemo<SheetDragApi>(
    () => ({
      enabled: dragEnabled,
      startDrag: (event) => {
        if (!dragEnabled) return;
        const target = event.target as Element | null;
        if (
          target &&
          typeof target.closest === 'function' &&
          target.closest(INTERACTIVE)
        )
          return;
        controls.start(event);
      },
    }),
    [controls, dragEnabled],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (
      info.offset.y > SHEET_DRAG.offsetY ||
      info.velocity.y > SHEET_DRAG.velocityY
    ) {
      onCloseRef.current?.();
    }
  };

  const target = p.open && present ? 'shown' : 'hidden';
  const hiddenForGood = !p.open && p.keepMounted;
  const leaving = !active;

  const panelVariants = placement === 'bottom' ? PANEL_BOTTOM : PANEL_CENTER;
  const panelInitial = placement === 'bottom' ? 'hidden' : PANEL_CENTER_INITIAL;

  return (
    <SheetDragContext value={drag}>
      <div
        className={p.layerClassName}
        data-sheet-layer=""
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: p.zIndex ?? Z.sheet,
          pointerEvents: 'none',
        }}
      >
        {p.scrim === false ? (
          <div
            className={p.scrimClassName}
            onClick={p.closeOnScrimClick === false ? undefined : p.onClose}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: leaving ? 'none' : 'auto',
              ...p.scrimStyle,
            }}
          />
        ) : (
          <m.div
            animate={target}
            className={p.scrimClassName}
            exit="hidden"
            initial="hidden"
            onClick={p.closeOnScrimClick === false ? undefined : p.onClose}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: leaving ? 'none' : 'auto',
              ...p.scrimStyle,
            }}
            variants={SCRIM}
          />
        )}
        <m.div
          animate={target}
          aria-label={p.ariaLabel}
          aria-labelledby={p.ariaLabelledBy}
          aria-modal={p.ariaModal}
          className={p.className}
          data-kind={p.kind ?? 'plain'}
          data-placement={placement}
          exit="hidden"
          initial={panelInitial}
          onAnimationComplete={(definition) => {
            if (definition === 'shown' && !shownOnce.current) {
              shownOnce.current = true;
              p.onOpened?.();
            }
            if (definition === 'hidden') {
              shownOnce.current = false;
              if (p.keepMounted) p.onClosed?.();
            }
          }}
          ref={setPanel}
          role={p.role}
          style={{
            ...(p.positionPanel === false
              ? null
              : placement === 'bottom'
                ? { position: 'absolute', left: 0, right: 0, bottom: 0 }
                : { position: 'absolute', left: '50%', top: '50%' }),
            pointerEvents: leaving ? 'none' : 'auto',
            visibility: hiddenForGood ? 'hidden' : undefined,
            ...p.style,
          }}
          tabIndex={p.tabIndex}
          variants={panelVariants}
          {...(dragEnabled
            ? {
                drag: 'y' as const,
                dragListener: false,
                dragControls: controls,
                dragConstraints: { top: 0, bottom: 0 },
                dragElastic: SHEET_DRAG.elastic,
                dragTransition: SHEET_DRAG.dragTransition,
                onDragEnd,
              }
            : null)}
        >
          {p.grabHandle ? (
            <span
              aria-hidden="true"
              data-sheet-grab=""
              style={{
                position: 'absolute',
                zIndex: 4,
                left: '50%',
                top: '0.5rem',
                width: '2.375rem',
                height: '0.375rem',
                marginLeft: '-1.1875rem',
                borderRadius: 999,
                background: 'var(--border-default, rgba(10, 18, 25, 0.16))',
                pointerEvents: 'none',
              }}
            />
          ) : null}
          {dragEnabled ? (
            <div
              aria-hidden="true"
              data-sheet-drag=""
              onPointerDown={(event) => controls.start(event)}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: p.dragStripHeight ?? SHEET_DRAG.stripHeight,
                zIndex: 3,
                touchAction: 'none',
              }}
            />
          ) : null}
          {p.children}
        </m.div>
      </div>
    </SheetDragContext>
  );
}

/**
 * A bottom sheet (or a centred dialog) with the PeraSure motion. Unmounts
 * when closed (iOS: no coloured fixed layer is left behind) unless
 * `keepMounted`.
 */
export function Sheet(props: SheetProps) {
  const { open, keepMounted, onClosed } = props;
  const onClosedRef = useRef(onClosed);
  useLayoutEffect(() => {
    onClosedRef.current = onClosed;
  });
  /* keepMounted: mount on first open, then stay */
  const [everOpened, setEverOpened] = useState(open);
  if (open && !everOpened) setEverOpened(true);

  if (typeof document === 'undefined') return null;
  const host =
    props.portal === false
      ? null
      : typeof props.portal === 'object' && props.portal
        ? props.portal
        : document.body;

  const tree = keepMounted ? (
    everOpened ? (
      <SheetFrame {...props} presentOverride />
    ) : null
  ) : (
    <AnimatePresence onExitComplete={() => onClosedRef.current?.()}>
      {open ? <SheetFrame key="sheet" {...props} /> : null}
    </AnimatePresence>
  );

  return host ? createPortal(tree, host) : tree;
}

export default Sheet;
