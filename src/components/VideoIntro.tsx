"use client";

import { useEffect, useRef, useState } from "react";
import { markFilmStarted } from "@/movie/filmState";

// Replaces the robot cinematic (Movie mode, src/movie/*) with a real video
// intro - two AI-generated takes Rachel supplied, merged into one 20s clip
// (public/videos/intro.mp4, built via `ffmpeg -f concat`). The Movie mode
// code is left in place, just unused, in case it's revisited later.
export default function VideoIntro({
  startMuted,
  onDone,
}: {
  startMuted: boolean;
  onDone: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(startMuted);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    markFilmStarted();
    const v = videoRef.current;
    if (!v) return;
    v.muted = startMuted;
    void v.play().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center" role="dialog" aria-label="Introduction video">
      <video
        ref={videoRef}
        src="/videos/intro.mp4"
        className="w-full h-full object-contain"
        playsInline
        onEnded={onDone}
      />
      <div className="absolute bottom-6 inset-x-0 flex justify-center px-4">
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur border border-white/15">
          <button onClick={toggleSound} className="text-sm text-white hover:text-white/70">
            {isMuted ? "🔇 Turn on sound" : "🔊 Sound on"}
          </button>
          <button onClick={onDone} className="text-sm text-white font-medium hover:text-white/70">
            Skip to site →
          </button>
        </div>
      </div>
    </div>
  );
}
