import React, { useState } from 'react';
import { GitEngineState, SimulatedFile } from '../../types/git';
import { createInitialGitState, executeGitCommand } from '../../core/gitEngine';
import { GitGraph } from './GitGraph';
import { TerminalSimulator } from '../terminal/TerminalSimulator';
import { 
  Folder, 
  RotateCcw, 
  Layers, 
  FileCode, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Archive,
  CloudUpload
} from 'lucide-react';

export const GitPlayground: React.FC = () => {
  const [gitState, setGitState] = useState<GitEngineState>(createInitialGitState());

  const handleCommand = (rawCmd: string) => {
    const { newState } = executeGitCommand(gitState, rawCmd);
    setGitState(newState);
  };

  const resetPlayground = () => {
    setGitState(createInitialGitState());
  };

  // Quick Action Buttons
  const triggerAdd = () => handleCommand('git add .');
  const triggerCommit = () => handleCommand(`git commit -m "feat: updated components"`);
  const triggerPush = () => handleCommand('git push');
  const triggerStash = () => handleCommand('git stash');
  const triggerStashPop = () => handleCommand('git stash pop');

  const stagedFiles = gitState.workingFiles.filter(f => f.status === 'staged');
  const modifiedFiles = gitState.workingFiles.filter(f => f.status === 'modified' || f.status === 'untracked');

  return (
    <div className="space-y-6">
      {/* Playground Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950] animate-pulse" />
            <h2 className="text-xl font-bold text-white tracking-tight">Interactive Git Playground &amp; Graph</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            Type real Git commands in the terminal or use quick buttons to watch your branches, commits, and file states transform live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetPlayground}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Playground
          </button>
        </div>
      </div>

      {/* Quick Visual Trigger Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={triggerAdd}
          className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/50 hover:bg-[#238636]/10 text-left transition-all group"
        >
          <div className="text-[10px] font-mono text-[#3fb950] uppercase font-semibold">1. Stage Files</div>
          <div className="text-xs font-mono text-white font-bold group-hover:text-[#3fb950] transition-colors">
            git add .
          </div>
        </button>

        <button
          onClick={triggerCommit}
          className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-sky-500/50 hover:bg-[#1f6feb]/10 text-left transition-all group"
        >
          <div className="text-[10px] font-mono text-[#58a6ff] uppercase font-semibold">2. Save Snapshot</div>
          <div className="text-xs font-mono text-white font-bold group-hover:text-[#58a6ff] transition-colors">
            git commit -m
          </div>
        </button>

        <button
          onClick={triggerPush}
          className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-purple-500/50 hover:bg-[#8957e5]/10 text-left transition-all group"
        >
          <div className="text-[10px] font-mono text-[#bc8cff] uppercase font-semibold">3. Sync Cloud</div>
          <div className="text-xs font-mono text-white font-bold group-hover:text-[#bc8cff] transition-colors">
            git push
          </div>
        </button>

        <button
          onClick={triggerStash}
          className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-amber-500/50 hover:bg-amber-500/10 text-left transition-all group"
        >
          <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold">4. Shelve Work</div>
          <div className="text-xs font-mono text-white font-bold group-hover:text-amber-400 transition-colors">
            git stash
          </div>
        </button>

        <button
          onClick={triggerStashPop}
          className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-teal-500/50 hover:bg-teal-500/10 text-left transition-all group col-span-2 sm:col-span-1"
        >
          <div className="text-[10px] font-mono text-teal-400 uppercase font-semibold">5. Restore Stash</div>
          <div className="text-xs font-mono text-white font-bold group-hover:text-teal-400 transition-colors">
            git stash pop
          </div>
        </button>
      </div>

      {/* Main Playground Workspace: Terminal + Git Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <TerminalSimulator
            history={gitState.terminalHistory}
            onExecute={handleCommand}
            currentBranch={gitState.currentBranch}
          />

          {/* Staging / Working Directory Inspector */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <h4 className="text-xs font-mono text-[#8b949e] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Workspace &amp; Staging Inspector</span>
              <span className="text-[11px] text-[#58a6ff]">Branch: {gitState.currentBranch}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Working Tree Changes */}
              <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                <div className="flex items-center justify-between text-xs font-mono text-[#8b949e] mb-2">
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Folder className="w-3.5 h-3.5" /> Working Tree
                  </span>
                  <span>{modifiedFiles.length} file(s)</span>
                </div>

                <div className="space-y-1.5 min-h-[70px]">
                  {modifiedFiles.length === 0 ? (
                    <span className="text-[11px] text-[#8b949e] italic block py-4 text-center">Clean working tree</span>
                  ) : (
                    modifiedFiles.map(f => (
                      <div key={f.name} className="flex items-center justify-between text-xs font-mono bg-[#161b22] px-2.5 py-1.5 rounded border border-[#30363d]/60">
                        <span className="text-white">{f.name}</span>
                        <span className="text-[10px] text-amber-400 uppercase font-semibold">{f.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Staging Area */}
              <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d]">
                <div className="flex items-center justify-between text-xs font-mono text-[#8b949e] mb-2">
                  <span className="flex items-center gap-1.5 text-[#3fb950] font-medium">
                    <Layers className="w-3.5 h-3.5" /> Staging Area (Index)
                  </span>
                  <span>{stagedFiles.length} file(s)</span>
                </div>

                <div className="space-y-1.5 min-h-[70px]">
                  {stagedFiles.length === 0 ? (
                    <span className="text-[11px] text-[#8b949e] italic block py-4 text-center">Nothing staged (run git add)</span>
                  ) : (
                    stagedFiles.map(f => (
                      <div key={f.name} className="flex items-center justify-between text-xs font-mono bg-[#161b22] px-2.5 py-1.5 rounded border border-[#30363d]/60">
                        <span className="text-white">{f.name}</span>
                        <span className="text-[10px] text-[#3fb950] uppercase font-semibold">staged</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Stash Shelf (if any) */}
            {gitState.stashes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#30363d]/60 flex items-center justify-between text-xs font-mono bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg">
                <div className="flex items-center gap-2 text-amber-300">
                  <Archive className="w-4 h-4" />
                  <span>Stash Stack ({gitState.stashes.length} item): <code className="text-white">stash@&#123;0&#125;</code></span>
                </div>
                <button
                  onClick={triggerStashPop}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-[11px]"
                >
                  Pop Stash
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Git Graph (5 cols) */}
        <div className="lg:col-span-5">
          <GitGraph
            commits={gitState.commits}
            branches={gitState.branches}
            currentBranch={gitState.currentBranch}
            headCommitHash={gitState.headCommitHash}
          />
        </div>
      </div>
    </div>
  );
};
