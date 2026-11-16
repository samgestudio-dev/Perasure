// coupon-credit-limit.js — PeraSure coupon icon "Credit limit increase", animated in GSAP.
// Art: Figma file 5nVoWWFTfqPDWrABYG6BsW, node 1:90. The ticket is Figma's SVG as drawn. The badge is drawn as a
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
const BADGE_X = 62.334, BADGE_Y = 55.556, THICK = 3.4; // badge centre (Figma) and thickness
const BADGE = BADGE_X + " " + BADGE_Y;
const SPEC = {"body":{"c":[[-17.778,0.0,-17.757,-0.861,-17.696,-1.712,-17.596,-2.551,-17.457,-3.378,-17.281,-4.192,-17.068,-4.991,-16.819,-5.775,-16.535,-6.542,-16.218,-7.293,-15.867,-8.026,-15.485,-8.739,-15.072,-9.433,-14.628,-10.106,-14.155,-10.757,-13.654,-11.386,-13.126,-11.99,-12.571,-12.571,-11.99,-13.126,-11.386,-13.654,-10.757,-14.155,-10.106,-14.628,-9.433,-15.072,-8.739,-15.485,-8.026,-15.867,-7.293,-16.218,-6.542,-16.535,-5.775,-16.819,-4.991,-17.068,-4.192,-17.281,-3.378,-17.457,-2.551,-17.596,-1.712,-17.696,-0.861,-17.757,0.0,-17.778,0.861,-17.757,1.712,-17.696,2.551,-17.596,3.378,-17.457,4.192,-17.281,4.991,-17.068,5.775,-16.819,6.542,-16.535,7.293,-16.218,8.026,-15.867,8.739,-15.485,9.433,-15.072,10.106,-14.628,10.757,-14.155,11.386,-13.654,11.99,-13.126,12.571,-12.571,13.126,-11.99,13.654,-11.386,14.155,-10.757,14.628,-10.106,15.072,-9.433,15.485,-8.739,15.867,-8.026,16.218,-7.293,16.535,-6.542,16.819,-5.775,17.068,-4.991,17.281,-4.192,17.457,-3.378,17.596,-2.551,17.696,-1.712,17.757,-0.861,17.778,0.0,17.757,0.861,17.696,1.712,17.596,2.551,17.457,3.378,17.281,4.192,17.068,4.991,16.819,5.775,16.535,6.542,16.218,7.293,15.867,8.026,15.485,8.739,15.072,9.433,14.628,10.106,14.155,10.757,13.654,11.386,13.126,11.99,12.571,12.571,11.99,13.126,11.386,13.654,10.757,14.155,10.106,14.628,9.433,15.072,8.739,15.485,8.026,15.867,7.293,16.218,6.542,16.535,5.775,16.819,4.991,17.068,4.192,17.281,3.378,17.457,2.551,17.596,1.712,17.696,0.861,17.757,0.0,17.778,-0.861,17.757,-1.712,17.696,-2.551,17.596,-3.378,17.457,-4.192,17.281,-4.991,17.068,-5.775,16.819,-6.542,16.535,-7.293,16.218,-8.026,15.867,-8.739,15.485,-9.433,15.072,-10.106,14.628,-10.757,14.155,-11.386,13.654,-11.99,13.126,-12.571,12.571,-13.126,11.99,-13.654,11.386,-14.155,10.757,-14.628,10.106,-15.072,9.433,-15.485,8.739,-15.867,8.026,-16.218,7.293,-16.535,6.542,-16.819,5.775,-17.068,4.991,-17.281,4.192,-17.457,3.378,-17.596,2.551,-17.696,1.712,-17.757,0.861]],"sgn":1,"T":3.4},"recess":{"c":[[-13.034,-0.0,-13.017,-0.671,-12.966,-1.333,-12.884,-1.986,-12.769,-2.628,-12.623,-3.258,-12.448,-3.877,-12.243,-4.483,-12.009,-5.075,-11.748,-5.652,-11.46,-6.214,-11.146,-6.76,-10.807,-7.289,-10.444,-7.8,-10.057,-8.293,-9.647,-8.766,-9.215,-9.219,-8.763,-9.65,-8.29,-10.06,-7.797,-10.447,-7.286,-10.811,-6.757,-11.15,-6.211,-11.464,-5.649,-11.752,-5.071,-12.013,-4.479,-12.246,-3.874,-12.451,-3.255,-12.627,-2.624,-12.772,-1.982,-12.887,-1.33,-12.97,-0.668,-13.02,0.003,-13.037,0.674,-13.02,1.336,-12.97,1.989,-12.887,2.631,-12.772,3.261,-12.627,3.88,-12.451,4.486,-12.246,5.078,-12.013,5.655,-11.752,6.217,-11.464,6.763,-11.15,7.292,-10.811,7.803,-10.447,8.296,-10.06,8.769,-9.65,9.222,-9.219,9.653,-8.766,10.063,-8.293,10.45,-7.8,10.814,-7.289,11.153,-6.76,11.467,-6.214,11.755,-5.652,12.016,-5.075,12.249,-4.483,12.454,-3.877,12.63,-3.258,12.775,-2.628,12.89,-1.986,12.973,-1.333,13.023,-0.671,13.04,-0.0,13.023,0.671,12.973,1.333,12.89,1.985,12.775,2.627,12.63,3.258,12.454,3.877,12.249,4.482,12.016,5.074,11.755,5.652,11.467,6.214,11.153,6.76,10.814,7.289,10.45,7.8,10.063,8.293,9.653,8.766,9.222,9.218,8.769,9.65,8.296,10.06,7.803,10.447,7.292,10.81,6.763,11.149,6.217,11.463,5.655,11.751,5.078,12.012,4.486,12.246,3.88,12.451,3.261,12.626,2.631,12.772,1.989,12.887,1.336,12.97,0.674,13.02,0.003,13.037,-0.668,13.02,-1.33,12.97,-1.982,12.887,-2.624,12.772,-3.255,12.626,-3.874,12.451,-4.479,12.246,-5.071,12.012,-5.649,11.751,-6.211,11.463,-6.757,11.149,-7.286,10.81,-7.797,10.447,-8.29,10.06,-8.763,9.65,-9.215,9.218,-9.647,8.766,-10.057,8.293,-10.444,7.8,-10.807,7.289,-11.146,6.76,-11.46,6.214,-11.748,5.652,-12.009,5.074,-12.243,4.482,-12.448,3.877,-12.623,3.258,-12.769,2.627,-12.884,1.985,-12.966,1.333,-13.017,0.671]],"sgn":1,"depth":1.201},"parts":[{"c":[[-1.527,7.055,-1.527,-3.292,-4.449,-0.224,-4.801,0.084,-5.157,0.273,-5.515,0.342,-5.877,0.291,-6.241,0.12,-6.609,-0.172,-6.917,-0.524,-7.106,-0.88,-7.175,-1.238,-7.124,-1.6,-6.952,-1.964,-6.661,-2.332,-1.106,-8.165,-0.753,-8.474,-0.397,-8.663,-0.039,-8.731,0.323,-8.68,0.687,-8.509,1.054,-8.218,1.081,-8.192,1.107,-8.165,6.663,-2.332,6.954,-1.964,7.125,-1.6,7.176,-1.238,7.107,-0.88,6.919,-0.524,6.61,-0.172,6.243,0.12,5.878,0.291,5.517,0.342,5.158,0.273,4.803,0.084,4.45,-0.224,1.528,-3.292,1.528,7.055,1.486,7.522,1.359,7.904,1.147,8.201,0.849,8.413,0.468,8.541,0.001,8.583,-0.466,8.541,-0.848,8.413,-1.145,8.201,-1.357,7.904,-1.485,7.522]],"sgn":1,"holes":[],"pc":[0.001,-0.074]}],"gc":[0.001,-0.074],"glyphH":1.201,"cast":"#243B36","castOff":[-5.223,2.109],"rim":0.67,"zt":-5.0};

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

const MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible;transform:translate3d(0,0,0)"><defs><clipPath id="__P__ticket"><path d="M57.5435 12.7417C61.7805 11.8411 65.9461 14.5462 66.8467 18.7832L72.5539 45.6335C73.4545 49.8705 70.7494 54.0361 66.5124 54.9367L16.646 65.5361C12.409 66.4366 8.24434 63.7313 7.34375 59.4944L1.63654 32.644C0.735952 28.4071 3.44025 24.2418 7.67712 23.3411L57.5435 12.7417Z"/></clipPath></defs><g data-n="coupon"><path d="M57.5435 12.7417C61.7805 11.8411 65.9461 14.5462 66.8467 18.7832L72.5539 45.6335C73.4545 49.8705 70.7494 54.0361 66.5124 54.9367L16.646 65.5361C12.409 66.4366 8.24434 63.7313 7.34375 59.4944L1.63654 32.644C0.735952 28.4071 3.44025 24.2418 7.67712 23.3411L57.5435 12.7417Z" fill="#9FFBE2"/><g transform="rotate(-12 30.8511 27.8484)"><rect data-n="line1" x="30.8511" y="27.8484" width="27.451" height="5.88235" rx="2.94118" fill="#6FB5A7"/></g><g transform="rotate(-12 32.8911 37.4383)"><rect data-n="line2" x="32.8911" y="37.4383" width="15.6863" height="5.88235" rx="2.94118" fill="#6FB5A7"/></g><g transform="rotate(-12 15.0569 57.2657)"><rect data-n="line3" x="15.0569" y="57.2657" width="25.4902" height="3.92157" rx="1.96078" fill="#6FB5A7"/></g><path data-n="print" d="M17.5866 48.7107C17.0389 48.8271 16.5825 48.7648 16.2174 48.5238C15.8661 48.2611 15.6276 47.8338 15.5018 47.242L13.8551 39.495L12.6626 39.7485C12.2563 39.8348 11.9173 39.8038 11.6457 39.6553C11.388 39.4852 11.2191 39.2118 11.139 38.8352C11.059 38.4587 11.104 38.1492 11.2741 37.9069C11.458 37.6429 11.7531 37.4677 12.1594 37.3813L13.3519 37.1278L12.9631 35.2987L11.7706 35.5521C11.3643 35.6385 11.0253 35.6075 10.7538 35.459C10.496 35.2889 10.3271 35.0155 10.2471 34.6389C10.167 34.2623 10.212 33.9529 10.3821 33.7105C10.566 33.4465 10.8612 33.2713 11.2675 33.185L12.46 32.9315L12.1798 31.6134C12.0617 31.0575 12.1134 30.606 12.3351 30.259C12.5706 29.8903 12.9622 29.6478 13.5099 29.5313L16.4779 28.9005C17.8559 28.6076 19.0898 28.6358 20.1796 28.9852C21.2871 29.3308 22.197 30.0933 22.9093 31.2727L22.0265 30.8981L24.067 30.4643C24.4733 30.378 24.8054 30.4199 25.0631 30.59C25.3347 30.7384 25.5105 31.001 25.5906 31.3776C25.6706 31.7542 25.6187 32.0745 25.4347 32.3385C25.2647 32.5808 24.9765 32.7451 24.5701 32.8315L23.2981 33.1019L23.5569 32.6252C23.7152 33.0226 23.8439 33.4544 23.943 33.9207C24.0383 34.369 24.0857 34.8088 24.085 35.24L23.6869 34.931L24.9589 34.6607C25.3653 34.5743 25.6973 34.6162 25.9551 34.7863C26.2267 34.9348 26.4025 35.1973 26.4825 35.5739C26.5626 35.9505 26.5106 36.2708 26.3267 36.5348C26.1566 36.7771 25.8684 36.9415 25.4621 37.0278L23.4481 37.4559L24.0227 36.7715C23.8656 38.1169 23.3533 39.1817 22.4859 39.9659C21.6148 40.7321 20.5079 41.2579 19.1652 41.5433L17.8932 41.8136L18.8938 46.5211C19.0196 47.1128 18.9754 47.6002 18.7614 47.9831C18.5435 48.348 18.1519 48.5905 17.5866 48.7107ZM17.2757 38.9085L18.8127 38.5818C19.2544 38.4879 19.6297 38.3425 19.9387 38.1456C20.2653 37.945 20.5237 37.6839 20.7139 37.3623C20.904 37.0408 21.0152 36.6517 21.0474 36.195C21.0934 35.7166 21.0516 35.1726 20.922 34.5628C20.7467 33.7379 20.4908 33.0988 20.1544 32.6455C19.818 32.1922 19.415 31.903 18.9452 31.7779C18.4893 31.6312 17.9611 31.6216 17.3604 31.7493L15.8234 32.076L17.2757 38.9085Z" fill="#417F73"/><g clip-path="url(#__P__ticket)"><g data-n="shadeMove"><g data-n="shadeHop"><g data-n="shadeTurn"></g></g></g></g></g><g data-n="badge"><g data-n="spin"><g data-n="relief"></g></g></g></svg>`;
let count = 0;

/**
 * Renders the animation into `container` and returns its controls.
 * @param {Element} container
 * @param {{ autoplay?: boolean }} [options]
 */
export function createCouponCreditLimit(container, { autoplay = true } = {}) {
  const prefix = "coupon-credit-limit-" + ++count + "-";
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
    // printed peso sign and text lines fill in
    gsap.set($("print"), { transformOrigin: "50% 50%", scale: 0.3, autoAlpha: 0 });
    tl.to($("print"), { autoAlpha: 1, duration: 0.12, ease: "none" }, 0.24);
    tl.to($("print"), { scale: 1, duration: 0.36, ease: E.out }, 0.24);
    gsap.set([$("line1"), $("line2"), $("line3")], { transformOrigin: "0% 50%", scaleX: 0 });
    tl.to($("line1"), { scaleX: 1, duration: 0.36, ease: E.out }, 0.3);
    tl.to($("line2"), { scaleX: 1, duration: 0.36, ease: E.out }, 0.38);
    tl.to($("line3"), { scaleX: 1, duration: 0.36, ease: E.out }, 0.46);
    // the badge pops on; its shadow on the ticket grows with it (same centre, same scale)
    const SM = $("shadeMove");
    gsap.set(B, { autoAlpha: 0 });
    gsap.set(SM, { autoAlpha: 0 });
    gsap.set([B, SM], { svgOrigin: BADGE, scale: 0 });
    tl.set([B, SM], { autoAlpha: 1 }, 0.42);
    tl.to([B, SM], { scale: 1.12, duration: 0.28, ease: E.out }, 0.42);
    tl.to([B, SM], { scale: 1, duration: 0.24, ease: E.io }, 0.7);
    gsap.set(S, { svgOrigin: BADGE });
    // the arrow stands in the recess; it rises into view from below the rim
    const R = liveState({ dy: 16 }, (v) => {
      render({ o: [BADGE_X, BADGE_Y, 0], u: [1, 0, 0], v: [0, 1, 0], n: [0, 0, 1] }, { gs: 1, parts: [{ s: 1, dx: 0, dy: v.dy }] });
    });
    tl.to(R, { dy: 0, duration: 0.42, ease: E.out }, 0.56);

    // ---- loop (loop → end, seamless: everything is back where it started) ----
    // the ticket floats, the badge (and its shadow) float a beat later
    tl.to(C, { y: -1.5, rotation: -1.2, duration: 1.2, ease: E.io }, L);
    tl.to(C, { y: 0, rotation: 0, duration: 1.2, ease: E.io }, L + 1.2);
    tl.to([B, SM], { y: -2, duration: 1.3, ease: E.io }, L);
    tl.to([B, SM], { y: 0, duration: 1.1, ease: E.io }, L + 1.3);
    // the arrow shoots up out of the recess and comes back in from below; the badge bumps as it lands
    tl.to(R, { dy: -17, duration: 0.3, ease: E.in }, L + 0.6);
    tl.set(R, { dy: 17 }, L + 0.9);
    tl.to(R, { dy: -1.5, duration: 0.34, ease: E.out }, L + 0.9);
    tl.to(R, { dy: 0, duration: 0.2, ease: E.io }, L + 1.24);
    tl.to(S, { scale: 1.07, duration: 0.18, ease: E.out }, L + 1.1);
    tl.to(S, { scale: 1, duration: 0.3, ease: E.io }, L + 1.28);

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
