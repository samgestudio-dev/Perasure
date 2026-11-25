/* PeraSure UI — landing: the pieces of the web landing pages opened from an SMS (prototypes/sms-landing). Not app screens: the page scrolls
   like a website, so nothing here sits in the phone frame (PS.Shell's .ps-frame). Load after core.js, layout.js and loan.js (AmountCard,
   RepaymentPlan).
   The calculator's card, the reviews, the trust card and the company lines are the app's own (PS.AmountCard, PS.Reviews, PS.TrustCard,
   PS.Legal{tone: 'inverse'}); only what a web page needs and the app has not got is here. Styles: ps-ui.css → "Landing".
   Gallery: gallery-app.js → "Landing page". Copy follows the perasure-tone-of-voice skill (campaign landing page). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m;

  /* loanQuote(amount, term, cfg): the loan maths of the app's "Your loan estimate" (prototypes/app/coupons-data.js → calc), with the landing
     page's own figures (owner, 2026-11-25: they match the hero): per 15-day term, interest 3 % and service fee 0.75 % of the amount = 0.25 % a
     day; 4 / 6 / 8 terms (owner, 2026-11-25); ₱500–₱90,000. Principal = amount / terms.
     disc (optional, a coupon as in the app: { pct | off, scope 'first' | 'all' }): what it takes off, worked out as the app's calc does.
     → { principal, interest, fee, per, daily, was (before the coupon), save, total, cost, rate (daily cost as a share of the amount) } */
  var LOAN = PS.LANDING_LOAN = { min: 500, max: 90000, step: 100, terms: [4, 6, 8], term: 6, amount: 50000,   /* the calculator opens on ₱50,000 over 6 terms (owner) */ days: 15, interest: 0.03, fee: 0.0075 };
  function r2(n) { return Math.round(n * 100) / 100; }
  PS.loanQuote = function (amount, term, cfg, disc) {
    var c = cfg || LOAN, I = r2(amount * c.interest), F = r2(amount * c.fee), P = r2(amount / term), was = r2(amount + term * (I + F)), save = 0;
    if (disc) { var interest = disc.scope === 'all' ? I * term : I; save = r2(disc.pct ? interest * disc.pct / 100 : Math.min(disc.off, interest)); }
    var total = r2(was - save);
    return { principal: P, interest: I, fee: F, per: r2(P + I + F), daily: r2((I + F) / c.days), was: was, save: save, total: total, cost: r2(total - amount), rate: (c.interest + c.fee) / c.days };
  };
  /* the first payment date: one term after today ("Dec 10, 2026") */
  PS.firstPayDate = function (days, from) {
    var d = new Date((from || new Date()).getTime() + (days || LOAN.days) * 864e5);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  /* Glow: the light-blue glow at the foot of a navy surface (Figma HubCard 11159:12524 → "Glow / 1": 411 × 111, centred, 63 below the edge;
     the same picture and geometry as the home card's .ps-credit__glow). Put it first inside a navy box that has .ps-glow-host. */
  PS.Glow = function Glow() { return h('img', { className: 'ps-glow', src: PS.asset('art/card-glow.svg'), alt: '', 'aria-hidden': true }); };

  /* PlayButton: the call to action that opens Google Play — the app's Button (ps-btn: Label/md, Large 48 / Small 36, Primary or Navy) as a link
     · href · label ("Get it on Google Play") · size lg | sm (the top bar) · tone green (Primary) | navy · block · onClick (tracking; the link still opens).
     A link drawn as a button: it leaves the page, so it is an <a>, not a <button>. The play mark takes the label colour. */
  function PlayMark(p) {   /* the Google Play mark, four parts with gaps that stay open at 16 px (Simple Icons "googleplay", CC0) */
    return h('svg', { className: 'ps-play__mark', viewBox: '0 0 24 24', width: p.s, height: p.s, 'aria-hidden': true },
      h('path', { fill: 'currentColor', d: 'M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z' }));
  }
  PS.PlayButton = function PlayButton(p) {
    var sm = p.size === 'sm';
    return h(m.a, Object.assign({ href: p.href, target: '_blank', rel: 'noopener', onClick: p.onClick,
        className: PS.cx('ps-btn', p.tone === 'navy' ? 'ps-btn--navy' : 'ps-btn--primary', sm ? 'ps-btn--sm ps-play--sm' : 'ps-btn--lg', p.block && 'ps-btn--block', 'ps-play', p.className) }, PS.press()),
      h(PlayMark, { s: PS.rem(16) }), h('span', null, p.label || 'Get it on Google Play'));
  };

  /* LandingNav: the bar at the top of a landing page — the logo and a small Play button. Clear over the navy hero; navy once the page scrolls
     · href · label ("Get the app") · solid · onCta */
  PS.LandingNav = function LandingNav(p) {
    return h('header', { className: PS.cx('ps-lnav', p.solid && 'is-solid') },
      h('span', { className: 'ps-lnav__brand' }, h('img', { src: PS.asset('logos/perasure-mark.svg'), alt: '' }), h('span', null, 'PeraSure')),
      h(PS.PlayButton, { size: 'sm', href: p.href, label: p.label || 'Get the app', onClick: p.onCta }));
  };

  /* LandingHero: the navy first screen with a photo · image (url) · imageAlt · kicker · title (text or node) · body · stats [{ value, label }]
     · action (node: the Play button) · more { label, onClick } (the quieter way on: "See what you'd pay") · note (the small print).
     The photo sits behind the top and fades into navy, so the words keep 4.5:1 or more. */
  PS.LandingHero = function LandingHero(p) {
    return h('section', { className: 'ps-lhero ps-glow-host' }, h(PS.Glow),
      p.image ? h('div', { className: 'ps-lhero__img', style: { backgroundImage: 'url("' + p.image + '")' }, role: 'img', 'aria-label': p.imageAlt || '' }) : null,
      h('div', { className: PS.cx('ps-lhero__body', !p.image && 'ps-lhero__body--plain') },
        p.kicker ? h('p', { className: 'ps-lhero__kicker ps-t-label-sm' }, h('i', { 'aria-hidden': true }), p.kicker) : null,
        h('h1', { className: 'ps-lhero__title ps-t-headline-sm' }, p.title),
        p.body ? h('p', { className: 'ps-lhero__text ps-t-body-lg' }, p.body) : null,
        p.stats ? h('dl', { className: 'ps-lhero__stats' }, p.stats.map(function (s, i) {
          return h('div', { key: i }, h('dt', { className: 'ps-t-label-xs' }, s.label), h('dd', { className: 'ps-t-section-md' }, s.value));   /* as the app's home hero (PS.Hero) */
        })) : null,
        h('div', { className: 'ps-lhero__cta' }, p.action,
          p.more ? h(m.button, Object.assign({ type: 'button', className: 'ps-lhero__more ps-t-label-md', onClick: p.more.onClick }, PS.press()),
            p.more.label, h(PS.Icon, { name: 'chevron-right', size: 16, style: { transform: 'rotate(90deg)' } })) : null),
        p.note ? h('p', { className: 'ps-lhero__note ps-t-caption-xs' }, p.note) : null));
  };

  /* LandingSection: a band of the page with its heading · kicker (small green line) · title · body · tone page (mist) | white | navy
     · align start | center (the closing band) · glow (a navy band has the Glow at its foot; false: none) · id (anchor) · children */
  PS.LandingSection = function LandingSection(p) {
    var navy = p.tone === 'navy' && p.glow !== false;
    return h('section', { id: p.id, className: PS.cx('ps-lsec', 'ps-lsec--' + (p.tone || 'page'), p.align === 'center' && 'ps-lsec--center', navy && 'ps-glow-host', p.className) },
      navy ? h(PS.Glow) : null,
      (p.title || p.kicker) ? h('div', { className: 'ps-lsec__head' },
        p.kicker ? h('p', { className: 'ps-lsec__kicker ps-t-caption-sm' }, p.kicker) : null,   /* the app's section label (Caption/sm, caps) */
        p.title ? h('h2', { className: 'ps-t-title-lg' }, p.title) : null,   /* the app's page title (PageHead: Title/lg) */
        p.body ? h('p', { className: 'ps-lsec__body ps-t-body-md' }, p.body) : null) : null,
      p.children);
  };

  /* LoanCalculator: the landing page's calculator — the app's own amount card (PS.AmountCard: amount, slider, Loan term, term chips, Figma
     OrderAmountCard 11136:22802; its amount in Amount/lg 32 / 40, the loan estimate's navy, no pencil) laid over a navy card that tucks under its rounded foot. The navy
     card shows the loan estimate's numbers without the date: Daily fee · Per installment · (Discount, green, only with a coupon) · Total payment,
     then the action.
     amount · term · onAmount(v) · onTerm(t) · min · max · step · terms · days (15) · label ("Loan amount") · discount (a coupon: { pct | off,
     scope }) · onSchedule ("View payment schedule" under the rows, opens PS.LoanPlanSheet) · action (node) · note · quote (PS.loanQuote result) */
  PS.LoanCalculator = function LoanCalculator(p) {
    var c = Object.assign({}, LOAN, { min: p.min || LOAN.min, max: p.max || LOAN.max, step: p.step || LOAN.step, terms: p.terms || LOAN.terms, days: p.days || LOAN.days });
    var q = p.quote || PS.loanQuote(p.amount, p.term, c, p.discount);
    var rows = [['Daily fee', PS.money(q.daily)], ['Per installment', PS.money(q.per)]];
    if (q.save) rows.push(['Discount', '-' + PS.money(q.save), 'save']);
    rows.push(['Total payment', PS.money(q.total), 'total']);
    return h('div', { className: 'ps-calc' },
      h('div', { className: 'ps-calc__card' },
        h(PS.AmountCard, { tone: 'navy', edit: false, label: p.label || 'Loan amount', amount: p.amount, min: c.min, max: c.max, step: c.step, terms: c.terms, term: p.term, termNote: c.days + ' days / term',
          onAmount: p.onAmount, onCommit: function () {}, onTerm: p.onTerm }),
        h('div', { className: 'ps-calc__result ps-glow-host', 'aria-live': 'polite' }, h(PS.Glow),
          h('dl', { className: 'ps-calc__rows' }, rows.map(function (r) {
            return h('div', { key: r[0], className: r[2] ? 'is-' + r[2] : null }, h('dt', { className: 'ps-t-body-md' }, r[0]), h('dd', { className: r[2] === 'total' ? 'ps-t-number-xs' : 'ps-t-body-md-em' }, r[1]));   /* rows as the app's order details; the total in Number/xs */
          })),
          p.onSchedule ? h(m.button, Object.assign({ type: 'button', className: 'ps-calc__link ps-t-label-md', onClick: p.onSchedule }, PS.press()),
            'View payment schedule', h(PS.Icon, { name: 'chevron-right', size: 16 })) : null,
          p.action ? h('div', { className: 'ps-calc__action' }, p.action) : null)),
      p.note ? h('p', { className: 'ps-calc__note ps-t-caption-sm ps-c-placeholder' }, p.note) : null);
  };

  /* LandingLayer: where a sheet opens on a scrolling web page (the app's sheets sit in the phone frame; here a fixed layer as wide as the page).
     While open the page underneath does not scroll; Escape closes it. open · onClose · children (a PS.Sheet) */
  PS.LandingLayer = function LandingLayer(p) {
    R.useEffect(function () {
      if (!p.open) return;
      var root = document.documentElement; root.style.overflow = 'hidden';
      function esc(e) { if (e.key === 'Escape' && p.onClose) p.onClose(); }
      window.addEventListener('keydown', esc);
      return function () { root.style.overflow = ''; window.removeEventListener('keydown', esc); };   /* always give scrolling back (never restore a momentary stop) */
    }, [p.open]);
    return h('div', { className: 'ps-llayer' }, p.children);
  };

  /* LoanPlanSheet: "View payment schedule" — the app's own repayment plan sheet (prototypes/app/screens-loan.js → sheet 'plan'), the same
     pieces in the same order: a plain sheet, "Repayment plan" + close, PS.RepaymentPlan (each payment, its date and parts), Continue.
     open · onClose · amount · term · days · cfg (the loan; PS.LANDING_LOAN by default) */
  PS.LoanPlanSheet = function LoanPlanSheet(p) {
    var c = Object.assign({}, LOAN, p.cfg), days = p.days || c.days, q = PS.loanQuote(p.amount, p.term, c), plan = [];
    for (var k = 1; k <= p.term; k++) plan.push({ title: 'Payment ' + k, date: PS.firstPayDate(days * k), total: q.per,
      rows: [{ label: 'Principal', value: q.principal }, { label: 'Interest', value: q.interest }, { label: 'Service fee', value: q.fee }] });
    return h(PS.LandingLayer, { open: p.open, onClose: p.onClose }, h(PS.Sheet, { open: p.open, kind: 'plain', label: 'Repayment plan', onClose: p.onClose },
      h(PS.SheetTitle, { onClose: p.onClose }, 'Repayment plan'),
      h(PS.RepaymentPlan, { items: plan }),
      h(PS.Button, { block: true, onClick: p.onClose }, 'Continue')));
  };

  /* Steps: numbered steps joined by a line ("How it works") · items [{ title, text }] */
  PS.Steps = function Steps(p) {
    return h('ol', { className: 'ps-steps' }, p.items.map(function (s, i) {
      return h('li', { key: i, className: 'ps-step' }, h('span', { className: 'ps-step__n ps-t-label-md', 'aria-hidden': true }, i + 1),
        h('div', null, h('h3', { className: 'ps-t-title-16' }, s.title), h('p', { className: 'ps-t-body-md ps-c-secondary' }, s.text)));
    }));
  };

  /* StickyCta: holds the Play button at the bottom of the screen while none of the page's own Play buttons is in view · show · children
     · note (one short line above it). Slides up / down on the Smooth spring (transform only). */
  PS.StickyCta = function StickyCta(p) {
    return h(PS.AP, { initial: false }, p.show ? h(m.div, { key: 'cta', className: 'ps-sticky', initial: { y: '110%' }, animate: { y: 0 }, exit: { y: '110%' }, transition: PS.MT.SPRING },
      p.note ? h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.note) : null, p.children) : null);
  };
})();
