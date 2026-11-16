// coupon-amount.js — PeraSure coupon icon "Amount discount", animated in GSAP.
// Art: Figma file 5nVoWWFTfqPDWrABYG6BsW, node 1:69. The ticket is Figma's SVG as drawn. The badge is drawn as a
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
const BADGE_X = 62.336, BADGE_Y = 55.556, THICK = 3.4; // badge centre (Figma) and thickness
const BADGE = BADGE_X + " " + BADGE_Y;
const SPEC = {"body":{"c":[[-17.778,-0.0,-17.757,-0.861,-17.696,-1.712,-17.596,-2.551,-17.457,-3.378,-17.281,-4.192,-17.068,-4.991,-16.819,-5.775,-16.535,-6.542,-16.218,-7.293,-15.867,-8.026,-15.485,-8.739,-15.072,-9.433,-14.628,-10.106,-14.155,-10.757,-13.654,-11.386,-13.126,-11.99,-12.571,-12.571,-11.99,-13.126,-11.386,-13.654,-10.757,-14.155,-10.106,-14.628,-9.433,-15.072,-8.739,-15.485,-8.026,-15.867,-7.293,-16.218,-6.542,-16.535,-5.775,-16.819,-4.991,-17.068,-4.192,-17.281,-3.378,-17.457,-2.551,-17.596,-1.712,-17.696,-0.861,-17.757,0.0,-17.778,0.861,-17.757,1.712,-17.696,2.551,-17.596,3.378,-17.457,4.192,-17.281,4.991,-17.068,5.775,-16.819,6.542,-16.535,7.293,-16.218,8.026,-15.867,8.739,-15.485,9.433,-15.072,10.106,-14.628,10.757,-14.155,11.386,-13.654,11.99,-13.126,12.571,-12.571,13.126,-11.99,13.654,-11.386,14.155,-10.757,14.628,-10.106,15.072,-9.433,15.485,-8.739,15.867,-8.026,16.218,-7.293,16.535,-6.542,16.819,-5.775,17.068,-4.991,17.281,-4.192,17.457,-3.378,17.596,-2.551,17.696,-1.712,17.757,-0.861,17.778,-0.0,17.757,0.861,17.696,1.712,17.596,2.551,17.457,3.378,17.281,4.192,17.068,4.991,16.819,5.775,16.535,6.542,16.218,7.293,15.867,8.026,15.485,8.739,15.072,9.433,14.628,10.106,14.155,10.757,13.654,11.386,13.126,11.99,12.571,12.571,11.99,13.126,11.386,13.654,10.757,14.155,10.106,14.628,9.433,15.072,8.739,15.485,8.026,15.867,7.293,16.218,6.542,16.535,5.775,16.819,4.991,17.068,4.192,17.281,3.378,17.457,2.551,17.596,1.712,17.696,0.861,17.757,0.0,17.778,-0.861,17.757,-1.712,17.696,-2.551,17.596,-3.378,17.457,-4.192,17.281,-4.991,17.068,-5.775,16.819,-6.542,16.535,-7.293,16.218,-8.026,15.867,-8.739,15.485,-9.433,15.072,-10.106,14.628,-10.757,14.155,-11.386,13.654,-11.99,13.126,-12.571,12.571,-13.126,11.99,-13.654,11.386,-14.155,10.757,-14.628,10.106,-15.072,9.433,-15.485,8.739,-15.867,8.026,-16.218,7.293,-16.535,6.542,-16.819,5.775,-17.068,4.991,-17.281,4.192,-17.457,3.378,-17.596,2.551,-17.696,1.712,-17.757,0.861]],"sgn":1,"T":3.4},"recess":{"c":[[-13.039,0.0,-13.022,-0.671,-12.971,-1.333,-12.888,-1.985,-12.774,-2.627,-12.628,-3.258,-12.453,-3.877,-12.248,-4.482,-12.014,-5.074,-11.753,-5.652,-11.465,-6.214,-11.151,-6.76,-10.812,-7.289,-10.449,-7.8,-10.062,-8.293,-9.652,-8.766,-9.22,-9.218,-8.767,-9.65,-8.294,-10.06,-7.802,-10.447,-7.291,-10.81,-6.762,-11.149,-6.216,-11.463,-5.654,-11.751,-5.076,-12.012,-4.484,-12.246,-3.879,-12.451,-3.26,-12.626,-2.629,-12.772,-1.987,-12.887,-1.335,-12.97,-0.673,-13.02,-0.002,-13.037,0.669,-13.02,1.331,-12.97,1.984,-12.887,2.626,-12.772,3.256,-12.626,3.875,-12.451,4.481,-12.246,5.073,-12.012,5.65,-11.751,6.213,-11.463,6.758,-11.149,7.287,-10.81,7.799,-10.447,8.291,-10.06,8.764,-9.65,9.217,-9.218,9.649,-8.766,10.058,-8.293,10.445,-7.8,10.809,-7.289,11.148,-6.76,11.462,-6.214,11.75,-5.652,12.011,-5.074,12.244,-4.482,12.449,-3.877,12.625,-3.258,12.77,-2.627,12.885,-1.985,12.968,-1.333,13.018,-0.671,13.035,0.0,13.018,0.671,12.968,1.333,12.885,1.986,12.77,2.628,12.625,3.258,12.449,3.877,12.244,4.483,12.011,5.075,11.75,5.652,11.462,6.214,11.148,6.76,10.809,7.289,10.445,7.8,10.058,8.293,9.649,8.766,9.217,9.219,8.764,9.65,8.291,10.06,7.799,10.447,7.287,10.811,6.758,11.15,6.213,11.464,5.65,11.752,5.073,12.013,4.481,12.246,3.875,12.451,3.256,12.627,2.626,12.772,1.984,12.887,1.331,12.97,0.669,13.02,-0.002,13.037,-0.673,13.02,-1.335,12.97,-1.987,12.887,-2.629,12.772,-3.26,12.627,-3.879,12.451,-4.484,12.246,-5.076,12.013,-5.654,11.752,-6.216,11.464,-6.762,11.15,-7.291,10.811,-7.802,10.447,-8.294,10.06,-8.767,9.65,-9.22,9.219,-9.652,8.766,-10.062,8.293,-10.449,7.8,-10.812,7.289,-11.151,6.76,-11.465,6.214,-11.753,5.652,-12.014,5.075,-12.248,4.483,-12.453,3.877,-12.628,3.258,-12.774,2.628,-12.888,1.986,-12.971,1.333,-13.022,0.671]],"sgn":1,"depth":1.201},"parts":[{"c":[[-2.942,8.292,-3.411,8.248,-3.804,8.116,-4.121,7.896,-4.339,7.578,-4.47,7.182,-4.514,6.709,-4.514,0.007,-5.619,0.007,-6.123,-0.057,-6.503,-0.249,-6.724,-0.581,-6.798,-1.017,-6.724,-1.448,-6.503,-1.762,-6.123,-1.971,-5.619,-2.041,-4.514,-2.041,-4.514,-3.623,-5.619,-3.623,-6.123,-3.687,-6.503,-3.879,-6.724,-4.211,-6.798,-4.647,-6.724,-5.078,-6.503,-5.392,-6.123,-5.601,-5.619,-5.671,-4.514,-5.671,-4.514,-6.812,-4.47,-7.254,-4.339,-7.618,-4.121,-7.905,-3.804,-8.125,-3.411,-8.257,-2.942,-8.301,-0.191,-8.301,0.28,-8.29,0.732,-8.256,1.167,-8.2,1.584,-8.121,1.984,-8.019,2.366,-7.895,2.73,-7.749,3.076,-7.58,3.452,-7.356,3.797,-7.094,4.111,-6.795,4.395,-6.458,4.647,-6.083,4.869,-5.671,6.245,-5.671,6.742,-5.601,7.105,-5.392,7.344,-5.078,7.424,-4.647,7.344,-4.211,7.105,-3.879,6.742,-3.687,6.245,-3.623,5.438,-3.623,5.472,-3.236,5.484,-2.832,5.469,-2.431,5.424,-2.041,6.245,-2.041,6.742,-1.971,7.105,-1.762,7.344,-1.448,7.424,-1.017,7.344,-0.581,7.105,-0.249,6.742,-0.057,6.245,0.007,4.824,0.007,4.608,0.414,4.36,0.785,4.08,1.121,3.769,1.421,3.426,1.686,3.052,1.915,2.7,2.084,2.333,2.231,1.951,2.355,1.553,2.456,1.14,2.535,0.712,2.592,0.269,2.625,-0.191,2.637,-1.37,2.637,-1.37,6.709,-1.413,7.182,-1.544,7.578,-1.763,7.896,-2.068,8.116,-2.461,8.248],[-1.37,0.123,0.055,0.123,0.632,0.083,1.136,-0.04,1.59,-0.249,1.971,-0.552,2.272,-0.953,2.487,-1.459,2.596,-1.87,2.662,-2.328,2.683,-2.832,2.663,-3.341,2.604,-3.798,2.504,-4.202,2.364,-4.554,2.121,-4.947,1.818,-5.258,1.455,-5.485,1.049,-5.653,0.582,-5.754,0.055,-5.788,-1.37,-5.788]],"sgn":1,"holes":[1],"pc":[0.313,-0.005]}],"gc":[0.313,-0.005],"glyphH":1.201,"cast":"#442339","castOff":[-5.223,2.109],"rim":0.67,"zt":-5.0};

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

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible;transform:translate3d(0,0,0)"><defs><clipPath id="__P__ticket"><path d="M17.2661 21.3038C17.7164 23.4222 19.7983 24.7749 21.9168 24.3247C23.9689 23.8885 25.3026 21.9204 24.9748 19.8719L24.9375 19.6732L57.5431 12.7426C61.7801 11.842 65.9447 14.5474 66.8453 18.7844L72.5525 45.6347C73.4531 49.8717 70.7489 54.0371 66.5119 54.9377L33.9044 61.8686L33.9042 61.8676C33.4539 59.7493 31.372 58.3965 29.2536 58.8467C27.1352 59.297 25.7826 61.3798 26.2328 63.4982L26.2331 63.4992L16.6455 65.5371C12.4087 66.4376 8.24429 63.733 7.34349 59.4963L1.63607 32.645C0.735479 28.4081 3.43972 24.2427 7.67665 23.3421L17.2661 21.3038Z"/></clipPath></defs><g data-n="coupon"><path d="M17.2661 21.3038C17.7164 23.4222 19.7983 24.7749 21.9168 24.3247C23.9689 23.8885 25.3026 21.9204 24.9748 19.8719L24.9375 19.6732L57.5431 12.7426C61.7801 11.842 65.9447 14.5474 66.8453 18.7844L72.5525 45.6347C73.4531 49.8717 70.7489 54.0371 66.5119 54.9377L33.9044 61.8686L33.9042 61.8676C33.4539 59.7493 31.372 58.3965 29.2536 58.8467C27.1352 59.297 25.7826 61.3798 26.2328 63.4982L26.2331 63.4992L16.6455 65.5371C12.4087 66.4376 8.24429 63.733 7.34349 59.4963L1.63607 32.645C0.735479 28.4081 3.43972 24.2427 7.67665 23.3421L17.2661 21.3038Z" fill="#FFC7EC"/><g opacity="0.6"><circle data-n="dot" cx="22.8123" cy="28.5433" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="23.9201" cy="33.7605" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="25.0295" cy="38.9761" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="26.1373" cy="44.1933" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="27.2482" cy="49.4105" r="1.37255" fill="#FF96DD"/><circle data-n="dot" cx="28.356" cy="54.6273" r="1.37255" fill="#FF96DD"/></g><g transform="rotate(-12 9.71484 32.9311)"><rect data-n="stub" x="9.71484" y="32.9311" width="5.88235" height="23.5294" rx="2.94118" fill="#FF96DD"/></g><g transform="rotate(-12 32.7258 28.0393)"><rect data-n="line1" x="32.7258" y="28.0393" width="27.451" height="5.88235" rx="2.94118" fill="#FF96DD"/></g><g transform="rotate(-12 34.7648 37.6279)"><rect data-n="line2" x="34.7648" y="37.6279" width="15.6863" height="5.88235" rx="2.94118" fill="#FF96DD"/></g><g clip-path="url(#__P__ticket)"><g data-n="shadeMove"><g data-n="shadeHop"><g data-n="shadeTurn"></g></g></g></g></g><g data-n="badge"><g data-n="spin"><g data-n="relief"></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createCouponAmount(container, { autoplay = true } = {}) {
  const prefix = "coupon-amount-" + ++count + "-";
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
    // the coin: turns about its vertical axis, through its middle (halfway between the faces) so it stays in place;
    // the face that looks at us is drawn with its own ₱ the right way round
    const R = liveState({ turn: -360 }, (v) => {
      const t = (v.turn * Math.PI) / 180, s = Math.sin(t), c = Math.cos(t);
      render({ o: [BADGE_X + (s * THICK) / 2, BADGE_Y, (-THICK + c * THICK) / 2], u: [c, 0, -s], v: [0, 1, 0], n: [s, 0, c] },
        { gs: 1, parts: [{ s: 1, dx: 0, dy: 0 }] });
    });
    tl.to(R, { turn: 0, duration: 0.8, ease: E.out }, 0.42); // it spins in as it pops on

    // ---- loop (loop → end, seamless: everything is back where it started) ----
    // the ticket floats, the badge (and its shadow) float a beat later
    tl.to(C, { y: -1.5, rotation: -1.2, duration: 1.2, ease: E.io }, L);
    tl.to(C, { y: 0, rotation: 0, duration: 1.2, ease: E.io }, L + 1.2);
    tl.to([B, SM], { y: -2, duration: 1.3, ease: E.io }, L);
    tl.to([B, SM], { y: 0, duration: 1.1, ease: E.io }, L + 1.3);
    // the coin turns one full circle with a small hop; its shadow on the ticket hops and turns with it
    tl.to(R, { turn: 360, duration: 1.0, ease: E.io }, L + 0.45);
    tl.set(R, { turn: 0 }, L + 1.5);
    const hop = [S, $("shadeHop")];
    tl.to(hop, { y: -5, duration: 0.45, ease: E.out }, L + 0.45);
    tl.to(hop, { y: 0, duration: 0.55, ease: E.io }, L + 0.9);

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
