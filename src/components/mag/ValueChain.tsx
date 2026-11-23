import { magazine } from "@/content/content";

const ICONS: Record<string, React.ReactNode> = {
  factory: (
    <>
      <path d="M3 21V10l6 4v-4l6 4V5h6v16z" />
      <path d="M3 21h18" />
    </>
  ),
  truck: (
    <>
      <path d="M1 6h13v11H1z" />
      <path d="M14 10h4l3 3.5V17h-7z" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  warehouse: (
    <>
      <path d="M3 21V9l9-5 9 5v12" />
      <path d="M7 21v-8h10v8" />
      <path d="M7 17h10" />
    </>
  ),
  shop: (
    <>
      <path d="M4 10v11h16V10" />
      <path d="M3 10l2-6h14l2 6z" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
};

// A PET bottle of soft drink and an ice cream cone, the two products the
// use cases move from factory to outlet.
const BOTTLE = (
  <svg viewBox="0 0 16 30" width="16" height="30">
    <rect x="5.5" y="0.5" width="5" height="3" rx="0.6" fill="#46521a" />
    <path d="M6 3.5h4v2.5c0 1 3.5 2 3.5 5V27a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 27V11c0-3 3.5-4 3.5-5z" fill="#dde3b0" stroke="#46521a" strokeWidth="1" />
    <rect x="2.5" y="15" width="11" height="6" fill="#c7d42b" stroke="#46521a" strokeWidth="1" />
  </svg>
);

const CONE = (
  <svg viewBox="0 0 16 30" width="16" height="30">
    <circle cx="8" cy="8" r="6.5" fill="#f4dfc9" stroke="#46521a" strokeWidth="1" />
    <circle cx="5.5" cy="6" r="1" fill="#6b5436" />
    <path d="M2 12.5h12L8 29.5z" fill="#c9a26b" stroke="#46521a" strokeWidth="1" strokeLinejoin="round" />
    <path d="M4.5 15.5l6 4M11.5 15.5l-6 4M6 21l3.5 3" stroke="#6b5436" strokeWidth="0.8" fill="none" />
  </svg>
);

// Factory to outlet, with crates moving along the line. Motion stops for
// people who ask for reduced motion (see mag.css).
export default function ValueChain() {
  return (
    <section className="chain" aria-label="Where each use case sits in the value chain">
      <div className="chain-top">
        <span className="kicker">The value chain · where each use case sits</span>
        { }
        <img loading="lazy" decoding="async" src="/images/logo-octave.jpeg" alt="OCTAVE" />
      </div>
      <div className="chain-body">
        <div className="chain-track" aria-hidden="true">
          {["bottle", "cone", "bottle", "cone"].map((k, i) => (
            <span key={i} className="chain-crate" style={{ animationDelay: `${-i * 2.25}s` }}>
              {k === "bottle" ? BOTTLE : CONE}
            </span>
          ))}
        </div>
        <ol className="chain-stops">
          {magazine.chain.map((c) => (
            <li key={c.stage} className="chain-stop">
              <span className="chain-node">
                <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                  {ICONS[c.icon]}
                </svg>
              </span>
              <span className="chain-text">
                <span className="chain-stage">{c.stage}</span>
                <span className="chain-label">{c.label}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
