/* First application — a new customer's path through the PeraSure app (Figma: Perasure handoff, section 13485:21324):
     log in → verification code → home before there's a limit ("Check your limit") → your loan estimate → basic information →
     verify your identity (ID type, both sides, camera) → check the details → take a selfie → add a trusted contact → Submit →
     in review → the credit limit is ready.
   The screens, sheets, motion and copy are the app's own (prototypes/app, loaded by index.html); nothing is copied or re-made here.
   This file only sets the path through them, by wrapping four of the app's calls before it starts:
     - where it starts: log in, over the home a logged-out visitor sees (Back goes there, and its "Check your limit" comes back);
     - after the code it goes straight to home: this Figma flow has no permissions page (APP.swap('permission') → home);
     - after Submit the application is in review (the app's own step), then the credit limit is ready (Tune → After Submit);
     - Tune → Application forms "sample": each form opens filled in (the app keeps a form's values in APP.S.kyc[<form>]).
   What it relies on in the app — keep these working when changing it: the screen names 'login', 'tabs', 'permission', 'kyc-basic',
   'kyc-check', 'kyc-contact'; APP.go / swap / set / home / say; S.user 'guest' → 'new' (code) → 'review' (Submit) → 'approved';
   the form keys basic / details / contact in S.kyc and their field names (screens-kyc.js). */
(function () {
  'use strict';
  var APP = window.APP, PS = window.PS, CS = window.CS, T = APP.T;
  var go0 = APP.go, swap0 = APP.swap, set0 = APP.set;

  /* ---- where it starts: log in (the app opens on its splash and home) ---- */
  set0({ stack: [{ name: 'tabs', key: 'fa-home', params: {} }, { name: 'login', key: 'fa-login', params: {} }], tab: 'home', dir: 0 });

  /* ---- after the verification code: home, with no permissions page in between ---- */
  APP.swap = function (name) {
    if (name === 'permission') return APP.home('home', 1);
    return swap0.apply(this, arguments);
  };

  /* ---- after Submit: in review, then the credit limit is ready ---- */
  var REVIEW_MS = 5600, timer = null;   /* the app's "we've got your application" toast stays 3.4 s; then the review card shows on its own for a moment */
  function ready() {
    var S = APP.S, top = S.stack[S.stack.length - 1], onHome = top.name === 'tabs' && S.tab === 'home' && !S.sheet;
    set0({ user: 'approved' });
    if (onHome) APP.home('home', 0);   /* a new page: home crossfades from the review card to the credit card */
    APP.say('Your ' + PS.money(CS.credit.limit, 0) + ' credit limit is ready. Withdraw whenever you need it.', 3400);
  }
  APP.set = function () {
    var was = APP.S.user;
    set0.apply(this, arguments);
    if (was !== 'review' && APP.S.user === 'review' && T.after !== 'review') { clearTimeout(timer); timer = setTimeout(ready, REVIEW_MS); }
  };

  /* ---- Tune → Application forms "sample": the forms open filled in (sample people and places, not real ones) ---- */
  var SAMPLE = {
    basic: { email: 'sam.ge@gmail.com', marital: 'Single', job: 'BPO Worker', company: 'Bayanihan Contact Center', address: 'Unit 1203, Cyber One Building, Eastwood Avenue, Bagumbayan',
      city: 'Quezon City, Metro Manila', tenure: '1 to 2 years', title: 'Customer service associate', payroll: 'Twice a month', payday: { y: 2026, m: 10, d: 15 }, income: '25000', files: [] },
    details: { street: '123 Mabini Street, Barangay San Antonio', city: 'Pasig City, Metro Manila', first: 'Sam', last: 'Ge', middle: '', suffix: '', gender: 'Male',
      idno: '0123-4567-8901', dob: { y: 1997, m: 5, d: 24 } },
    contact: { name: 'Maria Santos', mobile: '0917 123 4567' }
  };
  var FORMS = { 'kyc-basic': 'basic', 'kyc-check': 'details', 'kyc-contact': 'contact' };
  APP.go = function (name) {
    var key = FORMS[name], k = APP.S.kyc || {};
    if (T.fill === 'sample' && key && !k[key]) {
      var add = {}; add[key] = key === 'details' ? Object.assign({ type: k.type || '' }, SAMPLE.details) : SAMPLE[key];   /* the ID type is the one picked a step before */
      set0({ kyc: Object.assign({}, k, add) });
    }
    return go0.apply(this, arguments);
  };
})();
