/* Bake the Standard page's own live simulation (same code, same seeds) with a given set of model values.
   node record-standard.js '<Tune panel values, from its Copy button>' out.json [sleep=1]
   then paste out.json into strong-knock.html (the var BAKED = ...; line). */
const fs = require('fs');
const D = __dirname + '/';
/* the physics code is read from the Standard page (index.html next to this folder) */
const src = fs.readFileSync(D + '../index.html', 'utf8');
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
fs.writeFileSync(process.argv[3], JSON.stringify(R));
