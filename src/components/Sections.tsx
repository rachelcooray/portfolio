"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  sections,
  identity,
  research,
  education,
  octave,
  layer1,
  londonSuccessAcademy,
  otherRoles,
  projects,
  skills,
  teaching,
  volunteer,
  perspective,
  achievements,
  press,
  contact,
  type SectionId,
  type Role,
} from "@/content/content";
import { ask, excerpt, goToSection, openAsk, startTour } from "@/lib/ask";
import ReduceMotionToggle from "@/components/ReduceMotionToggle";

// A row of cells that resolves into the heading as the section arrives.
const CELL_DELAYS = (() => {
  let s = 3;
  return Array.from({ length: 48 }, () => {
    s = (s * 9301 + 49297) % 233280;
    return Math.round((s / 233280) * 600);
  });
})();

function Cells() {
  return (
    <span className="cells" aria-hidden="true">
      {CELL_DELAYS.map((d, i) => (
        <i key={i} style={{ ["--d" as string]: `${d}ms` }} />
      ))}
    </span>
  );
}

function Sec({
  id,
  tone = "plain",
  children,
  title,
}: {
  id: SectionId;
  tone?: "plain" | "alt" | "ink";
  title: string;
  children: ReactNode;
}) {
  const s = sections.find((x) => x.id === id)!;
  return (
    <section id={id} className={`sec ${tone}`} data-reveal aria-labelledby={`${id}-title`}>
      <div className="sec-head">
        <p className="sec-num">
          {s.number} {s.label}
        </p>
        <h2 id={`${id}-title`}>
          <Cells />
          <span className="h2-text">{title}</span>
        </h2>
        <span className="hairline" aria-hidden="true" />
      </div>
      <div className="sec-body">{children}</div>
    </section>
  );
}

function RoleEntry({ r }: { r: Role }) {
  return (
    <article className="entry" data-passage={r.id}>
      <div className="row">
        <h3>{r.title}</h3>
        <span className="when">{r.dateRange}</span>
      </div>
      <p className="where">
        {r.company}, {r.location}
      </p>
      {r.details.length > 0 && (
        <ul>
          {r.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

// Pilot against control, drawn as hairlines with no numbers on purpose.
function PilotChart() {
  return (
    <svg className="pilot" viewBox="0 0 240 130" aria-hidden="true" focusable="false">
      <line x1="0" y1="118" x2="240" y2="118" className="axis" />
      <line x1="0" y1="78" x2="240" y2="78" className="grid" />
      <line x1="0" y1="38" x2="240" y2="38" className="grid" />
      <line x1="120" y1="8" x2="120" y2="118" className="grid dash" />
      <polyline points="0,104 40,100 80,99 120,96 160,74 200,62 240,48" className="series pilot-line" />
      <polyline points="0,106 40,103 80,104 120,100 160,98 200,96 240,95" className="series control-line" />
      <text x="196" y="40" className="lbl">
        pilot
      </text>
      <text x="190" y="90" className="lbl muted">
        control
      </text>
      <text x="124" y="18" className="lbl muted">
        start
      </text>
    </svg>
  );
}

function InlineAsk() {
  const [q, setQ] = useState("");
  const res = useMemo(() => ask(q), [q]);
  return (
    <div className="ask-inline">
      <p className="intro">
        Type a question or a topic. The answer is quoted from this page and nothing beyond it. You can also press{" "}
        <kbd>/</kbd> anywhere to open the command bar.
      </p>
      <form
        className="ask-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const hit = res.sections[0];
          if (hit) goToSection(hit.section, hit.passage.id);
        }}
      >
        <label htmlFor="ask-inline-input" className="sr-only">
          Your question
        </label>
        <input
          id="ask-inline-input"
          type="text"
          placeholder="What does she do at OCTAVE?"
          autoComplete="off"
          maxLength={160}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn" type="submit">
          Go
        </button>
      </form>
      <div className="chips">
        {["What was her research about?", "How does she measure impact?", "What has Layer1 built?"].map((c) => (
          <button key={c} type="button" className="chip" onClick={() => setQ(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="ask-inline-out" aria-live="polite">
        {q.trim() && res.answer && (
          <>
            <p className="answer">{excerpt(res.answer.text)}</p>
            <ul className="ask-inline-links">
              {res.sections.map((h) => (
                <li key={h.section}>
                  <a
                    href={`#${h.section}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToSection(h.section, h.passage.id);
                    }}
                  >
                    <span className="num">{h.number}</span> {h.label}: {h.passage.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        {q.trim() && !res.answer && <p className="answer muted">Nothing on this page matches that yet.</p>}
      </div>
      <div className="ask-inline-actions">
        <button type="button" className="btn ghost" onClick={() => openAsk(q)}>
          Open the command bar
        </button>
        <button type="button" className="btn ghost" onClick={() => startTour()}>
          Walk me through
        </button>
      </div>
    </div>
  );
}

export default function Sections() {
  // Reveal sections as they arrive. Content is visible without JS.
  useEffect(() => {
    const root = document.documentElement;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (root.classList.contains("rm") || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    root.classList.add("reveal-on");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const featured = projects.filter((p) => p.featured);
  const more = projects.filter((p) => !p.featured);

  return (
    <div id="main" className="archive">
      <Sec id="research" title="Research" tone="plain">
        <p className="intro">{research.intro}</p>
        <article className="entry feature" data-passage="research-paper">
          <div className="row">
            <h3>{research.paper.title}</h3>
            <span className="when">{research.paper.year}</span>
          </div>
          <p className="where">{research.paper.authors}</p>
          <p className="where">
            {research.paper.venue} · <a href={research.paper.doiUrl}>DOI {research.paper.doi}</a> ·{" "}
            <a href={research.paper.appUrl}>Try the app</a>
          </p>
          <p>{research.paper.description}</p>
          <ul>
            <li>{research.paper.award}</li>
            <li>{research.paper.journal}</li>
          </ul>
          <Link className="textlink" href="/case-studies/pcos-care">
            Read the case study
          </Link>
        </article>
        <h3 className="subhead">Talks and knowledge sharing</h3>
        <p className="muted">{research.talksIntro}</p>
        <ul className="plain-list">
          {research.talks.map((t, i) => (
            <li key={i} data-passage={`talk-${i}`}>
              {t}
            </li>
          ))}
        </ul>
      </Sec>

      <Sec id="education" title="Education" tone="alt">
        {education.map((e) => (
          <article key={e.id} className="entry" data-passage={e.id}>
            <div className="row">
              <h3>{e.title}</h3>
              <span className="when">{e.dateRange}</span>
            </div>
            <p className="where">{e.institution}</p>
            <p>{e.summary}</p>
          </article>
        ))}
      </Sec>

      <Sec id="experience" title="Experience" tone="plain">
        <div className="org">
          <img src={octave.logo} alt="" width={44} height={44} />
          <div>
            <h3 className="org-name">{octave.company}</h3>
            <p className="org-meta">{octave.meta}</p>
          </div>
        </div>
        <p className="lead-para" data-passage="octave-own">
          {octave.own}
        </p>

        <div className="measure" data-passage="octave-measuring">
          <div>
            <p className="kicker accent">{octave.measuring.title}</p>
            <p>{octave.measuring.body}</p>
          </div>
          <PilotChart />
        </div>

        <div className="practice">
          {octave.practice.map((p, i) => (
            <div key={p.title} data-passage={`octave-practice-${i}`}>
              <p className="kicker">{p.title}</p>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
        <p className="tools" data-passage="octave-tools">
          Tools: {octave.tools.join(", ")}
        </p>

        <div className="roles">
          {octave.roles.map((r) => (
            <RoleEntry key={r.id} r={r} />
          ))}
          <details className="earlier">
            <summary>Earlier internships at OCTAVE, 2022 and 2023</summary>
            {octave.earlier.map((r) => (
              <RoleEntry key={r.id} r={r} />
            ))}
          </details>
          <Link className="textlink" href="/case-studies/octave">
            Read the case study
          </Link>
        </div>

        <div className="org">
          <img src={layer1.logo} alt="" width={44} height={44} />
          <div>
            <h3 className="org-name">{layer1.company}</h3>
            <p className="org-meta">
              {layer1.title}, {layer1.dateRange}, {layer1.location}
            </p>
          </div>
        </div>
        <div className="roles" data-passage={layer1.id}>
          <p>{layer1.description}</p>
          <ul className="bullets">
            {layer1.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <p className="muted">Built for: {layer1.builtFor.join(" · ")}</p>
          <Link className="textlink" href="/case-studies/layer1">
            Read the case study
          </Link>
        </div>

        <div className="roles">
          <RoleEntry r={londonSuccessAcademy} />
        </div>

        <h3 className="subhead">Other experience</h3>
        <p className="muted">Customer-facing and support roles while studying in the UK.</p>
        <div className="other-roles">
          {otherRoles.map((r) => (
            <div key={r.id} className="other" data-passage={r.id}>
              {r.logo ? <img src={r.logo} alt="" width={56} height={28} /> : <span className="logo-blank" />}
              <div>
                <p className="other-title">
                  {r.title}, {r.company}
                </p>
                <p className="when">{r.dateRange}</p>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="projects" title="Projects" tone="alt">
        <div className="proj-grid">
          {featured.map((p) => (
            <article key={p.id} className="proj-card" data-passage={p.id}>
              {p.image ? (
                <img src={p.image} alt={p.imageAlt ?? ""} width={640} height={360} loading="lazy" />
              ) : (
                <div className="proj-motif" aria-hidden="true">
                  {Array.from({ length: 40 }, (_, i) => (
                    <i key={i} className={i % 7 === 0 || i % 11 === 3 ? "on" : ""} />
                  ))}
                </div>
              )}
              <div className="proj-text">
                <h3>{p.title}</h3>
                <p className="where">{p.role}</p>
                <p>{p.description}</p>
                <p className="tools">{p.tech.join(", ")}</p>
                {p.link && (
                  <a className="textlink" href={p.link}>
                    View project
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <h3 className="subhead">More projects</h3>
        <div className="more-grid">
          {more.map((p) => (
            <article key={p.id} className="entry compact" data-passage={p.id}>
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
      </Sec>

      <Sec id="skills" title="Skills" tone="plain">
        <div className="skills-grid">
          {skills.map((s) => (
            <div key={s.category} className="skill-col" data-passage={`skills-${s.category}`}>
              <h3>{s.category}</h3>
              <ul>
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="teaching" title="Teaching" tone="alt">
        <p className="lead-para" data-passage="teaching-intro">
          {teaching.intro}
        </p>
        {teaching.roles.map((t) => (
          <article key={t.id} className="entry" data-passage={t.id}>
            <div className="row">
              <h3>{t.title}</h3>
              <span className="when">{t.dateRange}</span>
            </div>
            <p className="where">{t.institution}</p>
            <p>{t.summary}</p>
          </article>
        ))}
      </Sec>

      <Sec id="volunteer" title="Volunteer" tone="plain">
        <p data-passage="volunteer-summary">{volunteer.summary}</p>
        <div className="vol-list">
          {volunteer.items.map((v) => (
            <div key={v.id} className="vol">
              <p className="when">{v.dateRange}</p>
              <p className="other-title">{v.title}</p>
              <p className="muted">{v.summary}</p>
            </div>
          ))}
        </div>
        <h3 className="subhead">Swimming</h3>
        <p data-passage="swimming">{volunteer.swimming}</p>
        <h3 className="subhead">Outside work</h3>
        <p data-passage="hobbies">{volunteer.hobbies.join(" · ")}</p>
        <h3 className="subhead">Memberships</h3>
        <p data-passage="memberships">{volunteer.memberships.join(", ")}.</p>
      </Sec>

      <Sec id="perspective" title={perspective.title} tone="ink">
        <div className="persp">
          <figure className="persp-photo">
            <img src={perspective.photo} alt={perspective.photoAlt} width={960} height={1200} loading="lazy" />
          </figure>
          <div className="essay" data-passage="perspective">
            {perspective.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Sec>

      <Sec id="achievements" title="Achievements" tone="alt">
        {achievements.map((a) => (
          <article key={a.id} className="entry" data-passage={a.id}>
            <div className="row">
              <h3>{a.title}</h3>
              <span className="when">{a.year}</span>
            </div>
            <p className="where">{a.organization}</p>
            <p>{a.summary}</p>
          </article>
        ))}
      </Sec>

      <Sec id="news" title="In the news" tone="plain">
        <div className="news-grid">
          {press.map((n) => (
            <article key={n.id} className="news-card" data-passage={n.id}>
              {n.image && <img src={n.image} alt={n.imageAlt ?? ""} width={480} height={270} loading="lazy" />}
              <p className="when">
                {n.organization}, {n.year}
              </p>
              <h3>{n.title}</h3>
              <p>{n.summary}</p>
              {n.link && (
                <a className="textlink" href={n.link} target="_blank" rel="noopener noreferrer">
                  Read more
                  <span className="sr-only"> about {n.title} (opens in a new tab)</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </Sec>

      <Sec id="ask" title="Ask about Rachel" tone="alt">
        <InlineAsk />
      </Sec>

      <section id="contact" className="sec ink contact" data-reveal aria-labelledby="contact-title">
        <div className="sec-head">
          <p className="sec-num">13 Contact</p>
        </div>
        <div className="sec-body">
          <h2 id="contact-title" className="contact-title">
            {contact.headline}
          </h2>
          <a className="email" href={`mailto:${identity.email}`} data-passage="contact">
            {identity.email}
          </a>
          <div className="links">
            {identity.links
              .filter((l) => l.label !== "Email")
              .map((l) => (
                <a key={l.label} href={l.href} target={l.href.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">
                  {l.label === "CV" ? "Download CV (PDF)" : l.label}
                  {!l.href.startsWith("/") && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              ))}
          </div>
          <p className="fine">{contact.intro}</p>
          <div className="foot">
            <span>
              {identity.location} · © {identity.copyright}
            </span>
            <ReduceMotionToggle />
          </div>
        </div>
      </section>
    </div>
  );
}
