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
    description: study.context,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: { title: study.title, description: study.context, images: ["/og.png"] },
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
          <h2>Context</h2>
          <p>{study.context}</p>
        </section>
        <section className="cs-block">
          <h2>Problem</h2>
          <p>{study.problem}</p>
        </section>
        <List title="Approach" items={study.approach} />
        <List title="Key decisions" items={study.keyDecisions} />
        <List title="Outcome" items={study.outcome} />
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
