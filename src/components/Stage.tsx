"use client";

import { Fragment, useEffect, useRef, useState, type MouseEvent } from "react";
import { identity, sections, selectedWork, education, research } from "@/content/content";
import { goToSection, openAsk } from "@/lib/ask";

const INTRO_KEY = "rc-intro-seen";

// Engraved on each door's brass nameplate, in selected work order.
const DOOR_LABELS = ["OCTAVE", "Research", "AI builds", "Layer1"];

// Where each door leads. Case studies are separate pages; the generative AI
// door lands on the Projects section.
function enterTarget(i: number) {
  const href = selectedWork[i]?.href ?? "/";
  if (href.startsWith("/")) {
    window.location.assign(href);
    return;
  }
  goToSection("projects");
  window.setTimeout(() => window.dispatchEvent(new CustomEvent("rc:door-done")), 250);
}

function markIntroSeen() {
  try {
    localStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode: the intro simply plays again next time */
  }
}

// The hello line, split into characters so it can set in during the intro.
function Hello() {
  return (
    <h1 className="hello" aria-label={identity.hello}>
      {identity.hello.split(" ").map((word, w) => (
        <Fragment key={w}>
          <span className="w" aria-hidden="true">
            {[...word].map((ch, c) => (
              <span className="ch" key={c} style={{ ["--i" as string]: w * 6 + c }}>
                {ch}
              </span>
            ))}
          </span>{" "}
        </Fragment>
      ))}
    </h1>
  );
}

export default function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const chooseRef = useRef<HTMLParagraphElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("gl")) {
      markIntroSeen();
      return;
    }
    let dispose: (() => void) | null = null;
    let cancelled = false;
    const cards = [...(workRef.current?.querySelectorAll<HTMLElement>(".work-card") ?? [])];
    const introSeen = root.classList.contains("intro-done");
    if (!introSeen && !location.hash) {
      // The intro always starts at the top, whatever the browser restored.
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    import("@/stage/scene")
      .then(({ createStage }) => {
        if (cancelled || !canvasRef.current || !copyRef.current || !indexRef.current || !skipRef.current || !hintRef.current) return;
        try {
          dispose = createStage(
            {
              canvas: canvasRef.current,
              heroCopy: copyRef.current,
              index: indexRef.current,
              skip: skipRef.current,
              hint: hintRef.current,
              cards,
              veil: veilRef.current!,
              choose: chooseRef.current!,
            },
            {
              portraitSrc: identity.portrait,
              badgeSrc: identity.badgePhoto,
              introSeen,
              name: identity.name,
              role: identity.role,
              employer: identity.employer,
              location: "Colombo",
              orcid: identity.orcid,
              domain: identity.domain,
              degree: "BSc Computer Science, First",
              research: "IEEE ICAHS 2025",
              doorLabels: DOOR_LABELS,
              onIntroDone: markIntroSeen,
              onEnterDoor: enterTarget,
            },
          );
        } catch (err) {
          console.error(err);
          root.classList.remove("gl");
          root.classList.add("lite", "intro-done");
        }
      })
      .catch(() => {
        root.classList.remove("gl");
        root.classList.add("lite", "intro-done");
      });

    // Keyboard users who tab into a work card: bring it on screen.
    const onFocus = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".work-card");
      if (!card || !root.classList.contains("gl")) return;
      const i = cards.indexOf(card);
      const stops = [150, 230, 310, 390];
      if (i >= 0) window.scrollTo({ top: (stops[i] / 100) * window.innerHeight, behavior: "auto" });
    };
    workRef.current?.addEventListener("focusin", onFocus);
    const work = workRef.current;

    return () => {
      cancelled = true;
      work?.removeEventListener("focusin", onFocus);
      dispose?.();
    };
  }, []);

  const go = (id: (typeof sections)[number]["id"], e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (id === "ask") {
      openAsk();
      return;
    }
    goToSection(id);
  };

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <canvas ref={canvasRef} id="stage" aria-hidden="true" />

      <div className="hero-copy" ref={copyRef}>
        <p className="eyebrow">
          <span>{identity.name}</span>
          <span aria-hidden="true">/</span>
          <span>{identity.location}</span>
        </p>
        <Hello />
        <p className="lede">{identity.summary}</p>
        <div className="hero-actions">
          <a className="btn" href="#work" onClick={(e) => go("work", e)}>
            See the work
          </a>
          <button type="button" className="btn ghost" onClick={() => openAsk()}>
            Ask about Rachel <kbd>/</kbd>
          </button>
        </div>
      </div>

      {/* Phone, low power and reduced motion: a flat badge with the same index. */}
      <div className={`badge-shell${flipped ? " flipped" : ""}`}>
        <div className="lanyard" aria-hidden="true" />
        <div className="badge-card">
          <div className="badge-face badge-front">
            <div className="lite-head">
              <img
                src={identity.badgePhoto}
                alt={identity.badgePhotoAlt}
                width={72}
                height={72}
                className="lite-photo"
              />
              <div>
                <p className="lite-name">{identity.name}</p>
                <p className="lite-role">{identity.role}</p>
              </div>
            </div>
            <nav className="badge-index" aria-label="Site index" ref={indexRef}>
              <p className="index-label">Index</p>
              <ol>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} onClick={(e) => go(s.id, e)}>
                      <span>{s.label}</span>
                      <span className="num">{s.number}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <button type="button" className="flip-btn" onClick={() => setFlipped(true)}>
              Flip the badge
            </button>
          </div>
          <div className="badge-face badge-back" aria-hidden={!flipped}>
            <p className="index-label">Credential</p>
            <dl>
              <div>
                <dt>Based</dt>
                <dd>{identity.location}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{identity.role}, {identity.employer}</dd>
              </div>
              <div>
                <dt>Degree</dt>
                <dd>{education[0].title}</dd>
              </div>
              <div>
                <dt>Research</dt>
                <dd>{research.paper.venue}</dd>
              </div>
              <div>
                <dt>ORCID</dt>
                <dd className="mono">{identity.orcid}</dd>
              </div>
            </dl>
            <button type="button" className="flip-btn" onClick={() => setFlipped(false)} tabIndex={flipped ? 0 : -1}>
              Flip back
            </button>
          </div>
        </div>
      </div>

      <img
        className="hero-portrait"
        src={identity.portrait}
        alt={identity.portraitAlt}
        width={679}
        height={1366}
        fetchPriority="high"
      />

      <button type="button" className="skip-intro" ref={skipRef}>
        Skip intro
      </button>
      <div className="door-veil" ref={veilRef} aria-hidden="true" />
      <p className="choose-hint" ref={chooseRef} aria-hidden="true">
        Choose a door
      </p>
      <p className="scroll-hint" ref={hintRef} aria-hidden="true">
        <span>Drag the badge</span>
        <span>Tap to flip</span>
        <span>Scroll to walk through</span>
      </p>

      <div id="work" className="work" ref={workRef} data-section="work">
        <div className="sec-head work-head">
          <p className="sec-num">01 Selected work</p>
          <h2>Selected work</h2>
        </div>
        <div className="work-grid">
          {selectedWork.map((w, i) => (
            <article key={w.id} className={`work-card ${w.side}`} data-passage={w.id}>
              <p className="kicker">
                <span className="num">0{i + 1}</span> {w.kicker}
              </p>
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <a
                className="textlink"
                href={w.href}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab still works
                  e.preventDefault();
                  // In 3D, walk through this card's door first.
                  if (document.documentElement.classList.contains("stage-ready")) {
                    window.dispatchEvent(new CustomEvent("rc:enter-door", { detail: { i } }));
                  } else {
                    enterTarget(i);
                  }
                }}
              >
                {w.linkLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
