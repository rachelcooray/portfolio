"use client";

import { useMemo, useState, type FormEvent } from "react";
import { askFaqs, askMore, buildMagazinePassages, identity, type Passage } from "@/content/content";

// Answers only by quoting passages from content.ts. It never writes new
// text, so it can never say something Rachel has not published, and it
// only knows about Rachel.

const STOP = new Set(
  "a an and are as at be but by can could did do does for from has have her hers how i in is it its me my of on or she so that the their them they this to was what whats when where which who why will with you your about tell would like please give some any much".split(" "),
);

// Loose words people type, mapped to the words the content uses.
const SYNONYMS: Record<string, string[]> = {
  edu: ["education", "degree", "university", "study"],
  education: ["degree", "university", "study", "school"],
  study: ["education", "degree", "university"],
  studied: ["education", "degree", "university"],
  uni: ["university", "degree", "westminster"],
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
  skills: ["tools", "stack"],
  tech: ["tools", "stack", "skills"],
  stack: ["tools", "skills"],
  contact: ["email", "phone"],
  email: ["contact"],
  phone: ["contact", "number"],
  hire: ["contact", "email"],
  awards: ["award", "prize", "achievement"],
  prizes: ["award", "prize"],
  volunteering: ["volunteer", "event"],
  school: ["prefect", "convent"],
  swimming: ["swim", "gold"],
};

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

const stem = (w: string) => w.replace(/(ing|ies|es|s)$/, "");

function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
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

function search(passages: Passage[], q: string) {
  const raw = words(q);
  if (!raw.length) return [];
  const qw = expand(raw);
  const ql = ` ${q.toLowerCase()} `;
  const scored = passages
    .map((p) => {
      let score = 0;
      for (const k of p.keywords) if (k.length > 2 && (ql.includes(k) || qw.includes(k))) score += 4;
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

type Answer = { text: string; title: string; href: string; label: string };

// Three sentences at most, so answers stay short and to the point.
function trim(t: string) {
  const parts = t.match(/[^.!?]+[.!?]+/g) ?? [t];
  return parts.slice(0, 3).join("").trim();
}

function routeFor(h: Passage) {
  if (h.id.startsWith("mag-")) return { href: `/use-cases/${h.id.slice(4)}`, label: "the use case" };
  if (h.id.startsWith("story-")) return { href: `/use-cases/${h.id.split("-").slice(1, -1).join("-")}`, label: "the use case" };
  if (h.id.startsWith("stack-")) return { href: "/skills", label: "Skills" };
  if (h.id === "school-life") return { href: "/education", label: "Education" };
  return ROUTE[h.section] ?? { href: "/", label: "the cover" };
}

export default function AskAgent() {
  const passages = useMemo(() => buildMagazinePassages(), []);
  const [asked, setAsked] = useState<{ q: string; answer: Answer | null } | null>(null);
  const [draft, setDraft] = useState("");

  const ask = (q: string) => {
    const ql = ` ${q.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
    const exact = askFaqs.find((f) => f.q === q);
    const faq =
      exact ??
      [...askFaqs, ...askMore]
        .map((f) => ({ f, n: f.keywords.filter((k) => ql.includes(` ${k} `) || ql.includes(` ${k}s `)).length }))
        .filter((x) => x.n > 0)
        .sort((x, y) => y.n - x.n)[0]?.f;
    if (faq) {
      setAsked({ q, answer: { text: faq.a, title: faq.q.replace("?", ""), href: faq.href, label: faq.label } });
      return;
    }
    const hit = search(passages, q)[0];
    if (!hit) {
      setAsked({ q, answer: null });
      return;
    }
    const r = routeFor(hit);
    setAsked({ q, answer: { text: trim(hit.text), title: hit.title, href: r.href, label: r.label } });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    ask(t);
    setDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
      <div className="ask-chips" role="group" aria-label="Quick questions">
        {askFaqs.map((f) => (
          <button key={f.q} type="button" className="chip" aria-pressed={asked?.q === f.q} onClick={() => ask(f.q)}>
            {f.q}
          </button>
        ))}
      </div>
      <div className="ask-panel" aria-live="polite">
        {asked ? (
          <>
            <div className="ask-q">{asked.q}</div>
            <div className="ask-a">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
              <div className="ask-answers">
                {asked.answer ? (
                  <div className="ask-hit">
                    <blockquote>{asked.answer.text}</blockquote>
                    <div className="ask-src">
                      <a href={asked.answer.href}>More on {asked.answer.label} →</a>
                    </div>
                  </div>
                ) : (
                  <div className="ask-hit">
                    <blockquote>
                      I only cover Rachel and her work. For anything else, email <a href={`mailto:${identity.email}`}>{identity.email}</a>.
                    </blockquote>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="ask-a ask-hello">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
            <p>Hi, I&apos;m Rachel&apos;s agent. Tap a question, or ask your own.</p>
          </div>
        )}
      </div>
      <form className="ask-form" onSubmit={submit}>
        <label>
          Your question
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask anything about Rachel" />
        </label>
        <button type="submit">Ask</button>
      </form>
    </div>
  );
}
