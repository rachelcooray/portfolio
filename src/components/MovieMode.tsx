"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Guide } from "@/robot/Guide";
import { MovieController, type MovieElements } from "@/movie/MovieController";
import { impactStats, researchCard, octaveSteps, sceneLabels, SCENE_COUNT_BUILT } from "@/movie/movieScript";
import { intro } from "@/content/content";

const Robot = dynamic(() => import("./Robot"), { ssr: false });

function TitleChars({ text }: { text: string }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} data-char style={{ display: "inline-block", whiteSpace: "pre" }}>
          {ch}
        </span>
      ))}
    </>
  );
}

// Opaque card style for Movie mode content (the brief: "cards are opaque,
// no glass, in film mode" - the frosted/translucent look that works for
// Page mode's floating UI reads as a glitch over the 3D robot here).
const CARD_CLASS = "rounded-2xl px-5 py-4 bg-bg border border-divider shadow-lg";

export default function MovieMode({
  startScene,
  startMuted,
  onDone,
}: {
  startScene: number;
  startMuted: boolean;
  onDone: () => void;
}) {
  const [sceneIndex, setSceneIndex] = useState(startScene);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [loading, setLoading] = useState(true);

  // Scenes 0-1 (cold open, title card) are full-bleed with the robot
  // centre stage - nothing else competes for the frame. From scene 2
  // (impact numbers) on, there's real content to show alongside the
  // robot, so the stage docks to a fixed two-column composition: robot
  // left, content right, never overlapping.
  const docked = sceneIndex >= 2;

  const guideRef = useRef<Guide | null>(null);
  const controllerRef = useRef<MovieController | null>(null);

  const scrimRef = useRef<HTMLDivElement>(null);
  const letterboxTopRef = useRef<HTMLDivElement>(null);
  const letterboxBottomRef = useRef<HTMLDivElement>(null);
  const titleEnvelopeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const srLiveRef = useRef<HTMLDivElement>(null);
  const statGridRef = useRef<HTMLDivElement>(null);
  const statCardRefs = useRef<{ card: HTMLDivElement; valueEl: HTMLDivElement }[]>([]);
  const researchCardRef = useRef<HTMLDivElement>(null);
  const researchVenueRef = useRef<HTMLSpanElement>(null);
  const awardBadgeRef = useRef<HTMLDivElement>(null);
  const octaveGroupRef = useRef<HTMLDivElement>(null);
  const octaveStepRefs = useRef<HTMLDivElement[]>([]);

  const finish = useCallback(() => {
    setIsPlaying(false);
    onDone();
  }, [onDone]);

  const handleGuideReady = useCallback(
    (guide: Guide) => {
      guideRef.current = guide;
      guide.setMuted(isMuted);

      const els: MovieElements = {
        scrim: scrimRef.current!,
        letterboxTop: letterboxTopRef.current!,
        letterboxBottom: letterboxBottomRef.current!,
        titleEnvelope: titleEnvelopeRef.current!,
        titleEl: titleRef.current!,
        taglineEl: taglineRef.current!,
        captionEl: captionRef.current!,
        srLiveEl: srLiveRef.current!,
        statGrid: statGridRef.current!,
        statCards: statCardRefs.current,
        researchCard: researchCardRef.current!,
        researchVenue: researchVenueRef.current!,
        awardBadge: awardBadgeRef.current!,
        octaveGroup: octaveGroupRef.current!,
        octaveSteps: octaveStepRefs.current,
      };
      const controller = new MovieController({
        guide,
        els,
        onSceneChange: setSceneIndex,
        onComplete: finish,
      });
      controllerRef.current = controller;
      setLoading(false);
      void controller.play(startScene);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    return () => controllerRef.current?.destroy();
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const togglePlay = () => {
    const c = controllerRef.current;
    if (!c) return;
    if (isPlaying) {
      c.pause();
      setIsPlaying(false);
    } else {
      c.resume();
      setIsPlaying(true);
    }
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    guideRef.current?.setMuted(next);
    if (!next) {
      // Unlocks autoplay for the rest of this origin's audio, same trick
      // RobotToggle uses - needed here because the film's own start had no
      // click gesture to piggyback on when it autoplayed on first visit.
      const unlock = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
      );
      void unlock.play().catch(() => {});
    }
  };

  const skip = () => controllerRef.current?.skip();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const c = controllerRef.current;
      if (!c) return;
      if (e.key === "Escape") skip();
      else if (e.key === "ArrowRight") c.next();
      else if (e.key === "ArrowLeft") c.prev();
      else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-[100] bg-bg overflow-hidden" role="dialog" aria-label="Introduction film">
      {/* Stage: always the same two nodes in the same order (so the Robot
          component never unmounts/reloads) - only sizing/position changes
          between the full-bleed and docked compositions. */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        <div
          className={
            docked
              ? "relative w-full h-[42vh] md:h-full md:w-[36%] shrink-0 flex items-center justify-center transition-[width,height] duration-500"
              : "relative w-full h-full flex items-center justify-center transition-[width,height] duration-500"
          }
        >
          <Robot onGuideReady={handleGuideReady} />
        </div>
        <div
          className={
            docked
              ? "relative flex-1 flex items-center justify-center px-6 md:px-14 min-h-0"
              : "relative w-0 h-0 overflow-hidden"
          }
        >
          {/* Scene 3: impact numbers, 2x2 grid */}
          <div ref={statGridRef} className="grid grid-cols-2 gap-4 w-full max-w-md" style={{ opacity: 0 }}>
            {impactStats.map((stat, i) => (
              <div
                key={stat.id}
                ref={(el) => {
                  if (el) {
                    const valueEl = el.querySelector<HTMLDivElement>("[data-value]")!;
                    statCardRefs.current[i] = { card: el, valueEl };
                  }
                }}
                className={`${CARD_CLASS} text-center`}
                style={{ opacity: 0 }}
              >
                <div data-value className="font-heading text-2xl sm:text-3xl font-semibold text-accent">
                  {/* filled by MovieController's count-up */}
                </div>
                <div className="text-xs sm:text-sm text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scene 4: research card. Centering transform lives on this
              non-animated wrapper, not the ref'd element GSAP moves -
              GSAP's x/y/scale tweens take over the whole `transform`
              property, which would otherwise clobber a static centering
              offset set on the same element. */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-6">
            <div ref={researchCardRef} className={`${CARD_CLASS} text-center relative mx-auto`} style={{ opacity: 0 }}>
              <div className="font-heading text-lg sm:text-xl font-semibold text-text leading-snug">
                {researchCard.title}
              </div>
              <div className="mt-2 text-sm text-text-muted">
                <span ref={researchVenueRef} className="rounded px-1">
                  {researchCard.venue}
                </span>
              </div>
              <div
                ref={awardBadgeRef}
                className="absolute -top-4 -right-4 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center font-heading font-semibold text-sm shadow-lg"
                style={{ opacity: 0, transform: "scale(0) rotate(-15deg)" }}
              >
                3rd
              </div>
            </div>
          </div>

          {/* Scene 5: OCTAVE role path - same wrapper/ref split as above. */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div ref={octaveGroupRef} style={{ opacity: 0 }}>
              <div className="text-sm font-semibold text-accent uppercase tracking-wide mb-5">OCTAVE</div>
              <div className="relative flex items-end gap-4">
                <svg
                  className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                  aria-hidden="true"
                >
                  <line x1="10%" y1="85%" x2="90%" y2="15%" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 5" opacity="0.5" />
                </svg>
                {octaveSteps.map((step, i) => (
                  <div
                    key={step.id}
                    ref={(el) => {
                      if (el) octaveStepRefs.current[i] = el;
                    }}
                    className={`${CARD_CLASS} font-heading font-semibold text-text relative`}
                    style={{ opacity: 0, marginBottom: `${i * 28}px` }}
                  >
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cold-open scrim */}
      <div ref={scrimRef} className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: 1 }} aria-hidden="true" />

      {/* Letterbox bars */}
      <div
        ref={letterboxTopRef}
        className="absolute top-0 left-0 right-0 h-[10vh] bg-black pointer-events-none"
        style={{ transformOrigin: "top", transform: "scaleY(0)" }}
        aria-hidden="true"
      />
      <div
        ref={letterboxBottomRef}
        className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black pointer-events-none"
        style={{ transformOrigin: "bottom", transform: "scaleY(0)" }}
        aria-hidden="true"
      />

      {/* Title card - full-bleed, scenes 0-1 only */}
      <div
        ref={titleEnvelopeRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        <h1
          ref={titleRef}
          className="font-heading italic text-text font-semibold leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(2.25rem, 9vw, 6rem)" }}
        >
          <TitleChars text={intro.name} />
        </h1>
        <p ref={taglineRef} className="mt-4 text-accent text-lg sm:text-2xl font-medium" style={{ opacity: 0 }}>
          {intro.tagline}
        </p>
      </div>

      {/* Captions - film-style, short, centred at the bottom */}
      <div
        ref={captionRef}
        className="absolute bottom-[8vh] inset-x-0 text-center text-text text-base sm:text-lg px-10 min-h-[1.5em]"
      />
      <div ref={srLiveRef} className="sr-only" role="status" aria-live="polite" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-text-faint text-sm">Loading…</div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-3 px-4">
        <div className="flex items-center gap-2">
          {sceneLabels.slice(0, SCENE_COUNT_BUILT).map((label, i) => (
            <button
              key={label}
              onClick={() => controllerRef.current?.jumpTo(i)}
              aria-label={`Jump to scene: ${label}`}
              aria-current={sceneIndex === i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                sceneIndex === i ? "bg-accent" : "bg-text-faint/50 hover:bg-text-faint"
              }`}
            />
          ))}
        </div>
        <div className="glass flex items-center gap-4 px-5 py-2.5 rounded-full">
          <button onClick={togglePlay} className="text-sm text-text hover:text-accent">
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button onClick={toggleSound} className="text-sm text-text hover:text-accent">
            {isMuted ? "🔇 Turn on sound" : "🔊 Sound on"}
          </button>
          <button onClick={skip} className="text-sm text-accent font-medium hover:text-accent-hover">
            Skip to site →
          </button>
        </div>
      </div>
    </div>
  );
}
