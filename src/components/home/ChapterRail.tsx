"use client";

import { useEffect, useState } from "react";

// The homepage is read chapter by chapter. This rail shows where you are,
// how far through you are, and lets you jump to any chapter.
export default function ChapterRail({ chapters }: { chapters: { id: string; label: string }[] }) {
  const [active, setActive] = useState(chapters[0]?.id);
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters]);
  const idx = Math.max(0, chapters.findIndex((c) => c.id === active));
  return (
    <nav className="chapter-rail" aria-label="Chapters on this page">
      <p className="mono rail-count">
        {String(idx + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
      </p>
      <ol>
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} aria-current={c.id === active ? "true" : undefined} className={i <= idx ? "passed" : ""}>
              <span className="dot" aria-hidden="true" />
              <span className="rail-label">{c.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
