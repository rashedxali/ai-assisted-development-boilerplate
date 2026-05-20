import { getCurrentIteration } from "../state-store";
import { fail, pass, type ConcreteStateDefinition } from "../types";

export const completeState: ConcreteStateDefinition = {
  emoji: "DONE",
  canTransitionTo: [],
  transitionGuard: (ctx) => {
    const current = getCurrentIteration(ctx.state);
    if (!ctx.gitInfo.workingTreeClean) {
      return fail("Uncommitted changes detected.");
    }

    if (current && !current.lintRanIteration) {
      return fail("Lint not run this iteration.");
    }

    if (!ctx.gitInfo.hasCommitsVsDefault) {
      return fail("No commits beyond default branch.");
    }

    return pass();
  },
};
