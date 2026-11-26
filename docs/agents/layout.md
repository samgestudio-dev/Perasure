# Repo layout

> Part of the PeraSure agent guide — entry: [AGENTS.md](../../AGENTS.md). **Read this when** you need to know what a folder or file is for, or you add / move / remove one (then update this file).

## Layout

```
index.html                 picker ("Playground"): "Prototypes" tab (DEMOS array) + "Animations" tab (reads animations/animations.js)
assets/playground-ui.js    shared Material UI theme + icons for the picker and the player (window.PG)
assets/fonts/              the app's fonts (Hanken Grotesk: the rebrand uses it for everything; Inter, Reddit Sans and Satoshi kept for old versions) + fonts-2026.11.17.css —
                           shared by all prototypes (fonts.css is the frozen version before 2026.11.17: old Dev Mode snapshots link it)
prototypes/_template/index.html  starting point for a new prototype (links the shared fonts and libraries); not on the picker
shared/ps-ui/              PeraSure UI components (React, configurable): ps-ui.css (tokens only), core.js, layout.js, home.js,
                           coupon.js, loan.js, account.js, phone-fit.js, tune.js/.css, assets/ — see docs/agents/components.md
                           + feedback.js (loaders, status, result), form.js (fields, OTP, keypad), status.js (home states), pay.js (repayments),
                           list.js (links, facts, activity, inbox, history, hub), fx.js (Order submit, OTP sheet, Credit limit intro),
                           apply.js (page head, cameras, selfie, ID sides and result, documents, search sheets, address picker, estimate, help articles),
                           withdraw-host.js (runs the Withdraw demo's loan screen from the demo's own code)
shared/gallery.js, gallery-app.js  every shared component's states (one entry each: name, desc, props, states) — shown in Dev Mode
shared/stage.html          draws one state of one entry (?entry=&state=): Dev Mode's canvas for a component
shared/gallery.html        only forwards old links to Dev Mode → Components
devmode/                   what PeraSure Dev Mode reads (the platform is the repo devmode-platform, at samge.studio/devmode/?app=perasure):
                           app.js (adapter), data/, snapshots/, iterations/, inspector.js — see docs/agents/devmode.md and devmode/README.md;
tools/devmode-index.py     makes devmode/data/index.js from the code (stamp.py runs it); devmode-snapshot.py saves a version's runnable copy
shared/README.md           how to use the components, files, rules for changing them
prototypes/app/            the whole app as a test environment ("PeraSure app") — see docs/agents/app.md
prototypes/<slug>/index.html    main / recommended variant of a demo
prototypes/<slug>/<variant>.html  other variants of the same demo (optional)
animations/animations.js       Lottie registry (LOTTIES array) — shared by the picker and the player
animations/player.html         player, one animation at a time: player.html?a=<slug>[&r=gsap] (Lottie / GSAP tabs)
animations/<slug>/             <slug>.json (+ <slug>.lottie, preview.png, gsap/<module>.js)
tools/                     flatten-lottie-masks.py, flatten-svg-masks.py (Safari mask-blur fixes), unscale-gsap-svg.py (Safari scale glitch)
tokens/                    versioned design tokens from the Figma design system (tokens.css, tokens.json, CHANGELOG.md, snapshot)
                           — not shown on the picker; updated only through tools/sync-tokens.py (see docs/agents/tokens.md)
tokens-rem/                the same length tokens in rem (tokens-rem.css), MADE by tools/rem-tokens.py from tokens/tokens.css
                           (stamp.py runs it) — never edit it or the token files by hand; used by the app and shared/ps-ui
tools/figma-tokens/        Figma side of the token pipeline: core.js (export + digest) and the export plugin
.github/workflows/tokens.yml  applies exports dropped in tokens/inbox/, tags tokens-v<version>, checks generated files
.github/workflows/devmode.yml tags each Dev Mode snapshot's commit devmode-<id>
.github/workflows/devmode-visual.yml  the Dev Mode visual check on every push (tools/devmode-visual.mjs) → branch devmode-visual
.github/workflows/devmode-live.yml    Dev Mode data as JSON → branch devmode-mcp (for the hosted MCP in devmode-platform)
vendor/<lib>@<version>/    pinned libraries: lottie-web, gsap (+ plugins; esm/ = ES modules), react, react-dom, mui-material,
                           motion (motion-react.js = React API, motion.js = vanilla; both set window.Motion), matter-js,
                           react-wheel-picker (the package's dist/index.js unchanged in a small wrapper → window.WheelPicker; + style.css)
README.md                  human-facing summary + demo / animation tables
.claude/skills/            PeraSure skills: perasure-components (components first), perasure-tone-of-voice (all copy), perasure-card-morph (morph motion: short SKILL.md,
                           references/ read per branch, engine.js, example.html) — see "PeraSure skills" in AGENTS.md
.nojekyll                  keep: Pages serves files as-is
```

`<slug>` is lowercase-kebab-case, e.g. `withdraw-fund-flow`, `repayment-success`.
Not in the block above:

```
docs/agents/               the topic guides for AI agents (listed in AGENTS.md); tools/check-agent-docs.py checks their links
shared/ps-ui/landing.js    the SMS landing page's components (LandingHero, LoanCalculator…) — page: prototypes/sms-landing/
tokens/legacy/             old token names and values: 2026.11.17.css = the blue version before the rebrand, 2026.11.12.css = older
rebrand/handoff/ai/        the developers' rebrand hand-off for phi_h5_025 (live); rebrand/handoff/updates/ = later updates on top of it
rebrand/                   everything else here is the rebrand's superseded working copy and history (see AGENTS.md "Skip these")
```
