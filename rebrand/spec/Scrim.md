# Scrim

Figma: component set `11021:822` (05 · Structure `10982:20`) · 2 variants · showcase `11021:823`
The layer behind a sheet, popover or dialog (BRIEF 14, ARCHITECTURE §12.9). A navy gradient, clear at the top: secondary pages sit
under the app's native nav bar, which the web view can't dim, so a flat scrim would leave a band under it. No blur (cheap on low-end
Android; the effect style Blur/Scrim was deleted).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Type | VARIANT | Gradient · Flat | Gradient | `type: 'gradient' \| 'flat'` (flat only for full-screen dialogs on tab pages) |

## Parts and tokens

Full-screen frame (Figma 360 × 800; demo: covers the whole frame, `position: absolute; inset: 0`). No children.

| Type | Fill |
|---|---|
| Gradient | linear, top → bottom: 0 % `var(--overlay-scrim-top)` [Overlay/Scrim/Top = navy 0 %] · 28 % `var(--overlay-scrim-mid)` [Overlay/Scrim/Mid = navy 32 %] · 100 % `var(--overlay-scrim-bottom)` [Overlay/Scrim/Bottom = navy 56 %] — CSS shorthand `var(--gradient-scrim)` |
| Flat | `var(--overlay-scrim)` [Overlay/Scrim/Default = navy 40 %] |

Primitives: `--palette-alpha-navy-0 / -32 / -40 / -56` (navy #000128 at 0 / 32 / 40 / 56 %).

## States

| # | Caption | Props |
|---|---|---|
| 0 | Gradient — under a sheet on a secondary page (top stays clear for the native nav bar) | `type:'gradient'` over a secondary page |
| 1 | Flat — full-screen dialog on a tab page | `type:'flat'` |

Behaviour (demo, existing sheet motion): fades in with the sheet, exit faster; a tap on the scrim closes the sheet. Sheet and Popover use
this component under them (their showcases will show a sheet over a secondary page with the nav-bar area clear).
