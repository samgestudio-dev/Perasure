/* PeraSure app — sample data. In the app all of it comes from the backend; change it here to try other cases.
   Coupons and loan pricing live in coupons-data.js (window.CS). */
window.AD = (function () {
  'use strict';
  var money = function (n, d) { return window.PS.money(n, d); };
  var CS = window.CS, cur = CS.current, due = cur ? cur.dues : [], d0 = due[0];
  return {
    user: { initials: 'SG', name: 'Sam Ge' },
    /* what the home page says in each account state (Tune → Account) */
    states: {
      review: { title: 'Application in progress', body: 'We’ve got your application and we’re reviewing it now.' },
      docs: { title: 'Help us review your application', body: 'Add documents that show your job or income. Clear, complete documents may improve your chances of approval.', timer: '47h 57m 10s' },
      declined: { title: 'Application wasn’t approved', body: 'We can’t offer you a credit limit right now. You can apply again after 30 days.', ask: 'Have a question about the result? Chat with support!' },
      expired: { title: 'Credit limit expired', body: 'Your limit expired on September 20, 2026. Reapply to get a new one.' },
      hold: { title: 'Credit unlocking soon', body: 'To keep your account safe, we’ve paused your ' + money(CS.credit.limit, 0) + ' limit for now. You can withdraw again from November 27, 2026.', ask: 'Have a question about the hold? Chat with support!' }
    },
    hero: { label: 'You may qualify for up to', amount: 50000, tagline: 'Fast, clear,\ncredit when life can’t wait.', action: 'Check your limit',
      stats: [{ value: '<0.3%', label: 'Daily rate' }, { value: '91-180d', label: 'Terms' }, { value: '3 mins', label: 'Approval' }] },
    reviews: [
      { title: 'Borrow Again Anytime', text: '"Super convenient revolving limit! Paid my dues and was able to borrow again in just a few minutes with higher limit. Thanks po!"', name: 'John S.' },
      { title: '100% Legit, Low Interest', text: '"Salamat po! Legit and highly recommended, low interest and no hidden fees. Now on my 3rd loan with a higher limit!"', name: 'Maria C.' },
      { title: 'High Limit, Long Terms', text: '"A lifesaver for emergencies—high initial amount, fair fees, and flexible repayment terms. 5 stars!"', name: 'Angela R.' }],
    offer: { logo: 'loadcash', name: 'LoadCash', tag: 'Best match', label: 'Max amount', value: '₱50,000', rows: [{ label: 'Max term', value: '180 days' }] },
    banners: [{ id: 'b1', title: 'Invite a friend', body: 'You both get a coupon when they take their first loan.' }, { id: 'b2', title: 'Pay early, save more', body: 'See how early payments lower your interest.' }],
    /* repayments (Tune → Loan: Repaying / Overdue): the current loan's payments (coupons-data.js → current), so they agree with the used credit */
    payment: d0 ? { amount: d0.amount, was: null, due: d0.dueShort, badge: d0.badge || 'Overdue · ' + d0.late + ' days', stage: d0.today ? 'today' : 'upcoming' } : null,
    overdue: d0 ? { amount: d0.amount + d0.penalty, was: null, due: d0.dueShort, badge: 'Overdue · ' + d0.late + ' days', penalty: cur.penalty,
      notice: { title: 'Last day to pay without a penalty', body: 'Pay by 11:59 PM today to avoid a ' + money(cur.penalty) + ' penalty on ' + cur.penaltyDate + '.' } } : null,
    penalties: [['Days 1-3', 'No penalty, but your payment is overdue.'], ['Day 4', '5% of the unpaid principal for each installment.'], ['Every 30 days', 'Another 5% on the principal that’s still unpaid.']],
    dues: due,
    payNo: 'PH0000351234567',
    /* where the money goes */
    wallets: [{ id: 'maya', name: 'Maya', note: 'Supports ₱50k+ loans' }, { id: 'gcash', name: 'GCash', note: 'Supports ₱50k+ loans' }, { id: 'coins', name: 'Coins.ph', note: 'Supports ₱50k+ loans' },
      { id: 'grabpay', name: 'GrabPay' }, { id: 'shopeepay', name: 'ShopeePay' }],
    banks: [['aub', 'Asia United Bank'], ['bdo', 'Banco de Oro (BDO)'], ['bpi', 'Bank of the Philippine Islands'], ['bpi-banko', 'BPI Globe BanKO'], ['bangko-mabuhay', 'Bangko Mabuhay'], ['bank-of-commerce', 'Bank of Commerce'],
      ['chinabank', 'Chinabank'], ['chinabank-savings', 'Chinabank Savings'], ['eastwest', 'EastWest Bank'], ['gotyme', 'GoTyme Bank'], ['hsbc', 'HSBC'], ['landbank', 'Landbank'], ['maybank', 'Maybank'], ['metrobank', 'Metrobank'],
      ['pnb', 'Philippine National Bank'], ['psbank', 'PSBank'], ['rcbc', 'RCBC'], ['security-bank', 'Security Bank'], ['unionbank', 'UnionBank']],
    scams: [
      { anim: 'customer-service', title: 'Customer service is only available in the app', body: 'If you’re unsure about anything, contact customer service in the app.' },
      { anim: 'safe-transaction', title: 'Keep all payments and transactions in the app', body: 'Watch out for people who say they represent us on Facebook, by SMS or elsewhere. Don’t pay anyone for a higher credit limit or other offers outside the app.' },
      { anim: 'verification-code', title: 'Keep your verification code private', body: 'Never share it with anyone, even if they say they’re our staff. We’ll never ask for your code.' }],
    permissions: [
      { icon: 'camera', title: 'Camera', body: 'Used for facial verification, ID verification, and uploading ID photos.' },
      { icon: 'smartphone', title: 'Device information', body: 'Helps prevent fraud, detect unusual activity, and improve service reliability.' },
      { icon: 'app', title: 'App list', body: 'Helps prevent fraud and assess your eligible credit limit.' },
      { icon: 'location', title: 'Location', body: 'Helps prevent fraud, detect unusual activity, and improve service reliability.' },
      { icon: 'notification', title: 'Notification', body: 'Keeps you updated on your application status, coupons, and promotions.' },
      { icon: 'message', title: 'SMS', body: 'Lets us fill in your verification code for you.' }],
    money: money
  };
})();
