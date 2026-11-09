import { identity } from "@/content/content";

export default function SocialLinks({ className = "foot-list" }: { className?: string }) {
  return (
    <ul className={className}>
      {identity.links.map((l) => (
        <li key={l.label}>
          <a href={l.href}>{l.label === "CV" ? "Download CV" : l.label}</a>
        </li>
      ))}
    </ul>
  );
}
