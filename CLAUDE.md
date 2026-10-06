# rachelcooray.com — Next.js rebuild

Rebuilding the portfolio as a Next.js (static export) site with a 3D robot
guide (three.js) that points at content and narrates it. Replaces the
Flutter app that still lives on `main`.

## Where this lives

- This worktree: `/Users/rachelcooray/Desktop/Portfolio/redesign-app`,
  branch `redesign`. Nested inside the main worktree's folder (not a
  sibling) because the dev-server tooling's sandbox can only reach paths
  under the session root — a sibling folder (`../Portfolio-redesign`)
  failed with a `getcwd`/permission error. Excluded from `main`'s git
  status via `.git/info/exclude` (local-only, not committed to `main`).
- The stable, currently-deployed site: `/Users/rachelcooray/Desktop/Portfolio`,
  branch `main`. Don't touch it from here — they're separate worktrees of
  the same repo, sharing git history but not working-tree files.
- Dev server: `.claude/launch.json` lives at the session root
  (`/Users/rachelcooray/Desktop/Portfolio/.claude/launch.json`), not in
  this worktree — it `cd`s into `redesign-app` and prepends nvm's Node
  to PATH before running `npm run dev`. If dependencies are ever missing
  after a fresh checkout of this worktree (node_modules is gitignored,
  correctly), run `npm install` here first.
- Robot prototype lab (reference only, never edit): `~/Desktop/Portfolio-robot`.
  Also pushed to `origin/robot-lab` on this same repo (orphan branch) —
  that's where Milestone 3 actually pulled the robot source/model/draco
  files from (`git archive origin/robot-lab -- <paths> | tar -x`), not a
  manual copy from the lab folder.
- `REDESIGN_HANDOFF.md` (repo root) — palette, typography, original
  section order, and copy decided during the Flutter polishing session.
  Mostly superseded now by decisions made directly in this worktree (see
  below) — treat it as historical context, not the current source of truth.

## Node version

System Node was `20.3.0` — too old for current Next.js (`>=20.9.0`).
Installed `nvm` and Node LTS (`v24.21.0`) for this project; `.nvmrc` pins
`lts/*`. System `/usr/local/bin/node` is untouched. Every shell command in
this repo needs nvm sourced first:
```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; nvm use --lts
```

## Stack

Next.js 16 (App Router, static export via `output: "export"`), TypeScript,
Tailwind CSS v4, three.js + GSAP, Whisper (local, via `whisper` CLI) +
macOS `say` for voice generation.

## Commands

- `npm run dev` — dev server.
- `npm run build` — static export to `./out`.
- `npm run knowledge` — regenerate `knowledge/knowledge.md` from
  `src/content/content.ts` (run after any content change).
- `npm run voice` — regenerate `public/audio/*` from the live tour script
  (`src/tour/buildScript.ts`). Hash-cached — only regenerates lines whose
  text/spokenText/voice changed. Needs `say`, `ffmpeg`, `whisper` (all
  confirmed present on this machine).

## File layout

- `src/content/content.ts` — single typed source of truth for all page
  content, tour narration, and the Q&A knowledge base. Header comment
  explains the shape (`narration`, `inTour`, `knowledgeOnly`, `logo`).
- `src/tour/buildScript.ts` — derives the live tour script from
  `content.ts` + `tourOrder`, skipping any line whose narration is still
  a `[PLACEHOLDER: ...]`.
- `src/tour/TourController.ts` — sequences the script through the Guide:
  audio/mouth sync, subtitle reveal, scroll-into-view, pointAt on cueWord.
- `src/robot/Guide.ts` — framework-agnostic robot controller (ported from
  the lab). `say()` falls back to synthesized word-timing (no audio) for
  any line without generated `/audio/{id}.json` yet.
- `src/robot/RobotFace.ts`, `realRobotMaterials.ts` — face + materials,
  recolored from the lab's ink-blue to the site's burgundy accent; face
  enlarged (eyes 2x, mouth 1.5x) per spec.
- `src/components/Robot.tsx` — mounts Guide onto a canvas, hands the
  instance up via `onGuideReady`.
- `src/components/RobotToggle.tsx` — the robot UI: a waving toggle button
  (top-right), opens a floating glass panel (canvas + subtitles +
  Play/Skip/Sound controls) on click, starts the tour. Owns the
  TourController. Includes an audio-autoplay unlock (plays a silent clip
  synchronously in the click handler) since the real `audioEl.play()`
  happens several async hops later and would otherwise get silently
  blocked by browser autoplay policy.
- `scripts/export-knowledge.ts`, `scripts/generate-voice.ts` — the two
  content-derived generation scripts. Both run via `tsx`.
- `client/`, `server/` — the old Flutter app and its contact-form backend.
  Still present for reference (CV PDF, original images) but not part of
  the Next.js build.
- `.github/workflows/deploy.yml` — builds this Next.js app instead of
  Flutter. Only fires on push to `main`.

## Design decisions made in this worktree (supersede the handoff where they differ)

- **Palette**: burgundy accent kept from the handoff, but the robot's
  colors were changed to match — panels/eyes/mouth burgundy, joints a
  darker burgundy, shell a near-white matching the site background
  (not the handoff's warmer paper tone).
- **Liquid Glass**: floating UI (nav bar, robot toggle/panel/controls/
  subtitles) uses translucent `backdrop-filter: blur() saturate()` panels
  — see `.glass` in `globals.css`. This **replaces** the master prompt's
  original "no frosted nav, no glassmorphism" rule; that rule is no
  longer in effect. A slow-drifting blurred burgundy/highlighter color
  field (`.bg-color-field` in `layout.tsx`) sits fixed behind the page so
  the glass has something to tint from — without it the panels just look
  grey. Respects `prefers-reduced-transparency` (solid fallback) and
  `prefers-reduced-motion` (field stops drifting).
- **Content breadth**: the page shows everything, not a curated subset —
  Rachel's explicit instruction ("put it all now, I'll tell you if it's
  too much"). All projects, all OCTAVE roles, all education, skills,
  volunteering, retail/CS experience are rendered on the page. The tour
  narration (`tourOrder`) stays a curated ~6-line highlights reel — that's
  a separate, narrower concern from what's visible on the page.
- **Voice**: macOS `say -v "Jamie (Premium)"` + Whisper for word timing.
  Narration is **third person** ("She applies AI...", not "I apply AI...")
  since Jamie is a narrator voice, not Rachel's own. "IEEE" has a
  `spokenText` override ("I triple E") — the `say` command mispronounces
  it literally otherwise.
- **Entry UX**: no autoplay-on-load. A waving robot-emoji toggle button
  (top-right, always visible) opens the robot panel and starts the tour
  on click — simpler than the original auto-tour/localStorage/returning-
  visitor state machine from the master prompt, and sidesteps the
  autoplay-audio problem since the click is the gesture.
- Company logos (OCTAVE, Layer1 Studio, UNIQLO, EG On The Move, TK Maxx)
  render next to their Experience entries — Rachel supplied these.

## Open items / TODO

- `[PLACEHOLDER: APPROVED OCTAVE WORDING]` — the current-role ("Analyst,
  Data and AI") detail bullet and tour narration need approved public
  wording. The role card itself still renders (title/dates/company are
  real) — just the bullet and tour line are withheld. Don't invent.
- `project-finance-explainer` — named in the master prompt with no other
  details. Hidden from the page (filtered out, not deleted) until it has
  a real name/description/tech/narration.
- `[PLACEHOLDER: link to her fiction/pen-name work]`,
  `[PLACEHOLDER: Sketchfab model URL]` — real links needed (both footer
  lines are hidden from render until filled in). LinkedIn/GitHub/Email
  are now real.
- No image exists yet for the Microsoft EMBRACE hackathon project.
- No teaching-specific CV variant exists (only one CV PDF).
- Narration drafted by me, not yet approved: Layer1 Studio line, Carbon
  Footprint Tracker one-liner. Research/OCTAVE/EMBRACE narration is close
  to verbatim from already-approved copy.
- Rachel mentioned having Sri Lankan-motif decorative design assets to
  use "where appropriate" — not yet added, waiting on the actual file(s)
  (received only as an inline chat image, no tool can save that to disk;
  asked her to save it to `public/images/` directly).
- Q&A section is UI-only (disabled buttons) — Milestone 6, not started.
  Cloudflare Worker, bundled knowledge.md, rate limiting all still to do.
- SEO/OG image, full accessibility pass, Lighthouse check — Milestone 7,
  not started.
- No `deep` narration (go-deeper chips) — only `short` tour lines exist.
- Visitor-led "walk me through this" contextual prompts — not built
  (the master prompt's spec for this was superseded by the click-to-open
  toggle UX; worth revisiting if wanted).
- Mobile robot framing is the same full-figure camera as desktop, just in
  a smaller panel — not the "waist-up corner crop" the master prompt
  originally specified. Works fine at current panel size; revisit if it
  reads too small.

## Milestone status

1. **Setup** — done.
2. **Static site** — done: full palette (light + dark), typography, every
   content section rendered with `data-guide-id`, Liquid Glass on
   floating UI, Sri-Lanka mention in the bio.
3. **Robot** — done: ported, recolored to burgundy, face enlarged, renders
   live in the toggle panel.
4. **Tour** — core working: script built from `content.ts`, sequential
   playback, scroll-into-view + pointAt + highlighter swipe on cueWord,
   Play/Skip/Replay/Sound controls. Not built: go-deeper chips, visitor-led
   prompts, returning-visitor localStorage state (superseded by the
   click-to-open model — see above).
5. **Voice** — working for the 6 non-placeholder tour lines (Jamie
   Premium, third person, real Whisper word timing). ElevenLabs backend
   stubbed but not implemented.
6. Q&A — not started.
7. Polish — not started.
8. Static export + deploy + README + TODO report — static export verified
   working (`npm run build`); full deploy/README/TODO-report pass not
   done.
