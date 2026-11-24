import Link from "next/link";
import Folio from "@/components/mag/Folio";
import { OpenAgain } from "@/components/mag/Opening";
import { identity, magazine } from "@/content/content";

const TOC = [
  { n: "04", href: "/use-cases", t: "From the factory production line to the outlet shelves", d: "The analyst work at OCTAVE, John Keells Holdings. The heart of the issue." },
  { n: "12", href: "/research", t: "PCOS Care", d: "Machine learning as a screening-support tool, published at IEEE ICAHS 2025." },
  { n: "14", href: "/projects", t: "Projects", d: "PCOS Care, Layer1 Studio and independent builds." },
  { n: "16", href: "/experience", t: "Experience", d: "OCTAVE, Layer1 Studio, London Success Academy, retail, support and teaching." },
  { n: "18", href: "/ask", t: "Ask me anything", d: "An agent that knows my work and answers with its source." },
  { n: "20", href: "/education", t: "Education", d: "A First Class in Computer Science at Westminster, CIMA, and school." },
  { n: "24", href: "/volunteering", t: "Volunteering", d: "The John Keells Foundation, City of Dreams and community research." },
  { n: "26", href: "/achievements", t: "Achievements", d: "Prizes, a hackathon final, school leadership and gold in the pool." },
  { n: "28", href: "/news", t: "In the news", d: "Westminster, IEEE, John Keells, the Daily FT and LMD." },
  { n: "29", href: "/skills", t: "Skills", d: "The toolkit, and where each capability shows up." },
  { n: "30", href: "/pictures", t: "In pictures", d: "Graduation, the research, on stage, awards and builds." },
];

export default function Cover() {
  const c = magazine.cover;
  return (
    <div className="wrap page">
      <section className="cover" aria-label="Cover">
        <div className="cover-copy">
          <Folio right={`${magazine.issue} · ${magazine.issueDate}`} />
          <h1 className="cover-title">
            Rachel
            <br />
            Cooray
          </h1>
          <p className="cover-strap">{magazine.strap}</p>
          <div className="cover-head">
            <p className="cover-headline">{magazine.coverHeadline}</p>
            <p className="muted">{magazine.coverDeck}</p>
          </div>
          <Link className="cover-line lead" href="/use-cases">
            <span className="kicker">{c.story.kicker}</span>
            <span className="big">{c.story.title}</span>
            <span className="muted">{c.story.dek}</span>
          </Link>
          <div className="cover-pair">
            <Link className="cover-line" href="/research">
              <span className="kicker">{c.research.kicker}</span>
              <span className="mid">{c.research.title}</span>
            </Link>
            <Link className="cover-line" href="/ask">
              <span className="kicker">{c.ask.kicker}</span>
              <span className="mid">{c.ask.title}</span>
            </Link>
          </div>
          <p className="cover-also">
            <span className="kicker">Also inside</span> {c.alsoInside}
          </p>
          <OpenAgain />
        </div>
        <figure className="cover-photo">
          <img fetchPriority="high" src="/images/mag/london.webp" alt="Rachel Cooray on the South Bank in London, in a black coat, with the London Eye behind her" width={1062} height={1600} />
          <figcaption className="cover-tag">
            <span>{identity.role}</span>
            <span>{identity.employer}</span>
          </figcaption>
        </figure>
      </section>

      <section className="contents" id="in-this-issue" aria-labelledby="toc-title">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h2 id="toc-title">In this issue</h2>
          <p className="quote">{magazine.pullQuote}</p>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/rachel-speaking.webp" alt="Rachel speaking at a lectern, holding a microphone and smiling" width={1100} height={1196} style={{ aspectRatio: "4 / 5", maxWidth: 460 }} />
            <figcaption>Addressing the school board, 2022.</figcaption>
          </figure>
        </div>
        <div className="toc">
          <span className="kicker toc-head">Features and departments</span>
          {TOC.map((t) => (
            <Link key={t.href} href={t.href} className="toc-item">
              <span className="toc-row">
                <span className="t">{t.t}</span>
                <span className="leader" aria-hidden="true" />
                <span className="n">{t.n}</span>
              </span>
              <span className="d">{t.d}</span>
            </Link>
          ))}
          <a href="#contact" className="toc-item">
            <span className="toc-row">
              <span className="t">Contact</span>
              <span className="leader" aria-hidden="true" />
              <span className="n">32</span>
            </span>
            <span className="d">Get in touch.</span>
          </a>
        </div>
      </section>
    </div>
  );
}
