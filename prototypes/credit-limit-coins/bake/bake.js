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
let PROFILE = { mode: 'engine', dropJit: 26,
  tumble: { keep: .5, inward: .6, reach0: 60, reach1: 110, maxTilt: .2, sway: 18, freq: 3.2, tau: .2, first: .16, gap: .022, leave0: .02, leaveK: .012, hopV: 260, spin: .5, lie: .1, nudgeIn: 30, nudgeOut: 10 },
  rattle: { sway: 22, freq: 3.2, tau: .2, walk: 6, loose: 3, hop: 30, hopBase: 12, hopT: .32, spin: .35, out: 38, outT: .55, settleT: .5 },
  collapse_was: 'collapse', collapse: { keep: .45, keepBack: .5, inward: .6, jit: 10, fly0: .2, flyOut: .4, flyK: .03 },
  mode_jolt_was: 'jolt', settle: .35, settleAir: .2, fric: .7, fricS: 1.6, vmax: 1500, vxmax: 900, missOff: 190, missJit: 3, missVx: 0, missTilt: .03, missSpin: 0, maxOutSteps: 1, catch: .25,
  jolt: { up0: 0, up1: 10, upH: 450, h0: .3, jit: 50, spin0: .3, spinH: 1.5 },
  /* the older aimed-heap kick (mode 'heap'), kept for comparison */
  foot: 3, side: 9, wob: 2.4, fly0: .18, flyK: .02, topFirst: false, ghost: false };

function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
/* the drop schedule (times fixed; offsets, misses' spread and spin from the seed) */
function makeDrops(dropSeed) {
  const r = rng(dropSeed), out = [], N = 44;
  const order = ['lime', 'orange', 'teal', 'orange', 'lime', 'teal', 'lime', 'orange'];
  /* misses fall on the outer side of their stack and clear of it, so they land flat on the floor instead of
     catching the stack's edge and ending up propped against it */
  const missAt = { 5: -1, 11: -1, 17: -1, 24: 1, 31: -1, 38: 1 };
  for (let i = 0; i < N; i++) {
    const u = (i + 1) / N;
    const at = COUNT.start + .08 + (COUNT.dur - .08) * (1 - Math.sqrt(1 - u));
    const kind = order[i % order.length];
    const m = missAt[i] && kind !== 'teal' ? missAt[i] : 0;
    const off = m ? m * (PROFILE.missOff || 64) + m * r() * (PROFILE.missJit ?? 26) : (r() - .5) * (PROFILE.dropJit ?? 16);
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
    const vx = d.miss ? (d.off > 0 ? 1 : -1) * (PROFILE.missVx ?? 110) : (d.kind === 'orange' ? 50 : d.kind === 'lime' ? -25 : 0);
    c.sx = S.x + d.off - vx * FALL; c.sy = 300 - .5 * g * FALL * FALL;
    /* the live demo applied these per step at 240 Hz, i.e. a quarter of the nominal value per second — keep that look */
    c.vx = vx / 4; c.ang = d.miss ? (d.off > 0 ? 1 : -1) * (PROFILE.missTilt ?? .25) : d.spin * .08; c.av = (d.miss ? (d.off > 0 ? 1 : -1) * (PROFILE.missSpin ?? 2) : d.spin * .6) / 4;
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
      for (const c of live) c.kickPose = [c.body.position.x, c.body.position.y];
      if (gather && (PROFILE.mode === 'rattle' || PROFILE.mode === 'tumble')) { /* nothing here: the rattle is laid over the recording afterwards */ }
      else if (gather && PROFILE.mode === 'collapse') {
        for (const c of coins) { c.body.friction = 1; c.body.frictionStatic = 4; }
        collapseKick(live, kr, engine.gravity.y * 1000);
      }
      else if (gather && PROFILE.mode === 'jolt') {
        for (const c of coins) { c.body.friction = PROFILE.fric; c.body.frictionStatic = PROFILE.fricS; }
        joltKick(live, kr);
      }
      else if (gather && PROFILE.mode !== 'engine') {
        /* softer, grippier landings while the heap forms, so the tall middle stays standing */
        engine.gravity.y = 2.2;
        for (const c of coins) { c.body.friction = 1; c.body.frictionStatic = 4; }
        gatherKick(live, kr, engine.gravity.y * 1000);
      }
      /* 'engine' (and the live Standard demo): the landing simply knocks every coin up and sideways, more the
         higher it sits; what happens next is entirely the physics engine */
      else for (const c of live) {
        M.Sleeping.set(c.body, false);
        const p = c.body.position, h = Math.max(0, (FLOOR - p.y) / 280);
        M.Body.setVelocity(c.body, { x: (kr() - .5) * (60 + 420 * h * h) / 60, y: -(420 + kr() * 260) / 60 });
        M.Body.setAngularVelocity(c.body, (kr() - .5) * (2 + 9 * h) / 60);
      }
    }
    /* a flying coin turns solid again once it is near its slot and not overlapping anything in its row */
    if (kicked) for (const c of coins) {
      if (!c.ghostFrom || t < c.ghostFrom) continue;
      const others = coins.filter(o => o !== c && o.live && o.lane === c.lane && !o.ghostFrom).map(o => o.body);
      if (M.Query.collides(c.body, others).length === 0 || t >= c.ghostMax + .4) {
        c.body.collisionFilter.mask = CAT.floor | CAT[c.lane]; c.ghostFrom = 0;
        /* touching down: friction against the coin it lands on takes most of the sideways speed and spin
           (the engine's friction alone lets a fast coin skate across a pile and off the far side) */
        if (PROFILE.catch) {
          M.Body.setVelocity(c.body, { x: c.body.velocity.x * PROFILE.catch, y: c.body.velocity.y });
          M.Body.setAngularVelocity(c.body, c.body.angularVelocity * PROFILE.catch);
        }
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
    /* no explosions: when coins get wedged, the solver can fling one away at thousands of units a second.
       Nothing in this scene moves faster than VMAX for real, so anything above it is solver error. */
    if (PROFILE.vmax) for (const c of coins) {
      if (!c.live) continue;
      const v = c.body.velocity, s = Math.hypot(v.x, v.y) * 60;
      if (s > PROFILE.vmax) M.Body.setVelocity(c.body, { x: v.x * PROFILE.vmax / s, y: v.y * PROFILE.vmax / s });
      /* sideways, nothing here is thrown hard: a coin squeezed out of a stack sideways is solver error too */
      const vx = c.body.velocity.x * 60;
      if (PROFILE.vxmax && Math.abs(vx) > PROFILE.vxmax) M.Body.setVelocity(c.body, { x: Math.sign(vx) * PROFILE.vxmax / 60, y: c.body.velocity.y });
      if (Math.abs(c.body.angularVelocity * 60) > 12) M.Body.setAngularVelocity(c.body, Math.sign(c.body.angularVelocity) * 12 / 60);
    }
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
  if (gather && record && PROFILE.mode === 'rattle') rattle(frames, coins, kr);
  if (gather && record && PROFILE.mode === 'tumble') tumble(frames, coins, kr);
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
/* ---- the landing as a jolt: the amount slams down and the table jumps ----
   Every coin gets the same kind of push a real jolt gives: up, plus a little sideways scatter that does NOT grow
   with height (a push that grows with height would shear the stacks into outward staircases). Nothing is aimed
   at a slot and nothing is pulled towards the middle; the heap is simply what the stacks collapse into. */
function joltKick(live, r) {
  const J = PROFILE.jolt;
  /* the top of each stack: only coins near a stack's top are loose enough to slide or turn on their own */
  const topOf = c => { const p = c.body.position; let top = p.y;
    for (const o of live) if (o.lane === c.lane && Math.abs(o.body.position.x - p.x) < RX && o.body.position.y < top) top = o.body.position.y; return top; };
  for (const c of live) {
    const p = c.body.position, ground = c.lane === 'back' ? FLOOR - Z_BACK : FLOOR, h = Math.max(0, (ground - p.y) / 280);
    const nearTop = Math.max(0, 1 - (p.y - topOf(c)) / (J.band || 1e9));
    /* the push grows with height above a threshold: the bottom of a stack is pinned by the weight on it,
       the top is free to jump (and to topple) */
    const vy = -(J.up0 + J.up1 * r() + J.upH * Math.max(0, h - (J.h0 || 0)));
    const free = Math.min(1, Math.max(0, h - (J.h0 || 0)) / .2) * nearTop;   // 0 for pinned coins, 1 at the loose top
    const vx = (r() - .5) * J.jit * free;
    M.Body.setVelocity(c.body, { x: vx / 60, y: vy / 60 });
    M.Body.setAngularVelocity(c.body, (r() - .5) * (J.spin0 + J.spinH * h) * free / 60);
  }
}
/* ---- the landing as a tumble ----
   The jolt shakes the tops off the stacks. Each loose coin slides off its own stack to the left or right (inwards a
   little more often, since that is where the other stack is), drops, and comes to rest on whatever is below it:
   the floor, a coin lying there, or the other stack. Where it rests is worked out on a height map of the row, so a
   coin always lies on something, tilts only as much as what it lies on, never hangs out further than 0.7 of its
   radius, and never makes an outward step. Coins land in order (lower ones first) on a falling arc with at most a
   small hop. The coins that stay on the stacks sway against the shake and settle.
   Keyframed rather than simulated: the engine cannot shake 20-coin stacks without squeezing coins out sideways. */
function tumble(frames, coins, r) {
  const T = PROFILE.tumble, FPS = 60, k0 = Math.round(KICK_T * FPS), n = frames.length, g = 3400, base = frames[k0];
  const X0 = -400, NX = 1600;
  const smooth = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
  const lanes = { front: { stacks: ['orange', 'lime'], ground: FLOOR }, back: { stacks: ['teal'], ground: FLOOR - Z_BACK } };
  const motion = {};                                                       // j -> function(t) -> [x, y, a] or null
  for (const [laneName, L] of Object.entries(lanes)) {
    const inLane = coins.map((c, j) => j).filter(j => coins[j].lane === laneName && base[j]);
    const surf = new Float64Array(NX).fill(L.ground);                      // top surface y at each x (smaller = higher)
    const lay = (x, y, a) => {                                              // a coin of centre (x, y), angle a, now occupies its span
      for (let u = -RX; u <= RX; u++) { const i = Math.round(x + u) - X0; if (i < 0 || i >= NX) continue; const top = y - H / 2 + u * Math.tan(a); if (top < surf[i]) surf[i] = top; }
    };
    const stackOf = j => L.stacks.find(k => Math.abs(base[j][0] - STACK[k].x) < 70);
    /* who stays: the bottom part of each stack; everything else in the row (misses on the floor) stays too */
    const falling = [];
    for (const k of L.stacks) {
      const ids = inLane.filter(j => stackOf(j) === k).sort((a, b) => base[b][1] - base[a][1]);
      const keep = Math.max(2, Math.round(ids.length * (T.keep + (r() - .5) * .12)));
      ids.slice(keep).reverse().forEach((j, i) => falling.push({ j, k, fromTop: i }));   // top coin first
    }
    const stays = inLane.filter(j => !falling.some(f => f.j === j));
    stays.forEach(j => lay(base[j][0], base[j][1], base[j][2]));
    /* sway for the coins that stay (and, before they leave, for the falling ones): grows with height, decays fast */
    const amp = {}; for (const k of L.stacks) amp[k] = T.sway * (.8 + r() * .4) * (r() < .5 ? 1 : 1);
    const swayAt = (j, t) => {
      const k = stackOf(j); if (!k) return 0;
      const h = Math.max(0, (L.ground - base[j][1]) / 280);
      return amp[k] * Math.pow(h, 1.5) * Math.exp(-t / T.tau) * Math.sin(2 * Math.PI * T.freq * t);
    };
    stays.forEach(j => { motion[j] = t => { const d = swayAt(j, t); return [base[j][0] + d, base[j][1], base[j][2] + d * .002]; }; });
    /* where each falling coin comes to rest, in the order they leave (top coins first). The same rules as validate():
       it lies on the floor or on coins just below it, its centre is over what it touches, and it is not a step
       outwards from the coin(s) it lies on. */
    const rest = stays.map(j => base[j].slice());
    const tryAt = x => {
      let y = L.ground - H / 2;
      for (const o of rest) if (Math.abs(o[0] - x) < 2 * RX - 4) y = Math.min(y, o[1] - H);
      if (y > L.ground - H / 2 - 1) return { y, a: (r() - .5) * T.lie, ok: true };      // on the floor
      const under = rest.filter(o => touches(o, [x, y, 0]));
      const lo = Math.max(x - RX, Math.min(...under.map(o => o[0] - RX))) + .15 * RX, hi = Math.min(x + RX, Math.max(...under.map(o => o[0] + RX))) - .15 * RX;
      if (x < lo || x > hi) return { ok: false };
      const sx = under.reduce((t, o) => t + o[0], 0) / under.length, dx = x - sx;
      if (Math.abs(dx) > .3 * RX && Math.sign(dx) === Math.sign(x - 363)) return { ok: false };
      /* a slight tilt when the coins below sit at different heights */
      const left = under.filter(o => o[0] < x - 20), right = under.filter(o => o[0] > x + 20);
      const yl = left.length ? Math.min(...left.map(o => o[1])) : null, yr = right.length ? Math.min(...right.map(o => o[1])) : null;
      const a = yl !== null && yr !== null ? Math.max(-T.maxTilt, Math.min(T.maxTilt, Math.atan2(yr - yl, 160) * .7)) + (r() - .5) * T.lie * .5 : (r() - .5) * T.lie;
      return { y, a, ok: true };
    };
    const placed = [];
    for (const f of falling) {
      const p = base[f.j], sx = STACK[f.k].x, inward = Math.sign(363 - sx) || (r() < .5 ? -1 : 1);
      const side = r() < T.inward ? inward : -inward;
      const want = p[0] + side * (T.reach0 + r() * T.reach1);
      let best = null;
      /* from where it wants to land, look back towards its own stack for the first place it can really rest */
      for (let d = 0; d <= 380 && !best; d += 4) {
        for (const x of [want - side * d, want + side * d]) {
          const q = tryAt(x);
          if (q.ok && q.y >= p[1] - 6 && Math.abs(x - p[0]) <= 2 * RX + 25) {
            best = [x, q.y, q.a];
            /* loosen it: nudge it towards the middle (a heap leans in) or a touch outwards, if it still rests well */
            const inSign = Math.sign(363 - x) || 1;
            for (let k = 0; k < 6; k++) {
              const nx = x + inSign * r() * T.nudgeIn - inSign * r() * T.nudgeOut, nq = tryAt(nx);
              if (nq.ok && Math.abs(nq.y - q.y) < 1 && Math.abs(nx - p[0]) <= 2 * RX + 25) { best = [nx, nq.y, nq.a]; break; }
            }
            break;
          }
        }
      }
      if (!best) { best = [p[0], p[1], p[2]]; if (process.env.DBG) console.log("no rest for", f.j); }
      rest.push(best);
      placed.push({ ...f, end: best });
    }
    /* timing: lower resting places are reached first; a coin leaves once the coin above it has left */
    placed.sort((A, B) => B.end[1] - A.end[1]);
    let arrive = KICK_T + T.first;
    const leaveAt = {};
    falling.forEach((f, i) => leaveAt[f.j] = KICK_T + T.leave0 + i * T.leaveK);
    for (const q of placed) {
      const p = base[q.j], t0 = leaveAt[q.j], dy = q.end[1] - p[1];
      arrive = Math.max(arrive + T.gap, t0 + .12);
      let D = arrive - t0, vy0 = (dy - .5 * g * D * D) / D;
      if (vy0 < -T.hopV) { vy0 = -T.hopV; D = (-vy0 + Math.sqrt(vy0 * vy0 + 2 * g * Math.max(dy, -vy0 * vy0 / (2 * g) + 1))) / g; arrive = t0 + D; }
      const spin = (r() - .5) * T.spin;
      let da = q.end[2] - p[2]; da = Math.atan2(Math.sin(da), Math.cos(da));
      q.t0 = t0; q.D = D; q.vy0 = vy0;
      motion[q.j] = t => {
        const tt = KICK_T + t;
        if (tt <= t0) { const d = swayAt(q.j, t); return [p[0] + d, p[1], p[2]]; }
        const u = Math.min(1, (tt - t0) / D), s = (tt - t0);
        if (u < 1) return [p[0] + (q.end[0] - p[0]) * smooth(Math.min(1, u * 1.15)) * .2 + (q.end[0] - p[0]) * u * .8, p[1] + vy0 * s + .5 * g * s * s, p[2] + da * u + spin * Math.sin(Math.PI * u)];
        /* touch down: a short settle */
        const b = tt - t0 - D, bounce = b < .14 ? Math.sin(b / .14 * Math.PI) * 2.2 * Math.exp(-b * 18) : 0;
        return [q.end[0], q.end[1] - bounce, q.end[2]];
      };
    }
  }
  for (let f = k0; f < n; f++) {
    const t = (f - k0) / FPS;
    for (const j in motion) { const m = motion[j](t); frames[f][j] = [+m[0].toFixed(2), +m[1].toFixed(2), +m[2].toFixed(4)]; }
  }
}
/* ---- the landing as a rattle ----
   When the amount slams down the scene shakes (the page moves left, right, left... over 0.34 s). The coins answer
   the way stacked coins do on a table that gets hit: the stacks sway against the shake and settle, the loose coins
   near the top hop and come down a little off-centre, and one coin on each front stack slides out over the edge
   and back. Nothing is pulled into a shape and nothing flies across the scene.
   A 20-coin stack rattling is beyond what the engine resolves without coins being squeezed out sideways, so this
   part is keyframed on top of the simulated recording (the drops before it stay fully simulated). The motion
   follows the shake's timing and decays like a damped sway; within a stack every offset grows smoothly with height,
   so coins never pass through each other. */
function rattle(frames, coins, r) {
  const R = PROFILE.rattle, FPS = 60, k0 = Math.round(KICK_T * FPS), n = frames.length;
  const smooth = u => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
  const groups = { orange: [], lime: [], teal: [] }, base = frames[k0];
  coins.forEach((c, j) => {
    const p = base[j]; if (!p) return;
    for (const k of Object.keys(groups)) if (STACK[k].lane === c.lane && Math.abs(p[0] - STACK[k].x) < 70) groups[k].push(j);
  });
  for (const k of Object.keys(groups)) {
    const ids = groups[k].sort((a, b) => base[b][1] - base[a][1]);          // bottom first
    if (!ids.length) continue;
    const ground = STACK[k].ground, amp = R.sway * (.8 + r() * .4), ph = r() * .6, side = k === 'orange' ? -1 : k === 'lime' ? 1 : 0;
    let walk = 0;
    const plan = ids.map((j, i) => {
      const h = Math.max(0, (ground - base[j][1]) / 280), fromTop = ids.length - 1 - i;
      walk += (r() - .5) * 2 * R.walk;                                       // where it ends up: a small random walk up the stack
      const hop = fromTop < R.loose ? R.hop * (1 - fromTop / R.loose) * (.7 + r() * .6) : R.hopBase * Math.max(0, h - .3);
      return { j, h, end: walk, hop, spin: (r() - .5) * R.spin * (fromTop < R.loose ? 1 : .2), out: 0 };
    });
    /* one coin near the top of each front stack slides out over the outer edge, then back */
    if (side) { const p = plan[plan.length - 1 - Math.floor(r() * 2)]; if (p) p.out = side * R.out * (.8 + r() * .4); }
    /* hops must grow with height inside a stack, so a coin never sinks into the one below it */
    for (let i = 1; i < plan.length; i++) plan[i].hop = Math.max(plan[i].hop, plan[i - 1].hop);
    for (let f = k0; f < n; f++) {
      const t = (f - k0) / FPS;
      const sway = Math.exp(-t / R.tau) * Math.sin(2 * Math.PI * R.freq * t + ph * (t > 0)) * (t < R.tau * 5 ? 1 : 0);
      const settle = smooth(t / R.settleT);
      for (const q of plan) {
        const p = frames[f][q.j]; if (!p) continue;
        const hopT = t / R.hopT, up = t < R.hopT ? 4 * hopT * (1 - hopT) : 0;         // one parabolic hop
        const outT = t / R.outT, out = q.out ? q.out * Math.sin(Math.PI * Math.min(1, outT)) * (outT < 1 ? 1 : 0) : 0;
        const dx = amp * Math.pow(q.h, 1.5) * sway + q.end * settle + out;
        const dy = -q.hop * up;
        const da = q.spin * up + amp * q.h * .004 * sway;
        frames[f][q.j] = [+(p[0] + dx).toFixed(2), +(p[1] + dy).toFixed(2), +(p[2] + da).toFixed(4)];
      }
    }
  }
}
/* ---- the landing as a collapse: the jolt knocks the tops off the stacks ----
   The lower part of each stack stays put. The coins above it slide off and drop: some inwards, where they come to
   rest bridging the two front stacks (that becomes the peak), the rest outwards onto the coins already lying on the
   floor beside their stack. Every coin only moves down and at most about one coin width sideways, in the direction
   it would fall off its own stack; nothing is thrown up or across the scene. Flights pass by each other and each
   coin turns solid just before it lands, so the engine does the landing (nudges, small slides, settling). */
function collapseKick(live, r, g) {
  const C = PROFILE.collapse;
  const byY = (a, b) => b.body.position.y - a.body.position.y;               // bottom first
  const near = (cs, x, w) => cs.filter(c => Math.abs(c.body.position.x - x) < w);
  const plan = [];                                                            // [coin, x, y, angle, level]
  const lane = (cs, ground, left, right, bridgeX, outL, outR) => {
    const L = near(cs, left, 70).sort(byY), R = near(cs, right, 70).sort(byY);
    const loose = cs.filter(c => !L.includes(c) && !R.includes(c));
    /* how much of each stack stays standing; the two stay within a coin or two of each other so the bridge rests on both */
    const keepL = Math.max(2, Math.round(Math.min(L.length, R.length) * C.keep + (r() - .5) * 2));
    const keepR = Math.max(2, keepL + Math.round((r() - .5) * 2.4));
    const topL = L.slice(keepL).reverse(), topR = R.slice(keepR).reverse();   // top coin first
    /* outer piles start on whatever already lies on the floor out there */
    const baseOut = (x0, side) => { const on = loose.filter(c => Math.sign(c.body.position.x - x0) === side); return { x: on.length ? on.reduce((s, c) => s + c.body.position.x, 0) / on.length : x0, n: on.length }; };
    const oL = baseOut(left, -1), oR = baseOut(right, 1);
    oL.x = Math.min(oL.x, left - 2 * RX + 4); oR.x = Math.max(oR.x, right + 2 * RX - 4);
    const bridgeBase = ground - Math.max(keepL, keepR) * H;
    let nb = 0;
    const send = (coin, side) => {                                            // side: 0 = bridge, -1/1 = outer pile
      if (side === 0) { plan.push([coin, bridgeX + (r() - .5) * C.jit * 2, bridgeBase - nb * H - H / 2, (keepR - keepL) * .06 + (r() - .5) * .08, nb]); nb++; }
      else { const o = side < 0 ? oL : oR; plan.push([coin, o.x + (r() - .5) * C.jit, ground - o.n * H - H / 2, (r() - .5) * .1, o.n]); o.n++; }
    };
    /* lowest loose coins first, so the bridge fills from the bottom; a coin only takes the next bridge slot if
       that slot is no higher than where it already is (nothing climbs), otherwise it falls off the outer side */
    const tops = topL.map(c => [c, -1]).concat(topR.map(c => [c, 1])).sort((a, b) => b[0].body.position.y - a[0].body.position.y);
    for (const [c, outSide] of tops) {
      const slotY = bridgeBase - nb * H - H / 2;
      send(c, r() < C.inward && slotY >= c.body.position.y - 4 ? 0 : outSide);
    }
  };
  const front = live.filter(c => c.lane === 'front'), back = live.filter(c => c.lane === 'back');
  lane(front, FLOOR, STACK.orange.x, STACK.lime.x, (STACK.orange.x + STACK.lime.x) / 2);
  /* the single back stack: its top falls off to both sides, behind the front stacks */
  const B = back.filter(c => Math.abs(c.body.position.x - STACK.teal.x) < 70).sort(byY), keepB = Math.round(B.length * C.keepBack);
  const piles = { '-1': { x: STACK.teal.x - 2 * RX + 2, n: 0 }, '1': { x: STACK.teal.x + 2 * RX - 2, n: 0 } };
  B.slice(keepB).reverse().forEach(c => { const s = r() < .5 ? -1 : 1, o = piles[s];
    plan.push([c, o.x + (r() - .5) * C.jit, FLOOR - Z_BACK - o.n * H - H / 2, (r() - .5) * .1, o.n]); o.n++; });
  /* throw: lower slots land first; a falling coin barely rises (just the jolt) */
  for (const [c, x, y, a, level] of plan) {
    const p = c.body.position, outer = Math.abs(x - p.x) > RX, fly = (outer ? C.flyOut : C.fly0) + C.flyK * level + r() * .03, ty = y - 2;
    const vx = (x - p.x) / fly, vy = (ty - p.y - .5 * g * fly * fly) / fly;
    M.Body.setVelocity(c.body, { x: vx / 60, y: vy / 60 });
    let da = a - c.body.angle; da = Math.atan2(Math.sin(da), Math.cos(da));
    M.Body.setAngularVelocity(c.body, da / fly / 60);
    c.ghostFrom = KICK_T + fly * .75; c.ghostMax = KICK_T + fly + .12; c.body.collisionFilter.mask = CAT.floor;
  }
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
   1. No coin may come to rest tilted more than MAX_TILT (30 degrees). Coins in a heap lie flat or nearly
      flat; one propped up on its edge looks wrong, and the face shadows assume a near-horizontal top face.
   2. At the end every coin must be at rest (it may lie partly off screen: the edge is not a wall). */
/* o lies directly under f, touching it: overlapping sideways, and o's top face at f's bottom face
   (with room for the two coins' tilts) */
function touches(o, f) {
  if (Math.abs(o[0] - f[0]) >= 2 * RX - 4 || o[1] <= f[1]) return false;
  const slack = 4 + RX * (Math.abs(Math.sin(o[2])) + Math.abs(Math.sin(f[2])));
  return Math.abs(o[1] - f[1] - H) <= slack;
}
function validate(frames, coins) {
  const MAX_TILT = 30 / 57.2958, n = frames.length;                  // 30 degrees
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
       2 units over 3 frames is about 0.3 CSS px per frame on a phone: below what the eye can follow */
    if (Math.hypot(f[0] - g[0], f[1] - g[1]) > 2 || Math.abs(f[2] - g[2]) > .03) return { ok: false, why: `coin ${j} still moving at the end`, maxTilt };
    if (tilt(f[2]) > MAX_TILT) return { ok: false, why: `coin ${j} ends tilted ${(tilt(f[2]) * 57.3).toFixed(0)} deg`, maxTilt };
  }
  /* The checks below shaped the earlier aimed heaps. A plain engine run ('engine') is kept as the engine leaves it:
     only the two checks above apply (no coin resting tilted more than 30 degrees, nothing frozen mid-motion). */
  if (PROFILE.mode === 'engine') return { ok: true, maxTilt };
  /* 3. nothing floats: every coin at the end lies on its floor or on a coin of its own row just below it */
  const last = frames[n - 1];
  for (let j = 0; j < coins.length; j++) {
    const f = last[j], fl = coins[j].lane === 'back' ? FLOOR - Z_BACK : FLOOR;
    const bottom = f[1] + Math.abs(Math.cos(f[2])) * H / 2 + Math.abs(Math.sin(f[2])) * RX;
    if (bottom > fl - 4) continue;
    const under = last.filter((o, k) => k !== j && coins[k].lane === coins[j].lane && touches(o, f));
    if (!under.length) return { ok: false, why: `coin ${j} floats at (${f[0]}, ${f[1]})`, maxTilt };
    /* 4. balanced: the coin's centre lies over the part of the coins below that it actually touches (with a little
          margin). The engine can hold a bigger overhang with friction, but it reads as about to fall. */
    const lo = Math.max(f[0] - RX, Math.min(...under.map(o => o[0] - RX))) + .1 * RX, hi = Math.min(f[0] + RX, Math.max(...under.map(o => o[0] + RX))) - .1 * RX;
    if (f[0] < lo || f[0] > hi) return { ok: false, why: `coin ${j} overhangs its support by ${Math.round(Math.max(lo - f[0], f[0] - hi))}`, maxTilt };
  }
  /* 6. common sense at the landing: from the jolt on, no coin rises much, ends higher than it was, or travels
        further sideways than falling off its own stack would take it */
  const k0 = Math.round(KICK_T * 60);
  for (let j = 0; j < coins.length; j++) {
    const a = frames[k0][j]; if (!a) continue;
    let rise = 0; for (let i = k0; i < n; i++) rise = Math.max(rise, a[1] - frames[i][j][1]);
    const e = last[j];
    if (rise > 55) return { ok: false, why: `coin ${j} jumps ${Math.round(rise)} up at the landing`, maxTilt };
    if (e[1] < a[1] - 12) return { ok: false, why: `coin ${j} ends higher than it started`, maxTilt };
    if (Math.abs(e[0] - a[0]) > 2 * RX + 30) return { ok: false, why: `coin ${j} travels ${Math.round(e[0] - a[0])} sideways`, maxTilt };
  }
  /* 5. no outward staircases: a coin shifted away from the middle of the heap relative to the coin(s) it rests on
        is a step outwards. One such step may remain; two steps in a row (a staircase) never. */
  const support = j => {
    const f = last[j], fl = coins[j].lane === 'back' ? FLOOR - Z_BACK : FLOOR;
    if (f[1] + Math.abs(Math.cos(f[2])) * H / 2 + Math.abs(Math.sin(f[2])) * RX > fl - 4) return null;
    const u = []; last.forEach((o, k) => { if (k !== j && coins[k].lane === coins[j].lane && touches(o, f)) u.push(k); });
    return u.length ? u : null;
  };
  const outStep = j => {
    const u = support(j); if (!u) return false;
    const sx = u.reduce((s, k) => s + last[k][0], 0) / u.length, dx = last[j][0] - sx;
    return Math.abs(dx) > .35 * RX && Math.sign(dx) === Math.sign(last[j][0] - PILE_X);
  };
  let steps = 0;
  for (let j = 0; j < coins.length; j++) {
    if (!outStep(j)) continue;
    steps++;
    if (support(j).some(outStep)) return { ok: false, why: `outward staircase at coin ${j}`, maxTilt };
  }
  if (steps > (PROFILE.maxOutSteps ?? 1)) return { ok: false, why: `${steps} coins stick outwards`, maxTilt };
  return { ok: true, maxTilt, steps };
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
