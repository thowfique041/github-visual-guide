import { CommandItem } from '../types/git';

export const COMMANDS_DATA: CommandItem[] = [
  // --- BASIC GIT ---
  {
    id: 'git-init',
    name: 'git init',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git init [directory]',
    shortDesc: 'Initializes a new empty Git repository and creates the .git directory.',
    longDesc: 'Creates an empty Git repository or reinitializes an existing one. It sets up the hidden .git directory containing objects, refs, template files, and initial configuration.',
    example: 'git init',
    commonMistakes: [
      'Running git init inside an existing Git repository (nested repos).',
      'Accidentally running git init in the user home directory (~).'
    ],
    relatedCommands: ['git clone', 'git status', 'git config'],
    beforeState: {
      title: 'Regular Directory',
      description: 'A plain folder with unversioned code files and no history tracking.'
    },
    afterState: {
      title: 'Git Repository (.git initialized)',
      description: 'Contains hidden .git folder, default branch (main/master), and empty staging area.'
    },
    visualSteps: [
      'Checks directory for existing .git structure',
      'Initializes object database and refs directory',
      'Points HEAD to default branch refs/heads/main'
    ],
    tags: ['init', 'setup', 'start', 'create repository']
  },
  {
    id: 'git-clone',
    name: 'git clone',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git clone <repository_url> [directory]',
    shortDesc: 'Downloads an existing repository from a remote source (like GitHub) to your computer.',
    longDesc: 'Clones a repository into a newly created directory, creates remote-tracking branches for each branch in the cloned repository, and creates an initial branch checkout for the currently active branch.',
    example: 'git clone https://github.com/torvalds/linux.git',
    commonMistakes: [
      'Cloning via SSH when SSH keys are not configured.',
      'Cloning inside an existing Git repository.'
    ],
    relatedCommands: ['git init', 'git remote', 'git fetch', 'git pull'],
    beforeState: {
      title: 'Only Remote Exists',
      description: 'Repository lives solely on GitHub with its commit history and branches.'
    },
    afterState: {
      title: 'Full Local Replica',
      description: 'Your machine now has all commit history, branches, working tree files, and remote tracking configured to "origin".'
    },
    tags: ['clone', 'download', 'github', 'copy']
  },
  {
    id: 'git-status',
    name: 'git status',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git status [-s]',
    shortDesc: 'Displays the state of the working directory and the staging area.',
    longDesc: 'Shows which changes have been staged, which haven\'t, and which files aren\'t being tracked by Git. It is your GPS in Git, telling you exactly where HEAD is and what can be committed.',
    example: 'git status',
    commonMistakes: [
      'Assuming git status stages files (it is purely read-only).',
      'Panicking when seeing merge conflict warnings without reading the suggested next steps.'
    ],
    relatedCommands: ['git diff', 'git log', 'git add'],
    beforeState: {
      title: 'Uncertain State',
      description: 'You edited files, but aren’t sure what is staged, modified, or untracked.'
    },
    afterState: {
      title: 'Transparent Overview',
      description: 'Lists untracked files in red, staged files in green, and branch tracking status relative to origin.'
    },
    tags: ['status', 'check', 'state', 'inspect']
  },
  {
    id: 'git-add',
    name: 'git add',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git add <file>...',
    shortDesc: 'Adds file changes in your working directory to your staging area (the index).',
    longDesc: 'Updates the index using the current content found in the working tree, to prepare the content staged for the next commit. Only staged changes will be captured when committing.',
    example: 'git add src/app.js styles.css',
    commonMistakes: [
      'Editing a file after `git add` and thinking the new changes are already staged (you must `git add` again).',
      'Adding unwanted files like .env or large build folders (node_modules).'
    ],
    relatedCommands: ['git add .', 'git commit', 'git restore --staged', 'git status'],
    beforeState: {
      title: 'Modified in Working Directory',
      description: 'Files are modified on disk but not yet prepared for the upcoming snapshot.',
      diagramType: 'three-area'
    },
    afterState: {
      title: 'Promoted to Staging Area',
      description: 'Files are placed into the Index (Staging), ready to be recorded in the next commit.',
      diagramType: 'three-area'
    },
    visualSteps: [
      'Detect modified files in Working Directory',
      'Compute SHA-1 / SHA-256 blob checksums',
      'Add entries into Git index (Staging Area)'
    ],
    tags: ['add', 'stage', 'index', 'prepare'],
    interactiveDemoType: 'add'
  },
  {
    id: 'git-add-all',
    name: 'git add .',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git add .',
    shortDesc: 'Stages all modified, new, and deleted files in the current directory and subdirectories.',
    longDesc: 'Stages changes under the current directory, including new, modified, and deleted paths. Great for quick staging, but dangerous if secrets or generated files are not excluded by .gitignore.',
    example: 'git add .',
    commonMistakes: [
      'Accidentally committing secrets, credentials, or node_modules because no .gitignore was defined.',
      'Assuming it stages files located in directories above the current folder.'
    ],
    relatedCommands: ['git add -A', 'git add', 'git status', 'git reset'],
    beforeState: {
      title: 'Multiple Changed Files',
      description: 'Various untracked, modified, and deleted files throughout your project folders.'
    },
    afterState: {
      title: 'Entire Workspace Staged',
      description: 'All valid modifications are queued in staging, ready for atomic commit.'
    },
    tags: ['add', 'stage all', 'bulk']
  },
  {
    id: 'git-commit',
    name: 'git commit',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git commit -m "<message>"',
    shortDesc: 'Records snapshots of the staging area permanently to the repository history.',
    longDesc: 'Stores the current contents of the index in a new commit along with a log message from the user describing the changes. Creates a cryptographically verified snapshot node pointing to its parent.',
    example: 'git commit -m "feat: implement user authentication flow"',
    commonMistakes: [
      'Writing vague commit messages like "fix", "asdf", or "updates".',
      'Committing before staging files (`git add`) and finding nothing was committed.'
    ],
    relatedCommands: ['git commit --amend', 'git add', 'git log', 'git push'],
    beforeState: {
      title: 'Staged Changes Waiting',
      description: 'Staging area contains prepared files, HEAD points to current latest commit.',
      diagramType: 'three-area'
    },
    afterState: {
      title: 'New Commit Node Created',
      description: 'A new commit node is linked to the previous commit; branch pointer moves forward.',
      diagramType: 'three-area'
    },
    visualSteps: [
      'Create tree object from staging area',
      'Generate commit object with author, timestamp, parent SHA',
      'Advance current branch reference to new commit SHA'
    ],
    tags: ['commit', 'save', 'snapshot', 'record', 'history'],
    interactiveDemoType: 'commit'
  },
  {
    id: 'git-log',
    name: 'git log',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git log [--oneline] [--graph] [-n <count>]',
    shortDesc: 'Shows the commit logs and chronological history of the repository.',
    longDesc: 'Traverses commit parents starting from HEAD and prints their hashes, authors, dates, and commit messages. Indispensable for tracking who changed what and when.',
    example: 'git log --oneline --graph --all',
    commonMistakes: [
      'Getting stuck inside the terminal pager (press `q` to exit!).',
      'Thinking commits are lost when viewing a branch that branched before those commits existed.'
    ],
    relatedCommands: ['git show', 'git reflog', 'git blame', 'git diff'],
    beforeState: {
      title: 'Hidden Timeline',
      description: 'Commit chain exists in .git database but is not visible on terminal.'
    },
    afterState: {
      title: 'Visual History List',
      description: 'Chronological timeline of commits, hashes, authors, and branch decorations.'
    },
    tags: ['log', 'history', 'commits', 'view']
  },
  {
    id: 'git-diff',
    name: 'git diff',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git diff [options] [<commit>] [--] [<path>...]',
    shortDesc: 'Shows changes between the working tree and the index, or between commits.',
    longDesc: 'Inspects changes line-by-line. Running plain `git diff` shows unstaged working tree changes. `git diff --staged` shows what will go into the next commit.',
    example: 'git diff --staged',
    commonMistakes: [
      'Running git diff after git add and thinking changes disappeared (use `git diff --staged` or `--cached`).'
    ],
    relatedCommands: ['git status', 'git show', 'git log -p'],
    beforeState: {
      title: 'Unseen Line Modifications',
      description: 'You modified code lines, but need to see exact line additions and subtractions.'
    },
    afterState: {
      title: 'Unified Diff Output',
      description: 'Red lines indicate deletions (-), green lines indicate additions (+).'
    },
    tags: ['diff', 'compare', 'inspect changes', 'patch']
  },
  {
    id: 'git-show',
    name: 'git show',
    category: 'basic',
    difficulty: 'beginner',
    syntax: 'git show <object>',
    shortDesc: 'Shows one or more objects (blobs, trees, tags and commits) with detailed metadata and diff.',
    longDesc: 'Inspects a specific commit, tag, or file at a given commit. By default with no arguments, shows the commit at HEAD and its unified diff.',
    example: 'git show a1b2c3d',
    commonMistakes: [
      'Confusing git show with git log (show displays details of one object, log displays the sequence).'
    ],
    relatedCommands: ['git log', 'git diff', 'git blame'],
    beforeState: {
      title: 'Commit SHA Known',
      description: 'You have a commit hash from git log or GitHub.'
    },
    afterState: {
      title: 'Complete Snapshot Inspection',
      description: 'Full metadata, author, date, message, and line-by-line diff of that exact commit.'
    },
    tags: ['show', 'inspect', 'commit details']
  },

  // --- BRANCHING ---
  {
    id: 'git-branch',
    name: 'git branch',
    category: 'branching',
    difficulty: 'beginner',
    syntax: 'git branch [-a] [-r]',
    shortDesc: 'Lists, creates, or deletes branches in your local repository.',
    longDesc: 'With no arguments, it lists existing local branches and highlights the currently active branch with an asterisk (*). It also provides flags to create, rename (-m), or delete (-d) branches.',
    example: 'git branch -a',
    commonMistakes: [
      'Thinking `git branch new-feature` switches to the new branch (it only creates it; use switch or checkout to move).'
    ],
    relatedCommands: ['git switch', 'git checkout', 'git merge'],
    beforeState: {
      title: 'List of Branches',
      description: 'Multiple branch pointers exist on various commits.'
    },
    afterState: {
      title: 'Active Branch Highlighted',
      description: 'Displays all local and remote branches; active branch marked with * and green color.'
    },
    tags: ['branch', 'list', 'pointers'],
    interactiveDemoType: 'branch'
  },
  {
    id: 'git-branch-create',
    name: 'git branch <name>',
    category: 'branching',
    difficulty: 'beginner',
    syntax: 'git branch <branch-name>',
    shortDesc: 'Creates a new branch pointing to the current HEAD commit without switching to it.',
    longDesc: 'In Git, a branch is simply a lightweight movable pointer to a commit. Creating a branch is instant because it only creates a 41-byte text file with the commit SHA.',
    example: 'git branch feature/auth',
    commonMistakes: [
      'Assuming your current branch changed (HEAD stays where it was).'
    ],
    relatedCommands: ['git switch -c', 'git checkout -b', 'git branch -d'],
    beforeState: {
      title: 'Single Branch Pointer',
      description: 'main points to commit C3. HEAD points to main.',
      diagramType: 'branch'
    },
    afterState: {
      title: 'Two Pointers on Same Commit',
      description: 'Both main and new branch "feature" point to C3. HEAD remains on main.',
      diagramType: 'branch'
    },
    tags: ['branch', 'create', 'new branch']
  },
  {
    id: 'git-switch',
    name: 'git switch',
    category: 'branching',
    difficulty: 'beginner',
    syntax: 'git switch <branch-name>',
    shortDesc: 'Switches to an existing branch and updates the working directory.',
    longDesc: 'Introduced in Git 2.23 to separate branch switching from file restoring (both of which git checkout did historically). It updates HEAD to point to the named branch and restores working directory files.',
    example: 'git switch feature/payments',
    commonMistakes: [
      'Switching branches with uncommitted conflicting changes (Git will prevent overwrite unless stashed or committed).'
    ],
    relatedCommands: ['git switch -c', 'git checkout', 'git branch'],
    beforeState: {
      title: 'HEAD on Branch A',
      description: 'HEAD -> refs/heads/main',
      diagramType: 'branch'
    },
    afterState: {
      title: 'HEAD on Branch B',
      description: 'HEAD -> refs/heads/feature/payments. Files in workspace match that branch.',
      diagramType: 'branch'
    },
    tags: ['switch', 'checkout', 'navigate branch']
  },
  {
    id: 'git-switch-c',
    name: 'git switch -c',
    category: 'branching',
    difficulty: 'beginner',
    syntax: 'git switch -c <new-branch-name>',
    shortDesc: 'Creates a new branch and immediately switches to it in a single step.',
    longDesc: 'Equivalent to `git checkout -b <name>`. Creates a new branch reference pointing to HEAD and shifts the HEAD pointer to point to the new branch.',
    example: 'git switch -c feature/dark-mode',
    commonMistakes: [
      'Trying to create a branch name that already exists (use `git switch <name>` instead).'
    ],
    relatedCommands: ['git checkout -b', 'git switch', 'git branch'],
    beforeState: {
      title: 'On main branch',
      description: 'HEAD -> main',
      diagramType: 'branch'
    },
    afterState: {
      title: 'New Branch Created & Checked Out',
      description: 'New branch created, HEAD -> feature/dark-mode',
      diagramType: 'branch'
    },
    tags: ['switch -c', 'checkout -b', 'create and switch']
  },
  {
    id: 'git-checkout',
    name: 'git checkout',
    category: 'branching',
    difficulty: 'intermediate',
    syntax: 'git checkout <branch|commit|file>',
    shortDesc: 'Multi-purpose command to switch branches or restore working tree files.',
    longDesc: 'Historical command that could switch branches, checkout specific commits (entering "detached HEAD" state), or revert files. Modern Git prefers `git switch` for branches and `git restore` for files.',
    example: 'git checkout main',
    commonMistakes: [
      'Checking out a commit hash instead of a branch and making commits in "detached HEAD" state that can be lost.'
    ],
    relatedCommands: ['git switch', 'git restore', 'git branch'],
    beforeState: {
      title: 'On current branch',
      description: 'Working directory reflects current branch.'
    },
    afterState: {
      title: 'Target Branch or Commit Loaded',
      description: 'Working directory files updated to match target.'
    },
    tags: ['checkout', 'legacy', 'switch', 'detached head']
  },
  {
    id: 'git-merge',
    name: 'git merge',
    category: 'branching',
    difficulty: 'intermediate',
    syntax: 'git merge <branch-to-incorporate>',
    shortDesc: 'Joins two or more development histories together into the current branch.',
    longDesc: 'Incorporates changes from the named branch into the current branch. If there are no divergent commits, it performs a fast-forward. If divergent, it creates a new 3-way merge commit with two parents.',
    example: 'git merge feature/login',
    commonMistakes: [
      'Merging while on the feature branch instead of switching to the target branch (e.g. main) first.',
      'Panicking when merge conflicts arise.'
    ],
    relatedCommands: ['git rebase', 'git branch -d', 'git status'],
    beforeState: {
      title: 'Divergent Branches',
      description: 'main has new commits, feature has separate new commits.',
      diagramType: 'branch'
    },
    afterState: {
      title: 'Merge Commit Created',
      description: 'A new commit M is created with two parent commits, joining both histories cleanly.',
      diagramType: 'branch'
    },
    tags: ['merge', 'fast-forward', 'combine', 'branches'],
    interactiveDemoType: 'merge'
  },
  {
    id: 'git-rebase',
    name: 'git rebase',
    category: 'branching',
    difficulty: 'advanced',
    syntax: 'git rebase <base-branch>',
    shortDesc: 'Reapplies commits on top of another base tip, creating a linear history.',
    longDesc: 'Pulls the commits unique to your branch, saves them as temporary patches, rewinds your branch to the base branch, and reapplies each commit on top one by one. Produces clean linear history without merge bubbles.',
    example: 'git rebase main',
    commonMistakes: [
      'Golden Rule Violation: Rebasing branches that have already been pushed and shared with other team members.',
      'Confusing rebase with merge.'
    ],
    relatedCommands: ['git merge', 'git cherry-pick', 'git rebase -i'],
    beforeState: {
      title: 'Branched off older commit',
      description: 'Feature branched from C1, while main advanced to C2 and C3.',
      diagramType: 'rebase'
    },
    afterState: {
      title: 'Replayed on latest main',
      description: 'Feature commits are recreated (D -> D\', E -> E\') on top of C3. Perfectly linear history.',
      diagramType: 'rebase'
    },
    tags: ['rebase', 'linear history', 'rewrite', 'clean commits'],
    interactiveDemoType: 'rebase'
  },
  {
    id: 'git-branch-d',
    name: 'git branch -d / -D',
    category: 'branching',
    difficulty: 'intermediate',
    syntax: 'git branch -d <branch-name>   # safe delete\ngit branch -D <branch-name>   # force delete',
    shortDesc: 'Deletes a local branch reference.',
    longDesc: '`-d` (safe) deletes the branch only if it has already been fully merged in its upstream branch. `-D` (force) deletes the branch regardless of its merge status.',
    example: 'git branch -d feature/completed-task',
    commonMistakes: [
      'Trying to delete the branch you are currently standing on (switch to another branch first).',
      'Using -D accidentally and losing unmerged work (can be recovered via reflog).'
    ],
    relatedCommands: ['git branch', 'git reflog', 'git push origin --delete'],
    beforeState: {
      title: 'Branch pointer exists',
      description: 'refs/heads/feature exists pointing to merged commit.'
    },
    afterState: {
      title: 'Pointer removed',
      description: 'Pointer deleted. Commits remain safely reachable via main.'
    },
    tags: ['delete branch', 'clean up', 'force delete']
  },

  // --- REMOTE / GITHUB ---
  {
    id: 'git-remote',
    name: 'git remote / -v',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'git remote -v',
    shortDesc: 'Manages the set of tracked remote repositories (e.g., origin).',
    longDesc: 'Displays the names and URLs of all configured remote connections. The `-v` flag stands for verbose, printing both fetch and push URLs.',
    example: 'git remote -v',
    commonMistakes: [
      'Misspelling the repository URL or using incorrect protocol (https vs git ssh).'
    ],
    relatedCommands: ['git remote add', 'git fetch', 'git push'],
    beforeState: {
      title: 'Unknown Remotes',
      description: 'Not sure if your local repo is connected to GitHub.'
    },
    afterState: {
      title: 'List of Remote Connections',
      description: 'origin https://github.com/user/repo.git (fetch & push)'
    },
    tags: ['remote', 'origin', 'urls', 'connections']
  },
  {
    id: 'git-remote-add',
    name: 'git remote add origin',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'git remote add <name> <url>',
    shortDesc: 'Adds a new remote repository alias (conventionally named origin).',
    longDesc: 'Links your local repository to a remote repository hosted on GitHub, GitLab, or Bitbucket, giving it an alias name like "origin".',
    example: 'git remote add origin https://github.com/acme/project.git',
    commonMistakes: [
      'Running git remote add origin when "origin" already exists (use `git remote set-url origin <url>` to change).'
    ],
    relatedCommands: ['git remote set-url', 'git push -u origin main'],
    beforeState: {
      title: 'Local-only repo',
      description: 'No connection to any cloud Git host.'
    },
    afterState: {
      title: 'Remote link established',
      description: '"origin" registered to GitHub repository URL.'
    },
    tags: ['remote add', 'link github', 'setup remote']
  },
  {
    id: 'git-push',
    name: 'git push',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'git push [<remote>] [<branch>]',
    shortDesc: 'Uploads local repository commits to the remote repository (GitHub).',
    longDesc: 'Transfers commit objects and refs from your local computer to the remote server. Updates the remote-tracking branches (e.g. origin/main) to match.',
    example: 'git push origin main',
    commonMistakes: [
      'Pushing when remote contains new changes (rejected: pull first!).',
      'Pushing to the wrong branch.'
    ],
    relatedCommands: ['git push -u origin <branch>', 'git pull', 'git fetch'],
    beforeState: {
      title: 'Local commits ahead',
      description: 'Local has commits A, B, C. GitHub only has A and B.',
      diagramType: 'remote'
    },
    afterState: {
      title: 'GitHub synchronized',
      description: 'Commit C uploaded to GitHub. origin/main advanced to match local main.',
      diagramType: 'remote'
    },
    visualSteps: [
      'Compress and send local commit packfiles',
      'Update remote branch ref on GitHub',
      'Update local remote-tracking ref origin/main'
    ],
    tags: ['push', 'upload', 'sync', 'github'],
    interactiveDemoType: 'push'
  },
  {
    id: 'git-push-u',
    name: 'git push -u origin <branch>',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'git push -u origin <branch-name>',
    shortDesc: 'Pushes the branch and sets up tracking upstream so future pushes only need "git push".',
    longDesc: 'The `-u` (or `--set-upstream`) links your current local branch to the remote branch on origin. Once set, you can simply type `git push` or `git pull` without specifying arguments.',
    example: 'git push -u origin feature/user-profile',
    commonMistakes: [
      'Forgetting -u on the very first push of a brand new branch, requiring arguments every subsequent time.'
    ],
    relatedCommands: ['git push', 'git branch -vv', 'git pull'],
    beforeState: {
      title: 'New local branch without upstream',
      description: 'Local branch does not know which remote branch it corresponds to.'
    },
    afterState: {
      title: 'Upstream Tracking Configured',
      description: 'feature/user-profile -> origin/feature/user-profile paired.'
    },
    tags: ['push -u', 'upstream', 'tracking', 'first push']
  },
  {
    id: 'git-fetch',
    name: 'git fetch',
    category: 'remote',
    difficulty: 'intermediate',
    syntax: 'git fetch [<remote>]',
    shortDesc: 'Downloads commits, files, and refs from remote repository without merging into your working files.',
    longDesc: 'Safely fetches objects from remote and updates remote-tracking branches (like origin/main). It NEVER touches your local working tree or local branch pointers. Perfect to see what colleagues did without risking conflicts.',
    example: 'git fetch origin',
    commonMistakes: [
      'Thinking git fetch updates your current local working code (it only updates origin/* tracking branches; use git merge or git pull to combine).'
    ],
    relatedCommands: ['git pull', 'git status', 'git log origin/main'],
    beforeState: {
      title: 'Local unware of remote commits',
      description: 'Colleague pushed commit C to GitHub. Your origin/main still points to B.',
      diagramType: 'remote'
    },
    afterState: {
      title: 'origin/main updated locally',
      description: 'Commit C downloaded, origin/main points to C. Your local main stays on B safely.',
      diagramType: 'remote'
    },
    visualSteps: [
      'Contact remote server',
      'Download missing commit objects',
      'Advance origin/<branch> pointers locally'
    ],
    tags: ['fetch', 'download safely', 'remote tracking'],
    interactiveDemoType: 'fetch'
  },
  {
    id: 'git-pull',
    name: 'git pull',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'git pull [<remote>] [<branch>]',
    shortDesc: 'Fetches from a remote, then integrates according to your merge, rebase, or fast-forward configuration.',
    longDesc: 'Essentially a combination of two commands: `git fetch` followed immediately by `git merge FETCH_HEAD`. Brings your current branch up to date with its remote counterpart.',
    example: 'git pull origin main',
    commonMistakes: [
      'Pulling when you have uncommitted dirty files in your working directory, causing unexpected merge aborts.',
      'Pulling without knowing what was pushed, resulting in unexpected merge conflicts.'
    ],
    relatedCommands: ['git fetch', 'git merge', 'git pull --rebase'],
    beforeState: {
      title: 'Local is behind GitHub',
      description: 'GitHub has commits that your local workspace lacks.',
      diagramType: 'remote'
    },
    afterState: {
      title: 'Fully Synced & Merged',
      description: 'Commits downloaded and merged into local working tree.',
      diagramType: 'remote'
    },
    visualSteps: [
      'Execute git fetch under the hood',
      'Execute git merge origin/<branch> into current branch',
      'Update working directory files'
    ],
    tags: ['pull', 'update', 'fetch + merge', 'sync'],
    interactiveDemoType: 'pull'
  },
  {
    id: 'git-fork-concept',
    name: 'git fork (GitHub)',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'GitHub UI: Click "Fork" button on repo page',
    shortDesc: 'Creates a personal copy of someone else\'s GitHub repository on your GitHub account.',
    longDesc: 'Not a core Git CLI command, but a central GitHub concept. A fork lets you freely experiment with changes without affecting the original upstream project, and later submit Pull Requests back.',
    example: 'Fork https://github.com/facebook/react -> github.com/your-username/react',
    commonMistakes: [
      'Forgetting to configure upstream remote (`git remote add upstream <original-url>`) to sync future changes from original repo.'
    ],
    relatedCommands: ['git clone', 'git remote add upstream', 'Pull Request'],
    beforeState: {
      title: 'Original Upstream Repo Only',
      description: 'You do not have direct write permissions to original repository.'
    },
    afterState: {
      title: 'Server-side Copy in Your Account',
      description: 'You have full push access to your personal fork, linked back to parent.'
    },
    tags: ['fork', 'github', 'open source', 'contribute']
  },
  {
    id: 'github-pull-request',
    name: 'Pull Request (PR)',
    category: 'remote',
    difficulty: 'beginner',
    syntax: 'GitHub UI or `gh pr create`',
    shortDesc: 'Proposes your branch changes to be reviewed and merged into the main repository.',
    longDesc: 'A GitHub collaboration mechanism where you notify maintainers about changes pushed to a branch or fork. Enables inline code reviews, automated CI tests, discussion, and eventual merge.',
    example: 'gh pr create --title "Add user avatar upload" --body "Fixes #123"',
    commonMistakes: [
      'Creating a PR with dozens of unrelated changes instead of small, focused atomic PRs.',
      'Merging PR without waiting for CI checks to pass.'
    ],
    relatedCommands: ['git push', 'git merge', 'code review'],
    beforeState: {
      title: 'Feature pushed to GitHub',
      description: 'Branch exists on GitHub but is isolated from production/main.'
    },
    afterState: {
      title: 'PR Open for Discussion',
      description: 'Teammates review code, leave comments, run CI checks, and approve merge.'
    },
    tags: ['pull request', 'pr', 'code review', 'github']
  },

  // --- UNDO / RECOVERY ---
  {
    id: 'git-restore',
    name: 'git restore',
    category: 'undo',
    difficulty: 'beginner',
    syntax: 'git restore <file>             # discard working changes\ngit restore --staged <file>    # unstage from index',
    shortDesc: 'Restores working tree files or unstages changes from the staging area.',
    longDesc: 'Modern Git command (2.23+) created to replace ambiguous uses of git checkout. To unstage a file, use `--staged`. To discard changes in your working tree back to last commit, run `git restore <file>`.',
    example: 'git restore --staged index.html',
    commonMistakes: [
      'Running `git restore <file>` on unsaved/uncommitted work: this destroys your uncommitted changes permanently!'
    ],
    relatedCommands: ['git reset', 'git clean', 'git checkout'],
    beforeState: {
      title: 'Accidental edit or staging',
      description: 'File modified or mistakenly staged in index.'
    },
    afterState: {
      title: 'Restored cleanly',
      description: 'File unstaged (if --staged) or restored to match HEAD commit.'
    },
    tags: ['restore', 'discard changes', 'unstage', 'undo']
  },
  {
    id: 'git-reset',
    name: 'git reset',
    category: 'undo',
    difficulty: 'intermediate',
    syntax: 'git reset [--soft | --mixed | --hard] <commit>',
    shortDesc: 'Resets current HEAD to the specified state, moving branch pointer backwards.',
    longDesc: 'Rewinds your current branch to an earlier commit. Depending on the flag, it keeps or deletes your staged and working files: --soft (keeps files staged), --mixed (default, keeps files in working tree unstaged), --hard (wipes everything!).',
    example: 'git reset --soft HEAD~1',
    commonMistakes: [
      'Using `git reset --hard` without realizing it permanently destroys uncommitted working tree edits.'
    ],
    relatedCommands: ['git revert', 'git restore', 'git reflog'],
    beforeState: {
      title: 'HEAD at Commit C',
      description: 'Branch has commits A - B - C. You wish C had not been committed.',
      diagramType: 'branch'
    },
    afterState: {
      title: 'HEAD moved back to B',
      description: 'Branch points to B. If --soft, C\'s changes are now in Staging. If --hard, C\'s changes are deleted.',
      diagramType: 'branch'
    },
    tags: ['reset', 'rewind', 'undo commit', 'soft mixed hard'],
    interactiveDemoType: 'reset'
  },
  {
    id: 'git-revert',
    name: 'git revert',
    category: 'undo',
    difficulty: 'intermediate',
    syntax: 'git revert <commit-hash>',
    shortDesc: 'Creates a new commit that records the exact inverse of a previous commit.',
    longDesc: 'Unlike git reset (which rewrites history by moving the branch pointer backward), git revert preserves history by creating a forward-moving commit that undoes the unwanted changes. Safe for shared public branches!',
    example: 'git revert d4e5f6g',
    commonMistakes: [
      'Using git reset on public shared branches instead of git revert (causes push rejection and teammate headaches).'
    ],
    relatedCommands: ['git reset', 'git log', 'git commit'],
    beforeState: {
      title: 'Buggy commit exists in history',
      description: 'Commit C introduced a bug and is already pushed to GitHub.',
      diagramType: 'branch'
    },
    afterState: {
      title: 'New Inverse Commit D created',
      description: 'Commit D (Revert "C") undoes C\'s changes while keeping history intact and append-only.',
      diagramType: 'branch'
    },
    tags: ['revert', 'safe undo', 'public branch', 'inverse commit'],
    interactiveDemoType: 'revert'
  },
  {
    id: 'git-reflog',
    name: 'git reflog',
    category: 'undo',
    difficulty: 'advanced',
    syntax: 'git reflog',
    shortDesc: 'Reference logs: your ultimate safety net recording every time HEAD moved.',
    longDesc: 'Records an audit trail of every branch switch, commit, reset, rebase, and checkout. Even if you run `git reset --hard` or delete a branch, the commits exist in reflog for at least 30-90 days until garbage collection.',
    example: 'git reflog',
    commonMistakes: [
      'Assuming deleted commits or branches are gone forever without checking reflog first.'
    ],
    relatedCommands: ['git reset', 'git log -g', 'git cherry-pick'],
    beforeState: {
      title: 'Accidental loss',
      description: 'You ran `git reset --hard HEAD~2` and lost your recent commits.'
    },
    afterState: {
      title: 'Reflog reveals lost SHA',
      description: 'Shows `HEAD@{1}: commit: my lost work`. You can rescue it with `git reset --hard HEAD@{1}`!'
    },
    tags: ['reflog', 'rescue', 'safety net', 'recover deleted commit']
  },
  {
    id: 'git-stash',
    name: 'git stash',
    category: 'undo',
    difficulty: 'beginner',
    syntax: 'git stash [push -m "<message>"]\ngit stash pop\ngit stash apply\ngit stash list',
    shortDesc: 'Temporarily shelves (stashes) uncommitted changes so you have a clean working directory.',
    longDesc: 'Takes your modified tracked files and staged changes, saves them on a stack of unfinished changes, and reverts your working directory back to match the HEAD commit. Perfect for urgent branch switching.',
    example: 'git stash -m "WIP: login modal design"',
    commonMistakes: [
      'Forgetting that untracked files are not stashed by default (use `git stash -u` to include untracked).'
    ],
    relatedCommands: ['git stash pop', 'git stash apply', 'git stash drop'],
    beforeState: {
      title: 'Dirty Working Directory',
      description: 'Half-finished changes prevent switching branches cleanly.',
      diagramType: 'stash'
    },
    afterState: {
      title: 'Saved to Stash Stack + Clean Tree',
      description: 'Changes safely packed into stash@{0}; working tree is pristine.',
      diagramType: 'stash'
    },
    tags: ['stash', 'shelve', 'save work', 'clean working directory'],
    interactiveDemoType: 'stash'
  },
  {
    id: 'git-clean',
    name: 'git clean',
    category: 'undo',
    difficulty: 'intermediate',
    syntax: 'git clean -fd',
    shortDesc: 'Removes untracked files and directories from the working tree.',
    longDesc: 'Cleans up build artifacts, generated files, or leftover scratch files that are not tracked by Git. By default it requires `-f` (force) as a safety mechanism, and `-d` to include directories.',
    example: 'git clean -nd   # dry-run first to preview!\ngit clean -fd   # actual deletion',
    commonMistakes: [
      'Running `git clean -fd` without doing a dry run (`-n`) first and permanently deleting important local files.'
    ],
    relatedCommands: ['git status', 'git restore', 'git reset --hard'],
    beforeState: {
      title: 'Untracked clutter',
      description: 'Working directory contains test output, temporary txt files, and extra folders.'
    },
    afterState: {
      title: 'Pristine Repository',
      description: 'All untracked non-git files removed cleanly.'
    },
    tags: ['clean', 'remove untracked', 'purge']
  },

  // --- COLLABORATION ---
  {
    id: 'merge-conflicts',
    name: 'Merge Conflicts',
    category: 'collaboration',
    difficulty: 'intermediate',
    syntax: 'git merge <branch> -> resolve markers -> git add -> git commit',
    shortDesc: 'Occurs when two branches modify the same lines of a file and Git cannot auto-merge.',
    longDesc: 'Git inserts conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) showing both versions. Developers must decide whether to keep current changes, incoming changes, or combine both.',
    example: 'Resolve <<<<<<< HEAD vs >>>>>>> feature in editor',
    commonMistakes: [
      'Leaving git conflict marker symbols inside the source code and committing broken code.'
    ],
    relatedCommands: ['git merge --abort', 'git status', 'git add'],
    beforeState: {
      title: 'Conflicting Line Changes',
      description: 'Branch A changed line 5 to "blue"; Branch B changed line 5 to "red".',
      diagramType: 'conflict'
    },
    afterState: {
      title: 'Resolved & Merged',
      description: 'Manual resolution selected (e.g. "purple" or "blue"), conflict markers removed, merge commit finalized.',
      diagramType: 'conflict'
    },
    tags: ['conflict', 'markers', 'resolve', 'head vs incoming'],
    interactiveDemoType: 'conflict'
  },
  {
    id: 'code-review-concept',
    name: 'Code Review',
    category: 'collaboration',
    difficulty: 'beginner',
    syntax: 'GitHub UI: Files Changed -> Review Changes',
    shortDesc: 'Peers examine code changes before merging to catch bugs, improve quality, and share knowledge.',
    longDesc: 'Reviewers can leave line comments, suggest code snippets, request changes, or approve the Pull Request. Crucial quality barrier before code enters the main production branch.',
    example: 'Approve or Request Changes on PR',
    commonMistakes: [
      'Approving PRs without reading the diff or testing locally.'
    ],
    relatedCommands: ['Pull Request', 'git diff', 'git blame'],
    beforeState: {
      title: 'PR awaiting feedback',
      description: 'Author submitted work; awaiting peer eyes.'
    },
    afterState: {
      title: 'Approved / Changes Requested',
      description: 'Clear actionable feedback provided directly on lines of code.'
    },
    tags: ['review', 'quality', 'github', 'collaboration']
  },
  {
    id: 'branch-workflow-concept',
    name: 'Branching Workflows',
    category: 'collaboration',
    difficulty: 'intermediate',
    syntax: 'main -> feature -> PR -> review -> merge -> main',
    shortDesc: 'Team development strategies like GitHub Flow, Gitflow, and Trunk-Based Development.',
    longDesc: 'GitHub Flow is the modern standard: `main` is always deployable, developers create descriptive feature branches, open Pull Requests early, collaborate, and merge back into `main`.',
    example: 'git switch -c feature/search -> push -> PR -> merge',
    commonMistakes: [
      'Keeping feature branches alive for months without syncing main, resulting in merge conflict nightmares.'
    ],
    relatedCommands: ['git switch', 'git merge', 'git push', 'Pull Request'],
    beforeState: {
      title: 'Chaotic commits to main',
      description: 'Multiple developers pushing directly to production main branch.'
    },
    afterState: {
      title: 'Disciplined Branch Isolation',
      description: 'Every feature developed in isolated branch, validated by CI and reviews before touching main.'
    },
    tags: ['workflow', 'github flow', 'gitflow', 'trunk based']
  },

  // --- ADVANCED ---
  {
    id: 'git-cherry-pick',
    name: 'git cherry-pick',
    category: 'advanced',
    difficulty: 'advanced',
    syntax: 'git cherry-pick <commit-hash>',
    shortDesc: 'Copies an existing commit from any branch and applies it onto your current branch.',
    longDesc: 'Selectively applies the exact changes introduced by a single commit somewhere else in history onto your current HEAD. Generates a new commit with a new hash but identical diff.',
    example: 'git cherry-pick e4f82a1',
    commonMistakes: [
      'Using cherry-pick when a full merge or rebase is more appropriate, causing duplicate commits in history.'
    ],
    relatedCommands: ['git merge', 'git rebase', 'git log'],
    beforeState: {
      title: 'Target commit on another branch',
      description: 'Hotfix commit C exists on branch "hotfix", but you are on "main".',
      diagramType: 'branch'
    },
    afterState: {
      title: 'Commit replicated on main',
      description: 'New commit C\' applied directly onto main with the same content.',
      diagramType: 'branch'
    },
    tags: ['cherry-pick', 'copy commit', 'selective apply', 'hotfix'],
    interactiveDemoType: 'cherry-pick'
  },
  {
    id: 'git-tag',
    name: 'git tag',
    category: 'advanced',
    difficulty: 'intermediate',
    syntax: 'git tag [-a] <tagname> [-m "<msg>"]',
    shortDesc: 'Creates permanent milestone tags (like v1.0.0) referencing specific release points.',
    longDesc: 'Tags are permanent bookmarks pointing to specific commits. Unlike branches, tags never move when new commits are created. Annotated tags (`-a`) store tagger info, date, and message.',
    example: 'git tag -a v1.0.0 -m "First production release"',
    commonMistakes: [
      'Assuming `git push` pushes tags automatically (you must explicitly run `git push origin --tags`).'
    ],
    relatedCommands: ['git push origin --tags', 'git checkout <tagname>'],
    beforeState: {
      title: 'Commit without label',
      description: 'Commit SHA exists in timeline.'
    },
    afterState: {
      title: 'Release Version Tagged',
      description: 'Tag "v1.0.0" permanently anchored to commit snapshot.'
    },
    tags: ['tag', 'release', 'semver', 'milestone', 'version']
  },
  {
    id: 'git-bisect',
    name: 'git bisect',
    category: 'advanced',
    difficulty: 'advanced',
    syntax: 'git bisect start\ngit bisect bad\ngit bisect good <commit>',
    shortDesc: 'Uses binary search across commit history to rapidly find which commit introduced a bug.',
    longDesc: 'Git bisect automatically checks out commits halfway between known good and bad versions. You tell it if the bug is present or not (`good` or `bad`), halving the search space each step until pinpointing the culprit.',
    example: 'git bisect start\ngit bisect bad HEAD\ngit bisect good v1.0.0',
    commonMistakes: [
      'Forgetting to run `git bisect reset` when finished to return HEAD to original branch.'
    ],
    relatedCommands: ['git blame', 'git log', 'git show'],
    beforeState: {
      title: 'Bug introduced across 500 commits',
      description: 'App worked in v1.0.0, but broken now at HEAD.'
    },
    afterState: {
      title: 'Exact culprit identified',
      description: 'In ~9 tests (log2 500), bisect reveals commit a9f2b: "update css parser".'
    },
    tags: ['bisect', 'binary search', 'find bug', 'debugging']
  },
  {
    id: 'git-blame',
    name: 'git blame',
    category: 'advanced',
    difficulty: 'intermediate',
    syntax: 'git blame [-L <start>,<end>] <file>',
    shortDesc: 'Annotates each line in a file with the commit hash, author, and timestamp of who last edited it.',
    longDesc: 'Displays file content with author names and commit hashes side-by-side on each line. Invaluable for understanding why code was written and finding the original PR or context.',
    example: 'git blame -L 10,25 src/auth.ts',
    commonMistakes: [
      'Using blame only to find someone to blame, rather than finding context for why a design decision was made.'
    ],
    relatedCommands: ['git show', 'git log -p'],
    beforeState: {
      title: 'Mystery line of code',
      description: 'You see an obscure regex or workaround and wonder why it exists.'
    },
    afterState: {
      title: 'Full line ancestry',
      description: 'Shows author Sarah, commit 8b3c1 "Fix Safari iOS cookie leak" 6 months ago.'
    },
    tags: ['blame', 'line author', 'history', 'inspect author']
  },
  {
    id: 'git-config',
    name: 'git config',
    category: 'advanced',
    difficulty: 'beginner',
    syntax: 'git config [--global] <key> <value>',
    shortDesc: 'Gets and sets repository or global options (user name, email, aliases, default branch).',
    longDesc: 'Controls configuration settings across system, global (~/.gitconfig), or local repository (.git/config) scopes. Essential for establishing your commit identity and custom shortcuts.',
    example: 'git config --global user.name "Alex Morgan"\ngit config --global user.email "alex@example.com"',
    commonMistakes: [
      'Forgetting to configure user.email, resulting in commits with machine local hostname.'
    ],
    relatedCommands: ['git init', 'git commit'],
    beforeState: {
      title: 'Unconfigured Git',
      description: 'Git does not know who you are or your preferences.'
    },
    afterState: {
      title: 'Configured Profile',
      description: 'Commits authored with your proper name and verified GitHub email.'
    },
    tags: ['config', 'settings', 'username', 'email', 'aliases']
  }
];

export const CATEGORIES_META: Record<string, { label: string; count: number; desc: string; icon: string }> = {
  all: { label: 'All Commands', count: COMMANDS_DATA.length, desc: 'Every Git & GitHub command in the guide', icon: 'Terminal' },
  basic: { label: 'Basic Git', count: COMMANDS_DATA.filter(c => c.category === 'basic').length, desc: 'Init, add, commit, status, log & diff', icon: 'BookOpen' },
  branching: { label: 'Branching', count: COMMANDS_DATA.filter(c => c.category === 'branching').length, desc: 'Branches, switch, checkout, merge, rebase', icon: 'GitBranch' },
  remote: { label: 'Remote / GitHub', count: COMMANDS_DATA.filter(c => c.category === 'remote').length, desc: 'Push, pull, fetch, remotes, forks, and PRs', icon: 'Cloud' },
  undo: { label: 'Undo / Recovery', count: COMMANDS_DATA.filter(c => c.category === 'undo').length, desc: 'Restore, reset, revert, stash & reflog', icon: 'RotateCcw' },
  collaboration: { label: 'Collaboration', count: COMMANDS_DATA.filter(c => c.category === 'collaboration').length, desc: 'Merge conflicts, PRs, review & branch flows', icon: 'Users' },
  advanced: { label: 'Advanced', count: COMMANDS_DATA.filter(c => c.category === 'advanced').length, desc: 'Cherry-pick, bisect, tags, blame & config', icon: 'Zap' },
};
