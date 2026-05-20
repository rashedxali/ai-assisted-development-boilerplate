import type { WorkflowStateName } from "./state-schema";
import { blockedState } from "./states/blocked";
import { committingState } from "./states/committing";
import { completeState } from "./states/complete";
import { developingState } from "./states/developing";
import { planningState } from "./states/planning";
import { reviewingState } from "./states/reviewing";
import type { ConcreteStateDefinition } from "./types";

const registry: Record<WorkflowStateName, ConcreteStateDefinition> = {
  PLANNING: planningState,
  DEVELOPING: developingState,
  REVIEWING: reviewingState,
  COMMITTING: committingState,
  BLOCKED: blockedState,
  COMPLETE: completeState,
};

export function getStateDefinition(
  name: WorkflowStateName,
): ConcreteStateDefinition {
  return registry[name];
}

export function canTransition(
  from: WorkflowStateName,
  to: WorkflowStateName,
): boolean {
  return getStateDefinition(from).canTransitionTo.includes(to);
}
