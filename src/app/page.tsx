import { Section } from "@/components/Section";
import FilmGate from "@/components/FilmGate";
import SmoothLink from "@/components/SmoothLink";
import ReduceMotionToggle from "@/components/ReduceMotionToggle";
import { MOTIFS, motifStyle } from "@/components/Motif";
import {
  intro,
  impactStrip,
  researchSectionIntro,
  research,
  researchPageExtra,
  octaveIntro,
  octaveEarlierSummary,
  octave,
  layer1,
  retailExperienceSummary,
  projects,
  talksSectionIntro,
  talks,
  recognition,
  educationKnowledge,
  teachingIntro,
  teaching,
  volunteeringSummary,
  swimmingSummary,
  writingSummary,
  hobbies,
  perspective,
  furtherEssays,
  contactIntro,
  footer,
} from "@/content/content";

const featuredProjects = projects.filter((p) => p.featured);
const moreProjects = projects.filter((p) => !p.featured);
const awards = recognition.filter((r) => r.kind === "award");
const press = recognition.filter((r) => r.kind === "press");

const NAV_ITEMS = [
  { href: "#research", label: "Research" },
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#ideas", label: "Ideas" },
  { href: "#beyond-work", label: "Beyond Work" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  return (
    <FilmGate>
      <main>
        {/* Nav */}
        <header className="glass sticky top-0 z-30 pl-6 pr-20 py-5 flex items-center justify-between rounded-none border-x-0 border-t-0">
          <span className="font-heading italic text-lg font-semibold shrink-0">
            {intro.name}
          </span>
          <nav
            className="flex gap-4 md:gap-5 text-sm text-text-muted overflow-x-auto ml-4"
            style={{ scrollbarWidth: "none" }}
          >
            {NAV_ITEMS.map((item) => (
              <SmoothLink key={item.href} href={item.href} className="hover:text-accent whitespace-nowrap">
                {item.label}
              </SmoothLink>
            ))}
            <ReduceMotionToggle />
          </nav>
        </header>

        {/* Hero / intro */}
        <Section id="intro">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full overflow-hidden"
              style={motifStyle(MOTIFS.wreath, { width: 160 }, "none")}
            />
            <img
              src={intro.photo}
              alt={intro.name}
              className="relative w-28 h-28 rounded-full object-cover"
            />
          </div>
          <h1 className="font-heading italic text-[40px] md:text-[52px] font-semibold leading-[1.05] mb-4">
            {intro.name}
          </h1>
          <p className="text-xl text-accent font-medium mb-5">{intro.tagline}</p>
          <p className="text-[17px] leading-relaxed text-text-muted max-w-[56ch] mb-6">
            {intro.bio}
          </p>
          <ul className="flex flex-col gap-1.5 mb-6 text-[15px] text-text-muted">
            {intro.snapshot.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">&middot;</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
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

        {/* Impact strip */}
        <Section id="impact" surface>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStrip.map((item) => (
              <SmoothLink key={item.label} href={item.href} className="group">
                <div className="font-heading italic text-3xl md:text-4xl font-semibold text-accent group-hover:text-accent-hover transition-colors">
                  {item.figure}
                </div>
                <div className="text-sm text-text-muted mt-1">{item.label}</div>
              </SmoothLink>
            ))}
          </div>
        </Section>

        {/* Ideas */}
        <Section id="ideas" title={perspective.title}>
          <div className="flex flex-col gap-4 mb-12">
            {perspective.paragraphs.map((p, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-4">
            Further essays and working notes
          </h3>
          <div className="flex flex-col gap-5">
            {furtherEssays.map((e) => (
              <div key={e.id}>
                <h4 className="font-semibold text-[15px] mb-1">{e.title}</h4>
                <p className="text-[14px] text-text-muted leading-relaxed">{e.summary}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Research */}
        <Section id="research" title="Research" surface>
          <p className="text-[15px] text-text-muted leading-relaxed mb-8">{researchSectionIntro}</p>
          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-4">
            Published
          </h3>
          {research.map((r) => (
            <div key={r.id} data-guide-id={r.id} className="mb-6 last:mb-0">
              <h4 className="font-semibold text-[17px] mb-1">{r.title}</h4>
              {r.authors && <p className="text-sm text-text-muted mb-1">{r.authors}</p>}
              <p className="text-sm text-accent mb-3">
                {r.venue}
                {r.doi && (
                  <>
                    {" · "}
                    <a href={r.doiUrl} className="hover:text-accent-hover">
                      DOI {r.doi}
                    </a>
                  </>
                )}
                {r.appUrl && (
                  <>
                    {" · "}
                    <a href={r.appUrl} className="hover:text-accent-hover">
                      Try the app
                    </a>
                  </>
                )}
              </p>
              <p className="text-[15px] text-text-muted leading-relaxed mb-3">
                {researchPageExtra.description}
              </p>
              <ul className="list-disc list-inside text-[14px] text-text-muted space-y-1">
                <li>{researchPageExtra.award}</li>
                <li>{researchPageExtra.journalStatus}</li>
              </ul>
            </div>
          ))}
        </Section>

        {/* Work */}
        <Section id="work" title="Work">
          <div className="flex items-center gap-3 mb-2">
            {octave[0]?.logo && (
              <img src={octave[0].logo} alt="" className="h-8 w-auto max-w-[88px] object-contain rounded bg-surface-alt border border-divider px-1.5 py-1" />
            )}
            <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide">
              OCTAVE, John Keells Holdings
            </h3>
          </div>
          <p className="text-sm text-text-muted mb-4">{octaveIntro}</p>
          <div className="flex flex-col gap-6 mb-4">
            {octave
              .filter((role) => !role.knowledgeOnly)
              .map((role) => {
                const details = role.details.filter((d) => !d.startsWith("[PLACEHOLDER"));
                return (
                  <div key={role.id} data-guide-id={role.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h4 className="font-semibold text-[16px]">{role.title}</h4>
                      <span className="text-sm text-text-faint whitespace-nowrap">
                        {role.dateRange}
                      </span>
                    </div>
                    {details.length > 0 && (
                      <ul className="list-disc list-inside text-[14px] text-text-muted space-y-1 mt-1">
                        {details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
          </div>
          <p className="text-[14px] text-text-muted mb-10">{octaveEarlierSummary}</p>

          <div className="flex items-center gap-3 mb-4">
            {layer1.logo && (
              <img src={layer1.logo} alt="" className="h-8 w-auto max-w-[88px] object-contain rounded bg-surface-alt border border-divider px-1.5 py-1" />
            )}
            <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide">
              Layer1 Studio
            </h3>
          </div>
          <div className="mb-10" data-guide-id={layer1.id}>
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h4 className="font-semibold text-[16px]">{layer1.title}</h4>
              <span className="text-sm text-text-faint whitespace-nowrap">
                {layer1.dateRange}
              </span>
            </div>
            <p className="text-sm text-text-muted mb-3">{layer1.location}</p>
            <p className="text-[15px] text-text-muted leading-relaxed mb-4">{layer1.description}</p>
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
            <p className="text-[14px] text-text-muted mb-4">
              Clients include: {layer1.clientCategories.join(" · ")}
            </p>
            <h4 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-2">
              Examples
            </h4>
            <ul className="list-disc list-inside text-[14px] text-text-muted space-y-1">
              {layer1.examples.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-2">
            Earlier experience
          </h3>
          <p className="text-[14px] text-text-muted">{retailExperienceSummary}</p>
        </Section>

        {/* Projects */}
        <Section id="projects" title="Projects" surface>
          <p className="text-[15px] text-text-muted leading-relaxed mb-8">
            Things I have built, each one designed around the person who has to use the result.
          </p>
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            {featuredProjects.map((p) => (
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

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-4">
            More projects
          </h3>
          <ul className="flex flex-col gap-4">
            {moreProjects.map((p) => (
              <li key={p.id}>
                <span className="font-semibold text-[15px]">{p.title}</span>
                <span className="text-[14px] text-text-muted">: {p.description}</span>
                {p.link && (
                  <>
                    {" "}
                    <a href={p.link} className="text-sm text-accent hover:text-accent-hover whitespace-nowrap">
                      View project &rarr;
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Section>

        {/* Talks and knowledge sharing */}
        <Section id="talks" title="Talks and knowledge sharing">
          <p className="text-[15px] text-text-muted leading-relaxed mb-6">{talksSectionIntro}</p>
          <ul className="flex flex-col gap-3 text-[15px] text-text-muted">
            {talks.map((t) => (
              <li key={t.id} className="flex gap-2">
                <span className="text-accent">&middot;</span>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Recognition */}
        <Section id="recognition" title="Recognition" surface>
          <div className="flex flex-col gap-5 mb-10">
            {awards.map((r) => (
              <div key={r.id} data-guide-id={r.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-semibold text-[15px]">{r.title}</h3>
                  <span className="text-sm text-text-faint whitespace-nowrap">{r.year}</span>
                </div>
                <p className="text-sm text-accent mb-1">{r.organization}</p>
                <p className="text-sm text-text-muted">{r.summary}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-4">
            In the press
          </h3>
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
                  <span className="text-sm text-text-faint whitespace-nowrap">{r.year}</span>
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
                {e.institution && <p className="text-sm text-accent mb-1">{e.institution}</p>}
                <p className="text-sm text-text-muted">{e.summary}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Beyond work */}
        <Section id="beyond-work" title="Beyond work" surface>
          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Teaching and mentoring
          </h3>
          <p className="text-[15px] text-text-muted leading-relaxed mb-6">{teachingIntro}</p>
          <div className="flex flex-col gap-5 mb-10">
            {teaching.map((t) => (
              <div key={t.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="font-semibold text-[15px]">{t.title}</h4>
                  <span className="text-sm text-text-faint whitespace-nowrap">
                    {t.dateRange}
                  </span>
                </div>
                <p className="text-sm text-accent">{t.institution}</p>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Volunteering
          </h3>
          <p className="text-[15px] text-text-muted leading-relaxed mb-10">{volunteeringSummary}</p>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Swimming
          </h3>
          <p className="text-[15px] text-text-muted leading-relaxed mb-10">{swimmingSummary}</p>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Writing
          </h3>
          <p className="text-[15px] text-text-muted leading-relaxed mb-10">
            {writingSummary.text}
            {!writingSummary.link.startsWith("[PLACEHOLDER") && (
              <>
                {" "}
                <a href={writingSummary.link} className="text-accent hover:text-accent-hover">
                  Read more &rarr;
                </a>
              </>
            )}
          </p>

          <h3 className="text-sm font-semibold text-text-faint uppercase tracking-wide mb-3">
            Outside work
          </h3>
          <p className="text-[15px] text-text-muted">{hobbies.join(" · ")}</p>
        </Section>

        {/* Ask about Rachel — hidden until the live Q&A backend exists
            (per the 7 Oct copy doc: "Only show this section once the
            live backend is connected; until then, hide it."). */}

        {/* Contact */}
        <Section id="contact" title="Get in touch">
          <p className="text-[15px] text-text-muted leading-relaxed mb-6 max-w-[56ch]">
            {contactIntro}
          </p>
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
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={`mailto:${footer.email}`} className="text-accent hover:text-accent-hover">
                {footer.email}
              </a>
              <a
                href={intro.links.find((l) => l.label === "LinkedIn")?.href}
                className="text-accent hover:text-accent-hover"
              >
                LinkedIn
              </a>
              <a
                href={intro.links.find((l) => l.label === "CV")?.href}
                className="text-accent hover:text-accent-hover"
              >
                CV
              </a>
            </div>
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
          <p className="mb-2">
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
          <p>{footer.copyright}</p>
        </footer>
      </main>
    </FilmGate>
  );
}
