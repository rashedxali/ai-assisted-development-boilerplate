#!/usr/bin/env bun

import { getWorkflowState, readHookInput, writeHookOutput } from "./shared";

type PreToolUseInput = {
  tool_name?: string;
  tool_input?: {
    command?: string;
  };
};

const input = await readHookInput<PreToolUseInput>();
const workflowState = getWorkflowState();

if (
  workflowState &&
  (workflowState === "DEVELOPING" || workflowState === "REVIEWING") &&
  input.tool_name === "Shell"
) {
  const command = input.tool_input?.command ?? "";
  if (/^\s*git\s+commit\b/.test(command)) {
    writeHookOutput({
      permission: "deny",
      user_message: `git commit blocked during ${workflowState}. Commits happen in COMMITTING state only.`,
      agent_message: `You cannot commit during ${workflowState}. Spawn the appropriate subagent or transition state first. Commits are allowed only in COMMITTING state after review approval.`,
    });
    process.exit(0);
  }
}

writeHookOutput({ permission: "allow" });
