import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Profile, SkillCategory, Experience, Project, Achievement } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsTerminal } from './components/SkillsTerminal';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ProjectsShowcase } from './components/ProjectsShowcase';
import { MilestonesSection } from './components/MilestonesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { CursorGlow } from './components/CursorGlow';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillsData, setSkillsData] = useState<{
    categories: SkillCategory[];
    terminalSkills: Record<string, string[]>;
  }>({ categories: [], terminalSkills: {} });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Achievement[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileRes, skillsRes, expRes, projRes, milestonesRes] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getSkills().catch(() => ({ categories: [], terminalSkills: {} })),
          api.getExperience().catch(() => []),
          api.getProjects().catch(() => []),
          api.getAchievements().catch(() => []),
        ]);

        if (profileRes) setProfile(profileRes);
        if (skillsRes) setSkillsData(skillsRes);
        if (expRes) setExperiences(expRes);
        if (projRes) setProjects(projRes);
        if (milestonesRes) setMilestones(milestonesRes);

        // Dynamic Document Title
        if (profileRes?.name) {
          document.title = `${profileRes.name} — ${profileRes.handle || 'DEV.GARAGE'}`;
        }
      } catch (err: any) {
        console.error('Failed to load portfolio telemetry:', err);
        setError('System telemetry offline. Please check API server.');
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-8 rounded-3xl bg-[#141414] border border-white/10 max-w-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto text-xl font-mono">
            !
          </div>
          <h2 className="text-xl font-bold font-sans text-white">System Service Offline</h2>
          <p className="text-xs font-mono text-text-secondary leading-relaxed">
            Unable to connect to the backend database service. Please ensure the API is running on port 5000.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-accent text-white font-mono text-xs font-bold hover:bg-accent-dark transition-colors cursor-pointer"
          >
            RETRY CONNECTION
          </button>
        </div>
      </div>
    );
  }

  const availableSections = {
    hasAbout: !!profile?.fullBio || !!profile?.shortBio,
    hasSkills: skillsData.categories.length > 0,
    hasExperience: experiences.length > 0,
    hasProjects: projects.length > 0,
    hasMilestones: milestones.length > 0,
    hasContact: !!profile?.email,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-text-primary selection:bg-accent selection:text-white relative">
      <CursorGlow />

      <Navbar
        activeSection={activeSection}
        profile={profile}
        availableSections={availableSections}
      />

      <main>
        {/* 1. Cinematic Hero */}
        <HeroSection profile={profile} />

        {/* 2. About The Builder */}
        {availableSections.hasAbout && <AboutSection profile={profile} />}

        {/* 3. Skills (Toolbox) */}
        {availableSections.hasSkills && (
          <SkillsTerminal
            categories={skillsData.categories}
            terminalSkills={skillsData.terminalSkills}
          />
        )}

        {/* 4. Experience (Journey) */}
        {availableSections.hasExperience && (
          <ExperienceTimeline experiences={experiences} />
        )}

        {/* 5. Projects & Case Studies (Workshop) */}
        {availableSections.hasProjects && (
          <ProjectsShowcase projects={projects} />
        )}

        {/* 6. Milestones & Accreditations (Honors) */}
        {availableSections.hasMilestones && (
          <MilestonesSection milestones={milestones} />
        )}

        {/* 7. Contact Transmission */}
        {availableSections.hasContact && <ContactSection profile={profile} />}
      </main>

      <Footer profile={profile} />
    </div>
  );
};
