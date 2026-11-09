import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import { coreAchievements } from "@/content/content";

export const metadata: Metadata = { title: "Achievements", description: "Awards and recognition: Westminster showcase, Microsoft EMBRACE hackathon and the New Generation Awards." };

export default function Achievements() {
  return (
    <>
      <PageHero num="07" label="Achievements · Awards and recognition" title="Recognised along the way." lead="Three moments of recognition, from school leadership to research, each with the evidence behind it." crumbs={[{ href: "/beyond-work", label: "Beyond Work" }, { label: "Achievements" }]} />
      <section className="wrap awards-timeline">
        {coreAchievements.map((a, i) => (
          <article key={a.id} className={`award-row${a.image ? "" : " no-img"}`} data-reveal>
            <div className="award-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="9" r="6" />
                <path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7" />
              </svg>
            </div>
            <div className="award-copy">
              <p className="mono">
                {String(i + 1).padStart(2, "0")} · {a.year}
              </p>
              <h2>{a.title}</h2>
              <p className="muted">{a.org}</p>
              <p>{a.text}</p>
              {a.link && (
                <Button href={a.link} variant="text">
                  See the evidence ↗
                </Button>
              )}
            </div>
            {a.image && (
              <figure className="award-evidence">
                <Image src={a.image} width={a.w} height={a.h} alt={a.imageAlt} />
              </figure>
            )}
          </article>
        ))}
      </section>
      <section className="band band-oat">
        <div className="wrap split-2">
          <SectionHeading kicker="Also recognised" title="Scholarship and sport." />
          <ul className="tick-list" data-reveal>
            <li>UOW/IIT School of Computing and Engineering Part-Fee Scholarship, £5,000, 2024/25.</li>
            <li>Three individual golds and gold in every relay, under-25, JKH Intercompany Swimming Meet 2026.</li>
            <li>Published at IEEE ICAHS 2025.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
