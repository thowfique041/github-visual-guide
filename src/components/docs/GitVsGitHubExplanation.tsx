import React, { useState } from 'react';
import { 
  GitBranch, 
  Cloud, 
  HardDrive, 
  Clock, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Layers, 
  AlertTriangle,
  FolderGit2,
  Workflow,
  Globe2,
  Lock,
  ChevronRight
} from 'lucide-react';

export const GitVsGitHubExplanation: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'both' | 'git' | 'github'>('both');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 1800);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'overview', title: '1. What is Git & GitHub?' },
    { id: 'real-world-analogy', title: '2. The Real-World Analogy' },
    { id: 'visual-architecture', title: '3. Visual Architecture Diagram' },
    { id: 'core-differences', title: '4. Git vs GitHub: Key Differences' },
    { id: 'why-use-git', title: '5. Why Do Developers Use Git?' },
    { id: 'why-use-github', title: '6. Why Do Teams Use GitHub?' },
    { id: 'essential-workflow', title: '7. Step-by-Step Beginner Workflow' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#58a6ff]/10 via-[#238636]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs font-mono text-[#58a6ff]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beginner Friendly Guide</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            What is Git? What is GitHub? Why Do We Use Them?
          </h1>

          <p className="text-sm sm:text-base text-[#8b949e] leading-relaxed">
            The ultimate visual guide for complete beginners. Understand the fundamental difference between the <strong className="text-white">Git engine</strong> on your computer and the <strong className="text-white">GitHub cloud platform</strong> on the web.
          </p>
        </div>
      </div>

      {/* 2-Column Layout: Sticky Outline Sidebar + Scrollable Comprehensive Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-3">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-lg">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#8b949e] font-semibold mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
              On This Page
            </h4>

            <nav className="space-y-1 text-xs">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full text-left py-2 px-2.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors font-medium flex items-center justify-between group"
                >
                  <span className="truncate">{link.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#58a6ff] transition-opacity shrink-0" />
                </button>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#30363d]/60">
              <div className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-[11px] text-[#8b949e] space-y-1">
                <span className="text-[#3fb950] font-bold block">💡 Quick Memory Trick:</span>
                <p className="leading-relaxed">
                  <strong className="text-white">Git</strong> is the local camera taking snapshots. <strong className="text-white">GitHub</strong> is the cloud photo album online.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Scrollable Content (9 cols) */}
        <div className="lg:col-span-9 space-y-12 bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-10 shadow-xl">
          
          {/* SECTION 1: OVERVIEW */}
          <section id="overview" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-2 text-xs font-mono text-[#58a6ff] font-semibold uppercase tracking-wider">
              <span>Section 1</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              1. What is Git &amp; What is GitHub?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Git Box */}
              <div className="bg-[#0d1117] border border-[#58a6ff]/30 p-5 rounded-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[#58a6ff]">
                  <HardDrive className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">What is Git?</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                  <strong>Git</strong> is a free and open-source <strong>Distributed Version Control System (VCS)</strong> that runs directly on your local computer. It acts as a <strong className="text-white">time machine for your code</strong>.
                </p>
                <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] text-xs font-mono text-[#8b949e] space-y-1">
                  <div>• Runs completely offline (No internet needed)</div>
                  <div>• Created by Linus Torvalds in 2005 (creator of Linux)</div>
                  <div>• Tracks changes, manages branches, and makes commits</div>
                </div>
              </div>

              {/* GitHub Box */}
              <div className="bg-[#0d1117] border border-[#bc8cff]/30 p-5 rounded-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[#bc8cff]">
                  <Cloud className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">What is GitHub?</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                  <strong>GitHub</strong> is a <strong>cloud-based web platform</strong> that hosts your Git repositories online. It lets developers collaborate, review code, track issues, and automate tests.
                </p>
                <div className="bg-[#161b22] p-3 rounded-lg border border-[#30363d] text-xs font-mono text-[#8b949e] space-y-1">
                  <div>• Requires internet to push, pull, and collaborate</div>
                  <div>• Owned by Microsoft Corporation</div>
                  <div>• Offers Pull Requests, Code Reviews, CI/CD, and hosting</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: THE REAL-WORLD ANALOGY */}
          <section id="real-world-analogy" className="space-y-4 scroll-mt-28 border-t border-[#30363d] pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-[#3fb950] font-semibold uppercase tracking-wider">
              <span>Section 2</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              2. The Real-World Analogy
            </h2>

            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              If you have never coded before, thinking about Git vs GitHub might feel confusing. Here are two real-world analogies that make it crystal clear:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0d1117] p-5 rounded-xl border border-[#30363d] space-y-2">
                <div className="text-xs font-mono text-amber-400 font-bold uppercase">Analogy 1: Camera vs Instagram</div>
                <div className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                  <p className="mb-2">
                    📸 <strong>Git is your phone's camera:</strong> You can take photos (commit code snapshots) all day in airplane mode without internet.
                  </p>
                  <p>
                    🌐 <strong>GitHub is Instagram / Google Photos:</strong> You upload those pictures to the cloud so your friends and team can see them, like them, and comment on them.
                  </p>
                </div>
              </div>

              <div className="bg-[#0d1117] p-5 rounded-xl border border-[#30363d] space-y-2">
                <div className="text-xs font-mono text-[#58a6ff] font-bold uppercase">Analogy 2: Word vs Google Docs</div>
                <div className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                  <p className="mb-2">
                    💻 <strong>Git is like Microsoft Word on your PC:</strong> You write your novel on your hard drive.
                  </p>
                  <p>
                    ☁️ <strong>GitHub is like Google Drive / Google Docs:</strong> You save it online where multiple co-authors can suggest edits, review chapters, and merge drafts simultaneously.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: VISUAL ARCHITECTURE */}
          <section id="visual-architecture" className="space-y-4 scroll-mt-28 border-t border-[#30363d] pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
              <span>Section 3</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              3. Visual Architecture: How Git &amp; GitHub Connect
            </h2>

            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              See the exact relationship between your computer and the GitHub cloud server:
            </p>

            {/* Interactive Flow Diagram SVG */}
            <div className="bg-[#0d1117] p-6 rounded-xl border border-[#30363d] overflow-x-auto">
              <div className="min-w-[650px] flex items-center justify-between gap-4 py-4">
                {/* Local PC Box */}
                <div className="flex-1 bg-[#161b22] border-2 border-[#58a6ff]/50 rounded-xl p-4 text-center space-y-3 shadow-lg">
                  <div className="flex items-center justify-center gap-2 text-[#58a6ff] font-bold text-sm">
                    <HardDrive className="w-5 h-5" />
                    <span>YOUR LOCAL COMPUTER (GIT)</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-amber-300">
                      Working Directory (Files on disk)
                    </div>
                    <div className="text-[#8b949e]">↓ <code className="text-white">git add</code></div>
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-emerald-300">
                      Staging Area (Index)
                    </div>
                    <div className="text-[#8b949e]">↓ <code className="text-white">git commit</code></div>
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-sky-300 font-bold">
                      Local Repository (.git database)
                    </div>
                  </div>
                  <span className="inline-block text-[11px] text-[#3fb950] font-mono bg-[#238636]/10 px-2 py-0.5 rounded border border-[#238636]/30">
                    Works 100% Offline
                  </span>
                </div>

                {/* Transfer Arrows */}
                <div className="flex flex-col items-center justify-center gap-4 px-2">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#58a6ff]">
                      <span>git push</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-[#8b949e]">Upload commits</span>
                  </div>

                  <div className="w-16 h-0.5 bg-[#30363d]" />

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#3fb950]">
                      <ArrowRight className="w-4 h-4 rotate-180" />
                      <span>git pull</span>
                    </div>
                    <span className="text-[10px] text-[#8b949e]">Download updates</span>
                  </div>
                </div>

                {/* GitHub Cloud Box */}
                <div className="flex-1 bg-[#161b22] border-2 border-purple-500/50 rounded-xl p-4 text-center space-y-3 shadow-lg">
                  <div className="flex items-center justify-center gap-2 text-purple-400 font-bold text-sm">
                    <Cloud className="w-5 h-5" />
                    <span>GITHUB.COM (CLOUD REMOTE)</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-purple-300">
                      Remote Repository (origin)
                    </div>
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-[#c9d1d9]">
                      Pull Requests &amp; Code Review
                    </div>
                    <div className="bg-[#0d1117] p-2 rounded border border-[#30363d] text-[#c9d1d9]">
                      GitHub Actions (Automated CI/CD)
                    </div>
                  </div>
                  <span className="inline-block text-[11px] text-purple-300 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    Accessible to Whole World/Team
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: KEY DIFFERENCES TABLE */}
          <section id="core-differences" className="space-y-4 scroll-mt-28 border-t border-[#30363d] pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
              <span>Section 4</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              4. Git vs GitHub: Direct Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse border border-[#30363d] rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-[#0d1117] text-[#8b949e] border-b border-[#30363d]">
                    <th className="p-3.5">Feature</th>
                    <th className="p-3.5 text-[#58a6ff]">Git</th>
                    <th className="p-3.5 text-purple-400">GitHub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#30363d]">
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">What is it?</td>
                    <td className="p-3 text-[#c9d1d9]">A local command-line software tool</td>
                    <td className="p-3 text-[#c9d1d9]">A cloud-hosted website &amp; service</td>
                  </tr>
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">Installation</td>
                    <td className="p-3 text-[#c9d1d9]">Installed locally on your computer</td>
                    <td className="p-3 text-[#c9d1d9]">Hosted in the cloud on web servers</td>
                  </tr>
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">Internet Connection</td>
                    <td className="p-3 text-[#3fb950]">Works 100% offline</td>
                    <td className="p-3 text-amber-400">Requires internet connection</td>
                  </tr>
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">Primary Function</td>
                    <td className="p-3 text-[#c9d1d9]">Track file history, branches, commits</td>
                    <td className="p-3 text-[#c9d1d9]">Share repos, Pull Requests, team collaboration</td>
                  </tr>
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">Interface</td>
                    <td className="p-3 text-[#c9d1d9]">CLI (Terminal) or desktop Git GUI</td>
                    <td className="p-3 text-[#c9d1d9]">Graphical Web Interface + GitHub CLI (gh)</td>
                  </tr>
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">Competitors / Alternatives</td>
                    <td className="p-3 text-[#c9d1d9]">Mercurial, SVN (Subversion)</td>
                    <td className="p-3 text-[#c9d1d9]">GitLab, Bitbucket, AWS CodeCommit</td>
                  </tr>
                  <tr className="hover:bg-[#0d1117]/50">
                    <td className="p-3 text-white font-bold">Creator &amp; Owner</td>
                    <td className="p-3 text-[#c9d1d9]">Created by Linus Torvalds (Open Source)</td>
                    <td className="p-3 text-[#c9d1d9]">Acquired by Microsoft in 2018</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 5: WHY USE GIT */}
          <section id="why-use-git" className="space-y-4 scroll-mt-28 border-t border-[#30363d] pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-[#58a6ff] font-semibold uppercase tracking-wider">
              <span>Section 5</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              5. Why Do Developers Use Git?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#1f6feb]/20 text-[#58a6ff] flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-white text-sm">Undo Mistakes (Time Travel)</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  Broke your entire project? No problem. In one second, you can rewind your code to any point in the past without losing anything.
                </p>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#238636]/20 text-[#3fb950] flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-white text-sm">Fearless Branching</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  Want to try a crazy idea? Create a new branch. If it fails, delete it. If it works, merge it back. Your production code is never put at risk.
                </p>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-white text-sm">Complete Local History</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  Every commit, message, author, and timestamp is stored right inside your hidden <code className="text-[#58a6ff]">.git</code> folder. It is super fast and requires no server.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: WHY USE GITHUB */}
          <section id="why-use-github" className="space-y-4 scroll-mt-28 border-t border-[#30363d] pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">
              <span>Section 6</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              6. Why Do Teams &amp; Companies Use GitHub?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-white text-sm">Team Collaboration &amp; PRs</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  Engineers open <strong>Pull Requests</strong> to discuss changes. Teammates review line-by-line diffs, suggest improvements, and approve before merging.
                </p>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-white text-sm">Safe Cloud Backup</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  Spilled coffee on your laptop? Hard drive crashed? Your code, branches, and full commit history remain 100% safe on GitHub.
                </p>
              </div>

              <div className="bg-[#0d1117] p-4 rounded-xl border border-[#30363d] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-white text-sm">Developer Resume &amp; Open Source</h3>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  Your GitHub profile is your living portfolio. Tech recruiters inspect your public repositories, contributions, and commits to evaluate your coding skills.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 7: STEP-BY-STEP WORKFLOW */}
          <section id="essential-workflow" className="space-y-4 scroll-mt-28 border-t border-[#30363d] pt-8">
            <div className="flex items-center gap-2 text-xs font-mono text-[#3fb950] font-semibold uppercase tracking-wider">
              <span>Section 7</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              7. The 5-Minute Beginner Workflow: From Scratch to GitHub
            </h2>

            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              Here is the standard series of commands every developer runs to take code from their computer to GitHub:
            </p>

            <div className="space-y-3 font-mono text-xs pt-2">
              {[
                { step: 'Step 1', title: 'Initialize Git in your project folder', cmd: 'git init', desc: 'Creates the hidden .git directory to start tracking files.' },
                { step: 'Step 2', title: 'Stage your files into the staging area (index)', cmd: 'git add .', desc: 'Prepares all changed files to be recorded in the snapshot.' },
                { step: 'Step 3', title: 'Save your commit snapshot permanently', cmd: 'git commit -m "Initial commit: create homepage"', desc: 'Creates a permanent version node with your message.' },
                { step: 'Step 4', title: 'Link your local repository to GitHub', cmd: 'git remote add origin https://github.com/your-username/my-repo.git', desc: 'Tells Git where to upload your code in the cloud.' },
                { step: 'Step 5', title: 'Push your code to GitHub', cmd: 'git push -u origin main', desc: 'Uploads your commits and branches to GitHub servers!' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0d1117] p-3.5 rounded-xl border border-[#30363d] space-y-1.5">
                  <div className="flex items-center justify-between text-[#8b949e]">
                    <span className="text-[#3fb950] font-bold">{item.step}: {item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.cmd)}
                      className="text-[#8b949e] hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedCmd === item.cmd ? <Check className="w-3.5 h-3.5 text-[#3fb950]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCmd === item.cmd ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <code className="text-[#58a6ff] block text-xs">$ {item.cmd}</code>
                  <p className="text-[11px] text-[#8b949e] font-sans">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
