# PeraSure design tokens

The variables and styles of the [PeraSure design system](https://www.figma.com/design/OBsvf42AiRapcRrasD7KNm/PeraSure-design-system?node-id=3259-657)
Figma file, versioned for prototypes and developers. The Playground picker does not show or load them.

Current version: see [`version.json`](version.json) · history: [`CHANGELOG.md`](CHANGELOG.md) · git tags `tokens-v<version>`.

## How a change travels from Figma to code

```
Figma file ──export──▶ snapshot ──sync-tokens.py──▶ version + CHANGELOG entry + tokens.css / tokens.json ──▶ git tag tokens-v<version>
  (plugin, or Claude)   figma-export.json            (diff by Figma variable id: added / removed / renamed / value)
```

Every update goes through `tools/sync-tokens.py`, so each one gets:

- a **version** — the date, `2026.10.27` (a second update the same day is `2026.10.27.2`);
- a **changelog entry** — when it was exported and by whom, a summary, a *Developer impact* table (CSS names
  removed or renamed, with the replacement), and every changed variable and style with its before / after value;
- a **git tag** `tokens-v<version>` pointing at exactly those files.

Nothing in `tokens.css`, `tokens.json` or `digest.json` is edited by hand; CI fails if they don't match the snapshot.

## Updating the tokens

Pick one — all three produce the same result.

1. **Figma plugin → GitHub (no AI needed).** In Figma run *Plugins → Development → PeraSure Tokens Export*
   (install once: [tools/figma-tokens/README.md](../tools/figma-tokens/README.md)). It shows what changed since the
   repo's version. Download the export, upload it into [`tokens/inbox`](inbox/) on GitHub and commit. The *Tokens*
   workflow does the rest in about a minute.
2. **Figma plugin → Claude.** Attach the downloaded export in a chat and say “update tokens”.
3. **Claude only.** Say “sync tokens from Figma”. Claude sends Figma the repo's digest and gets back only the
   variables that changed, so a small edit costs a few thousand tokens instead of reading all 446 variables.

## Using them

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

Use semantic tokens (`--color-text-*`, `--color-surface-*`, `--spacing-gap-*`, `--radius-md` …); primitives
(`--color-blue-600`, `--spacing-16`) are the palette underneath.

**Outside this repo** (the app, another site):

| Want | URL |
| --- | --- |
| A fixed version (recommended for the app) | `https://cdn.jsdelivr.net/gh/samgestudio-dev/Perasure@tokens-v2026.10.27/tokens/tokens.css` |
| Always the latest | `https://samgestudio-dev.github.io/Perasure/tokens/tokens.css` |

Swap `tokens.css` for `tokens.json` to get the W3C format (for Style Dictionary, Tokens Studio, etc.). To upgrade,
read the *Developer impact* of each version in between in `CHANGELOG.md`, then change the tag.

## Files

| File | What it is |
| --- | --- |
| `tokens.css` | CSS custom properties for every token, `--shadow-*`, `--blur-*-effect` and `--gradient-*` for the effect and paint styles, and `.ps-text-*` classes for the text styles. Semantic and component tokens point at primitives with `var()`, as in Figma. |
| `tokens.json` | The same in the W3C Design Tokens format (`primitive` / `semantic` / `component` / `style`). Aliases stay aliases (`{primitive.Color.Blue.600}`); `$extensions.com.figma` has each token's Figma id, name, scopes and CSS name. |
| `CHANGELOG.md` | One entry per version, newest first. |
| `version.json` | Current version, export time, who exported it, counts. |
| `figma-export.json` | The snapshot from Figma (stable ids, values, aliases, scopes, code syntax, descriptions). The source of everything above. |
| `digest.json` | Hashes of the snapshot, so the plugin and Claude can tell what changed without downloading it. |
| `code-syntax-naming.md` | The naming spec the CSS names follow. |
| `inbox/` | Drop plugin exports here; the workflow applies and removes them. |

Scripts: `tools/sync-tokens.py` (apply an export, version, changelog, check), `tools/build-tokens.py` (generate the
outputs), `tools/tokenlib.py` (hashing and naming), `tools/figma-tokens/` (the Figma side: `core.js` + plugin).

## Names

Each CSS name comes from the token's own path, per `code-syntax-naming.md`: every level in order, lowercase
kebab-case, collection and mode left out, `Default` kept — `Color/Text/Brand/Default` → `--color-text-brand-default`.
The code syntax stored in Figma is checked against this and not used where it differs; the first changelog entry
lists the 8 that differ today (and later entries list them again whenever that list changes). Semantic
`Color/Neutral/*` have the same path as the primitives they point at, so they share one CSS variable.

## Notes on values

- Sizes, spacing, radius, blur, stroke width and line heights are px. Font weights are numbers.
- `Layer opacity` is 0–100 in Figma and 0–1 in the CSS and JSON.
- Font families get a fallback: `"Satoshi", "Inter", sans-serif` (Satoshi has no ₱; Inter supplies it, as in the app).
- Letter spacing in % becomes `em` (2% → `0.02em`).
- Only each collection's default mode is in the CSS (all collections have one mode today); the snapshot keeps other modes.
- `Blur/Top-nav-effect` and `Blur/Bottom-nav-effect` are progressive blurs in Figma; the CSS variable is the plain
  `blur()` radius — fade it with a mask on the backdrop layer. Glass-nav effects have both a backdrop blur
  (`--blur-glass-nav-effect`) and a shadow (`--blur-glass-nav-effect-shadow`).
- `--gradient-glass-nav-stroke`'s angle (161°) is worked out for a square layer; it shifts a little on wide shapes.
