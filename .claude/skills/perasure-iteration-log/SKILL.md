---
name: perasure-iteration-log
description: Record a PeraSure iteration in PeraSure Dev Mode — every new requirement (with a Jira ticket or without) that changes an app page, a shared component or a motion gets an entry (UI / motion, pages, components, before → after), statuses, a runnable snapshot and a git tag. Use whenever such a change is made in the Playground repo.
---

# PeraSure iteration log

PeraSure Dev Mode (`devmode/` in the Playground repo, `samgestudio-dev/Perasure`) shows designers what changed in each iteration
and lets developers pull the code of exactly that version. It only knows what is recorded here, so **every change to an app page, a
shared component or a motion is recorded in the same piece of work** (owner's rule). Pure fixes to Dev Mode itself, docs or tooling
are not iterations. A change made without recording it (another session, a quick fix) shows up in Dev Mode under Iterations →
Unrecorded changes (the visual check runs on every push): record those too when the owner asks.

**One requirement = one iteration = one tag** (owner, 2026-11-17): everything done for one requirement — token update, global
components, every page they touch, motion re-tuned because of it — goes into ONE entry, ONE snapshot and ONE tag, never split.
A requirement that changes tokens or global components (bars, fonts, a shared atom used everywhere) is a **global iteration**: it also
gets an overview folder and a developer brief — read `references/global-iteration.md` when that is the case.

## Names and versions (owner)

- The version stays **v1** (the baseline is `v1.0`). Only a large redesign starts `v2.0` — never decide that yourself; ask.
- An iteration's label: `v1 · YYYY-MM-DD · PHL-123`; with no Jira ticket: `v1 · YYYY-MM-DD · 无 Jira 单号`.
- Its id (snapshot folder and git tag `devmode-<id>`, made by the workflow): `v1-YYYYMMDD-PHL-123`; without a ticket `v1-YYYYMMDD-n1` (n2, n3… for more that day).
- Date: today, from the clock tool.

## Steps

1. **Jira.** If the owner gives a ticket (or the branch / message names one), read it with the Atlassian connector (`getJiraIssue`;
   `getAccessibleAtlassianResources` once for the cloudId) and take its key, summary and URL. Don't invent a title. If Jira can't be
   reached, ask for the title, or record the key alone. No ticket → `jira: null`.
2. **Make the change** the usual way (components first: `perasure-components`). Keep a note of what changed: which pages (ids in
   `devmode/data/pages.js`), which components (`PS.<Name>` without `PS.`), UI or motion, added / edited / removed, and the values before →
   after (a colour, a spacing token, a spring, a duration) — read them from the code you changed, not from memory.
   Then **let the visual check find everything that changed**: `node tools/devmode-visual.mjs diff` (Playwright; ~5 min, or
   `--filter 'home|PaymentCard'` while working) renders every page state and component state from the latest iteration's snapshot and
   from the code now, and lists what differs and where it starts (components), with before | after | difference pictures in
   `devmode-visual-out/`. Record every real change it lists; anything you didn't mean to change is a bug to fix before recording.
3. **A new page or state** of the app goes into `devmode/data/pages.js` (its section, `q` / `page` / `tab` / `js`, both names). A new
   component needs its gallery entry (`shared/gallery.js` / `gallery-app.js`) — that is where Dev Mode gets its states.
4. **The entry**, at the top of `devmode/data/iterations.js` (format in the file's header comment):
   - `title` and `summary` in both languages `{ zh, en }`: Chinese for the owner, English following `perasure-tone-of-voice`.
     The summary says what the reader gets and why, in a few sentences; each change's `detail` gives before → after.
   - One `changes` item per distinct change; `type: 'ui' | 'motion'`; `figma: ['10842:29606']` when a node was given.
5. **Statuses** in `devmode/data/status.js`: every page and component the iteration touches → `{ status: 'changed', since: '<id>' }`.
   Set `'completed'` only when the owner says development is done (and `'ready'` again if they ask).
6. **Index and stamp:** `python3 tools/stamp.py` (it remakes `devmode/data/index.js` from the code).
7. **Snapshot:** `python3 tools/devmode-snapshot.py <id>` — a runnable copy of this version in `devmode/snapshots/<id>/`. It refuses an
   id that exists: a saved version is never changed. Make it after the code is final and before the commit.
8. **Commit and push** everything (the message names the iteration and the ticket). Don't tag: the *Dev Mode* workflow
   (`.github/workflows/devmode.yml`) tags `devmode-<id>` on the commit that last wrote the snapshot (sessions can't push tags). Dev Mode links
   an older version's code to that tag; check the tag exists a minute after the push (`git ls-remote --tags origin devmode-<id>`).
   When the owner asks for a fix inside the latest iteration (no new one), redo its snapshot (delete the folder, run the snapshot
   script again), its overview pictures and its brief in one commit; the workflow then moves the tag there. Only with the owner's go-ahead.
9. **Check in Dev Mode** (desktop viewport, https://samge.studio/devmode/?app=perasure — locally, a devmode-platform clone served next to this repo): the version menu lists the new label; Iterations shows the entry;
   the changed page / component's History tab lists it; Compare (previous → new) shows both frames and the changes with properties
   and code before → after; a few minutes after the push, Iterations → Unrecorded changes (the *Dev Mode visual check* workflow) is
   back to zero. No console errors. Give the owner the Dev Mode link with the iteration open
   (`https://samge.studio/devmode/?app=perasure#v=iterations&it=<id>`).

## Don'ts

- Don't edit an older iteration's entry except to fix a mistake the owner points out; never edit or delete a snapshot.
- Don't put PeraSure tokens or styles into Dev Mode's own interface (they are data there).
- Don't read `tokens/tokens.css` into context for this; the Tokens tab parses it in the browser.
