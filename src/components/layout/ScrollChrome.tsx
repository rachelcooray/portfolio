"use client";

import { useEffect, useState } from "react";

// ScrollProgress (thin bar under the nav) and BackToTop, in one listener.
export default function ScrollChrome() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" style={{ transform: `scaleX(${p})` }} />
      <button
        type="button"
        className={`back-to-top${p > 0.15 ? " show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: document.documentElement.classList.contains("rm") ? "auto" : "smooth" })}
        aria-label="Back to top"
        tabIndex={p > 0.15 ? 0 : -1}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </>
  );
}
