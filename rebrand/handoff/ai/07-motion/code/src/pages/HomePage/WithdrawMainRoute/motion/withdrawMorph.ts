/**
 * Amount entry → order card morph (M-107), its riders and the order page's
 * entrance (M-108, M-113 slide, M-114 veil) — a port of the demo's
 * `tweenMp` / `applyMp` / `mp*()` / `flipStart` / `flipApply` / `cardSnap`
 * (prototypes/withdraw-fund-flow/withdraw.js:339-678, 1359-1402) onto
 * production's two DOMs (QuoteForm for the entry, LoanQuoteControls in the
 * confirm card).
 *
 * The entry DOM is gone once the phase changes, so `captureWithdrawMorph()`
 * runs first (handleConfirmQuote) and records:
 *   · every shared element's box (label, ₱, each glyph of the amount, each
 *     term chip) + its colour and font size — these become the FLIP sources;
 *   · a clone of the entry ("ghost") that holds what only the entry has (the
 *     caption, the term prompt, the caret, the pad line and the keypad) so
 *     they can leave on the demo's windows / clocks instead of vanishing.
 * `playWithdrawMorph()` then drives ONE progress k 0 → 1 on the Smooth spring
 * (MORPH_SPRING: 240 / 30 / 1, restDelta 0.001, restSpeed 0.01) and writes
 * every style from k in the progress's change event (no React renders).
 *
 * Kept from the demo (values 1:1):
 *   card box     left/right 0 → card, height page → 246, bottom radii lc(0, 24),
 *                written as the decoration surface's box (layout of one
 *                absolutely-positioned box, as mpCard() does), never clip-path;
 *   label        translate src → dst on lerp(k), colour mix on k01 (mpLabel);
 *   amount       every glyph FLIPped src → dst (translate on lerp, scale
 *                fs(src)/fs(dst) → 1, dropped within 0.2 %), colour mix (mpNum /
 *                mpPeso / mpTail / mpDec), decimals ride with the glyphs;
 *   caret        fades 1 − k01 riding the first fixed "0" (mpCaretFade);
 *   pencil       win(0.30, 0.90): opacity, translateX((1−e)·−6) rotate((1−e)·−24°)
 *                scale(0.5 + 0.5e), origin 30 % 85 % (mpPencil);
 *   slider       win(0.30, 0.88): opacity, translateY((1−e)·10) + rides from
 *                below the caption (mpSlider / mpRange);
 *   divider      win(0.40, 0.92) opacity (mpDivider);
 *   term row     win(0.50, 0.96) opacity (mpTerm);
 *   chips        shared: box lerps src → dst (absolute small boxes, mpChips /
 *                mpChip height 41 → 36);
 *   caption      capO = smoothstep(clamp(1 − 2k)), rides the amount row (capY);
 *   keypad, line leave on LEAVE (0.15 s, opacity 0, y −10) at once;
 *   blocks       wrapper opacity 0 → 1 in 0.2 s; block i REVEAL(i) (0.34 s,
 *                delay 0.06 + 0.03 i, y 10, scale 0.94);
 *   page tint    gradient layer opacity = bk (mpGrad);
 *   Confirm bar  button opacity min(1, 1.45 bk), translateY((1 − bk)·10); veil
 *                opacity bk · endF (mpBtn / mpBar).
 * At rest every inline style is put back in one frame and the ghost removed.
 */
import { animate } from 'motion';

import { EASE_IN, MT } from '@/motion/tokens';
import {
  clamp01,
  createProgress,
  lerp,
  mixRgb,
  MORPH_SPRING,
  r3,
  reduced,
  StyleLedger,
  win,
  type Playback,
} from '@/motion/flows/core';
import { PAD_OUT, WD_REVEAL } from '@/motion/flows/withdrawTokens';

/** A box in viewport coordinates. */
export interface MorphRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface GlyphSnap {
  /** baseline-left point (viewport) */
  x: number;
  b: number;
  /** font size px */
  f: number;
  color: string;
  text: string;
}

/** What the entry looked like the frame before it was replaced. */
export interface WithdrawMorphSnapshot {
  card: MorphRect;
  label: { rect: MorphRect; color: string } | null;
  peso: GlyphSnap | null;
  /** integer glyphs incl. grouping and the fixed "00", left → right */
  glyphs: GlyphSnap[];
  /** ".00" */
  dec: GlyphSnap[];
  chips: Record<string, MorphRect>;
  /** bottom of the caption (where the order card's slider rides up from) */
  captionBottom: number | null;
  ghost: HTMLElement | null;
}

const toRect = (r: DOMRect): MorphRect => ({
  left: r.left,
  top: r.top,
  width: r.width,
  height: r.height,
});

/** Baseline point of a glyph box (its first child is the zero-size marker). */
function glyphOf(el: HTMLElement): GlyphSnap {
  const base = (el.firstElementChild as HTMLElement | null) ?? el;
  const m = base.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    x: m.left,
    b: Math.round(m.top),
    f: parseFloat(cs.fontSize) || 16,
    color: cs.color,
    text: el.textContent ?? '',
  };
}

/**
 * Reads the entry the frame before the phase changes. `root` is the QuoteForm
 * section (`[data-apply-page]`); `ghostHost` the layer the clone goes in.
 */
export function captureWithdrawMorph(
  root: HTMLElement | null | undefined,
  ghostHost: HTMLElement | null | undefined,
): WithdrawMorphSnapshot | undefined {
  const card = root?.querySelector<HTMLElement>('[data-withdraw-card]');
  if (!root || !card) return undefined;
  const label = root.querySelector<HTMLElement>('[data-morph="label"]');
  const peso = root.querySelector<HTMLElement>('[data-morph="peso"]');
  const cap = root.querySelector<HTMLElement>('[data-morph="cap"]');
  const glyphs = Array.from(
    root.querySelectorAll<HTMLElement>('[data-g="int"], [data-g="tail"]'),
  ).map(glyphOf);
  const dec = Array.from(
    root.querySelectorAll<HTMLElement>('[data-g="dec"]'),
  ).map(glyphOf);
  const chips: Record<string, MorphRect> = {};
  root.querySelectorAll<HTMLElement>('[data-morph-chip]').forEach((el) => {
    chips[el.dataset.morphChip!] = toRect(el.getBoundingClientRect());
  });
  let ghost: HTMLElement | null = null;
  if (ghostHost && !reduced()) {
    const r = root.getBoundingClientRect();
    const h = ghostHost.getBoundingClientRect();
    ghost = root.cloneNode(true) as HTMLElement;
    ghost.setAttribute('aria-hidden', 'true');
    ghost.setAttribute('inert', '');
    ghost.removeAttribute('data-apply-page');
    Object.assign(ghost.style, {
      position: 'absolute',
      left: `${r.left - h.left}px`,
      top: `${r.top - h.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      margin: '0',
      pointerEvents: 'none',
      background: 'transparent',
    });
    // The surface of the live card paints the white; the clone only keeps
    // what leaves (caption, prompt, caret, line, keypad).
    ghost
      .querySelectorAll<HTMLElement>(
        '[data-withdraw-card], [data-morph="panel"], [data-morph="detail"]',
      )
      .forEach((el) => {
        Object.assign(el.style, {
          background: 'transparent',
          boxShadow: 'none',
          animation: 'none',
        });
      });
    ghost
      .querySelectorAll<HTMLElement>(
        '[data-morph="label"], [data-morph="peso"], [data-g], [data-morph-chip]',
      )
      .forEach((el) => {
        el.style.visibility = 'hidden';
      });
    ghost.querySelectorAll<HTMLElement>('*').forEach((el) => {
      el.style.animationPlayState = 'paused';
    });
    ghostHost.prepend(ghost);
  }
  return {
    card: toRect(card.getBoundingClientRect()),
    label: label
      ? {
          rect: toRect(label.getBoundingClientRect()),
          color: getComputedStyle(label).color,
        }
      : null,
    peso: peso ? glyphOf(peso) : null,
    glyphs,
    dec,
    chips,
    captionBottom: cap ? cap.getBoundingClientRect().bottom : null,
    ghost,
  };
}

interface FlipItem {
  el: HTMLElement;
  s: GlyphSnap;
  d: GlyphSnap;
  ox: number;
  oy: number;
}

/**
 * Plays the morph on the mounted confirm DOM. `page` = WithdrawMainRoute's
 * <main>; `cta` = the Confirm button (portal) or null. Returns a cleanup
 * that ends at rest (idempotent): every inline style back, ghost removed.
 */
export function playWithdrawMorph(options: {
  page: HTMLElement;
  snapshot: WithdrawMorphSnapshot | undefined;
  cta: HTMLElement | null;
  onSettled?: () => void;
}): () => void {
  const { page, snapshot, cta } = options;
  const card = page.querySelector<HTMLElement>('[data-confirm-card]');
  const surface = card?.querySelector<HTMLElement>('[data-card-surface]');
  const blocks = page.querySelector<HTMLElement>('[data-morph="blocks"]');
  const grad = page.querySelector<HTMLElement>('[data-morph="grad"]');
  const ghost = snapshot?.ghost ?? null;
  const removeGhost = () => ghost?.remove();
  if (!card || !surface || !snapshot || reduced()) {
    // Reduced motion (skill rule 9; added, not in the demo's code path):
    // jump to the end state.
    removeGhost();
    options.onSettled?.();
    return () => {};
  }

  const L = new StyleLedger();
  const plays: Playback[] = [];
  let springDone = false;
  let clocksLeft = 0;
  let ended = false;

  /* ---- measure the destination (layout committed once, at the start) ---- */
  const R = card.getBoundingClientRect();
  const cbLeft = R.left + card.clientLeft;
  const cbTop = R.top + card.clientTop;
  const src = snapshot.card;
  const dstCard = toRect(R);
  const label = card.querySelector<HTMLElement>('[data-morph="label"]');
  const labelDst = label ? toRect(label.getBoundingClientRect()) : null;
  const labelColor = label ? getComputedStyle(label).color : '';
  const pencil = card.querySelector<HTMLElement>('[data-morph="pencil"]');
  const slider = card.querySelector<HTMLElement>('[data-morph="slider"]');
  const divider = card.querySelector<HTMLElement>('[data-morph="divider"]');
  const term = card.querySelector<HTMLElement>('[data-morph="term"]');
  const chipRow = card.querySelector<HTMLElement>('[data-morph="chips"]');
  const chipEls = Array.from(
    card.querySelectorAll<HTMLElement>('[data-morph-chip]'),
  );

  /* amount glyphs: pair from the right (the integer grows to the left) */
  const flips: FlipItem[] = [];
  const pair = (els: HTMLElement[], from: GlyphSnap[]) => {
    const n = els.length;
    els.forEach((el, i) => {
      const s = from[from.length - (n - i)];
      const d = glyphOf(el);
      const gr = el.getBoundingClientRect();
      if (!s) {
        flips.push({ el, s: { ...d }, d, ox: d.x - gr.left, oy: d.b - gr.top });
        return;
      }
      flips.push({ el, s, d, ox: d.x - gr.left, oy: d.b - gr.top });
    });
  };
  const pesoEl = card.querySelector<HTMLElement>('[data-morph="peso"]');
  if (pesoEl && snapshot.peso) pair([pesoEl], [snapshot.peso]);
  pair(
    Array.from(card.querySelectorAll<HTMLElement>('[data-g="int"]')),
    snapshot.glyphs,
  );
  pair(
    Array.from(card.querySelectorAll<HTMLElement>('[data-g="dec"]')),
    snapshot.dec,
  );
  flips.forEach((f) => {
    L.set(f.el, 'transformOrigin', `${r3(f.ox)}px ${r3(f.oy)}px`);
    L.set(f.el, 'willChange', 'transform');
  });
  /* the amount row's own travel (caption and slider ride it) */
  const lead = flips.find((f) => f.el !== pesoEl) ?? flips[0];
  const rowDy = lead ? lead.s.b - lead.d.b : 0;
  const rowDx = lead ? lead.s.x - lead.d.x : 0;
  const tailLead =
    snapshot.glyphs.length >= 2
      ? flips.find((f) => f.s === snapshot.glyphs[snapshot.glyphs.length - 2])
      : undefined;

  /* chips: absolute small boxes inside their row while the morph runs */
  const rowBox = chipRow?.getBoundingClientRect();
  const chipPaths = chipEls
    .map((el) => {
      const d = toRect(el.getBoundingClientRect());
      const s = snapshot.chips[el.dataset.morphChip ?? ''];
      return s && rowBox ? { el, s, d } : null;
    })
    .filter(Boolean) as { el: HTMLElement; s: MorphRect; d: MorphRect }[];
  if (chipRow && chipPaths.length) {
    L.set(chipRow, 'position', 'relative');
    L.set(chipRow, 'height', `${rowBox!.height}px`);
    L.set(chipRow, 'overflow', 'visible');
    chipPaths.forEach(({ el }) => {
      L.set(el, 'position', 'absolute');
      L.set(el, 'margin', '0');
      L.set(el, 'flex', 'none');
      L.set(el, 'boxSizing', 'border-box');
    });
  }

  /* the slider rides up from under the caption (mpRange: 196 → 72) */
  const sliderBox = slider?.getBoundingClientRect();
  const sliderRide =
    sliderBox && snapshot.captionBottom !== null
      ? Math.max(0, snapshot.captionBottom + 48 - sliderBox.top)
      : rowDy;

  /* ghost parts */
  const gq = (sel: string) =>
    Array.from(ghost?.querySelectorAll<HTMLElement>(sel) ?? []);
  const ghostCap = gq('[data-morph="cap"], [data-morph="prompt"]');
  const ghostCaret = gq('[data-morph="caret"]');
  const ghostPad = gq('[data-morph="line"], [data-morph="pad"]');

  /* the Confirm bar (portal): slide + fade on the button, veil on its blur */
  const ctaWrap = cta?.parentElement ?? null;
  const veil =
    ctaWrap?.firstElementChild instanceof HTMLElement
      ? ctaWrap.firstElementChild
      : null;

  /* stacking: the card sits over the blocks while it is large */
  L.set(card, 'zIndex', '2');
  L.set(surface, 'willChange', 'left, top, width, height');
  L.set(surface, 'inset', 'auto');

  const end = () => {
    if (ended || !springDone || clocksLeft > 0) return;
    ended = true;
    progress.dispose();
    L.restore();
    removeGhost();
    blocks?.querySelectorAll<HTMLElement>(':scope > *').forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
    if (blocks) blocks.style.opacity = '';
    card.setAttribute('data-motion-settled', 'true');
    options.onSettled?.();
  };

  /* ---- one frame: every value at k ---- */
  const apply = (k: number) => {
    const c = clamp01(k);
    // card box (mpCard): lc() geometry, bottom radii 0 → 24
    const left = lerp(src.left, dstCard.left, c);
    const top = lerp(src.top, dstCard.top, c);
    const width = lerp(src.width, dstCard.width, c);
    const height = lerp(src.height, dstCard.height, c);
    L.set(surface, 'left', `${r3(left - cbLeft)}px`);
    L.set(surface, 'top', `${r3(top - cbTop)}px`);
    L.set(surface, 'width', `${r3(width)}px`);
    L.set(surface, 'height', `${r3(height)}px`);
    const br = `${r3(24 * c)}px`;
    L.set(surface, 'borderBottomLeftRadius', br);
    L.set(surface, 'borderBottomRightRadius', br);
    // label (mpLabel)
    if (label && labelDst && snapshot.label) {
      const s = snapshot.label.rect;
      L.set(
        label,
        'transform',
        `translate(${r3((s.left - labelDst.left) * (1 - k))}px,${r3((s.top - labelDst.top) * (1 - k))}px)`,
      );
      L.set(label, 'color', mixRgb(snapshot.label.color, labelColor, c));
    }
    // amount glyphs (flipApply)
    flips.forEach(({ el, s, d }) => {
      const x = lerp(s.x, d.x, k);
      const b = lerp(s.b, d.b, k);
      const f = lerp(s.f, d.f, k);
      const sc = f / d.f;
      const scaled = Math.abs(sc - 1) >= 0.002;
      L.set(
        el,
        'transform',
        `translate(${r3(x - d.x)}px,${r3(b - d.b)}px)${scaled ? ` scale(${Math.round(sc * 1e5) / 1e5})` : ''}`,
      );
      if (s.color && d.color) L.set(el, 'color', mixRgb(s.color, d.color, c));
      if (s === d) L.set(el, 'opacity', String(r3(win(k, 0.3, 0.75))));
    });
    // pencil (mpPencil)
    if (pencil) {
      const e = win(k, 0.3, 0.9);
      L.set(pencil, 'opacity', String(r3(e)));
      L.set(pencil, 'visibility', e > 0 ? 'visible' : 'hidden');
      L.set(pencil, 'transformOrigin', '30% 85%');
      L.set(
        pencil,
        'transform',
        e >= 1
          ? 'none'
          : `translateX(${Math.round((1 - e) * -6 * 100) / 100}px) rotate(${Math.round((1 - e) * -24 * 100) / 100}deg) scale(${Math.round((0.5 + 0.5 * e) * 1000) / 1000})`,
      );
    }
    // slider (mpSlider + mpRange)
    if (slider) {
      const e = win(k, 0.3, 0.88);
      L.set(slider, 'opacity', String(r3(e)));
      L.set(slider, 'visibility', e > 0 ? 'visible' : 'hidden');
      L.set(
        slider,
        'transform',
        `translateY(${r3((1 - e) * MT.Y.block + sliderRide * (1 - k))}px)`,
      );
    }
    if (divider) L.set(divider, 'opacity', String(r3(win(k, 0.4, 0.92))));
    if (term) L.set(term, 'opacity', String(r3(win(k, 0.5, 0.96))));
    // chips (mpChips / mpChip)
    if (rowBox) {
      chipPaths.forEach(({ el, s, d }) => {
        L.set(el, 'left', `${r3(lerp(s.left, d.left, c) - rowBox.left)}px`);
        L.set(el, 'top', `${r3(lerp(s.top, d.top, k) - rowBox.top)}px`);
        L.set(el, 'width', `${r3(lerp(s.width, d.width, c))}px`);
        L.set(el, 'height', `${r3(lerp(s.height, d.height, c))}px`);
      });
    }
    // ghost: caption + prompt (capO / capY), caret (mpCaretFade)
    const capT = clamp01(1 - 2 * k);
    const capO = capT * capT * (3 - 2 * capT);
    ghostCap.forEach((el) => {
      L.set(el, 'opacity', String(r3(capO)));
      L.set(el, 'visibility', capO > 0 ? 'visible' : 'hidden');
      L.set(
        el,
        'transform',
        `translate(${r3(-rowDx * k)}px,${r3(-rowDy * k)}px)`,
      );
    });
    ghostCaret.forEach((el) => {
      L.set(el, 'opacity', String(r3(1 - c)));
      const t = tailLead;
      L.set(
        el,
        'transform',
        t
          ? `translate(${r3((t.d.x - t.s.x) * k)}px,${r3((t.d.b - t.s.b) * k)}px)`
          : 'none',
      );
    });
    // page tint + Confirm bar (mpGrad / mpBtn / mpBar), bk = k01
    if (grad) L.set(grad, 'opacity', String(r3(c)));
    if (cta) {
      L.set(cta, 'opacity', String(Math.min(1, r3(c * 1.45))));
      L.set(cta, 'translate', `0 ${((1 - c) * MT.Y.block).toFixed(2)}px`);
    }
    if (veil) L.set(veil, 'opacity', String(r3(c)));
  };

  /* ---- clocks started with the morph ---- */
  ghostPad.forEach((el) => {
    clocksLeft++;
    plays.push(
      animate(
        el,
        { opacity: PAD_OUT.opacity, y: PAD_OUT.y },
        {
          ...PAD_OUT.transition,
          onComplete: () => {
            clocksLeft--;
            end();
          },
        },
      ),
    );
  });
  if (blocks) {
    blocks.style.opacity = '0';
    clocksLeft++;
    plays.push(
      animate(
        blocks,
        { opacity: [0, 1] },
        {
          duration: 0.2,
          onComplete: () => {
            clocksLeft--;
            end();
          },
        },
      ),
    );
    Array.from(blocks.children).forEach((child, i) => {
      const R2 = WD_REVEAL(i);
      clocksLeft++;
      plays.push(
        animate(
          child as HTMLElement,
          {
            opacity: [R2.initial.opacity, 1],
            y: [R2.initial.y, 0],
            scale: [R2.initial.scale, 1],
          },
          {
            ...R2.transition,
            ease: EASE_IN,
            onComplete: () => {
              clocksLeft--;
              end();
            },
          },
        ),
      );
    });
  }

  const progress = createProgress(0, apply);
  apply(0);
  plays.push(
    progress.to(1, MORPH_SPRING, () => {
      springDone = true;
      apply(1);
      end();
    }),
  );

  return () => {
    plays.forEach((p) => p.stop());
    springDone = true;
    clocksLeft = 0;
    end();
  };
}
