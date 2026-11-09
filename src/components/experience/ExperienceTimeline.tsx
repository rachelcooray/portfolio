"use client";

import Image from "next/image";
import { useState } from "react";
import { experienceEntries, type ExperienceCategory } from "@/content/content";
import { TagList } from "@/components/ui/Badge";

const FILTERS: ("All" | ExperienceCategory)[] = ["All", "Technology", "Entrepreneurship", "Education & Support", "Customer Experience"];

// ExperienceCard, reused for every role after OCTAVE, with category filters.
export default function ExperienceTimeline() {
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  const shown = experienceEntries.filter((e) => f === "All" || e.category === f);
  return (
    <div className="xp">
      <div className="chip-row" role="group" aria-label="Filter experience">
        {FILTERS.map((x) => (
          <button key={x} type="button" className={`chip${x === f ? " on" : ""}`} aria-pressed={x === f} onClick={() => setF(x)}>
            {x}
          </button>
        ))}
      </div>
      <ol className="xp-list">
        {shown.map((e) => (
          <li key={e.id} className="xp-card">
            <div className="xp-logo" aria-hidden="true">
              {e.logo ? <Image src={e.logo} width={56} height={56} alt="" /> : <span>{e.org.charAt(0)}</span>}
            </div>
            <div className="xp-body">
              <div className="xp-meta">
                <span className="mono">{e.dateRange}</span>
                <span className="badge badge-category">{e.category}</span>
              </div>
              <h3>{e.title}</h3>
              <p className="muted">
                {e.org} · {e.location}
              </p>
              <ul className="bullets">
                <li>{e.summary}</li>
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <TagList items={e.tags} label="Areas of work" />
            </div>
          </li>
        ))}
      </ol>
      {shown.length === 0 && <p className="muted">Nothing in this category yet.</p>}
    </div>
  );
}
