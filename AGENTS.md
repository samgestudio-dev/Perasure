# Agent guide

See [CLAUDE.md](CLAUDE.md) — how this repo is laid out, how to add a demo to the picker (`index.html` → `DEMOS`), the requirements for a demo page, and how to publish.

PeraSure skills live in `.claude/skills/` (tone of voice for all copy; card morph motion) — see "PeraSure skills" in CLAUDE.md.

## SMS landing page (导流落地页 / 白名单卖点落地页)

Looking for the **SMS landing page** — also called the whitelist landing page, 白名单落地页, 白名单卖点落地页 or 导流落地页
(the page opened from the SMS sent to selected users, leading them to Google Play)? It is here:

- **Code:** [`prototypes/sms-landing/`](prototypes/sms-landing/) — `index.html` (page), `page.js` (copy and flow), `page.css` (layout).
  Plain HTML, no build step. Its components are in `shared/ps-ui/landing.js`, plus the app's AmountCard, TrustCard and Legal.
- **Numbers:** the loan calculator uses the app's own maths (`PS.loanQuote`, `prototypes/app/coupons-data.js`).
- **Google Play link:** `PLAY` in `page.js` (with an SMS referrer); `?play=<url>` overrides it for testing.
- **Branch:** added on `tokens/rebrand-v3`; it is not on `main` until that branch is merged.
- **Design:** Figma `kYyNV2MgxvH1w9bJ46A3yx`, node 15228:62417 "白名单卖点落地页".
- **Not this:** `prototypes/landing-page/` is the website landing page, a different page.
