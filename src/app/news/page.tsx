import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { press, talks } from "@/content/content";
import Linked from "@/components/mag/Linked";

export const metadata: Metadata = {
  title: "In the news",
  description: "Coverage of my work and teams.",
};

// Every story gets the same card, newest first, alternating left and right
// like a magazine spread. The CSW65 talk is one of them, in its year.
const talk = talks[0];
const talkStory = {
  id: talk.id,
  title: `${talk.title}, a CSW65 panel`,
  organization: "Good Shepherd Asia Pacific",
  year: "2021",
  summary: "",
  link: talk.link,
  image: talk.titleImage,
  imageAlt: talk.titleImageAlt,
  dek: "A panel led by and for girls, held alongside CSW65, the 65th session of the United Nations Commission on the Status of Women. I spoke for Sri Lanka on the impact of COVID-19 on girls.",
  quote: talk.quote,
  quoteBy: "What I said",
};
const all = [...press, talkStory].sort((a, b) => Number(b.year) - Number(a.year));

function Stories({ items }: { items: (typeof press)[number][] }) {
  return (
    <div className="stories">
      {items.map((n) => (
        <article key={n.id} className="story-card">
          {n.image ? <img loading="lazy" decoding="async" src={n.image} alt={n.imageAlt ?? n.title} width={1200} height={750} /> : null}
          <div className="story-copy">
            <span className="kicker">
              <Linked text={n.organization} />, {n.year}
            </span>
            <h2>{n.title}</h2>
            {n.dek ? <p className="story-dek"><Linked text={n.dek} /></p> : null}
            {n.quote ? (
              <blockquote className="story-quote">
                <p>&ldquo;{n.quote}&rdquo;</p>
                {n.quoteBy ? <cite>{n.quoteBy}</cite> : null}
              </blockquote>
            ) : null}
            {n.link ? (
              <a className="story-link" href={n.link}>
                Read the story<span className="sr-only">: {n.title}</span>
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
      <PageHead folio="In the news, p. 28" title="Coverage of my work and teams." dek="Where my work and my teams have been written about." />
      <Stories items={all} />
    </div>
  );
}
