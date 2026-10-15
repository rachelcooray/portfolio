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
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const study = findStudy(slug);
  if (!study) notFound();

  return (
    <main className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-[680px]">
        <Link href="/#work" className="text-sm text-accent hover:text-accent-hover">
          ← Back to rachelcooray.com
        </Link>

        <p className="text-sm font-semibold text-text-faint uppercase tracking-wide mt-8 mb-2">
          {study.category}
        </p>
        <h1 className="font-heading italic text-[32px] md:text-[40px] font-semibold mb-2 text-text">
          {study.title}
        </h1>
        <p className="text-base text-text-muted mb-10">{study.subtitle}</p>

        <div className="flex flex-wrap gap-8 mb-12">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-heading italic text-2xl font-semibold text-accent">
                {m.value}
              </div>
              <div className="text-sm text-text-faint">{m.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Context
          </h2>
          <p className="text-[15px] text-text-muted leading-relaxed">{study.context}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Problem
          </h2>
          <p className="text-[15px] text-text-muted leading-relaxed">{study.problem}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Approach
          </h2>
          <ul className="list-disc list-inside text-[15px] text-text-muted leading-relaxed space-y-2">
            {study.approach.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Key decisions
          </h2>
          <ul className="list-disc list-inside text-[15px] text-text-muted leading-relaxed space-y-2">
            {study.keyDecisions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Outcome
          </h2>
          <ul className="list-disc list-inside text-[15px] text-text-muted leading-relaxed space-y-2">
            {study.outcome.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            What she learned
          </h2>
          <p className="font-heading italic text-[19px] leading-relaxed text-text">
            &ldquo;{study.learned}&rdquo;
          </p>
        </section>
      </div>
    </main>
  );
}
