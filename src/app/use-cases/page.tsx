import type { Metadata } from "next";
import Link from "next/link";
import Folio from "@/components/mag/Folio";
import ValueChain from "@/components/mag/ValueChain";
import { magazine } from "@/content/content";

export const metadata: Metadata = {
  title: "From the factory production line to the outlet shelves",
  description: "The AI and analytics use cases I own at OCTAVE, and my part in each.",
};

export default function UseCases() {
  return (
    <div className="wrap page">
      <Folio right="Cover story, 04" />
      <div className="feature-head">
        <h1>{magazine.useCasesHeadline}</h1>
        <p>{magazine.useCasesDeck}</p>
      </div>
      <ValueChain />
      <div className="cases">
        {magazine.useCases.map((u, i) => (
          <article key={u.id} id={u.id} className="case">
            <span className="tag">
              {String(i + 1).padStart(2, "0")}, {u.code}, {u.stage}, Owned
            </span>
            <h2>
              <Link prefetch href={`/use-cases/${u.id}`} className="case-link">
                {u.headline}
              </Link>
            </h2>
            <p className="case-name">{u.name}</p>
            <p>{u.line}</p>
            <p className="part">
              <b>My part.</b> {u.part}
            </p>
            <Link prefetch href={`/use-cases/${u.id}`} className="case-more">
              Problem, solution, value and my part
              <span className="sr-only">: {u.name}</span>
            </Link>
          </article>
        ))}
      </div>
      <div className="band">
        <p className="q">{magazine.measureQuote}</p>
        <div className="side">
          <span className="kicker">How I deliver</span>
          <span>{magazine.delivery.join(", ")}</span>
        </div>
      </div>
      <p className="small muted">{magazine.confidentiality}</p>
    </div>
  );
}
