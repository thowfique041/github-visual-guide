export type RiskLevel = 'safe' | 'caution' | 'danger';

export interface TroubleshootingGuide {
  id: string;
  title: string;
  symptoms: string[];
  explanation: string;
  diagnose: string[];
  solutions: { label: string; commands: string[]; risk: RiskLevel; note: string }[];
  tags: string[];
}

export const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = [
  {
    id: 'non-fast-forward', title: 'Push rejected: non-fast-forward',
    symptoms: ['rejected', 'non-fast-forward', 'fetch first'],
    explanation: 'The remote branch contains commits that your local branch does not have. Git refuses to discard that history.',
    diagnose: ['git status', 'git fetch origin', 'git log --oneline --graph --decorate --all'],
    solutions: [
      { label: 'Integrate safely', commands: ['git pull --rebase origin main', '# resolve conflicts if needed', 'git push origin main'], risk: 'safe', note: 'Replays your unpublished commits after the remote commits.' },
      { label: 'Replace remote history', commands: ['git push --force-with-lease origin main'], risk: 'danger', note: 'Only use when history rewrite is intentional and coordinated. Never use plain --force casually.' },
    ], tags: ['push', 'rejected', 'remote', 'non-fast-forward']
  },
  {
    id: 'detached-head', title: 'Detached HEAD: keep your work',
    symptoms: ['detached HEAD', 'HEAD detached', 'not currently on a branch'],
    explanation: 'HEAD points directly to a commit instead of a branch. New commits can become hard to find after switching away.',
    diagnose: ['git status', 'git log --oneline -5'],
    solutions: [
      { label: 'Create a rescue branch', commands: ['git switch -c rescue/my-work'], risk: 'safe', note: 'Creates a named pointer at the current commit so the work stays reachable.' },
      { label: 'Return without changes', commands: ['git switch main'], risk: 'safe', note: 'Use when you did not create commits that need keeping.' },
    ], tags: ['head', 'detached', 'recovery', 'branch']
  },
  {
    id: 'wrong-branch', title: 'Committed on the wrong branch',
    symptoms: ['wrong branch', 'committed to main', 'move commit'],
    explanation: 'The commit is valid, but the branch pointer was advanced in the wrong place.',
    diagnose: ['git status', 'git log --oneline -3'],
    solutions: [
      { label: 'Move an unpublished commit', commands: ['git branch feature/my-work', 'git reset --hard HEAD~1', 'git switch feature/my-work'], risk: 'caution', note: 'Safe only when the commit was not pushed and the working tree is clean.' },
      { label: 'Undo a shared commit', commands: ['git revert <commit-sha>', 'git push'], risk: 'safe', note: 'Preserves shared history by adding an inverse commit.' },
    ], tags: ['wrong branch', 'commit', 'reset', 'revert']
  },
  {
    id: 'merge-conflict', title: 'Merge or rebase conflict',
    symptoms: ['CONFLICT', 'unmerged paths', '<<<<<<< HEAD'],
    explanation: 'Two histories changed overlapping content and Git needs a human decision.',
    diagnose: ['git status', 'git diff --name-only --diff-filter=U'],
    solutions: [
      { label: 'Resolve and continue', commands: ['# edit files and remove conflict markers', 'git add <resolved-files>', 'git merge --continue  # or: git rebase --continue'], risk: 'safe', note: 'Review and test the combined result before continuing.' },
      { label: 'Abort safely', commands: ['git merge --abort  # or: git rebase --abort'], risk: 'safe', note: 'Returns to the state before the operation started.' },
    ], tags: ['merge', 'rebase', 'conflict', 'markers']
  },
  {
    id: 'lost-commit', title: 'Recover a lost commit or deleted branch',
    symptoms: ['lost commit', 'deleted branch', 'reset --hard', 'cannot find commit'],
    explanation: 'Git usually keeps recently moved HEAD positions in the reflog even when a branch pointer was deleted or reset.',
    diagnose: ['git reflog --date=local', 'git show <candidate-sha>'],
    solutions: [
      { label: 'Create a recovery branch', commands: ['git switch -c recovery/<name> <commit-sha>'], risk: 'safe', note: 'Inspect the candidate commit before anchoring it with a new branch.' },
    ], tags: ['reflog', 'recovery', 'deleted branch', 'reset']
  },
  {
    id: 'auth-failed', title: 'GitHub authentication failed',
    symptoms: ['Authentication failed', 'Permission denied (publickey)', '403', 'could not read Username'],
    explanation: 'GitHub does not accept account passwords for Git operations. Use SSH or HTTPS with a credential manager/token.',
    diagnose: ['git remote -v', 'ssh -T git@github.com', 'gh auth status'],
    solutions: [
      { label: 'GitHub CLI login', commands: ['gh auth login', 'gh auth setup-git'], risk: 'safe', note: 'Follow the browser/device prompt and never paste a token into source files.' },
      { label: 'Verify SSH', commands: ['ssh -T git@github.com', 'git remote set-url origin git@github.com:OWNER/REPO.git'], risk: 'caution', note: 'Add the public key—not the private key—to GitHub.' },
    ], tags: ['authentication', 'ssh', 'token', 'permission denied']
  },
  {
    id: 'secret-pushed', title: 'Secret or credential was committed',
    symptoms: ['secret pushed', 'API key committed', 'password in git', '.env committed'],
    explanation: 'Deleting the file in a later commit does not remove it from earlier history. Treat the credential as compromised immediately.',
    diagnose: ['git log --all -- <path>', 'git status --ignored'],
    solutions: [
      { label: 'Contain the incident', commands: ['# 1. Revoke/rotate the credential at its provider', '# 2. Add the path to .gitignore', 'git rm --cached <path>', 'git commit -m "security: stop tracking secret"'], risk: 'safe', note: 'Rotation is the first step. History cleanup alone cannot make an exposed secret trustworthy again.' },
      { label: 'Rewrite repository history', commands: ['git filter-repo --path <path> --invert-paths', 'git push --force --all'], risk: 'danger', note: 'Coordinate with every collaborator. All clones and open pull requests are affected.' },
    ], tags: ['secret', 'credential', '.env', 'security']
  },
  {
    id: 'large-file', title: 'Large file rejected by GitHub',
    symptoms: ['file exceeds', 'large files detected', 'GH001', '100 MB'],
    explanation: 'GitHub blocks very large Git objects. Generated assets should usually be ignored; required binaries belong in Git LFS.',
    diagnose: ['git rev-list --objects --all | git cat-file --batch-check="%(objecttype) %(objectname) %(objectsize) %(rest)"'],
    solutions: [
      { label: 'Remove an unpushed file', commands: ['git rm --cached <large-file>', 'echo "<large-file>" >> .gitignore', 'git commit --amend --no-edit'], risk: 'caution', note: 'Works when the file only entered the latest unpublished commit.' },
      { label: 'Track required binaries with LFS', commands: ['git lfs install', 'git lfs track "*.psd"', 'git add .gitattributes'], risk: 'safe', note: 'Existing history may still need migration.' },
    ], tags: ['large file', 'lfs', 'GH001', 'binary']
  },
  {
    id: 'remote-origin', title: 'Remote origin already exists or is wrong',
    symptoms: ['remote origin already exists', 'repository not found', 'wrong remote'],
    explanation: 'The local alias origin is already mapped, or it points to a repository you cannot access.',
    diagnose: ['git remote -v', 'git remote get-url origin'],
    solutions: [
      { label: 'Update the existing URL', commands: ['git remote set-url origin <correct-url>', 'git remote -v'], risk: 'safe', note: 'Prefer updating the existing alias over adding another origin.' },
    ], tags: ['remote', 'origin', 'url', 'repository not found']
  },
  {
    id: 'line-endings', title: 'CRLF/LF changes appear everywhere',
    symptoms: ['CRLF', 'LF will be replaced', 'whole file changed', 'line endings'],
    explanation: 'Different operating systems may normalize line endings differently, making unchanged lines appear modified.',
    diagnose: ['git diff --ignore-space-at-eol', 'git config --show-origin --get core.autocrlf'],
    solutions: [
      { label: 'Define repository rules', commands: ['# create .gitattributes with:', '* text=auto', '*.sh text eol=lf', 'git add --renormalize .'], risk: 'caution', note: 'Commit normalization separately so functional changes remain reviewable.' },
    ], tags: ['crlf', 'lf', 'windows', 'gitattributes']
  }
];
