/* Bake the Physics tuner's own live simulation (same code, same seeds) with a given set of model values.
   node record-tuner.js '<Tune panel values, from its Copy button>' out.json [sleep=1]
   e.g. node physics-tuner/record-tuner.js '<values>' baked/baked.json  (from the credit-limit-coins folder) —
   the deliverable (baked/baked-heap.html) loads baked/baked.json, so nothing needs pasting. */
const fs = require('fs');
const D = __dirname + '/';
/* the physics code is read from the Physics tuner (physics-tuner.html in this folder) */
const src = fs.readFileSync(D + 'physics-tuner.html', 'utf8');
const a = src.indexOf('var M = Matter;'), b = src.indexOf('var FACE_TILT');
let phys = src.slice(a, b);
const sleep = process.argv[4] !== '0';
if (!sleep) phys = phys.replace('enableSleeping:true', 'enableSleeping:false');
const Matter = require('matter-js');   // npm i matter-js@0.19.0
const harness = `
var H = 14, RX = 80, RY = 21, FLOOR = 708, Z_BACK = 44, LANES = {};
${phys}
TUNE = Object.assign({}, MODEL, ARGS);
KICK_T = COUNT.start + COUNT.dur;
var END = KICK_T + 1.1, frames = [], t = 0, still = 0;
reset();
while (true) {
  simTo(t);
  frames.push(coins.map(function(c){ return c.live ? [+c.body.position.x.toFixed(2), +c.body.position.y.toFixed(2), +c.body.angle.toFixed(4)] : 0; }));
  if (t > END) {
    var rest = coins.every(function(c){ return !c.live || (c.body.speed < .02 && Math.abs(c.body.angularVelocity) < .0005) || c.body.isSleeping; });
    still = rest ? still + 1 : 0;
    if (still >= 6 || t > END + 3) break;
  }
  t += 1 / 60;
}
RESULT = { fps:60, end:+(t).toFixed(4), done:END, kickT:KICK_T, model:TUNE, sleeping:${sleep},
  coins:coins.map(function(c){ return { kind:c.kind, lane:c.lane, spawn:+(c.spawnT || 0).toFixed(4) }; }), frames:frames };
`;
/* same realm as Matter (a vm sandbox breaks Matter's collision detection) */
const R = new Function('Matter', 'ARGS', 'var RESULT;' + harness + '; return RESULT;')(Matter, JSON.parse(process.argv[2] || '{}'));
/* report: floating coins (asleep in mid-air), tilt at rest, how many knocked off, how far they went */
const L = R.frames[R.frames.length - 1], SX = { orange:250, lime:476, teal:363 };
const tilt = a => { a = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))); return Math.min(a, Math.PI - a) * 57.3; };
const xs = L.filter(Boolean).map(f => f[0]);
console.log(JSON.stringify({ frames:R.frames.length, end:R.end, knocked:L.filter((f, j) => f && Math.abs(f[0] - SX[R.coins[j].kind]) > 100).length,
  onScreen:L.filter(f => f && f[0] > -80 && f[0] < 806).length, of:L.length, maxEndTilt:Math.max(...L.filter(Boolean).map(f => tilt(f[2]))).toFixed(0),
  minY:Math.min(...R.frames.flat().filter(Boolean).map(f => f[1])).toFixed(0), xRange:[Math.min(...xs).toFixed(0), Math.max(...xs).toFixed(0)] }));
/* ---- clean and pack the recording ----
   1. Tremble: the solver keeps nudging resting and stacked coins by a fraction of a pixel. A coin whose position
      moved less than TREMBLE units (0.2 = about 0.1 CSS px) and whose rim moved less than that by turning, since
      the last kept pose, keeps that pose exactly, so the player sees it as still and skips its shadows and redraw.
      Slow real motion still comes through, in steps too small to see.
   2. Precision: x / y to 0.1 unit, angle to 0.001 rad (invisible at phone size).
   3. Repeats: a pose equal to the same coin's previous frame is written as 1 (0 = not dropped yet).
   The player unpacks this back into full frames when the page loads (enc: 'same1'). */
const TREMBLE = +(process.env.TREMBLE || .2), last = [];
const packed = R.frames.map(fr => fr.map((f, j) => {
  if (!f) return 0;
  const p = last[j];
  if (p && Math.abs(f[0] - p[0]) < TREMBLE && Math.abs(f[1] - p[1]) < TREMBLE && Math.abs(f[2] - p[2]) < TREMBLE / 70) return 1;
  const q = [Math.round(f[0] * 10) / 10, Math.round(f[1] * 10) / 10, Math.round(f[2] * 1000) / 1000];
  if (p && q[0] === p[0] && q[1] === p[1] && q[2] === p[2]) return 1;
  last[j] = q; return q;
}));
R.frames = packed; R.enc = 'same1';
fs.writeFileSync(process.argv[3], JSON.stringify(R));
