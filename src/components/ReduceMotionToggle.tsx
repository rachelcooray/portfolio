"use client";

import { useSyncExternalStore } from "react";
import { getReducedMotionOverride, setReducedMotionOverride, subscribeReducedMotionOverride } from "@/lib/lenis";

// A visitor cannot change their system motion setting from a page, so this
// gives them an override. It reloads so the 3D stage can switch to the
// static badge cleanly.
function useOverride(): boolean {
  return useSyncExternalStore(subscribeReducedMotionOverride, getReducedMotionOverride, () => false);
}

export default function ReduceMotionToggle() {
  const reduced = useOverride();
  return (
    <button
      type="button"
      className="motion-toggle"
      aria-pressed={reduced}
      onClick={() => {
        setReducedMotionOverride(!reduced);
        window.location.reload();
      }}
    >
      {reduced ? "Motion: reduced" : "Reduce motion"}
    </button>
  );
}
