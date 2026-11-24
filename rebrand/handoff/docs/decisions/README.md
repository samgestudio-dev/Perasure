# Decision records

Short records of the owner's product and design rules: why each rule exists, who decided it and when, and what it means for the build.
Each file: **status · owner · date · source · context · decision · consequences**. Product owner and designer: Sam.

The rules themselves live in [PRODUCT.md](../../PRODUCT.md) (product) and [DESIGN.md](../../DESIGN.md) (visual system); these records explain
them. If a record and PRODUCT.md / DESIGN.md disagree, ask the owner; don't pick one.

| # | Decision | Date | Status |
|---|---|---|---|
| [0001](0001-components-first.md) | Components first | — | accepted |
| [0002](0002-one-set-of-numbers.md) | One set of numbers | — | accepted |
| [0003](0003-temporary-credit-used-first.md) | Temporary credit is used first | — | accepted |
| [0004](0004-limit-coupon-raises-one-loan.md) | A limit-increase coupon raises one loan, on the order page only | — | accepted |
| [0005](0005-ordering-starts-at-amount-entry.md) | Every way into ordering starts at the amount entry | — | accepted |
| [0006](0006-existing-animations-kept.md) | Existing animations are never re-imagined | — | accepted |
| [0007](0007-loading-covers-the-screen.md) | Loading is the whole screen | — | accepted |
| [0008](0008-bars-without-progressive-blur.md) | Bars have no progressive blur; their veil follows the page level | 2026-11-17 | accepted |
| [0009](0009-reddit-sans-for-amounts.md) | Reddit Sans only for emphasised amounts | 2026-11-17 | accepted |
| [0010](0010-rem-and-text-size.md) | Sizes in rem; text size follows the phone | — | accepted |
| [0011](0011-page-changes-crossfade.md) | Page changes crossfade | — | accepted |
| [0012](0012-application-lists-are-popovers.md) | Lists in the application are popovers | — | accepted |
| [0013](0013-one-requirement-one-iteration.md) | One requirement, one iteration, one tag | 2026-11-17 | accepted |
| [0014](0014-old-token-names-stay-usable.md) | Old token names stay usable | 2026-11-17 | accepted |
| [0015](0015-android-only.md) | The app is Android only (no iOS version) | 2026-11-19 | accepted |

Dates marked "—": the rule is written in CLAUDE.md without a date. TODO (owner): add the dates if they matter, and the reasons marked TODO
in the records.

## Adding a record

1. Copy the layout of an existing file; take the next number: `NNNN-short-title.md`.
2. Fill in status (proposed · accepted · superseded by NNNN), owner, date, source (where the rule is written), context, decision, consequences.
3. Add a row to the table above, and a CHANGELOG line if the decision changes the build.
4. Never edit an accepted decision's meaning: write a new record that supersedes it and mark the old one "superseded by NNNN".
