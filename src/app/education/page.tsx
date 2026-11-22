import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { cima, education, schoolLife } from "@/content/content";

const LOGOS: Record<string, { src: string; alt: string }> = {
  "education-westminster": { src: "/images/logos/westminster.svg", alt: "University of Westminster" },
  "education-cima": { src: "/images/logos/cima.webp", alt: "CIMA, the Chartered Institute of Management Accountants" },
  "education-school": { src: "/images/logos/st-bridgets.webp", alt: "St. Bridget's Convent, Colombo, crest" },
};

export const metadata: Metadata = {
  title: "Education",
  description: "BSc (Hons) Computer Science with First Class Honours from the University of Westminster, CIMA, and St. Bridget's Convent.",
};

export default function Education() {
  return (
    <div className="wrap page">
      <PageHead folio="Education · 20" title="A First Class Bachelor's degree." dek="Computer Science in London, business accounting alongside it, and the school where it started." />
      <div className="g g-grad">
        <figure>
          <img loading="lazy" decoding="async" src="/images/mag/graduation-roses-thames.webp" alt="Rachel in her graduation gown and cap holding red roses, by the Thames" width={893} height={1500} style={{ aspectRatio: "3 / 4", objectPosition: "center 30%" }} />
          <figcaption>Graduation day by the Thames, London.</figcaption>
        </figure>
        <figure>
          <img loading="lazy" decoding="async" src="/images/mag/graduation-southbank.webp" alt="Rachel in her graduation gown and cap under the colourful Southbank Centre canopy" width={900} height={1600} style={{ aspectRatio: "3 / 4", objectPosition: "center 30%" }} />
          <figcaption>Under the canopy on the South Bank.</figcaption>
        </figure>
        <div className="g-col">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/graduation-stage.webp" alt="Rachel shaking hands on stage at the University of Westminster graduation ceremony" width={640} height={480} style={{ aspectRatio: "4 / 3" }} />
            <figcaption>On stage at the ceremony, the handshake.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/degree.jpg" alt="University of Westminster degree certificate: Bachelor of Science in Computer Science with First Class Honours, awarded to Rachel Naadia Cooray" width={700} height={595} style={{ objectFit: "contain", background: "#eef3f1", border: "1px solid var(--line)" }} />
            <figcaption>The degree certificate.</figcaption>
          </figure>
        </div>
      </div>
      <div className="cards">
        {education.map((e, i) => (
          <article key={e.id} className={i === 0 ? "card lead" : "card"}>
            {LOGOS[e.id] ? <img className="edu-logo" src={LOGOS[e.id].src} alt={LOGOS[e.id].alt} loading="lazy" decoding="async" /> : null}
            <span className="meta">{e.dateRange}</span>
            <h2>{e.title}</h2>
            <p className="small muted">{e.institution}</p>
            <p className="small">{e.summary}</p>
            {e.id === "education-cima" ? (
              <ul>
                {cima.completed.map((c) => (
                  <li key={c}>{c}</li>
                ))}
                {cima.inProgress.map((c) => (
                  <li key={c}>{c}, in progress</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>

      <section className="school" aria-labelledby="school-title">
        <figure className="school-photo">
          <img loading="lazy" decoding="async" src={schoolLife.photo.src} alt={schoolLife.photo.alt} width={900} height={1159} />
          <figcaption>{schoolLife.photo.credit}</figcaption>
        </figure>
        <div className="school-copy">
          <span className="kicker">At school · St. Bridget&apos;s Convent, Colombo</span>
          <h2 className="sec-title" id="school-title">
            Leading from the front, since 2012.
          </h2>
          <ol className="school-ladder">
            {schoolLife.leadership.map((l) => (
              <li key={l.year}>
                <span className="school-year">{l.year}</span>
                <span className="school-dot" aria-hidden="true" />
                <span className="school-role">
                  <b>{l.role}</b>
                  <span className="muted small">{l.note}</span>
                </span>
              </li>
            ))}
          </ol>
          <p>{schoolLife.interact}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="kicker">Teams and crews</span>
            <ul className="tags">
              {schoolLife.teams.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
