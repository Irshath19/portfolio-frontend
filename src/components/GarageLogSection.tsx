import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Calendar, ArrowRight, X, Tag, Share2, Check } from 'lucide-react';
import { Blog } from '../types';

interface GarageLogSectionProps {
  blogs: Blog[];
}

export const GarageLogSection: React.FC<GarageLogSectionProps> = ({ blogs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<Blog | null>(null);
  const [copied, setCopied] = useState(false);

  if (!blogs || blogs.length === 0) return null;

  // Only show published articles on the public frontend
  const publishedBlogs = blogs.filter((b) => b.isPublished !== false);
  if (publishedBlogs.length === 0) return null;

  const categories = ['ALL', ...Array.from(new Set(publishedBlogs.map((b) => b.category)))];

  const filteredBlogs = selectedCategory === 'ALL'
    ? publishedBlogs
    : publishedBlogs.filter((b) => b.category === selectedCategory);

  const handleShare = (article: Blog) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#' + article.slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="garage-log" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-t border-white/5 relative">
      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-emerald-400 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>06 / GARAGE LOG // TECHNICAL ARTICLES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white tracking-tight">
              Engineering Notes & Deep Dives
            </h2>
            <p className="text-sm font-sans text-text-secondary max-w-xl leading-relaxed">
              Architectural lessons, systems internals, distributed design patterns, and agentic AI experiments.
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
                      ? 'bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, idx) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              onClick={() => setActiveArticle(blog)}
              className="group relative rounded-2xl bg-[#080C13] border border-white/10 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between cursor-pointer card-hover transition-all duration-300"
            >
              <div>
                {/* Cover Image Container */}
                {blog.coverImage && (
                  <div className="h-44 overflow-hidden relative bg-[#05070B]">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080C13] via-transparent to-transparent opacity-80" />
                    
                    {/* Category Pill on Image */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#05070B]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-emerald-400">
                      {blog.category}
                    </div>

                    {/* Read Time */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#05070B]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{blog.readTime || '5 min'}</span>
                    </div>
                  </div>
                )}

                {/* Article Info */}
                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{blog.publishedAt}</span>
                  </div>

                  <h3 className="text-base font-bold font-sans text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              {/* Tags and Read Prompt */}
              <div className="p-6 pt-0 space-y-4">
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono text-text-muted"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>READ ARTICLE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* Full Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#05070B]/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl max-h-[90vh] bg-[#0B111B] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 bg-[#080C13] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                  <span>GARAGE LOG // {activeArticle.category}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeArticle)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
                    title="Copy Article Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
                
                {/* Meta details */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {activeArticle.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeArticle.publishedAt}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-white leading-tight">
                    {activeArticle.title}
                  </h1>

                  <p className="text-sm font-sans text-text-secondary leading-relaxed border-l-2 border-emerald-500 pl-4 py-1 italic bg-white/[0.02] rounded-r-xl">
                    {activeArticle.summary}
                  </p>
                </div>

                {/* Article Cover Image */}
                {activeArticle.coverImage && (
                  <div className="rounded-2xl overflow-hidden max-h-72 w-full border border-white/10">
                    <img
                      src={activeArticle.coverImage}
                      alt={activeArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content / Markdown View */}
                <div className="text-sm font-sans text-text-secondary leading-relaxed space-y-4 whitespace-pre-line border-t border-white/10 pt-6">
                  {activeArticle.content}
                </div>

                {/* Article Tags */}
                {activeArticle.tags && activeArticle.tags.length > 0 && (
                  <div className="pt-6 border-t border-white/10 space-y-2">
                    <div className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      <span>TOPICS & TECHNOLOGIES</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-emerald-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#080C13] border-t border-white/10 flex items-center justify-between text-xs font-mono text-text-muted">
                <span>DEV.GARAGE ENGINEERING ARCHIVE</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
