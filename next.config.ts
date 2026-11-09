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
  // Lets a phone on the same Wi-Fi load the dev server's scripts at the
  // Mac's network address. Dev only; the static export ignores it.
  allowedDevOrigins: ["192.168.8.133", "*.local"],
};

export default nextConfig;
