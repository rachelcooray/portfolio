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

// "Cooray" pronunciation, confirmed: the first syllable is short, like
// "ku" (rhymes with "cup"), not the long "coo" the plain spelling reads
// as by default. Spelled as one word so `say`'s word count still matches
// the subtitle text (keeps cue-word indices aligned wherever "Cooray"
// isn't the very last word of a line - see the IEEE-at-end precedent
// below, which gets away with a word-count change only because nothing
// follows it).
const COORAY_SPOKEN = "Kuhray";

// Source: Rachel's "Robot Narration Script" doc (6 Oct 2026) - the
// approved source for these fields from here on. One adaptation from
// that doc, forced by an engine constraint rather than a content choice:
// scene 2's cue word is written as "Rachel Cooray" (two words) but cue
// matching is single-token only (same limitation that made the tour's
// "PCOS Care" cue become "PCOS" earlier) - using "Rachel".
export const movieLines: Record<string, MovieLine> = {
  scene1Hello: {
    id: "movie-scene1-hello",
    text: "Hello. I've been asked to introduce someone.",
  },
  scene2Intro: {
    id: "movie-scene2-intro",
    text: "This is Rachel Cooray. She applies AI to real business problems.",
    spokenText: `This is Rachel ${COORAY_SPOKEN}. She applies AI to real business problems.`,
    cueWord: "Rachel",
  },
  scene3Numbers: {
    id: "movie-scene3-numbers",
    text:
      "Let's start with results. Ninety-three point seven five percent recall, on a model that flags health risk early. A sixty-eight percent increase in potential margins, from incentive design. Thirteen projects, for four clients. And a paper published by IEEE.",
    spokenText:
      "Let's start with results. Ninety-three point seven five percent recall, on a model that flags health risk early. A sixty-eight percent increase in potential margins, from incentive design. Thirteen projects, for four clients. And a paper published by I triple E.",
  },
  scene4Research: {
    id: "movie-scene4-research",
    text:
      "The research is called PCOS Care. It predicts the risk of polycystic ovary syndrome early, and shows which factors drove each prediction. She presented it at an IEEE conference in Tunisia. Out of more than four hundred final year projects, it placed third.",
    spokenText:
      "The research is called P C O S Care. It predicts the risk of polycystic ovary syndrome early, and shows which factors drove each prediction. She presented it at an I triple E conference in Tunisia. Out of more than four hundred final year projects, it placed third.",
  },
  scene5Octave: {
    id: "movie-scene5-octave",
    text:
      "Today, she works at OCTAVE, the advanced analytics arm of John Keells Holdings. She joined as an intern. Then associate. Then analyst. In under a year. Her incentive designs for a distributor network raised potential margins by sixty-eight percent, and her dashboards let management track it in real time.",
    spokenText:
      "Today, she works at octave, the advanced analytics arm of John Keells Holdings. She joined as an intern. Then associate. Then analyst. In under a year. Her incentive designs for a distributor network raised potential margins by sixty-eight percent, and her dashboards let management track it in real time.",
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

// Scene 4's paper card - verbatim from content.ts research[0].
export const researchCard = {
  title:
    "PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome",
  venue: "IEEE ICAHS 2025, Tunisia",
};
// cueWord "third" triggers the award badge; "PCOS Care" -> "PCOS" (same
// single-token adaptation as scene 2's cue) points at the card; "IEEE"
// highlights the venue line.
export const scene4Cues = {
  cardCue: "PCOS",
  ieeeCue: "IEEE",
  awardCue: "third",
};

// Scene 5's rising role path - short labels matching the doc's own
// phrasing ("joined as an intern. Then associate. Then analyst."), not
// the full job titles (those are on the page itself).
export const octaveSteps = [
  { id: "step1", label: "Intern", cueWord: "intern" },
  { id: "step2", label: "Associate", cueWord: "associate" },
  { id: "step3", label: "Analyst", cueWord: "analyst" },
];

export const SCENE_COUNT_BUILT = 5;
export const sceneLabels = ["Cold open", "Title card", "Impact numbers", "Research", "OCTAVE"];
