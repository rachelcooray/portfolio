# Redesign handoff — decisions from the Flutter session

This documents what was decided and built in the Flutter-based redesign session,
for the Next.js rebuild to carry forward. The Flutter *code* is being left behind;
these decisions are not.

All of this is already committed and pushed to `origin/main` (and `redesign`,
currently identical to `main`) as of commit `346e4c4`. Nothing here is uncommitted
or at risk.

## Audience & tone

Built for three audiences reading the same page: a Chevening-style scholarship
panel, university/academic hiring (teaching fit), and technical recruiters — all
invisible to the page itself (no program names anywhere on-site). Design
principle throughout: credibility and fast scanability over decoration. No
animation gimmicks, no hover-gated information, no walls of text.

## Palette

Went through several iterations (dark navy/teal → cream/terracotta "Organic" →
clean monochrome/blue → final). Final palette, in
`client/lib/theme/palette.dart`:

```
bg            #FFFFFF
surface       #F7F7F8
surfaceAlt    #FFFFFF
text          #111111
textMuted     #6B7280
textFaint     #9CA3AF
divider       #E5E7EB

accent        #8B1E3F   (deep burgundy — deliberately not "corporate blue",
                         reads distinctive + professional, a quiet nod to
                         academic branding)
accentHover   #6B1730
accentSoft    #F6E4E9
secondary     #6B7280
```

Rule followed throughout: the accent is reserved for CTAs, links, and small
focal highlights — not used on every icon/border/label. Most labels and
secondary text use `textFaint`/`textMuted`, not the accent.

## Typography

Two-font pairing, no third decorative face:
- **Fraunces** (Google Font), italic, weight 600 — for the name in the hero,
  section titles, the Perspective/Contact headlines, and proof-strip stat
  values. This is the one deliberately distinctive/characterful element.
- **Figtree** (Google Font) — body text and everything else, weights up to 700.

Earlier iteration used Caprasimo (rounded display face) + Figtree, tied to the
abandoned "Organic" cream palette — dropped entirely in the final version.

## Section order (top to bottom)

1. **Hero** — name, role line, intro, CTAs (Download CV / GitHub / LinkedIn),
   a 4-item "proof strip" (First Class / IEEE ICAHS 2025 / 3rd Place / +68%),
   aspiration callout.
2. **About** — bio + 4 highlight bullets + photo.
3. **Publications** — moved up right after About (deliberately, for an
   academic-reading audience) — IEEE ICAHS 2025 + MSIT Journal selection.
4. **Education** — BSc (Hons) Computer Science Westminster, CIMA certificate,
   secondary school.
5. **Teaching & Mentoring** — new section, not buried in "other experience".
   Class Teacher + Student Support Worker roles, with a short "why I teach"
   framing paragraph (see Copy section below).
6. **Experience** — industry roles only, newest-first (see Content corrections).
   Retail/customer-service roles (UNIQLO, EG On The Move, TK Maxx) live in a
   collapsed "Also worked in" accordion group at the bottom, not deleted, just
   deprioritized.
7. **Projects** — curated/reordered by relevance: PCOS Care first, then a new
   project card for the Microsoft EMBRACE hackathon (previously only listed as
   an award), then CIMA AI Study Assistant, then the rest (Carbon Footprint
   Tracker, CV Writing Assistant, Futsal, CSR Analytics, Fantasy Coin
   Collector) in original order — not deleted, just deprioritized.
8. **Skills** — grouped by category, plain chips.
9. **Awards** — 4 awards, newest first.
10. **Beyond Work** — merged section containing: Volunteering (structured
    entries with dates/details — see Content corrections), Memberships
    (simple chip list: Rotaract, IEEE Club, etc.), In The News (press cards,
    including the JKH swimming meet feature).
11. **Perspective** — new standalone section, a short first-person piece on
    building interpretable/decision-focused AI systems. **Flagged as a
    first draft** — built only from facts already evidenced elsewhere on the
    site (PCOS Care, OCTAVE dashboards, CIMA RAG tutor), not new claims, but
    Rachel should read/edit it before treating it as final. Full text below.
12. **Contact** — form + social links.

Nav mirrors this order exactly (About, Publications, Education, Teaching,
Experience, Projects, Skills, Awards, Beyond, Perspective, Contact).

## Final copy

**Hero eyebrow:** `DATA SCIENCE · FULL-STACK ENGINEERING`

**Hero intro paragraph** (deliberately bridges the teaching/AI-vision audience
and the recruiter/scholarship audience without naming either):
> "Data Scientist, full-stack engineer, and educator working across applied AI,
> business analytics, and decision-support tooling — turning research and data
> into systems people can actually act on."

**Teaching & Mentoring intro paragraph:**
> "The clearest way I know an idea is understood is being able to teach it.
> Whether that's adapting a lesson for a classroom of primary learners or
> walking a university student through a concept they missed in a lecture,
> teaching has shaped how I explain technical work now — I default to making
> the reasoning behind a result legible, not just the result itself."

**Perspective section** ("On Decisions, Not Just Predictions") — three
paragraphs, full text:
> "Most of the applied AI work I've done shares one constraint: a model's
> output only matters if the person reading it can act on it. A risk score for
> PCOS is only useful if a clinician can see which factors drove it. A
> margin-optimisation model is only useful if the incentive structure it
> recommends is one a distributor team can actually run. A study assistant
> built on a RAG pipeline is only useful if it stays inside the syllabus it's
> meant to teach, rather than answering fluently but wrong.
>
> That's the thread I keep pulling on: building analytics and AI systems that
> are transparent enough for the person on the other end to trust the
> decision, not just the number. In practice that's meant favouring
> interpretable feature selection over black-box performance gains, building
> dashboards around the specific decision someone needs to make rather than
> every metric available, and constraining generative systems to stay
> grounded in source material instead of improvising.
>
> It's also why teaching and data work don't feel like separate halves of
> what I do. Both are exercises in making something complex legible to
> someone who has to use it."

## Content corrections made this session

Source of truth for all content is `client/assets/data.json` — already
updated and accurate as of this commit. Key corrections:

- OCTAVE "Data Science & Analytics Delivery Intern" end date corrected:
  Oct 2025 → **Apr 2026** (was showing "Present").
- Added **Analytics Delivery Associate** role, OCTAVE, Apr–Jun 2026.
- Added **Analyst, Data and AI** role, OCTAVE, Jul 2026–Present (current role,
  confirmed employer this session — was a placeholder, now live).
- Experience and Volunteering are sorted **newest-to-oldest by start date**
  (not just "most recent first" loosely — strict chronological, including
  correctly interleaving Layer1Studio's Dec 2025 start between OCTAVE stints).
- Added 3 **volunteer_experience** entries (structured: title, organization,
  date_range, duration, category, details — richer than the old flat
  `volunteering` string list, which still exists separately for simple
  memberships like Rotaract/IEEE Club):
  - Event Support Volunteer, John Keells Foundation, Sep 2026 — Artist
    Spotlight (8th edition) exhibition launch. Worded carefully as event
    support/operations (registration, guest check-in, coordinating artwork
    sales enquiries) per Rachel's explicit instruction not to word it as
    literally "selling art".
  - Event Assistant, John Keells Foundation, Apr 2026 — La Bamba musical
    ushering.
  - Volunteer, John Keells Foundation, Feb 2026 — Kala Pola event support.
- Added **featured/press entry**: JKH Intercompany Swimming Meet 2026 (Team
  OCTAVE won overall women's championship; Rachel won 3 individual golds +
  gold in every relay, Under-25 category). Image at
  `client/assets/images/swimmingmeet.jpeg`. Link is a John Keells Holdings
  LinkedIn company-page URL (not a permalink to the specific post — it's the
  best available source link).
- Reordered **projects**: new project card added for the Microsoft EMBRACE
  "GenAI Chatbot for Neurodiversity Support" hackathon (previously only an
  award entry) — image intentionally null (no screenshot exists), tech tags
  kept generic/non-specific since implementation details weren't confirmed.
- Data model adds a `subtype` field on `other`-type experience entries
  (`retail_cs` / `education_support`) used to route them to the right place
  in the UI (collapsed group vs. dedicated Teaching section) — worth keeping
  this kind of tagging in whatever content schema Next.js uses.

## UX decisions worth replicating (not literal code, but intent)

- **No flip-card or hover-gated info.** An earlier version used a 3D
  click-to-flip interaction on experience cards; Rachel explicitly flagged it
  as "not attractive enough to click on." Replaced with a plain card
  (title/company/date/summary always visible) plus a clearly labelled "Show
  details ⌄" inline dropdown — never hide information behind an undiscoverable
  gesture.
- **Collapsed-by-default secondary content**, never hidden entirely: retail/CS
  roles sit in a labelled, collapsed accordion group under Experience rather
  than being deleted or buried with no indication they exist.
- **Frosted/blurred nav on scroll** (backdrop blur + a subtle shadow, since a
  pure tint is invisible on an all-white background), bouncing/rubber-band
  scroll physics, and a gentle parallax (scale + fade) on the hero as the page
  scrolls past it — the explicit "Apple-style" polish requested. Worth
  reproducing with CSS `backdrop-filter`, scroll-linked transforms, etc.
- Buttons: one solid accent-filled primary CTA per view (Download CV /
  Contact), everything else outlined/secondary.

## Assets

- `client/assets/images/swimmingmeet.jpeg` — new, added this session (JKH
  swimming meet press photo).
- All other images in `client/assets/images/` are pre-existing and still
  referenced correctly in `data.json` (profile photos, project screenshots,
  press photos for Daily FT / Youth Forum / Netcompany showcase / blog).
- `client/web/rachelcooray-cv.pdf` — CV download, referenced from the hero
  and contact sections.

## Known open items

- The Microsoft EMBRACE hackathon project has no screenshot/image — card
  currently falls back to a generic folder icon.
- No teaching-specific CV variant exists (only one CV PDF) — if a
  teaching-specific download is wanted later, that file doesn't exist yet.
