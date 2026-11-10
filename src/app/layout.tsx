import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/components/layout/LenisProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollChrome from "@/components/layout/ScrollChrome";
import Reveal from "@/components/animations/Reveal";
import Depth from "@/components/animations/Depth";
import Scene3D from "@/components/three/Scene3D";
import "./site.css";

// Self-hosted (SIL Open Font License), so builds never depend on a font CDN.
// Fraunces for headlines, DM Sans for reading and UI, DM Mono for labels.
const fraunces = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/fraunces-300-600-normal.woff2", weight: "300 600", style: "normal" },
    { path: "../fonts/fraunces-300-500-italic.woff2", weight: "300 500", style: "italic" },
  ],
});

const dmSans = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "../fonts/dm-sans-400-600-normal.woff2", weight: "400 600", style: "normal" }],
});

const dmMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../fonts/dm-mono-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/dm-mono-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const description =
  "Rachel Cooray works at the intersection of technology, intelligence and real-world problems. Analyst, Data and AI at OCTAVE, John Keells Holdings, published researcher and co-founder of Layer1.Studio.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rachelcooray.com"),
  title: { default: "Rachel Cooray", template: "%s | Rachel Cooray" },
  description,
  openGraph: {
    type: "website",
    url: "https://rachelcooray.com",
    title: "Rachel Cooray",
    description,
    siteName: "Rachel Cooray",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Rachel Cooray, Analyst, Data and AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rachel Cooray",
    description,
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#FAF7EF",
  colorScheme: "light",
};

// Runs before first paint so the page never jumps between modes:
// "gl" for the 3D stage, "lite" for phones, low-power devices, reduced
// motion or no WebGL. Also decides whether the intro plays.
const modeScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var ls=null;try{ls=window.localStorage}catch(e){}var rm=matchMedia('(prefers-reduced-motion: reduce)').matches||(ls&&ls.getItem('rc-reduced-motion')==='1');var w=innerWidth,h=innerHeight;var n=navigator;var low=(n.deviceMemory&&n.deviceMemory<4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2);var gl=false;if(!rm&&w>=900&&h>=560&&!low){var c=document.createElement('canvas');var x=c.getContext('webgl2')||c.getContext('webgl');gl=!!x;if(x){var l=x.getExtension('WEBGL_lose_context');l&&l.loseContext()}}d.classList.add(gl?'gl':'lite');if(rm)d.classList.add('rm');var seen=ls&&ls.getItem('rc-intro-seen')==='1';d.classList.add(gl&&!seen?'intro-run':'intro-done');}catch(e){d.classList.add('lite','intro-done')}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <Scene3D />
        <LenisProvider />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <Navbar />
        <ScrollChrome />
        <main id="content">{children}</main>
        <Footer />
        <Reveal />
        <Depth />
      </body>
    </html>
  );
}
