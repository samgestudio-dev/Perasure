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
    id: 'v1.0', label: 'v1.0', major: 1, date: '2026-11-13', jira: null, baseline: true,
    title: { zh: 'v1.0 基线', en: 'v1.0 baseline' },
    summary: { zh: 'PeraSure app demo 的第一个完整版本：60 个页面和弹窗、169 个共享组件。之后的组件和动效迭代都以这一版为起点记录。',
      en: 'The first complete version of the PeraSure app demo: 60 pages and sheets, 169 shared components. Every component and motion iteration after it is recorded from here.' },
    changes: []
  }
];
