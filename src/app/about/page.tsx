import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { TagList } from "@/components/ui/Badge";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import MultidisciplinaryMap from "@/components/about/MultidisciplinaryMap";
import { identity, personalValues, site } from "@/content/content";

export const metadata: Metadata = { title: "About", description: "The person behind the work: how I think, where I'm heading and what connects my disciplines." };

export default function About() {
  const a = site.about;
  return (
    <>
      <PageHero
        num="02"
        label="About · Background and philosophy"
        title="Curiosity. Impact. Always learning."
        lead={a.paragraphs[0]}
        crumbs={[{ label: "About" }]}
        image={{ src: identity.portrait, w: 679, h: 1366, alt: identity.portraitAlt, className: "cutout" }}
      >
        <div className="btn-row">
          <Button href="/experience">My journey</Button>
          <Button href="/projects" variant="secondary">
            My work
          </Button>
        </div>
      </PageHero>

      <section className="band band-oat">
        <div className="wrap split-2">
          <SectionHeading kicker="Biography" title={a.title} />
          <div className="prose" data-reveal>
            {a.paragraphs.slice(1).map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHeading kicker="How my disciplines connect" title="Five disciplines, each one needs the others.">
            <p>Select a discipline to see its role and where it shows up in my work.</p>
          </SectionHeading>
          <div data-reveal>
            <MultidisciplinaryMap />
          </div>
        </div>
      </section>

      <section className="band band-oat">
        <div className="wrap">
          <SectionHeading kicker="Professional philosophy" title="How I approach problems." />
          <ol className="principles" data-reveal>
            {a.principles.map((p, i) => (
              <li key={p.title}>
                <span className="mono">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHeading kicker="Personal values" title="What I hold myself to." />
          <div className="values" data-reveal>
            {personalValues.map((v) => (
              <div key={v.title} className="value">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-forest">
        <div className="wrap split-2">
          <div data-reveal>
            <SectionHeading light kicker="Career ambition" title={a.direction.title} />
            <p className="lede muted-light">{a.direction.text}</p>
          </div>
          <div data-reveal>
            <ul className="tick-list light">
              {a.direction.interests.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="small muted-light">{a.direction.note}</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHeading kicker="Learning journey" title="Broad on top. Deeper underneath." />
          <div className="tshape" data-reveal role="img" aria-label={`T-shaped profile. Breadth: ${a.tShape.breadth.join(", ")}. Foundation: ${a.tShape.foundation}. Developing depth: ${a.tShape.depth}.`}>
            <div className="t-bar">
              <p className="mono">Breadth</p>
              <ul>
                {a.tShape.breadth.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="t-stem">
              <div className="t-found">
                <p className="mono">Foundation</p>
                <p>{a.tShape.foundation}</p>
              </div>
              <div className="t-depth">
                <p className="mono">Developing depth</p>
                <p>{a.tShape.depth}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-oat" id="skills">
        <div className="wrap">
          <SectionHeading kicker="Skills and capabilities" title="Grouped by what I can do.">
            <p>The last column says where each was used, so nothing implies equal expertise.</p>
          </SectionHeading>
          <div className="table-wrap" data-reveal>
            <table className="skills">
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  <th scope="col">Skills and tools</th>
                  <th scope="col">Where</th>
                </tr>
              </thead>
              <tbody>
                {a.skills.map((s) => (
                  <tr key={s.capability}>
                    <th scope="row">{s.capability}</th>
                    <td>{s.tools}</td>
                    <td className="mono">{s.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap split-2">
          <SectionHeading kicker="Personal interests" title="Outside work." />
          <div data-reveal>
            <TagList items={a.interests} />
            <div className="btn-row mt">
              <Button href="/education" variant="secondary">
                Education
              </Button>
              <Button href="/beyond-work" variant="secondary">
                Beyond work
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
