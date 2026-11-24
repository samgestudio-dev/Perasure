/* PeraSure UI — account page: profile header, credit limit card, menu list, social links. Needs core.js. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* Profile: initials circle + name + verified mark · initials · name · verified · icon (36 px, instead of initials: not signed in) */
  /* VerifiedBadge (spec VerifiedBadge 11156:5431 = legacy Extra Documents Verified 3651:1460): the star with a tick beside a verified name (16) */
  PS.VerifiedBadge = function VerifiedBadge(p) { return h('img', { className: PS.cx('ps-verified', p.className), src: PS.asset('art/verified.svg'), alt: 'Verified' }); };
  PS.Profile = function Profile(p) {
    return h('div', { className: 'ps-profile' },
      h('div', { className: 'ps-profile__avatar ps-text-headline-sm' }, p.icon ? h(PS.Icon, { name: p.icon, size: 36, color: 'secondary' }) : p.initials),
      h('div', { className: 'ps-profile__name' }, h('p', { className: 'ps-text-display-sm' }, p.name),
        p.verified ? h(PS.VerifiedBadge) : null));
  };

  /* CreditLimitCard: total and available credit · total · available · onClick · title ('Credit limit') · masked (₱*****: not signed in) */
  PS.CreditLimitCard = function CreditLimitCard(p) {
    return h(PS.Card, null,
      h(m.button, { type: 'button', className: 'ps-limit__head', onClick: p.onClick, whileTap: PS.TAP, transition: PS.MT.PRESS },
        h('span', null, h(PS.RowIcon, { name: 'wallet' }), h('span', { className: 'ps-text-label-md' }, p.title || 'Credit limit')),   /* BRIEF 22: no tile */
        h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })),
      h('div', { className: 'ps-limit__nums ps-inset' },
        h('div', null, h('p', { className: 'ps-num' }, p.masked ? '₱*****' : PS.money(p.total)), h('p', { className: 'ps-text-caption-xs ps-c-tertiary' }, 'Total credit')),
        h(PS.Divider, { vertical: true }),
        h('div', null, h('p', { className: 'ps-num' }, p.masked ? '₱*****' : PS.money(p.available)), h('p', { className: 'ps-text-caption-xs ps-c-tertiary' }, 'Available credit'))));
  };

  /* Menu: list of rows in a card · items [{ id, icon, label, badge, onClick }] (badge: a solid brand tag, e.g. 'New', '6 coupons') */
  PS.Menu = function Menu(p) {
    return h(PS.Card, { className: 'ps-menu' }, p.items.map(function (it) {
      return h(m.button, { key: it.id || it.label, type: 'button', className: 'ps-menu__item', onClick: it.onClick, whileTap: PS.TAP, transition: PS.MT.PRESS },
        h('span', null, h(PS.Icon, { name: it.icon, size: 20, color: 'primary' }), h('span', { className: 'ps-text-body-md' }, it.label)),
        h('span', null, it.badge ? h(PS.Swap, { k: it.badge }, h(PS.Tag, { tone: 'solid' }, it.badge)) : null, h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' })));
    }));
  };

  /* Social: "Social media" links · title · items [{ id, label, logo (assets/logos file) }] */
  PS.Social = function Social(p) {
    var items = p.items || [{ id: 'ig', label: 'Instagram', logo: 'instagram' }, { id: 'tt', label: 'TikTok', logo: 'tiktok' }, { id: 'fb', label: 'Facebook', logo: 'facebook' }];
    return h(PS.Card, null, h('p', { className: 'ps-text-label-md' }, p.title || 'Social media'),
      h('div', { className: 'ps-social__row' }, items.map(function (it) {
        return h(m.button, { key: it.id, type: 'button', className: 'ps-social__item', whileTap: PS.TAP, transition: PS.MT.PRESS, onClick: it.onClick },
          h('span', null, h('img', { src: PS.asset('logos/' + it.logo + '.svg'), alt: '' })), h('span', { className: 'ps-text-body-sm' }, it.label));
      })));
  };

  /* GuestProfile: the Account tab when not signed in — "Hello!" with the person mark, and Sign up or log in · onLogin */
  PS.GuestProfile = function GuestProfile(p) {
    return h('div', { className: 'ps-guest' }, h(PS.Profile, { icon: 'user', name: 'Hello!' }), h(PS.Button, { size: 'md', block: true, onClick: p.onLogin }, 'Sign up or log in'));
  };
  /* AboutHead: the app icon (64, Figma 52:4640), the name and the version · name · version */
  PS.AboutHead = function AboutHead(p) {
    return h('div', { className: 'ps-about' }, h('span', { className: 'ps-brand__mark ps-about__logo' }, h('img', { src: PS.asset('logos/perasure-mark.svg'), alt: '' })),
      h('p', { className: 'ps-text-title-sm' }, p.name || 'PeraSure'), h('p', { className: 'ps-text-body-sm ps-c-secondary' }, p.version));
  };
  /* FooterMark: the grey PeraSure mark and a line at the bottom of a page (About) · children (the line) */
  PS.FooterMark = function FooterMark(p) {
    return h('p', { className: 'ps-text-body-sm ps-foot' }, h('span', null, h('i', { 'aria-hidden': true }), 'PeraSure'), p.children);
  };
  /* RegCard: a registration card, centred (SEC: the company's name and a line; BIR: the badge with its QR code and a line) · title · img · alt · body */
  PS.RegCard = function RegCard(p) {
    return h(PS.Card, { className: PS.cx('ps-regcard', p.img && 'ps-regcard--img') },
      p.img ? h('img', { src: p.img, alt: p.alt || '' }) : h('p', { className: 'ps-text-body-lg', style: { fontWeight: 600 } }, p.title),
      h('p', { className: p.img ? 'ps-text-body-xs ps-c-tertiary' : 'ps-text-body-sm ps-c-tertiary' }, p.body));
  };
  /* Message: an inbox message — its kind and time over the card with the title and the text · kind · time · title · body */
  PS.Message = function Message(p) {
    return h('div', { className: 'ps-message' }, h('div', { className: 'ps-message__meta ps-text-body-xs ps-c-tertiary' }, h('span', null, String(p.kind).toUpperCase()), h('span', null, p.time)),
      h(PS.Card, null, h('p', { className: 'ps-text-title-md' }, p.title), h('p', { className: 'ps-text-body-md ps-c-secondary' }, p.body)));
  };
  /* Rating: "How was your experience with PeraSure?" in a card sheet (className 'ps-rating'; Figma 52:13419 / 13695 / 13922) — ask, then a
     thank-you that sends good ratings to the store and the others to support. The three steps lie on top of each other, so the sheet keeps
     the tallest one's height and nothing jumps (owner); the step shown crossfades in (ENTER, 3 px blur), the one before it out (LEAVE), and the
     title and the buttons swap their words the same way. step ask | good | bad · onOk (Satisfied / Leave a review / Contact customer
     support) · onNo (Not satisfied / Later) · onClose */
  /* legacy 9337:18620 / 9337:19180: no heading beside the close in any step (the positive step's title already thanks) */
  var RATE = {
    ask: { anim: 'doc-verify', title: 'How was your experience with PeraSure?', ok: 'Satisfied', no: 'Not satisfied' },
    good: { stars: true, title: 'Thank you for your feedback!', body: 'Share your experience with PeraSure by leaving a review on Google Play.', ok: 'Leave a review', no: 'Later' },
    bad: { anim: 'customer-service-chat', title: 'Help us improve PeraSure', body: 'Share your concerns with our online customer service. We’ll get back to you soon.', ok: 'Contact customer support', no: 'Later' } };
  PS.Rating = function Rating(p) {
    var step = RATE[p.step] ? p.step : 'ask', P = RATE[step];
    var all = ['ask', 'good', 'bad'].map(function (k) {
      var Q = RATE[k], on = k === step;
      return h(m.div, { key: k, className: PS.cx('ps-rating__page', k === 'ask' && 'is-ask'), 'aria-hidden': !on, initial: false,
        animate: on ? { opacity: 1, filter: 'blur(0px)', transition: PS.MT.ENTER } : { opacity: 0, filter: 'blur(' + PS.MT.BLUR + 'px)', transition: PS.MT.LEAVE },
        style: { gridArea: '1 / 1', pointerEvents: on ? 'auto' : 'none' } },
        Q.stars ? h('img', { src: PS.asset('art/stars.svg'), alt: '5 stars', style: { width: '9.25rem', height: '1.75rem' } }) : h(PS.Anim, { name: Q.anim, size: 100 }),
        h('div', null, h('p', { className: 'ps-text-title-sm' }, Q.title), Q.body ? h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, Q.body) : null));
    });
    return h(R.Fragment, null,
      h(PS.SheetHead, { align: 'left', onClose: p.onClose }, h(PS.Swap, { k: step, block: true }, h('span', { className: 'ps-text-title-xs' }, P.head || ''))),
      h('div', { className: 'ps-rating__pages' }, all),
      h('div', { className: 'ps-rating__acts' }, h(PS.Button, { block: true, onClick: p.onOk }, h(PS.Swap, { k: step }, h('span', null, P.ok))),
        h(PS.Button, { variant: 'text', block: true, onClick: p.onNo }, h(PS.Swap, { k: step }, h('span', null, P.no)))));
  };
})();
