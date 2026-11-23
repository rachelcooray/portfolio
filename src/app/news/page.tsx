import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { press, talks } from "@/content/content";

export const metadata: Metadata = {
  title: "In the news",
  description: "Coverage of my work and teams.",
};

export default function News() {
  return (
    <div className="wrap page">
      <PageHead folio="In the news · 28" title="Coverage of my work and teams." dek="Where my work and my teams have been written about." />
      {talks.map((t) => (
        <section key={t.id} className="talk" aria-labelledby={t.id}>
          <figure className="talk-fig">
            <img src={t.image} alt={t.imageAlt} width={1280} height={720} loading="lazy" decoding="async" />
            <figcaption>
              <a href={t.link}>Watch on YouTube, from 1:26:11 →</a>
            </figcaption>
          </figure>
          <div className="talk-copy">
            <span className="kicker">
              Speaking · {t.date}
            </span>
            <h2 id={t.id} className="sec-title">
              {t.title}
            </h2>
            <p className="small muted">
              {t.event}. {t.org}.
            </p>
            <p>{t.role}</p>
            <span className="kicker">What I said</span>
            <ul className="talk-points">
              {t.insights.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <blockquote className="pull">{t.quote}</blockquote>
          </div>
        </section>
      ))}
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
