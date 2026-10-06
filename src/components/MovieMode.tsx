"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Guide } from "@/robot/Guide";
import { MovieController, type MovieElements } from "@/movie/MovieController";
import { impactStats, sceneLabels, SCENE_COUNT_BUILT } from "@/movie/movieScript";
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

  const guideRef = useRef<Guide | null>(null);
  const controllerRef = useRef<MovieController | null>(null);

  const scrimRef = useRef<HTMLDivElement>(null);
  const letterboxTopRef = useRef<HTMLDivElement>(null);
  const letterboxBottomRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const srLiveRef = useRef<HTMLDivElement>(null);
  const statCardRefs = useRef<{ card: HTMLDivElement; valueEl: HTMLDivElement }[]>([]);

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
        titleEl: titleRef.current!,
        taglineEl: taglineRef.current!,
        captionEl: captionRef.current!,
        srLiveEl: srLiveRef.current!,
        statCards: statCardRefs.current,
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
      <div className="absolute inset-0">
        <Robot onGuideReady={handleGuideReady} />
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

      {/* Title card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
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

      {/* Scene 3 stat cards */}
      <div className="absolute inset-x-0 bottom-[22vh] flex flex-wrap justify-center gap-4 px-6 pointer-events-none">
        {impactStats.map((stat, i) => (
          <div
            key={stat.id}
            ref={(el) => {
              if (el) {
                const valueEl = el.querySelector<HTMLDivElement>("[data-value]")!;
                statCardRefs.current[i] = { card: el, valueEl };
              }
            }}
            className="glass rounded-2xl px-5 py-4 min-w-[140px] text-center"
            style={{ opacity: 0, transform: `rotate(${(i - 1.5) * 4}deg)` }}
          >
            <div data-value className="font-heading text-2xl sm:text-3xl font-semibold text-accent">
              {/* filled by MovieController's count-up */}
            </div>
            <div className="text-xs sm:text-sm text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Captions */}
      <div
        ref={captionRef}
        className="absolute bottom-[12vh] inset-x-0 text-center text-text text-base sm:text-lg px-10 min-h-[1.5em]"
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
