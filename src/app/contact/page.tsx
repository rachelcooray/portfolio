import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/contact/ContactForm";
import { identity } from "@/content/content";

export const metadata: Metadata = { title: "Contact", description: "Email, LinkedIn, GitHub, ORCID, Layer1.Studio and a contact form." };

export default function Contact() {
  const link = (label: string) => identity.links.find((l) => l.label === label)?.href ?? "#";
  return (
    <section className="contact-page">
      <div className="wrap contact-grid">
        <div data-reveal>
          <p className="eyebrow">
            <span className="mono">10</span> Contact
          </p>
          <h1>Let&apos;s build something meaningful.</h1>
          <p className="lead">For professional opportunities, collaborations, research conversations and interesting ideas.</p>
          <div className="contact-card">
            <Image src={identity.badgePhoto} width={72} height={72} alt={identity.badgePhotoAlt} />
            <dl className="contact-list">
              <div>
                <dt className="mono">Email</dt>
                <dd>
                  <a href={`mailto:${identity.email}`}>{identity.email}</a>
                </dd>
              </div>
              <div>
                <dt className="mono">LinkedIn</dt>
                <dd>
                  <a href={link("LinkedIn")}>linkedin.com/in/rachel-cooray-069034235</a>
                </dd>
              </div>
              <div>
                <dt className="mono">GitHub</dt>
                <dd>
                  <a href={link("GitHub")}>github.com/rachelcooray</a>
                </dd>
              </div>
              <div>
                <dt className="mono">ORCID</dt>
                <dd>
                  <a href={link("ORCID")}>orcid.org/{identity.orcid}</a>
                </dd>
              </div>
              <div>
                <dt className="mono">Layer1.Studio</dt>
                <dd>
                  <a href="https://layer1.studio/">layer1.studio</a>
                </dd>
              </div>
              <div>
                <dt className="mono">Location</dt>
                <dd>{identity.location}</dd>
              </div>
            </dl>
            <a className="btn btn-line" href={link("CV")}>
              Download CV (PDF)
            </a>
          </div>
        </div>
        <div className="form-wrap" data-reveal>
          <h2 className="h-small">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
