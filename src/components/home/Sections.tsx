import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/Headings";
import ArchitectureDiagram from "@/components/visualisations/ArchitectureDiagram";
import Hero3D from "@/components/visualisations/Hero3D";
import { capabilities, coreAchievements, projectList, research, site, identity } from "@/content/content";

export function HeroSection() {
  return (
    <section id="intro" className="hero chapter">
      <div className="wrap hero-grid">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1>
            Hi, I&apos;m Rachel Cooray<span className="accent-dot">.</span>
          </h1>
          <p className="hero-statement">{site.hero.title}</p>
          <p className="lede">{site.hero.lead}</p>
          <div className="btn-row">
            <Button href="/projects">Explore my work</Button>
            <Button href="/rachelcooray-cv.pdf" variant="secondary">
              Download CV
            </Button>
          </div>
          <a className="scroll-cue mono" href="#about-me">
            Scroll to learn about me, chapter by chapter ↓
          </a>
        </div>
        <Hero3D />
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
          <SectionHeading kicker="Chapter 01 · Who I am" title="A computer science graduate who likes problems that cross disciplines." />
          {site.hero.paragraphs.map((p) => (
            <p key={p.slice(0, 16)} className="lede spaced">
              {p}
            </p>
          ))}
          <p className="mono muted">{site.hero.meta}</p>
          <Button href="/about" variant="text">
            More about me →
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CapabilityBento() {
  return (
    <section id="capabilities" className="band band-oat chapter">
      <div className="wrap">
        <SectionHeading kicker="Chapter 02 · What I bring" title="Five capabilities, one way of working." />
        <div className="bento" data-reveal>
          {capabilities.map((c, i) => (
            <Link key={c.title} href={c.href} className={`bento-card b${i + 1}`}>
              <span className="mono">
                {c.num} / {c.tag}
              </span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CareerTimelinePreview() {
  return (
    <section id="journey" className="band band-forest chapter">
      <div className="wrap">
        <SectionHeading light kicker="Chapter 03 · The journey so far" title="From school leadership to enterprise AI." />
        <ol className="journey" data-reveal>
          {site.journey.map((j) => (
            <li key={j.year}>
              <span className="year">{j.year}</span>
              <p>{j.text}</p>
            </li>
          ))}
        </ol>
        <div data-reveal>
          <Button href="/experience" variant="ghost-light">
            See the full career timeline
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProjects() {
  const featured = ["distributor-replenishment-system", "ice-cream-distributor-margins", "permanent-dispatch-planning", "pcos-care"].map(
    (s) => projectList.find((p) => p.slug === s)!,
  );
  return (
    <section id="work" className="band chapter">
      <div className="wrap">
        <div className="sec-head split" data-reveal>
          <div>
            <p className="eyebrow">Chapter 04 · Selected work</p>
            <h2>Ideas that had to work in the real world.</h2>
          </div>
          <Button href="/projects" variant="text">
            All projects →
          </Button>
        </div>
        <div className="featured">
          {featured.map((p) => (
            <article key={p.slug} className="feature-card" data-reveal>
              {p.thumbnail ? (
                <Image className="feature-img" src={p.thumbnail} width={2000} height={1250} alt={p.thumbnailAlt} />
              ) : (
                p.diagram && <ArchitectureDiagram steps={p.diagram} label={`${p.title}, illustrative flow`} />
              )}
              <div className="feature-copy">
                <Badge>{p.category}</Badge>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <Link className="text-link" href={`/projects/${p.slug}`}>
                  Read the case study →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResearchHighlight() {
  return (
    <section id="research-highlight" className="band band-oat chapter">
      <div className="wrap research-highlight">
        <div data-reveal>
          <SectionHeading kicker="Chapter 05 · Research" title="A question that became a publication." />
          <Badge tone="status">Published · IEEE ICAHS 2025</Badge>
          <h3 className="paper-title">{research.paper.title}</h3>
          <p className="muted">{research.paper.description}</p>
          <div className="btn-row">
            <Button href="/research">Explore the research</Button>
            <Button href={research.paper.doiUrl} variant="secondary">
              Read the paper ↗
            </Button>
          </div>
        </div>
        <figure className="rh-photo" data-reveal>
          <Image src="/images/photos/pcos-app.webp" width={2000} height={1250} alt="PCOS Care web app home page with information, simple and enhanced risk assessment, and results" />
          <figcaption className="mono">The deployed PCOS Care application</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function AchievementStrip() {
  return (
    <section id="recognition" className="band chapter">
      <div className="wrap">
        <SectionHeading kicker="Chapter 06 · Recognition" title="Placed, published and recognised." />
        <div className="recog" data-reveal>
          {coreAchievements.map((a) => (
            <Link key={a.id} href="/achievements" className="recog-item">
              <span className="mono">{a.year}</span>
              <h3>{a.title}</h3>
              <p>{a.org}</p>
            </Link>
          ))}
          <Link href="/research" className="recog-item">
            <span className="mono">2025</span>
            <h3>IEEE ICAHS 2025 publication</h3>
            <p>PCOS Care, Hammamet, Tunisia</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BeyondPreview() {
  return (
    <section id="beyond" className="band band-oat chapter">
      <div className="wrap">
        <SectionHeading kicker="Chapter 07 · Beyond work" title="There is more to me than the work I do." />
        <div className="photo-grid" data-reveal>
          <figure className="ph-tall">
            <Image src="/images/photos/swimming-meet.jpg" width={399} height={501} alt="Team OCTAVE with the overall women's championship trophy at the JKH Intercompany Swimming Meet 2026" />
            <figcaption>
              <span className="mono">Swimming</span> Three individual golds and gold in every relay, 2026.
            </figcaption>
          </figure>
          <figure className="ph-wide">
            <Image src="/images/photos/street-vendor.jpg" width={1600} height={1200} alt="A street food vendor at his stall in Colombo" />
            <figcaption>
              <span className="mono">Community</span> Field research with street food vendors, adopted by the CSR team.
            </figcaption>
          </figure>
          <figure className="ph-tall">
            <Image src="/images/photos/head-prefect.jpg" width={1080} height={1391} alt="Rachel as Head Prefect in the green St. Bridget's Convent blazer" />
            <figcaption>
              <span className="mono">Leadership</span> Head Prefect, 2020.
            </figcaption>
          </figure>
        </div>
        <div data-reveal className="mt">
          <Button href="/beyond-work" variant="text">
            Volunteering, sport and interests →
          </Button>
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
          <p className="eyebrow light">Chapter 08 · How I think</p>
          <blockquote className="quote">
            <p>I value practical outcomes, not technology for its own sake. A solution should be useful, understandable and sustainable.</p>
          </blockquote>
          <p className="muted-light">The most interesting problems rarely sit within one discipline.</p>
        </div>
      </div>
    </section>
  );
}

export function ExploreCards() {
  const cards = [
    { href: "/about", n: "02", t: "About", d: "How I think" },
    { href: "/experience", n: "03", t: "Experience", d: "Where I've applied it" },
    { href: "/projects", n: "04", t: "Projects", d: "What I've built and delivered" },
    { href: "/research", n: "05", t: "Research", d: "How I investigate" },
    { href: "/education", n: "06", t: "Education", d: "My foundations" },
    { href: "/achievements", n: "07", t: "Achievements", d: "What's been recognised" },
    { href: "/beyond-work", n: "08", t: "Beyond Work", d: "Who I am outside work" },
    { href: "/media", n: "09", t: "Media", d: "Where I've been featured" },
  ];
  return (
    <section id="explore" className="band chapter">
      <div className="wrap">
        <SectionHeading kicker="Chapter 09 · Keep exploring" title="Go deeper, one page at a time." />
        <div className="explore" data-reveal>
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="explore-card">
              <span className="mono">{c.n}</span>
              <strong>{c.t}</strong>
              <span>{c.d}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactCTA() {
  return (
    <section id="connect" className="band band-forest closing chapter">
      <div className="wrap" data-reveal>
        <p className="eyebrow light">Chapter 10 · Let&apos;s connect</p>
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
