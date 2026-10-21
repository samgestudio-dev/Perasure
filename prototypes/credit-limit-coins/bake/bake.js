/* Offline coin simulation for the "baked pile" variant.
   Same scene as the live demo (stacks, 44 eased-out drops, misses), stepped with Matter.js in Node.
   Usage:
     node bake.js sweep            -> quality / cost table for several timestep + iteration settings
     node bake.js bake out.json    -> bake 60 fps transforms with the chosen settings
*/
const M = require('matter-js');   // npm i matter-js@0.19.0

const H = 14, RX = 80, FLOOR = 708, Z_BACK = 44;
const CAT = { floor: 1, front: 2, back: 4 };
const STACK = {
  orange: { x: 250, ground: FLOOR, start: 4, lane: 'front' },
  lime:   { x: 476, ground: FLOOR, start: 5, lane: 'front' },
  teal:   { x: 363, ground: FLOOR - Z_BACK, start: 6, lane: 'back' }
};
const COUNT = { start: .45, dur: 1.85 };
const KICK_T = COUNT.start + COUNT.dur;          // 2.30 s: the amount lands
const END = KICK_T + 1.1;                        // 3.40 s
const FALL = .3;
const PILE_X = 363;                              // where the heap gathers

function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
const DROPS = (() => {
  const r = rng(20261021), out = [], N = 44;
  const order = ['lime', 'orange', 'teal', 'orange', 'lime', 'teal', 'lime', 'orange'];
  const missAt = { 5: -1, 11: 1, 17: -1, 24: 1, 31: -1, 38: 1 };
  for (let i = 0; i < N; i++) {
    const u = (i + 1) / N;
    const at = COUNT.start + .08 + (COUNT.dur - .08) * (1 - Math.sqrt(1 - u));
    const kind = order[i % order.length];
    const m = missAt[i] && kind !== 'teal' ? missAt[i] : 0;
    const off = m ? m * (64 + r() * 26) : (r() - .5) * 16;
    out.push({ at, kind, off, miss: !!m, spin: (r() - .5) });
  }
  return out;
})();

function simulate(opts) {
  const { dt, posIt, velIt, record, gather } = opts;
  const BODY = { friction: .7, frictionStatic: 1.6, frictionAir: .003, restitution: .04, density: .006, slop: .01, chamfer: { radius: 2 } };
  const engine = M.Engine.create({ positionIterations: posIt, velocityIterations: velIt, enableSleeping: true });
  engine.gravity.y = 3.4;
  const fl = { isStatic: true, friction: .9 };
  M.Composite.add(engine.world, [
    M.Bodies.rectangle(363, FLOOR + 50, 3000, 100, { ...fl, collisionFilter: { category: CAT.floor, mask: CAT.front } }),
    M.Bodies.rectangle(363, FLOOR - Z_BACK + 50, 3000, 100, { ...fl, collisionFilter: { category: CAT.floor, mask: CAT.back } }),
    M.Bodies.rectangle(-70, 300, 100, 1600, { ...fl, collisionFilter: { category: CAT.floor, mask: 0xFFFF } }),
    M.Bodies.rectangle(796, 300, 100, 1600, { ...fl, collisionFilter: { category: CAT.floor, mask: 0xFFFF } })
  ]);
  const coins = [];
  const make = (kind, x, y) => {
    const lane = STACK[kind].lane;
    const b = M.Bodies.rectangle(x, y + H / 2, RX * 2, H, { ...BODY, collisionFilter: { category: CAT[lane], mask: CAT.floor | CAT[lane] } });
    const c = { kind, lane, body: b, live: false };
    b.__c = c; return c;
  };
  const jit = [0, 2, -2, 1, -1, 2];
  for (const k of ['teal', 'orange', 'lime']) {
    const S = STACK[k];
    for (let i = 0; i < S.start; i++) {
      const c = make(k, S.x + jit[i], S.ground - (i + 1) * H);
      c.live = true; c.spawnT = 0; M.Composite.add(engine.world, c.body); M.Sleeping.set(c.body, true); coins.push(c);
    }
  }
  const g = engine.gravity.y * 1000;
  DROPS.forEach((d, i) => {
    const S = STACK[d.kind], c = make(d.kind, 0, -400);
    c.drop = d; c.spawnT = d.at - FALL;
    const vx = d.miss ? (d.off > 0 ? 110 : -110) : (d.kind === 'orange' ? 50 : d.kind === 'lime' ? -25 : 0);
    c.sx = S.x + d.off - vx * FALL; c.sy = 300 - .5 * g * FALL * FALL;
    /* the live demo applied these per step at 240 Hz, i.e. a quarter of the nominal value per second — keep that look */
    c.vx = vx / 4; c.ang = d.miss ? (d.off > 0 ? .25 : -.25) : d.spin * .08; c.av = (d.miss ? (d.off > 0 ? 2 : -2) : d.spin * .6) / 4;
    coins.push(c);
  });

  let t = 0, kicked = false, pen = 0, penN = 0, nextFrame = 0;
  const FPS = 60, frames = [];
  const kr = rng(7);
  const t0 = process.hrtime.bigint();
  while (t <= END + 1e-9) {
    for (const c of coins) {
      if (!c.live && c.drop && t >= c.spawnT) {
        c.live = true;
        M.Body.setPosition(c.body, { x: c.sx, y: c.sy }); M.Body.setAngle(c.body, c.ang);
        M.Composite.add(engine.world, c.body);
        M.Body.setVelocity(c.body, { x: c.vx / 60, y: 0 }); M.Body.setAngularVelocity(c.body, c.av / 60);
      }
    }
    if (!kicked && t >= KICK_T) {
      kicked = true;
      const live = coins.filter(c => c.live);
      if (gather) {
        /* softer, grippier landings while the heap forms, so the tall middle stays standing */
        engine.gravity.y = 2.2;
        for (const c of coins) { c.body.friction = 1; c.body.frictionStatic = 4; }
        gatherKick(live, kr, engine.gravity.y * 1000);
      }
      else for (const c of live) {
        M.Sleeping.set(c.body, false);
        const p = c.body.position, h = Math.max(0, (FLOOR - p.y) / 280);
        M.Body.setVelocity(c.body, { x: (kr() - .5) * (60 + 420 * h * h) / 60, y: -(420 + kr() * 260) / 60 });
        M.Body.setAngularVelocity(c.body, (kr() - .5) * (2 + 9 * h) / 60);
      }
    }
    M.Engine.update(engine, dt * 1000);
    t += dt;
    /* quality: how deep bodies sink into each other (lower is better) */
    for (const pair of engine.pairs.list) if (pair.isActive && pair.collision && pair.collision.depth) { pen += pair.collision.depth; penN++; }
    if (record && t >= nextFrame - 1e-9) {
      frames.push(coins.map(c => c.live ? [+c.body.position.x.toFixed(2), +c.body.position.y.toFixed(2), +c.body.angle.toFixed(4)] : 0));
      nextFrame += 1 / FPS;
    }
  }
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  /* resting jitter at the end: mean speed of coins that should be still (units / s) */
  let sp = 0; for (const c of coins) sp += c.body.speed * 60; sp /= coins.length;
  return { ms, pen: pen / Math.max(1, penN), jitter: sp, frames, coins };
}


/* ---- the landing kick that shakes everything into one loose heap ----
   Target heap (front row): a tall middle column, two lower side columns, two coins leaning on each outer side.
   The back row piles into one column behind the middle, peeking over it as the tip.
   Every coin is thrown on a ballistic arc timed to land on its slot from the bottom up; the physics engine
   still does the landing, so contacts, nudges and small slides stay real. Jitter keeps it from looking built. */
function heapTargets(nFront, nBack, r) {
  const front = [], back = [];
  const col = (x, n, base, wob) => { for (let k = 0; k < n; k++) front.push({ x: x + (r() - .5) * (4 + wob * k), y: base - k * H - H / 2, a: (r() - .5) * .06, rank: k }); };
  let side = 8, mid = nFront - 4 - 2 * side;          /* 22 in the middle, 8 a side: a clear peak */
  col(363, mid, FLOOR, .9);
  col(203, side, FLOOR, 1.6);
  col(523, side, FLOOR, 1.6);
  const hSide = side * H;
  /* leaners: one from the floor against each side column, one more resting on it */
  [[-1, 203], [1, 523]].forEach(([sgn, cx]) => {
    const footX = cx + sgn * (80 + 92), topX = cx + sgn * 80, topY = FLOOR - hSide + 6;
    const ang = Math.atan2(topY - FLOOR, topX - footX);           // along the slope
    const a1 = sgn < 0 ? ang : ang - Math.PI;
    front.push({ x: (footX + topX) / 2, y: (FLOOR + topY) / 2 - 6, a: a1 + (r() - .5) * .08, rank: side + 1 });
    front.push({ x: (footX + topX) / 2 + sgn * 6, y: (FLOOR + topY) / 2 - 22, a: a1 * .85 + (r() - .5) * .1, rank: side + 3 });
  });
  /* back row: two short piles behind the shoulders, filling the slope between the side columns and the peak */
  const nl = Math.ceil(nBack / 2);
  for (let k = 0; k < nBack; k++) {
    const left = k < nl, kk = left ? k : k - nl;
    back.push({ x: (left ? 286 : 440) + (r() - .5) * (4 + 1.5 * kk), y: FLOOR - Z_BACK - kk * H - H / 2, a: (r() - .5) * .07, rank: kk });
  }
  return { front, back };
}
function gatherKick(live, r, g) {
  const fr = live.filter(c => c.lane === 'front'), bk = live.filter(c => c.lane === 'back');
  const T = heapTargets(fr.length, bk.length, r);
  const assign = (cs, ts) => {
    ts = ts.slice().sort((p, q) => p.rank - q.rank || p.y - q.y);
    const left = cs.slice();
    for (const tg of ts) {
      let best = 0, bd = 1e9;
      left.forEach((c, i) => { const p = c.body.position; const d = Math.abs(p.x - tg.x) + .6 * Math.abs(p.y - tg.y); if (d < bd) { bd = d; best = i; } });
      const c = left.splice(best, 1)[0];
      const p = c.body.position;
      const fly = .24 + .028 * tg.rank + r() * .025;               // lower slots land first
      const ty = tg.y - 3;                                           // arrive a hair above the slot and settle in
      const vx = (tg.x - p.x) / fly, vy = (ty - p.y - .5 * g * fly * fly) / fly;
      M.Sleeping.set(c.body, false);
      M.Body.setVelocity(c.body, { x: vx / 60, y: vy / 60 });
      let da = tg.a - c.body.angle; da = Math.atan2(Math.sin(da), Math.cos(da));
      M.Body.setAngularVelocity(c.body, da / fly / 60);
    }
  };
  assign(fr, T.front); assign(bk, T.back);
}

const mode = process.argv[2];
if (mode === 'sweep') {
  const rows = [];
  for (const hz of [120, 240, 480, 960, 1920]) for (const [p, v] of [[10, 8], [20, 14], [32, 24], [48, 36]]) {
    const r = simulate({ dt: 1 / hz, posIt: p, velIt: v, gather: true });
    rows.push({ hz, it: p + '/' + v, ms: Math.round(r.ms), pen: +r.pen.toFixed(4), jitter: +r.jitter.toFixed(2) });
  }
  console.table(rows);
} else if (mode === 'bake') {
  const hz = +(process.argv[4] || 480), p = +(process.argv[5] || 32), v = +(process.argv[6] || 24);
  const r = simulate({ dt: 1 / hz, posIt: p, velIt: v, record: true, gather: true });
  const out = { fps: 60, end: END, kickT: KICK_T, hz, iterations: [p, v],
    coins: r.coins.map((c, i) => ({ kind: c.kind, lane: c.lane, spawn: +(c.spawnT || 0).toFixed(4) })),
    frames: r.frames };
  require('fs').writeFileSync(process.argv[3], JSON.stringify(out));
  console.log('baked', r.frames.length, 'frames,', r.coins.length, 'coins,', Math.round(r.ms), 'ms, pen', r.pen.toFixed(4), 'jitter', r.jitter.toFixed(2));
}
