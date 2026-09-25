import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight,
  Circle, Cloud, Code2, FileCode2, FolderGit2, GitBranch, GitCommitHorizontal, Layers3,
  Menu, Play, RotateCcw, Send, Sparkles, Terminal, X,
} from 'lucide-react';
import { Lesson, lessons, modules, scenarioFor } from './curriculum';
import { createLabState, fileStatuses, LabCommit, LabResult, LabState, runLabCommand } from './engine';

type Phase = 'learn' | 'watch' | 'practice' | 'challenge' | 'complete';
type Entry = { command: string; output: string; ok: boolean };
const STORAGE = 'git_visual_lab_progress_v1';
const CURRENT_LESSON_STORAGE = 'git_visual_lab_current_lesson_v1';
const LESSON_ACTIVITY_STORAGE = 'git_visual_lab_lesson_activity_v1';
const PRIMARY = '#9d8cff';

type LessonActivity = Record<string, { visualizationCompleted?: boolean; practiceCompleted?: boolean }>;

function readLessonActivity(): LessonActivity {
  try {
    const parsed = JSON.parse(localStorage.getItem(LESSON_ACTIVITY_STORAGE) || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch { return {}; }
}

function initialLessonIndex(completed: string[]): number {
  const route = window.location.pathname.match(/^\/lesson\/(\d+)\/?$/);
  if (route) {
    const index = Number(route[1]) - 1;
    if (index >= 0 && index < lessons.length) return index;
  }
  let saved: string | null = null;
  try { saved = localStorage.getItem(CURRENT_LESSON_STORAGE); } catch { /* private browsing */ }
  const savedIndex = saved ? lessons.findIndex(lesson => lesson.id === saved) : -1;
  if (savedIndex >= 0) return savedIndex;
  return Math.max(0, lessons.findIndex(lesson => !completed.includes(lesson.id)));
}

function readProgress(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string' && lessons.some(lesson => lesson.id === id)) : [];
  } catch { return []; }
}

const normalize = (value: string) => value.trim().replace(/\s+/g, ' ').replace(/'/g, '"').toLowerCase();
function matchesCommand(actual: string, expected: string): boolean {
  const a = normalize(actual);
  const e = normalize(expected);
  if (a === e) return true;
  if (e === 'git push origin main' && a === 'git push') return true;
  if (e === 'git fetch origin' && a === 'git fetch') return true;
  if (e === 'git pull origin main' && a === 'git pull') return true;
  if (e === 'git add app.js' && a === 'git add .') return true;
  return false;
}

function describeCommand(command: string): string {
  if (command === 'git init') return 'Start tracking the project with Git.';
  if (command === 'git add .') return 'Stage the project files.';
  if (command.startsWith('git commit')) return 'Save a commit with the requested message.';
  if (command.startsWith('git switch -c')) return 'Create and switch to a feature branch.';
  if (command.startsWith('git switch')) return 'Switch to the receiving branch.';
  if (command.startsWith('edit ')) return `Change ${command.slice(5)} in the simulated editor.`;
  if (command.startsWith('git add ')) return 'Stage the changed file.';
  if (command.startsWith('git merge')) return 'Merge the feature branch.';
  if (command.startsWith('git remote add')) return 'Connect the GitHub remote named origin.';
  if (command.startsWith('git push')) return 'Publish your local commits to GitHub.';
  return 'Use the current concept to move the Git state forward.';
}

function statusText(state: LabState): string {
  if (!state.initialized) return 'Normal folder';
  if (state.conflict) return 'Conflict to resolve';
  if (state.staged.length) return `${state.staged.length} staged`;
  if (state.changed.length || state.untracked.length) return 'Working changes';
  return 'Clean working tree';
}

function VisualState({ state, lesson, tick }: { state: LabState; lesson: Lesson | null; tick: number }) {
  const [showGit, setShowGit] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const reduceMotion = useReducedMotion();
  const files = fileStatuses(state);
  const working = files.filter(file => file.status === 'modified' || file.status === 'untracked');
  const staged = files.filter(file => file.status === 'staged');
  const selected = state.commits.find(commit => commit.hash === selectedCommit) || state.commits[state.commits.length - 1];
  const remoteTip = state.remoteBranches[state.currentBranch] || '';
  const remoteCount = state.commits.filter(commit => remoteTip && ancestorsInView(state, remoteTip).has(commit.hash)).length;
  const transfer = state.lastMotion === 'push' || state.lastMotion === 'pull' || state.lastMotion === 'fetch';
  const transferBack = state.lastMotion === 'pull' || state.lastMotion === 'fetch';

  return (
    <div className="space-y-4" aria-label="Live Git visualization">
      {lesson?.id === 'why-git' && <div className="rounded-2xl border border-white/10 bg-[#141623] p-4 overflow-hidden">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#aaa9bd] mb-3">From copies to history</div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1 text-[#a6aabd]">{['project-final.zip','project-final-v2.zip','project-final-real.zip','project-final-final.zip'].map(name => <div key={name} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 truncate">{name}</div>)}</div>
          <div className="space-y-1">{['v1','v2','v3','v4'].map((name, index) => <motion.div key={name} initial={{ opacity: 0, x: 18 }} animate={{ opacity: state.initialized ? 1 : .2, x: 0 }} transition={{ delay: reduceMotion ? 0 : index * .12 }} className="flex items-center gap-2 text-[#c8baff]"><span className="h-3 w-3 rounded-full border-2 border-[#a78bfa] bg-[#a78bfa]/30" /><span>{name}</span></motion.div>)}</div>
        </div>
      </div>}
      <div className="rounded-2xl border border-white/10 bg-[#141623] p-4 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,.2)]">
        <div className="flex items-center justify-between gap-3 mb-4"><div><div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8b90aa]">Live model</div><h3 className="font-semibold text-white">What Git knows right now</h3></div><span className="rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 px-2.5 py-1 text-[11px] text-[#c9bbff]">{statusText(state)}</span></div>
        <LayoutGroup>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Area icon={<FileCode2 size={16}/>} title="Working directory" accent="text-[#f7c778]" count={working.length} active={lesson?.focus === 'files' || state.lastMotion === 'edit'}>
              {working.length ? working.map(file => <motion.div layoutId={`file-${file.name}`} key={file.name} className="flex items-center justify-between gap-1 rounded-md border border-[#f7c778]/20 bg-[#f7c778]/10 px-2 py-1.5 text-[11px]"><span className="truncate">{file.name}</span><span className="text-[#f7c778]">{file.status}</span></motion.div>) : <Empty label="No loose edits"/>}
            </Area>
            <Area icon={<Layers3 size={16}/>} title="Staging area" accent="text-[#72d6c4]" count={staged.length} active={lesson?.focus === 'stage' || state.lastMotion === 'add'}>
              {staged.length ? staged.map(file => <motion.div layoutId={`file-${file.name}`} key={file.name} className="rounded-md border border-[#72d6c4]/20 bg-[#72d6c4]/10 px-2 py-1.5 text-[11px] text-[#b7f3e8]">{file.name}</motion.div>) : <Empty label="Nothing staged"/>}
            </Area>
            <Area icon={<GitCommitHorizontal size={16}/>} title="Local repository" accent="text-[#a78bfa]" count={state.commits.length} active={lesson?.focus === 'history' || lesson?.focus === 'branches' || state.lastMotion === 'commit'}>
              <div className="text-[11px] text-[#aeb1c4]">HEAD <span className="font-mono text-white">{state.branches[state.currentBranch] || '—'}</span></div><div className="text-[11px] text-[#aeb1c4]">Branch <span className="text-[#cbbdff]">{state.currentBranch}</span></div>
            </Area>
            <Area icon={<Cloud size={16}/>} title="GitHub remote" accent="text-[#78b8ff]" count={remoteCount} active={lesson?.focus === 'remote' || state.lastMotion === 'push' || state.lastMotion === 'fetch' || state.lastMotion === 'pull'}>
              <div className="text-[11px] text-[#aeb1c4]">{state.remoteUrl ? 'origin connected' : 'Not connected yet'}</div><div className="font-mono text-[11px] text-[#d0e4ff]">{remoteTip || 'No pushed commit'}</div>
            </Area>
          </div>
        </LayoutGroup>
        {state.initialized && <button onClick={() => setShowGit(value => !value)} className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#c5c9d8] hover:border-[#a78bfa]/40"><FolderGit2 size={14}/> my-project/.git <ChevronDown size={13} className={showGit ? 'rotate-180' : ''}/></button>}
        {showGit && state.initialized && <div className="mt-2 rounded-lg bg-black/25 p-3 text-xs text-[#aeb3c8]">Git stores commit objects, refs (branch pointers), HEAD, and configuration here. Your working files live outside .git.</div>}
        <div className="relative mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-[#b9bed0]"><Sparkles size={14} className="shrink-0 text-[#e1b5ff]"/><span>{state.lastExplanation}</span>{transfer && <motion.span key={tick} className="absolute bottom-0 left-8 h-[2px] w-8 rounded-full bg-[#8fbdff] shadow-[0_0_12px_#8fbdff]" initial={{ x: transferBack ? 220 : 0 }} animate={{ x: transferBack ? 0 : 220 }} transition={{ duration: reduceMotion ? 0 : 1 }}/>}</div>
      </div>
      <CommitGraph state={state} selectedHash={selected?.hash || null} onSelect={setSelectedCommit}/>
      {selected && <div className="rounded-xl border border-white/10 bg-[#141623] p-3 text-xs text-[#aeb3c8]"><div className="font-semibold text-white">{selected.message}</div><div className="mt-1">{selected.hash} · {selected.author} · {selected.date} · {Object.keys(selected.files).length} files</div><div className="mt-1 truncate">{Object.keys(selected.files).join(', ')}</div></div>}
      <div><button onClick={() => setShowDebug(value => !value)} className="text-xs text-[#9da4be] hover:text-white">{showDebug ? 'Hide' : 'Show'} state inspector <ChevronDown size={12} className="inline"/></button>{showDebug && <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-[#141623] p-3 text-xs"><Metric label="Branch" value={state.currentBranch}/><Metric label="HEAD" value={state.branches[state.currentBranch] || 'empty'}/><Metric label="Working" value={`${working.length} changed`}/><Metric label="Staged" value={`${staged.length} files`}/><Metric label="Commits" value={String(state.commits.length)}/><Metric label="Remote sync" value={remoteTip === state.branches[state.currentBranch] ? 'Up to date' : 'Different'}/><Metric label="Stash" value={String(state.stashes.length)}/><Metric label="PR" value={state.pullRequestOpen ? 'Open' : 'None'}/></div>}</div>
    </div>
  );
}

function ancestorsInView(state: LabState, hash: string): Set<string> {
  const found = new Set<string>(); const stack = [hash];
  while (stack.length) { const current = stack.pop()!; if (found.has(current)) continue; found.add(current); stack.push(...(state.commits.find(commit => commit.hash === current)?.parents || [])); }
  return found;
}

function Area({ icon, title, accent, count, active, children }: { icon: React.ReactNode; title: string; accent: string; count: number; active: boolean; children: React.ReactNode }) {
  return <div className={`min-h-28 rounded-xl border p-3 transition-colors ${active ? 'border-[#a78bfa]/50 bg-[#a78bfa]/[0.055]' : 'border-white/10 bg-black/20'}`}><div className={`mb-3 flex items-center gap-1.5 text-[11px] font-semibold ${accent}`}>{icon}<span className="truncate">{title}</span><span className="ml-auto rounded bg-white/5 px-1.5 text-[#aeb3c8]">{count}</span></div><div className="space-y-1.5">{children}</div></div>;
}
function Empty({ label }: { label: string }) { return <div className="py-2 text-[11px] text-[#6f758e]">{label}</div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-2 rounded bg-black/20 px-2 py-1.5"><span className="text-[#7f86a0]">{label}</span><span className="truncate font-mono text-white">{value}</span></div>; }

function CommitGraph({ state, selectedHash, onSelect }: { state: LabState; selectedHash: string | null; onSelect: (hash: string) => void }) {
  const commits = state.commits.slice(-8);
  const mainAncestors = ancestorsInView(state, state.branches.main || '');
  const points = commits.map((commit, index) => ({ commit, x: mainAncestors.has(commit.hash) ? 40 : 125, y: 32 + index * 52 }));
  const pointMap = new Map(points.map(point => [point.commit.hash, point]));
  const height = Math.max(116, 64 + commits.length * 52);
  return <div className="rounded-2xl border border-white/10 bg-[#141623] p-4"><div className="mb-2 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-semibold text-white"><GitBranch size={16} className="text-[#a78bfa]"/> Commit graph</h3><span className="text-[11px] text-[#8289a3]">Click a commit</span></div>{commits.length === 0 ? <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-white/10 text-xs text-[#7f86a0]">Your first commit will appear here.</div> : <div className="overflow-x-auto"><svg viewBox={`0 0 420 ${height}`} className="min-w-[320px] w-full" role="img" aria-label="Interactive Git commit graph">{points.flatMap(point => point.commit.parents.map(parent => { const source = pointMap.get(parent); return source ? <line key={`${point.commit.hash}-${parent}`} x1={point.x} y1={point.y} x2={source.x} y2={source.y} stroke={point.x === source.x ? '#777f9d' : '#a78bfa'} strokeWidth="2"/> : null; }))}{points.map(point => { const selected = selectedHash === point.commit.hash; const labels = Object.entries(state.branches).filter(([,hash]) => hash === point.commit.hash).map(([name]) => name); const remote = Object.entries(state.remoteBranches).filter(([,hash]) => hash === point.commit.hash).map(([name]) => `origin/${name}`); return <g key={point.commit.hash} onClick={() => onSelect(point.commit.hash)} className="cursor-pointer" tabIndex={0} role="button" aria-label={`Inspect commit ${point.commit.message}`} onKeyDown={event => { if (event.key === 'Enter') onSelect(point.commit.hash); }}><circle cx={point.x} cy={point.y} r={selected ? 11 : 8} fill={point.x === 40 ? '#a78bfa' : '#69d3bf'} stroke={selected ? 'white' : '#1a1b29'} strokeWidth="3"/><text x={point.x + 22} y={point.y - 3} fill="#f5f3ff" fontSize="11" fontWeight="600">{point.commit.message.slice(0, 29)}</text><text x={point.x + 22} y={point.y + 13} fill="#9097ad" fontSize="10">{point.commit.hash} {labels.length ? `· ${labels.join(', ')}` : ''} {remote.length ? `· ${remote.join(', ')}` : ''}</text></g>; })}</svg></div>}</div>;
}

function TerminalPanel({ history, onRun, branch, placeholder, suggested, disabled }: { history: Entry[]; onRun: (command: string) => void; branch: string; placeholder: string; suggested?: string; disabled?: boolean }) {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'nearest' }); }, [history.length]);
  return <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d16] shadow-[0_18px_50px_rgba(0,0,0,.28)]"><div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3"><div className="flex items-center gap-2"><div className="flex gap-1"><i className="h-2.5 w-2.5 rounded-full bg-[#fb7185]"/><i className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]"/><i className="h-2.5 w-2.5 rounded-full bg-[#4ade80]"/></div><span className="ml-2 text-xs font-semibold text-[#bfc4d9]">Simulated terminal</span></div><span className="font-mono text-[11px] text-[#86e2cf]">{branch}</span></div><div className="h-44 overflow-y-auto px-4 py-3 font-mono text-xs sm:h-52"><p className="mb-3 text-[#747c96]">Safe sandbox · commands run in this browser only</p>{history.map((entry,index) => <div key={`${index}-${entry.command}`} className="mb-3"><div className="break-all text-[#e3e8f6]"><span className="text-[#81dbbf]">$ </span>{entry.command}</div><pre className={`mt-1 whitespace-pre-wrap ${entry.ok ? 'text-[#aeb5c8]' : 'text-[#f5a2a8]'}`}>{entry.output}</pre></div>)}<div ref={endRef}/></div><form onSubmit={event => { event.preventDefault(); if (input.trim() && !disabled) { onRun(input.trim()); setInput(''); setHistoryIndex(-1); } }} className="flex min-h-[76px] items-center gap-3 border-t-2 border-[#a78bfa]/35 bg-[#171421] px-4 py-3 transition-colors focus-within:border-[#b99cff] focus-within:bg-[#1d182b] sm:px-5"><span className="font-mono text-lg text-[#81dbbf]">$</span><input ref={inputRef} aria-label="Git command" value={input} disabled={disabled} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'ArrowUp' && history.length) { event.preventDefault(); const next = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1); setHistoryIndex(next); setInput(history[next].command); } else if (event.key === 'ArrowDown' && historyIndex >= 0) { event.preventDefault(); const next = historyIndex + 1; setHistoryIndex(next); setInput(next < history.length ? history[next].command : ''); } }} placeholder={placeholder} className="h-12 min-w-0 flex-1 rounded-md bg-transparent px-1 font-mono text-sm text-white outline-none placeholder:text-[#9b93af] focus-visible:ring-2 focus-visible:ring-[#a78bfa]/40 sm:text-base"/><button type="submit" disabled={disabled || !input.trim()} aria-label="Run command" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#a78bfa] text-[#120e20] shadow-[0_4px_18px_rgba(167,139,250,.18)] disabled:opacity-40"><Send size={18}/></button></form>{suggested && <div className="border-t border-white/10 px-4 py-2 text-[11px] text-[#777f9a]">Try: <button onClick={() => { setInput(suggested); inputRef.current?.focus(); }} className="font-mono text-[#d3c7ff] hover:underline">{suggested}</button></div>}</div>;
}

export function GitVisualLab() {
  const [completed, setCompleted] = useState<string[]>(readProgress);
  const [lessonIndex, setLessonIndex] = useState(() => initialLessonIndex(completed));
  const [lessonActivity, setLessonActivity] = useState<LessonActivity>(readLessonActivity);
  const [phase, setPhase] = useState<Phase>('learn');
  const [mode, setMode] = useState<'course' | 'free'>('course');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lab, setLab] = useState<LabState>(() => scenarioFor(lessons[initialLessonIndex(completed)]));
  const [history, setHistory] = useState<Entry[]>([]);
  const [step, setStep] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hintOpen, setHintOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const lesson = lessons[lessonIndex];
  const progress = Math.round((completed.length / lessons.length) * 100);
  const moduleIndex = modules.findIndex(module => module.id === lesson.module);
  const currentModule = modules[moduleIndex];
  const activeSequence = phase === 'challenge' ? lesson.challenge : lesson.demo;
  const stageLabels = ['Learn', 'Watch', 'Practice', 'Challenge'];

  useEffect(() => { try { localStorage.setItem(STORAGE, JSON.stringify(completed)); } catch { /* private browsing */ } }, [completed]);
  useEffect(() => { try { localStorage.setItem(CURRENT_LESSON_STORAGE, lesson.id); } catch { /* private browsing */ } }, [lesson.id]);
  useEffect(() => { try { localStorage.setItem(LESSON_ACTIVITY_STORAGE, JSON.stringify(lessonActivity)); } catch { /* private browsing */ } }, [lessonActivity]);
  useEffect(() => {
    if (!playing || phase !== 'watch') return;
    if (demoStep >= lesson.demo.length) {
      setPlaying(false);
      setLessonActivity(previous => ({ ...previous, [lesson.id]: { ...previous[lesson.id], visualizationCompleted: true } }));
      return;
    }
    const timer = window.setTimeout(() => {
      const command = lesson.demo[demoStep];
      const result = runLabCommand(lab, command);
      setLab(result.state); setHistory(previous => [...previous, { command, output: result.output, ok: result.ok }]);
      setFeedback(result.explanation); setTick(value => value + 1); setDemoStep(value => value + 1);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [playing, phase, demoStep, lesson, lab]);

  const openLesson = (index: number, updateUrl = true) => {
    if (index < 0 || index >= lessons.length) return;
    if (updateUrl && window.location.pathname !== `/lesson/${index + 1}`) window.history.pushState(null, '', `/lesson/${index + 1}`);
    setMode('course'); setLessonIndex(index); setPhase('learn'); setLab(scenarioFor(lessons[index]));
    setHistory([]); setStep(0); setDemoStep(0); setPlaying(false); setFeedback(''); setHintOpen(false); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  useEffect(() => {
    const onPopState = () => {
      const route = window.location.pathname.match(/^\/lesson\/(\d+)\/?$/);
      if (route) openLesson(Number(route[1]) - 1, false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  });
  const enterFree = () => { setMode('free'); setLab(createLabState()); setHistory([]); setFeedback('Start with git init, or load a sample scenario.'); setPlaying(false); setSidebarOpen(false); };
  const startDemo = () => { setMode('course'); setPhase('watch'); setLab(scenarioFor(lesson)); setHistory([]); setDemoStep(0); setFeedback('Watch the terminal and the model change together.'); setPlaying(true); setTick(value => value + 1); };
  const startPractice = () => { setPhase('practice'); setLab(scenarioFor(lesson)); setHistory([]); setStep(0); setFeedback('Run the guided command yourself. The model will update immediately.'); setHintOpen(false); setTick(value => value + 1); };
  const startChallenge = () => { setPhase('challenge'); setLab(scenarioFor(lesson)); setHistory([]); setStep(0); setFeedback('Solve the scenario. You can retry or reset at any time.'); setHintOpen(false); setTick(value => value + 1); };
  const run = (command: string) => {
    const result: LabResult = runLabCommand(lab, command);
    setLab(result.state); setHistory(previous => [...previous, { command, output: result.output, ok: result.ok }]); setTick(value => value + 1);
    if (mode === 'free') { setFeedback(result.explanation); return; }
    const target = activeSequence[step];
    const conflictStep = lesson.id === 'merge-conflict' && command.trim() === 'git merge feature' && result.state.conflict;
    if (target && matchesCommand(command, target) && (result.ok || conflictStep)) {
      const following = step + 1;
      setStep(following);
      if (following === activeSequence.length) {
        if (phase === 'challenge') {
          setCompleted(previous => previous.includes(lesson.id) ? previous : [...previous, lesson.id]);
          setPhase('complete');
          setFeedback(`Challenge complete. ${lesson.result}`);
        } else {
          setLessonActivity(previous => ({ ...previous, [lesson.id]: { ...previous[lesson.id], practiceCompleted: true } }));
          setFeedback(`Nice work. ${lesson.result} Ready for the challenge?`);
        }
      } else setFeedback(`${result.explanation} Next: ${describeCommand(activeSequence[following])}`);
    } else setFeedback(`${result.explanation}${target ? ` Your task is still open. ${lesson.hint}` : ''}`);
  };
  const resetCurrent = () => { setLab(mode === 'free' ? createLabState() : scenarioFor(lesson)); setHistory([]); setStep(0); setFeedback('Scenario reset. Try again.'); setTick(value => value + 1); };
  const loadFreeSample = (type: 'initial' | 'history' | 'remote') => {
    if (type === 'initial') { setLab(createLabState()); setHistory([]); }
    else { const target = lessons.find(item => item.id === (type === 'history' ? 'log' : 'push'))!; setLab(scenarioFor(target)); setHistory([]); }
    setFeedback(type === 'initial' ? 'Fresh folder loaded. Try git init.' : `${type === 'history' ? 'Commit history' : 'Connected remote'} scenario loaded.`); setTick(value => value + 1);
  };

  return <div className="min-h-screen bg-[#0b0d17] text-[#e9eaf4] selection:bg-[#a78bfa]/40">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_48%_-12%,rgba(116,84,197,.17),transparent_38%),radial-gradient(circle_at_95%_85%,rgba(33,91,124,.10),transparent_30%)]"/>
    <header className="relative z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#10121d]/85 px-4 backdrop-blur-xl sm:px-6"><div className="flex items-center gap-3"><button className="rounded-lg p-1.5 text-[#aeb3c8] lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open course menu"><Menu size={21}/></button><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#64c4d9] text-[#0b0d17] shadow-[0_8px_25px_rgba(167,139,250,.25)]"><GitBranch size={20}/></div><div><div className="text-[15px] font-bold tracking-tight text-white">Git Visual Lab</div><div className="text-[10px] uppercase tracking-[.2em] text-[#8b91aa]">See what Git does</div></div></div><div className="hidden min-w-52 max-w-72 flex-1 px-6 sm:block"><div className="mb-1 flex justify-between text-[11px] text-[#a9afc5]"><span>Course progress</span><span>{completed.length}/{lessons.length} · {progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#64c4d9] transition-all" style={{ width: `${progress}%` }}/></div></div><div className="flex items-center gap-2"><button onClick={() => { openLesson(lessonIndex); setSidebarOpen(true); }} className={`rounded-lg px-3 py-2 text-xs font-semibold ${mode === 'course' ? 'bg-white/10 text-white' : 'text-[#9ca3bc] hover:text-white'}`}>Course</button><button onClick={enterFree} className={`rounded-lg px-3 py-2 text-xs font-semibold ${mode === 'free' ? 'bg-[#a78bfa] text-[#11101a]' : 'border border-white/10 text-[#c8cbe0] hover:border-[#a78bfa]/50'}`}>Free lab</button></div></header>
    <div className="relative mx-auto flex max-w-[1620px]">
      <AnimatePresence>{sidebarOpen && <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSidebarOpen(false)} aria-label="Close course menu" className="fixed inset-0 z-30 bg-black/65 lg:hidden"/>}</AnimatePresence>
      <aside className={`fixed inset-y-0 left-0 z-40 w-[300px] overflow-y-auto border-r border-white/10 bg-[#11131f] pt-4 transition-transform lg:sticky lg:top-0 lg:z-10 lg:h-[calc(100vh-64px)] lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 pb-4"><div><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#a78bfa]">Your journey</div><div className="mt-1 text-sm text-[#aeb4c9]">Explore any lesson</div></div><button onClick={() => setSidebarOpen(false)} className="lg:hidden" aria-label="Close course menu"><X size={18}/></button></div>
        <div className="space-y-2 px-3 pb-8">{modules.map((module, index) => {
          const items = lessons.map((item, itemIndex) => ({ item, itemIndex })).filter(({ item }) => item.module === module.id);
          const active = module.id === lesson.module && mode === 'course';
          const done = items.every(({ item }) => completed.includes(item.id));
          const count = items.filter(({ item }) => completed.includes(item.id)).length;
          return <div key={module.id} className={`rounded-xl border ${active ? 'border-[#a78bfa]/30 bg-[#a78bfa]/[0.07]' : 'border-white/[0.04]'}`}>
            <button onClick={() => openLesson(items.find(({ item }) => !completed.includes(item.id))?.itemIndex ?? items[0].itemIndex)} className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left">
              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? 'bg-[#62d1b5]/20 text-[#62d1b5]' : active ? 'bg-[#a78bfa]/25 text-[#d7cafa]' : 'bg-white/5 text-[#838aa3]'}`}>{done ? <Check size={14}/> : <span className="text-[10px] font-bold">{index + 1}</span>}</div>
              <div className="min-w-0 flex-1"><div className="text-xs font-semibold text-white">{module.title}</div><div className="mt-1 text-[11px] leading-snug text-[#818aa3]">{module.subtitle}</div><div className="mt-1 text-[10px] text-[#a78bfa]">{count}/{items.length} complete</div></div>
              {active && <ChevronDown size={15} className="shrink-0 text-[#a78bfa]"/>}
            </button>
            <div className="mb-2 ml-9 space-y-0.5 border-l border-white/10 pl-3">{items.map(({ item, itemIndex }) => <button key={item.id} onClick={() => openLesson(itemIndex)} aria-current={mode === 'course' && itemIndex === lessonIndex ? 'page' : undefined} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] ${mode === 'course' && itemIndex === lessonIndex ? 'bg-[#a78bfa]/15 font-semibold text-[#e3d8ff]' : 'text-[#9da4bc] hover:bg-white/5'}`}>
              {completed.includes(item.id) ? <CheckCircle2 size={13} className="shrink-0 text-[#64d0b6]"/> : mode === 'course' && itemIndex === lessonIndex ? <Play size={12} className="shrink-0 text-[#c9baff]"/> : <Circle size={12} className="shrink-0"/>}
              <span className="shrink-0 font-mono text-[10px] text-[#707a95]">{String(itemIndex + 1).padStart(2, '0')}</span><span className="truncate">{item.title}</span>
            </button>)}</div>
          </div>;
        })}</div>
      </aside>
      <main className="min-w-0 flex-1 px-4 pb-20 pt-6 sm:px-6 xl:px-9">
        {mode === 'course' ? <div className="mx-auto max-w-[1220px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#9098b1]"><div className="flex items-center gap-2"><BookOpen size={15} className="text-[#a78bfa]"/><span>{currentModule.title}</span><ChevronRight size={13}/><span className="text-[#e7dcff]">{lesson.title}</span></div><span>Lesson {lessonIndex + 1} of {lessons.length}</span></div>
          <div className="mb-6 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-r from-[#a78bfa] to-[#64c4d9] transition-all" style={{ width: `${((lessonIndex + 1) / lessons.length) * 100}%` }}/></div>
          <div className="mb-7"><div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.22em] text-[#b9a6ff]"><Sparkles size={14}/> Interactive lesson</div><h1 className="max-w-4xl text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-[42px]">{lesson.title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#aeb5ca]">{lesson.objective}</p></div>
          <div className="mb-7 grid grid-cols-4 overflow-hidden rounded-xl border border-white/10 bg-[#141623]">{stageLabels.map((label,index) => { const current = phase === 'complete' ? 4 : stageLabels.findIndex(item => item.toLowerCase() === phase); return <div key={label} className={`flex items-center gap-2 border-r border-white/10 px-2 py-3 text-[11px] sm:px-4 sm:text-xs ${current >= index ? 'text-[#e4daff]' : 'text-[#737b93]'}`}><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${current > index ? 'bg-[#64d0b6] text-[#0b1518]' : current === index ? 'bg-[#a78bfa] text-[#171026]' : 'bg-white/10'}`}>{current > index ? <Check size={12}/> : index + 1}</span><span className="truncate">{label}</span></div>; })}</div>
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(390px,.92fr)]">
            <div className="min-w-0 space-y-5">
              {phase === 'learn' && <section className="rounded-2xl border border-white/10 bg-[#141623] p-5 sm:p-7"><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#b9a6ff]">01 / Learn the concept</div><h2 className="mt-3 text-xl font-semibold text-white">The problem first</h2><p className="mt-3 text-[15px] leading-7 text-[#c5c9d9]">{lesson.problem}</p><div className="mt-5 rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/[0.06] p-4"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c7b5ff]">Think of it like this</div><p className="mt-2 text-sm leading-6 text-[#d3d0e5]">{lesson.analogy}</p></div><p className="mt-5 text-sm leading-7 text-[#aeb5ca]">{lesson.concept}</p><div className="mt-7 flex items-center gap-3"><button onClick={startDemo} className="inline-flex items-center gap-2 rounded-xl bg-[#a78bfa] px-5 py-3 text-sm font-bold text-[#151020] shadow-[0_10px_35px_rgba(167,139,250,.22)] hover:bg-[#baa3ff]"><Play size={16}/> Show me</button><span className="text-xs text-[#7f879e]">Watch the state change</span></div></section>}
              {phase === 'watch' && <section className="rounded-2xl border border-white/10 bg-[#141623] p-5 sm:p-7"><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#b9a6ff]">02 / Watch the visualization</div><h2 className="mt-3 text-xl font-semibold text-white">Guided demonstration</h2><p className="mt-2 text-sm text-[#aeb5ca]">The simulator runs each step and explains the resulting Git state.</p><div className="mt-5 grid gap-2">{lesson.demo.map((command,index) => <div key={`${command}-${index}`} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 font-mono text-xs ${index < demoStep ? 'border-[#64d0b6]/30 bg-[#64d0b6]/[0.06] text-[#bdf8e9]' : index === demoStep ? 'border-[#a78bfa]/40 bg-[#a78bfa]/[0.08] text-white' : 'border-white/10 text-[#7e879e]'}`}><span className="w-5">{index < demoStep ? <Check size={15}/> : String(index+1).padStart(2,'0')}</span><span className="break-all">{command}</span></div>)}</div><div className="mt-5"><TerminalPanel history={history} onRun={() => {}} branch={lab.currentBranch} placeholder="Watch the guided command run" disabled/></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={startDemo} className="rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold text-[#cbd0e0] hover:border-[#a78bfa]/50"><RotateCcw size={14} className="mr-1.5 inline"/> Replay</button><button onClick={startPractice} disabled={playing} className="rounded-lg bg-[#a78bfa] px-4 py-2.5 text-xs font-bold text-[#151020] disabled:opacity-40">Try it yourself <ArrowRight size={14} className="ml-1 inline"/></button></div></section>}
              {(phase === 'practice' || phase === 'challenge') && <section className="rounded-2xl border border-white/10 bg-[#141623] p-5 sm:p-7"><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#b9a6ff]">{phase === 'practice' ? '03 / Practice' : '04 / Challenge'}</div><h2 className="mt-3 text-xl font-semibold text-white">{phase === 'practice' ? 'Try it yourself' : 'Solve the scenario'}</h2><p className="mt-2 text-sm leading-6 text-[#aeb5ca]">{phase === 'practice' ? lesson.concept : lesson.problem}</p><div className="mt-5 rounded-xl border border-[#a78bfa]/25 bg-[#a78bfa]/[0.06] p-4"><div className="flex justify-between gap-3 text-xs"><span className="font-semibold text-[#d5c7ff]">Step {Math.min(step+1,activeSequence.length)} / {activeSequence.length}</span><span className="text-[#98a0b9]">{phase === 'practice' ? 'Guided' : 'Your challenge'}</span></div><p className="mt-2 text-sm font-medium text-white">{step < activeSequence.length ? describeCommand(activeSequence[step]) : 'All steps complete.'}</p></div><div className="mt-5"><TerminalPanel history={history} onRun={run} branch={lab.currentBranch} placeholder="Type a Git command or edit a file" suggested={phase === 'practice' && step < activeSequence.length ? activeSequence[step] : undefined} disabled={step >= activeSequence.length}/></div><div role="status" className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-xs leading-5 text-[#c2c9dd]">{feedback}</div><div className="mt-4 flex flex-wrap items-center gap-3"><button onClick={resetCurrent} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#c9cbd9] hover:border-[#a78bfa]/50"><RotateCcw size={13} className="mr-1 inline"/> Reset scenario</button><button onClick={() => setHintOpen(value => !value)} className="text-xs text-[#c9bbff] hover:underline">{hintOpen ? 'Hide hint' : 'Need a hint?'}</button>{phase === 'practice' && step >= activeSequence.length && <button onClick={startChallenge} className="ml-auto rounded-lg bg-[#a78bfa] px-4 py-2 text-xs font-bold text-[#151020]">Start challenge <ArrowRight size={13} className="ml-1 inline"/></button>}</div>{hintOpen && <p className="mt-3 text-xs text-[#aeb5ca]">{lesson.hint}</p>}</section>}
              {phase === 'complete' && <section className="rounded-2xl border border-[#64d0b6]/30 bg-gradient-to-br from-[#16312d] to-[#141623] p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#64d0b6]/20 text-[#7ee2c9]"><CheckCircle2 size={27}/></div><h2 className="mt-4 text-2xl font-bold text-white">{lesson.id === 'final-project' ? 'Project complete!' : 'Lesson complete'}</h2><p className="mt-3 text-sm leading-7 text-[#b8d5cd]">{feedback}</p>{lesson.id === 'final-project' && <div className="mt-5 grid grid-cols-2 gap-2 text-xs"><Metric label="Commits" value={String(lab.commits.length)}/><Metric label="Branches" value={String(Object.keys(lab.branches).length)}/><Metric label="Merged" value={lab.commits.some(commit => commit.parents.length > 1) || lab.branches.main === lab.branches.feature ? 'Yes' : 'No'}/><Metric label="Pushed" value={lab.remoteBranches.main ? 'Yes' : 'No'}/></div>}<div className="mt-6 flex flex-wrap gap-2">{lessonIndex < lessons.length - 1 && <button onClick={() => openLesson(lessonIndex+1)} className="rounded-xl bg-[#a78bfa] px-5 py-3 text-sm font-bold text-[#151020]">Next lesson <ArrowRight size={15} className="ml-1 inline"/></button>}<button onClick={() => openLesson(lessonIndex)} className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white">Replay lesson</button></div></section>}
              <div className="flex items-center justify-between gap-3 text-xs text-[#8a92aa]"><button onClick={() => openLesson(lessonIndex-1)} disabled={lessonIndex===0} className="flex items-center gap-1 disabled:opacity-30"><ArrowLeft size={14}/> Previous lesson</button><span>{currentModule.title}</span><button onClick={() => openLesson(lessonIndex+1)} disabled={lessonIndex===lessons.length-1} className="flex items-center gap-1 disabled:opacity-30">Next lesson <ArrowRight size={14}/></button></div>
            </div>
            <div className="min-w-0 xl:sticky xl:top-6"><VisualState state={lab} lesson={lesson} tick={tick}/></div>
          </div>
        </div> : <div className="mx-auto max-w-[1220px]"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><div className="text-[11px] font-bold uppercase tracking-[.2em] text-[#b9a6ff]">Open sandbox</div><h1 className="mt-2 text-3xl font-bold text-white">Git Playground</h1><p className="mt-2 max-w-xl text-sm text-[#aeb5ca]">Experiment freely. Every command updates the same visual Git model as the course. Nothing runs on your computer.</p></div><button onClick={() => { setMode('course'); openLesson(lessonIndex); }} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-[#d6d9e7]">Return to course</button></div><div className="mb-5 flex flex-wrap gap-2">{([['initial','Fresh folder'],['history','With commit history'],['remote','Connected to GitHub']] as const).map(([type,label]) => <button key={type} onClick={() => loadFreeSample(type)} className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-xs text-[#c6cade] hover:border-[#a78bfa]/50">{label}</button>)}</div><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(390px,.92fr)]"><div><TerminalPanel history={history} onRun={run} branch={lab.currentBranch} placeholder="Try git init, git status, edit app.js…"/><p role="status" className="mt-3 rounded-lg border border-white/10 bg-[#141623] p-3 text-xs leading-5 text-[#aeb5ca]">{feedback}</p><button onClick={resetCurrent} className="mt-3 text-xs text-[#aeb5ca] hover:text-white"><RotateCcw size={13} className="mr-1 inline"/> Reset</button></div><VisualState state={lab} lesson={null} tick={tick}/></div></div>}
      </main>
    </div>
  </div>;
}
