// loading-coin.js — generated from loading-coin.json (Lottie) by perasure-tools/lottie2gsap.
// Inline SVG + one GSAP timeline. Needs gsap 3.13+.
// Timing is in Lottie frames: F = one frame in seconds.
import { gsap } from "gsap";

export const FPS = 60;
export const FRAMES = 102;
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
const ease = ["0.2901,-0.0158,0.6536,0.9443","0.4977,-0.0056,0.7418,0.9922","0.2645,0.3812,0.5802,0.8033","0.2393,0.4196,0.5505,0.8224","0.235,0.4196,0.5449,0.8234","0.1278,0.356,0.3,1.0751","0.4829,0.0022,0.6858,-0.0466"].map((c) => cubicBezier(...c.split(",").map(Number)));

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

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 112" width="112" height="112" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;transform:translate3d(0,0,0)"><defs><clipPath id="__P__c_root"><rect width="112" height="112" x="0" y="0"/></clipPath></defs><g clip-path="url(#__P__c_root)"><g transform="translate(56,56)"><g data-n="L4o"><g data-n="L4"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g></g></g></g><g transform="translate(56,56)"><g data-n="L3o"><g data-n="L3"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M3.65,-39 C3.65,-39 3.65,39 3.65,39 C3.65,39 -3.65,39 -3.65,39 C-3.65,39 -3.65,-39 -3.65,-39 C-3.65,-39 3.65,-39 3.65,-39z"/></g></g></g></g><g data-n="L2v"><g transform="translate(56,56)"><g data-n="L2o"><g data-n="L2"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M2.858,8.009 C2.858,8.009 -7.013,8.013 -7.013,8.013 C-7.013,8.013 -7.015,2.06 -7.015,2.06 C-7.015,2.06 2.855,2.055 2.855,2.055 C4.631,2.054 6.054,1.721 7.124,1.055 C8.194,0.389 8.97,-0.493 9.453,-1.59 C9.936,-2.687 10.177,-3.876 10.176,-5.155 C10.175,-6.487 9.934,-7.701 9.45,-8.797 C8.966,-9.907 8.189,-10.794 7.118,-11.459 C6.047,-12.137 4.618,-12.477 2.829,-12.476 C2.829,-12.476 -4.809,-12.472 -4.809,-12.472 C-4.809,-12.472 -4.794,21.603 -4.794,21.603 C-4.794,21.603 -12,21.607 -12,21.607 C-12,21.607 -12.018,-18.501 -12.018,-18.501 C-12.018,-18.501 2.827,-18.508 2.827,-18.508 C6,-18.509 8.669,-17.916 10.837,-16.729 C13.018,-15.555 14.663,-13.963 15.774,-11.953 C16.898,-9.943 17.46,-7.691 17.461,-5.197 C17.462,-2.716 16.902,-0.477 15.78,1.521 C14.671,3.506 13.034,5.086 10.867,6.262 C8.7,7.425 6.031,8.008 2.858,8.009z M21.731,-4.22 C21.731,-4.22 21.733,0.089 21.733,0.089 C21.733,0.089 -16.69,0.106 -16.69,0.106 C-16.69,0.106 -16.692,-4.203 -16.692,-4.203 C-16.692,-4.203 21.731,-4.22 21.731,-4.22z M21.728,-10.291 C21.728,-10.291 21.73,-5.982 21.73,-5.982 C21.73,-5.982 -16.693,-5.965 -16.693,-5.965 C-16.693,-5.965 -16.695,-10.274 -16.695,-10.274 C-16.695,-10.274 21.728,-10.291 21.728,-10.291z"/></g></g></g></g></g><g data-n="L1v"><g transform="translate(56,56)"><g data-n="L1o"><g data-n="L1"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M0,-39 C21.5241,-39 39,-21.5241 39,0 C39,21.5241 21.5241,39 0,39 C-21.5241,39 -39,21.5241 -39,0 C-39,-21.5241 -21.5241,-39 0,-39z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(246,249,248)" fill-opacity="1" d="M0,-34.85 C19.2337,-34.85 34.85,-19.2337 34.85,0 C34.85,19.2337 19.2337,34.85 0,34.85 C-19.2337,34.85 -34.85,19.2337 -34.85,0 C-34.85,-19.2337 -19.2337,-34.85 0,-34.85z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-18.481,1.298 C-17.369,1.26 -16.35,1.732 -15.609,2.567 C-15.334,2.921 -14.942,3.31 -14.496,3.683 C-9.609,7.436 -2.942,8.818 4.12,8.582 C4.121,8.59 4.122,8.597 4.123,8.605 C4.389,10.448 9.563,11.253 16.039,10.577 C5.66,15.113 -6.022,16.366 -18.837,10.363 C-19.674,9.9 -20.499,9.379 -21.337,8.693 C-22.219,8.008 -22.758,7.021 -22.794,5.908 C-22.832,4.798 -22.363,3.652 -21.534,2.765 C-20.704,1.877 -19.591,1.334 -18.481,1.298z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M6.009,-3.539 C8.311,-3.541 11.781,-3.162 11.79,-3.161 C16.063,-2.476 18.854,-0.513 18.858,3.935 C18.862,8.347 15.484,13.104 8.992,13.614 C8.992,13.614 1.744,14.314 1.744,14.314 C1.744,14.314 -0.73,22.479 -0.73,22.479 C-0.795,22.692 -0.99,22.837 -1.212,22.837 C-1.212,22.837 -6.134,22.842 -6.134,22.842 C-6.465,22.842 -6.706,22.528 -6.622,22.208 C-6.622,22.208 -3.121,8.642 -3.121,8.642 C-2.996,8.684 -2.863,8.705 -2.731,8.707 C3.138,8.768 6.691,8.456 8.895,8.001 C10.009,7.771 10.75,7.512 11.211,7.26 C11.441,7.134 11.617,7.013 11.721,6.894 C11.731,6.883 11.753,6.863 11.753,6.863 C12.605,6.129 12.874,5.054 12.873,4.478 C12.872,3.151 12.298,2.112 10.756,2.113 C10.756,2.113 4.81,1.994 4.81,1.994 C4.574,1.989 4.367,2.148 4.31,2.377 C4.31,2.377 3.594,5.281 3.594,5.281 C3.548,5.468 3.398,5.613 3.209,5.651 C2.478,5.796 1.72,5.907 1.043,5.926 C-0.105,5.959 -1.207,5.825 -2.045,5.676 C-2.16,5.656 -2.232,5.538 -2.202,5.425 C-2.202,5.425 0.021,-3.017 0.021,-3.017 C0.077,-3.23 0.265,-3.383 0.485,-3.392 C1.459,-3.433 4.151,-3.537 6.009,-3.539z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-1.804,-4.235 C-1.565,-4.512 -1.321,-4.767 -1.063,-5.017 C3.664,-9.438 10.336,-9.365 15.571,-8.025 C15.851,-7.943 16.13,-7.854 16.373,-7.759 C17.518,-7.413 18.657,-7.564 19.553,-8.322 C20.448,-9.071 21.027,-10.366 21.149,-11.778 C21.271,-13.19 20.923,-14.564 20.17,-15.456 C19.417,-16.356 18.32,-16.701 17.133,-16.556 C16.688,-16.521 16.244,-16.471 15.822,-16.41 C8.563,-15.244 1.263,-11.6 -1.428,-5.264 C-1.571,-4.921 -1.693,-4.584 -1.804,-4.235z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-4.727,0.182 C-4.769,-0.182 -4.791,-0.534 -4.801,-0.893 C-4.856,-7.367 -0.289,-12.235 4.239,-15.185 C4.489,-15.336 4.743,-15.481 4.978,-15.596 C6.007,-16.205 6.667,-17.147 6.716,-18.32 C6.77,-19.487 6.209,-20.788 5.252,-21.834 C4.295,-22.879 3.048,-23.553 1.882,-23.601 C0.71,-23.655 -0.285,-23.081 -0.982,-22.108 C-1.257,-21.756 -1.52,-21.395 -1.761,-21.043 C-5.814,-14.905 -8.072,-7.06 -5.23,-0.791 C-5.074,-0.454 -4.908,-0.136 -4.727,0.182z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(43,116,189)" fill-opacity="1" d="M-3.451,5.324 C-3.747,5.109 -4.02,4.888 -4.291,4.652 C-9.093,0.313 -9.585,-6.347 -8.693,-11.679 C-8.635,-11.965 -8.57,-12.25 -8.496,-12.501 C-8.248,-13.671 -8.494,-14.795 -9.324,-15.624 C-10.146,-16.453 -11.484,-16.921 -12.901,-16.923 C-14.318,-16.925 -15.656,-16.463 -16.481,-15.636 C-17.314,-14.809 -17.565,-13.687 -17.32,-12.516 C-17.247,-12.075 -17.16,-11.636 -17.064,-11.22 C-15.29,-4.081 -11.043,2.889 -4.507,5.037 C-4.154,5.151 -3.808,5.243 -3.451,5.324z"/></g></g></g></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createLoadingCoin(container, { autoplay = true } = {}) {
  container.insertAdjacentHTML("beforeend", MARKUP.replaceAll("__P__", "loading-coin-" + ++count + "-"));
  const svg = container.lastElementChild;
  let tl;

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(svg);
    const $ = (id) => q(`[data-n="${id}"]`);
    tl = gsap.timeline({ paused: true });

    gsap.set($("L4"), { svgOrigin: "0 0", x: 3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 1 }); // layer "coin back rim"
    track(tl, $("L4"), 0, 102, { x: [0,3.65,0,27,0,1,50.99,-3.65,-2,51,3.65,0,78,0,1,102,-3.65], scaleX: [0,0,2,13.5,0.868727,3,20.25,0.985427,4,23.625,0.998411,5,27,1,6,51,0,2,64.5,0.868727,3,71.25,0.985427,4,74.625,0.998411,5,78,1,6,102,0], scaleY: [0,1,2,13.5,1,3,20.25,1,4,23.625,1,5,27,1,6,51,1,2,64.5,1,3,71.25,1,4,74.625,1,5,78,1,6,102,1] }); // layer "coin back rim"
    gsap.set($("L3"), { svgOrigin: "0 0", x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }); // layer "coin edge"
    tl.to($("L3"), { scaleX: 0, scaleY: 1, duration: 27 * F, ease: ease[0] }, 0);
    tl.to($("L3"), { scaleX: 1, scaleY: 1, duration: 24 * F, ease: ease[1] }, 27 * F);
    tl.to($("L3"), { scaleX: 0, scaleY: 1, duration: 27 * F, ease: ease[0] }, 51 * F);
    tl.to($("L3"), { scaleX: 1, scaleY: 1, duration: 24 * F, ease: ease[1] }, 78 * F);
    gsap.set($("L2"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 1 }); // layer "face B"
    tl.to($("L2"), { x: 0, duration: 27 * F, ease: ease[0] }, 51 * F);
    tl.to($("L2"), { x: 3.65, duration: 24 * F, ease: ease[1] }, 78 * F);
    tl.to($("L2"), { scaleX: 0.868727, scaleY: 1, duration: 13.5 * F, ease: ease[2] }, 51 * F);
    tl.to($("L2"), { scaleX: 0.985427, scaleY: 1, duration: 6.75 * F, ease: ease[3] }, 64.5 * F);
    tl.to($("L2"), { scaleX: 0.998411, scaleY: 1, duration: 3.375 * F, ease: ease[4] }, 71.25 * F);
    tl.to($("L2"), { scaleX: 1, scaleY: 1, duration: 3.375 * F, ease: ease[5] }, 74.625 * F);
    tl.to($("L2"), { scaleX: 0, scaleY: 1, duration: 24 * F, ease: ease[6] }, 78 * F);
    gsap.set($("L2v"), { autoAlpha: 0 });
    tl.to($("L2v"), { autoAlpha: 1, duration: STEP, ease: step }, 51 * F - STEP); // in point
    gsap.set($("L1"), { svgOrigin: "0 0", x: -3.65, y: 0, rotation: 0, scaleX: 0, scaleY: 1 }); // layer "face A"
    tl.to($("L1"), { x: 0, duration: 27 * F, ease: ease[0] }, 0);
    tl.to($("L1"), { x: 3.65, duration: 24 * F, ease: ease[1] }, 27 * F);
    tl.to($("L1"), { scaleX: 0.868727, scaleY: 1, duration: 13.5 * F, ease: ease[2] }, 0);
    tl.to($("L1"), { scaleX: 0.985427, scaleY: 1, duration: 6.75 * F, ease: ease[3] }, 13.5 * F);
    tl.to($("L1"), { scaleX: 0.998411, scaleY: 1, duration: 3.375 * F, ease: ease[4] }, 20.25 * F);
    tl.to($("L1"), { scaleX: 1, scaleY: 1, duration: 3.375 * F, ease: ease[5] }, 23.625 * F);
    tl.to($("L1"), { scaleX: 0, scaleY: 1, duration: 24 * F, ease: ease[6] }, 27 * F);
    gsap.set($("L1v"), { autoAlpha: 1 });
    tl.to($("L1v"), { autoAlpha: 0, duration: STEP, ease: step }, 51 * F - STEP); // out point


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
  player.add(tl.tweenFromTo(0, tl.duration(), { repeat: -1 }));

  // Respect prefers-reduced-motion: show a still frame instead of playing
  const mm = gsap.matchMedia();
  mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (c) => {
    if (c.conditions.reduce) api.seekFrame(0);
    else if (autoplay) api.play();
  });
  return api;
}
