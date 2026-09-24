import { QuizScenario } from '../types/git';

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 'quiz-1',
    title: 'Preparing Modified Files',
    category: 'basic',
    difficulty: 'beginner',
    scenario: 'You modified `app.js` and created `styles.css`. You want to prepare both files so they are included in the upcoming commit.',
    question: 'What is the standard command to stage your modified files?',
    options: [
      {
        id: 'opt-a',
        text: 'git push',
        isCorrect: false,
        explanation: 'git push uploads existing commits to a remote server like GitHub. It does not stage modified local files.'
      },
      {
        id: 'opt-b',
        text: 'git add app.js styles.css',
        isCorrect: true,
        explanation: 'git add copies working directory changes into the Staging Area (index), preparing them to be committed.'
      },
      {
        id: 'opt-c',
        text: 'git clone app.js',
        isCorrect: false,
        explanation: 'git clone copies an entire remote repository from a server, not staging local files.'
      },
      {
        id: 'opt-d',
        text: 'git fetch',
        isCorrect: false,
        explanation: 'git fetch downloads commits from remote tracking branches without altering your local files.'
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Fast & Safe Branch Creation',
    category: 'branching',
    difficulty: 'beginner',
    scenario: 'You want to start working on a new feature called "dark-mode". You want to create the branch and immediately switch into it in a single step.',
    question: 'Which modern command accomplishes this directly?',
    options: [
      {
        id: 'opt-a',
        text: 'git switch -c dark-mode',
        isCorrect: true,
        explanation: 'git switch -c <name> creates the branch and immediately checks it out. Alternatively, git checkout -b <name> does the same.'
      },
      {
        id: 'opt-b',
        text: 'git branch dark-mode',
        isCorrect: false,
        explanation: 'git branch dark-mode creates the pointer, but you remain standing on your current branch!'
      },
      {
        id: 'opt-c',
        text: 'git merge dark-mode',
        isCorrect: false,
        explanation: 'git merge combines branches; it does not create a new one.'
      },
      {
        id: 'opt-d',
        text: 'git remote add dark-mode',
        isCorrect: false,
        explanation: 'git remote add configures a remote URL connection, not a local branch.'
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'Pull vs Fetch Distinction',
    category: 'remote',
    difficulty: 'intermediate',
    scenario: 'A coworker pushed commits to the remote `main` branch. You want to see their commits locally without altering your currently edited workspace files.',
    question: 'Which command should you execute?',
    options: [
      {
        id: 'opt-a',
        text: 'git pull origin main',
        isCorrect: false,
        explanation: 'git pull immediately tries to merge changes into your working directory, which might cause unexpected conflicts.'
      },
      {
        id: 'opt-b',
        text: 'git fetch origin',
        isCorrect: true,
        explanation: 'git fetch safely downloads new commits and updates origin/main tracking branches without touching your local branch or working tree!'
      },
      {
        id: 'opt-c',
        text: 'git push origin main',
        isCorrect: false,
        explanation: 'git push will be rejected because your local branch is behind the remote.'
      },
      {
        id: 'opt-d',
        text: 'git rebase --abort',
        isCorrect: false,
        explanation: 'git rebase --abort stops an ongoing rebase; it has nothing to do with downloading remote updates.'
      }
    ]
  },
  {
    id: 'quiz-4',
    title: 'Safe Undo on Shared Public Branches',
    category: 'undo',
    difficulty: 'intermediate',
    scenario: 'You pushed a commit to GitHub that contained a critical bug. The commit is already live on `main` where others have pulled it. You need to undo its changes safely.',
    question: 'What is the recommended, non-destructive way to undo that commit?',
    options: [
      {
        id: 'opt-a',
        text: 'git reset --hard HEAD~1 followed by git push -f',
        isCorrect: false,
        explanation: 'Force pushing rewritten history to a shared branch rewinds others\' history and wreaks havoc for your teammates!'
      },
      {
        id: 'opt-b',
        text: 'git revert <commit-hash>',
        isCorrect: true,
        explanation: 'git revert creates a brand new forward commit that applies the inverse diff, cleanly preserving history and allowing safe pushing.'
      },
      {
        id: 'opt-c',
        text: 'git clean -fd',
        isCorrect: false,
        explanation: 'git clean deletes untracked files in your working directory; it does not undo committed history.'
      },
      {
        id: 'opt-d',
        text: 'git stash drop',
        isCorrect: false,
        explanation: 'git stash drop discards a stashed change; it does not touch repository commits.'
      }
    ]
  },
  {
    id: 'quiz-5',
    title: 'Emergency Context Switch',
    category: 'undo',
    difficulty: 'beginner',
    scenario: 'You are halfway through coding a feature when a critical production bug emerges. You need to switch branches immediately without committing half-finished code.',
    question: 'How do you temporarily shelve your uncommitted work?',
    options: [
      {
        id: 'opt-a',
        text: 'git stash',
        isCorrect: true,
        explanation: 'git stash saves your dirty working tree and staging changes onto a temporary stack, leaving your directory pristine so you can switch branches.'
      },
      {
        id: 'opt-b',
        text: 'git restore .',
        isCorrect: false,
        explanation: 'git restore . will permanently destroy and discard all your uncommitted work!'
      },
      {
        id: 'opt-c',
        text: 'git rm -rf *',
        isCorrect: false,
        explanation: 'This removes all project files from tracking and disk.'
      },
      {
        id: 'opt-d',
        text: 'git bisect start',
        isCorrect: false,
        explanation: 'git bisect is used for debugging bug regressions via binary search.'
      }
    ]
  },
  {
    id: 'quiz-6',
    title: 'Merge Conflict Markers',
    category: 'collaboration',
    difficulty: 'intermediate',
    scenario: 'You ran `git merge feature` and Git reported "CONFLICT (content): Merge conflict in server.js". Inside the file you see `<<<<<<< HEAD` and `>>>>>>> feature`.',
    question: 'What does `<<<<<<< HEAD` signify?',
    options: [
      {
        id: 'opt-a',
        text: 'The incoming changes from the feature branch that was being merged in.',
        isCorrect: false,
        explanation: 'The incoming changes are marked below the ======= line up to >>>>>>> feature.'
      },
      {
        id: 'opt-b',
        text: 'The current version of code on your currently checked-out branch before merging.',
        isCorrect: true,
        explanation: 'HEAD represents the state of your currently active branch where you initiated the merge.'
      },
      {
        id: 'opt-c',
        text: 'A syntax error in your JavaScript interpreter.',
        isCorrect: false,
        explanation: 'These are Git conflict resolution markers inserted directly by Git.'
      },
      {
        id: 'opt-d',
        text: 'The remote copy on GitHub.',
        isCorrect: false,
        explanation: 'HEAD points to the local current branch ref.'
      }
    ]
  },
  {
    id: 'quiz-7',
    title: 'Linear History Without Merge Bubbles',
    category: 'advanced',
    difficulty: 'advanced',
    scenario: 'You want your branch commits to appear directly on top of the newest commits from `main`, without creating an extra merge commit node.',
    question: 'Which operation rewrites your branch commits on top of the target branch?',
    options: [
      {
        id: 'opt-a',
        text: 'git merge main',
        isCorrect: false,
        explanation: 'git merge creates a 3-way merge commit with two parents.'
      },
      {
        id: 'opt-b',
        text: 'git rebase main',
        isCorrect: true,
        explanation: 'git rebase rewinds your branch, replays your unique commits one by one on top of main, creating a perfectly linear history.'
      },
      {
        id: 'opt-c',
        text: 'git cherry-pick main',
        isCorrect: false,
        explanation: 'cherry-pick takes a specific commit hash, not an entire branch rebase.'
      },
      {
        id: 'opt-d',
        text: 'git reset --mixed main',
        isCorrect: false,
        explanation: 'This shifts your branch pointer to main and unstages your changes without replaying commit history.'
      }
    ]
  }
];
