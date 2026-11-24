import { skillCloud } from "@/content/content";

// The skills at a glance: one colour family, sized by how much each is used.
// Biggest in the middle, smaller ones fanning out to both sides.
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
          <li key={w.name} className={`cloud-w w${w.weight}`} style={{ ["--i" as string]: i }}>
            {w.name}
          </li>
        ))}
      </ul>
      <figcaption className="cloud-key">Larger means I use it more.</figcaption>
    </figure>
  );
}
