/* PeraSure UI — repayments: the installment card, the total bar, the scam strip, the repayment card (amount + how to pay),
   the QR panel, an accordion and the method picker. Needs core.js. Figma: app file barda5NcnFzxG7CHtISKsW, section Payment. */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* ScamStrip: the info line under the header (blue scale: Bg/Info-muted, Fg/Info-strong); the text runs sideways when it doesn't fit · children · onClick */
  PS.ScamStrip = function ScamStrip(p) {
    return h(m.button, Object.assign({ type: 'button', className: 'ps-scamstrip', onClick: p.onClick }, PS.press()),
      h(PS.Icon, { name: 'info', size: 16 }), h('span', { className: 'ps-scamstrip__clip' }, h('span', { className: 'ps-scamstrip__run ps-t-caption-sm' }, p.children)));
  };
  /* Installment: one repayment (328 × 114) · month ('JAN') · day ('15') · amount · sub ('Overdue 18 days') · tone negative | brand (date tile and sub)
     on (ticked: part of what is paid now) · onToggle · note (footer line) · noteIcon (12 px) · onDetail */
  PS.Installment = function Installment(p) {
    /* tone: default (grey date) · brand (due today: blue) · negative (overdue: red) — Figma 10534:35615 */
    return h(PS.Card, { className: PS.cx('ps-inst', p.tone === 'negative' && 'is-negative', p.tone === 'brand' && 'is-brand') },
      h(m.button, Object.assign({ type: 'button', role: 'checkbox', 'aria-checked': !!p.on, className: 'ps-inst__top', onClick: p.onToggle }, PS.press()),
        h('span', { className: 'ps-inst__date' }, h('span', null, p.month), h('b', null, p.day)),
        h('span', { className: 'ps-inst__main' }, h(PS.Amount, { value: p.amount, className: 'ps-inst__amount' }), h('span', { className: 'ps-inst__sub' }, p.sub)),
        h(PS.Check, { on: p.on, off: !p.on })),
      h(PS.Divider),
      h('div', { className: 'ps-inst__foot' }, h('i', null, h(PS.Icon, { name: p.noteIcon || 'alert-circle', size: 12, color: 'tertiary' })), h('span', { className: 'ps-t-caption-xs ps-c-tertiary' }, p.note),
        h(PS.Link, { onClick: p.onDetail, className: 'ps-inst__detail' }, 'Detail', h(PS.Icon, { name: 'chevron-right', size: 12 }))));
  };
  /* PayBar: the total above the tab bar · label · total · was · action ('Repay') · onPay · disabled */
  PS.PayBar = function PayBar(p) {
    return h('div', { className: 'ps-paybar' }, h('div', null, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.label || 'TOTAL REPAYMENT AMOUNT'),
        h('p', { className: 'ps-paybar__amt' }, h(PS.Amount, { value: p.total }), p.was != null ? h(PS.Amount, { value: p.was, strike: true }) : null)),
      h(PS.Button, { size: 'sm', disabled: p.disabled, onClick: p.onPay }, p.action || 'Repay'));
  };
  /* RepayCard: what to pay · amount · due ('December 12, 2026') · onCopy · children (how: a button, the reference rows, a QR panel) */
  PS.RepayCard = function RepayCard(p) {
    return h(PS.Card, { className: 'ps-repay' },
      h('div', { className: 'ps-repay__head' }, h(PS.Amount, { value: p.amount, className: 'ps-repay__amount' }), h(PS.Button, { variant: 'outline', onClick: p.onCopy }, 'Copy')),
      h('p', { className: 'ps-t-body-md ps-repay__due' }, 'Due date: ' + p.due), p.children);
  };
  /* InsetRows: label / value rows on the grey inset (payment number, sender) · rows [{ label, value }] */
  PS.InsetRows = function InsetRows(p) {
    return h('div', { className: 'ps-insetrows' }, p.rows.map(function (r, i) {
      return h(R.Fragment, { key: i }, i ? h(PS.Divider) : null, h(PS.KV, { label: r.label, value: r.value }));
    }));
  };
  /* Countdown line: "Please complete your repayment in 04:59." · seconds */
  PS.PayTimer = function PayTimer(p) {
    var s = R.useState(p.seconds || 299), left = s[0];
    R.useEffect(function () { if (left <= 0) return; var t = setTimeout(function () { s[1](left - 1); }, 1000); return function () { clearTimeout(t); }; }, [left]);
    var mm = Math.floor(left / 60), ss = left % 60;
    return h('p', { className: 'ps-t-caption-sm ps-c-tertiary ps-paytimer' }, 'Please complete your repayment in ', h('b', null, (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss), '.');
  };
  /* QrPanel: the brand panel with the QR · title · merchant · onSave */
  PS.QrPanel = function QrPanel(p) {
    return h('div', { className: 'ps-qr' }, h('div', { className: 'ps-qr__head ps-t-body-md-em' }, h('span', null, p.title || 'Pay to Merchant'), h('b', null, p.merchant)),
      h('div', { className: 'ps-qr__code' }, h('img', { src: PS.asset('art/qr.png'), alt: 'QR code' })),
      h(PS.Button, { variant: 'plain', size: 'md', className: 'ps-qr__save', onClick: p.onSave }, 'Save QR code'));
  };
  /* Accordion: a card that opens · title · open (first state) · small (the 14 px quiet one, DS 9224:37691) · icon (a 28 px brand tile before the title) · children */
  /* (small: the application's reminder, DS 9224:37691 — 12 / 16 padding, the title in Label/md-light Neutral/600, the text in Caption/sm, 12 apart) */
  PS.Accordion = function Accordion(p) {
    var s = R.useState(!!p.open), open = s[0];
    return h(PS.Card, { className: PS.cx('ps-acc', p.small && 'ps-acc--small') },
      h(m.button, Object.assign({ type: 'button', className: 'ps-acc__head', 'aria-expanded': open, onClick: function () { s[1](!open); } }, PS.press()),
        h('span', { className: p.small ? 'ps-t-label-md-light' : 'ps-t-body-md-em' }, p.icon ? h('span', { className: 'ps-acc__lead' }, h('span', { className: 'ps-tile' }, h(PS.Icon, { name: p.icon, size: 20, color: 'inverse' })), p.title) : p.title),
        h(m.span, { style: { display: 'flex' }, initial: false, animate: { rotate: open ? -90 : 90 }, transition: MT.SPRING }, h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }))),
      h(AP, { initial: false }, open ? h(m.div, { key: 'b', className: 'ps-acc__body', initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1, transition: { height: MT.SPRING, opacity: MT.ENTER } },
        exit: { height: 0, opacity: 0, transition: { height: MT.SPRING, opacity: MT.LEAVE } } }, h('div', { className: PS.cx('ps-acc__in ps-c-tertiary', p.small ? 'ps-t-caption-sm' : 'ps-t-body-md') }, p.children)) : null));
  };
  /* MethodPicker: ways to pay (Figma DS 7792:15391) — the categories on a grey rail, every category's groups in ONE list that scrolls; the rail
     follows the list (the category on screen is the one marked) and a tap on the rail glides the list to it on the Smooth spring. The white
     mark moves between rail items (layoutId); colours change in 150 ms.
     cats [{ id, icon, label, groups: [{ title, tag, items: [{ id, name }] }] }] · value (cat) · onCat · onPick(item) · scroller (the element
     that scrolls the list: the sheet's body; default the picker's own list) · q (search text: the rail keeps every category, the list keeps
     its groups with only the matching rows — groups with none drop out — and the typed part in Fg/Accent, Figma Payment / Methods / Popover search active) */
  PS.MethodPicker = function MethodPicker(p) {
    var list = R.useRef(null), anchors = R.useRef({}), gliding = R.useRef(null), cat = p.cats.filter(function (c) { return c.id === p.value; })[0] || p.cats[0];
    function scroller() { return (p.scroller && p.scroller.current) || list.current; }
    /* the rail follows the list: the last category whose first group has reached the top of the list */
    R.useEffect(function () {
      var sc = scroller(); if (!sc) return;
      function spy() {
        if (gliding.current) return;
        var top = sc.getBoundingClientRect().top + 8, on = p.cats[0] && p.cats[0].id;
        p.cats.forEach(function (c) { var el = anchors.current[c.id]; if (el && el.getBoundingClientRect().top <= top + 1) on = c.id; });
        if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 && p.cats.length) on = p.cats[p.cats.length - 1].id;   /* the end: the last one */
        if (on && on !== p.value) p.onCat(on);
      }
      sc.addEventListener('scroll', spy, { passive: true });
      return function () { sc.removeEventListener('scroll', spy); };
    }, [p.cats, p.value]);
    function go(c) {
      var sc = scroller(), el = anchors.current[c.id]; p.onCat(c.id); if (!sc || !el) return;
      var to = Math.min(sc.scrollHeight - sc.clientHeight, sc.scrollTop + el.getBoundingClientRect().top - sc.getBoundingClientRect().top - (p.offset || 0));
      if (gliding.current) gliding.current.stop();
      var Mo = window.Motion; if (PS.reduce || !Mo || !Mo.animate) { sc.scrollTop = to; return; }
      gliding.current = Mo.animate(sc.scrollTop, to, Object.assign({}, MT.SPRING, { restDelta: 0.5, onUpdate: function (v) { sc.scrollTop = v; },
        onComplete: function () { gliding.current = null; } }));
    }
    return h('div', { className: 'ps-mpick' },
      h('div', { className: 'ps-mpick__rail', role: 'tablist' }, p.cats.map(function (c) {
        var on = c === cat;
        return h('button', { key: c.id, type: 'button', role: 'tab', 'aria-selected': on, className: PS.cx('ps-mpick__cat', on && 'is-on'), onClick: function () { go(c); } },
          on ? h(m.span, { layoutId: 'ps-mpick-mark', className: 'ps-mpick__mark', transition: MT.SPRING }) : null,
          h(PS.Icon, { name: c.icon, size: 24 }), h('span', null, c.label));
      })),
      h('div', { ref: list, className: 'ps-mpick__list' }, p.cats.map(function (c) {
        var k = (p.q || '').trim().toLowerCase();
        var groups = !k ? c.groups : c.groups.map(function (g) { return Object.assign({}, g, { items: g.items.filter(function (it) { return it.name.toLowerCase().indexOf(k) >= 0; }) }); })
          .filter(function (g) { return g.items.length; });
        return h('div', { key: c.id, className: 'ps-mpick__cat-groups', ref: function (n) { anchors.current[c.id] = n; } }, groups.map(function (g, i) {
          return h('div', { key: i, className: 'ps-mpick__group' },
            h('div', { className: 'ps-mpick__title' }, h('span', { className: 'ps-t-section-sm-light' }, g.title), g.tag ? h(PS.Tag, { tone: 'positive' }, g.tag) : null),
            h('div', { className: 'ps-mpick__rows' }, g.items.map(function (it) {
              return h(m.button, Object.assign({ key: it.id, type: 'button', className: 'ps-mpick__row ps-t-body-md-em', onClick: function () { p.onPick(it, c); } }, PS.press()), h('span', null, PS.mark(it.name, k)),
                h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }));
            })));
        }));
      })));
  };

  /* Pager: the dots under a carousel · n · i */
  PS.Pager = function Pager(p) {
    var d = []; for (var i = 0; i < p.n; i++) d.push(p.progress ? h(PagerDot, { key: i, i: i, progress: p.progress }) : h('i', { key: i, className: i === p.i ? 'is-on' : null }));
    return h('div', { className: 'ps-pager', 'aria-hidden': true }, d);
  };
  /* a dot that follows the swipe: as wide as the page is on screen (6 → 24) and as dark (shade 8 → 40), from the carousel's progress */
  function PagerDot(p) {
    var M = window.Motion, w = M.useTransform(p.progress, function (v) { return 6 + 18 * Math.max(0, 1 - Math.abs(v - p.i)); });
    var o = M.useTransform(p.progress, function (v) { return Math.max(0, 1 - Math.abs(v - p.i)); });
    return h(m.i, { className: 'ps-pager__dot', style: { width: w } }, h(m.b, { style: { opacity: o } }));
  }
  /* Carousel: pages side by side, swiped left / right (or moved by index) on the Smooth spring; as tall as its tallest page, so nothing
     jumps when the page changes (owner) · pages [nodes] · index · onIndex(i) · dots (a Pager under it that follows the swipe)
     · gap (pages → dots, a gap token: 'md' | … ; default 2xl — the anti-scam cards; 'md' in Keep your coupon?, Figma 10893:29050) */
  PS.Carousel = function Carousel(p) {
    var M = window.Motion, box = R.useRef(null), x = M.useMotionValue(0), prog = M.useMotionValue(p.index || 0), n = p.pages.length, wRef = R.useRef(0);
    R.useEffect(function () { return x.on('change', function (v) { var w = wRef.current || 1; prog.set(-v / w); }); }, []);
    function width() { var w = box.current ? box.current.clientWidth : 0; wRef.current = w; return w; }
    function settle(i) {
      var w = width(); i = Math.max(0, Math.min(n - 1, i));
      if (PS.reduce) x.jump(-i * w); else M.animate(x, -i * w, Object.assign({}, MT.SPRING));
      if (i !== p.index && p.onIndex) p.onIndex(i);
    }
    R.useEffect(function () { settle(p.index || 0); }, [p.index]);
    R.useEffect(function () { function fit() { x.jump(-(p.index || 0) * width()); } window.addEventListener('resize', fit); return function () { window.removeEventListener('resize', fit); }; }, [p.index]);
    return h('div', { className: 'ps-carousel', style: p.gap ? { gap: 'var(--spacing-gap-' + p.gap + ')' } : null },
      h('div', { ref: box, className: 'ps-carousel__view' },
        h(m.div, { className: 'ps-carousel__track', style: { x: x }, drag: 'x', dragElastic: 0.18, dragMomentum: false,
          dragConstraints: { left: -(n - 1) * (wRef.current || 1000), right: 0 },
          onDragStart: function () { width(); },
          onDragEnd: function (e, info) { var w = wRef.current || 1, i = p.index || 0, dx = info.offset.x, vx = info.velocity.x;
            if (dx < -w * 0.2 || vx < -400) i += 1; else if (dx > w * 0.2 || vx > 400) i -= 1; settle(i); } },
          p.pages.map(function (pg, i) { return h('div', { key: i, className: 'ps-carousel__page', 'aria-hidden': i !== p.index }, pg); }))),
      p.dots ? h(PS.Pager, { n: n, progress: prog }) : null);
  };

  /* PenaltyInfo: how penalties work for an installment (Figma 10545:38381), the content of a big tooltip (width 288) — the title, the rules
     (when: the first in brand, the others red; what: secondary) in a 100 px column, a line, a note · title · rows [[when, what]] · note */
  PS.PenaltyInfo = function PenaltyInfo(p) {
    return h('div', { className: 'ps-pen' }, h('p', { className: 'ps-t-section-sm', style: { whiteSpace: 'nowrap' } }, p.title || 'How penalties work for this installment'),
      h('div', { className: 'ps-pen__detail' },
        h('div', { className: 'ps-pen__rows' }, p.rows.map(function (r, i) {
          return h('div', { key: i, className: 'ps-pen__row' }, h('b', { className: PS.cx('ps-t-label-sm', i ? 'ps-c-negative-heavy' : 'ps-c-brand') }, r[0]), h('span', { className: 'ps-t-caption-sm ps-c-secondary' }, r[1]));
        })),
        h(PS.Divider),
        h('p', { className: 'ps-t-caption-xs ps-c-placeholder' }, p.note || 'We don’t charge penalties on penalties. Your due date doesn’t change.')));
  };
  /* ScamTips: "Protect yourself from scams" in a card sheet (className 'ps-scams') — cards swiped left / right or moved on with Next, the
     sheet as tall as the tallest card, the dots following the swipe; only the card on show plays its animation, from the start each time (owner).
     cards [{ anim, title, body }] · index · onIndex · onNext (on the last card: "I understand") · onClose */
  PS.ScamTips = function ScamTips(p) {
    var last = p.index === p.cards.length - 1;
    return h(R.Fragment, null,
      h(PS.SheetHead, { align: 'left', title: 'Protect yourself from scams', type: 'ps-t-section-md', onClose: p.onClose }),
      h(PS.Carousel, { index: p.index, onIndex: p.onIndex, dots: true, pages: p.cards.map(function (c, k) {
        return h('div', { key: k, className: 'ps-scam' }, h(PS.Anim, { name: c.anim, size: 100, active: k === p.index }),
          h('div', null, h('p', { className: 'ps-t-section-md' }, c.title), h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, c.body)));
      }) }),
      h(PS.Button, { block: true, onClick: p.onNext }, h(PS.Swap, { k: last ? 'u' : 'n' }, h('span', null, last ? 'I understand' : 'Next'))));
  };
  /* GuestPay: Payment when not signed in (Figma 52:7683; rebrand: the EmptyState Action=On placed there) — the Empty box animation (as
     PS.EmptyState), a title (Fg/Default) and a line (Fg/Subtle), then a 264 px button; the picture sits where a full-page empty state's does · onLogin */
  PS.GuestPay = function GuestPay(p) {
    return h('div', { className: 'ps-guestpay' }, h(PS.Anim, { name: 'empty-box', size: 80 }),
      h('div', null, h('p', { className: 'ps-t-title-sm ps-c-primary' }, 'Keep track of your repayments'), h('p', { className: 'ps-t-body-md ps-c-tertiary' }, 'Sign up or log in to view your repayment schedule and due dates.')),
      h(PS.Button, { size: 'md', onClick: p.onLogin }, 'Sign up or log in'));
  };
  /* PayDock: the frosted panel at the bottom of Payment (Figma 52:7925 "payment nav", 162 tall) — rounded top, it holds the PayBar and sits
     behind the tab bar · children (the PayBar). Goes in the Screen's overlay. */
  PS.PayDock = function PayDock(p) { return h('div', { className: 'ps-paydock' }, p.children); };
})();
