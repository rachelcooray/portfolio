"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { askFaqs, buildMagazinePassages, identity } from "@/content/content";
import { REPLIES, respond, type Answer, type Kind } from "@/lib/agent";
import { EMAIL_RE, sendToRachel } from "@/lib/send";

// The answering logic lives in src/lib/agent.ts and is tested by
// scripts/test-agent.ts. This file is the conversation UI.

type Turn = { id: number; q: string; answer: Answer | null; follow: string[]; kind?: Kind; text?: string; handoff?: boolean; recruiter?: boolean };

const LINKEDIN = identity.links.find((l) => l.label === "LinkedIn")?.href ?? "";

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

  const ask = (input: string) => {
    if (typing) return;
    const q = input.replace(/\s+/g, " ").trim().slice(0, 200);
    const r = respond(q, passages);
    if (r.kind === "empty") return;
    const askedQs = new Set([...thread.map((t) => t.q), q]);
    const follow = askFaqs.map((f) => f.q).filter((x) => !askedQs.has(x)).slice(0, 3);
    setTyping(true);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450;
    window.setTimeout(() => {
      setThread((t) => [...t, { id: Date.now() + Math.random(), q, answer: r.answer, follow, kind: r.kind, text: r.text }]);
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
      <p className="agent-note">Automated assistant. It answers only from Rachel&apos;s published work. Nothing you type leaves your browser unless you choose to send it to Rachel.</p>
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
          <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
          <p>Hi, I&apos;m Rachel&apos;s agent. Tap a question, or ask your own.</p>
        </div>
        {thread.map((t) => {
          const kind: Kind = t.kind ?? (t.recruiter ? "recruiter" : t.handoff ? "handoff" : t.answer ? "answer" : "none");
          return (
          <div key={t.id} className="agent-turn">
            <div className="ask-q">{t.q}</div>
            <div className="ask-a">
              <img className="ask-av" src="/images/mag/rachel-face.webp" alt="" width={36} height={36} />
              <div className="ask-answers">
                <div className="ask-hit">
                  {kind === "recruiter" ? (
                    <>
                      <blockquote>{REPLIES.recruiter}</blockquote>
                      <Details />
                      <p className="agent-or">Or leave your details and the role, and she will get back to you.</p>
                      <Handoff request="" topic="Recruiter enquiry" hint="Your name, company and the role" />
                    </>
                  ) : kind === "handoff" ? (
                    <>
                      {t.answer ? <blockquote>{t.answer.text}</blockquote> : null}
                      <blockquote>{REPLIES.handoff}</blockquote>
                      <Handoff request={t.q} />
                    </>
                  ) : kind === "contact" ? (
                    <>
                      <blockquote>{REPLIES.contact}</blockquote>
                      <Details />
                    </>
                  ) : kind === "smalltalk" || kind === "private" ? (
                    <blockquote>{t.text}</blockquote>
                  ) : t.answer ? (
                    <>
                      <blockquote>{t.answer.text}</blockquote>
                      <div className="ask-src">
                        <a href={t.answer.href}>More on {t.answer.label}</a>
                      </div>
                    </>
                  ) : (
                    <>
                      <blockquote>{REPLIES.none}</blockquote>
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
          );
        })}
        {typing ? (
          <div className="ask-a">
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
