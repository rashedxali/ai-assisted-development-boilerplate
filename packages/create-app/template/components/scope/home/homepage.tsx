import HeadingText from "@/components/globals/typography/heading-text";
import { BodyText } from "@/components/globals/typography/body-text";
import { LeadText } from "@/components/globals/typography/lead-text";
import { Button } from "@/components/globals/buttons/button";

const GITHUB_URL =
  "https://github.com/rashedxali/ai-assisted-development-boilerplate";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "LEAD plans",
    description:
      "Reads AGENTS.md and the relevant rules/, names the feature branch, and writes a brief for the developer agent.",
  },
  {
    step: "02",
    title: "Developer builds",
    description:
      "Creates the feature branch, implements the brief with the globals design system, and commits. Husky runs lint and typecheck on commit.",
  },
  {
    step: "03",
    title: "Reviewer audits",
    description:
      "A read-only agent reviews the diff against main for bugs, rule violations, accessibility, security, and performance.",
  },
  {
    step: "04",
    title: "LEAD summarizes",
    description:
      "Reports the branch, what was built, severity-tagged review findings, and whether it is ready for a PR.",
  },
];

const FEATURES = [
  {
    label: "Husky + Commitlint",
    description: "Git hooks for lint, typecheck, commit format, and push guards",
  },
  {
    label: "Lighthouse CI",
    description: "Performance, accessibility, and SEO budgets on every PR",
  },
  {
    label: "GitHub Actions",
    description: "CI workflow that runs the Lighthouse audit on pull requests",
  },
  {
    label: "Fumadocs",
    description: "MDX documentation site served at /docs",
  },
  {
    label: "Agent tooling",
    description: "Claude and Cursor skills, AGENTS.md, and the AI workflow",
  },
  {
    label: "Sentry",
    description: "Error monitoring with lazy Session Replay and source maps",
  },
  {
    label: "Storybook",
    description: "Component stories with Vitest browser tests, a11y, and Chromatic",
  },
  {
    label: "Infisical",
    description: "Secret management that injects env vars into dev scripts",
  },
];

const STACK = [
  { label: "Framework", value: "Next.js 16 — App Router" },
  { label: "UI", value: "React 19" },
  { label: "Language", value: "TypeScript (strict)" },
  { label: "Styling", value: "Tailwind CSS v4" },
  { label: "Components", value: "shadcn/ui — radix-nova" },
  { label: "Tooling", value: "Bun workspaces + create-ai-assisted-app CLI" },
];

const STRUCTURE = [
  { path: "app/", description: "Routes, layouts, API handlers, global CSS" },
  { path: "features/", description: "Full feature modules — actions, queries, schemas, services" },
  { path: "components/globals/", description: "Mandatory typography, button, and input primitives" },
  { path: "components/ui/", description: "shadcn/ui base components" },
  { path: "components/layout/", description: "Header, footer, page chrome" },
  { path: "components/scope/", description: "Route-specific UI without a feature module" },
  { path: "hooks/", description: "Shared custom React hooks" },
  { path: "stores/", description: "Global client state" },
  { path: "services/", description: "Shared domain logic" },
  { path: "config/", description: "Env validation and SEO config" },
  { path: "rules/", description: "Engineering rules every agent follows" },
  { path: "addons/", description: "Optional feature sources applied by setup" },
  { path: "packages/", description: "Setup engine and create-app CLI" },
];

export function Homepage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-16">
      <section className="flex max-w-3xl flex-col gap-6">
        <HeadingText variant="44l">AI-Assisted Development Boilerplate</HeadingText>
        <LeadText variant="16l" className="leading-[150%] text-muted-foreground">
          A production-ready Next.js starter where AI agents plan, build, and
          review features for you — while following your architecture, design
          system, and quality gates.
        </LeadText>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/docs" icon={false}>
            Docs
          </Button>
          <Button
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            icon={false}
            className="bg-muted text-foreground hover:bg-muted/80"
          >
            GitHub
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <BodyText variant="12m" className="uppercase tracking-widest text-muted-foreground">
            Get started
          </BodyText>
          <code className="w-fit max-w-full overflow-x-auto border border-border bg-muted px-4 py-3 font-mono text-[13px] text-foreground">
            npx create-ai-assisted-app my-app
          </code>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <HeadingText variant="24l" as="h2">
            One command, a full agent team
          </HeadingText>
          <BodyText variant="14r" className="leading-[150%] text-muted-foreground">
            A Claude Code skill that turns one prompt into a plan, an
            implementation on a feature branch, and a code review — with
            AGENTS.md and rules/ passed to every agent.
          </BodyText>
          <code className="w-fit max-w-full overflow-x-auto border border-border bg-muted px-4 py-3 font-mono text-[13px] text-foreground">
            /ai-driven-development &lt;feature description&gt;
          </code>
        </div>
        <ol className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((item) => (
            <li key={item.step} className="flex flex-col gap-3 bg-background p-5">
              <BodyText variant="12m" className="text-muted-foreground">
                {item.step}
              </BodyText>
              <BodyText variant="16m" as="h3">
                {item.title}
              </BodyText>
              <BodyText variant="14r" className="leading-[150%] text-muted-foreground">
                {item.description}
              </BodyText>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <HeadingText variant="24l" as="h2">
            Pick your features
          </HeadingText>
          <BodyText variant="14r" className="leading-[150%] text-muted-foreground">
            The setup CLI adds or removes each feature — files, dependencies,
            and scripts — so you only ship what you need.
          </BodyText>
        </div>
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((item) => (
            <div key={item.label} className="flex flex-col gap-2 bg-background p-5">
              <BodyText variant="14m" as="h3">
                {item.label}
              </BodyText>
              <BodyText variant="14r" className="leading-[150%] text-muted-foreground">
                {item.description}
              </BodyText>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <HeadingText variant="24l" as="h2">
          Stack
        </HeadingText>
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 bg-background p-5">
              <BodyText variant="12m" className="uppercase tracking-widest text-muted-foreground">
                {item.label}
              </BodyText>
              <BodyText variant="14m">{item.value}</BodyText>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <HeadingText variant="24l" as="h2">
          Folder structure
        </HeadingText>
        <div className="flex flex-col divide-y divide-border border border-border">
          {STRUCTURE.map((item) => (
            <div
              key={item.path}
              className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <code className="shrink-0 font-mono text-[13px] text-foreground">
                {item.path}
              </code>
              <BodyText variant="14r" className="text-muted-foreground sm:text-right">
                {item.description}
              </BodyText>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
