import { skillCloud } from "@/content/content";

const COLOURS: Record<string, string> = {
  think: "#2b2318",
  data: "#46521a",
  ai: "#2c4a6b",
  insight: "#7a6142",
  product: "#5e6b26",
  delivery: "#8a4b2a",
};

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
            className={`cloud-w w${w.weight}${w.weight <= 2 && i % 3 === 0 ? " tilt" : ""}`}
            style={{ color: COLOURS[w.group], ["--d" as string]: `${(i % 7) * 0.35}s`, ["--i" as string]: i }}
          >
            {w.name}
          </li>
        ))}
      </ul>
      <figcaption className="cloud-key">
        <span>Bigger means I use it more.</span>
        {Object.entries({ think: "Thinking", data: "Data", ai: "AI", insight: "Insight", product: "Products", delivery: "Delivery" }).map(([k, v]) => (
          <span key={k} className="cloud-k">
            <i style={{ background: COLOURS[k] }} />
            {v}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
