export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  scope: string;
  achievements: string[];
  techStack: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  metrics: { label: string; value: string }[];
  techStack: string[];
  role?: string;
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level: number }[];
}

export interface Award {
  title: string;
  year: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  awards: Award[];
  education: {
    degree: string;
    university: string;
    location: string;
    years: string;
  };
  languages: string[];
}
