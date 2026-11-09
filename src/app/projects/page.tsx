import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Headings";
import Button from "@/components/ui/Button";
import ProjectExplorer from "@/components/projects/ProjectExplorer";
import { site } from "@/content/content";

export const metadata: Metadata = { title: "Research & Projects", description: "Case studies across enterprise analytics, applied AI, software engineering and digital products." };

export default function Projects() {
  return (
    <>
      <PageHero num="02" label="Research & Projects" title="Research and projects, one by one." lead={site.work.intro[0]} crumbs={[{ label: "Research & Projects" }]}>
        <div className="btn-row">
          <Button href="/research">Read the research →</Button>
          <Button href="/projects/pcos-care" variant="secondary">
            PCOS Care case study
          </Button>
        </div>
      </PageHero>
      <section className="wrap pb">
        <ProjectExplorer />
        <p className="mono note mt">{site.work.note}</p>
      </section>
    </>
  );
}
