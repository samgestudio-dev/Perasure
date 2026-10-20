// safe-transaction.js — generated from safe-transaction.json (Lottie) by perasure-tools/lottie2gsap.
// Inline SVG + one GSAP timeline. Needs gsap 3.13+.
// Timing is in Lottie frames: F = one frame in seconds.
import { gsap } from "gsap";

export const FPS = 29.97;
export const FRAMES = 114;
export const MARKERS = {"intro":0,"loop":54}; // frame numbers
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
const ease = ["0.37,0,0.63,1","0.22,1,0.36,1"].map((c) => cubicBezier(...c.split(",").map(Number)));

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

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;transform:translate3d(0,0,0)"><defs><clipPath id="__P__c_root"><rect width="1000" height="1000" x="0" y="0"/></clipPath><clipPath id="__P__m18"><path fill="#ffffff" clip-rule="nonzero" d=" M15,84.5001 C15,84.5001 6.5,83.6487 6.5,76.0001 C6.5,67.5001 15,69.5001 15,69.5001 C15,69.5001 15,62.0001 23.5,61.5001 C33.0513,60.9383 43.5,69.5001 43.5,69.5001 C43.5,69.5001 46.8672,61.5563 57,61.5001 C66.2825,61.4486 87,64.7175 87,74.0001 C87,84.0001 80,83.5001 80,83.5001 C80,83.5001 79.5,88.0001 72.5,90.5622 C65.5,93.1242 60,89.5001 60,89.5001 C60,89.5001 54.7061,92.0001 50.5,92.0001 C46.2939,92.0001 40,89.5001 40,89.5001 C40,89.5001 31.3362,93.8648 25.5,91.5001 C20.9325,89.6495 15,84.5001 15,84.5001"/><path fill="#ffffff" clip-rule="nonzero" d=" M0,0 C0,0 100,0 100,0 C100,0 100,84.5 100,84.5 C100,84.5 0,84.5 0,84.5 C0,84.5 0,0 0,0"/></clipPath><clipPath id="__P__m19"><path fill="#ffffff" clip-rule="nonzero" d=" M46.5,16 C48.9356,13.4585 50.501,11.3852 54,11 C56.17,10.7611 57.4131,11.3591 59.5,12 C62.4217,12.8972 63.9335,13.8405 66.5,15.5 C69.7547,17.6045 72.5,19.5001 74,22 C74.4142,22.6904 74.3676,23.2059 74.5,24 C75,27.0001 73.2061,30.5916 71.5,34.5 C69.2468,39.6619 67.6649,42.7085 63.5,46.5 C61.217,48.5784 57,51 57,51 C57,51 58.3189,54.0103 59,56 C60.4267,60.1679 61.5,67 61.5,67 C61.5,67 66.5,62.5001 71.5,59.5 C71.8349,59.2991 72.2004,59.2495 72.5,59.5 C73.2478,60.1255 78.1714,65.6638 78.5,67 C78.6043,67.424 77.9898,67.9901 77.5,68.5001 C72.3803,73.8312 71.1415,75.0347 65.5,79.5 C63.2394,81.2893 61.871,82.7372 59,83 C57.4323,83.1435 55,82.5 55,82.5 C55.2672,86.5105 55.392,88.7014 55.5,92.5 C55.5,92.5 25,93.5 25,93.5 C25,93.5 22,89.0001 22,89.0001 C22,89.0001 23.1308,76.8231 24,69 C24.5,64.5001 25.2832,55.3429 30.5,49 C33.7746,45.0186 37,43.5001 40.5,41.0001 C40.8553,40.7463 41.5,40.4367 41.5,40.0001 C41.5,39.0001 40.7856,38.2015 40.5,37 C39.5958,33.1959 40.0884,30.8024 41,27 C42.1197,22.3296 43.1769,19.4676 46.5,16"/></clipPath><clipPath id="__P__m20"><path d="M68.5,30.0C68.3952,31.1831 68.2553,31.84 68.0,33.0C67.823,33.8043 67.6391,34.207 67.5,35.0C67.3582,35.8083 67.5583,36.8093 67.7443,37.7399C68.0009,39.0236 68.2308,40.1735 67.5,40.5C66.9652,40.739 65.5,40.5 65.5,40.5C65.5,40.5 64.0,43.5 63.0,44.5C62.3261,45.1739 61.1131,46.0008 60.0,46.0C58.0769,45.9987 56.5337,44.6602 55.0,43.5C54.0907,42.8121 53.1298,41.5915 52.5474,40.789C53.6443,36.0576 55.6413,33.5916 58.9994,30.0C60.6683,28.2151 62.0627,26.8077 63.6361,25.6614L68.5,26.5C68.5,26.5 68.6206,28.6385 68.5,30.0Z"/></clipPath><clipPath id="__P__m22"><path d="M64.0,31.5C65.2316,31.9167 66.9005,32.3583 68.0759,32.6536C68.0518,32.7644 68.0265,32.8795 68.0,33.0C67.823,33.8043 67.6391,34.207 67.5,35.0C67.3593,35.802 67.5552,36.7937 67.74,37.7182C67.4938,37.6342 67.2261,37.551 67.0,37.5C66.268,37.3347 65.6942,37.3971 65.1007,37.4617C64.6133,37.5147 64.1125,37.5691 63.5,37.5C61.9,37.3194 60.9919,37.1057 59.5,36.5C58.1956,35.9705 56.759,34.9104 55.6186,33.9521C56.5508,32.6708 57.6681,31.4238 58.9994,30.0C59.1202,29.8708 59.2397,29.7435 59.3578,29.6182C60.6244,30.1831 62.5337,31.0038 64.0,31.5Z"/></clipPath><clipPath id="__P__m23"><path fill="#ffffff" clip-rule="nonzero" d=" M74.0277,22.0508 C74.4105,22.7164 74.3712,23.2251 74.5004,24 C75.0003,27 73.2064,30.5916 71.5004,34.5 C69.2472,39.6618 67.665,42.7086 63.5004,46.5 C61.2351,48.5622 57.0651,50.9618 57.0004,50.999 C57.0004,50.999 56.9994,51 56.9994,51 C56.1392,52.9709 55.8007,54.0698 55.4994,56 C55.4796,55.9703 53.1857,52.5165 52.4994,50 C51.5746,46.6092 51.7342,44.4303 52.4994,41 C53.5857,36.1301 55.5917,33.6446 58.9994,30 C62.255,26.5181 64.4659,24.4728 68.9994,23 C70.605,22.4784 73.017,22.1658 74.0277,22.0508"/></clipPath><clipPath id="__P__m24"><path fill="#ffffff" clip-rule="nonzero" d=" M84.5,40 C84.5,40 81.5,51 81.5,51 C81.5,51 81.5,51.5 81.5,51.5 C81.5,51.5 88.6865,50 88.6865,50 C88.6865,50 91.5,39.5 91.5,39.5 C92,38 92,38 90.5,38 C90.5,38 86,38 86,38 C85,38 84.8787,38.424 84.5,40"/></clipPath><clipPath id="__P__m26"><path d="M84.5,40.0C84.8787,38.424 85.0,38.0 86.0,38.0L87.5,38.0C86.5,38.0 86.3787,38.424 86.0,40.0L83.0,51.0L83.0,51.1869L81.5,51.5L81.5,51.0Z"/></clipPath></defs><g clip-path="url(#__P__c_root)"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L13o"><g transform="translate(0,0)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(180,217,255)" fill-opacity="1" d="M15,84.5001 C15,84.5001 6.5,83.6487 6.5,76.0001 C6.5,67.5001 15,69.5001 15,69.5001 C15,69.5001 15,62.0001 23.5,61.5001 C33.0513,60.9383 43.5,69.5001 43.5,69.5001 C43.5,69.5001 46.8672,61.5563 57,61.5001 C66.2825,61.4486 87,64.7175 87,74.0001 C87,84.0001 80,83.5001 80,83.5001 C80,83.5001 79.5,88.0001 72.5,90.5622 C65.5,93.1242 60,89.5001 60,89.5001 C60,89.5001 54.7061,92.0001 50.5,92.0001 C46.2939,92.0001 40,89.5001 40,89.5001 C40,89.5001 31.3362,93.8648 25.5,91.5001 C20.9325,89.6495 15,84.5001 15,84.5001z"/></g></g></g></g></g></g></g><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L12o"><g transform="translate(0,0)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(203,115,68)" fill-opacity="1" d="M74.5,58 C74.5,58 72.5,60 72.5,60 C72.5,60 77,66 77,66 C77,66 78.1454,64.6998 79,64 C81.1632,62.2289 82.315,62.7441 84.5,61 C85.2748,60.3816 89.1855,58.5517 89.5,56.5 C89.5888,55.921 89,55 89,55 C89,55 89.5,54.3732 89.5,54 C89.5,53.1949 89,53 89,53 C89,53 89.5,52.5 89.5,51.5 C89.5,50.6949 89,50.5 89,50.5 C89,50.5 89.2916,50.0115 89.5,49.5 C89.754,48.8765 89.3837,48 88.5,48 C87.3123,48 86,48.5 85,49 C83.3524,49.8238 81.5,51 81.5,51 C81.5,51 82,49 82,49 C82,49 81.0634,49.2475 80.5,49.5 C78.4841,50.4037 77.7272,51.6631 76.5,53.5 C75.4317,55.0991 74.5,58 74.5,58z"/></g></g></g></g></g></g></g></g></g></g><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L11o"><g transform="translate(0,0)"><g clip-path="url(#__P__m18)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(0,107,154)" fill-opacity="1" d="M46.5,16 C48.9356,13.4585 50.501,11.3852 54,11 C56.17,10.7611 57.4131,11.3591 59.5,12 C62.4217,12.8972 63.9335,13.8405 66.5,15.5 C69.7547,17.6045 72.5,19.5001 74,22 C74.4142,22.6904 74.3676,23.2059 74.5,24 C75,27.0001 73.2061,30.5916 71.5,34.5 C69.2468,39.6619 67.6649,42.7085 63.5,46.5 C61.217,48.5784 57,51 57,51 C57,51 58.3189,54.0103 59,56 C60.4267,60.1679 61.5,67 61.5,67 C61.5,67 66.5,62.5001 71.5,59.5 C71.8349,59.2991 72.2004,59.2495 72.5,59.5 C73.2478,60.1255 78.1714,65.6638 78.5,67 C78.6043,67.424 77.9898,67.9901 77.5,68.5001 C72.3803,73.8312 71.1415,75.0347 65.5,79.5 C63.2394,81.2893 61.871,82.7372 59,83 C57.4323,83.1435 55,82.5 55,82.5 C55.2672,86.5105 55.392,88.7014 55.5,92.5 C55.5,92.5 25,93.5 25,93.5 C25,93.5 22,90 22,90 C22,90 23.1308,76.8231 24,69 C24.5,64.5001 25.2832,55.3429 30.5,49 C33.7746,45.0186 37,43.5001 40.5,41.0001 C40.8553,40.7463 41.5,40.4367 41.5,40.0001 C41.5,39.0001 40.7856,38.2015 40.5,37 C39.5958,33.1959 40.0884,30.8024 41,27 C42.1197,22.3296 43.1769,19.4676 46.5,16z"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(1,82,115)" stroke-opacity="1" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" d="M42,45.5005 C45.5,45.0005 46.5,46.0005 49,48.0005"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(1,82,115)" stroke-opacity="1" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" d="M36,90 C39.5,85 40.5,84 41,80"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L10o"><g transform="translate(0,0)"><g clip-path="url(#__P__m19)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(1,82,115)" fill-opacity="1" d="M44,72.5 C47.7882,76.8993 55,82.5 55,82.5 C55,82.5 57.5,85.5 57.5,85.5 C57.5,85.5 54.8618,85.978 53,85 C48.5928,82.685 46.023,78.9553 43,75 C39.7119,70.6978 37,62.5 37,62.5 C37,62.5 40.8895,68.8877 44,72.5z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(0,66,96)" fill-opacity="1" d="M69.0004,23 C71.0767,22.3255 74.5004,22 74.5004,22 C74.5004,22 75.5004,35.5 75.5004,35.5 C75.5004,35.5 67.0004,48.5 67.0004,48.5 C67.0004,48.5 57.0004,51 57.0004,51 C56.1401,52.971 55.8017,54.0698 55.5004,56 C55.5004,56 53.1897,52.5274 52.5004,50 C51.5756,46.6091 51.7352,44.4304 52.5004,41 C53.5867,36.13 55.5925,33.6447 59.0004,30 C62.2561,26.518 64.4667,24.4729 69.0004,23z"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L9o"><g transform="translate(0,0)"><g clip-path="url(#__P__m20)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(203,115,68)" fill-opacity="1" d="M68.5,30 C68.6206,28.6385 68.5,26.5 68.5,26.5 C68.5,26.5 54,24 54,24 C54,24 52,40 52,40 C52,40 53.5643,42.4139 55,43.5 C56.5337,44.6602 58.0769,45.9987 60,46 C61.1131,46.0008 62.3261,45.1739 63,44.5 C64,43.5 65.5,40.5 65.5,40.5 C65.5,40.5 66.9652,40.739 67.5,40.5 C68.7606,39.9368 67.1626,36.9232 67.5,35 C67.6391,34.207 67.823,33.8043 68,33 C68.2553,31.84 68.3952,31.1831 68.5,30z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(9,27,41)" fill-opacity="1" d="M64,31.5 C61.5955,30.6863 58,29 58,29 C58,29 53.5,32 53.5,32 C53.5,32 56.7862,35.3983 59.5,36.5 C60.9919,37.1057 61.9,37.3194 63.5,37.5 C64.8582,37.6533 65.6667,37.1989 67,37.5 C67.6023,37.636 68.5,38 68.5,38 C68.5,38 69.5,33 69.5,33 C69.5,33 66.1089,32.2136 64,31.5z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d="M62.5,34.5 C61,33.4999 61,32 61,32 C61,32 62.5,32 64,33 C65.5,34 65.5,35 65.5,35 C65.5,35 64,35.5 62.5,34.5z"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L8v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L8o"><g transform="translate(0,0)"><g clip-path="url(#__P__m22)"><g data-n="g21"><g transform="scale(0.01)"><path fill="rgb(255,255,255)" fill-opacity="1" d="M1.7,-5 C1.7,-5 2.3,-5 2.3,-5 C2.3,-5 0.8,5 0.8,5 C0.8,5 0.2,5 0.2,5 C0.2,5 1.7,-5 1.7,-5z M-0.75,-5 C-0.75,-5 0.75,-5 0.75,-5 C0.75,-5 -1.1,5 -1.1,5 C-1.1,5 -2.6,5 -2.6,5 C-2.6,5 -0.75,-5 -0.75,-5z"/></g></g></g></g></g></g></g></g></g></g></g></g></g><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L7o"><g transform="translate(0,0)"><g clip-path="url(#__P__m23)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(54,17,13)" fill-opacity="1" d="M72.5,24 C72.1717,23.2394 71,21.5 71,21.5 C71,21.5 59.5,20 59.5,20 C59.5,20 56.5,31 56.5,31 C56.5,31 58.8648,31.2859 60,30.5 C60.8027,29.9443 61.5,28.5 61.5,28.5 C61.5,28.5 62.3444,29.2435 63,29.5 C64.466,30.0737 65.7234,29.9211 67,29 C67.7917,28.4287 68,27 68,27 C68,27 69.1298,27.9275 70,28 C71.0479,28.0873 71.705,27.8203 72,27.5 C72.9353,26.4843 73.0633,25.3052 72.5,24z"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L6o"><g transform="translate(0,0)"><g clip-path="url(#__P__m24)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(27,111,114)" fill-opacity="1" d="M84.5,40 C84.5,40 81.5,51 81.5,51 C81.5,51 81.5,51.5 81.5,51.5 C81.5,51.5 88.6865,50 88.6865,50 C88.6865,50 91.5,39.5 91.5,39.5 C92,38 92,38 90.5,38 C90.5,38 86,38 86,38 C85,38 84.8787,38.424 84.5,40z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(12,60,60)" fill-opacity="1" d="M86,40 C86,40 83,51 83,51 C83,51 83,51.5 83,51.5 C83,51.5 90.1865,50 90.1865,50 C90.1865,50 93,39.5 93,39.5 C93.5,38 93.5,38 92,38 C92,38 87.5,38 87.5,38 C86.5,38 86.3787,38.424 86,40z"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L5v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L15"><g transform="scale(0.01)"><g transform="translate(-23,-93.5)"><g data-n="L5o"><g transform="translate(0,0)"><g clip-path="url(#__P__m26)"><g data-n="g25"><g transform="scale(0.01)"><path fill="rgb(107,237,216)" fill-opacity="1" d="M84.5,40 C84.5,40 81.5,51 81.5,51 C81.5,51 81.5,51.5 81.5,51.5 C81.5,51.5 88.6865,50 88.6865,50 C88.6865,50 91.5,39.5 91.5,39.5 C92,38 92,38 90.5,38 C90.5,38 86,38 86,38 C85,38 84.8787,38.424 84.5,40z"/></g></g></g></g></g></g></g></g></g></g></g></g></g><g data-n="L4v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L14"><g transform="scale(0.01)"><g transform="translate(-37.2,-31.9)"><g data-n="L4o"><g transform="translate(0,0)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,207,239)" fill-opacity="1" d="M7.4863,13.1971 C7.4863,13.1971 7.4863,20.9893 7.4863,20.9893 C7.4863,22.0544 7.7027,23.1083 8.1222,24.0872 C8.9177,25.9432 10.3966,27.4222 12.2527,28.2177 C13.2316,28.6372 14.2855,28.8535 15.3505,28.8535 C15.3505,28.8535 26.1439,28.8535 26.1439,28.8535 C28.254,28.8535 30.3293,29.3913 32.1738,30.416 C32.1738,30.416 34.4145,31.6609 34.4145,31.6609 C34.7895,31.8692 35.2114,31.9785 35.6404,31.9785 C35.6404,31.9785 35.8501,31.9785 35.8501,31.9785 C36.1041,31.9785 36.3546,31.9194 36.5818,31.8058 C36.5818,31.8058 36.6008,31.7963 36.6008,31.7963 C37.1435,31.5249 37.4863,30.9702 37.4863,30.3635 C37.4863,30.1913 37.4586,30.0202 37.4041,29.8569 C37.4041,29.8569 36.8613,28.2285 36.8613,28.2285 C36.4474,26.9866 36.2363,25.6861 36.2363,24.3771 C36.2363,24.3771 36.2363,12.8632 36.2363,12.8632 C36.2363,11.4664 35.8567,10.0958 35.138,8.898 C35.138,8.898 34.9564,8.5954 34.9564,8.5954 C34.5634,7.9404 34.0471,7.3678 33.436,6.9095 C32.4139,6.1429 31.1707,5.7285 29.893,5.7285 C29.893,5.7285 14.9549,5.7285 14.9549,5.7285 C12.9741,5.7285 11.0745,6.5154 9.6738,7.916 C8.2732,9.3166 7.4863,11.2163 7.4863,13.1971z"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L3v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L14"><g transform="scale(0.01)"><g transform="translate(-37.2,-31.9)"><g data-n="L3o"><g transform="translate(0,0)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d="M11,17 C11,14.2386 13.2386,12 16,12 C18.7614,12 21,14.2386 21,17 C21,19.7614 18.7614,22 16,22 C13.2386,22 11,19.7614 11,17z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(7,106,253)" fill-opacity="1" d="M14.7921,21.8715 C14.7921,21.8715 14.7921,18.5465 14.7921,18.5465 C14.7921,18.5465 13.7612,18.5465 13.7612,18.5465 C13.7612,18.5465 13.7612,17.0186 13.7612,17.0186 C13.7612,17.0186 14.7921,17.0186 14.7921,17.0186 C14.7921,17.0186 14.7921,16.3602 14.7921,16.3602 C14.7921,14.6581 15.5621,13.8694 17.2329,13.8694 C17.4,13.8694 17.6308,13.8869 17.8446,13.9123 C18.0047,13.9288 18.1635,13.9559 18.32,13.9936 C18.32,13.9936 18.32,15.379 18.32,15.379 C18.2295,15.3705 18.1388,15.3655 18.0479,15.364 C17.9461,15.3613 17.8443,15.3601 17.7425,15.3602 C17.4479,15.3602 17.2179,15.4002 17.0446,15.489 C16.9281,15.5474 16.8301,15.6372 16.7617,15.7481 C16.6542,15.9231 16.6058,16.1627 16.6058,16.4781 C16.6058,16.4781 16.6058,17.0186 16.6058,17.0186 C16.6058,17.0186 18.2387,17.0186 18.2387,17.0186 C18.2387,17.0186 18.0779,17.8948 18.0779,17.8948 C18.0779,17.8948 17.9583,18.5465 17.9583,18.5465 C17.9583,18.5465 16.6058,18.5465 16.6058,18.5465 C16.6058,18.5465 16.6058,21.9819 16.6058,21.9819 C19.0817,21.6827 21,19.5748 21,17.0186 C21,14.2573 18.7612,12.0186 16,12.0186 C13.2387,12.0186 11,14.2573 11,17.0186 C11,19.3636 12.6142,21.3311 14.7921,21.8715z"/></g></g></g></g></g></g></g></g></g></g></g><g data-n="L2v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L14"><g transform="scale(0.01)"><g transform="translate(-37.2,-31.9)"><g data-n="L2o"><g transform="translate(0,0)"><g data-n="g27"><g transform="scale(0.01)"><path fill="rgb(255,157,222)" fill-opacity="1" d="M0,-1.1 C0.6071,-1.1 1.1,-0.6071 1.1,0 C1.1,0.6071 0.6071,1.1 0,1.1 C-0.6071,1.1 -1.1,0.6071 -1.1,0 C-1.1,-0.6071 -0.6071,-1.1 0,-1.1z"/></g></g><g data-n="g28"><g transform="scale(0.01)"><path fill="rgb(255,157,222)" fill-opacity="1" d="M0,-1.1 C0.6071,-1.1 1.1,-0.6071 1.1,0 C1.1,0.6071 0.6071,1.1 0,1.1 C-0.6071,1.1 -1.1,0.6071 -1.1,0 C-1.1,-0.6071 -0.6071,-1.1 0,-1.1z"/></g></g><g data-n="g29"><g transform="scale(0.01)"><path fill="rgb(255,157,222)" fill-opacity="1" d="M0,-1.1 C0.6071,-1.1 1.1,-0.6071 1.1,0 C1.1,0.6071 0.6071,1.1 0,1.1 C-0.6071,1.1 -1.1,0.6071 -1.1,0 C-1.1,-0.6071 -0.6071,-1.1 0,-1.1z"/></g></g><g data-n="g31"><g transform="scale(0.01)"><path fill="rgb(255,157,222)" fill-opacity="1" data-n="p30" d="M25,19.5 C25,19.5 25,19.5 25,19.5 C25,20.3279 24.3279,21 23.5,21 C23.5,21 23.5,21 23.5,21 C22.6721,21 22,20.3279 22,19.5 C22,19.5 22,19.5 22,19.5 C22,18.6721 22.6721,18 23.5,18 C23.5,18 23.5,18 23.5,18 C24.3279,18 25,18.6721 25,19.5z"/></g></g><g data-n="g33"><g transform="scale(0.01)"><path fill="rgb(255,157,222)" fill-opacity="1" data-n="p32" d="M25,14.5 C25,14.5 25,14.5 25,14.5 C25,15.3278 24.3279,16 23.5,16 C23.5,16 23.5,16 23.5,16 C22.6721,16 22,15.3278 22,14.5 C22,14.5 22,14.5 22,14.5 C22,13.6722 22.6721,13 23.5,13 C23.5,13 23.5,13 23.5,13 C24.3279,13 25,13.6722 25,14.5z"/></g></g></g></g></g></g></g></g></g></g></g></g><g data-n="L1v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L14"><g transform="scale(0.01)"><g transform="translate(-37.2,-31.9)"><g data-n="L1o"><g transform="translate(0,0)"><g data-n="g34"><g transform="scale(0.01)"><path fill="rgb(255,68,68)" fill-opacity="1" d="M0,-2.8 C1.5453,-2.8 2.8,-1.5453 2.8,0 C2.8,1.5453 1.5453,2.8 0,2.8 C-1.5453,2.8 -2.8,1.5453 -2.8,0 C-2.8,-1.5453 -1.5453,-2.8 0,-2.8z M-0.45,-0.65 C-0.45,-0.65 0.18,-1.2 0.18,-1.2 C0.18,-1.2 0.18,1.2 0.18,1.2"/><path stroke="rgb(255,255,255)" stroke-opacity="1" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" d="M-0.45,-0.65 C-0.45,-0.65 0.18,-1.2 0.18,-1.2 C0.18,-1.2 0.18,1.2 0.18,1.2"/></g></g></g></g></g></g></g></g></g></g></g></g><g data-n="L0v"><g data-n="L17"><g transform="scale(0.01)"><g transform="translate(-216,-170.445)"><g transform="translate(-34.879,-329.84802) scale(5.366,5.366)"><g data-n="L0o"><g transform="translate(0,0)"><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(255,157,222)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t35" pathLength="1" style="--s:0;--e:0;--a:min(var(--e),var(--s));--b:max(var(--e),var(--s));stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M8.2737,4.7243 C8.2737,4.7243 7.6655,0.6697 7.6655,0.6697"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(255,157,222)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t36" pathLength="1" style="--s:0;--e:0;--a:min(var(--e),var(--s));--b:max(var(--e),var(--s));stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M7.0444,5.3444 C7.0444,5.3444 4.1452,2.4452 4.1452,2.4452"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(255,157,222)" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="t37" pathLength="1" style="--s:0;--e:0;--a:min(var(--e),var(--s));--b:max(var(--e),var(--s));stroke-dasharray:calc(var(--b) - var(--a)) 2;stroke-dashoffset:calc(0 - var(--a));--o:1;stroke-opacity:calc(var(--o) * clamp(0, (var(--b) - var(--a) - 0.00005) * 1000000000, 1))" d="M6.4243,6.5737 C6.4243,6.5737 2.3697,5.9655 2.3697,5.9655"/></g></g></g></g></g></g></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createSafeTransaction(container, { autoplay = true } = {}) {
  container.insertAdjacentHTML("beforeend", MARKUP.replaceAll("__P__", "safe-transaction-" + ++count + "-"));
  const svg = container.lastElementChild;
  let tl;

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(svg);
    const $ = (id) => q(`[data-n="${id}"]`);
    tl = gsap.timeline({ paused: true });

    gsap.set($("L17"), { svgOrigin: "0 0", x: 501.12, y: 733.996, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Cloud"
    tl.to($("L17"), { x: 501.12, y: 728.496, duration: 30 * F, ease: ease[0] }, 17 * F);
    tl.to($("L17"), { x: 501.12, y: 733.996, duration: 30 * F, ease: ease[0] }, 47 * F);
    tl.to($("L17"), { x: 501.12, y: 728.496, duration: 30 * F, ease: ease[0] }, 77 * F);
    tl.to($("L17"), { x: 501.12, y: 733.996, duration: 30 * F, ease: ease[0] }, 107 * F);
    tl.to($("L17"), { scaleX: 100, scaleY: 100, duration: 17 * F, ease: ease[1] }, 0);
    gsap.set($("L15"), { svgOrigin: "0 0", x: 23, y: 93.5, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Person"
    tl.to($("L15"), { scaleX: 100, scaleY: 100, duration: 17 * F, ease: ease[1] }, 3 * F);
    tl.to($("L15"), { scaleX: 100.6, scaleY: 101.6, duration: 30 * F, ease: ease[0] }, 20 * F);
    tl.to($("L15"), { scaleX: 100, scaleY: 100, duration: 30 * F, ease: ease[0] }, 50 * F);
    tl.to($("L15"), { scaleX: 100.6, scaleY: 101.6, duration: 30 * F, ease: ease[0] }, 80 * F);
    tl.to($("L15"), { scaleX: 100, scaleY: 100, duration: 30 * F, ease: ease[0] }, 110 * F);
    gsap.set($("g21"), { svgOrigin: "0 0", x: 52, y: 33.5, rotation: 0, scaleX: 100, scaleY: 100, opacity: 0 }); // group "glint"
    tl.to($("g21"), { x: 71.5, y: 33.5, duration: 7 * F, ease: ease[0] }, 24 * F);
    tl.to($("g21"), { x: 52, y: 33.5, duration: 53 * F, ease: ease[0] }, 31 * F);
    tl.to($("g21"), { x: 71.5, y: 33.5, duration: 7 * F, ease: ease[0] }, 84 * F);
    tl.to($("g21"), { opacity: 0.65, duration: 1 * F, ease: ease[0] }, 23 * F);
    tl.to($("g21"), { opacity: 0, duration: 1 * F, ease: ease[0] }, 31 * F);
    tl.to($("g21"), { opacity: 0.65, duration: 1 * F, ease: ease[0] }, 83 * F);
    tl.to($("g21"), { opacity: 0, duration: 1 * F, ease: ease[0] }, 91 * F);
    gsap.set($("L8v"), { autoAlpha: 0 });
    tl.to($("L8v"), { autoAlpha: 1, duration: STEP, ease: step }, 23 * F - STEP); // in point
    gsap.set($("g25"), { svgOrigin: "0 0", x: 0, y: 0, rotation: 0, scaleX: 100, scaleY: 100, opacity: 0 }); // group "screen"
    track(tl, $("g25"), 9, 86, { opacity: [9,0,0,14,0.45,0,20,0.7,0,22.5,0.4,0,25,0.7,0,27.5,0.4,0,30,0.7,0,32.5,0.4,0,35,0.7,0,37.5,0.4,0,42,0.45,0,52,0.3,0,72,0.3,0,74,0.6,0,76.5,0.35,0,79,0.6,0,81.5,0.35,0,86,0.3] });
    gsap.set($("L5v"), { autoAlpha: 0 });
    tl.to($("L5v"), { autoAlpha: 1, duration: STEP, ease: step }, 9 * F - STEP); // in point
    gsap.set($("L14"), { svgOrigin: "0 0", x: 37.2, y: 31.9, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Bubble"
    track(tl, $("L14"), 15, 146, { x: [26,37.2,0,56,37.2,0,86,37.2,0,116,37.2,0,146,37.2], y: [26,31.9,0,56,31.12,0,86,31.9,0,116,31.12,0,146,31.9], rotation: [44,0,0,47,-5,0,50,3,0,53,-1.2,0,56,0,0,104,0,0,107,-5,0,110,3,0,113,-1.2,0,116,0], scaleX: [15,0,1,32,100], scaleY: [15,0,1,32,100] }); // layer "Bubble"
    gsap.set($("L4v"), { autoAlpha: 0 });
    tl.to($("L4v"), { autoAlpha: 1, duration: STEP, ease: step }, 15 * F - STEP); // in point
    gsap.set($("L3v"), { autoAlpha: 0 });
    tl.to($("L3v"), { autoAlpha: 1, duration: STEP, ease: step }, 15 * F - STEP); // in point
    gsap.set($("g27"), { svgOrigin: "0 0", x: 30.6, y: 17, rotation: 0, scaleX: 70, scaleY: 70, opacity: 0 }); // group "typing dot 3"
    tl.to($("g27"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 22 * F);
    tl.to($("g27"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 25 * F);
    tl.to($("g27"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 28 * F);
    tl.to($("g27"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 31 * F);
    tl.to($("g27"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 34 * F);
    tl.to($("g27"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 37 * F);
    tl.to($("g27"), { opacity: 1, duration: 1 * F, ease: ease[0] }, 21 * F);
    tl.to($("g27"), { opacity: 0, duration: 2 * F, ease: ease[0] }, 35 * F);
    gsap.set($("g28"), { svgOrigin: "0 0", x: 27.1, y: 17, rotation: 0, scaleX: 70, scaleY: 70, opacity: 0 }); // group "typing dot 2"
    tl.to($("g28"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 20 * F);
    tl.to($("g28"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 23 * F);
    tl.to($("g28"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 26 * F);
    tl.to($("g28"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 29 * F);
    tl.to($("g28"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 32 * F);
    tl.to($("g28"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 35 * F);
    tl.to($("g28"), { opacity: 1, duration: 1 * F, ease: ease[0] }, 19 * F);
    tl.to($("g28"), { opacity: 0, duration: 2 * F, ease: ease[0] }, 35 * F);
    gsap.set($("g29"), { svgOrigin: "0 0", x: 23.6, y: 17, rotation: 0, scaleX: 70, scaleY: 70, opacity: 0 }); // group "typing dot 1"
    tl.to($("g29"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 18 * F);
    tl.to($("g29"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 21 * F);
    tl.to($("g29"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 24 * F);
    tl.to($("g29"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 27 * F);
    tl.to($("g29"), { scaleX: 100, scaleY: 100, duration: 3 * F, ease: ease[0] }, 30 * F);
    tl.to($("g29"), { scaleX: 70, scaleY: 70, duration: 3 * F, ease: ease[0] }, 33 * F);
    tl.to($("g29"), { opacity: 1, duration: 1 * F, ease: ease[0] }, 17 * F);
    tl.to($("g29"), { opacity: 0, duration: 2 * F, ease: ease[0] }, 35 * F);
    tl.to($("p30"), { attr: { d: "M31,19.5 C31,19.5 31,19.5 31,19.5 C31,20.3279 30.3279,21 29.5,21 C29.5,21 23.5,21 23.5,21 C22.6721,21 22,20.3279 22,19.5 C22,19.5 22,19.5 22,19.5 C22,18.6721 22.6721,18 23.5,18 C23.5,18 29.5,18 29.5,18 C30.3279,18 31,18.6721 31,19.5z" }, duration: 7 * F, ease: ease[1] }, 40 * F);
    gsap.set($("g31"), { svgOrigin: "0 0", x: 0, y: 0, rotation: 0, scaleX: 100, scaleY: 100, opacity: 0 }); // group "Rectangle 346240816"
    tl.to($("g31"), { opacity: 1, duration: 0.5 * F, ease: ease[0] }, 39.5 * F);
    tl.to($("p32"), { attr: { d: "M34,14.5 C34,14.5 34,14.5 34,14.5 C34,15.3278 33.3278,16 32.5,16 C32.5,16 23.5,16 23.5,16 C22.6721,16 22,15.3278 22,14.5 C22,14.5 22,14.5 22,14.5 C22,13.6722 22.6721,13 23.5,13 C23.5,13 32.5,13 32.5,13 C33.3278,13 34,13.6722 34,14.5z" }, duration: 7 * F, ease: ease[1] }, 36 * F);
    gsap.set($("g33"), { svgOrigin: "0 0", x: 0, y: 0, rotation: 0, scaleX: 100, scaleY: 100, opacity: 0 }); // group "Rectangle 346240815"
    tl.to($("g33"), { opacity: 1, duration: 0.5 * F, ease: ease[0] }, 35.5 * F);
    gsap.set($("L2v"), { autoAlpha: 0 });
    tl.to($("L2v"), { autoAlpha: 1, duration: STEP, ease: step }, 15 * F - STEP); // in point
    gsap.set($("g34"), { svgOrigin: "0 0", x: 35.4, y: 6.9, rotation: 0, scaleX: 0, scaleY: 0 }); // group "badge"
    tl.to($("g34"), { scaleX: 200, scaleY: 200, duration: 8 * F, ease: ease[1] }, 44 * F);
    tl.to($("g34"), { scaleX: 235, scaleY: 235, duration: 3 * F, ease: ease[1] }, 104 * F);
    tl.to($("g34"), { scaleX: 200, scaleY: 200, duration: 5 * F, ease: ease[0] }, 107 * F);
    gsap.set($("L1v"), { autoAlpha: 0 });
    tl.to($("L1v"), { autoAlpha: 1, duration: STEP, ease: step }, 44 * F - STEP); // in point
    tl.to($("t35"), { "--s": 1, duration: 6 * F, ease: ease[1] }, 23 * F); // trim start
    tl.to($("t35"), { "--e": 1, duration: 6 * F, ease: ease[1] }, 19 * F); // trim end
    tl.to($("t36"), { "--s": 1, duration: 6 * F, ease: ease[1] }, 22 * F); // trim start
    tl.to($("t36"), { "--e": 1, duration: 6 * F, ease: ease[1] }, 18 * F); // trim end
    tl.to($("t37"), { "--s": 1, duration: 6 * F, ease: ease[1] }, 21 * F); // trim start
    tl.to($("t37"), { "--e": 1, duration: 6 * F, ease: ease[1] }, 17 * F); // trim end
    gsap.set($("L0v"), { autoAlpha: 0 });
    tl.to($("L0v"), { autoAlpha: 1, duration: STEP, ease: step }, 16 * F - STEP); // in point

    tl.addLabel("intro", 0);
    tl.addLabel("loop", 54 * F);
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
  // intro plays once, then "loop" → end repeats seamlessly
  player.add(tl.tweenFromTo(0, "loop")).add(tl.tweenFromTo("loop", tl.duration(), { repeat: -1 }));

  // Respect prefers-reduced-motion: show a still frame instead of playing
  const mm = gsap.matchMedia();
  mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (c) => {
    if (c.conditions.reduce) api.seekFrame(54);
    else if (autoplay) api.play();
  });
  return api;
}
