"use client";

import { useEffect, useRef } from "react";
import { Guide } from "@/robot/Guide";

/**
 * Mounts the robot guide into a full-size canvas and hands the live Guide
 * instance up to the parent once loaded, so the parent can drive a
 * TourController from it. Client-only (three.js needs window/canvas).
 */
export default function Robot({ onGuideReady }: { onGuideReady: (guide: Guide) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const guide = new Guide(canvas);
    void guide.load("/models/robot.glb").then(() => onGuideReady(guide));

    return () => {
      guide.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}
