import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react';
import { Profile } from '../types';

interface HeroSectionProps {
  profile: Profile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = profile?.designations && profile.designations.length > 0
    ? profile.designations
    : [profile?.title || 'Software Engineer'];

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (!profile) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-screen relative flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Subtle Grid & Ambient Glow */}
      <div className="absolute inset-0 engineering-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Brand Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141414] border border-white/10 text-xs font-mono text-text-secondary"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-text-primary font-bold tracking-wider">{profile.handle || 'DEV.GARAGE'}</span>
            <span className="text-text-muted">•</span>
            <span className="text-accent-light tracking-wide uppercase">
              {profile.tagline || 'Build. Break. Learn. Ship.'}
            </span>
          </motion.div>

          {/* Cinematic Name Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-sans leading-[1.08]">
              {profile.name}
            </h1>
            
            {/* Dynamic Rotating Designation */}
            <div className="h-10 sm:h-12 flex items-center">
              <span className="text-xl sm:text-2xl lg:text-3xl font-mono text-accent-light font-medium flex items-center gap-2">
                <span className="text-text-muted">&gt;</span> {roles[roleIndex]}
              </span>
            </div>
          </motion.div>

          {/* Dynamic Bio Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed font-sans"
          >
            {profile.shortBio}
          </motion.p>

          {/* Key Metrics Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 py-3 max-w-lg border-y border-white/10"
          >
            <div>
              <div className="text-2xl font-bold text-white font-mono">{profile.yearsExperience || '03+'}</div>
              <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">{profile.projectsCount || '20+'}</div>
              <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Shipped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent font-mono">{profile.codeQualityScore || '99.9%'}</div>
              <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Reliability</div>
            </div>
          </motion.div>

          {/* Action CTAs & Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={() => scrollTo('projects')}
              className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold bg-accent text-white hover:bg-accent-dark transition-all duration-200 shadow-xl shadow-accent/25 border border-accent/40 flex items-center gap-2 cursor-pointer"
            >
              <span>[ EXPLORE WORKSHOP ]</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="px-6 py-3.5 rounded-xl font-mono text-xs font-semibold bg-[#141414] text-text-primary hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 border border-white/10 cursor-pointer"
            >
              [ CONTACT / INITIATE ]
            </button>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pl-2">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-accent-light transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-accent-light transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Photo Column - Clean & Premium (No fake status badges) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative group w-72 sm:w-80 lg:w-96 aspect-square">
            {/* Ambient Lighting Behind Frame */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-accent/20 to-blue-600/10 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
            
            {/* Image Container Card */}
            <div className="relative w-full h-full rounded-2xl bg-[#0F0F0F] border border-white/15 overflow-hidden p-2">
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-[#141414]">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </div>
            </div>

            {/* Corner Decorative Markers */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};
