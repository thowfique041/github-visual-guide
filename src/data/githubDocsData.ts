export interface DocSection {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  content: string;
  keyPoints: string[];
  cliExamples?: { label: string; code: string }[];
}

export const GITHUB_DOCS_DATA: DocSection[] = [
  {
    id: 'git-vs-github-intro',
    title: 'What is Git? What is GitHub? Why Use Them?',
    category: 'Fundamentals',
    readTime: '5 min',
    summary: 'A complete beginner introduction to Git and GitHub, their core differences, why every developer needs them, and real-world analogies.',
    keyPoints: [
      'Git is a local Version Control System (VCS) that tracks changes in your files on your computer.',
      'GitHub is a cloud-based hosting platform that stores Git repositories online and enables team collaboration.',
      'Git works 100% offline without internet; GitHub requires internet to push, pull, or share code.',
      'Git was created by Linus Torvalds in 2005; GitHub is a cloud service owned by Microsoft.',
      'Developers use them for instant undo/recovery, fearless branching, and frictionless teamwork.'
    ],
    content: `## 1. What is Git?

**Git** is a free, open-source **Distributed Version Control System (DVCS)** that runs locally on your computer.

In simple terms: Git is a **"Time Machine"** for your project. Every time you write code, add a feature, or delete files, Git saves a snapshot (called a **commit**) of your project's exact state.

### Real-World Example
Before Git, people saved project versions like this:
- \`final_project.zip\`
- \`final_project_updated.zip\`
- \`final_project_real_final.zip\`
- \`final_project_v2_FINAL_done.zip\`

With Git, you never duplicate files or folders. You keep a single clean folder, and Git preserves the entire historical timeline (who changed what line of code, on what date, and why) inside a hidden \`.git\` database.

---

## 2. What is GitHub?

**GitHub** is a **cloud-hosted web platform** where developers upload their Git repositories to back them up and work together with teammates.

### The Camera vs. Cloud Analogy:
- **Git** is like your phone's **Camera**: it captures photos (snapshots of code) locally, anytime, without an internet connection.
- **GitHub** is like **Google Photos or Instagram**: an online cloud gallery where you upload those pictures so others can view, comment, and collaborate.

---

## 3. Git vs. GitHub Comparison

| Feature | Git | GitHub |
| :--- | :--- | :--- |
| **What is it?** | A local version control software | A cloud-hosted web platform |
| **Installation** | Installed on your local machine | Hosted on remote cloud web servers |
| **Internet Required?** | **No**, works 100% offline | **Yes**, needed to sync, push, and pull |
| **Primary Purpose** | Track code history, branches, commits | Cloud backup, Pull Requests, Code Reviews, CI/CD |
| **Interface** | Command Line Interface (CLI) / Git GUI | Web Interface + GitHub CLI (\`gh\`) |
| **Creator / Owner** | Created by Linus Torvalds (Open Source) | Acquired and operated by Microsoft Corp. |

---

## 4. Why Do Developers & Companies Use Them?

### 1. Instant Undo & Safety (Time Travel)
If you introduce a critical bug or your app breaks, Git allows you to revert back to any previous working commit in seconds.

### 2. Fearless Branching
Want to test a experimental feature without breaking the production website? Create a **Branch**. If the experiment succeeds, merge it into \`main\`. If it fails, delete it with zero consequences.

### 3. Frictionless Team Collaboration
Dozens of developers can work simultaneously on the same codebase without overwriting each other's work. Team members submit **Pull Requests (PRs)** for peer review before code is merged.

### 4. Developer Resume & Open Source
GitHub is the home of modern open source (Linux, React, VS Code, Python). Your GitHub profile acts as a verified, living portfolio of your software engineering capabilities.

### 5. Automated CI/CD Pipelines
With **GitHub Actions**, you can automatically run automated test suites, lint checks, and deploy code to production servers on every push.`,
    cliExamples: [
      { label: 'Check if Git is installed', code: 'git --version' },
      { label: 'Initialize Git tracking in a new project', code: 'git init' },
      { label: 'Link your local repository to GitHub', code: 'git remote add origin https://github.com/username/my-repo.git' },
      { label: 'Upload your local commits to GitHub', code: 'git push -u origin main' }
    ]
  },
  {
    id: 'github-flow',
    title: 'GitHub Flow: Branch-Based Workflow',
    category: 'Workflows',
    readTime: '4 min',
    summary: 'A lightweight, branch-based workflow that supports teams and projects where deployments are made regularly.',
    keyPoints: [
      'The main branch always contains production-ready, deployable code.',
      'Create descriptive branches directly from main (e.g. feature/add-oauth, fix/login-typo).',
      'Commit and push changes frequently to keep team visible on work-in-progress.',
      'Open Pull Requests early for feedback, CI automation, and peer code reviews.',
      'Merge to main only after review approvals and automated CI pass.'
    ],
    content: `GitHub Flow is the core workflow model designed by GitHub for modern high-velocity engineering teams.

### Core Principles
1. **Anything in \`main\` is deployable:** Production never receives broken commits directly.
2. **Branch from \`main\`:** Always start new features or bug fixes from the tip of the latest \`main\` branch.
3. **Regular atomic commits:** Make commits clear, well-described, and modular.
4. **Pull Requests (PR):** Use PRs not just when finished, but to discuss architecture, review diffs, and run automated GitHub Actions.
5. **Continuous Deployment:** Once merged, changes can automatically ship to production or staging environments.`,
    cliExamples: [
      { label: 'Create new branch and switch', code: 'git switch -c feature/dark-mode' },
      { label: 'Stage and commit your changes', code: 'git add . && git commit -m "feat: dark theme variables"' },
      { label: 'Push to remote with upstream tracking', code: 'git push -u origin feature/dark-mode' }
    ]
  },
  {
    id: 'pull-requests',
    title: 'Pull Requests & Code Reviews',
    category: 'Collaboration',
    readTime: '5 min',
    summary: 'How to propose changes, collaborate with reviewers, conduct inline diff reviews, and merge safely.',
    keyPoints: [
      'PRs show the exact line-by-line diff between two branches.',
      'Reviewers can leave comments on specific lines, suggest code replacements, and request alterations.',
      'Draft PRs allow early feedback before work is finalized.',
      'Protected branches can mandate at least 1 or 2 reviewer approvals before merge.'
    ],
    content: `Pull Requests let you tell others about changes you've pushed to a branch in a repository on GitHub. Once a PR is opened, you can discuss and review the potential changes with collaborators and add follow-up commits before your changes are merged into the base branch.

### Code Review Etiquette
- **Be constructive:** Focus on code readability, security, architectural consistency, and performance.
- **Provide context:** Use GitHub's inline suggestion feature (\`\`\`suggestion) so the author can apply fixes with a single click.
- **Automated status checks:** Ensure CI linting, test suites, and preview deployments pass before giving final approval.`,
    cliExamples: [
      { label: 'Create PR using GitHub CLI', code: 'gh pr create --title "feat: user profile avatar" --body "Closes #42"' },
      { label: 'Check out colleague\'s PR locally', code: 'gh pr checkout 128' },
      { label: 'Merge approved PR', code: 'gh pr merge --squash --delete-branch' }
    ]
  },
  {
    id: 'merge-strategies',
    title: 'Merge Strategies: Create Merge Commit vs Squash vs Rebase',
    category: 'Git Architecture',
    readTime: '6 min',
    summary: 'Understand the three distinct ways GitHub merges a Pull Request into the main branch.',
    keyPoints: [
      'Create a Merge Commit: Preserves all individual commits and creates a 2-parent merge node.',
      'Squash and Merge: Collapses all PR commits into a single clean commit on main. Great for tidy logs.',
      'Rebase and Merge: Replays PR commits one by one on top of main, resulting in linear history without merge commits.'
    ],
    content: `When merging a pull request on GitHub, you can choose between three distinct merge strategies:

### 1. Create a Merge Commit (Standard Merge)
All commits from the feature branch are added to the base branch along with a dedicated merge commit. 
- **Pros:** Full granular history of every intermediate commit is kept.
- **Cons:** Can create messy "branch train tracks" in git log.

### 2. Squash and Merge (Most Popular)
The pull request's multiple commits are condensed into a single commit on the default branch.
- **Pros:** Keeps \`main\` commit history clean, readable, and easy to revert if a regression occurs.
- **Cons:** Loses intermediate incremental commit history.

### 3. Rebase and Merge
Commits are replayed individually on top of \`main\` without creating a merge commit.
- **Pros:** Creates a strict linear history while keeping individual commits.
- **Cons:** SHA hashes of all branch commits change.`,
    cliExamples: [
      { label: 'Merge with merge commit', code: 'git merge --no-ff feature/search' },
      { label: 'Local squash merge', code: 'git merge --squash feature/search && git commit -m "feat: add search"' },
      { label: 'Local rebase before merge', code: 'git checkout feature/search && git rebase main' }
    ]
  },
  {
    id: 'forks-and-upstream',
    title: 'Forks, Upstream Syncing & Open Source',
    category: 'Open Source',
    readTime: '4 min',
    summary: 'Contributing to repositories where you lack direct write permissions via personal forks and upstream syncs.',
    keyPoints: [
      'A Fork is a server-side clone of a repository under your GitHub account.',
      'Configure the original repository as an "upstream" remote to stay up to date.',
      'Never commit directly to your fork\'s main branch; use feature branches for pull requests.'
    ],
    content: `Forking is the backbone of open source software development on GitHub.

### Syncing a Fork with the Original Upstream
When you fork a repository, changes made by other contributors to the original repository do not automatically appear in your fork. To keep your fork up to date:

1. Add the original repository as a remote named \`upstream\`.
2. Fetch updates from \`upstream\`.
3. Merge or rebase the upstream changes into your local branch.`,
    cliExamples: [
      { label: 'Add original repo as upstream', code: 'git remote add upstream https://github.com/original-owner/repo.git' },
      { label: 'Verify your remotes (origin + upstream)', code: 'git remote -v' },
      { label: 'Fetch all upstream branches', code: 'git fetch upstream' },
      { label: 'Sync local main with upstream main', code: 'git switch main && git merge upstream/main' },
      { label: 'Push updated main to your fork', code: 'git push origin main' }
    ]
  },
  {
    id: 'github-actions',
    title: 'GitHub Actions & CI/CD Pipelines',
    category: 'Automation',
    readTime: '5 min',
    summary: 'Automate testing, linting, building, and deployments on every push and pull request with YAML workflows.',
    keyPoints: [
      'Workflows live in .github/workflows/*.yml in your repository.',
      'Triggers include: push, pull_request, schedule (cron), or manual workflow_dispatch.',
      'Jobs run concurrently by default on GitHub-hosted virtual runners (Ubuntu, macOS, Windows).',
      'Automates quality checks before any PR can be merged.'
    ],
    content: `GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline.

### Example Workflow File (\`.github/workflows/ci.yml\`)
\`\`\`yaml
name: CI Test & Build
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run build
\`\`\``,
    cliExamples: [
      { label: 'Check CI status of PR via GitHub CLI', code: 'gh pr checks' },
      { label: 'View running workflow runs', code: 'gh run list' },
      { label: 'Watch logs of active CI run', code: 'gh run watch' }
    ]
  },
  {
    id: 'ssh-and-security',
    title: 'SSH Keys, GPG Signing & Security',
    category: 'Security',
    readTime: '4 min',
    summary: 'Securing GitHub authentication, generating Ed25519 SSH keys, and cryptographically signing commits.',
    keyPoints: [
      'GitHub deprecated password authentication for Git operations; SSH or Personal Access Tokens (PAT) are required.',
      'Ed25519 is the recommended secure and fast SSH key algorithm.',
      'GPG or SSH commit signing displays a green "Verified" badge next to your commits on GitHub.'
    ],
    content: `Authenticating with GitHub securely prevents credential interception and ensures repository integrity.

### Generating an modern Ed25519 SSH Key
Run the terminal commands to generate the key pair, add it to your ssh-agent, and copy the public key to paste into GitHub Settings → SSH and GPG keys.`,
    cliExamples: [
      { label: 'Generate modern Ed25519 SSH key', code: 'ssh-keygen -t ed25519 -C "your_email@example.com"' },
      { label: 'Start ssh-agent in background', code: 'eval "$(ssh-agent -s)"' },
      { label: 'Add your private key to agent', code: 'ssh-add ~/.ssh/id_ed25519' },
      { label: 'Test your connection to GitHub', code: 'ssh -T git@github.com' }
    ]
  },
  {
    id: 'issues-and-milestones',
    title: 'Issues, Projects & Milestones',
    category: 'Project Management',
    readTime: '3 min',
    summary: 'Track bugs, enhancements, and tasks using GitHub Issues, Kanban Projects, and release Milestones.',
    keyPoints: [
      'Issues track ideas, feedback, tasks, or bugs for work on GitHub.',
      'Link PRs to issues with keywords like "Fixes #12" to automatically close the issue upon PR merge.',
      'Milestones group issues and pull requests toward specific release targets with due dates.'
    ],
    content: `GitHub Issues provide integrated task tracking right next to your code.

### Closing Issues via Commit Messages or PRs
When you merge a pull request, you can automatically close an issue by including specific keywords in the PR body or commit message:
- \`close #123\`
- \`closes #123\`
- \`fix #123\`
- \`fixes #123\`
- \`resolve #123\``,
    cliExamples: [
      { label: 'Create an issue via GitHub CLI', code: 'gh issue create --title "Bug: navbar overflow on mobile" --body "Steps to reproduce..."' },
      { label: 'List open issues', code: 'gh issue list' }
    ]
  }
];
