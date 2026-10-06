"""
Run headless with:
  blender --background --factory-startup --python blender-scripts/inspect_head_geometry.py -- <character.fbx>

Imports the character alone (no animations). Object_6/Object_7 span the
whole upper body, not just the head, so this filters to a candidate Z/X
band (inferred from earlier world-space raycasting: head sits roughly at
raw Z 152-175) and reports the Y (depth) and normal distribution within
it, to calibrate exact thresholds before committing to any mesh edits.
"""

import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1 :]
character_path = argv[0]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.fbx(filepath=character_path)

Z_MIN, Z_MAX = 150, 178
X_MIN, X_MAX = -12, 12

for name in ["Object_6", "Object_7"]:
    obj = bpy.data.objects.get(name)
    if obj is None:
        continue
    mesh = obj.data
    candidates = []
    for poly in mesh.polygons:
        center = poly.center
        if Z_MIN <= center.z <= Z_MAX and X_MIN <= center.x <= X_MAX:
            candidates.append(poly)

    print(f"=== {name}: {len(candidates)} candidate faces in Z[{Z_MIN},{Z_MAX}] X[{X_MIN},{X_MAX}] ===")
    if not candidates:
        continue

    ys = [p.center.y for p in candidates]
    print(f"  candidate Y range: {round(min(ys), 3)} to {round(max(ys), 3)}")

    fwd_count = sum(1 for p in candidates if p.normal.y > 0.3)
    print(f"  of those, normal.y > 0.3 (forward-ish): {fwd_count}")

    fwd = [p for p in candidates if p.normal.y > 0.3]
    if fwd:
        fys = [p.center.y for p in fwd]
        fzs = [p.center.z for p in fwd]
        fxs = [p.center.x for p in fwd]
        print(f"  forward-facing subset: Y {round(min(fys),3)}..{round(max(fys),3)}, "
              f"Z {round(min(fzs),3)}..{round(max(fzs),3)}, X {round(min(fxs),3)}..{round(max(fxs),3)}")

print("Blender quit")
