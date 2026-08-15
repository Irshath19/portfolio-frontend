import React, { useState, useEffect } from 'react';
import { Menu, X, Cpu } from 'lucide-react';
import { Profile } from '../types';

interface NavItem {
  id: string;
  label: string;
}

interface NavbarProps {
  activeSection: string;
  profile: Profile | null;
  availableSections: {
    hasAbout: boolean;
    hasSkills: boolean;
    hasExperience: boolean;
    hasProjects: boolean;
    hasContact: boolean;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, profile, availableSections }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    ...(availableSections.hasAbout ? [{ id: 'about', label: 'ABOUT' }] : []),
    ...(availableSections.hasSkills ? [{ id: 'skills', label: 'SKILLS' }] : []),
    ...(availableSections.hasExperience ? [{ id: 'experience', label: 'EXPERIENCE' }] : []),
    ...(availableSections.hasProjects ? [{ id: 'projects', label: 'PROJECTS' }] : []),
    ...(availableSections.hasContact ? [{ id: 'contact', label: 'CONTACT' }] : []),
  ];

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent/20 transition-all">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono font-bold text-sm tracking-wider text-text-primary group-hover:text-accent-light transition-colors">
                {profile?.handle || 'DEV.GARAGE'}
              </span>
              <span className="hidden sm:block text-[9px] font-mono text-text-muted uppercase tracking-widest">
                {profile?.tagline || 'BUILD • BREAK • LEARN • SHIP'}
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#0F0F0F]/80 border border-white/10 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-accent text-white font-medium shadow-md shadow-accent/30'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollTo('contact')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-accent text-white hover:bg-accent-dark transition-all duration-200 border border-accent/40 shadow-lg shadow-accent/20 cursor-pointer"
            >
              [ CONTACT ]
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl md:hidden flex flex-col p-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-accent" />
              <span className="font-mono font-bold text-sm tracking-wider text-white">
                {profile?.handle || 'DEV.GARAGE'}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/5 text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4 py-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-left text-lg font-mono py-2 border-b border-white/5 ${
                  activeSection === item.id ? 'text-accent font-bold pl-2' : 'text-gray-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => scrollTo('contact')}
              className="w-full py-3 rounded-xl text-center font-mono text-sm font-semibold bg-accent text-white"
            >
              [ CONTACT ]
            </button>
          </div>
        </div>
      )}
    </>
  );
};
