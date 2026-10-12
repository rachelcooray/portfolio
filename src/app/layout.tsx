import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Rachel Cooray | AI Analyst and Researcher",
  description:
    "Rachel Cooray is an Analyst for Data and AI at OCTAVE, John Keells Holdings, and a published IEEE researcher building AI and analytics that people can understand and act on.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}
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
