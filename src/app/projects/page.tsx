import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/mag/PageHead";
import { buildLog, layer1, research } from "@/content/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Research software, client products and independent builds.",
};

export default function Projects() {
  return (
    <div className="wrap page">
      <PageHead folio="Projects · 14" title="Research software, client products and independent builds." />
      <div className="cards">
        <article className="card lead">
          <img loading="lazy" decoding="async" src="/images/mag/pcos-app.webp" alt="The PCOS Care web app home page" width={2000} height={1250} style={{ objectPosition: "top" }} />
          <span className="meta">Research · 2025</span>
          <h2>PCOS Care</h2>
          <p>{research.paper.description}</p>
          <p className="small">
            <Link href="/research">Read the research feature</Link> · <a href={research.paper.appUrl}>Try the app</a>
          </p>
        </article>
        <article className="card lead">
          <img loading="lazy" decoding="async" src={layer1.logo} alt="Layer1 Studio" width={600} height={375} style={{ objectFit: "contain", background: "var(--sand)" }} />
          <span className="meta">
            {layer1.title} · {layer1.dateRange}
          </span>
          <h2>{layer1.company}</h2>
          <p>{layer1.description}</p>
          <ul className="tags" aria-label="Industries">
            {layer1.builtFor.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
        {buildLog.map((b) => (
          <article key={b.id} className="card">
            {b.image ? <img loading="lazy" decoding="async" src={b.image} alt={b.imageAlt ?? b.title} width={1200} height={750} style={{ objectPosition: "top" }} /> : null}
            <span className="meta">{b.year ?? "Independent build"}</span>
            <h2>{b.title}</h2>
            <p>{b.built}</p>
            <ul className="tags" aria-label="Built with">
              {b.tools.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {b.link ? (
              <p className="small">
                <a href={b.link}>{b.link.startsWith("/") ? "Try it on this site" : "See it live"}</a>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
