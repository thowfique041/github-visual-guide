import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, Copy, Search, ShieldAlert, Stethoscope } from 'lucide-react';
import { TROUBLESHOOTING_GUIDES, RiskLevel } from '../../data/troubleshootingData';

const riskStyle: Record<RiskLevel, string> = {
  safe: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  caution: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
  danger: 'border-red-500/30 bg-red-500/5 text-red-300'
};

export const ProblemSolver: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(TROUBLESHOOTING_GUIDES[0].id);
  const [copied, setCopied] = useState('');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TROUBLESHOOTING_GUIDES;
    return TROUBLESHOOTING_GUIDES.filter(g =>
      [g.title, g.explanation, ...g.symptoms, ...g.tags].join(' ').toLowerCase().includes(q)
    );
  }, [query]);
  const selected = TROUBLESHOOTING_GUIDES.find(g => g.id === selectedId) || matches[0];

  const copy = async (key: string, lines: string[]) => {
    await navigator.clipboard.writeText(lines.filter(x => !x.startsWith('#')).join('\n'));
    setCopied(key); window.setTimeout(() => setCopied(''), 1400);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"><Stethoscope className="w-5 h-5" /></span>
          <div><h1 className="text-xl font-bold text-white">Git & GitHub Problem Solver</h1><p className="text-sm text-[#8b949e]">Paste an error message or describe what went wrong. Diagnose first, then choose the safest recovery.</p></div>
        </div>
        <div className="relative"><Search className="absolute left-3 top-3 w-4 h-4 text-[#8b949e]"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try: non-fast-forward, detached HEAD, secret pushed, authentication failed…" className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#58a6ff]" /></div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-5">
        <aside className="rounded-2xl border border-[#30363d] bg-[#161b22] p-3 space-y-2 h-fit">
          <div className="px-2 py-1 text-xs font-mono text-[#8b949e]">{matches.length} matching playbook{matches.length === 1 ? '' : 's'}</div>
          {matches.map(g => <button key={g.id} onClick={() => setSelectedId(g.id)} className={`w-full text-left p-3 rounded-xl border transition-all ${selected?.id === g.id ? 'border-[#58a6ff] bg-[#1f6feb]/10' : 'border-transparent bg-[#0d1117] hover:border-[#30363d]'}`}><span className="text-sm font-semibold text-white block">{g.title}</span><span className="text-[11px] text-[#8b949e] mt-1 block truncate">{g.symptoms.join(' · ')}</span></button>)}
          {!matches.length && <div className="p-5 text-center text-sm text-[#8b949e]">No exact match. Try a shorter part of the error message.</div>}
        </aside>

        {selected && <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 space-y-5">
          <div><h2 className="text-xl font-bold text-white">{selected.title}</h2><p className="text-sm text-[#c9d1d9] mt-2 leading-relaxed">{selected.explanation}</p></div>
          <div><h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-2">1 · Confirm the state</h3><div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3 font-mono text-xs text-[#58a6ff] space-y-1">{selected.diagnose.map(x => <div key={x}>$ {x}</div>)}</div></div>
          <div className="space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">2 · Choose a recovery path</h3>{selected.solutions.map((s, i) => <div key={s.label} className={`rounded-xl border p-4 ${riskStyle[s.risk]}`}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2">{s.risk === 'danger' ? <ShieldAlert className="w-4 h-4"/> : s.risk === 'caution' ? <AlertTriangle className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}<h4 className="font-semibold text-white">{s.label}</h4><span className="uppercase text-[10px] font-bold">{s.risk}</span></div><button onClick={() => copy(`${selected.id}-${i}`, s.commands)} className="p-1.5 rounded-lg border border-current/20 hover:bg-white/5" aria-label="Copy commands">{copied === `${selected.id}-${i}` ? <CheckCircle2 className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}</button></div><div className="mt-3 rounded-lg bg-[#0d1117] p-3 font-mono text-xs text-[#c9d1d9] space-y-1">{s.commands.map(x => <div key={x} className={x.startsWith('#') ? 'text-[#8b949e]' : ''}>{x.startsWith('#') ? x : `$ ${x}`}</div>)}</div><p className="mt-2 text-xs text-[#c9d1d9] flex gap-1.5"><ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0"/>{s.note}</p></div>)}</div>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-[#c9d1d9]"><strong className="text-[#58a6ff]">Safety rule:</strong> Before reset, clean, force-push, or history rewrite, inspect <code>git status</code>, make a backup branch, and confirm whether commits are already shared.</div>
        </section>}
      </div>
    </div>
  );
};
