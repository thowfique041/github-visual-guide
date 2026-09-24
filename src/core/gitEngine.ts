import { GitEngineState, CommitNode, SimulatedFile } from '../types/git';

function randomHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 7; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function createInitialGitState(): GitEngineState {
  const initialCommit: CommitNode = {
    hash: 'a1c9e42',
    message: 'Initial commit: README & index.html',
    author: 'Alex Morgan <alex@dev.io>',
    timestamp: '2 hours ago',
    parents: [],
    branch: 'main',
    isRemote: true
  };

  const secondCommit: CommitNode = {
    hash: 'b3f810c',
    message: 'Add navigation bar and header styles',
    author: 'Alex Morgan <alex@dev.io>',
    timestamp: '1 hour ago',
    parents: ['a1c9e42'],
    branch: 'main',
    isRemote: true
  };

  return {
    isInitialized: true,
    workingFiles: [
      { name: 'app.js', status: 'modified', linesAdded: 14, linesRemoved: 3, content: '// User authentication logic' },
      { name: 'styles.css', status: 'untracked', linesAdded: 45, linesRemoved: 0, content: '/* Dark mode styling */' },
      { name: 'README.md', status: 'committed', linesAdded: 0, linesRemoved: 0, content: '# GitHub Visual Guide' }
    ],
    commits: [initialCommit, secondCommit],
    branches: {
      'main': {
        name: 'main',
        color: '#58a6ff',
        commitHash: 'b3f810c',
        isRemoteTracking: true
      },
      'feature': {
        name: 'feature',
        color: '#3fb950',
        commitHash: 'b3f810c',
        isRemoteTracking: false
      }
    },
    currentBranch: 'main',
    headCommitHash: 'b3f810c',
    remoteCommits: [initialCommit, secondCommit],
    remoteBranch: 'main',
    remoteUrl: 'https://github.com/developer/visual-guide.git',
    stashes: [],
    lastCommand: null,
    terminalHistory: [
      { command: 'git status', output: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  modified:   app.js\n\nUntracked files:\n  styles.css', status: 'info' }
    ]
  };
}

export function executeGitCommand(state: GitEngineState, rawCmd: string): { newState: GitEngineState; output: string; status: 'ok' | 'error' | 'info' } {
  const trimmed = rawCmd.trim();
  if (!trimmed) {
    return { newState: state, output: '', status: 'ok' };
  }

  const parts = trimmed.split(/\s+/);
  if (parts[0] !== 'git') {
    return {
      newState: {
        ...state,
        terminalHistory: [...state.terminalHistory, { command: trimmed, output: `bash: ${parts[0]}: command not found. Use "git <command>"`, status: 'error' }]
      },
      output: `bash: ${parts[0]}: command not found. Try running "git status" or "git add"`,
      status: 'error'
    };
  }

  const subCmd = parts[1];
  const args = parts.slice(2);

  let output = '';
  let status: 'ok' | 'error' | 'info' = 'ok';
  let newState: GitEngineState = { ...state, lastCommand: trimmed };

  switch (subCmd) {
    case 'status': {
      const staged = state.workingFiles.filter(f => f.status === 'staged');
      const modified = state.workingFiles.filter(f => f.status === 'modified');
      const untracked = state.workingFiles.filter(f => f.status === 'untracked');
      
      const lines = [
        `On branch ${state.currentBranch}`,
        state.remoteUrl ? `Your branch is connected to 'origin/${state.currentBranch}'.` : 'No remote configured.'
      ];

      if (staged.length > 0) {
        lines.push('\nChanges to be committed:');
        lines.push('  (use "git restore --staged <file>..." to unstage)');
        staged.forEach(f => lines.push(`\x1b[32m\tstaged:   ${f.name}\x1b[0m`));
      }

      if (modified.length > 0) {
        lines.push('\nChanges not staged for commit:');
        lines.push('  (use "git add <file>..." to update what will be committed)');
        modified.forEach(f => lines.push(`\x1b[31m\tmodified: ${f.name}\x1b[0m`));
      }

      if (untracked.length > 0) {
        lines.push('\nUntracked files:');
        lines.push('  (use "git add <file>..." to include in what will be committed)');
        untracked.forEach(f => lines.push(`\x1b[31m\t${f.name}\x1b[0m`));
      }

      if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
        lines.push('\nnothing to commit, working tree clean');
      }

      output = lines.join('\n');
      status = 'info';
      break;
    }

    case 'add': {
      const target = args[0];
      if (!target) {
        output = 'Nothing specified, nothing added.\nMaybe you wanted to say \'git add .\'?';
        status = 'error';
        break;
      }

      const updatedFiles = state.workingFiles.map(f => {
        if (target === '.' || target === '-A' || target === f.name) {
          if (f.status === 'modified' || f.status === 'untracked') {
            return { ...f, status: 'staged' as const };
          }
        }
        return f;
      });

      newState = {
        ...state,
        workingFiles: updatedFiles
      };
      output = `Staged changes for ${target === '.' ? 'all files' : target}. Ready for commit.`;
      break;
    }

    case 'commit': {
      const staged = state.workingFiles.filter(f => f.status === 'staged');
      const isAmend = args.includes('--amend');
      if (isAmend) {
        const previous = state.commits[state.commits.length - 1];
        if (!previous) { output = 'fatal: You have nothing to amend.'; status = 'error'; break; }
        const amendedHash = randomHash();
        const mIdx = args.indexOf('-m');
        const message = mIdx !== -1 && args[mIdx + 1] ? args.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '') : previous.message;
        const amended = { ...previous, hash: amendedHash, message, timestamp: 'just now', isRemote: false };
        newState = { ...state, commits: [...state.commits.slice(0, -1), amended], headCommitHash: amendedHash,
          workingFiles: state.workingFiles.map(f => f.status === 'staged' ? { ...f, status: 'committed' as const } : f),
          branches: { ...state.branches, [state.currentBranch]: { ...state.branches[state.currentBranch], commitHash: amendedHash } } };
        output = `[${state.currentBranch} ${amendedHash}] ${message}\nDate: just now\nAmended the previous commit (old SHA ${previous.hash}).`;
        break;
      }
      if (staged.length === 0) {
        output = 'On branch ' + state.currentBranch + '\nNothing to commit, working tree clean (run "git add" first)';
        status = 'error';
        break;
      }

      let message = 'Update repository files';
      const mIdx = args.indexOf('-m');
      if (mIdx !== -1 && args[mIdx + 1]) {
        message = args.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '');
      }

      const newHash = randomHash();
      const currentParent = state.branches[state.currentBranch]?.commitHash || state.headCommitHash;

      const newCommit: CommitNode = {
        hash: newHash,
        message,
        author: 'Alex Morgan <alex@dev.io>',
        timestamp: 'just now',
        parents: currentParent ? [currentParent] : [],
        branch: state.currentBranch,
        isRemote: false
      };

      const updatedFiles = state.workingFiles.map(f => {
        if (f.status === 'staged') {
          return { ...f, status: 'committed' as const };
        }
        return f;
      });

      // Add one modified file for future interactions
      const hasModified = updatedFiles.some(f => f.status === 'modified' || f.status === 'untracked');
      if (!hasModified) {
        updatedFiles.push({
          name: `component-${Math.floor(Math.random() * 100)}.tsx`,
          status: 'modified',
          linesAdded: 8,
          linesRemoved: 1,
          content: '// New UI component'
        });
      }

      newState = {
        ...state,
        commits: [...state.commits, newCommit],
        headCommitHash: newHash,
        branches: {
          ...state.branches,
          [state.currentBranch]: {
            ...state.branches[state.currentBranch],
            commitHash: newHash
          }
        },
        workingFiles: updatedFiles
      };

      output = `[${state.currentBranch} ${newHash}] ${message}\n ${staged.length} file(s) changed, ${staged.reduce((acc, f) => acc + (f.linesAdded || 1), 0)} insertions(+)`;
      break;
    }

    case 'branch': {
      const branchName = args[0];
      if (!branchName) {
        // List branches
        const branchList = Object.keys(state.branches).map(b => {
          return (b === state.currentBranch ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`);
        }).join('\n');
        output = branchList;
        status = 'info';
        break;
      }

      if (branchName === '-d' || branchName === '-D') {
        const toDelete = args[1];
        if (!toDelete) {
          output = 'fatal: branch name required';
          status = 'error';
          break;
        }
        if (toDelete === state.currentBranch) {
          output = `error: Cannot delete branch '${toDelete}' checked out at working tree`;
          status = 'error';
          break;
        }
        const updatedBranches = { ...state.branches };
        delete updatedBranches[toDelete];
        newState = { ...state, branches: updatedBranches };
        output = `Deleted branch ${toDelete}.`;
        break;
      }

      if (state.branches[branchName]) {
        output = `fatal: A branch named '${branchName}' already exists.`;
        status = 'error';
        break;
      }

      const colors = ['#bc8cff', '#d29922', '#39c5cf', '#f85149', '#a371f7'];
      const chosenColor = colors[Object.keys(state.branches).length % colors.length];

      newState = {
        ...state,
        branches: {
          ...state.branches,
          [branchName]: {
            name: branchName,
            color: chosenColor,
            commitHash: state.headCommitHash || 'b3f810c',
            isRemoteTracking: false
          }
        }
      };
      output = `Created branch '${branchName}' pointing to ${state.headCommitHash?.slice(0, 7)}.`;
      break;
    }

    case 'switch':
    case 'checkout': {
      let branchName = args[0];
      let isCreate = false;

      if (branchName === '-c' || branchName === '-b') {
        isCreate = true;
        branchName = args[1];
      }

      if (!branchName) {
        output = `fatal: missing branch name`;
        status = 'error';
        break;
      }

      if (isCreate) {
        const colors = ['#bc8cff', '#d29922', '#39c5cf', '#f85149', '#a371f7'];
        const chosenColor = colors[Object.keys(state.branches).length % colors.length];

        newState = {
          ...state,
          currentBranch: branchName,
          branches: {
            ...state.branches,
            [branchName]: {
              name: branchName,
              color: chosenColor,
              commitHash: state.headCommitHash || 'b3f810c',
              isRemoteTracking: false
            }
          }
        };
        output = `Switched to a new branch '${branchName}'`;
        break;
      }

      if (!state.branches[branchName]) {
        output = `error: pathspec '${branchName}' did not match any file(s) known to git`;
        status = 'error';
        break;
      }

      newState = {
        ...state,
        currentBranch: branchName,
        headCommitHash: state.branches[branchName].commitHash
      };
      output = `Switched to branch '${branchName}'`;
      break;
    }

    case 'merge': {
      const targetBranch = args[0];
      if (!targetBranch) {
        output = 'fatal: No branch specified to merge.';
        status = 'error';
        break;
      }
      if (!state.branches[targetBranch]) {
        output = `merge: ${targetBranch} - not something we can merge`;
        status = 'error';
        break;
      }
      if (targetBranch === state.currentBranch) {
        output = `Already up to date. (Cannot merge branch into itself)`;
        break;
      }

      const targetHash = state.branches[targetBranch].commitHash;
      const currentHash = state.branches[state.currentBranch].commitHash;

      const mergeHash = randomHash();
      const mergeCommit: CommitNode = {
        hash: mergeHash,
        message: `Merge branch '${targetBranch}' into ${state.currentBranch}`,
        author: 'Alex Morgan <alex@dev.io>',
        timestamp: 'just now',
        parents: [currentHash, targetHash],
        branch: state.currentBranch,
        isRemote: false
      };

      newState = {
        ...state,
        commits: [...state.commits, mergeCommit],
        headCommitHash: mergeHash,
        branches: {
          ...state.branches,
          [state.currentBranch]: {
            ...state.branches[state.currentBranch],
            commitHash: mergeHash
          }
        }
      };

      output = `Merge made by the 'ort' strategy.\nMerged ${targetBranch} (${targetHash.slice(0, 7)}) into ${state.currentBranch}. New merge commit: ${mergeHash}`;
      break;
    }

    case 'rebase': {
      const baseBranch = args[0];
      if (!baseBranch || !state.branches[baseBranch]) {
        output = `fatal: invalid upstream '${baseBranch}'`;
        status = 'error';
        break;
      }

      const baseCommit = state.branches[baseBranch].commitHash;
      const rebasedHash = randomHash();
      const rebasedCommit: CommitNode = {
        hash: rebasedHash,
        message: `Rebased commits from ${state.currentBranch} onto ${baseBranch}`,
        author: 'Alex Morgan <alex@dev.io>',
        timestamp: 'just now',
        parents: [baseCommit],
        branch: state.currentBranch,
        isRemote: false
      };

      newState = {
        ...state,
        commits: [...state.commits, rebasedCommit],
        headCommitHash: rebasedHash,
        branches: {
          ...state.branches,
          [state.currentBranch]: {
            ...state.branches[state.currentBranch],
            commitHash: rebasedHash
          }
        }
      };
      output = `Successfully rebased and updated refs/heads/${state.currentBranch} on top of ${baseBranch}.`;
      break;
    }

    case 'push': {
      // Mark all local commits as remote
      const syncedCommits = state.commits.map(c => ({ ...c, isRemote: true }));
      newState = {
        ...state,
        commits: syncedCommits,
        remoteCommits: [...syncedCommits]
      };
      output = `Enumerating objects: 5, done.\nWriting objects: 100% (5/5), 450 bytes | 450.00 KiB/s, done.\nTotal 5 (delta 2), reused 0\nTo ${state.remoteUrl}\n   ${state.headCommitHash?.slice(0, 7)}..${state.headCommitHash}  ${state.currentBranch} -> ${state.currentBranch}`;
      break;
    }

    case 'pull': {
      output = `Already up to date. (Remote tracking branch origin/${state.currentBranch} merged).`;
      break;
    }

    case 'fetch': {
      output = `From ${state.remoteUrl}\n * [new branch]      main       -> origin/main\nUnpacking objects: 100% (3/3), done.`;
      break;
    }

    case 'stash': {
      const action = args[0] || 'push';
      if (action === 'push' || action === 'save' || !args[0]) {
        const dirtyFiles = state.workingFiles.filter(f => f.status === 'modified' || f.status === 'staged');
        if (dirtyFiles.length === 0) {
          output = 'No local changes to save';
          break;
        }

        const stashItem = {
          id: state.stashes.length,
          message: `WIP on ${state.currentBranch}: ${state.headCommitHash?.slice(0, 7)}`,
          files: dirtyFiles
        };

        const cleanFiles = state.workingFiles.filter(f => f.status !== 'modified' && f.status !== 'staged');

        newState = {
          ...state,
          stashes: [stashItem, ...state.stashes],
          workingFiles: cleanFiles
        };
        output = `Saved working directory and index state WIP on ${state.currentBranch}: ${state.headCommitHash?.slice(0, 7)}`;
      } else if (action === 'pop') {
        if (state.stashes.length === 0) {
          output = 'error: No stash entries found.';
          status = 'error';
          break;
        }
        const popped = state.stashes[0];
        const restored = [...state.workingFiles, ...popped.files];

        newState = {
          ...state,
          stashes: state.stashes.slice(1),
          workingFiles: restored
        };
        output = `On branch ${state.currentBranch}\nRestored changes from stash@{0}.\nDropped stash@{0} (${popped.message})`;
      } else if (action === 'list') {
        output = state.stashes.map((s, idx) => `stash@{${idx}}: ${s.message}`).join('\n') || 'No stashes found.';
        status = 'info';
      }
      break;
    }

    case 'reset': {
      const mode = args.includes('--hard') ? 'hard' : args.includes('--soft') ? 'soft' : 'mixed';
      const targetArg = args.find(a => !a.startsWith('-')) || 'HEAD';
      const target = targetArg === 'HEAD~1' ? state.commits[state.commits.length - 2] : state.commits.find(c => c.hash.startsWith(targetArg)) || state.commits[state.commits.length - 1];
      if (!target) { output = `fatal: ambiguous argument '${targetArg}'`; status = 'error'; break; }
      const resetFiles = mode === 'hard' ? state.workingFiles.map(f => ({ ...f, status: 'committed' as const })) : mode === 'mixed' ? state.workingFiles.map(f => f.status === 'staged' ? ({ ...f, status: 'modified' as const }) : f) : state.workingFiles;
      newState = { ...state, headCommitHash: target.hash, workingFiles: resetFiles, branches: { ...state.branches, [state.currentBranch]: { ...state.branches[state.currentBranch], commitHash: target.hash } } };
      output = `HEAD is now at ${target.hash.slice(0, 7)} ${target.message} (reset mode: --${mode})`;
      break;
    }

    case 'restore': {
      const stagedMode = args.includes('--staged');
      const target = args.find(a => !a.startsWith('-'));
      if (!target) { output = 'fatal: you must specify path(s) to restore'; status = 'error'; break; }
      let found = false;
      const files = state.workingFiles.map(f => {
        if (target === '.' || f.name === target) { found = true; return { ...f, status: stagedMode ? 'modified' as const : 'committed' as const }; }
        return f;
      });
      if (!found) { output = `error: pathspec '${target}' did not match any file(s) known to git`; status = 'error'; break; }
      newState = { ...state, workingFiles: files };
      output = stagedMode ? `Unstaged '${target}'. The working copy is preserved.` : `Restored '${target}' from HEAD. Uncommitted changes were discarded.`;
      break;
    }

    case 'remote': {
      const action = args[0];
      if (!action || action === '-v') { output = state.remoteUrl ? `origin\t${state.remoteUrl} (fetch)\norigin\t${state.remoteUrl} (push)` : ''; status = 'info'; break; }
      if (action === 'add') {
        if (args[1] !== 'origin' || !args[2]) { output = 'usage: git remote add origin <url>'; status = 'error'; break; }
        if (state.remoteUrl) { output = 'error: remote origin already exists.'; status = 'error'; break; }
        newState = { ...state, remoteUrl: args[2] }; output = `Remote 'origin' added: ${args[2]}`; break;
      }
      if (action === 'set-url' && args[1] === 'origin' && args[2]) { newState = { ...state, remoteUrl: args[2] }; output = `Updated origin to ${args[2]}`; break; }
      output = `error: unsupported remote action '${action}'`; status = 'error'; break;
    }

    case 'reflog': {
      output = state.commits.slice().reverse().map((c, i) => `${c.hash} HEAD@{${i}}: ${i ? 'commit' : 'commit (HEAD -> ' + state.currentBranch + ')'}: ${c.message}`).join('\n');
      status = 'info'; break;
    }

    case 'show': {
      const requested = args[0];
      const commit = requested ? state.commits.find(c => c.hash.startsWith(requested)) : state.commits[state.commits.length - 1];
      if (!commit) { output = `fatal: bad object ${requested}`; status = 'error'; break; }
      output = `commit ${commit.hash}\nAuthor: ${commit.author}\nDate: ${commit.timestamp}\n\n    ${commit.message}\n\n diff --git a/app.js b/app.js\n + simulated change`;
      status = 'info'; break;
    }

    case 'tag': {
      const name = args.find(a => !a.startsWith('-'));
      if (!name) { output = 'v1.0.0\nv1.1.0'; status = 'info'; break; }
      output = `Created tag '${name}' at ${state.headCommitHash?.slice(0, 7)}.`; break;
    }

    case 'cherry-pick': {
      const requested = args[0];
      const source = state.commits.find(c => c.hash.startsWith(requested || ''));
      if (!requested || !source) { output = `fatal: bad revision '${requested || ''}'`; status = 'error'; break; }
      const hash = randomHash();
      const picked = { ...source, hash, parents: state.headCommitHash ? [state.headCommitHash] : [], branch: state.currentBranch, timestamp: 'just now', isRemote: false };
      newState = { ...state, commits: [...state.commits, picked], headCommitHash: hash, branches: { ...state.branches, [state.currentBranch]: { ...state.branches[state.currentBranch], commitHash: hash } } };
      output = `[${state.currentBranch} ${hash}] ${source.message}\nCherry-picked ${source.hash}.`; break;
    }

    case 'clean': {
      const preview = args.includes('-n') || args.includes('--dry-run');
      const untracked = state.workingFiles.filter(f => f.status === 'untracked');
      if (!args.some(a => a.includes('f')) && !preview) { output = 'fatal: clean.requireForce defaults to true; use -n to preview or -f to remove'; status = 'error'; break; }
      output = untracked.map(f => `${preview ? 'Would remove' : 'Removing'} ${f.name}`).join('\n') || 'Nothing to clean.';
      if (!preview) newState = { ...state, workingFiles: state.workingFiles.filter(f => f.status !== 'untracked') };
      break;
    }

    case 'log': {
      const logLines = state.commits.slice(-5).reverse().map(c => {
        return `\x1b[33mcommit ${c.hash}\x1b[0m (${c.branch === state.currentBranch ? `\x1b[36mHEAD -> \x1b[32m${c.branch}\x1b[0m` : c.branch})\nAuthor: ${c.author}\nDate:   ${c.timestamp}\n\n    ${c.message}\n`;
      }).join('\n');
      output = logLines;
      status = 'info';
      break;
    }

    case 'diff': {
      output = `diff --git a/app.js b/app.js\n--- a/app.js\n+++ b/app.js\n@@ -12,3 +12,14 @@\n+\x1b[32m+export function authenticateUser(token) {\x1b[0m\n+\x1b[32m+  return verifyJwt(token);\x1b[0m\n+\x1b[32m+}\x1b[0m`;
      status = 'info';
      break;
    }

    default: {
      output = `git: '${subCmd}' is not a recognized demo command. Try: status, add, commit, restore, branch, switch, merge, rebase, push, pull, remote, stash, reset, reflog, show, tag, cherry-pick, clean, log, diff`;
      status = 'error';
    }
  }

  const finalHistory = [
    ...newState.terminalHistory,
    { command: trimmed, output, status }
  ];

  return {
    newState: {
      ...newState,
      terminalHistory: finalHistory.slice(-25) // keep last 25 commands
    },
    output,
    status
  };
}
