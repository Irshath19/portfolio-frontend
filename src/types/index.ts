export interface Profile {
  id: string;
  name: string;
  handle: string;
  tagline: string;
  title: string;
  designations: string[];
  shortBio: string;
  fullBio: string;
  philosophy?: string;
  interests?: string;
  currentFocus?: string;
  aboutHeading?: string;
  aboutSecondary?: string;
  contactHeading?: string;
  contactDescription?: string;
  avatarUrl: string;
  resumeUrl?: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  yearsExperience: string;
  projectsCount: string;
  techCount: string;
  codeQualityScore: string;
  statusMessage: string;
  isAvailable: boolean;
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  proficiency: number;
  iconName: string;
  description: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  skills: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  logType: string;
  highlights: string[];
  technologies: string[];
  isCurrent: boolean;
  isVisible?: boolean;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  role?: string;
  status?: string;
  year: string;
  featured: boolean;
  isPublished?: boolean;
  order: number;
  coverImage: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies: string[];
  problem: string;
  solution: string;
  architecture: string;
  keyFeatures: string[];
  challenges: string[];
  results: string[];
  screenshots: string[];
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  category: string;
  date: string;
  description: string;
  link?: string;
  icon: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
