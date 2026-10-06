import bpy

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.fbx(filepath="mixamo/character-tpose-skin.fbx")

obj = bpy.data.objects.get("Object_6")
print("local vertex.co (first 3):")
for v in list(obj.data.vertices)[:3]:
    print(" ", tuple(round(c, 4) for c in v.co))

bpy.ops.object.select_all(action="DESELECT")
obj.select_set(True)
bpy.data.objects.get("Armature").select_set(True)
bpy.ops.export_scene.gltf(
    filepath="/tmp/object6_alone_test.glb",
    export_format="GLB",
    use_selection=True,
    export_skins=True,
)
print("exported /tmp/object6_alone_test.glb")
