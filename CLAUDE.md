# rachelcooray.com — Next.js rebuild

Rebuilding the portfolio as a Next.js (static export) site with a 3D robot
guide (three.js) that points at content and narrates it. Replaces the
Flutter app that still lives on `main`.

## Where this lives

- This worktree: `/Users/rachelcooray/Desktop/Portfolio-redesign`, branch
  `redesign`.
- The stable, currently-deployed site: `/Users/rachelcooray/Desktop/Portfolio`,
  branch `main`. Don't touch it from here — they're separate worktrees of
  the same repo, sharing git history but not working-tree files.
- Robot prototype lab (reference only, never edit): `~/Desktop/Portfolio-robot`.
  Its own `CLAUDE.md` documents the model pipeline, face-drawing approach,
  and gotchas (bone names, scale compensation, etc.) — read it before
  touching anything robot-related.
- `REDESIGN_HANDOFF.md` (repo root) — palette, typography, section order,
  and final copy decided during the Flutter polishing session. Source of
  truth for palette/copy; this file (and the master prompt) is the source
  of truth for the robot/tour/Next.js build itself.

## Node version

System Node was `20.3.0` — too old for current Next.js (`>=20.9.0`) and for
several tools the robot lab already hit this exact issue with. Installed
`nvm` and Node LTS (`v24.21.0`) for this project; `.nvmrc` pins `lts/*`.
System `/usr/local/bin/node` is untouched. Every shell command in this repo
needs nvm sourced first:
```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; nvm use --lts
```

## Stack

Next.js 16 (App Router, static export via `output: "export"`), TypeScript,
Tailwind CSS v4, three.js + GSAP (not yet wired in — Milestone 3).

## Commands

- `npm run dev` — dev server.
- `npm run build` — static export to `./out`.
- `npm run knowledge` — regenerate `knowledge/knowledge.md` from
  `src/content/content.ts` (run this after any content change).

## File layout (so far)

- `src/content/content.ts` — single typed source of truth for all page
  content, tour narration, and the Q&A knowledge base. See the file's own
  header comment for the shape (`narration`, `inTour`, `knowledgeOnly`).
- `scripts/export-knowledge.ts` — builds `knowledge/knowledge.md` from
  `content.ts`. Run via `npm run knowledge`.
- `knowledge/knowledge.md` — generated, not hand-edited.
- `client/`, `server/` — the old Flutter app and its contact-form backend.
  Still present for reference (real content/images/CV PDF live under
  `client/assets/` and `client/web/`) but not part of the Next.js build.
  Will be removed once the rebuild fully replaces it.
- `.github/workflows/deploy.yml` — updated to build this Next.js app
  (`npm run build`, publish `./out`) instead of Flutter. Only fires on
  push to `main`, which this worktree never pushes to directly.

## Content decisions worth knowing

- Several items in `content.ts` are deliberate `[PLACEHOLDER: ...]`
  markers, not gaps I forgot — see the TODO list below. Never fill these
  in with invented specifics.
- `projects` curates 4 items into the tour (PCOS Care, the Microsoft
  EMBRACE hackathon project, a finance content explainer, Carbon Footprint
  Tracker); the rest of Rachel's real projects (CV Writing Assistant, CIMA
  AI Study Assistant, Futsal, CSR Street Vendors, Fantasy Coin Collector)
  are marked `knowledgeOnly: true` — real, not deleted, just not in the
  curated highlights tour. Same pattern for retail/customer-service roles
  and the full OCTAVE role history (only the current "Analyst, Data and
  AI" role is in the tour; the Associate/Intern roles before it are
  `knowledgeOnly`).
- Teaching & Mentoring and Perspective sections are carried over verbatim
  from `REDESIGN_HANDOFF.md`. Perspective is explicitly a first draft in
  Rachel's voice — flagged there and in `content.ts` — she should read and
  edit it before it's treated as final.
- Narration copy I drafted myself (not lifted verbatim from existing
  copy) needs her review per the master prompt's own instruction. See
  TODO.

## Open items / TODO

- `[PLACEHOLDER: APPROVED OCTAVE WORDING]` — the current-role narration
  and detail bullet for "Analyst, Data and AI" need approved public
  wording; don't invent OCTAVE-specific claims.
- `project-finance-explainer` — a "finance content explainer" project was
  named in the master prompt with no description. Needs a real name,
  description, tech stack, and narration line.
- `[PLACEHOLDER: LinkedIn URL]`, `[PLACEHOLDER: link to her fiction/pen-name
  work]`, `[PLACEHOLDER: Sketchfab model URL]` — real links needed.
- No image exists yet for the Microsoft EMBRACE hackathon project.
- No teaching-specific CV variant exists (only one CV PDF).
- Narration drafted by me, not yet approved: the Layer1 Studio line, the
  Carbon Footprint Tracker one-liner (condensed from its full
  description), and the intro line. Everything else in `research`,
  `octave` (except the placeholder), and `projects` narration is close to
  verbatim from already-approved copy.
- `tourOrder` in `content.ts` is a first pass at what plays in the
  auto-tour — only 8 items, matching "highlights tour" scope; worth
  Rachel's sign-off before Milestone 4 builds the timeline around it.

## Milestone status

1. **Setup** — done: worktree, Next.js scaffold (static export, Tailwind,
   TypeScript), `content.ts`, knowledge export script, this file, deploy
   workflow updated.
2. Static site (full layout, handoff palette/type, light+dark, no robot) —
   not started.
3. Robot (port from the lab, recolour to burgundy, bigger face) —
   not started.
4. Tour (GSAP timeline, build-ins, highlighter swipes) — not started.
5. Voice (Daniel pipeline, visemes, sync) — not started.
6. Q&A (Cloudflare Worker, streaming, knowledge-base-only answers) —
   not started.
7. Polish (SEO, accessibility, performance) — not started.
8. Static export + deploy + README + TODO report — not started.
