import { useLayoutEffect, type RefObject } from 'react';

type Attributes = Record<string, string | undefined>;

function apply(el: Element, attrs: Attributes) {
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined) el.removeAttribute(name);
    else el.setAttribute(name, value);
  }
}

/**
 * Puts attributes on the scrim (and optionally the panel) of the shared
 * {@link Sheet} this panel is in. The scrim is the first child of the Sheet
 * layer, the panel's sibling.
 *
 * Production sheets tracked taps through `data-event-type` on their own mask
 * and panel (the global click collector reads `dataset.eventType`), and some
 * labelled the mask. Sheet draws both itself and takes no data-* props, so
 * the migrated sheets hand those attributes over here and keep the tracking
 * contract. Runs after the Sheet commits its frame (child effects run first),
 * before paint.
 *
 * 共享 Sheet 自己绘制遮罩与面板；迁移后的弹层用它把原遮罩／面板上的埋点
 * data-event-type、aria-label 挂回去，保持点击采集不变。
 */
export function useScrimAttributes(
  panelRef: RefObject<HTMLElement | null>,
  open: boolean,
  scrimAttributes: Attributes,
  panelAttributes: Attributes = {},
): void {
  const key = JSON.stringify([scrimAttributes, panelAttributes]);
  useLayoutEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const layer = panel?.parentElement;
    if (!panel || !layer || !layer.hasAttribute('data-sheet-layer')) return;
    const [scrimAttrs, panelAttrs] = JSON.parse(key) as [
      Attributes,
      Attributes,
    ];
    const scrim = layer.firstElementChild;
    if (scrim && scrim !== panel) apply(scrim, scrimAttrs);
    apply(panel, panelAttrs);
  }, [panelRef, open, key]);
}

export default useScrimAttributes;
