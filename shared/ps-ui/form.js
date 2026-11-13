/* PeraSure UI — forms: fields, phone number, OTP boxes, keypad, segmented switch, option rows, search, uploads.
   Needs core.js. Sizes are the Figma ones (app file barda5NcnFzxG7CHtISKsW: Register, User Order, Application Details). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* Field: the 56 px "typing box" — a floating label over the value · label · value · onChange(text) · placeholder · error (text)
     hint · type · inputMode · maxLength · readOnly · onClick (a field that opens a picker: shows a chevron) · clear (✕ when filled)
     prefix (node) · autoFocus · multiline (a taller box for free text) */
  PS.Field = function Field(p) {
    var s = R.useState(false), focus = s[0], setFocus = s[1], filled = p.value != null && p.value !== '', pick = !!p.onClick;
    var Tag = p.multiline ? 'textarea' : 'input';
    var input = pick ? h('span', { className: PS.cx('ps-field__value', !filled && 'is-empty') }, filled ? p.value : p.placeholder || '')
      : h(Tag, { className: 'ps-field__value', value: p.value || '', placeholder: p.placeholder || '', type: p.type || 'text', inputMode: p.inputMode, maxLength: p.maxLength,
          readOnly: p.readOnly, autoFocus: p.autoFocus, rows: p.multiline ? 3 : undefined, 'aria-label': p.label, 'aria-invalid': !!p.error,
          onChange: function (e) { if (p.onChange) p.onChange(e.target.value); }, onFocus: function () { setFocus(true); }, onBlur: function () { setFocus(false); } });
    var box = h(pick ? m.button : 'label', Object.assign({ className: PS.cx('ps-field', focus && 'is-focus', p.error && 'is-error', p.multiline && 'ps-field--multi', pick && 'ps-field--pick') },
        pick ? Object.assign({ type: 'button', onClick: p.onClick }, PS.press()) : {}),
      p.prefix || null,
      h('span', { className: 'ps-field__main' }, p.label ? h('span', { className: 'ps-field__label' }, p.label) : null, input),
      p.clear && filled && !pick ? h('button', { type: 'button', className: 'ps-field__clear', 'aria-label': 'Clear', onClick: function (e) { e.preventDefault(); p.onChange(''); } },
        h('img', { src: PS.asset('art/clear.svg'), alt: '', style: { width: '1.25rem', height: '1.25rem' } })) : null,
      pick ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary', className: 'ps-field__chev' }) : null);
    return h('div', { className: PS.cx('ps-fieldwrap', p.className) }, box,
      h(AP, { initial: false }, p.error ? h(m.p, Object.assign({ key: 'e', className: 'ps-field__msg is-error ps-t-caption-sm' }, PS.fade(-4)), p.error)
        : p.hint ? h('p', { key: 'h', className: 'ps-field__msg ps-t-caption-sm' }, p.hint) : null));
  };
  /* PhoneField: country pill (+63) + the number box · value · onChange · error · label ('Phone Number') · placeholder */
  PS.PhoneField = function PhoneField(p) {
    return h('div', { className: 'ps-phonefield' },
      h('span', { className: 'ps-phonefield__cc' }, h('img', { src: PS.asset('art/flag-ph.png'), alt: '' }), p.code || '+63'),
      h(PS.Field, { label: p.label || 'Phone Number', value: p.value, onChange: function (v) { p.onChange(v.replace(/[^\d]/g, '').slice(0, 10)); }, error: p.error,
        placeholder: p.placeholder || 'Enter your phone number', inputMode: 'numeric', type: 'tel', autoFocus: p.autoFocus, className: 'ps-phonefield__num' }));
  };

  /* OtpBoxes: 6 boxes 48 × 60 over one hidden number input · value · onChange(text) · length (6) · error (red boxes) · autoFocus · disabled
     An empty box has a grey ring, a filled one a light blue ring; the box being typed carries the brand ring and a shadow. A digit pops in (0.18 s). */
  PS.OtpBoxes = function OtpBoxes(p) {
    var n = p.length || 6, v = p.value || '', ref = R.useRef(null), s = R.useState(false), focus = s[0], setFocus = s[1];
    R.useEffect(function () { if (p.autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
    var cells = [];
    for (var i = 0; i < n; i++) (function (i) {
      var ch = v.charAt(i), active = focus && !p.error && i === Math.max(0, Math.min(v.length, n) - 1);   /* the box being typed: the last digit (Figma) */
      cells.push(h(m.span, Object.assign({ key: i, className: PS.cx('ps-otp__box', active && 'is-active', ch && 'is-filled', p.error && 'is-error') }, p.cascade ? PS.reveal(i) : {}),
        h(AP, { initial: false }, ch ? h(m.span, { key: ch + i, initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1, transition: { duration: 0.18, ease: MT.ENTER.ease } },
          exit: { opacity: 0, transition: { duration: 0.1 } } }, ch) : null)));
    })(i);
    return h('label', { className: PS.cx('ps-otp', p.className) },
      h('input', { ref: ref, className: 'ps-otp__input', value: v, inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: n, disabled: p.disabled, 'aria-label': 'Verification code',
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
      return h(m.button, Object.assign({ key: k, type: 'button', className: 'ps-key', 'aria-label': k === 'del' ? 'Delete' : k, onClick: function () { p.onKey(k); } },
        PS.press(), p.cascade ? { initial: { opacity: 0, y: MT.Y.text }, animate: { opacity: 1, y: 0, transition: MT.REVEAL(Math.floor(i / 3) + (i % 3) * 0.5) } } : {}),
        k === 'del' ? h(PS.Icon, { name: 'backspace', size: 24, color: 'primary' }) : k);
    }));
  };

  /* Segmented: the two-way switch (E-Wallet / Online bank) · items [{ id, label }] · value · onChange · id (layout id of the pill) */
  PS.Segmented = function Segmented(p) {
    return h('div', { className: 'ps-seg', role: 'tablist' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': on, className: PS.cx('ps-seg__tab ps-t-label-md', on && 'is-on'), onClick: function () { if (!on) p.onChange(it.id); } },
        on ? h(m.span, { layoutId: (p.id || 'ps-seg') + '-pill', className: 'ps-seg__pill', transition: MT.SPRING }) : null, h('span', null, it.label));
    }));
  };
  /* SelectBar: one option with a radio (withdrawal method, reasons) · on · label · logo (file in assets/logos, png) · icon · note (right, brand) · onClick · plain (no border: reason lists) */
  PS.SelectBar = function SelectBar(p) {
    return h(m.button, Object.assign({ type: 'button', role: 'radio', 'aria-checked': !!p.on, className: PS.cx('ps-selbar', p.on && 'is-on', p.plain && 'ps-selbar--plain'), onClick: p.onClick }, PS.press()),
      h('span', { className: PS.cx('ps-radio', p.on && 'is-on') }),
      p.logo ? h('img', { className: 'ps-selbar__logo', src: PS.asset('logos/' + p.logo + '.png'), alt: '' }) : p.icon ? h(PS.Icon, { name: p.icon, size: 20, color: 'tertiary' }) : null,
      h('span', { className: 'ps-selbar__label ps-t-body-md' }, p.label),
      p.note ? h('span', { className: 'ps-selbar__note ps-t-caption-xs' }, p.note) : null);
  };
  /* Search: the search pill · value · onChange · placeholder · autoFocus */
  PS.Search = function Search(p) {
    return h('label', { className: PS.cx('ps-search', p.className) }, h(PS.Icon, { name: 'search', size: 18, color: 'secondary' }),
      h('input', { value: p.value || '', placeholder: p.placeholder || 'Search', autoFocus: p.autoFocus, 'aria-label': p.placeholder || 'Search', onChange: function (e) { p.onChange(e.target.value); } }),
      p.value ? h('button', { type: 'button', 'aria-label': 'Clear', onClick: function () { p.onChange(''); } }, h('img', { src: PS.asset('art/clear.svg'), alt: '', style: { width: '1.125rem', height: '1.125rem' } })) : null);
  };
  /* Consent: small check + legal line (login, application) · on · onToggle · children */
  PS.Consent = function Consent(p) {
    return h('button', { type: 'button', role: 'checkbox', 'aria-checked': !!p.on, className: 'ps-consent', onClick: p.onToggle },
      h('span', { className: PS.cx('ps-consent__check', p.on && 'is-on') }, p.on ? h(PS.Icon, { name: 'check', size: 8, color: 'inverse' }) : null),
      h('span', { className: 'ps-t-caption-xs ps-c-tertiary' }, p.children));
  };
  /* UploadTile: a picture slot (ID sides, documents) · art (png in assets/art) · label · state empty | loading | done | error · onClick */
  PS.UploadTile = function UploadTile(p) {
    var st = p.state || 'empty';
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-upload', 'is-' + st), onClick: p.onClick }, PS.press()),
      h('span', { className: 'ps-upload__pic' }, p.art ? h('img', { src: PS.asset('art/' + p.art + '.png'), alt: '' }) : h(PS.Icon, { name: 'add', size: 24, color: 'tertiary' }),
        st === 'loading' ? h('span', { className: 'ps-upload__veil' }, h(PS.Busy)) : null,
        st === 'done' ? h('span', { className: 'ps-upload__mark' }, h(PS.Icon, { name: 'check-circle-filled', size: 20, color: 'positive' })) : null,
        st === 'error' ? h('span', { className: 'ps-upload__mark' }, h(PS.Icon, { name: 'close-circle-filled', size: 20, color: 'var(--color-icon-negative-default)' })) : null),
      p.label ? h('span', { className: 'ps-t-caption-sm ps-c-tertiary' }, p.label) : null);
  };

  /* FormField: the application forms' field (Figma 52:5689) — a label above (12 / 16, tertiary, upper case) and a white 44 px box
     (radius 20, 12 / 16 padding) with the value in Body/md · label · value · placeholder · onChange(text) (a typing box) or onClick (a field
     that opens a picker: chevron) · icon (instead of the chevron, e.g. 'calendar') · clear (✕ when filled) · error (red line under it) ·
     inputMode · type · maxLength · autoFocus · onBlur · suggest [strings] + onSuggest(s) (a list under the box while typing: email domains,
     DS 5985:12263) · menu { options, onPick } (a popover under the box, DS 7201:12032 — the bottom-sheet lists are retired) */
  PS.FormField = function FormField(p) {
    var f = R.useState(false), focus = f[0], setFocus = f[1], wrap = R.useRef(null), boxRef = R.useRef(null), filled = p.value != null && p.value !== '';
    var pick = !!(p.onClick || p.menu), ms = R.useState(false), menuOpen = ms[0], setMenu = ms[1];
    function tap() { if (p.menu) setMenu(true); else if (p.onClick) p.onClick(wrap.current); }
    var value = pick ? h('span', { className: PS.cx('ps-ff__value', !filled && 'is-empty') }, filled ? p.value : p.placeholder || '')
      : h('input', { value: p.value || '', placeholder: p.placeholder, type: p.type || 'text', inputMode: p.inputMode, maxLength: p.maxLength, autoFocus: p.autoFocus,
          autoComplete: 'off', 'aria-label': p.label, className: 'ps-ff__value', onChange: function (e) { p.onChange(e.target.value); },
          onFocus: function () { setFocus(true); }, onBlur: function () { setTimeout(function () { setFocus(false); }, 120); if (p.onBlur) p.onBlur(); } });
    var end = p.clear && filled && !pick ? h('button', { type: 'button', className: 'ps-ff__clear', 'aria-label': 'Clear', onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { p.onChange(''); } }, h(PS.Icon, { name: 'clear-small', size: 16, color: 'var(--color-neutral-950)', style: { opacity: 0.6 } }))   /* DS "Cancel small": Neutral/950 at 60 % */
      : p.icon ? h(PS.Icon, { name: p.icon, size: 16, color: 'tertiary' }) : pick || p.chevron ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }) : null;   /* the calendar and the chevron: Icon/Tertiary 16 */
    var sugg = focus && p.suggest && p.suggest.length ? p.suggest : null;
    return h('div', { className: PS.cx('ps-ff', p.error && 'is-error', focus && 'is-focus', (menuOpen || sugg) && 'is-open'), ref: wrap },
      p.label ? h('span', { className: 'ps-ff__label' }, p.label) : null,
      h(pick ? 'button' : 'label', { ref: boxRef, type: pick ? 'button' : undefined, className: 'ps-ff__box', onClick: pick ? tap : undefined }, value, end),
      h(AP, { initial: false }, p.error ? h(m.span, Object.assign({ key: 'e', className: 'ps-ff__error' }, PS.fade(MT.Y.digit)), p.error) : null),
      p.suggest ? h(PS.Popover, { open: !!sugg, anchor: boxRef, block: true, noCatch: true, options: sugg || [], label: p.label,
        render: function (x) { var at = x.indexOf('@'); return at > 0 ? [h('span', { key: 'a', className: 'ps-c-brand' }, x.slice(0, at)), x.slice(at)] : x; },
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
  PS.Popover = function Popover(p) {
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
      var at = p.at || (!p.block && Date.now() - TAP.t < 1000 ? TAP : null), left = null, ox = null, w = c.offsetWidth;
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
      p.noCatch ? null : h('div', { className: 'ps-pop-catch', onClick: p.onClose, onTouchMove: p.onClose }),
      /* like an iPhone menu (owner): it grows out of the tap — a little wide and flat first, then unfolding with a light bounce — blurred to sharp,
         the rows sliding in from the finger's side one after another; it folds back into the tap on the way out */
      h(m.div, { ref: card, className: PS.cx('ps-pop ps-bubble', p.block && 'ps-pop--block'), role: 'listbox', 'aria-label': p.label, style: st,
        initial: calm ? { opacity: 0 } : { opacity: 0, scaleX: 0.5, scaleY: 0.22, filter: 'blur(6px)' },
        animate: calm ? { opacity: 1 } : { opacity: 1, scaleX: 1, scaleY: 1, filter: 'blur(0px)', transition: { scaleX: MT.MENU, scaleY: MT.MENU_Y, opacity: { duration: 0.16, ease: MT.EASE_IN }, filter: { duration: 0.24, ease: MT.EASE_IN } } },
        exit: calm ? { opacity: 0, transition: MT.MENU_OUT } : { opacity: 0, scaleX: 0.7, scaleY: 0.5, filter: 'blur(4px)', transition: MT.MENU_OUT } },
        h('div', { ref: list, className: 'ps-pop__list', onScroll: onScroll, style: place ? { maxHeight: place.max - PS.px(16) } : null }, p.options.map(function (o, i) {
          var on = chosen != null ? o === chosen : o === p.value;
          return h(m.button, { key: o, type: 'button', role: 'option', 'aria-selected': on, className: PS.cx('ps-pop__opt', on && 'is-on'),
            initial: calm || shown.current ? false : { opacity: 0, y: PS.px(10) * dir, filter: 'blur(2px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: MT.MENU_ROW(i) },
            onMouseDown: function (e) { e.preventDefault(); }, onClick: function () { pick(o); } }, p.render ? p.render(o) : o);
        })),
        h('i', { ref: fade, className: 'ps-pop__fade' }), h('i', { ref: thumb, className: 'ps-pop__thumb' })));
  }

  /* FileRow: one file of a document card (DS 9473:27722) — the type on a 36 px inset tile, the name (Label/sm-light), and its state under it:
     done ("1.1 MB · ✓ Uploaded", a bin to remove it) · compressing · uploading (percent and a 4 px bar, ✕ to stop) · failed (red line, reload).
     name · size (bytes) · state done | compressing | uploading | failed · progress (0–1) · onRemove · onRetry · pic (a photo's thumbnail on the tile) */
  function mb(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  PS.FileRow = function FileRow(p) {
    var st = p.state || 'done', ext = (String(p.name).split('.').pop() || '').toUpperCase().slice(0, 4), meta;
    if (st === 'failed') meta = h('span', { className: 'ps-t-caption-xs ps-c-negative' }, 'Upload failed, check your connection.');
    else if (st === 'compressing') meta = h('span', { className: 'ps-file__meta ps-t-caption-xs' }, 'Compressing…');
    else if (st === 'uploading') meta = h('span', { className: 'ps-file__meta ps-t-caption-xs' }, 'Uploading', h('i', null, '·'), Math.round((p.progress || 0) * 100) + '% of ' + mb(p.size));
    else meta = h('span', { className: 'ps-file__meta ps-t-caption-xs' }, mb(p.size), h('i', null, '·'), h('b', null, h(PS.Icon, { name: 'check', size: 8, color: 'var(--color-icon-positive-heavy)' }), 'Uploaded'));   /* DS: Icon / Check 8, 4 to the word */
    var btn = st === 'failed' ? { icon: 'reload', color: 'var(--color-icon-brand-light)', label: 'Try again', on: p.onRetry }
      : st === 'done' ? { icon: 'delete', color: 'var(--color-icon-placeholder)', label: 'Remove', on: p.onRemove } : { icon: 'close-thin', color: 'var(--color-icon-placeholder)', label: 'Stop', on: p.onRemove };
    return h('div', { className: PS.cx('ps-file', 'is-' + st) },
      p.pic ? h('img', { className: 'ps-file__type', src: p.pic, alt: '' }) : h('span', { className: 'ps-file__type' }, ext),
      h('span', { className: 'ps-file__main' }, h('span', { className: 'ps-file__name ps-t-label-sm-light' }, p.name),
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
        h('span', { className: 'ps-doc__text' }, h('span', { className: 'ps-t-label-md-light' }, p.title), h(PS.Swap, { k: sub, y: MT.Y.digit, block: true }, h('span', { className: 'ps-t-caption-xs ps-c-placeholder' }, sub))),
        h(PS.Swap, { k: n ? 'c' : 'a' }, n ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'primary', className: 'ps-doc__chev' }) : h(PS.Icon, { name: 'add', size: 16, color: 'primary' }))),
      h(AP, { initial: false }, n && p.open ? h(m.div, { key: 'files', className: 'ps-doc__body', initial: { height: 0, opacity: 0 },
        animate: { height: 'auto', opacity: 1, transition: { height: Object.assign({}, MT.SPRING, { restDelta: 0.5 }), opacity: MT.ENTER } },
        exit: { height: 0, opacity: 0, transition: { height: Object.assign({}, MT.SPRING, { restDelta: 0.5 }), opacity: MT.LEAVE } } },
        h('div', { className: 'ps-doc__files' }, p.files.map(function (f, i) { return h(R.Fragment, { key: f.id }, i ? h(PS.Divider) : null, h(PS.FileRow, f)); }),
          h(m.button, Object.assign({ type: 'button', ref: add, className: 'ps-doc__add ps-t-label-md-light', onClick: function () { p.onAdd(add.current); } }, PS.press()), h(PS.Icon, { name: 'add', size: 16, color: 'brand' }), 'Add files'))) : null));
  };

  /* SelfieTips: how to take the selfie (DS 5585:5407) — the title with the brand "more" dots, then three pictures (91 × 64, radius 4) each with
     a 16 px tick or cross 4 in from its corner and a Caption/xs line under it · items [{ art, label, ok }] (default: the three Figma tips) · title · onMore(element) */
  var TIPS = [{ art: 'selfie-tip-1', label: 'Look straight', ok: true }, { art: 'selfie-tip-2', label: 'Good lighting', ok: true }, { art: 'selfie-tip-3', label: 'Face uncovered', ok: false }];
  PS.SelfieTips = function SelfieTips(p) {
    var more = R.useRef(null);
    return h(PS.Card, { className: 'ps-stips' },
      h('div', { className: 'ps-stips__head' }, h('p', { className: 'ps-t-section-sm' }, p.title || 'Please follow the instructions below'),
        p.onMore ? h(m.button, Object.assign({ type: 'button', ref: more, className: 'ps-stips__more', 'aria-label': 'More tips', onClick: function () { p.onMore(more.current); } }, PS.press(true)), h('i'), h('i'), h('i')) : null),
      h('div', { className: 'ps-stips__row' }, (p.items || TIPS).map(function (t) {
        return h('div', { key: t.label, className: 'ps-stips__item' },
          h('span', { className: 'ps-stips__pic' }, h('img', { src: PS.asset('art/' + t.art + '.png'), alt: '' }),
            h('i', { className: t.ok ? 'is-ok' : 'is-no' }, h(PS.Icon, { name: t.ok ? 'check' : 'close', size: 8, color: 'inverse' }))),
          h('span', { className: 'ps-t-caption-xs ps-c-placeholder' }, t.label));
      })));
  };
  /* LineTabs: tabs with a brand underline (the address sheet, DS 5975:10755) · items [{ id, label, off }] (off: can't be chosen yet) · value ·
     onChange(id) · id (the underline's layout id). The underline glides on the Smooth spring; label colours change in 150 ms. */
  PS.LineTabs = function LineTabs(p) {
    return h('div', { className: 'ps-ltabs', role: 'tablist' }, p.items.map(function (it) {
      var on = it.id === p.value;
      return h('button', { key: it.id, type: 'button', role: 'tab', 'aria-selected': on, disabled: !!it.off, className: PS.cx('ps-ltabs__tab ps-t-body-md-em', on && 'is-on', it.off && 'is-off'),
          onClick: function () { if (!on && !it.off) p.onChange(it.id); } },
        h('span', null, it.label, on ? h(m.i, { layoutId: (p.id || 'ps-ltabs') + '-bar', className: 'ps-ltabs__bar', transition: MT.SPRING }) : null));
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
    if (!W) return h('div', { className: 'ps-wheel' }, h('p', { className: 'ps-t-caption-sm ps-c-tertiary' }, 'The wheel picker could not load.'));
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
  PS.DatePicker = function DatePicker(p) {
    var min = p.min || { y: 1900, m: 0, d: 1 }, max = p.max || { y: 2100, m: 11, d: 31 };
    function clamp(v) { var n = key(v) < key(min) ? min : key(v) > key(max) ? max : v; return { y: n.y, m: n.m, d: n.d }; }
    var s0 = R.useState(function () { return clamp(p.value || { y: new Date().getFullYear(), m: new Date().getMonth(), d: new Date().getDate() }); }), v = s0[0], setV = s0[1];
    var view = v;     /* the month on show is the chosen date's: changing the month or the year changes the date (the same day, kept inside the month and min … max) */
    var s2 = R.useState('date'), mode = s2[0], setMode = s2[1], s3 = R.useState(null), wheel = s3[0], setWheel = s3[1];
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
        h(m.button, Object.assign({ type: 'button', 'aria-label': 'Previous ' + which, disabled: atStart, onClick: function () { shift(-dm); } }, atStart ? null : PS.press(true)), h(PS.Icon, { name: 'chevron-right', size: 16, color: 'var(--color-stroke-brand-strong)', style: { transform: 'scaleX(-1)' } })),   /* DS: the same Chevron Right, turned */
        h('button', { type: 'button', className: PS.cx('ps-date__label ps-t-section-md-light', mode === which && 'is-on'), 'aria-label': 'Choose the ' + which, onClick: function () { if (mode === which) closeWheel(false); else openWheel(which); } },
          h(PS.Swap, { k: label, y: MT.Y.digit, block: true }, h('span', null, label))),
        h(m.button, Object.assign({ type: 'button', 'aria-label': 'Next ' + which, disabled: atEnd, onClick: function () { shift(dm); } }, atEnd ? null : PS.press(true)), h(PS.Icon, { name: 'chevron-right', size: 16, color: 'var(--color-stroke-brand-strong)' })));
    }
    var atStart = view.y * 12 + view.m <= t0, atEnd = view.y * 12 + view.m >= t1;
    var body;
    if (mode === 'date') {
      var first = new Date(view.y, view.m, 1).getDay(), days = new Date(view.y, view.m + 1, 0).getDate(), cells = [];
      for (var i = 0; i < 42; i++) {   /* always six rows (owner): the weekday row never moves */
        var d = i - first + 1, inMonth = d >= 1 && d <= days, k = inMonth ? key({ y: view.y, m: view.m, d: d }) : 0, off = inMonth && (k < key(min) || k > key(max)), on = inMonth && k === key(v);
        cells.push(inMonth ? h('button', { key: i, type: 'button', disabled: off, 'aria-pressed': on, className: PS.cx('ps-date__day ps-t-body-md-em', on && 'is-on', off && 'is-off'),
          onClick: (function (dd) { return function () { setV({ y: view.y, m: view.m, d: dd }); }; })(d) }, h('i'), h('span', null, d)) : h('span', { key: i, className: 'ps-date__day is-empty' }));
      }
      body = h('div', { className: 'ps-date__cal', onPointerDown: swipeStart, onPointerUp: swipeEnd, onPointerCancel: function () { sw.current = null; } },
        h('div', { className: 'ps-date__week ps-t-caption-xs' }, WEEK.map(function (w) { return h('span', { key: w }, w); })),
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
        h('p', { className: 'ps-t-section-md-light' }, p.title || 'Select date'), h(PS.Glass, { icon: 'check', label: 'Done', onClick: done })),
      h('div', { className: 'ps-date__steps' }, stepper(MONTHS[view.m], 'month', 1), stepper(String(view.y), 'year', 12)),
      h('div', { className: 'ps-date__body' }, h(PS.Crossfade, { k: mode === 'date' ? 'date' : 'wheel', className: 'ps-date__view' }, body)));
  };
})();
