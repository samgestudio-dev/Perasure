# Changelog

Developer-facing changes to the PeraSure app (`prototypes/app` and `shared/ps-ui`), newest first. One line per change, naming the pages
(Dev Mode ids) and components (`PS.*`) affected. **Breaking** = a page, component, prop or rule that existed before was removed or changed
in a way that breaks a build that followed the earlier version.

This file is the short, dated list. The full record of each requirement (before → after, every page and component state, the visual
diff, a runnable snapshot) is its **iteration** in Dev Mode (https://samge.studio/devmode/?app=perasure → Iterations, data in
`devmode/data/iterations.js`). Token changes are in [tokens/CHANGELOG.md](../../tokens/CHANGELOG.md).

How to add an entry: one line under today's date, `area: what changed (pages · components)`, then the iteration id and commit id; mark
**Breaking** when it applies. When a page or component that was `ready` or `completed` changes, set it to `changed` in
`devmode/data/status.js` (the `perasure-iteration-log` skill does this for iterations).

---

## Coming next (in Figma, not in the app yet)

- TODO: list Figma changes that are decided but not built yet.

## 2026-11-19

- Docs: developer handoff framework added — [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), [API.md](API.md) (skeleton), this
  changelog, [docs/decisions/](docs/decisions/README.md), [docs/qa/](docs/qa/acceptance.md), [reviews/](reviews/README.md). Not committed yet.
- Product: the app is Android only, no iOS version ([decision 0015](docs/decisions/0015-android-only.md)); QA device matrix now Android only,
  touch targets ≥ 48 dp.

## 2026-11-17

- Global components: numbers in **Reddit Sans**, only for emphasised amounts in the Number styles; header / bottom / tab bars without
  progressive blur, a token gradient by page level. Tokens 2026.11.12 → 2026.11.17, old names kept in `tokens/legacy/`. **Breaking** for
  builds using the blur or the old bar gradients (`PS.TopBar`, `PS.BottomBar`, `PS.Navigator`, `PS.Bands`, `PS.Amount`, `PS.Peso`; most pages).
  (v1-20261117-n1, d167a41)
- Home: "More for you" amount → Number/lg 32 / 40 (owner). (v1-20261117-n1, b035cd3)

## 2026-11-16

- Order page coupons: a long line stays on one line and ends in … (`PS.CouponRow`; `plan`). (v1-20261116-n4, b1910f7)
- Keep your coupon?: more than one coupon in one card, swiped; answered together, the loan changes once (`PS.Decision` pages / index /
  onIndex, `PS.Carousel`; `keep`). (v1-20261116-n3, c096215)
- Keep your coupon?: the coupon picture is an animation (`PS.CouponArt` animate). (v1-20261116-n2, 0514c50)
- Card: the white ring and the shadow together (`PS.Card` raised). (v1-20261116-n1, 6b25c71)

## 2026-11-13

- Home credit card: no gap under it at larger text sizes. (v1-20261113-n1)
- **v1.0 baseline** recorded in Dev Mode.
