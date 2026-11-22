"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// The magazine's contents, as a spine down the left edge. Page numbers match
// the contents page on the cover.
export const MAG_NAV = [
  { href: "/use-cases", label: "Use cases", n: "04" },
  { href: "/research", label: "Research", n: "12" },
  { href: "/projects", label: "Projects", n: "14" },
  { href: "/experience", label: "Experience", n: "16" },
  { href: "/education", label: "Education", n: "20" },
  { href: "/volunteering", label: "Volunteering", n: "24" },
  { href: "/achievements", label: "Achievements", n: "26" },
  { href: "/news", label: "In the news", n: "28" },
  { href: "/skills", label: "Skills", n: "29" },
  { href: "/pictures", label: "In pictures", n: "30" },
];

export default function Masthead() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <aside className={open ? "spine is-open" : "spine"}>
      <div className="spine-top">
        <Link href="/" className="spine-mark" aria-label="Rachel Cooray, cover">
          <span>Rachel</span> <span>Cooray</span>
        </Link>
        <span className="spine-issue">Issue 01 · November 2026</span>
        <button type="button" className="spine-toggle" aria-expanded={open} aria-controls="spine-nav" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Contents"}
        </button>
      </div>
      <nav id="spine-nav" className="spine-nav" aria-label="Contents" onClick={() => setOpen(false)}>
        <Link href="/" className="spine-link" aria-current={path === "/" ? "page" : undefined}>
          <span className="spine-label">Cover</span>
          <span className="spine-leader" aria-hidden="true" />
          <span className="spine-n">01</span>
        </Link>
        {MAG_NAV.map((n) => (
          <Link key={n.href} href={n.href} className="spine-link" aria-current={active(n.href) ? "page" : undefined}>
            <span className="spine-label">{n.label}</span>
            <span className="spine-leader" aria-hidden="true" />
            <span className="spine-n">{n.n}</span>
          </Link>
        ))}
        <a className="spine-cv" href="/rachelcooray-cv.pdf">
          Download CV
        </a>
      </nav>
    </aside>
  );
}
