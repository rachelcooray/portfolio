"""
Run headless with:
  blender --background --factory-startup --python blender-scripts/combine_character.py -- \
    <character.fbx> <clip1.fbx> <clip1-name> [<clip2.fbx> <clip2-name> ...] <output.glb>

Combines a rigged Mixamo character (mesh + skin + armature) with one or more
animation-only Mixamo exports (same skeleton, no mesh) into a single GLB.
Each animation becomes its own named glTF animation clip (via an NLA track),
so three.js AnimationMixer can select clips by name ("idle", "talk", ...).

Horizontal (X/Z) root translation on the Hips bone is zeroed per clip so
non-locomotion clips don't drift the character across the scene.

Applies angle-based smooth shading to every mesh before export.

(The face - eyes and mouth - is NOT built here. Earlier versions tried a
Blender-side faceplate (cut from the helmet's own triangles, then a
shrinkwrapped decal); both broke in different ways. The face is now
built in three.js at runtime instead - see src/robot/RobotFace.ts -
which also avoids re-running this whole pipeline every time the mouth
shape logic changes.)
"""

import math
import sys

import bpy


def iter_fcurves(action):
    """Yields every F-Curve in an action, across Blender's old flat
    action.fcurves (pre-4.4) and the newer layers/strips/channelbags
    animation data model (4.4+, used by Blender 5.x)."""
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return
    for layer in action.layers:
        for strip in layer.strips:
            for channelbag in getattr(strip, "channelbags", []):
                yield from channelbag.fcurves


argv = sys.argv[sys.argv.index("--") + 1 :]
character_path = argv[0]
output_path = argv[-1]
clip_args = argv[1:-1]
clips = [(clip_args[i], clip_args[i + 1]) for i in range(0, len(clip_args), 2)]

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.fbx(filepath=character_path)
main_armature = next(o for o in bpy.context.scene.objects if o.type == "ARMATURE")
if main_armature.animation_data is None:
    main_armature.animation_data_create()

for fbx_path, clip_name in clips:
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.fbx(filepath=fbx_path)
    after = set(bpy.context.scene.objects)
    new_objs = after - before
    anim_armature = next(o for o in new_objs if o.type == "ARMATURE")
    action = anim_armature.animation_data.action
    action.name = clip_name
    action.use_fake_user = True

    for fc in iter_fcurves(action):
        if fc.data_path.endswith("location") and "Hips" in fc.data_path and fc.array_index in (0, 2):
            for kp in fc.keyframe_points:
                kp.co[1] = 0.0
                kp.handle_left[1] = 0.0
                kp.handle_right[1] = 0.0

    track = main_armature.animation_data.nla_tracks.new()
    track.name = clip_name
    track.strips.new(clip_name, int(action.frame_range[0]), action)

    for obj in new_objs:
        bpy.data.objects.remove(obj, do_unlink=True)

# Smooth shading: curved panels were reading as flat facets. Angle-based
# smoothing keeps genuinely sharp panel edges crisp (>35 degrees) while
# smoothing the curved shell in between.
for obj in bpy.context.scene.objects:
    if obj.type != "MESH":
        continue
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    obj.select_set(False)

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format="GLB",
    export_animation_mode="NLA_TRACKS",
    export_skins=True,
    export_morph=False,
    export_apply=False,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
    export_draco_position_quantization=14,
    export_draco_normal_quantization=10,
    export_draco_texcoord_quantization=12,
)

print(f"Wrote {output_path} with clips: {[c[1] for c in clips]}")
