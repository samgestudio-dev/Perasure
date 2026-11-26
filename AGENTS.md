# PeraSure Playground — agent guide

This is the entry for every AI agent (Claude Code loads it through `CLAUDE.md`). It holds only what every task needs.
Topic details live in `docs/agents/`: open the one the task needs (table "Topic guides" below), not all of them.

Phone-first motion prototypes for PeraSure. The repo is private: a Cloudflare Worker serves `main` at samge.studio behind a password,
read straight from GitHub (the Worker lives in the repo `samgestudio-dev/devmode-platform`, `worker/`, guide `worker/README.md`).

- Live picker: https://samge.studio/perasure/playground/ · Dev Mode: https://samge.studio/devmode/?app=perasure
- Each demo is opened and tested on a real phone (iOS Safari and Android Chrome).
- The owner is a designer; reply in plain language and keep the picker page tidy.

## Which version is current

- **`main` = the rebrand v3** (navy #000128 ground, green #5CD680 action). This is the default for all work.
- **The blue version is archive only:** branch `legacy/blue`, tag `legacy-blue`. Don't build on it or copy from it.
  Its old CSS names and values: `tokens/legacy/2026.11.17.css`.
- **The current files are at the repo root** (`shared/`, `prototypes/`, `tokens/`). The copies under `rebrand/` were the
  rebrand's working copy (tokens v2, last changed 2026-11-24) and are **superseded**. Don't read components, pages or
  tokens from `rebrand/` (the one live part of `rebrand/` is the developer hand-off, see below).

## Components first (owner's rule — this repo and every PeraSure project)

**A new component or feature is created in the component library first, then the page uses it directly.** Here the library is
`shared/ps-ui` and its gallery entries (`shared/gallery.js` / `gallery-app.js`, shown in PeraSure Dev Mode → Components): build the piece
there (every state a prop, tokens only, rem), add its states to the gallery entries in the same commit, then use it from the page. A change to a piece (a colour, a spacing, a new state) is made in the
component, never patched from a page — page CSS only places shared pieces, and never targets a component's classes. Skill:
`perasure-components`.

## PeraSure skills (use them on every PeraSure task)

`.claude/skills/` holds the PeraSure skills; Claude Code loads them from here, and they are also meant for any other
PeraSure-related project (fetch from `https://raw.githubusercontent.com/samgestudio-dev/Perasure/main/.claude/skills/…`).

- **`perasure-tone-of-voice`** — the owner's tone of voice. All PeraSure copy (screens in prototypes included: titles,
  buttons, placeholders, errors, notes) follows it, in this repo and in any PeraSure-related project.
- **`perasure-components`** — components first: a new piece of UI or feature is made in the component library (with its states
  and a gallery entry) before any page uses it, and changes are made in the component. Every PeraSure project, every screen.
- **`perasure-iteration-log`** — recording an iteration in PeraSure Dev Mode: every new requirement (a Jira ticket or not) that changes a
  page, a component or a motion gets an entry in `devmode/data/iterations.js` (UI / motion, pages, components, before → after), its
  statuses, a runnable snapshot and a git tag. Use it whenever such a change is committed.
- **`perasure-card-morph`** — the card morph motion of the withdraw fund flow and Change co-maker (a card or page turning
  into another state). Any new morph starts from its `example.html` + `engine.js` and keeps its rules, so the motion is
  the same everywhere. When a morph in a prototype is changed for the owner, update the skill too if the rule changed.

How skills are organised (owner's rule): a different kind of task gets its own skill; branches of the same task share one
short `SKILL.md` (when to use it, what every branch needs, which reference to read when) plus reference files read only
when that branch comes up. Don't cut files small to save tokens — the aim is that a task reads as little unrelated
content as possible.

## Topic guides: read the one your task needs

| Before you… | Read |
|---|---|
| add, rename or remove a demo, or build / change any demo page (phone rules, header and bottom bars, motion, shared environment) | [docs/agents/demo-pages.md](docs/agents/demo-pages.md) |
| build or change a UI component, its states or gallery entry | [docs/agents/components.md](docs/agents/components.md) |
| work on an app screen or flow, the numbers, the Withdraw demo or its Credit limit intro | [docs/agents/app.md](docs/agents/app.md) |
| touch PeraSure Dev Mode (iterations, snapshots, `pages.js`, visual check, MCP) | [docs/agents/devmode.md](docs/agents/devmode.md) |
| sync or update tokens | [docs/agents/tokens.md](docs/agents/tokens.md) |
| add or fix a Lottie / GSAP animation | [docs/agents/animations.md](docs/agents/animations.md) |
| need what a folder or file is for, or add / move / remove one | [docs/agents/layout.md](docs/agents/layout.md) |
| work on the SMS landing page (导流落地页) | [docs/agents/sms-landing.md](docs/agents/sms-landing.md) |

A task that spans two topics reads both (e.g. a new app screen: `components.md` + `app.md` + `demo-pages.md`).

**Where the old `CLAUDE.md` sections went** (code comments and READMEs still cite them as `CLAUDE.md → "…"`):
"Layout" → `layout.md` · "Adding a demo", "Requirements for a demo page", "Header and bottom bars" → `demo-pages.md` ·
"Adding a Lottie animation" → `animations.md` · "Shared components" → `components.md` · "The full app", "Number font",
"Withdraw: the two credit states" → `app.md` · "PeraSure Dev Mode" → `devmode.md` · "Updating tokens" → `tokens.md`
(all in `docs/agents/`). "Components first", "PeraSure skills", "Checking before you push", "Caching" and "Publishing"
stay in this file.

## File index: what you need → where it is

| You need | Open | Notes |
|---|---|---|
| A UI component (card, button, sheet, home, loan, pay…) | `shared/ps-ui/<area>.js` + `shared/ps-ui/ps-ui.css` | Catalogue: `shared/README.md`. States: `shared/gallery.js` / `gallery-app.js` (shown in Dev Mode → Components) |
| The whole app (every screen and state) | `prototypes/app/` | Guide: `prototypes/app/README.md` |
| A demo / flow | `prototypes/<slug>/index.html` | The list with descriptions: the `DEMOS` array in `index.html`, or the table in `README.md` |
| SMS landing page (导流落地页 / 白名单落地页 / whitelist) | `prototypes/sms-landing/` | Guide: [docs/agents/sms-landing.md](docs/agents/sms-landing.md) |
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

## Checking before you push

- **Index:** decide whether the file index or a topic guide needs an edit (see "Keep this index current" below); if it does,
  update it in this commit. Then run `python3 tools/check-agent-docs.py` (every link in the agent docs must exist).
- Open the picker and every new link at a phone viewport (e.g. 390×664, touch, DPR 3) and confirm the demo
  loads with no console errors.
- Tap through the main flow once.

## Caching (phones keep old copies otherwise)

The site asks browsers to check every file for a newer version, but phones still hold on to some. Before committing a change to the Playground pages,
`animations/` or `assets/`, run `python3 tools/stamp.py`: it stamps the shared scripts (`?v=<stamp>`), and the
index adds that stamp to every link and thumbnail, so phones load the new version right away. It also remakes Dev Mode's index
(`devmode/data/index.js`). The player
fetches animation JSON with `cache: 'no-cache'` and loads GSAP modules with a per-load token.

## Publishing

- Commit to `main` and push; samge.studio shows it within about 20 seconds (the Worker reads `main` from GitHub; nothing to deploy).
  The Worker and the Dev Mode platform live in `devmode-platform`; only a change there needs a Worker deploy.
- The account, password and tokens are Cloudflare secrets: never write them into the repo.
- Give the owner the direct demo link (https://samge.studio/perasure/playground/prototypes/…) as well as the picker link.

## Keep this index current (owner's rule, 2026-11-26)

On every change, before you commit, decide whether this file or a topic guide in `docs/agents/` needs an edit. It does
when the change: adds, moves, renames or removes a file or folder the index names (or one people will ask for by name: a
new demo, page, component, token file, tool); changes which version or copy is current or superseded; adds or changes a
rule an agent must follow; or makes a path or note wrong. Then update the index, `docs/agents/layout.md` and the topic
guide concerned **in the same commit**. If none of that applies, leave them alone: don't touch the index for edits inside
files it already points to.

Where a rule goes: in this file only if **every** task needs it; otherwise in the topic guide for its kind of task (a new
kind of task gets a new guide plus a row in "Topic guides"). Don't cut guides small to save tokens: the aim is that a task
reads as little unrelated text as possible. Every link must exist: `python3 tools/check-agent-docs.py`.
