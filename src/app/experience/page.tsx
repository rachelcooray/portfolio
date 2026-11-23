import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/mag/PageHead";
import { layer1, londonSuccessAcademy, octave, otherRoles, teaching } from "@/content/content";

export const metadata: Metadata = {
  title: "Experience",
  description: "From intern to analyst.",
};

const list = { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column" as const, gap: 6 };

export default function Experience() {
  const current = octave.roles[0];
  const ladder = [...octave.roles, ...octave.earlier];
  return (
    <div className="wrap page exp">
      <PageHead folio="Experience · 16" title="From intern to analyst." dek="Analytics, AI, product and people. The roles that shaped the work, newest first." />

      <section className="split" aria-labelledby="exp-octave">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <img loading="lazy" decoding="async" src={octave.logo} alt="OCTAVE" width={738} height={345} style={{ width: 200 }} />
          <h2 className="sec-title" id="exp-octave">
            {current.title}
          </h2>
          <p className="kicker">
            {current.company} · {current.dateRange}
          </p>
          <p className="muted small">{octave.meta}</p>
          <Link className="btn" href="/use-cases" style={{ alignSelf: "flex-start" }}>
            The six use cases
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <p>{octave.own}</p>
          <ul style={list}>
            {current.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <div className="cards">
            {octave.practice.map((p) => (
              <div key={p.title} className="card">
                <span className="meta">{p.title}</span>
                <p className="small">{p.body}</p>
              </div>
            ))}
          </div>
          <div>
            <span className="kicker">Career at OCTAVE</span>
            <ol className="ladder" style={{ marginTop: 10 }}>
              {ladder.map((r) => (
                <li key={r.id}>
                  <span>{r.title}</span>
                  <span className="meta">{r.dateRange}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="split" aria-labelledby="exp-layer1">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <img loading="lazy" decoding="async" src={layer1.logo} alt="Layer1 Studio" width={600} height={375} style={{ width: 180, background: "var(--sand)" }} />
          <h2 className="sec-title" id="exp-layer1">
            {layer1.title}
          </h2>
          <p className="kicker">
            {layer1.company} · {layer1.dateRange}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p>{layer1.description}</p>
          <ul style={list}>
            {layer1.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="split" aria-labelledby="exp-lsa">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h2 className="sec-title" id="exp-lsa">
            {londonSuccessAcademy.title}
          </h2>
          <p className="kicker">
            {londonSuccessAcademy.company} · {londonSuccessAcademy.dateRange}
          </p>
        </div>
        <ul style={list}>
          {londonSuccessAcademy.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 18 }} id="people" aria-labelledby="exp-people">
        <h2 className="sec-title" id="exp-people">
          Where I learned to work with people
        </h2>
        <div className="roles">
          {otherRoles.map((r) => (
            <div key={r.id} className="role">
              {r.logo ? <img className="logo" src={r.logo} alt={r.company} /> : <span className="word">{r.company}</span>}
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 600 }}>
                {r.title}, {r.company}
              </h3>
              <span className="small muted">
                {r.location}, {r.dateRange}.
              </span>
              <ul>
                {r.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 18 }} aria-labelledby="exp-teaching">
        <h2 className="sec-title" id="exp-teaching">
          Teaching
        </h2>
        <p className="muted">{teaching.intro}</p>
        <div className="cards">
          {teaching.roles.map((t) => (
            <div key={t.id} className="card">
              <span className="meta">{t.dateRange}</span>
              <h3 style={{ fontSize: 26 }}>{t.title}</h3>
              <p className="small muted">{t.institution}</p>
              <p className="small">{t.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
