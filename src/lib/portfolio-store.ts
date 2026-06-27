// ─── Portfolio Data Store ───────────────────────────────────────────────────
// All portfolio content lives here. The admin panel reads and writes to
// localStorage; the public portfolio reads from there (with defaults fallback).

export type Project = {
  id: string;
  title: string;
  status: string;
  category: string;
  tags: string[];
  description: string;
  stack: string[];
  demo?: string;
  github?: string;
};

export type EducationEntry = {
  id: string;
  degree: string;
  institute: string;
  location: string;
  period: string;
  note: string;
};

export type SkillCategory = {
  id: string;
  category: string;
  items: string[];
};

export type ProfileData = {
  name: string;
  tagline: string;
  bio1: string;
  bio2: string;
  location: string;
  domain: string;
  focus: string;
  email: string;
  linkedin: string;
  github: string;
  profileImageUrl: string;
  resumeUrl: string;
  typingWords: string[];
  availableForWork: boolean;
};

export type PortfolioData = {
  profile: ProfileData;
  projects: Project[];
  skills: SkillCategory[];
  education: EducationEntry[];
};

// ─── Default Data ────────────────────────────────────────────────────────────

export const DEFAULT_DATA: PortfolioData = {
  profile: {
    name: "Abhishek Rathod",
    tagline: "Hi, I'm",
    bio1: "I'm Abhishek Rathod, a Computer Science and Engineering student at RV University with a strong passion for software development and problem-solving. I specialize in Java, React.js, Node.js, JDBC and MySQL, with a growing interest in full-stack web development and modern software engineering practices.",
    bio2: "I love turning ideas into clean, performant products — from designing intuitive UIs to architecting reliable backends.",
    location: "Bengaluru, India",
    domain: "Software Development",
    focus: "Full Stack Web",
    email: "abhishekrathod59078@gmail.com",
    linkedin: "https://www.linkedin.com/in/abhishek-rathod-741a86333/",
    github: "https://github.com/rathod86",
    profileImageUrl:
      "https://www.image2url.com/r2/default/images/1782275156792-a633553d-d828-43b1-828f-d878b1d3f7ae.jpeg",
    resumeUrl: "#",
    typingWords: ["Developer", "Full Stack Developer", "Problem Solver"],
    availableForWork: true,
  },
  projects: [
    {
      id: "proj-1",
      title: "Agrislove — AI-Powered Agriculture Platform",
      status: "Completed",
      category: "Full Stack",
      tags: ["Full Stack", "AI"],
      description:
        "AI-powered agriculture platform assisting farmers with crop recommendations, disease detection, weather forecasting and market analysis through an intuitive interface.",
      stack: ["React.js", "JavaScript", "MySQL", "HTML", "CSS"],
      github: "https://github.com/rathod86/agrislove",
    },
  ],
  skills: [
    { id: "sk-1", category: "Frontend", items: ["React", "HTML", "CSS"] },
    { id: "sk-2", category: "Backend", items: ["Java", "Spring Boot", "Node.js"] },
    { id: "sk-3", category: "Databases", items: ["MySQL"] },
    { id: "sk-4", category: "Tools", items: ["Git"] },
    { id: "sk-5", category: "AI Tools", items: ["ChatGPT"] },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.E. in Computer Science and Engineering",
      institute: "RV University",
      location: "Bengaluru, India",
      period: "2022 — 2026",
      note: "CGPA: 7.97 / 10",
    },
    {
      id: "edu-2",
      degree: "PUC",
      institute: "AKR Devi PU College",
      location: "Kalaburgi, India",
      period: "2020 — 2022",
      note: "Percentage: 81%",
    },
    {
      id: "edu-3",
      degree: "Secondary School Leaving Certificate",
      institute: "Shramjeevi Residential High School",
      location: "Bidar, India",
      period: "2018 — 2020",
      note: "Percentage: 75.84%",
    },
  ],
};

const STORAGE_KEY = "abhishek_portfolio_data";

export function loadPortfolioData(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    // Merge with defaults so any new fields are always present
    return {
      profile: { ...DEFAULT_DATA.profile, ...parsed.profile },
      projects: parsed.projects ?? DEFAULT_DATA.projects,
      skills: parsed.skills ?? DEFAULT_DATA.skills,
      education: parsed.education ?? DEFAULT_DATA.education,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function savePortfolioData(data: PortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch event so other tabs/windows update instantly
    window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: data }));
  } catch (err) {
    console.error("Failed to save data to localStorage:", err);
    alert("Failed to save changes. Your uploaded image might be too large for the browser to store. Please try a smaller image.");
  }
}

export function uid(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
