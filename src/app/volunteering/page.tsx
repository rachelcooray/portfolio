import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { TagList } from "@/components/ui/Badge";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import { PointList } from "@/components/home/Sections";
import { volunteer } from "@/content/content";

export const metadata: Metadata = { title: "Volunteering", description: "Volunteering with the John Keells Foundation and City of Dreams, CSR field research and memberships." };

export default function Volunteering() {
  return (
    <>
      <PageHero
        num="04"
        label="Volunteering · Community"
        title="Showing up for things larger than me."
        lead="Event volunteering, community research and the clubs I belong to, one by one."
        crumbs={[{ label: "Volunteering" }]}
        image={{ src: "/images/photos/street-vendor.jpg", w: 1600, h: 1200, alt: "A street food vendor at his stall in Colombo" }}
      />
      <section className="wrap pb">
        <ol className="vol-cards">
          {volunteer.items.map((v, i) => (
            <li key={v.id} className="vol-card" data-reveal>
              <div className="vol-head">
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="mono">{v.dateRange}</span>
              </div>
              <h2>{v.event}</h2>
              <ul className="bullets">
                <li>
                  <strong>Role:</strong> {v.title}
                </li>
                <li>
                  <strong>With:</strong> {v.organization}
                </li>
                <li>{v.summary}</li>
              </ul>
            </li>
          ))}
          <li className="vol-card" data-reveal>
            <div className="vol-head">
              <span className="mono">{String(volunteer.items.length + 1).padStart(2, "0")}</span>
              <span className="mono">2022</span>
            </div>
            <h2>CSR street-vendor research</h2>
            <ul className="bullets">
              <li>
                <strong>Role:</strong> Field researcher and analyst, OCTAVE internship
              </li>
              <li>A field survey of street food vendors in Colombo.</li>
              <li>The findings were adopted by the CSR team.</li>
            </ul>
          </li>
        </ol>
      </section>
      <section className="band band-oat">
        <div className="wrap split-2">
          <div data-reveal>
            <SectionHeading kicker="Memberships and affiliations" title="Where I belong." />
            <PointList points={volunteer.memberships} />
          </div>
          <figure className="preview-photo" data-reveal>
            <Image src="/images/photos/rachel-speaking.webp" width={1840} height={2000} alt="Rachel Cooray speaking at a lectern, holding a microphone and smiling" />
          </figure>
        </div>
        <div className="wrap mt" data-reveal>
          <p className="mono note">Also outside work</p>
          <TagList items={volunteer.hobbies} />
          <div className="btn-row mt">
            <Button href="/beyond-work" variant="secondary">
              Beyond work →
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
