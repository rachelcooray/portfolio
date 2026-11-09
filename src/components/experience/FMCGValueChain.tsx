"use client";

import Link from "next/link";
import { useState } from "react";
import { valueChain } from "@/content/content";

// UseCaseExplorer: the OCTAVE use cases laid out from factory to market.
// Solid nodes are the four use cases Rachel owns; dashed nodes are wider
// programme areas she contributes to.
const STAGES = ["Factory", "Dispatch", "Distributor", "Market"];

export default function FMCGValueChain() {
  const [sel, setSel] = useState(2);
  const u = valueChain[sel];
  return (
    <div className="chain">
      <div className="chain-track" role="group" aria-label="FMCG value chain use cases">
        {STAGES.map((st) => (
          <div key={st} className="chain-stage">
            <p className="mono chain-stage-label">{st}</p>
            <div className="chain-nodes">
              {valueChain.map((v, i) =>
                v.stage === st ? (
                  <button
                    key={v.code}
                    type="button"
                    className={`chain-node${v.owned ? " owned" : " contributed"}${i === sel ? " on" : ""}`}
                    aria-pressed={i === sel}
                    onClick={() => setSel(i)}
                  >
                    <span className="mono">{v.code}</span>
                    <span>{v.name}</span>
                  </button>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chain-panel" aria-live="polite">
        <p className="mono">
          {u.stage} · {u.owned ? "Use case I own" : "Programme area I contribute to"}
        </p>
        <h4>{u.name}</h4>
        <p>{u.line}</p>
        {u.slug ? (
          <Link className="text-link" href={`/projects/${u.slug}`}>
            Read the case study →
          </Link>
        ) : (
          <p className="muted small">Wider programme work, not one of the four use cases I own. No case study published.</p>
        )}
      </div>
      <p className="chain-legend mono">
        <span className="lg owned" /> Owned use case <span className="lg contributed" /> Contributed to · Illustrative grouping
      </p>
    </div>
  );
}
