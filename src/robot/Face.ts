import * as THREE from "three";

export type FaceExpression = "neutral" | "smile" | "thinking";

// Visemes: the mouth shapes spoken sounds map onto. "rest" is the resting
// shape between words. Lip sync (switching these on word-timing data)
// arrives in Milestone 3; until then, setViseme() can be driven by the
// debug cycle below.
export type Viseme = "rest" | "closed" | "open" | "wide" | "round" | "mid" | "fv" | "th";

const BG = "#0b1030";
const GLOW = "#f2d45c";

const CANVAS_W = 160;
const CANVAS_H = 80;

const BLINK_DELAY_MIN = 2.5;
const BLINK_DELAY_MAX = 6;
const BLINK_DURATION = 0.14;

const MOUTH_MORPH_SECONDS = 0.06;

const EYE_Y = 26;
const EYE_SPACING_X = 48; // distance from centre to each eye
const EYE_W = 24;
const EYE_H_OPEN = 18;

const MOUTH_Y = 64;

// Every viseme is a rounded "pill" of a given width/height (corner radius
// = half the shorter side), which naturally covers bars, ovals, and
// circles as special cases - closed/rest/fv/th are flat-ish pills, open/
// mid/wide are taller ovals, round is a near-circle.
const VISEME_SHAPES: Record<Viseme, { w: number; h: number }> = {
  rest: { w: 64, h: 10 },
  closed: { w: 48, h: 6 },
  open: { w: 36, h: 34 },
  wide: { w: 58, h: 14 },
  round: { w: 22, h: 22 },
  mid: { w: 42, h: 22 },
  fv: { w: 52, h: 11 },
  th: { w: 14, h: 26 },
};

// The debug cycle (toggled by Guide's 'v' key handler): each static
// viseme held in turn, then a short looping "test sentence" sequence.
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

// Draws the robot's face (glowing eyes + mouth) onto a small canvas used
// as the Visor mesh's texture.
export class Face {
  readonly texture: THREE.CanvasTexture;

  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private expression: FaceExpression = "neutral";

  private blinkTimer = this.nextBlinkDelay();
  private blinking = false;
  private blinkProgress = 0;

  private currentViseme: Viseme = "rest";
  private morphFrom = VISEME_SHAPES.rest;
  private morphTo = VISEME_SHAPES.rest;
  private morphT = 1;

  private debugStepIndex = -1; // -1 = debug cycle off, driven normally
  private debugSentenceElapsed = 0;
  private debugSentenceStep = 0;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_H;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Face: 2D canvas context unavailable");
    this.ctx = ctx;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.draw();
  }

  setExpression(expression: FaceExpression) {
    this.expression = expression;
  }

  // Starts a ~60ms morph toward the given viseme. Safe to call every
  // frame with the same value (no-op once the morph completes).
  setViseme(viseme: Viseme) {
    if (viseme === this.currentViseme && this.morphT >= 1) return;
    if (viseme === this.currentViseme) return;
    this.currentViseme = viseme;
    this.morphFrom = this.currentMouthShape();
    this.morphTo = VISEME_SHAPES[viseme];
    this.morphT = 0;
  }

  // Advances the debug preview to its next step (one static viseme held,
  // cycling through all of them, then a looping test-sentence animation).
  // Returns the current step's label. Calling it past the last step turns
  // the debug cycle off and resumes normal (rest) behaviour.
  debugCycleNext(): string {
    this.debugStepIndex++;
    if (this.debugStepIndex >= DEBUG_STEPS.length) {
      this.debugStepIndex = -1;
      this.setViseme("rest");
      return "off";
    }
    const step = DEBUG_STEPS[this.debugStepIndex];
    if (step === "sentence") {
      this.debugSentenceElapsed = 0;
      this.debugSentenceStep = 0;
    } else {
      this.setViseme(step);
    }
    return step;
  }

  update(dt: number) {
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

    if (this.debugStepIndex >= 0 && DEBUG_STEPS[this.debugStepIndex] === "sentence") {
      this.updateDebugSentence(dt);
    }

    if (this.morphT < 1) {
      this.morphT = Math.min(1, this.morphT + dt / MOUTH_MORPH_SECONDS);
    }

    this.draw();
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }

  private updateDebugSentence(dt: number) {
    const step = SENTENCE_SEQUENCE[this.debugSentenceStep];
    this.setViseme(step.viseme);
    this.debugSentenceElapsed += dt;
    if (this.debugSentenceElapsed >= step.hold) {
      this.debugSentenceElapsed = 0;
      this.debugSentenceStep = (this.debugSentenceStep + 1) % SENTENCE_SEQUENCE.length;
    }
  }

  private currentMouthShape() {
    const from = this.morphFrom;
    const to = this.morphTo;
    const t = this.morphT;
    return {
      w: THREE.MathUtils.lerp(from.w, to.w, t),
      h: THREE.MathUtils.lerp(from.h, to.h, t),
    };
  }

  private nextBlinkDelay() {
    return BLINK_DELAY_MIN + Math.random() * (BLINK_DELAY_MAX - BLINK_DELAY_MIN);
  }

  // Triangular envelope: closes then reopens across the blink duration.
  private eyeOpenness(): number {
    if (!this.blinking) return 1;
    const t = this.blinkProgress;
    return t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2;
  }

  private drawPill(cx: number, cy: number, w: number, h: number) {
    const ctx = this.ctx;
    const r = Math.min(w, h) / 2;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, r);
    ctx.fill();
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = GLOW;
    ctx.shadowColor = GLOW;
    ctx.shadowBlur = 8;

    const openness = Math.max(0.08, this.eyeOpenness());
    const cx = CANVAS_W / 2;
    this.drawPill(cx - EYE_SPACING_X / 2, EYE_Y, EYE_W, EYE_H_OPEN * openness);
    this.drawPill(cx + EYE_SPACING_X / 2, EYE_Y, EYE_W, EYE_H_OPEN * openness);

    const mouth = this.currentMouthShape();
    const mouthX = cx + (this.expression === "thinking" ? -10 : 0);

    if (this.expression === "smile" && this.currentViseme === "rest") {
      // Slight upward curve at the ends instead of a flat pill.
      ctx.beginPath();
      ctx.lineWidth = mouth.h * 0.6;
      ctx.lineCap = "round";
      ctx.strokeStyle = GLOW;
      ctx.moveTo(mouthX - mouth.w / 2, MOUTH_Y + 2);
      ctx.quadraticCurveTo(mouthX, MOUTH_Y - mouth.h, mouthX + mouth.w / 2, MOUTH_Y + 2);
      ctx.stroke();
    } else {
      this.drawPill(mouthX, MOUTH_Y, mouth.w, mouth.h);
    }

    ctx.shadowBlur = 0;
  }
}
