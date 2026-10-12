"use client";

import type { ReactNode, MouseEvent } from "react";
import { scrollToTarget } from "@/lib/lenis";

// Drop-in <a> replacement for same-page #hash links (nav, Impact Strip)
// that routes the jump through Lenis instead of the browser's native
// instant anchor jump, with a header-height offset either way.
export default function SmoothLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollToTarget(href);
    history.pushState(null, "", href);
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
