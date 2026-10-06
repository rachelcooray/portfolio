import { Section } from "@/components/Section";
import RobotLoader from "@/components/RobotLoader";
import {
  intro,
  research,
  octave,
  layer1,
  projects,
  teachingIntro,
  teaching,
  perspective,
  recognition,
  footer,
} from "@/content/content";

const currentOctaveRole = octave[0];

export default function Home() {
  return (
    <div className="flex">
      {/* Content column */}
      <main className="flex-1 lg:max-w-[calc(100%-320px)]">
        {/* Nav */}
        <header className="px-6 py-5 flex items-center justify-between border-b border-divider">
          <span className="font-heading italic text-lg font-semibold">
            {intro.name}
          </span>
          <nav className="hidden md:flex gap-6 text-sm text-text-muted">
            <a href="#research" className="hover:text-accent">Research</a>
            <a href="#octave" className="hover:text-accent">OCTAVE</a>
            <a href="#layer1" className="hover:text-accent">Layer1</a>
            <a href="#projects" className="hover:text-accent">Projects</a>
            <a href="#teaching" className="hover:text-accent">Teaching</a>
            <a href="#perspective" className="hover:text-accent">Perspective</a>
            <a href="#recognition" className="hover:text-accent">Recognition</a>
            <a href="#contact" className="hover:text-accent">Contact</a>
          </nav>
        </header>

        {/* Hero / intro */}
        <Section id="intro">
          <img
            src={intro.photo}
            alt={intro.name}
            className="w-28 h-28 rounded-full object-cover mb-6"
          />
          <h1 className="font-heading italic text-[40px] md:text-[52px] font-semibold leading-[1.05] mb-4">
            {intro.name}
          </h1>
          <p className="text-xl text-accent font-medium mb-5">{intro.tagline}</p>
          <p className="text-[17px] leading-relaxed text-text-muted max-w-[56ch] mb-6">
            {intro.bio}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {intro.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 rounded-full border border-divider hover:border-accent hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </Section>

        {/* Research */}
        <Section id="research" title="Research" surface>
          {research.map((r) => (
            <div key={r.id} className="mb-6 last:mb-0">
              <h3 className="font-semibold text-[17px] mb-1">{r.title}</h3>
              <p className="text-sm text-accent mb-2">{r.venue}</p>
              <p className="text-[15px] text-text-muted">{r.highlight}</p>
            </div>
          ))}
        </Section>

        {/* OCTAVE */}
        <Section id="octave" title="OCTAVE">
          <div className="mb-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-semibold text-[17px]">{currentOctaveRole.title}</h3>
              <span className="text-sm text-text-faint whitespace-nowrap">
                {currentOctaveRole.dateRange}
              </span>
            </div>
            <p className="text-sm text-accent mb-2">{currentOctaveRole.company}</p>
            {currentOctaveRole.details.map((d, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-relaxed">
                {d}
              </p>
            ))}
          </div>
          <p className="text-sm text-text-faint">
            Earlier roles with the same team: Analytics Delivery Associate (2026),
            Data Science &amp; Analytics Delivery Intern (2025&ndash;26), and two
            earlier internships (2022, 2023).
          </p>
        </Section>

        {/* Layer1 Studio */}
        <Section id="layer1" title="Layer1 Studio" surface>
          <p className="text-sm text-accent mb-1">{layer1.title}</p>
          <p className="text-sm text-text-faint mb-4">{layer1.dateRange}</p>
          <p className="text-[15px] text-text-muted leading-relaxed mb-5">
            {layer1.details[0]}
          </p>
          <div className="flex gap-8 mb-5">
            <div>
              <div className="font-heading italic text-2xl font-semibold">
                {layer1.stats.clients}
              </div>
              <div className="text-sm text-text-faint">clients</div>
            </div>
            <div>
              <div className="font-heading italic text-2xl font-semibold">
                {layer1.stats.projects}
              </div>
              <div className="text-sm text-text-faint">projects delivered</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-text-muted">
            {layer1.clientCategories.map((c) => (
              <div key={c}>{c}</div>
            ))}
          </div>
        </Section>

        {/* Projects */}
        <Section id="projects" title="Projects">
          <div className="flex flex-col gap-8">
            {projects
              .filter((p) => p.inTour)
              .map((p) => (
                <div key={p.id} data-guide-id={p.id}>
                  <h3 className="font-semibold text-[17px] mb-1">{p.title}</h3>
                  <p className="text-sm text-accent mb-2">{p.role}</p>
                  <p className="text-[15px] text-text-muted leading-relaxed mb-2">
                    {p.description}
                  </p>
                  {p.tech.length > 0 && (
                    <p className="text-sm text-text-faint mb-2">
                      {p.tech.join(" · ")}
                    </p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      className="text-sm text-accent hover:text-accent-hover"
                    >
                      View project &rarr;
                    </a>
                  )}
                </div>
              ))}
          </div>
        </Section>

        {/* Teaching & Mentoring */}
        <Section id="teaching" title="Teaching & Mentoring" surface>
          <p className="text-[15px] text-text-muted leading-relaxed mb-6">
            {teachingIntro}
          </p>
          <div className="flex flex-col gap-5">
            {teaching.map((t) => (
              <div key={t.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-[15px]">{t.title}</h3>
                  <span className="text-sm text-text-faint whitespace-nowrap">
                    {t.dateRange}
                  </span>
                </div>
                <p className="text-sm text-accent">{t.institution}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Perspective */}
        <Section id="perspective" title={perspective.title}>
          <div className="flex flex-col gap-4">
            {perspective.paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </Section>

        {/* Recognition */}
        <Section id="recognition" title="Recognition" surface>
          <div className="flex flex-col gap-5">
            {recognition.map((r) => (
              <div key={r.id} data-guide-id={r.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-[15px]">{r.title}</h3>
                  <span className="text-sm text-text-faint whitespace-nowrap">
                    {r.year}
                  </span>
                </div>
                <p className="text-sm text-accent mb-1">{r.organization}</p>
                <p className="text-sm text-text-muted">{r.summary}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Ask about Rachel — placeholder, wired up in Milestone 6 */}
        <Section id="ask" title="Ask about Rachel">
          <p className="text-sm text-text-faint mb-4">
            Answers grounded in a curated knowledge base.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              "What was her research about?",
              "What does she do at OCTAVE?",
              "What has Layer1 built?",
            ].map((q) => (
              <button
                key={q}
                disabled
                className="px-4 py-2 rounded-full border border-divider text-sm text-text-faint cursor-not-allowed"
                title="Coming in Milestone 6"
              >
                {q}
              </button>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" title="Get in touch" surface>
          <a
            href={`mailto:${footer.email}`}
            className="text-accent hover:text-accent-hover"
          >
            {footer.email}
          </a>
        </Section>

        {/* Footer */}
        <footer className="px-6 py-10 text-sm text-text-faint border-t border-divider">
          <p className="mb-2">
            {footer.fictionLine.text}{" "}
            <a href={footer.fictionLine.link} className="underline">
              [link]
            </a>
          </p>
          <p>
            {footer.robotCredit.text}
            {", "}
            <a href={footer.robotCredit.link} className="underline">
              Sketchfab
            </a>
          </p>
        </footer>
      </main>

      {/* Robot column */}
      <aside className="hidden lg:block w-[320px] shrink-0 border-l border-divider sticky top-0 h-screen">
        <RobotLoader />
      </aside>
    </div>
  );
}
