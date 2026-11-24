# Type gaps: audit and proposal (figma-lib, 2026-11-20)

Scope: every visible text on the Rebranding pages (all non-bin sections, 119 frames) and the Component - Rebranding library.
Nothing was changed for this audit; the styles are as approved in `TYPE-AND-STYLES.md` (19 styles).

## 1. What was measured

| Check | Result |
|---|---|
| Text segments scanned | **4 827** |
| On a v2 style, no override | 4 420 (91.6 %) |
| Style overrides (size, weight, line height or tracking differs from the bound style) | **0** |
| Bound to a `Legacy/*` style | **0** |
| No text style at all | **407**: 228 system art, 179 real (§2) |
| Texts matched to their legacy source by content (screens) | 502 |
| Same size and weight as legacy, or within the approved merges / v2 changes | 356 |
| Different from legacy beyond the approved merges | **146**, in 23 clusters (§3) |

"Approved" = the merges and visible changes listed in `TYPE-AND-STYLES.md` (Section-title/xs 600 → 500, Number/xl 36 → 32, Number/sm
18 → 16, Section-title/md-light line 22 → 24), plus the v2 weights the lean set adopts (Display / Headline / Amount 800, Label 600).

## 2. Texts without a style (407)

| Cluster | Uses | Examples | Verdict |
|---|---|---|---|
| 14/20 400 | 116 | status bar clock "9:30" (every screen) | System art (remote Status bar), not ours. Exclude. |
| 18.35/21 400 + 18.35/auto + 12.23/17 500 | 112 | system keyboard keys "q" "w" "?123" (Register / OTP, Loan detail, Delete my account) | System art (Keyboard). Exclude. |
| 12/16 500 | 135 | `.MethodTabs` labels "QR Code", "Bill Payment", "Online Transfer" (11133:6140, 6144, 6150) | = **Caption/sm**. Binding missing, no gap. |
| 24/32 700 | 13 | ScamTips masked digits "*" (11133:5646…) | = **Title/lg**. Binding missing. |
| 20/28 700 · 16/24 500 · 24/32 800 | 6 · 6 · 4 | date wheel "1996", "1995", "1997" (11186:20993, 20994, 20992); PaymentCard "₱5,000.35" (11133:4583) | = Title/md · Body/lg-strong · Amount/md. Binding missing (the wheel weights are wrong, see §3 C). |
| 36/44 800 | 1 | Loan detail "999" (11134:17781) | = Display/md. Binding missing. |
| 12/auto 400 | 2 | BottomBar consent "By typing confirm…" (11133:5410) | **Gap A** (12 / 400). |
| 12 / 14 / auto 500–600 | 14 | sheet labels on the "Filled icons" / "v2 icon additions" doc boards | Documentation, not product. Exclude. |

## 3. Texts that differ from their legacy source (146)

### A. Legacy 12 / 400 → Caption/sm 12 / 500: **76 uses** (real gap)
Secondary sentences and hints that legacy set regular: "Get full coverage up to …" (11134:17151, 11134:16915), "Didn't receive the code?"
(11134:10146), "Choose a loan term to co…" (11134:16393), "Customer service hours: …" (11159:13671), "Support documents (optional)"
(11186:22686, 11186:23274), + the unstyled consent line in §2. Legacy style: `Legacy/Caption/sm` (12/16 400). The lean set merged it into
Caption/sm 500, which reads heavier and is what the owner sees as "can't cover every need".

### B. Legacy 11 / 400 → Caption/xs 11 / 500: **33 uses** (real gap)
Legal and consent micro-copy: "By typing confirm indicates…" (11232:23928, 11232:23690), "Tap Agree to allow permission data…" (11134:9782).
Legacy style: `Legacy/Caption/xs` (11/14 400).

### C. Mapping errors (no new style needed): **15 uses**
- Legacy `Section-title/md-light` 16 / 500 → **Title/xs 16 / 600** (9): date picker "Select Date" (11186:22035), month / year labels "December"
  (11186:22047), "2026" (11186:22055). By the approved merge this is **Body/lg-strong** (16/24 500). Fix: rebind (owner-neutral).
- Date wheel numbers set heavier and unstyled (6): legacy 20 / 500 → 20 / 700 ("1996", 11186:20993), 24 / 500 → 24 / 800 or 700 ("1997",
  11186:20992; "December", 11186:21519). Legacy weight 500 has no 20 / 24 px style. Proposal: bind the side numbers to Title/md and the selected
  number to Title/lg (accept 500 → 700 as part of the "Title" role), or keep them in §4's optional list. No addition recommended for 6 uses.

### D. Within the approved v2 weights (not gaps): 22 uses
Headline/sm 700 → 800 (avatar initials "XG", 11160:12490; 3), Display/md and Amount/xxl · lg · xs 700 → 800 (loan amount "₱", "12,5", ".00";
11 uses), Label/sm 12 / 700 → 600 (slider ends "₱500", "₱50,000"; 2), Label/md 14 / 700 → 600 ("Failed"; 1), legacy 10 px → Caption/xs 11
("15k+"; the 11 px minimum), 13.6 → 14 (Label/md, "SEC Registration"). These follow `TYPE-AND-STYLES.md`.

## 4. Proposal: the smallest set of additions

| Add | Size / line | Weight | Tracking | Uses now | Restores | Rule |
|---|---|---|---|---|---|---|
| **`Body/sm`** | 12 / 16 | 400 | 0 | **79** (76 from §3 A + 2 BottomBar consent + 1 straggler) | `Legacy/Caption/sm` 12/16 400 | Secondary sentences, hints and helper lines that are prose. `Caption/sm` (500) stays for meta labels: tabs, timestamps, statuses, chips. |
| **`Body/xs`** | 11 / 14 | 400 | 0 | **33** (§3 B) | `Legacy/Caption/xs` 11/14 400 | Legal and consent micro-copy only (the 11 px meta exception in `TYPE-AND-STYLES.md`). `Caption/xs` (500) stays for dates and meta. |

- Naming follows TYPE-AND-STYLES (role / size; only Body has a `-strong` twin). Both are the Body role at smaller sizes, so no new weight
  twin appears. The rule "paragraphs never below Body/md" becomes "**long paragraphs** never below Body/md; one- or two-line hints may use
  Body/sm".
- Result: 21 styles instead of 19, covering every real cluster above. Demo: `.ps-t-body-sm`, `.ps-t-body-xs`; Web vars follow the existing
  pattern.
- **Minimal alternative (1 addition):** add only `Body/sm`; keep legal copy on Caption/xs 500 (33 uses stay one weight heavier than legacy).
- **Not proposed:** a 20 / 24 px weight-500 style for the date wheel (6 uses; see §3 C), a "-regular" twin under Caption (breaks the one style
  per role × size rule).

## 5. Fixes that need no decision (to do after the owner answers, together)

- Bind the 179 real unstyled texts to their exact existing styles (§2: `.MethodTabs` → Caption/sm, ScamTips "*" → Title/lg, PaymentCard
  amount → Amount/md, "999" → Display/md, date wheel → per §3 C).
- Rebind the 9 `Section-title/md-light` texts from Title/xs to Body/lg-strong (§3 C).
- If `Body/sm` / `Body/xs` are approved: re-point the 79 + 33 texts (ids in §3 A / B are samples; the figma-lib checker lists all by query).
- UploadTile / .FileRow file name: stays **Label/sm** (12/16 600, set on 2026-11-20 as interim); it is a label of an object, not prose,
  so it does not move to Body/sm.

## 6. Applied (2026-11-20, BRIEF 33)
Body/sm and Body/xs created in Figma and applied: 76 + 33 re-pointed, 9 Section-title/md-light rebound to Body/lg-strong, all real
unstyled texts bound (see `rebrand/log/figma.md` entry 20). Audit after: 0 overrides, 0 real unstyled.
