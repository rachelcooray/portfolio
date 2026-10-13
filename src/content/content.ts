/**
 * Single source of truth for page content, the robot's tour narration,
 * and the Q&A knowledge base (via scripts/export-knowledge.mjs).
 *
 * Every section/item has:
 * - id: stable identifier, used as data-guide-id on the rendered element
 *   and as the audio file basename for narrated items.
 * - narration: { short, deep?, cueWord? } — short plays in the main tour,
 *   deep plays if the visitor picks this topic to go deeper on, cueWord
 *   is the word in `short` the robot points at mid-sentence (optional).
 * - inTour: whether this item is part of the auto-playing highlights tour.
 * - knowledgeOnly: true means it's never rendered or narrated, only
 *   exported into knowledge.md for the Q&A backend.
 *
 * [PLACEHOLDER: ...] markers are real gaps — approved wording or facts
 * that don't exist yet. Never fill these in with invented specifics.
 * They should render visibly in dev mode and appear in the TODO report
 * (see Milestone 8).
 */

export type Narration = {
  short: string;
  deep?: string;
  cueWord?: string;
  // Phonetic respelling fed to the `say` command for words it mispronounces
  // (e.g. "IEEE" -> "I triple E"). Subtitles always show `short`, never this.
  spokenText?: string;
};

export type IntroContent = {
  name: string;
  tagline: string;
  bio: string;
  snapshot: string[];
  photo: string;
  links: { label: string; href: string }[];
  narration: Narration;
};

export type ResearchItem = {
  id: string;
  title: string;
  authors?: string;
  venue: string;
  year: string;
  link: string | null;
  doi?: string;
  doiUrl?: string;
  appUrl?: string;
  highlight: string;
  narration: Narration;
  inTour: boolean;
};

export type RoleItem = {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  location: string;
  details: string[];
  narration: Narration;
  inTour: boolean;
  knowledgeOnly?: boolean;
  logo?: string;
};

export type ProjectItem = {
  id: string;
  title: string;
  role: string;
  description: string;
  tech: string[];
  link: string | null;
  image: string | null;
  narration: Narration;
  inTour: boolean;
  knowledgeOnly?: boolean;
  // Page rendering group: featured (big card, top 4) vs the collapsed
  // "More projects" list. Independent of inTour/knowledgeOnly, which
  // govern the robot's tour and Q&A knowledge base, not page layout.
  featured?: boolean;
};

export type RecognitionItem = {
  id: string;
  title: string;
  organization: string;
  year: string;
  summary: string;
  kind: "award" | "press";
  link?: string | null;
  image?: string | null;
};

export type EducationItem = {
  id: string;
  title: string;
  institution: string;
  dateRange: string;
  summary: string;
  details: string[];
};

export type VolunteerItem = {
  id: string;
  title: string;
  organization: string;
  dateRange: string;
  details: string[];
};

// ---------------------------------------------------------------------
// INTRO
// ---------------------------------------------------------------------

// Source: Rachel's "Page Copy, Top to Bottom" doc (7 Oct 2026) - the
// approved source for page copy from here on (separate from the Robot
// Narration Script, which governs what the robot says, not what the page
// reads). `bio` is kept only for the narration/knowledge-base fields
// below that still reference the old one-line summary; the hero itself
// now renders `bio` as the new intro paragraph and `snapshot` as the
// three-line summary under it.
export const intro: IntroContent = {
  name: "Rachel Cooray",
  tagline: "Applies AI to real business problems.",
  bio: "I build analytics and AI systems that help people make decisions they can understand and act on. I work at the point where a model's output has to become a business decision, and I care most about the step in between: making the reasoning legible to the person who has to use it.",
  snapshot: [
    "Currently: Analyst, Data and AI at OCTAVE, John Keells Holdings, leading four FMCG use cases",
    "Research: Published AI researcher, IEEE ICAHS 2025",
    "Previously: First Class Honours BSc Computer Science, University of Westminster",
  ],
  photo: "/images/profile.png",
  links: [
    { label: "Email", href: "mailto:rachelcooray@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rachel-cooray-069034235/" },
    { label: "CV", href: "/rachelcooray-cv.pdf" },
    { label: "ORCID", href: "https://orcid.org/0009-0009-3192-2669" },
    { label: "GitHub", href: "https://github.com/rachelcooray" },
  ],
  narration: {
    short:
      "This is Rachel. She applies AI to real business problems — as an analyst at OCTAVE, a published researcher, and a technical co-founder at Layer1 Studio.",
    cueWord: "AI",
  },
};

// ---------------------------------------------------------------------
// IMPACT STRIP (hero numbers, each linked to the section that backs it)
// ---------------------------------------------------------------------

export const impactStrip = [
  { figure: "4", label: "AI and analytics use cases I lead for an FMCG client", href: "#work" },
  { figure: "93.75%", label: "recall on early PCOS risk prediction", href: "#research" },
  { figure: "13", label: "projects delivered for 4 clients", href: "#work" },
  { figure: "IEEE", label: "published research, ICAHS 2025", href: "#research" },
];

// ---------------------------------------------------------------------
// RESEARCH
// ---------------------------------------------------------------------

export const researchSectionIntro =
  "I research how machine learning can support decisions people can trust, starting in healthcare and now in commercial incentive design.";

export const research: ResearchItem[] = [
  {
    id: "research-pcos",
    title:
      "PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome",
    authors: "With Malarvizhi Kaniappan Chinnathai and Salma Chahed, University of Westminster",
    venue: "IEEE ICAHS 2025, Tunisia",
    year: "2025",
    link: null,
    doi: "10.1109/ICAHS66950.2025.11553077",
    doiUrl: "https://doi.org/10.1109/ICAHS66950.2025.11553077",
    appUrl: "https://pcos-care-web-app.onrender.com",
    highlight: "Selected for the MSIT Journal special edition, 2026.",
    narration: {
      short:
        "Her IEEE-published research, PCOS Care, predicts PCOS risk early using machine learning — it placed 3rd out of over 400 students at Westminster's showcase and was later selected for a journal special edition.",
      spokenText:
        "Her I triple E-published research, PCOS Care, predicts PCOS risk early using machine learning — it placed 3rd out of over 400 students at Westminster's showcase and was later selected for a journal special edition.",
      cueWord: "IEEE",
    },
    inTour: true,
  },
];

// Page-only fields for the Research section (not part of the tour script).
// description/journalStatus updated from Rachel's Google AI Studio build
// (12 Oct 2026), which she confirmed as accurate when asked to port its
// content in - resolves the "exact MSIT Journal status" open item.
export const researchPageExtra = {
  description:
    "An early-screening web app with two levels of prediction: one from lifestyle and physical signs that anyone can answer, and one that adds hormone test results for higher accuracy. Features were chosen with clinical diagnostic criteria and statistical tests, so the model rests on signals a clinician would recognise. Using Chi-Square and ANOVA feature selection, SMOTE for class balance and an enhanced Random Forest, it reached 93.75% recall. It is a risk-screening aid, not a diagnostic tool.",
  award: "Awarded 3rd place out of 400+ final year research projects, University of Westminster, 2025.",
  journalStatus:
    'An extended version, "A Machine Learning-Driven Framework for Early Risk Stratification of Polycystic Ovary Syndrome", was selected for the MSIT Journal special edition and is under review, 2026.',
};

// Not part of research.ts narration, but a fact worth keeping alongside it.
export const researchAward = {
  title: "3rd Place, Final Year Research Project 2025",
  detail:
    "Out of 400+ students, judged with Westminster, Netcompany and SmartDCC.",
};

// ---------------------------------------------------------------------
// OCTAVE (current role + progression)
// ---------------------------------------------------------------------

// Company-level summary line shown above the OCTAVE role list.
export const octaveIntro = "Colombo, Sri Lanka · On-site · Promoted from intern after six months";

// Condensed one-liner for the two oldest OCTAVE internships (role-octave-
// intern-2023/2022 below stay knowledgeOnly - full detail only in the
// knowledge base).
export const octaveEarlierSummary =
  "Earlier with OCTAVE: Analytics Delivery Intern, Mar to May 2023 (Power BI dashboards for sales and route efficiency; field observations that informed a process rollout). Data Science Intern, Mar to Jun 2022 (data preparation and model support; hotel customer analysis and a CSR study of street vendors).";

export const octave: RoleItem[] = [
  {
    // Wording drafted by Rachel, not invented - originally in "Page Copy,
    // Top to Bottom" (7 Oct), then the dateRange/bullets below updated
    // from her Google AI Studio build (12 Oct), which reframes this as
    // one continuous role (title changed partway through) rather than
    // two separate stints - the separate role-octave-associate entry
    // below is now folded into this one and kept knowledge-only instead
    // of also rendering on the page. Still: her "Page Copy" checklist
    // listed "[Confirm OCTAVE is comfortable with this level of detail]"
    // as unresolved - built and committed, not yet deployed (see
    // CLAUDE.md TODO).
    id: "role-octave-analyst",
    title: "Analyst, Data and AI",
    company: "OCTAVE - John Keells Group",
    logo: "/images/logo-octave.jpeg",
    dateRange: "Apr 2026 - Present (titled Analytics Delivery Associate until Jul 2026)",
    location: "Colombo, Sri Lanka · On-site",
    details: [
      "Lead delivery of four AI and analytics use cases for an FMCG client's beverage and ice cream distribution: distributor margin incentives, a replenishment system that recommends redistribution volumes, a permanent dispatch plan that minimises lorry costs, and a distributor efficiency model that increases line items per bill.",
      "Run each use case end to end: project management, working directly with the client, presenting findings to senior leadership and finance, and coordinating the data science team's development.",
      "Use AI tools to automate parts of my own analysis and reporting, some of which I have used live in client meetings.",
    ],
    narration: {
      short:
        "As Analyst, Data and AI at OCTAVE, she leads four AI and analytics use cases for an FMCG client's distribution network, running each end to end from client work to presenting findings to senior leadership.",
      cueWord: "OCTAVE",
    },
    inTour: true,
  },
  {
    // Folded into role-octave-analyst above (12 Oct update): that entry's
    // dateRange now spans Apr 2026-Present with a "titled Associate until
    // Jul 2026" note, so this no longer renders separately on the page -
    // knowledge-only, same as the older internships below.
    id: "role-octave-associate",
    title: "Analytics Delivery Associate",
    company: "OCTAVE - John Keells Group",
    logo: "/images/logo-octave.jpeg",
    dateRange: "Apr 2026 - Jun 2026",
    location: "Colombo, Sri Lanka · On-site",
    details: [
      "Progressed from the Data Science & Analytics Delivery Intern role into an associate position within the same analytics delivery team.",
    ],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "role-octave-intern-2025",
    title: "Data Science & Analytics Delivery Intern",
    company: "OCTAVE - John Keells Group",
    logo: "/images/logo-octave.jpeg",
    dateRange: "Oct 2025 - Apr 2026",
    location: "Colombo, Sri Lanka · On-site",
    details: [
      "Optimized distributor performance by identifying underperformers and high-potential distributors, designed KPI-driven incentive structures that increased potential margins by 68% for an FMCG company.",
      "Ran advanced margin and sales-incentive simulations, uncovering actionable strategies to recapture lost sales in flood-affected outlets.",
      "Developed interactive Power BI dashboards for management, enabling real-time tracking of targets, achievements, and distributor performance.",
    ],
    narration: { short: "" },
    inTour: false,
  },
  {
    id: "role-octave-intern-2023",
    title: "Analytics Delivery Intern",
    company: "OCTAVE - John Keells Group",
    logo: "/images/logo-octave.jpeg",
    dateRange: "Mar 2023 - May 2023",
    location: "Colombo, Sri Lanka · On-site",
    details: [
      "Built Power BI dashboards for stakeholders to visualize sales performance and route efficiency.",
      "Conducted field observations and proposed improvements, enabling effective rollout of new processes.",
    ],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "role-octave-intern-2022",
    title: "Data Science Intern",
    company: "OCTAVE - John Keells Group",
    logo: "/images/logo-octave.jpeg",
    dateRange: "Mar 2022 - Jun 2022",
    location: "Colombo, Sri Lanka · Remote",
    details: [
      "Assisted in data collection, cleaning, and analysis, ensuring accuracy and reliability of datasets.",
      "Supported statistical and machine learning model development for data-driven research projects.",
      "Contributed to projects including a Hotel Customer Analysis and a CSR initiative for street vendors.",
    ],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
];

// ---------------------------------------------------------------------
// LAYER1 STUDIO
// ---------------------------------------------------------------------

export const layer1: RoleItem & {
  description: string;
  stats: { clients: number; projects: number };
  clientCategories: string[];
  examples: string[];
} = {
  id: "role-layer1",
  title: "Co-founder, Digital Products and Technology",
  company: "Layer1 Studio",
  logo: "/images/layer1.png",
  dateRange: "Dec 2025 - Present",
  location: "Remote",
  description:
    "I co-founded Layer1 Studio to build websites, apps and dashboards for small businesses, startups and independent professionals. I lead the technical side, from shaping a vague brief into a product to shipping and maintaining it, and I have brought interns onto real client work.",
  details: [
    "Developing custom web and mobile applications for diverse clients using Flutter, React, and Node.js.",
    "Delivering end-to-end solutions, from UI/UX design to backend integration and deployment.",
    "Providing digital strategy consulting and optimizing existing codebases for performance and scalability.",
  ],
  stats: { clients: 4, projects: 13 },
  // Confirmed 12 Oct 2026 (previously withheld: "[Confirm this is Layer1
  // client work]"). No client names, by agreement - same as before.
  examples: [
    "A gym management platform with memberships, online payments and a companion mobile app.",
    "An e-commerce storefront for a food brand, designed and built end to end.",
  ],
  clientCategories: [
    "Gyms",
    "E-commerce",
    "Food shops",
    "Marketing agencies",
    "A workplace culture consultancy",
    "An artist",
    "An author",
    "Sports teams",
  ],
  narration: {
    short:
      "Alongside OCTAVE, she co-founded Layer1 Studio, which has delivered 13 projects for 4 clients — gyms, e-commerce, food shops, and more. No client names, by agreement, just the range of what they build.",
    cueWord: "Layer1",
  },
  inTour: true,
};

// ---------------------------------------------------------------------
// PROJECTS (curated for the tour — the rest are knowledge-only)
// ---------------------------------------------------------------------

export const projects: ProjectItem[] = [
  // --- Featured (big cards) ---
  {
    id: "project-pcos-care",
    title: "PCOS Care",
    role: "Lead Developer and Researcher",
    description:
      "Early PCOS risk screening that explains which factors drove each prediction. 93.75% recall with an enhanced Random Forest, built end to end in Python, Flask and Streamlit, deployed and user tested.",
    tech: ["Python", "Machine Learning", "Flask", "Streamlit"],
    link: "https://pcos-care-web-app.onrender.com",
    image: "/images/pcoscare.png",
    narration: {
      short:
        "PCOS Care predicts PCOS risk early using machine learning, reaching over 93% recall — it's the project behind her IEEE paper.",
      spokenText:
        "PCOS Care predicts PCOS risk early using machine learning, reaching over 93% recall — it's the project behind her I triple E paper.",
      cueWord: "PCOS",
    },
    inTour: true,
    featured: true,
  },
  {
    id: "project-cima-tutor",
    title: "CIMA AI Study Assistant",
    role: "Full Stack Developer and AI Engineer",
    description:
      "A study assistant for CIMA Operational Level exams that answers only from the syllabus, using a custom retrieval pipeline on Gemini 2.0 Flash, with two study modes and subject locking.",
    tech: ["React", "Node.js", "Gemini API", "LangChain", "Tailwind CSS"],
    link: "https://cima-tutor-web.onrender.com",
    image: "/images/ai-tutor.png",
    narration: { short: "" },
    inTour: false,
    featured: true,
  },
  {
    id: "project-genai-neurodiversity",
    title: "GenAI Chatbot for Neurodiversity Support",
    role: "AI Engineer, Microsoft EMBRACE Hackathon finalist, 2024",
    description:
      "A chatbot prototype that guides people newly diagnosed with neurodiverse conditions, and their carers, through what comes next. Built with a small cross-functional team under hackathon time limits.",
    tech: ["Generative AI", "Conversational Design", "Prototyping"],
    link: null,
    image: null,
    narration: {
      short:
        "At a Microsoft EMBRACE hackathon, her team built an AI chatbot to support people newly diagnosed with neurodiverse conditions — they were finalists.",
      cueWord: "EMBRACE",
    },
    inTour: true,
    featured: true,
  },
  {
    id: "project-carbon-tracker",
    title: "Carbon Footprint Tracker",
    role: "Data Analyst and UI Designer",
    description:
      "Turns everyday activities into an estimated carbon footprint using activity-based emission factors, with interactive dashboards and automatic suggestions for cutting it.",
    tech: ["Python", "Flutter", "Serverpod", "Data Visualisation"],
    link: "https://rachelcooray.github.io/carbon-footprint-tracker/",
    image: "/images/carbonfootprint.png",
    narration: {
      short:
        "She also built a Carbon Footprint Tracker — interactive dashboards that turn everyday activity into an emissions estimate, with suggestions to reduce it.",
    },
    inTour: true,
    featured: true,
  },
  // --- More projects (collapsed list) ---
  {
    id: "project-cv-writer",
    title: "CV Writing Assistant",
    role: "Frontend Developer & AI Engineer",
    description: "Recruiter-style CV feedback from Gemini, with client-side PDF processing.",
    tech: ["React", "Gemini API"],
    link: "https://cv-writer.onrender.com",
    image: "/images/cv-writer.png",
    narration: { short: "" },
    inTour: false,
    featured: false,
  },
  {
    id: "project-futsal",
    title: "Futsal Team Recommendation",
    role: "Mobile App Developer",
    description:
      "A Flutter app that matches players to teams using collaborative and content-based filtering, with centralised stadium booking.",
    tech: ["Flutter", "Node", "Flask", "Machine Learning"],
    link: null,
    image: "/images/futsal.png",
    narration: { short: "" },
    inTour: false,
    featured: false,
  },
  {
    id: "project-csr-street-vendors",
    title: "CSR Analytics, Street Vendors",
    role: "Field Researcher & Analyst",
    description: "A field survey of 16 street food vendors whose findings the CSR team adopted.",
    tech: ["Data Collection", "Data Analytics", "Field Research"],
    link: null,
    image: "/images/street-vendor.png",
    narration: { short: "" },
    inTour: false,
    featured: false,
  },
  {
    id: "project-fantasy-coin-collector",
    title: "Fantasy Coin Collector",
    role: "Game Developer & Creative Technologist",
    description:
      "A 2D dungeon crawler built from scratch in HTML5 Canvas, with its own physics, procedural maps and sound.",
    tech: ["HTML5 Canvas", "Vanilla JavaScript", "Web Audio API"],
    link: "https://rachelcooray.github.io/FantasyCoinCollector/",
    image: "/images/coin-collector.png",
    narration: { short: "" },
    inTour: false,
    featured: false,
  },
];

// ---------------------------------------------------------------------
// TEACHING & MENTORING (carried over from REDESIGN_HANDOFF.md)
// ---------------------------------------------------------------------

export const teachingIntro =
  "The clearest way I know an idea is understood is being able to teach it. Whether that's adapting a lesson for a classroom of primary learners or walking a university student through a concept they missed in a lecture, teaching has shaped how I explain technical work now. I default to making the reasoning behind a result legible, not just the result itself.";

export const teaching: EducationItem[] = [
  {
    id: "teaching-student-support",
    title: "Student Support Worker",
    institution: "Clear Links Support Ltd.",
    dateRange: "Oct 2024 - Apr 2025",
    summary: "London, UK · Education, Interpersonal Communication",
    details: [
      "Assisted university students with note-taking and academic support.",
      "Provided practical assistance during lectures and tutorials to enhance learning.",
      "Developed strong communication skills by interacting with diverse students.",
    ],
  },
  {
    id: "teaching-class-teacher",
    title: "Class Teacher",
    institution: "St. Mary's Church, Dehiwala",
    dateRange: "Aug 2022 - Aug 2024",
    summary: "Dehiwala, Sri Lanka · Education",
    details: [
      "Delivered engaging lessons tailored to primary school learners.",
      "Adapted teaching methods to accommodate diverse learning needs.",
      "Fostered a positive and inclusive classroom environment.",
    ],
  },
];

// ---------------------------------------------------------------------
// PERSPECTIVE (carried over from REDESIGN_HANDOFF.md — first draft,
// needs Rachel's review before being treated as her final voice)
// ---------------------------------------------------------------------

export const perspective = {
  title: "On decisions, not just predictions",
  paragraphs: [
    "Most of the applied AI work I've done shares one constraint: a model's output only matters if the person reading it can act on it. A risk score for PCOS is only useful if a clinician can see which factors drove it. A margin-optimisation model is only useful if the incentive structure it recommends is one a distributor team can actually run. A study assistant built on a RAG pipeline is only useful if it stays inside the syllabus it's meant to teach, rather than answering fluently but wrong.",
    "That's the thread I keep pulling on: building analytics and AI systems that are transparent enough for the person on the other end to trust the decision, not just the number. In practice that's meant favouring interpretable feature selection over black-box performance gains, building dashboards around the specific decision someone needs to make rather than every metric available, and constraining generative systems to stay grounded in source material instead of improvising.",
    "It's also why teaching and data work don't feel like separate halves of what I do. Both are exercises in making something complex legible to someone who has to use it.",
  ],
};

// Abstracts only (no full essay text exists yet) - titles link out to
// nothing until the essays themselves are written.
export const furtherEssays = [
  {
    id: "essay-accurate-model-bad-decision",
    title: "Why an accurate model can still lead to a bad decision",
    summary:
      "When evaluation loss separates from operational workflow, optimizing predictive metrics alone creates blind spots for practitioners on the ground.",
  },
  {
    id: "essay-legibility-incentive-design",
    title: "Legibility over complexity in commercial incentive design",
    summary:
      "How simulation-tested, KPI-driven distributor structures create lasting margin gains when sales representatives can easily calculate their own payoffs.",
  },
];

// ---------------------------------------------------------------------
// TALKS AND KNOWLEDGE SHARING
// ---------------------------------------------------------------------

export const talksSectionIntro = "Explaining technical work to the people who use it is part of the job.";

export const talks = [
  {
    id: "talk-ieee-icahs",
    text: "IEEE ICAHS 2025, Tunisia: presented PCOS Care to an international audience.",
  },
  {
    id: "talk-westminster-showcase",
    text: "University of Westminster Final Year Project Showcase, 2025: demonstrated PCOS Care to industry judges from Netcompany and SmartDCC.",
  },
  // "AI News Shorts, OCTAVE" item withheld pending OCTAVE's agreement
  // (doc marks it optional/conditional) - not invented, just not shown.
];

// ---------------------------------------------------------------------
// RECOGNITION (awards + press, condensed, newest first)
// ---------------------------------------------------------------------

// Order matches the doc exactly: awards newest-first, then "In the press"
// in the doc's given (curated, not strictly chronological) order.
export const recognition: RecognitionItem[] = [
  // --- Awards ---
  {
    id: "recognition-pcos-award",
    title: "3rd Place - Final Year Research Project",
    organization: "Westminster, Netcompany and SmartDCC",
    year: "2025",
    summary: "Awarded for PCOS Care, out of 400+ projects.",
    kind: "award",
  },
  {
    id: "recognition-uow-scholarship",
    title: "Scholarship",
    organization: "University of Westminster IIT School of Computing and Engineering",
    year: "2024",
    summary: "For academic excellence and extracurricular involvement.",
    kind: "award",
  },
  {
    id: "recognition-embrace-hackathon",
    title: "Hackathon Finalist, GenAI for Neurodiversity",
    organization: "Microsoft EMBRACE Employee Resource Group",
    year: "2024",
    summary: "AI-powered chatbot prototype to guide and support people newly diagnosed with neurodiverse conditions.",
    kind: "award",
  },
  {
    id: "recognition-new-generation-awards",
    title: "New Generation Awards",
    organization: "Women in Management and the National Youth Services Council",
    year: "2020",
    summary: "For youth leadership.",
    kind: "award",
  },
  // --- In the press ---
  {
    id: "recognition-westminster-showcase",
    title: "Celebrating Innovation at the Computer Science and Engineering Final Year Project Showcase",
    organization: "University of Westminster",
    year: "2025",
    summary:
      "Highlighting Rachel Cooray and fellow student innovators presenting healthcare and machine learning systems to enterprise panels.",
    kind: "press",
    link: "https://blog.westminster.ac.uk/wearewestminster/celebrating-innovation-at-the-computer-science-and-engineering-final-year-project-showcase/",
    image: "/images/netcompany-group-pic.jpg",
  },
  {
    id: "recognition-westminster-prize",
    title: "Westminster CS Students Receive Prizes",
    organization: "University of Westminster",
    year: "2025",
    summary:
      "Recognizing top research prizes awarded by industry sponsors Netcompany and SmartDCC for the 2025 cohort.",
    kind: "press",
    link: "https://www.westminster.ac.uk/news/westminster-computer-science-and-engineering-students-receive-prizes-from-netcompany-at-annual-final-year-project-showcase",
    image: "/images/blog.png",
  },
  {
    id: "recognition-jkh-swim",
    title: "Team OCTAVE Wins the Overall Women's Championship",
    organization: "John Keells Holdings",
    year: "2026",
    summary:
      "Rachel Cooray secured three individual gold medals and gold in every relay race in the under-25 group, leading OCTAVE to the trophy.",
    kind: "press",
    link: "https://www.linkedin.com/company/john-keells-holdings/posts/?lipi=urn%3Ali%3Apage%3Ad_flagship3_company%3Bnn2zJMoFSKS23o4EHOG2Vw%3D%3D",
    image: "/images/swimmingmeet.jpeg",
  },
  {
    id: "recognition-daily-ft",
    title: "WIM and NYSC Recognise Youth",
    organization: "Daily FT",
    year: "2020",
    summary:
      "National coverage of the New Generation Awards honoring emerging young Sri Lankan women leaders.",
    kind: "press",
    link: "https://www.ft.lk/Front-Page/WIM-NYSC-recognise-youth-with-New-Generation-Awards/44-711214",
    image: "/images/daily-ft.png",
  },
  {
    id: "recognition-lmd-youth-forum",
    title: "LMD Youth Forum Interview",
    organization: "LMD",
    year: "2020",
    summary:
      "Interview reflecting on student governance, school headship at St. Bridget's Convent, and community development.",
    kind: "press",
    link: "https://lmd.lk/youth-forum-32/",
    image: "/images/youth-forum.png",
  },
];

// ---------------------------------------------------------------------
// KNOWLEDGE-ONLY: skills, education, memberships
// (never rendered on the page or narrated — exported for the Q&A bot)
// ---------------------------------------------------------------------

export const skillsKnowledge = [
  { category: "Programming Languages", items: ["Python", "SQL", "Dart", "JavaScript"] },
  { category: "Data Science & AI", items: ["Machine Learning", "Pandas & NumPy", "Scikit-learn", "Data Visualization"] },
  { category: "Web & Mobile Dev", items: ["Flutter", "Node.js", "HTML5 & CSS3"] },
  { category: "Cloud & Tools", items: ["Google Cloud Platform", "Power BI", "Git & GitHub", "Excel (Advanced)"] },
  { category: "Professional Skills", items: ["Business Analytics", "Problem Solving", "Communication", "Financial Accounting"] },
];

// Trimmed per the doc: GCE grades, club memberships and the IEEE/award
// detail already shown in Research/Recognition are dropped from the page
// (memberships still feed the knowledge base via membershipsKnowledge
// below). Full detail is kept in git history, not deleted from the repo.
export const educationKnowledge: EducationItem[] = [
  {
    id: "education-westminster",
    title: "BSc (Hons) Computer Science, First Class Honours",
    institution: "University of Westminster, United Kingdom",
    dateRange: "Sep 2022 - Jul 2025",
    summary: "Specialised in Data Science. Began at IIT, Sri Lanka, and completed the final year at Westminster.",
    details: [],
  },
  {
    id: "education-cima",
    title: "Certificate in Business Accounting",
    institution: "Chartered Institute of Management Accountants (CIMA), United Kingdom",
    dateRange: "Aug 2024",
    summary: "Economics, management and financial accounting, business law and corporate governance.",
    details: [],
  },
  {
    id: "education-school",
    title: "St. Bridget's Convent, Colombo",
    institution: "",
    dateRange: "2008 - 2022",
    summary: "Head Prefect, 2020.",
    details: [],
  },
];

export const membershipsKnowledge = [
  "Rotaract Club",
  "IEEE Club",
  "Sri Lankan Society UoW",
  "CIMA Student Member",
  "BCS Member",
];

// ---------------------------------------------------------------------
// BEYOND WORK (page-level condensed copy - the per-item detail below
// still feeds the knowledge base)
// ---------------------------------------------------------------------

export const volunteeringSummary =
  "With the John Keells Foundation, 2026: guest support at the launch of Artist Spotlight (8th edition) with City of Dreams; ushering for the La Bamba musical at Cinnamon Life; volunteering at Kala Pola with the George Keyt Foundation.";

export const swimmingSummary =
  "At the 2026 JKH Intercompany Swimming Meet, I won three individual golds and gold in every relay in the under-25 group, as OCTAVE took the overall women's championship.";

export const writingSummary = {
  // Book title/genre/setting confirmed 12 Oct 2026 (previously just "she
  // writes fiction"). Still no link - the line renders without one until
  // there's somewhere for it to point.
  text: "I also write fiction under the name Rachel Naadia Cooray. My debut novel, Carried by the Storm, a fantasy romance set in a small Cornish seaside town, is coming soon.",
  link: "[PLACEHOLDER: link to her fiction/pen-name work]",
};

// Confirmed directly by Rachel (12 Oct 2026), not drawn from any doc.
export const hobbies = ["Swimming", "Running", "Movies and dramas", "Reading on historical facts and stories", "British history"];

export const volunteeringKnowledge: VolunteerItem[] = [
  {
    id: "volunteer-artist-spotlight",
    title: "Event Support Volunteer",
    organization: "John Keells Foundation",
    dateRange: "Sep 2026",
    details: [
      "Supported registration and guest check-in at the launch of Artist Spotlight (8th edition) by John Keells Foundation and City of Dreams.",
      "Assisted with on-site event operations, including coordinating artwork sales enquiries and guest flow during the exhibition opening.",
    ],
  },
  {
    id: "volunteer-la-bamba",
    title: "Event Assistant",
    organization: "John Keells Foundation",
    dateRange: "Apr 2026",
    details: [
      "Participated as an usher for the La Bamba musical at Cinnamon Life, assisting guests with seating and venue guidance.",
    ],
  },
  {
    id: "volunteer-kala-pola",
    title: "Volunteer",
    organization: "John Keells Foundation",
    dateRange: "Feb 2026",
    details: [
      "Volunteered at John Keells Foundation's Kala Pola, organised in collaboration with the George Keyt Foundation.",
    ],
  },
];

// Collapsed one-line summary shown on the page under Work; the per-role
// detail in retailExperienceKnowledge below still feeds the knowledge base.
export const retailExperienceSummary =
  "While studying in the UK: customer roles at UNIQLO, EG On The Move and TK Maxx, 2024 to 2025.";

export const retailExperienceKnowledge: RoleItem[] = [
  {
    id: "role-uniqlo",
    title: "Customer Advisor",
    company: "UNIQLO",
    logo: "/images/uniqlo.png",
    dateRange: "Aug 2025 - Oct 2025",
    location: "Coal Drops Yard, UK",
    details: ["Visual merchandising and customer service in a high-paced retail environment."],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "role-eg-on-the-move",
    title: "Customer Service Associate",
    company: "EG On The Move (Petrogas)",
    logo: "/images/logo-eg-on-the-move.png",
    dateRange: "Jan 2025 - Aug 2025",
    location: "Enfield, UK",
    details: ["Customer service and point-of-sale operations."],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "role-tk-maxx",
    title: "Retail Associate — Christmas Temp",
    company: "TK Maxx",
    logo: "/images/logo-tkmaxx.png",
    dateRange: "Nov 2024 - Jan 2025",
    location: "Stratford, UK",
    details: ["Customer service, stock management and merchandising."],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
];

// ---------------------------------------------------------------------
// FOOTER
// ---------------------------------------------------------------------

export const footer = {
  fictionLine: {
    text: "She also writes fiction as Rachel Naadia Cooray.",
    link: "[PLACEHOLDER: link to her fiction/pen-name work]",
  },
  robotCredit: {
    text: "Robot model based on V-Bot White and Black (Warzone Arena) by Tsaphnat Tsaphnat Mbuyi, CC BY 4.0",
    link: "[PLACEHOLDER: Sketchfab model URL]",
  },
  copyright: "© 2026 Rachel Cooray",
  email: "rachelcooray@gmail.com",
};

// Contact section intro paragraph (new copy, 7 Oct doc).
export const contactIntro =
  "I'm always glad to talk about research collaborations, MSc and scholarship opportunities, guest lectures, and AI or analytics problems worth solving.";

// ---------------------------------------------------------------------
// TOUR ORDER
// (which items play in the auto-playing highlights tour, in order)
// ---------------------------------------------------------------------

export const tourOrder = [
  "intro",
  "research-pcos",
  "role-octave-analyst",
  "role-layer1",
  "project-pcos-care",
  "project-genai-neurodiversity",
  "project-carbon-tracker",
] as const;
