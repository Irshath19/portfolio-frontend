import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, ShieldCheck, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { Achievement } from '../types';

interface MilestonesSectionProps {
  milestones: Achievement[];
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({ milestones }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!milestones || milestones.length === 0) return null;

  const visibleMilestones = milestones.filter((m) => m.isVisible !== false);
  if (visibleMilestones.length === 0) return null;

  const categories = ['ALL', ...Array.from(new Set(visibleMilestones.map((m) => m.category)))];

  const filteredMilestones = selectedCategory === 'ALL'
    ? visibleMilestones
    : visibleMilestones.filter((m) => m.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'CERTIFICATION':
        return ShieldCheck;
      case 'AWARD':
        return Trophy;
      case 'COMPETITION':
        return Sparkles;
      default:
        return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'CERTIFICATION':
        return 'text-accent border-accent/30 bg-accent/10';
      case 'AWARD':
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 'COMPETITION':
        return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }
  };

  return (
    <section id="milestones" className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative w-full max-w-full">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-8 sm:space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-accent font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>05 / ACCREDITATIONS & HONORS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white tracking-tight">
              Milestones & Certifications
            </h2>
            <p className="text-sm font-sans text-text-secondary max-w-xl leading-relaxed">
              Industry cloud certifications, competitive hackathon recognitions, and validated technical achievements.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-2 bg-[#0C0F17] p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-accent text-white font-bold shadow-glow-sm'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMilestones.map((item, idx) => {
            const Icon = getCategoryIcon(item.category);
            const colorClass = getCategoryColor(item.category);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-2xl bg-[#080C13] border border-white/10 hover:border-accent/40 p-6 flex flex-col justify-between space-y-5 transition-all duration-300 card-hover overflow-hidden"
              >
                {/* Subtle Hover Gradient Flare */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-4">
                  {/* Top Bar: Icon + Category Badge + Year */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white group-hover:scale-105 transition-transform">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${colorClass}`}>
                        {item.category}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-text-muted font-semibold">
                      {item.date}
                    </span>
                  </div>

                  {/* Title & Issuer */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold font-sans text-white group-hover:text-accent-light transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs font-mono text-accent-light flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      <span>{item.issuer}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Footer Link / Verify Button */}
                {item.link && (
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-light transition-colors group/link"
                    >
                      <span>VERIFY CREDENTIAL</span>
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
