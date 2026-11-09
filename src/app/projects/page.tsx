import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Headings";
import ProjectExplorer from "@/components/projects/ProjectExplorer";
import { site } from "@/content/content";

export const metadata: Metadata = { title: "Projects", description: "Case studies across enterprise analytics, applied AI, software engineering and digital products." };

export default function Projects() {
  return (
    <>
      <PageHero num="04" label="Projects · Selected work" title="Building solutions that matter." lead={site.work.intro[0]} crumbs={[{ label: "Projects" }]}>
        <p className="muted">{site.work.intro[1]}</p>
      </PageHero>
      <section className="wrap pb">
        <ProjectExplorer />
        <p className="mono note mt">{site.work.note}</p>
      </section>
    </>
  );
}
