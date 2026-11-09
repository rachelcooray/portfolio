"use client";

import { useState } from "react";
import { disciplineMap } from "@/content/content";

// Five disciplines on a ring, every one connected to every other.
// Selecting one lights its connections and explains its role.
const POS = [
  [50, 10],
  [90, 40],
  [75, 88],
  [25, 88],
  [10, 40],
];

export default function MultidisciplinaryMap() {
  const [sel, setSel] = useState(0);
  const d = disciplineMap[sel];
  return (
    <div className="dmap">
      <div className="dmap-canvas">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {POS.flatMap(([x1, y1], i) =>
            POS.slice(i + 1).map(([x2, y2], j) => {
              const k = i + 1 + j;
              const on = i === sel || k === sel;
              return <line key={`${i}-${k}`} x1={x1} y1={y1} x2={x2} y2={y2} className={on ? "on" : ""} vectorEffect="non-scaling-stroke" />;
            }),
          )}
        </svg>
        {disciplineMap.map((n, i) => (
          <button
            key={n.id}
            type="button"
            className={`dmap-node${i === sel ? " on" : ""}`}
            style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%` }}
            aria-pressed={i === sel}
            onClick={() => setSel(i)}
          >
            {n.label}
          </button>
        ))}
      </div>
      <div className="dmap-detail" aria-live="polite">
        <p className="mono">Selected · {d.label}</p>
        <p className="dmap-line">{d.line}</p>
        <p className="muted">
          <span className="mono">Where it shows</span>
          <br />
          {d.evidence}
        </p>
      </div>
    </div>
  );
}
