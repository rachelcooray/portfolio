"use client";

import { useState, type FormEvent } from "react";
import { identity } from "@/content/content";

const REASONS = ["Professional opportunity", "Research collaboration", "Project or product idea", "Speaking or guest lecture", "Just saying hello"];

// The site is static, so the form composes an email in the visitor's own
// mail app. Nothing is stored or sent anywhere else.
export default function ContactForm() {
  const [state, setState] = useState<"idle" | "error" | "sent">("idle");
  const [error, setError] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const reason = String(f.get("reason") || "");
    const message = String(f.get("message") || "").trim();
    if (!name || !email || !reason || !message) {
      setError("Please fill in every field.");
      setState("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email address doesn't look right.");
      setState("error");
      return;
    }
    const subject = encodeURIComponent(`${reason}: from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${identity.email}?subject=${subject}&body=${body}`;
    setState("sent");
  };
  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="cf-name">Name</label>
        <input id="cf-name" name="name" autoComplete="name" placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" autoComplete="email" placeholder="Your email address" />
      </div>
      <div className="field">
        <label htmlFor="cf-reason">Reason for reaching out</label>
        <select id="cf-reason" name="reason" defaultValue="">
          <option value="" disabled>
            Select an enquiry type
          </option>
          {REASONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name="message" rows={5} placeholder="Tell me a little about your idea..." />
      </div>
      <button type="submit" className="btn">
        Send message
      </button>
      <div aria-live="polite" className="form-state">
        {state === "error" && <p className="form-error">{error}</p>}
        {state === "sent" && <p className="form-success">Your email app should now open with the message ready to send.</p>}
      </div>
    </form>
  );
}
