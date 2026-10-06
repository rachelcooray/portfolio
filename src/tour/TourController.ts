import type { Guide } from "../robot/Guide";
import scriptData from "./script.json";

interface ScriptLine {
  id: string;
  text: string;
  spokenText?: string;
  target: string;
  cueWord?: string;
}

const script = scriptData as ScriptLine[];

interface TourControllerOptions {
  guide: Guide;
  subtitleEl: HTMLElement;
  srLiveEl: HTMLElement;
}

function stripPunctuation(word: string): string {
  return word.replace(/[.,!?;:]+$/, "").toLowerCase();
}

// Sequences script.json through the Guide: plays each line's audio/mouth
// sync via guide.say(), reveals subtitles word by word (mirrored into an
// aria-live region for screen readers), and triggers pointAt when the
// line's cueWord is spoken.
export class TourController {
  private readonly guide: Guide;
  private readonly subtitleEl: HTMLElement;
  private readonly srLiveEl: HTMLElement;
  private running = false;
  private cancelled = false;

  constructor({ guide, subtitleEl, srLiveEl }: TourControllerOptions) {
    this.guide = guide;
    this.subtitleEl = subtitleEl;
    this.srLiveEl = srLiveEl;
  }

  get isRunning(): boolean {
    return this.running;
  }

  async play(): Promise<void> {
    if (this.running) return;
    this.running = true;
    this.cancelled = false;

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
    const targetEl = document.querySelector<HTMLElement>(`[data-target="${line.target}"]`);
    let pointed = false;

    await this.guide.say(line.id, (_spokenWord, index) => {
      if (this.cancelled) return;
      revealed = words.slice(0, index + 1).join(" ");
      this.subtitleEl.textContent = revealed;
      this.srLiveEl.textContent = revealed;

      if (!pointed && targetEl && line.cueWord && stripPunctuation(words[index]) === line.cueWord.toLowerCase()) {
        pointed = true;
        this.guide.pointAt(targetEl);
      }
    });
  }

  private clearSubtitle(): void {
    this.subtitleEl.textContent = "";
  }
}
