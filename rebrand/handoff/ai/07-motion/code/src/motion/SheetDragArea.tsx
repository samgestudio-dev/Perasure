/** @jsxRuntime automatic @jsxImportSource react */
import type { CSSProperties, ReactNode } from 'react';

import { useSheetDrag } from './Sheet';

/** Props of {@link SheetDragArea}. */
export interface SheetDragAreaProps {
  className?: string;
  style?: CSSProperties;
  /** render as this element (default div; header / section for semantics) */
  as?: 'div' | 'header' | 'section';
  children?: ReactNode;
}

/**
 * A non-interactive part of a sheet (title row, search row, hero) that also
 * starts the shared Sheet's drag-to-close (M-015) — the hand-rolled sheets
 * let their whole header drag. Buttons, inputs and links inside it keep their
 * taps (Sheet skips interactive targets). Outside a Sheet, or with drag off,
 * it is a plain element.
 *
 * 弹层中非交互区域（标题行、搜索行）也可下拉关闭；其中的按钮与输入框不受影响。
 */
export function SheetDragArea({
  className,
  style,
  as: Tag = 'div',
  children,
}: SheetDragAreaProps) {
  const drag = useSheetDrag();
  return (
    <Tag
      className={className}
      onPointerDown={drag.enabled ? drag.startDrag : undefined}
      style={
        drag.enabled
          ? { pointerEvents: 'auto', touchAction: 'none', ...style }
          : style
      }
    >
      {children}
    </Tag>
  );
}

export default SheetDragArea;
