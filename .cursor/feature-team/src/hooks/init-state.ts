#!/usr/bin/env bun

import { initState } from "../state-store";
import { getAgentPromptPath } from "../paths";
import fs from "node:fs";
import { getWorkflowState, loadStateProcedure, readHookInput, writeHookOutput } from "./shared";

type SessionStartInput = {
  session_id?: string;
};

const input = await readHookInput<SessionStartInput>();
initState(true);

const workflowState = getWorkflowState() ?? "PLANNING";
const leadPath = getAgentPromptPath("lead");
const leadPrompt = fs.existsSync(leadPath)
  ? fs.readFileSync(leadPath, "utf8")
  : "";
const procedure = loadStateProcedure(workflowState);

writeHookOutput({
  env: {
    FEATURE_TEAM_SESSION_ID: input.session_id ?? "local",
  },
  additional_context: `# Feature Team Workflow\n\n${leadPrompt}\n\n---\n\n${procedure}`,
});
