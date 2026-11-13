/* PeraSure Dev Mode — annotations (after Agentation): in Annotate mode (N) a click on the canvas pins a numbered note to the layer under
   it (an element inside a component, as precise as the click). Notes belong to the page and state (or component state) they were made
   on, are kept in this browser, and travel in a link (#…&notes=…): whoever opens it — a person, or an AI through the MCP server
   (resolve_devmode_link) — sees the same pins. "Copy task list" turns them into a list for Jira or for a developer's AI. */
(function () {
  'use strict';
  var DM = window.DM, h = DM.h, R = DM.R, I = DM.inspect, t = function (k, v) { return DM.t(k, v); };
  var KEY = 'perasure.devmode.notes';
  DM.NOTE_TYPES = ['ui', 'motion', 'copy', 'bug'];

  /* ---- storage: { "<where>": [ { i, p (layer path), x, y (0–1 inside the layer), t (text), k (type), c (made, ms) } ] } ---- */
  function all() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  DM.notesFor = function (where) { return (all()[where] || []).slice(); };
  DM.setNotes = function (where, list) { var o = all(); if (list.length) o[where] = list; else delete o[where]; save(o); };

  /* ---- in a link: base64url of { w: where, n: notes } (UTF-8, so Chinese survives) ---- */
  DM.encodeNotes = function (where, list) {
    var bytes = new TextEncoder().encode(JSON.stringify({ w: where, n: list.map(function (n) { return { i: n.i, p: n.p, x: +n.x.toFixed(3), y: +n.y.toFixed(3), t: n.t, k: n.k }; }) }));
    var s = ''; bytes.forEach(function (b) { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  DM.decodeNotes = function (code) {
    try {
      var b = atob(code.replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(b.length);
      for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
      var o = JSON.parse(new TextDecoder().decode(u));
      return o && o.w && Array.isArray(o.n) ? o : null;
    } catch (e) { return null; }
  };
  /* merge notes from a link into this browser (same id = same note) */
  DM.importNotes = function (o) {
    var mine = DM.notesFor(o.w), ids = mine.map(function (n) { return n.i; });
    o.n.forEach(function (n) { var k = ids.indexOf(n.i); if (k >= 0) mine[k] = Object.assign({}, mine[k], n); else mine.push(Object.assign({ c: Date.now() }, n)); });
    DM.setNotes(o.w, mine);
    return mine;
  };

  /* the layer a note is on, and where its pin sits (in the frame's own pixels) */
  DM.notePoint = function (T, n) {
    var node = T ? I.resolve(T, n.p) : null, r = node && I.rect(node);
    return r ? { x: r.left + n.x * r.width, y: r.top + n.y * r.height, node: node } : null;
  };
  function target(n) {
    var cut = n.p.indexOf('|'), comp = (cut < 0 ? n.p : n.p.slice(0, cut)).split('>').pop().replace(/#\d+$/, '');
    return { comp: comp, el: cut >= 0 };
  }
  function label(T, n) {
    var tg = target(n), node = T ? I.resolve(T, n.p) : null;
    var comp = /^APP\./.test(tg.comp) || !/^[A-Z]/.test(tg.comp) ? tg.comp : 'PS.' + tg.comp;
    return node && node.kind === 'element' ? comp + ' › ' + node.name : comp;
  }
  DM.noteLabel = label;

  /* ---- the task list (Markdown: Jira, a chat, a developer's AI) ---- */
  DM.notesMarkdown = function (o) {
    var lines = ['# ' + t('nt.listTitle') + ' · ' + o.title, t('nt.link') + ': ' + o.link, ''];
    o.notes.forEach(function (n, i) {
      lines.push((i + 1) + '. [' + t('nt.type.' + (n.k || 'ui')) + '] ' + label(o.T, n) + ' — ' + (n.t || '').replace(/\n+/g, ' '));
      lines.push('   ' + t('nt.layer') + ': `' + n.p + '`');
    });
    lines.push('', t('nt.aiHint'));
    return lines.join('\n');
  };

  /* ---- the note editor: a small card at the pin ---- */
  DM.NoteEditor = function NoteEditor(p) {
    var n = p.note, ts = R.useState(n.t || ''), text = ts[0], ks = R.useState(n.k || 'ui'), kind = ks[0], ref = R.useRef(null);
    R.useEffect(function () { if (ref.current) ref.current.focus(); }, []);
    function done() { if (text.trim()) p.onSave(Object.assign({}, n, { t: text.trim(), k: kind })); else p.onCancel(); }
    var W = 280, left = Math.min(window.innerWidth - W - 12, Math.max(12, p.x + 14)), top = Math.min(window.innerHeight - 220, Math.max(56, p.y - 20));
    return h('div', { className: 'dm-noteed', style: { left: left, top: top, width: W }, onMouseDown: function (e) { e.stopPropagation(); } },
      h('div', { className: 'dm-noteed__head' }, h('span', { className: 'dm-pin is-static' }, p.number), h('b', null, p.target)),
      h('textarea', { ref: ref, value: text, rows: 3, placeholder: t('nt.placeholder'), onChange: function (e) { ts[1](e.target.value); },
        onKeyDown: function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) done(); if (e.key === 'Escape') { e.stopPropagation(); p.onCancel(); } } }),
      h('div', { className: 'dm-noteed__row' },
        h('div', { className: 'dm-seg is-sm' }, DM.NOTE_TYPES.map(function (k) { return h('button', { key: k, type: 'button', className: kind === k ? 'is-on' : '', onClick: function () { ks[1](k); } }, t('nt.type.' + k)); })),
        h('span', { style: { flex: 1 } })),
      h('div', { className: 'dm-noteed__row' },
        p.onDelete ? h('button', { type: 'button', className: 'dm-btn', onClick: p.onDelete }, t('nt.delete')) : null,
        h('span', { style: { flex: 1 } }),
        h('button', { type: 'button', className: 'dm-btn', onClick: p.onCancel }, t('nt.cancel')),
        h('button', { type: 'button', className: 'dm-btn is-primary', onClick: done, title: '⌘/Ctrl + Enter' }, t('nt.save'))));
  };

  /* ---- the right panel's Notes tab ---- */
  DM.NotesPanel = function NotesPanel(p) {
    var notes = p.notes, link = p.shareLink();
    function copy(text, msg) { DM.copy(text, msg); }
    return h('div', { className: 'dm-notes' },
      h('div', { className: 'dm-sec__body is-top' },
        h('p', { className: 'dm-notes__intro' }, t('nt.intro')),
        h('div', { className: 'dm-notes__acts' },
          h('button', { type: 'button', className: DM.cx('dm-btn', p.mode === 'annotate' ? 'is-on' : 'is-outline'), onClick: function () { p.onMode(p.mode === 'annotate' ? 'inspect' : 'annotate'); } }, h(DM.Icon, { name: 'pin', size: 14 }), p.mode === 'annotate' ? t('nt.stop') : t('nt.start')),
          notes.length ? h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { copy(link, t('nt.linkCopied')); } }, h(DM.Icon, { name: 'link', size: 14 }), t('nt.share')) : null)),
      notes.length ? h('div', { className: 'dm-notes__list' }, notes.map(function (n, i) {
        return h('div', { key: n.i, className: DM.cx('dm-note-row', p.active === n.i && 'is-on'), onMouseEnter: function () { p.onHover(n.i); }, onMouseLeave: function () { p.onHover(null); } },
          h('span', { className: 'dm-pin is-static' }, i + 1),
          h('div', { className: 'dm-note-row__body' },
            h('div', { className: 'dm-note-row__top' }, h('span', { className: 'dm-chip is-' + (n.k === 'motion' ? 'motion' : n.k === 'bug' ? 'remove' : n.k === 'copy' ? 'edit' : 'ui') }, t('nt.type.' + (n.k || 'ui'))),
              h('button', { type: 'button', className: 'dm-note-row__target', title: n.p, onClick: function () { p.onSelect(n.p); } }, label(p.T, n))),
            h('div', { className: 'dm-note-row__text' }, n.t)),
          h('button', { type: 'button', className: 'dm-iconbtn', title: t('nt.edit'), onClick: function () { p.onEdit(n); } }, h(DM.Icon, { name: 'pen', size: 13 })));
      })) : h(DM.Empty, { icon: 'pin' }, t('nt.empty')),
      notes.length ? h('div', { className: 'dm-sec__body dm-notes__foot' },
        h('button', { type: 'button', className: 'dm-btn is-primary', onClick: function () { copy(DM.notesMarkdown({ title: p.title, link: link, notes: notes, T: p.T }), t('nt.listCopied')); } }, h(DM.Icon, { name: 'copy', size: 14 }), t('nt.copyList')),
        h('button', { type: 'button', className: 'dm-btn is-outline', onClick: function () { copy(t('nt.aiPrompt', { link: link, n: notes.length }), t('ai.copied')); } }, h(DM.Icon, { name: 'spark', size: 14 }), t('ai.copy')),
        h('button', { type: 'button', className: 'dm-btn', onClick: p.onClear }, t('nt.clear'))) : null);
  };
})();
