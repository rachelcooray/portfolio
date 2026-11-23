"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { askFaqs, askMore, buildMagazinePassages, identity, type Passage } from "@/content/content";
import { EMAIL_RE, sendToRachel } from "@/lib/send";

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

type Turn = { id: number; q: string; answer: Answer | null; follow: string[]; handoff?: boolean; recruiter?: boolean };

// Recruiters: never answer salary, notice, visa or start date. Point them to
// Rachel with every way to reach her.
const RECRUITER =
  /\b(recruit\w*|hiring|hire|vacanc\w*|opening|position|interview\w*|salary|compensation|notice period|start date|visa|relocat\w*|sponsor\w*|candidate|headhunt\w*|talent|job offer|open to (work|roles|opportunities)|looking for (a )?(job|role|work))\b/i;

const LINKEDIN = identity.links.find((l) => l.label === "LinkedIn")?.href ?? "";
const RECRUITER_TEXT =
  "Thank you for your interest. The best next step is to speak to Rachel directly. She is an Analyst, Data and AI at OCTAVE, John Keells Holdings, with a First Class BSc in Computer Science and research published at IEEE ICAHS 2025.";

function Details() {
  return (
    <ul className="agent-details" aria-label="Rachel's contact details">
      <li>
        <span>Email</span> <a href={`mailto:${identity.email}`}>{identity.email}</a>
      </li>
      <li>
        <span>Phone</span> <a href={`tel:${identity.phone.replace(/\s/g, "")}`}>{identity.phone}</a>
      </li>
      {LINKEDIN ? (
        <li>
          <span>LinkedIn</span> <a href={LINKEDIN}>Rachel Cooray</a>
        </li>
      ) : null}
      <li>
        <span>CV</span> <a href="/rachelcooray-cv.pdf">Download the CV (PDF)</a>
      </li>
      <li>
        <span>Based in</span> {identity.location}
      </li>
    </ul>
  );
}

// Requests only Rachel can answer: work, quotes, hiring, collaboration. The
// agent never promises anything; it offers to pass the request on.
const REQUEST =
  /\b(can|could|would|will) (she|you|rachel)\b.*\b(make|build|design|create|develop|help|do|work|quote|speak|talk|mentor|join)\b|\bfor (me|us|my|our)\b|\b(hire|hiring|quote|pricing|price|cost|rates?|freelance|commission|collaborat\w*|partner\w*|availab\w*|job offer|opportunit\w*|get in touch|contact (her|rachel)|reach (her|rachel)|book (her|rachel)|meet (her|rachel)|call with)\b/i;

const HANDOFF_TEXT = "That one is for Rachel herself. Leave your email and what you need, and I'll pass it straight to her.";

// A short form inside the chat. What is typed here is sent to Rachel through
// the form service and is not kept by this site.
function Handoff({ request, topic = "Request from the Ask agent", hint = "" }: { request: string; topic?: string; hint?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");
  const opened = useRef(0);
  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const body = String(f.get("request") || "").trim();
    if (!EMAIL_RE.test(email)) {
      setState("error");
      setMsg("Error: please enter a full email address.");
      return;
    }
    if (!body) {
      setState("error");
      setMsg("Error: please say what you need.");
      return;
    }
    // Bots: a filled honeypot or an instant submit.
    if (String(f.get("company") || "") || Date.now() - opened.current < 3000) {
      setState("sent");
      setMsg("Sent. Rachel will reply by email.");
      return;
    }
    setState("sending");
    setMsg("");
    try {
      await sendToRachel({ name: email, email, topic, message: body });
      setState("sent");
      setMsg("Sent. Rachel will reply by email.");
    } catch {
      setState("error");
      setMsg(`Error: the message did not send. You can email Rachel at ${identity.email}.`);
    }
  };

  if (state === "sent") return <p className="handoff-done" role="status">{msg}</p>;
  return (
    <form className="handoff" onSubmit={onSubmit} noValidate>
      <label>
        Your email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        What you need
        <textarea name="request" rows={3} defaultValue={request} placeholder={hint} maxLength={2000} required />
      </label>
      <div className="cform-trap" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="handoff-row">
        <button type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send to Rachel"}
        </button>
        <p className={state === "error" ? "handoff-msg is-error" : "handoff-msg"} role="status" aria-live="polite">
          {msg}
        </p>
      </div>
    </form>
  );
}

const STORE = "rc-ask-thread";

function loadThread(): Turn[] {
  try {
    const raw = sessionStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Turn[]) : [];
  } catch {
    return [];
  }
}

export default function AskAgent() {
  const passages = useMemo(() => buildMagazinePassages(), []);
  const [thread, setThread] = useState<Turn[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [openForm, setOpenForm] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  // Restore this visit's conversation after the first paint, so the static
  // page and the browser agree on the first render.
  useEffect(() => {
    const saved = loadThread();
    const id = window.setTimeout(() => {
      if (saved.length) setThread(saved);
      loaded.current = true;
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(STORE, JSON.stringify(thread.slice(-20)));
    } catch {}
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [thread, typing]);

  const answerFor = (q: string): Answer | null => {
    const ql = ` ${q.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
    const exact = askFaqs.find((f) => f.q === q);
    const faq =
      exact ??
      [...askFaqs, ...askMore]
        .map((f) => ({ f, n: f.keywords.filter((k) => ql.includes(` ${k} `) || ql.includes(` ${k}s `)).length }))
        .filter((x) => x.n > 0)
        .sort((x, y) => y.n - x.n)[0]?.f;
    if (faq) return { text: faq.a, title: faq.q.replace("?", ""), href: faq.href, label: faq.label };
    const hit = search(passages, q)[0];
    if (!hit) return null;
    const r = routeFor(hit);
    return { text: trim(hit.text), title: hit.title, href: r.href, label: r.label };
  };

  const ask = (q: string) => {
    if (typing) return;
    const recruiter = RECRUITER.test(q);
    const handoff = !recruiter && REQUEST.test(q);
    const answer = recruiter || handoff ? null : answerFor(q);
    const askedQs = new Set([...thread.map((t) => t.q), q]);
    const follow = askFaqs.map((f) => f.q).filter((x) => !askedQs.has(x)).slice(0, 3);
    setTyping(true);
    const delay = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
    window.setTimeout(() => {
      setThread((t) => [...t, { id: Date.now(), q, answer, follow, handoff, recruiter }]);
      setTyping(false);
    }, delay);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    ask(t);
    setDraft("");
  };

  return (
    <div className="agent">
      <p className="agent-note">Automated assistant. It answers only from Rachel&apos;s published work, and nothing you type is stored. A message reaches Rachel only if you choose to send one.</p>
      <div className="ask-chips" role="group" aria-label="Quick questions">
        <button type="button" className="chip chip-hire" onClick={() => ask("I'm a recruiter")} disabled={typing}>
          Hiring? Speak to Rachel
        </button>
        {askFaqs.map((f) => (
          <button key={f.q} type="button" className="chip" onClick={() => ask(f.q)} disabled={typing}>
            {f.q}
          </button>
        ))}
      </div>
      <div className="ask-panel agent-thread" role="log" aria-live="polite" aria-label="Conversation">
        <div className="ask-a ask-hello">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
          <p>Hi, I&apos;m Rachel&apos;s agent. Tap a question, or ask your own.</p>
        </div>
        {thread.map((t) => (
          <div key={t.id} className="agent-turn">
            <div className="ask-q">{t.q}</div>
            <div className="ask-a">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
              <div className="ask-answers">
                <div className="ask-hit">
                  {t.recruiter ? (
                    <>
                      <blockquote>{RECRUITER_TEXT}</blockquote>
                      <Details />
                      <p className="agent-or">Or leave your details and the role, and she will get back to you.</p>
                      <Handoff request="" topic="Recruiter enquiry" hint="Your name, company and the role" />
                    </>
                  ) : t.handoff ? (
                    <>
                      <blockquote>{HANDOFF_TEXT}</blockquote>
                      <Handoff request={t.q} />
                    </>
                  ) : t.answer ? (
                    <>
                      <blockquote>{t.answer.text}</blockquote>
                      <div className="ask-src">
                        <a href={t.answer.href}>More on {t.answer.label} →</a>
                      </div>
                    </>
                  ) : (
                    <>
                      <blockquote>I only cover Rachel and her work, and I couldn&apos;t find that. Try one of these, or leave Rachel a message.</blockquote>
                      {openForm === t.id ? (
                        <Handoff request={t.q} />
                      ) : (
                        <button type="button" className="agent-follow-btn handoff-open" onClick={() => setOpenForm(t.id)}>
                          Leave Rachel a message
                        </button>
                      )}
                    </>
                  )}
                </div>
                {t.follow.length ? (
                  <div className="agent-follow" role="group" aria-label="Suggested next questions">
                    {t.follow.map((f) => (
                      <button key={f} type="button" className="agent-follow-btn" onClick={() => ask(f)} disabled={typing}>
                        {f}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        {typing ? (
          <div className="ask-a">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
            <span className="agent-typing" aria-label="Typing">
              <i />
              <i />
              <i />
            </span>
          </div>
        ) : null}
        <div ref={endRef} />
      </div>
      <form className="ask-form" onSubmit={submit}>
        <label>
          Your question
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask anything about Rachel" maxLength={200} autoComplete="off" />
        </label>
        <button type="submit" disabled={typing}>
          Ask
        </button>
      </form>
      <div className="agent-actions">
        <a className="agent-human" href={`mailto:${identity.email}?subject=${encodeURIComponent("Hello from your portfolio")}`}>
          Contact Rachel
        </a>
        {thread.length ? (
          <button type="button" className="agent-clear" onClick={() => setThread([])}>
            Clear chat
          </button>
        ) : null}
      </div>
    </div>
  );
}
