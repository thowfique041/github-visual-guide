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
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'catalog' | 'intro' | 'playground' | 'architecture' | 'conflicts' | 'rebase' | 'reset-revert' | 'workflow' | 'docs' | 'practice' | 'troubleshoot';
  setActiveTab: (tab: any) => void;
  savedFavoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedFavoritesCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
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
          onClick={() => setActiveTab('catalog')} 
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
