import Image from "next/image";
import type { ReactNode } from "react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

// Typography system: PageHero (page title block) and SectionHeading.

export function PageHero({
  num,
  label,
  title,
  lead,
  crumbs,
  image,
  children,
}: {
  num: string;
  label: string;
  title: string;
  lead?: string;
  crumbs?: { href?: string; label: string }[];
  image?: { src: string; w: number; h: number; alt: string; className?: string };
  children?: ReactNode;
}) {
  return (
    <header className={`page-hero wrap${image ? " has-image" : ""}`}>
      <div className="page-hero-copy" data-reveal>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <p className="eyebrow">
          <span className="mono">{num}</span> {label}
        </p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
      {image && (
        <figure className={`page-hero-image ${image.className ?? ""}`} data-reveal>
          <Image src={image.src} width={image.w} height={image.h} alt={image.alt} priority />
        </figure>
      )}
    </header>
  );
}

export function SectionHeading({ kicker, title, children, light }: { kicker: string; title: string; children?: ReactNode; light?: boolean }) {
  return (
    <div className={`sec-head${light ? " light" : ""}`} data-reveal>
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {children && <div className="sec-intro">{children}</div>}
    </div>
  );
}
