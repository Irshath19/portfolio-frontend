import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowRight, 
  X, 
  Tag, 
  Share2, 
  Check, 
  Copy, 
  ArrowLeft,
  AlertCircle,
  Layers
} from 'lucide-react';
import { marked } from 'marked';
import { Blog } from '../types';

marked.setOptions({
  gfm: true,
  breaks: true,
});

interface GarageLogSectionProps {
  blogs: Blog[];
}

export const GarageLogSection: React.FC<GarageLogSectionProps> = ({ blogs }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<Blog | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [notFoundSlug, setNotFoundSlug] = useState<string | null>(null);

  // Filter published blogs only
  const publishedBlogs = useMemo(() => {
    return (blogs || []).filter((b) => b.isPublished !== false);
  }, [blogs]);

  // Extract slug from current window URL (pathname or hash)
  const extractSlugFromUrl = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    // 1. Check pathname: /blog/:slug
    const pathname = window.location.pathname;
    const blogPathMatch = pathname.match(/^\/blog\/(.+)$/);
    if (blogPathMatch && blogPathMatch[1]) {
      const slug = decodeURIComponent(blogPathMatch[1].replace(/\/$/, '')).trim();
      if (slug) return slug;
    }

    // 2. Check hash: #/blog/:slug or #blog/:slug or #slug
    const hash = window.location.hash;
    if (hash) {
      const hashClean = hash.replace(/^#\/?/, '');
      const hashBlogMatch = hashClean.match(/^blog\/(.+)$/);
      if (hashBlogMatch && hashBlogMatch[1]) {
        const slug = decodeURIComponent(hashBlogMatch[1].replace(/\/$/, '')).trim();
        if (slug) return slug;
      }
    }

    return null;
  }, []);

  // Update dynamic SEO & Open Graph meta tags
  const updateMetaTags = useCallback((article: Blog | null) => {
    if (typeof document === 'undefined') return;

    if (article) {
      document.title = `${article.title} — Garage Engineering Log`;

      const setMeta = (name: string, content: string, isProperty = false) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          if (isProperty) el.setAttribute('property', name);
          else el.setAttribute('name', name);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      const url = `${window.location.origin}/blog/${article.slug}`;
      const desc = article.summary || article.title;
      const img = article.coverImage || '';

      setMeta('description', desc);
      setMeta('og:title', article.title, true);
      setMeta('og:description', desc, true);
      setMeta('og:image', img, true);
      setMeta('og:url', url, true);
      setMeta('og:type', 'article', true);
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:title', article.title);
      setMeta('twitter:description', desc);
      setMeta('twitter:image', img);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    } else {
      // Restore default canonical and meta
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', window.location.origin + '/');
      }
    }
  }, []);

  // Synchronize state with URL on initial load and route changes
  const syncArticleFromUrl = useCallback(() => {
    if (publishedBlogs.length === 0) return;

    const slug = extractSlugFromUrl();
    if (slug) {
      const matched = publishedBlogs.find(
        (b) => b.slug.toLowerCase() === slug.toLowerCase()
      );
      if (matched) {
        setActiveArticle(matched);
        setNotFoundSlug(null);
        updateMetaTags(matched);
      } else {
        setActiveArticle(null);
        setNotFoundSlug(slug);
      }
    } else {
      setActiveArticle(null);
      setNotFoundSlug(null);
      updateMetaTags(null);
    }
  }, [publishedBlogs, extractSlugFromUrl, updateMetaTags]);

  useEffect(() => {
    syncArticleFromUrl();
  }, [syncArticleFromUrl]);

  // Listen to browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      syncArticleFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncArticleFromUrl]);

  // Handle ESC key to close reader
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeArticle || notFoundSlug) {
          handleCloseArticle();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle, notFoundSlug]);

  const handleOpenArticle = (article: Blog) => {
    setActiveArticle(article);
    setNotFoundSlug(null);
    updateMetaTags(article);

    // Update browser URL to canonical /blog/:slug
    const targetUrl = `/blog/${article.slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ slug: article.slug }, '', targetUrl);
    }
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
    setNotFoundSlug(null);
    updateMetaTags(null);

    // Reset URL to home "/"
    if (
      window.location.pathname.startsWith('/blog') ||
      window.location.hash.startsWith('#/blog') ||
      window.location.hash.startsWith('#blog')
    ) {
      window.history.pushState({}, '', '/');
    }
  };

  // Dedicated Copy Link handler
  const handleCopyLink = async (e: React.MouseEvent, article: Blog) => {
    e.stopPropagation();
    e.preventDefault();

    const blogUrl = `${window.location.origin}/blog/${article.slug}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(blogUrl);
        setCopiedSlug(article.slug);
        setTimeout(() => {
          setCopiedSlug((current) => (current === article.slug ? null : current));
        }, 2500);
      } catch (err) {
        console.error('Failed to copy article URL:', err);
      }
    }
  };

  // Unified Share handler: Web Share API with Clipboard Copy Fallback
  const handleShare = async (e: React.MouseEvent, article: Blog) => {
    e.stopPropagation();
    e.preventDefault();

    const blogUrl = `${window.location.origin}/blog/${article.slug}`;
    const shareData = {
      title: article.title,
      text: article.summary || article.title,
      url: blogUrl,
    };

    // Try native share on mobile/supported desktop
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return; // User canceled share sheet
        }
      }
    }

    // Fallback: Copy link to clipboard
    handleCopyLink(e, article);
  };

  if (!blogs || blogs.length === 0) return null;
  if (publishedBlogs.length === 0) return null;

  const categories = ['ALL', ...Array.from(new Set(publishedBlogs.map((b) => b.category)))];

  const filteredBlogs = selectedCategory === 'ALL'
    ? publishedBlogs
    : publishedBlogs.filter((b) => b.category === selectedCategory);

  // Related articles for expanded reader
  const relatedArticles = activeArticle
    ? publishedBlogs.filter((b) => b.id !== activeArticle.id).slice(0, 3)
    : [];

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
              onClick={() => handleOpenArticle(blog)}
              className="group relative rounded-2xl bg-[#080C13] border border-white/10 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between cursor-pointer card-hover transition-all duration-300 shadow-lg"
            >
              <div>
                {/* 1. Blog Cover Image */}
                {blog.coverImage && (
                  <div className="h-44 overflow-hidden relative bg-[#05070B]">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080C13] via-transparent to-transparent opacity-80" />
                    
                    {/* 2. Category Pill */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#05070B]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-emerald-400">
                      {blog.category}
                    </div>

                    {/* 3. Read Time Pill */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#05070B]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{blog.readTime || '5 min read'}</span>
                    </div>
                  </div>
                )}

                {/* Article Info */}
                <div className="p-6 space-y-3">
                  
                  {/* 4. Publication Date */}
                  <div className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-emerald-400/80" />
                    <span>{blog.publishedAt}</span>
                  </div>

                  {/* 5. Title */}
                  <h3 className="text-base font-bold font-sans text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* 6. Short Description */}
                  <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed font-sans">
                    {blog.summary}
                  </p>
                </div>
              </div>

              {/* Tags & Action Bar */}
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

                {/* 7. [ Read Article ] & [ Copy Link ] / [ Share ] Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenArticle(blog)}
                    className="text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Copy Link Button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(e, blog)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        copiedSlug === blog.slug
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white'
                      }`}
                      title={copiedSlug === blog.slug ? 'Link copied to clipboard!' : 'Copy article link'}
                    >
                      {copiedSlug === blog.slug ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] font-bold text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-text-muted group-hover:text-white" />
                          <span className="text-[11px]">Copy Link</span>
                        </>
                      )}
                    </button>

                    {/* Native Share Button */}
                    <button
                      type="button"
                      onClick={(e) => handleShare(e, blog)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white transition-colors cursor-pointer"
                      title="Share article via Web Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* 404 — Article Not Found Modal */}
      <AnimatePresence>
        {notFoundSlug && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070B]/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0B111B] border border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-sans text-white">404 — Article Not Found</h3>
                <p className="text-xs font-mono text-text-secondary leading-relaxed">
                  The article slug <span className="text-red-400 font-bold">/blog/{notFoundSlug}</span> does not exist in the engineering archive or may have been moved.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCloseArticle}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  EXPLORE ALL ARTICLES
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Article Expanded Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#05070B]/92 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full max-w-4xl max-h-[92vh] bg-[#080C13] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col"
            >
              {/* Modal Sticky Top Header */}
              <div className="p-4 sm:px-8 sm:py-5 border-b border-white/10 bg-[#05070B]/90 backdrop-blur-md flex items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseArticle}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
                    title="Back to all articles"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Garage Log</span>
                  </button>

                  <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

                  <span className="text-xs font-mono font-bold text-emerald-400 hidden sm:flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{activeArticle.category}</span>
                  </span>
                </div>

                {/* Header Actions: Share & Close */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleShare(e, activeArticle)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                      copiedSlug === activeArticle.slug
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-white'
                    }`}
                  >
                    {copiedSlug === activeArticle.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold text-emerald-400">✓ Link copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Article</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCloseArticle}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Reader Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
                
                {/* Meta details */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-muted">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                      {activeArticle.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-text-secondary">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      {activeArticle.readTime || '5 min read'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {activeArticle.publishedAt}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-sans text-white leading-tight tracking-tight">
                    {activeArticle.title}
                  </h1>

                  {/* Summary Callout Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/15 border-l-4 border-emerald-500 border-y border-r border-emerald-500/20 text-sm font-sans text-emerald-100/90 leading-relaxed italic">
                    {activeArticle.summary}
                  </div>
                </div>

                {/* Article Cover Image */}
                {activeArticle.coverImage && (
                  <div className="rounded-2xl overflow-hidden max-h-96 w-full border border-white/10 bg-[#05070B] relative shadow-xl">
                    <img
                      src={activeArticle.coverImage}
                      alt={activeArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080C13]/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Article Full Content (Rendered Markdown) */}
                <div 
                  className="article-markdown-body border-t border-white/10 pt-6"
                  dangerouslySetInnerHTML={{ __html: marked.parse(activeArticle.content || '') as string }}
                />

                {/* Article Tags */}
                {activeArticle.tags && activeArticle.tags.length > 0 && (
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <div className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>TOPICS & ARCHITECTURE STACK</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeArticle.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shareable Canonical URL Callout */}
                <div className="p-4 rounded-2xl bg-[#05070B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-text-muted text-[10px] uppercase tracking-wider">Direct Shareable Link</span>
                    <p className="text-emerald-400 truncate">
                      {window.location.origin}/blog/{activeArticle.slug}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleShare(e, activeArticle)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                  >
                    {copiedSlug === activeArticle.slug ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                  <div className="pt-8 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>More Engineering Deep Dives</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {relatedArticles.map((rel) => (
                        <div
                          key={rel.id}
                          onClick={() => handleOpenArticle(rel)}
                          className="p-4 rounded-2xl bg-[#05070B] border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {rel.category}
                            </span>
                            <h4 className="text-xs font-bold font-sans text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                              {rel.title}
                            </h4>
                          </div>
                          <div className="text-[10px] font-mono text-text-muted pt-3 flex items-center justify-between">
                            <span>{rel.readTime || '5 min'}</span>
                            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:px-8 bg-[#05070B] border-t border-white/10 flex items-center justify-between text-xs font-mono text-text-muted flex-shrink-0">
                <span className="hidden sm:inline">DEV.GARAGE ENGINEERING ARCHIVE</span>
                <button
                  onClick={handleCloseArticle}
                  className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
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

