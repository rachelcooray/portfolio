"use client";

import { useState } from "react";

export default function CitationButton({ citation }: { citation: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-line"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(citation);
          setDone(true);
          setTimeout(() => setDone(false), 2500);
        } catch {
          setDone(false);
        }
      }}
    >
      {done ? "Citation copied" : "Copy citation"}
      <span className="sr-only" aria-live="polite">
        {done ? "Citation copied to the clipboard" : ""}
      </span>
    </button>
  );
}
