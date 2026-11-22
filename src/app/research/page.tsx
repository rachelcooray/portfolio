import type { Metadata } from "next";
import Folio from "@/components/mag/Folio";
import { research } from "@/content/content";

export const metadata: Metadata = {
  title: "PCOS Care",
  description: "PCOS Care, a machine learning web app for early PCOS risk screening, published at IEEE ICAHS 2025.",
};

export default function Research() {
  const p = research.paper;
  return (
    <div className="wrap page">
      <Folio right="Research · 12" />
      <div className="research">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="kicker">Applied machine learning · {p.venue}</span>
          <h1>PCOS Care</h1>
          <p className="dek">A final year project that became a published paper.</p>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/pcos-showcase.webp" alt="Rachel presenting PCOS Care to judges and standing beside her research poster" width={1606} height={1198} style={{ aspectRatio: "4 / 3" }} />
            <figcaption>The Westminster final year project showcase, 2025.</figcaption>
          </figure>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <p className="lede">{p.description}</p>
          <p>
            <b>Method.</b> {p.method}
          </p>
          <p className="pull">A solution should be useful, understandable and sustainable.</p>
          <dl className="facts">
            <div>
              <dt>Paper</dt>
              <dd>{p.title}</dd>
            </div>
            <div>
              <dt>Authors</dt>
              <dd>{p.authors}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{p.venue}</dd>
            </div>
            <div>
              <dt>Recognition</dt>
              <dd>{p.award}</dd>
            </div>
          </dl>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/pcos-app.webp" alt="The PCOS Care web app home page, with risk assessment and results features" width={2000} height={1250} style={{ aspectRatio: "16 / 10", objectPosition: "top", border: "1px solid var(--line)" }} />
            <figcaption>The PCOS Care web app: information, a simple and an enhanced risk assessment, and visualised results.</figcaption>
          </figure>
          <div className="btn-row">
            <a className="btn" href={p.doiUrl}>
              Read the paper
            </a>
            <a className="btn btn-line" href={p.appUrl}>
              Try the app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
