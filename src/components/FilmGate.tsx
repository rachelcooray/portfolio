"use client";

import { useState, type ReactNode } from "react";
// import { useSyncExternalStore } from "react"; // only needed by useMounted below
import dynamic from "next/dynamic";
// import { hasSeenFilm } from "@/movie/filmState"; // only needed by the paused autoLaunch below
import { getLenis } from "@/lib/lenis";

// RobotToggle (the Page-mode 3D robot panel: tour narration, pointAt/
// highlighter on scroll) is paused per Rachel's request - not deleted,
// just not rendered. Re-enable by restoring the import above and the
// <RobotToggle /> line below. The video intro (VideoIntro) is unrelated
// to the robot and stays active either way.
// import RobotToggle from "./RobotToggle";

const VideoIntro = dynamic(() => import("./VideoIntro"), { ssr: false });

type FilmLaunch = { muted: boolean };

// const noopSubscribe = () => () => {}; // only needed by useMounted below

// Hydration-safe "are we on the client yet" check with no setState-in-effect
// needed: false on the server and on the first client render (matching the
// static-exported HTML), true from the next render once React reconciles
// against the real client snapshot. Standard useSyncExternalStore pattern
// for this exact case. Only needed by the paused autoLaunch below - see
// its restore note for how this plugs back in.
// function useMounted(): boolean {
//   return useSyncExternalStore(
//     noopSubscribe,
//     () => true,
//     () => false,
//   );
// }

// Owns the first-visit decision (client-only - localStorage isn't known at
// static-export/server-render time, so Page mode is what the initial HTML
// shows; a true first-time visitor sees it swapped for the intro video as
// soon as the client snapshot above resolves).
export default function FilmGate({ children }: { children: ReactNode }) {
  // Video intro paused per Rachel's request (15 Oct 2026, while she tries
  // scroll-scrubbed B-roll footage instead) - not deleted. To restore:
  // uncomment the hasSeenFilm import above, bring back
  // `const mounted = useMounted();` and `const [dismissed, setDismissed]`
  // below, and swap autoLaunch back to
  // `mounted && !dismissed && !hasSeenFilm() ? { muted: true } : null`.
  const [watchRequest, setWatchRequest] = useState<FilmLaunch | null>(null);
  const [, setDismissed] = useState(false);
  const autoLaunch: FilmLaunch | null = null;
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
    // body.style.overflow and restarts Lenis) hasn't committed yet at
    // this exact point, and scrollTo is a no-op while overflow is still
    // locked to "hidden".
    requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    });
  };

  return (
    <>
      {children}
      {launch && <VideoIntro startMuted={launch.muted} onDone={handleDone} />}
    </>
  );
}
