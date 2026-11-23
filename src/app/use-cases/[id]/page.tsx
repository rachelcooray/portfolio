import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Folio from "@/components/mag/Folio";
import { magazine, useCaseStories } from "@/content/content";

const STAGES = [
  { key: "Factory", label: "Factory" },
  { key: "Dispatch", label: "Dispatch" },
  { key: "Distributor", label: "Distributor warehouse" },
  { key: "Market", label: "Outlets" },
];

export function generateStaticParams() {
  return magazine.useCases.map((u) => ({ id: u.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const u = magazine.useCases.find((x) => x.id === id);
  return u ? { title: u.name, description: `${u.name}: ${u.headline}` } : {};
}

export default async function UseCase({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = magazine.useCases.findIndex((x) => x.id === id);
  const u = magazine.useCases[i];
  const s = useCaseStories[id];
  if (!u || !s) notFound();
  const prev = magazine.useCases[i - 1];
  const next = magazine.useCases[i + 1];
  return (
    <div className="wrap page">
      <Folio right={`Use case ${String(i + 1).padStart(2, "0")} of ${magazine.useCases.length}`} />
      <nav aria-label="Breadcrumb" className="small">
        <Link href="/use-cases">Use cases</Link> <span className="muted">/ {u.name}</span>
      </nav>
      <div className="page-head">
        <h1 className="uc-head">{u.headline}</h1>
        <p>
          <span className="kicker">
            {u.name} · {u.stage} · Owned
          </span>
          <br />
          {u.line}
        </p>
      </div>

      <ol className="locator" aria-label="Where this use case sits in the value chain">
        {STAGES.map((st) => (
          <li key={st.key} className={st.key === u.stage ? "is-here" : undefined} aria-current={st.key === u.stage ? "step" : undefined}>
            <span className="locator-dot" />
            <span>{st.label}</span>
          </li>
        ))}
      </ol>

      <section className="ps" aria-label="Problem and solution">
        <div className="ps-card ps-problem">
          <span className="ps-tag">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3 2 20h20z" />
              <path d="M12 10v4M12 17h.01" />
            </svg>
            The problem
          </span>
          <p className="ps-text">{s.problem}</p>
        </div>
        <div className="ps-arrow" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </div>
        <div className="ps-card ps-solution">
          <span className="ps-tag">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
            </svg>
            The solution
          </span>
          <p className="ps-text">{s.solution}</p>
        </div>
      </section>

      <section className="steps-sec" aria-labelledby="h-analytics">
        <h2 id="h-analytics" className="sec-title">
          How analytics helps
        </h2>
        <ol className="steps">
          {s.analytics.map((a, k) => (
            <li key={a} className="step" style={{ ["--k" as string]: k }}>
              <span className="step-n">{k + 1}</span>
              <p>{a}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="value-sec" aria-labelledby="h-value">
        <h2 id="h-value" className="sec-title">
          Business value
        </h2>
        <ul className="value-tiles">
          {s.value.map((v) => (
            <li key={v} className="value-tile">
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m7.5 12.5 3 3 6-6.5" />
              </svg>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mine" aria-labelledby="h-mine">
        <div className="mine-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mag/rachel-face.webp" alt="" width={72} height={72} />
          <h2 id="h-mine">What I do</h2>
        </div>
        <div className="mine-body">
          {s.role.map((r) => (
            <p key={r}>{r}</p>
          ))}
        </div>
      </section>

      <p className="small muted">{magazine.confidentiality}</p>
      <nav className="story-nav" aria-label="Other use cases">
        {prev ? (
          <Link prefetch href={`/use-cases/${prev.id}`}>
            <span className="kicker">Previous</span>
            <span>{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link prefetch href={`/use-cases/${next.id}`} style={{ textAlign: "right" }}>
            <span className="kicker">Next</span>
            <span>{next.name}</span>
          </Link>
        ) : (
          <Link href="/use-cases" style={{ textAlign: "right" }}>
            <span className="kicker">Back to</span>
            <span>All use cases</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
