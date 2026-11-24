"use client";

import { useEffect, useRef } from "react";
import { magazine } from "@/content/content";

// The magazine opening: a closed issue waits on the reader. "Open the
// magazine" (or a tap on the cover) swings the cover open onto the contents
// and the site comes into view. Shown once per visit on the cover page (the
// head script in layout.tsx decides), and again whenever someone asks for it.
const LINES = [
  ["From the factory production line to the outlet shelves", "04"],
  ["PCOS Care", "12"],
  ["Projects", "14"],
  ["Experience", "16"],
  ["Education", "20"],
  ["In pictures", "30"],
];

export const OPEN_EVENT = "rc-open-magazine";

export default function Opening() {
  const openBtn = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const html = document.documentElement;
    const focusOpen = (ms: number) => window.setTimeout(() => openBtn.current?.focus({ preventScroll: true }), ms);
    const show = () => {
      html.classList.remove("intro-open");
      html.classList.add("intro");
      window.scrollTo({ top: 0 });
      focusOpen(60);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && html.classList.contains("intro")) finish();
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    if (html.classList.contains("intro")) focusOpen(900);
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer.current);
    };
  }, []);

  function finish() {
    const html = document.documentElement;
    window.clearTimeout(timer.current);
    html.classList.remove("intro", "intro-open");
    try {
      sessionStorage.setItem("rc-opened", "1");
    } catch {}
  }

  function openMagazine() {
    const html = document.documentElement;
    if (html.classList.contains("intro-open")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    html.classList.add("intro-open");
    timer.current = window.setTimeout(finish, 2700);
  }

  return (
    <div className="opening" role="dialog" aria-label="The magazine cover">
      <button type="button" className="book" onClick={openMagazine} tabIndex={-1} aria-hidden="true">
        <span className="book-inside">
          <span className="book-kicker">In this issue</span>
          {LINES.map(([t, n]) => (
            <span key={t} className="book-line">
              <span>{t}</span>
              <span className="book-dots" />
              <span>{n}</span>
            </span>
          ))}
        </span>
        <span className="book-cover">
          <span className="book-mast">Rachel Cooray</span>
          <span className="book-issue">Issue 01 · November 2026</span>
          <span className="book-story">{magazine.cover.story.title}</span>
        </span>
      </button>
      <div className="opening-actions">
        <button ref={openBtn} type="button" className="opening-open" onClick={openMagazine}>
          Open the magazine <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="opening-skip" onClick={finish}>
          Skip to the site
        </button>
      </div>
    </div>
  );
}

// A button on the cover page that brings the closed issue back.
export function OpenAgain() {
  return (
    <button type="button" className="open-again" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Open the magazine again
    </button>
  );
}
