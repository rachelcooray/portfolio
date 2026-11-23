/* eslint-disable @next/next/no-img-element */
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
    <div className="wrap page">
      <PageHead folio="Skills · 29" title="Tools and capabilities, and where each was applied." dek="How I think first, then the tools, from the foundations up. Each answer comes with what is behind it and where it was used." />
      <section className="cloud-wrap" aria-labelledby="cloud-title">
        <h2 className="sr-only" id="cloud-title">
          Skills at a glance
        </h2>
        <SkillCloud />
        <Robot say="Bigger words are the ones Rachel uses most. Ask me about any of them." />
      </section>

      <section className="aic" aria-labelledby="aic-title">
        <h2 className="sec-title" id="aic-title">
          AI competencies
        </h2>
        <ol className="aic-list">
          {aiCompetencies.map((c, i) => (
            <li key={c.title} style={{ ["--i" as string]: i }}>
              <span className="aic-n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="convo">
        {layers.map((l, i) => (
          <section key={l.layer} className="convo-turn" style={{ ["--t" as string]: i }} aria-labelledby={`q-${i}`}>
            <p className="bubble bubble-q" id={`q-${i}`}>
              <span className="bubble-who">Q.</span>
              {l.q}
            </p>
            <div className="bubble-a-row">
              <img className="bubble-face" src="/images/mag/rachel-face.webp" alt="" width={44} height={44} loading="lazy" />
              <div className="bubble bubble-a">
                <span className="bubble-who">
                  {String(i + 1).padStart(2, "0")} · {l.layer}
                </span>
                <p>{l.a}</p>
                <ul className="leaders">
                  {l.tools.map((t) => (
                    <li key={t}>
                      <SkillIcon name={t} />
                      <span className="leaders-name">{t}</span>
                      <span className="leaders-dots" aria-hidden="true" />
                      <span className="leaders-where">{explored.has(t.toLowerCase()) ? "Explored" : l.where}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section style={{ display: "flex", flexDirection: "column", gap: 16 }} aria-labelledby="cap-title">
        <h2 className="sec-title" id="cap-title">
          Capabilities, and where they show up
        </h2>
        <ul className="leaders leaders-wide">
          {site.about.skills.map((r) => (
            <li key={r.capability}>
              <span className="leaders-name">
                <b>{r.capability}</b> <span className="muted">· {r.tools}</span>
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
