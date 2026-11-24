import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import { achievements, volunteer } from "@/content/content";
import Linked from "@/components/mag/Linked";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Awards and recognition.",
};

const PICS: Record<number, { src: string; alt: string; contain?: boolean }> = {
  0: { src: "/images/mag/pcos-showcase.webp", alt: "Rachel presenting PCOS Care to judges beside her research poster" },
  1: { src: "/images/mag/embrace-certificate.webp", alt: "Microsoft certificate of excellence for the regional hackathon, AI for Neurodiverse Learners, EMBRACE" },
  3: { src: "/images/mag/best-prefect.webp", alt: "Newspaper photo of Rachel receiving the Best School Prefect of the Year award" },
};

export default function Achievements() {
  return (
    <div className="wrap page">
      <PageHead folio="Achievements, p. 26" title="Awards and recognition." dek="Prizes and recognition I have been given." />
      <div className="cards">
        {achievements.map((a, i) => (
          <article key={a.id} className={i === 0 ? "card lead" : "card"}>
            {PICS[i] ? <img loading="lazy" decoding="async" src={PICS[i].src} alt={PICS[i].alt} width={1200} height={750} style={PICS[i].contain ? { objectFit: "contain", background: "#2a2a2a" } : PICS[i].src.includes("embrace") ? { objectPosition: "50% 45%" } : undefined} /> : null}
            <span className="meta">
              <Linked text={a.organization} />, {a.year}
            </span>
            <h2>{a.title}</h2>
            {a.summary ? <p className="small">{a.summary}</p> : null}
          </article>
        ))}
        <article className="card">
          <img loading="lazy" decoding="async" src="/images/mag/swimming-meet.webp" alt="Team OCTAVE at the John Keells intercompany swimming meet" width={399} height={501} />
          <span className="meta">JKH Intercompany Swimming Meet, 2026</span>
          <h2>JKH Intercompany Swimming Meet</h2>
          <p className="small">{volunteer.swimming}</p>
        </article>
      </div>
    </div>
  );
}
