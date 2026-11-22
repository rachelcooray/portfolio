/**
 * Builds the CV from src/content/content.ts, so the site, the Ask agent and
 * the CV can never disagree.
 *
 *   npm run cv
 *
 * Writes cv-build/cv.html (two magazine-style A4 pages, with a robot holding
 * a phone that shows a QR code to the site) and cv-build/cv.json, prints the
 * HTML to public/rachelcooray-cv.pdf with headless Chrome, then
 * scripts/build_cv_docx.py turns the JSON into public/rachelcooray-cv.docx.
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
  { heading: "Projects", items: buildLog.map((b) => ({ title: b.title, when: b.year ?? undefined, text: `${firstSentence(b.built)} ${b.tools.join(", ")}.` })) },
  { heading: "Skills", items: toolkitStack.map((l) => ({ title: l.layer, text: l.tools.join(", ") })) },
  {
    heading: "Leadership",
    items: [
      ...schoolLife.leadership.map((l) => ({ title: l.role, org: "St. Bridget's Convent, Colombo", when: l.year })),
      { title: "Interact Club", text: schoolLife.interact },
    ],
  },
  { heading: "Volunteering", items: volunteer.items.map((v) => ({ title: v.event, org: v.organization, when: v.dateRange, text: v.summary })) },
  {
    heading: "Customer service and teaching",
    items: [...otherRoles.map((r) => ({ title: r.title, org: r.company, when: r.dateRange })), ...teaching.roles.filter((t) => t.id !== "teaching-student-support").map((t) => ({ title: t.title, org: t.institution, when: t.dateRange }))],
  },
  { heading: "Recognition", items: achievements.map((a) => ({ title: a.title, org: a.organization, when: a.year })) },
];

// ---------------------------------------------------------------- the creative PDF
const font = (f: string) => `file://${join(root, "src/fonts", f)}`;
const bot = readFileSync(join(here, "assets/cv-bot.svg"), "utf8");
const stages = ["Factory", "Dispatch", "Distributor", "Market"] as const;
const stageLabel: Record<string, string> = { Factory: "Factory", Dispatch: "Dispatch", Distributor: "Distributor", Market: "Outlets" };

const entry = (it: Item) =>
  `<div class="entry"><div class="entry-row"><span class="entry-title">${esc(it.title)}</span>${it.when ? `<span class="entry-when">${esc(it.when)}</span>` : ""}</div>${it.org ? `<div class="entry-org">${esc(it.org)}${it.where ? ` · ${esc(it.where)}` : ""}</div>` : ""}${it.text ? `<p>${esc(it.text)}</p>` : ""}${it.bullets?.length ? `<ul>${it.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}</div>`;

const exp = blocks[0].items;
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Rachel Cooray CV</title>
<style>
@font-face { font-family: Garamond; src: url("${font("eb-garamond-400-800-normal.woff2")}") format("woff2"); font-weight: 400 800; }
@font-face { font-family: Garamond; src: url("${font("eb-garamond-400-800-italic.woff2")}") format("woff2"); font-style: italic; font-weight: 400 800; }
@font-face { font-family: Plex; src: url("${font("ibm-plex-sans-100-700-normal.woff2")}") format("woff2"); font-weight: 100 700; }
@font-face { font-family: PlexMono; src: url("${font("ibm-plex-mono-400-normal.woff2")}") format("woff2"); font-weight: 400; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font-family: Plex, "Helvetica Neue", Arial, sans-serif; font-size: 8.6pt; line-height: 1.42; color: #2b2318; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; display: grid; grid-template-columns: 66mm 1fr; overflow: hidden; page-break-after: always; position: relative; }
.page:last-child { page-break-after: auto; }
.spine { background: #efe6d3; border-right: 0.6pt solid #2b2318; padding: 14mm 7mm 12mm 9mm; display: flex; flex-direction: column; gap: 5mm; }
.main { padding: 14mm 12mm 14mm 10mm; display: flex; flex-direction: column; gap: 3.6mm; box-shadow: inset 6mm 0 6mm -6mm rgba(43,35,24,0.18); }
.k { font-family: PlexMono, monospace; font-size: 6.8pt; letter-spacing: 0.12em; text-transform: uppercase; color: #7a6142; }
.mast { font-family: Garamond, Georgia, serif; font-size: 34pt; line-height: 0.86; color: #46521a; letter-spacing: -0.5pt; }
.title { font-family: Garamond, Georgia, serif; font-size: 12pt; line-height: 1.15; }
.rule { border-top: 0.6pt solid #2b2318; padding-top: 2mm; }
.contact { list-style: none; margin: 0; padding: 0; font-family: PlexMono, monospace; font-size: 7pt; line-height: 1.7; word-break: break-word; }
.bot { display: flex; flex-direction: column; align-items: center; gap: 1.5mm; background: #faf7ef; border: 0.6pt solid #46521a; border-radius: 4mm; padding: 3mm 2mm 2.5mm; }
.bot svg { width: 40mm; height: auto; }
.bot p { margin: 0; text-align: center; font-size: 7.4pt; line-height: 1.3; }
.bot b { font-family: Garamond, Georgia, serif; font-size: 11pt; font-weight: 500; color: #46521a; display: block; }
.side-h { font-family: Garamond, Georgia, serif; font-size: 13pt; color: #46521a; border-bottom: 0.6pt solid #2b2318; padding-bottom: 1mm; margin-bottom: 1.5mm; }
.tools { display: flex; flex-direction: column; gap: 1.8mm; }
.tools .layer { font-family: PlexMono, monospace; font-size: 6.6pt; letter-spacing: 0.1em; text-transform: uppercase; color: #7a6142; }
.tags { display: flex; flex-wrap: wrap; gap: 1mm; margin-top: 0.6mm; }
.tags span { font-size: 6.9pt; padding: 0.3mm 1.6mm; border: 0.5pt solid #cfc3a6; border-radius: 3mm; background: #faf7ef; }
.list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 1.6mm; font-size: 7.8pt; line-height: 1.35; }
.list b { font-weight: 600; }
.lead { font-family: Garamond, Georgia, serif; font-size: 11.6pt; line-height: 1.32; }
h2 { margin: 1.5mm 0 0; font-family: Garamond, Georgia, serif; font-weight: 500; font-size: 17pt; line-height: 1; color: #46521a; display: flex; align-items: baseline; gap: 3mm; }
h2::after { content: ""; flex: 1; border-bottom: 0.6pt solid #2b2318; transform: translateY(-1mm); }
.entry { break-inside: avoid; }
.entry-row { display: flex; align-items: baseline; gap: 2mm; }
.entry-title { font-weight: 600; font-size: 9pt; }
.entry-row::after { content: ""; order: 1; flex: 1; border-bottom: 1pt dotted #7a6142; opacity: 0.6; transform: translateY(-0.8mm); }
.entry-when { order: 2; font-family: PlexMono, monospace; font-size: 7pt; color: #7a6142; white-space: nowrap; }
.entry-org { color: #5e5143; font-size: 8pt; }
.entry p { margin: 0.6mm 0 0; }
ul { margin: 0.8mm 0 0; padding-left: 3.6mm; }
li { margin-top: 0.5mm; }
li::marker { color: #46521a; }
.chain { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6mm; margin: 1.4mm 0 0.6mm; position: relative; }
.chain::before { content: ""; position: absolute; left: 6%; right: 6%; top: 3.1mm; border-top: 1pt dashed #46521a; }
.stop { position: relative; text-align: center; }
.dot { width: 6.2mm; height: 6.2mm; border-radius: 50%; background: #46521a; margin: 0 auto 1mm; border: 1pt solid #c7d42b; }
.stop .k { display: block; color: #46521a; }
.stop span { display: block; font-size: 6.9pt; line-height: 1.25; }
.uc { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2mm 4mm; margin-top: 1mm; }
.uc div { font-size: 7.6pt; line-height: 1.3; border-top: 0.5pt solid #cfc3a6; padding-top: 0.8mm; }
.uc b { font-weight: 600; color: #46521a; }
.ladder { font-family: PlexMono, monospace; font-size: 7pt; color: #5e5143; }
.folio { position: absolute; left: 75mm; right: 12mm; bottom: 7mm; display: flex; justify-content: space-between; font-family: PlexMono, monospace; font-size: 6.6pt; letter-spacing: 0.1em; text-transform: uppercase; color: #7a6142; border-top: 0.5pt solid #cfc3a6; padding-top: 1.5mm; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm 5mm; }
.mini { font-size: 7.8pt; }
.mini .entry-title { font-size: 8.4pt; }
.exam { display: flex; flex-direction: column; gap: 0.4mm; font-size: 7.6pt; }
.exam div { display: flex; gap: 1.5mm; }
.exam div::after { content: ""; order: 1; flex: 1; border-bottom: 1pt dotted #7a6142; opacity: 0.6; transform: translateY(-0.9mm); }
.exam em { order: 2; font-style: normal; font-family: Garamond, Georgia, serif; font-size: 9.5pt; color: #46521a; }
</style></head><body>

<section class="page">
  <aside class="spine">
    <div>
      <div class="k">Issue 01 · Curriculum vitae</div>
      <div class="mast">Rachel<br>Cooray</div>
    </div>
    <div class="title rule">${esc(identity.role)}<br><span style="color:#5e5143">${esc(identity.employer)}</span></div>
    <ul class="contact">${contact.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
    <div class="bot">${bot}<p><b>Scan me.</b>The full portfolio, and an agent that answers questions about my work.</p></div>
    <div>
      <div class="side-h">The toolkit</div>
      <div class="tools">${[...toolkitStack]
        .reverse()
        .map((l) => `<div><div class="layer">${esc(l.layer)}</div><div class="tags">${l.tools.map((t) => `<span>${esc(t)}</span>`).join("")}</div></div>`)
        .join("")}</div>
    </div>
  </aside>
  <main class="main">
    <div class="k">Rachel Cooray · Data, AI, business, people</div>
    <p class="lead" style="margin:0">${esc(summary)}</p>
    <h2>Experience</h2>
    <div class="entry">
      <div class="entry-row"><span class="entry-title">${esc(analyst.title)}</span><span class="entry-when">${esc(analyst.dateRange)}</span></div>
      <div class="entry-org">${esc(analyst.company)} · ${esc(analyst.location)} · ${esc(octave.meta.replace("Colombo, Sri Lanka. ", ""))}</div>
      <div class="chain">${stages
        .map((st) => `<div class="stop"><div class="dot"></div><span class="k">${stageLabel[st]}</span><span>${useCases.filter((u) => u.stage === st).map((u) => esc(u.code)).join(" · ")}</span></div>`)
        .join("")}</div>
      <div class="uc">${useCases.map((u) => `<div><b>${esc(u.name)}.</b> ${esc(u.line)}</div>`).join("")}</div>
      <ul>${roleBullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <p class="ladder" style="margin:1mm 0 0">At OCTAVE: ${[...octave.roles, ...octave.earlier].map((r) => `${esc(r.title)} (${esc(r.dateRange)})`).join(" · ")}</p>
    </div>
    ${entry(exp[3])}
    ${entry(exp[4])}
  </main>
  <div class="folio"><span>Rachel Cooray · CV</span><span>01 / 02</span></div>
</section>

<section class="page">
  <aside class="spine">
    <div>
      <div class="side-h">Education</div>
      <ul class="list">${education.map((e) => `<li><b>${esc(e.title)}</b><br>${esc(e.institution)}, ${esc(e.dateRange)}</li>`).join("")}</ul>
    </div>
    <div>
      <div class="side-h">School results</div>
      ${schoolLife.exams
        .map((x) => `<div class="exam" style="margin-bottom:2mm"><span class="k">${esc(x.level)} · ${esc(x.year)}</span>${x.results.map(([s, g]) => `<div><span>${esc(s)}</span><em>${esc(g)}</em></div>`).join("")}${"note" in x && x.note ? `<span style="font-size:6.8pt;color:#5e5143">Nine As in all.</span>` : ""}</div>`)
        .join("")}
    </div>
    <div>
      <div class="side-h">Recognition</div>
      <ul class="list">${achievements.map((a) => `<li><b>${esc(a.title)}</b>, ${esc(a.year)}</li>`).join("")}<li><b>Three individual golds and every relay gold</b>, JKH swim meet, 2026</li></ul>
    </div>
    <div>
      <div class="side-h">Memberships</div>
      <div class="tags">${volunteer.memberships.map((m) => `<span>${esc(m)}</span>`).join("")}</div>
    </div>
    <div>
      <div class="side-h">Outside work</div>
      <p style="margin:0;font-size:7.8pt">${esc(volunteer.hobbies.join(", "))}.</p>
    </div>
  </aside>
  <main class="main">
    <div class="k">Continued</div>
    <h2>Research</h2>
    ${entry(blocks[1].items[0])}
    <h2>Projects</h2>
    <div class="grid2 mini">${blocks[3].items.map(entry).join("")}</div>
    <h2>Leadership and school</h2>
    <div class="entry mini"><p style="margin:0">${schoolLife.leadership.map((l) => `<b>${esc(l.role)}</b>, ${esc(l.year)}`).join(" · ")}. ${esc(schoolLife.interact)} Teams: ${esc(schoolLife.teams.join("; "))}.</p></div>
    <h2>Volunteering</h2>
    <div class="grid2 mini">${volunteer.items.map((v) => entry({ title: v.event, org: v.organization, when: v.dateRange })).join("")}</div>
    <h2>Customer service and teaching</h2>
    <div class="grid2 mini">${blocks[7].items.map((it) => entry(it)).join("")}</div>
  </main>
  <div class="folio"><span>rachelcooray.com</span><span>02 / 02</span></div>
</section>
</body></html>`;

const all = html + JSON.stringify(blocks) + summary;
// From the content spec. The scholarship she was given and the list of
// Layer1 client types are allowed; applications and counts are not.
const banned = [/—/, /68\s?%/, /93\.75/, /40\s?%/, /scholarship application/i, /fiction/i, /novel/i, /pen name/i, /FICTA/i, /CIMA study assistant/i, /CV assistant/i, /LKR/, /\blead(s|ing)? (four|six|the|ai|analytics|use)/i, /\b\d+\+?\s+(clients?|projects)\b/i];
for (const b of banned) if (b.test(all)) throw new Error(`CV contains banned pattern ${b}`);

writeFileSync(join(out, "cv.html"), html);
writeFileSync(join(out, "cv.json"), JSON.stringify({ name: identity.name, role: `${identity.role}, ${identity.employer}`, contact, summary, blocks }, null, 2));

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pdf = join(root, "public/rachelcooray-cv.pdf");
if (existsSync(pdf)) rmSync(pdf);
execFileSync(chrome, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files", `--print-to-pdf=${pdf}`, `file://${join(out, "cv.html")}`], { stdio: "ignore" });
console.log(`Wrote ${pdf}`);
