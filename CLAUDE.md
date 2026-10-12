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
Tailwind CSS v4, three.js + GSAP, Lenis (page-mode smooth scroll),
Whisper (local, via `whisper` CLI) + macOS `say` for voice generation.

## Dev server uses webpack, not Turbopack (11 Oct 2026)

`next dev` defaults to Turbopack in Next 16, but Turbopack's dev-mode
`next/font/google` resolution (`@vercel/turbopack-next/internal/font/google/font`)
fails to resolve in this sandboxed environment specifically - reproduces
even with a clean `.next` cache, for both fonts, every `@font-face` rule.
`npm run dev` now runs `next dev --webpack` to route around it; confirmed
clean (HTTP 200, real page content, no font errors) under webpack where
the same request 500'd under Turbopack. **Production builds (`npm run
build`) already use Turbopack successfully and are unaffected** - this
is a dev-server-only issue, not a reason to change the build pipeline.
If a future Next.js/Turbopack version fixes this, `--webpack` can be
dropped from the `dev` script to get Turbopack's faster dev rebuilds back.

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
- **Content breadth**: originally "show everything" (Rachel's early
  instruction). Superseded 7 Oct 2026 by her "Page Copy, Top to Bottom"
  doc, which restructures and trims the page deliberately — see "Page
  copy source" below. The tour narration (`tourOrder`) stays its own
  separate, narrower ~6-line highlights reel either way.
- **Page copy source**: `src/content/content.ts` and `src/app/page.tsx`
  follow Rachel's "Page Copy, Top to Bottom" doc (7 Oct 2026) section by
  section - nav (Research · Work · Projects · Ideas · Beyond Work ·
  Contact, in that order - note this differs from the page's own visual
  section order, which the doc also specifies and which page.tsx follows:
  intro → impact strip → Ideas → Research → Work → Projects → Talks →
  Recognition → Education → Beyond work → Contact), hero copy, the new
  Impact Strip, Research's new description/award/journal bullets, Work's
  OCTAVE/Layer1 rewrite, Projects' featured/"More projects" split,
  the new Talks section, Recognition's merged awards+press list,
  Education trimmed, Beyond Work's teaching/volunteering/swimming/writing
  consolidation, and a new Contact paragraph. Ask about Rachel is hidden
  entirely (not just disabled) per the doc, until the Q&A backend exists.
  Case study pages (section 12 of the doc: Distributor margin
  optimisation, PCOS Care, A Layer1 Studio delivery) are **not built** -
  almost every field in them is bracketed/unconfirmed in the doc itself,
  and several sections link to "the case study" (e.g. Research, the
  OCTAVE intern bullet) before those pages exist; those links are
  currently omitted from the page rather than pointing nowhere.
- **Voice**: macOS `say -v "Jamie (Premium)"` + Whisper for word timing.
  Narration is **third person** ("She applies AI...", not "I apply AI...")
  since Jamie is a narrator voice, not Rachel's own. "IEEE" has a
  `spokenText` override ("I triple E") — the `say` command mispronounces
  it literally otherwise.
- **Entry UX (current, 11 Oct 2026)**: first-time visitors get a 20s
  video intro (`src/components/VideoIntro.tsx`), autoplaying muted (no
  gesture to unlock sound) with Turn on sound / Skip controls; marked
  seen the instant it starts (`src/movie/filmState.ts`), so it never
  autoplays again regardless of finish/skip/leave. The video itself
  (`public/videos/intro.mp4`) is two AI-generated takes Rachel supplied,
  concatenated with `ffmpeg -f concat` (same codec/resolution/fps, so a
  clean copy with no re-encode). `FilmGate.tsx` is the gate/owner, same
  role it had for the two things this replaced:
  - **Superseded 11 Oct 2026**: the whole Movie mode system (`src/movie/`,
    `src/components/MovieMode.tsx`) — a 3D-robot cinematic first-visit
    sequence, 5 scenes built (cold open through OCTAVE) before being
    swapped for the real video. Code left in place, just unrooted from
    FilmGate, in case it's revisited.
  - **Superseded 11 Oct 2026**: the even earlier "no autoplay, click a
    waving robot button" entry UX from before Movie mode existed.
- **Robot features paused 11 Oct 2026** (Rachel: "you can pause thr robot
  features"): `RobotToggle` (the Page-mode 3D robot panel — tour
  narration, pointAt/highlighter-on-scroll) is commented out of
  `FilmGate.tsx`, not deleted. The video intro above is unrelated to the
  robot and is unaffected. Re-enabling: uncomment the import and render
  line in `FilmGate.tsx` (also restores the "Watch the intro" replay
  button, currently dead code since nothing renders it).
- Company logos (OCTAVE, Layer1 Studio, UNIQLO, EG On The Move, TK Maxx)
  render next to their Experience entries — Rachel supplied these.

## Open items / TODO

From Rachel's "Page Copy, Top to Bottom" doc's own checklist (7 Oct 2026),
plus implementation notes:

- **OCTAVE approval is the big one.** The Analyst role's two detail
  bullets (four-use-case lead + "run each end to end") are her own
  drafted wording, not invented - but her doc's checklist still lists
  "[Confirm OCTAVE is comfortable with this level of detail]" as
  unresolved. Built and committed on `redesign`, but **held back from
  `main`/deploy** until she confirms. Same caveat covers the Associate
  role's one-line bullet (doc wants different, approved wording; current
  bullet is the older already-public text, kept rather than shown blank)
  and the margin case study / any AI News Shorts mention.
- IEEE Xplore/DOI link for the PCOS Care paper - not added, no link
  supplied yet.
- Exact MSIT Journal status (selected / accepted / in press / under
  review) - doc presents this as an open choice; kept the existing
  "Selected for..." wording (already public before this doc, not newly
  invented) rather than guessing between the other two options.
- FICTA 2027 paper ("Do LLM sales agents game incentive schemes...") -
  doc marks it optional, publish only once comfortable; not added.
- Student Support Worker / Class Teacher one-liners - doc wants new,
  simpler versions; kept the existing (longer, already-public) detail
  bullets rather than removing content pending her replacement text.
- Gym platform and food storefront project examples (Layer1 "Examples")
  - both bracketed "[Confirm this is Layer1 client work]" in the doc;
  omitted entirely, not shown.
- Link to the specific JKH swimming LinkedIn post, full LMD article
  title, fiction/pen-name link, Sketchfab model URL, Google Scholar
  profile - all still placeholder/missing.
- `[PLACEHOLDER: link to her fiction/pen-name work]`,
  `[PLACEHOLDER: Sketchfab model URL]` — footer lines hidden from render
  until filled in.
- No image exists yet for the Microsoft EMBRACE hackathon project.
- No teaching-specific CV variant exists (only one CV PDF).
- Case study pages (doc section 12) not built - see "Page copy source"
  above.
- Rachel mentioned having Sri Lankan-motif decorative design assets to
  use "where appropriate" — the sheet (`public/images/sl-motifs.png`) is
  in place and used once (circular wreath around the hero photo, see
  `src/components/Motif.tsx`); other placements were tried and reverted
  (didn't read well cropped onto cards/strips).
- Q&A section is UI-only and now **hidden entirely** (was disabled
  buttons, per the new copy doc: don't show until the backend is live).
  Cloudflare Worker, bundled knowledge.md, rate limiting all still to do.
- SEO/OG image, full accessibility pass, Lighthouse check — Milestone 7,
  not started. Meta title/description now match the copy doc exactly
  (no em dash).
- No `deep` narration (go-deeper chips) — only `short` tour lines exist.
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
