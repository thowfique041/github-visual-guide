import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { ThreeAreaVisualizer } from './components/visualizers/ThreeAreaVisualizer';
import { MergeConflictVisualizer } from './components/visualizers/MergeConflictVisualizer';
import { ResetVsRevertVisualizer } from './components/visualizers/ResetVsRevertVisualizer';
import { RebaseVisualizer } from './components/visualizers/RebaseVisualizer';
import { GitHubWorkflowVisualizer } from './components/visualizers/GitHubWorkflowVisualizer';
import { GitPlayground } from './components/playground/GitPlayground';
import { CommandCatalog } from './components/commands/CommandCatalog';
import { PracticeMode } from './components/practice/PracticeMode';
import { GitHubDocsViewer } from './components/docs/GitHubDocsViewer';
import { GitVsGitHubExplanation } from './components/docs/GitVsGitHubExplanation';
import { ProblemSolver } from './components/troubleshooting/ProblemSolver';
import { 
  Terminal, 
  GitBranch, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Github,
  ChevronUp,
  Zap,
  GitPullRequest,
  FileText
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<
    'catalog' | 'intro' | 'playground' | 'architecture' | 'conflicts' | 'rebase' | 'reset-revert' | 'workflow' | 'practice' | 'docs' | 'troubleshoot'
  >('catalog');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('git_guide_favorites');
      return saved ? JSON.parse(saved) : ['git-add', 'git-commit', 'git-push', 'git-rebase'];
    } catch {
      return ['git-add', 'git-commit', 'git-push', 'git-rebase'];
    }
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('git_guide_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Track scroll position for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const footerLinks = [
    { id: 'catalog', label: 'Commands', icon: BookOpen },
    { id: 'intro', label: 'Git vs GitHub', icon: Sparkles },
    { id: 'architecture', label: '3-Area Flow', icon: Layers },
    { id: 'playground', label: 'Playground', icon: Terminal },
    { id: 'conflicts', label: 'Merge Conflicts', icon: GitBranch },
    { id: 'reset-revert', label: 'Reset vs Revert', icon: Zap },
    { id: 'rebase', label: 'Rebase Animator', icon: GitPullRequest },
    { id: 'workflow', label: 'GitHub Workflow', icon: Github },
    { id: 'docs', label: 'Reference Docs', icon: FileText },
    { id: 'practice', label: 'Practice Quiz', icon: HelpCircle },
    { id: 'troubleshoot', label: 'Problem Solver', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans selection:bg-[#58a6ff]/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedFavoritesCount={favorites.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Hero Section shown on catalog or when landing */}
        {activeTab === 'catalog' && (
          <Hero
            onStartLearning={() => {
              const el = document.getElementById('catalog-content');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExplorePlayground={() => setActiveTab('playground')}
            onPractice={() => setActiveTab('practice')}
          />
        )}

        <div id="catalog-content">
          {activeTab === 'catalog' && (
            <div className="space-y-8">
              <CommandCatalog
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          )}

          {activeTab === 'intro' && (
            <div className="space-y-8">
              <GitVsGitHubExplanation />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">Git 3-Area & Remote Architecture</h1>
                <p className="text-xs sm:text-sm text-[#8b949e]">
                  Understand how your files move across the four fundamental areas: Working Directory, Staging Area (Index), Local Repository (HEAD), and GitHub Remote.
                </p>
              </div>
              <ThreeAreaVisualizer />
            </div>
          )}

          {activeTab === 'playground' && (
            <div className="space-y-8">
              <GitPlayground />
            </div>
          )}

          {activeTab === 'conflicts' && (
            <div className="space-y-8">
              <MergeConflictVisualizer />
            </div>
          )}

          {activeTab === 'reset-revert' && (
            <div className="space-y-8">
              <ResetVsRevertVisualizer />
            </div>
          )}

          {activeTab === 'rebase' && (
            <div className="space-y-8">
              <RebaseVisualizer />
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-8">
              <GitHubWorkflowVisualizer />
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="space-y-8">
              <PracticeMode />
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-8">
              <GitHubDocsViewer />
            </div>
          )}

          {activeTab === 'troubleshoot' && <ProblemSolver />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#161b22] py-8 px-4 mt-16 text-center text-xs text-[#8b949e]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Brand Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-[#58a6ff]" />
              <span className="font-semibold text-white">GitHub Visual Guide</span>
              <span>• An interactive developer playground & visual guide</span>
            </div>
            <span className="text-[11px] font-mono text-[#8b949e]">
              39 commands · 8 guides · 7 interactive labs
            </span>
          </div>

          {/* All 10 Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-mono border-t border-[#30363d] pt-5">
            {footerLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => { setActiveTab(link.id as any); scrollToTop(); }}
                  className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                >
                  <Icon className="w-3 h-3" />
                  {link.label}
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* Floating Back-to-Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#21262d] border border-[#30363d] text-xs font-mono text-[#8b949e] hover:text-white hover:border-[#58a6ff] hover:bg-[#161b22] shadow-lg transition-all"
          aria-label="Back to top"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          Top
        </button>
      )}
    </div>
  );
}

export default App;

