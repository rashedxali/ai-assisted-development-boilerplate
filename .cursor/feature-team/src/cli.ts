#!/usr/bin/env bun

import { getGitInfo } from "./git";
import { canTransition, getStateDefinition } from "./registry";
import {
  createEmptyIteration,
  type FeatureTeamState,
  type WorkflowStateName,
  workflowStateNames,
} from "./state-schema";
import {
  getCurrentIteration,
  initState,
  readState,
  updateState,
  writeState,
} from "./state-store";
import type { TransitionContext } from "./types";

function usage(): never {
  console.error(`Usage: bun .cursor/feature-team/src/cli.ts <command> [args]

Commands:
  init [--idempotent]              Initialize workflow state
  inspect [--json]                 Print current state
  transition <STATE>               Transition to a workflow state
  approve-plan <markdown>          Approve the current plan
  set-branch <name>                Set feature branch name
  set-task <task>                  Set task for current iteration
  signal-done [--linted-files f1,f2]  Developer signals completion
  signal-review <APPROVED|REJECTED> [--reasons "r1;r2"]
  record-event <op> [--detail json]   Append to event log
`);
  process.exit(1);
}

function nowIso(): string {
  return new Date().toISOString();
}

function appendEvent(
  state: FeatureTeamState,
  op: string,
  detail: Record<string, unknown>,
): FeatureTeamState {
  return {
    ...state,
    eventLog: [
      ...state.eventLog,
      {
        op,
        at: nowIso(),
        detail,
      },
    ],
  };
}

function ensureIteration(state: FeatureTeamState, task = ""): FeatureTeamState {
  const current = getCurrentIteration(state);
  if (current) {
    return state;
  }

  const nextIteration = createEmptyIteration(task);
  return {
    ...state,
    iterations: [...state.iterations, nextIteration],
    iteration: state.iterations.length,
  };
}

function prepareReviewRejection(state: FeatureTeamState): FeatureTeamState {
  const current = getCurrentIteration(state);
  if (!current) {
    throw new Error("No active iteration to reject.");
  }

  const nextIndex = state.iteration + 1;
  const nextIteration = createEmptyIteration(
    `Address review feedback: ${current.rejectionReasons.join("; ") || "See reviewer notes"}`,
  );

  return {
    ...state,
    iteration: nextIndex,
    iterations: [...state.iterations, nextIteration],
  };
}

function runTransition(target: WorkflowStateName): FeatureTeamState {
  const current = readState();
  if (!current) {
    throw new Error("State not initialized.");
  }

  const from = current.state;
  if (from === target) {
    throw new Error(`Already in state ${target}.`);
  }

  if (!canTransition(from, target)) {
    throw new Error(`Transition ${from} -> ${target} is not allowed.`);
  }

  const gitInfo = getGitInfo();
  const ctx: TransitionContext = { state: current, gitInfo, from, to: target };
  const guard = getStateDefinition(target).transitionGuard(ctx);
  if (!guard.ok) {
    throw new Error(guard.reason);
  }

  let next = { ...current, state: target };

  if (target === "DEVELOPING") {
    if (from === "REVIEWING") {
      const current = getCurrentIteration(next);
      if (!current?.reviewRejected) {
        throw new Error(
          "Cannot return to DEVELOPING from REVIEWING without a rejected review.",
        );
      }
      next = prepareReviewRejection(next);
    } else if (from === "COMMITTING") {
      const nextIndex = next.iteration + 1;
      next = {
        ...next,
        iteration: nextIndex,
        iterations: [...next.iterations, createEmptyIteration()],
      };
    } else {
      next = ensureIteration(next);
    }
  }

  if (target === "REVIEWING" && from === "DEVELOPING") {
    const iteration = getCurrentIteration(next);
    if (iteration) {
      const iterations = [...next.iterations];
      iterations[next.iteration] = {
        ...iteration,
        developingHeadCommit: gitInfo.headCommit || iteration.developingHeadCommit,
      };
      next = { ...next, iterations };
    }
  }

  next = appendEvent(next, "transition", { from, to: target });
  writeState(next);
  return next;
}

function parseStateName(value: string): WorkflowStateName {
  const upper = value.toUpperCase();
  if (!(workflowStateNames as readonly string[]).includes(upper)) {
    throw new Error(`Unknown state: ${value}`);
  }
  return upper as WorkflowStateName;
}

function cmdInit(args: string[]): void {
  const idempotent = args.includes("--idempotent");
  const state = initState(idempotent);
  console.log(JSON.stringify({ ok: true, state: state.state }, null, 2));
}

function cmdInspect(args: string[]): void {
  const state = readState();
  if (!state) {
    throw new Error("State not initialized.");
  }

  if (args.includes("--json")) {
    console.log(JSON.stringify(state, null, 2));
    return;
  }

  const current = getCurrentIteration(state);
  console.log(`state: ${state.state}`);
  console.log(`iteration: ${state.iteration}`);
  console.log(`featureBranch: ${state.featureBranch ?? "(unset)"}`);
  console.log(`userApprovedPlan: ${state.userApprovedPlan}`);
  if (current) {
    console.log(`task: ${current.task || "(unset)"}`);
    console.log(`developerDone: ${current.developerDone}`);
    console.log(`reviewApproved: ${current.reviewApproved}`);
    console.log(`reviewRejected: ${current.reviewRejected}`);
    console.log(`lintRanIteration: ${current.lintRanIteration}`);
  }
}

function cmdApprovePlan(plan: string): void {
  updateState((state) =>
    appendEvent(
      {
        ...state,
        plan,
        userApprovedPlan: true,
      },
      "approve-plan",
      { planLength: plan.length },
    ),
  );
  console.log(JSON.stringify({ ok: true }, null, 2));
}

function cmdSetBranch(branch: string): void {
  if (branch === "main" || branch === "master") {
    throw new Error("Feature branch cannot be main or master.");
  }

  updateState((state) =>
    appendEvent({ ...state, featureBranch: branch }, "set-branch", { branch }),
  );
  console.log(JSON.stringify({ ok: true, branch }, null, 2));
}

function cmdSetTask(task: string): void {
  updateState((state) => {
    let next = ensureIteration(state, task);
    const current = getCurrentIteration(next);
    if (!current) {
      throw new Error("Failed to create iteration.");
    }

    const iterations = [...next.iterations];
    iterations[next.iteration] = {
      ...current,
      task,
      developerDone: false,
      reviewApproved: false,
      reviewRejected: false,
      rejectionReasons: [],
      lintRanIteration: false,
      lintedFiles: [],
    };

    next = { ...next, iterations };
    return appendEvent(next, "set-task", { task });
  });
  console.log(JSON.stringify({ ok: true, task }, null, 2));
}

function cmdSignalDone(args: string[]): void {
  const lintedFilesArg = args.find((arg) => arg.startsWith("--linted-files="));
  const lintedFiles =
    lintedFilesArg?.slice("--linted-files=".length).split(",").filter(Boolean) ??
    [];

  updateState((state) => {
    const current = getCurrentIteration(state);
    if (!current) {
      throw new Error("No active iteration.");
    }

    const iterations = [...state.iterations];
    iterations[state.iteration] = {
      ...current,
      developerDone: true,
      lintRanIteration: true,
      lintedFiles,
    };

    return appendEvent(
      { ...state, iterations },
      "signal-done",
      { lintedFiles },
    );
  });
  console.log(JSON.stringify({ ok: true }, null, 2));
}

function cmdSignalReview(args: string[]): void {
  const verdict = args[0]?.toUpperCase();
  if (verdict !== "APPROVED" && verdict !== "REJECTED") {
    throw new Error("Verdict must be APPROVED or REJECTED.");
  }

  const reasonsArg = args.find((arg) => arg.startsWith("--reasons="));
  const reasons =
    reasonsArg?.slice("--reasons=".length).split(";").filter(Boolean) ?? [];

  updateState((state) => {
    const current = getCurrentIteration(state);
    if (!current) {
      throw new Error("No active iteration.");
    }

    const iterations = [...state.iterations];
    iterations[state.iteration] = {
      ...current,
      reviewApproved: verdict === "APPROVED",
      reviewRejected: verdict === "REJECTED",
      rejectionReasons: verdict === "REJECTED" ? reasons : [],
    };

    return appendEvent(
      { ...state, iterations },
      "signal-review",
      { verdict, reasons },
    );
  });
  console.log(JSON.stringify({ ok: true, verdict }, null, 2));
}

function cmdRecordEvent(args: string[]): void {
  const op = args[0];
  if (!op) {
    throw new Error("Event op is required.");
  }

  const detailArg = args.find((arg) => arg.startsWith("--detail="));
  const detail = detailArg
    ? (JSON.parse(detailArg.slice("--detail=".length)) as Record<string, unknown>)
    : {};

  updateState((state) => appendEvent(state, op, detail));
  console.log(JSON.stringify({ ok: true }, null, 2));
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);
  if (!command) {
    usage();
  }

  try {
    switch (command) {
      case "init":
        cmdInit(args);
        break;
      case "inspect":
        cmdInspect(args);
        break;
      case "transition":
        if (!args[0]) {
          throw new Error("Target state is required.");
        }
        console.log(
          JSON.stringify(
            { ok: true, state: runTransition(parseStateName(args[0])) },
            null,
            2,
          ),
        );
        break;
      case "approve-plan":
        if (!args[0]) {
          throw new Error("Plan markdown is required.");
        }
        cmdApprovePlan(args.join(" "));
        break;
      case "set-branch":
        if (!args[0]) {
          throw new Error("Branch name is required.");
        }
        cmdSetBranch(args[0]);
        break;
      case "set-task":
        if (!args[0]) {
          throw new Error("Task description is required.");
        }
        cmdSetTask(args.join(" "));
        break;
      case "signal-done":
        cmdSignalDone(args);
        break;
      case "signal-review":
        cmdSignalReview(args);
        break;
      case "record-event":
        cmdRecordEvent(args);
        break;
      default:
        usage();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ ok: false, error: message }, null, 2));
    process.exit(1);
  }
}

main();
