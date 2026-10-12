"use client";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Module-level singleton rather than React context: nav links, the film
// overlay, and the GSAP ticker all need the same instance, and none of
// them need to re-render when it changes - a plain getter is simpler and
// avoids a provider-order footgun (something reading the instance before
// the provider's effect has run).
let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Called once from LenisProvider. Disabled entirely under reduced motion
// (not just detuned) - native scroll behaviour takes over completely.
export function initLenis(): Lenis | null {
  if (lenis || typeof window === "undefined") return lenis;
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.1, // gentle/premium, not floaty - default easing
    syncTouch: false, // leave native touch scrolling on mobile
  });

  lenis.on("scroll", ScrollTrigger.update);

  const onTick = (time: number) => {
    // gsap.ticker gives seconds; Lenis.raf expects an rAF-style ms timestamp.
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export function stopLenis() {
  lenis?.stop();
}

export function startLenis() {
  lenis?.start();
}

// Shared by nav links and "Skip to site" - offsets for the sticky header
// so the target section doesn't land underneath it. Falls back to a plain
// instant jump when Lenis is disabled (reduced motion).
export function scrollToTarget(target: string | HTMLElement, opts: { immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const header = document.querySelector("header");
  const offset = header ? -header.getBoundingClientRect().height : 0;

  if (lenis) {
    if (opts.immediate) lenis.scrollTo(el, { offset, immediate: true });
    else lenis.scrollTo(el, { offset, duration: 1.1 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: opts.immediate ? "auto" : "smooth" });
  }
}
