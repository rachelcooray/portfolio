import type { Metadata } from "next";
import { PageHero } from "@/components/ui/Headings";
import MediaArchive from "@/components/media/MediaArchive";

export const metadata: Metadata = { title: "Media", description: "Articles, university features and publications." };

export default function Media() {
  return (
    <>
      <PageHero num="06" label="In the media · Press and public features" title="In the media." lead="An archive of articles, university features and publications across my academic, professional, sporting and community journey." crumbs={[{ label: "In the media" }]} />
      <section className="wrap pb">
        <MediaArchive />
      </section>
    </>
  );
}
