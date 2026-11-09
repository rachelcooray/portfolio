"use client";

import Image from "next/image";
import { useState } from "react";
import { press } from "@/content/content";

// PressGrid with a PublicationFilter, newest first.
export default function MediaArchive() {
  const pubs = ["All", ...Array.from(new Set(press.map((p) => p.organization)))];
  const [f, setF] = useState("All");
  const items = press.filter((p) => f === "All" || p.organization === f).sort((a, b) => Number(b.year) - Number(a.year));
  return (
    <>
      <div className="chip-row mb" role="group" aria-label="Filter by publication">
        {pubs.map((p) => (
          <button key={p} type="button" className={`chip${p === f ? " on" : ""}`} aria-pressed={p === f} onClick={() => setF(p)}>
            {p}
          </button>
        ))}
      </div>
      <div className="news">
        {items.map((n) => (
          <article key={n.id} className="news-card">
            <div className="news-thumb">
              {n.image ? (
                <Image src={n.image} width={480} height={300} alt={n.imageAlt ?? ""} />
              ) : (
                <div className="pub-card" aria-hidden="true">
                  {n.organization}
                </div>
              )}
            </div>
            <p className="mono">
              {n.organization} · {n.year}
            </p>
            <h2>{n.title}</h2>
            <ul className="bullets">
              <li>
                <strong>Published by:</strong> {n.organization}
              </li>
              <li>
                <strong>Year:</strong> {n.year}
              </li>
              {n.summary && <li>{n.summary}</li>}
            </ul>
            {n.link ? (
              <a className="text-link" href={n.link} target="_blank" rel="noopener noreferrer">
                Read article ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <p className="muted small">Link to the exact post to be added.</p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
