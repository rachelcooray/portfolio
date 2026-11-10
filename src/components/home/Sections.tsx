import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import HeroVisual from "./HeroVisual";
import { atAGlance, identity, projectList, sectionDirectory, site } from "@/content/content";

type Entry = (typeof sectionDirectory)[number];

function entry(id: string): Entry {
  return sectionDirectory.find((s) => s.id === id)!;
}

// Numbered points that reveal one by one as the section arrives.
export function PointList({ points, light }: { points: string[]; light?: boolean }) {
  return (
    <ol className={`points${light ? " light" : ""}`}>
      {points.map((p, i) => (
        <li key={p}>
          <span className="mono">{String(i + 1).padStart(2, "0")}</span>
          <span>{p}</span>
        </li>
      ))}
    </ol>
  );
}

export function HeroSection() {
  return (
    <section id="intro" className="hero chapter">
      <div className="wrap hero-grid">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1 className="rise">
            {["Hi,", "I\u2019m", "Rachel"].map((w, i) => (
              <span key={w}>
                <span className="w" style={{ "--i": i } as React.CSSProperties}>
                  {w}
                </span>{" "}
              </span>
            ))}
            <span className="w" style={{ "--i": 3 } as React.CSSProperties}>
              Cooray<span className="accent-dot">.</span>
            </span>
          </h1>
          <p className="hero-statement">{site.hero.title}</p>
          <p className="lede">{site.hero.lead}</p>
          <div className="btn-row">
            <Button href="#sections">Explore by section</Button>
            <Button href="/rachelcooray-cv.pdf" variant="secondary">
              Download CV
            </Button>
          </div>
          <a className="scroll-cue mono" href="#about-me">
            Scroll to go through it section by section ↓
          </a>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

export function IntroductionSection() {
  return (
    <section id="about-me" className="band chapter">
      <div className="wrap intro-split">
        <figure className="intro-photo" data-reveal>
          <Image src="/images/photos/rachel-headshot.webp" width={576} height={872} alt="Rachel Cooray, smiling, in front of her research poster" />
          <figcaption className="mono">Westminster, 2025</figcaption>
        </figure>
        <div data-reveal>
          <p className="eyebrow">At a glance</p>
          <h2 className="h-mid">Who I am, in five points.</h2>
          <PointList points={atAGlance} />
          <div className="btn-row mt">
            <Button href="/about" variant="secondary">
              More about me
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// The index: every section a visitor can go into, in order.
export function SectionIndex() {
  return (
    <section id="sections" className="band band-oat chapter">
      <div className="wrap">
        <div className="sec-head" data-reveal>
          <p className="eyebrow">Sections</p>
          <h2>Choose where to go.</h2>
          <p className="sec-intro">Each section opens its own page, laid out point by point.</p>
        </div>
        <ol className="directory" data-reveal>
          {sectionDirectory.map((s, i) => (
            <li key={s.id}>
              <Link href={s.href} className="dir-card">
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <strong>{s.title}</strong>
                <span className="dir-point">{s.points[0]}</span>
                <span className="dir-open">
                  Open <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// One preview per section: heading, numbered points, and a way in.
export function SectionPreview({
  id,
  num,
  tone = "plain",
  image,
}: {
  id: string;
  num: string;
  tone?: "plain" | "oat" | "forest";
  image?: { src: string; w: number; h: number; alt: string };
}) {
  const e = entry(id);
  const dark = tone === "forest";
  return (
    <section id={e.id} className={`band chapter ${tone === "oat" ? "band-oat" : dark ? "band-forest" : ""}`}>
      <div className={`wrap preview${image ? " has-image" : ""}`}>
        <div data-reveal>
          <p className={`eyebrow${dark ? " light" : ""}`}>Section {num}</p>
          <h2 className="h-mid">{e.title}</h2>
          <PointList points={e.points} light={dark} />
          <div className="btn-row mt">
            <Button href={e.href} variant={dark ? "light" : "primary"}>
              {e.cta} →
            </Button>
          </div>
        </div>
        {image && (
          <figure className="preview-photo" data-reveal>
            <Image src={image.src} width={image.w} height={image.h} alt={image.alt} />
          </figure>
        )}
      </div>
    </section>
  );
}

// Research & Projects: every project listed, each with a way into its case study.
export function ProjectsPreview({ num }: { num: string }) {
  const e = entry("research-projects");
  return (
    <section id={e.id} className="band chapter">
      <div className="wrap">
        <div className="sec-head split" data-reveal>
          <div>
            <p className="eyebrow">Section {num}</p>
            <h2>{e.title}</h2>
          </div>
          <Button href="/projects" variant="secondary">
            See all with filters →
          </Button>
        </div>
        <ol className="project-index" data-reveal>
          {projectList.map((p, i) => (
            <li key={p.slug}>
              <span className="mono pi-num">{String(i + 1).padStart(2, "0")}</span>
              <div className="pi-body">
                <div className="pi-head">
                  <h3>{p.title}</h3>
                  <Badge>{p.category}</Badge>
                </div>
                <ul className="bullets">
                  <li>{p.summary}</li>
                  <li>
                    <strong>My part:</strong> {p.role}
                  </li>
                </ul>
              </div>
              <Link className="btn btn-line pi-open" href={`/projects/${p.slug}`}>
                Open case study<span className="sr-only">: {p.title}</span> →
              </Link>
            </li>
          ))}
        </ol>
        <p className="mono note mt" data-reveal>
          Research in depth: <Link href="/research">PCOS Care, IEEE ICAHS 2025 →</Link>
        </p>
      </div>
    </section>
  );
}

export function ExperiencePreview({ num }: { num: string }) {
  const e = entry("experience");
  return (
    <section id={e.id} className="band band-forest chapter">
      <div className="wrap">
        <div className="sec-head light" data-reveal>
          <p className="eyebrow light">Section {num}</p>
          <h2>{e.title}</h2>
        </div>
        <div className="preview" data-reveal>
          <div>
            <PointList points={e.points} light />
            <div className="btn-row mt">
              <Button href={e.href} variant="light">
                {e.cta} →
              </Button>
            </div>
          </div>
          <ol className="journey compact">
            {site.journey.map((j) => (
              <li key={j.year}>
                <span className="year">{j.year}</span>
                <p>{j.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function PersonalStatement() {
  return (
    <section id="statement" className="band band-forest chapter">
      <div className="wrap statement">
        <figure data-reveal>
          <Image src="/images/photos/rachel-speaking.webp" width={1840} height={2000} alt="Rachel Cooray speaking at a lectern, holding a microphone and smiling" />
        </figure>
        <div data-reveal>
          <p className="eyebrow light">How I think</p>
          <blockquote className="quote">
            <p>I value practical outcomes, not technology for its own sake. A solution should be useful, understandable and sustainable.</p>
          </blockquote>
          <p className="muted-light">The most interesting problems rarely sit within one discipline.</p>
        </div>
      </div>
    </section>
  );
}

export function ContactCTA() {
  return (
    <section id="connect" className="band band-forest closing chapter">
      <div className="wrap" data-reveal>
        <p className="eyebrow light">Let&apos;s connect</p>
        <h2>{site.closing.title}</h2>
        <p className="lede">{site.closing.text}</p>
        <div className="btn-row">
          <Button href="/contact" variant="light">
            Let&apos;s connect
          </Button>
          <Button href={`mailto:${identity.email}`} variant="ghost-light">
            {identity.email}
          </Button>
        </div>
      </div>
    </section>
  );
}
