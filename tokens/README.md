# PeraSure design tokens

The variables and styles of the [PeraSure design system](https://www.figma.com/design/OBsvf42AiRapcRrasD7KNm/PeraSure-design-system?node-id=3259-657)
Figma file, kept here for prototypes and hand-off to reference. The Playground picker does not show or load them.

Exported 2026-10-27: 446 variables in three collections (Primitive 157 → Semantic 271 → Component 18, one mode each),
25 text styles, 8 effect styles, 3 paint styles.

| File | What it is |
| --- | --- |
| `tokens.css` | CSS custom properties for every token, plus `--shadow-*`, `--blur-*-effect` and `--gradient-*` for the effect and paint styles, and `.ps-text-*` classes for the text styles. Semantic and component tokens point at primitives with `var()`, as in Figma. |
| `tokens.json` | The same tokens in the W3C Design Tokens format (`primitive` / `semantic` / `component` / `style`). Aliases stay aliases (`{primitive.Color.Blue.600}`); each token's `$extensions.com.figma` has its Figma name, scopes and CSS variable. |
| `figma-export.json` | Raw snapshot from Figma (0–1 RGBA colours, aliases by name, scopes, code syntax, descriptions). The two files above are generated from it. |
| `code-syntax-naming.md` | The naming spec the CSS variable names follow. |

## Using them in a prototype

```html
<link rel="stylesheet" href="../../assets/fonts/fonts.css">  <!-- the fonts themselves -->
<link rel="stylesheet" href="../../tokens/tokens.css">
```

```css
.card   { background: var(--color-surface-card-default); border-radius: var(--radius-lg); box-shadow: var(--shadow-default); }
.amount { font-family: var(--font-family-number); color: var(--color-text-primary); }
```

```html
<h1 class="ps-text-title-lg">Withdraw</h1>
```

Use semantic tokens (`--color-text-*`, `--color-surface-*`, `--spacing-gap-*`, `--radius-md` …) in prototypes;
primitives (`--color-blue-600`, `--spacing-16`) are the palette underneath.

## Names

Each CSS variable is named from its own token path, per `code-syntax-naming.md`: every level in order,
lowercase kebab-case, collection and mode left out, `Default` kept — `Color/Text/Brand/Default` →
`--color-text-brand-default`. The code syntax stored in Figma is not used where it differs. At this export
8 variables differ in Figma (the build script lists them):

| Variable | Code syntax in Figma | Name used here |
| --- | --- | --- |
| Primitive `Stroke/Width/10` | `--stroke-width-1` | `--stroke-width-10` |
| Primitive `Font/Family/Hanken Grotesk` | `--font-family-hanken-rotesk` | `--font-family-hanken-grotesk` |
| Primitive `Font/Family/Satoshi` | (none) | `--font-family-satoshi` |
| Semantic `Color/Action/Bg/Positive/Pressed` | `--color-action-bg-positive-disabled` | `--color-action-bg-positive-pressed` |
| Semantic `Color/Action/Text/Link` | `--color-action-text-positive` | `--color-action-text-link` |
| Semantic `Font/Family/Number` | (none) | `--font-family-number` |
| Semantic `Font/Weight/SemiBold` | `--font-weight-semibold` | `--font-weight-semi-bold` |
| Component `Tag/Color/Neutral/Bg/Alpha` | `--tag-color-neutral-bg-inverse` | `--tag-color-neutral-bg-alpha` |

Semantic `Color/Neutral/*` have the same path as the primitives they point at, so they share one CSS variable.

## Notes on values

- Sizes, spacing, radius, blur, stroke width and line heights are px. Font weights are numbers.
- `Layer opacity` is 0–100 in Figma and 0–1 in the CSS and JSON.
- Font families get a fallback: `"Satoshi", "Inter", sans-serif` (Satoshi has no ₱; Inter supplies it, as in the app).
- Letter spacing in % becomes `em` (2% → `0.02em`).
- `Blur/Top-nav-effect` and `Blur/Bottom-nav-effect` are progressive blurs in Figma; the CSS variable is the plain
  `blur()` radius — fade it with a mask on the backdrop layer. Glass-nav effects have both a backdrop blur
  (`--blur-glass-nav-effect`) and a shadow (`--blur-glass-nav-effect-shadow`).
- `--gradient-glass-nav-stroke`'s angle (161°) is worked out for a square layer; it shifts a little on wide shapes.

## Updating

1. Re-export the Figma file's local variables and styles into `figma-export.json` (same shape).
2. `python3 tools/build-tokens.py` — rewrites `tokens.json` and `tokens.css` and lists names that differ in Figma.
