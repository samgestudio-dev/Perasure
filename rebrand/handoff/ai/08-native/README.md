# 08 · Native app screens (not in phi_h5_025)

Rebrand changes to screens the **native app** draws, so they cannot be applied in the H5 repo. Give this folder to the Android / iOS
developers (and their AI). Nothing here changes `phi_h5_025`, and `tools/apply.py` does not touch it.

| Id | Screen | Opened from H5 by | Spec | Figma |
|---|---|---|---|---|
| N-001 | ID camera (front / back of the ID) | `startOcrCapture(cardType, desc, callbackName)` — `src/utils/jsbridge/media.ts` `openNativeCameraCapture`, called by `src/pages/AuthPage/Identity/index.tsx` `handleCameraUpload` | `id-camera/spec.json` | `11163:17229` (front), `11163:17306` (back) |

## N-001 · ID camera layout (design owner, 2026-11-25)

The owner asked for the ID camera to be laid out like CashSaya's ID camera, **keeping PeraSure's look and pieces**. Only the
layout changes. Capture, OCR, upload, the callback and the `cardType` frame choice stay as they are.

**What it looks like.** The phone stays in portrait, black screen, camera preview behind, the area outside the box dimmed. The content is laid
out for an ID held sideways. Title, box and hint form one column, turned 90° clockwise, so the title (green ID card icon + "Front side of
your ID") is on the right and the hint is on the left, both reading top to bottom. Back button top right, shutter bottom centre (both unchanged).

**The rule.** Everything is in dp / pt, the 360-wide design size.

1. **Space for the box:** from 24 under the back button to 24 above the shutter.
2. **Box shape:** an ID card (ID-1, long side = short side × 1.585). It's as big as fits: the short side (its width on screen) is
   `min(screenWidth − 2·8 − 2·28 − 2·4, spaceHeight / 1.585)`. On normal phones the width decides; on short screens the height does.
3. **Box position and look:** centred in that space. 2.5 white line inside, radius 8, no fill, everything outside it dimmed (black 60 %).
4. **Side title:** 4 to the right of the box, in a 28-wide lane, centred along the box. ID card icon 28 + 12 + text, Title/sm
   (Hanken Grotesk Bold 18/24, −1 %), colour `#298648`.
5. **Hint:** 4 to the left of the box, centred along it, one line. Body/sm (Hanken Grotesk Regular 12/16), white. Its lane is also
   28 wide, so the box stays centred; the text sits against the box. If a large system font makes it longer than the box, it wraps
   inside the box's length.

**Check values** (360 × 749 with a 40 status bar = the Figma frame): box x 40, y 142.6, 280 × 443.8. Title lane x 324, hint x 20
(16 tall), back button x 304 / y 56, shutter x 150 / y 633. A short screen (360 × 640) is in `spec.json` → `examples`.

**Copy:** "Front side of your ID" / "Back side of your ID". Hint: "Make sure every detail is clear and the whole ID fits in the box."
The new hint replaces "Please make sure that all the details are clear and the whole ID fits in the box", which needed two lines.

**Before:** a fixed 259 × 382 box starting 184 from the top, with the hint over two lines.

**Open:** the H5 page doesn't pass the side to the native camera (`openNativeCameraCapture(cardType)` has no side). If the native
screen can't tell front from back, keep its current title. Passing the side (e.g. through `desc`) would change H5 behaviour,
so it isn't in this package.

**References:** `id-camera/figma-front-360x749.png` and `id-camera/figma-back-360x749.png` are the Figma frames after the change. The live
demo is `prototypes/app/index.html?page=camera&auto=0` on the design repo's `tokens/rebrand-v3` branch (`PS.IdCamera`, CSS `.ps-cam*`). It
matches Figma within 1 px.
