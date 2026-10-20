// success-coin.js — generated from success-coin.json (Lottie) by perasure-tools/lottie2gsap.
// Inline SVG + one GSAP timeline. Needs gsap 3.13+.
// Timing is in Lottie frames: F = one frame in seconds.
import { gsap } from "gsap";

export const FPS = 60;
export const FRAMES = 127;
export const MARKERS = {}; // frame numbers
const F = 1 / FPS;
const STEP = 0.001 * F; // a stepped (hold) change happens within the last thousandth of a frame before its keyframe

// Lottie keyframe curves (cubic-bezier x1,y1,x2,y2). Solved exactly like Lottie does, so
// in-between frames land on the same sub-pixel positions (CustomEase's lookup table is ~1e-3 off).
function cubicBezier(x1, y1, x2, y2) {
  const ax = 1 - 3 * x2 + 3 * x1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
  const ay = 1 - 3 * y2 + 3 * y1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  return (p) => {
    if (p <= 0 || p >= 1) return p <= 0 ? 0 : 1;
    let t = p;
    for (let i = 0; i < 8; i++) {
      const dx = (3 * ax * t + 2 * bx) * t + cx, e = X(t) - p;
      if (Math.abs(e) < 1e-9) break;
      if (Math.abs(dx) < 1e-6) { t = NaN; break; }
      t -= e / dx;
    }
    if (!(t >= 0 && t <= 1) || Math.abs(X(t) - p) > 1e-7) { // fall back to bisection
      let lo = 0, hi = 1; t = p;
      for (let i = 0; i < 40; i++) { if (X(t) > p) hi = t; else lo = t; t = (lo + hi) / 2; }
    }
    return ((ay * t + by) * t + cy) * t;
  };
}
const hold = (p) => (p < 1 ? 0 : 1); // Lottie hold keyframe: jump at the end of the segment
// A stepped change squeezed into STEP, flipping halfway, so rounding of the tween's start
// time can never leave the old value showing on the keyframe itself.
const step = (p) => (p < 0.5 ? 0 : 1);
const ease = ["0.15,0.7,0.3,1","0.4,0,0.6,1","0.4,0,0.3,1","0.2,0.6,0.3,1","0.2,0.6,0.4,1","0.3,0,0.2,1.6","0.55,0,0.75,1","0.4678,-0.0103,0.6989,0.9919","0.409,-0.0039,0.6723,0.9981","0.3924,-0.0029,0.6616,0.9995","0.3846,-0.0025,0.6559,1.0001","0.248,0.0243,0.4305,1.0354","0.2119,0.2551,0.6711,1.0249","0.3836,0.001,0.6763,0.4382","0.3782,0.555,0.6691,0.9973","0.3931,0.0011,0.7075,0.5182","0.2445,0.3576,0.6263,1.01","0.3881,0.0012,0.7043,0.5211","0.2481,0.3685,0.623,1.0086","0.3963,-0.0066,0.746,0.5948","0.2162,0.4183,0.479,0.8957","0.2159,0.5265,0.4801,0.9139","0.2322,1.1052,0.4923,0.9905","0.5,0,0.3,1","0.4,0,0.5,1","0.4204,0.0015,0.702,0.4544","0.2264,0.3062,0.6435,1.0158","0.4025,-0.0019,0.7193,0.535","0.2462,0.3561,0.6303,1.0103","0.3688,0.001,0.669,0.4548","0.2705,0.4023,0.6305,1.0068","0.3643,0.0013,0.6639,0.4527","0.2501,0.3674,0.6163,1.0069","0.3,0,0.4,1"].map((c) => cubicBezier(...c.split(",").map(Number)));

// Densely keyframed properties (e.g. baked every frame) run as ONE tween per element. Its
// modifiers evaluate the Lottie keyframes for the current time, so the timeline holds one
// tween instead of dozens and a transform is written once per tick, not once per channel.
// Channel data: [t0, v0, e0, t1, v1, e1, …, tn, vn], times in frames, e = index into ease[],
// -1 = linear, -2 = hold.
function keyReader(k) {
  if (typeof k[1] === "string") return morphReader(k);
  let i = 0; // segment cache: playback moves forward a little each tick
  return (f) => {
    const last = k.length - 2;
    if (f <= k[0]) return k[1];
    if (f >= k[last]) return k[last + 1];
    if (f < k[i]) i = 0;
    while (f >= k[i + 3]) i += 3;
    const e = k[i + 2], a = k[i + 1];
    if (e === -2) return a;
    const p = (f - k[i]) / (k[i + 3] - k[i]);
    return a + (k[i + 4] - a) * (e === -1 ? p : ease[e](p));
  };
}
// Same for path data: every keyframe shares one command skeleton, so only the numbers move.
function morphReader(k) {
  const NUM = /-?\d*\.?\d+(?:e-?\d+)?/g;
  const parts = k[1].split(NUM), nums = [], times = [], eases = [];
  for (let j = 0; j < k.length; j += 3) { times.push(k[j]); nums.push(k[j + 1].match(NUM).map(Number)); eases.push(k[j + 2]); }
  const str = (v) => { let s = parts[0]; for (let j = 0; j < v.length; j++) s += Math.round(v[j] * 1e4) / 1e4 + parts[j + 1]; return s; };
  const out = new Array(nums[0].length);
  let i = 0;
  return (f) => {
    const last = times.length - 1;
    if (f <= times[0]) return k[1];
    if (f >= times[last]) return k[k.length - 1];
    if (f < times[i]) i = 0;
    while (f >= times[i + 1]) i++;
    if (eases[i] === -2) return k[i * 3 + 1];
    const p = (f - times[i]) / (times[i + 1] - times[i]), r = eases[i] === -1 ? p : ease[eases[i]](p);
    const a = nums[i], b = nums[i + 1];
    for (let j = 0; j < out.length; j++) out[j] = a[j] + (b[j] - a[j]) * r;
    return str(out);
  };
}
function track(parent, target, from, to, channels) {
  const vars = { duration: (to - from) * F, ease: "none", modifiers: {} };
  let tween;
  const frame = () => from + tween.time() / F;
  for (const [key, k] of Object.entries(channels)) {
    const at = keyReader(k), name = key.replace(/^attr:/, "");
    if (name !== key) { vars.attr = vars.attr || {}; vars.attr[name] = k[k.length - 1]; }
    else vars[name] = k[k.length - 1];
    vars.modifiers[name] = () => at(frame());
  }
  tween = gsap.to(target, vars);
  parent.add(tween, from * F);
}

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" width="112" height="112" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;transform:translate3d(0,0,0)"><defs><clipPath id="__P__c_root"><rect width="112" height="112" x="0" y="0"/></clipPath></defs><g clip-path="url(#__P__c_root)"><g data-n="L27v"><g data-n="L27o"><g transform="translate(56,56)"><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(120,170,226)" stroke-opacity="1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="p28" d="M0,-42 C23.1798,-42 42,-23.1798 42,0 C42,23.1798 23.1798,42 0,42 C-23.1798,42 -42,23.1798 -42,0 C-42,-23.1798 -23.1798,-42 0,-42z"/></g></g></g></g><g data-n="L26v"><g data-n="L26o"><g transform="translate(56,56)"><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(43,116,189)" stroke-opacity="1" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="p29" d="M0,-44 C24.2836,-44 44,-24.2836 44,0 C44,24.2836 24.2836,44 0,44 C-24.2836,44 -44,24.2836 -44,0 C-44,-24.2836 -24.2836,-44 0,-44z"/></g></g></g></g><g data-n="L25v"><g data-n="L25o"><g transform="translate(56,56)"><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 49) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 49) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M44.3462,-18.3688 C44.3462,-18.3688 50.8134,-21.0476 50.8134,-21.0476"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 42) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 42) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M18.3688,-44.3462 C18.3688,-44.3462 21.0476,-50.8134 21.0476,-50.8134"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 35) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 35) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M-18.3688,-44.3462 C-18.3688,-44.3462 -21.0476,-50.8134 -21.0476,-50.8134"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 28) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 28) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M-44.3462,-18.3688 C-44.3462,-18.3688 -50.8134,-21.0476 -50.8134,-21.0476"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 21) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 21) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M-44.3462,18.3688 C-44.3462,18.3688 -50.8134,21.0476 -50.8134,21.0476"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 14) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 14) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M-18.3688,44.3462 C-18.3688,44.3462 -21.0476,50.8134 -21.0476,50.8134"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 7) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 7) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M18.3688,44.3462 C18.3688,44.3462 21.0476,50.8134 21.0476,50.8134"/><path stroke="rgb(43,116,189)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t30" pathLength="1" style="--s:0;--e:0;--a:clamp(0, (min(var(--e),var(--s)) * 56 - 0) / 7, 1);--b:clamp(0, (max(var(--e),var(--s)) * 56 - 0) / 7, 1);stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M44.3462,18.3688 C44.3462,18.3688 50.8134,21.0476 50.8134,21.0476"/><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g><g transform="matrix(1,0,0,1,0,0)"></g></g></g></g></g><g data-n="L24v"><g data-n="L24o"><g data-n="L24"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.4382 C0.7938,-1.4382 1.4382,-0.7938 1.4382,0 C1.4382,0.7938 0.7938,1.4382 0,1.4382 C-0.7938,1.4382 -1.4382,0.7938 -1.4382,0 C-1.4382,-0.7938 -0.7938,-1.4382 0,-1.4382z"/></g></g></g></g></g><g data-n="L23v"><g data-n="L23o"><g data-n="L23"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.395 C0.7699,-1.395 1.395,-0.7699 1.395,0 C1.395,0.7699 0.7699,1.395 0,1.395 C-0.7699,1.395 -1.395,0.7699 -1.395,0 C-1.395,-0.7699 -0.7699,-1.395 0,-1.395z"/></g></g></g></g></g><g data-n="L22v"><g data-n="L22o"><g data-n="L22"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.1751 C0.6485,-1.1751 1.1751,-0.6485 1.1751,0 C1.1751,0.6485 0.6485,1.1751 0,1.1751 C-0.6485,1.1751 -1.1751,0.6485 -1.1751,0 C-1.1751,-0.6485 -0.6485,-1.1751 0,-1.1751z"/></g></g></g></g></g><g data-n="L21v"><g data-n="L21o"><g data-n="L21"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.1296 C0.6234,-1.1296 1.1296,-0.6234 1.1296,0 C1.1296,0.6234 0.6234,1.1296 0,1.1296 C-0.6234,1.1296 -1.1296,0.6234 -1.1296,0 C-1.1296,-0.6234 -0.6234,-1.1296 0,-1.1296z"/></g></g></g></g></g><g data-n="L20v"><g data-n="L20o"><g data-n="L20"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.3539 C0.7472,-1.3539 1.3539,-0.7472 1.3539,0 C1.3539,0.7472 0.7472,1.3539 0,1.3539 C-0.7472,1.3539 -1.3539,0.7472 -1.3539,0 C-1.3539,-0.7472 -0.7472,-1.3539 0,-1.3539z"/></g></g></g></g></g><g data-n="L19v"><g data-n="L19o"><g data-n="L19"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.4709 C0.8118,-1.4709 1.4709,-0.8118 1.4709,0 C1.4709,0.8118 0.8118,1.4709 0,1.4709 C-0.8118,1.4709 -1.4709,0.8118 -1.4709,0 C-1.4709,-0.8118 -0.8118,-1.4709 0,-1.4709z"/></g></g></g></g></g><g data-n="L18v"><g data-n="L18o"><g data-n="L18"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(120,170,226)" fill-opacity="1" d="M0,-1.5402 C0.85,-1.5402 1.5402,-0.85 1.5402,0 C1.5402,0.85 0.85,1.5402 0,1.5402 C-0.85,1.5402 -1.5402,0.85 -1.5402,0 C-1.5402,-0.85 -0.85,-1.5402 0,-1.5402z"/></g></g></g></g></g><g data-n="L17v"><g data-n="L17o"><g data-n="L17"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-5.2 C0,-2.184 2.184,0 5.2,0 C2.184,0 0,2.184 0,5.2 C0,2.184 -2.184,0 -5.2,0 C-2.184,0 0,-2.184 0,-5.2z"/></g></g></g></g></g><g data-n="L16v"><g data-n="L16o"><g data-n="L16"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-2.9 C0,-1.218 1.218,0 2.9,0 C1.218,0 0,1.218 0,2.9 C0,1.218 -1.218,0 -2.9,0 C-1.218,0 0,-1.218 0,-2.9z"/></g></g></g></g></g><g data-n="L15v"><g data-n="L15o"><g data-n="L15"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-3.8 C0,-1.596 1.596,0 3.8,0 C1.596,0 0,1.596 0,3.8 C0,1.596 -1.596,0 -3.8,0 C-1.596,0 0,-1.596 0,-3.8z"/></g></g></g></g></g><g data-n="L14v"><g data-n="L14o"><g data-n="L14"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-5.2 C0,-2.184 2.184,0 5.2,0 C2.184,0 0,2.184 0,5.2 C0,2.184 -2.184,0 -5.2,0 C-2.184,0 0,-2.184 0,-5.2z"/></g></g></g></g></g><g data-n="L13v"><g data-n="L13o"><g data-n="L13"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-2.9 C0,-1.218 1.218,0 2.9,0 C1.218,0 0,1.218 0,2.9 C0,1.218 -1.218,0 -2.9,0 C-1.218,0 0,-1.218 0,-2.9z"/></g></g></g></g></g><g data-n="L12v"><g data-n="L12o"><g data-n="L12"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-3.8 C0,-1.596 1.596,0 3.8,0 C1.596,0 0,1.596 0,3.8 C0,1.596 -1.596,0 -3.8,0 C-1.596,0 0,-1.596 0,-3.8z"/></g></g></g></g></g><g data-n="L11v"><g data-n="L11o"><g data-n="L11"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-5.2 C0,-2.184 2.184,0 5.2,0 C2.184,0 0,2.184 0,5.2 C0,2.184 -2.184,0 -5.2,0 C-2.184,0 0,-2.184 0,-5.2z"/></g></g></g></g></g><g data-n="L10v"><g data-n="L10o"><g data-n="L10"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-2.9 C0,-1.218 1.218,0 2.9,0 C1.218,0 0,1.218 0,2.9 C0,1.218 -1.218,0 -2.9,0 C-1.218,0 0,-1.218 0,-2.9z"/></g></g></g></g></g><g data-n="L9v"><g data-n="L9o"><g data-n="L9"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-3.8 C0,-1.596 1.596,0 3.8,0 C1.596,0 0,1.596 0,3.8 C0,1.596 -1.596,0 -3.8,0 C-1.596,0 0,-1.596 0,-3.8z"/></g></g></g></g></g><g data-n="L8v"><g data-n="L8o"><g data-n="L8"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-5.2 C0,-2.184 2.184,0 5.2,0 C2.184,0 0,2.184 0,5.2 C0,2.184 -2.184,0 -5.2,0 C-2.184,0 0,-2.184 0,-5.2z"/></g></g></g></g></g><g data-n="L0"><g transform="scale(0.01)"><g data-n="L7o"><g data-n="L7"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g></g></g></g></g></g><g data-n="L0"><g transform="scale(0.01)"><g data-n="L6o"><g data-n="L6"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M3.65,-39 C3.65,-39 3.65,39 3.65,39 C3.65,39 -3.65,39 -3.65,39 C-3.65,39 -3.65,-39 -3.65,-39 C-3.65,-39 3.65,-39 3.65,-39z"/></g></g></g></g></g></g><g data-n="L5v"><g data-n="L0"><g transform="scale(0.01)"><g data-n="L5o"><g data-n="L5"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g data-n="g31"><g transform="scale(0.01)"><g transform="translate(0.723,-2.258)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-23.852,3.482 C-23.852,3.482 -9.376,18.033 -9.376,18.033 C-8.654,18.759 -7.67,19.164 -6.646,19.157 C-5.622,19.15 -4.644,18.73 -3.932,17.994 C-3.932,17.994 22.405,-9.249 22.405,-9.249 C23.869,-10.763 23.828,-13.176 22.314,-14.64 C20.8,-16.104 18.386,-16.063 16.922,-14.549 C16.922,-14.549 -6.712,9.898 -6.712,9.898 C-6.712,9.898 -18.446,-1.896 -18.446,-1.896 C-19.931,-3.389 -22.345,-3.395 -23.838,-1.91 C-25.331,-0.425 -25.337,1.989 -23.852,3.482z"/></g></g></g></g></g></g></g></g></g><g data-n="L4v"><g data-n="L0"><g transform="scale(0.01)"><g data-n="L4o"><g data-n="L4"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M2.858,8.009 C2.858,8.009 -7.013,8.013 -7.013,8.013 C-7.013,8.013 -7.015,2.06 -7.015,2.06 C-7.015,2.06 2.855,2.055 2.855,2.055 C4.631,2.054 6.054,1.721 7.124,1.055 C8.194,0.389 8.97,-0.493 9.453,-1.59 C9.936,-2.687 10.177,-3.876 10.176,-5.155 C10.175,-6.487 9.934,-7.701 9.45,-8.797 C8.966,-9.907 8.189,-10.794 7.118,-11.459 C6.047,-12.137 4.618,-12.477 2.829,-12.476 C2.829,-12.476 -4.809,-12.472 -4.809,-12.472 C-4.809,-12.472 -4.794,21.603 -4.794,21.603 C-4.794,21.603 -12,21.607 -12,21.607 C-12,21.607 -12.018,-18.501 -12.018,-18.501 C-12.018,-18.501 2.827,-18.508 2.827,-18.508 C6,-18.509 8.669,-17.916 10.837,-16.729 C13.018,-15.555 14.663,-13.963 15.774,-11.953 C16.898,-9.943 17.46,-7.691 17.461,-5.197 C17.462,-2.716 16.902,-0.477 15.78,1.521 C14.671,3.506 13.034,5.086 10.867,6.262 C8.7,7.425 6.031,8.008 2.858,8.009z M21.731,-4.22 C21.731,-4.22 21.733,0.089 21.733,0.089 C21.733,0.089 -16.69,0.106 -16.69,0.106 C-16.69,0.106 -16.692,-4.203 -16.692,-4.203 C-16.692,-4.203 21.731,-4.22 21.731,-4.22z M21.728,-10.291 C21.728,-10.291 21.73,-5.982 21.73,-5.982 C21.73,-5.982 -16.693,-5.965 -16.693,-5.965 C-16.693,-5.965 -16.695,-10.274 -16.695,-10.274 C-16.695,-10.274 21.728,-10.291 21.728,-10.291z"/></g></g></g></g></g></g></g><g data-n="L3v"><g data-n="L0"><g transform="scale(0.01)"><g data-n="L3o"><g data-n="L3"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-18.481,1.298 C-17.369,1.26 -16.35,1.732 -15.609,2.567 C-15.334,2.921 -14.942,3.31 -14.496,3.683 C-9.609,7.436 -2.942,8.818 4.12,8.582 C4.121,8.59 4.122,8.597 4.123,8.605 C4.389,10.448 9.563,11.253 16.039,10.577 C5.66,15.113 -6.022,16.366 -18.837,10.363 C-19.674,9.9 -20.499,9.379 -21.337,8.693 C-22.219,8.008 -22.758,7.021 -22.794,5.908 C-22.832,4.798 -22.363,3.652 -21.534,2.765 C-20.704,1.877 -19.591,1.334 -18.481,1.298z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M6.009,-3.539 C8.311,-3.541 11.781,-3.162 11.79,-3.161 C16.063,-2.476 18.854,-0.513 18.858,3.935 C18.862,8.347 15.484,13.104 8.992,13.614 C8.992,13.614 1.744,14.314 1.744,14.314 C1.744,14.314 -0.73,22.479 -0.73,22.479 C-0.795,22.692 -0.99,22.837 -1.212,22.837 C-1.212,22.837 -6.134,22.842 -6.134,22.842 C-6.465,22.842 -6.706,22.528 -6.622,22.208 C-6.622,22.208 -3.121,8.642 -3.121,8.642 C-2.996,8.684 -2.863,8.705 -2.731,8.707 C3.138,8.768 6.691,8.456 8.895,8.001 C10.009,7.771 10.75,7.512 11.211,7.26 C11.441,7.134 11.617,7.013 11.721,6.894 C11.731,6.883 11.753,6.863 11.753,6.863 C12.605,6.129 12.874,5.054 12.873,4.478 C12.872,3.151 12.298,2.112 10.756,2.113 C10.756,2.113 4.81,1.994 4.81,1.994 C4.574,1.989 4.367,2.148 4.31,2.377 C4.31,2.377 3.594,5.281 3.594,5.281 C3.548,5.468 3.398,5.613 3.209,5.651 C2.478,5.796 1.72,5.907 1.043,5.926 C-0.105,5.959 -1.207,5.825 -2.045,5.676 C-2.16,5.656 -2.232,5.538 -2.202,5.425 C-2.202,5.425 0.021,-3.017 0.021,-3.017 C0.077,-3.23 0.265,-3.383 0.485,-3.392 C1.459,-3.433 4.151,-3.537 6.009,-3.539z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-1.804,-4.235 C-1.565,-4.512 -1.321,-4.767 -1.063,-5.017 C3.664,-9.438 10.336,-9.365 15.571,-8.025 C15.851,-7.943 16.13,-7.854 16.373,-7.759 C17.518,-7.413 18.657,-7.564 19.553,-8.322 C20.448,-9.071 21.027,-10.366 21.149,-11.778 C21.271,-13.19 20.923,-14.564 20.17,-15.456 C19.417,-16.356 18.32,-16.701 17.133,-16.556 C16.688,-16.521 16.244,-16.471 15.822,-16.41 C8.563,-15.244 1.263,-11.6 -1.428,-5.264 C-1.571,-4.921 -1.693,-4.584 -1.804,-4.235z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-4.727,0.182 C-4.769,-0.182 -4.791,-0.534 -4.801,-0.893 C-4.856,-7.367 -0.289,-12.235 4.239,-15.185 C4.489,-15.336 4.743,-15.481 4.978,-15.596 C6.007,-16.205 6.667,-17.147 6.716,-18.32 C6.77,-19.487 6.209,-20.788 5.252,-21.834 C4.295,-22.879 3.048,-23.553 1.882,-23.601 C0.71,-23.655 -0.285,-23.081 -0.982,-22.108 C-1.257,-21.756 -1.52,-21.395 -1.761,-21.043 C-5.814,-14.905 -8.072,-7.06 -5.23,-0.791 C-5.074,-0.454 -4.908,-0.136 -4.727,0.182z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-3.451,5.324 C-3.747,5.109 -4.02,4.888 -4.291,4.652 C-9.093,0.313 -9.585,-6.347 -8.693,-11.679 C-8.635,-11.965 -8.57,-12.25 -8.496,-12.501 C-8.248,-13.671 -8.494,-14.795 -9.324,-15.624 C-10.146,-16.453 -11.484,-16.921 -12.901,-16.923 C-14.318,-16.925 -15.656,-16.463 -16.481,-15.636 C-17.314,-14.809 -17.565,-13.687 -17.32,-12.516 C-17.247,-12.075 -17.16,-11.636 -17.064,-11.22 C-15.29,-4.081 -11.043,2.889 -4.507,5.037 C-4.154,5.151 -3.808,5.243 -3.451,5.324z"/></g></g></g></g></g></g></g><g data-n="L2v"><g data-n="L0"><g transform="scale(0.01)"><g data-n="L2o"><g data-n="L2"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M2.858,8.009 C2.858,8.009 -7.013,8.013 -7.013,8.013 C-7.013,8.013 -7.015,2.06 -7.015,2.06 C-7.015,2.06 2.855,2.055 2.855,2.055 C4.631,2.054 6.054,1.721 7.124,1.055 C8.194,0.389 8.97,-0.493 9.453,-1.59 C9.936,-2.687 10.177,-3.876 10.176,-5.155 C10.175,-6.487 9.934,-7.701 9.45,-8.797 C8.966,-9.907 8.189,-10.794 7.118,-11.459 C6.047,-12.137 4.618,-12.477 2.829,-12.476 C2.829,-12.476 -4.809,-12.472 -4.809,-12.472 C-4.809,-12.472 -4.794,21.603 -4.794,21.603 C-4.794,21.603 -12,21.607 -12,21.607 C-12,21.607 -12.018,-18.501 -12.018,-18.501 C-12.018,-18.501 2.827,-18.508 2.827,-18.508 C6,-18.509 8.669,-17.916 10.837,-16.729 C13.018,-15.555 14.663,-13.963 15.774,-11.953 C16.898,-9.943 17.46,-7.691 17.461,-5.197 C17.462,-2.716 16.902,-0.477 15.78,1.521 C14.671,3.506 13.034,5.086 10.867,6.262 C8.7,7.425 6.031,8.008 2.858,8.009z M21.731,-4.22 C21.731,-4.22 21.733,0.089 21.733,0.089 C21.733,0.089 -16.69,0.106 -16.69,0.106 C-16.69,0.106 -16.692,-4.203 -16.692,-4.203 C-16.692,-4.203 21.731,-4.22 21.731,-4.22z M21.728,-10.291 C21.728,-10.291 21.73,-5.982 21.73,-5.982 C21.73,-5.982 -16.693,-5.965 -16.693,-5.965 C-16.693,-5.965 -16.695,-10.274 -16.695,-10.274 C-16.695,-10.274 21.728,-10.291 21.728,-10.291z"/></g></g></g></g></g></g></g><g data-n="L1v"><g data-n="L0"><g transform="scale(0.01)"><g data-n="L1o"><g data-n="L1"><g transform="scale(0.01)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-18.481,1.298 C-17.369,1.26 -16.35,1.732 -15.609,2.567 C-15.334,2.921 -14.942,3.31 -14.496,3.683 C-9.609,7.436 -2.942,8.818 4.12,8.582 C4.121,8.59 4.122,8.597 4.123,8.605 C4.389,10.448 9.563,11.253 16.039,10.577 C5.66,15.113 -6.022,16.366 -18.837,10.363 C-19.674,9.9 -20.499,9.379 -21.337,8.693 C-22.219,8.008 -22.758,7.021 -22.794,5.908 C-22.832,4.798 -22.363,3.652 -21.534,2.765 C-20.704,1.877 -19.591,1.334 -18.481,1.298z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M6.009,-3.539 C8.311,-3.541 11.781,-3.162 11.79,-3.161 C16.063,-2.476 18.854,-0.513 18.858,3.935 C18.862,8.347 15.484,13.104 8.992,13.614 C8.992,13.614 1.744,14.314 1.744,14.314 C1.744,14.314 -0.73,22.479 -0.73,22.479 C-0.795,22.692 -0.99,22.837 -1.212,22.837 C-1.212,22.837 -6.134,22.842 -6.134,22.842 C-6.465,22.842 -6.706,22.528 -6.622,22.208 C-6.622,22.208 -3.121,8.642 -3.121,8.642 C-2.996,8.684 -2.863,8.705 -2.731,8.707 C3.138,8.768 6.691,8.456 8.895,8.001 C10.009,7.771 10.75,7.512 11.211,7.26 C11.441,7.134 11.617,7.013 11.721,6.894 C11.731,6.883 11.753,6.863 11.753,6.863 C12.605,6.129 12.874,5.054 12.873,4.478 C12.872,3.151 12.298,2.112 10.756,2.113 C10.756,2.113 4.81,1.994 4.81,1.994 C4.574,1.989 4.367,2.148 4.31,2.377 C4.31,2.377 3.594,5.281 3.594,5.281 C3.548,5.468 3.398,5.613 3.209,5.651 C2.478,5.796 1.72,5.907 1.043,5.926 C-0.105,5.959 -1.207,5.825 -2.045,5.676 C-2.16,5.656 -2.232,5.538 -2.202,5.425 C-2.202,5.425 0.021,-3.017 0.021,-3.017 C0.077,-3.23 0.265,-3.383 0.485,-3.392 C1.459,-3.433 4.151,-3.537 6.009,-3.539z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-1.804,-4.235 C-1.565,-4.512 -1.321,-4.767 -1.063,-5.017 C3.664,-9.438 10.336,-9.365 15.571,-8.025 C15.851,-7.943 16.13,-7.854 16.373,-7.759 C17.518,-7.413 18.657,-7.564 19.553,-8.322 C20.448,-9.071 21.027,-10.366 21.149,-11.778 C21.271,-13.19 20.923,-14.564 20.17,-15.456 C19.417,-16.356 18.32,-16.701 17.133,-16.556 C16.688,-16.521 16.244,-16.471 15.822,-16.41 C8.563,-15.244 1.263,-11.6 -1.428,-5.264 C-1.571,-4.921 -1.693,-4.584 -1.804,-4.235z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-4.727,0.182 C-4.769,-0.182 -4.791,-0.534 -4.801,-0.893 C-4.856,-7.367 -0.289,-12.235 4.239,-15.185 C4.489,-15.336 4.743,-15.481 4.978,-15.596 C6.007,-16.205 6.667,-17.147 6.716,-18.32 C6.77,-19.487 6.209,-20.788 5.252,-21.834 C4.295,-22.879 3.048,-23.553 1.882,-23.601 C0.71,-23.655 -0.285,-23.081 -0.982,-22.108 C-1.257,-21.756 -1.52,-21.395 -1.761,-21.043 C-5.814,-14.905 -8.072,-7.06 -5.23,-0.791 C-5.074,-0.454 -4.908,-0.136 -4.727,0.182z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-3.451,5.324 C-3.747,5.109 -4.02,4.888 -4.291,4.652 C-9.093,0.313 -9.585,-6.347 -8.693,-11.679 C-8.635,-11.965 -8.57,-12.25 -8.496,-12.501 C-8.248,-13.671 -8.494,-14.795 -9.324,-15.624 C-10.146,-16.453 -11.484,-16.921 -12.901,-16.923 C-14.318,-16.925 -15.656,-16.463 -16.481,-15.636 C-17.314,-14.809 -17.565,-13.687 -17.32,-12.516 C-17.247,-12.075 -17.16,-11.636 -17.064,-11.22 C-15.29,-4.081 -11.043,2.889 -4.507,5.037 C-4.154,5.151 -3.808,5.243 -3.451,5.324z"/></g></g></g></g></g></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createSuccessCoin(container, { autoplay = true } = {}) {
  container.insertAdjacentHTML("beforeend", MARKUP.replaceAll("__P__", "success-coin-" + ++count + "-"));
  const svg = container.lastElementChild;
  let tl;

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(svg);
    const $ = (id) => q(`[data-n="${id}"]`);
    tl = gsap.timeline({ paused: true });

    tl.to($("p28"), { attr: { d: "M0,-55 C30.3545,-55 55,-30.3545 55,0 C55,30.3545 30.3545,55 0,55 C-30.3545,55 -55,30.3545 -55,0 C-55,-30.3545 -30.3545,-55 0,-55z" }, duration: 22 * F, ease: ease[0] }, 61 * F);
    tl.to($("p28"), { attr: { "stroke-width": 0.4 }, duration: 22 * F, ease: ease[0] }, 61 * F);
    gsap.set($("L27o"), { opacity: 0.7 });
    gsap.set($("L27v"), { autoAlpha: 0 });
    tl.to($("L27v"), { autoAlpha: 1, duration: STEP, ease: step }, 61 * F - STEP); // in point
    tl.to($("L27v"), { autoAlpha: 0, duration: STEP, ease: step }, 84 * F - STEP); // out point
    tl.to($("L27o"), { opacity: 0, duration: 22 * F, ease: ease[1] }, 61 * F); // opacity
    tl.to($("p29"), { attr: { d: "M0,-55 C30.3545,-55 55,-30.3545 55,0 C55,30.3545 30.3545,55 0,55 C-30.3545,55 -55,30.3545 -55,0 C-55,-30.3545 -30.3545,-55 0,-55z" }, duration: 20 * F, ease: ease[0] }, 57 * F);
    tl.to($("p29"), { attr: { "stroke-width": 0.4 }, duration: 20 * F, ease: ease[0] }, 57 * F);
    gsap.set($("L26o"), { opacity: 0.75 });
    gsap.set($("L26v"), { autoAlpha: 0 });
    tl.to($("L26v"), { autoAlpha: 1, duration: STEP, ease: step }, 57 * F - STEP); // in point
    tl.to($("L26v"), { autoAlpha: 0, duration: STEP, ease: step }, 78 * F - STEP); // out point
    tl.to($("L26o"), { opacity: 0, duration: 20 * F, ease: ease[1] }, 57 * F); // opacity
    tl.to($("t30"), { "--s": 1, duration: 9 * F, ease: ease[2] }, 61 * F); // trim start
    tl.to($("t30"), { "--e": 1, duration: 8 * F, ease: ease[3] }, 57 * F); // trim end
    gsap.set($("L25v"), { autoAlpha: 0 });
    tl.to($("L25v"), { autoAlpha: 1, duration: STEP, ease: step }, 57 * F - STEP); // in point
    tl.to($("L25v"), { autoAlpha: 0, duration: STEP, ease: step }, 71 * F - STEP); // out point
    gsap.set($("L24"), { svgOrigin: "0 0", x: 84.997, y: 34.665, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 17"
    tl.to($("L24"), { x: 100.463, duration: 44 * F, ease: ease[0] }, 32 * F);
    tl.to($("L24"), { y: 23.286, duration: 44 * F, ease: ease[0] }, 32 * F);
    tl.to($("L24"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 32 * F);
    tl.to($("L24"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 56.2 * F);
    gsap.set($("L24o"), { opacity: 1 });
    gsap.set($("L24v"), { autoAlpha: 0 });
    tl.to($("L24v"), { autoAlpha: 1, duration: STEP, ease: step }, 69 * F - STEP); // in point
    tl.to($("L24v"), { autoAlpha: 0, duration: STEP, ease: step }, 114 * F - STEP); // out point
    tl.to($("L24o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 64 * F); // opacity
    gsap.set($("L23"), { svgOrigin: "0 0", x: 54.583, y: 20.028, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 16"
    tl.to($("L23"), { x: 53.796, duration: 44 * F, ease: ease[0] }, 31 * F);
    tl.to($("L23"), { y: 0.018, duration: 44 * F, ease: ease[0] }, 31 * F);
    tl.to($("L23"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 31 * F);
    tl.to($("L23"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 55.2 * F);
    gsap.set($("L23o"), { opacity: 1 });
    gsap.set($("L23v"), { autoAlpha: 0 });
    tl.to($("L23v"), { autoAlpha: 1, duration: STEP, ease: step }, 68 * F - STEP); // in point
    tl.to($("L23v"), { autoAlpha: 0, duration: STEP, ease: step }, 113 * F - STEP); // out point
    tl.to($("L23o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 63 * F); // opacity
    gsap.set($("L22"), { svgOrigin: "0 0", x: 20, y: 56.078, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 15"
    tl.to($("L22"), { x: 1.103, duration: 44 * F, ease: ease[0] }, 26 * F);
    tl.to($("L22"), { y: 56.118, duration: 44 * F, ease: ease[0] }, 26 * F);
    tl.to($("L22"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 26 * F);
    tl.to($("L22"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 50.2 * F);
    gsap.set($("L22o"), { opacity: 1 });
    gsap.set($("L22v"), { autoAlpha: 0 });
    tl.to($("L22v"), { autoAlpha: 1, duration: STEP, ease: step }, 63 * F - STEP); // in point
    tl.to($("L22v"), { autoAlpha: 0, duration: STEP, ease: step }, 108 * F - STEP); // out point
    tl.to($("L22o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 58 * F); // opacity
    gsap.set($("L21"), { svgOrigin: "0 0", x: 27.182, y: 77.576, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 14"
    tl.to($("L21"), { x: 12.022, duration: 44 * F, ease: ease[0] }, 31 * F);
    tl.to($("L21"), { y: 88.926, duration: 44 * F, ease: ease[0] }, 31 * F);
    tl.to($("L21"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 31 * F);
    tl.to($("L21"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 55.2 * F);
    gsap.set($("L21o"), { opacity: 1 });
    gsap.set($("L21v"), { autoAlpha: 0 });
    tl.to($("L21v"), { autoAlpha: 1, duration: STEP, ease: step }, 68 * F - STEP); // in point
    tl.to($("L21v"), { autoAlpha: 0, duration: STEP, ease: step }, 113 * F - STEP); // out point
    tl.to($("L21o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 63 * F); // opacity
    gsap.set($("L20"), { svgOrigin: "0 0", x: 72.626, y: 87.931, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 13"
    tl.to($("L20"), { x: 81.312, duration: 44 * F, ease: ease[0] }, 29 * F);
    tl.to($("L20"), { y: 104.611, duration: 44 * F, ease: ease[0] }, 29 * F);
    tl.to($("L20"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 29 * F);
    tl.to($("L20"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 53.2 * F);
    gsap.set($("L20o"), { opacity: 1 });
    gsap.set($("L20v"), { autoAlpha: 0 });
    tl.to($("L20v"), { autoAlpha: 1, duration: STEP, ease: step }, 66 * F - STEP); // in point
    tl.to($("L20v"), { autoAlpha: 0, duration: STEP, ease: step }, 111 * F - STEP); // out point
    tl.to($("L20o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 61 * F); // opacity
    gsap.set($("L19"), { svgOrigin: "0 0", x: 88.97, y: 70.457, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 12"
    tl.to($("L19"), { x: 104.958, duration: 44 * F, ease: ease[0] }, 28 * F);
    tl.to($("L19"), { y: 77.467, duration: 44 * F, ease: ease[0] }, 28 * F);
    tl.to($("L19"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 28 * F);
    tl.to($("L19"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 52.2 * F);
    gsap.set($("L19o"), { opacity: 1 });
    gsap.set($("L19v"), { autoAlpha: 0 });
    tl.to($("L19v"), { autoAlpha: 1, duration: STEP, ease: step }, 65 * F - STEP); // in point
    tl.to($("L19v"), { autoAlpha: 0, duration: STEP, ease: step }, 110 * F - STEP); // out point
    tl.to($("L19o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 60 * F); // opacity
    gsap.set($("L18"), { svgOrigin: "0 0", x: 73.569, y: 24.578, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "dot 11"
    tl.to($("L18"), { x: 83.933, duration: 44 * F, ease: ease[0] }, 24 * F);
    tl.to($("L18"), { y: 6.043, duration: 44 * F, ease: ease[0] }, 24 * F);
    tl.to($("L18"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 24 * F);
    tl.to($("L18"), { scaleX: 0, scaleY: 0, duration: 19.8 * F, ease: ease[6] }, 48.2 * F);
    gsap.set($("L18o"), { opacity: 1 });
    gsap.set($("L18v"), { autoAlpha: 0 });
    tl.to($("L18v"), { autoAlpha: 1, duration: STEP, ease: step }, 61 * F - STEP); // in point
    tl.to($("L18v"), { autoAlpha: 0, duration: STEP, ease: step }, 106 * F - STEP); // out point
    tl.to($("L18o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 56 * F); // opacity
    gsap.set($("L17"), { svgOrigin: "0 0", x: 62.197, y: 20.537, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 10"
    tl.to($("L17"), { x: 64.977, duration: 40 * F, ease: ease[0] }, 23 * F);
    tl.to($("L17"), { y: 4.628, duration: 40 * F, ease: ease[0] }, 23 * F);
    tl.to($("L17"), { rotation: -52, duration: 40 * F, ease: ease[4] }, 23 * F);
    tl.to($("L17"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 23 * F);
    tl.to($("L17"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 45 * F);
    gsap.set($("L17o"), { opacity: 1 });
    gsap.set($("L17v"), { autoAlpha: 0 });
    tl.to($("L17v"), { autoAlpha: 1, duration: STEP, ease: step }, 60 * F - STEP); // in point
    tl.to($("L17v"), { autoAlpha: 0, duration: STEP, ease: step }, 101 * F - STEP); // out point
    tl.to($("L17o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 51 * F); // opacity
    gsap.set($("L16"), { svgOrigin: "0 0", x: 33.93, y: 27.559, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 9"
    tl.to($("L16"), { x: 24.452, duration: 40 * F, ease: ease[0] }, 19 * F);
    tl.to($("L16"), { y: 15.345, duration: 40 * F, ease: ease[0] }, 19 * F);
    tl.to($("L16"), { rotation: -54, duration: 40 * F, ease: ease[4] }, 19 * F);
    tl.to($("L16"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 19 * F);
    tl.to($("L16"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 41 * F);
    gsap.set($("L16o"), { opacity: 1 });
    gsap.set($("L16v"), { autoAlpha: 0 });
    tl.to($("L16v"), { autoAlpha: 1, duration: STEP, ease: step }, 56 * F - STEP); // in point
    tl.to($("L16v"), { autoAlpha: 0, duration: STEP, ease: step }, 97 * F - STEP); // out point
    tl.to($("L16o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 47 * F); // opacity
    gsap.set($("L15"), { svgOrigin: "0 0", x: 22.637, y: 42.475, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 8"
    tl.to($("L15"), { x: 9.214, duration: 40 * F, ease: ease[0] }, 22 * F);
    tl.to($("L15"), { y: 37.033, duration: 40 * F, ease: ease[0] }, 22 * F);
    tl.to($("L15"), { rotation: 56.1, duration: 40 * F, ease: ease[4] }, 22 * F);
    tl.to($("L15"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 22 * F);
    tl.to($("L15"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 44 * F);
    gsap.set($("L15o"), { opacity: 1 });
    gsap.set($("L15v"), { autoAlpha: 0 });
    tl.to($("L15v"), { autoAlpha: 1, duration: STEP, ease: step }, 59 * F - STEP); // in point
    tl.to($("L15v"), { autoAlpha: 0, duration: STEP, ease: step }, 100 * F - STEP); // out point
    tl.to($("L15o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 50 * F); // opacity
    gsap.set($("L14"), { svgOrigin: "0 0", x: 24.047, y: 72.583, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 7"
    tl.to($("L14"), { x: 11.327, duration: 40 * F, ease: ease[0] }, 20 * F);
    tl.to($("L14"), { y: 79.185, duration: 40 * F, ease: ease[0] }, 20 * F);
    tl.to($("L14"), { rotation: 86.3, duration: 40 * F, ease: ease[4] }, 20 * F);
    tl.to($("L14"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 20 * F);
    tl.to($("L14"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 42 * F);
    gsap.set($("L14o"), { opacity: 1 });
    gsap.set($("L14v"), { autoAlpha: 0 });
    tl.to($("L14v"), { autoAlpha: 1, duration: STEP, ease: step }, 57 * F - STEP); // in point
    tl.to($("L14v"), { autoAlpha: 0, duration: STEP, ease: step }, 98 * F - STEP); // out point
    tl.to($("L14o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 48 * F); // opacity
    gsap.set($("L13"), { svgOrigin: "0 0", x: 39.408, y: 87.948, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 6"
    tl.to($("L13"), { x: 32.465, duration: 40 * F, ease: ease[0] }, 26 * F);
    tl.to($("L13"), { y: 101.316, duration: 40 * F, ease: ease[0] }, 26 * F);
    tl.to($("L13"), { rotation: -47, duration: 40 * F, ease: ease[4] }, 26 * F);
    tl.to($("L13"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 26 * F);
    tl.to($("L13"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 48 * F);
    gsap.set($("L13o"), { opacity: 1 });
    gsap.set($("L13v"), { autoAlpha: 0 });
    tl.to($("L13v"), { autoAlpha: 1, duration: STEP, ease: step }, 63 * F - STEP); // in point
    tl.to($("L13v"), { autoAlpha: 0, duration: STEP, ease: step }, 104 * F - STEP); // out point
    tl.to($("L13o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 54 * F); // opacity
    gsap.set($("L12"), { svgOrigin: "0 0", x: 56.045, y: 92, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 5"
    tl.to($("L12"), { x: 56.064, duration: 40 * F, ease: ease[0] }, 26 * F);
    tl.to($("L12"), { y: 107.111, duration: 40 * F, ease: ease[0] }, 26 * F);
    tl.to($("L12"), { rotation: 89.5, duration: 40 * F, ease: ease[4] }, 26 * F);
    tl.to($("L12"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 26 * F);
    tl.to($("L12"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 48 * F);
    gsap.set($("L12o"), { opacity: 1 });
    gsap.set($("L12v"), { autoAlpha: 0 });
    tl.to($("L12v"), { autoAlpha: 1, duration: STEP, ease: step }, 63 * F - STEP); // in point
    tl.to($("L12v"), { autoAlpha: 0, duration: STEP, ease: step }, 104 * F - STEP); // out point
    tl.to($("L12o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 54 * F); // opacity
    gsap.set($("L11"), { svgOrigin: "0 0", x: 85.096, y: 77.2, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 4"
    tl.to($("L11"), { x: 96.833, duration: 40 * F, ease: ease[0] }, 27 * F);
    tl.to($("L11"), { y: 85.752, duration: 40 * F, ease: ease[0] }, 27 * F);
    tl.to($("L11"), { rotation: -69.9, duration: 40 * F, ease: ease[4] }, 27 * F);
    tl.to($("L11"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 27 * F);
    tl.to($("L11"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 49 * F);
    gsap.set($("L11o"), { opacity: 1 });
    gsap.set($("L11v"), { autoAlpha: 0 });
    tl.to($("L11v"), { autoAlpha: 1, duration: STEP, ease: step }, 64 * F - STEP); // in point
    tl.to($("L11v"), { autoAlpha: 0, duration: STEP, ease: step }, 105 * F - STEP); // out point
    tl.to($("L11o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 55 * F); // opacity
    gsap.set($("L10"), { svgOrigin: "0 0", x: 91.75, y: 60.233, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 3"
    tl.to($("L10"), { x: 105.172, duration: 40 * F, ease: ease[0] }, 20 * F);
    tl.to($("L10"), { y: 61.823, duration: 40 * F, ease: ease[0] }, 20 * F);
    tl.to($("L10"), { rotation: -57.5, duration: 40 * F, ease: ease[4] }, 20 * F);
    tl.to($("L10"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 20 * F);
    tl.to($("L10"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 42 * F);
    gsap.set($("L10o"), { opacity: 1 });
    gsap.set($("L10v"), { autoAlpha: 0 });
    tl.to($("L10v"), { autoAlpha: 1, duration: STEP, ease: step }, 57 * F - STEP); // in point
    tl.to($("L10v"), { autoAlpha: 0, duration: STEP, ease: step }, 98 * F - STEP); // out point
    tl.to($("L10o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 48 * F); // opacity
    gsap.set($("L9"), { svgOrigin: "0 0", x: 83.088, y: 32.288, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 2"
    tl.to($("L9"), { x: 92.137, duration: 40 * F, ease: ease[0] }, 21 * F);
    tl.to($("L9"), { y: 24.367, duration: 40 * F, ease: ease[0] }, 21 * F);
    tl.to($("L9"), { rotation: 82, duration: 40 * F, ease: ease[4] }, 21 * F);
    tl.to($("L9"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 21 * F);
    tl.to($("L9"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 43 * F);
    gsap.set($("L9o"), { opacity: 1 });
    gsap.set($("L9v"), { autoAlpha: 0 });
    tl.to($("L9v"), { autoAlpha: 1, duration: STEP, ease: step }, 58 * F - STEP); // in point
    tl.to($("L9v"), { autoAlpha: 0, duration: STEP, ease: step }, 99 * F - STEP); // out point
    tl.to($("L9o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 49 * F); // opacity
    gsap.set($("L8"), { svgOrigin: "0 0", x: 64.71, y: 21.07, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "star 1"
    tl.to($("L8"), { x: 68.552, duration: 40 * F, ease: ease[0] }, 25 * F);
    tl.to($("L8"), { y: 5.663, duration: 40 * F, ease: ease[0] }, 25 * F);
    tl.to($("L8"), { rotation: 55.1, duration: 40 * F, ease: ease[4] }, 25 * F);
    tl.to($("L8"), { scaleX: 100, scaleY: 100, duration: 9 * F, ease: ease[5] }, 25 * F);
    tl.to($("L8"), { scaleX: 0, scaleY: 0, duration: 18 * F, ease: ease[6] }, 47 * F);
    gsap.set($("L8o"), { opacity: 1 });
    gsap.set($("L8v"), { autoAlpha: 0 });
    tl.to($("L8v"), { autoAlpha: 1, duration: STEP, ease: step }, 62 * F - STEP); // in point
    tl.to($("L8v"), { autoAlpha: 0, duration: STEP, ease: step }, 103 * F - STEP); // out point
    tl.to($("L8o"), { opacity: 0, duration: 12 * F, ease: ease[1] }, 53 * F); // opacity
    gsap.set($("L7"), { svgOrigin: "0 0", x: 3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 100 }); // layer "coin back rim"
    track(tl, $("L7"), 0, 55, { x: [0,3.65,7,16.803,-3.65,-2,16.813,3.65,8,28.35,-3.65,-2,28.36,3.65,9,37.729,-3.65,-2,37.739,3.65,10,45.837,-3.65,-2,45.847,3.65,11,55,0], scaleX: [0,0,12,9.525,100,13,16.813,0,14,22.956,100,15,28.36,0,16,33.247,100,17,37.739,0,18,41.919,100,19,45.847,0,20,50.423,95.604,21,52.712,99.8411,22,55,100], scaleY: [0,100,12,9.525,100,13,16.813,100,14,22.956,100,15,28.36,100,16,33.247,100,17,37.739,100,18,41.919,100,19,45.847,100,20,50.423,100,21,52.712,100,22,55,100] }); // layer "coin back rim"
    gsap.set($("L0"), { svgOrigin: "0 0", x: 56, y: 56, rotation: 0, scaleX: 100, scaleY: 100 }); // layer "coin"
    tl.to($("L0"), { scaleX: 108, scaleY: 108, duration: 45.8467 * F, ease: ease[1] }, 0);
    tl.to($("L0"), { scaleX: 95, scaleY: 95, duration: 5.1533 * F, ease: ease[1] }, 45.8467 * F);
    tl.to($("L0"), { scaleX: 120, scaleY: 120, duration: 7 * F, ease: ease[23] }, 51 * F);
    tl.to($("L0"), { scaleX: 94, scaleY: 94, duration: 7 * F, ease: ease[24] }, 58 * F);
    tl.to($("L0"), { scaleX: 103, scaleY: 103, duration: 7 * F, ease: ease[24] }, 65 * F);
    tl.to($("L0"), { scaleX: 100, scaleY: 100, duration: 8 * F, ease: ease[24] }, 72 * F);
    gsap.set($("L6"), { svgOrigin: "0 0", x: 0, y: 0, rotation: 0, scaleX: 100, scaleY: 100 }); // layer "coin edge"
    track(tl, $("L6"), 0, 55, { scaleX: [0,100,25,9.525,0.0309,26,16.813,100,27,22.956,0.0778,28,28.36,100,29,33.247,0.0005,30,37.739,100,31,41.919,0.0636,32,45.847,100,11,55,0], scaleY: [0,100,25,9.525,100,26,16.813,100,27,22.956,100,28,28.36,100,29,33.247,100,30,37.739,100,31,41.919,100,32,45.847,100,11,55,100] }); // layer "coin edge"
    gsap.set($("g31"), { svgOrigin: "0 0", x: -0.723, y: 2.258, rotation: 0, scaleX: 100, scaleY: 100 }); // group "check 0"
    tl.to($("g31"), { rotation: -8, duration: 8 * F, ease: ease[33] }, 54 * F);
    tl.to($("g31"), { rotation: 0, duration: 9 * F, ease: ease[24] }, 62 * F);
    tl.to($("g31"), { scaleX: 126, scaleY: 126, duration: 8 * F, ease: ease[33] }, 54 * F);
    tl.to($("g31"), { scaleX: 92, scaleY: 92, duration: 7 * F, ease: ease[24] }, 62 * F);
    tl.to($("g31"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[24] }, 69 * F);
    gsap.set($("L5"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 100 }); // layer "face check"
    track(tl, $("L5"), 0, 55, { x: [0,-3.65,7,16.803,3.65,-2,16.813,-3.65,8,28.35,3.65,-2,28.36,-3.65,9,37.729,3.65,-2,37.739,-3.65,10,45.837,3.65,-2,45.847,-3.65,11,55,0], scaleX: [0,0,12,9.525,100,13,16.813,0,14,22.956,100,15,28.36,0,16,33.247,100,17,37.739,0,18,41.919,100,19,45.847,0,20,50.423,95.604,21,52.712,99.8411,22,55,100], scaleY: [0,100,12,9.525,100,13,16.813,100,14,22.956,100,15,28.36,100,16,33.247,100,17,37.739,100,18,41.919,100,19,45.847,100,20,50.423,100,21,52.712,100,22,55,100] }); // layer "face check"
    gsap.set($("L5v"), { autoAlpha: 0 });
    tl.to($("L5v"), { autoAlpha: 1, duration: STEP, ease: step }, 45.847 * F - STEP); // in point
    gsap.set($("L4"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 100 }); // layer "face B 2"
    tl.to($("L4"), { x: 3.65, duration: 8.108 * F, ease: ease[10] }, 37.739 * F);
    tl.to($("L4"), { scaleX: 100, scaleY: 100, duration: 4.18 * F, ease: ease[18] }, 37.739 * F);
    tl.to($("L4"), { scaleX: 0, scaleY: 100, duration: 3.928 * F, ease: ease[19] }, 41.919 * F);
    gsap.set($("L4v"), { autoAlpha: 0 });
    tl.to($("L4v"), { autoAlpha: 1, duration: STEP, ease: step }, 37.739 * F - STEP); // in point
    tl.to($("L4v"), { autoAlpha: 0, duration: STEP, ease: step }, 45.847 * F - STEP); // out point
    gsap.set($("L3"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 100 }); // layer "face A 2"
    tl.to($("L3"), { x: 3.65, duration: 9.379 * F, ease: ease[9] }, 28.36 * F);
    tl.to($("L3"), { scaleX: 100, scaleY: 100, duration: 4.887 * F, ease: ease[16] }, 28.36 * F);
    tl.to($("L3"), { scaleX: 0, scaleY: 100, duration: 4.492 * F, ease: ease[17] }, 33.247 * F);
    gsap.set($("L3v"), { autoAlpha: 0 });
    tl.to($("L3v"), { autoAlpha: 1, duration: STEP, ease: step }, 28.36 * F - STEP); // in point
    tl.to($("L3v"), { autoAlpha: 0, duration: STEP, ease: step }, 37.739 * F - STEP); // out point
    gsap.set($("L2"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 100 }); // layer "face B 1"
    tl.to($("L2"), { x: 3.65, duration: 11.547 * F, ease: ease[8] }, 16.813 * F);
    tl.to($("L2"), { scaleX: 100, scaleY: 100, duration: 6.143 * F, ease: ease[14] }, 16.813 * F);
    tl.to($("L2"), { scaleX: 0, scaleY: 100, duration: 5.404 * F, ease: ease[15] }, 22.956 * F);
    gsap.set($("L2v"), { autoAlpha: 0 });
    tl.to($("L2v"), { autoAlpha: 1, duration: STEP, ease: step }, 16.813 * F - STEP); // in point
    tl.to($("L2v"), { autoAlpha: 0, duration: STEP, ease: step }, 28.36 * F - STEP); // out point
    gsap.set($("L1"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 100 }); // layer "face A 1"
    tl.to($("L1"), { x: 3.65, duration: 16.813 * F, ease: ease[7] }, 0);
    tl.to($("L1"), { scaleX: 100, scaleY: 100, duration: 9.525 * F, ease: ease[12] }, 0);
    tl.to($("L1"), { scaleX: 0, scaleY: 100, duration: 7.288 * F, ease: ease[13] }, 9.525 * F);
    gsap.set($("L1v"), { autoAlpha: 1 });
    tl.to($("L1v"), { autoAlpha: 0, duration: STEP, ease: step }, 16.813 * F - STEP); // out point


    tl.set({}, {}, FRAMES * F); // timeline length = Lottie out point
    tl.progress(1).progress(0); // initialise every tween now, so the first loop has no set-up hitches
  }, svg);

  const player = gsap.timeline({ paused: true });
  // Only tick while the animation is wanted AND on screen: off-screen instances cost nothing.
  let wanted = false, onScreen = true;
  const sync = () => (wanted && onScreen ? player.play() : player.pause());
  const io = typeof IntersectionObserver === "function" &&
    new IntersectionObserver((entries) => { onScreen = entries[entries.length - 1].isIntersecting; sync(); });
  if (io) io.observe(svg);
  const api = {
    svg,
    timeline: tl, // the raw animation: seek/scrub it with tl.seek(frame * F)
    player, // the playback sequence built below
    play() { wanted = true; sync(); },
    pause() { wanted = false; player.pause(); },
    seekFrame(frame) { api.pause(); tl.seek(frame * F); },
    destroy() { if (io) io.disconnect(); mm.revert(); player.kill(); ctx.revert(); svg.remove(); },
  };
  player.add(tl.tweenFromTo(0, tl.duration()));

  // Respect prefers-reduced-motion: show a still frame instead of playing
  const mm = gsap.matchMedia();
  mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (c) => {
    if (c.conditions.reduce) api.seekFrame(127);
    else if (autoplay) api.play();
  });
  return api;
}
