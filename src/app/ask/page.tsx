import type { Metadata } from "next";
import AskAgent from "@/components/mag/AskAgent";

export const metadata: Metadata = {
  title: "Ask about my work",
  description: "Ask about my work. Answers are quoted from published material, with sources.",
};

export default function Ask() {
  return (
    <div className="ask">
      <div className="wrap">
        <div className="folio">
          <span>Rachel Cooray, Issue 01</span>
          <span>Ask, 18</span>
        </div>
        <div className="ask-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h1>Ask about my work.</h1>
            <p className="ask-intro">Answers are quoted from published material, with sources.</p>
            <ul className="ask-rules">
              <li className="kicker">House rules</li>
              <li>Quotes my own words, never invents.</li>
              <li>No confidential data or client names.</li>
              <li>Passes your request to me when a question needs me.</li>
            </ul>
          </div>
          <AskAgent />
        </div>
      </div>
    </div>
  );
}
