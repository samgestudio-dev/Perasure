/* PeraSure UI — forms: fields, phone number, OTP boxes, keypad, segmented switch, option rows, search, uploads.
   Needs core.js. Sizes are the Figma ones (app file barda5NcnFzxG7CHtISKsW: Register, User Order, Application Details). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* Field (spec rebrand/spec/Field.md, Figma 11009:437) · layout floating (56 px box, label over the value) | stacked (= PS.FormField: label
     above, 44 px box) · label · value · onChange(text) · placeholder · hint / error (message under the box) · prefix (text, e.g. '+63')
     · icon (trailing: chevron-right | close | calendar | help-circle; a picker shows the chevron) · disabled (BRIEF 15: white box, text and
     icons disabled, not focusable) · state default | focus | filled | error | disabled (gallery only: draws that state).
     Kept from the old demo: type · inputMode · maxLength · readOnly · autoFocus · onClick (picker) · clear (× when filled) · multiline. */
  PS.Field = function Field(p) {
    if (p.layout === 'stacked') return h(PS.FormField, p);
    var s = R.useState(false), st = p.state, off = p.disabled || st === 'disabled', focus = st ? st === 'focus' : s[0], setFocus = s[1];
    var filled = !off && p.value != null && p.value !== '', pick = !!p.onClick, err = p.error || (st === 'error' && p.error !== false);
    var Tag = p.multiline ? 'textarea' : 'input';
    var input = pick || st ? h('span', { className: PS.cx('ps-field__value', !filled && 'is-empty') }, filled ? p.value : p.placeholder || '')
      : h(Tag, { className: 'ps-field__value', value: p.value || '', placeholder: p.placeholder || '', type: p.type || 'text', inputMode: p.inputMode, maxLength: p.maxLength,
          readOnly: p.readOnly, disabled: off, autoFocus: p.autoFocus, rows: p.multiline ? 3 : undefined, 'aria-label': p.label, 'aria-invalid': !!err,
          onChange: function (e) { if (p.onChange) p.onChange(e.target.value); }, onFocus: function () { setFocus(true); }, onBlur: function () { setFocus(false); } });
    var icon = p.icon || (pick ? 'chevron-right' : null);
    var end = p.clear && filled && !pick && !off ? h('button', { type: 'button', className: 'ps-field__clear', 'aria-label': 'Clear', onClick: function (e) { e.preventDefault(); p.onChange(''); } },
        h('img', { src: PS.asset('art/clear.svg'), alt: '', style: { width: '1.25rem', height: '1.25rem' } }))   /* BRIEF 32: the root demo's own clear picture (legacy Close circle filled 20), untouched */
      : icon ? h(PS.Icon, { name: icon, size: 16, color: 'tertiary', className: 'ps-field__icon' }) : null;
    var box = h(pick && !off ? m.button : 'label', Object.assign({ className: PS.cx('ps-field', focus && !off && 'is-focus', err && 'is-error', off && 'is-disabled', p.multiline && 'ps-field--multi', pick && 'ps-field--pick') },
        pick && !off ? Object.assign({ type: 'button', onClick: p.onClick }, PS.press()) : {}),
      p.prefix ? (typeof p.prefix === 'string' ? h('span', { className: 'ps-field__prefix' }, p.prefix) : p.prefix) : null,
      h('span', { className: 'ps-field__main' }, p.label ? h('span', { className: 'ps-field__label' }, p.label) : null,
        h('span', { className: 'ps-field__row' }, input, focus && st === 'focus' ? h('i', { className: 'ps-caret', 'aria-hidden': true }) : null)),
      end);
    return h('div', { className: PS.cx('ps-fieldwrap', p.className) }, box,
      h(AP, { initial: false }, err && p.error ? h(m.p, Object.assign({ key: 'e', className: 'ps-field__msg is-error ps-text-body-sm' }, PS.fade(-4)), p.error)
        : p.hint ? h('p', { key: 'h', className: 'ps-field__msg ps-text-body-sm' }, p.hint) : null));
  };
  /* PhoneField (spec PhoneField.md, Figma 11018:830) — only on Log in and Change phone number (owner): a country pill (PH flag + code) and a
     number pill, 64 tall, white on the page colour, no ring at rest; the digits grouped 3-3-4 over one hidden number input.
     value (10 digits) · onChange(digits) · error · label ('Phone number') · placeholder · code ('+63') · disabled (BRIEF 15: white pills,
     flag 40 %, text disabled) · autoFocus · state default | focus | filled | error | disabled (gallery only). */
  PS.PhoneField = function PhoneField(p) {
    var s = R.useState(false), st = p.state, off = p.disabled || st === 'disabled', focus = st ? st === 'focus' : s[0], setFocus = s[1], ref = R.useRef(null);
    R.useEffect(function () { if (p.autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
    var v = off ? '' : String(p.value || ''), groups = v ? [v.slice(0, 3), v.slice(3, 6), v.slice(6)].filter(Boolean) : [];
    return h('div', { className: PS.cx('ps-phonefield', focus && !off && 'is-focus', p.error && 'is-error', off && 'is-disabled', p.className) },
      h('span', { className: 'ps-phone__cc' }, h('img', { src: PS.asset('art/flag-ph.png'), alt: 'Philippines' }), h('span', { className: 'ps-text-body-lg-strong' }, p.code || '+63')),
      h('div', { className: 'ps-phone__col' },
        h('label', { className: 'ps-phone__num' },
          st ? null : h('input', { ref: ref, className: 'ps-phone__input', value: v, type: 'tel', inputMode: 'numeric', autoComplete: 'tel-national', maxLength: 10, disabled: off,
            'aria-label': p.label || 'Phone number', 'aria-invalid': !!p.error,
            onChange: function (e) { p.onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 10)); }, onFocus: function () { setFocus(true); }, onBlur: function () { setFocus(false); } }),
          h('span', { className: 'ps-phone__main', 'aria-hidden': true },
            h('span', { className: 'ps-phone__label ps-text-body-sm' }, p.label || 'Phone number'),
            h('span', { className: 'ps-phone__row' }, groups.length ? groups.map(function (g, i) { return h('span', { key: i, className: 'ps-text-body-lg-strong' }, g); })
              : h('span', { className: 'ps-phone__ph ps-text-body-lg' }, p.placeholder || 'Enter your phone number'),
              focus && !off && groups.length ? h('i', { className: 'ps-caret' }) : null))),
        h(AP, { initial: false }, p.error ? h(m.p, Object.assign({ key: 'e', className: 'ps-phone__msg ps-text-body-sm' }, PS.fade(-4)), p.error) : null)));
  };

  /* OtpBoxes (spec OtpBoxes.md, Figma 11009:1031): 6 boxes 48 × 60 over one hidden number input · value · onChange(text) · length (6) · error
     · autoFocus · disabled (BRIEF 15: white boxes, not focusable) · focused (gallery: draws the typing state). The box of the last typed digit
     is Active (focused ring + shadow). A digit pops in (0.18 s). */
  PS.OtpBoxes = function OtpBoxes(p) {
    var n = p.length || 6, v = p.value || '',   /* disabled greys the digits, never removes them (OtpSheet is disabled while it checks the code) */ ref = R.useRef(null), s = R.useState(false), focus = p.focused || s[0], setFocus = s[1];
    R.useEffect(function () { if (p.autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
    var cells = [];
    for (var i = 0; i < n; i++) (function (i) {
      var ch = v.charAt(i), active = focus && !p.error && !p.disabled && i === Math.max(0, Math.min(v.length, n) - 1);   /* the box being typed: the last digit (Figma) */
      cells.push(h(m.span, Object.assign({ key: i, className: PS.cx('ps-otp__box ps-text-title-md', active && 'is-active', ch && 'is-filled', p.error && 'is-error', p.disabled && 'is-disabled') }, p.cascade ? PS.reveal(i) : {}),
        h(AP, { initial: false }, ch ? h(m.span, { key: ch + i, initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: MT.ENTER.ease } },
          exit: { opacity: 0, transition: { duration: 0.1 } } }, ch) : null)));
    })(i);
    return h('label', { className: PS.cx('ps-otp', p.disabled && 'is-disabled', p.className) },
      h('input', { ref: ref, className: 'ps-otp__input', value: v, inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: n, disabled: p.disabled || p.locked, 'aria-label': 'Verification code',   /* locked: can't type (checking), looks as it was */
        onChange: function (e) { p.onChange(e.target.value.replace(/[^\d]/g, '').slice(0, n)); }, onFocus: function () { setFocus(true); }, onBlur: function () { setFocus(false); } }),
      cells);
  };
  /* ContactMethods: how the code is sent · items [{ id, icon, label }] · value · onChange */
  PS.ContactMethods = function ContactMethods(p) {
    return h('div', { className: 'ps-contact', role: 'radiogroup' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h(m.button, Object.assign({ key: it.id, type: 'button', role: 'radio', 'aria-checked': on, className: PS.cx('ps-contact__item', on && 'is-on'),
        onClick: function () { if (p.onChange) p.onChange(it.id); } }, PS.press()),
        h('span', { className: 'ps-contact__ring' }, h(PS.Icon, { name: it.icon, size: 28 })), h('span', null, it.label));
    }));
  };

  /* Keypad: the amount keypad, 3 × 4 keys 52 px tall · onKey('0'…'9' | 'del' | extra) · extra ('*' | '.' | null: an empty cell) · cascade (keys rise in, REVEAL) */
  PS.Keypad = function Keypad(p) {
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', p.extra === undefined ? '*' : p.extra, '0', 'del'];
    return h('div', { className: 'ps-keypad' }, keys.map(function (k, i) {
      if (k == null) return h('span', { key: i });
      return h(PS.KeypadKey, { key: k, k: k, onKey: p.onKey, motion: p.cascade ? { initial: { opacity: 0, y: MT.Y.text }, animate: { opacity: 1, y: 0, transition: MT.REVEAL(Math.floor(i / 3) + (i % 3) * 0.5) } } : null });
    }));
  };
  /* KeypadKey (spec .KeypadKey 11102:3057): one key, 52 tall, radius 16, Surface/Sunken · k ('0'…'9' | '*' | 'del': the delete icon 24) · onKey · motion (Keypad's cascade) */
  PS.KeypadKey = function KeypadKey(p) {
    var k = p.k;
    return h(m.button, Object.assign({ type: 'button', className: 'ps-key', 'aria-label': k === 'del' ? 'Delete' : k, onClick: function () { if (p.onKey) p.onKey(k); } }, PS.press(), p.motion || {}),
      k === 'del' ? h(PS.Icon, { name: 'backspace', size: 24, color: 'primary' }) : k);
  };

  /* Segmented (spec Segmented.md, Figma 11011:646): 2–3 equal views; grey track, the chosen one a white thumb (decision 2 amended) · items [{ id, label }] · value · onChange
     · id (layout id of the thumb: it glides on the Smooth spring) */
  PS.Segmented = function Segmented(p) {   /* · disabled (spec state 3: the whole track at Opacity/Disabled, not pressable) */
    return h('div', { className: PS.cx('ps-seg', p.disabled && 'is-disabled'), role: 'tablist', 'aria-disabled': p.disabled || undefined }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': on, disabled: p.disabled, className: PS.cx('ps-seg__tab ps-text-label-md', on && 'is-on'), onClick: function () { if (!on && !p.disabled && p.onChange) p.onChange(it.id); } },
        on ? h(m.span, { layoutId: (p.id || 'ps-seg') + '-pill', className: 'ps-seg__pill', transition: MT.SPRING }) : null, h('span', null, it.label));
    }));
  };
  /* SelectBar (spec SelectBar.md, Figma 11009:954): one option of a single-choice list; the whole row is the tap target · on · label · logo
     (assets/logos/<logo>.png, 24, never recoloured) · note (right) · plain (no card: reason lists) · disabled (BRIEF 15: logo 40 %, text
     disabled) · state pressed (gallery) · onClick. Its radio is PS.Check size small. Kept from the old demo: icon (instead of a logo). */
  PS.SelectBar = function SelectBar(p) {
    var off = p.disabled || p.state === 'disabled';
    return h(m.button, Object.assign({ type: 'button', role: 'radio', 'aria-checked': !!p.on, disabled: off,
        className: PS.cx('ps-selbar', p.on && 'is-on', p.plain && 'ps-selbar--plain', off && 'is-disabled', p.state === 'pressed' && 'is-pressed'), onClick: p.onClick }, off ? {} : PS.press()),
      h(PS.Radio, { on: !!p.on }),   /* look parity: the legacy Select bar (5762:11160) and the root demo use a radio, not a tick */
      p.logo ? h('img', { className: 'ps-selbar__logo', src: PS.asset('logos/' + p.logo + '.png'), alt: '' }) : p.icon ? h(PS.Icon, { name: p.icon, size: 20, color: 'tertiary', className: 'ps-selbar__logo' }) : null,
      h('span', { className: PS.cx('ps-selbar__label', p.on ? 'ps-text-body-md-strong' : 'ps-text-body-md') }, p.label),
      p.note ? h('span', { className: 'ps-selbar__note ps-text-body-xs' }, p.note) : null);
  };
  /* Search (spec Search.md, Figma 11009:488): the glass pill · value · onChange · placeholder · autoFocus · state default | focus | filled (gallery) */
  PS.Search = function Search(p) {
    var st = p.state, shown = st ? (st === 'default' ? '' : p.value || '') : p.value || '';
    return h('label', { className: PS.cx('ps-search', st === 'focus' && 'is-focus', p.className) }, h(PS.Icon, { name: 'search', size: 20, color: 'secondary' }),
      st ? h('span', { className: PS.cx('ps-search__value ps-text-body-lg', !shown && 'is-empty') }, shown || p.placeholder || 'Search', st === 'focus' ? h('i', { className: 'ps-caret' }) : null)
        : h('input', { value: p.value || '', placeholder: p.placeholder || 'Search', autoFocus: p.autoFocus, 'aria-label': p.placeholder || 'Search', onChange: function (e) { p.onChange(e.target.value); } }),
      shown ? h('button', { type: 'button', 'aria-label': 'Clear', onClick: function () { if (p.onChange) p.onChange(''); } }, h(PS.Icon, { name: 'close', size: 16, color: 'tertiary' })) : null);
  };
  /* Consent: small check + legal line (login, application) · on · onToggle · children */
  PS.Consent = function Consent(p) {
    return h('button', { type: 'button', role: 'checkbox', 'aria-checked': !!p.on, className: 'ps-consent', onClick: p.onToggle },
      h('span', { className: PS.cx('ps-consent__check', p.on && 'is-on') }, p.on ? h(PS.Icon, { name: 'check', size: 8, color: 'inverse' }) : null),
      h('span', { className: 'ps-text-body-xs ps-c-tertiary' }, p.children));   /* BRIEF 33: consent micro-copy = Body/xs (11 Regular) */
  };
  /* UploadTile: a picture slot (ID sides, documents) · art (png in assets/art) · label · state empty | loading | done | error · onClick */
  /* ResultBadge (spec ResultBadge 11166:4407 = legacy 6012:34323 / ID FAILED 5914:9238): the round tick or cross on ID photos and checklists (20) · kind success | failed */
  PS.ResultBadge = function ResultBadge(p) {
    var ok = p.kind !== 'failed';
    return h(PS.Icon, { name: ok ? 'check-circle-filled' : 'close-circle-filled', size: p.size || 20, color: ok ? 'positive' : 'var(--content-negative)', className: 'ps-resultbadge' });
  };
  PS.UploadTile = function UploadTile(p) {   /* spec UploadTile (11044:2020): type picture (165 wide, slot 148 : 96) | file (= PS.FileRow, the document row) */
    if (p.type === 'file') {   /* legacy Upload File Sheet 9548:31409: each file on a white card (60 / uploading 64); empty / more = the dashed Add files (80 / 48) */
      if (p.state === 'empty' || p.state === 'more') return h(PS.FileAdd, { count: p.count || 0, max: p.max, hint: p.state === 'empty' ? p.hint : null, onClick: p.onClick });
      return h('div', { className: 'ps-files__item' }, h(PS.FileRow, { name: p.name, size: p.size, progress: p.progress, pic: p.pic, fileType: p.fileType,
        state: { uploaded: 'done', uploading: 'uploading', compressing: 'compressing', failed: 'failed' }[p.state] || p.state, onRemove: p.onRemove, onRetry: p.onRetry }));
    }
    var st = p.state || 'empty';   /* phase 1: the legacy tile — the ID picture (art) or +, a veil while loading, a round mark when done / failed */
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-upload', 'is-' + st), onClick: p.onClick }, PS.press()),
      h('span', { className: 'ps-upload__pic' }, p.art ? h('img', { src: PS.asset('art/' + p.art + '.png'), alt: '' }) : h(PS.Icon, { name: 'add', size: 24, color: 'tertiary' }),
        st === 'loading' ? h('span', { className: 'ps-upload__veil' }, h(PS.Busy)) : null,
        st === 'done' || st === 'error' ? h('span', { className: 'ps-upload__mark' }, h(PS.ResultBadge, { kind: st === 'done' ? 'success' : 'failed' })) : null),
      p.label ? h('span', { className: 'ps-text-body-sm ps-c-tertiary' }, p.label) : null);
  };

  /* FormField: the application forms' field (Figma 52:5689) — a label above (12 / 16, tertiary, upper case) and a white 44 px box
     (radius 20, 12 / 16 padding) with the value in Body/md · label · value · placeholder · onChange(text) (a typing box) or onClick (a field
     that opens a picker: chevron) · icon (instead of the chevron, e.g. 'calendar') · clear (✕ when filled) · error (red line under it) ·
     inputMode · type · maxLength · autoFocus · onBlur · suggest [strings] + onSuggest(s) (a list under the box while typing: email domains,
     DS 5985:12263) · menu { options, onPick } (a popover under the box, DS 7201:12032 — the bottom-sheet lists are retired) */
  PS.FormField = function FormField(p) {
    var st = p.state, off = p.disabled || st === 'disabled';   /* rebrand: Field · stacked (spec Field.md) — state (gallery), disabled (BRIEF 15) */
    var f = R.useState(false), focus = st ? st === 'focus' : f[0], setFocus = f[1], wrap = R.useRef(null), boxRef = R.useRef(null), filled = !off && p.value != null && p.value !== '';
    var pick = !!(p.onClick || p.menu), ms = R.useState(false), menuOpen = ms[0], setMenu = ms[1], err = p.error || st === 'error';
    function tap() { if (off) return; if (p.menu) setMenu(true); else if (p.onClick) p.onClick(wrap.current); }
    var value = pick || st ? h('span', { className: PS.cx('ps-ff__value', !filled && 'is-empty') }, filled ? p.value : p.placeholder || '')
      : h('input', { value: p.value || '', placeholder: p.placeholder, type: p.type || 'text', inputMode: p.inputMode, maxLength: p.maxLength, autoFocus: p.autoFocus,
          autoComplete: 'off', disabled: off, 'aria-label': p.label, className: 'ps-ff__value', onChange: function (e) { p.onChange(e.target.value); },
          onFocus: function () { setFocus(true); }, onBlur: function () { setTimeout(function () { setFocus(false); }, 120); if (p.onBlur) p.onBlur(); } });
    var end = p.clear && filled && !pick && !off ? h('button', { type: 'button', className: 'ps-ff__clear', 'aria-label': 'Clear', onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { p.onChange(''); } }, h(PS.Icon, { name: 'clear-small', size: 16, color: 'var(--palette-neutral-950)', style: { opacity: 0.6 } }))   /* BRIEF 32: the root icon (DS Cancel small), recoloured by CSS only */
      : p.icon ? h(PS.Icon, { name: p.icon, size: 16, color: 'tertiary', className: 'ps-ff__icon' }) : pick || p.chevron ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary', className: 'ps-ff__icon' }) : null;   /* trailing icon: Content/Tertiary 16 */
    var sugg = focus && p.suggest && p.suggest.length ? p.suggest : null;
    return h('div', { className: PS.cx('ps-ff', err && 'is-error', focus && !off && 'is-focus', off && 'is-disabled', (menuOpen || sugg) && 'is-open'), ref: wrap },
      p.label ? h('span', { className: 'ps-ff__label' }, p.label) : null,
      h(pick ? 'button' : 'label', { ref: boxRef, type: pick ? 'button' : undefined, disabled: pick && off ? true : undefined, className: 'ps-ff__box', onClick: pick ? tap : undefined },
        value, st === 'focus' ? h('i', { className: 'ps-caret', 'aria-hidden': true }) : null, end),
      h(AP, { initial: false }, p.error ? h(m.span, Object.assign({ key: 'e', className: 'ps-ff__error' }, PS.fade(MT.Y.digit)), p.error) : null),
      p.suggest ? h(PS.Popover, { open: !!sugg, anchor: boxRef, block: true, noCatch: true, options: sugg || [], label: p.label,
        render: PS.emailParts, kind: 'email',
        onPick: function (x) { p.onSuggest(x); setFocus(false); }, onClose: function () {} }) : null,
      p.menu ? h(PS.Popover, { open: menuOpen, anchor: boxRef, options: p.menu.options, value: p.value, label: p.label,
        onPick: function (o) { setMenu(false); p.menu.onPick(o); }, onClose: function () { setMenu(false); } }) : null);
  };

  /* Popover: a short list that opens under what was tapped (DS 7201:12032 · 7201:11836): the glass card (Surface/Elevated/Glass, 1 px light rim,
     radius 24, 8 padding, Blur/Glass-nav-effect-focus), 36 px pill options in Body/md (the chosen one on Alpha/Cold Bg/Subtle), at most 220 high —
     longer lists scroll, with a 6 px thumb and a white fade at the bottom while more is below. It sits 8 px under the anchor (above it when there is
     no room below) and, like an iPhone menu, centred on where the finger tapped, kept 8 from the page's sides; it grows from that point on the
     Smooth spring. Opened without a tap (keyboard): its right edge on the anchor's. block: as wide as the anchor (suggestions under a field).
     open · options [strings] · value · onPick(option) · onClose · anchor (ref; default: the parent) · at ({ x, y } client point; default the last tap) ·
     block · render(option) · noCatch (no tap-outside layer) */
  /* rebrand (spec Popover.md, Figma 11039:1543): type menu (options, 200 wide, max 220) | content (children, 296 wide: e.g. schedule details).
     No scrim — an invisible catcher closes it. inline: a fixed card, no placement / motion (gallery). */
  /* MenuRow (spec .MenuRow 11166:4416 = legacy select overlay 7201:11982 · Email/Auto filled list 5985:12384): one row of a popover list
     (36 pill; on = pressed / chosen) · label · kind plain | email (the name before @ in brand, the domain after it) · on · onClick */
  PS.emailParts = function emailParts(x) { var at = String(x).indexOf('@'); return at > 0 ? [h('span', { key: 'a', className: 'ps-match' }, x.slice(0, at)), x.slice(at)] : x; };
  PS.MenuRow = function MenuRow(p) {
    return h('button', { type: 'button', role: 'option', 'aria-selected': !!p.on, className: PS.cx('ps-pop__opt', p.kind === 'email' && 'ps-pop__opt--email', p.on && 'is-on'), onClick: p.onClick },
      p.kind === 'email' ? PS.emailParts(p.label) : p.label);
  };
  PS.Popover = function Popover(p) {
    if (p.inline) return h('div', { className: PS.cx('ps-pop ps-bubble is-inline', p.children && !p.options && 'ps-pop--content'), role: p.options ? 'listbox' : 'dialog' },
      p.options ? h('div', { className: 'ps-pop__list' }, p.options.map(function (o, i) {
        return h(PS.MenuRow, { key: i, label: o, kind: p.kind, on: o === p.value }); })) : p.children);
    return h(AP, null, p.open ? h(PopCard, Object.assign({ key: 'pop' }, p)) : null);
  };
  var POP_MAX = 220, POP_GAP = 8, POP_EDGE = 8, TAP = { x: 0, y: 0, t: 0 };
  /* the last tap, so a list opens where the finger was (like an iPhone menu) */
  document.addEventListener('pointerdown', function (e) { TAP = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
  function PopCard(p) {
    var card = R.useRef(null), list = R.useRef(null), thumb = R.useRef(null), fade = R.useRef(null), pl = R.useState(null), place = pl[0];
    var ch = R.useState(null), chosen = ch[0], shown = R.useRef(false);
    R.useEffect(function () { if (place) shown.current = true; }, [place]);   /* rows that arrive later (suggestions while typing) just appear */
    function pick(o) { if (chosen != null) return; ch[1](o); setTimeout(function () { p.onPick(o); }, 120); }   /* the row lights up, then the menu folds away */
    R.useLayoutEffect(function () {
      var a = p.anchor && p.anchor.current, c = card.current; if (!c) return;
      var par = c.offsetParent || c.parentNode, ar = a ? a.getBoundingClientRect() : par.getBoundingClientRect(), pr = par.getBoundingClientRect();
      var MAX = PS.px(POP_MAX), GAP = PS.px(POP_GAP), hh = Math.min(MAX, c.scrollHeight), screen = c.closest('.ps-screen, .ps-sheet') || document.body, bot = screen.querySelector('.ps-pb--bot, .ps-bottom');
      var limit = Math.min(window.innerHeight, bot ? bot.getBoundingClientRect().top : window.innerHeight) - GAP;
      var below = limit - (ar.bottom + GAP), above = ar.top - GAP - Math.max(0, (screen.querySelector('.ps-pb--top') || { getBoundingClientRect: function () { return { bottom: 0 }; } }).getBoundingClientRect().bottom);
      var up = below < hh && above > below;
      var at = p.at || (!p.block && Date.now() - TAP.t < 1000 ? TAP : null), left = null, ox = null, w = Math.ceil(parseFloat(getComputedStyle(c).width)) || c.offsetWidth;   /* rounded up: a width cut by a fraction of a pixel puts "…" on the longest row */
      if (at) {   /* centred on the tap; kept 8 from the page's sides */
        var fr = (c.closest('.ps-frame') || document.documentElement).getBoundingClientRect(), E = PS.px(POP_EDGE);
        var x = Math.max(fr.left + E, Math.min(fr.right - E - w, at.x - w / 2));
        left = x - pr.left; ox = Math.max(0, Math.min(w, at.x - x));
      }
      pl[1]({ up: up, top: up ? ar.top - pr.top - GAP - Math.min(hh, Math.max(PS.px(120), above)) : ar.bottom - pr.top + GAP, right: pr.right - ar.right,
        left: left, ox: ox, width: p.block ? ar.width : left != null ? w : null, max: Math.min(MAX, Math.max(PS.px(120), up ? above : below)) });
    }, []);
    function onScroll() {
      var l = list.current, t = thumb.current; if (!l) return;
      var room = l.scrollHeight - l.clientHeight, k = room > 0 ? l.scrollTop / room : 0, track = l.clientHeight - PS.px(16), th = Math.max(PS.px(24), Math.round(track * l.clientHeight / l.scrollHeight));
      if (t) { t.style.display = room > 1 ? 'block' : 'none'; t.style.height = th + 'px'; t.style.transform = 'translateY(' + Math.round(k * (track - th)) + 'px)'; }
      if (fade.current) fade.current.style.opacity = room - l.scrollTop > 2 ? 1 : 0;
    }
    R.useLayoutEffect(onScroll, [place, p.options.length]);
    var b = 'blur(' + MT.BLUR + 'px)', oy = place && place.up ? '100%' : '0', dir = place && place.up ? 1 : -1, calm = PS.reduce;
    var st = !place ? { visibility: 'hidden', top: 0, right: 0 } : place.left != null ? { top: place.top, left: place.left, width: place.width, maxHeight: place.max, transformOrigin: place.ox + 'px ' + oy }
      : { top: place.top, right: place.right, width: place.width || undefined, maxHeight: place.max, transformOrigin: '100% ' + oy };
    return h(R.Fragment, null,
      p.noCatch ? null : h(m.div, { className: 'ps-pop-catch ps-scrim', initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } }, exit: { opacity: 0, transition: MT.LEAVE }, onClick: p.onClose, onTouchMove: p.onClose }),   /* BRIEF 19: menus on the scrim too (not the suggestions under a field while typing) */
      /* like an iPhone menu (owner): it grows out of the tap — a little wide and flat first, then unfolding with a light bounce — blurred to sharp,
         the rows sliding in from the finger's side one after another; it folds back into the tap on the way out */
      h(m.div, { ref: card, className: PS.cx('ps-pop ps-bubble', p.block && 'ps-pop--block'), role: 'listbox', 'aria-label': p.label, style: st,
        initial: calm ? { opacity: 0 } : { opacity: 0, scaleX: 0.5, scaleY: 0.22, filter: 'blur(6px)' },
        animate: calm ? { opacity: 1 } : { opacity: 1, scaleX: 1, scaleY: 1, filter: 'blur(0px)', transition: { scaleX: MT.MENU, scaleY: MT.MENU_Y, opacity: { duration: 0.16, ease: MT.EASE_IN }, filter: { duration: 0.24, ease: MT.EASE_IN } } },
        exit: calm ? { opacity: 0, transition: MT.MENU_OUT } : { opacity: 0, scaleX: 0.7, scaleY: 0.5, filter: 'blur(4px)', transition: MT.MENU_OUT } },
        h('div', { ref: list, className: 'ps-pop__list', onScroll: onScroll, style: place ? { maxHeight: place.max - PS.px(16) } : null }, p.options.map(function (o, i) {
          var on = chosen != null ? o === chosen : o === p.value;
          return h(m.button, { key: o, type: 'button', role: 'option', 'aria-selected': on, className: PS.cx('ps-pop__opt', p.kind === 'email' && 'ps-pop__opt--email', on && 'is-on'),
            initial: calm || shown.current ? false : { opacity: 0, y: PS.px(10) * dir, filter: 'blur(2px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: MT.MENU_ROW(i) },
            onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { pick(o); } }, p.render ? p.render(o) : o);
        })),
        h('i', { ref: fade, className: 'ps-pop__fade' }), h('i', { ref: thumb, className: 'ps-pop__thumb' })));
  }

  /* FileRow: one file of a document card (DS 9473:27722) — the type on a 36 px inset tile, the name (Label/sm-light), and its state under it:
     done ("1.1 MB · ✓ Uploaded", a bin to remove it) · compressing · uploading (percent and a 4 px bar, ✕ to stop) · failed (red line, reload).
     name · size (bytes) · state done | compressing | uploading | failed · progress (0–1) · onRemove · onRetry · pic (a photo's thumbnail on the tile) */
  function mb(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  /* FileBadge (spec .FileBadge 11166:4404 = legacy File catalog logo 9474:28841): the file type on a 36 px sunken square · type (PDF · JPG · JPEG · PNG) · pic (a photo's thumbnail instead) */
  PS.FileBadge = function FileBadge(p) { return p.pic ? h('img', { className: 'ps-file__type', src: p.pic, alt: '' }) : h('span', { className: 'ps-file__type' }, p.type); };
  PS.FileRow = function FileRow(p) {   /* phase 1: the legacy document row (restored) */
    var st = p.state || 'done', ext = p.fileType || (String(p.name).split('.').pop() || '').toUpperCase().slice(0, 4), meta;
    if (st === 'failed') meta = h('span', { className: 'ps-text-body-xs ps-c-negative' }, 'Upload failed, check your connection.');
    else if (st === 'compressing') meta = h('span', { className: 'ps-file__meta ps-text-body-xs' }, 'Compressing…');
    else if (st === 'uploading') meta = h('span', { className: 'ps-file__meta ps-text-body-xs' }, 'Uploading', h('i', null, '·'), Math.round((p.progress || 0) * 100) + '% of ' + mb(p.size));
    else meta = h('span', { className: 'ps-file__meta ps-text-body-xs' }, mb(p.size), h('i', null, '·'), h('b', null, h(PS.Icon, { name: 'check', size: 8, color: 'var(--content-accent-strong)' }), 'Uploaded'));
    var btn = st === 'failed' ? { icon: 'reload', color: 'var(--content-brand)', label: 'Try again', on: p.onRetry }
      : st === 'done' ? { icon: 'delete', color: 'var(--content-placeholder)', label: 'Remove', on: p.onRemove } : { icon: 'close-thin', color: 'var(--content-placeholder)', label: 'Stop', on: p.onRemove };
    return h('div', { className: PS.cx('ps-file', 'is-' + st) },
      h(PS.FileBadge, { type: ext, pic: p.pic }),
      h('span', { className: 'ps-file__main' }, h('span', { className: 'ps-file__name ps-text-label-sm' }, p.name),
        h(PS.Swap, { k: st, y: MT.Y.digit, block: true }, meta),
        st === 'uploading' ? h('span', { className: 'ps-file__bar' }, h('i', { style: { transform: 'scaleX(' + (p.progress || 0) + ')' } })) : null),
      h(m.button, Object.assign({ type: 'button', className: 'ps-file__btn', 'aria-label': btn.label, onClick: btn.on }, PS.press(true)), h(PS.Icon, { name: btn.icon, size: 16, color: btn.color })));
  };
  /* DocCard: one kind of document (DS "File catalog sheet", 9465:26742 / 9473:27722) — its name and what counts, a + until a file is added, then
     its files (a chevron folds them), with a dashed "Add files" under them. title · sub · files [FileRow props + id] · open · onToggle · onAdd(element) */
  PS.DocCard = function DocCard(p) {
    var plus = R.useRef(null), add = R.useRef(null), n = (p.files || []).length, done = (p.files || []).filter(function (f) { return f.state === 'done'; }).length;
    var sub = !n ? p.sub : done === n ? n + ' file' + (n === 1 ? '' : 's') + ' uploaded' : done + ' of ' + n + ' uploaded';
    return h('div', { className: PS.cx('ps-doc', n && 'has-files', p.open && 'is-open') },
      h(m.button, Object.assign({ type: 'button', className: 'ps-doc__head', ref: plus, onClick: function () { if (n) p.onToggle(); else p.onAdd(plus.current); } }, PS.press()),
        h('span', { className: 'ps-doc__text' }, h('span', { className: 'ps-text-body-md-strong' }, p.title), h(PS.Swap, { k: sub, y: MT.Y.digit, block: true }, h('span', { className: 'ps-text-body-xs ps-c-placeholder' }, sub))),
        h(PS.Swap, { k: n ? 'c' : 'a' }, n ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'primary', className: 'ps-doc__chev' }) : h(PS.Icon, { name: 'add', size: 16, color: 'primary' }))),
      h(AP, { initial: false }, n && p.open ? h(m.div, { key: 'files', className: 'ps-doc__body', initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1, transition: { height: Object.assign({}, MT.SPRING, { restDelta: 0.5 }), opacity: MT.ENTER } },
        exit: { height: 0, opacity: 0, transition: { height: Object.assign({}, MT.SPRING, { restDelta: 0.5 }), opacity: MT.LEAVE } } },
        h('div', { className: 'ps-doc__files' }, p.files.map(function (f) { return h(R.Fragment, { key: f.id }, h(PS.FileRow, f), h(PS.Divider)); }),   /* legacy 9474:29171: a line after every file, the last one too */
          h(m.button, Object.assign({ type: 'button', ref: add, className: 'ps-doc__add ps-text-body-md-strong', onClick: function () { p.onAdd(add.current); } }, PS.press()), h(PS.Icon, { name: 'add', size: 16, color: 'brand' }), 'Add files'))) : null));
  };

  /* SelfieTips: how to take the selfie (DS 5585:5407) — the title with the brand "more" dots, then three pictures (91 × 64, radius 4) each with
     a 16 px tick or cross 4 in from its corner and a Caption/xs line under it · items [{ art, label, ok }] (default: the three Figma tips) · title · onMore(element) */
  var TIPS = [{ art: 'selfie-tip-1', label: 'Look straight', ok: true }, { art: 'selfie-tip-2', label: 'Good lighting', ok: true }, { art: 'selfie-tip-3', label: 'Face uncovered', ok: false }];
  PS.SelfieTips = function SelfieTips(p) {
    var more = R.useRef(null);
    return h(PS.Card, { className: 'ps-stips' },
      h('div', { className: 'ps-stips__head' }, h('p', { className: 'ps-text-label-md' }, p.title || 'Please follow the instructions below'),
        p.onMore ? h(m.button, Object.assign({ type: 'button', ref: more, className: 'ps-stips__more', 'aria-label': 'More tips', onClick: function () { p.onMore(more.current); } }, PS.press(true)), h('i'), h('i'), h('i')) : null),
      h('div', { className: 'ps-stips__row' }, (p.items || TIPS).map(function (t) {
        return h('div', { key: t.label, className: 'ps-stips__item' },
          h('span', { className: 'ps-stips__pic' }, h('img', { src: PS.asset('art/' + t.art + '.png'), alt: '' }),
            h('i', { className: t.ok ? 'is-ok' : 'is-no' }, h(PS.Icon, { name: t.ok ? 'check' : 'close', size: 8, color: t.ok ? 'on-action' : 'inverse' }))),
          h('span', { className: 'ps-text-body-xs ps-c-placeholder' }, t.label));
      })));
  };
  /* LineTabs: tabs with a brand underline (the address sheet, DS 5975:10755) · items [{ id, label, off }] (off: can't be chosen yet) · value ·
     onChange(id) · id (the underline's layout id). The underline glides on the Smooth spring; label colours change in 150 ms. */
  /* PlaceTab (spec PlaceTab 11166:4420 = legacy Search city popover/tab 5974:9358): one step tab of the address picker · label · state default (not
     open yet: light grey) | active (brand, the underline) | picked (chosen earlier: grey) · bar (the underline's layout id; gallery: true) · onClick */
  PS.PlaceTab = function PlaceTab(p) {
    var st = p.state || 'default', on = st === 'active';
    return h('button', { type: 'button', role: 'tab', 'aria-selected': on, disabled: st === 'default', className: PS.cx('ps-ltabs__tab ps-text-body-md-strong', on && 'is-on', st === 'default' && 'is-off'), onClick: p.onClick },
      h('span', null, p.label, on && p.bar ? (p.bar === true ? h('i', { className: 'ps-ltabs__bar' }) : h(m.i, { layoutId: p.bar, className: 'ps-ltabs__bar', transition: MT.SPRING })) : null));
  };
  PS.LineTabs = function LineTabs(p) {
    return h('div', { className: 'ps-ltabs', role: 'tablist' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h(PS.PlaceTab, { key: it.id, label: it.label, state: on ? 'active' : it.off ? 'default' : 'picked', bar: on ? (p.id || 'ps-ltabs') + '-bar' : null,
        onClick: function () { if (!on && !it.off) p.onChange(it.id); } });
    }));
  };

  /* Wheel: the iOS-like wheel of the date picker (DS 5900:9854 / 5900:9592) — @ncdai/react-wheel-picker as it ships (vendor/react-wheel-picker@1.2.3,
     load it and its style.css after React), styled from the tokens: the chosen row on a Neutral/50 band in Hanken Medium 24 (primary), the
     others Hanken Medium 20 (placeholder), turning away on the wheel. options [{ value, label }] · value · onChange(value) · infinite (months) */
  PS.Wheel = function Wheel(p) {
    var W = window.WheelPicker, el = R.useRef(null);
    /* a touchmove listener there from the start: iOS then lets the wheel cancel every move (no page or sheet scrolling under the finger) */
    R.useEffect(function () { var e = el.current; if (!e) return; function stop(ev) { if (ev.cancelable) ev.preventDefault(); } e.addEventListener('touchmove', stop, { passive: false });
      return function () { e.removeEventListener('touchmove', stop); }; }, []);
    if (!W) return h('div', { className: 'ps-wheel' }, h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, 'The wheel picker could not load.'));
    return h('div', { className: 'ps-wheel', ref: el },
      h(W.WheelPickerWrapper, { className: 'ps-wheel__wrap' },
        h(W.WheelPicker, { options: p.options, value: p.value, onValueChange: p.onChange, infinite: !!p.infinite, visibleCount: 12, optionItemHeight: Math.round(PS.px(40)), dragSensitivity: 3, scrollSensitivity: 5,
          classNames: { optionItem: 'ps-wheel__opt', highlightWrapper: 'ps-wheel__hi', highlightItem: 'ps-wheel__hi-item' } })));
  };

  /* DatePicker: the content of the "Select date" card (DS 7628:14113 · 5900:9854 · 5900:9592): Glass back / tick, the month and year steppers
     (‹ December › ‹ 2026 ›), then the month's days — the chosen one on a brand circle (36). Tapping the month or the year swaps the days for a wheel
     with Cancel / Confirm. Days outside min … max are shown faded and can't be picked. The days are always six rows (owner), so the weekday row and the card never move.
     value { y, m, d } (m from 0) · min · max ({ y, m, d }) · onConfirm(value) · onCancel · title */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function key(d) { return d.y * 10000 + d.m * 100 + d.d; }
  PS.MONTHS = MONTHS;
  /* DateCell (spec .DateCell 11166:4410 = legacy Calendar popover/date 5839:18418): one day of the grid (24; selected: the 36 brand disc) · day · on · off (outside min … max) · blank (no day: kept, invisible) · onClick */
  PS.DateCell = function DateCell(p) {
    if (p.blank) return h('span', { className: 'ps-date__day is-empty' });
    return h('button', { type: 'button', disabled: p.off, 'aria-pressed': !!p.on, className: PS.cx('ps-date__day ps-text-body-md-strong', p.on && 'is-on', p.off && 'is-off'), onClick: p.onClick }, h('i'), h('span', null, p.day));
  };
  /* Weekday (spec .Weekday 11166:4411 = legacy Calendar popover/ week 5839:18282): the weekday above a grid column (24 × 14) · label */
  PS.Weekday = function Weekday(p) { return h('span', { className: 'ps-date__wk' }, p.label); };
  PS.DatePicker = function DatePicker(p) {
    var min = p.min || { y: 1900, m: 0, d: 1 }, max = p.max || { y: 2100, m: 11, d: 31 };
    function clamp(v) { var n = key(v) < key(min) ? min : key(v) > key(max) ? max : v; return { y: n.y, m: n.m, d: n.d }; }
    var s0 = R.useState(function () { return clamp(p.value || { y: new Date().getFullYear(), m: new Date().getMonth(), d: new Date().getDate() }); }), v = s0[0], setV = s0[1];
    var view = v;     /* the month on show is the chosen date's: changing the month or the year changes the date (the same day, kept inside the month and min … max) */
    var s2 = R.useState(p.mode || 'date'), mode = s2[0], setMode = s2[1], s3 = R.useState(p.mode === 'month' ? v.m : p.mode === 'year' ? v.y : null), wheel = s3[0], setWheel = s3[1];   /* mode: the view it opens on (gallery) */
    function moveTo(y, m) { var t = Math.max(min.y * 12 + min.m, Math.min(max.y * 12 + max.m, y * 12 + m)), ny = Math.floor(t / 12), nm = t % 12;
      setV(clamp({ y: ny, m: nm, d: Math.min(v.d, new Date(ny, nm + 1, 0).getDate()) })); }
    /* the ‹ › arrows switch at once, on the days and on an open wheel alike: a step past the range lands on its first / last month
       (the year arrow from January 2027 goes to November 2026); at the very end the arrow is greyed out */
    function shift(dm) {
      var cur = view.y * 12 + view.m, t = Math.max(t0, Math.min(t1, cur + dm)); if (t === cur) return;
      moveTo(Math.floor(t / 12), t % 12);
      if (mode === 'month') setWheel(t % 12); else if (mode === 'year') setWheel(Math.floor(t / 12));
    }
    var sw = R.useRef(null);   /* a sideways swipe on the days changes the month too */
    function swipeStart(e) { sw.current = { x: e.clientX, y: e.clientY }; }
    function swipeEnd(e) { var o = sw.current; sw.current = null; if (!o) return; var dx = e.clientX - o.x, dy = e.clientY - o.y;
      if (Math.abs(dx) > PS.px(40) && Math.abs(dx) > Math.abs(dy) * 1.5) shift(dx < 0 ? 1 : -1); }
    /* the month wheel lists the months of the year on show that can be picked, by name only (owner); the year changes on its own wheel / arrows */
    var t0 = min.y * 12 + min.m, t1 = max.y * 12 + max.m;
    function openWheel(which) { setWheel(which === 'month' ? view.m : view.y); setMode(which); }
    function closeWheel(ok) {
      if (ok && wheel != null) { if (mode === 'month') moveTo(view.y, wheel); else moveTo(wheel, view.m); }
      setMode('date');
    }
    function done() { if (mode !== 'date') { closeWheel(true); return; } p.onConfirm(v); }
    function back() { if (mode !== 'date') { closeWheel(false); return; } if (p.onCancel) p.onCancel(); }
    function stepper(label, which, dm) {
      return h('span', { className: 'ps-date__step' },
        h(m.button, Object.assign({ type: 'button', 'aria-label': 'Previous ' + which, disabled: atStart, onClick: function () { shift(-dm); } }, atStart ? null : PS.press(true)), h(PS.Icon, { name: 'chevron-left', size: 16, color: 'var(--border-brand-strong)' })   /* BRIEF 26: the legacy back glyph (nav/chevron-left), not a mirrored chevron-right */),   /* DS: the same Chevron Right, turned */
        h('button', { type: 'button', className: PS.cx('ps-date__label ps-text-body-lg-strong', mode === which && 'is-on'), 'aria-label': 'Choose the ' + which, onClick: function () { if (mode === which) closeWheel(false); else openWheel(which); } },
          h(PS.Swap, { k: label, y: MT.Y.digit, block: true }, h('span', null, label))),
        h(m.button, Object.assign({ type: 'button', 'aria-label': 'Next ' + which, disabled: atEnd, onClick: function () { shift(dm); } }, atEnd ? null : PS.press(true)), h(PS.Icon, { name: 'chevron-right', size: 16, color: 'var(--border-brand-strong)' })));
    }
    var atStart = view.y * 12 + view.m <= t0, atEnd = view.y * 12 + view.m >= t1;
    var body;
    if (mode === 'date') {
      var first = new Date(view.y, view.m, 1).getDay(), days = new Date(view.y, view.m + 1, 0).getDate(), cells = [];
      for (var i = 0; i < 42; i++) {   /* always six rows (owner): the weekday row never moves */
        var d = i - first + 1, inMonth = d >= 1 && d <= days, k = inMonth ? key({ y: view.y, m: view.m, d: d }) : 0, off = inMonth && (k < key(min) || k > key(max)), on = inMonth && k === key(v);
        cells.push(inMonth ? h(PS.DateCell, { key: i, day: d, on: on, off: off, onClick: (function (dd) { return function () { setV({ y: view.y, m: view.m, d: dd }); }; })(d) }) : h(PS.DateCell, { key: i, blank: true }));
      }
      body = h('div', { className: 'ps-date__cal', onPointerDown: swipeStart, onPointerUp: swipeEnd, onPointerCancel: function () { sw.current = null; } },
        h('div', { className: 'ps-date__week ps-text-body-xs' }, WEEK.map(function (w) { return h(PS.Weekday, { key: w, label: w }); })),
        h(PS.Crossfade, { k: view.y + '-' + view.m, className: 'ps-date__grid' }, cells));
    } else {
      var opts = [];
      if (mode === 'year') for (var y = min.y; y <= max.y; y++) opts.push({ value: y, label: String(y) });
      else MONTHS.forEach(function (n, j) { if (!((view.y === min.y && j < min.m) || (view.y === max.y && j > max.m))) opts.push({ value: j, label: n }); });
      body = h('div', { className: 'ps-date__pick' },
        h(PS.Wheel, { key: mode, options: opts, value: wheel, onChange: setWheel, infinite: mode === 'month' && opts.length === 12 }),
        h('div', { className: 'ps-date__acts' }, h(PS.Button, { variant: 'glass', size: 'sm', onClick: function () { closeWheel(false); } }, 'Cancel'), h(PS.Button, { variant: 'glass', size: 'sm', onClick: function () { closeWheel(true); } }, 'Confirm')));
    }
    return h('div', { className: 'ps-date' },
      h('div', { className: 'ps-date__head' }, h(PS.Glass, { icon: 'chevron-left', label: mode === 'date' ? 'Close' : 'Back to the days', onClick: back }),
        h('p', { className: 'ps-text-body-lg-strong' }, p.title || 'Select date'), h(PS.Glass, { icon: 'check', label: 'Done', onClick: done })),
      h('div', { className: 'ps-date__steps' }, stepper(MONTHS[view.m], 'month', 1), stepper(String(view.y), 'year', 12)),
      h('div', { className: 'ps-date__body' }, h(PS.Crossfade, { k: mode === 'date' ? 'date' : 'wheel', className: 'ps-date__view' }, body)));
  };

  /* OtpForm: the code page's body — the six boxes and the error under them, another way to get the code, Resend (after a countdown).
     value · onChange · error (text) · disabled (while it checks) · ways [{ id, icon, label }] · way · onWay(id) · left (seconds to wait) · onResend */
  /* OtpStatus (spec OtpStatus 11113:3519 = legacy Status 8742:30760): the error under the code boxes — a pink box, red text (no connection ·
     incorrect) · children */
  PS.OtpStatus = function OtpStatus(p) { return h('p', { className: 'ps-otpstatus ps-text-body-md', role: 'alert' }, p.children); };
  PS.OtpForm = function OtpForm(p) {
    return h(R.Fragment, null,
      h('div', { className: 'ps-otpform' },
        h(PS.OtpBoxes, { value: p.value, onChange: p.onChange, error: !!p.error, locked: p.disabled }),   /* disabled here = checking: locked, not greyed */
        h(AP, { initial: false }, p.error ? h(m.div, Object.assign({ key: 'e' }, PS.fade(-4)), h(PS.OtpStatus, null, p.error)) : null)),
      h('div', { className: 'ps-otpform__more' },
        h('p', { className: 'ps-text-body-sm ps-c-tertiary' }, 'Didn’t receive the code? Try another verification method.'),
        h(PS.ContactMethods, { items: p.ways, value: p.way, onChange: p.onWay })),
      h('div', { className: 'ps-otpform__resend' }, h(PS.Button, { size: 'sm', disabled: p.left > 0, onClick: p.onResend },
        h(PS.Swap, { k: p.left > 0 ? 'w' : 'g' }, h('span', null, p.left > 0 ? 'Resend code after ' + p.left + 's' : 'Resend code')))));
  };
  /* Radio (spec Radio 11156:5430 = legacy Check mar 5772:13600): one choice of a list · on · size (14: screens; 16: the component) */
  PS.Radio = function Radio(p) { return h('span', { className: PS.cx('ps-radio', p.size === 16 && 'ps-radio--16', p.on && 'is-on', p.className), 'aria-hidden': true }); };
  /* ReasonRow (spec ReasonRow 11157:4367 = legacy Questionnaire 6207:20239): one reason, its Radio on the right and a line under it
     (36; last: no line, 20) · label · on · last · onClick */
  PS.ReasonRow = function ReasonRow(p) {
    return h('div', { className: 'ps-partrow' }, h('button', { type: 'button', role: 'radio', 'aria-checked': !!p.on, className: 'ps-reason ps-text-body-md-strong', onClick: p.onClick },
      h('span', null, p.label), h(PS.Radio, { on: p.on })), p.last ? null : h(PS.Divider));
  };
  /* ReasonText (spec .ReasonText 11157:4370 = legacy Feedback box 6217:22306): the "Tell us more" box and its 0/200 count (296 × 166) · value · onChange · max (200) */
  PS.ReasonText = function ReasonText(p) {
    var max = p.max || 200;
    return h('div', { className: 'ps-reasons__more' }, h('textarea', { value: p.value || '', maxLength: max, placeholder: p.placeholder || 'Tell us more… (Optional)', 'aria-label': 'Tell us more',
      readOnly: !p.onChange, onChange: function (e) { if (p.onChange) p.onChange(e.target.value); } }),
      h('span', { className: 'ps-text-body-xs ps-c-placeholder' }, (p.value || '').length + '/' + max + ' characters'));
  };
  /* ResendTimer (spec .ResendTimer 11157:4373 = legacy Delete my account/otc 6213:21645): the resend line under code boxes — "Resend" (link) or
     "Resend code in 59s" (grey) · left (seconds; 0 = ready) · onResend */
  PS.ResendTimer = function ResendTimer(p) {
    var ready = !(p.left > 0);
    return h(PS.Swap, { k: ready ? 'r' : 'c' }, ready
      ? h(m.button, Object.assign({ type: 'button', className: 'ps-resend ps-text-body-md-strong ps-c-link', onClick: p.onResend }, PS.press(true)), 'Resend')
      : h('span', { className: 'ps-resend ps-text-body-md ps-c-placeholder', role: 'timer' }, 'Resend code in ' + p.left + 's'));
  };
  /* ReasonList: a card of reasons with a radio each, then a box for more, 200 characters (delete the account, cancel a loan)
     items · value (index, -1: none yet) · onChange(index) · text · onText */
  PS.ReasonList = function ReasonList(p) {
    return h(PS.Card, { className: 'ps-reasons' }, p.items.map(function (w, i) {
      return h(PS.ReasonRow, { key: i, label: w, on: p.value === i, last: i === p.items.length - 1, onClick: function () { p.onChange(i); } });
    }), h(PS.ReasonText, { value: p.text, onChange: p.onText }));
  };
})();
