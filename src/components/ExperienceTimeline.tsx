import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    experiences.length > 0 ? experiences[0].id : null
  );

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent mb-2">
              <span>03</span>
              <span>/</span>
              <span className="tracking-widest uppercase">JOURNEY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-white">
              Engineering Track Record
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-sm font-mono text-text-secondary">
            // Chronological systems architecture, engineering roles, and scale milestones.
          </div>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {experiences.map((exp, idx) => {
            const isExpanded = expandedId === exp.id;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`rounded-2xl bg-[#0F0F0F] border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-accent/50 shadow-xl shadow-accent/5 bg-[#141414]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Clickable Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-accent/10 border border-accent/30 text-accent-light">
                        {exp.logType || 'STABLE_RELEASE'}
                      </span>
                      {exp.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          CURRENT_DEPLOYMENT
                        </span>
                      )}
                      <span className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{exp.period}</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-sans text-white">
                      {exp.role}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary">
                      <span className="text-text-primary font-bold">{exp.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-text-muted" />
                        <span>{exp.location}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 text-text-muted hover:text-white transition-transform">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 sm:px-8 pb-8 pt-2 border-t border-white/5 space-y-6"
                    >
                      {/* Highlights */}
                      <div className="space-y-3">
                        <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
                          KEY DELIVERABLES & ARCHITECTURAL IMPACT
                        </div>
                        <div className="space-y-2">
                          {exp.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary font-sans leading-relaxed">
                              <span className="text-accent font-mono font-bold mt-0.5">&gt;</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <div className="text-[11px] font-mono text-text-muted uppercase tracking-wider">
                          STACK ARSENAL
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] border border-white/10 text-xs font-mono text-text-secondary"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
