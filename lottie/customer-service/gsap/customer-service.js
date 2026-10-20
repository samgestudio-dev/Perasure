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

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;transform:translate3d(0,0,0)"><defs><clipPath id="__P__c_root"><rect width="1000" height="1000" x="0" y="0"/></clipPath></defs><g clip-path="url(#__P__c_root)"><g data-n="L4o"><g data-n="L4"><g transform="scale(0.01)"><g transform="translate(0.25,-366.722)"><g transform="matrix(1,0,0,1,247.374,184.426)"><path fill="rgb(246,208,236)" fill-opacity="1" d="M158.007,133.385 C158.007,133.385 -110.131,133.385 -110.131,133.385 C-115.77,133.385 -120.376,133.921 -130.524,135.37 C-140.197,136.752 -144.054,138.27 -154.684,143.102 C-204.89,165.923 -217.182,184.176 -232.484,174.994 C-247.124,166.21 -222.335,130.538 -216.537,99.129 C-214.26,86.792 -211.347,67.433 -209.771,53.223 C-209.178,47.857 -209.314,40.421 -209.314,35.023 C-209.314,35.023 -209.314,-95.058 -209.314,-95.058 C-209.314,-144.276 -169.415,-184.176 -120.197,-184.176 C-120.197,-184.176 158.007,-184.176 158.007,-184.176 C207.226,-184.176 247.124,-144.276 247.124,-95.058 C247.124,-95.058 247.124,44.268 247.124,44.268 C247.124,93.486 207.226,133.385 158.007,133.385z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(241,162,219)" fill-opacity="0" data-n="p5" d="M161.221,112.842 C161.221,112.842 161.221,112.842 161.221,112.842 C161.221,127.3183 149.4673,139.072 134.991,139.072 C134.991,139.072 134.991,139.072 134.991,139.072 C120.5147,139.072 108.761,127.3183 108.761,112.842 C108.761,112.842 108.761,112.842 108.761,112.842 C108.761,98.3657 120.5147,86.612 134.991,86.612 C134.991,86.612 134.991,86.612 134.991,86.612 C149.4673,86.612 161.221,98.3657 161.221,112.842z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(241,162,219)" fill-opacity="0" data-n="p6" d="M161.221,210.452 C161.221,210.452 161.221,210.452 161.221,210.452 C161.221,224.9283 149.4673,236.682 134.991,236.682 C134.991,236.682 134.991,236.682 134.991,236.682 C120.5147,236.682 108.761,224.9283 108.761,210.452 C108.761,210.452 108.761,210.452 108.761,210.452 C108.761,195.9757 120.5147,184.222 134.991,184.222 C134.991,184.222 134.991,184.222 134.991,184.222 C149.4673,184.222 161.221,195.9757 161.221,210.452z"/></g></g></g></g></g><g data-n="L3v"><g data-n="L3o"><g data-n="L3"><g transform="scale(0.01)"><g transform="translate(-254.173,-224.87)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(167,251,78)" fill-opacity="1" d="M246.5,223.615 C244.167,223.834 238.5,224.113 235.5,223.928 C232.5,223.743 229.667,222.909 228.5,222.504 C227.333,222.099 228.788,221.834 228.496,221.5 C228.204,221.166 227.081,220.866 226.748,220.5 C226.415,220.134 227.041,219.564 226.5,219.302 C225.959,219.04 224.333,219.194 223.5,218.928 C222.667,218.662 222,217.907 221.5,217.703 C221,217.499 220.709,217.904 220.5,217.703 C220.291,217.502 220.746,216.833 220.246,216.5 C219.746,216.167 218,216.036 217.5,215.703 C217,215.37 217.413,214.784 217.246,214.5 C217.079,214.216 217.124,214.166 216.5,214 C215.876,213.834 214.001,213.754 213.5,213.504 C212.999,213.254 213.663,212.763 213.496,212.5 C213.329,212.237 213.333,212.19 212.5,211.928 C211.667,211.666 209.292,211.166 208.5,210.928 C207.708,210.69 207.915,210.771 207.748,210.5 C207.581,210.229 208,209.635 207.5,209.302 C207,208.969 205.248,208.833 204.748,208.5 C204.248,208.167 205.875,207.768 204.5,207.302 C203.125,206.836 197.89,206.17 196.5,205.703 C195.11,205.236 196.994,204.848 196.161,204.5 C195.328,204.152 192.306,203.948 191.5,203.615 C190.694,203.282 191.495,202.75 191.328,202.5 C191.161,202.25 192.471,202.404 190.5,202.116 C188.529,201.828 181.459,201.04 179.5,200.771 C177.541,200.502 178.872,200.712 178.746,200.5 C178.62,200.288 178.954,199.722 178.746,199.5 C178.538,199.278 179.874,199.334 177.5,199.168 C175.126,199.002 166.669,198.782 164.5,198.504 C162.331,198.226 164.651,197.7 164.484,197.5 C164.317,197.3 180.164,197.335 163.5,197.302 C146.836,197.269 82.667,197.38 64.5,197.302 C46.333,197.224 57.333,197.077 54.5,196.832 C51.667,196.587 48.801,196.054 47.5,195.832 C46.199,195.61 46.863,195.74 46.696,195.5 C46.529,195.26 47.199,194.67 46.5,194.392 C45.801,194.114 43.278,193.981 42.5,193.832 C41.722,193.683 41.943,193.722 41.832,193.5 C41.721,193.278 42.364,192.833 41.832,192.5 C41.3,192.167 39.195,191.851 38.64,191.5 C38.085,191.149 39.523,190.821 38.5,190.392 C37.477,189.963 33.625,189.243 32.5,188.928 C31.375,188.613 31.915,188.771 31.748,188.5 C31.581,188.229 31.917,187.635 31.5,187.302 C31.083,186.969 29.622,186.8 29.246,186.5 C28.87,186.2 30.019,186 29.246,185.5 C28.473,185 25.399,184.018 24.608,183.5 C23.817,182.982 24.685,182.725 24.5,182.392 C24.315,182.059 23.833,181.652 23.5,181.504 C23.167,181.356 22.667,181.671 22.5,181.504 C22.333,181.337 22.996,180.967 22.496,180.5 C21.996,180.033 20.033,179.203 19.5,178.703 C18.967,178.203 19.464,177.848 19.297,177.5 C19.13,177.152 18.819,176.782 18.5,176.615 C18.181,176.448 17.571,176.686 17.385,176.5 C17.199,176.314 17.533,175.833 17.385,175.5 C17.237,175.167 16.815,174.671 16.5,174.504 C16.185,174.337 15.796,174.667 15.496,174.5 C15.196,174.333 14.954,174.167 14.698,173.5 C14.442,172.833 14.391,171.167 13.961,170.5 C13.531,169.833 12.526,169.999 12.116,169.5 C11.706,169.001 11.77,167.837 11.5,167.504 C11.23,167.171 10.829,167.934 10.496,167.5 C10.163,167.066 9.888,165.399 9.5,164.899 C9.112,164.399 8.613,165.567 8.168,164.5 C7.723,163.433 7.332,159.667 6.832,158.5 C6.332,157.333 5.557,158.166 5.168,157.5 C4.779,156.834 4.779,155.006 4.5,154.506 C4.221,154.006 3.978,156.668 3.496,154.5 C3.014,152.332 1.941,143.747 1.608,141.5 C1.275,139.253 1.685,141.097 1.5,141.016 C1.315,140.935 0.738,141.602 0.5,141.016 C0.262,140.43 0.117,151.919 0.072,137.5 C0.027,123.081 0.158,68.668 0.229,54.5 C0.3,40.332 0.288,52.825 0.5,52.49 C0.712,52.155 1.288,52.655 1.5,52.49 C1.712,52.325 1.527,53.165 1.771,51.5 C2.015,49.835 2.679,44.222 2.967,42.5 C3.255,40.778 3.244,41.39 3.5,41.168 C3.756,40.946 4.278,41.279 4.5,41.168 C4.722,41.057 4.665,41.237 4.832,40.5 C4.999,39.763 5.189,37.415 5.5,36.748 C5.811,36.081 6.269,37.541 6.698,36.5 C7.127,35.459 7.605,31.583 8.072,30.5 C8.539,29.417 9.095,30.333 9.5,30 C9.905,29.667 10.166,28.754 10.5,28.504 C10.834,28.254 11.242,29.001 11.504,28.5 C11.766,27.999 11.656,26.167 12.072,25.5 C12.488,24.833 13.429,25.166 14,24.5 C14.571,23.834 15.083,22.003 15.5,21.504 C15.917,21.005 16.333,21.671 16.5,21.504 C16.667,21.337 16.003,21.001 16.504,20.5 C17.005,19.999 19.004,19 19.504,18.5 C20.004,18 19.338,17.814 19.504,17.5 C19.67,17.186 20.167,16.763 20.5,16.615 C20.833,16.467 21.314,16.801 21.5,16.615 C21.686,16.429 21.282,15.797 21.615,15.5 C21.948,15.203 22.928,15.165 23.5,14.832 C24.072,14.499 24.713,13.953 25.046,13.5 C25.379,13.047 25.109,12.449 25.5,12.116 C25.891,11.783 27.059,11.787 27.392,11.5 C27.725,11.213 27.065,10.725 27.5,10.392 C27.935,10.059 29.583,9.815 30,9.5 C30.417,9.185 29.917,8.722 30,8.5 C30.083,8.278 29.417,8.468 30.5,8.168 C31.583,7.868 35.453,7.143 36.5,6.698 C37.547,6.253 36.117,5.811 36.784,5.5 C37.451,5.189 39.769,4.999 40.5,4.832 C41.231,4.665 41.001,4.755 41.168,4.5 C41.335,4.245 39.945,3.731 41.5,3.302 C43.055,2.873 48.669,2.228 50.5,1.928 C52.331,1.628 52.153,1.738 52.484,1.5 C52.815,1.262 51.815,0.731 52.484,0.5 C53.153,0.269 32.331,0.171 56.5,0.116 C80.669,0.061 173.555,0.104 197.5,0.168 C221.445,0.232 199.67,0.26 200.17,0.5 C200.67,0.74 198.778,1.141 200.5,1.608 C202.222,2.075 208.792,2.82 210.5,3.302 C212.208,3.784 210.581,4.229 210.748,4.5 C210.915,4.771 210.875,4.794 211.5,4.928 C212.125,5.062 213.959,5.04 214.5,5.302 C215.041,5.564 213.831,5.967 214.748,6.5 C215.665,7.033 219.041,7.923 220,8.5 C220.959,9.077 220.12,9.628 220.5,9.961 C220.88,10.294 221.983,10.244 222.28,10.5 C222.577,10.756 222.077,11.167 222.28,11.5 C222.483,11.833 223.293,12.166 223.496,12.5 C223.699,12.834 223.333,13.337 223.5,13.504 C223.667,13.671 223.834,13.171 224.5,13.504 C225.166,13.837 226.829,14.649 227.496,15.5 C228.163,16.351 228.166,18.09 228.5,18.608 C228.834,19.126 229.167,18.393 229.5,18.608 C229.833,18.823 230.167,19.684 230.5,19.899 C230.833,20.114 231.055,19.132 231.5,19.899 C231.945,20.666 232.668,23.667 233.168,24.5 C233.668,25.333 234.111,24.4 234.5,24.899 C234.889,25.398 235.166,27.063 235.5,27.496 C235.834,27.929 236.171,27 236.504,27.5 C236.837,28 237.167,29.996 237.5,30.496 C237.833,30.996 238.059,29.166 238.504,30.5 C238.949,31.834 239.835,37.034 240.168,38.5 C240.501,39.966 240.259,39.127 240.5,39.294 C240.741,39.461 241.337,38.799 241.615,39.5 C241.893,40.201 242.02,42.668 242.168,43.5 C242.316,44.332 242.277,44.325 242.5,44.492 C242.723,44.659 243.26,43.999 243.504,44.5 C243.748,45.001 243.768,45.5 243.967,47.5 C244.166,49.5 244.514,35.5 244.698,56.5 C244.882,77.5 244.938,153.419 245.072,173.5 C245.206,193.581 245.262,176.403 245.5,176.984 C245.738,177.565 246.314,176.898 246.5,176.984 C246.686,177.07 246.466,176.247 246.615,177.5 C246.764,178.753 247.078,183.293 247.392,184.5 C247.706,185.707 248.269,184.575 248.5,184.742 C248.731,184.909 248.498,183.707 248.776,185.5 C249.054,187.293 249.881,193.701 250.168,195.5 C250.455,197.299 250.259,196.127 250.5,196.294 C250.741,196.461 251.337,195.799 251.615,196.5 C251.893,197.201 252.02,199.701 252.168,200.5 C252.316,201.299 252.278,201.162 252.5,201.294 C252.722,201.426 253.256,201.093 253.5,201.294 C253.744,201.495 253.723,201.132 253.967,202.5 C254.211,203.868 254.859,207.333 254.967,209.5 C255.075,211.667 254.859,214 254.615,215.5 C254.371,217 253.856,217.999 253.504,218.5 C253.152,219.001 252.8,218.337 252.5,218.504 C252.2,218.671 251.836,219.167 251.703,219.5 C251.57,219.833 252.051,220.167 251.703,220.5 C251.355,220.833 249.982,221.148 249.615,221.5 C249.248,221.852 250.019,222.263 249.5,222.615 C248.981,222.967 248.833,223.396 246.5,223.615z"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(24,162,74)" stroke-opacity="0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="p7" d="M232,6 C243.038,6 252,14.962 252,26 C252,37.038 243.038,46 232,46 C220.962,46 212,37.038 212,26 C212,14.962 220.962,6 232,6z"/></g><g transform="matrix(1,0,0,1,0,0)"><path stroke="rgb(24,162,74)" stroke-opacity="0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" data-n="p8" d="M232,6 C243.038,6 252,14.962 252,26 C252,37.038 243.038,46 232,46 C220.962,46 212,37.038 212,26 C212,14.962 220.962,6 232,6z"/></g><g data-n="g9"><g transform="scale(0.01)"><g transform="translate(-232,-26)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(255,255,255)" fill-opacity="1" d="M232,-2 C247.4532,-2 260,10.5468 260,26 C260,41.4532 247.4532,54 232,54 C216.5468,54 204,41.4532 204,26 C204,10.5468 216.5468,-2 232,-2z"/></g><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(24,162,74)" fill-opacity="1" d="M232,6 C243.038,6 252,14.962 252,26 C252,37.038 243.038,46 232,46 C220.962,46 212,37.038 212,26 C212,14.962 220.962,6 232,6z"/></g></g></g></g></g></g></g></g></g><g data-n="L2v"><g data-n="L3"><g transform="scale(0.01)"><g transform="translate(-254.173,-224.87)"><g data-n="L2o"><g data-n="L2"><g transform="scale(0.01)"><g transform="translate(-26.182,-26.182)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(98,193,0)" fill-opacity="1" d="M26.182,-0.018 C40.6418,-0.018 52.382,11.7222 52.382,26.182 C52.382,40.6418 40.6418,52.382 26.182,52.382 C11.7222,52.382 -0.018,40.6418 -0.018,26.182 C-0.018,11.7222 11.7222,-0.018 26.182,-0.018z"/></g></g></g></g></g></g></g></g></g><g data-n="L1v"><g data-n="L3"><g transform="scale(0.01)"><g transform="translate(-254.173,-224.87)"><g data-n="L1o"><g data-n="L1"><g transform="scale(0.01)"><g transform="translate(-26.182,-26.182)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(98,193,0)" fill-opacity="1" d="M26.182,-0.018 C40.6418,-0.018 52.382,11.7222 52.382,26.182 C52.382,40.6418 40.6418,52.382 26.182,52.382 C11.7222,52.382 -0.018,40.6418 -0.018,26.182 C-0.018,11.7222 11.7222,-0.018 26.182,-0.018z"/></g></g></g></g></g></g></g></g></g><g data-n="L0v"><g data-n="L3"><g transform="scale(0.01)"><g transform="translate(-254.173,-224.87)"><g data-n="L0o"><g data-n="L0"><g transform="scale(0.01)"><g transform="translate(-26.182,-26.182)"><g transform="matrix(1,0,0,1,0,0)"><path fill="rgb(98,193,0)" fill-opacity="1" d="M26.182,-0.018 C40.6418,-0.018 52.382,11.7222 52.382,26.182 C52.382,40.6418 40.6418,52.382 26.182,52.382 C11.7222,52.382 -0.018,40.6418 -0.018,26.182 C-0.018,11.7222 11.7222,-0.018 26.182,-0.018z"/></g></g></g></g></g></g></g></g></g></g></svg>`;
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
    tl.to($("L4"), { scaleX: 100, scaleY: 100, duration: 15 * F, ease: ease[0] }, 0);
    tl.to($("L4"), { scaleX: 97, scaleY: 97, duration: 2.5 * F, ease: ease[1] }, 22 * F);
    tl.to($("L4"), { scaleX: 100, scaleY: 100, duration: 4.5 * F, ease: ease[1] }, 24.5 * F);
    tl.to($("p7"), { attr: { d: "M232,-18 C256.2836,-18 276,1.7164 276,26 C276,50.2836 256.2836,70 232,70 C207.7164,70 188,50.2836 188,26 C188,1.7164 207.7164,-18 232,-18z" }, duration: 24 * F, ease: ease[0] }, 75 * F);
    tl.to($("p7"), { attr: { "stroke-opacity": 0.6 }, duration: 0.5 * F, ease: ease[1] }, 74.5 * F);
    tl.to($("p7"), { attr: { "stroke-opacity": 0 }, duration: 24 * F, ease: ease[1] }, 75 * F);
    tl.to($("p7"), { attr: { "stroke-width": 1 }, duration: 24 * F, ease: ease[1] }, 75 * F);
    tl.to($("p8"), { attr: { d: "M232,-18 C256.2836,-18 276,1.7164 276,26 C276,50.2836 256.2836,70 232,70 C207.7164,70 188,50.2836 188,26 C188,1.7164 207.7164,-18 232,-18z" }, duration: 24 * F, ease: ease[0] }, 45 * F);
    tl.to($("p8"), { attr: { "stroke-opacity": 0.6 }, duration: 0.5 * F, ease: ease[1] }, 44.5 * F);
    tl.to($("p8"), { attr: { "stroke-opacity": 0 }, duration: 24 * F, ease: ease[1] }, 45 * F);
    tl.to($("p8"), { attr: { "stroke-width": 1 }, duration: 24 * F, ease: ease[1] }, 45 * F);
    gsap.set($("g9"), { svgOrigin: "0 0", x: 232, y: 26, rotation: 0, scaleX: 0, scaleY: 0 }); // group "online dot"
    tl.to($("g9"), { scaleX: 100, scaleY: 100, duration: 7 * F, ease: ease[0] }, 36 * F);
    gsap.set($("L3"), { svgOrigin: "0 0", x: 780.717, y: 720.879, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Support Bubble"
    tl.to($("L3"), { x: 780.717, y: 714.879, duration: 20 * F, ease: ease[1] }, 45 * F);
    tl.to($("L3"), { x: 780.717, y: 724.879, duration: 20 * F, ease: ease[1] }, 65 * F);
    tl.to($("L3"), { x: 780.717, y: 720.879, duration: 20 * F, ease: ease[1] }, 85 * F);
    tl.to($("L3"), { scaleX: 100, scaleY: 100, duration: 14 * F, ease: ease[0] }, 22 * F);
    gsap.set($("L3v"), { autoAlpha: 0 });
    tl.to($("L3v"), { autoAlpha: 1, duration: STEP, ease: step }, 22 * F - STEP); // in point
    gsap.set($("L2"), { svgOrigin: "0 0", x: 47.018, y: 101.913, rotation: 0, scaleX: 0, scaleY: 0 }); // layer "Typing Dot 1"
    tl.to($("L2"), { x: 47.018, y: 71.913, duration: 5 * F, ease: ease[0] }, 45 * F);
    tl.to($("L2"), { x: 47.018, y: 101.913, duration: 6 * F, ease: ease[1] }, 50 * F);
    tl.to($("L2"), { x: 47.018, y: 71.913, duration: 5 * F, ease: ease[0] }, 75 * F);
    tl.to($("L2"), { x: 47.018, y: 101.913, duration: 6 * F, ease: ease[1] }, 80 * F);
    tl.to($("L2"), { scaleX: 100, scaleY: 100, duration: 8 * F, ease: ease[0] }, 30 * F);
    tl.to($("L2"), { scaleX: 112, scaleY: 112, duration: 5 * F, ease: ease[0] }, 45 * F);
    tl.to($("L2"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[1] }, 50 * F);
    tl.to($("L2"), { scaleX: 112, scaleY: 112, duration: 5 * F, ease: ease[0] }, 75 * F);
    tl.to($("L2"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[1] }, 80 * F);
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
    tl.to($("L1"), { scaleX: 100, scaleY: 100, duration: 8 * F, ease: ease[0] }, 33 * F);
    tl.to($("L1"), { scaleX: 112, scaleY: 112, duration: 5 * F, ease: ease[0] }, 50 * F);
    tl.to($("L1"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[1] }, 55 * F);
    tl.to($("L1"), { scaleX: 112, scaleY: 112, duration: 5 * F, ease: ease[0] }, 80 * F);
    tl.to($("L1"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[1] }, 85 * F);
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
    tl.to($("L0"), { scaleX: 100, scaleY: 100, duration: 8 * F, ease: ease[0] }, 36 * F);
    tl.to($("L0"), { scaleX: 112, scaleY: 112, duration: 5 * F, ease: ease[0] }, 55 * F);
    tl.to($("L0"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[1] }, 60 * F);
    tl.to($("L0"), { scaleX: 112, scaleY: 112, duration: 5 * F, ease: ease[0] }, 85 * F);
    tl.to($("L0"), { scaleX: 100, scaleY: 100, duration: 6 * F, ease: ease[1] }, 90 * F);
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
