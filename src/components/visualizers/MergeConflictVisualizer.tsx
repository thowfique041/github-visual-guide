import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  GitCommit, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  FileCode, 
  Layers, 
  ArrowRight 
} from 'lucide-react';

export const MergeConflictVisualizer: React.FC = () => {
  // Step 1: Divergent commits
  // Step 2: Merge triggered -> Conflict detected
  // Step 3: Conflict resolved -> Merge commit created
  const [conflictStep, setConflictStep] = useState<number>(2);
  const [resolutionChoice, setResolutionChoice] = useState<'current' | 'incoming' | 'both' | 'custom' | null>(null);
  const [customText, setCustomText] = useState<string>('const themeColor = "indigo"; // manually resolved');
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const resetConflict = () => {
    setConflictStep(2);
    setResolutionChoice(null);
    setIsResolved(false);
  };

  const handleResolve = (choice: 'current' | 'incoming' | 'both' | 'custom') => {
    setResolutionChoice(choice);
    setIsResolved(true);
    setConflictStep(3);
  };

  const getResolvedContent = () => {
    switch (resolutionChoice) {
      case 'current':
        return 'const themeColor = "#2563eb"; // blue from main branch';
      case 'incoming':
        return 'const themeColor = "#dc2626"; // red from feature/red-theme branch';
      case 'both':
        return 'const themeColor = "#2563eb"; // current\nconst accentColor = "#dc2626"; // incoming';
      case 'custom':
        return customText;
      default:
        return '';
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Merge Conflict Interactive Lab</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            Understand exactly why Git conflicts happen and practice resolving them with instant visual commit graph feedback.
          </p>
        </div>

        <button
          onClick={resetConflict}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d] self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Conflict Scenario
        </button>
      </div>

      {/* Visual Branch Graph Explanation */}
      <div className="bg-[#0d1117] rounded-xl p-5 border border-[#30363d] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e] mb-4">
          <span className="flex items-center gap-2 text-white font-medium">
            <GitBranch className="w-4 h-4 text-[#58a6ff]" />
            Divergent History on file: <code className="text-[#58a6ff]">theme.config.ts</code>
          </span>
          <span className="bg-[#21262d] px-2 py-0.5 rounded text-[11px]">
            {isResolved ? 'Status: MERGED CLEANLY' : 'Status: CONFLICT DETECTED'}
          </span>
        </div>

        {/* Commit Graph Diagram */}
        <div className="relative py-6 flex items-center justify-center">
          <svg className="w-full max-w-xl h-36" viewBox="0 0 540 120">
            {/* Base line */}
            <line x1="40" y1="40" x2="160" y2="40" stroke="#30363d" strokeWidth="3" />
            {/* Main branch line */}
            <line x1="160" y1="40" x2="300" y2="40" stroke="#58a6ff" strokeWidth="3" />
            {/* Feature branch split line */}
            <path d="M 160 40 C 200 40, 210 90, 270 90" fill="none" stroke="#bc8cff" strokeWidth="3" />
            <line x1="270" y1="90" x2="350" y2="90" stroke="#bc8cff" strokeWidth="3" />

            {/* Merge line if resolved */}
            {isResolved && (
              <>
                <line x1="300" y1="40" x2="460" y2="40" stroke="#3fb950" strokeWidth="3" strokeDasharray="4 4" />
                <path d="M 350 90 C 400 90, 420 40, 460 40" fill="none" stroke="#3fb950" strokeWidth="3" strokeDasharray="4 4" />
              </>
            )}

            {/* Commit 1: Common ancestor */}
            <circle cx="60" cy="40" r="9" fill="#21262d" stroke="#58a6ff" strokeWidth="3" />
            <text x="60" y="22" textAnchor="middle" fill="#8b949e" fontSize="10" fontFamily="monospace">C1 (Base)</text>

            {/* Commit 2: Main branch commit */}
            <circle cx="280" cy="40" r="10" fill="#1f6feb" stroke="#fff" strokeWidth="2" />
            <text x="280" y="22" textAnchor="middle" fill="#58a6ff" fontSize="11" fontWeight="bold" fontFamily="monospace">main (C2)</text>
            <text x="280" y="58" textAnchor="middle" fill="#8b949e" fontSize="9" fontFamily="monospace">color: blue</text>

            {/* Commit 3: Feature branch commit */}
            <circle cx="330" cy="90" r="10" fill="#8957e5" stroke="#fff" strokeWidth="2" />
            <text x="330" y="112" textAnchor="middle" fill="#bc8cff" fontSize="11" fontWeight="bold" fontFamily="monospace">feature (C3)</text>
            <text x="330" y="78" textAnchor="middle" fill="#8b949e" fontSize="9" fontFamily="monospace">color: red</text>

            {/* Resolved Merge Commit */}
            {isResolved && (
              <g>
                <circle cx="460" cy="40" r="12" fill="#238636" stroke="#fff" strokeWidth="2" />
                <text x="460" y="20" textAnchor="middle" fill="#3fb950" fontSize="11" fontWeight="bold" fontFamily="monospace">C4 (Merge)</text>
                <text x="460" y="60" textAnchor="middle" fill="#3fb950" fontSize="9" fontFamily="monospace">Resolved ✔</text>
              </g>
            )}
          </svg>
        </div>

        <p className="text-xs text-[#8b949e] text-center font-mono">
          Both branches modified line 5 of <span className="text-white">theme.config.ts</span> concurrently! Git paused the merge and inserted conflict markers.
        </p>
      </div>

      {/* Code Editor Simulation with Conflict Markers */}
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden font-mono text-xs">
        {/* Editor Titlebar */}
        <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="text-white font-medium">src/config/theme.config.ts</span>
            {!isResolved && (
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                1 Unresolved Conflict
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#8b949e]">UTF-8 • TypeScript</span>
        </div>

        {/* Conflict Contents */}
        <div className="p-4 space-y-1 overflow-x-auto">
          <div className="text-[#8b949e]">1  import { '{' } ThemeSettings { '}' } from './types';</div>
          <div className="text-[#8b949e]">2  </div>
          <div className="text-[#8b949e]">3  export const config: ThemeSettings = { '{' }</div>
          <div className="text-[#8b949e]">4    version: 2,</div>

          <AnimatePresence mode="wait">
            {!isResolved ? (
              <motion.div
                key="unresolved-markers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-1 space-y-1"
              >
                {/* Current Change */}
                <div className="bg-[#1f6feb]/15 border-l-4 border-[#1f6feb] p-2 rounded-r">
                  <div className="text-[#58a6ff] font-bold text-[11px] flex items-center justify-between">
                    <span>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (Current Change - main branch)</span>
                    <button
                      onClick={() => handleResolve('current')}
                      className="px-2 py-0.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded text-[10px] font-sans font-medium"
                    >
                      Accept Current
                    </button>
                  </div>
                  <div className="text-white mt-1 pl-2">5    const themeColor = "#2563eb"; // blue from main branch</div>
                </div>

                {/* Divider */}
                <div className="bg-[#30363d]/50 text-[#8b949e] py-1 px-2 font-bold select-none">
                  =======
                </div>

                {/* Incoming Change */}
                <div className="bg-[#8957e5]/15 border-l-4 border-[#8957e5] p-2 rounded-r">
                  <div className="text-[#bc8cff] font-bold text-[11px] flex items-center justify-between">
                    <span>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/red-theme (Incoming Change)</span>
                    <button
                      onClick={() => handleResolve('incoming')}
                      className="px-2 py-0.5 bg-[#8957e5] hover:bg-[#a371f7] text-white rounded text-[10px] font-sans font-medium"
                    >
                      Accept Incoming
                    </button>
                  </div>
                  <div className="text-white mt-1 pl-2">5    const themeColor = "#dc2626"; // red from feature/red-theme branch</div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="resolved-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#238636]/15 border-l-4 border-[#238636] p-3 rounded-r my-1"
              >
                <div className="text-[#3fb950] font-bold text-[11px] flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Conflict Resolved! Conflict markers removed:</span>
                </div>
                <div className="text-white font-semibold pl-2 whitespace-pre-wrap">
                  {getResolvedContent()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-[#8b949e]">6  { '};' }</div>
          <div className="text-[#8b949e]">7  export default config;</div>
        </div>

        {/* Action Bar */}
        <div className="bg-[#161b22] p-3 border-t border-[#30363d] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#8b949e]">
            {!isResolved ? 'Choose how you want Git to reconcile the conflicting line:' : 'All conflict markers cleaned up! Ready for commit.'}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {!isResolved ? (
              <>
                <button
                  onClick={() => handleResolve('current')}
                  className="px-3 py-1.5 bg-[#1f6feb]/20 hover:bg-[#1f6feb]/30 text-[#58a6ff] border border-[#1f6feb]/40 rounded-lg text-xs font-sans font-medium transition-colors"
                >
                  Keep Current (Blue)
                </button>
                <button
                  onClick={() => handleResolve('incoming')}
                  className="px-3 py-1.5 bg-[#8957e5]/20 hover:bg-[#8957e5]/30 text-[#bc8cff] border border-[#8957e5]/40 rounded-lg text-xs font-sans font-medium transition-colors"
                >
                  Keep Incoming (Red)
                </button>
                <button
                  onClick={() => handleResolve('both')}
                  className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded-lg text-xs font-sans font-medium transition-colors"
                >
                  Keep Both Changes
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#3fb950] bg-[#238636]/20 px-2.5 py-1 rounded-lg border border-[#238636]/40 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> git add &amp; git commit -m "Merge resolved"
                </span>
                <button
                  onClick={resetConflict}
                  className="px-3 py-1 bg-[#21262d] hover:bg-[#30363d] text-xs text-[#8b949e] hover:text-white rounded-lg border border-[#30363d]"
                >
                  Try Another Option
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3 Step Resolution Rulebox */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
          <span className="text-[11px] font-mono text-[#58a6ff] font-semibold block mb-1">Step 1: Inspect Markers</span>
          <p className="text-xs text-[#8b949e]">
            Locate all files marked as <code className="text-[#c9d1d9]">both modified</code> with <code className="text-[#c9d1d9]">git status</code>. Look for <code className="text-[#58a6ff]">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code>.
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
          <span className="text-[11px] font-mono text-[#3fb950] font-semibold block mb-1">Step 2: Choose Final Code</span>
          <p className="text-xs text-[#8b949e]">
            Decide whether to keep current, incoming, or combine both. Delete all marker lines (<code className="text-[#c9d1d9]">&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code className="text-[#c9d1d9]">=======</code>, <code className="text-[#c9d1d9]">&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>).
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d]">
          <span className="text-[11px] font-mono text-[#bc8cff] font-semibold block mb-1">Step 3: Stage &amp; Commit</span>
          <p className="text-xs text-[#8b949e]">
            Run <code className="text-[#c9d1d9]">git add &lt;file&gt;</code> and complete the merge with <code className="text-[#c9d1d9]">git commit</code>. Git creates the merge commit automatically.
          </p>
        </div>
      </div>
    </div>
  );
};
