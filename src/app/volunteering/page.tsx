import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { buildLog, volunteer } from "@/content/content";

export const metadata: Metadata = {
  title: "Volunteering",
  description: "Volunteering with the John Keells Foundation and City of Dreams, CSR field research, and memberships.",
};

export default function Volunteering() {
  const csr = buildLog.find((b) => b.id === "build-csr-street-vendors");
  return (
    <div className="wrap page">
      <PageHead folio="Volunteering · 24" title="Giving time." dek={volunteer.summary} />
      <div className="cards">
        {volunteer.items.map((v) => (
          <article key={v.id} className="card">
            {"image" in v && v.image ? (
              <figure className="event-fig">
                <img loading="lazy" decoding="async" src={v.image} alt={v.imageAlt} width={1000} height={667} />
                <figcaption>
                  <a href={v.creditUrl}>{v.credit}</a>
                </figcaption>
              </figure>
            ) : null}
            <span className="meta">{v.dateRange}</span>
            <h2>{v.event}</h2>
            <p className="small muted">
              {v.title}, {v.organization}
            </p>
            <p className="small">{v.summary}</p>
          </article>
        ))}
      </div>
      {csr ? (
        <section className="split" aria-labelledby="vol-csr">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/street-vendor-photo.webp" alt="A street food vendor at his stall in Colombo" width={1600} height={1200} style={{ aspectRatio: "4 / 3" }} />
            <figcaption>Field research with street food vendors in Colombo.</figcaption>
          </figure>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span className="kicker">Community research</span>
            <h2 className="sec-title" id="vol-csr">
              {csr.title}
            </h2>
            <p>{csr.built}</p>
          </div>
        </section>
      ) : null}
      <section style={{ display: "flex", flexDirection: "column", gap: 12 }} aria-labelledby="vol-members">
        <h2 className="kicker" id="vol-members">
          Memberships
        </h2>
        <ul className="tags">
          {volunteer.memberships.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
