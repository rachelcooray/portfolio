import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { achievements, volunteer } from "@/content/content";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Prizes, hackathons, scholarships, school leadership and sport.",
};

const PICS: Record<number, { src: string; alt: string; contain?: boolean }> = {
  0: { src: "/images/mag/pcos-showcase.webp", alt: "Rachel presenting PCOS Care to judges beside her research poster" },
  1: { src: "/images/mag/embrace-certificate.webp", alt: "Microsoft certificate of excellence for the regional hackathon, AI for Neurodiverse Learners, EMBRACE", contain: true },
  3: { src: "/images/mag/best-prefect.webp", alt: "Newspaper photo of Rachel receiving the Best School Prefect of the Year award" },
};

export default function Achievements() {
  return (
    <div className="wrap page">
      <PageHead folio="Achievements · 26" title="Recognition." dek="Prizes and recognition I have been given, and one good day in the pool." />
      <div className="cards">
        {achievements.map((a, i) => (
          <article key={a.id} className={i === 0 ? "card lead" : "card"}>
            {PICS[i] ? <img loading="lazy" decoding="async" src={PICS[i].src} alt={PICS[i].alt} width={1200} height={750} style={PICS[i].contain ? { objectFit: "contain", background: "#2a2a2a" } : undefined} /> : null}
            <span className="meta">
              {a.organization} · {a.year}
            </span>
            <h2>{a.title}</h2>
            {a.summary ? <p className="small">{a.summary}</p> : null}
          </article>
        ))}
        <article className="card">
          <img loading="lazy" decoding="async" src="/images/mag/swimming-meet.webp" alt="Team OCTAVE at the John Keells intercompany swimming meet" width={399} height={501} />
          <span className="meta">JKH Intercompany Swimming Meet · 2026</span>
          <h2>Gold in the pool</h2>
          <p className="small">{volunteer.swimming}</p>
        </article>
      </div>
    </div>
  );
}
