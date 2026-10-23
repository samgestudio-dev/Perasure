/* PeraSure Sheet Motion — every animation constant + the three helpers.
   Framer Motion 11, plain JS (no build step). See SKILL.md.
   Host pages render `m.*` under <LazyMotion strict>; fade()/nodeFactory()
   take whichever component namespace the host hands them. */

/* ── 1. Springs — container geometry (height, x/y, width) ───────────────── */
export const FEEL = {
  Smooth: { type: 'spring', stiffness: 240, damping: 30, mass: 1 },
  Snappy: { type: 'spring', stiffness: 430, damping: 34, mass: 0.8 },
  Gentle: { type: 'spring', stiffness: 140, damping: 24, mass: 1.15 }
};

/* ── 2. Crossfade timing — text and content blocks ──────────────────────── */
export const EASE_IN = [0.22, 0.61, 0.36, 1];
export const ENTER = { duration: 0.30, delay: 0.07, ease: EASE_IN };
export const LEAVE = { duration: 0.15, ease: [0.4, 0, 1, 1] };

/* travel distance, by element size */
export const Y = { text: 8, block: 10, digit: 6 };

/* ── 3. Staggered reveal ────────────────────────────────────────────────── */
export const STAGGER_STEP = 0.03;      // per item; 6 items → 150ms
export const REVEAL_SCALE = 0.94;      // don't go lower on small boxes
export const REVEAL = (i, stagger = STAGGER_STEP) => ({
  initial: { opacity: 0, y: Y.block, scale: REVEAL_SCALE },
  transition: {
    default: { duration: 0.34, delay: 0.06 + i * stagger, ease: EASE_IN },
    borderColor: { duration: 0.15 },   // DS: colour = 150ms
    boxShadow: { duration: 0.22 }
  }
});

/* ── 3b. Quick row reveal — coming back to a surface the user already knows
   (keypad on return to edit). Rows, not keys: 4 steps, done in ~315ms. ───── */
export const REVEAL_ROW = (row, stagger = 0.025) => ({
  initial: { opacity: 0, y: 8, scale: 0.96 },
  transition: {
    default: { duration: 0.22, delay: 0.02 + row * stagger, ease: EASE_IN },
    borderColor: { duration: 0.15 },
    boxShadow: { duration: 0.22 }
  }
});

/* ── 3c. Secondary layers inside a morph — on a clock, not on the progress.
   Container + amount share the spring (0 → ~360ms); details arrive after the
   shape has mostly settled and leave before it starts to move back. ──────── */
export const LAYER_IN = { duration: 0.22, delay: 0.16, ease: EASE_IN };
export const LAYER_OUT = { duration: 0.10, ease: [0.4, 0, 1, 1] };

/* ── 4. Non-interpolable values ─────────────────────────────────────────── */
/* 'none' snaps — an off-state shadow must be a real shadow at zero alpha */
export const FLAT_SHADOW = '0px 0px 0px 0px rgba(0,1,40,0), 0px 0px 0px 0px rgba(0,1,40,0)';
export const FOCUS_SHADOW = '0px 0px 4px 0px rgba(0,1,40,0.16), 0px 8px 32px 0px rgba(0,1,40,0.12)';
/* colour on a node that does not remount: plain CSS, 150ms */
export const COLOR_TRANSITION = 'color .15s ease';

/* ── 5. Press — DS says ~60ms, no bounce ────────────────────────────────── */
export const PRESS = { duration: 0.06 };
export const PRESS_SCALE = { pill: 0.985, iconButton: 0.92 };

/* ── 6. Supporting delays ───────────────────────────────────────────────── */
export const FOCUS_AFTER_MORPH = 340;  // ms — let the spring settle first
export const AUTOFILL_START = 900;
export const AUTOFILL_STEP = 110;

/* ── fade(): a keyed crossfade node ─────────────────────────────────────── *
 * Parent must be position:relative with a FIXED height; the node itself
 * absolutely positioned. Mount inside <AnimatePresence initial={false}>.  */
export function fade(React, motion, key, y, style, children) {
  return React.createElement(motion.div, {
    key: key,
    initial: { opacity: 0, y: y },
    animate: { opacity: 1, y: 0, transition: ENTER },
    exit: { opacity: 0, y: -y, transition: LEAVE },
    style: style
  }, children);
}

/* ── nodeFactory(): render static before the library resolves ───────────── *
 * el('div', {animate, style}, kids) → motion.div once fm is loaded, plain
 * div with motion props stripped before that. One markup tree, no flash.  */
const MOTION_ONLY = {
  initial: 1, animate: 1, exit: 1, transition: 1, variants: 1, layout: 1,
  layoutId: 1, whileTap: 1, whileHover: 1, whileFocus: 1, custom: 1
};
export function nodeFactory(React, fm) {
  return function el(tag, props, kids) {
    if (fm) return React.createElement((fm.m || fm.motion)[tag], props, kids);
    const clean = {};
    for (const k in props) if (!MOTION_ONLY[k]) clean[k] = props[k];
    return React.createElement(tag, clean, kids);
  };
}
export function presence(fm) {
  return fm ? fm.AnimatePresence : (p) => p.children;
}

/* ── loader: same React instance as the host ────────────────────────────── *
 * Requires the react / react/jsx-runtime / react-dom import map from
 * SKILL.md §9 to be in the document before this runs.                     */
export const FM_URL = 'https://esm.sh/framer-motion@11.18.2?external=react,react-dom';
let fmPromise = null;
export let fmCache = null;
export function loadFM() {
  if (!fmPromise) {
    fmPromise = import(FM_URL)
      .then((m) => (fmCache = m))
      .catch((e) => { console.warn('[motion] framer-motion unavailable', e); return null; });
  }
  return fmPromise;
}
