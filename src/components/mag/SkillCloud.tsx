import { skillCloud } from "@/content/content";

// Bright tones on the deep olive panel, all drawn from the site palette.
const COLOURS: Record<string, string> = {
  think: "#faf7ef",
  data: "#c7d42b",
  ai: "#9cc8f0",
  insight: "#f2cf8a",
  product: "#dde3b0",
  delivery: "#f4a983",
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
            className={`cloud-w w${w.weight}`}
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
