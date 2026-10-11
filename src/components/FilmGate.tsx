"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { hasSeenFilm } from "@/movie/filmState";

// RobotToggle (the Page-mode 3D robot panel: tour narration, pointAt/
// highlighter on scroll) is paused per Rachel's request - not deleted,
// just not rendered. Re-enable by restoring the import above and the
// <RobotToggle /> line below. The video intro (VideoIntro) is unrelated
// to the robot and stays active either way.
// import RobotToggle from "./RobotToggle";

const VideoIntro = dynamic(() => import("./VideoIntro"), { ssr: false });

type FilmLaunch = { muted: boolean };

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
// shows; a true first-time visitor sees it swapped for the intro video as
// soon as the client snapshot above resolves).
export default function FilmGate({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  const [watchRequest, setWatchRequest] = useState<FilmLaunch | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Derived, not stored: "mounted, never seen the intro, and this session
  // hasn't already finished/skipped it" is just a read of existing
  // persisted state, not new state of its own.
  const autoLaunch: FilmLaunch | null = mounted && !dismissed && !hasSeenFilm() ? { muted: true } : null;
  const launch = watchRequest ?? autoLaunch;

  // Was wired to RobotToggle's "Watch the intro" button - no UI calls
  // this while the robot panel is paused (see import note above), so
  // returning visitors currently have no way to replay the video. Restore
  // together with RobotToggle if that's wanted back before the robot is.
  // const watchFilm = () => {
  //   // This click is the gesture, so unlock audio now (same trick
  //   // RobotToggle's own open button uses) and start with sound on.
  //   const unlock = new Audio(
  //     "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
  //   );
  //   void unlock.play().catch(() => {});
  //   setWatchRequest({ muted: false });
  // };

  const handleDone = () => {
    setWatchRequest(null);
    setDismissed(true);
    // Deferred a frame: VideoIntro's own unmount (which restores
    // body.style.overflow) hasn't committed yet at this exact point, and
    // scrollTo is a no-op while overflow is still locked to "hidden".
    requestAnimationFrame(() => window.scrollTo(0, 0));
  };

  return (
    <>
      {children}
      {launch && <VideoIntro startMuted={launch.muted} onDone={handleDone} />}
    </>
  );
}
