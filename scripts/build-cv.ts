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
  skillCloud,
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
const portrait = `file://${join(root, "public/images/mag/rachel-portrait.webp")}`;
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

const INDEX = ["About", "Experience", "Education", "Research", "Skills", "Contact"];
const spine = (active: string[], n: string) => `
  <aside class="spine">
    <div class="spine-name">Rachel<br>Cooray</div>
    <div class="spine-rule"></div>
    <ol class="index">${INDEX.map((x, i) => `<li${active.includes(x) ? ' class="on"' : ""}><span>0${i + 1}</span>${x}</li>`).join("")}</ol>
    <div class="spine-n">${n} / 02</div>
  </aside>`;
const footer = `
  <footer class="foot">
    <div class="foot-k">Let's connect</div>
    <div class="foot-c"><span>${esc(identity.email)}</span><span>${esc(identity.phone)}</span><span>linkedin.com/in/rachel-cooray-069034235</span></div>
    <div class="foot-qr"><b>rachelcooray.com</b></div>
  </footer>`;

// Light-ground versions of the site's word cloud colours, all AA on cream.
const CLOUD: Record<string, string> = { think: "#5e4a8a", data: "#2a6aa5", ai: "#46521a", insight: "#7a5a12", product: "#9a4a2a", delivery: "#2b2318" };
const cloudWords = [...skillCloud].filter((w) => w.weight >= 3).sort((a, b) => b.weight - a.weight);

const mag = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Rachel Cooray CV</title>
<style>${fonts}
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: Plex, "Helvetica Neue", Arial, sans-serif; font-size: 8.4pt; line-height: 1.42; color: #2b2318; background: #faf7ef; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; display: grid; grid-template-columns: 40mm 1fr; grid-template-rows: 1fr auto; overflow: hidden; page-break-after: always; background: #faf7ef; }
.page:last-child { page-break-after: auto; }
.spine { grid-row: 1 / 3; background: #46521a; color: #faf7ef; padding: 14mm 0 12mm; display: flex; flex-direction: column; }
.spine-name { font-family: Garamond, Georgia, serif; font-size: 19pt; line-height: 0.95; padding: 0 6mm; }
.spine-rule { margin: 7mm 6mm 6mm; border-top: 0.6pt solid #cfc6ae; }
.index { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 1mm; }
.index li { font-family: PlexMono, monospace; font-size: 7pt; letter-spacing: 0.12em; text-transform: uppercase; padding: 2.6mm 6mm; color: #faf7ef; }
.index li span { display: block; font-size: 6.6pt; color: #cfc6ae; margin-bottom: 0.6mm; }
.index li.on { background: #c7d42b; color: #2b2318; }
.index li.on span { color: #2b2318; }
.spine-n { margin-top: auto; padding: 0 6mm; font-family: PlexMono, monospace; font-size: 7pt; color: #cfc6ae; }
.main { overflow: hidden; padding: 11mm 11mm 6mm 10mm; display: flex; flex-direction: column; gap: 3.2mm; min-width: 0; }
.top { display: flex; align-items: center; gap: 4mm; font-family: PlexMono, monospace; font-size: 6.8pt; letter-spacing: 0.16em; text-transform: uppercase; }
.top::after { content: ""; flex: 1; border-top: 0.6pt solid #2b2318; order: 1; }
.top em { order: 2; font-family: Garamond, Georgia, serif; font-style: italic; font-size: 10pt; letter-spacing: 0; text-transform: none; }
.hero { display: grid; grid-template-columns: 1fr 44mm; gap: 6mm; align-items: end; }
.name { font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 46pt; line-height: 0.86; letter-spacing: -1pt; color: #46521a; margin: 0; }
.strap { font-family: Garamond, Georgia, serif; font-style: italic; font-size: 13pt; margin: 2.4mm 0 2mm; }
.lead { font-size: 9.2pt; line-height: 1.5; margin: 0; }
.photo { height: 58mm; background: #efe6d3; border-bottom: 3pt solid #46521a; overflow: hidden; }
.photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 0%; display: block; }
.quote { font-family: Garamond, Georgia, serif; font-style: italic; font-size: 14pt; line-height: 1.2; color: #46521a; border-left: 3pt solid #c7d42b; padding: 1mm 0 1mm 4mm; margin: 0; }
h2 { margin: 1.6mm 0 0; font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 17pt; line-height: 1; color: #2b2318; display: flex; align-items: baseline; gap: 3mm; }
h2::after { content: ""; flex: 1; border-bottom: 0.6pt solid #2b2318; transform: translateY(-1.2mm); }
.cols { display: grid; grid-template-columns: 1.45fr 1fr; gap: 7mm; }
.col { display: flex; flex-direction: column; gap: 2.6mm; min-width: 0; }
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
.chain { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.4mm; margin: 1.6mm 0 0.4mm; position: relative; }
.chain::before { content: ""; position: absolute; left: 7%; right: 7%; top: 2.4mm; border-top: 1pt dashed #46521a; }
.stop { position: relative; text-align: center; }
.dot { width: 4.8mm; height: 4.8mm; border-radius: 50%; background: #46521a; margin: 0 auto 0.8mm; }
.stop .k { display: block; font-family: PlexMono, monospace; font-size: 6.2pt; letter-spacing: 0.1em; text-transform: uppercase; color: #46521a; }
.stop span { display: block; font-size: 6.9pt; line-height: 1.25; margin-top: 0.3mm; }
.cloud { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5mm 3mm; line-height: 1.05; font-family: Garamond, Georgia, serif; }
.cloud .w5 { font-size: 17pt; } .cloud .w4 { font-size: 13pt; } .cloud .w3 { font-size: 10pt; }
.key { display: flex; flex-wrap: wrap; gap: 1mm 3.5mm; font-family: PlexMono, monospace; font-size: 6.4pt; letter-spacing: 0.06em; text-transform: uppercase; color: #5a4e3a; margin-top: 1.6mm; }
.key i { display: inline-block; width: 2mm; height: 2mm; border-radius: 50%; margin-right: 1mm; vertical-align: middle; }
.tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4mm; }
.tile { background: #efe6d3; padding: 3mm 3.4mm 3.2mm; border-bottom: 2pt solid #46521a; font-family: Garamond, Georgia, serif; font-size: 10.6pt; line-height: 1.2; }
.tile small { display: block; font-family: PlexMono, monospace; font-size: 6.2pt; letter-spacing: 0.1em; text-transform: uppercase; color: #6b5436; margin-top: 1mm; }
.tile.data { border-bottom-color: #2a6aa5; } .tile.think { border-bottom-color: #5e4a8a; }
.foot { grid-column: 2; background: #36400f; color: #faf7ef; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 6mm; padding: 4mm 11mm 4mm 10mm; }
.foot-k { font-family: PlexMono, monospace; font-size: 7pt; letter-spacing: 0.22em; text-transform: uppercase; color: #c7d42b; }
.foot-c { display: flex; flex-wrap: wrap; gap: 0.6mm 5mm; font-family: PlexMono, monospace; font-size: 7pt; }
.foot-qr { display: flex; align-items: center; gap: 2.6mm; font-size: 6.8pt; line-height: 1.3; }
.foot-qr b { font-weight: 600; color: #c7d42b; }
.qr { width: 17mm; height: 17mm; background: #faf7ef; padding: 1.2mm; }
.qr svg { width: 100%; height: 100%; display: block; }
.small { font-size: 7.8pt; }
.bot { margin-top: auto; display: grid; grid-template-columns: 24mm 1fr; align-items: center; gap: 3.4mm; background: #efe6d3; border-top: 2pt solid #46521a; padding: 3mm 3.4mm; }
.bot svg { width: 24mm; height: auto; display: block; }
.bot p { margin: 0; font-size: 7.8pt; line-height: 1.35; }
.bot b { display: block; font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 15pt; line-height: 1.05; color: #46521a; margin-bottom: 1mm; }
</style></head><body>

<section class="page">
  ${spine(["Experience"], "01")}
  <main class="main">
    <div class="top">Curriculum vitae<em>rachelcooray.com</em></div>
    <div class="hero">
      <div>
        <h1 class="name">Rachel<br>Cooray</h1>
        <p class="strap">${esc(identity.role)}, ${esc(identity.employer)}.</p>
        <p class="lead">${esc(summary)}</p>
      </div>
      <div class="photo"><img src="${portrait}" alt=""></div>
    </div>
    <p class="quote">${esc(identity.tagline)}</p>
    <div class="cols">
      <div class="col">
        <h2>Experience</h2>
        <div class="entry">
          <div class="entry-row"><span class="entry-title">${esc(analyst.title)}</span><span class="entry-when">${esc(analyst.dateRange)}</span></div>
          <div class="entry-org">${esc(analyst.company)} · ${esc(analyst.location)}</div>
          <p>Own six AI and analytics use cases across the FMCG value chain, from analysis and solution design to the business using them. ${esc(octave.meta.replace("Colombo, Sri Lanka. ", ""))}</p>
          <div class="chain">${stages
            .map((st) => `<div class="stop"><div class="dot"></div><span class="k">${stageLabel[st]}</span><span>${useCases.filter((u) => u.stage === st).map((u) => esc(u.name)).join("<br>")}</span></div>`)
            .join("")}</div>
          <ul>${roleBullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        </div>
        ${entry({ ...exp[3], bullets: exp[3].bullets?.slice(0, 2) })}
        ${entry({ ...exp[4], bullets: exp[4].bullets?.slice(0, 1) })}
      </div>
      <div class="col">
        <h2>Education</h2>
        ${entry({ title: education[0].title, org: education[0].institution, when: education[0].dateRange, text: "Data Science specialisation. Started at IIT, Sri Lanka, as Batch Representative in Years 1 and 2. UOW/IIT School of Computing and Engineering scholarship, 2024/25." })}
        ${entry({ title: education[1].title, org: "CIMA", when: education[1].dateRange, text: "Operational level in progress." })}
        ${entry({ title: "School", org: "St. Bridget's Convent, Colombo", when: "2008 to 2022", text: `Head Prefect, 2020, and School Prefect of the Year. GCE A/L 2022: ${schoolLife.exams[0].results.map(([sub, g]) => `${sub} ${g}`).join(", ")}. GCE O/L 2018: nine As.` })}
        <div class="bot">${bot}<p><b>Scan me.</b>The full portfolio, and an agent that answers questions about my work.</p></div>
      </div>
    </div>
  </main>
  ${footer}
</section>

<section class="page">
  ${spine(["Research"], "02")}
  <main class="main">
    <div class="top">Continued<em>rachelcooray.com</em></div>
    <h2>Research</h2>
    ${entry({ ...blocks[1].items[0], bullets: [`${research.paper.authors}. DOI ${research.paper.doi}.`, research.paper.description, research.paper.award, research.paper.journal] })}
    <div class="cols">
      <div class="col">
        <h2>Skills</h2>
        <div>
          <div class="cloud">${cloudWords.map((w) => `<span class="w${w.weight}" style="color:${CLOUD[w.group]}">${esc(w.name)}</span>`).join("")}</div>
          <div class="key">${Object.entries({ think: "Thinking", data: "Data", ai: "AI", insight: "Insight", product: "Products", delivery: "Delivery" })
            .map(([k, v]) => `<span><i style="background:${CLOUD[k]}"></i>${v}</span>`)
            .join("")}</div>
        </div>
        <h2>Selected projects</h2>
        ${blocks[3].items.map(entry).join("")}
        <div class="bot">${bot}<p><b>Ask my agent.</b>Questions about my work, answered from my portfolio at rachelcooray.com.</p></div>
      </div>
      <div class="col">
        <h2>Highlights</h2>
        <div class="tiles">
          <div class="tile">First Class BSc Computer Science<small>University of Westminster</small></div>
          <div class="tile data">Published at IEEE ICAHS 2025<small>PCOS Care</small></div>
          <div class="tile">Owns six AI and analytics use cases<small>OCTAVE, John Keells</small></div>
          <div class="tile think">Co-founder, Layer1 Studio<small>Web and mobile</small></div>
        </div>
        <h2>Recognition</h2>
        <ul class="small">${achievements.map((a) => `<li><b>${esc(a.title)}</b>, ${esc(a.organization)}, ${esc(a.year)}</li>`).join("")}</ul>
        <h2>Beyond the role</h2>
        <ul class="small">${BEYOND.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      </div>
    </div>
  </main>
  ${footer}
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
