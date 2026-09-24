import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, HelpCircle, Sparkles } from 'lucide-react';

interface TerminalSimulatorProps {
  history: { command: string; output: string; status: 'ok' | 'error' | 'info' }[];
  onExecute: (cmd: string) => void;
  currentBranch: string;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  history,
  onExecute,
  currentBranch,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onExecute(inputVal);
    setInputVal('');
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx].command);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(null);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx].command);
      }
    }
  };

  const quickCommands = [
    'git status',
    'git add .',
    'git commit -m "feat: new feature"',
    'git branch feature-x',
    'git switch feature-x',
    'git push',
    'git stash',
    'git stash pop',
  ];

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl flex flex-col h-[400px] overflow-hidden font-mono shadow-2xl">
      {/* Terminal Titlebar */}
      <div className="bg-[#161b22] px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#f85149]" />
            <span className="w-3 h-3 rounded-full bg-[#d29922]" />
            <span className="w-3 h-3 rounded-full bg-[#3fb950]" />
          </div>
          <span className="text-xs text-[#8b949e] font-semibold ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            bash — simulated git terminal
          </span>
        </div>

        <div className="text-[11px] text-[#8b949e]">
          branch: <span className="text-[#3fb950] font-bold">{currentBranch}</span>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div 
        className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="text-[#8b949e] border-b border-[#30363d]/60 pb-2">
          💡 Try running interactive git commands here! E.g. <code className="text-[#58a6ff]">git status</code>, <code className="text-[#58a6ff]">git add .</code>, <code className="text-[#58a6ff]">git commit -m "..."</code>, <code className="text-[#58a6ff]">git switch -c new-feature</code>, <code className="text-[#58a6ff]">git push</code>.
        </div>

        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[#3fb950] font-bold">user@dev:~/project</span>
              <span className="text-[#8b949e]">({currentBranch})</span>
              <span className="text-white">$ {entry.command}</span>
            </div>
            {entry.output && (
              <pre className={`pl-4 whitespace-pre-wrap ${
                entry.status === 'error' ? 'text-red-400' : entry.status === 'info' ? 'text-[#8b949e]' : 'text-[#c9d1d9]'
              }`}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick helper pills */}
      <div className="bg-[#161b22]/50 px-3 py-1.5 border-t border-[#30363d]/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-[#8b949e] flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-[#d29922]" /> Quick:
        </span>
        {quickCommands.map(cmd => (
          <button
            key={cmd}
            onClick={() => onExecute(cmd)}
            className="px-2 py-0.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[11px] text-[#c9d1d9] border border-[#30363d] shrink-0 transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Input Form */}
      <form onSubmit={handleSubmit} className="bg-[#161b22] px-3 py-2 border-t border-[#30363d] flex items-center gap-2">
        <span className="text-[#3fb950] font-bold text-xs">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type git command... (e.g. git add ., git commit -m '...')"
          className="flex-1 bg-transparent text-white text-xs outline-none placeholder-[#484f58]"
          autoFocus
        />
        <button
          type="submit"
          className="p-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
          title="Send command"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
