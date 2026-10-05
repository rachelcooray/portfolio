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
};

export type IntroContent = {
  name: string;
  tagline: string;
  bio: string;
  photo: string;
  links: { label: string; href: string }[];
  narration: Narration;
};

export type ResearchItem = {
  id: string;
  title: string;
  venue: string;
  year: string;
  link: string | null;
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
};

export type RecognitionItem = {
  id: string;
  title: string;
  organization: string;
  year: string;
  summary: string;
  kind: "award" | "press";
  link?: string | null;
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

export const intro: IntroContent = {
  name: "Rachel Cooray",
  tagline: "Applies AI to real business problems.",
  bio: "Analyst for Data and AI at OCTAVE, the advanced analytics arm of John Keells Holdings, in Colombo. Published AI researcher (IEEE). Technical co-founder of Layer1 Studio. First Class Honours BSc Computer Science, University of Westminster.",
  photo: "/images/profile.png",
  links: [
    { label: "LinkedIn", href: "[PLACEHOLDER: LinkedIn URL]" },
    { label: "CV", href: "/rachelcooray-cv.pdf" },
    { label: "ORCID", href: "https://orcid.org/0009-0009-3192-2669" },
  ],
  narration: {
    short:
      "Hi, I'm Rachel. I apply AI to real business problems, as an analyst at OCTAVE, a published researcher, and a technical co-founder at Layer1 Studio.",
    cueWord: "AI",
  },
};

// ---------------------------------------------------------------------
// RESEARCH
// ---------------------------------------------------------------------

export const research: ResearchItem[] = [
  {
    id: "research-pcos",
    title:
      "PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome",
    venue: "IEEE ICAHS 2025, Tunisia",
    year: "2025",
    link: null,
    highlight: "Selected for the MSIT Journal special edition, 2026.",
    narration: {
      short:
        "My IEEE-published research, PCOS Care, predicts PCOS risk early using machine learning — it placed 3rd out of over 400 students at Westminster's showcase and was later selected for a journal special edition.",
      cueWord: "IEEE",
    },
    inTour: true,
  },
];

// Not part of research.ts narration, but a fact worth keeping alongside it.
export const researchAward = {
  title: "3rd Place, Final Year Research Project 2025",
  detail:
    "Out of 400+ students, judged with Westminster, Netcompany and SmartDCC.",
};

// ---------------------------------------------------------------------
// OCTAVE (current role + progression)
// ---------------------------------------------------------------------

export const octave: RoleItem[] = [
  {
    id: "role-octave-analyst",
    title: "Analyst, Data and AI",
    company: "OCTAVE - John Keells Group",
    dateRange: "Jul 2026 - Present",
    location: "Colombo, Sri Lanka · On-site",
    details: [
      "[PLACEHOLDER: APPROVED OCTAVE WORDING. DO NOT INVENT.]",
    ],
    narration: {
      // Placeholder until approved public wording exists — do not
      // invent OCTAVE-specific achievements beyond what's confirmed.
      short: "[PLACEHOLDER: APPROVED OCTAVE WORDING. DO NOT INVENT.]",
      cueWord: "OCTAVE",
    },
    inTour: true,
  },
  {
    id: "role-octave-associate",
    title: "Analytics Delivery Associate",
    company: "OCTAVE - John Keells Group",
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
    dateRange: "Oct 2025 - Apr 2026",
    location: "Colombo, Sri Lanka · On-site",
    details: [
      "Optimized distributor performance by identifying underperformers and high-potential distributors, designed KPI-driven incentive structures that increased potential margins by 68% for an FMCG company.",
      "Ran advanced margin and sales-incentive simulations, uncovering actionable strategies to recapture lost sales in flood-affected outlets.",
      "Developed interactive Power BI dashboards for management, enabling real-time tracking of targets, achievements, and distributor performance.",
    ],
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "role-octave-intern-2023",
    title: "Analytics Delivery Intern",
    company: "OCTAVE - John Keells Group",
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
  stats: { clients: number; projects: number };
  clientCategories: string[];
} = {
  id: "role-layer1",
  title: "Co-founder & Fullstack Developer",
  company: "Layer1 Studio",
  dateRange: "Dec 2025 - Present",
  location: "Remote · Web & Mobile Development for SMEs & Startups",
  details: [
    "Developing custom web and mobile applications for diverse clients using Flutter, React, and Node.js.",
    "Delivering end-to-end solutions, from UI/UX design to backend integration and deployment.",
    "Providing digital strategy consulting and optimizing existing codebases for performance and scalability.",
  ],
  stats: { clients: 4, projects: 13 },
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
      "Alongside OCTAVE, I co-founded Layer1 Studio, where we've delivered 13 projects for 4 clients — gyms, e-commerce, food shops, and more. No client names, by agreement, just the range of what we build.",
    cueWord: "Layer1",
  },
  inTour: true,
};

// ---------------------------------------------------------------------
// PROJECTS (curated for the tour — the rest are knowledge-only)
// ---------------------------------------------------------------------

export const projects: ProjectItem[] = [
  {
    id: "project-pcos-care",
    title: "PCOS Care",
    role: "Lead Developer & Researcher",
    description:
      "Machine learning-based PCOS risk prediction web app. Feature selection (Chi-Square, ANOVA), SMOTE, and dual-model prediction, reaching 93.75% recall with an enhanced Random Forest model. Built end-to-end with Python, Flask and Streamlit, deployed and user tested.",
    tech: ["Python", "Machine Learning", "Flask", "Streamlit", "Render"],
    link: "https://pcos-care-web-app.onrender.com",
    image: "/images/pcoscare.png",
    narration: {
      short:
        "PCOS Care predicts PCOS risk early using machine learning, reaching over 93% recall — it's the project behind my IEEE paper.",
      cueWord: "PCOS Care",
    },
    inTour: true,
  },
  {
    id: "project-genai-neurodiversity",
    title: "GenAI Chatbot for Neurodiversity Support",
    role: "AI Engineer, Microsoft EMBRACE Hackathon",
    description:
      "AI-powered chatbot prototype built at the Microsoft EMBRACE Employee Resource Group hackathon, to guide and support individuals and caregivers newly diagnosed with neurodiverse conditions. Finalist entry, built with a small cross-functional team under hackathon time constraints.",
    tech: ["Generative AI", "Conversational Design", "Prototyping"],
    link: null,
    image: null,
    narration: {
      short:
        "At a Microsoft EMBRACE hackathon, my team built an AI chatbot to support people newly diagnosed with neurodiverse conditions — we were finalists.",
      cueWord: "EMBRACE",
    },
    inTour: true,
  },
  {
    id: "project-finance-explainer",
    title: "[PLACEHOLDER NAME]",
    role: "[PLACEHOLDER ROLE]",
    description: "[PLACEHOLDER: describe this finance content explainer project — what it does, what it's built with, what the outcome was.]",
    tech: [],
    link: null,
    image: null,
    narration: {
      short: "[PLACEHOLDER: one-sentence narration once the project details are confirmed.]",
    },
    inTour: true,
  },
  {
    id: "project-carbon-tracker",
    title: "Carbon Footprint Tracker",
    role: "Data Analyst & UI Designer",
    description:
      "Carbon footprint calculation and visualization tool that estimates environmental impact from activity-based emissions factors, with interactive dashboards and automated reduction recommendations.",
    tech: ["Python", "Flutter", "Serverpod", "Data Analysis", "Visualization"],
    link: "https://rachelcooray.github.io/carbon-footprint-tracker/",
    image: "/images/carbonfootprint.png",
    narration: {
      // Drafted one-liner — flagged per the master prompt for approval,
      // since the full description was condensed down for the tour.
      short:
        "I also built a Carbon Footprint Tracker — interactive dashboards that turn everyday activity into an emissions estimate, with suggestions to reduce it.",
    },
    inTour: true,
  },
  // Knowledge-only: real projects, not cut, just not in the curated tour.
  {
    id: "project-cv-writer",
    title: "CV Writing Assistant",
    role: "Frontend Developer & AI Engineer",
    description:
      "AI-powered CV analysis tool that extracts text from PDFs and uses Google's Gemini models to give recruiter-style feedback. Client-side PDF processing, a prompt-engineered senior-recruiter persona.",
    tech: ["React", "Vite", "Gemini API", "PDF.js", "Tailwind CSS"],
    link: "https://cv-writer.onrender.com",
    image: "/images/cv-writer.png",
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "project-cima-tutor",
    title: "CIMA AI Study Assistant",
    role: "Full Stack Developer & AI Engineer",
    description:
      "Generative AI study assistant for CIMA Operational Level exams. Custom RAG pipeline on Gemini 2.0 Flash, strict syllabus adherence, dual study modes, subject locking, Node.js/Express backend, React/Tailwind frontend.",
    tech: ["React", "Node.js", "Google Gemini API", "LangChain", "Tailwind CSS"],
    link: "https://cima-tutor-web.onrender.com",
    image: "/images/ai-tutor.png",
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "project-futsal",
    title: "Futsal Team Recommendation",
    role: "Mobile App Developer",
    description:
      "Collaborative and content-based filtering recommendation system. Flutter app matching players to teams by skill, availability and location, with centralized stadium booking.",
    tech: ["Flutter", "Node", "Flask", "Machine Learning", "Recommendation Systems"],
    link: null,
    image: "/images/futsal.png",
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "project-csr-street-vendors",
    title: "CSR Analytics Project — Street Vendors",
    role: "Field Researcher & Analyst",
    description:
      "Field survey of 16 street food vendors, uncovering hygiene gaps and operational inefficiencies. Data-driven interventions adopted by the CSR team.",
    tech: ["Data Collection", "Data Analytics", "Field Research", "CSR"],
    link: null,
    image: "/images/street-vendor.png",
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
  {
    id: "project-fantasy-coin-collector",
    title: "Fantasy Coin Collector",
    role: "Game Developer & Creative Technologist",
    description:
      "2D dungeon crawler built from scratch with HTML5 Canvas and vanilla JavaScript — custom physics engine, procedural map generation, particle system, Web Audio API sound, LocalStorage progression.",
    tech: ["HTML5 Canvas", "Vanilla JavaScript", "Web Audio API", "Procedural Generation"],
    link: "https://rachelcooray.github.io/FantasyCoinCollector/",
    image: "/images/coin-collector.png",
    narration: { short: "" },
    inTour: false,
    knowledgeOnly: true,
  },
];

// ---------------------------------------------------------------------
// TEACHING & MENTORING (carried over from REDESIGN_HANDOFF.md)
// ---------------------------------------------------------------------

export const teachingIntro =
  "The clearest way I know an idea is understood is being able to teach it. Whether that's adapting a lesson for a classroom of primary learners or walking a university student through a concept they missed in a lecture, teaching has shaped how I explain technical work now — I default to making the reasoning behind a result legible, not just the result itself.";

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
  title: "On Decisions, Not Just Predictions",
  paragraphs: [
    "Most of the applied AI work I've done shares one constraint: a model's output only matters if the person reading it can act on it. A risk score for PCOS is only useful if a clinician can see which factors drove it. A margin-optimisation model is only useful if the incentive structure it recommends is one a distributor team can actually run. A study assistant built on a RAG pipeline is only useful if it stays inside the syllabus it's meant to teach, rather than answering fluently but wrong.",
    "That's the thread I keep pulling on: building analytics and AI systems that are transparent enough for the person on the other end to trust the decision, not just the number. In practice that's meant favouring interpretable feature selection over black-box performance gains, building dashboards around the specific decision someone needs to make rather than every metric available, and constraining generative systems to stay grounded in source material instead of improvising.",
    "It's also why teaching and data work don't feel like separate halves of what I do. Both are exercises in making something complex legible to someone who has to use it.",
  ],
};

// ---------------------------------------------------------------------
// RECOGNITION (awards + press, condensed, newest first)
// ---------------------------------------------------------------------

export const recognition: RecognitionItem[] = [
  {
    id: "recognition-jkh-swim",
    title: "JKH Intercompany Swimming Meet 2026: Team OCTAVE Wins the Overall Women's Championship",
    organization: "John Keells Holdings",
    year: "2026",
    summary:
      "Represented OCTAVE — won 3 individual golds and gold in every relay in the Under-25 age group, as OCTAVE was named overall women's champion.",
    kind: "press",
    link: "https://www.linkedin.com/company/john-keells-holdings/posts/?lipi=urn%3Ali%3Apage%3Ad_flagship3_company%3Bnn2zJMoFSKS23o4EHOG2Vw%3D%3D",
  },
  {
    id: "recognition-pcos-award",
    title: "3rd Place - Final Year Research Project",
    organization: "Westminster, Netcompany and SmartDCC",
    year: "2025",
    summary: "Awarded for PCOS Care, showcasing innovation in machine learning and healthcare.",
    kind: "award",
  },
  {
    id: "recognition-embrace-hackathon",
    title: "Hackathon Finalist — GenAI for Neurodiversity",
    organization: "Microsoft EMBRACE Employee Resource Group",
    year: "2024",
    summary: "AI-powered chatbot prototype to guide and support people newly diagnosed with neurodiverse conditions.",
    kind: "award",
  },
  {
    id: "recognition-uow-scholarship",
    title: "University of Westminster IIT School of Computing and Engineering Scholarship",
    organization: "University of Westminster",
    year: "2024",
    summary: "Awarded for academic excellence and extracurricular involvement.",
    kind: "award",
  },
  {
    id: "recognition-westminster-prize",
    title: "Westminster CS Students Receive Prizes",
    organization: "University of Westminster",
    year: "2025",
    summary: "Press coverage of the 3rd Place award for PCOS Care.",
    kind: "press",
    link: "https://www.westminster.ac.uk/news/westminster-computer-science-and-engineering-students-receive-prizes-from-netcompany-at-annual-final-year-project-showcase",
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

export const educationKnowledge: EducationItem[] = [
  {
    id: "education-westminster",
    title: "BSc (Hons) Computer Science",
    institution: "University of Westminster, United Kingdom (started at IIT, Sri Lanka)",
    dateRange: "Sep 2022 - Jul 2025",
    summary: "Grade: First Class Honours, specialized in Data Science",
    details: [
      "Scholarship: UOW/IIT School of Computing and Engineering Scholarship (2024/25).",
      "Awards: 3rd Best Research Project at University Showcase, IEEE ICAHS 2025 Conference Publication in Tunisia.",
      "Membership Activities: Rotaract Club, IEEE Club, Sri Lankan Society.",
    ],
  },
  {
    id: "education-cima",
    title: "Certificate in Business Analytics (CIMA)",
    institution: "CIMA, United Kingdom",
    dateRange: "Aug 2024",
    summary: "Financial & Management Accounting",
    details: [
      "Covered Economics, Management and Financial Accounting.",
      "Business Law and Corporate Governance.",
    ],
  },
  {
    id: "education-school",
    title: "Primary & Secondary Education",
    institution: "St. Bridget's Convent, Colombo 07, Sri Lanka",
    dateRange: "Jan 2008 - Feb 2022",
    summary: "Head Prefect (2020) | GCE O/L | GCE A/L",
    details: [
      "GCE A/L Examination (2021): Chemistry - A, Combined Mathematics - B, Physics - B.",
      "GCE O/L Examination (2018): 9 Distinctions (A Grade).",
      "Leadership and Activities: School Head Prefect (2020), Swimming Team, Interact Club.",
    ],
  },
];

export const membershipsKnowledge = [
  "Rotaract Club",
  "IEEE Club",
  "Sri Lankan Society UoW",
  "CIMA Student Member",
  "BCS Member",
];

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

export const retailExperienceKnowledge: RoleItem[] = [
  {
    id: "role-uniqlo",
    title: "Customer Advisor",
    company: "UNIQLO",
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
  email: "rachelcooray@gmail.com",
};

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
  "project-finance-explainer",
  "project-carbon-tracker",
] as const;
