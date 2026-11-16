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
