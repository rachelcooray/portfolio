import { skillCloud } from "@/content/content";

// Category colours on the olive-deep panel. Each passes WCAG AA (4.5:1) there.
const COLOURS: Record<string, string> = {
  think: "#c6b6ea",
  data: "#8fbfee",
  ai: "#c7d42b",
  insight: "#e0c58f",
  product: "#e39b76",
  delivery: "#f3eee0",
};

// Several colours print as similar greys, so in print each word carries a
// two letter prefix that the legend repeats.
const PREFIX: Record<string, string> = { think: "TH", data: "DA", ai: "AI", insight: "IN", product: "PR", delivery: "DE" };

// Biggest words in the middle, smaller ones fanning out to both sides, the
// way a word cloud reads. Each word floats gently on its own rhythm.
function centreOut<T>(items: T[]) {
  const out: T[] = [];
  items.forEach((it, i) => (i % 2 ? out.push(it) : out.unshift(it)));
  return out;
}

export default function SkillCloud() {
  const sorted = [...skillCloud].sort((a, b) => b.weight - a.weight);
  const words = centreOut(sorted);
  return (
    <figure className="cloud" aria-label="Skills, sized by how much I use them">
      <ul className="cloud-words">
        {words.map((w, i) => (
          <li
            key={w.name}
            className={`cloud-w w${w.weight}`}
            style={{ color: COLOURS[w.group], ["--d" as string]: `${(i % 7) * 0.35}s`, ["--i" as string]: i }}
          >
            <span className="cloud-p" aria-hidden="true">{PREFIX[w.group]}</span>
            {w.name}
          </li>
        ))}
      </ul>
      <figcaption className="cloud-key">
        <span>Bigger means I use it more.</span>
        {Object.entries({ think: "Thinking", data: "Data", ai: "AI", insight: "Insight", product: "Products", delivery: "Delivery" }).map(([k, v]) => (
          <span key={k} className="cloud-k">
            <i style={{ background: COLOURS[k] }} />
            <span className="cloud-p" aria-hidden="true">{PREFIX[k]}</span>
            {v}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
