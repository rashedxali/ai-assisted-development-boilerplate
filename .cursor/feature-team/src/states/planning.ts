import { pass, type ConcreteStateDefinition } from "../types";

export const planningState: ConcreteStateDefinition = {
  emoji: "PLAN",
  canTransitionTo: ["DEVELOPING", "BLOCKED"],
  transitionGuard: () => pass(),
};
