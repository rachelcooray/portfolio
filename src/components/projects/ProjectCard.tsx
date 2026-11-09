import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/content";

export default function ProjectCard({ p, large }: { p: Project; large?: boolean }) {
  return (
    <article className={`project-card${large ? " large" : ""}`}>
      <Link href={`/projects/${p.slug}`} className="project-thumb" tabIndex={-1} aria-hidden="true">
        {p.thumbnail ? (
          <Image src={p.thumbnail} width={1200} height={750} alt="" />
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
      </Link>
      <div className="project-body">
        <div className="xp-meta">
          <span className="badge badge-category">{p.category}</span>
          {p.featured && <span className="badge badge-status">Featured</span>}
        </div>
        <h3>
          <Link href={`/projects/${p.slug}`}>{p.title}</Link>
        </h3>
        <p>{p.summary}</p>
        <p className="mono tools">{p.tools.slice(0, 4).join(" · ")}</p>
      </div>
    </article>
  );
}
