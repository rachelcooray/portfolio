# rachelcooray.com

Next.js 16 static export (App Router, TypeScript), deployed to GitHub Pages
from `main` by `.github/workflows/deploy.yml`.

## Where this lives

- `/Users/rachelcooray/Desktop/Portfolio/redesign-app`, branch `redesign`:
  all new work. Nested inside the main worktree's folder because the dev
  server sandbox can only reach paths under the session root.
- `/Users/rachelcooray/Desktop/Portfolio`, branch `main`: the deployed site.
  Never push to `main` without Rachel's approval.
- Commit messages carry no Co-Authored-By Claude trailer.

## Node

System Node is too old. Source nvm first:
```bash
export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"; nvm use --lts
```

## Commands

- `npm run dev`: dev server (webpack; Turbopack dev fails on next/font here).
- `npm run build`: static export to `./out`.
- `npm run typecheck`, `npm run lint`.
- `npm run knowledge`: regenerate `knowledge/knowledge.md` from content.
- `npm run cv`: rebuild `public/rachelcooray-cv.pdf` (headless Chrome) and
  `public/rachelcooray-cv.docx` (python-docx) from content. Fails if any
  banned figure or phrase appears.

## Content rules (from Rachel's brief, 1 Nov 2026)

`src/content/content.ts` is the only source of truth for the site, the case
studies, the Ask command bar and the CV. Never show anywhere:

- the 68% margin figure, the 93.75% recall figure, the old 40% query
  efficiency claim, or any invented or unverifiable performance number;
- stat strips or counter tiles, or any count of Layer1 clients or projects;
- fiction writing or the novel;
- "CIMA" in the study assistant's title or description (it appears only as a
  qualification under Education);
- any scholarship application or award she has not been given;
- the verb "lead" for her OCTAVE use cases (use "own");
- client names or confidential figures; em dashes.

Missing facts stay missing. Do not fill gaps.

## Design

Blue, beige and black cherry: beige ground, black cherry ink and panels,
steel blue accent from the blouse in her photo (`--accent #2C4A6B`,
`--cherry #4A1024`). Instrument Serif, Manrope, IBM Plex
Mono. Fine grids, dot matrices, hairlines. No neon, no AI clichés.

## Architecture

- `src/app/layout.tsx`: an inline head script picks the mode before first
  paint: `gl` (3D stage) when the screen is at least 900 by 560, motion is
  allowed, the device is not low power and WebGL exists; otherwise `lite`.
  It also sets `rm` for reduced motion and `intro-run` or `intro-done`
  (localStorage `rc-intro-seen`).
- `src/components/Stage.tsx`: hero DOM (hello line, summary, the badge
  index `<nav>`, the four selected work cards). Lazy-loads the scene in
  `gl` mode; in `lite` mode the same markup renders as a flat CSS badge.
- `src/stage/scene.ts`: plain three.js. Portrait assembles from pixels
  (shader), a verlet lanyard runs from her collar to a two-leaf hinged badge
  that is pulled toward the camera, flips and opens. The real DOM index is
  mapped onto the right leaf every frame with a CSS `matrix3d` homography,
  so links stay keyboard and screen reader reachable. Scrolling walks the
  camera into a framed painting behind her and on to a hall of four arched
  doors (OCTAVE, Research, AI builds, Layer1). Each featured door eases open
  on a data sculpture; clicking a door or its card link flies through it
  into a black cherry veil and opens the case study.
- `src/components/Header.tsx`: persistent nav listing every section, Ask
  button, menu overlay below 1180px.
- `src/components/AskPalette.tsx` + `src/lib/ask.ts`: command bar on `/`,
  Cmd+K or the Ask button. Searches passages built by `buildPassages()` in
  content.ts and quotes them; never generates text. Includes the "Walk me
  through" tour.
- `src/components/Sections.tsx`: every content section, with the cell-grid
  heading reveal (only when JS is on and motion is allowed).
- `src/app/case-studies/[slug]/page.tsx`: OCTAVE, PCOS Care, Layer1.
- `client/`, `server/`: the old Flutter app and contact backend, reference
  only, ignored by lint and the build.

## Assets

- `public/images/rachel-portrait.png`: cutout of her own photo made with the
  macOS Vision foreground mask. Not generated or altered.
- `public/images/rachel-badge.jpg`: head and shoulders crop of the same.
- `public/og.png`: social preview, 1200 by 630.

## Open items

- Voice clip for the intro: Rachel may supply a short clip in her own voice.
  Audio may only play after a tap. Wire it into the portrait once supplied.
- Evidence area (LLM evaluation write-up, deployed agent): only if supplied.
- LinkedIn Layer1 title should read "Co-founder and Developer" to match.
