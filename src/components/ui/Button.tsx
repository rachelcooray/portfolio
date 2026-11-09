import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost-light" | "text";

const CLASS: Record<Variant, string> = {
  primary: "btn",
  secondary: "btn btn-line",
  light: "btn btn-ivory",
  "ghost-light": "btn btn-line-light",
  text: "text-link",
};

// Internal links use next/link; files and external URLs use a plain anchor.
export default function Button({ href, variant = "primary", children, external }: { href: string; variant?: Variant; children: ReactNode; external?: boolean }) {
  const cls = CLASS[variant];
  const plain = external || href.startsWith("http") || href.startsWith("mailto:") || href.endsWith(".pdf");
  if (plain) {
    return (
      <a className={cls} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {href.startsWith("http") && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {children}
    </Link>
  );
}
