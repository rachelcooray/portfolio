"use client";

import { useEffect } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";

// Mounted once at the app root (layout.tsx). Renders nothing - just owns
// the Lenis instance's lifecycle for the page.
export default function LenisProvider() {
  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);
  return null;
}
