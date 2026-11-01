"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { sections, type SectionId } from "@/content/content";
import { goToSection, openAsk } from "@/lib/ask";
import { scrollToTarget } from "@/lib/lenis";

const SHORT: Partial<Record<SectionId, string>> = {
  work: "Work",
  news: "News",
  ask: "Ask",
  achievements: "Awards",
};

export default function Header() {
  const [current, setCurrent] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const line = window.innerHeight * 0.35;
      let cur: SectionId | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) cur = s.id;
      }
      setCurrent(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Menu overlay: focus the first link, trap Tab, close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const links = [...(menu?.querySelectorAll<HTMLElement>("a, button") ?? [])];
    links[1]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
      if (e.key === "Tab" && links.length) {
        const first = links[0],
          last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (id: SectionId, e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    if (id === "ask") {
      goToSection("ask");
      return;
    }
    goToSection(id);
  };

  return (
    <>
      <a className="skiplink" href="#main">
        Skip to content
      </a>
      <header className={`hdr${scrolled ? " scrolled" : ""}`}>
        <a
          className="mark"
          href="#top"
          aria-label="Rachel Cooray, back to the start"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(document.body);
            history.replaceState(null, "", "#top");
          }}
        >
          RC
        </a>
        <nav className="hdr-nav" aria-label="Sections">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={current === s.id ? "location" : undefined}
                  onClick={(e) => go(s.id, e)}
                >
                  {SHORT[s.id] ?? s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="hdr-tools">
          <button type="button" className="ask-btn" onClick={() => openAsk()} aria-label="Ask about Rachel. Shortcut: slash">
            <span>Ask</span>
            <kbd aria-hidden="true">/</kbd>
          </button>
          <button
            type="button"
            className="menu-btn"
            ref={menuBtnRef}
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="menu"
        className={`menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="All sections"
        hidden={!menuOpen}
        ref={menuRef}
      >
        <button type="button" className="menu-close" onClick={() => setMenuOpen(false)}>
          Close
        </button>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={(e) => go(s.id, e)}>
                <span className="num">{s.number}</span>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
