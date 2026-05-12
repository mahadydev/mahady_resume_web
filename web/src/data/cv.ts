export interface Experience {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  scope: string;
  bullets: string[];
  stack: string[];
}

export interface Project {
  name: string;
  tag: string;
  blurb: string;
  metrics: { k: string; v: string }[];
  stack: string[];
  tone: "mint" | "violet" | "amber" | "rose";
}

export interface Award {
  title: string;
  sub: string;
  detail: string;
  year: string;
}

export interface Stat {
  label: string;
  value: string;
  suffix: string;
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  years: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface CV {
  name: string;
  firstName: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  links: { linkedin: string; github: string; site: string };
  summary: string;
  shortBio: string;
  core: string[];
  stats: Stat[];
  experience: Experience[];
  projects: Project[];
  skills: Record<string, string[]>;
  awards: Award[];
  education: Education;
  languages: Language[];
}

export const cv: CV = {
  name: "MD Mahady Hasan",
  firstName: "Mahady",
  title: "Senior Software Engineer",
  subtitle: "Cross-Platform · Flutter Architect",
  location: "Dhaka, Bangladesh",
  email: "mahadydev@gmail.com",
  phone: "+8801722232304",
  links: {
    linkedin: "linkedin.com/in/mahadydev",
    github: "github.com/mahadydev",
    site: "mahadydev.vercel.app",
  },
  summary:
    "Senior Mobile Engineer (Flutter) with 8+ years building cross-platform applications for 1M+ users. Led engineering teams of 5–12 delivering 10× client revenue growth and cutting deployment time by 60% through CI/CD automation and modular architectures.",
  shortBio:
    "I architect Flutter apps that ship. 8+ years, 1M+ users, 200+ clients, and a few quiet 3am production fires later — I still love the platform.",
  core: [
    "Flutter",
    "Dart",
    "Clean Architecture",
    "BLoC",
    "CI/CD",
    "AWS",
    "GraphQL",
    "Firebase",
    "Performance",
    "TDD",
  ],
  stats: [
    { label: "Years building mobile", value: "8+", suffix: "yrs" },
    { label: "Users served across apps", value: "1M+", suffix: "users" },
    { label: "Institutions on Ezycourse", value: "200+", suffix: "clients" },
    { label: "Test coverage achieved", value: "95", suffix: "%" },
    { label: "Deployment time cut", value: "60", suffix: "%" },
    { label: "Team led, peak size", value: "12", suffix: "people" },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Appifylab LLC",
      location: "Dhaka, Bangladesh",
      start: "May 2025",
      end: "Present",
      scope: "Architecture ownership · CI/CD · Product collaboration",
      bullets: [
        "Built Ezycourse LMS using Clean Architecture and BLoC, scaling to 200+ institutions and 1M+ enrollments with 99.9% uptime.",
        "Engineered white-label deployment pipeline reducing time-to-market by 75% for 200+ clients with zero-code customization.",
        "Delivered CI/CD pipeline with automated testing (unit, widget, integration) achieving 90%+ coverage; cut deployment time 60%.",
        "Optimized app performance: reduced load times 40% and memory usage 30% through lazy loading and state-management refactoring.",
        "Built modular App Builder using dependency injection and SOLID principles for non-technical users.",
      ],
      stack: [
        "Flutter",
        "Dart",
        "Clean Arch",
        "BLoC",
        "GetIt",
        "REST",
        "OAuth 2.0",
        "AWS",
        "Firebase",
        "CI/CD",
      ],
    },
    {
      role: "Senior Software Engineer",
      company: "Meta Design Solutions",
      location: "Dhaka, Bangladesh",
      start: "Jun 2022",
      end: "Oct 2024",
      scope: "Team of 5+ · Mentored juniors · Architecture decisions",
      bullets: [
        "Designed enterprise-grade apps using Clean Architecture, Domain-Driven Design, and BLoC with clear layer separation.",
        "Developed GraphQL APIs via AWS AppSync, reducing data transfer 50% and response time 35%.",
        "Scaled cloud-native infrastructure on AWS (AppSync, Amplify, Lambda, S3) and Firebase for real-time capabilities.",
        "Established code review standards and mentored 5 junior developers on architectural best practices.",
        "Integrated Amazon Pinpoint and Google Analytics with custom event tracking for data-driven decisions.",
      ],
      stack: [
        "Flutter",
        "Clean Arch",
        "BLoC",
        "DDD",
        "AWS AppSync",
        "GraphQL",
        "RxDart",
        "Firebase",
      ],
    },
    {
      role: "Senior Software Engineer — Team Lead",
      company: "Pridesys IT Limited",
      location: "Dhaka, Bangladesh",
      start: "Aug 2021",
      end: "Jun 2022",
      scope: "Led 5-person mobile team · Hiring · Sprint ownership",
      bullets: [
        "Led 5-person team building BASIS National ICT Award 2022 champion app serving the expatriate community.",
        "Architected full-stack solution: Flutter (Clean Architecture + BLoC) frontend with Java Spring Boot microservices.",
        "Drove testing strategy achieving 95%+ coverage using TDD across unit, widget, and integration tests.",
        "Established Agile practices (standups, sprint planning, retros), improving team velocity by 40%.",
      ],
      stack: ["Flutter", "Clean Arch", "BLoC", "Spring Boot", "REST", "MongoDB", "MySQL", "Oracle"],
    },
    {
      role: "Mobile Application Developer",
      company: "Infobiz Soft Ltd",
      location: "Dhaka, Bangladesh",
      start: "Jun 2019",
      end: "Aug 2021",
      scope: "Production app shipping · Payments · Offline-first",
      bullets: [
        "Delivered 15+ production apps (e-commerce, ride-sharing, booking) with secure payment gateways and PCI-DSS compliance.",
        "Built real-time features using Firebase Firestore with offline-first architecture and conflict resolution.",
        "Reduced development time 30% through modular architecture; optimized bundle sizes 40% via code splitting.",
      ],
      stack: ["Flutter", "BLoC", "Provider", "Firebase", "Payment SDKs", "REST"],
    },
    {
      role: "Web Developer",
      company: "Creative IT",
      location: "Dhaka, Bangladesh",
      start: "Sep 2017",
      end: "Dec 2018",
      scope: "Where it all started",
      bullets: [
        "Developed responsive web applications (HTML5, CSS3, JavaScript, jQuery, Bootstrap); improved site performance 50%.",
      ],
      stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "Bootstrap", "WordPress"],
    },
  ],
  projects: [
    {
      name: "Ezycourse",
      tag: "LMS Platform",
      blurb:
        "Scalable LMS for 200+ institutions, 1M+ enrollments. White-labeled apps with smart upsell — 10× client revenue.",
      metrics: [
        { k: "Institutions", v: "200+" },
        { k: "Enrollments", v: "1M+" },
        { k: "Revenue lift", v: "10×" },
      ],
      stack: ["Flutter", "BLoC", "AWS"],
      tone: "mint",
    },
    {
      name: "Sheba.xyz",
      tag: "Service Marketplace",
      blurb:
        "Bangladesh's largest service marketplace. 1M+ users, 10K+ daily transactions, multi-payment integration.",
      metrics: [
        { k: "Users", v: "1M+" },
        { k: "Daily txns", v: "10K+" },
        { k: "Payments", v: "Multi" },
      ],
      stack: ["Flutter", "Clean Arch"],
      tone: "violet",
    },
    {
      name: "Park Education",
      tag: "Bilingual Learning",
      blurb:
        "Bilingual education app with 50K+ active learners, interactive e-books, vocabulary tracking.",
      metrics: [
        { k: "Active learners", v: "50K+" },
        { k: "Languages", v: "2" },
        { k: "Format", v: "e-books" },
      ],
      stack: ["Flutter", "BLoC"],
      tone: "amber",
    },
    {
      name: "Probash Bondhu",
      tag: "Fintech · Award winner",
      blurb:
        "Fintech app for Bangladeshi expatriates. Won BASIS National ICT Award 2022 (Inclusions & Community Service).",
      metrics: [
        { k: "Award", v: "Champion" },
        { k: "Year", v: "2022" },
        { k: "Category", v: "Inclusion" },
      ],
      stack: ["Flutter", "Spring Boot"],
      tone: "rose",
    },
  ],
  skills: {
    "Languages & Frameworks": [
      "Dart",
      "Flutter",
      "Java",
      "Kotlin",
      "Swift",
      "JavaScript",
      "HTML5/CSS3",
      "C++",
    ],
    Architecture: [
      "Clean Architecture",
      "BLoC",
      "SOLID",
      "DDD",
      "MVVM",
      "Repository Pattern",
      "DI",
    ],
    "State Management": ["BLoC (Expert)", "Provider", "GetX", "Riverpod", "Redux"],
    "Backend & APIs": ["REST", "GraphQL", "WebSocket", "OAuth 2.0", "JWT", "Spring Boot"],
    "Cloud & DevOps": [
      "AWS Amplify",
      "AppSync",
      "Lambda",
      "S3",
      "Firebase",
      "Docker",
      "Fastlane",
      "GitHub Actions",
    ],
    Databases: ["MongoDB", "MySQL", "Oracle", "Firestore", "SQLite"],
    "Testing & Quality": [
      "Unit",
      "Widget",
      "Integration",
      "TDD",
      "Performance Profiling",
      "Sentry",
    ],
    Leadership: ["Roadmap", "Stakeholders", "Hiring", "Mentorship", "Agile/Scrum"],
  },
  awards: [
    {
      title: "BASIS National ICT Award 2022",
      sub: "Champion",
      detail:
        "Probash Bondhu App — Fintech for expatriates. Category: Inclusions and Community Service.",
      year: "2022",
    },
    {
      title: "The Daily Star ICT Solution Provider of the Year",
      sub: "Team Recognition",
      detail: "Recognized for innovative ICT solutions and technical excellence.",
      year: "2021",
    },
  ],
  education: {
    degree: "BSc in Computer Science and Engineering",
    school: "Daffodil International University",
    location: "Dhaka, Bangladesh",
    years: "2013 – 2017",
  },
  languages: [
    { name: "Bangla", level: "Native" },
    { name: "English", level: "Professional working" },
  ],
};
