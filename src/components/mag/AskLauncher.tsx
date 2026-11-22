"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AskAgent from "@/components/mag/AskAgent";

// Floating call to action on every page except /ask. A bubble pops up after a
// moment; the button opens the agent in a panel.
export default function AskLauncher() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("rc-ask-bubble") === "1";
    } catch {}
    if (seen) return;
    const t = setTimeout(() => setBubble(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (path === "/ask") return null;

  const dismissBubble = () => {
    setBubble(false);
    try {
      sessionStorage.setItem("rc-ask-bubble", "1");
    } catch {}
  };

  return (
    <div className="ask-fab-wrap">
      {open ? (
        <div className="ask-pop ask" role="dialog" aria-label="Ask me anything">
          <div className="ask-pop-head">
            <span className="kicker">Ask me anything</span>
            <button type="button" className="ask-pop-close" aria-label="Close" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>
          <div className="ask-pop-body">
            <AskAgent />
          </div>
        </div>
      ) : null}
      {bubble && !open ? (
        <div className="ask-bubble" role="status">
          <span>Got a question about my work? Ask me.</span>
          <button type="button" aria-label="Dismiss" onClick={dismissBubble}>
            ×
          </button>
        </div>
      ) : null}
      <button
        type="button"
        className={open ? "ask-fab is-open" : "ask-fab"}
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          dismissBubble();
        }}
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
          <path d="M4 5h16v11H9l-5 4z" />
          <path d="M8.5 9.5h7M8.5 12.5h4" />
        </svg>
        <span>{open ? "Close" : "Ask me"}</span>
      </button>
    </div>
  );
}
