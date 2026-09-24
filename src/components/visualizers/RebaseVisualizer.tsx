import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, RotateCcw, ArrowRight, Play, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RebaseVisualizer: React.FC = () => {
  // 0: Initial divergent state (C1 -> C2 -> C3 on main, C1 -> D -> E on feature)
  // 1: Rebase starts: Save D and E as temporary patches, rewind feature to C3
  // 2: Replay D on top of C3 -> D' (new hash)
  // 3: Replay E on top of D' -> E' (new hash)
  // 4: Rebase complete: linear history achieved
  const [step, setStep] = useState<number>(0);

  const reset = () => setStep(0);
  const next = () => setStep(prev => (prev < 4 ? prev + 1 : 0));

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GitPullRequest className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">git rebase Step-by-Step Animator</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            Watch how Git lifts your branch commits, rewinds HEAD to target branch tip, and replays each commit as a brand-new SHA hash.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={next}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#8957e5] hover:bg-[#a371f7] text-white shadow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {step === 4 ? 'Restart Rebase' : `Step ${step + 1}: Next`}
          </button>
        </div>
      </div>

      {/* Stepper indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
        <div className={`p-2.5 rounded-lg border ${step === 0 ? 'bg-purple-500/10 border-purple-500/40 text-purple-300' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
          1. Diverged Branches
        </div>
        <div className={`p-2.5 rounded-lg border ${step === 1 ? 'bg-purple-500/10 border-purple-500/40 text-purple-300' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
          2. Save Patches &amp; Rewind
        </div>
        <div className={`p-2.5 rounded-lg border ${step === 2 || step === 3 ? 'bg-purple-500/10 border-purple-500/40 text-purple-300' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
          3. Replay Commits (D', E')
        </div>
        <div className={`p-2.5 rounded-lg border ${step === 4 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>
          4. Linear History!
        </div>
      </div>

      {/* Graph Display */}
      <div className="bg-[#0d1117] rounded-xl p-6 border border-[#30363d] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e] mb-4">
          <span>Command: <code className="text-purple-400 font-bold">git checkout feature &amp;&amp; git rebase main</code></span>
          <span className="bg-[#21262d] px-2 py-0.5 rounded text-[11px]">
            {step === 4 ? 'Result: Linear Tree' : 'In Progress...'}
          </span>
        </div>

        <div className="relative py-6 flex items-center justify-center">
          <svg className="w-full max-w-2xl h-44" viewBox="0 0 650 160">
            {/* Main branch line */}
            <line x1="50" y1="50" x2="330" y2="50" stroke="#58a6ff" strokeWidth="4" />
            {step === 4 && (
              <line x1="330" y1="50" x2="570" y2="50" stroke="#bc8cff" strokeWidth="4" />
            )}

            {/* Feature branch line (before rebase) */}
            {step < 4 && (
              <>
                <path d="M 120 50 C 160 50, 170 120, 210 120" fill="none" stroke="#bc8cff" strokeWidth="3" />
                <line x1="210" y1="120" x2="330" y2="120" stroke="#bc8cff" strokeWidth="3" />
              </>
            )}

            {/* Commits on main */}
            {/* C1: Base */}
            <circle cx="120" cy="50" r="13" fill="#21262d" stroke="#58a6ff" strokeWidth="3" />
            <text x="120" y="26" textAnchor="middle" fill="#8b949e" fontSize="11" fontFamily="monospace">C1</text>

            {/* C2: Main */}
            <circle cx="220" cy="50" r="13" fill="#21262d" stroke="#58a6ff" strokeWidth="3" />
            <text x="220" y="26" textAnchor="middle" fill="#8b949e" fontSize="11" fontFamily="monospace">C2</text>

            {/* C3: Tip of Main */}
            <circle cx="320" cy="50" r="13" fill="#1f6feb" stroke="#fff" strokeWidth="2" />
            <text x="320" y="26" textAnchor="middle" fill="#58a6ff" fontSize="11" fontWeight="bold" fontFamily="monospace">C3</text>
            <text x="320" y="80" textAnchor="middle" fill="#58a6ff" fontSize="9" fontFamily="monospace">main</text>

            {/* Original feature commits (D and E) */}
            {step < 4 && (
              <>
                <circle 
                  cx="210" 
                  cy="120" 
                  r="13" 
                  fill={step >= 2 ? '#30363d' : '#8957e5'} 
                  stroke={step >= 2 ? '#484f58' : '#bc8cff'} 
                  strokeWidth="2" 
                />
                <text x="210" y="146" textAnchor="middle" fill={step >= 2 ? '#6e7681' : '#bc8cff'} fontSize="11" fontFamily="monospace">
                  D
                </text>

                <circle 
                  cx="310" 
                  cy="120" 
                  r="13" 
                  fill={step >= 3 ? '#30363d' : '#8957e5'} 
                  stroke={step >= 3 ? '#484f58' : '#bc8cff'} 
                  strokeWidth="2" 
                />
                <text x="310" y="146" textAnchor="middle" fill={step >= 3 ? '#6e7681' : '#bc8cff'} fontSize="11" fontFamily="monospace">
                  E
                </text>
                {step < 2 && (
                  <text x="310" y="160" textAnchor="middle" fill="#bc8cff" fontSize="9" fontFamily="monospace">feature</text>
                )}
              </>
            )}

            {/* Replayed Commits D' and E' */}
            {step >= 2 && (
              <g>
                <line x1="320" y1="50" x2="430" y2="50" stroke="#bc8cff" strokeWidth="4" />
                <circle cx="430" cy="50" r="13" fill="#8957e5" stroke="#fff" strokeWidth="2" />
                <text x="430" y="26" textAnchor="middle" fill="#bc8cff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  D' (New SHA)
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <line x1="430" y1="50" x2="540" y2="50" stroke="#bc8cff" strokeWidth="4" />
                <circle cx="540" cy="50" r="13" fill="#8957e5" stroke="#fff" strokeWidth="2" />
                <text x="540" y="26" textAnchor="middle" fill="#bc8cff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  E' (New SHA)
                </text>
                <text x="540" y="80" textAnchor="middle" fill="#bc8cff" fontSize="9" fontFamily="monospace">
                  feature (HEAD)
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Dynamic Explanation Box */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] text-xs">
          {step === 0 && (
            <p className="text-[#c9d1d9]">
              <strong className="text-white">State 1:</strong> Both branches diverged from <code className="text-[#58a6ff]">C1</code>. <code className="text-[#58a6ff]">main</code> has commits C2 and C3, while <code className="text-[#bc8cff]">feature</code> has commits D and E.
            </p>
          )}
          {step === 1 && (
            <p className="text-purple-300">
              <strong className="text-white">State 2:</strong> Git temporarily stores commits D and E as patch files in memory, and fast-forwards the feature branch base to point directly to <code className="text-[#58a6ff]">C3</code>.
            </p>
          )}
          {step === 2 && (
            <p className="text-purple-300">
              <strong className="text-white">State 3:</strong> Git applies patch D onto C3. Because the parent changed from C1 to C3, the cryptographic checksum changes: commit <strong className="text-white">D</strong> becomes <strong className="text-[#bc8cff]">D'</strong>!
            </p>
          )}
          {step === 3 && (
            <p className="text-purple-300">
              <strong className="text-white">State 4:</strong> Git applies patch E onto D'. Commit <strong className="text-white">E</strong> becomes <strong className="text-[#bc8cff]">E'</strong>, and the <code className="text-[#bc8cff]">feature</code> pointer moves to E'.
            </p>
          )}
          {step === 4 && (
            <p className="text-[#3fb950] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                <strong className="text-white">Rebase Complete:</strong> History is now completely linear (<code className="text-white">C1 → C2 → C3 → D' → E'</code>). No unnecessary merge bubbles!
              </span>
            </p>
          )}
        </div>
      </div>

      {/* The Golden Rule of Rebase Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-[#c9d1d9] space-y-1">
          <h4 className="font-bold text-amber-300 uppercase tracking-wide">The Golden Rule of Git Rebase</h4>
          <p>
            <strong className="text-white">Do not rebase commits that other people may already depend on.</strong> Rebase creates new commit IDs. Rebasing your own pushed feature branch can be acceptable when the team agrees and you update it with <code className="text-[#58a6ff]">git push --force-with-lease</code>; rewriting a shared branch such as <code className="text-[#58a6ff]">main</code> is dangerous.
          </p>
        </div>
      </div>
    </div>
  );
};
