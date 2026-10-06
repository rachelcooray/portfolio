import type { CSSProperties } from "react";

// Crop rectangles (source pixels) into /public/images/sl-motifs.png, a
// 1536x1024 sheet of Sri Lankan-style decorative ornaments Rachel supplied.
// No image-editing tool is available, so "cropping" is done in CSS via
// background-size + background-position: the whole sheet is scaled up so
// that one source pixel maps to `scale` display pixels, then shifted so the
// desired rectangle lands in the (width x height) box.
const SHEET_W = 1536;
const SHEET_H = 1024;

type Crop = { sx: number; sy: number; sw: number; sh: number };

export const MOTIFS = {
  // Circular leaf/lotus wreath, left-middle of the sheet — for framing a photo.
  wreath: { sx: 45, sy: 315, sw: 360, sh: 360 },
  // Long ornate scroll-cap ribbon bar, bottom-center of the sheet.
  ribbon: { sx: 305, sy: 675, sw: 755, sh: 80 },
  // Thin rule + single lotus, top-center of the sheet.
  topLine: { sx: 338, sy: 55, sw: 905, sh: 85 },
  // Thin rule + small flower/diamonds, lower-center of the sheet.
  bottomLine: { sx: 365, sy: 782, sw: 400, sh: 68 },
} satisfies Record<string, Crop>;

// The source sheet is painted on an opaque cream card, not a transparent
// background, so a plain rectangular crop shows up as a pasted-on box no
// matter what's behind it. Two things fix that: `multiply` blending drops
// the cream out against whatever page background sits behind it (leaving
// just the ink linework), and a mask gradient feathers the crop's own
// edges so the artwork dissolves at the boundary instead of cutting off
// mid-line.
type Feather = "circle" | "horizontal" | "none";

export function motifStyle(
  crop: Crop,
  target: { width: number } | { height: number },
  feather: Feather = "horizontal",
): CSSProperties {
  const scale = "width" in target ? target.width / crop.sw : target.height / crop.sh;
  const mask =
    feather === "circle"
      ? "radial-gradient(circle, black 78%, transparent 100%)"
      : feather === "horizontal"
        ? "radial-gradient(ellipse at center, black 45%, transparent 95%)"
        : undefined;
  return {
    backgroundImage: "url(/images/sl-motifs.png)",
    backgroundRepeat: "no-repeat",
    backgroundSize: `${SHEET_W * scale}px ${SHEET_H * scale}px`,
    backgroundPosition: `${-crop.sx * scale}px ${-crop.sy * scale}px`,
    width: crop.sw * scale,
    height: crop.sh * scale,
    mixBlendMode: "multiply",
    ...(mask ? { WebkitMaskImage: mask, maskImage: mask } : {}),
  };
}
