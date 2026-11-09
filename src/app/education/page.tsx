import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import { cima, site } from "@/content/content";

export const metadata: Metadata = { title: "Education", description: "University of Westminster, CIMA and earlier qualifications." };

export default function Education() {
  return (
    <>
      <PageHero num="01" label="Education · Degrees and qualifications" title="Learning as a foundation for building." lead={site.education.intro} crumbs={[{ label: "Education" }]} />

      <section className="wrap edu-major" data-reveal>
        <article className="degree-card">
          <p className="mono">Sep 2022 to Jul 2025 · London, United Kingdom</p>
          <h2>University of Westminster</h2>
          <p className="lede">BSc (Hons) Computer Science</p>
          <div className="honours">
            <span>First Class Honours</span>
            <span>Data Science specialisation</span>
          </div>
          <ul className="bullets">
            <li>Started at IIT, Sri Lanka, and completed the degree at Westminster.</li>
            <li>Third place at the final year project showcase.</li>
            <li>Published research at IEEE ICAHS 2025.</li>
            <li>Foundations in computer science, software engineering, data science and machine learning.</li>
          </ul>
        </article>
        <div className="edu-side">
          <figure>
            <Image src="/images/photos/showcase-group.jpg" width={800} height={450} alt="Students and industry judges at the Westminster final year project showcase" />
            <figcaption className="mono">Final year project showcase, 2025</figcaption>
          </figure>
          <article className="scholar">
            <Badge tone="status">Scholarship</Badge>
            <h3>UOW/IIT School of Computing and Engineering Part-Fee Scholarship</h3>
            <p className="mono">£5,000 · 2024/25</p>
          </article>
        </div>
      </section>

      <section className="band band-oat">
        <div className="wrap edu-cima" data-reveal>
          <div>
            <SectionHeading kicker="Professional qualification" title="CIMA Certificate in Business Accounting." />
            <p>A business and financial perspective alongside my technical background.</p>
          </div>
          <div className="progress-card">
            <div className="progress-row">
              <span>Certificate level</span>
              <Badge tone="owned">Completed Aug 2024</Badge>
            </div>
            <ul className="check-list">
              {cima.completed.map((c) => (
                <li key={c} className="done">
                  {c}
                </li>
              ))}
            </ul>
            <div className="progress-row">
              <span>Operational level</span>
              <Badge tone="contributed">In progress</Badge>
            </div>
            <ul className="check-list">
              {cima.inProgress.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap edu-record">
        <SectionHeading kicker="Academic performance" title="Earlier qualifications." />
        <div className="edu-record-grid" data-reveal>
          <div className="table-wrap">
            <table>
              <tbody>
                <tr>
                  <th scope="row">GCE Advanced Level, 2022</th>
                  <td>Chemistry A · English A · Physics B · Combined Mathematics B</td>
                </tr>
                <tr>
                  <th scope="row">GCE Ordinary Level, 2018</th>
                  <td>Nine A passes</td>
                </tr>
              </tbody>
            </table>
            <p className="muted small mt">St. Bridget&apos;s Convent, Colombo. Head Prefect, 2020.</p>
          </div>
          <figure>
            <Image src="/images/photos/head-prefect.jpg" width={1080} height={1391} alt="Rachel as Head Prefect in the green St. Bridget's Convent blazer" />
          </figure>
        </div>
      </section>
    </>
  );
}
