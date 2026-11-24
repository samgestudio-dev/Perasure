# Sheet

Figma: component set `11038:1448` (05 · Structure `10982:20`) · 3 variants · showcase `11038:1449`
Building block `.Slot` `11038:1391` (content placeholder). Uses Scrim (Scrim.md), .GlassButton (close) and Button (footer).
Content that rises from the bottom (demo `PS.Sheet` kinds plain · card · page).

## Props

| Figma property | Type | Values | Default | React prop |
|---|---|---|---|---|
| Kind | VARIANT | Plain · Card · Page | Plain | `kind: 'plain' \| 'card' \| 'page'` |
| Title | TEXT | | "Choose a repayment plan" | `title` (SheetHead) |
| Head | BOOLEAN | | true | title row shown |
| Content | INSTANCE_SWAP | `.Slot` → your component | .Slot | `children` |
| Footer | BOOLEAN (exposed Button) | | true | footer button(s) |
| Handle | BOOLEAN | | true | drag handle |

Scrim rule (owner, superseded 2026-11-20 by BRIEF 19): ~~Page sheets have no scrim~~ → **every sheet and popover sits on Scrim Type=Gradient and
has Elevation/2**; header gap 12, header shadow fades in with scroll (BRIEF 19). Table updated by figma-lib 2026-11-20.

## Parts and tokens

| Part | Plain | Card | Page |
|---|---|---|---|
| width | 360 | 344 (8 from each side; 24 above the bottom in the showcase) | 360, **684** tall (below the 116 header) |
| fill | `var(--surface-raised)` | `var(--surface-raised)` | `var(--surface-sunken)` |
| radius | top `var(--radius-xxl)` 32 | `var(--radius-xxl)` 32 all round | top `var(--radius-xl)` 24 |
| padding | top `var(--spacing-padding-2xl)` 24, sides `var(--spacing-padding-lg)` 16, bottom `var(--spacing-page-bottom-md)` | top 24, sides 16, bottom `var(--spacing-padding-lg)` 16 | top 24, sides 16, bottom `var(--spacing-page-bottom-sm)` |
| gap | `var(--spacing-gap-lg)` 16 | same | same; Content fills the height |
| shadow | `var(--elevation-2)` | `var(--elevation-2)` | `var(--elevation-2)` (was none; BRIEF 19) |
| scrim | Scrim Type=Gradient | Scrim Type=Gradient | Scrim Type=Gradient (was none; BRIEF 19) |

| Part | Token |
|---|---|
| Handle | **38 × 6**, 8 from the top, centred, `var(--bg-tint-subtle)`, radius `var(--radius-full)`; always the top layer |
| Head | gap `var(--spacing-gap-md)` 12: Title `.ps-t-title-sm` `var(--content-primary)` (fills) + close .GlassButton (Icon / Close) |
| Content | `.Slot`: dashed `var(--border-default)` 1 px, `var(--surface-page-subtle)`, radius `var(--radius-md)` — replaced by real content |
| Footer | Button Primary Large, Fill width, label "Confirm" |

## States

| # | Caption | Props |
|---|---|---|
| 0 | Plain on Scrim Gradient over a secondary page | `kind:'plain'` + Scrim gradient |
| 1 | Card on Scrim Gradient | `kind:'card'` + Scrim gradient |
| 2 | Page sheet on Scrim Gradient (BRIEF 19) | `kind:'page'` (top at 116, under the header) + Scrim gradient |

Behaviour (demo, existing): rises on the Smooth spring; the scrim fades in 0.2 s and out on LEAVE; drag the top edge down (> 96 px or a fast
flick) to close; the content rises in piece by piece; a closing sheet no longer blocks the page.

## Phase 1 · legacy geometry (2026-11-19)

New Kind=Panel (11129:4353): the legacy drawn sheet panel: 360 wide, radius 32 top, handle 38 × 6 at 161 / 8, legacy shadow, no padding; the fill is overridden per screen (Surface/Page, Surface/Raised, Surface/Default as in legacy). Screens put their content on top.

2026-11-20: where the legacy handle sits inside a filled header frame (bank-search sheets 5803:14326 and the popovers 6062:*), the panel's own handle would be hidden under that header, so the kit keeps the legacy handle there (bound to v2) and hides the panel's. Repayment Plan 11055:2682: the panel had ended up above the content; it is the bottom layer again.

## 2026-11-20 · BRIEF 19 · scrim, shadow, fixed header

- Every sheet (Plain, Card, Panel, Page) and every popover sits on **Scrim Type=Gradient** and has **Elevation/2**. Kind=Page now has
  Elevation/2 too (Figma `11038:1430`).
- **Fixed header** (handle + search / title + close, 88 tall): component `.SheetHeader` `11216:4546` (05 · Structure), two states:
  - `State=At rest` `11216:4541`: background blur only, **no shadow** (scrollTop 0);
  - `State=Scrolled` `11216:4542`: blur + `Elevation/1` (downward).
  Behaviour (demo): the header shadow fades in as the content scrolls under it, **opacity = min(scrollTop / 32, 1)**, like the page header's veil.
- **Gap:** the content starts **12 px** (`var(--spacing-gap-md)`) below the header (it was flush at 88).
- Screens: the drawn headers keep their layers (not swapped to `.SheetHeader` in phase 1); at rest they lost the drop shadows and got the 12 gap.

## 2026-11-20 · BRIEF 37 · close button
Every sheet / popover / dialog close is `.GlassButton Type=Close` (`11271:24010`): 40 × 40 glass, the legacy `Cancel-Thick` glyph at exactly
14 × 14 centred (13 / 13), placed with rescale, `var(--content-primary)`. No overridden icon or size.
