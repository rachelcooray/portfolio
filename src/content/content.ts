/**
 * Single source of truth for everything the site says: the page, the
 * case-study pages, the badge index, the Ask command bar and the CV.
 *
 * Rules for this file (Rachel's content spec, 8 Nov 2026):
 * - No invented or unverifiable figures. No 68% or 93.75% figures.
 * - No stat strips or counters. No counts of Layer1 clients or projects.
 * - OCTAVE work is described in words only: no figures, client names or
 *   LKR amounts. Rachel "owns" use cases, never "leads" them.
 * - No fiction writing or pen name, no FICTA, no section called Writing.
 * - The study assistant and the CV reviewer are removed from the site.
 * - No scholarship applications. The UOW/IIT scholarship she was given
 *   is shown under Education and Recognition.
 * - "CIMA" appears only as a qualification and a membership.
 * - No em dashes. Missing facts stay missing. Do not fill gaps.
 */

export type SectionId =
  | "work"
  | "how"
  | "research"
  | "buildlog"
  | "experience"
  | "education"
  | "skills"
  | "teaching"
  | "recognition"
  | "volunteer"
  | "ask"
  | "contact";

export type Section = { id: SectionId; label: string; number: string; hint: string };

// The badge index, the persistent nav and the Ask command bar all read
// this list, so the order here is the order everywhere.
export const sections: Section[] = [
  { id: "work", label: "Selected work", number: "01", hint: "OCTAVE, PCOS Care, Layer1, neurodiversity chatbot" },
  { id: "how", label: "How I work", number: "02", hint: "Checking that analytics works in the field" },
  { id: "research", label: "Research", number: "03", hint: "PCOS Care, IEEE ICAHS 2025" },
  { id: "buildlog", label: "Build log", number: "04", hint: "What I built and with what" },
  { id: "experience", label: "Experience", number: "05", hint: "OCTAVE, Layer1 Studio, London Success Academy" },
  { id: "education", label: "Education", number: "06", hint: "Westminster, CIMA, St. Bridget's" },
  { id: "skills", label: "Skills", number: "07", hint: "Used at work and explored" },
  { id: "teaching", label: "Teaching", number: "08", hint: "Classroom, university support, interns" },
  { id: "recognition", label: "Recognition and press", number: "09", hint: "Showcase prize, hackathon final, youth award" },
  { id: "volunteer", label: "Volunteering", number: "10", hint: "John Keells Foundation, memberships" },
  { id: "ask", label: "Ask about Rachel", number: "11", hint: "Search this page by question" },
  { id: "contact", label: "Contact", number: "12", hint: "Email, LinkedIn, GitHub, ORCID, CV" },
];

// ---------------------------------------------------------------------
// IDENTITY
// ---------------------------------------------------------------------

export const identity = {
  name: "Rachel Cooray",
  firstName: "Rachel",
  lastName: "Cooray",
  role: "Analyst, Data and AI",
  employer: "OCTAVE, John Keells Holdings",
  location: "Colombo, Sri Lanka",
  domain: "rachelcooray.com",
  // The one sentence the first screen has to say.
  hello: "Hi, I'm Rachel. I apply AI to real business problems.",
  tagline: "I apply AI to real business problems.",
  summary:
    "Analyst, Data and AI at OCTAVE, John Keells Holdings. First Class Computer Science graduate, University of Westminster. Published researcher. Co-founder of Layer1 Studio.",
  // [CONFIRM] a third line: current personal build or research focus.
  currently: ["Owning four AI and analytics use cases at OCTAVE.", "Building products with Layer1."],
  bio: "I build analytics and AI systems that help people make decisions they can understand and act on. I work at the point where a model's output has to become a business decision, and I care most about the step in between: making the reasoning legible to the person who has to use it.",
  portrait: "/images/rachel-portrait.png",
  portraitAlt: "Rachel Cooray, standing, in a pale blue blouse, smiling at the camera",
  badgePhoto: "/images/rachel-badge.jpg",
  badgePhotoAlt: "Rachel Cooray, head and shoulders",
  email: "rachelcooray@gmail.com",
  links: [
    { label: "Email", href: "mailto:rachelcooray@gmail.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rachel-cooray-069034235/" },
    { label: "GitHub", href: "https://github.com/rachelcooray" },
    { label: "ORCID", href: "https://orcid.org/0009-0009-3192-2669" },
    { label: "CV", href: "/rachelcooray-cv.pdf" },
  ],
  orcid: "0009-0009-3192-2669",
  copyright: "2026 Rachel Cooray",
};

// ---------------------------------------------------------------------
// SELECTED WORK (the four cards in the 3D walk-through)
// ---------------------------------------------------------------------

export type WorkCard = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  side: "left" | "right";
};

export const selectedWork: WorkCard[] = [
  {
    id: "work-octave",
    kicker: "OCTAVE, John Keells Holdings",
    title: "Four use cases for an FMCG client's distributors",
    body: "Margin incentives, replenishment recommendations, a permanent dispatch plan and distributor efficiency. The analysis has to be sound and the business has to use it.",
    href: "/case-studies/octave",
    linkLabel: "Read the case study",
    side: "right",
  },
  {
    id: "work-pcos",
    kicker: "Research, IEEE ICAHS 2025, Tunisia",
    title: "PCOS Care",
    body: "An early risk-screening web app that shows which factors drove each prediction. Published at IEEE ICAHS 2025.",
    href: "/case-studies/pcos-care",
    linkLabel: "Read the case study",
    side: "left",
  },
  {
    id: "work-layer1",
    kicker: "Co-founder and Developer",
    title: "Layer1 Studio",
    body: "Web and mobile products for small businesses, from rough brief to shipped product.",
    href: "/case-studies/layer1",
    linkLabel: "Read the case study",
    side: "right",
  },
  {
    id: "work-neurodiversity",
    kicker: "Microsoft EMBRACE hackathon finalist, 2024",
    title: "Neurodiversity support chatbot",
    body: "A chatbot prototype that guides people newly diagnosed with neurodiverse conditions, and their carers, through what comes next.",
    href: "#buildlog",
    linkLabel: "See the build log",
    side: "left",
  },
];

// ---------------------------------------------------------------------
// HOW I WORK
// ---------------------------------------------------------------------

export const howIWork = {
  title: "Analytics that works in the field, not just in a model",
  paragraphs: [
    "I make sure analytics works in the field, not just in a model. For each use case I design how we check whether it made a difference, using pilot and control groups where possible and before-and-after comparisons where not.",
    "I start with operational measures such as billing activity, outlet reach and how closely recommendations are followed, then look at margin. Where there is no control group, I describe results as an association, not proven impact.",
    "I join governance calls with area, regional and sales managers and bring what I learn back into the use case. I help prepare answers to finance and leadership challenges. I keep decision logs, process maps and problem statements so the reasoning is still there months later, and I reconcile numbers across dashboards and own the corrections.",
  ],
};

// ---------------------------------------------------------------------
// RESEARCH
// ---------------------------------------------------------------------

export const research = {
  intro:
    "I research how machine learning can support decisions people can trust, starting in healthcare.",
  paper: {
    // [CONFIRM] title, authors and DOI against the IEEE record.
    title:
      "PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome",
    authors: "With Malarvizhi Kaniappan Chinnathai and Salma Chahed, University of Westminster",
    venue: "IEEE ICAHS 2025, Tunisia",
    year: "2025",
    doi: "10.1109/ICAHS66950.2025.11553077",
    doiUrl: "https://doi.org/10.1109/ICAHS66950.2025.11553077",
    appUrl: "https://pcos-care-web-app.onrender.com",
    description:
      "An early screening web app with two levels of prediction: one from everyday signs that anyone can answer, and one that adds hormone test results. It shows which factors drove each prediction. It is a screening aid, not a diagnostic tool.",
    method:
      "Chi-Square and ANOVA feature selection, SMOTE for class balance, and an enhanced Random Forest.",
    // [CONFIRM] whether to add "out of 400+ projects".
    award: "Third place at the University of Westminster final year project showcase, 2025.",
    journal: "Extended paper selected for the MSIT Journal special edition, under review.",
  },
  talksIntro: "Explaining technical work to the people who use it is part of the job.",
  talks: [
    "IEEE ICAHS 2025, Tunisia: presented PCOS Care.",
    "University of Westminster final year project showcase, 2025: demonstrated PCOS Care to industry judges from Netcompany and SmartDCC.",
  ],
};

// ---------------------------------------------------------------------
// EDUCATION
// ---------------------------------------------------------------------

export type EducationItem = {
  id: string;
  title: string;
  institution: string;
  dateRange: string;
  summary: string;
};

export const education: EducationItem[] = [
  {
    id: "education-westminster",
    title: "BSc (Hons) Computer Science, First Class",
    institution: "University of Westminster, United Kingdom",
    dateRange: "Sep 2022 to Jul 2025",
    summary: "Data Science specialism. Started at IIT, Sri Lanka.",
  },
  {
    id: "education-scholarship",
    title: "UOW/IIT School of Computing and Engineering scholarship",
    institution: "University of Westminster and Informatics Institute of Technology",
    dateRange: "2024/25",
    summary: "",
  },
  {
    id: "education-cima",
    title: "Certificate in Business Accounting",
    institution: "CIMA",
    dateRange: "Aug 2024",
    summary: "",
  },
  {
    // [CONFIRM] year and grades.
    id: "education-school",
    title: "St. Bridget's Convent, Colombo",
    institution: "A-Levels: Chemistry, Maths, Physics",
    dateRange: "2008 to 2022",
    summary: "Head Prefect, 2020.",
  },
];

// ---------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------

export type Role = {
  id: string;
  title: string;
  company: string;
  dateRange: string;
  location: string;
  details: string[];
  logo?: string;
};

export const octave = {
  company: "OCTAVE, John Keells Holdings",
  logo: "/images/logo-octave.jpeg",
  meta: "Colombo, Sri Lanka. Promoted from intern to associate to analyst within a year.",
  own: "I own four AI and analytics use cases on the distributor side of an FMCG business: distributor margin incentives, a replenishment system that recommends redistribution volumes, a permanent dispatch plan that minimises lorry costs, and a distributor efficiency model that increases line items per bill. My job is to make sure analytics works in the field, not just in a model: the analysis has to be sound and the business has to use it.",
  measuring: {
    title: "Measuring whether a use case works",
    body: "I design how each use case is checked, with pilot and control groups where possible and before and after where not. I start with operational measures such as billing activity, outlet reach and how closely recommendations are followed, then look at margin. Where there is no control group, I describe results as an association, not proven impact.",
  },
  practice: [
    {
      title: "Field work",
      body: "I join regular governance calls with area, regional and sales managers, and bring what I learn back into the use case.",
    },
    {
      title: "Leadership and finance",
      body: "I help prepare answers to challenging questions and shape slides that lead with the finding.",
    },
    {
      title: "Reasoning on record",
      body: "Decision logs, process maps and problem statements.",
    },
    {
      title: "Checking",
      body: "I reconcile numbers across dashboards and files and own the corrections.",
    },
  ],
  tools: ["Excel", "Databricks", "Power BI"],
  roles: [
    {
      id: "role-octave-analyst",
      title: "Analyst, Data and AI",
      company: "OCTAVE, John Keells Holdings",
      dateRange: "Jul 2026 to present",
      location: "Colombo, hybrid",
      details: [
        "Own four AI and analytics use cases on the distributor side of an FMCG business: distributor margin incentives, a replenishment system that recommends redistribution volumes, a permanent dispatch plan that minimises lorry costs, and a distributor efficiency model that increases line items per bill.",
        "Run each end to end: PMO, direct client contact, decks for senior leaders and finance, and coordinating the data science team. Tools: Excel, Databricks, Power BI.",
      ],
    },
    {
      id: "role-octave-associate",
      title: "Analytics Delivery Associate",
      company: "OCTAVE, John Keells Holdings",
      dateRange: "Apr 2026 to Jul 2026",
      location: "Colombo",
      details: [],
    },
    {
      id: "role-octave-intern-2025",
      title: "Data Science and Analytics Delivery Intern",
      company: "OCTAVE, John Keells Holdings",
      dateRange: "Oct 2025 to Apr 2026",
      location: "Colombo",
      details: [
        "Designed KPI-driven distributor incentive structures.",
        "Ran margin and sales-incentive simulations to recover lost sales in flood-affected outlets, and built Power BI dashboards for management.",
      ],
    },
  ] as Role[],
  earlier: [
    {
      id: "role-octave-intern-2023",
      title: "Analytics Delivery Intern",
      company: "OCTAVE, John Keells Holdings",
      dateRange: "Mar 2023 to May 2023",
      location: "Colombo",
      details: [
        "Built Power BI dashboards for sales performance and route efficiency; field observations that informed a process rollout.",
      ],
    },
    {
      id: "role-octave-intern-2022",
      title: "Data Science Intern",
      company: "OCTAVE, John Keells Holdings",
      dateRange: "Mar 2022 to Jun 2022",
      location: "Remote",
      details: [
        "Data preparation and model support; a hotel customer analysis and a CSR study of street vendors.",
      ],
    },
  ] as Role[],
};

export const layer1 = {
  id: "role-layer1",
  company: "Layer1 Studio",
  logo: "/images/layer1.png",
  title: "Co-founder and Developer",
  dateRange: "Dec 2025 to present",
  location: "Part-time, remote",
  description:
    "I co-founded Layer1 Studio and build web and mobile products for small businesses, from shaping a brief to shipping and maintaining it.",
  details: [
    "Web and mobile applications in Flutter, React and Node.js, from UI design to backend integration and deployment.",
    "Turning an informal brief into a scoped product, then maintaining it after launch.",
    "Interns work on real client projects.",
  ],
  builtFor: [
    "Gyms",
    "E-commerce",
    "Food shops",
    "Marketing agencies",
    "A workplace culture consultancy",
    "An artist",
    "An author",
    "Sports teams",
  ],
};

export const londonSuccessAcademy: Role = {
  id: "role-lsa",
  title: "Data Engineering Intern",
  company: "London Success Academy",
  dateRange: "Sep 2025 to Oct 2025",
  location: "Remote, United Kingdom",
  details: [
    "Built ETL pipelines on Google Cloud Platform for clickstream and transaction data.",
    "Scaled processing with PySpark and Parquet partitioning.",
    "Produced revenue, daily active user and conversion funnel insights.",
  ],
};

export const otherRoles: Role[] = [
  {
    id: "role-uniqlo",
    title: "Customer Advisor",
    company: "UNIQLO",
    logo: "/images/uniqlo.png",
    dateRange: "Aug 2025 to Oct 2025",
    location: "London",
    details: ["Customer service and visual merchandising."],
  },
  {
    id: "role-eg",
    title: "Customer Service Associate",
    company: "EG On The Move",
    logo: "/images/logo-eg-on-the-move.png",
    dateRange: "Jan 2025 to Sep 2025",
    location: "Enfield",
    details: ["Customer service and point of sale operations."],
  },
  {
    id: "role-clear-links",
    title: "Support Worker",
    company: "Clear Links Support",
    dateRange: "Oct 2024 to Apr 2025",
    location: "London",
    details: ["Note-taking and in-lecture support for university students."],
  },
  {
    id: "role-tkmaxx",
    title: "Retail Associate",
    company: "TK Maxx",
    logo: "/images/logo-tkmaxx.png",
    dateRange: "Nov 2024 to Jan 2025",
    location: "Stratford",
    details: ["Customer service, stock and merchandising."],
  },
];

// ---------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------

export type BuildEntry = {
  id: string;
  title: string;
  year: string | null;
  built: string;
  tools: string[];
  // [CONFIRM] one honest lesson per entry, in Rachel's words.
  learned: string | null;
  link: string | null;
  image: string | null;
  imageAlt?: string;
};

// [CONFIRM] dates, tools and lessons for each entry.
export const buildLog: BuildEntry[] = [
  {
    id: "build-neurodiversity",
    title: "Neurodiversity support chatbot",
    year: "2024",
    built: "A chatbot prototype that guides people newly diagnosed with neurodiverse conditions, and their carers, through what comes next. Microsoft EMBRACE hackathon finalist.",
    tools: ["Generative AI", "Conversational design", "Prototyping"],
    learned: null,
    link: null,
    image: null,
  },
  {
    id: "build-carbon-tracker",
    title: "Carbon Footprint Tracker",
    year: null,
    built: "Turns everyday activities into an estimated carbon footprint using activity-based emission factors, with dashboards and suggestions for cutting it.",
    tools: ["Python", "Flutter", "Serverpod"],
    learned: null,
    link: "https://rachelcooray.github.io/carbon-footprint-tracker/",
    image: "/images/carbonfootprint.png",
    imageAlt: "Carbon Footprint Tracker dashboard",
  },
  {
    id: "build-futsal",
    title: "Futsal team recommender",
    year: null,
    built: "A Flutter app that matches players to teams using collaborative and content-based filtering, with centralised stadium booking.",
    tools: ["Flutter", "Node", "Flask", "Machine learning"],
    learned: null,
    link: null,
    image: "/images/futsal.png",
    imageAlt: "Futsal team recommender app screens",
  },
  {
    id: "build-fantasy-coin-collector",
    title: "Fantasy Coin Collector",
    year: null,
    built: "A 2D dungeon crawler built from scratch in HTML5 Canvas, with its own physics, procedural maps and sound.",
    tools: ["HTML5 Canvas", "JavaScript", "Web Audio API"],
    learned: null,
    link: "https://rachelcooray.github.io/FantasyCoinCollector/",
    image: "/images/coin-collector.png",
    imageAlt: "Fantasy Coin Collector game screen",
  },
  {
    id: "build-csr-street-vendors",
    title: "CSR street-vendor analytics",
    year: "2022",
    built: "A field survey of street food vendors whose findings the CSR team adopted.",
    tools: ["Data collection", "Data analytics", "Field research"],
    learned: null,
    link: null,
    image: "/images/street-vendor.png",
    imageAlt: "Street vendor survey analysis",
  },
];

// ---------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------

// [CONFIRM] which tools were used at work and which were explored.
export const skills: { category: string; work: string[]; explored: string[] }[] = [
  { category: "Languages", work: ["Python", "SQL", "JavaScript", "Dart"], explored: [] },
  { category: "Data and AI", work: ["PySpark", "Databricks", "Power BI"], explored: ["scikit-learn", "pandas", "RAG pipelines"] },
  { category: "Web and mobile", work: ["React", "Node.js", "Flutter"], explored: [] },
  { category: "Cloud and tools", work: ["GCP", "Git and GitHub", "Excel"], explored: [] },
];

// ---------------------------------------------------------------------
// TEACHING
// ---------------------------------------------------------------------

export const teaching = {
  intro: "I explain technical work so the person using it can act on it.",
  roles: [
    {
      id: "teaching-class-teacher",
      title: "Class Teacher",
      institution: "St. Mary's Church, Dehiwala",
      dateRange: "Aug 2022 to Aug 2024",
      summary: "Lessons for primary school learners, adapted to different learning needs.",
    },
    {
      id: "teaching-student-support",
      title: "Student Support Worker",
      institution: "Clear Links Support",
      dateRange: "Oct 2024 to Apr 2025",
      summary: "Note-taking and academic support for university students in lectures and tutorials.",
    },
    {
      id: "teaching-layer1-interns",
      title: "Mentoring interns",
      institution: "Layer1 Studio",
      dateRange: "Dec 2025 to present",
      summary: "Interns work on real client projects.",
    },
  ],
};

// ---------------------------------------------------------------------
// VOLUNTEER AND BEYOND WORK
// ---------------------------------------------------------------------

export const volunteer = {
  summary:
    "With the John Keells Foundation, 2026: guest support at the launch of Artist Spotlight (8th edition) with City of Dreams, ushering for the La Bamba musical at Cinnamon Life, and volunteering at Kala Pola with the George Keyt Foundation.",
  items: [
    {
      id: "volunteer-artist-spotlight",
      title: "Event Support Volunteer",
      organization: "John Keells Foundation",
      dateRange: "Sep 2026",
      summary: "Registration and guest check-in at the launch of Artist Spotlight (8th edition).",
    },
    {
      id: "volunteer-la-bamba",
      title: "Event Assistant",
      organization: "John Keells Foundation",
      dateRange: "Apr 2026",
      summary: "Usher for the La Bamba musical at Cinnamon Life.",
    },
    {
      id: "volunteer-kala-pola",
      title: "Volunteer",
      organization: "John Keells Foundation",
      dateRange: "Feb 2026",
      summary: "Kala Pola, organised with the George Keyt Foundation.",
    },
  ],
  // [CONFIRM] whether to include this line.
  swimming:
    "At the 2026 JKH Intercompany Swimming Meet I won three individual golds and gold in every relay in the under-25 group, as OCTAVE took the overall women's championship.",
  memberships: ["Rotaract", "IEEE Club", "BCS", "CIMA Student"],
};

// ---------------------------------------------------------------------
// ACHIEVEMENTS AND PRESS
// ---------------------------------------------------------------------

export type Recognition = {
  id: string;
  title: string;
  organization: string;
  year: string;
  summary: string;
  link?: string;
  image?: string;
  imageAlt?: string;
};

export const achievements: Recognition[] = [
  {
    id: "achievement-showcase",
    title: "Third place, final year project showcase",
    organization: "University of Westminster, judged with Netcompany and SmartDCC",
    year: "2025",
    summary: "For PCOS Care.",
  },
  {
    id: "achievement-embrace",
    title: "Hackathon finalist, neurodiversity support chatbot",
    organization: "Microsoft EMBRACE",
    year: "2024",
    summary: "",
  },
  {
    id: "achievement-scholarship",
    title: "UOW/IIT School of Computing and Engineering scholarship",
    organization: "University of Westminster and Informatics Institute of Technology",
    year: "2024/25",
    summary: "",
  },
  {
    id: "achievement-new-generation",
    title: "New Generation Awards",
    organization: "Women in Management and NYSC",
    year: "2020",
    summary: "",
  },
];

export const press: Recognition[] = [
  {
    id: "press-westminster-showcase",
    title: "Celebrating Innovation at the Computer Science and Engineering Final Year Project Showcase",
    organization: "University of Westminster blog",
    year: "2025",
    summary: "",
    link: "https://blog.westminster.ac.uk/wearewestminster/celebrating-innovation-at-the-computer-science-and-engineering-final-year-project-showcase/",
    image: "/images/netcompany-group-pic.jpg",
    imageAlt: "Students and judges at the Westminster final year project showcase",
  },
  {
    id: "press-westminster-prize",
    title: "Computer Science and Engineering Students Receive Prizes from Netcompany",
    organization: "University of Westminster news",
    year: "2025",
    summary: "",
    link: "https://www.westminster.ac.uk/news/westminster-computer-science-and-engineering-students-receive-prizes-from-netcompany-at-annual-final-year-project-showcase",
    image: "/images/blog.png",
    imageAlt: "University of Westminster news article",
  },
  {
    id: "press-daily-ft",
    title: "WIM, NYSC recognise youth with New Generation Awards",
    organization: "Daily FT",
    year: "2020",
    summary: "",
    link: "https://www.ft.lk/Front-Page/WIM-NYSC-recognise-youth-with-New-Generation-Awards/44-711214",
    image: "/images/daily-ft.png",
    imageAlt: "Daily FT front page article on the New Generation Awards",
  },
  {
    id: "press-lmd",
    title: "LMD Youth Forum interview",
    organization: "LMD",
    year: "2020",
    summary: "",
    link: "https://lmd.lk/youth-forum-32/",
    image: "/images/youth-forum.png",
    imageAlt: "LMD Youth Forum interview page",
  },
];

// ---------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------

export const contact = {
  headline: "Let's build something worth explaining.",
  intro: "Happy to talk about AI and analytics problems, research collaboration and guest lectures.",
};

// ---------------------------------------------------------------------
// CASE STUDIES (/case-studies/[slug])
// ---------------------------------------------------------------------

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  problem: string;
  why: string;
  role: string;
  approach: string[];
  useCases?: { name: string; problem: string; approach: string }[];
  tools: string[];
  outcome: string[];
  limits?: string[];
  links?: { label: string; href: string }[];
  learned: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "octave",
    title: "Four use cases a distributor network can run",
    subtitle: "OCTAVE, John Keells Holdings",
    category: "Commercial analytics",
    summary: "Four AI and analytics use cases on the distributor side of an FMCG business, owned end to end.",
    problem:
      "An FMCG distributor network where incentives rewarded delivery volume and gave management few levers on margin, replenishment or dispatch cost.",
    why: "A use case only counts if the business uses it. Any scheme had to be one a distributor team could calculate and follow in the field.",
    role: "I own the four use cases end to end: PMO, direct client contact, decks for senior leaders and finance, and coordinating the data science team.",
    useCases: [
      {
        name: "Distributor margin incentives",
        problem: "Some distributors were missing margin targets while carrying high delivery overhead, and the commission structure did not reward the behaviour the business wanted.",
        approach: "Segmented distributors by performance and potential, then designed KPI-based incentive tiers tied to margin contribution and basket depth, tested against historical scenarios before anything reached a distributor.",
      },
      {
        name: "Replenishment recommendations",
        problem: "Deciding how much stock to redistribute, and where.",
        approach: "A replenishment system that recommends redistribution volumes, checked by how closely the recommendations are followed.",
      },
      {
        name: "Permanent dispatch plan",
        problem: "Lorry costs in getting product out to distributors.",
        approach: "A permanent dispatch plan that minimises lorry costs within operational constraints.",
      },
      {
        name: "Distributor efficiency",
        problem: "Distributor productivity was hard to see.",
        approach: "A distributor efficiency model that increases line items per bill.",
      },
    ],
    approach: [
      "Designed how each use case is checked: pilot and control groups where possible, before and after where not, with operational measures first and margin second.",
      "Transparent, rule-based formulas over opaque scorecards, so field agents can work out their own incentive.",
      "Baselines calibrated to local seasonality, so a good month does not pay out as a behaviour change.",
    ],
    tools: ["Excel", "Databricks", "Power BI"],
    outcome: [
      "Four use cases run as one programme, reviewed in regular governance calls with area, regional and sales managers.",
      "Power BI tracking so leadership and finance can follow target against achievement and distributor performance.",
      "Results reported with the method attached: impact where there is a control group, association where there is not.",
      "Decision logs, process maps and problem statements that record why each choice was made.",
    ],
    learned: "A model is only useful if the incentive it recommends is one a distributor team can actually run.",
  },
  {
    slug: "pcos-care",
    title: "PCOS Care: early risk screening",
    subtitle: "Published at IEEE ICAHS 2025, University of Westminster",
    category: "Healthcare and machine learning",
    summary: "An early risk-screening web app that shows which factors drove each prediction.",
    problem:
      "Published risk models tend to produce opaque scores, and models that need full hormone panels do not help community-level triage where those tests are not available.",
    why: "Polycystic ovary syndrome is a common endocrine condition in women of reproductive age, and diagnosis is often delayed by overlapping symptoms and uneven access to specialist screening.",
    role: "Lead developer and researcher, from data and modelling to the deployed app and the paper.",
    approach: [
      "Two levels of prediction: an everyday-signals screen anyone can answer, then a second level that adds hormone test results.",
      "Features chosen with Chi-Square tests for categorical indicators and ANOVA F-tests for numerical ones, so the model rests on signals a clinician would recognise.",
      "SMOTE for class balance and an enhanced Random Forest, evaluated with stratified cross-validation and favouring recall, since a missed case costs more than a false alarm.",
      "Each prediction shows which factors drove it, so a clinician can inspect the reasoning.",
      "A structured usability study with real users.",
    ],
    tools: ["Python", "scikit-learn", "Flask", "Streamlit"],
    outcome: [
      "Published in the IEEE ICAHS 2025 proceedings and presented in Tunisia.",
      "Third place at the University of Westminster final year project showcase, 2025.",
      "Extended paper selected for the MSIT Journal special edition, under review.",
      "The app is deployed and open to try.",
    ],
    limits: [
      "A screening aid, not a diagnostic tool.",
      "Trained on one anonymised public benchmark dataset of patient records from hospitals in Kerala, India.",
    ],
    links: [
      { label: "Try the app", href: "https://pcos-care-web-app.onrender.com" },
      { label: "Read the paper", href: "https://doi.org/10.1109/ICAHS66950.2025.11553077" },
    ],
    learned: "In clinical machine learning, transparency is not a finishing touch. It is the condition for anyone adopting the tool.",
  },
  {
    slug: "layer1",
    title: "From a rough brief to a shipped product",
    subtitle: "Layer1 Studio",
    category: "Product engineering for small businesses",
    summary: "Web and mobile products for small businesses, from rough brief to shipped product.",
    problem:
      "Small businesses usually arrive with an informal brief, a few spreadsheets and a process held together by messages and paper.",
    why: "The product has to be one the owner can run without us: scoped tightly, shipped quickly, and maintained after launch.",
    role: "Co-founder and Developer: shaping the brief, building, shipping and maintaining, and working with interns on real client projects.",
    approach: [
      "Shape the brief into a short architecture: a responsive web platform and, where the business needs it, a companion mobile app.",
      "Build the operational pieces first, such as sign-ups, bookings, payments and reminders, before any polish.",
      "A lightweight serverless stack and optimistic UI updates, so the product stays responsive on ordinary mobile networks.",
      "Automated reminders by WhatsApp and email ahead of renewals and bookings, since that is where small businesses lose customers.",
    ],
    tools: ["Flutter", "React", "Node.js"],
    outcome: [
      "Products in use by gyms, food shops, e-commerce brands, agencies, an artist, an author and sports teams, with no client named here by agreement.",
      "A repeatable delivery model: brief, scope, build, launch, maintain.",
    ],
    learned: "Building for small business operators means designing for operational friction first. The best software removes daily clerical dread.",
  },
];

// ---------------------------------------------------------------------
// ASK MODE: everything above, flattened into searchable passages.
// The command bar answers only from this list. Nothing else is ever
// shown, so anything removed from this file cannot be revealed.
// ---------------------------------------------------------------------

export type Passage = {
  id: string;
  section: SectionId;
  title: string;
  text: string;
  keywords: string[];
};

export function buildPassages(): Passage[] {
  const p: Passage[] = [];
  const add = (section: SectionId, id: string, title: string, text: string, keywords: string[] = []) =>
    p.push({ id, section, title, text, keywords });

  add("work", "intro", identity.name, `${identity.tagline} ${identity.summary}`, ["who", "about", "rachel", "what does she do", "role", "title"]);
  add("work", "currently", "Currently", identity.currently.join(" "), ["now", "currently", "today"]);
  selectedWork.forEach((w) => add("work", w.id, w.title, `${w.kicker}. ${w.body}`, ["work", "selected"]));

  add("how", "how-i-work", howIWork.title, howIWork.paragraphs.join(" "), ["how", "measure", "impact", "evaluate", "evaluation", "pilot", "control", "association", "octave", "governance", "decision log"]);

  add("research", "research-paper", research.paper.title, `${research.paper.venue}. ${research.paper.description} Method: ${research.paper.method} ${research.paper.award} ${research.paper.journal}`, ["pcos", "paper", "ieee", "publication", "published", "research", "doi", "journal", "msit"]);
  research.talks.forEach((t, i) => add("research", `talk-${i}`, "Talks", t, ["talk", "presented", "conference"]));

  buildLog.forEach((b) => add("buildlog", b.id, b.title, `${b.year ? b.year + ". " : ""}${b.built} Built with ${b.tools.join(", ")}.`, ["build", "built", "project", "app", "chatbot", "hackathon"]));

  add("experience", "octave-own", "OCTAVE: what she owns", octave.own, ["octave", "john keells", "fmcg", "distributor", "use case", "incentive", "replenishment", "dispatch", "job", "work", "current"]);
  [...octave.roles, ...octave.earlier].forEach((r) => add("experience", r.id, `${r.title}, ${r.company}`, `${r.dateRange}, ${r.location}. ${r.details.join(" ")}`, ["octave", "role", "intern", "promotion", "dates"]));
  add("experience", layer1.id, `${layer1.title}, ${layer1.company}`, `${layer1.dateRange}, ${layer1.location}. ${layer1.description} ${layer1.details.join(" ")} Clients include ${layer1.builtFor.join(", ").toLowerCase()}.`, ["layer1", "studio", "co-founder", "founder", "startup", "freelance", "clients", "built"]);
  add("experience", londonSuccessAcademy.id, `${londonSuccessAcademy.title}, ${londonSuccessAcademy.company}`, `${londonSuccessAcademy.dateRange}, ${londonSuccessAcademy.location}. ${londonSuccessAcademy.details.join(" ")}`, ["data engineering", "etl", "gcp", "pyspark", "london"]);
  otherRoles.forEach((r) => add("experience", r.id, `${r.title}, ${r.company}`, `${r.dateRange}, ${r.location}. ${r.details.join(" ")}`, ["retail", "customer", "uk", "part-time"]));

  education.forEach((e) => add("education", e.id, e.title, `${e.institution}, ${e.dateRange}.${e.summary ? " " + e.summary : ""}`, ["education", "degree", "university", "school", "studied", "first class", "cima", "a-levels", "scholarship"]));

  skills.forEach((s) => add("skills", `skills-${s.category}`, s.category, `Used at work: ${s.work.join(", ")}.${s.explored.length ? ` Explored: ${s.explored.join(", ")}.` : ""}`, ["skills", "tools", "stack", "languages", "python", "sql"]));

  add("teaching", "teaching-intro", "Teaching", teaching.intro, ["teaching", "teach", "lecture", "mentor", "explain"]);
  teaching.roles.forEach((t) => add("teaching", t.id, `${t.title}, ${t.institution}`, `${t.dateRange}. ${t.summary}`, ["teaching", "teacher", "support worker", "mentoring", "interns"]));

  achievements.forEach((a) => add("recognition", a.id, a.title, `${a.organization}, ${a.year}.${a.summary ? " " + a.summary : ""}`, ["award", "prize", "achievement", "won", "finalist", "recognition"]));
  press.forEach((n) => add("recognition", n.id, n.title, `${n.organization}, ${n.year}.`, ["news", "press", "article", "interview", "featured"]));

  add("volunteer", "volunteer-summary", "Volunteering", volunteer.summary, ["volunteer", "foundation", "community"]);
  add("volunteer", "swimming", "Swimming", volunteer.swimming, ["swim", "swimming", "sport", "gold", "championship"]);
  add("volunteer", "memberships", "Memberships", volunteer.memberships.join(", "), ["member", "membership", "club", "bcs", "ieee"]);

  add("contact", "contact", "Contact", `${contact.intro} Email ${identity.email}. LinkedIn, GitHub and ORCID links are in the Contact section. Based in ${identity.location}.`, ["contact", "email", "reach", "linkedin", "github", "orcid", "hire", "location", "where", "based"]);

  return p;
}
