import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { press, talks } from "@/content/content";

export const metadata: Metadata = {
  title: "In the news",
  description: "Coverage of my work and teams.",
};

// Newest first. The CSW65 talk sits as a feature between the recent stories
// and the 2020 ones, where it falls in time.
const byYear = [...press].sort((a, b) => Number(b.year) - Number(a.year));
const recent = byYear.filter((n) => Number(n.year) >= 2022);
const earlier = byYear.filter((n) => Number(n.year) < 2022);

function Stories({ items }: { items: typeof press }) {
  return (
    <div className="stories">
      {items.map((n) => (
        <article key={n.id} className="story-card">
          {n.image ? <img loading="lazy" decoding="async" src={n.image} alt={n.imageAlt ?? n.title} width={1200} height={750} /> : null}
          <div className="story-copy">
            <span className="kicker">
              {n.organization} · {n.year}
            </span>
            <h2>{n.title}</h2>
            {n.dek ? <p className="story-dek">{n.dek}</p> : null}
            {n.quote ? (
              <blockquote className="story-quote">
                <p>&ldquo;{n.quote}&rdquo;</p>
                {n.quoteBy ? <cite>{n.quoteBy}</cite> : null}
              </blockquote>
            ) : null}
            {n.link ? (
              <a className="story-link" href={n.link}>
                Read the story<span className="sr-only">: {n.title}</span> →
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function News() {
  return (
    <div className="wrap page">
      <PageHead folio="In the news · 28" title="Coverage of my work and teams." dek="Where my work and my teams have been written about." />
      <Stories items={recent} />
      {talks.map((t) => (
        <section key={t.id} className="talk talk-feature" aria-labelledby={t.id}>
          <figure className="talk-fig">
            <img src={t.image} alt={t.imageAlt} width={1280} height={720} loading="lazy" decoding="async" />
            <figcaption>
              <a href={t.link}>Watch on YouTube, from 1:26:11 →</a>
            </figcaption>
          </figure>
          <div className="talk-copy">
            <span className="kicker">
              Feature · Speaking · {t.date}
            </span>
            <h2 id={t.id} className="sec-title">
              {t.title}
            </h2>
            <p className="small muted">
              {t.event}. {t.org}.
            </p>
            <p className="talk-about">{t.about}</p>
            <figure className="talk-title">
              <img src={t.titleImage} alt={t.titleImageAlt} width={480} height={360} loading="lazy" decoding="async" />
              <figcaption>The event&apos;s title slide, 20 March 2021.</figcaption>
            </figure>
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
      <Stories items={earlier} />
    </div>
  );
}
