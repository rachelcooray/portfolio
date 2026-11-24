import { identity, magazine } from "@/content/content";
import ContactForm from "@/components/mag/ContactForm";

export default function BackPage() {
  const tel = identity.phone.replace(/\s/g, "");
  return (
    <footer className="back" id="contact">
      <div className="wrap">
        <div className="back-row">
          <div className="back-main">
            <span className="back-who">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/mag/rachel-face.webp" alt="Rachel Cooray" width={64} height={64} loading="lazy" />
              <span className="kicker">Contact</span>
            </span>
            <h2 className="back-line">Write to me about a role, a project or research.</h2>
            <p className="back-sub">I welcome conversations about AI and analytics, research collaboration and guest lectures.</p>
            <ContactForm fallbackEmail={identity.email} />
          </div>
          <div className="back-links">
            <p className="back-quote">{magazine.backPage}</p>
            <span>{identity.email}</span>
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
          <span>
            {magazine.footerLine} © {identity.copyright}
          </span>
          <span>
            {magazine.issue}, {magazine.issueDate}
          </span>
        </div>
      </div>
    </footer>
  );
}
