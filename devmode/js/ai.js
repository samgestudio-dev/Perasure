/* PeraSure Dev Mode — connecting a developer's AI: the setup dialog for the MCP server (devmode/mcp/server.mjs) and "Copy for AI",
   which copies a short instruction with the live link of what is open, for the AI to read through the MCP (resolve_devmode_link). */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, t = function (k, v) { return DM.t(k, v); };
  var SITE = 'https://samgestudio-dev.github.io/Perasure/', SERVER = SITE + 'devmode/mcp/server.mjs', NAME = 'perasure-devmode';
  DM.MCP = { name: NAME, server: SERVER };

  /* the live link of what is open now (also when Dev Mode runs from a local copy) */
  DM.liveLink = function () {
    var hs = (location.hash || '').replace(/^#/, '').split('&').filter(function (kv) { return kv && !/^(ai|tab|notes)=/.test(kv); }).join('&');
    return SITE + 'devmode/index.html' + (hs ? '#' + hs : '');
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
    var os = R.useState(/Win/.test(navigator.platform) ? 'win' : 'mac'), sys = os[0];
    var tl = R.useState('claude'), tool = tl[0];
    R.useEffect(function () { var f = function (e) { if (e.key === 'Escape') p.onClose(); }; window.addEventListener('keydown', f); return function () { window.removeEventListener('keydown', f); }; }, []);
    var file = sys === 'win' ? '$HOME\\.perasure\\devmode-mcp.mjs' : '~/.perasure/devmode-mcp.mjs';
    var abs = sys === 'win' ? 'C:\\\\Users\\\\<you>\\\\.perasure\\\\devmode-mcp.mjs' : '/Users/<you>/.perasure/devmode-mcp.mjs';
    var dl = sys === 'win'
      ? 'New-Item -ItemType Directory -Force $HOME\\.perasure | Out-Null\nInvoke-WebRequest ' + SERVER + ' -OutFile $HOME\\.perasure\\devmode-mcp.mjs'
      : 'mkdir -p ~/.perasure && curl -fsSL ' + SERVER + ' -o ~/.perasure/devmode-mcp.mjs';
    var json = '{\n  "mcpServers": {\n    "' + NAME + '": {\n      "command": "node",\n      "args": ["' + abs + '"]\n    }\n  }\n}';
    var add = {
      claude: { cmd: 'claude mcp add ' + NAME + ' -s user -- node ' + file, note: t('ai.claudeNote') },
      cursor: { cmd: json, note: t('ai.cursorNote') },
      codex: { cmd: 'codex mcp add ' + NAME + ' -- node ' + file + '\n\n# ' + t('ai.or') + ' ~/.codex/config.toml\n[mcp_servers.' + NAME + ']\ncommand = "node"\nargs = ["' + abs.replace(/\\\\/g, '\\\\') + '"]', note: t('ai.codexNote') },
      other: { cmd: json, note: t('ai.otherNote') }
    }[tool];
    var examples = [t('ai.ex1'), t('ai.ex2'), t('ai.ex3'), t('ai.ex4')];
    return h('div', { className: 'dm-dialogwrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
      h('div', { className: 'dm-dialog', role: 'dialog', 'aria-label': t('ai.title') },
        h('header', { className: 'dm-dialog__head' }, h('div', null, h('h3', null, t('ai.title')), h('p', null, t('ai.sub'))),
          h('button', { type: 'button', className: 'dm-iconbtn', title: t('cmp.close') + ' (Esc)', onClick: p.onClose }, h(DM.Icon, { name: 'close', size: 16 }))),
        h('div', { className: 'dm-dialog__body' },
          h(Step, { n: 1, title: t('ai.s1'), sub: t('ai.s1sub'), extra: h(Seg, { value: sys, onChange: os[1], items: [['mac', 'macOS / Linux'], ['win', 'Windows']] }) }, h(Cmd, null, dl)),
          h(Step, { n: 2, title: t('ai.s2'), extra: h(Seg, { value: tool, onChange: tl[1], items: [['claude', 'Claude Code'], ['cursor', 'Cursor'], ['codex', 'Codex'], ['other', t('ai.otherTool')]] }) },
            h(Cmd, null, add.cmd), h('p', { className: 'dm-step__note' }, add.note)),
          h(Step, { n: 3, title: t('ai.s3'), sub: t('ai.s3sub') }, h(Cmd, null, 'node ' + file + ' --check')),
          h(Step, { n: 4, title: t('ai.s4'), sub: t('ai.s4sub') }, h(Cmd, null, 'npm install -g playwright\nnpx playwright install chromium')),
          h('section', { className: 'dm-step is-plain' }, h('div', { className: 'dm-step__body' },
            h('div', { className: 'dm-step__head' }, h('b', null, t('ai.use'))),
            h('p', null, t('ai.useSub')),
            h('ul', { className: 'dm-examples' }, examples.map(function (x, i) { return h('li', { key: i }, h('span', null, x), h('button', { type: 'button', className: 'dm-iconbtn', title: t('copy'), onClick: function () { DM.copy(x, t('copied')); } }, h(DM.Icon, { name: 'copy', size: 13 }))); })),
            h('p', { className: 'dm-step__note' }, t('ai.tools')))))));
  };
})();
