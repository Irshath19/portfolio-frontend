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

        {/* Right Photo Column - Ultra Pro-Level Engineering Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="relative group w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]">
            
            {/* Multi-layered Ambient Glow with Pulse */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/30 via-accent-violet/20 to-blue-500/20 rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/40 via-accent-violet/30 to-accent/40 rounded-[2.2rem] blur-md opacity-25 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

            {/* Pro Floating Glassmorphic Chassis */}
            <div className="relative rounded-[2rem] bg-gradient-to-b from-white/15 via-white/5 to-white/[0.02] p-[1.5px] shadow-2xl shadow-black/80 transition-transform duration-500 group-hover:-translate-y-1">
              <div className="relative rounded-[1.95rem] bg-[#070A10]/95 backdrop-blur-2xl overflow-hidden p-3.5 border border-white/5">
                
                {/* Inner Bezel Frame */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0B111B] border border-white/10 shadow-inner">
                  
                  {/* High-Definition Natural Portrait */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-100 contrast-[1.03]"
                  />
                  
                  {/* Subtle Light Vignette Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070B]/85 via-transparent to-black/10 pointer-events-none" />

                  {/* Top-Right Active Signal Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#05070B]/80 backdrop-blur-md border border-white/15 shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#22c55e]" />
                    <span className="text-[10px] font-mono font-bold tracking-wider text-white">ONLINE</span>
                  </div>

                  {/* Bottom Verified Identity Strip */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#080C13]/90 backdrop-blur-xl border border-white/10 flex items-center justify-between text-xs font-mono shadow-2xl">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold tracking-widest text-accent uppercase">{profile.handle || 'DEV.GARAGE'}</div>
                      <div className="text-white font-sans font-bold text-xs truncate max-w-[170px]">{profile.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-text-muted">SYSTEM ID</div>
                      <div className="text-[11px] font-mono text-emerald-400 font-bold">VERIFIED</div>
                    </div>
                  </div>

                </div>

                {/* Precision Engineering Sub-Bar */}
                <div className="mt-3 px-2 flex items-center justify-between text-[10px] font-mono text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-accent" />
                    <span>PORTFOLIO NODE // 01</span>
                  </div>
                  <span className="text-text-muted/70 tracking-widest">EST. 2026</span>
                </div>

              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
