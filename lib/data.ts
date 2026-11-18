// ─── Portfolio content ── edit this file to update the site ─────────────────

export const PROFILE = {
  name: "B. Sai Santosh Kumar",
  displayName: "SANTOSH BARIGEDI",
  roles: [
    "Full-Stack Vibe Developer",
    "Problem-Solving Builder",
    "No Code Developer",
    "Website Tester",
    "UI/UX Tester",
    "Video Editing",
  ],
  tagline: ["Full-Stack Web", "ServiceNow", "Cyber Security"],
  summary:
    "CSE (Cyber Security) student at MVGR College of Engineering, building production-grade web apps, ServiceNow scoped applications, and API security tools. Available for internships and junior engineering roles.",
  email: "barigedisaisantoshkumar@gmail.com",
  instagram: "https://www.instagram.com/sai_santosh_13/",
  linkedin: "https://www.linkedin.com/in/santosh-barigedi/",
  github: "https://github.com/barigedisaisantoshkumar-ctrl/",
  liveSite: "https://santoshbuilds.vercel.app/",
};

export interface EducationItem {
  degree: string;
  institute: string;
  period: string;
  score?: string;
  description?: string;
  icon?: string;
}

export const EDUCATION_LIST: EducationItem[] = [
  {
    degree: "B.Tech — CSE (Cyber Security)",
    institute: "MVGR College of Engineering, Vizianagaram",
    period: "2023 – Present",
    score: "CGPA: 6.92 / 10.0",
    icon: "🎓",
  },
  {
    degree: "Intermediate (MPC)",
    institute: "Narayana Junior College",
    period: "Apr 2020 – Mar 2022",
    description:
      "Rigorous focus on Mathematics, Physics, and Chemistry, laying solid analytical and mathematical problem-solving fundamentals.",
    icon: "📖",
  },
  {
    degree: "Secondary Schooling",
    institute: "Narayana Olympiad School",
    period: "June 2016 – Feb 2020",
    description:
      "Built strong academic foundations and logical thinking throughout standard 6th to 10th grade schooling.",
    icon: "🏫",
  },
];

export const EDUCATION = EDUCATION_LIST[0];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Web & Frameworks",   items: ["HTML · CSS · JavaScript", "React · Node.js · Express", "REST APIs · JWT Auth", "Responsive Design"] },
  { group: "Databases",          items: ["PostgreSQL · SQLite", "Supabase (Auth, Storage, Edge Functions)", "SQL · Schema Design"] },
  { group: "ServiceNow",         items: ["Scoped Apps · Tables · ACLs", "UI Policies · Record Producers", "Service Portal · Widgets"] },
  { group: "Security & Network", items: ["API Security Testing", "CCNA · TCP/IP · Routing", "Cyber Security Fundamentals"] },
  { group: "Languages & CS",     items: ["Python · JavaScript", "Data Structures & Algorithms", "OOP · DBMS"] },
  { group: "Tools & Practices",  items: ["Git · GitHub · CI/CD", "OpenAPI / Swagger", "Functional Testing · Code Review"] },
];

export const EXPERIENCE: {
  role: string; company: string; remote?: boolean;
  period: string; bullets: string[]; tags: string[];
}[] = [
  {
    role: "SDE Intern", company: "HPS", period: "Jul 2026 – Aug 2026",
    bullets: [
      "Contributed to feature development and debugging across application modules as part of a software team.",
      "Resolved reported issues using structured troubleshooting and root-cause analysis.",
      "Used Git/GitHub for version control; collaborated with the team to test, review, and document changes before release.",
    ],
    tags: ["Git", "Debugging", "Code Review"],
  },
  {
    role: "Web Development & Testing Specialist", company: "Netmaxin Group", remote: true,
    period: "Aug 2024 – Mar 2026",
    bullets: [
      "Developed and maintained web applications, testing features and workflows across modules.",
      "Diagnosed and debugged application defects; verified fixes before release for stable, reliable deployments.",
      "Documented bugs in structured, ticket-style reports with clear reproduction steps and results.",
      "Collaborated with design, development, and QA teams to resolve issues and deliver fixes on time.",
    ],
    tags: ["HTML/CSS/JS", "QA Testing", "Bug Documentation", "Collaboration"],
  },
];

export const ACHIEVEMENTS: { icon: string; text: string }[] = [
  { icon: "🏆", text: "KPMG Hackathon — Shortlisted Top 50 teams across India" },
  { icon: "🥇", text: "1st Prize — Cybersecurity Workshop 2025 (Network Diagnostics)" },
  { icon: "🎖️", text: "ServiceNow CSA & CSD Certified" },
  { icon: "📡",  text: "CCNA Certified — Cisco Networking" },
];

export const PROJECTS: {
  number: string; title: string; year: string;
  description: string; tags: string[]; github: string; live?: string;
}[] = [
  {
    number: "01", title: "AI Interview Coach", year: "2026",
    description: "Full-stack mock interview platform with JWT authentication and instant, structured AI feedback. Covers scoring logic, session management, and data flow validation.",
    tags: ["React", "Node.js/Express", "SQLite/PostgreSQL", "JWT"],
    github: "https://github.com/barigedisaisantoshkumar-ctrl/",
  },
  {
    number: "02", title: "CertiFlow", year: "2026",
    description: "Certificate generation & verification platform that automates issuance with QR-code-based authenticity verification and PostgreSQL-backed duplicate detection.",
    tags: ["React", "Supabase", "PostgreSQL", "Edge Functions"],
    github: "https://github.com/barigedisaisantoshkumar-ctrl/",
  },
  {
    number: "03", title: "A³-Agent", year: "2026",
    description: "Autonomous API Attacker Agent that parses OpenAPI specs into an API graph, generates edge-case test requests, and produces severity-rated reports for auth bypass and invalid state transitions.",
    tags: ["OpenAPI/Swagger", "REST APIs", "API Security"],
    github: "https://github.com/barigedisaisantoshkumar-ctrl/",
  },
  {
    number: "04", title: "Employee Raise Issue", year: "2026",
    description: "ServiceNow scoped application with a custom request table, role-based access control, and dynamic form validation. Includes a Service Portal widget for real-time request tracking.",
    tags: ["ServiceNow", "Scoped App", "ACLs", "UI Policies"],
    github: "https://github.com/barigedisaisantoshkumar-ctrl/",
  },
  {
    number: "05", title: "SathyaBhoomi", year: "2025",
    description: "Mobile-friendly smart land measurement tool that lets farmers measure land area on-site using GPS and interactive maps. Field-tested for accuracy and reliability.",
    tags: ["React", "GPS API", "Interactive Mapping"],
    github: "https://github.com/barigedisaisantoshkumar-ctrl/",
  },
];

export type CertCategory = "networking" | "security" | "cloud" | "dev";

export const CERTIFICATES: {
  issuer: string; name: string; category: CertCategory; file: string;
}[] = [
  { issuer: "Cisco Networking Academy", name: "CCNA: Introduction to Networks",                       category: "networking", file: "CCNA-_Introduction_to_Networks.pdf" },
  { issuer: "Cisco Networking Academy", name: "CCNA: Switching, Routing & Wireless Essentials",       category: "networking", file: "CCNA-_Switching-_Routing-_and_Wireless_Essentials.pdf" },
  { issuer: "Cisco Networking Academy", name: "CCNA: Enterprise Networking, Security & Automation",   category: "networking", file: "CCNA-_Enterprise_Networking-_Security-_and_Automation.pdf" },
  { issuer: "Cisco Networking Academy", name: "Getting Started with Cisco Packet Tracer",             category: "networking", file: "Getting_Started_with_Cisco_Packet_Tracer.pdf" },
  { issuer: "Cisco Networking Academy", name: "Exploring Networking with Cisco Packet Tracer",        category: "networking", file: "Exploring_Networking_with_Cisco_Packet_Tracer.pdf" },
  { issuer: "Cisco Networking Academy", name: "Introduction to Cybersecurity",                        category: "security",   file: "Introduction_to_Cybersecurity.pdf" },
  { issuer: "Cisco Networking Academy", name: "Junior Cybersecurity Analyst Career Path",             category: "security",   file: "Junior_Cybersecurity_Analyst_Career_Path.pdf" },
  { issuer: "Cybersecurity Workshop",   name: "1st Prize — Network Diagnostics & Problem Solving",   category: "security",   file: "B.SAI SANTOSH KUMAR.pdf" },
  { issuer: "AWS Academy",              name: "AWS Academy Graduate — Cloud Foundations",             category: "cloud",      file: "AWS_Academy_Graduate_AWS_Academy_Cloud_Foundations.pdf" },
  { issuer: "AWS Academy",              name: "AWS Academy Graduate — Machine Learning Foundations",  category: "cloud",      file: "AWS_Academy_Graduate_Machine_Learning_Foundations_Training_Badge.pdf" },
  { issuer: "Data Analytics",           name: "Data Analytics",                                       category: "cloud",      file: "Data Analytics.pdf" },
  { issuer: "Cisco Networking Academy", name: "Introduction to Data Science",                         category: "cloud",      file: "Introduction_to_Data_Science.pdf" },
  { issuer: "Infosys",                  name: "Power BI",                                             category: "cloud",      file: "infosys- power BI.pdf" },
  { issuer: "Cisco Networking Academy", name: "Python Essentials 1",                                  category: "dev",        file: "Python_Essentials_1.pdf" },
  { issuer: "Cisco Networking Academy", name: "Python Essentials 2",                                  category: "dev",        file: "Python_Essentials_2.pdf" },
  { issuer: "ReactJS",                  name: "ReactJS",                                              category: "dev",        file: "ReactJS.pdf" },
  { issuer: "Cisco Networking Academy", name: "Introduction to Modern AI",                            category: "dev",        file: "Introduction_to_Modern_AI.pdf" },
  { issuer: "Apply AI",                 name: "Apply AI: Analyze Customer Reviews",                   category: "dev",        file: "Apply_AI-_Analyze_Customer_Reviews.pdf" },
];

export const CERT_CATEGORIES: { key: CertCategory | "all"; label: string }[] = [
  { key: "all",        label: "All" },
  { key: "networking", label: "Networking" },
  { key: "security",   label: "Security" },
  { key: "cloud",      label: "Cloud & Data" },
  { key: "dev",        label: "Dev & AI" },
];
