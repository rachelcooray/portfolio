import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Headings";
import MediaArchive from "@/components/media/MediaArchive";

export const metadata: Metadata = { title: "Media", description: "Articles, university features and publications." };

export default function Media() {
  return (
    <>
      <PageHero num="09" label="Media · Press and public features" title="In the news." lead="An archive of articles, university features and publications across my academic, professional, sporting and community journey." crumbs={[{ href: "/beyond-work", label: "Beyond Work" }, { label: "Media" }]} />
      <section className="wrap pb">
        <MediaArchive />
      </section>
    </>
  );
}
