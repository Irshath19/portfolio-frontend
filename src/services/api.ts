import {
  Profile,
  SkillCategory,
  Experience,
  Project,
  Achievement,
  Blog,
  ContactMessagePayload,
  ApiResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

export const api = {
  // Profile
  getProfile: async (): Promise<Profile> => {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    const json: ApiResponse<Profile> = await res.json();
    return json.data;
  },

  // Skills
  getSkills: async (): Promise<{ categories: SkillCategory[]; terminalSkills: Record<string, string[]> }> => {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    const json: ApiResponse<{ categories: SkillCategory[]; terminalSkills: Record<string, string[]> }> = await res.json();
    return json.data;
  },

  // Experience
  getExperience: async (): Promise<Experience[]> => {
    const res = await fetch(`${API_BASE}/experience`);
    if (!res.ok) throw new Error('Failed to fetch experience');
    const json: ApiResponse<Experience[]> = await res.json();
    return json.data;
  },

  // Projects (Workshop)
  getProjects: async (category?: string): Promise<Project[]> => {
    const url = category && category !== 'ALL' ? `${API_BASE}/projects?category=${category}` : `${API_BASE}/projects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json: ApiResponse<Project[]> = await res.json();
    return json.data;
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    const json: ApiResponse<Project> = await res.json();
    return json.data;
  },

  // Milestones (Achievements)
  getAchievements: async (): Promise<Achievement[]> => {
    const res = await fetch(`${API_BASE}/achievements`);
    if (!res.ok) throw new Error('Failed to fetch achievements');
    const json: ApiResponse<Achievement[]> = await res.json();
    return json.data;
  },

  // Garage Log (Blogs)
  getBlogs: async (category?: string): Promise<Blog[]> => {
    const url = category && category !== 'ALL' ? `${API_BASE}/blogs?category=${category}` : `${API_BASE}/blogs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    const json: ApiResponse<Blog[]> = await res.json();
    return json.data;
  },

  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const res = await fetch(`${API_BASE}/blogs/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    const json: ApiResponse<Blog> = await res.json();
    return json.data;
  },

  // Contact
  submitContact: async (payload: ContactMessagePayload): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to dispatch contact message');
    }
    return json;
  },
  sendMessage: async (payload: ContactMessagePayload): Promise<{ message: string }> => {
    return api.submitContact(payload);
  },
};
