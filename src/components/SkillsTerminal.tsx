import React, { useState } from 'react';
import { Terminal as TerminalIcon, Play, Copy, Check, Folder, Search } from 'lucide-react';
import { SkillCategory } from '../types';

interface SkillsTerminalProps {
  categories: SkillCategory[];
  terminalSkills: Record<string, string[]>;
}

export const SkillsTerminal: React.FC<SkillsTerminalProps> = ({ categories, terminalSkills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [isRunningCommand, setIsRunningCommand] = useState(false);

  if (!categories || categories.length === 0) {
    return null;
  }

  const runCommand = (categoryKey: string) => {
    setIsRunningCommand(true);
    setActiveTab('terminal');
    
    if (categoryKey === 'all') {
      setTerminalOutput([
        '> developer.getSkills()',
        'Fetching capabilities from PostgreSQL engine...',
        ...categories.map(c => `✓ Loaded subsystem: [${c.name.toUpperCase()}] (${c.skills.length} modules)`),
        '✓ Status: 100% operational. All engineering modules verified.',
      ]);
    } else {
      const cat = categories.find(c => c.slug === categoryKey);
      if (cat) {
        setTerminalOutput([
          `> developer.getSkills().${cat.slug}`,
          `Inspecting toolchain [${cat.name.toUpperCase()}]...`,
          `Category: ${cat.name}`,
          `Total Modules: ${cat.skills.length}`,
          '--- Skills List ---',
          ...cat.skills.map(s => `  • ${s.name.padEnd(26)} [Proficiency: ${s.proficiency}%]  ${s.description ? `// ${s.description}` : ''}`),
          `✓ Toolchain ${cat.name} loaded successfully.`,
        ]);
      }
    }

    setTimeout(() => {
      setIsRunningCommand(false);
    }, 350);
  };

  const copyCode = () => {
    const code = `// Developer Technical Capabilities Manifest
function getSkills() {
  return ${JSON.stringify(terminalSkills, null, 2)};
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCategories = categories.map(cat => ({
    ...cat,
    skills: cat.skills.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.skills.length > 0);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0A0A0A] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-accent mb-2">
              <span>02</span>
              <span>/</span>
              <span className="tracking-widest uppercase">TOOLBOX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans text-white">
              Technical Arsenal & Skills
            </h2>
          </div>
          <div className="mt-4 md:mt-0 text-sm font-mono text-text-secondary">
            // Full stack toolchain, distributed systems runtime, and ML engineering.
          </div>
        </div>

        {/* Terminal / Code IDE Window */}
        <div className="rounded-3xl bg-[#0F0F0F] border border-white/15 overflow-hidden shadow-2xl">
          
          {/* Top Window Bar */}
          <div className="px-6 py-4 bg-[#141414] border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-text-muted pl-2">
                workspace/toolbox/getSkills.ts
              </span>
            </div>

            {/* Tab Switches & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === 'editor' ? 'bg-white/10 text-white font-semibold' : 'text-text-muted hover:text-white'
                }`}
              >
                SCHEMA_VIEW
              </button>
              <button
                onClick={() => {
                  setActiveTab('terminal');
                  if (terminalOutput.length === 0) runCommand('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === 'terminal' ? 'bg-accent/20 text-accent-light font-semibold border border-accent/30' : 'text-text-muted hover:text-white'
                }`}
              >
                INTERACTIVE_CLI
              </button>

              <button
                onClick={copyCode}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors ml-2 cursor-pointer"
                title="Copy manifest code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={() => runCommand(selectedCategory)}
                disabled={isRunningCommand}
                className="px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-dark text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md shadow-accent/20 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunningCommand ? 'RUNNING...' : 'EXECUTE'}</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            
            {/* Category Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-accent text-white font-medium shadow-md shadow-accent/25'
                      : 'bg-[#141414] text-text-secondary hover:text-white border border-white/5'
                  }`}
                >
                  ALL_SYSTEMS
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-accent text-white font-medium shadow-md shadow-accent/25'
                        : 'bg-[#141414] text-text-secondary hover:text-white border border-white/5'
                    }`}
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl bg-[#141414] border border-white/10 text-xs font-mono text-white placeholder-text-muted focus:outline-none focus:border-accent w-full sm:w-48"
                />
              </div>
            </div>

            {/* View Switcher: Editor View or Terminal CLI */}
            {activeTab === 'editor' ? (
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories
                  .filter((cat) => selectedCategory === 'all' || cat.slug === selectedCategory)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      className="p-6 rounded-2xl bg-[#141414] border border-white/10 space-y-4 hover:border-accent/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-accent" />
                          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                            {cat.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                          {cat.skills.length} modules
                        </span>
                      </div>

                      <div className="space-y-3">
                        {cat.skills.map((skill) => (
                          <div key={skill.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-text-primary font-medium">{skill.name}</span>
                              <span className="text-accent-light font-bold">{skill.proficiency}%</span>
                            </div>
                            
                            {/* Visual Proficiency Bar */}
                            <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
                              <div
                                style={{ width: `${skill.proficiency}%` }}
                                className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full"
                              />
                            </div>

                            {skill.description && (
                              <p className="text-[11px] font-mono text-text-muted truncate">
                                // {skill.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              /* Terminal Output View */
              <div className="pt-6 min-h-[300px] bg-[#050505] p-6 rounded-2xl border border-white/10 font-mono text-xs text-text-secondary space-y-2">
                <div className="text-accent-light pb-2 border-b border-white/5 flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4" />
                  <span>INTERACTIVE getSkills() SESSION</span>
                </div>
                {terminalOutput.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line.startsWith('>') ? (
                      <span className="text-accent font-bold">{line}</span>
                    ) : line.startsWith('✓') ? (
                      <span className="text-emerald-400">{line}</span>
                    ) : line.startsWith('  •') ? (
                      <span className="text-gray-200">{line}</span>
                    ) : (
                      <span>{line}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
