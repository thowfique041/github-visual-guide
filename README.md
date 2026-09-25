# Git Visual Lab

An interactive, course-first platform for learning Git and GitHub by seeing what each action changes.

## Learning journey

The 44 lessons span foundations, the Git model, a first workflow, history, branches, remotes, undo, stash, collaboration, advanced Git, and a final project. Each lesson follows **learn → watch → practice → challenge → progress**. Every lesson is open at any time; completion and practice progress are saved in the browser but never restrict access. Direct links such as `/lesson/20` also work.

The guided demonstration runs commands against the same in-browser state model as the terminal. The learner can replay the demonstration, try the command, solve a realistic scenario, and inspect the resulting files, staging area, commit graph, remote state, and optional state panel. A separate playground allows free experimentation.

## Simulator scope

The terminal safely simulates the Git commands taught in the course. It does not run commands on the learner's computer or connect to a real GitHub repository. `edit <file>` represents changing a file in a text editor; a small set of `gh` commands represents fork and pull-request actions. Advanced operations are educational approximations, especially interactive rebase, bisect, and GitHub review.

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to check types and produce the production build.

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, SVG, and Lucide icons.
