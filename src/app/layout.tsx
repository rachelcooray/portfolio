import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Masthead from "@/components/mag/Masthead";
import BackPage from "@/components/mag/BackPage";
import AskLauncher from "@/components/mag/AskLauncher";
import Opening from "@/components/mag/Opening";
import "./mag.css";

// Self-hosted (SIL Open Font License), so builds never depend on a font CDN.
const garamond = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../fonts/eb-garamond-400-800-normal.woff2", weight: "400 800", style: "normal" },
    { path: "../fonts/eb-garamond-400-800-italic.woff2", weight: "400 800", style: "italic" },
  ],
});

const plexSans = localFont({
  variable: "--font-body",
  display: "swap",
  src: [{ path: "../fonts/ibm-plex-sans-100-700-normal.woff2", weight: "100 700", style: "normal" }],
});

const plexMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../fonts/ibm-plex-mono-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-mono-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const description =
  "Rachel Cooray, Analyst, Data and AI at OCTAVE, John Keells Holdings. Published researcher at IEEE ICAHS 2025. First Class Computer Science graduate, University of Westminster.";

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
  twitter: { card: "summary_large_image", title: "Rachel Cooray", description, images: ["/og.png"] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#FAF7EF", colorScheme: "light" };

// Decides before first paint whether the magazine opening plays: only on the
// cover, once per visit, never with reduced motion.
const OPENING = `try{var p=location.pathname;if((p==='/'||p==='/index.html')&&!sessionStorage.getItem('rc-opened')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${garamond.variable} ${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: OPENING }} />
      </head>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <div className="shell">
          <Masthead />
          <div className="leaf">
            <main id="content">{children}</main>
            <BackPage />
          </div>
        </div>
        <AskLauncher />
        <Opening />
      </body>
    </html>
  );
}
