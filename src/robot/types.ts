export type GuideState = "idle" | "talking" | "pointing" | "thinking" | "handover";

// Maps the robot's own object/bone names onto the names the Guide module
// expects. Mixamo-compatible naming so retargeted Mixamo animations can
// drive a real rigged model later. The placeholder uses these names
// directly; a real GLB will need its own mapping filled in here when it is
// wired up in Milestone 4.
export interface RobotBoneNames {
  hips: string;
  spine: string;
  chest: string;
  neck: string;
  head: string;
  shoulderR: string;
  upperArmR: string;
  forearmR: string;
  handR: string;
  shoulderL: string;
  upperArmL: string;
  forearmL: string;
  handL: string;
  upLegR: string;
  legR: string;
  footR: string;
  upLegL: string;
  legL: string;
  footL: string;
  // Only the placeholder has a literal "Visor" mesh; the real model's
  // face is built at runtime by RobotFace.ts instead (see Guide.ts).
  visor?: string;
}
