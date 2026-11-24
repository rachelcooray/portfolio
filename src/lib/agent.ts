// The Ask agent's brain, kept apart from the UI so it can be tested
// (scripts/test-agent.ts). It never writes new text: every answer is a
// published FAQ answer or a quoted passage from content.ts, or one of the
// fixed replies below. It only knows about Rachel.
import { aiCompetencies, askFaqs, askMore, site, skillCloud, thinkingLayer, toolkitStack, type Passage } from "@/content/content";

export type Answer = { text: string; title: string; href: string; label: string };
export type Kind = "empty" | "smalltalk" | "private" | "contact" | "recruiter" | "handoff" | "answer" | "none";
export type Reply = { kind: Kind; text?: string; answer: Answer | null };

// ---------------------------------------------------------------- fixed replies
export const REPLIES = {
  hello: "Hello. I'm Rachel's agent. Ask me about her work, research, education or skills, or tap a question above.",
  thanks: "You're welcome. Is there anything else you'd like to know about Rachel's work?",
  bye: "Thanks for visiting. You can reach Rachel any time through the contact form below.",
  private: "I keep to Rachel's work, so I can't share personal details. You're welcome to ask her directly.",
  confidential: "OCTAVE's client names, partners and business figures are confidential, so I can't share them. Rachel can walk you through the approach and her part in it.",
  contact: "Here is how to reach Rachel. She reads every message.",
  recruiter:
    "Thank you for your interest. The best next step is to speak to Rachel directly. She is an Analyst, Data and AI at OCTAVE, John Keells Holdings, with a First Class BSc in Computer Science and research published at IEEE ICAHS 2025.",
  handoff: "That one is for Rachel herself. Leave your email and what you need, and I'll pass it straight to her.",
  none: "I only cover Rachel and her work, and I couldn't find that. Try one of these, or leave Rachel a message.",
};

// ---------------------------------------------------------------- intents
const GREETING = /^(hi+|hey+|hello+|hiya|yo|good (morning|afternoon|evening)|greetings)\b[\s!.,]*(there|rachel|bot|agent)?[\s!.,]*$/i;
const THANKS = /^(thanks?|thank you|thx|ty|cheers|great|awesome|perfect|nice|cool|ok(ay)?|got it)\b[\s!.,]*(so much|a lot|very much)?[\s!.,]*$/i;
const BYE = /^(bye|goodbye|see you|see ya|that'?s all)\b/i;

// Personal details the agent should never discuss.
const PRIVATE =
  /\b(how old|how tall|her age|age is|date of birth|birthday|born in|married|single|boyfriend|girlfriend|husband|wife|partner'?s? name|dating|religio\w*|caste|ethnic\w*|home address|where (exactly )?does she live|her address|weight|height|medical|health condition|pregnan\w*|kids|children of her own|family members|parents'? names?|nic number|passport)\b/i;

// Confidential OCTAVE details: never answered.
const CONFIDENTIAL =
  /\b(client names?|clients? (are|list|does)|which (clients|distributors|brands|customers)|distributor names?|customer names?|revenue|turnover|profit|how much (money|revenue|did|was)|margin (uplift|increase|figures?|numbers?)|uplift (figure|number)|(exact|actual) (figures?|numbers?)|internal data|confidential)\b/i;

// Not about Rachel at all, or trying to break the agent.
const INJECTION = /(ignore (all |any )?(previous|prior|above) (instructions|prompts?)|system prompt|jailbreak|developer mode|<\s*script|drop table|union select|select \* from|;\s*--)/i;
const OFF_TOPIC = /\b(weather (in|today|tomorrow|forecast)|recipe|poem|joke|lyrics|stock price|bitcoin|capital of|translate|what time is it|what('?s| is) \d+ ?[-+*/x] ?\d+)\b/i;
const ABOUT_HER = /\b(rachel|cooray|she|her|hers|you|your|this agent|this bot)\b/i;

// Ways to reach her.
const CONTACT = /\b(contact|e-?mail|phone|number|call her|reach her|reach rachel|get in touch|linkedin|whatsapp|message her|her cv|resume|cv)\b/i;

// Recruiters: never answer salary, notice, visa or start date.
const RECRUITER =
  /\b(recruit\w*|i'?m hiring|we'?re hiring|we are hiring|are you hiring|hiring for|headhunt\w*|talent acquisition|vacanc\w*|job opening|open (role|position)s?|salary|compensation|expected pay|notice period|start date|when can she start|visa|work permit|right to work|relocat\w*|sponsor\w*|candidate|job offer|offer her|interview (her|rachel)|for an interview|open to (work|roles|opportunities|new roles)|looking for (a )?(job|role|work)|available for (a )?(job|role|work|hire)|i'?m a recruiter|i am a recruiter|(a|an) (role|position|opening|vacancy) for|would she be interested)\b/i;

// Requests only Rachel can answer: work for someone, quotes, collaboration.
const REQUEST =
  /\b(can|could|would|will) (she|you|rachel)\b.*\b(make|build|design|create|develop|help|do|work|quote|speak|talk|mentor|join|present)\b|\bfor (me|us|my|our)\b|\b(take|takes|taking|accept|accepts|accepting) on\b|\bnew (projects?|clients?|work)\b|\bwork with (her|rachel)\b|\b(build|make|design) (me|us)\b|\bhire (her|rachel) (to|for)\b|\bhow much (does|do|would|will) (she|you) charge\b|\b(charge|charges|quote|pricing|price|cost|rates?|freelance|commission|collaborat\w*|partner(ship)? with|availab\w*|book (her|rachel)|meet (her|rachel)|call with|guest lecture|speak at|speaking)\b/i;

// A request about building something is a project enquiry, not a job.
const PROJECT_WORDS = /\b(website|web ?site|site|app|application|mobile app|web app|dashboard|project|chatbot|landing page|store|shop)\b/i;

// ---------------------------------------------------------------- text helpers
const STOP = new Set(
  "a an and are as at be but by can could did do does for from has have her hers how i in is it its me my of on or she so that the their them they this to was what whats when where which who why will with you your about tell would like please give some any much know more".split(" "),
);

// Loose words people type, mapped to the words the content uses.
const SYNONYMS: Record<string, string[]> = {
  edu: ["education", "degree", "university", "study"],
  education: ["degree", "university", "study", "school"],
  study: ["education", "degree", "university"],
  studied: ["education", "degree", "university"],
  uni: ["university", "degree", "westminster"],
  college: ["university", "degree"],
  degree: ["education", "university"],
  bg: ["background"],
  exp: ["experience", "role", "work"],
  experience: ["role", "work", "job"],
  job: ["role", "work", "octave"],
  work: ["role", "octave", "experience"],
  career: ["role", "experience"],
  research: ["pcos", "paper", "ieee"],
  paper: ["research", "pcos", "ieee"],
  publication: ["research", "paper", "ieee"],
  thesis: ["research", "pcos", "project"],
  dissertation: ["research", "pcos", "project"],
  fyp: ["pcos", "project", "showcase"],
  skills: ["tools", "stack"],
  tech: ["tools", "stack", "skills"],
  stack: ["tools", "skills"],
  ml: ["machine", "learning", "model"],
  ai: ["machine", "learning", "model", "agent"],
  awards: ["award", "prize", "achievement"],
  prizes: ["award", "prize"],
  volunteering: ["volunteer", "event"],
  volunteer: ["volunteering", "event"],
  csr: ["uplift", "volunteer", "vendor"],
  school: ["prefect", "convent"],
  swimming: ["swim", "gold"],
  swim: ["swimming", "gold"],
  talk: ["csw65", "panel", "speaking"],
  speech: ["csw65", "panel", "speaking"],
  un: ["csw65", "panel"],
  forecast: ["forecasting", "planning"],
  weather: ["weather", "sales"],
  dispatch: ["dispatch", "planning"],
  margins: ["margin", "distributor"],
};

const stem = (w: string) => w.replace(/(ing|ies|es|s)$/, "");

export function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

// Small typo fixer: maps an unknown word to the closest known word.
function lev(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    let rowMin = prev[0];
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
      rowMin = Math.min(rowMin, prev[j]);
    }
    if (rowMin > max) return max + 1;
  }
  return prev[b.length];
}

let VOCAB: Set<string> | null = null;
function vocab(passages: Passage[]) {
  if (VOCAB) return VOCAB;
  const v = new Set<string>();
  for (const f of [...askFaqs, ...askMore]) for (const k of f.keywords) for (const w of words(k)) v.add(w);
  for (const k of Object.keys(SYNONYMS)) v.add(k);
  for (const p of passages) {
    for (const w of words(p.title)) v.add(w);
    for (const k of p.keywords) for (const w of words(k)) v.add(w);
  }
  VOCAB = v;
  return v;
}

export function correct(q: string, passages: Passage[]) {
  const v = vocab(passages);
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      if (w.length < 4 || v.has(w) || STOP.has(w)) return w;
      const max = w.length <= 6 ? 1 : 2;
      let best = w;
      let bestD = max + 1;
      for (const c of v) {
        if (c.length < 3) continue;
        const d = lev(w, c, max);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      return best;
    })
    .join(" ");
}

function expand(qw: string[]) {
  const out = new Set<string>();
  for (const w of qw) {
    out.add(w);
    out.add(stem(w));
    for (const s of SYNONYMS[w] ?? []) out.add(s);
  }
  return [...out];
}

export function search(passages: Passage[], q: string) {
  const raw = words(q);
  if (!raw.length) return [];
  const qw = expand(raw);
  const ql = ` ${q.toLowerCase()} `;
  const scored = passages
    .map((p) => {
      let score = 0;
      for (const k of p.keywords) if (k.length > 2 && (ql.includes(` ${k} `) || qw.includes(k))) score += 4;
      const tw = new Set(words(p.title).map(stem));
      const bw = new Set(words(p.text).map(stem));
      for (const w of qw) {
        const s = stem(w);
        if (tw.has(s)) score += 3;
        if (bw.has(s)) score += 1;
      }
      return { p, score };
    })
    .filter((r) => r.score >= 4)
    .sort((a, b) => b.score - a.score);
  if (!scored.length) return [];
  const top = scored[0].score;
  return scored.filter((r) => r.score >= top * 0.6).slice(0, 3).map((r) => r.p);
}

// Three sentences at most, so answers stay short and to the point.
export function trim(t: string) {
  const parts = t.match(/[^.!?]+[.!?]+/g) ?? [t];
  return parts.slice(0, 3).join("").trim();
}

const ROUTE: Partial<Record<Passage["section"], { href: string; label: string }>> = {
  work: { href: "/", label: "the cover" },
  how: { href: "/use-cases", label: "Use cases" },
  research: { href: "/research", label: "Research" },
  buildlog: { href: "/projects", label: "Projects" },
  experience: { href: "/experience", label: "Experience" },
  education: { href: "/education", label: "Education" },
  skills: { href: "/skills", label: "Skills" },
  teaching: { href: "/experience", label: "Experience" },
  recognition: { href: "/achievements", label: "Achievements" },
  volunteer: { href: "/volunteering", label: "Volunteering" },
  contact: { href: "#contact", label: "Contact" },
};

export function routeFor(h: Passage) {
  if (h.id.startsWith("mag-")) return { href: `/use-cases/${h.id.slice(4)}`, label: "the use case" };
  if (h.id.startsWith("story-")) return { href: `/use-cases/${h.id.split("-").slice(1, -1).join("-")}`, label: "the use case" };
  if (h.id.startsWith("stack-")) return { href: "/skills", label: "Skills" };
  if (h.id === "school-life") return { href: "/education", label: "Education" };
  return ROUTE[h.section] ?? { href: "/", label: "the cover" };
}

function faqFor(q: string) {
  const exact = [...askFaqs, ...askMore].find((f) => f.q.toLowerCase() === q.trim().toLowerCase());
  if (exact) return exact;
  const ql = ` ${q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ")} `;
  return [...askFaqs, ...askMore]
    .map((f) => ({ f, n: f.keywords.filter((k) => ql.includes(` ${k} `) || ql.includes(` ${k}s `)).reduce((a, k) => a + k.split(" ").length, 0) }))
    .filter((x) => x.n > 0)
    .sort((x, y) => y.n - x.n)[0]?.f;
}

export function answerFor(q: string, passages: Passage[], faqOnly = false): Answer | null {
  const faq = faqFor(q);
  if (faq) return { text: faq.a, title: faq.q.replace("?", ""), href: faq.href, label: faq.label };
  if (faqOnly) return null;
  const hit = search(passages, q)[0];
  if (!hit) return null;
  const r = routeFor(hit);
  return { text: trim(hit.text), title: hit.title, href: r.href, label: r.label };
}

// ---------------------------------------------------------------- skills
// A question about one named tool gets the toolkit row it belongs to, in the
// words already published on the Skills page.
const LAYERS = [thinkingLayer, ...toolkitStack];
const TOOL_NAMES = [...new Set([...LAYERS.flatMap((l) => l.tools), ...skillCloud.map((w) => w.name)])].sort((a, b) => b.length - a.length);

export function skillAnswer(q: string): Answer | null {
  const ql = ` ${q.toLowerCase()} `;
  const name = TOOL_NAMES.find((t) => new RegExp(`[^a-z0-9]${t.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^a-z0-9]`).test(ql));
  if (!name) return null;
  const GROUP_LAYER: Record<string, string> = { think: "Thinking and problem solving", data: "Data engineering", ai: "AI and analysis", insight: "Insight", product: "Products", delivery: "Delivery" };
  const group = skillCloud.find((w) => w.name.toLowerCase() === name.toLowerCase())?.group;
  const layer = LAYERS.find((l) => l.tools.some((t) => t.toLowerCase() === name.toLowerCase())) ?? LAYERS.find((l) => group && l.layer === GROUP_LAYER[group]);
  const cap = site.about.skills.find((r) => r.tools.toLowerCase().includes(name.toLowerCase()));
  if (!layer && !cap) return null;
  const parts = [
    layer ? `${name} is part of Rachel's ${layer.layer.toLowerCase()} toolkit. ${layer.a}` : `${name} is part of Rachel's ${cap!.capability.toLowerCase()} work.`,
    cap ? `Where it shows up: ${cap.where.toLowerCase()}.` : layer ? `Where it shows up: ${layer.where.toLowerCase()}.` : "",
  ];
  return { text: parts.join(" ").trim(), title: name, href: "/skills", label: "Skills" };
}

// "Best skills", "top skills", "strongest": the ones she uses most, by the
// same ranking as the cloud on the Skills page.
export function topSkills(): Answer {
  const top = skillCloud.filter((w) => w.weight === 5).map((w) => w.name);
  const next = skillCloud.filter((w) => w.weight === 4).map((w) => w.name).slice(0, 4);
  const list = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}` : xs[0]);
  return {
    text: `The skills Rachel uses most are ${list(top)}. Close behind: ${list(next)}. She starts with the problem and the people, then picks the tools.`,
    title: "Top skills",
    href: "/skills",
    label: "Skills",
  };
}

// Follow-up questions that fit what was just asked.
const FOLLOW: Record<string, string[]> = {
  "/skills": ["Where has Rachel used Python?", "What are her AI competencies?", "What's her research?"],
  "/education": ["What were her A/L results?", "Was she a prefect?", "What's her research?"],
  "/experience": ["What does she do at OCTAVE?", "Tell me about Layer1 Studio", "What are her skills?"],
  "/research": ["What's PCOS Care?", "Did the research win anything?", "What are her skills?"],
  "/use-cases": ["What is production planning?", "What is the weather use case?", "What are her skills?"],
  "/projects": ["What's the Ask me agent?", "Does she take on new projects?", "What are her skills?"],
  "/achievements": ["What's her research?", "Was she a prefect?", "What's her experience?"],
  "/volunteering": ["What is Project Uplift?", "Tell me about the CSW65 talk", "What's her experience?"],
};
export function followUps(href: string | undefined, asked: Set<string>, fallback: string[]) {
  const pool = [...(href ? FOLLOW[href.split("#")[0].replace(/\/use-cases\/.+/, "/use-cases")] ?? [] : []), ...fallback];
  return [...new Set(pool)].filter((x) => !asked.has(x)).slice(0, 3);
}

// ---------------------------------------------------------------- the one entry point
export function respond(input: string, passages: Passage[]): Reply {
  const q = input.replace(/\s+/g, " ").trim().slice(0, 300);
  if (!q || !/[a-z0-9]/i.test(q)) return { kind: "empty", answer: null };
  if (GREETING.test(q)) return { kind: "smalltalk", text: REPLIES.hello, answer: null };
  if (THANKS.test(q)) return { kind: "smalltalk", text: REPLIES.thanks, answer: null };
  if (BYE.test(q)) return { kind: "smalltalk", text: REPLIES.bye, answer: null };
  if (INJECTION.test(q)) return { kind: "none", text: REPLIES.none, answer: null };
  if (OFF_TOPIC.test(q) && !/\b(rachel|cooray)\b/i.test(q)) return { kind: "none", text: REPLIES.none, answer: null };
  // "Who is Elon Musk?" is not a question about Rachel.
  if (/^(who|what) (is|was|are) /i.test(q) && /^who /i.test(q) && !ABOUT_HER.test(q)) return { kind: "none", text: REPLIES.none, answer: null };
  if (PRIVATE.test(q)) return { kind: "private", text: REPLIES.private, answer: null };
  if (CONFIDENTIAL.test(q)) return { kind: "private", text: REPLIES.confidential, answer: null };

  // A project enquiry ("can I hire her to build a website") goes to the
  // hand-off; a job enquiry goes to the recruiter path.
  const wantsProject = REQUEST.test(q) && PROJECT_WORDS.test(q);
  if (!wantsProject && RECRUITER.test(q)) return { kind: "recruiter", text: REPLIES.recruiter, answer: null };
  if (REQUEST.test(q)) {
    // A project request gets the Layer1 Studio facts first; anything else
    // goes straight to the hand-off.
    const studio = [...askMore].find((f) => f.q === "Layer1 Studio");
    const isProject = PROJECT_WORDS.test(q) || /\blayer ?1\b|\bstudio\b/i.test(q);
    const answer = isProject && studio ? { text: studio.a, title: studio.q, href: studio.href, label: studio.label } : null;
    return { kind: "handoff", text: REPLIES.handoff, answer };
  }
  if (CONTACT.test(q) && !/\b(contact centre|contact center)\b/i.test(q)) return { kind: "contact", text: REPLIES.contact, answer: null };

  if (/\bai (competenc\w*|skills|capabilit\w*|experience)\b/i.test(q)) {
    const t = aiCompetencies.map((c) => c.title.toLowerCase());
    return { kind: "answer", answer: { text: `Her AI competencies: ${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}.`, title: "AI competencies", href: "/skills", label: "Skills" } };
  }
  if (/\b(best|top|strongest|main|key|core|most used|strengths?)\b.*\bskills?\b|\bskills?\b.*\b(best|top|strongest|most)\b/i.test(q)) return { kind: "answer", answer: topSkills() };
  // "Where has she used Python?", "does she know React": the toolkit row.
  if (/\b(use|used|uses|using|know|knows|experience (with|in)|skilled|good at|work with|worked with)\b/i.test(q) || q.split(" ").length <= 3) {
    const sk = skillAnswer(q);
    if (sk) return { kind: "answer", answer: sk };
  }
  const direct = answerFor(q, passages);
  if (direct) return { kind: "answer", answer: direct };
  const fixed = correct(q, passages);
  if (fixed !== q.toLowerCase()) {
    const again = answerFor(fixed, passages);
    if (again) return { kind: "answer", answer: again };
  }
  return { kind: "none", text: REPLIES.none, answer: null };
}
