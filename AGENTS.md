# Agent guide

Full guide: [CLAUDE.md](CLAUDE.md) (layout, adding a demo, components, tokens, publishing). Start with the index below.

## Which version is current

- **`main` = the rebrand v3** (navy #000128 ground, green #5CD680 action). This is the default for all work.
- **The blue version is archive only:** branch `legacy/blue`, tag `legacy-blue`. Don't build on it or copy from it.
  Its old CSS names and values: `tokens/legacy/2026.11.17.css`.
- **The current files are at the repo root** (`shared/`, `prototypes/`, `tokens/`). The copies under `rebrand/` were the
  rebrand's working copy (tokens v2, last changed 2026-11-24) and are **superseded**. Don't read components, pages or
  tokens from `rebrand/` (the one live part of `rebrand/` is the developer hand-off, see below).

## File index: what you need → where it is

| You need | Open | Notes |
|---|---|---|
| A UI component (card, button, sheet, home, loan, pay…) | `shared/ps-ui/<area>.js` + `shared/ps-ui/ps-ui.css` | Catalogue: `shared/README.md`. Gallery: `shared/gallery.html` |
| The whole app (every screen and state) | `prototypes/app/` | Guide: `prototypes/app/README.md` |
| A demo / flow | `prototypes/<slug>/index.html` | The list with descriptions: the `DEMOS` array in `index.html`, or the table in `README.md` |
| SMS landing page (导流落地页) | `prototypes/sms-landing/` | See the section below |
| Website landing page | `prototypes/landing-page/` | Not the SMS page |
| Design tokens (CSS variables) | `tokens/tokens.css` (JSON: `tokens/tokens.json`) | In rem: `tokens-rem/tokens-rem.css`. Version: `tokens/version.json` |
| What changed in the tokens | `tokens/CHANGELOG.md`, `tokens/MIGRATION-2026.11.21.md` (+ `.csv`) | Old → new CSS names |
| Old (blue) token names | `tokens/legacy/2026.11.17.css`, `tokens/legacy/2026.11.12.css` | Load after `tokens/tokens.css` |
| Developer hand-off for production (`phi_h5_025`) | `rebrand/handoff/ai/README.md` | Edit list, token mapping, motion (`07-motion/`), native screens (`08-native/`), `OPEN-QUESTIONS.md` |
| Animations (Lottie / GSAP) | `animations/<slug>/` | Registry: `animations/animations.js`. Player: `animations/player.html?a=<slug>` |
| Fonts | `assets/fonts/` (loaded by `fonts-2026.11.17.css`) | Rebrand: Hanken Grotesk for everything. Reddit Sans, Inter and Satoshi files remain for older pages |
| Libraries (React, Motion, GSAP, Lottie…) | `vendor/<lib>@<version>/` | Pinned; never a CDN |
| Copy and tone rules, component and motion rules | `.claude/skills/` | `perasure-tone-of-voice`, `perasure-components`, `perasure-card-morph`, `perasure-iteration-log` |
| Rebrand decisions and Figma node ids | `rebrand/log/`, `rebrand/figma/ledger.json`, `rebrand/BRIEF.md` | History and reasons, not code |
| Run the demos locally / on a phone | `tools/dev-server.py`, `tools/phone-server.command` | Other scripts in `tools/`: `stamp.py` (cache busting), tokens (`sync-tokens.py`, `legacy-tokens.py`, `rem-tokens.py`) |

Figma: rebrand file `kYyNV2MgxvH1w9bJ46A3yx` (pages *Design - Rebranding*, *Component - Rebranding*).

## Skip these when searching

- `devmode/` (≈1,900 files): generated data and saved snapshots for PeraSure Dev Mode. Read `devmode/README.md` only when the task is about Dev Mode.
- `rebrand/handoff/` except `rebrand/handoff/ai/`: generated hand-off output (`dist/`, `reviews/`, `updates/`) and **copies** of
  this repo's docs (`rebrand/handoff/README.md`, `rebrand/handoff/CLAUDE.md` are copies of the root files, not the guide).
- `rebrand/shared/`, `rebrand/prototypes/`, `rebrand/tokens/`, `rebrand/spec/`, `rebrand/index.html`: the superseded working copy.
- Superseded docs: `rebrand/DEV-HANDOFF.md` and `rebrand/tokens/MAPPING.md` (use `rebrand/handoff/ai/` instead).
- `vendor/`: third-party libraries.

Quick search that skips them: `git grep -n "<text>" -- . ':!devmode' ':!rebrand' ':!vendor'`

## Keep this index current (owner's rule, 2026-11-26)

On every change, before you commit, decide whether the index above needs an edit. It does when the change:
adds, moves, renames or removes a file or folder the index names (or one people will ask for by name: a new demo,
page, component, token file, tool); changes which version or copy is current or superseded; or makes a path or note
here wrong. Then update the index (and the Layout in CLAUDE.md) **in the same commit**. If none of that applies, leave
it alone: don't touch the index for edits inside files it already points to. Every path in the index must exist.

## SMS landing page (导流落地页 / 白名单卖点落地页)

Looking for the **SMS landing page** — also called the whitelist landing page, 白名单落地页, 白名单卖点落地页 or 导流落地页
(the page opened from the SMS sent to selected users, leading them to Google Play)? It is here:

- **Code:** [`prototypes/sms-landing/`](prototypes/sms-landing/) — `index.html` (page), `page.js` (copy and flow), `page.css` (layout).
  Plain HTML, no build step. Its components are in `shared/ps-ui/landing.js`, plus the app's AmountCard, TrustCard and Legal.
- **Numbers:** the loan calculator uses the app's own maths (`PS.loanQuote`, `prototypes/app/coupons-data.js`).
- **Google Play link:** `PLAY` in `page.js` (with an SMS referrer); `?play=<url>` overrides it for testing.
- **Design:** Figma `kYyNV2MgxvH1w9bJ46A3yx`, node 15228:62417 "白名单卖点落地页".
- **Not this:** `prototypes/landing-page/` is the website landing page, a different page.
