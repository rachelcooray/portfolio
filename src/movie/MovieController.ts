import gsap from "gsap";
import type { Guide } from "@/robot/Guide";
import { movieLines, impactStats, scene4Cues, octaveSteps, SCENE_COUNT_BUILT } from "./movieScript";
import { markFilmStarted, setResumeScene, clearResumeScene } from "./filmState";

function stripPunctuation(word: string): string {
  return word.replace(/[.,!?;:]+$/, "").toLowerCase();
}

// Caption shows a trailing window of words, not the whole line
// accumulated - a full paragraph sitting over the stage reads as a
// transcript, not a film caption.
const CAPTION_WINDOW = 10;
function captionWindow(words: string[], upToIndex: number): string {
  return words.slice(Math.max(0, upToIndex - (CAPTION_WINDOW - 1)), upToIndex + 1).join(" ");
}

export type MovieElements = {
  scrim: HTMLElement;
  letterboxTop: HTMLElement;
  letterboxBottom: HTMLElement;
  titleEnvelope: HTMLElement; // wraps title+tagline - the scene 1-2 "group"
  titleEl: HTMLElement;
  taglineEl: HTMLElement;
  captionEl: HTMLElement;
  srLiveEl: HTMLElement;
  statGrid: HTMLElement; // wraps the 4 stat cards - the scene 3 "group"
  statCards: { card: HTMLElement; valueEl: HTMLElement }[];
  researchCard: HTMLElement; // the scene 4 "group" (card itself, no separate wrapper needed)
  researchVenue: HTMLElement;
  awardBadge: HTMLElement;
  octaveGroup: HTMLElement; // wraps the role-path - the scene 5 "group"
  octaveSteps: HTMLElement[];
};

type MovieControllerOptions = {
  guide: Guide;
  els: MovieElements;
  onSceneChange: (sceneIndex: number) => void;
  onComplete: () => void;
};

// Drives the scenes as an async sequence rather than one declarative GSAP
// master timeline: say() durations depend on recorded audio length, which
// isn't known until each line's timing JSON loads, so the beat-to-beat
// pacing can't be fixed up front the way a pure-visual timeline's could.
// Each scene still composes small GSAP tweens for its own visuals - this
// just plays the scenes in order, the same pattern TourController already
// uses for Page mode's section-by-section narration.
//
// Staging model: each scene is one of four "groups" (titleEnvelope,
// statGrid, researchCard, octaveGroup). Only one group is ever visible at
// a time - clearStage() fades out whatever's currently up before the next
// scene reveals its own group, so the stage never accumulates leftovers
// from earlier scenes.
export class MovieController {
  private guide: Guide;
  private els: MovieElements;
  private onSceneChange: (sceneIndex: number) => void;
  private onComplete: () => void;

  private cancelled = false;
  private runId = 0;
  currentScene = 0;
  playing = false;

  constructor(opts: MovieControllerOptions) {
    this.guide = opts.guide;
    this.els = opts.els;
    this.onSceneChange = opts.onSceneChange;
    this.onComplete = opts.onComplete;
  }

  // Movie mode's card-style reveals (stat/research/role cards) use this
  // instead of pointAt's built-in highlight class - that class is a thin
  // underline sized for a line of text, and reading its 35%-height stripe
  // across a whole card renders as a big flat colour wipe, not a subtle
  // highlight.
  private cardPulse(el: HTMLElement) {
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8b1e3f";
    gsap.killTweensOf(el, "boxShadow");
    gsap.fromTo(
      el,
      { boxShadow: `0 0 0 3px ${accent}` },
      { boxShadow: `0 0 0 0 ${accent}00`, duration: 0.9, ease: "power1.out", clearProps: "boxShadow" },
    );
  }

  private caption(text: string) {
    this.els.captionEl.textContent = text;
    this.els.srLiveEl.textContent = text;
  }

  private get groups() {
    return [this.els.titleEnvelope, this.els.statGrid, this.els.researchCard, this.els.octaveGroup];
  }

  // Instant reset of every group + 3D state to a known baseline, run once
  // at the top of every play() call regardless of entry scene - without
  // this, scene 2+ elements (already mounted in the DOM so GSAP has
  // something to animate) are visible from frame one, showing through
  // scene 1's scrim. Also resets lighting/scrim/robot position/camera,
  // needed because jumping straight to scene 2+ (chapter bar, arrow keys,
  // resume-from-leave) would otherwise land mid-way through whatever a
  // cancelled scene's in-flight tweens left them at. Scene 1 immediately
  // overrides the lighting/scrim part right back down to its own dark
  // cold-open when fromScene is 0, so this doesn't fight it.
  private initStage(fromScene: number) {
    const { scrim, titleEl, letterboxTop, letterboxBottom, statCards, awardBadge, octaveSteps: steps } = this.els;
    const cardEls = statCards.map((s) => s.card);
    const chars = titleEl.querySelectorAll("[data-char]");

    // gsap.set doesn't stop other active tweens on the same target - a
    // reveal animation still in flight from a just-cancelled scene would
    // otherwise keep overwriting these resets on later frames.
    gsap.killTweensOf([scrim, ...this.groups, chars, letterboxTop, letterboxBottom, ...cardEls, awardBadge, ...steps]);

    gsap.set(this.groups, { opacity: 0 });
    gsap.set(chars, { opacity: 0, y: 8 });
    gsap.set([letterboxTop, letterboxBottom], { scaleY: fromScene > 1 ? 1 : 0 });
    gsap.set(cardEls, { opacity: 0 });
    gsap.set(awardBadge, { opacity: 0, scale: 0, rotate: -15 });
    gsap.set(steps, { opacity: 0 });
    this.caption("");

    if (fromScene > 0) {
      gsap.set(scrim, { opacity: 0 });
      this.guide.forceLightLevel(1);
    }
    void this.guide.moveRootX(0, 0);
    void this.guide.resetCamera(0);
  }

  // Fades out whatever group is currently on stage. Called at the start of
  // every scene after the first, so the previous scene's content is fully
  // gone before the new scene reveals anything - a clean cut, not a pile-up.
  private clearStage(duration = 0.5): Promise<void> {
    return new Promise((resolve) => {
      gsap.killTweensOf(this.groups);
      gsap.to(this.groups, { opacity: 0, duration, ease: "power1.out", onComplete: () => resolve() });
    });
  }

  async play(fromScene = 0) {
    const myRun = ++this.runId;
    this.cancelled = false;
    this.playing = true;
    this.initStage(fromScene);
    markFilmStarted();

    for (let i = fromScene; i < SCENE_COUNT_BUILT; i++) {
      if (this.cancelled || myRun !== this.runId) return;
      this.currentScene = i;
      this.onSceneChange(i);
      setResumeScene(i);
      if (i > fromScene) await this.clearStage();
      if (this.isStale(myRun)) return;
      await this.runScene(i, myRun);
    }
    if (this.cancelled || myRun !== this.runId) return;
    clearResumeScene();
    this.playing = false;
    this.onComplete();
  }

  private runScene(index: number, myRun: number): Promise<void> {
    switch (index) {
      case 0:
        return this.scene1Coldopen(myRun);
      case 1:
        return this.scene2TitleCard(myRun);
      case 2:
        return this.scene3ImpactNumbers(myRun);
      case 3:
        return this.scene4Research(myRun);
      case 4:
        return this.scene5Octave(myRun);
      default:
        return Promise.resolve();
    }
  }

  private isStale(myRun: number) {
    return this.cancelled || myRun !== this.runId;
  }

  // --- Scene 1: cold open -------------------------------------------------
  private async scene1Coldopen(myRun: number) {
    const { scrim } = this.els;
    gsap.set(scrim, { opacity: 1 });
    this.guide.forceLightLevel(0);
    this.guide.lookAtCursor(false);

    await Promise.all([
      new Promise<void>((resolve) => gsap.to(scrim, { opacity: 0, duration: 1.6, ease: "power1.in", onComplete: () => resolve() })),
      this.guide.setLightLevel(1, 1.6),
    ]);
    if (this.isStale(myRun)) return;

    const line = movieLines.scene1Hello;
    await this.guide.say(line.id, line.text, () => {});
    this.caption(line.text);
    if (this.isStale(myRun)) return;
    await this.wait(900);
  }

  // --- Scene 2: title card -------------------------------------------------
  private async scene2TitleCard(myRun: number) {
    const { titleEnvelope, titleEl, taglineEl, letterboxTop, letterboxBottom } = this.els;

    const chars = titleEl.querySelectorAll<HTMLElement>("[data-char]");
    gsap.set(titleEnvelope, { opacity: 1 });

    const line = movieLines.scene2Intro;
    const words = line.text.split(/\s+/);
    let titleStarted = false;

    const sayPromise = this.guide.say(line.id, line.spokenText ?? line.text, (_word, index) => {
      if (this.isStale(myRun)) return;
      this.caption(captionWindow(words, index));
      if (!titleStarted && line.cueWord && stripPunctuation(words[index]) === line.cueWord.toLowerCase()) {
        titleStarted = true;
        gsap.to(chars, { opacity: 1, y: 0, duration: 0.4, stagger: 0.035, ease: "power2.out" });
      }
    });
    // Cue word is near the start of the line, but guard the rare case
    // (dropped frame, muted synthetic timing) where it never fires.
    if (!titleStarted) gsap.to(chars, { opacity: 1, y: 0, duration: 0.4, stagger: 0.035, ease: "power2.out" });

    await sayPromise;
    if (this.isStale(myRun)) return;

    await Promise.all([
      new Promise<void>((resolve) => gsap.to(taglineEl, { opacity: 1, duration: 0.6, onComplete: () => resolve() })),
      new Promise<void>((resolve) =>
        gsap.to([letterboxTop, letterboxBottom], { scaleY: 1, duration: 0.6, ease: "power2.out", onComplete: () => resolve() }),
      ),
    ]);
    if (this.isStale(myRun)) return;
    await this.wait(1200);
  }

  // --- Scene 3: impact numbers ---------------------------------------------
  // One continuous line (matches the narration doc) with four cue words
  // inside it - each reveals its stat card the instant it's spoken, same
  // single-cue-per-line mechanism TourController uses for Page mode, just
  // applied four times within one say() call instead of once per line.
  private async scene3ImpactNumbers(myRun: number) {
    gsap.set(this.els.statGrid, { opacity: 1 });

    const line = movieLines.scene3Numbers;
    const words = line.text.split(/\s+/);
    const cueIndex = new Map(impactStats.map((s, i) => [s.cueWord.toLowerCase(), i]));
    const revealed = new Set<number>();

    await this.guide.say(line.id, line.spokenText ?? line.text, (_word, index) => {
      if (this.isStale(myRun)) return;
      this.caption(captionWindow(words, index));

      const statIndex = cueIndex.get(stripPunctuation(words[index]));
      if (statIndex === undefined || revealed.has(statIndex)) return;
      revealed.add(statIndex);
      this.revealStat(statIndex);
    });
    if (this.isStale(myRun)) return;

    // Anything that never matched (timing fallback, etc.) still gets shown.
    impactStats.forEach((_, i) => {
      if (!revealed.has(i)) this.revealStat(i);
    });
    await this.wait(900);
  }

  // --- Scene 4: research -----------------------------------------------
  private async scene4Research(myRun: number) {
    const { researchCard, researchVenue, awardBadge } = this.els;
    gsap.set(researchCard, { opacity: 1 });

    const line = movieLines.scene4Research;
    const words = line.text.split(/\s+/);
    let cardPointed = false;
    let ieeeHighlighted = false;
    let awardShown = false;

    await this.guide.say(line.id, line.spokenText ?? line.text, (_word, index) => {
      if (this.isStale(myRun)) return;
      this.caption(captionWindow(words, index));
      const token = stripPunctuation(words[index]);

      if (!cardPointed && token === scene4Cues.cardCue.toLowerCase()) {
        cardPointed = true;
        this.guide.pointAt(researchCard, { highlight: false });
        this.cardPulse(researchCard);
      }
      if (!ieeeHighlighted && token === scene4Cues.ieeeCue.toLowerCase()) {
        ieeeHighlighted = true;
        // gsap's color parser needs a resolved value, not a var() reference.
        const highlighter = getComputedStyle(document.documentElement).getPropertyValue("--highlighter").trim();
        gsap.fromTo(
          researchVenue,
          { backgroundColor: highlighter || "#f2d45c" },
          { backgroundColor: "transparent", duration: 1.1, ease: "power1.out" },
        );
      }
      if (!awardShown && token === scene4Cues.awardCue.toLowerCase()) {
        awardShown = true;
        gsap.to(awardBadge, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" });
      }
    });
    if (this.isStale(myRun)) return;

    if (!awardShown) gsap.to(awardBadge, { opacity: 1, scale: 1, rotate: 0, duration: 0.4 });
    await this.wait(900);
  }

  // --- Scene 5: OCTAVE ----------------------------------------------------
  private async scene5Octave(myRun: number) {
    gsap.set(this.els.octaveGroup, { opacity: 1 });

    const line = movieLines.scene5Octave;
    const words = line.text.split(/\s+/);
    const cueIndex = new Map(octaveSteps.map((s, i) => [s.cueWord.toLowerCase(), i]));
    const revealed = new Set<number>();

    await this.guide.say(line.id, line.spokenText ?? line.text, (_word, index) => {
      if (this.isStale(myRun)) return;
      this.caption(captionWindow(words, index));

      const stepIndex = cueIndex.get(stripPunctuation(words[index]));
      if (stepIndex === undefined || revealed.has(stepIndex)) return;
      revealed.add(stepIndex);
      const stepEl = this.els.octaveSteps[stepIndex];
      gsap.fromTo(stepEl, { opacity: 0, y: 14, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" });
      this.guide.pointAt(stepEl, { highlight: false });
      this.cardPulse(stepEl);
    });
    if (this.isStale(myRun)) return;

    octaveSteps.forEach((_, i) => {
      if (!revealed.has(i)) gsap.to(this.els.octaveSteps[i], { opacity: 1, y: 0, scale: 1, duration: 0.3 });
    });
    await this.wait(900);
  }

  private revealStat(index: number) {
    const stat = impactStats[index];
    const { card, valueEl } = this.els.statCards[index];

    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    this.guide.pointAt(card, { highlight: false });
    this.cardPulse(card);

    const numeric = parseFloat(stat.value);
    const suffix = stat.value.replace(/^[\d.]+/, "");
    if (!Number.isNaN(numeric) && /^[\d.]+%?$/.test(stat.value)) {
      const proxy = { n: 0 };
      gsap.killTweensOf(proxy);
      gsap.to(proxy, {
        n: numeric,
        duration: 1,
        ease: "power1.out",
        onUpdate: () => {
          valueEl.textContent = (Number.isInteger(numeric) ? Math.round(proxy.n) : proxy.n.toFixed(2)) + suffix;
        },
      });
    } else {
      valueEl.textContent = stat.value;
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  // --- Controls -------------------------------------------------------------
  pause() {
    if (!this.playing) return;
    gsap.globalTimeline.pause();
    this.guide.pauseSpeaking();
    this.playing = false;
  }

  resume() {
    if (this.playing) return;
    gsap.globalTimeline.resume();
    this.guide.resumeSpeaking();
    this.playing = true;
  }

  // Ends the film immediately - used by "Skip to site".
  skip() {
    this.cancelled = true;
    this.runId++;
    gsap.globalTimeline.resume();
    this.guide.stopSpeaking();
    clearResumeScene();
    this.playing = false;
    this.onComplete();
  }

  // Jumps to a scene's start (chapter bar / arrow keys). Restarts the
  // sequence from there rather than scrubbing mid-scene.
  jumpTo(index: number) {
    if (index < 0 || index >= SCENE_COUNT_BUILT) return;
    this.cancelled = true;
    this.runId++;
    gsap.globalTimeline.resume();
    this.guide.stopSpeaking();
    void this.play(index);
  }

  next() {
    this.jumpTo(this.currentScene + 1);
  }

  prev() {
    this.jumpTo(this.currentScene - 1);
  }

  destroy() {
    this.cancelled = true;
    this.runId++;
    gsap.globalTimeline.resume();
  }
}
