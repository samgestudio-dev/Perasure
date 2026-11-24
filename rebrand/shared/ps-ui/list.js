/* PeraSure UI — lists: link rows, labelled facts, activity and inbox items, history rows, the credit hub card, tips.
   Needs core.js. Figma: app file barda5NcnFzxG7CHtISKsW, sections Account, inbox, Loan history. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* ListItem (spec rebrand/spec/ListItem.md, Figma 11025:971): one row of a list inside a card · tone default | brand (help topics, page
     links) · title (string or node: search results mark the typed letters) · subtitle · icon (leading, 24) or logo (assets/logos/pay-<logo>.png,
     or a URL; never recoloured) · tag { label, tone } (Small · Subtle, accent by default) · value (green, instead of the chevron) · trail
     (chevron-right | link | copy | none) · divider (true; off on the last row) · disabled · state pressed (gallery) · onClick. 48 min. */
  PS.ListItem = function ListItem(p) {
    var off = p.disabled || p.state === 'disabled', trail = p.trail || (p.value ? 'none' : 'chevron-right'), tap = !!p.onClick && !off;
    var logo = p.logo ? (/[\/.]/.test(p.logo) ? p.logo : PS.asset('logos/pay-' + p.logo + '.png')) : null;
    return h(tap ? m.button : 'div', Object.assign({ className: PS.cx('ps-li', p.tone === 'brand' && 'ps-li--brand', off && 'is-disabled', p.state === 'pressed' && 'is-pressed', p.divider === false && 'no-divider', p.className) },
        tap ? Object.assign({ type: 'button', onClick: p.onClick }, PS.press()) : {}),
      h('span', { className: 'ps-li__main' },
        logo ? h('img', { className: 'ps-li__lead', src: logo, alt: '' }) : p.icon ? h(PS.Icon, { name: p.icon, size: 24, color: 'primary', className: 'ps-li__lead' }) : null,
        h('span', { className: 'ps-li__text' },
          h('span', { className: PS.cx('ps-li__title', p.tone === 'brand' ? 'ps-text-body-md' : 'ps-text-body-md-strong') }, p.title),
          p.subtitle ? h('span', { className: 'ps-li__sub ps-text-body-sm' }, p.subtitle) : null),
        p.tag ? h(PS.Tag, { tone: p.tag.tone || 'accent', emphasis: 'subtle', size: 'small' }, p.tag.label) : null,
        p.value ? h('span', { className: 'ps-li__value ps-text-body-md-strong' }, p.value) : null,
        trail !== 'none' ? h(PS.Icon, { name: trail, size: 16, color: 'tertiary', className: 'ps-li__trail' }) : null));
  };
  /* List: the white card a group of ListItems sits in (radius 24, 4 top / bottom) · title (an optional caption above the rows) · children */
  PS.List = function List(p) {
    return h('div', { className: PS.cx('ps-list', p.className), style: p.style }, p.title ? h('p', { className: 'ps-list__title ps-text-body-sm' }, p.title) : null, p.children);
  };

  /* LinkList: a card of rows that lead somewhere · tall (22 px rows: the help topics and articles, DS 5453:4712) · title · items [{ id, label, icon (20), value, trail (icon instead of the chevron, e.g. 'link': opens outside the app; 'none': nothing), onClick }] · tone link (brand labels, regular) | plain (Hanken medium) */
  /* LinkRow (spec LinkRow 11157:4380 = legacy Contact list 6156:12996 · About Perasure list 6167:12859 · FAQs secondary list 6126:13417): one row
     of a link list and the line under it (36; tall 38; last: no line) · kind contact (icon + label + value) | link (brand label) | plain · label · icon ·
     value · trail (icon instead of the chevron; 'none') · tall (22 px rows) · last · onClick */
  PS.LinkRow = function LinkRow(p) {
    return h('div', { className: 'ps-partrow' }, h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-linkrow', p.kind === 'link' && 'is-link', p.tall && 'is-tall'), onClick: p.onClick }, PS.press()),
      p.icon ? h(PS.Icon, { name: p.icon, size: 20, color: 'primary' }) : null, h('span', { className: 'ps-linkrow__label ps-text-body-md-strong' }, p.label),
      p.value ? h('span', { className: 'ps-text-body-md-strong ps-c-link' }, p.value) : null,
      p.trail === 'none' || (p.kind === 'contact' && !p.trail) ? null :   /* contact rows: no chevron (legacy screen 6156:12848; the Figma LinkRow Contact variant draws one → figma-lib) */
        h(PS.Icon, { name: p.trail || 'chevron-right', size: 16, color: 'tertiary' })),
      p.last ? null : h(PS.Divider));
  };
  PS.LinkList = function LinkList(p) {   /* phase 1: the legacy link rows (restored from the ListItem rebuild) */
    var n = p.items.length, out = p.items.map(function (it, i) {
      return h(PS.LinkRow, Object.assign({ key: it.id || it.label, kind: p.tone === 'link' ? 'link' : it.value ? 'contact' : 'plain', tall: p.tall, last: i === n - 1 }, it));
    });
    return h(PS.Card, { className: PS.cx('ps-linklist', p.tall && 'ps-linklist--tall', p.className) }, p.title ? h('p', { className: 'ps-text-label-md' }, p.title) : null, out);
  };
  /* Facts: small label over its value, with dividers (SEC registration) · rows [{ label, value }] */
  PS.Facts = function Facts(p) {   /* phase 1: the legacy fact rows (restored from the stacked-KV rebuild) */
    var out = [];
    p.rows.forEach(function (r, i) {
      if (i) out.push(h(PS.Divider, { key: 'd' + i }));
      out.push(h('div', { key: i, className: 'ps-fact' }, h('p', { className: 'ps-text-body-xs ps-c-tertiary' }, r.label), h('p', { className: 'ps-text-body-md-strong' }, r.value)));
    });
    return h(PS.Card, { className: 'ps-facts' }, out);
  };
  /* ActivityItem: one line of credit history (328 × 112) · icon (28, on a 36 px tile; none for adjustments) · tone positive | brand · title · sub
     amount ('+ ₱5,000') · up (green amount) · date · note ('Available:') · noteValue ('₱5,000') */
  PS.ActivityItem = function ActivityItem(p) {
    return h(PS.Card, { className: 'ps-activity' },
      h('div', { className: 'ps-activity__top' },
        p.icon ? h('span', { className: PS.cx('ps-tile ps-tile--36', p.tone === 'positive' ? 'is-muted' : 'is-positive') }, h(PS.Icon, { name: p.icon, size: 28, color: p.tone === 'positive' ? 'inverse' : 'on-action' })) : null,   /* BRIEF 28: repayment (tone positive) = Bg/Brand/Muted + white icon; loan = green + navy icon */
        h('div', null, h('div', { className: 'ps-activity__title' }, h('p', { className: 'ps-text-label-md' }, p.title), h('p', { className: PS.cx('ps-activity__amt', p.up && 'is-up') }, p.amount)),
          h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, p.sub))),
      h(PS.Divider),
      h('div', { className: 'ps-activity__foot ps-text-body-sm' }, h('span', null, p.date), h('span', null, p.note, ' ', h('b', null, p.noteValue))));
  };
  /* InboxItem (spec rebrand/spec/InboxItem.md, Figma 11043:1798): one notification, calm and useful — title = the fact (amount · status · date),
     body = the next step (two lines at most), overdue: only the title is red · kind · time · unread (green dot) · tone default | overdue · title
     · body · action ('View details') · onOpen (the whole card) */
  PS.InboxItem = function InboxItem(p) {
    /* phase 1: the legacy card (head · line · text · line · "View more" row); owner copy (title = the fact, body = the next step, action) kept */
    return h(PS.Card, { className: PS.cx('ps-inboxitem', p.tone === 'overdue' && 'is-overdue') },
      h('div', { className: 'ps-inboxitem__head' },
        h('div', { className: 'ps-inboxitem__meta' }, h(PS.Icon, { name: 'inbox', size: 16, color: 'secondary' }), h('span', { className: 'ps-text-body-md-strong' }, p.kind),
          h('span', { className: 'ps-inboxitem__time ps-text-body-sm' }, p.unread ? h('i', { 'aria-label': 'Unread' }) : null, p.time)),
        h(PS.Divider)),
      h('div', { className: 'ps-inboxitem__text' },
        h('div', { className: 'ps-inboxitem__title' }, h('p', { className: 'ps-text-title-xs' }, p.title),
          p.tone === 'overdue' ? h(PS.Tag, { tone: 'negative', emphasis: 'strong', size: 'small' }, p.tag || 'Overdue') : null),   /* legacy 8620:34504: the red Overdue tag beside the title (176) */
        h('p', { className: 'ps-text-body-sm ps-c-tertiary ps-clamp2' }, p.body)),
      h('div', { className: 'ps-inboxitem__foot' }, h(PS.Divider),
        h(m.button, Object.assign({ type: 'button', className: 'ps-inboxitem__more ps-text-body-md-strong', onClick: p.onOpen }, PS.press()), h('span', null, p.action || 'View more'), h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }))));
  };

  /* LoanHistoryItem (spec LoanHistoryItem 11259:22291 = legacy Installment 6619:22073): one loan of the history on a card (328 × 56) — the amount
     (Title/sm), a tag, the chevron · kind state (the loan's state tag) | history (the term tag "12 terms", Small Navy Subtle) · amount · state review |
     disbursing | declined | action | paid | none · label · term · onClick. State tags (legacy State tag 6619:22092): Reviewing Navy Subtle ·
     Disbursing Accent Strong · Not approved / Paid off Neutral Subtle · Action needed Navy Strong */
  var HT = { review: ['navy', 'subtle'], disbursing: ['accent', 'strong'], declined: ['neutral', 'subtle'], action: ['navy', 'strong'], paid: ['neutral', 'subtle'] };
  PS.LoanHistoryItem = function LoanHistoryItem(p) {
    var t = HT[p.state], tag = p.kind === 'history' ? (p.term ? h(PS.Tag, { tone: 'navy', emphasis: 'subtle', size: 'small' }, p.term) : null)
      : p.label && t ? h(PS.Tag, { tone: t[0], emphasis: t[1] }, p.label) : null;
    return h(m.button, Object.assign({ type: 'button', className: 'ps-card ps-histrow', onClick: p.onClick }, PS.press()),
      h(PS.Amount, { value: p.amount, className: 'ps-histrow__amount' }),
      h('span', null, tag, h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })));
  };
  /* HistoryRow: the older name (kind state) */
  PS.HistoryRow = function HistoryRow(p) { return h(PS.LoanHistoryItem, Object.assign({ kind: 'state' }, p)); };
  /* HubCard: total credit limit with used / available · total · used · available · onWithdraw · onInfo */
  PS.HubCard = function HubCard(p) {
    var pct = Math.max(0, Math.min(1, p.used / (p.total || 1))), C = 2 * Math.PI * 8;
    return h('div', { className: 'ps-credit ps-hub' }, h('img', { className: 'ps-credit__glow', src: PS.asset('art/card-glow.svg'), alt: '' }),
      h('div', { className: 'ps-credit__top' }, h('div', { style: { flex: 1, minWidth: 0 } }, h('p', { className: 'ps-credit__label' }, 'Total credit limit'), h(PS.Amount, { value: p.total, className: 'ps-hub__amount' })),
        h(m.button, Object.assign({ type: 'button', 'aria-label': 'About your credit limit', onClick: p.onInfo, style: { height: '1.25rem' } }, PS.press(true)), h(PS.Icon, { name: 'info', size: 20, color: 'inverse', style: { opacity: 0.6 } }))),
      h('div', { className: 'ps-hub__row' },
        h('svg', { style: { width: '1.25rem', height: '1.25rem' }, viewBox: '0 0 20 20', 'aria-hidden': true }, h('circle', { cx: 10, cy: 10, r: 8, fill: 'none', stroke: 'var(--bg-on-brand)', strokeWidth: 3 }),   /* BRIEF 16: the ring's track */
          h('circle', { cx: 10, cy: 10, r: 8, fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: C * pct + ' ' + C, transform: 'rotate(-90 10 10)' })),
        h('div', { className: 'ps-text-body-sm' }, h('p', null, h('span', null, 'Used:'), PS.money(p.used)), h('p', null, h('span', null, 'Available:'), PS.money(p.available))),
        h(PS.Button, { variant: 'shade', className: 'ps-hub__btn', onClick: p.onWithdraw }, 'Withdraw')));
  };
  /* Tiles: picture tiles in a card (credit history) · title · items [{ id, art, label, onClick }] */
  PS.Tiles = function Tiles(p) {
    if (p.empty) return h(PS.Card, { className: 'ps-tiles' }, h('p', { className: 'ps-text-label-md' }, p.title),   /* empty: the informational panel (legacy 3525:949, BRIEF 27) */
      h('div', { className: 'ps-tiles__empty' }, h(PS.Icon, { name: p.empty.icon || 'clock', size: 32, color: 'var(--content-accent-strong)' }),
        h('p', { className: 'ps-text-body-md-strong' }, p.empty.title), p.empty.body ? h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, p.empty.body) : null));
    return h(PS.Card, { className: 'ps-tiles' }, h('p', { className: 'ps-text-label-md' }, p.title),
      h('div', null, p.items.map(function (it) {
        return h(m.button, Object.assign({ key: it.id, type: 'button', className: 'ps-tilepic', onClick: it.onClick }, PS.press()), h(PS.Art, { name: it.art, ext: 'png', size: 56 }), h('span', { className: 'ps-text-body-sm' }, it.label));
      })));
  };
  /* Tips: numbered advice (how to improve your limit) · title · items [{ title, body }] */
  PS.Tips = function Tips(p) {
    var out = [];
    p.items.forEach(function (t, i) {
      if (i) out.push(h(PS.Divider, { key: 'd' + i }));
      out.push(h('div', { key: i, className: 'ps-tip-row' }, h('b', null, i + 1), h('div', null, h('p', { className: 'ps-text-label-md' }, t.title), h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, t.body))));
    });
    return h(PS.Card, { className: 'ps-tips' }, h('p', { className: 'ps-text-label-md' }, p.title), out);
  };

  /* Bullets: a card of short points, each after a small grey dot (cancel a loan: "What you need to know") · items */
  PS.Bullets = function Bullets(p) {
    return h(PS.Card, { className: 'ps-bullets' }, p.items.map(function (k, i) { return h('p', { key: i, className: 'ps-text-body-md' }, h('i', null), k); }));
  };
})();
