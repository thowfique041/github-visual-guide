import React from 'react';
import { CommandItem } from '../../types/git';
import { 
  X, 
  Terminal, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Bookmark, 
  Layers, 
  Copy, 
  Check,
  ExternalLink,
  Code2
} from 'lucide-react';

interface CommandDetailModalProps {
  command: CommandItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectRelated: (commandName: string) => void;
}

export const CommandDetailModal: React.FC<CommandDetailModalProps> = ({
  command,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectRelated
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!command) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(command.example);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#30363d] flex items-start justify-between gap-4 bg-[#161b22]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase bg-[#21262d] text-[#58a6ff] px-2.5 py-0.5 rounded border border-[#30363d]">
                {command.category}
              </span>
              <span className="text-[11px] font-mono uppercase bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded border border-[#30363d]">
                {command.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
              {command.name}
            </h2>
            <p className="text-sm text-[#8b949e] mt-1">
              {command.shortDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(command.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isFavorite 
                  ? 'bg-[#d29922]/20 border-[#d29922]/40 text-[#d29922]' 
                  : 'bg-[#21262d] border-[#30363d] text-[#8b949e] hover:text-white'
              }`}
              title="Save command"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Syntax & Example Box */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8b949e]">
              Syntax &amp; Example Usage
            </h3>
            <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] font-mono text-xs flex items-center justify-between">
              <pre className="text-[#58a6ff] overflow-x-auto whitespace-pre-wrap">{command.syntax}</pre>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors shrink-0 ml-3"
                title="Copy Example"
              >
                {copied ? <Check className="w-4 h-4 text-[#3fb950]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Deep-dive Explanation */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8b949e]">
              Conceptual Behavior
            </h3>
            <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed bg-[#0d1117] p-4 rounded-xl border border-[#30363d]/60">
              {command.longDesc}
            </p>
          </div>

          {/* Before & After Interactive Comparison */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#8b949e]">
              Before &amp; After Git State
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Before */}
              <div className="bg-[#0d1117] p-4 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  BEFORE EXECUTION
                </div>
                <h4 className="text-white font-semibold mb-1">{command.beforeState.title}</h4>
                <p className="text-[#8b949e] leading-relaxed text-[11px]">
                  {command.beforeState.description}
                </p>
              </div>

              {/* After */}
              <div className="bg-[#0d1117] p-4 rounded-xl border border-emerald-500/30">
                <div className="flex items-center gap-2 text-[#3fb950] font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
                  AFTER EXECUTION
                </div>
                <h4 className="text-white font-semibold mb-1">{command.afterState.title}</h4>
                <p className="text-[#8b949e] leading-relaxed text-[11px]">
                  {command.afterState.description}
                </p>
              </div>
            </div>
          </div>

          {/* Common Pitfalls / Mistakes */}
          {command.commonMistakes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Common Mistakes &amp; Gotchas
              </h3>
              <div className="space-y-2">
                {command.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-[#c9d1d9] flex items-start gap-2.5">
                    <span className="text-red-400 font-bold font-mono">⚠️</span>
                    <span className="leading-relaxed">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Commands */}
          {command.relatedCommands.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#30363d]/60">
              <span className="text-xs font-mono text-[#8b949e]">Related commands:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {command.relatedCommands.map(rel => (
                  <button
                    key={rel}
                    onClick={() => onSelectRelated(rel)}
                    className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-xs font-mono text-[#58a6ff] border border-[#30363d] transition-colors"
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#161b22] border-t border-[#30363d] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-white border border-[#30363d] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
