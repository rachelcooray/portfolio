import type { Guide } from "../robot/Guide";
import { buildScript, type ScriptLine } from "./buildScript";

interface TourControllerOptions {
  guide: Guide;
  subtitleEl: HTMLElement;
  srLiveEl: HTMLElement;
  onLineStart?: (line: ScriptLine) => void;
  onLineEnd?: (line: ScriptLine) => void;
}

function stripPunctuation(word: string): string {
  return word.replace(/[.,!?;:]+$/, "").toLowerCase();
}

// Sequences the tour script (built from content.ts — see buildScript.ts)
// through the Guide: plays each line's audio/mouth sync via guide.say(),
// reveals subtitles word by word (mirrored into an aria-live region for
// screen readers), and triggers pointAt when the line's cueWord is spoken.
export class TourController {
  private readonly guide: Guide;
  private readonly subtitleEl: HTMLElement;
  private readonly srLiveEl: HTMLElement;
  private readonly onLineStart?: (line: ScriptLine) => void;
  private readonly onLineEnd?: (line: ScriptLine) => void;
  private running = false;
  private cancelled = false;

  constructor({ guide, subtitleEl, srLiveEl, onLineStart, onLineEnd }: TourControllerOptions) {
    this.guide = guide;
    this.subtitleEl = subtitleEl;
    this.srLiveEl = srLiveEl;
    this.onLineStart = onLineStart;
    this.onLineEnd = onLineEnd;
  }

  get isRunning(): boolean {
    return this.running;
  }

  async play(): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.cancelled = false;

    const script = buildScript();
    for (const line of script) {
      if (this.cancelled) break;
      await this.playLine(line);
    }

    this.running = false;
    this.clearSubtitle();
  }

  skip(): void {
    this.cancelled = true;
    this.running = false;
    this.guide.stopSpeaking();
    this.guide.setState("idle");
    this.clearSubtitle();
    document.querySelectorAll(".guide-highlight").forEach((el) => el.classList.remove("guide-highlight"));
  }

  private async playLine(line: ScriptLine): Promise<void> {
    const words = line.text.split(/\s+/);
    let revealed = "";
    const targetEl = document.querySelector<HTMLElement>(`[data-guide-id="${line.target}"]`);
    let pointed = false;

    this.onLineStart?.(line);

    // Scroll the section into view as the robot starts talking about it —
    // without this, pointAt's arm-point + highlight happen on an
    // off-screen element and nothing visible occurs.
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    await this.guide.say(line.id, line.spokenText ?? line.text, (_spokenWord, index) => {
      if (this.cancelled) return;
      revealed = words.slice(0, index + 1).join(" ");
      this.subtitleEl.textContent = revealed;
      this.srLiveEl.textContent = revealed;

      if (!pointed && targetEl && line.cueWord && stripPunctuation(words[index]) === line.cueWord.toLowerCase()) {
        pointed = true;
        this.guide.pointAt(targetEl);
      }
    });

    // Cue word never matched (e.g. not present verbatim in the spoken
    // text) — still point at the target once the line finishes, so the
    // section gets acknowledged either way.
    if (!pointed && targetEl) {
      this.guide.pointAt(targetEl);
    }

    this.onLineEnd?.(line);
  }

  private clearSubtitle(): void {
    this.subtitleEl.textContent = "";
  }
}
