import type { ReactNode } from "react";

type Tone = "category" | "status" | "owned" | "contributed" | "date";

export function Badge({ tone = "category", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function TagList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul className="tag-row" aria-label={label}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}
