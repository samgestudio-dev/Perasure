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
