#!/usr/bin/env bun

import { getWorkflowState, readHookInput, writeHookOutput } from "./shared";

type StopInput = {
  status?: string;
  loop_count?: number;
};

await readHookInput<StopInput>();

const workflowState = getWorkflowState();
const allowedStopStates = new Set(["BLOCKED", "COMPLETE"]);

if (workflowState && !allowedStopStates.has(workflowState)) {
  writeHookOutput({
    followup_message: `[Workflow enforcement] You cannot stop while in ${workflowState}. Transition to BLOCKED (if you need the user) or COMPLETE (if finished) using: bun run feature-team transition <STATE>. Then summarize status for the user.`,
  });
  process.exit(0);
}

writeHookOutput({});
