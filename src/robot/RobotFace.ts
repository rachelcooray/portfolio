import * as THREE from "three";

export type FaceExpression = "neutral" | "smile" | "thinking";
export type Viseme = "rest" | "closed" | "open" | "wide" | "round" | "mid" | "fv" | "th";

// Recolored from ink-blue to the site's burgundy brand accent (see
// realRobotMaterials.ts). GLOW (highlighter yellow) is unchanged — it's
// reserved for the robot's live pointing/talking state, never the brand
// color.
const INK = 0x8b1e3f;
const GLOW = 0xf2d45c;

// Empirically measured head bounds (world units, relative to the Head
// bone's own position), from raycasting the live render earlier in this
// project. World Y/X; the actual surface depth (Z) at each feature's
// specific spot is found fresh via raycast below, not assumed.
const HEAD_TOP_Y = 0.21;
const HEAD_CHIN_Y = -0.02;
const HEAD_HEIGHT = HEAD_TOP_Y - HEAD_CHIN_Y;
const HEAD_WIDTH = 0.14;

const EYE_ROW_Y = HEAD_TOP_Y - 0.4 * HEAD_HEIGHT; // "40% down from the top"
const EYE_HALF_SPACING = 0.15 * HEAD_WIDTH; // eyes 30% of head width apart
// 2x the lab's original size, per the master prompt.
const EYE_HALF_WIDTH = 0.016;
const EYE_HALF_HEIGHT = 0.022; // slightly taller than wide

const MOUTH_ROW_Y = HEAD_CHIN_Y + 0.33 * HEAD_HEIGHT * 0.5; // lower third
// 1.5x the lab's original width, per the master prompt.
const MOUTH_REF_HALF_WIDTH = 0.0175 * HEAD_WIDTH * 10 * 1.5;

// Every viseme is a flattened ellipse (closed curve), varying half-width
// and half-height - the same "pill" model as the canvas-texture face
// used before, just drawn as a 3D tube instead of a 2D shape. A tiny
// half-height makes a line with rounded ends (rest/closed); a large one
// makes a proper oval/circle outline (open/round).
const VISEME_SHAPES: Record<Viseme, { w: number; h: number }> = {
  rest: { w: 1, h: 0.12 },
  closed: { w: 0.7, h: 0.08 },
  open: { w: 0.55, h: 0.8 },
  wide: { w: 1.15, h: 0.22 },
  round: { w: 0.45, h: 0.45 },
  mid: { w: 0.8, h: 0.4 },
  fv: { w: 0.8, h: 0.14 },
  th: { w: 0.3, h: 0.55 },
};

const DEBUG_STEPS: readonly (Viseme | "sentence")[] = [
  "rest",
  "closed",
  "open",
  "wide",
  "round",
  "mid",
  "fv",
  "th",
  "sentence",
];

const SENTENCE_SEQUENCE: readonly { viseme: Viseme; hold: number }[] = [
  { viseme: "open", hold: 0.16 },
  { viseme: "closed", hold: 0.1 },
  { viseme: "wide", hold: 0.14 },
  { viseme: "mid", hold: 0.12 },
  { viseme: "round", hold: 0.18 },
  { viseme: "open", hold: 0.14 },
  { viseme: "fv", hold: 0.1 },
  { viseme: "th", hold: 0.12 },
  { viseme: "rest", hold: 0.3 },
];

const MORPH_SECONDS = 0.06;
const BLINK_DELAY_MIN = 2.5;
const BLINK_DELAY_MAX = 6;
const BLINK_DURATION = 0.14;
// 1.5x the lab's original thickness, per the master prompt.
const MOUTH_TUBE_RADIUS = 0.00225;
const MOUTH_SEGMENTS = 32;

interface SurfaceHit {
  point: THREE.Vector3;
  normal: THREE.Vector3;
}

// Raycasts from in front of the head toward it, at a given (local-to-head
// -bone) horizontal/vertical offset, to find the actual surface point and
// normal there. Returns null if nothing was hit.
function raycastHead(
  raycaster: THREE.Raycaster,
  targets: THREE.Object3D[],
  headWorldPos: THREE.Vector3,
  dx: number,
  dy: number,
): SurfaceHit | null {
  const origin = new THREE.Vector3(headWorldPos.x + dx, headWorldPos.y + dy, headWorldPos.z + 1.0);
  raycaster.set(origin, new THREE.Vector3(0, 0, -1));
  raycaster.far = 2;
  const hits = raycaster.intersectObjects(targets, false);
  if (hits.length === 0 || !hits[0].face) return null;
  const normal = hits[0].face.normal.clone().transformDirection(hits[0].object.matrixWorld);
  return { point: hits[0].point, normal };
}

// Parents a fresh Object3D to the head bone, positioned/oriented at a
// raycast hit (surface-flush), converting the world-space hit into the
// head bone's local space so it follows the bone's own animation.
function createSurfaceAnchor(headBone: THREE.Object3D, hit: SurfaceHit): THREE.Object3D {
  const anchor = new THREE.Object3D();
  headBone.add(anchor);

  anchor.position.copy(headBone.worldToLocal(hit.point.clone()));

  const worldQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), hit.normal);
  const headWorldQuat = new THREE.Quaternion();
  headBone.getWorldQuaternion(headWorldQuat);
  anchor.quaternion.copy(headWorldQuat.invert().multiply(worldQuat));

  // The Mixamo skeleton's bones carry their own (much larger) native
  // scale internally, separate from the mesh surface data's metre scale
  // - worldToLocal() above correctly places this anchor's origin, but
  // anything sized in real-world units underneath it would otherwise be
  // shrunk by that same bone scale. Counter-scale so child geometry
  // authored in metres actually renders at that size.
  const boneWorldScale = new THREE.Vector3();
  headBone.getWorldScale(boneWorldScale);
  anchor.scale.set(1 / boneWorldScale.x, 1 / boneWorldScale.y, 1 / boneWorldScale.z);

  return anchor;
}

function buildMouthGeometry(halfWidth: number, halfHeight: number): THREE.TubeGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < MOUTH_SEGMENTS; i++) {
    const angle = (i / MOUTH_SEGMENTS) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * halfWidth, Math.sin(angle) * halfHeight, 0));
  }
  const curve = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(curve, MOUTH_SEGMENTS, MOUTH_TUBE_RADIUS, 6, true);
}

// Draws the robot's face directly on the helmet - ink eyes and a mouth
// line, like features sketched on with a pen, rather than a glowing
// screen. Eyes and mouth are plain three.js meshes (not a canvas
// texture), positioned via raycast against the head mesh and parented to
// the Head bone so they move with it.
export class RobotFace {
  private readonly leftEye: THREE.Mesh;
  private readonly rightEye: THREE.Mesh;
  private readonly mouthAnchor: THREE.Object3D;
  private readonly mouth: THREE.Mesh;
  private readonly mouthMaterial: THREE.MeshStandardMaterial;
  private readonly mouthScale: number;

  private expression: FaceExpression = "neutral";
  private talking = false;

  private blinkTimer = this.nextBlinkDelay();
  private blinking = false;
  private blinkProgress = 0;

  private currentViseme: Viseme = "rest";
  private morphFrom = VISEME_SHAPES.rest;
  private morphTo = VISEME_SHAPES.rest;
  private morphT = 1;

  private debugStepIndex = -1;
  private debugSentenceElapsed = 0;
  private debugSentenceStep = 0;

  constructor(headBone: THREE.Object3D, raycastTargets: THREE.Object3D[]) {
    const headWorldPos = new THREE.Vector3();
    headBone.getWorldPosition(headWorldPos);
    const raycaster = new THREE.Raycaster();

    const leftHit = raycastHead(raycaster, raycastTargets, headWorldPos, -EYE_HALF_SPACING, EYE_ROW_Y);
    const rightHit = raycastHead(raycaster, raycastTargets, headWorldPos, EYE_HALF_SPACING, EYE_ROW_Y);
    const mouthHit = raycastHead(raycaster, raycastTargets, headWorldPos, 0, MOUTH_ROW_Y);
    if (!leftHit || !rightHit || !mouthHit) {
      throw new Error("RobotFace: raycast against the head mesh found no surface for eyes/mouth placement");
    }

    const eyeMaterial = new THREE.MeshBasicMaterial({ color: INK });

    const leftAnchor = createSurfaceAnchor(headBone, leftHit);
    this.leftEye = new THREE.Mesh(new THREE.CircleGeometry(1, 16), eyeMaterial);
    this.leftEye.scale.set(EYE_HALF_WIDTH, EYE_HALF_HEIGHT, 1);
    this.leftEye.position.z = 0.0005;
    leftAnchor.add(this.leftEye);

    const rightAnchor = createSurfaceAnchor(headBone, rightHit);
    this.rightEye = new THREE.Mesh(new THREE.CircleGeometry(1, 16), eyeMaterial);
    this.rightEye.scale.set(EYE_HALF_WIDTH, EYE_HALF_HEIGHT, 1);
    this.rightEye.position.z = 0.0005;
    rightAnchor.add(this.rightEye);

    this.mouthAnchor = createSurfaceAnchor(headBone, mouthHit);
    this.mouthScale = MOUTH_REF_HALF_WIDTH;
    this.mouthMaterial = new THREE.MeshStandardMaterial({
      color: INK,
      emissive: new THREE.Color(GLOW),
      emissiveIntensity: 0,
      roughness: 0.5,
    });
    this.mouth = new THREE.Mesh(buildMouthGeometry(this.mouthScale, this.mouthScale * 0.12), this.mouthMaterial);
    this.mouthAnchor.add(this.mouth);
  }

  setExpression(expression: FaceExpression) {
    this.expression = expression;
  }

  setTalking(talking: boolean) {
    this.talking = talking;
  }

  setViseme(viseme: Viseme) {
    if (viseme === this.currentViseme) return;
    this.currentViseme = viseme;
    this.morphFrom = this.currentMouthShape();
    this.morphTo = VISEME_SHAPES[viseme];
    this.morphT = 0;
  }

  debugCycleNext(): string {
    this.debugStepIndex++;
    if (this.debugStepIndex >= DEBUG_STEPS.length) {
      this.debugStepIndex = -1;
      this.setTalking(false);
      this.setViseme("rest");
      return "off";
    }
    const step = DEBUG_STEPS[this.debugStepIndex];
    this.setTalking(true);
    if (step === "sentence") {
      this.debugSentenceElapsed = 0;
      this.debugSentenceStep = 0;
    } else {
      this.setViseme(step);
    }
    return step;
  }

  update(dt: number) {
    this.updateBlink(dt);

    if (this.debugStepIndex >= 0 && DEBUG_STEPS[this.debugStepIndex] === "sentence") {
      const step = SENTENCE_SEQUENCE[this.debugSentenceStep];
      this.setViseme(step.viseme);
      this.debugSentenceElapsed += dt;
      if (this.debugSentenceElapsed >= step.hold) {
        this.debugSentenceElapsed = 0;
        this.debugSentenceStep = (this.debugSentenceStep + 1) % SENTENCE_SEQUENCE.length;
      }
    }

    if (this.morphT < 1) {
      this.morphT = Math.min(1, this.morphT + dt / MORPH_SECONDS);
    }

    const shape = this.currentMouthShape();
    this.mouth.position.x = this.expression === "thinking" ? -this.mouthScale * 0.3 : 0;

    const smileLift = this.expression === "smile" && this.currentViseme === "rest" ? shape.h * 0.6 : 0;
    this.mouth.geometry.dispose();
    this.mouth.geometry = buildMouthGeometry(shape.w * this.mouthScale, shape.h * this.mouthScale * 0.5 + smileLift * this.mouthScale);

    this.mouthMaterial.emissiveIntensity = this.talking ? 1.4 : 0;
  }

  dispose() {
    this.mouth.geometry.dispose();
    this.mouthMaterial.dispose();
    this.leftEye.geometry.dispose();
    (this.leftEye.material as THREE.Material).dispose();
    this.rightEye.geometry.dispose();
  }

  private currentMouthShape() {
    const t = this.morphT;
    return {
      w: THREE.MathUtils.lerp(this.morphFrom.w, this.morphTo.w, t),
      h: THREE.MathUtils.lerp(this.morphFrom.h, this.morphTo.h, t),
    };
  }

  private nextBlinkDelay() {
    return BLINK_DELAY_MIN + Math.random() * (BLINK_DELAY_MAX - BLINK_DELAY_MIN);
  }

  private updateBlink(dt: number) {
    this.blinkTimer -= dt;
    if (!this.blinking && this.blinkTimer <= 0) {
      this.blinking = true;
      this.blinkProgress = 0;
    }
    if (this.blinking) {
      this.blinkProgress += dt / BLINK_DURATION;
      if (this.blinkProgress >= 1) {
        this.blinking = false;
        this.blinkTimer = this.nextBlinkDelay();
      }
    }
    const openness = this.blinking
      ? this.blinkProgress < 0.5
        ? 1 - this.blinkProgress * 2
        : (this.blinkProgress - 0.5) * 2
      : 1;
    const scaleY = Math.max(0.05, openness) * EYE_HALF_HEIGHT;
    this.leftEye.scale.y = scaleY;
    this.rightEye.scale.y = scaleY;
  }
}
