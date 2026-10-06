import * as THREE from "three";

// Explicit sRGB->linear conversion (rather than relying on the
// color-managed default) so these hex values are never ambiguous: a flat
// #1B2A6B swatch and this "ink" material should match exactly.
function srgbColor(hex: number): THREE.Color {
  return new THREE.Color().setHex(hex, THREE.SRGBColorSpace);
}

// Recolored from the lab's ink-blue palette to match the site's burgundy
// brand accent (REDESIGN_HANDOFF.md / globals.css --accent: #8B1E3F).
// Shell harmonises with the site's near-white background instead of the
// lab's warmer paper tone, so the robot doesn't look like it came from a
// different site. Joints are a darker shade of the same burgundy, not a
// separate color.
const SHELL_OFFWHITE = 0xf3efec;
const ACCENT_BURGUNDY = 0x8b1e3f;
const JOINT_BURGUNDY_DARK = 0x4a0f20;

type Role = "shell" | "panel" | "joint";

// The V-Bot GLB's original material names (from the Sketchfab source,
// carried through Mixamo rigging) map cleanly onto the spec's shell/panel/
// joint split, so recolouring is a simple name lookup rather than needing
// per-mesh heuristics. "shell" = the model's originally-white main
// surfaces, "panel" = its originally-black accent surfaces (the V shapes);
// per the agreed design, shell renders off-white and panel renders ink.
// The face (eyes/mouth) isn't a material at all - see RobotFace.ts.
const MATERIAL_ROLE_BY_NAME: Record<string, Role> = {
  VBOT_Main_members1: "shell",
  VBOT_main_torso1: "shell",
  VBOT_Secondary_members1: "panel",
  VBOT_secondary_torso1: "panel",
  VBOT_metal3: "joint",
  VBOT_metal4: "joint",
  VBOT_rubber1: "joint",
};

function buildRoleMaterials() {
  return {
    shell: new THREE.MeshPhysicalMaterial({
      color: srgbColor(SHELL_OFFWHITE),
      metalness: 0.05,
      roughness: 0.6,
      clearcoat: 0.15,
      clearcoatRoughness: 0.6,
    }),
    panel: new THREE.MeshPhysicalMaterial({
      color: srgbColor(ACCENT_BURGUNDY),
      metalness: 0.05,
      roughness: 0.65,
    }),
    joint: new THREE.MeshPhysicalMaterial({
      color: srgbColor(JOINT_BURGUNDY_DARK),
      metalness: 0.05,
      roughness: 0.65,
    }),
  };
}

// Walks the loaded GLTF scene and replaces every mesh's original material
// with one of the shared ink-palette materials, keyed by the original
// material's name.
export function recolorRealRobot(root: THREE.Object3D) {
  const roleMaterials = buildRoleMaterials();
  const unmatched = new Set<string>();

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    const originalName = Array.isArray(obj.material) ? obj.material[0]?.name : obj.material?.name;
    const role = originalName ? MATERIAL_ROLE_BY_NAME[originalName] : undefined;
    if (!role) {
      if (originalName) unmatched.add(originalName);
      return;
    }
    obj.material = roleMaterials[role];
    obj.castShadow = true;
    obj.receiveShadow = true;
  });

  if (unmatched.size > 0) {
    console.warn("recolorRealRobot: unmatched material names, left as-is:", [...unmatched]);
  }
}
