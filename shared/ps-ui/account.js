/* PeraSure UI — account page: profile header, credit limit card, menu list, social links. Needs core.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* Profile: initials circle + name + verified mark · initials · name · verified */
  PS.Profile = function Profile(p) {
    return h('div', { className: 'ps-profile' },
      h('div', { className: 'ps-profile__avatar ps-t-headline-sm' }, p.initials),
      h('div', { className: 'ps-profile__name' }, h('p', { className: 'ps-t-display-sm' }, p.name),
        p.verified ? h('img', { src: PS.asset('art/verified.svg'), alt: 'Verified' }) : null));
  };

  /* CreditLimitCard: total and available credit · total · available · onClick · title ('Credit limit') */
  PS.CreditLimitCard = function CreditLimitCard(p) {
    return h(PS.Card, null,
      h(m.button, { type: 'button', className: 'ps-limit__head', onClick: p.onClick, whileTap: PS.TAP, transition: PS.MT.PRESS },
        h('span', null, h('span', { className: 'ps-limit__icon' }, h(PS.Icon, { name: 'wallet', size: 21.78 })), h('span', { className: 'ps-t-section-sm' }, p.title || 'Credit limit')),
        h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })),
      h('div', { className: 'ps-limit__nums ps-inset' },
        h('div', null, h('p', { className: 'ps-num' }, PS.money(p.total)), h('p', { className: 'ps-t-section-xs ps-c-tertiary' }, 'Total credit')),
        h(PS.Divider, { vertical: true }),
        h('div', null, h('p', { className: 'ps-num' }, PS.money(p.available)), h('p', { className: 'ps-t-section-xs ps-c-tertiary' }, 'Available credit'))));
  };

  /* Menu: list of rows in a card · items [{ id, icon, label, badge, onClick }] (badge: a solid brand tag, e.g. 'New', '6 coupons') */
  PS.Menu = function Menu(p) {
    return h(PS.Card, { className: 'ps-menu' }, p.items.map(function (it) {
      return h(m.button, { key: it.id || it.label, type: 'button', className: 'ps-menu__item', onClick: it.onClick, whileTap: PS.TAP, transition: PS.MT.PRESS },
        h('span', null, h(PS.Icon, { name: it.icon, size: 20, color: 'primary' }), h('span', { className: 'ps-t-body-md' }, it.label)),
        h('span', null, it.badge ? h(PS.Swap, { k: it.badge }, h(PS.Tag, { tone: 'solid' }, it.badge)) : null, h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })));
    }));
  };

  /* Social: "Social media" links · title · items [{ id, label, logo (assets/logos file) }] */
  PS.Social = function Social(p) {
    var items = p.items || [{ id: 'ig', label: 'Instagram', logo: 'instagram' }, { id: 'tt', label: 'TikTok', logo: 'tiktok' }, { id: 'fb', label: 'Facebook', logo: 'facebook' }];
    return h(PS.Card, null, h('p', { className: 'ps-t-section-sm' }, p.title || 'Social media'),
      h('div', { className: 'ps-social__row' }, items.map(function (it) {
        return h(m.button, { key: it.id, type: 'button', className: 'ps-social__item', whileTap: PS.TAP, transition: PS.MT.PRESS, onClick: it.onClick },
          h('span', null, h('img', { src: PS.asset('logos/' + it.logo + '.svg'), alt: '' })), h('span', { className: 'ps-t-caption-sm' }, it.label));
      })));
  };
})();
