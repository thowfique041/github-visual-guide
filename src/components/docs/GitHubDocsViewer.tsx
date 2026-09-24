import React, { useState } from 'react';
import { GITHUB_DOCS_DATA, DocSection } from '../../data/githubDocsData';
import { COMMANDS_DATA } from '../../data/commandsData';
import { CommandItem } from '../../types/git';
import { 
  Github, 
  BookOpen, 
  Search, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  GitPullRequest, 
  Workflow, 
  Sparkles, 
  ExternalLink,
  Layers,
  AlertTriangle,
  GitBranch,
  RotateCcw
} from 'lucide-react';

export const GitHubDocsViewer: React.FC = () => {
  const [docType, setDocType] = useState<'commands' | 'github'>('commands');
  const [selectedDocId, setSelectedDocId] = useState<string>(GITHUB_DOCS_DATA[0].id);
  const [selectedCommandId, setSelectedCommandId] = useState<string>(COMMANDS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeDoc = GITHUB_DOCS_DATA.find(d => d.id === selectedDocId) || GITHUB_DOCS_DATA[0];
  const activeCommand = COMMANDS_DATA.find(c => c.id === selectedCommandId) || COMMANDS_DATA[0];

  const filteredDocs = GITHUB_DOCS_DATA.filter(doc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.keyPoints.some(k => k.toLowerCase().includes(q))
    );
  });

  const filteredCommands = COMMANDS_DATA.filter(cmd => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.syntax.toLowerCase().includes(q) ||
      cmd.shortDesc.toLowerCase().includes(q) ||
      cmd.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Github className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Complete Offline Documentation &amp; Reference</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            Browse all {COMMANDS_DATA.length} Git commands and essential GitHub workflow guides locally without leaving the application.
          </p>
        </div>

        {/* Top Toggle Switcher: Commands Docs vs GitHub Manual */}
        <div className="flex items-center gap-2 bg-[#0d1117] p-1.5 rounded-xl border border-[#30363d]">
          <button
            onClick={() => { setDocType('commands'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              docType === 'commands'
                ? 'bg-[#1f6feb] text-white shadow'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Git Commands ({COMMANDS_DATA.length})</span>
          </button>

          <button
            onClick={() => { setDocType('github'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              docType === 'github'
                ? 'bg-[#8957e5] text-white shadow'
                : 'text-[#8b949e] hover:text-white'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Guides ({GITHUB_DOCS_DATA.length})</span>
          </button>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={docType === 'commands' ? 'Search 39 commands...' : 'Search GitHub guides...'}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors font-mono"
            />
          </div>

          {/* List Section */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-2 space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto">
            {docType === 'commands' ? (
              filteredCommands.map(cmd => {
                const isSelected = cmd.id === activeCommand.id;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => setSelectedCommandId(cmd.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#1f6feb]/15 border-[#1f6feb]/50 text-white shadow-sm'
                        : 'bg-[#0d1117]/60 border-[#30363d]/60 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0d1117]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-[#58a6ff] uppercase">{cmd.category}</span>
                      <span className="text-[#8b949e]">{cmd.difficulty}</span>
                    </div>
                    <code className="text-xs font-mono font-bold text-white block truncate">
                      {cmd.name}
                    </code>
                    <p className="text-[11px] text-[#8b949e] line-clamp-1 mt-0.5">
                      {cmd.shortDesc}
                    </p>
                  </button>
                );
              })
            ) : (
              filteredDocs.map(doc => {
                const isSelected = doc.id === activeDoc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#8957e5]/15 border-[#8957e5]/50 text-white shadow-sm'
                        : 'bg-[#0d1117]/60 border-[#30363d]/60 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#0d1117]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-purple-400 uppercase">{doc.category}</span>
                      <span className="flex items-center gap-1 text-[#8b949e]">
                        <Clock className="w-3 h-3" /> {doc.readTime}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white truncate">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-[#8b949e] line-clamp-1 mt-0.5">
                      {doc.summary}
                    </p>
                  </button>
                );
              })
            )}

            {((docType === 'commands' && filteredCommands.length === 0) ||
              (docType === 'github' && filteredDocs.length === 0)) && (
              <div className="p-6 text-center text-xs text-[#8b949e] font-mono">
                No items match "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Content Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 space-y-6">
          {docType === 'commands' ? (
            /* Command Documentation View */
            <div className="space-y-6">
              <div className="border-b border-[#30363d] pb-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase bg-[#21262d] text-[#58a6ff] px-2.5 py-0.5 rounded border border-[#30363d]">
                    {activeCommand.category}
                  </span>
                  <span className="text-xs font-mono uppercase bg-[#21262d] text-[#8b949e] px-2.5 py-0.5 rounded border border-[#30363d]">
                    {activeCommand.difficulty}
                  </span>
                </div>

                <h1 className="text-2xl font-bold font-mono text-white tracking-tight">
                  {activeCommand.name}
                </h1>

                <p className="text-sm text-[#8b949e] leading-relaxed">
                  {activeCommand.shortDesc}
                </p>
              </div>

              {/* Syntax Box */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8b949e] block">
                  Command Syntax
                </span>
                <div className="bg-[#0d1117] p-3.5 rounded-xl border border-[#30363d] font-mono text-xs text-[#58a6ff] flex items-center justify-between">
                  <pre className="overflow-x-auto whitespace-pre-wrap">{activeCommand.syntax}</pre>
                  <button
                    onClick={() => handleCopy(activeCommand.syntax)}
                    className="p-1.5 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white border border-[#30363d] transition-colors shrink-0 ml-3"
                    title="Copy Syntax"
                  >
                    {copiedCode === activeCommand.syntax ? (
                      <Check className="w-4 h-4 text-[#3fb950]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8b949e] block">
                  How Git Executes It
                </span>
                <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed bg-[#0d1117] p-4 rounded-xl border border-[#30363d]/60">
                  {activeCommand.longDesc}
                </p>
              </div>

              {/* Before & After Visual States */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8b949e] block">
                  Before vs After State Transition
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-amber-500/30">
                    <span className="text-amber-400 font-bold block mb-1">BEFORE: {activeCommand.beforeState.title}</span>
                    <p className="text-[#8b949e] leading-relaxed text-[11px]">{activeCommand.beforeState.description}</p>
                  </div>
                  <div className="bg-[#0d1117] p-4 rounded-xl border border-emerald-500/30">
                    <span className="text-[#3fb950] font-bold block mb-1">AFTER: {activeCommand.afterState.title}</span>
                    <p className="text-[#8b949e] leading-relaxed text-[11px]">{activeCommand.afterState.description}</p>
                  </div>
                </div>
              </div>

              {/* Common Pitfalls */}
              {activeCommand.commonMistakes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Common Mistakes
                  </span>
                  <div className="space-y-2">
                    {activeCommand.commonMistakes.map((m, i) => (
                      <div key={i} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-[#c9d1d9] leading-relaxed">
                        ⚠️ {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Commands */}
              {activeCommand.relatedCommands.length > 0 && (
                <div className="pt-2 border-t border-[#30363d] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[#8b949e]">Related commands:</span>
                  {activeCommand.relatedCommands.map(rc => (
                    <button
                      key={rc}
                      onClick={() => {
                        const target = COMMANDS_DATA.find(c => c.name.toLowerCase().includes(rc.toLowerCase()));
                        if (target) setSelectedCommandId(target.id);
                      }}
                      className="px-2.5 py-1 rounded bg-[#0d1117] hover:bg-[#21262d] text-xs font-mono text-[#58a6ff] border border-[#30363d]"
                    >
                      {rc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* GitHub Guides View */
            <div className="space-y-6">
              <div className="border-b border-[#30363d] pb-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase bg-[#21262d] text-purple-400 px-2.5 py-0.5 rounded border border-[#30363d]">
                    {activeDoc.category}
                  </span>
                  <span className="text-xs font-mono text-[#8b949e] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {activeDoc.readTime} read
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {activeDoc.title}
                </h1>

                <p className="text-sm text-[#8b949e] leading-relaxed">
                  {activeDoc.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#3fb950] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {activeDoc.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#c9d1d9] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body Content */}
              <div className="space-y-4 text-xs sm:text-sm text-[#c9d1d9] leading-relaxed whitespace-pre-wrap font-sans">
                {activeDoc.content}
              </div>

              {/* CLI & Terminal Snippets */}
              {activeDoc.cliExamples && activeDoc.cliExamples.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#30363d]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#58a6ff] font-bold flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" /> Common Commands &amp; GitHub CLI (gh)
                  </h3>

                  <div className="space-y-2.5">
                    {activeDoc.cliExamples.map((ex, idx) => (
                      <div key={idx} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3">
                        <div className="text-[11px] text-[#8b949e] font-mono mb-1.5 flex items-center justify-between">
                          <span>{ex.label}</span>
                          <button
                            onClick={() => handleCopy(ex.code)}
                            className="text-[#8b949e] hover:text-white flex items-center gap-1 transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === ex.code ? (
                              <span className="text-[#3fb950] flex items-center gap-1 text-[10px]">
                                <Check className="w-3 h-3" /> Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px]">
                                <Copy className="w-3 h-3" /> Copy
                              </span>
                            )}
                          </button>
                        </div>
                        <code className="text-xs font-mono text-[#58a6ff] block overflow-x-auto whitespace-pre-wrap">
                          $ {ex.code}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
