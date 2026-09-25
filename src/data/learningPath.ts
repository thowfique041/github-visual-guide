export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CourseLesson {
  id: string;
  level: CourseLevel;
  title: string;
  summary: string;
  goal: string;
  explanation: string;
  steps: string[];
  example: string;
  question: string;
  choices: string[];
  answer: number;
  feedback: string;
  lab: string;
  labLabel: string;
}

export const courseLessons: CourseLesson[] = [
  {
    id: 'repo', level: 'beginner', title: 'Repository basics', summary: 'Create a safe home for project history.',
    goal: 'Explain what a repository stores and initialize one.',
    explanation: 'A Git repository is a project folder whose .git directory records commits and branch pointers. Git works locally; GitHub hosts a copy online.',
    steps: ['Create an empty project folder.', 'Run git init inside that folder.', 'Run git status to see the current branch and clean working tree.'],
    example: 'mkdir hello-git\ncd hello-git\ngit init\ngit status',
    question: 'Which command starts Git tracking in the current folder?', choices: ['git clone', 'git init', 'git push'], answer: 1,
    feedback: 'git init creates the local .git database. It does not create a GitHub repository.', lab: 'architecture', labLabel: 'Explore Git vs GitHub',
  },
  {
    id: 'clone', level: 'beginner', title: 'Clone a project', summary: 'Copy a remote repository to your computer.',
    goal: 'Clone a GitHub repository and identify its remote.',
    explanation: 'Cloning downloads repository files and history, then connects the local copy to the remote named origin.',
    steps: ['Copy a repository URL from GitHub.', 'Run git clone with that URL.', 'Enter the new folder and inspect git remote -v.'],
    example: 'git clone https://github.com/owner/project.git\ncd project\ngit remote -v',
    question: 'What does git clone download?', choices: ['Only the latest file', 'Files and repository history', 'Only GitHub Issues'], answer: 1,
    feedback: 'A clone includes files, commits, and branch information, and normally sets origin.', lab: 'architecture', labLabel: 'See local and remote states',
  },
  {
    id: 'edit', level: 'beginner', title: 'Edit & inspect', summary: 'See how Git detects file changes.',
    goal: 'Tell modified, untracked, and committed files apart.',
    explanation: 'The working tree contains the files you edit. git status shows changes; git diff shows unstaged line changes.',
    steps: ['Edit an existing file and create a new file.', 'Run git status to find modified and untracked files.', 'Run git diff to inspect the edit before staging.'],
    example: 'git status\ngit diff',
    question: 'Which command lists modified and untracked files?', choices: ['git status', 'git merge', 'git tag'], answer: 0,
    feedback: 'git status summarizes the working tree and staging area.', lab: 'architecture', labLabel: 'Explore the three areas',
  },
  {
    id: 'stage', level: 'beginner', title: 'Stage changes', summary: 'Choose what belongs in the next snapshot.',
    goal: 'Stage a specific file without including unrelated work.',
    explanation: 'The staging area is the draft of your next commit. Stage selected files, then review the staged diff.',
    steps: ['Choose the file that belongs in the commit.', 'Run git add with its filename.', 'Run git diff --staged to review the draft snapshot.'],
    example: 'git add src/app.js\ngit diff --staged',
    question: 'How do you stage only app.js?', choices: ['git add .', 'git add app.js', 'git push app.js'], answer: 1,
    feedback: 'Naming the file avoids staging unrelated changes. git add . stages everything in the current tree.', lab: 'architecture', labLabel: 'Visualize staging',
  },
  {
    id: 'commit', level: 'beginner', title: 'Create a commit', summary: 'Save a meaningful checkpoint locally.',
    goal: 'Create a local commit and inspect it.',
    explanation: 'A commit records the staged snapshot and a message. It remains local until pushed.',
    steps: ['Check git status and the staged diff.', 'Commit with a short message describing the change.', 'Run git log --oneline to inspect the new checkpoint.'],
    example: 'git diff --staged\ngit commit -m "Improve navigation"\ngit log --oneline -3',
    question: 'What goes into a new commit?', choices: ['Every file on disk', 'Only staged changes', 'Only files on GitHub'], answer: 1,
    feedback: 'Git commits the staging area, not every edit in the working tree.', lab: 'playground', labLabel: 'Practice a commit',
  },
  {
    id: 'push', level: 'beginner', title: 'Push to GitHub', summary: 'Publish local commits to the remote.',
    goal: 'Explain when a local commit appears on GitHub.',
    explanation: 'git push sends local commits to a remote branch. The first push of a new branch can set its upstream.',
    steps: ['Confirm the branch with git branch --show-current.', 'Confirm origin with git remote -v.', 'Push the branch and set upstream when needed.'],
    example: 'git branch --show-current\ngit remote -v\ngit push -u origin feature/navigation',
    question: 'A commit exists only on your laptop. What publishes it?', choices: ['git add', 'git push', 'git status'], answer: 1,
    feedback: 'git push transfers commits to the remote repository.', lab: 'playground', labLabel: 'Simulate a push',
  },
  {
    id: 'branch', level: 'beginner', title: 'Work on a branch', summary: 'Build a feature away from main.',
    goal: 'Create and switch to a feature branch.',
    explanation: 'A branch is a movable pointer to commits. A feature branch lets you develop and review a change independently.',
    steps: ['Start from an up-to-date main branch.', 'Create and switch to a named feature branch.', 'Commit the feature there before opening a pull request.'],
    example: 'git switch main\ngit pull\ngit switch -c feature/navigation',
    question: 'Which command creates and switches to a new branch?', choices: ['git switch -c feature/navigation', 'git branch -d feature/navigation', 'git fetch'], answer: 0,
    feedback: 'git switch -c creates the branch and moves HEAD to it.', lab: 'playground', labLabel: 'Practice branching',
  },
  {
    id: 'pr', level: 'beginner', title: 'Open a pull request', summary: 'Ask teammates to review the change.',
    goal: 'Describe the purpose of a pull request.',
    explanation: 'A pull request compares a source branch with a target branch and provides a place for review, discussion, and checks.',
    steps: ['Push your feature branch.', 'On GitHub, compare it against main.', 'Write what changed, why, and how it was checked.'],
    example: 'git push -u origin feature/navigation\n# GitHub: Compare & pull request',
    question: 'What should a PR target for a typical feature?', choices: ['The feature branch itself', 'The branch receiving the change, often main', 'A random fork'], answer: 1,
    feedback: 'The base branch receives the changes after merge.', lab: 'workflow', labLabel: 'Simulate a pull request',
  },
  {
    id: 'merge', level: 'beginner', title: 'Review & merge', summary: 'Bring an approved change into main.',
    goal: 'Identify the checks before merging a pull request.',
    explanation: 'Review the diff, respond to feedback, wait for required checks, then merge using the repository team’s preferred strategy.',
    steps: ['Read the Files changed tab.', 'Resolve review comments and check CI status.', 'Merge the approved PR and update your local main.'],
    example: '# GitHub: review → approve → merge\ngit switch main\ngit pull',
    question: 'What is the best next step when CI fails?', choices: ['Merge anyway', 'Investigate and fix the failure', 'Delete the repository'], answer: 1,
    feedback: 'Fix or understand failing checks before merging.', lab: 'workflow', labLabel: 'Practice review and merge',
  },
  {
    id: 'sync', level: 'intermediate', title: 'Fetch, pull & sync', summary: 'Keep local work in sync with teammates.',
    goal: 'Choose between inspecting fetched changes and integrating them.',
    explanation: 'git fetch updates remote-tracking branches without changing your work. git pull fetches and then integrates, according to your Git configuration.',
    steps: ['Fetch origin.', 'Compare your branch with origin/main.', 'Choose merge, rebase, or fast-forward integration deliberately.'],
    example: 'git fetch origin\ngit log --oneline main..origin/main\ngit pull --ff-only',
    question: 'Which command downloads remote commits without merging them?', choices: ['git fetch', 'git pull', 'git push'], answer: 0,
    feedback: 'git fetch updates remote-tracking refs while leaving your branch and working tree alone.', lab: 'architecture', labLabel: 'Compare local and remote',
  },
  {
    id: 'conflict', level: 'intermediate', title: 'Resolve merge conflicts', summary: 'Combine competing edits safely.',
    goal: 'Resolve a conflict and complete the merge.',
    explanation: 'A conflict appears when Git cannot decide how to combine edits. You must edit the file into the intended final version.',
    steps: ['Run git status to identify conflicted files.', 'Read both sides and remove conflict markers after choosing the final content.', 'Stage the resolution and finish the merge.'],
    example: 'git status\n# edit conflicted files\ngit add src/app.js\ngit commit',
    question: 'After fixing conflict markers, what tells Git the file is resolved?', choices: ['git add file', 'git clone file', 'git log file'], answer: 0,
    feedback: 'Staging the resolved file tells Git its conflict has been handled.', lab: 'conflicts', labLabel: 'Try the conflict visualizer',
  },
  {
    id: 'undo', level: 'intermediate', title: 'Undo safely', summary: 'Recover without losing valuable work.',
    goal: 'Pick a safe undo method for shared history.',
    explanation: 'restore changes files, reset moves a branch pointer, and revert creates a new inverse commit. Prefer revert for commits already shared.',
    steps: ['Check git status and whether the commit was pushed.', 'Preview what will change before using a destructive command.', 'Use git revert for a shared commit.'],
    example: 'git status\ngit log --oneline -5\ngit revert <commit>',
    question: 'Which command safely undoes a pushed commit without rewriting shared history?', choices: ['git reset --hard', 'git revert', 'git clean -fd'], answer: 1,
    feedback: 'git revert adds an inverse commit and preserves the shared history.', lab: 'reset-revert', labLabel: 'Compare reset and revert',
  },
  {
    id: 'fork', level: 'intermediate', title: 'Fork & contribute', summary: 'Contribute without direct write access.',
    goal: 'Explain origin, upstream, and the fork PR flow.',
    explanation: 'A fork is your GitHub copy of another repository. origin usually points to your fork; upstream points to the original project.',
    steps: ['Fork the original repository on GitHub.', 'Clone your fork and add the original as upstream.', 'Push a feature branch to your fork and open a PR to the original.'],
    example: 'git remote add upstream https://github.com/original/project.git\ngit fetch upstream',
    question: 'In a typical fork workflow, what does upstream point to?', choices: ['Your laptop', 'The original repository', 'Your feature branch'], answer: 1,
    feedback: 'upstream names the original project so you can fetch its latest changes.', lab: 'workflow', labLabel: 'Simulate a fork workflow',
  },
  {
    id: 'actions', level: 'intermediate', title: 'GitHub Actions & CI', summary: 'Make tests run on every change.',
    goal: 'Read the basic flow of an automated workflow.',
    explanation: 'A workflow file in .github/workflows describes triggers and jobs. Pull request checks help catch problems before merge.',
    steps: ['Find a workflow YAML file.', 'Identify its push or pull_request trigger.', 'Open a run and inspect the failing step and logs.'],
    example: 'on: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest',
    question: 'Where do GitHub Actions workflow files live?', choices: ['.github/workflows/', 'node_modules/', '.git/objects/'], answer: 0,
    feedback: 'GitHub loads workflow YAML files from .github/workflows/.', lab: 'workflow', labLabel: 'Explore the GitHub workflow',
  },
  {
    id: 'rebase', level: 'advanced', title: 'Rebase with care', summary: 'Replay local commits on a new base.',
    goal: 'Know when rebase rewrites commit IDs.',
    explanation: 'Rebase replays commits onto a different base, creating new commit IDs. Avoid rebasing commits teammates already depend on.',
    steps: ['Fetch the newest main branch.', 'Rebase your own feature branch onto origin/main.', 'Resolve conflicts one by one, then continue or abort safely.'],
    example: 'git fetch origin\ngit rebase origin/main\n# if needed: git rebase --continue or --abort',
    question: 'What happens to rebased commit IDs?', choices: ['They stay identical', 'They are recreated', 'They disappear from GitHub automatically'], answer: 1,
    feedback: 'Replay creates new commits, so shared branches need extra care.', lab: 'rebase', labLabel: 'Watch the rebase animation',
  },
  {
    id: 'history', level: 'advanced', title: 'Recover lost history', summary: 'Find commits after a mistaken reset.',
    goal: 'Use reflog to locate a previous HEAD.',
    explanation: 'Reflog records recent movements of local refs and HEAD. It can reveal a commit that a reset made hard to find.',
    steps: ['Stop making more destructive changes.', 'Inspect git reflog for the old commit ID.', 'Create a recovery branch at that commit before trying another reset.'],
    example: 'git reflog\ngit branch recovery <commit-sha>\ngit log recovery --oneline -3',
    question: 'Which command can reveal a commit lost after moving HEAD?', choices: ['git reflog', 'git clean', 'git remote add'], answer: 0,
    feedback: 'Reflog tracks local HEAD movement and is a useful recovery starting point.', lab: 'reset-revert', labLabel: 'Review recovery choices',
  },
  {
    id: 'diagnose', level: 'advanced', title: 'Find a regression', summary: 'Locate the commit that introduced a bug.',
    goal: 'Explain how bisect narrows down a bad commit.',
    explanation: 'git bisect tests commits between known good and bad points, cutting the search range roughly in half each time.',
    steps: ['Find one known good and one known bad commit.', 'Start bisect and mark those commits.', 'Test each checkout, mark good or bad, then reset when finished.'],
    example: 'git bisect start\ngit bisect bad\ngit bisect good <known-good-sha>\n# test and mark each step\ngit bisect reset',
    question: 'What two points do you need to begin a useful bisect?', choices: ['Two branch names only', 'A known good and a known bad commit', 'Two GitHub accounts'], answer: 1,
    feedback: 'Those bounds let bisect search the history for the first bad commit.', lab: 'playground', labLabel: 'Explore commit history',
  },
  {
    id: 'security', level: 'advanced', title: 'Secure collaboration', summary: 'Protect credentials and shared branches.',
    goal: 'Take the right first action after exposing a secret.',
    explanation: 'A secret committed to a repository must be treated as compromised. Rotate it at its provider and remove it from current files; history cleanup needs coordination.',
    steps: ['Revoke or rotate the exposed credential immediately.', 'Remove it from source and add suitable ignore rules.', 'Coordinate history cleanup and tell collaborators to update clones.'],
    example: '# Rotate the key at its provider first\ngit status\n# remove secret from files and commit the fix',
    question: 'What is the first priority after publishing an API key?', choices: ['Delete a local branch', 'Rotate or revoke the key', 'Rename the repository'], answer: 1,
    feedback: 'Deleting a file alone cannot make an exposed key safe again.', lab: 'troubleshoot', labLabel: 'Open the Problem Solver',
  },
];
