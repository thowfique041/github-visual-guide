import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, Award, BookOpen, Check, CheckCircle2, ChevronRight, Circle,
  Cloud, Code2, GitBranch, GitCommit, GitMerge, GitPullRequest, Github,
  Play, RefreshCcw, Rocket, ShieldAlert, Users, Wand2, XCircle
} from 'lucide-react';

type Language = 'en' | 'bn';
type Level = 'beginner' | 'intermediate' | 'advanced';

interface LearningHubProps {
  language: Language;
  onOpenLab: (tab: string) => void;
}

const lessons = [
  { id: 'repo', en: 'Repository basics', bn: 'Repository পরিচিতি', note: 'Create a safe home for project history.' },
  { id: 'clone', en: 'Clone a project', bn: 'Project clone করা', note: 'Copy a remote repository to your computer.' },
  { id: 'edit', en: 'Edit & inspect', bn: 'Edit ও status দেখা', note: 'See how Git detects file changes.' },
  { id: 'stage', en: 'Stage changes', bn: 'Changes stage করা', note: 'Choose exactly what belongs in the next snapshot.' },
  { id: 'commit', en: 'Create a commit', bn: 'Commit তৈরি করা', note: 'Save a meaningful checkpoint locally.' },
  { id: 'push', en: 'Push to GitHub', bn: 'GitHub-এ push করা', note: 'Publish local commits to the remote.' },
  { id: 'branch', en: 'Work on a branch', bn: 'Branch-এ কাজ করা', note: 'Build safely without disturbing main.' },
  { id: 'pr', en: 'Open a pull request', bn: 'Pull request খোলা', note: 'Ask teammates to review the change.' },
  { id: 'merge', en: 'Review & merge', bn: 'Review ও merge করা', note: 'Bring an approved change into main.' },
];

const projectSteps = [
  { command: 'Edit index.html', area: 'Working tree', detail: 'index.html becomes modified.', color: '#f85149' },
  { command: 'git add index.html', area: 'Staging area', detail: 'The selected change is ready for a commit.', color: '#d29922' },
  { command: 'git commit -m "Improve hero"', area: 'Local repository', detail: 'A new local snapshot is created.', color: '#3fb950' },
  { command: 'git push origin feature/hero', area: 'GitHub remote', detail: 'The branch is published for collaboration.', color: '#58a6ff' },
];

const mistakes = [
  { title: 'I staged the wrong file', safe: 'git restore --staged file.txt', risk: 'Safe', why: 'Removes the file from staging but keeps your edits.' },
  { title: 'My last commit message is wrong', safe: 'git commit --amend -m "Better message"', risk: 'Caution', why: 'Safe before push; rewrites the latest commit ID.' },
  { title: 'I committed on the wrong branch', safe: 'git switch correct-branch\ngit cherry-pick <commit>\ngit switch old-branch\ngit reset --hard HEAD~1', risk: 'High', why: 'Copy first, then remove. Back up before the hard reset.' },
  { title: 'I need to undo a pushed commit', safe: 'git revert <commit>', risk: 'Safe', why: 'Creates a new inverse commit without rewriting shared history.' },
  { title: 'I cannot find a lost commit', safe: 'git reflog', risk: 'Safe', why: 'Shows recent HEAD movements so you can recover the commit.' },
];

const tour = [
  ['Code', 'Browse files, branches, commits and releases.'],
  ['Issues', 'Track bugs, ideas and tasks with labels and assignees.'],
  ['Pull requests', 'Review, discuss and merge proposed changes.'],
  ['Actions', 'Automate tests, builds and deployments.'],
  ['Projects', 'Plan issues and pull requests on a board.'],
  ['Insights', 'Understand activity, contributors and repository traffic.'],
  ['Settings', 'Manage access, rules, Pages and repository options.'],
];

export const LearningHub: React.FC<LearningHubProps> = ({ language, onOpenLab }) => {
  const [level, setLevel] = useState<Level>('beginner');
  const [completed, setCompleted] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('git_guide_lessons') || '[]'); } catch { return []; }
  });
  const [projectStep, setProjectStep] = useState(0);
  const [prStep, setPrStep] = useState(0);
  const [collabStep, setCollabStep] = useState(0);
  const [actionStep, setActionStep] = useState(0);
  const [issueStep, setIssueStep] = useState(0);
  const [mistake, setMistake] = useState(0);
  const [tourIndex, setTourIndex] = useState(0);

  useEffect(() => {
    try { localStorage.setItem('git_guide_lessons', JSON.stringify(completed)); } catch { /* ignore */ }
  }, [completed]);

  const progress = Math.round((completed.length / lessons.length) * 100);
  const badges = useMemo(() => [
    { name: 'First Steps', unlocked: completed.length >= 1 },
    { name: 'Local Hero', unlocked: completed.includes('commit') },
    { name: 'Collaborator', unlocked: completed.includes('pr') },
    { name: 'Git Graduate', unlocked: completed.length === lessons.length },
  ], [completed]);

  const t = (en: string, bn: string) => language === 'bn' ? bn : en;
  const toggleLesson = (id: string) => setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-8" aria-live="polite">
      <section className="rounded-2xl border border-[#30363d] bg-gradient-to-br from-[#161b22] to-[#0d1117] p-5 sm:p-7 overflow-hidden relative">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#58a6ff]/10 blur-3xl rounded-full" />
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#58a6ff] text-xs font-mono uppercase tracking-wider mb-3"><Rocket className="w-4 h-4" /> Learning journey</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('Learn GitHub by doing, not memorizing.', 'মুখস্থ নয়—নিজে করে GitHub শিখুন।')}</h1>
            <p className="mt-3 text-[#8b949e]">{t('Follow the path, simulate a real project, collaborate with a teammate and watch every state change.', 'ধাপে ধাপে এগিয়ে real project simulate করুন, teammate-এর সঙ্গে কাজ করুন এবং প্রতিটি পরিবর্তন visualভাবে দেখুন।')}</p>
          </div>
          <div className="min-w-64 rounded-xl bg-[#0d1117] border border-[#30363d] p-4">
            <div className="flex justify-between text-sm mb-2"><span>{t('Course progress', 'কোর্স অগ্রগতি')}</span><strong className="text-white">{progress}%</strong></div>
            <div className="h-2 rounded-full bg-[#21262d] overflow-hidden"><div className="h-full bg-gradient-to-r from-[#238636] to-[#58a6ff] transition-all" style={{ width: `${progress}%` }} /></div>
            <p className="text-xs text-[#8b949e] mt-2">{completed.length}/{lessons.length} lessons · saved automatically</p>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div><h2 className="text-xl font-bold text-white">{t('Guided learning path', 'Guided learning path')}</h2><p className="text-sm text-[#8b949e]">{t('Start at the top and build a complete GitHub workflow.', 'উপর থেকে শুরু করে একটি সম্পূর্ণ GitHub workflow তৈরি করুন।')}</p></div>
            <div className="flex bg-[#0d1117] border border-[#30363d] p-1 rounded-lg" aria-label="Difficulty level">
              {(['beginner', 'intermediate', 'advanced'] as Level[]).map(item => <button key={item} onClick={() => setLevel(item)} className={`px-2.5 py-1.5 rounded-md text-xs capitalize ${level === item ? 'bg-[#238636] text-white' : 'text-[#8b949e]'}`}>{item}</button>)}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {lessons.map((lesson, index) => {
              const done = completed.includes(lesson.id);
              return <button key={lesson.id} onClick={() => toggleLesson(lesson.id)} className={`text-left p-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#58a6ff] ${done ? 'bg-[#238636]/10 border-[#238636]/50' : 'bg-[#0d1117] border-[#30363d] hover:border-[#58a6ff]/60'}`}>
                <div className="flex items-start justify-between"><span className="text-[11px] font-mono text-[#8b949e]">LESSON {String(index + 1).padStart(2, '0')}</span>{done ? <CheckCircle2 className="w-5 h-5 text-[#3fb950]" /> : <Circle className="w-5 h-5 text-[#484f58]" />}</div>
                <h3 className="text-sm font-semibold text-white mt-3">{language === 'bn' ? lesson.bn : lesson.en}</h3>
                <p className="text-xs text-[#8b949e] mt-1">{lesson.note}</p>
              </button>;
            })}
          </div>
        </div>
        <aside className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
          <div className="flex items-center gap-2 mb-4"><Award className="w-5 h-5 text-[#d29922]" /><h2 className="font-bold text-white">Badges</h2></div>
          <div className="space-y-3">{badges.map(badge => <div key={badge.name} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.unlocked ? 'bg-[#d29922]/10 border-[#d29922]/40' : 'bg-[#0d1117] border-[#30363d] opacity-50'}`}><div className="w-9 h-9 rounded-full bg-[#21262d] flex items-center justify-center"><Award className={`w-4 h-4 ${badge.unlocked ? 'text-[#d29922]' : 'text-[#8b949e]'}`} /></div><div><div className="text-sm text-white font-medium">{badge.name}</div><div className="text-[11px] text-[#8b949e]">{badge.unlocked ? 'Unlocked' : 'Keep learning'}</div></div></div>)}</div>
        </aside>
      </section>

      <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-1"><Code2 className="w-5 h-5 text-[#3fb950]"/><h2 className="text-xl font-bold text-white">{t('Real project simulation', 'Real project simulation')}</h2></div>
        <p className="text-sm text-[#8b949e] mb-5">{t('Ship a homepage improvement and watch it travel from your editor to GitHub.', 'Homepage-এর একটি পরিবর্তন editor থেকে GitHub পর্যন্ত পাঠান।')}</p>
        <div className="grid md:grid-cols-4 gap-3 mb-5">{projectSteps.map((step, index) => <div key={step.command} className={`relative p-4 rounded-xl border ${index < projectStep ? 'border-[#238636] bg-[#238636]/10' : index === projectStep ? 'border-[#58a6ff] bg-[#58a6ff]/10' : 'border-[#30363d] bg-[#0d1117]'}`}><div className="text-[10px] font-mono mb-3" style={{color: step.color}}>{step.area}</div><code className="text-xs text-white break-words">{step.command}</code><p className="text-xs text-[#8b949e] mt-2">{step.detail}</p>{index < projectStep && <Check className="absolute right-3 top-3 w-4 h-4 text-[#3fb950]" />}</div>)}</div>
        <div className="flex flex-wrap gap-3"><button onClick={() => setProjectStep(s => Math.min(projectSteps.length, s + 1))} disabled={projectStep === projectSteps.length} className="px-4 py-2 rounded-lg bg-[#238636] disabled:opacity-40 text-white text-sm font-semibold flex items-center gap-2"><Play className="w-4 h-4" />{projectStep === projectSteps.length ? 'Project shipped!' : 'Run next step'}</button><button onClick={() => setProjectStep(0)} className="px-4 py-2 rounded-lg border border-[#30363d] text-sm flex items-center gap-2"><RefreshCcw className="w-4 h-4" />Reset</button><button onClick={() => onOpenLab('playground')} className="px-4 py-2 rounded-lg text-[#58a6ff] text-sm">Open command sandbox <ChevronRight className="inline w-4 h-4" /></button></div>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <SimulationCard icon={<GitPullRequest className="w-5 h-5 text-[#a371f7]"/>} title="Pull request simulator" subtitle="Feature branch → review → approval → merge" steps={['Create pull request', 'Reviewer leaves a comment', 'Push requested changes', 'Approve review', 'Squash and merge']} current={prStep} setCurrent={setPrStep} labels={['Open PR', 'Review', 'Update', 'Approve', 'Merge']} />
        <SimulationCard icon={<Users className="w-5 h-5 text-[#58a6ff]"/>} title="Alice & Bob collaboration" subtitle="See why fetch, pull and rebase matter" steps={['Alice pushes commit A3', "Bob's main is now behind", 'Bob runs git fetch', 'Bob rebases work onto origin/main', 'Bob pushes without conflict']} current={collabStep} setCurrent={setCollabStep} labels={['Alice pushes', 'Compare', 'Fetch', 'Rebase', 'Push']} />
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
          <div className="flex items-center gap-2 mb-4"><ShieldAlert className="w-5 h-5 text-[#f85149]"/><h2 className="text-xl font-bold text-white">Undo my mistake</h2></div>
          <div className="flex flex-wrap gap-2 mb-4">{mistakes.map((item, index) => <button key={item.title} onClick={() => setMistake(index)} className={`px-3 py-2 rounded-lg text-xs border ${mistake === index ? 'bg-[#58a6ff]/15 border-[#58a6ff] text-white' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>{item.title}</button>)}</div>
          <div className="rounded-xl bg-[#0d1117] border border-[#30363d] p-4"><div className="flex justify-between gap-4"><h3 className="font-semibold text-white">{mistakes[mistake].title}</h3><span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${mistakes[mistake].risk === 'High' ? 'bg-[#f85149]/20 text-[#f85149]' : mistakes[mistake].risk === 'Caution' ? 'bg-[#d29922]/20 text-[#d29922]' : 'bg-[#238636]/20 text-[#3fb950]'}`}>{mistakes[mistake].risk}</span></div><pre className="my-3 text-xs text-[#79c0ff] whitespace-pre-wrap bg-black/30 p-3 rounded-lg overflow-x-auto">{mistakes[mistake].safe}</pre><p className="text-sm text-[#8b949e]">{mistakes[mistake].why}</p></div>
        </div>
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5"><div className="flex items-center gap-2 mb-4"><Github className="w-5 h-5 text-white"/><h2 className="text-xl font-bold text-white">GitHub UI tour</h2></div><div className="flex flex-wrap gap-1.5 mb-4">{tour.map((item, index) => <button key={item[0]} onClick={() => setTourIndex(index)} className={`text-[11px] px-2 py-1.5 rounded-md ${tourIndex === index ? 'bg-[#21262d] text-white border border-[#58a6ff]' : 'text-[#8b949e] border border-[#30363d]'}`}>{item[0]}</button>)}</div><div className="rounded-xl bg-[#0d1117] border border-[#30363d] p-4 min-h-32"><h3 className="font-semibold text-[#58a6ff]">{tour[tourIndex][0]}</h3><p className="text-sm text-[#8b949e] mt-2">{tour[tourIndex][1]}</p></div></div>
      </section>

      <section className="grid xl:grid-cols-2 gap-6">
        <SimulationCard icon={<BookOpen className="w-5 h-5 text-[#d29922]"/>} title="Issue → Project workflow" subtitle="Plan work before writing code" steps={['Create issue: Improve mobile navigation', 'Add bug label and assign Alice', 'Move card to In progress', 'Link feature branch and pull request', 'Merge PR and auto-close issue']} current={issueStep} setCurrent={setIssueStep} labels={['Issue', 'Triage', 'Start', 'Link PR', 'Done']} />
        <SimulationCard icon={<Activity className="w-5 h-5 text-[#3fb950]"/>} title="GitHub Actions pipeline" subtitle="Push → build → test → deploy" steps={['Push triggers workflow', 'Install dependencies', 'Build production bundle', 'Run automated tests', 'Deploy successful release']} current={actionStep} setCurrent={setActionStep} labels={['Push', 'Install', 'Build', 'Test', 'Deploy']} />
      </section>

      <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4"><Wand2 className="w-5 h-5 text-[#a371f7]"/><h2 className="text-xl font-bold text-white">Continue in the interactive labs</h2></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[['architecture','Git vs GitHub flow','Local and remote states'],['playground','Branch & command sandbox','Run simulated commands'],['workflow','GitHub workflow','Fork, PR and merge'],['practice','Practice with feedback','Scenarios and explanations']].map(([id,title,note]) => <button key={id} onClick={() => onOpenLab(id)} className="p-4 text-left rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] group"><h3 className="text-sm font-semibold text-white group-hover:text-[#58a6ff]">{title}</h3><p className="text-xs text-[#8b949e] mt-1">{note}</p></button>)}
        </div>
      </section>
    </div>
  );
};

interface SimulationCardProps {
  icon: React.ReactNode; title: string; subtitle: string; steps: string[]; labels: string[];
  current: number; setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ icon, title, subtitle, steps, labels, current, setCurrent }) => (
  <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
    <div className="flex items-center gap-2">{icon}<h2 className="text-lg font-bold text-white">{title}</h2></div>
    <p className="text-xs text-[#8b949e] mt-1 mb-5">{subtitle}</p>
    <div className="flex items-center mb-5" aria-label={`${title} progress`}>{labels.map((label, index) => <React.Fragment key={label}><div className="flex flex-col items-center min-w-12"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${index < current ? 'bg-[#238636] border-[#238636] text-white' : index === current ? 'bg-[#58a6ff]/20 border-[#58a6ff] text-[#58a6ff]' : 'bg-[#0d1117] border-[#30363d] text-[#8b949e]'}`}>{index < current ? <Check className="w-3.5 h-3.5"/> : index + 1}</div><span className="text-[9px] text-[#8b949e] mt-1 text-center">{label}</span></div>{index < labels.length - 1 && <div className={`h-px flex-1 -mt-4 ${index < current ? 'bg-[#238636]' : 'bg-[#30363d]'}`} />}</React.Fragment>)}</div>
    <div className="rounded-xl bg-[#0d1117] border border-[#30363d] p-4 min-h-24 flex items-center gap-3">{current === steps.length ? <><CheckCircle2 className="w-8 h-8 text-[#3fb950] shrink-0"/><div><div className="text-white font-semibold">Simulation complete</div><div className="text-xs text-[#8b949e]">Reset it and try the workflow again.</div></div></> : <><div className="w-8 h-8 rounded-lg bg-[#21262d] flex items-center justify-center text-[#58a6ff] font-mono text-sm">{current + 1}</div><div><div className="text-white text-sm font-medium">{steps[current]}</div><div className="text-xs text-[#8b949e]">Observe the state, then continue.</div></div></>}</div>
    <div className="flex gap-2 mt-4"><button onClick={() => setCurrent(s => Math.min(steps.length, s + 1))} disabled={current === steps.length} className="px-3 py-2 rounded-lg bg-[#238636] text-white text-xs font-semibold disabled:opacity-40">{current === steps.length ? 'Completed' : 'Next action'}</button><button onClick={() => setCurrent(0)} className="px-3 py-2 rounded-lg border border-[#30363d] text-xs text-[#8b949e]">Reset</button></div>
  </div>
);
