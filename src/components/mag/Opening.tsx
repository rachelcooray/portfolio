"use client";

import { useEffect } from "react";

// The magazine opening: a closed issue appears, its cover swings open onto the
// contents page, and the site comes into view. Plays once per visit, only on
// the cover, never with reduced motion (the head script in layout.tsx decides).
const LINES = [
  ["From the factory production line to the outlet shelves", "04"],
  ["PCOS Care", "12"],
  ["Projects", "14"],
  ["Experience", "16"],
  ["Education", "20"],
  ["In pictures", "30"],
];

export default function Opening() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;
    const done = () => {
      html.classList.remove("intro");
      try {
        sessionStorage.setItem("rc-opened", "1");
      } catch {}
    };
    const t = window.setTimeout(done, 3900);
    const skip = () => {
      window.clearTimeout(t);
      done();
    };
    window.addEventListener("keydown", skip, { once: true });
    const btn = document.getElementById("opening-skip");
    btn?.addEventListener("click", skip);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", skip);
      btn?.removeEventListener("click", skip);
    };
  }, []);

  return (
    <div className="opening" aria-hidden="true">
      <div className="book">
        <div className="book-inside">
          <span className="book-kicker">In this issue</span>
          {LINES.map(([t, n]) => (
            <span key={t} className="book-line">
              <span>{t}</span>
              <span className="book-dots" />
              <span>{n}</span>
            </span>
          ))}
        </div>
        <div className="book-cover">
          <span className="book-mast">Rachel Cooray</span>
          <span className="book-issue">Issue 01 · November 2026</span>
          <span className="book-story">From the factory production line to the outlet shelves.</span>
        </div>
      </div>
      <button id="opening-skip" type="button" className="opening-skip" tabIndex={-1}>
        Skip
      </button>
    </div>
  );
}
