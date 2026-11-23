import { identity, magazine } from "@/content/content";

export default function BackPage() {
  const tel = identity.phone.replace(/\s/g, "");
  return (
    <footer className="back" id="contact">
      <div className="wrap">
        <div className="back-row">
          <div>
            <span className="back-who">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/mag/rachel-face.webp" alt="Rachel Cooray" width={64} height={64} loading="lazy" />
              <span className="kicker">Contact · Get in touch</span>
            </span>
            <p className="back-line">{magazine.backPage}</p>
          </div>
          <div className="back-links">
            <a href={`mailto:${identity.email}`}>{identity.email}</a>
            <a href={`tel:${tel}`}>{identity.phone}</a>
            {identity.links
              .filter((l) => l.label !== "Email")
              .map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            <span>{identity.location}</span>
          </div>
        </div>
        <div className="back-meta">
          <span>{magazine.footerLine} © {identity.copyright}</span>
          <span>
            {magazine.issue} · {magazine.issueDate}
          </span>
        </div>
      </div>
    </footer>
  );
}
