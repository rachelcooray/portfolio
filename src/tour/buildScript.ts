import {
  intro,
  research,
  layer1,
  projects,
  tourOrder,
} from "../content/content";

export interface ScriptLine {
  id: string;
  text: string;
  spokenText?: string;
  target: string;
  cueWord?: string;
}

// Every narratable item, keyed by its content.ts id. tourOrder lists which
// ones play and in what sequence — this is just the lookup table.
function buildIndex(): Record<string, ScriptLine> {
  const index: Record<string, ScriptLine> = {};

  index["intro"] = {
    id: "intro",
    text: intro.narration.short,
    spokenText: intro.narration.spokenText,
    target: "intro",
    cueWord: intro.narration.cueWord,
  };

  for (const r of research) {
    index[r.id] = {
      id: r.id,
      text: r.narration.short,
      spokenText: r.narration.spokenText,
      target: r.id,
      cueWord: r.narration.cueWord,
    };
  }

  index[layer1.id] = {
    id: layer1.id,
    text: layer1.narration.short,
    spokenText: layer1.narration.spokenText,
    target: layer1.id,
    cueWord: layer1.narration.cueWord,
  };

  for (const p of projects) {
    index[p.id] = {
      id: p.id,
      text: p.narration.short,
      spokenText: p.narration.spokenText,
      target: p.id,
      cueWord: p.narration.cueWord,
    };
  }

  return index;
}

// Builds the live tour script from tourOrder, skipping any item whose
// narration is still a [PLACEHOLDER: ...] — never read unapproved/invented
// text aloud. (Currently drops the OCTAVE current-role line and the
// finance-explainer project; both need real content before they can join
// the tour — see CLAUDE.md TODO.)
export function buildScript(): ScriptLine[] {
  const index = buildIndex();
  return tourOrder
    .map((id) => index[id])
    .filter((line): line is ScriptLine => Boolean(line) && !line.text.startsWith("[PLACEHOLDER"));
}
