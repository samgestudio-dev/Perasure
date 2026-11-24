# Coupon logic on the order page — discussion so far (2026-11-24)

Status: **paused by the owner** ("可能要改整个逻辑，之后再继续" — the whole logic may change; continue later).
What is in the demo now is entries 74–78 of `rebrand/log/figma.md` (summary in §2). The logic agreed in conversation but **not built** is §4.
Nothing is committed.

---

## 1. The owner's messages, in order (verbatim)

1. (Figma 11273:35457) "figma和demo这个部分都删掉。弹窗里的优惠券选中勾边用navy"
2. "下单详情页优惠券选择逻辑变更，调整金额/term 不符合门槛后照样弹弹窗，如果用户继续选择不用券则沿用当前逻辑，但是区别在于，如果用户主动勾选了券，则借款金额/term自动更改为最低门槛。see all 6的弹窗内同逻辑，即所有券都可以选择，无unavailable的状态了，不过需要用户点击confirm后才会将订单变更为最低门槛，如果按x则不变。"
3. "从券列表点击use跳转下单页如果无论如何都无法满足最低门槛要求则输入完金额后直接跳弹窗，和keep your xxx limit increase 差不多结构，都是动画+title+说明文字，只是没有 (Figma 11273:33246)，cta只需要一个主cta就行。"
4. "在tune里给我加一个这个情况的入口"
5. "没出弹窗啊，单独做一个隔离情况（开关，不受别的tune设置影响），因为这是特殊情况。"
6. "tune也重新设计一下，分类选择，目前太乱了。这种特殊scenario单独放一类"
7. "special case 做成延伸收缩的样式，列表，开关用toggle，放一个info icon点击tooltip显示简介"
8. "开了special case coupon you cant use 仍然无法复现。梳理下这个case给的条件，因为开了以后还给了可用的提额券导致这个case不成立了"
9. "coupon see all 6的弹窗里券还是需要unavailable这个状态，仅在这种无论如何都无法用的情况下会出现。
   另外需要加一个情况（非special scenario），当前逻辑主页点击withdraw后自动帮选择两种券，用户如果取消勾选提额券，但是会导致另一张折扣券门槛不足，则跳对应的挽留弹窗，如果依旧不使用券，则自动取消折扣券，但是用户再次点击折扣券，则会跳出无法使用这个券的弹窗。根本逻辑是，两种券不会联动，系统不会自动帮助用户拼券。see all six同理，如果取消了提额券，discount列表里则会让不符合门槛的变成unavailable。
   你先确定是否理解我的意思，再分析一下是否有逻辑漏洞"
10. (to "When can a limit increase itself be Unavailable?") "期限选择是唯一条件"
11. "先把你理解后的逻辑列出来"
12. "优惠券部分把刚才的所有对话保存起来。可能要改整个逻辑，之后再继续"

---

## 2. What is built now (demo + Figma)

| Entry | What |
|---|---|
| 74 | Coupon sheet: the intro line + "Your loan" row removed (Figma 11273:35457, demo `CouponPicker` call). Selected coupon line navy (`check/on-border` / `--check-on-border`; Figma CouponPickCard Selected). |
| 75 | A ticked coupon that doesn't fit is used and the loan moves to its threshold (`meet`): order-page rows, "Use" path, See all (Confirm applies, ✕ discards). See all had **no Unavailable** state. Figma: the one Unavailable CouponPickCard instance → Default (the variant stays in the component). |
| 76 | A coupon that can never fit → one-button sheet `nocoupon` ("You can’t use your {coupon} on this loan", body, Got it) — from "Use", the order-page tick, See all → Confirm. **Built with auto-pairing**: a discount above the credit brought along the smallest limit coupon that lifts it (`pair`, `plan`, `APP.planLoan`). Gallery: Decision "Can’t use (one button)". |
| 77 | Tune regrouped (Special cases · Account and loan · Checks and messages · Network · Display); Special cases a folding list with switches and ⓘ bubbles; the case stands alone (overrides account / loan / coupons). Amount screen never starts above what can be borrowed. |
| 78 | Special case "Coupon you can’t use": ₱5,000 available, its own coupons 25% off / 20% off (₱6,000) / ₱300 off (₱10,000) / +₱2,000 (₱20,000), no lifting limit coupon. |

Code: `prototypes/app/screens-loan.js` (meet, pair, reach, never, plan, toggleRow, picker, sheet `nocoupon`, fresh / openLoan), `prototypes/app/screens-withdraw.js` ("Use" path), `prototypes/app/coupons-data.js` (`coupons('case')`, Tune `credit`), `prototypes/app/index.html` (Tune), `shared/ps-ui/tune.js` / `tune.css`, `shared/ps-ui/withdraw-host.js` (amount cap), `shared/gallery.js`.

**Conflicts with the latest discussion (to undo / change when work resumes):**
- `pair` / `plan` auto-pairing contradicts "系统不会自动帮助用户拼券".
- See all has no Unavailable; message 9 brings it back for coupons that can't be used.
- Limit coupons still have amount minimums (l5 ₱6,000, l2 ₱20,000); message 10 says the term is their only condition.
- The special case still lists +₱2,000 as a can't-use coupon.

---

## 3. Gaps raised before message 10 (with my suggestions)

1. Auto-pairing (entry 76) contradicts "no combining" → remove; judge "can't use" against what is ticked now only.
2. The "untick the limit coupon → discount breaks" case can't happen with today's numbers (credit ₱45,000, highest discount minimum ₱10,000; the amount screen caps at the credit) → add a test coupon, e.g. "30% off, needs ₱48,000".
3. "Keep coupon" in that retention sheet can only work by putting the limit coupon back → suggest **"Keep both"** = undo the untick; text says the discount needs ₱X, which needs the limit increase.
4. Unticking the limit coupon already toasts "Your amount is now ₱45,000…"; with the sheet that's two messages → suggest no toast when the sheet opens.
5. See all: a picked discount becomes unusable when the limit coupon is unpicked in the sheet → suggest unpick it and show Unavailable; no retention sheet inside See all.
6. Ticking the limit coupon again doesn't bring the discount back (no linking) — owner to confirm.
7. The term never makes a coupon unusable (it can always change).
8. When can a limit increase be Unavailable? → owner: **"期限选择是唯一条件"** (§4.0).

---

## 4. The logic as I understood it (message 11) — NOT built

**0. Basics**
- Discount: two conditions — minimum amount, allowed terms. Limit increase: **one condition — allowed terms** (no minimum amount).
- The most a loan can be = available credit + the increase of the limit coupon ticked right now.
- The two kinds don't affect each other; the system never turns a coupon on or off to make another fit.

**1. Can't be used**
- The term can always be fixed, so it never makes a coupon unusable.
- A discount can't be used when its minimum amount is above the most the loan can be with what's ticked now.
- A limit increase can always be used (ticking one only moves the term).

**2. Order page, default** — after Withdraw → amount → term, the system ticks the best discount and the best limit increase that fit (as now).

**3. Ticking a coupon on the order page**
1. Fits → ticked.
2. Doesn't fit but can (term wrong, or amount low but within the most the loan can be) → ticked, the loan moves to its minimum, toast "Your loan is now ₱… · n terms." If that breaks the other ticked coupon, "Keep your …?" asks about it.
3. Can't be used → "You can’t use your … on this loan" (Got it); nothing changes.

**4. Changing amount / term** — a ticked coupon that stops fitting → "Keep your …?" (Keep: back to its minimum; Don't use: off). As now.

**5. Unticking the limit increase (new)**
1. It comes off; an amount above the credit drops to the credit.
2. If that breaks the ticked discount → "Keep your …?" for it, no toast. Text: it needs ₱X, which only works with the limit increase. **Keep both** = undo the untick; **Don't use** = the discount comes off too.
3. No discount broken → no sheet; the amount toast as now.
4. Tapping that discount later → "You can’t use …".
5. Ticking the limit increase again doesn't bring the discount back.

**6. See all**
1. Everything can be picked, except discounts that can't be used → **Unavailable**, judged against the credit + the limit increase picked in the sheet.
2. Unpicking the limit increase in the sheet → a picked discount that now can't be used drops off and shows Unavailable.
3. Picking a limit increase again → those discounts selectable again.
4. The total shows the loan as it will be after Confirm. Confirm moves the loan to what's picked; ✕ changes nothing.

**7. "Use" from the coupon centre → amount and term** — fits: ticked; can fit: ticked, loan moves; can't: order page without it, then "You can’t use …" (only a discount can).

**8. Data and the special case**
- +₱5,000 and +₱2,000 lose their minimum amount (rule line "Any amount · terms") — demo and Figma.
- New test coupon "30% off, needs ₱48,000" (credit ₱45,000) so §5 can happen in the normal flow: slide above ₱45,000 with the limit increase on, tick 30% off, untick the limit increase.
- Special case: ₱5,000 available; 25% off (works), 20% off (₱6,000), ₱300 off (₱10,000); no limit increase in the case, so the two discounts can never be used.

---

## 5. Open when work resumes
- Owner to confirm or change §4 (the whole logic may change).
- Then: undo the conflicts in §2, build §4, update Figma (coupon rule lines, CouponPickCard Unavailable usage, a frame for the one-button sheet), walk every path, log as a new entry.
