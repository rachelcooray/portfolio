import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page" style={{ paddingTop: 48 }}>
      <span className="kicker">Error 404</span>
      <h1 style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.95, color: "var(--olive)" }}>This page isn&apos;t in this issue.</h1>
      <p className="muted">The site was redesigned as a magazine, so older links may have moved.</p>
      <div className="btn-row">
        <Link className="btn" href="/">
          Back to the cover
        </Link>
        <Link className="btn btn-line" href="/use-cases">
          See the work
        </Link>
      </div>
    </div>
  );
}
