import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { TagList } from "@/components/ui/Badge";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import { site, volunteer } from "@/content/content";

export const metadata: Metadata = { title: "Beyond Work", description: "Volunteering, swimming, leadership, memberships and interests." };

const INTERESTS = [
  { t: "Swimming", d: "Competitive, and the sport I care most about." },
  { t: "Running", d: "Time to think." },
  { t: "Films and dramas", d: "Stories and how they are told." },
  { t: "History", d: "How we got here." },
  { t: "Music", d: "Trinity College London piano." },
];

export default function Beyond() {
  return (
    <>
      <PageHero
        num="08"
        label="Beyond Work · Volunteering and interests"
        title="Giving back. Staying active."
        lead={site.beyond.intro}
        crumbs={[{ label: "Beyond Work" }]}
        image={{ src: "/images/photos/rachel-speaking.webp", w: 1840, h: 2000, alt: "Rachel Cooray speaking at a lectern, holding a microphone and smiling" }}
      >
        <div className="btn-row">
          <Button href="/achievements" variant="secondary">
            Achievements
          </Button>
          <Button href="/media" variant="secondary">
            Media
          </Button>
        </div>
      </PageHero>

      <section className="band band-oat">
        <div className="wrap">
          <SectionHeading kicker="Volunteering" title="Showing up for things larger than me." />
          <ol className="vol-timeline">
            {volunteer.items.map((v) => (
              <li key={v.id} data-reveal>
                <span className="mono">{v.dateRange}</span>
                <div>
                  <h3>{v.event}</h3>
                  <p className="muted">
                    {v.title}, {v.organization}
                  </p>
                  <p>{v.summary}</p>
                </div>
              </li>
            ))}
          </ol>
          <figure className="wide-photo" data-reveal>
            <Image src="/images/photos/street-vendor.jpg" width={1600} height={1200} alt="A street food vendor at his stall in Colombo" />
            <figcaption className="mono">CSR field research with street food vendors, OCTAVE, 2022. The findings were adopted by the CSR team.</figcaption>
          </figure>
        </div>
      </section>

      <section className="band band-forest">
        <div className="wrap swim">
          <figure data-reveal>
            <Image src="/images/photos/swimming-meet.jpg" width={399} height={501} alt="Team OCTAVE with the overall women's championship trophy at the JKH Intercompany Swimming Meet 2026" />
          </figure>
          <div data-reveal>
            <p className="eyebrow light">Athletic profile</p>
            <h2>Competitive swimming is an important part of my life.</h2>
            <div className="medals" aria-label="Medals at the JKH Intercompany Swimming Meet 2026">
              <span className="medal">Individual gold</span>
              <span className="medal">Individual gold</span>
              <span className="medal">Individual gold</span>
              <span className="medal relay">Gold in every relay</span>
            </div>
            <p className="lede muted-light">{volunteer.swimming}</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHeading kicker="Leadership" title="Head Prefect, St. Bridget's Convent, 2020." />
          <div className="leader" data-reveal>
            <Image src="/images/photos/head-prefect.jpg" width={1080} height={1391} alt="Rachel as Head Prefect in the green St. Bridget's Convent blazer" />
            <Image src="/images/photos/best-prefect-clipping.png" width={598} height={390} alt="Newspaper clipping: Best School Prefect of the Year, Rachel Naadia Cooray, receiving her award" />
            <p>Recognised as School Prefect of the Year at the New Generation Awards by Women in Management and the National Youth Services Council.</p>
          </div>
        </div>
      </section>

      <section className="band band-oat">
        <div className="wrap">
          <SectionHeading kicker="Personal interests" title="What I do for fun." />
          <div className="interest-grid" data-reveal>
            {INTERESTS.map((x) => (
              <div key={x.t} className="interest">
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </div>
            ))}
          </div>
          <div className="split-2 mt" data-reveal>
            <div>
              <h3 className="mini">Memberships and affiliations</h3>
              <TagList items={volunteer.memberships} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
