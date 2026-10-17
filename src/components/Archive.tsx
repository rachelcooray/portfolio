"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import ReduceMotionToggle from "@/components/ReduceMotionToggle";
import { scrollToTarget } from "@/lib/lenis";
import {
  intro,
  impactStrip,
  research,
  researchPageExtra,
  octaveIntro,
  octaveEarlierSummary,
  octave,
  layer1,
  retailExperienceKnowledge,
  projects,
  talksSectionIntro,
  talks,
  skillsKnowledge,
  educationKnowledge,
  teachingIntro,
  teaching,
  volunteeringSummary,
  swimmingSummary,
  writingSummary,
  hobbies,
  membershipsKnowledge,
  perspective,
  furtherEssays,
  recognition,
  contactIntro,
  footer,
} from "@/content/content";

// Part 2 of the badge design (15 Oct 2026): the plain-HTML content
// archive beneath BadgeHero's three.js scene, carrying every section
// and image that exists on the current (Tailwind/Section-based) page.tsx
// - the prototype's own archive was a trimmed, illustrative version built
// before this content existed. Styled with the .sec/.entry classes from
// badge.css rather than Tailwind utility classes, to match the prototype.

const featuredProjects = projects.filter((p) => p.featured);
const moreProjects = projects.filter((p) => !p.featured);
const awards = recognition.filter((r) => r.kind === "award");
const press = recognition.filter((r) => r.kind === "press");
const octaveRoles = octave.filter((role) => !role.knowledgeOnly);

function navigate(href: string, e: MouseEvent<HTMLAnchorElement>) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToTarget(href);
  history.pushState(null, "", href);
}

export default function Archive() {
  return (
    <main id="archive">
      <section className="sec" style={{ paddingBottom: 48 }}>
        <div />
        <div className="stats" style={{ marginTop: 0 }}>
          {impactStrip.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => navigate(item.href, e)}
              style={{ textDecoration: "none", color: "inherit", maxWidth: 200 }}
            >
              <div className="stat">
                <b style={{ fontSize: 48 }}>{item.figure}</b>
              </div>
              <span style={{ fontSize: 15, color: "var(--muted)" }}>{item.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="sec" id="research">
        <h2>Research</h2>
        <div>
          {research.map((r) => (
            <article key={r.id} className="entry" data-guide-id={r.id}>
              <div className="row">
                <h3>{r.title}</h3>
                <span className="when">{r.year}</span>
              </div>
              {r.authors && <p className="where">{r.authors}</p>}
              <p className="where">
                {r.venue}
                {r.doi && (
                  <>
                    {" · "}
                    <a href={r.doiUrl}>DOI {r.doi}</a>
                  </>
                )}
                {r.appUrl && (
                  <>
                    {" · "}
                    <a href={r.appUrl}>Try the app</a>
                  </>
                )}
              </p>
              <p>{researchPageExtra.description}</p>
              <ul>
                <li>{researchPageExtra.award}</li>
                <li>{researchPageExtra.journalStatus}</li>
              </ul>
              <Link className="textlink" href="/case-studies/pcos-care">
                Read the case study
              </Link>
            </article>
          ))}

          <p className="subhead">Talks and knowledge sharing</p>
          <p style={{ fontSize: 17, lineHeight: 1.65, margin: "0 0 14px", color: "var(--muted)" }}>
            {talksSectionIntro}
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {talks.map((t) => (
              <li
                key={t.id}
                style={{ position: "relative", paddingLeft: 22, fontSize: 17, lineHeight: 1.6, marginTop: 8 }}
              >
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec alt" id="education">
        <h2>Education</h2>
        <div>
          {educationKnowledge.map((e) => (
            <article key={e.id} className="entry">
              <div className="row">
                <h3>{e.title}</h3>
                <span className="when">{e.dateRange}</span>
              </div>
              {e.institution && <p className="where">{e.institution}</p>}
              <p>{e.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec" id="experience">
        <h2>Experience</h2>
        <div>
          <p className="org">
            {octave[0]?.logo && <img src={octave[0].logo} alt="" />}
            OCTAVE, John Keells Holdings
          </p>
          <p className="org-meta">{octaveIntro}</p>
          <div className="roles">
            {octaveRoles.map((role) => {
              const details = role.details.filter((d) => !d.startsWith("[PLACEHOLDER"));
              return (
                <article key={role.id} className="entry" data-guide-id={role.id}>
                  <div className="row">
                    <h3>{role.title}</h3>
                    <span className="when">{role.dateRange}</span>
                  </div>
                  <p className="where">{role.location}</p>
                  {details.length > 0 && (
                    <ul>
                      {details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>
              {octaveEarlierSummary}
            </p>
            <Link className="textlink" href="/case-studies/octave">
              Read the case study
            </Link>
          </div>

          <p className="org">
            {layer1.logo && <img src={layer1.logo} alt="" />}
            Layer1 Studio
          </p>
          <p className="org-meta">Remote. Web and mobile development for SMEs and startups.</p>
          <div className="roles">
            <article className="entry" data-guide-id={layer1.id}>
              <div className="row">
                <h3>{layer1.title}</h3>
                <span className="when">{layer1.dateRange}</span>
              </div>
              <p>{layer1.description}</p>
              <ul>
                {layer1.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
              <div className="stats">
                <div className="stat">
                  <b>{layer1.stats.clients}</b>
                  <span>clients</span>
                </div>
                <div className="stat">
                  <b>{layer1.stats.projects}</b>
                  <span>projects delivered</span>
                </div>
              </div>
              <p>Built for: {layer1.clientCategories.join(" · ")}</p>
              <ul>
                {layer1.examples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
              <Link className="textlink" href="/case-studies/layer1">
                Read the case study
              </Link>
            </article>
          </div>

          <p className="subhead">Other experience</p>
          {retailExperienceKnowledge.map((role) => (
            <article key={role.id} className="entry">
              <div className="row">
                <h3>
                  {role.logo && (
                    <img
                      src={role.logo}
                      alt=""
                      style={{
                        height: 22,
                        width: "auto",
                        maxWidth: 70,
                        objectFit: "contain",
                        borderRadius: 4,
                        background: "var(--paper)",
                        border: "1px solid var(--line)",
                        padding: "2px 4px",
                        marginRight: 10,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {role.title}, {role.company}
                </h3>
                <span className="when">{role.dateRange}</span>
              </div>
              <p className="where">{role.location}</p>
              <p>{role.details[0]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec alt" id="projects-list">
        <h2>Projects</h2>
        <div>
          {featuredProjects.map((p) => (
            <article key={p.id} className="entry" data-guide-id={p.id}>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    marginBottom: 16,
                  }}
                />
              )}
              <h3>{p.title}</h3>
              <p className="where">{p.role}</p>
              <p>{p.description}</p>
              {p.tech.length > 0 && <p className="tools">{p.tech.join(", ")}</p>}
              {p.link && (
                <a className="textlink" href={p.link}>
                  View project
                </a>
              )}
            </article>
          ))}
          {moreProjects.map((p) => (
            <article key={p.id} className="entry">
              <h3>{p.title}</h3>
              <p className="where">{p.role}</p>
              <p>{p.description}</p>
              <p className="tools">{p.tech.join(", ")}</p>
              {p.link && (
                <a className="textlink" href={p.link}>
                  View project
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="sec" id="skills">
        <h2>Skills</h2>
        <div className="skills">
          {skillsKnowledge.map((s) => (
            <div key={s.category}>
              <h3>{s.category}</h3>
              <p>{s.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sec alt" id="teaching">
        <h2>Teaching and mentoring</h2>
        <div>
          <p className="intro">{teachingIntro}</p>
          {teaching.map((t) => (
            <article key={t.id} className="entry">
              <div className="row">
                <h3>{t.title}</h3>
                <span className="when">{t.dateRange}</span>
              </div>
              <p className="where">{t.institution}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec" id="volunteer">
        <h2>Volunteer</h2>
        <div>
          <p>{volunteeringSummary}</p>

          <p className="subhead">Swimming</p>
          <p>{swimmingSummary}</p>

          <p className="subhead">Writing</p>
          <p>
            {writingSummary.text}
            {!writingSummary.link.startsWith("[PLACEHOLDER") && (
              <>
                {" "}
                <a href={writingSummary.link}>Read more</a>
              </>
            )}
          </p>

          <p className="subhead">Outside work</p>
          <p>{hobbies.join(" · ")}</p>

          <p className="subhead">Memberships</p>
          <p style={{ margin: 0 }}>{membershipsKnowledge.join(", ")}.</p>
        </div>
      </section>

      <section className="sec dark" id="ideas" data-tone="dark">
        <h2>{perspective.title}</h2>
        <div className="essay">
          {perspective.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="essays-more">
            <h3>Further essays and working notes</h3>
            {furtherEssays.map((e) => (
              <div key={e.id} className="essay-note">
                <h4>{e.title}</h4>
                <p>{e.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec alt" id="achievements">
        <h2>Achievements</h2>
        <div>
          {awards.map((a) => (
            <article key={a.id} className="entry" data-guide-id={a.id}>
              <div className="row">
                <h3>{a.title}</h3>
                <span className="when">{a.year}</span>
              </div>
              <p className="where">{a.organization}</p>
              <p>{a.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec" id="news">
        <h2>In the news</h2>
        <div>
          {press.map((p) => (
            <article key={p.id} className="entry" data-guide-id={p.id}>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    height: 180,
                    objectFit: "cover",
                    objectPosition: p.id === "recognition-lmd-youth-forum" ? "top" : "center",
                    borderRadius: 12,
                    border: "1px solid var(--line)",
                    marginBottom: 16,
                  }}
                />
              )}
              <div className="row">
                <h3>{p.title}</h3>
                <span className="when">{p.year}</span>
              </div>
              <p className="where">{p.organization}</p>
              <p>{p.summary}</p>
              {p.link && (
                <a className="textlink" href={p.link}>
                  Read more
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <AskSection />

      <section className="contact" id="contact" data-tone="dark">
        <h2 className="serif">Let&rsquo;s build something worth explaining.</h2>
        <a className="email" href={`mailto:${footer.email}`}>
          {footer.email}
        </a>
        <div className="links">
          <a href={intro.links.find((l) => l.label === "LinkedIn")?.href} target="_blank" rel="noopener">
            LinkedIn
          </a>
          <a href={intro.links.find((l) => l.label === "GitHub")?.href} target="_blank" rel="noopener">
            GitHub
          </a>
          <a href={intro.links.find((l) => l.label === "CV")?.href} target="_blank" rel="noopener">
            CV
          </a>
          <a href="https://orcid.org/0009-0009-3192-2669" target="_blank" rel="noopener">
            ORCID
          </a>
          <a href="#top" onClick={(e) => navigate("#top", e)}>
            Back to the badge
          </a>
          <ReduceMotionToggle />
        </div>
        <p className="fine">
          {contactIntro}
          <br />
          Colombo, Sri Lanka · {footer.copyright}
        </p>
      </section>
    </main>
  );
}

function AskSection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setAnswer(
      "The assistant isn't connected yet. Email rachelcooray@gmail.com and she'll answer directly.",
    );
  };

  const chips = [
    "What was her research about?",
    "What does she do at OCTAVE?",
    "What has Layer1 built?",
  ];

  return (
    <section className="sec alt" id="ask">
      <h2>Ask about Rachel</h2>
      <div className="ask-box">
        <p className="intro">Answers grounded in everything on this page, and nothing beyond it.</p>
        <form
          className="ask-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <label htmlFor="askInput" className="sr-only">
            Your question
          </label>
          <input
            id="askInput"
            type="text"
            placeholder="What was her research about?"
            autoComplete="off"
            maxLength={300}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="btn" type="submit">
            Ask
          </button>
        </form>
        <div className="chips">
          {chips.map((q) => (
            <button
              key={q}
              className="btn ghost"
              type="button"
              onClick={() => {
                setQuestion(q);
                ask(q);
              }}
            >
              {q}
            </button>
          ))}
        </div>
        <div className={`answer${answer ? "" : " muted"}`} aria-live="polite">
          {answer}
        </div>
      </div>
    </section>
  );
}
