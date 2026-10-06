// First-visit rules for Movie mode (localStorage, always wrapped in
// try/catch - private browsing / blocked storage must fail open to "seen",
// never trap a visitor in a loop or crash the page).
const SEEN_KEY = "rc-film-seen";
const RESUME_SCENE_KEY = "rc-film-resume-scene";

export function hasSeenFilm(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true; // storage unavailable -> don't force an autoplay we can't track
  }
}

// Called the instant the film starts playing (not on completion) - so a
// visitor who leaves mid-film, or hits Skip, never sees it autoplay again.
export function markFilmStarted() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function getResumeScene(): number {
  try {
    return Number(localStorage.getItem(RESUME_SCENE_KEY) ?? "0") || 0;
  } catch {
    return 0;
  }
}

export function setResumeScene(sceneIndex: number) {
  try {
    localStorage.setItem(RESUME_SCENE_KEY, String(sceneIndex));
  } catch {
    /* ignore */
  }
}

// Called on Skip or natural completion - both land on Page mode with
// nothing left to resume.
export function clearResumeScene() {
  try {
    localStorage.removeItem(RESUME_SCENE_KEY);
  } catch {
    /* ignore */
  }
}
