import * as THREE from "three";
import { Face } from "./Face";
import type { RobotBoneNames } from "./types";

const INK = 0x1b2a6b;
const INK_JOINT = 0x121c4f;
const OFFWHITE = 0xeee8da;

export const placeholderBoneNames: RobotBoneNames = {
  hips: "Hips",
  spine: "Spine",
  chest: "Chest",
  neck: "Neck",
  head: "Head",
  shoulderR: "Shoulder_R",
  upperArmR: "UpperArm_R",
  forearmR: "Forearm_R",
  handR: "Hand_R",
  shoulderL: "Shoulder_L",
  upperArmL: "UpperArm_L",
  forearmL: "Forearm_L",
  handL: "Hand_L",
  upLegR: "UpLeg_R",
  legR: "Leg_R",
  footR: "Foot_R",
  upLegL: "UpLeg_L",
  legL: "Leg_L",
  footL: "Foot_L",
  visor: "Visor",
};

function bodyMaterial() {
  return new THREE.MeshStandardMaterial({ color: INK, roughness: 0.55, metalness: 0.15 });
}

function panelMaterial() {
  return new THREE.MeshStandardMaterial({ color: OFFWHITE, roughness: 0.6, metalness: 0.05 });
}

function jointMaterial() {
  return new THREE.MeshStandardMaterial({ color: INK_JOINT, roughness: 0.4, metalness: 0.25 });
}

// A tapered limb segment (shoulder/hip end wider than elbow/knee end), with
// an off-white panel band near the wide end and a small joint sphere
// bridging the seam to the next segment.
function buildTaperedSegment(options: {
  parent: THREE.Object3D;
  radiusTop: number;
  radiusBottom: number;
  length: number;
  panelBand?: boolean;
  jointRadius: number;
}): THREE.Object3D {
  const { parent, radiusTop, radiusBottom, length, panelBand, jointRadius } = options;

  const joint = new THREE.Mesh(new THREE.SphereGeometry(jointRadius, 12, 12), jointMaterial());
  parent.add(joint);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, length, 12),
    bodyMaterial(),
  );
  shaft.position.set(0, -length / 2, 0);
  parent.add(shaft);

  if (panelBand) {
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop * 1.08, radiusTop * 0.92, length * 0.32, 12),
      panelMaterial(),
    );
    band.position.set(0, -length * 0.2, 0);
    parent.add(band);
  }

  const end = new THREE.Object3D();
  end.position.set(0, -length, 0);
  parent.add(end);

  return end;
}

// Builds one arm (shoulder -> elbow -> wrist -> simple three-finger hand),
// long enough that the relaxed hand reaches roughly mid-thigh.
function buildArm(chest: THREE.Object3D, side: "R" | "L", outwardDeg: number, elbowBendDeg: number) {
  // Character's own right is screen-left when facing the camera (mirror,
  // as when facing another person) - matches Mixamo's R/L convention.
  const sign = side === "R" ? -1 : 1;
  const outward = THREE.MathUtils.degToRad(outwardDeg);
  const elbowBend = THREE.MathUtils.degToRad(elbowBendDeg);

  // Shoulder: a small static clavicle pivot. UpperArm: the joint that
  // actually rotates the arm away from the body (same position, Mixamo-
  // style two-bone split).
  const shoulder = new THREE.Object3D();
  shoulder.name = `Shoulder_${side}`;
  shoulder.position.set(sign * 0.17, 0.1, 0);
  chest.add(shoulder);

  const upperArmPivot = new THREE.Object3D();
  upperArmPivot.name = `UpperArm_${side}`;
  upperArmPivot.rotation.z = sign * outward;
  shoulder.add(upperArmPivot);

  const elbow = buildTaperedSegment({
    parent: upperArmPivot,
    radiusTop: 0.034,
    radiusBottom: 0.025,
    length: 0.27,
    panelBand: true,
    jointRadius: 0.032,
  });
  elbow.name = `Forearm_${side}`;
  elbow.rotation.x = elbowBend;
  elbow.rotation.y = sign * -0.06;

  const wrist = buildTaperedSegment({
    parent: elbow,
    radiusTop: 0.023,
    radiusBottom: 0.016,
    length: 0.24,
    jointRadius: 0.022,
  });

  const hand = new THREE.Group();
  hand.name = `Hand_${side}`;
  hand.rotation.y = sign * -0.17;
  wrist.add(hand);

  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.022), bodyMaterial());
  palm.position.set(0, -0.025, 0);
  hand.add(palm);

  for (let i = 0; i < 3; i++) {
    const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.007, 0.03, 4, 8), panelMaterial());
    finger.position.set((i - 1) * 0.013, -0.065, 0);
    hand.add(finger);
  }
}

// Builds one leg (hip -> knee -> ankle -> small rounded foot), slimmer and
// tapered rather than thick tubes.
function buildLeg(hips: THREE.Object3D, side: "R" | "L", kneeBendDeg: number) {
  const sign = side === "R" ? -1 : 1;

  const upLeg = new THREE.Object3D();
  upLeg.name = `UpLeg_${side}`;
  upLeg.position.set(sign * 0.1, -0.03, 0);
  hips.add(upLeg);

  const knee = buildTaperedSegment({
    parent: upLeg,
    radiusTop: 0.052,
    radiusBottom: 0.038,
    length: 0.39,
    panelBand: true,
    jointRadius: 0.045,
  });
  knee.name = `Leg_${side}`;
  knee.rotation.x = THREE.MathUtils.degToRad(kneeBendDeg);

  const ankle = buildTaperedSegment({
    parent: knee,
    radiusTop: 0.034,
    radiusBottom: 0.024,
    length: 0.4,
    jointRadius: 0.028,
  });
  ankle.name = `Foot_${side}`;

  const footMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), panelMaterial());
  footMesh.scale.set(0.038, 0.03, 0.09);
  footMesh.position.set(0, -0.025, 0.045);
  ankle.add(footMesh);
}

// Builds a stand-in full-body humanoid from primitives, using the same
// Mixamo-style bone hierarchy a real rigged GLB would need. Proportioned
// roughly 7.5-8 heads tall with a relaxed contrapposto stance, so these
// measurements can double as the spec for the real model later
// (Milestone 1).
export function createPlaceholderRobot(): { root: THREE.Group; face: Face } {
  const root = new THREE.Group();
  root.name = "RobotRoot";

  // Weight on the left leg: right knee bends, hips tilt down slightly on
  // the bent side.
  const hips = new THREE.Object3D();
  hips.name = "Hips";
  hips.position.set(0, 0.9, 0);
  hips.rotation.z = 0.035;
  root.add(hips);

  const pelvisMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.06, 6, 12), bodyMaterial());
  hips.add(pelvisMesh);

  const spine = new THREE.Object3D();
  spine.name = "Spine";
  spine.position.set(0, 0.12, 0);
  hips.add(spine);

  // Waist: narrower than the chest, tapering up from the pelvis.
  const waistMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.13, 14), bodyMaterial());
  waistMesh.position.set(0, 0.02, 0);
  spine.add(waistMesh);

  const chest = new THREE.Object3D();
  chest.name = "Chest";
  chest.position.set(0, 0.16, 0);
  spine.add(chest);

  // Chest: clearly wider than the waist, with a rounded shell and an
  // off-white chest-plate insert.
  const chestMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.08, 0.26, 16), bodyMaterial());
  chestMesh.position.set(0, 0.03, 0);
  chest.add(chestMesh);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.03), panelMaterial());
  chestPlate.position.set(0, 0.03, 0.1);
  chest.add(chestPlate);

  const neck = new THREE.Object3D();
  neck.name = "Neck";
  neck.position.set(0, 0.17, 0);
  chest.add(neck);

  const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.07, 12), bodyMaterial());
  neckMesh.position.set(0, 0.025, 0);
  neck.add(neckMesh);

  const head = new THREE.Group();
  head.name = "Head";
  head.position.set(0, 0.06, 0);
  neck.add(head);

  // Rounded head: a scaled sphere rather than a sharp-edged cube, slightly
  // wider than tall, with the visor covering most of the front.
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 18), bodyMaterial());
  headMesh.scale.set(1.12, 0.96, 1.04);
  headMesh.position.set(0, 0.04, 0);
  head.add(headMesh);

  // Display mouth: the visor is a dark glass screen showing glowing eyes
  // and a mouth, drawn onto a canvas texture by Face. Lip sync (switching
  // mouth shapes on word timing) arrives in Milestone 3.
  const face = new Face();
  const visor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 0.075),
    new THREE.MeshBasicMaterial({ map: face.texture, toneMapped: false }),
  );
  visor.name = "Visor";
  visor.position.set(0, 0.04, 0.102);
  head.add(visor);

  buildArm(chest, "R", 9, 12);
  buildArm(chest, "L", 9, 12);

  buildLeg(hips, "R", -16);
  buildLeg(hips, "L", -4);

  return { root, face };
}
