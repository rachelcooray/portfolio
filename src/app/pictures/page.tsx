import type { Metadata } from "next";
import Folio from "@/components/mag/Folio";
import { identity } from "@/content/content";

export const metadata: Metadata = {
  title: "In pictures",
  description: "Graduation, the PCOS Care research, on stage, awards and things built.",
};

const linkedin = identity.links.find((l) => l.label === "LinkedIn")?.href ?? "https://www.linkedin.com/";

export default function Pictures() {
  return (
    <div className="wrap page">
      <Folio right="In pictures · 30" />
      <h1 className="pics-title">In pictures.</h1>

      <section className="pics-sec first">
        <span className="kicker">01 · Graduation</span>
        <div className="g g-grad">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/graduation-roses-thames.webp" alt="Rachel in her graduation gown and cap holding red roses, by the Thames" width={893} height={1500} style={{ aspectRatio: "3 / 4", objectPosition: "center 30%" }} />
            <figcaption>Graduation day by the Thames, London.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/graduation-southbank.webp" alt="Rachel in her graduation gown and cap under the colourful Southbank Centre canopy" width={900} height={1600} style={{ aspectRatio: "3 / 4", objectPosition: "center 30%" }} />
            <figcaption>Under the canopy on the South Bank.</figcaption>
          </figure>
          <div className="g-col">
            <figure>
              <img loading="lazy" decoding="async" src="/images/mag/graduation-stage.webp" alt="Rachel shaking hands on stage at the University of Westminster graduation ceremony" width={640} height={480} style={{ aspectRatio: "4 / 3" }} />
              <figcaption>On stage at the ceremony, the handshake.</figcaption>
            </figure>
            <figure>
              <img loading="lazy" decoding="async" src="/images/mag/degree.jpg" alt="University of Westminster degree certificate: Bachelor of Science in Computer Science with First Class Honours, awarded to Rachel Naadia Cooray" width={700} height={595} style={{ objectFit: "contain", background: "#eef3f1", border: "1px solid var(--line)" }} />
              <figcaption>BSc Computer Science, First Class Honours, University of Westminster.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="pics-sec">
        <span className="kicker">02 · The research</span>
        <div className="g g-poster">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/pcos-poster.webp" alt="The PCOS Care research poster: overview, aims and objectives, method, implementation, features and design, architecture and machine learning highlights" width={1400} height={1367} style={{ objectFit: "contain", background: "#f4f4f6", border: "1px solid var(--line)" }} />
            <figcaption>The PCOS Care research poster, University of Westminster, 2025. Supervisor: Dr Malarvizhi Kaniappan Chinnathai.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/poster-smile.webp" alt="Rachel smiling beside her PCOS Care poster, wearing a name badge" width={1350} height={1800} style={{ aspectRatio: "3 / 4" }} />
            <figcaption>Beside the poster at the final year project showcase.</figcaption>
          </figure>
        </div>
        <div className="g g-3">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/poster-standing.webp" alt="Rachel standing in front of her PCOS Care poster at the showcase" width={1350} height={1800} style={{ aspectRatio: "3 / 4", objectPosition: "center 40%" }} />
            <figcaption>Ready for the judges.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/pcos-showcase.webp" alt="Rachel presenting PCOS Care to judges and standing beside her research poster" width={1606} height={1198} style={{ aspectRatio: "3 / 4" }} />
            <figcaption>Presenting PCOS Care to the judges.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/pcos-app.webp" alt="The PCOS Care web app home page" width={2000} height={1250} style={{ aspectRatio: "3 / 4", objectPosition: "top left" }} />
            <figcaption>The PCOS Care web app.</figcaption>
          </figure>
        </div>
      </section>

      <section className="pics-sec">
        <span className="kicker">03 · On stage and in the room</span>
        <div className="g g-stage">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/rachel-speaking.webp" alt="Rachel speaking at a lectern, holding a microphone and smiling" width={1200} height={1500} style={{ aspectRatio: "4 / 5" }} />
            <figcaption>Addressing the school board, 2022.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/photos/showcase-group.jpg" alt="Students and industry judges at the Westminster final year project showcase" width={800} height={450} style={{ aspectRatio: "16 / 9" }} />
            <figcaption>Students and industry judges at the Westminster final year project showcase.</figcaption>
          </figure>
        </div>
      </section>

      <section className="pics-sec">
        <span className="kicker">04 · Awards and certificates</span>
        <div className="g g-3">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/embrace-certificate.webp" alt="Microsoft certificate of excellence awarded to Rachel Naadia Cooray for the Microsoft regional hackathon, AI for Neurodiverse Learners, EMBRACE" width={1465} height={1080} style={{ aspectRatio: "4 / 3", objectFit: "contain", background: "#2a2a2a" }} />
            <figcaption>Microsoft EMBRACE hackathon, AI for Neurodiverse Learners, 2024.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/best-prefect.webp" alt="Newspaper photo of Rachel in her green school blazer receiving the Best School Prefect of the Year award" width={598} height={390} style={{ aspectRatio: "4 / 3" }} />
            <figcaption>School Prefect of the Year, New Generation Awards, 2020.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/swimming-meet.webp" alt="Team OCTAVE at the John Keells intercompany swimming meet" width={399} height={501} style={{ aspectRatio: "4 / 3" }} />
            <figcaption>Team OCTAVE at the JKH swim meet, 2026.</figcaption>
          </figure>
        </div>
      </section>

      <section className="pics-sec">
        <span className="kicker">05 · Things I built</span>
        <div className="g g-3">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/carbon-footprint.webp" alt="Carbon Footprint Tracker dashboard" width={1200} height={900} style={{ aspectRatio: "4 / 3", objectPosition: "top" }} />
            <figcaption>Carbon Footprint Tracker.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/coin-collector.webp" alt="Fantasy Coin Collector, a 2D dungeon crawler" width={1200} height={900} style={{ aspectRatio: "4 / 3" }} />
            <figcaption>Fantasy Coin Collector, built from scratch in HTML5 Canvas.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/futsal-app.webp" alt="Futsal MatchUp app sign-in screen on a phone" width={1200} height={900} style={{ aspectRatio: "4 / 3", objectFit: "contain", background: "var(--sand)" }} />
            <figcaption>Futsal team recommender, in Flutter.</figcaption>
          </figure>
        </div>
      </section>

      <section className="pics-sec">
        <span className="kicker">06 · On the shop floor</span>
        <div className="g g-3">
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/tkmaxx.webp" alt="Rachel on the shop floor at TK Maxx, wearing a headset and lanyard, folding children's clothes" width={848} height={1264} style={{ aspectRatio: "3 / 4", objectPosition: "center 30%" }} />
            <figcaption>Customer service at TK Maxx, Stratford.</figcaption>
          </figure>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/uniqlo.webp" alt="Rachel on the shop floor at UNIQLO, in a lilac jumper and red lanyard, folding clothes on a display table" width={900} height={1341} style={{ aspectRatio: "3 / 4", objectPosition: "center 30%" }} />
            <figcaption>Customer service at UNIQLO, London.</figcaption>
          </figure>
        </div>
      </section>

      <section className="pics-sec">
        <span className="kicker">07 · Find me online</span>
        <div className="online">
          <div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 36, lineHeight: 1.1 }}>Follow the work as it happens.</p>
            <a className="btn" href={linkedin} style={{ alignSelf: "flex-start" }}>
              Connect on LinkedIn
            </a>
          </div>
          <figure>
            <img loading="lazy" decoding="async" src="/images/mag/linkedin.webp" alt="Rachel Cooray's LinkedIn profile: Analyst, Data and AI, Computer Science Graduate, Colombo, OCTAVE John Keells Group, University of Westminster" width={1513} height={784} />
          </figure>
        </div>
      </section>
    </div>
  );
}
