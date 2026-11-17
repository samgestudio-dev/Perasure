// coupon-percentage.js — PeraSure coupon icon "Percentage discount", animated in GSAP.
// Art: Figma file 5nVoWWFTfqPDWrABYG6BsW, node 1:6. The ticket is Figma's SVG as drawn. The badge is drawn as a
// real object by the small renderer below: Figma's down-right drop shadow is read as the badge's thickness, its inner
// shadow as a recess, the glyph's shadow as the glyph's height — and one light, placed where the badge's shadow on the
// ticket says it is (to the right, a little above), shades every surface and throws every shadow. No SVG filters.
// Hand-made in the same module format as the lottie2gsap modules (no Lottie source): inline SVG + one GSAP
// timeline, create…(container, { autoplay }) → { svg, timeline, player, play, pause, seekFrame, destroy }.
// Needs gsap 3.13+.
import { gsap } from "gsap";

export const FPS = 60;
export const FRAMES = 210;
export const MARKERS = {"intro":0,"loop":66}; // frame numbers: intro plays once, loop → end repeats
const F = 1 / FPS;
const L = MARKERS.loop * F; // loop start, seconds
const END = FRAMES * F;

// The repo's two curves (the Lottie animations use the same pair) plus an ease-in for exits.
function cubicBezier(x1, y1, x2, y2) {
  const ax = 1 - 3 * x2 + 3 * x1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
  const ay = 1 - 3 * y2 + 3 * y1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  return (p) => {
    if (p <= 0 || p >= 1) return p <= 0 ? 0 : 1;
    let lo = 0, hi = 1, t = p;
    for (let i = 0; i < 30; i++) { if (X(t) > p) hi = t; else lo = t; t = (lo + hi) / 2; }
    return ((ay * t + by) * t + cy) * t;
  };
}
const E = {
  out: cubicBezier(0.22, 1, 0.36, 1),   // entrances, landings
  io: cubicBezier(0.37, 0, 0.63, 1),    // settles, floats
  in: cubicBezier(0.55, 0, 0.85, 0.35), // exits
};

// ---- the scene ----
const K = 0.34859;                // view slant: depth z shows at (x − K·z, y − K·z)
const LIGHT_DIR = [1.3931, -0.0733, 1];    // towards the light (right, a touch above, in front)
const SHADOW = "#1F9158", GREEN = "#58E09A"; // Figma's badge green and its shadow green
const WHITE_DARK = "#5AA592"; // the ₱'s top when the face is away from the light
const BADGE_X = 62.334, BADGE_Y = 55.556, THICK = 3.28; // badge centre (Figma) and thickness
const BADGE = BADGE_X + " " + BADGE_Y;
const SPEC = {"body":{"c":[[-3.759,-17.688,-3.28,-17.761,-2.806,-17.776,-2.34,-17.736,-1.888,-17.645,-1.452,-17.503,-1.037,-17.314,-0.647,-17.081,-0.284,-16.805,0.046,-16.489,0.34,-16.136,0.594,-15.749,0.804,-15.33,1.065,-15.734,1.371,-16.105,1.721,-16.439,2.111,-16.731,2.539,-16.975,3.0,-17.169,3.494,-17.306,3.962,-17.378,4.425,-17.395,4.88,-17.359,5.323,-17.274,5.75,-17.141,6.159,-16.962,6.544,-16.741,6.903,-16.479,7.232,-16.178,7.528,-15.842,7.786,-15.472,8.003,-15.071,8.176,-14.641,8.301,-14.184,8.385,-13.523,8.362,-12.875,8.947,-13.16,9.587,-13.352,10.055,-13.424,10.519,-13.441,10.974,-13.405,11.417,-13.32,11.844,-13.187,12.252,-13.008,12.638,-12.787,12.997,-12.525,13.326,-12.224,13.621,-11.888,13.88,-11.518,14.097,-11.117,14.27,-10.687,14.395,-10.23,14.47,-9.724,14.481,-9.224,14.431,-8.734,14.322,-8.259,14.159,-7.804,13.945,-7.373,13.681,-6.971,14.149,-6.949,14.606,-6.874,15.048,-6.749,15.47,-6.575,15.869,-6.356,16.241,-6.094,16.582,-5.792,16.888,-5.452,17.156,-5.076,17.381,-4.667,17.559,-4.228,17.688,-3.76,17.761,-3.281,17.776,-2.807,17.736,-2.342,17.645,-1.889,17.503,-1.453,17.314,-1.038,17.081,-0.648,16.805,-0.285,16.49,0.045,16.137,0.339,15.75,0.593,15.33,0.803,15.736,1.063,16.108,1.37,16.443,1.72,16.735,2.11,16.98,2.538,17.174,3.0,17.312,3.494,17.384,3.962,17.4,4.425,17.365,4.88,17.28,5.323,17.146,5.75,16.968,6.159,16.747,6.544,16.484,6.903,16.184,7.232,15.848,7.528,15.478,7.786,15.077,8.003,14.647,8.176,14.19,8.301,13.529,8.386,12.881,8.363,13.166,8.945,13.357,9.582,13.428,10.051,13.445,10.514,13.41,10.969,13.324,11.412,13.191,11.839,13.013,12.247,12.791,12.633,12.529,12.992,12.229,13.321,11.893,13.616,11.523,13.875,11.122,14.092,10.691,14.265,10.235,14.39,9.727,14.465,9.226,14.476,8.736,14.426,8.26,14.317,7.804,14.154,7.373,13.938,6.97,13.673,6.949,14.142,6.875,14.6,6.75,15.042,6.577,15.465,6.358,15.865,6.096,16.238,5.794,16.58,5.453,16.886,5.077,17.155,4.668,17.38,4.228,17.559,3.76,17.688,3.281,17.761,2.806,17.776,2.341,17.736,1.888,17.645,1.453,17.503,1.037,17.314,0.647,17.08,0.284,16.804,-0.046,16.489,-0.34,16.136,-0.594,15.748,-0.804,15.329,-1.065,15.733,-1.371,16.105,-1.721,16.439,-2.111,16.73,-2.538,16.975,-3.0,17.169,-3.493,17.306,-3.961,17.378,-4.424,17.395,-4.879,17.359,-5.322,17.274,-5.749,17.141,-6.158,16.962,-6.543,16.741,-6.902,16.479,-7.231,16.178,-7.527,15.842,-7.785,15.472,-8.002,15.071,-8.175,14.641,-8.3,14.184,-8.385,13.526,-8.363,12.879,-8.943,13.162,-9.578,13.352,-10.046,13.424,-10.509,13.44,-10.964,13.405,-11.407,13.319,-11.834,13.186,-12.242,13.008,-12.628,12.786,-12.986,12.524,-13.315,12.224,-13.611,11.888,-13.869,11.518,-14.086,11.117,-14.259,10.687,-14.384,10.23,-14.459,9.724,-14.471,9.223,-14.421,8.734,-14.313,8.259,-14.151,7.804,-13.937,7.372,-13.673,6.97,-14.143,6.949,-14.6,6.875,-15.042,6.75,-15.465,6.576,-15.865,6.358,-16.238,6.096,-16.58,5.793,-16.886,5.452,-17.155,5.076,-17.38,4.667,-17.559,4.227,-17.688,3.759,-17.761,3.28,-17.776,2.805,-17.736,2.34,-17.644,1.887,-17.503,1.451,-17.314,1.036,-17.08,0.645,-16.804,0.282,-16.488,-0.048,-16.135,-0.342,-15.747,-0.596,-15.328,-0.806,-15.732,-1.067,-16.102,-1.373,-16.436,-1.722,-16.727,-2.112,-16.972,-2.539,-17.165,-3.0,-17.302,-3.493,-17.374,-3.961,-17.391,-4.424,-17.355,-4.879,-17.27,-5.322,-17.137,-5.749,-16.958,-6.158,-16.737,-6.543,-16.475,-6.902,-16.174,-7.231,-15.838,-7.527,-15.468,-7.785,-15.067,-8.002,-14.637,-8.175,-14.18,-8.3,-13.52,-8.385,-12.872,-8.362,-13.156,-8.945,-13.347,-9.584,-13.419,-10.052,-13.436,-10.515,-13.4,-10.97,-13.315,-11.413,-13.182,-11.84,-13.003,-12.248,-12.782,-12.634,-12.52,-12.993,-12.219,-13.322,-11.883,-13.617,-11.513,-13.876,-11.112,-14.093,-10.682,-14.266,-10.225,-14.391,-9.72,-14.466,-9.221,-14.477,-8.732,-14.428,-8.258,-14.321,-7.803,-14.159,-7.373,-13.945,-6.971,-13.683,-6.949,-14.151,-6.874,-14.608,-6.748,-15.049,-6.575,-15.471,-6.355,-15.87,-6.093,-16.242,-5.791,-16.582,-5.45,-16.888,-5.074,-17.156,-4.666,-17.381,-4.226,-17.56]],"sgn":1,"T":3.28},"recess":{"c":[[-2.907,-13.676,-2.413,-13.741,-1.928,-13.729,-1.459,-13.643,-1.013,-13.488,-0.597,-13.27,-0.218,-12.993,0.117,-12.661,0.399,-12.279,0.624,-11.851,0.915,-12.282,1.275,-12.661,1.697,-12.977,2.174,-13.22,2.701,-13.381,3.207,-13.447,3.703,-13.431,4.182,-13.339,4.637,-13.175,5.059,-12.944,5.442,-12.652,5.776,-12.303,6.056,-11.903,6.272,-11.456,6.418,-10.967,6.483,-10.457,6.466,-9.956,6.917,-10.176,7.411,-10.324,7.917,-10.389,8.413,-10.373,8.892,-10.281,9.347,-10.117,9.769,-9.886,10.151,-9.594,10.486,-9.246,10.765,-8.845,10.982,-8.398,11.128,-7.91,11.195,-7.363,11.166,-6.828,11.049,-6.315,10.849,-5.833,10.574,-5.391,11.056,-5.36,11.519,-5.257,11.958,-5.086,12.366,-4.853,12.734,-4.561,13.056,-4.217,13.325,-3.823,13.534,-3.385,13.675,-2.908,13.74,-2.414,13.728,-1.929,13.642,-1.46,13.487,-1.013,13.269,-0.597,12.991,-0.219,12.659,0.116,12.276,0.398,11.848,0.622,12.28,0.914,12.659,1.274,12.975,1.696,13.219,2.173,13.381,2.701,13.446,3.206,13.43,3.703,13.338,4.182,13.174,4.637,12.943,5.059,12.651,5.441,12.303,5.776,11.902,6.055,11.455,6.272,10.967,6.417,10.456,6.483,9.956,6.465,10.176,6.916,10.324,7.409,10.39,7.914,10.374,8.411,10.281,8.89,10.118,9.345,9.887,9.767,9.595,10.15,9.247,10.485,8.846,10.764,8.4,10.981,7.911,11.126,7.363,11.193,6.827,11.164,6.313,11.047,5.83,10.846,5.387,10.57,5.357,11.052,5.254,11.516,5.084,11.956,4.851,12.364,4.56,12.733,4.215,13.056,3.822,13.325,3.384,13.535,2.906,13.676,2.412,13.741,1.927,13.728,1.458,13.642,1.011,13.488,0.595,13.269,0.216,12.992,-0.118,12.659,-0.401,12.277,-0.625,11.849,-0.917,12.28,-1.276,12.659,-1.698,12.975,-2.175,13.219,-2.702,13.38,-3.208,13.446,-3.704,13.43,-4.184,13.338,-4.638,13.174,-5.061,12.943,-5.443,12.651,-5.778,12.303,-6.057,11.903,-6.273,11.456,-6.419,10.967,-6.484,10.458,-6.467,9.957,-6.916,10.176,-7.407,10.323,-7.912,10.388,-8.409,10.372,-8.888,10.28,-9.342,10.116,-9.765,9.886,-10.147,9.594,-10.482,9.245,-10.761,8.845,-10.977,8.398,-11.123,7.91,-11.19,7.362,-11.162,6.827,-11.045,6.313,-10.845,5.83,-10.57,5.388,-11.052,5.357,-11.516,5.255,-11.956,5.084,-12.364,4.851,-12.732,4.56,-13.055,4.215,-13.324,3.821,-13.533,3.383,-13.675,2.906,-13.74,2.412,-13.727,1.927,-13.641,1.458,-13.487,1.012,-13.269,0.596,-12.992,0.217,-12.66,-0.117,-12.278,-0.4,-11.851,-0.625,-12.282,-0.916,-12.66,-1.276,-12.976,-1.697,-13.219,-2.174,-13.38,-2.701,-13.446,-3.206,-13.43,-3.703,-13.337,-4.182,-13.173,-4.637,-12.943,-5.059,-12.651,-5.441,-12.302,-5.776,-11.902,-6.055,-11.455,-6.272,-10.966,-6.418,-10.457,-6.483,-9.957,-6.466,-10.177,-6.917,-10.325,-7.41,-10.391,-7.915,-10.375,-8.412,-10.283,-8.891,-10.119,-9.346,-9.888,-9.768,-9.596,-10.15,-9.247,-10.485,-8.847,-10.764,-8.4,-10.981,-7.911,-11.127,-7.364,-11.194,-6.829,-11.165,-6.315,-11.048,-5.832,-10.848,-5.39,-10.573,-5.359,-11.055,-5.256,-11.519,-5.085,-11.958,-4.852,-12.366,-4.561,-12.734,-4.216,-13.057,-3.822,-13.326,-3.384,-13.535]],"sgn":1,"depth":1.202},"parts":[{"c":[[4.766,-4.681,-2.476,6.182,-2.74,6.51,-3.026,6.732,-3.333,6.849,-3.661,6.859,-4.01,6.764,-4.381,6.563,-4.709,6.298,-4.931,6.013,-5.047,5.706,-5.058,5.378,-4.963,5.029,-4.762,4.658,2.48,-6.205,2.885,-6.657,3.337,-6.871,3.837,-6.847,4.385,-6.586,4.713,-6.321,4.935,-6.035,5.052,-5.728,5.062,-5.4,4.967,-5.051]],"sgn":1,"holes":[],"pc":[0.002,-0.011]},{"c":[[-4.074,-0.358,-4.525,-0.375,-4.943,-0.425,-5.327,-0.508,-5.677,-0.625,-5.995,-0.775,-6.279,-0.959,-6.529,-1.176,-6.746,-1.427,-6.93,-1.71,-7.08,-2.028,-7.197,-2.378,-7.28,-2.763,-7.331,-3.18,-7.347,-3.631,-7.331,-4.082,-7.28,-4.499,-7.197,-4.883,-7.08,-5.234,-6.93,-5.551,-6.746,-5.835,-6.529,-6.086,-6.279,-6.303,-5.995,-6.486,-5.677,-6.637,-5.327,-6.754,-4.943,-6.837,-4.525,-6.887,-4.074,-6.904,-3.623,-6.887,-3.206,-6.837,-2.822,-6.754,-2.471,-6.637,-2.154,-6.486,-1.87,-6.303,-1.619,-6.086,-1.402,-5.835,-1.219,-5.551,-1.068,-5.234,-0.952,-4.883,-0.868,-4.499,-0.818,-4.082,-0.801,-3.631,-0.818,-3.18,-0.868,-2.763,-0.952,-2.378,-1.068,-2.028,-1.219,-1.71,-1.402,-1.427,-1.619,-1.176,-1.87,-0.959,-2.154,-0.775,-2.471,-0.625,-2.822,-0.508,-3.206,-0.425,-3.623,-0.375],[-4.074,-2.83,-3.63,-2.919,-3.363,-3.186,-3.274,-3.631,-3.363,-4.076,-3.63,-4.342,-4.074,-4.431,-4.519,-4.342,-4.786,-4.076,-4.875,-3.631,-4.786,-3.186,-4.519,-2.919]],"sgn":1,"holes":[1],"pc":[-4.074,-3.631]},{"c":[[4.077,6.883,3.626,6.867,3.209,6.817,2.825,6.733,2.474,6.616,2.157,6.466,1.873,6.282,1.623,6.065,1.405,5.815,1.222,5.531,1.071,5.213,0.955,4.863,0.871,4.479,0.821,4.061,0.804,3.61,0.821,3.159,0.871,2.742,0.955,2.358,1.071,2.007,1.222,1.69,1.405,1.406,1.623,1.156,1.873,0.938,2.157,0.755,2.474,0.605,2.825,0.488,3.209,0.404,3.626,0.354,4.077,0.337,4.528,0.354,4.946,0.404,5.33,0.488,5.68,0.605,5.998,0.755,6.282,0.938,6.532,1.156,6.749,1.406,6.933,1.69,7.083,2.007,7.2,2.358,7.284,2.742,7.334,3.159,7.35,3.61,7.334,4.061,7.284,4.479,7.2,4.863,7.083,5.213,6.933,5.531,6.749,5.815,6.532,6.065,6.282,6.282,5.998,6.466,5.68,6.616,5.33,6.733,4.946,6.817,4.528,6.867],[4.077,4.411,4.522,4.322,4.789,4.055,4.878,3.61,4.789,3.166,4.522,2.899,4.077,2.81,3.633,2.899,3.366,3.166,3.277,3.61,3.366,4.055,3.633,4.322]],"sgn":1,"holes":[1],"pc":[4.077,3.61]}],"gc":[0.002,-0.01],"glyphH":1.202,"cast":"#442339","castOff":[-5.223,2.109],"rim":0.671,"zt":-5.0};

// ---- relief: a small renderer for the badge as a real object, seen in this oblique view and lit by one light ----
// The view: a point at depth z (towards us = +z) shows at (x − K·z, y − K·z), so depth reads down-right, as in Figma.
// The light: one direction, set so the badge's shadow on the ticket lands where Figma draws it (left, a little down).
// Flat look: hard shadows and a few flat tones, never a gradient.
// Drawn each time the state changes: the body's sides (only those facing us, far ones first), the face, the recess
// (floor, the part of the floor the light reaches, the glyph's shadow on it, the walls we can see), the glyph's sides
// and top, and the whole badge's shadow on the ticket.
const NSV = "http://www.w3.org/2000/svg";
const unit = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const VIEW = unit([K, K, 1]);   // towards the viewer: moving along it leaves a point where it is on screen
const LIGHT = unit(LIGHT_DIR);  // towards the light
const F0 = LIGHT[2];            // light on a face looking straight at us
// Flat colours, no gradients: each surface takes one of a few tones by whether the light reaches it.
//   top    a face turned to the light (Figma's green / white)
//   side   a side turned to the light (the badge's edge is always the shadow colour: one colour, never split)
//   white  a glyph side turned squarely to the light
//   shadow a surface turned away from the light, or in another shape's shadow (Figma's shadow green)
// plus Figma's white rim on the lit lip of the recess: one side white, the other side shadow.
const TONES = {
  green: { top: GREEN, side: GREEN, shadow: SHADOW, topDark: SHADOW },
  edge: { side: SHADOW, shadow: SHADOW },   // the badge's edge: one shadow colour all round, never split
  wall: { side: GREEN, shadow: SHADOW },    // recess walls: a lit wall reads as the face, a wall in shade as shadow
  white: { top: "#FFFFFF", side: "#FFFFFF", shadow: SHADOW, topDark: WHITE_DARK }, // the ₱: white or shadow, nothing between
};
const tone = (m, role, isLit) => (isLit ? TONES[m][role] : role === "top" ? TONES[m].topDark : TONES[m].shadow);
const HIGHLIGHT = 1.32; // a side lit this much more than the face turns white (only sides facing the light squarely)
const sideTone = (m, t) => (t > HIGHLIGHT ? "#FFFFFF" : tone(m, "side", t > 0));
const lit = (n) => dot(n, LIGHT) / F0;
const scr = (p) => [p[0] - K * p[2], p[1] - K * p[2]];
const ff = (v) => Math.round(v * 100) / 100;
function polyD(pts) { // pts: [[x,y],…] on screen
  let d = "";
  for (let i = 0; i < pts.length; i++) d += (i ? "L" : "M") + ff(pts[i][0]) + " " + ff(pts[i][1]);
  return d + "Z";
}
function area(pts) { let a = 0; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1]; return a; }
const unionD = (polys) => polys.map((p) => polyD(area(p) < 0 ? p.slice().reverse() : p)).join(""); // same winding: copies add up
// the area a shape sweeps between two positions (a and b: the same outline, point for point): both outlines plus the
// band each edge sweeps — exact, so the swept shadow's edge stays clean
function sweepD(a, b) {
  const polys = [];
  for (let k = 0; k < a.length; k++) {
    const p = a[k], q = b[k];
    polys.push(p, q);
    for (let i = 0; i < p.length; i++) { const j = (i + 1) % p.length; polys.push([p[i], p[j], q[j], q[i]]); }
  }
  return unionD(polys.filter((x) => Math.abs(area(x)) > 1e-4));
}

// the part of polygon `sub` inside the convex polygon `clip` (Sutherland–Hodgman)
function clipConvex(sub, clip) {
  const sg = area(clip) > 0 ? 1 : -1;
  let out = sub;
  for (let i = 0; i < clip.length && out.length; i++) {
    const a = clip[i], b = clip[(i + 1) % clip.length], inp = out;
    const side = (p) => sg * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]));
    out = [];
    for (let j = 0; j < inp.length; j++) {
      const p = inp[j], q = inp[(j + 1) % inp.length], sp = side(p), sq = side(q);
      if (sp >= 0) out.push(p);
      if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
  }
  return out;
}
function pool(parent, seam) { // seam: also stroke each piece in its own colour, so neighbouring quads leave no hairline

  const els = [];
  let i = 0;
  return {
    begin() { i = 0; },
    put(d, fill) {
      let e = els[i];
      if (!e) { e = document.createElementNS(NSV, "path"); parent.appendChild(e); els.push(e); }
      e.setAttribute("d", d); e.setAttribute("fill", fill);
      if (seam) { e.setAttribute("stroke", fill); e.setAttribute("stroke-width", "0.15"); e.setAttribute("stroke-linejoin", "round"); }
      e.style.display = ""; i++;
    },
    end() { for (let j = i; j < els.length; j++) els[j].style.display = "none"; },
  };
}
// far-to-near pieces → one path per run of the same colour (fewer elements, no hairlines between neighbours)
function putRuns(p, list) {
  p.begin();
  for (let i = 0; i < list.length;) {
    let d = "", j = i;
    while (j < list.length && list[j].fill === list[i].fill) d += list[j++].d;
    p.put(d, list[i].fill);
    i = j;
  }
  p.end();
}
const el = (parent, tag, attrs = {}) => {
  const e = document.createElementNS(NSV, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
};

/** spec: { body: {c, sgn, T}, recess: {c, sgn, depth}, parts: [{c, sgn, pc}], gc, glyphH, cast, zt } — contours are flat
 *  [x0,y0,x1,y1,…] around the badge centre; sgn turns an edge into its outward normal. */
function createRelief(svg, host, castHost, spec, id) {
  const defs = svg.querySelector("defs") || el(svg, "defs");
  const openClip = el(el(defs, "clipPath", { id: id + "open" }), "path");
  const floorClip = el(el(defs, "clipPath", { id: id + "floor" }), "path");
  const sides = pool(el(host, "g"), true);
  const cap = el(host, "path");
  const rim = el(host, "path", { fill: "#FFFFFF" });
  const recess = el(host, "g", { "clip-path": `url(#${id}open)` });
  const floorBase = el(recess, "path");
  const onFloor = el(recess, "g", { "clip-path": `url(#${id}floor)` });
  const floorLit = el(onFloor, "path");
  const glyphShadow = el(onFloor, "path");
  const holeLit = el(onFloor, "path", { fill: GREEN });
  const inner = pool(el(recess, "g"), true);
  const tops = pool(el(recess, "g"));
  const cast = el(castHost, "path", { fill: spec.cast });
  const P = (c) => { const out = []; for (let i = 0; i < c.length; i += 2) out.push([c[i], c[i + 1]]); return out; };
  const body = spec.body.c.map(P), hole = spec.recess.c.map(P);
  const parts = spec.parts.map((p) => ({ c: p.c.map(P), sgn: p.sgn, pc: p.pc, holes: p.holes || [] }));
  const T = spec.body.T, DR = spec.recess.depth, H = spec.glyphH;

  // local (x, y) at height z along the frame's normal → 3D
  const at = (f, x, y, z) => [
    f.o[0] + x * f.u[0] + y * f.v[0] + z * f.n[0],
    f.o[1] + x * f.u[1] + y * f.v[1] + z * f.n[1],
    f.o[2] + x * f.u[2] + y * f.v[2] + z * f.n[2],
  ];
  const n3 = (f, nx, ny) => [nx * f.u[0] + ny * f.v[0], nx * f.u[1] + ny * f.v[1], nx * f.u[2] + ny * f.v[2]];
  const ring = (f, pts, z, dx = 0, dy = 0) => pts.map(([x, y]) => scr(at(f, x + dx, y + dy, z)));
  // the sides of a contour between heights z0 and z1, those facing us; sign −1 = walls of a hole (seen from inside)
  function walls(out, f, contours, sgn, z0, z1, pal, inward, white = true) {
    for (const pts of contours) {
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        let nx = sgn * (b[1] - a[1]), ny = -sgn * (b[0] - a[0]);
        const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
        if (inward) { nx = -nx; ny = -ny; }
        const N = n3(f, nx, ny);
        if (dot(N, VIEW) <= 0) continue;
        const A0 = at(f, a[0], a[1], z0), B0 = at(f, b[0], b[1], z0), B1 = at(f, b[0], b[1], z1), A1 = at(f, a[0], a[1], z1);
        const key = dot([(A0[0] + B1[0]) / 2, (A0[1] + B1[1]) / 2, (A0[2] + B1[2]) / 2], VIEW);
        out.push({ key, d: polyD([scr(A0), scr(B0), scr(B1), scr(A1)]), fill: white ? sideTone(pal, lit(N)) : tone(pal, "side", lit(N) > 0) });
      }
    }
  }

  /** f: front-face frame { o, u, v, n } (o = badge centre on the front face); g: glyph { gs, parts: [{ s, dx, dy }] } */
  function render(f, g) {
    // body: its sides between the front face (0) and the back face (−T), then the face that looks at us
    const sideList = [];
    // (no white on the outer edge: against a white page it would read as a bite out of the badge)
    walls(sideList, f, body, spec.body.sgn, 0, -T, "edge", false, false);
    sideList.sort((a, b) => a.key - b.key);
    putRuns(sides, sideList);
    const front = dot(f.n, VIEW) > 0;
    // the face we see, in its own axes (the back face mirrored so its ₱ reads the right way round)
    const c = front ? f : { o: at(f, 0, 0, -T), u: f.u.map((x) => -x), v: f.v, n: f.n.map((x) => -x) };
    const tc = lit(c.n), faceLit = tc > 0;
    cap.setAttribute("d", body.map((p) => polyD(ring(c, p, 0))).join(""));
    cap.setAttribute("fill", tone("green", "top", faceLit));
    // Figma's white rim: one side of the recess's lip catches the light. A white copy of the opening, moved away from
    // the light, drawn under the recess: only its sliver outside the opening shows — white on the lit lip, opposite
    // the floor's shadow
    const lu = dot(LIGHT, c.u), lv = dot(LIGHT, c.v), ll = Math.hypot(lu, lv);
    if (faceLit && ll > 1e-3) {
      const wx = (-lu / ll) * spec.rim, wy = (-lv / ll) * spec.rim;
      rim.setAttribute("d", hole.map((p) => polyD(ring(c, p, 0, wx, wy))).join(""));
      rim.style.display = "";
    } else rim.style.display = "none";
    // recess: opening on the face, floor DR below it
    openClip.setAttribute("d", hole.map((p) => polyD(ring(c, p, 0))).join(""));
    floorClip.setAttribute("d", hole.map((p) => polyD(ring(c, p, -DR))).join(""));
    floorBase.setAttribute("d", hole.map((p) => polyD(ring(c, p, -DR))).join(""));
    floorBase.setAttribute("fill", SHADOW);
    const ln = dot(LIGHT, c.n);
    const gx = (x, y, q, p) => {
      // glyph part transform: part scale about its centre, glyph scale about the glyph centre, then a move
      const sx = p.pc[0] + q.s * (x - p.pc[0]), sy = p.pc[1] + q.s * (y - p.pc[1]);
      return [spec.gc[0] + g.gs * (sx - spec.gc[0]) + q.dx, spec.gc[1] + g.gs * (sy - spec.gc[1]) + q.dy];
    };
    const glyph = parts.map((p, i) => ({ sgn: p.sgn, holes: p.holes, c: p.c.map((pts) => pts.map(([x, y]) => gx(x, y, g.parts[i], p))) }))
      .filter((p, i) => g.parts[i].s * g.gs > 0.01);
    if (ln > 0.02) {
      // where the light reaches the floor: through the opening, so the opening moved along the light down to the floor
      const px = dot(LIGHT, c.u) / ln, py = dot(LIGHT, c.v) / ln;
      floorLit.setAttribute("d", hole.map((p) => polyD(ring(c, p, -DR, -px * DR, -py * DR))).join(""));
      floorLit.setAttribute("fill", GREEN);
      // the glyph's shadow on the floor: the glyph swept along the light from its foot to its top's shadow. A hole
      // (the ₱'s bowl, the % rings) stays lit where the light still gets in: the hole and the hole moved along the
      // light, overlapped — so only the strip by its lit-side wall is dark
      const foot = [], tip = [], lit = [];
      for (const p of glyph) p.c.forEach((pts, k) => {
        if (p.holes.includes(k)) {
          const moved = pts.map(([x, y]) => [x - px * H, y - py * H]);
          const both = clipConvex(pts, moved);
          if (both.length > 2) lit.push(ring(c, both, -DR));
        } else { foot.push(ring(c, pts, -DR)); tip.push(ring(c, pts, -DR, -px * H, -py * H)); }
      });
      glyphShadow.setAttribute("d", sweepD(foot, tip));
      glyphShadow.setAttribute("fill", SHADOW);
      holeLit.setAttribute("d", unionD(lit));
      floorLit.style.display = glyphShadow.style.display = holeLit.style.display = "";
    } else floorLit.style.display = glyphShadow.style.display = holeLit.style.display = "none";
    // the recess walls we can see and the glyph's sides, far ones first; then the glyph's top
    const list = [];
    walls(list, c, hole, spec.recess.sgn, 0, -DR, "wall", true, false);
    for (const p of glyph) walls(list, c, p.c, p.sgn, -DR, -DR + H, "white", false);
    list.sort((a, b) => a.key - b.key);
    putRuns(inner, list);
    tops.begin(); for (const p of glyph) tops.put(p.c.map((pts) => polyD(ring(c, pts, -DR + H))).join(""), tone("white", "top", faceLit)); tops.end();
    // the badge's shadow on the ticket: the badge's outline as we see it (front face swept to the back face), moved by
    // Figma's shadow offset — the same shape as the badge at every moment, so it narrows to a line with the coin
    const outline = (z) => body.map((pts) => pts.map(([x, y]) => { const q = scr(at(f, x, y, z)); return [q[0] + spec.castOff[0], q[1] + spec.castOff[1]]; }));
    cast.setAttribute("d", sweepD(outline(0), outline(-T)));
  }
  return render;
}

// State that redraws when GSAP changes it (in play, seek and scrub alike): setters mark it dirty, one redraw per batch.
function liveState(init, draw) {
  const v = { ...init }, o = {};
  let queued = false;
  const flush = () => { queued = false; draw(v); };
  for (const k in v) Object.defineProperty(o, k, {
    get: () => v[k],
    set: (x) => { if (v[k] === x) return; v[k] = x; if (!queued) { queued = true; queueMicrotask(flush); } },
  });
  draw(v);
  return o;
}

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible;transform:translate3d(0,0,0)"><defs><clipPath id="__P__ticket"><path d="M17.2649 21.3031C17.7152 23.4214 19.7972 24.7741 21.9155 24.324C24.034 23.8737 25.3866 21.7909 24.9363 19.6725L57.5419 12.7419C61.7788 11.8413 65.9444 14.5465 66.845 18.7835L72.5524 45.6348C73.4528 49.8716 70.7475 54.0364 66.5107 54.937L33.908 61.8669C33.4576 59.7487 31.3758 58.3968 29.2576 58.8469C27.1392 59.2971 25.7865 61.3791 26.2366 63.4975L16.6443 65.5364C12.4075 66.4367 8.24303 63.7322 7.34227 59.4956L1.63485 32.6443C0.734277 28.4074 3.43865 24.2421 7.67543 23.3414L17.2649 21.3031Z"/></clipPath></defs><g data-n="coupon"><path d="M17.2649 21.3031C17.7152 23.4214 19.7972 24.7741 21.9155 24.324C24.034 23.8737 25.3866 21.7909 24.9363 19.6725L57.5419 12.7419C61.7788 11.8413 65.9444 14.5465 66.845 18.7835L72.5524 45.6348C73.4528 49.8716 70.7475 54.0364 66.5107 54.937L33.908 61.8669C33.4576 59.7487 31.3758 58.3968 29.2576 58.8469C27.1392 59.2971 25.7865 61.3791 26.2366 63.4975L16.6443 65.5364C12.4075 66.4367 8.24303 63.7322 7.34227 59.4956L1.63485 32.6443C0.734277 28.4074 3.43865 24.2421 7.67543 23.3414L17.2649 21.3031Z" fill="#FFC7EC"/><g opacity="0.6"><circle data-n="dot" cx="22.8178" cy="28.5424" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="23.924" cy="33.7594" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="25.0318" cy="38.9758" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="26.1428" cy="44.193" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="27.2537" cy="49.4094" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="28.3599" cy="54.6264" r="1.37255" fill="#FF96DD"/></g><g transform="rotate(-12 9.71329 32.9308)"><rect data-n="stub" x="9.71329" y="32.9308" width="5.88235" height="23.5294" rx="2.94118" fill="#FF96DD"/></g><g transform="rotate(-12 32.7305 28.0392)"><rect data-n="line1" x="32.7305" y="28.0392" width="27.451" height="5.88235" rx="2.94118" fill="#FF96DD"/></g><g transform="rotate(-12 34.7664 37.6281)"><rect data-n="line2" x="34.7664" y="37.6281" width="15.6863" height="5.88235" rx="2.94118" fill="#FF96DD"/></g><g clip-path="url(#__P__ticket)"><g data-n="shadeMove"><g data-n="shadeHop"><g data-n="shadeTurn"></g></g></g></g></g><g data-n="badge"><g data-n="spin"><g data-n="relief"></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createCouponPercentage(container, { autoplay = true } = {}) {
  const prefix = "coupon-percentage-" + ++count + "-";
  container.insertAdjacentHTML("beforeend", MARKUP.replaceAll("__P__", prefix));
  const svg = container.lastElementChild;
  let tl;

  const ctx = gsap.context(() => {
    const q = gsap.utils.selector(svg);
    const $ = (id) => q(`[data-n="${id}"]`);
    tl = gsap.timeline({ paused: true });
    const render = createRelief(svg, $("relief")[0], $("shadeTurn")[0], SPEC, prefix);

    // ---- intro (0 → loop): the ticket lands, its print fills in, the badge pops on ----
    const C = $("coupon"), B = $("badge"), S = $("spin");
    gsap.set(C, { transformOrigin: "50% 50%", scale: 0.4, rotation: -18, y: 8, autoAlpha: 0 });
    tl.to(C, { autoAlpha: 1, duration: 0.12, ease: "none" }, 0);
    tl.to(C, { scale: 1.04, rotation: 2, y: 0, duration: 0.38, ease: E.out }, 0);
    tl.to(C, { scale: 1, rotation: 0, duration: 0.26, ease: E.io }, 0.38);
    // stub, perforation and text lines fill in
    gsap.set($("stub"), { transformOrigin: "50% 100%", scaleY: 0 });
    tl.to($("stub"), { scaleY: 1, duration: 0.32, ease: E.out }, 0.22);
    gsap.set($("dot"), { transformOrigin: "50% 50%", scale: 0 });
    tl.to($("dot"), { scale: 1, duration: 0.24, ease: E.out, stagger: 0.035 }, 0.24);
    gsap.set([$("line1"), $("line2")], { transformOrigin: "0% 50%", scaleX: 0 });
    tl.to($("line1"), { scaleX: 1, duration: 0.36, ease: E.out }, 0.3);
    tl.to($("line2"), { scaleX: 1, duration: 0.36, ease: E.out }, 0.38);
    // the badge pops on; its shadow on the ticket grows with it (same centre, same scale)
    const SM = $("shadeMove");
    gsap.set(B, { autoAlpha: 0 });
    gsap.set(SM, { autoAlpha: 0 });
    gsap.set([B, SM], { svgOrigin: BADGE, scale: 0 });
    tl.set([B, SM], { autoAlpha: 1 }, 0.42);
    tl.to([B, SM], { scale: 1.12, duration: 0.28, ease: E.out }, 0.42);
    tl.to([B, SM], { scale: 1, duration: 0.24, ease: E.io }, 0.7);
    gsap.set(S, { svgOrigin: BADGE });
    // the seal: turns in the face's plane, its % with it (the light stays put, so lit and shaded sides move round it)
    const R = liveState({ turn: -60, gs: 1, s0: 0, s1: 0, s2: 0 }, (v) => {
      const t = (v.turn * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
      render({ o: [BADGE_X, BADGE_Y, 0], u: [c, s, 0], v: [-s, c, 0], n: [0, 0, 1] },
        { gs: v.gs, parts: [{ s: v.s0, dx: 0, dy: 0 }, { s: v.s1, dx: 0, dy: 0 }, { s: v.s2, dx: 0, dy: 0 }] });
    });
    tl.to(R, { turn: 0, duration: 0.6, ease: E.out }, 0.42);
    // the % rises out of the floor piece by piece: slash, then the two rings
    tl.to(R, { s0: 1, duration: 0.3, ease: E.out }, 0.6);
    tl.to(R, { s1: 1.2, duration: 0.18, ease: E.out }, 0.64);
    tl.to(R, { s1: 1, duration: 0.16, ease: E.io }, 0.82);
    tl.to(R, { s2: 1.2, duration: 0.18, ease: E.out }, 0.72);
    tl.to(R, { s2: 1, duration: 0.16, ease: E.io }, 0.9);

    // ---- loop (loop → end, seamless: everything is back where it started) ----
    // the ticket floats, the badge (and its shadow) float a beat later
    tl.to(C, { y: -1.5, rotation: -1.2, duration: 1.2, ease: E.io }, L);
    tl.to(C, { y: 0, rotation: 0, duration: 1.2, ease: E.io }, L + 1.2);
    tl.to([B, SM], { y: -2, duration: 1.3, ease: E.io }, L);
    tl.to([B, SM], { y: 0, duration: 1.1, ease: E.io }, L + 1.3);
    // the seal (with its %) rocks: a nudge one way, a smaller one back, and settles; the % pulses
    tl.to(R, { turn: 14, duration: 0.36, ease: E.out }, L + 0.8);
    tl.to(R, { turn: -5, duration: 0.34, ease: E.io }, L + 1.16);
    tl.to(R, { turn: 0, duration: 0.36, ease: E.io }, L + 1.5);
    tl.to(R, { gs: 1.14, duration: 0.22, ease: E.out }, L + 1.05);
    tl.to(R, { gs: 1, duration: 0.34, ease: E.io }, L + 1.27);

    tl.addLabel("intro", 0);
    tl.addLabel("loop", L);
    tl.set({}, {}, END); // timeline length
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

  // Respect prefers-reduced-motion: show the finished still instead of playing
  const mm = gsap.matchMedia();
  mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (c) => {
    if (c.conditions.reduce) api.seekFrame(MARKERS.loop);
    else if (autoplay) api.play();
  });
  return api;
}
