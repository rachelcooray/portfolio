"use client";

import { useMemo, useState } from "react";
import { PROJECT_FILTERS, projectList, type ProjectFilter } from "@/content/content";
import ProjectCard from "./ProjectCard";

export default function ProjectExplorer() {
  const [filter, setFilter] = useState<ProjectFilter | "All">("All");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return projectList.filter(
      (p) =>
        (filter === "All" || p.filters.includes(filter)) &&
        (!t || [p.title, p.summary, p.category, ...p.tools].join(" ").toLowerCase().includes(t)),
    );
  }, [filter, q]);
  return (
    <div className="explorer">
      <div className="explorer-bar">
        <div className="chip-row" role="group" aria-label="Filter projects">
          {(["All", ...PROJECT_FILTERS] as const).map((f) => (
            <button key={f} type="button" className={`chip${f === filter ? " on" : ""}`} aria-pressed={f === filter} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search projects</span>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input type="search" placeholder="Search projects or tools" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      <p className="mono muted" aria-live="polite">
        {list.length === projectList.length ? "Showing every project" : `Showing ${list.length} matching`}
      </p>
      <div className="project-list">
        {list.map((p, i) => (
          <ProjectCard key={p.slug} p={p} n={i + 1} />
        ))}
      </div>
      {list.length === 0 && (
        <div className="empty">
          <p>No projects match that yet.</p>
          <button type="button" className="btn btn-line" onClick={() => (setFilter("All"), setQ(""))}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
