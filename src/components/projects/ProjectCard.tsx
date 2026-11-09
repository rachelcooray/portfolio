import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/content";

// One project as a row: picture, the key points as bullets, and a clear
// way into the case study.
export default function ProjectCard({ p, n }: { p: Project; n: number }) {
  return (
    <article className="project-row">
      <div className="pr-thumb" aria-hidden="true">
        {p.thumbnail ? (
          <Image src={p.thumbnail} width={600} height={375} alt="" />
        ) : p.diagram ? (
          <div className="thumb-flow">
            <span className="mono">Illustrative flow</span>
            <ol>
              {p.diagram.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="thumb-motif">
            <span>{p.title}</span>
          </div>
        )}
      </div>
      <div className="pr-body">
        <div className="xp-meta">
          <span className="mono">{String(n).padStart(2, "0")}</span>
          <span className="badge badge-category">{p.category}</span>
          {p.featured && <span className="badge badge-status">Featured</span>}
        </div>
        <h2>{p.title}</h2>
        <ul className="bullets">
          <li>{p.summary}</li>
          {p.question && <li>{p.question}</li>}
          <li>
            <strong>My part:</strong> {p.role}
          </li>
          <li>
            <strong>Tools:</strong> {p.tools.join(", ")}
          </li>
          {p.timeline && (
            <li>
              <strong>When:</strong> {p.timeline}
            </li>
          )}
        </ul>
        <div className="btn-row">
          <Link className="btn" href={`/projects/${p.slug}`}>
            Open case study<span className="sr-only">: {p.title}</span> →
          </Link>
          {p.links.map((l) => (
            <a key={l.href} className="btn btn-line" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
