import gsap from "gsap";
import type { Guide } from "@/robot/Guide";
import { movieLines, impactStats, SCENE_COUNT_BUILT } from "./movieScript";
import { markFilmStarted, setResumeScene, clearResumeScene } from "./filmState";

function stripPunctuation(word: string): string {
  return word.replace(/[.,!?;:]+$/, "").toLowerCase();
}

export type MovieElements = {
  scrim: HTMLElement;
  letterboxTop: HTMLElement;
  letterboxBottom: HTMLElement;
  titleEl: HTMLElement;
  taglineEl: HTMLElement;
  captionEl: HTMLElement;
  srLiveEl: HTMLElement;
  statCards: { card: HTMLElement; valueEl: HTMLElement }[];
};

type MovieControllerOptions = {
  guide: Guide;
  els: MovieElements;
  onSceneChange: (sceneIndex: number) => void;
  onComplete: () => void;
};

// Drives scenes 1-3 as an async sequence rather than one declarative GSAP
// master timeline: say() durations depend on recorded audio length, which
// isn't known until each line's timing JSON loads, so the beat-to-beat
// pacing can't be fixed up front the way a pure-visual timeline's could.
// Each scene still composes small GSAP tweens for its own visuals - this
// just plays the scenes in order, the same pattern TourController already
// uses for Page mode's section-by-section narration.
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

  private caption(text: string) {
    this.els.captionEl.textContent = text;
    this.els.srLiveEl.textContent = text;
  }

  // Everything later scenes reveal starts hidden, regardless of which
  // scene we're entering at - without this, scene 2/3 elements (already
  // mounted in the DOM so GSAP has something to animate) are visible from
  // frame one, showing through scene 1's scrim.
  private initStage() {
    const { titleEl, taglineEl, letterboxTop, letterboxBottom, statCards } = this.els;
    gsap.set(titleEl.querySelectorAll("[data-char]"), { opacity: 0, y: 8 });
    gsap.set(taglineEl, { opacity: 0 });
    gsap.set([letterboxTop, letterboxBottom], { scaleY: 0 });
    gsap.set(
      statCards.map((s) => s.card),
      { opacity: 0 },
    );
    this.caption("");
  }

  async play(fromScene = 0) {
    const myRun = ++this.runId;
    this.cancelled = false;
    this.playing = true;
    this.initStage();
    markFilmStarted();

    for (let i = fromScene; i < SCENE_COUNT_BUILT; i++) {
      if (this.cancelled || myRun !== this.runId) return;
      this.currentScene = i;
      this.onSceneChange(i);
      setResumeScene(i);
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
    this.guide.setLightLevel(0, 0);
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
    const { titleEl, taglineEl, letterboxTop, letterboxBottom } = this.els;

    const chars = titleEl.querySelectorAll<HTMLElement>("[data-char]");

    const line = movieLines.scene2Intro;
    const words = line.text.split(/\s+/);
    let titleStarted = false;

    const sayPromise = this.guide.say(line.id, line.spokenText ?? line.text, (_word, index) => {
      if (this.isStale(myRun)) return;
      this.caption(words.slice(0, index + 1).join(" "));
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
    await this.guide.moveRootX(0.45, 1);
    if (this.isStale(myRun)) return;

    const line = movieLines.scene3Numbers;
    const words = line.text.split(/\s+/);
    const cueIndex = new Map(impactStats.map((s, i) => [s.cueWord.toLowerCase(), i]));
    const revealed = new Set<number>();

    await this.guide.say(line.id, line.spokenText ?? line.text, (_word, index) => {
      if (this.isStale(myRun)) return;
      this.caption(words.slice(0, index + 1).join(" "));

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

    await this.guide.moveRootX(0, 1);
    if (this.isStale(myRun)) return;
    await this.wait(600);
  }

  private revealStat(index: number) {
    const stat = impactStats[index];
    const { card, valueEl } = this.els.statCards[index];

    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    this.guide.pointAt(card);

    const numeric = parseFloat(stat.value);
    const suffix = stat.value.replace(/^[\d.]+/, "");
    if (!Number.isNaN(numeric) && /^[\d.]+%?$/.test(stat.value)) {
      const proxy = { n: 0 };
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
