"""
Run headless with:
  blender --background --factory-startup --python blender-scripts/preview_render.py -- <input.glb> <output.png>

Renders a quick front-view PNG of a GLB so its pose can be checked (e.g.
whether it's close enough to a T/A-pose for Mixamo's auto-rigger) without
opening Blender's UI.
"""

import math
import sys

import bpy
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1 :]
input_path, output_path = argv[0], argv[1]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.gltf(filepath=input_path)

mesh_objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]

min_co = [math.inf, math.inf, math.inf]
max_co = [-math.inf, -math.inf, -math.inf]
for obj in mesh_objects:
    for corner in obj.bound_box:
        world_corner = obj.matrix_world @ Vector(corner)
        for i in range(3):
            min_co[i] = min(min_co[i], world_corner[i])
            max_co[i] = max(max_co[i], world_corner[i])

center = [(min_co[i] + max_co[i]) / 2 for i in range(3)]
size = max(max_co[i] - min_co[i] for i in range(3))

bpy.ops.object.light_add(type="SUN", location=(center[0] + size, center[1] - size, center[2] + size))
bpy.context.object.data.energy = 3

bpy.ops.object.light_add(type="SUN", location=(center[0] - size, center[1] + size, center[2] + size))
bpy.context.object.data.energy = 1.5

cam_distance = size * 1.8
bpy.ops.object.camera_add(
    location=(center[0], center[1] - cam_distance, center[2]),
    rotation=(math.radians(90), 0, 0),
)
camera = bpy.context.object
bpy.context.scene.camera = camera
camera.data.lens = 50

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 800
scene.render.resolution_y = 1000

if scene.world is None:
    scene.world = bpy.data.worlds.new("World")
scene.world.use_nodes = True
bg = scene.world.node_tree.nodes.get("Background")
if bg:
    bg.inputs[0].default_value = (0.97, 0.95, 0.92, 1.0)

scene.render.filepath = output_path
bpy.ops.render.render(write_still=True)

print(f"Wrote {output_path}")
