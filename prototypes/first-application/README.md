# First application

A new customer's first visit, from log in to a ready credit limit. Figma: *Perasure handoff* (`nG5SHtAxW2TD782mHr3eeX`),
section `13485:21324`.

**Nothing here is re-made.** The screens, sheets, motion and copy are the PeraSure app's own ([`prototypes/app`](../app/README.md)),
loaded from that folder as they are, so a change in the app shows here too. [`flow.js`](flow.js) only sets the path through them.

## The path

1. **Log in** — the phone number, then the app's "Sending security code…" while the code goes out. Back leads to the home a
   logged-out visitor sees; its "Check your limit" comes back to log in.
2. **Verification code** — typed in for you (Tune → Verification code for a wrong code or a failed SMS first).
3. **Home before there's a limit** (Figma "Onboarding") — "Check your limit". This Figma flow has no permissions page, so the code goes
   straight here.
4. **Your loan estimate** → **Basic information** → **Verify your identity** (ID type, both sides by camera or album; the phone's real
   back camera) → **Check the details** (date, city and list pickers) → **Take a selfie** (front camera; uploading, failed) →
   **Add a trusted contact** → **Submit**.
5. **In review** — home with "Application in progress", then about 5 s later **the credit limit is ready**: home crossfades to the credit
   card and a toast says so (Tune → After Submit "Stays in review" ends at the review card).

## Tune

Application forms (empty as in Figma, or filled in with sample details) · After Submit · Verification code · ID check · Selfie check ·
Temporary credit on the new limit (off by default: a new limit has none) · Network · Progressive blur · Screen fit · Text size.
A change starts the flow again from log in. Fixed for this flow: logged out at the start, no loan, the app's six sample coupons.
