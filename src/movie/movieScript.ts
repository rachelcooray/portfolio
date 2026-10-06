// Scenes 1-3 of the first-visit cinematic (see CLAUDE.md "Movie mode").
// Movie dialogue is the robot speaking in character, first person, to the
// visitor - a different register from Page mode's third-person Jamie
// narration about Rachel (src/tour/buildScript.ts). Both are read by the
// same "Jamie (Premium)" voice; only the grammatical person differs.
//
// Each line with an `id` gets generated audio (npm run voice:movie ->
// public/audio/{id}.mp3 + .json) via the same say()/timing pipeline the
// tour already uses. Lines without dialogue (the title card) have none.

export type MovieLine = {
  id: string;
  text: string;
  spokenText?: string;
  cueWord?: string; // single token only - the engine matches one word (see TourController)
};

// Source: Rachel's "Robot Narration Script" doc (6 Oct 2026) - the
// approved source for these fields from here on. Two adaptations from
// that doc, both forced by engine constraints rather than content choices:
//  - Scene 2's cue word is written as "Rachel Cooray" (two words) but
//    cueWord matching is single-token only (same limitation that made the
//    tour's "PCOS Care" cue become "PCOS" earlier) - using "Rachel".
//  - "Cooray" has no confirmed spokenText yet ("needs your input" in the
//    doc), so it's left to `say`'s default reading for now.
export const movieLines: Record<string, MovieLine> = {
  scene1Hello: {
    id: "movie-scene1-hello",
    text: "Hello. I've been asked to introduce someone.",
  },
  scene2Intro: {
    id: "movie-scene2-intro",
    text: "This is Rachel Cooray. She applies AI to real business problems.",
    cueWord: "Rachel",
  },
  scene3Numbers: {
    id: "movie-scene3-numbers",
    text:
      "Let's start with results. Ninety-three point seven five percent recall, on a model that flags health risk early. A sixty-eight percent increase in potential margins, from incentive design. Thirteen projects, for four clients. And a paper published by IEEE.",
    spokenText:
      "Let's start with results. Ninety-three point seven five percent recall, on a model that flags health risk early. A sixty-eight percent increase in potential margins, from incentive design. Thirteen projects, for four clients. And a paper published by I triple E.",
  },
};

export const movieScriptLines: MovieLine[] = Object.values(movieLines);

// Scene 3's on-screen stat cards, each tied to one cue word inside
// scene3Numbers above. Figures are drawn verbatim from real content
// (src/content/content.ts), not invented for the film:
//  - 93.75% recall: PCOS Care / IEEE paper (content.ts projects[])
//  - 68% increase in potential margins: OCTAVE distributor work (octave[])
//  - 13 projects for 4 clients: Layer1 Studio (layer1)
//  - IEEE publication: PCOS Care paper, ICAHS 2025 Tunisia (research[])
export const impactStats = [
  { id: "stat1", value: "93.75%", label: "recall", cueWord: "Ninety-three" },
  { id: "stat2", value: "68%", label: "increase in potential margins", cueWord: "sixty-eight" },
  { id: "stat3", value: "13", label: "projects for 4 clients", cueWord: "Thirteen" },
  { id: "stat4", value: "IEEE", label: "published research", cueWord: "IEEE" },
];

export const SCENE_COUNT_BUILT = 3;
export const sceneLabels = ["Cold open", "Title card", "Impact numbers"];
