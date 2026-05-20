import type { FeatureTeamState, WorkflowStateName } from "./state-schema";

export type PreconditionResult =
  | { ok: true }
  | { ok: false; reason: string };

export type GitInfo = {
  workingTreeClean: boolean;
  currentBranch: string;
  hasCommitsVsDefault: boolean;
  headCommit: string;
  defaultBranch: string;
};

export type TransitionContext = {
  state: FeatureTeamState;
  gitInfo: GitInfo;
  from: WorkflowStateName;
  to: WorkflowStateName;
};

export type ConcreteStateDefinition = {
  emoji: string;
  canTransitionTo: WorkflowStateName[];
  transitionGuard: (ctx: TransitionContext) => PreconditionResult;
};

export function pass(): PreconditionResult {
  return { ok: true };
}

export function fail(reason: string): PreconditionResult {
  return { ok: false, reason };
}
