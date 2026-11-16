/* PeraSure Dev Mode — the iteration record (written with every requirement; the rules are in .claude/skills/perasure-iteration-log).
   One entry per iteration, newest first:
   { id            folder of its runnable snapshot in devmode/snapshots/ and the git tag devmode-<id>
     label         'v1.0' for a major version; 'v1 · 2026-11-20 · PHL-123' for an iteration ('无 Jira 单号' when there is none)
     major         1, 2 … (only a large redesign starts a new one)
     date          'YYYY-MM-DD'
     jira          { key, title, url } or null
     title         one line: what this iteration is — { zh, en } (the platform switches language)
     summary       a few sentences for designers and developers — { zh, en }
     changes: [ { type: 'ui' | 'motion', action: 'add' | 'edit' | 'remove', pages: [page ids], components: [names],
                  title: { zh, en }, detail: { zh, en } (values before → after where it helps), figma: ['10842:29606'] } ] }
   The page ids are devmode/data/pages.js's; the component names are PS.<Name> without "PS.". */
window.DM_ITERATIONS = [
  {
    id: 'v1-20261116-n3', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '「保留优惠券？」：多张券放进同一张卡，左右滑', en: 'Keep your coupon?: more than one coupon in one card, swiped' },
    summary: { zh: '一次改动让两张券都不满足条件时，以前会连续弹两个卡片，要点两次。现在两张券左右并排放在同一张卡里，像防诈骗提示（scams）那样左右滑，下面的圆点跟着手指走，卡片按最高的那页定高；只有当前这页的券在播动画，滑回来从头播。Keep / Don’t use 作用于当前这张，然后滑到下一张还没回答的；全部回答完卡片收起，借款一次改好，只弹一条提示。点关闭：已回答的生效，没回答的保持取消。布局按 Figma 10893:29050：圆点在 facts 下 12、按钮上 20；图片到标题从 28 改为 16（一张券时也一样）。Coupon system demo 和 app 都已更新。',
      en: 'When one change took off two coupons, the app showed two cards, one after the other. Now the coupons sit side by side in one card and are swiped like the anti-scam tips: the dots follow the finger, the card keeps the height of its tallest page, and only the coupon on show plays its animation (from the start each time it comes back). Keep and Don’t use answer the coupon on show and move on to the next one not yet answered. Once every coupon is answered the card closes and the loan changes once, with one toast. Closing the card keeps the answers given so far; the rest stay off. Layout from Figma 10893:29050: the dots 12 under the facts and 20 above the buttons; picture → title is 16 instead of 28, with one coupon too. Updated in the Coupon system demo and the app.' },
    changes: [
      { type: 'ui', action: 'add', pages: ['keep'], components: ['Decision'],
        title: { zh: 'Decision 新增 pages / index / onIndex', en: 'New Decision props: pages, index, onIndex' },
        detail: { zh: '一次只显示一张券（art · title · body · facts）→ 再加 pages [{ art, title, body, facts }] · index · onIndex：多于一张时放进 PS.Carousel（dots、gap md），关闭按钮和两个按钮不动、作用于当前页；一张时和以前一样。文件 shared/ps-ui/coupon.js、ps-ui.css（.ps-decide__pages padding-bottom: --spacing-padding-xl）。',
          en: 'One coupon at a time (art · title · body · facts) → plus pages [{ art, title, body, facts }] · index · onIndex: more than one goes into a PS.Carousel (dots, gap md); the close button and the buttons stay put and act on the page on show; one coupon looks as before. Files: shared/ps-ui/coupon.js, ps-ui.css (.ps-decide__pages padding-bottom: --spacing-padding-xl).' },
        figma: ['10893:29050'] },
      { type: 'ui', action: 'edit', pages: ['keep'], components: ['Decision'],
        title: { zh: '图片到标题 28 → 16', en: 'Picture → title 28 → 16' },
        detail: { zh: '.ps-decide__text margin-top：--spacing-gap-lg（16，加上 body gap 12 = 28）→ --spacing-gap-xs（4，合计 16），按 Figma 10893:29050。一张券和多张券都适用。',
          en: '.ps-decide__text margin-top: --spacing-gap-lg (16, with the body gap of 12 = 28) → --spacing-gap-xs (4, 16 in all), from Figma 10893:29050. One coupon and several alike.' },
        figma: ['10893:29050'] },
      { type: 'motion', action: 'add', pages: ['keep'], components: ['Carousel', 'CouponArt'],
        title: { zh: '翻页沿用 scams 的 Carousel；券动画只在当前页播放', en: 'Paging uses the anti-scam Carousel; only the coupon on show animates' },
        detail: { zh: 'Carousel 新增 gap（页面 → 圆点，间距 token；默认 2xl 不变，Decision 用 md）。翻页、拖动、圆点跟手都是 Carousel 原样（Smooth spring 240/30/1）。CouponArt 新增 active：false 停在票券落定的那一帧（loop 标记），true 再次从头播放。',
          en: 'Carousel: new prop gap (pages → dots, a gap token; default 2xl unchanged, Decision uses md). Swiping, dragging and the dots following are the Carousel’s own (Smooth spring 240/30/1). CouponArt: new prop active — false holds the frame where the ticket has landed (the loop marker), true plays it again from the start.' } },
      { type: 'ui', action: 'edit', pages: ['keep'], components: [],
        title: { zh: '回答逻辑：一起回答，一次改借款', en: 'Answering: all together, the loan changes once' },
        detail: { zh: '以前：每张券单独弹卡片，点 Keep 立刻改借款并弹提示。现在：点完一张滑到下一张未回答的；全部回答完（或点关闭）才一次性改借款，只弹一条提示。app（prototypes/app/screens-loan.js）和 Coupon system（prototypes/coupon-system/coupon-system.js，新加载 pay.js）一致。Dev Mode「保留优惠券？」页现在真正打开这张卡，分一张券 / 两张券两个状态。',
          en: 'Before: one card per coupon, and Keep changed the loan and showed a toast at once. Now: answering a coupon moves on to the next one not yet answered; the loan changes once, with one toast, when all are answered (or the card is closed). The app (prototypes/app/screens-loan.js) and Coupon system (prototypes/coupon-system/coupon-system.js, which now loads pay.js) match. Dev Mode’s Keep your coupon? page now opens the card, with One coupon and Two coupons states.' } }
    ]
  },
  {
    id: 'v1-20261116-n2', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '「保留优惠券？」弹窗：优惠券插图换成动画', en: 'Keep your coupon?: the coupon picture is now an animation' },
    summary: { zh: '「保留优惠券？」弹窗里的优惠券插图改为播放新的 GSAP 动画（Playground → Animations 里的三个 Coupon 动画）：票券落下、印刷内容出现、徽章弹出，之后循环——百分比印章轻晃、₱ 硬币带厚度转一圈、箭头从凹槽飞出再回来。徽章按扁平风格绘制：一个右侧光源，硬阴影、单侧白边，没有渐变和 SVG 滤镜。其他地方（优惠券中心、首页、借款页的优惠券行）仍是静态插图。',
      en: 'The coupon picture in the Keep your coupon? sheet now plays the new GSAP animations (the three Coupon animations in Playground → Animations): the ticket lands, its print fills in and the badge pops on, then it loops — the % seal rocks, the ₱ coin turns a full circle with its thickness showing, the arrow shoots up out of its recess and back. The badges are drawn flat: one light from the right, hard shadows, a white rim on one side, no gradients or SVG filters. Everywhere else (coupon centre, home, the loan page’s coupon rows) keeps the still pictures.' },
    changes: [
      { type: 'motion', action: 'add', pages: ['keep'], components: ['CouponArt', 'Decision'],
        title: { zh: 'CouponArt 新增 animate；Decision 使用动画', en: 'New CouponArt prop animate; Decision uses it' },
        detail: { zh: 'CouponArt：静态 SVG（≥ 40 px 带白描边，< 40 px 简版）→ 再加 animate（布尔，≥ 40 px）：播放 animations/coupon-percentage | coupon-amount | coupon-credit-limit 的 GSAP 模块（60 fps，intro 0–66 帧，loop 66–210 帧，减少动态效果时显示静止帧）。Decision：CouponArt { size: 80 } → { size: 80, animate: true }。新增 PS.loadGsapModule：页面没有 import map 时也能加载这些模块（vendor/gsap@3.15.0 + Blob URL）。文件 shared/ps-ui/coupon.js、core.js、ps-ui.css（.ps-cart__anim）。',
          en: 'CouponArt: still SVG (40 px up with the white outline, below 40 px the plain one) → plus animate (boolean, 40 px up): plays the GSAP module of animations/coupon-percentage | coupon-amount | coupon-credit-limit (60 fps, intro frames 0–66, loop 66–210; reduced motion shows the resting frame). Decision: CouponArt { size: 80 } → { size: 80, animate: true }. New PS.loadGsapModule loads these modules on pages with no import map (vendor/gsap@3.15.0 + a Blob URL). Files: shared/ps-ui/coupon.js, core.js, ps-ui.css (.ps-cart__anim).' } }
    ]
  },
  {
    id: 'v1-20261116-n1', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '卡片：白环和阴影可以一起用', en: 'Card: the white ring and the shadow together' },
    summary: { zh: '首页的还款卡是「白环 + 阴影」，但 PS.Card 的 variant 只能选一个，所以 PaymentCard 一直往 className 里塞 ps-card--raised，绕开了 Card 的接口；首页优惠券卡更是自己写了 Card 的类名。现在 Card 多了一个 raised 属性，任何样式都能加阴影；其他属性（role、aria、按压动效）会传给元素，as 可以用 m.div。PaymentCard 和 HomeCoupons 改为通过接口使用 Card。外观没有变化：首页 16 个状态和这两个组件的像素比对完全一致。',
      en: 'Home’s payment card has the white ring and the shadow, but PS.Card’s variant takes one value, so PaymentCard added ps-card--raised by hand and the home coupons card wrote Card’s classes itself. Card now has a raised prop that adds the shadow to any variant, passes other props (role, aria-*, press motion) to its element, and takes as: m.div. PaymentCard and HomeCoupons use Card through its props. Nothing looks different: the 16 Home states and both components match pixel for pixel.' },
    changes: [
      { type: 'ui', action: 'add', pages: [], components: ['Card'],
        title: { zh: 'Card 新增 raised 属性', en: 'New Card prop: raised' },
        detail: { zh: 'variant plain | outline | raised（只能选一个）→ 再加 raised（布尔）：任何 variant 都能加默认阴影（--shadow-default）。variant: \'raised\' 照旧等于 plain + 阴影。其他属性传给元素，as 可传 m.div。组件库「Cards」状态多了一张 outline + raised。文件 shared/ps-ui/core.js。',
          en: 'variant plain | outline | raised (one value) → plus raised (boolean): the default shadow (--shadow-default) on any variant. variant: \'raised\' still means plain + shadow. Other props go to the element; as takes m.div. The gallery’s Cards state adds outline + raised. File: shared/ps-ui/core.js.' } },
      { type: 'ui', action: 'edit', pages: ['home'], components: ['PaymentCard', 'HomeCoupons'],
        title: { zh: '首页卡片改为通过接口使用 Card', en: 'Home cards use Card through its props' },
        detail: { zh: 'PaymentCard：className 里的 ps-card--raised → raised: true。HomeCoupons：自己写的 ps-card ps-card--outline → PS.Card { as: m.div, variant: \'outline\' }。外观不变。文件 shared/ps-ui/home.js。',
          en: 'PaymentCard: ps-card--raised in className → raised: true. HomeCoupons: its own ps-card ps-card--outline classes → PS.Card { as: m.div, variant: \'outline\' }. Looks the same. File: shared/ps-ui/home.js.' } }
    ]
  },
  {
    id: 'v1-20261113-n1', label: 'v1 · 2026-11-13 · 无 Jira 单号', major: 1, date: '2026-11-13', jira: null,
    title: { zh: '首页额度卡：大字号下不再多出空白', en: 'Home credit card: no gap under it at larger text sizes' },
    summary: { zh: '文字大小调到 130% 及以上（或用「等比放大 · rem」）时，首页蓝色额度卡下面会多出一段空白：130% 时多 59 px，430 宽的 rem 模式多 29 px。原因是给卡片留的位置用 rem 写，会跟着字号变大，而卡片是 Withdraw demo 自己的，用 px，不跟字号变。现在留的位置和卡片一样用 px，任何字号下卡片下面的间距都和默认一样；默认字号下画面不变。',
      en: 'At text sizes of 130 % and above (or with Capped zoom · rem), a gap appeared under the blue credit card on Home: 59 px at 130 %, 29 px on a 430 phone in rem. The space kept for the card was set in rem, so it grew with the text, but the card is the Withdraw demo’s own and stays the same size. The space is now set in px like the card, so the gap under it is the same at every text size. Nothing changes at the default text size.' },
    changes: [
      { type: 'ui', action: 'edit', pages: ['home'], components: ['APP.WdHero'],
        title: { zh: '额度卡的占位高度', en: 'Space kept for the credit card' },
        detail: { zh: '.app-wdhero 的 min-height：12.25rem（跟字号变，130% 时 254.8 px）→ 196px（和卡片一样高，任何字号都不变）。文件 prototypes/app/app.css。',
          en: '.app-wdhero min-height: 12.25rem (grew with the text: 254.8 px at 130 %) → 196px (the card’s own height, at every text size). File: prototypes/app/app.css.' } }
    ]
  },
  {
    id: 'v1.0', label: 'v1.0', major: 1, date: '2026-11-13', jira: null, baseline: true,
    title: { zh: 'v1.0 基线', en: 'v1.0 baseline' },
    summary: { zh: 'PeraSure app demo 的第一个完整版本：60 个页面和弹窗、169 个共享组件。之后的组件和动效迭代都以这一版为起点记录。',
      en: 'The first complete version of the PeraSure app demo: 60 pages and sheets, 169 shared components. Every component and motion iteration after it is recorded from here.' },
    changes: []
  }
];
