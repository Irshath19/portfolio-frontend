import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Cpu, Target, Layers, ArrowUpRight } from 'lucide-react';
import { Profile } from '../types';

interface AboutSectionProps {
  profile: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  if (!profile) return null;

  return (
    <section id="about" className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0A0A0A] border-t border-white/5 w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 lg:mb-16 pb-4 sm:pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent mb-2">
              <span>01</span>
              <span>/</span>
              <span className="tracking-widest uppercase">ABOUT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-white">
              {profile.aboutHeading || 'About The Builder'}
            </h2>
          </div>
          <div className="mt-3 md:mt-0 max-w-md text-xs sm:text-sm font-mono text-text-secondary">
            // {profile.aboutSecondary || 'Digital workshop philosophy, core systems mindset, and active engineering research.'}
          </div>
        </div>

        {/* Grid of About Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          
          {/* Main Bio Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-8 p-8 rounded-2xl bg-[#141414] border border-white/10 space-y-6"
          >
            <div className="flex items-center gap-3 text-accent font-mono text-xs font-semibold">
              <Compass className="w-4 h-4" />
              <span>CORE BACKGROUND & SYSTEMS NARRATIVE</span>
            </div>

            <p className="text-lg sm:text-xl text-text-primary leading-relaxed font-sans font-light">
              {profile.fullBio || profile.shortBio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-1">
                <span className="text-xs font-mono text-text-muted">LOCATION BASE</span>
                <p className="text-sm font-mono text-text-primary">{profile.location || 'Remote'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-text-muted">FOCUS</span>
                <p className="text-sm font-mono text-accent-light">{profile.title}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Metrics & Capabilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-4 p-8 rounded-2xl bg-[#141414] border border-white/10 flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex items-center gap-3 text-accent font-mono text-xs font-semibold mb-4">
                <Layers className="w-4 h-4" />
                <span>CAPABILITY SPECS</span>
              </div>
              <div className="space-y-3 font-mono text-xs text-text-secondary">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Code Quality</span>
                  <span className="text-accent font-bold">{profile.codeQualityScore || '99.9%'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Years Experience</span>
                  <span className="text-white font-bold">{profile.yearsExperience || '03+'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Technologies</span>
                  <span className="text-white font-bold">{profile.techCount || '18+'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-text-muted">Projects Built</span>
                  <span className="text-white font-bold">{profile.projectsCount || '20+'}</span>
                </div>
              </div>
            </div>

            {profile.resumeUrl && profile.resumeUrl !== '#' && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-center text-white flex items-center justify-center gap-2 transition-colors"
              >
                <span>VIEW RESUME</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </motion.div>

          {/* Philosophy Card */}
          {profile.philosophy && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-6 p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-3"
            >
              <div className="flex items-center gap-2 text-accent font-mono text-xs font-semibold">
                <Target className="w-4 h-4" />
                <span>ENGINEERING PHILOSOPHY</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">
                {profile.philosophy}
              </p>
            </motion.div>
          )}

          {/* Current Focus Card */}
          {profile.currentFocus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-6 p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-3"
            >
              <div className="flex items-center gap-2 text-accent font-mono text-xs font-semibold">
                <Cpu className="w-4 h-4" />
                <span>ACTIVE FOCUS & RESEARCH</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed font-sans">
                {profile.currentFocus}
              </p>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
};
