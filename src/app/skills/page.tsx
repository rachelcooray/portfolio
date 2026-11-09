import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import { PointList } from "@/components/home/Sections";
import { octave, site } from "@/content/content";

export const metadata: Metadata = { title: "Skills", description: "Skills and tools, grouped by what they're for and where they were used." };

export default function Skills() {
  const groups = site.about.skills;
  return (
    <>
      <PageHero
        num="07"
        label="Skills · Tools for thinking and building"
        title="What I can do, and where I've used it."
        lead="Grouped by capability. Each group says where it was used, so nothing implies equal expertise."
        crumbs={[{ label: "Skills" }]}
      />
      <section className="wrap pb">
        <div className="skill-groups">
          {groups.map((g, i) => (
            <article key={g.capability} className="skill-group" data-reveal>
              <p className="mono">{String(i + 1).padStart(2, "0")}</p>
              <h2>{g.capability}</h2>
              <p className="where-used">
                <span className="mono">Where</span> {g.where}
              </p>
              <PointList points={g.tools.split(", ").map((t) => t.charAt(0).toUpperCase() + t.slice(1))} />
            </article>
          ))}
        </div>
      </section>
      <section className="band band-oat">
        <div className="wrap split-2">
          <SectionHeading kicker="At work today" title="The OCTAVE stack." />
          <div data-reveal>
            <PointList points={octave.tools} />
            <div className="btn-row mt">
              <Button href="/experience">See the experience →</Button>
              <Button href="/projects" variant="secondary">
                See the projects
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
