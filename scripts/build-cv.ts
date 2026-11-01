/**
 * Builds the master CV from src/content/content.ts, so the site, the
 * Ask knowledge and the CV can never disagree.
 *
 *   npm run cv
 *
 * Writes cv-build/cv.html and cv-build/cv.json, prints the HTML to
 * public/rachelcooray-cv.pdf with headless Chrome, then
 * scripts/build_cv_docx.py turns the JSON into public/rachelcooray-cv.docx.
 */
import { writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
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
  projects,
  skills,
  achievements,
} from "../src/content/content";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const out = join(root, "cv-build");
mkdirSync(out, { recursive: true });

type Item = { title: string; org?: string; when?: string; where?: string; bullets?: string[]; text?: string };
type Block = { heading: string; items: Item[] };

const contact = [
  identity.location,
  identity.email,
  "linkedin.com/in/rachel-cooray-069034235",
  "github.com/rachelcooray",
  `ORCID ${identity.orcid}`,
  identity.domain,
];

const summary =
  "Analyst, Data and AI at OCTAVE, John Keells Holdings, applying AI and analytics to real business problems. I own four AI and analytics use cases for an FMCG distributor network and design how each one is evaluated in the field. Published researcher at IEEE ICAHS 2025, co-founder of Layer1 Studio, and First Class graduate in Computer Science from the University of Westminster.";

const blocks: Block[] = [
  {
    heading: "Experience",
    items: [
      {
        title: "Analyst, Data and AI",
        org: "OCTAVE, John Keells Holdings",
        when: "Jul 2026 to present",
        where: "Colombo, hybrid",
        bullets: [
          "Own four AI and analytics use cases on the distributor side of an FMCG business: distributor margin incentives, a replenishment system that recommends redistribution volumes, a permanent dispatch plan that minimises lorry costs, and a distributor efficiency model that increases line items per bill.",
          "Design how each use case is checked: pilot and control groups where possible, before and after where not. Start with operational measures such as billing activity, outlet reach and recommendation adherence, then margin. Report results without a control group as an association, not proven impact.",
          "Join regular governance calls with area, regional and sales managers and bring field learning back into each use case. Help prepare answers to challenging questions and slides that lead with the finding for leadership and finance.",
          "Keep reasoning on record through decision logs, process maps and problem statements. Reconcile numbers across dashboards and files and own the corrections. Tools: Excel, Databricks, Power BI.",
        ],
      },
      {
        title: "Analytics Delivery Associate",
        org: "OCTAVE, John Keells Holdings",
        when: "Apr 2026 to Jul 2026",
        where: "Colombo",
      },
      {
        title: "Data Science and Analytics Delivery Intern",
        org: "OCTAVE, John Keells Holdings",
        when: "Oct 2025 to Apr 2026",
        where: "Colombo",
        bullets: octave.roles[2].details,
      },
      {
        title: layer1.title,
        org: layer1.company,
        when: layer1.dateRange,
        where: layer1.location,
        bullets: [layer1.description, layer1.details[0]],
      },
      {
        title: londonSuccessAcademy.title,
        org: londonSuccessAcademy.company,
        when: londonSuccessAcademy.dateRange,
        where: londonSuccessAcademy.location,
        bullets: [
          "Built ETL pipelines on GCP for clickstream and transaction data, scaled processing with PySpark and Parquet partitioning, and produced revenue, daily active user and conversion funnel insights.",
        ],
      },
      {
        title: "Earlier internships at OCTAVE",
        when: "2022 and 2023",
        text: octave.earlier.map((r) => `${r.title}, ${r.dateRange}`).join(". ") + ".",
      },
    ],
  },
  {
    heading: "Research",
    items: [
      {
        title: research.paper.title,
        org: research.paper.venue,
        when: research.paper.year,
        bullets: [
          `DOI ${research.paper.doi}. ${research.paper.authors}.`,
          research.paper.award,
          research.paper.journal,
          `Deployed app: pcos-care-web-app.onrender.com. ORCID ${identity.orcid}.`,
        ],
      },
    ],
  },
  {
    heading: "Education",
    items: education.map((e) => ({ title: e.title, org: e.institution, when: e.dateRange, text: e.summary })),
  },
  {
    heading: "Selected projects",
    items: projects
      .filter((p) => p.id !== "project-pcos-care")
      .map((p) => ({ title: p.title, org: p.role, text: `${p.description} ${p.tech.join(", ")}.` })),
  },
  {
    heading: "Skills",
    items: skills.map((s) => ({ title: s.category, text: s.items.join(", ") })),
  },
  {
    heading: "Teaching and other roles",
    items: [
      ...teaching.roles.map((t) => ({ title: t.title, org: t.institution, when: t.dateRange })),
      {
        title: "Customer-facing roles while studying in the UK",
        text: otherRoles
          .filter((r) => r.id !== "role-clear-links")
          .map((r) => `${r.title}, ${r.company}, ${r.dateRange}`)
          .join(". ") + ".",
      },
    ],
  },
  {
    heading: "Achievements",
    items: achievements.map((a) => ({ title: a.title, org: a.organization, when: a.year })),
  },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Rachel Cooray CV</title>
<style>
@page { size: A4; margin: 13mm 14mm 12mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 9.1pt; line-height: 1.38; color: #1e0b12; }
h1 { margin: 0; font-family: Georgia, serif; font-weight: 400; font-size: 25pt; line-height: 1; letter-spacing: -0.2pt; color: #4a1024; }
.role { margin-top: 3pt; font-size: 10.5pt; color: #2c4a6b; font-weight: 600; }
.contact { margin-top: 5pt; font-size: 8.4pt; color: #3a3833; }
.contact span + span::before { content: "  |  "; color: #b9b4a8; }
.summary { margin-top: 9pt; padding-top: 8pt; border-top: 0.8pt solid #4a1024; font-size: 9.6pt; }
h2 { margin: 11pt 0 3pt; font-family: Menlo, monospace; font-weight: 500; font-size: 7.8pt; letter-spacing: 1pt; text-transform: uppercase; color: #2c4a6b; border-bottom: 0.5pt solid #d9d3c6; padding-bottom: 2pt; }
.item { margin-top: 5pt; break-inside: avoid; }
.row { display: flex; justify-content: space-between; gap: 12pt; }
.t { font-weight: 600; }
.o { color: #3a3833; }
.w { flex: none; font-family: Menlo, monospace; font-size: 7.6pt; color: #5c5a55; padding-top: 1pt; }
ul { margin: 2pt 0 0; padding-left: 11pt; }
li { margin-top: 1.5pt; }
li::marker { color: #2c4a6b; }
p { margin: 1.5pt 0 0; }
.skills .item { margin-top: 2pt; }
.skills .row { justify-content: flex-start; gap: 6pt; }
</style></head><body>
<h1>${esc(identity.name)}</h1>
<div class="role">${esc(identity.role)}, ${esc(identity.employer)}</div>
<div class="contact">${contact.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
<p class="summary">${esc(summary)}</p>
${blocks
  .map(
    (b) => `<section class="${b.heading === "Skills" ? "skills" : ""}"><h2>${esc(b.heading)}</h2>${b.items
      .map((it) =>
        b.heading === "Skills"
          ? `<div class="item"><span class="t">${esc(it.title)}:</span> ${esc(it.text ?? "")}</div>`
          : `<div class="item"><div class="row"><div><span class="t">${esc(it.title)}</span>${it.org ? `<span class="o">, ${esc(it.org)}</span>` : ""}${it.where ? `<span class="o"> (${esc(it.where)})</span>` : ""}</div>${it.when ? `<div class="w">${esc(it.when)}</div>` : ""}</div>${it.text ? `<p>${esc(it.text)}</p>` : ""}${it.bullets?.length ? `<ul>${it.bullets.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`,
      )
      .join("")}</section>`,
  )
  .join("\n")}
</body></html>`;

const all = html + JSON.stringify(blocks) + summary;
const banned = [/—/, /68\s?%/, /93\.75/, /40\s?%/, /scholarship/i, /fiction/i, /novel/i, /\blead(s|ing)? (four|the|ai|analytics|use)/i, /\bclients\b/i, /\b\d+\s+(clients?|projects)\b/i];
for (const b of banned) if (b.test(all)) throw new Error(`CV contains banned pattern ${b}`);

writeFileSync(join(out, "cv.html"), html);
writeFileSync(join(out, "cv.json"), JSON.stringify({ name: identity.name, role: `${identity.role}, ${identity.employer}`, contact, summary, blocks }, null, 2));

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pdf = join(root, "public/rachelcooray-cv.pdf");
if (existsSync(pdf)) rmSync(pdf);
execFileSync(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${pdf}`,
  `file://${join(out, "cv.html")}`,
], { stdio: "ignore" });
console.log(`Wrote ${pdf}`);
