#!/usr/bin/env bun

import { getGitInfo } from "../git";
import { readHookInput, writeHookOutput } from "./shared";

type BeforeShellInput = {
  command?: string;
};

const input = await readHookInput<BeforeShellInput>();
const command = input.command ?? "";
const gitInfo = getGitInfo();

if (/\bgit\s+push\b/.test(command) && /\bmain\b/.test(command)) {
  writeHookOutput({
    permission: "deny",
    user_message: "Direct push to main is not allowed. Use a feature branch and open a PR.",
    agent_message:
      "Push to main is forbidden. Commit on the feature branch and push that branch instead.",
  });
  process.exit(0);
}

if (/\bgit\s+commit\b/.test(command) && gitInfo.currentBranch === "main") {
  writeHookOutput({
    permission: "deny",
    user_message: "Direct commits on main are not allowed.",
    agent_message: "Create a feature branch before committing.",
  });
  process.exit(0);
}

if (/\bgit\s+merge\b/.test(command) && gitInfo.currentBranch === "main") {
  writeHookOutput({
    permission: "deny",
    user_message: "Direct merge into main is not allowed. Merge via pull request.",
    agent_message: "Do not merge into main locally. Use a PR on the platform.",
  });
  process.exit(0);
}

writeHookOutput({ permission: "allow" });
