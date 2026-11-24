/* PeraSure UI — coupons: pictures, the ticket (every state), segmented tabs, empty state, the loan-page coupon row,
   the payment summary, the coupon picker sheet and the "keep your coupon?" decision. Needs core.js and layout.js (and pay.js for
   Decision with more than one coupon: PS.Carousel). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* CouponArt: the coupon picture — Figma's own SVG exports (app file, "Coupon center": 80 px 52:16887 / 52:16857 / 52:16835; 36 px with the
     green badge 52:15586 / 52:15725 / 52:15780), only the canvas behind them taken out (owner: exported, not redrawn)
     type percent (% off) | amount (₱ off) | limit (credit limit increase) · size (px).
     From 40 px up: the version with the white outline and the badge's shadow; below 40 px (the 36 px rows): the plain small one.
     animate (40 px up): plays the coupon animation instead (animations/coupon-percentage | coupon-amount | coupon-credit-limit, GSAP:
     the ticket lands, the badge pops on, then it floats and the badge rocks / turns / its arrow shoots up). Owner: only in the
     "Keep your coupon?" sheet (PS.Decision) — everywhere else the still. Reduced motion: the animation's resting frame.
     active (with animate): false holds the landed ticket, true again plays it from the start (Decision's pages). */
  var ART = { percent: 'coupon-percent', amount: 'coupon-amount', limit: 'coupon-limit' };
  var ANIM = { percent: 'coupon-percentage', amount: 'coupon-amount', limit: 'coupon-credit-limit' };
  /* active (false: holds the landed ticket, the end of the intro; true again: plays from the start — a carousel's pages, owner: only the
     page on show plays, and each time it comes back it plays again) */
  function CouponAnim(p) {
    var ref = R.useRef(null), api = R.useRef(null), act = R.useRef(p.active !== false), slug = ANIM[p.type] || ANIM.percent;
    act.current = p.active !== false;
    function rest(a) { a.api.seekFrame(a.rest); }
    R.useEffect(function () {
      var dead = false;
      PS.loadGsapModule(PS.root + 'animations/' + slug + '/gsap/' + slug + '.js').then(function (mod) {
        if (dead || !ref.current) return;
        var make = Object.keys(mod).filter(function (k) { return /^create/.test(k); })[0];
        api.current = { api: mod[make](ref.current, { autoplay: act.current }), rest: mod.MARKERS ? mod.MARKERS.loop : 0 };
        if (!act.current) rest(api.current);
      }, function () {});
      return function () { dead = true; if (api.current) api.current.api.destroy(); api.current = null; };
    }, [slug]);
    R.useEffect(function () {
      var a = api.current; if (!a) return;
      if (p.active === false) rest(a); else if (!PS.reduce) { a.api.player.pause(0); a.api.play(); }
    }, [p.active]);
    return h('span', { className: PS.cx('ps-cart', p.className), style: Object.assign({ '--ps-s': PS.rem(p.size) }, p.style), 'aria-hidden': true },
      h('span', { className: 'ps-cart__anim', ref: ref }));
  }
  PS.CouponArt = function CouponArt(p) {
    var s = p.size || 36, name = ART[p.type] || ART.percent;
    if (s < 40) return h(PS.Art, { name: name + '-sm', size: s, className: p.className, style: p.style });
    if (p.animate) return h(CouponAnim, { type: p.type, size: s, active: p.active, className: p.className, style: p.style });
    /* the outline reaches 3.31 % left and 5 % right of the box (Figma insets), so the picture is drawn wider than its box */
    return h('span', { className: PS.cx('ps-cart', p.className), style: Object.assign({ '--ps-s': PS.rem(s) }, p.style), 'aria-hidden': true },
      h('img', { src: PS.asset('art/' + name + '.svg'), alt: '', draggable: false }));
  };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /* Countdown: "Expires in 23:59:59" ticking every second · to (time in ms) · prefix */
  PS.Countdown = function Countdown(p) {
    var s = R.useState(Date.now()), now = s[0];
    R.useEffect(function () { var t = setInterval(function () { s[1](Date.now()); }, 1000); return function () { clearInterval(t); }; }, []);
    var left = Math.max(0, Math.floor((p.to - now) / 1000)), d = Math.floor(left / 86400);
    var text = d >= 2 ? d + ' days' : pad(Math.floor(left / 3600)) + ':' + pad(Math.floor(left / 60) % 60) + ':' + pad(left % 60);
    return h('span', { className: 'ps-nowrap', style: { fontVariantNumeric: 'tabular-nums' } }, (p.prefix == null ? 'Expires in ' : p.prefix) + text);
  };

  /* CouponTicket: the coupon in the coupon centre and the picker.
     value ('25% OFF') · label ('First‑payment interest') · rule (condition line) · ruleLong (truncated: ⓘ, tap → onRule(el)) · meta ('Valid until …')
     expiresAt (ms: live countdown instead of meta) · best · state default | selected | used | expired | unavailable · reason (unavailable)
     action use (Use button → onUse) | pick (whole ticket toggles → onPick) | none · shadow.
     Selecting changes colour only (bar, mark, shadow: 150 ms); nothing moves. */
  PS.CouponTicket = function CouponTicket(p) {
    var st = p.state || 'default', muted = st === 'used' || st === 'expired', off = st === 'unavailable', sel = st === 'selected', pick = p.action === 'pick';
    var right = muted ? h('p', { className: 'ps-ticket__status' }, st === 'used' ? 'Used' : 'Expired')
      : p.action === 'use' ? h(PS.Button, { variant: 'outline', onClick: function (e) { e.stopPropagation(); if (p.onUse) p.onUse(); } }, p.useLabel || 'Use')
      : pick ? h('span', { className: 'ps-ticket__pick' }, h(PS.Check, { on: sel, off: off })) : null;
    var rule = p.ruleLong
      ? h('span', { className: 'ps-ticket__rule', role: 'button', tabIndex: 0, 'aria-label': p.rule,
          onClick: function (e) { e.stopPropagation(); if (p.onRule) p.onRule(e.currentTarget); } },
          h('span', { className: 'ps-ellipsis' }, p.rule), h(PS.Icon, { name: 'alert-circle', size: 12, color: 'tertiary' }))
      : h('span', { className: 'ps-ellipsis', style: { display: 'block', width: '100%' } }, p.rule);
    var second = off && p.reason ? h('p', { className: 'ps-ticket__why' }, h(PS.Icon, { name: 'alert-circle', size: 12 }), p.reason)
      : p.expiresAt && !muted ? h('p', { className: 'ps-ticket__count' }, h(PS.Icon, { name: 'clock', size: 12, color: 'countdown' }), h(PS.Countdown, { to: p.expiresAt }))
      : h('p', null, p.meta);
    var kids = [
      h('span', { key: 's', className: 'ps-ticket__shape' }, h('span', { className: 'ps-ticket__bar' })),
      h('div', { key: 'i', className: 'ps-ticket__in' },
        h('div', { className: 'ps-ticket__row' },
          h('div', { className: 'ps-ticket__head' },
            h('div', { className: 'ps-ticket__value' }, h('p', { className: 'ps-t-title-md' }, h(PS.Peso, null, p.value)), p.best && !muted && !off ? h(PS.Tag, { tone: 'best' }, 'Best') : null),
            h('p', { className: 'ps-t-label-md ps-ticket__sub ps-ellipsis' }, p.label)),
          right),
        h('div', { className: 'ps-ticket__meta ps-t-caption-sm' }, h('p', null, rule), second))
    ];
    var cls = PS.cx('ps-ticket', sel && 'is-on', p.shadow && 'ps-ticket--shadow', muted && 'ps-ticket--muted', muted && 'ps-ticket--' + st, off && 'ps-ticket--off', p.className);
    if (pick) return h(m.button, Object.assign({ type: 'button', className: cls, 'aria-pressed': sel, 'aria-disabled': off || undefined, onClick: p.onPick }, PS.press()), kids);
    return h('div', { className: cls }, kids);
  };

  /* Tabs: segmented control · items [{ id, label, count }] (count shown when set, in brackets after the label: 'To use (6)', like the inbox) · value · onChange(id) · glass (frosted, in sheets)
     split (separate pills, Figma Tab Style=Filter: green labels) · chip (with split: Figma Chip — grey labels, the credit history) · spaced (with split: 16 between them) · id (pill layout id). The pill glides on the Smooth spring; label colours change in 150 ms.
     fade: the pill does not glide — the old tab's pill fades out and the new one's fades in, with the labels, in 150 ms (the inbox, owner 2026-11-23). */
  PS.Tabs = function Tabs(p) {
    return h('div', { className: PS.cx('ps-tabs', p.fade && 'ps-tabs--fade', p.glass && 'ps-tabs--glass', p.split && 'ps-tabs--split', p.split && p.chip && 'ps-tabs--chip', p.spaced && 'ps-tabs--spaced', p.className), role: 'tablist' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h(m.button, Object.assign({ key: it.id, type: 'button', role: 'tab', 'aria-selected': on, className: PS.cx('ps-tabs__tab', on && 'is-on'),
        onClick: function () { if (!on && p.onChange) p.onChange(it.id); } }, PS.press()),
        p.fade ? h(AP, { initial: false }, on ? h(m.span, { key: 'pill', className: 'ps-tabs__pill', initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }, exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } } }) : null)
          : on ? h(m.span, { layoutId: (p.id || 'ps-tabs') + '-pill', className: 'ps-tabs__pill', transition: MT.SPRING }) : null,
        h('span', null, it.label + (it.count != null ? ' (' + it.count + ')' : '')));   // the count is part of the label, no badge (owner, 2026-11-23)
    }));
  };
  /* Crossfade: content that is replaced (a tab's list) — the old leaves on LEAVE, the new comes in on ENTER, rising MT.Y.block
     k · className · style · rise: the new content comes in piece by piece instead (its children rise one after another, PS.Rise) */
  PS.Crossfade = function Crossfade(p) {
    var skip = R.useContext(PS.RiseCtx), first = R.useRef(true);
    R.useEffect(function () { first.current = false; }, []);
    if (p.rise) return h(AP, { initial: false, mode: 'popLayout' }, h(m.div, { key: p.k, style: p.style, exit: { opacity: 0, transition: MT.LEAVE } },
      h(PS.Rise, { className: p.className, off: first.current && skip, delay: 70 }, p.children)));
    return h(AP, { initial: false, mode: 'popLayout' }, h(m.div, Object.assign({ key: p.k, className: p.className, style: p.style }, PS.fade(MT.Y.block)), p.children));
  };

  /* EmptyState: picture + title + one line · art (file in assets/art; the default, 'empty-box', plays the Empty box animation) · title · body · children (a button)
     page: it is all a page shows (first thing in the page's column) — it then sits where a loading page's coin and Order submit sit: the picture's
     middle on the coin's, a little above the middle of the screen, so loading → empty reads as one place (owner). Without it, place it yourself. */
  PS.EmptyState = function EmptyState(p) {
    return h('div', { className: PS.cx('ps-empty', p.page && 'ps-empty--page', p.className), style: p.style },
      !p.art || p.art === 'empty-box' ? h(PS.Anim, { name: 'empty-box', size: 80 }) : h(PS.Art, { name: p.art, size: 80 }),
      h('div', null, h('p', { className: 'ps-t-title-sm ps-c-tertiary' }, p.title), p.body ? h('p', { className: 'ps-t-body-md ps-c-placeholder' }, p.body) : null), p.children);
  };

  /* CouponOption: a coupon in the picker sheet (DS 10840:29499 "Installment", screen 10836:28988) — a white card, value + what it is on the left,
     Best + the round mark on the right. value ('25% OFF') · label ('First‑payment interest') · best · expiresAt (ms) · rule (the coupon's condition,
     shown under a line when it can't be used) · state default | selected | unavailable · onPick.
     Picking gives the card a 1 px brand line inside (DS 10842:29606, drawn over the strip too), the default shadow and the mark (150 ms). A coupon with less than a day left shows the countdown strip under the card (owner: only
     then, and only this way). */
  PS.CouponOption = function CouponOption(p) {
    var st = p.state || 'default', on = st === 'selected', off = st === 'unavailable', left = p.expiresAt ? p.expiresAt - Date.now() : 0, soon = left > 0 && left <= 86400000;
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-copt', on && 'is-on', off && 'is-off', p.className), 'aria-pressed': on, 'aria-disabled': off || undefined, onClick: p.onPick }, PS.press()),
      h('span', { className: 'ps-copt__card' },
        h('span', { className: 'ps-copt__top' },
          h('span', { className: 'ps-copt__text' }, h('span', { className: 'ps-copt__value ps-ellipsis' }, h(PS.Peso, null, p.value)), h('span', { className: 'ps-t-caption-sm ps-copt__label ps-ellipsis' }, p.label)),
          p.best && !off ? h(PS.Tag, { tone: 'best' }, 'Best') : null,
          off ? h('span', { className: 'ps-t-label-sm ps-c-disabled' }, 'Unavailable') : h('span', { className: 'ps-copt__pick' }, h(PS.Check, { on: on }))),
        off && p.rule ? h('span', { className: 'ps-copt__rule' }, h(PS.Divider), h('span', { className: 'ps-t-caption-sm ps-c-secondary' }, p.rule)) : null,
        soon ? h('span', { className: 'ps-copt__strip ps-t-caption-sm' }, h(PS.Icon, { name: 'clock', size: 16, color: 'countdown' }), h(PS.Countdown, { to: p.expiresAt })) : null));
  };

  /* CouponRow: a coupon line on the loan page; a tap turns it on or off · type · title · sub (green when on) · on · onClick
     The line under the title crossfades only when the row turns on or off; a value that follows the slider just updates. */
  PS.CouponRow = function CouponRow(p) {
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-crow', p.on && 'is-on'), onClick: p.onClick, 'aria-pressed': !!p.on }, PS.press()),
      h('span', { className: 'ps-crow__main' }, h(PS.CouponArt, { type: p.type, size: 36 }),
        h('span', { className: 'ps-crow__text' }, h('span', { className: 'ps-t-label-md-light ps-ellipsis' }, p.title),
          h(PS.Swap, { k: p.on ? 'on' : 'off', block: true },
            h('span', { className: PS.cx('ps-crow__sub', 'ps-ellipsis', p.on ? 'ps-t-label-sm-light' : 'ps-t-caption-sm') }, p.sub)))),
      h(PS.Check, { on: p.on }));
  };

  /* Summary: total payment + what the coupons do · total · was (before coupons; hidden when equal) · saved (hidden when 0) · newLimit (hidden when null)
     onConfirm · label ('Confirm') · title. Fields of a coupon that isn't used are hidden; their row opens and closes on the spring
     and the chips come and go on ENTER / LEAVE. Amounts update in place. */
  PS.Summary = function Summary(p) {
    var chips = [];
    if (p.saved > 0) chips.push(h(m.span, Object.assign({ key: 's', layout: 'position', transition: MT.SPRING }, chipIn()), h(PS.Chip, { tone: 'positive' }, 'Saved ' + PS.money(p.saved, p.saved % 1 ? 2 : 0))));
    if (p.newLimit) chips.push(h(m.span, Object.assign({ key: 'l', layout: 'position', transition: MT.SPRING }, chipIn()), h(PS.Chip, { tone: 'brand' }, 'New limit ' + PS.money(p.newLimit, 0))));
    var showWas = p.was != null && Math.abs(p.was - p.total) > 0.004;
    return h('div', { className: 'ps-summary ps-bubble' },
      h('div', { className: 'ps-summary__total' }, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.title || 'Total payment'),
        h('div', null, h(PS.Amount, { value: p.total }), showWas ? h(PS.Amount, { value: p.was, strike: true }) : null)),
      h(AP, { initial: false }, chips.length ? h(m.div, { key: 'c', className: 'ps-summary__chips', initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1, transition: { height: MT.SPRING, opacity: MT.ENTER } },
        exit: { height: 0, opacity: 0, transition: { height: MT.SPRING, opacity: MT.LEAVE } } },
        h('div', { className: 'ps-summary__chiprow' }, h(AP, { initial: false, mode: 'popLayout' }, chips))) : null),
      h(PS.Button, { block: true, onClick: p.onConfirm, className: 'ps-summary__go' }, p.label || 'Confirm'));
  };
  function chipIn() {
    return { initial: { opacity: 0, scale: 0.94, filter: 'blur(' + MT.BLUR + 'px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { default: MT.ENTER, layout: MT.SPRING } },
      exit: { opacity: 0, scale: 0.94, transition: MT.LEAVE } };
  }

  /* CouponPicker: the content of a page sheet (PS.Sheet kind="page") · tabs · tab · onTab · onClose · intro (rule line)
     loan ('₱45,000.00 · 6 terms') · children (the list of the current tab) · summary (node, e.g. PS.Summary).
     Switching tabs crossfades the list (LEAVE, then ENTER rising 10 px). */
  PS.CouponPicker = function CouponPicker(p) {
    return h(R.Fragment, null,
      h('div', { className: 'ps-sheet__head' }, h(PS.Tabs, { items: p.tabs, value: p.tab, onChange: p.onTab, glass: true, id: 'ps-picker', className: 'ps-grow' }), h(PS.Close, { onClick: p.onClose })),
      h('div', { className: 'ps-sheet__body' },
        h('div', { className: 'ps-picker__intro' }, p.intro ? h('p', { className: 'ps-t-body-md' }, p.intro) : null,
          p.loan ? h('div', { className: 'ps-picker__loan' }, h('span', { className: 'ps-t-body-md ps-c-tertiary' }, p.loanLabel || 'Your loan'), h('span', { className: 'ps-t-label-md' }, p.loan)) : null),
        h(PS.Crossfade, { k: p.tab, className: 'ps-list' }, p.children)),
      p.summary ? h('div', { className: 'ps-sheet__foot' }, p.summary) : null);
  };

  /* Decision: the "Keep your coupon?" card sheet (PS.Sheet kind="card") · art (coupon type: its animation plays) · title · body
     facts [{ label, value, tone: positive }] · primary { label, onClick } · secondary { label, onClick } · onClose */
  /* Decision: "Keep your coupon?" in a card sheet — the coupon picture (animated), title, why it was taken off, the facts, Keep / Don't use.
     art · title · body · facts [{ label, value, tone positive }] · primary { label, onClick } · secondary · onClose.
     More than one coupon taken off at once: pages [{ art, title, body, facts }] · index · onIndex — the coupons sit side by side in a
     Carousel like the anti-scam cards (PS.ScamTips; layout Figma 10893:29050: the dots 12 under the facts, 20 above the buttons): swiped left / right, the sheet as tall as the tallest, the dots following the swipe,
     only the coupon on show plays its animation (from the start each time). The close button and the buttons stay put and act on the
     coupon on show. */
  function DecisionBody(p) {
    return h('div', { className: PS.cx('ps-decide__body', p.page && 'ps-decide__body--page') },
      h(PS.CouponArt, { type: p.art, size: 80, animate: true, active: p.active }),
      h('div', { className: 'ps-decide__text' }, h('p', { className: 'ps-t-title-sm' }, p.title), p.body ? h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.body) : null),
      p.facts ? h('div', { className: 'ps-decide__facts' }, p.facts.map(function (f, i) {
        return h('div', { key: i }, h('span', { className: 'ps-t-caption-sm ps-c-tertiary' }, f.label),
          h('span', { className: PS.cx('ps-t-label-md', f.tone === 'positive' ? 'ps-c-positive' : 'ps-c-secondary') }, f.value));
      })) : null);
  }
  PS.Decision = function Decision(p) {
    var pages = p.pages && p.pages.length > 1 ? p.pages : null, i = p.index || 0;
    return h('div', { className: 'ps-decide' },
      h('div', { className: 'ps-decide__close' }, h(PS.Close, { onClick: p.onClose })),
      pages ? h('div', { className: 'ps-decide__pages' }, h(PS.Carousel, { index: i, onIndex: p.onIndex, dots: true, gap: 'md', pages: pages.map(function (pg, k) {
        return h(DecisionBody, Object.assign({ key: k, page: true, active: k === i }, pg));
      }) }))
        : h(DecisionBody, p.pages && p.pages.length ? p.pages[0] : p),
      h('div', { className: 'ps-decide__acts' },
        h(PS.Button, { block: true, onClick: p.primary.onClick }, p.primary.label),
        p.secondary ? h(PS.Button, { variant: 'text', block: true, onClick: p.secondary.onClick }, p.secondary.label) : null));
  };
})();
