import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, 
  GitPullRequest, 
  CheckCircle, 
  UserCheck, 
  GitMerge, 
  GitBranch, 
  Cloud, 
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Terminal
} from 'lucide-react';

export const GitHubWorkflowVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const workflowSteps = [
    {
      id: 0,
      title: '1. Create / Clone Repo',
      cli: 'git clone https://github.com/org/project.git',
      desc: 'Download the centralized project from GitHub to your local workstation. Git sets up "origin" remote automatically.',
      icon: Cloud,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Local Machine'
    },
    {
      id: 1,
      title: '2. Create Isolated Branch',
      cli: 'git switch -c feature/auth-flow',
      desc: 'Never commit directly to production "main". Always build features, fixes, or experiments in dedicated branches.',
      icon: GitBranch,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Local Branch'
    },
    {
      id: 2,
      title: '3. Stage & Commit Locally',
      cli: 'git add . && git commit -m "feat: jwt login"',
      desc: 'Iteratively build your feature. Create descriptive, atomic commits that capture distinct milestones.',
      icon: Terminal,
      color: 'from-amber-500 to-orange-600',
      tag: 'Local History'
    },
    {
      id: 3,
      title: '4. Push Branch to GitHub',
      cli: 'git push -u origin feature/auth-flow',
      desc: 'Publish your branch to the remote server so GitHub can run automated CI tests and host your Pull Request.',
      icon: Cloud,
      color: 'from-sky-500 to-blue-600',
      tag: 'Remote Upload'
    },
    {
      id: 4,
      title: '5. Open Pull Request (PR)',
      cli: 'gh pr create --title "feat: Add JWT auth" --body "..."',
      desc: 'Inform maintainers and team members that your code is ready for review. Summarize changes and link issue tickets.',
      icon: GitPullRequest,
      color: 'from-purple-500 to-violet-600',
      tag: 'GitHub Platform'
    },
    {
      id: 5,
      title: '6. Code Review & CI Tests',
      cli: 'Automated CI Checks + Peer Line Comments',
      desc: 'Teammates review your diff, request improvements, and GitHub Actions verify that unit tests and linting pass.',
      icon: UserCheck,
      color: 'from-pink-500 to-rose-600',
      tag: 'Collaboration'
    },
    {
      id: 6,
      title: '7. Merge to Main',
      cli: 'GitHub Merge (Squash or Rebase Merge)',
      desc: 'Once approved and checks pass, the PR is merged into main. The feature branch is safely deleted.',
      icon: GitMerge,
      color: 'from-emerald-500 to-green-600',
      tag: 'Production Delivery'
    },
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30363d]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <GitPullRequest className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">End-to-End GitHub Development Flow</h2>
          </div>
          <p className="text-sm text-[#8b949e] mt-1">
            The standard collaborative cycle used by modern software teams across the globe. Click each milestone to explore.
          </p>
        </div>

        <button
          onClick={() => setActiveStep(0)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d] self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Workflow
        </button>
      </div>

      {/* Horizontal Flow Step Nodes */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                    isCurrent
                      ? 'bg-[#1f6feb]/20 text-[#58a6ff] border-[#1f6feb] shadow-lg shadow-[#1f6feb]/10 ring-1 ring-[#1f6feb]'
                      : isCompleted
                      ? 'bg-[#238636]/10 text-[#3fb950] border-[#238636]/40'
                      : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:text-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    isCurrent ? 'bg-[#58a6ff] text-black font-bold' : isCompleted ? 'bg-[#3fb950] text-black' : 'bg-[#21262d] text-[#8b949e]'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" /> : idx + 1}
                  </div>
                  <span className="font-semibold">{step.title.split('. ')[1]}</span>
                </button>
                {idx < workflowSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#484f58] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Active Step Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-semibold bg-[#21262d] text-[#58a6ff] px-2.5 py-1 rounded-md border border-[#30363d]">
                  {workflowSteps[activeStep].tag}
                </span>
                <span className="text-xs text-[#8b949e] font-mono">Step {activeStep + 1} of 7</span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight">
                {workflowSteps[activeStep].title}
              </h3>

              <p className="text-sm text-[#c9d1d9] leading-relaxed max-w-2xl">
                {workflowSteps[activeStep].desc}
              </p>

              <div className="pt-2">
                <span className="text-xs text-[#8b949e] font-mono block mb-1.5">Terminal / Action Equivalent:</span>
                <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] font-mono text-xs text-[#58a6ff] flex items-center justify-between">
                  <code>$ {workflowSteps[activeStep].cli}</code>
                </div>
              </div>
            </div>

            {/* Visual Action Button to advance */}
            <div className="flex flex-col justify-end gap-2 shrink-0 md:w-56">
              {activeStep < workflowSteps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold shadow transition-all"
                >
                  <span>Proceed to Step {activeStep + 2}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-3 bg-[#238636]/10 border border-[#238636]/30 rounded-xl text-center">
                  <span className="text-xs font-bold text-[#3fb950] block">🎉 Workflow Complete!</span>
                  <span className="text-[11px] text-[#8b949e]">Feature is live in production main</span>
                </div>
              )}

              {activeStep > 0 && (
                <button
                  onClick={() => setActiveStep(prev => prev - 1)}
                  className="w-full py-1.5 px-4 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white text-xs font-mono border border-[#30363d] transition-all text-center"
                >
                  Previous Step
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
