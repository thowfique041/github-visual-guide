import React from 'react';
import { GitBranch, Terminal, Layers, ArrowRight, Play, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartLearning: () => void;
  onExplorePlayground: () => void;
  onPractice: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartLearning,
  onExplorePlayground,
  onPractice
}) => {
  return (
    <div className="relative overflow-hidden py-12 md:py-16 border-b border-[#30363d]/60 mb-8">
      {/* Background neon ambient gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#58a6ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-[#238636]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-xs font-mono text-[#c9d1d9] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#58a6ff]" />
          <span>Interactive Visual Git Simulation 2.0</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          GitHub Visual Guide
        </h1>

        {/* Hero Tagline */}
        <p className="text-lg sm:text-xl text-[#8b949e] font-light max-w-2xl mx-auto">
          “Stop memorizing Git commands. <span className="text-white font-medium underline decoration-[#58a6ff] decoration-2 underline-offset-4">See what they actually do.</span>”
        </p>

        <p className="text-xs sm:text-sm text-[#8b949e] max-w-xl mx-auto leading-relaxed">
          Interactive animations, real-time simulated commit graphs, branch movements, 3-area state transitions, merge conflicts, and GitHub collaboration workflows.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartLearning}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#238636]/20 transition-all hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>Explore 39 Commands</span>
          </button>

          <button
            onClick={onExplorePlayground}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1f6feb] hover:bg-[#388bfd] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#1f6feb]/20 transition-all hover:scale-105"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Git Playground</span>
          </button>

          <button
            onClick={onPractice}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs sm:text-sm font-mono border border-[#30363d] transition-all"
          >
            <span>Practice Quizzes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
