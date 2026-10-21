/* Offline coin simulation for the "baked pile" variant.
   Same scene as the live demo (stacks, 44 eased-out drops, misses), stepped with Matter.js in Node.
   Usage:
     node bake.js sweep            -> quality / cost table for several timestep + iteration settings
     node bake.js bake out.json    -> bake 60 fps transforms; tries drop / kick seeds until validate() passes
     node bake.js prof             -> pass rate of a few heap / kick settings
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
/* heap shape and kick: coins per foot pile / side column, placement jitter, flight time (base + per layer),
   slot assignment order, end settling (seconds, extra air friction) */
let PROFILE = { foot: 3, side: 9, wob: 2.4, fly0: .18, flyK: .02, topFirst: false, settle: .35, settleAir: .2, ghost: true };

function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
/* the drop schedule (times fixed; offsets, misses' spread and spin from the seed) */
function makeDrops(dropSeed) {
  const r = rng(dropSeed), out = [], N = 44;
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
}

function simulate(opts) {
  const { dt, posIt, velIt, record, gather, seed = 7, dropSeed = 20261021 } = opts;
  const DROPS = makeDrops(dropSeed);
  const BODY = { friction: .7, frictionStatic: 1.6, frictionAir: .003, restitution: .04, density: .006, slop: .01, chamfer: { radius: 2 } };
  /* no sleeping: Matter measures "motion" per step, so at 960 Hz a coin slowing near the top of its arc reads as
     still and was put to sleep in mid-air (a coin floating beside the heap). Offline, the extra cost doesn't matter. */
  const engine = M.Engine.create({ positionIterations: posIt, velocityIterations: velIt, enableSleeping: false });
  engine.gravity.y = 3.4;
  const fl = { isStatic: true, friction: .9 };
  M.Composite.add(engine.world, [
    M.Bodies.rectangle(363, FLOOR + 50, 3000, 100, { ...fl, collisionFilter: { category: CAT.floor, mask: CAT.front } }),
    M.Bodies.rectangle(363, FLOOR - Z_BACK + 50, 3000, 100, { ...fl, collisionFilter: { category: CAT.floor, mask: CAT.back } })
    /* no side walls: the screen edge is not a physical boundary, coins may spill partly off screen */
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
  const kr = rng(seed);
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
    /* a flying coin turns solid again once it is near its slot and not overlapping anything in its row */
    if (kicked && PROFILE.ghost) for (const c of coins) {
      if (!c.ghostFrom || t < c.ghostFrom) continue;
      const others = coins.filter(o => o !== c && o.live && o.lane === c.lane && !o.ghostFrom).map(o => o.body);
      if (t >= c.ghostMax || M.Query.collides(c.body, others).length === 0) {
        c.body.collisionFilter.mask = CAT.floor | CAT[c.lane]; c.ghostFrom = 0;
      }
    }
    /* settling: over the last moments the coins lose energy faster (like heavy coins coming to rest),
       so the heap is still when the recording ends instead of freezing mid-slide */
    if (gather && PROFILE.settle && t > END - PROFILE.settle) {
      const u = Math.min(1, (t - (END - PROFILE.settle)) / PROFILE.settle), fa = .003 + PROFILE.settleAir * u * u * (3 - 2 * u);
      for (const c of coins) c.body.frictionAir = fa;
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
   Target heap (front row): a tall middle column, lower side columns, and short piles at the feet (partly off screen).
   The back row piles into two short columns behind the shoulders.
   Every coin is thrown on a ballistic arc timed to land on its slot from the bottom up; the physics engine
   still does the landing, so contacts, nudges and small slides stay real. Jitter keeps it from looking built.
   A bake is kept only if validate() passes (no tilted resting coins, nothing floating or cantilevered, all still). */
function heapTargets(nFront, nBack, r) {
  const front = [], back = [];
  const col = (x, n, base, wob) => { for (let k = 0; k < n; k++) front.push({ x: x + (r() - .5) * (4 + wob * k), y: base - k * H - H / 2, a: (r() - .5) * .06, rank: k }); };
  /* a stepped mound, all coins lying flat: a tall middle column, lower side columns, and two short piles at
     the feet that may spill partly off screen (the screen edge is not a wall). No coins leaning against the
     columns: a coin standing almost on edge reads as unphysical, and its top face is no longer horizontal,
     so the face shadows can't be drawn correctly on it. */
  const P = PROFILE, foot = P.foot, side = P.side, mid = nFront - 2 * side - 2 * foot;
  col(363, mid, FLOOR, P.wob);
  col(203, side, FLOOR, P.wob * 1.6);
  col(523, side, FLOOR, P.wob * 1.6);
  col(203 - 164, foot, FLOOR, P.wob * 2);
  col(523 + 164, foot, FLOOR, P.wob * 2);
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
    /* top-first: the highest slots take the nearest coins (the tops of the old stacks are already high), and the
       coins lying far out on the floor fill the low slots with a short slide instead of a long throw to the top */
    ts = ts.slice().sort(PROFILE.topFirst ? (p, q) => q.rank - p.rank || q.y - p.y : (p, q) => p.rank - q.rank || p.y - q.y);
    const left = cs.slice();
    for (const tg of ts) {
      let best = 0, bd = 1e9;
      left.forEach((c, i) => { const p = c.body.position; const d = Math.abs(p.x - tg.x) + .6 * Math.abs(p.y - tg.y); if (d < bd) { bd = d; best = i; } });
      const c = left.splice(best, 1)[0];
      const p = c.body.position;
      const fly = PROFILE.fly0 + PROFILE.flyK * tg.rank + r() * .025;              // lower slots land first
      const ty = tg.y - 3;                                           // arrive a hair above the slot and settle in
      const vx = (tg.x - p.x) / fly, vy = (ty - p.y - .5 * g * fly * fly) / fly;
      M.Sleeping.set(c.body, false);
      M.Body.setVelocity(c.body, { x: vx / 60, y: vy / 60 });
      let da = tg.a - c.body.angle; da = Math.atan2(Math.sin(da), Math.cos(da));
      M.Body.setAngularVelocity(c.body, da / fly / 60);
      /* in flight the coins pass by each other (in this 2.5D view they are at slightly different depths anyway);
         each one becomes solid again just before it reaches its slot, so they land on each other, not collide in mid-air */
      if (PROFILE.ghost) { c.ghostFrom = KICK_T + fly * .8; c.ghostMax = KICK_T + fly + .12; c.body.collisionFilter.mask = CAT.floor; }
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
  const hz = +(process.argv[4] || 960), p = +(process.argv[5] || 20), v = +(process.argv[6] || 14);
  /* try drop variations x kick variations until a run passes every check */
  let r, seed, dropSeed, report = { ok: false };
  search: for (dropSeed = 20261021; dropSeed < 20261021 + 60; dropSeed++) for (seed = 7; seed < 10; seed++) {
    r = simulate({ dt: 1 / hz, posIt: p, velIt: v, record: true, gather: true, seed, dropSeed });
    report = validate(r.frames, r.coins);
    if (report.ok) break search;
    console.log('drops', dropSeed, 'kick', seed, 'rejected:', report.why);
  }
  if (!report.ok) { console.error('no seed passed the checks'); process.exit(1); }
  const out = { fps: 60, end: END, kickT: KICK_T, hz, iterations: [p, v], seed, dropSeed, profile: PROFILE,
    coins: r.coins.map((c, i) => ({ kind: c.kind, lane: c.lane, spawn: +(c.spawnT || 0).toFixed(4) })),
    frames: r.frames };
  require('fs').writeFileSync(process.argv[3], JSON.stringify(out));
  console.log('baked', r.frames.length, 'frames,', r.coins.length, 'coins,', Math.round(r.ms), 'ms, pen', r.pen.toFixed(4), 'jitter', r.jitter.toFixed(2), 'seed', seed, 'max resting tilt', report.maxTilt.toFixed(3));
}

/* ---- plausibility checks: a bake that fails one is thrown away and re-simulated with another kick seed ----
   1. No coin may come to rest tilted more than MAX_TILT (about 17 degrees). Coins in a heap lie flat or nearly
      flat; one propped up on its edge looks wrong, and the face shadows assume a near-horizontal top face.
   2. At the end every coin must be at rest (it may lie partly off screen: the edge is not a wall). */
function validate(frames, coins) {
  const MAX_TILT = .3, n = frames.length;
  const tilt = a => { a = Math.abs(Math.atan2(Math.sin(a), Math.cos(a))); return Math.min(a, Math.PI - a); };
  let maxTilt = 0;
  for (let j = 0; j < coins.length; j++) {
    let still = 0;
    for (let i = 1; i < n; i++) {
      const p = frames[i - 1][j], q = frames[i][j];
      if (!p || !q) { still = 0; continue; }
      const resting = Math.hypot(q[0] - p[0], q[1] - p[1]) < .05 && Math.abs(q[2] - p[2]) < .002;
      still = resting ? still + 1 : 0;
      if (still >= 6) {                       /* at rest for a tenth of a second */
        const tl = tilt(q[2]); maxTilt = Math.max(maxTilt, tl);
        if (tl > MAX_TILT) return { ok: false, why: `coin ${j} (${coins[j].kind}) rests at ${(tl * 57.3).toFixed(0)} deg, t=${(i / 60).toFixed(2)}s`, maxTilt };
      }
    }
    const f = frames[n - 1][j], g = frames[n - 4][j];
    if (!f) return { ok: false, why: `coin ${j} never spawned`, maxTilt };
    /* the recording stops on its last frame, so anything still moving visibly would freeze mid-motion.
       1 unit over 3 frames is about 0.15 CSS px per frame on a phone: below what the eye can follow */
    if (Math.hypot(f[0] - g[0], f[1] - g[1]) > 1 || Math.abs(f[2] - g[2]) > .02) return { ok: false, why: `coin ${j} still moving at the end`, maxTilt };
    if (tilt(f[2]) > MAX_TILT) return { ok: false, why: `coin ${j} ends tilted ${(tilt(f[2]) * 57.3).toFixed(0)} deg`, maxTilt };
  }
  /* 3. nothing floats: every coin at the end lies on its floor or on a coin of its own row just below it */
  const last = frames[n - 1];
  for (let j = 0; j < coins.length; j++) {
    const f = last[j], fl = coins[j].lane === 'back' ? FLOOR - Z_BACK : FLOOR;
    const bottom = f[1] + Math.abs(Math.cos(f[2])) * H / 2 + Math.abs(Math.sin(f[2])) * RX;
    if (bottom > fl - 4) continue;
    const under = last.filter((o, k) => k !== j && coins[k].lane === coins[j].lane && Math.abs(o[0] - f[0]) < 2 * RX - 10 && o[1] > f[1] && o[1] - f[1] < H + 30);
    if (!under.length) return { ok: false, why: `coin ${j} floats at (${f[0]}, ${f[1]})`, maxTilt };
    /* 4. no far-out cantilevers: a coin's centre sits between its supports, or within 0.7 of a radius of a single one.
          (The engine can hold a big overhang with friction, but it reads as about to fall.) */
    const xs = under.map(o => o[0]), lo = Math.min(...xs), hi = Math.max(...xs);
    if (f[0] < lo - .7 * RX || f[0] > hi + .7 * RX) return { ok: false, why: `coin ${j} overhangs its support by ${Math.round(Math.max(lo - f[0], f[0] - hi))}`, maxTilt };
  }
  return { ok: true, maxTilt };
}

if (mode === 'prof') {
  const rows = [];
  const base = { foot: 3, side: 9, wob: .6, fly0: .24, flyK: .028, topFirst: false, settle: 0, settleAir: 0 };
  const combos = [];
  for (const topFirst of [false, true]) for (const [fly0, flyK] of [[.24, .028], [.2, .018], [.18, .012]]) for (const settle of [0, .35])
    for (const [foot, side] of [[3, 9], [4, 8]]) combos.push({ ...base, topFirst, fly0, flyK, settle, settleAir: settle ? .2 : 0, foot, side });
  for (const P of combos) {
    PROFILE = P; const { foot, side, wob } = P;
    let ok = 0, worst = 0;
    for (let seed = 7; seed < 11; seed++) {
      const r = simulate({ dt: 1 / 960, posIt: 20, velIt: 14, record: true, gather: true, seed });
      const F = r.frames, n = F.length;
      let mv = 0; F[n - 1].forEach((f, j) => { if (f[0] < -70 || f[0] > 796) return; mv = Math.max(mv, Math.hypot(f[0] - F[n - 4][j][0], f[1] - F[n - 4][j][1])); });
      worst = Math.max(worst, mv); if (validate(F, r.coins).ok) ok++;
    }
    rows.push({ foot, side, mid: 42 - 2 * side - 2 * foot, top: P.topFirst ? 'top' : 'low', fly: P.fly0 + '+' + P.flyK, settle: P.settle, ok, worstEndMove: +worst.toFixed(2) });
  }
  console.table(rows);
}
if (mode === 'diag') {
  for (let seed = 7; seed < 17; seed++) {
    const r = simulate({ dt: 1 / 960, posIt: 20, velIt: 14, record: true, gather: true, seed });
    const F = r.frames, n = F.length; let mv = 0, mj = -1;
    F[n - 1].forEach((f, j) => { const g = F[n - 4][j]; const d = Math.hypot(f[0] - g[0], f[1] - g[1]); if (d > mv) { mv = d; mj = j; } });
    const rep = validate(F, r.coins);
    const movers = F[n - 1].map((f, j) => [j, Math.hypot(f[0] - F[n - 4][j][0], f[1] - F[n - 4][j][1])]).filter(m => m[1] > .3).map(m => m[0] + ':' + m[1].toFixed(1) + '@' + F[n - 1][m[0]].slice(0, 2).map(Math.round));
    console.log(movers.join(' '));
    console.log(seed, 'endMove', mv.toFixed(2), 'coin', mj, r.coins[mj].lane, F[n - 1][mj], '|', rep.ok ? 'ok' : rep.why);
  }
}
