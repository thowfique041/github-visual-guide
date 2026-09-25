import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Layers, 
  GitPullRequest, 
  BookOpen, 
  HelpCircle,
  Github,
  Zap,
  Bookmark,
  Sparkles,
  FileText,
  Menu,
  X,
  Accessibility
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'learn' | 'catalog' | 'intro' | 'playground' | 'architecture' | 'conflicts' | 'rebase' | 'reset-revert' | 'workflow' | 'docs' | 'practice' | 'troubleshoot';
  setActiveTab: (tab: any) => void;
  savedFavoritesCount: number;
  language: 'en' | 'bn';
  setLanguage: (language: 'en' | 'bn') => void;
  accessibility: { highContrast: boolean; reduceMotion: boolean; largeText: boolean };
  setAccessibility: {
    setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
    setReduceMotion: React.Dispatch<React.SetStateAction<boolean>>;
    setLargeText: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedFavoritesCount, language, setLanguage, accessibility, setAccessibility }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  const navItems = [
    { id: 'learn', label: 'Start Here', icon: Sparkles },
    { id: 'catalog', label: 'Commands', icon: BookOpen },
    { id: 'intro', label: 'Git vs GitHub', icon: Sparkles },
    { id: 'architecture', label: '3-Area Flow', icon: Layers },
    { id: 'playground', label: 'Playground & Graph', icon: Terminal },
    { id: 'conflicts', label: 'Merge Conflicts', icon: GitBranch },
    { id: 'reset-revert', label: 'Reset vs Revert', icon: Zap },
    { id: 'rebase', label: 'Rebase Animator', icon: GitPullRequest },
    { id: 'workflow', label: 'GitHub Workflow', icon: Github },
    { id: 'docs', label: 'Reference Docs', icon: FileText },
    { id: 'practice', label: 'Practice Quiz', icon: HelpCircle },
    { id: 'troubleshoot', label: 'Problem Solver', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#161b22]/95 backdrop-blur border-b border-[#30363d] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('learn')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#238636] to-[#58a6ff] flex items-center justify-center shadow-lg shadow-[#58a6ff]/10 group-hover:scale-105 transition-transform">
            <GitBranch className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">GitHub Visual Guide</span>
              <span className="text-[10px] font-semibold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 px-2 py-0.5 rounded-full uppercase">
                Interactive
              </span>
            </div>
            <p className="text-xs text-[#8b949e] hidden sm:block">Stop memorizing commands. See what they actually do.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-[#0d1117] p-1.5 rounded-xl border border-[#30363d]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive 
                    ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]' 
                    : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#58a6ff]' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')} className="h-9 px-2.5 rounded-lg bg-[#21262d] border border-[#30363d] text-xs font-semibold text-[#c9d1d9]" aria-label="Switch language">
            {language === 'en' ? 'বাংলা' : 'EN'}
          </button>
          <div className="relative">
            <button onClick={() => setA11yOpen(v => !v)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white" aria-label="Accessibility settings" aria-expanded={a11yOpen}><Accessibility className="w-4 h-4" /></button>
            {a11yOpen && <div className="absolute right-0 top-11 w-56 rounded-xl bg-[#161b22] border border-[#30363d] shadow-2xl p-3 space-y-2 z-50">
              <div className="text-xs font-semibold text-white mb-2">Accessibility</div>
              {[["High contrast", accessibility.highContrast, setAccessibility.setHighContrast], ["Reduce motion", accessibility.reduceMotion, setAccessibility.setReduceMotion], ["Larger text", accessibility.largeText, setAccessibility.setLargeText]].map(([label, value, setter]) => <button key={label as string} onClick={() => (setter as React.Dispatch<React.SetStateAction<boolean>>)(v => !v)} className="w-full flex items-center justify-between text-xs text-[#c9d1d9] p-2 rounded-lg hover:bg-[#21262d]"><span>{label as string}</span><span className={`w-8 h-4 rounded-full p-0.5 ${value ? 'bg-[#238636]' : 'bg-[#30363d]'}`}><span className={`block w-3 h-3 bg-white rounded-full transition-transform ${value ? 'translate-x-4' : ''}`} /></span></button>)}
            </div>}
          </div>
          {savedFavoritesCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-[#d29922]/10 border border-[#d29922]/30 text-[#d29922] px-2.5 py-1 rounded-lg text-xs font-mono">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{savedFavoritesCount} saved</span>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Desktop: Horizontal Scroll fallback for large-but-not-xl screens */}
      <div className="hidden lg:flex xl:hidden items-center gap-1 overflow-x-auto pt-3 pb-1 -mx-2 px-2 scrollbar-none">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30'
                  : 'text-[#8b949e] hover:text-white bg-[#0d1117] border border-[#30363d]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Mobile Dropdown Menu (sm & md screens) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#30363d] bg-[#161b22]/98 backdrop-blur py-3 px-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30'
                    : 'text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#58a6ff]' : ''}`} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
