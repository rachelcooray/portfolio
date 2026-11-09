import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Badge, TagList } from "@/components/ui/Badge";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import FMCGValueChain from "@/components/experience/FMCGValueChain";
import ExperienceTimeline from "@/components/experience/ExperienceTimeline";
import { octave } from "@/content/content";

export const metadata: Metadata = { title: "Experience", description: "OCTAVE at John Keells Holdings, Layer1.Studio, London Success Academy, teaching and earlier roles." };

const LIFECYCLE = ["Problem statement", "Requirements", "Build with data science and engineering", "Validate", "Measure", "Govern with the business"];

export default function Experience() {
  const current = octave.roles[0];
  const progression = [...octave.roles, ...octave.earlier];
  return (
    <>
      <PageHero num="03" label="Experience · Professional journey" title="From ideas to impact." lead="A journey across analytics, AI, product and people. The roles that shaped my work get the most room." crumbs={[{ label: "Experience" }]} />

      <section className="wrap octave" data-reveal>
        <div className="octave-head">
          <div className="company">
            <Image src={octave.logo} width={64} height={64} alt="" />
            <div>
              <p className="company-name">OCTAVE</p>
              <p className="muted">John Keells Holdings</p>
            </div>
          </div>
          <Badge tone="status">Current</Badge>
        </div>
        <h2 className="octave-title">{current.title}</h2>
        <p className="mono">{current.dateRange} · Colombo, Sri Lanka</p>
        <p className="lede">{octave.own}</p>

        <h3 className="mini">FMCG value chain · use case explorer</h3>
        <FMCGValueChain />

        <div className="octave-grid">
          <div>
            <h3 className="mini">My role</h3>
            <ul className="bullets">
              {current.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mini">Delivery lifecycle</h3>
            <ol className="lifecycle">
              {LIFECYCLE.map((l, i) => (
                <li key={l}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {l}
                </li>
              ))}
            </ol>
            <h3 className="mini">Impact measurement</h3>
            <p>Pilot and control comparisons where possible, before and after analysis where appropriate. Operational indicators first, then commercial outcomes, always separating association from proven impact.</p>
            <h3 className="mini">Technology</h3>
            <TagList items={octave.tools} />
          </div>
        </div>

        <h3 className="mini">Career progression at OCTAVE</h3>
        <ol className="progression">
          {progression.map((r) => (
            <li key={r.id}>
              <span>{r.title}</span>
              <span className="mono">{r.dateRange}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band-oat">
        <div className="wrap">
          <SectionHeading kicker="Career timeline" title="Every other role, filtered by kind." />
          <ExperienceTimeline />
        </div>
      </section>

      <section className="band band-forest">
        <div className="wrap closing-row" data-reveal>
          <h2>See what this work produced.</h2>
          <div className="btn-row">
            <Button href="/projects" variant="light">
              View projects
            </Button>
            <Button href="/rachelcooray-cv.pdf" variant="ghost-light">
              Download CV
            </Button>
          </div>
          <p className="small muted-light">
            OCTAVE work is shown without confidential data, client information or results. <Link href="/projects">Case studies</Link> follow the same rule.
          </p>
        </div>
      </section>
    </>
  );
}
