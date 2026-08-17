import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { ProjectCaseStudyModal } from './ProjectCaseStudyModal';
import { analytics } from '../services/analytics';

interface ProjectsShowcaseProps {
  projects: Project[];
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const handleOpenCaseStudy = (proj: Project) => {
    analytics.trackProjectView(proj.id, proj.title);
    setActiveModalProject(proj);
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  const uniqueCategories = ['ALL', ...Array.from(new Set(projects.map((p) => p.category.toUpperCase())))];

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p) => p.category.toUpperCase() === selectedCategory);

  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const regularProjects = filteredProjects.filter((p) => p.id !== (selectedCategory === 'ALL' ? featuredProject?.id : ''));

  return (
    <section id="projects" className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-[#050505] border-t border-white/5 w-full max-w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 sm:pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent mb-2">
              <span>04</span>
              <span>/</span>
              <span className="tracking-widest uppercase">WORKSHOP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-white">
              Engineered Systems & Products
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-accent text-white font-medium shadow-md shadow-accent/30'
                    : 'bg-[#141414] text-text-secondary hover:text-white hover:bg-[#1A1A1A] border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Project Showcase */}
        {featuredProject && selectedCategory === 'ALL' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 rounded-3xl bg-[#0F0F0F] border border-white/10 hover:border-accent/40 transition-all duration-300 overflow-hidden group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-[#141414]">
                <img
                  src={featuredProject.coverImage}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-md text-white text-[11px] font-mono font-bold shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FLAGSHIP ENGINE</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-text-muted mb-2">
                    <span className="text-accent">{featuredProject.category}</span>
                    <span>•</span>
                    <span>{featuredProject.year}</span>
                    {featuredProject.status && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{featuredProject.status}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-sans text-white group-hover:text-accent-light transition-colors">
                    {featuredProject.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed font-sans">
                    {featuredProject.tagline || featuredProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {featuredProject.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] border border-white/10 text-xs font-mono text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleOpenCaseStudy(featuredProject)}
                    className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold bg-accent text-white hover:bg-accent-dark transition-all duration-200 shadow-md shadow-accent/20 flex items-center gap-2 cursor-pointer"
                  >
                    <span>[ INSPECT ARCHITECTURE ]</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {featuredProject.demoUrl && (
                    <a
                      href={featuredProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {featuredProject.githubUrl && (
                    <a
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                      title="Source Code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* Regular Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl bg-[#0F0F0F] border border-white/10 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:shadow-accent/5"
            >
              <div>
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#141414]">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#050505]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-accent">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                    <span>{project.year}</span>
                    {project.role && <span className="text-text-secondary">{project.role}</span>}
                  </div>

                  <h4 className="text-xl font-bold font-sans text-white group-hover:text-accent-light transition-colors">
                    {project.title}
                  </h4>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed font-sans">
                    {project.tagline || project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-[#1A1A1A] text-[11px] font-mono text-text-muted"
                      >
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[11px] font-mono text-text-muted self-center">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <button
                  onClick={() => handleOpenCaseStudy(project)}
                  className="text-xs font-mono text-accent hover:text-accent-light font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>CASE STUDY</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {activeModalProject && (
          <ProjectCaseStudyModal
            project={activeModalProject}
            onClose={() => setActiveModalProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
