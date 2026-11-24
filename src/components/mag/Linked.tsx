import { Fragment } from "react";
import { orgLinks } from "@/content/content";

// Wraps any organisation named in orgLinks with a link to its own site.
// Longest names first, so "OCTAVE, John Keells Holdings" wins over "OCTAVE".
const NAMES = [...orgLinks].sort((a, b) => b.name.length - a.name.length);
const RE = new RegExp(`(${NAMES.map((o) => o.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

export default function Linked({ text }: { text: string }) {
  const parts = text.split(RE);
  return (
    <>
      {parts.map((p, i) => {
        const hit = NAMES.find((o) => o.name === p);
        return hit ? (
          <a key={i} href={hit.url} className="org-link">
            {p}
          </a>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        );
      })}
    </>
  );
}
