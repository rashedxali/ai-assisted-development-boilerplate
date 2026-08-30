import type { FeatureSelection } from "./types.js";

export function generateNextConfig(selections: FeatureSelection): string {
  const hasFumadocs = selections.fumadocs;
  const hasSentry = selections.sentry;

  const lines: string[] = ['import type { NextConfig } from "next";'];

  if (hasFumadocs) {
    lines.push('import { createMDX } from "fumadocs-mdx/next";');
  }

  if (hasSentry) {
    lines.push('import { withSentryConfig } from "@sentry/nextjs";');
  }

  lines.push("");
  lines.push("const nextConfig: NextConfig = {");
  lines.push("  reactStrictMode: true,");
  lines.push("};");
  lines.push("");

  let exportExpr = "nextConfig";

  if (hasFumadocs) {
    lines.push("const withMDX = createMDX({});");
    lines.push("");
    exportExpr = "withMDX(nextConfig)";
  }

  if (hasSentry) {
    lines.push("");
    lines.push(`export default withSentryConfig(${exportExpr}, {`);
    lines.push("  org: process.env.SENTRY_ORG,");
    lines.push("  project: process.env.SENTRY_PROJECT,");
    lines.push("  authToken: process.env.SENTRY_AUTH_TOKEN,");
    lines.push('  tunnelRoute: "/monitoring",');
    lines.push("  silent: !process.env.CI,");
    lines.push("});");
    lines.push("");
    return lines.join("\n");
  }

  lines.push(`export default ${exportExpr};`);
  lines.push("");

  return lines.join("\n");
}

export function generateTsConfig(selections: FeatureSelection): string {
  const base = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "react-jsx",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: {
        "@/*": ["./*"],
        ...(selections.fumadocs
          ? { "collections/*": ["./.source/*"] }
          : {}),
      },
    },
    include: [
      "next-env.d.ts",
      "**/*.ts",
      "**/*.tsx",
      ".next/types/**/*.ts",
      ".next/dev/types/**/*.ts",
      "**/*.mts",
    ],
    exclude: ["node_modules"],
  };

  return `${JSON.stringify(base, null, 2)}\n`;
}

export function generateEslintConfig(selections: FeatureSelection): string {
  const ignores = [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ];

  if (selections.fumadocs) {
    ignores.push(".source/**");
  }

  if (selections.storybook) {
    ignores.push("storybook-static/**");
  }

  const ignoreLines = ignores.map((i) => `    "${i}",`).join("\n");

  if (selections.storybook) {
    return `import storybook from "eslint-plugin-storybook";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
${ignoreLines}
  ]),
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
`;
  }

  return `import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
${ignoreLines}
  ]),
]);

export default eslintConfig;
`;
}

export function generateEnvConfig(selections: FeatureSelection): string {
  const sentryBlock = selections.sentry
    ? `
  // Sentry — DSN is public (client + server); org/project drive source-map upload.
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  sentryOrg: process.env.SENTRY_ORG ?? "",
  sentryProject: process.env.SENTRY_PROJECT ?? "",`
    : "";

  return `// Validate and export typed env vars.
// Access process.env ONLY here — never raw in components, hooks, or services.

const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV,${sentryBlock}
} as const;

export default env;
`;
}

export function generateGitignore(selections: FeatureSelection): string {
  const lines = [
    "# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.",
    "",
    "# dependencies",
    "/node_modules",
    "/.pnp",
    ".pnp.*",
    ".yarn/*",
    "!.yarn/patches",
    "!.yarn/plugins",
    "!.yarn/releases",
    "!.yarn/versions",
    "",
    "# testing",
    "/coverage",
    "",
    "# next.js",
    "/.next/",
    "/out/",
    "",
    "# production",
    "/build",
    "",
    "# misc",
    ".DS_Store",
    "*.pem",
    "",
    "# debug",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    ".pnpm-debug.log*",
    "",
    "# env files (can opt-in for committing if needed)",
    ".env*",
    "",
    "# vercel",
    ".vercel",
    "",
    "# typescript",
    "*.tsbuildinfo",
    "next-env.d.ts",
  ];

  if (selections["agent-tooling"]) {
    lines.push("", "# feature team workflow state (local session)", ".cursor/state/");
  }

  if (selections.lighthouse) {
    lines.push("", "# lighthouse ci (generated audit reports)", ".lighthouseci/");
  }

  if (selections.storybook) {
    lines.push("", "# storybook", "storybook-static/");
  }

  if (selections.sentry) {
    lines.push("", "# sentry", ".sentryclirc");
  }

  lines.push("", "# boilerplate setup marker", ".boilerplate.json");

  return `${lines.join("\n")}\n`;
}
