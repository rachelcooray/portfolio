"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Guide } from "@/robot/Guide";
import { TourController } from "@/tour/TourController";

// three.js needs window/canvas — must stay client-only and lazy. This file
// is already a Client Component ("use client" above), so dynamic() with
// ssr:false is allowed here directly.
const Robot = dynamic(() => import("./Robot"), { ssr: false });

export default function RobotToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const guideRef = useRef<Guide | null>(null);
  const tourRef = useRef<TourController | null>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const srLiveRef = useRef<HTMLDivElement>(null);

  const startTour = useCallback(() => {
    if (!tourRef.current || tourRef.current.isRunning) return;
    setIsPlaying(true);
    setHasPlayed(true);
    void tourRef.current.play().then(() => setIsPlaying(false));
  }, []);

  const handleGuideReady = useCallback(
    (guide: Guide) => {
      guideRef.current = guide;
      guide.setMuted(isMuted);
      if (subtitleRef.current && srLiveRef.current) {
        tourRef.current = new TourController({
          guide,
          subtitleEl: subtitleRef.current,
          srLiveEl: srLiveRef.current,
        });
      }
      setIsLoading(false);
      startTour();
    },
    [isMuted, startTour],
  );

  const handleOpen = () => {
    // Unlocks audio autoplay for the page: Guide's eventual audioEl.play()
    // call happens several async hops after this click (GLTF load, timing
    // fetch), which browsers no longer treat as "part of" this gesture.
    // Playing anything — even a silent clip — synchronously inside the
    // click handler unlocks the origin's audio for the rest of the
    // session, so that later call succeeds instead of being silently
    // blocked (subtitles/mouth-sync still run either way, since those are
    // driven by local timers, not the audio element — so a blocked
    // autoplay looks like "it's talking but I can't hear it").
    const unlock = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    );
    void unlock.play().catch(() => {});

    setIsOpen(true);
    if (!guideRef.current) setIsLoading(true);
    else if (!hasPlayed) startTour();
  };

  const handleClose = () => {
    tourRef.current?.skip();
    setIsPlaying(false);
    setIsOpen(false);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    guideRef.current?.setMuted(next);
  };

  const replay = () => {
    tourRef.current?.skip();
    startTour();
  };

  // Esc closes the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      {/* Toggle button — always visible, top-right */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? "Close Rachel's guide" : "Open Rachel's guide — click to have the robot walk you through the page"}
        aria-expanded={isOpen}
        className={`glass glass-interactive fixed top-4 right-4 z-50 w-14 h-14 rounded-full text-accent flex items-center justify-center text-2xl ${
          isOpen ? "" : "animate-[wave_2.5s_ease-in-out_infinite]"
        }`}
      >
        {isOpen ? "✕" : "🤖"}
      </button>
      {!isOpen && (
        <style>{`
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            10% { transform: rotate(-8deg); }
            20% { transform: rotate(8deg); }
            30% { transform: rotate(-8deg); }
            40% { transform: rotate(0deg); }
          }
        `}</style>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="glass fixed top-20 right-4 z-40 w-[320px] h-[65vh] max-h-[560px] rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-text-faint">
                Loading…
              </div>
            )}
            <Robot onGuideReady={handleGuideReady} />
          </div>

          {/* Subtitles — extra opaque backing on top of the glass so small
              text stays comfortably above contrast minimums. */}
          <div
            ref={subtitleRef}
            className="px-4 py-3 text-[13px] text-text leading-snug min-h-[3.2em] border-t border-divider bg-bg/55"
          />
          <div ref={srLiveRef} className="sr-only" role="status" aria-live="polite" />

          {/* Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-divider bg-bg/55">
            <button
              onClick={replay}
              disabled={isLoading}
              className="text-sm text-accent hover:text-accent-hover disabled:text-text-faint disabled:cursor-not-allowed"
            >
              {isPlaying ? "Replay" : hasPlayed ? "Replay" : "Play"}
            </button>
            <button
              onClick={() => tourRef.current?.skip()}
              disabled={!isPlaying}
              className="text-sm text-text-muted hover:text-text disabled:text-text-faint disabled:cursor-not-allowed"
            >
              Skip
            </button>
            <button
              onClick={toggleMute}
              className="text-sm text-text-muted hover:text-text"
            >
              {isMuted ? "🔇 Sound off" : "🔊 Sound on"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
