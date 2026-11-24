/* PeraSure UI — home states: what the home page shows instead of (or next to) the credit card while an application or a loan
   is in some state, plus the offer / banner / review blocks. Needs core.js. Figma: app file barda5NcnFzxG7CHtISKsW, section Home. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;
  var FILLED = { info: 'info-filled', 'support-chat': 'support-chat-filled' };   /* the Figma "Filled" icons a bare Strip icon uses */

  /* StateCard: the brand card of an application state · title (18 / 24) · body (12 / 16, 80 %) · icon (32, left: "Application in progress")
     timer { label, value } (dark row: time remaining) · support { text, action, onClick } (divider + chat row)
     button { label, icon, onClick, tone shade | white } — always the green Primary button (Figma Home / Credit expired, Add documents: Primary
     Medium, 46 high); tone only keeps the padding: a card that ends in a shade-tone button has 12 px padding (Figma), the others 16. */
  PS.StateCard = function StateCard(p) {
    var text = h('div', { className: 'ps-state__text' }, h('p', { className: 'ps-t-title-sm' }, p.title), p.body ? h('p', { className: 'ps-t-caption-sm' }, p.body) : null);
    var white = p.button && p.button.tone === 'white';
    return h('div', { className: PS.cx('ps-credit ps-state', p.button && !white && 'ps-state--tight', p.className) },
      h('img', { className: 'ps-credit__glow', src: PS.asset('art/card-glow.svg'), alt: '' }),
      p.icon ? h('div', { className: 'ps-state__row' }, h(PS.Icon, { name: p.icon, size: 32, color: 'inverse' }), text) : text,
      p.timer ? h('div', { className: 'ps-state__timer' }, h('span', null, h(PS.Icon, { name: 'pending', size: 16, color: 'inverse' }), p.timer.label), h('b', null, p.timer.value)) : null,
      p.support ? h(R.Fragment, null, h('span', { className: 'ps-state__line', 'aria-hidden': true }),
        h('div', { className: 'ps-state__support' }, h(PS.Icon, { name: 'support-chat', size: 24, color: 'inverse' }), h('p', { className: 'ps-t-body-md' }, p.support.text),
          h(PS.Button, { variant: 'shade', className: 'ps-state__chat', onClick: p.support.onClick }, p.support.action || 'Chat'))) : null,
      p.button ? h(PS.Button, { className: 'ps-state__btn', onClick: p.button.onClick },
        p.button.icon ? h(PS.Icon, { name: p.button.icon, size: 16 }) : null, p.button.label) : null);
  };
  /* Strip: a white one-line card that leads somewhere · icon (bare, 24, Fg/Default — Figma Strip: no tile; info / support-chat use their
     Figma "Filled" versions) · tone brand | negative (negative: on a red 28 px tile)
     title + sub (loan updates: 58 px tall, radius 20) · text (one two-line text: 64 px tall, radius 24 — lg) · count (green badge) · chevron · onClick
     raised: the default shadow (on home) */
  PS.Strip = function Strip(p) {
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-strip', (p.lg || p.text) && 'ps-strip--lg', p.raised && 'ps-strip--raised', p.className), onClick: p.onClick }, PS.press()),
      p.tone === 'negative' ? h('span', { className: 'ps-tile is-negative' }, h(PS.Icon, { name: p.icon || 'info', size: 20, color: 'inverse' }))
        : h(PS.Icon, { name: FILLED[p.icon || 'info'] || p.icon, size: 24, color: 'primary', className: 'ps-strip__icon' }),
      h('span', { className: 'ps-strip__text' }, p.text ? h('span', { className: 'ps-t-title-14' }, p.text) : h(R.Fragment, null,
        h('span', { className: 'ps-t-title-14' }, p.title), p.sub ? h('span', { className: 'ps-t-caption-xs' }, p.sub) : null)),
      p.count ? h('span', { className: 'ps-strip__count' }, p.count) : null,
      p.chevron ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }) : null);
  };
  /* DotTitle: the small section title with the red dot ("More for you") */
  PS.DotTitle = function DotTitle(p) { return h('p', { className: 'ps-dottitle ps-t-section-md' }, h('i', { 'aria-hidden': true }), p.children); };
  /* OfferCard: another product offered when ours isn't available · logo (svg in assets/logos) · tag · label · value · rows [{ label, value }] · action · onClick */
  PS.OfferCard = function OfferCard(p) {
    return h(PS.Card, { className: 'ps-offer' },
      h('div', { className: 'ps-offer__head' }, h('img', { src: PS.asset('logos/' + p.logo + '.svg'), alt: p.name || '', style: { height: '1.5rem' } }), p.tag ? h(PS.Tag, { tone: 'soft' }, p.tag) : null),
      h('div', { className: 'ps-offer__value' }, h('p', { className: 'ps-t-body-md ps-c-tertiary' }, p.label), h('p', { className: 'ps-offer__num' }, p.value)),
      h(PS.Divider),
      (p.rows || []).map(function (r, i) { return h(PS.KV, { key: i, label: r.label, value: r.value }); }),
      h(PS.Button, { block: true, size: 'md', onClick: p.onClick }, p.action || 'Apply now'));
  };
  /* Banners: "More from PeraSure" — cards that scroll sideways · items [{ id, title, body, onClick }] */
  PS.Banners = function Banners(p) {
    return h('div', { className: 'ps-banners' }, p.items.map(function (b) {
      return h(m.button, Object.assign({ key: b.id, type: 'button', className: 'ps-banner', onClick: b.onClick }, PS.press()),
        h('span', { className: 'ps-t-section-md' }, b.title), b.body ? h('span', { className: 'ps-t-caption-sm ps-c-tertiary' }, b.body) : null);
    }));
  };
  /* Hero: the first home page, before there is a limit (Figma 11187:19927) · label · amount · tagline (a line break: \n) · stats [{ value, label }] · action · onClick
     Navy top (label + amount) over a white body with a 1.5 px brand line on its sides and bottom: tagline, stats on an inset panel, button. */
  PS.Hero = function Hero(p) {
    return h('div', { className: 'ps-hero' },
      h('div', { className: 'ps-hero__top' }, h('p', { className: 'ps-t-label-md' }, p.label), h(PS.Amount, { value: p.amount, dec: 0, className: 'ps-hero__amount' })),
      h('div', { className: 'ps-hero__body' }, h('p', { className: 'ps-hero__tagline ps-t-title-sm' }, p.tagline),
        h('div', { className: 'ps-hero__stats' }, p.stats.map(function (s, i) {
          return h(R.Fragment, { key: i }, i ? h(PS.Divider, { vertical: true }) : null,
            h('div', null, h('p', { className: 'ps-t-section-md' }, s.value), h('p', { className: 'ps-t-label-xs ps-c-tertiary' }, s.label)));
        })),
        h(PS.Button, { block: true, onClick: p.onClick }, p.action)));
  };
  /* Reviews: "What customers say" · title · items [{ title, text, name }] */
  PS.Reviews = function Reviews(p) {
    return h(PS.Card, { className: 'ps-reviews' }, h('span', { className: 'ps-reviews__quote', 'aria-hidden': true }),
      h('p', { className: 'ps-t-section-sm' }, p.title || 'What customers say'),
      h('div', { className: 'ps-reviews__row' }, p.items.map(function (r, i) {
        return h('div', { key: i, className: 'ps-review' },
          h('span', { className: 'ps-review__stars', 'aria-label': '5 out of 5' }, [0, 1, 2, 3, 4].map(function (k) { return h(PS.Icon, { key: k, name: 'star', size: 14 }); })),
          h('p', { className: 'ps-t-section-sm' }, r.title), h('p', { className: 'ps-t-caption-sm ps-c-secondary' }, r.text),
          h('p', { className: 'ps-review__by ps-t-caption-sm' }, h('i', { style: { '--ps-i': i } }), r.name));
      })));
  };
  /* PermissionCard: one permission and why we ask · icon (20, on a 28 px brand tile) · title · body */
  PS.PermissionCard = function PermissionCard(p) {
    return h(PS.Card, { className: 'ps-perm' },
      h('div', null, h('span', { className: 'ps-tile' }, h(PS.Icon, { name: p.icon, size: 20, color: 'inverse' })), h('p', { className: 'ps-t-section-sm' }, p.title),
        h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary', style: { transform: 'rotate(-90deg)' } })),
      h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.body));
  };
})();
