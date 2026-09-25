# GitHub Visual Guide

An interactive Git and GitHub learning platform that shows repository state changes instead of asking learners to memorize commands.

## Features

- 39-command searchable reference with before/after explanations
- Animated working tree, staging, local repository, and remote flow
- Interactive commit graph and simulated terminal
- Merge conflict, reset/revert, rebase, and GitHub workflow visualizers
- Scenario-based practice quizzes
- Problem Solver with searchable real-world errors, diagnostic commands, and risk-labelled recovery paths
- Safety guidance for destructive commands, history rewrites, and exposed credentials
- 18 guided lessons across beginner, intermediate, and advanced levels; each includes a goal, ordered steps, an example, a practice link, and an answer check before progress is saved
- Contextual links from lessons to visual labs, reference guides, and scenario quizzes
- Real-project, pull-request, teammate collaboration, Issues and Actions simulations
- GitHub interface tour and risk-labelled “Undo my mistake” recipes
- English/Bangla language switcher and accessibility controls

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
npm run preview
```

## Technology

React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide icons.

## Learning safety

The terminal is a browser-based simulator. It does not execute commands on the learner's computer. Destructive recovery techniques are labelled and should be tested on a backup branch or disposable repository first.
