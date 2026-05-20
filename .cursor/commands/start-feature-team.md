# Start Feature Team

Initialize the hook-driven feature team workflow and act as the **Lead** agent.

Read and follow:

- `.cursor/feature-team/agents/lead.md`
- Current state procedure (from `bun run feature-team inspect`)

## First steps

```bash
bun run feature-team init --idempotent
bun run feature-team inspect
```

Then follow the procedure for the current workflow state. Never write or review code yourself — spawn developer and reviewer subprocesses when required.

Use `bun run feature-team transition <STATE>` as the only way to change workflow state.
