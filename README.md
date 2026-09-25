# Git Visual Lab

An interactive, course-first platform for learning Git and GitHub by seeing what each action changes.

## Learning journey

The 59 lessons span foundations, the Git model, a first workflow, history, branches, remotes, undo, stash, collaboration, advanced Git, GitHub repository setup, planning, automation, security, publishing, and a final project. Each lesson follows **learn → watch → practice → challenge → progress**. Every lesson is open at any time; completion and practice progress are saved in the browser but never restrict access. Direct links such as `/lesson/20` also work.

The guided demonstration runs commands against the same in-browser state model as the terminal. The learner can replay the demonstration, try the command, solve a realistic scenario, and inspect the resulting files, staging area, commit graph, remote state, and optional state panel. A separate playground allows free experimentation.

## Practical exercises

The **Practical exercises** area adds 47 freely accessible tasks across fundamentals, branches, GitHub remotes, recovery, stash, collaboration, advanced Git, real-world missions, and a final Git Survival Challenge. Each exercise seeds a realistic repository, shares the lesson simulator and visualization, and validates the resulting Git state rather than a single prescribed command string. Progressive hints, optional guidance, reset/try-again, immediate feedback, and completion/attempt statistics are available. Progress persists locally in the browser. Direct links such as `/exercise/merge-conflict` work.

The simulated file commands `touch <file>`, `edit <file>`, `rm <file>`, and `mv <old> <new>` change only the browser model. For example, `edit app.js "new code"` replaces the file contents in the simulated working directory.

## Simulator scope

The terminal safely simulates the Git commands taught in the course. It does not run commands on the learner's computer or connect to a real GitHub repository. `edit <file>` represents changing a file in a text editor; supported `gh` commands simulate GitHub CLI actions. `lab` commands model GitHub website settings and are **not** real shell commands. The visual GitHub workspace tracks repositories, Issues, Discussions, Projects, Actions checks, permissions, protection, security, Releases, Pages, and Packages. Advanced operations are educational approximations, especially interactive rebase, bisect, GitHub review, and publishing.

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to check types and produce the production build.

Exercise end-to-end smoke cases can be run with esbuild and Node:

```bash
./node_modules/.bin/esbuild scripts/exercise-smoke.ts --bundle --platform=node --format=esm --outfile=/tmp/gitlab-exercise-smoke.mjs
node /tmp/gitlab-exercise-smoke.mjs
```

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, SVG, and Lucide icons.
