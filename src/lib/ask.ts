import { buildPassages, sections, type Passage, type SectionId } from "@/content/content";

// Ask mode search. Answers come only from content.ts passages, so
// anything removed from content.ts can never be shown here.

const STOP = new Set(
  "a an and are as at be but by can could did do does for from had has have her hers how i in is it its me my of on or she so tell that the their them they this to was what when where which who whom why will with would you your about".split(
    " ",
  ),
);

const ALIASES: Record<string, string[]> = {
  job: ["octave", "experience", "role"],
  work: ["octave", "experience", "selected"],
  study: ["education", "degree"],
  studied: ["education", "degree"],
  uni: ["university", "education"],
  paper: ["research", "publication"],
  thesis: ["research", "pcos"],
  publications: ["research", "paper"],
  teach: ["teaching"],
  taught: ["teaching"],
  email: ["contact"],
  hire: ["contact"],
  cv: ["contact", "experience"],
  resume: ["contact", "experience"],
  startup: ["layer1"],
  company: ["layer1", "octave"],
  awards: ["achievement", "prize"],
  sport: ["swimming"],
  stack: ["skills", "tools"],
};

function tokens(q: string): string[] {
  const raw = q
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
  const out = new Set<string>();
  for (const t of raw) {
    out.add(t);
    if (t.endsWith("s") && t.length > 4) out.add(t.slice(0, -1));
    for (const a of ALIASES[t] ?? []) out.add(a);
  }
  return [...out];
}

let cache: Passage[] | null = null;
function passages(): Passage[] {
  if (!cache) cache = buildPassages();
  return cache;
}

export type SectionHit = { section: SectionId; label: string; number: string; passage: Passage; score: number };

export type AskResult = { sections: SectionHit[]; answer: Passage | null };

export function ask(query: string): AskResult {
  const q = query.trim().toLowerCase();
  const ts = tokens(q);
  if (!q || ts.length === 0) return { sections: [], answer: null };

  const scored = passages()
    .map((p) => {
      const title = p.title.toLowerCase();
      const text = p.text.toLowerCase();
      const kws = p.keywords.join(" ").toLowerCase();
      const label = sections.find((s) => s.id === p.section)?.label.toLowerCase() ?? "";
      let score = 0;
      for (const t of ts) {
        if (label.split(" ").includes(t) || p.section === t) score += 5;
        if (kws.includes(t)) score += 3;
        if (title.includes(t)) score += 2;
        if (text.includes(t)) score += 1;
      }
      if (q.length > 6 && text.includes(q)) score += 4;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<SectionId>();
  const hits: SectionHit[] = [];
  for (const { p, score } of scored) {
    if (seen.has(p.section)) continue;
    seen.add(p.section);
    const s = sections.find((x) => x.id === p.section)!;
    hits.push({ section: p.section, label: s.label, number: s.number, passage: p, score });
    if (hits.length === 4) break;
  }
  return { sections: hits, answer: scored[0]?.p ?? null };
}

// First two sentences of a passage, never more than about 320 characters.
export function excerpt(text: string, max = 320): string {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const s of parts) {
    if ((out + s).length > max && out) break;
    out += s;
    if (out.length > 160) break;
  }
  return out.trim();
}

// ---------------------------------------------------------------------
// Small event bus shared by the header, the Ask palette and the tour.
// ---------------------------------------------------------------------

export const ASK_OPEN = "rc:ask-open";
export const TOUR_START = "rc:tour-start";

export function openAsk(query = "") {
  window.dispatchEvent(new CustomEvent(ASK_OPEN, { detail: { query } }));
}

export function startTour() {
  window.dispatchEvent(new CustomEvent(TOUR_START));
}

export function reducedMotion(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("rm");
}

// Scroll to a section and briefly highlight it (or one passage inside it).
export function goToSection(id: SectionId, passageId?: string) {
  const sec = document.getElementById(id);
  if (!sec) return;
  const target =
    (passageId && sec.querySelector<HTMLElement>(`[data-passage="${CSS.escape(passageId)}"]`)) || sec;
  import("@/lib/lenis").then(({ scrollToTarget }) => {
    scrollToTarget(target === sec ? sec : target, { immediate: reducedMotion() });
    history.replaceState(null, "", `#${id}`);
    target.classList.remove("flash");
    void target.offsetWidth;
    target.classList.add("flash");
    window.setTimeout(() => target.classList.remove("flash"), 2400);
    // Move focus for keyboard and screen reader users without scrolling twice.
    const focusable = sec.querySelector<HTMLElement>("h2") ?? sec;
    focusable.setAttribute("tabindex", "-1");
    focusable.focus({ preventScroll: true });
  });
}
