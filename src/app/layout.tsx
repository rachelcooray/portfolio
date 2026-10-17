import type { Metadata } from "next";
import { Fraunces, Figtree, Instrument_Serif, Manrope, IBM_Plex_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";
import "./badge.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Badge/archive design (15 Oct 2026) - the typography from Rachel's HTML
// prototype ("Meet Rachel" badge-and-lanyard design), now the page's own
// fonts. Fraunces/Figtree above stay only for the case-study pages, which
// predate this design and weren't part of the prototype.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Rachel Cooray | AI Analyst and Researcher",
  description:
    "Rachel Cooray is an Analyst for Data and AI at OCTAVE, John Keells Holdings, and a published IEEE researcher building AI and analytics that people can understand and act on.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${figtree.variable} ${instrumentSerif.variable} ${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        <LenisProvider />
        <div className="bg-color-field" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        {children}
      </body>
    </html>
  );
}
