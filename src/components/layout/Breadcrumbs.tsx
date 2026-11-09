import Link from "next/link";

export default function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs mono">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}
