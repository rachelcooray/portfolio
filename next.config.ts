import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Hides the dev-mode build-activity indicator (bottom-left "N" badge).
  // Dev-only either way — never appears in the production export — but
  // distracting while reviewing the preview.
  devIndicators: false,
};

export default nextConfig;
