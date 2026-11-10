import Image from "next/image";
import Link from "next/link";
import { identity, site } from "@/content/content";

// The homepage hero visual: Rachel's own portrait on a lavender arch, with
// the four areas of her work as links around it.
export default function HeroVisual() {
  return (
    <figure className="hero-visual" data-reveal>
      <div className="hv-stage">
        <span className="hv-arch" aria-hidden="true" />
        <span className="hv-orbit" aria-hidden="true">
          <i />
        </span>
        <span className="hv-sun" aria-hidden="true" />
        <span className="hv-leaf" aria-hidden="true" />
        <Image className="hv-portrait" src={identity.portrait} width={679} height={1366} alt={identity.portraitAlt} priority />
      </div>
      <nav className="hv-areas" aria-label="Four areas of my work">
        {site.world.map((w, i) => (
          <Link key={w.title} href={w.href} className={`hv-chip c${i + 1}`}>
            <span className="mono">0{i + 1}</span>
            {w.title}
          </Link>
        ))}
      </nav>
    </figure>
  );
}
