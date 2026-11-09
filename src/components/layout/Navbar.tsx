"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ALL_PAGES, MAIN_NAV } from "./nav-data";

const PARENT: Record<string, string> = { "/education": "/about", "/achievements": "/beyond-work", "/media": "/beyond-work" };

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  const own = path === href || path.startsWith(`${href}/`);
  const viaParent = Object.entries(PARENT).some(([child, parent]) => parent === href && path.startsWith(child));
  return own || viaParent;
}

export function LogoMark() {
  return (
    <Link href="/" className="logomark" aria-label="Rachel Cooray, home">
      RC<span>.</span>
    </Link>
  );
}

export default function Navbar() {
  const path = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <LogoMark />
        <nav aria-label="Main" className="nav-main">
          <ul className="nav-list">
            {MAIN_NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="nav-link" aria-current={isActive(path, n.href) ? "page" : undefined}>
                  {n.label}
                  <span className="active-indicator" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-small nav-cv" href="/rachelcooray-cv.pdf">
          Download CV
        </a>
        <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div id="site-menu" className="menu-panel">
          <ul>
            {ALL_PAGES.map((n, i) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={isActive(path, n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <a className="btn" href="/rachelcooray-cv.pdf">
            Download CV
          </a>
        </div>
      )}
    </header>
  );
}
