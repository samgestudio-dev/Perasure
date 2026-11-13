/* PeraSure Dev Mode — interface language (中文 / English). DM.t(key) for the platform's own words; DM.tx(value) for bilingual data
   ({ zh, en } or a plain string); DM.pageName(page) for a page of the registry. The choice is remembered in this browser. */
(function () {
  'use strict';
  var DM = window.DM = window.DM || {};
  var D = {
    zh: {
      'nav.pages': '页面', 'nav.components': '组件', 'nav.tokens': 'Token', 'nav.iterations': '迭代',
      'search': '搜索', 'search.pages': '搜索页面', 'search.components': '搜索组件', 'search.tokens': '搜索 token 名称或数值', 'layers': '图层', 'layers.empty': '画布加载后显示组件树',
      'mode.inspect': '检查', 'mode.interact': '交互', 'device': '设备', 'zoom.fit': '适应',
      'hint.inspect': '点击选中组件 · 按住 Alt 看间距 · Shift+Enter 选父级 · Esc 取消选中',
      'hint.interact': '交互模式：像在手机上一样操作 app，按 I 回到检查',
      'version': '版本', 'version.latest': '最新', 'version.old': '旧版本快照', 'version.viewing': '正在查看旧版本',
      'compare': '对比改动', 'tab.inspect': '检查', 'tab.history': '迭代记录',
      'state': '状态', 'page': '页面', 'sheet': '弹窗', 'tab': '标签页', 'component': '组件', 'instance': '实例',
      'lastIter': '最后迭代', 'res': '开发资源', 'res.source': '组件源码', 'res.page': '页面源码', 'res.figma': 'Figma 节点', 'res.gallery': '在组件页查看全部状态',
      'res.ds': '设计系统', 'res.app': 'App 设计稿', 'doc': '说明', 'props': '属性（本页传入）', 'props.none': '没有传入属性',
      'playground': '试玩状态', 'playground.none': '组件页里没有这个组件的状态', 'spec': '规格', 'code': '代码', 'list': '列表',
      'lang.jsx': 'React 用法 · JSX', 'lang.call': 'React 用法 · 仓库写法', 'lang.css': 'CSS', 'lang.source': '组件源码', 'unit': '单位',
      'tokens.used': '用到的 Token', 'tokens.none': '这个组件的样式里没有 token', 'motion': '动效参数', 'motion.none': '没有动效参数',
      'assets': '图标与插画', 'onPage': '本页的组件', 'usedOn': '用在这些页面', 'notOnPages': '没有直接用在 app 页面上（由其它组件使用）',
      'history.none': 'v1.0 之后没有改动', 'history.for': '影响它的迭代', 'copy': '复制', 'copied': '已复制', 'copyLink': '复制链接',
      'open.version': '在画布打开这一版', 'compare.latest': '和最新版对比', 'compare.prev': '和上一版对比', 'noJira': '无 Jira 单号',
      'type.ui': 'UI', 'type.motion': '动效', 'filter.all': '全部', 'loading': '加载中…', 'select.hint': '在画布上点一个组件，或在图层里选择',
      'pageInfo': '页面信息', 'g.layout': '布局', 'g.padding': '内边距', 'g.look': '外观', 'g.text': '文字',
      's.w': '宽', 's.h': '高', 's.top': '上', 's.right': '右', 's.bottom': '下', 's.left': '左', 's.gap': '间距', 's.dir': '方向', 's.column': '纵向', 's.row': '横向', 's.grid': '网格',
      's.radius': '圆角', 's.fill': '填充', 's.image': '背景图', 's.stroke': '描边', 's.shadow': '阴影', 's.opacity': '不透明度',
      's.style': '文字样式', 's.font': '字体', 's.size': '字号', 's.line': '行高', 's.color': '颜色', 'full': '全圆',
      'a.add': '新增', 'a.edit': '修改', 'a.remove': '删除', 'iter.summary': '概述', 'iter.changes': '改动', 'iter.pages': '页面', 'iter.components': '组件',
      'iter.count': '{n} 处改动', 'iter.baseline': '基线版本：之后的改动都从这里开始记录', 'iter.all': '全部迭代', 'iter.empty': '没有符合筛选的迭代',
      'tokens.title': 'PeraSure Token', 'tokens.sub': '设计系统的 token（tokens/tokens.css），只读。点名称或数值复制。', 'tokens.count': '{n} 个',
      'tk.color': '颜色', 'tk.space': '间距', 'tk.radius': '圆角', 'tk.type': '字体', 'tk.shadow': '阴影', 'tk.other': '其它',
      'comp.count': '{n} 个组件', 'page.count': '{n} 个页面', 'withdrawHost': 'Withdraw demo（独立代码）', 'stage.empty': '这个组件在组件页没有状态，请在使用它的页面里查看',
      'compareTitle': '版本对比', 'cmp.side': '并排', 'cmp.overlay': '叠加', 'cmp.sync': '同步操作', 'cmp.replay': '同步重放', 'cmp.speed': '速度',
      'cmp.changes': '这一版的改动', 'cmp.props': '属性对比', 'cmp.code': '代码对比', 'cmp.before': '旧', 'cmp.after': '新', 'cmp.close': '关闭',
      'cmp.pick': '在左侧改动列表里选一个组件', 'cmp.same': '两个版本这里没有不同', 'cmp.opacity': '新版不透明度', 'cmp.noChanges': '这两个版本之间没有记录的改动',
      'reload': '重新加载', 'cmp.syncTip': '在一边点、滑、输入，另一边同时做一样的操作', 'cmp.sameVersion': '两边是同一个版本。在上面选两个不同的版本来对比。', 'appPiece': 'App 自己的部分（不在组件库）', 'element': '元素', 'classes': '类名', 'spec.select': '在画布上选中组件后显示它的实际尺寸、间距和颜色', 'motion.note': '数值来自画布里这一版的 PS.MT（shared/ps-ui/core.js）',
      'howOpen': '打开方式', 'open.link': '链接（手机上直接打开这一页）', 'open.script': '进入后运行', 'open.phone': '在新窗口打开',
      'theme.system': '跟随系统', 'theme.light': '浅色', 'theme.dark': '深色', 'brand.sub': '开发模式', 'back.latest': '回到最新版',
      'stage.title': '组件页', 'stage.pick': '状态', 'stage.usedOnTip': '在用到它的页面里查看：', 'tokens.loading': '正在读取 tokens/tokens.css…',
      'tk.value': '数值', 'tk.preview': '预览', 'tk.name': '名称', 'iter.open': '在画布打开', 'iter.jira': 'Jira', 'iter.types': '类型',
      'dev.status': '开发状态', 'lang': 'EN'
    },
    en: {
      'nav.pages': 'Pages', 'nav.components': 'Components', 'nav.tokens': 'Tokens', 'nav.iterations': 'Iterations',
      'search': 'Search', 'search.pages': 'Search pages', 'search.components': 'Search components', 'search.tokens': 'Search a token name or value', 'layers': 'Layers', 'layers.empty': 'The component tree shows once the canvas has loaded',
      'mode.inspect': 'Inspect', 'mode.interact': 'Interact', 'device': 'Device', 'zoom.fit': 'Fit',
      'hint.inspect': 'Click to select · hold Alt for spacing · Shift+Enter selects the parent · Esc clears',
      'hint.interact': 'Interact: use the app as on a phone. Press I to inspect again',
      'version': 'Version', 'version.latest': 'Latest', 'version.old': 'Snapshot', 'version.viewing': 'Viewing an older version',
      'compare': 'Compare changes', 'tab.inspect': 'Inspect', 'tab.history': 'History',
      'state': 'State', 'page': 'Page', 'sheet': 'Sheet', 'tab': 'Tab', 'component': 'Component', 'instance': 'Instance',
      'lastIter': 'Last iteration', 'res': 'Dev resources', 'res.source': 'Component source', 'res.page': 'Page source', 'res.figma': 'Figma node', 'res.gallery': 'See every state in Components',
      'res.ds': 'Design system', 'res.app': 'App design', 'doc': 'Description', 'props': 'Properties (as this page passes them)', 'props.none': 'No properties passed',
      'playground': 'Explore states', 'playground.none': 'Components has no states for this one', 'spec': 'Properties', 'code': 'Code', 'list': 'List',
      'lang.jsx': 'React usage · JSX', 'lang.call': 'React usage · as in the repo', 'lang.css': 'CSS', 'lang.source': 'Component source', 'unit': 'Unit',
      'tokens.used': 'Tokens used', 'tokens.none': 'This component’s styles use no tokens', 'motion': 'Motion values', 'motion.none': 'No motion values',
      'assets': 'Icons & pictures', 'onPage': 'Components on this page', 'usedOn': 'Used on these pages', 'notOnPages': 'Not used on an app page directly (other components use it)',
      'history.none': 'No changes since v1.0', 'history.for': 'Iterations that changed it', 'copy': 'Copy', 'copied': 'Copied', 'copyLink': 'Copy link',
      'open.version': 'Open this version in the canvas', 'compare.latest': 'Compare with latest', 'compare.prev': 'Compare with previous', 'noJira': 'No Jira ticket',
      'type.ui': 'UI', 'type.motion': 'Motion', 'filter.all': 'All', 'loading': 'Loading…', 'select.hint': 'Click a component on the canvas, or pick one in Layers',
      'pageInfo': 'Page', 'g.layout': 'Layout', 'g.padding': 'Padding', 'g.look': 'Appearance', 'g.text': 'Text',
      's.w': 'Width', 's.h': 'Height', 's.top': 'Top', 's.right': 'Right', 's.bottom': 'Bottom', 's.left': 'Left', 's.gap': 'Gap', 's.dir': 'Direction', 's.column': 'Column', 's.row': 'Row', 's.grid': 'Grid',
      's.radius': 'Radius', 's.fill': 'Fill', 's.image': 'Image', 's.stroke': 'Stroke', 's.shadow': 'Shadow', 's.opacity': 'Opacity',
      's.style': 'Text style', 's.font': 'Font', 's.size': 'Size', 's.line': 'Line height', 's.color': 'Colour', 'full': 'Full',
      'a.add': 'Added', 'a.edit': 'Edited', 'a.remove': 'Removed', 'iter.summary': 'Summary', 'iter.changes': 'Changes', 'iter.pages': 'Pages', 'iter.components': 'Components',
      'iter.count': '{n} changes', 'iter.baseline': 'Baseline: every later change is recorded from here', 'iter.all': 'All iterations', 'iter.empty': 'No iterations match the filter',
      'tokens.title': 'PeraSure tokens', 'tokens.sub': 'The design system’s tokens (tokens/tokens.css), read only. Click a name or a value to copy it.', 'tokens.count': '{n}',
      'tk.color': 'Colour', 'tk.space': 'Spacing', 'tk.radius': 'Radius', 'tk.type': 'Typography', 'tk.shadow': 'Shadow', 'tk.other': 'Other',
      'comp.count': '{n} components', 'page.count': '{n} pages', 'withdrawHost': 'Withdraw demo (its own code)', 'stage.empty': 'Components has no states for this one: inspect it on a page that uses it',
      'compareTitle': 'Compare versions', 'cmp.side': 'Side by side', 'cmp.overlay': 'Overlay', 'cmp.sync': 'Sync', 'cmp.replay': 'Replay both', 'cmp.speed': 'Speed',
      'cmp.changes': 'Changes in this version', 'cmp.props': 'Compare properties', 'cmp.code': 'Compare code', 'cmp.before': 'Before', 'cmp.after': 'After', 'cmp.close': 'Close',
      'cmp.pick': 'Pick a component in the list of changes', 'cmp.same': 'No difference here between the two versions', 'cmp.opacity': 'New version opacity', 'cmp.noChanges': 'No recorded changes between these versions',
      'reload': 'Reload', 'cmp.syncTip': 'Tap, scroll or type on one side and the other side does the same', 'cmp.sameVersion': 'Both sides are the same version. Pick two different versions above.', 'appPiece': 'The app’s own piece (not in the library)', 'element': 'Element', 'classes': 'Classes', 'spec.select': 'Select a component on the canvas to see its real size, spacing and colours', 'motion.note': 'Values come from PS.MT of the version in the canvas (shared/ps-ui/core.js)',
      'howOpen': 'How to open it', 'open.link': 'Link (opens this page on a phone)', 'open.script': 'Then run', 'open.phone': 'Open in a new window',
      'theme.system': 'System', 'theme.light': 'Light', 'theme.dark': 'Dark', 'brand.sub': 'Dev Mode', 'back.latest': 'Back to latest',
      'stage.title': 'Components', 'stage.pick': 'State', 'stage.usedOnTip': 'Inspect it on a page that uses it:', 'tokens.loading': 'Reading tokens/tokens.css…',
      'tk.value': 'Value', 'tk.preview': 'Preview', 'tk.name': 'Name', 'iter.open': 'Open in canvas', 'iter.jira': 'Jira', 'iter.types': 'Type',
      'dev.status': 'Dev status', 'lang': '中'
    }
  };
  var saved; try { saved = localStorage.getItem('perasure.devmode.lang'); } catch (e) {}
  DM.lang = saved === 'en' ? 'en' : 'zh';
  DM.setLang = function (l) { DM.lang = l; try { localStorage.setItem('perasure.devmode.lang', l); } catch (e) {} document.documentElement.lang = l === 'en' ? 'en' : 'zh-CN'; };
  DM.t = function (k, vars) {
    var s = (D[DM.lang] && D[DM.lang][k]) || D.zh[k] || k;
    if (vars) Object.keys(vars).forEach(function (v) { s = s.replace('{' + v + '}', vars[v]); });
    return s;
  };
  DM.tx = function (v) { return v == null ? '' : typeof v === 'string' ? v : (v[DM.lang] || v.zh || v.en || ''); };
  DM.pageName = function (p) { return p ? (DM.lang === 'en' ? p.en || p.name : p.name) : ''; };
  DM.statusLabel = function (st) { var s = DM.STATUS[st] || DM.STATUS.ready; return DM.lang === 'en' ? s.label : s.zh; };
})();
