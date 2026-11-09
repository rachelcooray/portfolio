"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/content";
import type { TerrainHandle } from "./terrain";

// The four areas of the "snapshot of my world", as four hills in one
// landscape. 3D in "gl" mode; a flat contour drawing everywhere else.
const SVG_REGIONS = [
  { cx: 230, cy: 330, R: 150, L: 10, seed: 1.3 },
  { cx: 460, cy: 300, R: 175, L: 13, seed: 2.6 },
  { cx: 300, cy: 470, R: 120, L: 8, seed: 4.1 },
  { cx: 540, cy: 480, R: 110, L: 7, seed: 5.4 },
];

function ring(cx: number, cy: number, rad: number, seed: number) {
  let d = "";
  for (let k = 0; k <= 48; k++) {
    const t = (k / 48) * Math.PI * 2;
    const rr = rad * (1 + 0.16 * Math.sin(3 * t + seed) + 0.08 * Math.cos(5 * t + seed * 2.1) + 0.05 * Math.sin(7 * t + seed * 0.7));
    d += (k === 0 ? "M" : "L") + (cx + rr * Math.cos(t)).toFixed(1) + " " + (cy + rr * Math.sin(t) * 0.5).toFixed(1);
  }
  return d + "Z";
}

function Flat({ selected, onPick }: { selected: number; onPick: (i: number) => void }) {
  const order = [0, 1, 2, 3].sort((a, b) => SVG_REGIONS[a].cy - SVG_REGIONS[b].cy);
  return (
    <svg className="terrain-svg" viewBox="0 0 720 600" aria-hidden="true">
      {order.map((ri) => {
        const g = SVG_REGIONS[ri];
        const on = ri === selected;
        return (
          <g key={ri} onClick={() => onPick(ri)}>
            {Array.from({ length: g.L }, (_, l) => {
              const f = l / g.L;
              return (
                <path
                  key={l}
                  d={ring(g.cx, g.cy - l * 10, g.R * (1 - f * 0.92), g.seed + l * 0.18)}
                  fill="#1E4C8E"
                  fillOpacity={0.94}
                  stroke={on ? "#C7D42B" : "#BED7F4"}
                  strokeOpacity={on ? 0.5 + f * 0.5 : 0.22 + f * 0.45}
                  strokeWidth={l === g.L - 1 ? 1.6 : 1}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function HeroTerrain() {
  const areas = site.world;
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [gl, setGl] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const handle = useRef<TerrainHandle | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("gl") || !host.current) return;
    let cancelled = false;
    import("./terrain").then(({ mountTerrain }) => {
      if (cancelled || !host.current) return;
      try {
        handle.current = mountTerrain(host.current, {
          initial: 0,
          reduced: root.classList.contains("rm"),
          onHover: setHovered,
          onPick: setSelected,
          onReady: () => setGl(true),
        });
      } catch {
        setGl(false);
      }
    });
    return () => {
      cancelled = true;
      handle.current?.destroy();
      handle.current = null;
    };
  }, []);

  useEffect(() => handle.current?.select(selected), [selected]);

  const a = areas[hovered ?? selected];

  return (
    <figure className="terrain">
      <div className={`terrain-frame${gl ? " is-gl" : ""}`}>
        <Flat selected={selected} onPick={setSelected} />
        <div ref={host} className="terrain-gl" />
        <div className="terrain-panel" aria-live="polite">
          <p className="mono">{String((hovered ?? selected) + 1).padStart(2, "0")} · My world</p>
          <p className="terrain-title">{a.title}</p>
          <p>{a.line}</p>
          <Link href={a.href}>Explore →</Link>
        </div>
      </div>
      <div className="chip-row" role="group" aria-label="Four areas of my work">
        {areas.map((x, i) => (
          <button key={x.title} type="button" className={`chip${i === selected ? " on" : ""}`} aria-pressed={i === selected} onClick={() => setSelected(i)}>
            {x.title}
          </button>
        ))}
      </div>
    </figure>
  );
}
