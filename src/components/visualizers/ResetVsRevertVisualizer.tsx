import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  History, 
  AlertOctagon, 
  CheckCircle, 
  Layers, 
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const ResetVsRevertVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reset' | 'revert'>('reset');
  const [resetMode, setResetMode] = useState<'soft' | 'mixed' | 'hard'>('mixed');
  const [hasExecuted, setHasExecuted] = useState<boolean>(false);

  const resetAll = () => {
    setHasExecuted(false);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">git reset vs git revert</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            The ultimate visual comparison: Understand when to rewrite history (Reset) vs create safe forward undo snapshots (Revert).
          </p>
        </div>

        <button
          onClick={resetAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Timeline
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 bg-[#0d1117] p-1.5 rounded-xl border border-[#30363d] w-fit">
        <button
          onClick={() => { setActiveTab('reset'); setHasExecuted(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'reset'
              ? 'bg-[#1f6feb] text-white shadow-md'
              : 'text-[#8b949e] hover:text-white'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          git reset (Rewind Pointer)
        </button>
        <button
          onClick={() => { setActiveTab('revert'); setHasExecuted(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'revert'
              ? 'bg-[#238636] text-white shadow-md'
              : 'text-[#8b949e] hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          git revert (New Inverse Commit)
        </button>
      </div>

      {/* Sub-controls for Reset modes */}
      {activeTab === 'reset' && (
        <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8b949e] font-mono">Select reset mode:</span>
            {(['soft', 'mixed', 'hard'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setResetMode(mode); setHasExecuted(false); }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium border transition-all ${
                  resetMode === mode
                    ? mode === 'hard' 
                      ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                      : 'bg-[#58a6ff]/20 text-[#58a6ff] border-[#58a6ff]/40'
                    : 'bg-[#161b22] text-[#8b949e] border-[#30363d] hover:text-white'
                }`}
              >
                --{mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setHasExecuted(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#1f6feb] hover:bg-[#388bfd] text-white shadow"
          >
            Run git reset --{resetMode} HEAD~1
          </button>
        </div>
      )}

      {activeTab === 'revert' && (
        <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3fb950]" />
            <span className="text-xs text-[#c9d1d9]">Safe for public shared branches (never rewrites published history).</span>
          </div>

          <button
            onClick={() => setHasExecuted(true)}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#238636] hover:bg-[#2ea043] text-white shadow"
          >
            Run git revert C3 (Undo C3)
          </button>
        </div>
      )}

      {/* Visual Timeline Diagram */}
      <div className="bg-[#0d1117] rounded-xl p-6 border border-[#30363d] relative overflow-hidden">
        <h4 className="text-xs font-mono text-[#8b949e] uppercase tracking-wider mb-6">
          Interactive Commit Timeline
        </h4>

        <div className="relative py-8 flex items-center justify-center">
          <svg className="w-full max-w-2xl h-36" viewBox="0 0 620 120">
            {/* Timeline base track */}
            <line x1="60" y1="50" x2="560" y2="50" stroke="#30363d" strokeWidth="4" />

            {/* Commit 1: C1 */}
            <circle cx="100" cy="50" r="14" fill="#21262d" stroke="#58a6ff" strokeWidth="3" />
            <text x="100" y="26" textAnchor="middle" fill="#8b949e" fontSize="11" fontFamily="monospace">C1</text>
            <text x="100" y="80" textAnchor="middle" fill="#8b949e" fontSize="9" fontFamily="monospace">Initial</text>

            {/* Commit 2: C2 */}
            <circle cx="260" cy="50" r="14" fill="#21262d" stroke="#58a6ff" strokeWidth="3" />
            <text x="260" y="26" textAnchor="middle" fill="#8b949e" fontSize="11" fontFamily="monospace">C2</text>
            <text x="260" y="80" textAnchor="middle" fill="#8b949e" fontSize="9" fontFamily="monospace">Working code</text>

            {/* Commit 3: C3 (The target of undo) */}
            <circle 
              cx="420" 
              cy="50" 
              r="14" 
              fill={hasExecuted && activeTab === 'reset' ? '#484f58' : '#da3633'} 
              stroke={hasExecuted && activeTab === 'reset' ? '#30363d' : '#f85149'} 
              strokeWidth="3" 
            />
            <text x="420" y="26" textAnchor="middle" fill={hasExecuted && activeTab === 'reset' ? '#6e7681' : '#f85149'} fontSize="11" fontWeight="bold" fontFamily="monospace">
              C3 (Buggy)
            </text>
            <text x="420" y="80" textAnchor="middle" fill={hasExecuted && activeTab === 'reset' ? '#6e7681' : '#f85149'} fontSize="9" fontFamily="monospace">
              {hasExecuted && activeTab === 'reset' ? 'Orphaned / Unreachable' : 'Bad commit'}
            </text>

            {/* HEAD pointer or Revert commit */}
            {activeTab === 'reset' && (
              <g>
                {/* Pointer to C2 if executed, otherwise C3 */}
                <path
                  d={hasExecuted ? "M 260 100 L 260 70" : "M 420 100 L 420 70"}
                  stroke="#58a6ff"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
                <text 
                  x={hasExecuted ? 260 : 420} 
                  y="115" 
                  textAnchor="middle" 
                  fill="#58a6ff" 
                  fontSize="11" 
                  fontWeight="bold" 
                  fontFamily="monospace"
                >
                  HEAD -&gt; main
                </text>
              </g>
            )}

            {activeTab === 'revert' && (
              <>
                {/* Forward Revert Commit */}
                {hasExecuted && (
                  <g>
                    <circle cx="560" cy="50" r="14" fill="#238636" stroke="#fff" strokeWidth="3" />
                    <text x="560" y="26" textAnchor="middle" fill="#3fb950" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      C4 (Revert C3)
                    </text>
                    <text x="560" y="80" textAnchor="middle" fill="#3fb950" fontSize="9" fontFamily="monospace">
                      Inverts C3
                    </text>
                    <path d="M 560 100 L 560 70" stroke="#3fb950" strokeWidth="3" />
                    <text x="560" y="115" textAnchor="middle" fill="#3fb950" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      HEAD -&gt; main
                    </text>
                  </g>
                )}

                {!hasExecuted && (
                  <g>
                    <path d="M 420 100 L 420 70" stroke="#58a6ff" strokeWidth="3" />
                    <text x="420" y="115" textAnchor="middle" fill="#58a6ff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                      HEAD -&gt; main
                    </text>
                  </g>
                )}
              </>
            )}
          </svg>
        </div>

        {/* State Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#30363d]/60">
          <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[10px] text-[#8b949e] uppercase font-mono block">Commit History</span>
            <p className="text-xs text-white font-mono mt-1">
              {activeTab === 'reset'
                ? hasExecuted ? 'Rewound back to C2 (C3 removed from branch)' : 'C1 -> C2 -> C3'
                : hasExecuted ? 'C1 -> C2 -> C3 -> C4 (Preserved & Appended)' : 'C1 -> C2 -> C3'}
            </p>
          </div>

          <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[10px] text-[#8b949e] uppercase font-mono block">Staging Area (Index)</span>
            <p className="text-xs text-white font-mono mt-1">
              {activeTab === 'reset'
                ? resetMode === 'soft' && hasExecuted
                  ? 'Contains C3 changes staged'
                  : 'Emptied'
                : 'Clean'}
            </p>
          </div>

          <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d]">
            <span className="text-[10px] text-[#8b949e] uppercase font-mono block">Working Directory Files</span>
            <p className="text-xs text-white font-mono mt-1">
              {activeTab === 'reset'
                ? resetMode === 'hard' && hasExecuted
                  ? 'Permanently Discarded!'
                  : hasExecuted ? 'Preserved as local uncommitted edits' : 'Unmodified'
                : hasExecuted ? 'Reverted smoothly back to safe state' : 'Contains C3 code'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse text-left">
          <thead>
            <tr className="border-b border-[#30363d] text-[#8b949e]">
              <th className="py-2 px-3">Command</th>
              <th className="py-2 px-3">HEAD Moves?</th>
              <th className="py-2 px-3">Staging Area</th>
              <th className="py-2 px-3">Working Tree</th>
              <th className="py-2 px-3">Safe for Remote?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#30363d]/50">
            <tr className="hover:bg-[#0d1117]/50">
              <td className="py-2.5 px-3 text-[#58a6ff] font-bold">git reset --soft</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Backward</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Preserved (staged)</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Preserved</td>
              <td className="py-2.5 px-3 text-red-400">❌ Only Local</td>
            </tr>
            <tr className="hover:bg-[#0d1117]/50">
              <td className="py-2.5 px-3 text-[#58a6ff] font-bold">git reset --mixed</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Backward</td>
              <td className="py-2.5 px-3 text-amber-400">Reset (unstaged)</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Preserved (unstaged)</td>
              <td className="py-2.5 px-3 text-red-400">❌ Only Local</td>
            </tr>
            <tr className="hover:bg-[#0d1117]/50">
              <td className="py-2.5 px-3 text-red-400 font-bold">git reset --hard</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Backward</td>
              <td className="py-2.5 px-3 text-red-400">Wiped completely</td>
              <td className="py-2.5 px-3 text-red-400">Wiped completely</td>
              <td className="py-2.5 px-3 text-red-400">❌ Only Local</td>
            </tr>
            <tr className="hover:bg-[#0d1117]/50 bg-[#238636]/5">
              <td className="py-2.5 px-3 text-[#3fb950] font-bold">git revert</td>
              <td className="py-2.5 px-3 text-[#58a6ff]">Forward (new commit)</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Clean</td>
              <td className="py-2.5 px-3 text-[#3fb950]">Safely updated</td>
              <td className="py-2.5 px-3 text-[#3fb950]">✔ Safe for Shared Branches</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
