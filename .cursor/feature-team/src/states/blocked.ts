import { pass, type ConcreteStateDefinition } from "../types";

export const blockedState: ConcreteStateDefinition = {
  emoji: "BLOCK",
  canTransitionTo: ["PLANNING", "DEVELOPING", "REVIEWING", "COMMITTING"],
  transitionGuard: () => pass(),
};
