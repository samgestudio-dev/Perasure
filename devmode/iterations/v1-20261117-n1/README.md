# v1 · 2026-11-17 · 无 Jira 单号 — Global components: number font and bars

Iteration `v1-20261117-n1` · snapshot `devmode/snapshots/v1-20261117-n1/` · git tag `devmode-v1-20261117-n1` · tokens `v2026.11.17`
(tag `tokens-v2026.11.17`) · the version before: `v1-20261116-n4` (tokens `v2026.11.12`).
Figma: PeraSure handoff, page "17 nov 2026 - ui token 更新" (file `nG5SHtAxW2TD782mHr3eeX`, node `13732:11276`), Sections 1–8.
Design system: file `OBsvf42AiRapcRrasD7KNm`.

This is the brief for developers and their AI. Everything in this iteration belongs to one requirement and is recorded once: the
token update, the global components (fonts, header / bottom / tab bars) and every page they reach. Dev Mode → Iterations → this
iteration shows every changed page state and component state as before | after | difference.

## 1. What changed, in one paragraph

The number font is now **Reddit Sans** (token `Font/Family/Number`; before Satoshi, with ₱ borrowed from Inter) and it is used
**only for emphasised amounts**, always in one of six new **Number text styles**. The header, bottom and tab bars lose their
**progressive blur** and each becomes one token gradient chosen by the kind of page; the header gradient changed colour (grey →
the page's Ambient green-grey) and the secondary pages' bottom moved from a hand-written #EBF0EF to a token. Old CSS names and values
are kept in a legacy file.

## 2. The rules (owner) — implement these, not only the values

### Number font
1. `Font/Family/Number` = Reddit Sans (variable 200–900). It has its own **₱**: never fall back to Inter for it.
2. Only **emphasised amounts** use it, and always through a Number style:

   | Style | Size / line height | Letter spacing | Weight | CSS |
   |---|---|---|---|---|
   | Number/xs | 16 / 20 | +2 % (0.02em) | Bold 700 | `.ps-text-number-xs` (tokens) · `.ps-t-number-xs` (ps-ui, rem) |
   | Number/sm | 18 / 24 | +3 % | Bold | `-sm` |
   | Number/md | 24 / 32 | 0 | Bold | `-md` |
   | Number/lg | 32 / 40 | +2 % | Bold | `-lg` |
   | Number/xl | 36 / 100 % | +4 % | Bold | `-xl` |
   | Number/xxl | 48 / 100 % | +3 % | Bold | `-xxl` |

3. **Small notes and labels next to an amount are Inter**, never the number font: "Total credit: ₱50,000.00" on the home card,
   "Used / Available" on the credit limit hub card, an old (struck) price, the Credit limit increase's "+₱10,000 added" and
   "Previous limit ₱30,000".
4. **A title keeps its own font; only the ₱ inside it is the number font** — e.g. a coupon value "+₱5,000" or "₱300 OFF" stays
   Hanken Grotesk (or Inter where the title is Inter), with `<span class="ps-peso">₱</span>` (`PS.Peso`). "50% OFF" has no ₱: unchanged.
5. List numbers are not amounts (the credit limit hub's tips 1 2 3 are Hanken now, they were Satoshi).
6. An emphasised amount at a size with no Number style: ask design (More for you's 28 → Number/lg 32, design's choice).
7. Kerning: Reddit Sans kerns most digit pairs (e.g. "7." −0.125 em). Where an amount is drawn one glyph per box (typed digits; the
   Withdraw morph), boxes don't kern, so each box gets its pair's kern as a right margin (`PS.KERN` / `PS.kern(a, b)` in core.js;
   `Component.KERN` in withdraw.js — the GPOS pair table at wght 700, 1/2048 em). Normal text kerns by itself.

### Header and bottom bars
1. **No progressive blur** anywhere (Figma: effect styles `Blur/Top-nav-effect` and `Blur/Bottom-nav-effect` are switched off).
   The glass buttons and the tab bar's pill keep their normal background blur (that is the glass).
2. One token gradient per bar, by the kind of page:

   | Page | Header | Bottom |
   |---|---|---|
   | Primary — the Home / Payment / Account tabs | `--gradient-top-nav-filled` | tab bar `--gradient-bottom-primary-nav-filled` |
   | Secondary (二级页面) — every other page | solid page colour `--color-surface-page-default` | `--gradient-bottom-secondary-nav-filled` |
   | Amount entry and order (loan details) page — not secondary pages | `--gradient-top-nav-filled` | `--gradient-bottom-secondary-nav-filled` |
   | A page sheet's foot (coupon picker: total + Confirm) | — | `--gradient-bottom-secondary-nav-filled` |

3. Unchanged behaviour: the header veil appears as content scrolls under it (fades over the first 24 px); the bottom veil fades out over
   the last stretch of scroll (as tall as the bar), gone at the very bottom; a page that does not scroll shows none.

## 3. Tokens `v2026.11.12 → v2026.11.17`

Full entry: `tokens/CHANGELOG.md` → 2026.11.17.

| Change | Token | CSS |
|---|---|---|
| Renamed + value | Primitive `Font/Family/Satoshi` → `Font/Family/Reddit Sans` ("Reddit Sans") | `--font-family-satoshi` → `--font-family-reddit-sans` |
| Value | Semantic `Font/Family/Number` → Reddit Sans | `--font-family-number` |
| Added | Semantic `Color/Gradient/Ambient/0 · 20 · 40 · 60 · 80` = `Color/Ambient/100` (#F0F5F4) at Layer opacity 0 – 80 | `--color-gradient-ambient-*` (`color-mix(in srgb, var(--color-ambient-100) calc(var(--layer-opacity-80) * 100%), transparent)`) |
| Scopes | Primitive `Layer opacity/*` → COLOR_OPACITY | — |
| Added | Text styles `Number/xs · sm · md · lg · xl · xxl` | `.ps-text-number-*` |
| Changed | Paint `Gradient/Top-nav-filled`: Default (grey #E1E4E5) 80 → 40 → 0 → **Ambient** 80 → 40 → 0 | `--gradient-top-nav-filled` |
| Renamed | Paint `Gradient/Bottom-nav-filled` → `Gradient/Bottom-primary-nav-filled` (white 0 → 60 → 80, same value) | `--gradient-bottom-nav-filled` → `--gradient-bottom-primary-nav-filled` |
| Added | Paint `Gradient/Bottom-secondary-nav-filled` (Ambient 0 → 60 → 80) | `--gradient-bottom-secondary-nav-filled` |
| Off | Effect `Blur/Top-nav-effect`, `Blur/Bottom-nav-effect` (progressive blur) | `--blur-top-nav-effect`, `--blur-bottom-nav-effect` removed |

**Keeping the old version** (owner: old CSS names and values stay): `tokens/legacy/2026.11.12.css` (made by `tools/legacy-tokens.py`)
declares every name this update removed or renamed, and the old value of every name that changed. Load it after `tokens/tokens.css`
to keep old code working or to get the old look back. The old fonts stay in `assets/fonts/fonts.css` (frozen: Satoshi numbers);
current pages link `assets/fonts/fonts-2026.11.17.css` (adds Reddit Sans, `--ps-font-num: "Reddit Sans"`).

Build note: `tools/build-tokens.py` now understands Figma's colour made of two variables (a colour at a layer opacity) and writes it
as `color-mix(...)`; `tools/sync-tokens.py` shows it in the changelog as "`Color/Ambient/100` at `Layer opacity/80`".

## 4. Components (shared/ps-ui) — before → after

| Component | Where | Before | After |
|---|---|---|---|
| `PS.Bands` · `PS.TopBar` · `PS.BottomBar` · `PS.Navigator` · `PS.Screen` | every page | 5 masked backdrop-blur layers + veil; blur off: header Subtle (white) 80 → 40 → 0, bottom Default (grey) 0 → 60 → 80, secondary bottom #EBF0EF | veil only: header `--gradient-top-nav-filled` (solid on secondary pages, unchanged), tab bar and primary bottom `--gradient-bottom-primary-nav-filled`, secondary bottom (`BottomBar{secondary}` or inside `.ps-screen--secondary`) `--gradient-bottom-secondary-nav-filled` |
| Sheet (page) foot | coupon picker | inset colour 0 → 80 % at 40 % | `--gradient-bottom-secondary-nav-filled` (Figma 13732:12513, Frame 1940699447) |
| `PS.Amount` | everywhere | Satoshi Bold, ₱ Inter (`curFont`) | Reddit Sans Bold incl. ₱; new props `num` / `decNum` (Number style); `curFont` kept, no effect |
| `PS.Peso` (new) | coupon values | — | wraps each ₱ of a title in `.ps-peso` (number font) |
| `PS.KERN` / `PS.kern` (new) | typed digits | — | Reddit Sans Bold pair kerning in em |
| `.ps-t-number-*` (new) | — | — | the six Number styles in rem |
| `PS.CreditCard` | home (gallery) | ₱ Satoshi 36 +3 %, ".00" 16 +3 %, total Satoshi Medium 14 | Number/xl (+4 %) + ".00" Number/xs (+2 %); "Total credit" Inter SemiBold 14 |
| `PS.PaymentCard` | home "Next payment" | ₱ Inter Medium + digits Satoshi Bold 24 | Number/md, ₱ Bold (Figma Section 6, Home/Full States-1coupon) |
| `PS.HomeCoupons` | home | value Satoshi Bold 20 / 24 | title font (Hanken Bold 20 / 24), only ₱ in Reddit Sans |
| `PS.Summary` | coupon picker | total Satoshi Bold 20 / 28 | Number/md 24 / 32 (13733:14010) |
| `PS.AmountCard` (+ `PS.EstimateCard`) | order page fallback, loan estimate | ₱ Inter Medium, digits Satoshi Bold 32 / 40 −0.5 % | Number/lg incl. ₱ (+2 %) (13733:14030, 13732:11392) |
| `PS.AmountEntry` | amount fallback | ₱ Inter Medium 28, digits Satoshi 48, ".00" 18 | ₱ Number/lg, digits Number/xxl (kerned boxes), ".00" Number/xs (13732:11315) |
| `PS.CreditLimitCard` | account | Inter SemiBold 16 | Number/xs (13733:14752) |
| `PS.HubCard` | credit limit hub | Satoshi 28 / ".00" 14; Used / Available Satoshi 12 | Number/lg + ".00" Number/xs; Used / Available Inter Regular 12 (13732:13893) |
| `PS.Tips` | credit limit hub | numbers in Satoshi Bold 20 | Hanken Bold 20 (not an amount) |
| `PS.RepayCard` | pay page (App / QR / Transfer) | Inter Bold 32 | Number/lg (13734:14775) |
| `PS.OrderHead` | loan application, loan record | Satoshi 32 | Number/lg (13735:14974) |
| `PS.Installment` | payment tab | Satoshi 18 | Number/sm (13748:15839) |
| `PS.PayBar` | payment tab total | Inter Bold 28 / 36 | Number/md 24 / 32 (13750:15975); the struck old total stays Inter |
| `PS.HistoryRow` | loan history | Inter SemiBold 18 | Number/sm |
| `PS.ActivityItem` | credit history | Inter Bold 16 | Number/xs (`.ps-activity__amt`) |
| `PS.Hero` | home, guest / new user | Satoshi 36 | Number/xl (+4 %) |
| `PS.OfferCard` | home, More for you | Satoshi Bold 28 / 36 | Number/lg 32 / 40 (no style at 28: design chose lg) |
| `PS.CouponTicket` / `PS.CouponOption` | coupon centre / picker | value Hanken / Inter | unchanged, only ₱ in Reddit Sans |
| `tune.js` | prototypes | "Progressive blur" setting | removed (`?blur=` ignored) |

## 5. The Withdraw demo (hosted by the app: home card, amount entry, morph, order page)

`prototypes/withdraw-fund-flow/withdraw.js` is the demo's own code and the app runs it (`withdraw-host.js`), so both changed:

- `BLUR = false` (the blur code is kept but never runs); loan screen header veil `--gradient-top-nav-filled`; Confirm bar
  `--gradient-bottom-secondary-nav-filled`; home (withdraw.css) header `--gradient-top-nav-filled`, tab bar
  `--gradient-bottom-primary-nav-filled`; Tune: the blur setting removed (`with-blur.html` only forwards to `index.html`).
- Home card amount: Reddit Sans, ₱ and digits 36 with 1.44 px (+4 %), ".00" 16 with 0.32 px (+2 %).
- Amount entry → order card morph (glyph FLIP), entry → card values: ₱ 32 → 32 (Bold 700 both; was Inter 28 riding 500 → 700),
  ls 0.64 → 0.64; digits 48 → 32, ls 1.44 → 0.64 (was −0.16 in the card); ".00" 16 → 32 (was 18), ls 0.32 → 0.64; kerning:
  every digit box carries its pair kern (`Component.KERN`), the tail's "0" kerns into "." in the card (`mpDec` margin
  ll(4, −0.672 px)), the last typed digit kerns into the tail in the card (`mpTail`).
- Static markup: the home payment card's ₱800.00 in Reddit Sans.
- The Credit limit increase (credit-limit-coins/baked): the big number follows `--ps-font-num` (Reddit Sans, tabular while it
  counts); "+₱10,000 added" and "Previous limit" numbers → Inter.

## 6. Motion checked frame by frame

Playwright with a fake clock (60 fps steps), the same run on the previous snapshot for comparison:

- **Amount entry → order card morph** (standalone and in the app): every glyph's path is monotonic (no reversals; the old run had one
  on the first digit), the progress curve matches the old one, the last frame equals the settled frame (0.00 px), and the settled
  glyphs sit where the unsplit, kerned text "₱12,600.00" would (≤ 0.03 px).
- **Credit limit increase → home card** (FLIP of the big number): start scale 1.778 (64 → 36 px), smooth decrease to 1, no jump at
  the end; the width step at the hand-off (the intro's tabular 64 px vs the card's proportional 36 px +4 %) is the same as before
  (≈ 10 %), so the motion is as it was.
- Bars: the veils' scroll fades are unchanged code; only their colours changed.

## 7. Pages (Dev Mode page ids)

Number font: `home` (credit card, payment card, coupons, guest hero, More for you), `withdraw` (home card, amount entry, order card),
`amount`, `loan`, `picker`, `kyc-estimate`, `payment`, `pay`, `order`, `account`, `hub`, `credit`, `history`, `loan-record`, `coupons`.
Bars (every page): tabs `home`, `payment`, `account`; amount entry / order page `withdraw`, `amount`, `loan`; every other page is a
secondary page (solid header, secondary bottom where it has a bottom bar); the coupon picker sheet's foot.

## 8. What Figma still lacks (decided with the owner)

- Not on the Figma page but changed by the rule: loan history amounts, credit history amounts, the guest hero, More for you, the
  Credit limit increase's big number, loan record.
- On the handoff page some instances still show the old style names ("Number/sm" at 16 px in Sections 3–5 is today's Number/xs;
  "Bottom-nav-filled" is today's Bottom-primary-nav-filled); "Withdrawal Method Error" (a secondary page) shows a white bottom — the
  rule says secondary.

## 9. How to verify

- Dev Mode → Iterations → this iteration: every changed page / component, before | after | difference; Compare `v1-20261116-n4 → v1-20261117-n1`.
- App: `prototypes/app/index.html` — Home, Payment, Account tabs; Withdraw → amount → 6 terms (morph); `?intro=1` for the Credit limit increase.
- Fonts: computed `font-family` of any `.ps-amount` starts with "Reddit Sans"; no `.ps-pb > i` other than `.ps-veil`.
