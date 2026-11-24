"use client";

import { skillCloud } from "@/content/content";

// The skills at a glance: one colour family, sized by how much each is used.
// Each one is a button: it asks the Ask agent where Rachel has used it.
function centreOut<T>(items: T[]) {
  const out: T[] = [];
  items.forEach((it, i) => (i % 2 ? out.push(it) : out.unshift(it)));
  return out;
}

const ask = (q: string) => window.dispatchEvent(new CustomEvent("rc-ask", { detail: { q } }));

export default function SkillCloud() {
  const sorted = [...skillCloud].sort((a, b) => b.weight - a.weight);
  const words = centreOut(sorted);
  return (
    <figure className="cloud" aria-label="Skills, sized by how much I use them. Choose one to ask where I have used it.">
      <ul className="cloud-words">
        {words.map((w, i) => (
          <li key={w.name} className={`cloud-w w${w.weight}`} style={{ ["--i" as string]: i }}>
            <button type="button" onClick={() => ask(`Where has Rachel used ${w.name}?`)}>
              {w.name}
            </button>
          </li>
        ))}
      </ul>
      <figcaption className="cloud-key">Larger means I use it more. Choose any skill to ask about it.</figcaption>
    </figure>
  );
}
