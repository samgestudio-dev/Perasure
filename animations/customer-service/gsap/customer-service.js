// customer-service.js — generated from customer-service.json (Lottie) by perasure-tools/lottie2gsap.
// Inline SVG + one GSAP timeline. Needs gsap 3.13+.
// Timing is in Lottie frames: F = one frame in seconds.
import { gsap } from "gsap";

export const FPS = 29.97;
export const FRAMES = 105;
export const MARKERS = {"intro":0,"loop":45}; // frame numbers
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
const ease = ["0.22,1,0.36,1","0.37,0,0.63,1"].map((c) => cubicBezier(...c.split(",").map(Number)));

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;transform:translate3d(0,0,0)"><defs><clipPath id="__P__c_root"><rect width="1000" height="1000" x="0" y="0"/></clipPath></defs><g clip-path="url(#__P__c_root)"><g data-n="L4o"><g data-n="L4"><g transform="translate(0.25,-366.722)"><g transform="matrix(1,0,0,1,247.374,184.426)"><path fill="rgb(246,208,236)" fill-opacity="1" d="M158.007,133.385 C158.007,133.385 -110.131,133.385 -110.131,133.385 C-115.77,133.385 -120.376,133.921 -130.524,135.37 C-140.197,136.752 -144.054,138.27 -154.684,143.102 C-204.89,165.923 -217.182,184.176 -232.484,174.994 C-247.124,166.21 -222.335,130.538 -216.537,99.129 C-214.26,86.792 -211.347,67.433 -209.771,53.223 C-209.178,47.857 -209.314,40.421 -209.314,35.023 C-209.314,35.023 -209.314,-95.058 -209.314,-95.058 C-209.314,-144.276 -169.415,-184.176 -120.197,-184.176 C-120.197,-184.176 158.007,-184.176 158.007,-184.176 C207.226,-184.176 247.124,-144.276 247.124,-95.058 C247.124,-95.058 247.124,44.268 247.124,44.268 C247.124,93.486 207.226,133.385 158.007,133.385z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(241,162,219)" fill-opacity="0" data-n="p5" d="M161.221,112.842 C161.221,112.842 161.221,112.842 161.221,112.842 C161.221,127.3183 149.4673,139.072 134.991,139.072 C134.991,139.072 134.991,139.072 134.991,139.072 C120.5147,139.072 108.761,127.3183 108.761,112.842 C108.761,112.842 108.761,112.842 108.761,112.842 C108.761,98.3657 120.5147,86.612 134.991,86.612 C134.991,86.612 134.991,86.612 134.991,86.612 C149.4673,86.612 161.221,98.3657 161.221,112.842z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(241,162,219)" fill-opacity="0" data-n="p6" d="M161.221,210.452 C161.221,210.452 161.221,210.452 161.221,210.452 C161.221,224.9283 149.4673,236.682 134.991,236.682 C134.991,236.682 134.991,236.682 134.991,236.682 C120.5147,236.682 108.761,224.9283 108.761,210.452 C108.761,210.452 108.761,210.452 108.761,210.452 C108.761,195.9757 120.5147,184.222 134.991,184.222 C134.991,184.222 134.991,184.222 134.991,184.222 C149.4673,184.222 161.221,195.9757 161.221,210.452z"/></g></g></g></g><g data-n="L3v"><g data-n="L3o"><g data-n="L3"><g transform="translate(-254.173,-224.87)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(167,251,78)" fill-opacity="1" d="M245.492,222.029 C232.44,226.819 219.448,215.946 208.524,210.386 C202.001,207.066 195.127,204.317 188.07,202.36 C180.932,200.381 172.946,198.294 165.597,197.501 C157.409,196.617 148.824,197.297 140.594,197.301 C123.589,197.31 106.582,197.329 89.577,197.329 C73.923,197.329 56.852,199.271 42.194,192.77 C20.712,183.242 4.012,163.948 0.551,140.193 C-1.295,127.52 0.09,103.964 0.121,90.195 C0.147,78.664 -1.141,63.282 0.685,52.202 C3.361,35.971 15.809,19.138 29.357,10.268 C32.888,7.956 46.326,1.323 50.102,0.457 C56.669,-1.049 76.227,0.095 84.099,0.093 C108.44,0.086 132.782,0.096 157.123,0.115 C164.992,0.121 198.016,-0.936 203.128,0.428 C204.352,0.755 205.313,1.951 206.47,2.527 C215.849,7.198 223.648,11.794 230.339,20.11 C246.914,40.712 244.74,58.148 244.819,82.73 C244.916,113.045 244.254,143.456 245.146,173.758 C245.512,186.187 263.972,215.247 245.492,222.029 Z"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(24,162,74)" stroke-opacity="0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="p7" d="M232,6 C243.038,6 252,14.962 252,26 C252,37.038 243.038,46 232,46 C220.962,46 212,37.038 212,26 C212,14.962 220.962,6 232,6z"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(24,162,74)" stroke-opacity="0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="p8" d="M232,6 C243.038,6 252,14.962 252,26 C252,37.038 243.038,46 232,46 C220.962,46 212,37.038 212,26 C212,14.962 220.962,6 232,6z"/></g><g data-n="g9"><g transform="translate(-232,-26)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d="M232,-2 C247.4532,-2 260,10.5468 260,26 C260,41.4532 247.4532,54 232,54 C216.5468,54 204,41.4532 204,26 C204,10.5468 216.5468,-2 232,-2z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,162,74)" fill-opacity="1" d="M232,6 C243.038,6 252,14.962 252,26 C252,37.038 243.038,46 232,46 C220.962,46 212,37.038 212,26 C212,14.962 220.962,6 232,6z"/></g></g></g></g></g></g></g><g data-n="L2v"><g data-n="L3"><g transform="translate(-254.173,-224.87)"><g data-n="L2o"><g data-n="L2"><g transform="translate(-26.182,-26.182)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(98,193,0)" fill-opacity="1" d="M26.182,-0.018 C40.6418,-0.018 52.382,11.7222 52.382,26.182 C52.382,40.6418 40.6418,52.382 26.182,52.382 C11.7222,52.382 -0.018,40.6418 -0.018,26.182 C-0.018,11.7222 11.7222,-0.018 26.182,-0.018z"/></g></g></g></g></g></g></g><g data-n="L1v"><g data-n="L3"><g transform="translate(-254.173,-224.87)"><g data-n="L1o"><g data-n="L1"><g transform="translate(-26.182,-26.182)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(98,193,0)" fill-opacity="1" d="M26.182,-0.018 C40.6418,-0.018 52.382,11.7222 52.382,26.182 C52.382,40.6418 40.6418,52.382 26.182,52.382 C11.7222,52.382 -0.018,40.6418 -0.018,26.182 C-0.018,11.7222 11.7222,-0.018 26.182,-0.018z"/></g></g></g></g></g></g></g><g data-n="L0v"><g data-n="L3"><g transform="translate(-254.173,-224.87)"><g data-n="L0o"><g data-n="L0"><g transform="translate(-26.182,-26.182)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(98,193,0)" fill-opacity="1" d="M26.182,-0.018 C40.6418,-0.018 52.382,11.7222 52.382,26.182 C52.382,40.6418 40.6418,52.382 26.182,52.382 C11.7222,52.382 -0.018,40.6418 -0.018,26.182 C-0.018,11.7222 11.7222,-0.018 26.182,-0.018z"/></g></g></g></g></g></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createCustomerService(container, { autoplay = true } = {}) {
  container.insertAdjacentHTML("beforeend", MARKUP.replaceAll("__P__", "customer-service-" + ++count + "-"));
  const svg = container.lastElementChild;
  let tl;

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(svg);
    const $ = (id) => q(`[data-n="${id}"]`);
    tl = gsap.timeline({ paused: true });

    tl.to($("p5"), { attr: { d: "M436.207,112.842 C436.207,112.842 436.207,112.842 436.207,112.842 C436.207,127.3183 424.4533,139.072 409.977,139.072 C409.977,139.072 134.991,139.072 134.991,139.072 C120.5147,139.072 108.761,127.3183 108.761,112.842 C108.761,112.842 108.761,112.842 108.761,112.842 C108.761,98.3657 120.5147,86.612 134.991,86.612 C134.991,86.612 409.977,86.612 409.977,86.612 C424.4533,86.612 436.207,98.3657 436.207,112.842z" }, duration: 9 * F, ease: ease[0] }, 8 * F);
    tl.to($("p5"), { attr: { "fill-opacity": 1 }, duration: 0.5 * F, ease: ease[1] }, 7.5 * F);
    tl.to($("p6"), { attr: { d: "M338.743,210.452 C338.743,210.452 338.743,210.452 338.743,210.452 C338.743,224.9283 326.9893,236.682 312.513,236.682 C312.513,236.682 134.991,236.682 134.991,236.682 C120.5147,236.682 108.761,224.9283 108.761,210.452 C108.761,210.452 108.761,210.452 108.761,210.452 C108.761,195.9757 120.5147,184.222 134.991,184.222 C134.991,184.222 312.513,184.222 312.513,184.222 C326.9893,184.222 338.743,195.9757 338.743,210.452z" }, duration: 9 * F, ease: ease[0] }, 13 * F);
    tl.to($("p6"), { attr: { "fill-opacity": 1 }, duration: 0.5 * F, ease: ease[1] }, 12.5 * F);
    gsap.set($("L4"), { svgOrigin: "0 0", x: 215.69, y: 642.965, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Icon 1 Outlines"
    tl.to($("L4"), { x: 209.69, y: 638.965, duration: 3 * F, ease: ease[1] }, 26 * F);
    tl.to($("L4"), { x: 215.69, y: 642.965, duration: 7 * F, ease: ease[1] }, 29 * F);
    tl.to($("L4"), { x: 215.69, y: 635.965, duration: 30 * F, ease: ease[1] }, 45 * F);
    tl.to($("L4"), { x: 215.69, y: 642.965, duration: 30 * F, ease: ease[1] }, 75 * F);
    tl.to($("L4"), { rotation: -2.5, duration: 3 * F, ease: ease[1] }, 26 * F);
    tl.to($("L4"), { rotation: 0, duration: 7 * F, ease: ease[1] }, 29 * F);
    tl.to($("L4"), { scaleX: 1, scaleY: 1, duration: 15 * F, ease: ease[0] }, 0);
    tl.to($("L4"), { scaleX: 0.97, scaleY: 0.97, duration: 2.5 * F, ease: ease[1] }, 22 * F);
    tl.to($("L4"), { scaleX: 1, scaleY: 1, duration: 4.5 * F, ease: ease[1] }, 24.5 * F);
    tl.to($("p7"), { attr: { d: "M232,-18 C256.2836,-18 276,1.7164 276,26 C276,50.2836 256.2836,70 232,70 C207.7164,70 188,50.2836 188,26 C188,1.7164 207.7164,-18 232,-18z" }, duration: 24 * F, ease: ease[0] }, 75 * F);
    tl.to($("p7"), { attr: { "stroke-opacity": 0.6 }, duration: 0.5 * F, ease: ease[1] }, 74.5 * F);
    tl.to($("p7"), { attr: { "stroke-opacity": 0 }, duration: 24 * F, ease: ease[1] }, 75 * F);
    tl.to($("p7"), { attr: { "stroke-width": 1 }, duration: 24 * F, ease: ease[1] }, 75 * F);
    tl.to($("p8"), { attr: { d: "M232,-18 C256.2836,-18 276,1.7164 276,26 C276,50.2836 256.2836,70 232,70 C207.7164,70 188,50.2836 188,26 C188,1.7164 207.7164,-18 232,-18z" }, duration: 24 * F, ease: ease[0] }, 45 * F);
    tl.to($("p8"), { attr: { "stroke-opacity": 0.6 }, duration: 0.5 * F, ease: ease[1] }, 44.5 * F);
    tl.to($("p8"), { attr: { "stroke-opacity": 0 }, duration: 24 * F, ease: ease[1] }, 45 * F);
    tl.to($("p8"), { attr: { "stroke-width": 1 }, duration: 24 * F, ease: ease[1] }, 45 * F);
    gsap.set($("g9"), { svgOrigin: "0 0", x: 232, y: 26, rotation: 0, scaleX: 0, scaleY: 0 }); // group "online dot"
    tl.to($("g9"), { scaleX: 1, scaleY: 1, duration: 7 * F, ease: ease[0] }, 36 * F);
    gsap.set($("L3"), { svgOrigin: "0 0", x: 780.717, y: 720.879, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Support Bubble"
    tl.to($("L3"), { x: 780.717, y: 714.879, duration: 20 * F, ease: ease[1] }, 45 * F);
    tl.to($("L3"), { x: 780.717, y: 724.879, duration: 20 * F, ease: ease[1] }, 65 * F);
    tl.to($("L3"), { x: 780.717, y: 720.879, duration: 20 * F, ease: ease[1] }, 85 * F);
    tl.to($("L3"), { scaleX: 1, scaleY: 1, duration: 14 * F, ease: ease[0] }, 22 * F);
    gsap.set($("L3v"), { autoAlpha: 0 });
    tl.to($("L3v"), { autoAlpha: 1, duration: STEP, ease: step }, 22 * F - STEP); // in point
    gsap.set($("L2"), { svgOrigin: "0 0", x: 47.018, y: 101.913, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Typing Dot 1"
    tl.to($("L2"), { x: 47.018, y: 71.913, duration: 5 * F, ease: ease[0] }, 45 * F);
    tl.to($("L2"), { x: 47.018, y: 101.913, duration: 6 * F, ease: ease[1] }, 50 * F);
    tl.to($("L2"), { x: 47.018, y: 71.913, duration: 5 * F, ease: ease[0] }, 75 * F);
    tl.to($("L2"), { x: 47.018, y: 101.913, duration: 6 * F, ease: ease[1] }, 80 * F);
    tl.to($("L2"), { scaleX: 1, scaleY: 1, duration: 8 * F, ease: ease[0] }, 30 * F);
    tl.to($("L2"), { scaleX: 1.12, scaleY: 1.12, duration: 5 * F, ease: ease[0] }, 45 * F);
    tl.to($("L2"), { scaleX: 1, scaleY: 1, duration: 6 * F, ease: ease[1] }, 50 * F);
    tl.to($("L2"), { scaleX: 1.12, scaleY: 1.12, duration: 5 * F, ease: ease[0] }, 75 * F);
    tl.to($("L2"), { scaleX: 1, scaleY: 1, duration: 6 * F, ease: ease[1] }, 80 * F);
    gsap.set($("L2o"), { opacity: 1 });
    gsap.set($("L2v"), { autoAlpha: 0 });
    tl.to($("L2v"), { autoAlpha: 1, duration: STEP, ease: step }, 30 * F - STEP); // in point
    tl.to($("L2o"), { opacity: 0.65, duration: 4 * F, ease: ease[1] }, 41 * F); // opacity
    tl.to($("L2o"), { opacity: 1, duration: 5 * F, ease: ease[0] }, 45 * F);
    tl.to($("L2o"), { opacity: 0.65, duration: 6 * F, ease: ease[1] }, 50 * F);
    tl.to($("L2o"), { opacity: 1, duration: 5 * F, ease: ease[0] }, 75 * F);
    tl.to($("L2o"), { opacity: 0.65, duration: 6 * F, ease: ease[1] }, 80 * F);
    gsap.set($("L1"), { svgOrigin: "0 0", x: 122.745, y: 101.913, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Typing Dot 2"
    tl.to($("L1"), { x: 122.745, y: 71.913, duration: 5 * F, ease: ease[0] }, 50 * F);
    tl.to($("L1"), { x: 122.745, y: 101.913, duration: 6 * F, ease: ease[1] }, 55 * F);
    tl.to($("L1"), { x: 122.745, y: 71.913, duration: 5 * F, ease: ease[0] }, 80 * F);
    tl.to($("L1"), { x: 122.745, y: 101.913, duration: 6 * F, ease: ease[1] }, 85 * F);
    tl.to($("L1"), { scaleX: 1, scaleY: 1, duration: 8 * F, ease: ease[0] }, 33 * F);
    tl.to($("L1"), { scaleX: 1.12, scaleY: 1.12, duration: 5 * F, ease: ease[0] }, 50 * F);
    tl.to($("L1"), { scaleX: 1, scaleY: 1, duration: 6 * F, ease: ease[1] }, 55 * F);
    tl.to($("L1"), { scaleX: 1.12, scaleY: 1.12, duration: 5 * F, ease: ease[0] }, 80 * F);
    tl.to($("L1"), { scaleX: 1, scaleY: 1, duration: 6 * F, ease: ease[1] }, 85 * F);
    gsap.set($("L1o"), { opacity: 1 });
    gsap.set($("L1v"), { autoAlpha: 0 });
    tl.to($("L1v"), { autoAlpha: 1, duration: STEP, ease: step }, 33 * F - STEP); // in point
    tl.to($("L1o"), { opacity: 0.65, duration: 4 * F, ease: ease[1] }, 41 * F); // opacity
    tl.to($("L1o"), { opacity: 1, duration: 5 * F, ease: ease[0] }, 50 * F);
    tl.to($("L1o"), { opacity: 0.65, duration: 6 * F, ease: ease[1] }, 55 * F);
    tl.to($("L1o"), { opacity: 1, duration: 5 * F, ease: ease[0] }, 80 * F);
    tl.to($("L1o"), { opacity: 0.65, duration: 6 * F, ease: ease[1] }, 85 * F);
    gsap.set($("L0"), { svgOrigin: "0 0", x: 197.444, y: 101.913, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Typing Dot 3"
    tl.to($("L0"), { x: 197.444, y: 71.913, duration: 5 * F, ease: ease[0] }, 55 * F);
    tl.to($("L0"), { x: 197.444, y: 101.913, duration: 6 * F, ease: ease[1] }, 60 * F);
    tl.to($("L0"), { x: 197.444, y: 71.913, duration: 5 * F, ease: ease[0] }, 85 * F);
    tl.to($("L0"), { x: 197.444, y: 101.913, duration: 6 * F, ease: ease[1] }, 90 * F);
    tl.to($("L0"), { scaleX: 1, scaleY: 1, duration: 8 * F, ease: ease[0] }, 36 * F);
    tl.to($("L0"), { scaleX: 1.12, scaleY: 1.12, duration: 5 * F, ease: ease[0] }, 55 * F);
    tl.to($("L0"), { scaleX: 1, scaleY: 1, duration: 6 * F, ease: ease[1] }, 60 * F);
    tl.to($("L0"), { scaleX: 1.12, scaleY: 1.12, duration: 5 * F, ease: ease[0] }, 85 * F);
    tl.to($("L0"), { scaleX: 1, scaleY: 1, duration: 6 * F, ease: ease[1] }, 90 * F);
    gsap.set($("L0o"), { opacity: 1 });
    gsap.set($("L0v"), { autoAlpha: 0 });
    tl.to($("L0v"), { autoAlpha: 1, duration: STEP, ease: step }, 36 * F - STEP); // in point
    tl.to($("L0o"), { opacity: 0.65, duration: 4 * F, ease: ease[1] }, 41 * F); // opacity
    tl.to($("L0o"), { opacity: 1, duration: 5 * F, ease: ease[0] }, 55 * F);
    tl.to($("L0o"), { opacity: 0.65, duration: 6 * F, ease: ease[1] }, 60 * F);
    tl.to($("L0o"), { opacity: 1, duration: 5 * F, ease: ease[0] }, 85 * F);
    tl.to($("L0o"), { opacity: 0.65, duration: 6 * F, ease: ease[1] }, 90 * F);

    tl.addLabel("intro", 0);
    tl.addLabel("loop", 45 * F);
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
    if (c.conditions.reduce) api.seekFrame(45);
    else if (autoplay) api.play();
  });
  return api;
}
