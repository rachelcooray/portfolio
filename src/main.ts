import "./style.css";
import { Guide } from "./robot/Guide";
import { TourController } from "./tour/TourController";

const canvas = document.querySelector<HTMLCanvasElement>("#robot-canvas");
if (!canvas) throw new Error("main: #robot-canvas not found");

const guide = new Guide(canvas);
void guide.load("/models/robot.glb");

const subtitleEl = document.querySelector<HTMLElement>("#subtitle-text");
const srLiveEl = document.querySelector<HTMLElement>("#sr-live");
if (!subtitleEl || !srLiveEl) throw new Error("main: subtitle elements not found");

const tour = new TourController({ guide, subtitleEl, srLiveEl });

const playBtn = document.querySelector<HTMLButtonElement>("#play-btn");
playBtn?.addEventListener("click", () => {
  if (!tour.isRunning) void tour.play();
});

const skipBtn = document.querySelector<HTMLButtonElement>("#skip-btn");
skipBtn?.addEventListener("click", () => tour.skip());

// Audio off by default, per spec.
const speakerBtn = document.querySelector<HTMLButtonElement>("#speaker-btn");
speakerBtn?.addEventListener("click", () => {
  const isOn = speakerBtn.getAttribute("aria-pressed") === "true";
  const nowOn = !isOn;
  speakerBtn.setAttribute("aria-pressed", String(nowOn));
  speakerBtn.textContent = nowOn ? "🔊" : "🔇";
  guide.setMuted(!nowOn);
});

// Debug: 'v' steps through the face's mouth shapes (and a test-sentence
// animation), so the mouth design can be reviewed independent of the
// tour itself.
const debugPanel = document.querySelector<HTMLDivElement>("#debug-panel");
window.addEventListener("keydown", (e) => {
  if (e.key !== "v" || !debugPanel) return;
  const step = guide.debugCycleMouth();
  if (step === "off") {
    debugPanel.hidden = true;
  } else {
    debugPanel.hidden = false;
    debugPanel.textContent = `mouth debug: ${step}`;
  }
});
