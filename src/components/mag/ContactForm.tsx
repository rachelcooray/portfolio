"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { EMAIL_RE, sendToRachel } from "@/lib/send";

const TOPICS = ["Professional opportunity", "Research collaboration", "A project or idea", "Speaking or guest lecture", "Just saying hello"];
const MIN_MS = 3000;

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const opened = useRef(0);

  // When the page became interactive; bots tend to submit within seconds.
  useEffect(() => {
    opened.current = Date.now();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const topic = String(f.get("topic") || "");
    const body = String(f.get("message") || "").trim();

    if (!name || !email || !topic || !body) {
      setState("error");
      setMessage("Error: please fill in every field.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setState("error");
      setMessage("Error: that email address doesn't look right.");
      return;
    }
    // Bots: a filled honeypot, or a submit within seconds of arriving.
    if (String(f.get("company") || "") || !opened.current || Date.now() - opened.current < MIN_MS) {
      setState("sent");
      setMessage("Sent. Thank you for your message.");
      form.reset();
      return;
    }

    setState("sending");
    setMessage("");
    try {
      await sendToRachel({ name, email, topic, message: body });
      setState("sent");
      setMessage("Sent. Thank you for your message.");
      form.reset();
    } catch {
      setState("error");
      setMessage("Error: the message did not send. You can email me directly at the address below.");
    }
  };

  return (
    <form className="cform" onSubmit={onSubmit} noValidate aria-describedby="cform-status">
      <div className="cform-row">
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        What would you like to talk about
        <select name="topic" defaultValue="" required>
          <option value="" disabled>
            Choose one
          </option>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={4} required />
      </label>
      {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
      <div className="cform-trap" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="cform-actions">
        <button type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
        <p id="cform-status" className={state === "error" ? "cform-msg is-error" : state === "sent" ? "cform-msg is-sent" : "cform-msg"} role="status" aria-live="polite">
          {message}
        </p>
      </div>
      <p className="cform-fallback">
        Prefer email? Write to <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
      </p>
    </form>
  );
}
