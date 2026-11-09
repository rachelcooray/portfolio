import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Button from "@/components/ui/Button";
import { Badge, TagList } from "@/components/ui/Badge";
import ArchitectureDiagram from "@/components/visualisations/ArchitectureDiagram";
import { projectList } from "@/content/content";

export function generateStaticParams() {
  return projectList.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectList.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.summary, alternates: { canonical: `/projects/${p.slug}` } };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const i = projectList.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projectList[i];
  const next = projectList[(i + 1) % projectList.length];
  const meta = [
    { k: "Role", v: p.role },
    { k: "Technologies", v: p.tools.join(", ") },
    { k: "Timeline", v: p.timeline },
    { k: "Domain", v: p.domain },
  ].filter((m) => m.v);
  return (
    <article className="cs">
      <header className="wrap cs-head" data-reveal>
        <Breadcrumbs items={[{ href: "/projects", label: "Projects" }, { label: p.title }]} />
        <Badge>{p.category}</Badge>
        <h1>{p.title}</h1>
        {p.question && <p className="question">{p.question}</p>}
        <p className="lead">{p.summary}</p>
      </header>
      <div className="wrap cs-visual" data-reveal>
        {p.thumbnail ? (
          <Image src={p.thumbnail} width={2000} height={1250} alt={p.thumbnailAlt} priority />
        ) : p.diagram ? (
          <ArchitectureDiagram steps={p.diagram} label={`${p.title}, illustrative flow`} />
        ) : null}
      </div>
      <dl className="wrap cs-meta" data-reveal>
        {meta.map((m) => (
          <div key={m.k}>
            <dt className="mono">{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>
      {p.confidential && (
        <p className="wrap confidential mono" data-reveal>
          Confidentiality: shown without client data, internal architecture, commercial figures or operational detail. Diagrams are illustrative.
        </p>
      )}
      <div className="wrap cs-body">
        {p.parts.map((part, n) => (
          <section key={part.title} className="cs-part" data-reveal>
            <p className="mono">{String(n + 1).padStart(2, "0")}</p>
            <div>
              <h2>{part.title}</h2>
              {part.body.length > 1 ? (
                <ul className="bullets">
                  {part.body.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : (
                <p className={part.title === "Lessons and next steps" ? "learned" : ""}>{part.body[0]}</p>
              )}
            </div>
          </section>
        ))}
        <TagList items={p.tools} label="Technology stack" />
        {p.links.length > 0 && (
          <div className="btn-row mt" data-reveal>
            {p.links.map((l) => (
              <Button key={l.href} href={l.href} variant="secondary">
                {l.label} ↗
              </Button>
            ))}
          </div>
        )}
      </div>
      <nav className="wrap cs-next" aria-label="Next project">
        <Link href={`/projects/${next.slug}`}>
          <span className="mono">Next project</span>
          <span className="next-title">{next.title} →</span>
        </Link>
      </nav>
    </article>
  );
}
