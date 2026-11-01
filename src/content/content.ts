/**
 * Single source of truth for everything the site says: the page, the
 * case-study pages, the badge index, the Ask command bar and the CV.
 *
 * Rules for this file (from Rachel's brief, 1 Nov 2026):
 * - No invented or unverifiable performance figures about her work.
 * - No client names, no counts of Layer1 clients or projects.
 * - No stat strips or counters anywhere.
 * - OCTAVE work is described in words. Rachel "owns" use cases.
 * - No fiction or novel mentions. No scholarship mentions.
 * - "CIMA" appears only as a qualification under Education.
 * - No em dashes.
 * Anything missing stays missing. Do not fill gaps with specifics.
 */

export type SectionId =
  | "work"
  | "research"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "teaching"
  | "volunteer"
  | "perspective"
  | "achievements"
  | "news"
  | "ask"
  | "contact";

export type Section = { id: SectionId; label: string; number: string; hint: string };

// The badge index, the persistent nav and the Ask command bar all read
// this list, so the order here is the order everywhere.
export const sections: Section[] = [
  { id: "work", label: "Selected work", number: "01", hint: "OCTAVE, PCOS Care, generative AI builds, Layer1" },
  { id: "research", label: "Research", number: "02", hint: "PCOS Care, IEEE ICAHS 2025" },
  { id: "education", label: "Education", number: "03", hint: "Westminster, CIMA, St. Bridget's" },
  { id: "experience", label: "Experience", number: "04", hint: "OCTAVE, Layer1 Studio, London Success Academy" },
  { id: "projects", label: "Projects", number: "05", hint: "Generative AI builds, apps and analytics" },
  { id: "skills", label: "Skills", number: "06", hint: "Tools and methods" },
  { id: "teaching", label: "Teaching", number: "07", hint: "Classroom and university support" },
  { id: "volunteer", label: "Volunteer", number: "08", hint: "John Keells Foundation, swimming" },
  { id: "perspective", label: "Perspective", number: "09", hint: "On decisions, not just predictions" },
  { id: "achievements", label: "Achievements", number: "10", hint: "Research prize, hackathon final, youth award" },
  { id: "news", label: "In the news", number: "11", hint: "Westminster, John Keells, Daily FT, LMD" },
  { id: "ask", label: "Ask about Rachel", number: "12", hint: "Search this page by question" },
  { id: "contact", label: "Contact", number: "13", hint: "Email, LinkedIn, GitHub, ORCID" },
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
    "Analyst, Data and AI at OCTAVE, the advanced analytics arm of John Keells Holdings. Published researcher, co-founder of Layer1 Studio, First Class Honours in Computer Science from the University of Westminster.",
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
    title: "Analytics that works in the field",
    body: "Four AI and analytics use cases on the distributor side of an FMCG business: margin incentives, replenishment, dispatch planning and distributor efficiency. The analysis has to be sound and the business has to use it.",
    href: "/case-studies/octave",
    linkLabel: "Read the case study",
    side: "right",
  },
  {
    id: "work-pcos",
    kicker: "Research, IEEE ICAHS 2025, Tunisia",
    title: "PCOS Care",
    body: "A machine learning web app for early risk screening of polycystic ovary syndrome, built so a clinician can see which factors drove each prediction. Third of more than 400 final year projects at Westminster.",
    href: "/case-studies/pcos-care",
    linkLabel: "Read the case study",
    side: "left",
  },
  {
    id: "work-genai",
    kicker: "Generative AI builds",
    title: "Grounded in the source, not improvised",
    body: "A finance education study assistant that answers only from its syllabus, a CV reviewer that reads like a senior recruiter, and a neurodiversity support chatbot that reached the final of a Microsoft hackathon.",
    href: "#projects",
    linkLabel: "See the projects",
    side: "right",
  },
  {
    id: "work-layer1",
    kicker: "Co-founder and Developer",
    title: "Layer1 Studio",
    body: "Web and mobile products for small businesses, from shaping a brief to shipping and maintaining it.",
    href: "/case-studies/layer1",
    linkLabel: "Read the case study",
    side: "left",
  },
];

// ---------------------------------------------------------------------
// RESEARCH
// ---------------------------------------------------------------------

export const research = {
  intro:
    "I research how machine learning can support decisions people can trust, starting in healthcare and now in commercial incentive design.",
  paper: {
    title:
      "PCOS Care: A Machine Learning-Based Web Application for Early Risk Prediction of Polycystic Ovary Syndrome",
    authors: "With Malarvizhi Kaniappan Chinnathai and Salma Chahed, University of Westminster",
    venue: "IEEE ICAHS 2025, Tunisia",
    year: "2025",
    doi: "10.1109/ICAHS66950.2025.11553077",
    doiUrl: "https://doi.org/10.1109/ICAHS66950.2025.11553077",
    appUrl: "https://pcos-care-web-app.onrender.com",
    description:
      "An early screening web app with two levels of prediction: one from lifestyle and physical signs that anyone can answer, and one that adds hormone test results. Features were chosen with clinical diagnostic criteria and statistical tests, so the model rests on signals a clinician would recognise. It is a risk screening aid, not a diagnostic tool.",
    award: "Third place of more than 400 final year research projects, University of Westminster, 2025.",
    journal:
      "An extended paper, \"A Machine Learning-Driven Framework for Early Risk Stratification of Polycystic Ovary Syndrome\", is under review for the MSIT Journal special edition.",
  },
  talksIntro: "Explaining technical work to the people who use it is part of the job.",
  talks: [
    "IEEE ICAHS 2025, Tunisia: presented PCOS Care to an international audience.",
    "University of Westminster Final Year Project Showcase, 2025: demonstrated PCOS Care to industry judges from Netcompany and SmartDCC.",
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
    summary: "Specialised in Data Science. Started at IIT Sri Lanka and completed the degree at Westminster.",
  },
  {
    id: "education-cima",
    title: "CIMA Certificate in Business Accounting",
    institution: "Chartered Institute of Management Accountants, United Kingdom",
    dateRange: "Aug 2024",
    summary: "Economics, management and financial accounting, business law and corporate governance.",
  },
  {
    id: "education-school",
    title: "St. Bridget's Convent, Colombo",
    institution: "A-Levels in Mathematics, Physics and Chemistry",
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
        "Own four AI and analytics use cases for an FMCG distributor network: margin incentives, replenishment, dispatch planning and distributor efficiency.",
        "Design how each use case is evaluated, join field governance calls, and help prepare answers and slides for leadership and finance.",
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
        "Segmented distributors by performance and potential and helped design KPI-based incentive structures for an FMCG distributor network.",
        "Ran margin and sales-incentive scenario analysis and built Power BI dashboards for management to track targets and distributor performance.",
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

export type Project = {
  id: string;
  title: string;
  role: string;
  description: string;
  tech: string[];
  link: string | null;
  image: string | null;
  imageAlt?: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: "project-pcos-care",
    title: "PCOS Care",
    role: "Lead developer and researcher",
    description:
      "Early PCOS risk screening that explains which factors drove each prediction. Built end to end in Python, Flask and Streamlit, deployed and user tested. Published at IEEE ICAHS 2025.",
    tech: ["Python", "Machine learning", "Flask", "Streamlit"],
    link: "https://pcos-care-web-app.onrender.com",
    image: "/images/pcoscare.png",
    imageAlt: "PCOS Care web app showing the risk screening form",
    featured: true,
  },
  {
    id: "project-study-assistant",
    title: "Finance education study assistant",
    role: "Full stack developer and AI engineer",
    description:
      "A study assistant for a professional finance qualification that answers only from the syllabus, using a custom retrieval pipeline on Gemini, with two study modes and subject locking.",
    tech: ["React", "Node.js", "Gemini API", "LangChain", "Tailwind CSS"],
    link: "https://cima-tutor-web.onrender.com",
    image: "/images/ai-tutor.png",
    imageAlt: "Study assistant chat interface with a syllabus subject selected",
    featured: true,
  },
  {
    id: "project-neurodiversity",
    title: "GenAI chatbot for neurodiversity support",
    role: "AI engineer, Microsoft EMBRACE hackathon finalist, 2024",
    description:
      "A chatbot prototype that guides people newly diagnosed with neurodiverse conditions, and their carers, through what comes next. Built with a small cross-functional team under hackathon time limits.",
    tech: ["Generative AI", "Conversational design", "Prototyping"],
    link: null,
    image: null,
    featured: true,
  },
  {
    id: "project-carbon-tracker",
    title: "Carbon Footprint Tracker",
    role: "Data analyst and UI designer",
    description:
      "Turns everyday activities into an estimated carbon footprint using activity-based emission factors, with interactive dashboards and suggestions for cutting it.",
    tech: ["Python", "Flutter", "Serverpod", "Data visualisation"],
    link: "https://rachelcooray.github.io/carbon-footprint-tracker/",
    image: "/images/carbonfootprint.png",
    imageAlt: "Carbon Footprint Tracker dashboard",
    featured: true,
  },
  {
    id: "project-cv-reviewer",
    title: "CV reviewer assistant",
    role: "Frontend developer and AI engineer",
    description: "Recruiter-style CV feedback from Gemini, with client-side PDF processing.",
    tech: ["React", "Gemini API"],
    link: "https://cv-writer.onrender.com",
    image: "/images/cv-writer.png",
    imageAlt: "CV reviewer assistant interface",
    featured: false,
  },
  {
    id: "project-futsal",
    title: "Futsal team recommender",
    role: "Mobile app developer",
    description:
      "A Flutter app that matches players to teams using collaborative and content-based filtering, with centralised stadium booking.",
    tech: ["Flutter", "Node", "Flask", "Machine learning"],
    link: null,
    image: "/images/futsal.png",
    imageAlt: "Futsal team recommender app screens",
    featured: false,
  },
  {
    id: "project-csr-street-vendors",
    title: "CSR street-vendor analytics",
    role: "Field researcher and analyst",
    description: "A field survey of street food vendors whose findings the CSR team adopted.",
    tech: ["Data collection", "Data analytics", "Field research"],
    link: null,
    image: "/images/street-vendor.png",
    imageAlt: "Street vendor survey analysis",
    featured: false,
  },
  {
    id: "project-fantasy-coin-collector",
    title: "Fantasy Coin Collector",
    role: "Game developer",
    description:
      "A 2D dungeon crawler built from scratch in HTML5 Canvas, with its own physics, procedural maps and sound.",
    tech: ["HTML5 Canvas", "JavaScript", "Web Audio API"],
    link: "https://rachelcooray.github.io/FantasyCoinCollector/",
    image: "/images/coin-collector.png",
    imageAlt: "Fantasy Coin Collector game screen",
    featured: false,
  },
];

// ---------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------

export const skills = [
  { category: "Analytics and AI", items: ["Machine learning", "Statistical testing", "Experiment and pilot design", "Retrieval-augmented generation", "LLM application design"] },
  { category: "Languages and libraries", items: ["Python", "SQL", "Pandas and NumPy", "Scikit-learn", "PySpark", "JavaScript and TypeScript", "Dart"] },
  { category: "Platforms and tools", items: ["Databricks", "Power BI", "Excel", "Google Cloud Platform", "Git and GitHub"] },
  { category: "Web and mobile", items: ["React and Next.js", "Node.js", "Flutter", "Flask"] },
  { category: "Working with the business", items: ["Problem statements and decision logs", "Pilot and control evaluation", "Presenting to leadership and finance", "Financial accounting"] },
];

// ---------------------------------------------------------------------
// TEACHING
// ---------------------------------------------------------------------

export const teaching = {
  intro:
    "The clearest way I know an idea is understood is being able to teach it. Whether that is adapting a lesson for a classroom of primary learners or walking a university student through a concept they missed in a lecture, teaching has shaped how I explain technical work now. I default to making the reasoning behind a result legible, not just the result itself.",
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
  swimming:
    "At the 2026 JKH Intercompany Swimming Meet I won three individual golds and gold in every relay in the under-25 group, as OCTAVE took the overall women's championship.",
  hobbies: ["Swimming", "Running", "Films and dramas", "History"],
  memberships: ["Rotaract Club", "IEEE Club", "Sri Lankan Society UoW", "CIMA Student Member", "BCS Member"],
};

// ---------------------------------------------------------------------
// PERSPECTIVE
// ---------------------------------------------------------------------

export const perspective = {
  title: "On decisions, not just predictions",
  paragraphs: [
    "Most of the applied AI work I have done shares one constraint: a model's output only matters if the person reading it can act on it. A risk score for PCOS is only useful if a clinician can see which factors drove it. A margin incentive model is only useful if the incentive it recommends is one a distributor team can actually run. A study assistant built on a retrieval pipeline is only useful if it stays inside the syllabus it is meant to teach, rather than answering fluently but wrong.",
    "That is the thread I keep pulling on: building analytics and AI systems that are transparent enough for the person on the other end to trust the decision, not just the number. In practice that has meant favouring interpretable feature selection over black-box performance gains, building dashboards around the specific decision someone needs to make rather than every metric available, and constraining generative systems to stay grounded in source material instead of improvising.",
    "It is also why teaching and data work do not feel like separate halves of what I do. Both are exercises in making something complex legible to someone who has to use it.",
  ],
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
    id: "achievement-pcos-prize",
    title: "Third place, Final Year Research Project",
    organization: "University of Westminster, judged with Netcompany and SmartDCC",
    year: "2025",
    summary: "For PCOS Care, out of more than 400 projects.",
  },
  {
    id: "achievement-embrace",
    title: "Hackathon finalist, GenAI for neurodiversity",
    organization: "Microsoft EMBRACE Employee Resource Group",
    year: "2024",
    summary: "A chatbot prototype to guide and support people newly diagnosed with neurodiverse conditions.",
  },
  {
    id: "achievement-new-generation",
    title: "New Generation Awards",
    organization: "Women in Management and the National Youth Services Council",
    year: "2020",
    summary: "For youth leadership.",
  },
];

export const press: Recognition[] = [
  {
    id: "press-westminster-showcase",
    title: "Celebrating Innovation at the Computer Science and Engineering Final Year Project Showcase",
    organization: "University of Westminster",
    year: "2025",
    summary: "Rachel and fellow students presenting healthcare and machine learning systems to industry panels.",
    link: "https://blog.westminster.ac.uk/wearewestminster/celebrating-innovation-at-the-computer-science-and-engineering-final-year-project-showcase/",
    image: "/images/netcompany-group-pic.jpg",
    imageAlt: "Students and judges at the Westminster final year project showcase",
  },
  {
    id: "press-westminster-prize",
    title: "Westminster Computer Science students receive prizes",
    organization: "University of Westminster",
    year: "2025",
    summary: "Research prizes awarded by industry sponsors Netcompany and SmartDCC for the 2025 cohort.",
    link: "https://www.westminster.ac.uk/news/westminster-computer-science-and-engineering-students-receive-prizes-from-netcompany-at-annual-final-year-project-showcase",
    image: "/images/blog.png",
    imageAlt: "University of Westminster news article",
  },
  {
    id: "press-jkh-swim",
    title: "Team OCTAVE wins the overall women's championship",
    organization: "John Keells Holdings",
    year: "2026",
    summary: "Three individual golds and gold in every relay in the under-25 group at the JKH Intercompany Swimming Meet.",
    link: "https://www.linkedin.com/company/john-keells-holdings/posts/",
    image: "/images/swimmingmeet.jpeg",
    imageAlt: "Team OCTAVE at the John Keells intercompany swimming meet",
  },
  {
    id: "press-daily-ft",
    title: "WIM and NYSC recognise youth",
    organization: "Daily FT",
    year: "2020",
    summary: "National coverage of the New Generation Awards for emerging young Sri Lankan women leaders.",
    link: "https://www.ft.lk/Front-Page/WIM-NYSC-recognise-youth-with-New-Generation-Awards/44-711214",
    image: "/images/daily-ft.png",
    imageAlt: "Daily FT front page article on the New Generation Awards",
  },
  {
    id: "press-lmd",
    title: "LMD Youth Forum interview",
    organization: "LMD",
    year: "2020",
    summary: "On student governance, school headship at St. Bridget's Convent, and community development.",
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
  intro:
    "I am always glad to talk about research collaborations, MSc opportunities, guest lectures, and AI or analytics problems worth solving.",
};

// ---------------------------------------------------------------------
// CASE STUDIES (/case-studies/[slug])
// ---------------------------------------------------------------------

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  context: string;
  problem: string;
  approach: string[];
  keyDecisions: string[];
  outcome: string[];
  learned: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "octave",
    title: "Distributor incentives a sales team can run",
    subtitle: "OCTAVE, John Keells Holdings",
    category: "Commercial analytics",
    context:
      "An FMCG distributor network in Sri Lanka where incentives rewarded delivery volume and gave management few levers on margin, replenishment or dispatch cost.",
    problem:
      "Some distributors were missing margin targets while carrying high delivery overhead, and the existing commission structure did not reward the behaviour the business wanted. Any new scheme had to be one a distributor team could calculate and follow in the field.",
    approach: [
      "Segmented distributors by performance and potential from order history, basket mix and local fulfilment constraints.",
      "Designed KPI-based incentive tiers tied to margin contribution and basket depth, and tested them against historical scenarios before anything reached a distributor.",
      "Built the replenishment, dispatch planning and distributor efficiency use cases alongside, so the four read as one programme rather than four spreadsheets.",
      "Designed how each use case is checked: pilot and control groups where possible, before and after where not, with operational measures first and margin second.",
    ],
    keyDecisions: [
      "Transparent, rule-based formulas over opaque scorecards, so field agents can work out their own incentive.",
      "Baselines calibrated to local seasonality, so a good month does not pay out as a behaviour change.",
      "Results without a control group are reported as an association, never as proven impact.",
    ],
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
    context:
      "Polycystic ovary syndrome is a common endocrine condition in women of reproductive age. Diagnosis is often delayed by overlapping symptoms and uneven access to specialist screening.",
    problem:
      "Published risk models tend to produce opaque scores without clinical interpretability, and models that need full hormone panels do not help community-level triage where those tests are not available.",
    approach: [
      "Worked from an anonymised public benchmark dataset of patient records from hospitals in Kerala, India.",
      "Selected features with Chi-Square tests for categorical indicators and ANOVA F-tests for numerical ones, keeping medically grounded signals.",
      "Addressed class imbalance with SMOTE and evaluated several classifiers under stratified cross-validation, favouring recall, since a missed case costs more than a false alarm.",
      "Built a two-tier web app in Python, Flask and Streamlit: tier one screens lifestyle and physical indicators anyone can provide, tier two adds hormone test results.",
      "Ran a structured usability study with real users.",
    ],
    keyDecisions: [
      "Recall over raw accuracy, because missing an at-risk person in early triage carries the higher clinical risk.",
      "Interpretable features over black-box architectures, so a clinician can inspect each contributing factor.",
      "Presented as a risk screening aid, not a diagnostic tool.",
    ],
    outcome: [
      "Published in the IEEE ICAHS 2025 proceedings, DOI 10.1109/ICAHS66950.2025.11553077, and presented in Tunisia.",
      "Third place of more than 400 final year research projects at the University of Westminster, 2025.",
      "An extended framework paper is under review for the MSIT Journal special edition.",
      "The app is deployed and open to try.",
    ],
    learned: "In clinical machine learning, transparency is not a finishing touch. It is the condition for anyone adopting the tool.",
  },
  {
    slug: "layer1",
    title: "A Layer1 Studio delivery",
    subtitle: "Layer1 Studio",
    category: "Product engineering for small businesses",
    context:
      "Small businesses usually arrive with an informal brief, a few spreadsheets and a process held together by messages and paper.",
    problem:
      "The job is to turn that into a product the owner can run without us: scoped tightly, shipped quickly, and maintained after launch.",
    approach: [
      "Shape the brief into a short architecture: a responsive web platform and, where the business needs it, a companion mobile app.",
      "Build the operational pieces first, such as sign-ups, bookings, payments and reminders, before any polish.",
      "Pair with interns on components and tests so the studio's work is reviewable, not one person's memory.",
    ],
    keyDecisions: [
      "A lightweight serverless stack and optimistic UI updates, so the product stays responsive on ordinary mobile networks.",
      "Automated reminders by WhatsApp and email ahead of renewals and bookings, since that is where small businesses lose customers.",
    ],
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
  add("work", "bio", "How she works", identity.bio, ["approach", "philosophy"]);
  selectedWork.forEach((w) => add("work", w.id, w.title, `${w.kicker}. ${w.body}`, ["work", "selected"]));

  add("research", "research-paper", research.paper.title, `${research.paper.venue}. ${research.paper.description} ${research.paper.award} ${research.paper.journal}`, ["pcos", "paper", "ieee", "publication", "published", "research", "doi", "journal", "msit"]);
  research.talks.forEach((t, i) => add("research", `talk-${i}`, "Talks", t, ["talk", "presented", "conference"]));

  education.forEach((e) => add("education", e.id, e.title, `${e.institution}, ${e.dateRange}. ${e.summary}`, ["education", "degree", "university", "school", "studied", "first class", "cima", "a-levels"]));

  add("experience", "octave-own", "OCTAVE: what she owns", octave.own, ["octave", "john keells", "fmcg", "distributor", "use case", "incentive", "replenishment", "dispatch", "job", "work", "current"]);
  add("experience", "octave-measuring", octave.measuring.title, octave.measuring.body, ["measure", "impact", "evaluate", "evaluation", "pilot", "control", "experiment", "association"]);
  octave.practice.forEach((x, i) => add("experience", `octave-practice-${i}`, x.title, x.body, ["octave", x.title.toLowerCase()]));
  add("experience", "octave-tools", "OCTAVE tools", `Tools: ${octave.tools.join(", ")}.`, ["tools", "databricks", "power bi", "excel"]);
  [...octave.roles, ...octave.earlier].forEach((r) => add("experience", r.id, `${r.title}, ${r.company}`, `${r.dateRange}, ${r.location}. ${r.details.join(" ")}`, ["octave", "role", "intern", "promotion", "dates"]));
  add("experience", layer1.id, `${layer1.title}, ${layer1.company}`, `${layer1.dateRange}, ${layer1.location}. ${layer1.description} Built for: ${layer1.builtFor.join(", ")}.`, ["layer1", "studio", "co-founder", "founder", "startup", "freelance", "clients"]);
  add("experience", londonSuccessAcademy.id, `${londonSuccessAcademy.title}, ${londonSuccessAcademy.company}`, `${londonSuccessAcademy.dateRange}, ${londonSuccessAcademy.location}. ${londonSuccessAcademy.details.join(" ")}`, ["data engineering", "etl", "gcp", "pyspark", "london"]);
  otherRoles.forEach((r) => add("experience", r.id, `${r.title}, ${r.company}`, `${r.dateRange}, ${r.location}. ${r.details.join(" ")}`, ["retail", "customer", "uk", "part-time"]));

  projects.forEach((pr) => add("projects", pr.id, pr.title, `${pr.role}. ${pr.description} Built with ${pr.tech.join(", ")}.`, ["project", "built", "app", "chatbot", "rag", "gemini", "hackathon"]));

  skills.forEach((s) => add("skills", `skills-${s.category}`, s.category, s.items.join(", "), ["skills", "tools", "stack", "languages", "python", "sql"]));

  add("teaching", "teaching-intro", "Why she teaches", teaching.intro, ["teaching", "teach", "lecture", "mentor"]);
  teaching.roles.forEach((t) => add("teaching", t.id, `${t.title}, ${t.institution}`, `${t.dateRange}. ${t.summary}`, ["teaching", "teacher", "support worker"]));

  add("volunteer", "volunteer-summary", "Volunteering", volunteer.summary, ["volunteer", "foundation", "community"]);
  add("volunteer", "swimming", "Swimming", volunteer.swimming, ["swim", "swimming", "sport", "gold", "championship"]);
  add("volunteer", "hobbies", "Outside work", volunteer.hobbies.join(", "), ["hobbies", "interests", "outside work"]);
  add("volunteer", "memberships", "Memberships", volunteer.memberships.join(", "), ["member", "membership", "club", "bcs", "ieee"]);

  add("perspective", "perspective", perspective.title, perspective.paragraphs.join(" "), ["perspective", "essay", "thinks", "opinion", "view", "ideas", "transparency", "trust"]);

  achievements.forEach((a) => add("achievements", a.id, a.title, `${a.organization}, ${a.year}. ${a.summary}`, ["award", "prize", "achievement", "won", "finalist"]));
  press.forEach((n) => add("news", n.id, n.title, `${n.organization}, ${n.year}. ${n.summary}`, ["news", "press", "article", "interview", "featured"]));

  add("contact", "contact", "Contact", `${contact.intro} Email ${identity.email}. LinkedIn, GitHub and ORCID links are in the Contact section. Based in ${identity.location}.`, ["contact", "email", "reach", "linkedin", "github", "orcid", "hire", "location", "where", "based"]);

  return p;
}
