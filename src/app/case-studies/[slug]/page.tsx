import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/content/content";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

function findStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} | Rachel Cooray`,
    description: study.summary,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: { title: study.title, description: study.summary, images: ["/og.png"] },
  };
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="cs-block">
      <h2>{title}</h2>
      <ul>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) notFound();
  const others = caseStudies.filter((c) => c.slug !== study.slug);

  return (
    <main className="cs">
      <header className="cs-top">
        <Link href="/" className="mark" aria-label="Rachel Cooray, home">
          RC
        </Link>
        <Link href="/#work" className="cs-back">
          Back to rachelcooray.com
        </Link>
      </header>
      <article className="cs-body">
        <p className="sec-num">{study.category}</p>
        <h1>{study.title}</h1>
        <p className="cs-sub">{study.subtitle}</p>
        <span className="hairline in" aria-hidden="true" />

        <section className="cs-block">
          <h2>Problem</h2>
          <p>{study.problem}</p>
        </section>
        <section className="cs-block">
          <h2>Why it mattered</h2>
          <p>{study.why}</p>
        </section>
        <section className="cs-block">
          <h2>My role</h2>
          <p>{study.role}</p>
        </section>
        {study.useCases && (
          <section className="cs-block">
            <h2>The four use cases</h2>
            <div className="cs-cases">
              {study.useCases.map((u) => (
                <div key={u.name} className="cs-case">
                  <h3>{u.name}</h3>
                  <p>
                    <span className="sec-num">Problem</span> {u.problem}
                  </p>
                  <p>
                    <span className="sec-num">Approach</span> {u.approach}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        <List title="Approach" items={study.approach} />
        <section className="cs-block">
          <h2>Tools</h2>
          <p>{study.tools.join(", ")}</p>
        </section>
        <List title="Outcome" items={study.outcome} />
        {study.limits && <List title="Limits" items={study.limits} />}
        {study.links && (
          <section className="cs-block">
            <h2>Links</h2>
            <p className="cs-links">
              {study.links.map((l) => (
                <a key={l.href} href={l.href} className="textlink">
                  {l.label}
                </a>
              ))}
            </p>
          </section>
        )}
        <blockquote className="cs-learned">
          <p className="sec-num">What I learned</p>
          <p>{study.learned}</p>
        </blockquote>

        <nav className="cs-next" aria-label="Other case studies">
          {others.map((o) => (
            <Link key={o.slug} href={`/case-studies/${o.slug}`}>
              <span className="sec-num">{o.category}</span>
              <span>{o.title}</span>
            </Link>
          ))}
        </nav>
      </article>
    </main>
  );
}
