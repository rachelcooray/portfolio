"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades sections up as they arrive. Content is visible without JS and with
// reduced motion. Re-runs on every page change.
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
    if (root.classList.contains("rm") || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    root.classList.add("reveal-on");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);
  return null;
}
