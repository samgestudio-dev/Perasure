/* PeraSure UI — lists: link rows, labelled facts, activity and inbox items, history rows, the credit hub card, tips.
   Needs core.js. Figma: app file barda5NcnFzxG7CHtISKsW, sections Account, inbox, Loan history. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* LinkList: a card of rows that lead somewhere · tall (22 px rows: the help topics and articles, DS 5453:4712) · title · items [{ id, label, icon (20), value, trail (icon instead of the chevron, e.g. 'link': opens outside the app; 'none': nothing), onClick }] · tone link (brand labels, regular) | plain (Hanken medium) */
  PS.LinkList = function LinkList(p) {
    var out = [];
    p.items.forEach(function (it, i) {
      if (i) out.push(h(PS.Divider, { key: 'd' + i }));
      out.push(h(m.button, Object.assign({ key: it.id || it.label, type: 'button', className: PS.cx('ps-linkrow', p.tone === 'link' && 'is-link'), onClick: it.onClick }, PS.press()),
        it.icon ? h(PS.Icon, { name: it.icon, size: 20, color: 'primary' }) : null, h('span', { className: 'ps-linkrow__label ps-t-title-14' }, it.label),
        it.value ? h('span', { className: 'ps-t-body-md-em ps-c-link' }, it.value) : it.trail === 'none' ? null : h(PS.Icon, { name: it.trail || 'chevron-right', size: 16, color: 'tertiary' })));
    });
    return h(PS.Card, { className: PS.cx('ps-linklist', p.tall && 'ps-linklist--tall', p.className) }, p.title ? h('p', { className: 'ps-t-section-sm' }, p.title) : null, out);
  };
  /* Facts: small label over its value, with dividers (SEC registration) · rows [{ label, value }] */
  PS.Facts = function Facts(p) {
    var out = [];
    p.rows.forEach(function (r, i) {
      if (i) out.push(h(PS.Divider, { key: 'd' + i }));
      out.push(h('div', { key: i, className: 'ps-fact' }, h('p', { className: 'ps-t-caption-xs ps-c-tertiary' }, r.label), h('p', { className: 'ps-t-body-md-em' }, r.value)));
    });
    return h(PS.Card, { className: 'ps-facts' }, out);
  };
  /* ActivityItem: one line of credit history (328 × 112) · icon (28, on a 36 px tile; none for adjustments) · tone positive | brand · title · sub
     amount ('+ ₱5,000') · up (green amount) · date · note ('Available:') · noteValue ('₱5,000') */
  PS.ActivityItem = function ActivityItem(p) {
    return h(PS.Card, { className: 'ps-activity' },
      h('div', { className: 'ps-activity__top' },
        p.icon ? h('span', { className: PS.cx('ps-tile ps-tile--36', p.tone === 'positive' && 'is-positive') }, h(PS.Icon, { name: p.icon, size: 28, color: 'inverse' })) : null,
        h('div', null, h('div', { className: 'ps-activity__title' }, h('p', { className: 'ps-t-section-sm' }, p.title), h('p', { className: PS.cx('ps-activity__amt', p.up && 'is-up') }, p.amount)),
          h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.sub))),
      h(PS.Divider),
      h('div', { className: 'ps-activity__foot ps-t-caption-sm' }, h('span', null, p.date), h('span', null, p.note, ' ', h('b', null, p.noteValue))));
  };
  /* InboxItem: a message (328 × 174) · kind ('Reminder') · time ('21h ago') · unread (red dot) · title · body (two lines) · onOpen */
  PS.InboxItem = function InboxItem(p) {
    return h(PS.Card, { className: 'ps-inboxitem' },
      h('div', { className: 'ps-inboxitem__head' },
        h('div', { className: 'ps-inboxitem__meta' }, h(PS.Icon, { name: 'inbox', size: 16, color: 'secondary' }), h('span', { className: 'ps-t-title-14' }, p.kind),
          h('span', { className: 'ps-inboxitem__time ps-t-caption-sm' }, p.unread ? h('i', { 'aria-label': 'Unread' }) : null, p.time)),
        h(PS.Divider)),
      h('div', { className: 'ps-inboxitem__text' }, h('p', { className: 'ps-t-title-16' }, p.title), h('p', { className: 'ps-t-caption-sm ps-c-tertiary ps-clamp2' }, p.body)),
      h('div', { className: 'ps-inboxitem__foot' }, h(PS.Divider),
        h(m.button, Object.assign({ type: 'button', className: 'ps-inboxitem__more ps-t-title-14', onClick: p.onOpen }, PS.press()), h('span', null, 'View more'), h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }))));
  };
  /* HistoryRow: a loan in the history · amount · state review | disbursing | declined | action | paid | none · label · onClick */
  var HT = { review: 'soft', disbursing: 'positive', declined: 'muted', action: 'solid', paid: 'muted' };
  PS.HistoryRow = function HistoryRow(p) {
    return h(m.button, Object.assign({ type: 'button', className: 'ps-card ps-histrow', onClick: p.onClick }, PS.press()),
      h(PS.Amount, { value: p.amount, className: 'ps-histrow__amount' }),
      h('span', null, p.label ? h(PS.Tag, { tone: HT[p.state] || 'soft' }, p.label) : null, h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })));
  };
  /* HubCard: total credit limit with used / available · total · used · available · onWithdraw · onInfo */
  PS.HubCard = function HubCard(p) {
    var pct = Math.max(0, Math.min(1, p.used / (p.total || 1))), C = 2 * Math.PI * 8;
    return h('div', { className: 'ps-credit ps-hub' }, h('img', { className: 'ps-credit__glow', src: PS.asset('art/card-glow.svg'), alt: '' }),
      h('div', { className: 'ps-credit__top' }, h('div', { style: { flex: 1, minWidth: 0 } }, h('p', { className: 'ps-credit__label' }, 'Total credit limit'), h(PS.Amount, { value: p.total, className: 'ps-hub__amount' })),
        h(m.button, Object.assign({ type: 'button', 'aria-label': 'About your credit limit', onClick: p.onInfo, style: { height: '1.25rem' } }, PS.press(true)), h(PS.Icon, { name: 'info', size: 20, color: 'inverse', style: { opacity: 0.6 } }))),
      h('div', { className: 'ps-hub__row' },
        h('svg', { style: { width: '1.25rem', height: '1.25rem' }, viewBox: '0 0 20 20', 'aria-hidden': true }, h('circle', { cx: 10, cy: 10, r: 8, fill: 'none', stroke: 'currentColor', strokeOpacity: 0.3, strokeWidth: 3 }),
          h('circle', { cx: 10, cy: 10, r: 8, fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: C * pct + ' ' + C, transform: 'rotate(-90 10 10)' })),
        h('div', { className: 'ps-t-caption-sm' }, h('p', null, h('span', null, 'Used:'), PS.money(p.used)), h('p', null, h('span', null, 'Available:'), PS.money(p.available))),
        h(PS.Button, { variant: 'shade', className: 'ps-hub__btn', onClick: p.onWithdraw }, 'Withdraw')));
  };
  /* Tiles: picture tiles in a card (credit history) · title · items [{ id, art, label, onClick }] */
  PS.Tiles = function Tiles(p) {
    return h(PS.Card, { className: 'ps-tiles' }, h('p', { className: 'ps-t-section-sm' }, p.title),
      h('div', null, p.items.map(function (it) {
        return h(m.button, Object.assign({ key: it.id, type: 'button', className: 'ps-tilepic', onClick: it.onClick }, PS.press()), h(PS.Art, { name: it.art, ext: 'png', size: 56 }), h('span', { className: 'ps-t-caption-sm' }, it.label));
      })));
  };
  /* Tips: numbered advice (how to improve your limit) · title · items [{ title, body }] */
  PS.Tips = function Tips(p) {
    var out = [];
    p.items.forEach(function (t, i) {
      if (i) out.push(h(PS.Divider, { key: 'd' + i }));
      out.push(h('div', { key: i, className: 'ps-tip-row' }, h('b', null, i + 1), h('div', null, h('p', { className: 'ps-t-section-sm' }, t.title), h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, t.body))));
    });
    return h(PS.Card, { className: 'ps-tips' }, h('p', { className: 'ps-t-section-sm' }, p.title), out);
  };

  /* Bullets: a card of short points, each after a small grey dot (cancel a loan: "What you need to know") · items */
  PS.Bullets = function Bullets(p) {
    return h(PS.Card, { className: 'ps-bullets' }, p.items.map(function (k, i) { return h('p', { key: i, className: 'ps-t-body-md' }, h('i', null), k); }));
  };
})();
