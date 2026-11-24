import type { Metadata } from "next";
import PageHead from "@/components/mag/PageHead";
import SkillIcon from "@/components/mag/SkillIcon";
import SkillCloud from "@/components/mag/SkillCloud";
import Robot from "@/components/mag/Robot";
import { aiCompetencies, site, skills, thinkingLayer, toolkitStack } from "@/content/content";

export const metadata: Metadata = {
  title: "Skills",
  description: "Tools and capabilities, and where each was applied.",
};

const explored = new Set(skills.flatMap((s) => s.explored.map((e) => e.toLowerCase())));

export default function Skills() {
  // Read from the foundations up, the way the work is built.
  const layers = [thinkingLayer, ...[...toolkitStack].reverse()];
  return (
    <div className="wrap page skills-page">
      <PageHead folio="Skills, p. 29" title="Tools and capabilities, and where each was applied." dek="How I think first, then the tools, from the foundations up, with where each one was used." />

      <section className="sk-glance" aria-labelledby="cloud-title">
        <div className="sk-glance-copy">
          <h2 className="sec-title" id="cloud-title">
            What I use most
          </h2>
          <Robot say="Tap me, or any skill, to ask about it." />
        </div>
        <SkillCloud />
      </section>

      <section className="sk-section" aria-labelledby="stack-title">
        <div className="sk-head">
          <h2 className="sec-title" id="stack-title">
            Thinking first, then the tools
          </h2>
        </div>
        <ol className="sk-layers">
          {layers.map((l, i) => (
            <li key={l.layer} className="sk-layer">
              <div className="sk-layer-name">
                <h3>{l.layer}</h3>
                <p className="sk-q">{l.q}</p>
                <p className="sk-a">{l.a}</p>
              </div>
              <ul className="sk-tools">
                {l.tools.map((t) => (
                  <li key={t} className={explored.has(t.toLowerCase()) ? "is-explored" : undefined}>
                    <SkillIcon name={t} />
                    {t}
                    {explored.has(t.toLowerCase()) ? <span className="sr-only"> (explored)</span> : null}
                  </li>
                ))}
              </ul>
              <span className="sk-where">{l.where}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="sk-section" aria-labelledby="aic-title">
        <div className="sk-head">
          <h2 className="sec-title" id="aic-title">
            AI competencies
          </h2>
        </div>
        <ol className="sk-ai">
          {aiCompetencies.map((c, i) => (
            <li key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sk-section" aria-labelledby="cap-title">
        <div className="sk-head">
          <h2 className="sec-title" id="cap-title">
            Capabilities, and where they show up
          </h2>
        </div>
        <ul className="leaders leaders-wide">
          {site.about.skills.map((r) => (
            <li key={r.capability}>
              <span className="leaders-name">
                <b>{r.capability}:</b> <span className="muted">{r.tools}</span>
              </span>
              <span className="leaders-dots" aria-hidden="true" />
              <span className="leaders-where">{r.where}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
