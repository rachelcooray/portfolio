"use client";

import { useEffect, useRef } from "react";
import { Guide } from "@/robot/Guide";

/**
 * Mounts the robot guide into a full-size canvas. Client-only (three.js
 * needs window/canvas), lazy-loaded from page.tsx after first paint per
 * the master prompt's loading spec. For now (Milestone 3) this just loads
 * and renders the robot with cursor tracking — the tour/voice/pointAt
 * wiring is Milestone 4+.
 */
export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guideRef = useRef<Guide | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const guide = new Guide(canvas);
    guideRef.current = guide;
    void guide.load("/models/robot.glb");

    return () => {
      guide.destroy();
      guideRef.current = null;
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
