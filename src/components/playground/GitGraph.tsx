import React from 'react';
import { CommitNode, BranchInfo } from '../../types/git';
import { GitCommit, GitBranch, ArrowDown } from 'lucide-react';

interface GitGraphProps {
  commits: CommitNode[];
  branches: Record<string, BranchInfo>;
  currentBranch: string;
  headCommitHash: string | null;
  onSelectCommit?: (commit: CommitNode) => void;
}

export const GitGraph: React.FC<GitGraphProps> = ({
  commits,
  branches,
  currentBranch,
  headCommitHash,
  onSelectCommit
}) => {
  // Sort commits chronologically for top-to-bottom or left-to-right display
  // We'll display them top-to-bottom or horizontal graph with branch lanes
  const branchNames = Object.keys(branches);

  // Compute lanes
  const getBranchLane = (branch: string) => {
    const idx = branchNames.indexOf(branch);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#58a6ff]" />
          <span className="font-semibold text-xs text-white uppercase tracking-wider">
            Live Commit Graph
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#8b949e]">HEAD:</span>
          <span className="bg-[#21262d] text-[#58a6ff] px-2 py-0.5 rounded border border-[#30363d]">
            {currentBranch} ({headCommitHash?.slice(0, 7) || 'empty'})
          </span>
        </div>
      </div>

      {commits.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8b949e] font-mono">
          No commits in repository yet. Run <code className="text-[#58a6ff]">git commit -m "..."</code>
        </div>
      ) : (
        <div className="min-w-[500px] relative py-2">
          {/* Commit Nodes Table / List */}
          <div className="space-y-4">
            {commits.slice().reverse().map((commit, index) => {
              const isHead = commit.hash === headCommitHash;
              const matchingBranches = Object.values(branches).filter(b => b.commitHash === commit.hash);
              const branchColor = branches[commit.branch]?.color || '#58a6ff';

              return (
                <div 
                  key={commit.hash}
                  onClick={() => onSelectCommit && onSelectCommit(commit)}
                  className={`flex items-start gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
                    isHead 
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb]/40 shadow-sm' 
                      : 'bg-[#161b22] border-[#30363d]/70 hover:border-[#8b949e]'
                  }`}
                >
                  {/* Graph node marker */}
                  <div className="flex flex-col items-center pt-0.5">
                    <div 
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isHead ? 'border-white shadow-md' : 'border-current'
                      }`}
                      style={{ backgroundColor: branchColor, color: branchColor }}
                    />
                    {index < commits.length - 1 && (
                      <div className="w-0.5 h-8 bg-[#30363d] my-1" />
                    )}
                  </div>

                  {/* Commit info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {commit.hash}
                      </span>

                      {/* Branch labels pointing here */}
                      {matchingBranches.map(b => (
                        <span 
                          key={b.name}
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-white shadow-sm flex items-center gap-1"
                          style={{ backgroundColor: b.color }}
                        >
                          <GitBranch className="w-3 h-3" />
                          {b.name}
                          {b.name === currentBranch && ' (HEAD)'}
                        </span>
                      ))}

                      {commit.isRemote && (
                        <span className="bg-[#21262d] text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded text-[10px] font-mono">
                          origin/{commit.branch}
                        </span>
                      )}

                      <span className="text-[11px] text-[#8b949e] ml-auto font-mono">
                        {commit.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#c9d1d9] mt-1 font-mono truncate">
                      {commit.message}
                    </p>

                    <div className="text-[10px] text-[#8b949e] font-mono mt-1 flex items-center gap-2">
                      <span>Author: {commit.author}</span>
                      {commit.parents.length > 0 && (
                        <span>Parent: {commit.parents.map(p => p.slice(0, 7)).join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
