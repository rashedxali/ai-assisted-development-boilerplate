#!/usr/bin/env bun
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as p from "@clack/prompts";
import {
  applyFeatures,
  assertCanSetup,
  getDefaultSelections,
  hasYesFlag,
  parseFeatureFlags,
  pinResolvableVersions,
  promptFeatureSelection,
  summarizeSelections,
  type FeatureSelection,
} from "@agent-driven/setup-engine";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const argv = process.argv.slice(2);

async function main(): Promise<void> {
  const force = argv.includes("--force");
  const yes = hasYesFlag(argv);
  const flagOverrides = parseFeatureFlags(argv);

  p.intro("Agent-Driven Development — project setup");

  try {
    await assertCanSetup(repoRoot, force);
  } catch (error) {
    p.log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!force) {
    p.log.warn(
      "Declining a feature removes its files and dependencies from this repo.",
    );
  }

  const defaults = {
    ...getDefaultSelections(),
    ...flagOverrides,
  } as FeatureSelection;

  const selections = await promptFeatureSelection({
    defaults,
    yes,
  });

  p.log.info(summarizeSelections(selections));

  const s = p.spinner();
  s.start("Applying feature selections…");

  await applyFeatures({
    targetDir: repoRoot,
    repoRoot,
    selections,
    force,
  });

  await pinResolvableVersions(repoRoot);

  s.stop("Setup complete.");

  p.note(
    [
      "Next steps:",
      "  1. bun install   (or npm install) — refresh lockfile after dependency changes",
      "  2. bun dev       — start the dev server",
      selections.storybook ? "  3. bun run storybook — open component stories" : "",
      selections.sentry ? "  3. Copy addons/sentry/.env.example values to .env.local" : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "Done",
  );

  p.outro("Happy building!");
}

main().catch((error) => {
  p.log.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
