// Production takes: phi_h5_025 (visual + motion tree) built with `vite build --mode test` and served by
// `vite preview` on 127.0.0.1:4173, API answered by mock.mjs, a fake signed-in user in localStorage.
// Ids match reference/curves/<id>.json so cmp.py can compare them (see cmp.py PAIRS for what is compared).
import { HARNESS_USER_ID } from './mock.mjs';

export const SPECS = [];
const add = s => SPECS.push(s);
const T = (name, sel, props, max, extra) => Object.assign({ name, sel, props, max }, extra || {});
const J = (name, js, props, max, extra) => Object.assign({ name, js, props, max }, extra || {});
// fake signed-in user (src/utils/browser/user reads localStorage 'x-user'); the id puts it in the B bucket (mock.mjs)
const USER = `try{localStorage.setItem('x-user', JSON.stringify({phone:'',token:'harness-token',userId:'${HARNESS_USER_ID}',category:''}))}catch(e){}`;
const NOUSER = "try{localStorage.removeItem('x-user')}catch(e){}";
const byText = t => `() => [...document.querySelectorAll('button, a, [role=button]')].filter(n => n.textContent.trim() === ${JSON.stringify(t)}).at(-1)`;
const btn = t => ({ js: byText(t) });
const clickBtn = t => ({ js: `(() => { const b = (${byText(t)})(); b && b.click(); return !!b; })()` });
// test-mode Home with the re-loan mock scene (src/pages/HomePage/mock/homeMockScene.ts)
const HOME = { url: '/?homeMockScene=reloan', preScript: USER, ready: "[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Withdraw')", settleBefore: 1500 };
const ENTER = { js: "(() => { const i = document.querySelector('input'); i.focus(); i.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })); return true; })()" };
const tapEv = (target, ev = 'click', hold = 70) => ({ waitEvent: ev, steps: [{ tap: target, hold }] });
const KEYS = J('key', '() => __u.keys()', ['op', 'tf'], 12, { byIndex: true });

add({ id: 'M-013', name: 'Sheet open (Account > Log Out card sheet)', ...HOME, setup: [clickBtn('Account'), { wait: 2000 }],
  trigger: { js: clickBtn('Log Out').js }, maxMs: 2500,
  targets: [T('sheet', '[data-sheet-layer] > [data-placement]', ['tf', 'rect']), T('scrim', '[data-sheet-layer] > div:first-child', ['op'])] });
add({ id: 'M-013_close', name: 'Sheet close (tap the scrim)', ...HOME, setup: [clickBtn('Account'), { wait: 2000 }, { js: clickBtn('Log Out').js }, { wait: 1300 }],
  trigger: { waitEvent: 'click', steps: [{ tap: { x: 180, y: 120 }, hold: 70 }] }, maxMs: 2500,
  targets: [T('sheet', '[data-sheet-layer] > [data-placement]', ['tf', 'rect']), T('scrim', '[data-sheet-layer] > div:first-child', ['op'])] });
add({ id: 'M-016', name: 'Toast stack (login: Next with an empty number, 3 times)', url: '/login', preScript: NOUSER,
  ready: "[...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Next')", settleBefore: 1200,
  setup: [ENTER, { wait: 700 }, ENTER, { wait: 700 }], trigger: { js: ENTER.js }, maxMs: 2500,
  targets: [T('toast', '[aria-live="polite"] > [role="status"]', ['op', 'tf', 'blur', 'rect', 'text'], 3, { byIndex: true })] });
add({ id: 'M-008', name: 'Page crossfade (Account > About PeraSure)', ...HOME, setup: [clickBtn('Account'), { wait: 2000 }],
  trigger: { js: clickBtn('About PeraSure').js }, minMs: 100, maxMs: 2500,
  targets: [T('page', '[data-page-present]', ['op', 'tf', 'css:z-index', 'attr:data-page-present'], 4, { byIndex: true })] });
add({ id: 'M-037', name: 'Menu grow (basic info: marital status)', url: '/info/basic', preScript: USER,
  ready: "document.querySelector('main') && !document.querySelector('[role=alert]') && document.querySelectorAll('button').length > 3", settleBefore: 1500,
  mocks: { '/util/dictionary': { code: 0, data: { maritalStatus: [{ label: 'Single', value: 1 }, { label: 'Married', value: 2 }, { label: 'Widowed', value: 3 }, { label: 'Separated', value: 4 }, { label: 'Annulled', value: 5 }], occupation: [{ label: 'Employee', value: 1 }, { label: 'Self-employed', value: 2 }] } } },
  trigger: tapEv({ js: "() => [...document.querySelectorAll('button')].find(b => /marital/i.test(b.getAttribute('data-event-type') || '') || /Select marital|marital status/i.test(b.textContent))" }), maxMs: 2000,
  targets: [T('pop', '[data-motion]', ['op', 'tf', 'blur', 'rect', 'css:transform-origin', 'attr:data-motion'])] });
// The normal path: the app opens on Home, the first tap is Withdraw. The keypad mounts when the withdraw route
// has its data (GET /card/list, ~340 ms after the tap in production); the cascade is timed from that mount.
add({ id: 'M-099', name: 'Keypad first open (app opens on Home, tap Withdraw)', ...HOME, trigger: tapEv(btn('Withdraw')), minMs: 1500, maxMs: 3000,
  targets: [KEYS, T('pad', '[data-morph="pad"]', ['op']), T('line', '[data-morph="line"]', ['op'])] });
add({ id: 'M-099_via', name: 'Keypad first open (Home remounted: Account > About > back > Home, tap Withdraw)', ...HOME,
  setup: [clickBtn('Account'), { wait: 1500 }, clickBtn('About PeraSure'), { wait: 1200 }, { js: 'history.back(), true' }, { wait: 1500 }, clickBtn('Home'), { wait: 1500 }],
  trigger: tapEv(btn('Withdraw')), minMs: 1500, maxMs: 3000, targets: [KEYS, T('pad', '[data-morph="pad"]', ['op']), T('line', '[data-morph="line"]', ['op'])] });
add({ id: 'M-107', name: 'Amount entry -> order card morph (tap 6 Term)', ...HOME, setup: [{ tap: btn('Withdraw'), hold: 70 }, { wait: 2000 }],
  trigger: tapEv(btn('6 Term')), minMs: 1200, maxMs: 3000,
  targets: [T('card', '[data-card-surface]', ['rect', 'radius']), T('slider', '[data-confirm-card] [data-morph="slider"]', ['op', 'tf', 'rect']),
    T('divider', '[data-confirm-card] [data-morph="divider"]', ['op']), T('term', '[data-confirm-card] [data-morph="term"]', ['op']),
    T('label', '[data-confirm-card] [data-morph="label"]', ['tf', 'color']), T('grad', '[data-morph="grad"]', ['op'])] });
