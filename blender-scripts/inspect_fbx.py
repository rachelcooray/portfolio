"""
Run headless with:
  blender --background --factory-startup --python blender-scripts/inspect_fbx.py -- <input.fbx>

Imports an FBX and reports its armature (bone names), mesh objects, and
whether animation actions are present, so a Mixamo export can be sanity
checked before it's used.
"""

import sys

import bpy

argv = sys.argv[sys.argv.index("--") + 1 :]
input_path = argv[0]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.fbx(filepath=input_path)

armatures = [o for o in bpy.context.scene.objects if o.type == "ARMATURE"]
meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]

print(f"=== {input_path} ===")
print(f"armature count: {len(armatures)}")
for arm in armatures:
    bones = arm.data.bones
    print(f"  armature '{arm.name}': {len(bones)} bones")
    for b in list(bones)[:15]:
        print(f"    {b.name}")
    if len(bones) > 15:
        print(f"    ... and {len(bones) - 15} more")

print(f"mesh count: {len(meshes)}")
for m in meshes:
    vg = len(m.vertex_groups)
    has_armature_mod = any(mod.type == "ARMATURE" for mod in m.modifiers)
    print(f"  mesh '{m.name}': {len(m.data.vertices)} verts, {vg} vertex groups, armature modifier: {has_armature_mod}")

print(f"actions: {len(bpy.data.actions)}")
for a in bpy.data.actions:
    print(f"  action '{a.name}': frame range {a.frame_range}")
