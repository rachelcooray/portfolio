import type { RobotBoneNames } from "./types";

// Maps the Guide module's generic bone names onto the Mixamo skeleton baked
// into /public/models/robot.glb (V-Bot, rigged via Mixamo's auto-rigger,
// Standard 65-bone skeleton). The source rig uses "mixamorig:" prefixed
// names (e.g. "mixamorig:Hips"), but three.js's GLTFLoader strips
// characters like ":" from node names when building the scene graph
// (PropertyBinding reserves them for animation track paths), so at runtime
// the names appear without the colon. "Chest" has no direct Mixamo
// equivalent, so it maps to Spine2 (the uppermost spine segment, nearest
// the shoulders).
export const realRobotBoneNames: RobotBoneNames = {
  hips: "mixamorigHips",
  spine: "mixamorigSpine",
  chest: "mixamorigSpine2",
  neck: "mixamorigNeck",
  head: "mixamorigHead",
  shoulderR: "mixamorigRightShoulder",
  upperArmR: "mixamorigRightArm",
  forearmR: "mixamorigRightForeArm",
  handR: "mixamorigRightHand",
  shoulderL: "mixamorigLeftShoulder",
  upperArmL: "mixamorigLeftArm",
  forearmL: "mixamorigLeftForeArm",
  handL: "mixamorigLeftHand",
  upLegR: "mixamorigRightUpLeg",
  legR: "mixamorigRightLeg",
  footR: "mixamorigRightFoot",
  upLegL: "mixamorigLeftUpLeg",
  legL: "mixamorigLeftLeg",
  footL: "mixamorigLeftFoot",
  // No "visor" mesh on the real model - the face is built at runtime by
  // RobotFace.ts and parented directly to the resolved Head bone.
};
