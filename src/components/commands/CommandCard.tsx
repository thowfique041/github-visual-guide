import React, { useState } from 'react';
import { CommandItem } from '../../types/git';
import { 
  Terminal, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Bookmark, 
  Layers, 
  Copy, 
  Check,
  Eye,
  ExternalLink,
  GitBranch
} from 'lucide-react';

interface CommandCardProps {
  command: CommandItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectCommand: (command: CommandItem) => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  isFavorite,
  onToggleFavorite,
  onSelectCommand
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(command.syntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'advanced':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-[#21262d] text-[#8b949e] border-[#30363d]';
    }
  };

  return (
    <div 
      onClick={() => onSelectCommand(command)}
      className="bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff]/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-[#58a6ff]/5 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(command.difficulty)}`}>
              {command.difficulty}
            </span>
            <span className="text-[10px] font-mono text-[#8b949e] uppercase">
              {command.category}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(command.id);
            }}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorite 
                ? 'bg-[#d29922]/20 border-[#d29922]/40 text-[#d29922]' 
                : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
            }`}
            title={isFavorite ? 'Remove from saved' : 'Save command'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Command Syntax Box */}
        <div className="bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] mb-3 flex items-center justify-between group-hover:border-[#58a6ff]/40 transition-colors">
          <code className="text-xs font-mono font-semibold text-[#58a6ff] truncate">
            {command.syntax.split('\n')[0]}
          </code>
          <button
            onClick={handleCopy}
            className="text-[#8b949e] hover:text-white p-1 rounded hover:bg-[#21262d] transition-colors shrink-0 ml-2"
            title="Copy command"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#c9d1d9] leading-relaxed line-clamp-2 mb-4">
          {command.shortDesc}
        </p>
      </div>

      {/* Before / After Preview Hint */}
      <div>
        <div className="bg-[#0d1117]/60 rounded-lg p-2.5 border border-[#30363d]/60 mb-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-[#8b949e] mb-1">
            <span className="text-amber-400">Before:</span>
            <span className="text-[#c9d1d9] truncate">{command.beforeState.title}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8b949e]">
            <span className="text-[#3fb950]">After:</span>
            <span className="text-[#c9d1d9] truncate">{command.afterState.title}</span>
          </div>
        </div>

        {/* Action link */}
        <div className="flex items-center justify-between text-xs text-[#58a6ff] pt-2 border-t border-[#30363d]/50 font-medium">
          <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View Visual Breakdown
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
