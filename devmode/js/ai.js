/* PeraSure Dev Mode — connecting a developer's AI: the setup dialog for the hosted MCP server (worker/index.js, on samge.studio; its
   address and access token come from /perasure/_mcp for whoever is signed in) and "Copy for AI", which copies a short instruction with
   the live link of what is open, for the AI to read through the MCP (resolve_devmode_link). */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, t = function (k, v) { return DM.t(k, v); };
  var SITE = 'https://samge.studio/perasure/', SERVER = SITE + 'devmode/mcp', NAME = 'perasure-devmode';
  DM.MCP = { name: NAME, server: SERVER };
  /* the MCP address and token, from the Worker (only on samge.studio, signed in) */
  var accessP = null;
  function access() {
    if (!accessP) accessP = fetch('../_mcp', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(function () { accessP = null; return null; });
    return accessP;
  }

  /* the live link of what is open now (also when Dev Mode runs from a local copy) */
  DM.liveLink = function () {
    var hs = (location.hash || '').replace(/^#/, '').split('&').filter(function (kv) { return kv && !/^(ai|tab|notes|dev|fit|tx)=/.test(kv); });
    /* with the device, Screen fit and Text size, so whoever opens it (or their AI) sees the same layout */
    var s = DM._screen; if (s) hs.push('dev=' + s.device, 'fit=' + s.fit, 'tx=' + s.text);
    return SITE + 'devmode/index.html' + (hs.length ? '#' + hs.join('&') : '');
  };
  DM.copyForAI = function (what) {
    var link = DM.liveLink();
    DM.copy(t('ai.prompt', { what: what, link: link, name: NAME }), t('ai.copied'));
  };
  DM.CopyForAI = function CopyForAI(p) {
    return h('button', { type: 'button', className: 'dm-btn is-outline', title: t('ai.copyTip'), onClick: function () { DM.copyForAI(p.what); } }, h(DM.Icon, { name: 'spark', size: 14 }), t('ai.copy'));
  };

  function Cmd(p) {
    return h('div', { className: 'dm-cmd' }, h('pre', null, p.children),
      h('button', { type: 'button', className: 'dm-iconbtn', title: t('copy'), onClick: function () { DM.copy(p.children, t('copied')); } }, h(DM.Icon, { name: 'copy', size: 14 })));
  }
  function Seg(p) {
    return h('div', { className: 'dm-seg is-sm' }, p.items.map(function (x) {
      return h('button', { key: x[0], type: 'button', className: p.value === x[0] ? 'is-on' : '', onClick: function () { p.onChange(x[0]); } }, x[1]);
    }));
  }
  function Step(p) {
    return h('section', { className: 'dm-step' }, h('div', { className: 'dm-step__n' }, p.n),
      h('div', { className: 'dm-step__body' }, h('div', { className: 'dm-step__head' }, h('b', null, p.title), p.extra || null), p.sub ? h('p', null, p.sub) : null, p.children));
  }

  DM.AiSetup = function AiSetup(p) {
    var tl = R.useState('claude'), tool = tl[0];
    var ac = R.useState(undefined), acc = ac[0];
    R.useEffect(function () { access().then(function (a) { ac[1](a); }); }, []);
    R.useEffect(function () { var f = function (e) { if (e.key === 'Escape') p.onClose(); }; window.addEventListener('keydown', f); return function () { window.removeEventListener('keydown', f); }; }, []);
    /* the MCP signs in with the same account and password as the site (worker/index.js mcpAuth); never filled in here */
    var url = (acc && acc.url) || SERVER, login = !acc || acc.login !== false;
    var H = login ? [['X-PeraSure-Account', '<account>'], ['X-PeraSure-Password', '<password>']] : [];
    var json = '{\n  "mcpServers": {\n    "' + NAME + '": {\n      "url": "' + url + '"' + (H.length ? ',\n      "headers": {\n' + H.map(function (x) { return '        "' + x[0] + '": "' + x[1] + '"'; }).join(',\n') + '\n      }' : '') + '\n    }\n  }\n}';
    var add = {
      claude: { cmd: 'claude mcp add -s user --transport http ' + NAME + ' ' + url + H.map(function (x) { return ' \\\n  --header "' + x[0] + ': ' + x[1] + '"'; }).join(''), note: t('ai.claudeNote') },
      cursor: { cmd: json, note: t('ai.cursorNote') },
      codex: { cmd: '# ~/.codex/config.toml\n[mcp_servers.' + NAME + ']\nurl = "' + url + '"' + (H.length ? '\nhttp_headers = { ' + H.map(function (x) { return '"' + x[0] + '" = "' + x[1] + '"'; }).join(', ') + ' }' : ''), note: t('ai.codexNote') },
      other: { cmd: json, note: t('ai.otherNote') }
    }[tool];
    var examples = [t('ai.ex1'), t('ai.ex2'), t('ai.ex3'), t('ai.ex4')];
    return h('div', { className: 'dm-dialogwrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
      h('div', { className: 'dm-dialog', role: 'dialog', 'aria-label': t('ai.title') },
        h('header', { className: 'dm-dialog__head' }, h('div', null, h('h3', null, t('ai.title')), h('p', null, t('ai.sub'))),
          h('button', { type: 'button', className: 'dm-iconbtn', title: t('cmp.close') + ' (Esc)', onClick: p.onClose }, h(DM.Icon, { name: 'close', size: 16 }))),
        h('div', { className: 'dm-dialog__body' },
          h(Step, { n: 1, title: t('ai.s1'), sub: login ? t('ai.s1sub') : t('ai.nologin') }, h(Cmd, null, url)),
          h(Step, { n: 2, title: t('ai.s2'), extra: h(Seg, { value: tool, onChange: tl[1], items: [['claude', 'Claude Code'], ['cursor', 'Cursor'], ['codex', 'Codex'], ['other', t('ai.otherTool')]] }) },
            h(Cmd, null, add.cmd), h('p', { className: 'dm-step__note' }, add.note)),
          h(Step, { n: 3, title: t('ai.s3'), sub: t('ai.s3sub') }, h(Cmd, null, tool === 'claude' ? 'claude mcp list' : t('ai.s3other'))),
          h(Step, { n: 4, title: t('ai.s4'), sub: t('ai.s4sub') }, h(Cmd, null, 'git clone https://github.com/samgestudio-dev/Perasure.git\nnpm install -g playwright && npx playwright install chromium\nnode Perasure/devmode/mcp/server.mjs --help')),
          h('section', { className: 'dm-step is-plain' }, h('div', { className: 'dm-step__body' },
            h('div', { className: 'dm-step__head' }, h('b', null, t('ai.use'))),
            h('p', null, t('ai.useSub')),
            h('ul', { className: 'dm-examples' }, examples.map(function (x, i) { return h('li', { key: i }, h('span', null, x), h('button', { type: 'button', className: 'dm-iconbtn', title: t('copy'), onClick: function () { DM.copy(x, t('copied')); } }, h(DM.Icon, { name: 'copy', size: 13 }))); })),
            h('p', { className: 'dm-step__note' }, t('ai.tools')))))));
  };
})();
