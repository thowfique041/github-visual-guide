export type GitCategory = 
  | 'basic'
  | 'branching'
  | 'remote'
  | 'undo'
  | 'collaboration'
  | 'advanced';

export type GitDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CommandItem {
  id: string;
  name: string;
  category: GitCategory;
  difficulty: GitDifficulty;
  syntax: string;
  shortDesc: string;
  longDesc: string;
  example: string;
  commonMistakes: string[];
  relatedCommands: string[];
  beforeState: {
    title: string;
    description: string;
    diagramType?: 'three-area' | 'branch' | 'remote' | 'stash' | 'conflict' | 'rebase';
  };
  afterState: {
    title: string;
    description: string;
    diagramType?: 'three-area' | 'branch' | 'remote' | 'stash' | 'conflict' | 'rebase';
  };
  visualSteps?: string[];
  tags: string[];
  interactiveDemoType?: 'add' | 'commit' | 'push' | 'pull' | 'fetch' | 'merge' | 'rebase' | 'reset' | 'revert' | 'stash' | 'conflict' | 'branch' | 'cherry-pick';
}

export type FileStatus = 'untracked' | 'modified' | 'staged' | 'committed';

export interface SimulatedFile {
  name: string;
  status: FileStatus;
  linesAdded?: number;
  linesRemoved?: number;
  content?: string;
}

export interface CommitNode {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  parents: string[];
  branch: string;
  isRemote?: boolean;
}

export interface BranchInfo {
  name: string;
  color: string;
  commitHash: string;
  isRemoteTracking?: boolean;
}

export interface GitEngineState {
  isInitialized: boolean;
  workingFiles: SimulatedFile[];
  commits: CommitNode[];
  branches: Record<string, BranchInfo>;
  currentBranch: string;
  headCommitHash: string | null;
  remoteCommits: CommitNode[];
  remoteBranch: string;
  remoteUrl: string | null;
  stashes: { id: number; message: string; files: SimulatedFile[] }[];
  lastCommand: string | null;
  terminalHistory: { command: string; output: string; status: 'ok' | 'error' | 'info' }[];
}

export interface QuizScenario {
  id: string;
  title: string;
  scenario: string;
  difficulty: GitDifficulty;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  category: GitCategory;
}
