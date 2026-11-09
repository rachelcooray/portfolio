import Link from "next/link";
import { identity } from "@/content/content";
import { ALL_PAGES } from "./nav-data";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap foot-grid">
        <div>
          <p className="foot-name">
            Rachel Cooray<span>.</span>
          </p>
          <p className="muted">A multidisciplinary technologist. {identity.location}.</p>
        </div>
        <nav aria-label="All pages">
          <ul className="foot-list two-col">
            {ALL_PAGES.map((p, i) => (
              <li key={p.href}>
                <Link href={p.href}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span> {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks />
      </div>
      <div className="wrap foot-base mono">
        <span>© {identity.copyright}</span>
        <span>Personal portfolio · 2026</span>
      </div>
    </footer>
  );
}
