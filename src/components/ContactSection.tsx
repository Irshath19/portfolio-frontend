import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin, Twitter } from 'lucide-react';
import { Profile } from '../types';
import { api } from '../services/api';

interface ContactSectionProps {
  profile: Profile | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!profile) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await api.sendMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to dispatch message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent mb-2">
              <span>05</span>
              <span>/</span>
              <span className="tracking-widest uppercase">CONTACT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-white">
              Initiate Transmission
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-sm font-mono text-text-secondary">
            // Direct inquiry terminal for architectural consulting, engineering roles & builds.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Coordinates & Links Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-sans text-white">
                {profile.contactHeading || "Let's Build Something High-Scale"}
              </h3>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed font-sans">
                {profile.contactDescription || "Available for engineering architectures, high-impact technical leadership, and collaborative development."}
              </p>
            </div>

            {/* Coordinates Box */}
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#141414] border border-white/10 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-text-muted text-[11px] block">EMAIL RELAY</span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white hover:text-accent-light font-bold transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>

              {profile.location && (
                <div className="p-4 rounded-xl bg-[#141414] border border-white/10 flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-text-muted text-[11px] block">LOCATION BASE</span>
                    <span className="text-white font-bold">{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Grid */}
            <div className="pt-4 border-t border-white/5">
              <span className="text-xs font-mono text-text-muted block mb-3 uppercase tracking-wider">
                NETWORK CHANNELS
              </span>
              <div className="flex flex-wrap gap-3">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-xs font-mono text-text-primary hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GITHUB</span>
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-xs font-mono text-text-primary hover:text-accent-light flex items-center gap-2 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LINKEDIN</span>
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-xs font-mono text-text-primary hover:text-accent-light flex items-center gap-2 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>TWITTER / X</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Dispatch Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0F0F0F] border border-white/15 shadow-2xl space-y-6">
              
              <div className="pb-4 border-b border-white/10">
                <div className="text-xs font-mono text-accent font-bold">MESSAGE TRANSMISSION PROTOCOL</div>
                <div className="text-xs font-mono text-text-muted mt-1">Direct relay to developer inbox.</div>
              </div>

              {status === 'success' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 font-mono text-xs">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>Transmission received successfully. I will review and respond shortly.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 font-mono text-xs">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-text-muted">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono text-white placeholder-text-muted focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-text-muted">YOUR EMAIL *</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono text-white placeholder-text-muted focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-text-muted">SUBJECT</label>
                  <input
                    type="text"
                    placeholder="Distributed AI Systems Architecture / Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono text-white placeholder-text-muted focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-text-muted">MESSAGE TRANSMISSION *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your engineering requirements, project scope, or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono text-white placeholder-text-muted focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-dark text-white font-mono text-xs font-bold transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'DISPATCHING TRANSMISSION...' : 'DISPATCH TRANSMISSION'}</span>
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
