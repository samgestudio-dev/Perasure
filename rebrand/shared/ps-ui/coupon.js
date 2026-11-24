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
     value ('25% OFF') · label ('First-payment interest') · rule (condition line) · ruleLong (truncated: ⓘ, tap → onRule(el)) · meta ('Valid until …')
     expiresAt (ms: live countdown instead of meta) · best · state default | selected | used | expired | unavailable · reason (unavailable)
     action use (Use button → onUse) | pick (whole ticket toggles → onPick) | none · shadow.
     Selecting changes colour only (bar, mark, shadow: 150 ms); nothing moves. */
  PS.CouponTicket = function CouponTicket(p) {
    var st = p.state || 'default', muted = st === 'used' || st === 'expired', off = st === 'unavailable', sel = st === 'selected', pick = p.action === 'pick';
    var right = muted ? h('p', { className: 'ps-ticket__status' }, st === 'used' ? 'Used' : 'Expired')
      : p.action === 'use' ? h(PS.Button, { variant: 'outline', onClick: function (e) { e.stopPropagation(); if (p.onUse) p.onUse(); } }, p.useLabel || 'Use')   /* phase 1: legacy Use button */
      : pick && !off ? h('span', { className: 'ps-ticket__pick' }, h(PS.Check, { on: sel })) : null;   /* unavailable: the slot stays empty (legacy) */
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
            h('div', { className: 'ps-ticket__value' }, h('p', { className: 'ps-text-title-md' }, p.value), p.best && !muted && !off ? h(PS.Tag, { tone: 'best' }, 'Best') : null),
            h('p', { className: 'ps-text-label-md ps-ticket__sub ps-ellipsis' }, p.label)),
          right),
        h('div', { className: 'ps-ticket__meta ps-text-body-sm' }, h('p', null, rule), second))
    ];
    var cls = PS.cx('ps-ticket', sel && 'is-on', p.shadow && 'ps-ticket--shadow', muted && 'ps-ticket--muted', off && 'ps-ticket--off', p.className);
    if (pick) return h(m.button, Object.assign({ type: 'button', className: cls, 'aria-pressed': sel, 'aria-disabled': off || undefined, onClick: p.onPick }, PS.press()), kids);
    return h('div', { className: cls }, kids);
  };

  /* Tabs: segmented control · items [{ id, label, count }] (count shown when set) · value · onChange(id) · glass (frosted, in sheets)
     split (separate pills) · spaced (with split: 16 between them) · id (pill layout id). The pill glides on the Smooth spring; label colours change in 150 ms. */
  PS.Tabs = function Tabs(p) {
    return h('div', { className: PS.cx('ps-tabs', p.glass && 'ps-tabs--glass', p.split && 'ps-tabs--split', p.spaced && 'ps-tabs--spaced', p.className), role: 'tablist' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h(m.button, Object.assign({ key: it.id, type: 'button', role: 'tab', 'aria-selected': on, className: PS.cx('ps-tabs__tab', on && 'is-on'),
        onClick: function () { if (!on && p.onChange) p.onChange(it.id); } }, PS.press()),
        on ? h(m.span, { layoutId: (p.id || 'ps-tabs') + '-pill', className: 'ps-tabs__pill', transition: MT.SPRING }) : null,
        h('span', null, it.label), it.count != null ? h(PS.Count, { n: it.count, on: on }) : null);
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
  /* EmptyState placement (BRIEF 20): one rule for every empty state — its container is the free area that holds it (from where it starts, below the
     header / tabs / search, down to the bottom bar, the sheet foot or the scroller's bottom); the block is centred, space above : below = 2 : 3
     (centre at 40 %), at least 24 each; a container shorter than the block + 48 → the block starts 24 down and the area scrolls.
     Built as a flex column (spacers flex 2 / flex 3, min 24) whose min-height is measured from the container (ResizeObserver).
     inline: no placement (a block inside a card) · page (old prop: no longer needed, kept harmless) */
  function emptyRoom(el) {
    var c = el.parentElement && el.parentElement.closest('.ps-scroll, .ps-sheet__body, .ps-ssheet__body, .ps-mpick__list, .ps-layer, .ps-screen');
    if (!c) return 0;
    var host = el.closest('.ps-sheet, .ps-screen') || document.body, bars = host.querySelectorAll('.ps-sheet__foot, .ps-pb--bot, .ps-nav'), bottom = c.getBoundingClientRect().bottom;
    for (var i = 0; i < bars.length; i++) { var r = bars[i].getBoundingClientRect(); if (r.height > 0 && r.top < bottom && r.top > el.getBoundingClientRect().top) bottom = r.top; }
    return Math.max(0, Math.floor(bottom - el.getBoundingClientRect().top));
  }
  PS.EmptyState = function EmptyState(p) {
    var box = R.useRef(null), mh = R.useState(0);
    R.useLayoutEffect(function () {
      if (p.inline || !box.current) return;
      var el = box.current, raf = 0;
      function fit() { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { var v = emptyRoom(el); mh[1](function (o) { return Math.abs(o - v) > 1 ? v : o; }); }); }
      fit(); var t = setTimeout(fit, 400);   /* again once the page has risen in / the sheet has slid up */
      var ro = window.ResizeObserver ? new ResizeObserver(fit) : null, c = el.parentElement && el.parentElement.closest('.ps-scroll, .ps-sheet__body, .ps-ssheet__body, .ps-mpick__list, .ps-layer, .ps-screen');
      if (ro && c) ro.observe(c); window.addEventListener('resize', fit);
      return function () { cancelAnimationFrame(raf); clearTimeout(t); if (ro) ro.disconnect(); window.removeEventListener('resize', fit); };
    }, [p.inline]);
    var block = h('div', { className: PS.cx('ps-empty', p.className), style: p.inline ? p.style : null },
      !p.art || p.art === 'empty-box' ? h(PS.Anim, { name: 'empty-box', size: 80 }) : h(PS.Art, { name: p.art, size: 80 }),
      h('div', null, h('p', { className: 'ps-text-title-sm ps-c-tertiary' }, p.title), p.body ? h('p', { className: 'ps-text-body-md ps-c-placeholder' }, p.body) : null), p.children);   /* phase 1: legacy colours */
    if (p.inline) return block;
    return h('div', { ref: box, className: 'ps-emptybox', style: Object.assign({ minHeight: mh[0] ? mh[0] + 'px' : undefined }, p.style) },
      h('i', { className: 'ps-emptybox__sp is-top', 'aria-hidden': true }), block, h('i', { className: 'ps-emptybox__sp is-bot', 'aria-hidden': true }));
  };

  /* CouponOption: a coupon in the picker sheet (DS 10840:29499 "Installment", screen 10836:28988) — a white card, value + what it is on the left,
     Best + the round mark on the right. value ('25% OFF') · label ('First-payment interest') · best · expiresAt (ms) · rule (the coupon's condition,
     shown under a line when it can't be used) · state default | selected | unavailable · onPick.
     Picking gives the card a 1 px brand line inside (DS 10842:29606, drawn over the strip too), the default shadow and the mark (150 ms). A coupon with less than a day left shows the countdown strip under the card (owner: only
     then, and only this way). */
  PS.CouponOption = function CouponOption(p) {
    var st = p.state || 'default', on = st === 'selected', off = st === 'unavailable', left = p.expiresAt ? p.expiresAt - Date.now() : 0, soon = left > 0 && left <= 86400000;
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-copt', on && 'is-on', off && 'is-off', p.className), 'aria-pressed': on, 'aria-disabled': off || undefined, onClick: p.onPick }, PS.press()),
      h('span', { className: 'ps-copt__card' },
        h('span', { className: 'ps-copt__top' },
          h('span', { className: 'ps-copt__text' }, h('span', { className: 'ps-copt__value ps-ellipsis' }, p.value), h('span', { className: 'ps-text-body-sm ps-copt__label ps-ellipsis' }, p.label)),
          p.best && !off ? h(PS.Tag, { tone: 'best' }, 'Best') : null,
          off ? h('span', { className: 'ps-text-label-sm ps-c-disabled' }, 'Unavailable') : h('span', { className: 'ps-copt__pick' }, h(PS.Check, { on: on }))),
        off && p.rule ? h('span', { className: 'ps-copt__rule' }, h(PS.Divider), h('span', { className: 'ps-text-body-sm ps-c-secondary' }, p.rule)) : null,
        soon ? h('span', { className: 'ps-copt__strip ps-text-body-sm' }, h(PS.Icon, { name: 'clock', size: 16, color: 'countdown' }), h(PS.Countdown, { to: p.expiresAt })) : null));
  };

  /* CouponRow: a coupon line on the loan page; a tap turns it on or off · type · title · sub (green when on) · on · onClick
     The line under the title crossfades only when the row turns on or off; a value that follows the slider just updates. */
  PS.CouponRow = function CouponRow(p) {
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-crow', p.on && 'is-on'), onClick: p.onClick, 'aria-pressed': !!p.on }, PS.press()),
      h('span', { className: 'ps-crow__main' }, h(PS.CouponArt, { type: p.type, size: 36 }),
        h('span', { className: 'ps-crow__text' }, h('span', { className: 'ps-text-body-md-strong ps-ellipsis' }, p.title),
          h(PS.Swap, { k: p.on ? 'on' : 'off', block: true },
            h('span', { className: PS.cx('ps-crow__sub', 'ps-ellipsis', p.on ? 'ps-text-caption-sm' : 'ps-text-body-sm') }, p.sub)))),
      h(PS.Check, { on: p.on }));
  };

  /* Summary: total payment + what the coupons do · total · was (before coupons; hidden when equal) · saved (hidden when 0) · newLimit (hidden when null)
     onConfirm · label ('Confirm') · title. Fields of a coupon that isn't used are hidden; their row opens and closes on the spring
     and the chips come and go on ENTER / LEAVE. Amounts update in place. */
  PS.Summary = function Summary(p) {
    var chips = [];
    if (p.saved > 0) chips.push(h(m.span, Object.assign({ key: 's', layout: 'position', transition: MT.SPRING }, chipIn()), h(PS.Tag, { tone: 'positive', emphasis: 'outline', icon: 'check' }, 'Saved ' + PS.money(p.saved, p.saved % 1 ? 2 : 0))));
    if (p.newLimit) chips.push(h(m.span, Object.assign({ key: 'l', layout: 'position', transition: MT.SPRING }, chipIn()), h(PS.Tag, { tone: 'navy', emphasis: 'outline', icon: 'arrow-up' }, 'New limit ' + PS.money(p.newLimit, 0))));
    var showWas = p.was != null && Math.abs(p.was - p.total) > 0.004;
    return h('div', { className: 'ps-summary ps-bubble' },
      h('div', { className: 'ps-summary__total' }, h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, p.title || 'Total payment'),
        h('div', null, h(PS.Amount, { value: p.total }), showWas ? h(PS.Amount, { value: p.was, strike: true }) : null)),
      h(AP, { initial: false }, chips.length ? h(m.div, { key: 'c', className: 'ps-summary__chips', initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1, transition: { height: MT.SPRING, opacity: MT.ENTER } },
        exit: { height: 0, opacity: 0, transition: { height: MT.SPRING, opacity: MT.LEAVE } } },
        h('div', { className: 'ps-summary__chiprow' }, h(AP, { initial: false, mode: 'popLayout' }, chips))) : null),
      h(PS.Button, { block: true, onClick: p.onConfirm, className: 'ps-summary__go' }, p.label || 'Confirm'));
  };
  /* CouponPayCard: Figma's name for this card (component 11273:4945, spec CouponPayCard.md; legacy "Coupon primary card" 10926:29645) — the same component */
  PS.CouponPayCard = PS.Summary;
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
        h('div', { className: 'ps-picker__intro' }, p.intro ? h('p', { className: 'ps-text-body-md' }, p.intro) : null,
          p.loan ? h('div', { className: 'ps-picker__loan' }, h('span', { className: 'ps-text-body-md ps-c-tertiary' }, p.loanLabel || 'Your loan'), h('span', { className: 'ps-text-label-md' }, p.loan)) : null),
        h(PS.Crossfade, { k: p.tab, className: 'ps-tickets' }, p.children)),
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
      h('div', { className: 'ps-decide__text' }, h('p', { className: 'ps-text-title-sm' }, p.title), p.body ? h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, p.body) : null),
      p.facts ? h('div', { className: 'ps-decide__facts' }, p.facts.map(function (f, i) {
        return h('div', { key: i }, h('span', { className: 'ps-text-body-sm ps-c-tertiary' }, f.label),
          h('span', { className: PS.cx('ps-text-label-md', f.tone === 'positive' ? 'ps-c-positive' : 'ps-c-secondary') }, f.value));
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
