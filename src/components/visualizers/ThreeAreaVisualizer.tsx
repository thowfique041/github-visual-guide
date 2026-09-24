import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FileCode, 
  HardDrive, 
  Cloud, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  Info, 
  Play,
  Layers
} from 'lucide-react';

export const ThreeAreaVisualizer: React.FC = () => {
  // Current state simulation
  // 0: Initial clean state
  // 1: Edit file in working dir (modified)
  // 2: git add (staged)
  // 3: git commit (local commit node)
  // 4: git push (uploaded to GitHub)
  const [step, setStep] = useState<number>(1);
  const [activeAreaInfo, setActiveAreaInfo] = useState<'working' | 'staging' | 'local' | 'remote'>('working');

  const areas = {
    working: {
      title: 'Working Directory',
      badge: 'Your Local Files',
      desc: 'The actual files on your computer filesystem. When you edit code in VS Code or your editor, changes reside strictly here until staged.',
      gitCmd: 'Edit file / create code',
      color: 'border-amber-500/40 bg-amber-500/5'
    },
    staging: {
      title: 'Staging Area (Index)',
      badge: 'Drafting Room',
      desc: 'The intermediate cache area where Git prepares the changes for the next commit. Only changes staged here will be packaged.',
      gitCmd: 'git add <file>',
      color: 'border-emerald-500/40 bg-emerald-500/5'
    },
    local: {
      title: 'Local Repository (HEAD)',
      badge: 'Commit History (.git)',
      desc: 'Your local database of permanent commit snapshots. HEAD points to your current branch snapshot. Everything is safe on your machine.',
      gitCmd: 'git commit -m "..."',
      color: 'border-sky-500/40 bg-sky-500/5'
    },
    remote: {
      title: 'GitHub / Remote',
      badge: 'Cloud Host (origin)',
      desc: 'The cloud repository shared across teammates. Pushing publishes your local commits so collaborators can pull and review.',
      gitCmd: 'git push origin main',
      color: 'border-purple-500/40 bg-purple-500/5'
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#58a6ff] animate-ping" />
            <h2 className="text-xl font-bold text-white tracking-tight">Git Architecture & 4-Area Flow</h2>
          </div>
          <p className="text-sm text-[#8b949e]">
            Follow the journey of code from your editor, into the index, to permanent local snapshots, and finally to GitHub.
          </p>
        </div>

        {/* Play Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset State
          </button>
          
          <button
            onClick={() => setStep(prev => (prev < 4 ? prev + 1 : 1))}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white shadow-lg shadow-[#238636]/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {step === 4 ? 'Loop Animation' : 'Next Step'}
          </button>
        </div>
      </div>

      {/* Interactive Command Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-6">
        {[
          { num: 1, label: '1. Modify File', desc: 'Working Directory', cmd: 'Edit app.js' },
          { num: 2, label: '2. git add app.js', desc: 'Staging Area', cmd: 'git add app.js' },
          { num: 3, label: '3. git commit -m', desc: 'Local Commit', cmd: 'git commit -m "feat"' },
          { num: 4, label: '4. git push', desc: 'GitHub Remote', cmd: 'git push origin main' },
        ].map(item => (
          <button
            key={item.num}
            onClick={() => setStep(item.num)}
            className={`text-left p-3 rounded-xl border transition-all ${
              step >= item.num
                ? 'border-[#58a6ff]/50 bg-[#58a6ff]/10 text-white'
                : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono font-medium mb-1">
              <span>{item.label}</span>
              {step >= item.num && <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />}
            </div>
            <span className="text-[11px] text-[#8b949e] block font-mono">{item.cmd}</span>
          </button>
        ))}
      </div>

      {/* The 4 Lanes Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8 relative">
        {/* Lane 1: Working Directory */}
        <div 
          onClick={() => setActiveAreaInfo('working')}
          className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
            activeAreaInfo === 'working' ? 'ring-2 ring-amber-400/50' : ''
          } bg-[#0d1117] border-[#30363d] hover:border-amber-500/50`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider">Working Tree</span>
            </div>
            <span className="text-[10px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/20 font-mono">
              Unstaged
            </span>
          </div>

          <div className="min-h-[140px] flex flex-col justify-center items-center p-3 rounded-lg bg-[#161b22] border border-[#30363d]/60">
            {step >= 1 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-lg border w-full text-center ${
                  step === 1 ? 'border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/5' : 'border-[#30363d] bg-[#21262d] opacity-50'
                }`}
              >
                <FileCode className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <span className="font-mono text-xs font-semibold text-white block">app.js</span>
                <span className="text-[10px] text-amber-300 font-mono">
                  {step === 1 ? '● Modified (unstaged)' : 'Unmodified'}
                </span>
              </motion.div>
            ) : (
              <span className="text-xs text-[#8b949e] italic font-mono">Working tree clean</span>
            )}
          </div>

          <p className="mt-2 text-[11px] text-[#8b949e] text-center font-mono">Untracked / Modified</p>
        </div>

        {/* Transition Arrow 1 */}
        <div className="hidden md:flex absolute left-[23.5%] top-[45%] -translate-y-1/2 z-10 text-emerald-400 items-center justify-center pointer-events-none">
          <div className={`p-1.5 rounded-full border ${step >= 2 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#161b22] border-[#30363d] text-[#484f58]'}`}>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Lane 2: Staging Area */}
        <div 
          onClick={() => setActiveAreaInfo('staging')}
          className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
            activeAreaInfo === 'staging' ? 'ring-2 ring-emerald-400/50' : ''
          } bg-[#0d1117] border-[#30363d] hover:border-emerald-500/50`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider">Staging Area</span>
            </div>
            <span className="text-[10px] bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-400/20 font-mono">
              Index
            </span>
          </div>

          <div className="min-h-[140px] flex flex-col justify-center items-center p-3 rounded-lg bg-[#161b22] border border-[#30363d]/60">
            <AnimatePresence mode="wait">
              {step >= 2 ? (
                <motion.div
                  key="staged-file"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-lg border w-full text-center ${
                    step === 2 ? 'border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' : 'border-[#30363d] bg-[#21262d] opacity-50'
                  }`}
                >
                  <FileCode className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                  <span className="font-mono text-xs font-semibold text-white block">app.js</span>
                  <span className="text-[10px] text-emerald-300 font-mono">
                    {step === 2 ? '✔ Staged for commit' : 'Prepared'}
                  </span>
                </motion.div>
              ) : (
                <span className="text-xs text-[#8b949e] italic font-mono">Staging is empty</span>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-2 text-[11px] text-[#8b949e] text-center font-mono">git add</p>
        </div>

        {/* Transition Arrow 2 */}
        <div className="hidden md:flex absolute left-[48.5%] top-[45%] -translate-y-1/2 z-10 text-sky-400 items-center justify-center pointer-events-none">
          <div className={`p-1.5 rounded-full border ${step >= 3 ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-[#161b22] border-[#30363d] text-[#484f58]'}`}>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Lane 3: Local Repository */}
        <div 
          onClick={() => setActiveAreaInfo('local')}
          className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
            activeAreaInfo === 'local' ? 'ring-2 ring-sky-400/50' : ''
          } bg-[#0d1117] border-[#30363d] hover:border-sky-500/50`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider">Local Repo</span>
            </div>
            <span className="text-[10px] bg-sky-400/10 text-sky-400 px-2 py-0.5 rounded border border-sky-400/20 font-mono">
              HEAD
            </span>
          </div>

          <div className="min-h-[140px] flex flex-col justify-center items-center p-3 rounded-lg bg-[#161b22] border border-[#30363d]/60">
            {step >= 3 ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-3 rounded-lg border w-full text-center ${
                  step === 3 ? 'border-sky-500/60 bg-sky-500/10 shadow-lg shadow-sky-500/5' : 'border-[#30363d] bg-[#21262d] opacity-80'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-sky-400 mx-auto mb-1.5 border-2 border-white shadow" />
                <span className="font-mono text-xs font-bold text-sky-300 block">c7b89f1</span>
                <span className="text-[10px] text-[#c9d1d9] font-mono truncate block max-w-full">
                  feat: update app.js
                </span>
                <span className="text-[9px] text-sky-400 font-mono mt-1 inline-block bg-sky-950/60 px-1.5 py-0.5 rounded">
                  HEAD -&gt; main
                </span>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#30363d] mx-auto mb-1" />
                <span className="text-xs text-[#8b949e] font-mono">b3f810c (HEAD)</span>
              </div>
            )}
          </div>

          <p className="mt-2 text-[11px] text-[#8b949e] text-center font-mono">git commit</p>
        </div>

        {/* Transition Arrow 3 */}
        <div className="hidden md:flex absolute left-[73.5%] top-[45%] -translate-y-1/2 z-10 text-purple-400 items-center justify-center pointer-events-none">
          <div className={`p-1.5 rounded-full border ${step >= 4 ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-[#161b22] border-[#30363d] text-[#484f58]'}`}>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Lane 4: Remote / GitHub */}
        <div 
          onClick={() => setActiveAreaInfo('remote')}
          className={`cursor-pointer rounded-xl p-4 border transition-all relative ${
            activeAreaInfo === 'remote' ? 'ring-2 ring-purple-400/50' : ''
          } bg-[#0d1117] border-[#30363d] hover:border-purple-500/50`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider">GitHub / Cloud</span>
            </div>
            <span className="text-[10px] bg-purple-400/10 text-purple-400 px-2 py-0.5 rounded border border-purple-400/20 font-mono">
              origin/main
            </span>
          </div>

          <div className="min-h-[140px] flex flex-col justify-center items-center p-3 rounded-lg bg-[#161b22] border border-[#30363d]/60">
            {step >= 4 ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-3 rounded-lg border border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/5 w-full text-center"
              >
                <div className="w-4 h-4 rounded-full bg-purple-400 mx-auto mb-1.5 border-2 border-white shadow" />
                <span className="font-mono text-xs font-bold text-purple-300 block">c7b89f1</span>
                <span className="text-[10px] text-[#c9d1d9] font-mono truncate block">
                  Synchronized!
                </span>
                <span className="text-[9px] text-purple-400 font-mono mt-1 inline-block bg-purple-950/60 px-1.5 py-0.5 rounded">
                  origin/main
                </span>
              </motion.div>
            ) : (
              <div className="text-center">
                <span className="text-xs text-[#8b949e] font-mono">Behind by 1 commit</span>
                <span className="text-[10px] text-[#484f58] block mt-1">Requires git push</span>
              </div>
            )}
          </div>

          <p className="mt-2 text-[11px] text-[#8b949e] text-center font-mono">git push origin main</p>
        </div>
      </div>

      {/* Explanatory Panel for Clicked Area */}
      <div className={`p-4 rounded-xl border ${areas[activeAreaInfo].color} transition-all`}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#58a6ff] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-white">{areas[activeAreaInfo].title}</h4>
              <span className="text-[11px] text-[#8b949e] font-mono">({areas[activeAreaInfo].badge})</span>
            </div>
            <p className="text-xs text-[#c9d1d9] leading-relaxed">
              {areas[activeAreaInfo].desc}
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] text-[#8b949e] font-mono">Primary command to enter this state:</span>
              <code className="text-xs font-mono font-semibold bg-[#0d1117] text-[#58a6ff] px-2 py-0.5 rounded border border-[#30363d]">
                {areas[activeAreaInfo].gitCmd}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
