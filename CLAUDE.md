# Robot Guide Lab — key decisions

Feasibility test for a 3D robot guide module, to be ported into the real
portfolio site (`rachelcooray.com`) later. **This is not that site** —
don't add real portfolio content here (Experience, Education, etc.); that
belongs in the separate production-site project. Keep only the test
elements needed to exercise the robot (heading, card, button).

## Stack
Vite + vanilla TypeScript, three.js, GSAP (not yet wired up).

## Palette
- Paper `#F7F3EA`, ink `#1B2A6B`, muted `#5A6380`, rule `#DED7C6`, highlighter `#F2D45C`.
- Real robot: off-white shell `#EEE8DA` (main surfaces), ink `#1B2A6B` accent panels, darker ink `#121C4A` joints.
- Face: ink features drawn directly on the helmet (not a glowing screen) — see below.

## Model pipeline
- Source: Sketchfab "V-Bot White and Black (Warzone Arena)" by Tsaphnat Mbuyi, CC-BY-4.0 — **needs attribution credit** wherever this ships publicly.
- Rigged via Mixamo's auto-rigger (Standard 65-bone skeleton). Source FBX files live in `mixamo/`.
- `blender-scripts/combine_character.py` combines the rigged character + animation FBX files into one GLB, with smooth shading applied, then exports with Draco compression.
  ```bash
  blender --background --factory-startup --python blender-scripts/combine_character.py -- \
    mixamo/character-tpose-skin.fbx \
    mixamo/anim-idle.fbx idle \
    mixamo/anim-talk.fbx talk \
    mixamo/anim-talk-2.fbx talk2 \
    mixamo/anim-point.fbx point \
    mixamo/anim-wave.fbx wave \
    public/models/robot.glb
  ```
- Clips embedded: `idle`, `talk`, `talk2`, `point`, `wave`. Still missing: `think`, `walk` (couldn't find matching Mixamo clips yet).
- GLTFLoader strips `:` from node names, so `mixamorig:Head` becomes `mixamorigHead` at runtime — see `src/robot/realRobotBoneNames.ts`.
- Materials recolored by original material name (`VBOT_Main_members1` etc. → shell/panel/joint) in `src/robot/realRobotMaterials.ts`.

## Face: ink-drawn, not a glass screen
Three earlier approaches failed and were abandoned, in order:
1. Cutting a faceplate from the helmet's existing triangles in Blender — jagged edge on a low-poly mesh, selection kept catching Spine2/Shoulder-weighted collar geometry.
2. A shrinkwrapped decal in Blender, skinned to Head — three separate bugs (wrong `matrix_parent_inverse` from raw `.parent =` assignment, then an n-gon that didn't subdivide correctly). Not worth a fourth attempt.
3. **Current**: `src/robot/RobotFace.ts` builds the face entirely in three.js at runtime — ink eye ovals + a mouth line (TubeGeometry on a closed curve), raycast against the head mesh for position/normal, parented to the Head bone with a compensating inverse-scale (the Mixamo skeleton's bones carry a much larger native scale than the mesh surface data — geometry sized in real-world metres under a bone needs `1/boneWorldScale` correction or it renders microscopic).

Mouth visemes are a single parametric model (ellipse half-width/half-height, lerped on morph — same idea as the old canvas-based pill shapes). Press **`v`** in the running lab to cycle every viseme plus a looping test-sentence.

## Known gotchas hit in this project
- Node 20.3 is too old for several tools (`create-vite`, `@gltf-transform/functions`) — worked around by using Blender's own Draco export instead of `gltf-transform` CLI.
- Blender headless mode: `material_slot_remove_unused()` and `mesh.separate()` behave differently depending on `tool_settings.mesh_select_mode` — force `(False, False, True)` (face-select only) before relying on face selection.
- Parenting an object to an armature via `obj.parent = x` in Python does **not** compute `matrix_parent_inverse` — use `bpy.ops.object.parent_set(type="OBJECT", keep_transform=True)` instead.
- The home directory (`~`) is a separate, unrelated git repo (tracks Ambrosia, carbon-footprint, etc.). This project has its own independent repo — never assume they're the same.

## File layout
- `src/robot/Guide.ts` — the framework-agnostic Guide class (load, setState, lookAtCursor, pointAt, say, destroy).
- `src/robot/createPlaceholderRobot.ts` + `Face.ts` — the primitive placeholder (used if the real model fails to load). Untouched by the real-model work above.
- `src/robot/RobotFace.ts` — real model's face (see above).
- `src/robot/realRobotBoneNames.ts`, `realRobotMaterials.ts` — real model bone/material mapping.
- `blender-scripts/` — pipeline scripts. `combine_character.py` is the one that matters; the rest are one-off debugging scripts from getting here.
