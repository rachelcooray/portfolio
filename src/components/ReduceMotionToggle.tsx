"use client";

import { useSyncExternalStore } from "react";
import {
  getReducedMotionOverride,
  setReducedMotionOverride,
  subscribeReducedMotionOverride,
} from "@/lib/lenis";

// Visible nav control: a visitor can't change their OS's prefers-reduced-
// motion setting from the page, so this gives them a manual override that
// persists (localStorage) and takes effect immediately - mainly stops
// Lenis's smooth scroll in favour of native/instant scroll right now;
// anything else built on prefersReducedMotion() (src/lib/lenis.ts) picks
// it up automatically too.
//
// useSyncExternalStore, subscribed to setReducedMotionOverride's own
// notifications: false on the server/first client render (matching
// static-exported HTML, no hydration mismatch), the real localStorage
// value after that - and re-renders on toggle, unlike a plain
// useState+useEffect read (which also hits this repo's set-state-in-
// effect lint rule - see FilmGate's useMounted for the same pattern).
function useReducedMotionOverride(): boolean {
  return useSyncExternalStore(subscribeReducedMotionOverride, getReducedMotionOverride, () => false);
}

export default function ReduceMotionToggle() {
  const reduced = useReducedMotionOverride();

  return (
    <button
      onClick={() => setReducedMotionOverride(!reduced)}
      aria-pressed={reduced}
      title="Reduce motion"
      className={`text-sm whitespace-nowrap transition-colors ${
        reduced ? "text-accent" : "text-text-muted hover:text-accent"
      }`}
    >
      {reduced ? "Motion: reduced" : "Reduce motion"}
    </button>
  );
}
