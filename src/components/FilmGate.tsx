"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import RobotToggle from "./RobotToggle";
import { hasSeenFilm, getResumeScene } from "@/movie/filmState";

const MovieMode = dynamic(() => import("./MovieMode"), { ssr: false });

type FilmLaunch = { scene: number; muted: boolean };

const noopSubscribe = () => () => {};

// Hydration-safe "are we on the client yet" check with no setState-in-effect
// needed: false on the server and on the first client render (matching the
// static-exported HTML), true from the next render once React reconciles
// against the real client snapshot. Standard useSyncExternalStore pattern
// for this exact case.
function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

// Owns the first-visit decision (client-only - localStorage isn't known at
// static-export/server-render time, so Page mode is what the initial HTML
// shows; a true first-time visitor sees it swapped for the film as soon as
// the client snapshot above resolves).
export default function FilmGate({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [watchRequest, setWatchRequest] = useState<FilmLaunch | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Derived, not stored: "mounted, never seen the film, and this session
  // hasn't already finished/skipped it" is just a read of existing
  // persisted state, not new state of its own.
  const autoLaunch: FilmLaunch | null =
    mounted && !dismissed && !hasSeenFilm() ? { scene: getResumeScene(), muted: true } : null;
  const launch = watchRequest ?? autoLaunch;

  const watchFilm = () => {
    // This click is the gesture, so unlock audio now (same trick
    // RobotToggle's own open button uses) and start with sound on.
    const unlock = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    );
    void unlock.play().catch(() => {});
    setWatchRequest({ scene: 0, muted: false });
  };

  const handleDone = () => {
    setWatchRequest(null);
    setDismissed(true);
    // Deferred a frame: MovieMode's own unmount (which restores
    // body.style.overflow) hasn't committed yet at this exact point, and
    // scrollTo is a no-op while overflow is still locked to "hidden".
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  return (
    <>
      {children}
      <RobotToggle onWatchFilm={mounted ? watchFilm : undefined} />
      {launch && <MovieMode startScene={launch.scene} startMuted={launch.muted} onDone={handleDone} />}
    </>
  );
}
