/* PeraSure Dev Mode — the app's pages: how each one is opened in the canvas, grouped like Figma sections.
   q: Tune / URL settings for the app (added to BASE) · page: a screen opened by ?page= · tab: home | payment | account
   js: run in the app once it has started (opens a page with params, a sheet, a state) · states: other states of the same page.
   The component list, file, lines and Figma nodes of each page come from devmode/data/index.js (tools/devmode-index.py). */
window.DM_PAGES = (function () {
  var BASE = 'fast=1&auto=0&blur=0&intro=0&temp=1&coupons=6&net=normal&otp=ok&kyc=pass&selfie=pass&inbox=unread&rating=0';
  var A = 'user=approved&loan=active';
  function sheet(name, params) { return "APP.open('" + name + "'" + (params ? ', ' + params : '') + ')'; }
  var SECTIONS = [
    { id: 'start', name: '启动与登录', en: 'Start & log in', pages: [
      { id: 'login', name: '登录', en: 'Log in', q: 'user=guest', page: 'login' },
      { id: 'sending', name: '发送验证码', en: 'Sending code', q: 'user=guest', page: 'sending' },
      { id: 'otp', name: '输入验证码', en: 'Verification code', q: 'user=guest', page: 'otp' },
      { id: 'permission', name: '权限说明', en: 'Permissions', q: 'user=new', page: 'permission' },
      { id: 'opening', name: '启动页', en: 'Opening', q: A, js: "APP.set({ stack: [{ name: 'opening', key: 'dm' + Date.now(), params: {} }] })", note: '约 1 秒后自动进入首页', noteEn: 'Moves on to home after about a second' }] },
    { id: 'home', name: '首页', en: 'Home', pages: [
      { id: 'home', name: '首页', en: 'Home', q: A, tab: 'home', states: [
        { name: '额度可用 · 还款中', en: 'Credit ready · repaying', q: A },
        { name: '额度可用 · 未借款', en: 'Credit ready · no loan', q: 'user=approved&loan=none' },
        { name: '逾期', en: 'Overdue', q: 'user=approved&loan=overdue' },
        { name: '借款审核中', en: 'Loan in review', q: 'user=approved&loan=reviewing' },
        { name: '放款失败', en: 'Transfer failed', q: 'user=approved&loan=failed' },
        { name: '未登录', en: 'Logged out', q: 'user=guest' },
        { name: '新用户', en: 'New user', q: 'user=new' },
        { name: '申请审核中', en: 'Application in review', q: 'user=review' },
        { name: '需补充材料', en: 'Documents needed', q: 'user=docs' },
        { name: '申请未通过', en: 'Not approved', q: 'user=declined' },
        { name: '额度已过期', en: 'Limit expired', q: 'user=expired' },
        { name: '额度冻结', en: 'Credit on hold', q: 'user=hold' },
        { name: '额度提升动画', en: 'Credit limit increase', q: A + '&intro=1' }] }] },
    { id: 'loan', name: '借款', en: 'Borrow', pages: [
      { id: 'withdraw', name: '借款金额（Withdraw）', en: 'Amount (Withdraw)', q: A + '&loan=none', tab: 'home', js: 'APP.borrow()', host: true, note: '这一段运行的是 Withdraw demo 自己的代码（prototypes/withdraw-fund-flow/withdraw.js）', noteEn: 'This part runs the Withdraw demo’s own code (prototypes/withdraw-fund-flow/withdraw.js)' },
      { id: 'amount', name: '输入金额（备用页）', en: 'Amount (fallback)', q: A, page: 'amount', note: 'Withdraw 加载失败时才出现', noteEn: 'Shows only when the Withdraw demo can’t load' },
      { id: 'loan', name: '借款详情（备用页）', en: 'Loan details (fallback)', q: A, page: 'loan' },
      { id: 'method', name: '收款方式', en: 'Withdrawal method', q: A, page: 'method' },
      { id: 'order', name: '借款申请状态', en: 'Loan application', q: 'user=approved&loan=reviewing', page: 'order', states: [
        { name: '审核中', en: 'In review', q: 'user=approved&loan=reviewing' }, { name: '放款失败', en: 'Transfer failed', q: 'user=approved&loan=failed' }] },
      { id: 'coupons', name: '优惠券中心', en: 'Coupon centre', q: A, page: 'coupons', states: [{ name: '6 张', en: 'Six', q: A + '&coupons=6' }, { name: '1 张', en: 'One', q: A + '&coupons=1' }, { name: '没有', en: 'None', q: A + '&coupons=0' }] },
      { id: 'picker', name: '选择优惠券', en: 'Choose coupons', kind: 'sheet', q: A + '&loan=none', tab: 'home', js: 'APP.borrow()', note: '在借款页点优惠券的 See all 打开', noteEn: 'Opened from “See all” in the loan page’s coupons' },
      { id: 'keep', name: '保留优惠券？', en: 'Keep your coupon?', kind: 'sheet', q: A, page: 'loan', js: sheet('keep', '{}') },
      { id: 'plan', name: '还款计划', en: 'Repayment plan', kind: 'sheet', q: A, page: 'loan', js: "(function t() { if (APP.S.L) APP.open('plan'); else setTimeout(t, 50); })()", note: '借款页的数据就绪后打开（要用到这笔借款的金额和期数）', noteEn: 'Opens once the loan page has its loan (it needs the amount and the terms)' },
      { id: 'banks', name: '选择银行', en: 'Choose your bank', kind: 'sheet', q: A, page: 'method', js: sheet('banks') }] },
    { id: 'repay', name: '还款', en: 'Repay', pages: [
      { id: 'payment', name: '还款', en: 'Repay', q: A, tab: 'payment', states: [
        { name: '还款中', en: 'Repaying', q: A }, { name: '逾期', en: 'Overdue', q: 'user=approved&loan=overdue' }, { name: '没有待还', en: 'Nothing to repay', q: 'user=approved&loan=none' }, { name: '未登录', en: 'Logged out', q: 'user=guest' }] },
      { id: 'pay', name: '支付页', en: 'Pay', q: A, page: 'pay', states: [
        { name: 'App 支付', en: 'App', q: A, js: "APP.go('pay', { total: 2000, method: { name: 'GCash', kind: 'app' } })" },
        { name: '二维码', en: 'QR code', q: A, js: "APP.go('pay', { total: 2000, method: { name: 'GCash', kind: 'qr' } })" },
        { name: '转账', en: 'Transfer', q: A, js: "APP.go('pay', { total: 2000, method: { name: 'BPI', kind: 'transfer' } })" }] },
      { id: 'paydetail', name: '还款明细', en: 'Payment detail', kind: 'sheet', q: 'user=approved&loan=overdue', tab: 'payment', js: sheet('paydetail', '{}') },
      { id: 'scams', name: '防诈骗提示', en: 'Anti-scam tips', kind: 'sheet', q: A, tab: 'payment', js: sheet('scams', '{}') },
      { id: 'paymethods', name: '选择还款方式', en: 'Choose how to pay', kind: 'sheet', q: A, tab: 'payment', js: sheet('paymethods', '{ total: 2000 }') }] },
    { id: 'apply', name: '申请额度', en: 'Apply for credit', pages: [
      { id: 'kyc-estimate', name: '借款估算', en: 'Loan estimate', q: 'user=new', page: 'kyc-estimate' },
      { id: 'kyc-basic', name: '基本信息', en: 'Basic information', q: 'user=new', page: 'kyc-basic' },
      { id: 'kyc-id', name: '身份证件', en: 'ID', q: 'user=new', page: 'kyc-id', states: [
        { name: '未选择', en: 'Not chosen', q: 'user=new' },
        { name: '已上传', en: 'Uploaded', q: 'user=new', js: "APP.set({ kyc: { type: 'UMID', front: PS.asset('art/id-front.png'), back: PS.asset('art/id-back.png') } })" }] },
      { id: 'camera', name: '证件拍照', en: 'ID camera', q: 'user=new', page: 'camera' },
      { id: 'kyc-check', name: '核对信息', en: 'Check the details', q: 'user=new', page: 'kyc-check' },
      { id: 'kyc-selfie', name: '自拍', en: 'Selfie', q: 'user=new', page: 'kyc-selfie' },
      { id: 'kyc-contact', name: '紧急联系人', en: 'Trusted contact', q: 'user=new', page: 'kyc-contact' },
      { id: 'docs', name: '补充收入证明', en: 'Proof of income', q: 'user=docs', page: 'docs' },
      { id: 'id-inuse', name: '证件已被使用', en: 'ID already in use', kind: 'sheet', q: 'user=new', page: 'kyc-id', js: sheet('id-inuse') },
      { id: 'id-failed', name: '证件识别失败', en: 'ID check failed', kind: 'sheet', q: 'user=new', page: 'kyc-id', js: sheet('id-failed') },
      { id: 'date', name: '选择日期', en: 'Select date', kind: 'sheet', q: 'user=new', page: 'kyc-check', js: sheet('date', '{ value: { y: 1995, m: 0, d: 1 }, min: { y: 1940, m: 0, d: 1 }, max: { y: 2008, m: 10, d: 12 } }') },
      { id: 'city', name: '选择城市', en: 'Select city', kind: 'sheet', q: 'user=new', page: 'kyc-check', js: sheet('city', '{}') }] },
    { id: 'account', name: '账户', en: 'Account', pages: [
      { id: 'account', name: '我的', en: 'Account', q: A, tab: 'account', states: [{ name: '已登录', en: 'Logged in', q: A }, { name: '未登录', en: 'Logged out', q: 'user=guest' }] },
      { id: 'hub', name: '额度中心', en: 'Credit limit hub', q: A, page: 'hub' },
      { id: 'credit', name: '额度记录', en: 'Credit history', q: A, page: 'credit' },
      { id: 'inbox', name: '消息中心', en: 'Inbox', q: A, page: 'inbox', states: [{ name: '有未读', en: 'Unread', q: A + '&inbox=unread' }, { name: '全部已读', en: 'All read', q: A + '&inbox=read' }, { name: '没有消息', en: 'Empty', q: A + '&inbox=empty' }] },
      { id: 'message', name: '消息详情', en: 'Message', q: A, js: "APP.go('message', { msg: { kind: 'Reminder', time: '5d ago', title: 'You have a new coupon', body: '25% off first-payment interest on your next loan. Use it before Nov 13, 2026.' } })" },
      { id: 'history', name: '借款记录', en: 'Loan history', q: A, page: 'history' },
      { id: 'loan-record', name: '借款详情', en: 'Loan record', q: A, js: "APP.go('loan-record', { item: { id: 'h0', date: 'JULY 5, 2026', amount: 2000, state: 'none' } })" },
      { id: 'cancel', name: '取消借款', en: 'Cancel a loan', q: A, page: 'cancel' },
      { id: 'manage', name: '账户管理', en: 'Manage account', q: A, page: 'manage' },
      { id: 'delete', name: '注销账户', en: 'Delete account', q: A, page: 'delete' },
      { id: 'about', name: '关于 PeraSure', en: 'About PeraSure', q: A, page: 'about' },
      { id: 'sec', name: 'SEC 注册信息', en: 'SEC registration', q: A, page: 'sec' },
      { id: 'bir', name: 'BIR 注册信息', en: 'BIR registration', q: A, page: 'bir' },
      { id: 'doc', name: '协议文本', en: 'Legal text', q: A, js: "APP.go('doc', { title: 'Terms of Service' })" },
      { id: 'support', name: '联系我们', en: 'Contact us', q: A, page: 'support' },
      { id: 'logout', name: '退出登录', en: 'Log out', kind: 'sheet', q: A, tab: 'account', js: sheet('logout') },
      { id: 'delete-ok', name: '确认注销', en: 'Delete your account?', kind: 'sheet', q: 'user=approved&loan=none', page: 'delete', js: sheet('delete-ok') },
      { id: 'delete-no', name: '暂时无法注销', en: 'Can’t delete yet', kind: 'sheet', q: A, page: 'delete', js: sheet('delete-no') },
      { id: 'rating', name: '评分', en: 'Rating', kind: 'sheet', q: A, tab: 'home', js: sheet('rating') }] },
    { id: 'help', name: '帮助与安全', en: 'Help & security', pages: [
      { id: 'faqs', name: '帮助中心', en: 'Help centre', q: A, page: 'faqs' },
      { id: 'faq-topic', name: '帮助分类', en: 'Help topic', q: A, js: "APP.go('faq-topic', { id: 'apply' })" },
      { id: 'faq', name: '帮助文章', en: 'Help article', q: A, js: "APP.go('faq', { id: 'eligible' })" },
      { id: 'phone-old', name: '更换手机号 · 旧号码', en: 'Change number · old', q: A, page: 'phone-old' },
      { id: 'phone-new', name: '更换手机号 · 新号码', en: 'Change number · new', q: A, page: 'phone-new' },
      { id: 'phone-selfie', name: '更换手机号 · 自拍', en: 'Change number · selfie', q: A, page: 'phone-selfie' },
      { id: 'face', name: '人脸确认', en: 'Confirm your identity', q: A, js: "APP.go('face', { phone: '9171234567' })" }] },
    { id: 'other', name: '其他', en: 'Other', pages: [
      { id: 'missing', name: '未上线页面', en: 'Not built yet', q: A, page: 'missing' }] }];
  var BY = {};
  SECTIONS.forEach(function (s) { s.pages.forEach(function (p) { p.section = s.id; p.kind = p.kind || (p.tab && !p.js ? 'tab' : 'screen'); p.code = p.code || (p.tab && !p.js ? p.tab : p.id); BY[p.id] = p; }); });
  /* url(page, state, root): the app's address for a page (root: '' for the live app, a snapshot's folder for an old version) */
  function url(p, st, root) {
    var q = (st && st.q) || p.q || '', page = p.page ? '&page=' + p.page : p.tab && p.tab !== 'home' ? '&page=' + p.tab : '';
    /* the deploy stamp (stamp.py) makes phones and browsers fetch a fresh app after an update, as the picker's links do */
    var st = (document.querySelector('script[src*="data/pages.js"]') || {}).src, v = st && /[?&]v=(\w+)/.exec(st);
    return (root || '../') + 'prototypes/app/index.html?' + BASE + '&' + q + page + (v && (!root || root === '../') ? '&v=' + v[1] : '');
  }
  return { BASE: BASE, sections: SECTIONS, byId: BY, url: url, js: function (p, st) { return (st && st.js) || p.js || ''; } };
})();
