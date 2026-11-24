# Component specs (figma-lib → demo-rebrand)

One file per component, written from the Figma component set on page **Component - Rebranding** (`10982:15`), file `OBsvf42AiRapcRrasD7KNm`,
tokens v2 (collections Primitive / Semantic / Component, mode Light).

Conventions used in every spec:
- **Props:** Figma property → React prop in camelCase (`Leading icon` → `leadingIcon`); VARIANT values → the same word in lower case
  (`Size=Large` → `size: 'large'`). TEXT → string, BOOLEAN → boolean, INSTANCE_SWAP → icon name (`icon: 'check'`).
- **Tokens:** CSS custom property from the variable's code syntax (`var(--bg-action)`), Figma variable name in brackets.
  Text styles → `.ps-t-<style>` classes (`Label/md` → `.ps-t-label-md`, `Body/md-strong` → `.ps-t-body-md-strong`); effect styles
  `Elevation/1|2|3` → `var(--elevation-1|2|3)` (today `--elevation-raised|overlay|focus`), `Blur/Glass`, `Blur/Scrim`.
- Disabled inputs (BRIEF 15): container stays `var(--surface-default)`; icons, flags, logos and images get opacity
  `var(--opacity-disabled)` (40 %); every text `var(--content-disabled)`; a border, if shown, `var(--border-subtle)`; no focus ring.
  Buttons keep `var(--bg-disabled)`.
- Type rules (TYPE-AND-STYLES.md): buttons use Label/md; inputs use Body/md 14/20 in phase 1 (legacy size; Body/lg 16 px is a phase 2
  readability option — Android only, no iOS input zoom); links are `--content-link*` colour + underline on any style, never a style.
  Amount tracking is graded: xxl +4 %, lg +3 %, md +2 %, xs +2 % (owner, 2026-11-19). 19 text styles, 5 effect styles.
- Touch targets (Android only): ≥ 48 dp is a phase 2 note; phase 1 keeps the legacy sizes and the legacy status bar.
- **Sizes** are Figma geometry in px (demo: rem, 16 px = 1rem). "min-height" = Figma min height (auto layout hugs above it).
- **States** = the showcase frame next to the set, left → right, top → bottom. State *i* (from 0) = gallery state *i* =
  `rebrand/shared/stage.html?entry=<Name>&state=<i>`.
- Pressed / Disabled are listed as states so the gallery can show them; in the app Pressed is the 80–150 ms tap colour (`PS.TAP`).
- Icons are instances from the Figma page Icon (`7171:22576`), drawn in the colour given for the part; demo: `PS.Icon` with that token.
