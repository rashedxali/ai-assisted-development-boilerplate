import { fail, pass, type ConcreteStateDefinition } from "../types";

export const developingState: ConcreteStateDefinition = {
  emoji: "DEV",
  canTransitionTo: ["REVIEWING", "BLOCKED"],
  transitionGuard: (ctx) => {
    if (!ctx.state.userApprovedPlan) {
      return fail("Plan must be approved before developing.");
    }

    if (!ctx.state.featureBranch) {
      return fail("Feature branch must be set before developing.");
    }

    if (ctx.state.featureBranch === "main") {
      return fail("Feature branch cannot be main.");
    }

    if (ctx.from === "COMMITTING" && !ctx.gitInfo.workingTreeClean) {
      return fail("Working tree must be clean before starting a new iteration.");
    }

    return pass();
  },
};
