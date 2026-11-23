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
  currently: ["Owning six AI and analytics use cases at OCTAVE.", "Building products with Layer1."],
  bio: "I build analytics and AI systems that help people make decisions they can understand and act on. I work at the point where a model's output has to become a business decision, and I care most about the step in between: making the reasoning legible to the person who has to use it.",
  portrait: "/images/mag/rachel-portrait.webp",
  portraitAlt: "Rachel Cooray, standing, in a pale blue blouse, smiling at the camera",
  badgePhoto: "/images/rachel-badge.jpg",
  badgePhotoAlt: "Rachel Cooray, head and shoulders",
  email: "rachelcooray@gmail.com",
  phone: "+94 77 177 0570",
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
    title: "Six use cases across the FMCG value chain",
    body: "Production planning, dispatch, replenishment, distributor margins and targets, and weather. The analysis has to be sound and the business has to use it.",
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
    venue: "IEEE ICAHS 2025, Hammamet, Tunisia",
    // [CONFIRM] conference dates and paper ID against the IEEE record.
    dates: "5 to 6 December 2025",
    paperId: "46",
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
    title: "BSc (Hons) Computer Science, First Class Honours",
    institution: "University of Westminster, London, United Kingdom",
    dateRange: "Sep 2022 to Jul 2025",
    summary: "Data Science specialisation. Started at IIT, Sri Lanka; Batch Representative in Years 1 and 2. UOW/IIT School of Computing and Engineering Part-Fee Scholarship, £5,000, 2024/25.",
  },
  {
    id: "education-cima",
    title: "Certificate in Business Accounting",
    institution: "CIMA",
    dateRange: "Aug 2024",
    summary: "BA1 to BA4 completed. Operational level in progress.",
  },
  {
    // [CONFIRM] subject-to-grade mapping before publishing.
    id: "education-school",
    title: "St. Bridget's Convent, Colombo",
    institution: "GCE A/L 2022 and GCE O/L 2018",
    dateRange: "2008 to 2022",
    summary: "GCE A/L 2022: Chemistry A, English A, Physics B, Combined Mathematics B. GCE O/L 2018: nine As, in English Language, Mathematics, Science, Business and Accounting Studies, ICT, Sinhala, History, Western Music and Roman Catholicism. Head Prefect, 2020.",
  },
];

export const cima = {
  completed: [
    "BA1, Fundamentals of Business Economics",
    "BA2, Fundamentals of Management Accounting",
    "BA3, Fundamentals of Financial Accounting",
    "BA4, Fundamentals of Ethics, Corporate Governance and Business Law",
  ],
  inProgress: ["E1, Managing Finance in a Digital World", "P1, Management Accounting", "F1, Financial Reporting"],
};

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
  meta: "Colombo, Sri Lanka. Promoted from intern to associate to analyst.",
  own: "I work across enterprise data and AI initiatives within the FMCG business, connecting data science, engineering and commercial stakeholders to deliver analytics-driven solutions. I own six use cases across the value chain, from the analysis and the solution design to the problem solving along the way: production planning, Permanent Dispatch Planning, the Distributor Replenishment System, Ice Cream Distributor Margins, Beverages Distributor Margins, and weather and sales.",
  useCases: [
    {
      code: "DRS",
      slug: "distributor-replenishment-system",
      name: "Distributor Replenishment System",
      line: "Data-driven replenishment recommendations to help distributors manage ordering and stock availability.",
      focus: ["Replenishment", "Distribution", "Inventory"],
    },
    {
      code: "ICDM",
      slug: "ice-cream-distributor-margins",
      name: "Ice Cream Distributor Margins",
      line: "Analytics and commercial incentive mechanisms to understand distributor performance and margin outcomes.",
      focus: ["Commercial analytics", "Distributor performance"],
    },
    {
      code: "BevDM",
      slug: "beverages-distributor-margins",
      name: "Beverages Distributor Margins",
      line: "Applying distributor-level analytics to support commercial performance and margin management.",
      focus: ["Finance", "Performance measurement"],
    },
    {
      code: "PDP",
      slug: "permanent-dispatch-planning",
      name: "Permanent Dispatch Planning",
      line: "Supporting a dispatch planning system designed to improve distribution planning and minimise lorry costs.",
      focus: ["Planning", "Logistics optimisation"],
    },
  ],
  exposure: [
    { code: "PP", name: "Production Planning", line: "Factory production planning initiatives." },
    { code: "Weather", name: "Weather", line: "Weather-informed target setting." },
  ],
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
  tools: ["Python", "PySpark", "SQL", "Databricks", "Delta Lake", "Power BI", "Excel"],
  roles: [
    {
      id: "role-octave-analyst",
      title: "Analyst, Data and AI",
      company: "OCTAVE, John Keells Holdings",
      dateRange: "Jul 2026 to present",
      location: "Colombo, hybrid",
      details: [
        "Owning six AI and analytics use cases across the FMCG value chain.",
        "Coordinating data science and engineering teams to translate business requirements into implementable solutions.",
        "Managing project plans, sprint activities, RAID logs, dependencies and delivery priorities.",
        "Working directly with business stakeholders, including sales, finance, area and regional management.",
        "Preparing presentations and communicating progress, findings and challenges to senior stakeholders.",
        "Developing problem statements, process maps, decision logs and requirements documentation.",
        "Supporting validation of data, model outputs, dashboards and business reporting.",
        "Designing measurement approaches using pilot and control comparisons where possible and before and after analysis where appropriate.",
        "Evaluating operational indicators and commercial outcomes while distinguishing association from proven impact.",
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
  logo: "/images/mag/layer1.webp",
  title: "Co-founder and Developer",
  dateRange: "Dec 2025 to present",
  location: "Colombo, Sri Lanka and London, UK, part-time",
  description:
    "I co-founded Layer1 Studio and build web and mobile products for small businesses, from shaping a brief to shipping and maintaining it.",
  details: [
    "Work with clients to understand their needs and define project requirements.",
    "Develop websites and mobile applications.",
    "Contribute to interface design, application architecture and backend integration.",
    "Coordinate development and deployment, and support maintenance and iterative improvements.",
    "Mentor interns and involve them in real client projects.",
    "Contribute to business development and the growth of the studio.",
  ],
  builtFor: [
    "Fitness",
    "Marketing",
    "Arts and publishing",
    "E-commerce",
    "Retail",
    "Food",
    "Workplace culture",
    "Sports",
  ],
};

export const londonSuccessAcademy: Role = {
  id: "role-lsa",
  title: "Data Engineering Intern",
  company: "London Success Academy",
  dateRange: "Sep 2025 to Oct 2025",
  location: "Remote, United Kingdom",
  details: [
    "Developed scalable data pipelines that turned raw clickstream and transaction data into structured datasets for business intelligence and behavioural analytics.",
    "Built ETL pipelines on Google Cloud Platform for clickstream and transaction data.",
    "Scaled processing with PySpark and optimised storage with Parquet partitioning.",
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
    details: ["Known for strong customer service: friendly, patient and quick to help.", "Helped customers find the right products, sizes and fits.", "Kept displays and stock tidy to UNIQLO's visual merchandising standards.", "Worked as part of a fast-paced team to keep the shop floor running smoothly."],
  },
  {
    id: "role-eg",
    title: "Customer Service Associate",
    company: "EG On The Move (Petrogas)",
    logo: "/images/logo-eg-on-the-move.png",
    dateRange: "Jan 2025 to Sep 2025",
    location: "Enfield",
    details: ["Helped customers with purchases, with friendly and efficient service.", "Handled point of sale transactions accurately.", "Kept inventory organised and stock levels up to date.", "Resolved customer queries and issues."],
  },
  {
    id: "role-clear-links",
    title: "Support Worker",
    company: "Clear Links Support",
    logo: "/images/logo-clear-links.png",
    dateRange: "Oct 2024 to Apr 2025",
    location: "London",
    details: ["Supported university students with note-taking and academic work.", "Gave practical help in lectures and tutorials.", "Worked with a diverse range of students.", "Coordinated materials and schedules."],
  },
  {
    id: "role-tkmaxx",
    title: "Retail Associate",
    company: "TK Maxx",
    logo: "/images/logo-tkmaxx.png",
    dateRange: "Nov 2024 to Jan 2025",
    location: "Stratford",
    details: ["Gave customers a positive shopping experience.", "Managed and replenished stock to keep products available.", "Set up merchandising and displays to store standards.", "Handled transactions and general store support."],
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
    id: "build-ask-agent",
    title: "Ask me: a portfolio agent that knows my work",
    year: "2026",
    built:
      "A chatbot on this site that answers recruiters' questions about my work. It matches each question to short answers and passages I have published here, quotes them with a link to the page they came from, keeps the conversation for the visit, suggests what to ask next, and hands over to me by email when it can't help. It never writes new text, so it cannot say anything I have not said.",
    tools: ["TypeScript", "React", "Next.js", "Retrieval and ranking"],
    learned: null,
    link: "/ask",
    image: "/images/mag/ask-agent.webp",
    imageAlt: "The Ask me agent answering who Rachel is and what she does at OCTAVE, with suggested next questions",
  },
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
    image: "/images/mag/carbon-footprint.webp",
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
    image: "/images/mag/futsal.webp",
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
    image: "/images/mag/coin-collector.webp",
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
    image: "/images/mag/street-vendor.webp",
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
      title: "Sunday School Class Teacher",
      institution: "St. Mary's Church, Dehiwala",
      dateRange: "Aug 2022 to Aug 2024",
      summary: "Taught children from pre-school to age 8. Adapted teaching to different learning needs, built a positive, inclusive classroom, and wrote lesson plans and learning materials.",
    },
    {
      id: "teaching-student-support",
      title: "Student Support Worker",
      institution: "Clear Links Support",
      dateRange: "Oct 2024 to Apr 2025",
      summary: "In-lecture support for university students, including note-taking and academic assistance.",
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
      id: "volunteer-this-is-michael",
      image: "/images/mag/events/this-is-michael.webp",
      imageAlt: "Poster for This Is Lenny Jay's Michael, the tribute concert",
      credit: "Event poster, City of Dreams Sri Lanka",
      creditUrl: "https://www.seylan.lk/seylan-cards-partners-with-cinnamon-city-of-dreams-to-unveil-lenny-jays-michael-relive-the-legend",
      event: "This Is Michael, Lenny Jay",
      title: "Event Volunteer",
      organization: "City of Dreams",
      dateRange: "Nov 2026",
      summary: "Volunteered at This Is Michael, a Michael Jackson tribute concert starring Lenny Jay, held at Cinnamon Life at City of Dreams on 8 and 9 Nov 2026.",
    },
    {
      id: "volunteer-artist-spotlight",
      image: "/images/mag/events/artist-spotlight.webp",
      imageAlt: "Paintings hung at the Artist Spotlight exhibition",
      credit: "Photo: Yamu",
      creditUrl: "http://www.yamu.lk/highlights/john-keells-foundation-and-city-of-dreams-present-channa-ekanayakes-what-lives-between-at-the-artist-spotlight/",
      event: "Artist Spotlight, 8th edition",
      title: "Event Support Volunteer",
      organization: "John Keells Foundation",
      dateRange: "Sep 2026",
      summary: "Registration and guest check-in at the launch of Artist Spotlight, 8th edition, with City of Dreams.",
    },
    {
      id: "volunteer-project-uplift",
      event: "Project Uplift: Enabling every step forward",
      title: "Volunteer",
      organization: "OCTAVE, John Keells Holdings",
      dateRange: "Mar to May 2026",
      summary:
        "An OCTAVE CSR initiative with the Colombo Friend-in-Need Society, in three phases: board games, singalong and arts sessions with residents; digital literacy sessions for school leavers and university students; and a closing day in May 2026 with donations of prosthetic limbs and laptops.",
    },
    {
      id: "volunteer-la-bamba",
      image: "/images/mag/events/la-bamba.webp",
      imageAlt: "The cast and organisers at the La Bamba launch at Cinnamon Life",
      credit: "Photo: Colombo Gazette",
      creditUrl: "https://colombogazette.com/2026/02/06/cinnamon-life-brings-west-end-musical-la-bamba-to-colombo",
      event: "La Bamba, musical production",
      title: "Event Assistant",
      organization: "John Keells Foundation",
      dateRange: "Apr 2026",
      summary: "Audience usher for La Bamba, a musical production at Cinnamon Life.",
    },
    {
      id: "volunteer-kala-pola",
      image: "/images/mag/events/kala-pola.webp",
      imageAlt: "A stall of colourful paintings at Kala Pola",
      credit: "Photo: Kala Pola, George Keyt Foundation",
      creditUrl: "https://kalapola.lk/kala-pola-2026-open-air-art-fair-media-release/",
      event: "Kala Pola",
      title: "Volunteer",
      organization: "John Keells Foundation",
      dateRange: "Feb 2026",
      summary: "Kala Pola, the annual open-air art fair, with the George Keyt Foundation.",
    },
  ],
  // [CONFIRM] whether to include this line.
  swimming:
    "At the 2026 JKH Intercompany Swimming Meet I won three individual golds and gold in every relay in the under-25 group, as OCTAVE took the overall women's championship.",
  memberships: ["Rotaract Club", "IEEE Club", "Sri Lankan Society, University of Westminster", "CIMA Student Member", "BCS Member"],
  hobbies: ["Swimming", "Running", "Films and dramas", "History", "Music"],
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
    summary: "Awarded for PCOS Care, a machine learning-based application for early PCOS risk screening.",
  },
  {
    id: "achievement-embrace",
    title: "Hackathon finalist, Generative AI for Neurodiversity",
    organization: "Microsoft EMBRACE Employee Resource Group",
    year: "2024",
    summary: "Contributed to a chatbot prototype designed to guide and support people newly diagnosed with neurodiverse conditions.",
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
    title: "School Prefect of the Year, New Generation Awards",
    organization: "Women in Management and the National Youth Services Council",
    year: "2020",
    summary: "Recognised for youth leadership while serving as Head Prefect of St. Bridget's Convent.",
  },
];

export const press: Recognition[] = [
  {
    id: "press-ieee",
    title: "PCOS Care research publication",
    organization: "IEEE",
    year: "2025",
    summary: "The published paper in the IEEE ICAHS 2025 proceedings.",
    link: "https://doi.org/10.1109/ICAHS66950.2025.11553077",
    image: "/images/mag/icahs-certificate.webp",
    imageAlt: "IEEE ICAHS 2025 participation certificate presented to Rachel Cooray for presenting the PCOS Care paper, Hammamet, Tunisia",
  },
  {
    id: "press-jkh-swim",
    title: "Team OCTAVE wins the overall women's championship",
    organization: "John Keells Holdings",
    year: "2026",
    summary: "JKH Intercompany Swimming Meet.",
    link: "https://www.linkedin.com/posts/jkh-intercompanyswimming-swimmingmeet-ugcPost-7503426930759593986-LQqx/",
    image: "/images/mag/swimming-meet.webp",
    imageAlt: "Team OCTAVE at the John Keells intercompany swimming meet",
  },
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
    image: "/images/mag/blog.webp",
    imageAlt: "University of Westminster news article",
  },
  {
    id: "press-daily-ft",
    title: "WIM, NYSC recognise youth with New Generation Awards",
    organization: "Daily FT",
    year: "2020",
    summary: "",
    link: "https://www.ft.lk/Front-Page/WIM-NYSC-recognise-youth-with-New-Generation-Awards/44-711214",
    image: "/images/mag/daily-ft.webp",
    imageAlt: "Daily FT front page article on the New Generation Awards",
  },
  {
    id: "press-lmd",
    title: "LMD Youth Forum interview",
    organization: "LMD",
    year: "2020",
    summary: "",
    link: "https://lmd.lk/youth-forum-32/",
    image: "/images/mag/youth-forum.webp",
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

// The seven-part case study template (multi-page site, Nov 2026).
// Parts with no confirmed content are left empty and are not shown.
export type WorkCase = {
  slug: string;
  num: string;
  title: string;
  category: string;
  tags: string[];
  question: string;
  summary: string;
  contribution: string;
  diagram: string[];
  challenge: string;
  context: string;
  approach: string[];
  role: string[];
  solution: string;
  evaluation: string[];
  outcomes: string[];
  learning: string;
  links?: { label: string; href: string }[];
  image?: string;
  imageAlt?: string;
};

const octaveEvaluation = [
  "Pilot and control groups where possible, before and after comparisons where not.",
  "Operational measures first, such as billing activity, outlet reach and how closely recommendations are followed, then commercial outcomes.",
  "Where there is no control group, results are described as an association, not proven impact.",
];

export const workCases: WorkCase[] = [
  {
    slug: "distributor-replenishment-system",
    num: "01",
    title: "Distributor Replenishment System",
    category: "Enterprise analytics",
    tags: ["Enterprise Analytics", "FMCG", "OCTAVE"],
    question: "How can distributors make better ordering decisions using data?",
    summary: "The Distributor Replenishment System uses distributor and outlet-level information to support more informed replenishment decisions.",
    contribution: "Delivery coordination, requirements, operational validation, stakeholder engagement and performance measurement.",
    diagram: ["Distributor and outlet data", "Replenishment logic", "Recommended quantities", "Distributor ordering"],
    challenge: "Helping distributors manage ordering and stock availability with data, rather than habit.",
    context: "Distributors decide how much stock to order and redistribute across the outlets they serve.",
    approach: ["Uses distributor and outlet-level information to recommend replenishment and redistribution quantities."],
    role: ["Delivery coordination and requirements.", "Operational validation of recommendations.", "Stakeholder engagement and performance measurement."],
    solution: "Data-driven replenishment recommendations that distributors can act on.",
    evaluation: octaveEvaluation,
    outcomes: [],
    learning: "",
  },
  {
    slug: "ice-cream-distributor-margins",
    num: "02",
    title: "Ice Cream Distributor Margins",
    category: "Commercial intelligence",
    tags: ["Commercial Intelligence", "FMCG", "OCTAVE"],
    question: "How can distributor-level data support a clearer understanding of commercial performance?",
    summary: "Brings together distributor sales, targets, product information and performance measures to support margin analysis and commercial decision-making.",
    contribution: "Analytics delivery, data validation, business requirements and finance-facing performance reporting.",
    diagram: ["Sales, targets, products", "Performance measures", "Margin analysis", "Commercial decisions"],
    challenge: "Understanding distributor performance and margin outcomes clearly enough to design commercial incentives around them.",
    context: "A distributor network where performance, targets and incentives all affect margin.",
    approach: ["Brings together distributor sales, targets, product information and performance measures.", "Analytics and commercial incentive mechanisms built on that combined view."],
    role: ["Analytics delivery and business requirements.", "Data validation.", "Finance-facing performance reporting."],
    solution: "Analytics and incentive mechanisms that make distributor performance and margin outcomes visible.",
    evaluation: octaveEvaluation,
    outcomes: [],
    learning: "A model is only useful if the incentive it recommends is one a distributor team can actually run.",
  },
  {
    slug: "beverages-distributor-margins",
    num: "03",
    title: "Beverages Distributor Margins",
    category: "Commercial analytics",
    tags: ["Commercial Analytics", "FMCG", "OCTAVE"],
    question: "How can commercial performance be measured and understood across a distributor network?",
    summary: "Applies analytics to distributor-level performance and commercial margin management.",
    contribution: "Use-case coordination, stakeholder engagement, analytical validation and reporting.",
    diagram: ["Distributor data", "Performance measurement", "Margin management", "Reporting"],
    challenge: "Measuring commercial performance consistently across a distributor network.",
    context: "Distributor-level performance has to be understood before margins can be managed.",
    approach: ["Distributor-level analytics for performance measurement and margin management."],
    role: ["Use-case coordination.", "Stakeholder engagement.", "Analytical validation and reporting."],
    solution: "Distributor-level analytics that support commercial performance and margin management.",
    evaluation: octaveEvaluation,
    outcomes: [],
    learning: "",
  },
  {
    slug: "permanent-dispatch-planning",
    num: "04",
    title: "Permanent Dispatch Planning",
    category: "Operations research and planning",
    tags: ["Planning", "Logistics", "OCTAVE"],
    question: "How can dispatch planning be improved while reducing transport costs?",
    summary: "Supports permanent dispatch planning through a more structured, data-driven approach to distribution decisions.",
    contribution: "Business requirements, delivery coordination, process understanding and validation.",
    diagram: ["Distribution requirements", "Operational constraints", "Dispatch plan", "Lower lorry costs"],
    challenge: "Improving distribution planning while minimising lorry costs.",
    context: "Dispatch decisions balance distribution requirements against operational constraints and transport cost.",
    approach: ["A more structured, data-driven approach to dispatch and distribution decisions."],
    role: ["Business requirements.", "Delivery coordination.", "Process understanding and validation."],
    solution: "A dispatch planning system designed to improve distribution planning and minimise lorry costs.",
    evaluation: octaveEvaluation,
    outcomes: [],
    learning: "",
  },
  {
    slug: "pcos-care",
    num: "05",
    title: "PCOS Care",
    category: "Applied machine learning and research",
    tags: ["Applied AI", "Research", "IEEE ICAHS 2025"],
    question: "Can machine learning help people identify potential PCOS risk earlier?",
    summary: "A research-led web application, built as my final year Computer Science project, that explores machine learning as a screening-support tool.",
    contribution: "Research, application development, machine learning experimentation, model evaluation and communication of prediction factors.",
    diagram: ["Everyday signs", "Initial screening", "Hormone results", "Enhanced screening"],
    challenge: "PCOS is a complex condition with varied symptoms. Identifying potential risk is hard, especially with limited access to structured screening.",
    context: "Many risk models produce opaque scores, and models that need full hormone panels do not help where those tests are not available.",
    approach: [
      "Two pathways: an initial assessment from everyday signs and symptoms, and an enhanced assessment that adds hormone test results.",
      "Chi-Square and ANOVA feature selection, SMOTE for class balance and an enhanced Random Forest.",
      "Each result shows the factors that contributed to it.",
    ],
    role: [
      "Investigated the research problem and relevant literature.",
      "Explored feature selection and machine learning approaches, and developed and evaluated the models.",
      "Designed and built the web application and integrated the model outputs.",
      "Communicated the research through an academic paper and conference publication.",
    ],
    solution: "A deployed web application with two screening pathways that explains each prediction. A screening-support tool, not a diagnostic system or a replacement for medical advice.",
    evaluation: ["Stratified cross-validation, favouring recall, since a missed case costs more than a false alarm.", "A structured usability study with real users."],
    outcomes: [
      "Published at IEEE ICAHS 2025.",
      "Third place at the University of Westminster final year project showcase, 2025.",
      "Extended paper selected for the MSIT Journal special edition, under review.",
    ],
    learning: "In clinical machine learning, transparency is not a finishing touch. It is the condition for anyone adopting the tool.",
    links: [
      { label: "Read the paper", href: "https://doi.org/10.1109/ICAHS66950.2025.11553077" },
      { label: "View the application", href: "https://pcos-care-web-app.onrender.com" },
    ],
    image: "/images/photos/pcos-app.webp",
    imageAlt: "PCOS Care web app home page with information, simple and enhanced risk assessment, and results",
  },
  {
    slug: "layer1-studio",
    num: "06",
    title: "Layer1.Studio digital products",
    category: "Software engineering",
    tags: ["Software", "Digital Products", "Layer1.Studio"],
    question: "How does a rough brief become a product a small business can run?",
    summary: "Websites, mobile applications and digital experiences for clients across different industries.",
    contribution: "Requirements, design, development, deployment and maintenance, with interns on real client projects.",
    diagram: ["Rough brief", "Scope", "Build", "Launch and maintain"],
    challenge: "Small businesses arrive with an informal brief, a few spreadsheets and a process held together by messages and paper.",
    context: "The product has to be one the owner can run without us: scoped tightly, shipped quickly and maintained after launch.",
    approach: [
      "Shape the brief into a short architecture: a responsive web platform and, where needed, a companion mobile app.",
      "Build the operational pieces first, such as sign-ups, bookings, payments and reminders.",
      "A lightweight serverless stack and optimistic UI updates, so products stay responsive on ordinary mobile networks.",
    ],
    role: ["Client requirements and scoping.", "Interface design, architecture and backend integration.", "Development, deployment and maintenance.", "Mentoring interns on real client projects."],
    solution: "Products in use across fitness, food, e-commerce, marketing, arts and publishing, workplace culture and sports. No client is named here without permission.",
    evaluation: [],
    outcomes: ["A repeatable delivery model: brief, scope, build, launch, maintain."],
    learning: "Building for small business operators means designing for operational friction first.",
  },
];

// Page copy for the multi-page site. Facts come from the sections above.
export const site = {
  hero: {
    eyebrow: "Portfolio / 2026 · Computer Science · Data · Technology · Business",
    title: "Building at the intersection of technology, people and possibility.",
    lead: "A multidisciplinary technologist exploring how intelligent systems can solve meaningful problems.",
    paragraphs: [
      "I'm a computer science graduate and technology professional exploring how data, AI and software can solve meaningful problems.",
      "From building intelligent applications and conducting research to delivering data-driven solutions in enterprise environments, I enjoy working across disciplines to turn complex ideas into things people can actually use.",
    ],
    meta: "Colombo, Sri Lanka · Working across technology, research and business",
  },
  world: [
    { title: "AI & Data", line: "Building intelligent, data-informed solutions.", href: "/research" },
    { title: "Technology & Engineering", line: "Turning concepts into working systems.", href: "/projects" },
    { title: "Business & Strategy", line: "Connecting technical work to business outcomes.", href: "/experience" },
    { title: "People & Leadership", line: "Collaborating, communicating and bringing ideas forward.", href: "/beyond-work" },
  ],
  journey: [
    { year: "2020", text: "School leadership and national youth recognition." },
    { year: "2022", text: "Began developing technical and analytical foundations." },
    { year: "2023", text: "Expanded into analytics delivery and business-facing work." },
    { year: "2024", text: "Advanced academic work, international experience and a GenAI hackathon final." },
    { year: "2025", text: "First Class Computer Science graduate, published research at IEEE ICAHS, joined enterprise data and AI delivery." },
    { year: "2026", text: "Analyst role, co-founded Layer1.Studio, and research, technology and community work." },
  ],
  closing: {
    title: "Curiosity is where it starts. Building is where it becomes real.",
    text: "I'm interested in people, ideas and opportunities that bring technology and meaningful problems together.",
  },
  about: {
    title: "A curious mind, a multidisciplinary approach.",
    paragraphs: [
      "I have always been interested in understanding how things work: not just technically, but how they connect to people, organisations and the world around us.",
      "My journey began with an interest in computing and problem-solving. Studying Computer Science gave me a foundation in software engineering, data science and analytical thinking. Working on real business problems then introduced me to commercial decision-making, project delivery, stakeholder management, research, communication and leadership.",
      "I found that the most interesting problems rarely sit within one discipline.",
      "Today I work in Data and AI at OCTAVE, part of John Keells Holdings, on technology and analytics initiatives in the FMCG sector. Alongside this, I co-founded Layer1.Studio, where I work on digital products and software for businesses.",
      "My interests extend into academic research, responsible technology, entrepreneurship and community. I don't see these as unrelated pursuits. They are different ways of understanding problems, developing ideas and creating value.",
    ],
    principles: [
      { title: "Understand before building", text: "Good solutions begin with understanding the problem, the people affected and the environment the solution must work in." },
      { title: "Think across disciplines", text: "Technology, business, design, research and human behaviour are connected. I enjoy bringing these perspectives together." },
      { title: "Build with purpose", text: "I value practical outcomes, not technology for its own sake. A solution should be useful, understandable and sustainable." },
      { title: "Keep learning", text: "I want to keep a broad foundation while developing genuine depth in areas that can make a difference." },
    ],
    direction: {
      title: "Broad foundations. Deeper expertise.",
      text: "I am building towards a career that combines technical understanding, research, organisational problem-solving and leadership. I'm interested in how intelligent systems move beyond experimentation into real-world use, and how to make that transition effective, responsible and human-centred.",
      interests: [
        "Applied artificial intelligence and machine learning",
        "Human-centred intelligent systems",
        "Explainability and trust in AI",
        "Responsible AI and governance",
        "Enterprise AI adoption and decision intelligence",
        "Technology and organisational performance",
      ],
      note: "An evolving area of interest, not a claim that I already specialise in all of these fields.",
    },
    tShape: {
      breadth: ["Business", "Finance", "Delivery", "Product development", "Research", "Communication"],
      foundation: "Computer Science, data, engineering and analytical thinking",
      depth: "Applied AI, human-centred intelligent systems and responsible enterprise deployment",
    },
    // [CONFIRM] where each capability was used.
    skills: [
      { capability: "AI and data", tools: "Machine learning, predictive modelling, statistics, data science, GenAI", where: "Research and projects" },
      { capability: "Data engineering", tools: "Python, SQL, PySpark, Databricks, Delta Lake, ETL, GCP", where: "Professional" },
      { capability: "Software engineering", tools: "Flutter, React, Node.js, APIs, application development", where: "Professional and projects" },
      { capability: "Business intelligence", tools: "Power BI, Excel, KPI development, commercial analysis", where: "Professional" },
      { capability: "Delivery and strategy", tools: "Agile, PMO, requirements, stakeholder management, process mapping", where: "Professional" },
      { capability: "Research", tools: "Literature review, research design, model evaluation, academic writing", where: "Academic" },
      { capability: "Communication", tools: "Presentations, client engagement, mentoring, teaching", where: "Professional and teaching" },
    ],
    interests: ["Swimming", "Running", "Films and dramas", "History", "Music", "Technology and design"],
  },
  experience: {
    title: "Where I have applied my capabilities.",
    intro: "Most recent first. The roles that shaped my work get the most room.",
  },
  work: {
    title: "Ideas become valuable when they work in the real world.",
    intro: [
      "A selection of projects across enterprise analytics, applied AI, software engineering and digital product development.",
      "I enjoy working across the full problem-solving process: understanding a challenge, exploring solutions, building or coordinating implementation, and evaluating what changes as a result.",
    ],
    categories: ["Enterprise AI & Analytics", "Applied AI & Research", "Software & Digital Products", "Data Engineering"],
    note: "OCTAVE work is shown without confidential data, client information, algorithms, dashboards or results. Diagrams are illustrative.",
  },
  research: {
    title: "Research driven by questions worth exploring.",
    intro: "My academic interests sit where computer science, artificial intelligence and real-world applications meet: how computational methods can help us understand complex problems, support decisions and make technology more accessible.",
    interests: [
      "Human-centred artificial intelligence",
      "Explainability and trust in intelligent systems",
      "Responsible AI and governance",
      "Applied machine learning in real-world environments",
      "AI adoption and decision-making in organisations",
    ],
  },
  education: {
    title: "Learning as a foundation for building.",
    intro: "My academic journey has given me a foundation in computing, analytical thinking and business, complemented by independent research and continuous professional development.",
  },
  beyond: {
    title: "A life beyond the job title.",
    intro: "I value community involvement, sport, education, creative experiences and the chance to contribute to something larger than myself.",
  },
  news: {
    title: "Featured, recognised and covered.",
    intro: "Articles, university features and publications documenting milestones across my academic, professional, sporting and community journey.",
  },
  contact: {
    title: "Have an interesting problem to solve?",
    text: [
      "I'm always interested in connecting with people working across technology, AI, research, business and innovation.",
      "Whether it's a research collaboration, an interesting project, a professional opportunity or a conversation about ideas, I'd love to hear from you.",
    ],
  },
};

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

  add("experience", "octave-own", "OCTAVE: what she owns", octave.own, ["octave", "own", "owns", "six", "john keells", "fmcg", "distributor", "use case", "incentive", "replenishment", "dispatch", "job", "work", "current"]);
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

// ---------------------------------------------------------------------
// COMPONENT SITE (Nov 2026 component spec). Facts come from above.
// ---------------------------------------------------------------------

export const capabilities = [
  { num: "01", tag: "Intelligence", title: "AI & Data", text: "Machine learning, data science, predictive modelling, intelligent systems and analytics.", href: "/research" },
  { num: "02", tag: "Engineering", title: "Technology", text: "Software, applications, engineering and digital products.", href: "/projects" },
  { num: "03", tag: "Value", title: "Business", text: "Finance, commercial thinking and decision intelligence.", href: "/education" },
  { num: "04", tag: "Execution", title: "Strategy & Delivery", text: "Problem-solving, product thinking and implementation.", href: "/experience" },
  { num: "05", tag: "Connection", title: "People & Communication", text: "Leadership, collaboration, teaching and communication.", href: "/beyond-work" },
];

export const disciplineMap = [
  { id: "technology", label: "Technology", line: "Technology enables solutions.", evidence: "Layer1.Studio products, PCOS Care, independent builds" },
  { id: "data", label: "Data", line: "Data creates understanding.", evidence: "Distributor analytics at OCTAVE, ETL at London Success Academy" },
  { id: "business", label: "Business", line: "Business identifies value.", evidence: "Margin use cases at OCTAVE, CIMA Certificate in Business Accounting" },
  { id: "strategy", label: "Strategy", line: "Strategy turns ideas into implementation.", evidence: "Owning six use cases: plans, sprints, RAID logs" },
  { id: "people", label: "People", line: "People make adoption possible.", evidence: "Governance calls with field managers, teaching, mentoring interns" },
];

export const personalValues = [
  { title: "Curiosity", text: "Asking how things work, and why, before deciding what to build." },
  { title: "Integrity", text: "Reporting what the evidence supports, including association rather than impact." },
  { title: "Adaptability", text: "Moving between data, delivery, research and people as the problem needs." },
  { title: "Impact", text: "Judging work by whether people can use it, not by how impressive it looks." },
];

export type ExperienceCategory = "Technology" | "Entrepreneurship" | "Education & Support" | "Customer Experience";

export type ExperienceEntry = {
  id: string;
  org: string;
  logo?: string;
  title: string;
  dateRange: string;
  location: string;
  category: ExperienceCategory;
  summary: string;
  bullets: string[];
  tags: string[];
};

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "exp-layer1",
    org: "Layer1.Studio",
    logo: "/images/mag/layer1.webp",
    title: layer1.title,
    dateRange: layer1.dateRange,
    location: layer1.location,
    category: "Entrepreneurship",
    summary: "Co-founded a studio that turns client requirements into websites, mobile applications and digital experiences.",
    bullets: layer1.details,
    tags: ["Flutter", "React", "Node.js", ...layer1.builtFor.slice(0, 3)],
  },
  {
    id: "exp-lsa",
    org: londonSuccessAcademy.company,
    title: londonSuccessAcademy.title,
    dateRange: londonSuccessAcademy.dateRange,
    location: londonSuccessAcademy.location,
    category: "Technology",
    summary: "Data engineering on clickstream and transaction data.",
    bullets: londonSuccessAcademy.details,
    tags: ["GCP", "PySpark", "Parquet", "ETL"],
  },
  {
    id: "exp-uniqlo",
    org: "UNIQLO",
    logo: "/images/uniqlo.png",
    title: "Customer Advisor",
    dateRange: "Aug 2025 to Oct 2025",
    location: "London",
    category: "Customer Experience",
    summary: "Customer service and visual merchandising.",
    bullets: [],
    tags: ["Customer service", "Visual merchandising"],
  },
  {
    id: "exp-eg",
    org: "EG On The Move",
    logo: "/images/logo-eg-on-the-move.png",
    title: "Customer Service Associate",
    dateRange: "Jan 2025 to Sep 2025",
    location: "Enfield",
    category: "Customer Experience",
    summary: "Customer service and point of sale operations.",
    bullets: [],
    tags: ["Customer service", "Retail operations"],
  },
  {
    id: "exp-clear-links",
    org: "Clear Links Support",
    title: "Student Support Worker",
    dateRange: "Oct 2024 to Apr 2025",
    location: "London",
    category: "Education & Support",
    summary: "In-lecture support for university students, including note-taking and academic assistance.",
    bullets: ["Clear communication, understanding individual support needs, and working in an inclusive learning environment."],
    tags: ["Inclusive support", "Communication"],
  },
  {
    id: "exp-tkmaxx",
    org: "TK Maxx",
    logo: "/images/logo-tkmaxx.png",
    title: "Retail Associate",
    dateRange: "Nov 2024 to Jan 2025",
    location: "Stratford",
    category: "Customer Experience",
    summary: "Customer service, stock and merchandising.",
    bullets: [],
    tags: ["Customer service", "Stock"],
  },
  {
    id: "exp-sunday-school",
    org: "St. Mary's Church, Dehiwala",
    title: "Sunday School Class Teacher",
    dateRange: "Aug 2022 to Aug 2024",
    location: "Sri Lanka",
    category: "Education & Support",
    summary: "Taught children aged 4 to 8, from Pre-Grade to Grade 2.",
    bullets: ["Prepared and delivered lessons, supported classroom activities and kept the learning environment engaging."],
    tags: ["Teaching", "Lesson planning"],
  },
];

export type ChainStage = {
  code: string;
  stage: string;
  name: string;
  owned: boolean;
  line: string;
  slug: string | null;
};

// Factory to market. Four use cases Rachel owns; two she contributes to.
export const valueChain: ChainStage[] = [
  { code: "PP", stage: "Factory", name: "Production planning", owned: false, line: "Factory production planning initiatives.", slug: null },
  { code: "PDP", stage: "Dispatch", name: "Permanent Dispatch Planning", owned: true, line: octave.useCases[3].line, slug: octave.useCases[3].slug },
  { code: "DRS", stage: "Distributor", name: "Distributor Replenishment System", owned: true, line: octave.useCases[0].line, slug: octave.useCases[0].slug },
  { code: "ICDM", stage: "Distributor", name: "Ice Cream Distributor Margins", owned: true, line: octave.useCases[1].line, slug: octave.useCases[1].slug },
  { code: "BevDM", stage: "Distributor", name: "Beverages Distributor Margins", owned: true, line: octave.useCases[2].line, slug: octave.useCases[2].slug },
  { code: "Weather", stage: "Market", name: "Weather-informed planning", owned: false, line: "Weather-informed target setting.", slug: null },
];

export const PROJECT_FILTERS = [
  "Enterprise AI & Analytics",
  "Machine Learning",
  "Software Development",
  "Web & Mobile Applications",
  "Data Engineering",
  "Business Intelligence",
] as const;

export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

export type ProjectPart = { title: string; body: string[] };

export type Project = {
  slug: string;
  title: string;
  category: string;
  filters: ProjectFilter[];
  featured: boolean;
  summary: string;
  question: string;
  role: string;
  tools: string[];
  timeline: string;
  domain: string;
  thumbnail: string | null;
  thumbnailAlt: string;
  diagram: string[] | null;
  parts: ProjectPart[];
  links: { label: string; href: string }[];
  confidential: boolean;
};

const PART_TITLES = [
  "The problem",
  "Context and constraints",
  "My approach",
  "Solution and architecture",
  "Implementation",
  "Evaluation and validation",
  "Results and limitations",
  "Lessons and next steps",
];

function parts(...bodies: (string | string[])[]): ProjectPart[] {
  return bodies
    .map((b, i) => ({ title: PART_TITLES[i], body: (Array.isArray(b) ? b : [b]).filter(Boolean) }))
    .filter((p) => p.body.length > 0);
}

const octaveFilters: Record<string, ProjectFilter[]> = {
  "distributor-replenishment-system": ["Enterprise AI & Analytics", "Data Engineering"],
  "ice-cream-distributor-margins": ["Enterprise AI & Analytics", "Business Intelligence"],
  "beverages-distributor-margins": ["Enterprise AI & Analytics", "Business Intelligence"],
  "permanent-dispatch-planning": ["Enterprise AI & Analytics"],
};

export const projectList: Project[] = [
  ...workCases.map((c): Project => {
    const isOctave = c.tags.includes("OCTAVE");
    const isPcos = c.slug === "pcos-care";
    return {
      slug: c.slug,
      title: c.title,
      category: c.category,
      filters: isOctave ? octaveFilters[c.slug] : isPcos ? ["Machine Learning", "Web & Mobile Applications"] : ["Software Development", "Web & Mobile Applications"],
      featured: true,
      summary: c.summary,
      question: c.question,
      role: c.contribution,
      tools: isOctave ? octave.tools : isPcos ? ["Python", "scikit-learn", "Flask", "Streamlit"] : ["Flutter", "React", "Node.js"],
      timeline: isOctave ? "Oct 2025 to present" : isPcos ? "Final year, 2024 to 2025" : layer1.dateRange,
      domain: isOctave ? "FMCG distribution, OCTAVE" : isPcos ? "Healthcare research" : "Small business products",
      thumbnail: c.image ?? null,
      thumbnailAlt: c.imageAlt ?? "",
      diagram: c.diagram,
      parts: parts(c.challenge, c.context, c.approach, c.solution, c.role, c.evaluation, c.outcomes, c.learning),
      links: c.links ?? [],
      confidential: isOctave,
    };
  }),
  ...buildLog.map((b): Project => {
    const thumbs: Record<string, [string, string]> = {
      "build-carbon-tracker": ["/images/photos/carbon-footprint.webp", "Carbon Footprint Tracker home screen with an eco score and suggestions"],
      "build-futsal": ["/images/photos/futsal-app.png", "Futsal MatchUp app sign-in screen on a phone"],
      "build-fantasy-coin-collector": ["/images/photos/coin-collector.webp", "Fantasy Coin Collector game screen with coins, an enemy and touch controls"],
      "build-csr-street-vendors": ["/images/photos/street-vendor.jpg", "A street food vendor at his stall in Colombo"],
    };
    const filters: Record<string, ProjectFilter[]> = {
      "build-neurodiversity": ["Machine Learning", "Software Development"],
      "build-carbon-tracker": ["Web & Mobile Applications", "Software Development"],
      "build-futsal": ["Web & Mobile Applications", "Machine Learning"],
      "build-fantasy-coin-collector": ["Software Development"],
      "build-csr-street-vendors": ["Business Intelligence"],
    };
    const t = thumbs[b.id];
    return {
      slug: b.id.replace("build-", ""),
      title: b.title,
      category: b.id === "build-csr-street-vendors" ? "Field research and analytics" : "Independent build",
      filters: filters[b.id] ?? ["Software Development"],
      featured: false,
      summary: b.built,
      question: "",
      role: b.id === "build-neurodiversity" ? "Team member, Microsoft EMBRACE hackathon" : b.id === "build-csr-street-vendors" ? "Field researcher and analyst, OCTAVE internship" : "Designer and developer",
      tools: b.tools,
      timeline: b.year ?? "",
      domain: b.id === "build-csr-street-vendors" ? "CSR" : "Personal project",
      thumbnail: t ? t[0] : null,
      thumbnailAlt: t ? t[1] : "",
      diagram: null,
      parts: parts("", "", "", b.built, "", "", "", b.learned ?? ""),
      links: b.link ? [{ label: "View project", href: b.link }] : [],
      confidential: false,
    };
  }),
];

export const coreAchievements = [
  {
    id: "showcase",
    title: "Third Place, Final Year Research Project Showcase",
    org: "University of Westminster, judged with Netcompany and SmartDCC",
    year: "2025",
    text: "Awarded for PCOS Care, a machine learning-based application for early PCOS risk screening.",
    image: "/images/photos/pcos-showcase.webp",
    imageAlt: "Rachel presenting PCOS Care to judges and standing beside her research poster",
    w: 1606,
    h: 1198,
    link: "https://www.westminster.ac.uk/news/westminster-computer-science-and-engineering-students-receive-prizes-from-netcompany-at-annual-final-year-project-showcase",
  },
  {
    id: "embrace",
    title: "Hackathon Finalist, Generative AI for Neurodiversity",
    org: "Microsoft EMBRACE Employee Resource Group",
    year: "2024",
    text: "Contributed to a chatbot prototype designed to guide and support people newly diagnosed with neurodiverse conditions.",
    image: null,
    imageAlt: "",
    w: 0,
    h: 0,
    link: null,
  },
  {
    id: "prefect",
    title: "School Prefect of the Year, New Generation Awards",
    org: "Women in Management and the National Youth Services Council",
    year: "2020",
    text: "Recognised for youth leadership while serving as Head Prefect of St. Bridget's Convent.",
    image: "/images/photos/best-prefect-clipping.png",
    imageAlt: "Newspaper clipping: Best School Prefect of the Year, Rachel Naadia Cooray, receiving her award",
    w: 598,
    h: 390,
    link: "https://www.ft.lk/Front-Page/WIM-NYSC-recognise-youth-with-New-Generation-Awards/44-711214",
  },
];

// ---------------------------------------------------------------------
// SECTION DIRECTORY: every section a visitor can go into, in order, with
// the points shown on the homepage. Facts come from the sections above.
// ---------------------------------------------------------------------

export const sectionDirectory = [
  {
    id: "education",
    href: "/education",
    title: "Education",
    cta: "Open education",
    points: [
      "BSc (Hons) Computer Science, First Class Honours, University of Westminster, 2022 to 2025",
      "Data Science specialisation, started at IIT, Sri Lanka",
      "UOW/IIT Part-Fee Scholarship, £5,000, 2024/25",
      "CIMA Certificate in Business Accounting; Operational level in progress",
    ],
  },
  {
    id: "research-projects",
    href: "/projects",
    title: "Research & Projects",
    cta: "Open research and projects",
    points: [
      "PCOS Care, published at IEEE ICAHS 2025, Tunisia",
      "Four OCTAVE use cases, each with a case study",
      "Layer1.Studio products for small businesses",
      "Independent builds: apps, a chatbot, a game and field research",
    ],
  },
  {
    id: "experience",
    href: "/experience",
    title: "Experience",
    cta: "Open experience",
    points: [
      "Analyst, Data and AI, OCTAVE, John Keells Holdings, Jul 2026 to present",
      "Co-founder and Developer, Layer1.Studio, Dec 2025 to present",
      "Data Engineering Intern, London Success Academy, 2025",
      "Teaching, student support and customer-facing roles",
    ],
  },
  {
    id: "volunteering",
    href: "/volunteering",
    title: "Volunteering",
    cta: "Open volunteering",
    points: [
      "John Keells Foundation: Artist Spotlight, La Bamba and Kala Pola, 2026",
      "Event volunteer, This Is Michael, City of Dreams, Nov 2026",
      "CSR field research with street food vendors, adopted by the CSR team",
      "Rotaract, IEEE Club and BCS member",
    ],
  },
  {
    id: "achievements",
    href: "/achievements",
    title: "Achievements",
    cta: "Open achievements",
    points: [
      "Third place, Westminster final year project showcase, 2025",
      "Microsoft EMBRACE hackathon finalist, 2024",
      "School Prefect of the Year, New Generation Awards, 2020",
      "Three individual golds and every relay gold, JKH swim meet, 2026",
    ],
  },
  {
    id: "media",
    href: "/media",
    title: "In the media",
    cta: "Open media",
    points: [
      "University of Westminster: showcase feature and prize news, 2025",
      "IEEE: PCOS Care publication, 2025",
      "John Keells Holdings: Team OCTAVE's swimming championship, 2026",
      "Daily FT and the LMD Youth Forum, 2020",
    ],
  },
  {
    id: "skills",
    href: "/skills",
    title: "Skills",
    cta: "Open skills",
    points: [
      "Data engineering: Python, SQL, PySpark, Databricks, Delta Lake",
      "AI and data: machine learning, model evaluation, GenAI",
      "Software: React, Flutter, Node.js",
      "Delivery: requirements, PMO, stakeholder management",
    ],
  },
  {
    id: "beyond",
    href: "/beyond-work",
    title: "Beyond work",
    cta: "Open beyond work",
    points: [
      "Competitive swimming",
      "Head Prefect, St. Bridget's Convent, 2020",
      "Running, films and dramas, history and music",
    ],
  },
];

export const atAGlance = [
  "Analyst, Data and AI at OCTAVE, John Keells Holdings, Colombo",
  "First Class Computer Science graduate, University of Westminster",
  "Published researcher: PCOS Care, IEEE ICAHS 2025",
  "Co-founder and Developer, Layer1.Studio",
  "Interested in applied AI, explainability and responsible AI",
];

// ---------------------------------------------------------------------
// MAGAZINE (Nov 2026 redesign). Every page of the magazine reads from here.
// OCTAVE work is described without figures, names or results.
// ---------------------------------------------------------------------

export type MagUseCase = {
  id: string;
  headline: string;
  code: string;
  stage: "Factory" | "Dispatch" | "Distributor" | "Market";
  name: string;
  line: string;
  part: string;
};

export const magazine = {
  issue: "Issue 01",
  issueDate: "November 2026",
  strap: "Data · AI · Business · People",
  coverHeadline: "Applying AI and analytics to real business decisions.",
  coverDeck: "Analyst, Data and AI at OCTAVE, John Keells Holdings. Published researcher and co-founder of Layer1 Studio.",
  useCasesHeadline: "From the factory production line to the outlet shelves.",
  useCasesDeck: "The AI and analytics use cases I own at OCTAVE, and my part in each.",
  footerLine: "Rachel Cooray. Analyst, Data and AI. Colombo, Sri Lanka.",
  pullQuote: "The most interesting problems rarely sit within one discipline.",
  cover: {
    story: { kicker: "Cover story", title: "From the factory production line to the outlet shelves.", dek: "How an analyst owns the work from the factory line to the shop shelf at OCTAVE, John Keells Holdings." },
    research: { kicker: "Research", title: "PCOS Care, from final year project to IEEE ICAHS 2025." },
    ask: { kicker: "New this issue", title: "Ask me anything. An agent that answers from my own work, and shows its source." },
    alsoInside: "A First Class at Westminster · Gold in the pool · Head Prefect, 2020 · Volunteering with the John Keells Foundation",
  },
  useCasesIntro:
    "As Analyst, Data and AI at OCTAVE, John Keells Holdings, I own six use cases across the value chain, from the analysis and the solution design to the problem solving along the way, working with data science, engineering and the commercial teams who use the results. Each one asks the same question in a different place: is the distributor being asked for the right thing, and rewarded for the right reason?",
  chain: [
    { stage: "Factory", icon: "factory", label: "Production planning" },
    { stage: "Dispatch", icon: "truck", label: "Permanent Dispatch Planning" },
    { stage: "Distributor warehouse", icon: "warehouse", label: "Replenishment · Ice cream margins and targets · Beverage margins" },
    { stage: "Outlets", icon: "shop", label: "Weather and sales" },
  ],
  useCases: [
    {
      id: "production-planning",
      headline: "Balancing product availability against working capital.",
      code: "Production planning",
      stage: "Factory",
      name: "Production planning",
      line: "A digital twin of the beverages factory. A model recommends the schedule for each production line so that no product runs out of stock, while keeping the stock that ties up working capital as low as it can be.",
      part: "I own it: the analysis, shaping the solution with the data science team, and solving the problems that come up between the model and the factory floor.",
    },
    {
      id: "pdp",
      headline: "Planned deliveries and lower transport cost.",
      code: "PDP",
      stage: "Dispatch",
      name: "Permanent Dispatch Planning",
      line: "Gives each distributor fixed delivery days and splits the week's order across them, so trucks run to a plan instead of to whoever calls first.",
      part: "I measure how closely deliveries keep to each distributor's planned days, flag deliveries that fall off plan, and work out whether a miss was the order or the truck.",
    },
    {
      id: "drs",
      headline: "What to order, and when: data-driven ordering decisions for distributors.",
      code: "DRS",
      stage: "Distributor",
      name: "Distributor Replenishment System",
      line: "Recommends how much each ice cream distributor should order, product by product, for each delivery day. A weekly forecast sets the volume, and a daily refresh adjusts each order on the morning it is placed, using the latest stock and sales so distributors neither run short nor overfill their freezers.",
      part: "I compare what the model recommends with what distributors actually order, track stock against freezer capacity, run a feedback pilot that asks distributors why they changed an order, and test proposed rule changes by simulating them on past orders before they go to the business.",
    },
    {
      id: "icdm",
      headline: "Setting appropriate targets that balance incentive payout against incremental volume.",
      code: "ICDM",
      stage: "Distributor",
      name: "Ice Cream Distributor Margins",
      line: "On top of their normal margin, ice cream distributors can earn monthly bonuses for hitting targets on sales, product mix, outlet coverage and range. This use case checks who was paid and whether it matched the rules, and whether the bonuses are actually changing behaviour. Because pay depends on beating a target, it also sets each distributor's monthly target with a model: past sales adjusted for seasonality, a fair share of the business unit's total, and a small stretch for distributors who usually beat target. When territories change, it re-maps history so no distributor is judged on sales that are no longer theirs.",
      part: "I built the monitoring that flags patterns suggesting a bonus is being gamed rather than earned: landing just above a threshold month after month, stopping at a cap, or buying stock that never sells on to shops. I also own the target model: the analysis behind each rule, the fixes when the numbers didn't add up, and checking its targets against the business unit's before they go out.",
    },
    {
      id: "bevdm",
      headline: "Linking margin to performance: balancing payout against the extra volume it brings.",
      code: "BevDM",
      stage: "Distributor",
      name: "Beverages Distributor Margins",
      line: "Beverage distributors used to earn a mostly fixed margin, whether they pushed hard or not. Now part of it is paid only when they beat target, with an extra bonus tied to a second condition that can rotate to whichever measure needs lifting next. Targets are set by a model, so pay is earned rather than given away.",
      part: "I track who qualifies each month, watch for payments that reward catching up rather than real growth, and weigh the extra volume against what the bonus costs. The tracking feeds the weekly governance calls with the business.",
    },
    {
      id: "weather",
      headline: "Using expected weather, favourable or unfavourable, to set fairer targets.",
      code: "Weather",
      stage: "Market",
      name: "Weather and sales",
      line: "Ice cream and drinks sell far more on hot, dry days. This puts each distributor's sales beside the weather in their own area, expected against actual, so a hit or a miss can be read as performance or as weather. It separates luck from effort, spots demand that wasn't captured, and points to fairer, weather-aware targets next.",
      part: "I own it: the analysis, turning weather and sales into a clear story for each distributor, and the problem solving that leads to the next phase.",
    },
  ] as MagUseCase[],
  measureQuote: "Operational indicators first, then commercial outcomes, always separating association from proven impact.",
  delivery: ["Problem statement", "Requirements", "Build with data science and engineering", "Validate", "Measure", "Govern with the business"],
  confidentiality: "OCTAVE work is shown without confidential data, client information or results.",
  backPage: "Curiosity is where it starts. Building is where it becomes real.",
};

export function buildMagazinePassages(): Passage[] {
  const p: Passage[] = [...buildPassages()];
  const add = (section: SectionId, id: string, title: string, text: string, keywords: string[] = []) =>
    p.push({ id, section, title, text, keywords });

  add("work", "bio", "About Rachel", identity.bio, ["who", "about", "rachel", "background", "herself", "introduce"]);
  add("work", "magazine-intro", "What connects the work", `${magazine.useCasesHeadline} ${magazine.useCasesDeck} ${magazine.useCasesIntro}`, ["octave", "use cases", "value chain"]);

  magazine.useCases.forEach((u) => {
    const st = useCaseStories[u.id];
    add("experience", `mag-${u.id}`, `${u.name} (${u.stage})`, `${u.headline} ${u.line} My part: ${u.part}`, [u.code.toLowerCase(), u.name.toLowerCase(), u.stage.toLowerCase(), "use case", "octave"]);
    if (st) {
      add("experience", `story-${u.id}-problem`, `${u.name}: the problem and the solution`, `${st.problem} ${st.solution}`, [u.code.toLowerCase(), u.name.toLowerCase(), "problem", "solution", "why"]);
      add("experience", `story-${u.id}-value`, `${u.name}: analytics and business value`, `${st.analytics.join(" ")} Business value: ${st.value.join(" ")}`, [u.code.toLowerCase(), u.name.toLowerCase(), "analytics", "value", "impact", "benefit"]);
    }
  });
  add("how", "delivery", "How she delivers", `${magazine.delivery.join(", ")}. ${magazine.measureQuote}`, ["how", "deliver", "process", "lifecycle", "measure"]);

  add("research", "research-detail", "PCOS Care: the research", `${research.paper.title}. ${research.paper.authors}. ${research.paper.venue}, ${research.paper.dates}. ${research.paper.description} Method: ${research.paper.method}`, ["pcos", "pcos care", "research", "paper", "ieee", "icahs", "machine learning", "app", "polycystic"]);
  add("research", "research-award", "PCOS Care: recognition", `${research.paper.award} ${research.paper.journal}`, ["pcos", "award", "prize", "third", "showcase", "journal"]);

  add("skills", "stack-thinking", "Skills: thinking and problem solving", `${thinkingLayer.a} Methods: ${thinkingLayer.tools.join(", ")}.`, ["thinking", "problem solving", "problem", "approach", "how does she work", "framing", "requirements"]);
  toolkitStack.forEach((l) => add("skills", `stack-${l.layer}`, `Skills: ${l.layer}`, `Tools: ${l.tools.join(", ")}. Used: ${l.where.toLowerCase()}.`, ["skills", "tools", "stack", "tech", "know", "knows", "use", "uses", "experienced", l.layer.toLowerCase(), ...l.tools.map((t) => t.toLowerCase())]));

  volunteer.items.forEach((v) => add("volunteer", v.id, `${v.event} (${v.dateRange})`, `${v.title}, ${v.organization}. ${v.summary}`, ["volunteer", "volunteering", "event", v.organization.toLowerCase()]));
  add("education", "modules", "Modules and papers", `Her BSc in Computer Science at Westminster had a Data Science specialisation; the full module list isn't published here yet. CIMA papers completed: ${cima.completed.join("; ")}. In progress: ${cima.inProgress.join("; ")}.`, ["modules", "module", "subjects", "subject", "courses", "course", "papers", "curriculum", "cima", "accounting"]);
  add("education", "school-life", "At school, St. Bridget's Convent", `${schoolLife.leadership.map((l) => `${l.role}, ${l.year}.`).join(" ")} ${schoolLife.interact} Interact projects: ${schoolLife.interactProjects.join("; ")}. ${schoolLife.interaction} Teams: ${schoolLife.teams.join(", ")}.`, ["school", "prefect", "head prefect", "leadership", "interact", "interaction", "sports festival", "swim", "athletics", "tech crew", "st bridget"]);
  talks.forEach((t) => add("recognition", t.id, `${t.event}: ${t.title}`, `${t.date}. ${t.org}. ${t.role} ${t.insights.join(" ")}`, ["talk", "speaker", "panel", "un", "united nations", "csw", "girl", "girls", "covid", "spoke", "speaking", "presented"]));
  add("contact", "contact-full", "Contact details", `Email ${identity.email}. Phone ${identity.phone}. Based in ${identity.location}. LinkedIn, GitHub and ORCID are linked at the foot of every page.`, ["contact", "email", "phone", "call", "reach", "hire", "linkedin", "number"]);
  return p;
}

// How the work starts, before any tool. Shown first on the Skills page.
export const thinkingLayer = {
  q: "Where does the work start?",
  a: "With the problem, not the tool. I start with the people affected and the decision they need to make, then choose the data and the technology.",
  layer: "Thinking and problem solving",
  where: "Every project",
  tools: ["Problem framing", "Problem statements", "Process mapping", "Requirements", "Decision logs", "Measurement design", "Thinking across disciplines"],
};

// The toolkit as a stack, foundations at the bottom. Only tools listed in
// `skills` and `site.about.skills` above.
export const toolkitStack = [
  { q: "And getting it used?", a: "Requirements, plans and people. That is most of the job at OCTAVE.", layer: "Delivery", where: "Professional", tools: ["Agile", "PMO", "Requirements", "Stakeholder management", "Process mapping", "Presentations"] },
  { q: "When does it become a product?", a: "When it ships: web and mobile apps through Layer1 Studio and my own builds.", layer: "Products", where: "Professional and projects", tools: ["React", "Node.js", "Flutter", "APIs", "Git and GitHub"] },
  { q: "How do people actually see it?", a: "Dashboards and KPIs the business can act on, not just read.", layer: "Insight", where: "Professional", tools: ["Power BI", "Excel", "KPI development", "Commercial analysis"] },
  { q: "And the models?", a: "Machine learning and statistics, tested hardest in research like PCOS Care.", layer: "AI and analysis", where: "Research and projects", tools: ["Machine learning", "Statistics", "scikit-learn", "pandas", "Model evaluation", "GenAI", "RAG pipelines"] },
  { q: "How does the data get ready?", a: "Pipelines: Spark on Databricks at work, and ETL on Google Cloud before that.", layer: "Data engineering", where: "Professional", tools: ["PySpark", "Databricks", "Delta Lake", "ETL", "GCP"] },
  { q: "What sits underneath everything?", a: "The languages. Everything else on this page is built on them.", layer: "Languages", where: "Everywhere", tools: ["Python", "SQL", "JavaScript", "Dart"] },
];

// One story per use case: problem, solution, how analytics helps, business
// value and Rachel's part. Value is written as what each use case is designed
// to change. No figures, names, results or internal data.
export type UseCaseStory = {
  problem: string;
  solution: string;
  analytics: string[];
  value: string[];
  role: string[];
};

export const useCaseStories: Record<string, UseCaseStory> = {
  "production-planning": {
    problem:
      "A beverages factory has to decide which product each line makes, in what order and for how long. Make too little of a product and it runs out on the shelf. Make too much and cash sits in the warehouse as stock instead of working for the business.",
    solution:
      "A digital twin of the factory: a model of the lines that can be run forward in time. It recommends the schedule for each production line so every product stays in stock while the stock held, and the working capital tied up in it, stays as low as it can be.",
    analytics: [
      "Tests a schedule in the twin before it runs on the real lines.",
      "Weighs keeping products available against the cost of holding stock, instead of treating them as separate goals.",
      "Turns a planner's trade-off into a recommendation that can be checked and explained.",
    ],
    value: [
      "Fewer products running out of stock.",
      "Less working capital tied up in finished goods.",
      "Schedules that can be reasoned about, not just inherited.",
    ],
    role: [
      "I own the use case: the analysis, shaping the solution with the data science team, and solving the problems that come up between the model and the factory floor.",
    ],
  },
  pdp: {
    problem:
      "When deliveries go out whenever a distributor calls, trucks run half empty on some days and overloaded on others, and distributors cannot plan their stock around a delivery they cannot predict.",
    solution:
      "Permanent Dispatch Planning gives each distributor fixed delivery days and splits the week's order across them, so trucks run to a plan instead of to whoever calls first.",
    analytics: [
      "Measures how closely each distributor's deliveries keep to their planned days.",
      "Flags deliveries that fall off plan and works out whether the order or the truck caused the miss.",
      "Feeds the delivery days into replenishment, so orders are sized for the days they will actually arrive.",
    ],
    value: [
      "Lower lorry costs through planned, fuller trips.",
      "Predictable deliveries that distributors can plan their stock around.",
      "A shared plan the business and distributors can both hold each other to.",
    ],
    role: [
      "I measure adherence to the plan, chase down off-plan deliveries, and bring what I find to the business so the plan and the trucks stay aligned.",
    ],
  },
  drs: {
    problem:
      "Ice cream distributors decide for themselves how much to order. Ordering by feel means some products run short while freezers fill with others, and stock that sits too long ties up the distributor's cash and freezer space.",
    solution:
      "The Distributor Replenishment System recommends how much each distributor should order, product by product, for each delivery day. A weekly forecast sets the volume, and a daily refresh adjusts each order on the morning it is placed using the latest stock and sales.",
    analytics: [
      "Forecasts each distributor's demand and splits it across products and delivery days.",
      "Checks the recommendation against current stock and freezer capacity before it goes out.",
      "Compares what the model recommended with what was actually ordered, and asks distributors why when they differ.",
      "Simulates proposed rule changes on past orders before they reach the business.",
    ],
    value: [
      "The right products in the right freezer, with fewer stock-outs and less overstock.",
      "Orders that follow sales instead of habit.",
      "Rule changes tested on evidence before they are rolled out.",
    ],
    role: [
      "I compare recommendations with actual orders, track stock against freezer capacity, and run the feedback pilot that asks distributors why they changed an order.",
      "I test proposed rule changes by simulating them on past orders, and take the findings to the weekly reviews with the business.",
    ],
  },
  icdm: {
    problem:
      "Ice cream distributors can earn monthly bonuses on top of their margin for hitting targets on sales, product mix, outlet coverage and range. A bonus only works if it is paid by the rules, rewards real effort rather than clever timing, and is measured against a target that is fair.",
    solution:
      "A monitoring view that checks who was paid against the rules and whether the bonuses are changing behaviour, alongside a model that sets each distributor's monthly target from past sales adjusted for seasonality, a fair share of the business unit's total and a small stretch.",
    analytics: [
      "Flags patterns that suggest a bonus is being gamed: landing just above a threshold month after month, stopping at a cap, or buying stock that never sells on to shops.",
      "Adjusts targets for seasonality so a distributor is not judged against an easy or a hard month.",
      "Re-maps sales history when territories change, so no distributor is judged on sales that are no longer theirs, and stops the run if any total moves.",
    ],
    value: [
      "Incentive money that rewards genuine performance.",
      "Targets distributors and the business can both accept as fair.",
      "Early warning when a scheme is being worked around.",
    ],
    role: [
      "I built the monitoring that spots gaming patterns.",
      "I own the target model: the analysis behind each rule, the fixes when the numbers did not add up, and checking its targets against the business unit's before they go out.",
    ],
  },
  bevdm: {
    problem:
      "Beverage distributors used to earn a mostly fixed margin. A distributor earned roughly the same whether it pushed hard or just kept ticking over, and targets were set by splitting a total from the top and adjusting by judgement.",
    solution:
      "Part of the margin is now paid only when a distributor beats its target, with an extra bonus tied to a second condition. Targets are set by a model, and the business reviews them before they go out, so pay is earned rather than given away.",
    analytics: [
      "Tracks which distributors qualify each month and why.",
      "Weighs the extra volume against what the bonus costs.",
      "Watches for payments that reward catching up after a dip rather than real growth, which shaped the proposal for guardrails.",
    ],
    value: [
      "A margin that gives distributors a reason to push, and to push on what the business needs.",
      "A second condition that can rotate to whichever measure needs lifting next.",
      "Evidence for the business on whether the scheme is worth what it costs.",
    ],
    role: [
      "I own the tracking: who can still earn the bonus this month, who did and whether it was earned. It feeds the weekly governance calls with the business.",
    ],
  },
  weather: {
    problem:
      "Ice cream and drinks sell far more on hot, dry days. When a distributor hits or misses target, it is hard to tell whether they did a good job or the weather helped or hurt them, so the judgement is mostly gut feel.",
    solution:
      "A view that puts each distributor's sales beside the weather in their own area, and compares the weather expected for the month with what actually happened.",
    analytics: [
      "Weather better and target beaten: the weather may have done the work, so full incentives risk paying for luck.",
      "Weather better but target missed: demand was there and was not captured, pointing to stock, coverage or execution.",
      "Weather as expected and target missed: a distributor or operational issue, not the weather.",
      "Very large misses are flagged as operational problems, not weather effects.",
    ],
    value: [
      "Rewards that go to genuine performance.",
      "Missed sales opportunities made visible.",
      "A path to weather-aware targets that are fairer and more realistic.",
    ],
    role: [
      "I own the use case: the analysis, turning weather and sales into a clear story for each distributor, and the problem solving that leads to the next phase.",
    ],
  },
};

// School: St. Bridget's Convent, Colombo. Leadership, newest first, then clubs.
export const schoolLife = {
  leadership: [
    { year: "2020", role: "Head Prefect", note: "St. Bridget's Convent, Colombo. Recognised as School Prefect of the Year at the New Generation Awards." },
    { year: "2019", role: "Assistant House Prefect", note: "St. Bridget's Convent, Colombo." },
    { year: "2012", role: "Deputy Head Prefect", note: "Primary school, St. Bridget's Convent." },
  ],
  interact: "Held leadership roles in the Interact Club, including Project Secretary of the Interact Inter-school Marketing and Advertising Challenge in 2019, and volunteered on its community service projects.",
  interactProjects: ["Make a Wish, 2017 and 2019", "Smile for Life, 2018", "Interaction Sports Committee, 2019/20", "Community Service, 2020"],
  interaction: "Served on the Sports Committee of Interaction 2020 for Interact District 3220. Interaction is the biggest school sports festival in Sri Lanka, with track and field, beach sports, e-sports and road races.",
  teams: ["Swim team, SLASA and SLASU meets, 2012 to 2019", "Tech crew", "Athletics"],
  exams: [
    { level: "GCE A/L", year: "2022", results: [["Chemistry", "A"], ["English", "A"], ["Physics", "B"], ["Combined Mathematics", "B"]] },
    { level: "GCE O/L", year: "2018", results: [["English Language", "A"], ["Mathematics", "A"], ["Science", "A"], ["Business and Accounting Studies", "A"], ["ICT", "A"], ["Sinhala", "A"], ["History", "A"], ["Western Music", "A"], ["Roman Catholicism", "A"]], note: "Nine As." },
  ],
  photo: {
    src: "/images/mag/head-prefect.webp",
    alt: "Rachel as Head Prefect in the green St. Bridget's Convent blazer, wearing the Head Prefect badge",
    credit: "Photo: Media Services photofile (Sanjaya de Silva), LMD",
  },
};

// The Ask agent's quick questions: short, recruiter-ready answers built only
// from facts published elsewhere in this file.
export const askFaqs = [
  {
    q: "Who is Rachel?",
    a: "Rachel Cooray is an Analyst, Data and AI at OCTAVE, John Keells Holdings, in Colombo. She has a First Class BSc in Computer Science from the University of Westminster, published research at IEEE ICAHS 2025, and co-founded Layer1 Studio.",
    href: "/",
    label: "the cover",
    keywords: ["who", "introduce", "herself", "overview"],
  },
  {
    q: "What's her education?",
    a: "BSc (Hons) Computer Science with First Class Honours from the University of Westminster, 2022 to 2025, with a Data Science specialisation. She also holds the CIMA Certificate in Business Accounting, and was Head Prefect at St. Bridget's Convent, Colombo.",
    href: "/education",
    label: "Education",
    keywords: ["education", "edu", "degree", "university", "study", "studied", "qualification", "school", "background"],
  },
  {
    q: "What's her experience?",
    a: "Analyst, Data and AI at OCTAVE, John Keells Holdings, promoted from intern to associate to analyst. She is also Co-founder and Developer at Layer1 Studio, and has data engineering experience from London Success Academy.",
    href: "/experience",
    label: "Experience",
    keywords: ["experience", "exp", "work", "job", "career", "roles", "employment", "worked"],
  },
  {
    q: "What's her research?",
    a: "PCOS Care, a machine learning web app for early PCOS risk screening, published at IEEE ICAHS 2025 in Tunisia. It placed third at Westminster's final year project showcase, and an extended paper is under review for the MSIT Journal.",
    href: "/research",
    label: "Research",
    keywords: ["research", "paper", "publication", "published", "ieee", "academic"],
  },
  {
    q: "What's PCOS Care?",
    a: "An early screening web app with two levels of prediction: one from everyday signs anyone can answer, and one that adds hormone test results. It shows which factors drove each prediction, and is a screening aid, not a diagnostic tool.",
    href: "/research",
    label: "Research",
    keywords: ["pcos", "pcos care", "polycystic", "app", "screening"],
  },
  {
    q: "What does she do at OCTAVE?",
    a: "She owns six AI and analytics use cases across the FMCG value chain, from production planning and dispatch to distributor replenishment, margins and weather. She takes each one from analysis and solution design through to the business using it.",
    href: "/use-cases",
    label: "Use cases",
    keywords: ["octave", "john keells", "jkh", "use cases", "analyst", "fmcg"],
  },
];

// Answers the Ask agent gives to common typed questions. Not shown as
// buttons. Same rule: facts from this file only, written short.
export const askMore = [
  {
    q: "School exams",
    a: "Yes, at St. Bridget's Convent, Colombo. GCE A/L 2022: Chemistry A, English A, Physics B, Combined Mathematics B. GCE O/L 2018: nine As, in English Language, Mathematics, Science, Business and Accounting Studies, ICT, Sinhala, History, Western Music and Roman Catholicism.",
    href: "/education",
    label: "Education",
    keywords: ["ol", "ols", "al", "als", "o l", "a l", "o level", "o levels", "a level", "a levels", "alevels", "olevels", "gce", "exam", "exams", "results", "grades", "school results"],
  },
  {
    q: "How does this agent work?",
    a: "It does not use a language model. It searches Rachel's published pages and quotes them, so it never invents anything, and nothing you type is stored. When a question needs Rachel herself, it passes your request to her.",
    href: "/ask",
    label: "Ask",
    keywords: ["ai model", "what model", "which model", "language model", "llm", "gpt", "chatgpt", "claude", "openai", "how does this work", "how do you work", "are you a bot", "are you ai", "are you real", "who built you", "what are you"],
  },
  {
    q: "Layer1 Studio",
    a: "Layer1 Studio is a web and mobile development venture Rachel co-founded in December 2025. She builds websites and apps for small businesses, from shaping the brief to shipping and maintaining them, and mentors interns on real client projects.",
    href: "/projects",
    label: "Projects",
    keywords: ["layer1", "layer", "studio", "venture", "startup", "founder", "founded", "freelance", "websites", "web dev", "web development", "side business", "company"],
  },
  {
    q: "Current role",
    a: "Analyst, Data and AI at OCTAVE, John Keells Holdings, since July 2026, after moving from intern to associate to analyst. She owns six AI and analytics use cases across the FMCG value chain.",
    href: "/experience",
    label: "Experience",
    keywords: ["current", "currently", "role", "title", "position", "now", "today", "employer", "works"],
  },
  {
    q: "Skills",
    a: "Python, SQL, PySpark, Databricks and Delta Lake at work; machine learning, statistics and model evaluation in research; Power BI for reporting; and React, Node.js and Flutter for products.",
    href: "/skills",
    label: "Skills",
    keywords: ["skills", "skill", "tools", "technologies", "technical", "tech stack", "programming", "languages", "coding"],
  },
  {
    q: "Awards",
    a: "Third place at the University of Westminster final year project showcase 2025 for PCOS Care, a Microsoft EMBRACE hackathon final, a UOW/IIT scholarship, and School Prefect of the Year at the New Generation Awards 2020.",
    href: "/achievements",
    label: "Achievements",
    keywords: ["award", "awards", "prize", "prizes", "won", "achievement", "achievements", "recognition", "honours"],
  },
  {
    q: "Leadership",
    a: "Leadership runs through her record: Head Prefect of St. Bridget's Convent and School Prefect of the Year in 2020. At work she owns six use cases from analysis to adoption, co-founded Layer1 Studio and mentors its interns.",
    href: "/education",
    label: "Education",
    keywords: ["leader", "leadership", "lead", "manage", "management", "mentor", "prefect", "captain"],
  },
  {
    q: "Location",
    a: "She's based in Colombo, Sri Lanka, and studied and worked in London.",
    href: "#contact",
    label: "Contact",
    keywords: ["based", "location", "located", "live", "lives", "country", "city", "relocate"],
  },
  {
    q: "Why hire her",
    a: "She connects data, AI and the business: she owns use cases from analysis through to adoption, has published machine learning research, and ships real products. Add a First Class degree, CIMA business training and a record of leadership since school.",
    href: "/use-cases",
    label: "Use cases",
    keywords: ["hire", "hiring", "strength", "strengths", "good fit", "stand out", "recruit", "recommend", "why should"],
  },
];

// The Skills word cloud. Weight 5 = used at work at OCTAVE now, 4 = core
// method or language, 3 = research and builds, 2 = projects, 1 = explored.
// Ranked by evidence on this site, not by self-rating.
export const skillCloud: { name: string; weight: 1 | 2 | 3 | 4 | 5; group: "think" | "data" | "ai" | "insight" | "product" | "delivery" }[] = [
  { name: "Python", weight: 5, group: "data" },
  { name: "SQL", weight: 5, group: "data" },
  { name: "PySpark", weight: 5, group: "data" },
  { name: "Databricks", weight: 5, group: "data" },
  { name: "Problem solving", weight: 5, group: "think" },
  { name: "Stakeholder management", weight: 5, group: "delivery" },
  { name: "Power BI", weight: 4, group: "insight" },
  { name: "Excel", weight: 4, group: "insight" },
  { name: "Delta Lake", weight: 4, group: "data" },
  { name: "Requirements", weight: 4, group: "delivery" },
  { name: "Problem statements", weight: 4, group: "think" },
  { name: "Process mapping", weight: 4, group: "think" },
  { name: "Measurement design", weight: 4, group: "think" },
  { name: "Machine learning", weight: 4, group: "ai" },
  { name: "Model evaluation", weight: 3, group: "ai" },
  { name: "Decision logs", weight: 3, group: "think" },
  { name: "Presentations", weight: 3, group: "delivery" },
  { name: "Agile", weight: 3, group: "delivery" },
  { name: "Statistics", weight: 3, group: "ai" },
  { name: "ETL", weight: 3, group: "data" },
  { name: "GCP", weight: 3, group: "data" },
  { name: "KPI development", weight: 3, group: "insight" },
  { name: "GenAI", weight: 3, group: "ai" },
  { name: "React", weight: 3, group: "product" },
  { name: "Flutter", weight: 3, group: "product" },
  { name: "Retrieval and ranking", weight: 2, group: "ai" },
  { name: "Explainable predictions", weight: 2, group: "ai" },
  { name: "Node.js", weight: 2, group: "product" },
  { name: "TypeScript", weight: 2, group: "product" },
  { name: "Next.js", weight: 2, group: "product" },
  { name: "JavaScript", weight: 2, group: "product" },
  { name: "Dart", weight: 2, group: "product" },
  { name: "Git and GitHub", weight: 2, group: "product" },
  { name: "PMO", weight: 2, group: "delivery" },
  { name: "scikit-learn", weight: 1, group: "ai" },
  { name: "pandas", weight: 1, group: "ai" },
  { name: "RAG pipelines", weight: 1, group: "ai" },
];

// AI competencies, each backed by work published on this site.
export const aiCompetencies = [
  { title: "Building and evaluating models", body: "PCOS Care: Chi-Square and ANOVA feature selection, SMOTE for class balance, and an enhanced Random Forest, published at IEEE ICAHS 2025." },
  { title: "Explainable predictions", body: "PCOS Care shows which factors drove each prediction, so a person can understand the result, not just read it." },
  { title: "Applied AI in a business", body: "At OCTAVE I own six AI and analytics use cases, from the analysis and solution design to the business using them." },
  { title: "Measuring whether AI works", body: "Pilot and control comparisons where possible, separating association from proven impact." },
  { title: "Retrieval and agents", body: "The Ask me agent on this site retrieves and ranks published passages, and never invents an answer." },
  { title: "Generative AI prototyping", body: "A chatbot prototype for people newly diagnosed with neurodiverse conditions, Microsoft EMBRACE hackathon finalist." },
  { title: "Responsible AI", body: "Screening aids, not diagnoses; quoted sources, not generated claims; confidential data kept out." },
];

// Speaking. Insights are drawn from Rachel's own speech notes for the panel.
export const talks = [
  {
    id: "talk-csw65",
    title: "Impact of COVID-19 on Girls",
    event: "CSW65 panel event, led by and for girls",
    org: "Good Shepherd Asia Pacific, during the 65th session of the UN Commission on the Status of Women",
    date: "March 2021",
    role: "Panellist representing Sri Lanka, alongside girls from Myanmar, Indonesia, the Philippines and India.",
    link: "https://www.youtube.com/watch?v=0nycsR3NRJ0&t=5171s",
    image: "/images/mag/csw65.webp",
    imageAlt: "Rachel speaking on the CSW65 girls' panel over Zoom, labelled Rachel Cooray, Sri Lanka",
    insights: [
      "Online lessons kept learning going, but losing everyday contact with classmates was the hardest part.",
      "Access was uneven: power cuts and dropped connections meant missed lessons, and not every girl had the support at home that I had.",
      "The pandemic hit some families far harder, with lost jobs forcing school changes and a rise in domestic violence at home.",
      "Some children missed lessons because their parents did not trust online learning, so change has to include families too.",
    ],
    quote: "I am hopeful for a better tomorrow, a tomorrow that is free of sickness, free of loneliness.",
  },
];
