/* PeraSure app — the tab pages and Home in every account state (Figma section "Home": 52:12969 full states, 52:11221 on hold,
   52:11733 not approved, 52:11966 expired, 52:12141 in progress, 52:12782 add documents; "Onboarding" 52:9755). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, APP = window.APP, AD = window.AD, CS = window.CS, h = R.createElement, money = PS.money;
  APP.tabs = {};

  /* the three tab pages share one stack entry; the pill glides between them */
  APP.screen('tabs', function Tabs() {
    var S = APP.use(), Tab = APP.tabs[S.tab] || APP.tabs.home;
    return h('div', { className: PS.cx('app-tabs', S.intro === 'play' && 'is-intro') },
      h(PS.Pages, { id: S.tab, dir: 0 }, h(Tab, null)),
      h(PS.Navigator, { id: 'app-nav', value: S.tab, onChange: function (t) { APP.set({ tab: t, tip: null }); },
        tabs: [{ id: 'home', label: 'Home', icon: 'nav-home' }, { id: 'payment', label: 'Payment', icon: 'nav-payment' }, { id: 'account', label: 'Account', icon: 'nav-account' }] }));
  });

  /* the penalty explainer (tooltip on the overdue card and in Payment detail) */
  APP.penaltyTip = function () {
    return h('div', { className: 'app-pen' }, h('p', { className: 'ps-t-section-sm', style: { whiteSpace: 'nowrap' } }, 'How penalties work for this installment'),
      h('div', { className: 'app-pen__rows' }, AD.penalties.map(function (r, i) {
        return h('div', { key: i, className: PS.cx('app-pen__row ps-t-caption-sm', i === 1 && 'is-now') }, h('b', { className: 'ps-c-brand' }, r[0]), h('span', null, r[1]));
      })),
      h('p', { className: 'ps-t-caption-xs ps-c-tertiary' }, 'We don’t charge penalties on penalties. Your due date doesn’t change.'));
  };
  function showPenalty(el) {
    APP.tipAt(el, APP.penaltyTip(), 296);
  }
  APP.showPenalty = showPenalty;
  function apply() { if (!APP.signedIn()) APP.go('login'); else APP.go('kyc-id'); }
  function pay() { APP.set({ tab: 'payment' }); }

  function actions(S) {
    var list = [{ icon: 'headset', label: 'Contact us', onClick: APP.support }];
    if (S.user !== 'guest' && S.user !== 'new') list.unshift({ icon: 'bell', label: 'Inbox', onClick: function () { APP.go('inbox'); } });
    return [APP.tune(), h(PS.HomeActions, { key: 'a', actions: list })];
  }
  function paymentCard(S) {
    if (S.repay === 'overdue') { var o = AD.overdue; return h(PS.PaymentCard, { key: 'pay', amount: o.amount, was: o.was, due: o.due, badge: o.badge, overdue: true, onPay: pay,
      notice: { title: o.notice.title, body: o.notice.body, onHelp: showPenalty } }); }
    if (AD.payment && (S.repay === 'active' || S.user === 'hold')) { var p = AD.payment; return h(PS.PaymentCard, { key: 'pay', amount: p.amount, was: p.was, due: p.due, badge: p.badge, onPay: pay }); }
    return null;
  }
  function notice() { return h(PS.Notice, { key: 'notice', onClick: function () { APP.open('scams', { then: null }); } }, 'All PeraSure transactions happen in the app. Never send money through third parties.'); }
  function trust() { return [h(PS.TrustCard, { key: 'trust' }), h(PS.Legal, { key: 'legal' })]; }
  function more() { return h('div', { key: 'more', className: 'app-stack-8' }, h(PS.DotTitle, null, 'More from PeraSure'), h(PS.Banners, { items: AD.banners.map(function (b) {
    return Object.assign({}, b, { onClick: function () { APP.say('Offers aren’t part of the test app yet.'); } }); }) })); }

  var opened = false;
  APP.tabs.home = function Home() {
    var S = APP.use(), st = AD.states[S.user], credit = CS.credit, body;
    if (S.user === 'guest' || S.user === 'new') {
      body = [h(PS.Hero, Object.assign({ key: 'hero' }, AD.hero, { onClick: apply })), h(PS.Reviews, { key: 'rev', items: AD.reviews })].concat(trust());
    } else if (S.user === 'review') {
      body = [h(PS.StateCard, { key: 's', icon: 'history', title: st.title, body: st.body }), paymentCard(S)].concat(trust());
    } else if (S.user === 'docs') {
      body = [h(PS.StateCard, { key: 's', title: st.title, body: st.body, timer: { label: 'Time remaining', value: st.timer }, button: { label: 'Add documents', tone: 'white', onClick: function () { APP.go('docs'); } } }),
        h(PS.Strip, { key: 'chat', icon: 'support-chat', text: 'Have a question about your application? Chat with support!', chevron: true, onClick: APP.support })].concat(trust());
    } else if (S.user === 'declined') {
      body = [h(PS.StateCard, { key: 's', title: st.title, body: st.body, support: { text: st.ask, onClick: APP.support } }),
        h('div', { key: 'offer', className: 'app-stack-8' }, h(PS.DotTitle, null, 'More for you'), h(PS.OfferCard, Object.assign({}, AD.offer, { onClick: function () { APP.say('LoadCash opens outside the test app.'); } })))].concat(trust());
    } else if (S.user === 'expired') {
      body = [h(PS.StateCard, { key: 's', title: st.title, body: st.body, button: { label: 'Reapply now', icon: 'money-out', onClick: function () { APP.go('kyc-id'); } } }), paymentCard(S)].concat(trust());
    } else if (S.user === 'hold') {
      body = [h(PS.StateCard, { key: 's', title: st.title, body: st.body, support: { text: st.ask, onClick: APP.support } }), paymentCard(S)].concat(trust());
    } else {
      var bd = CS.best(S.coupons, 'discount', credit.available, CS.loan.term), bl = CS.best(S.coupons, 'limit', credit.available, CS.loan.term);
      var show = [bd, bl].filter(Boolean); if (show.length < 2) show = S.coupons.slice(0, 2);
      var cards = show.map(function (c) {
        return { type: c.type, value: c.value, until: 'Until ' + c.until, kind: c.kind === 'limit' ? 'Credit limit' : 'Off interest', label: CS.minText(c),
          cond: c.terms.length === CS.loan.terms.length ? 'Any term' : CS.termsText(c.terms).replace(/^./, function (x) { return x.toUpperCase(); }) };
      });
      var update = S.loan === 'reviewing' || S.loan === 'failed';
      var tip = 'Your available amount is what you can borrow today. It goes back up as you repay.' +
        (credit.temporary ? ' ' + money(credit.temporary, 0) + ' of your total credit is temporary credit, valid until ' + credit.temporaryUntilLong + '.' : '');
      /* the Withdraw demo's own card (the one its motion works on) — it always has a temporary-credit line, so with no temporary credit
         (Tune) the shared component is used, as with ?card=ps */
      body = [APP.wd && APP.wd.heroReady() && credit.temporary > 0 && !APP.q.get('card')
          ? h(APP.WdHero, { key: 'credit', onInfo: function (el) { APP.tipAt(el, tip); } })
          : h(PS.CreditCard, { key: 'credit', available: credit.available, total: credit.total, temporary: credit.temporary, temporaryUntil: credit.temporaryUntil,
              onWithdraw: function () { APP.borrow(); }, onInfo: function (e) { APP.tipAt(e.currentTarget, tip); } }),
        update ? h(PS.Strip, { key: 'upd', icon: 'info', title: 'You have updates on your loan', sub: 'Tap to view the latest status', count: 1, onClick: function () { APP.go('order'); } }) : null,
        paymentCard(S),
        h(PS.HomeCoupons, { key: 'coupons', coupons: cards, onOpen: function () { APP.go('coupons'); } }), more()].concat(trust());
    }
    var first = R.useRef(!opened); opened = true;   /* the first time home shows (after the splash) its cards rise in */
    /* the Credit limit increase plays over home, then closes into the card — the Withdraw demo's own exit (introExit) when its card is the
       one on this page; the demo's code finds the page around the card by these names: .ps-home-in (the cards), .ps-tabbar, the logo row */
    var c = credit, usedMode = c.total - c.available > 0.5;
    var intro = S.intro ? h(PS.CreditLimitIntro, { mode: usedMode ? 'total' : 'available',
      data: usedMode ? { old: c.total - c.temporary, new: c.total, inc: c.temporary, exp: c.temporaryUntilISO } : { old: c.available - c.temporary, new: c.available, inc: c.temporary, exp: c.temporaryUntilISO },
      exit: function (o) {
        if (!window.__wdIntroExit || !document.querySelector('.app-wdhero [data-wd-amount]')) return false;
        var bar = document.querySelector('.app-tabs .ps-nav__bar'), row = document.querySelector('.app-tabs .ps-top__row');
        if (bar) bar.classList.add('ps-tabbar');
        if (row && !row.querySelector('img[alt="PeraSure"]')) { var sp = document.createElement('span'), im = document.createElement('img'); im.alt = 'PeraSure'; sp.hidden = true; sp.appendChild(im); row.appendChild(sp); }
        /* on a frame wider than 360 the card is scaled (k): the demo measures on screen and moves the amount in the card's own px, so the
           place and size the travelling number starts from are given in those px (the number still starts exactly on the big one) */
        var k = APP.wd.heroK || 1, amt = document.querySelector('.app-wdhero [data-wd-amount]');
        if (o.src && Math.abs(k - 1) > 0.001 && amt && amt.children[1]) {
          var p0 = amt.children[0].getBoundingClientRect(), p1 = amt.children[1].getBoundingClientRect(), cx = (p0.left + p1.right) / 2, cy = (p0.top + p0.bottom) / 2;
          o.src = Object.assign({}, o.src, { x: cx + (o.src.x - cx) / k, y: cy + (o.src.y - cy) / k, size: o.src.size ? o.src.size / k : o.src.size });
        }
        /* …and the demo lifts the card above the closing box by z-index: a scaled box is a layer of its own, so it is lifted with it until the end */
        var inn = document.querySelector('.app-wdhero__in');
        if (inn && Math.abs(k - 1) > 0.001) {
          var done0 = o.done; inn.style.position = 'relative'; inn.style.zIndex = '101';
          o = Object.assign({}, o, { done: function () { inn.style.position = ''; inn.style.zIndex = ''; if (done0) done0.apply(null, arguments); } });
        }
        var ran = window.__wdIntroExit(o);
        if (ran) APP.set({ intro: 'out' });               /* the tab bar may show again: the exit has taken hold of it */
        return ran;
      },
      onDone: function () { APP.set({ intro: false }); } }) : null;
    return h(PS.Screen, { colBottom: 120, className: 'ps-home-in', rise: first.current && !S.intro, overlay: intro, top: { left: h(PS.Brand), right: actions(S) } }, body);
  };
})();
