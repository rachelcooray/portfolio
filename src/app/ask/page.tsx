import type { Metadata } from "next";
import AskAgent from "@/components/mag/AskAgent";

export const metadata: Metadata = {
  title: "Ask me anything",
  description: "Ask about Rachel Cooray's work. Every answer is quoted from her published work, with its source.",
};

export default function Ask() {
  return (
    <div className="ask">
      <div className="wrap">
        <div className="folio">
          <span>Rachel Cooray · Issue 01</span>
          <span>Ask · 18</span>
        </div>
        <div className="ask-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h1>Ask me anything.</h1>
            <p className="ask-intro">An agent that knows my work. It answers only from what is published in this magazine, and shows where it took the answer from. If it doesn&apos;t know, it says so.</p>
            <ul className="ask-rules">
              <li className="kicker">House rules</li>
              <li>Quotes my own words, never invents.</li>
              <li>No confidential data or client names.</li>
              <li>Hands you my email when a question needs me.</li>
            </ul>
          </div>
          <AskAgent />
        </div>
      </div>
    </div>
  );
}
