"""
Run headless with:
  blender --background --factory-startup --python blender-scripts/preview_faceplate_selection.py -- <character.fbx> <output.png>

Imports the character, selects the candidate faceplate faces (same
criteria as inspect_head_geometry.py), colours them bright red, and
renders a view (camera framed from the actual mesh bounding box, same
approach as preview_render.py) so the selection can be checked visually
before any destructive mesh edit (separate/UV-unwrap) is committed.
"""

import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :]
character_path, output_path = argv[0], argv[1]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.fbx(filepath=character_path)

Z_MIN, Z_MAX = 150, 178
X_MIN, X_MAX = -12, 12
NORMAL_Y_MIN = 0.7
Y_MIN = 0.0

highlight_mat = bpy.data.materials.new("FaceplateHighlight")
highlight_mat.use_nodes = True
bsdf = highlight_mat.node_tree.nodes.get("Principled BSDF")
if bsdf:
    bsdf.inputs["Base Color"].default_value = (1, 0, 0, 1)
    if "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = (1, 0, 0, 1)
        bsdf.inputs["Emission Strength"].default_value = 1.0

highlighted_count = 0
for name in ["Object_6", "Object_7"]:
    obj = bpy.data.objects.get(name)
    if obj is None:
        continue
    mesh = obj.data
    obj.data.materials.append(highlight_mat)
    highlight_idx = len(obj.data.materials) - 1
    for poly in mesh.polygons:
        c = poly.center
        if Z_MIN <= c.z <= Z_MAX and X_MIN <= c.x <= X_MAX and poly.normal.y > NORMAL_Y_MIN and c.y > Y_MIN:
            poly.material_index = highlight_idx
            highlighted_count += 1
    mesh.update()
    obj.data.update_tag()
    actual = sum(1 for p in mesh.polygons if p.material_index == highlight_idx)
    print(f"{name}: material slots={len(obj.data.materials)}, highlight_idx={highlight_idx}, "
          f"assigned-this-pass={highlighted_count}, actual-matching-index={actual}, "
          f"obj.scale={tuple(obj.scale)}, obj.location={tuple(obj.location)}")
print(f"Highlighted {highlighted_count} faces total")

# Frame using the actual mesh bounding box (robust to whatever axis
# convention this import ended up in), same approach as preview_render.py.
mesh_objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]
min_co = [math.inf, math.inf, math.inf]
max_co = [-math.inf, -math.inf, -math.inf]
for obj in mesh_objects:
    for corner in obj.bound_box:
        wc = obj.matrix_world @ Vector(corner)
        for i in range(3):
            min_co[i] = min(min_co[i], wc[i])
            max_co[i] = max(max_co[i], wc[i])
center = [(min_co[i] + max_co[i]) / 2 for i in range(3)]
size = max(max_co[i] - min_co[i] for i in range(3))

bpy.ops.object.light_add(type="SUN", location=(center[0] + size, center[1] - size, center[2] + size))
bpy.context.object.data.energy = 3
bpy.ops.object.light_add(type="SUN", location=(center[0] - size, center[1] + size, center[2] + size))
bpy.context.object.data.energy = 1.5

# Head is the top ~15% of the full-body bounding box; frame tightly on it.
head_z = max_co[2] - size * 0.08
cam_distance = size * 0.35
bpy.ops.object.camera_add(
    location=(center[0], center[1] - cam_distance, head_z),
    rotation=(math.radians(90), 0, 0),
)
camera = bpy.context.object
bpy.context.scene.camera = camera
camera.data.lens = 85

scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 16
scene.render.resolution_x = 700
scene.render.resolution_y = 700
if scene.world is None:
    scene.world = bpy.data.worlds.new("World")
scene.world.use_nodes = True
bg = scene.world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (0.6, 0.6, 0.6, 1.0)

scene.render.filepath = output_path
bpy.ops.render.render(write_still=True)

print(f"Wrote {output_path}, bbox min={min_co} max={max_co}")
