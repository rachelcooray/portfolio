import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHero, SectionHeading } from "@/components/ui/Headings";
import CitationButton from "@/components/research/CitationButton";
import { identity, research, site } from "@/content/content";

export const metadata: Metadata = { title: "Research", description: "PCOS Care, published at IEEE ICAHS 2025: the research question, method, application and limits." };

// [CONFIRM] author order against the IEEE record.
const CITATION =
  'R. Cooray, M. Kaniappan Chinnathai and S. Chahed, "PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome," IEEE ICAHS 2025, Hammamet, Tunisia, 2025, doi: 10.1109/ICAHS66950.2025.11553077.';

const STUDY = [
  { t: "Research question", b: "Can machine learning help people identify potential PCOS risk earlier, through an accessible web application?" },
  { t: "Motivation and background", b: "PCOS is a complex condition with varied symptoms. Many risk models produce opaque scores, and models that need full hormone panels do not help where those tests are not available." },
  { t: "Dataset", b: "An anonymised public benchmark dataset of patient records from hospitals in Kerala, India." },
  { t: "Feature selection", b: "Chi-Square tests for categorical indicators and ANOVA F-tests for numerical ones, keeping signals a clinician would recognise." },
  { t: "Class balancing", b: "SMOTE, to address the imbalance between PCOS and non-PCOS cases." },
  { t: "Model development", b: "An enhanced Random Forest." },
  { t: "Evaluation", b: "Stratified cross-validation favouring recall, since a missed case costs more than a false alarm, and a structured usability study with real users." },
  { t: "Web application", b: "Two pathways: an initial screen from everyday signs and symptoms, and an enhanced screen that adds hormone test results. Each result shows the factors behind it. Built in Python, Flask and Streamlit, and deployed." },
  { t: "Limitations and future work", b: "A screening-support tool, not a diagnostic system or a replacement for medical advice. Trained on one public benchmark dataset." },
  { t: "IEEE publication", b: `${research.paper.venue}, ${research.paper.dates}. Paper ID ${research.paper.paperId}. DOI ${research.paper.doi}.` },
  { t: "Journal submission", b: research.paper.journal },
];

const TIMELINE = [
  { y: "2024 to 2025", t: "Final year research project at the University of Westminster" },
  { y: "2025", t: "Third place at the final year project showcase" },
  { y: "Dec 2025", t: "Presented and published at IEEE ICAHS 2025, Tunisia" },
  { y: "Now", t: "Extended paper under review for the MSIT Journal special edition" },
];

export default function Research() {
  const p = research.paper;
  return (
    <>
      <PageHero num="05" label="Research · Publications" title="Exploring. Innovating. Publishing." lead={site.research.intro} crumbs={[{ label: "Research" }]} />

      <section className="wrap paper" data-reveal>
        <article className="paper-card">
          <div className="xp-meta">
            <Badge tone="status">Published</Badge>
            <span className="mono">IEEE ICAHS 2025</span>
          </div>
          <h2>{p.title}</h2>
          <p className="muted-light">{p.authors}</p>
          <dl className="facts">
            <div>
              <dt className="mono">Location</dt>
              <dd>Hammamet, Tunisia</dd>
            </div>
            <div>
              <dt className="mono">Dates</dt>
              <dd>{p.dates}</dd>
            </div>
            <div>
              <dt className="mono">Paper ID</dt>
              <dd>{p.paperId}</dd>
            </div>
            <div>
              <dt className="mono">DOI</dt>
              <dd>
                <a href={p.doiUrl}>{p.doi}</a>
              </dd>
            </div>
          </dl>
          <div className="btn-row">
            <Button href={p.doiUrl} variant="light">
              Read the paper ↗
            </Button>
            <Button href={p.appUrl} variant="ghost-light">
              View the application ↗
            </Button>
            <CitationButton citation={CITATION} />
          </div>
        </article>
        <figure className="paper-photo">
          <Image src="/images/photos/pcos-showcase.webp" width={1606} height={1198} alt="Rachel presenting PCOS Care to judges and standing beside her research poster at the Westminster showcase" />
          <figcaption className="mono">Final year project showcase, University of Westminster, 2025</figcaption>
        </figure>
      </section>

      <section className="band band-oat">
        <div className="wrap">
          <SectionHeading kicker="Research journey" title="From a final year project to a publication." />
          <ol className="r-timeline" data-reveal>
            {TIMELINE.map((x) => (
              <li key={x.t}>
                <span className="mono">{x.y}</span>
                <p>{x.t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHeading kicker="PCOS Care · Research case study" title="How the study was built, step by step.">
            <p>Only the published method is shown. Results figures are not repeated here: read them in the paper.</p>
          </SectionHeading>
          <div className="methodology" data-reveal>
            {STUDY.map((s, i) => (
              <details key={s.t} className="method-step" open={i < 3}>
                <summary>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {s.t}
                </summary>
                <p>{s.b}</p>
              </details>
            ))}
          </div>
          <figure className="wide-photo mt" data-reveal>
            <Image src="/images/photos/pcos-app.webp" width={2000} height={1250} alt="PCOS Care web app home page with information, simple and enhanced risk assessment, and results" />
            <figcaption className="mono">The deployed application. A screening-support tool, not a clinical diagnosis system.</figcaption>
          </figure>
        </div>
      </section>

      <section className="band band-forest">
        <div className="wrap split-2">
          <div data-reveal>
            <SectionHeading light kicker="Research interests" title="Questions I want to keep working on." />
            <p className="small muted-light">Developing interests, not completed research credentials.</p>
          </div>
          <ol className="numbered" data-reveal>
            {site.research.interests.map((x, i) => (
              <li key={x}>
                <span className="mono">0{i + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap profiles" data-reveal>
          <p className="mono">Research profiles</p>
          <p>
            <a href={`https://orcid.org/${identity.orcid}`}>ORCID {identity.orcid}</a> · <a href={p.doiUrl}>IEEE publication</a>
          </p>
        </div>
      </section>
    </>
  );
}
