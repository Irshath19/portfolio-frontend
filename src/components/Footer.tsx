import React from 'react';
import { Cpu, ArrowUp } from 'lucide-react';
import { Profile } from '../types';

interface FooterProps {
  profile: Profile | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#050505] border-t border-white/10 relative w-full max-w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-white">
              {profile?.handle || 'DEV.GARAGE'}
            </div>
            <div className="text-[11px] font-mono text-text-muted mt-0.5">
              © {currentYear} {profile?.name || 'DEV.GARAGE'}. All systems operational.
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-[11px] sm:text-xs font-mono text-text-muted tracking-widest uppercase">
          {profile?.tagline || 'Build. Break. Learn. Ship.'}
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 text-text-secondary hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono"
        >
          <span>TOP</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

      </div>
    </footer>
  );
};
