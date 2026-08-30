import { chmod } from "node:fs/promises";
import { join } from "node:path";
import type { BoilerplateMarker, SetupOptions } from "./types.js";
import { FEATURES } from "./features.js";
import {
  copyAddonPaths,
  pathExists,
  readTextFile,
  removePath,
  writeTextFile,
} from "./utils.js";
import {
  generateEnvConfig,
  generateEslintConfig,
  generateGitignore,
  generateNextConfig,
  generateTsConfig,
} from "./config-generators.js";

const MARKER_FILE = ".boilerplate.json";

type PackageJson = {
  name?: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

export async function readMarker(
  targetDir: string,
): Promise<BoilerplateMarker | null> {
  const content = await readTextFile(join(targetDir, MARKER_FILE));
  if (!content) return null;
  return JSON.parse(content) as BoilerplateMarker;
}

export async function writeMarker(
  targetDir: string,
  marker: BoilerplateMarker,
): Promise<void> {
  await writeTextFile(
    join(targetDir, MARKER_FILE),
    `${JSON.stringify(marker, null, 2)}\n`,
  );
}

async function readPackageJson(targetDir: string): Promise<PackageJson> {
  const content = await readTextFile(join(targetDir, "package.json"));
  if (!content) throw new Error("package.json not found");
  return JSON.parse(content) as PackageJson;
}

async function writePackageJson(
  targetDir: string,
  pkg: PackageJson,
): Promise<void> {
  await writeTextFile(
    join(targetDir, "package.json"),
    `${JSON.stringify(pkg, null, 2)}\n`,
  );
}

function removeDeps(
  pkg: PackageJson,
  deps: Record<string, string> | undefined,
  field: "dependencies" | "devDependencies",
): void {
  if (!deps) return;
  const target = pkg[field];
  if (!target) return;
  for (const name of Object.keys(deps)) {
    delete target[name];
  }
  if (Object.keys(target).length === 0) {
    delete pkg[field];
  }
}

function addDeps(
  pkg: PackageJson,
  deps: Record<string, string> | undefined,
  field: "dependencies" | "devDependencies",
): void {
  if (!deps) return;
  if (!pkg[field]) pkg[field] = {};
  Object.assign(pkg[field]!, deps);
}

export async function applyFeatures(options: SetupOptions): Promise<void> {
  const { targetDir, selections } = options;
  const repoRoot = options.repoRoot ?? targetDir;
  const pkg = await readPackageJson(targetDir);

  for (const feature of FEATURES) {
    const enabled = selections[feature.id];

    if (feature.kind === "subtract") {
      if (!enabled) {
        for (const relPath of feature.paths ?? []) {
          await removePath(join(targetDir, relPath));
        }
        removeDeps(pkg, feature.dependencies, "dependencies");
        removeDeps(pkg, feature.devDependencies, "devDependencies");
        for (const key of feature.scriptKeys ?? []) {
          delete pkg.scripts?.[key];
        }
      } else {
        addDeps(pkg, feature.dependencies, "dependencies");
        addDeps(pkg, feature.devDependencies, "devDependencies");
        if (feature.scripts) {
          if (!pkg.scripts) pkg.scripts = {};
          Object.assign(pkg.scripts, feature.scripts);
        }
        if (feature.addonPaths?.length) {
          await copyAddonPaths(
            join(repoRoot, "addons", feature.id),
            targetDir,
            feature.addonPaths,
          );
        }
      }
    }

    if (feature.kind === "add") {
      if (enabled) {
        const addonRoot = join(repoRoot, "addons", feature.id);
        if (feature.addonPaths?.length) {
          await copyAddonPaths(addonRoot, targetDir, feature.addonPaths);
        }
        addDeps(pkg, feature.dependencies, "dependencies");
        addDeps(pkg, feature.devDependencies, "devDependencies");
        if (feature.scripts) {
          if (!pkg.scripts) pkg.scripts = {};
          Object.assign(pkg.scripts, feature.scripts);
        }
      } else {
        for (const relPath of feature.addonPaths ?? []) {
          await removePath(join(targetDir, relPath));
        }
        removeDeps(pkg, feature.dependencies, "dependencies");
        removeDeps(pkg, feature.devDependencies, "devDependencies");
        for (const key of Object.keys(feature.scripts ?? {})) {
          delete pkg.scripts?.[key];
        }
      }
    }
  }

  // Lighthouse off → also remove the GitHub workflow even if github-ci is on
  if (!selections.lighthouse) {
    await removePath(join(targetDir, ".github/workflows/lighthouse.yml"));
  }

  // GitHub CI off → remove entire workflows folder
  if (!selections["github-ci"]) {
    await removePath(join(targetDir, ".github/workflows"));
    await removePath(join(targetDir, ".github"));
  }

  if (selections.husky) {
    await patchHuskyPrePush(targetDir, selections);
  }

  // Regenerate config files
  await writeTextFile(
    join(targetDir, "next.config.ts"),
    generateNextConfig(selections),
  );
  await writeTextFile(
    join(targetDir, "tsconfig.json"),
    generateTsConfig(selections),
  );
  await writeTextFile(
    join(targetDir, "eslint.config.mjs"),
    generateEslintConfig(selections),
  );
  await writeTextFile(
    join(targetDir, "config/env.ts"),
    generateEnvConfig(selections),
  );
  await writeTextFile(
    join(targetDir, ".gitignore"),
    generateGitignore(selections),
  );

  // Copy or merge .env.example from addons
  await mergeEnvExample(targetDir, repoRoot, selections);

  await writePackageJson(targetDir, pkg);

  await writeMarker(targetDir, {
    version: 1,
    configuredAt: new Date().toISOString(),
    features: selections,
  });
}

export async function assertCanSetup(
  targetDir: string,
  force?: boolean,
): Promise<void> {
  const marker = await readMarker(targetDir);
  if (marker && !force) {
    throw new Error(
      "Project already configured (.boilerplate.json exists). Run with --force to reconfigure.",
    );
  }
}

export { MARKER_FILE };

async function mergeEnvExample(
  targetDir: string,
  repoRoot: string,
  selections: SetupOptions["selections"],
): Promise<void> {
  const sections: string[] = [];
  const envPath = join(targetDir, ".env.example");
  const existing = await readTextFile(envPath);

  if (selections.sentry) {
    const sentryEnv = await readTextFile(
      join(repoRoot, "addons/sentry/.env.example"),
    );
    if (sentryEnv) sections.push(sentryEnv.trim());
  } else if (existing) {
    sections.push(existing.trim());
  } else {
    sections.push(
      [
        "# App",
        "NEXT_PUBLIC_API_URL=",
        "NEXT_PUBLIC_SITE_URL=http://localhost:3000",
      ].join("\n"),
    );
  }

  if (selections.storybook) {
    const storybookEnv = await readTextFile(
      join(repoRoot, "addons/storybook/.env.example"),
    );
    if (storybookEnv) sections.push(storybookEnv.trim());
  }

  await writeTextFile(envPath, `${sections.join("\n\n")}\n`);
}

async function patchHuskyPrePush(
  targetDir: string,
  selections: SetupOptions["selections"],
): Promise<void> {
  const hooks = [
    "pre-commit",
    "commit-msg",
    "pre-merge-commit",
    "pre-push",
  ] as const;

  for (const hook of hooks) {
    await chmod(join(targetDir, ".husky", hook), 0o755);
  }

  const prePushPath = join(targetDir, ".husky/pre-push");
  const template = await readTextFile(prePushPath);
  if (!template) return;

  const command = selections.lighthouse ? "npm run perf" : "npm run build";
  await writeTextFile(
    prePushPath,
    template.replace("__PRE_PUSH_COMMAND__", command),
  );
  await chmod(prePushPath, 0o755);
}
