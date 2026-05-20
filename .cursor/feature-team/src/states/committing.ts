import { getCurrentIteration } from "../state-store";
import { fail, pass, type ConcreteStateDefinition } from "../types";

export const committingState: ConcreteStateDefinition = {
  emoji: "COMMIT",
  canTransitionTo: ["DEVELOPING", "COMPLETE", "BLOCKED"],
  transitionGuard: (ctx) => {
    const current = getCurrentIteration(ctx.state);
    if (!current) {
      return fail("No active iteration to commit.");
    }

    if (!current.reviewApproved) {
      return fail("Review must be approved before committing.");
    }

    return pass();
  },
};
