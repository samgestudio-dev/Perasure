# Prompts for the developers' AI

Copy one of these into your AI coding assistant. They work whether the package is the design repo's folder
(`samgestudio-dev/Perasure`, branch `tokens/rebrand-v3`, `rebrand/handoff/ai/`) or the unpacked zip (the folder holding this file).

## H5 team (`phi_h5_025`)

```text
You are applying the PeraSure rebrand (visual + motion only) to phi_h5_025.

The hand-off package is the folder that holds README.md, OPEN-QUESTIONS.md and PROMPTS.md
(design repo samgestudio-dev/Perasure, branch tokens/rebrand-v3, folder rebrand/handoff/ai/, or the unpacked zip).
Read its README.md in full first, then OPEN-QUESTIONS.md. Follow the README exactly.

Setup:
  export H=<absolute path to the package folder>
  export REPO=<absolute path to a clean phi_h5_025 checkout at 0d9bdd4 or newer>
  In $REPO: clean working tree, Node 22+, Python 3.8+, npm ci done.

Rules:
- Keep the README's "Apply order" and its three commit points (A visual, B motion, C step 8),
  conventional commit messages: style(rebrand): ...
- If the branch is newer than 0d9bdd4, run python3 "$H/tools/apply.py" "$REPO" --step all --dry-run first.
- Never guess: if an edit reports anchor-missing, stop and list the edit ids.
- Visual changes only. Don't change component structure, props, behaviour, flows or copy,
  except the four edits marked structural: "owner-approved" (E023, E542, E543, E400).
- Don't apply anything from 08-native/ (native screens are not in this repo).
- Precedence: 02-changes/changes-by-file.json > 01-tokens/token-map.json > 01-tokens/unresolved.md.
- Items in OPEN-QUESTIONS.md and 07-motion/OPEN-DECISIONS.md are not decided: leave them as the package has them and list them.

When done, run the README's "Verify" checklist (tsc, type-check, build, npm test) and report:
the counts from apply.py, anything skipped or anchor-missing, the test results, and the three commit hashes.
```

## Native team (Android / iOS)

```text
Implement the new ID camera layout (N-001) in the native screen opened by the JS bridge method startOcrCapture.
Spec: 08-native/README.md and 08-native/id-camera/spec.json in the hand-off package;
reference pictures 08-native/id-camera/figma-front-360x749.png and figma-back-360x749.png.
Change the layout only: keep capture, OCR, upload, the callback and the cardType handling as they are.
Use the geometry formula in spec.json and check your result against both examples (360x749 and 360x640).
Side title: the H5 page doesn't pass front / back. If the screen can't tell, keep its current title and say so.
Report the screen sizes you checked and any value that differs from spec.json.
```
