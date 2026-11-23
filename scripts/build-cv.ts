/**
 * Builds the CV from src/content/content.ts, so the site, the Ask agent and
 * the CV can never disagree.
 *
 *   npm run cv
 *
 * Two CVs, both with a QR code to the site on every page:
 *   public/rachelcooray-cv.pdf      the magazine CV, for people
 *   public/rachelcooray-cv-ats.pdf  one plain column, for applicant tracking
 * cv-build/cv.json feeds scripts/build_cv_docx.py, which writes the ATS
 * version as public/rachelcooray-cv.docx.
 */
import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import {
  identity,
  octave,
  layer1,
  londonSuccessAcademy,
  otherRoles,
  teaching,
  education,
  research,
  buildLog,
  achievements,
  volunteer,
  magazine,
  schoolLife,
  toolkitStack,
  thinkingLayer,
  cima,
} from "../src/content/content";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(root, "cv-build");
mkdirSync(out, { recursive: true });

type Item = { title: string; org?: string; when?: string; where?: string; bullets?: string[]; text?: string };
type Block = { heading: string; items: Item[] };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const firstSentence = (s: string) => (s.match(/^[^.]+\./)?.[0] ?? s).trim();

const contact = [
  identity.email,
  identity.phone,
  identity.location,
  "linkedin.com/in/rachel-cooray-069034235",
  "github.com/rachelcooray",
  `ORCID ${identity.orcid}`,
  identity.domain,
];

const summary =
  "Analyst, Data and AI at OCTAVE, John Keells Holdings, where I own six AI and analytics use cases across the FMCG value chain, from the analysis and solution design to the business using them. First Class Computer Science graduate from the University of Westminster, published researcher at IEEE ICAHS 2025, and co-founder of Layer1 Studio.";

const analyst = octave.roles[0];
const useCases = magazine.useCases.map((u) => ({ code: u.code, stage: u.stage, name: u.name, line: firstSentence(u.line) }));
const roleBullets = [
  "Coordinate data science and engineering teams to turn business requirements into working solutions, managing plans, sprints, RAID logs and priorities.",
  "Work directly with sales, finance, area and regional management, and present findings and progress to senior stakeholders.",
  "Design measurement with pilot and control comparisons where possible, separating association from proven impact.",
];

// What a recruiter needs: the role, the use cases, research, the degree,
// skills, three projects and top recognition. Everything else is one line.
const SELECTED = ["build-ask-agent", "build-neurodiversity", "build-csr-street-vendors"];
const BEYOND = [
  "Head Prefect of St. Bridget's Convent and School Prefect of the Year, 2020.",
  "Volunteer with the John Keells Foundation, City of Dreams and OCTAVE's Project Uplift, 2026.",
  "Customer service at UNIQLO, TK Maxx and EG On The Move, alongside study.",
  "Student support at Clear Links and Sunday school teaching.",
];

// ---------------------------------------------------------------- blocks (shared with the Word CV)
const blocks: Block[] = [
  {
    heading: "Experience",
    items: [
      {
        title: analyst.title,
        org: analyst.company,
        when: analyst.dateRange,
        where: analyst.location,
        bullets: [`Own six use cases across the value chain: ${useCases.map((u) => u.name).join(", ")}.`, ...roleBullets, `Tools: ${octave.tools.join(", ")}.`],
      },
      { title: "Analytics Delivery Associate", org: octave.company, when: octave.roles[1].dateRange },
      { title: octave.roles[2].title, org: octave.company, when: octave.roles[2].dateRange },
      { title: layer1.title, org: layer1.company, when: layer1.dateRange, where: layer1.location, bullets: [layer1.description, layer1.details[1], layer1.details[4]] },
      { title: londonSuccessAcademy.title, org: londonSuccessAcademy.company, when: londonSuccessAcademy.dateRange, bullets: londonSuccessAcademy.details },
      { title: "Earlier internships at OCTAVE", when: "2022 and 2023", text: octave.earlier.map((r) => `${r.title}, ${r.dateRange}`).join(". ") + "." },
    ],
  },
  {
    heading: "Research",
    items: [
      {
        title: research.paper.title,
        org: research.paper.venue,
        when: research.paper.year,
        bullets: [`${research.paper.authors}. DOI ${research.paper.doi}.`, research.paper.description, `Method: ${research.paper.method}`, research.paper.award, research.paper.journal],
      },
    ],
  },
  { heading: "Education", items: education.map((e) => ({ title: e.title, org: e.institution, when: e.dateRange, text: e.summary })) },
  { heading: "Selected projects", items: buildLog.filter((x) => SELECTED.includes(x.id)).map((x) => ({ title: x.title, when: x.year ?? undefined, text: `${firstSentence(x.built)} ${x.tools.join(", ")}.` })) },
  { heading: "Skills", items: [thinkingLayer, ...[...toolkitStack].reverse()].map((l) => ({ title: l.layer, text: l.tools.join(", ") })) },
  { heading: "Beyond the role", items: [{ title: "Leadership, volunteering and customer service", bullets: BEYOND }] },
  { heading: "Recognition", items: achievements.map((a) => ({ title: a.title, org: a.organization, when: a.year })) },
];

// ---------------------------------------------------------------- shared
const font = (f: string) => `file://${join(root, "src/fonts", f)}`;
const qr = readFileSync(join(here, "assets/qr-site.svg"), "utf8");
const bot = readFileSync(join(here, "assets/cv-bot.svg"), "utf8");
const qrData = `data:image/png;base64,${readFileSync(join(here, "assets/qr-site.png")).toString("base64")}`;
const portrait = `file://${join(here, "assets/cv-portrait.jpg")}`;
const stages = ["Factory", "Dispatch", "Distributor", "Market"] as const;
const stageLabel: Record<string, string> = { Factory: "Factory", Dispatch: "Dispatch", Distributor: "Distributor", Market: "Outlets" };
const exp = blocks[0].items;
const fonts = `
@font-face { font-family: Garamond; src: url("${font("eb-garamond-400-800-normal.woff2")}") format("woff2"); font-weight: 400 800; }
@font-face { font-family: Garamond; src: url("${font("eb-garamond-400-800-italic.woff2")}") format("woff2"); font-style: italic; font-weight: 400 800; }
@font-face { font-family: Plex; src: url("${font("ibm-plex-sans-100-700-normal.woff2")}") format("woff2"); font-weight: 100 700; }
@font-face { font-family: PlexMono; src: url("${font("ibm-plex-mono-400-normal.woff2")}") format("woff2"); font-weight: 400; }`;

// ---------------------------------------------------------------- the magazine CV (for people)
const entry = (it: Item) =>
  `<div class="entry"><div class="entry-row"><span class="entry-title">${esc(it.title)}</span>${it.when ? `<span class="entry-when">${esc(it.when)}</span>` : ""}</div>${it.org ? `<div class="entry-org">${esc(it.org)}${it.where ? ` · ${esc(it.where)}` : ""}</div>` : ""}${it.text ? `<p>${esc(it.text)}</p>` : ""}${it.bullets?.length ? `<ul>${it.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`;

// The left pane from the earlier CV: name, title, contact and the robot with
// the QR on page 1; the toolkit, recognition and the robot again on page 2.
const tools = [thinkingLayer, ...[...toolkitStack].reverse()];
// Short, scannable lines for the magazine CV. The ATS CV keeps the full text.
const INTRO = ["Analyst, Data and AI at OCTAVE, John Keells Holdings.", "Own six AI and analytics use cases across the FMCG value chain.", "First Class BSc Computer Science, University of Westminster.", "Published at IEEE ICAHS 2025. Co-founder, Layer1 Studio."];
const OCTAVE_SHORT = ["Own each use case from analysis and solution design to adoption.", "Coordinate data science and engineering teams, sprints and priorities.", "Present findings to sales, finance and senior management.", "Measure impact with pilot and control comparisons.", "Promoted from intern to associate to analyst."];
const BEYOND_SHORT = ["Head Prefect and School Prefect of the Year, 2020.", "Volunteer: John Keells Foundation, City of Dreams, Project Uplift.", "Customer service at UNIQLO, TK Maxx and EG On The Move.", "Student support at Clear Links; Sunday school teacher."];
const folio = (left: string, n: string) => `<div class="folio"><span>${left}</span><span>${n} / 02</span></div>`;

const mag = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Rachel Cooray CV</title>
<style>${fonts}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: Plex, "Helvetica Neue", Arial, sans-serif; font-size: 8.5pt; line-height: 1.42; color: #2b2318; background: #faf7ef; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; display: grid; grid-template-columns: 64mm 1fr; overflow: hidden; page-break-after: always; position: relative; background: #faf7ef; }
.page:last-child { page-break-after: auto; }
.spine { background: #efe6d3; border-right: 0.6pt solid #2b2318; padding: 14mm 7mm 12mm 9mm; display: flex; flex-direction: column; gap: 5mm; }
.k { font-family: PlexMono, monospace; font-size: 6.8pt; letter-spacing: 0.14em; text-transform: uppercase; color: #6b5436; }
.mast { font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 36pt; line-height: 0.86; letter-spacing: -0.6pt; color: #46521a; margin-top: 2mm; }
.title { font-family: Garamond, Georgia, serif; font-style: italic; font-size: 12pt; line-height: 1.2; border-top: 0.6pt solid #2b2318; padding-top: 2.4mm; }
.contact { list-style: none; margin: 0; padding: 0; font-family: PlexMono, monospace; font-size: 7pt; line-height: 1.75; word-break: break-word; }
.bot { margin-top: auto; display: flex; flex-direction: column; align-items: center; gap: 1.5mm; background: #faf7ef; border: 0.6pt solid #46521a; border-radius: 4mm; padding: 3mm 2mm 2.5mm; }
.bot svg { width: 38mm; height: auto; }
.bot p { margin: 0; text-align: center; font-size: 7.4pt; line-height: 1.3; }
.bot b { font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 14pt; color: #46521a; display: block; }
.side-h { font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 15pt; color: #46521a; border-bottom: 0.6pt solid #2b2318; padding-bottom: 1mm; margin-bottom: 1.8mm; }
.tools { display: flex; flex-direction: column; gap: 1.8mm; }
.tools .layer { font-family: PlexMono, monospace; font-size: 6.4pt; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5436; }
.tags { display: flex; flex-wrap: wrap; gap: 1mm; margin-top: 0.6mm; }
.tags span { font-size: 6.9pt; padding: 0.3mm 1.6mm; border: 0.5pt solid #cbbe9f; border-radius: 3mm; background: #faf7ef; }
.list { margin: 0; padding: 0 0 0 3.2mm; display: flex; flex-direction: column; gap: 1.4mm; font-size: 7.6pt; line-height: 1.35; }
.main { padding: 13mm 12mm 16mm 10mm; display: flex; flex-direction: column; gap: 3.2mm; min-width: 0; overflow: hidden; }
.top { display: flex; align-items: center; gap: 4mm; font-family: PlexMono, monospace; font-size: 6.8pt; letter-spacing: 0.16em; text-transform: uppercase; }
.top::after { content: ""; flex: 1; border-top: 0.6pt solid #2b2318; order: 1; }
.top em { order: 2; font-family: Garamond, Georgia, serif; font-style: italic; font-size: 10pt; letter-spacing: 0; text-transform: none; }
.hero { display: grid; grid-template-columns: 1fr 34mm; gap: 5mm; align-items: stretch; }
.lead { font-size: 9.2pt; line-height: 1.5; margin: 0; }
.intro { margin: 0; padding-left: 4mm; font-size: 9.6pt; line-height: 1.45; display: flex; flex-direction: column; gap: 1mm; }
.photo { background: #efe6d3; border-bottom: 2.4pt solid #46521a; overflow: hidden; min-height: 40mm; }
.photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 20%; display: block; }
.quote { font-family: Garamond, Georgia, serif; font-style: italic; font-size: 13pt; line-height: 1.22; color: #46521a; border-left: 3pt solid #c7d42b; padding: 0.6mm 0 0.6mm 4mm; margin: 2.4mm 0 0; }
h2 { margin: 1.6mm 0 0; font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 17pt; line-height: 1; color: #2b2318; display: flex; align-items: baseline; gap: 3mm; }
h2::after { content: ""; flex: 1; border-bottom: 0.6pt solid #2b2318; transform: translateY(-1.2mm); }
.entry { break-inside: avoid; }
.entry-row { display: flex; align-items: baseline; gap: 2mm; }
.entry-title { font-weight: 600; font-size: 9pt; color: #46521a; }
.entry-row::after { content: ""; order: 1; flex: 1; border-bottom: 1pt dotted #6b5436; opacity: 0.6; transform: translateY(-0.8mm); }
.entry-when { order: 2; font-family: PlexMono, monospace; font-size: 6.8pt; color: #6b5436; white-space: nowrap; }
.entry-org { font-style: italic; font-family: Garamond, Georgia, serif; font-size: 9.6pt; color: #5a4e3a; }
.entry p { margin: 0.6mm 0 0; }
ul { margin: 0.8mm 0 0; padding-left: 3.4mm; }
li { margin-top: 0.5mm; }
li::marker { color: #46521a; }
.chain { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6mm; margin: 1.6mm 0 0.4mm; position: relative; }
.chain::before { content: ""; position: absolute; left: 7%; right: 7%; top: 2.4mm; border-top: 1pt dashed #46521a; }
.stop { position: relative; text-align: center; }
.dot { width: 4.8mm; height: 4.8mm; border-radius: 50%; background: #46521a; margin: 0 auto 0.8mm; }
.stop .k { display: block; color: #46521a; font-size: 6.2pt; }
.stop span { display: block; font-size: 7pt; line-height: 1.25; margin-top: 0.3mm; }
.tiles { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.4mm; }
.tile { background: #efe6d3; padding: 2.6mm 3mm 2.8mm; border-bottom: 2pt solid #46521a; font-family: Garamond, Georgia, serif; font-size: 10.4pt; line-height: 1.18; }
.tile small { display: block; font-family: PlexMono, monospace; font-size: 6pt; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5436; margin-top: 1mm; }
.tile.data { border-bottom-color: #2a6aa5; } .tile.think { border-bottom-color: #5e4a8a; }
.folio { position: absolute; left: 74mm; right: 12mm; bottom: 7mm; display: flex; justify-content: space-between; font-family: PlexMono, monospace; font-size: 6.6pt; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5436; border-top: 0.5pt solid #cbbe9f; padding-top: 1.5mm; }
</style></head><body>

<section class="page">
  <aside class="spine">
    <div>
      <div class="k">Curriculum vitae</div>
      <div class="mast">Rachel<br>Cooray</div>
    </div>
    <div class="title">${esc(identity.role)}<br>${esc(identity.employer)}</div>
    <ul class="contact">${contact.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    <div class="bot">${bot}<p><b>Scan me.</b>The full portfolio, and an agent that answers questions about my work.</p></div>
  </aside>
  <main class="main">
    <div class="top">Data, AI, business and people<em>rachelcooray.com</em></div>
    <div class="hero">
      <div>
        <ul class="intro">${INTRO.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        <p class="quote">${esc(identity.tagline)}</p>
      </div>
      <div class="photo"><img src="${portrait}" alt=""></div>
    </div>
    <h2>Experience</h2>
    <div class="entry">
      <div class="entry-row"><span class="entry-title">${esc(analyst.title)}</span><span class="entry-when">${esc(analyst.dateRange)}</span></div>
      <div class="entry-org">${esc(analyst.company)} · ${esc(analyst.location)}</div>
      <div class="chain">${stages
        .map((st) => `<div class="stop"><div class="dot"></div><span class="k">${stageLabel[st]}</span><span>${useCases.filter((u) => u.stage === st).map((u) => esc(u.name)).join("<br>")}</span></div>`)
        .join("")}</div>
      <ul>${OCTAVE_SHORT.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    </div>
    ${entry({ title: layer1.title, org: layer1.company, when: layer1.dateRange, bullets: ["Co-founded a web and mobile studio for small businesses.", "Take each build from brief to launch and upkeep.", "Mentor interns on real client projects."] })}
    ${entry({ title: londonSuccessAcademy.title, org: londonSuccessAcademy.company, when: londonSuccessAcademy.dateRange, bullets: ["Built ETL pipelines on Google Cloud for clickstream and transactions.", "Scaled processing with PySpark and Parquet."] })}
  </main>
  ${folio("Rachel Cooray · CV", "01")}
</section>

<section class="page">
  <aside class="spine">
    <div>
      <div class="side-h">The toolkit</div>
      <div class="tools">${tools.map((l) => `<div><div class="layer">${esc(l.layer)}</div><div class="tags">${l.tools.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`).join("")}</div>
    </div>
    <div>
      <div class="side-h">Recognition</div>
      <ul class="list">${achievements.map((a) => `<li><b>${esc(a.title)}</b>, ${esc(a.year)}</li>`).join("")}</ul>
    </div>
    <div class="bot">${bot}<p><b>Ask my agent.</b>Questions about my work, answered from my portfolio.</p></div>
  </aside>
  <main class="main">
    <div class="top">Continued<em>rachelcooray.com</em></div>
    <h2>Education</h2>
    ${entry({ title: education[0].title, org: "University of Westminster", when: "2022 to 2025", bullets: ["Data Science specialisation.", "UOW/IIT scholarship, 2024/25.", "Batch Representative at IIT, Years 1 and 2."] })}
    ${entry({ title: "CIMA Certificate in Business Accounting", when: "2024", bullets: ["Operational level in progress."] })}
    ${entry({ title: "St. Bridget's Convent, Colombo", when: "to 2022", bullets: ["Head Prefect, 2020.", `GCE A/L: ${schoolLife.exams[0].results.map(([sub, g]) => `${sub} ${g}`).join(", ")}.`, "GCE O/L: nine As."] })}
    <h2>Research</h2>
    ${entry({ title: "PCOS Care", org: "IEEE ICAHS 2025, Hammamet, Tunisia", when: "2025", bullets: ["Machine learning web app for early PCOS risk screening, with explainable predictions.", "Third place, Westminster final year project showcase, 2025.", "Extended paper under review, MSIT Journal.", `DOI ${research.paper.doi}`] })}
    <h2>Selected projects</h2>
    ${entry({ title: "Ask me: a portfolio agent", when: "2026", bullets: ["Answers recruiters' questions from my published work."] })}
    ${entry({ title: "Neurodiversity support chatbot", when: "2024", bullets: ["Prototype for people newly diagnosed with neurodiverse conditions and their carers."] })}
    ${entry({ title: "CSR street-vendor analytics", when: "2022", bullets: ["Field survey of street food vendors, adopted by the CSR team."] })}
    <h2>Beyond the role</h2>
    <ul>${BEYOND_SHORT.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
  </main>
  ${folio("rachelcooray.com", "02")}
</section>
</body></html>`;

// ---------------------------------------------------------------- the ATS CV (one column, plain text, standard headings)
const atsItem = (it: Item) =>
  `<div class="it"><p class="h"><b>${esc(it.title)}</b>${it.org ? `, ${esc(it.org)}` : ""}${it.where ? `, ${esc(it.where)}` : ""}${it.when ? ` | ${esc(it.when)}` : ""}</p>${it.text ? `<p>${esc(it.text)}</p>` : ""}${it.bullets?.length ? `<ul>${it.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`;
const atsOrder = ["Experience", "Education", "Research", "Skills", "Selected projects", "Recognition", "Beyond the role"];
const ats = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Rachel Cooray CV</title>
<style>
@page { size: A4; margin: 12mm 15mm 22mm; @bottom-left { content: "Portfolio and an agent that answers questions about my work: https://rachelcooray.com"; font-family: Arial, Helvetica, sans-serif; font-size: 8pt; color: #5a4e3a; vertical-align: middle; padding-left: 17mm; background: url("${qrData}") no-repeat left center / 13mm 13mm; width: 180mm; } }
body { font-family: Arial, Helvetica, sans-serif; font-size: 9.2pt; line-height: 1.34; color: #2b2318; margin: 0; }
h1 { font-size: 20pt; margin: 0; color: #2b2318; }
.role { font-size: 11pt; font-weight: bold; margin: 1mm 0 1.4mm; color: #46521a; }
.contact { margin: 0 0 3mm; font-size: 9pt; }
h2 { break-after: avoid; font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.04em; color: #46521a; border-bottom: 0.8pt solid #2b2318; padding-bottom: 0.8mm; margin: 3.6mm 0 1.6mm; }
p { margin: 0; }
.it { margin: 0 0 1.8mm; break-inside: avoid; }
.it .h { margin-bottom: 0.4mm; }
ul { margin: 0.6mm 0 0; padding-left: 5mm; }
li { margin: 0.4mm 0; }
</style></head><body>
<h1>Rachel Cooray</h1>
<p class="role">${esc(identity.role)}, ${esc(identity.employer)}</p>
<p class="contact">${contact.map(esc).join(" | ")}</p>
<h2>Summary</h2>
<p>${esc(summary)}</p>
${atsOrder
  .map((h) => blocks.find((b) => b.heading === h))
  .filter((b): b is Block => Boolean(b))
  .map((b) => `<h2>${esc(b.heading)}</h2>${b.heading === "Skills" ? b.items.map((it) => `<p><b>${esc(it.title)}:</b> ${esc(it.text ?? "")}</p>`).join("") : b.items.map(atsItem).join("")}`)
  .join("\n")}
</body></html>`;

const all = mag + ats + JSON.stringify(blocks) + summary;
// From the content spec. The scholarship she was given and the list of
// Layer1 client types are allowed; applications and counts are not.
const banned = [/—/, /68\s?%/, /93\.75/, /40\s?%/, /scholarship application/i, /fiction/i, /novel/i, /pen name/i, /FICTA/i, /CIMA study assistant/i, /CV assistant/i, /LKR/, /\blead(s|ing)? (four|six|the|ai|analytics|use)/i, /\b\d+\+?\s+(clients?|projects)\b/i];
for (const b of banned) if (b.test(all)) throw new Error(`CV contains banned pattern ${b}`);

writeFileSync(join(out, "cv.html"), mag);
writeFileSync(join(out, "cv-ats.html"), ats);
writeFileSync(join(out, "cv.json"), JSON.stringify({ name: identity.name, role: `${identity.role}, ${identity.employer}`, contact, summary, blocks }, null, 2));

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
for (const [src, name] of [["cv.html", "rachelcooray-cv.pdf"], ["cv-ats.html", "rachelcooray-cv-ats.pdf"]]) {
  const pdf = join(root, "public", name);
  if (existsSync(pdf)) rmSync(pdf);
  execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files", `--print-to-pdf=${pdf}`, `file://${join(out, src)}`], { stdio: "ignore" });
  console.log(`Wrote ${pdf}`);
}
