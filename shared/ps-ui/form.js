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
        h(PS.Icon, { name: 'close-circle-filled', size: 20, color: 'tertiary' })) : null,
      pick ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary', className: 'ps-field__chev' }) : null);
    return h('div', { className: PS.cx('ps-fieldwrap', p.className) }, box,
      h(AP, { initial: false }, p.error ? h(m.p, Object.assign({ key: 'e', className: 'ps-field__msg is-error ps-t-caption-sm' }, PS.fade(-4)), p.error)
        : p.hint ? h('p', { key: 'h', className: 'ps-field__msg ps-t-caption-sm' }, p.hint) : null));
  };
  /* PhoneField: country pill (+63) + the number box · value · onChange · error · label ('Phone Number') · placeholder */
  PS.PhoneField = function PhoneField(p) {
    return h('div', { className: 'ps-phonefield' },
      h('span', { className: 'ps-phonefield__cc' }, h('span', { className: 'ps-flag-ph', 'aria-hidden': true }), h('span', { className: 'ps-t-body-md ps-c-tertiary' }, p.code || '+63')),
      h(PS.Field, { label: p.label || 'Phone Number', value: p.value, onChange: function (v) { p.onChange(v.replace(/[^\d]/g, '').slice(0, 10)); }, error: p.error,
        placeholder: p.placeholder || 'Enter your phone number', inputMode: 'numeric', type: 'tel', autoFocus: p.autoFocus, className: 'ps-phonefield__num' }));
  };

  /* OtpBoxes: 6 boxes 48 × 60 over one hidden number input · value · onChange(text) · length (6) · error (red boxes) · autoFocus · disabled
     A digit pops in (0.18 s); the active box carries the brand ring. */
  PS.OtpBoxes = function OtpBoxes(p) {
    var n = p.length || 6, v = p.value || '', ref = R.useRef(null), s = R.useState(false), focus = s[0], setFocus = s[1];
    R.useEffect(function () { if (p.autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
    var cells = [];
    for (var i = 0; i < n; i++) (function (i) {
      var ch = v.charAt(i), active = focus && !p.error && i === Math.min(v.length, n - 1);
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
        h('span', { className: 'ps-contact__ring' }, h(PS.Icon, { name: it.icon, size: 24 })), h('span', { className: 'ps-t-caption-sm' }, it.label));
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
    return h('label', { className: PS.cx('ps-search', p.className) }, h(PS.Icon, { name: 'search', size: 16, color: 'tertiary' }),
      h('input', { value: p.value || '', placeholder: p.placeholder || 'Search', autoFocus: p.autoFocus, 'aria-label': p.placeholder || 'Search', onChange: function (e) { p.onChange(e.target.value); } }),
      p.value ? h('button', { type: 'button', 'aria-label': 'Clear', onClick: function () { p.onChange(''); } }, h(PS.Icon, { name: 'close-circle-filled', size: 16, color: 'tertiary' })) : null);
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
  /* Stars: 1–5 rating · value · onChange */
  PS.Stars = function Stars(p) {
    return h('div', { className: 'ps-stars', role: 'radiogroup', 'aria-label': 'Rating' }, [1, 2, 3, 4, 5].map(function (n) {
      return h(m.button, Object.assign({ key: n, type: 'button', role: 'radio', 'aria-checked': p.value === n, 'aria-label': n + ' of 5', className: PS.cx('ps-star', n <= (p.value || 0) && 'is-on'),
        onClick: function () { p.onChange(n); } }, PS.press(true)), h(PS.Icon, { name: 'star', size: 28 }));
    }));
  };
})();
