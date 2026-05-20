import { getCurrentIteration } from "../state-store";
import { fail, pass, type ConcreteStateDefinition } from "../types";

export const reviewingState: ConcreteStateDefinition = {
  emoji: "REV",
  canTransitionTo: ["COMMITTING", "DEVELOPING", "BLOCKED"],
  transitionGuard: (ctx) => {
    const current = getCurrentIteration(ctx.state);
    if (!current) {
      return fail("No active iteration to review.");
    }

    if (!current.developerDone) {
      return fail("Developer has not signalled done for this iteration.");
    }

    if (!current.lintRanIteration) {
      return fail("Lint has not been run this iteration.");
    }

    return pass();
  },
};
