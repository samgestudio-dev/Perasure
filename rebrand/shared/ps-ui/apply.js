/* PeraSure UI — applying and identity: the page head, the camera (ID and face), the selfie circle, the ID sides, what an ID check says,
   support documents, the address picker, the loan estimate, and help articles with their feedback.
   Needs core.js, layout.js (SheetHead, ButtonRow) and form.js (Search, Popover, FileRow, LineTabs). Figma: app file "Application Details"
   (52:5194 … 52:7050) and the DS file (5561:7329, 5788:13914, 5908:10722, 5908:11000, 5975:10755, 8667:28313, 9224:37691, 5453:4947). */
(function () {
  'use strict';
  var R = window.React, PS = window.PS, h = R.createElement, m = PS.m, AP = PS.AP, MT = PS.MT;

  /* PageHead: a page's own big title + one line under it (24 / 32 and 14 / 20, inset 8 from the column) · title · body · center */
  PS.PageHead = function PageHead(p) {
    return h('div', { className: PS.cx('ps-phead', p.center && 'ps-phead--center', p.className) }, h('h1', { className: 'ps-text-title-lg' }, p.title),
      p.body ? h('p', { className: 'ps-text-body-md ps-c-secondary' }, p.body) : null);
  };

  /* useCamera(facing 'user' | 'environment', on): the phone's own camera (getUserMedia) → { video (ref for a <video>), state starting | on | none,
     snap(fallback) → a JPEG data URL of what it shows (a selfie as the person saw it), or the fallback when there is no camera }.
     No camera (or no permission): state 'none' — the shutter still passes the step with a sample picture, so a flow can always be walked through */
  PS.useCamera = function useCamera(facing, on) {
    var video = R.useRef(null), stream = R.useRef(null), st = R.useState('starting'), state = st[0];
    R.useEffect(function () {
      if (!on) return;
      var dead = false, md = navigator.mediaDevices;
      if (!md || !md.getUserMedia) { st[1]('none'); return; }
      md.getUserMedia({ video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false }).then(function (s) {
        if (dead) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
        stream.current = s; if (video.current) { video.current.srcObject = s; video.current.play().catch(function () {}); } st[1]('on');
      }).catch(function () { if (!dead) st[1]('none'); });
      return function () { dead = true; if (stream.current) stream.current.getTracks().forEach(function (t) { t.stop(); }); stream.current = null; };
    }, [facing, on]);
    function snap(fallback) {
      var v = video.current;
      if (state !== 'on' || !v || !v.videoWidth) return fallback;
      var c = document.createElement('canvas'), w = Math.min(960, v.videoWidth), hh = Math.round(w * v.videoHeight / v.videoWidth);
      c.width = w; c.height = hh; var g = c.getContext('2d');
      if (facing === 'user') { g.translate(w, 0); g.scale(-1, 1); }
      g.drawImage(v, 0, 0, w, hh); return c.toDataURL('image/jpeg', 0.85);
    }
    return { video: video, state: state, snap: snap };
  };
  /* pickFile(accept, then(dataUrl | null, file), capture): the phone's file / photo picker; capture ('environment' | 'user') opens the camera.
     Pictures come back as a data URL to show; other files (a PDF) as null + the file */
  PS.pickFile = function pickFile(accept, then, capture) {
    var i = document.createElement('input'); i.type = 'file'; i.accept = accept; if (capture) i.setAttribute('capture', capture);
    i.onchange = function () { var f = i.files && i.files[0]; if (!f) return; if (!/^image\//.test(f.type)) { then(null, f); return; } var r = new FileReader(); r.onload = function () { then(r.result, f); }; r.readAsDataURL(f); };
    i.click();
  };

  /* Shutter: the camera's round button (60: a 3 ring, 3, a 48 disc) · onClick · label */
  PS.Shutter = function Shutter(p) {
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-shutter', p.className), 'aria-label': p.label || 'Take the picture', onClick: p.onClick }, PS.press(true)), h('i'));
  };

  /* IdCamera (Figma 52:6602 / 52:6616; DS 5788:13914 / 5797:13982): the whole screen, laid out for an ID held sideways — the hint down the
     left, the ID's box, the side (ID card mark + name, Text/Brand/Light) down the right, the shutter, a back button turned the same way.
     side front | back · cam (PS.useCamera('environment', true)) · onShoot · onClose */
  PS.IdCamera = function IdCamera(p) {
    var cam = p.cam || {}, side = p.side || 'front';
    return h('div', { className: PS.cx('ps-cam', p.className) },
      h('video', { ref: cam.video, className: 'ps-cam__video', playsInline: true, muted: true, autoPlay: true }),
      h('div', { className: 'ps-cam__frame' },
        h('p', { className: 'ps-cam__hint ps-text-body-sm' }, 'Make sure every detail is clear and the whole ID fits in the box.'),
        h('div', { className: 'ps-cam__box' }, cam.state === 'none' ? h('span', { className: 'ps-text-body-sm' }, 'The camera isn’t available here. Take the picture anyway to use a sample.') : null),
        h('p', { className: 'ps-cam__side ps-text-title-sm' }, h(PS.Icon, { name: 'id-card', size: 28, color: 'brand-light' }), side === 'front' ? 'Front side of your ID' : 'Back side of your ID')),
      h(PS.Shutter, { onClick: p.onShoot }),
      h(m.button, Object.assign({ type: 'button', className: 'ps-cam__close', 'aria-label': 'Close the camera', onClick: p.onClose }, PS.press(true)), h(PS.Icon, { name: 'chevron-left', size: 18, color: 'inverse' })));
  };

  /* IdSideCard (Figma 52:6066 / 52:6134; DS 5583:4934 · 6012:34214): one side of the ID — the sample picture, or the photo taken (blurred under a
     green ring and a tick), its name and a hint, Camera / Album · side front | back · title · name · hint · pic (data URL once taken) · onCamera · onAlbum */
  PS.IdSideCard = function IdSideCard(p) {
    var pic = p.pic;
    return h(PS.Card, { variant: 'outline', className: 'ps-idside' },
      h('p', { className: 'ps-text-label-md' }, p.title),
      h('div', { className: 'ps-idside__box' },
        h('div', { className: 'ps-idside__row' },
          h('span', { className: PS.cx('ps-idside__pic', pic && 'is-done') }, h('img', { src: pic || PS.asset('art/id-' + (p.side || 'front') + '.png'), alt: '' }),
            pic ? h(m.span, { className: 'ps-idside__tick', initial: { scale: 0.6, opacity: 0 }, animate: { scale: 1, opacity: 1, transition: Object.assign({}, MT.SPRING, { restDelta: 0.001 }) } }, h(PS.Icon, { name: 'check', size: 12, color: 'on-action' })) : null),
          h('span', { className: 'ps-idside__text' }, h('span', { className: 'ps-text-title-xs' }, p.name), h('span', { className: 'ps-text-body-sm' }, pic ? 'Added. Retake it if it’s blurry.' : p.hint))),
        h(PS.Divider),
        h('div', { className: 'ps-idside__btns' },
          h(PS.Button, { variant: 'soft', size: 'sm', onClick: p.onCamera }, 'Camera'),
          h(PS.Button, { variant: 'soft', size: 'sm', onClick: p.onAlbum }, 'Album'))));
  };

  /* Selfie (Figma 52:5784 / 52:5912 / 52:6050; DS 5561:7329 · uploading 5561:7501 · failed 5561:7411): the front camera in the circle.
     state live | checking (a turning dashed ring, "Uploading") | failed ("Failed" in red) · cam (PS.useCamera('user', state === 'live'))
     children: what sits under the circle (the tips) */
  PS.Selfie = function Selfie(p) {
    var state = p.state || 'live', busy = state === 'checking', cam = p.cam || {};
    return h('div', { className: PS.cx('ps-selfie', 'is-' + state, p.className) },
      h('div', { className: 'ps-selfie__ring' },
        h('video', { ref: cam.video, className: 'ps-selfie__video', playsInline: true, muted: true, autoPlay: true, style: { visibility: state === 'live' ? 'visible' : 'hidden' } }),
        h(AP, null, busy ? h(m.svg, { key: 'ring', className: 'ps-selfie__dash', viewBox: '0 0 200 200', 'aria-hidden': true, initial: { opacity: 0, rotate: 0 },
            animate: { opacity: 1, rotate: PS.reduce ? 0 : 360, transition: { opacity: MT.ENTER, rotate: { duration: 8, ease: 'linear', repeat: Infinity } } }, exit: { opacity: 0, transition: MT.LEAVE } },
          h('circle', { cx: 100, cy: 100, r: 90 })) : null),
        h(AP, null, busy ? h(m.span, Object.assign({ key: 'c', className: 'ps-selfie__state is-brand' }, PS.fade(MT.Y.text)), h(PS.Icon, { name: 'upload-cloud', size: 26, color: 'var(--content-accent-strong)' })   /* BRIEF 29 */, h('span', { className: 'ps-text-label-md' }, 'Uploading'))
          : state === 'failed' ? h(m.span, Object.assign({ key: 'f', className: 'ps-selfie__state is-negative' }, PS.fade(MT.Y.text)), h(PS.Icon, { name: 'alert-filled', size: 26, color: 'var(--content-negative)' }), h('span', { className: 'ps-text-label-md' }, 'Failed'))
          : cam.state === 'none' ? h('span', { key: 'n', className: 'ps-selfie__none ps-text-body-sm' }, 'The camera isn’t available here. Tap Next to use a sample.') : null)),
      p.children);
  };

  /* FaceCamera (DS 8667:28313 / 8667:28329): black, an oval of 260 × 334, the hint under it; after the shutter the photo with Take again / Next.
     cam (PS.useCamera('user', !shot)) · shot (data URL or null) · title · onBack · onTake · onRetake · onNext */
  PS.FaceCamera = function FaceCamera(p) {
    var cam = p.cam || {}, shot = p.shot;
    return h('div', { className: PS.cx('ps-face', p.className) },
      h('div', { className: 'ps-face__top' }, h(PS.Glass, { icon: 'chevron-left', label: 'Back', className: 'ps-face__back', onClick: p.onBack }),
        h('p', { className: 'ps-text-title-xs' }, p.title || 'Confirm your identity'), h('span')),
      h('div', { className: 'ps-face__oval' },
        h('video', { ref: cam.video, playsInline: true, muted: true, autoPlay: true, style: { visibility: shot ? 'hidden' : 'visible' } }),
        shot ? h(m.img, { src: shot, alt: '', initial: { opacity: 0 }, animate: { opacity: 1, transition: MT.ENTER } }) : null,
        cam.state === 'none' && !shot ? h('span', { className: 'ps-text-body-sm' }, 'The camera isn’t available here. Take the picture anyway to use a sample.') : null),
      h(PS.Swap, { k: shot ? 'b' : 'a', block: true, className: 'ps-face__hint' }, h('p', { className: 'ps-text-body-lg-strong' }, shot ? 'Make sure your face and eyes are uncovered' : 'Keep your face within the oval')),
      h('div', { className: PS.cx('ps-face__bot', shot && 'is-shot') }, h(PS.Crossfade, { k: shot ? 'b' : 'a', className: 'ps-face__acts' }, shot
        ? [h(PS.Button, { key: 'a', variant: 'shade', className: 'ps-face__again', onClick: p.onRetake }, 'Take again'), h(PS.Button, { key: 'n', variant: 'inverse', onClick: p.onNext }, 'Next')]
        : h(PS.Shutter, { onClick: p.onTake }))));
  };

  /* SheetHero: the top of a decision sheet — a 100 px picture, the title, a line (DS 5908:10722) · art (src) or pic (node) · title · body */
  PS.SheetHero = function SheetHero(p) {
    return h('div', { className: PS.cx('ps-shero', p.className) }, p.pic || h('img', { src: p.art, alt: '', className: 'ps-shero__art' }),
      h('p', { className: 'ps-text-title-md' }, p.title), p.body ? h('p', { className: 'ps-text-body-md ps-c-secondary' }, p.body) : null);
  };
  /* ChoiceButton · ChoiceList: ways forward as outlined white buttons, a link-blue title and a grey line under it, then a quiet text button
     (DS 5908:10722) · ChoiceButton: title · sub · onClick — ChoiceList: items [{ title, sub, onClick }] · more { label, onClick } */
  PS.ChoiceButton = function ChoiceButton(p) {
    var brand = p.tone === 'brand';   /* spec ChoiceButton 11166:4430: tone link (grey line, link title) | brand (brand line and title) */
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-choice', brand && 'ps-choice--brand'), onClick: p.onClick }, PS.press()),
      h('span', { className: PS.cx('ps-text-body-lg-strong', brand ? 'ps-c-brand' : 'ps-c-link') }, p.title), h('span', { className: 'ps-text-body-xs ps-c-tertiary' }, p.sub));
  };
  PS.ChoiceList = function ChoiceList(p) {
    return h('div', { className: 'ps-choices' }, p.items.map(function (it) { return h(PS.ChoiceButton, Object.assign({ key: it.title }, it)); }),
      p.more ? h(m.button, Object.assign({ type: 'button', className: 'ps-choices__more ps-text-body-md-strong ps-c-placeholder', onClick: p.more.onClick }, PS.press()), p.more.label) : null);
  };
  /* PhotoTips: four pictures of what to avoid, two by two on the inset grey (DS 5908:11000) · tips (labels, in the sprite's order) · art (2 × 2 sprite) */
  PS.PhotoTips = function PhotoTips(p) {
    var art = p.art || PS.asset('art/verify-failed.webp');
    return h('div', { className: 'ps-ptips' }, (p.tips || ['Avoid false documents', 'Avoid flash', 'Avoid incomplete', 'Avoid blurry']).map(function (t, i) {
      return h('div', { key: t }, h('span', { className: 'ps-ptips__pic', style: { backgroundPosition: (i % 2) * 100 + '% ' + Math.floor(i / 2) * 100 + '%', backgroundImage: 'url("' + art + '")' } }), h('span', { className: 'ps-text-body-sm ps-c-tertiary' }, t));
    }));
  };
  /* IdResult: what the ID check says, inside a card sheet with className 'ps-idres' (16 16 24, 16 between blocks).
     state inuse (DS 5908:10722: the ID belongs to another account — log in there, recover with a new number, or use another ID)
     | failed (DS 5908:11000: why photos fail; "Try again" is the quiet one, repeated tries count against the application)
     onLogin · onRecover · onOther — onRetry · onManual · onClose */
  PS.IdResult = function IdResult(p) {
    if (p.state === 'failed') return h(R.Fragment, null,
      h(PS.SheetHead, { align: 'left', bottom: true, title: 'We couldn’t verify your ID', icon: 'warning-filled', iconColor: 'var(--content-negative-subtle)', onClose: p.onClose }),
      h('p', { className: 'ps-text-body-md', style: { color: 'var(--content-negative-subtle)' } }, 'Repeated failures may affect your application, so check the photo carefully.'),
      h(PS.PhotoTips),
      h(PS.ButtonRow, null,
        h(PS.Button, { variant: 'neutral', size: 'md', onClick: p.onRetry }, 'Try again'),   /* BRIEF 24 */
        h(PS.Button, { size: 'md', onClick: p.onManual }, 'Enter manually')));
    return h(R.Fragment, null,
      h(PS.SheetHero, { art: PS.asset('art/id-in-use.png'), title: 'This ID is already in use', body: 'This ID is linked to another account. Choose what you’d like to do next.' }),
      h(PS.ChoiceList, { items: [{ title: 'Log in to your existing account', sub: 'Continue with your previous account', onClick: p.onLogin },
        { title: 'Can’t access that number', sub: 'Recover your account with a new phone number', onClick: p.onRecover }], more: { label: 'Use a different ID', onClick: p.onOther } }));
  };

  /* FileList: support documents in a form (DS 9548:30951) — each file on a white card (PS.FileRow), then the dashed "Add files" with the count
     (and the hint only while there are none); it opens Take a photo / Choose from photos / Choose from files as a popover.
     label · files [{ name, size, pic }] · max (3) · hint · note · onAdd(option) · onRemove(index) */
  /* FileAdd (spec UploadTile Type=File, State=Empty / Add more): the dashed "Add files (n/3)", with the hint only while there are none (80 / 48) · count · max (3) · hint · onClick */
  PS.FileAdd = function FileAdd(p) {
    var n = p.count || 0;
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-files__btn', n && 'has-files'), onClick: p.onClick }, PS.press()),
      h('span', { className: 'ps-c-brand' }, h(PS.Icon, { name: 'add', size: 16, color: 'brand' }), h('span', null, 'Add files'), h('span', null, '(' + n + '/' + (p.max || 3) + ')')),
      n || !p.hint ? null : h('span', { className: 'ps-text-body-xs ps-c-placeholder' }, p.hint));
  };
  PS.FileList = function FileList(p) {
    var ms = R.useState(false), menu = ms[0], files = p.files || [], n = files.length;
    return h('div', { className: PS.cx('ps-files', p.className) },
      p.label ? h('span', { className: 'ps-ff__label ps-files__label' }, p.label) : null,   /* BRIEF 33: Body/sm (legacy 12 Regular) */
      files.map(function (f, i) {
        return h('div', { key: f.name + i, className: 'ps-files__item' }, h(PS.FileRow, { name: f.name, size: f.size, pic: f.pic, state: 'done', onRemove: function () { p.onRemove(i); } }));
      }),
      h('div', { className: 'ps-files__add' },
        h(PS.FileAdd, { count: n, max: p.max, hint: p.hint, onClick: function () { ms[1](true); } }),
        h(PS.Popover, { open: menu, options: ['Take a photo', 'Choose from photos', 'Choose from files'], onClose: function () { ms[1](false); },
          onPick: function (o) { ms[1](false); p.onAdd(o); } })),
      p.note ? h(PS.FileNote, null, p.note) : null);
  };
  /* FileNote: the small grey line under uploads ("Supports JPG, JPEG, PNG and PDF") with its 12 px mark */
  PS.FileNote = function FileNote(p) {
    return h('p', { className: PS.cx('ps-files__note ps-text-body-xs ps-c-placeholder', p.className) }, h(PS.Icon, { name: 'alert-circle', size: 12, color: 'placeholder' }), p.children);
  };

  /* SearchSheet: a full-height sheet's search + close over the top on the sheet's own veil (what scrolls up fades under it), the list under it.
     placeholder · value · onChange · onClose · tone inset (grey page sheet, Figma 52:7763) | white (DS 7792:15391: put the sheet in
     className 'ps-sheet--white') · bodyRef (the element that scrolls) · children */
  PS.SearchSheet = function SearchSheet(p) {
    var white = p.tone === 'white';
    return h(R.Fragment, null,
      h('div', { className: PS.cx('ps-ssheet__head', white && 'ps-ssheet__head--white') }, h(PS.Search, { value: p.value, onChange: p.onChange, placeholder: p.placeholder }), h(PS.Close, { onClick: p.onClose })),
      h('div', { ref: p.bodyRef, className: PS.cx('ps-ssheet__body', white && 'ps-ssheet__body--white') }, p.children));
  };
  /* BankList: banks grouped by their first letter, each group a white card, a 24 px logo before each name (Figma 52:8428)
     groups [{ title, items: [{ id, name, logo }] }] · onPick(item) */
  /* BankRow (spec .BankRow 11113:3530): one bank — logo 24 + name · logo · name · state default | focus (gallery: the tapped look) · onClick */
  PS.BankRow = function BankRow(p) {
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-banks__row ps-text-body-md-strong', p.state === 'focus' && 'is-focus'), onClick: p.onClick }, PS.press()),
      h('img', { src: p.logo, alt: '' }), p.q ? PS.mark(p.name, p.q) : p.name);   /* q: the typed search (BRIEF 31) */
  };
  PS.BankList = function BankList(p) {   /* phase 1: legacy rows (BankList 11114:3891, .BankRow logo 24 + name) */
    return p.groups.map(function (g) {
      return h(PS.Card, { key: g.title, className: 'ps-banks' }, h('p', { className: 'ps-text-body-xs ps-c-tertiary' }, g.title), g.items.map(function (b, i) {
        return h(R.Fragment, { key: b.id }, i ? h(PS.Divider) : null, h(PS.BankRow, { logo: b.logo, name: b.name, q: p.q, onClick: function () { p.onPick(b); } }));
      }));
    });
  };

  /* mark(text, q): the typed part of a search hit in brand blue */
  PS.mark = function mark(text, q) {
    var i = text.toLowerCase().indexOf(q); if (!q || i < 0) return text;
    return [text.slice(0, i), h('span', { key: 'm', className: 'ps-match' }, text.slice(i, i + q.length)), text.slice(i + q.length)];   /* BRIEF 31: Content/Accent/Strong, same weight */
  };
  /* PlacePicker (DS 5975:10755 · 5975:10704 · 5975:11304): the address sheet — search, or Region → Province → City. The tabs underline the step;
     Province opens once a region is chosen, City once a province is. Search shows the matching cities, provinces and regions in groups (no
     group title when there is only one), the typed part in brand blue. Goes in a page sheet (the SearchSheet's grey look).
     places [[region, [[province, [cities]]]]] (the app's: prototypes/app/ph-places.js, PSA PSGC) · onPick(city, province) · onClose · id */
  /* PlaceRow (spec PlaceRow 11166:4427 = legacy search city popover/list 5974:9438 · City list 3439:3010): one place of the address picker — a
     region / province with a chevron, or a city with its province under it; the typed part in brand · kind region | city · label · sub · q (typed) ·
     on (selected) · onClick. phase 1: the legacy rows (60, 72 with a second line); the last row of a card has no line (CSS :last-child) */
  PS.PlaceRow = function PlaceRow(p) {
    var region = p.kind !== 'city';
    return h(m.button, Object.assign({ type: 'button', className: PS.cx('ps-places__row', p.sub && 'has-sub', p.on && 'is-on', p.last === false && 'has-line'), onClick: p.onClick }, PS.press()),
      h('span', { className: 'ps-places__text' }, h('span', { className: 'ps-text-body-md' }, p.q ? PS.mark(p.label, p.q) : p.label), p.sub ? h('span', { className: 'ps-text-body-sm ps-c-tertiary' }, p.sub) : null),
      region ? h(PS.Icon, { name: 'chevron-right', size: 16, color: 'tertiary' }) : null);
  };
  function placeIndex(list) {
    var regions = (list || []).map(function (r) { return { name: r[0], provinces: r[1].map(function (p) { return { name: p[0], region: r[0], cities: p[1] }; }) }; });
    var provinces = [], cities = [];
    regions.forEach(function (r) { r.provinces.forEach(function (p) { p.r = r; provinces.push(p); p.cities.forEach(function (c) { cities.push({ name: c, p: p }); }); }); });
    return { regions: regions, provinces: provinces, cities: cities };
  }
  function hit(text, q) { return text.toLowerCase().indexOf(q) >= 0; }
  PS.PlacePicker = function PlacePicker(p) {
    var X = R.useMemo(function () { return placeIndex(p.places); }, [p.places]);
    var q = R.useState(''), tab = R.useState('region'), sel = R.useState({}), k = q[0].trim().toLowerCase(), s = sel[0];
    function choose(c, pv) { p.onPick(c, pv.name); }
    function pickRegion(r) { sel[1]({ region: r }); tab[1]('province'); }
    function pickProvince(pv) { sel[1]({ region: pv.r, prov: pv }); tab[1]('city'); q[1](''); }
    function row(key, title, sub, go, chevron) { return h(PS.PlaceRow, { key: key, kind: chevron ? 'region' : 'city', label: title, sub: sub, q: k, onClick: go }); }
    var body;
    if (k) {
      var cs = X.cities.filter(function (c) { return hit(c.name, k); }).slice(0, 40), ps = X.provinces.filter(function (pv) { return hit(pv.name, k); }).slice(0, 20), rs = X.regions.filter(function (r) { return hit(r.name, k); });
      var groups = [['City', cs.map(function (c, i) { return row('c' + i, c.name, c.p.name + ', ' + c.p.region, function () { choose(c.name, c.p); }); })],
        ['Province', ps.map(function (pv) { return row('p' + pv.name, pv.name, null, function () { pickProvince(pv); }, true); })],
        ['Region', rs.map(function (r) { return row('r' + r.name, r.name, null, function () { q[1](''); pickRegion(r); }, true); })]].filter(function (g) { return g[1].length; });
      var single = groups.length === 1;
      body = groups.length ? groups.map(function (g) {
        return h('div', { key: g[0], className: 'ps-places__group' }, single ? null : h('p', { className: 'ps-ff__label' }, g[0]), h('div', { className: 'ps-card ps-places__list' }, g[1]));
      }) : h(PS.EmptyState, { title: 'No matching places', body: 'Check the spelling or try another name.' });
    } else {
      var R0 = s.region, P0 = s.prov, rows;
      if (tab[0] === 'region') rows = X.regions.map(function (r) { return row(r.name, r.name, null, function () { pickRegion(r); }, true); });
      else if (tab[0] === 'province') rows = (R0 || X.regions[0]).provinces.map(function (pv) { return row(pv.name, pv.name, null, function () { pickProvince(pv); }, true); });
      else rows = (P0 || X.provinces[0]).cities.map(function (c) { var pv = P0 || X.provinces[0]; return row(c, c, pv.name + ', ' + pv.region, function () { choose(c, pv); }); });
      body = h('div', { className: 'ps-card ps-places__card' },
        h(PS.LineTabs, { id: p.id || 'ps-places', value: tab[0], onChange: tab[1], items: [{ id: 'region', label: 'Region' }, { id: 'province', label: 'Province', off: !R0 }, { id: 'city', label: 'City', off: !P0 }] }),
        h(PS.Crossfade, { k: tab[0] + (R0 ? R0.name : '') + (P0 ? P0.name : ''), className: 'ps-places__list' }, rows));
    }
    return h(PS.SearchSheet, { value: q[0], onChange: q[1], placeholder: p.placeholder || 'Search city name', onClose: p.onClose },
      h(PS.Crossfade, { k: k ? 'q' : 'tabs', className: 'ps-places' }, body));
  };

  /* EstimateCard (DS 9224:37691): the amount card and the numbers as one card — a line after the terms, the rows, a line, a link — and a
     small note under it. AmountCard's props (label · amount · min · max · step · terms · term · termNote · onAmount · onCommit · onTerm)
     + rows [{ label, value }] · link { label, onClick } · note */
  PS.EstimateCard = function EstimateCard(p) {
    return h('div', { className: PS.cx('ps-estimate', p.className) },
      h(PS.AmountCard, { label: p.label, amount: p.amount, min: p.min, max: p.max, step: p.step, terms: p.terms, term: p.term, termNote: p.termNote,
        onAmount: p.onAmount, onCommit: p.onCommit || function () {}, onTerm: p.onTerm }),
      h(PS.Card, { className: 'ps-estimate__rows' }, h(PS.Divider), h(PS.Rows, { rows: p.rows }),
        p.link ? h(PS.Divider) : null, p.link ? h(PS.Link, { onClick: p.link.onClick }, p.link.label) : null),
      p.note ? h('p', { className: 'ps-estimate__note ps-text-body-xs ps-c-placeholder' }, p.note) : null);
  };

  /* Article · Feedback · RelatedLinks: a help article (DS 5453:4947 · 6149:12701 · 6150:12923 · 6150:12975)
     Article: blocks [{ h } | { p } | { list: [] }] — Feedback: value null | 'Yes' | 'No' · onVote(answer) · question · thanks (full width, a line
     above and below; the answer chosen turns dark) — RelatedLinks: title · items [{ id, label, onClick }] */
  PS.Article = function Article(p) {
    return h('div', { className: PS.cx('ps-article', p.className) }, p.blocks.map(function (b, i) {
      return b.h ? h('p', { key: i, className: 'ps-text-title-xs ps-article__h' }, b.h)
        : b.list ? h('ul', { key: i, className: 'ps-text-body-md ps-c-secondary ps-article__ul' }, b.list.map(function (x) { return h('li', { key: x }, x); }))
        : h('p', { key: i, className: 'ps-text-body-md ps-c-secondary' }, b.p);
    }));
  };
  PS.Feedback = function Feedback(p) {
    var vote = p.value;
    return h('div', { className: PS.cx('ps-vote', p.className) },
      h(PS.Swap, { k: vote ? 'thanks' : 'ask', block: true }, h('p', { className: 'ps-text-title-sm' }, vote ? (p.thanks || 'Thanks for letting us know') : (p.question || 'Was this article helpful?'))),
      h('div', { className: 'ps-vote__chips' }, ['Yes', 'No'].map(function (x) {
        return h(m.button, Object.assign({ key: x, type: 'button', className: PS.cx('ps-vote__chip ps-text-label-md', vote === x && 'is-on'), 'aria-pressed': vote === x,
          onClick: function () { p.onVote(x); } }, PS.press()), x);
      })));
  };
  PS.RelatedLinks = function RelatedLinks(p) {
    return h('div', { className: PS.cx('ps-related', p.className) }, h('p', { className: 'ps-text-label-md ps-c-tertiary' }, p.title || 'Related articles'),
      p.items.map(function (x) { return h(m.button, Object.assign({ key: x.id, type: 'button', className: 'ps-related__row ps-text-body-lg', onClick: x.onClick }, PS.press()), x.label); }));
  };

  /* PageHero: a picture over a centred PageHead (Permissions: "Why do we ask for these?") · art (name in assets/art) · ext (png) · size (120) · title · body */
  PS.PageHero = function PageHero(p) {
    return h('div', { className: 'ps-phero' }, h(PS.Art, { name: p.art, ext: p.ext || 'png', size: p.size || 120 }), h(PS.PageHead, { center: true, title: p.title, body: p.body }));
  };
})();
