import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Github, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectCaseStudyModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectCaseStudyModal: React.FC<ProjectCaseStudyModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#050505]/90 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0F0F0F] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 space-y-8"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-accent">
              <span>DEV.GARAGE</span>
              <span>/</span>
              <span>WORKSHOP</span>
              <span>/</span>
              <span>{project.category}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold font-sans text-white">
              {project.title}
            </h3>
            <p className="text-sm font-mono text-text-secondary">
              {project.tagline || project.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Media Banner */}
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#141414] border border-white/10">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />
        </div>

        {/* Action Links Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#141414] border border-white/10">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg bg-[#1F1F1F] text-xs font-mono text-accent-light"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>SOURCE CODE</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent-dark text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-accent/20"
              >
                <span>LIVE SYSTEM</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Problem & Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>THE ENGINEERING CHALLENGE</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              {project.problem}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>THE ARCHITECTURAL SOLUTION</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed font-sans">
              {project.solution}
            </p>
          </div>
        </div>

        {/* System Architecture */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-accent font-bold">
            <Layers className="w-4 h-4" />
            <span>SYSTEM TOPOLOGY & DATA PIPELINE</span>
          </div>
          <p className="text-sm font-mono text-text-secondary leading-relaxed bg-[#0A0A0A] p-4 rounded-xl border border-white/5">
            {project.architecture}
          </p>
        </div>

        {/* Key Capabilities */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
              CORE CAPABILITIES & HIGHLIGHTS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#141414] border border-white/5 text-xs text-text-primary font-sans"
                >
                  <span className="text-accent font-mono font-bold">0{idx + 1}.</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Results */}
        {project.results && project.results.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
              MEASURED BENCHMARKS & RESULTS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.results.map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-xs font-mono text-accent-light space-y-1"
                >
                  <div className="text-white font-bold text-sm">{res}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
