import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { createPlaceholderRobot, placeholderBoneNames } from "./createPlaceholderRobot";
import { Face } from "./Face";
import { RobotFace, type Viseme } from "./RobotFace";
import { realRobotBoneNames } from "./realRobotBoneNames";
import { recolorRealRobot } from "./realRobotMaterials";
import type { GuideState, RobotBoneNames } from "./types";

// The Blender conversion pipeline (FBX import/export) already normalised
// the Mixamo skeleton to human-scale units (~1.5-1.8 tall), matching the
// placeholder and the camera/lighting setup, so no further scaling needed.
const REAL_MODEL_SCALE = 1;

interface ResolvedBones {
  hips: THREE.Object3D;
  spine: THREE.Object3D;
  chest: THREE.Object3D;
  neck: THREE.Object3D;
  head: THREE.Object3D;
  shoulderR: THREE.Object3D;
  upperArmR: THREE.Object3D;
  forearmR: THREE.Object3D;
  handR: THREE.Object3D;
  shoulderL: THREE.Object3D;
  upperArmL: THREE.Object3D;
  forearmL: THREE.Object3D;
  handL: THREE.Object3D;
  upLegR: THREE.Object3D;
  legR: THREE.Object3D;
  footR: THREE.Object3D;
  upLegL: THREE.Object3D;
  legL: THREE.Object3D;
  footL: THREE.Object3D;
  // Only the placeholder has one; the real model's face is a RobotFace
  // built separately (see Guide.face / Guide.robotFace below).
  visor?: THREE.Mesh;
}

const CLAMP_YAW = THREE.MathUtils.degToRad(28);
const CLAMP_PITCH = THREE.MathUtils.degToRad(16);
const DAMP_LAMBDA = 6;

// Default "paying attention" bias: a small constant turn toward the
// content column (to the robot's own right, screen-left) so the head
// isn't dead-ahead even before the cursor moves.
const ATTENTIVE_YAW_BIAS = THREE.MathUtils.degToRad(-6);

// Word-level phoneme/viseme analysis isn't available from Whisper's
// output (just word timing), so talking mouth shapes cycle through this
// sequence per word rather than matching true phonemes - plausible
// movement synced to real word boundaries, not lip-accurate.
const VISEME_CYCLE: Viseme[] = ["open", "closed", "mid", "wide", "round", "mid", "closed"];

interface WordTiming {
  word: string;
  start: number;
  end: number;
  synthetic?: boolean;
}

// Conversational TTS pace (~170 words/min), used only when a line has no
// generated audio/timing yet. A fixed per-word slot is coarser than real
// speech rhythm, but puts subtitles/pointAt/highlighter roughly on beat.
const SYNTHETIC_SECONDS_PER_WORD = 0.35;

function synthesizeWordTiming(text: string): WordTiming[] {
  const words = text.split(/\s+/).filter(Boolean);
  return words.map((word, i) => ({
    word,
    start: i * SYNTHETIC_SECONDS_PER_WORD,
    end: (i + 1) * SYNTHETIC_SECONDS_PER_WORD,
    synthetic: true,
  }));
}

// Framework-agnostic robot guide. Owns its own renderer/scene/camera so it
// can be dropped onto any <canvas>, wrapped later in a React component.
export class Guide {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly baseCameraZ: number;
  private readonly baseFov: number;

  // Scene lights + their designed intensities, so Movie mode can dim/raise
  // the whole rig proportionally (setLightLevel) without losing the
  // key/fill/rim balance designed in setupLighting().
  private sceneLights: { light: THREE.Light; baseIntensity: number }[] = [];
  private currentLightLevel = 1;
  private readonly lightLevelProxy = { t: 1 };

  private root: THREE.Group | null = null;
  private bones: ResolvedBones | null = null;
  private face: Face | null = null; // placeholder only (canvas-texture visor)
  private robotFace: RobotFace | null = null; // real model only (ink eyes/mouth)
  private usingRealModel = false;
  private mixer: THREE.AnimationMixer | null = null;
  private actions: Record<string, THREE.AnimationAction> = {};

  private state: GuideState = "idle";
  private cursorTrackingEnabled = true;
  private readonly reducedMotion: boolean;

  private readonly mouseNdc = new THREE.Vector2(0, 0);
  private targetYaw = 0;
  private targetPitch = 0;
  private currentYaw = 0;
  private currentPitch = 0;
  private readonly scratchEuler = new THREE.Euler();
  private readonly scratchQuat = new THREE.Quaternion();

  private muted = true;
  private readonly audioEl = new Audio();
  private sayCancelled = false;
  private sayPaused = false;
  private pauseStartedAt = 0;
  private pausedDurationTotal = 0;

  private idleTime = 0;
  private readonly headDriftSeed = Math.random() * 1000;
  private hipsBaseRotationZ = 0;
  private chestBaseScaleY = 1;

  private readonly clock = new THREE.Clock();
  private frameHandle = 0;
  private isVisible = true;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
    this.camera.position.set(0, 1.05, 4.4);
    this.camera.lookAt(0, 0.9, 0);
    this.baseCameraZ = this.camera.position.z;
    this.baseFov = this.camera.fov;

    this.setupLighting();
    this.bindEvents();
    this.resize();
  }

  private setupLighting() {
    // Key: front-left, 45 degrees above, warm. Strong enough that the
    // off-white shell reads as warm cream, not grey.
    const key = new THREE.DirectionalLight(0xfff4e2, 1.0);
    key.position.set(-2.2, 3.2, 2.5);
    this.scene.add(key);

    // Fill: front-right, cooler, 40% of key.
    const fill = new THREE.DirectionalLight(0xe8eeff, 1.0 * 0.4);
    fill.position.set(2.4, 1.8, 2.2);
    this.scene.add(fill);

    // Rim: behind-right, separates the ink shell from the paper background.
    const rim = new THREE.DirectionalLight(0x9fb8ff, 0.35);
    rim.position.set(2, 2.2, -2.8);
    this.scene.add(rim);

    this.sceneLights.push(
      { light: key, baseIntensity: key.intensity },
      { light: fill, baseIntensity: fill.intensity },
      { light: rim, baseIntensity: rim.intensity },
    );

    // Soft, non-directional sky/ground fill so shadowed areas don't go
    // flat black or read as grey - no environment map (RoomEnvironment's
    // baked panel lights were HDR-bright enough that even a tiny
    // envMapIntensity fraction overpowered the direct lights and read as
    // glossy plastic); a hemisphere light has no directionality, so it
    // lifts shadows warmly without adding specular shine.
    const hemi = new THREE.HemisphereLight(0xfff8ee, 0xd8d0c0, 0.5);
    this.scene.add(hemi);
    this.sceneLights.push({ light: hemi, baseIntensity: hemi.intensity });

    const contactShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 }),
    );
    contactShadow.name = "ContactShadow";
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.001;
    this.scene.add(contactShadow);
  }

  // Loads the real rigged GLB when a URL is given, falling back to the
  // primitive placeholder if it's missing, fails to load, or WebGL is
  // unavailable.
  async load(modelUrl?: string): Promise<void> {
    if (modelUrl && this.isWebGLAvailable()) {
      try {
        await this.loadRealModel(modelUrl);
        this.startLoop();
        return;
      } catch (err) {
        console.warn(`Guide: failed to load "${modelUrl}", falling back to placeholder.`, err);
      }
    }
    this.loadPlaceholder();
    this.startLoop();
  }

  private isWebGLAvailable(): boolean {
    try {
      return !!(window.WebGLRenderingContext && document.createElement("canvas").getContext("webgl2"));
    } catch {
      return false;
    }
  }

  private loadPlaceholder() {
    const { root, face } = createPlaceholderRobot();
    this.root = root;
    this.face = face;
    this.usingRealModel = false;
    this.scene.add(this.root);
    this.bones = this.resolveBones(this.root, placeholderBoneNames);
    this.hipsBaseRotationZ = this.bones.hips.rotation.z;
    this.chestBaseScaleY = this.bones.chest.scale.y;
  }

  private async loadRealModel(modelUrl: string): Promise<void> {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const gltf = await loader.loadAsync(modelUrl);
    const root = gltf.scene;
    root.scale.setScalar(REAL_MODEL_SCALE);
    recolorRealRobot(root);

    this.scene.add(root);
    this.root = root;
    this.usingRealModel = true;
    this.bones = this.resolveBones(root, realRobotBoneNames);

    // Face (ink eyes + mouth) is placed by raycasting against the head
    // mesh, so the real head bone's world transform must be current.
    root.updateMatrixWorld(true);
    const meshes: THREE.Object3D[] = [];
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) meshes.push(obj);
    });
    this.robotFace = new RobotFace(this.bones.head, meshes);

    this.mixer = new THREE.AnimationMixer(root);
    this.actions = {};
    for (const clip of gltf.animations) {
      this.actions[clip.name] = this.mixer.clipAction(clip);
    }
    this.actions.idle?.play();
  }

  private resolveBones(root: THREE.Group, names: RobotBoneNames): ResolvedBones {
    const get = (name: string): THREE.Object3D => {
      const obj = root.getObjectByName(name);
      if (!obj) throw new Error(`Guide: missing bone "${name}" in model`);
      return obj;
    };
    return {
      hips: get(names.hips),
      spine: get(names.spine),
      chest: get(names.chest),
      neck: get(names.neck),
      head: get(names.head),
      shoulderR: get(names.shoulderR),
      upperArmR: get(names.upperArmR),
      forearmR: get(names.forearmR),
      handR: get(names.handR),
      shoulderL: get(names.shoulderL),
      upperArmL: get(names.upperArmL),
      forearmL: get(names.forearmL),
      handL: get(names.handL),
      upLegR: get(names.upLegR),
      legR: get(names.legR),
      footR: get(names.footR),
      upLegL: get(names.upLegL),
      legL: get(names.legL),
      footL: get(names.footL),
      visor: names.visor ? (get(names.visor) as THREE.Mesh) : undefined,
    };
  }

  setState(state: GuideState) {
    this.state = state;
  }

  lookAtCursor(enabled: boolean) {
    this.cursorTrackingEnabled = enabled;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.audioEl.muted = muted;
  }

  // Note: this plays the Mixamo "point" mocap clip rather than aiming via
  // real two-bone IK toward the element's actual screen position (that's
  // the deferred Milestone 2 work) - it proves the *timing* (the gesture
  // lands on the right word) rather than true spatial aiming. Also
  // triggers the highlighter swipe on the target element by default -
  // pass `{ highlight: false }` for targets it isn't designed for (it's a
  // thin underline sized for a line of text; on a whole card it reads as
  // a big flat colour wipe instead of a highlight). Movie mode's card
  // reveals use their own GSAP-driven cue instead.
  pointAt(element: HTMLElement, options: { highlight?: boolean } = {}) {
    this.setState("pointing");
    const pointAction = this.actions.point;
    if (pointAction) {
      pointAction.reset().setLoop(THREE.LoopOnce, 1).play();
      pointAction.clampWhenFinished = true;
      const idleAction = this.actions.idle;
      if (idleAction) {
        idleAction.crossFadeTo(pointAction, 0.3, false);
        window.setTimeout(() => {
          pointAction.crossFadeTo(idleAction.reset().play(), 0.4, false);
          this.setState("idle");
        }, 1800);
      }
    }

    if (options.highlight === false) return;
    element.classList.add("guide-highlight");
    window.setTimeout(() => element.classList.remove("guide-highlight"), 1200);
  }

  // Plays one script line: starts audio (if unmuted), drives the mouth
  // viseme in sync with real word timing regardless of mute state (per
  // spec, muted playback still pulses from the subtitle timing), and
  // calls `onWord` at each word boundary so the caller can reveal
  // subtitles and trigger pointAt on the cue word. Resolves when the
  // line's words are done.
  //
  // `fallbackText` is used when /audio/{lineId}.json doesn't exist yet
  // (voice generation is Milestone 5, the tour engine is Milestone 4) —
  // synthesizes an estimated word timing at a conversational pace and
  // skips audio playback, so the tour still works end-to-end before every
  // line has real recorded voice. Once a line's audio/timing exists,
  // this path is never taken for it.
  async say(
    lineId: string,
    fallbackText: string,
    onWord?: (word: string, index: number) => void,
  ): Promise<void> {
    this.sayCancelled = false;
    const timing: { words: WordTiming[] } = await fetch(`/audio/${lineId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`no audio/timing for "${lineId}"`);
        return r.json();
      })
      .catch(() => ({ words: synthesizeWordTiming(fallbackText) }));

    const hasRealAudio = timing.words.length > 0 && !timing.words[0].synthetic;
    if (hasRealAudio) {
      this.audioEl.src = `/audio/${lineId}.mp3`;
      this.audioEl.muted = this.muted;
      if (!this.muted) {
        this.audioEl.currentTime = 0;
        void this.audioEl.play().catch(() => {});
      }
    }

    this.setState("talking");
    const face = this.robotFace;
    face?.setTalking(true);

    const words = timing.words;
    const startTime = performance.now() / 1000;
    this.pausedDurationTotal = 0;

    await new Promise<void>((resolve) => {
      let wordIndex = 0;
      const finish = () => {
        face?.setTalking(false);
        face?.setViseme("rest");
        if (this.state === "talking") this.setState("idle");
        resolve();
      };
      const tick = () => {
        if (this.sayCancelled) {
          finish();
          return;
        }
        if (this.sayPaused) {
          requestAnimationFrame(tick);
          return;
        }
        const elapsed = performance.now() / 1000 - startTime - this.pausedDurationTotal;

        while (wordIndex < words.length && words[wordIndex].start <= elapsed) {
          const word = words[wordIndex];
          face?.setViseme(VISEME_CYCLE[wordIndex % VISEME_CYCLE.length]);
          onWord?.(word.word, wordIndex);
          wordIndex++;
        }

        const lastEnd = words[words.length - 1]?.end ?? 0;
        if (wordIndex >= words.length && elapsed >= lastEnd + 0.3) {
          finish();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Immediately stops any in-progress say() (used by Skip).
  stopSpeaking() {
    this.sayCancelled = true;
    this.audioEl.pause();
  }

  // Freezes the in-progress say() exactly where it is (word sync + audio),
  // used by Movie mode's Pause. Does not cancel it - resumeSpeaking()
  // continues from the same point.
  pauseSpeaking() {
    if (this.sayPaused) return;
    this.sayPaused = true;
    this.pauseStartedAt = performance.now() / 1000;
    this.audioEl.pause();
  }

  resumeSpeaking() {
    if (!this.sayPaused) return;
    this.sayPaused = false;
    this.pausedDurationTotal += performance.now() / 1000 - this.pauseStartedAt;
    if (!this.muted && this.audioEl.src) void this.audioEl.play().catch(() => {});
  }

  // --- Movie mode staging primitives -------------------------------------
  // Minimal, reusable camera/lighting/blocking moves a cinematic sequence
  // can compose. The model ships only idle/talk/talk2/point/wave clips (no
  // walk cycle), so "moving" the robot between marks is a plain position
  // tween rather than a walked transition - good enough for a stage-play
  // feel, not literal footsteps.

  // Each of these tweens a stable, reusable target (never a fresh object
  // literal per call) specifically so a new call can gsap.killTweensOf()
  // it first - without that, an interrupted call (Skip, a chapter-bar
  // jump, Pause/resume racing a scene change) leaves its old tween still
  // running and fighting the new one for the same property every frame,
  // since cancelling MovieController's own async chain doesn't stop
  // already-started GSAP tweens.

  moveRootX(x: number, duration = 1): Promise<void> {
    return new Promise((resolve) => {
      if (!this.root || this.reducedMotion) {
        if (this.root) this.root.position.x = x;
        resolve();
        return;
      }
      gsap.killTweensOf(this.root.position);
      gsap.to(this.root.position, { x, duration, ease: "power2.inOut", onComplete: resolve });
    });
  }

  // Tweens FOV down/up to fake a camera push-in/pull-back without having to
  // re-run lookAt() every frame (simpler than animating position+target).
  pushCamera(fovDelta: number, duration = 1.4): Promise<void> {
    return new Promise((resolve) => {
      const targetFov = this.baseFov - fovDelta;
      if (this.reducedMotion) {
        this.camera.fov = targetFov;
        this.camera.updateProjectionMatrix();
        resolve();
        return;
      }
      gsap.killTweensOf(this.camera);
      gsap.to(this.camera, {
        fov: targetFov,
        duration,
        ease: "power2.inOut",
        onUpdate: () => this.camera.updateProjectionMatrix(),
        onComplete: resolve,
      });
    });
  }

  resetCamera(duration = 1.4): Promise<void> {
    return this.pushCamera(0, duration);
  }

  // Synchronous, tween-free light set - no gsap.to, no promise, no
  // dependency on tween-kill timing. Two setLightLevel() calls fired back
  // to back in the same synchronous block (e.g. a scene's own instant
  // reset immediately followed by its fade-up) race: the second call's
  // killTweensOf can cancel the first tween before its duration:0 update
  // has ever run a frame, silently turning the pair into a no-op. Use
  // this for anywhere lighting correctness matters more than animating -
  // currently just the hard reset on scene entry/jump.
  forceLightLevel(level: number) {
    gsap.killTweensOf(this.lightLevelProxy);
    this.currentLightLevel = level;
    this.lightLevelProxy.t = level;
    for (const { light, baseIntensity } of this.sceneLights) light.intensity = baseIntensity * level;
  }

  // Scales key/fill/rim/hemi intensities together, proportionally to their
  // designed balance, so "lights down" doesn't flatten the modelling into a
  // single wash. level 0 = black stage, 1 = normal.
  setLightLevel(level: number, duration = 1): Promise<void> {
    return new Promise((resolve) => {
      if (this.reducedMotion) {
        this.currentLightLevel = level;
        gsap.killTweensOf(this.lightLevelProxy);
        this.lightLevelProxy.t = level;
        for (const { light, baseIntensity } of this.sceneLights) light.intensity = baseIntensity * level;
        resolve();
        return;
      }
      gsap.killTweensOf(this.lightLevelProxy);
      this.currentLightLevel = level;
      gsap.to(this.lightLevelProxy, {
        t: level,
        duration,
        ease: "power1.inOut",
        onUpdate: () => {
          for (const { light, baseIntensity } of this.sceneLights) light.intensity = baseIntensity * this.lightLevelProxy.t;
        },
        onComplete: resolve,
      });
    });
  }

  // Debug-only: steps the visor's mouth through each viseme shape, then a
  // looping test-sentence animation, so it can be reviewed before the
  // voice/timing pipeline exists to drive it for real. Returns the
  // current step's label.
  debugCycleMouth(): string {
    return this.robotFace?.debugCycleNext() ?? this.face?.debugCycleNext() ?? "no face loaded";
  }

  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.frameHandle);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.resizeObserver?.disconnect();
    this.mixer?.stopAllAction();
    this.face?.dispose();
    this.robotFace?.dispose();
    this.renderer.dispose();
  }

  private onMouseMove = (e: MouseEvent) => {
    this.mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  private onResize = () => this.resize();

  private onVisibilityChange = () => {
    this.isVisible = document.visibilityState === "visible";
  };

  private resizeObserver: ResizeObserver | null = null;

  private bindEvents() {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    // Window resize alone misses CSS-driven layout changes to the canvas's
    // own box (e.g. Movie mode docking it from full-bleed to a side
    // column) - ResizeObserver catches those too.
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    }
  }

  private resize() {
    const width = this.canvas.clientWidth || 1;
    const height = this.canvas.clientHeight || 1;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private startLoop() {
    const tick = () => {
      if (this.destroyed) return;
      this.frameHandle = requestAnimationFrame(tick);
      if (!this.isVisible) return;

      const dt = Math.min(this.clock.getDelta(), 0.1);
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
    };
    tick();
  }

  private update(dt: number) {
    if (!this.root || !this.bones) return;

    this.idleTime += dt;
    this.face?.update(dt);
    this.robotFace?.update(dt);
    this.mixer?.update(dt);

    if (this.reducedMotion) return;

    // The real model's idle motion (breathing, weight shift) comes from
    // the mocap clip itself; the placeholder has no animation clips, so
    // it's hand-puppeted here instead.
    if (!this.usingRealModel && this.state === "idle") {
      this.updateIdleMotion();
    }

    // The placeholder's bones start at an identity rest pose, so cursor
    // tracking can just set their Euler rotation directly. The real rig's
    // head/neck bones carry their own animated rotation from the mocap
    // clip each frame, so tracking there is applied as a small additive
    // quaternion on top of whatever the mixer just set, instead.
    if (this.usingRealModel) {
      this.updateCursorTrackingReal(dt);
    } else {
      this.updateCursorTracking(dt);
    }
  }

  private updateIdleMotion() {
    if (!this.bones) return;
    const { chest, hips, head } = this.bones;

    // Subtle breathing: the chest scales a fraction on the vertical axis.
    chest.scale.y = this.chestBaseScaleY + Math.sin(this.idleTime * 1.4) * 0.012;

    // Slow weight shift between the legs, as a gentle hip sway. Feet stay
    // planted since the legs are not re-targeted to compensate here.
    hips.rotation.z = this.hipsBaseRotationZ + Math.sin(this.idleTime * 0.35) * 0.025;

    // Tiny random head drift.
    head.userData.driftX = Math.sin(this.idleTime * 0.6 + this.headDriftSeed) * 0.02;
    head.userData.driftY = Math.cos(this.idleTime * 0.45 + this.headDriftSeed) * 0.02;
  }

  private updateCursorTracking(dt: number) {
    if (!this.bones) return;
    const { head, neck } = this.bones;

    if (this.cursorTrackingEnabled) {
      this.targetYaw = THREE.MathUtils.clamp(this.mouseNdc.x * CLAMP_YAW, -CLAMP_YAW, CLAMP_YAW);
      this.targetPitch = THREE.MathUtils.clamp(this.mouseNdc.y * CLAMP_PITCH, -CLAMP_PITCH, CLAMP_PITCH);
    } else {
      this.targetYaw = 0;
      this.targetPitch = 0;
    }

    this.currentYaw = THREE.MathUtils.damp(this.currentYaw, this.targetYaw, DAMP_LAMBDA, dt);
    this.currentPitch = THREE.MathUtils.damp(this.currentPitch, this.targetPitch, DAMP_LAMBDA, dt);

    const driftX = (head.userData.driftX as number) ?? 0;
    const driftY = (head.userData.driftY as number) ?? 0;

    neck.rotation.y = this.currentYaw * 0.3;
    head.rotation.y = this.currentYaw * 0.7 + driftY + ATTENTIVE_YAW_BIAS;
    head.rotation.x = this.currentPitch + driftX;
  }

  // Additive version for the real rig: the mixer sets head/neck's
  // quaternion fresh from the animation each frame before this runs, so
  // post-multiplying a small delta here turns the head without discarding
  // the mocap's own motion or compounding across frames.
  private updateCursorTrackingReal(dt: number) {
    if (!this.bones) return;
    const { head, neck } = this.bones;

    if (this.cursorTrackingEnabled) {
      this.targetYaw = THREE.MathUtils.clamp(this.mouseNdc.x * CLAMP_YAW, -CLAMP_YAW, CLAMP_YAW);
      this.targetPitch = THREE.MathUtils.clamp(this.mouseNdc.y * CLAMP_PITCH, -CLAMP_PITCH, CLAMP_PITCH);
    } else {
      this.targetYaw = 0;
      this.targetPitch = 0;
    }

    this.currentYaw = THREE.MathUtils.damp(this.currentYaw, this.targetYaw, DAMP_LAMBDA, dt);
    this.currentPitch = THREE.MathUtils.damp(this.currentPitch, this.targetPitch, DAMP_LAMBDA, dt);

    this.scratchEuler.set(this.currentPitch, this.currentYaw * 0.7 + ATTENTIVE_YAW_BIAS, 0);
    head.quaternion.multiply(this.scratchQuat.setFromEuler(this.scratchEuler));

    this.scratchEuler.set(0, this.currentYaw * 0.3, 0);
    neck.quaternion.multiply(this.scratchQuat.setFromEuler(this.scratchEuler));
  }
}
