import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { press } from "@/content/content";

export const metadata: Metadata = {
  title: "In the news",
  description: "Coverage from the University of Westminster, IEEE, John Keells Holdings, the Daily FT and the LMD Youth Forum.",
};

export default function News() {
  return (
    <div className="wrap page">
      <PageHead folio="In the news · 28" title="In the news." dek="Where my work and my teams have been written about." />
      <div className="cards">
        {press.map((n) => (
          <article key={n.id} className="card">
            {n.image ? <img loading="lazy" decoding="async" src={n.image} alt={n.imageAlt ?? n.title} width={1200} height={750} /> : null}
            <span className="meta">
              {n.organization} · {n.year}
            </span>
            <h2>{n.title}</h2>
            {n.summary ? <p className="small">{n.summary}</p> : null}
            {n.link ? (
              <p className="small">
                <a href={n.link}>
                  Read it<span className="sr-only">: {n.title}</span>
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
