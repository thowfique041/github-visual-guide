export type FileStatus = 'clean' | 'modified' | 'deleted' | 'untracked' | 'staged';
export type MotionKind = 'init' | 'edit' | 'add' | 'commit' | 'branch' | 'switch' | 'merge' | 'push' | 'fetch' | 'pull' | 'restore' | 'reset' | 'revert' | 'stash' | 'pop' | 'rebase' | 'remote' | 'inspect';

export interface LabCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  parents: string[];
  files: Record<string, string>;
}

export interface GitHubLabState {
  repository: { name: string; visibility: 'public' | 'private'; readme: boolean; gitignore: boolean; license: boolean } | null;
  issues: Array<{ title: string; status: 'open' | 'closed'; inProject: boolean; linkedPr: boolean }>;
  discussions: string[];
  project: string | null;
  workflowConfigured: boolean;
  workflowStatus: 'idle' | 'passed' | 'failed';
  branchProtection: boolean;
  collaborator: string | null;
  dependabot: boolean;
  secretScanning: boolean;
  releases: string[];
  pagesPublished: boolean;
  packages: string[];
}

export interface LabState {
  initialized: boolean;
  files: Record<string, string>;
  changed: string[];
  untracked: string[];
  staged: string[];
  commits: LabCommit[];
  branches: Record<string, string>;
  currentBranch: string;
  remoteUrl: string | null;
  remoteBranches: Record<string, string>;
  trackingBranches: Record<string, string>;
  stashes: Array<{ files: Record<string, string>; changed: string[]; untracked: string[] }>;
  tags: Record<string, string>;
  reflog: Array<{ hash: string; label: string }>;
  bisecting: boolean;
  bisectGood: string | null;
  bisectBad: string | null;
  bisectCulprit: string | null;
  inspections: string[];
  visitedBranches: string[];
  conflict: string | null;
  mergeSource: string | null;
  pullRequestOpen: boolean;
  reviewApproved: boolean;
  github: GitHubLabState;
  sequence: number;
  lastMotion: MotionKind;
  lastFile: string | null;
  lastExplanation: string;
}

export interface LabResult {
  state: LabState;
  output: string;
  ok: boolean;
  explanation: string;
}

const date = 'Today';
const author = 'You';
const hashFor = (n: number) => n.toString(16).padStart(7, '0');
const unique = (values: string[]) => Array.from(new Set(values));
const parentOf = (state: LabState, hash: string) => state.commits.find(commit => commit.hash === hash)?.parents[0] || '';
const commitOf = (state: LabState, hash: string) => state.commits.find(commit => commit.hash === hash);
const head = (state: LabState) => state.branches[state.currentBranch] || '';
const localAhead = (state: LabState) => head(state) !== (state.remoteBranches[state.currentBranch] || '');

export function createLabState(): LabState {
  return {
    initialized: false,
    files: { 'app.js': 'console.log("Hello Git");', 'index.html': '<h1>Hello Git</h1>', 'style.css': 'color: blue;' },
    changed: [], untracked: ['app.js', 'index.html', 'style.css'], staged: [], commits: [],
    branches: { main: '' }, currentBranch: 'main', remoteUrl: null, remoteBranches: {}, trackingBranches: {},
    stashes: [], tags: {}, reflog: [], bisecting: false, bisectGood: null, bisectBad: null, bisectCulprit: null, inspections: [], visitedBranches: ['main'], conflict: null, mergeSource: null, pullRequestOpen: false, reviewApproved: false,
    github: { repository: null, issues: [], discussions: [], project: null, workflowConfigured: false, workflowStatus: 'idle', branchProtection: false, collaborator: null, dependabot: false, secretScanning: false, releases: [], pagesPublished: false, packages: [] },
    sequence: 1,
    lastMotion: 'inspect', lastFile: null, lastExplanation: 'A normal folder is waiting to become a Git repository.',
  };
}

function finish(state: LabState, output: string, explanation: string, motion: MotionKind = 'inspect', file: string | null = null): LabResult {
  return { state: { ...state, lastMotion: motion, lastFile: file, lastExplanation: explanation }, output, explanation, ok: true };
}

function fail(state: LabState, output: string, explanation: string): LabResult {
  return { state: { ...state, lastMotion: 'inspect', lastExplanation: explanation }, output, explanation, ok: false };
}

function tokenize(input: string): string[] {
  return [...input.matchAll(/"([^"]*)"|'([^']*)'|([^\s]+)/g)].map(match => match[1] ?? match[2] ?? match[3]);
}

function resolveHash(state: LabState, value: string): string {
  if (value === 'HEAD') return head(state);
  if (value === 'HEAD~1') return parentOf(state, head(state));
  if (value === 'origin/main') return state.trackingBranches.main || '';
  return state.branches[value] || state.tags[value] || state.commits.find(commit => commit.hash.startsWith(value))?.hash || '';
}

function ancestors(state: LabState, from: string): Set<string> {
  const found = new Set<string>();
  const stack = from ? [from] : [];
  while (stack.length) {
    const hash = stack.pop()!;
    if (found.has(hash)) continue;
    found.add(hash);
    stack.push(...(commitOf(state, hash)?.parents || []));
  }
  return found;
}

function makeCommit(state: LabState, message: string, parents: string[], files: Record<string, string>): LabState {
  const hash = hashFor(state.sequence);
  const commit: LabCommit = { hash, message, author, date, parents: parents.filter(Boolean), files: { ...files } };
  return {
    ...state, commits: [...state.commits, commit], sequence: state.sequence + 1,
    branches: { ...state.branches, [state.currentBranch]: hash },
    reflog: [{ hash, label: `${state.currentBranch}: ${message}` }, ...state.reflog].slice(0, 24),
  };
}

export function fileStatuses(state: LabState): Array<{ name: string; status: FileStatus }> {
  return unique([...Object.keys(state.files), ...state.changed, ...state.staged]).sort().map(name => ({
    name,
    status: state.staged.includes(name) ? 'staged' : !(name in state.files) ? 'deleted' : state.untracked.includes(name) ? 'untracked' : state.changed.includes(name) ? 'modified' : 'clean',
  }));
}

export function runLabCommand(previous: LabState, input: string): LabResult {
  const command = input.trim();
  if (!command) return fail(previous, 'Enter a command to continue.', 'The terminal is waiting for your next action.');
  const tokens = tokenize(command);
  const [program, action, ...args] = tokens;
  let state = previous;

  // Editing is a safe, simulated file action, useful for creating realistic practice states.
  if (program === 'edit') {
    const file = action;
    if (!file) return fail(state, 'Usage: edit <filename>', 'Choose a file to change, for example: edit app.js');
    const existed = file in state.files;
    const content = args.length ? args.join(' ') : `${state.files[file] || ''}\n// edited in Git Visual Lab`;
    state = { ...state, files: { ...state.files, [file]: content },
      changed: existed ? unique([...state.changed, file]) : state.changed,
      untracked: existed ? state.untracked : unique([...state.untracked, file]) };
    return finish(state, `${file} changed in the simulated editor.`, `${file} is now ${existed ? 'modified' : 'untracked'} in the working directory.`, 'edit', file);
  }
  if (program === 'touch') {
    if (!action) return fail(state, 'Usage: touch <filename>', 'Name the new file you want to create.');
    if (action in state.files) return finish(state, `${action} already exists.`, 'The file was not changed.');
    return finish({ ...state, files: { ...state.files, [action]: '' }, untracked: unique([...state.untracked, action]) }, `Created ${action}.`, 'The new file is untracked until you stage it.', 'edit', action);
  }
  if (program === 'rm') {
    if (!action || !(action in state.files)) return fail(state, 'Name an existing file to remove.', 'Inspect the working files and choose a valid path.');
    const files = { ...state.files }; delete files[action];
    const untracked = state.untracked.filter(name => name !== action);
    const changed = state.untracked.includes(action) ? state.changed : unique([...state.changed, action]);
    return finish({ ...state, files, untracked, changed }, `Removed ${action} from the simulated working directory.`, state.untracked.includes(action) ? 'An untracked file was removed.' : 'A tracked deletion is now waiting to be staged.', 'edit', action);
  }
  if (program === 'mv') {
    if (!action || !args[0] || !(action in state.files) || args[0] in state.files) return fail(state, 'Usage: mv <existing-file> <new-file>', 'Choose a source file and an unused destination.');
    const files = { ...state.files, [args[0]]: state.files[action] }; delete files[action];
    return finish({ ...state, files, untracked: unique([...state.untracked.filter(name => name !== action), args[0]]), changed: state.untracked.includes(action) ? state.changed : unique([...state.changed, action]) }, `Renamed ${action} to ${args[0]}.`, 'Git sees a deletion and a new path until the change is staged.', 'edit', args[0]);
  }
  if (program === 'gh') {
    if (action === 'repo' && args[0] === 'create') {
      const name = args[1];
      if (!name) return fail(state, 'Usage: gh repo create <name> --public|--private', 'Name the GitHub repository and choose who can see it.');
      const visibility = args.includes('--private') ? 'private' : 'public';
      const repository = { name, visibility: visibility as 'public' | 'private', readme: args.includes('--add-readme'), gitignore: args.includes('--gitignore'), license: args.includes('--license') };
      state = { ...state, github: { ...state.github, repository }, remoteUrl: `https://github.com/you/${name}.git` };
      return finish(state, `Created ${visibility} GitHub repository you/${name} (simulation).`, 'The remote repository exists on GitHub; the local Git history is a separate copy.', 'remote');
    }
    if (action === 'issue' && args[0] === 'create') {
      if (!state.github.repository) return fail(state, 'Create a GitHub repository first.', 'Issues belong to a repository.');
      const title = args[args.indexOf('--title') + 1];
      if (!title || title.startsWith('--')) return fail(state, 'Usage: gh issue create --title "..." --body "..."', 'Give the work item a clear title and description.');
      state = { ...state, github: { ...state.github, issues: [...state.github.issues, { title, status: 'open', inProject: false, linkedPr: false }] } };
      return finish(state, `Created issue #${state.github.issues.length}: ${title} (simulation).`, 'An issue tracks a concrete task or bug and can be linked to a project or pull request.', 'remote');
    }
    if (action === 'workflow' && args[0] === 'run') {
      if (!state.github.workflowConfigured) return fail(state, 'No workflow is configured.', 'First add a workflow with a workflow_dispatch trigger. In this lab use: lab workflow configure ci.yml');
      if (args[1] !== 'ci.yml') return fail(state, 'Workflow not found.', 'Run the configured ci.yml workflow.');
      state = { ...state, github: { ...state.github, workflowStatus: 'passed' } };
      return finish(state, 'ci.yml completed: build ✓ test ✓ (simulation).', 'GitHub Actions ran the configured checks. A real workflow executes on GitHub runners.', 'remote');
    }
    if (action === 'release' && args[0] === 'create') {
      const tag = args[1];
      if (!tag) return fail(state, 'Usage: gh release create <tag> --generate-notes', 'A release needs a version tag.');
      if (!state.github.repository || !state.remoteBranches.main) return fail(state, 'Publish main before creating a release.', 'A release is built from a published repository revision.');
      state = { ...state, github: { ...state.github, releases: unique([...state.github.releases, tag]) } };
      return finish(state, `Published release ${tag} (simulation).`, 'A GitHub Release packages a version with notes and optional downloadable assets.', 'remote');
    }
    if (action === 'repo' && args[0] === 'fork') return finish(state, 'Fork created on GitHub (simulation).', 'A fork is your own server-side copy of another repository.', 'remote');
    if (action === 'pr' && args[0] === 'create') {
      if (!state.remoteBranches[state.currentBranch]) return fail(state, 'Push your feature branch before opening a PR.', 'A pull request compares a published branch with its target branch.');
      return finish({ ...state, pullRequestOpen: true }, 'Pull request opened for review (simulation).', 'Teammates can now compare, discuss, and review your branch.', 'remote');
    }
    if (action === 'pr' && args[0] === 'review' && args.includes('--approve')) {
      if (!state.pullRequestOpen) return fail(state, 'No pull request is open.', 'Open a PR before approving it.');
      return finish({ ...state, reviewApproved: true }, 'Review approved (simulation).', 'The proposed changes have been reviewed; the PR can now be merged.', 'inspect');
    }
    if (action === 'pr' && args[0] === 'merge') {
      if (!state.pullRequestOpen || !state.reviewApproved) return fail(state, 'The PR needs to be opened and approved first.', 'Review is part of the collaboration workflow.');
      if (state.github.branchProtection && state.github.workflowStatus !== 'passed') return fail(state, 'Required checks have not passed.', 'The main ruleset requires a passing workflow before this pull request can merge.');
      const issues = state.github.issues.map(issue => issue.linkedPr ? { ...issue, status: 'closed' as const } : issue);
      const sourceTip = state.remoteBranches[state.currentBranch];
      return finish({ ...state, pullRequestOpen: false, github: { ...state.github, issues }, remoteBranches: sourceTip ? { ...state.remoteBranches, main: sourceTip } : state.remoteBranches }, 'Pull request merged (simulation).', 'The reviewed branch reached main on GitHub; linked issues were closed.', 'merge');
    }
    return fail(state, 'Supported GitHub CLI actions: repo create/fork, issue create, workflow run, release create, pr create/review/merge.', 'The terminal simulates these GitHub CLI commands; it does not contact your account.');
  }
  if (program === 'lab') {
    if (!state.github.repository) return fail(state, 'Create a GitHub repository first.', 'The lab action needs a repository to change.');
    if (action === 'repo' && args[0] === 'add-file') {
      const file = args[1];
      if (!['README.md', '.gitignore', 'LICENSE'].includes(file)) return fail(state, 'Choose README.md, .gitignore, or LICENSE.', 'These files explain, filter, or license a repository.');
      const key = file === 'README.md' ? 'readme' : file === '.gitignore' ? 'gitignore' : 'license';
      const repository = { ...state.github.repository, [key]: true };
      return finish({ ...state, github: { ...state.github, repository } }, `Added ${file} to the simulated GitHub repository.`, `${file} is now part of the repository setup. Real changes should be committed and pushed.`, 'remote');
    }
    if (action === 'discussion' && args[0] === 'create') {
      const title = args[1];
      if (!title) return fail(state, 'Usage: lab discussion create "Question"', 'Give the community conversation a topic.');
      return finish({ ...state, github: { ...state.github, discussions: [...state.github.discussions, title] } }, `Opened discussion: ${title}.`, 'Discussions are for open-ended community conversation; Issues track actionable work.', 'remote');
    }
    if (action === 'project' && args[0] === 'create') {
      const title = args[1];
      if (!title) return fail(state, 'Usage: lab project create "Roadmap"', 'Name the planning board.');
      return finish({ ...state, github: { ...state.github, project: title } }, `Created project ${title}.`, 'Projects organize work across issues and pull requests.', 'remote');
    }
    if (action === 'project' && args[0] === 'add-issue') {
      const index = Number(args[1]) - 1;
      if (!state.github.project || !state.github.issues[index]) return fail(state, 'Create a project and a matching issue first.', 'A project item must point to existing work.');
      const issues = state.github.issues.map((issue, position) => position === index ? { ...issue, inProject: true } : issue);
      return finish({ ...state, github: { ...state.github, issues } }, `Added issue #${index + 1} to ${state.github.project}.`, 'The issue now appears on the planning board.', 'remote');
    }
    if (action === 'pr' && args[0] === 'link-issue') {
      const index = Number(args[1]) - 1;
      if (!state.pullRequestOpen || !state.github.issues[index]) return fail(state, 'Open a PR and choose an existing Issue first.', 'A pull request can reference an Issue it resolves.');
      const issues = state.github.issues.map((issue, position) => position === index ? { ...issue, linkedPr: true } : issue);
      return finish({ ...state, github: { ...state.github, issues } }, `Linked Issue #${index + 1} to the open PR.`, 'When the reviewed PR merges, this simulated Issue will close automatically.', 'remote');
    }
    if (action === 'workflow' && args[0] === 'configure' && args[1] === 'ci.yml') return finish({ ...state, github: { ...state.github, workflowConfigured: true, workflowStatus: 'idle' } }, 'Configured .github/workflows/ci.yml (simulation).', 'A real Actions workflow is a YAML file committed to the repository; workflow_dispatch enables manual runs.', 'remote');
    if (action === 'ruleset' && args[0] === 'protect' && args[1] === 'main') return finish({ ...state, github: { ...state.github, branchProtection: true } }, 'Protected main with a ruleset (simulation).', 'Require review and passing checks before merging into main.', 'remote');
    if (action === 'collaborator' && args[0] === 'invite' && args[1] && args[2]) return finish({ ...state, github: { ...state.github, collaborator: `${args[1]} (${args[2]})` } }, `Invited ${args[1]} with ${args[2]} access (simulation).`, 'Give collaborators only the access they need; the invitation is simulated.', 'remote');
    if (action === 'security' && args[0] === 'enable' && args[1] === 'dependabot') return finish({ ...state, github: { ...state.github, dependabot: true } }, 'Enabled Dependabot alerts (simulation).', 'Dependency alerts identify vulnerable packages; availability depends on repository settings and plan.', 'remote');
    if (action === 'security' && args[0] === 'enable' && args[1] === 'secret-scanning') return finish({ ...state, github: { ...state.github, secretScanning: true } }, 'Enabled secret scanning (simulation).', 'Secret scanning helps detect exposed credentials; availability varies by repository and plan.', 'remote');
    if (action === 'pages' && args[0] === 'publish' && args[1] === 'main') {
      if (!state.remoteBranches.main) return fail(state, 'Push main before publishing Pages.', 'Pages needs content in the remote repository.');
      return finish({ ...state, github: { ...state.github, pagesPublished: true } }, 'Published the main branch with GitHub Pages (simulation).', 'Pages serves a static site from the configured source. This lab does not publish a real website.', 'remote');
    }
    if (action === 'package' && args[0] === 'publish' && args[1]) return finish({ ...state, github: { ...state.github, packages: unique([...state.github.packages, args[1]]) } }, `Published package ${args[1]} (simulation).`, 'GitHub Packages stores versioned artifacts; a real publish needs authentication and a supported registry.', 'remote');
    return fail(state, 'Unsupported lab action.', 'Use the current lesson hint. lab actions simulate GitHub website settings and do not change your real account.');
  }
  if (program !== 'git') return fail(state, `Unknown command: ${program}`, 'This is a Git simulator. Use a Git command or edit <filename> to change a file.');
  if (action === '--version') return finish(state, 'git version 2.45.0 (simulation)', 'Git is the local version control tool.');
  if (action === 'clone') {
    if (state.initialized) return fail(state, 'This folder already contains a repository.', 'Reset the lab before cloning into a fresh folder.');
    const url = args[0];
    if (!url) return fail(state, 'Usage: git clone <url>', 'A clone needs the URL of the repository to copy.');
    state = { ...state, initialized: true, remoteUrl: url, untracked: [], changed: [], staged: [] };
    state = makeCommit(state, 'Initial commit from GitHub', [], state.files);
    state = { ...state, remoteBranches: { main: head(state) }, trackingBranches: { main: head(state) } };
    return finish(state, `Cloned ${url} into a local repository.`, 'The files and commit history now live on your computer; origin points to GitHub.', 'remote');
  }
  if (action === 'init') {
    if (state.initialized) return finish(state, 'Reinitialized existing Git repository.', 'The .git database was already present.', 'init');
    return finish({ ...state, initialized: true }, 'Initialized empty Git repository in my-project/.git/', 'Git created its local metadata directory. Your files have not been committed yet.', 'init');
  }
  if (!state.initialized) return fail(state, 'fatal: not a git repository', 'Run git init first. That creates the .git directory that tracks history.');

  switch (action) {
    case 'status': {
      const lines = [`On branch ${state.currentBranch}`];
      if (state.conflict) lines.push(`Merge conflict in ${state.conflict}. Edit the file, stage it, then commit.`);
      if (state.staged.length) lines.push(`Staged: ${state.staged.join(', ')}`);
      if (state.changed.length) lines.push(...state.changed.map(file => `${file in state.files ? 'Modified' : 'Deleted'}: ${file}`));
      if (state.untracked.length) lines.push(`Untracked: ${state.untracked.join(', ')}`);
      if (lines.length === 1) lines.push('Working tree clean.');
      return finish({ ...state, inspections: unique([...state.inspections, 'status']) }, lines.join('\n'), 'Status reads the working directory and staging area without changing either.');
    }
    case 'add': {
      if (!args.length) return fail(state, 'Nothing specified for git add.', 'Name a file, or use git add . to stage all changes.');
      const candidates = args[0] === '.' || args[0] === '-A' ? unique([...state.changed, ...state.untracked]) : args;
      const missing = candidates.find(file => !(file in state.files) && !state.changed.includes(file));
      if (missing) return fail(state, `pathspec '${missing}' did not match any file`, 'Check the filename in the working directory and try again.');
      if (!candidates.length) return fail(state, 'No changed files to stage.', 'Edit a file first. The working directory is currently clean.');
      state = { ...state, staged: unique([...state.staged, ...candidates]), changed: state.changed.filter(file => !candidates.includes(file)), untracked: state.untracked.filter(file => !candidates.includes(file)) };
      return finish(state, `Staged ${candidates.join(', ')}.`, 'The selected file moved into the staging area, ready for the next commit.', 'add', candidates[0]);
    }
    case 'commit': {
      if (!state.staged.length && !state.conflict) return fail(state, 'Nothing staged to commit.', 'The missing step is staging: edit a file, then run git add <file>.');
      const messageIndex = args.indexOf('-m');
      const message = messageIndex >= 0 ? args[messageIndex + 1] : '';
      if (!message) return fail(state, 'Please provide a commit message with -m.', 'A message explains why this snapshot exists. Try git commit -m "Add login".');
      const files = { ...(commitOf(state, head(state))?.files || {}) };
      state.staged.forEach(file => { if (file in state.files) files[file] = state.files[file]; else delete files[file]; });
      state = makeCommit(state, message, state.conflict ? [head(state), state.mergeSource || ''].filter(Boolean) : [head(state)], files);
      state = { ...state, staged: [], conflict: null, mergeSource: null };
      return finish(state, `[${state.currentBranch} ${head(state)}] ${message}`, 'Git created a local snapshot from the staged changes. It has not been sent to GitHub.', 'commit');
    }
    case 'log': {
      const reachable = ancestors(state, head(state));
      const list = [...state.commits].reverse().filter(commit => reachable.has(commit.hash));
      return finish({ ...state, inspections: unique([...state.inspections, 'log']) }, list.length ? list.map(commit => `${commit.hash} ${commit.message}`).join('\n') : 'No commits yet.', 'Each line represents a commit reachable from the current branch. Click a node in the graph for details.');
    }
    case 'diff': {
      const staged = args.includes('--staged') || args.includes('--cached');
      const names = staged ? state.staged : state.changed;
      state = { ...state, inspections: unique([...state.inspections, staged ? 'diff-staged' : 'diff']) };
      if (!names.length) return finish(state, 'No differences in this area.', staged ? 'There are no staged changes to compare.' : 'There are no unstaged tracked edits to compare.');
      const earlier = commitOf(state, head(state))?.files || {};
      return finish(state, names.map(file => `diff --git a/${file} b/${file}\n- ${earlier[file] || '(new file)'}\n+ ${state.files[file]}`).join('\n'), `The diff shows the before and after content in ${staged ? 'staging' : 'the working directory'} before a commit.`);
    }
    case 'branch': {
      if (!args.length) return finish({ ...state, inspections: unique([...state.inspections, 'branch']) }, Object.keys(state.branches).map(branch => `${branch === state.currentBranch ? '* ' : '  '}${branch}`).join('\n'), 'A branch is a movable pointer to a commit.');
      const name = args[0];
      if (name === '-d' || name === '-D') {
        const target = args[1];
        if (!target || !state.branches[target]) return fail(state, 'Branch not found.', 'Name an existing branch to delete.');
        if (target === state.currentBranch) return fail(state, 'Cannot delete the current branch.', 'Switch to another branch first.');
        const branches = { ...state.branches }; delete branches[target];
        return finish({ ...state, branches }, `Deleted branch ${target}.`, 'The branch pointer was removed; the commit objects remain until Git prunes them.', 'branch');
      }
      if (state.branches[name] !== undefined) return fail(state, `Branch '${name}' already exists.`, 'Choose a different branch name or switch to the existing branch.');
      const tip = args[1] ? resolveHash(state, args[1]) : head(state);
      if (args[1] && !tip) return fail(state, 'Starting commit not found.', 'Use git reflog to identify a recoverable commit hash.');
      return finish({ ...state, branches: { ...state.branches, [name]: tip } }, `Created branch ${name}.`, `The new branch points to ${tip || 'the unborn HEAD'}, but HEAD remains on ${state.currentBranch}.`, 'branch');
    }
    case 'switch':
    case 'checkout': {
      const create = args[0] === '-c' || args[0] === '-b';
      const name = create ? args[1] : args[0];
      if (!name) return fail(state, `Usage: git ${action} <branch>`, 'Name the branch you want to move to.');
      if (state.changed.length || state.staged.length) return fail(state, 'Local changes would be affected by switching branches.', 'Commit or stash your work first, then switch branches.');
      if (create) {
        if (state.branches[name] !== undefined) return fail(state, `Branch '${name}' already exists.`, 'Switch to it without -c, or choose a new name.');
        state = { ...state, branches: { ...state.branches, [name]: head(state) } };
      }
      if (state.branches[name] === undefined) return fail(state, `Unknown branch: ${name}`, 'Create it with git switch -c <name>, or list branches with git branch.');
      const snapshot = commitOf(state, state.branches[name])?.files || state.files;
      return finish({ ...state, currentBranch: name, files: { ...snapshot }, changed: [], untracked: [], staged: [], visitedBranches: [...state.visitedBranches, name] }, `Switched to branch '${name}'.`, 'HEAD now points to this branch; the working files match its latest commit.', 'switch');
    }
    case 'merge': {
      const name = args[0];
      const source = name && (state.branches[name] || (name.startsWith('origin/') ? state.trackingBranches[name.slice(7)] : ''));
      if (!name || !source) return fail(state, 'Choose an existing branch to merge.', 'Run git branch to see available branch names.');
      if (name === state.currentBranch) return fail(state, 'Already on the branch you selected.', 'Switch to the receiving branch, then merge the other branch.');
      const current = head(state);
      if (ancestors(state, current).has(source)) return finish(state, 'Already up to date.', 'All commits from that branch are already reachable here.', 'merge');
      const sourceFiles = commitOf(state, source)?.files || {};
      if (ancestors(state, source).has(current)) return finish({ ...state, branches: { ...state.branches, [state.currentBranch]: source }, files: { ...sourceFiles } }, 'Fast-forward merge completed.', 'The receiving branch pointer moved forward; no merge commit was needed.', 'merge');
      const common = [...ancestors(state, current)].find(hash => ancestors(state, source).has(hash));
      const baseFiles = common ? commitOf(state, common)?.files || {} : {};
      const ours = commitOf(state, current)?.files || {};
      const conflict = Object.keys(sourceFiles).find(file => ours[file] !== baseFiles[file] && sourceFiles[file] !== baseFiles[file] && ours[file] !== sourceFiles[file]);
      if (conflict) return fail({ ...state, conflict, mergeSource: source, files: { ...state.files, [conflict]: `<<<<<<< HEAD\n${ours[conflict]}\n=======\n${sourceFiles[conflict]}\n>>>>>>> ${name}` }, changed: unique([...state.changed, conflict]) }, `CONFLICT in ${conflict}.`, `Both branches edited ${conflict}. Inspect both versions, edit the final result, stage it, then commit.`);
      const merged = { ...ours };
      Object.keys(sourceFiles).forEach(file => { if (sourceFiles[file] !== baseFiles[file]) merged[file] = sourceFiles[file]; });
      state = makeCommit(state, `Merge branch '${name}'`, [current, source], merged);
      return finish({ ...state, files: { ...merged } }, `Merge made commit ${head(state)}.`, 'Two lines of history converged in a merge commit with two parents.', 'merge');
    }
    case 'remote': {
      if (args[0] === '-v' || !args.length) return finish({ ...state, inspections: unique([...state.inspections, 'remote']) }, state.remoteUrl ? `origin  ${state.remoteUrl} (fetch)\norigin  ${state.remoteUrl} (push)` : 'No remote configured.', 'origin is a nickname for the remote URL.');
      if (args[0] === 'add' && args[1] && args[2]) return finish({ ...state, remoteUrl: args[2] }, `Added remote ${args[1]} → ${args[2]}.`, 'The local repository now knows where to send and receive commits.', 'remote');
      return fail(state, 'Usage: git remote add origin <url>', 'Give the remote a name and URL, or run git remote -v to inspect it.');
    }
    case 'push': {
      if (!state.remoteUrl) return fail(state, 'No remote destination configured.', 'Add a remote first: git remote add origin <url>.');
      if (!head(state)) return fail(state, 'Nothing to push yet.', 'Create a commit first: edit → git add → git commit. Push sends commits, not uncommitted files.');
      const target = args[1] || state.currentBranch;
      if (target !== state.currentBranch) return fail(state, `You are on ${state.currentBranch}, not ${target}.`, 'Push the current branch or switch to the branch you intend to publish.');
      const remoteTip = state.remoteBranches[target];
      if (remoteTip && !ancestors(state, head(state)).has(remoteTip)) return fail(state, 'Push rejected: the remote branch has commits missing locally.', 'Fetch first, then integrate the remote work with merge or rebase before pushing. This simulator will not overwrite it.');
      if (!localAhead(state)) return finish(state, 'Everything up to date.', 'GitHub already has this branch tip.');
      state = { ...state, remoteBranches: { ...state.remoteBranches, [target]: head(state) }, trackingBranches: { ...state.trackingBranches, [target]: head(state) } };
      return finish(state, `Pushed ${target} to origin (${head(state)}).`, 'The local commits traveled to GitHub; local and remote branch tips now match.', 'push');
    }
    case 'fetch': {
      if (!state.remoteUrl) return fail(state, 'No remote to fetch from.', 'Connect a remote first with git remote add origin <url>.');
      state = { ...state, trackingBranches: { ...state.remoteBranches } };
      return finish(state, 'Fetched remote branch information.', 'origin/main moved to the latest known GitHub commit. Your current branch and working files did not change.', 'fetch');
    }
    case 'pull': {
      if (!state.remoteUrl) return fail(state, 'No remote to pull from.', 'Connect origin before pulling.');
      const remoteTip = state.remoteBranches[state.currentBranch];
      if (!remoteTip) return fail(state, 'The remote has no matching branch.', 'Fetch first or choose a remote branch that exists.');
      state = { ...state, trackingBranches: { ...state.remoteBranches } };
      if (head(state) === remoteTip) return finish(state, 'Already up to date.', 'Fetch found no new remote commits to integrate.', 'pull');
      if (state.changed.length || state.staged.length) return fail(state, 'Local changes need attention before pulling.', 'Commit or stash your work before integrating remote commits.');
      if (!ancestors(state, remoteTip).has(head(state))) return fail(state, 'Branches diverged.', 'Fetch and inspect the graph; choose merge or rebase explicitly.');
      const files = commitOf(state, remoteTip)?.files || state.files;
      return finish({ ...state, branches: { ...state.branches, [state.currentBranch]: remoteTip }, files: { ...files } }, 'Fetched and fast-forwarded the local branch.', 'Pull fetched the remote tip and integrated it into your current branch and working directory.', 'pull');
    }
    case 'restore': {
      const staged = args.includes('--staged');
      const file = args.find(arg => !arg.startsWith('--'));
      if (!file) return fail(state, 'Name a file to restore.', 'Use git restore --staged <file> to unstage without discarding your edit.');
      if (staged) {
        if (!state.staged.includes(file)) return fail(state, `${file} is not staged.`, 'Run git status to see what is in staging.');
        return finish({ ...state, staged: state.staged.filter(name => name !== file), changed: state.untracked.includes(file) ? state.changed : unique([...state.changed, file]), untracked: (commitOf(state, head(state))?.files || {})[file] === undefined ? unique([...state.untracked, file]) : state.untracked }, `Unstaged ${file}.`, 'The file returned to the working directory; your edits are still there.', 'restore', file);
      }
      if (!state.changed.includes(file)) return fail(state, `${file} has no tracked working changes to restore.`, 'git restore does not discard untracked files. Check git status.');
      const snapshot = commitOf(state, head(state))?.files || {};
      return finish({ ...state, files: { ...state.files, [file]: snapshot[file] || '' }, changed: state.changed.filter(name => name !== file) }, `Restored ${file}.`, 'The uncommitted working edit was discarded. The committed version remains.', 'restore', file);
    }
    case 'reset': {
      const mode = args.find(arg => arg.startsWith('--')) || '--mixed';
      if (!['--soft', '--mixed', '--hard'].includes(mode)) return fail(state, `Unsupported reset mode: ${mode}`, 'Use --soft, --mixed, or --hard in this lab.');
      const target = resolveHash(state, args.find(arg => !arg.startsWith('--')) || 'HEAD~1');
      if (!target) return fail(state, 'No earlier commit found.', 'Create at least two commits or choose an existing hash.');
      const old = head(state);
      const targetFiles = commitOf(state, target)?.files || {};
      state = { ...state, branches: { ...state.branches, [state.currentBranch]: target }, reflog: [{ hash: old, label: `reset ${mode}: old HEAD` }, ...state.reflog] };
      const changedFromTarget = unique([...Object.keys(state.files), ...Object.keys(targetFiles)]).filter(file => state.files[file] !== targetFiles[file]);
      if (mode === '--soft') state = { ...state, staged: unique([...state.staged, ...changedFromTarget]) };
      if (mode === '--mixed') state = { ...state, staged: [], changed: unique([...state.changed, ...changedFromTarget]) };
      if (mode === '--hard') state = { ...state, files: { ...targetFiles }, staged: [], changed: [], untracked: [] };
      return finish(state, `Moved ${state.currentBranch} to ${target}.`, mode === '--hard' ? 'HEAD, staging, and working files now match the target. Uncommitted work was discarded.' : mode === '--soft' ? 'HEAD moved back while changes remain staged.' : 'HEAD moved back and changes remain in the working directory.', 'reset');
    }
    case 'revert': {
      const target = resolveHash(state, args[0] || 'HEAD');
      const commit = commitOf(state, target);
      if (!commit) return fail(state, 'Commit not found.', 'Use git log to find the commit hash.');
      const previousFiles = commitOf(state, commit.parents[0])?.files || {};
      const currentFiles = commitOf(state, head(state))?.files || {};
      const reverted = { ...currentFiles };
      Object.keys(commit.files).filter(file => commit.files[file] !== previousFiles[file]).forEach(file => {
        if (file in previousFiles) reverted[file] = previousFiles[file]; else delete reverted[file];
      });
      state = makeCommit(state, `Revert "${commit.message}"`, [head(state)], reverted);
      return finish({ ...state, files: { ...reverted }, changed: [], staged: [] }, `Created revert commit ${head(state)}.`, 'Revert adds a new inverse commit. It does not erase shared history.', 'revert');
    }
    case 'reflog': return finish({ ...state, inspections: unique([...state.inspections, 'reflog']) }, state.reflog.map(entry => `${entry.hash} ${entry.label}`).join('\n') || 'No HEAD movements yet.', 'Reflog records local pointer movement and can help recover a lost commit.');
    case 'stash': {
      if (args[0] === 'list') return finish({ ...state, inspections: unique([...state.inspections, 'stash-list']) }, state.stashes.map((_, index) => `stash@{${index}}: work in progress`).join('\n') || 'No stash entries.', 'Stash entries are numbered newest first.');
      if (args[0] === 'pop' || args[0] === 'apply') {
        const index = args[1] ? Number(args[1].match(/stash@\{(\d+)\}/)?.[1]) : 0;
        const stash = state.stashes[index];
        if (!stash) return fail(state, 'No stash entries found.', 'Make a working change and run git stash first.');
        return finish({ ...state, files: { ...state.files, ...stash.files }, changed: unique([...state.changed, ...stash.changed]), untracked: unique([...state.untracked, ...stash.untracked]), stashes: args[0] === 'pop' ? state.stashes.filter((_, position) => position !== index) : state.stashes }, `${args[0] === 'pop' ? 'Applied and dropped' : 'Applied'} stash@{${index}}.`, 'The shelved changes returned to the working directory.', 'pop');
      }
      if (!state.changed.length) return fail(state, 'No tracked changes to save.', 'Edit a tracked file before stashing. By default Git does not stash untracked files; use -u in real Git to include them.');
      const names = [...state.changed];
      const files = Object.fromEntries(names.map(name => [name, state.files[name]]));
      const snapshot = commitOf(state, head(state))?.files || {};
      state = { ...state, files: { ...state.files, ...Object.fromEntries(names.filter(name => name in snapshot).map(name => [name, snapshot[name]])) }, changed: [], stashes: [{ files, changed: names, untracked: [] }, ...state.stashes] };
      return finish(state, 'Saved working changes to stash@{0}.', 'Uncommitted work moved to temporary storage; the working directory is clean.', 'stash');
    }
    case 'rebase': {
      if (args[0] === '--abort') return finish(state, 'No rebase is in progress.', 'A real rebase can be aborted to restore the pre-rebase state.', 'rebase');
      const interactive = args[0] === '-i';
      const target = resolveHash(state, (interactive ? args[1] : args[0]) || 'origin/main');
      if (!target) return fail(state, 'Base branch not found.', 'Fetch the remote or name an existing branch.');
      const original = head(state);
      const targetAncestors = ancestors(state, target);
      const replay = [...state.commits].filter(commit => ancestors(state, original).has(commit.hash) && !targetAncestors.has(commit.hash) && commit.parents.length <= 1);
      if (!replay.length) return finish(state, 'Current branch is already based on that commit.', 'There are no local commits to replay.', 'rebase');
      state = { ...state, branches: { ...state.branches, [state.currentBranch]: target } };
      if (interactive) {
        const files = { ...(commitOf(state, target)?.files || {}) };
        for (const commit of replay) {
          const before = commitOf(state, commit.parents[0])?.files || {};
          unique([...Object.keys(before), ...Object.keys(commit.files)]).filter(file => commit.files[file] !== before[file]).forEach(file => { if (file in commit.files) files[file] = commit.files[file]; else delete files[file]; });
        }
        state = makeCommit(state, `squash: ${replay.map(commit => commit.message).join(' + ')}`, [target], files);
        return finish({ ...state, files: { ...files } }, `Interactive plan: squashed ${replay.length} local commits into ${head(state)}.`, 'The unpublished commits were combined into a new commit with a new hash.', 'rebase');
      }
      for (const commit of replay) {
        const before = commitOf(state, commit.parents[0])?.files || {};
        const changed = Object.keys(commit.files).filter(file => commit.files[file] !== before[file]);
        const current = commitOf(state, head(state))?.files || {};
        const files = { ...current };
        changed.forEach(file => { files[file] = commit.files[file]; });
        state = makeCommit(state, commit.message, [head(state)], files);
      }
      return finish({ ...state, files: { ...(commitOf(state, head(state))?.files || state.files) } }, `${interactive ? 'Interactive plan applied: ' : ''}Replayed ${replay.length} commit(s) onto ${target}.`, 'Rebase rebuilt local commits with new hashes on the new base. Avoid doing this to shared commits.', 'rebase');
    }
    case 'cherry-pick': {
      const target = resolveHash(state, args[0] || '');
      const commit = commitOf(state, target);
      if (!commit) return fail(state, 'Commit not found.', 'Choose a commit hash from git log or the graph.');
      const before = commitOf(state, commit.parents[0])?.files || {};
      const files = { ...state.files };
      Object.keys(commit.files).filter(file => commit.files[file] !== before[file]).forEach(file => { files[file] = commit.files[file]; });
      state = makeCommit(state, commit.message, [head(state)], files);
      return finish({ ...state, files }, `Cherry-picked ${target} as ${head(state)}.`, 'A new copy of the selected change appears on the current branch.', 'commit');
    }
    case 'tag': {
      if (!args.length) return finish(state, Object.keys(state.tags).join('\n') || 'No tags yet.', 'Tags name important commits, often releases.');
      const name = args[0] === '-a' ? args[1] : args[0];
      if (!name || !head(state)) return fail(state, 'Create a commit before tagging it.', 'A tag needs a commit to point to.');
      return finish({ ...state, tags: { ...state.tags, [name]: head(state) } }, `Created tag ${name} → ${head(state)}.`, 'The tag is a stable release label for this commit.', 'branch');
    }
    case 'bisect': {
      if (args[0] === 'reset') return finish({ ...state, bisecting: false }, 'Bisect ended.', 'Your branch is back to normal inspection.', 'inspect');
      if (args[0] === 'start') return finish({ ...state, bisecting: true, bisectGood: null, bisectBad: null, bisectCulprit: null }, 'Bisect started. Mark a bad and a good commit.', 'Git will narrow the regression search between known bad and good states.', 'inspect');
      if (!state.bisecting) return fail(state, 'Bisect has not started.', 'Run git bisect start first.');
      if (args[0] === 'good' || args[0] === 'bad') {
        const marked = resolveHash(state, args[1] || 'HEAD');
        if (!marked) return fail(state, 'Commit not found.', 'Use git log to find a known good or bad revision.');
        const next = { ...state, [args[0] === 'good' ? 'bisectGood' : 'bisectBad']: marked };
        const culprit = next.bisectGood && next.bisectBad && parentOf(next, next.bisectBad) === next.bisectGood ? next.bisectBad : null;
        return finish({ ...next, bisectCulprit: culprit }, culprit ? `Bisect identified first bad commit: ${culprit}.` : `Marked ${args[0]} ${marked}. Continue narrowing the range.`, culprit ? 'The bad revision immediately follows the known good revision.' : 'Bisect narrows the possible regression range.', 'inspect');
      }
      return fail(state, 'Use git bisect start, good, bad, or reset.', 'Bisect needs a known good and a known bad point.');
    }
    case 'blame': {
      const file = args[args.length - 1];
      if (!file || !(file in state.files)) return fail(state, 'Name an existing file.', 'Blame annotates lines in a tracked file with commit history.');
      return finish(state, `${head(state) || '0000000'} (You Today) ${state.files[file]}`, 'The annotation tells you which commit last changed each line. It is a starting point for understanding context.');
    }
    default: return fail(state, `Unsupported command: git ${action || ''}`, 'This lab supports the commands taught in the course. Try git status or open the current lesson hint.');
  }
}

export function prepareLab(commands: string[]): LabState {
  return commands.reduce((state, command) => runLabCommand(state, command).state, createLabState());
}
