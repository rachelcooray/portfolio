import { Section } from "@/components/Section";
import RobotToggle from "@/components/RobotToggle";
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
  skillsKnowledge,
  educationKnowledge,
  membershipsKnowledge,
  volunteeringKnowledge,
  retailExperienceKnowledge,
  footer,
} from "@/content/content";

const currentOctaveRole = octave[0];
const awards = recognition.filter((r) => r.kind === "award");
const press = recognition.filter((r) => r.kind === "press");

export default function Home() {
  return (
    <>
      <RobotToggle />
      <main>
        {/* Nav */}
        <header className="glass sticky top-0 z-30 px-6 py-5 flex items-center justify-between rounded-none border-x-0 border-t-0">
          <span className="font-heading italic text-lg font-semibold">
            {intro.name}
          </span>
          <nav className="hidden xl:flex gap-5 text-sm text-text-muted overflow-x-auto">
            <a href="#research" className="hover:text-accent whitespace-nowrap">Research</a>
            <a href="#education" className="hover:text-accent whitespace-nowrap">Education</a>
            <a href="#experience" className="hover:text-accent whitespace-nowrap">Experience</a>
            <a href="#projects" className="hover:text-accent whitespace-nowrap">Projects</a>
            <a href="#skills" className="hover:text-accent whitespace-nowrap">Skills</a>
            <a href="#teaching" className="hover:text-accent whitespace-nowrap">Teaching</a>
            <a href="#volunteer" className="hover:text-accent whitespace-nowrap">Volunteer</a>
            <a href="#perspective" className="hover:text-accent whitespace-nowrap">Perspective</a>
            <a href="#achievements" className="hover:text-accent whitespace-nowrap">Achievements</a>
            <a href="#news" className="hover:text-accent whitespace-nowrap">In The News</a>
            <a href="#contact" className="hover:text-accent whitespace-nowrap">Contact</a>
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
            <div key={r.id} data-guide-id={r.id} className="mb-6 last:mb-0">
              <h3 className="font-semibold text-[17px] mb-1">{r.title}</h3>
              <p className="text-sm text-accent mb-2">{r.venue}</p>
              <p className="text-[15px] text-text-muted">{r.highlight}</p>
            </div>
          ))}
        </Section>

        {/* Education */}
        <Section id="education" title="Education">
          <div className="flex flex-col gap-6">
            {educationKnowledge.map((e) => (
              <div key={e.id} data-guide-id={e.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-[16px]">{e.title}</h3>
                  <span className="text-sm text-text-faint whitespace-nowrap">
                    {e.dateRange}
                  </span>
                </div>
                <p className="text-sm text-accent mb-1">{e.institution}</p>
                <p className="text-sm text-text-muted mb-2">{e.summary}</p>
                <ul className="list-disc list-inside text-[14px] text-text-muted space-y-1">
                  {e.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section id="experience" title="Experience" surface>
          <div className="flex items-center gap-3 mb-4">
            {octave[0]?.logo && (
              <img src={octave[0].logo} alt="" className="h-8 w-auto max-w-[88px] object-contain rounded bg-surface-alt border border-divider px-1.5 py-1" />
            )}
            <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide">
              OCTAVE &mdash; John Keells Group
            </h3>
          </div>
          <div className="flex flex-col gap-6 mb-8">
            {octave.map((role) => {
              const details = role.details.filter((d) => !d.startsWith("[PLACEHOLDER"));
              return (
                <div key={role.id} data-guide-id={role.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-semibold text-[16px]">{role.title}</h4>
                    <span className="text-sm text-text-faint whitespace-nowrap">
                      {role.dateRange}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mb-1">{role.location}</p>
                  {details.length > 0 && (
                    <ul className="list-disc list-inside text-[14px] text-text-muted space-y-1">
                      {details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-4">
            {layer1.logo && (
              <img src={layer1.logo} alt="" className="h-8 w-auto max-w-[88px] object-contain rounded bg-surface-alt border border-divider px-1.5 py-1" />
            )}
            <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide">
              Layer1 Studio
            </h3>
          </div>
          <div className="mb-8" data-guide-id={layer1.id}>
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-semibold text-[16px]">{layer1.title}</h4>
              <span className="text-sm text-text-faint whitespace-nowrap">
                {layer1.dateRange}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-3">{layer1.location}</p>
            <ul className="list-disc list-inside text-[14px] text-text-muted space-y-1 mb-4">
              {layer1.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <div className="flex gap-8 mb-4">
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] text-text-muted">
              {layer1.clientCategories.map((c) => (
                <div key={c}>{c}</div>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-4">
            Other experience
          </h3>
          <div className="flex flex-col gap-4">
            {retailExperienceKnowledge.map((role) => (
              <div key={role.id} className="flex gap-3">
                {role.logo && (
                  <img src={role.logo} alt="" className="h-8 w-auto max-w-[72px] object-contain rounded bg-surface-alt border border-divider px-1 py-1 shrink-0" />
                )}
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="font-semibold text-[15px]">{role.title}</h4>
                    <span className="text-sm text-text-faint whitespace-nowrap">
                      {role.dateRange}
                    </span>
                  </div>
                  <p className="text-sm text-accent mb-1">{role.company}</p>
                  <p className="text-[14px] text-text-muted">{role.details[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Projects — all of them */}
        <Section id="projects" title="Projects">
          <div className="grid sm:grid-cols-2 gap-8">
            {projects
              .filter((p) => !p.description.startsWith("[PLACEHOLDER"))
              .map((p) => (
              <div key={p.id} data-guide-id={p.id} className="group">
                {p.image && (
                  <div className="overflow-hidden rounded-xl mb-4 border border-divider">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
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

        {/* Skills */}
        <Section id="skills" title="Skills" surface>
          <div className="flex flex-col gap-5">
            {skillsKnowledge.map((s) => (
              <div key={s.category}>
                <h3 className="font-semibold text-[15px] mb-2">{s.category}</h3>
                <p className="text-[15px] text-text-muted">{s.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Teaching & Mentoring */}
        <Section id="teaching" title="Teaching & Mentoring">
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

        {/* Volunteer */}
        <Section id="volunteer" title="Volunteer" surface>
          <div className="flex flex-col gap-5 mb-8">
            {volunteeringKnowledge.map((v) => (
              <div key={v.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-[15px]">{v.title}</h3>
                  <span className="text-sm text-text-faint whitespace-nowrap">
                    {v.dateRange}
                  </span>
                </div>
                <p className="text-sm text-accent mb-1">{v.organization}</p>
                <p className="text-[14px] text-text-muted">{v.details[0]}</p>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Memberships
          </h3>
          <p className="text-[15px] text-text-muted">{membershipsKnowledge.join(" · ")}</p>
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

        {/* Achievements */}
        <Section id="achievements" title="Achievements" surface>
          <div className="flex flex-col gap-5">
            {awards.map((r) => (
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

        {/* In The News */}
        <Section id="news" title="In The News">
          <div className="grid sm:grid-cols-2 gap-8">
            {press.map((r) => (
              <div key={r.id} data-guide-id={r.id} className="group">
                {r.image && (
                  <div className="overflow-hidden rounded-xl mb-4 border border-divider">
                    <img
                      src={r.image}
                      alt={r.title}
                      className={`w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105 ${
                        r.id === "recognition-lmd-youth-forum" ? "object-top" : ""
                      }`}
                    />
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-[15px]">{r.title}</h3>
                  <span className="text-sm text-text-faint whitespace-nowrap">
                    {r.year}
                  </span>
                </div>
                <p className="text-sm text-accent mb-1">{r.organization}</p>
                <p className="text-sm text-text-muted mb-2">{r.summary}</p>
                {r.link && (
                  <a href={r.link} className="text-sm text-accent hover:text-accent-hover">
                    Read more &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Ask about Rachel — placeholder, wired up in Milestone 6 */}
        <Section id="ask" title="Ask about Rachel" surface>
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
        <Section id="contact" title="Get in touch">
          <div className="flex items-center gap-4">
            {/* Cropped from a Sri Lankan-motif sheet via CSS background
                positioning (palm/moon corner ornament) — a nod to Colombo. */}
            <div
              aria-hidden="true"
              className="w-16 h-16 shrink-0 rounded-full opacity-80"
              style={{
                backgroundImage: "url(/images/sl-motifs.png)",
                backgroundSize: "702px 468px",
                backgroundPosition: "-562px -329px",
              }}
            />
            <a
              href={`mailto:${footer.email}`}
              className="text-accent hover:text-accent-hover"
            >
              {footer.email}
            </a>
          </div>
        </Section>

        {/* Footer */}
        <footer className="px-6 py-10 text-sm text-text-faint border-t border-divider">
          {!footer.fictionLine.link.startsWith("[PLACEHOLDER") && (
            <p className="mb-2">
              {footer.fictionLine.text}{" "}
              <a href={footer.fictionLine.link} className="underline">
                [link]
              </a>
            </p>
          )}
          <p>
            {footer.robotCredit.text}
            {!footer.robotCredit.link.startsWith("[PLACEHOLDER") && (
              <>
                {", "}
                <a href={footer.robotCredit.link} className="underline">
                  Sketchfab
                </a>
              </>
            )}
          </p>
        </footer>
      </main>
    </>
  );
}
