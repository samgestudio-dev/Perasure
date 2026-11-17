/* PeraSure Dev Mode — the iteration record (written with every requirement; the rules are in .claude/skills/perasure-iteration-log).
   One entry per iteration, newest first:
   { id            folder of its runnable snapshot in devmode/snapshots/ and the git tag devmode-<id>
     label         'v1.0' for a major version; 'v1 · 2026-11-20 · PHL-123' for an iteration ('无 Jira 单号' when there is none)
     major         1, 2 … (only a large redesign starts a new one)
     date          'YYYY-MM-DD'
     jira          { key, title, url } or null
     title         one line: what this iteration is — { zh, en } (the platform switches language)
     summary       a few sentences for designers and developers — { zh, en }
     changes: [ { type: 'ui' | 'motion', action: 'add' | 'edit' | 'remove', pages: [page ids], components: [names],
                  title: { zh, en }, detail: { zh, en } (values before → after where it helps), figma: ['10842:29606'] } ] }
   A global iteration (tokens / global components, owner 2026-11-17) adds: overview 'iterations/<id>/' (its folder in devmode/: visual/report.json +
   before | after | difference pictures, shown on the iteration's page), doc 'devmode/iterations/<id>/README.md' (the brief for developers' AI,
   returned by the MCP get_iteration) and tokens '<token version>'.
   The page ids are devmode/data/pages.js's; the component names are PS.<Name> without "PS.". */
window.DM_ITERATIONS = [
  {
    id: 'v1-20261117-n1', label: 'v1 · 2026-11-17 · 无 Jira 单号', major: 1, date: '2026-11-17', jira: null,
    overview: 'iterations/v1-20261117-n1/', doc: 'devmode/iterations/v1-20261117-n1/README.md', tokens: '2026.11.17',
    title: { zh: '全局组件：数字字体换 Reddit Sans，导航栏去掉渐进模糊、按页面层级换色', en: 'Global components: Reddit Sans numbers, bars without progressive blur, coloured by page level' },
    summary: { zh: 'Token 更新到 2026.11.17（旧版本 2026.11.12 的 CSS 名和值保留在 tokens/legacy/2026.11.12.css）。数字字体从 Satoshi 换成 Reddit Sans（自带 ₱），只用于强调金额，并统一挂 6 个 Number 字号样式（xs 16 / sm 18 / md 24 / lg 32 / xl 36 / xxl 48，全部 Bold）；金额旁的小字标注用 Inter，标题里只有 ₱ 用数字字体。顶栏、底栏、Tab 栏去掉渐进模糊，每条栏只用一个 token 渐变：一级页顶栏 Top-nav-filled（改成 Ambient 色）、Tab 栏 Bottom-primary-nav-filled；二级页顶栏实色页面底色、底栏 Bottom-secondary-nav-filled；借款金额页和借款详情页顶栏 Top-nav-filled、底栏 secondary；优惠券选择 sheet 底部也用 secondary。Withdraw 的金额 morph 和额度提升动画已逐帧检查。本页下方是所有改动页面和组件的旧 | 新 | 差异对比，开发说明见 README.md。',
      en: 'Tokens update to 2026.11.17 (the old CSS names and values of 2026.11.12 stay in tokens/legacy/2026.11.12.css). The number font is Reddit Sans instead of Satoshi (it has its own ₱), used only for emphasised amounts and always in one of six Number styles (xs 16 / sm 18 / md 24 / lg 32 / xl 36 / xxl 48, all Bold); small notes beside an amount are Inter, and a title draws only its ₱ in the number font. The header, bottom and tab bars lose their progressive blur and each is one token gradient: tab pages get Top-nav-filled (now the Ambient colour) and a Bottom-primary-nav-filled tab bar; secondary pages a solid header and Bottom-secondary-nav-filled; the amount entry and the order page Top-nav-filled with the secondary bottom; the coupon picker sheet’s foot is secondary too. The Withdraw amount morph and the Credit limit increase were checked frame by frame. Below: before | after | difference of every changed page and component; the developer brief is README.md.' },
    changes: [
      { type: 'ui', action: 'edit', pages: [], components: [],
        title: { zh: 'Token 2026.11.12 → 2026.11.17（旧值保留）', en: 'Tokens 2026.11.12 → 2026.11.17 (old values kept)' },
        detail: { zh: 'Font/Family/Number：Satoshi → Reddit Sans（--font-family-satoshi → --font-family-reddit-sans）；新增文字样式 Number/xs·sm·md·lg·xl·xxl；新增 Color/Gradient/Ambient/0·20·40·60·80（#F0F5F4 × 透明度）；Gradient/Top-nav-filled：Default 灰 80→40→0 → Ambient 80→40→0；Gradient/Bottom-nav-filled 改名 Bottom-primary-nav-filled（值不变）；新增 Bottom-secondary-nav-filled（Ambient 0→60→80）；Top/Bottom-nav-effect（渐进模糊）关闭。旧 CSS 名和值：tokens/legacy/2026.11.12.css。',
          en: 'Font/Family/Number: Satoshi → Reddit Sans (--font-family-satoshi → --font-family-reddit-sans); new text styles Number/xs·sm·md·lg·xl·xxl; new Color/Gradient/Ambient/0·20·40·60·80 (#F0F5F4 at an opacity); Gradient/Top-nav-filled: Default grey 80→40→0 → Ambient 80→40→0; Gradient/Bottom-nav-filled renamed Bottom-primary-nav-filled (same value); new Bottom-secondary-nav-filled (Ambient 0→60→80); Top/Bottom-nav-effect (progressive blur) off. Old CSS names and values: tokens/legacy/2026.11.12.css.' },
        figma: ['13736:15112'] },
      { type: 'ui', action: 'edit', pages: ['home', 'payment', 'account', 'withdraw', 'amount', 'loan', 'picker', 'method', 'order', 'coupons', 'pay', 'kyc-estimate', 'hub', 'credit', 'history', 'loan-record', 'login', 'permission'],
        components: ['Bands', 'TopBar', 'BottomBar', 'Navigator', 'Screen', 'Sheet', 'APP.WdHero'],
        title: { zh: '顶栏 / 底栏 / Tab 栏：去掉渐进模糊，按页面层级用 token 渐变', en: 'Header / bottom / tab bars: no progressive blur, a token gradient by page level' },
        detail: { zh: '以前：5 层遮罩的 backdrop-blur + veil；关模糊时顶栏 Subtle 白 80→40→0、底栏 Default 灰 0→60→80、二级页底栏 #EBF0EF。现在只有 veil：一级页顶栏 --gradient-top-nav-filled、Tab 栏 --gradient-bottom-primary-nav-filled；二级页顶栏实色（不变）、底栏 --gradient-bottom-secondary-nav-filled；借款金额 / 借款详情页顶栏 top-nav-filled、底栏 BottomBar{secondary}；page sheet 底部 secondary（Figma 13732:12513）。Tune 的渐进模糊开关去掉。Withdraw demo（withdraw.js BLUR = false）和 Change co-maker 同样处理。',
          en: 'Before: five masked backdrop-blur layers + the veil; with blur off, header Subtle white 80→40→0, bottom Default grey 0→60→80, secondary bottom #EBF0EF. Now the veil only: tab pages header --gradient-top-nav-filled, tab bar --gradient-bottom-primary-nav-filled; secondary pages solid header (unchanged), bottom --gradient-bottom-secondary-nav-filled; amount entry / order page header top-nav-filled, bottom BottomBar{secondary}; a page sheet’s foot secondary (Figma 13732:12513). The Tune blur setting is gone. The Withdraw demo (withdraw.js BLUR = false) and Change co-maker likewise.' },
        figma: ['13736:15137', '13736:15163', '13736:15182', '13732:12513'] },
      { type: 'ui', action: 'edit', pages: ['home', 'withdraw', 'amount', 'loan', 'picker', 'kyc-estimate', 'payment', 'pay', 'order', 'account', 'hub', 'credit', 'history', 'loan-record', 'coupons'],
        components: ['Amount', 'Peso', 'CreditCard', 'PaymentCard', 'HomeCoupons', 'Summary', 'AmountCard', 'EstimateCard', 'AmountEntry', 'CreditLimitCard', 'HubCard', 'Tips', 'RepayCard', 'OrderHead', 'Installment', 'PayBar', 'HistoryRow', 'ActivityItem', 'Hero', 'OfferCard', 'CouponTicket', 'CouponOption', 'APP.WdHero'],
        title: { zh: '数字字体 Reddit Sans：只用于强调金额，统一 Number 样式', en: 'Reddit Sans numbers: emphasised amounts only, in the Number styles' },
        detail: { zh: '首页额度卡 Number/xl + .00 Number/xs（字距 +3% → +4%）；还款卡 Number/md（₱ 从 Inter Medium → Bold）；优惠券选择合计 20/28 → Number/md 24/32；借款金额卡 / 估算卡 Number/lg（₱ 从 Inter → Reddit Sans，字距 −0.5% → +2%）；输入金额 ₱ Inter 28 → Number/lg、数字 Number/xxl、.00 18 → Number/xs；「我的」额度卡 Inter SemiBold 16 → Number/xs；额度中心卡 28 → Number/lg + .00 Number/xs，Used / Available → Inter 12；支付页 Inter 32 → Number/lg；借款申请状态 / 借款详情 Number/lg；还款 tab 每期 Number/sm、合计 Inter Bold 28 → Number/md；借款记录 Inter SemiBold 18 → Number/sm；额度记录 Inter Bold 16 → Number/xs；未登录首页大额度 Number/xl；More for you 28 → Number/lg 32；首页优惠券面值改回标题字体（Hanken），只有 ₱ 用 Reddit Sans（PS.Peso，券中心和券选择同理）；Tips 序号 Satoshi → Hanken；额度卡 Total credit → Inter SemiBold 14。',
          en: 'Home credit card Number/xl + ".00" Number/xs (+3 % → +4 %); payment card Number/md (₱ Inter Medium → Bold); coupon picker total 20/28 → Number/md 24/32; amount card / estimate Number/lg (₱ Inter → Reddit Sans, −0.5 % → +2 %); amount entry ₱ Inter 28 → Number/lg, digits Number/xxl, ".00" 18 → Number/xs; account credit card Inter SemiBold 16 → Number/xs; hub card 28 → Number/lg + ".00" Number/xs, Used / Available → Inter 12; pay page Inter 32 → Number/lg; loan application / record Number/lg; payment tab instalments Number/sm, total Inter Bold 28 → Number/md; loan history Inter SemiBold 18 → Number/sm; credit history Inter Bold 16 → Number/xs; guest hero Number/xl; More for you 28 → Number/lg 32; home coupon values back to the title font (Hanken), only ₱ in Reddit Sans (PS.Peso; coupon centre and picker alike); Tips numbers Satoshi → Hanken; credit card “Total credit” → Inter SemiBold 14.' },
        figma: ['13732:12232', '13732:12513', '13732:12950', '13732:13606', '13732:13892', '13733:14774', '13748:15869'] },
      { type: 'motion', action: 'edit', pages: ['withdraw', 'home'], components: ['APP.WdHero'],
        title: { zh: '金额 morph 和额度提升动画换字体后重调并逐帧检查', en: 'Amount morph and Credit limit increase re-tuned for the new font, checked frame by frame' },
        detail: { zh: '输入金额 → 借款卡 morph：₱ 28→32 改为 32→32（Bold 700，不再从 Inter 500 过渡到 700），数字字距 1.44→−0.16 改为 1.44→0.64，.00 18→32 改为 16→32；每个字形盒子带上 Reddit Sans 的字偶距（Component.KERN），尾部「0」与「.」在卡片里相互字偶。逐帧（60 fps）对比旧快照：路径单调、曲线一致、最后一帧 = 静止帧，静止时字形与整段文字位置误差 ≤ 0.03 px。额度提升 → 首页卡 FLIP：起始缩放 1.778、平滑收敛，交接时宽度差与旧版一致。',
          en: 'Amount entry → loan card morph: ₱ 28→32 is now 32→32 (Bold 700, no longer riding Inter 500 → 700), digit spacing 1.44→−0.16 is now 1.44→0.64, ".00" 18→32 is now 16→32; every glyph box carries Reddit Sans’s pair kerning (Component.KERN), the tail’s “0” kerns into “.” in the card. Frame by frame (60 fps) against the old snapshot: monotonic paths, the same curve, last frame = settled frame, settled glyphs within 0.03 px of the unsplit text. Credit limit increase → home card FLIP: starts at scale 1.778 and settles smoothly; the hand-off width step is as before.' } }
    ]
  },
  {
    id: 'v1-20261116-n4', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '订单页优惠券列表：说明文字超出用「…」', en: 'Order page coupons: a long line ends in …' },
    summary: { zh: '订单页优惠券列表里，券的说明（如「Borrow ₱10,000 or more · 4 / 6 terms · One per account」）太长时会超出卡片。现在超出部分用「…」截断。顺带修正行高：标题 20 + 间距 4 + 说明 16 = 40（以前 44，比 Figma 多 4）。',
      en: 'In the order page’s coupons, a coupon’s line (like “Borrow ₱10,000 or more · 4 / 6 terms · One per account”) ran past the card when it was long. It now ends in … instead. The text block is also back to Figma’s height: title 20 + gap 4 + line 16 = 40 (it was 44).' },
    changes: [
      { type: 'ui', action: 'edit', pages: ['loan', 'plan', 'withdraw'], components: ['CouponRow', 'Swap'],
        title: { zh: '说明文字一行，超出用「…」', en: 'The line stays on one line and ends in …' },
        detail: { zh: 'Swap{block}：网格列宽随内容变宽 → grid-template-columns: minmax(0, 1fr)（列不超过容器，里面的文字才能截断）。.ps-crow__sub：行内 → display: block（ps-ellipsis 生效；行高由 44 → 40，与 Figma 一致）。文件 shared/ps-ui/core.js、ps-ui.css。',
          en: 'Swap{block}: the grid column grew with its content → grid-template-columns: minmax(0, 1fr) (the column never passes the box, so the text inside can be cut). .ps-crow__sub: inline → display: block (ps-ellipsis works; the text block 44 → 40, as in Figma). Files: shared/ps-ui/core.js, ps-ui.css.' } }
    ]
  },
  {
    id: 'v1-20261116-n3', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '「保留优惠券？」：多张券放进同一张卡，左右滑', en: 'Keep your coupon?: more than one coupon in one card, swiped' },
    summary: { zh: '一次改动让两张券都不满足条件时，以前会连续弹两个卡片，要点两次。现在两张券左右并排放在同一张卡里，像防诈骗提示（scams）那样左右滑，下面的圆点跟着手指走，卡片按最高的那页定高；只有当前这页的券在播动画，滑回来从头播。Keep / Don’t use 作用于当前这张，然后滑到下一张还没回答的；全部回答完卡片收起，借款一次改好，只弹一条提示。点关闭：已回答的生效，没回答的保持取消。布局按 Figma 10893:29050：圆点在 facts 下 12、按钮上 20；图片到标题从 28 改为 16（一张券时也一样）。Coupon system demo 和 app 都已更新。',
      en: 'When one change took off two coupons, the app showed two cards, one after the other. Now the coupons sit side by side in one card and are swiped like the anti-scam tips: the dots follow the finger, the card keeps the height of its tallest page, and only the coupon on show plays its animation (from the start each time it comes back). Keep and Don’t use answer the coupon on show and move on to the next one not yet answered. Once every coupon is answered the card closes and the loan changes once, with one toast. Closing the card keeps the answers given so far; the rest stay off. Layout from Figma 10893:29050: the dots 12 under the facts and 20 above the buttons; picture → title is 16 instead of 28, with one coupon too. Updated in the Coupon system demo and the app.' },
    changes: [
      { type: 'ui', action: 'add', pages: ['keep'], components: ['Decision'],
        title: { zh: 'Decision 新增 pages / index / onIndex', en: 'New Decision props: pages, index, onIndex' },
        detail: { zh: '一次只显示一张券（art · title · body · facts）→ 再加 pages [{ art, title, body, facts }] · index · onIndex：多于一张时放进 PS.Carousel（dots、gap md），关闭按钮和两个按钮不动、作用于当前页；一张时和以前一样。文件 shared/ps-ui/coupon.js、ps-ui.css（.ps-decide__pages padding-bottom: --spacing-padding-xl）。',
          en: 'One coupon at a time (art · title · body · facts) → plus pages [{ art, title, body, facts }] · index · onIndex: more than one goes into a PS.Carousel (dots, gap md); the close button and the buttons stay put and act on the page on show; one coupon looks as before. Files: shared/ps-ui/coupon.js, ps-ui.css (.ps-decide__pages padding-bottom: --spacing-padding-xl).' },
        figma: ['10893:29050'] },
      { type: 'ui', action: 'edit', pages: ['keep'], components: ['Decision'],
        title: { zh: '图片到标题 28 → 16', en: 'Picture → title 28 → 16' },
        detail: { zh: '.ps-decide__text margin-top：--spacing-gap-lg（16，加上 body gap 12 = 28）→ --spacing-gap-xs（4，合计 16），按 Figma 10893:29050。一张券和多张券都适用。',
          en: '.ps-decide__text margin-top: --spacing-gap-lg (16, with the body gap of 12 = 28) → --spacing-gap-xs (4, 16 in all), from Figma 10893:29050. One coupon and several alike.' },
        figma: ['10893:29050'] },
      { type: 'motion', action: 'add', pages: ['keep'], components: ['Carousel', 'CouponArt'],
        title: { zh: '翻页沿用 scams 的 Carousel；券动画只在当前页播放', en: 'Paging uses the anti-scam Carousel; only the coupon on show animates' },
        detail: { zh: 'Carousel 新增 gap（页面 → 圆点，间距 token；默认 2xl 不变，Decision 用 md）。翻页、拖动、圆点跟手都是 Carousel 原样（Smooth spring 240/30/1）。CouponArt 新增 active：false 停在票券落定的那一帧（loop 标记），true 再次从头播放。',
          en: 'Carousel: new prop gap (pages → dots, a gap token; default 2xl unchanged, Decision uses md). Swiping, dragging and the dots following are the Carousel’s own (Smooth spring 240/30/1). CouponArt: new prop active — false holds the frame where the ticket has landed (the loop marker), true plays it again from the start.' } },
      { type: 'ui', action: 'edit', pages: ['keep'], components: [],
        title: { zh: '回答逻辑：一起回答，一次改借款', en: 'Answering: all together, the loan changes once' },
        detail: { zh: '以前：每张券单独弹卡片，点 Keep 立刻改借款并弹提示。现在：点完一张滑到下一张未回答的；全部回答完（或点关闭）才一次性改借款，只弹一条提示。app（prototypes/app/screens-loan.js）和 Coupon system（prototypes/coupon-system/coupon-system.js，新加载 pay.js）一致。Dev Mode「保留优惠券？」页现在真正打开这张卡，分一张券 / 两张券两个状态。',
          en: 'Before: one card per coupon, and Keep changed the loan and showed a toast at once. Now: answering a coupon moves on to the next one not yet answered; the loan changes once, with one toast, when all are answered (or the card is closed). The app (prototypes/app/screens-loan.js) and Coupon system (prototypes/coupon-system/coupon-system.js, which now loads pay.js) match. Dev Mode’s Keep your coupon? page now opens the card, with One coupon and Two coupons states.' } }
    ]
  },
  {
    id: 'v1-20261116-n2', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '「保留优惠券？」弹窗：优惠券插图换成动画', en: 'Keep your coupon?: the coupon picture is now an animation' },
    summary: { zh: '「保留优惠券？」弹窗里的优惠券插图改为播放新的 GSAP 动画（Playground → Animations 里的三个 Coupon 动画）：票券落下、印刷内容出现、徽章弹出，之后循环——百分比印章轻晃、₱ 硬币带厚度转一圈、箭头从凹槽飞出再回来。徽章按扁平风格绘制：一个右侧光源，硬阴影、单侧白边，没有渐变和 SVG 滤镜。其他地方（优惠券中心、首页、借款页的优惠券行）仍是静态插图。',
      en: 'The coupon picture in the Keep your coupon? sheet now plays the new GSAP animations (the three Coupon animations in Playground → Animations): the ticket lands, its print fills in and the badge pops on, then it loops — the % seal rocks, the ₱ coin turns a full circle with its thickness showing, the arrow shoots up out of its recess and back. The badges are drawn flat: one light from the right, hard shadows, a white rim on one side, no gradients or SVG filters. Everywhere else (coupon centre, home, the loan page’s coupon rows) keeps the still pictures.' },
    changes: [
      { type: 'motion', action: 'add', pages: ['keep'], components: ['CouponArt', 'Decision'],
        title: { zh: 'CouponArt 新增 animate；Decision 使用动画', en: 'New CouponArt prop animate; Decision uses it' },
        detail: { zh: 'CouponArt：静态 SVG（≥ 40 px 带白描边，< 40 px 简版）→ 再加 animate（布尔，≥ 40 px）：播放 animations/coupon-percentage | coupon-amount | coupon-credit-limit 的 GSAP 模块（60 fps，intro 0–66 帧，loop 66–210 帧，减少动态效果时显示静止帧）。Decision：CouponArt { size: 80 } → { size: 80, animate: true }。新增 PS.loadGsapModule：页面没有 import map 时也能加载这些模块（vendor/gsap@3.15.0 + Blob URL）。文件 shared/ps-ui/coupon.js、core.js、ps-ui.css（.ps-cart__anim）。',
          en: 'CouponArt: still SVG (40 px up with the white outline, below 40 px the plain one) → plus animate (boolean, 40 px up): plays the GSAP module of animations/coupon-percentage | coupon-amount | coupon-credit-limit (60 fps, intro frames 0–66, loop 66–210; reduced motion shows the resting frame). Decision: CouponArt { size: 80 } → { size: 80, animate: true }. New PS.loadGsapModule loads these modules on pages with no import map (vendor/gsap@3.15.0 + a Blob URL). Files: shared/ps-ui/coupon.js, core.js, ps-ui.css (.ps-cart__anim).' } }
    ]
  },
  {
    id: 'v1-20261116-n1', label: 'v1 · 2026-11-16 · 无 Jira 单号', major: 1, date: '2026-11-16', jira: null,
    title: { zh: '卡片：白环和阴影可以一起用', en: 'Card: the white ring and the shadow together' },
    summary: { zh: '首页的还款卡是「白环 + 阴影」，但 PS.Card 的 variant 只能选一个，所以 PaymentCard 一直往 className 里塞 ps-card--raised，绕开了 Card 的接口；首页优惠券卡更是自己写了 Card 的类名。现在 Card 多了一个 raised 属性，任何样式都能加阴影；其他属性（role、aria、按压动效）会传给元素，as 可以用 m.div。PaymentCard 和 HomeCoupons 改为通过接口使用 Card。外观没有变化：首页 16 个状态和这两个组件的像素比对完全一致。',
      en: 'Home’s payment card has the white ring and the shadow, but PS.Card’s variant takes one value, so PaymentCard added ps-card--raised by hand and the home coupons card wrote Card’s classes itself. Card now has a raised prop that adds the shadow to any variant, passes other props (role, aria-*, press motion) to its element, and takes as: m.div. PaymentCard and HomeCoupons use Card through its props. Nothing looks different: the 16 Home states and both components match pixel for pixel.' },
    changes: [
      { type: 'ui', action: 'add', pages: [], components: ['Card'],
        title: { zh: 'Card 新增 raised 属性', en: 'New Card prop: raised' },
        detail: { zh: 'variant plain | outline | raised（只能选一个）→ 再加 raised（布尔）：任何 variant 都能加默认阴影（--shadow-default）。variant: \'raised\' 照旧等于 plain + 阴影。其他属性传给元素，as 可传 m.div。组件库「Cards」状态多了一张 outline + raised。文件 shared/ps-ui/core.js。',
          en: 'variant plain | outline | raised (one value) → plus raised (boolean): the default shadow (--shadow-default) on any variant. variant: \'raised\' still means plain + shadow. Other props go to the element; as takes m.div. The gallery’s Cards state adds outline + raised. File: shared/ps-ui/core.js.' } },
      { type: 'ui', action: 'edit', pages: ['home'], components: ['PaymentCard', 'HomeCoupons'],
        title: { zh: '首页卡片改为通过接口使用 Card', en: 'Home cards use Card through its props' },
        detail: { zh: 'PaymentCard：className 里的 ps-card--raised → raised: true。HomeCoupons：自己写的 ps-card ps-card--outline → PS.Card { as: m.div, variant: \'outline\' }。外观不变。文件 shared/ps-ui/home.js。',
          en: 'PaymentCard: ps-card--raised in className → raised: true. HomeCoupons: its own ps-card ps-card--outline classes → PS.Card { as: m.div, variant: \'outline\' }. Looks the same. File: shared/ps-ui/home.js.' } }
    ]
  },
  {
    id: 'v1-20261113-n1', label: 'v1 · 2026-11-13 · 无 Jira 单号', major: 1, date: '2026-11-13', jira: null,
    title: { zh: '首页额度卡：大字号下不再多出空白', en: 'Home credit card: no gap under it at larger text sizes' },
    summary: { zh: '文字大小调到 130% 及以上（或用「等比放大 · rem」）时，首页蓝色额度卡下面会多出一段空白：130% 时多 59 px，430 宽的 rem 模式多 29 px。原因是给卡片留的位置用 rem 写，会跟着字号变大，而卡片是 Withdraw demo 自己的，用 px，不跟字号变。现在留的位置和卡片一样用 px，任何字号下卡片下面的间距都和默认一样；默认字号下画面不变。',
      en: 'At text sizes of 130 % and above (or with Capped zoom · rem), a gap appeared under the blue credit card on Home: 59 px at 130 %, 29 px on a 430 phone in rem. The space kept for the card was set in rem, so it grew with the text, but the card is the Withdraw demo’s own and stays the same size. The space is now set in px like the card, so the gap under it is the same at every text size. Nothing changes at the default text size.' },
    changes: [
      { type: 'ui', action: 'edit', pages: ['home'], components: ['APP.WdHero'],
        title: { zh: '额度卡的占位高度', en: 'Space kept for the credit card' },
        detail: { zh: '.app-wdhero 的 min-height：12.25rem（跟字号变，130% 时 254.8 px）→ 196px（和卡片一样高，任何字号都不变）。文件 prototypes/app/app.css。',
          en: '.app-wdhero min-height: 12.25rem (grew with the text: 254.8 px at 130 %) → 196px (the card’s own height, at every text size). File: prototypes/app/app.css.' } }
    ]
  },
  {
    id: 'v1.0', label: 'v1.0', major: 1, date: '2026-11-13', jira: null, baseline: true,
    title: { zh: 'v1.0 基线', en: 'v1.0 baseline' },
    summary: { zh: 'PeraSure app demo 的第一个完整版本：60 个页面和弹窗、169 个共享组件。之后的组件和动效迭代都以这一版为起点记录。',
      en: 'The first complete version of the PeraSure app demo: 60 pages and sheets, 169 shared components. Every component and motion iteration after it is recorded from here.' },
    changes: []
  }
];
