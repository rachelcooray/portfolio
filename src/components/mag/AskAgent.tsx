"use client";

import { useMemo, useState, type FormEvent } from "react";
import { buildMagazinePassages, identity, type Passage } from "@/content/content";

// Answers only by quoting passages from content.ts. It never writes new
// text, so it can never say something Rachel has not published.

const STOP = new Set("a an and are as at be but by can did do does for from has have her how i in is it its me my of on or she so that the their them they this to was what when where which who why will with you your about tell".split(" "));

const SUGGESTED = [
  "What does she own at OCTAVE?",
  "What is PCOS Care?",
  "Where did she study?",
  "How does she measure impact?",
  "How can I reach her?",
];

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

function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function search(passages: Passage[], q: string) {
  const qw = words(q);
  const ql = q.toLowerCase();
  if (!qw.length) return [];
  return passages
    .map((p) => {
      let score = 0;
      for (const k of p.keywords) if (ql.includes(k)) score += 4;
      const tw = new Set(words(p.title));
      const bw = new Set(words(p.text));
      for (const w of qw) {
        if (tw.has(w)) score += 3;
        if (bw.has(w)) score += 1;
      }
      return { p, score };
    })
    .filter((r) => r.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((r) => r.p);
}

export default function AskAgent() {
  const passages = useMemo(() => buildMagazinePassages(), []);
  const [asked, setAsked] = useState(SUGGESTED[0]);
  const [draft, setDraft] = useState("");
  const hits = useMemo(() => search(passages, asked), [passages, asked]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setAsked(t);
    setDraft("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
      <div className="ask-chips" role="group" aria-label="Suggested questions">
        {SUGGESTED.map((q) => (
          <button key={q} type="button" className="chip" aria-pressed={asked === q} onClick={() => setAsked(q)}>
            {q}
          </button>
        ))}
      </div>
      <div className="ask-panel" aria-live="polite">
        <div className="ask-q">{asked}</div>
        <div className="ask-a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
          <div className="ask-answers">
            {hits.length ? (
              hits.map((h) => {
                const r = h.id.startsWith("mag-") ? { href: `/use-cases#${h.id.slice(4)}`, label: "Use cases" } : (ROUTE[h.section] ?? { href: "/", label: "the cover" });
                return (
                  <div key={h.id} className="ask-hit">
                    <blockquote>{h.text}</blockquote>
                    <div className="ask-src">
                      <span>Source · {h.title}</span>
                      <a href={r.href}>Open {r.label}</a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="ask-hit">
                <blockquote>
                  That isn&apos;t in my published work yet. Email me at <a href={`mailto:${identity.email}`}>{identity.email}</a> and I&apos;ll answer myself.
                </blockquote>
                <div className="ask-src">
                  <span>No matching page</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <form className="ask-form" onSubmit={submit}>
        <label>
          Your question
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Try: what is the weather use case?" />
        </label>
        <button type="submit">Ask</button>
      </form>
    </div>
  );
}
