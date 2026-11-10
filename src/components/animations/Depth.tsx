"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Pointer and scroll depth, for the whole site:
// - cards tilt toward the pointer with a moving highlight;
// - the hero portrait stage turns with the pointer;
// - photos turn slightly in 3D as they pass through the viewport, which
//   also works on touch screens.
// Off with reduced motion.
const TILT = ".dir-card, .project-row, .skill-group, .vol-card, .xp-card, .pub-card, .paper-card, .news-card, .degree-card, .contact-card, .progress-card";
const DRIFT = ".preview-photo img, .intro-photo img, .page-hero-image img, .statement figure img";

export default function Depth() {
  const path = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("rm")) return;
    root.classList.add("depth-on");

    let current: HTMLElement | null = null;
    const reset = () => {
      if (!current) return;
      current.style.removeProperty("--rx");
      current.style.removeProperty("--ry");
      current.classList.remove("tilting");
      current = null;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const stage = document.querySelector<HTMLElement>(".hv-stage");
      if (stage) {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        stage.style.setProperty("--hy", `${(nx * 14).toFixed(2)}deg`);
        stage.style.setProperty("--hx", `${(-ny * 10).toFixed(2)}deg`);
      }
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(TILT) ?? null;
      if (el !== current) reset();
      if (!el) return;
      current = el;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const max = Math.max(2.5, Math.min(9, 2400 / r.width));
      el.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 2 * max * 0.8).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
      el.classList.add("tilting");
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);

    const drift = Array.from(document.querySelectorAll<HTMLElement>(DRIFT));
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const el of drift) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) continue;
        const sp = Math.max(-1, Math.min(1, (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2)));
        el.style.setProperty("--sp", sp.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    drift.forEach((el) => el.classList.add("drift"));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      reset();
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  return null;
}
