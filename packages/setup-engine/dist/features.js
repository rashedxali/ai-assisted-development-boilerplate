export const FEATURES = [
    {
        id: "husky",
        label: "Husky + Commitlint",
        description: "Git hooks for lint, typecheck, commit format, and push guards",
        defaultEnabled: true,
        kind: "subtract",
        paths: [".husky", "commitlint.config.js"],
        addonPaths: [".husky", "commitlint.config.js"],
        devDependencies: {
            husky: "^9.1.7",
            "@commitlint/cli": "^21.0.1",
            "@commitlint/config-conventional": "^21.0.1",
        },
        scriptKeys: ["prepare"],
        scripts: {
            prepare: "husky",
        },
    },
    {
        id: "lighthouse",
        label: "Lighthouse CI",
        description: "Local and CI performance, accessibility, and SEO audits",
        defaultEnabled: true,
        kind: "subtract",
        paths: [
            "lighthouserc.js",
            "rules/lighthouse-ci.md",
            "content/docs/rules/lighthouse-ci.mdx",
        ],
        devDependencies: {
            "@lhci/cli": "^0.15.1",
        },
        scriptKeys: ["lhci", "perf"],
        scripts: {
            lhci: "NODE_OPTIONS=--no-deprecation lhci autorun",
            perf: "bun run build && bun run lhci",
        },
    },
    {
        id: "github-ci",
        label: "GitHub Actions",
        description: "CI workflows (Lighthouse audit on pull requests)",
        defaultEnabled: true,
        kind: "subtract",
        paths: [".github/workflows/lighthouse.yml"],
    },
    {
        id: "fumadocs",
        label: "Fumadocs",
        description: "Documentation site at /docs with MDX content",
        defaultEnabled: true,
        kind: "subtract",
        paths: [
            "app/docs",
            "content/docs",
            "lib/source.ts",
            "source.config.ts",
            "app/api/search",
            "components/docs",
            ".source",
        ],
        dependencies: {
            "fumadocs-core": "^16.9.3",
            "fumadocs-mdx": "^15.0.11",
            "fumadocs-ui": "^16.9.3",
            "@types/mdx": "^2.0.14",
        },
    },
    {
        id: "agent-tooling",
        label: "Agent tooling",
        description: "Cursor/Claude skills, AGENTS.md, and AI-driven development workflow",
        defaultEnabled: true,
        kind: "subtract",
        paths: [".agents", ".claude", "AGENTS.md", "CLAUDE.md"],
        scriptKeys: ["feature-team"],
        scripts: {
            "feature-team": "bun .cursor/feature-team/src/cli.ts",
        },
    },
    {
        id: "sentry",
        label: "Sentry",
        description: "Error monitoring with lazy Session Replay and source-map upload",
        defaultEnabled: false,
        kind: "add",
        addonPaths: [
            "instrumentation.ts",
            "instrumentation-client.ts",
            "sentry.server.config.ts",
            "sentry.edge.config.ts",
            "app/global-error.tsx",
        ],
        dependencies: {
            "@sentry/nextjs": "^10.57.0",
        },
    },
    {
        id: "storybook",
        label: "Storybook",
        description: "Component stories with Vitest browser tests, a11y, docs, and Chromatic",
        defaultEnabled: false,
        kind: "add",
        addonPaths: [
            ".storybook",
            "vitest.config.ts",
            "vitest.shims.d.ts",
            "components/globals/buttons/button.stories.tsx",
        ],
        devDependencies: {
            storybook: "^10.4.4",
            "@storybook/nextjs-vite": "^10.4.4",
            "@chromatic-com/storybook": "^5.2.1",
            "@storybook/addon-vitest": "^10.4.4",
            "@storybook/addon-a11y": "^10.4.4",
            "@storybook/addon-docs": "^10.4.4",
            "@storybook/addon-mcp": "^0.6.0",
            chromatic: "^16.10.0",
            vite: "^8.0.16",
            "eslint-plugin-storybook": "^10.4.4",
            vitest: "^4.1.8",
            playwright: "^1.60.0",
            "@vitest/browser-playwright": "^4.1.8",
            "@vitest/coverage-v8": "^4.1.8",
        },
        scripts: {
            storybook: "storybook dev -p 6006",
            "build-storybook": "storybook build",
            "deploy-storybook": "bunx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN",
        },
    },
];
export function getDefaultSelections() {
    return Object.fromEntries(FEATURES.map((f) => [f.id, f.defaultEnabled]));
}
export function getFeature(id) {
    return FEATURES.find((f) => f.id === id);
}
