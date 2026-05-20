#!/usr/bin/env bun

import {
  getWorkflowState,
  loadStateProcedure,
  readHookInput,
  writeHookOutput,
} from "./shared";

await readHookInput<Record<string, unknown>>();

const workflowState = getWorkflowState();
if (!workflowState) {
  writeHookOutput({});
  process.exit(0);
}

const procedure = loadStateProcedure(workflowState);
writeHookOutput({
  additional_context: `# Current workflow procedure (${workflowState})\n\n${procedure}`,
});
