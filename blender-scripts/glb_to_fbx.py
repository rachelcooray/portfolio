"""
Run headless with:
  blender --background --factory-startup --python blender-scripts/glb_to_fbx.py -- <input.glb> <output.fbx>

Converts a GLB to FBX so it can be uploaded to Mixamo's auto-rigger, which
does not accept GLB directly. Clears the default scene first since
--factory-startup still loads Blender's default cube/camera/light.
"""

import sys
import bpy

argv = sys.argv[sys.argv.index("--") + 1 :]
input_path, output_path = argv[0], argv[1]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.gltf(filepath=input_path)

bpy.ops.export_scene.fbx(
    filepath=output_path,
    use_selection=False,
    global_scale=1.0,
    apply_unit_scale=True,
    bake_space_transform=True,
    object_types={"MESH"},
    mesh_smooth_type="FACE",
    add_leaf_bones=False,
)

print(f"Wrote {output_path}")
