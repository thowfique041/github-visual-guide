import { exerciseStart, exercises } from '../src/lab/exercises';
import { runLabCommand } from '../src/lab/engine';

const cases: Record<string, string[]> = {
  'first-repository': ['git init','git status','git add .','git commit -m "Start project"'],
  'status-investigation': ['git status'],
  'selective-staging': ['git add index.html README.md','git commit -m "Update docs"'],
  'multiple-commits': ['git init','git add .','git commit -m "Start"','edit style.css','git add style.css','git commit -m "Style"','edit index.html','git add index.html','git commit -m "Page"','git log'],
  'inspect-diff': ['git diff','git add app.js','git diff --staged'],
  'new-file': ['touch feature.js','git add feature.js','git commit -m "Feature"'],
  'rename-file': ['mv app.js main.js','git add .','git commit -m "Rename"'],
  'deleted-file': ['rm style.css','git add .','git commit -m "Remove"'],
  'feature-branch': ['git switch -c feature-login','touch login.js','git add login.js','git commit -m "Login"'],
  'switch-branches': ['git branch','git switch main','git switch feature-login'],
  'merge-feature': ['git switch main','git merge feature-login','git log'],
  'merge-conflict': ['git merge feature-home','edit index.html "<h1>Welcome</h1>"','git add index.html','git commit -m "Resolve"'],
  'remote-connect': ['git remote add origin https://github.com/you/project.git','git remote -v','git push'],
  'first-push': ['git push'],
  'clone-project': ['git clone https://github.com/team/team-project.git'],
  'pull-teammate': ['git pull'],
  'push-rejected': ['git status','git fetch','git merge origin/main','git push'],
  'fetch-only': ['git fetch'],
  'restore-file': ['git restore index.html'],
  'unstage-secret': ['git restore --staged secret.txt'],
  'revert-bug': ['git revert HEAD'],
  'reset-soft': ['git reset --soft HEAD~1'],
  'reset-mixed': ['git reset --mixed HEAD~1'],
  'reset-hard': ['git reset --hard HEAD~1'],
  'reflog-recovery': ['git reflog','git branch recovery 0000002'],
  'stash-work': ['git stash','git switch main','git switch feature','git stash pop'],
  'multiple-stashes': ['git stash list','git stash apply stash@{1}'],
  'stash-pop': ['git stash pop'],
  'team-feature': ['git switch -c feature-payment','touch payment.js','git add payment.js','git commit -m "Payment"','git push origin feature-payment'],
  'pull-request': ['gh pr create','gh pr review --approve','gh pr merge'],
  'team-conflict': ['git merge teammate-A','edit app.js "combined"','git add app.js','git commit -m "Resolve"'],
  'rebase-feature': ['git rebase main'],
  'interactive-rebase': ['git rebase -i main'],
  'cherry-pick': ['git cherry-pick hotfix'],
  'release-tag': ['git tag v1.0.0'],
  'bisect-bug': ['git bisect start','git bisect good 0000002','git bisect bad 0000003'],
  'mission-wrong-file': ['git reset --mixed HEAD~1','git add app.js','git commit -m "Safe feature"'],
  'mission-push-rejected': ['git status','git fetch','git merge origin/main','git push'],
  'mission-conflict': ['git merge feature-home','edit index.html "Resolved"','git add index.html','git commit -m "Resolve"'],
  'mission-lost-commit': ['git reflog','git branch recovered 0000002'],
  'mission-switch-work': ['git stash','git switch main','git switch feature','git stash pop'],
  'mission-one-file': ['git add app.js','git commit -m "App"'],
  'mission-same-code': ['git merge teammate','edit app.js "combined"','git add app.js','git commit -m "Resolve"'],
  'mission-one-fix': ['git cherry-pick hotfix'],
  'mission-messy-history': ['git rebase -i main'],
  'mission-bug-investigation': ['git bisect start','git bisect good 0000002','git bisect bad 0000003'],
  'git-survival': ['git status','git stash','git fetch','git merge origin/main','git merge feature','git revert 0000003','git stash pop','git stash pop','git add .','git commit -m "Finish recovery"','git push'],
};

let failures = 0;
for (const exercise of exercises) {
  let state = exerciseStart(exercise);
  if (exercise.check(state).length === 0) { console.error(`${exercise.id}: already complete at start`); failures++; }
  for (const command of cases[exercise.id] || []) {
    const result = runLabCommand(state, command);
    state = result.state;
    if (!result.ok && !command.startsWith('git merge')) { console.error(`${exercise.id}: ${command}: ${result.output}`); failures++; break; }
  }
  const missing = exercise.check(state);
  if (missing.length) { console.error(`${exercise.id}: ${missing.join(' | ')}`, { branch: state.currentBranch, conflict: state.conflict, changed: state.changed, staged: state.staged, stashes: state.stashes.length, main: state.branches.main, remote: state.remoteBranches.main, files: state.commits.find(c => c.hash === state.branches.main)?.files }); failures++; }
}
console.log(`${exercises.length} exercise scenarios tested; ${failures} failure(s).`);
if (failures) process.exitCode = 1;
